const getWallet = async client => {
	try {
		const res = await client.balances();
		const json = await res.json();
		return json.balance;
	} catch (error) {
		console.error(error);
		return;
	}
};

const getPrices = async client => {
	try {
		const res = await client.prices();
		const json = await res.json();
		return json.prices;
	} catch (error) {
		console.error(error);
		return;
	}
};

module.exports = { getWallet, getPrices };
