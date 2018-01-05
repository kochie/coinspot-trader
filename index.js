const express = require("express");
const coinspot = require("coinspot-async-api");
const env = require("./env.js");
const walletUtils = require("./wallet.js");
const redis = require("redis");
const bluebird = require("bluebird");
const moment = require("moment");
const init = require("./init.js");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const cointype = "LTC";

const redisClient = redis.createClient({
	host: "redis"
});

const client = coinspot(env.coinspot.key, env.coinspot.secret);

let state = "";

const setup = async () => {
	try {
		const balance = await walletUtils.getWallet(client);
		await redisClient.setAsync("balance", JSON.stringify(balance));

		let audBalance = await redisClient.getAsync("fiat:AUD");
		if (audBalance === null) {
			audBalance = 0;
			await redisClient.setAsync("fiat:AUD", audBalance);
		}
		audBalance = parseFloat(audBalance);
		console.log(audBalance);
		console.log(balance);
		if (audBalance === 0 && balance[cointype.toLowerCase()] > 0) {
			state = "SELL";
			redisClient.setAsync("state", "SELL");
		} else if (audBalance > 0 && balance[cointype.toLowerCase()] === 0) {
			state = "BUY";
			redisClient.setAsync("state", "BUY");
		}
		const [lastSellPrice, lastBuyPrice] = await redisClient.mgetAsync(
			`${cointype}:LastSellPrice`,
			`${cointype}:LastBuyPrice`
		);
		if (lastSellPrice === null) {
			redisClient.setAsync(
				`${cointype}:LastSellPrice`,
				init[cointype].lastSellPrice
			);
		}
		if (lastBuyPrice === null) {
			redisClient.setAsync(
				`${cointype}:LastBuyPrice`,
				init[cointype].lastBuyPrice
			);
		}

		setInterval(pollMarketPrices, 2000);
		setInterval(barter, 1000);
	} catch (error) {
		console.error(error);
		return;
	}
};

const barter = async () => {
	try {
		let [
			audBalance,
			balance,
			lastSellPrice,
			lastBuyPrice
		] = await redisClient.mgetAsync(
			"fiat:AUD",
			"balance",
			`${cointype}:LastSellPrice`,
			`${cointype}:LastBuyPrice`
		);
		balance = JSON.parse(balance);

		switch (state) {
			case "SELL":
				barterSell(balance[cointype.toLowerCase()], lastBuyPrice);
				break;
			case "BUY":
				barterBuy(audBalance, lastSellPrice);
				break;
		}
	} catch (error) {
		console.error(error);
		return;
	}
};

const barterBuy = async (audBalance, lastSellPrice) => {
	const currentBuyPrice = await redisClient.getAsync(`${cointype}:buy`);
	if (currentBuyPrice * (1 + init[cointype].fee) < lastSellPrice) {
		console.log(`buy at ${currentBuyPrice}`);
		console.log(
			`buy ${audBalance /
				currentBuyPrice *
				(1 +
					init[cointype]
						.fee)} ${cointype} for a value of ${audBalance}`
		);

		// BUY
		state = "SELL";
		await redisClient.msetAsync(
			"state",
			"SELL",
			`${cointype}:LastBuyPrice`,
			currentBuyPrice,
			"balance",
			JSON.stringify({
				ltc: currentBuyPrice * audBalance * (1 - init[cointype].fee)
			}),
			"fiat:AUD",
			0
		);
	}
};

const barterSell = async (coinBalance, lastBuyPrice) => {
	const currentSellPrice = await redisClient.getAsync(`${cointype}:sell`);
	if (currentSellPrice > lastBuyPrice * (1 + init[cointype].fee)) {
		console.log(`sell at ${currentSellPrice}`);
		console.log(
			`sell ${coinBalance} ${cointype} for a value of ${currentSellPrice *
				coinBalance *
				(1 - init[cointype].fee)}`
		);

		// SELL
		state = "BUY";
		await redisClient.msetAsync(
			"state",
			"BUY",
			`${cointype}:LastSellPrice`,
			currentSellPrice,
			"fiat:AUD",
			currentSellPrice * coinBalance * (1 - init[cointype].fee),
			"balance",
			JSON.stringify({ ltc: 0 })
		);
	}
};

const pollMarketPrices = async () => {
	try {
		const price = await client.marketrates(cointype);
		redisClient.setAsync(`${cointype}:buy`, price[cointype].buy);
		redisClient.setAsync(`${cointype}:sell`, price[cointype].sell);
		updateEMA(price[cointype].buy, "LTC:buy");
		updateEMA(price[cointype].sell, "LTC:sell");
	} catch (error) {
		console.error(error);
		return;
	}
};

const pollPrices = async () => {
	const prices = await walletUtils.getPrices(client);
	redisClient.lpush(
		"prices",
		JSON.stringify({
			...prices,
			timestamp: moment().valueOf()
		})
	);

	await updateEMA(prices.ltc.last);
	console.log(await redisClient.getAsync("EMA"));
};

const updateEMA = async (price, name) => {
	price = parseFloat(price);
	const alpha = 0.3;
	let EMA = await redisClient.getAsync(`EMA:${name}`);
	EMA = parseFloat(EMA) || price;
	EMA = EMA + alpha * (price - EMA);
	await redisClient.setAsync(`EMA:${name}`, EMA);
};

setup();

/*
LTC

1. Get wallet balances, put on redis
2. Get/Set cash balance, on redis
3. Start Interval (15 seconds)
	3a. Get prices, add to redis list
	3b. Calculate average price.
	3c. If price goes above average || last buy price + fee cost. Sell when about to go down.
	3d. If price drops below sell price by more than fee. Wait
	3e. When price starts to go up. Buy.
	3f. GoTo 3c.
*/
