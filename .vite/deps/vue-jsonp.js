// ../../../../../node_modules/vue-jsonp/dist/index.esm.js
function e(t2, n2) {
  t2 = t2.replace(/=/g, "");
  var o2 = [];
  switch (n2.constructor) {
    case String:
    case Number:
    case Boolean:
      o2.push(encodeURIComponent(t2) + "=" + encodeURIComponent(n2));
      break;
    case Array:
      n2.forEach(function(n3) {
        o2 = o2.concat(e(t2 + "[]=", n3));
      });
      break;
    case Object:
      Object.keys(n2).forEach(function(r) {
        var a = n2[r];
        o2 = o2.concat(e(t2 + "[" + r + "]", a));
      });
  }
  return o2;
}
function t(e2) {
  var n2 = [];
  return e2.forEach(function(e3) {
    "string" == typeof e3 ? n2.push(e3) : n2 = n2.concat(t(e3));
  }), n2;
}
var n = { install: function(e2) {
  e2.prototype.$jsonp = o;
} };
function o(n2, o2, r) {
  if (void 0 === o2 && (o2 = {}), "string" != typeof n2)
    throw new Error('[Vue-jsonp] Type of param "url" is not string.');
  if ("object" != typeof o2 || !o2)
    throw new Error("[Vue-jsonp] Invalid params, should be an object.");
  return r = "number" == typeof r ? r : 5e3, new Promise(function(a, c) {
    var u = "string" == typeof o2.callbackQuery ? o2.callbackQuery : "callback", i = "string" == typeof o2.callbackName ? o2.callbackName : "jsonp_" + (Math.floor(1e5 * Math.random()) * Date.now()).toString(16);
    o2[u] = i, delete o2.callbackQuery, delete o2.callbackName;
    var s = [];
    Object.keys(o2).forEach(function(t2) {
      s = s.concat(e(t2, o2[t2]));
    });
    var l = t(s).join("&"), f = function() {
      p(), clearTimeout(m), c({ status: 400, statusText: "Bad Request" });
    }, p = function() {
      b.removeEventListener("error", f);
    }, d = function() {
      document.body.removeChild(b), delete window[i];
    }, m = null;
    r > -1 && (m = setTimeout(function() {
      p(), d(), c({ statusText: "Request Timeout", status: 408 });
    }, r)), window[i] = function(e2) {
      clearTimeout(m), p(), d(), a(e2);
    };
    var b = document.createElement("script");
    b.addEventListener("error", f), b.src = n2 + (/\?/.test(n2) ? "&" : "?") + l, document.body.appendChild(b);
  });
}
export {
  n as VueJsonp,
  o as jsonp
};
/*! Bundled license information:

vue-jsonp/dist/index.esm.js:
  (**
   * Vue Jsonp.
   * # Carry Your World #
   *
   * @author: LancerComet
   * @license: MIT
   *)
*/
//# sourceMappingURL=vue-jsonp.js.map
