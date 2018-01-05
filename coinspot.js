function sanitizeCssSelectors(selectors, suffix) {
	function processSelector(start, end) {
		function processElementSelector(start, end, last) {
			var classId, elType, element, pseudoSelector, tok;
			for (
				element = "",
					end > start &&
						((tok = selectors[start].toLowerCase()),
						("*" === tok ||
							("body" === tok && start + 1 !== end && !last) ||
							("number" ==
								typeof (elType = html4.ELEMENTS[tok]) &&
								!(elType & html4.eflags.UNSAFE))) &&
							(++start, (element = tok))),
					classId = "";
				end > start;

			) {
				if (((tok = selectors[start]), "#" === tok.charAt(0))) {
					if (/^#_|__$|[^#0-9A-Za-z:_\-]/.test(tok)) return null;
					classId += tok + "-" + suffix;
				} else {
					if ("." !== tok) break;
					if (
						!(
							++start < end &&
							/^[0-9A-Za-z:_\-]+$/.test((tok = selectors[start]))
						) ||
						/^_|__$/.test(tok)
					)
						return null;
					classId += "." + tok;
				}
				++start;
			}
			if (
				((pseudoSelector = ""),
				end > start &&
					":" === selectors[start] &&
					((tok = selectors[++start]),
					"visited" === tok || "link" === tok))
			) {
				if (!/^[a*]?$/.test(element)) return null;
				(historySensitive = !0),
					(pseudoSelector = ":" + tok),
					(element = "a"),
					++start;
			}
			return start === end ? element + classId + pseudoSelector : null;
		}
		var elSelector,
			i,
			isChild,
			lastOperator,
			out,
			safeSelector,
			tok,
			historySensitive = !1;
		for (
			" " === selectors[start] && ++start,
				end - 1 !== start && " " === selectors[end] && --end,
				out = [],
				lastOperator = start,
				elSelector = "",
				i = start;
			end > i;
			++i
		)
			if (
				((tok = selectors[i]),
				(isChild = ">" === tok),
				isChild || " " === tok)
			) {
				if (
					((elSelector = processElementSelector(lastOperator, i, !1)),
					!elSelector || (isChild && /^html/i.test(elSelector)))
				)
					return;
				(lastOperator = i + 1),
					out.push(elSelector, isChild ? " > " : " ");
			}
		(elSelector = processElementSelector(lastOperator, end, !0)),
			elSelector &&
				(out.push(elSelector),
				(safeSelector = out.join("")),
				(safeSelector = /^body\b/.test(safeSelector)
					? ".vdoc-body___." + suffix + safeSelector.substring(4)
					: "." + suffix + " " + safeSelector),
				(historySensitive
					? historySensitiveSelectors
					: historyInsensitiveSelectors
				).push(safeSelector));
	}
	var i,
		n,
		start,
		historySensitiveSelectors = [],
		historyInsensitiveSelectors = [],
		k = 0;
	for (i = 0; i < selectors.length; ++i)
		(" " == selectors[i] &&
			(">" == selectors[i - 1] || ">" == selectors[i + 1])) ||
			(selectors[k++] = selectors[i]);
	for (
		selectors.length = k, n = selectors.length, start = 0, i = 0;
		n > i;
		++i
	)
		"," == selectors[i] && (processSelector(start, i), (start = i + 1));
	return (
		processSelector(start, n),
		[historyInsensitiveSelectors, historySensitiveSelectors]
	);
}
if (
	((function(e, t) {
		function M(e) {
			var t = e.length,
				n = x.type(e);
			return x.isWindow(e)
				? !1
				: 1 === e.nodeType && t
					? !0
					: "array" === n ||
						("function" !== n &&
							(0 === t ||
								("number" == typeof t && t > 0 && t - 1 in e)));
		}
		function F(e) {
			var t = (O[e] = {});
			return (
				x.each(e.match(T) || [], function(e, n) {
					t[n] = !0;
				}),
				t
			);
		}
		function R(e, n, r, i) {
			if (x.acceptData(e)) {
				var o,
					a,
					s = x.expando,
					l = e.nodeType,
					u = l ? x.cache : e,
					c = l ? e[s] : e[s] && s;
				if (
					(c && u[c] && (i || u[c].data)) ||
					r !== t ||
					"string" != typeof n
				)
					return (
						c || (c = l ? (e[s] = p.pop() || x.guid++) : s),
						u[c] || (u[c] = l ? {} : { toJSON: x.noop }),
						("object" == typeof n || "function" == typeof n) &&
							(i
								? (u[c] = x.extend(u[c], n))
								: (u[c].data = x.extend(u[c].data, n))),
						(a = u[c]),
						i || (a.data || (a.data = {}), (a = a.data)),
						r !== t && (a[x.camelCase(n)] = r),
						"string" == typeof n
							? ((o = a[n]), null == o && (o = a[x.camelCase(n)]))
							: (o = a),
						o
					);
			}
		}
		function W(e, t, n) {
			if (x.acceptData(e)) {
				var r,
					i,
					o = e.nodeType,
					a = o ? x.cache : e,
					s = o ? e[x.expando] : x.expando;
				if (a[s]) {
					if (t && (r = n ? a[s] : a[s].data)) {
						x.isArray(t)
							? (t = t.concat(x.map(t, x.camelCase)))
							: t in r
								? (t = [t])
								: ((t = x.camelCase(t)),
									(t = t in r ? [t] : t.split(" "))),
							(i = t.length);
						for (; i--; ) delete r[t[i]];
						if (n ? !I(r) : !x.isEmptyObject(r)) return;
					}
					(n || (delete a[s].data, I(a[s]))) &&
						(o
							? x.cleanData([e], !0)
							: x.support.deleteExpando || a != a.window
								? delete a[s]
								: (a[s] = null));
				}
			}
		}
		function $(e, n, r) {
			if (r === t && 1 === e.nodeType) {
				var i = "data-" + n.replace(P, "-$1").toLowerCase();
				if (((r = e.getAttribute(i)), "string" == typeof r)) {
					try {
						r =
							"true" === r
								? !0
								: "false" === r
									? !1
									: "null" === r
										? null
										: +r + "" === r
											? +r
											: B.test(r) ? x.parseJSON(r) : r;
					} catch (o) {}
					x.data(e, n, r);
				} else r = t;
			}
			return r;
		}
		function I(e) {
			var t;
			for (t in e)
				if (("data" !== t || !x.isEmptyObject(e[t])) && "toJSON" !== t)
					return !1;
			return !0;
		}
		function it() {
			return !0;
		}
		function ot() {
			return !1;
		}
		function at() {
			try {
				return a.activeElement;
			} catch (e) {}
		}
		function pt(e, t) {
			do e = e[t];
			while (e && 1 !== e.nodeType);
			return e;
		}
		function ft(e, t, n) {
			if (x.isFunction(t))
				return x.grep(e, function(e, r) {
					return !!t.call(e, r, e) !== n;
				});
			if (t.nodeType)
				return x.grep(e, function(e) {
					return (e === t) !== n;
				});
			if ("string" == typeof t) {
				if (st.test(t)) return x.filter(t, e, n);
				t = x.filter(t, e);
			}
			return x.grep(e, function(e) {
				return x.inArray(e, t) >= 0 !== n;
			});
		}
		function dt(e) {
			var t = ht.split("|"),
				n = e.createDocumentFragment();
			if (n.createElement) for (; t.length; ) n.createElement(t.pop());
			return n;
		}
		function Lt(e, t) {
			return x.nodeName(e, "table") &&
				x.nodeName(1 === t.nodeType ? t : t.firstChild, "tr")
				? e.getElementsByTagName("tbody")[0] ||
						e.appendChild(e.ownerDocument.createElement("tbody"))
				: e;
		}
		function Ht(e) {
			return (
				(e.type = (null !== x.find.attr(e, "type")) + "/" + e.type), e
			);
		}
		function qt(e) {
			var t = Et.exec(e.type);
			return t ? (e.type = t[1]) : e.removeAttribute("type"), e;
		}
		function _t(e, t) {
			for (var n, r = 0; null != (n = e[r]); r++)
				x._data(n, "globalEval", !t || x._data(t[r], "globalEval"));
		}
		function Mt(e, t) {
			if (1 === t.nodeType && x.hasData(e)) {
				var n,
					r,
					i,
					o = x._data(e),
					a = x._data(t, o),
					s = o.events;
				if (s) {
					delete a.handle, (a.events = {});
					for (n in s)
						for (r = 0, i = s[n].length; i > r; r++)
							x.event.add(t, n, s[n][r]);
				}
				a.data && (a.data = x.extend({}, a.data));
			}
		}
		function Ot(e, t) {
			var n, r, i;
			if (1 === t.nodeType) {
				if (
					((n = t.nodeName.toLowerCase()),
					!x.support.noCloneEvent && t[x.expando])
				) {
					i = x._data(t);
					for (r in i.events) x.removeEvent(t, r, i.handle);
					t.removeAttribute(x.expando);
				}
				"script" === n && t.text !== e.text
					? ((Ht(t).text = e.text), qt(t))
					: "object" === n
						? (t.parentNode && (t.outerHTML = e.outerHTML),
							x.support.html5Clone &&
								e.innerHTML &&
								!x.trim(t.innerHTML) &&
								(t.innerHTML = e.innerHTML))
						: "input" === n && Ct.test(e.type)
							? ((t.defaultChecked = t.checked = e.checked),
								t.value !== e.value && (t.value = e.value))
							: "option" === n
								? (t.defaultSelected = t.selected = e.defaultSelected)
								: ("input" === n || "textarea" === n) &&
									(t.defaultValue = e.defaultValue);
			}
		}
		function Ft(e, n) {
			var r,
				o,
				a = 0,
				s =
					typeof e.getElementsByTagName !== i
						? e.getElementsByTagName(n || "*")
						: typeof e.querySelectorAll !== i
							? e.querySelectorAll(n || "*")
							: t;
			if (!s)
				for (s = [], r = e.childNodes || e; null != (o = r[a]); a++)
					!n || x.nodeName(o, n) ? s.push(o) : x.merge(s, Ft(o, n));
			return n === t || (n && x.nodeName(e, n)) ? x.merge([e], s) : s;
		}
		function Bt(e) {
			Ct.test(e.type) && (e.defaultChecked = e.checked);
		}
		function tn(e, t) {
			if (t in e) return t;
			for (
				var n = t.charAt(0).toUpperCase() + t.slice(1),
					r = t,
					i = en.length;
				i--;

			)
				if (((t = en[i] + n), t in e)) return t;
			return r;
		}
		function nn(e, t) {
			return (
				(e = t || e),
				"none" === x.css(e, "display") ||
					!x.contains(e.ownerDocument, e)
			);
		}
		function rn(e, t) {
			for (var n, r, i, o = [], a = 0, s = e.length; s > a; a++)
				(r = e[a]),
					r.style &&
						((o[a] = x._data(r, "olddisplay")),
						(n = r.style.display),
						t
							? (o[a] || "none" !== n || (r.style.display = ""),
								"" === r.style.display &&
									nn(r) &&
									(o[a] = x._data(
										r,
										"olddisplay",
										ln(r.nodeName)
									)))
							: o[a] ||
								((i = nn(r)),
								((n && "none" !== n) || !i) &&
									x._data(
										r,
										"olddisplay",
										i ? n : x.css(r, "display")
									)));
			for (a = 0; s > a; a++)
				(r = e[a]),
					r.style &&
						((t &&
							"none" !== r.style.display &&
							"" !== r.style.display) ||
							(r.style.display = t ? o[a] || "" : "none"));
			return e;
		}
		function on(e, t, n) {
			var r = Vt.exec(t);
			return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t;
		}
		function an(e, t, n, r, i) {
			for (
				var o =
						n === (r ? "border" : "content")
							? 4
							: "width" === t ? 1 : 0,
					a = 0;
				4 > o;
				o += 2
			)
				"margin" === n && (a += x.css(e, n + Zt[o], !0, i)),
					r
						? ("content" === n &&
								(a -= x.css(e, "padding" + Zt[o], !0, i)),
							"margin" !== n &&
								(a -= x.css(
									e,
									"border" + Zt[o] + "Width",
									!0,
									i
								)))
						: ((a += x.css(e, "padding" + Zt[o], !0, i)),
							"padding" !== n &&
								(a += x.css(
									e,
									"border" + Zt[o] + "Width",
									!0,
									i
								)));
			return a;
		}
		function sn(e, t, n) {
			var r = !0,
				i = "width" === t ? e.offsetWidth : e.offsetHeight,
				o = Rt(e),
				a =
					x.support.boxSizing &&
					"border-box" === x.css(e, "boxSizing", !1, o);
			if (0 >= i || null == i) {
				if (
					((i = Wt(e, t, o)),
					(0 > i || null == i) && (i = e.style[t]),
					Yt.test(i))
				)
					return i;
				(r = a && (x.support.boxSizingReliable || i === e.style[t])),
					(i = parseFloat(i) || 0);
			}
			return i + an(e, t, n || (a ? "border" : "content"), r, o) + "px";
		}
		function ln(e) {
			var t = a,
				n = Gt[e];
			return (
				n ||
					((n = un(e, t)),
					("none" !== n && n) ||
						((Pt = (
							Pt ||
							x(
								"<iframe frameborder='0' width='0' height='0'/>"
							).css("cssText", "display:block !important")
						).appendTo(t.documentElement)),
						(t = (Pt[0].contentWindow || Pt[0].contentDocument)
							.document),
						t.write("<!doctype html><html><body>"),
						t.close(),
						(n = un(e, t)),
						Pt.detach()),
					(Gt[e] = n)),
				n
			);
		}
		function un(e, t) {
			var n = x(t.createElement(e)).appendTo(t.body),
				r = x.css(n[0], "display");
			return n.remove(), r;
		}
		function gn(e, t, n, r) {
			var i;
			if (x.isArray(t))
				x.each(t, function(t, i) {
					n || pn.test(e)
						? r(e, i)
						: gn(
								e + "[" + ("object" == typeof i ? t : "") + "]",
								i,
								n,
								r
							);
				});
			else if (n || "object" !== x.type(t)) r(e, t);
			else for (i in t) gn(e + "[" + i + "]", t[i], n, r);
		}
		function Hn(e) {
			return function(t, n) {
				"string" != typeof t && ((n = t), (t = "*"));
				var r,
					i = 0,
					o = t.toLowerCase().match(T) || [];
				if (x.isFunction(n))
					for (; (r = o[i++]); )
						"+" === r[0]
							? ((r = r.slice(1) || "*"),
								(e[r] = e[r] || []).unshift(n))
							: (e[r] = e[r] || []).push(n);
			};
		}
		function qn(e, n, r, i) {
			function s(l) {
				var u;
				return (
					(o[l] = !0),
					x.each(e[l] || [], function(e, l) {
						var c = l(n, r, i);
						return "string" != typeof c || a || o[c]
							? a ? !(u = c) : t
							: (n.dataTypes.unshift(c), s(c), !1);
					}),
					u
				);
			}
			var o = {},
				a = e === jn;
			return s(n.dataTypes[0]) || (!o["*"] && s("*"));
		}
		function _n(e, n) {
			var r,
				i,
				o = x.ajaxSettings.flatOptions || {};
			for (i in n) n[i] !== t && ((o[i] ? e : r || (r = {}))[i] = n[i]);
			return r && x.extend(!0, e, r), e;
		}
		function Mn(e, n, r) {
			for (
				var i, o, a, s, l = e.contents, u = e.dataTypes;
				"*" === u[0];

			)
				u.shift(),
					o === t &&
						(o = e.mimeType || n.getResponseHeader("Content-Type"));
			if (o)
				for (s in l)
					if (l[s] && l[s].test(o)) {
						u.unshift(s);
						break;
					}
			if (u[0] in r) a = u[0];
			else {
				for (s in r) {
					if (!u[0] || e.converters[s + " " + u[0]]) {
						a = s;
						break;
					}
					i || (i = s);
				}
				a = a || i;
			}
			return a ? (a !== u[0] && u.unshift(a), r[a]) : t;
		}
		function On(e, t, n, r) {
			var i,
				o,
				a,
				s,
				l,
				u = {},
				c = e.dataTypes.slice();
			if (c[1])
				for (a in e.converters) u[a.toLowerCase()] = e.converters[a];
			for (o = c.shift(); o; )
				if (
					(e.responseFields[o] && (n[e.responseFields[o]] = t),
					!l &&
						r &&
						e.dataFilter &&
						(t = e.dataFilter(t, e.dataType)),
					(l = o),
					(o = c.shift()))
				)
					if ("*" === o) o = l;
					else if ("*" !== l && l !== o) {
						if (((a = u[l + " " + o] || u["* " + o]), !a))
							for (i in u)
								if (
									((s = i.split(" ")),
									s[1] === o &&
										(a =
											u[l + " " + s[0]] ||
											u["* " + s[0]]))
								) {
									a === !0
										? (a = u[i])
										: u[i] !== !0 &&
											((o = s[0]), c.unshift(s[1]));
									break;
								}
						if (a !== !0)
							if (a && e["throws"]) t = a(t);
							else
								try {
									t = a(t);
								} catch (p) {
									return {
										state: "parsererror",
										error: a
											? p
											: "No conversion from " +
												l +
												" to " +
												o
									};
								}
					}
			return { state: "success", data: t };
		}
		function In() {
			try {
				return new e.XMLHttpRequest();
			} catch (t) {}
		}
		function zn() {
			try {
				return new e.ActiveXObject("Microsoft.XMLHTTP");
			} catch (t) {}
		}
		function Kn() {
			return (
				setTimeout(function() {
					Xn = t;
				}),
				(Xn = x.now())
			);
		}
		function Zn(e, t, n) {
			for (
				var r, i = (Qn[t] || []).concat(Qn["*"]), o = 0, a = i.length;
				a > o;
				o++
			)
				if ((r = i[o].call(n, t, e))) return r;
		}
		function er(e, t, n) {
			var r,
				i,
				o = 0,
				a = Gn.length,
				s = x.Deferred().always(function() {
					delete l.elem;
				}),
				l = function() {
					if (i) return !1;
					for (
						var t = Xn || Kn(),
							n = Math.max(0, u.startTime + u.duration - t),
							r = n / u.duration || 0,
							o = 1 - r,
							a = 0,
							l = u.tweens.length;
						l > a;
						a++
					)
						u.tweens[a].run(o);
					return (
						s.notifyWith(e, [u, o, n]),
						1 > o && l ? n : (s.resolveWith(e, [u]), !1)
					);
				},
				u = s.promise({
					elem: e,
					props: x.extend({}, t),
					opts: x.extend(!0, { specialEasing: {} }, n),
					originalProperties: t,
					originalOptions: n,
					startTime: Xn || Kn(),
					duration: n.duration,
					tweens: [],
					createTween: function(t, n) {
						var r = x.Tween(
							e,
							u.opts,
							t,
							n,
							u.opts.specialEasing[t] || u.opts.easing
						);
						return u.tweens.push(r), r;
					},
					stop: function(t) {
						var n = 0,
							r = t ? u.tweens.length : 0;
						if (i) return this;
						for (i = !0; r > n; n++) u.tweens[n].run(1);
						return (
							t
								? s.resolveWith(e, [u, t])
								: s.rejectWith(e, [u, t]),
							this
						);
					}
				}),
				c = u.props;
			for (tr(c, u.opts.specialEasing); a > o; o++)
				if ((r = Gn[o].call(u, e, c, u.opts))) return r;
			return (
				x.map(c, Zn, u),
				x.isFunction(u.opts.start) && u.opts.start.call(e, u),
				x.fx.timer(
					x.extend(l, { elem: e, anim: u, queue: u.opts.queue })
				),
				u
					.progress(u.opts.progress)
					.done(u.opts.done, u.opts.complete)
					.fail(u.opts.fail)
					.always(u.opts.always)
			);
		}
		function tr(e, t) {
			var n, r, i, o, a;
			for (n in e)
				if (
					((r = x.camelCase(n)),
					(i = t[r]),
					(o = e[n]),
					x.isArray(o) && ((i = o[1]), (o = e[n] = o[0])),
					n !== r && ((e[r] = o), delete e[n]),
					(a = x.cssHooks[r]),
					a && "expand" in a)
				) {
					(o = a.expand(o)), delete e[r];
					for (n in o) n in e || ((e[n] = o[n]), (t[n] = i));
				} else t[r] = i;
		}
		function nr(e, t, n) {
			var r,
				i,
				o,
				a,
				s,
				l,
				u = this,
				c = {},
				p = e.style,
				f = e.nodeType && nn(e),
				d = x._data(e, "fxshow");
			n.queue ||
				((s = x._queueHooks(e, "fx")),
				null == s.unqueued &&
					((s.unqueued = 0),
					(l = s.empty.fire),
					(s.empty.fire = function() {
						s.unqueued || l();
					})),
				s.unqueued++,
				u.always(function() {
					u.always(function() {
						s.unqueued--, x.queue(e, "fx").length || s.empty.fire();
					});
				})),
				1 === e.nodeType &&
					("height" in t || "width" in t) &&
					((n.overflow = [p.overflow, p.overflowX, p.overflowY]),
					"inline" === x.css(e, "display") &&
						"none" === x.css(e, "float") &&
						(x.support.inlineBlockNeedsLayout &&
						"inline" !== ln(e.nodeName)
							? (p.zoom = 1)
							: (p.display = "inline-block"))),
				n.overflow &&
					((p.overflow = "hidden"),
					x.support.shrinkWrapBlocks ||
						u.always(function() {
							(p.overflow = n.overflow[0]),
								(p.overflowX = n.overflow[1]),
								(p.overflowY = n.overflow[2]);
						}));
			for (r in t)
				if (((i = t[r]), Vn.exec(i))) {
					if (
						(delete t[r],
						(o = o || "toggle" === i),
						i === (f ? "hide" : "show"))
					)
						continue;
					c[r] = (d && d[r]) || x.style(e, r);
				}
			if (!x.isEmptyObject(c)) {
				d
					? "hidden" in d && (f = d.hidden)
					: (d = x._data(e, "fxshow", {})),
					o && (d.hidden = !f),
					f
						? x(e).show()
						: u.done(function() {
								x(e).hide();
							}),
					u.done(function() {
						var t;
						x._removeData(e, "fxshow");
						for (t in c) x.style(e, t, c[t]);
					});
				for (r in c)
					(a = Zn(f ? d[r] : 0, r, u)),
						r in d ||
							((d[r] = a.start),
							f &&
								((a.end = a.start),
								(a.start =
									"width" === r || "height" === r ? 1 : 0)));
			}
		}
		function rr(e, t, n, r, i) {
			return new rr.prototype.init(e, t, n, r, i);
		}
		function ir(e, t) {
			var n,
				r = { height: e },
				i = 0;
			for (t = t ? 1 : 0; 4 > i; i += 2 - t)
				(n = Zt[i]), (r["margin" + n] = r["padding" + n] = e);
			return t && (r.opacity = r.width = e), r;
		}
		function or(e) {
			return x.isWindow(e)
				? e
				: 9 === e.nodeType ? e.defaultView || e.parentWindow : !1;
		}
		var n,
			r,
			i = typeof t,
			o = e.location,
			a = e.document,
			s = a.documentElement,
			l = e.jQuery,
			u = e.$,
			c = {},
			p = [],
			f = "1.10.2",
			d = p.concat,
			h = p.push,
			g = p.slice,
			m = p.indexOf,
			y = c.toString,
			v = c.hasOwnProperty,
			b = f.trim,
			x = function(e, t) {
				return new x.fn.init(e, t, r);
			},
			w = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
			T = /\S+/g,
			C = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
			N = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
			k = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
			E = /^[\],:{}\s]*$/,
			S = /(?:^|:|,)(?:\s*\[)+/g,
			A = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
			j = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
			D = /^-ms-/,
			L = /-([\da-z])/gi,
			H = function(e, t) {
				return t.toUpperCase();
			},
			q = function(e) {
				(a.addEventListener ||
					"load" === e.type ||
					"complete" === a.readyState) &&
					(_(), x.ready());
			},
			_ = function() {
				a.addEventListener
					? (a.removeEventListener("DOMContentLoaded", q, !1),
						e.removeEventListener("load", q, !1))
					: (a.detachEvent("onreadystatechange", q),
						e.detachEvent("onload", q));
			};
		(x.fn = x.prototype = {
			jquery: f,
			constructor: x,
			init: function(e, n, r) {
				var i, o;
				if (!e) return this;
				if ("string" == typeof e) {
					if (
						((i =
							"<" === e.charAt(0) &&
							">" === e.charAt(e.length - 1) &&
							e.length >= 3
								? [null, e, null]
								: N.exec(e)),
						!i || (!i[1] && n))
					)
						return !n || n.jquery
							? (n || r).find(e)
							: this.constructor(n).find(e);
					if (i[1]) {
						if (
							((n = n instanceof x ? n[0] : n),
							x.merge(
								this,
								x.parseHTML(
									i[1],
									n && n.nodeType ? n.ownerDocument || n : a,
									!0
								)
							),
							k.test(i[1]) && x.isPlainObject(n))
						)
							for (i in n)
								x.isFunction(this[i])
									? this[i](n[i])
									: this.attr(i, n[i]);
						return this;
					}
					if (((o = a.getElementById(i[2])), o && o.parentNode)) {
						if (o.id !== i[2]) return r.find(e);
						(this.length = 1), (this[0] = o);
					}
					return (this.context = a), (this.selector = e), this;
				}
				return e.nodeType
					? ((this.context = this[0] = e), (this.length = 1), this)
					: x.isFunction(e)
						? r.ready(e)
						: (e.selector !== t &&
								((this.selector = e.selector),
								(this.context = e.context)),
							x.makeArray(e, this));
			},
			selector: "",
			length: 0,
			toArray: function() {
				return g.call(this);
			},
			get: function(e) {
				return null == e
					? this.toArray()
					: 0 > e ? this[this.length + e] : this[e];
			},
			pushStack: function(e) {
				var t = x.merge(this.constructor(), e);
				return (t.prevObject = this), (t.context = this.context), t;
			},
			each: function(e, t) {
				return x.each(this, e, t);
			},
			ready: function(e) {
				return x.ready.promise().done(e), this;
			},
			slice: function() {
				return this.pushStack(g.apply(this, arguments));
			},
			first: function() {
				return this.eq(0);
			},
			last: function() {
				return this.eq(-1);
			},
			eq: function(e) {
				var t = this.length,
					n = +e + (0 > e ? t : 0);
				return this.pushStack(n >= 0 && t > n ? [this[n]] : []);
			},
			map: function(e) {
				return this.pushStack(
					x.map(this, function(t, n) {
						return e.call(t, n, t);
					})
				);
			},
			end: function() {
				return this.prevObject || this.constructor(null);
			},
			push: h,
			sort: [].sort,
			splice: [].splice
		}),
			(x.fn.init.prototype = x.fn),
			(x.extend = x.fn.extend = function() {
				var e,
					n,
					r,
					i,
					o,
					a,
					s = arguments[0] || {},
					l = 1,
					u = arguments.length,
					c = !1;
				for (
					"boolean" == typeof s &&
						((c = s), (s = arguments[1] || {}), (l = 2)),
						"object" == typeof s || x.isFunction(s) || (s = {}),
						u === l && ((s = this), --l);
					u > l;
					l++
				)
					if (null != (o = arguments[l]))
						for (i in o)
							(e = s[i]),
								(r = o[i]),
								s !== r &&
									(c &&
									r &&
									(x.isPlainObject(r) || (n = x.isArray(r)))
										? (n
												? ((n = !1),
													(a =
														e && x.isArray(e) ? e : []))
												: (a =
														e && x.isPlainObject(e)
															? e
															: {}),
											(s[i] = x.extend(c, a, r)))
										: r !== t && (s[i] = r));
				return s;
			}),
			x.extend({
				expando: "jQuery" + (f + Math.random()).replace(/\D/g, ""),
				noConflict: function(t) {
					return (
						e.$ === x && (e.$ = u),
						t && e.jQuery === x && (e.jQuery = l),
						x
					);
				},
				isReady: !1,
				readyWait: 1,
				holdReady: function(e) {
					e ? x.readyWait++ : x.ready(!0);
				},
				ready: function(e) {
					if (e === !0 ? !--x.readyWait : !x.isReady) {
						if (!a.body) return setTimeout(x.ready);
						(x.isReady = !0),
							(e !== !0 && --x.readyWait > 0) ||
								(n.resolveWith(a, [x]),
								x.fn.trigger &&
									x(a)
										.trigger("ready")
										.off("ready"));
					}
				},
				isFunction: function(e) {
					return "function" === x.type(e);
				},
				isArray:
					Array.isArray ||
					function(e) {
						return "array" === x.type(e);
					},
				isWindow: function(e) {
					return null != e && e == e.window;
				},
				isNumeric: function(e) {
					return !isNaN(parseFloat(e)) && isFinite(e);
				},
				type: function(e) {
					return null == e
						? e + ""
						: "object" == typeof e || "function" == typeof e
							? c[y.call(e)] || "object"
							: typeof e;
				},
				isPlainObject: function(e) {
					var n;
					if (
						!e ||
						"object" !== x.type(e) ||
						e.nodeType ||
						x.isWindow(e)
					)
						return !1;
					try {
						if (
							e.constructor &&
							!v.call(e, "constructor") &&
							!v.call(e.constructor.prototype, "isPrototypeOf")
						)
							return !1;
					} catch (r) {
						return !1;
					}
					if (x.support.ownLast) for (n in e) return v.call(e, n);
					for (n in e);
					return n === t || v.call(e, n);
				},
				isEmptyObject: function(e) {
					var t;
					for (t in e) return !1;
					return !0;
				},
				error: function(e) {
					throw Error(e);
				},
				parseHTML: function(e, t, n) {
					if (!e || "string" != typeof e) return null;
					"boolean" == typeof t && ((n = t), (t = !1)), (t = t || a);
					var r = k.exec(e),
						i = !n && [];
					return r
						? [t.createElement(r[1])]
						: ((r = x.buildFragment([e], t, i)),
							i && x(i).remove(),
							x.merge([], r.childNodes));
				},
				parseJSON: function(n) {
					return e.JSON && e.JSON.parse
						? e.JSON.parse(n)
						: null === n
							? n
							: "string" == typeof n &&
								((n = x.trim(n)),
								n &&
									E.test(
										n
											.replace(A, "@")
											.replace(j, "]")
											.replace(S, "")
									))
								? Function("return " + n)()
								: (x.error("Invalid JSON: " + n), t);
				},
				parseXML: function(n) {
					var r, i;
					if (!n || "string" != typeof n) return null;
					try {
						e.DOMParser
							? ((i = new DOMParser()),
								(r = i.parseFromString(n, "text/xml")))
							: ((r = new ActiveXObject("Microsoft.XMLDOM")),
								(r.async = "false"),
								r.loadXML(n));
					} catch (o) {
						r = t;
					}
					return (
						(r &&
							r.documentElement &&
							!r.getElementsByTagName("parsererror").length) ||
							x.error("Invalid XML: " + n),
						r
					);
				},
				noop: function() {},
				globalEval: function(t) {
					t &&
						x.trim(t) &&
						(e.execScript ||
							function(t) {
								e.eval.call(e, t);
							})(t);
				},
				camelCase: function(e) {
					return e.replace(D, "ms-").replace(L, H);
				},
				nodeName: function(e, t) {
					return (
						e.nodeName &&
						e.nodeName.toLowerCase() === t.toLowerCase()
					);
				},
				each: function(e, t, n) {
					var r,
						i = 0,
						o = e.length,
						a = M(e);
					if (n) {
						if (a)
							for (
								;
								o > i && ((r = t.apply(e[i], n)), r !== !1);
								i++
							);
						else
							for (i in e)
								if (((r = t.apply(e[i], n)), r === !1)) break;
					} else if (a)
						for (
							;
							o > i && ((r = t.call(e[i], i, e[i])), r !== !1);
							i++
						);
					else
						for (i in e)
							if (((r = t.call(e[i], i, e[i])), r === !1)) break;
					return e;
				},
				trim:
					b && !b.call("\ufeff ")
						? function(e) {
								return null == e ? "" : b.call(e);
							}
						: function(e) {
								return null == e ? "" : (e + "").replace(C, "");
							},
				makeArray: function(e, t) {
					var n = t || [];
					return (
						null != e &&
							(M(Object(e))
								? x.merge(n, "string" == typeof e ? [e] : e)
								: h.call(n, e)),
						n
					);
				},
				inArray: function(e, t, n) {
					var r;
					if (t) {
						if (m) return m.call(t, e, n);
						for (
							r = t.length,
								n = n ? (0 > n ? Math.max(0, r + n) : n) : 0;
							r > n;
							n++
						)
							if (n in t && t[n] === e) return n;
					}
					return -1;
				},
				merge: function(e, n) {
					var r = n.length,
						i = e.length,
						o = 0;
					if ("number" == typeof r) for (; r > o; o++) e[i++] = n[o];
					else for (; n[o] !== t; ) e[i++] = n[o++];
					return (e.length = i), e;
				},
				grep: function(e, t, n) {
					var r,
						i = [],
						o = 0,
						a = e.length;
					for (n = !!n; a > o; o++)
						(r = !!t(e[o], o)), n !== r && i.push(e[o]);
					return i;
				},
				map: function(e, t, n) {
					var r,
						i = 0,
						o = e.length,
						a = M(e),
						s = [];
					if (a)
						for (; o > i; i++)
							(r = t(e[i], i, n)), null != r && (s[s.length] = r);
					else
						for (i in e)
							(r = t(e[i], i, n)), null != r && (s[s.length] = r);
					return d.apply([], s);
				},
				guid: 1,
				proxy: function(e, n) {
					var r, i, o;
					return (
						"string" == typeof n && ((o = e[n]), (n = e), (e = o)),
						x.isFunction(e)
							? ((r = g.call(arguments, 2)),
								(i = function() {
									return e.apply(
										n || this,
										r.concat(g.call(arguments))
									);
								}),
								(i.guid = e.guid = e.guid || x.guid++),
								i)
							: t
					);
				},
				access: function(e, n, r, i, o, a, s) {
					var l = 0,
						u = e.length,
						c = null == r;
					if ("object" === x.type(r)) {
						o = !0;
						for (l in r) x.access(e, n, l, r[l], !0, a, s);
					} else if (
						i !== t &&
						((o = !0),
						x.isFunction(i) || (s = !0),
						c &&
							(s
								? (n.call(e, i), (n = null))
								: ((c = n),
									(n = function(e, t, n) {
										return c.call(x(e), n);
									}))),
						n)
					)
						for (; u > l; l++)
							n(e[l], r, s ? i : i.call(e[l], l, n(e[l], r)));
					return o ? e : c ? n.call(e) : u ? n(e[0], r) : a;
				},
				now: function() {
					return new Date().getTime();
				},
				swap: function(e, t, n, r) {
					var i,
						o,
						a = {};
					for (o in t) (a[o] = e.style[o]), (e.style[o] = t[o]);
					i = n.apply(e, r || []);
					for (o in t) e.style[o] = a[o];
					return i;
				}
			}),
			(x.ready.promise = function(t) {
				if (!n)
					if (((n = x.Deferred()), "complete" === a.readyState))
						setTimeout(x.ready);
					else if (a.addEventListener)
						a.addEventListener("DOMContentLoaded", q, !1),
							e.addEventListener("load", q, !1);
					else {
						a.attachEvent("onreadystatechange", q),
							e.attachEvent("onload", q);
						var r = !1;
						try {
							r = null == e.frameElement && a.documentElement;
						} catch (i) {}
						r &&
							r.doScroll &&
							(function o() {
								if (!x.isReady) {
									try {
										r.doScroll("left");
									} catch (e) {
										return setTimeout(o, 50);
									}
									_(), x.ready();
								}
							})();
					}
				return n.promise(t);
			}),
			x.each(
				"Boolean Number String Function Array Date RegExp Object Error".split(
					" "
				),
				function(e, t) {
					c["[object " + t + "]"] = t.toLowerCase();
				}
			),
			(r = x(a)),
			(function(e, t) {
				function at(e, t, n, i) {
					var o, a, s, l, u, c, d, m, y, x;
					if (
						((t ? t.ownerDocument || t : w) !== f && p(t),
						(t = t || f),
						(n = n || []),
						!e || "string" != typeof e)
					)
						return n;
					if (1 !== (l = t.nodeType) && 9 !== l) return [];
					if (h && !i) {
						if ((o = Z.exec(e)))
							if ((s = o[1])) {
								if (9 === l) {
									if (
										((a = t.getElementById(s)),
										!a || !a.parentNode)
									)
										return n;
									if (a.id === s) return n.push(a), n;
								} else if (
									t.ownerDocument &&
									(a = t.ownerDocument.getElementById(s)) &&
									v(t, a) &&
									a.id === s
								)
									return n.push(a), n;
							} else {
								if (o[2])
									return (
										M.apply(n, t.getElementsByTagName(e)), n
									);
								if (
									(s = o[3]) &&
									r.getElementsByClassName &&
									t.getElementsByClassName
								)
									return (
										M.apply(n, t.getElementsByClassName(s)),
										n
									);
							}
						if (r.qsa && (!g || !g.test(e))) {
							if (
								((m = d = b),
								(y = t),
								(x = 9 === l && e),
								1 === l &&
									"object" !== t.nodeName.toLowerCase())
							) {
								for (
									c = mt(e),
										(d = t.getAttribute("id"))
											? (m = d.replace(nt, "\\$&"))
											: t.setAttribute("id", m),
										m = "[id='" + m + "'] ",
										u = c.length;
									u--;

								)
									c[u] = m + yt(c[u]);
								(y = (V.test(e) && t.parentNode) || t),
									(x = c.join(","));
							}
							if (x)
								try {
									return M.apply(n, y.querySelectorAll(x)), n;
								} catch (T) {
								} finally {
									d || t.removeAttribute("id");
								}
						}
					}
					return kt(e.replace(z, "$1"), t, n, i);
				}
				function st() {
					function t(n, r) {
						return (
							e.push((n += " ")) > o.cacheLength &&
								delete t[e.shift()],
							(t[n] = r)
						);
					}
					var e = [];
					return t;
				}
				function lt(e) {
					return (e[b] = !0), e;
				}
				function ut(e) {
					var t = f.createElement("div");
					try {
						return !!e(t);
					} catch (n) {
						return !1;
					} finally {
						t.parentNode && t.parentNode.removeChild(t), (t = null);
					}
				}
				function ct(e, t) {
					for (var n = e.split("|"), r = e.length; r--; )
						o.attrHandle[n[r]] = t;
				}
				function pt(e, t) {
					var n = t && e,
						r =
							n &&
							1 === e.nodeType &&
							1 === t.nodeType &&
							(~t.sourceIndex || D) - (~e.sourceIndex || D);
					if (r) return r;
					if (n) for (; (n = n.nextSibling); ) if (n === t) return -1;
					return e ? 1 : -1;
				}
				function ft(e) {
					return function(t) {
						var n = t.nodeName.toLowerCase();
						return "input" === n && t.type === e;
					};
				}
				function dt(e) {
					return function(t) {
						var n = t.nodeName.toLowerCase();
						return (
							("input" === n || "button" === n) && t.type === e
						);
					};
				}
				function ht(e) {
					return lt(function(t) {
						return (
							(t = +t),
							lt(function(n, r) {
								for (
									var i, o = e([], n.length, t), a = o.length;
									a--;

								)
									n[(i = o[a])] && (n[i] = !(r[i] = n[i]));
							})
						);
					});
				}
				function gt() {}
				function mt(e, t) {
					var n,
						r,
						i,
						a,
						s,
						l,
						u,
						c = k[e + " "];
					if (c) return t ? 0 : c.slice(0);
					for (s = e, l = [], u = o.preFilter; s; ) {
						(!n || (r = X.exec(s))) &&
							(r && (s = s.slice(r[0].length) || s),
							l.push((i = []))),
							(n = !1),
							(r = U.exec(s)) &&
								((n = r.shift()),
								i.push({
									value: n,
									type: r[0].replace(z, " ")
								}),
								(s = s.slice(n.length)));
						for (a in o.filter)
							!(r = Q[a].exec(s)) ||
								(u[a] && !(r = u[a](r))) ||
								((n = r.shift()),
								i.push({ value: n, type: a, matches: r }),
								(s = s.slice(n.length)));
						if (!n) break;
					}
					return t ? s.length : s ? at.error(e) : k(e, l).slice(0);
				}
				function yt(e) {
					for (var t = 0, n = e.length, r = ""; n > t; t++)
						r += e[t].value;
					return r;
				}
				function vt(e, t, n) {
					var r = t.dir,
						o = n && "parentNode" === r,
						a = C++;
					return t.first
						? function(t, n, i) {
								for (; (t = t[r]); )
									if (1 === t.nodeType || o) return e(t, n, i);
							}
						: function(t, n, s) {
								var l,
									u,
									c,
									p = T + " " + a;
								if (s) {
									for (; (t = t[r]); )
										if ((1 === t.nodeType || o) && e(t, n, s))
											return !0;
								} else
									for (; (t = t[r]); )
										if (1 === t.nodeType || o)
											if (
												((c = t[b] || (t[b] = {})),
												(u = c[r]) && u[0] === p)
											) {
												if ((l = u[1]) === !0 || l === i)
													return l === !0;
											} else if (
												((u = c[r] = [p]),
												(u[1] = e(t, n, s) || i),
												u[1] === !0)
											)
												return !0;
							};
				}
				function bt(e) {
					return e.length > 1
						? function(t, n, r) {
								for (var i = e.length; i--; )
									if (!e[i](t, n, r)) return !1;
								return !0;
							}
						: e[0];
				}
				function xt(e, t, n, r, i) {
					for (
						var o, a = [], s = 0, l = e.length, u = null != t;
						l > s;
						s++
					)
						(o = e[s]) &&
							(!n || n(o, r, i)) &&
							(a.push(o), u && t.push(s));
					return a;
				}
				function wt(e, t, n, r, i, o) {
					return (
						r && !r[b] && (r = wt(r)),
						i && !i[b] && (i = wt(i, o)),
						lt(function(o, a, s, l) {
							var u,
								c,
								p,
								f = [],
								d = [],
								h = a.length,
								g = o || Nt(t || "*", s.nodeType ? [s] : s, []),
								m = !e || (!o && t) ? g : xt(g, f, e, s, l),
								y = n ? (i || (o ? e : h || r) ? [] : a) : m;
							if ((n && n(m, y, s, l), r))
								for (
									u = xt(y, d), r(u, [], s, l), c = u.length;
									c--;

								)
									(p = u[c]) && (y[d[c]] = !(m[d[c]] = p));
							if (o) {
								if (i || e) {
									if (i) {
										for (u = [], c = y.length; c--; )
											(p = y[c]) && u.push((m[c] = p));
										i(null, (y = []), u, l);
									}
									for (c = y.length; c--; )
										(p = y[c]) &&
											(u = i ? F.call(o, p) : f[c]) >
												-1 &&
											(o[u] = !(a[u] = p));
								}
							} else (y = xt(y === a ? y.splice(h, y.length) : y)), i ? i(null, a, y, l) : M.apply(a, y);
						})
					);
				}
				function Tt(e) {
					for (
						var t,
							n,
							r,
							i = e.length,
							a = o.relative[e[0].type],
							s = a || o.relative[" "],
							l = a ? 1 : 0,
							c = vt(
								function(e) {
									return e === t;
								},
								s,
								!0
							),
							p = vt(
								function(e) {
									return F.call(t, e) > -1;
								},
								s,
								!0
							),
							f = [
								function(e, n, r) {
									return (
										(!a && (r || n !== u)) ||
										((t = n).nodeType
											? c(e, n, r)
											: p(e, n, r))
									);
								}
							];
						i > l;
						l++
					)
						if ((n = o.relative[e[l].type])) f = [vt(bt(f), n)];
						else {
							if (
								((n = o.filter[e[l].type].apply(
									null,
									e[l].matches
								)),
								n[b])
							) {
								for (
									r = ++l;
									i > r && !o.relative[e[r].type];
									r++
								);
								return wt(
									l > 1 && bt(f),
									l > 1 &&
										yt(
											e
												.slice(0, l - 1)
												.concat({
													value:
														" " === e[l - 2].type
															? "*"
															: ""
												})
										).replace(z, "$1"),
									n,
									r > l && Tt(e.slice(l, r)),
									i > r && Tt((e = e.slice(r))),
									i > r && yt(e)
								);
							}
							f.push(n);
						}
					return bt(f);
				}
				function Ct(e, t) {
					var n = 0,
						r = t.length > 0,
						a = e.length > 0,
						s = function(s, l, c, p, d) {
							var h,
								g,
								m,
								y = [],
								v = 0,
								b = "0",
								x = s && [],
								w = null != d,
								C = u,
								N =
									s ||
									(a &&
										o.find.TAG(
											"*",
											(d && l.parentNode) || l
										)),
								k = (T += null == C ? 1 : Math.random() || 0.1);
							for (
								w && ((u = l !== f && l), (i = n));
								null != (h = N[b]);
								b++
							) {
								if (a && h) {
									for (g = 0; (m = e[g++]); )
										if (m(h, l, c)) {
											p.push(h);
											break;
										}
									w && ((T = k), (i = ++n));
								}
								r && ((h = !m && h) && v--, s && x.push(h));
							}
							if (((v += b), r && b !== v)) {
								for (g = 0; (m = t[g++]); ) m(x, y, l, c);
								if (s) {
									if (v > 0)
										for (; b--; )
											x[b] || y[b] || (y[b] = q.call(p));
									y = xt(y);
								}
								M.apply(p, y),
									w &&
										!s &&
										y.length > 0 &&
										v + t.length > 1 &&
										at.uniqueSort(p);
							}
							return w && ((T = k), (u = C)), x;
						};
					return r ? lt(s) : s;
				}
				function Nt(e, t, n) {
					for (var r = 0, i = t.length; i > r; r++) at(e, t[r], n);
					return n;
				}
				function kt(e, t, n, i) {
					var a,
						s,
						u,
						c,
						p,
						f = mt(e);
					if (!i && 1 === f.length) {
						if (
							((s = f[0] = f[0].slice(0)),
							s.length > 2 &&
								"ID" === (u = s[0]).type &&
								r.getById &&
								9 === t.nodeType &&
								h &&
								o.relative[s[1].type])
						) {
							if (
								((t = (o.find.ID(
									u.matches[0].replace(rt, it),
									t
								) || [])[0]),
								!t)
							)
								return n;
							e = e.slice(s.shift().value.length);
						}
						for (
							a = Q.needsContext.test(e) ? 0 : s.length;
							a-- && ((u = s[a]), !o.relative[(c = u.type)]);

						)
							if (
								(p = o.find[c]) &&
								(i = p(
									u.matches[0].replace(rt, it),
									(V.test(s[0].type) && t.parentNode) || t
								))
							) {
								if (
									(s.splice(a, 1),
									(e = i.length && yt(s)),
									!e)
								)
									return M.apply(n, i), n;
								break;
							}
					}
					return l(e, f)(i, t, !h, n, V.test(e)), n;
				}
				var n,
					r,
					i,
					o,
					a,
					s,
					l,
					u,
					c,
					p,
					f,
					d,
					h,
					g,
					m,
					y,
					v,
					b = "sizzle" + -new Date(),
					w = e.document,
					T = 0,
					C = 0,
					N = st(),
					k = st(),
					E = st(),
					S = !1,
					A = function(e, t) {
						return e === t ? ((S = !0), 0) : 0;
					},
					j = typeof t,
					D = 1 << 31,
					L = {}.hasOwnProperty,
					H = [],
					q = H.pop,
					_ = H.push,
					M = H.push,
					O = H.slice,
					F =
						H.indexOf ||
						function(e) {
							for (var t = 0, n = this.length; n > t; t++)
								if (this[t] === e) return t;
							return -1;
						},
					B =
						"checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
					P = "[\\x20\\t\\r\\n\\f]",
					R = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
					W = R.replace("w", "w#"),
					$ =
						"\\[" +
						P +
						"*(" +
						R +
						")" +
						P +
						"*(?:([*^$|!~]?=)" +
						P +
						"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" +
						W +
						")|)|)" +
						P +
						"*\\]",
					I =
						":(" +
						R +
						")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" +
						$.replace(3, 8) +
						")*)|.*)\\)|)",
					z = RegExp(
						"^" + P + "+|((?:^|[^\\\\])(?:\\\\.)*)" + P + "+$",
						"g"
					),
					X = RegExp("^" + P + "*," + P + "*"),
					U = RegExp("^" + P + "*([>+~]|" + P + ")" + P + "*"),
					V = RegExp(P + "*[+~]"),
					Y = RegExp("=" + P + "*([^\\]'\"]*)" + P + "*\\]", "g"),
					J = RegExp(I),
					G = RegExp("^" + W + "$"),
					Q = {
						ID: RegExp("^#(" + R + ")"),
						CLASS: RegExp("^\\.(" + R + ")"),
						TAG: RegExp("^(" + R.replace("w", "w*") + ")"),
						ATTR: RegExp("^" + $),
						PSEUDO: RegExp("^" + I),
						CHILD: RegExp(
							"^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
								P +
								"*(even|odd|(([+-]|)(\\d*)n|)" +
								P +
								"*(?:([+-]|)" +
								P +
								"*(\\d+)|))" +
								P +
								"*\\)|)",
							"i"
						),
						bool: RegExp("^(?:" + B + ")$", "i"),
						needsContext: RegExp(
							"^" +
								P +
								"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
								P +
								"*((?:-\\d)?\\d*)" +
								P +
								"*\\)|)(?=[^-]|$)",
							"i"
						)
					},
					K = /^[^{]+\{\s*\[native \w/,
					Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
					et = /^(?:input|select|textarea|button)$/i,
					tt = /^h\d$/i,
					nt = /'|\\/g,
					rt = RegExp(
						"\\\\([\\da-f]{1,6}" + P + "?|(" + P + ")|.)",
						"ig"
					),
					it = function(e, t, n) {
						var r = "0x" + t - 65536;
						return r !== r || n
							? t
							: 0 > r
								? String.fromCharCode(r + 65536)
								: String.fromCharCode(
										55296 | (r >> 10),
										56320 | (1023 & r)
									);
					};
				try {
					M.apply((H = O.call(w.childNodes)), w.childNodes),
						H[w.childNodes.length].nodeType;
				} catch (ot) {
					M = {
						apply: H.length
							? function(e, t) {
									_.apply(e, O.call(t));
								}
							: function(e, t) {
									for (
										var n = e.length, r = 0;
										(e[n++] = t[r++]);

									);
									e.length = n - 1;
								}
					};
				}
				(s = at.isXML = function(e) {
					var t = e && (e.ownerDocument || e).documentElement;
					return t ? "HTML" !== t.nodeName : !1;
				}),
					(r = at.support = {}),
					(p = at.setDocument = function(e) {
						var n = e ? e.ownerDocument || e : w,
							i = n.defaultView;
						return n !== f && 9 === n.nodeType && n.documentElement
							? ((f = n),
								(d = n.documentElement),
								(h = !s(n)),
								i &&
									i.attachEvent &&
									i !== i.top &&
									i.attachEvent("onbeforeunload", function() {
										p();
									}),
								(r.attributes = ut(function(e) {
									return (
										(e.className = "i"),
										!e.getAttribute("className")
									);
								})),
								(r.getElementsByTagName = ut(function(e) {
									return (
										e.appendChild(n.createComment("")),
										!e.getElementsByTagName("*").length
									);
								})),
								(r.getElementsByClassName = ut(function(e) {
									return (
										(e.innerHTML =
											"<div class='a'></div><div class='a i'></div>"),
										(e.firstChild.className = "i"),
										2 === e.getElementsByClassName("i").length
									);
								})),
								(r.getById = ut(function(e) {
									return (
										(d.appendChild(e).id = b),
										!n.getElementsByName ||
											!n.getElementsByName(b).length
									);
								})),
								r.getById
									? ((o.find.ID = function(e, t) {
											if (
												typeof t.getElementById !== j &&
												h
											) {
												var n = t.getElementById(e);
												return n && n.parentNode ? [n] : [];
											}
										}),
										(o.filter.ID = function(e) {
											var t = e.replace(rt, it);
											return function(e) {
												return e.getAttribute("id") === t;
											};
										}))
									: (delete o.find.ID,
										(o.filter.ID = function(e) {
											var t = e.replace(rt, it);
											return function(e) {
												var n =
													typeof e.getAttributeNode !==
														j &&
													e.getAttributeNode("id");
												return n && n.value === t;
											};
										})),
								(o.find.TAG = r.getElementsByTagName
									? function(e, n) {
											return typeof n.getElementsByTagName !==
												j
												? n.getElementsByTagName(e)
												: t;
										}
									: function(e, t) {
											var n,
												r = [],
												i = 0,
												o = t.getElementsByTagName(e);
											if ("*" === e) {
												for (; (n = o[i++]); )
													1 === n.nodeType && r.push(n);
												return r;
											}
											return o;
										}),
								(o.find.CLASS =
									r.getElementsByClassName &&
									function(e, n) {
										return typeof n.getElementsByClassName !==
											j && h
											? n.getElementsByClassName(e)
											: t;
									}),
								(m = []),
								(g = []),
								(r.qsa = K.test(n.querySelectorAll)) &&
									(ut(function(e) {
										(e.innerHTML =
											"<select><option selected=''></option></select>"),
											e.querySelectorAll("[selected]")
												.length ||
												g.push(
													"\\[" +
														P +
														"*(?:value|" +
														B +
														")"
												),
											e.querySelectorAll(":checked")
												.length || g.push(":checked");
									}),
									ut(function(e) {
										var t = n.createElement("input");
										t.setAttribute("type", "hidden"),
											e
												.appendChild(t)
												.setAttribute("t", ""),
											e.querySelectorAll("[t^='']")
												.length &&
												g.push(
													"[*^$]=" + P + "*(?:''|\"\")"
												),
											e.querySelectorAll(":enabled")
												.length ||
												g.push(":enabled", ":disabled"),
											e.querySelectorAll("*,:x"),
											g.push(",.*:");
									})),
								(r.matchesSelector = K.test(
									(y =
										d.webkitMatchesSelector ||
										d.mozMatchesSelector ||
										d.oMatchesSelector ||
										d.msMatchesSelector)
								)) &&
									ut(function(e) {
										(r.disconnectedMatch = y.call(e, "div")),
											y.call(e, "[s!='']:x"),
											m.push("!=", I);
									}),
								(g = g.length && RegExp(g.join("|"))),
								(m = m.length && RegExp(m.join("|"))),
								(v =
									K.test(d.contains) ||
									d.compareDocumentPosition
										? function(e, t) {
												var n =
														9 === e.nodeType
															? e.documentElement
															: e,
													r = t && t.parentNode;
												return (
													e === r ||
													!(
														!r ||
														1 !== r.nodeType ||
														!(n.contains
															? n.contains(r)
															: e.compareDocumentPosition &&
																16 &
																	e.compareDocumentPosition(
																		r
																	))
													)
												);
											}
										: function(e, t) {
												if (t)
													for (; (t = t.parentNode); )
														if (t === e) return !0;
												return !1;
											}),
								(A = d.compareDocumentPosition
									? function(e, t) {
											if (e === t) return (S = !0), 0;
											var i =
												t.compareDocumentPosition &&
												e.compareDocumentPosition &&
												e.compareDocumentPosition(t);
											return i
												? 1 & i ||
													(!r.sortDetached &&
														t.compareDocumentPosition(
															e
														) === i)
													? e === n || v(w, e)
														? -1
														: t === n || v(w, t)
															? 1
															: c
																? F.call(c, e) -
																	F.call(c, t)
																: 0
													: 4 & i ? -1 : 1
												: e.compareDocumentPosition
													? -1
													: 1;
										}
									: function(e, t) {
											var r,
												i = 0,
												o = e.parentNode,
												a = t.parentNode,
												s = [e],
												l = [t];
											if (e === t) return (S = !0), 0;
											if (!o || !a)
												return e === n
													? -1
													: t === n
														? 1
														: o
															? -1
															: a
																? 1
																: c
																	? F.call(c, e) -
																		F.call(c, t)
																	: 0;
											if (o === a) return pt(e, t);
											for (r = e; (r = r.parentNode); )
												s.unshift(r);
											for (r = t; (r = r.parentNode); )
												l.unshift(r);
											for (; s[i] === l[i]; ) i++;
											return i
												? pt(s[i], l[i])
												: s[i] === w
													? -1
													: l[i] === w ? 1 : 0;
										}),
								n)
							: f;
					}),
					(at.matches = function(e, t) {
						return at(e, null, null, t);
					}),
					(at.matchesSelector = function(e, t) {
						if (
							((e.ownerDocument || e) !== f && p(e),
							(t = t.replace(Y, "='$1']")),
							!(
								!r.matchesSelector ||
								!h ||
								(m && m.test(t)) ||
								(g && g.test(t))
							))
						)
							try {
								var n = y.call(e, t);
								if (
									n ||
									r.disconnectedMatch ||
									(e.document && 11 !== e.document.nodeType)
								)
									return n;
							} catch (i) {}
						return at(t, f, null, [e]).length > 0;
					}),
					(at.contains = function(e, t) {
						return (e.ownerDocument || e) !== f && p(e), v(e, t);
					}),
					(at.attr = function(e, n) {
						(e.ownerDocument || e) !== f && p(e);
						var i = o.attrHandle[n.toLowerCase()],
							a =
								i && L.call(o.attrHandle, n.toLowerCase())
									? i(e, n, !h)
									: t;
						return a === t
							? r.attributes || !h
								? e.getAttribute(n)
								: (a = e.getAttributeNode(n)) && a.specified
									? a.value
									: null
							: a;
					}),
					(at.error = function(e) {
						throw Error(
							"Syntax error, unrecognized expression: " + e
						);
					}),
					(at.uniqueSort = function(e) {
						var t,
							n = [],
							i = 0,
							o = 0;
						if (
							((S = !r.detectDuplicates),
							(c = !r.sortStable && e.slice(0)),
							e.sort(A),
							S)
						) {
							for (; (t = e[o++]); )
								t === e[o] && (i = n.push(o));
							for (; i--; ) e.splice(n[i], 1);
						}
						return e;
					}),
					(a = at.getText = function(e) {
						var t,
							n = "",
							r = 0,
							i = e.nodeType;
						if (i) {
							if (1 === i || 9 === i || 11 === i) {
								if ("string" == typeof e.textContent)
									return e.textContent;
								for (e = e.firstChild; e; e = e.nextSibling)
									n += a(e);
							} else if (3 === i || 4 === i) return e.nodeValue;
						} else for (; (t = e[r]); r++) n += a(t);
						return n;
					}),
					(o = at.selectors = {
						cacheLength: 50,
						createPseudo: lt,
						match: Q,
						attrHandle: {},
						find: {},
						relative: {
							">": { dir: "parentNode", first: !0 },
							" ": { dir: "parentNode" },
							"+": { dir: "previousSibling", first: !0 },
							"~": { dir: "previousSibling" }
						},
						preFilter: {
							ATTR: function(e) {
								return (
									(e[1] = e[1].replace(rt, it)),
									(e[3] = (e[4] || e[5] || "").replace(
										rt,
										it
									)),
									"~=" === e[2] && (e[3] = " " + e[3] + " "),
									e.slice(0, 4)
								);
							},
							CHILD: function(e) {
								return (
									(e[1] = e[1].toLowerCase()),
									"nth" === e[1].slice(0, 3)
										? (e[3] || at.error(e[0]),
											(e[4] = +(e[4]
												? e[5] + (e[6] || 1)
												: 2 *
													("even" === e[3] ||
														"odd" === e[3]))),
											(e[5] = +(
												e[7] + e[8] || "odd" === e[3]
											)))
										: e[3] && at.error(e[0]),
									e
								);
							},
							PSEUDO: function(e) {
								var n,
									r = !e[5] && e[2];
								return Q.CHILD.test(e[0])
									? null
									: (e[3] && e[4] !== t
											? (e[2] = e[4])
											: r &&
												J.test(r) &&
												(n = mt(r, !0)) &&
												(n =
													r.indexOf(")", r.length - n) -
													r.length) &&
												((e[0] = e[0].slice(0, n)),
												(e[2] = r.slice(0, n))),
										e.slice(0, 3));
							}
						},
						filter: {
							TAG: function(e) {
								var t = e.replace(rt, it).toLowerCase();
								return "*" === e
									? function() {
											return !0;
										}
									: function(e) {
											return (
												e.nodeName &&
												e.nodeName.toLowerCase() === t
											);
										};
							},
							CLASS: function(e) {
								var t = N[e + " "];
								return (
									t ||
									((t = RegExp(
										"(^|" + P + ")" + e + "(" + P + "|$)"
									)) &&
										N(e, function(e) {
											return t.test(
												("string" ==
													typeof e.className &&
													e.className) ||
													(typeof e.getAttribute !==
														j &&
														e.getAttribute(
															"class"
														)) ||
													""
											);
										}))
								);
							},
							ATTR: function(e, t, n) {
								return function(r) {
									var i = at.attr(r, e);
									return null == i
										? "!=" === t
										: t
											? ((i += ""),
												"=" === t
													? i === n
													: "!=" === t
														? i !== n
														: "^=" === t
															? n && 0 === i.indexOf(n)
															: "*=" === t
																? n && i.indexOf(n) > -1
																: "$=" === t
																	? n &&
																		i.slice(-n.length) ===
																			n
																	: "~=" === t
																		? (
																				" " +
																				i +
																				" "
																			).indexOf(n) > -1
																		: "|=" === t
																			? i === n ||
																				i.slice(
																					0,
																					n.length + 1
																				) ===
																					n + "-"
																			: !1)
											: !0;
								};
							},
							CHILD: function(e, t, n, r, i) {
								var o = "nth" !== e.slice(0, 3),
									a = "last" !== e.slice(-4),
									s = "of-type" === t;
								return 1 === r && 0 === i
									? function(e) {
											return !!e.parentNode;
										}
									: function(t, n, l) {
											var u,
												c,
												p,
												f,
												d,
												h,
												g =
													o !== a
														? "nextSibling"
														: "previousSibling",
												m = t.parentNode,
												y = s && t.nodeName.toLowerCase(),
												v = !l && !s;
											if (m) {
												if (o) {
													for (; g; ) {
														for (p = t; (p = p[g]); )
															if (
																s
																	? p.nodeName.toLowerCase() ===
																		y
																	: 1 ===
																		p.nodeType
															)
																return !1;
														h = g =
															"only" === e &&
															!h &&
															"nextSibling";
													}
													return !0;
												}
												if (
													((h = [
														a
															? m.firstChild
															: m.lastChild
													]),
													a && v)
												) {
													for (
														c = m[b] || (m[b] = {}),
															u = c[e] || [],
															d =
																u[0] === T &&
																u[1],
															f =
																u[0] === T &&
																u[2],
															p =
																d &&
																m.childNodes[d];
														(p =
															(++d && p && p[g]) ||
															(f = d = 0) ||
															h.pop());

													)
														if (
															1 === p.nodeType &&
															++f &&
															p === t
														) {
															c[e] = [T, d, f];
															break;
														}
												} else if (
													v &&
													(u = (t[b] || (t[b] = {}))[
														e
													]) &&
													u[0] === T
												)
													f = u[1];
												else
													for (
														;
														(p =
															(++d && p && p[g]) ||
															(f = d = 0) ||
															h.pop()) &&
														((s
															? p.nodeName.toLowerCase() !==
																y
															: 1 !== p.nodeType) ||
															!++f ||
															(v &&
																((p[b] ||
																	(p[b] = {}))[
																	e
																] = [T, f]),
															p !== t));

													);
												return (
													(f -= i),
													f === r ||
														(0 === f % r &&
															f / r >= 0)
												);
											}
										};
							},
							PSEUDO: function(e, t) {
								var n,
									r =
										o.pseudos[e] ||
										o.setFilters[e.toLowerCase()] ||
										at.error("unsupported pseudo: " + e);
								return r[b]
									? r(t)
									: r.length > 1
										? ((n = [e, e, "", t]),
											o.setFilters.hasOwnProperty(
												e.toLowerCase()
											)
												? lt(function(e, n) {
														for (
															var i,
																o = r(e, t),
																a = o.length;
															a--;

														)
															(i = F.call(e, o[a])),
																(e[i] = !(n[i] =
																	o[a]));
													})
												: function(e) {
														return r(e, 0, n);
													})
										: r;
							}
						},
						pseudos: {
							not: lt(function(e) {
								var t = [],
									n = [],
									r = l(e.replace(z, "$1"));
								return r[b]
									? lt(function(e, t, n, i) {
											for (
												var o,
													a = r(e, null, i, []),
													s = e.length;
												s--;

											)
												(o = a[s]) &&
													(e[s] = !(t[s] = o));
										})
									: function(e, i, o) {
											return (
												(t[0] = e),
												r(t, null, o, n),
												!n.pop()
											);
										};
							}),
							has: lt(function(e) {
								return function(t) {
									return at(e, t).length > 0;
								};
							}),
							contains: lt(function(e) {
								return function(t) {
									return (
										(
											t.textContent ||
											t.innerText ||
											a(t)
										).indexOf(e) > -1
									);
								};
							}),
							lang: lt(function(e) {
								return (
									G.test(e || "") ||
										at.error("unsupported lang: " + e),
									(e = e.replace(rt, it).toLowerCase()),
									function(t) {
										var n;
										do
											if (
												(n = h
													? t.lang
													: t.getAttribute(
															"xml:lang"
														) ||
														t.getAttribute("lang"))
											)
												return (
													(n = n.toLowerCase()),
													n === e ||
														0 === n.indexOf(e + "-")
												);
										while (
											(t = t.parentNode) &&
											1 === t.nodeType
										);
										return !1;
									}
								);
							}),
							target: function(t) {
								var n = e.location && e.location.hash;
								return n && n.slice(1) === t.id;
							},
							root: function(e) {
								return e === d;
							},
							focus: function(e) {
								return (
									e === f.activeElement &&
									(!f.hasFocus || f.hasFocus()) &&
									!!(e.type || e.href || ~e.tabIndex)
								);
							},
							enabled: function(e) {
								return e.disabled === !1;
							},
							disabled: function(e) {
								return e.disabled === !0;
							},
							checked: function(e) {
								var t = e.nodeName.toLowerCase();
								return (
									("input" === t && !!e.checked) ||
									("option" === t && !!e.selected)
								);
							},
							selected: function(e) {
								return (
									e.parentNode && e.parentNode.selectedIndex,
									e.selected === !0
								);
							},
							empty: function(e) {
								for (e = e.firstChild; e; e = e.nextSibling)
									if (
										e.nodeName > "@" ||
										3 === e.nodeType ||
										4 === e.nodeType
									)
										return !1;
								return !0;
							},
							parent: function(e) {
								return !o.pseudos.empty(e);
							},
							header: function(e) {
								return tt.test(e.nodeName);
							},
							input: function(e) {
								return et.test(e.nodeName);
							},
							button: function(e) {
								var t = e.nodeName.toLowerCase();
								return (
									("input" === t && "button" === e.type) ||
									"button" === t
								);
							},
							text: function(e) {
								var t;
								return (
									"input" === e.nodeName.toLowerCase() &&
									"text" === e.type &&
									(null == (t = e.getAttribute("type")) ||
										t.toLowerCase() === e.type)
								);
							},
							first: ht(function() {
								return [0];
							}),
							last: ht(function(e, t) {
								return [t - 1];
							}),
							eq: ht(function(e, t, n) {
								return [0 > n ? n + t : n];
							}),
							even: ht(function(e, t) {
								for (var n = 0; t > n; n += 2) e.push(n);
								return e;
							}),
							odd: ht(function(e, t) {
								for (var n = 1; t > n; n += 2) e.push(n);
								return e;
							}),
							lt: ht(function(e, t, n) {
								for (var r = 0 > n ? n + t : n; --r >= 0; )
									e.push(r);
								return e;
							}),
							gt: ht(function(e, t, n) {
								for (var r = 0 > n ? n + t : n; t > ++r; )
									e.push(r);
								return e;
							})
						}
					}),
					(o.pseudos.nth = o.pseudos.eq);
				for (n in {
					radio: !0,
					checkbox: !0,
					file: !0,
					password: !0,
					image: !0
				})
					o.pseudos[n] = ft(n);
				for (n in { submit: !0, reset: !0 }) o.pseudos[n] = dt(n);
				(gt.prototype = o.filters = o.pseudos),
					(o.setFilters = new gt()),
					(l = at.compile = function(e, t) {
						var n,
							r = [],
							i = [],
							o = E[e + " "];
						if (!o) {
							for (t || (t = mt(e)), n = t.length; n--; )
								(o = Tt(t[n])), o[b] ? r.push(o) : i.push(o);
							o = E(e, Ct(i, r));
						}
						return o;
					}),
					(r.sortStable =
						b
							.split("")
							.sort(A)
							.join("") === b),
					(r.detectDuplicates = S),
					p(),
					(r.sortDetached = ut(function(e) {
						return (
							1 &
							e.compareDocumentPosition(f.createElement("div"))
						);
					})),
					ut(function(e) {
						return (
							(e.innerHTML = "<a href='#'></a>"),
							"#" === e.firstChild.getAttribute("href")
						);
					}) ||
						ct("type|href|height|width", function(e, n, r) {
							return r
								? t
								: e.getAttribute(
										n,
										"type" === n.toLowerCase() ? 1 : 2
									);
						}),
					(r.attributes &&
						ut(function(e) {
							return (
								(e.innerHTML = "<input/>"),
								e.firstChild.setAttribute("value", ""),
								"" === e.firstChild.getAttribute("value")
							);
						})) ||
						ct("value", function(e, n, r) {
							return r || "input" !== e.nodeName.toLowerCase()
								? t
								: e.defaultValue;
						}),
					ut(function(e) {
						return null == e.getAttribute("disabled");
					}) ||
						ct(B, function(e, n, r) {
							var i;
							return r
								? t
								: (i = e.getAttributeNode(n)) && i.specified
									? i.value
									: e[n] === !0 ? n.toLowerCase() : null;
						}),
					(x.find = at),
					(x.expr = at.selectors),
					(x.expr[":"] = x.expr.pseudos),
					(x.unique = at.uniqueSort),
					(x.text = at.getText),
					(x.isXMLDoc = at.isXML),
					(x.contains = at.contains);
			})(e);
		var O = {};
		(x.Callbacks = function(e) {
			e = "string" == typeof e ? O[e] || F(e) : x.extend({}, e);
			var n,
				r,
				i,
				o,
				a,
				s,
				l = [],
				u = !e.once && [],
				c = function(t) {
					for (
						r = e.memory && t,
							i = !0,
							a = s || 0,
							s = 0,
							o = l.length,
							n = !0;
						l && o > a;
						a++
					)
						if (l[a].apply(t[0], t[1]) === !1 && e.stopOnFalse) {
							r = !1;
							break;
						}
					(n = !1),
						l &&
							(u
								? u.length && c(u.shift())
								: r ? (l = []) : p.disable());
				},
				p = {
					add: function() {
						if (l) {
							var t = l.length;
							!(function i(t) {
								x.each(t, function(t, n) {
									var r = x.type(n);
									"function" === r
										? (e.unique && p.has(n)) || l.push(n)
										: n &&
											n.length &&
											"string" !== r &&
											i(n);
								});
							})(arguments),
								n ? (o = l.length) : r && ((s = t), c(r));
						}
						return this;
					},
					remove: function() {
						return (
							l &&
								x.each(arguments, function(e, t) {
									for (var r; (r = x.inArray(t, l, r)) > -1; )
										l.splice(r, 1),
											n && (o >= r && o--, a >= r && a--);
								}),
							this
						);
					},
					has: function(e) {
						return e ? x.inArray(e, l) > -1 : !(!l || !l.length);
					},
					empty: function() {
						return (l = []), (o = 0), this;
					},
					disable: function() {
						return (l = u = r = t), this;
					},
					disabled: function() {
						return !l;
					},
					lock: function() {
						return (u = t), r || p.disable(), this;
					},
					locked: function() {
						return !u;
					},
					fireWith: function(e, t) {
						return (
							!l ||
								(i && !u) ||
								((t = t || []),
								(t = [e, t.slice ? t.slice() : t]),
								n ? u.push(t) : c(t)),
							this
						);
					},
					fire: function() {
						return p.fireWith(this, arguments), this;
					},
					fired: function() {
						return !!i;
					}
				};
			return p;
		}),
			x.extend({
				Deferred: function(e) {
					var t = [
							[
								"resolve",
								"done",
								x.Callbacks("once memory"),
								"resolved"
							],
							[
								"reject",
								"fail",
								x.Callbacks("once memory"),
								"rejected"
							],
							["notify", "progress", x.Callbacks("memory")]
						],
						n = "pending",
						r = {
							state: function() {
								return n;
							},
							always: function() {
								return i.done(arguments).fail(arguments), this;
							},
							then: function() {
								var e = arguments;
								return x
									.Deferred(function(n) {
										x.each(t, function(t, o) {
											var a = o[0],
												s = x.isFunction(e[t]) && e[t];
											i[o[1]](function() {
												var e =
													s &&
													s.apply(this, arguments);
												e && x.isFunction(e.promise)
													? e
															.promise()
															.done(n.resolve)
															.fail(n.reject)
															.progress(n.notify)
													: n[a + "With"](
															this === r
																? n.promise()
																: this,
															s ? [e] : arguments
														);
											});
										}),
											(e = null);
									})
									.promise();
							},
							promise: function(e) {
								return null != e ? x.extend(e, r) : r;
							}
						},
						i = {};
					return (
						(r.pipe = r.then),
						x.each(t, function(e, o) {
							var a = o[2],
								s = o[3];
							(r[o[1]] = a.add),
								s &&
									a.add(
										function() {
											n = s;
										},
										t[1 ^ e][2].disable,
										t[2][2].lock
									),
								(i[o[0]] = function() {
									return (
										i[o[0] + "With"](
											this === i ? r : this,
											arguments
										),
										this
									);
								}),
								(i[o[0] + "With"] = a.fireWith);
						}),
						r.promise(i),
						e && e.call(i, i),
						i
					);
				},
				when: function(e) {
					var s,
						l,
						u,
						t = 0,
						n = g.call(arguments),
						r = n.length,
						i = 1 !== r || (e && x.isFunction(e.promise)) ? r : 0,
						o = 1 === i ? e : x.Deferred(),
						a = function(e, t, n) {
							return function(r) {
								(t[e] = this),
									(n[e] =
										arguments.length > 1
											? g.call(arguments)
											: r),
									n === s
										? o.notifyWith(t, n)
										: --i || o.resolveWith(t, n);
							};
						};
					if (r > 1)
						for (
							s = Array(r), l = Array(r), u = Array(r);
							r > t;
							t++
						)
							n[t] && x.isFunction(n[t].promise)
								? n[t]
										.promise()
										.done(a(t, u, n))
										.fail(o.reject)
										.progress(a(t, l, s))
								: --i;
					return i || o.resolveWith(u, n), o.promise();
				}
			}),
			(x.support = (function(t) {
				var n,
					r,
					o,
					s,
					l,
					u,
					c,
					p,
					f,
					d = a.createElement("div");
				if (
					(d.setAttribute("className", "t"),
					(d.innerHTML =
						"  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"),
					(n = d.getElementsByTagName("*") || []),
					(r = d.getElementsByTagName("a")[0]),
					!r || !r.style || !n.length)
				)
					return t;
				(s = a.createElement("select")),
					(u = s.appendChild(a.createElement("option"))),
					(o = d.getElementsByTagName("input")[0]),
					(r.style.cssText = "top:1px;float:left;opacity:.5"),
					(t.getSetAttribute = "t" !== d.className),
					(t.leadingWhitespace = 3 === d.firstChild.nodeType),
					(t.tbody = !d.getElementsByTagName("tbody").length),
					(t.htmlSerialize = !!d.getElementsByTagName("link").length),
					(t.style = /top/.test(r.getAttribute("style"))),
					(t.hrefNormalized = "/a" === r.getAttribute("href")),
					(t.opacity = /^0.5/.test(r.style.opacity)),
					(t.cssFloat = !!r.style.cssFloat),
					(t.checkOn = !!o.value),
					(t.optSelected = u.selected),
					(t.enctype = !!a.createElement("form").enctype),
					(t.html5Clone =
						"<:nav></:nav>" !==
						a.createElement("nav").cloneNode(!0).outerHTML),
					(t.inlineBlockNeedsLayout = !1),
					(t.shrinkWrapBlocks = !1),
					(t.pixelPosition = !1),
					(t.deleteExpando = !0),
					(t.noCloneEvent = !0),
					(t.reliableMarginRight = !0),
					(t.boxSizingReliable = !0),
					(o.checked = !0),
					(t.noCloneChecked = o.cloneNode(!0).checked),
					(s.disabled = !0),
					(t.optDisabled = !u.disabled);
				try {
					delete d.test;
				} catch (h) {
					t.deleteExpando = !1;
				}
				(o = a.createElement("input")),
					o.setAttribute("value", ""),
					(t.input = "" === o.getAttribute("value")),
					(o.value = "t"),
					o.setAttribute("type", "radio"),
					(t.radioValue = "t" === o.value),
					o.setAttribute("checked", "t"),
					o.setAttribute("name", "t"),
					(l = a.createDocumentFragment()),
					l.appendChild(o),
					(t.appendChecked = o.checked),
					(t.checkClone = l
						.cloneNode(!0)
						.cloneNode(!0).lastChild.checked),
					d.attachEvent &&
						(d.attachEvent("onclick", function() {
							t.noCloneEvent = !1;
						}),
						d.cloneNode(!0).click());
				for (f in { submit: !0, change: !0, focusin: !0 })
					d.setAttribute((c = "on" + f), "t"),
						(t[f + "Bubbles"] =
							c in e || d.attributes[c].expando === !1);
				(d.style.backgroundClip = "content-box"),
					(d.cloneNode(!0).style.backgroundClip = ""),
					(t.clearCloneStyle =
						"content-box" === d.style.backgroundClip);
				for (f in x(t)) break;
				return (
					(t.ownLast = "0" !== f),
					x(function() {
						var n,
							r,
							o,
							s =
								"padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
							l = a.getElementsByTagName("body")[0];
						l &&
							((n = a.createElement("div")),
							(n.style.cssText =
								"border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px"),
							l.appendChild(n).appendChild(d),
							(d.innerHTML =
								"<table><tr><td></td><td>t</td></tr></table>"),
							(o = d.getElementsByTagName("td")),
							(o[0].style.cssText =
								"padding:0;margin:0;border:0;display:none"),
							(p = 0 === o[0].offsetHeight),
							(o[0].style.display = ""),
							(o[1].style.display = "none"),
							(t.reliableHiddenOffsets =
								p && 0 === o[0].offsetHeight),
							(d.innerHTML = ""),
							(d.style.cssText =
								"box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;"),
							x.swap(
								l,
								null != l.style.zoom ? { zoom: 1 } : {},
								function() {
									t.boxSizing = 4 === d.offsetWidth;
								}
							),
							e.getComputedStyle &&
								((t.pixelPosition =
									"1%" !==
									(e.getComputedStyle(d, null) || {}).top),
								(t.boxSizingReliable =
									"4px" ===
									(
										e.getComputedStyle(d, null) || {
											width: "4px"
										}
									).width),
								(r = d.appendChild(a.createElement("div"))),
								(r.style.cssText = d.style.cssText = s),
								(r.style.marginRight = r.style.width = "0"),
								(d.style.width = "1px"),
								(t.reliableMarginRight = !parseFloat(
									(e.getComputedStyle(r, null) || {})
										.marginRight
								))),
							typeof d.style.zoom !== i &&
								((d.innerHTML = ""),
								(d.style.cssText =
									s +
									"width:1px;padding:1px;display:inline;zoom:1"),
								(t.inlineBlockNeedsLayout =
									3 === d.offsetWidth),
								(d.style.display = "block"),
								(d.innerHTML = "<div></div>"),
								(d.firstChild.style.width = "5px"),
								(t.shrinkWrapBlocks = 3 !== d.offsetWidth),
								t.inlineBlockNeedsLayout && (l.style.zoom = 1)),
							l.removeChild(n),
							(n = d = o = r = null));
					}),
					(n = s = l = u = r = o = null),
					t
				);
			})({}));
		var B = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
			P = /([A-Z])/g;
		x.extend({
			cache: {},
			noData: {
				applet: !0,
				embed: !0,
				object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
			},
			hasData: function(e) {
				return (
					(e = e.nodeType ? x.cache[e[x.expando]] : e[x.expando]),
					!!e && !I(e)
				);
			},
			data: function(e, t, n) {
				return R(e, t, n);
			},
			removeData: function(e, t) {
				return W(e, t);
			},
			_data: function(e, t, n) {
				return R(e, t, n, !0);
			},
			_removeData: function(e, t) {
				return W(e, t, !0);
			},
			acceptData: function(e) {
				if (e.nodeType && 1 !== e.nodeType && 9 !== e.nodeType)
					return !1;
				var t = e.nodeName && x.noData[e.nodeName.toLowerCase()];
				return !t || (t !== !0 && e.getAttribute("classid") === t);
			}
		}),
			x.fn.extend({
				data: function(e, n) {
					var r,
						i,
						o = null,
						a = 0,
						s = this[0];
					if (e === t) {
						if (
							this.length &&
							((o = x.data(s)),
							1 === s.nodeType && !x._data(s, "parsedAttrs"))
						) {
							for (r = s.attributes; r.length > a; a++)
								(i = r[a].name),
									0 === i.indexOf("data-") &&
										((i = x.camelCase(i.slice(5))),
										$(s, i, o[i]));
							x._data(s, "parsedAttrs", !0);
						}
						return o;
					}
					return "object" == typeof e
						? this.each(function() {
								x.data(this, e);
							})
						: arguments.length > 1
							? this.each(function() {
									x.data(this, e, n);
								})
							: s ? $(s, e, x.data(s, e)) : null;
				},
				removeData: function(e) {
					return this.each(function() {
						x.removeData(this, e);
					});
				}
			}),
			x.extend({
				queue: function(e, n, r) {
					var i;
					return e
						? ((n = (n || "fx") + "queue"),
							(i = x._data(e, n)),
							r &&
								(!i || x.isArray(r)
									? (i = x._data(e, n, x.makeArray(r)))
									: i.push(r)),
							i || [])
						: t;
				},
				dequeue: function(e, t) {
					t = t || "fx";
					var n = x.queue(e, t),
						r = n.length,
						i = n.shift(),
						o = x._queueHooks(e, t),
						a = function() {
							x.dequeue(e, t);
						};
					"inprogress" === i && ((i = n.shift()), r--),
						i &&
							("fx" === t && n.unshift("inprogress"),
							delete o.stop,
							i.call(e, a, o)),
						!r && o && o.empty.fire();
				},
				_queueHooks: function(e, t) {
					var n = t + "queueHooks";
					return (
						x._data(e, n) ||
						x._data(e, n, {
							empty: x.Callbacks("once memory").add(function() {
								x._removeData(e, t + "queue"),
									x._removeData(e, n);
							})
						})
					);
				}
			}),
			x.fn.extend({
				queue: function(e, n) {
					var r = 2;
					return (
						"string" != typeof e && ((n = e), (e = "fx"), r--),
						r > arguments.length
							? x.queue(this[0], e)
							: n === t
								? this
								: this.each(function() {
										var t = x.queue(this, e, n);
										x._queueHooks(this, e),
											"fx" === e &&
												"inprogress" !== t[0] &&
												x.dequeue(this, e);
									})
					);
				},
				dequeue: function(e) {
					return this.each(function() {
						x.dequeue(this, e);
					});
				},
				delay: function(e, t) {
					return (
						(e = x.fx ? x.fx.speeds[e] || e : e),
						(t = t || "fx"),
						this.queue(t, function(t, n) {
							var r = setTimeout(t, e);
							n.stop = function() {
								clearTimeout(r);
							};
						})
					);
				},
				clearQueue: function(e) {
					return this.queue(e || "fx", []);
				},
				promise: function(e, n) {
					var r,
						i = 1,
						o = x.Deferred(),
						a = this,
						s = this.length,
						l = function() {
							--i || o.resolveWith(a, [a]);
						};
					for (
						"string" != typeof e && ((n = e), (e = t)),
							e = e || "fx";
						s--;

					)
						(r = x._data(a[s], e + "queueHooks")),
							r && r.empty && (i++, r.empty.add(l));
					return l(), o.promise(n);
				}
			});
		var z,
			X,
			U = /[\t\r\n\f]/g,
			V = /\r/g,
			Y = /^(?:input|select|textarea|button|object)$/i,
			J = /^(?:a|area)$/i,
			G = /^(?:checked|selected)$/i,
			Q = x.support.getSetAttribute,
			K = x.support.input;
		x.fn.extend({
			attr: function(e, t) {
				return x.access(this, x.attr, e, t, arguments.length > 1);
			},
			removeAttr: function(e) {
				return this.each(function() {
					x.removeAttr(this, e);
				});
			},
			prop: function(e, t) {
				return x.access(this, x.prop, e, t, arguments.length > 1);
			},
			removeProp: function(e) {
				return (
					(e = x.propFix[e] || e),
					this.each(function() {
						try {
							(this[e] = t), delete this[e];
						} catch (n) {}
					})
				);
			},
			addClass: function(e) {
				var t,
					n,
					r,
					i,
					o,
					a = 0,
					s = this.length,
					l = "string" == typeof e && e;
				if (x.isFunction(e))
					return this.each(function(t) {
						x(this).addClass(e.call(this, t, this.className));
					});
				if (l)
					for (t = (e || "").match(T) || []; s > a; a++)
						if (
							((n = this[a]),
							(r =
								1 === n.nodeType &&
								(n.className
									? (" " + n.className + " ").replace(U, " ")
									: " ")))
						) {
							for (o = 0; (i = t[o++]); )
								0 > r.indexOf(" " + i + " ") && (r += i + " ");
							n.className = x.trim(r);
						}
				return this;
			},
			removeClass: function(e) {
				var t,
					n,
					r,
					i,
					o,
					a = 0,
					s = this.length,
					l = 0 === arguments.length || ("string" == typeof e && e);
				if (x.isFunction(e))
					return this.each(function(t) {
						x(this).removeClass(e.call(this, t, this.className));
					});
				if (l)
					for (t = (e || "").match(T) || []; s > a; a++)
						if (
							((n = this[a]),
							(r =
								1 === n.nodeType &&
								(n.className
									? (" " + n.className + " ").replace(U, " ")
									: "")))
						) {
							for (o = 0; (i = t[o++]); )
								for (; r.indexOf(" " + i + " ") >= 0; )
									r = r.replace(" " + i + " ", " ");
							n.className = e ? x.trim(r) : "";
						}
				return this;
			},
			toggleClass: function(e, t) {
				var n = typeof e;
				return "boolean" == typeof t && "string" === n
					? t ? this.addClass(e) : this.removeClass(e)
					: this.each(
							x.isFunction(e)
								? function(n) {
										x(this).toggleClass(
											e.call(this, n, this.className, t),
											t
										);
									}
								: function() {
										if ("string" === n)
											for (
												var t,
													r = 0,
													o = x(this),
													a = e.match(T) || [];
												(t = a[r++]);

											)
												o.hasClass(t)
													? o.removeClass(t)
													: o.addClass(t);
										else
											(n === i || "boolean" === n) &&
												(this.className &&
													x._data(
														this,
														"__className__",
														this.className
													),
												(this.className =
													this.className || e === !1
														? ""
														: x._data(
																this,
																"__className__"
															) || ""));
									}
						);
			},
			hasClass: function(e) {
				for (var t = " " + e + " ", n = 0, r = this.length; r > n; n++)
					if (
						1 === this[n].nodeType &&
						(" " + this[n].className + " ")
							.replace(U, " ")
							.indexOf(t) >= 0
					)
						return !0;
				return !1;
			},
			val: function(e) {
				var n,
					r,
					i,
					o = this[0];
				return arguments.length
					? ((i = x.isFunction(e)),
						this.each(function(n) {
							var o;
							1 === this.nodeType &&
								((o = i ? e.call(this, n, x(this).val()) : e),
								null == o
									? (o = "")
									: "number" == typeof o
										? (o += "")
										: x.isArray(o) &&
											(o = x.map(o, function(e) {
												return null == e ? "" : e + "";
											})),
								(r =
									x.valHooks[this.type] ||
									x.valHooks[this.nodeName.toLowerCase()]),
								(r &&
									"set" in r &&
									r.set(this, o, "value") !== t) ||
									(this.value = o));
						}))
					: o
						? ((r =
								x.valHooks[o.type] ||
								x.valHooks[o.nodeName.toLowerCase()]),
							r && "get" in r && (n = r.get(o, "value")) !== t
								? n
								: ((n = o.value),
									"string" == typeof n
										? n.replace(V, "")
										: null == n ? "" : n))
						: void 0;
			}
		}),
			x.extend({
				valHooks: {
					option: {
						get: function(e) {
							var t = x.find.attr(e, "value");
							return null != t ? t : e.text;
						}
					},
					select: {
						get: function(e) {
							for (
								var t,
									n,
									r = e.options,
									i = e.selectedIndex,
									o = "select-one" === e.type || 0 > i,
									a = o ? null : [],
									s = o ? i + 1 : r.length,
									l = 0 > i ? s : o ? i : 0;
								s > l;
								l++
							)
								if (
									((n = r[l]),
									!(
										(!n.selected && l !== i) ||
										(x.support.optDisabled
											? n.disabled
											: null !==
												n.getAttribute("disabled")) ||
										(n.parentNode.disabled &&
											x.nodeName(
												n.parentNode,
												"optgroup"
											))
									))
								) {
									if (((t = x(n).val()), o)) return t;
									a.push(t);
								}
							return a;
						},
						set: function(e, t) {
							for (
								var n,
									r,
									i = e.options,
									o = x.makeArray(t),
									a = i.length;
								a--;

							)
								(r = i[a]),
									(r.selected =
										x.inArray(x(r).val(), o) >= 0) &&
										(n = !0);
							return n || (e.selectedIndex = -1), o;
						}
					}
				},
				attr: function(e, n, r) {
					var o,
						a,
						s = e.nodeType;
					return e && 3 !== s && 8 !== s && 2 !== s
						? typeof e.getAttribute === i
							? x.prop(e, n, r)
							: ((1 === s && x.isXMLDoc(e)) ||
									((n = n.toLowerCase()),
									(o =
										x.attrHooks[n] ||
										(x.expr.match.bool.test(n) ? X : z))),
								r === t
									? o && "get" in o && null !== (a = o.get(e, n))
										? a
										: ((a = x.find.attr(e, n)), null == a ? t : a)
									: null !== r
										? o &&
											"set" in o &&
											(a = o.set(e, r, n)) !== t
											? a
											: (e.setAttribute(n, r + ""), r)
										: (x.removeAttr(e, n), t))
						: void 0;
				},
				removeAttr: function(e, t) {
					var n,
						r,
						i = 0,
						o = t && t.match(T);
					if (o && 1 === e.nodeType)
						for (; (n = o[i++]); )
							(r = x.propFix[n] || n),
								x.expr.match.bool.test(n)
									? (K && Q) || !G.test(n)
										? (e[r] = !1)
										: (e[x.camelCase("default-" + n)] = e[
												r
											] = !1)
									: x.attr(e, n, ""),
								e.removeAttribute(Q ? n : r);
				},
				attrHooks: {
					type: {
						set: function(e, t) {
							if (
								!x.support.radioValue &&
								"radio" === t &&
								x.nodeName(e, "input")
							) {
								var n = e.value;
								return (
									e.setAttribute("type", t),
									n && (e.value = n),
									t
								);
							}
						}
					}
				},
				propFix: { for: "htmlFor", class: "className" },
				prop: function(e, n, r) {
					var i,
						o,
						a,
						s = e.nodeType;
					return e && 3 !== s && 8 !== s && 2 !== s
						? ((a = 1 !== s || !x.isXMLDoc(e)),
							a && ((n = x.propFix[n] || n), (o = x.propHooks[n])),
							r !== t
								? o && "set" in o && (i = o.set(e, r, n)) !== t
									? i
									: (e[n] = r)
								: o && "get" in o && null !== (i = o.get(e, n))
									? i
									: e[n])
						: void 0;
				},
				propHooks: {
					tabIndex: {
						get: function(e) {
							var t = x.find.attr(e, "tabindex");
							return t
								? parseInt(t, 10)
								: Y.test(e.nodeName) ||
									(J.test(e.nodeName) && e.href)
									? 0
									: -1;
						}
					}
				}
			}),
			(X = {
				set: function(e, t, n) {
					return (
						t === !1
							? x.removeAttr(e, n)
							: (K && Q) || !G.test(n)
								? e.setAttribute((!Q && x.propFix[n]) || n, n)
								: (e[x.camelCase("default-" + n)] = e[n] = !0),
						n
					);
				}
			}),
			x.each(x.expr.match.bool.source.match(/\w+/g), function(e, n) {
				var r = x.expr.attrHandle[n] || x.find.attr;
				x.expr.attrHandle[n] =
					(K && Q) || !G.test(n)
						? function(e, n, i) {
								var o = x.expr.attrHandle[n],
									a = i
										? t
										: (x.expr.attrHandle[n] = t) != r(e, n, i)
											? n.toLowerCase()
											: null;
								return (x.expr.attrHandle[n] = o), a;
							}
						: function(e, n, r) {
								return r
									? t
									: e[x.camelCase("default-" + n)]
										? n.toLowerCase()
										: null;
							};
			}),
			(K && Q) ||
				(x.attrHooks.value = {
					set: function(e, n, r) {
						return x.nodeName(e, "input")
							? ((e.defaultValue = n), t)
							: z && z.set(e, n, r);
					}
				}),
			Q ||
				((z = {
					set: function(e, n, r) {
						var i = e.getAttributeNode(r);
						return (
							i ||
								e.setAttributeNode(
									(i = e.ownerDocument.createAttribute(r))
								),
							(i.value = n += ""),
							"value" === r || n === e.getAttribute(r) ? n : t
						);
					}
				}),
				(x.expr.attrHandle.id = x.expr.attrHandle.name = x.expr.attrHandle.coords = function(
					e,
					n,
					r
				) {
					var i;
					return r
						? t
						: (i = e.getAttributeNode(n)) && "" !== i.value
							? i.value
							: null;
				}),
				(x.valHooks.button = {
					get: function(e, n) {
						var r = e.getAttributeNode(n);
						return r && r.specified ? r.value : t;
					},
					set: z.set
				}),
				(x.attrHooks.contenteditable = {
					set: function(e, t, n) {
						z.set(e, "" === t ? !1 : t, n);
					}
				}),
				x.each(["width", "height"], function(e, n) {
					x.attrHooks[n] = {
						set: function(e, r) {
							return "" === r
								? (e.setAttribute(n, "auto"), r)
								: t;
						}
					};
				})),
			x.support.hrefNormalized ||
				x.each(["href", "src"], function(e, t) {
					x.propHooks[t] = {
						get: function(e) {
							return e.getAttribute(t, 4);
						}
					};
				}),
			x.support.style ||
				(x.attrHooks.style = {
					get: function(e) {
						return e.style.cssText || t;
					},
					set: function(e, t) {
						return (e.style.cssText = t + "");
					}
				}),
			x.support.optSelected ||
				(x.propHooks.selected = {
					get: function(e) {
						var t = e.parentNode;
						return (
							t &&
								(t.selectedIndex,
								t.parentNode && t.parentNode.selectedIndex),
							null
						);
					}
				}),
			x.each(
				[
					"tabIndex",
					"readOnly",
					"maxLength",
					"cellSpacing",
					"cellPadding",
					"rowSpan",
					"colSpan",
					"useMap",
					"frameBorder",
					"contentEditable"
				],
				function() {
					x.propFix[this.toLowerCase()] = this;
				}
			),
			x.support.enctype || (x.propFix.enctype = "encoding"),
			x.each(["radio", "checkbox"], function() {
				(x.valHooks[this] = {
					set: function(e, n) {
						return x.isArray(n)
							? (e.checked = x.inArray(x(e).val(), n) >= 0)
							: t;
					}
				}),
					x.support.checkOn ||
						(x.valHooks[this].get = function(e) {
							return null === e.getAttribute("value")
								? "on"
								: e.value;
						});
			});
		var Z = /^(?:input|select|textarea)$/i,
			et = /^key/,
			tt = /^(?:mouse|contextmenu)|click/,
			nt = /^(?:focusinfocus|focusoutblur)$/,
			rt = /^([^.]*)(?:\.(.+)|)$/;
		(x.event = {
			global: {},
			add: function(e, n, r, o, a) {
				var s,
					l,
					u,
					c,
					p,
					f,
					d,
					h,
					g,
					m,
					y,
					v = x._data(e);
				if (v) {
					for (
						r.handler &&
							((c = r), (r = c.handler), (a = c.selector)),
							r.guid || (r.guid = x.guid++),
							(l = v.events) || (l = v.events = {}),
							(f = v.handle) ||
								((f = v.handle = function(e) {
									return typeof x === i ||
										(e && x.event.triggered === e.type)
										? t
										: x.event.dispatch.apply(
												f.elem,
												arguments
											);
								}),
								(f.elem = e)),
							n = (n || "").match(T) || [""],
							u = n.length;
						u--;

					)
						(s = rt.exec(n[u]) || []),
							(g = y = s[1]),
							(m = (s[2] || "").split(".").sort()),
							g &&
								((p = x.event.special[g] || {}),
								(g = (a ? p.delegateType : p.bindType) || g),
								(p = x.event.special[g] || {}),
								(d = x.extend(
									{
										type: g,
										origType: y,
										data: o,
										handler: r,
										guid: r.guid,
										selector: a,
										needsContext:
											a &&
											x.expr.match.needsContext.test(a),
										namespace: m.join(".")
									},
									c
								)),
								(h = l[g]) ||
									((h = l[g] = []),
									(h.delegateCount = 0),
									(p.setup &&
										p.setup.call(e, o, m, f) !== !1) ||
										(e.addEventListener
											? e.addEventListener(g, f, !1)
											: e.attachEvent &&
												e.attachEvent("on" + g, f))),
								p.add &&
									(p.add.call(e, d),
									d.handler.guid ||
										(d.handler.guid = r.guid)),
								a
									? h.splice(h.delegateCount++, 0, d)
									: h.push(d),
								(x.event.global[g] = !0));
					e = null;
				}
			},
			remove: function(e, t, n, r, i) {
				var o,
					a,
					s,
					l,
					u,
					c,
					p,
					f,
					d,
					h,
					g,
					m = x.hasData(e) && x._data(e);
				if (m && (c = m.events)) {
					for (t = (t || "").match(T) || [""], u = t.length; u--; )
						if (
							((s = rt.exec(t[u]) || []),
							(d = g = s[1]),
							(h = (s[2] || "").split(".").sort()),
							d)
						) {
							for (
								p = x.event.special[d] || {},
									d = (r ? p.delegateType : p.bindType) || d,
									f = c[d] || [],
									s =
										s[2] &&
										RegExp(
											"(^|\\.)" +
												h.join("\\.(?:.*\\.|)") +
												"(\\.|$)"
										),
									l = o = f.length;
								o--;

							)
								(a = f[o]),
									(!i && g !== a.origType) ||
										(n && n.guid !== a.guid) ||
										(s && !s.test(a.namespace)) ||
										(r &&
											r !== a.selector &&
											("**" !== r || !a.selector)) ||
										(f.splice(o, 1),
										a.selector && f.delegateCount--,
										p.remove && p.remove.call(e, a));
							l &&
								!f.length &&
								((p.teardown &&
									p.teardown.call(e, h, m.handle) !== !1) ||
									x.removeEvent(e, d, m.handle),
								delete c[d]);
						} else
							for (d in c) x.event.remove(e, d + t[u], n, r, !0);
					x.isEmptyObject(c) &&
						(delete m.handle, x._removeData(e, "events"));
				}
			},
			trigger: function(n, r, i, o) {
				var s,
					l,
					u,
					c,
					p,
					f,
					d,
					h = [i || a],
					g = v.call(n, "type") ? n.type : n,
					m = v.call(n, "namespace") ? n.namespace.split(".") : [];
				if (
					((u = f = i = i || a),
					3 !== i.nodeType &&
						8 !== i.nodeType &&
						!nt.test(g + x.event.triggered) &&
						(g.indexOf(".") >= 0 &&
							((m = g.split(".")), (g = m.shift()), m.sort()),
						(l = 0 > g.indexOf(":") && "on" + g),
						(n = n[x.expando]
							? n
							: new x.Event(g, "object" == typeof n && n)),
						(n.isTrigger = o ? 2 : 3),
						(n.namespace = m.join(".")),
						(n.namespace_re = n.namespace
							? RegExp(
									"(^|\\.)" +
										m.join("\\.(?:.*\\.|)") +
										"(\\.|$)"
								)
							: null),
						(n.result = t),
						n.target || (n.target = i),
						(r = null == r ? [n] : x.makeArray(r, [n])),
						(p = x.event.special[g] || {}),
						o || !p.trigger || p.trigger.apply(i, r) !== !1))
				) {
					if (!o && !p.noBubble && !x.isWindow(i)) {
						for (
							c = p.delegateType || g,
								nt.test(c + g) || (u = u.parentNode);
							u;
							u = u.parentNode
						)
							h.push(u), (f = u);
						f === (i.ownerDocument || a) &&
							h.push(f.defaultView || f.parentWindow || e);
					}
					for (d = 0; (u = h[d++]) && !n.isPropagationStopped(); )
						(n.type = d > 1 ? c : p.bindType || g),
							(s =
								(x._data(u, "events") || {})[n.type] &&
								x._data(u, "handle")),
							s && s.apply(u, r),
							(s = l && u[l]),
							s &&
								x.acceptData(u) &&
								s.apply &&
								s.apply(u, r) === !1 &&
								n.preventDefault();
					if (
						((n.type = g),
						!o &&
							!n.isDefaultPrevented() &&
							(!p._default ||
								p._default.apply(h.pop(), r) === !1) &&
							x.acceptData(i) &&
							l &&
							i[g] &&
							!x.isWindow(i))
					) {
						(f = i[l]), f && (i[l] = null), (x.event.triggered = g);
						try {
							i[g]();
						} catch (y) {}
						(x.event.triggered = t), f && (i[l] = f);
					}
					return n.result;
				}
			},
			dispatch: function(e) {
				e = x.event.fix(e);
				var n,
					r,
					i,
					o,
					a,
					s = [],
					l = g.call(arguments),
					u = (x._data(this, "events") || {})[e.type] || [],
					c = x.event.special[e.type] || {};
				if (
					((l[0] = e),
					(e.delegateTarget = this),
					!c.preDispatch || c.preDispatch.call(this, e) !== !1)
				) {
					for (
						s = x.event.handlers.call(this, e, u), n = 0;
						(o = s[n++]) && !e.isPropagationStopped();

					)
						for (
							e.currentTarget = o.elem, a = 0;
							(i = o.handlers[a++]) &&
							!e.isImmediatePropagationStopped();

						)
							(!e.namespace_re ||
								e.namespace_re.test(i.namespace)) &&
								((e.handleObj = i),
								(e.data = i.data),
								(r = (
									(x.event.special[i.origType] || {})
										.handle || i.handler
								).apply(o.elem, l)),
								r !== t &&
									(e.result = r) === !1 &&
									(e.preventDefault(), e.stopPropagation()));
					return (
						c.postDispatch && c.postDispatch.call(this, e), e.result
					);
				}
			},
			handlers: function(e, n) {
				var r,
					i,
					o,
					a,
					s = [],
					l = n.delegateCount,
					u = e.target;
				if (l && u.nodeType && (!e.button || "click" !== e.type))
					for (; u != this; u = u.parentNode || this)
						if (
							1 === u.nodeType &&
							(u.disabled !== !0 || "click" !== e.type)
						) {
							for (o = [], a = 0; l > a; a++)
								(i = n[a]),
									(r = i.selector + " "),
									o[r] === t &&
										(o[r] = i.needsContext
											? x(r, this).index(u) >= 0
											: x.find(r, this, null, [u])
													.length),
									o[r] && o.push(i);
							o.length && s.push({ elem: u, handlers: o });
						}
				return (
					n.length > l &&
						s.push({ elem: this, handlers: n.slice(l) }),
					s
				);
			},
			fix: function(e) {
				if (e[x.expando]) return e;
				var t,
					n,
					r,
					i = e.type,
					o = e,
					s = this.fixHooks[i];
				for (
					s ||
						(this.fixHooks[i] = s = tt.test(i)
							? this.mouseHooks
							: et.test(i) ? this.keyHooks : {}),
						r = s.props ? this.props.concat(s.props) : this.props,
						e = new x.Event(o),
						t = r.length;
					t--;

				)
					(n = r[t]), (e[n] = o[n]);
				return (
					e.target || (e.target = o.srcElement || a),
					3 === e.target.nodeType && (e.target = e.target.parentNode),
					(e.metaKey = !!e.metaKey),
					s.filter ? s.filter(e, o) : e
				);
			},
			props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(
				" "
			),
			fixHooks: {},
			keyHooks: {
				props: "char charCode key keyCode".split(" "),
				filter: function(e, t) {
					return (
						null == e.which &&
							(e.which =
								null != t.charCode ? t.charCode : t.keyCode),
						e
					);
				}
			},
			mouseHooks: {
				props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(
					" "
				),
				filter: function(e, n) {
					var r,
						i,
						o,
						s = n.button,
						l = n.fromElement;
					return (
						null == e.pageX &&
							null != n.clientX &&
							((i = e.target.ownerDocument || a),
							(o = i.documentElement),
							(r = i.body),
							(e.pageX =
								n.clientX +
								((o && o.scrollLeft) ||
									(r && r.scrollLeft) ||
									0) -
								((o && o.clientLeft) ||
									(r && r.clientLeft) ||
									0)),
							(e.pageY =
								n.clientY +
								((o && o.scrollTop) ||
									(r && r.scrollTop) ||
									0) -
								((o && o.clientTop) ||
									(r && r.clientTop) ||
									0))),
						!e.relatedTarget &&
							l &&
							(e.relatedTarget =
								l === e.target ? n.toElement : l),
						e.which ||
							s === t ||
							(e.which = 1 & s ? 1 : 2 & s ? 3 : 4 & s ? 2 : 0),
						e
					);
				}
			},
			special: {
				load: { noBubble: !0 },
				focus: {
					trigger: function() {
						if (this !== at() && this.focus)
							try {
								return this.focus(), !1;
							} catch (e) {}
					},
					delegateType: "focusin"
				},
				blur: {
					trigger: function() {
						return this === at() && this.blur
							? (this.blur(), !1)
							: t;
					},
					delegateType: "focusout"
				},
				click: {
					trigger: function() {
						return x.nodeName(this, "input") &&
							"checkbox" === this.type &&
							this.click
							? (this.click(), !1)
							: t;
					},
					_default: function(e) {
						return x.nodeName(e.target, "a");
					}
				},
				beforeunload: {
					postDispatch: function(e) {
						e.result !== t &&
							(e.originalEvent.returnValue = e.result);
					}
				}
			},
			simulate: function(e, t, n, r) {
				var i = x.extend(new x.Event(), n, {
					type: e,
					isSimulated: !0,
					originalEvent: {}
				});
				r ? x.event.trigger(i, null, t) : x.event.dispatch.call(t, i),
					i.isDefaultPrevented() && n.preventDefault();
			}
		}),
			(x.removeEvent = a.removeEventListener
				? function(e, t, n) {
						e.removeEventListener && e.removeEventListener(t, n, !1);
					}
				: function(e, t, n) {
						var r = "on" + t;
						e.detachEvent &&
							(typeof e[r] === i && (e[r] = null),
							e.detachEvent(r, n));
					}),
			(x.Event = function(e, n) {
				return this instanceof x.Event
					? (e && e.type
							? ((this.originalEvent = e),
								(this.type = e.type),
								(this.isDefaultPrevented =
									e.defaultPrevented ||
									e.returnValue === !1 ||
									(e.getPreventDefault && e.getPreventDefault())
										? it
										: ot))
							: (this.type = e),
						n && x.extend(this, n),
						(this.timeStamp = (e && e.timeStamp) || x.now()),
						(this[x.expando] = !0),
						t)
					: new x.Event(e, n);
			}),
			(x.Event.prototype = {
				isDefaultPrevented: ot,
				isPropagationStopped: ot,
				isImmediatePropagationStopped: ot,
				preventDefault: function() {
					var e = this.originalEvent;
					(this.isDefaultPrevented = it),
						e &&
							(e.preventDefault
								? e.preventDefault()
								: (e.returnValue = !1));
				},
				stopPropagation: function() {
					var e = this.originalEvent;
					(this.isPropagationStopped = it),
						e &&
							(e.stopPropagation && e.stopPropagation(),
							(e.cancelBubble = !0));
				},
				stopImmediatePropagation: function() {
					(this.isImmediatePropagationStopped = it),
						this.stopPropagation();
				}
			}),
			x.each(
				{ mouseenter: "mouseover", mouseleave: "mouseout" },
				function(e, t) {
					x.event.special[e] = {
						delegateType: t,
						bindType: t,
						handle: function(e) {
							var n,
								r = this,
								i = e.relatedTarget,
								o = e.handleObj;
							return (
								(!i || (i !== r && !x.contains(r, i))) &&
									((e.type = o.origType),
									(n = o.handler.apply(this, arguments)),
									(e.type = t)),
								n
							);
						}
					};
				}
			),
			x.support.submitBubbles ||
				(x.event.special.submit = {
					setup: function() {
						return x.nodeName(this, "form")
							? !1
							: (x.event.add(
									this,
									"click._submit keypress._submit",
									function(e) {
										var n = e.target,
											r =
												x.nodeName(n, "input") ||
												x.nodeName(n, "button")
													? n.form
													: t;
										r &&
											!x._data(r, "submitBubbles") &&
											(x.event.add(
												r,
												"submit._submit",
												function(e) {
													e._submit_bubble = !0;
												}
											),
											x._data(r, "submitBubbles", !0));
									}
								),
								t);
					},
					postDispatch: function(e) {
						e._submit_bubble &&
							(delete e._submit_bubble,
							this.parentNode &&
								!e.isTrigger &&
								x.event.simulate(
									"submit",
									this.parentNode,
									e,
									!0
								));
					},
					teardown: function() {
						return x.nodeName(this, "form")
							? !1
							: (x.event.remove(this, "._submit"), t);
					}
				}),
			x.support.changeBubbles ||
				(x.event.special.change = {
					setup: function() {
						return Z.test(this.nodeName)
							? (("checkbox" === this.type ||
									"radio" === this.type) &&
									(x.event.add(
										this,
										"propertychange._change",
										function(e) {
											"checked" ===
												e.originalEvent.propertyName &&
												(this._just_changed = !0);
										}
									),
									x.event.add(this, "click._change", function(
										e
									) {
										this._just_changed &&
											!e.isTrigger &&
											(this._just_changed = !1),
											x.event.simulate(
												"change",
												this,
												e,
												!0
											);
									})),
								!1)
							: (x.event.add(
									this,
									"beforeactivate._change",
									function(e) {
										var t = e.target;
										Z.test(t.nodeName) &&
											!x._data(t, "changeBubbles") &&
											(x.event.add(
												t,
												"change._change",
												function(e) {
													!this.parentNode ||
														e.isSimulated ||
														e.isTrigger ||
														x.event.simulate(
															"change",
															this.parentNode,
															e,
															!0
														);
												}
											),
											x._data(t, "changeBubbles", !0));
									}
								),
								t);
					},
					handle: function(e) {
						var n = e.target;
						return this !== n ||
							e.isSimulated ||
							e.isTrigger ||
							("radio" !== n.type && "checkbox" !== n.type)
							? e.handleObj.handler.apply(this, arguments)
							: t;
					},
					teardown: function() {
						return (
							x.event.remove(this, "._change"),
							!Z.test(this.nodeName)
						);
					}
				}),
			x.support.focusinBubbles ||
				x.each({ focus: "focusin", blur: "focusout" }, function(e, t) {
					var n = 0,
						r = function(e) {
							x.event.simulate(t, e.target, x.event.fix(e), !0);
						};
					x.event.special[t] = {
						setup: function() {
							0 === n++ && a.addEventListener(e, r, !0);
						},
						teardown: function() {
							0 === --n && a.removeEventListener(e, r, !0);
						}
					};
				}),
			x.fn.extend({
				on: function(e, n, r, i, o) {
					var a, s;
					if ("object" == typeof e) {
						"string" != typeof n && ((r = r || n), (n = t));
						for (a in e) this.on(a, n, r, e[a], o);
						return this;
					}
					if (
						(null == r && null == i
							? ((i = n), (r = n = t))
							: null == i &&
								("string" == typeof n
									? ((i = r), (r = t))
									: ((i = r), (r = n), (n = t))),
						i === !1)
					)
						i = ot;
					else if (!i) return this;
					return (
						1 === o &&
							((s = i),
							(i = function(e) {
								return x().off(e), s.apply(this, arguments);
							}),
							(i.guid = s.guid || (s.guid = x.guid++))),
						this.each(function() {
							x.event.add(this, e, i, r, n);
						})
					);
				},
				one: function(e, t, n, r) {
					return this.on(e, t, n, r, 1);
				},
				off: function(e, n, r) {
					var i, o;
					if (e && e.preventDefault && e.handleObj)
						return (
							(i = e.handleObj),
							x(e.delegateTarget).off(
								i.namespace
									? i.origType + "." + i.namespace
									: i.origType,
								i.selector,
								i.handler
							),
							this
						);
					if ("object" == typeof e) {
						for (o in e) this.off(o, n, e[o]);
						return this;
					}
					return (
						(n === !1 || "function" == typeof n) &&
							((r = n), (n = t)),
						r === !1 && (r = ot),
						this.each(function() {
							x.event.remove(this, e, r, n);
						})
					);
				},
				trigger: function(e, t) {
					return this.each(function() {
						x.event.trigger(e, t, this);
					});
				},
				triggerHandler: function(e, n) {
					var r = this[0];
					return r ? x.event.trigger(e, n, r, !0) : t;
				}
			});
		var st = /^.[^:#\[\.,]*$/,
			lt = /^(?:parents|prev(?:Until|All))/,
			ut = x.expr.match.needsContext,
			ct = {
				children: !0,
				contents: !0,
				next: !0,
				prev: !0
			};
		x.fn.extend({
			find: function(e) {
				var t,
					n = [],
					r = this,
					i = r.length;
				if ("string" != typeof e)
					return this.pushStack(
						x(e).filter(function() {
							for (t = 0; i > t; t++)
								if (x.contains(r[t], this)) return !0;
						})
					);
				for (t = 0; i > t; t++) x.find(e, r[t], n);
				return (
					(n = this.pushStack(i > 1 ? x.unique(n) : n)),
					(n.selector = this.selector ? this.selector + " " + e : e),
					n
				);
			},
			has: function(e) {
				var t,
					n = x(e, this),
					r = n.length;
				return this.filter(function() {
					for (t = 0; r > t; t++)
						if (x.contains(this, n[t])) return !0;
				});
			},
			not: function(e) {
				return this.pushStack(ft(this, e || [], !0));
			},
			filter: function(e) {
				return this.pushStack(ft(this, e || [], !1));
			},
			is: function(e) {
				return !!ft(
					this,
					"string" == typeof e && ut.test(e) ? x(e) : e || [],
					!1
				).length;
			},
			closest: function(e, t) {
				for (
					var n,
						r = 0,
						i = this.length,
						o = [],
						a =
							ut.test(e) || "string" != typeof e
								? x(e, t || this.context)
								: 0;
					i > r;
					r++
				)
					for (n = this[r]; n && n !== t; n = n.parentNode)
						if (
							11 > n.nodeType &&
							(a
								? a.index(n) > -1
								: 1 === n.nodeType &&
									x.find.matchesSelector(n, e))
						) {
							n = o.push(n);
							break;
						}
				return this.pushStack(o.length > 1 ? x.unique(o) : o);
			},
			index: function(e) {
				return e
					? "string" == typeof e
						? x.inArray(this[0], x(e))
						: x.inArray(e.jquery ? e[0] : e, this)
					: this[0] && this[0].parentNode
						? this.first().prevAll().length
						: -1;
			},
			add: function(e, t) {
				var n =
						"string" == typeof e
							? x(e, t)
							: x.makeArray(e && e.nodeType ? [e] : e),
					r = x.merge(this.get(), n);
				return this.pushStack(x.unique(r));
			},
			addBack: function(e) {
				return this.add(
					null == e ? this.prevObject : this.prevObject.filter(e)
				);
			}
		}),
			x.each(
				{
					parent: function(e) {
						var t = e.parentNode;
						return t && 11 !== t.nodeType ? t : null;
					},
					parents: function(e) {
						return x.dir(e, "parentNode");
					},
					parentsUntil: function(e, t, n) {
						return x.dir(e, "parentNode", n);
					},
					next: function(e) {
						return pt(e, "nextSibling");
					},
					prev: function(e) {
						return pt(e, "previousSibling");
					},
					nextAll: function(e) {
						return x.dir(e, "nextSibling");
					},
					prevAll: function(e) {
						return x.dir(e, "previousSibling");
					},
					nextUntil: function(e, t, n) {
						return x.dir(e, "nextSibling", n);
					},
					prevUntil: function(e, t, n) {
						return x.dir(e, "previousSibling", n);
					},
					siblings: function(e) {
						return x.sibling((e.parentNode || {}).firstChild, e);
					},
					children: function(e) {
						return x.sibling(e.firstChild);
					},
					contents: function(e) {
						return x.nodeName(e, "iframe")
							? e.contentDocument || e.contentWindow.document
							: x.merge([], e.childNodes);
					}
				},
				function(e, t) {
					x.fn[e] = function(n, r) {
						var i = x.map(this, t, n);
						return (
							"Until" !== e.slice(-5) && (r = n),
							r && "string" == typeof r && (i = x.filter(r, i)),
							this.length > 1 &&
								(ct[e] || (i = x.unique(i)),
								lt.test(e) && (i = i.reverse())),
							this.pushStack(i)
						);
					};
				}
			),
			x.extend({
				filter: function(e, t, n) {
					var r = t[0];
					return (
						n && (e = ":not(" + e + ")"),
						1 === t.length && 1 === r.nodeType
							? x.find.matchesSelector(r, e) ? [r] : []
							: x.find.matches(
									e,
									x.grep(t, function(e) {
										return 1 === e.nodeType;
									})
								)
					);
				},
				dir: function(e, n, r) {
					for (
						var i = [], o = e[n];
						o &&
						9 !== o.nodeType &&
						(r === t || 1 !== o.nodeType || !x(o).is(r));

					)
						1 === o.nodeType && i.push(o), (o = o[n]);
					return i;
				},
				sibling: function(e, t) {
					for (var n = []; e; e = e.nextSibling)
						1 === e.nodeType && e !== t && n.push(e);
					return n;
				}
			});
		var ht =
				"abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
			gt = / jQuery\d+="(?:null|\d+)"/g,
			mt = RegExp("<(?:" + ht + ")[\\s/>]", "i"),
			yt = /^\s+/,
			vt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
			bt = /<([\w:]+)/,
			xt = /<tbody/i,
			wt = /<|&#?\w+;/,
			Tt = /<(?:script|style|link)/i,
			Ct = /^(?:checkbox|radio)$/i,
			Nt = /checked\s*(?:[^=]|=\s*.checked.)/i,
			kt = /^$|\/(?:java|ecma)script/i,
			Et = /^true\/(.*)/,
			St = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
			At = {
				option: [1, "<select multiple='multiple'>", "</select>"],
				legend: [1, "<fieldset>", "</fieldset>"],
				area: [1, "<map>", "</map>"],
				param: [1, "<object>", "</object>"],
				thead: [1, "<table>", "</table>"],
				tr: [2, "<table><tbody>", "</tbody></table>"],
				col: [
					2,
					"<table><tbody></tbody><colgroup>",
					"</colgroup></table>"
				],
				td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
				_default: x.support.htmlSerialize
					? [0, "", ""]
					: [1, "X<div>", "</div>"]
			},
			jt = dt(a),
			Dt = jt.appendChild(a.createElement("div"));
		(At.optgroup = At.option),
			(At.tbody = At.tfoot = At.colgroup = At.caption = At.thead),
			(At.th = At.td),
			x.fn.extend({
				text: function(e) {
					return x.access(
						this,
						function(e) {
							return e === t
								? x.text(this)
								: this.empty().append(
										(
											(this[0] && this[0].ownerDocument) ||
											a
										).createTextNode(e)
									);
						},
						null,
						e,
						arguments.length
					);
				},
				append: function() {
					return this.domManip(arguments, function(e) {
						if (
							1 === this.nodeType ||
							11 === this.nodeType ||
							9 === this.nodeType
						) {
							var t = Lt(this, e);
							t.appendChild(e);
						}
					});
				},
				prepend: function() {
					return this.domManip(arguments, function(e) {
						if (
							1 === this.nodeType ||
							11 === this.nodeType ||
							9 === this.nodeType
						) {
							var t = Lt(this, e);
							t.insertBefore(e, t.firstChild);
						}
					});
				},
				before: function() {
					return this.domManip(arguments, function(e) {
						this.parentNode &&
							this.parentNode.insertBefore(e, this);
					});
				},
				after: function() {
					return this.domManip(arguments, function(e) {
						this.parentNode &&
							this.parentNode.insertBefore(e, this.nextSibling);
					});
				},
				remove: function(e, t) {
					for (
						var n, r = e ? x.filter(e, this) : this, i = 0;
						null != (n = r[i]);
						i++
					)
						t || 1 !== n.nodeType || x.cleanData(Ft(n)),
							n.parentNode &&
								(t &&
									x.contains(n.ownerDocument, n) &&
									_t(Ft(n, "script")),
								n.parentNode.removeChild(n));
					return this;
				},
				empty: function() {
					for (var e, t = 0; null != (e = this[t]); t++) {
						for (
							1 === e.nodeType && x.cleanData(Ft(e, !1));
							e.firstChild;

						)
							e.removeChild(e.firstChild);
						e.options &&
							x.nodeName(e, "select") &&
							(e.options.length = 0);
					}
					return this;
				},
				clone: function(e, t) {
					return (
						(e = null == e ? !1 : e),
						(t = null == t ? e : t),
						this.map(function() {
							return x.clone(this, e, t);
						})
					);
				},
				html: function(e) {
					return x.access(
						this,
						function(e) {
							var n = this[0] || {},
								r = 0,
								i = this.length;
							if (e === t)
								return 1 === n.nodeType
									? n.innerHTML.replace(gt, "")
									: t;
							if (
								!(
									"string" != typeof e ||
									Tt.test(e) ||
									(!x.support.htmlSerialize && mt.test(e)) ||
									(!x.support.leadingWhitespace &&
										yt.test(e)) ||
									At[
										(bt.exec(e) || [
											"",
											""
										])[1].toLowerCase()
									]
								)
							) {
								e = e.replace(vt, "<$1></$2>");
								try {
									for (; i > r; r++)
										(n = this[r] || {}),
											1 === n.nodeType &&
												(x.cleanData(Ft(n, !1)),
												(n.innerHTML = e));
									n = 0;
								} catch (o) {}
							}
							n && this.empty().append(e);
						},
						null,
						e,
						arguments.length
					);
				},
				replaceWith: function() {
					var e = x.map(this, function(e) {
							return [e.nextSibling, e.parentNode];
						}),
						t = 0;
					return (
						this.domManip(
							arguments,
							function(n) {
								var r = e[t++],
									i = e[t++];
								i &&
									(r &&
										r.parentNode !== i &&
										(r = this.nextSibling),
									x(this).remove(),
									i.insertBefore(n, r));
							},
							!0
						),
						t ? this : this.remove()
					);
				},
				detach: function(e) {
					return this.remove(e, !0);
				},
				domManip: function(e, t, n) {
					e = d.apply([], e);
					var r,
						i,
						o,
						a,
						s,
						l,
						u = 0,
						c = this.length,
						p = this,
						f = c - 1,
						h = e[0],
						g = x.isFunction(h);
					if (
						g ||
						(!(
							1 >= c ||
							"string" != typeof h ||
							x.support.checkClone
						) &&
							Nt.test(h))
					)
						return this.each(function(r) {
							var i = p.eq(r);
							g && (e[0] = h.call(this, r, i.html())),
								i.domManip(e, t, n);
						});
					if (
						c &&
						((l = x.buildFragment(
							e,
							this[0].ownerDocument,
							!1,
							!n && this
						)),
						(r = l.firstChild),
						1 === l.childNodes.length && (l = r),
						r)
					) {
						for (
							a = x.map(Ft(l, "script"), Ht), o = a.length;
							c > u;
							u++
						)
							(i = l),
								u !== f &&
									((i = x.clone(i, !0, !0)),
									o && x.merge(a, Ft(i, "script"))),
								t.call(this[u], i, u);
						if (o)
							for (
								s = a[a.length - 1].ownerDocument,
									x.map(a, qt),
									u = 0;
								o > u;
								u++
							)
								(i = a[u]),
									kt.test(i.type || "") &&
										!x._data(i, "globalEval") &&
										x.contains(s, i) &&
										(i.src
											? x._evalUrl(i.src)
											: x.globalEval(
													(
														i.text ||
														i.textContent ||
														i.innerHTML ||
														""
													).replace(St, "")
												));
						l = r = null;
					}
					return this;
				}
			}),
			x.each(
				{
					appendTo: "append",
					prependTo: "prepend",
					insertBefore: "before",
					insertAfter: "after",
					replaceAll: "replaceWith"
				},
				function(e, t) {
					x.fn[e] = function(e) {
						for (
							var n, r = 0, i = [], o = x(e), a = o.length - 1;
							a >= r;
							r++
						)
							(n = r === a ? this : this.clone(!0)),
								x(o[r])[t](n),
								h.apply(i, n.get());
						return this.pushStack(i);
					};
				}
			),
			x.extend({
				clone: function(e, t, n) {
					var r,
						i,
						o,
						a,
						s,
						l = x.contains(e.ownerDocument, e);
					if (
						(x.support.html5Clone ||
						x.isXMLDoc(e) ||
						!mt.test("<" + e.nodeName + ">")
							? (o = e.cloneNode(!0))
							: ((Dt.innerHTML = e.outerHTML),
								Dt.removeChild((o = Dt.firstChild))),
						!(
							(x.support.noCloneEvent &&
								x.support.noCloneChecked) ||
							(1 !== e.nodeType && 11 !== e.nodeType) ||
							x.isXMLDoc(e)
						))
					)
						for (
							r = Ft(o), s = Ft(e), a = 0;
							null != (i = s[a]);
							++a
						)
							r[a] && Ot(i, r[a]);
					if (t)
						if (n)
							for (
								s = s || Ft(e), r = r || Ft(o), a = 0;
								null != (i = s[a]);
								a++
							)
								Mt(i, r[a]);
						else Mt(e, o);
					return (
						(r = Ft(o, "script")),
						r.length > 0 && _t(r, !l && Ft(e, "script")),
						(r = s = i = null),
						o
					);
				},
				buildFragment: function(e, t, n, r) {
					for (
						var i,
							o,
							a,
							s,
							l,
							u,
							c,
							p = e.length,
							f = dt(t),
							d = [],
							h = 0;
						p > h;
						h++
					)
						if (((o = e[h]), o || 0 === o))
							if ("object" === x.type(o))
								x.merge(d, o.nodeType ? [o] : o);
							else if (wt.test(o)) {
								for (
									s =
										s ||
										f.appendChild(t.createElement("div")),
										l = (bt.exec(o) || [
											"",
											""
										])[1].toLowerCase(),
										c = At[l] || At._default,
										s.innerHTML =
											c[1] +
											o.replace(vt, "<$1></$2>") +
											c[2],
										i = c[0];
									i--;

								)
									s = s.lastChild;
								if (
									(!x.support.leadingWhitespace &&
										yt.test(o) &&
										d.push(t.createTextNode(yt.exec(o)[0])),
									!x.support.tbody)
								)
									for (
										o =
											"table" !== l || xt.test(o)
												? "<table>" !== c[1] ||
													xt.test(o)
													? 0
													: s
												: s.firstChild,
											i = o && o.childNodes.length;
										i--;

									)
										x.nodeName(
											(u = o.childNodes[i]),
											"tbody"
										) &&
											!u.childNodes.length &&
											o.removeChild(u);
								for (
									x.merge(d, s.childNodes),
										s.textContent = "";
									s.firstChild;

								)
									s.removeChild(s.firstChild);
								s = f.lastChild;
							} else d.push(t.createTextNode(o));
					for (
						s && f.removeChild(s),
							x.support.appendChecked ||
								x.grep(Ft(d, "input"), Bt),
							h = 0;
						(o = d[h++]);

					)
						if (
							(!r || -1 === x.inArray(o, r)) &&
							((a = x.contains(o.ownerDocument, o)),
							(s = Ft(f.appendChild(o), "script")),
							a && _t(s),
							n)
						)
							for (i = 0; (o = s[i++]); )
								kt.test(o.type || "") && n.push(o);
					return (s = null), f;
				},
				cleanData: function(e, t) {
					for (
						var n,
							r,
							o,
							a,
							s = 0,
							l = x.expando,
							u = x.cache,
							c = x.support.deleteExpando,
							f = x.event.special;
						null != (n = e[s]);
						s++
					)
						if (
							(t || x.acceptData(n)) &&
							((o = n[l]), (a = o && u[o]))
						) {
							if (a.events)
								for (r in a.events)
									f[r]
										? x.event.remove(n, r)
										: x.removeEvent(n, r, a.handle);
							u[o] &&
								(delete u[o],
								c
									? delete n[l]
									: typeof n.removeAttribute !== i
										? n.removeAttribute(l)
										: (n[l] = null),
								p.push(o));
						}
				},
				_evalUrl: function(e) {
					return x.ajax({
						url: e,
						type: "GET",
						dataType: "script",
						async: !1,
						global: !1,
						throws: !0
					});
				}
			}),
			x.fn.extend({
				wrapAll: function(e) {
					if (x.isFunction(e))
						return this.each(function(t) {
							x(this).wrapAll(e.call(this, t));
						});
					if (this[0]) {
						var t = x(e, this[0].ownerDocument)
							.eq(0)
							.clone(!0);
						this[0].parentNode && t.insertBefore(this[0]),
							t
								.map(function() {
									for (
										var e = this;
										e.firstChild &&
										1 === e.firstChild.nodeType;

									)
										e = e.firstChild;
									return e;
								})
								.append(this);
					}
					return this;
				},
				wrapInner: function(e) {
					return this.each(
						x.isFunction(e)
							? function(t) {
									x(this).wrapInner(e.call(this, t));
								}
							: function() {
									var t = x(this),
										n = t.contents();
									n.length ? n.wrapAll(e) : t.append(e);
								}
					);
				},
				wrap: function(e) {
					var t = x.isFunction(e);
					return this.each(function(n) {
						x(this).wrapAll(t ? e.call(this, n) : e);
					});
				},
				unwrap: function() {
					return this.parent()
						.each(function() {
							x.nodeName(this, "body") ||
								x(this).replaceWith(this.childNodes);
						})
						.end();
				}
			});
		var Pt,
			Rt,
			Wt,
			$t = /alpha\([^)]*\)/i,
			It = /opacity\s*=\s*([^)]*)/,
			zt = /^(top|right|bottom|left)$/,
			Xt = /^(none|table(?!-c[ea]).+)/,
			Ut = /^margin/,
			Vt = RegExp("^(" + w + ")(.*)$", "i"),
			Yt = RegExp("^(" + w + ")(?!px)[a-z%]+$", "i"),
			Jt = RegExp("^([+-])=(" + w + ")", "i"),
			Gt = { BODY: "block" },
			Qt = {
				position: "absolute",
				visibility: "hidden",
				display: "block"
			},
			Kt = { letterSpacing: 0, fontWeight: 400 },
			Zt = ["Top", "Right", "Bottom", "Left"],
			en = ["Webkit", "O", "Moz", "ms"];
		x.fn.extend({
			css: function(e, n) {
				return x.access(
					this,
					function(e, n, r) {
						var i,
							o,
							a = {},
							s = 0;
						if (x.isArray(n)) {
							for (o = Rt(e), i = n.length; i > s; s++)
								a[n[s]] = x.css(e, n[s], !1, o);
							return a;
						}
						return r !== t ? x.style(e, n, r) : x.css(e, n);
					},
					e,
					n,
					arguments.length > 1
				);
			},
			show: function() {
				return rn(this, !0);
			},
			hide: function() {
				return rn(this);
			},
			toggle: function(e) {
				return "boolean" == typeof e
					? e ? this.show() : this.hide()
					: this.each(function() {
							nn(this) ? x(this).show() : x(this).hide();
						});
			}
		}),
			x.extend({
				cssHooks: {
					opacity: {
						get: function(e, t) {
							if (t) {
								var n = Wt(e, "opacity");
								return "" === n ? "1" : n;
							}
						}
					}
				},
				cssNumber: {
					columnCount: !0,
					fillOpacity: !0,
					fontWeight: !0,
					lineHeight: !0,
					opacity: !0,
					order: !0,
					orphans: !0,
					widows: !0,
					zIndex: !0,
					zoom: !0
				},
				cssProps: {
					float: x.support.cssFloat ? "cssFloat" : "styleFloat"
				},
				style: function(e, n, r, i) {
					if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
						var o,
							a,
							s,
							l = x.camelCase(n),
							u = e.style;
						if (
							((n = x.cssProps[l] || (x.cssProps[l] = tn(u, l))),
							(s = x.cssHooks[n] || x.cssHooks[l]),
							r === t)
						)
							return s &&
								"get" in s &&
								(o = s.get(e, !1, i)) !== t
								? o
								: u[n];
						if (
							((a = typeof r),
							"string" === a &&
								(o = Jt.exec(r)) &&
								((r =
									(o[1] + 1) * o[2] +
									parseFloat(x.css(e, n))),
								(a = "number")),
							!(
								null == r ||
								("number" === a && isNaN(r)) ||
								("number" !== a ||
									x.cssNumber[l] ||
									(r += "px"),
								x.support.clearCloneStyle ||
									"" !== r ||
									0 !== n.indexOf("background") ||
									(u[n] = "inherit"),
								s && "set" in s && (r = s.set(e, r, i)) === t)
							))
						)
							try {
								u[n] = r;
							} catch (c) {}
					}
				},
				css: function(e, n, r, i) {
					var o,
						a,
						s,
						l = x.camelCase(n);
					return (
						(n = x.cssProps[l] || (x.cssProps[l] = tn(e.style, l))),
						(s = x.cssHooks[n] || x.cssHooks[l]),
						s && "get" in s && (a = s.get(e, !0, r)),
						a === t && (a = Wt(e, n, i)),
						"normal" === a && n in Kt && (a = Kt[n]),
						"" === r || r
							? ((o = parseFloat(a)),
								r === !0 || x.isNumeric(o) ? o || 0 : a)
							: a
					);
				}
			}),
			e.getComputedStyle
				? ((Rt = function(t) {
						return e.getComputedStyle(t, null);
					}),
					(Wt = function(e, n, r) {
						var i,
							o,
							a,
							s = r || Rt(e),
							l = s ? s.getPropertyValue(n) || s[n] : t,
							u = e.style;
						return (
							s &&
								("" !== l ||
									x.contains(e.ownerDocument, e) ||
									(l = x.style(e, n)),
								Yt.test(l) &&
									Ut.test(n) &&
									((i = u.width),
									(o = u.minWidth),
									(a = u.maxWidth),
									(u.minWidth = u.maxWidth = u.width = l),
									(l = s.width),
									(u.width = i),
									(u.minWidth = o),
									(u.maxWidth = a))),
							l
						);
					}))
				: a.documentElement.currentStyle &&
					((Rt = function(e) {
						return e.currentStyle;
					}),
					(Wt = function(e, n, r) {
						var i,
							o,
							a,
							s = r || Rt(e),
							l = s ? s[n] : t,
							u = e.style;
						return (
							null == l && u && u[n] && (l = u[n]),
							Yt.test(l) &&
								!zt.test(n) &&
								((i = u.left),
								(o = e.runtimeStyle),
								(a = o && o.left),
								a && (o.left = e.currentStyle.left),
								(u.left = "fontSize" === n ? "1em" : l),
								(l = u.pixelLeft + "px"),
								(u.left = i),
								a && (o.left = a)),
							"" === l ? "auto" : l
						);
					})),
			x.each(["height", "width"], function(e, n) {
				x.cssHooks[n] = {
					get: function(e, r, i) {
						return r
							? 0 === e.offsetWidth &&
								Xt.test(x.css(e, "display"))
								? x.swap(e, Qt, function() {
										return sn(e, n, i);
									})
								: sn(e, n, i)
							: t;
					},
					set: function(e, t, r) {
						var i = r && Rt(e);
						return on(
							e,
							t,
							r
								? an(
										e,
										n,
										r,
										x.support.boxSizing &&
											"border-box" ===
												x.css(e, "boxSizing", !1, i),
										i
									)
								: 0
						);
					}
				};
			}),
			x.support.opacity ||
				(x.cssHooks.opacity = {
					get: function(e, t) {
						return It.test(
							(t && e.currentStyle
								? e.currentStyle.filter
								: e.style.filter) || ""
						)
							? 0.01 * parseFloat(RegExp.$1) + ""
							: t ? "1" : "";
					},
					set: function(e, t) {
						var n = e.style,
							r = e.currentStyle,
							i = x.isNumeric(t)
								? "alpha(opacity=" + 100 * t + ")"
								: "",
							o = (r && r.filter) || n.filter || "";
						(n.zoom = 1),
							((t >= 1 || "" === t) &&
								"" === x.trim(o.replace($t, "")) &&
								n.removeAttribute &&
								(n.removeAttribute("filter"),
								"" === t || (r && !r.filter))) ||
								(n.filter = $t.test(o)
									? o.replace($t, i)
									: o + " " + i);
					}
				}),
			x(function() {
				x.support.reliableMarginRight ||
					(x.cssHooks.marginRight = {
						get: function(e, n) {
							return n
								? x.swap(e, { display: "inline-block" }, Wt, [
										e,
										"marginRight"
									])
								: t;
						}
					}),
					!x.support.pixelPosition &&
						x.fn.position &&
						x.each(["top", "left"], function(e, n) {
							x.cssHooks[n] = {
								get: function(e, r) {
									return r
										? ((r = Wt(e, n)),
											Yt.test(r)
												? x(e).position()[n] + "px"
												: r)
										: t;
								}
							};
						});
			}),
			x.expr &&
				x.expr.filters &&
				((x.expr.filters.hidden = function(e) {
					return (
						(0 >= e.offsetWidth && 0 >= e.offsetHeight) ||
						(!x.support.reliableHiddenOffsets &&
							"none" ===
								((e.style && e.style.display) ||
									x.css(e, "display")))
					);
				}),
				(x.expr.filters.visible = function(e) {
					return !x.expr.filters.hidden(e);
				})),
			x.each({ margin: "", padding: "", border: "Width" }, function(
				e,
				t
			) {
				(x.cssHooks[e + t] = {
					expand: function(n) {
						for (
							var r = 0,
								i = {},
								o = "string" == typeof n ? n.split(" ") : [n];
							4 > r;
							r++
						)
							i[e + Zt[r] + t] = o[r] || o[r - 2] || o[0];
						return i;
					}
				}),
					Ut.test(e) || (x.cssHooks[e + t].set = on);
			});
		var cn = /%20/g,
			pn = /\[\]$/,
			fn = /\r?\n/g,
			dn = /^(?:submit|button|image|reset|file)$/i,
			hn = /^(?:input|select|textarea|keygen)/i;
		x.fn.extend({
			serialize: function() {
				return x.param(this.serializeArray());
			},
			serializeArray: function() {
				return this.map(function() {
					var e = x.prop(this, "elements");
					return e ? x.makeArray(e) : this;
				})
					.filter(function() {
						var e = this.type;
						return (
							this.name &&
							!x(this).is(":disabled") &&
							hn.test(this.nodeName) &&
							!dn.test(e) &&
							(this.checked || !Ct.test(e))
						);
					})
					.map(function(e, t) {
						var n = x(this).val();
						return null == n
							? null
							: x.isArray(n)
								? x.map(n, function(e) {
										return {
											name: t.name,
											value: e.replace(fn, "\r\n")
										};
									})
								: { name: t.name, value: n.replace(fn, "\r\n") };
					})
					.get();
			}
		}),
			(x.param = function(e, n) {
				var r,
					i = [],
					o = function(e, t) {
						(t = x.isFunction(t) ? t() : null == t ? "" : t),
							(i[i.length] =
								encodeURIComponent(e) +
								"=" +
								encodeURIComponent(t));
					};
				if (
					(n === t &&
						(n = x.ajaxSettings && x.ajaxSettings.traditional),
					x.isArray(e) || (e.jquery && !x.isPlainObject(e)))
				)
					x.each(e, function() {
						o(this.name, this.value);
					});
				else for (r in e) gn(r, e[r], n, o);
				return i.join("&").replace(cn, "+");
			}),
			x.each(
				"blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(
					" "
				),
				function(e, t) {
					x.fn[t] = function(e, n) {
						return arguments.length > 0
							? this.on(t, null, e, n)
							: this.trigger(t);
					};
				}
			),
			x.fn.extend({
				hover: function(e, t) {
					return this.mouseenter(e).mouseleave(t || e);
				},
				bind: function(e, t, n) {
					return this.on(e, null, t, n);
				},
				unbind: function(e, t) {
					return this.off(e, null, t);
				},
				delegate: function(e, t, n, r) {
					return this.on(t, e, n, r);
				},
				undelegate: function(e, t, n) {
					return 1 === arguments.length
						? this.off(e, "**")
						: this.off(t, e || "**", n);
				}
			});
		var mn,
			yn,
			vn = x.now(),
			bn = /\?/,
			xn = /#.*$/,
			wn = /([?&])_=[^&]*/,
			Tn = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
			Cn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
			Nn = /^(?:GET|HEAD)$/,
			kn = /^\/\//,
			En = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
			Sn = x.fn.load,
			An = {},
			jn = {},
			Dn = "*/".concat("*");
		try {
			yn = o.href;
		} catch (Ln) {
			(yn = a.createElement("a")), (yn.href = ""), (yn = yn.href);
		}
		(mn = En.exec(yn.toLowerCase()) || []),
			(x.fn.load = function(e, n, r) {
				if ("string" != typeof e && Sn)
					return Sn.apply(this, arguments);
				var i,
					o,
					a,
					s = this,
					l = e.indexOf(" ");
				return (
					l >= 0 && ((i = e.slice(l, e.length)), (e = e.slice(0, l))),
					x.isFunction(n)
						? ((r = n), (n = t))
						: n && "object" == typeof n && (a = "POST"),
					s.length > 0 &&
						x
							.ajax({
								url: e,
								type: a,
								dataType: "html",
								data: n
							})
							.done(function(e) {
								(o = arguments),
									s.html(
										i
											? x("<div>")
													.append(x.parseHTML(e))
													.find(i)
											: e
									);
							})
							.complete(
								r &&
									function(e, t) {
										s.each(r, o || [e.responseText, t, e]);
									}
							),
					this
				);
			}),
			x.each(
				[
					"ajaxStart",
					"ajaxStop",
					"ajaxComplete",
					"ajaxError",
					"ajaxSuccess",
					"ajaxSend"
				],
				function(e, t) {
					x.fn[t] = function(e) {
						return this.on(t, e);
					};
				}
			),
			x.extend({
				active: 0,
				lastModified: {},
				etag: {},
				ajaxSettings: {
					url: yn,
					type: "GET",
					isLocal: Cn.test(mn[1]),
					global: !0,
					processData: !0,
					async: !0,
					contentType:
						"application/x-www-form-urlencoded; charset=UTF-8",
					accepts: {
						"*": Dn,
						text: "text/plain",
						html: "text/html",
						xml: "application/xml, text/xml",
						json: "application/json, text/javascript"
					},
					contents: { xml: /xml/, html: /html/, json: /json/ },
					responseFields: {
						xml: "responseXML",
						text: "responseText",
						json: "responseJSON"
					},
					converters: {
						"* text": String,
						"text html": !0,
						"text json": x.parseJSON,
						"text xml": x.parseXML
					},
					flatOptions: { url: !0, context: !0 }
				},
				ajaxSetup: function(e, t) {
					return t
						? _n(_n(e, x.ajaxSettings), t)
						: _n(x.ajaxSettings, e);
				},
				ajaxPrefilter: Hn(An),
				ajaxTransport: Hn(jn),
				ajax: function(e, n) {
					function k(e, n, r, i) {
						var c,
							y,
							v,
							w,
							T,
							N = n;
						2 !== b &&
							((b = 2),
							s && clearTimeout(s),
							(u = t),
							(a = i || ""),
							(C.readyState = e > 0 ? 4 : 0),
							(c = (e >= 200 && 300 > e) || 304 === e),
							r && (w = Mn(p, C, r)),
							(w = On(p, w, C, c)),
							c
								? (p.ifModified &&
										((T = C.getResponseHeader(
											"Last-Modified"
										)),
										T && (x.lastModified[o] = T),
										(T = C.getResponseHeader("etag")),
										T && (x.etag[o] = T)),
									204 === e || "HEAD" === p.type
										? (N = "nocontent")
										: 304 === e
											? (N = "notmodified")
											: ((N = w.state),
												(y = w.data),
												(v = w.error),
												(c = !v)))
								: ((v = N),
									(e || !N) &&
										((N = "error"), 0 > e && (e = 0))),
							(C.status = e),
							(C.statusText = (n || N) + ""),
							c
								? h.resolveWith(f, [y, N, C])
								: h.rejectWith(f, [C, N, v]),
							C.statusCode(m),
							(m = t),
							l &&
								d.trigger(c ? "ajaxSuccess" : "ajaxError", [
									C,
									p,
									c ? y : v
								]),
							g.fireWith(f, [C, N]),
							l &&
								(d.trigger("ajaxComplete", [C, p]),
								--x.active || x.event.trigger("ajaxStop")));
					}
					"object" == typeof e && ((n = e), (e = t)), (n = n || {});
					var r,
						i,
						o,
						a,
						s,
						l,
						u,
						c,
						p = x.ajaxSetup({}, n),
						f = p.context || p,
						d =
							p.context && (f.nodeType || f.jquery)
								? x(f)
								: x.event,
						h = x.Deferred(),
						g = x.Callbacks("once memory"),
						m = p.statusCode || {},
						y = {},
						v = {},
						b = 0,
						w = "canceled",
						C = {
							readyState: 0,
							getResponseHeader: function(e) {
								var t;
								if (2 === b) {
									if (!c)
										for (c = {}; (t = Tn.exec(a)); )
											c[t[1].toLowerCase()] = t[2];
									t = c[e.toLowerCase()];
								}
								return null == t ? null : t;
							},
							getAllResponseHeaders: function() {
								return 2 === b ? a : null;
							},
							setRequestHeader: function(e, t) {
								var n = e.toLowerCase();
								return (
									b || ((e = v[n] = v[n] || e), (y[e] = t)),
									this
								);
							},
							overrideMimeType: function(e) {
								return b || (p.mimeType = e), this;
							},
							statusCode: function(e) {
								var t;
								if (e)
									if (2 > b) for (t in e) m[t] = [m[t], e[t]];
									else C.always(e[C.status]);
								return this;
							},
							abort: function(e) {
								var t = e || w;
								return u && u.abort(t), k(0, t), this;
							}
						};
					if (
						((h.promise(C).complete = g.add),
						(C.success = C.done),
						(C.error = C.fail),
						(p.url = ((e || p.url || yn) + "")
							.replace(xn, "")
							.replace(kn, mn[1] + "//")),
						(p.type = n.method || n.type || p.method || p.type),
						(p.dataTypes = x
							.trim(p.dataType || "*")
							.toLowerCase()
							.match(T) || [""]),
						null == p.crossDomain &&
							((r = En.exec(p.url.toLowerCase())),
							(p.crossDomain = !(
								!r ||
								(r[1] === mn[1] &&
									r[2] === mn[2] &&
									(r[3] ||
										("http:" === r[1] ? "80" : "443")) ===
										(mn[3] ||
											("http:" === mn[1] ? "80" : "443")))
							))),
						p.data &&
							p.processData &&
							"string" != typeof p.data &&
							(p.data = x.param(p.data, p.traditional)),
						qn(An, p, n, C),
						2 === b)
					)
						return C;
					(l = p.global),
						l && 0 === x.active++ && x.event.trigger("ajaxStart"),
						(p.type = p.type.toUpperCase()),
						(p.hasContent = !Nn.test(p.type)),
						(o = p.url),
						p.hasContent ||
							(p.data &&
								((o = p.url +=
									(bn.test(o) ? "&" : "?") + p.data),
								delete p.data),
							p.cache === !1 &&
								(p.url = wn.test(o)
									? o.replace(wn, "$1_=" + vn++)
									: o +
										(bn.test(o) ? "&" : "?") +
										"_=" +
										vn++)),
						p.ifModified &&
							(x.lastModified[o] &&
								C.setRequestHeader(
									"If-Modified-Since",
									x.lastModified[o]
								),
							x.etag[o] &&
								C.setRequestHeader("If-None-Match", x.etag[o])),
						((p.data && p.hasContent && p.contentType !== !1) ||
							n.contentType) &&
							C.setRequestHeader("Content-Type", p.contentType),
						C.setRequestHeader(
							"Accept",
							p.dataTypes[0] && p.accepts[p.dataTypes[0]]
								? p.accepts[p.dataTypes[0]] +
									("*" !== p.dataTypes[0]
										? ", " + Dn + "; q=0.01"
										: "")
								: p.accepts["*"]
						);
					for (i in p.headers) C.setRequestHeader(i, p.headers[i]);
					if (
						p.beforeSend &&
						(p.beforeSend.call(f, C, p) === !1 || 2 === b)
					)
						return C.abort();
					w = "abort";
					for (i in { success: 1, error: 1, complete: 1 }) C[i](p[i]);
					if ((u = qn(jn, p, n, C))) {
						(C.readyState = 1),
							l && d.trigger("ajaxSend", [C, p]),
							p.async &&
								p.timeout > 0 &&
								(s = setTimeout(function() {
									C.abort("timeout");
								}, p.timeout));
						try {
							(b = 1), u.send(y, k);
						} catch (N) {
							if (!(2 > b)) throw N;
							k(-1, N);
						}
					} else k(-1, "No Transport");
					return C;
				},
				getJSON: function(e, t, n) {
					return x.get(e, t, n, "json");
				},
				getScript: function(e, n) {
					return x.get(e, t, n, "script");
				}
			}),
			x.each(["get", "post"], function(e, n) {
				x[n] = function(e, r, i, o) {
					return (
						x.isFunction(r) && ((o = o || i), (i = r), (r = t)),
						x.ajax({
							url: e,
							type: n,
							dataType: o,
							data: r,
							success: i
						})
					);
				};
			}),
			x.ajaxSetup({
				accepts: {
					script:
						"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
				},
				contents: { script: /(?:java|ecma)script/ },
				converters: {
					"text script": function(e) {
						return x.globalEval(e), e;
					}
				}
			}),
			x.ajaxPrefilter("script", function(e) {
				e.cache === t && (e.cache = !1),
					e.crossDomain && ((e.type = "GET"), (e.global = !1));
			}),
			x.ajaxTransport("script", function(e) {
				if (e.crossDomain) {
					var n,
						r = a.head || x("head")[0] || a.documentElement;
					return {
						send: function(t, i) {
							(n = a.createElement("script")),
								(n.async = !0),
								e.scriptCharset &&
									(n.charset = e.scriptCharset),
								(n.src = e.url),
								(n.onload = n.onreadystatechange = function(
									e,
									t
								) {
									(t ||
										!n.readyState ||
										/loaded|complete/.test(n.readyState)) &&
										((n.onload = n.onreadystatechange = null),
										n.parentNode &&
											n.parentNode.removeChild(n),
										(n = null),
										t || i(200, "success"));
								}),
								r.insertBefore(n, r.firstChild);
						},
						abort: function() {
							n && n.onload(t, !0);
						}
					};
				}
			});
		var Fn = [],
			Bn = /(=)\?(?=&|$)|\?\?/;
		x.ajaxSetup({
			jsonp: "callback",
			jsonpCallback: function() {
				var e = Fn.pop() || x.expando + "_" + vn++;
				return (this[e] = !0), e;
			}
		}),
			x.ajaxPrefilter("json jsonp", function(n, r, i) {
				var o,
					a,
					s,
					l =
						n.jsonp !== !1 &&
						(Bn.test(n.url)
							? "url"
							: "string" == typeof n.data &&
								!(n.contentType || "").indexOf(
									"application/x-www-form-urlencoded"
								) &&
								Bn.test(n.data) &&
								"data");
				return l || "jsonp" === n.dataTypes[0]
					? ((o = n.jsonpCallback = x.isFunction(n.jsonpCallback)
							? n.jsonpCallback()
							: n.jsonpCallback),
						l
							? (n[l] = n[l].replace(Bn, "$1" + o))
							: n.jsonp !== !1 &&
								(n.url +=
									(bn.test(n.url) ? "&" : "?") +
									n.jsonp +
									"=" +
									o),
						(n.converters["script json"] = function() {
							return s || x.error(o + " was not called"), s[0];
						}),
						(n.dataTypes[0] = "json"),
						(a = e[o]),
						(e[o] = function() {
							s = arguments;
						}),
						i.always(function() {
							(e[o] = a),
								n[o] &&
									((n.jsonpCallback = r.jsonpCallback),
									Fn.push(o)),
								s && x.isFunction(a) && a(s[0]),
								(s = a = t);
						}),
						"script")
					: t;
			});
		var Pn,
			Rn,
			Wn = 0,
			$n =
				e.ActiveXObject &&
				function() {
					var e;
					for (e in Pn) Pn[e](t, !0);
				};
		(x.ajaxSettings.xhr = e.ActiveXObject
			? function() {
					return (!this.isLocal && In()) || zn();
				}
			: In),
			(Rn = x.ajaxSettings.xhr()),
			(x.support.cors = !!Rn && "withCredentials" in Rn),
			(Rn = x.support.ajax = !!Rn),
			Rn &&
				x.ajaxTransport(function(n) {
					if (!n.crossDomain || x.support.cors) {
						var r;
						return {
							send: function(i, o) {
								var a,
									s,
									l = n.xhr();
								if (
									(n.username
										? l.open(
												n.type,
												n.url,
												n.async,
												n.username,
												n.password
											)
										: l.open(n.type, n.url, n.async),
									n.xhrFields)
								)
									for (s in n.xhrFields)
										l[s] = n.xhrFields[s];
								n.mimeType &&
									l.overrideMimeType &&
									l.overrideMimeType(n.mimeType),
									n.crossDomain ||
										i["X-Requested-With"] ||
										(i["X-Requested-With"] =
											"XMLHttpRequest");
								try {
									for (s in i) l.setRequestHeader(s, i[s]);
								} catch (u) {}
								l.send((n.hasContent && n.data) || null),
									(r = function(e, i) {
										var s, u, c, p;
										try {
											if (r && (i || 4 === l.readyState))
												if (
													((r = t),
													a &&
														((l.onreadystatechange =
															x.noop),
														$n && delete Pn[a]),
													i)
												)
													4 !== l.readyState &&
														l.abort();
												else {
													(p = {}),
														(s = l.status),
														(u = l.getAllResponseHeaders()),
														"string" ==
															typeof l.responseText &&
															(p.text =
																l.responseText);
													try {
														c = l.statusText;
													} catch (f) {
														c = "";
													}
													s ||
													!n.isLocal ||
													n.crossDomain
														? 1223 === s &&
															(s = 204)
														: (s = p.text
																? 200
																: 404);
												}
										} catch (d) {
											i || o(-1, d);
										}
										p && o(s, c, p, u);
									}),
									n.async
										? 4 === l.readyState
											? setTimeout(r)
											: ((a = ++Wn),
												$n &&
													(Pn ||
														((Pn = {}),
														x(e).unload($n)),
													(Pn[a] = r)),
												(l.onreadystatechange = r))
										: r();
							},
							abort: function() {
								r && r(t, !0);
							}
						};
					}
				});
		var Xn,
			Un,
			Vn = /^(?:toggle|show|hide)$/,
			Yn = RegExp("^(?:([+-])=|)(" + w + ")([a-z%]*)$", "i"),
			Jn = /queueHooks$/,
			Gn = [nr],
			Qn = {
				"*": [
					function(e, t) {
						var n = this.createTween(e, t),
							r = n.cur(),
							i = Yn.exec(t),
							o = (i && i[3]) || (x.cssNumber[e] ? "" : "px"),
							a =
								(x.cssNumber[e] || ("px" !== o && +r)) &&
								Yn.exec(x.css(n.elem, e)),
							s = 1,
							l = 20;
						if (a && a[3] !== o) {
							(o = o || a[3]), (i = i || []), (a = +r || 1);
							do
								(s = s || ".5"),
									(a /= s),
									x.style(n.elem, e, a + o);
							while (s !== (s = n.cur() / r) && 1 !== s && --l);
						}
						return (
							i &&
								((a = n.start = +a || +r || 0),
								(n.unit = o),
								(n.end = i[1] ? a + (i[1] + 1) * i[2] : +i[2])),
							n
						);
					}
				]
			};
		(x.Animation = x.extend(er, {
			tweener: function(e, t) {
				x.isFunction(e) ? ((t = e), (e = ["*"])) : (e = e.split(" "));
				for (var n, r = 0, i = e.length; i > r; r++)
					(n = e[r]), (Qn[n] = Qn[n] || []), Qn[n].unshift(t);
			},
			prefilter: function(e, t) {
				t ? Gn.unshift(e) : Gn.push(e);
			}
		})),
			(x.Tween = rr),
			(rr.prototype = {
				constructor: rr,
				init: function(e, t, n, r, i, o) {
					(this.elem = e),
						(this.prop = n),
						(this.easing = i || "swing"),
						(this.options = t),
						(this.start = this.now = this.cur()),
						(this.end = r),
						(this.unit = o || (x.cssNumber[n] ? "" : "px"));
				},
				cur: function() {
					var e = rr.propHooks[this.prop];
					return e && e.get
						? e.get(this)
						: rr.propHooks._default.get(this);
				},
				run: function(e) {
					var t,
						n = rr.propHooks[this.prop];
					return (
						(this.pos = t = this.options.duration
							? x.easing[this.easing](
									e,
									this.options.duration * e,
									0,
									1,
									this.options.duration
								)
							: e),
						(this.now = (this.end - this.start) * t + this.start),
						this.options.step &&
							this.options.step.call(this.elem, this.now, this),
						n && n.set
							? n.set(this)
							: rr.propHooks._default.set(this),
						this
					);
				}
			}),
			(rr.prototype.init.prototype = rr.prototype),
			(rr.propHooks = {
				_default: {
					get: function(e) {
						var t;
						return null == e.elem[e.prop] ||
							(e.elem.style && null != e.elem.style[e.prop])
							? ((t = x.css(e.elem, e.prop, "")),
								t && "auto" !== t ? t : 0)
							: e.elem[e.prop];
					},
					set: function(e) {
						x.fx.step[e.prop]
							? x.fx.step[e.prop](e)
							: e.elem.style &&
								(null != e.elem.style[x.cssProps[e.prop]] ||
									x.cssHooks[e.prop])
								? x.style(e.elem, e.prop, e.now + e.unit)
								: (e.elem[e.prop] = e.now);
					}
				}
			}),
			(rr.propHooks.scrollTop = rr.propHooks.scrollLeft = {
				set: function(e) {
					e.elem.nodeType &&
						e.elem.parentNode &&
						(e.elem[e.prop] = e.now);
				}
			}),
			x.each(["toggle", "show", "hide"], function(e, t) {
				var n = x.fn[t];
				x.fn[t] = function(e, r, i) {
					return null == e || "boolean" == typeof e
						? n.apply(this, arguments)
						: this.animate(ir(t, !0), e, r, i);
				};
			}),
			x.fn.extend({
				fadeTo: function(e, t, n, r) {
					return this.filter(nn)
						.css("opacity", 0)
						.show()
						.end()
						.animate({ opacity: t }, e, n, r);
				},
				animate: function(e, t, n, r) {
					var i = x.isEmptyObject(e),
						o = x.speed(t, n, r),
						a = function() {
							var t = er(this, x.extend({}, e), o);
							(i || x._data(this, "finish")) && t.stop(!0);
						};
					return (
						(a.finish = a),
						i || o.queue === !1
							? this.each(a)
							: this.queue(o.queue, a)
					);
				},
				stop: function(e, n, r) {
					var i = function(e) {
						var t = e.stop;
						delete e.stop, t(r);
					};
					return (
						"string" != typeof e && ((r = n), (n = e), (e = t)),
						n && e !== !1 && this.queue(e || "fx", []),
						this.each(function() {
							var t = !0,
								n = null != e && e + "queueHooks",
								o = x.timers,
								a = x._data(this);
							if (n) a[n] && a[n].stop && i(a[n]);
							else
								for (n in a)
									a[n] && a[n].stop && Jn.test(n) && i(a[n]);
							for (n = o.length; n--; )
								o[n].elem !== this ||
									(null != e && o[n].queue !== e) ||
									(o[n].anim.stop(r),
									(t = !1),
									o.splice(n, 1));
							(t || !r) && x.dequeue(this, e);
						})
					);
				},
				finish: function(e) {
					return (
						e !== !1 && (e = e || "fx"),
						this.each(function() {
							var t,
								n = x._data(this),
								r = n[e + "queue"],
								i = n[e + "queueHooks"],
								o = x.timers,
								a = r ? r.length : 0;
							for (
								n.finish = !0,
									x.queue(this, e, []),
									i && i.stop && i.stop.call(this, !0),
									t = o.length;
								t--;

							)
								o[t].elem === this &&
									o[t].queue === e &&
									(o[t].anim.stop(!0), o.splice(t, 1));
							for (t = 0; a > t; t++)
								r[t] && r[t].finish && r[t].finish.call(this);
							delete n.finish;
						})
					);
				}
			}),
			x.each(
				{
					slideDown: ir("show"),
					slideUp: ir("hide"),
					slideToggle: ir("toggle"),
					fadeIn: { opacity: "show" },
					fadeOut: { opacity: "hide" },
					fadeToggle: { opacity: "toggle" }
				},
				function(e, t) {
					x.fn[e] = function(e, n, r) {
						return this.animate(t, e, n, r);
					};
				}
			),
			(x.speed = function(e, t, n) {
				var r =
					e && "object" == typeof e
						? x.extend({}, e)
						: {
								complete:
									n || (!n && t) || (x.isFunction(e) && e),
								duration: e,
								easing: (n && t) || (t && !x.isFunction(t) && t)
							};
				return (
					(r.duration = x.fx.off
						? 0
						: "number" == typeof r.duration
							? r.duration
							: r.duration in x.fx.speeds
								? x.fx.speeds[r.duration]
								: x.fx.speeds._default),
					(null == r.queue || r.queue === !0) && (r.queue = "fx"),
					(r.old = r.complete),
					(r.complete = function() {
						x.isFunction(r.old) && r.old.call(this),
							r.queue && x.dequeue(this, r.queue);
					}),
					r
				);
			}),
			(x.easing = {
				linear: function(e) {
					return e;
				},
				swing: function(e) {
					return 0.5 - Math.cos(e * Math.PI) / 2;
				}
			}),
			(x.timers = []),
			(x.fx = rr.prototype.init),
			(x.fx.tick = function() {
				var e,
					n = x.timers,
					r = 0;
				for (Xn = x.now(); n.length > r; r++)
					(e = n[r]), e() || n[r] !== e || n.splice(r--, 1);
				n.length || x.fx.stop(), (Xn = t);
			}),
			(x.fx.timer = function(e) {
				e() && x.timers.push(e) && x.fx.start();
			}),
			(x.fx.interval = 13),
			(x.fx.start = function() {
				Un || (Un = setInterval(x.fx.tick, x.fx.interval));
			}),
			(x.fx.stop = function() {
				clearInterval(Un), (Un = null);
			}),
			(x.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
			(x.fx.step = {}),
			x.expr &&
				x.expr.filters &&
				(x.expr.filters.animated = function(e) {
					return x.grep(x.timers, function(t) {
						return e === t.elem;
					}).length;
				}),
			(x.fn.offset = function(e) {
				if (arguments.length)
					return e === t
						? this
						: this.each(function(t) {
								x.offset.setOffset(this, e, t);
							});
				var n,
					r,
					o = { top: 0, left: 0 },
					a = this[0],
					s = a && a.ownerDocument;
				return s
					? ((n = s.documentElement),
						x.contains(n, a)
							? (typeof a.getBoundingClientRect !== i &&
									(o = a.getBoundingClientRect()),
								(r = or(s)),
								{
									top:
										o.top +
										(r.pageYOffset || n.scrollTop) -
										(n.clientTop || 0),
									left:
										o.left +
										(r.pageXOffset || n.scrollLeft) -
										(n.clientLeft || 0)
								})
							: o)
					: void 0;
			}),
			(x.offset = {
				setOffset: function(e, t, n) {
					var r = x.css(e, "position");
					"static" === r && (e.style.position = "relative");
					var p,
						f,
						i = x(e),
						o = i.offset(),
						a = x.css(e, "top"),
						s = x.css(e, "left"),
						l =
							("absolute" === r || "fixed" === r) &&
							x.inArray("auto", [a, s]) > -1,
						u = {},
						c = {};
					l
						? ((c = i.position()), (p = c.top), (f = c.left))
						: ((p = parseFloat(a) || 0), (f = parseFloat(s) || 0)),
						x.isFunction(t) && (t = t.call(e, n, o)),
						null != t.top && (u.top = t.top - o.top + p),
						null != t.left && (u.left = t.left - o.left + f),
						"using" in t ? t.using.call(e, u) : i.css(u);
				}
			}),
			x.fn.extend({
				position: function() {
					if (this[0]) {
						var e,
							t,
							n = { top: 0, left: 0 },
							r = this[0];
						return (
							"fixed" === x.css(r, "position")
								? (t = r.getBoundingClientRect())
								: ((e = this.offsetParent()),
									(t = this.offset()),
									x.nodeName(e[0], "html") || (n = e.offset()),
									(n.top += x.css(e[0], "borderTopWidth", !0)),
									(n.left += x.css(
										e[0],
										"borderLeftWidth",
										!0
									))),
							{
								top: t.top - n.top - x.css(r, "marginTop", !0),
								left:
									t.left - n.left - x.css(r, "marginLeft", !0)
							}
						);
					}
				},
				offsetParent: function() {
					return this.map(function() {
						for (
							var e = this.offsetParent || s;
							e &&
							!x.nodeName(e, "html") &&
							"static" === x.css(e, "position");

						)
							e = e.offsetParent;
						return e || s;
					});
				}
			}),
			x.each(
				{ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" },
				function(e, n) {
					var r = /Y/.test(n);
					x.fn[e] = function(i) {
						return x.access(
							this,
							function(e, i, o) {
								var a = or(e);
								return o === t
									? a
										? n in a
											? a[n]
											: a.document.documentElement[i]
										: e[i]
									: (a
											? a.scrollTo(
													r ? x(a).scrollLeft() : o,
													r ? o : x(a).scrollTop()
												)
											: (e[i] = o),
										t);
							},
							e,
							i,
							arguments.length,
							null
						);
					};
				}
			),
			x.each({ Height: "height", Width: "width" }, function(e, n) {
				x.each(
					{ padding: "inner" + e, content: n, "": "outer" + e },
					function(r, i) {
						x.fn[i] = function(i, o) {
							var a =
									arguments.length &&
									(r || "boolean" != typeof i),
								s =
									r ||
									(i === !0 || o === !0
										? "margin"
										: "border");
							return x.access(
								this,
								function(n, r, i) {
									var o;
									return x.isWindow(n)
										? n.document.documentElement[
												"client" + e
											]
										: 9 === n.nodeType
											? ((o = n.documentElement),
												Math.max(
													n.body["scroll" + e],
													o["scroll" + e],
													n.body["offset" + e],
													o["offset" + e],
													o["client" + e]
												))
											: i === t
												? x.css(n, r, s)
												: x.style(n, r, i, s);
								},
								n,
								a ? i : t,
								a,
								null
							);
						};
					}
				);
			}),
			(x.fn.size = function() {
				return this.length;
			}),
			(x.fn.andSelf = x.fn.addBack),
			"object" == typeof module &&
			module &&
			"object" == typeof module.exports
				? (module.exports = x)
				: ((e.jQuery = e.$ = x),
					"function" == typeof define &&
						define.amd &&
						define("jquery", [], function() {
							return x;
						}));
	})(window),
	"undefined" == typeof jQuery)
)
	throw new Error("Bootstrap requires jQuery");
+(function(a) {
	"use strict";
	function b() {
		var a = document.createElement("bootstrap"),
			b = {
				WebkitTransition: "webkitTransitionEnd",
				MozTransition: "transitionend",
				OTransition: "oTransitionEnd otransitionend",
				transition: "transitionend"
			};
		for (var c in b) if (void 0 !== a.style[c]) return { end: b[c] };
	}
	(a.fn.emulateTransitionEnd = function(b) {
		var c = !1,
			d = this;
		a(this).one(a.support.transition.end, function() {
			c = !0;
		});
		var e = function() {
			c || a(d).trigger(a.support.transition.end);
		};
		return setTimeout(e, b), this;
	}),
		a(function() {
			a.support.transition = b();
		});
})(jQuery),
	+(function(a) {
		"use strict";
		var b = '[data-dismiss="alert"]',
			c = function(c) {
				a(c).on("click", b, this.close);
			};
		c.prototype.close = function(b) {
			function c() {
				f.trigger("closed.bs.alert").remove();
			}
			var d = a(this),
				e = d.attr("data-target");
			e ||
				((e = d.attr("href")),
				(e = e && e.replace(/.*(?=#[^\s]*$)/, "")));
			var f = a(e);
			b && b.preventDefault(),
				f.length || (f = d.hasClass("alert") ? d : d.parent()),
				f.trigger((b = a.Event("close.bs.alert"))),
				b.isDefaultPrevented() ||
					(f.removeClass("in"),
					a.support.transition && f.hasClass("fade")
						? f
								.one(a.support.transition.end, c)
								.emulateTransitionEnd(150)
						: c());
		};
		var d = a.fn.alert;
		(a.fn.alert = function(b) {
			return this.each(function() {
				var d = a(this),
					e = d.data("bs.alert");
				e || d.data("bs.alert", (e = new c(this))),
					"string" == typeof b && e[b].call(d);
			});
		}),
			(a.fn.alert.Constructor = c),
			(a.fn.alert.noConflict = function() {
				return (a.fn.alert = d), this;
			}),
			a(document).on("click.bs.alert.data-api", b, c.prototype.close);
	})(jQuery),
	+(function(a) {
		"use strict";
		var b = function(c, d) {
			(this.$element = a(c)),
				(this.options = a.extend({}, b.DEFAULTS, d));
		};
		(b.DEFAULTS = { loadingText: "loading..." }),
			(b.prototype.setState = function(a) {
				var b = "disabled",
					c = this.$element,
					d = c.is("input") ? "val" : "html",
					e = c.data();
				(a += "Text"),
					e.resetText || c.data("resetText", c[d]()),
					c[d](e[a] || this.options[a]),
					setTimeout(function() {
						"loadingText" == a
							? c.addClass(b).attr(b, b)
							: c.removeClass(b).removeAttr(b);
					}, 0);
			}),
			(b.prototype.toggle = function() {
				var a = this.$element.closest('[data-toggle="buttons"]'),
					b = !0;
				if (a.length) {
					var c = this.$element.find("input");
					"radio" === c.prop("type") &&
						(c.prop("checked") && this.$element.hasClass("active")
							? (b = !1)
							: a.find(".active").removeClass("active")),
						b &&
							c
								.prop(
									"checked",
									!this.$element.hasClass("active")
								)
								.trigger("change");
				}
				b && this.$element.toggleClass("active");
			});
		var c = a.fn.button;
		(a.fn.button = function(c) {
			return this.each(function() {
				var d = a(this),
					e = d.data("bs.button"),
					f = "object" == typeof c && c;
				e || d.data("bs.button", (e = new b(this, f))),
					"toggle" == c ? e.toggle() : c && e.setState(c);
			});
		}),
			(a.fn.button.Constructor = b),
			(a.fn.button.noConflict = function() {
				return (a.fn.button = c), this;
			}),
			a(document).on(
				"click.bs.button.data-api",
				"[data-toggle^=button]",
				function(b) {
					var c = a(b.target);
					c.hasClass("btn") || (c = c.closest(".btn")),
						c.button("toggle"),
						b.preventDefault();
				}
			);
	})(jQuery),
	+(function(a) {
		"use strict";
		var b = function(b, c) {
			(this.$element = a(b)),
				(this.$indicators = this.$element.find(".carousel-indicators")),
				(this.options = c),
				(this.paused = this.sliding = this.interval = this.$active = this.$items = null),
				"hover" == this.options.pause &&
					this.$element
						.on("mouseenter", a.proxy(this.pause, this))
						.on("mouseleave", a.proxy(this.cycle, this));
		};
		(b.DEFAULTS = { interval: 5e3, pause: "hover", wrap: !0 }),
			(b.prototype.cycle = function(b) {
				return (
					b || (this.paused = !1),
					this.interval && clearInterval(this.interval),
					this.options.interval &&
						!this.paused &&
						(this.interval = setInterval(
							a.proxy(this.next, this),
							this.options.interval
						)),
					this
				);
			}),
			(b.prototype.getActiveIndex = function() {
				return (
					(this.$active = this.$element.find(".item.active")),
					(this.$items = this.$active.parent().children()),
					this.$items.index(this.$active)
				);
			}),
			(b.prototype.to = function(b) {
				var c = this,
					d = this.getActiveIndex();
				return b > this.$items.length - 1 || 0 > b
					? void 0
					: this.sliding
						? this.$element.one("slid.bs.carousel", function() {
								c.to(b);
							})
						: d == b
							? this.pause().cycle()
							: this.slide(
									b > d ? "next" : "prev",
									a(this.$items[b])
								);
			}),
			(b.prototype.pause = function(b) {
				return (
					b || (this.paused = !0),
					this.$element.find(".next, .prev").length &&
						a.support.transition.end &&
						(this.$element.trigger(a.support.transition.end),
						this.cycle(!0)),
					(this.interval = clearInterval(this.interval)),
					this
				);
			}),
			(b.prototype.next = function() {
				return this.sliding ? void 0 : this.slide("next");
			}),
			(b.prototype.prev = function() {
				return this.sliding ? void 0 : this.slide("prev");
			}),
			(b.prototype.slide = function(b, c) {
				var d = this.$element.find(".item.active"),
					e = c || d[b](),
					f = this.interval,
					g = "next" == b ? "left" : "right",
					h = "next" == b ? "first" : "last",
					i = this;
				if (!e.length) {
					if (!this.options.wrap) return;
					e = this.$element.find(".item")[h]();
				}
				(this.sliding = !0), f && this.pause();
				var j = a.Event("slide.bs.carousel", {
					relatedTarget: e[0],
					direction: g
				});
				if (!e.hasClass("active")) {
					if (
						(this.$indicators.length &&
							(this.$indicators
								.find(".active")
								.removeClass("active"),
							this.$element.one("slid.bs.carousel", function() {
								var b = a(
									i.$indicators.children()[i.getActiveIndex()]
								);
								b && b.addClass("active");
							})),
						a.support.transition && this.$element.hasClass("slide"))
					) {
						if ((this.$element.trigger(j), j.isDefaultPrevented()))
							return;
						e.addClass(b),
							e[0].offsetWidth,
							d.addClass(g),
							e.addClass(g),
							d
								.one(a.support.transition.end, function() {
									e
										.removeClass([b, g].join(" "))
										.addClass("active"),
										d.removeClass(["active", g].join(" ")),
										(i.sliding = !1),
										setTimeout(function() {
											i.$element.trigger(
												"slid.bs.carousel"
											);
										}, 0);
								})
								.emulateTransitionEnd(600);
					} else {
						if ((this.$element.trigger(j), j.isDefaultPrevented()))
							return;
						d.removeClass("active"),
							e.addClass("active"),
							(this.sliding = !1),
							this.$element.trigger("slid.bs.carousel");
					}
					return f && this.cycle(), this;
				}
			});
		var c = a.fn.carousel;
		(a.fn.carousel = function(c) {
			return this.each(function() {
				var d = a(this),
					e = d.data("bs.carousel"),
					f = a.extend(
						{},
						b.DEFAULTS,
						d.data(),
						"object" == typeof c && c
					),
					g = "string" == typeof c ? c : f.slide;
				e || d.data("bs.carousel", (e = new b(this, f))),
					"number" == typeof c
						? e.to(c)
						: g ? e[g]() : f.interval && e.pause().cycle();
			});
		}),
			(a.fn.carousel.Constructor = b),
			(a.fn.carousel.noConflict = function() {
				return (a.fn.carousel = c), this;
			}),
			a(document).on(
				"click.bs.carousel.data-api",
				"[data-slide], [data-slide-to]",
				function(b) {
					var c,
						d = a(this),
						e = a(
							d.attr("data-target") ||
								((c = d.attr("href")) &&
									c.replace(/.*(?=#[^\s]+$)/, ""))
						),
						f = a.extend({}, e.data(), d.data()),
						g = d.attr("data-slide-to");
					g && (f.interval = !1),
						e.carousel(f),
						(g = d.attr("data-slide-to")) &&
							e.data("bs.carousel").to(g),
						b.preventDefault();
				}
			),
			a(window).on("load", function() {
				a('[data-ride="carousel"]').each(function() {
					var b = a(this);
					b.carousel(b.data());
				});
			});
	})(jQuery),
	+(function(a) {
		"use strict";
		var b = function(c, d) {
			(this.$element = a(c)),
				(this.options = a.extend({}, b.DEFAULTS, d)),
				(this.transitioning = null),
				this.options.parent && (this.$parent = a(this.options.parent)),
				this.options.toggle && this.toggle();
		};
		(b.DEFAULTS = { toggle: !0 }),
			(b.prototype.dimension = function() {
				var a = this.$element.hasClass("width");
				return a ? "width" : "height";
			}),
			(b.prototype.show = function() {
				if (!this.transitioning && !this.$element.hasClass("in")) {
					var b = a.Event("show.bs.collapse");
					if ((this.$element.trigger(b), !b.isDefaultPrevented())) {
						var c =
							this.$parent && this.$parent.find("> .panel > .in");
						if (c && c.length) {
							var d = c.data("bs.collapse");
							if (d && d.transitioning) return;
							c.collapse("hide"),
								d || c.data("bs.collapse", null);
						}
						var e = this.dimension();
						this.$element
							.removeClass("collapse")
							.addClass("collapsing")
							[e](0),
							(this.transitioning = 1);
						var f = function() {
							this.$element
								.removeClass("collapsing")
								.addClass("in")
								[e]("auto"),
								(this.transitioning = 0),
								this.$element.trigger("shown.bs.collapse");
						};
						if (!a.support.transition) return f.call(this);
						var g = a.camelCase(["scroll", e].join("-"));
						this.$element
							.one(a.support.transition.end, a.proxy(f, this))
							.emulateTransitionEnd(350)
							[e](this.$element[0][g]);
					}
				}
			}),
			(b.prototype.hide = function() {
				if (!this.transitioning && this.$element.hasClass("in")) {
					var b = a.Event("hide.bs.collapse");
					if ((this.$element.trigger(b), !b.isDefaultPrevented())) {
						var c = this.dimension();
						this.$element[c](this.$element[c]())[0].offsetHeight,
							this.$element
								.addClass("collapsing")
								.removeClass("collapse")
								.removeClass("in"),
							(this.transitioning = 1);
						var d = function() {
							(this.transitioning = 0),
								this.$element
									.trigger("hidden.bs.collapse")
									.removeClass("collapsing")
									.addClass("collapse");
						};
						return a.support.transition
							? void this.$element[c](0)
									.one(
										a.support.transition.end,
										a.proxy(d, this)
									)
									.emulateTransitionEnd(350)
							: d.call(this);
					}
				}
			}),
			(b.prototype.toggle = function() {
				this[this.$element.hasClass("in") ? "hide" : "show"]();
			});
		var c = a.fn.collapse;
		(a.fn.collapse = function(c) {
			return this.each(function() {
				var d = a(this),
					e = d.data("bs.collapse"),
					f = a.extend(
						{},
						b.DEFAULTS,
						d.data(),
						"object" == typeof c && c
					);
				e || d.data("bs.collapse", (e = new b(this, f))),
					"string" == typeof c && e[c]();
			});
		}),
			(a.fn.collapse.Constructor = b),
			(a.fn.collapse.noConflict = function() {
				return (a.fn.collapse = c), this;
			}),
			a(document).on(
				"click.bs.collapse.data-api",
				"[data-toggle=collapse]",
				function(b) {
					var c,
						d = a(this),
						e =
							d.attr("data-target") ||
							b.preventDefault() ||
							((c = d.attr("href")) &&
								c.replace(/.*(?=#[^\s]+$)/, "")),
						f = a(e),
						g = f.data("bs.collapse"),
						h = g ? "toggle" : d.data(),
						i = d.attr("data-parent"),
						j = i && a(i);
					(g && g.transitioning) ||
						(j &&
							j
								.find(
									'[data-toggle=collapse][data-parent="' +
										i +
										'"]'
								)
								.not(d)
								.addClass("collapsed"),
						d[f.hasClass("in") ? "addClass" : "removeClass"](
							"collapsed"
						)),
						f.collapse(h);
				}
			);
	})(jQuery),
	+(function(a) {
		"use strict";
		function b() {
			a(d).remove(),
				a(e).each(function(b) {
					var d = c(a(this));
					d.hasClass("open") &&
						(d.trigger((b = a.Event("hide.bs.dropdown"))),
						b.isDefaultPrevented() ||
							d
								.removeClass("open")
								.trigger("hidden.bs.dropdown"));
				});
		}
		function c(b) {
			var c = b.attr("data-target");
			c ||
				((c = b.attr("href")),
				(c = c && /#/.test(c) && c.replace(/.*(?=#[^\s]*$)/, "")));
			var d = c && a(c);
			return d && d.length ? d : b.parent();
		}
		var d = ".dropdown-backdrop",
			e = "[data-toggle=dropdown]",
			f = function(b) {
				a(b).on("click.bs.dropdown", this.toggle);
			};
		(f.prototype.toggle = function(d) {
			var e = a(this);
			if (!e.is(".disabled, :disabled")) {
				var f = c(e),
					g = f.hasClass("open");
				if ((b(), !g)) {
					if (
						("ontouchstart" in document.documentElement &&
							!f.closest(".navbar-nav").length &&
							a('<div class="dropdown-backdrop"/>')
								.insertAfter(a(this))
								.on("click", b),
						f.trigger((d = a.Event("show.bs.dropdown"))),
						d.isDefaultPrevented())
					)
						return;
					f.toggleClass("open").trigger("shown.bs.dropdown"),
						e.focus();
				}
				return !1;
			}
		}),
			(f.prototype.keydown = function(b) {
				if (/(38|40|27)/.test(b.keyCode)) {
					var d = a(this);
					if (
						(b.preventDefault(),
						b.stopPropagation(),
						!d.is(".disabled, :disabled"))
					) {
						var f = c(d),
							g = f.hasClass("open");
						if (!g || (g && 27 == b.keyCode))
							return (
								27 == b.which && f.find(e).focus(), d.click()
							);
						var h = a("[role=menu] li:not(.divider):visible a", f);
						if (h.length) {
							var i = h.index(h.filter(":focus"));
							38 == b.keyCode && i > 0 && i--,
								40 == b.keyCode && i < h.length - 1 && i++,
								~i || (i = 0),
								h.eq(i).focus();
						}
					}
				}
			});
		var g = a.fn.dropdown;
		(a.fn.dropdown = function(b) {
			return this.each(function() {
				var c = a(this),
					d = c.data("bs.dropdown");
				d || c.data("bs.dropdown", (d = new f(this))),
					"string" == typeof b && d[b].call(c);
			});
		}),
			(a.fn.dropdown.Constructor = f),
			(a.fn.dropdown.noConflict = function() {
				return (a.fn.dropdown = g), this;
			}),
			a(document)
				.on("click.bs.dropdown.data-api", b)
				.on("click.bs.dropdown.data-api", ".dropdown form", function(
					a
				) {
					a.stopPropagation();
				})
				.on("click.bs.dropdown.data-api", e, f.prototype.toggle)
				.on(
					"keydown.bs.dropdown.data-api",
					e + ", [role=menu]",
					f.prototype.keydown
				);
	})(jQuery),
	+(function(a) {
		"use strict";
		var b = function(b, c) {
			(this.options = c),
				(this.$element = a(b)),
				(this.$backdrop = this.isShown = null),
				this.options.remote && this.$element.load(this.options.remote);
		};
		(b.DEFAULTS = { backdrop: !0, keyboard: !0, show: !0 }),
			(b.prototype.toggle = function(a) {
				return this[this.isShown ? "hide" : "show"](a);
			}),
			(b.prototype.show = function(b) {
				var c = this,
					d = a.Event("show.bs.modal", { relatedTarget: b });
				this.$element.trigger(d),
					this.isShown ||
						d.isDefaultPrevented() ||
						((this.isShown = !0),
						this.escape(),
						this.$element.on(
							"click.dismiss.modal",
							'[data-dismiss="modal"]',
							a.proxy(this.hide, this)
						),
						this.backdrop(function() {
							var d =
								a.support.transition &&
								c.$element.hasClass("fade");
							c.$element.parent().length ||
								c.$element.appendTo(document.body),
								c.$element.show(),
								d && c.$element[0].offsetWidth,
								c.$element
									.addClass("in")
									.attr("aria-hidden", !1),
								c.enforceFocus();
							var e = a.Event("shown.bs.modal", {
								relatedTarget: b
							});
							d
								? c.$element
										.find(".modal-dialog")
										.one(
											a.support.transition.end,
											function() {
												c.$element.focus().trigger(e);
											}
										)
										.emulateTransitionEnd(300)
								: c.$element.focus().trigger(e);
						}));
			}),
			(b.prototype.hide = function(b) {
				b && b.preventDefault(),
					(b = a.Event("hide.bs.modal")),
					this.$element.trigger(b),
					this.isShown &&
						!b.isDefaultPrevented() &&
						((this.isShown = !1),
						this.escape(),
						a(document).off("focusin.bs.modal"),
						this.$element
							.removeClass("in")
							.attr("aria-hidden", !0)
							.off("click.dismiss.modal"),
						a.support.transition && this.$element.hasClass("fade")
							? this.$element
									.one(
										a.support.transition.end,
										a.proxy(this.hideModal, this)
									)
									.emulateTransitionEnd(300)
							: this.hideModal());
			}),
			(b.prototype.enforceFocus = function() {
				a(document)
					.off("focusin.bs.modal")
					.on(
						"focusin.bs.modal",
						a.proxy(function(a) {
							this.$element[0] === a.target ||
								this.$element.has(a.target).length ||
								this.$element.focus();
						}, this)
					);
			}),
			(b.prototype.escape = function() {
				this.isShown && this.options.keyboard
					? this.$element.on(
							"keyup.dismiss.bs.modal",
							a.proxy(function(a) {
								27 == a.which && this.hide();
							}, this)
						)
					: this.isShown ||
						this.$element.off("keyup.dismiss.bs.modal");
			}),
			(b.prototype.hideModal = function() {
				var a = this;
				this.$element.hide(),
					this.backdrop(function() {
						a.removeBackdrop(),
							a.$element.trigger("hidden.bs.modal");
					});
			}),
			(b.prototype.removeBackdrop = function() {
				this.$backdrop && this.$backdrop.remove(),
					(this.$backdrop = null);
			}),
			(b.prototype.backdrop = function(b) {
				var c = this.$element.hasClass("fade") ? "fade" : "";
				if (this.isShown && this.options.backdrop) {
					var d = a.support.transition && c;
					if (
						((this.$backdrop = a(
							'<div class="modal-backdrop ' + c + '" />'
						).appendTo(document.body)),
						this.$element.on(
							"click.dismiss.modal",
							a.proxy(function(a) {
								a.target === a.currentTarget &&
									("static" == this.options.backdrop
										? this.$element[0].focus.call(
												this.$element[0]
											)
										: this.hide.call(this));
							}, this)
						),
						d && this.$backdrop[0].offsetWidth,
						this.$backdrop.addClass("in"),
						!b)
					)
						return;
					d
						? this.$backdrop
								.one(a.support.transition.end, b)
								.emulateTransitionEnd(150)
						: b();
				} else
					!this.isShown && this.$backdrop
						? (this.$backdrop.removeClass("in"),
							a.support.transition && this.$element.hasClass("fade")
								? this.$backdrop
										.one(a.support.transition.end, b)
										.emulateTransitionEnd(150)
								: b())
						: b && b();
			});
		var c = a.fn.modal;
		(a.fn.modal = function(c, d) {
			return this.each(function() {
				var e = a(this),
					f = e.data("bs.modal"),
					g = a.extend(
						{},
						b.DEFAULTS,
						e.data(),
						"object" == typeof c && c
					);
				f || e.data("bs.modal", (f = new b(this, g))),
					"string" == typeof c ? f[c](d) : g.show && f.show(d);
			});
		}),
			(a.fn.modal.Constructor = b),
			(a.fn.modal.noConflict = function() {
				return (a.fn.modal = c), this;
			}),
			a(document).on(
				"click.bs.modal.data-api",
				'[data-toggle="modal"]',
				function(b) {
					var c = a(this),
						d = c.attr("href"),
						e = a(
							c.attr("data-target") ||
								(d && d.replace(/.*(?=#[^\s]+$)/, ""))
						),
						f = e.data("modal")
							? "toggle"
							: a.extend(
									{ remote: !/#/.test(d) && d },
									e.data(),
									c.data()
								);
					b.preventDefault(),
						e.modal(f, this).one("hide", function() {
							c.is(":visible") && c.focus();
						});
				}
			),
			a(document)
				.on("show.bs.modal", ".modal", function() {
					a(document.body).addClass("modal-open");
				})
				.on("hidden.bs.modal", ".modal", function() {
					a(document.body).removeClass("modal-open");
				});
	})(jQuery),
	+(function(a) {
		"use strict";
		var b = function(a, b) {
			(this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null),
				this.init("tooltip", a, b);
		};
		(b.DEFAULTS = {
			animation: !0,
			placement: "top",
			selector: !1,
			template:
				'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
			trigger: "hover focus",
			title: "",
			delay: 0,
			html: !1,
			container: !1
		}),
			(b.prototype.init = function(b, c, d) {
				(this.enabled = !0),
					(this.type = b),
					(this.$element = a(c)),
					(this.options = this.getOptions(d));
				for (
					var e = this.options.trigger.split(" "), f = e.length;
					f--;

				) {
					var g = e[f];
					if ("click" == g)
						this.$element.on(
							"click." + this.type,
							this.options.selector,
							a.proxy(this.toggle, this)
						);
					else if ("manual" != g) {
						var h = "hover" == g ? "mouseenter" : "focus",
							i = "hover" == g ? "mouseleave" : "blur";
						this.$element.on(
							h + "." + this.type,
							this.options.selector,
							a.proxy(this.enter, this)
						),
							this.$element.on(
								i + "." + this.type,
								this.options.selector,
								a.proxy(this.leave, this)
							);
					}
				}
				this.options.selector
					? (this._options = a.extend({}, this.options, {
							trigger: "manual",
							selector: ""
						}))
					: this.fixTitle();
			}),
			(b.prototype.getDefaults = function() {
				return b.DEFAULTS;
			}),
			(b.prototype.getOptions = function(b) {
				return (
					(b = a.extend(
						{},
						this.getDefaults(),
						this.$element.data(),
						b
					)),
					b.delay &&
						"number" == typeof b.delay &&
						(b.delay = { show: b.delay, hide: b.delay }),
					b
				);
			}),
			(b.prototype.getDelegateOptions = function() {
				var b = {},
					c = this.getDefaults();
				return (
					this._options &&
						a.each(this._options, function(a, d) {
							c[a] != d && (b[a] = d);
						}),
					b
				);
			}),
			(b.prototype.enter = function(b) {
				var c =
					b instanceof this.constructor
						? b
						: a(b.currentTarget)
								[this.type](this.getDelegateOptions())
								.data("bs." + this.type);
				return (
					clearTimeout(c.timeout),
					(c.hoverState = "in"),
					c.options.delay && c.options.delay.show
						? void (c.timeout = setTimeout(function() {
								"in" == c.hoverState && c.show();
							}, c.options.delay.show))
						: c.show()
				);
			}),
			(b.prototype.leave = function(b) {
				var c =
					b instanceof this.constructor
						? b
						: a(b.currentTarget)
								[this.type](this.getDelegateOptions())
								.data("bs." + this.type);
				return (
					clearTimeout(c.timeout),
					(c.hoverState = "out"),
					c.options.delay && c.options.delay.hide
						? void (c.timeout = setTimeout(function() {
								"out" == c.hoverState && c.hide();
							}, c.options.delay.hide))
						: c.hide()
				);
			}),
			(b.prototype.show = function() {
				var b = a.Event("show.bs." + this.type);
				if (this.hasContent() && this.enabled) {
					if ((this.$element.trigger(b), b.isDefaultPrevented()))
						return;
					var c = this.tip();
					this.setContent(),
						this.options.animation && c.addClass("fade");
					var d =
							"function" == typeof this.options.placement
								? this.options.placement.call(
										this,
										c[0],
										this.$element[0]
									)
								: this.options.placement,
						e = /\s?auto?\s?/i,
						f = e.test(d);
					f && (d = d.replace(e, "") || "top"),
						c
							.detach()
							.css({ top: 0, left: 0, display: "block" })
							.addClass(d),
						this.options.container
							? c.appendTo(this.options.container)
							: c.insertAfter(this.$element);
					var g = this.getPosition(),
						h = c[0].offsetWidth,
						i = c[0].offsetHeight;
					if (f) {
						var j = this.$element.parent(),
							k = d,
							l =
								document.documentElement.scrollTop ||
								document.body.scrollTop,
							m =
								"body" == this.options.container
									? window.innerWidth
									: j.outerWidth(),
							n =
								"body" == this.options.container
									? window.innerHeight
									: j.outerHeight(),
							o =
								"body" == this.options.container
									? 0
									: j.offset().left;
						(d =
							"bottom" == d && g.top + g.height + i - l > n
								? "top"
								: "top" == d && g.top - l - i < 0
									? "bottom"
									: "right" == d && g.right + h > m
										? "left"
										: "left" == d && g.left - h < o
											? "right"
											: d),
							c.removeClass(k).addClass(d);
					}
					var p = this.getCalculatedOffset(d, g, h, i);
					this.applyPlacement(p, d),
						this.$element.trigger("shown.bs." + this.type);
				}
			}),
			(b.prototype.applyPlacement = function(a, b) {
				var c,
					d = this.tip(),
					e = d[0].offsetWidth,
					f = d[0].offsetHeight,
					g = parseInt(d.css("margin-top"), 10),
					h = parseInt(d.css("margin-left"), 10);
				isNaN(g) && (g = 0),
					isNaN(h) && (h = 0),
					(a.top = a.top + g),
					(a.left = a.left + h),
					d.offset(a).addClass("in");
				var i = d[0].offsetWidth,
					j = d[0].offsetHeight;
				if (
					("top" == b &&
						j != f &&
						((c = !0), (a.top = a.top + f - j)),
					/bottom|top/.test(b))
				) {
					var k = 0;
					a.left < 0 &&
						((k = -2 * a.left),
						(a.left = 0),
						d.offset(a),
						(i = d[0].offsetWidth),
						(j = d[0].offsetHeight)),
						this.replaceArrow(k - e + i, i, "left");
				} else this.replaceArrow(j - f, j, "top");
				c && d.offset(a);
			}),
			(b.prototype.replaceArrow = function(a, b, c) {
				this.arrow().css(c, a ? 50 * (1 - a / b) + "%" : "");
			}),
			(b.prototype.setContent = function() {
				var a = this.tip(),
					b = this.getTitle();
				a
					.find(".tooltip-inner")
					[this.options.html ? "html" : "text"](b),
					a.removeClass("fade in top bottom left right");
			}),
			(b.prototype.hide = function() {
				function b() {
					"in" != c.hoverState && d.detach();
				}
				var c = this,
					d = this.tip(),
					e = a.Event("hide.bs." + this.type);
				return (
					this.$element.trigger(e),
					e.isDefaultPrevented()
						? void 0
						: (d.removeClass("in"),
							a.support.transition && this.$tip.hasClass("fade")
								? d
										.one(a.support.transition.end, b)
										.emulateTransitionEnd(150)
								: b(),
							this.$element.trigger("hidden.bs." + this.type),
							this)
				);
			}),
			(b.prototype.fixTitle = function() {
				var a = this.$element;
				(a.attr("title") ||
					"string" != typeof a.attr("data-original-title")) &&
					a
						.attr("data-original-title", a.attr("title") || "")
						.attr("title", "");
			}),
			(b.prototype.hasContent = function() {
				return this.getTitle();
			}),
			(b.prototype.getPosition = function() {
				var b = this.$element[0];
				return a.extend(
					{},
					"function" == typeof b.getBoundingClientRect
						? b.getBoundingClientRect()
						: { width: b.offsetWidth, height: b.offsetHeight },
					this.$element.offset()
				);
			}),
			(b.prototype.getCalculatedOffset = function(a, b, c, d) {
				return "bottom" == a
					? {
							top: b.top + b.height,
							left: b.left + b.width / 2 - c / 2
						}
					: "top" == a
						? { top: b.top - d, left: b.left + b.width / 2 - c / 2 }
						: "left" == a
							? {
									top: b.top + b.height / 2 - d / 2,
									left: b.left - c
								}
							: {
									top: b.top + b.height / 2 - d / 2,
									left: b.left + b.width
								};
			}),
			(b.prototype.getTitle = function() {
				var a,
					b = this.$element,
					c = this.options;
				return (a =
					b.attr("data-original-title") ||
					("function" == typeof c.title
						? c.title.call(b[0])
						: c.title));
			}),
			(b.prototype.tip = function() {
				return (this.$tip = this.$tip || a(this.options.template));
			}),
			(b.prototype.arrow = function() {
				return (this.$arrow =
					this.$arrow || this.tip().find(".tooltip-arrow"));
			}),
			(b.prototype.validate = function() {
				this.$element[0].parentNode ||
					(this.hide(),
					(this.$element = null),
					(this.options = null));
			}),
			(b.prototype.enable = function() {
				this.enabled = !0;
			}),
			(b.prototype.disable = function() {
				this.enabled = !1;
			}),
			(b.prototype.toggleEnabled = function() {
				this.enabled = !this.enabled;
			}),
			(b.prototype.toggle = function(b) {
				var c = b
					? a(b.currentTarget)
							[this.type](this.getDelegateOptions())
							.data("bs." + this.type)
					: this;
				c.tip().hasClass("in") ? c.leave(c) : c.enter(c);
			}),
			(b.prototype.destroy = function() {
				this.hide()
					.$element.off("." + this.type)
					.removeData("bs." + this.type);
			});
		var c = a.fn.tooltip;
		(a.fn.tooltip = function(c) {
			return this.each(function() {
				var d = a(this),
					e = d.data("bs.tooltip"),
					f = "object" == typeof c && c;
				e || d.data("bs.tooltip", (e = new b(this, f))),
					"string" == typeof c && e[c]();
			});
		}),
			(a.fn.tooltip.Constructor = b),
			(a.fn.tooltip.noConflict = function() {
				return (a.fn.tooltip = c), this;
			});
	})(jQuery),
	+(function(a) {
		"use strict";
		var b = function(a, b) {
			this.init("popover", a, b);
		};
		if (!a.fn.tooltip) throw new Error("Popover requires tooltip.js");
		(b.DEFAULTS = a.extend({}, a.fn.tooltip.Constructor.DEFAULTS, {
			placement: "right",
			trigger: "click",
			content: "",
			template:
				'<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
		})),
			(b.prototype = a.extend({}, a.fn.tooltip.Constructor.prototype)),
			(b.prototype.constructor = b),
			(b.prototype.getDefaults = function() {
				return b.DEFAULTS;
			}),
			(b.prototype.setContent = function() {
				var a = this.tip(),
					b = this.getTitle(),
					c = this.getContent();
				a
					.find(".popover-title")
					[this.options.html ? "html" : "text"](b),
					a
						.find(".popover-content")
						[this.options.html ? "html" : "text"](c),
					a.removeClass("fade top bottom left right in"),
					a.find(".popover-title").html() ||
						a.find(".popover-title").hide();
			}),
			(b.prototype.hasContent = function() {
				return this.getTitle() || this.getContent();
			}),
			(b.prototype.getContent = function() {
				var a = this.$element,
					b = this.options;
				return (
					a.attr("data-content") ||
					("function" == typeof b.content
						? b.content.call(a[0])
						: b.content)
				);
			}),
			(b.prototype.arrow = function() {
				return (this.$arrow = this.$arrow || this.tip().find(".arrow"));
			}),
			(b.prototype.tip = function() {
				return (
					this.$tip || (this.$tip = a(this.options.template)),
					this.$tip
				);
			});
		var c = a.fn.popover;
		(a.fn.popover = function(c) {
			return this.each(function() {
				var d = a(this),
					e = d.data("bs.popover"),
					f = "object" == typeof c && c;
				e || d.data("bs.popover", (e = new b(this, f))),
					"string" == typeof c && e[c]();
			});
		}),
			(a.fn.popover.Constructor = b),
			(a.fn.popover.noConflict = function() {
				return (a.fn.popover = c), this;
			});
	})(jQuery),
	+(function(a) {
		"use strict";
		function b(c, d) {
			var e,
				f = a.proxy(this.process, this);
			(this.$element = a(a(c).is("body") ? window : c)),
				(this.$body = a("body")),
				(this.$scrollElement = this.$element.on(
					"scroll.bs.scroll-spy.data-api",
					f
				)),
				(this.options = a.extend({}, b.DEFAULTS, d)),
				(this.selector =
					(this.options.target ||
						((e = a(c).attr("href")) &&
							e.replace(/.*(?=#[^\s]+$)/, "")) ||
						"") + " .nav li > a"),
				(this.offsets = a([])),
				(this.targets = a([])),
				(this.activeTarget = null),
				this.refresh(),
				this.process();
		}
		(b.DEFAULTS = { offset: 10 }),
			(b.prototype.refresh = function() {
				var b = this.$element[0] == window ? "offset" : "position";
				(this.offsets = a([])), (this.targets = a([]));
				var c = this;
				this.$body
					.find(this.selector)
					.map(function() {
						var d = a(this),
							e = d.data("target") || d.attr("href"),
							f = /^#\w/.test(e) && a(e);
						return (
							(f &&
								f.length && [
									[
										f[b]().top +
											(!a.isWindow(
												c.$scrollElement.get(0)
											) && c.$scrollElement.scrollTop()),
										e
									]
								]) ||
							null
						);
					})
					.sort(function(a, b) {
						return a[0] - b[0];
					})
					.each(function() {
						c.offsets.push(this[0]), c.targets.push(this[1]);
					});
			}),
			(b.prototype.process = function() {
				var a,
					b = this.$scrollElement.scrollTop() + this.options.offset,
					c =
						this.$scrollElement[0].scrollHeight ||
						this.$body[0].scrollHeight,
					d = c - this.$scrollElement.height(),
					e = this.offsets,
					f = this.targets,
					g = this.activeTarget;
				if (b >= d) return g != (a = f.last()[0]) && this.activate(a);
				for (a = e.length; a--; )
					g != f[a] &&
						b >= e[a] &&
						(!e[a + 1] || b <= e[a + 1]) &&
						this.activate(f[a]);
			}),
			(b.prototype.activate = function(b) {
				(this.activeTarget = b),
					a(this.selector)
						.parents(".active")
						.removeClass("active");
				var c =
						this.selector +
						'[data-target="' +
						b +
						'"],' +
						this.selector +
						'[href="' +
						b +
						'"]',
					d = a(c)
						.parents("li")
						.addClass("active");
				d.parent(".dropdown-menu").length &&
					(d = d.closest("li.dropdown").addClass("active")),
					d.trigger("activate.bs.scrollspy");
			});
		var c = a.fn.scrollspy;
		(a.fn.scrollspy = function(c) {
			return this.each(function() {
				var d = a(this),
					e = d.data("bs.scrollspy"),
					f = "object" == typeof c && c;
				e || d.data("bs.scrollspy", (e = new b(this, f))),
					"string" == typeof c && e[c]();
			});
		}),
			(a.fn.scrollspy.Constructor = b),
			(a.fn.scrollspy.noConflict = function() {
				return (a.fn.scrollspy = c), this;
			}),
			a(window).on("load", function() {
				a('[data-spy="scroll"]').each(function() {
					var b = a(this);
					b.scrollspy(b.data());
				});
			});
	})(jQuery),
	+(function(a) {
		"use strict";
		var b = function(b) {
			this.element = a(b);
		};
		(b.prototype.show = function() {
			var b = this.element,
				c = b.closest("ul:not(.dropdown-menu)"),
				d = b.data("target");
			if (
				(d ||
					((d = b.attr("href")),
					(d = d && d.replace(/.*(?=#[^\s]*$)/, ""))),
				!b.parent("li").hasClass("active"))
			) {
				var e = c.find(".active:last a")[0],
					f = a.Event("show.bs.tab", { relatedTarget: e });
				if ((b.trigger(f), !f.isDefaultPrevented())) {
					var g = a(d);
					this.activate(b.parent("li"), c),
						this.activate(g, g.parent(), function() {
							b.trigger({
								type: "shown.bs.tab",
								relatedTarget: e
							});
						});
				}
			}
		}),
			(b.prototype.activate = function(b, c, d) {
				function e() {
					f
						.removeClass("active")
						.find("> .dropdown-menu > .active")
						.removeClass("active"),
						b.addClass("active"),
						g
							? (b[0].offsetWidth, b.addClass("in"))
							: b.removeClass("fade"),
						b.parent(".dropdown-menu") &&
							b.closest("li.dropdown").addClass("active"),
						d && d();
				}
				var f = c.find("> .active"),
					g = d && a.support.transition && f.hasClass("fade");
				g
					? f
							.one(a.support.transition.end, e)
							.emulateTransitionEnd(150)
					: e(),
					f.removeClass("in");
			});
		var c = a.fn.tab;
		(a.fn.tab = function(c) {
			return this.each(function() {
				var d = a(this),
					e = d.data("bs.tab");
				e || d.data("bs.tab", (e = new b(this))),
					"string" == typeof c && e[c]();
			});
		}),
			(a.fn.tab.Constructor = b),
			(a.fn.tab.noConflict = function() {
				return (a.fn.tab = c), this;
			}),
			a(document).on(
				"click.bs.tab.data-api",
				'[data-toggle="tab"], [data-toggle="pill"]',
				function(b) {
					b.preventDefault(), a(this).tab("show");
				}
			);
	})(jQuery),
	+(function(a) {
		"use strict";
		var b = function(c, d) {
			(this.options = a.extend({}, b.DEFAULTS, d)),
				(this.$window = a(window)
					.on(
						"scroll.bs.affix.data-api",
						a.proxy(this.checkPosition, this)
					)
					.on(
						"click.bs.affix.data-api",
						a.proxy(this.checkPositionWithEventLoop, this)
					)),
				(this.$element = a(c)),
				(this.affixed = this.unpin = null),
				this.checkPosition();
		};
		(b.RESET = "affix affix-top affix-bottom"),
			(b.DEFAULTS = { offset: 0 }),
			(b.prototype.checkPositionWithEventLoop = function() {
				setTimeout(a.proxy(this.checkPosition, this), 1);
			}),
			(b.prototype.checkPosition = function() {
				if (this.$element.is(":visible")) {
					var c = a(document).height(),
						d = this.$window.scrollTop(),
						e = this.$element.offset(),
						f = this.options.offset,
						g = f.top,
						h = f.bottom;
					"object" != typeof f && (h = g = f),
						"function" == typeof g && (g = f.top()),
						"function" == typeof h && (h = f.bottom());
					var i =
						null != this.unpin && d + this.unpin <= e.top
							? !1
							: null != h &&
								e.top + this.$element.height() >= c - h
								? "bottom"
								: null != g && g >= d ? "top" : !1;
					this.affixed !== i &&
						(this.unpin && this.$element.css("top", ""),
						(this.affixed = i),
						(this.unpin = "bottom" == i ? e.top - d : null),
						this.$element
							.removeClass(b.RESET)
							.addClass("affix" + (i ? "-" + i : "")),
						"bottom" == i &&
							this.$element.offset({
								top:
									document.body.offsetHeight -
									h -
									this.$element.height()
							}));
				}
			});
		var c = a.fn.affix;
		(a.fn.affix = function(c) {
			return this.each(function() {
				var d = a(this),
					e = d.data("bs.affix"),
					f = "object" == typeof c && c;
				e || d.data("bs.affix", (e = new b(this, f))),
					"string" == typeof c && e[c]();
			});
		}),
			(a.fn.affix.Constructor = b),
			(a.fn.affix.noConflict = function() {
				return (a.fn.affix = c), this;
			}),
			a(window).on("load", function() {
				a('[data-spy="affix"]').each(function() {
					var b = a(this),
						c = b.data();
					(c.offset = c.offset || {}),
						c.offsetBottom && (c.offset.bottom = c.offsetBottom),
						c.offsetTop && (c.offset.top = c.offsetTop),
						b.affix(c);
				});
			});
	})(jQuery),
	(function(t) {
		t.extend(t.fn, {
			validate: function(e) {
				if (!this.length)
					return void (
						e &&
						e.debug &&
						window.console &&
						console.warn(
							"Nothing selected, can't validate, returning nothing."
						)
					);
				var i = t.data(this[0], "validator");
				return i
					? i
					: (this.attr("novalidate", "novalidate"),
						(i = new t.validator(e, this[0])),
						t.data(this[0], "validator", i),
						i.settings.onsubmit &&
							(this.validateDelegate(":submit", "click", function(
								e
							) {
								i.settings.submitHandler &&
									(i.submitButton = e.target),
									t(e.target).hasClass("cancel") &&
										(i.cancelSubmit = !0),
									void 0 !==
										t(e.target).attr("formnovalidate") &&
										(i.cancelSubmit = !0);
							}),
							this.submit(function(e) {
								function s() {
									var s;
									return i.settings.submitHandler
										? (i.submitButton &&
												(s = t("<input type='hidden'/>")
													.attr(
														"name",
														i.submitButton.name
													)
													.val(t(i.submitButton).val())
													.appendTo(i.currentForm)),
											i.settings.submitHandler.call(
												i,
												i.currentForm,
												e
											),
											i.submitButton && s.remove(),
											!1)
										: !0;
								}
								return (
									i.settings.debug && e.preventDefault(),
									i.cancelSubmit
										? ((i.cancelSubmit = !1), s())
										: i.form()
											? i.pendingRequest
												? ((i.formSubmitted = !0), !1)
												: s()
											: (i.focusInvalid(), !1)
								);
							})),
						i);
			},
			valid: function() {
				if (t(this[0]).is("form")) return this.validate().form();
				var e = !0,
					i = t(this[0].form).validate();
				return (
					this.each(function() {
						e = e && i.element(this);
					}),
					e
				);
			},
			removeAttrs: function(e) {
				var i = {},
					s = this;
				return (
					t.each(e.split(/\s/), function(t, e) {
						(i[e] = s.attr(e)), s.removeAttr(e);
					}),
					i
				);
			},
			rules: function(e, i) {
				var s = this[0];
				if (e) {
					var r = t.data(s.form, "validator").settings,
						n = r.rules,
						a = t.validator.staticRules(s);
					switch (e) {
						case "add":
							t.extend(a, t.validator.normalizeRule(i)),
								delete a.messages,
								(n[s.name] = a),
								i.messages &&
									(r.messages[s.name] = t.extend(
										r.messages[s.name],
										i.messages
									));
							break;
						case "remove":
							if (!i) return delete n[s.name], a;
							var u = {};
							return (
								t.each(i.split(/\s/), function(t, e) {
									(u[e] = a[e]), delete a[e];
								}),
								u
							);
					}
				}
				var o = t.validator.normalizeRules(
					t.extend(
						{},
						t.validator.classRules(s),
						t.validator.attributeRules(s),
						t.validator.dataRules(s),
						t.validator.staticRules(s)
					),
					s
				);
				if (o.required) {
					var l = o.required;
					delete o.required, (o = t.extend({ required: l }, o));
				}
				return o;
			}
		}),
			t.extend(t.expr[":"], {
				blank: function(e) {
					return !t.trim("" + t(e).val());
				},
				filled: function(e) {
					return !!t.trim("" + t(e).val());
				},
				unchecked: function(e) {
					return !t(e).prop("checked");
				}
			}),
			(t.validator = function(e, i) {
				(this.settings = t.extend(!0, {}, t.validator.defaults, e)),
					(this.currentForm = i),
					this.init();
			}),
			(t.validator.format = function(e, i) {
				return 1 === arguments.length
					? function() {
							var i = t.makeArray(arguments);
							return (
								i.unshift(e), t.validator.format.apply(this, i)
							);
						}
					: (arguments.length > 2 &&
							i.constructor !== Array &&
							(i = t.makeArray(arguments).slice(1)),
						i.constructor !== Array && (i = [i]),
						t.each(i, function(t, i) {
							e = e.replace(
								RegExp("\\{" + t + "\\}", "g"),
								function() {
									return i;
								}
							);
						}),
						e);
			}),
			t.extend(t.validator, {
				defaults: {
					messages: {},
					groups: {},
					rules: {},
					errorClass: "error",
					validClass: "valid",
					errorElement: "label",
					focusInvalid: !0,
					errorContainer: t([]),
					errorLabelContainer: t([]),
					onsubmit: !0,
					ignore: ":hidden",
					ignoreTitle: !1,
					onfocusin: function(t) {
						(this.lastActive = t),
							this.settings.focusCleanup &&
								!this.blockFocusCleanup &&
								(this.settings.unhighlight &&
									this.settings.unhighlight.call(
										this,
										t,
										this.settings.errorClass,
										this.settings.validClass
									),
								this.addWrapper(this.errorsFor(t)).hide());
					},
					onfocusout: function(t) {
						this.checkable(t) ||
							(!(t.name in this.submitted) && this.optional(t)) ||
							this.element(t);
					},
					onkeyup: function(t, e) {
						(9 !== e.which || "" !== this.elementValue(t)) &&
							(t.name in this.submitted ||
								t === this.lastElement) &&
							this.element(t);
					},
					onclick: function(t) {
						t.name in this.submitted
							? this.element(t)
							: t.parentNode.name in this.submitted &&
								this.element(t.parentNode);
					},
					highlight: function(e, i, s) {
						"radio" === e.type
							? this.findByName(e.name)
									.addClass(i)
									.removeClass(s)
							: t(e)
									.addClass(i)
									.removeClass(s);
					},
					unhighlight: function(e, i, s) {
						"radio" === e.type
							? this.findByName(e.name)
									.removeClass(i)
									.addClass(s)
							: t(e)
									.removeClass(i)
									.addClass(s);
					}
				},
				setDefaults: function(e) {
					t.extend(t.validator.defaults, e);
				},
				messages: {
					required: "This field is required.",
					remote: "Please fix this field.",
					email: "Please enter a valid email address.",
					url: "Please enter a valid URL.",
					date: "Please enter a valid date.",
					dateISO: "Please enter a valid date (ISO).",
					number: "Please enter a valid number.",
					digits: "Please enter only digits.",
					creditcard: "Please enter a valid credit card number.",
					equalTo: "Please enter the same value again.",
					maxlength: t.validator.format(
						"Please enter no more than {0} characters."
					),
					minlength: t.validator.format(
						"Please enter at least {0} characters."
					),
					rangelength: t.validator.format(
						"Please enter a value between {0} and {1} characters long."
					),
					range: t.validator.format(
						"Please enter a value between {0} and {1}."
					),
					max: t.validator.format(
						"Please enter a value less than or equal to {0}."
					),
					min: t.validator.format(
						"Please enter a value greater than or equal to {0}."
					)
				},
				autoCreateRanges: !1,
				prototype: {
					init: function() {
						function e(e) {
							var i = t.data(this[0].form, "validator"),
								s = "on" + e.type.replace(/^validate/, "");
							i.settings[s] && i.settings[s].call(i, this[0], e);
						}
						(this.labelContainer = t(
							this.settings.errorLabelContainer
						)),
							(this.errorContext =
								(this.labelContainer.length &&
									this.labelContainer) ||
								t(this.currentForm)),
							(this.containers = t(
								this.settings.errorContainer
							).add(this.settings.errorLabelContainer)),
							(this.submitted = {}),
							(this.valueCache = {}),
							(this.pendingRequest = 0),
							(this.pending = {}),
							(this.invalid = {}),
							this.reset();
						var i = (this.groups = {});
						t.each(this.settings.groups, function(e, s) {
							"string" == typeof s && (s = s.split(/\s/)),
								t.each(s, function(t, s) {
									i[s] = e;
								});
						});
						var s = this.settings.rules;
						t.each(s, function(e, i) {
							s[e] = t.validator.normalizeRule(i);
						}),
							t(this.currentForm)
								.validateDelegate(
									":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'] ",
									"focusin focusout keyup",
									e
								)
								.validateDelegate(
									"[type='radio'], [type='checkbox'], select, option",
									"click",
									e
								),
							this.settings.invalidHandler &&
								t(this.currentForm).bind(
									"invalid-form.validate",
									this.settings.invalidHandler
								);
					},
					form: function() {
						return (
							this.checkForm(),
							t.extend(this.submitted, this.errorMap),
							(this.invalid = t.extend({}, this.errorMap)),
							this.valid() ||
								t(this.currentForm).triggerHandler(
									"invalid-form",
									[this]
								),
							this.showErrors(),
							this.valid()
						);
					},
					checkForm: function() {
						this.prepareForm();
						for (
							var t = 0,
								e = (this.currentElements = this.elements());
							e[t];
							t++
						)
							this.check(e[t]);
						return this.valid();
					},
					element: function(e) {
						(e = this.validationTargetFor(this.clean(e))),
							(this.lastElement = e),
							this.prepareElement(e),
							(this.currentElements = t(e));
						var i = this.check(e) !== !1;
						return (
							i
								? delete this.invalid[e.name]
								: (this.invalid[e.name] = !0),
							this.numberOfInvalids() ||
								(this.toHide = this.toHide.add(
									this.containers
								)),
							this.showErrors(),
							i
						);
					},
					showErrors: function(e) {
						if (e) {
							t.extend(this.errorMap, e), (this.errorList = []);
							for (var i in e)
								this.errorList.push({
									message: e[i],
									element: this.findByName(i)[0]
								});
							this.successList = t.grep(
								this.successList,
								function(t) {
									return !(t.name in e);
								}
							);
						}
						this.settings.showErrors
							? this.settings.showErrors.call(
									this,
									this.errorMap,
									this.errorList
								)
							: this.defaultShowErrors();
					},
					resetForm: function() {
						t.fn.resetForm && t(this.currentForm).resetForm(),
							(this.submitted = {}),
							(this.lastElement = null),
							this.prepareForm(),
							this.hideErrors(),
							this.elements()
								.removeClass(this.settings.errorClass)
								.removeData("previousValue");
					},
					numberOfInvalids: function() {
						return this.objectLength(this.invalid);
					},
					objectLength: function(t) {
						var e = 0;
						for (var i in t) e++;
						return e;
					},
					hideErrors: function() {
						this.addWrapper(this.toHide).hide();
					},
					valid: function() {
						return 0 === this.size();
					},
					size: function() {
						return this.errorList.length;
					},
					focusInvalid: function() {
						if (this.settings.focusInvalid)
							try {
								t(
									this.findLastActive() ||
										(this.errorList.length &&
											this.errorList[0].element) ||
										[]
								)
									.filter(":visible")
									.focus()
									.trigger("focusin");
							} catch (e) {}
					},
					findLastActive: function() {
						var e = this.lastActive;
						return (
							e &&
							1 ===
								t.grep(this.errorList, function(t) {
									return t.element.name === e.name;
								}).length &&
							e
						);
					},
					elements: function() {
						var e = this,
							i = {};
						return t(this.currentForm)
							.find("input, select, textarea")
							.not(":submit, :reset, :image, [disabled]")
							.not(this.settings.ignore)
							.filter(function() {
								return (
									!this.name &&
										e.settings.debug &&
										window.console &&
										console.error(
											"%o has no name assigned",
											this
										),
									this.name in i ||
									!e.objectLength(t(this).rules())
										? !1
										: ((i[this.name] = !0), !0)
								);
							});
					},
					clean: function(e) {
						return t(e)[0];
					},
					errors: function() {
						var e = this.settings.errorClass.replace(" ", ".");
						return t(
							this.settings.errorElement + "." + e,
							this.errorContext
						);
					},
					reset: function() {
						(this.successList = []),
							(this.errorList = []),
							(this.errorMap = {}),
							(this.toShow = t([])),
							(this.toHide = t([])),
							(this.currentElements = t([]));
					},
					prepareForm: function() {
						this.reset(),
							(this.toHide = this.errors().add(this.containers));
					},
					prepareElement: function(t) {
						this.reset(), (this.toHide = this.errorsFor(t));
					},
					elementValue: function(e) {
						var i = t(e).attr("type"),
							s = t(e).val();
						return "radio" === i || "checkbox" === i
							? t(
									"input[name='" +
										t(e).attr("name") +
										"']:checked"
								).val()
							: "string" == typeof s ? s.replace(/\r/g, "") : s;
					},
					check: function(e) {
						e = this.validationTargetFor(this.clean(e));
						var i,
							s = t(e).rules(),
							r = !1,
							n = this.elementValue(e);
						for (var a in s) {
							var u = { method: a, parameters: s[a] };
							try {
								if (
									((i = t.validator.methods[a].call(
										this,
										n,
										e,
										u.parameters
									)),
									"dependency-mismatch" === i)
								) {
									r = !0;
									continue;
								}
								if (((r = !1), "pending" === i))
									return void (this.toHide = this.toHide.not(
										this.errorsFor(e)
									));
								if (!i) return this.formatAndAdd(e, u), !1;
							} catch (o) {
								throw (this.settings.debug &&
									window.console &&
									console.log(
										"Exception occurred when checking element " +
											e.id +
											", check the '" +
											u.method +
											"' method.",
										o
									),
								o);
							}
						}
						return r
							? void 0
							: (this.objectLength(s) && this.successList.push(e),
								!0);
					},
					customDataMessage: function(e, i) {
						return (
							t(e).data("msg-" + i.toLowerCase()) ||
							(e.attributes &&
								t(e).attr("data-msg-" + i.toLowerCase()))
						);
					},
					customMessage: function(t, e) {
						var i = this.settings.messages[t];
						return i && (i.constructor === String ? i : i[e]);
					},
					findDefined: function() {
						for (var t = 0; arguments.length > t; t++)
							if (void 0 !== arguments[t]) return arguments[t];
						return void 0;
					},
					defaultMessage: function(e, i) {
						return this.findDefined(
							this.customMessage(e.name, i),
							this.customDataMessage(e, i),
							(!this.settings.ignoreTitle && e.title) || void 0,
							t.validator.messages[i],
							"<strong>Warning: No message defined for " +
								e.name +
								"</strong>"
						);
					},
					formatAndAdd: function(e, i) {
						var s = this.defaultMessage(e, i.method),
							r = /\$?\{(\d+)\}/g;
						"function" == typeof s
							? (s = s.call(this, i.parameters, e))
							: r.test(s) &&
								(s = t.validator.format(
									s.replace(r, "{$1}"),
									i.parameters
								)),
							this.errorList.push({ message: s, element: e }),
							(this.errorMap[e.name] = s),
							(this.submitted[e.name] = s);
					},
					addWrapper: function(t) {
						return (
							this.settings.wrapper &&
								(t = t.add(t.parent(this.settings.wrapper))),
							t
						);
					},
					defaultShowErrors: function() {
						var t, e;
						for (t = 0; this.errorList[t]; t++) {
							var i = this.errorList[t];
							this.settings.highlight &&
								this.settings.highlight.call(
									this,
									i.element,
									this.settings.errorClass,
									this.settings.validClass
								),
								this.showLabel(i.element, i.message);
						}
						if (
							(this.errorList.length &&
								(this.toShow = this.toShow.add(
									this.containers
								)),
							this.settings.success)
						)
							for (t = 0; this.successList[t]; t++)
								this.showLabel(this.successList[t]);
						if (this.settings.unhighlight)
							for (t = 0, e = this.validElements(); e[t]; t++)
								this.settings.unhighlight.call(
									this,
									e[t],
									this.settings.errorClass,
									this.settings.validClass
								);
						(this.toHide = this.toHide.not(this.toShow)),
							this.hideErrors(),
							this.addWrapper(this.toShow).show();
					},
					validElements: function() {
						return this.currentElements.not(this.invalidElements());
					},
					invalidElements: function() {
						return t(this.errorList).map(function() {
							return this.element;
						});
					},
					showLabel: function(e, i) {
						var s = this.errorsFor(e);
						s.length
							? (s
									.removeClass(this.settings.validClass)
									.addClass(this.settings.errorClass),
								s.html(i))
							: ((s = t("<" + this.settings.errorElement + ">")
									.attr("for", this.idOrName(e))
									.addClass(this.settings.errorClass)
									.html(i || "")),
								this.settings.wrapper &&
									(s = s
										.hide()
										.show()
										.wrap("<" + this.settings.wrapper + "/>")
										.parent()),
								this.labelContainer.append(s).length ||
									(this.settings.errorPlacement
										? this.settings.errorPlacement(s, t(e))
										: s.insertAfter(e))),
							!i &&
								this.settings.success &&
								(s.text(""),
								"string" == typeof this.settings.success
									? s.addClass(this.settings.success)
									: this.settings.success(s, e)),
							(this.toShow = this.toShow.add(s));
					},
					errorsFor: function(e) {
						var i = this.idOrName(e);
						return this.errors().filter(function() {
							return t(this).attr("for") === i;
						});
					},
					idOrName: function(t) {
						return (
							this.groups[t.name] ||
							(this.checkable(t) ? t.name : t.id || t.name)
						);
					},
					validationTargetFor: function(t) {
						return (
							this.checkable(t) &&
								(t = this.findByName(t.name).not(
									this.settings.ignore
								)[0]),
							t
						);
					},
					checkable: function(t) {
						return /radio|checkbox/i.test(t.type);
					},
					findByName: function(e) {
						return t(this.currentForm).find("[name='" + e + "']");
					},
					getLength: function(e, i) {
						switch (i.nodeName.toLowerCase()) {
							case "select":
								return t("option:selected", i).length;
							case "input":
								if (this.checkable(i))
									return this.findByName(i.name).filter(
										":checked"
									).length;
						}
						return e.length;
					},
					depend: function(t, e) {
						return this.dependTypes[typeof t]
							? this.dependTypes[typeof t](t, e)
							: !0;
					},
					dependTypes: {
						boolean: function(t) {
							return t;
						},
						string: function(e, i) {
							return !!t(e, i.form).length;
						},
						function: function(t, e) {
							return t(e);
						}
					},
					optional: function(e) {
						var i = this.elementValue(e);
						return (
							!t.validator.methods.required.call(this, i, e) &&
							"dependency-mismatch"
						);
					},
					startRequest: function(t) {
						this.pending[t.name] ||
							(this.pendingRequest++,
							(this.pending[t.name] = !0));
					},
					stopRequest: function(e, i) {
						this.pendingRequest--,
							0 > this.pendingRequest &&
								(this.pendingRequest = 0),
							delete this.pending[e.name],
							i &&
							0 === this.pendingRequest &&
							this.formSubmitted &&
							this.form()
								? (t(this.currentForm).submit(),
									(this.formSubmitted = !1))
								: !i &&
									0 === this.pendingRequest &&
									this.formSubmitted &&
									(t(this.currentForm).triggerHandler(
										"invalid-form",
										[this]
									),
									(this.formSubmitted = !1));
					},
					previousValue: function(e) {
						return (
							t.data(e, "previousValue") ||
							t.data(e, "previousValue", {
								old: null,
								valid: !0,
								message: this.defaultMessage(e, "remote")
							})
						);
					}
				},
				classRuleSettings: {
					required: { required: !0 },
					email: { email: !0 },
					url: { url: !0 },
					date: { date: !0 },
					dateISO: { dateISO: !0 },
					number: { number: !0 },
					digits: { digits: !0 },
					creditcard: { creditcard: !0 }
				},
				addClassRules: function(e, i) {
					e.constructor === String
						? (this.classRuleSettings[e] = i)
						: t.extend(this.classRuleSettings, e);
				},
				classRules: function(e) {
					var i = {},
						s = t(e).attr("class");
					return (
						s &&
							t.each(s.split(" "), function() {
								this in t.validator.classRuleSettings &&
									t.extend(
										i,
										t.validator.classRuleSettings[this]
									);
							}),
						i
					);
				},
				attributeRules: function(e) {
					var i = {},
						s = t(e),
						r = s[0].getAttribute("type");
					for (var n in t.validator.methods) {
						var a;
						"required" === n
							? ((a = s.get(0).getAttribute(n)),
								"" === a && (a = !0),
								(a = !!a))
							: (a = s.attr(n)),
							/min|max/.test(n) &&
								(null === r || /number|range|text/.test(r)) &&
								(a = Number(a)),
							a
								? (i[n] = a)
								: r === n && "range" !== r && (i[n] = !0);
					}
					return (
						i.maxlength &&
							/-1|2147483647|524288/.test(i.maxlength) &&
							delete i.maxlength,
						i
					);
				},
				dataRules: function(e) {
					var i,
						s,
						r = {},
						n = t(e);
					for (i in t.validator.methods)
						(s = n.data("rule-" + i.toLowerCase())),
							void 0 !== s && (r[i] = s);
					return r;
				},
				staticRules: function(e) {
					var i = {},
						s = t.data(e.form, "validator");
					return (
						s.settings.rules &&
							(i =
								t.validator.normalizeRule(
									s.settings.rules[e.name]
								) || {}),
						i
					);
				},
				normalizeRules: function(e, i) {
					return (
						t.each(e, function(s, r) {
							if (r === !1) return void delete e[s];
							if (r.param || r.depends) {
								var n = !0;
								switch (typeof r.depends) {
									case "string":
										n = !!t(r.depends, i.form).length;
										break;
									case "function":
										n = r.depends.call(i, i);
								}
								n
									? (e[s] = void 0 !== r.param ? r.param : !0)
									: delete e[s];
							}
						}),
						t.each(e, function(s, r) {
							e[s] = t.isFunction(r) ? r(i) : r;
						}),
						t.each(["minlength", "maxlength"], function() {
							e[this] && (e[this] = Number(e[this]));
						}),
						t.each(["rangelength", "range"], function() {
							var i;
							e[this] &&
								(t.isArray(e[this])
									? (e[this] = [
											Number(e[this][0]),
											Number(e[this][1])
										])
									: "string" == typeof e[this] &&
										((i = e[this].split(/[\s,]+/)),
										(e[this] = [
											Number(i[0]),
											Number(i[1])
										])));
						}),
						t.validator.autoCreateRanges &&
							(e.min &&
								e.max &&
								((e.range = [e.min, e.max]),
								delete e.min,
								delete e.max),
							e.minlength &&
								e.maxlength &&
								((e.rangelength = [e.minlength, e.maxlength]),
								delete e.minlength,
								delete e.maxlength)),
						e
					);
				},
				normalizeRule: function(e) {
					if ("string" == typeof e) {
						var i = {};
						t.each(e.split(/\s/), function() {
							i[this] = !0;
						}),
							(e = i);
					}
					return e;
				},
				addMethod: function(e, i, s) {
					(t.validator.methods[e] = i),
						(t.validator.messages[e] =
							void 0 !== s ? s : t.validator.messages[e]),
						3 > i.length &&
							t.validator.addClassRules(
								e,
								t.validator.normalizeRule(e)
							);
				},
				methods: {
					required: function(e, i, s) {
						if (!this.depend(s, i)) return "dependency-mismatch";
						if ("select" === i.nodeName.toLowerCase()) {
							var r = t(i).val();
							return r && r.length > 0;
						}
						return this.checkable(i)
							? this.getLength(e, i) > 0
							: t.trim(e).length > 0;
					},
					email: function(t, e) {
						return (
							this.optional(e) ||
							/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(
								t
							)
						);
					},
					url: function(t, e) {
						return (
							this.optional(e) ||
							/^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(
								t
							)
						);
					},
					date: function(t, e) {
						return (
							this.optional(e) ||
							!/Invalid|NaN/.test("" + new Date(t))
						);
					},
					dateISO: function(t, e) {
						return (
							this.optional(e) ||
							/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(t)
						);
					},
					number: function(t, e) {
						return (
							this.optional(e) ||
							/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(t)
						);
					},
					digits: function(t, e) {
						return this.optional(e) || /^\d+$/.test(t);
					},
					creditcard: function(t, e) {
						if (this.optional(e)) return "dependency-mismatch";
						if (/[^0-9 \-]+/.test(t)) return !1;
						var i = 0,
							s = 0,
							r = !1;
						t = t.replace(/\D/g, "");
						for (var n = t.length - 1; n >= 0; n--) {
							var a = t.charAt(n);
							(s = parseInt(a, 10)),
								r && (s *= 2) > 9 && (s -= 9),
								(i += s),
								(r = !r);
						}
						return 0 === i % 10;
					},
					minlength: function(e, i, s) {
						var r = t.isArray(e)
							? e.length
							: this.getLength(t.trim(e), i);
						return this.optional(i) || r >= s;
					},
					maxlength: function(e, i, s) {
						var r = t.isArray(e)
							? e.length
							: this.getLength(t.trim(e), i);
						return this.optional(i) || s >= r;
					},
					rangelength: function(e, i, s) {
						var r = t.isArray(e)
							? e.length
							: this.getLength(t.trim(e), i);
						return this.optional(i) || (r >= s[0] && s[1] >= r);
					},
					min: function(t, e, i) {
						return this.optional(e) || t >= i;
					},
					max: function(t, e, i) {
						return this.optional(e) || i >= t;
					},
					range: function(t, e, i) {
						return this.optional(e) || (t >= i[0] && i[1] >= t);
					},
					equalTo: function(e, i, s) {
						var r = t(s);
						return (
							this.settings.onfocusout &&
								r
									.unbind(".validate-equalTo")
									.bind("blur.validate-equalTo", function() {
										t(i).valid();
									}),
							e === r.val()
						);
					},
					remote: function(e, i, s) {
						if (this.optional(i)) return "dependency-mismatch";
						var r = this.previousValue(i);
						if (
							(this.settings.messages[i.name] ||
								(this.settings.messages[i.name] = {}),
							(r.originalMessage = this.settings.messages[
								i.name
							].remote),
							(this.settings.messages[i.name].remote = r.message),
							(s = ("string" == typeof s && { url: s }) || s),
							r.old === e)
						)
							return r.valid;
						r.old = e;
						var n = this;
						this.startRequest(i);
						var a = {};
						return (
							(a[i.name] = e),
							t.ajax(
								t.extend(
									!0,
									{
										url: s,
										mode: "abort",
										port: "validate" + i.name,
										dataType: "json",
										data: a,
										success: function(s) {
											n.settings.messages[i.name].remote =
												r.originalMessage;
											var a = s === !0 || "true" === s;
											if (a) {
												var u = n.formSubmitted;
												n.prepareElement(i),
													(n.formSubmitted = u),
													n.successList.push(i),
													delete n.invalid[i.name],
													n.showErrors();
											} else {
												var o = {},
													l =
														s ||
														n.defaultMessage(
															i,
															"remote"
														);
												(o[
													i.name
												] = r.message = t.isFunction(l)
													? l(e)
													: l),
													(n.invalid[i.name] = !0),
													n.showErrors(o);
											}
											(r.valid = a), n.stopRequest(i, a);
										}
									},
									s
								)
							),
							"pending"
						);
					}
				}
			}),
			(t.format = t.validator.format);
	})(jQuery),
	(function(t) {
		var e = {};
		if (t.ajaxPrefilter)
			t.ajaxPrefilter(function(t, i, s) {
				var r = t.port;
				"abort" === t.mode && (e[r] && e[r].abort(), (e[r] = s));
			});
		else {
			var i = t.ajax;
			t.ajax = function(s) {
				var r = ("mode" in s ? s : t.ajaxSettings).mode,
					n = ("port" in s ? s : t.ajaxSettings).port;
				return "abort" === r
					? (e[n] && e[n].abort(),
						(e[n] = i.apply(this, arguments)),
						e[n])
					: i.apply(this, arguments);
			};
		}
	})(jQuery),
	(function(t) {
		t.extend(t.fn, {
			validateDelegate: function(e, i, s) {
				return this.bind(i, function(i) {
					var r = t(i.target);
					return r.is(e) ? s.apply(r, arguments) : void 0;
				});
			}
		});
	})(jQuery),
	(function() {
		function t(t) {
			return t
				.replace(/<.[^<>]*?>/g, " ")
				.replace(/&nbsp;|&#160;/gi, " ")
				.replace(/[.(),;:!?%#$'"_+=\/\-]*/g, "");
		}
		jQuery.validator.addMethod(
			"maxWords",
			function(e, i, a) {
				return this.optional(i) || a >= t(e).match(/\b\w+\b/g).length;
			},
			jQuery.validator.format("Please enter {0} words or less.")
		),
			jQuery.validator.addMethod(
				"minWords",
				function(e, i, a) {
					return (
						this.optional(i) || t(e).match(/\b\w+\b/g).length >= a
					);
				},
				jQuery.validator.format("Please enter at least {0} words.")
			),
			jQuery.validator.addMethod(
				"rangeWords",
				function(e, i, a) {
					var r = t(e),
						n = /\b\w+\b/g;
					return (
						this.optional(i) ||
						(r.match(n).length >= a[0] && r.match(n).length <= a[1])
					);
				},
				jQuery.validator.format(
					"Please enter between {0} and {1} words."
				)
			);
	})(),
	jQuery.validator.addMethod(
		"letterswithbasicpunc",
		function(t, e) {
			return this.optional(e) || /^[a-z\-.,()'"\s]+$/i.test(t);
		},
		"Letters or punctuation only please"
	),
	jQuery.validator.addMethod(
		"alphanumeric",
		function(t, e) {
			return this.optional(e) || /^\w+$/i.test(t);
		},
		"Letters, numbers, and underscores only please"
	),
	jQuery.validator.addMethod(
		"lettersonly",
		function(t, e) {
			return this.optional(e) || /^[a-z]+$/i.test(t);
		},
		"Letters only please"
	),
	jQuery.validator.addMethod(
		"nowhitespace",
		function(t, e) {
			return this.optional(e) || /^\S+$/i.test(t);
		},
		"No white space please"
	),
	jQuery.validator.addMethod(
		"ziprange",
		function(t, e) {
			return this.optional(e) || /^90[2-5]\d\{2\}-\d{4}$/.test(t);
		},
		"Your ZIP-code must be in the range 902xx-xxxx to 905-xx-xxxx"
	),
	jQuery.validator.addMethod(
		"zipcodeUS",
		function(t, e) {
			return this.optional(e) || /\d{5}-\d{4}$|^\d{5}$/.test(t);
		},
		"The specified US ZIP Code is invalid"
	),
	jQuery.validator.addMethod(
		"integer",
		function(t, e) {
			return this.optional(e) || /^-?\d+$/.test(t);
		},
		"A positive or negative non-decimal number please"
	),
	jQuery.validator.addMethod(
		"vinUS",
		function(t) {
			if (17 !== t.length) return !1;
			var e,
				i,
				a,
				r,
				n,
				s,
				u = [
					"A",
					"B",
					"C",
					"D",
					"E",
					"F",
					"G",
					"H",
					"J",
					"K",
					"L",
					"M",
					"N",
					"P",
					"R",
					"S",
					"T",
					"U",
					"V",
					"W",
					"X",
					"Y",
					"Z"
				],
				d = [
					1,
					2,
					3,
					4,
					5,
					6,
					7,
					8,
					1,
					2,
					3,
					4,
					5,
					7,
					9,
					2,
					3,
					4,
					5,
					6,
					7,
					8,
					9
				],
				o = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2],
				l = 0;
			for (e = 0; 17 > e; e++) {
				if (
					((r = o[e]),
					(a = t.slice(e, e + 1)),
					8 === e && (s = a),
					isNaN(a))
				) {
					for (i = 0; u.length > i; i++)
						if (a.toUpperCase() === u[i]) {
							(a = d[i]),
								(a *= r),
								isNaN(s) && 8 === i && (s = u[i]);
							break;
						}
				} else a *= r;
				l += a;
			}
			return (n = l % 11), 10 === n && (n = "X"), n === s ? !0 : !1;
		},
		"The specified vehicle identification number (VIN) is invalid."
	),
	jQuery.validator.addMethod(
		"dateITA",
		function(t, e) {
			var i = !1,
				a = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
			if (a.test(t)) {
				var r = t.split("/"),
					n = parseInt(r[0], 10),
					s = parseInt(r[1], 10),
					u = parseInt(r[2], 10),
					d = new Date(u, s - 1, n);
				i =
					d.getFullYear() === u &&
					d.getMonth() === s - 1 &&
					d.getDate() === n
						? !0
						: !1;
			} else i = !1;
			return this.optional(e) || i;
		},
		"Please enter a correct date"
	),
	jQuery.validator.addMethod(
		"iban",
		function(t, e) {
			if (this.optional(e)) return !0;
			if (
				!/^([a-zA-Z0-9]{4} ){2,8}[a-zA-Z0-9]{1,4}|[a-zA-Z0-9]{12,34}$/.test(
					t
				)
			)
				return !1;
			var i = t.replace(/ /g, "").toUpperCase(),
				a = i.substring(0, 2),
				r = {
					AL: "\\d{8}[\\dA-Z]{16}",
					AD: "\\d{8}[\\dA-Z]{12}",
					AT: "\\d{16}",
					AZ: "[\\dA-Z]{4}\\d{20}",
					BE: "\\d{12}",
					BH: "[A-Z]{4}[\\dA-Z]{14}",
					BA: "\\d{16}",
					BR: "\\d{23}[A-Z][\\dA-Z]",
					BG: "[A-Z]{4}\\d{6}[\\dA-Z]{8}",
					CR: "\\d{17}",
					HR: "\\d{17}",
					CY: "\\d{8}[\\dA-Z]{16}",
					CZ: "\\d{20}",
					DK: "\\d{14}",
					DO: "[A-Z]{4}\\d{20}",
					EE: "\\d{16}",
					FO: "\\d{14}",
					FI: "\\d{14}",
					FR: "\\d{10}[\\dA-Z]{11}\\d{2}",
					GE: "[\\dA-Z]{2}\\d{16}",
					DE: "\\d{18}",
					GI: "[A-Z]{4}[\\dA-Z]{15}",
					GR: "\\d{7}[\\dA-Z]{16}",
					GL: "\\d{14}",
					GT: "[\\dA-Z]{4}[\\dA-Z]{20}",
					HU: "\\d{24}",
					IS: "\\d{22}",
					IE: "[\\dA-Z]{4}\\d{14}",
					IL: "\\d{19}",
					IT: "[A-Z]\\d{10}[\\dA-Z]{12}",
					KZ: "\\d{3}[\\dA-Z]{13}",
					KW: "[A-Z]{4}[\\dA-Z]{22}",
					LV: "[A-Z]{4}[\\dA-Z]{13}",
					LB: "\\d{4}[\\dA-Z]{20}",
					LI: "\\d{5}[\\dA-Z]{12}",
					LT: "\\d{16}",
					LU: "\\d{3}[\\dA-Z]{13}",
					MK: "\\d{3}[\\dA-Z]{10}\\d{2}",
					MT: "[A-Z]{4}\\d{5}[\\dA-Z]{18}",
					MR: "\\d{23}",
					MU: "[A-Z]{4}\\d{19}[A-Z]{3}",
					MC: "\\d{10}[\\dA-Z]{11}\\d{2}",
					MD: "[\\dA-Z]{2}\\d{18}",
					ME: "\\d{18}",
					NL: "[A-Z]{4}\\d{10}",
					NO: "\\d{11}",
					PK: "[\\dA-Z]{4}\\d{16}",
					PS: "[\\dA-Z]{4}\\d{21}",
					PL: "\\d{24}",
					PT: "\\d{21}",
					RO: "[A-Z]{4}[\\dA-Z]{16}",
					SM: "[A-Z]\\d{10}[\\dA-Z]{12}",
					SA: "\\d{2}[\\dA-Z]{18}",
					RS: "\\d{18}",
					SK: "\\d{20}",
					SI: "\\d{15}",
					ES: "\\d{20}",
					SE: "\\d{20}",
					CH: "\\d{5}[\\dA-Z]{12}",
					TN: "\\d{20}",
					TR: "\\d{5}[\\dA-Z]{17}",
					AE: "\\d{3}\\d{16}",
					GB: "[A-Z]{4}\\d{14}",
					VG: "[\\dA-Z]{4}\\d{16}"
				},
				n = r[a];
			if (void 0 !== n) {
				var s = RegExp("^[A-Z]{2}\\d{2}" + n + "$", "");
				if (!s.test(i)) return !1;
			}
			for (
				var u,
					d = i.substring(4, i.length) + i.substring(0, 4),
					o = "",
					l = !0,
					h = 0;
				d.length > h;
				h++
			)
				(u = d.charAt(h)),
					"0" !== u && (l = !1),
					l ||
						(o += "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(
							u
						));
			for (var F = "", c = "", m = 0; o.length > m; m++) {
				var f = o.charAt(m);
				(c = "" + F + f), (F = c % 97);
			}
			return 1 === F;
		},
		"Please specify a valid IBAN"
	),
	jQuery.validator.addMethod(
		"dateNL",
		function(t, e) {
			return (
				this.optional(e) ||
				/^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test(
					t
				)
			);
		},
		"Please enter a correct date"
	),
	jQuery.validator.addMethod(
		"phoneNL",
		function(t, e) {
			return (
				this.optional(e) ||
				/^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)[1-9]((\s|\s?\-\s?)?[0-9]){8}$/.test(
					t
				)
			);
		},
		"Please specify a valid phone number."
	),
	jQuery.validator.addMethod(
		"mobileNL",
		function(t, e) {
			return (
				this.optional(e) ||
				/^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)6((\s|\s?\-\s?)?[0-9]){8}$/.test(
					t
				)
			);
		},
		"Please specify a valid mobile number"
	),
	jQuery.validator.addMethod(
		"postalcodeNL",
		function(t, e) {
			return this.optional(e) || /^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test(t);
		},
		"Please specify a valid postal code"
	),
	jQuery.validator.addMethod(
		"bankaccountNL",
		function(t, e) {
			if (this.optional(e)) return !0;
			if (!/^[0-9]{9}|([0-9]{2} ){3}[0-9]{3}$/.test(t)) return !1;
			for (
				var i = t.replace(/ /g, ""), a = 0, r = i.length, n = 0;
				r > n;
				n++
			) {
				var s = r - n,
					u = i.substring(n, n + 1);
				a += s * u;
			}
			return 0 === a % 11;
		},
		"Please specify a valid bank account number"
	),
	jQuery.validator.addMethod(
		"giroaccountNL",
		function(t, e) {
			return this.optional(e) || /^[0-9]{1,7}$/.test(t);
		},
		"Please specify a valid giro account number"
	),
	jQuery.validator.addMethod(
		"bankorgiroaccountNL",
		function(t, e) {
			return (
				this.optional(e) ||
				$.validator.methods.bankaccountNL.call(this, t, e) ||
				$.validator.methods.giroaccountNL.call(this, t, e)
			);
		},
		"Please specify a valid bank or giro account number"
	),
	jQuery.validator.addMethod(
		"time",
		function(t, e) {
			return (
				this.optional(e) || /^([01]\d|2[0-3])(:[0-5]\d){1,2}$/.test(t)
			);
		},
		"Please enter a valid time, between 00:00 and 23:59"
	),
	jQuery.validator.addMethod(
		"time12h",
		function(t, e) {
			return (
				this.optional(e) ||
				/^((0?[1-9]|1[012])(:[0-5]\d){1,2}(\ ?[AP]M))$/i.test(t)
			);
		},
		"Please enter a valid time in 12-hour am/pm format"
	),
	jQuery.validator.addMethod(
		"phoneUS",
		function(t, e) {
			return (
				(t = t.replace(/\s+/g, "")),
				this.optional(e) ||
					(t.length > 9 &&
						t.match(
							/^(\+?1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/
						))
			);
		},
		"Please specify a valid phone number"
	),
	jQuery.validator.addMethod(
		"phoneUK",
		function(t, e) {
			return (
				(t = t.replace(/\(|\)|\s+|-/g, "")),
				this.optional(e) ||
					(t.length > 9 &&
						t.match(
							/^(?:(?:(?:00\s?|\+)44\s?)|(?:\(?0))(?:\d{2}\)?\s?\d{4}\s?\d{4}|\d{3}\)?\s?\d{3}\s?\d{3,4}|\d{4}\)?\s?(?:\d{5}|\d{3}\s?\d{3})|\d{5}\)?\s?\d{4,5})$/
						))
			);
		},
		"Please specify a valid phone number"
	),
	jQuery.validator.addMethod(
		"mobileUK",
		function(t, e) {
			return (
				(t = t.replace(/\(|\)|\s+|-/g, "")),
				this.optional(e) ||
					(t.length > 9 &&
						t.match(
							/^(?:(?:(?:00\s?|\+)44\s?|0)7(?:[45789]\d{2}|624)\s?\d{3}\s?\d{3})$/
						))
			);
		},
		"Please specify a valid mobile number"
	),
	jQuery.validator.addMethod(
		"phonesUK",
		function(t, e) {
			return (
				(t = t.replace(/\(|\)|\s+|-/g, "")),
				this.optional(e) ||
					(t.length > 9 &&
						t.match(
							/^(?:(?:(?:00\s?|\+)44\s?|0)(?:1\d{8,9}|[23]\d{9}|7(?:[45789]\d{8}|624\d{6})))$/
						))
			);
		},
		"Please specify a valid uk phone number"
	),
	jQuery.validator.addMethod(
		"postcodeUK",
		function(t, e) {
			return (
				this.optional(e) ||
				/^((([A-PR-UWYZ][0-9])|([A-PR-UWYZ][0-9][0-9])|([A-PR-UWYZ][A-HK-Y][0-9])|([A-PR-UWYZ][A-HK-Y][0-9][0-9])|([A-PR-UWYZ][0-9][A-HJKSTUW])|([A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\s?([0-9][ABD-HJLNP-UW-Z]{2})|(GIR)\s?(0AA))$/i.test(
					t
				)
			);
		},
		"Please specify a valid UK postcode"
	),
	jQuery.validator.addMethod(
		"strippedminlength",
		function(t, e, i) {
			return jQuery(t).text().length >= i;
		},
		jQuery.validator.format("Please enter at least {0} characters")
	),
	jQuery.validator.addMethod(
		"email2",
		function(t, e) {
			return (
				this.optional(e) ||
				/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(
					t
				)
			);
		},
		jQuery.validator.messages.email
	),
	jQuery.validator.addMethod(
		"url2",
		function(t, e) {
			return (
				this.optional(e) ||
				/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(
					t
				)
			);
		},
		jQuery.validator.messages.url
	),
	jQuery.validator.addMethod(
		"creditcardtypes",
		function(t, e, i) {
			if (/[^0-9\-]+/.test(t)) return !1;
			t = t.replace(/\D/g, "");
			var a = 0;
			return (
				i.mastercard && (a |= 1),
				i.visa && (a |= 2),
				i.amex && (a |= 4),
				i.dinersclub && (a |= 8),
				i.enroute && (a |= 16),
				i.discover && (a |= 32),
				i.jcb && (a |= 64),
				i.unknown && (a |= 128),
				i.all && (a = 255),
				1 & a && /^(5[12345])/.test(t)
					? 16 === t.length
					: 2 & a && /^(4)/.test(t)
						? 16 === t.length
						: 4 & a && /^(3[47])/.test(t)
							? 15 === t.length
							: 8 & a && /^(3(0[012345]|[68]))/.test(t)
								? 14 === t.length
								: 16 & a && /^(2(014|149))/.test(t)
									? 15 === t.length
									: 32 & a && /^(6011)/.test(t)
										? 16 === t.length
										: 64 & a && /^(3)/.test(t)
											? 16 === t.length
											: 64 & a && /^(2131|1800)/.test(t)
												? 15 === t.length
												: 128 & a ? !0 : !1
			);
		},
		"Please enter a valid credit card number."
	),
	jQuery.validator.addMethod(
		"ipv4",
		function(t, e) {
			return (
				this.optional(e) ||
				/^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(
					t
				)
			);
		},
		"Please enter a valid IP v4 address."
	),
	jQuery.validator.addMethod(
		"ipv6",
		function(t, e) {
			return (
				this.optional(e) ||
				/^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test(
					t
				)
			);
		},
		"Please enter a valid IP v6 address."
	),
	jQuery.validator.addMethod(
		"pattern",
		function(t, e, i) {
			return this.optional(e)
				? !0
				: ("string" == typeof i && (i = RegExp("^(?:" + i + ")$")),
					i.test(t));
		},
		"Invalid format."
	),
	jQuery.validator.addMethod(
		"require_from_group",
		function(t, e, i) {
			var a = this,
				r = i[1],
				n =
					$(r, e.form).filter(function() {
						return a.elementValue(this);
					}).length >= i[0];
			if (!$(e).data("being_validated")) {
				var s = $(r, e.form);
				s.data("being_validated", !0),
					s.valid(),
					s.data("being_validated", !1);
			}
			return n;
		},
		jQuery.format("Please fill at least {0} of these fields.")
	),
	jQuery.validator.addMethod(
		"skip_or_fill_minimum",
		function(t, e, i) {
			var a = this,
				r = i[0],
				n = i[1],
				s = $(n, e.form).filter(function() {
					return a.elementValue(this);
				}).length,
				u = s >= r || 0 === s;
			if (!$(e).data("being_validated")) {
				var d = $(n, e.form);
				d.data("being_validated", !0),
					d.valid(),
					d.data("being_validated", !1);
			}
			return u;
		},
		jQuery.format(
			"Please either skip these fields or fill at least {0} of them."
		)
	),
	jQuery.validator.addMethod(
		"accept",
		function(t, e, i) {
			var a,
				r,
				n =
					"string" == typeof i
						? i.replace(/\s/g, "").replace(/,/g, "|")
						: "image/*",
				s = this.optional(e);
			if (s) return s;
			if (
				"file" === $(e).attr("type") &&
				((n = n.replace(/\*/g, ".*")), e.files && e.files.length)
			)
				for (a = 0; e.files.length > a; a++)
					if (
						((r = e.files[a]),
						!r.type.match(RegExp(".?(" + n + ")$", "i")))
					)
						return !1;
			return !0;
		},
		jQuery.format("Please enter a value with a valid mimetype.")
	),
	jQuery.validator.addMethod(
		"extension",
		function(t, e, i) {
			return (
				(i =
					"string" == typeof i
						? i.replace(/,/g, "|")
						: "png|jpe?g|gif"),
				this.optional(e) || t.match(RegExp(".(" + i + ")$", "i"))
			);
		},
		jQuery.format("Please enter a value with a valid extension.")
	),
	function(a) {
		function b(a, b) {
			return function(c) {
				return i(a.call(this, c), b);
			};
		}
		function c(a, b) {
			return function(c) {
				return this.lang().ordinal(a.call(this, c), b);
			};
		}
		function d() {}
		function e(a) {
			u(a), g(this, a);
		}
		function f(a) {
			var b = o(a),
				c = b.year || 0,
				d = b.month || 0,
				e = b.week || 0,
				f = b.day || 0,
				g = b.hour || 0,
				h = b.minute || 0,
				i = b.second || 0,
				j = b.millisecond || 0;
			(this._milliseconds = +j + 1e3 * i + 6e4 * h + 36e5 * g),
				(this._days = +f + 7 * e),
				(this._months = +d + 12 * c),
				(this._data = {}),
				this._bubble();
		}
		function g(a, b) {
			for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
			return (
				b.hasOwnProperty("toString") && (a.toString = b.toString),
				b.hasOwnProperty("valueOf") && (a.valueOf = b.valueOf),
				a
			);
		}
		function h(a) {
			return 0 > a ? Math.ceil(a) : Math.floor(a);
		}
		function i(a, b, c) {
			for (var d = Math.abs(a) + "", e = a >= 0; d.length < b; )
				d = "0" + d;
			return (e ? (c ? "+" : "") : "-") + d;
		}
		function j(a, b, c, d) {
			var e,
				f,
				g = b._milliseconds,
				h = b._days,
				i = b._months;
			g && a._d.setTime(+a._d + g * c),
				(h || i) && ((e = a.minute()), (f = a.hour())),
				h && a.date(a.date() + h * c),
				i && a.month(a.month() + i * c),
				g && !d && cb.updateOffset(a),
				(h || i) && (a.minute(e), a.hour(f));
		}
		function k(a) {
			return "[object Array]" === Object.prototype.toString.call(a);
		}
		function l(a) {
			return (
				"[object Date]" === Object.prototype.toString.call(a) ||
				a instanceof Date
			);
		}
		function m(a, b, c) {
			var d,
				e = Math.min(a.length, b.length),
				f = Math.abs(a.length - b.length),
				g = 0;
			for (d = 0; e > d; d++)
				((c && a[d] !== b[d]) || (!c && q(a[d]) !== q(b[d]))) && g++;
			return g + f;
		}
		function n(a) {
			if (a) {
				var b = a.toLowerCase().replace(/(.)s$/, "$1");
				a = Qb[a] || Rb[b] || b;
			}
			return a;
		}
		function o(a) {
			var b,
				c,
				d = {};
			for (c in a)
				a.hasOwnProperty(c) && ((b = n(c)), b && (d[b] = a[c]));
			return d;
		}
		function p(b) {
			var c, d;
			if (0 === b.indexOf("week")) (c = 7), (d = "day");
			else {
				if (0 !== b.indexOf("month")) return;
				(c = 12), (d = "month");
			}
			cb[b] = function(e, f) {
				var g,
					h,
					i = cb.fn._lang[b],
					j = [];
				if (
					("number" == typeof e && ((f = e), (e = a)),
					(h = function(a) {
						var b = cb()
							.utc()
							.set(d, a);
						return i.call(cb.fn._lang, b, e || "");
					}),
					null != f)
				)
					return h(f);
				for (g = 0; c > g; g++) j.push(h(g));
				return j;
			};
		}
		function q(a) {
			var b = +a,
				c = 0;
			return (
				0 !== b &&
					isFinite(b) &&
					(c = b >= 0 ? Math.floor(b) : Math.ceil(b)),
				c
			);
		}
		function r(a, b) {
			return new Date(Date.UTC(a, b + 1, 0)).getUTCDate();
		}
		function s(a) {
			return t(a) ? 366 : 365;
		}
		function t(a) {
			return (a % 4 === 0 && a % 100 !== 0) || a % 400 === 0;
		}
		function u(a) {
			var b;
			a._a &&
				-2 === a._pf.overflow &&
				((b =
					a._a[ib] < 0 || a._a[ib] > 11
						? ib
						: a._a[jb] < 1 || a._a[jb] > r(a._a[hb], a._a[ib])
							? jb
							: a._a[kb] < 0 || a._a[kb] > 23
								? kb
								: a._a[lb] < 0 || a._a[lb] > 59
									? lb
									: a._a[mb] < 0 || a._a[mb] > 59
										? mb
										: a._a[nb] < 0 || a._a[nb] > 999 ? nb : -1),
				a._pf._overflowDayOfYear && (hb > b || b > jb) && (b = jb),
				(a._pf.overflow = b));
		}
		function v(a) {
			a._pf = {
				empty: !1,
				unusedTokens: [],
				unusedInput: [],
				overflow: -2,
				charsLeftOver: 0,
				nullInput: !1,
				invalidMonth: null,
				invalidFormat: !1,
				userInvalidated: !1,
				iso: !1
			};
		}
		function w(a) {
			return (
				null == a._isValid &&
					((a._isValid =
						!isNaN(a._d.getTime()) &&
						a._pf.overflow < 0 &&
						!a._pf.empty &&
						!a._pf.invalidMonth &&
						!a._pf.nullInput &&
						!a._pf.invalidFormat &&
						!a._pf.userInvalidated),
					a._strict &&
						(a._isValid =
							a._isValid &&
							0 === a._pf.charsLeftOver &&
							0 === a._pf.unusedTokens.length)),
				a._isValid
			);
		}
		function x(a) {
			return a ? a.toLowerCase().replace("_", "-") : a;
		}
		function y(a, b) {
			return b._isUTC ? cb(a).zone(b._offset || 0) : cb(a).local();
		}
		function z(a, b) {
			return (
				(b.abbr = a), ob[a] || (ob[a] = new d()), ob[a].set(b), ob[a]
			);
		}
		function A(a) {
			delete ob[a];
		}
		function B(a) {
			var b,
				c,
				d,
				e,
				f = 0,
				g = function(a) {
					if (!ob[a] && pb)
						try {
							require("./lang/" + a);
						} catch (b) {}
					return ob[a];
				};
			if (!a) return cb.fn._lang;
			if (!k(a)) {
				if ((c = g(a))) return c;

				a = [a];
			}
			for (; f < a.length; ) {
				for (
					e = x(a[f]).split("-"),
						b = e.length,
						d = x(a[f + 1]),
						d = d ? d.split("-") : null;
					b > 0;

				) {
					if ((c = g(e.slice(0, b).join("-")))) return c;
					if (d && d.length >= b && m(e, d, !0) >= b - 1) break;
					b--;
				}
				f++;
			}
			return cb.fn._lang;
		}
		function C(a) {
			return a.match(/\[[\s\S]/)
				? a.replace(/^\[|\]$/g, "")
				: a.replace(/\\/g, "");
		}
		function D(a) {
			var b,
				c,
				d = a.match(tb);
			for (b = 0, c = d.length; c > b; b++)
				d[b] = Vb[d[b]] ? Vb[d[b]] : C(d[b]);
			return function(e) {
				var f = "";
				for (b = 0; c > b; b++)
					f += d[b] instanceof Function ? d[b].call(e, a) : d[b];
				return f;
			};
		}
		function E(a, b) {
			return a.isValid()
				? ((b = F(b, a.lang())), Sb[b] || (Sb[b] = D(b)), Sb[b](a))
				: a.lang().invalidDate();
		}
		function F(a, b) {
			function c(a) {
				return b.longDateFormat(a) || a;
			}
			var d = 5;
			for (ub.lastIndex = 0; d >= 0 && ub.test(a); )
				(a = a.replace(ub, c)), (ub.lastIndex = 0), (d -= 1);
			return a;
		}
		function G(a, b) {
			var c,
				d = b._strict;
			switch (a) {
				case "DDDD":
					return Gb;
				case "YYYY":
				case "GGGG":
				case "gggg":
					return d ? Hb : xb;
				case "YYYYYY":
				case "YYYYY":
				case "GGGGG":
				case "ggggg":
					return d ? Ib : yb;
				case "S":
					if (d) return Eb;
				case "SS":
					if (d) return Fb;
				case "SSS":
				case "DDD":
					return d ? Gb : wb;
				case "MMM":
				case "MMMM":
				case "dd":
				case "ddd":
				case "dddd":
					return Ab;
				case "a":
				case "A":
					return B(b._l)._meridiemParse;
				case "X":
					return Db;
				case "Z":
				case "ZZ":
					return Bb;
				case "T":
					return Cb;
				case "SSSS":
					return zb;
				case "MM":
				case "DD":
				case "YY":
				case "GG":
				case "gg":
				case "HH":
				case "hh":
				case "mm":
				case "ss":
				case "ww":
				case "WW":
					return d ? Fb : vb;
				case "M":
				case "D":
				case "d":
				case "H":
				case "h":
				case "m":
				case "s":
				case "w":
				case "W":
				case "e":
				case "E":
					return d ? Eb : vb;
				default:
					return (c = new RegExp(O(N(a.replace("\\", "")), "i")));
			}
		}
		function H(a) {
			a = a || "";
			var b = a.match(Bb) || [],
				c = b[b.length - 1] || [],
				d = (c + "").match(Nb) || ["-", 0, 0],
				e = +(60 * d[1]) + q(d[2]);
			return "+" === d[0] ? -e : e;
		}
		function I(a, b, c) {
			var d,
				e = c._a;
			switch (a) {
				case "M":
				case "MM":
					null != b && (e[ib] = q(b) - 1);
					break;
				case "MMM":
				case "MMMM":
					(d = B(c._l).monthsParse(b)),
						null != d ? (e[ib] = d) : (c._pf.invalidMonth = b);
					break;
				case "D":
				case "DD":
					null != b && (e[jb] = q(b));
					break;
				case "DDD":
				case "DDDD":
					null != b && (c._dayOfYear = q(b));
					break;
				case "YY":
					e[hb] = q(b) + (q(b) > 68 ? 1900 : 2e3);
					break;
				case "YYYY":
				case "YYYYY":
				case "YYYYYY":
					e[hb] = q(b);
					break;
				case "a":
				case "A":
					c._isPm = B(c._l).isPM(b);
					break;
				case "H":
				case "HH":
				case "h":
				case "hh":
					e[kb] = q(b);
					break;
				case "m":
				case "mm":
					e[lb] = q(b);
					break;
				case "s":
				case "ss":
					e[mb] = q(b);
					break;
				case "S":
				case "SS":
				case "SSS":
				case "SSSS":
					e[nb] = q(1e3 * ("0." + b));
					break;
				case "X":
					c._d = new Date(1e3 * parseFloat(b));
					break;
				case "Z":
				case "ZZ":
					(c._useUTC = !0), (c._tzm = H(b));
					break;
				case "w":
				case "ww":
				case "W":
				case "WW":
				case "d":
				case "dd":
				case "ddd":
				case "dddd":
				case "e":
				case "E":
					a = a.substr(0, 1);
				case "gg":
				case "gggg":
				case "GG":
				case "GGGG":
				case "GGGGG":
					(a = a.substr(0, 2)),
						b && ((c._w = c._w || {}), (c._w[a] = b));
			}
		}
		function J(a) {
			var b,
				c,
				d,
				e,
				f,
				g,
				h,
				i,
				j,
				k,
				l = [];
			if (!a._d) {
				for (
					d = L(a),
						a._w &&
							null == a._a[jb] &&
							null == a._a[ib] &&
							((f = function(b) {
								var c = parseInt(b, 10);
								return b
									? b.length < 3
										? c > 68 ? 1900 + c : 2e3 + c
										: c
									: null == a._a[hb]
										? cb().weekYear()
										: a._a[hb];
							}),
							(g = a._w),
							null != g.GG || null != g.W || null != g.E
								? (h = Y(f(g.GG), g.W || 1, g.E, 4, 1))
								: ((i = B(a._l)),
									(j =
										null != g.d
											? U(g.d, i)
											: null != g.e
												? parseInt(g.e, 10) + i._week.dow
												: 0),
									(k = parseInt(g.w, 10) || 1),
									null != g.d && j < i._week.dow && k++,
									(h = Y(
										f(g.gg),
										k,
										j,
										i._week.doy,
										i._week.dow
									))),
							(a._a[hb] = h.year),
							(a._dayOfYear = h.dayOfYear)),
						a._dayOfYear &&
							((e = null == a._a[hb] ? d[hb] : a._a[hb]),
							a._dayOfYear > s(e) &&
								(a._pf._overflowDayOfYear = !0),
							(c = T(e, 0, a._dayOfYear)),
							(a._a[ib] = c.getUTCMonth()),
							(a._a[jb] = c.getUTCDate())),
						b = 0;
					3 > b && null == a._a[b];
					++b
				)
					a._a[b] = l[b] = d[b];
				for (; 7 > b; b++)
					a._a[b] = l[b] =
						null == a._a[b] ? (2 === b ? 1 : 0) : a._a[b];
				(l[kb] += q((a._tzm || 0) / 60)),
					(l[lb] += q((a._tzm || 0) % 60)),
					(a._d = (a._useUTC ? T : S).apply(null, l));
			}
		}
		function K(a) {
			var b;
			a._d ||
				((b = o(a._i)),
				(a._a = [
					b.year,
					b.month,
					b.day,
					b.hour,
					b.minute,
					b.second,
					b.millisecond
				]),
				J(a));
		}
		function L(a) {
			var b = new Date();
			return a._useUTC
				? [b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()]
				: [b.getFullYear(), b.getMonth(), b.getDate()];
		}
		function M(a) {
			(a._a = []), (a._pf.empty = !0);
			var b,
				c,
				d,
				e,
				f,
				g = B(a._l),
				h = "" + a._i,
				i = h.length,
				j = 0;
			for (d = F(a._f, g).match(tb) || [], b = 0; b < d.length; b++)
				(e = d[b]),
					(c = (h.match(G(e, a)) || [])[0]),
					c &&
						((f = h.substr(0, h.indexOf(c))),
						f.length > 0 && a._pf.unusedInput.push(f),
						(h = h.slice(h.indexOf(c) + c.length)),
						(j += c.length)),
					Vb[e]
						? (c ? (a._pf.empty = !1) : a._pf.unusedTokens.push(e),
							I(e, c, a))
						: a._strict && !c && a._pf.unusedTokens.push(e);
			(a._pf.charsLeftOver = i - j),
				h.length > 0 && a._pf.unusedInput.push(h),
				a._isPm && a._a[kb] < 12 && (a._a[kb] += 12),
				a._isPm === !1 && 12 === a._a[kb] && (a._a[kb] = 0),
				J(a),
				u(a);
		}
		function N(a) {
			return a.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(
				a,
				b,
				c,
				d,
				e
			) {
				return b || c || d || e;
			});
		}
		function O(a) {
			return a.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
		}
		function P(a) {
			var b, c, d, e, f;
			if (0 === a._f.length)
				return (
					(a._pf.invalidFormat = !0), void (a._d = new Date(0 / 0))
				);
			for (e = 0; e < a._f.length; e++)
				(f = 0),
					(b = g({}, a)),
					v(b),
					(b._f = a._f[e]),
					M(b),
					w(b) &&
						((f += b._pf.charsLeftOver),
						(f += 10 * b._pf.unusedTokens.length),
						(b._pf.score = f),
						(null == d || d > f) && ((d = f), (c = b)));
			g(a, c || b);
		}
		function Q(a) {
			var b,
				c = a._i,
				d = Jb.exec(c);
			if (d) {
				for (a._pf.iso = !0, b = 4; b > 0; b--)
					if (d[b]) {
						a._f = Lb[b - 1] + (d[6] || " ");
						break;
					}
				for (b = 0; 4 > b; b++)
					if (Mb[b][1].exec(c)) {
						a._f += Mb[b][0];
						break;
					}
				c.match(Bb) && (a._f += "Z"), M(a);
			} else a._d = new Date(c);
		}
		function R(b) {
			var c = b._i,
				d = qb.exec(c);
			c === a
				? (b._d = new Date())
				: d
					? (b._d = new Date(+d[1]))
					: "string" == typeof c
						? Q(b)
						: k(c)
							? ((b._a = c.slice(0)), J(b))
							: l(c)
								? (b._d = new Date(+c))
								: "object" == typeof c ? K(b) : (b._d = new Date(c));
		}
		function S(a, b, c, d, e, f, g) {
			var h = new Date(a, b, c, d, e, f, g);
			return 1970 > a && h.setFullYear(a), h;
		}
		function T(a) {
			var b = new Date(Date.UTC.apply(null, arguments));
			return 1970 > a && b.setUTCFullYear(a), b;
		}
		function U(a, b) {
			if ("string" == typeof a)
				if (isNaN(a)) {
					if (((a = b.weekdaysParse(a)), "number" != typeof a))
						return null;
				} else a = parseInt(a, 10);
			return a;
		}
		function V(a, b, c, d, e) {
			return e.relativeTime(b || 1, !!c, a, d);
		}
		function W(a, b, c) {
			var d = gb(Math.abs(a) / 1e3),
				e = gb(d / 60),
				f = gb(e / 60),
				g = gb(f / 24),
				h = gb(g / 365),
				i = (45 > d && ["s", d]) ||
					(1 === e && ["m"]) ||
					(45 > e && ["mm", e]) ||
					(1 === f && ["h"]) ||
					(22 > f && ["hh", f]) ||
					(1 === g && ["d"]) ||
					(25 >= g && ["dd", g]) ||
					(45 >= g && ["M"]) ||
					(345 > g && ["MM", gb(g / 30)]) ||
					(1 === h && ["y"]) || ["yy", h];
			return (i[2] = b), (i[3] = a > 0), (i[4] = c), V.apply({}, i);
		}
		function X(a, b, c) {
			var d,
				e = c - b,
				f = c - a.day();
			return (
				f > e && (f -= 7),
				e - 7 > f && (f += 7),
				(d = cb(a).add("d", f)),
				{ week: Math.ceil(d.dayOfYear() / 7), year: d.year() }
			);
		}
		function Y(a, b, c, d, e) {
			var f,
				g,
				h = new Date(i(a, 6, !0) + "-01-01").getUTCDay();
			return (
				(c = null != c ? c : e),
				(f = e - h + (h > d ? 7 : 0)),
				(g = 7 * (b - 1) + (c - e) + f + 1),
				{ year: g > 0 ? a : a - 1, dayOfYear: g > 0 ? g : s(a - 1) + g }
			);
		}
		function Z(a) {
			var b = a._i,
				c = a._f;
			return (
				"undefined" == typeof a._pf && v(a),
				null === b
					? cb.invalid({ nullInput: !0 })
					: ("string" == typeof b && (a._i = b = B().preparse(b)),
						cb.isMoment(b)
							? ((a = g({}, b)), (a._d = new Date(+b._d)))
							: c ? (k(c) ? P(a) : M(a)) : R(a),
						new e(a))
			);
		}
		function $(a, b) {
			cb.fn[a] = cb.fn[a + "s"] = function(a) {
				var c = this._isUTC ? "UTC" : "";
				return null != a
					? (this._d["set" + c + b](a), cb.updateOffset(this), this)
					: this._d["get" + c + b]();
			};
		}
		function _(a) {
			cb.duration.fn[a] = function() {
				return this._data[a];
			};
		}
		function ab(a, b) {
			cb.duration.fn["as" + a] = function() {
				return +this / b;
			};
		}
		function bb(a) {
			var b = !1,
				c = cb;
			"undefined" == typeof ender &&
				(a
					? ((fb.moment = function() {
							return (
								!b &&
									console &&
									console.warn &&
									((b = !0),
									console.warn(
										"Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release."
									)),
								c.apply(null, arguments)
							);
						}),
						g(fb.moment, c))
					: (fb.moment = cb));
		}
		for (
			var cb,
				db,
				eb = "2.5.0",
				fb = this,
				gb = Math.round,
				hb = 0,
				ib = 1,
				jb = 2,
				kb = 3,
				lb = 4,
				mb = 5,
				nb = 6,
				ob = {},
				pb =
					"undefined" != typeof module &&
					module.exports &&
					"undefined" != typeof require,
				qb = /^\/?Date\((\-?\d+)/i,
				rb = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,
				sb = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,
				tb = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,
				ub = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,
				vb = /\d\d?/,
				wb = /\d{1,3}/,
				xb = /\d{1,4}/,
				yb = /[+\-]?\d{1,6}/,
				zb = /\d+/,
				Ab = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,
				Bb = /Z|[\+\-]\d\d:?\d\d/gi,
				Cb = /T/i,
				Db = /[\+\-]?\d+(\.\d{1,3})?/,
				Eb = /\d/,
				Fb = /\d\d/,
				Gb = /\d{3}/,
				Hb = /\d{4}/,
				Ib = /[+\-]?\d{6}/,
				Jb = /^\s*\d{4}-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
				Kb = "YYYY-MM-DDTHH:mm:ssZ",
				Lb = ["YYYY-MM-DD", "GGGG-[W]WW", "GGGG-[W]WW-E", "YYYY-DDD"],
				Mb = [
					["HH:mm:ss.SSSS", /(T| )\d\d:\d\d:\d\d\.\d{1,3}/],
					["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/],
					["HH:mm", /(T| )\d\d:\d\d/],
					["HH", /(T| )\d\d/]
				],
				Nb = /([\+\-]|\d\d)/gi,
				Ob = "Date|Hours|Minutes|Seconds|Milliseconds".split("|"),
				Pb = {
					Milliseconds: 1,
					Seconds: 1e3,
					Minutes: 6e4,
					Hours: 36e5,
					Days: 864e5,
					Months: 2592e6,
					Years: 31536e6
				},
				Qb = {
					ms: "millisecond",
					s: "second",
					m: "minute",
					h: "hour",
					d: "day",
					D: "date",
					w: "week",
					W: "isoWeek",
					M: "month",
					y: "year",
					DDD: "dayOfYear",
					e: "weekday",
					E: "isoWeekday",
					gg: "weekYear",
					GG: "isoWeekYear"
				},
				Rb = {
					dayofyear: "dayOfYear",
					isoweekday: "isoWeekday",
					isoweek: "isoWeek",
					weekyear: "weekYear",
					isoweekyear: "isoWeekYear"
				},
				Sb = {},
				Tb = "DDD w W M D d".split(" "),
				Ub = "M D H h m s w W".split(" "),
				Vb = {
					M: function() {
						return this.month() + 1;
					},
					MMM: function(a) {
						return this.lang().monthsShort(this, a);
					},
					MMMM: function(a) {
						return this.lang().months(this, a);
					},
					D: function() {
						return this.date();
					},
					DDD: function() {
						return this.dayOfYear();
					},
					d: function() {
						return this.day();
					},
					dd: function(a) {
						return this.lang().weekdaysMin(this, a);
					},
					ddd: function(a) {
						return this.lang().weekdaysShort(this, a);
					},
					dddd: function(a) {
						return this.lang().weekdays(this, a);
					},
					w: function() {
						return this.week();
					},
					W: function() {
						return this.isoWeek();
					},
					YY: function() {
						return i(this.year() % 100, 2);
					},
					YYYY: function() {
						return i(this.year(), 4);
					},
					YYYYY: function() {
						return i(this.year(), 5);
					},
					YYYYYY: function() {
						var a = this.year(),
							b = a >= 0 ? "+" : "-";
						return b + i(Math.abs(a), 6);
					},
					gg: function() {
						return i(this.weekYear() % 100, 2);
					},
					gggg: function() {
						return this.weekYear();
					},
					ggggg: function() {
						return i(this.weekYear(), 5);
					},
					GG: function() {
						return i(this.isoWeekYear() % 100, 2);
					},
					GGGG: function() {
						return this.isoWeekYear();
					},
					GGGGG: function() {
						return i(this.isoWeekYear(), 5);
					},
					e: function() {
						return this.weekday();
					},
					E: function() {
						return this.isoWeekday();
					},
					a: function() {
						return this.lang().meridiem(
							this.hours(),
							this.minutes(),
							!0
						);
					},
					A: function() {
						return this.lang().meridiem(
							this.hours(),
							this.minutes(),
							!1
						);
					},
					H: function() {
						return this.hours();
					},
					h: function() {
						return this.hours() % 12 || 12;
					},
					m: function() {
						return this.minutes();
					},
					s: function() {
						return this.seconds();
					},
					S: function() {
						return q(this.milliseconds() / 100);
					},
					SS: function() {
						return i(q(this.milliseconds() / 10), 2);
					},
					SSS: function() {
						return i(this.milliseconds(), 3);
					},
					SSSS: function() {
						return i(this.milliseconds(), 3);
					},
					Z: function() {
						var a = -this.zone(),
							b = "+";
						return (
							0 > a && ((a = -a), (b = "-")),
							b + i(q(a / 60), 2) + ":" + i(q(a) % 60, 2)
						);
					},
					ZZ: function() {
						var a = -this.zone(),
							b = "+";
						return (
							0 > a && ((a = -a), (b = "-")),
							b + i(q(a / 60), 2) + i(q(a) % 60, 2)
						);
					},
					z: function() {
						return this.zoneAbbr();
					},
					zz: function() {
						return this.zoneName();
					},
					X: function() {
						return this.unix();
					},
					Q: function() {
						return this.quarter();
					}
				},
				Wb = [
					"months",
					"monthsShort",
					"weekdays",
					"weekdaysShort",
					"weekdaysMin"
				];
			Tb.length;

		)
			(db = Tb.pop()), (Vb[db + "o"] = c(Vb[db], db));
		for (; Ub.length; ) (db = Ub.pop()), (Vb[db + db] = b(Vb[db], 2));
		for (
			Vb.DDDD = b(Vb.DDD, 3),
				g(d.prototype, {
					set: function(a) {
						var b, c;
						for (c in a)
							(b = a[c]),
								"function" == typeof b
									? (this[c] = b)
									: (this["_" + c] = b);
					},
					_months: "January_February_March_April_May_June_July_August_September_October_November_December".split(
						"_"
					),
					months: function(a) {
						return this._months[a.month()];
					},
					_monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split(
						"_"
					),
					monthsShort: function(a) {
						return this._monthsShort[a.month()];
					},
					monthsParse: function(a) {
						var b, c, d;
						for (
							this._monthsParse || (this._monthsParse = []),
								b = 0;
							12 > b;
							b++
						)
							if (
								(this._monthsParse[b] ||
									((c = cb.utc([2e3, b])),
									(d =
										"^" +
										this.months(c, "") +
										"|^" +
										this.monthsShort(c, "")),
									(this._monthsParse[b] = new RegExp(
										d.replace(".", ""),
										"i"
									))),
								this._monthsParse[b].test(a))
							)
								return b;
					},
					_weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
						"_"
					),
					weekdays: function(a) {
						return this._weekdays[a.day()];
					},
					_weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
					weekdaysShort: function(a) {
						return this._weekdaysShort[a.day()];
					},
					_weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
					weekdaysMin: function(a) {
						return this._weekdaysMin[a.day()];
					},
					weekdaysParse: function(a) {
						var b, c, d;
						for (
							this._weekdaysParse || (this._weekdaysParse = []),
								b = 0;
							7 > b;
							b++
						)
							if (
								(this._weekdaysParse[b] ||
									((c = cb([2e3, 1]).day(b)),
									(d =
										"^" +
										this.weekdays(c, "") +
										"|^" +
										this.weekdaysShort(c, "") +
										"|^" +
										this.weekdaysMin(c, "")),
									(this._weekdaysParse[b] = new RegExp(
										d.replace(".", ""),
										"i"
									))),
								this._weekdaysParse[b].test(a))
							)
								return b;
					},
					_longDateFormat: {
						LT: "h:mm A",
						L: "MM/DD/YYYY",
						LL: "MMMM D YYYY",
						LLL: "MMMM D YYYY LT",
						LLLL: "dddd, MMMM D YYYY LT"
					},
					longDateFormat: function(a) {
						var b = this._longDateFormat[a];
						return (
							!b &&
								this._longDateFormat[a.toUpperCase()] &&
								((b = this._longDateFormat[
									a.toUpperCase()
								].replace(/MMMM|MM|DD|dddd/g, function(a) {
									return a.slice(1);
								})),
								(this._longDateFormat[a] = b)),
							b
						);
					},
					isPM: function(a) {
						return "p" === (a + "").toLowerCase().charAt(0);
					},
					_meridiemParse: /[ap]\.?m?\.?/i,
					meridiem: function(a, b, c) {
						return a > 11 ? (c ? "pm" : "PM") : c ? "am" : "AM";
					},
					_calendar: {
						sameDay: "[Today at] LT",
						nextDay: "[Tomorrow at] LT",
						nextWeek: "dddd [at] LT",
						lastDay: "[Yesterday at] LT",
						lastWeek: "[Last] dddd [at] LT",
						sameElse: "L"
					},
					calendar: function(a, b) {
						var c = this._calendar[a];
						return "function" == typeof c ? c.apply(b) : c;
					},
					_relativeTime: {
						future: "in %s",
						past: "%s ago",
						s: "a few seconds",
						m: "a minute",
						mm: "%d minutes",
						h: "an hour",
						hh: "%d hours",
						d: "a day",
						dd: "%d days",
						M: "a month",
						MM: "%d months",
						y: "a year",
						yy: "%d years"
					},
					relativeTime: function(a, b, c, d) {
						var e = this._relativeTime[c];
						return "function" == typeof e
							? e(a, b, c, d)
							: e.replace(/%d/i, a);
					},
					pastFuture: function(a, b) {
						var c = this._relativeTime[a > 0 ? "future" : "past"];
						return "function" == typeof c
							? c(b)
							: c.replace(/%s/i, b);
					},
					ordinal: function(a) {
						return this._ordinal.replace("%d", a);
					},
					_ordinal: "%d",
					preparse: function(a) {
						return a;
					},
					postformat: function(a) {
						return a;
					},
					week: function(a) {
						return X(a, this._week.dow, this._week.doy).week;
					},
					_week: { dow: 0, doy: 6 },
					_invalidDate: "Invalid date",
					invalidDate: function() {
						return this._invalidDate;
					}
				}),
				cb = function(b, c, d, e) {
					return (
						"boolean" == typeof d && ((e = d), (d = a)),
						Z({ _i: b, _f: c, _l: d, _strict: e, _isUTC: !1 })
					);
				},
				cb.utc = function(b, c, d, e) {
					var f;
					return (
						"boolean" == typeof d && ((e = d), (d = a)),
						(f = Z({
							_useUTC: !0,
							_isUTC: !0,
							_l: d,
							_i: b,
							_f: c,
							_strict: e
						}).utc())
					);
				},
				cb.unix = function(a) {
					return cb(1e3 * a);
				},
				cb.duration = function(a, b) {
					var c,
						d,
						e,
						g = a,
						h = null;
					return (
						cb.isDuration(a)
							? (g = {
									ms: a._milliseconds,
									d: a._days,
									M: a._months
								})
							: "number" == typeof a
								? ((g = {}),
									b ? (g[b] = a) : (g.milliseconds = a))
								: (h = rb.exec(a))
									? ((c = "-" === h[1] ? -1 : 1),
										(g = {
											y: 0,
											d: q(h[jb]) * c,
											h: q(h[kb]) * c,
											m: q(h[lb]) * c,
											s: q(h[mb]) * c,
											ms: q(h[nb]) * c
										}))
									: (h = sb.exec(a)) &&
										((c = "-" === h[1] ? -1 : 1),
										(e = function(a) {
											var b =
												a && parseFloat(a.replace(",", "."));
											return (isNaN(b) ? 0 : b) * c;
										}),
										(g = {
											y: e(h[2]),
											M: e(h[3]),
											d: e(h[4]),
											h: e(h[5]),
											m: e(h[6]),
											s: e(h[7]),
											w: e(h[8])
										})),
						(d = new f(g)),
						cb.isDuration(a) &&
							a.hasOwnProperty("_lang") &&
							(d._lang = a._lang),
						d
					);
				},
				cb.version = eb,
				cb.defaultFormat = Kb,
				cb.updateOffset = function() {},
				cb.lang = function(a, b) {
					var c;
					return a
						? (b
								? z(x(a), b)
								: null === b ? (A(a), (a = "en")) : ob[a] || B(a),
							(c = cb.duration.fn._lang = cb.fn._lang = B(a)),
							c._abbr)
						: cb.fn._lang._abbr;
				},
				cb.langData = function(a) {
					return (
						a && a._lang && a._lang._abbr && (a = a._lang._abbr),
						B(a)
					);
				},
				cb.isMoment = function(a) {
					return a instanceof e;
				},
				cb.isDuration = function(a) {
					return a instanceof f;
				},
				db = Wb.length - 1;
			db >= 0;
			--db
		)
			p(Wb[db]);
		for (
			cb.normalizeUnits = function(a) {
				return n(a);
			},
				cb.invalid = function(a) {
					var b = cb.utc(0 / 0);
					return (
						null != a ? g(b._pf, a) : (b._pf.userInvalidated = !0),
						b
					);
				},
				cb.parseZone = function(a) {
					return cb(a).parseZone();
				},
				g((cb.fn = e.prototype), {
					clone: function() {
						return cb(this);
					},
					valueOf: function() {
						return +this._d + 6e4 * (this._offset || 0);
					},
					unix: function() {
						return Math.floor(+this / 1e3);
					},
					toString: function() {
						return this.clone()
							.lang("en")
							.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
					},
					toDate: function() {
						return this._offset ? new Date(+this) : this._d;
					},
					toISOString: function() {
						var a = cb(this).utc();
						return 0 < a.year() && a.year() <= 9999
							? E(a, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
							: E(a, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
					},
					toArray: function() {
						var a = this;
						return [
							a.year(),
							a.month(),
							a.date(),
							a.hours(),
							a.minutes(),
							a.seconds(),
							a.milliseconds()
						];
					},
					isValid: function() {
						return w(this);
					},
					isDSTShifted: function() {
						return this._a
							? this.isValid() &&
									m(
										this._a,
										(this._isUTC
											? cb.utc(this._a)
											: cb(this._a)
										).toArray()
									) > 0
							: !1;
					},
					parsingFlags: function() {
						return g({}, this._pf);
					},
					invalidAt: function() {
						return this._pf.overflow;
					},
					utc: function() {
						return this.zone(0);
					},
					local: function() {
						return this.zone(0), (this._isUTC = !1), this;
					},
					format: function(a) {
						var b = E(this, a || cb.defaultFormat);
						return this.lang().postformat(b);
					},
					add: function(a, b) {
						var c;
						return (
							(c =
								"string" == typeof a
									? cb.duration(+b, a)
									: cb.duration(a, b)),
							j(this, c, 1),
							this
						);
					},
					subtract: function(a, b) {
						var c;
						return (
							(c =
								"string" == typeof a
									? cb.duration(+b, a)
									: cb.duration(a, b)),
							j(this, c, -1),
							this
						);
					},
					diff: function(a, b, c) {
						var d,
							e,
							f = y(a, this),
							g = 6e4 * (this.zone() - f.zone());
						return (
							(b = n(b)),
							"year" === b || "month" === b
								? ((d =
										432e5 *
										(this.daysInMonth() + f.daysInMonth())),
									(e =
										12 * (this.year() - f.year()) +
										(this.month() - f.month())),
									(e +=
										(this -
											cb(this).startOf("month") -
											(f - cb(f).startOf("month"))) /
										d),
									(e -=
										6e4 *
										(this.zone() -
											cb(this)
												.startOf("month")
												.zone() -
											(f.zone() -
												cb(f)
													.startOf("month")
													.zone())) /
										d),
									"year" === b && (e /= 12))
								: ((d = this - f),
									(e =
										"second" === b
											? d / 1e3
											: "minute" === b
												? d / 6e4
												: "hour" === b
													? d / 36e5
													: "day" === b
														? (d - g) / 864e5
														: "week" === b
															? (d - g) / 6048e5
															: d)),
							c ? e : h(e)
						);
					},
					from: function(a, b) {
						return cb
							.duration(this.diff(a))
							.lang(this.lang()._abbr)
							.humanize(!b);
					},
					fromNow: function(a) {
						return this.from(cb(), a);
					},
					calendar: function() {
						var a = y(cb(), this).startOf("day"),
							b = this.diff(a, "days", !0),
							c =
								-6 > b
									? "sameElse"
									: -1 > b
										? "lastWeek"
										: 0 > b
											? "lastDay"
											: 1 > b
												? "sameDay"
												: 2 > b
													? "nextDay"
													: 7 > b ? "nextWeek" : "sameElse";
						return this.format(this.lang().calendar(c, this));
					},
					isLeapYear: function() {
						return t(this.year());
					},
					isDST: function() {
						return (
							this.zone() <
								this.clone()
									.month(0)
									.zone() ||
							this.zone() <
								this.clone()
									.month(5)
									.zone()
						);
					},
					day: function(a) {
						var b = this._isUTC
							? this._d.getUTCDay()
							: this._d.getDay();
						return null != a
							? ((a = U(a, this.lang())), this.add({ d: a - b }))
							: b;
					},
					month: function(a) {
						var b,
							c = this._isUTC ? "UTC" : "";
						return null != a
							? "string" == typeof a &&
								((a = this.lang().monthsParse(a)),
								"number" != typeof a)
								? this
								: ((b = this.date()),
									this.date(1),
									this._d["set" + c + "Month"](a),
									this.date(Math.min(b, this.daysInMonth())),
									cb.updateOffset(this),
									this)
							: this._d["get" + c + "Month"]();
					},
					startOf: function(a) {
						switch ((a = n(a))) {
							case "year":
								this.month(0);
							case "month":
								this.date(1);
							case "week":
							case "isoWeek":
							case "day":
								this.hours(0);
							case "hour":
								this.minutes(0);
							case "minute":
								this.seconds(0);
							case "second":
								this.milliseconds(0);
						}
						return (
							"week" === a
								? this.weekday(0)
								: "isoWeek" === a && this.isoWeekday(1),
							this
						);
					},
					endOf: function(a) {
						return (
							(a = n(a)),
							this.startOf(a)
								.add("isoWeek" === a ? "week" : a, 1)
								.subtract("ms", 1)
						);
					},
					isAfter: function(a, b) {
						return (
							(b = "undefined" != typeof b ? b : "millisecond"),
							+this.clone().startOf(b) > +cb(a).startOf(b)
						);
					},
					isBefore: function(a, b) {
						return (
							(b = "undefined" != typeof b ? b : "millisecond"),
							+this.clone().startOf(b) < +cb(a).startOf(b)
						);
					},
					isSame: function(a, b) {
						return (
							(b = b || "ms"),
							+this.clone().startOf(b) === +y(a, this).startOf(b)
						);
					},
					min: function(a) {
						return (
							(a = cb.apply(null, arguments)), this > a ? this : a
						);
					},
					max: function(a) {
						return (
							(a = cb.apply(null, arguments)), a > this ? this : a
						);
					},
					zone: function(a) {
						var b = this._offset || 0;
						return null == a
							? this._isUTC ? b : this._d.getTimezoneOffset()
							: ("string" == typeof a && (a = H(a)),
								Math.abs(a) < 16 && (a = 60 * a),
								(this._offset = a),
								(this._isUTC = !0),
								b !== a &&
									j(this, cb.duration(b - a, "m"), 1, !0),
								this);
					},
					zoneAbbr: function() {
						return this._isUTC ? "UTC" : "";
					},
					zoneName: function() {
						return this._isUTC ? "Coordinated Universal Time" : "";
					},
					parseZone: function() {
						return (
							this._tzm
								? this.zone(this._tzm)
								: "string" == typeof this._i &&
									this.zone(this._i),
							this
						);
					},
					hasAlignedHourOffset: function(a) {
						return (
							(a = a ? cb(a).zone() : 0),
							(this.zone() - a) % 60 === 0
						);
					},
					daysInMonth: function() {
						return r(this.year(), this.month());
					},
					dayOfYear: function(a) {
						var b =
							gb(
								(cb(this).startOf("day") -
									cb(this).startOf("year")) /
									864e5
							) + 1;
						return null == a ? b : this.add("d", a - b);
					},
					quarter: function() {
						return Math.ceil((this.month() + 1) / 3);
					},
					weekYear: function(a) {
						var b = X(
							this,
							this.lang()._week.dow,
							this.lang()._week.doy
						).year;
						return null == a ? b : this.add("y", a - b);
					},
					isoWeekYear: function(a) {
						var b = X(this, 1, 4).year;
						return null == a ? b : this.add("y", a - b);
					},
					week: function(a) {
						var b = this.lang().week(this);
						return null == a ? b : this.add("d", 7 * (a - b));
					},
					isoWeek: function(a) {
						var b = X(this, 1, 4).week;
						return null == a ? b : this.add("d", 7 * (a - b));
					},
					weekday: function(a) {
						var b = (this.day() + 7 - this.lang()._week.dow) % 7;
						return null == a ? b : this.add("d", a - b);
					},
					isoWeekday: function(a) {
						return null == a
							? this.day() || 7
							: this.day(this.day() % 7 ? a : a - 7);
					},
					get: function(a) {
						return (a = n(a)), this[a]();
					},
					set: function(a, b) {
						return (
							(a = n(a)),
							"function" == typeof this[a] && this[a](b),
							this
						);
					},
					lang: function(b) {
						return b === a
							? this._lang
							: ((this._lang = B(b)), this);
					}
				}),
				db = 0;
			db < Ob.length;
			db++
		)
			$(Ob[db].toLowerCase().replace(/s$/, ""), Ob[db]);
		$("year", "FullYear"),
			(cb.fn.days = cb.fn.day),
			(cb.fn.months = cb.fn.month),
			(cb.fn.weeks = cb.fn.week),
			(cb.fn.isoWeeks = cb.fn.isoWeek),
			(cb.fn.toJSON = cb.fn.toISOString),
			g((cb.duration.fn = f.prototype), {
				_bubble: function() {
					var a,
						b,
						c,
						d,
						e = this._milliseconds,
						f = this._days,
						g = this._months,
						i = this._data;
					(i.milliseconds = e % 1e3),
						(a = h(e / 1e3)),
						(i.seconds = a % 60),
						(b = h(a / 60)),
						(i.minutes = b % 60),
						(c = h(b / 60)),
						(i.hours = c % 24),
						(f += h(c / 24)),
						(i.days = f % 30),
						(g += h(f / 30)),
						(i.months = g % 12),
						(d = h(g / 12)),
						(i.years = d);
				},
				weeks: function() {
					return h(this.days() / 7);
				},
				valueOf: function() {
					return (
						this._milliseconds +
						864e5 * this._days +
						(this._months % 12) * 2592e6 +
						31536e6 * q(this._months / 12)
					);
				},
				humanize: function(a) {
					var b = +this,
						c = W(b, !a, this.lang());
					return (
						a && (c = this.lang().pastFuture(b, c)),
						this.lang().postformat(c)
					);
				},
				add: function(a, b) {
					var c = cb.duration(a, b);
					return (
						(this._milliseconds += c._milliseconds),
						(this._days += c._days),
						(this._months += c._months),
						this._bubble(),
						this
					);
				},
				subtract: function(a, b) {
					var c = cb.duration(a, b);
					return (
						(this._milliseconds -= c._milliseconds),
						(this._days -= c._days),
						(this._months -= c._months),
						this._bubble(),
						this
					);
				},
				get: function(a) {
					return (a = n(a)), this[a.toLowerCase() + "s"]();
				},
				as: function(a) {
					return (
						(a = n(a)),
						this[
							"as" + a.charAt(0).toUpperCase() + a.slice(1) + "s"
						]()
					);
				},
				lang: cb.fn.lang,
				toIsoString: function() {
					var a = Math.abs(this.years()),
						b = Math.abs(this.months()),
						c = Math.abs(this.days()),
						d = Math.abs(this.hours()),
						e = Math.abs(this.minutes()),
						f = Math.abs(
							this.seconds() + this.milliseconds() / 1e3
						);
					return this.asSeconds()
						? (this.asSeconds() < 0 ? "-" : "") +
								"P" +
								(a ? a + "Y" : "") +
								(b ? b + "M" : "") +
								(c ? c + "D" : "") +
								(d || e || f ? "T" : "") +
								(d ? d + "H" : "") +
								(e ? e + "M" : "") +
								(f ? f + "S" : "")
						: "P0D";
				}
			});
		for (db in Pb)
			Pb.hasOwnProperty(db) && (ab(db, Pb[db]), _(db.toLowerCase()));
		ab("Weeks", 6048e5),
			(cb.duration.fn.asMonths = function() {
				return (
					(+this - 31536e6 * this.years()) / 2592e6 +
					12 * this.years()
				);
			}),
			cb.lang("en", {
				ordinal: function(a) {
					var b = a % 10,
						c =
							1 === q((a % 100) / 10)
								? "th"
								: 1 === b
									? "st"
									: 2 === b ? "nd" : 3 === b ? "rd" : "th";
					return a + c;
				}
			}),
			pb
				? ((module.exports = cb), bb(!0))
				: "function" == typeof define && define.amd
					? define("moment", function(b, c, d) {
							return (
								d.config &&
									d.config() &&
									d.config().noGlobal !== !0 &&
									bb(d.config().noGlobal === a),
								cb
							);
						})
					: bb();
	}.call(this);
var QRCode;
!(function() {
	function a(a) {
		(this.mode = c.MODE_8BIT_BYTE), (this.data = a), (this.parsedData = []);
		for (var b = [], d = 0, e = this.data.length; e > d; d++) {
			var f = this.data.charCodeAt(d);
			f > 65536
				? ((b[0] = 240 | ((1835008 & f) >>> 18)),
					(b[1] = 128 | ((258048 & f) >>> 12)),
					(b[2] = 128 | ((4032 & f) >>> 6)),
					(b[3] = 128 | (63 & f)))
				: f > 2048
					? ((b[0] = 224 | ((61440 & f) >>> 12)),
						(b[1] = 128 | ((4032 & f) >>> 6)),
						(b[2] = 128 | (63 & f)))
					: f > 128
						? ((b[0] = 192 | ((1984 & f) >>> 6)),
							(b[1] = 128 | (63 & f)))
						: (b[0] = f),
				(this.parsedData = this.parsedData.concat(b));
		}
		this.parsedData.length != this.data.length &&
			(this.parsedData.unshift(191),
			this.parsedData.unshift(187),
			this.parsedData.unshift(239));
	}
	function b(a, b) {
		(this.typeNumber = a),
			(this.errorCorrectLevel = b),
			(this.modules = null),
			(this.moduleCount = 0),
			(this.dataCache = null),
			(this.dataList = []);
	}
	function i(a, b) {
		if (void 0 == a.length) throw new Error(a.length + "/" + b);
		for (var c = 0; c < a.length && 0 == a[c]; ) c++;
		this.num = new Array(a.length - c + b);
		for (var d = 0; d < a.length - c; d++) this.num[d] = a[d + c];
	}
	function j(a, b) {
		(this.totalCount = a), (this.dataCount = b);
	}
	function k() {
		(this.buffer = []), (this.length = 0);
	}
	function m() {
		return "undefined" != typeof CanvasRenderingContext2D;
	}
	function n() {
		var a = !1,
			b = navigator.userAgent;
		return (
			/android/i.test(b) &&
				((a = !0),
				(aMat = b.toString().match(/android ([0-9]\.[0-9])/i)),
				aMat && aMat[1] && (a = parseFloat(aMat[1]))),
			a
		);
	}
	function r(a, b) {
		for (var c = 1, e = s(a), f = 0, g = l.length; g >= f; f++) {
			var h = 0;
			switch (b) {
				case d.L:
					h = l[f][0];
					break;
				case d.M:
					h = l[f][1];
					break;
				case d.Q:
					h = l[f][2];
					break;
				case d.H:
					h = l[f][3];
			}
			if (h >= e) break;
			c++;
		}
		if (c > l.length) throw new Error("Too long data");
		return c;
	}
	function s(a) {
		var b = encodeURI(a)
			.toString()
			.replace(/\%[0-9a-fA-F]{2}/g, "a");
		return b.length + (b.length != a ? 3 : 0);
	}
	(a.prototype = {
		getLength: function() {
			return this.parsedData.length;
		},
		write: function(a) {
			for (var b = 0, c = this.parsedData.length; c > b; b++)
				a.put(this.parsedData[b], 8);
		}
	}),
		(b.prototype = {
			addData: function(b) {
				var c = new a(b);
				this.dataList.push(c), (this.dataCache = null);
			},
			isDark: function(a, b) {
				if (
					0 > a ||
					this.moduleCount <= a ||
					0 > b ||
					this.moduleCount <= b
				)
					throw new Error(a + "," + b);
				return this.modules[a][b];
			},
			getModuleCount: function() {
				return this.moduleCount;
			},
			make: function() {
				this.makeImpl(!1, this.getBestMaskPattern());
			},
			makeImpl: function(a, c) {
				(this.moduleCount = 4 * this.typeNumber + 17),
					(this.modules = new Array(this.moduleCount));
				for (var d = 0; d < this.moduleCount; d++) {
					this.modules[d] = new Array(this.moduleCount);
					for (var e = 0; e < this.moduleCount; e++)
						this.modules[d][e] = null;
				}
				this.setupPositionProbePattern(0, 0),
					this.setupPositionProbePattern(this.moduleCount - 7, 0),
					this.setupPositionProbePattern(0, this.moduleCount - 7),
					this.setupPositionAdjustPattern(),
					this.setupTimingPattern(),
					this.setupTypeInfo(a, c),
					this.typeNumber >= 7 && this.setupTypeNumber(a),
					null == this.dataCache &&
						(this.dataCache = b.createData(
							this.typeNumber,
							this.errorCorrectLevel,
							this.dataList
						)),
					this.mapData(this.dataCache, c);
			},
			setupPositionProbePattern: function(a, b) {
				for (var c = -1; 7 >= c; c++)
					if (!(-1 >= a + c || this.moduleCount <= a + c))
						for (var d = -1; 7 >= d; d++)
							-1 >= b + d ||
								this.moduleCount <= b + d ||
								(this.modules[a + c][b + d] =
									(c >= 0 && 6 >= c && (0 == d || 6 == d)) ||
									(d >= 0 && 6 >= d && (0 == c || 6 == c)) ||
									(c >= 2 && 4 >= c && d >= 2 && 4 >= d)
										? !0
										: !1);
			},
			getBestMaskPattern: function() {
				for (var a = 0, b = 0, c = 0; 8 > c; c++) {
					this.makeImpl(!0, c);
					var d = f.getLostPoint(this);
					(0 == c || a > d) && ((a = d), (b = c));
				}
				return b;
			},
			createMovieClip: function(a, b, c) {
				var d = a.createEmptyMovieClip(b, c),
					e = 1;
				this.make();
				for (var f = 0; f < this.modules.length; f++)
					for (
						var g = f * e, h = 0;
						h < this.modules[f].length;
						h++
					) {
						var i = h * e,
							j = this.modules[f][h];
						j &&
							(d.beginFill(0, 100),
							d.moveTo(i, g),
							d.lineTo(i + e, g),
							d.lineTo(i + e, g + e),
							d.lineTo(i, g + e),
							d.endFill());
					}
				return d;
			},
			setupTimingPattern: function() {
				for (var a = 8; a < this.moduleCount - 8; a++)
					null == this.modules[a][6] &&
						(this.modules[a][6] = 0 == a % 2);
				for (var b = 8; b < this.moduleCount - 8; b++)
					null == this.modules[6][b] &&
						(this.modules[6][b] = 0 == b % 2);
			},
			setupPositionAdjustPattern: function() {
				for (
					var a = f.getPatternPosition(this.typeNumber), b = 0;
					b < a.length;
					b++
				)
					for (var c = 0; c < a.length; c++) {
						var d = a[b],
							e = a[c];
						if (null == this.modules[d][e])
							for (var g = -2; 2 >= g; g++)
								for (var h = -2; 2 >= h; h++)
									this.modules[d + g][e + h] =
										-2 == g ||
										2 == g ||
										-2 == h ||
										2 == h ||
										(0 == g && 0 == h)
											? !0
											: !1;
					}
			},
			setupTypeNumber: function(a) {
				for (
					var b = f.getBCHTypeNumber(this.typeNumber), c = 0;
					18 > c;
					c++
				) {
					var d = !a && 1 == (1 & (b >> c));
					this.modules[Math.floor(c / 3)][
						c % 3 + this.moduleCount - 8 - 3
					] = d;
				}
				for (var c = 0; 18 > c; c++) {
					var d = !a && 1 == (1 & (b >> c));
					this.modules[c % 3 + this.moduleCount - 8 - 3][
						Math.floor(c / 3)
					] = d;
				}
			},
			setupTypeInfo: function(a, b) {
				for (
					var c = (this.errorCorrectLevel << 3) | b,
						d = f.getBCHTypeInfo(c),
						e = 0;
					15 > e;
					e++
				) {
					var g = !a && 1 == (1 & (d >> e));
					6 > e
						? (this.modules[e][8] = g)
						: 8 > e
							? (this.modules[e + 1][8] = g)
							: (this.modules[this.moduleCount - 15 + e][8] = g);
				}
				for (var e = 0; 15 > e; e++) {
					var g = !a && 1 == (1 & (d >> e));
					8 > e
						? (this.modules[8][this.moduleCount - e - 1] = g)
						: 9 > e
							? (this.modules[8][15 - e - 1 + 1] = g)
							: (this.modules[8][15 - e - 1] = g);
				}
				this.modules[this.moduleCount - 8][8] = !a;
			},
			mapData: function(a, b) {
				for (
					var c = -1,
						d = this.moduleCount - 1,
						e = 7,
						g = 0,
						h = this.moduleCount - 1;
					h > 0;
					h -= 2
				)
					for (6 == h && h--; ; ) {
						for (var i = 0; 2 > i; i++)
							if (null == this.modules[d][h - i]) {
								var j = !1;
								g < a.length && (j = 1 == (1 & (a[g] >>> e)));
								var k = f.getMask(b, d, h - i);
								k && (j = !j),
									(this.modules[d][h - i] = j),
									e--,
									-1 == e && (g++, (e = 7));
							}
						if (((d += c), 0 > d || this.moduleCount <= d)) {
							(d -= c), (c = -c);
							break;
						}
					}
			}
		}),
		(b.PAD0 = 236),
		(b.PAD1 = 17),
		(b.createData = function(a, c, d) {
			for (
				var e = j.getRSBlocks(a, c), g = new k(), h = 0;
				h < d.length;
				h++
			) {
				var i = d[h];
				g.put(i.mode, 4),
					g.put(i.getLength(), f.getLengthInBits(i.mode, a)),
					i.write(g);
			}
			for (var l = 0, h = 0; h < e.length; h++) l += e[h].dataCount;
			if (g.getLengthInBits() > 8 * l)
				throw new Error(
					"code length overflow. (" +
						g.getLengthInBits() +
						">" +
						8 * l +
						")"
				);
			for (
				g.getLengthInBits() + 4 <= 8 * l && g.put(0, 4);
				0 != g.getLengthInBits() % 8;

			)
				g.putBit(!1);
			for (
				;
				!(g.getLengthInBits() >= 8 * l) &&
				(g.put(b.PAD0, 8), !(g.getLengthInBits() >= 8 * l));

			)
				g.put(b.PAD1, 8);
			return b.createBytes(g, e);
		}),
		(b.createBytes = function(a, b) {
			for (
				var c = 0,
					d = 0,
					e = 0,
					g = new Array(b.length),
					h = new Array(b.length),
					j = 0;
				j < b.length;
				j++
			) {
				var k = b[j].dataCount,
					l = b[j].totalCount - k;
				(d = Math.max(d, k)),
					(e = Math.max(e, l)),
					(g[j] = new Array(k));
				for (var m = 0; m < g[j].length; m++)
					g[j][m] = 255 & a.buffer[m + c];
				c += k;
				var n = f.getErrorCorrectPolynomial(l),
					o = new i(g[j], n.getLength() - 1),
					p = o.mod(n);
				h[j] = new Array(n.getLength() - 1);
				for (var m = 0; m < h[j].length; m++) {
					var q = m + p.getLength() - h[j].length;
					h[j][m] = q >= 0 ? p.get(q) : 0;
				}
			}
			for (var r = 0, m = 0; m < b.length; m++) r += b[m].totalCount;
			for (var s = new Array(r), t = 0, m = 0; d > m; m++)
				for (var j = 0; j < b.length; j++)
					m < g[j].length && (s[t++] = g[j][m]);
			for (var m = 0; e > m; m++)
				for (var j = 0; j < b.length; j++)
					m < h[j].length && (s[t++] = h[j][m]);
			return s;
		});
	for (
		var c = {
				MODE_NUMBER: 1,
				MODE_ALPHA_NUM: 2,
				MODE_8BIT_BYTE: 4,
				MODE_KANJI: 8
			},
			d = { L: 1, M: 0, Q: 3, H: 2 },
			e = {
				PATTERN000: 0,
				PATTERN001: 1,
				PATTERN010: 2,
				PATTERN011: 3,
				PATTERN100: 4,
				PATTERN101: 5,
				PATTERN110: 6,
				PATTERN111: 7
			},
			f = {
				PATTERN_POSITION_TABLE: [
					[],
					[6, 18],
					[6, 22],
					[6, 26],
					[6, 30],
					[6, 34],
					[6, 22, 38],
					[6, 24, 42],
					[6, 26, 46],
					[6, 28, 50],
					[6, 30, 54],
					[6, 32, 58],
					[6, 34, 62],
					[6, 26, 46, 66],
					[6, 26, 48, 70],
					[6, 26, 50, 74],
					[6, 30, 54, 78],
					[6, 30, 56, 82],
					[6, 30, 58, 86],
					[6, 34, 62, 90],
					[6, 28, 50, 72, 94],
					[6, 26, 50, 74, 98],
					[6, 30, 54, 78, 102],
					[6, 28, 54, 80, 106],
					[6, 32, 58, 84, 110],
					[6, 30, 58, 86, 114],
					[6, 34, 62, 90, 118],
					[6, 26, 50, 74, 98, 122],
					[6, 30, 54, 78, 102, 126],
					[6, 26, 52, 78, 104, 130],
					[6, 30, 56, 82, 108, 134],
					[6, 34, 60, 86, 112, 138],
					[6, 30, 58, 86, 114, 142],
					[6, 34, 62, 90, 118, 146],
					[6, 30, 54, 78, 102, 126, 150],
					[6, 24, 50, 76, 102, 128, 154],
					[6, 28, 54, 80, 106, 132, 158],
					[6, 32, 58, 84, 110, 136, 162],
					[6, 26, 54, 82, 110, 138, 166],
					[6, 30, 58, 86, 114, 142, 170]
				],
				G15: 1335,
				G18: 7973,
				G15_MASK: 21522,
				getBCHTypeInfo: function(a) {
					for (
						var b = a << 10;
						f.getBCHDigit(b) - f.getBCHDigit(f.G15) >= 0;

					)
						b ^= f.G15 << (f.getBCHDigit(b) - f.getBCHDigit(f.G15));
					return ((a << 10) | b) ^ f.G15_MASK;
				},
				getBCHTypeNumber: function(a) {
					for (
						var b = a << 12;
						f.getBCHDigit(b) - f.getBCHDigit(f.G18) >= 0;

					)
						b ^= f.G18 << (f.getBCHDigit(b) - f.getBCHDigit(f.G18));
					return (a << 12) | b;
				},
				getBCHDigit: function(a) {
					for (var b = 0; 0 != a; ) b++, (a >>>= 1);
					return b;
				},
				getPatternPosition: function(a) {
					return f.PATTERN_POSITION_TABLE[a - 1];
				},
				getMask: function(a, b, c) {
					switch (a) {
						case e.PATTERN000:
							return 0 == (b + c) % 2;
						case e.PATTERN001:
							return 0 == b % 2;
						case e.PATTERN010:
							return 0 == c % 3;
						case e.PATTERN011:
							return 0 == (b + c) % 3;
						case e.PATTERN100:
							return (
								0 == (Math.floor(b / 2) + Math.floor(c / 3)) % 2
							);
						case e.PATTERN101:
							return 0 == (b * c) % 2 + (b * c) % 3;
						case e.PATTERN110:
							return 0 == ((b * c) % 2 + (b * c) % 3) % 2;
						case e.PATTERN111:
							return 0 == ((b * c) % 3 + (b + c) % 2) % 2;
						default:
							throw new Error("bad maskPattern:" + a);
					}
				},
				getErrorCorrectPolynomial: function(a) {
					for (var b = new i([1], 0), c = 0; a > c; c++)
						b = b.multiply(new i([1, g.gexp(c)], 0));
					return b;
				},
				getLengthInBits: function(a, b) {
					if (b >= 1 && 10 > b)
						switch (a) {
							case c.MODE_NUMBER:
								return 10;
							case c.MODE_ALPHA_NUM:
								return 9;
							case c.MODE_8BIT_BYTE:
								return 8;
							case c.MODE_KANJI:
								return 8;
							default:
								throw new Error("mode:" + a);
						}
					else if (27 > b)
						switch (a) {
							case c.MODE_NUMBER:
								return 12;
							case c.MODE_ALPHA_NUM:
								return 11;
							case c.MODE_8BIT_BYTE:
								return 16;
							case c.MODE_KANJI:
								return 10;
							default:
								throw new Error("mode:" + a);
						}
					else {
						if (!(41 > b)) throw new Error("type:" + b);
						switch (a) {
							case c.MODE_NUMBER:
								return 14;
							case c.MODE_ALPHA_NUM:
								return 13;
							case c.MODE_8BIT_BYTE:
								return 16;
							case c.MODE_KANJI:
								return 12;
							default:
								throw new Error("mode:" + a);
						}
					}
				},
				getLostPoint: function(a) {
					for (var b = a.getModuleCount(), c = 0, d = 0; b > d; d++)
						for (var e = 0; b > e; e++) {
							for (
								var f = 0, g = a.isDark(d, e), h = -1;
								1 >= h;
								h++
							)
								if (!(0 > d + h || d + h >= b))
									for (var i = -1; 1 >= i; i++)
										0 > e + i ||
											e + i >= b ||
											((0 != h || 0 != i) &&
												g == a.isDark(d + h, e + i) &&
												f++);
							f > 5 && (c += 3 + f - 5);
						}
					for (var d = 0; b - 1 > d; d++)
						for (var e = 0; b - 1 > e; e++) {
							var j = 0;
							a.isDark(d, e) && j++,
								a.isDark(d + 1, e) && j++,
								a.isDark(d, e + 1) && j++,
								a.isDark(d + 1, e + 1) && j++,
								(0 == j || 4 == j) && (c += 3);
						}
					for (var d = 0; b > d; d++)
						for (var e = 0; b - 6 > e; e++)
							a.isDark(d, e) &&
								!a.isDark(d, e + 1) &&
								a.isDark(d, e + 2) &&
								a.isDark(d, e + 3) &&
								a.isDark(d, e + 4) &&
								!a.isDark(d, e + 5) &&
								a.isDark(d, e + 6) &&
								(c += 40);
					for (var e = 0; b > e; e++)
						for (var d = 0; b - 6 > d; d++)
							a.isDark(d, e) &&
								!a.isDark(d + 1, e) &&
								a.isDark(d + 2, e) &&
								a.isDark(d + 3, e) &&
								a.isDark(d + 4, e) &&
								!a.isDark(d + 5, e) &&
								a.isDark(d + 6, e) &&
								(c += 40);
					for (var k = 0, e = 0; b > e; e++)
						for (var d = 0; b > d; d++) a.isDark(d, e) && k++;
					var l = Math.abs(100 * k / b / b - 50) / 5;
					return (c += 10 * l);
				}
			},
			g = {
				glog: function(a) {
					if (1 > a) throw new Error("glog(" + a + ")");
					return g.LOG_TABLE[a];
				},
				gexp: function(a) {
					for (; 0 > a; ) a += 255;
					for (; a >= 256; ) a -= 255;
					return g.EXP_TABLE[a];
				},
				EXP_TABLE: new Array(256),
				LOG_TABLE: new Array(256)
			},
			h = 0;
		8 > h;
		h++
	)
		g.EXP_TABLE[h] = 1 << h;
	for (var h = 8; 256 > h; h++)
		g.EXP_TABLE[h] =
			g.EXP_TABLE[h - 4] ^
			g.EXP_TABLE[h - 5] ^
			g.EXP_TABLE[h - 6] ^
			g.EXP_TABLE[h - 8];
	for (var h = 0; 255 > h; h++) g.LOG_TABLE[g.EXP_TABLE[h]] = h;

	(i.prototype = {
		get: function(a) {
			return this.num[a];
		},
		getLength: function() {
			return this.num.length;
		},
		multiply: function(a) {
			for (
				var b = new Array(this.getLength() + a.getLength() - 1), c = 0;
				c < this.getLength();
				c++
			)
				for (var d = 0; d < a.getLength(); d++)
					b[c + d] ^= g.gexp(g.glog(this.get(c)) + g.glog(a.get(d)));
			return new i(b, 0);
		},
		mod: function(a) {
			if (this.getLength() - a.getLength() < 0) return this;
			for (
				var b = g.glog(this.get(0)) - g.glog(a.get(0)),
					c = new Array(this.getLength()),
					d = 0;
				d < this.getLength();
				d++
			)
				c[d] = this.get(d);
			for (var d = 0; d < a.getLength(); d++)
				c[d] ^= g.gexp(g.glog(a.get(d)) + b);
			return new i(c, 0).mod(a);
		}
	}),
		(j.RS_BLOCK_TABLE = [
			[1, 26, 19],
			[1, 26, 16],
			[1, 26, 13],
			[1, 26, 9],
			[1, 44, 34],
			[1, 44, 28],
			[1, 44, 22],
			[1, 44, 16],
			[1, 70, 55],
			[1, 70, 44],
			[2, 35, 17],
			[2, 35, 13],
			[1, 100, 80],
			[2, 50, 32],
			[2, 50, 24],
			[4, 25, 9],
			[1, 134, 108],
			[2, 67, 43],
			[2, 33, 15, 2, 34, 16],
			[2, 33, 11, 2, 34, 12],
			[2, 86, 68],
			[4, 43, 27],
			[4, 43, 19],
			[4, 43, 15],
			[2, 98, 78],
			[4, 49, 31],
			[2, 32, 14, 4, 33, 15],
			[4, 39, 13, 1, 40, 14],
			[2, 121, 97],
			[2, 60, 38, 2, 61, 39],
			[4, 40, 18, 2, 41, 19],
			[4, 40, 14, 2, 41, 15],
			[2, 146, 116],
			[3, 58, 36, 2, 59, 37],
			[4, 36, 16, 4, 37, 17],
			[4, 36, 12, 4, 37, 13],
			[2, 86, 68, 2, 87, 69],
			[4, 69, 43, 1, 70, 44],
			[6, 43, 19, 2, 44, 20],
			[6, 43, 15, 2, 44, 16],
			[4, 101, 81],
			[1, 80, 50, 4, 81, 51],
			[4, 50, 22, 4, 51, 23],
			[3, 36, 12, 8, 37, 13],
			[2, 116, 92, 2, 117, 93],
			[6, 58, 36, 2, 59, 37],
			[4, 46, 20, 6, 47, 21],
			[7, 42, 14, 4, 43, 15],
			[4, 133, 107],
			[8, 59, 37, 1, 60, 38],
			[8, 44, 20, 4, 45, 21],
			[12, 33, 11, 4, 34, 12],
			[3, 145, 115, 1, 146, 116],
			[4, 64, 40, 5, 65, 41],
			[11, 36, 16, 5, 37, 17],
			[11, 36, 12, 5, 37, 13],
			[5, 109, 87, 1, 110, 88],
			[5, 65, 41, 5, 66, 42],
			[5, 54, 24, 7, 55, 25],
			[11, 36, 12],
			[5, 122, 98, 1, 123, 99],
			[7, 73, 45, 3, 74, 46],
			[15, 43, 19, 2, 44, 20],
			[3, 45, 15, 13, 46, 16],
			[1, 135, 107, 5, 136, 108],
			[10, 74, 46, 1, 75, 47],
			[1, 50, 22, 15, 51, 23],
			[2, 42, 14, 17, 43, 15],
			[5, 150, 120, 1, 151, 121],
			[9, 69, 43, 4, 70, 44],
			[17, 50, 22, 1, 51, 23],
			[2, 42, 14, 19, 43, 15],
			[3, 141, 113, 4, 142, 114],
			[3, 70, 44, 11, 71, 45],
			[17, 47, 21, 4, 48, 22],
			[9, 39, 13, 16, 40, 14],
			[3, 135, 107, 5, 136, 108],
			[3, 67, 41, 13, 68, 42],
			[15, 54, 24, 5, 55, 25],
			[15, 43, 15, 10, 44, 16],
			[4, 144, 116, 4, 145, 117],
			[17, 68, 42],
			[17, 50, 22, 6, 51, 23],
			[19, 46, 16, 6, 47, 17],
			[2, 139, 111, 7, 140, 112],
			[17, 74, 46],
			[7, 54, 24, 16, 55, 25],
			[34, 37, 13],
			[4, 151, 121, 5, 152, 122],
			[4, 75, 47, 14, 76, 48],
			[11, 54, 24, 14, 55, 25],
			[16, 45, 15, 14, 46, 16],
			[6, 147, 117, 4, 148, 118],
			[6, 73, 45, 14, 74, 46],
			[11, 54, 24, 16, 55, 25],
			[30, 46, 16, 2, 47, 17],
			[8, 132, 106, 4, 133, 107],
			[8, 75, 47, 13, 76, 48],
			[7, 54, 24, 22, 55, 25],
			[22, 45, 15, 13, 46, 16],
			[10, 142, 114, 2, 143, 115],
			[19, 74, 46, 4, 75, 47],
			[28, 50, 22, 6, 51, 23],
			[33, 46, 16, 4, 47, 17],
			[8, 152, 122, 4, 153, 123],
			[22, 73, 45, 3, 74, 46],
			[8, 53, 23, 26, 54, 24],
			[12, 45, 15, 28, 46, 16],
			[3, 147, 117, 10, 148, 118],
			[3, 73, 45, 23, 74, 46],
			[4, 54, 24, 31, 55, 25],
			[11, 45, 15, 31, 46, 16],
			[7, 146, 116, 7, 147, 117],
			[21, 73, 45, 7, 74, 46],
			[1, 53, 23, 37, 54, 24],
			[19, 45, 15, 26, 46, 16],
			[5, 145, 115, 10, 146, 116],
			[19, 75, 47, 10, 76, 48],
			[15, 54, 24, 25, 55, 25],
			[23, 45, 15, 25, 46, 16],
			[13, 145, 115, 3, 146, 116],
			[2, 74, 46, 29, 75, 47],
			[42, 54, 24, 1, 55, 25],
			[23, 45, 15, 28, 46, 16],
			[17, 145, 115],
			[10, 74, 46, 23, 75, 47],
			[10, 54, 24, 35, 55, 25],
			[19, 45, 15, 35, 46, 16],
			[17, 145, 115, 1, 146, 116],
			[14, 74, 46, 21, 75, 47],
			[29, 54, 24, 19, 55, 25],
			[11, 45, 15, 46, 46, 16],
			[13, 145, 115, 6, 146, 116],
			[14, 74, 46, 23, 75, 47],
			[44, 54, 24, 7, 55, 25],
			[59, 46, 16, 1, 47, 17],
			[12, 151, 121, 7, 152, 122],
			[12, 75, 47, 26, 76, 48],
			[39, 54, 24, 14, 55, 25],
			[22, 45, 15, 41, 46, 16],
			[6, 151, 121, 14, 152, 122],
			[6, 75, 47, 34, 76, 48],
			[46, 54, 24, 10, 55, 25],
			[2, 45, 15, 64, 46, 16],
			[17, 152, 122, 4, 153, 123],
			[29, 74, 46, 14, 75, 47],
			[49, 54, 24, 10, 55, 25],
			[24, 45, 15, 46, 46, 16],
			[4, 152, 122, 18, 153, 123],
			[13, 74, 46, 32, 75, 47],
			[48, 54, 24, 14, 55, 25],
			[42, 45, 15, 32, 46, 16],
			[20, 147, 117, 4, 148, 118],
			[40, 75, 47, 7, 76, 48],
			[43, 54, 24, 22, 55, 25],
			[10, 45, 15, 67, 46, 16],
			[19, 148, 118, 6, 149, 119],
			[18, 75, 47, 31, 76, 48],
			[34, 54, 24, 34, 55, 25],
			[20, 45, 15, 61, 46, 16]
		]),
		(j.getRSBlocks = function(a, b) {
			var c = j.getRsBlockTable(a, b);
			if (void 0 == c)
				throw new Error(
					"bad rs block @ typeNumber:" + a + "/errorCorrectLevel:" + b
				);
			for (var d = c.length / 3, e = [], f = 0; d > f; f++)
				for (
					var g = c[3 * f + 0],
						h = c[3 * f + 1],
						i = c[3 * f + 2],
						k = 0;
					g > k;
					k++
				)
					e.push(new j(h, i));
			return e;
		}),
		(j.getRsBlockTable = function(a, b) {
			switch (b) {
				case d.L:
					return j.RS_BLOCK_TABLE[4 * (a - 1) + 0];
				case d.M:
					return j.RS_BLOCK_TABLE[4 * (a - 1) + 1];
				case d.Q:
					return j.RS_BLOCK_TABLE[4 * (a - 1) + 2];
				case d.H:
					return j.RS_BLOCK_TABLE[4 * (a - 1) + 3];
				default:
					return void 0;
			}
		}),
		(k.prototype = {
			get: function(a) {
				var b = Math.floor(a / 8);
				return 1 == (1 & (this.buffer[b] >>> (7 - a % 8)));
			},
			put: function(a, b) {
				for (var c = 0; b > c; c++)
					this.putBit(1 == (1 & (a >>> (b - c - 1))));
			},
			getLengthInBits: function() {
				return this.length;
			},
			putBit: function(a) {
				var b = Math.floor(this.length / 8);
				this.buffer.length <= b && this.buffer.push(0),
					a && (this.buffer[b] |= 128 >>> (this.length % 8)),
					this.length++;
			}
		});
	var l = [
			[17, 14, 11, 7],
			[32, 26, 20, 14],
			[53, 42, 32, 24],
			[78, 62, 46, 34],
			[106, 84, 60, 44],
			[134, 106, 74, 58],
			[154, 122, 86, 64],
			[192, 152, 108, 84],
			[230, 180, 130, 98],
			[271, 213, 151, 119],
			[321, 251, 177, 137],
			[367, 287, 203, 155],
			[425, 331, 241, 177],
			[458, 362, 258, 194],
			[520, 412, 292, 220],
			[586, 450, 322, 250],
			[644, 504, 364, 280],
			[718, 560, 394, 310],
			[792, 624, 442, 338],
			[858, 666, 482, 382],
			[929, 711, 509, 403],
			[1003, 779, 565, 439],
			[1091, 857, 611, 461],
			[1171, 911, 661, 511],
			[1273, 997, 715, 535],
			[1367, 1059, 751, 593],
			[1465, 1125, 805, 625],
			[1528, 1190, 868, 658],
			[1628, 1264, 908, 698],
			[1732, 1370, 982, 742],
			[1840, 1452, 1030, 790],
			[1952, 1538, 1112, 842],
			[2068, 1628, 1168, 898],
			[2188, 1722, 1228, 958],
			[2303, 1809, 1283, 983],
			[2431, 1911, 1351, 1051],
			[2563, 1989, 1423, 1093],
			[2699, 2099, 1499, 1139],
			[2809, 2213, 1579, 1219],
			[2953, 2331, 1663, 1273]
		],
		o = (function() {
			var a = function(a, b) {
				(this._el = a), (this._htOption = b);
			};
			return (
				(a.prototype.draw = function(a) {
					function g(a, b) {
						var c = document.createElementNS(
							"http://www.w3.org/2000/svg",
							a
						);
						for (var d in b)
							b.hasOwnProperty(d) && c.setAttribute(d, b[d]);
						return c;
					}
					var b = this._htOption,
						c = this._el,
						d = a.getModuleCount();
					Math.floor(b.width / d),
						Math.floor(b.height / d),
						this.clear();
					var h = g("svg", {
						viewBox: "0 0 " + String(d) + " " + String(d),
						width: "100%",
						height: "100%",
						fill: b.colorLight
					});
					h.setAttributeNS(
						"http://www.w3.org/2000/xmlns/",
						"xmlns:xlink",
						"http://www.w3.org/1999/xlink"
					),
						c.appendChild(h),
						h.appendChild(
							g("rect", {
								fill: b.colorDark,
								width: "1",
								height: "1",
								id: "template"
							})
						);
					for (var i = 0; d > i; i++)
						for (var j = 0; d > j; j++)
							if (a.isDark(i, j)) {
								var k = g("use", {
									x: String(i),
									y: String(j)
								});
								k.setAttributeNS(
									"http://www.w3.org/1999/xlink",
									"href",
									"#template"
								),
									h.appendChild(k);
							}
				}),
				(a.prototype.clear = function() {
					for (; this._el.hasChildNodes(); )
						this._el.removeChild(this._el.lastChild);
				}),
				a
			);
		})(),
		p = "svg" === document.documentElement.tagName.toLowerCase(),
		q = p
			? o
			: m()
				? (function() {
						function a() {
							(this._elImage.src = this._elCanvas.toDataURL(
								"image/png"
							)),
								(this._elImage.style.display = "block"),
								(this._elCanvas.style.display = "none");
						}
						function d(a, b) {
							var c = this;
							if (
								((c._fFail = b),
								(c._fSuccess = a),
								null === c._bSupportDataURI)
							) {
								var d = document.createElement("img"),
									e = function() {
										(c._bSupportDataURI = !1),
											c._fFail && _fFail.call(c);
									},
									f = function() {
										(c._bSupportDataURI = !0),
											c._fSuccess && c._fSuccess.call(c);
									};
								return (
									(d.onabort = e),
									(d.onerror = e),
									(d.onload = f),
									void (d.src =
										"data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==")
								);
							}
							c._bSupportDataURI === !0 && c._fSuccess
								? c._fSuccess.call(c)
								: c._bSupportDataURI === !1 &&
									c._fFail &&
									c._fFail.call(c);
						}
						if (this._android && this._android <= 2.1) {
							var b = 1 / window.devicePixelRatio,
								c = CanvasRenderingContext2D.prototype.drawImage;
							CanvasRenderingContext2D.prototype.drawImage = function(
								a,
								d,
								e,
								f,
								g,
								h,
								i,
								j
							) {
								if ("nodeName" in a && /img/i.test(a.nodeName))
									for (var l = arguments.length - 1; l >= 1; l--)
										arguments[l] = arguments[l] * b;
								else
									"undefined" == typeof j &&
										((arguments[1] *= b),
										(arguments[2] *= b),
										(arguments[3] *= b),
										(arguments[4] *= b));
								c.apply(this, arguments);
							};
						}
						var e = function(a, b) {
							(this._bIsPainted = !1),
								(this._android = n()),
								(this._htOption = b),
								(this._elCanvas = document.createElement("canvas")),
								(this._elCanvas.width = b.width),
								(this._elCanvas.height = b.height),
								a.appendChild(this._elCanvas),
								(this._el = a),
								(this._oContext = this._elCanvas.getContext("2d")),
								(this._bIsPainted = !1),
								(this._elImage = document.createElement("img")),
								(this._elImage.style.display = "none"),
								this._el.appendChild(this._elImage),
								(this._bSupportDataURI = null);
						};
						return (
							(e.prototype.draw = function(a) {
								var b = this._elImage,
									c = this._oContext,
									d = this._htOption,
									e = a.getModuleCount(),
									f = d.width / e,
									g = d.height / e,
									h = Math.round(f),
									i = Math.round(g);
								(b.style.display = "none"), this.clear();
								for (var j = 0; e > j; j++)
									for (var k = 0; e > k; k++) {
										var l = a.isDark(j, k),
											m = k * f,
											n = j * g;
										(c.strokeStyle = l
											? d.colorDark
											: d.colorLight),
											(c.lineWidth = 1),
											(c.fillStyle = l
												? d.colorDark
												: d.colorLight),
											c.fillRect(m, n, f, g),
											c.strokeRect(
												Math.floor(m) + 0.5,
												Math.floor(n) + 0.5,
												h,
												i
											),
											c.strokeRect(
												Math.ceil(m) - 0.5,
												Math.ceil(n) - 0.5,
												h,
												i
											);
									}
								this._bIsPainted = !0;
							}),
							(e.prototype.makeImage = function() {
								this._bIsPainted && d.call(this, a);
							}),
							(e.prototype.isPainted = function() {
								return this._bIsPainted;
							}),
							(e.prototype.clear = function() {
								this._oContext.clearRect(
									0,
									0,
									this._elCanvas.width,
									this._elCanvas.height
								),
									(this._bIsPainted = !1);
							}),
							(e.prototype.round = function(a) {
								return a ? Math.floor(1e3 * a) / 1e3 : a;
							}),
							e
						);
					})()
				: (function() {
						var a = function(a, b) {
							(this._el = a), (this._htOption = b);
						};
						return (
							(a.prototype.draw = function(a) {
								for (
									var b = this._htOption,
										c = this._el,
										d = a.getModuleCount(),
										e = Math.floor(b.width / d),
										f = Math.floor(b.height / d),
										g = [
											'<table style="border:0;border-collapse:collapse;">'
										],
										h = 0;
									d > h;
									h++
								) {
									g.push("<tr>");
									for (var i = 0; d > i; i++)
										g.push(
											'<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' +
												e +
												"px;height:" +
												f +
												"px;background-color:" +
												(a.isDark(h, i)
													? b.colorDark
													: b.colorLight) +
												';"></td>'
										);
									g.push("</tr>");
								}
								g.push("</table>"), (c.innerHTML = g.join(""));
								var j = c.childNodes[0],
									k = (b.width - j.offsetWidth) / 2,
									l = (b.height - j.offsetHeight) / 2;
								k > 0 &&
									l > 0 &&
									(j.style.margin = l + "px " + k + "px");
							}),
							(a.prototype.clear = function() {
								this._el.innerHTML = "";
							}),
							a
						);
					})();
	(QRCode = function(a, b) {
		if (
			((this._htOption = {
				width: 256,
				height: 256,
				typeNumber: 4,
				colorDark: "#000000",
				colorLight: "#ffffff",
				correctLevel: d.H
			}),
			"string" == typeof b && (b = { text: b }),
			b)
		)
			for (var c in b) this._htOption[c] = b[c];
		"string" == typeof a && (a = document.getElementById(a)),
			(this._android = n()),
			(this._el = a),
			(this._oQRCode = null),
			(this._oDrawing = new q(this._el, this._htOption)),
			this._htOption.text && this.makeCode(this._htOption.text);
	}),
		(QRCode.prototype.makeCode = function(a) {
			(this._oQRCode = new b(
				r(a, this._htOption.correctLevel),
				this._htOption.correctLevel
			)),
				this._oQRCode.addData(a),
				this._oQRCode.make(),
				(this._el.title = a),
				this._oDrawing.draw(this._oQRCode),
				this.makeImage();
		}),
		(QRCode.prototype.makeImage = function() {
			"function" == typeof this._oDrawing.makeImage &&
				(!this._android || this._android >= 3) &&
				this._oDrawing.makeImage();
		}),
		(QRCode.prototype.clear = function() {
			this._oDrawing.clear();
		}),
		(QRCode.CorrectLevel = d);
})(),
	(function() {
		function D() {
			var a = "{}";
			if ("userDataBehavior" == k) {
				d.load("jStorage");
				try {
					a = d.getAttribute("jStorage");
				} catch (b) {}
				try {
					r = d.getAttribute("jStorage_update");
				} catch (c) {}
				h.jStorage = a;
			}
			E(), x(), F();
		}
		function u() {
			var a;
			clearTimeout(G),
				(G = setTimeout(function() {
					if ("localStorage" == k || "globalStorage" == k)
						a = h.jStorage_update;
					else if ("userDataBehavior" == k) {
						d.load("jStorage");
						try {
							a = d.getAttribute("jStorage_update");
						} catch (b) {}
					}
					if (a && a != r) {
						r = a;
						var p,
							l = m.parse(m.stringify(c.__jstorage_meta.CRC32));
						D(),
							(p = m.parse(m.stringify(c.__jstorage_meta.CRC32)));
						var e,
							z = [],
							f = [];
						for (e in l)
							l.hasOwnProperty(e) &&
								(p[e]
									? l[e] != p[e] &&
										"2." == String(l[e]).substr(0, 2) &&
										z.push(e)
									: f.push(e));
						for (e in p) p.hasOwnProperty(e) && (l[e] || z.push(e));
						s(z, "updated"), s(f, "deleted");
					}
				}, 25));
		}
		function s(a, b) {
			if (((a = [].concat(a || [])), "flushed" == b)) {
				a = [];
				for (var c in g) g.hasOwnProperty(c) && a.push(c);
				b = "deleted";
			}
			c = 0;
			for (var p = a.length; p > c; c++) {
				if (g[a[c]])
					for (var e = 0, d = g[a[c]].length; d > e; e++)
						g[a[c]][e](a[c], b);
				if (g["*"])
					for (e = 0, d = g["*"].length; d > e; e++)
						g["*"][e](a[c], b);
			}
		}
		function v() {
			var a = (+new Date()).toString();
			if ("localStorage" == k || "globalStorage" == k)
				try {
					h.jStorage_update = a;
				} catch (b) {
					k = !1;
				}
			else
				"userDataBehavior" == k &&
					(d.setAttribute("jStorage_update", a), d.save("jStorage"));
			u();
		}
		function E() {
			if (h.jStorage)
				try {
					c = m.parse(String(h.jStorage));
				} catch (a) {
					h.jStorage = "{}";
				}
			else h.jStorage = "{}";
			(A = h.jStorage ? String(h.jStorage).length : 0),
				c.__jstorage_meta || (c.__jstorage_meta = {}),
				c.__jstorage_meta.CRC32 || (c.__jstorage_meta.CRC32 = {});
		}
		function w() {
			if (c.__jstorage_meta.PubSub) {
				for (
					var a = +new Date() - 2e3,
						b = 0,
						l = c.__jstorage_meta.PubSub.length;
					l > b;
					b++
				)
					if (c.__jstorage_meta.PubSub[b][0] <= a) {
						c.__jstorage_meta.PubSub.splice(
							b,
							c.__jstorage_meta.PubSub.length - b
						);
						break;
					}
				c.__jstorage_meta.PubSub.length ||
					delete c.__jstorage_meta.PubSub;
			}
			try {
				(h.jStorage = m.stringify(c)),
					d &&
						(d.setAttribute("jStorage", h.jStorage),
						d.save("jStorage")),
					(A = h.jStorage ? String(h.jStorage).length : 0);
			} catch (p) {}
		}
		function q(a) {
			if ("string" != typeof a && "number" != typeof a)
				throw new TypeError("Key name must be string or numeric");
			if ("__jstorage_meta" == a)
				throw new TypeError("Reserved key name");
			return !0;
		}
		function x() {
			var a,
				b,
				l,
				d,
				e = 1 / 0,
				h = !1,
				f = [];
			if (
				(clearTimeout(H),
				c.__jstorage_meta && "object" == typeof c.__jstorage_meta.TTL)
			) {
				(a = +new Date()),
					(l = c.__jstorage_meta.TTL),
					(d = c.__jstorage_meta.CRC32);
				for (b in l)
					l.hasOwnProperty(b) &&
						(l[b] <= a
							? (delete l[b],
								delete d[b],
								delete c[b],
								(h = !0),
								f.push(b))
							: l[b] < e && (e = l[b]));
				1 / 0 != e && (H = setTimeout(x, e - a)),
					h && (w(), v(), s(f, "deleted"));
			}
		}
		function F() {
			var a;
			if (c.__jstorage_meta.PubSub) {
				var b,
					l = B;
				for (a = c.__jstorage_meta.PubSub.length - 1; a >= 0; a--)
					if (((b = c.__jstorage_meta.PubSub[a]), b[0] > B)) {
						var l = b[0],
							d = b[1];
						if (((b = b[2]), t[d]))
							for (var e = 0, h = t[d].length; h > e; e++)
								try {
									t[d][e](d, m.parse(m.stringify(b)));
								} catch (f) {}
					}
				B = l;
			}
		}
		var y = window.jQuery || window.$ || (window.$ = {}),
			m = {
				parse:
					(window.JSON &&
						(window.JSON.parse || window.JSON.decode)) ||
					(String.prototype.evalJSON &&
						function(a) {
							return String(a).evalJSON();
						}) ||
					y.parseJSON ||
					y.evalJSON,
				stringify:
					Object.toJSON ||
					(window.JSON &&
						(window.JSON.stringify || window.JSON.encode)) ||
					y.toJSON
			};
		if (!("parse" in m && "stringify" in m))
			throw Error(
				"No JSON support found, include //cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js to page"
			);
		var H,
			c = { __jstorage_meta: { CRC32: {} } },
			h = { jStorage: "{}" },
			d = null,
			A = 0,
			k = !1,
			g = {},
			G = !1,
			r = 0,
			t = {},
			B = +new Date(),
			C = {
				isXML: function(a) {
					return (a = (a ? a.ownerDocument || a : 0).documentElement)
						? "HTML" !== a.nodeName
						: !1;
				},
				encode: function(a) {
					if (!this.isXML(a)) return !1;
					try {
						return new XMLSerializer().serializeToString(a);
					} catch (b) {
						try {
							return a.xml;
						} catch (c) {}
					}
					return !1;
				},
				decode: function(a) {
					var b =
						("DOMParser" in window &&
							new DOMParser().parseFromString) ||
						(window.ActiveXObject &&
							function(a) {
								var b = new ActiveXObject("Microsoft.XMLDOM");
								return (b.async = "false"), b.loadXML(a), b;
							});
					return b
						? ((a = b.call(
								("DOMParser" in window && new DOMParser()) ||
									window,
								a,
								"text/xml"
							)),
							this.isXML(a) ? a : !1)
						: !1;
				}
			};
		(y.jStorage = {
			version: "0.4.8",
			set: function(a, b, d) {
				if ((q(a), (d = d || {}), "undefined" == typeof b))
					return this.deleteKey(a), b;
				if (C.isXML(b)) b = { _is_xml: !0, xml: C.encode(b) };
				else {
					if ("function" == typeof b) return;
					b && "object" == typeof b && (b = m.parse(m.stringify(b)));
				}
				c[a] = b;
				for (
					var n,
						h = c.__jstorage_meta.CRC32,
						e = m.stringify(b),
						k = e.length,
						f = 2538058380 ^ k,
						g = 0;
					k >= 4;

				)
					(n =
						(255 & e.charCodeAt(g)) |
						((255 & e.charCodeAt(++g)) << 8) |
						((255 & e.charCodeAt(++g)) << 16) |
						((255 & e.charCodeAt(++g)) << 24)),
						(n =
							1540483477 * (65535 & n) +
							(((1540483477 * (n >>> 16)) & 65535) << 16)),
						(n ^= n >>> 24),
						(n =
							1540483477 * (65535 & n) +
							(((1540483477 * (n >>> 16)) & 65535) << 16)),
						(f =
							(1540483477 * (65535 & f) +
								(((1540483477 * (f >>> 16)) & 65535) << 16)) ^
							n),
						(k -= 4),
						++g;
				switch (k) {
					case 3:
						f ^= (255 & e.charCodeAt(g + 2)) << 16;
					case 2:
						f ^= (255 & e.charCodeAt(g + 1)) << 8;
					case 1:
						(f ^= 255 & e.charCodeAt(g)),
							(f =
								1540483477 * (65535 & f) +
								(((1540483477 * (f >>> 16)) & 65535) << 16));
				}
				return (
					(f ^= f >>> 13),
					(f =
						1540483477 * (65535 & f) +
						(((1540483477 * (f >>> 16)) & 65535) << 16)),
					(h[a] = "2." + ((f ^ (f >>> 15)) >>> 0)),
					this.setTTL(a, d.TTL || 0),
					s(a, "updated"),
					b
				);
			},
			get: function(a, b) {
				return (
					q(a),
					a in c
						? c[a] && "object" == typeof c[a] && c[a]._is_xml
							? C.decode(c[a].xml)
							: c[a]
						: "undefined" == typeof b ? null : b
				);
			},
			deleteKey: function(a) {
				return (
					q(a),
					a in c
						? (delete c[a],
							"object" == typeof c.__jstorage_meta.TTL &&
								a in c.__jstorage_meta.TTL &&
								delete c.__jstorage_meta.TTL[a],
							delete c.__jstorage_meta.CRC32[a],
							w(),
							v(),
							s(a, "deleted"),
							!0)
						: !1
				);
			},
			setTTL: function(a, b) {
				var d = +new Date();
				return (
					q(a),
					(b = Number(b) || 0),
					a in c
						? (c.__jstorage_meta.TTL ||
								(c.__jstorage_meta.TTL = {}),
							b > 0
								? (c.__jstorage_meta.TTL[a] = d + b)
								: delete c.__jstorage_meta.TTL[a],
							w(),
							x(),
							v(),
							!0)
						: !1
				);
			},
			getTTL: function(a) {
				var b = +new Date();
				return (
					q(a),
					a in c && c.__jstorage_meta.TTL && c.__jstorage_meta.TTL[a]
						? (a = c.__jstorage_meta.TTL[a] - b) || 0
						: 0
				);
			},
			flush: function() {
				return (
					(c = { __jstorage_meta: { CRC32: {} } }),
					w(),
					v(),
					s(null, "flushed"),
					!0
				);
			},
			storageObj: function() {
				function a() {}
				return (a.prototype = c), new a();
			},
			index: function() {
				var b,
					a = [];
				for (b in c)
					c.hasOwnProperty(b) && "__jstorage_meta" != b && a.push(b);
				return a;
			},
			storageSize: function() {
				return A;
			},
			currentBackend: function() {
				return k;
			},
			storageAvailable: function() {
				return !!k;
			},
			listenKeyChange: function(a, b) {
				q(a), g[a] || (g[a] = []), g[a].push(b);
			},
			stopListening: function(a, b) {
				if ((q(a), g[a]))
					if (b)
						for (var c = g[a].length - 1; c >= 0; c--)
							g[a][c] == b && g[a].splice(c, 1);
					else delete g[a];
			},
			subscribe: function(a, b) {
				if (((a = (a || "").toString()), !a))
					throw new TypeError("Channel not defined");
				t[a] || (t[a] = []), t[a].push(b);
			},
			publish: function(a, b) {
				if (((a = (a || "").toString()), !a))
					throw new TypeError("Channel not defined");
				c.__jstorage_meta || (c.__jstorage_meta = {}),
					c.__jstorage_meta.PubSub || (c.__jstorage_meta.PubSub = []),
					c.__jstorage_meta.PubSub.unshift([+new Date(), a, b]),
					w(),
					v();
			},
			reInit: function() {
				D();
			},
			noConflict: function(a) {
				return (
					delete window.$.jStorage,
					a && (window.jStorage = this),
					this
				);
			}
		}),
			(function() {
				var a = !1;
				if ("localStorage" in window)
					try {
						window.localStorage.setItem("_tmptest", "tmpval"),
							(a = !0),
							window.localStorage.removeItem("_tmptest");
					} catch (b) {}
				if (a)
					try {
						window.localStorage &&
							((h = window.localStorage),
							(k = "localStorage"),
							(r = h.jStorage_update));
					} catch (c) {}
				else if ("globalStorage" in window)
					try {
						window.globalStorage &&
							((h =
								"localhost" == window.location.hostname
									? window.globalStorage[
											"localhost.localdomain"
										]
									: window.globalStorage[
											window.location.hostname
										]),
							(k = "globalStorage"),
							(r = h.jStorage_update));
					} catch (g) {}
				else {
					if (((d = document.createElement("link")), !d.addBehavior))
						return void (d = null);
					(d.style.behavior = "url(#default#userData)"),
						document.getElementsByTagName("head")[0].appendChild(d);
					try {
						d.load("jStorage");
					} catch (e) {
						d.setAttribute("jStorage", "{}"),
							d.save("jStorage"),
							d.load("jStorage");
					}
					a = "{}";
					try {
						a = d.getAttribute("jStorage");
					} catch (m) {}
					try {
						r = d.getAttribute("jStorage_update");
					} catch (f) {}
					(h.jStorage = a), (k = "userDataBehavior");
				}
				E(),
					x(),
					"localStorage" == k || "globalStorage" == k
						? "addEventListener" in window
							? window.addEventListener("storage", u, !1)
							: document.attachEvent("onstorage", u)
						: "userDataBehavior" == k && setInterval(u, 1e3),
					F(),
					"addEventListener" in window &&
						window.addEventListener(
							"pageshow",
							function(a) {
								a.persisted && u();
							},
							!1
						);
			})();
	})(),
	(function(jQuery, undefined) {
		function clamp(value, prop, allowEmpty) {
			var type = propTypes[prop.type] || {};
			return null == value
				? allowEmpty || !prop.def ? null : prop.def
				: ((value = type.floor ? ~~value : parseFloat(value)),
					isNaN(value)
						? prop.def
						: type.mod
							? (value + type.mod) % type.mod
							: 0 > value ? 0 : type.max < value ? type.max : value);
		}
		function stringParse(string) {
			var inst = color(),
				rgba = (inst._rgba = []);
			return (
				(string = string.toLowerCase()),
				each(stringParsers, function(i, parser) {
					var parsed,
						match = parser.re.exec(string),
						values = match && parser.parse(match),
						spaceName = parser.space || "rgba";
					return values
						? ((parsed = inst[spaceName](values)),
							(inst[spaces[spaceName].cache] =
								parsed[spaces[spaceName].cache]),
							(rgba = inst._rgba = parsed._rgba),
							!1)
						: void 0;
				}),
				rgba.length
					? ("0,0,0,0" === rgba.join() &&
							jQuery.extend(rgba, colors.transparent),
						inst)
					: colors[string]
			);
		}
		function hue2rgb(p, q, h) {
			return (
				(h = (h + 1) % 1),
				1 > 6 * h
					? p + (q - p) * h * 6
					: 1 > 2 * h
						? q
						: 2 > 3 * h ? p + (q - p) * (2 / 3 - h) * 6 : p
			);
		}
		var colors,
			stepHooks =
				"backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",
			rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,
			stringParsers = [
				{
					re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
					parse: function(execResult) {
						return [
							execResult[1],
							execResult[2],
							execResult[3],
							execResult[4]
						];
					}
				},
				{
					re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
					parse: function(execResult) {
						return [
							2.55 * execResult[1],
							2.55 * execResult[2],
							2.55 * execResult[3],
							execResult[4]
						];
					}
				},
				{
					re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
					parse: function(execResult) {
						return [
							parseInt(execResult[1], 16),
							parseInt(execResult[2], 16),
							parseInt(execResult[3], 16)
						];
					}
				},
				{
					re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
					parse: function(execResult) {
						return [
							parseInt(execResult[1] + execResult[1], 16),
							parseInt(execResult[2] + execResult[2], 16),
							parseInt(execResult[3] + execResult[3], 16)
						];
					}
				},
				{
					re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
					space: "hsla",
					parse: function(execResult) {
						return [
							execResult[1],
							execResult[2] / 100,
							execResult[3] / 100,
							execResult[4]
						];
					}
				}
			],
			color = (jQuery.Color = function(color, green, blue, alpha) {
				return new jQuery.Color.fn.parse(color, green, blue, alpha);
			}),
			spaces = {
				rgba: {
					props: {
						red: { idx: 0, type: "byte" },
						green: { idx: 1, type: "byte" },
						blue: { idx: 2, type: "byte" }
					}
				},
				hsla: {
					props: {
						hue: { idx: 0, type: "degrees" },
						saturation: { idx: 1, type: "percent" },
						lightness: { idx: 2, type: "percent" }
					}
				}
			},
			propTypes = {
				byte: { floor: !0, max: 255 },
				percent: { max: 1 },
				degrees: { mod: 360, floor: !0 }
			},
			support = (color.support = {}),
			supportElem = jQuery("<p>")[0],
			each = jQuery.each;
		(supportElem.style.cssText = "background-color:rgba(1,1,1,.5)"),
			(support.rgba =
				supportElem.style.backgroundColor.indexOf("rgba") > -1),
			each(spaces, function(spaceName, space) {
				(space.cache = "_" + spaceName),
					(space.props.alpha = { idx: 3, type: "percent", def: 1 });
			}),
			(color.fn = jQuery.extend(color.prototype, {
				parse: function(red, green, blue, alpha) {
					if (red === undefined)
						return (this._rgba = [null, null, null, null]), this;
					(red.jquery || red.nodeType) &&
						((red = jQuery(red).css(green)), (green = undefined));
					var inst = this,
						type = jQuery.type(red),
						rgba = (this._rgba = []);
					return (
						green !== undefined &&
							((red = [red, green, blue, alpha]),
							(type = "array")),
						"string" === type
							? this.parse(stringParse(red) || colors._default)
							: "array" === type
								? (each(spaces.rgba.props, function(key, prop) {
										rgba[prop.idx] = clamp(red[prop.idx], prop);
									}),
									this)
								: "object" === type
									? (red instanceof color
											? each(spaces, function(
													spaceName,
													space
												) {
													red[space.cache] &&
														(inst[space.cache] = red[
															space.cache
														].slice());
												})
											: each(spaces, function(
													spaceName,
													space
												) {
													var cache = space.cache;
													each(space.props, function(
														key,
														prop
													) {
														if (!inst[cache] && space.to) {
															if (
																"alpha" === key ||
																null == red[key]
															)
																return;
															inst[cache] = space.to(
																inst._rgba
															);
														}
														inst[cache][prop.idx] = clamp(
															red[key],
															prop,
															!0
														);
													}),
														inst[cache] &&
															jQuery.inArray(
																null,
																inst[cache].slice(0, 3)
															) < 0 &&
															((inst[cache][3] = 1),
															space.from &&
																(inst._rgba = space.from(
																	inst[cache]
																)));
												}),
										this)
									: void 0
					);
				},
				is: function(compare) {
					var is = color(compare),
						same = !0,
						inst = this;
					return (
						each(spaces, function(_, space) {
							var localCache,
								isCache = is[space.cache];
							return (
								isCache &&
									((localCache =
										inst[space.cache] ||
										(space.to && space.to(inst._rgba)) ||
										[]),
									each(space.props, function(_, prop) {
										return null != isCache[prop.idx]
											? (same =
													isCache[prop.idx] ===
													localCache[prop.idx])
											: void 0;
									})),
								same
							);
						}),
						same
					);
				},
				_space: function() {
					var used = [],
						inst = this;
					return (
						each(spaces, function(spaceName, space) {
							inst[space.cache] && used.push(spaceName);
						}),
						used.pop()
					);
				},
				transition: function(other, distance) {
					var end = color(other),
						spaceName = end._space(),
						space = spaces[spaceName],
						startColor =
							0 === this.alpha() ? color("transparent") : this,
						start =
							startColor[space.cache] ||
							space.to(startColor._rgba),
						result = start.slice();
					return (
						(end = end[space.cache]),
						each(space.props, function(key, prop) {
							var index = prop.idx,
								startValue = start[index],
								endValue = end[index],
								type = propTypes[prop.type] || {};
							null !== endValue &&
								(null === startValue
									? (result[index] = endValue)
									: (type.mod &&
											(endValue - startValue > type.mod / 2
												? (startValue += type.mod)
												: startValue - endValue >
														type.mod / 2 &&
													(startValue -= type.mod)),
										(result[index] = clamp(
											(endValue - startValue) * distance +
												startValue,
											prop
										))));
						}),
						this[spaceName](result)
					);
				},
				blend: function(opaque) {
					if (1 === this._rgba[3]) return this;
					var rgb = this._rgba.slice(),
						a = rgb.pop(),
						blend = color(opaque)._rgba;
					return color(
						jQuery.map(rgb, function(v, i) {
							return (1 - a) * blend[i] + a * v;
						})
					);
				},
				toRgbaString: function() {
					var prefix = "rgba(",
						rgba = jQuery.map(this._rgba, function(v, i) {
							return null == v ? (i > 2 ? 1 : 0) : v;
						});
					return (
						1 === rgba[3] && (rgba.pop(), (prefix = "rgb(")),
						prefix + rgba.join() + ")"
					);
				},
				toHslaString: function() {
					var prefix = "hsla(",
						hsla = jQuery.map(this.hsla(), function(v, i) {
							return (
								null == v && (v = i > 2 ? 1 : 0),
								i && 3 > i && (v = Math.round(100 * v) + "%"),
								v
							);
						});
					return (
						1 === hsla[3] && (hsla.pop(), (prefix = "hsl(")),
						prefix + hsla.join() + ")"
					);
				},
				toHexString: function(includeAlpha) {
					var rgba = this._rgba.slice(),
						alpha = rgba.pop();
					return (
						includeAlpha && rgba.push(~~(255 * alpha)),
						"#" +
							jQuery
								.map(rgba, function(v) {
									return (
										(v = (v || 0).toString(16)),
										1 === v.length ? "0" + v : v
									);
								})
								.join("")
					);
				},
				toString: function() {
					return 0 === this._rgba[3]
						? "transparent"
						: this.toRgbaString();
				}
			})),
			(color.fn.parse.prototype = color.fn),
			(spaces.hsla.to = function(rgba) {
				if (null == rgba[0] || null == rgba[1] || null == rgba[2])
					return [null, null, null, rgba[3]];
				var h,
					s,
					r = rgba[0] / 255,
					g = rgba[1] / 255,
					b = rgba[2] / 255,
					a = rgba[3],
					max = Math.max(r, g, b),
					min = Math.min(r, g, b),
					diff = max - min,
					add = max + min,
					l = 0.5 * add;
				return (
					(h =
						min === max
							? 0
							: r === max
								? 60 * (g - b) / diff + 360
								: g === max
									? 60 * (b - r) / diff + 120
									: 60 * (r - g) / diff + 240),
					(s =
						0 === diff
							? 0
							: 0.5 >= l ? diff / add : diff / (2 - add)),
					[Math.round(h) % 360, s, l, null == a ? 1 : a]
				);
			}),
			(spaces.hsla.from = function(hsla) {
				if (null == hsla[0] || null == hsla[1] || null == hsla[2])
					return [null, null, null, hsla[3]];
				var h = hsla[0] / 360,
					s = hsla[1],
					l = hsla[2],
					a = hsla[3],
					q = 0.5 >= l ? l * (1 + s) : l + s - l * s,
					p = 2 * l - q;
				return [
					Math.round(255 * hue2rgb(p, q, h + 1 / 3)),
					Math.round(255 * hue2rgb(p, q, h)),
					Math.round(255 * hue2rgb(p, q, h - 1 / 3)),
					a
				];
			}),
			each(spaces, function(spaceName, space) {
				var props = space.props,
					cache = space.cache,
					to = space.to,
					from = space.from;
				(color.fn[spaceName] = function(value) {
					if (
						(to && !this[cache] && (this[cache] = to(this._rgba)),
						value === undefined)
					)
						return this[cache].slice();
					var ret,
						type = jQuery.type(value),
						arr =
							"array" === type || "object" === type
								? value
								: arguments,
						local = this[cache].slice();
					return (
						each(props, function(key, prop) {
							var val = arr["object" === type ? key : prop.idx];
							null == val && (val = local[prop.idx]),
								(local[prop.idx] = clamp(val, prop));
						}),
						from
							? ((ret = color(from(local))),
								(ret[cache] = local),
								ret)
							: color(local)
					);
				}),
					each(props, function(key, prop) {
						color.fn[key] ||
							(color.fn[key] = function(value) {
								var match,
									vtype = jQuery.type(value),
									fn =
										"alpha" === key
											? this._hsla ? "hsla" : "rgba"
											: spaceName,
									local = this[fn](),
									cur = local[prop.idx];
								return "undefined" === vtype
									? cur
									: ("function" === vtype &&
											((value = value.call(this, cur)),
											(vtype = jQuery.type(value))),
										null == value && prop.empty
											? this
											: ("string" === vtype &&
													((match = rplusequals.exec(
														value
													)),
													match &&
														(value =
															cur +
															parseFloat(match[2]) *
																("+" === match[1]
																	? 1
																	: -1))),
												(local[prop.idx] = value),
												this[fn](local)));
							});
					});
			}),
			(color.hook = function(hook) {
				var hooks = hook.split(" ");
				each(hooks, function(i, hook) {
					(jQuery.cssHooks[hook] = {
						set: function(elem, value) {
							var parsed,
								curElem,
								backgroundColor = "";
							if (
								"transparent" !== value &&
								("string" !== jQuery.type(value) ||
									(parsed = stringParse(value)))
							) {
								if (
									((value = color(parsed || value)),
									!support.rgba && 1 !== value._rgba[3])
								) {
									for (
										curElem =
											"backgroundColor" === hook
												? elem.parentNode
												: elem;
										("" === backgroundColor ||
											"transparent" ===
												backgroundColor) &&
										curElem &&
										curElem.style;

									)
										try {
											(backgroundColor = jQuery.css(
												curElem,
												"backgroundColor"
											)),
												(curElem = curElem.parentNode);
										} catch (e) {}
									value = value.blend(
										backgroundColor &&
										"transparent" !== backgroundColor
											? backgroundColor
											: "_default"
									);
								}
								value = value.toRgbaString();
							}
							try {
								elem.style[hook] = value;
							} catch (e) {}
						}
					}),
						(jQuery.fx.step[hook] = function(fx) {
							fx.colorInit ||
								((fx.start = color(fx.elem, hook)),
								(fx.end = color(fx.end)),
								(fx.colorInit = !0)),
								jQuery.cssHooks[hook].set(
									fx.elem,
									fx.start.transition(fx.end, fx.pos)
								);
						});
				});
			}),
			color.hook(stepHooks),
			(jQuery.cssHooks.borderColor = {
				expand: function(value) {
					var expanded = {};
					return (
						each(["Top", "Right", "Bottom", "Left"], function(
							i,
							part
						) {
							expanded["border" + part + "Color"] = value;
						}),
						expanded
					);
				}
			}),
			(colors = jQuery.Color.names = {
				aqua: "#00ffff",
				black: "#000000",
				blue: "#0000ff",
				fuchsia: "#ff00ff",
				gray: "#808080",
				green: "#008000",
				lime: "#00ff00",
				maroon: "#800000",
				navy: "#000080",
				olive: "#808000",
				purple: "#800080",
				red: "#ff0000",
				silver: "#c0c0c0",
				teal: "#008080",
				white: "#ffffff",
				yellow: "#ffff00",
				transparent: [null, null, null, 0],
				_default: "#ffffff"
			});
	})(jQuery),
	(function(L) {
		function w(ah) {
			L.jqplot.ElemContainer.call(this),
				(this.name = ah),
				(this._series = []),
				(this.show = !1),
				(this.tickRenderer = L.jqplot.AxisTickRenderer),
				(this.tickOptions = {}),
				(this.labelRenderer = L.jqplot.AxisLabelRenderer),
				(this.labelOptions = {}),
				(this.label = null),
				(this.showLabel = !0),
				(this.min = null),
				(this.max = null),
				(this.autoscale = !1),
				(this.pad = 1.2),
				(this.padMax = null),
				(this.padMin = null),
				(this.ticks = []),
				this.numberTicks,
				this.tickInterval,
				(this.renderer = L.jqplot.LinearAxisRenderer),
				(this.rendererOptions = {}),
				(this.showTicks = !0),
				(this.showTickMarks = !0),
				(this.showMinorTicks = !0),
				(this.drawMajorGridlines = !0),
				(this.drawMinorGridlines = !1),
				(this.drawMajorTickMarks = !0),
				(this.drawMinorTickMarks = !0),
				(this.useSeriesColor = !1),
				(this.borderWidth = null),
				(this.borderColor = null),
				(this.scaleToHiddenSeries = !1),
				(this._dataBounds = { min: null, max: null }),
				(this._intervalStats = []),
				(this._offsets = { min: null, max: null }),
				(this._ticks = []),
				(this._label = null),
				(this.syncTicks = null),
				(this.tickSpacing = 75),
				(this._min = null),
				(this._max = null),
				(this._tickInterval = null),
				(this._numberTicks = null),
				(this.__ticks = null),
				(this._options = {});
		}
		function q(ah) {
			L.jqplot.ElemContainer.call(this),
				(this.show = !1),
				(this.location = "ne"),
				(this.labels = []),
				(this.showLabels = !0),
				(this.showSwatches = !0),
				(this.placement = "insideGrid"),
				(this.xoffset = 0),
				(this.yoffset = 0),
				this.border,
				this.background,
				this.textColor,
				this.fontFamily,
				this.fontSize,
				(this.rowSpacing = "0.5em"),
				(this.renderer = L.jqplot.TableLegendRenderer),
				(this.rendererOptions = {}),
				(this.preDraw = !1),
				(this.marginTop = null),
				(this.marginRight = null),
				(this.marginBottom = null),
				(this.marginLeft = null),
				(this.escapeHtml = !1),
				(this._series = []),
				L.extend(!0, this, ah);
		}
		function y(ah) {
			L.jqplot.ElemContainer.call(this),
				(this.text = ah),
				(this.show = !0),
				this.fontFamily,
				this.fontSize,
				this.textAlign,
				this.textColor,
				(this.renderer = L.jqplot.DivTitleRenderer),
				(this.rendererOptions = {}),
				(this.escapeHtml = !1);
		}
		function S(ah) {
			(ah = ah || {}),
				L.jqplot.ElemContainer.call(this),
				(this.show = !0),
				(this.xaxis = "xaxis"),
				this._xaxis,
				(this.yaxis = "yaxis"),
				this._yaxis,
				(this.gridBorderWidth = 2),
				(this.renderer = L.jqplot.LineRenderer),
				(this.rendererOptions = {}),
				(this.data = []),
				(this.gridData = []),
				(this.label = ""),
				(this.showLabel = !0),
				this.color,
				this.negativeColor,
				(this.lineWidth = 2.5),
				(this.lineJoin = "round"),
				(this.lineCap = "round"),
				(this.linePattern = "solid"),
				(this.shadow = !0),
				(this.shadowAngle = 45),
				(this.shadowOffset = 1.25),
				(this.shadowDepth = 3),
				(this.shadowAlpha = "0.1"),
				(this.breakOnNull = !1),
				(this.markerRenderer = L.jqplot.MarkerRenderer),
				(this.markerOptions = {}),
				(this.showLine = !0),
				(this.showMarker = !0),
				this.index,
				(this.fill = !1),
				this.fillColor,
				this.fillAlpha,
				(this.fillAndStroke = !1),
				(this.disableStack = !1),
				(this._stack = !1),
				(this.neighborThreshold = 4),
				(this.fillToZero = !1),
				(this.fillToValue = 0),
				(this.fillAxis = "y"),
				(this.useNegativeColors = !0),
				(this._stackData = []),
				(this._plotData = []),
				(this._plotValues = { x: [], y: [] }),
				(this._intervals = { x: {}, y: {} }),
				(this._prevPlotData = []),
				(this._prevGridData = []),
				(this._stackAxis = "y"),
				(this._primaryAxis = "_xaxis"),
				(this.canvas = new L.jqplot.GenericCanvas()),
				(this.shadowCanvas = new L.jqplot.GenericCanvas()),
				(this.plugins = {}),
				(this._sumy = 0),
				(this._sumx = 0),
				(this._type = "");
		}
		function M() {
			L.jqplot.ElemContainer.call(this),
				(this.drawGridlines = !0),
				(this.gridLineColor = "#cccccc"),
				(this.gridLineWidth = 1),
				(this.background = "#fffdf6"),
				(this.borderColor = "#999999"),
				(this.borderWidth = 2),
				(this.drawBorder = !0),
				(this.shadow = !0),
				(this.shadowAngle = 45),
				(this.shadowOffset = 1.5),
				(this.shadowWidth = 3),
				(this.shadowDepth = 3),
				(this.shadowColor = null),
				(this.shadowAlpha = "0.07"),
				this._left,
				this._top,
				this._right,
				this._bottom,
				this._width,
				this._height,
				(this._axes = []),
				(this.renderer = L.jqplot.CanvasGridRenderer),
				(this.rendererOptions = {}),
				(this._offsets = {
					top: null,
					bottom: null,
					left: null,
					right: null
				});
		}
		function R() {
			function ah(ap) {
				for (var au, aq = 0; aq < ap.length; aq++)
					for (
						var am,
							ar = [
								ap[aq].data,
								ap[aq]._stackData,
								ap[aq]._plotData,
								ap[aq]._prevPlotData
							],
							an = 0;
						4 > an;
						an++
					)
						if (
							((am = !0), (au = ar[an]), "x" == ap[aq]._stackAxis)
						) {
							for (var ao = 0; ao < au.length; ao++)
								if ("number" != typeof au[ao][1]) {
									am = !1;
									break;
								}
							am &&
								au.sort(function(ay, ax) {
									return ay[1] - ax[1];
								});
						} else {
							for (var ao = 0; ao < au.length; ao++)
								if ("number" != typeof au[ao][0]) {
									am = !1;
									break;
								}
							am &&
								au.sort(function(ay, ax) {
									return ay[0] - ax[0];
								});
						}
			}
			function ai(av) {
				var am,
					ao,
					au = av.data.plot,
					ap = au.eventCanvas._elem.offset(),
					at = { x: av.pageX - ap.left, y: av.pageY - ap.top },
					aq = {
						xaxis: null,
						yaxis: null,
						x2axis: null,
						y2axis: null,
						y3axis: null,
						y4axis: null,
						y5axis: null,
						y6axis: null,
						y7axis: null,
						y8axis: null,
						y9axis: null,
						yMidAxis: null
					},
					ar = [
						"xaxis",
						"yaxis",
						"x2axis",
						"y2axis",
						"y3axis",
						"y4axis",
						"y5axis",
						"y6axis",
						"y7axis",
						"y8axis",
						"y9axis",
						"yMidAxis"
					],
					al = au.axes;
				for (am = 11; am > 0; am--)
					(ao = ar[am - 1]),
						al[ao].show &&
							(aq[ao] = al[ao].series_p2u(at[ao.charAt(0)]));
				return { offsets: ap, gridPos: at, dataPos: aq };
			}
			function ak(al, am) {
				function aR(a0, a2, a1) {
					var aZ = (a2[1] - a1[1]) / (a2[0] - a1[0]),
						aY = a2[1] - aZ * a2[0],
						a3 = a0 + a2[1];
					return [(a3 - aY) / aZ, a3];
				}
				var aW,
					aU,
					aT,
					aO,
					aP,
					aJ,
					aI,
					aw,
					au,
					az,
					aA,
					aK,
					aS,
					aX,
					aQ,
					aH,
					aV,
					an,
					aN,
					aq = am.series;
				for (aT = am.seriesStack.length - 1; aT >= 0; aT--)
					switch (((aW = am.seriesStack[aT]),
					(aO = aq[aW]),
					(aV = aO._highlightThreshold),
					aO.renderer.constructor)) {
						case L.jqplot.BarRenderer:
							for (
								aJ = al.x, aI = al.y, aU = 0;
								aU < aO._barPoints.length;
								aU++
							)
								if (
									((aH = aO._barPoints[aU]),
									(aQ = aO.gridData[aU]),
									aJ > aH[0][0] &&
										aJ < aH[2][0] &&
										aI > aH[2][1] &&
										aI < aH[0][1])
								)
									return {
										seriesIndex: aO.index,
										pointIndex: aU,
										gridData: aQ,
										data: aO.data[aU],
										points: aO._barPoints[aU]
									};
							break;
						case L.jqplot.PyramidRenderer:
							for (
								aJ = al.x, aI = al.y, aU = 0;
								aU < aO._barPoints.length;
								aU++
							)
								if (
									((aH = aO._barPoints[aU]),
									(aQ = aO.gridData[aU]),
									aJ > aH[0][0] + aV[0][0] &&
										aJ < aH[2][0] + aV[2][0] &&
										aI > aH[2][1] &&
										aI < aH[0][1])
								)
									return {
										seriesIndex: aO.index,
										pointIndex: aU,
										gridData: aQ,
										data: aO.data[aU],
										points: aO._barPoints[aU]
									};
							break;
						case L.jqplot.DonutRenderer:
							if (
								((az = aO.startAngle / 180 * Math.PI),
								(aJ = al.x - aO._center[0]),
								(aI = al.y - aO._center[1]),
								(aP = Math.sqrt(
									Math.pow(aJ, 2) + Math.pow(aI, 2)
								)),
								aJ > 0 && -aI >= 0
									? (aw = 2 * Math.PI - Math.atan(-aI / aJ))
									: aJ > 0 && 0 > -aI
										? (aw = -Math.atan(-aI / aJ))
										: 0 > aJ
											? (aw = Math.PI - Math.atan(-aI / aJ))
											: 0 == aJ && -aI > 0
												? (aw = 3 * Math.PI / 2)
												: 0 == aJ && 0 > -aI
													? (aw = Math.PI / 2)
													: 0 == aJ && 0 == aI && (aw = 0),
								az &&
									((aw -= az),
									0 > aw
										? (aw += 2 * Math.PI)
										: aw > 2 * Math.PI &&
											(aw -= 2 * Math.PI)),
								(au = aO.sliceMargin / 180 * Math.PI),
								aP < aO._radius && aP > aO._innerRadius)
							)
								for (aU = 0; aU < aO.gridData.length; aU++)
									if (
										((aA =
											aU > 0
												? aO.gridData[aU - 1][1] + au
												: au),
										(aK = aO.gridData[aU][1]),
										aw > aA && aK > aw)
									)
										return {
											seriesIndex: aO.index,
											pointIndex: aU,
											gridData: [al.x, al.y],
											data: aO.data[aU]
										};
							break;
						case L.jqplot.PieRenderer:
							if (
								((az = aO.startAngle / 180 * Math.PI),
								(aJ = al.x - aO._center[0]),
								(aI = al.y - aO._center[1]),
								(aP = Math.sqrt(
									Math.pow(aJ, 2) + Math.pow(aI, 2)
								)),
								aJ > 0 && -aI >= 0
									? (aw = 2 * Math.PI - Math.atan(-aI / aJ))
									: aJ > 0 && 0 > -aI
										? (aw = -Math.atan(-aI / aJ))
										: 0 > aJ
											? (aw = Math.PI - Math.atan(-aI / aJ))
											: 0 == aJ && -aI > 0
												? (aw = 3 * Math.PI / 2)
												: 0 == aJ && 0 > -aI
													? (aw = Math.PI / 2)
													: 0 == aJ && 0 == aI && (aw = 0),
								az &&
									((aw -= az),
									0 > aw
										? (aw += 2 * Math.PI)
										: aw > 2 * Math.PI &&
											(aw -= 2 * Math.PI)),
								(au = aO.sliceMargin / 180 * Math.PI),
								aP < aO._radius)
							)
								for (aU = 0; aU < aO.gridData.length; aU++)
									if (
										((aA =
											aU > 0
												? aO.gridData[aU - 1][1] + au
												: au),
										(aK = aO.gridData[aU][1]),
										aw > aA && aK > aw)
									)
										return {
											seriesIndex: aO.index,
											pointIndex: aU,
											gridData: [al.x, al.y],
											data: aO.data[aU]
										};
							break;
						case L.jqplot.BubbleRenderer:
							(aJ = al.x), (aI = al.y);
							var aF = null;
							if (aO.show) {
								for (var aU = 0; aU < aO.gridData.length; aU++)
									(aQ = aO.gridData[aU]),
										(aX = Math.sqrt(
											(aJ - aQ[0]) * (aJ - aQ[0]) +
												(aI - aQ[1]) * (aI - aQ[1])
										)),
										aX <= aQ[2] &&
											(aS >= aX || null == aS) &&
											((aS = aX),
											(aF = {
												seriesIndex: aW,
												pointIndex: aU,
												gridData: aQ,
												data: aO.data[aU]
											}));
								if (null != aF) return aF;
							}
							break;
						case L.jqplot.FunnelRenderer:
							(aJ = al.x), (aI = al.y);
							var at,
								aE,
								ay,
								aL = aO._vertices,
								ap = aL[0],
								ao = aL[aL.length - 1];
							for (
								at = aR(aI, ap[0], ao[3]),
									aE = aR(aI, ap[1], ao[2]),
									aU = 0;
								aU < aL.length;
								aU++
							)
								if (
									((ay = aL[aU]),
									aI >= ay[0][1] &&
										aI <= ay[3][1] &&
										aJ >= at[0] &&
										aJ <= aE[0])
								)
									return {
										seriesIndex: aO.index,
										pointIndex: aU,
										gridData: null,
										data: aO.data[aU]
									};
							break;
						case L.jqplot.LineRenderer:
							if (
								((aJ = al.x),
								(aI = al.y),
								(aP = aO.renderer),
								aO.show)
							) {
								if (
									!(
										!(
											aO.fill ||
											(aO.renderer.bands.show &&
												aO.renderer.bands.fill)
										) ||
										(am.plugins.highlighter &&
											am.plugins.highlighter.show)
									)
								) {
									var ax = !1;
									if (
										aJ > aO._boundingBox[0][0] &&
										aJ < aO._boundingBox[1][0] &&
										aI > aO._boundingBox[1][1] &&
										aI < aO._boundingBox[0][1]
									)
										for (
											var aG,
												aD = aO._areaPoints.length,
												aU = aD - 1,
												aG = 0;
											aD > aG;
											aG++
										) {
											var aC = [
													aO._areaPoints[aG][0],
													aO._areaPoints[aG][1]
												],
												aB = [
													aO._areaPoints[aU][0],
													aO._areaPoints[aU][1]
												];
											((aC[1] < aI && aB[1] >= aI) ||
												(aB[1] < aI && aC[1] >= aI)) &&
												aC[0] +
													(aI - aC[1]) /
														(aB[1] - aC[1]) *
														(aB[0] - aC[0]) <
													aJ &&
												(ax = !ax),
												(aU = aG);
										}
									if (ax)
										return {
											seriesIndex: aW,
											pointIndex: null,
											gridData: aO.gridData,
											data: aO.data,
											points: aO._areaPoints
										};
									break;
								}
								(aN =
									aO.markerRenderer.size / 2 +
									aO.neighborThreshold),
									(an = aN > 0 ? aN : 0);
								for (var aU = 0; aU < aO.gridData.length; aU++)
									if (
										((aQ = aO.gridData[aU]),
										aP.constructor == L.jqplot.OHLCRenderer)
									)
										if (aP.candleStick) {
											var av = aO._yaxis.series_u2p;
											if (
												aJ >=
													aQ[0] - aP._bodyWidth / 2 &&
												aJ <=
													aQ[0] + aP._bodyWidth / 2 &&
												aI >= av(aO.data[aU][2]) &&
												aI <= av(aO.data[aU][3])
											)
												return {
													seriesIndex: aW,
													pointIndex: aU,
													gridData: aQ,
													data: aO.data[aU]
												};
										} else if (aP.hlc) {
											var av = aO._yaxis.series_u2p;
											if (
												aJ >= aQ[0] - aP._tickLength &&
												aJ <= aQ[0] + aP._tickLength &&
												aI >= av(aO.data[aU][1]) &&
												aI <= av(aO.data[aU][2])
											)
												return {
													seriesIndex: aW,
													pointIndex: aU,
													gridData: aQ,
													data: aO.data[aU]
												};
										} else {
											var av = aO._yaxis.series_u2p;
											if (
												aJ >= aQ[0] - aP._tickLength &&
												aJ <= aQ[0] + aP._tickLength &&
												aI >= av(aO.data[aU][2]) &&
												aI <= av(aO.data[aU][3])
											)
												return {
													seriesIndex: aW,
													pointIndex: aU,
													gridData: aQ,
													data: aO.data[aU]
												};
										}
									else if (
										null != aQ[0] &&
										null != aQ[1] &&
										((aX = Math.sqrt(
											(aJ - aQ[0]) * (aJ - aQ[0]) +
												(aI - aQ[1]) * (aI - aQ[1])
										)),
										an >= aX && (aS >= aX || null == aS))
									)
										return (
											(aS = aX),
											{
												seriesIndex: aW,
												pointIndex: aU,
												gridData: aQ,
												data: aO.data[aU]
											}
										);
							}
							break;
						default:
							if (
								((aJ = al.x),
								(aI = al.y),
								(aP = aO.renderer),
								aO.show)
							) {
								(aN =
									aO.markerRenderer.size / 2 +
									aO.neighborThreshold),
									(an = aN > 0 ? aN : 0);
								for (var aU = 0; aU < aO.gridData.length; aU++)
									if (
										((aQ = aO.gridData[aU]),
										aP.constructor == L.jqplot.OHLCRenderer)
									)
										if (aP.candleStick) {
											var av = aO._yaxis.series_u2p;
											if (
												aJ >=
													aQ[0] - aP._bodyWidth / 2 &&
												aJ <=
													aQ[0] + aP._bodyWidth / 2 &&
												aI >= av(aO.data[aU][2]) &&
												aI <= av(aO.data[aU][3])
											)
												return {
													seriesIndex: aW,
													pointIndex: aU,
													gridData: aQ,
													data: aO.data[aU]
												};
										} else if (aP.hlc) {
											var av = aO._yaxis.series_u2p;
											if (
												aJ >= aQ[0] - aP._tickLength &&
												aJ <= aQ[0] + aP._tickLength &&
												aI >= av(aO.data[aU][1]) &&
												aI <= av(aO.data[aU][2])
											)
												return {
													seriesIndex: aW,
													pointIndex: aU,
													gridData: aQ,
													data: aO.data[aU]
												};
										} else {
											var av = aO._yaxis.series_u2p;
											if (
												aJ >= aQ[0] - aP._tickLength &&
												aJ <= aQ[0] + aP._tickLength &&
												aI >= av(aO.data[aU][2]) &&
												aI <= av(aO.data[aU][3])
											)
												return {
													seriesIndex: aW,
													pointIndex: aU,
													gridData: aQ,
													data: aO.data[aU]
												};
										}
									else if (
										((aX = Math.sqrt(
											(aJ - aQ[0]) * (aJ - aQ[0]) +
												(aI - aQ[1]) * (aI - aQ[1])
										)),
										an >= aX && (aS >= aX || null == aS))
									)
										return (
											(aS = aX),
											{
												seriesIndex: aW,
												pointIndex: aU,
												gridData: aQ,
												data: aO.data[aU]
											}
										);
							}
					}
				return null;
			}
			(this.animate = !1),
				(this.animateReplot = !1),
				(this.axes = {
					xaxis: new w("xaxis"),
					yaxis: new w("yaxis"),
					x2axis: new w("x2axis"),
					y2axis: new w("y2axis"),
					y3axis: new w("y3axis"),
					y4axis: new w("y4axis"),
					y5axis: new w("y5axis"),
					y6axis: new w("y6axis"),
					y7axis: new w("y7axis"),
					y8axis: new w("y8axis"),
					y9axis: new w("y9axis"),
					yMidAxis: new w("yMidAxis")
				}),
				(this.baseCanvas = new L.jqplot.GenericCanvas()),
				(this.captureRightClick = !1),
				(this.data = []),
				this.dataRenderer,
				this.dataRendererOptions,
				(this.defaults = {
					axesDefaults: {},
					axes: {
						xaxis: {},
						yaxis: {},
						x2axis: {},
						y2axis: {},
						y3axis: {},
						y4axis: {},
						y5axis: {},
						y6axis: {},
						y7axis: {},
						y8axis: {},
						y9axis: {},
						yMidAxis: {}
					},
					seriesDefaults: {},
					series: []
				}),
				(this.defaultAxisStart = 1),
				(this.drawIfHidden = !1),
				(this.eventCanvas = new L.jqplot.GenericCanvas()),
				(this.fillBetween = {
					series1: null,
					series2: null,
					color: null,
					baseSeries: 0,
					fill: !0
				}),
				this.fontFamily,
				this.fontSize,
				(this.grid = new M()),
				(this.legend = new q()),
				(this.noDataIndicator = {
					show: !1,
					indicator: "Loading Data...",
					axes: {
						xaxis: { min: 0, max: 10, tickInterval: 2, show: !0 },
						yaxis: { min: 0, max: 12, tickInterval: 3, show: !0 }
					}
				}),
				(this.negativeSeriesColors =
					L.jqplot.config.defaultNegativeColors),
				(this.options = {}),
				(this.previousSeriesStack = []),
				(this.plugins = {}),
				(this.series = []),
				(this.seriesStack = []),
				(this.seriesColors = L.jqplot.config.defaultColors),
				(this.sortData = !0),
				(this.stackSeries = !1),
				(this.syncXTicks = !0),
				(this.syncYTicks = !0),
				(this.target = null),
				(this.targetId = null),
				this.textColor,
				(this.title = new y()),
				(this._drawCount = 0),
				(this._sumy = 0),
				(this._sumx = 0),
				(this._stackData = []),
				(this._plotData = []),
				(this._width = null),
				(this._height = null),
				(this._plotDimensions = { height: null, width: null }),
				(this._gridPadding = {
					top: null,
					right: null,
					bottom: null,
					left: null
				}),
				(this._defaultGridPadding = {
					top: 10,
					right: 10,
					bottom: 23,
					left: 10
				}),
				(this._addDomReference = L.jqplot.config.addDomReference),
				(this.preInitHooks = new L.jqplot.HooksManager()),
				(this.postInitHooks = new L.jqplot.HooksManager()),
				(this.preParseOptionsHooks = new L.jqplot.HooksManager()),
				(this.postParseOptionsHooks = new L.jqplot.HooksManager()),
				(this.preDrawHooks = new L.jqplot.HooksManager()),
				(this.postDrawHooks = new L.jqplot.HooksManager()),
				(this.preDrawSeriesHooks = new L.jqplot.HooksManager()),
				(this.postDrawSeriesHooks = new L.jqplot.HooksManager()),
				(this.preDrawLegendHooks = new L.jqplot.HooksManager()),
				(this.addLegendRowHooks = new L.jqplot.HooksManager()),
				(this.preSeriesInitHooks = new L.jqplot.HooksManager()),
				(this.postSeriesInitHooks = new L.jqplot.HooksManager()),
				(this.preParseSeriesOptionsHooks = new L.jqplot.HooksManager()),
				(this.postParseSeriesOptionsHooks = new L.jqplot.HooksManager()),
				(this.eventListenerHooks = new L.jqplot.EventListenerManager()),
				(this.preDrawSeriesShadowHooks = new L.jqplot.HooksManager()),
				(this.postDrawSeriesShadowHooks = new L.jqplot.HooksManager()),
				(this.colorGenerator = new L.jqplot.ColorGenerator()),
				(this.negativeColorGenerator = new L.jqplot.ColorGenerator()),
				(this.canvasManager = new L.jqplot.CanvasManager()),
				(this.themeEngine = new L.jqplot.ThemeEngine());
			(this.init = function(av, ar, ay) {
				ay = ay || {};
				for (var at = 0; at < L.jqplot.preInitHooks.length; at++)
					L.jqplot.preInitHooks[at].call(this, av, ar, ay);
				for (var at = 0; at < this.preInitHooks.hooks.length; at++)
					this.preInitHooks.hooks[at].call(this, av, ar, ay);
				if (
					((this.targetId = "#" + av),
					(this.target = L("#" + av)),
					this._addDomReference && this.target.data("jqplot", this),
					this.target.removeClass("jqplot-error"),
					!this.target.get(0))
				)
					throw new Error("No plot target specified");
				if (
					("static" == this.target.css("position") &&
						this.target.css("position", "relative"),
					this.target.hasClass("jqplot-target") ||
						this.target.addClass("jqplot-target"),
					this.target.height())
				)
					this._height = au = this.target.height();
				else {
					var au;
					(au =
						ay && ay.height
							? parseInt(ay.height, 10)
							: this.target.attr("data-height")
								? parseInt(this.target.attr("data-height"), 10)
								: parseInt(L.jqplot.config.defaultHeight, 10)),
						(this._height = au),
						this.target.css("height", au + "px");
				}
				if (this.target.width()) this._width = aw = this.target.width();
				else {
					var aw;
					(aw =
						ay && ay.width
							? parseInt(ay.width, 10)
							: this.target.attr("data-width")
								? parseInt(this.target.attr("data-width"), 10)
								: parseInt(L.jqplot.config.defaultWidth, 10)),
						(this._width = aw),
						this.target.css("width", aw + "px");
				}
				for (var at = 0, ap = U.length; ap > at; at++)
					this.axes[U[at]] = new w(U[at]);
				if (
					((this._plotDimensions.height = this._height),
					(this._plotDimensions.width = this._width),
					(this.grid._plotDimensions = this._plotDimensions),
					(this.title._plotDimensions = this._plotDimensions),
					(this.baseCanvas._plotDimensions = this._plotDimensions),
					(this.eventCanvas._plotDimensions = this._plotDimensions),
					(this.legend._plotDimensions = this._plotDimensions),
					this._height <= 0 ||
						this._width <= 0 ||
						!this._height ||
						!this._width)
				)
					throw new Error("Canvas dimension not set");
				if (
					(ay.dataRenderer &&
						L.isFunction(ay.dataRenderer) &&
						(ay.dataRendererOptions &&
							(this.dataRendererOptions = ay.dataRendererOptions),
						(this.dataRenderer = ay.dataRenderer),
						(ar = this.dataRenderer(
							ar,
							this,
							this.dataRendererOptions
						))),
					ay.noDataIndicator &&
						L.isPlainObject(ay.noDataIndicator) &&
						L.extend(!0, this.noDataIndicator, ay.noDataIndicator),
					null == ar ||
						0 == L.isArray(ar) ||
						0 == ar.length ||
						0 == L.isArray(ar[0]) ||
						0 == ar[0].length)
				) {
					if (0 == this.noDataIndicator.show)
						throw new Error("No data specified");
					for (var al in this.noDataIndicator.axes)
						for (var an in this.noDataIndicator.axes[al])
							this.axes[al][an] = this.noDataIndicator.axes[al][
								an
							];
					this.postDrawHooks.add(function() {
						var aD = this.eventCanvas.getHeight(),
							aA = this.eventCanvas.getWidth(),
							az = L(
								'<div class="jqplot-noData-container" style="position:absolute;"></div>'
							);
						this.target.append(az),
							az.height(aD),
							az.width(aA),
							az.css("top", this.eventCanvas._offsets.top),
							az.css("left", this.eventCanvas._offsets.left);
						var aC = L(
							'<div class="jqplot-noData-contents" style="text-align:center; position:relative; margin-left:auto; margin-right:auto;"></div>'
						);
						az.append(aC), aC.html(this.noDataIndicator.indicator);
						var aB = aC.height(),
							ax = aC.width();
						aC.height(aB),
							aC.width(ax),
							aC.css("top", (aD - aB) / 2 + "px");
					});
				}
				(this.data = L.extend(!0, [], ar)),
					this.parseOptions(ay),
					this.textColor && this.target.css("color", this.textColor),
					this.fontFamily &&
						this.target.css("font-family", this.fontFamily),
					this.fontSize &&
						this.target.css("font-size", this.fontSize),
					this.title.init(),
					this.legend.init(),
					(this._sumy = 0),
					(this._sumx = 0),
					this.computePlotData();
				for (var at = 0; at < this.series.length; at++) {
					this.seriesStack.push(at),
						this.previousSeriesStack.push(at),
						(this.series[
							at
						].shadowCanvas._plotDimensions = this._plotDimensions),
						(this.series[
							at
						].canvas._plotDimensions = this._plotDimensions);
					for (
						var aq = 0;
						aq < L.jqplot.preSeriesInitHooks.length;
						aq++
					)
						L.jqplot.preSeriesInitHooks[aq].call(
							this.series[at],
							av,
							this.data,
							this.options.seriesDefaults,
							this.options.series[at],
							this
						);
					for (
						var aq = 0;
						aq < this.preSeriesInitHooks.hooks.length;
						aq++
					)
						this.preSeriesInitHooks.hooks[aq].call(
							this.series[at],
							av,
							this.data,
							this.options.seriesDefaults,
							this.options.series[at],
							this
						);
					(this.series[at]._plotDimensions = this._plotDimensions),
						this.series[at].init(at, this.grid.borderWidth, this);
					for (
						var aq = 0;
						aq < L.jqplot.postSeriesInitHooks.length;
						aq++
					)
						L.jqplot.postSeriesInitHooks[aq].call(
							this.series[at],
							av,
							this.data,
							this.options.seriesDefaults,
							this.options.series[at],
							this
						);
					for (
						var aq = 0;
						aq < this.postSeriesInitHooks.hooks.length;
						aq++
					)
						this.postSeriesInitHooks.hooks[aq].call(
							this.series[at],
							av,
							this.data,
							this.options.seriesDefaults,
							this.options.series[at],
							this
						);
					(this._sumy += this.series[at]._sumy),
						(this._sumx += this.series[at]._sumx);
				}
				for (var am, ao, at = 0, ap = U.length; ap > at; at++)
					(am = U[at]),
						(ao = this.axes[am]),
						(ao._plotDimensions = this._plotDimensions),
						ao.init(),
						null == this.axes[am].borderColor &&
							(ao.borderColor =
								"x" !== am.charAt(0) &&
								ao.useSeriesColor === !0 &&
								ao.show
									? ao._series[0].color
									: this.grid.borderColor);
				this.sortData && ah(this.series),
					this.grid.init(),
					(this.grid._axes = this.axes),
					(this.legend._series = this.series);
				for (var at = 0; at < L.jqplot.postInitHooks.length; at++)
					L.jqplot.postInitHooks[at].call(this, av, this.data, ay);
				for (var at = 0; at < this.postInitHooks.hooks.length; at++)
					this.postInitHooks.hooks[at].call(this, av, this.data, ay);
			}),
				(this.resetAxesScale = function(aq, am) {
					var ao = am || {},
						ap = aq || this.axes;
					if ((ap === !0 && (ap = this.axes), L.isArray(ap)))
						for (var an = 0; an < ap.length; an++)
							this.axes[ap[an]].resetScale(ao[ap[an]]);
					else if ("object" == typeof ap)
						for (var al in ap) this.axes[al].resetScale(ao[al]);
				}),
				(this.reInitialize = function(au, al) {
					for (
						var ay = L.extend(!0, {}, this.options, al),
							aw = this.targetId.substr(1),
							ar = null == au ? this.data : au,
							av = 0;
						av < L.jqplot.preInitHooks.length;
						av++
					)
						L.jqplot.preInitHooks[av].call(this, aw, ar, ay);
					for (var av = 0; av < this.preInitHooks.hooks.length; av++)
						this.preInitHooks.hooks[av].call(this, aw, ar, ay);
					if (
						((this._height = this.target.height()),
						(this._width = this.target.width()),
						this._height <= 0 ||
							this._width <= 0 ||
							!this._height ||
							!this._width)
					)
						throw new Error("Target dimension not set");
					(this._plotDimensions.height = this._height),
						(this._plotDimensions.width = this._width),
						(this.grid._plotDimensions = this._plotDimensions),
						(this.title._plotDimensions = this._plotDimensions),
						(this.baseCanvas._plotDimensions = this._plotDimensions),
						(this.eventCanvas._plotDimensions = this._plotDimensions),
						(this.legend._plotDimensions = this._plotDimensions);
					for (
						var am, ax, at, ao, av = 0, aq = U.length;
						aq > av;
						av++
					) {
						(am = U[av]), (ao = this.axes[am]), (ax = ao._ticks);
						for (var at = 0, ap = ax.length; ap > at; at++) {
							var an = ax[at]._elem;
							an &&
								(L.jqplot.use_excanvas &&
									window.G_vmlCanvasManager.uninitElement !==
										u &&
									window.G_vmlCanvasManager.uninitElement(
										an.get(0)
									),
								an.emptyForce(),
								(an = null),
								(ax._elem = null));
						}
						(ax = null),
							delete ao.ticks,
							delete ao._ticks,
							(this.axes[am] = new w(am)),
							(this.axes[am]._plotWidth = this._width),
							(this.axes[am]._plotHeight = this._height);
					}
					au &&
						(ay.dataRenderer &&
							L.isFunction(ay.dataRenderer) &&
							(ay.dataRendererOptions &&
								(this.dataRendererOptions =
									ay.dataRendererOptions),
							(this.dataRenderer = ay.dataRenderer),
							(au = this.dataRenderer(
								au,
								this,
								this.dataRendererOptions
							))),
						(this.data = L.extend(!0, [], au))),
						al && this.parseOptions(ay),
						(this.title._plotWidth = this._width),
						this.textColor &&
							this.target.css("color", this.textColor),
						this.fontFamily &&
							this.target.css("font-family", this.fontFamily),
						this.fontSize &&
							this.target.css("font-size", this.fontSize),
						this.title.init(),
						this.legend.init(),
						(this._sumy = 0),
						(this._sumx = 0),
						(this.seriesStack = []),
						(this.previousSeriesStack = []),
						this.computePlotData();
					for (var av = 0, aq = this.series.length; aq > av; av++) {
						this.seriesStack.push(av),
							this.previousSeriesStack.push(av),
							(this.series[
								av
							].shadowCanvas._plotDimensions = this._plotDimensions),
							(this.series[
								av
							].canvas._plotDimensions = this._plotDimensions);
						for (
							var at = 0;
							at < L.jqplot.preSeriesInitHooks.length;
							at++
						)
							L.jqplot.preSeriesInitHooks[at].call(
								this.series[av],
								aw,
								this.data,
								this.options.seriesDefaults,
								this.options.series[av],
								this
							);
						for (
							var at = 0;
							at < this.preSeriesInitHooks.hooks.length;
							at++
						)
							this.preSeriesInitHooks.hooks[at].call(
								this.series[av],
								aw,
								this.data,
								this.options.seriesDefaults,
								this.options.series[av],
								this
							);
						(this.series[
							av
						]._plotDimensions = this._plotDimensions),
							this.series[av].init(
								av,
								this.grid.borderWidth,
								this
							);
						for (
							var at = 0;
							at < L.jqplot.postSeriesInitHooks.length;
							at++
						)
							L.jqplot.postSeriesInitHooks[at].call(
								this.series[av],
								aw,
								this.data,
								this.options.seriesDefaults,
								this.options.series[av],
								this
							);
						for (
							var at = 0;
							at < this.postSeriesInitHooks.hooks.length;
							at++
						)
							this.postSeriesInitHooks.hooks[at].call(
								this.series[av],
								aw,
								this.data,
								this.options.seriesDefaults,
								this.options.series[av],
								this
							);
						(this._sumy += this.series[av]._sumy),
							(this._sumx += this.series[av]._sumx);
					}
					for (var av = 0, aq = U.length; aq > av; av++)
						(am = U[av]),
							(ao = this.axes[am]),
							(ao._plotDimensions = this._plotDimensions),
							ao.init(),
							null == ao.borderColor &&
								(ao.borderColor =
									"x" !== am.charAt(0) &&
									ao.useSeriesColor === !0 &&
									ao.show
										? ao._series[0].color
										: this.grid.borderColor);
					this.sortData && ah(this.series),
						this.grid.init(),
						(this.grid._axes = this.axes),
						(this.legend._series = this.series);
					for (
						var av = 0, aq = L.jqplot.postInitHooks.length;
						aq > av;
						av++
					)
						L.jqplot.postInitHooks[av].call(
							this,
							aw,
							this.data,
							ay
						);
					for (
						var av = 0, aq = this.postInitHooks.hooks.length;
						aq > av;
						av++
					)
						this.postInitHooks.hooks[av].call(
							this,
							aw,
							this.data,
							ay
						);
				}),
				(this.quickInit = function() {
					if (
						((this._height = this.target.height()),
						(this._width = this.target.width()),
						this._height <= 0 ||
							this._width <= 0 ||
							!this._height ||
							!this._width)
					)
						throw new Error("Target dimension not set");
					(this._plotDimensions.height = this._height),
						(this._plotDimensions.width = this._width),
						(this.grid._plotDimensions = this._plotDimensions),
						(this.title._plotDimensions = this._plotDimensions),
						(this.baseCanvas._plotDimensions = this._plotDimensions),
						(this.eventCanvas._plotDimensions = this._plotDimensions),
						(this.legend._plotDimensions = this._plotDimensions);
					for (var aq in this.axes)
						(this.axes[aq]._plotWidth = this._width),
							(this.axes[aq]._plotHeight = this._height);
					(this.title._plotWidth = this._width),
						this.textColor &&
							this.target.css("color", this.textColor),
						this.fontFamily &&
							this.target.css("font-family", this.fontFamily),
						this.fontSize &&
							this.target.css("font-size", this.fontSize),
						(this._sumy = 0),
						(this._sumx = 0),
						this.computePlotData();
					for (var ao = 0; ao < this.series.length; ao++)
						"line" === this.series[ao]._type &&
							this.series[ao].renderer.bands.show &&
							this.series[ao].renderer.initBands.call(
								this.series[ao],
								this.series[ao].renderer.options,
								this
							),
							(this.series[
								ao
							]._plotDimensions = this._plotDimensions),
							(this.series[
								ao
							].canvas._plotDimensions = this._plotDimensions),
							(this._sumy += this.series[ao]._sumy),
							(this._sumx += this.series[ao]._sumx);
					for (var am, al = 0; 12 > al; al++) {
						am = U[al];
						for (
							var an = this.axes[am]._ticks, ao = 0;
							ao < an.length;
							ao++
						) {
							var ap = an[ao]._elem;
							ap &&
								(L.jqplot.use_excanvas &&
									window.G_vmlCanvasManager.uninitElement !==
										u &&
									window.G_vmlCanvasManager.uninitElement(
										ap.get(0)
									),
								ap.emptyForce(),
								(ap = null),
								(an._elem = null));
						}
						(an = null),
							(this.axes[
								am
							]._plotDimensions = this._plotDimensions),
							(this.axes[am]._ticks = []);
					}
					this.sortData && ah(this.series),
						(this.grid._axes = this.axes),
						(this.legend._series = this.series);
				}),
				(this.computePlotData = function() {
					(this._plotData = []), (this._stackData = []);
					var at, au, ao;
					for (au = 0, ao = this.series.length; ao > au; au++) {
						(at = this.series[au]),
							this._plotData.push([]),
							this._stackData.push([]);
						var am = at.data;
						(this._plotData[au] = L.extend(!0, [], am)),
							(this._stackData[au] = L.extend(!0, [], am)),
							(at._plotData = this._plotData[au]),
							(at._stackData = this._stackData[au]);
						var ax = { x: [], y: [] };
						if (this.stackSeries && !at.disableStack) {
							at._stack = !0;
							for (
								var av = "x" === at._stackAxis ? 0 : 1,
									ap = 0,
									al = am.length;
								al > ap;
								ap++
							) {
								var aw = am[ap][av];
								if (
									(null == aw && (aw = 0),
									(this._plotData[au][ap][av] = aw),
									(this._stackData[au][ap][av] = aw),
									au > 0)
								)
									for (var aq = au; aq--; ) {
										var an = this._plotData[aq][ap][av];
										if (aw * an >= 0) {
											(this._plotData[au][ap][av] += an),
												(this._stackData[au][ap][
													av
												] += an);
											break;
										}
									}
							}
						} else {
							for (var ar = 0; ar < at.data.length; ar++)
								ax.x.push(at.data[ar][0]),
									ax.y.push(at.data[ar][1]);
							this._stackData.push(at.data),
								(this.series[au]._stackData = at.data),
								this._plotData.push(at.data),
								(at._plotData = at.data),
								(at._plotValues = ax);
						}
						for (
							au > 0 &&
								(at._prevPlotData = this.series[
									au - 1
								]._plotData),
								at._sumy = 0,
								at._sumx = 0,
								ar = at.data.length - 1;
							ar > -1;
							ar--
						)
							(at._sumy += at.data[ar][1]),
								(at._sumx += at.data[ar][0]);
					}
				}),
				(this.populatePlotData = function(au, av) {
					(this._plotData = []),
						(this._stackData = []),
						(au._stackData = []),
						(au._plotData = []);
					var ay = { x: [], y: [] };
					if (this.stackSeries && !au.disableStack) {
						au._stack = !0;
						for (
							var an,
								am,
								ao,
								aw,
								ax = "x" === au._stackAxis ? 0 : 1,
								az = L.extend(!0, [], au.data),
								aA = L.extend(!0, [], au.data),
								ar = 0;
							av > ar;
							ar++
						)
							for (
								var ap = this.series[ar].data, aq = 0;
								aq < ap.length;
								aq++
							)
								(ao = ap[aq]),
									(an = null != ao[0] ? ao[0] : 0),
									(am = null != ao[1] ? ao[1] : 0),
									(az[aq][0] += an),
									(az[aq][1] += am),
									(aw = ax ? am : an),
									au.data[aq][ax] * aw >= 0 &&
										(aA[aq][ax] += aw);
						for (var at = 0; at < aA.length; at++)
							ay.x.push(aA[at][0]), ay.y.push(aA[at][1]);
						this._plotData.push(aA),
							this._stackData.push(az),
							(au._stackData = az),
							(au._plotData = aA),
							(au._plotValues = ay);
					} else {
						for (var at = 0; at < au.data.length; at++)
							ay.x.push(au.data[at][0]),
								ay.y.push(au.data[at][1]);
						this._stackData.push(au.data),
							(this.series[av]._stackData = au.data),
							this._plotData.push(au.data),
							(au._plotData = au.data),
							(au._plotValues = ay);
					}
					for (
						av > 0 &&
							(au._prevPlotData = this.series[av - 1]._plotData),
							au._sumy = 0,
							au._sumx = 0,
							at = au.data.length - 1;
						at > -1;
						at--
					)
						(au._sumy += au.data[at][1]),
							(au._sumx += au.data[at][0]);
				}),
				(this.getNextSeriesColor = (function(am) {
					var al = 0,
						an = am.seriesColors;
					return function() {
						return al < an.length ? an[al++] : ((al = 0), an[al++]);
					};
				})(this)),
				(this.parseOptions = function(ay) {
					for (
						var at = 0;
						at < this.preParseOptionsHooks.hooks.length;
						at++
					)
						this.preParseOptionsHooks.hooks[at].call(this, ay);
					for (
						var at = 0;
						at < L.jqplot.preParseOptionsHooks.length;
						at++
					)
						L.jqplot.preParseOptionsHooks[at].call(this, ay);
					this.options = L.extend(!0, {}, this.defaults, ay);
					var am = this.options;
					if (
						((this.animate = am.animate),
						(this.animateReplot = am.animateReplot),
						(this.stackSeries = am.stackSeries),
						L.isPlainObject(am.fillBetween))
					)
						for (
							var au,
								ax = [
									"series1",
									"series2",
									"color",
									"baseSeries",
									"fill"
								],
								at = 0,
								aq = ax.length;
							aq > at;
							at++
						)
							(au = ax[at]),
								null != am.fillBetween[au] &&
									(this.fillBetween[au] = am.fillBetween[au]);
					am.seriesColors && (this.seriesColors = am.seriesColors),
						am.negativeSeriesColors &&
							(this.negativeSeriesColors =
								am.negativeSeriesColors),
						am.captureRightClick &&
							(this.captureRightClick = am.captureRightClick),
						(this.defaultAxisStart =
							ay && null != ay.defaultAxisStart
								? ay.defaultAxisStart
								: this.defaultAxisStart),
						this.colorGenerator.setColors(this.seriesColors),
						this.negativeColorGenerator.setColors(
							this.negativeSeriesColors
						),
						L.extend(!0, this._gridPadding, am.gridPadding),
						(this.sortData =
							null != am.sortData ? am.sortData : this.sortData);
					for (var at = 0; 12 > at; at++) {
						var an = U[at],
							ap = this.axes[an];
						(ap._options = L.extend(
							!0,
							{},
							am.axesDefaults,
							am.axes[an]
						)),
							L.extend(!0, ap, am.axesDefaults, am.axes[an]),
							(ap._plotWidth = this._width),
							(ap._plotHeight = this._height);
					}
					var aw = function(aD, aB, aE) {
						var aC,
							az,
							aA = [];
						if (((aB = aB || "vertical"), L.isArray(aD[0])))
							L.extend(!0, aA, aD);
						else
							for (aC = 0, az = aD.length; az > aC; aC++)
								aA.push(
									"vertical" == aB
										? [aE + aC, aD[aC]]
										: [aD[aC], aE + aC]
								);
						return aA;
					};
					this.series = [];
					for (var at = 0; at < this.data.length; at++) {
						for (
							var al = L.extend(
									!0,
									{ index: at },
									{
										seriesColors: this.seriesColors,
										negativeSeriesColors: this
											.negativeSeriesColors
									},
									this.options.seriesDefaults,
									this.options.series[at],
									{
										rendererOptions: {
											animation: { show: this.animate }
										}
									}
								),
								ax = new S(al),
								ar = 0;
							ar < L.jqplot.preParseSeriesOptionsHooks.length;
							ar++
						)
							L.jqplot.preParseSeriesOptionsHooks[ar].call(
								ax,
								this.options.seriesDefaults,
								this.options.series[at]
							);
						for (
							var ar = 0;
							ar < this.preParseSeriesOptionsHooks.hooks.length;
							ar++
						)
							this.preParseSeriesOptionsHooks.hooks[ar].call(
								ax,
								this.options.seriesDefaults,
								this.options.series[at]
							);
						L.extend(!0, ax, al);
						var ao = "vertical";
						switch ((ax.renderer === L.jqplot.BarRenderer &&
							ax.rendererOptions &&
							"horizontal" == ax.rendererOptions.barDirection &&
							((ao = "horizontal"),
							(ax._stackAxis = "x"),
							(ax._primaryAxis = "_yaxis")),
						(ax.data = aw(
							this.data[at],
							ao,
							this.defaultAxisStart
						)),
						ax.xaxis)) {
							case "xaxis":
								ax._xaxis = this.axes.xaxis;
								break;
							case "x2axis":
								ax._xaxis = this.axes.x2axis;
						}
						(ax._yaxis = this.axes[ax.yaxis]),
							ax._xaxis._series.push(ax),
							ax._yaxis._series.push(ax),
							ax.show
								? ((ax._xaxis.show = !0), (ax._yaxis.show = !0))
								: (ax._xaxis.scaleToHiddenSeries &&
										(ax._xaxis.show = !0),
									ax._yaxis.scaleToHiddenSeries &&
										(ax._yaxis.show = !0)),
							ax.label ||
								(ax.label = "Series " + (at + 1).toString()),
							this.series.push(ax);
						for (
							var ar = 0;
							ar < L.jqplot.postParseSeriesOptionsHooks.length;
							ar++
						)
							L.jqplot.postParseSeriesOptionsHooks[ar].call(
								this.series[at],
								this.options.seriesDefaults,
								this.options.series[at]
							);
						for (
							var ar = 0;
							ar < this.postParseSeriesOptionsHooks.hooks.length;
							ar++
						)
							this.postParseSeriesOptionsHooks.hooks[ar].call(
								this.series[at],
								this.options.seriesDefaults,
								this.options.series[at]
							);
					}
					L.extend(!0, this.grid, this.options.grid);
					for (var at = 0, aq = U.length; aq > at; at++) {
						var an = U[at],
							ap = this.axes[an];
						null == ap.borderWidth &&
							(ap.borderWidth = this.grid.borderWidth);
					}
					"string" == typeof this.options.title
						? (this.title.text = this.options.title)
						: "object" == typeof this.options.title &&
							L.extend(!0, this.title, this.options.title),
						(this.title._plotWidth = this._width),
						this.legend.setOptions(this.options.legend);
					for (
						var at = 0;
						at < L.jqplot.postParseOptionsHooks.length;
						at++
					)
						L.jqplot.postParseOptionsHooks[at].call(this, ay);
					for (
						var at = 0;
						at < this.postParseOptionsHooks.hooks.length;
						at++
					)
						this.postParseOptionsHooks.hooks[at].call(this, ay);
				}),
				(this.destroy = function() {
					this.canvasManager.freeAllCanvases(),
						this.eventCanvas &&
							this.eventCanvas._elem &&
							this.eventCanvas._elem.unbind(),
						this.target.empty(),
						(this.target[0].innerHTML = "");
				}),
				(this.replot = function(am) {
					var an = am || {},
						ap = an.data || null,
						al = an.clear === !1 ? !1 : !0,
						ao = an.resetAxes || !1;
					delete an.data,
						delete an.clear,
						delete an.resetAxes,
						this.target.trigger("jqplotPreReplot"),
						al && this.destroy(),
						ap || !L.isEmptyObject(an)
							? this.reInitialize(ap, an)
							: this.quickInit(),
						ao && this.resetAxesScale(ao, an.axes),
						this.draw(),
						this.target.trigger("jqplotPostReplot");
				}),
				(this.redraw = function(al) {
					(al = null != al ? al : !0),
						this.target.trigger("jqplotPreRedraw"),
						al &&
							(this.canvasManager.freeAllCanvases(),
							this.eventCanvas._elem.unbind(),
							this.target.empty());
					for (var an in this.axes) this.axes[an]._ticks = [];
					this.computePlotData(), (this._sumy = 0), (this._sumx = 0);
					for (var am = 0, ao = this.series.length; ao > am; am++)
						(this._sumy += this.series[am]._sumy),
							(this._sumx += this.series[am]._sumx);
					this.draw(), this.target.trigger("jqplotPostRedraw");
				}),
				(this.draw = function() {
					if (this.drawIfHidden || this.target.is(":visible")) {
						this.target.trigger("jqplotPreDraw");
						var aH, aF, aE;
						for (
							aH = 0, aE = L.jqplot.preDrawHooks.length;
							aE > aH;
							aH++
						)
							L.jqplot.preDrawHooks[aH].call(this);
						for (
							aH = 0, aE = this.preDrawHooks.hooks.length;
							aE > aH;
							aH++
						)
							this.preDrawHooks.hooks[aH].apply(
								this,
								this.preDrawSeriesHooks.args[aH]
							);
						this.target.append(
							this.baseCanvas.createElement(
								{ left: 0, right: 0, top: 0, bottom: 0 },
								"jqplot-base-canvas",
								null,
								this
							)
						),
							this.baseCanvas.setContext(),
							this.target.append(this.title.draw()),
							this.title.pack({ top: 0, left: 0 });
						var aL = this.legend.draw({}, this),
							al = { top: 0, left: 0, bottom: 0, right: 0 };
						if ("outsideGrid" == this.legend.placement) {
							switch ((this.target.append(aL),
							this.legend.location)) {
								case "n":
									al.top += this.legend.getHeight();
									break;
								case "s":
									al.bottom += this.legend.getHeight();
									break;
								case "ne":
								case "e":
								case "se":
									al.right += this.legend.getWidth();
									break;
								case "nw":
								case "w":
								case "sw":
									al.left += this.legend.getWidth();
									break;
								default:
									al.right += this.legend.getWidth();
							}
							aL = aL.detach();
						}
						var aM,
							ar = this.axes;
						for (aH = 0; 12 > aH; aH++)
							(aM = U[aH]),
								this.target.append(
									ar[aM].draw(this.baseCanvas._ctx, this)
								),
								ar[aM].set();
						ar.yaxis.show && (al.left += ar.yaxis.getWidth());
						var aB,
							aG = [
								"y2axis",
								"y3axis",
								"y4axis",
								"y5axis",
								"y6axis",
								"y7axis",
								"y8axis",
								"y9axis"
							],
							az = [0, 0, 0, 0, 0, 0, 0, 0],
							aC = 0;
						for (aB = 0; 8 > aB; aB++)
							ar[aG[aB]].show &&
								((aC += ar[aG[aB]].getWidth()), (az[aB] = aC));
						if (
							((al.right += aC),
							ar.x2axis.show && (al.top += ar.x2axis.getHeight()),
							this.title.show &&
								(al.top += this.title.getHeight()),
							ar.xaxis.show &&
								(al.bottom += ar.xaxis.getHeight()),
							this.options.gridDimensions &&
								L.isPlainObject(this.options.gridDimensions))
						) {
							var at =
									parseInt(
										this.options.gridDimensions.width,
										10
									) || 0,
								aI =
									parseInt(
										this.options.gridDimensions.height,
										10
									) || 0,
								an =
									(this._width - al.left - al.right - at) / 2,
								aK =
									(this._height - al.top - al.bottom - aI) /
									2;
							aK >= 0 &&
								an >= 0 &&
								((al.top += aK),
								(al.bottom += aK),
								(al.left += an),
								(al.right += an));
						}
						var am = ["top", "bottom", "left", "right"];
						for (var aB in am)
							null == this._gridPadding[am[aB]] && al[am[aB]] > 0
								? (this._gridPadding[am[aB]] = al[am[aB]])
								: null == this._gridPadding[am[aB]] &&
									(this._gridPadding[
										am[aB]
									] = this._defaultGridPadding[am[aB]]);
						var aA = this._gridPadding;
						for (
							"outsideGrid" === this.legend.placement &&
								((aA = {
									top: this.title.getHeight(),
									left: 0,
									right: 0,
									bottom: 0
								}),
								"s" === this.legend.location &&
									((aA.left = this._gridPadding.left),
									(aA.right = this._gridPadding.right))),
								ar.xaxis.pack(
									{
										position: "absolute",
										bottom:
											this._gridPadding.bottom -
											ar.xaxis.getHeight(),
										left: 0,
										width: this._width
									},
									{
										min: this._gridPadding.left,
										max:
											this._width -
											this._gridPadding.right
									}
								),
								ar.yaxis.pack(
									{
										position: "absolute",
										top: 0,
										left:
											this._gridPadding.left -
											ar.yaxis.getWidth(),
										height: this._height
									},
									{
										min:
											this._height -
											this._gridPadding.bottom,
										max: this._gridPadding.top
									}
								),
								ar.x2axis.pack(
									{
										position: "absolute",
										top:
											this._gridPadding.top -
											ar.x2axis.getHeight(),
										left: 0,
										width: this._width
									},
									{
										min: this._gridPadding.left,
										max:
											this._width -
											this._gridPadding.right
									}
								),
								aH = 8;
							aH > 0;
							aH--
						)
							ar[aG[aH - 1]].pack(
								{
									position: "absolute",
									top: 0,
									right: this._gridPadding.right - az[aH - 1]
								},
								{
									min:
										this._height - this._gridPadding.bottom,
									max: this._gridPadding.top
								}
							);
						var au =
							(this._width -
								this._gridPadding.left -
								this._gridPadding.right) /
								2 +
							this._gridPadding.left -
							ar.yMidAxis.getWidth() / 2;
						ar.yMidAxis.pack(
							{
								position: "absolute",
								top: 0,
								left: au,
								zIndex: 9,
								textAlign: "center"
							},
							{
								min: this._height - this._gridPadding.bottom,
								max: this._gridPadding.top
							}
						),
							this.target.append(
								this.grid.createElement(this._gridPadding, this)
							),
							this.grid.draw();
						var aq = this.series,
							aJ = aq.length;
						for (aH = 0, aE = aJ; aE > aH; aH++)
							(aF = this.seriesStack[aH]),
								this.target.append(
									aq[aF].shadowCanvas.createElement(
										this._gridPadding,
										"jqplot-series-shadowCanvas",
										null,
										this
									)
								),
								aq[aF].shadowCanvas.setContext(),
								aq[aF].shadowCanvas._elem.data(
									"seriesIndex",
									aF
								);
						for (aH = 0, aE = aJ; aE > aH; aH++)
							(aF = this.seriesStack[aH]),
								this.target.append(
									aq[aF].canvas.createElement(
										this._gridPadding,
										"jqplot-series-canvas",
										null,
										this
									)
								),
								aq[aF].canvas.setContext(),
								aq[aF].canvas._elem.data("seriesIndex", aF);
						this.target.append(
							this.eventCanvas.createElement(
								this._gridPadding,
								"jqplot-event-canvas",
								null,
								this
							)
						),
							this.eventCanvas.setContext(),
							(this.eventCanvas._ctx.fillStyle = "rgba(0,0,0,0)"),
							this.eventCanvas._ctx.fillRect(
								0,
								0,
								this.eventCanvas._ctx.canvas.width,
								this.eventCanvas._ctx.canvas.height
							),
							this.bindCustomEvents(),
							this.legend.preDraw
								? (this.eventCanvas._elem.before(aL),
									this.legend.pack(aA),
									this.legend._elem
										? this.drawSeries({
												legendInfo: {
													location: this.legend.location,
													placement: this.legend
														.placement,
													width: this.legend.getWidth(),
													height: this.legend.getHeight(),
													xoffset: this.legend.xoffset,
													yoffset: this.legend.yoffset
												}
											})
										: this.drawSeries())
								: (this.drawSeries(),
									aJ && L(aq[aJ - 1].canvas._elem).after(aL),
									this.legend.pack(aA));
						for (
							var aH = 0, aE = L.jqplot.eventListenerHooks.length;
							aE > aH;
							aH++
						)
							this.eventCanvas._elem.bind(
								L.jqplot.eventListenerHooks[aH][0],
								{ plot: this },
								L.jqplot.eventListenerHooks[aH][1]
							);
						for (
							var aH = 0,
								aE = this.eventListenerHooks.hooks.length;
							aE > aH;
							aH++
						)
							this.eventCanvas._elem.bind(
								this.eventListenerHooks.hooks[aH][0],
								{ plot: this },
								this.eventListenerHooks.hooks[aH][1]
							);
						var ay = this.fillBetween;
						ay.fill &&
							ay.series1 !== ay.series2 &&
							ay.series1 < aJ &&
							ay.series2 < aJ &&
							"line" === aq[ay.series1]._type &&
							"line" === aq[ay.series2]._type &&
							this.doFillBetweenLines();
						for (
							var aH = 0, aE = L.jqplot.postDrawHooks.length;
							aE > aH;
							aH++
						)
							L.jqplot.postDrawHooks[aH].call(this);
						for (
							var aH = 0, aE = this.postDrawHooks.hooks.length;
							aE > aH;
							aH++
						)
							this.postDrawHooks.hooks[aH].apply(
								this,
								this.postDrawHooks.args[aH]
							);
						this.target.is(":visible") && (this._drawCount += 1);
						var av, aw, aD, ap;
						for (aH = 0, aE = aJ; aE > aH; aH++)
							(av = aq[aH]),
								(aw = av.renderer),
								(aD =
									".jqplot-point-label.jqplot-series-" + aH),
								aw.animation &&
									aw.animation._supported &&
									aw.animation.show &&
									(this._drawCount < 2 ||
										this.animateReplot) &&
									((ap = this.target.find(aD)),
									ap.stop(!0, !0).hide(),
									av.canvas._elem.stop(!0, !0).hide(),
									av.shadowCanvas._elem.stop(!0, !0).hide(),
									av.canvas._elem.jqplotEffect(
										"blind",
										{
											mode: "show",
											direction: aw.animation.direction
										},
										aw.animation.speed
									),
									av.shadowCanvas._elem.jqplotEffect(
										"blind",
										{
											mode: "show",
											direction: aw.animation.direction
										},
										aw.animation.speed
									),
									ap.fadeIn(0.8 * aw.animation.speed));
						(ap = null),
							this.target.trigger("jqplotPostDraw", [this]);
					}
				}),
				(R.prototype.doFillBetweenLines = function() {
					var an = this.fillBetween,
						ax = an.series1,
						av = an.series2,
						aw = av > ax ? ax : av,
						au = av > ax ? av : ax,
						ar = this.series[aw],
						aq = this.series[au];
					if (aq.renderer.smooth)
						var ap = aq.renderer._smoothedData.slice(0).reverse();
					else var ap = aq.gridData.slice(0).reverse();
					if (ar.renderer.smooth)
						var at = ar.renderer._smoothedData.concat(ap);
					else var at = ar.gridData.concat(ap);
					var ao =
							null !== an.color
								? an.color
								: this.series[ax].fillColor,
						ay = null !== an.baseSeries ? an.baseSeries : aw,
						am = this.series[ay].renderer.shapeRenderer,
						al = { fillStyle: ao, fill: !0, closePath: !0 };
					am.draw(ar.shadowCanvas._ctx, at, al);
				}),
				(this.bindCustomEvents = function() {
					this.eventCanvas._elem.bind(
						"click",
						{ plot: this },
						this.onClick
					),
						this.eventCanvas._elem.bind(
							"dblclick",
							{ plot: this },
							this.onDblClick
						),
						this.eventCanvas._elem.bind(
							"mousedown",
							{
								plot: this
							},
							this.onMouseDown
						),
						this.eventCanvas._elem.bind(
							"mousemove",
							{ plot: this },
							this.onMouseMove
						),
						this.eventCanvas._elem.bind(
							"mouseenter",
							{ plot: this },
							this.onMouseEnter
						),
						this.eventCanvas._elem.bind(
							"mouseleave",
							{ plot: this },
							this.onMouseLeave
						),
						this.captureRightClick
							? (this.eventCanvas._elem.bind(
									"mouseup",
									{ plot: this },
									this.onRightClick
								),
								(this.eventCanvas._elem.get(
									0
								).oncontextmenu = function() {
									return !1;
								}))
							: this.eventCanvas._elem.bind(
									"mouseup",
									{ plot: this },
									this.onMouseUp
								);
				}),
				(this.onClick = function(an) {
					var am = ai(an),
						ap = an.data.plot,
						ao = ak(am.gridPos, ap),
						al = L.Event("jqplotClick");
					(al.pageX = an.pageX),
						(al.pageY = an.pageY),
						L(this).trigger(al, [am.gridPos, am.dataPos, ao, ap]);
				}),
				(this.onDblClick = function(an) {
					var am = ai(an),
						ap = an.data.plot,
						ao = ak(am.gridPos, ap),
						al = L.Event("jqplotDblClick");
					(al.pageX = an.pageX),
						(al.pageY = an.pageY),
						L(this).trigger(al, [am.gridPos, am.dataPos, ao, ap]);
				}),
				(this.onMouseDown = function(an) {
					var am = ai(an),
						ap = an.data.plot,
						ao = ak(am.gridPos, ap),
						al = L.Event("jqplotMouseDown");
					(al.pageX = an.pageX),
						(al.pageY = an.pageY),
						L(this).trigger(al, [am.gridPos, am.dataPos, ao, ap]);
				}),
				(this.onMouseUp = function(an) {
					var am = ai(an),
						al = L.Event("jqplotMouseUp");
					(al.pageX = an.pageX),
						(al.pageY = an.pageY),
						L(this).trigger(al, [
							am.gridPos,
							am.dataPos,
							null,
							an.data.plot
						]);
				}),
				(this.onRightClick = function(an) {
					var am = ai(an),
						ap = an.data.plot,
						ao = ak(am.gridPos, ap);
					if (ap.captureRightClick)
						if (3 == an.which) {
							var al = L.Event("jqplotRightClick");
							(al.pageX = an.pageX),
								(al.pageY = an.pageY),
								L(this).trigger(al, [
									am.gridPos,
									am.dataPos,
									ao,
									ap
								]);
						} else {
							var al = L.Event("jqplotMouseUp");
							(al.pageX = an.pageX),
								(al.pageY = an.pageY),
								L(this).trigger(al, [
									am.gridPos,
									am.dataPos,
									ao,
									ap
								]);
						}
				}),
				(this.onMouseMove = function(an) {
					var am = ai(an),
						ap = an.data.plot,
						ao = ak(am.gridPos, ap),
						al = L.Event("jqplotMouseMove");
					(al.pageX = an.pageX),
						(al.pageY = an.pageY),
						L(this).trigger(al, [am.gridPos, am.dataPos, ao, ap]);
				}),
				(this.onMouseEnter = function(an) {
					var am = ai(an),
						ao = an.data.plot,
						al = L.Event("jqplotMouseEnter");
					(al.pageX = an.pageX),
						(al.pageY = an.pageY),
						(al.relatedTarget = an.relatedTarget),
						L(this).trigger(al, [am.gridPos, am.dataPos, null, ao]);
				}),
				(this.onMouseLeave = function(an) {
					var am = ai(an),
						ao = an.data.plot,
						al = L.Event("jqplotMouseLeave");
					(al.pageX = an.pageX),
						(al.pageY = an.pageY),
						(al.relatedTarget = an.relatedTarget),
						L(this).trigger(al, [am.gridPos, am.dataPos, null, ao]);
				}),
				(this.drawSeries = function(an, al) {
					var ap, ao, am;
					if (
						((al = "number" == typeof an && null == al ? an : al),
						(an = "object" == typeof an ? an : {}),
						al != u)
					)
						(ao = this.series[al]),
							(am = ao.shadowCanvas._ctx),
							am.clearRect(
								0,
								0,
								am.canvas.width,
								am.canvas.height
							),
							ao.drawShadow(am, an, this),
							(am = ao.canvas._ctx),
							am.clearRect(
								0,
								0,
								am.canvas.width,
								am.canvas.height
							),
							ao.draw(am, an, this),
							ao.renderer.constructor ==
								L.jqplot.BezierCurveRenderer &&
								al < this.series.length - 1 &&
								this.drawSeries(al + 1);
					else
						for (ap = 0; ap < this.series.length; ap++)
							(ao = this.series[ap]),
								(am = ao.shadowCanvas._ctx),
								am.clearRect(
									0,
									0,
									am.canvas.width,
									am.canvas.height
								),
								ao.drawShadow(am, an, this),
								(am = ao.canvas._ctx),
								am.clearRect(
									0,
									0,
									am.canvas.width,
									am.canvas.height
								),
								ao.draw(am, an, this);
					an = al = ap = ao = am = null;
				}),
				(this.moveSeriesToFront = function(am) {
					am = parseInt(am, 10);
					var ap = L.inArray(am, this.seriesStack);
					if (-1 != ap) {
						if (ap == this.seriesStack.length - 1)
							return void (this.previousSeriesStack = this.seriesStack.slice(
								0
							));
						var al = this.seriesStack[this.seriesStack.length - 1],
							ao = this.series[am].canvas._elem.detach(),
							an = this.series[am].shadowCanvas._elem.detach();
						this.series[al].shadowCanvas._elem.after(an),
							this.series[al].canvas._elem.after(ao),
							(this.previousSeriesStack = this.seriesStack.slice(
								0
							)),
							this.seriesStack.splice(ap, 1),
							this.seriesStack.push(am);
					}
				}),
				(this.moveSeriesToBack = function(am) {
					am = parseInt(am, 10);
					var ap = L.inArray(am, this.seriesStack);
					if (0 != ap && -1 != ap) {
						var al = this.seriesStack[0],
							ao = this.series[am].canvas._elem.detach(),
							an = this.series[am].shadowCanvas._elem.detach();
						this.series[al].shadowCanvas._elem.before(an),
							this.series[al].canvas._elem.before(ao),
							(this.previousSeriesStack = this.seriesStack.slice(
								0
							)),
							this.seriesStack.splice(ap, 1),
							this.seriesStack.unshift(am);
					}
				}),
				(this.restorePreviousSeriesOrder = function() {
					var ar, ap, ao, an, al, am;
					if (this.seriesStack != this.previousSeriesStack) {
						for (ar = 1; ar < this.previousSeriesStack.length; ar++)
							(al = this.previousSeriesStack[ar]),
								(am = this.previousSeriesStack[ar - 1]),
								(ap = this.series[al].canvas._elem.detach()),
								(ao = this.series[
									al
								].shadowCanvas._elem.detach()),
								this.series[am].shadowCanvas._elem.after(ao),
								this.series[am].canvas._elem.after(ap);
						(an = this.seriesStack.slice(0)),
							(this.seriesStack = this.previousSeriesStack.slice(
								0
							)),
							(this.previousSeriesStack = an);
					}
				}),
				(this.restoreOriginalSeriesOrder = function() {
					var ap,
						an,
						am,
						al = [];
					for (ap = 0; ap < this.series.length; ap++) al.push(ap);
					if (this.seriesStack != al)
						for (
							this.previousSeriesStack = this.seriesStack.slice(
								0
							),
								this.seriesStack = al,
								ap = 1;
							ap < this.seriesStack.length;
							ap++
						)
							(an = this.series[ap].canvas._elem.detach()),
								(am = this.series[
									ap
								].shadowCanvas._elem.detach()),
								this.series[ap - 1].shadowCanvas._elem.after(
									am
								),
								this.series[ap - 1].canvas._elem.after(an);
				}),
				(this.activateTheme = function(al) {
					this.themeEngine.activate(this, al);
				});
		}
		function K(ai, ah) {
			return (3.4182054 + ah) * Math.pow(ai, -0.3534992);
		}
		function A(ah) {
			var ai = (Math.exp(2 * ah) - 1) / (Math.exp(2 * ah) + 1);
			return ai;
		}
		function J(aJ) {
			function av(aK, aL) {
				return aK - aL == 0 ? Math.pow(10, 10) : aK - aL;
			}
			var at = this.renderer.smooth,
				aD = this.canvas.getWidth(),
				an = this._xaxis.series_p2u,
				aG = this._yaxis.series_p2u,
				aF = null,
				az = aJ.length / aD,
				aj = [],
				ay = [];
			aF = isNaN(parseFloat(at)) ? K(az, 0.5) : parseFloat(at);
			for (var aw = [], ak = [], aE = 0, aA = aJ.length; aA > aE; aE++)
				aw.push(aJ[aE][1]), ak.push(aJ[aE][0]);
			for (
				var ax, ar, aq, ap, ah = aJ.length - 1, al = 1, aB = aJ.length;
				aB > al;
				al++
			) {
				for (var ai = [], au = [], aC = 0; 2 > aC; aC++) {
					var aE = al - 1 + aC;
					ai[aC] =
						0 == aE || aE == ah
							? Math.pow(10, 10)
							: aw[aE + 1] - aw[aE] == 0 ||
								aw[aE] - aw[aE - 1] == 0
								? 0
								: (ak[aE + 1] - ak[aE]) / (aw[aE + 1] - aw[aE]) +
										(ak[aE] - ak[aE - 1]) /
											(aw[aE] - aw[aE - 1]) ==
									0
									? 0
									: (aw[aE + 1] - aw[aE]) *
											(aw[aE] - aw[aE - 1]) <
										0
										? 0
										: 2 /
											(av(ak[aE + 1], ak[aE]) /
												(aw[aE + 1] - aw[aE]) +
												av(ak[aE], ak[aE - 1]) /
													(aw[aE] - aw[aE - 1]));
				}
				1 == al
					? (ai[0] =
							1.5 * (aw[1] - aw[0]) / av(ak[1], ak[0]) - ai[1] / 2)
					: al == ah &&
						(ai[1] =
							1.5 * (aw[ah] - aw[ah - 1]) / av(ak[ah], ak[ah - 1]) -
							ai[0] / 2),
					(au[0] =
						-2 * (ai[1] + 2 * ai[0]) / av(ak[al], ak[al - 1]) +
						6 *
							(aw[al] - aw[al - 1]) /
							Math.pow(av(ak[al], ak[al - 1]), 2)),
					(au[1] =
						2 * (2 * ai[1] + ai[0]) / av(ak[al], ak[al - 1]) -
						6 *
							(aw[al] - aw[al - 1]) /
							Math.pow(av(ak[al], ak[al - 1]), 2)),
					(ap = 1 / 6 * (au[1] - au[0]) / av(ak[al], ak[al - 1])),
					(aq =
						0.5 *
						(ak[al] * au[0] - ak[al - 1] * au[1]) /
						av(ak[al], ak[al - 1])),
					(ar =
						(aw[al] -
							aw[al - 1] -
							aq *
								(Math.pow(ak[al], 2) -
									Math.pow(ak[al - 1], 2)) -
							ap *
								(Math.pow(ak[al], 3) -
									Math.pow(ak[al - 1], 3))) /
						av(ak[al], ak[al - 1])),
					(ax =
						aw[al - 1] -
						ar * ak[al - 1] -
						aq * Math.pow(ak[al - 1], 2) -
						ap * Math.pow(ak[al - 1], 3));
				for (
					var aH,
						ao,
						aI = (ak[al] - ak[al - 1]) / aF,
						aC = 0,
						aA = aF;
					aA > aC;
					aC++
				)
					(aH = []),
						(ao = ak[al - 1] + aC * aI),
						aH.push(ao),
						aH.push(
							ax +
								ar * ao +
								aq * Math.pow(ao, 2) +
								ap * Math.pow(ao, 3)
						),
						aj.push(aH),
						ay.push([an(aH[0]), aG(aH[1])]);
			}
			return (
				aj.push(aJ[aE]),
				ay.push([an(aJ[aE][0]), aG(aJ[aE][1])]),
				[aj, ay]
			);
		}
		function F(ap) {
			var aK,
				aL,
				aD,
				aC,
				aA,
				ay,
				ak,
				ai,
				av,
				au,
				aB,
				az,
				aN,
				aS,
				ax,
				aF,
				aG,
				aE,
				ao = this.renderer.smooth,
				aU = this.renderer.tension,
				ah = this.canvas.getWidth(),
				aH = this._xaxis.series_p2u,
				aq = this._yaxis.series_p2u,
				aI = null,
				aT = null,
				aO = null,
				aM = null,
				at = null,
				aR = null,
				am = null,
				al = ap.length / ah,
				ar = [],
				an = [];
			(aI = isNaN(parseFloat(ao)) ? K(al, 0.5) : parseFloat(ao)),
				isNaN(parseFloat(aU)) || (aU = parseFloat(aU));
			for (var aQ = 0, aP = ap.length - 1; aP > aQ; aQ++)
				for (
					null === aU
						? ((at = Math.abs(
								(ap[aQ + 1][1] - ap[aQ][1]) /
									(ap[aQ + 1][0] - ap[aQ][0])
							)),
							(aS = 0.3),
							(ax = 0.6),
							(aF = (ax - aS) / 2),
							(aG = 2.5),
							(aE = -1.4),
							(am = at / aG + aE),
							(aO = aF * A(am) - aF * A(aE) + aS),
							aQ > 0 &&
								(aR = Math.abs(
									(ap[aQ][1] - ap[aQ - 1][1]) /
										(ap[aQ][0] - ap[aQ - 1][0])
								)),
							(am = aR / aG + aE),
							(aM = aF * A(am) - aF * A(aE) + aS),
							(aT = (aO + aM) / 2))
						: (aT = aU),
						aK = 0;
					aI > aK;
					aK++
				)
					(aL = aK / aI),
						(aD = (1 + 2 * aL) * Math.pow(1 - aL, 2)),
						(aC = aL * Math.pow(1 - aL, 2)),
						(aA = Math.pow(aL, 2) * (3 - 2 * aL)),
						(ay = Math.pow(aL, 2) * (aL - 1)),
						ap[aQ - 1]
							? ((ak = aT * (ap[aQ + 1][0] - ap[aQ - 1][0])),
								(ai = aT * (ap[aQ + 1][1] - ap[aQ - 1][1])))
							: ((ak = aT * (ap[aQ + 1][0] - ap[aQ][0])),
								(ai = aT * (ap[aQ + 1][1] - ap[aQ][1]))),
						ap[aQ + 2]
							? ((av = aT * (ap[aQ + 2][0] - ap[aQ][0])),
								(au = aT * (ap[aQ + 2][1] - ap[aQ][1])))
							: ((av = aT * (ap[aQ + 1][0] - ap[aQ][0])),
								(au = aT * (ap[aQ + 1][1] - ap[aQ][1]))),
						(aB =
							aD * ap[aQ][0] +
							aA * ap[aQ + 1][0] +
							aC * ak +
							ay * av),
						(az =
							aD * ap[aQ][1] +
							aA * ap[aQ + 1][1] +
							aC * ai +
							ay * au),
						(aN = [aB, az]),
						ar.push(aN),
						an.push([aH(aB), aq(az)]);
			return (
				ar.push(ap[aP]),
				an.push([aH(ap[aP][0]), aq(ap[aP][1])]),
				[ar, an]
			);
		}
		function z() {
			for (var ai = 0; ai < this.series.length; ai++)
				this.series[ai].renderer.constructor == L.jqplot.LineRenderer &&
					this.series[ai].highlightMouseOver &&
					(this.series[ai].highlightMouseDown = !1);
		}
		function af() {
			this.plugins.lineRenderer &&
				this.plugins.lineRenderer.highlightCanvas &&
				(this.plugins.lineRenderer.highlightCanvas.resetCanvas(),
				(this.plugins.lineRenderer.highlightCanvas = null)),
				(this.plugins.lineRenderer.highlightedSeriesIndex = null),
				(this.plugins.lineRenderer.highlightCanvas = new L.jqplot.GenericCanvas()),
				this.eventCanvas._elem.before(
					this.plugins.lineRenderer.highlightCanvas.createElement(
						this._gridPadding,
						"jqplot-lineRenderer-highlight-canvas",
						this._plotDimensions,
						this
					)
				),
				this.plugins.lineRenderer.highlightCanvas.setContext(),
				this.eventCanvas._elem.bind(
					"mouseleave",
					{ plot: this },
					function(ah) {
						aa(ah.data.plot);
					}
				);
		}
		function ac(an, am, ak, aj) {
			var ai = an.series[am],
				ah = an.plugins.lineRenderer.highlightCanvas;
			ah._ctx.clearRect(
				0,
				0,
				ah._ctx.canvas.width,
				ah._ctx.canvas.height
			),
				(ai._highlightedPoint = ak),
				(an.plugins.lineRenderer.highlightedSeriesIndex = am);
			var al = { fillStyle: ai.highlightColor };
			"line" === ai.type &&
				ai.renderer.bands.show &&
				((al.fill = !0), (al.closePath = !0)),
				ai.renderer.shapeRenderer.draw(ah._ctx, aj, al),
				(ah = null);
		}
		function aa(aj) {
			var ah = aj.plugins.lineRenderer.highlightCanvas;
			ah._ctx.clearRect(
				0,
				0,
				ah._ctx.canvas.width,
				ah._ctx.canvas.height
			);
			for (var ai = 0; ai < aj.series.length; ai++)
				aj.series[ai]._highlightedPoint = null;
			(aj.plugins.lineRenderer.highlightedSeriesIndex = null),
				aj.target.trigger("jqplotDataUnhighlight"),
				(ah = null);
		}
		function h(al, ak, ao, an, am) {
			if (an) {
				var aj = [an.seriesIndex, an.pointIndex, an.data],
					ai = jQuery.Event("jqplotDataMouseOver");
				if (
					((ai.pageX = al.pageX),
					(ai.pageY = al.pageY),
					am.target.trigger(ai, aj),
					am.series[aj[0]].highlightMouseOver &&
						aj[0] != am.plugins.lineRenderer.highlightedSeriesIndex)
				) {
					var ah = jQuery.Event("jqplotDataHighlight");
					(ah.which = al.which),
						(ah.pageX = al.pageX),
						(ah.pageY = al.pageY),
						am.target.trigger(ah, aj),
						ac(am, an.seriesIndex, an.pointIndex, an.points);
				}
			} else null == an && aa(am);
		}
		function e(ak, aj, an, am, al) {
			if (am) {
				var ai = [am.seriesIndex, am.pointIndex, am.data];
				if (
					al.series[ai[0]].highlightMouseDown &&
					ai[0] != al.plugins.lineRenderer.highlightedSeriesIndex
				) {
					var ah = jQuery.Event("jqplotDataHighlight");
					(ah.which = ak.which),
						(ah.pageX = ak.pageX),
						(ah.pageY = ak.pageY),
						al.target.trigger(ah, ai),
						ac(al, am.seriesIndex, am.pointIndex, am.points);
				}
			} else null == am && aa(al);
		}
		function ad(aj, ai, am, al, ak) {
			var ah = ak.plugins.lineRenderer.highlightedSeriesIndex;
			null != ah && ak.series[ah].highlightMouseDown && aa(ak);
		}
		function g(ak, aj, an, am, al) {
			if (am) {
				var ai = [am.seriesIndex, am.pointIndex, am.data],
					ah = jQuery.Event("jqplotDataClick");
				(ah.which = ak.which),
					(ah.pageX = ak.pageX),
					(ah.pageY = ak.pageY),
					al.target.trigger(ah, ai);
			}
		}
		function s(al, ak, ao, an, am) {
			if (an) {
				var aj = [an.seriesIndex, an.pointIndex, an.data],
					ah = am.plugins.lineRenderer.highlightedSeriesIndex;
				null != ah && am.series[ah].highlightMouseDown && aa(am);
				var ai = jQuery.Event("jqplotDataRightClick");
				(ai.which = al.which),
					(ai.pageX = al.pageX),
					(ai.pageY = al.pageY),
					am.target.trigger(ai, aj);
			}
		}
		function i(ai) {
			var ah;
			if (((ai = Math.abs(ai)), ai >= 10)) ah = "%d";
			else if (ai > 1) ah = ai === parseInt(ai, 10) ? "%d" : "%.1f";
			else {
				var aj = -Math.floor(Math.log(ai) / Math.LN10);
				ah = "%." + aj + "f";
			}
			return ah;
		}
		function d(al, au, at) {
			for (
				var ax,
					ap,
					ar,
					aw,
					an,
					ao,
					av,
					aq = Math.floor(at / 2),
					ai = Math.ceil(1.5 * at),
					ak = Number.MAX_VALUE,
					ah = au - al,
					ay = L.jqplot.getSignificantFigures,
					am = 0,
					aj = ai - aq + 1;
				aj > am;
				am++
			)
				(ao = aq + am),
					(ax = ah / (ao - 1)),
					(ap = ay(ax)),
					(ax = Math.abs(at - ao) + ap.digitsRight),
					ak > ax
						? ((ak = ax), (ar = ao), (av = ap.digitsRight))
						: ax === ak &&
							ap.digitsRight < av &&
							((ar = ao), (av = ap.digitsRight));
			return (
				(aw = Math.max(
					av,
					Math.max(ay(al).digitsRight, ay(au).digitsRight)
				)),
				(an = 0 === aw ? "%d" : "%." + aw + "f"),
				(ax = ah / (ar - 1)),
				[al, au, ar, an, ax]
			);
		}
		function W(ai, al) {
			al = al || 7;
			var ah,
				ak = ai / (al - 1),
				aj = Math.pow(10, Math.floor(Math.log(ak) / Math.LN10)),
				am = ak / aj;
			return (ah =
				1 > aj
					? am > 5 ? 10 * aj : am > 2 ? 5 * aj : am > 1 ? 2 * aj : aj
					: am > 5
						? 10 * aj
						: am > 4
							? 5 * aj
							: am > 3
								? 4 * aj
								: am > 2 ? 3 * aj : am > 1 ? 2 * aj : aj);
		}
		function Q(ai, ah) {
			ah = ah || 1;
			var aj,
				ak = Math.floor(Math.log(ai) / Math.LN10),
				am = Math.pow(10, ak),
				al = ai / am;
			return (
				(al /= ah),
				(aj =
					0.38 >= al
						? 0.1
						: 1.6 >= al
							? 0.2
							: 4 >= al ? 0.5 : 8 >= al ? 1 : 16 >= al ? 2 : 5),
				aj * am
			);
		}
		function x(aj, ai) {
			var ah,
				ak,
				al = Math.floor(Math.log(aj) / Math.LN10),
				an = Math.pow(10, al),
				am = aj / an;
			return (
				(am /= ai),
				(ak =
					0.38 >= am
						? 0.1
						: 1.6 >= am
							? 0.2
							: 4 >= am ? 0.5 : 8 >= am ? 1 : 16 >= am ? 2 : 5),
				(ah = ak * an),
				[ah, ak, an]
			);
		}
		function O(ai, ah) {
			return ai - ah;
		}
		function B(aj) {
			if (null == aj || "object" != typeof aj) return aj;
			var ah = new aj.constructor();
			for (var ai in aj) ah[ai] = B(aj[ai]);
			return ah;
		}
		function V(aj, ai) {
			if (null != ai && "object" == typeof ai)
				for (var ah in ai)
					"highlightColors" == ah && (aj[ah] = B(ai[ah])),
						null != ai[ah] && "object" == typeof ai[ah]
							? (aj.hasOwnProperty(ah) || (aj[ah] = {}),
								V(aj[ah], ai[ah]))
							: (aj[ah] = ai[ah]);
		}
		function ab(aj, ak) {
			if (ak.indexOf) return ak.indexOf(aj);
			for (var ah = 0, ai = ak.length; ai > ah; ah++)
				if (ak[ah] === aj) return ah;
			return -1;
		}
		function l(ah) {
			return null === ah
				? "[object Null]"
				: Object.prototype.toString.call(ah);
		}
		function j(ai, ah, aj, ak) {
			return L.isPlainObject(ai)
				? ai
				: ((ai = { effect: ai }),
					ah === u && (ah = {}),
					L.isFunction(ah) && ((ak = ah), (aj = null), (ah = {})),
					("number" === L.type(ah) || L.fx.speeds[ah]) &&
						((ak = aj), (aj = ah), (ah = {})),
					L.isFunction(aj) && ((ak = aj), (aj = null)),
					ah && L.extend(ai, ah),
					(aj = aj || ah.duration),
					(ai.duration = L.fx.off
						? 0
						: "number" == typeof aj
							? aj
							: aj in L.fx.speeds
								? L.fx.speeds[aj]
								: L.fx.speeds._default),
					(ai.complete = ak || ah.complete),
					ai);
		}
		var u;
		(L.fn.emptyForce = function() {
			for (var ai, ah = 0; null != (ai = L(this)[ah]); ah++) {
				if (
					(1 === ai.nodeType &&
						L.cleanData(ai.getElementsByTagName("*")),
					L.jqplot.use_excanvas)
				)
					ai.outerHTML = "";
				else for (; ai.firstChild; ) ai.removeChild(ai.firstChild);
				ai = null;
			}
			return L(this);
		}),
			(L.fn.removeChildForce = function(ah) {
				for (; ah.firstChild; )
					this.removeChildForce(ah.firstChild),
						ah.removeChild(ah.firstChild);
			}),
			(L.fn.jqplot = function() {
				for (
					var ah = [], aj = [], ak = 0, ai = arguments.length;
					ai > ak;
					ak++
				)
					L.isArray(arguments[ak])
						? ah.push(arguments[ak])
						: L.isPlainObject(arguments[ak]) &&
							aj.push(arguments[ak]);
				return this.each(function(an) {
					var at,
						ar,
						ap,
						ao,
						aq = L(this),
						am = ah.length,
						al = aj.length;
					(ap = am > an ? ah[an] : am ? ah[am - 1] : null),
						(ao = al > an ? aj[an] : al ? aj[al - 1] : null),
						(at = aq.attr("id")),
						at === u &&
							((at = "jqplot_target_" + L.jqplot.targetCounter++),
							aq.attr("id", at)),
						(ar = L.jqplot(at, ap, ao)),
						aq.data("jqplot", ar);
				});
			}),
			(L.jqplot = function(an, ak, ai) {
				var aj = null,
					ah = null;
				3 === arguments.length
					? ((aj = ak), (ah = ai))
					: 2 === arguments.length &&
						(L.isArray(ak)
							? (aj = ak)
							: L.isPlainObject(ak) && (ah = ak)),
					null === aj && null !== ah && ah.data && (aj = ah.data);
				var am = new R();
				if (
					(L("#" + an).removeClass("jqplot-error"),
					!L.jqplot.config.catchErrors)
				)
					return (
						am.init(an, aj, ah),
						am.draw(),
						am.themeEngine.init.call(am),
						am
					);
				try {
					return (
						am.init(an, aj, ah),
						am.draw(),
						am.themeEngine.init.call(am),
						am
					);
				} catch (al) {
					var ao = L.jqplot.config.errorMessage || al.message;
					L("#" + an).append(
						'<div class="jqplot-error-message">' + ao + "</div>"
					),
						L("#" + an).addClass("jqplot-error"),
						(document.getElementById(an).style.background =
							L.jqplot.config.errorBackground),
						(document.getElementById(an).style.border =
							L.jqplot.config.errorBorder),
						(document.getElementById(an).style.fontFamily =
							L.jqplot.config.errorFontFamily),
						(document.getElementById(an).style.fontSize =
							L.jqplot.config.errorFontSize),
						(document.getElementById(an).style.fontStyle =
							L.jqplot.config.errorFontStyle),
						(document.getElementById(an).style.fontWeight =
							L.jqplot.config.errorFontWeight);
				}
			}),
			(L.jqplot.version = "1.0.8"),
			(L.jqplot.revision = "1250"),
			(L.jqplot.targetCounter = 1),
			(L.jqplot.CanvasManager = function() {
				"undefined" == typeof L.jqplot.CanvasManager.canvases &&
					((L.jqplot.CanvasManager.canvases = []),
					(L.jqplot.CanvasManager.free = []));
				var ah = [];
				(this.getCanvas = function() {
					var ak,
						aj = !0;
					if (!L.jqplot.use_excanvas)
						for (
							var al = 0,
								ai = L.jqplot.CanvasManager.canvases.length;
							ai > al;
							al++
						)
							if (L.jqplot.CanvasManager.free[al] === !0) {
								(aj = !1),
									(ak = L.jqplot.CanvasManager.canvases[al]),
									(L.jqplot.CanvasManager.free[al] = !1),
									ah.push(al);
								break;
							}
					return (
						aj &&
							((ak = document.createElement("canvas")),
							ah.push(L.jqplot.CanvasManager.canvases.length),
							L.jqplot.CanvasManager.canvases.push(ak),
							L.jqplot.CanvasManager.free.push(!1)),
						ak
					);
				}),
					(this.initCanvas = function(ai) {
						return L.jqplot.use_excanvas
							? window.G_vmlCanvasManager.initElement(ai)
							: ai;
					}),
					(this.freeAllCanvases = function() {
						for (var aj = 0, ai = ah.length; ai > aj; aj++)
							this.freeCanvas(ah[aj]);
						ah = [];
					}),
					(this.freeCanvas = function(ai) {
						if (
							L.jqplot.use_excanvas &&
							window.G_vmlCanvasManager.uninitElement !== u
						)
							window.G_vmlCanvasManager.uninitElement(
								L.jqplot.CanvasManager.canvases[ai]
							),
								(L.jqplot.CanvasManager.canvases[ai] = null);
						else {
							var aj = L.jqplot.CanvasManager.canvases[ai];
							aj
								.getContext("2d")
								.clearRect(0, 0, aj.width, aj.height),
								L(aj)
									.unbind()
									.removeAttr("class")
									.removeAttr("style"),
								L(aj).css({ left: "", top: "", position: "" }),
								(aj.width = 0),
								(aj.height = 0),
								(L.jqplot.CanvasManager.free[ai] = !0);
						}
					});
			}),
			(L.jqplot.log = function() {
				window.console &&
					window.console.log.apply(window.console, arguments);
			}),
			(L.jqplot.config = {
				addDomReference: !1,
				enablePlugins: !1,
				defaultHeight: 300,
				defaultWidth: 400,
				UTCAdjust: !1,
				timezoneOffset: new Date(6e4 * new Date().getTimezoneOffset()),
				errorMessage: "",
				errorBackground: "",
				errorBorder: "",
				errorFontFamily: "",
				errorFontSize: "",
				errorFontStyle: "",
				errorFontWeight: "",
				catchErrors: !1,
				defaultTickFormatString: "%.1f",
				defaultColors: [
					"#4bb2c5",
					"#EAA228",
					"#c5b47f",
					"#579575",
					"#839557",
					"#958c12",
					"#953579",
					"#4b5de4",
					"#d8b83f",
					"#ff5800",
					"#0085cc",
					"#c747a3",
					"#cddf54",
					"#FBD178",
					"#26B4E3",
					"#bd70c7"
				],
				defaultNegativeColors: [
					"#498991",
					"#C08840",
					"#9F9274",
					"#546D61",
					"#646C4A",
					"#6F6621",
					"#6E3F5F",
					"#4F64B0",
					"#A89050",
					"#C45923",
					"#187399",
					"#945381",
					"#959E5C",
					"#C7AF7B",
					"#478396",
					"#907294"
				],
				dashLength: 4,
				gapLength: 4,
				dotGapLength: 2.5,
				srcLocation: "jqplot/src/",
				pluginLocation: "jqplot/src/plugins/"
			}),
			(L.jqplot.arrayMax = function(ah) {
				return Math.max.apply(Math, ah);
			}),
			(L.jqplot.arrayMin = function(ah) {
				return Math.min.apply(Math, ah);
			}),
			(L.jqplot.enablePlugins = L.jqplot.config.enablePlugins),
			(L.jqplot.support_canvas = function() {
				return (
					"undefined" == typeof L.jqplot.support_canvas.result &&
						(L.jqplot.support_canvas.result = !!document.createElement(
							"canvas"
						).getContext),
					L.jqplot.support_canvas.result
				);
			}),
			(L.jqplot.support_canvas_text = function() {
				return (
					"undefined" == typeof L.jqplot.support_canvas_text.result &&
						(L.jqplot.support_canvas_text.result =
							window.G_vmlCanvasManager !== u &&
							window.G_vmlCanvasManager._version > 887
								? !0
								: !(
										!document.createElement("canvas")
											.getContext ||
										"function" !=
											typeof document
												.createElement("canvas")
												.getContext("2d").fillText
									)),
					L.jqplot.support_canvas_text.result
				);
			}),
			(L.jqplot.use_excanvas =
				(L.support.boxModel &&
					L.support.objectAll &&
					$support.leadingWhitespace) ||
				L.jqplot.support_canvas()
					? !1
					: !0),
			(L.jqplot.preInitHooks = []),
			(L.jqplot.postInitHooks = []),
			(L.jqplot.preParseOptionsHooks = []),
			(L.jqplot.postParseOptionsHooks = []),
			(L.jqplot.preDrawHooks = []),
			(L.jqplot.postDrawHooks = []),
			(L.jqplot.preDrawSeriesHooks = []),
			(L.jqplot.postDrawSeriesHooks = []),
			(L.jqplot.preDrawLegendHooks = []),
			(L.jqplot.addLegendRowHooks = []),
			(L.jqplot.preSeriesInitHooks = []),
			(L.jqplot.postSeriesInitHooks = []),
			(L.jqplot.preParseSeriesOptionsHooks = []),
			(L.jqplot.postParseSeriesOptionsHooks = []),
			(L.jqplot.eventListenerHooks = []),
			(L.jqplot.preDrawSeriesShadowHooks = []),
			(L.jqplot.postDrawSeriesShadowHooks = []),
			(L.jqplot.ElemContainer = function() {
				this._elem,
					this._plotWidth,
					this._plotHeight,
					(this._plotDimensions = { height: null, width: null });
			}),
			(L.jqplot.ElemContainer.prototype.createElement = function(
				ak,
				am,
				ai,
				aj,
				an
			) {
				this._offsets = am;
				var ah = ai || "jqplot",
					al = document.createElement(ak);
				return (
					(this._elem = L(al)),
					this._elem.addClass(ah),
					this._elem.css(aj),
					this._elem.attr(an),
					(al = null),
					this._elem
				);
			}),
			(L.jqplot.ElemContainer.prototype.getWidth = function() {
				return this._elem ? this._elem.outerWidth(!0) : null;
			}),
			(L.jqplot.ElemContainer.prototype.getHeight = function() {
				return this._elem ? this._elem.outerHeight(!0) : null;
			}),
			(L.jqplot.ElemContainer.prototype.getPosition = function() {
				return this._elem
					? this._elem.position()
					: { top: null, left: null, bottom: null, right: null };
			}),
			(L.jqplot.ElemContainer.prototype.getTop = function() {
				return this.getPosition().top;
			}),
			(L.jqplot.ElemContainer.prototype.getLeft = function() {
				return this.getPosition().left;
			}),
			(L.jqplot.ElemContainer.prototype.getBottom = function() {
				return this._elem.css("bottom");
			}),
			(L.jqplot.ElemContainer.prototype.getRight = function() {
				return this._elem.css("right");
			}),
			(w.prototype = new L.jqplot.ElemContainer()),
			(w.prototype.constructor = w),
			(w.prototype.init = function() {
				L.isFunction(this.renderer) &&
					(this.renderer = new this.renderer()),
					(this.tickOptions.axis = this.name),
					null == this.tickOptions.showMark &&
						(this.tickOptions.showMark = this.showTicks),
					null == this.tickOptions.showMark &&
						(this.tickOptions.showMark = this.showTickMarks),
					null == this.tickOptions.showLabel &&
						(this.tickOptions.showLabel = this.showTicks),
					null == this.label || "" == this.label
						? (this.showLabel = !1)
						: (this.labelOptions.label = this.label),
					0 == this.showLabel && (this.labelOptions.show = !1),
					0 == this.pad && (this.pad = 1),
					0 == this.padMax && (this.padMax = 1),
					0 == this.padMin && (this.padMin = 1),
					null == this.padMax &&
						(this.padMax = (this.pad - 1) / 2 + 1),
					null == this.padMin &&
						(this.padMin = (this.pad - 1) / 2 + 1),
					(this.pad = this.padMax + this.padMin - 1),
					(null != this.min || null != this.max) &&
						(this.autoscale = !1),
					null == this.syncTicks && this.name.indexOf("y") > -1
						? (this.syncTicks = !0)
						: null == this.syncTicks && (this.syncTicks = !1),
					this.renderer.init.call(this, this.rendererOptions);
			}),
			(w.prototype.draw = function(ah, ai) {
				return (
					this.__ticks && (this.__ticks = null),
					this.renderer.draw.call(this, ah, ai)
				);
			}),
			(w.prototype.set = function() {
				this.renderer.set.call(this);
			}),
			(w.prototype.pack = function(ai, ah) {
				this.show && this.renderer.pack.call(this, ai, ah),
					null == this._min &&
						((this._min = this.min),
						(this._max = this.max),
						(this._tickInterval = this.tickInterval),
						(this._numberTicks = this.numberTicks),
						(this.__ticks = this._ticks));
			}),
			(w.prototype.reset = function() {
				this.renderer.reset.call(this);
			}),
			(w.prototype.resetScale = function(ah) {
				L.extend(
					!0,
					this,
					{
						min: null,
						max: null,
						numberTicks: null,
						tickInterval: null,
						_ticks: [],
						ticks: []
					},
					ah
				),
					this.resetDataBounds();
			}),
			(w.prototype.resetDataBounds = function() {
				var ao = this._dataBounds;
				(ao.min = null), (ao.max = null);
				for (
					var ai, ap, am, aj = this.show ? !0 : !1, al = 0;
					al < this._series.length;
					al++
				)
					if (
						((ap = this._series[al]),
						ap.show || this.scaleToHiddenSeries)
					) {
						(am = ap._plotData),
							"line" === ap._type &&
								ap.renderer.bands.show &&
								"x" !== this.name.charAt(0) &&
								(am = [
									[0, ap.renderer.bands._min],
									[1, ap.renderer.bands._max]
								]);
						var ah = 1,
							an = 1;
						null != ap._type &&
							"ohlc" == ap._type &&
							((ah = 3), (an = 2));
						for (var ak = 0, ai = am.length; ai > ak; ak++)
							"xaxis" == this.name || "x2axis" == this.name
								? (((null != am[ak][0] && am[ak][0] < ao.min) ||
										null == ao.min) &&
										(ao.min = am[ak][0]),
									((null != am[ak][0] && am[ak][0] > ao.max) ||
										null == ao.max) &&
										(ao.max = am[ak][0]))
								: (((null != am[ak][ah] &&
										am[ak][ah] < ao.min) ||
										null == ao.min) &&
										(ao.min = am[ak][ah]),
									((null != am[ak][an] &&
										am[ak][an] > ao.max) ||
										null == ao.max) &&
										(ao.max = am[ak][an]));
						aj && ap.renderer.constructor !== L.jqplot.BarRenderer
							? (aj = !1)
							: aj &&
								this._options.hasOwnProperty("forceTickAt0") &&
								0 == this._options.forceTickAt0
								? (aj = !1)
								: aj &&
									ap.renderer.constructor ===
										L.jqplot.BarRenderer &&
									("vertical" == ap.barDirection &&
									"xaxis" != this.name &&
									"x2axis" != this.name
										? (null != this._options.pad ||
												null != this._options.padMin) &&
											(aj = !1)
										: "horizontal" != ap.barDirection ||
											("xaxis" != this.name &&
												"x2axis" != this.name) ||
											((null != this._options.pad ||
												null != this._options.padMin) &&
												(aj = !1)));
					}
				aj &&
					this.renderer.constructor === L.jqplot.LinearAxisRenderer &&
					ao.min >= 0 &&
					((this.padMin = 1), (this.forceTickAt0 = !0));
			}),
			(q.prototype = new L.jqplot.ElemContainer()),
			(q.prototype.constructor = q),
			(q.prototype.setOptions = function(ah) {
				if (
					(L.extend(!0, this, ah),
					"inside" == this.placement &&
						(this.placement = "insideGrid"),
					this.xoffset > 0)
				) {
					if ("insideGrid" == this.placement)
						switch (this.location) {
							case "nw":
							case "w":
							case "sw":
								null == this.marginLeft &&
									(this.marginLeft = this.xoffset + "px"),
									(this.marginRight = "0px");
								break;
							case "ne":
							case "e":
							case "se":
							default:
								null == this.marginRight &&
									(this.marginRight = this.xoffset + "px"),
									(this.marginLeft = "0px");
						}
					else if ("outside" == this.placement)
						switch (this.location) {
							case "nw":
							case "w":
							case "sw":
								null == this.marginRight &&
									(this.marginRight = this.xoffset + "px"),
									(this.marginLeft = "0px");
								break;
							case "ne":
							case "e":
							case "se":
							default:
								null == this.marginLeft &&
									(this.marginLeft = this.xoffset + "px"),
									(this.marginRight = "0px");
						}
					this.xoffset = 0;
				}
				if (this.yoffset > 0) {
					if ("outside" == this.placement)
						switch (this.location) {
							case "sw":
							case "s":
							case "se":
								null == this.marginTop &&
									(this.marginTop = this.yoffset + "px"),
									(this.marginBottom = "0px");
								break;
							case "ne":
							case "n":
							case "nw":
							default:
								null == this.marginBottom &&
									(this.marginBottom = this.yoffset + "px"),
									(this.marginTop = "0px");
						}
					else if ("insideGrid" == this.placement)
						switch (this.location) {
							case "sw":
							case "s":
							case "se":
								null == this.marginBottom &&
									(this.marginBottom = this.yoffset + "px"),
									(this.marginTop = "0px");
								break;
							case "ne":
							case "n":
							case "nw":
							default:
								null == this.marginTop &&
									(this.marginTop = this.yoffset + "px"),
									(this.marginBottom = "0px");
						}
					this.yoffset = 0;
				}
			}),
			(q.prototype.init = function() {
				L.isFunction(this.renderer) &&
					(this.renderer = new this.renderer()),
					this.renderer.init.call(this, this.rendererOptions);
			}),
			(q.prototype.draw = function(ai, aj) {
				for (var ah = 0; ah < L.jqplot.preDrawLegendHooks.length; ah++)
					L.jqplot.preDrawLegendHooks[ah].call(this, ai);
				return this.renderer.draw.call(this, ai, aj);
			}),
			(q.prototype.pack = function(ah) {
				this.renderer.pack.call(this, ah);
			}),
			(y.prototype = new L.jqplot.ElemContainer()),
			(y.prototype.constructor = y),
			(y.prototype.init = function() {
				L.isFunction(this.renderer) &&
					(this.renderer = new this.renderer()),
					this.renderer.init.call(this, this.rendererOptions);
			}),
			(y.prototype.draw = function(ah) {
				return this.renderer.draw.call(this, ah);
			}),
			(y.prototype.pack = function() {
				this.renderer.pack.call(this);
			}),
			(S.prototype = new L.jqplot.ElemContainer()),
			(S.prototype.constructor = S),
			(S.prototype.init = function(ak, ao, am) {
				(this.index = ak), (this.gridBorderWidth = ao);
				var al,
					ah,
					an = this.data,
					aj = [];
				for (al = 0, ah = an.length; ah > al; al++)
					if (this.breakOnNull) aj.push(an[al]);
					else {
						if (
							null == an[al] ||
							null == an[al][0] ||
							null == an[al][1]
						)
							continue;
						aj.push(an[al]);
					}
				if (
					((this.data = aj),
					this.color ||
						(this.color = am.colorGenerator.get(this.index)),
					this.negativeColor ||
						(this.negativeColor = am.negativeColorGenerator.get(
							this.index
						)),
					this.fillColor || (this.fillColor = this.color),
					this.fillAlpha)
				) {
					var ai = L.jqplot.normalize2rgb(this.fillColor),
						ai = L.jqplot.getColorComponents(ai);
					this.fillColor =
						"rgba(" +
						ai[0] +
						"," +
						ai[1] +
						"," +
						ai[2] +
						"," +
						this.fillAlpha +
						")";
				}
				L.isFunction(this.renderer) &&
					(this.renderer = new this.renderer()),
					this.renderer.init.call(this, this.rendererOptions, am),
					(this.markerRenderer = new this.markerRenderer()),
					this.markerOptions.color ||
						(this.markerOptions.color = this.color),
					null == this.markerOptions.show &&
						(this.markerOptions.show = this.showMarker),
					(this.showMarker = this.markerOptions.show),
					this.markerRenderer.init(this.markerOptions);
			}),
			(S.prototype.draw = function(an, ak, am) {
				var ai = ak == u ? {} : ak;
				an = an == u ? this.canvas._ctx : an;
				var ah, al, aj;
				for (ah = 0; ah < L.jqplot.preDrawSeriesHooks.length; ah++)
					L.jqplot.preDrawSeriesHooks[ah].call(this, an, ai);
				for (
					this.show &&
						(this.renderer.setGridData.call(this, am),
						ai.preventJqPlotSeriesDrawTrigger ||
							L(an.canvas).trigger("jqplotSeriesDraw", [
								this.data,
								this.gridData
							]),
						(al = []),
						(al = ai.data
							? ai.data
							: this._stack ? this._plotData : this.data),
						(aj =
							ai.gridData ||
							this.renderer.makeGridData.call(this, al, am)),
						"line" === this._type &&
							this.renderer.smooth &&
							this.renderer._smoothedData.length &&
							(aj = this.renderer._smoothedData),
						this.renderer.draw.call(this, an, aj, ai, am)),
						ah = 0;
					ah < L.jqplot.postDrawSeriesHooks.length;
					ah++
				)
					L.jqplot.postDrawSeriesHooks[ah].call(this, an, ai, am);
				an = ak = am = ah = al = aj = null;
			}),
			(S.prototype.drawShadow = function(an, ak, am) {
				var ai = ak == u ? {} : ak;
				an = an == u ? this.shadowCanvas._ctx : an;
				var ah, al, aj;
				for (
					ah = 0;
					ah < L.jqplot.preDrawSeriesShadowHooks.length;
					ah++
				)
					L.jqplot.preDrawSeriesShadowHooks[ah].call(this, an, ai);
				for (
					this.shadow &&
						(this.renderer.setGridData.call(this, am),
						(al = []),
						(al = ai.data
							? ai.data
							: this._stack ? this._plotData : this.data),
						(aj =
							ai.gridData ||
							this.renderer.makeGridData.call(this, al, am)),
						this.renderer.drawShadow.call(this, an, aj, ai, am)),
						ah = 0;
					ah < L.jqplot.postDrawSeriesShadowHooks.length;
					ah++
				)
					L.jqplot.postDrawSeriesShadowHooks[ah].call(this, an, ai);
				an = ak = am = ah = al = aj = null;
			}),
			(S.prototype.toggleDisplay = function(ai, ak) {
				var ah, aj;
				(ah = ai.data.series ? ai.data.series : this),
					ai.data.speed && (aj = ai.data.speed),
					aj
						? ah.canvas._elem.is(":hidden") || !ah.show
							? ((ah.show = !0),
								ah.canvas._elem.removeClass("jqplot-series-hidden"),
								ah.shadowCanvas._elem &&
									ah.shadowCanvas._elem.fadeIn(aj),
								ah.canvas._elem.fadeIn(aj, ak),
								ah.canvas._elem
									.nextAll(
										".jqplot-point-label.jqplot-series-" +
											ah.index
									)
									.fadeIn(aj))
							: ((ah.show = !1),
								ah.canvas._elem.addClass("jqplot-series-hidden"),
								ah.shadowCanvas._elem &&
									ah.shadowCanvas._elem.fadeOut(aj),
								ah.canvas._elem.fadeOut(aj, ak),
								ah.canvas._elem
									.nextAll(
										".jqplot-point-label.jqplot-series-" +
											ah.index
									)
									.fadeOut(aj))
						: ah.canvas._elem.is(":hidden") || !ah.show
							? ((ah.show = !0),
								ah.canvas._elem.removeClass("jqplot-series-hidden"),
								ah.shadowCanvas._elem &&
									ah.shadowCanvas._elem.show(),
								ah.canvas._elem.show(0, ak),
								ah.canvas._elem
									.nextAll(
										".jqplot-point-label.jqplot-series-" +
											ah.index
									)
									.show())
							: ((ah.show = !1),
								ah.canvas._elem.addClass("jqplot-series-hidden"),
								ah.shadowCanvas._elem &&
									ah.shadowCanvas._elem.hide(),
								ah.canvas._elem.hide(0, ak),
								ah.canvas._elem
									.nextAll(
										".jqplot-point-label.jqplot-series-" +
											ah.index
									)
									.hide());
			}),
			(M.prototype = new L.jqplot.ElemContainer()),
			(M.prototype.constructor = M),
			(M.prototype.init = function() {
				L.isFunction(this.renderer) &&
					(this.renderer = new this.renderer()),
					this.renderer.init.call(this, this.rendererOptions);
			}),
			(M.prototype.createElement = function(ah, ai) {
				return (
					(this._offsets = ah),
					this.renderer.createElement.call(this, ai)
				);
			}),
			(M.prototype.draw = function() {
				this.renderer.draw.call(this);
			}),
			(L.jqplot.GenericCanvas = function() {
				L.jqplot.ElemContainer.call(this), this._ctx;
			}),
			(L.jqplot.GenericCanvas.prototype = new L.jqplot.ElemContainer()),
			(L.jqplot.GenericCanvas.prototype.constructor =
				L.jqplot.GenericCanvas),
			(L.jqplot.GenericCanvas.prototype.createElement = function(
				al,
				aj,
				ai,
				am
			) {
				this._offsets = al;
				var ah = "jqplot";
				aj != u && (ah = aj);
				var ak;
				return (
					(ak = am.canvasManager.getCanvas()),
					null != ai && (this._plotDimensions = ai),
					(ak.width =
						this._plotDimensions.width -
						this._offsets.left -
						this._offsets.right),
					(ak.height =
						this._plotDimensions.height -
						this._offsets.top -
						this._offsets.bottom),
					(this._elem = L(ak)),
					this._elem.css({
						position: "absolute",
						left: this._offsets.left,
						top: this._offsets.top
					}),
					this._elem.addClass(ah),
					(ak = am.canvasManager.initCanvas(ak)),
					(ak = null),
					this._elem
				);
			}),
			(L.jqplot.GenericCanvas.prototype.setContext = function() {
				return (
					(this._ctx = this._elem.get(0).getContext("2d")), this._ctx
				);
			}),
			(L.jqplot.GenericCanvas.prototype.resetCanvas = function() {
				this._elem &&
					(L.jqplot.use_excanvas &&
						window.G_vmlCanvasManager.uninitElement !== u &&
						window.G_vmlCanvasManager.uninitElement(
							this._elem.get(0)
						),
					this._elem.emptyForce()),
					(this._ctx = null);
			}),
			(L.jqplot.HooksManager = function() {
				(this.hooks = []), (this.args = []);
			}),
			(L.jqplot.HooksManager.prototype.addOnce = function(ak, ai) {
				ai = ai || [];
				for (var al = !1, aj = 0, ah = this.hooks.length; ah > aj; aj++)
					this.hooks[aj] == ak && (al = !0);
				al || (this.hooks.push(ak), this.args.push(ai));
			}),
			(L.jqplot.HooksManager.prototype.add = function(ai, ah) {
				(ah = ah || []), this.hooks.push(ai), this.args.push(ah);
			}),
			(L.jqplot.EventListenerManager = function() {
				this.hooks = [];
			}),
			(L.jqplot.EventListenerManager.prototype.addOnce = function(
				al,
				ak
			) {
				for (
					var aj, ai, am = !1, ai = 0, ah = this.hooks.length;
					ah > ai;
					ai++
				)
					(aj = this.hooks[ai]),
						aj[0] == al && aj[1] == ak && (am = !0);
				am || this.hooks.push([al, ak]);
			}),
			(L.jqplot.EventListenerManager.prototype.add = function(ai, ah) {
				this.hooks.push([ai, ah]);
			});
		var U = [
			"yMidAxis",
			"xaxis",
			"yaxis",
			"x2axis",
			"y2axis",
			"y3axis",
			"y4axis",
			"y5axis",
			"y6axis",
			"y7axis",
			"y8axis",
			"y9axis"
		];
		(L.jqplot.computeHighlightColors = function(ai) {
			var ak;
			if (L.isArray(ai)) {
				ak = [];
				for (var am = 0; am < ai.length; am++) {
					for (
						var al = L.jqplot.getColorComponents(ai[am]),
							ah = [al[0], al[1], al[2]],
							an = ah[0] + ah[1] + ah[2],
							aj = 0;
						3 > aj;
						aj++
					)
						(ah[aj] =
							an > 660 ? 0.85 * ah[aj] : 0.73 * ah[aj] + 90),
							(ah[aj] = parseInt(ah[aj], 10)),
							ah[aj] > 255 ? 255 : ah[aj];
					(ah[3] = 0.3 + 0.35 * al[3]),
						ak.push(
							"rgba(" +
								ah[0] +
								"," +
								ah[1] +
								"," +
								ah[2] +
								"," +
								ah[3] +
								")"
						);
				}
			} else {
				for (
					var al = L.jqplot.getColorComponents(ai),
						ah = [al[0], al[1], al[2]],
						an = ah[0] + ah[1] + ah[2],
						aj = 0;
					3 > aj;
					aj++
				)
					(ah[aj] = an > 660 ? 0.85 * ah[aj] : 0.73 * ah[aj] + 90),
						(ah[aj] = parseInt(ah[aj], 10)),
						ah[aj] > 255 ? 255 : ah[aj];
				(ah[3] = 0.3 + 0.35 * al[3]),
					(ak =
						"rgba(" +
						ah[0] +
						"," +
						ah[1] +
						"," +
						ah[2] +
						"," +
						ah[3] +
						")");
			}
			return ak;
		}),
			(L.jqplot.ColorGenerator = function(ai) {
				ai = ai || L.jqplot.config.defaultColors;
				var ah = 0;
				(this.next = function() {
					return ah < ai.length ? ai[ah++] : ((ah = 0), ai[ah++]);
				}),
					(this.previous = function() {
						return ah > 0
							? ai[ah--]
							: ((ah = ai.length - 1), ai[ah]);
					}),
					(this.get = function(ak) {
						var aj = ak - ai.length * Math.floor(ak / ai.length);
						return ai[aj];
					}),
					(this.setColors = function(aj) {
						ai = aj;
					}),
					(this.reset = function() {
						ah = 0;
					}),
					(this.getIndex = function() {
						return ah;
					}),
					(this.setIndex = function(aj) {
						ah = aj;
					});
			}),
			(L.jqplot.hex2rgb = function(aj, ah) {
				(aj = aj.replace("#", "")),
					3 == aj.length &&
						(aj =
							aj.charAt(0) +
							aj.charAt(0) +
							aj.charAt(1) +
							aj.charAt(1) +
							aj.charAt(2) +
							aj.charAt(2));
				var ai;
				return (
					(ai =
						"rgba(" +
						parseInt(aj.slice(0, 2), 16) +
						", " +
						parseInt(aj.slice(2, 4), 16) +
						", " +
						parseInt(aj.slice(4, 6), 16)),
					ah && (ai += ", " + ah),
					(ai += ")")
				);
			}),
			(L.jqplot.rgb2hex = function(am) {
				for (
					var aj = /rgba?\( *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *(?:, *[0-9.]*)?\)/,
						ah = am.match(aj),
						al = "#",
						ak = 1;
					4 > ak;
					ak++
				) {
					var ai;
					-1 != ah[ak].search(/%/)
						? ((ai = parseInt(255 * ah[ak] / 100, 10).toString(16)),
							1 == ai.length && (ai = "0" + ai))
						: ((ai = parseInt(ah[ak], 10).toString(16)),
							1 == ai.length && (ai = "0" + ai)),
						(al += ai);
				}
				return al;
			}),
			(L.jqplot.normalize2rgb = function(ai, ah) {
				if (-1 != ai.search(/^ *rgba?\(/)) return ai;
				if (-1 != ai.search(/^ *#?[0-9a-fA-F]?[0-9a-fA-F]/))
					return L.jqplot.hex2rgb(ai, ah);
				throw new Error("Invalid color spec");
			}),
			(L.jqplot.getColorComponents = function(am) {
				am = L.jqplot.colorKeywordMap[am] || am;
				for (
					var ak = L.jqplot.normalize2rgb(am),
						aj = /rgba?\( *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *,? *([0-9.]* *)?\)/,
						ah = ak.match(aj),
						ai = [],
						al = 1;
					4 > al;
					al++
				)
					ai[al - 1] =
						-1 != ah[al].search(/%/)
							? parseInt(255 * ah[al] / 100, 10)
							: parseInt(ah[al], 10);
				return (ai[3] = parseFloat(ah[4]) ? parseFloat(ah[4]) : 1), ai;
			}),
			(L.jqplot.colorKeywordMap = {
				aliceblue: "rgb(240, 248, 255)",
				antiquewhite: "rgb(250, 235, 215)",
				aqua: "rgb( 0, 255, 255)",
				aquamarine: "rgb(127, 255, 212)",
				azure: "rgb(240, 255, 255)",
				beige: "rgb(245, 245, 220)",
				bisque: "rgb(255, 228, 196)",
				black: "rgb( 0, 0, 0)",
				blanchedalmond: "rgb(255, 235, 205)",
				blue: "rgb( 0, 0, 255)",
				blueviolet: "rgb(138, 43, 226)",
				brown: "rgb(165, 42, 42)",
				burlywood: "rgb(222, 184, 135)",
				cadetblue: "rgb( 95, 158, 160)",
				chartreuse: "rgb(127, 255, 0)",
				chocolate: "rgb(210, 105, 30)",
				coral: "rgb(255, 127, 80)",
				cornflowerblue: "rgb(100, 149, 237)",
				cornsilk: "rgb(255, 248, 220)",
				crimson: "rgb(220, 20, 60)",
				cyan: "rgb( 0, 255, 255)",
				darkblue: "rgb( 0, 0, 139)",
				darkcyan: "rgb( 0, 139, 139)",
				darkgoldenrod: "rgb(184, 134, 11)",
				darkgray: "rgb(169, 169, 169)",
				darkgreen: "rgb( 0, 100, 0)",
				darkgrey: "rgb(169, 169, 169)",
				darkkhaki: "rgb(189, 183, 107)",
				darkmagenta: "rgb(139, 0, 139)",
				darkolivegreen: "rgb( 85, 107, 47)",
				darkorange: "rgb(255, 140, 0)",
				darkorchid: "rgb(153, 50, 204)",
				darkred: "rgb(139, 0, 0)",
				darksalmon: "rgb(233, 150, 122)",
				darkseagreen: "rgb(143, 188, 143)",
				darkslateblue: "rgb( 72, 61, 139)",
				darkslategray: "rgb( 47, 79, 79)",
				darkslategrey: "rgb( 47, 79, 79)",
				darkturquoise: "rgb( 0, 206, 209)",
				darkviolet: "rgb(148, 0, 211)",
				deeppink: "rgb(255, 20, 147)",
				deepskyblue: "rgb( 0, 191, 255)",
				dimgray: "rgb(105, 105, 105)",
				dimgrey: "rgb(105, 105, 105)",
				dodgerblue: "rgb( 30, 144, 255)",
				firebrick: "rgb(178, 34, 34)",
				floralwhite: "rgb(255, 250, 240)",
				forestgreen: "rgb( 34, 139, 34)",
				fuchsia: "rgb(255, 0, 255)",
				gainsboro: "rgb(220, 220, 220)",
				ghostwhite: "rgb(248, 248, 255)",
				gold: "rgb(255, 215, 0)",
				goldenrod: "rgb(218, 165, 32)",
				gray: "rgb(128, 128, 128)",
				grey: "rgb(128, 128, 128)",
				green: "rgb( 0, 128, 0)",
				greenyellow: "rgb(173, 255, 47)",
				honeydew: "rgb(240, 255, 240)",
				hotpink: "rgb(255, 105, 180)",
				indianred: "rgb(205, 92, 92)",
				indigo: "rgb( 75, 0, 130)",
				ivory: "rgb(255, 255, 240)",
				khaki: "rgb(240, 230, 140)",
				lavender: "rgb(230, 230, 250)",
				lavenderblush: "rgb(255, 240, 245)",
				lawngreen: "rgb(124, 252, 0)",
				lemonchiffon: "rgb(255, 250, 205)",
				lightblue: "rgb(173, 216, 230)",
				lightcoral: "rgb(240, 128, 128)",
				lightcyan: "rgb(224, 255, 255)",
				lightgoldenrodyellow: "rgb(250, 250, 210)",
				lightgray: "rgb(211, 211, 211)",
				lightgreen: "rgb(144, 238, 144)",
				lightgrey: "rgb(211, 211, 211)",
				lightpink: "rgb(255, 182, 193)",
				lightsalmon: "rgb(255, 160, 122)",
				lightseagreen: "rgb( 32, 178, 170)",
				lightskyblue: "rgb(135, 206, 250)",
				lightslategray: "rgb(119, 136, 153)",
				lightslategrey: "rgb(119, 136, 153)",
				lightsteelblue: "rgb(176, 196, 222)",
				lightyellow: "rgb(255, 255, 224)",
				lime: "rgb( 0, 255, 0)",
				limegreen: "rgb( 50, 205, 50)",
				linen: "rgb(250, 240, 230)",
				magenta: "rgb(255, 0, 255)",
				maroon: "rgb(128, 0, 0)",
				mediumaquamarine: "rgb(102, 205, 170)",
				mediumblue: "rgb( 0, 0, 205)",
				mediumorchid: "rgb(186, 85, 211)",
				mediumpurple: "rgb(147, 112, 219)",
				mediumseagreen: "rgb( 60, 179, 113)",
				mediumslateblue: "rgb(123, 104, 238)",
				mediumspringgreen: "rgb( 0, 250, 154)",
				mediumturquoise: "rgb( 72, 209, 204)",
				mediumvioletred: "rgb(199, 21, 133)",
				midnightblue: "rgb( 25, 25, 112)",
				mintcream: "rgb(245, 255, 250)",
				mistyrose: "rgb(255, 228, 225)",
				moccasin: "rgb(255, 228, 181)",
				navajowhite: "rgb(255, 222, 173)",
				navy: "rgb( 0, 0, 128)",
				oldlace: "rgb(253, 245, 230)",
				olive: "rgb(128, 128, 0)",
				olivedrab: "rgb(107, 142, 35)",
				orange: "rgb(255, 165, 0)",
				orangered: "rgb(255, 69, 0)",
				orchid: "rgb(218, 112, 214)",
				palegoldenrod: "rgb(238, 232, 170)",
				palegreen: "rgb(152, 251, 152)",
				paleturquoise: "rgb(175, 238, 238)",
				palevioletred: "rgb(219, 112, 147)",
				papayawhip: "rgb(255, 239, 213)",
				peachpuff: "rgb(255, 218, 185)",
				peru: "rgb(205, 133, 63)",
				pink: "rgb(255, 192, 203)",
				plum: "rgb(221, 160, 221)",
				powderblue: "rgb(176, 224, 230)",
				purple: "rgb(128, 0, 128)",
				red: "rgb(255, 0, 0)",
				rosybrown: "rgb(188, 143, 143)",
				royalblue: "rgb( 65, 105, 225)",
				saddlebrown: "rgb(139, 69, 19)",
				salmon: "rgb(250, 128, 114)",
				sandybrown: "rgb(244, 164, 96)",
				seagreen: "rgb( 46, 139, 87)",
				seashell: "rgb(255, 245, 238)",
				sienna: "rgb(160, 82, 45)",
				silver: "rgb(192, 192, 192)",
				skyblue: "rgb(135, 206, 235)",
				slateblue: "rgb(106, 90, 205)",
				slategray: "rgb(112, 128, 144)",
				slategrey: "rgb(112, 128, 144)",
				snow: "rgb(255, 250, 250)",
				springgreen: "rgb( 0, 255, 127)",
				steelblue: "rgb( 70, 130, 180)",
				tan: "rgb(210, 180, 140)",
				teal: "rgb( 0, 128, 128)",
				thistle: "rgb(216, 191, 216)",
				tomato: "rgb(255, 99, 71)",
				turquoise: "rgb( 64, 224, 208)",
				violet: "rgb(238, 130, 238)",
				wheat: "rgb(245, 222, 179)",
				white: "rgb(255, 255, 255)",
				whitesmoke: "rgb(245, 245, 245)",
				yellow: "rgb(255, 255, 0)",
				yellowgreen: "rgb(154, 205, 50)"
			}),
			(L.jqplot.AxisLabelRenderer = function(ah) {
				L.jqplot.ElemContainer.call(this),
					this.axis,
					(this.show = !0),
					(this.label = ""),
					(this.fontFamily = null),
					(this.fontSize = null),
					(this.textColor = null),
					this._elem,
					(this.escapeHTML = !1),
					L.extend(!0, this, ah);
			}),
			(L.jqplot.AxisLabelRenderer.prototype = new L.jqplot.ElemContainer()),
			(L.jqplot.AxisLabelRenderer.prototype.constructor =
				L.jqplot.AxisLabelRenderer),
			(L.jqplot.AxisLabelRenderer.prototype.init = function(ah) {
				L.extend(!0, this, ah);
			}),
			(L.jqplot.AxisLabelRenderer.prototype.draw = function() {
				return (
					this._elem &&
						(this._elem.emptyForce(), (this._elem = null)),
					(this._elem = L(
						'<div style="position:absolute;" class="jqplot-' +
							this.axis +
							'-label"></div>'
					)),
					Number(this.label) &&
						this._elem.css("white-space", "nowrap"),
					this.escapeHTML
						? this._elem.text(this.label)
						: this._elem.html(this.label),
					this.fontFamily &&
						this._elem.css("font-family", this.fontFamily),
					this.fontSize && this._elem.css("font-size", this.fontSize),
					this.textColor && this._elem.css("color", this.textColor),
					this._elem
				);
			}),
			(L.jqplot.AxisLabelRenderer.prototype.pack = function() {}),
			(L.jqplot.AxisTickRenderer = function(ah) {
				L.jqplot.ElemContainer.call(this),
					(this.mark = "outside"),
					this.axis,
					(this.showMark = !0),
					(this.showGridline = !0),
					(this.isMinorTick = !1),
					(this.size = 4),
					(this.markSize = 6),
					(this.show = !0),
					(this.showLabel = !0),
					(this.label = null),
					(this.value = null),
					(this._styles = {}),
					(this.formatter = L.jqplot.DefaultTickFormatter),
					(this.prefix = ""),
					(this.suffix = ""),
					(this.formatString = ""),
					this.fontFamily,
					this.fontSize,
					this.textColor,
					(this.escapeHTML = !1),
					this._elem,
					(this._breakTick = !1),
					L.extend(!0, this, ah);
			}),
			(L.jqplot.AxisTickRenderer.prototype.init = function(ah) {
				L.extend(!0, this, ah);
			}),
			(L.jqplot.AxisTickRenderer.prototype = new L.jqplot.ElemContainer()),
			(L.jqplot.AxisTickRenderer.prototype.constructor =
				L.jqplot.AxisTickRenderer),
			(L.jqplot.AxisTickRenderer.prototype.setTick = function(
				ah,
				aj,
				ai
			) {
				return (
					(this.value = ah),
					(this.axis = aj),
					ai && (this.isMinorTick = !0),
					this
				);
			}),
			(L.jqplot.AxisTickRenderer.prototype.draw = function() {
				null === this.label &&
					(this.label =
						this.prefix +
						this.formatter(this.formatString, this.value) +
						this.suffix);
				var ai = { position: "absolute" };
				Number(this.label) && (ai.whitSpace = "nowrap"),
					this._elem &&
						(this._elem.emptyForce(), (this._elem = null)),
					(this._elem = L(document.createElement("div"))),
					this._elem.addClass("jqplot-" + this.axis + "-tick"),
					this.escapeHTML
						? this._elem.text(this.label)
						: this._elem.html(this.label),
					this._elem.css(ai);
				for (var ah in this._styles)
					this._elem.css(ah, this._styles[ah]);
				return (
					this.fontFamily &&
						this._elem.css("font-family", this.fontFamily),
					this.fontSize && this._elem.css("font-size", this.fontSize),
					this.textColor && this._elem.css("color", this.textColor),
					this._breakTick && this._elem.addClass("jqplot-breakTick"),
					this._elem
				);
			}),
			(L.jqplot.DefaultTickFormatter = function(ah, ai) {
				return "number" == typeof ai
					? (ah || (ah = L.jqplot.config.defaultTickFormatString),
						L.jqplot.sprintf(ah, ai))
					: String(ai);
			}),
			(L.jqplot.PercentTickFormatter = function(ah, ai) {
				return "number" == typeof ai
					? ((ai = 100 * ai),
						ah || (ah = L.jqplot.config.defaultTickFormatString),
						L.jqplot.sprintf(ah, ai))
					: String(ai);
			}),
			(L.jqplot.AxisTickRenderer.prototype.pack = function() {}),
			(L.jqplot.CanvasGridRenderer = function() {
				this.shadowRenderer = new L.jqplot.ShadowRenderer();
			}),
			(L.jqplot.CanvasGridRenderer.prototype.init = function(ai) {
				this._ctx, L.extend(!0, this, ai);
				var ah = {
					lineJoin: "miter",
					lineCap: "round",
					fill: !1,
					isarc: !1,
					angle: this.shadowAngle,
					offset: this.shadowOffset,
					alpha: this.shadowAlpha,
					depth: this.shadowDepth,
					lineWidth: this.shadowWidth,
					closePath: !1,
					strokeStyle: this.shadowColor
				};
				this.renderer.shadowRenderer.init(ah);
			}),
			(L.jqplot.CanvasGridRenderer.prototype.createElement = function(
				ak
			) {
				var aj;
				this._elem &&
					(L.jqplot.use_excanvas &&
						window.G_vmlCanvasManager.uninitElement !== u &&
						((aj = this._elem.get(0)),
						window.G_vmlCanvasManager.uninitElement(aj),
						(aj = null)),
					this._elem.emptyForce(),
					(this._elem = null)),
					(aj = ak.canvasManager.getCanvas());
				var ah = this._plotDimensions.width,
					ai = this._plotDimensions.height;
				return (
					(aj.width = ah),
					(aj.height = ai),
					(this._elem = L(aj)),
					this._elem.addClass("jqplot-grid-canvas"),
					this._elem.css({ position: "absolute", left: 0, top: 0 }),
					(aj = ak.canvasManager.initCanvas(aj)),
					(this._top = this._offsets.top),
					(this._bottom = ai - this._offsets.bottom),
					(this._left = this._offsets.left),
					(this._right = ah - this._offsets.right),
					(this._width = this._right - this._left),
					(this._height = this._bottom - this._top),
					(aj = null),
					this._elem
				);
			}),
			(L.jqplot.CanvasGridRenderer.prototype.draw = function() {
				function ao(aH, aG, aE, ax, aF) {
					at.save(),
						(aF = aF || {}),
						(null == aF.lineWidth || 0 != aF.lineWidth) &&
							(L.extend(!0, at, aF),
							at.beginPath(),
							at.moveTo(aH, aG),
							at.lineTo(aE, ax),
							at.stroke(),
							at.restore());
				}
				this._ctx = this._elem.get(0).getContext("2d");
				var at = this._ctx,
					aw = this._axes;
				at.save(),
					at.clearRect(
						0,
						0,
						this._plotDimensions.width,
						this._plotDimensions.height
					),
					(at.fillStyle = this.backgroundColor || this.background),
					at.fillRect(
						this._left,
						this._top,
						this._width,
						this._height
					),
					at.save(),
					(at.lineJoin = "miter"),
					(at.lineCap = "butt"),
					(at.lineWidth = this.gridLineWidth),
					(at.strokeStyle = this.gridLineColor);
				for (
					var aA,
						az,
						ap,
						aq,
						am = ["xaxis", "yaxis", "x2axis", "y2axis"],
						ay = 4;
					ay > 0;
					ay--
				) {
					var aD = am[ay - 1],
						ah = aw[aD],
						aB = ah._ticks,
						ar = aB.length;
					if (ah.show) {
						if (ah.drawBaseline) {
							var aC = {};
							switch ((null !== ah.baselineWidth &&
								(aC.lineWidth = ah.baselineWidth),
							null !== ah.baselineColor &&
								(aC.strokeStyle = ah.baselineColor),
							aD)) {
								case "xaxis":
									ao(
										this._left,
										this._bottom,
										this._right,
										this._bottom,
										aC
									);
									break;
								case "yaxis":
									ao(
										this._left,
										this._bottom,
										this._left,
										this._top,
										aC
									);
									break;
								case "x2axis":
									ao(
										this._left,
										this._bottom,
										this._right,
										this._bottom,
										aC
									);
									break;
								case "y2axis":
									ao(
										this._right,
										this._bottom,
										this._right,
										this._top,
										aC
									);
							}
						}
						for (var au = ar; au > 0; au--) {
							var an = aB[au - 1];
							if (an.show) {
								var ak = Math.round(ah.u2p(an.value)) + 0.5;
								switch (aD) {
									case "xaxis":
										if (
											(an.showGridline &&
												this.drawGridlines &&
												((!an.isMinorTick &&
													ah.drawMajorGridlines) ||
													(an.isMinorTick &&
														ah.drawMinorGridlines)) &&
												ao(
													ak,
													this._top,
													ak,
													this._bottom
												),
											an.showMark &&
												an.mark &&
												((!an.isMinorTick &&
													ah.drawMajorTickMarks) ||
													(an.isMinorTick &&
														ah.drawMinorTickMarks)))
										) {
											(ap = an.markSize), (aq = an.mark);
											var ak =
												Math.round(ah.u2p(an.value)) +
												0.5;
											switch (aq) {
												case "outside":
													(aA = this._bottom),
														(az =
															this._bottom + ap);
													break;
												case "inside":
													(aA = this._bottom - ap),
														(az = this._bottom);
													break;
												case "cross":
													(aA = this._bottom - ap),
														(az =
															this._bottom + ap);
													break;
												default:
													(aA = this._bottom),
														(az =
															this._bottom + ap);
											}
											this.shadow &&
												this.renderer.shadowRenderer.draw(
													at,
													[[ak, aA], [ak, az]],
													{
														lineCap: "butt",
														lineWidth: this
															.gridLineWidth,
														offset:
															0.75 *
															this.gridLineWidth,
														depth: 2,
														fill: !1,
														closePath: !1
													}
												),
												ao(ak, aA, ak, az);
										}
										break;
									case "yaxis":
										if (
											(an.showGridline &&
												this.drawGridlines &&
												((!an.isMinorTick &&
													ah.drawMajorGridlines) ||
													(an.isMinorTick &&
														ah.drawMinorGridlines)) &&
												ao(
													this._right,
													ak,
													this._left,
													ak
												),
											an.showMark &&
												an.mark &&
												((!an.isMinorTick &&
													ah.drawMajorTickMarks) ||
													(an.isMinorTick &&
														ah.drawMinorTickMarks)))
										) {
											(ap = an.markSize), (aq = an.mark);
											var ak =
												Math.round(ah.u2p(an.value)) +
												0.5;
											switch (aq) {
												case "outside":
													(aA = this._left - ap),
														(az = this._left);
													break;
												case "inside":
													(aA = this._left),
														(az = this._left + ap);
													break;
												case "cross":
													(aA = this._left - ap),
														(az = this._left + ap);
													break;
												default:
													(aA = this._left - ap),
														(az = this._left);
											}
											this.shadow &&
												this.renderer.shadowRenderer.draw(
													at,
													[[aA, ak], [az, ak]],
													{
														lineCap: "butt",
														lineWidth:
															1.5 *
															this.gridLineWidth,
														offset:
															0.75 *
															this.gridLineWidth,
														fill: !1,
														closePath: !1
													}
												),
												ao(aA, ak, az, ak, {
													strokeStyle: ah.borderColor
												});
										}
										break;
									case "x2axis":
										if (
											(an.showGridline &&
												this.drawGridlines &&
												((!an.isMinorTick &&
													ah.drawMajorGridlines) ||
													(an.isMinorTick &&
														ah.drawMinorGridlines)) &&
												ao(
													ak,
													this._bottom,
													ak,
													this._top
												),
											an.showMark &&
												an.mark &&
												((!an.isMinorTick &&
													ah.drawMajorTickMarks) ||
													(an.isMinorTick &&
														ah.drawMinorTickMarks)))
										) {
											(ap = an.markSize), (aq = an.mark);
											var ak =
												Math.round(ah.u2p(an.value)) +
												0.5;
											switch (aq) {
												case "outside":
													(aA = this._top - ap),
														(az = this._top);
													break;
												case "inside":
													(aA = this._top),
														(az = this._top + ap);
													break;
												case "cross":
													(aA = this._top - ap),
														(az = this._top + ap);
													break;
												default:
													(aA = this._top - ap),
														(az = this._top);
											}
											this.shadow &&
												this.renderer.shadowRenderer.draw(
													at,
													[[ak, aA], [ak, az]],
													{
														lineCap: "butt",
														lineWidth: this
															.gridLineWidth,
														offset:
															0.75 *
															this.gridLineWidth,
														depth: 2,
														fill: !1,
														closePath: !1
													}
												),
												ao(ak, aA, ak, az);
										}
										break;
									case "y2axis":
										if (
											(an.showGridline &&
												this.drawGridlines &&
												((!an.isMinorTick &&
													ah.drawMajorGridlines) ||
													(an.isMinorTick &&
														ah.drawMinorGridlines)) &&
												ao(
													this._left,
													ak,
													this._right,
													ak
												),
											an.showMark &&
												an.mark &&
												((!an.isMinorTick &&
													ah.drawMajorTickMarks) ||
													(an.isMinorTick &&
														ah.drawMinorTickMarks)))
										) {
											(ap = an.markSize), (aq = an.mark);
											var ak =
												Math.round(ah.u2p(an.value)) +
												0.5;
											switch (aq) {
												case "outside":
													(aA = this._right),
														(az = this._right + ap);
													break;
												case "inside":
													(aA = this._right - ap),
														(az = this._right);
													break;
												case "cross":
													(aA = this._right - ap),
														(az = this._right + ap);
													break;
												default:
													(aA = this._right),
														(az = this._right + ap);
											}
											this.shadow &&
												this.renderer.shadowRenderer.draw(
													at,
													[[aA, ak], [az, ak]],
													{
														lineCap: "butt",
														lineWidth:
															1.5 *
															this.gridLineWidth,
														offset:
															0.75 *
															this.gridLineWidth,
														fill: !1,
														closePath: !1
													}
												),
												ao(aA, ak, az, ak, {
													strokeStyle: ah.borderColor
												});
										}
								}
							}
						}
						an = null;
					}
					(ah = null), (aB = null);
				}
				am = [
					"y3axis",
					"y4axis",
					"y5axis",
					"y6axis",
					"y7axis",
					"y8axis",
					"y9axis",
					"yMidAxis"
				];
				for (var ay = 7; ay > 0; ay--) {
					var ah = aw[am[ay - 1]],
						aB = ah._ticks;
					if (ah.show) {
						var ai = aB[ah.numberTicks - 1],
							al = aB[0],
							aj = ah.getLeft(),
							av = [
								[aj, ai.getTop() + ai.getHeight() / 2],
								[aj, al.getTop() + al.getHeight() / 2 + 1]
							];
						this.shadow &&
							this.renderer.shadowRenderer.draw(at, av, {
								lineCap: "butt",
								fill: !1,
								closePath: !1
							}),
							ao(av[0][0], av[0][1], av[1][0], av[1][1], {
								lineCap: "butt",
								strokeStyle: ah.borderColor,
								lineWidth: ah.borderWidth
							});
						for (var au = aB.length; au > 0; au--) {
							var an = aB[au - 1];
							(ap = an.markSize), (aq = an.mark);
							var ak = Math.round(ah.u2p(an.value)) + 0.5;
							if (an.showMark && an.mark) {
								switch (aq) {
									case "outside":
										(aA = aj), (az = aj + ap);
										break;
									case "inside":
										(aA = aj - ap), (az = aj);
										break;
									case "cross":
										(aA = aj - ap), (az = aj + ap);
										break;
									default:
										(aA = aj), (az = aj + ap);
								}
								(av = [[aA, ak], [az, ak]]),
									this.shadow &&
										this.renderer.shadowRenderer.draw(
											at,
											av,
											{
												lineCap: "butt",
												lineWidth:
													1.5 * this.gridLineWidth,
												offset:
													0.75 * this.gridLineWidth,
												fill: !1,
												closePath: !1
											}
										),
									ao(aA, ak, az, ak, {
										strokeStyle: ah.borderColor
									});
							}
							an = null;
						}
						al = null;
					}
					(ah = null), (aB = null);
				}
				if ((at.restore(), this.shadow)) {
					var av = [
						[this._left, this._bottom],
						[this._right, this._bottom],
						[this._right, this._top]
					];
					this.renderer.shadowRenderer.draw(at, av);
				}
				0 != this.borderWidth &&
					this.drawBorder &&
					(ao(this._left, this._top, this._right, this._top, {
						lineCap: "round",
						strokeStyle: aw.x2axis.borderColor,
						lineWidth: aw.x2axis.borderWidth
					}),
					ao(this._right, this._top, this._right, this._bottom, {
						lineCap: "round",
						strokeStyle: aw.y2axis.borderColor,
						lineWidth: aw.y2axis.borderWidth
					}),
					ao(this._right, this._bottom, this._left, this._bottom, {
						lineCap: "round",
						strokeStyle: aw.xaxis.borderColor,
						lineWidth: aw.xaxis.borderWidth
					}),
					ao(this._left, this._bottom, this._left, this._top, {
						lineCap: "round",
						strokeStyle: aw.yaxis.borderColor,
						lineWidth: aw.yaxis.borderWidth
					})),
					at.restore(),
					(at = null),
					(aw = null);
			}),
			(L.jqplot.DivTitleRenderer = function() {}),
			(L.jqplot.DivTitleRenderer.prototype.init = function(ah) {
				L.extend(!0, this, ah);
			}),
			(L.jqplot.DivTitleRenderer.prototype.draw = function() {
				this._elem && (this._elem.emptyForce(), (this._elem = null));
				var aj = (this.renderer, document.createElement("div"));
				if (
					((this._elem = L(aj)),
					this._elem.addClass("jqplot-title"),
					this.text)
				) {
					if (this.text) {
						var ah;
						this.color
							? (ah = this.color)
							: this.textColor && (ah = this.textColor);
						var ai = {
							position: "absolute",
							top: "0px",
							left: "0px"
						};
						this._plotWidth && (ai.width = this._plotWidth + "px"),
							this.fontSize && (ai.fontSize = this.fontSize),
							(ai.textAlign =
								"string" == typeof this.textAlign
									? this.textAlign
									: "center"),
							ah && (ai.color = ah),
							this.paddingBottom &&
								(ai.paddingBottom = this.paddingBottom),
							this.fontFamily &&
								(ai.fontFamily = this.fontFamily),
							this._elem.css(ai),
							this.escapeHtml
								? this._elem.text(this.text)
								: this._elem.html(this.text);
					}
				} else
					(this.show = !1), this._elem.height(0), this._elem.width(0);
				return (aj = null), this._elem;
			}),
			(L.jqplot.DivTitleRenderer.prototype.pack = function() {});
		var r = 0.1;
		(L.jqplot.LinePattern = function(aw, aq) {
			var ap = {
				dotted: [r, L.jqplot.config.dotGapLength],
				dashed: [L.jqplot.config.dashLength, L.jqplot.config.gapLength],
				solid: null
			};
			if ("string" == typeof aq)
				if ("." === aq[0] || "-" === aq[0]) {
					var ax = aq;
					aq = [];
					for (var ao = 0, al = ax.length; al > ao; ao++) {
						if ("." === ax[ao]) aq.push(r);
						else {
							if ("-" !== ax[ao]) continue;
							aq.push(L.jqplot.config.dashLength);
						}
						aq.push(L.jqplot.config.gapLength);
					}
				} else aq = ap[aq];
			if (!aq || !aq.length) return aw;
			var ak = 0,
				ar = aq[0],
				au = 0,
				at = 0,
				an = 0,
				ah = 0,
				av = function(ay, az) {
					aw.moveTo(ay, az),
						(au = ay),
						(at = az),
						(an = ay),
						(ah = az);
				},
				aj = function(ay, aE) {
					var aC = aw.lineWidth,
						aA = ay - au,
						az = aE - at,
						aB = Math.sqrt(aA * aA + az * az);
					if (aB > 0 && aC > 0)
						for (aA /= aB, az /= aB; ; ) {
							var aD = aC * ar;
							if (!(aB > aD)) {
								(au = ay),
									(at = aE),
									0 == (1 & ak)
										? aw.lineTo(au, at)
										: aw.moveTo(au, at),
									(ar -= aB / aC);
								break;
							}
							(au += aD * aA),
								(at += aD * az),
								0 == (1 & ak)
									? aw.lineTo(au, at)
									: aw.moveTo(au, at),
								(aB -= aD),
								ak++,
								ak >= aq.length && (ak = 0),
								(ar = aq[ak]);
						}
				},
				ai = function() {
					aw.beginPath();
				},
				am = function() {
					aj(an, ah);
				};
			return { moveTo: av, lineTo: aj, beginPath: ai, closePath: am };
		}),
			(L.jqplot.LineRenderer = function() {
				(this.shapeRenderer = new L.jqplot.ShapeRenderer()),
					(this.shadowRenderer = new L.jqplot.ShadowRenderer());
			}),
			(L.jqplot.LineRenderer.prototype.init = function(ai, an) {
				(ai = ai || {}),
					(this._type = "line"),
					(this.renderer.animation = {
						show: !1,
						direction: "left",
						speed: 2500,
						_supported: !0
					}),
					(this.renderer.smooth = !1),
					(this.renderer.tension = null),
					(this.renderer.constrainSmoothing = !0),
					(this.renderer._smoothedData = []),
					(this.renderer._smoothedPlotData = []),
					(this.renderer._hiBandGridData = []),
					(this.renderer._lowBandGridData = []),
					(this.renderer._hiBandSmoothedData = []),
					(this.renderer._lowBandSmoothedData = []),
					(this.renderer.bandData = []),
					(this.renderer.bands = {
						show: !1,
						hiData: [],
						lowData: [],
						color: this.color,
						showLines: !1,
						fill: !0,
						fillColor: null,
						_min: null,
						_max: null,
						interval: "3%"
					});
				var al = {
					highlightMouseOver: ai.highlightMouseOver,
					highlightMouseDown: ai.highlightMouseDown,
					highlightColor: ai.highlightColor
				};
				delete ai.highlightMouseOver,
					delete ai.highlightMouseDown,
					delete ai.highlightColor,
					L.extend(!0, this.renderer, ai),
					(this.renderer.options = ai),
					this.renderer.bandData.length > 1 &&
					(!ai.bands || null == ai.bands.show)
						? (this.renderer.bands.show = !0)
						: ai.bands &&
							null == ai.bands.show &&
							null != ai.bands.interval &&
							(this.renderer.bands.show = !0),
					this.fill && (this.renderer.bands.show = !1),
					this.renderer.bands.show &&
						this.renderer.initBands.call(
							this,
							this.renderer.options,
							an
						),
					this._stack && (this.renderer.smooth = !1);
				var am = {
					lineJoin: this.lineJoin,
					lineCap: this.lineCap,
					fill: this.fill,
					isarc: !1,
					strokeStyle: this.color,
					fillStyle: this.fillColor,
					lineWidth: this.lineWidth,
					linePattern: this.linePattern,
					closePath: this.fill
				};
				this.renderer.shapeRenderer.init(am);
				var aj = ai.shadowOffset;
				null == aj &&
					(aj =
						this.lineWidth > 2.5
							? 1.25 *
								(1 +
									0.6 *
										(Math.atan(this.lineWidth / 2.5) /
											0.785398163 -
											1))
							: 1.25 *
								Math.atan(this.lineWidth / 2.5) /
								0.785398163);
				var ah = {
					lineJoin: this.lineJoin,
					lineCap: this.lineCap,
					fill: this.fill,
					isarc: !1,
					angle: this.shadowAngle,
					offset: aj,
					alpha: this.shadowAlpha,
					depth: this.shadowDepth,
					lineWidth: this.lineWidth,
					linePattern: this.linePattern,
					closePath: this.fill
				};
				if (
					(this.renderer.shadowRenderer.init(ah),
					(this._areaPoints = []),
					(this._boundingBox = [[], []]),
					(!this.isTrendline && this.fill) ||
						this.renderer.bands.show)
				) {
					if (
						((this.highlightMouseOver = !0),
						(this.highlightMouseDown = !1),
						(this.highlightColor = null),
						al.highlightMouseDown &&
							null == al.highlightMouseOver &&
							(al.highlightMouseOver = !1),
						L.extend(!0, this, {
							highlightMouseOver: al.highlightMouseOver,
							highlightMouseDown: al.highlightMouseDown,
							highlightColor: al.highlightColor
						}),
						!this.highlightColor)
					) {
						var ak = this.renderer.bands.show
							? this.renderer.bands.fillColor
							: this.fillColor;
						this.highlightColor = L.jqplot.computeHighlightColors(
							ak
						);
					}
					this.highlighter && (this.highlighter.show = !1);
				}
				!this.isTrendline &&
					an &&
					((an.plugins.lineRenderer = {}),
					an.postInitHooks.addOnce(z),
					an.postDrawHooks.addOnce(af),
					an.eventListenerHooks.addOnce("jqplotMouseMove", h),
					an.eventListenerHooks.addOnce("jqplotMouseDown", e),
					an.eventListenerHooks.addOnce("jqplotMouseUp", ad),
					an.eventListenerHooks.addOnce("jqplotClick", g),
					an.eventListenerHooks.addOnce("jqplotRightClick", s));
			}),
			(L.jqplot.LineRenderer.prototype.initBands = function(ak) {
				var al = ak.bandData || [],
					an = this.renderer.bands;
				(an.hiData = []), (an.lowData = []);
				var aB = this.data;
				if (((an._max = null), (an._min = null), 2 == al.length))
					if (L.isArray(al[0][0])) {
						for (
							var ao, ah = 0, ar = 0, aw = 0, at = al[0].length;
							at > aw;
							aw++
						)
							(ao = al[0][aw]),
								((null != ao[1] && ao[1] > an._max) ||
									null == an._max) &&
									(an._max = ao[1]),
								((null != ao[1] && ao[1] < an._min) ||
									null == an._min) &&
									(an._min = ao[1]);
						for (var aw = 0, at = al[1].length; at > aw; aw++)
							(ao = al[1][aw]),
								((null != ao[1] && ao[1] > an._max) ||
									null == an._max) &&
									((an._max = ao[1]), (ar = 1)),
								((null != ao[1] && ao[1] < an._min) ||
									null == an._min) &&
									((an._min = ao[1]), (ah = 1));
						ar === ah && (an.show = !1),
							(an.hiData = al[ar]),
							(an.lowData = al[ah]);
					} else if (
						al[0].length === aB.length &&
						al[1].length === aB.length
					)
						for (
							var aj = al[0][0] > al[1][0] ? 0 : 1,
								aC = aj ? 0 : 1,
								aw = 0,
								at = aB.length;
							at > aw;
							aw++
						)
							an.hiData.push([aB[aw][0], al[aj][aw]]),
								an.lowData.push([aB[aw][0], al[aC][aw]]);
					else an.show = !1;
				else if (al.length > 2 && !L.isArray(al[0][0]))
					for (
						var aj = al[0][0] > al[0][1] ? 0 : 1,
							aC = aj ? 0 : 1,
							aw = 0,
							at = al.length;
						at > aw;
						aw++
					)
						an.hiData.push([aB[aw][0], al[aw][aj]]),
							an.lowData.push([aB[aw][0], al[aw][aC]]);
				else {
					var aq = an.interval,
						aA = null,
						az = null,
						ai = null,
						au = null;
					if (
						(L.isArray(aq)
							? ((aA = aq[0]), (az = aq[1]))
							: (aA = aq),
						isNaN(aA)
							? "%" === aA.charAt(aA.length - 1) &&
								((ai = "multiply"),
								(aA = parseFloat(aA) / 100 + 1))
							: ((aA = parseFloat(aA)), (ai = "add")),
						null !== az && isNaN(az)
							? "%" === az.charAt(az.length - 1) &&
								((au = "multiply"),
								(az = parseFloat(az) / 100 + 1))
							: null !== az &&
								((az = parseFloat(az)), (au = "add")),
						null !== aA)
					) {
						if (
							(null === az &&
								((az = -aA),
								(au = ai),
								"multiply" === au && (az += 2)),
							az > aA)
						) {
							var ax = aA;
							(aA = az),
								(az = ax),
								(ax = ai),
								(ai = au),
								(au = ax);
						}
						for (var aw = 0, at = aB.length; at > aw; aw++) {
							switch (ai) {
								case "add":
									an.hiData.push([aB[aw][0], aB[aw][1] + aA]);
									break;
								case "multiply":
									an.hiData.push([aB[aw][0], aB[aw][1] * aA]);
							}
							switch (au) {
								case "add":
									an.lowData.push([
										aB[aw][0],
										aB[aw][1] + az
									]);
									break;
								case "multiply":
									an.lowData.push([
										aB[aw][0],
										aB[aw][1] * az
									]);
							}
						}
					} else an.show = !1;
				}
				for (
					var am = an.hiData, ap = an.lowData, aw = 0, at = am.length;
					at > aw;
					aw++
				)
					((null != am[aw][1] && am[aw][1] > an._max) ||
						null == an._max) &&
						(an._max = am[aw][1]);
				for (var aw = 0, at = ap.length; at > aw; aw++)
					((null != ap[aw][1] && ap[aw][1] < an._min) ||
						null == an._min) &&
						(an._min = ap[aw][1]);
				if (null === an.fillColor) {
					var ay = L.jqplot.getColorComponents(an.color);
					(ay[3] = 0.5 * ay[3]),
						(an.fillColor =
							"rgba(" +
							ay[0] +
							", " +
							ay[1] +
							", " +
							ay[2] +
							", " +
							ay[3] +
							")");
				}
			}),
			(L.jqplot.LineRenderer.prototype.setGridData = function() {
				var al = this._xaxis.series_u2p,
					ah = this._yaxis.series_u2p,
					am = this._plotData,
					aq = this._prevPlotData;
				(this.gridData = []),
					(this._prevGridData = []),
					(this.renderer._smoothedData = []),
					(this.renderer._smoothedPlotData = []),
					(this.renderer._hiBandGridData = []),
					(this.renderer._lowBandGridData = []),
					(this.renderer._hiBandSmoothedData = []),
					(this.renderer._lowBandSmoothedData = []);
				for (
					var ak = this.renderer.bands,
						ai = !1,
						an = 0,
						aj = am.length;
					aj > an;
					an++
				)
					null != am[an][0] && null != am[an][1]
						? this.gridData.push([
								al.call(this._xaxis, am[an][0]),
								ah.call(this._yaxis, am[an][1])
							])
						: null == am[an][0]
							? ((ai = !0),
								this.gridData.push([
									null,
									ah.call(this._yaxis, am[an][1])
								]))
							: null == am[an][1] &&
								((ai = !0),
								this.gridData.push([
									al.call(this._xaxis, am[an][0]),
									null
								])),
						null != aq[an] && null != aq[an][0] && null != aq[an][1]
							? this._prevGridData.push([
									al.call(this._xaxis, aq[an][0]),
									ah.call(this._yaxis, aq[an][1])
								])
							: null != aq[an] && null == aq[an][0]
								? this._prevGridData.push([
										null,
										ah.call(this._yaxis, aq[an][1])
									])
								: null != aq[an] &&
									null != aq[an][0] &&
									null == aq[an][1] &&
									this._prevGridData.push([
										al.call(this._xaxis, aq[an][0]),
										null
									]);
				if (
					(ai &&
						((this.renderer.smooth = !1),
						"line" === this._type && (ak.show = !1)),
					"line" === this._type && ak.show)
				) {
					for (var an = 0, aj = ak.hiData.length; aj > an; an++)
						this.renderer._hiBandGridData.push([
							al.call(this._xaxis, ak.hiData[an][0]),
							ah.call(this._yaxis, ak.hiData[an][1])
						]);
					for (var an = 0, aj = ak.lowData.length; aj > an; an++)
						this.renderer._lowBandGridData.push([
							al.call(this._xaxis, ak.lowData[an][0]),
							ah.call(this._yaxis, ak.lowData[an][1])
						]);
				}
				if (
					"line" === this._type &&
					this.renderer.smooth &&
					this.gridData.length > 2
				) {
					var ao;
					this.renderer.constrainSmoothing
						? ((ao = J.call(this, this.gridData)),
							(this.renderer._smoothedData = ao[0]),
							(this.renderer._smoothedPlotData = ao[1]),
							ak.show &&
								((ao = J.call(
									this,
									this.renderer._hiBandGridData
								)),
								(this.renderer._hiBandSmoothedData = ao[0]),
								(ao = J.call(
									this,
									this.renderer._lowBandGridData
								)),
								(this.renderer._lowBandSmoothedData = ao[0])),
							(ao = null))
						: ((ao = F.call(this, this.gridData)),
							(this.renderer._smoothedData = ao[0]),
							(this.renderer._smoothedPlotData = ao[1]),
							ak.show &&
								((ao = F.call(
									this,
									this.renderer._hiBandGridData
								)),
								(this.renderer._hiBandSmoothedData = ao[0]),
								(ao = F.call(
									this,
									this.renderer._lowBandGridData
								)),
								(this.renderer._lowBandSmoothedData = ao[0])),
							(ao = null));
				}
			}),
			(L.jqplot.LineRenderer.prototype.makeGridData = function(ao) {
				var am = this._xaxis.series_u2p,
					ah = this._yaxis.series_u2p,
					ar = [];
				(this.renderer._smoothedData = []),
					(this.renderer._smoothedPlotData = []),
					(this.renderer._hiBandGridData = []),
					(this.renderer._lowBandGridData = []),
					(this.renderer._hiBandSmoothedData = []),
					(this.renderer._lowBandSmoothedData = []);
				for (
					var al = this.renderer.bands, ai = !1, an = 0;
					an < ao.length;
					an++
				)
					null != ao[an][0] && null != ao[an][1]
						? ar.push([
								am.call(this._xaxis, ao[an][0]),
								ah.call(this._yaxis, ao[an][1])
							])
						: null == ao[an][0]
							? ((ai = !0),
								ar.push([null, ah.call(this._yaxis, ao[an][1])]))
							: null == ao[an][1] &&
								((ai = !0),
								ar.push([am.call(this._xaxis, ao[an][0]), null]));
				if (
					(ai &&
						((this.renderer.smooth = !1),
						"line" === this._type && (al.show = !1)),
					"line" === this._type && al.show)
				) {
					for (var an = 0, ak = al.hiData.length; ak > an; an++)
						this.renderer._hiBandGridData.push([
							am.call(this._xaxis, al.hiData[an][0]),
							ah.call(this._yaxis, al.hiData[an][1])
						]);
					for (var an = 0, ak = al.lowData.length; ak > an; an++)
						this.renderer._lowBandGridData.push([
							am.call(this._xaxis, al.lowData[an][0]),
							ah.call(this._yaxis, al.lowData[an][1])
						]);
				}
				if (
					"line" === this._type &&
					this.renderer.smooth &&
					ar.length > 2
				) {
					var ap;
					this.renderer.constrainSmoothing
						? ((ap = J.call(this, ar)),
							(this.renderer._smoothedData = ap[0]),
							(this.renderer._smoothedPlotData = ap[1]),
							al.show &&
								((ap = J.call(
									this,
									this.renderer._hiBandGridData
								)),
								(this.renderer._hiBandSmoothedData = ap[0]),
								(ap = J.call(
									this,
									this.renderer._lowBandGridData
								)),
								(this.renderer._lowBandSmoothedData = ap[0])),
							(ap = null))
						: ((ap = F.call(this, ar)),
							(this.renderer._smoothedData = ap[0]),
							(this.renderer._smoothedPlotData = ap[1]),
							al.show &&
								((ap = F.call(
									this,
									this.renderer._hiBandGridData
								)),
								(this.renderer._hiBandSmoothedData = ap[0]),
								(ap = F.call(
									this,
									this.renderer._lowBandGridData
								)),
								(this.renderer._lowBandSmoothedData = ap[0])),
							(ap = null));
				}
				return ar;
			}),
			(L.jqplot.LineRenderer.prototype.draw = function(ax, aI, ai) {
				var aC,
					ar,
					ay,
					av,
					aE,
					aq = L.extend(!0, {}, ai),
					ak = aq.shadow != u ? aq.shadow : this.shadow,
					aJ = aq.showLine != u ? aq.showLine : this.showLine,
					aA = aq.fill != u ? aq.fill : this.fill,
					ah =
						aq.fillAndStroke != u
							? aq.fillAndStroke
							: this.fillAndStroke;
				if ((ax.save(), aI.length)) {
					if (aJ)
						if (aA) {
							if (this.fillToZero) {
								var aF = this.negativeColor;
								this.useNegativeColors || (aF = aq.fillStyle);
								var ao = !1,
									ap = aq.fillStyle;
								if (ah) var aH = aI.slice(0);
								if (0 != this.index && this._stack) {
									for (
										var au = this._prevGridData,
											aC = au.length;
										aC > 0;
										aC--
									)
										aI.push(au[aC - 1]);
									ak &&
										this.renderer.shadowRenderer.draw(
											ax,
											aI,
											aq
										),
										(this._areaPoints = aI),
										this.renderer.shapeRenderer.draw(
											ax,
											aI,
											aq
										);
								} else {
									var aw = [],
										aL = this.renderer.smooth
											? this.renderer._smoothedPlotData
											: this._plotData;
									this._areaPoints = [];
									{
										var aG = this._yaxis.series_u2p(
											this.fillToValue
										);
										this._xaxis.series_u2p(
											this.fillToValue
										);
									}
									if (
										((aq.closePath = !0),
										"y" == this.fillAxis)
									) {
										aw.push([aI[0][0], aG]),
											this._areaPoints.push([
												aI[0][0],
												aG
											]);
										for (
											var aC = 0;
											aC < aI.length - 1;
											aC++
										)
											if (
												(aw.push(aI[aC]),
												this._areaPoints.push(aI[aC]),
												aL[aC][1] * aL[aC + 1][1] <= 0)
											) {
												aL[aC][1] < 0
													? ((ao = !0),
														(aq.fillStyle = aF))
													: ((ao = !1),
														(aq.fillStyle = ap));
												var an =
													aI[aC][0] +
													(aI[aC + 1][0] -
														aI[aC][0]) *
														(aG - aI[aC][1]) /
														(aI[aC + 1][1] -
															aI[aC][1]);
												aw.push([an, aG]),
													this._areaPoints.push([
														an,
														aG
													]),
													ak &&
														this.renderer.shadowRenderer.draw(
															ax,
															aw,
															aq
														),
													this.renderer.shapeRenderer.draw(
														ax,
														aw,
														aq
													),
													(aw = [[an, aG]]);
											}
										aL[aI.length - 1][1] < 0
											? ((ao = !0), (aq.fillStyle = aF))
											: ((ao = !1), (aq.fillStyle = ap)),
											aw.push(aI[aI.length - 1]),
											this._areaPoints.push(
												aI[aI.length - 1]
											),
											aw.push([aI[aI.length - 1][0], aG]),
											this._areaPoints.push([
												aI[aI.length - 1][0],
												aG
											]);
									}
									ak &&
										this.renderer.shadowRenderer.draw(
											ax,
											aw,
											aq
										),
										this.renderer.shapeRenderer.draw(
											ax,
											aw,
											aq
										);
								}
							} else {
								if (ah) var aH = aI.slice(0);
								if (0 != this.index && this._stack)
									for (
										var au = this._prevGridData,
											aC = au.length;
										aC > 0;
										aC--
									)
										aI.push(au[aC - 1]);
								else {
									var al = ax.canvas.height;
									aI.unshift([aI[0][0], al]);
									var aD = aI.length;
									aI.push([aI[aD - 1][0], al]);
								}
								(this._areaPoints = aI),
									ak &&
										this.renderer.shadowRenderer.draw(
											ax,
											aI,
											aq
										),
									this.renderer.shapeRenderer.draw(
										ax,
										aI,
										aq
									);
							}
							if (ah) {
								var az = L.extend(!0, {}, aq, {
									fill: !1,
									closePath: !1
								});
								if (
									(this.renderer.shapeRenderer.draw(
										ax,
										aH,
										az
									),
									this.markerRenderer.show)
								)
									for (
										this.renderer.smooth &&
											(aH = this.gridData),
											aC = 0;
										aC < aH.length;
										aC++
									)
										this.markerRenderer.draw(
											aH[aC][0],
											aH[aC][1],
											ax,
											aq.markerOptions
										);
							}
						} else {
							if (this.renderer.bands.show) {
								var am,
									aK = L.extend(!0, {}, aq);
								this.renderer.bands.showLines &&
									((am = this.renderer.smooth
										? this.renderer._hiBandSmoothedData
										: this.renderer._hiBandGridData),
									this.renderer.shapeRenderer.draw(
										ax,
										am,
										aq
									),
									(am = this.renderer.smooth
										? this.renderer._lowBandSmoothedData
										: this.renderer._lowBandGridData),
									this.renderer.shapeRenderer.draw(
										ax,
										am,
										aK
									)),
									this.renderer.bands.fill &&
										((am = this.renderer.smooth
											? this.renderer._hiBandSmoothedData.concat(
													this.renderer._lowBandSmoothedData.reverse()
												)
											: this.renderer._hiBandGridData.concat(
													this.renderer._lowBandGridData.reverse()
												)),
										(this._areaPoints = am),
										(aK.closePath = !0),
										(aK.fill = !0),
										(aK.fillStyle = this.renderer.bands.fillColor),
										this.renderer.shapeRenderer.draw(
											ax,
											am,
											aK
										));
							}
							ak && this.renderer.shadowRenderer.draw(ax, aI, aq),
								this.renderer.shapeRenderer.draw(ax, aI, aq);
						}
					var ar = (av = ay = aE = null);
					for (aC = 0; aC < this._areaPoints.length; aC++) {
						var at = this._areaPoints[aC];
						(ar > at[0] || null == ar) && (ar = at[0]),
							(aE < at[1] || null == aE) && (aE = at[1]),
							(av < at[0] || null == av) && (av = at[0]),
							(ay > at[1] || null == ay) && (ay = at[1]);
					}
					if (
						("line" === this.type &&
							this.renderer.bands.show &&
							((aE = this._yaxis.series_u2p(
								this.renderer.bands._min
							)),
							(ay = this._yaxis.series_u2p(
								this.renderer.bands._max
							))),
						(this._boundingBox = [[ar, aE], [av, ay]]),
						this.markerRenderer.show && !aA)
					)
						for (
							this.renderer.smooth && (aI = this.gridData),
								aC = 0;
							aC < aI.length;
							aC++
						)
							null != aI[aC][0] &&
								null != aI[aC][1] &&
								this.markerRenderer.draw(
									aI[aC][0],
									aI[aC][1],
									ax,
									aq.markerOptions
								);
				}
				ax.restore();
			}),
			(L.jqplot.LineRenderer.prototype.drawShadow = function() {}),
			(L.jqplot.LinearAxisRenderer = function() {}),
			(L.jqplot.LinearAxisRenderer.prototype.init = function(ah) {
				(this.breakPoints = null),
					(this.breakTickLabel = "&asymp;"),
					(this.drawBaseline = !0),
					(this.baselineWidth = null),
					(this.baselineColor = null),
					(this.forceTickAt0 = !1),
					(this.forceTickAt100 = !1),
					(this.tickInset = 0),
					(this.minorTicks = 0),
					(this.alignTicks = !1),
					(this._autoFormatString = ""),
					(this._overrideFormatString = !1),
					(this._scalefact = 1),
					L.extend(!0, this, ah),
					this.breakPoints &&
						(L.isArray(this.breakPoints)
							? (this.breakPoints.length < 2 ||
									this.breakPoints[1] <= this.breakPoints[0]) &&
								(this.breakPoints = null)
							: (this.breakPoints = null)),
					null != this.numberTicks &&
						this.numberTicks < 2 &&
						(this.numberTicks = 2),
					this.resetDataBounds();
			}),
			(L.jqplot.LinearAxisRenderer.prototype.draw = function(ah, ao) {
				if (this.show) {
					this.renderer.createTicks.call(this, ao);
					if (
						(this._elem &&
							(this._elem.emptyForce(), (this._elem = null)),
						(this._elem = L(document.createElement("div"))),
						this._elem.addClass("jqplot-axis jqplot-" + this.name),
						this._elem.css("position", "absolute"),
						"xaxis" == this.name || "x2axis" == this.name
							? this._elem.width(this._plotDimensions.width)
							: this._elem.height(this._plotDimensions.height),
						(this.labelOptions.axis = this.name),
						(this._label = new this.labelRenderer(
							this.labelOptions
						)),
						this._label.show)
					) {
						var am = this._label.draw(ah, ao);
						am.appendTo(this._elem), (am = null);
					}
					for (var ak, al = this._ticks, aj = 0; aj < al.length; aj++)
						(ak = al[aj]),
							ak.show &&
								ak.showLabel &&
								(!ak.isMinorTick || this.showMinorTicks) &&
								this._elem.append(ak.draw(ah, ao));
					(ak = null), (al = null);
				}
				return this._elem;
			}),
			(L.jqplot.LinearAxisRenderer.prototype.reset = function() {
				(this.min = this._options.min),
					(this.max = this._options.max),
					(this.tickInterval = this._options.tickInterval),
					(this.numberTicks = this._options.numberTicks),
					(this._autoFormatString = ""),
					this._overrideFormatString &&
						this.tickOptions &&
						this.tickOptions.formatString &&
						(this.tickOptions.formatString = "");
			}),
			(L.jqplot.LinearAxisRenderer.prototype.set = function() {
				var aj,
					ao = 0,
					ai = 0,
					an = 0,
					ah = null == this._label ? !1 : this._label.show;
				if (this.show) {
					for (var al, am = this._ticks, ak = 0; ak < am.length; ak++)
						(al = am[ak]),
							al._breakTick ||
								!al.show ||
								!al.showLabel ||
								(al.isMinorTick && !this.showMinorTicks) ||
								((aj =
									"xaxis" == this.name ||
									"x2axis" == this.name
										? al._elem.outerHeight(!0)
										: al._elem.outerWidth(!0)),
								aj > ao && (ao = aj));
					(al = null),
						(am = null),
						ah &&
							((ai = this._label._elem.outerWidth(!0)),
							(an = this._label._elem.outerHeight(!0))),
						"xaxis" == this.name
							? ((ao += an),
								this._elem.css({
									height: ao + "px",
									left: "0px",
									bottom: "0px"
								}))
							: "x2axis" == this.name
								? ((ao += an),
									this._elem.css({
										height: ao + "px",
										left: "0px",
										top: "0px"
									}))
								: "yaxis" == this.name
									? ((ao += ai),
										this._elem.css({
											width: ao + "px",
											left: "0px",
											top: "0px"
										}),
										ah &&
											this._label.constructor ==
												L.jqplot.AxisLabelRenderer &&
											this._label._elem.css("width", ai + "px"))
									: ((ao += ai),
										this._elem.css({
											width: ao + "px",
											right: "0px",
											top: "0px"
										}),
										ah &&
											this._label.constructor ==
												L.jqplot.AxisLabelRenderer &&
											this._label._elem.css(
												"width",
												ai + "px"
											));
				}
			}),
			(L.jqplot.LinearAxisRenderer.prototype.createTicks = function(aj) {
				var a6,
					aI,
					a4,
					a0,
					aT = this._ticks,
					aK = this.ticks,
					az = this.name,
					aB = this._dataBounds,
					ah =
						"x" === this.name.charAt(0)
							? this._plotDimensions.width
							: this._plotDimensions.height,
					aH = this.min,
					a5 = this.max,
					aW = this.numberTicks,
					ba = this.tickInterval,
					am = 30;
				if (
					((this._scalefact = (Math.max(ah, am + 1) - am) / 300),
					aK.length)
				) {
					for (a0 = 0; a0 < aK.length; a0++) {
						var aO = aK[a0],
							aU = new this.tickRenderer(this.tickOptions);
						L.isArray(aO)
							? ((aU.value = aO[0]),
								this.breakPoints
									? aO[0] == this.breakPoints[0]
										? ((aU.label = this.breakTickLabel),
											(aU._breakTick = !0),
											(aU.showGridline = !1),
											(aU.showMark = !1))
										: aO[0] > this.breakPoints[0] &&
											aO[0] <= this.breakPoints[1]
											? ((aU.show = !1),
												(aU.showGridline = !1),
												(aU.label = aO[1]))
											: (aU.label = aO[1])
									: (aU.label = aO[1]),
								aU.setTick(aO[0], this.name),
								this._ticks.push(aU))
							: L.isPlainObject(aO)
								? (L.extend(!0, aU, aO),
									(aU.axis = this.name),
									this._ticks.push(aU))
								: ((aU.value = aO),
									this.breakPoints &&
										(aO == this.breakPoints[0]
											? ((aU.label = this.breakTickLabel),
												(aU._breakTick = !0),
												(aU.showGridline = !1),
												(aU.showMark = !1))
											: aO > this.breakPoints[0] &&
												aO <= this.breakPoints[1] &&
												((aU.show = !1),
												(aU.showGridline = !1))),
									aU.setTick(aO, this.name),
									this._ticks.push(aU));
					}
					(this.numberTicks = aK.length),
						(this.min = this._ticks[0].value),
						(this.max = this._ticks[this.numberTicks - 1].value),
						(this.tickInterval =
							(this.max - this.min) / (this.numberTicks - 1));
				} else {
					ah =
						"xaxis" == az || "x2axis" == az
							? this._plotDimensions.width
							: this._plotDimensions.height;
					var ax = this.numberTicks;
					this.alignTicks &&
						("x2axis" === this.name && aj.axes.xaxis.show
							? (ax = aj.axes.xaxis.numberTicks)
							: "y" === this.name.charAt(0) &&
								"yaxis" !== this.name &&
								"yMidAxis" !== this.name &&
								aj.axes.yaxis.show &&
								(ax = aj.axes.yaxis.numberTicks)),
						(a6 = null != this.min ? this.min : aB.min),
						(aI = null != this.max ? this.max : aB.max);
					var aS,
						ay,
						at,
						av = aI - a6;
					if (
						((null != this.tickOptions &&
							this.tickOptions.formatString) ||
							(this._overrideFormatString = !0),
						null == this.min ||
							(null == this.max &&
								null == this.tickInterval &&
								!this.autoscale))
					) {
						this.forceTickAt0 &&
							(a6 > 0 && (a6 = 0), 0 > aI && (aI = 0)),
							this.forceTickAt100 &&
								(a6 > 100 && (a6 = 100),
								100 > aI && (aI = 100));
						var aE = !1,
							a1 = !1;
						null != this.min
							? (aE = !0)
							: null != this.max && (a1 = !0);
						var aP = L.jqplot.LinearTickGenerator(
								a6,
								aI,
								this._scalefact,
								ax,
								aE,
								a1
							),
							aw =
								null != this.min
									? a6
									: a6 + av * (this.padMin - 1),
							aQ =
								null != this.max
									? aI
									: aI - av * (this.padMax - 1);
						(aw > a6 || aI > aQ) &&
							((aw =
								null != this.min
									? a6
									: a6 - av * (this.padMin - 1)),
							(aQ =
								null != this.max
									? aI
									: aI + av * (this.padMax - 1)),
							(aP = L.jqplot.LinearTickGenerator(
								aw,
								aQ,
								this._scalefact,
								ax,
								aE,
								a1
							))),
							(this.min = aP[0]),
							(this.max = aP[1]),
							(this.numberTicks = aP[2]),
							(this._autoFormatString = aP[3]),
							(this.tickInterval = aP[4]);
					} else {
						if (a6 == aI) {
							var ai = 0.05;
							a6 > 0 &&
								(ai = Math.max(Math.log(a6) / Math.LN10, 0.05)),
								(a6 -= ai),
								(aI += ai);
						}
						if (
							this.autoscale &&
							null == this.min &&
							null == this.max
						) {
							for (
								var ak, al, ar, aC = !1, aN = !1, a0 = 0;
								a0 < this._series.length;
								a0++
							) {
								var aV = this._series[a0],
									aD =
										"x" == aV.fillAxis
											? aV._xaxis.name
											: aV._yaxis.name;
								if (this.name == aD) {
									for (
										var aR = aV._plotValues[aV.fillAxis],
											aG = aR[0],
											a2 = aR[0],
											aZ = 1;
										aZ < aR.length;
										aZ++
									)
										aR[aZ] < aG
											? (aG = aR[aZ])
											: aR[aZ] > a2 && (a2 = aR[aZ]);
									var au = (a2 - aG) / a2;
									aV.renderer.constructor ==
									L.jqplot.BarRenderer
										? aG >= 0 && (aV.fillToZero || au > 0.1)
											? (aC = !0)
											: ((aC = !1),
												(aN =
													aV.fill &&
													aV.fillToZero &&
													0 > aG &&
													a2 > 0
														? !0
														: !1))
										: aV.fill
											? aG >= 0 &&
												(aV.fillToZero || au > 0.1)
												? (aC = !0)
												: 0 > aG && a2 > 0 && aV.fillToZero
													? ((aC = !1), (aN = !0))
													: ((aC = !1), (aN = !1))
											: 0 > aG && (aC = !1);
								}
							}
							if (aC)
								(this.numberTicks =
									2 +
									Math.ceil(
										(ah - (this.tickSpacing - 1)) /
											this.tickSpacing
									)),
									(this.min = 0),
									(aH = 0),
									(al = aI / (this.numberTicks - 1)),
									(at = Math.pow(
										10,
										Math.abs(
											Math.floor(Math.log(al) / Math.LN10)
										)
									)),
									al / at == parseInt(al / at, 10) &&
										(al += at),
									(this.tickInterval =
										Math.ceil(al / at) * at),
									(this.max =
										this.tickInterval *
										(this.numberTicks - 1));
							else if (aN) {
								this.numberTicks =
									2 +
									Math.ceil(
										(ah - (this.tickSpacing - 1)) /
											this.tickSpacing
									);
								var aJ = Math.ceil(
										Math.abs(a6) /
											av *
											(this.numberTicks - 1)
									),
									a9 = this.numberTicks - 1 - aJ;
								(al = Math.max(
									Math.abs(a6 / aJ),
									Math.abs(aI / a9)
								)),
									(at = Math.pow(
										10,
										Math.abs(
											Math.floor(Math.log(al) / Math.LN10)
										)
									)),
									(this.tickInterval =
										Math.ceil(al / at) * at),
									(this.max = this.tickInterval * a9),
									(this.min = -this.tickInterval * aJ);
							} else
								null == this.numberTicks &&
									(this.numberTicks = this.tickInterval
										? 3 + Math.ceil(av / this.tickInterval)
										: 2 +
											Math.ceil(
												(ah - (this.tickSpacing - 1)) /
													this.tickSpacing
											)),
									null == this.tickInterval
										? ((al = av / (this.numberTicks - 1)),
											(at =
												1 > al
													? Math.pow(
															10,
															Math.abs(
																Math.floor(
																	Math.log(al) /
																		Math.LN10
																)
															)
														)
													: 1),
											(this.tickInterval =
												Math.ceil(al * at * this.pad) /
												at))
										: (at = 1 / this.tickInterval),
									(ak =
										this.tickInterval *
										(this.numberTicks - 1)),
									(ar = (ak - av) / 2),
									null == this.min &&
										(this.min =
											Math.floor(at * (a6 - ar)) / at),
									null == this.max &&
										(this.max = this.min + ak);
							var aM,
								aF = L.jqplot.getSignificantFigures(
									this.tickInterval
								);
							if (aF.digitsLeft >= aF.significantDigits)
								aM = "%d";
							else {
								var at = Math.max(0, 5 - aF.digitsLeft);
								(at = Math.min(at, aF.digitsRight)),
									(aM = "%." + at + "f");
							}
							this._autoFormatString = aM;
						} else {
							(aS =
								null != this.min
									? this.min
									: a6 - av * (this.padMin - 1)),
								(ay =
									null != this.max
										? this.max
										: aI + av * (this.padMax - 1)),
								(av = ay - aS),
								null == this.numberTicks &&
									(this.numberTicks =
										null != this.tickInterval
											? Math.ceil(
													(ay - aS) / this.tickInterval
												) + 1
											: ah > 100
												? parseInt(
														3 + (ah - 100) / 75,
														10
													)
												: 2),
								null == this.tickInterval &&
									(this.tickInterval =
										av / (this.numberTicks - 1)),
								null == this.max &&
									(ay =
										aS +
										this.tickInterval *
											(this.numberTicks - 1)),
								null == this.min &&
									(aS =
										ay -
										this.tickInterval *
											(this.numberTicks - 1));
							var aM,
								aF = L.jqplot.getSignificantFigures(
									this.tickInterval
								);
							if (aF.digitsLeft >= aF.significantDigits)
								aM = "%d";
							else {
								var at = Math.max(0, 5 - aF.digitsLeft);
								(at = Math.min(at, aF.digitsRight)),
									(aM = "%." + at + "f");
							}
							(this._autoFormatString = aM),
								(this.min = aS),
								(this.max = ay);
						}
						if (
							this.renderer.constructor ==
								L.jqplot.LinearAxisRenderer &&
							"" == this._autoFormatString
						) {
							av = this.max - this.min;
							var a7 = new this.tickRenderer(this.tickOptions),
								aL =
									a7.formatString ||
									L.jqplot.config.defaultTickFormatString,
								aL = aL.match(L.jqplot.sprintf.regex)[0],
								a3 = 0;
							if (aL) {
								if (aL.search(/[fFeEgGpP]/) > -1) {
									var aY = aL.match(
										/\%\.(\d{0,})?[eEfFgGpP]/
									);
									a3 = aY ? parseInt(aY[1], 10) : 6;
								} else aL.search(/[di]/) > -1 && (a3 = 0);
								var aq = Math.pow(10, -a3);
								if (
									this.tickInterval < aq &&
									null == aW &&
									null == ba
								)
									if (
										((this.tickInterval = aq),
										null == a5 && null == aH)
									) {
										(this.min =
											Math.floor(
												this._dataBounds.min / aq
											) * aq),
											this.min == this._dataBounds.min &&
												(this.min =
													this._dataBounds.min -
													this.tickInterval),
											(this.max =
												Math.ceil(
													this._dataBounds.max / aq
												) * aq),
											this.max == this._dataBounds.max &&
												(this.max =
													this._dataBounds.max +
													this.tickInterval);
										var aX =
											(this.max - this.min) /
											this.tickInterval;
										(aX = aX.toFixed(11)),
											(aX = Math.ceil(aX)),
											(this.numberTicks = aX + 1);
									} else if (null == a5) {
										var aX =
											(this._dataBounds.max - this.min) /
											this.tickInterval;
										(aX = aX.toFixed(11)),
											(this.numberTicks =
												Math.ceil(aX) + 2),
											(this.max =
												this.min +
												this.tickInterval *
													(this.numberTicks - 1));
									} else if (null == aH) {
										var aX =
											(this.max - this._dataBounds.min) /
											this.tickInterval;
										(aX = aX.toFixed(11)),
											(this.numberTicks =
												Math.ceil(aX) + 2),
											(this.min =
												this.max -
												this.tickInterval *
													(this.numberTicks - 1));
									} else
										(this.numberTicks =
											Math.ceil(
												(a5 - aH) / this.tickInterval
											) + 1),
											(this.min =
												Math.floor(
													aH * Math.pow(10, a3)
												) / Math.pow(10, a3)),
											(this.max =
												Math.ceil(
													a5 * Math.pow(10, a3)
												) / Math.pow(10, a3)),
											(this.numberTicks =
												Math.ceil(
													(this.max - this.min) /
														this.tickInterval
												) + 1);
							}
						}
					}
					this._overrideFormatString &&
						"" != this._autoFormatString &&
						((this.tickOptions = this.tickOptions || {}),
						(this.tickOptions.formatString = this._autoFormatString));
					for (var aU, a8, a0 = 0; a0 < this.numberTicks; a0++) {
						if (
							((a4 = this.min + a0 * this.tickInterval),
							(aU = new this.tickRenderer(this.tickOptions)),
							aU.setTick(a4, this.name),
							this._ticks.push(aU),
							a0 < this.numberTicks - 1)
						)
							for (var aZ = 0; aZ < this.minorTicks; aZ++)
								(a4 +=
									this.tickInterval / (this.minorTicks + 1)),
									(a8 = L.extend(!0, {}, this.tickOptions, {
										name: this.name,
										value: a4,
										label: "",
										isMinorTick: !0
									})),
									(aU = new this.tickRenderer(a8)),
									this._ticks.push(aU);
						aU = null;
					}
				}
				this.tickInset &&
					((this.min = this.min - this.tickInset * this.tickInterval),
					(this.max = this.max + this.tickInset * this.tickInterval)),
					(aT = null);
			}),
			(L.jqplot.LinearAxisRenderer.prototype.resetTickValues = function(
				aj
			) {
				if (L.isArray(aj) && aj.length == this._ticks.length) {
					for (var ai, ah = 0; ah < aj.length; ah++)
						(ai = this._ticks[ah]),
							(ai.value = aj[ah]),
							(ai.label = ai.formatter(ai.formatString, aj[ah])),
							(ai.label = ai.prefix + ai.label),
							ai._elem.html(ai.label);
					(ai = null),
						(this.min = L.jqplot.arrayMin(aj)),
						(this.max = L.jqplot.arrayMax(aj)),
						this.pack();
				}
			}),
			(L.jqplot.LinearAxisRenderer.prototype.pack = function(aj, ai) {
				(aj = aj || {}), (ai = ai || this._offsets);
				var ay = this._ticks,
					au = this.max,
					at = this.min,
					ao = ai.max,
					am = ai.min,
					aq = null == this._label ? !1 : this._label.show;
				for (var ar in aj) this._elem.css(ar, aj[ar]);
				this._offsets = ai;
				var ak = ao - am,
					al = au - at;
				if (
					(this.breakPoints
						? ((al =
								al - this.breakPoints[1] + this.breakPoints[0]),
							(this.p2u = function(aA) {
								return (aA - am) * al / ak + at;
							}),
							(this.u2p = function(aA) {
								return (
									aA > this.breakPoints[0] &&
										aA < this.breakPoints[1] &&
										(aA = this.breakPoints[0]),
									aA <= this.breakPoints[0]
										? (aA - at) * ak / al + am
										: (aA -
												this.breakPoints[1] +
												this.breakPoints[0] -
												at) *
												ak /
												al +
											am
								);
							}),
							"x" == this.name.charAt(0)
								? ((this.series_u2p = function(aA) {
										return (
											aA > this.breakPoints[0] &&
												aA < this.breakPoints[1] &&
												(aA = this.breakPoints[0]),
											aA <= this.breakPoints[0]
												? (aA - at) * ak / al
												: (aA -
														this.breakPoints[1] +
														this.breakPoints[0] -
														at) *
													ak /
													al
										);
									}),
									(this.series_p2u = function(aA) {
										return aA * al / ak + at;
									}))
								: ((this.series_u2p = function(aA) {
										return (
											aA > this.breakPoints[0] &&
												aA < this.breakPoints[1] &&
												(aA = this.breakPoints[0]),
											aA >= this.breakPoints[1]
												? (aA - au) * ak / al
												: (aA +
														this.breakPoints[1] -
														this.breakPoints[0] -
														au) *
													ak /
													al
										);
									}),
									(this.series_p2u = function(aA) {
										return aA * al / ak + au;
									})))
						: ((this.p2u = function(aA) {
								return (aA - am) * al / ak + at;
							}),
							(this.u2p = function(aA) {
								return (aA - at) * ak / al + am;
							}),
							"xaxis" == this.name || "x2axis" == this.name
								? ((this.series_u2p = function(aA) {
										return (aA - at) * ak / al;
									}),
									(this.series_p2u = function(aA) {
										return aA * al / ak + at;
									}))
								: ((this.series_u2p = function(aA) {
										return (aA - au) * ak / al;
									}),
									(this.series_p2u = function(aA) {
										return aA * al / ak + au;
									}))),
					this.show)
				)
					if ("xaxis" == this.name || "x2axis" == this.name) {
						for (var av = 0; av < ay.length; av++) {
							var ap = ay[av];
							if (ap.show && ap.showLabel) {
								var ah;
								if (
									ap.constructor ==
										L.jqplot.CanvasAxisTickRenderer &&
									ap.angle
								) {
									var ax = "xaxis" == this.name ? 1 : -1;
									switch (ap.labelPosition) {
										case "auto":
											ah =
												ax * ap.angle < 0
													? -ap.getWidth() +
														ap._textRenderer.height *
															Math.sin(
																-ap._textRenderer
																	.angle
															) /
															2
													: -ap._textRenderer.height *
														Math.sin(
															ap._textRenderer.angle
														) /
														2;
											break;
										case "end":
											ah =
												-ap.getWidth() +
												ap._textRenderer.height *
													Math.sin(
														-ap._textRenderer.angle
													) /
													2;
											break;
										case "start":
											ah =
												-ap._textRenderer.height *
												Math.sin(
													ap._textRenderer.angle
												) /
												2;
											break;
										case "middle":
											ah =
												-ap.getWidth() / 2 +
												ap._textRenderer.height *
													Math.sin(
														-ap._textRenderer.angle
													) /
													2;
											break;
										default:
											ah =
												-ap.getWidth() / 2 +
												ap._textRenderer.height *
													Math.sin(
														-ap._textRenderer.angle
													) /
													2;
									}
								} else ah = -ap.getWidth() / 2;
								var az = this.u2p(ap.value) + ah + "px";
								ap._elem.css("left", az), ap.pack();
							}
						}
						if (aq) {
							var an = this._label._elem.outerWidth(!0);
							this._label._elem.css(
								"left",
								am + ak / 2 - an / 2 + "px"
							),
								"xaxis" == this.name
									? this._label._elem.css("bottom", "0px")
									: this._label._elem.css("top", "0px"),
								this._label.pack();
						}
					} else {
						for (var av = 0; av < ay.length; av++) {
							var ap = ay[av];
							if (ap.show && ap.showLabel) {
								var ah;
								if (
									ap.constructor ==
										L.jqplot.CanvasAxisTickRenderer &&
									ap.angle
								) {
									var ax = "yaxis" == this.name ? 1 : -1;
									switch (ap.labelPosition) {
										case "auto":
										case "end":
											ah =
												ax * ap.angle < 0
													? -ap._textRenderer.height *
														Math.cos(
															-ap._textRenderer
																.angle
														) /
														2
													: -ap.getHeight() +
														ap._textRenderer.height *
															Math.cos(
																ap._textRenderer
																	.angle
															) /
															2;
											break;
										case "start":
											ah =
												ap.angle > 0
													? -ap._textRenderer.height *
														Math.cos(
															-ap._textRenderer
																.angle
														) /
														2
													: -ap.getHeight() +
														ap._textRenderer.height *
															Math.cos(
																ap._textRenderer
																	.angle
															) /
															2;
											break;
										case "middle":
											ah = -ap.getHeight() / 2;
											break;
										default:
											ah = -ap.getHeight() / 2;
									}
								} else ah = -ap.getHeight() / 2;
								var az = this.u2p(ap.value) + ah + "px";
								ap._elem.css("top", az), ap.pack();
							}
						}
						if (aq) {
							var aw = this._label._elem.outerHeight(!0);
							this._label._elem.css(
								"top",
								ao - ak / 2 - aw / 2 + "px"
							),
								"yaxis" == this.name
									? this._label._elem.css("left", "0px")
									: this._label._elem.css("right", "0px"),
								this._label.pack();
						}
					}
				ay = null;
			});
		(L.jqplot.LinearTickGenerator = function(an, aq, aj, ak, ao, ar) {
			if (
				((ao = null === ao ? !1 : ao),
				(ar = null === ar || ao ? !1 : ar),
				an === aq && (aq = aq ? 0 : 1),
				(aj = aj || 1),
				an > aq)
			) {
				var at = aq;
				(aq = an), (an = at);
			}
			var ai = [],
				aw = Q(aq - an, aj),
				av = L.jqplot.getSignificantFigures;
			if (null == ak)
				if (ao || ar) {
					if (ao) {
						(ai[0] = an),
							(ai[2] = Math.ceil((aq - an) / aw + 1)),
							(ai[1] = an + (ai[2] - 1) * aw);
						var au = av(an).digitsRight,
							ap = av(aw).digitsRight;
						(ai[3] = ap > au ? i(aw) : "%." + au + "f"),
							(ai[4] = aw);
					} else if (ar) {
						(ai[1] = aq),
							(ai[2] = Math.ceil((aq - an) / aw + 1)),
							(ai[0] = aq - (ai[2] - 1) * aw);
						var al = av(aq).digitsRight,
							ap = av(aw).digitsRight;
						(ai[3] = ap > al ? i(aw) : "%." + al + "f"),
							(ai[4] = aw);
					}
				} else
					(ai[0] = Math.floor(an / aw) * aw),
						(ai[1] = Math.ceil(aq / aw) * aw),
						(ai[2] = Math.round((ai[1] - ai[0]) / aw + 1)),
						(ai[3] = i(aw)),
						(ai[4] = aw);
			else {
				var am = [];
				if (
					((am[0] = Math.floor(an / aw) * aw),
					(am[1] = Math.ceil(aq / aw) * aw),
					(am[2] = Math.round((am[1] - am[0]) / aw + 1)),
					(am[3] = i(aw)),
					(am[4] = aw),
					am[2] === ak)
				)
					ai = am;
				else {
					var ah = W(am[1] - am[0], ak);
					(ai[0] = am[0]),
						(ai[2] = ak),
						(ai[4] = ah),
						(ai[3] = i(ah)),
						(ai[1] = ai[0] + (ai[2] - 1) * ai[4]);
				}
			}
			return ai;
		}),
			(L.jqplot.LinearTickGenerator.bestLinearInterval = Q),
			(L.jqplot.LinearTickGenerator.bestInterval = W),
			(L.jqplot.LinearTickGenerator.bestLinearComponents = x),
			(L.jqplot.LinearTickGenerator.bestConstrainedInterval = d),
			(L.jqplot.MarkerRenderer = function(ah) {
				(this.show = !0),
					(this.style = "filledCircle"),
					(this.lineWidth = 2),
					(this.size = 9),
					(this.color = "#666666"),
					(this.shadow = !0),
					(this.shadowAngle = 45),
					(this.shadowOffset = 1),
					(this.shadowDepth = 3),
					(this.shadowAlpha = "0.07"),
					(this.shadowRenderer = new L.jqplot.ShadowRenderer()),
					(this.shapeRenderer = new L.jqplot.ShapeRenderer()),
					L.extend(!0, this, ah);
			}),
			(L.jqplot.MarkerRenderer.prototype.init = function(ah) {
				L.extend(!0, this, ah);
				var aj = {
					angle: this.shadowAngle,
					offset: this.shadowOffset,
					alpha: this.shadowAlpha,
					lineWidth: this.lineWidth,
					depth: this.shadowDepth,
					closePath: !0
				};
				-1 != this.style.indexOf("filled") && (aj.fill = !0),
					-1 != this.style.indexOf("ircle") &&
						((aj.isarc = !0), (aj.closePath = !1)),
					this.shadowRenderer.init(aj);
				var ai = {
					fill: !1,
					isarc: !1,
					strokeStyle: this.color,
					fillStyle: this.color,
					lineWidth: this.lineWidth,
					closePath: !0
				};
				-1 != this.style.indexOf("filled") && (ai.fill = !0),
					-1 != this.style.indexOf("ircle") &&
						((ai.isarc = !0), (ai.closePath = !1)),
					this.shapeRenderer.init(ai);
			}),
			(L.jqplot.MarkerRenderer.prototype.drawDiamond = function(
				aj,
				ai,
				am,
				al,
				ao
			) {
				var ah = 1.2,
					ap = this.size / 2 / ah,
					an = this.size / 2 * ah,
					ak = [
						[aj - ap, ai],
						[aj, ai + an],
						[aj + ap, ai],
						[aj, ai - an]
					];
				this.shadow && this.shadowRenderer.draw(am, ak),
					this.shapeRenderer.draw(am, ak, ao);
			}),
			(L.jqplot.MarkerRenderer.prototype.drawPlus = function(ak, aj, an) {
				var ai = 1,
					ar = this.size / 2 * ai,
					ao = this.size / 2 * ai,
					ap = [[ak, aj - ao], [ak, aj + ao]],
					al = [[ak + ar, aj], [ak - ar, aj]],
					ah = L.extend(!0, {}, this.options, { closePath: !1 });
				this.shadow &&
					(this.shadowRenderer.draw(an, ap, { closePath: !1 }),
					this.shadowRenderer.draw(an, al, { closePath: !1 })),
					this.shapeRenderer.draw(an, ap, ah),
					this.shapeRenderer.draw(an, al, ah);
			}),
			(L.jqplot.MarkerRenderer.prototype.drawX = function(ak, aj, an) {
				var ai = 1,
					ar = this.size / 2 * ai,
					ao = this.size / 2 * ai,
					ah = L.extend(!0, {}, this.options, { closePath: !1 }),
					ap = [[ak - ar, aj - ao], [ak + ar, aj + ao]],
					al = [[ak - ar, aj + ao], [ak + ar, aj - ao]];
				this.shadow &&
					(this.shadowRenderer.draw(an, ap, { closePath: !1 }),
					this.shadowRenderer.draw(an, al, { closePath: !1 })),
					this.shapeRenderer.draw(an, ap, ah),
					this.shapeRenderer.draw(an, al, ah);
			}),
			(L.jqplot.MarkerRenderer.prototype.drawDash = function(
				aj,
				ai,
				am,
				al,
				ao
			) {
				var ah = 1,
					ap = this.size / 2 * ah,
					ak = (this.size / 2 * ah, [[aj - ap, ai], [aj + ap, ai]]);
				this.shadow && this.shadowRenderer.draw(am, ak),
					this.shapeRenderer.draw(am, ak, ao);
			}),
			(L.jqplot.MarkerRenderer.prototype.drawLine = function(
				am,
				al,
				ah,
				ak,
				ai
			) {
				var aj = [am, al];
				this.shadow && this.shadowRenderer.draw(ah, aj),
					this.shapeRenderer.draw(ah, aj, ai);
			}),
			(L.jqplot.MarkerRenderer.prototype.drawSquare = function(
				aj,
				ai,
				am,
				al,
				ao
			) {
				var ah = 1,
					ap = this.size / 2 / ah,
					an = this.size / 2 * ah,
					ak = [
						[aj - ap, ai - an],
						[aj - ap, ai + an],
						[aj + ap, ai + an],
						[aj + ap, ai - an]
					];
				this.shadow && this.shadowRenderer.draw(am, ak),
					this.shapeRenderer.draw(am, ak, ao);
			}),
			(L.jqplot.MarkerRenderer.prototype.drawCircle = function(
				ai,
				ao,
				ak,
				an,
				al
			) {
				var ah = this.size / 2,
					aj = 2 * Math.PI,
					am = [ai, ao, ah, 0, aj, !0];
				this.shadow && this.shadowRenderer.draw(ak, am),
					this.shapeRenderer.draw(ak, am, al);
			}),
			(L.jqplot.MarkerRenderer.prototype.draw = function(ah, ak, ai, aj) {
				if (((aj = aj || {}), null == aj.show || 0 != aj.show))
					switch ((aj.color &&
						!aj.fillStyle &&
						(aj.fillStyle = aj.color),
					aj.color && !aj.strokeStyle && (aj.strokeStyle = aj.color),
					this.style)) {
						case "diamond":
							this.drawDiamond(ah, ak, ai, !1, aj);
							break;
						case "filledDiamond":
							this.drawDiamond(ah, ak, ai, !0, aj);
							break;
						case "circle":
							this.drawCircle(ah, ak, ai, !1, aj);
							break;
						case "filledCircle":
							this.drawCircle(ah, ak, ai, !0, aj);
							break;
						case "square":
							this.drawSquare(ah, ak, ai, !1, aj);
							break;
						case "filledSquare":
							this.drawSquare(ah, ak, ai, !0, aj);
							break;
						case "x":
							this.drawX(ah, ak, ai, !0, aj);
							break;
						case "plus":
							this.drawPlus(ah, ak, ai, !0, aj);
							break;
						case "dash":
							this.drawDash(ah, ak, ai, !0, aj);
							break;
						case "line":
							this.drawLine(ah, ak, ai, !1, aj);
							break;
						default:
							this.drawDiamond(ah, ak, ai, !1, aj);
					}
			}),
			(L.jqplot.ShadowRenderer = function(ah) {
				(this.angle = 45),
					(this.offset = 1),
					(this.alpha = 0.07),
					(this.lineWidth = 1.5),
					(this.lineJoin = "miter"),
					(this.lineCap = "round"),
					(this.closePath = !1),
					(this.fill = !1),
					(this.depth = 3),
					(this.strokeStyle = "rgba(0,0,0,0.1)"),
					(this.isarc = !1),
					L.extend(!0, this, ah);
			}),
			(L.jqplot.ShadowRenderer.prototype.init = function(ah) {
				L.extend(!0, this, ah);
			}),
			(L.jqplot.ShadowRenderer.prototype.draw = function(av, at, ax) {
				av.save();
				var ah = null != ax ? ax : {},
					au = null != ah.fill ? ah.fill : this.fill,
					ap = null != ah.fillRect ? ah.fillRect : this.fillRect,
					ao = null != ah.closePath ? ah.closePath : this.closePath,
					al = null != ah.offset ? ah.offset : this.offset,
					aj = null != ah.alpha ? ah.alpha : this.alpha,
					an = null != ah.depth ? ah.depth : this.depth,
					aw = null != ah.isarc ? ah.isarc : this.isarc,
					aq =
						null != ah.linePattern
							? ah.linePattern
							: this.linePattern;
				(av.lineWidth =
					null != ah.lineWidth ? ah.lineWidth : this.lineWidth),
					(av.lineJoin =
						null != ah.lineJoin ? ah.lineJoin : this.lineJoin),
					(av.lineCap =
						null != ah.lineCap ? ah.lineCap : this.lineCap),
					(av.strokeStyle =
						ah.strokeStyle ||
						this.strokeStyle ||
						"rgba(0,0,0," + aj + ")"),
					(av.fillStyle =
						ah.fillStyle ||
						this.fillStyle ||
						"rgba(0,0,0," + aj + ")");
				for (var ak = 0; an > ak; ak++) {
					var ar = L.jqplot.LinePattern(av, aq);
					if (
						(av.translate(
							Math.cos(this.angle * Math.PI / 180) * al,
							Math.sin(this.angle * Math.PI / 180) * al
						),
						ar.beginPath(),
						aw)
					)
						av.arc(at[0], at[1], at[2], at[3], at[4], !0);
					else if (ap) ap && av.fillRect(at[0], at[1], at[2], at[3]);
					else if (at && at.length)
						for (var ai = !0, am = 0; am < at.length; am++)
							null != at[am][0] && null != at[am][1]
								? ai
									? (ar.moveTo(at[am][0], at[am][1]), (ai = !1))
									: ar.lineTo(at[am][0], at[am][1])
								: (ai = !0);
					ao && ar.closePath(), au ? av.fill() : av.stroke();
				}
				av.restore();
			}),
			(L.jqplot.ShapeRenderer = function(ah) {
				(this.lineWidth = 1.5),
					(this.linePattern = "solid"),
					(this.lineJoin = "miter"),
					(this.lineCap = "round"),
					(this.closePath = !1),
					(this.fill = !1),
					(this.isarc = !1),
					(this.fillRect = !1),
					(this.strokeRect = !1),
					(this.clearRect = !1),
					(this.strokeStyle = "#999999"),
					(this.fillStyle = "#999999"),
					L.extend(!0, this, ah);
			}),
			(L.jqplot.ShapeRenderer.prototype.init = function(ah) {
				L.extend(!0, this, ah);
			}),
			(L.jqplot.ShapeRenderer.prototype.draw = function(at, aq, av) {
				at.save();
				var ah = null != av ? av : {},
					ar = null != ah.fill ? ah.fill : this.fill,
					am = null != ah.closePath ? ah.closePath : this.closePath,
					an = null != ah.fillRect ? ah.fillRect : this.fillRect,
					ak =
						null != ah.strokeRect ? ah.strokeRect : this.strokeRect,
					ai = null != ah.clearRect ? ah.clearRect : this.clearRect,
					au = null != ah.isarc ? ah.isarc : this.isarc,
					ao =
						null != ah.linePattern
							? ah.linePattern
							: this.linePattern,
					ap = L.jqplot.LinePattern(at, ao);
				if (
					((at.lineWidth = ah.lineWidth || this.lineWidth),
					(at.lineJoin = ah.lineJoin || this.lineJoin),
					(at.lineCap = ah.lineCap || this.lineCap),
					(at.strokeStyle =
						ah.strokeStyle || ah.color || this.strokeStyle),
					(at.fillStyle = ah.fillStyle || this.fillStyle),
					at.beginPath(),
					au)
				)
					return (
						at.arc(aq[0], aq[1], aq[2], aq[3], aq[4], !0),
						am && at.closePath(),
						ar ? at.fill() : at.stroke(),
						void at.restore()
					);
				if (ai)
					return (
						at.clearRect(aq[0], aq[1], aq[2], aq[3]),
						void at.restore()
					);
				if (an || ak) {
					if ((an && at.fillRect(aq[0], aq[1], aq[2], aq[3]), ak))
						return (
							at.strokeRect(aq[0], aq[1], aq[2], aq[3]),
							void at.restore()
						);
				} else if (aq && aq.length) {
					for (var aj = !0, al = 0; al < aq.length; al++)
						null != aq[al][0] && null != aq[al][1]
							? aj
								? (ap.moveTo(aq[al][0], aq[al][1]), (aj = !1))
								: ap.lineTo(aq[al][0], aq[al][1])
							: (aj = !0);
					am && ap.closePath(), ar ? at.fill() : at.stroke();
				}
				at.restore();
			}),
			(L.jqplot.TableLegendRenderer = function() {}),
			(L.jqplot.TableLegendRenderer.prototype.init = function(ah) {
				L.extend(!0, this, ah);
			}),
			(L.jqplot.TableLegendRenderer.prototype.addrow = function(
				aq,
				ak,
				ah,
				ao
			) {
				var ap,
					aj,
					ai,
					an,
					am,
					al = ah ? this.rowSpacing + "px" : "0px";
				(ai = document.createElement("tr")),
					(ap = L(ai)),
					ap.addClass("jqplot-table-legend"),
					(ai = null),
					ao ? ap.prependTo(this._elem) : ap.appendTo(this._elem),
					this.showSwatches &&
						((aj = L(document.createElement("td"))),
						aj.addClass(
							"jqplot-table-legend jqplot-table-legend-swatch"
						),
						aj.css({ textAlign: "center", paddingTop: al }),
						(an = L(document.createElement("div"))),
						an.addClass("jqplot-table-legend-swatch-outline"),
						(am = L(document.createElement("div"))),
						am.addClass("jqplot-table-legend-swatch"),
						am.css({ backgroundColor: ak, borderColor: ak }),
						ap.append(aj.append(an.append(am)))),
					this.showLabels &&
						((aj = L(document.createElement("td"))),
						aj.addClass(
							"jqplot-table-legend jqplot-table-legend-label"
						),
						aj.css("paddingTop", al),
						ap.append(aj),
						this.escapeHtml ? aj.text(aq) : aj.html(aq)),
					(aj = null),
					(an = null),
					(am = null),
					(ap = null),
					(ai = null);
			}),
			(L.jqplot.TableLegendRenderer.prototype.draw = function() {
				if (
					(this._elem &&
						(this._elem.emptyForce(), (this._elem = null)),
					this.show)
				) {
					var am = this._series,
						ai = document.createElement("table");
					(this._elem = L(ai)),
						this._elem.addClass("jqplot-table-legend");
					var ar = { position: "absolute" };
					this.background && (ar.background = this.background),
						this.border && (ar.border = this.border),
						this.fontSize && (ar.fontSize = this.fontSize),
						this.fontFamily && (ar.fontFamily = this.fontFamily),
						this.textColor && (ar.textColor = this.textColor),
						null != this.marginTop &&
							(ar.marginTop = this.marginTop),
						null != this.marginBottom &&
							(ar.marginBottom = this.marginBottom),
						null != this.marginLeft &&
							(ar.marginLeft = this.marginLeft),
						null != this.marginRight &&
							(ar.marginRight = this.marginRight);
					for (var aq, ah = !1, ao = !1, an = 0; an < am.length; an++)
						if (
							((aq = am[an]),
							(aq._stack ||
								aq.renderer.constructor ==
									L.jqplot.BezierCurveRenderer) &&
								(ao = !0),
							aq.show && aq.showLabel)
						) {
							var al = this.labels[an] || aq.label.toString();
							if (al) {
								var aj = aq.color;
								ao && an < am.length - 1
									? (ah = !0)
									: ao && an == am.length - 1 && (ah = !1),
									this.renderer.addrow.call(
										this,
										al,
										aj,
										ah,
										ao
									),
									(ah = !0);
							}
							for (
								var ak = 0;
								ak < L.jqplot.addLegendRowHooks.length;
								ak++
							) {
								var ap = L.jqplot.addLegendRowHooks[ak].call(
									this,
									aq
								);
								ap &&
									(this.renderer.addrow.call(
										this,
										ap.label,
										ap.color,
										ah
									),
									(ah = !0));
							}
							al = null;
						}
				}
				return this._elem;
			}),
			(L.jqplot.TableLegendRenderer.prototype.pack = function(aj) {
				if (this.show)
					if ("insideGrid" == this.placement)
						switch (this.location) {
							case "nw":
								var ai = aj.left,
									ah = aj.top;
								this._elem.css("left", ai),
									this._elem.css("top", ah);
								break;
							case "n":
								var ai =
										(aj.left +
											(this._plotDimensions.width -
												aj.right)) /
											2 -
										this.getWidth() / 2,
									ah = aj.top;
								this._elem.css("left", ai),
									this._elem.css("top", ah);
								break;
							case "ne":
								var ai = aj.right,
									ah = aj.top;
								this._elem.css({ right: ai, top: ah });
								break;
							case "e":
								var ai = aj.right,
									ah =
										(aj.top +
											(this._plotDimensions.height -
												aj.bottom)) /
											2 -
										this.getHeight() / 2;
								this._elem.css({ right: ai, top: ah });
								break;
							case "se":
								var ai = aj.right,
									ah = aj.bottom;
								this._elem.css({ right: ai, bottom: ah });
								break;
							case "s":
								var ai =
										(aj.left +
											(this._plotDimensions.width -
												aj.right)) /
											2 -
										this.getWidth() / 2,
									ah = aj.bottom;
								this._elem.css({ left: ai, bottom: ah });
								break;
							case "sw":
								var ai = aj.left,
									ah = aj.bottom;
								this._elem.css({ left: ai, bottom: ah });
								break;
							case "w":
								var ai = aj.left,
									ah =
										(aj.top +
											(this._plotDimensions.height -
												aj.bottom)) /
											2 -
										this.getHeight() / 2;
								this._elem.css({ left: ai, top: ah });
								break;
							default:
								var ai = aj.right,
									ah = aj.bottom;
								this._elem.css({ right: ai, bottom: ah });
						}
					else if ("outside" == this.placement)
						switch (this.location) {
							case "nw":
								var ai = this._plotDimensions.width - aj.left,
									ah = aj.top;
								this._elem.css("right", ai),
									this._elem.css("top", ah);
								break;
							case "n":
								var ai =
										(aj.left +
											(this._plotDimensions.width -
												aj.right)) /
											2 -
										this.getWidth() / 2,
									ah = this._plotDimensions.height - aj.top;
								this._elem.css("left", ai),
									this._elem.css("bottom", ah);
								break;
							case "ne":
								var ai = this._plotDimensions.width - aj.right,
									ah = aj.top;
								this._elem.css({ left: ai, top: ah });
								break;
							case "e":
								var ai = this._plotDimensions.width - aj.right,
									ah =
										(aj.top +
											(this._plotDimensions.height -
												aj.bottom)) /
											2 -
										this.getHeight() / 2;
								this._elem.css({ left: ai, top: ah });
								break;
							case "se":
								var ai = this._plotDimensions.width - aj.right,
									ah = aj.bottom;
								this._elem.css({ left: ai, bottom: ah });
								break;
							case "s":
								var ai =
										(aj.left +
											(this._plotDimensions.width -
												aj.right)) /
											2 -
										this.getWidth() / 2,
									ah =
										this._plotDimensions.height - aj.bottom;
								this._elem.css({ left: ai, top: ah });
								break;
							case "sw":
								var ai = this._plotDimensions.width - aj.left,
									ah = aj.bottom;
								this._elem.css({ right: ai, bottom: ah });
								break;
							case "w":
								var ai = this._plotDimensions.width - aj.left,
									ah =
										(aj.top +
											(this._plotDimensions.height -
												aj.bottom)) /
											2 -
										this.getHeight() / 2;
								this._elem.css({ right: ai, top: ah });
								break;
							default:
								var ai = aj.right,
									ah = aj.bottom;
								this._elem.css({ right: ai, bottom: ah });
						}
					else
						switch (this.location) {
							case "nw":
								this._elem.css({ left: 0, top: aj.top });
								break;
							case "n":
								var ai =
									(aj.left +
										(this._plotDimensions.width -
											aj.right)) /
										2 -
									this.getWidth() / 2;
								this._elem.css({ left: ai, top: aj.top });
								break;
							case "ne":
								this._elem.css({ right: 0, top: aj.top });
								break;
							case "e":
								var ah =
									(aj.top +
										(this._plotDimensions.height -
											aj.bottom)) /
										2 -
									this.getHeight() / 2;
								this._elem.css({ right: aj.right, top: ah });
								break;
							case "se":
								this._elem.css({
									right: aj.right,
									bottom: aj.bottom
								});
								break;
							case "s":
								var ai =
									(aj.left +
										(this._plotDimensions.width -
											aj.right)) /
										2 -
									this.getWidth() / 2;
								this._elem.css({ left: ai, bottom: aj.bottom });
								break;
							case "sw":
								this._elem.css({
									left: aj.left,
									bottom: aj.bottom
								});
								break;
							case "w":
								var ah =
									(aj.top +
										(this._plotDimensions.height -
											aj.bottom)) /
										2 -
									this.getHeight() / 2;
								this._elem.css({ left: aj.left, top: ah });
								break;
							default:
								this._elem.css({
									right: aj.right,
									bottom: aj.bottom
								});
						}
			}),
			(L.jqplot.ThemeEngine = function() {
				(this.themes = {}), (this.activeTheme = null);
			}),
			(L.jqplot.ThemeEngine.prototype.init = function() {
				var an,
					ai,
					am,
					ak = new L.jqplot.Theme({ _name: "Default" });
				for (an in ak.target)
					ak.target[an] = this.target.css(
						"textColor" == an ? "color" : an
					);
				if (this.title.show && this.title._elem)
					for (an in ak.title)
						ak.title[an] = this.title._elem.css(
							"textColor" == an ? "color" : an
						);
				for (an in ak.grid) ak.grid[an] = this.grid[an];
				if (
					(null == ak.grid.backgroundColor &&
						null != this.grid.background &&
						(ak.grid.backgroundColor = this.grid.background),
					this.legend.show && this.legend._elem)
				)
					for (an in ak.legend)
						ak.legend[an] = this.legend._elem.css(
							"textColor" == an ? "color" : an
						);
				var aj;
				for (ai = 0; ai < this.series.length; ai++) {
					(aj = this.series[ai]),
						ak.series.push(
							aj.renderer.constructor == L.jqplot.LineRenderer
								? new p()
								: aj.renderer.constructor ==
									L.jqplot.BarRenderer
									? new T()
									: aj.renderer.constructor ==
										L.jqplot.PieRenderer
										? new f()
										: aj.renderer.constructor ==
											L.jqplot.DonutRenderer
											? new G()
											: aj.renderer.constructor ==
												L.jqplot.FunnelRenderer
												? new Z()
												: aj.renderer.constructor ==
													L.jqplot.MeterGaugeRenderer
													? new D()
													: {}
						);
					for (an in ak.series[ai]) ak.series[ai][an] = aj[an];
				}
				var ah, al;
				for (an in this.axes) {
					if (
						((al = this.axes[an]),
						(ah = ak.axes[an] = new P()),
						(ah.borderColor = al.borderColor),
						(ah.borderWidth = al.borderWidth),
						al._ticks && al._ticks[0])
					)
						for (am in ah.ticks)
							al._ticks[0].hasOwnProperty(am)
								? (ah.ticks[am] = al._ticks[0][am])
								: al._ticks[0]._elem &&
									(ah.ticks[am] = al._ticks[0]._elem.css(am));
					if (al._label && al._label.show)
						for (am in ah.label)
							al._label[am]
								? (ah.label[am] = al._label[am])
								: al._label._elem &&
									(ah.label[am] = al._label._elem.css(
										"textColor" == am ? "color" : am
									));
				}
				this.themeEngine._add(ak),
					(this.themeEngine.activeTheme = this.themeEngine.themes[
						ak._name
					]);
			}),
			(L.jqplot.ThemeEngine.prototype.get = function(ah) {
				return ah ? this.themes[ah] : this.activeTheme;
			}),
			(L.jqplot.ThemeEngine.prototype.getThemeNames = function() {
				var ah = [];
				for (var ai in this.themes) ah.push(ai);
				return ah.sort(O);
			}),
			(L.jqplot.ThemeEngine.prototype.getThemes = function() {
				var ai = [],
					ah = [];
				for (var ak in this.themes) ai.push(ak);
				ai.sort(O);
				for (var aj = 0; aj < ai.length; aj++)
					ah.push(this.themes[ai[aj]]);
				return ah;
			}),
			(L.jqplot.ThemeEngine.prototype.activate = function(av, aB) {
				var ah = !1;
				if (
					(!aB &&
						this.activeTheme &&
						this.activeTheme._name &&
						(aB = this.activeTheme._name),
					!this.themes.hasOwnProperty(aB))
				)
					throw new Error("No theme of that name");
				var am = this.themes[aB];
				this.activeTheme = am;
				var aA,
					ai = ["xaxis", "x2axis", "yaxis", "y2axis"];
				for (aw = 0; aw < ai.length; aw++) {
					var an = ai[aw];
					null != am.axesStyles.borderColor &&
						(av.axes[an].borderColor = am.axesStyles.borderColor),
						null != am.axesStyles.borderWidth &&
							(av.axes[an].borderWidth =
								am.axesStyles.borderWidth);
				}
				for (var az in av.axes) {
					var ak = av.axes[az];
					if (ak.show) {
						var aq = am.axes[az] || {},
							ao = am.axesStyles,
							al = L.jqplot.extend(!0, {}, aq, ao);
						if (
							((aA =
								null != am.axesStyles.borderColor
									? am.axesStyles.borderColor
									: al.borderColor),
							null != al.borderColor &&
								((ak.borderColor = al.borderColor), (ah = !0)),
							(aA =
								null != am.axesStyles.borderWidth
									? am.axesStyles.borderWidth
									: al.borderWidth),
							null != al.borderWidth &&
								((ak.borderWidth = al.borderWidth), (ah = !0)),
							ak._ticks && ak._ticks[0])
						)
							for (var aj in al.ticks)
								(aA = al.ticks[aj]),
									null != aA &&
										((ak.tickOptions[aj] = aA),
										(ak._ticks = []),
										(ah = !0));
						if (ak._label && ak._label.show)
							for (var aj in al.label)
								(aA = al.label[aj]),
									null != aA &&
										((ak.labelOptions[aj] = aA), (ah = !0));
					}
				}
				for (var au in am.grid)
					null != am.grid[au] && (av.grid[au] = am.grid[au]);
				if ((ah || av.grid.draw(), av.legend.show))
					for (au in am.legend)
						null != am.legend[au] &&
							(av.legend[au] = am.legend[au]);
				if (av.title.show)
					for (au in am.title)
						null != am.title[au] && (av.title[au] = am.title[au]);
				var aw;
				for (aw = 0; aw < am.series.length; aw++) {
					var ap = {};
					for (au in am.series[aw])
						(aA =
							null != am.seriesStyles[au]
								? am.seriesStyles[au]
								: am.series[aw][au]),
							null != aA &&
								((ap[au] = aA),
								"color" == au
									? ((av.series[
											aw
										].renderer.shapeRenderer.fillStyle = aA),
										(av.series[
											aw
										].renderer.shapeRenderer.strokeStyle = aA),
										(av.series[aw][au] = aA))
									: "lineWidth" == au || "linePattern" == au
										? ((av.series[aw].renderer.shapeRenderer[
												au
											] = aA),
											(av.series[aw][au] = aA))
										: "markerOptions" == au
											? (V(av.series[aw].markerOptions, aA),
												V(av.series[aw].markerRenderer, aA))
											: (av.series[aw][au] = aA),
								(ah = !0));
				}
				ah && (av.target.empty(), av.draw());
				for (au in am.target)
					null != am.target[au] && av.target.css(au, am.target[au]);
			}),
			(L.jqplot.ThemeEngine.prototype._add = function(ai, ah) {
				if (
					(ah && (ai._name = ah),
					ai._name || (ai._name = Date.parse(new Date())),
					this.themes.hasOwnProperty(ai._name))
				)
					throw new Error(
						"jqplot.ThemeEngine Error: Theme already in use"
					);
				this.themes[ai._name] = ai;
			}),
			(L.jqplot.ThemeEngine.prototype.remove = function(ah) {
				return "Default" == ah ? !1 : delete this.themes[ah];
			}),
			(L.jqplot.ThemeEngine.prototype.newTheme = function(ah, aj) {
				"object" == typeof ah && ((aj = aj || ah), (ah = null)),
					(ah =
						aj && aj._name
							? aj._name
							: ah || Date.parse(new Date()));
				var ai = this.copy(this.themes.Default._name, ah);
				return L.jqplot.extend(ai, aj), ai;
			}),
			(L.jqplot.clone = B),
			(L.jqplot.merge = V),
			(L.jqplot.extend = function() {
				var aj,
					am = arguments[0] || {},
					ak = 1,
					al = arguments.length,
					ah = !1;
				for (
					"boolean" == typeof am &&
						((ah = am), (am = arguments[1] || {}), (ak = 2)),
						"object" != typeof am &&
							"[object Function]" === !toString.call(am) &&
							(am = {});
					al > ak;
					ak++
				)
					if (null != (aj = arguments[ak]))
						for (var ai in aj) {
							var an = am[ai],
								ao = aj[ai];
							am !== ao &&
								(ah &&
								ao &&
								"object" == typeof ao &&
								!ao.nodeType
									? (am[ai] = L.jqplot.extend(
											ah,
											an || (null != ao.length ? [] : {}),
											ao
										))
									: ao !== u && (am[ai] = ao));
						}
				return am;
			}),
			(L.jqplot.ThemeEngine.prototype.rename = function(ai, ah) {
				if ("Default" == ai || "Default" == ah)
					throw new Error(
						"jqplot.ThemeEngine Error: Cannot rename from/to Default"
					);
				if (this.themes.hasOwnProperty(ah))
					throw new Error(
						"jqplot.ThemeEngine Error: New name already in use."
					);
				if (this.themes.hasOwnProperty(ai)) {
					var aj = this.copy(ai, ah);
					return this.remove(ai), aj;
				}
				throw new Error(
					"jqplot.ThemeEngine Error: Old name or new name invalid"
				);
			}),
			(L.jqplot.ThemeEngine.prototype.copy = function(ah, aj, al) {
				if ("Default" == aj)
					throw new Error(
						"jqplot.ThemeEngine Error: Cannot copy over Default theme"
					);
				if (!this.themes.hasOwnProperty(ah)) {
					var ai = "jqplot.ThemeEngine Error: Source name invalid";
					throw new Error(ai);
				}
				if (this.themes.hasOwnProperty(aj)) {
					var ai = "jqplot.ThemeEngine Error: Target name invalid";
					throw new Error(ai);
				}
				var ak = B(this.themes[ah]);
				return (
					(ak._name = aj),
					L.jqplot.extend(!0, ak, al),
					this._add(ak),
					ak
				);
			}),
			(L.jqplot.Theme = function(ah, ai) {
				"object" == typeof ah && ((ai = ai || ah), (ah = null)),
					(ah = ah || Date.parse(new Date())),
					(this._name = ah),
					(this.target = { backgroundColor: null }),
					(this.legend = {
						textColor: null,
						fontFamily: null,
						fontSize: null,
						border: null,
						background: null
					}),
					(this.title = {
						textColor: null,
						fontFamily: null,
						fontSize: null,
						textAlign: null
					}),
					(this.seriesStyles = {}),
					(this.series = []),
					(this.grid = {
						drawGridlines: null,
						gridLineColor: null,
						gridLineWidth: null,
						backgroundColor: null,
						borderColor: null,
						borderWidth: null,
						shadow: null
					}),
					(this.axesStyles = { label: {}, ticks: {} }),
					(this.axes = {}),
					"string" == typeof ai
						? (this._name = ai)
						: "object" == typeof ai &&
							L.jqplot.extend(!0, this, ai);
			});
		var P = function() {
				(this.borderColor = null),
					(this.borderWidth = null),
					(this.ticks = new o()),
					(this.label = new t());
			},
			o = function() {
				(this.show = null),
					(this.showGridline = null),
					(this.showLabel = null),
					(this.showMark = null),
					(this.size = null),
					(this.textColor = null),
					(this.whiteSpace = null),
					(this.fontSize = null),
					(this.fontFamily = null);
			},
			t = function() {
				(this.textColor = null),
					(this.whiteSpace = null),
					(this.fontSize = null),
					(this.fontFamily = null),
					(this.fontWeight = null);
			},
			p = function() {
				(this.color = null),
					(this.lineWidth = null),
					(this.linePattern = null),
					(this.shadow = null),
					(this.fillColor = null),
					(this.showMarker = null),
					(this.markerOptions = new I());
			},
			I = function() {
				(this.show = null),
					(this.style = null),
					(this.lineWidth = null),
					(this.size = null),
					(this.color = null),
					(this.shadow = null);
			},
			T = function() {
				(this.color = null),
					(this.seriesColors = null),
					(this.lineWidth = null),
					(this.shadow = null),
					(this.barPadding = null),
					(this.barMargin = null),
					(this.barWidth = null),
					(this.highlightColors = null);
			},
			f = function() {
				(this.seriesColors = null),
					(this.padding = null),
					(this.sliceMargin = null),
					(this.fill = null),
					(this.shadow = null),
					(this.startAngle = null),
					(this.lineWidth = null),
					(this.highlightColors = null);
			},
			G = function() {
				(this.seriesColors = null),
					(this.padding = null),
					(this.sliceMargin = null),
					(this.fill = null),
					(this.shadow = null),
					(this.startAngle = null),
					(this.lineWidth = null),
					(this.innerDiameter = null),
					(this.thickness = null),
					(this.ringMargin = null),
					(this.highlightColors = null);
			},
			Z = function() {
				(this.color = null),
					(this.lineWidth = null),
					(this.shadow = null),
					(this.padding = null),
					(this.sectionMargin = null),
					(this.seriesColors = null),
					(this.highlightColors = null);
			},
			D = function() {
				(this.padding = null),
					(this.backgroundColor = null),
					(this.ringColor = null),
					(this.tickColor = null),
					(this.ringWidth = null),
					(this.intervalColors = null),
					(this.intervalInnerRadius = null),
					(this.intervalOuterRadius = null),
					(this.hubRadius = null),
					(this.needleThickness = null),
					(this.needlePad = null);
			};
		(L.fn.jqplotChildText = function() {
			return L(this)
				.contents()
				.filter(function() {
					return 3 == this.nodeType;
				})
				.text();
		}),
			(L.fn.jqplotGetComputedFontStyle = function() {
				for (
					var ak = window.getComputedStyle
							? window.getComputedStyle(this[0], "")
							: this[0].currentStyle,
						ai = ak["font-style"]
							? [
									"font-style",
									"font-weight",
									"font-size",
									"font-family"
								]
							: [
									"fontStyle",
									"fontWeight",
									"fontSize",
									"fontFamily"
								],
						al = [],
						aj = 0;
					aj < ai.length;
					++aj
				) {
					var ah = String(ak[ai[aj]]);
					ah && "normal" != ah && al.push(ah);
				}
				return al.join(" ");
			}),
			(L.fn.jqplotToImageCanvas = function(aj) {
				function aC(aE) {
					var aF = parseInt(L(aE).css("line-height"), 10);
					return (
						isNaN(aF) &&
							(aF = 1.2 * parseInt(L(aE).css("font-size"), 10)),
						aF
					);
				}
				function aD(aF, aE, aS, aG, aO, aH) {
					for (
						var aQ = aC(aF),
							aK = L(aF).innerWidth(),
							aN = (L(aF).innerHeight(), aS.split(/\s+/)),
							aR = aN.length,
							aP = "",
							aM = [],
							aU = aO,
							aT = aG,
							aJ = 0;
						aR > aJ;
						aJ++
					)
						(aP += aN[aJ]),
							aE.measureText(aP).width > aK &&
								(aM.push(aJ), (aP = ""), aJ--);
					if (0 === aM.length)
						"center" === L(aF).css("textAlign") &&
							(aT =
								aG + (aH - aE.measureText(aP).width) / 2 - au),
							aE.fillText(aS, aT, aO);
					else {
						(aP = aN.slice(0, aM[0]).join(" ")),
							"center" === L(aF).css("textAlign") &&
								(aT =
									aG +
									(aH - aE.measureText(aP).width) / 2 -
									au),
							aE.fillText(aP, aT, aU),
							(aU += aQ);
						for (var aJ = 1, aI = aM.length; aI > aJ; aJ++)
							(aP = aN.slice(aM[aJ - 1], aM[aJ]).join(" ")),
								"center" === L(aF).css("textAlign") &&
									(aT =
										aG +
										(aH - aE.measureText(aP).width) / 2 -
										au),
								aE.fillText(aP, aT, aU),
								(aU += aQ);
						(aP = aN.slice(aM[aJ - 1], aN.length).join(" ")),
							"center" === L(aF).css("textAlign") &&
								(aT =
									aG +
									(aH - aE.measureText(aP).width) / 2 -
									au),
							aE.fillText(aP, aT, aU);
					}
				}
				function aw(aG, aJ, aE) {
					var aN = aG.tagName.toLowerCase(),
						aF = L(aG).position(),
						aK = window.getComputedStyle
							? window.getComputedStyle(aG, "")
							: aG.currentStyle,
						aI =
							aJ +
							aF.left +
							parseInt(aK.marginLeft, 10) +
							parseInt(aK.borderLeftWidth, 10) +
							parseInt(aK.paddingLeft, 10),
						aL =
							aE +
							aF.top +
							parseInt(aK.marginTop, 10) +
							parseInt(aK.borderTopWidth, 10) +
							parseInt(aK.paddingTop, 10),
						aM = an.width;
					if (
						("div" != aN && "span" != aN) ||
						L(aG).hasClass("jqplot-highlighter-tooltip")
					)
						if (
							"table" === aN &&
							L(aG).hasClass("jqplot-table-legend")
						) {
							(ak.strokeStyle = L(aG).css("border-top-color")),
								(ak.fillStyle = L(aG).css("background-color")),
								ak.fillRect(
									aI,
									aL,
									L(aG).innerWidth(),
									L(aG).innerHeight()
								),
								parseInt(L(aG).css("border-top-width"), 10) >
									0 &&
									ak.strokeRect(
										aI,
										aL,
										L(aG).innerWidth(),
										L(aG).innerHeight()
									),
								L(aG)
									.find(
										"div.jqplot-table-legend-swatch-outline"
									)
									.each(function() {
										var aU = L(this);
										ak.strokeStyle = aU.css(
											"border-top-color"
										);
										var aQ = aI + aU.position().left,
											aR = aL + aU.position().top;
										ak.strokeRect(
											aQ,
											aR,
											aU.innerWidth(),
											aU.innerHeight()
										),
											(aQ += parseInt(
												aU.css("padding-left"),
												10
											)),
											(aR += parseInt(
												aU.css("padding-top"),
												10
											));
										var aT =
												aU.innerHeight() -
												2 *
													parseInt(
														aU.css("padding-top"),
														10
													),
											aP =
												aU.innerWidth() -
												2 *
													parseInt(
														aU.css("padding-left"),
														10
													),
											aS = aU.children(
												"div.jqplot-table-legend-swatch"
											);
										(ak.fillStyle = aS.css(
											"background-color"
										)),
											ak.fillRect(aQ, aR, aP, aT);
									}),
								L(aG)
									.find("td.jqplot-table-legend-label")
									.each(function() {
										var aR = L(this),
											aP = aI + aR.position().left,
											aQ =
												aL +
												aR.position().top +
												parseInt(
													aR.css("padding-top"),
													10
												);
										(ak.font = aR.jqplotGetComputedFontStyle()),
											(ak.fillStyle = aR.css("color")),
											aD(aR, ak, aR.text(), aP, aQ, aM);
									});
						} else "canvas" == aN && ak.drawImage(aG, aI, aL);
					else {
						L(aG)
							.children()
							.each(function() {
								aw(this, aI, aL);
							});
						var aO = L(aG).jqplotChildText();
						aO &&
							((ak.font = L(aG).jqplotGetComputedFontStyle()),
							(ak.fillStyle = L(aG).css("color")),
							aD(aG, ak, aO, aI, aL, aM));
					}
				}
				aj = aj || {};
				var av = null == aj.x_offset ? 0 : aj.x_offset,
					ax = null == aj.y_offset ? 0 : aj.y_offset,
					al =
						null == aj.backgroundColor
							? "rgb(255,255,255)"
							: aj.backgroundColor;
				if (0 == L(this).width() || 0 == L(this).height()) return null;
				if (L.jqplot.use_excanvas) return null;
				for (
					var ap,
						ah,
						ai,
						aB,
						an = document.createElement("canvas"),
						aA = L(this).outerHeight(!0),
						at = L(this).outerWidth(!0),
						am = L(this).offset(),
						ao = am.left,
						aq = am.top,
						au = 0,
						ar = 0,
						ay = [
							"jqplot-table-legend",
							"jqplot-xaxis-tick",
							"jqplot-x2axis-tick",
							"jqplot-yaxis-tick",
							"jqplot-y2axis-tick",
							"jqplot-y3axis-tick",
							"jqplot-y4axis-tick",
							"jqplot-y5axis-tick",
							"jqplot-y6axis-tick",
							"jqplot-y7axis-tick",
							"jqplot-y8axis-tick",
							"jqplot-y9axis-tick",
							"jqplot-xaxis-label",
							"jqplot-x2axis-label",
							"jqplot-yaxis-label",
							"jqplot-y2axis-label",
							"jqplot-y3axis-label",
							"jqplot-y4axis-label",
							"jqplot-y5axis-label",
							"jqplot-y6axis-label",
							"jqplot-y7axis-label",
							"jqplot-y8axis-label",
							"jqplot-y9axis-label"
						],
						az = 0;
					az < ay.length;
					az++
				)
					L(this)
						.find("." + ay[az])
						.each(function() {
							(ap = L(this).offset().top - aq),
								(ah = L(this).offset().left - ao),
								(aB = ah + L(this).outerWidth(!0) + au),
								(ai = ap + L(this).outerHeight(!0) + ar),
								-au > ah && ((at = at - au - ah), (au = -ah)),
								-ar > ap && ((aA = aA - ar - ap), (ar = -ap)),
								aB > at && (at = aB),
								ai > aA && (aA = ai);
						});
				(an.width = at + Number(av)), (an.height = aA + Number(ax));
				var ak = an.getContext("2d");
				return (
					ak.save(),
					(ak.fillStyle = al),
					ak.fillRect(0, 0, an.width, an.height),
					ak.restore(),
					ak.translate(au, ar),
					(ak.textAlign = "left"),
					(ak.textBaseline = "top"),
					L(this)
						.children()
						.each(function() {
							aw(this, av, ax);
						}),
					an
				);
			}),
			(L.fn.jqplotToImageStr = function(ai) {
				var ah = L(this).jqplotToImageCanvas(ai);
				return ah ? ah.toDataURL("image/png") : null;
			}),
			(L.fn.jqplotToImageElem = function(ah) {
				var ai = document.createElement("img"),
					aj = L(this).jqplotToImageStr(ah);
				return (ai.src = aj), ai;
			}),
			(L.fn.jqplotToImageElemStr = function(ah) {
				var ai = "<img src=" + L(this).jqplotToImageStr(ah) + " />";
				return ai;
			}),
			(L.fn.jqplotSaveImage = function() {
				var ah = L(this).jqplotToImageStr({});
				ah &&
					(window.location.href = ah.replace(
						"image/png",
						"image/octet-stream"
					));
			}),
			(L.fn.jqplotViewImage = function() {
				{
					var ai = L(this).jqplotToImageElemStr({});
					L(this).jqplotToImageStr({});
				}
				if (ai) {
					var ah = window.open("");
					ah.document.open("image/png"),
						ah.document.write(ai),
						ah.document.close(),
						(ah = null);
				}
			});
		var ag = function() {
			switch (((this.syntax = ag.config.syntax),
			(this._type = "jsDate"),
			(this.proxy = new Date()),
			(this.options = {}),
			(this.locale = ag.regional.getLocale()),
			(this.formatString = ""),
			(this.defaultCentury = ag.config.defaultCentury),
			arguments.length)) {
				case 0:
					break;
				case 1:
					if (
						"[object Object]" == l(arguments[0]) &&
						"jsDate" != arguments[0]._type
					) {
						var aj = (this.options = arguments[0]);
						(this.syntax = aj.syntax || this.syntax),
							(this.defaultCentury =
								aj.defaultCentury || this.defaultCentury),
							(this.proxy = ag.createDate(aj.date));
					} else this.proxy = ag.createDate(arguments[0]);
					break;
				default:
					for (var ah = [], ai = 0; ai < arguments.length; ai++)
						ah.push(arguments[ai]);
					(this.proxy = new Date()),
						this.proxy.setFullYear.apply(
							this.proxy,
							ah.slice(0, 3)
						),
						ah.slice(3).length &&
							this.proxy.setHours.apply(this.proxy, ah.slice(3));
			}
		};
		(ag.config = {
			defaultLocale: "en",
			syntax: "perl",
			defaultCentury: 1900
		}),
			(ag.prototype.add = function(aj, ai) {
				var ah = E[ai] || E.day;
				return (
					"number" == typeof ah
						? this.proxy.setTime(this.proxy.getTime() + ah * aj)
						: ah.add(this, aj),
					this
				);
			}),
			(ag.prototype.clone = function() {
				return new ag(this.proxy.getTime());
			}),
			(ag.prototype.getUtcOffset = function() {
				return 6e4 * this.proxy.getTimezoneOffset();
			}),
			(ag.prototype.diff = function(ai, al, ah) {
				if (((ai = new ag(ai)), null === ai)) return null;
				var aj = E[al] || E.day;
				if ("number" == typeof aj)
					var ak = (this.proxy.getTime() - ai.proxy.getTime()) / aj;
				else var ak = aj.diff(this.proxy, ai.proxy);
				return ah ? ak : Math[ak > 0 ? "floor" : "ceil"](ak);
			}),
			(ag.prototype.getAbbrDayName = function() {
				return ag.regional[this.locale].dayNamesShort[
					this.proxy.getDay()
				];
			}),
			(ag.prototype.getAbbrMonthName = function() {
				return ag.regional[this.locale].monthNamesShort[
					this.proxy.getMonth()
				];
			}),
			(ag.prototype.getAMPM = function() {
				return this.proxy.getHours() >= 12 ? "PM" : "AM";
			}),
			(ag.prototype.getAmPm = function() {
				return this.proxy.getHours() >= 12 ? "pm" : "am";
			}),
			(ag.prototype.getCentury = function() {
				return parseInt(this.proxy.getFullYear() / 100, 10);
			}),
			(ag.prototype.getDate = function() {
				return this.proxy.getDate();
			}),
			(ag.prototype.getDay = function() {
				return this.proxy.getDay();
			}),
			(ag.prototype.getDayOfWeek = function() {
				var ah = this.proxy.getDay();
				return 0 === ah ? 7 : ah;
			}),
			(ag.prototype.getDayOfYear = function() {
				var ai = this.proxy,
					ah = ai - new Date("" + ai.getFullYear() + "/1/1 GMT");
				return (
					(ah += 6e4 * ai.getTimezoneOffset()),
					(ai = null),
					parseInt(ah / 6e4 / 60 / 24, 10) + 1
				);
			}),
			(ag.prototype.getDayName = function() {
				return ag.regional[this.locale].dayNames[this.proxy.getDay()];
			}),
			(ag.prototype.getFullWeekOfYear = function() {
				var ak = this.proxy,
					ah = this.getDayOfYear(),
					aj = 6 - ak.getDay(),
					ai = parseInt((ah + aj) / 7, 10);
				return ai;
			}),
			(ag.prototype.getFullYear = function() {
				return this.proxy.getFullYear();
			}),
			(ag.prototype.getGmtOffset = function() {
				var ah = this.proxy.getTimezoneOffset() / 60,
					ai = 0 > ah ? "+" : "-";
				return (
					(ah = Math.abs(ah)),
					ai + N(Math.floor(ah), 2) + ":" + N((ah % 1) * 60, 2)
				);
			}),
			(ag.prototype.getHours = function() {
				return this.proxy.getHours();
			}),
			(ag.prototype.getHours12 = function() {
				var ah = this.proxy.getHours();
				return ah > 12 ? ah - 12 : 0 == ah ? 12 : ah;
			}),
			(ag.prototype.getIsoWeek = function() {
				var ak = this.proxy,
					aj = this.getWeekOfYear(),
					ah = new Date("" + ak.getFullYear() + "/1/1").getDay(),
					ai = aj + (ah > 4 || 1 >= ah ? 0 : 1);
				return (
					53 == ai &&
					new Date("" + ak.getFullYear() + "/12/31").getDay() < 4
						? (ai = 1)
						: 0 === ai &&
							((ak = new ag(
								new Date("" + (ak.getFullYear() - 1) + "/12/31")
							)),
							(ai = ak.getIsoWeek())),
					(ak = null),
					ai
				);
			}),
			(ag.prototype.getMilliseconds = function() {
				return this.proxy.getMilliseconds();
			}),
			(ag.prototype.getMinutes = function() {
				return this.proxy.getMinutes();
			}),
			(ag.prototype.getMonth = function() {
				return this.proxy.getMonth();
			}),
			(ag.prototype.getMonthName = function() {
				return ag.regional[this.locale].monthNames[
					this.proxy.getMonth()
				];
			}),
			(ag.prototype.getMonthNumber = function() {
				return this.proxy.getMonth() + 1;
			}),
			(ag.prototype.getSeconds = function() {
				return this.proxy.getSeconds();
			}),
			(ag.prototype.getShortYear = function() {
				return this.proxy.getYear() % 100;
			}),
			(ag.prototype.getTime = function() {
				return this.proxy.getTime();
			}),
			(ag.prototype.getTimezoneAbbr = function() {
				return this.proxy.toString().replace(/^.*\(([^)]+)\)$/, "$1");
			}),
			(ag.prototype.getTimezoneName = function() {
				var ah = /(?:\((.+)\)$| ([A-Z]{3}) )/.exec(this.toString());
				return ah[1] || ah[2] || "GMT" + this.getGmtOffset();
			}),
			(ag.prototype.getTimezoneOffset = function() {
				return this.proxy.getTimezoneOffset();
			}),
			(ag.prototype.getWeekOfYear = function() {
				var ah = this.getDayOfYear(),
					aj = 7 - this.getDayOfWeek(),
					ai = parseInt((ah + aj) / 7, 10);
				return ai;
			}),
			(ag.prototype.getUnix = function() {
				return Math.round(this.proxy.getTime() / 1e3, 0);
			}),
			(ag.prototype.getYear = function() {
				return this.proxy.getYear();
			}),
			(ag.prototype.next = function(ah) {
				return (ah = ah || "day"), this.clone().add(1, ah);
			}),
			(ag.prototype.set = function() {
				switch (arguments.length) {
					case 0:
						this.proxy = new Date();
						break;
					case 1:
						if (
							"[object Object]" == l(arguments[0]) &&
							"jsDate" != arguments[0]._type
						) {
							var aj = (this.options = arguments[0]);
							(this.syntax = aj.syntax || this.syntax),
								(this.defaultCentury =
									aj.defaultCentury || this.defaultCentury),
								(this.proxy = ag.createDate(aj.date));
						} else this.proxy = ag.createDate(arguments[0]);
						break;
					default:
						for (var ah = [], ai = 0; ai < arguments.length; ai++)
							ah.push(arguments[ai]);
						(this.proxy = new Date()),
							this.proxy.setFullYear.apply(
								this.proxy,
								ah.slice(0, 3)
							),
							ah.slice(3).length &&
								this.proxy.setHours.apply(
									this.proxy,
									ah.slice(3)
								);
				}
				return this;
			}),
			(ag.prototype.setDate = function(ah) {
				return this.proxy.setDate(ah), this;
			}),
			(ag.prototype.setFullYear = function() {
				return (
					this.proxy.setFullYear.apply(this.proxy, arguments), this
				);
			}),
			(ag.prototype.setHours = function() {
				return this.proxy.setHours.apply(this.proxy, arguments), this;
			}),
			(ag.prototype.setMilliseconds = function(ah) {
				return this.proxy.setMilliseconds(ah), this;
			}),
			(ag.prototype.setMinutes = function() {
				return this.proxy.setMinutes.apply(this.proxy, arguments), this;
			}),
			(ag.prototype.setMonth = function() {
				return this.proxy.setMonth.apply(this.proxy, arguments), this;
			}),
			(ag.prototype.setSeconds = function() {
				return this.proxy.setSeconds.apply(this.proxy, arguments), this;
			}),
			(ag.prototype.setTime = function(ah) {
				return this.proxy.setTime(ah), this;
			}),
			(ag.prototype.setYear = function() {
				return this.proxy.setYear.apply(this.proxy, arguments), this;
			}),
			(ag.prototype.strftime = function(ah) {
				return (
					(ah =
						ah ||
						this.formatString ||
						ag.regional[this.locale].formatString),
					ag.strftime(this, ah, this.syntax)
				);
			}),
			(ag.prototype.toString = function() {
				return this.proxy.toString();
			}),
			(ag.prototype.toYmdInt = function() {
				return (
					1e4 * this.proxy.getFullYear() +
					100 * this.getMonthNumber() +
					this.proxy.getDate()
				);
			}),
			(ag.regional = {
				en: {
					monthNames: [
						"January",
						"February",
						"March",
						"April",
						"May",
						"June",
						"July",
						"August",
						"September",
						"October",
						"November",
						"December"
					],
					monthNamesShort: [
						"Jan",
						"Feb",
						"Mar",
						"Apr",
						"May",
						"Jun",
						"Jul",
						"Aug",
						"Sep",
						"Oct",
						"Nov",
						"Dec"
					],
					dayNames: [
						"Sunday",
						"Monday",
						"Tuesday",
						"Wednesday",
						"Thursday",
						"Friday",
						"Saturday"
					],
					dayNamesShort: [
						"Sun",
						"Mon",
						"Tue",
						"Wed",
						"Thu",
						"Fri",
						"Sat"
					],
					formatString: "%Y-%m-%d %H:%M:%S"
				},
				fr: {
					monthNames: [
						"Janvier",
						"Février",
						"Mars",
						"Avril",
						"Mai",
						"Juin",
						"Juillet",
						"Août",
						"Septembre",
						"Octobre",
						"Novembre",
						"Décembre"
					],
					monthNamesShort: [
						"Jan",
						"Fév",
						"Mar",
						"Avr",
						"Mai",
						"Jun",
						"Jul",
						"Aoû",
						"Sep",
						"Oct",
						"Nov",
						"Déc"
					],
					dayNames: [
						"Dimanche",
						"Lundi",
						"Mardi",
						"Mercredi",
						"Jeudi",
						"Vendredi",
						"Samedi"
					],
					dayNamesShort: [
						"Dim",
						"Lun",
						"Mar",
						"Mer",
						"Jeu",
						"Ven",
						"Sam"
					],
					formatString: "%Y-%m-%d %H:%M:%S"
				},
				de: {
					monthNames: [
						"Januar",
						"Februar",
						"März",
						"April",
						"Mai",
						"Juni",
						"Juli",
						"August",
						"September",
						"Oktober",
						"November",
						"Dezember"
					],
					monthNamesShort: [
						"Jan",
						"Feb",
						"Mär",
						"Apr",
						"Mai",
						"Jun",
						"Jul",
						"Aug",
						"Sep",
						"Okt",
						"Nov",
						"Dez"
					],
					dayNames: [
						"Sonntag",
						"Montag",
						"Dienstag",
						"Mittwoch",
						"Donnerstag",
						"Freitag",
						"Samstag"
					],
					dayNamesShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
					formatString: "%Y-%m-%d %H:%M:%S"
				},
				es: {
					monthNames: [
						"Enero",
						"Febrero",
						"Marzo",
						"Abril",
						"Mayo",
						"Junio",
						"Julio",
						"Agosto",
						"Septiembre",
						"Octubre",
						"Noviembre",
						"Diciembre"
					],
					monthNamesShort: [
						"Ene",
						"Feb",
						"Mar",
						"Abr",
						"May",
						"Jun",
						"Jul",
						"Ago",
						"Sep",
						"Oct",
						"Nov",
						"Dic"
					],
					dayNames: [
						"Domingo",
						"Lunes",
						"Martes",
						"Mi&eacute;rcoles",
						"Jueves",
						"Viernes",
						"S&aacute;bado"
					],
					dayNamesShort: [
						"Dom",
						"Lun",
						"Mar",
						"Mi&eacute;",
						"Juv",
						"Vie",
						"S&aacute;b"
					],
					formatString: "%Y-%m-%d %H:%M:%S"
				},
				ru: {
					monthNames: [
						"Январь",
						"Февраль",
						"Март",
						"Апрель",
						"Май",
						"Июнь",
						"Июль",
						"Август",
						"Сентябрь",
						"Октябрь",
						"Ноябрь",
						"Декабрь"
					],
					monthNamesShort: [
						"Янв",
						"Фев",
						"Мар",
						"Апр",
						"Май",
						"Июн",
						"Июл",
						"Авг",
						"Сен",
						"Окт",
						"Ноя",
						"Дек"
					],
					dayNames: [
						"воскресенье",
						"понедельник",
						"вторник",
						"среда",
						"четверг",
						"пятница",
						"суббота"
					],
					dayNamesShort: [
						"вск",
						"пнд",
						"втр",
						"срд",
						"чтв",
						"птн",
						"сбт"
					],
					formatString: "%Y-%m-%d %H:%M:%S"
				},
				ar: {
					monthNames: [
						"كانون الثاني",
						"شباط",
						"آذار",
						"نيسان",
						"آذار",
						"حزيران",
						"تموز",
						"آب",
						"أيلول",
						"تشرين الأول",
						"تشرين الثاني",
						"كانون الأول"
					],
					monthNamesShort: [
						"1",
						"2",
						"3",
						"4",
						"5",
						"6",
						"7",
						"8",
						"9",
						"10",
						"11",
						"12"
					],
					dayNames: [
						"السبت",
						"الأحد",
						"الاثنين",
						"الثلاثاء",
						"الأربعاء",
						"الخميس",
						"الجمعة"
					],
					dayNamesShort: [
						"سبت",
						"أحد",
						"اثنين",
						"ثلاثاء",
						"أربعاء",
						"خميس",
						"جمعة"
					],
					formatString: "%Y-%m-%d %H:%M:%S"
				},
				pt: {
					monthNames: [
						"Janeiro",
						"Fevereiro",
						"Mar&ccedil;o",
						"Abril",
						"Maio",
						"Junho",
						"Julho",
						"Agosto",
						"Setembro",
						"Outubro",
						"Novembro",
						"Dezembro"
					],
					monthNamesShort: [
						"Jan",
						"Fev",
						"Mar",
						"Abr",
						"Mai",
						"Jun",
						"Jul",
						"Ago",
						"Set",
						"Out",
						"Nov",
						"Dez"
					],
					dayNames: [
						"Domingo",
						"Segunda-feira",
						"Ter&ccedil;a-feira",
						"Quarta-feira",
						"Quinta-feira",
						"Sexta-feira",
						"S&aacute;bado"
					],
					dayNamesShort: [
						"Dom",
						"Seg",
						"Ter",
						"Qua",
						"Qui",
						"Sex",
						"S&aacute;b"
					],
					formatString: "%Y-%m-%d %H:%M:%S"
				},
				"pt-BR": {
					monthNames: [
						"Janeiro",
						"Fevereiro",
						"Mar&ccedil;o",
						"Abril",
						"Maio",
						"Junho",
						"Julho",
						"Agosto",
						"Setembro",
						"Outubro",
						"Novembro",
						"Dezembro"
					],
					monthNamesShort: [
						"Jan",
						"Fev",
						"Mar",
						"Abr",
						"Mai",
						"Jun",
						"Jul",
						"Ago",
						"Set",
						"Out",
						"Nov",
						"Dez"
					],
					dayNames: [
						"Domingo",
						"Segunda-feira",
						"Ter&ccedil;a-feira",
						"Quarta-feira",
						"Quinta-feira",
						"Sexta-feira",
						"S&aacute;bado"
					],
					dayNamesShort: [
						"Dom",
						"Seg",
						"Ter",
						"Qua",
						"Qui",
						"Sex",
						"S&aacute;b"
					],
					formatString: "%Y-%m-%d %H:%M:%S"
				},
				pl: {
					monthNames: [
						"Styczeń",
						"Luty",
						"Marzec",
						"Kwiecień",
						"Maj",
						"Czerwiec",
						"Lipiec",
						"Sierpień",
						"Wrzesień",
						"Październik",
						"Listopad",
						"Grudzień"
					],
					monthNamesShort: [
						"Sty",
						"Lut",
						"Mar",
						"Kwi",
						"Maj",
						"Cze",
						"Lip",
						"Sie",
						"Wrz",
						"Paź",
						"Lis",
						"Gru"
					],
					dayNames: [
						"Niedziela",
						"Poniedziałek",
						"Wtorek",
						"Środa",
						"Czwartek",
						"Piątek",
						"Sobota"
					],
					dayNamesShort: ["Ni", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"],
					formatString: "%Y-%m-%d %H:%M:%S"
				},
				nl: {
					monthNames: [
						"Januari",
						"Februari",
						"Maart",
						"April",
						"Mei",
						"Juni",
						"July",
						"Augustus",
						"September",
						"Oktober",
						"November",
						"December"
					],
					monthNamesShort: [
						"Jan",
						"Feb",
						"Mar",
						"Apr",
						"Mei",
						"Jun",
						"Jul",
						"Aug",
						"Sep",
						"Okt",
						"Nov",
						"Dec"
					],
					dayNames: ",".Zaterdag,
					dayNamesShort: ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"],
					formatString: "%Y-%m-%d %H:%M:%S"
				},
				sv: {
					monthNames: [
						"januari",
						"februari",
						"mars",
						"april",
						"maj",
						"juni",
						"juli",
						"augusti",
						"september",
						"oktober",
						"november",
						"december"
					],
					monthNamesShort: [
						"jan",
						"feb",
						"mar",
						"apr",
						"maj",
						"jun",
						"jul",
						"aug",
						"sep",
						"okt",
						"nov",
						"dec"
					],
					dayNames: [
						"söndag",
						"måndag",
						"tisdag",
						"onsdag",
						"torsdag",
						"fredag",
						"lördag"
					],
					dayNamesShort: [
						"sön",
						"mån",
						"tis",
						"ons",
						"tor",
						"fre",
						"lör"
					],
					formatString: "%Y-%m-%d %H:%M:%S"
				}
			}),
			(ag.regional["en-US"] = ag.regional["en-GB"] = ag.regional.en),
			(ag.regional.getLocale = function() {
				var ah = ag.config.defaultLocale;
				return (
					document &&
						document.getElementsByTagName("html") &&
						document.getElementsByTagName("html")[0].lang &&
						((ah = document.getElementsByTagName("html")[0].lang),
						ag.regional.hasOwnProperty(ah) ||
							(ah = ag.config.defaultLocale)),
					ah
				);
			});
		var C = 864e5,
			N = function(ah, ak) {
				ah = String(ah);
				var ai = ak - ah.length,
					aj = String(Math.pow(10, ai)).slice(1);
				return aj.concat(ah);
			},
			E = {
				millisecond: 1,
				second: 1e3,
				minute: 6e4,
				hour: 36e5,
				day: C,
				week: 7 * C,
				month: {
					add: function(aj, ah) {
						E.year.add(
							aj,
							Math[ah > 0 ? "floor" : "ceil"](ah / 12)
						);
						var ai = aj.getMonth() + ah % 12;
						12 == ai
							? ((ai = 0), aj.setYear(aj.getFullYear() + 1))
							: -1 == ai &&
								((ai = 11), aj.setYear(aj.getFullYear() - 1)),
							aj.setMonth(ai);
					},
					diff: function(al, aj) {
						var ah = al.getFullYear() - aj.getFullYear(),
							ai = al.getMonth() - aj.getMonth() + 12 * ah,
							ak = al.getDate() - aj.getDate();
						return ai + ak / 30;
					}
				},
				year: {
					add: function(ai, ah) {
						ai.setYear(
							ai.getFullYear() +
								Math[ah > 0 ? "floor" : "ceil"](ah)
						);
					},
					diff: function(ai, ah) {
						return E.month.diff(ai, ah) / 12;
					}
				}
			};
		for (var Y in E)
			"s" != Y.substring(Y.length - 1) && (E[Y + "s"] = E[Y]);
		var H = function(al, ak, ai) {
			if (ag.formats[ai].shortcuts[ak])
				return ag.strftime(al, ag.formats[ai].shortcuts[ak], ai);
			var ah = (ag.formats[ai].codes[ak] || "").split("."),
				aj = al["get" + ah[0]] ? al["get" + ah[0]]() : "";
			return ah[1] && (aj = N(aj, ah[1])), aj;
		};
		(ag.strftime = function(an, ak, aj, ao) {
			var ai = "perl",
				am = ag.regional.getLocale();
			aj && ag.formats.hasOwnProperty(aj)
				? (ai = aj)
				: aj && ag.regional.hasOwnProperty(aj) && (am = aj),
				ao && ag.formats.hasOwnProperty(ao)
					? (ai = ao)
					: ao && ag.regional.hasOwnProperty(ao) && (am = ao),
				("[object Object]" != l(an) || "jsDate" != an._type) &&
					((an = new ag(an)), (an.locale = am)),
				ak || (ak = an.formatString || ag.regional[am].formatString);
			for (var al, ah = ak || "%Y-%m-%d", ap = ""; ah.length > 0; )
				(al = ah.match(ag.formats[ai].codes.matcher))
					? ((ap += ah.slice(0, al.index)),
						(ap += (al[1] || "") + H(an, al[2], ai)),
						(ah = ah.slice(al.index + al[0].length)))
					: ((ap += ah), (ah = ""));
			return ap;
		}),
			(ag.formats = {
				ISO: "%Y-%m-%dT%H:%M:%S.%N%G",
				SQL: "%Y-%m-%d %H:%M:%S"
			}),
			(ag.formats.perl = {
				codes: {
					matcher: /()%(#?(%|[a-z]))/i,
					Y: "FullYear",
					y: "ShortYear.2",
					m: "MonthNumber.2",
					"#m": "MonthNumber",
					B: "MonthName",
					b: "AbbrMonthName",
					d: "Date.2",
					"#d": "Date",
					e: "Date",
					A: "DayName",
					a: "AbbrDayName",
					w: "Day",
					H: "Hours.2",
					"#H": "Hours",
					I: "Hours12.2",
					"#I": "Hours12",
					p: "AMPM",
					M: "Minutes.2",
					"#M": "Minutes",
					S: "Seconds.2",
					"#S": "Seconds",
					s: "Unix",
					N: "Milliseconds.3",
					"#N": "Milliseconds",
					O: "TimezoneOffset",
					Z: "TimezoneName",
					G: "GmtOffset"
				},
				shortcuts: {
					F: "%Y-%m-%d",
					T: "%H:%M:%S",
					X: "%H:%M:%S",
					x: "%m/%d/%y",
					D: "%m/%d/%y",
					"#c": "%a %b %e %H:%M:%S %Y",
					v: "%e-%b-%Y",
					R: "%H:%M",
					r: "%I:%M:%S %p",
					t: "	",
					n: "\n",
					"%": "%"
				}
			}),
			(ag.formats.php = {
				codes: {
					matcher: /()%((%|[a-z]))/i,
					a: "AbbrDayName",
					A: "DayName",
					d: "Date.2",
					e: "Date",
					j: "DayOfYear.3",
					u: "DayOfWeek",
					w: "Day",
					U: "FullWeekOfYear.2",
					V: "IsoWeek.2",
					W: "WeekOfYear.2",
					b: "AbbrMonthName",
					B: "MonthName",
					m: "MonthNumber.2",
					h: "AbbrMonthName",
					C: "Century.2",
					y: "ShortYear.2",
					Y: "FullYear",
					H: "Hours.2",
					I: "Hours12.2",
					l: "Hours12",
					p: "AMPM",
					P: "AmPm",
					M: "Minutes.2",
					S: "Seconds.2",
					s: "Unix",
					O: "TimezoneOffset",
					z: "GmtOffset",
					Z: "TimezoneAbbr"
				},
				shortcuts: {
					D: "%m/%d/%y",
					F: "%Y-%m-%d",
					T: "%H:%M:%S",
					X: "%H:%M:%S",
					x: "%m/%d/%y",
					R: "%H:%M",
					r: "%I:%M:%S %p",
					t: "	",
					n: "\n",
					"%": "%"
				}
			}),
			(ag.createDate = function(aj) {
				function ar(ax, aw) {
					var av,
						au,
						aD,
						ay,
						aC = parseFloat(aw[1]),
						aB = parseFloat(aw[2]),
						aA = parseFloat(aw[3]),
						az = ag.config.defaultCentury;
					return (
						aC > 31
							? ((au = aA), (aD = aB), (av = az + aC))
							: ((au = aB), (aD = aC), (av = az + aA)),
						(ay = aD + "/" + au + "/" + av),
						ax.replace(
							/^([0-9]{1,2})[-\/]([0-9]{1,2})[-\/]([0-9]{1,2})/,
							ay
						)
					);
				}
				if (null == aj) return new Date();
				if (aj instanceof Date) return aj;
				if ("number" == typeof aj) return new Date(aj);
				var ao = String(aj).replace(/^\s*(.+)\s*$/g, "$1");
				(ao = ao.replace(
					/^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,4})/,
					"$1/$2/$3"
				)),
					(ao = ao.replace(
						/^(3[01]|[0-2]?\d)[-\/]([a-z]{3,})[-\/](\d{4})/i,
						"$1 $2 $3"
					));
				var an = ao.match(
					/^(3[01]|[0-2]?\d)[-\/]([a-z]{3,})[-\/](\d{2})\D*/i
				);
				if (an && an.length > 3) {
					var at = parseFloat(an[3]),
						am = ag.config.defaultCentury + at;
					(am = String(am)),
						(ao = ao.replace(
							/^(3[01]|[0-2]?\d)[-\/]([a-z]{3,})[-\/](\d{2})\D*/i,
							an[1] + " " + an[2] + " " + am
						));
				}
				(an = ao.match(
					/^([0-9]{1,2})[-\/]([0-9]{1,2})[-\/]([0-9]{1,2})[^0-9]/
				)),
					an && an.length > 3 && (ao = ar(ao, an));
				var an = ao.match(
					/^([0-9]{1,2})[-\/]([0-9]{1,2})[-\/]([0-9]{1,2})$/
				);
				an && an.length > 3 && (ao = ar(ao, an));
				for (
					var aq, ah, ak, al = 0, ai = ag.matchers.length, ap = ao;
					ai > al;

				) {
					if (((ah = Date.parse(ap)), !isNaN(ah)))
						return new Date(ah);
					if (((aq = ag.matchers[al]), "function" == typeof aq)) {
						if (((ak = aq.call(ag, ap)), ak instanceof Date))
							return ak;
					} else ap = ao.replace(aq[0], aq[1]);
					al++;
				}
				return 0 / 0;
			}),
			(ag.daysInMonth = function(ah, ai) {
				return 2 == ai
					? 29 == new Date(ah, 1, 29).getDate() ? 29 : 28
					: [u, 31, u, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][ai];
			}),
			(ag.matchers = [
				[
					/(3[01]|[0-2]\d)\s*\.\s*(1[0-2]|0\d)\s*\.\s*([1-9]\d{3})/,
					"$2/$1/$3"
				],
				[
					/([1-9]\d{3})\s*-\s*(1[0-2]|0\d)\s*-\s*(3[01]|[0-2]\d)/,
					"$2/$3/$1"
				],
				function(ak) {
					var ai = ak.match(
						/^(?:(.+)\s+)?([012]?\d)(?:\s*\:\s*(\d\d))?(?:\s*\:\s*(\d\d(\.\d*)?))?\s*(am|pm)?\s*$/i
					);
					if (ai) {
						if (ai[1]) {
							var aj = this.createDate(ai[1]);
							if (isNaN(aj)) return;
						} else {
							var aj = new Date();
							aj.setMilliseconds(0);
						}
						var ah = parseFloat(ai[2]);
						return (
							ai[6] &&
								(ah =
									"am" == ai[6].toLowerCase()
										? 12 == ah ? 0 : ah
										: 12 == ah ? 12 : ah + 12),
							aj.setHours(
								ah,
								parseInt(ai[3] || 0, 10),
								parseInt(ai[4] || 0, 10),
								1e3 * (parseFloat(ai[5] || 0) || 0)
							),
							aj
						);
					}
					return ak;
				},
				function(ak) {
					var ai = ak.match(
						/^(?:(.+))[T|\s+]([012]\d)(?:\:(\d\d))(?:\:(\d\d))(?:\.\d+)([\+\-]\d\d\:\d\d)$/i
					);
					if (ai) {
						if (ai[1]) {
							var aj = this.createDate(ai[1]);
							if (isNaN(aj)) return;
						} else {
							var aj = new Date();
							aj.setMilliseconds(0);
						}
						var ah = parseFloat(ai[2]);
						return (
							aj.setHours(
								ah,
								parseInt(ai[3], 10),
								parseInt(ai[4], 10),
								1e3 * parseFloat(ai[5])
							),
							aj
						);
					}
					return ak;
				},
				function(al) {
					var aj = al.match(
						/^([0-3]?\d)\s*[-\/.\s]{1}\s*([a-zA-Z]{3,9})\s*[-\/.\s]{1}\s*([0-3]?\d)$/
					);
					if (aj) {
						var ai,
							ah,
							ap,
							ak = new Date(),
							am = ag.config.defaultCentury,
							ao = parseFloat(aj[1]),
							an = parseFloat(aj[3]);
						ao > 31
							? ((ah = an), (ai = am + ao))
							: ((ah = ao), (ai = am + an));
						var ap = ab(
							aj[2],
							ag.regional[ag.regional.getLocale()].monthNamesShort
						);
						return (
							-1 == ap &&
								(ap = ab(
									aj[2],
									ag.regional[ag.regional.getLocale()]
										.monthNames
								)),
							ak.setFullYear(ai, ap, ah),
							ak.setHours(0, 0, 0, 0),
							ak
						);
					}
					return al;
				}
			]),
			(L.jsDate = ag),
			(L.jqplot.sprintf = function() {
				function an(au, ap, aq, at) {
					var ar =
						au.length >= ap
							? ""
							: Array((1 + ap - au.length) >>> 0).join(aq);
					return at ? au + ar : ar + au;
				}
				function ak(ar) {
					for (
						var aq = new String(ar), ap = 10;
						ap > 0 &&
						aq !=
							(aq = aq.replace(
								/^(\d+)(\d{3})/,
								"$1" +
									L.jqplot.sprintf.thousandsSeparator +
									"$2"
							));
						ap--
					);
					return aq;
				}
				function aj(av, au, ax, ar, at, aq) {
					var aw = ar - av.length;
					if (aw > 0) {
						var ap = " ";
						aq && (ap = "&nbsp;"),
							(av =
								ax || !at
									? an(av, ar, ap, ax)
									: av.slice(0, au.length) +
										an("", aw, "0", !0) +
										av.slice(au.length));
					}
					return av;
				}
				function ao(ay, aq, aw, ar, ap, av, ax, au) {
					var at = ay >>> 0;
					return (
						(aw =
							(aw && at && { 2: "0b", 8: "0", 16: "0x" }[aq]) ||
							""),
						(ay = aw + an(at.toString(aq), av || 0, "0", !1)),
						aj(ay, aw, ar, ap, ax, au)
					);
				}
				function ah(au, av, ar, ap, at, aq) {
					return (
						null != ap && (au = au.slice(0, ap)),
						aj(au, "", av, ar, at, aq)
					);
				}
				var ai = arguments,
					al = 0,
					am = ai[al++];
				return am.replace(L.jqplot.sprintf.regex, function(
					aM,
					ax,
					ay,
					aB,
					aO,
					aJ,
					av
				) {
					if ("%%" == aM) return "%";
					for (
						var aD = !1,
							az = "",
							aA = !1,
							aL = !1,
							aw = !1,
							au = !1,
							aI = 0;
						ay && aI < ay.length;
						aI++
					)
						switch (ay.charAt(aI)) {
							case " ":
								az = " ";
								break;
							case "+":
								az = "+";
								break;
							case "-":
								aD = !0;
								break;
							case "0":
								aA = !0;
								break;
							case "#":
								aL = !0;
								break;
							case "&":
								aw = !0;
								break;
							case "'":
								au = !0;
						}
					if (
						((aB = aB
							? "*" == aB
								? +ai[al++]
								: "*" == aB.charAt(0) ? +ai[aB.slice(1, -1)] : +aB
							: 0),
						0 > aB && ((aB = -aB), (aD = !0)),
						!isFinite(aB))
					)
						throw new Error(
							"$.jqplot.sprintf: (minimum-)width must be finite"
						);
					aJ = aJ
						? "*" == aJ
							? +ai[al++]
							: "*" == aJ.charAt(0) ? +ai[aJ.slice(1, -1)] : +aJ
						: "fFeE".indexOf(av) > -1 ? 6 : "d" == av ? 0 : void 0;
					var aF = ax ? ai[ax.slice(0, -1)] : ai[al++];
					switch (av) {
						case "s":
							return null == aF
								? ""
								: ah(String(aF), aD, aB, aJ, aA, aw);
						case "c":
							return ah(
								String.fromCharCode(+aF),
								aD,
								aB,
								aJ,
								aA,
								aw
							);
						case "b":
							return ao(aF, 2, aL, aD, aB, aJ, aA, aw);
						case "o":
							return ao(aF, 8, aL, aD, aB, aJ, aA, aw);
						case "x":
							return ao(aF, 16, aL, aD, aB, aJ, aA, aw);
						case "X":
							return ao(
								aF,
								16,
								aL,
								aD,
								aB,
								aJ,
								aA,
								aw
							).toUpperCase();
						case "u":
							return ao(aF, 10, aL, aD, aB, aJ, aA, aw);
						case "i":
							var ar = parseInt(+aF, 10);
							if (isNaN(ar)) return "";
							var aH = 0 > ar ? "-" : az,
								aK = au
									? ak(String(Math.abs(ar)))
									: String(Math.abs(ar));
							return (
								(aF = aH + an(aK, aJ, "0", !1)),
								aj(aF, aH, aD, aB, aA, aw)
							);
						case "d":
							var ar = Math.round(+aF);
							if (isNaN(ar)) return "";
							var aH = 0 > ar ? "-" : az,
								aK = au
									? ak(String(Math.abs(ar)))
									: String(Math.abs(ar));
							return (
								(aF = aH + an(aK, aJ, "0", !1)),
								aj(aF, aH, aD, aB, aA, aw)
							);
						case "e":
						case "E":
						case "f":
						case "F":
						case "g":
						case "G":
							var ar = +aF;
							if (isNaN(ar)) return "";
							var aH = 0 > ar ? "-" : az,
								at = [
									"toExponential",
									"toFixed",
									"toPrecision"
								]["efg".indexOf(av.toLowerCase())],
								aN = ["toString", "toUpperCase"][
									"eEfFgG".indexOf(av) % 2
								],
								aK = Math.abs(ar)[at](aJ),
								aE = aK.toString().split(".");
							(aE[0] = au ? ak(aE[0]) : aE[0]),
								(aK = aE.join(L.jqplot.sprintf.decimalMark)),
								(aF = aH + aK);
							var aC = aj(aF, aH, aD, aB, aA, aw)[aN]();
							return aC;
						case "p":
						case "P":
							var ar = +aF;
							if (isNaN(ar)) return "";
							var aH = 0 > ar ? "-" : az,
								aE = String(
									Number(Math.abs(ar)).toExponential()
								).split(/e|E/),
								aq =
									-1 != aE[0].indexOf(".")
										? aE[0].length - 1
										: String(ar).length,
								aG = aE[1] < 0 ? -aE[1] - 1 : 0;
							if (Math.abs(ar) < 1)
								aF =
									aJ >= aq + aG
										? aH + Math.abs(ar).toPrecision(aq)
										: aJ - 1 >= aq
											? aH +
												Math.abs(ar).toExponential(aq - 1)
											: aH +
												Math.abs(ar).toExponential(aJ - 1);
							else {
								var ap = aJ >= aq ? aq : aJ;
								aF = aH + Math.abs(ar).toPrecision(ap);
							}
							var aN = ["toString", "toUpperCase"][
								"pP".indexOf(av) % 2
							];
							return aj(aF, aH, aD, aB, aA, aw)[aN]();
						case "n":
							return "";
						default:
							return aM;
					}
				});
			}),
			(L.jqplot.sprintf.thousandsSeparator = ","),
			(L.jqplot.sprintf.decimalMark = "."),
			(L.jqplot.sprintf.regex = /%%|%(\d+\$)?([-+#0&\' ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([nAscboxXuidfegpEGP])/g),
			(L.jqplot.getSignificantFigures = function(al) {
				var an = String(Number(Math.abs(al)).toExponential()).split(
						/e|E/
					),
					am =
						-1 != an[0].indexOf(".")
							? an[0].length - 1
							: an[0].length,
					ai = an[1] < 0 ? -an[1] - 1 : 0,
					ah = parseInt(an[1], 10),
					aj = ah + 1 > 0 ? ah + 1 : 0,
					ak = aj >= am ? 0 : am - ah - 1;
				return {
					significantDigits: am,
					digitsLeft: aj,
					digitsRight: ak,
					zeros: ai,
					exponent: ah
				};
			}),
			(L.jqplot.getPrecision = function(ah) {
				return L.jqplot.getSignificantFigures(ah).digitsRight;
			});
		var X = L.uiBackCompat !== !1;
		L.jqplot.effects = { effect: {} };
		var m = "jqplot.storage.";
		L.extend(L.jqplot.effects, {
			version: "1.9pre",
			save: function(ai, aj) {
				for (var ah = 0; ah < aj.length; ah++)
					null !== aj[ah] && ai.data(m + aj[ah], ai[0].style[aj[ah]]);
			},
			restore: function(ai, aj) {
				for (var ah = 0; ah < aj.length; ah++)
					null !== aj[ah] && ai.css(aj[ah], ai.data(m + aj[ah]));
			},
			setMode: function(ah, ai) {
				return (
					"toggle" === ai &&
						(ai = ah.is(":hidden") ? "show" : "hide"),
					ai
				);
			},
			createWrapper: function(ai) {
				if (ai.parent().is(".ui-effects-wrapper")) return ai.parent();
				var aj = {
						width: ai.outerWidth(!0),
						height: ai.outerHeight(!0),
						float: ai.css("float")
					},
					al = L("<div></div>")
						.addClass("ui-effects-wrapper")
						.css({
							fontSize: "100%",
							background: "transparent",
							border: "none",
							margin: 0,
							padding: 0
						}),
					ah = { width: ai.width(), height: ai.height() },
					ak = document.activeElement;
				return (
					ai.wrap(al),
					(ai[0] === ak || L.contains(ai[0], ak)) && L(ak).focus(),
					(al = ai.parent()),
					"static" === ai.css("position")
						? (al.css({ position: "relative" }),
							ai.css({ position: "relative" }))
						: (L.extend(aj, {
								position: ai.css("position"),
								zIndex: ai.css("z-index")
							}),
							L.each(["top", "left", "bottom", "right"], function(
								am,
								an
							) {
								(aj[an] = ai.css(an)),
									isNaN(parseInt(aj[an], 10)) &&
										(aj[an] = "auto");
							}),
							ai.css({
								position: "relative",
								top: 0,
								left: 0,
								right: "auto",
								bottom: "auto"
							})),
					ai.css(ah),
					al.css(aj).show()
				);
			},
			removeWrapper: function(ah) {
				var ai = document.activeElement;
				return (
					ah.parent().is(".ui-effects-wrapper") &&
						(ah.parent().replaceWith(ah),
						(ah[0] === ai || L.contains(ah[0], ai)) &&
							L(ai).focus()),
					ah
				);
			}
		}),
			L.fn.extend({
				jqplotEffect: function() {
					function aj(au) {
						function ar() {
							L.isFunction(at) && at.call(av[0]),
								L.isFunction(au) && au();
						}
						var av = L(this),
							at = an.complete,
							aw = an.mode;
						(av.is(":hidden") ? "hide" === aw : "show" === aw)
							? ar()
							: am.call(av[0], an, ar);
					}
					var an = j.apply(this, arguments),
						ak = an.mode,
						al = an.queue,
						am = L.jqplot.effects.effect[an.effect],
						ah = !am && X && L.jqplot.effects[an.effect];
					return L.fx.off || (!am && !ah)
						? ak
							? this[ak](an.duration, an.complete)
							: this.each(function() {
									an.complete && an.complete.call(this);
								})
						: am
							? al === !1
								? this.each(aj)
								: this.queue(al || "fx", aj)
							: ah.call(this, {
									options: an,
									duration: an.duration,
									callback: an.complete,
									mode: an.mode
								});
				}
			});
		var a = /up|down|vertical/,
			v = /up|left|vertical|horizontal/;
		L.jqplot.effects.effect.blind = function(aj, ao) {
			var ai,
				ah,
				at,
				ak = L(this),
				ar = [
					"position",
					"top",
					"bottom",
					"left",
					"right",
					"height",
					"width"
				],
				ap = L.jqplot.effects.setMode(ak, aj.mode || "hide"),
				au = aj.direction || "up",
				am = a.test(au),
				al = am ? "height" : "width",
				aq = am ? "top" : "left",
				aw = v.test(au),
				an = {},
				av = "show" === ap;
			ak.parent().is(".ui-effects-wrapper")
				? L.jqplot.effects.save(ak.parent(), ar)
				: L.jqplot.effects.save(ak, ar),
				ak.show(),
				(at = parseInt(ak.css("top"), 10)),
				(ai = L.jqplot.effects
					.createWrapper(ak)
					.css({ overflow: "hidden" })),
				(ah = am ? ai[al]() + at : ai[al]()),
				(an[al] = av ? String(ah) : "0"),
				aw ||
					(ak
						.css(am ? "bottom" : "right", 0)
						.css(am ? "top" : "left", "")
						.css({ position: "absolute" }),
					(an[aq] = av ? "0" : String(ah))),
				av && (ai.css(al, 0), aw || ai.css(aq, ah)),
				ai.animate(an, {
					duration: aj.duration,
					easing: aj.easing,
					queue: !1,
					complete: function() {
						"hide" === ap && ak.hide(),
							L.jqplot.effects.restore(ak, ar),
							L.jqplot.effects.removeWrapper(ak),
							ao();
					}
				});
		};
	})(jQuery),
	(function(a) {
		(a.jqplot.CanvasTextRenderer = function(b) {
			(this.fontStyle = "normal"),
				(this.fontVariant = "normal"),
				(this.fontWeight = "normal"),
				(this.fontSize = "10px"),
				(this.fontFamily = "sans-serif"),
				(this.fontStretch = 1),
				(this.fillStyle = "#666666"),
				(this.angle = 0),
				(this.textAlign = "start"),
				(this.textBaseline = "alphabetic"),
				this.text,
				this.width,
				this.height,
				(this.pt2px = 1.28),
				a.extend(!0, this, b),
				(this.normalizedFontSize = this.normalizeFontSize(
					this.fontSize
				)),
				this.setHeight();
		}),
			(a.jqplot.CanvasTextRenderer.prototype.init = function(b) {
				a.extend(!0, this, b),
					(this.normalizedFontSize = this.normalizeFontSize(
						this.fontSize
					)),
					this.setHeight();
			}),
			(a.jqplot.CanvasTextRenderer.prototype.normalizeFontSize = function(
				b
			) {
				b = String(b);
				var c = parseFloat(b);
				return b.indexOf("px") > -1
					? c / this.pt2px
					: b.indexOf("pt") > -1
						? c
						: b.indexOf("em") > -1
							? 12 * c
							: b.indexOf("%") > -1 ? 12 * c / 100 : c / this.pt2px;
			}),
			(a.jqplot.CanvasTextRenderer.prototype.fontWeight2Float = function(
				b
			) {
				if (Number(b)) return b / 400;
				switch (b) {
					case "normal":
						return 1;
					case "bold":
						return 1.75;
					case "bolder":
						return 2.25;
					case "lighter":
						return 0.75;
					default:
						return 1;
				}
			}),
			(a.jqplot.CanvasTextRenderer.prototype.getText = function() {
				return this.text;
			}),
			(a.jqplot.CanvasTextRenderer.prototype.setText = function(c, b) {
				return (this.text = c), this.setWidth(b), this;
			}),
			(a.jqplot.CanvasTextRenderer.prototype.getWidth = function() {
				return this.width;
			}),
			(a.jqplot.CanvasTextRenderer.prototype.setWidth = function(c, b) {
				return (this.width = b ? b : this.measure(c, this.text)), this;
			}),
			(a.jqplot.CanvasTextRenderer.prototype.getHeight = function() {
				return this.height;
			}),
			(a.jqplot.CanvasTextRenderer.prototype.setHeight = function(b) {
				return (
					(this.height = b
						? b
						: this.normalizedFontSize * this.pt2px),
					this
				);
			}),
			(a.jqplot.CanvasTextRenderer.prototype.letter = function(b) {
				return this.letters[b];
			}),
			(a.jqplot.CanvasTextRenderer.prototype.ascent = function() {
				return this.normalizedFontSize;
			}),
			(a.jqplot.CanvasTextRenderer.prototype.descent = function() {
				return 7 * this.normalizedFontSize / 25;
			}),
			(a.jqplot.CanvasTextRenderer.prototype.measure = function(d, g) {
				for (var f = 0, b = g.length, e = 0; b > e; e++) {
					var h = this.letter(g.charAt(e));
					h &&
						(f +=
							h.width *
							this.normalizedFontSize /
							25 *
							this.fontStretch);
				}
				return f;
			}),
			(a.jqplot.CanvasTextRenderer.prototype.draw = function(s, n) {
				var r = 0,
					o = 0.72 * this.height,
					p = 0,
					l = n.length,
					k = this.normalizedFontSize / 25;
				s.save();
				var h, f;
				(-Math.PI / 2 <= this.angle && this.angle <= 0) ||
				(3 * Math.PI / 2 <= this.angle && this.angle <= 2 * Math.PI)
					? ((h = 0), (f = -Math.sin(this.angle) * this.width))
					: (0 < this.angle && this.angle <= Math.PI / 2) ||
						(2 * -Math.PI <= this.angle &&
							this.angle <= 3 * -Math.PI / 2)
						? ((h = Math.sin(this.angle) * this.height), (f = 0))
						: (-Math.PI < this.angle && this.angle < -Math.PI / 2) ||
							(Math.PI <= this.angle && this.angle <= 3 * Math.PI / 2)
							? ((h = -Math.cos(this.angle) * this.width),
								(f =
									-Math.sin(this.angle) * this.width -
									Math.cos(this.angle) * this.height))
							: ((3 * -Math.PI / 2 < this.angle &&
									this.angle < Math.PI) ||
									(Math.PI / 2 < this.angle &&
										this.angle < Math.PI)) &&
								((h =
									Math.sin(this.angle) * this.height -
									Math.cos(this.angle) * this.width),
								(f = -Math.cos(this.angle) * this.height)),
					(s.strokeStyle = this.fillStyle),
					(s.fillStyle = this.fillStyle),
					s.translate(h, f),
					s.rotate(this.angle),
					(s.lineCap = "round");
				var t =
					this.normalizedFontSize > 30
						? 2
						: 2 + (30 - this.normalizedFontSize) / 20;
				s.lineWidth = t * k * this.fontWeight2Float(this.fontWeight);
				for (var g = 0; l > g; g++) {
					var m = this.letter(n.charAt(g));
					if (m) {
						s.beginPath();
						for (var e = 1, d = 0; d < m.points.length; d++) {
							var q = m.points[d];
							-1 != q[0] || -1 != q[1]
								? e
									? (s.moveTo(
											r + q[0] * k * this.fontStretch,
											o - q[1] * k
										),
										(e = !1))
									: s.lineTo(
											r + q[0] * k * this.fontStretch,
											o - q[1] * k
										)
								: (e = 1);
						}
						s.stroke(), (r += m.width * k * this.fontStretch);
					}
				}
				return s.restore(), p;
			}),
			(a.jqplot.CanvasTextRenderer.prototype.letters = {
				" ": { width: 16, points: [] },
				"!": {
					width: 10,
					points: [
						[5, 21],
						[5, 7],
						[-1, -1],
						[5, 2],
						[4, 1],
						[5, 0],
						[6, 1],
						[5, 2]
					]
				},
				'"': {
					width: 16,
					points: [[4, 21], [4, 14], [-1, -1], [12, 21], [12, 14]]
				},
				"#": {
					width: 21,
					points: [
						[11, 25],
						[4, -7],
						[-1, -1],
						[17, 25],
						[10, -7],
						[-1, -1],
						[4, 12],
						[18, 12],
						[-1, -1],
						[3, 6],
						[17, 6]
					]
				},
				$: {
					width: 20,
					points: [
						[8, 25],
						[8, -4],
						[-1, -1],
						[12, 25],
						[12, -4],
						[-1, -1],
						[17, 18],
						[15, 20],
						[12, 21],
						[8, 21],
						[5, 20],
						[3, 18],
						[3, 16],
						[4, 14],
						[5, 13],
						[7, 12],
						[13, 10],
						[15, 9],
						[16, 8],
						[17, 6],
						[17, 3],
						[15, 1],
						[12, 0],
						[8, 0],
						[5, 1],
						[3, 3]
					]
				},
				"%": {
					width: 24,
					points: [
						[21, 21],
						[3, 0],
						[-1, -1],
						[8, 21],
						[10, 19],
						[10, 17],
						[9, 15],
						[7, 14],
						[5, 14],
						[3, 16],
						[3, 18],
						[4, 20],
						[6, 21],
						[8, 21],
						[10, 20],
						[13, 19],
						[16, 19],
						[19, 20],
						[21, 21],
						[-1, -1],
						[17, 7],
						[15, 6],
						[14, 4],
						[14, 2],
						[16, 0],
						[18, 0],
						[20, 1],
						[21, 3],
						[21, 5],
						[19, 7],
						[17, 7]
					]
				},
				"&": {
					width: 26,
					points: [
						[23, 12],
						[23, 13],
						[22, 14],
						[21, 14],
						[20, 13],
						[19, 11],
						[17, 6],
						[15, 3],
						[13, 1],
						[11, 0],
						[7, 0],
						[5, 1],
						[4, 2],
						[3, 4],
						[3, 6],
						[4, 8],
						[5, 9],
						[12, 13],
						[13, 14],
						[14, 16],
						[14, 18],
						[13, 20],
						[11, 21],
						[9, 20],
						[8, 18],
						[8, 16],
						[9, 13],
						[11, 10],
						[16, 3],
						[18, 1],
						[20, 0],
						[22, 0],
						[23, 1],
						[23, 2]
					]
				},
				"'": {
					width: 10,
					points: [
						[5, 19],
						[4, 20],
						[5, 21],
						[6, 20],
						[6, 18],
						[5, 16],
						[4, 15]
					]
				},
				"(": {
					width: 14,
					points: [
						[11, 25],
						[9, 23],
						[7, 20],
						[5, 16],
						[4, 11],
						[4, 7],
						[5, 2],
						[7, -2],
						[9, -5],
						[11, -7]
					]
				},
				")": {
					width: 14,
					points: [
						[3, 25],
						[5, 23],
						[7, 20],
						[9, 16],
						[10, 11],
						[10, 7],
						[9, 2],
						[7, -2],
						[5, -5],
						[3, -7]
					]
				},
				"*": {
					width: 16,
					points: [
						[8, 21],
						[8, 9],
						[-1, -1],
						[3, 18],
						[13, 12],
						[-1, -1],
						[13, 18],
						[3, 12]
					]
				},
				"+": {
					width: 26,
					points: [[13, 18], [13, 0], [-1, -1], [4, 9], [22, 9]]
				},
				",": {
					width: 10,
					points: [
						[6, 1],
						[5, 0],
						[4, 1],
						[5, 2],
						[6, 1],
						[6, -1],
						[5, -3],
						[4, -4]
					]
				},
				"-": { width: 18, points: [[6, 9], [12, 9]] },
				".": {
					width: 10,
					points: [[5, 2], [4, 1], [5, 0], [6, 1], [5, 2]]
				},
				"/": { width: 22, points: [[20, 25], [2, -7]] },
				0: {
					width: 20,
					points: [
						[9, 21],
						[6, 20],
						[4, 17],
						[3, 12],
						[3, 9],
						[4, 4],
						[6, 1],
						[9, 0],
						[11, 0],
						[14, 1],
						[16, 4],
						[17, 9],
						[17, 12],
						[16, 17],
						[14, 20],
						[11, 21],
						[9, 21]
					]
				},
				1: { width: 20, points: [[6, 17], [8, 18], [11, 21], [11, 0]] },
				2: {
					width: 20,
					points: [
						[4, 16],
						[4, 17],
						[5, 19],
						[6, 20],
						[8, 21],
						[12, 21],
						[14, 20],
						[15, 19],
						[16, 17],
						[16, 15],
						[15, 13],
						[13, 10],
						[3, 0],
						[17, 0]
					]
				},
				3: {
					width: 20,
					points: [
						[5, 21],
						[16, 21],
						[10, 13],
						[13, 13],
						[15, 12],
						[16, 11],
						[17, 8],
						[17, 6],
						[16, 3],
						[14, 1],
						[11, 0],
						[8, 0],
						[5, 1],
						[4, 2],
						[3, 4]
					]
				},
				4: {
					width: 20,
					points: [
						[13, 21],
						[3, 7],
						[18, 7],
						[-1, -1],
						[13, 21],
						[13, 0]
					]
				},
				5: {
					width: 20,
					points: [
						[15, 21],
						[5, 21],
						[4, 12],
						[5, 13],
						[8, 14],
						[11, 14],
						[14, 13],
						[16, 11],
						[17, 8],
						[17, 6],
						[16, 3],
						[14, 1],
						[11, 0],
						[8, 0],
						[5, 1],
						[4, 2],
						[3, 4]
					]
				},
				6: {
					width: 20,
					points: [
						[16, 18],
						[15, 20],
						[12, 21],
						[10, 21],
						[7, 20],
						[5, 17],
						[4, 12],
						[4, 7],
						[5, 3],
						[7, 1],
						[10, 0],
						[11, 0],
						[14, 1],
						[16, 3],
						[17, 6],
						[17, 7],
						[16, 10],
						[14, 12],
						[11, 13],
						[10, 13],
						[7, 12],
						[5, 10],
						[4, 7]
					]
				},
				7: {
					width: 20,
					points: [[17, 21], [7, 0], [-1, -1], [3, 21], [17, 21]]
				},
				8: {
					width: 20,
					points: [
						[8, 21],
						[5, 20],
						[4, 18],
						[4, 16],
						[5, 14],
						[7, 13],
						[11, 12],
						[14, 11],
						[16, 9],
						[17, 7],
						[17, 4],
						[16, 2],
						[15, 1],
						[12, 0],
						[8, 0],
						[5, 1],
						[4, 2],
						[3, 4],
						[3, 7],
						[4, 9],
						[6, 11],
						[9, 12],
						[13, 13],
						[15, 14],
						[16, 16],
						[16, 18],
						[15, 20],
						[12, 21],
						[8, 21]
					]
				},
				9: {
					width: 20,
					points: [
						[16, 14],
						[15, 11],
						[13, 9],
						[10, 8],
						[9, 8],
						[6, 9],
						[4, 11],
						[3, 14],
						[3, 15],
						[4, 18],
						[6, 20],
						[9, 21],
						[10, 21],
						[13, 20],
						[15, 18],
						[16, 14],
						[16, 9],
						[15, 4],
						[13, 1],
						[10, 0],
						[8, 0],
						[5, 1],
						[4, 3]
					]
				},
				":": {
					width: 10,
					points: [
						[5, 14],
						[4, 13],
						[5, 12],
						[6, 13],
						[5, 14],
						[-1, -1],
						[5, 2],
						[4, 1],
						[5, 0],
						[6, 1],
						[5, 2]
					]
				},
				";": {
					width: 10,
					points: [
						[5, 14],
						[4, 13],
						[5, 12],
						[6, 13],
						[5, 14],
						[-1, -1],
						[6, 1],
						[5, 0],
						[4, 1],
						[5, 2],
						[6, 1],
						[6, -1],
						[5, -3],
						[4, -4]
					]
				},
				"<": { width: 24, points: [[20, 18], [4, 9], [20, 0]] },
				"=": {
					width: 26,
					points: [[4, 12], [22, 12], [-1, -1], [4, 6], [22, 6]]
				},
				">": { width: 24, points: [[4, 18], [20, 9], [4, 0]] },
				"?": {
					width: 18,
					points: [
						[3, 16],
						[3, 17],
						[4, 19],
						[5, 20],
						[7, 21],
						[11, 21],
						[13, 20],
						[14, 19],
						[15, 17],
						[15, 15],
						[14, 13],
						[13, 12],
						[9, 10],
						[9, 7],
						[-1, -1],
						[9, 2],
						[8, 1],
						[9, 0],
						[10, 1],
						[9, 2]
					]
				},
				"@": {
					width: 27,
					points: [
						[18, 13],
						[17, 15],
						[15, 16],
						[12, 16],
						[10, 15],
						[9, 14],
						[8, 11],
						[8, 8],
						[9, 6],
						[11, 5],
						[14, 5],
						[16, 6],
						[17, 8],
						[-1, -1],
						[12, 16],
						[10, 14],
						[9, 11],
						[9, 8],
						[10, 6],
						[11, 5],
						[-1, -1],
						[18, 16],
						[17, 8],
						[17, 6],
						[19, 5],
						[21, 5],
						[23, 7],
						[24, 10],
						[24, 12],
						[23, 15],
						[22, 17],
						[20, 19],
						[18, 20],
						[15, 21],
						[12, 21],
						[9, 20],
						[7, 19],
						[5, 17],
						[4, 15],
						[3, 12],
						[3, 9],
						[4, 6],
						[5, 4],
						[7, 2],
						[9, 1],
						[12, 0],
						[15, 0],
						[18, 1],
						[20, 2],
						[21, 3],
						[-1, -1],
						[19, 16],
						[18, 8],
						[18, 6],
						[19, 5]
					]
				},
				A: {
					width: 18,
					points: [
						[9, 21],
						[1, 0],
						[-1, -1],
						[9, 21],
						[17, 0],
						[-1, -1],
						[4, 7],
						[14, 7]
					]
				},
				B: {
					width: 21,
					points: [
						[4, 21],
						[4, 0],
						[-1, -1],
						[4, 21],
						[13, 21],
						[16, 20],
						[17, 19],
						[18, 17],
						[18, 15],
						[17, 13],
						[16, 12],
						[13, 11],
						[-1, -1],
						[4, 11],
						[13, 11],
						[16, 10],
						[17, 9],
						[18, 7],
						[18, 4],
						[17, 2],
						[16, 1],
						[13, 0],
						[4, 0]
					]
				},
				C: {
					width: 21,
					points: [
						[18, 16],
						[17, 18],
						[15, 20],
						[13, 21],
						[9, 21],
						[7, 20],
						[5, 18],
						[4, 16],
						[3, 13],
						[3, 8],
						[4, 5],
						[5, 3],
						[7, 1],
						[9, 0],
						[13, 0],
						[15, 1],
						[17, 3],
						[18, 5]
					]
				},
				D: {
					width: 21,
					points: [
						[4, 21],
						[4, 0],
						[-1, -1],
						[4, 21],
						[11, 21],
						[14, 20],
						[16, 18],
						[17, 16],
						[18, 13],
						[18, 8],
						[17, 5],
						[16, 3],
						[14, 1],
						[11, 0],
						[4, 0]
					]
				},
				E: {
					width: 19,
					points: [
						[4, 21],
						[4, 0],
						[-1, -1],
						[4, 21],
						[17, 21],
						[-1, -1],
						[4, 11],
						[12, 11],
						[-1, -1],
						[4, 0],
						[17, 0]
					]
				},
				F: {
					width: 18,
					points: [
						[4, 21],
						[4, 0],
						[-1, -1],
						[4, 21],
						[17, 21],
						[-1, -1],
						[4, 11],
						[12, 11]
					]
				},
				G: {
					width: 21,
					points: [
						[18, 16],
						[17, 18],
						[15, 20],
						[13, 21],
						[9, 21],
						[7, 20],
						[5, 18],
						[4, 16],
						[3, 13],
						[3, 8],
						[4, 5],
						[5, 3],
						[7, 1],
						[9, 0],
						[13, 0],
						[15, 1],
						[17, 3],
						[18, 5],
						[18, 8],
						[-1, -1],
						[13, 8],
						[18, 8]
					]
				},
				H: {
					width: 22,
					points: [
						[4, 21],
						[4, 0],
						[-1, -1],
						[18, 21],
						[18, 0],
						[-1, -1],
						[4, 11],
						[18, 11]
					]
				},
				I: { width: 8, points: [[4, 21], [4, 0]] },
				J: {
					width: 16,
					points: [
						[12, 21],
						[12, 5],
						[11, 2],
						[10, 1],
						[8, 0],
						[6, 0],
						[4, 1],
						[3, 2],
						[2, 5],
						[2, 7]
					]
				},
				K: {
					width: 21,
					points: [
						[4, 21],
						[4, 0],
						[-1, -1],
						[18, 21],
						[4, 7],
						[-1, -1],
						[9, 12],
						[18, 0]
					]
				},
				L: {
					width: 17,
					points: [[4, 21], [4, 0], [-1, -1], [4, 0], [16, 0]]
				},
				M: {
					width: 24,
					points: [
						[4, 21],
						[4, 0],
						[-1, -1],
						[4, 21],
						[12, 0],
						[-1, -1],
						[20, 21],
						[12, 0],
						[-1, -1],
						[20, 21],
						[20, 0]
					]
				},
				N: {
					width: 22,
					points: [
						[4, 21],
						[4, 0],
						[-1, -1],
						[4, 21],
						[18, 0],
						[-1, -1],
						[18, 21],
						[18, 0]
					]
				},
				O: {
					width: 22,
					points: [
						[9, 21],
						[7, 20],
						[5, 18],
						[4, 16],
						[3, 13],
						[3, 8],
						[4, 5],
						[5, 3],
						[7, 1],
						[9, 0],
						[13, 0],
						[15, 1],
						[17, 3],
						[18, 5],
						[19, 8],
						[19, 13],
						[18, 16],
						[17, 18],
						[15, 20],
						[13, 21],
						[9, 21]
					]
				},
				P: {
					width: 21,
					points: [
						[4, 21],
						[4, 0],
						[-1, -1],
						[4, 21],
						[13, 21],
						[16, 20],
						[17, 19],
						[18, 17],
						[18, 14],
						[17, 12],
						[16, 11],
						[13, 10],
						[4, 10]
					]
				},
				Q: {
					width: 22,
					points: [
						[9, 21],
						[7, 20],
						[5, 18],
						[4, 16],
						[3, 13],
						[3, 8],
						[4, 5],
						[5, 3],
						[7, 1],
						[9, 0],
						[13, 0],
						[15, 1],
						[17, 3],
						[18, 5],
						[19, 8],
						[19, 13],
						[18, 16],
						[17, 18],
						[15, 20],
						[13, 21],
						[9, 21],
						[-1, -1],
						[12, 4],
						[18, -2]
					]
				},
				R: {
					width: 21,
					points: [
						[4, 21],
						[4, 0],
						[-1, -1],
						[4, 21],
						[13, 21],
						[16, 20],
						[17, 19],
						[18, 17],
						[18, 15],
						[17, 13],
						[16, 12],
						[13, 11],
						[4, 11],
						[-1, -1],
						[11, 11],
						[18, 0]
					]
				},
				S: {
					width: 20,
					points: [
						[17, 18],
						[15, 20],
						[12, 21],
						[8, 21],
						[5, 20],
						[3, 18],
						[3, 16],
						[4, 14],
						[5, 13],
						[7, 12],
						[13, 10],
						[15, 9],
						[16, 8],
						[17, 6],
						[17, 3],
						[15, 1],
						[12, 0],
						[8, 0],
						[5, 1],
						[3, 3]
					]
				},
				T: {
					width: 16,
					points: [[8, 21], [8, 0], [-1, -1], [1, 21], [15, 21]]
				},
				U: {
					width: 22,
					points: [
						[4, 21],
						[4, 6],
						[5, 3],
						[7, 1],
						[10, 0],
						[12, 0],
						[15, 1],
						[17, 3],
						[18, 6],
						[18, 21]
					]
				},
				V: {
					width: 18,
					points: [[1, 21], [9, 0], [-1, -1], [17, 21], [9, 0]]
				},
				W: {
					width: 24,
					points: [
						[2, 21],
						[7, 0],
						[-1, -1],
						[12, 21],
						[7, 0],
						[-1, -1],
						[12, 21],
						[17, 0],
						[-1, -1],
						[22, 21],
						[17, 0]
					]
				},
				X: {
					width: 20,
					points: [[3, 21], [17, 0], [-1, -1], [17, 21], [3, 0]]
				},
				Y: {
					width: 18,
					points: [
						[1, 21],
						[9, 11],
						[9, 0],
						[-1, -1],
						[17, 21],
						[9, 11]
					]
				},
				Z: {
					width: 20,
					points: [
						[17, 21],
						[3, 0],
						[-1, -1],
						[3, 21],
						[17, 21],
						[-1, -1],
						[3, 0],
						[17, 0]
					]
				},
				"[": {
					width: 14,
					points: [
						[4, 25],
						[4, -7],
						[-1, -1],
						[5, 25],
						[5, -7],
						[-1, -1],
						[4, 25],
						[11, 25],
						[-1, -1],
						[4, -7],
						[11, -7]
					]
				},
				"\\": { width: 14, points: [[0, 21], [14, -3]] },
				"]": {
					width: 14,
					points: [
						[9, 25],
						[9, -7],
						[-1, -1],
						[10, 25],
						[10, -7],
						[-1, -1],
						[3, 25],
						[10, 25],
						[-1, -1],
						[3, -7],
						[10, -7]
					]
				},
				"^": {
					width: 16,
					points: [
						[6, 15],
						[8, 18],
						[10, 15],
						[-1, -1],
						[3, 12],
						[8, 17],
						[13, 12],
						[-1, -1],
						[8, 17],
						[8, 0]
					]
				},
				_: { width: 16, points: [[0, -2], [16, -2]] },
				"`": {
					width: 10,
					points: [
						[6, 21],
						[5, 20],
						[4, 18],
						[4, 16],
						[5, 15],
						[6, 16],
						[5, 17]
					]
				},
				a: {
					width: 19,
					points: [
						[15, 14],
						[15, 0],
						[-1, -1],
						[15, 11],
						[13, 13],
						[11, 14],
						[8, 14],
						[6, 13],
						[4, 11],
						[3, 8],
						[3, 6],
						[4, 3],
						[6, 1],
						[8, 0],
						[11, 0],
						[13, 1],
						[15, 3]
					]
				},
				b: {
					width: 19,
					points: [
						[4, 21],
						[4, 0],
						[-1, -1],
						[4, 11],
						[6, 13],
						[8, 14],
						[11, 14],
						[13, 13],
						[15, 11],
						[16, 8],
						[16, 6],
						[15, 3],
						[13, 1],
						[11, 0],
						[8, 0],
						[6, 1],
						[4, 3]
					]
				},
				c: {
					width: 18,
					points: [
						[15, 11],
						[13, 13],
						[11, 14],
						[8, 14],
						[6, 13],
						[4, 11],
						[3, 8],
						[3, 6],
						[4, 3],
						[6, 1],
						[8, 0],
						[11, 0],
						[13, 1],
						[15, 3]
					]
				},
				d: {
					width: 19,
					points: [
						[15, 21],
						[15, 0],
						[-1, -1],
						[15, 11],
						[13, 13],
						[11, 14],
						[8, 14],
						[6, 13],
						[4, 11],
						[3, 8],
						[3, 6],
						[4, 3],
						[6, 1],
						[8, 0],
						[11, 0],
						[13, 1],
						[15, 3]
					]
				},
				e: {
					width: 18,
					points: [
						[3, 8],
						[15, 8],
						[15, 10],
						[14, 12],
						[13, 13],
						[11, 14],
						[8, 14],
						[6, 13],
						[4, 11],
						[3, 8],
						[3, 6],
						[4, 3],
						[6, 1],
						[8, 0],
						[11, 0],
						[13, 1],
						[15, 3]
					]
				},
				f: {
					width: 12,
					points: [
						[10, 21],
						[8, 21],
						[6, 20],
						[5, 17],
						[5, 0],
						[-1, -1],
						[2, 14],
						[9, 14]
					]
				},
				g: {
					width: 19,
					points: [
						[15, 14],
						[15, -2],
						[14, -5],
						[13, -6],
						[11, -7],
						[8, -7],
						[6, -6],
						[-1, -1],
						[15, 11],
						[13, 13],
						[11, 14],
						[8, 14],
						[6, 13],
						[4, 11],
						[3, 8],
						[3, 6],
						[4, 3],
						[6, 1],
						[8, 0],
						[11, 0],
						[13, 1],
						[15, 3]
					]
				},
				h: {
					width: 19,
					points: [
						[4, 21],
						[4, 0],
						[-1, -1],
						[4, 10],
						[7, 13],
						[9, 14],
						[12, 14],
						[14, 13],
						[15, 10],
						[15, 0]
					]
				},
				i: {
					width: 8,
					points: [
						[3, 21],
						[4, 20],
						[5, 21],
						[4, 22],
						[3, 21],
						[-1, -1],
						[4, 14],
						[4, 0]
					]
				},
				j: {
					width: 10,
					points: [
						[5, 21],
						[6, 20],
						[7, 21],
						[6, 22],
						[5, 21],
						[-1, -1],
						[6, 14],
						[6, -3],
						[5, -6],
						[3, -7],
						[1, -7]
					]
				},
				k: {
					width: 17,
					points: [
						[4, 21],
						[4, 0],
						[-1, -1],
						[14, 14],
						[4, 4],
						[-1, -1],
						[8, 8],
						[15, 0]
					]
				},
				l: { width: 8, points: [[4, 21], [4, 0]] },
				m: {
					width: 30,
					points: [
						[4, 14],
						[4, 0],
						[-1, -1],
						[4, 10],
						[7, 13],
						[9, 14],
						[12, 14],
						[14, 13],
						[15, 10],
						[15, 0],
						[-1, -1],
						[15, 10],
						[18, 13],
						[20, 14],
						[23, 14],
						[25, 13],
						[26, 10],
						[26, 0]
					]
				},
				n: {
					width: 19,
					points: [
						[4, 14],
						[4, 0],
						[-1, -1],
						[4, 10],
						[7, 13],
						[9, 14],
						[12, 14],
						[14, 13],
						[15, 10],
						[15, 0]
					]
				},
				o: {
					width: 19,
					points: [
						[8, 14],
						[6, 13],
						[4, 11],
						[3, 8],
						[3, 6],
						[4, 3],
						[6, 1],
						[8, 0],
						[11, 0],
						[13, 1],
						[15, 3],
						[16, 6],
						[16, 8],
						[15, 11],
						[13, 13],
						[11, 14],
						[8, 14]
					]
				},
				p: {
					width: 19,
					points: [
						[4, 14],
						[4, -7],
						[-1, -1],
						[4, 11],
						[6, 13],
						[8, 14],
						[11, 14],
						[13, 13],
						[15, 11],
						[16, 8],
						[16, 6],
						[15, 3],
						[13, 1],
						[11, 0],
						[8, 0],
						[6, 1],
						[4, 3]
					]
				},
				q: {
					width: 19,
					points: [
						[15, 14],
						[15, -7],
						[-1, -1],
						[15, 11],
						[13, 13],
						[11, 14],
						[8, 14],
						[6, 13],
						[4, 11],
						[3, 8],
						[3, 6],
						[4, 3],
						[6, 1],
						[8, 0],
						[11, 0],
						[13, 1],
						[15, 3]
					]
				},
				r: {
					width: 13,
					points: [
						[4, 14],
						[4, 0],
						[-1, -1],
						[4, 8],
						[5, 11],
						[7, 13],
						[9, 14],
						[12, 14]
					]
				},
				s: {
					width: 17,
					points: [
						[14, 11],
						[13, 13],
						[10, 14],
						[7, 14],
						[4, 13],
						[3, 11],
						[4, 9],
						[6, 8],
						[11, 7],
						[13, 6],
						[14, 4],
						[14, 3],
						[13, 1],
						[10, 0],
						[7, 0],
						[4, 1],
						[3, 3]
					]
				},
				t: {
					width: 12,
					points: [
						[5, 21],
						[5, 4],
						[6, 1],
						[8, 0],
						[10, 0],
						[-1, -1],
						[2, 14],
						[9, 14]
					]
				},
				u: {
					width: 19,
					points: [
						[4, 14],
						[4, 4],
						[5, 1],
						[7, 0],
						[10, 0],
						[12, 1],
						[15, 4],
						[-1, -1],
						[15, 14],
						[15, 0]
					]
				},
				v: {
					width: 16,
					points: [[2, 14], [8, 0], [-1, -1], [14, 14], [8, 0]]
				},
				w: {
					width: 22,
					points: [
						[3, 14],
						[7, 0],
						[-1, -1],
						[11, 14],
						[7, 0],
						[-1, -1],
						[11, 14],
						[15, 0],
						[-1, -1],
						[19, 14],
						[15, 0]
					]
				},
				x: {
					width: 17,
					points: [[3, 14], [14, 0], [-1, -1], [14, 14], [3, 0]]
				},
				y: {
					width: 16,
					points: [
						[2, 14],
						[8, 0],
						[-1, -1],
						[14, 14],
						[8, 0],
						[6, -4],
						[4, -6],
						[2, -7],
						[1, -7]
					]
				},
				z: {
					width: 17,
					points: [
						[14, 14],
						[3, 0],
						[-1, -1],
						[3, 14],
						[14, 14],
						[-1, -1],
						[3, 0],
						[14, 0]
					]
				},
				"{": {
					width: 14,
					points: [
						[9, 25],
						[7, 24],
						[6, 23],
						[5, 21],
						[5, 19],
						[6, 17],
						[7, 16],
						[8, 14],
						[8, 12],
						[6, 10],
						[-1, -1],
						[7, 24],
						[6, 22],
						[6, 20],
						[7, 18],
						[8, 17],
						[9, 15],
						[9, 13],
						[8, 11],
						[4, 9],
						[8, 7],
						[9, 5],
						[9, 3],
						[8, 1],
						[7, 0],
						[6, -2],
						[6, -4],
						[7, -6],
						[-1, -1],
						[6, 8],
						[8, 6],
						[8, 4],
						[7, 2],
						[6, 1],
						[5, -1],
						[5, -3],
						[6, -5],
						[7, -6],
						[9, -7]
					]
				},
				"|": { width: 8, points: [[4, 25], [4, -7]] },
				"}": {
					width: 14,
					points: [
						[5, 25],
						[7, 24],
						[8, 23],
						[9, 21],
						[9, 19],
						[8, 17],
						[7, 16],
						[6, 14],
						[6, 12],
						[8, 10],
						[-1, -1],
						[7, 24],
						[8, 22],
						[8, 20],
						[7, 18],
						[6, 17],
						[5, 15],
						[5, 13],
						[6, 11],
						[10, 9],
						[6, 7],
						[5, 5],
						[5, 3],
						[6, 1],
						[7, 0],
						[8, -2],
						[8, -4],
						[7, -6],
						[-1, -1],
						[8, 8],
						[6, 6],
						[6, 4],
						[7, 2],
						[8, 1],
						[9, -1],
						[9, -3],
						[8, -5],
						[7, -6],
						[5, -7]
					]
				},
				"~": {
					width: 24,
					points: [
						[3, 6],
						[3, 8],
						[4, 11],
						[6, 12],
						[8, 12],
						[10, 11],
						[14, 8],
						[16, 7],
						[18, 7],
						[20, 8],
						[21, 10],
						[-1, -1],
						[3, 8],
						[4, 10],
						[6, 11],
						[8, 11],
						[10, 10],
						[14, 7],
						[16, 6],
						[18, 6],
						[20, 7],
						[21, 10],
						[21, 12]
					]
				}
			}),
			(a.jqplot.CanvasFontRenderer = function(b) {
				(b = b || {}),
					b.pt2px || (b.pt2px = 1.5),
					a.jqplot.CanvasTextRenderer.call(this, b);
			}),
			(a.jqplot.CanvasFontRenderer.prototype = new a.jqplot.CanvasTextRenderer(
				{}
			)),
			(a.jqplot.CanvasFontRenderer.prototype.constructor =
				a.jqplot.CanvasFontRenderer),
			(a.jqplot.CanvasFontRenderer.prototype.measure = function(c, e) {
				var d = this.fontSize + " " + this.fontFamily;
				c.save(), (c.font = d);
				var b = c.measureText(e).width;
				return c.restore(), b;
			}),
			(a.jqplot.CanvasFontRenderer.prototype.draw = function(e, g) {
				var c = 0,
					h = 0.72 * this.height;
				e.save();
				var d, b;
				(-Math.PI / 2 <= this.angle && this.angle <= 0) ||
				(3 * Math.PI / 2 <= this.angle && this.angle <= 2 * Math.PI)
					? ((d = 0), (b = -Math.sin(this.angle) * this.width))
					: (0 < this.angle && this.angle <= Math.PI / 2) ||
						(2 * -Math.PI <= this.angle &&
							this.angle <= 3 * -Math.PI / 2)
						? ((d = Math.sin(this.angle) * this.height), (b = 0))
						: (-Math.PI < this.angle && this.angle < -Math.PI / 2) ||
							(Math.PI <= this.angle && this.angle <= 3 * Math.PI / 2)
							? ((d = -Math.cos(this.angle) * this.width),
								(b =
									-Math.sin(this.angle) * this.width -
									Math.cos(this.angle) * this.height))
							: ((3 * -Math.PI / 2 < this.angle &&
									this.angle < Math.PI) ||
									(Math.PI / 2 < this.angle &&
										this.angle < Math.PI)) &&
								((d =
									Math.sin(this.angle) * this.height -
									Math.cos(this.angle) * this.width),
								(b = -Math.cos(this.angle) * this.height)),
					(e.strokeStyle = this.fillStyle),
					(e.fillStyle = this.fillStyle);
				var f = this.fontSize + " " + this.fontFamily;
				(e.font = f),
					e.translate(d, b),
					e.rotate(this.angle),
					e.fillText(g, c, h),
					e.restore();
			});
	})(jQuery),
	(function(a) {
		(a.jqplot.CanvasAxisLabelRenderer = function(b) {
			(this.angle = 0),
				this.axis,
				(this.show = !0),
				(this.showLabel = !0),
				(this.label = ""),
				(this.fontFamily =
					'"Trebuchet MS", Arial, Helvetica, sans-serif'),
				(this.fontSize = "11pt"),
				(this.fontWeight = "normal"),
				(this.fontStretch = 1),
				(this.textColor = "#666666"),
				(this.enableFontSupport = !0),
				(this.pt2px = null),
				this._elem,
				this._ctx,
				this._plotWidth,
				this._plotHeight,
				(this._plotDimensions = { height: null, width: null }),
				a.extend(!0, this, b),
				null == b.angle &&
					"xaxis" != this.axis &&
					"x2axis" != this.axis &&
					(this.angle = -90);
			var c = {
				fontSize: this.fontSize,
				fontWeight: this.fontWeight,
				fontStretch: this.fontStretch,
				fillStyle: this.textColor,
				angle: this.getAngleRad(),
				fontFamily: this.fontFamily
			};
			this.pt2px && (c.pt2px = this.pt2px),
				(this._textRenderer =
					this.enableFontSupport && a.jqplot.support_canvas_text()
						? new a.jqplot.CanvasFontRenderer(c)
						: new a.jqplot.CanvasTextRenderer(c));
		}),
			(a.jqplot.CanvasAxisLabelRenderer.prototype.init = function(b) {
				a.extend(!0, this, b),
					this._textRenderer.init({
						fontSize: this.fontSize,
						fontWeight: this.fontWeight,
						fontStretch: this.fontStretch,
						fillStyle: this.textColor,
						angle: this.getAngleRad(),
						fontFamily: this.fontFamily
					});
			}),
			(a.jqplot.CanvasAxisLabelRenderer.prototype.getWidth = function(d) {
				if (this._elem) return this._elem.outerWidth(!0);
				var f = this._textRenderer,
					c = f.getWidth(d),
					e = f.getHeight(d),
					b =
						Math.abs(Math.sin(f.angle) * e) +
						Math.abs(Math.cos(f.angle) * c);
				return b;
			}),
			(a.jqplot.CanvasAxisLabelRenderer.prototype.getHeight = function(
				d
			) {
				if (this._elem) return this._elem.outerHeight(!0);
				var f = this._textRenderer,
					c = f.getWidth(d),
					e = f.getHeight(d),
					b =
						Math.abs(Math.cos(f.angle) * e) +
						Math.abs(Math.sin(f.angle) * c);
				return b;
			}),
			(a.jqplot.CanvasAxisLabelRenderer.prototype.getAngleRad = function() {
				var b = this.angle * Math.PI / 180;
				return b;
			}),
			(a.jqplot.CanvasAxisLabelRenderer.prototype.draw = function(c, f) {
				this._elem &&
					(a.jqplot.use_excanvas &&
						void 0 !== window.G_vmlCanvasManager.uninitElement &&
						window.G_vmlCanvasManager.uninitElement(
							this._elem.get(0)
						),
					this._elem.emptyForce(),
					(this._elem = null));
				var e = f.canvasManager.getCanvas();
				this._textRenderer.setText(this.label, c);
				var b = this.getWidth(c),
					d = this.getHeight(c);
				return (
					(e.width = b),
					(e.height = d),
					(e.style.width = b),
					(e.style.height = d),
					(e = f.canvasManager.initCanvas(e)),
					(this._elem = a(e)),
					this._elem.css({ position: "absolute" }),
					this._elem.addClass("jqplot-" + this.axis + "-label"),
					(e = null),
					this._elem
				);
			}),
			(a.jqplot.CanvasAxisLabelRenderer.prototype.pack = function() {
				this._textRenderer.draw(
					this._elem.get(0).getContext("2d"),
					this.label
				);
			});
	})(jQuery),
	(function(h) {
		function a(p, s, t) {
			for (
				var u, r, v, o = Number.MAX_VALUE, q = 0, n = m.length;
				n > q;
				q++
			)
				(u = Math.abs(t - m[q])),
					o > u && ((o = u), (r = m[q]), (v = i[q]));
			return [r, v];
		}
		h.jqplot.DateAxisRenderer = function() {
			h.jqplot.LinearAxisRenderer.call(this),
				(this.date = new h.jsDate());
		};
		var c = 1e3,
			e = 60 * c,
			f = 60 * e,
			l = 24 * f,
			b = 7 * l,
			j = 30.4368499 * l,
			k = 365.242199 * l,
			i = [
				"%M:%S.%#N",
				"%M:%S.%#N",
				"%M:%S.%#N",
				"%M:%S",
				"%M:%S",
				"%M:%S",
				"%M:%S",
				"%H:%M:%S",
				"%H:%M:%S",
				"%H:%M",
				"%H:%M",
				"%H:%M",
				"%H:%M",
				"%H:%M",
				"%H:%M",
				"%a %H:%M",
				"%a %H:%M",
				"%b %e %H:%M",
				"%b %e %H:%M",
				"%b %e %H:%M",
				"%b %e %H:%M",
				"%v",
				"%v",
				"%v",
				"%v",
				"%v",
				"%v",
				"%v"
			],
			m = [
				0.1 * c,
				0.2 * c,
				0.5 * c,
				c,
				2 * c,
				5 * c,
				10 * c,
				15 * c,
				30 * c,
				e,
				2 * e,
				5 * e,
				10 * e,
				15 * e,
				30 * e,
				f,
				2 * f,
				4 * f,
				6 * f,
				8 * f,
				12 * f,
				l,
				2 * l,
				3 * l,
				4 * l,
				5 * l,
				b,
				2 * b
			];
		(h.jqplot.DateAxisRenderer.prototype = new h.jqplot.LinearAxisRenderer()),
			(h.jqplot.DateAxisRenderer.prototype.constructor =
				h.jqplot.DateAxisRenderer),
			(h.jqplot.DateTickFormatter = function(n, o) {
				return n || (n = "%Y/%m/%d"), h.jsDate.strftime(o, n);
			}),
			(h.jqplot.DateAxisRenderer.prototype.init = function(E) {
				(this.tickOptions.formatter = h.jqplot.DateTickFormatter),
					(this.tickInset = 0),
					(this.drawBaseline = !0),
					(this.baselineWidth = null),
					(this.baselineColor = null),
					(this.daTickInterval = null),
					(this._daTickInterval = null),
					h.extend(!0, this, E);
				for (
					var u, x, D, y, A, z, o, C = this._dataBounds, t = 0;
					t < this._series.length;
					t++
				) {
					(u = {
						intervals: [],
						frequencies: {},
						sortedIntervals: [],
						min: null,
						max: null,
						mean: null
					}),
						(x = 0),
						(D = this._series[t]),
						(y = D.data),
						(A = D._plotData),
						(z = D._stackData),
						(o = 0);
					for (var r = 0; r < y.length; r++)
						"xaxis" == this.name || "x2axis" == this.name
							? ((y[r][0] = new h.jsDate(y[r][0]).getTime()),
								(A[r][0] = new h.jsDate(y[r][0]).getTime()),
								(z[r][0] = new h.jsDate(y[r][0]).getTime()),
								((null != y[r][0] && y[r][0] < C.min) ||
									null == C.min) &&
									(C.min = y[r][0]),
								((null != y[r][0] && y[r][0] > C.max) ||
									null == C.max) &&
									(C.max = y[r][0]),
								r > 0 &&
									((o = Math.abs(y[r][0] - y[r - 1][0])),
									u.intervals.push(o),
									u.frequencies.hasOwnProperty(o)
										? (u.frequencies[o] += 1)
										: (u.frequencies[o] = 1)),
								(x += o))
							: ((y[r][1] = new h.jsDate(y[r][1]).getTime()),
								(A[r][1] = new h.jsDate(y[r][1]).getTime()),
								(z[r][1] = new h.jsDate(y[r][1]).getTime()),
								((null != y[r][1] && y[r][1] < C.min) ||
									null == C.min) &&
									(C.min = y[r][1]),
								((null != y[r][1] && y[r][1] > C.max) ||
									null == C.max) &&
									(C.max = y[r][1]),
								r > 0 &&
									((o = Math.abs(y[r][1] - y[r - 1][1])),
									u.intervals.push(o),
									u.frequencies.hasOwnProperty(o)
										? (u.frequencies[o] += 1)
										: (u.frequencies[o] = 1))),
							(x += o);
					if (D.renderer.bands) {
						if (D.renderer.bands.hiData.length)
							for (
								var w = D.renderer.bands.hiData,
									r = 0,
									q = w.length;
								q > r;
								r++
							)
								"xaxis" === this.name || "x2axis" === this.name
									? ((w[r][0] = new h.jsDate(
											w[r][0]
										).getTime()),
										((null != w[r][0] && w[r][0] > C.max) ||
											null == C.max) &&
											(C.max = w[r][0]))
									: ((w[r][1] = new h.jsDate(
											w[r][1]
										).getTime()),
										((null != w[r][1] && w[r][1] > C.max) ||
											null == C.max) &&
											(C.max = w[r][1]));
						if (D.renderer.bands.lowData.length)
							for (
								var w = D.renderer.bands.lowData,
									r = 0,
									q = w.length;
								q > r;
								r++
							)
								"xaxis" === this.name || "x2axis" === this.name
									? ((w[r][0] = new h.jsDate(
											w[r][0]
										).getTime()),
										((null != w[r][0] && w[r][0] < C.min) ||
											null == C.min) &&
											(C.min = w[r][0]))
									: ((w[r][1] = new h.jsDate(
											w[r][1]
										).getTime()),
										((null != w[r][1] && w[r][1] < C.min) ||
											null == C.min) &&
											(C.min = w[r][1]));
					}
					for (var p in u.frequencies)
						u.sortedIntervals.push({
							interval: p,
							frequency: u.frequencies[p]
						});
					u.sortedIntervals.sort(function(s, n) {
						return n.frequency - s.frequency;
					}),
						(u.min = h.jqplot.arrayMin(u.intervals)),
						(u.max = h.jqplot.arrayMax(u.intervals)),
						(u.mean = x / y.length),
						this._intervalStats.push(u),
						(u = x = D = y = A = z = null);
				}
				C = null;
			}),
			(h.jqplot.DateAxisRenderer.prototype.reset = function() {
				(this.min = this._options.min),
					(this.max = this._options.max),
					(this.tickInterval = this._options.tickInterval),
					(this.numberTicks = this._options.numberTicks),
					(this._autoFormatString = ""),
					this._overrideFormatString &&
						this.tickOptions &&
						this.tickOptions.formatString &&
						(this.tickOptions.formatString = ""),
					(this.daTickInterval = this._daTickInterval);
			}),
			(h.jqplot.DateAxisRenderer.prototype.createTicks = function(p) {
				var ae,
					J,
					ad,
					aa,
					X = this._ticks,
					L = this.ticks,
					F = this.name,
					H = this._dataBounds,
					n = (this._intervalStats,
					"x" === this.name.charAt(0)
						? this._plotDimensions.width
						: this._plotDimensions.height),
					s = 30,
					O = 1,
					U = null;
				if (null != this.tickInterval)
					if (Number(this.tickInterval))
						U = [Number(this.tickInterval), "seconds"];
					else if ("string" == typeof this.tickInterval) {
						var ac = this.tickInterval.split(" ");
						1 == ac.length
							? (U = [1, ac[0]])
							: 2 == ac.length && (U = [ac[0], ac[1]]);
					}
				this.tickInterval;
				(ae = new h.jsDate(
					null != this.min ? this.min : H.min
				).getTime()),
					(J = new h.jsDate(
						null != this.max ? this.max : H.max
					).getTime());
				var A = p.plugins.cursor;
				A &&
					A._zoom &&
					A._zoom.zooming &&
					((this.min = null), (this.max = null));
				var B = J - ae;
				if (
					((null != this.tickOptions &&
						this.tickOptions.formatString) ||
						(this._overrideFormatString = !0),
					L.length)
				) {
					for (aa = 0; aa < L.length; aa++) {
						var P = L[aa],
							Y = new this.tickRenderer(this.tickOptions);
						P.constructor == Array
							? ((Y.value = new h.jsDate(P[0]).getTime()),
								(Y.label = P[1]),
								this.showTicks
									? this.showTickMarks || (Y.showMark = !1)
									: ((Y.showLabel = !1), (Y.showMark = !1)),
								Y.setTick(Y.value, this.name),
								this._ticks.push(Y))
							: ((Y.value = new h.jsDate(P).getTime()),
								this.showTicks
									? this.showTickMarks || (Y.showMark = !1)
									: ((Y.showLabel = !1), (Y.showMark = !1)),
								Y.setTick(Y.value, this.name),
								this._ticks.push(Y));
					}
					(this.numberTicks = L.length),
						(this.min = this._ticks[0].value),
						(this.max = this._ticks[this.numberTicks - 1].value),
						(this.daTickInterval = [
							(this.max - this.min) /
								(this.numberTicks - 1) /
								1e3,
							"seconds"
						]);
				} else if (
					null == this.min &&
					null == this.max &&
					H.min == H.max
				) {
					var E = h.extend(!0, {}, this.tickOptions, {
							name: this.name,
							value: null
						}),
						T = 3e5;
					(this.min = H.min - T),
						(this.max = H.max + T),
						(this.numberTicks = 3);
					for (var aa = this.min; aa <= this.max; aa += T) {
						E.value = aa;
						var Y = new this.tickRenderer(E);
						this._overrideFormatString &&
							"" != this._autoFormatString &&
							(Y.formatString = this._autoFormatString),
							(Y.showLabel = !1),
							(Y.showMark = !1),
							this._ticks.push(Y);
					}
					this.showTicks && (this._ticks[1].showLabel = !0),
						this.showTickMarks &&
							(this._ticks[1].showTickMarks = !0);
				} else if (null == this.min && null == this.max) {
					var ab,
						I,
						N = h.extend(!0, {}, this.tickOptions, {
							name: this.name,
							value: null
						});
					if (this.tickInterval || this.numberTicks)
						this.tickInterval
							? (I = new h.jsDate(0).add(U[0], U[1]).getTime())
							: this.numberTicks &&
								((ab = this.numberTicks),
								(I = (J - ae) / (ab - 1)));
					else {
						var R = Math.max(n, s + 1),
							Z = 115;
						this.tickRenderer === h.jqplot.CanvasAxisTickRenderer &&
							this.tickOptions.angle &&
							(Z =
								115 -
								40 *
									Math.abs(
										Math.sin(
											this.tickOptions.angle /
												180 *
												Math.PI
										)
									)),
							(ab = Math.ceil((R - s) / Z + 1)),
							(I = (J - ae) / (ab - 1));
					}
					if (19 * l >= I) {
						var Q = a(ae, J, I),
							r = Q[0];
						(this._autoFormatString = Q[1]),
							(ae = new h.jsDate(ae)),
							(ae =
								Math.floor(
									(ae.getTime() - ae.getUtcOffset()) / r
								) *
									r +
								ae.getUtcOffset()),
							(ab = Math.ceil((J - ae) / r) + 1),
							(this.min = ae),
							(this.max = ae + (ab - 1) * r),
							this.max < J && ((this.max += r), (ab += 1)),
							(this.tickInterval = r),
							(this.numberTicks = ab);
						for (var aa = 0; ab > aa; aa++)
							(N.value = this.min + aa * r),
								(Y = new this.tickRenderer(N)),
								this._overrideFormatString &&
									"" != this._autoFormatString &&
									(Y.formatString = this._autoFormatString),
								this.showTicks
									? this.showTickMarks || (Y.showMark = !1)
									: ((Y.showLabel = !1), (Y.showMark = !1)),
								this._ticks.push(Y);
						O = this.tickInterval;
					} else if (9 * j >= I) {
						this._autoFormatString = "%v";
						var D = Math.round(I / j);
						1 > D ? (D = 1) : D > 6 && (D = 6);
						var V = new h.jsDate(ae)
								.setDate(1)
								.setHours(0, 0, 0, 0),
							q = new h.jsDate(J),
							z = new h.jsDate(J).setDate(1).setHours(0, 0, 0, 0);
						q.getTime() !== z.getTime() && (z = z.add(1, "month"));
						var S = z.diff(V, "month");
						(ab = Math.ceil(S / D) + 1),
							(this.min = V.getTime()),
							(this.max = V.clone()
								.add((ab - 1) * D, "month")
								.getTime()),
							(this.numberTicks = ab);
						for (var aa = 0; ab > aa; aa++)
							(N.value =
								0 === aa
									? V.getTime()
									: V.add(D, "month").getTime()),
								(Y = new this.tickRenderer(N)),
								this._overrideFormatString &&
									"" != this._autoFormatString &&
									(Y.formatString = this._autoFormatString),
								this.showTicks
									? this.showTickMarks || (Y.showMark = !1)
									: ((Y.showLabel = !1), (Y.showMark = !1)),
								this._ticks.push(Y);
						O = D * j;
					} else {
						this._autoFormatString = "%v";
						var D = Math.round(I / k);
						1 > D && (D = 1);
						var V = new h.jsDate(ae)
								.setMonth(0, 1)
								.setHours(0, 0, 0, 0),
							z = new h.jsDate(J)
								.add(1, "year")
								.setMonth(0, 1)
								.setHours(0, 0, 0, 0),
							K = z.diff(V, "year");
						(ab = Math.ceil(K / D) + 1),
							(this.min = V.getTime()),
							(this.max = V.clone()
								.add((ab - 1) * D, "year")
								.getTime()),
							(this.numberTicks = ab);
						for (var aa = 0; ab > aa; aa++)
							(N.value =
								0 === aa
									? V.getTime()
									: V.add(D, "year").getTime()),
								(Y = new this.tickRenderer(N)),
								this._overrideFormatString &&
									"" != this._autoFormatString &&
									(Y.formatString = this._autoFormatString),
								this.showTicks
									? this.showTickMarks || (Y.showMark = !1)
									: ((Y.showLabel = !1), (Y.showMark = !1)),
								this._ticks.push(Y);
						O = D * k;
					}
				} else {
					if (
						((n =
							"xaxis" == F || "x2axis" == F
								? this._plotDimensions.width
								: this._plotDimensions.height),
						null != this.min &&
							null != this.max &&
							null != this.numberTicks &&
							(this.tickInterval = null),
						null != this.tickInterval &&
							null != U &&
							(this.daTickInterval = U),
						ae == J)
					) {
						var o = 432e5;
						(ae -= o), (J += o);
					}
					B = J - ae;
					{
						var W, C;
						2 + parseInt(Math.max(0, n - 100) / 100, 10);
					}
					if (
						((W =
							null != this.min
								? new h.jsDate(this.min).getTime()
								: ae - B / 2 * (this.padMin - 1)),
						(C =
							null != this.max
								? new h.jsDate(this.max).getTime()
								: J + B / 2 * (this.padMax - 1)),
						(this.min = W),
						(this.max = C),
						(B = this.max - this.min),
						null == this.numberTicks)
					)
						if (null != this.daTickInterval) {
							var u = new h.jsDate(this.max).diff(
								this.min,
								this.daTickInterval[1],
								!0
							);
							(this.numberTicks =
								Math.ceil(u / this.daTickInterval[0]) + 1),
								(this.max = new h.jsDate(this.min)
									.add(
										(this.numberTicks - 1) *
											this.daTickInterval[0],
										this.daTickInterval[1]
									)
									.getTime());
						} else
							this.numberTicks =
								n > 200 ? parseInt(3 + (n - 200) / 100, 10) : 2;
					(O = B / (this.numberTicks - 1) / 1e3),
						null == this.daTickInterval &&
							(this.daTickInterval = [O, "seconds"]);
					for (var aa = 0; aa < this.numberTicks; aa++) {
						var ae = new h.jsDate(this.min);
						ad = ae
							.add(
								aa * this.daTickInterval[0],
								this.daTickInterval[1]
							)
							.getTime();
						var Y = new this.tickRenderer(this.tickOptions);
						this.showTicks
							? this.showTickMarks || (Y.showMark = !1)
							: ((Y.showLabel = !1), (Y.showMark = !1)),
							Y.setTick(ad, this.name),
							this._ticks.push(Y);
					}
				}
				this.tickInset &&
					((this.min = this.min - this.tickInset * O),
					(this.max = this.max + this.tickInset * O)),
					null == this._daTickInterval &&
						(this._daTickInterval = this.daTickInterval),
					(X = null);
			});
	})(jQuery),
	$(function() {
		$(".hidehelp").click(function() {
			$(".help").hide(), $(".showhelp").show(), $(".hidehelp").hide();
		}),
			$(".showhelp").click(function() {
				$(".help").show(), $(".hidehelp").show(), $(".showhelp").hide();
			}),
			$(".home .page-header").click(function() {
				location.href = "/";
			}),
			$(".popover").popover({}),
			$.validator.addMethod(
				"passwordcheck",
				function(value) {
					return value.length < 8
						? !1
						: -1 == value.search(/[a-z]/)
							? !1
							: -1 == value.search(/[A-Z]/)
								? !1
								: -1 == value.search(/[0-9]/) ? !1 : !0;
				},
				"Password is not strong enough"
			),
			$(".loginform").submit(function() {
				$(".remember").is(":checked")
					? $.jStorage.set("email", $(".login").val())
					: $.jStorage.deleteKey("email");
			}),
			$(".form-validate").validate({
				errorClass: "error",
				rules: {
					postcode: { digits: !0 },
					password: { passwordcheck: !0 }
				},
				messages: {
					postcode: "Please enter your 4 digit postcode",
					price: "Please enter a valid price",
					password2: "Passwords entered do not match"
				}
			}),
			$(".sellform-validate").validate({
				errorClass: "error",
				rules: {
					amount: { required: !0, min: 0 },
					rate: { required: !0, min: 0 }
				},
				messages: {
					amount: "Please enter a valid amount",
					rate: "Please enter a valid price"
				}
			}),
			$(".buyform-validate").validate({
				errorClass: "error",
				rules: {
					amount: { required: !0, min: 0 },
					rate: { required: !0, min: 0 }
				},
				messages: {
					amount: "Please enter a valid amount",
					rate: "Please enter a valid price"
				}
			}),
			$(".tradeitem").click(function() {
				var coin = $(this).data("coin");
				location.href = "/buy/" + coin.toLowerCase();
			}),
			$(".buyinput").change(function() {
				var amount = $("#buyamount").val(),
					rate = $("#buyrate").val();
				rate ||
					(rate = $("#coin")
						.find(":selected")
						.data("spot"));
				var totalprice = Math.round(rate * amount * 10) / 10;
				$("#calcbuyprice").html("$" + totalprice.toFixed(2));
			}),
			$(".buyaudinput").change(function() {
				var amount = $("#buyaudamount").val();
				amount = parseFloat(amount);
				var rate = $("#buyrate").val();
				rate ||
					(rate = $("#coin")
						.find(":selected")
						.data("spot"));
				var coin = Math.round(amount / rate * 1e8) / 1e8;
				$("#buyamount").val(coin),
					$("#calcbuyprice").html("$" + amount.toFixed(2));
			}),
			$(".buyinput").keyup(function() {
				var amount = $("#buyamount").val(),
					rate = $("#buyrate").val();
				rate ||
					(rate = $("#coin")
						.find(":selected")
						.data("spot"));
				var totalprice = Math.round(rate * amount * 10) / 10;
				$("#calcbuyprice").html("$" + totalprice.toFixed(2));
			}),
			$(".sellinput").change(function() {
				var amount = $("#sellamount").val(),
					rate = $("#sellrate").val(),
					totalprice = Math.round(rate * amount * 1e6) / 1e6;
				$("#calcsellprice").html("$" + totalprice);
			}),
			$(".sellinput").keyup(function() {
				var amount = $("#sellamount").val(),
					rate = $("#sellrate").val(),
					totalprice = Math.round(rate * amount * 1e6) / 1e6;
				$("#calcsellprice").html("$" + totalprice);
			}),
			$(".confirmform").click(function() {
				return confirm("Are you sure?");
			}),
			$(".resendmobileverification").click(function() {
				$(".mobilevalid").html("SMS has been resent"),
					$.post("/my/resendmobileverification", function() {});
			}),
			$(".openselltable").on("click", ".buyit", function() {
				var rate = $(this).data("rate"),
					amount = $(this).data("amount"),
					total = $(this).data("total");
				$("#buyamount").val(amount),
					$("#buyrate").val(rate),
					$("#calcbuyprice").html("$" + total),
					$(".buypanel")
						.css({ backgroundColor: "#3BAFDA" })
						.animate({ backgroundColor: "transparent" }, 1e3);
			}),
			$(".peggedtoggle").click(function() {
				$(this)
					.next()
					.toggle();
			}),
			$(".openbuytable").on("click", ".sellit", function() {
				var rate = $(this).data("rate"),
					amount = $(this).data("amount"),
					total = $(this).data("total");
				$("#sellamount").val(amount),
					$("#sellrate").val(rate),
					$("#calcsellprice").html("$" + total),
					$(".sellpanel")
						.css({ backgroundColor: "#3BAFDA" })
						.animate({ backgroundColor: "transparent" }, 1e3);
			});
	});
var CSS_PROP_BIT_QUANTITY = 1,
	CSS_PROP_BIT_HASH_VALUE = 2,
	CSS_PROP_BIT_NEGATIVE_QUANTITY = 4,
	CSS_PROP_BIT_QSTRING_CONTENT = 8,
	CSS_PROP_BIT_QSTRING_URL = 16,
	CSS_PROP_BIT_HISTORY_INSENSITIVE = 32,
	CSS_PROP_BIT_Z_INDEX = 64,
	CSS_PROP_BIT_ALLOWED_IN_LINK = 128,
	cssSchema = (function() {
		var s = [
				"rgb(?:\\(\\s*(?:\\d+|0|\\d+(?:\\.\\d+)?%)\\s*,\\s*(?:\\d+|0|\\d+(?:\\.\\d+)?%)\\s*,\\s*(?:\\d+|0|\\d+(?:\\.\\d+)?%)|a\\(\\s*(?:\\d+|0|\\d+(?:\\.\\d+)?%)\\s*,\\s*(?:\\d+|0|\\d+(?:\\.\\d+)?%)\\s*,\\s*(?:\\d+|0|\\d+(?:\\.\\d+)?%)\\s*,\\s*(?:\\d+|0(?:\\.\\d+)?|\\.\\d+|1(?:\\.0+)?|0|\\d+(?:\\.\\d+)?%)) *\\)"
			],
			c = [
				/^ *$/i,
				RegExp(
					"^ *(?:\\s*" + s[0] + "|(?:\\s*" + s[0] + ")?)+ *$",
					"i"
				),
				RegExp("^ *\\s*" + s[0] + " *$", "i"),
				RegExp("^ *\\s*" + s[0] + "\\s*" + s[0] + " *$", "i")
			],
			L = [
				[
					"aliceblue",
					"antiquewhite",
					"aqua",
					"aquamarine",
					"azure",
					"beige",
					"bisque",
					"black",
					"blanchedalmond",
					"blue",
					"blueviolet",
					"brown",
					"burlywood",
					"cadetblue",
					"chartreuse",
					"chocolate",
					"coral",
					"cornflowerblue",
					"cornsilk",
					"crimson",
					"cyan",
					"darkblue",
					"darkcyan",
					"darkgoldenrod",
					"darkgray",
					"darkgreen",
					"darkkhaki",
					"darkmagenta",
					"darkolivegreen",
					"darkorange",
					"darkorchid",
					"darkred",
					"darksalmon",
					"darkseagreen",
					"darkslateblue",
					"darkslategray",
					"darkturquoise",
					"darkviolet",
					"deeppink",
					"deepskyblue",
					"dimgray",
					"dodgerblue",
					"firebrick",
					"floralwhite",
					"forestgreen",
					"fuchsia",
					"gainsboro",
					"ghostwhite",
					"gold",
					"goldenrod",
					"gray",
					"green",
					"greenyellow",
					"honeydew",
					"hotpink",
					"indianred",
					"indigo",
					"ivory",
					"khaki",
					"lavender",
					"lavenderblush",
					"lawngreen",
					"lemonchiffon",
					"lightblue",
					"lightcoral",
					"lightcyan",
					"lightgoldenrodyellow",
					"lightgreen",
					"lightgrey",
					"lightpink",
					"lightsalmon",
					"lightseagreen",
					"lightskyblue",
					"lightslategray",
					"lightsteelblue",
					"lightyellow",
					"lime",
					"limegreen",
					"linen",
					"magenta",
					"maroon",
					"mediumaquamarine",
					"mediumblue",
					"mediumorchid",
					"mediumpurple",
					"mediumseagreen",
					"mediumslateblue",
					"mediumspringgreen",
					"mediumturquoise",
					"mediumvioletred",
					"midnightblue",
					"mintcream",
					"mistyrose",
					"moccasin",
					"navajowhite",
					"navy",
					"oldlace",
					"olive",
					"olivedrab",
					"orange",
					"orangered",
					"orchid",
					"palegoldenrod",
					"palegreen",
					"paleturquoise",
					"palevioletred",
					"papayawhip",
					"peachpuff",
					"peru",
					"pink",
					"plum",
					"powderblue",
					"purple",
					"red",
					"rosybrown",
					"royalblue",
					"saddlebrown",
					"salmon",
					"sandybrown",
					"seagreen",
					"seashell",
					"sienna",
					"silver",
					"skyblue",
					"slateblue",
					"slategray",
					"snow",
					"springgreen",
					"steelblue",
					"tan",
					"teal",
					"thistle",
					"tomato",
					"turquoise",
					"violet",
					"wheat",
					"white",
					"whitesmoke",
					"yellow",
					"yellowgreen"
				],
				[
					"all-scroll",
					"col-resize",
					"crosshair",
					"default",
					"e-resize",
					"hand",
					"help",
					"move",
					"n-resize",
					"ne-resize",
					"no-drop",
					"not-allowed",
					"nw-resize",
					"pointer",
					"progress",
					"row-resize",
					"s-resize",
					"se-resize",
					"sw-resize",
					"text",
					"vertical-text",
					"w-resize",
					"wait"
				],
				[
					"-moz-inline-box",
					"-moz-inline-stack",
					"block",
					"inline",
					"inline-block",
					"inline-table",
					"list-item",
					"run-in",
					"table",
					"table-caption",
					"table-cell",
					"table-column",
					"table-column-group",
					"table-footer-group",
					"table-header-group",
					"table-row",
					"table-row-group"
				],
				[
					"armenian",
					"circle",
					"decimal",
					"decimal-leading-zero",
					"disc",
					"georgian",
					"lower-alpha",
					"lower-greek",
					"lower-latin",
					"lower-roman",
					"square",
					"upper-alpha",
					"upper-latin",
					"upper-roman"
				],
				[
					"100",
					"200",
					"300",
					"400",
					"500",
					"600",
					"700",
					"800",
					"900",
					"bold",
					"bolder",
					"lighter"
				],
				[
					"condensed",
					"expanded",
					"extra-condensed",
					"extra-expanded",
					"narrower",
					"semi-condensed",
					"semi-expanded",
					"ultra-condensed",
					"ultra-expanded",
					"wider"
				],
				[
					"behind",
					"center-left",
					"center-right",
					"far-left",
					"far-right",
					"left-side",
					"leftwards",
					"right-side",
					"rightwards"
				],
				[
					"large",
					"larger",
					"small",
					"smaller",
					"x-large",
					"x-small",
					"xx-large",
					"xx-small"
				],
				[
					"-moz-pre-wrap",
					"-o-pre-wrap",
					"-pre-wrap",
					"nowrap",
					"pre",
					"pre-line",
					"pre-wrap"
				],
				[
					"dashed",
					"dotted",
					"double",
					"groove",
					"outset",
					"ridge",
					"solid"
				],
				[
					"baseline",
					"middle",
					"sub",
					"super",
					"text-bottom",
					"text-top"
				],
				[
					"caption",
					"icon",
					"menu",
					"message-box",
					"small-caption",
					"status-bar"
				],
				["fast", "faster", "slow", "slower", "x-fast", "x-slow"],
				["above", "below", "higher", "level", "lower"],
				[
					"border-box",
					"contain",
					"content-box",
					"cover",
					"padding-box"
				],
				["cursive", "fantasy", "monospace", "sans-serif", "serif"],
				["loud", "silent", "soft", "x-loud", "x-soft"],
				["no-repeat", "repeat-x", "repeat-y", "round", "space"],
				["blink", "line-through", "overline", "underline"],
				["high", "low", "x-high", "x-low"],
				["absolute", "relative", "static"],
				["capitalize", "lowercase", "uppercase"],
				["child", "female", "male"],
				["bidi-override", "embed"],
				["bottom", "top"],
				["clip", "ellipsis"],
				["continuous", "digits"],
				["hide", "show"],
				["inside", "outside"],
				["italic", "oblique"],
				["left", "right"],
				["ltr", "rtl"],
				["no-content", "no-display"],
				["suppress", "unrestricted"],
				["thick", "thin"],
				[","],
				["/"],
				["always"],
				["auto"],
				["avoid"],
				["both"],
				["break-word"],
				["center"],
				["code"],
				["collapse"],
				["fixed"],
				["hidden"],
				["inherit"],
				["inset"],
				["invert"],
				["justify"],
				["local"],
				["medium"],
				["mix"],
				["none"],
				["normal"],
				["once"],
				["repeat"],
				["scroll"],
				["separate"],
				["small-caps"],
				["spell-out"],
				["transparent"],
				["visible"]
			];

		return {
			"-moz-border-radius": {
				cssExtra: c[0],
				cssPropBits: 5,
				cssLitGroup: [L[36]]
			},
			"-moz-border-radius-bottomleft": { cssExtra: c[0], cssPropBits: 5 },
			"-moz-border-radius-bottomright": {
				cssExtra: c[0],
				cssPropBits: 5
			},
			"-moz-border-radius-topleft": { cssExtra: c[0], cssPropBits: 5 },
			"-moz-border-radius-topright": { cssExtra: c[0], cssPropBits: 5 },
			"-moz-box-shadow": {
				cssExtra: c[1],
				cssAlternates: ["boxShadow"],
				cssPropBits: 7,
				cssLitGroup: [L[0], L[35], L[48], L[54]]
			},
			"-moz-opacity": { cssPropBits: 1, cssLitGroup: [L[47]] },
			"-moz-outline": {
				cssExtra: c[3],
				cssPropBits: 7,
				cssLitGroup: [
					L[0],
					L[9],
					L[34],
					L[46],
					L[47],
					L[48],
					L[49],
					L[52],
					L[54]
				]
			},
			"-moz-outline-color": {
				cssExtra: c[2],
				cssPropBits: 2,
				cssLitGroup: [L[0], L[47], L[49]]
			},
			"-moz-outline-style": {
				cssPropBits: 0,
				cssLitGroup: [L[9], L[46], L[47], L[48], L[54]]
			},
			"-moz-outline-width": {
				cssPropBits: 5,
				cssLitGroup: [L[34], L[47], L[52]]
			},
			"-o-text-overflow": { cssPropBits: 0, cssLitGroup: [L[25]] },
			"-webkit-border-bottom-left-radius": {
				cssExtra: c[0],
				cssPropBits: 5
			},
			"-webkit-border-bottom-right-radius": {
				cssExtra: c[0],
				cssPropBits: 5
			},
			"-webkit-border-radius": {
				cssExtra: c[0],
				cssPropBits: 5,
				cssLitGroup: [L[36]]
			},
			"-webkit-border-radius-bottom-left": {
				cssExtra: c[0],
				cssPropBits: 5
			},
			"-webkit-border-radius-bottom-right": {
				cssExtra: c[0],
				cssPropBits: 5
			},
			"-webkit-border-radius-top-left": {
				cssExtra: c[0],
				cssPropBits: 5
			},
			"-webkit-border-radius-top-right": {
				cssExtra: c[0],
				cssPropBits: 5
			},
			"-webkit-border-top-left-radius": {
				cssExtra: c[0],
				cssPropBits: 5
			},
			"-webkit-border-top-right-radius": {
				cssExtra: c[0],
				cssPropBits: 5
			},
			"-webkit-box-shadow": {
				cssExtra: c[1],
				cssAlternates: ["boxShadow"],
				cssPropBits: 7,
				cssLitGroup: [L[0], L[35], L[48], L[54]]
			},
			azimuth: {
				cssPropBits: 5,
				cssLitGroup: [L[6], L[30], L[42], L[47]]
			},
			background: {
				cssExtra: RegExp("^ *(?:\\s*" + s[0] + "){0,2} *$", "i"),
				cssPropBits: 23,
				cssLitGroup: [
					L[0],
					L[14],
					L[17],
					L[24],
					L[30],
					L[35],
					L[36],
					L[38],
					L[42],
					L[45],
					L[47],
					L[51],
					L[54],
					L[57],
					L[58],
					L[62]
				]
			},
			"background-attachment": {
				cssExtra: c[0],
				cssPropBits: 0,
				cssLitGroup: [L[35], L[45], L[51], L[58]]
			},
			"background-color": {
				cssExtra: c[2],
				cssPropBits: 130,
				cssLitGroup: [L[0], L[47], L[62]]
			},
			"background-image": {
				cssExtra: c[0],
				cssPropBits: 16,
				cssLitGroup: [L[35], L[54]]
			},
			"background-position": {
				cssExtra: c[0],
				cssPropBits: 5,
				cssLitGroup: [L[24], L[30], L[35], L[42]]
			},
			"background-repeat": {
				cssExtra: c[0],
				cssPropBits: 0,
				cssLitGroup: [L[17], L[35], L[57]]
			},
			border: {
				cssExtra: c[3],
				cssPropBits: 7,
				cssLitGroup: [
					L[0],
					L[9],
					L[34],
					L[46],
					L[47],
					L[48],
					L[52],
					L[54],
					L[62]
				]
			},
			"border-bottom": {
				cssExtra: c[3],
				cssPropBits: 7,
				cssLitGroup: [
					L[0],
					L[9],
					L[34],
					L[46],
					L[47],
					L[48],
					L[52],
					L[54],
					L[62]
				]
			},
			"border-bottom-color": {
				cssExtra: c[2],
				cssPropBits: 2,
				cssLitGroup: [L[0], L[47], L[62]]
			},
			"border-bottom-left-radius": { cssExtra: c[0], cssPropBits: 5 },
			"border-bottom-right-radius": { cssExtra: c[0], cssPropBits: 5 },
			"border-bottom-style": {
				cssPropBits: 0,
				cssLitGroup: [L[9], L[46], L[47], L[48], L[54]]
			},
			"border-bottom-width": {
				cssPropBits: 5,
				cssLitGroup: [L[34], L[47], L[52]]
			},
			"border-collapse": {
				cssPropBits: 0,
				cssLitGroup: [L[44], L[47], L[59]]
			},
			"border-color": {
				cssExtra: RegExp("^ *(?:\\s*" + s[0] + "){1,4} *$", "i"),
				cssPropBits: 2,
				cssLitGroup: [L[0], L[47], L[62]]
			},
			"border-left": {
				cssExtra: c[3],
				cssPropBits: 7,
				cssLitGroup: [
					L[0],
					L[9],
					L[34],
					L[46],
					L[47],
					L[48],
					L[52],
					L[54],
					L[62]
				]
			},
			"border-left-color": {
				cssExtra: c[2],
				cssPropBits: 2,
				cssLitGroup: [L[0], L[47], L[62]]
			},
			"border-left-style": {
				cssPropBits: 0,
				cssLitGroup: [L[9], L[46], L[47], L[48], L[54]]
			},
			"border-left-width": {
				cssPropBits: 5,
				cssLitGroup: [L[34], L[47], L[52]]
			},
			"border-radius": {
				cssExtra: c[0],
				cssPropBits: 5,
				cssLitGroup: [L[36]]
			},
			"border-right": {
				cssExtra: c[3],
				cssPropBits: 7,
				cssLitGroup: [
					L[0],
					L[9],
					L[34],
					L[46],
					L[47],
					L[48],
					L[52],
					L[54],
					L[62]
				]
			},
			"border-right-color": {
				cssExtra: c[2],
				cssPropBits: 2,
				cssLitGroup: [L[0], L[47], L[62]]
			},
			"border-right-style": {
				cssPropBits: 0,
				cssLitGroup: [L[9], L[46], L[47], L[48], L[54]]
			},
			"border-right-width": {
				cssPropBits: 5,
				cssLitGroup: [L[34], L[47], L[52]]
			},
			"border-spacing": {
				cssExtra: c[0],
				cssPropBits: 5,
				cssLitGroup: [L[47]]
			},
			"border-style": {
				cssPropBits: 0,
				cssLitGroup: [L[9], L[46], L[47], L[48], L[54]]
			},
			"border-top": {
				cssExtra: c[3],
				cssPropBits: 7,
				cssLitGroup: [
					L[0],
					L[9],
					L[34],
					L[46],
					L[47],
					L[48],
					L[52],
					L[54],
					L[62]
				]
			},
			"border-top-color": {
				cssExtra: c[2],
				cssPropBits: 2,
				cssLitGroup: [L[0], L[47], L[62]]
			},
			"border-top-left-radius": { cssExtra: c[0], cssPropBits: 5 },
			"border-top-right-radius": { cssExtra: c[0], cssPropBits: 5 },
			"border-top-style": {
				cssPropBits: 0,
				cssLitGroup: [L[9], L[46], L[47], L[48], L[54]]
			},
			"border-top-width": {
				cssPropBits: 5,
				cssLitGroup: [L[34], L[47], L[52]]
			},
			"border-width": {
				cssPropBits: 5,
				cssLitGroup: [L[34], L[47], L[52]]
			},
			bottom: { cssPropBits: 5, cssLitGroup: [L[38], L[47]] },
			"box-shadow": {
				cssExtra: c[1],
				cssPropBits: 7,
				cssLitGroup: [L[0], L[35], L[48], L[54]]
			},
			"caption-side": { cssPropBits: 0, cssLitGroup: [L[24], L[47]] },
			clear: {
				cssPropBits: 0,
				cssLitGroup: [L[30], L[40], L[47], L[54]]
			},
			clip: {
				cssExtra: /^ *\s*rect\(\s*(?:0|[+\-]?\d+(?:\.\d+)?(?:[cem]m|ex|in|p[ctx])|auto)\s*,\s*(?:0|[+\-]?\d+(?:\.\d+)?(?:[cem]m|ex|in|p[ctx])|auto)\s*,\s*(?:0|[+\-]?\d+(?:\.\d+)?(?:[cem]m|ex|in|p[ctx])|auto)\s*,\s*(?:0|[+\-]?\d+(?:\.\d+)?(?:[cem]m|ex|in|p[ctx])|auto) *\) *$/i,
				cssPropBits: 0,
				cssLitGroup: [L[38], L[47]]
			},
			color: {
				cssExtra: c[2],
				cssPropBits: 130,
				cssLitGroup: [L[0], L[47]]
			},
			content: { cssPropBits: 0 },
			"counter-increment": {
				cssExtra: c[0],
				cssPropBits: 5,
				cssLitGroup: [L[47], L[54]]
			},
			"counter-reset": {
				cssExtra: c[0],
				cssPropBits: 5,
				cssLitGroup: [L[47], L[54]]
			},
			cue: { cssPropBits: 16, cssLitGroup: [L[47], L[54]] },
			"cue-after": { cssPropBits: 16, cssLitGroup: [L[47], L[54]] },
			"cue-before": { cssPropBits: 16, cssLitGroup: [L[47], L[54]] },
			cursor: {
				cssExtra: c[0],
				cssPropBits: 144,
				cssLitGroup: [L[1], L[35], L[38], L[47]]
			},
			direction: { cssPropBits: 0, cssLitGroup: [L[31], L[47]] },
			display: { cssPropBits: 32, cssLitGroup: [L[2], L[47], L[54]] },
			elevation: { cssPropBits: 5, cssLitGroup: [L[13], L[47]] },
			"empty-cells": { cssPropBits: 0, cssLitGroup: [L[27], L[47]] },
			filter: {
				cssExtra: /^ *(?:\s*alpha\(\s*opacity\s*=\s*(?:0|\d+(?:\.\d+)?%|[+\-]?\d+(?:\.\d+)?) *\))+ *$/i,
				cssPropBits: 32
			},
			float: {
				cssAlternates: ["cssFloat", "styleFloat"],
				cssPropBits: 32,
				cssLitGroup: [L[30], L[47], L[54]]
			},
			font: {
				cssExtra: c[0],
				cssPropBits: 9,
				cssLitGroup: [
					L[4],
					L[7],
					L[11],
					L[15],
					L[29],
					L[35],
					L[36],
					L[47],
					L[52],
					L[55],
					L[60]
				]
			},
			"font-family": {
				cssExtra: c[0],
				cssPropBits: 8,
				cssLitGroup: [L[15], L[35], L[47]]
			},
			"font-size": { cssPropBits: 1, cssLitGroup: [L[7], L[47], L[52]] },
			"font-stretch": { cssPropBits: 0, cssLitGroup: [L[5], L[55]] },
			"font-style": {
				cssPropBits: 0,
				cssLitGroup: [L[29], L[47], L[55]]
			},
			"font-variant": {
				cssPropBits: 0,
				cssLitGroup: [L[47], L[55], L[60]]
			},
			"font-weight": {
				cssPropBits: 0,
				cssLitGroup: [L[4], L[47], L[55]]
			},
			height: { cssPropBits: 37, cssLitGroup: [L[38], L[47]] },
			left: { cssPropBits: 37, cssLitGroup: [L[38], L[47]] },
			"letter-spacing": { cssPropBits: 5, cssLitGroup: [L[47], L[55]] },
			"line-height": { cssPropBits: 1, cssLitGroup: [L[47], L[55]] },
			"list-style": {
				cssPropBits: 16,
				cssLitGroup: [L[3], L[28], L[47], L[54]]
			},
			"list-style-image": {
				cssPropBits: 16,
				cssLitGroup: [L[47], L[54]]
			},
			"list-style-position": {
				cssPropBits: 0,
				cssLitGroup: [L[28], L[47]]
			},
			"list-style-type": {
				cssPropBits: 0,
				cssLitGroup: [L[3], L[47], L[54]]
			},
			margin: { cssPropBits: 5, cssLitGroup: [L[38], L[47]] },
			"margin-bottom": { cssPropBits: 5, cssLitGroup: [L[38], L[47]] },
			"margin-left": { cssPropBits: 5, cssLitGroup: [L[38], L[47]] },
			"margin-right": { cssPropBits: 5, cssLitGroup: [L[38], L[47]] },
			"margin-top": { cssPropBits: 5, cssLitGroup: [L[38], L[47]] },
			"max-height": {
				cssPropBits: 1,
				cssLitGroup: [L[38], L[47], L[54]]
			},
			"max-width": { cssPropBits: 1, cssLitGroup: [L[38], L[47], L[54]] },
			"min-height": { cssPropBits: 1, cssLitGroup: [L[38], L[47]] },
			"min-width": { cssPropBits: 1, cssLitGroup: [L[38], L[47]] },
			opacity: { cssPropBits: 33, cssLitGroup: [L[47]] },
			outline: {
				cssExtra: c[3],
				cssPropBits: 7,
				cssLitGroup: [
					L[0],
					L[9],
					L[34],
					L[46],
					L[47],
					L[48],
					L[49],
					L[52],
					L[54]
				]
			},
			"outline-color": {
				cssExtra: c[2],
				cssPropBits: 2,
				cssLitGroup: [L[0], L[47], L[49]]
			},
			"outline-style": {
				cssPropBits: 0,
				cssLitGroup: [L[9], L[46], L[47], L[48], L[54]]
			},
			"outline-width": {
				cssPropBits: 5,
				cssLitGroup: [L[34], L[47], L[52]]
			},
			overflow: {
				cssPropBits: 32,
				cssLitGroup: [L[38], L[46], L[47], L[58], L[63]]
			},
			"overflow-x": {
				cssPropBits: 0,
				cssLitGroup: [L[32], L[38], L[46], L[58], L[63]]
			},
			"overflow-y": {
				cssPropBits: 0,
				cssLitGroup: [L[32], L[38], L[46], L[58], L[63]]
			},
			padding: { cssPropBits: 1, cssLitGroup: [L[47]] },
			"padding-bottom": { cssPropBits: 33, cssLitGroup: [L[47]] },
			"padding-left": { cssPropBits: 33, cssLitGroup: [L[47]] },
			"padding-right": { cssPropBits: 33, cssLitGroup: [L[47]] },
			"padding-top": { cssPropBits: 33, cssLitGroup: [L[47]] },
			"page-break-after": {
				cssPropBits: 0,
				cssLitGroup: [L[30], L[37], L[38], L[39], L[47]]
			},
			"page-break-before": {
				cssPropBits: 0,
				cssLitGroup: [L[30], L[37], L[38], L[39], L[47]]
			},
			"page-break-inside": {
				cssPropBits: 0,
				cssLitGroup: [L[38], L[39], L[47]]
			},
			pause: { cssPropBits: 5, cssLitGroup: [L[47]] },
			"pause-after": { cssPropBits: 5, cssLitGroup: [L[47]] },
			"pause-before": { cssPropBits: 5, cssLitGroup: [L[47]] },
			pitch: { cssPropBits: 5, cssLitGroup: [L[19], L[47], L[52]] },
			"pitch-range": { cssPropBits: 5, cssLitGroup: [L[47]] },
			"play-during": {
				cssExtra: c[0],
				cssPropBits: 16,
				cssLitGroup: [L[38], L[47], L[53], L[54], L[57]]
			},
			position: { cssPropBits: 32, cssLitGroup: [L[20], L[47]] },
			quotes: {
				cssExtra: c[0],
				cssPropBits: 0,
				cssLitGroup: [L[47], L[54]]
			},
			richness: { cssPropBits: 5, cssLitGroup: [L[47]] },
			right: { cssPropBits: 37, cssLitGroup: [L[38], L[47]] },
			speak: {
				cssPropBits: 0,
				cssLitGroup: [L[47], L[54], L[55], L[61]]
			},
			"speak-header": {
				cssPropBits: 0,
				cssLitGroup: [L[37], L[47], L[56]]
			},
			"speak-numeral": { cssPropBits: 0, cssLitGroup: [L[26], L[47]] },
			"speak-punctuation": {
				cssPropBits: 0,
				cssLitGroup: [L[43], L[47], L[54]]
			},
			"speech-rate": {
				cssPropBits: 5,
				cssLitGroup: [L[12], L[47], L[52]]
			},
			stress: { cssPropBits: 5, cssLitGroup: [L[47]] },
			"table-layout": {
				cssPropBits: 0,
				cssLitGroup: [L[38], L[45], L[47]]
			},
			"text-align": {
				cssPropBits: 0,
				cssLitGroup: [L[30], L[42], L[47], L[50]]
			},
			"text-decoration": {
				cssPropBits: 0,
				cssLitGroup: [L[18], L[47], L[54]]
			},
			"text-indent": { cssPropBits: 5, cssLitGroup: [L[47]] },
			"text-overflow": { cssPropBits: 0, cssLitGroup: [L[25]] },
			"text-shadow": {
				cssExtra: c[1],
				cssPropBits: 7,
				cssLitGroup: [L[0], L[35], L[48], L[54]]
			},
			"text-transform": {
				cssPropBits: 0,
				cssLitGroup: [L[21], L[47], L[54]]
			},
			"text-wrap": { cssPropBits: 0, cssLitGroup: [L[33], L[54], L[55]] },
			top: { cssPropBits: 37, cssLitGroup: [L[38], L[47]] },
			"unicode-bidi": {
				cssPropBits: 0,
				cssLitGroup: [L[23], L[47], L[55]]
			},
			"vertical-align": {
				cssPropBits: 5,
				cssLitGroup: [L[10], L[24], L[47]]
			},
			visibility: {
				cssPropBits: 32,
				cssLitGroup: [L[44], L[46], L[47], L[63]]
			},
			"voice-family": {
				cssExtra: c[0],
				cssPropBits: 8,
				cssLitGroup: [L[22], L[35], L[47]]
			},
			volume: { cssPropBits: 1, cssLitGroup: [L[16], L[47], L[52]] },
			"white-space": {
				cssPropBits: 0,
				cssLitGroup: [L[8], L[47], L[55]]
			},
			width: { cssPropBits: 33, cssLitGroup: [L[38], L[47]] },
			"word-spacing": { cssPropBits: 5, cssLitGroup: [L[47], L[55]] },
			"word-wrap": { cssPropBits: 0, cssLitGroup: [L[41], L[55]] },
			"z-index": { cssPropBits: 69, cssLitGroup: [L[38], L[47]] },
			zoom: { cssPropBits: 1, cssLitGroup: [L[55]] }
		};
	})(),
	decodeCss,
	html,
	html4,
	html_sanitize,
	lexCss,
	parseCssDeclarations,
	parseCssStylesheet,
	sanitizeCssProperty,
	sanitizeStylesheet;
if (
	("undefined" != typeof window && (window.cssSchema = cssSchema),
	(function() {
		function decodeCssEscape(s) {
			var i = parseInt(s.substring(1), 16);
			return i > 65535
				? ((i -= 65536),
					String.fromCharCode(55296 + (i >> 10), 56320 + (1023 & i)))
				: i == i ? String.fromCharCode(i) : s[1] < " " ? "" : s[1];
		}
		function escapeCssString(s, replacer) {
			return (
				'"' + s.replace(/[\u0000-\u001f\\\"\x3c\x3e]/g, replacer) + '"'
			);
		}
		function escapeCssStrChar(ch) {
			return (
				cssStrChars[ch] ||
				(cssStrChars[ch] = "\\" + ch.charCodeAt(0).toString(16) + " ")
			);
		}
		function escapeCssUrlChar(ch) {
			return (
				cssUrlChars[ch] ||
				(cssUrlChars[ch] =
					("" > ch ? "%0" : "%") + ch.charCodeAt(0).toString(16))
			);
		}
		var ATKEYWORD,
			BOM,
			CDC,
			CDO,
			CHAR,
			CMP_OPS,
			COMMENT,
			CSS_TOKEN,
			DASHMATCH,
			DIMENSION,
			ESCAPE,
			ESCAPE_TAIL,
			FUNCTION,
			HASH,
			IDENT,
			INCLUDES,
			NAME,
			NL,
			NMCHAR,
			NMSTART,
			NONASCII,
			NUM,
			NUMBER,
			NUMERIC_VALUE,
			PERCENTAGE,
			PREFIXMATCH,
			S,
			STRING,
			STRINGCHAR,
			SUBSTRINGMATCH,
			SUFFIXMATCH,
			SURROGATE_PAIR,
			UNICODE,
			UNICODE_RANGE,
			UNICODE_TAIL,
			URI,
			URLCHAR,
			W,
			WC,
			WORD_TERM,
			cssStrChars,
			cssUrlChars;
		(cssStrChars = { "\\": "\\\\" }),
			(cssUrlChars = { "\\": "%5c" }),
			(WC = "[\\t\\n\\f ]"),
			(W = WC + "*"),
			(NL = "[\\n\\f]"),
			(SURROGATE_PAIR = "[\\ud800-\\udbff][\\udc00-\\udfff]"),
			(NONASCII = "[\\u0080-\\ud7ff\\ue000-\\ufffd]|" + SURROGATE_PAIR),
			(UNICODE_TAIL = "[0-9a-fA-F]{1,6}" + WC + "?"),
			(UNICODE = "\\\\" + UNICODE_TAIL),
			(ESCAPE_TAIL =
				"(?:" +
				UNICODE_TAIL +
				"|[\\u0020-\\u007e\\u0080-\\ud7ff\\ue000\\ufffd]|" +
				SURROGATE_PAIR +
				")"),
			(ESCAPE = "\\\\" + ESCAPE_TAIL),
			(URLCHAR =
				"(?:[\\t\\x21\\x23-\\x26\\x28-\\x5b\\x5d-\\x7e]|" +
				NONASCII +
				"|" +
				ESCAPE +
				")"),
			(STRINGCHAR = "[^'\"\\n\\f\\\\]|\\\\[\\s\\S]"),
			(STRING =
				"\"(?:'|" + STRINGCHAR + ')*"|\'(?:"|' + STRINGCHAR + ")*'"),
			(NUM = "[-+]?(?:[0-9]+(?:[.][0-9]+)?|[.][0-9]+)"),
			(NMSTART = "(?:[a-zA-Z_]|" + NONASCII + "|" + ESCAPE + ")"),
			(NMCHAR = "(?:[a-zA-Z0-9_-]|" + NONASCII + "|" + ESCAPE + ")"),
			(NAME = NMCHAR + "+"),
			(IDENT = "-?" + NMSTART + NMCHAR + "*"),
			(ATKEYWORD = "@" + IDENT),
			(HASH = "#" + NAME),
			(NUMBER = NUM),
			(WORD_TERM = "(?:@?-?" + NMSTART + "|#)" + NMCHAR + "*"),
			(PERCENTAGE = NUM + "%"),
			(DIMENSION = NUM + IDENT),
			(NUMERIC_VALUE = NUM + "(?:%|" + IDENT + ")?"),
			(URI =
				"url[(]" +
				W +
				"(?:" +
				STRING +
				"|" +
				URLCHAR +
				"*)" +
				W +
				"[)]"),
			(UNICODE_RANGE = "U[+][0-9A-F?]{1,6}(?:-[0-9A-F]{1,6})?"),
			(CDO = "<!--"),
			(CDC = "-->"),
			(S = WC + "+"),
			(COMMENT = "/(?:[*][^*]*[*]+(?:[^/][^*]*[*]+)*/|/[^\\n\\f]*)"),
			(FUNCTION = "(?!url[(])" + IDENT + "[(]"),
			(INCLUDES = "~="),
			(DASHMATCH = "[|]="),
			(PREFIXMATCH = "[^]="),
			(SUFFIXMATCH = "[$]="),
			(SUBSTRINGMATCH = "[*]="),
			(CMP_OPS = "[~|^$*]="),
			(CHAR = "[^\"'\\\\/]|/(?![/*])"),
			(BOM = "\\uFEFF"),
			(CSS_TOKEN = new RegExp(
				[
					BOM,
					UNICODE_RANGE,
					URI,
					FUNCTION,
					WORD_TERM,
					STRING,
					NUMERIC_VALUE,
					CDO,
					CDC,
					S,
					COMMENT,
					CMP_OPS,
					CHAR
				].join("|"),
				"gi"
			)),
			(decodeCss = function(css) {
				return css.replace(
					new RegExp("\\\\(?:" + ESCAPE_TAIL + "|" + NL + ")", "g"),
					decodeCssEscape
				);
			}),
			(lexCss = function(cssText) {
				var cc, i, j, last, len, n, tok, tokens;
				for (
					cssText = "" + cssText,
						tokens =
							cssText.replace(/\r\n?/g, "\n").match(CSS_TOKEN) ||
							[],
						j = 0,
						last = " ",
						i = 0,
						n = tokens.length;
					n > i;
					++i
				)
					(tok = decodeCss(tokens[i])),
						(len = tok.length),
						(cc = tok.charCodeAt(0)),
						(tok =
							cc == '"'.charCodeAt(0) || cc == "'".charCodeAt(0)
								? escapeCssString(
										tok.substring(1, len - 1),
										escapeCssStrChar
									)
								: (cc == "/".charCodeAt(0) && len > 1) ||
									"\\" == tok ||
									tok == CDC ||
									tok == CDO ||
									"\ufeff" == tok ||
									cc <= " ".charCodeAt(0)
									? " "
									: /url\(/i.test(tok)
										? "url(" +
											escapeCssString(
												tok.replace(
													new RegExp(
														"^url\\(" +
															W +
															"[\"']?|[\"']?" +
															W +
															"\\)$",
														"gi"
													),
													""
												),
												escapeCssUrlChar
											) +
											")"
										: tok),
						(last != tok || " " != tok) &&
							(tokens[j++] = last = tok);
				return (tokens.length = j), tokens;
			});
	})(),
	"undefined" != typeof window &&
		((window.lexCss = lexCss), (window.decodeCss = decodeCss)),
	(sanitizeCssProperty = (function() {
		function normalizeUrl(s) {
			return "string" == typeof s
				? 'url("' + s.replace(NORM_URL_REGEXP, normalizeUrlChar) + '")'
				: NOEFFECT_URL;
		}
		function normalizeUrlChar(ch) {
			return NORM_URL_REPLACEMENTS[ch];
		}
		function safeUri(uri, prop, naiveUriRewriter) {
			var parsed;
			return naiveUriRewriter
				? ((parsed = ("" + uri).match(URI_SCHEME_RE)),
					!parsed || (parsed[1] && !ALLOWED_URI_SCHEMES.test(parsed[1]))
						? null
						: naiveUriRewriter(uri, prop))
				: null;
		}
		function unionArrays(arrs) {
			var arr,
				i,
				j,
				map = {};
			for (i = arrs.length; --i >= 0; )
				for (arr = arrs[i], j = arr.length; --j >= 0; )
					map[arr[j]] = ALLOWED_LITERAL;
			return map;
		}
		function normalizeFunctionCall(tokens, start) {
			for (
				var token, parenDepth = 1, end = start + 1, n = tokens.length;
				n > end && parenDepth;

			)
				(token = tokens[end++]),
					(parenDepth += "(" === token ? 1 : ")" === token ? -1 : 0);
			return end;
		}
		var ALLOWED_LITERAL,
			ALLOWED_URI_SCHEMES,
			URI_SCHEME_RE,
			NOEFFECT_URL = 'url("about:blank")',
			NORM_URL_REGEXP = /[\n\f\r\"\'()*\x3c\x3e]/g,
			NORM_URL_REPLACEMENTS = {
				"\n": "%0a",
				"\f": "%0c",
				"\r": "%0d",
				'"': "%22",
				"'": "%27",
				"(": "%28",
				")": "%29",
				"*": "%2a",
				"<": "%3c",
				">": "%3e"
			};
		return (
			(URI_SCHEME_RE = new RegExp("^(?:([^:/?# ]+):)?")),
			(ALLOWED_URI_SCHEMES = /^(?:https?|mailto)$/i),
			(ALLOWED_LITERAL = {}),
			function(property, propertySchema, tokens, opt_naiveUriRewriter) {
				for (
					var cc,
						cc1,
						cc2,
						end,
						isnum1,
						isnum2,
						litGroup,
						litMap,
						token,
						propBits = propertySchema.cssPropBits,
						qstringBits =
							propBits &
							(CSS_PROP_BIT_QSTRING_CONTENT |
								CSS_PROP_BIT_QSTRING_URL),
						lastQuoted = 0 / 0,
						i = 0,
						k = 0;
					i < tokens.length;
					++i
				)
					(token = tokens[i].toLowerCase()),
						(cc = token.charCodeAt(0)),
						(token =
							cc === " ".charCodeAt(0)
								? ""
								: cc === '"'.charCodeAt(0)
									? qstringBits === CSS_PROP_BIT_QSTRING_URL &&
										opt_naiveUriRewriter
										? normalizeUrl(
												safeUri(
													decodeCss(
														tokens[i].substring(
															1,
															token.length - 1
														)
													),
													property,
													opt_naiveUriRewriter
												)
											)
										: qstringBits ===
											CSS_PROP_BIT_QSTRING_CONTENT
											? token
											: ""
									: cc === "#".charCodeAt(0) &&
										/^#(?:[0-9a-f]{3}){1,2}$/.test(token)
										? propBits & CSS_PROP_BIT_HASH_VALUE
											? token
											: ""
										: "0".charCodeAt(0) <= cc &&
											cc <= "9".charCodeAt(0)
											? propBits & CSS_PROP_BIT_QUANTITY
												? propBits & CSS_PROP_BIT_Z_INDEX
													? token.match(/^\d{1,7}$/)
														? token
														: ""
													: token
												: ""
											: ((cc1 = token.charCodeAt(1)),
												(cc2 = token.charCodeAt(2)),
												(isnum1 =
													"0".charCodeAt(0) <= cc1 &&
													cc1 <= "9".charCodeAt(0)),
												(isnum2 =
													"0".charCodeAt(0) <= cc2 &&
													cc2 <= "9".charCodeAt(0)),
												cc === "+".charCodeAt(0) &&
												(isnum1 ||
													(cc1 === ".".charCodeAt(0) &&
														isnum2))
													? propBits & CSS_PROP_BIT_QUANTITY
														? propBits & CSS_PROP_BIT_Z_INDEX
															? token.match(/^\+\d{1,7}$/)
																? token
																: ""
															: (isnum1 ? "" : "0") +
																token.substring(1)
														: ""
													: cc === "-".charCodeAt(0) &&
														(isnum1 ||
															(cc1 === ".".charCodeAt(0) &&
																isnum2))
														? propBits &
															CSS_PROP_BIT_NEGATIVE_QUANTITY
															? propBits &
																CSS_PROP_BIT_Z_INDEX
																? token.match(/^\-\d{1,7}$/)
																	? token
																	: ""
																: (isnum1 ? "-" : "-0") +
																	token.substring(1)
															: propBits &
																CSS_PROP_BIT_QUANTITY
																? "0"
																: ""
														: cc === ".".charCodeAt(0) &&
															isnum1
															? propBits &
																CSS_PROP_BIT_QUANTITY
																? "0" + token
																: ""
															: "url(" ===
																token.substring(0, 4)
																? opt_naiveUriRewriter &&
																	qstringBits &
																		CSS_PROP_BIT_QSTRING_URL
																	? normalizeUrl(
																			safeUri(
																				tokens[
																					i
																				].substring(
																					5,
																					token.length -
																						2
																				),
																				property,
																				opt_naiveUriRewriter
																			)
																		)
																	: ""
																: ("(" ===
																		token.charAt(
																			token.length - 1
																		) &&
																		((end = normalizeFunctionCall(
																			tokens,
																			i
																		)),
																		tokens.splice(
																			i,
																			end - i,
																			(token = tokens
																				.slice(i, end)
																				.join(" "))
																		)),
																	(litGroup =
																		propertySchema.cssLitGroup),
																	(litMap = litGroup
																		? propertySchema.cssLitMap ||
																			(propertySchema.cssLitMap = unionArrays(
																				litGroup
																			))
																		: ALLOWED_LITERAL),
																	litMap[token] ===
																		ALLOWED_LITERAL ||
																	(propertySchema.cssExtra &&
																		propertySchema.cssExtra.test(
																			token
																		))
																		? token
																		: /^\w+$/.test(token) &&
																			qstringBits ===
																				CSS_PROP_BIT_QSTRING_CONTENT
																			? lastQuoted + 1 === k
																				? ((tokens[
																						lastQuoted
																					] =
																						tokens[
																							lastQuoted
																						].substring(
																							0,
																							tokens[
																								lastQuoted
																							].length -
																								1
																						) +
																						" " +
																						token +
																						'"'),
																					(token = ""))
																				: ((lastQuoted = k),
																					'"' + token + '"')
																			: ""))),
						token && (tokens[k++] = token);
				1 === k && tokens[0] === NOEFFECT_URL && (k = 0),
					(tokens.length = k);
			}
		);
	})()),
	(sanitizeStylesheet = (function() {
		function sanitizeHistorySensitive(blockOfProperties) {
			var i,
				n,
				token,
				elide = !1;
			for (i = 0, n = blockOfProperties.length; n - 1 > i; ++i)
				(token = blockOfProperties[i]),
					":" === blockOfProperties[i + 1] &&
						(elide = !(
							cssSchema[token].cssPropBits &
							CSS_PROP_BIT_ALLOWED_IN_LINK
						)),
					elide && (blockOfProperties[i] = ""),
					";" === token && (elide = !1);
			return blockOfProperties.join("");
		}
		var allowed = {},
			cssMediaTypeWhitelist = {
				braille: allowed,
				embossed: allowed,
				handheld: allowed,
				print: allowed,
				projection: allowed,
				screen: allowed,
				speech: allowed,
				tty: allowed,
				tv: allowed
			};
		return function(cssText, suffix, opt_naiveUriRewriter) {
			function checkElide() {
				elide =
					0 !== blockStack.length &&
					null !== blockStack[blockStack.length - 1];
			}
			var safeCss = void 0,
				blockStack = [],
				elide = !1;
			return (
				parseCssStylesheet(cssText, {
					startStylesheet: function() {
						safeCss = [];
					},
					endStylesheet: function() {},
					startAtrule: function(atIdent, headerArray) {
						elide
							? (atIdent = null)
							: "@media" === atIdent
								? ((headerArray = headerArray.filter(function(
										mediaType
									) {
										return (
											cssMediaTypeWhitelist[mediaType] ==
											allowed
										);
									})),
									headerArray.length
										? safeCss.push(
												atIdent,
												headerArray.join(","),
												"{"
											)
										: (atIdent = null))
								: ("@import" === atIdent &&
										window.console &&
										window.console.log(
											"@import " +
												headerArray.join(" ") +
												" elided"
										),
									(atIdent = null)),
							(elide = !atIdent),
							blockStack.push(atIdent);
					},
					endAtrule: function() {
						blockStack.pop();
						elide || safeCss.push(";"), checkElide();
					},
					startBlock: function() {
						elide || safeCss.push("{");
					},
					endBlock: function() {
						elide || (safeCss.push("}"), (elide = !0));
					},
					startRuleset: function(selectorArray) {
						var historyInsensitiveSelectors,
							selector,
							selectors,
							historySensitiveSelectors = void 0,
							removeHistoryInsensitiveSelectors = !1;
						elide ||
							((selectors = sanitizeCssSelectors(
								selectorArray,
								suffix
							)),
							(historyInsensitiveSelectors = selectors[0]),
							(historySensitiveSelectors = selectors[1]),
							historyInsensitiveSelectors.length ||
							historySensitiveSelectors.length
								? ((selector = historyInsensitiveSelectors.join(
										", "
									)),
									selector ||
										((selector = "head > html"),
										(removeHistoryInsensitiveSelectors = !0)),
									safeCss.push(selector, "{"))
								: (elide = !0)),
							blockStack.push(
								elide
									? null
									: {
											historySensitiveSelectors: historySensitiveSelectors,
											endOfSelectors: safeCss.length - 1,
											removeHistoryInsensitiveSelectors: removeHistoryInsensitiveSelectors
										}
							);
					},
					endRuleset: function() {
						var extraSelectors,
							propertyGroupTokens,
							rules = blockStack.pop(),
							propertiesEnd = safeCss.length;
						elide ||
							(safeCss.push("}"),
							rules &&
								((extraSelectors =
									rules.historySensitiveSelectors),
								extraSelectors.length &&
									((propertyGroupTokens = safeCss.slice(
										rules.endOfSelectors
									)),
									safeCss.push(
										extraSelectors.join(", "),
										sanitizeHistorySensitive(
											propertyGroupTokens
										)
									)))),
							rules &&
								rules.removeHistoryInsensitiveSelectors &&
								safeCss.splice(
									rules.endOfSelectors - 1,
									propertiesEnd + 1
								),
							checkElide();
					},
					declaration: function(property, valueArray) {
						var schema;
						elide ||
							((schema = cssSchema[property]),
							schema &&
								(sanitizeCssProperty(
									property,
									schema,
									valueArray,
									opt_naiveUriRewriter
								),
								valueArray.length &&
									safeCss.push(
										property,
										":",
										valueArray.join(" "),
										";"
									)));
					}
				}),
				safeCss.join("")
			);
		};
	})()),
	"undefined" != typeof window &&
		((window.sanitizeCssProperty = sanitizeCssProperty),
		(window.sanitizeCssSelectors = sanitizeCssSelectors),
		(window.sanitizeStylesheet = sanitizeStylesheet)),
	"i" !== "I".toLowerCase())
)
	throw "I/i problem";
if (
	((function() {
		function statement(toks, i, n, handler) {
			var tok;
			return n > i
				? ((tok = toks[i]),
					"@" === tok.charAt(0)
						? atrule(toks, i, n, handler, !0)
						: ruleset(toks, i, n, handler))
				: i;
		}
		function atrule(toks, i, n, handler, blockok) {
			for (
				var e, s, start = i++;
				n > i && "{" !== toks[i] && ";" !== toks[i];

			)
				++i;
			return (
				n > i &&
					(blockok || ";" === toks[i]) &&
					((s = start + 1),
					(e = i),
					n > s && " " === toks[s] && ++s,
					e > s && " " === toks[e - 1] && --e,
					handler.startAtrule &&
						handler.startAtrule(
							toks[start].toLowerCase(),
							toks.slice(s, e)
						),
					(i = "{" === toks[i] ? block(toks, i, n, handler) : i + 1),
					handler.endAtrule && handler.endAtrule()),
				i
			);
		}
		function block(toks, i, n, handler) {
			var ch;
			for (++i, handler.startBlock && handler.startBlock(); n > i; ) {
				if (((ch = toks[i].charAt(0)), "}" == ch)) {
					++i;
					break;
				}
				" " === ch || ";" === ch
					? (i += 1)
					: (i =
							"@" === ch
								? atrule(toks, i, n, handler, !1)
								: "{" === ch
									? block(toks, i, n, handler)
									: ruleset(toks, i, n, handler));
			}
			return handler.endBlock && handler.endBlock(), i;
		}
		function ruleset(toks, i, n, handler) {
			var tok,
				s = i,
				e = selector(toks, i, n, !0);
			if (0 > e) return (e = ~e), i === e ? e + 1 : e;
			if (
				((i = e),
				e > s && " " === toks[e - 1] && --e,
				(tok = toks[i]),
				++i,
				"{" !== tok)
			)
				return i;
			for (
				handler.startRuleset && handler.startRuleset(toks.slice(s, e));
				n > i;

			) {
				if (((tok = toks[i]), "}" === tok)) {
					++i;
					break;
				}
				" " === tok ? (i += 1) : (i = declaration(toks, i, n, handler));
			}
			return (
				handler.endRuleset && handler.endRuleset(), n > i ? i + 1 : i
			);
		}
		function selector(toks, i, n, allowSemi) {
			for (var tok, brackets = [], stackLast = -1; n > i; ++i)
				if (((tok = toks[i].charAt(0)), "[" === tok || "(" === tok))
					brackets[++stackLast] = tok;
				else if (
					("]" === tok && "[" === brackets[stackLast]) ||
					(")" === tok && "(" === brackets[stackLast])
				)
					--stackLast;
				else if (
					"{" === tok ||
					"}" === tok ||
					";" === tok ||
					"@" === tok ||
					(":" === tok && !allowSemi)
				)
					break;
			return stackLast >= 0 && (i = ~(i + 1)), i;
		}
		function declaration(toks, i, n, handler) {
			var e,
				j,
				s,
				tok,
				value,
				valuelen,
				property = toks[i++];
			if (!ident.test(property)) return i + 1;
			if ((n > i && " " === toks[i] && ++i, i == n || ":" !== toks[i])) {
				for (; n > i && ";" !== (tok = toks[i]) && "}" !== tok; ) ++i;
				return i;
			}
			if (
				(++i,
				n > i && " " === toks[i] && ++i,
				(s = i),
				(e = selector(toks, i, n, !1)),
				0 > e)
			)
				e = ~e;
			else {
				for (value = [], valuelen = 0, j = s; e > j; ++j)
					(tok = toks[j]), " " !== tok && (value[valuelen++] = tok);
				if (n > e) {
					do {
						if (((tok = toks[e]), ";" === tok || "}" === tok))
							break;
						valuelen = 0;
					} while (++e < n);
					";" === tok && ++e;
				}
				valuelen &&
					handler.declaration &&
					handler.declaration(property.toLowerCase(), value);
			}
			return e;
		}
		var ident;
		(parseCssStylesheet = function(cssText, handler) {
			var i,
				n,
				toks = lexCss(cssText);
			for (
				handler.startStylesheet && handler.startStylesheet(),
					i = 0,
					n = toks.length;
				n > i;

			)
				i = " " === toks[i] ? i + 1 : statement(toks, i, n, handler);
			handler.endStylesheet && handler.endStylesheet();
		}),
			(ident = /^-?[a-z]/i),
			(parseCssDeclarations = function(cssText, handler) {
				var i,
					n,
					toks = lexCss(cssText);
				for (i = 0, n = toks.length; n > i; )
					i =
						" " !== toks[i]
							? declaration(toks, i, n, handler)
							: i + 1;
			});
	})(),
	"undefined" != typeof window &&
		((window.parseCssStylesheet = parseCssStylesheet),
		(window.parseCssDeclarations = parseCssDeclarations)),
	(html4 = {}),
	(html4.atype = {
		NONE: 0,
		URI: 1,
		URI_FRAGMENT: 11,
		SCRIPT: 2,
		STYLE: 3,
		ID: 4,
		IDREF: 5,
		IDREFS: 6,
		GLOBAL_NAME: 7,
		LOCAL_NAME: 8,
		CLASSES: 9,
		FRAME_TARGET: 10
	}),
	(html4.ATTRIBS = {
		"*::class": 9,
		"*::dir": 0,
		"*::id": 4,
		"*::lang": 0,
		"*::onclick": 2,
		"*::ondblclick": 2,
		"*::onkeydown": 2,
		"*::onkeypress": 2,
		"*::onkeyup": 2,
		"*::onload": 2,
		"*::onmousedown": 2,
		"*::onmousemove": 2,
		"*::onmouseout": 2,
		"*::onmouseover": 2,
		"*::onmouseup": 2,
		"*::style": 3,
		"*::title": 0,
		"a::accesskey": 0,
		"a::coords": 0,
		"a::href": 1,
		"a::hreflang": 0,
		"a::name": 7,
		"a::onblur": 2,
		"a::onfocus": 2,
		"a::rel": 0,
		"a::rev": 0,
		"a::shape": 0,
		"a::tabindex": 0,
		"a::target": 10,
		"a::type": 0,
		"area::accesskey": 0,
		"area::alt": 0,
		"area::coords": 0,
		"area::href": 1,
		"area::nohref": 0,
		"area::onblur": 2,
		"area::onfocus": 2,
		"area::shape": 0,
		"area::tabindex": 0,
		"area::target": 10,
		"bdo::dir": 0,
		"blockquote::cite": 1,
		"br::clear": 0,
		"button::accesskey": 0,
		"button::disabled": 0,
		"button::name": 8,
		"button::onblur": 2,
		"button::onfocus": 2,
		"button::tabindex": 0,
		"button::type": 0,
		"button::value": 0,
		"canvas::height": 0,
		"canvas::width": 0,
		"caption::align": 0,
		"col::align": 0,
		"col::char": 0,
		"col::charoff": 0,
		"col::span": 0,
		"col::valign": 0,
		"col::width": 0,
		"colgroup::align": 0,
		"colgroup::char": 0,
		"colgroup::charoff": 0,
		"colgroup::span": 0,
		"colgroup::valign": 0,
		"colgroup::width": 0,
		"del::cite": 1,
		"del::datetime": 0,
		"dir::compact": 0,
		"div::align": 0,
		"dl::compact": 0,
		"font::color": 0,
		"font::face": 0,
		"font::size": 0,
		"form::accept": 0,
		"form::action": 1,
		"form::autocomplete": 0,
		"form::enctype": 0,
		"form::method": 0,
		"form::name": 7,
		"form::onreset": 2,
		"form::onsubmit": 2,
		"form::target": 10,
		"h1::align": 0,
		"h2::align": 0,
		"h3::align": 0,
		"h4::align": 0,
		"h5::align": 0,
		"h6::align": 0,
		"hr::align": 0,
		"hr::noshade": 0,
		"hr::size": 0,
		"hr::width": 0,
		"iframe::align": 0,
		"iframe::frameborder": 0,
		"iframe::height": 0,
		"iframe::marginheight": 0,
		"iframe::marginwidth": 0,
		"iframe::width": 0,
		"img::align": 0,
		"img::alt": 0,
		"img::border": 0,
		"img::height": 0,
		"img::hspace": 0,
		"img::ismap": 0,
		"img::name": 7,
		"img::src": 1,
		"img::usemap": 11,
		"img::vspace": 0,
		"img::width": 0,
		"input::accept": 0,
		"input::accesskey": 0,
		"input::align": 0,
		"input::alt": 0,
		"input::autocomplete": 0,
		"input::checked": 0,
		"input::disabled": 0,
		"input::ismap": 0,
		"input::maxlength": 0,
		"input::name": 8,
		"input::onblur": 2,
		"input::onchange": 2,
		"input::onfocus": 2,
		"input::onselect": 2,
		"input::readonly": 0,
		"input::size": 0,
		"input::src": 1,
		"input::tabindex": 0,
		"input::type": 0,
		"input::usemap": 11,
		"input::value": 0,
		"ins::cite": 1,
		"ins::datetime": 0,
		"label::accesskey": 0,
		"label::for": 5,
		"label::onblur": 2,
		"label::onfocus": 2,
		"legend::accesskey": 0,
		"legend::align": 0,
		"li::type": 0,
		"li::value": 0,
		"map::name": 7,
		"menu::compact": 0,
		"ol::compact": 0,
		"ol::start": 0,
		"ol::type": 0,
		"optgroup::disabled": 0,
		"optgroup::label": 0,
		"option::disabled": 0,
		"option::label": 0,
		"option::selected": 0,
		"option::value": 0,
		"p::align": 0,
		"pre::width": 0,
		"q::cite": 1,
		"select::disabled": 0,
		"select::multiple": 0,
		"select::name": 8,
		"select::onblur": 2,
		"select::onchange": 2,
		"select::onfocus": 2,
		"select::size": 0,
		"select::tabindex": 0,
		"table::align": 0,
		"table::bgcolor": 0,
		"table::border": 0,
		"table::cellpadding": 0,
		"table::cellspacing": 0,
		"table::frame": 0,
		"table::rules": 0,
		"table::summary": 0,
		"table::width": 0,
		"tbody::align": 0,
		"tbody::char": 0,
		"tbody::charoff": 0,
		"tbody::valign": 0,
		"td::abbr": 0,
		"td::align": 0,
		"td::axis": 0,
		"td::bgcolor": 0,
		"td::char": 0,
		"td::charoff": 0,
		"td::colspan": 0,
		"td::headers": 6,
		"td::height": 0,
		"td::nowrap": 0,
		"td::rowspan": 0,
		"td::scope": 0,
		"td::valign": 0,
		"td::width": 0,
		"textarea::accesskey": 0,
		"textarea::cols": 0,
		"textarea::disabled": 0,
		"textarea::name": 8,
		"textarea::onblur": 2,
		"textarea::onchange": 2,
		"textarea::onfocus": 2,
		"textarea::onselect": 2,
		"textarea::readonly": 0,
		"textarea::rows": 0,
		"textarea::tabindex": 0,
		"tfoot::align": 0,
		"tfoot::char": 0,
		"tfoot::charoff": 0,
		"tfoot::valign": 0,
		"th::abbr": 0,
		"th::align": 0,
		"th::axis": 0,
		"th::bgcolor": 0,
		"th::char": 0,
		"th::charoff": 0,
		"th::colspan": 0,
		"th::headers": 6,
		"th::height": 0,
		"th::nowrap": 0,
		"th::rowspan": 0,
		"th::scope": 0,
		"th::valign": 0,
		"th::width": 0,
		"thead::align": 0,
		"thead::char": 0,
		"thead::charoff": 0,
		"thead::valign": 0,
		"tr::align": 0,
		"tr::bgcolor": 0,
		"tr::char": 0,
		"tr::charoff": 0,
		"tr::valign": 0,
		"ul::compact": 0,
		"ul::type": 0
	}),
	(html4.eflags = {
		OPTIONAL_ENDTAG: 1,
		EMPTY: 2,
		CDATA: 4,
		RCDATA: 8,
		UNSAFE: 16,
		FOLDABLE: 32,
		SCRIPT: 64,
		STYLE: 128
	}),
	(html4.ELEMENTS = {
		a: 0,
		abbr: 0,
		acronym: 0,
		address: 0,
		applet: 16,
		area: 2,
		article: 16,
		aside: 16,
		audio: 16,
		b: 0,
		base: 18,
		basefont: 18,
		bdi: 16,
		bdo: 0,
		big: 0,
		blockquote: 0,
		body: 49,
		br: 2,
		button: 0,
		canvas: 0,
		caption: 0,
		center: 0,
		cite: 0,
		code: 0,
		col: 2,
		colgroup: 1,
		data: 16,
		datalist: 16,
		dd: 1,
		del: 0,
		details: 16,
		dfn: 0,
		dir: 0,
		div: 0,
		dl: 0,
		dt: 1,
		em: 0,
		fieldset: 0,
		figcaption: 16,
		figure: 16,
		font: 0,
		footer: 16,
		form: 0,
		frame: 18,
		frameset: 16,
		h1: 0,
		h2: 0,
		h3: 0,
		h4: 0,
		h5: 0,
		h6: 0,
		head: 49,
		header: 16,
		hgroup: 16,
		hr: 2,
		html: 49,
		i: 0,
		iframe: 4,
		img: 2,
		input: 2,
		ins: 0,
		isindex: 18,
		kbd: 0,
		label: 0,
		legend: 0,
		li: 1,
		link: 18,
		map: 0,
		mark: 16,
		menu: 0,
		meta: 18,
		meter: 16,
		nav: 0,
		nobr: 0,
		noembed: 4,
		noframes: 20,
		noscript: 20,
		object: 16,
		ol: 0,
		optgroup: 0,
		option: 1,
		output: 16,
		p: 1,
		param: 18,
		pre: 0,
		progress: 16,
		q: 0,
		s: 0,
		samp: 0,
		script: 84,
		section: 16,
		select: 0,
		small: 0,
		span: 0,
		strike: 0,
		strong: 0,
		style: 148,
		sub: 0,
		summary: 16,
		sup: 0,
		table: 0,
		tbody: 1,
		td: 1,
		textarea: 8,
		tfoot: 1,
		th: 1,
		thead: 1,
		time: 16,
		title: 24,
		tr: 1,
		tt: 0,
		u: 0,
		ul: 0,
		var: 0,
		video: 16
	}),
	(html4.ueffects = { NOT_LOADED: 0, SAME_DOCUMENT: 1, NEW_DOCUMENT: 2 }),
	(html4.URIEFFECTS = {
		"a::href": 2,
		"area::href": 2,
		"blockquote::cite": 0,
		"body::background": 1,
		"del::cite": 0,
		"form::action": 2,
		"img::src": 1,
		"input::src": 1,
		"ins::cite": 0,
		"q::cite": 0
	}),
	(html4.ltypes = { UNSANDBOXED: 2, SANDBOXED: 1, DATA: 0 }),
	(html4.LOADERTYPES = {
		"a::href": 2,
		"area::href": 2,
		"blockquote::cite": 2,
		"body::background": 1,
		"del::cite": 2,
		"form::action": 2,
		"img::src": 1,
		"input::src": 1,
		"ins::cite": 2,
		"q::cite": 2
	}),
	(html4.ATTRIBS = html4.ATTRIBS),
	(html4.ELEMENTS = html4.ELEMENTS),
	(html4.URIEFFECTS = html4.URIEFFECTS),
	(html4.LOADERTYPES = html4.LOADERTYPES),
	(html4.atype = html4.atype),
	(html4.eflags = html4.eflags),
	(html4.ltypes = html4.ltypes),
	(html4.ueffects = html4.ueffects),
	"undefined" != typeof window && (window.html4 = html4),
	"i" !== "I".toLowerCase())
)
	throw "I/i problem";
(html = (function(html4) {
	function lookupEntity(name) {
		var m;
		return (
			(name = name.toLowerCase()),
			ENTITIES.hasOwnProperty(name)
				? ENTITIES[name]
				: ((m = name.match(decimalEscapeRe)),
					m
						? String.fromCharCode(parseInt(m[1], 10))
						: (m = name.match(hexEscapeRe))
							? String.fromCharCode(parseInt(m[1], 16))
							: "")
		);
	}
	function decodeOneEntity(_, name) {
		return lookupEntity(name);
	}
	function stripNULs(s) {
		return s.replace(nulRe, "");
	}
	function unescapeEntities(s) {
		return s.replace(entityRe, decodeOneEntity);
	}
	function escapeAttrib(s) {
		return ("" + s)
			.replace(ampRe, "&amp;")
			.replace(ltRe, "&lt;")
			.replace(gtRe, "&gt;")
			.replace(quotRe, "&#34;");
	}
	function normalizeRCData(rcdata) {
		return rcdata
			.replace(looseAmpRe, "&amp;$1")
			.replace(ltRe, "&lt;")
			.replace(gtRe, "&gt;");
	}
	function makeSaxParser(handler) {
		var hcopy = {
			cdata: handler.cdata || handler.cdata,
			comment: handler.comment || handler.comment,
			endDoc: handler.endDoc || handler.endDoc,
			endTag: handler.endTag || handler.endTag,
			pcdata: handler.pcdata || handler.pcdata,
			rcdata: handler.rcdata || handler.rcdata,
			startDoc: handler.startDoc || handler.startDoc,
			startTag: handler.startTag || handler.startTag
		};
		return function(htmlText, param) {
			return parse(htmlText, hcopy, param);
		};
	}
	function parse(htmlText, handler, param) {
		var parts = htmlSplit(htmlText),
			state = { noMoreGT: !1, noMoreEndComments: !1 };
		parseCPS(handler, parts, 0, state, param);
	}
	function continuationMaker(h, parts, initial, state, param) {
		return function() {
			parseCPS(h, parts, initial, state, param);
		};
	}
	function parseCPS(h, parts, initial, state, param) {
		var comment, current, eflags, end, m, next, p, pos, tag, tagName;
		try {
			for (
				h.startDoc && 0 == initial && h.startDoc(param),
					pos = initial,
					end = parts.length;
				end > pos;

			)
				switch (((current = parts[pos++]),
				(next = parts[pos]),
				current)) {
					case "&":
						ENTITY_RE.test(next)
							? (h.pcdata &&
									h.pcdata(
										"&" + next,
										param,
										continuationMarker,
										continuationMaker(
											h,
											parts,
											pos,
											state,
											param
										)
									),
								++pos)
							: h.pcdata &&
								h.pcdata(
									"&amp;",
									param,
									continuationMarker,
									continuationMaker(h, parts, pos, state, param)
								);
						break;
					case "</":
						(m = /^(\w+)[^\'\"]*/.exec(next))
							? m[0].length === next.length &&
								">" === parts[pos + 1]
								? ((pos += 2),
									(tagName = m[1].toLowerCase()),
									h.endTag &&
										h.endTag(
											tagName,
											param,
											continuationMarker,
											continuationMaker(
												h,
												parts,
												pos,
												state,
												param
											)
										))
								: (pos = parseEndTag(
										parts,
										pos,
										h,
										param,
										continuationMarker,
										state
									))
							: h.pcdata &&
								h.pcdata(
									"&lt;/",
									param,
									continuationMarker,
									continuationMaker(h, parts, pos, state, param)
								);
						break;
					case "<":
						(m = /^(\w+)\s*\/?/.exec(next))
							? m[0].length === next.length &&
								">" === parts[pos + 1]
								? ((pos += 2),
									(tagName = m[1].toLowerCase()),
									h.startTag &&
										h.startTag(
											tagName,
											[],
											param,
											continuationMarker,
											continuationMaker(
												h,
												parts,
												pos,
												state,
												param
											)
										),
									(eflags = html4.ELEMENTS[tagName]),
									eflags & EFLAGS_TEXT &&
										((tag = {
											name: tagName,
											next: pos,
											eflags: eflags
										}),
										(pos = parseText(
											parts,
											tag,
											h,
											param,
											continuationMarker,
											state
										))))
								: (pos = parseStartTag(
										parts,
										pos,
										h,
										param,
										continuationMarker,
										state
									))
							: h.pcdata &&
								h.pcdata(
									"&lt;",
									param,
									continuationMarker,
									continuationMaker(h, parts, pos, state, param)
								);
						break;
					case "<!--":
						if (!state.noMoreEndComments) {
							for (
								p = pos + 1;
								end > p &&
								(">" !== parts[p] || !/--$/.test(parts[p - 1]));
								++p
							);
							end > p
								? (h.comment &&
										((comment = parts.slice(pos, p).join("")),
										h.comment(
											comment.substr(0, comment.length - 2),
											param,
											continuationMarker,
											continuationMaker(
												h,
												parts,
												p + 1,
												state,
												param
											)
										)),
									(pos = p + 1))
								: (state.noMoreEndComments = !0);
						}
						state.noMoreEndComments &&
							h.pcdata &&
							h.pcdata(
								"&lt;!--",
								param,
								continuationMarker,
								continuationMaker(h, parts, pos, state, param)
							);
						break;
					case "<!":
						if (/^\w/.test(next)) {
							if (!state.noMoreGT) {
								for (
									p = pos + 1;
									end > p && ">" !== parts[p];
									++p
								);
								end > p ? (pos = p + 1) : (state.noMoreGT = !0);
							}
							state.noMoreGT &&
								h.pcdata &&
								h.pcdata(
									"&lt;!",
									param,
									continuationMarker,
									continuationMaker(
										h,
										parts,
										pos,
										state,
										param
									)
								);
						} else
							h.pcdata &&
								h.pcdata(
									"&lt;!",
									param,
									continuationMarker,
									continuationMaker(
										h,
										parts,
										pos,
										state,
										param
									)
								);
						break;
					case "<?":
						if (!state.noMoreGT) {
							for (p = pos + 1; end > p && ">" !== parts[p]; ++p);
							end > p ? (pos = p + 1) : (state.noMoreGT = !0);
						}
						state.noMoreGT &&
							h.pcdata &&
							h.pcdata(
								"&lt;?",
								param,
								continuationMarker,
								continuationMaker(h, parts, pos, state, param)
							);
						break;
					case ">":
						h.pcdata &&
							h.pcdata(
								"&gt;",
								param,
								continuationMarker,
								continuationMaker(h, parts, pos, state, param)
							);
						break;
					case "":
						break;
					default:
						h.pcdata &&
							h.pcdata(
								current,
								param,
								continuationMarker,
								continuationMaker(h, parts, pos, state, param)
							);
				}
			h.endDoc && h.endDoc(param);
		} catch (e) {
			if (e !== continuationMarker) throw e;
		}
	}
	function htmlSplit(str) {
		var lastPos,
			m,
			parts,
			re = /(\x3c\/|\x3c\!--|\x3c[!?]|[\x26\x3c\x3e])/g;
		if (((str += ""), splitWillCapture)) return str.split(re);
		for (parts = [], lastPos = 0; null !== (m = re.exec(str)); )
			parts.push(str.substring(lastPos, m.index)),
				parts.push(m[0]),
				(lastPos = m.index + m[0].length);
		return parts.push(str.substring(lastPos)), parts;
	}
	function parseEndTag(parts, pos, h, param, continuationMarker, state) {
		var tag = parseTagAndAttrs(parts, pos);
		return tag
			? (h.endTag &&
					h.endTag(
						tag.name,
						param,
						continuationMarker,
						continuationMaker(h, parts, pos, state, param)
					),
				tag.next)
			: parts.length;
	}
	function parseStartTag(parts, pos, h, param, continuationMarker, state) {
		var tag = parseTagAndAttrs(parts, pos);
		return tag
			? (h.startTag &&
					h.startTag(
						tag.name,
						tag.attrs,
						param,
						continuationMarker,
						continuationMaker(h, parts, tag.next, state, param)
					),
				tag.eflags & EFLAGS_TEXT
					? parseText(parts, tag, h, param, continuationMarker, state)
					: tag.next)
			: parts.length;
	}
	function parseText(parts, tag, h, param, continuationMarker, state) {
		var buf,
			first,
			p,
			re,
			end = parts.length;
		for (
			endTagRe.hasOwnProperty(tag.name) ||
				(endTagRe[tag.name] = new RegExp(
					"^" + tag.name + "(?:[\\s\\/]|$)",
					"i"
				)),
				re = endTagRe[tag.name],
				first = tag.next,
				p = tag.next + 1;
			end > p && ("</" !== parts[p - 1] || !re.test(parts[p]));
			++p
		);
		if (
			(end > p && (p -= 1),
			(buf = parts.slice(first, p).join("")),
			tag.eflags & html4.eflags.CDATA)
		)
			h.cdata &&
				h.cdata(
					buf,
					param,
					continuationMarker,
					continuationMaker(h, parts, p, state, param)
				);
		else {
			if (!(tag.eflags & html4.eflags.RCDATA)) throw new Error("bug");
			h.rcdata &&
				h.rcdata(
					normalizeRCData(buf),
					param,
					continuationMarker,
					continuationMaker(h, parts, p, state, param)
				);
		}
		return p;
	}
	function parseTagAndAttrs(parts, pos) {
		var aName,
			aValue,
			abuf,
			attrs,
			buf,
			end,
			p,
			quote,
			sawQuote,
			m = /^(\w+)/.exec(parts[pos]),
			tag = {};
		for (
			tag.name = m[1].toLowerCase(),
				tag.eflags = html4.ELEMENTS[tag.name],
				buf = parts[pos].substr(m[0].length),
				p = pos + 1,
				end = parts.length;
			end > p && ">" !== parts[p];
			++p
		)
			buf += parts[p];
		if (!(p >= end)) {
			for (attrs = []; "" !== buf; )
				if ((m = ATTR_RE.exec(buf))) {
					if ((m[4] && !m[5]) || (m[6] && !m[7])) {
						for (
							quote = m[4] || m[6],
								sawQuote = !1,
								abuf = [buf, parts[p++]];
							end > p;
							++p
						) {
							if (sawQuote) {
								if (">" === parts[p]) break;
							} else
								0 <= parts[p].indexOf(quote) && (sawQuote = !0);
							abuf.push(parts[p]);
						}
						if (p >= end) break;
						buf = abuf.join("");
						continue;
					}
					(aName = m[1].toLowerCase()),
						(aValue = m[2] ? decodeValue(m[3]) : aName),
						attrs.push(aName, aValue),
						(buf = buf.substr(m[0].length));
				} else buf = buf.replace(/^[\s\S][^a-z\s]*/, "");
			return (tag.attrs = attrs), (tag.next = p + 1), tag;
		}
	}
	function decodeValue(v) {
		var q = v.charCodeAt(0);
		return (
			(34 === q || 39 === q) && (v = v.substr(1, v.length - 2)),
			unescapeEntities(stripNULs(v))
		);
	}
	function makeHtmlSanitizer(tagPolicy) {
		var ignoring,
			stack,
			emit = function(text, out) {
				ignoring || out.push(text);
			};
		return makeSaxParser({
			startDoc: function() {
				(stack = []), (ignoring = !1);
			},
			startTag: function(tagName, attribs, out) {
				var attribName, eflags, i, n, value;
				if (
					!ignoring &&
					html4.ELEMENTS.hasOwnProperty(tagName) &&
					((eflags = html4.ELEMENTS[tagName]),
					!(eflags & html4.eflags.FOLDABLE))
				) {
					if (((attribs = tagPolicy(tagName, attribs)), !attribs))
						return void (ignoring = !(eflags & html4.eflags.EMPTY));
					for (
						eflags & html4.eflags.EMPTY || stack.push(tagName),
							out.push("<", tagName),
							i = 0,
							n = attribs.length;
						n > i;
						i += 2
					)
						(attribName = attribs[i]),
							(value = attribs[i + 1]),
							null !== value &&
								void 0 !== value &&
								out.push(
									" ",
									attribName,
									'="',
									escapeAttrib(value),
									'"'
								);
					out.push(">");
				}
			},
			endTag: function(tagName, out) {
				var eflags, i, index, stackEl;
				if (ignoring) return void (ignoring = !1);
				if (
					html4.ELEMENTS.hasOwnProperty(tagName) &&
					((eflags = html4.ELEMENTS[tagName]),
					!(eflags & (html4.eflags.EMPTY | html4.eflags.FOLDABLE)))
				) {
					if (eflags & html4.eflags.OPTIONAL_ENDTAG) {
						for (
							index = stack.length;
							--index >= 0 &&
							((stackEl = stack[index]), stackEl !== tagName);

						)
							if (
								!(
									html4.ELEMENTS[stackEl] &
									html4.eflags.OPTIONAL_ENDTAG
								)
							)
								return;
					} else
						for (
							index = stack.length;
							--index >= 0 && stack[index] !== tagName;

						);
					if (0 > index) return;
					for (i = stack.length; --i > index; )
						(stackEl = stack[i]),
							html4.ELEMENTS[stackEl] &
								html4.eflags.OPTIONAL_ENDTAG ||
								out.push("</", stackEl, ">");
					(stack.length = index), out.push("</", tagName, ">");
				}
			},
			pcdata: emit,
			rcdata: emit,
			cdata: emit,
			endDoc: function(out) {
				for (; stack.length; --stack.length)
					out.push("</", stack[stack.length - 1], ">");
			}
		});
	}
	function safeUri(uri, naiveUriRewriter) {
		var parsed;
		return naiveUriRewriter
			? ((parsed = ("" + uri).match(URI_SCHEME_RE)),
				!parsed || (parsed[1] && !ALLOWED_URI_SCHEMES.test(parsed[1]))
					? null
					: naiveUriRewriter(uri))
			: null;
	}
	function log(opt_logger, tagName, attribName, oldValue, newValue) {
		var changed;
		attribName ||
			opt_logger(tagName + " removed", {
				change: "removed",
				tagName: tagName
			}),
			oldValue !== newValue &&
				((changed = "changed"),
				oldValue && !newValue
					? (changed = "removed")
					: !oldValue && newValue && (changed = "added"),
				opt_logger(tagName + "." + attribName + " " + changed, {
					change: changed,
					tagName: tagName,
					attribName: attribName,
					oldValue: oldValue,
					newValue: newValue
				}));
	}
	function sanitizeAttribs(
		tagName,
		attribs,
		opt_naiveUriRewriter,
		opt_nmTokenPolicy,
		opt_logger
	) {
		var attribKey,
			attribName,
			atype,
			i,
			oldValue,
			sanitizedDeclarations,
			value;
		for (i = 0; i < attribs.length; i += 2) {
			if (
				((attribName = attribs[i]),
				(value = attribs[i + 1]),
				(oldValue = value),
				(atype = null),
				(attribKey = tagName + "::" + attribName),
				(html4.ATTRIBS.hasOwnProperty(attribKey) ||
					((attribKey = "*::" + attribName),
					html4.ATTRIBS.hasOwnProperty(attribKey))) &&
					(atype = html4.ATTRIBS[attribKey]),
				null !== atype)
			)
				switch (atype) {
					case html4.atype.NONE:
						break;
					case html4.atype.SCRIPT:
						(value = null),
							opt_logger &&
								log(
									opt_logger,
									tagName,
									attribName,
									oldValue,
									value
								);
						break;
					case html4.atype.STYLE:
						if ("undefined" == typeof parseCssDeclarations) {
							(value = null),
								opt_logger &&
									log(
										opt_logger,
										tagName,
										attribName,
										oldValue,
										value
									);
							break;
						}
						(sanitizedDeclarations = []),
							parseCssDeclarations(value, {
								declaration: function(property, tokens) {
									var normProp = property.toLowerCase(),
										schema = cssSchema[normProp];
									schema &&
										(sanitizeCssProperty(
											normProp,
											schema,
											tokens,
											opt_naiveUriRewriter
										),
										sanitizedDeclarations.push(
											property + ": " + tokens.join(" ")
										));
								}
							}),
							(value =
								sanitizedDeclarations.length > 0
									? sanitizedDeclarations.join(" ; ")
									: null),
							opt_logger &&
								log(
									opt_logger,
									tagName,
									attribName,
									oldValue,
									value
								);
						break;
					case html4.atype.ID:
					case html4.atype.IDREF:
					case html4.atype.IDREFS:
					case html4.atype.GLOBAL_NAME:
					case html4.atype.LOCAL_NAME:
					case html4.atype.CLASSES:
						(value = opt_nmTokenPolicy
							? opt_nmTokenPolicy(value)
							: value),
							opt_logger &&
								log(
									opt_logger,
									tagName,
									attribName,
									oldValue,
									value
								);
						break;
					case html4.atype.URI:
						(value = safeUri(value, opt_naiveUriRewriter)),
							opt_logger &&
								log(
									opt_logger,
									tagName,
									attribName,
									oldValue,
									value
								);
						break;
					case html4.atype.URI_FRAGMENT:
						value && "#" === value.charAt(0)
							? ((value = value.substring(1)),
								(value = opt_nmTokenPolicy
									? opt_nmTokenPolicy(value)
									: value),
								null !== value &&
									void 0 !== value &&
									(value = "#" + value))
							: (value = null),
							opt_logger &&
								log(
									opt_logger,
									tagName,
									attribName,
									oldValue,
									value
								);
						break;
					default:
						(value = null),
							opt_logger &&
								log(
									opt_logger,
									tagName,
									attribName,
									oldValue,
									value
								);
				}
			else
				(value = null),
					opt_logger &&
						log(opt_logger, tagName, attribName, oldValue, value);
			attribs[i + 1] = value;
		}
		return attribs;
	}
	function makeTagPolicy(
		opt_naiveUriRewriter,
		opt_nmTokenPolicy,
		opt_logger
	) {
		return function(tagName, attribs) {
			return html4.ELEMENTS[tagName] & html4.eflags.UNSAFE
				? void (
						opt_logger &&
						log(opt_logger, tagName, void 0, void 0, void 0)
					)
				: sanitizeAttribs(
						tagName,
						attribs,
						opt_naiveUriRewriter,
						opt_nmTokenPolicy,
						opt_logger
					);
		};
	}
	function sanitizeWithPolicy(inputHtml, tagPolicy) {
		var outputArray = [];
		return (
			makeHtmlSanitizer(tagPolicy)(inputHtml, outputArray),
			outputArray.join("")
		);
	}
	function sanitize(
		inputHtml,
		opt_naiveUriRewriter,
		opt_nmTokenPolicy,
		opt_logger
	) {
		var tagPolicy = makeTagPolicy(
			opt_naiveUriRewriter,
			opt_nmTokenPolicy,
			opt_logger
		);
		return sanitizeWithPolicy(inputHtml, tagPolicy);
	}
	var ALLOWED_URI_SCHEMES,
		ATTR_RE,
		EFLAGS_TEXT,
		ENTITIES,
		ENTITY_RE,
		URI_SCHEME_RE,
		ampRe,
		continuationMarker,
		cssSchema,
		decimalEscapeRe,
		endTagRe,
		entityRe,
		gtRe,
		hexEscapeRe,
		html,
		looseAmpRe,
		ltRe,
		nulRe,
		parseCssDeclarations,
		quotRe,
		sanitizeCssProperty,
		splitWillCapture;
	return (
		"undefined" != typeof window &&
			((parseCssDeclarations = window.parseCssDeclarations),
			(sanitizeCssProperty = window.sanitizeCssProperty),
			(cssSchema = window.cssSchema)),
		(ENTITIES = {
			lt: "<",
			gt: ">",
			amp: "&",
			nbsp: " ",
			quot: '"',
			apos: "'"
		}),
		(decimalEscapeRe = /^#(\d+)$/),
		(hexEscapeRe = /^#x([0-9A-Fa-f]+)$/),
		(nulRe = /\0/g),
		(entityRe = /\x26(#\d+|#x[0-9A-Fa-f]+|\w+);/g),
		(ampRe = /\x26/g),
		(looseAmpRe = /\x26([^a-z#]|#(?:[^0-9x]|x(?:[^0-9a-f]|$)|$)|$)/gi),
		(ltRe = /[\x3c]/g),
		(gtRe = /\x3e/g),
		(quotRe = /\"/g),
		(ATTR_RE = new RegExp(
			"^\\s*([a-z][-\\w]*)(?:\\s*(=)\\s*((\")[^\"]*(\"|$)|(')[^']*('|$)|(?=[a-z][-\\w]*\\s*=)|[^\"'\\s]*))?",
			"i"
		)),
		(ENTITY_RE = /^(#[0-9]+|#x[0-9a-f]+|\w+);/i),
		(splitWillCapture = 3 === "a,b".split(/(,)/).length),
		(EFLAGS_TEXT = html4.eflags.CDATA | html4.eflags.RCDATA),
		(continuationMarker = {}),
		(endTagRe = {}),
		(URI_SCHEME_RE = new RegExp("^(?:([^:/?# ]+):)?")),
		(ALLOWED_URI_SCHEMES = /^(?:https?|mailto)$/i),
		(html = {}),
		(html.escapeAttrib = html.escapeAttrib = escapeAttrib),
		(html.makeHtmlSanitizer = html.makeHtmlSanitizer = makeHtmlSanitizer),
		(html.makeSaxParser = html.makeSaxParser = makeSaxParser),
		(html.makeTagPolicy = html.makeTagPolicy = makeTagPolicy),
		(html.normalizeRCData = html.normalizeRCData = normalizeRCData),
		(html.sanitize = html.sanitize = sanitize),
		(html.sanitizeAttribs = html.sanitizeAttribs = sanitizeAttribs),
		(html.sanitizeWithPolicy = html.sanitizeWithPolicy = sanitizeWithPolicy),
		(html.unescapeEntities = html.unescapeEntities = unescapeEntities),
		html
	);
})(html4)),
	(html_sanitize = html.sanitize),
	"undefined" != typeof window &&
		((window.html = html), (window.html_sanitize = html_sanitize));
