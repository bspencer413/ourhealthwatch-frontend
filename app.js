“use strict”;

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError(“Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.”); }
function _unsupportedIterableToArray(r, a) { if (r) { if (“string” == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return “Object” === t && r.constructor && (t = r.constructor.name), “Map” === t || “Set” === t ? Array.from(r) : “Arguments” === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : “undefined” != typeof Symbol && r[Symbol.iterator] || r[”@@iterator”]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
window.__ohwStep = ‘A: babel script entered’;
const _React = React,
useState = _React.useState,
useEffect = _React.useEffect;
window.__ohwStep = ‘B: React destructured’;

// – DEBUG: surface any runtime error directly into the page so we can read
// it on the iPad without DevTools. Remove for v0.1.8 stable.
window.addEventListener(‘error’, function (e) {
try {
const root = document.getElementById(‘root’);
if (!root) return;
const msg = e.error && e.error.stack || e.message || ‘Unknown error’;
root.innerHTML = ‘<div style="padding:20px;color:#fff;font-family:monospace;font-size:14px;line-height:1.4;background:#7f1d1d;min-height:100vh;white-space:pre-wrap;word-break:break-word;">’ + ‘<strong>JS error caught:</strong>\n\n’ + String(msg).replace(/&/g, ‘&’).replace(/</g, ‘<’).replace(/>/g, ‘>’) + ’\n\nFile: ’ + (e.filename || ‘?’) + ‘\nLine: ’ + (e.lineno || ‘?’) + ’ Col: ’ + (e.colno || ‘?’) + ‘</div>’;
} catch (ignored) {}
});
window.addEventListener(‘unhandledrejection’, function (e) {
try {
const root = document.getElementById(‘root’);
if (!root || root.children.length > 1) return; // don’t overwrite an already-mounted app
root.innerHTML = ‘<div style="padding:20px;color:#fff;font-family:monospace;font-size:14px;background:#7f1d1d;min-height:100vh;white-space:pre-wrap;">’ + ‘<strong>Unhandled promise rejection:</strong>\n\n’ + String(e.reason && e.reason.stack || e.reason || ‘Unknown’).replace(/</g, ‘<’) + ‘</div>’;
} catch (ignored) {}
});

// – CONFIG ––––––––––––––––––––––––––––––––––
const API_BASE = ‘https://ourhealthwatch-backend.onrender.com’;
const APP_VERSION = ‘0.1.7’;
const TOKEN_KEY = ‘oh_token’;
const USER_KEY = ‘oh_user’;

// v0.1.7: same 12-region taxonomy as Cruise Ship Watch / EarthWatch.
const OH_REGIONS = [‘Africa’, ‘Alaska’, ‘Arctic’, ‘Asia’, ‘Caribbean’, ‘Central America’, ‘Mediterranean’, ‘Middle East’, ‘North America’, ‘Northern Europe’, ‘Oceania’, ‘South America’];

// – HELPERS —————————————————————––
function getToken() {
try {
return localStorage.getItem(TOKEN_KEY);
} catch (e) {
return null;
}
}
function getStoredUser() {
try {
const raw = localStorage.getItem(USER_KEY);
return raw ? JSON.parse(raw) : null;
} catch (e) {
return null;
}
}
function authHeaders() {
const t = getToken();
return t ? {
‘Authorization’: ‘Bearer ’ + t
} : {};
}
function jsonHeaders() {
return Object.assign({
‘Content-Type’: ‘application/json’
}, authHeaders());
}
function fmtDate(s) {
if (!s) return ‘’;
// openFDA returns YYYYMMDD strings; NORS returns YYYY-MM
if (/^\d{8}$/.test(s)) {
return s.substring(0, 4) + ‘-’ + s.substring(4, 6) + ‘-’ + s.substring(6, 8);
}
return s;
}
function fmtRelative(iso) {
if (!iso) return ‘’;
try {
const then = new Date(iso);
const diffMin = Math.round((Date.now() - then.getTime()) / 60000);
if (diffMin < 1) return ‘just now’;
if (diffMin < 60) return diffMin + ’ min ago’;
const hrs = Math.round(diffMin / 60);
if (hrs < 24) return hrs + ’ hr ago’;
const days = Math.round(hrs / 24);
return days + ’ day’ + (days === 1 ? ‘’ : ‘s’) + ’ ago’;
} catch (e) {
return ‘’;
}
}
function classBadge(cls) {
if (cls === ‘I’ || cls === ‘II’ || cls === ‘III’) return ‘class-’ + cls;
return ‘class-III’;
}
function sourceLabel(src) {
if (src === ‘fda_drug’) return ‘Drug’;
if (src === ‘fda_device’) return ‘Device’;
if (src === ‘cdc_nors’) return ‘NORS’;
if (src === ‘who_don’) return ‘WHO’;
if (src === ‘cdc_vsp’) return ‘VSP’;
return src || ‘’;
}
function sourceBadgeClass(src) {
if (src === ‘fda_drug’) return ‘source-drug’;
if (src === ‘fda_device’) return ‘source-device’;
if (src === ‘cdc_nors’ || src === ‘who_don’ || src === ‘cdc_vsp’) return ‘source-outbreak’;
return ‘class-III’;
}

// – PRIMITIVES: HEADERS / CARDS ———————————————–
function CardPageHeader(props) {
return /*#**PURE***/React.createElement(“div”, {
className: “mb-4 text-center”
}, /*#**PURE***/React.createElement(“h2”, {
className: “text-white text-3xl font-bold tracking-tight”
}, props.title), props.subtitle ? /*#**PURE***/React.createElement(“p”, {
className: “text-white/80 text-base mt-1”
}, props.subtitle) : null);
}
function BackgroundHeader(props) {
return /*#**PURE***/React.createElement(“div”, {
className: “text-center pb-3”,
style: {
paddingTop: ‘0’
}
}, /*#**PURE***/React.createElement(“h1”, {
className: “text-white text-3xl font-bold tracking-tight”
}, props.title), props.subtitle ? /*#**PURE***/React.createElement(“p”, {
className: “text-white/80 text-base mt-1”
}, props.subtitle) : null);
}
function PageCard(props) {
return /*#**PURE***/React.createElement(“div”, {
className: “ohw-page-bg pb-32”,
style: {
paddingTop: ‘12vh’
}
}, /*#**PURE***/React.createElement(“div”, {
className: “card-mw rounded-2xl p-5 max-w-2xl mx-auto”,
style: {
marginTop: ‘2vh’
}
}, props.children));
}

// – LOGIN SCREEN –––––––––––––––––––––––––––––––
function LoginScreen(props) {
const _useState = useState(‘login’),
_useState2 = _slicedToArray(_useState, 2),
mode = _useState2[0],
setMode = _useState2[1];
const _useState3 = useState(’’),
_useState4 = _slicedToArray(_useState3, 2),
email = _useState4[0],
setEmail = _useState4[1];
const _useState5 = useState(’’),
_useState6 = _slicedToArray(_useState5, 2),
password = _useState6[0],
setPassword = _useState6[1];
const _useState7 = useState(false),
_useState8 = _slicedToArray(_useState7, 2),
busy = _useState8[0],
setBusy = _useState8[1];
const _useState9 = useState(’’),
_useState0 = _slicedToArray(_useState9, 2),
err = _useState0[0],
setErr = _useState0[1];
function submit() {
setErr(’’);
if (!email || !password) {
setErr(‘Email and password required’);
return;
}
if (mode === ‘register’ && password.length < 8) {
setErr(‘Password must be at least 8 characters’);
return;
}
setBusy(true);
if (document.activeElement) document.activeElement.blur();
const path = mode === ‘register’ ? ‘/auth/register’ : ‘/auth/login’;
fetch(API_BASE + path, {
method: ‘POST’,
headers: {
‘Content-Type’: ‘application/json’
},
body: JSON.stringify({
email: email,
password: password
})
}).then(function (r) {
return r.json().then(function (d) {
return {
ok: r.ok,
d: d
};
});
}).then(function (res) {
setBusy(false);
if (!res.ok) {
setErr(res.d.detail || ‘Auth failed’);
return;
}
try {
localStorage.setItem(TOKEN_KEY, res.d.token);
localStorage.setItem(USER_KEY, JSON.stringify({
user_id: res.d.user_id,
email: res.d.email
}));
} catch (e) {}
props.onAuth({
user_id: res.d.user_id,
email: res.d.email
});
}).catch(function () {
setBusy(false);
setErr(‘Network error’);
});
}
return /*#**PURE***/React.createElement(“div”, {
className: “ohw-bg-login min-h-screen flex flex-col items-center px-4”,
style: {
paddingTop: ‘4vh’,
paddingBottom: ‘8vh’
}
}, /*#**PURE***/React.createElement(“div”, {
className: “w-full max-w-sm flex-1 flex flex-col”
}, /*#**PURE***/React.createElement(“div”, {
className: “flex-1 flex items-center justify-center”
}, /*#**PURE***/React.createElement(“h1”, {
className: “text-white font-black text-center”,
style: {
fontSize: ‘5rem’,
letterSpacing: ‘0.04em’,
lineHeight: 0.95,
textTransform: ‘uppercase’,
textShadow: ‘0 4px 16px rgba(0,0,0,0.9)’,
WebkitTextStroke: ‘1px #fff’,
margin: 0
}
}, “Our”, /*#**PURE***/React.createElement(“br”, null), “Health”, /*#**PURE***/React.createElement(“br”, null), “Watch”)), /*#**PURE***/React.createElement(“div”, {
className: “card-mw rounded-2xl p-5 space-y-3”
}, /*#**PURE***/React.createElement(“input”, {
type: “email”,
placeholder: “Email address”,
value: email,
onChange: function (e) {
setEmail(e.target.value);
},
onFocus: function (e) {
setTimeout(function () {
if (e.target && e.target.scrollIntoView) e.target.scrollIntoView({
block: ‘center’,
behavior: ‘smooth’
});
}, 300);
},
autoComplete: “email”,
className: “w-full px-4 py-3 text-xl rounded-xl bg-white/15 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400”
}), /*#**PURE***/React.createElement(“input”, {
type: “password”,
placeholder: “Password”,
value: password,
onChange: function (e) {
setPassword(e.target.value);
},
onFocus: function (e) {
setTimeout(function () {
if (e.target && e.target.scrollIntoView) e.target.scrollIntoView({
block: ‘center’,
behavior: ‘smooth’
});
}, 300);
},
onKeyDown: function (e) {
if (e.key === ‘Enter’) {
setMode(‘login’);
submit();
}
},
autoComplete: mode === ‘register’ ? ‘new-password’ : ‘current-password’,
className: “w-full px-4 py-3 text-xl rounded-xl bg-white/15 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400”
}), err ? /*#**PURE***/React.createElement(“p”, {
className: “text-red-300 text-xl text-center”
}, err) : null, /*#**PURE***/React.createElement(“div”, {
className: “grid grid-cols-2 gap-3”
}, /*#**PURE***/React.createElement(“button”, {
onClick: function () {
setMode(‘login’);
setErr(’’);
submit();
},
disabled: busy,
className: “py-4 rounded-xl bg-white text-gray-900 text-2xl font-bold disabled:opacity-50”
}, busy && mode === ‘login’ ? ‘…’ : ‘Sign In’), /*#**PURE***/React.createElement(“button”, {
onClick: function () {
setMode(‘register’);
setErr(’’);
submit();
},
disabled: busy,
className: “py-4 rounded-xl bg-white/15 text-white text-2xl font-bold border border-white/40 disabled:opacity-50”
}, busy && mode === ‘register’ ? ‘…’ : ‘Register’)), /*#**PURE***/React.createElement(“p”, {
className: “text-white/60 text-base text-center pt-1”
}, “You’ll stay signed in automatically”))));
}

// – RECALL CARD (drug + device) ———————————————–
function RecallCard(props) {
const r = props.recall;
const cls = (r.classification || ‘’).trim();
return /*#**PURE***/React.createElement(“div”, {
className: “card-recall rounded-lg p-4 mb-3”
}, /*#**PURE***/React.createElement(“div”, {
className: “flex items-start justify-between gap-2 mb-2”
}, /*#**PURE***/React.createElement(“div”, {
className: “flex-1”
}, /*#**PURE***/React.createElement(“div”, {
className: “flex items-center gap-2 flex-wrap”
}, /*#**PURE***/React.createElement(“span”, {
className: “text-white text-xs px-2 py-1 rounded font-bold “ + sourceBadgeClass(r.source)
}, sourceLabel(r.source)), cls ? /*#**PURE***/React.createElement(“span”, {
className: “text-white text-xs px-2 py-1 rounded font-bold “ + classBadge(cls)
}, “Class “, cls) : null, r.status ? /*#**PURE***/React.createElement(“span”, {
className: “text-white/80 text-xs px-2 py-1 rounded border border-white/30”
}, r.status) : null), /*#**PURE***/React.createElement(“h3”, {
className: “font-bold text-white text-lg mt-2”
}, r.brand || ‘Unknown firm’), r.product_description ? /*#**PURE***/React.createElement(“p”, {
className: “text-white/90 text-sm mt-1”
}, r.product_description) : null)), r.reason ? /*#**PURE***/React.createElement(“p”, {
className: “text-white/80 text-sm mt-2”
}, /*#**PURE***/React.createElement(“span”, {
className: “text-white/60”
}, “Reason: “), r.reason) : null, r.distribution ? /*#**PURE***/React.createElement(“p”, {
className: “text-white/60 text-xs mt-1”
}, “Distribution: “, r.distribution) : null, r.recall_date ? /*#**PURE***/React.createElement(“p”, {
className: “text-white/60 text-xs mt-2”
}, “Recalled: “, fmtDate(r.recall_date)) : null, props.children);
}

// – OUTBREAK CARD (NORS, WHO DON, VSP) ––––––––––––––––––––
function OutbreakCard(props) {
const o = props.outbreak;
return /*#**PURE***/React.createElement(“div”, {
className: “card-recall rounded-lg p-4 mb-3”
}, /*#**PURE***/React.createElement(“div”, {
className: “flex items-start justify-between gap-2 mb-2”
}, /*#**PURE***/React.createElement(“div”, {
className: “flex-1”
}, /*#**PURE***/React.createElement(“div”, {
className: “flex items-center gap-2 flex-wrap”
}, /*#**PURE***/React.createElement(“span”, {
className: “text-white text-xs px-2 py-1 rounded font-bold “ + sourceBadgeClass(o.source)
}, sourceLabel(o.source)), o.agent ? /*#**PURE***/React.createElement(“span”, {
className: “text-white text-xs px-2 py-1 rounded font-bold bg-emerald-700”
}, o.agent) : null), /*#**PURE***/React.createElement(“h3”, {
className: “font-bold text-white text-lg mt-2”
}, o.title || ‘Outbreak’), o.summary ? /*#**PURE***/React.createElement(“p”, {
className: “text-white/90 text-sm mt-1”
}, o.summary) : null)), o.region ? /*#**PURE***/React.createElement(“p”, {
className: “text-white/80 text-sm mt-2”
}, /*#**PURE***/React.createElement(“span”, {
className: “text-white/60”
}, “Region: “), o.region) : null, o.report_date ? /*#**PURE***/React.createElement(“p”, {
className: “text-white/60 text-xs mt-2”
}, “Reported: “, o.report_date) : null, props.children);
}

// – LATEST RECALLS VIEW (firehose, source + date filter) –––––––––––
function LatestRecallsView(props) {
const _useState1 = useState(null),
_useState10 = _slicedToArray(_useState1, 2),
items = _useState10[0],
setItems = _useState10[1];
const _useState11 = useState(true),
_useState12 = _slicedToArray(_useState11, 2),
busy = _useState12[0],
setBusy = _useState12[1];
const _useState13 = useState(props.initialSource || ‘’),
_useState14 = _slicedToArray(_useState13, 2),
source = _useState14[0],
setSource = _useState14[1];
const _useState15 = useState({}),
_useState16 = _slicedToArray(_useState15, 2),
ingest = _useState16[0],
setIngest = _useState16[1];
function load() {
setBusy(true);
let url = API_BASE + ‘/recalls/recent?limit=30’;
if (source) url = url + ‘&source=’ + source;
fetch(url).then(function (r) {
return r.json();
}).then(function (d) {
setItems(d.results || []);
setIngest(d.ingest_status || {});
setBusy(false);
}).catch(function () {
setBusy(false);
setItems([]);
});
}
useEffect(load, [source]);

```
// Build "last checked" string from ingest_status
const checkedKey = source || 'fda_drug';
const checkedAt = ingest[checkedKey] && ingest[checkedKey].last_checked_at || null;
const checkedRel = checkedAt ? fmtRelative(checkedAt) : '';
return /*#__PURE__*/React.createElement(PageCard, null, /*#__PURE__*/React.createElement(CardPageHeader, {
  title: "Latest Recalls",
  subtitle: "FDA Class I\u2013III, Ongoing, last 30 days"
}), /*#__PURE__*/React.createElement("div", {
  className: "mb-4 flex flex-wrap gap-2 justify-center"
}, /*#__PURE__*/React.createElement("button", {
  onClick: function () {
    setSource('');
  },
  className: "text-sm px-3 py-1 rounded " + (source === '' ? "bg-blue-700 text-white" : "bg-gray-700 text-white/80 border border-gray-500")
}, "All"), /*#__PURE__*/React.createElement("button", {
  onClick: function () {
    setSource('fda_drug');
  },
  className: "text-sm px-3 py-1 rounded " + (source === 'fda_drug' ? "bg-blue-700 text-white" : "bg-gray-700 text-white/80 border border-gray-500")
}, "Drugs"), /*#__PURE__*/React.createElement("button", {
  onClick: function () {
    setSource('fda_device');
  },
  className: "text-sm px-3 py-1 rounded " + (source === 'fda_device' ? "bg-blue-700 text-white" : "bg-gray-700 text-white/80 border border-gray-500")
}, "Devices")), /*#__PURE__*/React.createElement("div", {
  className: "mb-4 text-center"
}, /*#__PURE__*/React.createElement("button", {
  onClick: props.onBack,
  className: "text-base px-4 py-2 rounded bg-gray-700 text-white border border-gray-500 hover:bg-gray-600"
}, "\u2190 Back")), busy ? /*#__PURE__*/React.createElement("p", {
  className: "text-white text-base text-center"
}, "Loading\u2026") : items === null || items.length === 0 ? /*#__PURE__*/React.createElement("div", {
  className: "text-center py-4"
}, /*#__PURE__*/React.createElement("p", {
  className: "text-white text-base"
}, "No active recalls in the last 30 days."), checkedRel ? /*#__PURE__*/React.createElement("p", {
  className: "text-white/60 text-sm mt-2 italic"
}, "Last checked ", checkedRel, ". We're watching.") : null) : /*#__PURE__*/React.createElement("div", null, checkedRel ? /*#__PURE__*/React.createElement("p", {
  className: "text-white/60 text-sm text-center mb-3 italic"
}, "Last checked ", checkedRel, " \xB7 ", items.length, " active recall", items.length === 1 ? '' : 's') : null, items.map(function (r) {
  return /*#__PURE__*/React.createElement(RecallCard, {
    key: r.id,
    recall: r
  });
})), /*#__PURE__*/React.createElement("div", {
  className: "mt-4 text-center"
}, /*#__PURE__*/React.createElement("button", {
  onClick: props.onBack,
  className: "text-base px-4 py-2 rounded bg-gray-700 text-white border border-gray-500 hover:bg-gray-600"
}, "\u2190 Back")));
```

}

// – LATEST OUTBREAKS VIEW (NORS now, WHO DON / VSP later) ———————
function LatestOutbreaksView(props) {
const _useState17 = useState(null),
_useState18 = _slicedToArray(_useState17, 2),
items = _useState18[0],
setItems = _useState18[1];
const _useState19 = useState(true),
_useState20 = _slicedToArray(_useState19, 2),
busy = _useState20[0],
setBusy = _useState20[1];
const _useState21 = useState(props.initialSource || ‘’),
_useState22 = _slicedToArray(_useState21, 2),
source = _useState22[0],
setSource = _useState22[1];
const _useState23 = useState({}),
_useState24 = _slicedToArray(_useState23, 2),
ingest = _useState24[0],
setIngest = _useState24[1];
function load() {
setBusy(true);
let url = API_BASE + ‘/outbreaks/recent?limit=30’;
if (source) url = url + ‘&source=’ + source;
fetch(url).then(function (r) {
return r.json();
}).then(function (d) {
setItems(d.results || []);
setIngest(d.ingest_status || {});
setBusy(false);
}).catch(function () {
setBusy(false);
setItems([]);
});
}
useEffect(load, [source]);
const checkedKey = source || ‘cdc_nors’;
const checkedAt = ingest[checkedKey] && ingest[checkedKey].last_checked_at || null;
const checkedRel = checkedAt ? fmtRelative(checkedAt) : ‘’;
return /*#**PURE***/React.createElement(PageCard, null, /*#**PURE***/React.createElement(CardPageHeader, {
title: “Latest Outbreaks”,
subtitle: “CDC NORS foodborne & waterborne \xB7 WHO DON coming”
}), /*#**PURE***/React.createElement(“div”, {
className: “mb-4 flex flex-wrap gap-2 justify-center”
}, /*#**PURE***/React.createElement(“button”, {
onClick: function () {
setSource(’’);
},
className: “text-sm px-3 py-1 rounded “ + (source === ‘’ ? “bg-blue-700 text-white” : “bg-gray-700 text-white/80 border border-gray-500”)
}, “All”), /*#**PURE***/React.createElement(“button”, {
onClick: function () {
setSource(‘cdc_nors’);
},
className: “text-sm px-3 py-1 rounded “ + (source === ‘cdc_nors’ ? “bg-blue-700 text-white” : “bg-gray-700 text-white/80 border border-gray-500”)
}, “NORS”)), /*#**PURE***/React.createElement(“div”, {
className: “mb-4 text-center”
}, /*#**PURE***/React.createElement(“button”, {
onClick: props.onBack,
className: “text-base px-4 py-2 rounded bg-gray-700 text-white border border-gray-500 hover:bg-gray-600”
}, “\u2190 Back”)), busy ? /*#**PURE***/React.createElement(“p”, {
className: “text-white text-base text-center”
}, “Loading\u2026”) : items === null || items.length === 0 ? /*#**PURE***/React.createElement(“div”, {
className: “text-center py-4”
}, /*#**PURE***/React.createElement(“p”, {
className: “text-white text-base”
}, “No recent outbreaks on file.”), checkedRel ? /*#**PURE***/React.createElement(“p”, {
className: “text-white/60 text-sm mt-2 italic”
}, “Last checked “, checkedRel, “. We’re watching.”) : null) : /*#**PURE***/React.createElement(“div”, null, checkedRel ? /*#**PURE***/React.createElement(“p”, {
className: “text-white/60 text-sm text-center mb-3 italic”
}, “Last checked “, checkedRel, “ \xB7 “, items.length, “ outbreak”, items.length === 1 ? ‘’ : ‘s’) : null, items.map(function (o) {
return /*#**PURE***/React.createElement(OutbreakCard, {
key: o.id,
outbreak: o
});
})), /*#**PURE***/React.createElement(“div”, {
className: “mt-4 text-center”
}, /*#**PURE***/React.createElement(“button”, {
onClick: props.onBack,
className: “text-base px-4 py-2 rounded bg-gray-700 text-white border border-gray-500 hover:bg-gray-600”
}, “\u2190 Back”)));
}

// – SEARCH PAGE (v0.1.7: PLACE-BASED, mirrors EarthWatch + CW pattern) ––––
// Watchlist primitive is a PLACE – search by region, optionally narrow by
// state and city, the place lands in Watchlist, cron monitors it for
// outbreaks + recalls. Browse Recalls / Browse Outbreaks buttons live UNDER
// the search inputs as the firehose fallback.
function SearchPage(props) {
const _useState25 = useState(‘home’),
_useState26 = _slicedToArray(_useState25, 2),
view = _useState26[0],
setView = _useState26[1]; // ‘home’ | ‘recalls’ | ‘outbreaks’
const _useState27 = useState(’’),
_useState28 = _slicedToArray(_useState27, 2),
region = _useState28[0],
setRegion = _useState28[1];
const _useState29 = useState(’’),
_useState30 = _slicedToArray(_useState29, 2),
state = _useState30[0],
setStateVal = _useState30[1];
const _useState31 = useState(’’),
_useState32 = _slicedToArray(_useState31, 2),
city = _useState32[0],
setCity = _useState32[1];
const _useState33 = useState(false),
_useState34 = _slicedToArray(_useState33, 2),
busy = _useState34[0],
setBusy = _useState34[1];
const _useState35 = useState(’’),
_useState36 = _slicedToArray(_useState35, 2),
msg = _useState36[0],
setMsg = _useState36[1];
const _useState37 = useState(’’),
_useState38 = _slicedToArray(_useState37, 2),
msgKind = _useState38[0],
setMsgKind = _useState38[1]; // ‘ok’ | ‘err’

```
if (view === 'recalls') {
  return /*#__PURE__*/React.createElement(LatestRecallsView, {
    onBack: function () {
      setView('home');
    }
  });
}
if (view === 'outbreaks') {
  return /*#__PURE__*/React.createElement(LatestOutbreaksView, {
    onBack: function () {
      setView('home');
    }
  });
}
function submit() {
  setMsg('');
  setMsgKind('');
  if (!region && !state && !city) {
    setMsg('Pick a region, or enter a state or city.');
    setMsgKind('err');
    return;
  }
  if (document.activeElement) document.activeElement.blur();
  setBusy(true);
  const body = {
    region: region || null,
    state: state || null,
    city: city || null
  };
  fetch(API_BASE + '/places', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(body)
  }).then(function (r) {
    return r.json().then(function (d) {
      return {
        ok: r.ok,
        d: d
      };
    });
  }).then(function (res) {
    setBusy(false);
    if (!res.ok) {
      setMsg(res.d.detail || 'Could not add place');
      setMsgKind('err');
      return;
    }
    const name = res.d.name || [city, state, region].filter(Boolean).join(', ');
    setMsg('Added "' + name + '" to your Watchlist.');
    setMsgKind('ok');
    setRegion('');
    setStateVal('');
    setCity('');
    if (props.onPlaceAdded) props.onPlaceAdded();
  }).catch(function () {
    setBusy(false);
    setMsg('Network error');
    setMsgKind('err');
  });
}
return /*#__PURE__*/React.createElement("div", {
  className: "min-h-screen flex flex-col px-3",
  style: {
    paddingTop: '4vh',
    paddingBottom: '8rem'
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "flex flex-col items-center justify-center text-center mb-4"
}, /*#__PURE__*/React.createElement("h1", {
  className: "text-white font-black",
  style: {
    fontSize: '3.5rem',
    lineHeight: '1.05',
    letterSpacing: '-0.02em',
    textShadow: '0 2px 8px rgba(0,0,0,0.6)'
  }
}, "OurHealth", /*#__PURE__*/React.createElement("span", {
  className: "text-blue-300"
}, ".Watch")), /*#__PURE__*/React.createElement("p", {
  className: "text-white/85 text-lg mt-3 italic max-w-md"
}, "Watching what watches you."), /*#__PURE__*/React.createElement("p", {
  className: "text-white/70 text-base mt-1 max-w-md"
}, "Are there outbreaks where you're going? Watch a place. We'll alert you.")), /*#__PURE__*/React.createElement("div", {
  className: "max-w-md mx-auto w-full"
}, /*#__PURE__*/React.createElement("div", {
  className: "card-mw rounded-2xl p-5 space-y-3"
}, /*#__PURE__*/React.createElement("p", {
  className: "text-white/80 text-base text-center leading-snug"
}, "Pick a region, state, or city. Add it to your Watchlist."), /*#__PURE__*/React.createElement("div", {
  className: "relative"
}, /*#__PURE__*/React.createElement("select", {
  value: region,
  onChange: function (e) {
    setRegion(e.target.value);
  },
  className: "w-full px-4 py-3 pr-10 text-xl rounded-xl bg-white/15 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer",
  style: {
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: 'none',
    color: region ? '#ffffff' : 'rgba(255,255,255,0.55)'
  }
}, /*#__PURE__*/React.createElement("option", {
  value: "",
  style: {
    color: '#9ca3af',
    backgroundColor: '#0c1e3a'
  }
}, "Region"), OH_REGIONS.map(function (r) {
  return /*#__PURE__*/React.createElement("option", {
    key: r,
    value: r,
    style: {
      color: '#ffffff',
      backgroundColor: '#0c1e3a'
    }
  }, r);
})), /*#__PURE__*/React.createElement("svg", {
  className: "w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24"
}, /*#__PURE__*/React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2,
  d: "M19 9l-7 7-7-7"
}))), /*#__PURE__*/React.createElement("input", {
  type: "text",
  placeholder: "State (optional)",
  value: state,
  onChange: function (e) {
    setStateVal(e.target.value);
  },
  autoCorrect: "off",
  autoCapitalize: "words",
  autoComplete: "off",
  spellCheck: "false",
  className: "w-full px-4 py-3 text-xl rounded-xl bg-white/15 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
}), /*#__PURE__*/React.createElement("input", {
  type: "text",
  placeholder: "City (optional)",
  value: city,
  onChange: function (e) {
    setCity(e.target.value);
  },
  onKeyDown: function (e) {
    if (e.key === 'Enter') submit();
  },
  autoCorrect: "off",
  autoCapitalize: "words",
  autoComplete: "off",
  spellCheck: "false",
  className: "w-full px-4 py-3 text-xl rounded-xl bg-white/15 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
}), msg ? /*#__PURE__*/React.createElement("p", {
  className: "text-center text-base " + (msgKind === 'ok' ? 'text-emerald-300' : 'text-red-300')
}, msg) : null, /*#__PURE__*/React.createElement("button", {
  onClick: submit,
  disabled: busy,
  className: "w-full py-4 rounded-xl bg-white text-gray-900 text-2xl font-bold disabled:opacity-50"
}, busy ? '...' : 'Add to Watchlist'), /*#__PURE__*/React.createElement("p", {
  className: "text-white/50 text-xs text-center italic px-1"
}, "Cron starts watching the moment you add it."), /*#__PURE__*/React.createElement("div", {
  className: "pt-3 border-t border-white/15 space-y-3"
}, /*#__PURE__*/React.createElement("p", {
  className: "text-white/60 text-xs text-center uppercase tracking-wider"
}, "Or browse the firehose"), /*#__PURE__*/React.createElement("button", {
  onClick: function () {
    setView('recalls');
  },
  className: "w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-base font-semibold"
}, "Browse Latest Recalls"), /*#__PURE__*/React.createElement("button", {
  onClick: function () {
    setView('outbreaks');
  },
  className: "w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-base font-semibold"
}, "Browse Latest Outbreaks"))), /*#__PURE__*/React.createElement("p", {
  className: "text-white/40 text-xs text-center px-6 italic mt-4"
}, "FDA \xB7 CDC \xB7 WHO. Based on publicly available sources.")));
```

}

// – PLACE CARD (row in Watchlist / My Places list) ––––––––––––––
function PlaceCard(props) {
const p = props.place;
const parts = [p.city, p.state, p.region].filter(Boolean);
const subtitle = parts.length ? parts.join(’ . ’) : p.name || ‘’;
return /*#**PURE***/React.createElement(“button”, {
onClick: function () {
props.onOpen(p);
},
className: “w-full text-left card-recall rounded-lg p-4 mb-3 hover:bg-gray-700/40”
}, /*#**PURE***/React.createElement(“div”, {
className: “flex items-start justify-between gap-2”
}, /*#**PURE***/React.createElement(“div”, {
className: “flex-1 min-w-0”
}, /*#**PURE***/React.createElement(“h3”, {
className: “font-bold text-white text-xl truncate”
}, p.name || ‘Place’), subtitle && subtitle !== p.name ? /*#**PURE***/React.createElement(“p”, {
className: “text-white/70 text-base truncate”
}, subtitle) : null, /*#**PURE***/React.createElement(“div”, {
className: “flex items-center gap-2 mt-1 flex-wrap”
}, p.in_my_places ? /*#**PURE***/React.createElement(“span”, {
className: “text-white text-xs px-2 py-1 rounded font-bold bg-amber-700”
}, “\u2605 My Places”) : null, /*#**PURE***/React.createElement(“span”, {
className: “text-white/60 text-xs”
}, “Watching \xB7 “, Math.round(p.radius_mi || 50), “ mi radius”))), /*#**PURE***/React.createElement(“span”, {
className: “text-white text-sm”
}, “tap to open”)));
}

// – PLACE DRAWER (v0.1.7: outbreaks + recalls matched to this location) —––
function PlaceDrawer(props) {
const place = props.place;
const _useState39 = useState(true),
_useState40 = _slicedToArray(_useState39, 2),
busy = _useState40[0],
setBusy = _useState40[1];
const _useState41 = useState(null),
_useState42 = _slicedToArray(_useState41, 2),
data = _useState42[0],
setData = _useState42[1];
const _useState43 = useState(’’),
_useState44 = _slicedToArray(_useState43, 2),
err = _useState44[0],
setErr = _useState44[1];
const _useState45 = useState(false),
_useState46 = _slicedToArray(_useState45, 2),
actionBusy = _useState46[0],
setActionBusy = _useState46[1];
function load() {
setBusy(true);
setErr(’’);
fetch(API_BASE + ‘/places/’ + place.id + ‘/events’, {
headers: authHeaders()
}).then(function (r) {
return r.json().then(function (d) {
return {
ok: r.ok,
d: d
};
});
}).then(function (res) {
setBusy(false);
if (!res.ok) {
setErr(res.d.detail || ‘Could not load’);
return;
}
setData(res.d);
}).catch(function () {
setBusy(false);
setErr(‘Network error’);
});
}
useEffect(function () {
load();
}, []);
function toggleMyPlaces() {
if (actionBusy) return;
setActionBusy(true);
const newVal = !place.in_my_places;
fetch(API_BASE + ‘/places/’ + place.id, {
method: ‘PATCH’,
headers: jsonHeaders(),
body: JSON.stringify({
in_my_places: newVal
})
}).then(function () {
setActionBusy(false);
if (props.onChanged) props.onChanged();
props.onClose();
}).catch(function () {
setActionBusy(false);
});
}
function remove() {
if (!confirm(‘Remove this place from your Watchlist? (This also removes it from My Places.)’)) return;
setActionBusy(true);
fetch(API_BASE + ‘/places/’ + place.id, {
method: ‘DELETE’,
headers: authHeaders()
}).then(function () {
setActionBusy(false);
if (props.onChanged) props.onChanged();
props.onClose();
}).catch(function () {
setActionBusy(false);
});
}
const outbreaks = data && data.outbreaks || [];
const recalls = data && data.recalls || [];
const parts = [place.city, place.state, place.region].filter(Boolean);
const subtitle = parts.length ? parts.join(’ . ‘) : ‘’;
return /*#**PURE***/React.createElement(“div”, {
className: “fixed inset-0 z-50 flex items-end justify-center drawer-backdrop”,
onClick: props.onClose
}, /*#**PURE***/React.createElement(“div”, {
className: “card-mw rounded-t-2xl w-full max-w-lg p-5 max-h-[85vh] overflow-y-auto scrollbar-thin”,
onClick: function (e) {
e.stopPropagation();
}
}, /*#**PURE***/React.createElement(“div”, {
className: “flex items-start justify-between mb-2”
}, /*#**PURE***/React.createElement(“div”, {
className: “flex-1”
}, /*#**PURE***/React.createElement(“h3”, {
className: “text-white text-2xl font-bold”
}, place.name), subtitle ? /*#**PURE***/React.createElement(“p”, {
className: “text-white/70 text-base”
}, subtitle) : null, place.in_my_places ? /*#**PURE***/React.createElement(“span”, {
className: “inline-block text-white text-xs px-2 py-1 rounded font-bold mt-2 bg-amber-700”
}, “\u2605 Saved to My Places”) : null), /*#**PURE***/React.createElement(“button”, {
onClick: props.onClose,
className: “text-white hover:text-gray-300 text-3xl leading-none px-2”
}, “\xD7”)), busy ? /*#**PURE***/React.createElement(“p”, {
className: “text-white text-base py-4 text-center”
}, “Checking for outbreaks and recalls at this location\u2026”) : err ? /*#**PURE***/React.createElement(“p”, {
className: “text-red-300 text-base py-3”
}, err) : /*#**PURE***/React.createElement(“div”, null, /*#**PURE***/React.createElement(“p”, {
className: “text-white/60 text-sm mb-3 italic”
}, outbreaks.length === 0 && recalls.length === 0 ? ‘Nothing active here right now. We're watching.’ : outbreaks.length + ’ outbreak’ + (outbreaks.length === 1 ? ‘’ : ‘s’) + ’ . ’ + recalls.length + ’ recall’ + (recalls.length === 1 ? ‘’ : ‘s’)), outbreaks.length > 0 ? /*#**PURE***/React.createElement(“div”, {
className: “mb-4”
}, /*#**PURE***/React.createElement(“p”, {
className: “text-emerald-300 text-lg font-bold mb-2”
}, “Outbreaks”), outbreaks.map(function (o) {
return /*#**PURE***/React.createElement(OutbreakCard, {
key: o.id,
outbreak: o
});
})) : null, recalls.length > 0 ? /*#**PURE***/React.createElement(“div”, {
className: “mb-4”
}, /*#**PURE***/React.createElement(“p”, {
className: “text-red-300 text-lg font-bold mb-2”
}, “Recalls”), recalls.map(function (r) {
return /*#**PURE***/React.createElement(RecallCard, {
key: r.id,
recall: r
});
})) : null), /*#**PURE***/React.createElement(“div”, {
className: “flex flex-wrap gap-2 mt-4”
}, /*#**PURE***/React.createElement(“button”, {
onClick: toggleMyPlaces,
disabled: actionBusy,
className: “flex-1 py-4 text-xl rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold border border-amber-500 disabled:opacity-50”
}, place.in_my_places ? ‘Remove from My Places’ : ‘* Save to My Places’), /*#**PURE***/React.createElement(“button”, {
onClick: remove,
disabled: actionBusy,
className: “flex-1 py-4 text-xl rounded-xl bg-red-900/60 text-white font-bold border border-red-600 hover:bg-red-800/70 disabled:opacity-50”
}, “\uD83D\uDDD1 Remove”))));
}

// – WATCHLIST PAGE (renders PLACES, not recall items) ———————––
function WatchlistPage(props) {
// All places on the Watchlist (regardless of in_my_places state).
const places = props.places || [];
return /*#**PURE***/React.createElement(“div”, {
className: “px-3 pb-32”,
style: {
paddingTop: ‘12vh’
}
}, /*#**PURE***/React.createElement(BackgroundHeader, {
title: “Watchlist (” + places.length + “)”,
subtitle: “Places we’re actively monitoring”
}), /*#**PURE***/React.createElement(“div”, {
className: “card-mw rounded-2xl p-5 max-w-2xl mx-auto”,
style: {
marginTop: ‘2vh’
}
}, places.length === 0 ? /*#**PURE***/React.createElement(“p”, {
className: “text-white text-xl text-center py-6”
}, “Your Watchlist is empty. Use Search to add a region, state, or city.”) : places.map(function (p) {
return /*#**PURE***/React.createElement(PlaceCard, {
key: p.id,
place: p,
onOpen: props.onOpen
});
})));
}

// – MY PLACES PAGE (places where in_my_places=true) —————————
function MyPlacesPage(props) {
const saved = (props.places || []).filter(function (p) {
return p.in_my_places;
});
return /*#**PURE***/React.createElement(“div”, {
className: “px-3 pb-32”,
style: {
paddingTop: ‘12vh’
}
}, /*#**PURE***/React.createElement(BackgroundHeader, {
title: “My Places (” + saved.length + “)”,
subtitle: “Saved places \u2014 they stay on the Watchlist too”
}), /*#**PURE***/React.createElement(“div”, {
className: “card-mw rounded-2xl p-5 max-w-2xl mx-auto”,
style: {
marginTop: ‘2vh’
}
}, saved.length === 0 ? /*#**PURE***/React.createElement(“p”, {
className: “text-white text-xl text-center py-6”
}, “No saved places yet. Open any place from your Watchlist and tap \u2605 Save to My Places.”) : saved.map(function (p) {
return /*#**PURE***/React.createElement(PlaceCard, {
key: p.id,
place: p,
onOpen: props.onOpen
});
})));
}

// – ALERTS PAGE —————————————————————
function AlertsPage(props) {
const _useState47 = useState([]),
_useState48 = _slicedToArray(_useState47, 2),
items = _useState48[0],
setItems = _useState48[1];
const _useState49 = useState(true),
_useState50 = _slicedToArray(_useState49, 2),
busy = _useState50[0],
setBusy = _useState50[1];
function load() {
setBusy(true);
fetch(API_BASE + ‘/notifications’, {
headers: authHeaders()
}).then(function (r) {
return r.json();
}).then(function (d) {
setItems(d.results || []);
setBusy(false);
}).catch(function () {
setBusy(false);
setItems([]);
});
}
function dismiss(id) {
fetch(API_BASE + ‘/notifications/’ + id, {
method: ‘DELETE’,
headers: authHeaders()
}).then(function () {
load();
}).catch(function () {});
}
useEffect(load, []);
return /*#**PURE***/React.createElement(“div”, {
className: “px-3 pb-32”,
style: {
paddingTop: ‘12vh’
}
}, /*#**PURE***/React.createElement(BackgroundHeader, {
title: “Alerts (” + items.length + “)”,
subtitle: “Outbreak and recall activity at your places”
}), /*#**PURE***/React.createElement(“div”, {
className: “card-mw rounded-2xl p-5 max-w-2xl mx-auto”,
style: {
marginTop: ‘2vh’
}
}, busy ? /*#**PURE***/React.createElement(“p”, {
className: “text-white text-base text-center”
}, “Loading\u2026”) : items.length === 0 ? /*#**PURE***/React.createElement(“p”, {
className: “text-white text-xl text-center py-6”
}, “No alerts. We’re watching \u2014 when something happens at a place on your Watchlist, you’ll see it here.”) : items.map(function (n) {
return /*#**PURE***/React.createElement(“div”, {
key: n.id,
className: “card-recall rounded-lg p-4 mb-3”
}, /*#**PURE***/React.createElement(“p”, {
className: “text-white text-base”
}, n.message), n.source ? /*#**PURE***/React.createElement(“span”, {
className: “inline-block text-white text-xs px-2 py-1 rounded font-bold mt-2 “ + sourceBadgeClass(n.source)
}, sourceLabel(n.source)) : null, /*#**PURE***/React.createElement(“p”, {
className: “text-white/60 text-xs mt-2”
}, fmtRelative(n.created_at)), /*#**PURE***/React.createElement(“button”, {
onClick: function () {
dismiss(n.id);
},
className: “mt-2 text-sm text-white/70 hover:text-white underline”
}, “Dismiss”));
})));
}

// – INFO / ABOUT PAGE ———————————————————
function InfoPage(props) {
function logout() {
if (confirm(‘Log out?’)) {
try {
localStorage.removeItem(TOKEN_KEY);
localStorage.removeItem(USER_KEY);
} catch (e) {}
props.onLogout();
}
}
return /*#**PURE***/React.createElement(“div”, {
className: “px-3 pb-32”,
style: {
paddingTop: ‘12vh’
}
}, /*#**PURE***/React.createElement(BackgroundHeader, {
title: “Info”,
subtitle: “About OurHealth.Watch”
}), /*#**PURE***/React.createElement(“div”, {
className: “card-mw rounded-2xl p-5 max-w-2xl mx-auto”,
style: {
marginTop: ‘2vh’
}
}, /*#**PURE***/React.createElement(“p”, {
className: “text-white text-base”
}, “OurHealth.Watch monitors official public-health feeds \u2014 FDA drug and device recalls, CDC outbreak reports, WHO disease outbreak news \u2014 for places you care about. Pick a region, state, or city. Add it to your Watchlist. We’ll alert you when something happens there.”), /*#**PURE***/React.createElement(“p”, {
className: “text-white/80 text-sm mt-3”
}, “Companion to Cruise Ship Watch and EarthWatch. Watch a place. Save the ones you care about. That’s it.”), /*#**PURE***/React.createElement(“p”, {
className: “text-white/60 text-xs mt-4 italic”
}, “Based on publicly available sources. Not medical advice.”), /*#**PURE***/React.createElement(“hr”, {
className: “border-white/20 my-5”
}), /*#**PURE***/React.createElement(“p”, {
className: “text-white/80 text-sm”
}, /*#**PURE***/React.createElement(“span”, {
className: “text-white/60”
}, “Account:”), “ “, props.email), /*#**PURE***/React.createElement(“p”, {
className: “text-white/60 text-xs mt-3”
}, “app v”, APP_VERSION, “ \xB7 api v”, props.apiVersion), /*#**PURE***/React.createElement(“button”, {
onClick: logout,
className: “w-full mt-5 px-4 py-2 rounded bg-red-800 hover:bg-red-700 text-white text-base font-semibold”
}, “Log out”)));
}

// – BOTTOM NAV ––––––––––––––––––––––––––––––––
function NavIcon(props) {
const id = props.id;
if (id === ‘search’) return /*#**PURE***/React.createElement(“svg”, {
className: “w-7 h-7”,
fill: “none”,
stroke: “currentColor”,
viewBox: “0 0 24 24”
}, /*#**PURE***/React.createElement(“path”, {
strokeLinecap: “round”,
strokeLinejoin: “round”,
strokeWidth: 2,
d: “M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z”
}));
if (id === ‘watchlist’) return /*#**PURE***/React.createElement(“svg”, {
className: “w-7 h-7”,
fill: “none”,
stroke: “currentColor”,
viewBox: “0 0 24 24”
}, /*#**PURE***/React.createElement(“path”, {
strokeLinecap: “round”,
strokeLinejoin: “round”,
strokeWidth: 2,
d: “M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z”
}));
if (id === ‘myplaces’) return /*#**PURE***/React.createElement(“svg”, {
className: “w-7 h-7”,
fill: “none”,
stroke: “currentColor”,
viewBox: “0 0 24 24”
}, /*#**PURE***/React.createElement(“path”, {
strokeLinecap: “round”,
strokeLinejoin: “round”,
strokeWidth: 2,
d: “M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z”
}), /*#**PURE***/React.createElement(“path”, {
strokeLinecap: “round”,
strokeLinejoin: “round”,
strokeWidth: 2,
d: “M15 11a3 3 0 11-6 0 3 3 0 016 0z”
}));
if (id === ‘info’) return /*#**PURE***/React.createElement(“svg”, {
className: “w-7 h-7”,
fill: “none”,
stroke: “currentColor”,
viewBox: “0 0 24 24”
}, /*#**PURE***/React.createElement(“path”, {
strokeLinecap: “round”,
strokeLinejoin: “round”,
strokeWidth: 2,
d: “M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z”
}));
if (id === ‘alerts’) return /*#**PURE***/React.createElement(“svg”, {
className: “w-7 h-7”,
fill: “none”,
stroke: “currentColor”,
viewBox: “0 0 24 24”
}, /*#**PURE***/React.createElement(“path”, {
strokeLinecap: “round”,
strokeLinejoin: “round”,
strokeWidth: 2,
d: “M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9”
}));
return null;
}
function BottomNav(props) {
const tabs = [{
id: ‘search’,
label: ‘Search’
}, {
id: ‘watchlist’,
label: ‘Watchlist’
}, {
id: ‘myplaces’,
label: ‘My Places’
}, {
id: ‘info’,
label: ‘Info’
}, {
id: ‘alerts’,
label: ‘Alerts’
}];
return /*#**PURE***/React.createElement(“div”, {
style: {
position: ‘fixed’,
bottom: 0,
left: 0,
right: 0,
backgroundColor: ‘rgba(0,0,0,0.85)’,
backdropFilter: ‘blur(8px)’,
borderTop: ‘1px solid rgba(255,255,255,0.15)’,
padding: ‘0.5rem 0.75rem’,
paddingBottom: ‘max(0.5rem, env(safe-area-inset-bottom))’,
zIndex: 40
}
}, /*#**PURE***/React.createElement(“div”, {
className: “flex justify-around max-w-2xl mx-auto”
}, tabs.map(function (t) {
const active = props.page === t.id;
const isAlerts = t.id === ‘alerts’;
const cls = “flex flex-col items-center gap-0.5 px-1 py-1 relative “ + (active ? “text-white” : “text-gray-400”);
return /*#**PURE***/React.createElement(“button”, {
key: t.id,
className: cls,
onClick: function () {
props.onChange(t.id);
}
}, /*#**PURE***/React.createElement(NavIcon, {
id: t.id
}), isAlerts && props.alertCount > 0 ? /*#**PURE***/React.createElement(“span”, {
className: “absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center”
}, props.alertCount > 9 ? ‘9+’ : props.alertCount) : null, /*#**PURE***/React.createElement(“span”, {
className: “text-xl font-medium”
}, t.label));
})));
}

// – APP ROOT ——————————————————————
function App() {
const _useState51 = useState(null),
_useState52 = _slicedToArray(_useState51, 2),
user = _useState52[0],
setUser = _useState52[1];
const _useState53 = useState(’…’),
_useState54 = _slicedToArray(_useState53, 2),
apiVersion = _useState54[0],
setApiVersion = _useState54[1];
const _useState55 = useState(‘search’),
_useState56 = _slicedToArray(_useState55, 2),
page = _useState56[0],
setPage = _useState56[1];
const _useState57 = useState([]),
_useState58 = _slicedToArray(_useState57, 2),
places = _useState58[0],
setPlaces = _useState58[1];
const _useState59 = useState(null),
_useState60 = _slicedToArray(_useState59, 2),
drawerPlace = _useState60[0],
setDrawerPlace = _useState60[1];
const _useState61 = useState(0),
_useState62 = _slicedToArray(_useState61, 2),
alertCount = _useState62[0],
setAlertCount = _useState62[1];

```
// Cold-start: fetch health, hydrate auth.
useEffect(function () {
  fetch(API_BASE + '/health').then(function (r) {
    return r.json();
  }).then(function (d) {
    setApiVersion(d.version || '?');
  }).catch(function () {
    setApiVersion('offline');
  });
  try {
    const t = localStorage.getItem(TOKEN_KEY);
    const u = localStorage.getItem(USER_KEY);
    if (t && u) {
      setUser(JSON.parse(u));
    }
  } catch (e) {}
}, []);
function loadPlaces() {
  if (!getToken()) return;
  fetch(API_BASE + '/places', {
    headers: authHeaders()
  }).then(function (r) {
    return r.json();
  }).then(function (d) {
    setPlaces(d.results || []);
  }).catch(function () {});
}
function loadAlertCount() {
  if (!getToken()) return;
  fetch(API_BASE + '/notifications', {
    headers: authHeaders()
  }).then(function (r) {
    return r.json();
  }).then(function (d) {
    setAlertCount((d.results || []).length);
  }).catch(function () {});
}
useEffect(function () {
  if (user) {
    loadPlaces();
    loadAlertCount();
  }
}, [user]);
useEffect(function () {
  if (!user) return;
  const t = setTimeout(function () {
    loadPlaces();
    loadAlertCount();
  }, 0);
  return function () {
    clearTimeout(t);
  };
}, [page]);
function handleAuth(u) {
  setUser(u);
  setPage('search');
}
function handleLogout() {
  setUser(null);
  setPage('search');
}
function handleNavChange(newPage) {
  if (document.activeElement) document.activeElement.blur();
  setPage(newPage);
}
function handleChanged() {
  loadPlaces();
  loadAlertCount();
}
if (!user) {
  return /*#__PURE__*/React.createElement(LoginScreen, {
    onAuth: handleAuth
  });
}
return /*#__PURE__*/React.createElement("div", {
  className: "app-bg min-h-screen"
}, /*#__PURE__*/React.createElement("main", null, page === 'search' && /*#__PURE__*/React.createElement(SearchPage, {
  onPlaceAdded: handleChanged
}), page === 'watchlist' && /*#__PURE__*/React.createElement(WatchlistPage, {
  places: places,
  onOpen: setDrawerPlace
}), page === 'myplaces' && /*#__PURE__*/React.createElement(MyPlacesPage, {
  places: places,
  onOpen: setDrawerPlace
}), page === 'info' && /*#__PURE__*/React.createElement(InfoPage, {
  email: user.email,
  apiVersion: apiVersion,
  onLogout: handleLogout
}), page === 'alerts' && /*#__PURE__*/React.createElement(AlertsPage, null)), /*#__PURE__*/React.createElement(BottomNav, {
  page: page,
  onChange: handleNavChange,
  alertCount: alertCount
}), drawerPlace ? /*#__PURE__*/React.createElement(PlaceDrawer, {
  place: drawerPlace,
  onClose: function () {
    setDrawerPlace(null);
  },
  onChanged: handleChanged
}) : null);
```

}
window.__ohwStep = ‘Y: about to mount’;
try {
ReactDOM.render(/*#**PURE***/React.createElement(App, null), document.getElementById(‘root’));
window.__ohwStep = ‘Z: mount returned’;
// If we reach here, React mounted – flip the banner green.
if (window.__ohwBannerSet) window.__ohwBannerSet(‘debug2 . React mounted OK’, ‘#22c55e’);
} catch (e) {
const root = document.getElementById(‘root’);
if (root) {
root.innerHTML = ‘<div style="padding:60px 20px 20px;color:#fff;font-family:monospace;font-size:14px;background:#7f1d1d;min-height:100vh;white-space:pre-wrap;">’ + ‘<strong>MOUNT ERROR</strong>\n\n’ + String(e && e.stack || e).replace(/</g, ‘<’) + ‘</div>’;
}
}
})();
