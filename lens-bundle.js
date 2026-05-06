(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/set-cookie-parser/lib/set-cookie.js
  var require_set_cookie = __commonJS({
    "node_modules/set-cookie-parser/lib/set-cookie.js"(exports, module) {
      "use strict";
      var defaultParseOptions = {
        decodeValues: true,
        map: false,
        silent: false
      };
      function isForbiddenKey(key) {
        return typeof key !== "string" || key in {};
      }
      function createNullObj() {
        return /* @__PURE__ */ Object.create(null);
      }
      function isNonEmptyString(str) {
        return typeof str === "string" && !!str.trim();
      }
      function parseString(setCookieValue, options) {
        var parts = setCookieValue.split(";").filter(isNonEmptyString);
        var nameValuePairStr = parts.shift();
        var parsed = parseNameValuePair(nameValuePairStr);
        var name = parsed.name;
        var value = parsed.value;
        options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
        if (isForbiddenKey(name)) {
          return null;
        }
        try {
          value = options.decodeValues ? decodeURIComponent(value) : value;
        } catch (e) {
          console.error(
            "set-cookie-parser: failed to decode cookie value. Set options.decodeValues=false to disable decoding.",
            e
          );
        }
        var cookie = createNullObj();
        cookie.name = name;
        cookie.value = value;
        parts.forEach(function(part) {
          var sides = part.split("=");
          var key = sides.shift().trimLeft().toLowerCase();
          if (isForbiddenKey(key)) {
            return;
          }
          var value2 = sides.join("=");
          if (key === "expires") {
            cookie.expires = new Date(value2);
          } else if (key === "max-age") {
            var n = parseInt(value2, 10);
            if (!Number.isNaN(n)) cookie.maxAge = n;
          } else if (key === "secure") {
            cookie.secure = true;
          } else if (key === "httponly") {
            cookie.httpOnly = true;
          } else if (key === "samesite") {
            cookie.sameSite = value2;
          } else if (key === "partitioned") {
            cookie.partitioned = true;
          } else if (key) {
            cookie[key] = value2;
          }
        });
        return cookie;
      }
      function parseNameValuePair(nameValuePairStr) {
        var name = "";
        var value = "";
        var nameValueArr = nameValuePairStr.split("=");
        if (nameValueArr.length > 1) {
          name = nameValueArr.shift();
          value = nameValueArr.join("=");
        } else {
          value = nameValuePairStr;
        }
        return { name, value };
      }
      function parse(input, options) {
        options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
        if (!input) {
          if (!options.map) {
            return [];
          } else {
            return createNullObj();
          }
        }
        if (input.headers) {
          if (typeof input.headers.getSetCookie === "function") {
            input = input.headers.getSetCookie();
          } else if (input.headers["set-cookie"]) {
            input = input.headers["set-cookie"];
          } else {
            var sch = input.headers[Object.keys(input.headers).find(function(key) {
              return key.toLowerCase() === "set-cookie";
            })];
            if (!sch && input.headers.cookie && !options.silent) {
              console.warn(
                "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
              );
            }
            input = sch;
          }
        }
        if (!Array.isArray(input)) {
          input = [input];
        }
        if (!options.map) {
          return input.filter(isNonEmptyString).map(function(str) {
            return parseString(str, options);
          }).filter(Boolean);
        } else {
          var cookies = createNullObj();
          return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
            var cookie = parseString(str, options);
            if (cookie && !isForbiddenKey(cookie.name)) {
              cookies2[cookie.name] = cookie;
            }
            return cookies2;
          }, cookies);
        }
      }
      function splitCookiesString(cookiesString) {
        if (Array.isArray(cookiesString)) {
          return cookiesString;
        }
        if (typeof cookiesString !== "string") {
          return [];
        }
        var cookiesStrings = [];
        var pos = 0;
        var start;
        var ch;
        var lastComma;
        var nextStart;
        var cookiesSeparatorFound;
        function skipWhitespace() {
          while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
            pos += 1;
          }
          return pos < cookiesString.length;
        }
        function notSpecialChar() {
          ch = cookiesString.charAt(pos);
          return ch !== "=" && ch !== ";" && ch !== ",";
        }
        while (pos < cookiesString.length) {
          start = pos;
          cookiesSeparatorFound = false;
          while (skipWhitespace()) {
            ch = cookiesString.charAt(pos);
            if (ch === ",") {
              lastComma = pos;
              pos += 1;
              skipWhitespace();
              nextStart = pos;
              while (pos < cookiesString.length && notSpecialChar()) {
                pos += 1;
              }
              if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
                cookiesSeparatorFound = true;
                pos = nextStart;
                cookiesStrings.push(cookiesString.substring(start, lastComma));
                start = pos;
              } else {
                pos = lastComma + 1;
              }
            } else {
              pos += 1;
            }
          }
          if (!cookiesSeparatorFound || pos >= cookiesString.length) {
            cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
          }
        }
        return cookiesStrings;
      }
      module.exports = parse;
      module.exports.parse = parse;
      module.exports.parseString = parseString;
      module.exports.splitCookiesString = splitCookiesString;
    }
  });

  // node_modules/google-protobuf/google-protobuf.js
  var require_google_protobuf = __commonJS({
    "node_modules/google-protobuf/google-protobuf.js"(exports) {
      var aa = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b2, c) {
        a != Array.prototype && a != Object.prototype && (a[b2] = c.value);
      };
      var e = "undefined" != typeof window && window === exports ? exports : "undefined" != typeof global && null != global ? global : exports;
      function ba(a, b2) {
        if (b2) {
          var c = e;
          a = a.split(".");
          for (var d = 0; d < a.length - 1; d++) {
            var f2 = a[d];
            f2 in c || (c[f2] = {});
            c = c[f2];
          }
          a = a[a.length - 1];
          d = c[a];
          b2 = b2(d);
          b2 != d && null != b2 && aa(c, a, { configurable: true, writable: true, value: b2 });
        }
      }
      function ca(a) {
        var b2 = 0;
        return function() {
          return b2 < a.length ? { done: false, value: a[b2++] } : { done: true };
        };
      }
      function da() {
        da = function() {
        };
        e.Symbol || (e.Symbol = ea);
      }
      function fa(a, b2) {
        this.a = a;
        aa(this, "description", { configurable: true, writable: true, value: b2 });
      }
      fa.prototype.toString = function() {
        return this.a;
      };
      var ea = /* @__PURE__ */ function() {
        function a(c) {
          if (this instanceof a) throw new TypeError("Symbol is not a constructor");
          return new fa("jscomp_symbol_" + (c || "") + "_" + b2++, c);
        }
        var b2 = 0;
        return a;
      }();
      function ha() {
        da();
        var a = e.Symbol.iterator;
        a || (a = e.Symbol.iterator = e.Symbol("Symbol.iterator"));
        "function" != typeof Array.prototype[a] && aa(Array.prototype, a, { configurable: true, writable: true, value: function() {
          return ia(ca(this));
        } });
        ha = function() {
        };
      }
      function ia(a) {
        ha();
        a = { next: a };
        a[e.Symbol.iterator] = function() {
          return this;
        };
        return a;
      }
      function ja(a, b2) {
        ha();
        a instanceof String && (a += "");
        var c = 0, d = { next: function() {
          if (c < a.length) {
            var f2 = c++;
            return { value: b2(f2, a[f2]), done: false };
          }
          d.next = function() {
            return { done: true, value: void 0 };
          };
          return d.next();
        } };
        d[Symbol.iterator] = function() {
          return d;
        };
        return d;
      }
      ba("Array.prototype.entries", function(a) {
        return a ? a : function() {
          return ja(this, function(b2, c) {
            return [b2, c];
          });
        };
      });
      var ka = exports || self;
      function g(a, b2, c) {
        a = a.split(".");
        c = c || ka;
        a[0] in c || "undefined" == typeof c.execScript || c.execScript("var " + a[0]);
        for (var d; a.length && (d = a.shift()); ) a.length || void 0 === b2 ? c[d] && c[d] !== Object.prototype[d] ? c = c[d] : c = c[d] = {} : c[d] = b2;
      }
      function k2(a) {
        var b2 = typeof a;
        if ("object" == b2) if (a) {
          if (a instanceof Array) return "array";
          if (a instanceof Object) return b2;
          var c = Object.prototype.toString.call(a);
          if ("[object Window]" == c) return "object";
          if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array";
          if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function";
        } else return "null";
        else if ("function" == b2 && "undefined" == typeof a.call) return "object";
        return b2;
      }
      function la(a) {
        var b2 = typeof a;
        return "object" == b2 && null != a || "function" == b2;
      }
      function ma(a, b2, c) {
        g(a, b2, c);
      }
      function na(a, b2) {
        function c() {
        }
        c.prototype = b2.prototype;
        a.prototype = new c();
        a.prototype.constructor = a;
      }
      var oa = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
      function pa(a, b2) {
        for (var c, d, f2 = 1; f2 < arguments.length; f2++) {
          d = arguments[f2];
          for (c in d) a[c] = d[c];
          for (var h = 0; h < oa.length; h++) c = oa[h], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
        }
      }
      var qa = Array.prototype.forEach ? function(a, b2) {
        Array.prototype.forEach.call(a, b2, void 0);
      } : function(a, b2) {
        for (var c = a.length, d = "string" === typeof a ? a.split("") : a, f2 = 0; f2 < c; f2++) f2 in d && b2.call(void 0, d[f2], f2, a);
      };
      var l = Array.prototype.map ? function(a, b2) {
        return Array.prototype.map.call(a, b2, void 0);
      } : function(a, b2) {
        for (var c = a.length, d = Array(c), f2 = "string" === typeof a ? a.split("") : a, h = 0; h < c; h++) h in f2 && (d[h] = b2.call(void 0, f2[h], h, a));
        return d;
      };
      function ra(a, b2, c) {
        return 2 >= arguments.length ? Array.prototype.slice.call(a, b2) : Array.prototype.slice.call(a, b2, c);
      }
      function sa(a, b2, c, d) {
        var f2 = "Assertion failed";
        if (c) {
          f2 += ": " + c;
          var h = d;
        } else a && (f2 += ": " + a, h = b2);
        throw Error(f2, h || []);
      }
      function n(a, b2, c) {
        for (var d = [], f2 = 2; f2 < arguments.length; ++f2) d[f2 - 2] = arguments[f2];
        a || sa("", null, b2, d);
        return a;
      }
      function ta(a, b2, c) {
        for (var d = [], f2 = 2; f2 < arguments.length; ++f2) d[f2 - 2] = arguments[f2];
        "string" !== typeof a && sa("Expected string but got %s: %s.", [k2(a), a], b2, d);
      }
      function ua(a, b2, c) {
        for (var d = [], f2 = 2; f2 < arguments.length; ++f2) d[f2 - 2] = arguments[f2];
        Array.isArray(a) || sa("Expected array but got %s: %s.", [k2(a), a], b2, d);
      }
      function p(a, b2) {
        for (var c = [], d = 1; d < arguments.length; ++d) c[d - 1] = arguments[d];
        throw Error("Failure" + (a ? ": " + a : ""), c);
      }
      function q2(a, b2, c, d) {
        for (var f2 = [], h = 3; h < arguments.length; ++h) f2[h - 3] = arguments[h];
        a instanceof b2 || sa("Expected instanceof %s but got %s.", [va(b2), va(a)], c, f2);
      }
      function va(a) {
        return a instanceof Function ? a.displayName || a.name || "unknown type name" : a instanceof Object ? a.constructor.displayName || a.constructor.name || Object.prototype.toString.call(a) : null === a ? "null" : typeof a;
      }
      function r(a, b2) {
        this.c = a;
        this.b = b2;
        this.a = {};
        this.arrClean = true;
        if (0 < this.c.length) {
          for (a = 0; a < this.c.length; a++) {
            b2 = this.c[a];
            var c = b2[0];
            this.a[c.toString()] = new wa(c, b2[1]);
          }
          this.arrClean = true;
        }
      }
      g("jspb.Map", r, void 0);
      r.prototype.g = function() {
        if (this.arrClean) {
          if (this.b) {
            var a = this.a, b2;
            for (b2 in a) if (Object.prototype.hasOwnProperty.call(a, b2)) {
              var c = a[b2].a;
              c && c.g();
            }
          }
        } else {
          this.c.length = 0;
          a = u(this);
          a.sort();
          for (b2 = 0; b2 < a.length; b2++) {
            var d = this.a[a[b2]];
            (c = d.a) && c.g();
            this.c.push([d.key, d.value]);
          }
          this.arrClean = true;
        }
        return this.c;
      };
      r.prototype.toArray = r.prototype.g;
      r.prototype.Mc = function(a, b2) {
        for (var c = this.g(), d = [], f2 = 0; f2 < c.length; f2++) {
          var h = this.a[c[f2][0].toString()];
          v(this, h);
          var m2 = h.a;
          m2 ? (n(b2), d.push([h.key, b2(a, m2)])) : d.push([h.key, h.value]);
        }
        return d;
      };
      r.prototype.toObject = r.prototype.Mc;
      r.fromObject = function(a, b2, c) {
        b2 = new r([], b2);
        for (var d = 0; d < a.length; d++) {
          var f2 = a[d][0], h = c(a[d][1]);
          b2.set(f2, h);
        }
        return b2;
      };
      function w2(a) {
        this.a = 0;
        this.b = a;
      }
      w2.prototype.next = function() {
        return this.a < this.b.length ? { done: false, value: this.b[this.a++] } : { done: true, value: void 0 };
      };
      "undefined" != typeof Symbol && (w2.prototype[Symbol.iterator] = function() {
        return this;
      });
      r.prototype.Jb = function() {
        return u(this).length;
      };
      r.prototype.getLength = r.prototype.Jb;
      r.prototype.clear = function() {
        this.a = {};
        this.arrClean = false;
      };
      r.prototype.clear = r.prototype.clear;
      r.prototype.Cb = function(a) {
        a = a.toString();
        var b2 = this.a.hasOwnProperty(a);
        delete this.a[a];
        this.arrClean = false;
        return b2;
      };
      r.prototype.del = r.prototype.Cb;
      r.prototype.Eb = function() {
        var a = [], b2 = u(this);
        b2.sort();
        for (var c = 0; c < b2.length; c++) {
          var d = this.a[b2[c]];
          a.push([d.key, d.value]);
        }
        return a;
      };
      r.prototype.getEntryList = r.prototype.Eb;
      r.prototype.entries = function() {
        var a = [], b2 = u(this);
        b2.sort();
        for (var c = 0; c < b2.length; c++) {
          var d = this.a[b2[c]];
          a.push([d.key, v(this, d)]);
        }
        return new w2(a);
      };
      r.prototype.entries = r.prototype.entries;
      r.prototype.keys = function() {
        var a = [], b2 = u(this);
        b2.sort();
        for (var c = 0; c < b2.length; c++) a.push(this.a[b2[c]].key);
        return new w2(a);
      };
      r.prototype.keys = r.prototype.keys;
      r.prototype.values = function() {
        var a = [], b2 = u(this);
        b2.sort();
        for (var c = 0; c < b2.length; c++) a.push(v(this, this.a[b2[c]]));
        return new w2(a);
      };
      r.prototype.values = r.prototype.values;
      r.prototype.forEach = function(a, b2) {
        var c = u(this);
        c.sort();
        for (var d = 0; d < c.length; d++) {
          var f2 = this.a[c[d]];
          a.call(b2, v(this, f2), f2.key, this);
        }
      };
      r.prototype.forEach = r.prototype.forEach;
      r.prototype.set = function(a, b2) {
        var c = new wa(a);
        this.b ? (c.a = b2, c.value = b2.g()) : c.value = b2;
        this.a[a.toString()] = c;
        this.arrClean = false;
        return this;
      };
      r.prototype.set = r.prototype.set;
      function v(a, b2) {
        return a.b ? (b2.a || (b2.a = new a.b(b2.value)), b2.a) : b2.value;
      }
      r.prototype.get = function(a) {
        if (a = this.a[a.toString()]) return v(this, a);
      };
      r.prototype.get = r.prototype.get;
      r.prototype.has = function(a) {
        return a.toString() in this.a;
      };
      r.prototype.has = r.prototype.has;
      r.prototype.Jc = function(a, b2, c, d, f2) {
        var h = u(this);
        h.sort();
        for (var m2 = 0; m2 < h.length; m2++) {
          var t = this.a[h[m2]];
          b2.Va(a);
          c.call(b2, 1, t.key);
          this.b ? d.call(b2, 2, v(this, t), f2) : d.call(b2, 2, t.value);
          b2.Ya();
        }
      };
      r.prototype.serializeBinary = r.prototype.Jc;
      r.deserializeBinary = function(a, b2, c, d, f2, h, m2) {
        for (; b2.oa() && !b2.bb(); ) {
          var t = b2.c;
          1 == t ? h = c.call(b2) : 2 == t && (a.b ? (n(f2), m2 || (m2 = new a.b()), d.call(b2, m2, f2)) : m2 = d.call(b2));
        }
        n(void 0 != h);
        n(void 0 != m2);
        a.set(h, m2);
      };
      function u(a) {
        a = a.a;
        var b2 = [], c;
        for (c in a) Object.prototype.hasOwnProperty.call(a, c) && b2.push(c);
        return b2;
      }
      function wa(a, b2) {
        this.key = a;
        this.value = b2;
        this.a = void 0;
      }
      function xa(a) {
        if (8192 >= a.length) return String.fromCharCode.apply(null, a);
        for (var b2 = "", c = 0; c < a.length; c += 8192) b2 += String.fromCharCode.apply(null, ra(a, c, c + 8192));
        return b2;
      }
      var ya = { "\0": "\\0", "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "	": "\\t", "\v": "\\x0B", '"': '\\"', "\\": "\\\\", "<": "\\u003C" };
      var za = { "'": "\\'" };
      var Aa = {};
      var x2 = null;
      function Ba(a, b2) {
        void 0 === b2 && (b2 = 0);
        Ca();
        b2 = Aa[b2];
        for (var c = [], d = 0; d < a.length; d += 3) {
          var f2 = a[d], h = d + 1 < a.length, m2 = h ? a[d + 1] : 0, t = d + 2 < a.length, B2 = t ? a[d + 2] : 0, M = f2 >> 2;
          f2 = (f2 & 3) << 4 | m2 >> 4;
          m2 = (m2 & 15) << 2 | B2 >> 6;
          B2 &= 63;
          t || (B2 = 64, h || (m2 = 64));
          c.push(b2[M], b2[f2], b2[m2] || "", b2[B2] || "");
        }
        return c.join("");
      }
      function Da(a) {
        var b2 = a.length, c = 3 * b2 / 4;
        c % 3 ? c = Math.floor(c) : -1 != "=.".indexOf(a[b2 - 1]) && (c = -1 != "=.".indexOf(a[b2 - 2]) ? c - 2 : c - 1);
        var d = new Uint8Array(c), f2 = 0;
        Ea(a, function(h) {
          d[f2++] = h;
        });
        return d.subarray(0, f2);
      }
      function Ea(a, b2) {
        function c(B2) {
          for (; d < a.length; ) {
            var M = a.charAt(d++), La = x2[M];
            if (null != La) return La;
            if (!/^[\s\xa0]*$/.test(M)) throw Error("Unknown base64 encoding at char: " + M);
          }
          return B2;
        }
        Ca();
        for (var d = 0; ; ) {
          var f2 = c(-1), h = c(0), m2 = c(64), t = c(64);
          if (64 === t && -1 === f2) break;
          b2(f2 << 2 | h >> 4);
          64 != m2 && (b2(h << 4 & 240 | m2 >> 2), 64 != t && b2(m2 << 6 & 192 | t));
        }
      }
      function Ca() {
        if (!x2) {
          x2 = {};
          for (var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""), b2 = ["+/=", "+/", "-_=", "-_.", "-_"], c = 0; 5 > c; c++) {
            var d = a.concat(b2[c].split(""));
            Aa[c] = d;
            for (var f2 = 0; f2 < d.length; f2++) {
              var h = d[f2];
              void 0 === x2[h] && (x2[h] = f2);
            }
          }
        }
      }
      g("jspb.ConstBinaryMessage", function() {
      }, void 0);
      g("jspb.BinaryMessage", function() {
      }, void 0);
      g("jspb.BinaryConstants.FieldType", { yb: -1, ee: 1, FLOAT: 2, ke: 3, te: 4, je: 5, xb: 6, wb: 7, BOOL: 8, re: 9, ie: 10, le: 11, ce: 12, se: 13, ge: 14, me: 15, ne: 16, oe: 17, pe: 18, he: 30, ve: 31 }, void 0);
      g("jspb.BinaryConstants.WireType", { yb: -1, ue: 0, xb: 1, de: 2, qe: 3, fe: 4, wb: 5 }, void 0);
      g("jspb.BinaryConstants.FieldTypeToWireType", function(a) {
        switch (a) {
          case 5:
          case 3:
          case 13:
          case 4:
          case 17:
          case 18:
          case 8:
          case 14:
          case 31:
            return 0;
          case 1:
          case 6:
          case 16:
          case 30:
            return 1;
          case 9:
          case 11:
          case 12:
            return 2;
          case 2:
          case 7:
          case 15:
            return 5;
          default:
            return -1;
        }
      }, void 0);
      g("jspb.BinaryConstants.INVALID_FIELD_NUMBER", -1, void 0);
      g("jspb.BinaryConstants.FLOAT32_EPS", 1401298464324817e-60, void 0);
      g("jspb.BinaryConstants.FLOAT32_MIN", 11754943508222875e-54, void 0);
      g("jspb.BinaryConstants.FLOAT32_MAX", 34028234663852886e22, void 0);
      g("jspb.BinaryConstants.FLOAT64_EPS", 5e-324, void 0);
      g("jspb.BinaryConstants.FLOAT64_MIN", 22250738585072014e-324, void 0);
      g("jspb.BinaryConstants.FLOAT64_MAX", 17976931348623157e292, void 0);
      g("jspb.BinaryConstants.TWO_TO_20", 1048576, void 0);
      g("jspb.BinaryConstants.TWO_TO_23", 8388608, void 0);
      g("jspb.BinaryConstants.TWO_TO_31", 2147483648, void 0);
      g("jspb.BinaryConstants.TWO_TO_32", 4294967296, void 0);
      g("jspb.BinaryConstants.TWO_TO_52", 4503599627370496, void 0);
      g("jspb.BinaryConstants.TWO_TO_63", 9223372036854776e3, void 0);
      g("jspb.BinaryConstants.TWO_TO_64", 18446744073709552e3, void 0);
      g("jspb.BinaryConstants.ZERO_HASH", "\0\0\0\0\0\0\0\0", void 0);
      var y = 0;
      var z2 = 0;
      g("jspb.utils.getSplit64Low", function() {
        return y;
      }, void 0);
      g("jspb.utils.getSplit64High", function() {
        return z2;
      }, void 0);
      function Fa(a) {
        var b2 = a >>> 0;
        a = Math.floor((a - b2) / 4294967296) >>> 0;
        y = b2;
        z2 = a;
      }
      g("jspb.utils.splitUint64", Fa, void 0);
      function A2(a) {
        var b2 = 0 > a;
        a = Math.abs(a);
        var c = a >>> 0;
        a = Math.floor((a - c) / 4294967296);
        a >>>= 0;
        b2 && (a = ~a >>> 0, c = (~c >>> 0) + 1, 4294967295 < c && (c = 0, a++, 4294967295 < a && (a = 0)));
        y = c;
        z2 = a;
      }
      g("jspb.utils.splitInt64", A2, void 0);
      function Ga(a) {
        var b2 = 0 > a;
        a = 2 * Math.abs(a);
        Fa(a);
        a = y;
        var c = z2;
        b2 && (0 == a ? 0 == c ? c = a = 4294967295 : (c--, a = 4294967295) : a--);
        y = a;
        z2 = c;
      }
      g("jspb.utils.splitZigzag64", Ga, void 0);
      function Ha(a) {
        var b2 = 0 > a ? 1 : 0;
        a = b2 ? -a : a;
        if (0 === a) 0 < 1 / a ? y = z2 = 0 : (z2 = 0, y = 2147483648);
        else if (isNaN(a)) z2 = 0, y = 2147483647;
        else if (34028234663852886e22 < a) z2 = 0, y = (b2 << 31 | 2139095040) >>> 0;
        else if (11754943508222875e-54 > a) a = Math.round(a / Math.pow(2, -149)), z2 = 0, y = (b2 << 31 | a) >>> 0;
        else {
          var c = Math.floor(Math.log(a) / Math.LN2);
          a *= Math.pow(2, -c);
          a = Math.round(8388608 * a);
          16777216 <= a && ++c;
          z2 = 0;
          y = (b2 << 31 | c + 127 << 23 | a & 8388607) >>> 0;
        }
      }
      g("jspb.utils.splitFloat32", Ha, void 0);
      function Ia(a) {
        var b2 = 0 > a ? 1 : 0;
        a = b2 ? -a : a;
        if (0 === a) z2 = 0 < 1 / a ? 0 : 2147483648, y = 0;
        else if (isNaN(a)) z2 = 2147483647, y = 4294967295;
        else if (17976931348623157e292 < a) z2 = (b2 << 31 | 2146435072) >>> 0, y = 0;
        else if (22250738585072014e-324 > a) a /= Math.pow(2, -1074), z2 = (b2 << 31 | a / 4294967296) >>> 0, y = a >>> 0;
        else {
          var c = a, d = 0;
          if (2 <= c) for (; 2 <= c && 1023 > d; ) d++, c /= 2;
          else for (; 1 > c && -1022 < d; ) c *= 2, d--;
          a *= Math.pow(2, -d);
          z2 = (b2 << 31 | d + 1023 << 20 | 1048576 * a & 1048575) >>> 0;
          y = 4503599627370496 * a >>> 0;
        }
      }
      g("jspb.utils.splitFloat64", Ia, void 0);
      function C2(a) {
        var b2 = a.charCodeAt(4), c = a.charCodeAt(5), d = a.charCodeAt(6), f2 = a.charCodeAt(7);
        y = a.charCodeAt(0) + (a.charCodeAt(1) << 8) + (a.charCodeAt(2) << 16) + (a.charCodeAt(3) << 24) >>> 0;
        z2 = b2 + (c << 8) + (d << 16) + (f2 << 24) >>> 0;
      }
      g("jspb.utils.splitHash64", C2, void 0);
      function D2(a, b2) {
        return 4294967296 * b2 + (a >>> 0);
      }
      g("jspb.utils.joinUint64", D2, void 0);
      function E2(a, b2) {
        var c = b2 & 2147483648;
        c && (a = ~a + 1 >>> 0, b2 = ~b2 >>> 0, 0 == a && (b2 = b2 + 1 >>> 0));
        a = D2(a, b2);
        return c ? -a : a;
      }
      g("jspb.utils.joinInt64", E2, void 0);
      function Ja(a, b2, c) {
        var d = b2 >> 31;
        return c(a << 1 ^ d, (b2 << 1 | a >>> 31) ^ d);
      }
      g("jspb.utils.toZigzag64", Ja, void 0);
      function Ka(a, b2) {
        return Ma(a, b2, E2);
      }
      g("jspb.utils.joinZigzag64", Ka, void 0);
      function Ma(a, b2, c) {
        var d = -(a & 1);
        return c((a >>> 1 | b2 << 31) ^ d, b2 >>> 1 ^ d);
      }
      g("jspb.utils.fromZigzag64", Ma, void 0);
      function Na(a) {
        var b2 = 2 * (a >> 31) + 1, c = a >>> 23 & 255;
        a &= 8388607;
        return 255 == c ? a ? NaN : Infinity * b2 : 0 == c ? b2 * Math.pow(2, -149) * a : b2 * Math.pow(2, c - 150) * (a + Math.pow(2, 23));
      }
      g("jspb.utils.joinFloat32", Na, void 0);
      function Oa(a, b2) {
        var c = 2 * (b2 >> 31) + 1, d = b2 >>> 20 & 2047;
        a = 4294967296 * (b2 & 1048575) + a;
        return 2047 == d ? a ? NaN : Infinity * c : 0 == d ? c * Math.pow(2, -1074) * a : c * Math.pow(2, d - 1075) * (a + 4503599627370496);
      }
      g("jspb.utils.joinFloat64", Oa, void 0);
      function Pa(a, b2) {
        return String.fromCharCode(a >>> 0 & 255, a >>> 8 & 255, a >>> 16 & 255, a >>> 24 & 255, b2 >>> 0 & 255, b2 >>> 8 & 255, b2 >>> 16 & 255, b2 >>> 24 & 255);
      }
      g("jspb.utils.joinHash64", Pa, void 0);
      g("jspb.utils.DIGITS", "0123456789abcdef".split(""), void 0);
      function F(a, b2) {
        function c(f2, h) {
          f2 = f2 ? String(f2) : "";
          return h ? "0000000".slice(f2.length) + f2 : f2;
        }
        if (2097151 >= b2) return "" + D2(a, b2);
        var d = (a >>> 24 | b2 << 8) >>> 0 & 16777215;
        b2 = b2 >> 16 & 65535;
        a = (a & 16777215) + 6777216 * d + 6710656 * b2;
        d += 8147497 * b2;
        b2 *= 2;
        1e7 <= a && (d += Math.floor(a / 1e7), a %= 1e7);
        1e7 <= d && (b2 += Math.floor(d / 1e7), d %= 1e7);
        return c(b2, 0) + c(d, b2) + c(a, 1);
      }
      g("jspb.utils.joinUnsignedDecimalString", F, void 0);
      function G2(a, b2) {
        var c = b2 & 2147483648;
        c && (a = ~a + 1 >>> 0, b2 = ~b2 + (0 == a ? 1 : 0) >>> 0);
        a = F(a, b2);
        return c ? "-" + a : a;
      }
      g("jspb.utils.joinSignedDecimalString", G2, void 0);
      function Qa(a, b2) {
        C2(a);
        a = y;
        var c = z2;
        return b2 ? G2(a, c) : F(a, c);
      }
      g("jspb.utils.hash64ToDecimalString", Qa, void 0);
      g("jspb.utils.hash64ArrayToDecimalStrings", function(a, b2) {
        for (var c = Array(a.length), d = 0; d < a.length; d++) c[d] = Qa(a[d], b2);
        return c;
      }, void 0);
      function H2(a) {
        function b2(m2, t) {
          for (var B2 = 0; 8 > B2 && (1 !== m2 || 0 < t); B2++) t = m2 * f2[B2] + t, f2[B2] = t & 255, t >>>= 8;
        }
        function c() {
          for (var m2 = 0; 8 > m2; m2++) f2[m2] = ~f2[m2] & 255;
        }
        n(0 < a.length);
        var d = false;
        "-" === a[0] && (d = true, a = a.slice(1));
        for (var f2 = [0, 0, 0, 0, 0, 0, 0, 0], h = 0; h < a.length; h++) b2(10, a.charCodeAt(h) - 48);
        d && (c(), b2(1, 1));
        return xa(f2);
      }
      g("jspb.utils.decimalStringToHash64", H2, void 0);
      g("jspb.utils.splitDecimalString", function(a) {
        C2(H2(a));
      }, void 0);
      function Ra(a) {
        return String.fromCharCode(10 > a ? 48 + a : 87 + a);
      }
      function Sa(a) {
        return 97 <= a ? a - 97 + 10 : a - 48;
      }
      g("jspb.utils.hash64ToHexString", function(a) {
        var b2 = Array(18);
        b2[0] = "0";
        b2[1] = "x";
        for (var c = 0; 8 > c; c++) {
          var d = a.charCodeAt(7 - c);
          b2[2 * c + 2] = Ra(d >> 4);
          b2[2 * c + 3] = Ra(d & 15);
        }
        return b2.join("");
      }, void 0);
      g("jspb.utils.hexStringToHash64", function(a) {
        a = a.toLowerCase();
        n(18 == a.length);
        n("0" == a[0]);
        n("x" == a[1]);
        for (var b2 = "", c = 0; 8 > c; c++) b2 = String.fromCharCode(16 * Sa(a.charCodeAt(2 * c + 2)) + Sa(a.charCodeAt(2 * c + 3))) + b2;
        return b2;
      }, void 0);
      g("jspb.utils.hash64ToNumber", function(a, b2) {
        C2(a);
        a = y;
        var c = z2;
        return b2 ? E2(a, c) : D2(a, c);
      }, void 0);
      g("jspb.utils.numberToHash64", function(a) {
        A2(a);
        return Pa(y, z2);
      }, void 0);
      g("jspb.utils.countVarints", function(a, b2, c) {
        for (var d = 0, f2 = b2; f2 < c; f2++) d += a[f2] >> 7;
        return c - b2 - d;
      }, void 0);
      g("jspb.utils.countVarintFields", function(a, b2, c, d) {
        var f2 = 0;
        d *= 8;
        if (128 > d) for (; b2 < c && a[b2++] == d; ) for (f2++; ; ) {
          var h = a[b2++];
          if (0 == (h & 128)) break;
        }
        else for (; b2 < c; ) {
          for (h = d; 128 < h; ) {
            if (a[b2] != (h & 127 | 128)) return f2;
            b2++;
            h >>= 7;
          }
          if (a[b2++] != h) break;
          for (f2++; h = a[b2++], 0 != (h & 128); ) ;
        }
        return f2;
      }, void 0);
      function Ta(a, b2, c, d, f2) {
        var h = 0;
        if (128 > d) for (; b2 < c && a[b2++] == d; ) h++, b2 += f2;
        else for (; b2 < c; ) {
          for (var m2 = d; 128 < m2; ) {
            if (a[b2++] != (m2 & 127 | 128)) return h;
            m2 >>= 7;
          }
          if (a[b2++] != m2) break;
          h++;
          b2 += f2;
        }
        return h;
      }
      g("jspb.utils.countFixed32Fields", function(a, b2, c, d) {
        return Ta(a, b2, c, 8 * d + 5, 4);
      }, void 0);
      g("jspb.utils.countFixed64Fields", function(a, b2, c, d) {
        return Ta(a, b2, c, 8 * d + 1, 8);
      }, void 0);
      g("jspb.utils.countDelimitedFields", function(a, b2, c, d) {
        var f2 = 0;
        for (d = 8 * d + 2; b2 < c; ) {
          for (var h = d; 128 < h; ) {
            if (a[b2++] != (h & 127 | 128)) return f2;
            h >>= 7;
          }
          if (a[b2++] != h) break;
          f2++;
          for (var m2 = 0, t = 1; h = a[b2++], m2 += (h & 127) * t, t *= 128, 0 != (h & 128); ) ;
          b2 += m2;
        }
        return f2;
      }, void 0);
      g("jspb.utils.debugBytesToTextFormat", function(a) {
        var b2 = '"';
        if (a) {
          a = Ua(a);
          for (var c = 0; c < a.length; c++) b2 += "\\x", 16 > a[c] && (b2 += "0"), b2 += a[c].toString(16);
        }
        return b2 + '"';
      }, void 0);
      g("jspb.utils.debugScalarToTextFormat", function(a) {
        if ("string" === typeof a) {
          a = String(a);
          for (var b2 = ['"'], c = 0; c < a.length; c++) {
            var d = a.charAt(c), f2 = d.charCodeAt(0), h = c + 1, m2;
            if (!(m2 = ya[d])) {
              if (!(31 < f2 && 127 > f2)) if (f2 = d, f2 in za) d = za[f2];
              else if (f2 in ya) d = za[f2] = ya[f2];
              else {
                m2 = f2.charCodeAt(0);
                if (31 < m2 && 127 > m2) d = f2;
                else {
                  if (256 > m2) {
                    if (d = "\\x", 16 > m2 || 256 < m2) d += "0";
                  } else d = "\\u", 4096 > m2 && (d += "0");
                  d += m2.toString(16).toUpperCase();
                }
                d = za[f2] = d;
              }
              m2 = d;
            }
            b2[h] = m2;
          }
          b2.push('"');
          a = b2.join("");
        } else a = a.toString();
        return a;
      }, void 0);
      g("jspb.utils.stringToByteArray", function(a) {
        for (var b2 = new Uint8Array(a.length), c = 0; c < a.length; c++) {
          var d = a.charCodeAt(c);
          if (255 < d) throw Error("Conversion error: string contains codepoint outside of byte range");
          b2[c] = d;
        }
        return b2;
      }, void 0);
      function Ua(a) {
        if (a.constructor === Uint8Array) return a;
        if (a.constructor === ArrayBuffer) return new Uint8Array(a);
        if (a.constructor === Array) return new Uint8Array(a);
        if (a.constructor === String) return Da(a);
        if (a instanceof Uint8Array) return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
        p("Type not convertible to Uint8Array.");
        return new Uint8Array(0);
      }
      g("jspb.utils.byteSourceToUint8Array", Ua, void 0);
      function I2(a, b2, c) {
        this.b = null;
        this.a = this.c = this.h = 0;
        this.v = false;
        a && this.H(a, b2, c);
      }
      g("jspb.BinaryDecoder", I2, void 0);
      var Va = [];
      I2.getInstanceCacheLength = function() {
        return Va.length;
      };
      function Wa(a, b2, c) {
        if (Va.length) {
          var d = Va.pop();
          a && d.H(a, b2, c);
          return d;
        }
        return new I2(a, b2, c);
      }
      I2.alloc = Wa;
      I2.prototype.Ca = function() {
        this.clear();
        100 > Va.length && Va.push(this);
      };
      I2.prototype.free = I2.prototype.Ca;
      I2.prototype.clone = function() {
        return Wa(this.b, this.h, this.c - this.h);
      };
      I2.prototype.clone = I2.prototype.clone;
      I2.prototype.clear = function() {
        this.b = null;
        this.a = this.c = this.h = 0;
        this.v = false;
      };
      I2.prototype.clear = I2.prototype.clear;
      I2.prototype.Y = function() {
        return this.b;
      };
      I2.prototype.getBuffer = I2.prototype.Y;
      I2.prototype.H = function(a, b2, c) {
        this.b = Ua(a);
        this.h = void 0 !== b2 ? b2 : 0;
        this.c = void 0 !== c ? this.h + c : this.b.length;
        this.a = this.h;
      };
      I2.prototype.setBlock = I2.prototype.H;
      I2.prototype.Db = function() {
        return this.c;
      };
      I2.prototype.getEnd = I2.prototype.Db;
      I2.prototype.setEnd = function(a) {
        this.c = a;
      };
      I2.prototype.setEnd = I2.prototype.setEnd;
      I2.prototype.reset = function() {
        this.a = this.h;
      };
      I2.prototype.reset = I2.prototype.reset;
      I2.prototype.B = function() {
        return this.a;
      };
      I2.prototype.getCursor = I2.prototype.B;
      I2.prototype.Ma = function(a) {
        this.a = a;
      };
      I2.prototype.setCursor = I2.prototype.Ma;
      I2.prototype.advance = function(a) {
        this.a += a;
        n(this.a <= this.c);
      };
      I2.prototype.advance = I2.prototype.advance;
      I2.prototype.ya = function() {
        return this.a == this.c;
      };
      I2.prototype.atEnd = I2.prototype.ya;
      I2.prototype.Qb = function() {
        return this.a > this.c;
      };
      I2.prototype.pastEnd = I2.prototype.Qb;
      I2.prototype.getError = function() {
        return this.v || 0 > this.a || this.a > this.c;
      };
      I2.prototype.getError = I2.prototype.getError;
      I2.prototype.w = function(a) {
        for (var b2 = 128, c = 0, d = 0, f2 = 0; 4 > f2 && 128 <= b2; f2++) b2 = this.b[this.a++], c |= (b2 & 127) << 7 * f2;
        128 <= b2 && (b2 = this.b[this.a++], c |= (b2 & 127) << 28, d |= (b2 & 127) >> 4);
        if (128 <= b2) for (f2 = 0; 5 > f2 && 128 <= b2; f2++) b2 = this.b[this.a++], d |= (b2 & 127) << 7 * f2 + 3;
        if (128 > b2) return a(c >>> 0, d >>> 0);
        p("Failed to read varint, encoding is invalid.");
        this.v = true;
      };
      I2.prototype.readSplitVarint64 = I2.prototype.w;
      I2.prototype.ea = function(a) {
        return this.w(function(b2, c) {
          return Ma(b2, c, a);
        });
      };
      I2.prototype.readSplitZigzagVarint64 = I2.prototype.ea;
      I2.prototype.ta = function(a) {
        var b2 = this.b, c = this.a;
        this.a += 8;
        for (var d = 0, f2 = 0, h = c + 7; h >= c; h--) d = d << 8 | b2[h], f2 = f2 << 8 | b2[h + 4];
        return a(d, f2);
      };
      I2.prototype.readSplitFixed64 = I2.prototype.ta;
      I2.prototype.kb = function() {
        for (; this.b[this.a] & 128; ) this.a++;
        this.a++;
      };
      I2.prototype.skipVarint = I2.prototype.kb;
      I2.prototype.mb = function(a) {
        for (; 128 < a; ) this.a--, a >>>= 7;
        this.a--;
      };
      I2.prototype.unskipVarint = I2.prototype.mb;
      I2.prototype.o = function() {
        var a = this.b;
        var b2 = a[this.a];
        var c = b2 & 127;
        if (128 > b2) return this.a += 1, n(this.a <= this.c), c;
        b2 = a[this.a + 1];
        c |= (b2 & 127) << 7;
        if (128 > b2) return this.a += 2, n(this.a <= this.c), c;
        b2 = a[this.a + 2];
        c |= (b2 & 127) << 14;
        if (128 > b2) return this.a += 3, n(this.a <= this.c), c;
        b2 = a[this.a + 3];
        c |= (b2 & 127) << 21;
        if (128 > b2) return this.a += 4, n(this.a <= this.c), c;
        b2 = a[this.a + 4];
        c |= (b2 & 15) << 28;
        if (128 > b2) return this.a += 5, n(this.a <= this.c), c >>> 0;
        this.a += 5;
        128 <= a[this.a++] && 128 <= a[this.a++] && 128 <= a[this.a++] && 128 <= a[this.a++] && 128 <= a[this.a++] && n(false);
        n(this.a <= this.c);
        return c;
      };
      I2.prototype.readUnsignedVarint32 = I2.prototype.o;
      I2.prototype.da = function() {
        return ~~this.o();
      };
      I2.prototype.readSignedVarint32 = I2.prototype.da;
      I2.prototype.O = function() {
        return this.o().toString();
      };
      I2.prototype.Ea = function() {
        return this.da().toString();
      };
      I2.prototype.readSignedVarint32String = I2.prototype.Ea;
      I2.prototype.Ia = function() {
        var a = this.o();
        return a >>> 1 ^ -(a & 1);
      };
      I2.prototype.readZigzagVarint32 = I2.prototype.Ia;
      I2.prototype.Ga = function() {
        return this.w(D2);
      };
      I2.prototype.readUnsignedVarint64 = I2.prototype.Ga;
      I2.prototype.Ha = function() {
        return this.w(F);
      };
      I2.prototype.readUnsignedVarint64String = I2.prototype.Ha;
      I2.prototype.sa = function() {
        return this.w(E2);
      };
      I2.prototype.readSignedVarint64 = I2.prototype.sa;
      I2.prototype.Fa = function() {
        return this.w(G2);
      };
      I2.prototype.readSignedVarint64String = I2.prototype.Fa;
      I2.prototype.Ja = function() {
        return this.w(Ka);
      };
      I2.prototype.readZigzagVarint64 = I2.prototype.Ja;
      I2.prototype.fb = function() {
        return this.ea(Pa);
      };
      I2.prototype.readZigzagVarintHash64 = I2.prototype.fb;
      I2.prototype.Ka = function() {
        return this.ea(G2);
      };
      I2.prototype.readZigzagVarint64String = I2.prototype.Ka;
      I2.prototype.Gc = function() {
        var a = this.b[this.a];
        this.a += 1;
        n(this.a <= this.c);
        return a;
      };
      I2.prototype.readUint8 = I2.prototype.Gc;
      I2.prototype.Ec = function() {
        var a = this.b[this.a], b2 = this.b[this.a + 1];
        this.a += 2;
        n(this.a <= this.c);
        return a << 0 | b2 << 8;
      };
      I2.prototype.readUint16 = I2.prototype.Ec;
      I2.prototype.m = function() {
        var a = this.b[this.a], b2 = this.b[this.a + 1], c = this.b[this.a + 2], d = this.b[this.a + 3];
        this.a += 4;
        n(this.a <= this.c);
        return (a << 0 | b2 << 8 | c << 16 | d << 24) >>> 0;
      };
      I2.prototype.readUint32 = I2.prototype.m;
      I2.prototype.ga = function() {
        var a = this.m(), b2 = this.m();
        return D2(a, b2);
      };
      I2.prototype.readUint64 = I2.prototype.ga;
      I2.prototype.ha = function() {
        var a = this.m(), b2 = this.m();
        return F(a, b2);
      };
      I2.prototype.readUint64String = I2.prototype.ha;
      I2.prototype.Xb = function() {
        var a = this.b[this.a];
        this.a += 1;
        n(this.a <= this.c);
        return a << 24 >> 24;
      };
      I2.prototype.readInt8 = I2.prototype.Xb;
      I2.prototype.Vb = function() {
        var a = this.b[this.a], b2 = this.b[this.a + 1];
        this.a += 2;
        n(this.a <= this.c);
        return (a << 0 | b2 << 8) << 16 >> 16;
      };
      I2.prototype.readInt16 = I2.prototype.Vb;
      I2.prototype.P = function() {
        var a = this.b[this.a], b2 = this.b[this.a + 1], c = this.b[this.a + 2], d = this.b[this.a + 3];
        this.a += 4;
        n(this.a <= this.c);
        return a << 0 | b2 << 8 | c << 16 | d << 24;
      };
      I2.prototype.readInt32 = I2.prototype.P;
      I2.prototype.ba = function() {
        var a = this.m(), b2 = this.m();
        return E2(a, b2);
      };
      I2.prototype.readInt64 = I2.prototype.ba;
      I2.prototype.ca = function() {
        var a = this.m(), b2 = this.m();
        return G2(a, b2);
      };
      I2.prototype.readInt64String = I2.prototype.ca;
      I2.prototype.aa = function() {
        var a = this.m();
        return Na(a, 0);
      };
      I2.prototype.readFloat = I2.prototype.aa;
      I2.prototype.Z = function() {
        var a = this.m(), b2 = this.m();
        return Oa(a, b2);
      };
      I2.prototype.readDouble = I2.prototype.Z;
      I2.prototype.pa = function() {
        return !!this.b[this.a++];
      };
      I2.prototype.readBool = I2.prototype.pa;
      I2.prototype.ra = function() {
        return this.da();
      };
      I2.prototype.readEnum = I2.prototype.ra;
      I2.prototype.fa = function(a) {
        var b2 = this.b, c = this.a;
        a = c + a;
        for (var d = [], f2 = ""; c < a; ) {
          var h = b2[c++];
          if (128 > h) d.push(h);
          else if (192 > h) continue;
          else if (224 > h) {
            var m2 = b2[c++];
            d.push((h & 31) << 6 | m2 & 63);
          } else if (240 > h) {
            m2 = b2[c++];
            var t = b2[c++];
            d.push((h & 15) << 12 | (m2 & 63) << 6 | t & 63);
          } else if (248 > h) {
            m2 = b2[c++];
            t = b2[c++];
            var B2 = b2[c++];
            h = (h & 7) << 18 | (m2 & 63) << 12 | (t & 63) << 6 | B2 & 63;
            h -= 65536;
            d.push((h >> 10 & 1023) + 55296, (h & 1023) + 56320);
          }
          8192 <= d.length && (f2 += String.fromCharCode.apply(null, d), d.length = 0);
        }
        f2 += xa(d);
        this.a = c;
        return f2;
      };
      I2.prototype.readString = I2.prototype.fa;
      I2.prototype.Dc = function() {
        var a = this.o();
        return this.fa(a);
      };
      I2.prototype.readStringWithLength = I2.prototype.Dc;
      I2.prototype.qa = function(a) {
        if (0 > a || this.a + a > this.b.length) return this.v = true, p("Invalid byte length!"), new Uint8Array(0);
        var b2 = this.b.subarray(this.a, this.a + a);
        this.a += a;
        n(this.a <= this.c);
        return b2;
      };
      I2.prototype.readBytes = I2.prototype.qa;
      I2.prototype.ia = function() {
        return this.w(Pa);
      };
      I2.prototype.readVarintHash64 = I2.prototype.ia;
      I2.prototype.$ = function() {
        var a = this.b, b2 = this.a, c = a[b2], d = a[b2 + 1], f2 = a[b2 + 2], h = a[b2 + 3], m2 = a[b2 + 4], t = a[b2 + 5], B2 = a[b2 + 6];
        a = a[b2 + 7];
        this.a += 8;
        return String.fromCharCode(c, d, f2, h, m2, t, B2, a);
      };
      I2.prototype.readFixedHash64 = I2.prototype.$;
      function J2(a, b2, c) {
        this.a = Wa(a, b2, c);
        this.O = this.a.B();
        this.b = this.c = -1;
        this.h = false;
        this.v = null;
      }
      g("jspb.BinaryReader", J2, void 0);
      var K2 = [];
      J2.clearInstanceCache = function() {
        K2 = [];
      };
      J2.getInstanceCacheLength = function() {
        return K2.length;
      };
      function Xa(a, b2, c) {
        if (K2.length) {
          var d = K2.pop();
          a && d.a.H(a, b2, c);
          return d;
        }
        return new J2(a, b2, c);
      }
      J2.alloc = Xa;
      J2.prototype.zb = Xa;
      J2.prototype.alloc = J2.prototype.zb;
      J2.prototype.Ca = function() {
        this.a.clear();
        this.b = this.c = -1;
        this.h = false;
        this.v = null;
        100 > K2.length && K2.push(this);
      };
      J2.prototype.free = J2.prototype.Ca;
      J2.prototype.Fb = function() {
        return this.O;
      };
      J2.prototype.getFieldCursor = J2.prototype.Fb;
      J2.prototype.B = function() {
        return this.a.B();
      };
      J2.prototype.getCursor = J2.prototype.B;
      J2.prototype.Y = function() {
        return this.a.Y();
      };
      J2.prototype.getBuffer = J2.prototype.Y;
      J2.prototype.Hb = function() {
        return this.c;
      };
      J2.prototype.getFieldNumber = J2.prototype.Hb;
      J2.prototype.Lb = function() {
        return this.b;
      };
      J2.prototype.getWireType = J2.prototype.Lb;
      J2.prototype.Mb = function() {
        return 2 == this.b;
      };
      J2.prototype.isDelimited = J2.prototype.Mb;
      J2.prototype.bb = function() {
        return 4 == this.b;
      };
      J2.prototype.isEndGroup = J2.prototype.bb;
      J2.prototype.getError = function() {
        return this.h || this.a.getError();
      };
      J2.prototype.getError = J2.prototype.getError;
      J2.prototype.H = function(a, b2, c) {
        this.a.H(a, b2, c);
        this.b = this.c = -1;
      };
      J2.prototype.setBlock = J2.prototype.H;
      J2.prototype.reset = function() {
        this.a.reset();
        this.b = this.c = -1;
      };
      J2.prototype.reset = J2.prototype.reset;
      J2.prototype.advance = function(a) {
        this.a.advance(a);
      };
      J2.prototype.advance = J2.prototype.advance;
      J2.prototype.oa = function() {
        if (this.a.ya()) return false;
        if (this.getError()) return p("Decoder hit an error"), false;
        this.O = this.a.B();
        var a = this.a.o(), b2 = a >>> 3;
        a &= 7;
        if (0 != a && 5 != a && 1 != a && 2 != a && 3 != a && 4 != a) return p("Invalid wire type: %s (at position %s)", a, this.O), this.h = true, false;
        this.c = b2;
        this.b = a;
        return true;
      };
      J2.prototype.nextField = J2.prototype.oa;
      J2.prototype.Oa = function() {
        this.a.mb(this.c << 3 | this.b);
      };
      J2.prototype.unskipHeader = J2.prototype.Oa;
      J2.prototype.Lc = function() {
        var a = this.c;
        for (this.Oa(); this.oa() && this.c == a; ) this.C();
        this.a.ya() || this.Oa();
      };
      J2.prototype.skipMatchingFields = J2.prototype.Lc;
      J2.prototype.lb = function() {
        0 != this.b ? (p("Invalid wire type for skipVarintField"), this.C()) : this.a.kb();
      };
      J2.prototype.skipVarintField = J2.prototype.lb;
      J2.prototype.gb = function() {
        if (2 != this.b) p("Invalid wire type for skipDelimitedField"), this.C();
        else {
          var a = this.a.o();
          this.a.advance(a);
        }
      };
      J2.prototype.skipDelimitedField = J2.prototype.gb;
      J2.prototype.hb = function() {
        5 != this.b ? (p("Invalid wire type for skipFixed32Field"), this.C()) : this.a.advance(4);
      };
      J2.prototype.skipFixed32Field = J2.prototype.hb;
      J2.prototype.ib = function() {
        1 != this.b ? (p("Invalid wire type for skipFixed64Field"), this.C()) : this.a.advance(8);
      };
      J2.prototype.skipFixed64Field = J2.prototype.ib;
      J2.prototype.jb = function() {
        var a = this.c;
        do {
          if (!this.oa()) {
            p("Unmatched start-group tag: stream EOF");
            this.h = true;
            break;
          }
          if (4 == this.b) {
            this.c != a && (p("Unmatched end-group tag"), this.h = true);
            break;
          }
          this.C();
        } while (1);
      };
      J2.prototype.skipGroup = J2.prototype.jb;
      J2.prototype.C = function() {
        switch (this.b) {
          case 0:
            this.lb();
            break;
          case 1:
            this.ib();
            break;
          case 2:
            this.gb();
            break;
          case 5:
            this.hb();
            break;
          case 3:
            this.jb();
            break;
          default:
            p("Invalid wire encoding for field.");
        }
      };
      J2.prototype.skipField = J2.prototype.C;
      J2.prototype.Hc = function(a, b2) {
        null === this.v && (this.v = {});
        n(!this.v[a]);
        this.v[a] = b2;
      };
      J2.prototype.registerReadCallback = J2.prototype.Hc;
      J2.prototype.Ic = function(a) {
        n(null !== this.v);
        a = this.v[a];
        n(a);
        return a(this);
      };
      J2.prototype.runReadCallback = J2.prototype.Ic;
      J2.prototype.Yb = function(a, b2) {
        n(2 == this.b);
        var c = this.a.c, d = this.a.o();
        d = this.a.B() + d;
        this.a.setEnd(d);
        b2(a, this);
        this.a.Ma(d);
        this.a.setEnd(c);
      };
      J2.prototype.readMessage = J2.prototype.Yb;
      J2.prototype.Ub = function(a, b2, c) {
        n(3 == this.b);
        n(this.c == a);
        c(b2, this);
        this.h || 4 == this.b || (p("Group submessage did not end with an END_GROUP tag"), this.h = true);
      };
      J2.prototype.readGroup = J2.prototype.Ub;
      J2.prototype.Gb = function() {
        n(2 == this.b);
        var a = this.a.o(), b2 = this.a.B(), c = b2 + a;
        a = Wa(this.a.Y(), b2, a);
        this.a.Ma(c);
        return a;
      };
      J2.prototype.getFieldDecoder = J2.prototype.Gb;
      J2.prototype.P = function() {
        n(0 == this.b);
        return this.a.da();
      };
      J2.prototype.readInt32 = J2.prototype.P;
      J2.prototype.Wb = function() {
        n(0 == this.b);
        return this.a.Ea();
      };
      J2.prototype.readInt32String = J2.prototype.Wb;
      J2.prototype.ba = function() {
        n(0 == this.b);
        return this.a.sa();
      };
      J2.prototype.readInt64 = J2.prototype.ba;
      J2.prototype.ca = function() {
        n(0 == this.b);
        return this.a.Fa();
      };
      J2.prototype.readInt64String = J2.prototype.ca;
      J2.prototype.m = function() {
        n(0 == this.b);
        return this.a.o();
      };
      J2.prototype.readUint32 = J2.prototype.m;
      J2.prototype.Fc = function() {
        n(0 == this.b);
        return this.a.O();
      };
      J2.prototype.readUint32String = J2.prototype.Fc;
      J2.prototype.ga = function() {
        n(0 == this.b);
        return this.a.Ga();
      };
      J2.prototype.readUint64 = J2.prototype.ga;
      J2.prototype.ha = function() {
        n(0 == this.b);
        return this.a.Ha();
      };
      J2.prototype.readUint64String = J2.prototype.ha;
      J2.prototype.zc = function() {
        n(0 == this.b);
        return this.a.Ia();
      };
      J2.prototype.readSint32 = J2.prototype.zc;
      J2.prototype.Ac = function() {
        n(0 == this.b);
        return this.a.Ja();
      };
      J2.prototype.readSint64 = J2.prototype.Ac;
      J2.prototype.Bc = function() {
        n(0 == this.b);
        return this.a.Ka();
      };
      J2.prototype.readSint64String = J2.prototype.Bc;
      J2.prototype.Rb = function() {
        n(5 == this.b);
        return this.a.m();
      };
      J2.prototype.readFixed32 = J2.prototype.Rb;
      J2.prototype.Sb = function() {
        n(1 == this.b);
        return this.a.ga();
      };
      J2.prototype.readFixed64 = J2.prototype.Sb;
      J2.prototype.Tb = function() {
        n(1 == this.b);
        return this.a.ha();
      };
      J2.prototype.readFixed64String = J2.prototype.Tb;
      J2.prototype.vc = function() {
        n(5 == this.b);
        return this.a.P();
      };
      J2.prototype.readSfixed32 = J2.prototype.vc;
      J2.prototype.wc = function() {
        n(5 == this.b);
        return this.a.P().toString();
      };
      J2.prototype.readSfixed32String = J2.prototype.wc;
      J2.prototype.xc = function() {
        n(1 == this.b);
        return this.a.ba();
      };
      J2.prototype.readSfixed64 = J2.prototype.xc;
      J2.prototype.yc = function() {
        n(1 == this.b);
        return this.a.ca();
      };
      J2.prototype.readSfixed64String = J2.prototype.yc;
      J2.prototype.aa = function() {
        n(5 == this.b);
        return this.a.aa();
      };
      J2.prototype.readFloat = J2.prototype.aa;
      J2.prototype.Z = function() {
        n(1 == this.b);
        return this.a.Z();
      };
      J2.prototype.readDouble = J2.prototype.Z;
      J2.prototype.pa = function() {
        n(0 == this.b);
        return !!this.a.o();
      };
      J2.prototype.readBool = J2.prototype.pa;
      J2.prototype.ra = function() {
        n(0 == this.b);
        return this.a.sa();
      };
      J2.prototype.readEnum = J2.prototype.ra;
      J2.prototype.fa = function() {
        n(2 == this.b);
        var a = this.a.o();
        return this.a.fa(a);
      };
      J2.prototype.readString = J2.prototype.fa;
      J2.prototype.qa = function() {
        n(2 == this.b);
        var a = this.a.o();
        return this.a.qa(a);
      };
      J2.prototype.readBytes = J2.prototype.qa;
      J2.prototype.ia = function() {
        n(0 == this.b);
        return this.a.ia();
      };
      J2.prototype.readVarintHash64 = J2.prototype.ia;
      J2.prototype.Cc = function() {
        n(0 == this.b);
        return this.a.fb();
      };
      J2.prototype.readSintHash64 = J2.prototype.Cc;
      J2.prototype.w = function(a) {
        n(0 == this.b);
        return this.a.w(a);
      };
      J2.prototype.readSplitVarint64 = J2.prototype.w;
      J2.prototype.ea = function(a) {
        n(0 == this.b);
        return this.a.w(function(b2, c) {
          return Ma(b2, c, a);
        });
      };
      J2.prototype.readSplitZigzagVarint64 = J2.prototype.ea;
      J2.prototype.$ = function() {
        n(1 == this.b);
        return this.a.$();
      };
      J2.prototype.readFixedHash64 = J2.prototype.$;
      J2.prototype.ta = function(a) {
        n(1 == this.b);
        return this.a.ta(a);
      };
      J2.prototype.readSplitFixed64 = J2.prototype.ta;
      function L2(a, b2) {
        n(2 == a.b);
        var c = a.a.o();
        c = a.a.B() + c;
        for (var d = []; a.a.B() < c; ) d.push(b2.call(a.a));
        return d;
      }
      J2.prototype.gc = function() {
        return L2(this, this.a.da);
      };
      J2.prototype.readPackedInt32 = J2.prototype.gc;
      J2.prototype.hc = function() {
        return L2(this, this.a.Ea);
      };
      J2.prototype.readPackedInt32String = J2.prototype.hc;
      J2.prototype.ic = function() {
        return L2(this, this.a.sa);
      };
      J2.prototype.readPackedInt64 = J2.prototype.ic;
      J2.prototype.jc = function() {
        return L2(this, this.a.Fa);
      };
      J2.prototype.readPackedInt64String = J2.prototype.jc;
      J2.prototype.qc = function() {
        return L2(this, this.a.o);
      };
      J2.prototype.readPackedUint32 = J2.prototype.qc;
      J2.prototype.rc = function() {
        return L2(this, this.a.O);
      };
      J2.prototype.readPackedUint32String = J2.prototype.rc;
      J2.prototype.sc = function() {
        return L2(this, this.a.Ga);
      };
      J2.prototype.readPackedUint64 = J2.prototype.sc;
      J2.prototype.tc = function() {
        return L2(this, this.a.Ha);
      };
      J2.prototype.readPackedUint64String = J2.prototype.tc;
      J2.prototype.nc = function() {
        return L2(this, this.a.Ia);
      };
      J2.prototype.readPackedSint32 = J2.prototype.nc;
      J2.prototype.oc = function() {
        return L2(this, this.a.Ja);
      };
      J2.prototype.readPackedSint64 = J2.prototype.oc;
      J2.prototype.pc = function() {
        return L2(this, this.a.Ka);
      };
      J2.prototype.readPackedSint64String = J2.prototype.pc;
      J2.prototype.bc = function() {
        return L2(this, this.a.m);
      };
      J2.prototype.readPackedFixed32 = J2.prototype.bc;
      J2.prototype.cc = function() {
        return L2(this, this.a.ga);
      };
      J2.prototype.readPackedFixed64 = J2.prototype.cc;
      J2.prototype.dc = function() {
        return L2(this, this.a.ha);
      };
      J2.prototype.readPackedFixed64String = J2.prototype.dc;
      J2.prototype.kc = function() {
        return L2(this, this.a.P);
      };
      J2.prototype.readPackedSfixed32 = J2.prototype.kc;
      J2.prototype.lc = function() {
        return L2(this, this.a.ba);
      };
      J2.prototype.readPackedSfixed64 = J2.prototype.lc;
      J2.prototype.mc = function() {
        return L2(this, this.a.ca);
      };
      J2.prototype.readPackedSfixed64String = J2.prototype.mc;
      J2.prototype.fc = function() {
        return L2(this, this.a.aa);
      };
      J2.prototype.readPackedFloat = J2.prototype.fc;
      J2.prototype.$b = function() {
        return L2(this, this.a.Z);
      };
      J2.prototype.readPackedDouble = J2.prototype.$b;
      J2.prototype.Zb = function() {
        return L2(this, this.a.pa);
      };
      J2.prototype.readPackedBool = J2.prototype.Zb;
      J2.prototype.ac = function() {
        return L2(this, this.a.ra);
      };
      J2.prototype.readPackedEnum = J2.prototype.ac;
      J2.prototype.uc = function() {
        return L2(this, this.a.ia);
      };
      J2.prototype.readPackedVarintHash64 = J2.prototype.uc;
      J2.prototype.ec = function() {
        return L2(this, this.a.$);
      };
      J2.prototype.readPackedFixedHash64 = J2.prototype.ec;
      function Ya(a, b2, c, d, f2) {
        this.ma = a;
        this.Ba = b2;
        this.la = c;
        this.Na = d;
        this.na = f2;
      }
      g("jspb.ExtensionFieldInfo", Ya, void 0);
      function Za(a, b2, c, d, f2, h) {
        this.Za = a;
        this.za = b2;
        this.Aa = c;
        this.Wa = d;
        this.Ab = f2;
        this.Nb = h;
      }
      g("jspb.ExtensionFieldBinaryInfo", Za, void 0);
      Ya.prototype.F = function() {
        return !!this.la;
      };
      Ya.prototype.isMessageType = Ya.prototype.F;
      function N2() {
      }
      g("jspb.Message", N2, void 0);
      N2.GENERATE_TO_OBJECT = true;
      N2.GENERATE_FROM_OBJECT = true;
      var $a = "function" == typeof Uint8Array;
      N2.prototype.Ib = function() {
        return this.b;
      };
      N2.prototype.getJsPbMessageId = N2.prototype.Ib;
      N2.initialize = function(a, b2, c, d, f2, h) {
        a.f = null;
        b2 || (b2 = c ? [c] : []);
        a.b = c ? String(c) : void 0;
        a.D = 0 === c ? -1 : 0;
        a.u = b2;
        a: {
          c = a.u.length;
          b2 = -1;
          if (c && (b2 = c - 1, c = a.u[b2], !(null === c || "object" != typeof c || Array.isArray(c) || $a && c instanceof Uint8Array))) {
            a.G = b2 - a.D;
            a.i = c;
            break a;
          }
          -1 < d ? (a.G = Math.max(d, b2 + 1 - a.D), a.i = null) : a.G = Number.MAX_VALUE;
        }
        a.a = {};
        if (f2) for (d = 0; d < f2.length; d++) b2 = f2[d], b2 < a.G ? (b2 += a.D, a.u[b2] = a.u[b2] || ab) : (bb(a), a.i[b2] = a.i[b2] || ab);
        if (h && h.length) for (d = 0; d < h.length; d++) cb(a, h[d]);
      };
      var ab = Object.freeze ? Object.freeze([]) : [];
      function bb(a) {
        var b2 = a.G + a.D;
        a.u[b2] || (a.i = a.u[b2] = {});
      }
      function db(a, b2, c) {
        for (var d = [], f2 = 0; f2 < a.length; f2++) d[f2] = b2.call(a[f2], c, a[f2]);
        return d;
      }
      N2.toObjectList = db;
      N2.toObjectExtension = function(a, b2, c, d, f2) {
        for (var h in c) {
          var m2 = c[h], t = d.call(a, m2);
          if (null != t) {
            for (var B2 in m2.Ba) if (m2.Ba.hasOwnProperty(B2)) break;
            b2[B2] = m2.Na ? m2.na ? db(t, m2.Na, f2) : m2.Na(f2, t) : t;
          }
        }
      };
      N2.serializeBinaryExtensions = function(a, b2, c, d) {
        for (var f2 in c) {
          var h = c[f2], m2 = h.Za;
          if (!h.Aa) throw Error("Message extension present that was generated without binary serialization support");
          var t = d.call(a, m2);
          if (null != t) if (m2.F()) if (h.Wa) h.Aa.call(b2, m2.ma, t, h.Wa);
          else throw Error("Message extension present holding submessage without binary support enabled, and message is being serialized to binary format");
          else h.Aa.call(b2, m2.ma, t);
        }
      };
      N2.readBinaryExtension = function(a, b2, c, d, f2) {
        var h = c[b2.c];
        if (h) {
          c = h.Za;
          if (!h.za) throw Error("Deserializing extension whose generated code does not support binary format");
          if (c.F()) {
            var m2 = new c.la();
            h.za.call(b2, m2, h.Ab);
          } else m2 = h.za.call(b2);
          c.na && !h.Nb ? (b2 = d.call(a, c)) ? b2.push(m2) : f2.call(a, c, [m2]) : f2.call(a, c, m2);
        } else b2.C();
      };
      function O(a, b2) {
        if (b2 < a.G) {
          b2 += a.D;
          var c = a.u[b2];
          return c === ab ? a.u[b2] = [] : c;
        }
        if (a.i) return c = a.i[b2], c === ab ? a.i[b2] = [] : c;
      }
      N2.getField = O;
      N2.getRepeatedField = function(a, b2) {
        return O(a, b2);
      };
      function eb(a, b2) {
        a = O(a, b2);
        return null == a ? a : +a;
      }
      N2.getOptionalFloatingPointField = eb;
      function fb(a, b2) {
        a = O(a, b2);
        return null == a ? a : !!a;
      }
      N2.getBooleanField = fb;
      N2.getRepeatedFloatingPointField = function(a, b2) {
        var c = O(a, b2);
        a.a || (a.a = {});
        if (!a.a[b2]) {
          for (var d = 0; d < c.length; d++) c[d] = +c[d];
          a.a[b2] = true;
        }
        return c;
      };
      N2.getRepeatedBooleanField = function(a, b2) {
        var c = O(a, b2);
        a.a || (a.a = {});
        if (!a.a[b2]) {
          for (var d = 0; d < c.length; d++) c[d] = !!c[d];
          a.a[b2] = true;
        }
        return c;
      };
      function gb(a) {
        if (null == a || "string" === typeof a) return a;
        if ($a && a instanceof Uint8Array) return Ba(a);
        p("Cannot coerce to b64 string: " + k2(a));
        return null;
      }
      N2.bytesAsB64 = gb;
      function hb(a) {
        if (null == a || a instanceof Uint8Array) return a;
        if ("string" === typeof a) return Da(a);
        p("Cannot coerce to Uint8Array: " + k2(a));
        return null;
      }
      N2.bytesAsU8 = hb;
      N2.bytesListAsB64 = function(a) {
        ib(a);
        return a.length && "string" !== typeof a[0] ? l(a, gb) : a;
      };
      N2.bytesListAsU8 = function(a) {
        ib(a);
        return !a.length || a[0] instanceof Uint8Array ? a : l(a, hb);
      };
      function ib(a) {
        if (a && 1 < a.length) {
          var b2 = k2(a[0]);
          qa(a, function(c) {
            k2(c) != b2 && p("Inconsistent type in JSPB repeated field array. Got " + k2(c) + " expected " + b2);
          });
        }
      }
      function jb(a, b2, c) {
        a = O(a, b2);
        return null == a ? c : a;
      }
      N2.getFieldWithDefault = jb;
      N2.getBooleanFieldWithDefault = function(a, b2, c) {
        a = fb(a, b2);
        return null == a ? c : a;
      };
      N2.getFloatingPointFieldWithDefault = function(a, b2, c) {
        a = eb(a, b2);
        return null == a ? c : a;
      };
      N2.getFieldProto3 = jb;
      N2.getMapField = function(a, b2, c, d) {
        a.f || (a.f = {});
        if (b2 in a.f) return a.f[b2];
        var f2 = O(a, b2);
        if (!f2) {
          if (c) return;
          f2 = [];
          P2(a, b2, f2);
        }
        return a.f[b2] = new r(f2, d);
      };
      function P2(a, b2, c) {
        q2(a, N2);
        b2 < a.G ? a.u[b2 + a.D] = c : (bb(a), a.i[b2] = c);
        return a;
      }
      N2.setField = P2;
      N2.setProto3IntField = function(a, b2, c) {
        return Q2(a, b2, c, 0);
      };
      N2.setProto3FloatField = function(a, b2, c) {
        return Q2(a, b2, c, 0);
      };
      N2.setProto3BooleanField = function(a, b2, c) {
        return Q2(a, b2, c, false);
      };
      N2.setProto3StringField = function(a, b2, c) {
        return Q2(a, b2, c, "");
      };
      N2.setProto3BytesField = function(a, b2, c) {
        return Q2(a, b2, c, "");
      };
      N2.setProto3EnumField = function(a, b2, c) {
        return Q2(a, b2, c, 0);
      };
      N2.setProto3StringIntField = function(a, b2, c) {
        return Q2(a, b2, c, "0");
      };
      function Q2(a, b2, c, d) {
        q2(a, N2);
        c !== d ? P2(a, b2, c) : b2 < a.G ? a.u[b2 + a.D] = null : (bb(a), delete a.i[b2]);
        return a;
      }
      N2.addToRepeatedField = function(a, b2, c, d) {
        q2(a, N2);
        b2 = O(a, b2);
        void 0 != d ? b2.splice(d, 0, c) : b2.push(c);
        return a;
      };
      function kb(a, b2, c, d) {
        q2(a, N2);
        (c = cb(a, c)) && c !== b2 && void 0 !== d && (a.f && c in a.f && (a.f[c] = void 0), P2(a, c, void 0));
        return P2(a, b2, d);
      }
      N2.setOneofField = kb;
      function cb(a, b2) {
        for (var c, d, f2 = 0; f2 < b2.length; f2++) {
          var h = b2[f2], m2 = O(a, h);
          null != m2 && (c = h, d = m2, P2(a, h, void 0));
        }
        return c ? (P2(a, c, d), c) : 0;
      }
      N2.computeOneofCase = cb;
      N2.getWrapperField = function(a, b2, c, d) {
        a.f || (a.f = {});
        if (!a.f[c]) {
          var f2 = O(a, c);
          if (d || f2) a.f[c] = new b2(f2);
        }
        return a.f[c];
      };
      N2.getRepeatedWrapperField = function(a, b2, c) {
        lb(a, b2, c);
        b2 = a.f[c];
        b2 == ab && (b2 = a.f[c] = []);
        return b2;
      };
      function lb(a, b2, c) {
        a.f || (a.f = {});
        if (!a.f[c]) {
          for (var d = O(a, c), f2 = [], h = 0; h < d.length; h++) f2[h] = new b2(d[h]);
          a.f[c] = f2;
        }
      }
      N2.setWrapperField = function(a, b2, c) {
        q2(a, N2);
        a.f || (a.f = {});
        var d = c ? c.g() : c;
        a.f[b2] = c;
        return P2(a, b2, d);
      };
      N2.setOneofWrapperField = function(a, b2, c, d) {
        q2(a, N2);
        a.f || (a.f = {});
        var f2 = d ? d.g() : d;
        a.f[b2] = d;
        return kb(a, b2, c, f2);
      };
      N2.setRepeatedWrapperField = function(a, b2, c) {
        q2(a, N2);
        a.f || (a.f = {});
        c = c || [];
        for (var d = [], f2 = 0; f2 < c.length; f2++) d[f2] = c[f2].g();
        a.f[b2] = c;
        return P2(a, b2, d);
      };
      N2.addToRepeatedWrapperField = function(a, b2, c, d, f2) {
        lb(a, d, b2);
        var h = a.f[b2];
        h || (h = a.f[b2] = []);
        c = c ? c : new d();
        a = O(a, b2);
        void 0 != f2 ? (h.splice(f2, 0, c), a.splice(f2, 0, c.g())) : (h.push(c), a.push(c.g()));
        return c;
      };
      N2.toMap = function(a, b2, c, d) {
        for (var f2 = {}, h = 0; h < a.length; h++) f2[b2.call(a[h])] = c ? c.call(a[h], d, a[h]) : a[h];
        return f2;
      };
      function mb(a) {
        if (a.f) for (var b2 in a.f) {
          var c = a.f[b2];
          if (Array.isArray(c)) for (var d = 0; d < c.length; d++) c[d] && c[d].g();
          else c && c.g();
        }
      }
      N2.prototype.g = function() {
        mb(this);
        return this.u;
      };
      N2.prototype.toArray = N2.prototype.g;
      N2.prototype.toString = function() {
        mb(this);
        return this.u.toString();
      };
      N2.prototype.getExtension = function(a) {
        if (this.i) {
          this.f || (this.f = {});
          var b2 = a.ma;
          if (a.na) {
            if (a.F()) return this.f[b2] || (this.f[b2] = l(this.i[b2] || [], function(c) {
              return new a.la(c);
            })), this.f[b2];
          } else if (a.F()) return !this.f[b2] && this.i[b2] && (this.f[b2] = new a.la(this.i[b2])), this.f[b2];
          return this.i[b2];
        }
      };
      N2.prototype.getExtension = N2.prototype.getExtension;
      N2.prototype.Kc = function(a, b2) {
        this.f || (this.f = {});
        bb(this);
        var c = a.ma;
        a.na ? (b2 = b2 || [], a.F() ? (this.f[c] = b2, this.i[c] = l(b2, function(d) {
          return d.g();
        })) : this.i[c] = b2) : a.F() ? (this.f[c] = b2, this.i[c] = b2 ? b2.g() : b2) : this.i[c] = b2;
        return this;
      };
      N2.prototype.setExtension = N2.prototype.Kc;
      N2.difference = function(a, b2) {
        if (!(a instanceof b2.constructor)) throw Error("Messages have different types.");
        var c = a.g();
        b2 = b2.g();
        var d = [], f2 = 0, h = c.length > b2.length ? c.length : b2.length;
        a.b && (d[0] = a.b, f2 = 1);
        for (; f2 < h; f2++) nb(c[f2], b2[f2]) || (d[f2] = b2[f2]);
        return new a.constructor(d);
      };
      N2.equals = function(a, b2) {
        return a == b2 || !(!a || !b2) && a instanceof b2.constructor && nb(a.g(), b2.g());
      };
      function ob(a, b2) {
        a = a || {};
        b2 = b2 || {};
        var c = {}, d;
        for (d in a) c[d] = 0;
        for (d in b2) c[d] = 0;
        for (d in c) if (!nb(a[d], b2[d])) return false;
        return true;
      }
      N2.compareExtensions = ob;
      function nb(a, b2) {
        if (a == b2) return true;
        if (!la(a) || !la(b2)) return "number" === typeof a && isNaN(a) || "number" === typeof b2 && isNaN(b2) ? String(a) == String(b2) : false;
        if (a.constructor != b2.constructor) return false;
        if ($a && a.constructor === Uint8Array) {
          if (a.length != b2.length) return false;
          for (var c = 0; c < a.length; c++) if (a[c] != b2[c]) return false;
          return true;
        }
        if (a.constructor === Array) {
          var d = void 0, f2 = void 0, h = Math.max(a.length, b2.length);
          for (c = 0; c < h; c++) {
            var m2 = a[c], t = b2[c];
            m2 && m2.constructor == Object && (n(void 0 === d), n(c === a.length - 1), d = m2, m2 = void 0);
            t && t.constructor == Object && (n(void 0 === f2), n(c === b2.length - 1), f2 = t, t = void 0);
            if (!nb(m2, t)) return false;
          }
          return d || f2 ? (d = d || {}, f2 = f2 || {}, ob(d, f2)) : true;
        }
        if (a.constructor === Object) return ob(a, b2);
        throw Error("Invalid type in JSPB array");
      }
      N2.compareFields = nb;
      N2.prototype.Bb = function() {
        return pb(this);
      };
      N2.prototype.cloneMessage = N2.prototype.Bb;
      N2.prototype.clone = function() {
        return pb(this);
      };
      N2.prototype.clone = N2.prototype.clone;
      N2.clone = function(a) {
        return pb(a);
      };
      function pb(a) {
        return new a.constructor(qb(a.g()));
      }
      N2.copyInto = function(a, b2) {
        q2(a, N2);
        q2(b2, N2);
        n(a.constructor == b2.constructor, "Copy source and target message should have the same type.");
        a = pb(a);
        for (var c = b2.g(), d = a.g(), f2 = c.length = 0; f2 < d.length; f2++) c[f2] = d[f2];
        b2.f = a.f;
        b2.i = a.i;
      };
      function qb(a) {
        if (Array.isArray(a)) {
          for (var b2 = Array(a.length), c = 0; c < a.length; c++) {
            var d = a[c];
            null != d && (b2[c] = "object" == typeof d ? qb(n(d)) : d);
          }
          return b2;
        }
        if ($a && a instanceof Uint8Array) return new Uint8Array(a);
        b2 = {};
        for (c in a) d = a[c], null != d && (b2[c] = "object" == typeof d ? qb(n(d)) : d);
        return b2;
      }
      N2.registerMessageType = function(a, b2) {
        b2.we = a;
      };
      var R2 = { dump: function(a) {
        q2(a, N2, "jspb.Message instance expected");
        n(a.getExtension, "Only unobfuscated and unoptimized compilation modes supported.");
        return R2.X(a);
      } };
      g("jspb.debug.dump", R2.dump, void 0);
      R2.X = function(a) {
        var b2 = k2(a);
        if ("number" == b2 || "string" == b2 || "boolean" == b2 || "null" == b2 || "undefined" == b2 || "undefined" !== typeof Uint8Array && a instanceof Uint8Array) return a;
        if ("array" == b2) return ua(a), l(a, R2.X);
        if (a instanceof r) {
          var c = {};
          a = a.entries();
          for (var d = a.next(); !d.done; d = a.next()) c[d.value[0]] = R2.X(d.value[1]);
          return c;
        }
        q2(a, N2, "Only messages expected: " + a);
        b2 = a.constructor;
        var f2 = { $name: b2.name || b2.displayName };
        for (t in b2.prototype) {
          var h = /^get([A-Z]\w*)/.exec(t);
          if (h && "getExtension" != t && "getJsPbMessageId" != t) {
            var m2 = "has" + h[1];
            if (!a[m2] || a[m2]()) m2 = a[t](), f2[R2.$a(h[1])] = R2.X(m2);
          }
        }
        if (a.extensionObject_) return f2.$extensions = "Recursive dumping of extensions not supported in compiled code. Switch to uncompiled or dump extension object directly", f2;
        for (d in b2.extensions) if (/^\d+$/.test(d)) {
          m2 = b2.extensions[d];
          var t = a.getExtension(m2);
          h = void 0;
          m2 = m2.Ba;
          var B2 = [], M = 0;
          for (h in m2) B2[M++] = h;
          h = B2[0];
          null != t && (c || (c = f2.$extensions = {}), c[R2.$a(h)] = R2.X(t));
        }
        return f2;
      };
      R2.$a = function(a) {
        return a.replace(/^[A-Z]/, function(b2) {
          return b2.toLowerCase();
        });
      };
      function S2() {
        this.a = [];
      }
      g("jspb.BinaryEncoder", S2, void 0);
      S2.prototype.length = function() {
        return this.a.length;
      };
      S2.prototype.length = S2.prototype.length;
      S2.prototype.end = function() {
        var a = this.a;
        this.a = [];
        return a;
      };
      S2.prototype.end = S2.prototype.end;
      S2.prototype.l = function(a, b2) {
        n(a == Math.floor(a));
        n(b2 == Math.floor(b2));
        n(0 <= a && 4294967296 > a);
        for (n(0 <= b2 && 4294967296 > b2); 0 < b2 || 127 < a; ) this.a.push(a & 127 | 128), a = (a >>> 7 | b2 << 25) >>> 0, b2 >>>= 7;
        this.a.push(a);
      };
      S2.prototype.writeSplitVarint64 = S2.prototype.l;
      S2.prototype.A = function(a, b2) {
        n(a == Math.floor(a));
        n(b2 == Math.floor(b2));
        n(0 <= a && 4294967296 > a);
        n(0 <= b2 && 4294967296 > b2);
        this.s(a);
        this.s(b2);
      };
      S2.prototype.writeSplitFixed64 = S2.prototype.A;
      S2.prototype.j = function(a) {
        n(a == Math.floor(a));
        for (n(0 <= a && 4294967296 > a); 127 < a; ) this.a.push(a & 127 | 128), a >>>= 7;
        this.a.push(a);
      };
      S2.prototype.writeUnsignedVarint32 = S2.prototype.j;
      S2.prototype.M = function(a) {
        n(a == Math.floor(a));
        n(-2147483648 <= a && 2147483648 > a);
        if (0 <= a) this.j(a);
        else {
          for (var b2 = 0; 9 > b2; b2++) this.a.push(a & 127 | 128), a >>= 7;
          this.a.push(1);
        }
      };
      S2.prototype.writeSignedVarint32 = S2.prototype.M;
      S2.prototype.va = function(a) {
        n(a == Math.floor(a));
        n(0 <= a && 18446744073709552e3 > a);
        A2(a);
        this.l(y, z2);
      };
      S2.prototype.writeUnsignedVarint64 = S2.prototype.va;
      S2.prototype.ua = function(a) {
        n(a == Math.floor(a));
        n(-9223372036854776e3 <= a && 9223372036854776e3 > a);
        A2(a);
        this.l(y, z2);
      };
      S2.prototype.writeSignedVarint64 = S2.prototype.ua;
      S2.prototype.wa = function(a) {
        n(a == Math.floor(a));
        n(-2147483648 <= a && 2147483648 > a);
        this.j((a << 1 ^ a >> 31) >>> 0);
      };
      S2.prototype.writeZigzagVarint32 = S2.prototype.wa;
      S2.prototype.xa = function(a) {
        n(a == Math.floor(a));
        n(-9223372036854776e3 <= a && 9223372036854776e3 > a);
        Ga(a);
        this.l(y, z2);
      };
      S2.prototype.writeZigzagVarint64 = S2.prototype.xa;
      S2.prototype.Ta = function(a) {
        this.W(H2(a));
      };
      S2.prototype.writeZigzagVarint64String = S2.prototype.Ta;
      S2.prototype.W = function(a) {
        var b2 = this;
        C2(a);
        Ja(y, z2, function(c, d) {
          b2.l(c >>> 0, d >>> 0);
        });
      };
      S2.prototype.writeZigzagVarintHash64 = S2.prototype.W;
      S2.prototype.be = function(a) {
        n(a == Math.floor(a));
        n(0 <= a && 256 > a);
        this.a.push(a >>> 0 & 255);
      };
      S2.prototype.writeUint8 = S2.prototype.be;
      S2.prototype.ae = function(a) {
        n(a == Math.floor(a));
        n(0 <= a && 65536 > a);
        this.a.push(a >>> 0 & 255);
        this.a.push(a >>> 8 & 255);
      };
      S2.prototype.writeUint16 = S2.prototype.ae;
      S2.prototype.s = function(a) {
        n(a == Math.floor(a));
        n(0 <= a && 4294967296 > a);
        this.a.push(a >>> 0 & 255);
        this.a.push(a >>> 8 & 255);
        this.a.push(a >>> 16 & 255);
        this.a.push(a >>> 24 & 255);
      };
      S2.prototype.writeUint32 = S2.prototype.s;
      S2.prototype.V = function(a) {
        n(a == Math.floor(a));
        n(0 <= a && 18446744073709552e3 > a);
        Fa(a);
        this.s(y);
        this.s(z2);
      };
      S2.prototype.writeUint64 = S2.prototype.V;
      S2.prototype.Qc = function(a) {
        n(a == Math.floor(a));
        n(-128 <= a && 128 > a);
        this.a.push(a >>> 0 & 255);
      };
      S2.prototype.writeInt8 = S2.prototype.Qc;
      S2.prototype.Pc = function(a) {
        n(a == Math.floor(a));
        n(-32768 <= a && 32768 > a);
        this.a.push(a >>> 0 & 255);
        this.a.push(a >>> 8 & 255);
      };
      S2.prototype.writeInt16 = S2.prototype.Pc;
      S2.prototype.S = function(a) {
        n(a == Math.floor(a));
        n(-2147483648 <= a && 2147483648 > a);
        this.a.push(a >>> 0 & 255);
        this.a.push(a >>> 8 & 255);
        this.a.push(a >>> 16 & 255);
        this.a.push(a >>> 24 & 255);
      };
      S2.prototype.writeInt32 = S2.prototype.S;
      S2.prototype.T = function(a) {
        n(a == Math.floor(a));
        n(-9223372036854776e3 <= a && 9223372036854776e3 > a);
        A2(a);
        this.A(y, z2);
      };
      S2.prototype.writeInt64 = S2.prototype.T;
      S2.prototype.ka = function(a) {
        n(a == Math.floor(a));
        n(-9223372036854776e3 <= +a && 9223372036854776e3 > +a);
        C2(H2(a));
        this.A(y, z2);
      };
      S2.prototype.writeInt64String = S2.prototype.ka;
      S2.prototype.L = function(a) {
        n(Infinity === a || -Infinity === a || isNaN(a) || -34028234663852886e22 <= a && 34028234663852886e22 >= a);
        Ha(a);
        this.s(y);
      };
      S2.prototype.writeFloat = S2.prototype.L;
      S2.prototype.J = function(a) {
        n(Infinity === a || -Infinity === a || isNaN(a) || -17976931348623157e292 <= a && 17976931348623157e292 >= a);
        Ia(a);
        this.s(y);
        this.s(z2);
      };
      S2.prototype.writeDouble = S2.prototype.J;
      S2.prototype.I = function(a) {
        n("boolean" === typeof a || "number" === typeof a);
        this.a.push(a ? 1 : 0);
      };
      S2.prototype.writeBool = S2.prototype.I;
      S2.prototype.R = function(a) {
        n(a == Math.floor(a));
        n(-2147483648 <= a && 2147483648 > a);
        this.M(a);
      };
      S2.prototype.writeEnum = S2.prototype.R;
      S2.prototype.ja = function(a) {
        this.a.push.apply(this.a, a);
      };
      S2.prototype.writeBytes = S2.prototype.ja;
      S2.prototype.N = function(a) {
        C2(a);
        this.l(y, z2);
      };
      S2.prototype.writeVarintHash64 = S2.prototype.N;
      S2.prototype.K = function(a) {
        C2(a);
        this.s(y);
        this.s(z2);
      };
      S2.prototype.writeFixedHash64 = S2.prototype.K;
      S2.prototype.U = function(a) {
        var b2 = this.a.length;
        ta(a);
        for (var c = 0; c < a.length; c++) {
          var d = a.charCodeAt(c);
          if (128 > d) this.a.push(d);
          else if (2048 > d) this.a.push(d >> 6 | 192), this.a.push(d & 63 | 128);
          else if (65536 > d) if (55296 <= d && 56319 >= d && c + 1 < a.length) {
            var f2 = a.charCodeAt(c + 1);
            56320 <= f2 && 57343 >= f2 && (d = 1024 * (d - 55296) + f2 - 56320 + 65536, this.a.push(d >> 18 | 240), this.a.push(d >> 12 & 63 | 128), this.a.push(d >> 6 & 63 | 128), this.a.push(d & 63 | 128), c++);
          } else this.a.push(d >> 12 | 224), this.a.push(d >> 6 & 63 | 128), this.a.push(d & 63 | 128);
        }
        return this.a.length - b2;
      };
      S2.prototype.writeString = S2.prototype.U;
      function T2(a, b2) {
        this.lo = a;
        this.hi = b2;
      }
      g("jspb.arith.UInt64", T2, void 0);
      T2.prototype.cmp = function(a) {
        return this.hi < a.hi || this.hi == a.hi && this.lo < a.lo ? -1 : this.hi == a.hi && this.lo == a.lo ? 0 : 1;
      };
      T2.prototype.cmp = T2.prototype.cmp;
      T2.prototype.La = function() {
        return new T2((this.lo >>> 1 | (this.hi & 1) << 31) >>> 0, this.hi >>> 1 >>> 0);
      };
      T2.prototype.rightShift = T2.prototype.La;
      T2.prototype.Da = function() {
        return new T2(this.lo << 1 >>> 0, (this.hi << 1 | this.lo >>> 31) >>> 0);
      };
      T2.prototype.leftShift = T2.prototype.Da;
      T2.prototype.cb = function() {
        return !!(this.hi & 2147483648);
      };
      T2.prototype.msb = T2.prototype.cb;
      T2.prototype.Ob = function() {
        return !!(this.lo & 1);
      };
      T2.prototype.lsb = T2.prototype.Ob;
      T2.prototype.Ua = function() {
        return 0 == this.lo && 0 == this.hi;
      };
      T2.prototype.zero = T2.prototype.Ua;
      T2.prototype.add = function(a) {
        return new T2((this.lo + a.lo & 4294967295) >>> 0 >>> 0, ((this.hi + a.hi & 4294967295) >>> 0) + (4294967296 <= this.lo + a.lo ? 1 : 0) >>> 0);
      };
      T2.prototype.add = T2.prototype.add;
      T2.prototype.sub = function(a) {
        return new T2((this.lo - a.lo & 4294967295) >>> 0 >>> 0, ((this.hi - a.hi & 4294967295) >>> 0) - (0 > this.lo - a.lo ? 1 : 0) >>> 0);
      };
      T2.prototype.sub = T2.prototype.sub;
      function rb(a, b2) {
        var c = a & 65535;
        a >>>= 16;
        var d = b2 & 65535, f2 = b2 >>> 16;
        b2 = c * d + 65536 * (c * f2 & 65535) + 65536 * (a * d & 65535);
        for (c = a * f2 + (c * f2 >>> 16) + (a * d >>> 16); 4294967296 <= b2; ) b2 -= 4294967296, c += 1;
        return new T2(b2 >>> 0, c >>> 0);
      }
      T2.mul32x32 = rb;
      T2.prototype.eb = function(a) {
        var b2 = rb(this.lo, a);
        a = rb(this.hi, a);
        a.hi = a.lo;
        a.lo = 0;
        return b2.add(a);
      };
      T2.prototype.mul = T2.prototype.eb;
      T2.prototype.Xa = function(a) {
        if (0 == a) return [];
        var b2 = new T2(0, 0), c = new T2(this.lo, this.hi);
        a = new T2(a, 0);
        for (var d = new T2(1, 0); !a.cb(); ) a = a.Da(), d = d.Da();
        for (; !d.Ua(); ) 0 >= a.cmp(c) && (b2 = b2.add(d), c = c.sub(a)), a = a.La(), d = d.La();
        return [b2, c];
      };
      T2.prototype.div = T2.prototype.Xa;
      T2.prototype.toString = function() {
        for (var a = "", b2 = this; !b2.Ua(); ) {
          b2 = b2.Xa(10);
          var c = b2[0];
          a = b2[1].lo + a;
          b2 = c;
        }
        "" == a && (a = "0");
        return a;
      };
      T2.prototype.toString = T2.prototype.toString;
      function U2(a) {
        for (var b2 = new T2(0, 0), c = new T2(0, 0), d = 0; d < a.length; d++) {
          if ("0" > a[d] || "9" < a[d]) return null;
          c.lo = parseInt(a[d], 10);
          b2 = b2.eb(10).add(c);
        }
        return b2;
      }
      T2.fromString = U2;
      T2.prototype.clone = function() {
        return new T2(this.lo, this.hi);
      };
      T2.prototype.clone = T2.prototype.clone;
      function V2(a, b2) {
        this.lo = a;
        this.hi = b2;
      }
      g("jspb.arith.Int64", V2, void 0);
      V2.prototype.add = function(a) {
        return new V2((this.lo + a.lo & 4294967295) >>> 0 >>> 0, ((this.hi + a.hi & 4294967295) >>> 0) + (4294967296 <= this.lo + a.lo ? 1 : 0) >>> 0);
      };
      V2.prototype.add = V2.prototype.add;
      V2.prototype.sub = function(a) {
        return new V2((this.lo - a.lo & 4294967295) >>> 0 >>> 0, ((this.hi - a.hi & 4294967295) >>> 0) - (0 > this.lo - a.lo ? 1 : 0) >>> 0);
      };
      V2.prototype.sub = V2.prototype.sub;
      V2.prototype.clone = function() {
        return new V2(this.lo, this.hi);
      };
      V2.prototype.clone = V2.prototype.clone;
      V2.prototype.toString = function() {
        var a = 0 != (this.hi & 2147483648), b2 = new T2(this.lo, this.hi);
        a && (b2 = new T2(0, 0).sub(b2));
        return (a ? "-" : "") + b2.toString();
      };
      V2.prototype.toString = V2.prototype.toString;
      function sb(a) {
        var b2 = 0 < a.length && "-" == a[0];
        b2 && (a = a.substring(1));
        a = U2(a);
        if (null === a) return null;
        b2 && (a = new T2(0, 0).sub(a));
        return new V2(a.lo, a.hi);
      }
      V2.fromString = sb;
      function W2() {
        this.c = [];
        this.b = 0;
        this.a = new S2();
        this.h = [];
      }
      g("jspb.BinaryWriter", W2, void 0);
      function tb(a, b2) {
        var c = a.a.end();
        a.c.push(c);
        a.c.push(b2);
        a.b += c.length + b2.length;
      }
      function X(a, b2) {
        Y2(a, b2, 2);
        b2 = a.a.end();
        a.c.push(b2);
        a.b += b2.length;
        b2.push(a.b);
        return b2;
      }
      function Z2(a, b2) {
        var c = b2.pop();
        c = a.b + a.a.length() - c;
        for (n(0 <= c); 127 < c; ) b2.push(c & 127 | 128), c >>>= 7, a.b++;
        b2.push(c);
        a.b++;
      }
      W2.prototype.pb = function(a, b2, c) {
        tb(this, a.subarray(b2, c));
      };
      W2.prototype.writeSerializedMessage = W2.prototype.pb;
      W2.prototype.Pb = function(a, b2, c) {
        null != a && null != b2 && null != c && this.pb(a, b2, c);
      };
      W2.prototype.maybeWriteSerializedMessage = W2.prototype.Pb;
      W2.prototype.reset = function() {
        this.c = [];
        this.a.end();
        this.b = 0;
        this.h = [];
      };
      W2.prototype.reset = W2.prototype.reset;
      W2.prototype.ab = function() {
        n(0 == this.h.length);
        for (var a = new Uint8Array(this.b + this.a.length()), b2 = this.c, c = b2.length, d = 0, f2 = 0; f2 < c; f2++) {
          var h = b2[f2];
          a.set(h, d);
          d += h.length;
        }
        b2 = this.a.end();
        a.set(b2, d);
        d += b2.length;
        n(d == a.length);
        this.c = [a];
        return a;
      };
      W2.prototype.getResultBuffer = W2.prototype.ab;
      W2.prototype.Kb = function(a) {
        return Ba(this.ab(), a);
      };
      W2.prototype.getResultBase64String = W2.prototype.Kb;
      W2.prototype.Va = function(a) {
        this.h.push(X(this, a));
      };
      W2.prototype.beginSubMessage = W2.prototype.Va;
      W2.prototype.Ya = function() {
        n(0 <= this.h.length);
        Z2(this, this.h.pop());
      };
      W2.prototype.endSubMessage = W2.prototype.Ya;
      function Y2(a, b2, c) {
        n(1 <= b2 && b2 == Math.floor(b2));
        a.a.j(8 * b2 + c);
      }
      W2.prototype.Nc = function(a, b2, c) {
        switch (a) {
          case 1:
            this.J(b2, c);
            break;
          case 2:
            this.L(b2, c);
            break;
          case 3:
            this.T(b2, c);
            break;
          case 4:
            this.V(b2, c);
            break;
          case 5:
            this.S(b2, c);
            break;
          case 6:
            this.Qa(b2, c);
            break;
          case 7:
            this.Pa(b2, c);
            break;
          case 8:
            this.I(b2, c);
            break;
          case 9:
            this.U(b2, c);
            break;
          case 10:
            p("Group field type not supported in writeAny()");
            break;
          case 11:
            p("Message field type not supported in writeAny()");
            break;
          case 12:
            this.ja(b2, c);
            break;
          case 13:
            this.s(b2, c);
            break;
          case 14:
            this.R(b2, c);
            break;
          case 15:
            this.Ra(b2, c);
            break;
          case 16:
            this.Sa(b2, c);
            break;
          case 17:
            this.rb(b2, c);
            break;
          case 18:
            this.sb(b2, c);
            break;
          case 30:
            this.K(b2, c);
            break;
          case 31:
            this.N(b2, c);
            break;
          default:
            p("Invalid field type in writeAny()");
        }
      };
      W2.prototype.writeAny = W2.prototype.Nc;
      function ub(a, b2, c) {
        null != c && (Y2(a, b2, 0), a.a.j(c));
      }
      function vb(a, b2, c) {
        null != c && (Y2(a, b2, 0), a.a.M(c));
      }
      W2.prototype.S = function(a, b2) {
        null != b2 && (n(-2147483648 <= b2 && 2147483648 > b2), vb(this, a, b2));
      };
      W2.prototype.writeInt32 = W2.prototype.S;
      W2.prototype.ob = function(a, b2) {
        null != b2 && (b2 = parseInt(b2, 10), n(-2147483648 <= b2 && 2147483648 > b2), vb(this, a, b2));
      };
      W2.prototype.writeInt32String = W2.prototype.ob;
      W2.prototype.T = function(a, b2) {
        null != b2 && (n(-9223372036854776e3 <= b2 && 9223372036854776e3 > b2), null != b2 && (Y2(this, a, 0), this.a.ua(b2)));
      };
      W2.prototype.writeInt64 = W2.prototype.T;
      W2.prototype.ka = function(a, b2) {
        null != b2 && (b2 = sb(b2), Y2(this, a, 0), this.a.l(b2.lo, b2.hi));
      };
      W2.prototype.writeInt64String = W2.prototype.ka;
      W2.prototype.s = function(a, b2) {
        null != b2 && (n(0 <= b2 && 4294967296 > b2), ub(this, a, b2));
      };
      W2.prototype.writeUint32 = W2.prototype.s;
      W2.prototype.ub = function(a, b2) {
        null != b2 && (b2 = parseInt(b2, 10), n(0 <= b2 && 4294967296 > b2), ub(this, a, b2));
      };
      W2.prototype.writeUint32String = W2.prototype.ub;
      W2.prototype.V = function(a, b2) {
        null != b2 && (n(0 <= b2 && 18446744073709552e3 > b2), null != b2 && (Y2(this, a, 0), this.a.va(b2)));
      };
      W2.prototype.writeUint64 = W2.prototype.V;
      W2.prototype.vb = function(a, b2) {
        null != b2 && (b2 = U2(b2), Y2(this, a, 0), this.a.l(b2.lo, b2.hi));
      };
      W2.prototype.writeUint64String = W2.prototype.vb;
      W2.prototype.rb = function(a, b2) {
        null != b2 && (n(-2147483648 <= b2 && 2147483648 > b2), null != b2 && (Y2(this, a, 0), this.a.wa(b2)));
      };
      W2.prototype.writeSint32 = W2.prototype.rb;
      W2.prototype.sb = function(a, b2) {
        null != b2 && (n(-9223372036854776e3 <= b2 && 9223372036854776e3 > b2), null != b2 && (Y2(this, a, 0), this.a.xa(b2)));
      };
      W2.prototype.writeSint64 = W2.prototype.sb;
      W2.prototype.$d = function(a, b2) {
        null != b2 && null != b2 && (Y2(this, a, 0), this.a.W(b2));
      };
      W2.prototype.writeSintHash64 = W2.prototype.$d;
      W2.prototype.Zd = function(a, b2) {
        null != b2 && null != b2 && (Y2(this, a, 0), this.a.Ta(b2));
      };
      W2.prototype.writeSint64String = W2.prototype.Zd;
      W2.prototype.Pa = function(a, b2) {
        null != b2 && (n(0 <= b2 && 4294967296 > b2), Y2(this, a, 5), this.a.s(b2));
      };
      W2.prototype.writeFixed32 = W2.prototype.Pa;
      W2.prototype.Qa = function(a, b2) {
        null != b2 && (n(0 <= b2 && 18446744073709552e3 > b2), Y2(this, a, 1), this.a.V(b2));
      };
      W2.prototype.writeFixed64 = W2.prototype.Qa;
      W2.prototype.nb = function(a, b2) {
        null != b2 && (b2 = U2(b2), Y2(this, a, 1), this.a.A(b2.lo, b2.hi));
      };
      W2.prototype.writeFixed64String = W2.prototype.nb;
      W2.prototype.Ra = function(a, b2) {
        null != b2 && (n(-2147483648 <= b2 && 2147483648 > b2), Y2(this, a, 5), this.a.S(b2));
      };
      W2.prototype.writeSfixed32 = W2.prototype.Ra;
      W2.prototype.Sa = function(a, b2) {
        null != b2 && (n(-9223372036854776e3 <= b2 && 9223372036854776e3 > b2), Y2(this, a, 1), this.a.T(b2));
      };
      W2.prototype.writeSfixed64 = W2.prototype.Sa;
      W2.prototype.qb = function(a, b2) {
        null != b2 && (b2 = sb(b2), Y2(this, a, 1), this.a.A(b2.lo, b2.hi));
      };
      W2.prototype.writeSfixed64String = W2.prototype.qb;
      W2.prototype.L = function(a, b2) {
        null != b2 && (Y2(this, a, 5), this.a.L(b2));
      };
      W2.prototype.writeFloat = W2.prototype.L;
      W2.prototype.J = function(a, b2) {
        null != b2 && (Y2(this, a, 1), this.a.J(b2));
      };
      W2.prototype.writeDouble = W2.prototype.J;
      W2.prototype.I = function(a, b2) {
        null != b2 && (n("boolean" === typeof b2 || "number" === typeof b2), Y2(this, a, 0), this.a.I(b2));
      };
      W2.prototype.writeBool = W2.prototype.I;
      W2.prototype.R = function(a, b2) {
        null != b2 && (n(-2147483648 <= b2 && 2147483648 > b2), Y2(this, a, 0), this.a.M(b2));
      };
      W2.prototype.writeEnum = W2.prototype.R;
      W2.prototype.U = function(a, b2) {
        null != b2 && (a = X(this, a), this.a.U(b2), Z2(this, a));
      };
      W2.prototype.writeString = W2.prototype.U;
      W2.prototype.ja = function(a, b2) {
        null != b2 && (b2 = Ua(b2), Y2(this, a, 2), this.a.j(b2.length), tb(this, b2));
      };
      W2.prototype.writeBytes = W2.prototype.ja;
      W2.prototype.Rc = function(a, b2, c) {
        null != b2 && (a = X(this, a), c(b2, this), Z2(this, a));
      };
      W2.prototype.writeMessage = W2.prototype.Rc;
      W2.prototype.Sc = function(a, b2, c) {
        null != b2 && (Y2(this, 1, 3), Y2(this, 2, 0), this.a.M(a), a = X(this, 3), c(b2, this), Z2(this, a), Y2(this, 1, 4));
      };
      W2.prototype.writeMessageSet = W2.prototype.Sc;
      W2.prototype.Oc = function(a, b2, c) {
        null != b2 && (Y2(this, a, 3), c(b2, this), Y2(this, a, 4));
      };
      W2.prototype.writeGroup = W2.prototype.Oc;
      W2.prototype.K = function(a, b2) {
        null != b2 && (n(8 == b2.length), Y2(this, a, 1), this.a.K(b2));
      };
      W2.prototype.writeFixedHash64 = W2.prototype.K;
      W2.prototype.N = function(a, b2) {
        null != b2 && (n(8 == b2.length), Y2(this, a, 0), this.a.N(b2));
      };
      W2.prototype.writeVarintHash64 = W2.prototype.N;
      W2.prototype.A = function(a, b2, c) {
        Y2(this, a, 1);
        this.a.A(b2, c);
      };
      W2.prototype.writeSplitFixed64 = W2.prototype.A;
      W2.prototype.l = function(a, b2, c) {
        Y2(this, a, 0);
        this.a.l(b2, c);
      };
      W2.prototype.writeSplitVarint64 = W2.prototype.l;
      W2.prototype.tb = function(a, b2, c) {
        Y2(this, a, 0);
        var d = this.a;
        Ja(b2, c, function(f2, h) {
          d.l(f2 >>> 0, h >>> 0);
        });
      };
      W2.prototype.writeSplitZigzagVarint64 = W2.prototype.tb;
      W2.prototype.Ed = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) vb(this, a, b2[c]);
      };
      W2.prototype.writeRepeatedInt32 = W2.prototype.Ed;
      W2.prototype.Fd = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) this.ob(a, b2[c]);
      };
      W2.prototype.writeRepeatedInt32String = W2.prototype.Fd;
      W2.prototype.Gd = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) {
          var d = b2[c];
          null != d && (Y2(this, a, 0), this.a.ua(d));
        }
      };
      W2.prototype.writeRepeatedInt64 = W2.prototype.Gd;
      W2.prototype.Qd = function(a, b2, c, d) {
        if (null != b2) for (var f2 = 0; f2 < b2.length; f2++) this.A(a, c(b2[f2]), d(b2[f2]));
      };
      W2.prototype.writeRepeatedSplitFixed64 = W2.prototype.Qd;
      W2.prototype.Rd = function(a, b2, c, d) {
        if (null != b2) for (var f2 = 0; f2 < b2.length; f2++) this.l(a, c(b2[f2]), d(b2[f2]));
      };
      W2.prototype.writeRepeatedSplitVarint64 = W2.prototype.Rd;
      W2.prototype.Sd = function(a, b2, c, d) {
        if (null != b2) for (var f2 = 0; f2 < b2.length; f2++) this.tb(a, c(b2[f2]), d(b2[f2]));
      };
      W2.prototype.writeRepeatedSplitZigzagVarint64 = W2.prototype.Sd;
      W2.prototype.Hd = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) this.ka(a, b2[c]);
      };
      W2.prototype.writeRepeatedInt64String = W2.prototype.Hd;
      W2.prototype.Ud = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) ub(this, a, b2[c]);
      };
      W2.prototype.writeRepeatedUint32 = W2.prototype.Ud;
      W2.prototype.Vd = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) this.ub(a, b2[c]);
      };
      W2.prototype.writeRepeatedUint32String = W2.prototype.Vd;
      W2.prototype.Wd = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) {
          var d = b2[c];
          null != d && (Y2(this, a, 0), this.a.va(d));
        }
      };
      W2.prototype.writeRepeatedUint64 = W2.prototype.Wd;
      W2.prototype.Xd = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) this.vb(a, b2[c]);
      };
      W2.prototype.writeRepeatedUint64String = W2.prototype.Xd;
      W2.prototype.Md = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) {
          var d = b2[c];
          null != d && (Y2(this, a, 0), this.a.wa(d));
        }
      };
      W2.prototype.writeRepeatedSint32 = W2.prototype.Md;
      W2.prototype.Nd = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) {
          var d = b2[c];
          null != d && (Y2(this, a, 0), this.a.xa(d));
        }
      };
      W2.prototype.writeRepeatedSint64 = W2.prototype.Nd;
      W2.prototype.Od = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) {
          var d = b2[c];
          null != d && (Y2(this, a, 0), this.a.Ta(d));
        }
      };
      W2.prototype.writeRepeatedSint64String = W2.prototype.Od;
      W2.prototype.Pd = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) {
          var d = b2[c];
          null != d && (Y2(this, a, 0), this.a.W(d));
        }
      };
      W2.prototype.writeRepeatedSintHash64 = W2.prototype.Pd;
      W2.prototype.yd = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) this.Pa(a, b2[c]);
      };
      W2.prototype.writeRepeatedFixed32 = W2.prototype.yd;
      W2.prototype.zd = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) this.Qa(a, b2[c]);
      };
      W2.prototype.writeRepeatedFixed64 = W2.prototype.zd;
      W2.prototype.Ad = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) this.nb(a, b2[c]);
      };
      W2.prototype.writeRepeatedFixed64String = W2.prototype.Ad;
      W2.prototype.Jd = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) this.Ra(a, b2[c]);
      };
      W2.prototype.writeRepeatedSfixed32 = W2.prototype.Jd;
      W2.prototype.Kd = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) this.Sa(a, b2[c]);
      };
      W2.prototype.writeRepeatedSfixed64 = W2.prototype.Kd;
      W2.prototype.Ld = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) this.qb(a, b2[c]);
      };
      W2.prototype.writeRepeatedSfixed64String = W2.prototype.Ld;
      W2.prototype.Cd = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) this.L(a, b2[c]);
      };
      W2.prototype.writeRepeatedFloat = W2.prototype.Cd;
      W2.prototype.wd = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) this.J(a, b2[c]);
      };
      W2.prototype.writeRepeatedDouble = W2.prototype.wd;
      W2.prototype.ud = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) this.I(a, b2[c]);
      };
      W2.prototype.writeRepeatedBool = W2.prototype.ud;
      W2.prototype.xd = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) this.R(a, b2[c]);
      };
      W2.prototype.writeRepeatedEnum = W2.prototype.xd;
      W2.prototype.Td = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) this.U(a, b2[c]);
      };
      W2.prototype.writeRepeatedString = W2.prototype.Td;
      W2.prototype.vd = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) this.ja(a, b2[c]);
      };
      W2.prototype.writeRepeatedBytes = W2.prototype.vd;
      W2.prototype.Id = function(a, b2, c) {
        if (null != b2) for (var d = 0; d < b2.length; d++) {
          var f2 = X(this, a);
          c(b2[d], this);
          Z2(this, f2);
        }
      };
      W2.prototype.writeRepeatedMessage = W2.prototype.Id;
      W2.prototype.Dd = function(a, b2, c) {
        if (null != b2) for (var d = 0; d < b2.length; d++) Y2(this, a, 3), c(b2[d], this), Y2(this, a, 4);
      };
      W2.prototype.writeRepeatedGroup = W2.prototype.Dd;
      W2.prototype.Bd = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) this.K(a, b2[c]);
      };
      W2.prototype.writeRepeatedFixedHash64 = W2.prototype.Bd;
      W2.prototype.Yd = function(a, b2) {
        if (null != b2) for (var c = 0; c < b2.length; c++) this.N(a, b2[c]);
      };
      W2.prototype.writeRepeatedVarintHash64 = W2.prototype.Yd;
      W2.prototype.ad = function(a, b2) {
        if (null != b2 && b2.length) {
          a = X(this, a);
          for (var c = 0; c < b2.length; c++) this.a.M(b2[c]);
          Z2(this, a);
        }
      };
      W2.prototype.writePackedInt32 = W2.prototype.ad;
      W2.prototype.bd = function(a, b2) {
        if (null != b2 && b2.length) {
          a = X(this, a);
          for (var c = 0; c < b2.length; c++) this.a.M(parseInt(b2[c], 10));
          Z2(this, a);
        }
      };
      W2.prototype.writePackedInt32String = W2.prototype.bd;
      W2.prototype.cd = function(a, b2) {
        if (null != b2 && b2.length) {
          a = X(this, a);
          for (var c = 0; c < b2.length; c++) this.a.ua(b2[c]);
          Z2(this, a);
        }
      };
      W2.prototype.writePackedInt64 = W2.prototype.cd;
      W2.prototype.md = function(a, b2, c, d) {
        if (null != b2) {
          a = X(this, a);
          for (var f2 = 0; f2 < b2.length; f2++) this.a.A(c(b2[f2]), d(b2[f2]));
          Z2(this, a);
        }
      };
      W2.prototype.writePackedSplitFixed64 = W2.prototype.md;
      W2.prototype.nd = function(a, b2, c, d) {
        if (null != b2) {
          a = X(this, a);
          for (var f2 = 0; f2 < b2.length; f2++) this.a.l(c(b2[f2]), d(b2[f2]));
          Z2(this, a);
        }
      };
      W2.prototype.writePackedSplitVarint64 = W2.prototype.nd;
      W2.prototype.od = function(a, b2, c, d) {
        if (null != b2) {
          a = X(this, a);
          for (var f2 = this.a, h = 0; h < b2.length; h++) Ja(c(b2[h]), d(b2[h]), function(m2, t) {
            f2.l(m2 >>> 0, t >>> 0);
          });
          Z2(this, a);
        }
      };
      W2.prototype.writePackedSplitZigzagVarint64 = W2.prototype.od;
      W2.prototype.dd = function(a, b2) {
        if (null != b2 && b2.length) {
          a = X(this, a);
          for (var c = 0; c < b2.length; c++) {
            var d = sb(b2[c]);
            this.a.l(d.lo, d.hi);
          }
          Z2(this, a);
        }
      };
      W2.prototype.writePackedInt64String = W2.prototype.dd;
      W2.prototype.pd = function(a, b2) {
        if (null != b2 && b2.length) {
          a = X(this, a);
          for (var c = 0; c < b2.length; c++) this.a.j(b2[c]);
          Z2(this, a);
        }
      };
      W2.prototype.writePackedUint32 = W2.prototype.pd;
      W2.prototype.qd = function(a, b2) {
        if (null != b2 && b2.length) {
          a = X(this, a);
          for (var c = 0; c < b2.length; c++) this.a.j(parseInt(b2[c], 10));
          Z2(this, a);
        }
      };
      W2.prototype.writePackedUint32String = W2.prototype.qd;
      W2.prototype.rd = function(a, b2) {
        if (null != b2 && b2.length) {
          a = X(this, a);
          for (var c = 0; c < b2.length; c++) this.a.va(b2[c]);
          Z2(this, a);
        }
      };
      W2.prototype.writePackedUint64 = W2.prototype.rd;
      W2.prototype.sd = function(a, b2) {
        if (null != b2 && b2.length) {
          a = X(this, a);
          for (var c = 0; c < b2.length; c++) {
            var d = U2(b2[c]);
            this.a.l(d.lo, d.hi);
          }
          Z2(this, a);
        }
      };
      W2.prototype.writePackedUint64String = W2.prototype.sd;
      W2.prototype.hd = function(a, b2) {
        if (null != b2 && b2.length) {
          a = X(this, a);
          for (var c = 0; c < b2.length; c++) this.a.wa(b2[c]);
          Z2(this, a);
        }
      };
      W2.prototype.writePackedSint32 = W2.prototype.hd;
      W2.prototype.jd = function(a, b2) {
        if (null != b2 && b2.length) {
          a = X(this, a);
          for (var c = 0; c < b2.length; c++) this.a.xa(b2[c]);
          Z2(this, a);
        }
      };
      W2.prototype.writePackedSint64 = W2.prototype.jd;
      W2.prototype.kd = function(a, b2) {
        if (null != b2 && b2.length) {
          a = X(this, a);
          for (var c = 0; c < b2.length; c++) this.a.W(H2(b2[c]));
          Z2(this, a);
        }
      };
      W2.prototype.writePackedSint64String = W2.prototype.kd;
      W2.prototype.ld = function(a, b2) {
        if (null != b2 && b2.length) {
          a = X(this, a);
          for (var c = 0; c < b2.length; c++) this.a.W(b2[c]);
          Z2(this, a);
        }
      };
      W2.prototype.writePackedSintHash64 = W2.prototype.ld;
      W2.prototype.Wc = function(a, b2) {
        if (null != b2 && b2.length) for (Y2(this, a, 2), this.a.j(4 * b2.length), a = 0; a < b2.length; a++) this.a.s(b2[a]);
      };
      W2.prototype.writePackedFixed32 = W2.prototype.Wc;
      W2.prototype.Xc = function(a, b2) {
        if (null != b2 && b2.length) for (Y2(this, a, 2), this.a.j(8 * b2.length), a = 0; a < b2.length; a++) this.a.V(b2[a]);
      };
      W2.prototype.writePackedFixed64 = W2.prototype.Xc;
      W2.prototype.Yc = function(a, b2) {
        if (null != b2 && b2.length) for (Y2(this, a, 2), this.a.j(8 * b2.length), a = 0; a < b2.length; a++) {
          var c = U2(b2[a]);
          this.a.A(c.lo, c.hi);
        }
      };
      W2.prototype.writePackedFixed64String = W2.prototype.Yc;
      W2.prototype.ed = function(a, b2) {
        if (null != b2 && b2.length) for (Y2(this, a, 2), this.a.j(4 * b2.length), a = 0; a < b2.length; a++) this.a.S(b2[a]);
      };
      W2.prototype.writePackedSfixed32 = W2.prototype.ed;
      W2.prototype.fd = function(a, b2) {
        if (null != b2 && b2.length) for (Y2(this, a, 2), this.a.j(8 * b2.length), a = 0; a < b2.length; a++) this.a.T(b2[a]);
      };
      W2.prototype.writePackedSfixed64 = W2.prototype.fd;
      W2.prototype.gd = function(a, b2) {
        if (null != b2 && b2.length) for (Y2(this, a, 2), this.a.j(8 * b2.length), a = 0; a < b2.length; a++) this.a.ka(b2[a]);
      };
      W2.prototype.writePackedSfixed64String = W2.prototype.gd;
      W2.prototype.$c = function(a, b2) {
        if (null != b2 && b2.length) for (Y2(this, a, 2), this.a.j(4 * b2.length), a = 0; a < b2.length; a++) this.a.L(b2[a]);
      };
      W2.prototype.writePackedFloat = W2.prototype.$c;
      W2.prototype.Uc = function(a, b2) {
        if (null != b2 && b2.length) for (Y2(this, a, 2), this.a.j(8 * b2.length), a = 0; a < b2.length; a++) this.a.J(b2[a]);
      };
      W2.prototype.writePackedDouble = W2.prototype.Uc;
      W2.prototype.Tc = function(a, b2) {
        if (null != b2 && b2.length) for (Y2(this, a, 2), this.a.j(b2.length), a = 0; a < b2.length; a++) this.a.I(b2[a]);
      };
      W2.prototype.writePackedBool = W2.prototype.Tc;
      W2.prototype.Vc = function(a, b2) {
        if (null != b2 && b2.length) {
          a = X(this, a);
          for (var c = 0; c < b2.length; c++) this.a.R(b2[c]);
          Z2(this, a);
        }
      };
      W2.prototype.writePackedEnum = W2.prototype.Vc;
      W2.prototype.Zc = function(a, b2) {
        if (null != b2 && b2.length) for (Y2(this, a, 2), this.a.j(8 * b2.length), a = 0; a < b2.length; a++) this.a.K(b2[a]);
      };
      W2.prototype.writePackedFixedHash64 = W2.prototype.Zc;
      W2.prototype.td = function(a, b2) {
        if (null != b2 && b2.length) {
          a = X(this, a);
          for (var c = 0; c < b2.length; c++) this.a.N(b2[c]);
          Z2(this, a);
        }
      };
      W2.prototype.writePackedVarintHash64 = W2.prototype.td;
      "object" === typeof exports && (exports.debug = R2, exports.Map = r, exports.Message = N2, exports.BinaryReader = J2, exports.BinaryWriter = W2, exports.ExtensionFieldInfo = Ya, exports.ExtensionFieldBinaryInfo = Za, exports.exportSymbol = ma, exports.inherits = na, exports.object = { extend: pa }, exports.typeOf = k2);
    }
  });

  // node_modules/image-dimensions/utilities.js
  function isValidOffsetToRead(dataView, offset, bytesToRead) {
    return dataView.byteLength >= offset + bytesToRead;
  }
  function getUint32(dataView, offset, littleEndian = false) {
    if (isValidOffsetToRead(dataView, offset, 4)) {
      return dataView.getUint32(offset, littleEndian);
    }
  }
  function getUint16(dataView, offset, littleEndian = false) {
    if (isValidOffsetToRead(dataView, offset, 2)) {
      return dataView.getUint16(offset, littleEndian);
    }
  }
  function getIsobmffFtypBrands(bytes) {
    if (bytes.length < 16) {
      return;
    }
    const isFtyp = bytes[4] === 102 && bytes[5] === 116 && bytes[6] === 121 && bytes[7] === 112;
    if (!isFtyp) {
      return;
    }
    const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const size = getUint32(dataView, 0);
    if (size === void 0 || size < 16 || size > bytes.length) {
      return;
    }
    const brands = [];
    brands.push(String.fromCodePoint(...bytes.slice(8, 12)));
    for (let i = 16; i + 4 <= size; i += 4) {
      brands.push(String.fromCodePoint(...bytes.slice(i, i + 4)));
    }
    return brands;
  }
  function unboxIsobmffBox(data, offset) {
    const dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const size = getUint32(dataView, offset);
    if (size === void 0) {
      return;
    }
    if (data.length < size + offset || size < 8) {
      return;
    }
    return {
      type: String.fromCodePoint(...data.slice(offset + 4, offset + 8)),
      data: data.slice(offset + 8, offset + size),
      tail: offset + size
    };
  }
  function getIsobmffIspeSizesFromMeta(data) {
    const sizes = [];
    let offset = 0;
    while (offset < data.length) {
      const box = unboxIsobmffBox(data, offset);
      if (!box) {
        break;
      }
      if (box.type === "meta") {
        parseIsobmffMetaBox(box.data, sizes);
      }
      offset = box.tail;
    }
    return sizes;
  }
  function parseIsobmffMetaBox(data, sizes) {
    let offset = 4;
    while (offset < data.length) {
      const box = unboxIsobmffBox(data, offset);
      if (!box) {
        break;
      }
      if (box.type === "iprp") {
        parseIsobmffIprpBox(box.data, sizes);
      }
      offset = box.tail;
    }
    return sizes;
  }
  function parseIsobmffIprpBox(data, sizes) {
    let offset = 0;
    while (offset < data.length) {
      const box = unboxIsobmffBox(data, offset);
      if (!box) {
        break;
      }
      if (box.type === "ipco") {
        parseIsobmffIpcoBox(box.data, sizes);
      }
      offset = box.tail;
    }
  }
  function parseIsobmffIpcoBox(data, sizes) {
    let offset = 0;
    while (offset < data.length) {
      const box = unboxIsobmffBox(data, offset);
      if (!box) {
        break;
      }
      if (box.type === "ispe") {
        const dataView = new DataView(box.data.buffer, box.data.byteOffset, box.data.byteLength);
        const width = getUint32(dataView, 4);
        const height = getUint32(dataView, 8);
        if (width === void 0 || height === void 0) {
          return;
        }
        sizes.push({
          width,
          height
        });
      }
      offset = box.tail;
    }
  }
  function getLargestAreaSize(sizes) {
    let maxSize = sizes[0];
    for (const size of sizes) {
      if (size.width * size.height > maxSize.width * maxSize.height) {
        maxSize = size;
      }
    }
    return maxSize;
  }

  // node_modules/image-dimensions/types/png.js
  var isPng = (bytes) => bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71 && bytes[4] === 13 && bytes[5] === 10 && bytes[6] === 26 && bytes[7] === 10;
  var isAppleMinifiedPng = (bytes) => bytes[12] === 67 && bytes[13] === 103 && bytes[14] === 66 && bytes[15] === 73;
  function png(bytes) {
    if (!isPng(bytes)) {
      return;
    }
    const dataView = new DataView(bytes.buffer);
    const isAppleMinified = isAppleMinifiedPng(bytes);
    const width = getUint32(dataView, isAppleMinified ? 32 : 16, false);
    const height = getUint32(dataView, isAppleMinified ? 36 : 20, false);
    if (width === void 0 || height === void 0) {
      return;
    }
    return {
      width,
      height,
      type: "png"
    };
  }

  // node_modules/image-dimensions/types/jpeg.js
  var SOF0 = 65472;
  var SOF3 = 65475;
  var jsJpeg = (bytes) => bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  function jpeg(bytes) {
    if (!jsJpeg(bytes)) {
      return;
    }
    const dataView = new DataView(bytes.buffer);
    let offset = 2;
    while (isValidOffsetToRead(dataView, offset, 2)) {
      const marker = dataView.getUint16(offset);
      offset += 2;
      if (marker >= SOF0 && marker <= SOF3) {
        const height = getUint16(dataView, offset + 3, false);
        const width = getUint16(dataView, offset + 5, false);
        if (height === void 0 || width === void 0) {
          return;
        }
        return {
          height,
          width,
          type: "jpeg"
        };
      }
      const segmentLength = getUint16(dataView, offset);
      if (segmentLength === void 0) {
        return;
      }
      offset += segmentLength;
      if (offset > dataView.byteLength) {
        return;
      }
    }
  }

  // node_modules/image-dimensions/types/gif.js
  var isGif = (bytes) => bytes[0] === 71 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 56 && (bytes[4] === 55 || bytes[4] === 57) && bytes[5] === 97;
  function gif(bytes) {
    if (!isGif(bytes)) {
      return;
    }
    const dataView = new DataView(bytes.buffer);
    const width = getUint16(dataView, 6, true);
    const height = getUint16(dataView, 8, true);
    if (width === void 0 || height === void 0) {
      return;
    }
    return {
      width,
      height,
      type: "gif"
    };
  }

  // node_modules/image-dimensions/types/webp.js
  var isWebp = (bytes) => (
    // RIFF
    bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70 && bytes[8] === 87 && bytes[9] === 69 && bytes[10] === 66 && bytes[11] === 80
  );
  var isVP8Lossy = (bytes) => (
    // `VP8 ` (note the space)
    bytes[12] === 86 && bytes[13] === 80 && bytes[14] === 56 && bytes[15] === 32
  );
  var isVP8Lossless = (bytes) => (
    // `VP8L`
    bytes[12] === 86 && bytes[13] === 80 && bytes[14] === 56 && bytes[15] === 76
  );
  var isVP8Extended = (bytes) => (
    // `VP8X`
    bytes[12] === 86 && bytes[13] === 80 && bytes[14] === 56 && bytes[15] === 88
  );
  function readUInt24LE(dataView, offset) {
    const byte1 = dataView.getUint8(offset);
    const byte2 = dataView.getUint8(offset + 1);
    const byte3 = dataView.getUint8(offset + 2);
    return byte3 << 16 | byte2 << 8 | byte1;
  }
  function webp(bytes) {
    if (!isWebp(bytes)) {
      return;
    }
    const dataView = new DataView(bytes.buffer);
    const maxSize = 16383;
    if (isVP8Lossy(bytes)) {
      if (!isValidOffsetToRead(dataView, 28, 2)) {
        return;
      }
      return {
        // eslint-disable-next-line no-bitwise
        width: dataView.getUint16(26, true) & maxSize,
        // eslint-disable-next-line no-bitwise
        height: dataView.getUint16(28, true) & maxSize,
        type: "webp"
      };
    }
    if (isVP8Lossless(bytes)) {
      const bits = getUint32(dataView, 21, true);
      if (bits === void 0) {
        return;
      }
      return {
        // eslint-disable-next-line no-bitwise
        width: (bits & maxSize) + 1,
        // eslint-disable-next-line no-bitwise
        height: (bits >> 14 & maxSize) + 1,
        type: "webp"
      };
    }
    if (isVP8Extended(bytes)) {
      if (!isValidOffsetToRead(dataView, 27, 3)) {
        return;
      }
      return {
        width: readUInt24LE(dataView, 24) + 1,
        height: readUInt24LE(dataView, 27) + 1,
        type: "webp"
      };
    }
  }

  // node_modules/image-dimensions/types/avif.js
  var avifBrands = /* @__PURE__ */ new Set([
    "avif",
    "avis",
    "avio"
  ]);
  var isAvif = (bytes) => {
    const brands = getIsobmffFtypBrands(bytes);
    if (!brands) {
      return false;
    }
    return brands.some((brand) => avifBrands.has(brand));
  };
  function avif(bytes) {
    if (!isAvif(bytes)) {
      return;
    }
    const sizes = getIsobmffIspeSizesFromMeta(bytes);
    if (sizes.length === 0) {
      return;
    }
    return {
      ...getLargestAreaSize(sizes),
      type: "avif"
    };
  }

  // node_modules/image-dimensions/types/heic.js
  var heifBrands = /* @__PURE__ */ new Set([
    "mif1",
    "msf1",
    "heic",
    "heix",
    "hevc",
    "hevx",
    "heim",
    "heis",
    "hevm",
    "hevs"
  ]);
  var isHeic = (bytes) => {
    const brands = getIsobmffFtypBrands(bytes);
    if (!brands) {
      return false;
    }
    return brands.some((brand) => heifBrands.has(brand));
  };
  function heic(bytes) {
    if (!isHeic(bytes)) {
      return;
    }
    const sizes = getIsobmffIspeSizesFromMeta(bytes);
    if (sizes.length === 0) {
      return;
    }
    return {
      ...getLargestAreaSize(sizes),
      type: "heic"
    };
  }

  // node_modules/image-dimensions/index.js
  function imageDimensionsFromData(bytes) {
    if (bytes.length < 3) {
      return;
    }
    bytes = new Uint8Array(bytes);
    return png(bytes) ?? gif(bytes) ?? jpeg(bytes) ?? webp(bytes) ?? avif(bytes) ?? heic(bytes);
  }

  // node_modules/@rxliuli/chrome-lens-ocr/dist/core.js
  var import_set_cookie_parser = __toESM(require_set_cookie(), 1);
  var import_google_protobuf = __toESM(require_google_protobuf(), 1);
  function L(c, e) {
    for (var i = 0; i < e.length; i++) {
      const d = e[i];
      if (typeof d != "string" && !Array.isArray(d)) {
        for (const a in d)
          if (a !== "default" && !(a in c)) {
            const t = Object.getOwnPropertyDescriptor(d, a);
            t && Object.defineProperty(c, a, t.get ? t : {
              enumerable: true,
              get: () => d[a]
            });
          }
      }
    }
    return Object.freeze(Object.defineProperty(c, Symbol.toStringTag, { value: "Module" }));
  }
  var ee = "https://lensfrontend-pa.googleapis.com/v1/crupload";
  var ze = "AIzaSyDr2UxVnv_U85AbhhY8XSHSIavUW0DC-sY";
  var qe = [
    "image/x-icon",
    "image/bmp",
    "image/jpeg",
    "image/png",
    "image/tiff",
    "image/webp",
    "image/heic"
  ];
  var te = {
    ico: "image/x-icon",
    bmp: "image/bmp",
    jpg: "image/jpeg",
    png: "image/png",
    tiff: "image/tiff",
    webp: "image/webp",
    heic: "image/heic",
    gif: "image/gif"
  };
  function Ge(c) {
    return c.split("; ").reduce((e, i) => {
      const [d, ...a] = i.split("=");
      return e[d] = a.join("="), e;
    }, {});
  }
  function b(c) {
    return c && c.__esModule && Object.prototype.hasOwnProperty.call(c, "default") ? c.default : c;
  }
  var B = {};
  var I = {};
  var C = {};
  var ne;
  function Ne() {
    return ne || (ne = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis;
      i.exportSymbol("proto.lens.LensOverlayPhaseLatenciesMetadata", null, d), i.exportSymbol("proto.lens.LensOverlayPhaseLatenciesMetadata.ImageType", null, d), i.exportSymbol("proto.lens.LensOverlayPhaseLatenciesMetadata.Phase", null, d), i.exportSymbol("proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData", null, d), i.exportSymbol("proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData", null, d), i.exportSymbol("proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.PhaseDataCase", null, d), proto.lens.LensOverlayPhaseLatenciesMetadata = function(a) {
        e.Message.initialize(this, a, 0, -1, proto.lens.LensOverlayPhaseLatenciesMetadata.repeatedFields_, null);
      }, i.inherits(proto.lens.LensOverlayPhaseLatenciesMetadata, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayPhaseLatenciesMetadata.displayName = "proto.lens.LensOverlayPhaseLatenciesMetadata"), proto.lens.LensOverlayPhaseLatenciesMetadata.Phase = function(a) {
        e.Message.initialize(this, a, 0, -1, null, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.oneofGroups_);
      }, i.inherits(proto.lens.LensOverlayPhaseLatenciesMetadata.Phase, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.displayName = "proto.lens.LensOverlayPhaseLatenciesMetadata.Phase"), proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData = function(a) {
        e.Message.initialize(this, a, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData.displayName = "proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData"), proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData = function(a) {
        e.Message.initialize(this, a, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData.displayName = "proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData"), proto.lens.LensOverlayPhaseLatenciesMetadata.repeatedFields_ = [1], e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayPhaseLatenciesMetadata.prototype.toObject = function(a) {
        return proto.lens.LensOverlayPhaseLatenciesMetadata.toObject(a, this);
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.toObject = function(a, t) {
        var n = {
          phaseList: e.Message.toObjectList(
            t.getPhaseList(),
            proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.toObject,
            a
          )
        };
        return a && (n.$jspbMessageInstance = t), n;
      }), proto.lens.LensOverlayPhaseLatenciesMetadata.deserializeBinary = function(a) {
        var t = new e.BinaryReader(a), n = new proto.lens.LensOverlayPhaseLatenciesMetadata();
        return proto.lens.LensOverlayPhaseLatenciesMetadata.deserializeBinaryFromReader(n, t);
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.deserializeBinaryFromReader = function(a, t) {
        for (; t.nextField() && !t.isEndGroup(); ) {
          var n = t.getFieldNumber();
          switch (n) {
            case 1:
              var r = new proto.lens.LensOverlayPhaseLatenciesMetadata.Phase();
              t.readMessage(r, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.deserializeBinaryFromReader), a.addPhase(r);
              break;
            default:
              t.skipField();
              break;
          }
        }
        return a;
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.prototype.serializeBinary = function() {
        var a = new e.BinaryWriter();
        return proto.lens.LensOverlayPhaseLatenciesMetadata.serializeBinaryToWriter(this, a), a.getResultBuffer();
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.serializeBinaryToWriter = function(a, t) {
        var n = void 0;
        n = a.getPhaseList(), n.length > 0 && t.writeRepeatedMessage(
          1,
          n,
          proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.serializeBinaryToWriter
        );
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.ImageType = {
        UNKNOWN: 0,
        JPEG: 1,
        PNG: 2,
        WEBP: 3
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.oneofGroups_ = [[3, 4]], proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.PhaseDataCase = {
        PHASE_DATA_NOT_SET: 0,
        IMAGE_DOWNSCALE_DATA: 3,
        IMAGE_ENCODE_DATA: 4
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.prototype.getPhaseDataCase = function() {
        return (
          /** @type {proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.PhaseDataCase} */
          e.Message.computeOneofCase(this, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.oneofGroups_[0])
        );
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.prototype.toObject = function(a) {
        return proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.toObject(a, this);
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.toObject = function(a, t) {
        var n, r = {
          imageDownscaleData: (n = t.getImageDownscaleData()) && proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData.toObject(a, n),
          imageEncodeData: (n = t.getImageEncodeData()) && proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData.toObject(a, n)
        };
        return a && (r.$jspbMessageInstance = t), r;
      }), proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.deserializeBinary = function(a) {
        var t = new e.BinaryReader(a), n = new proto.lens.LensOverlayPhaseLatenciesMetadata.Phase();
        return proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.deserializeBinaryFromReader(n, t);
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.deserializeBinaryFromReader = function(a, t) {
        for (; t.nextField() && !t.isEndGroup(); ) {
          var n = t.getFieldNumber();
          switch (n) {
            case 3:
              var r = new proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData();
              t.readMessage(r, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData.deserializeBinaryFromReader), a.setImageDownscaleData(r);
              break;
            case 4:
              var r = new proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData();
              t.readMessage(r, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData.deserializeBinaryFromReader), a.setImageEncodeData(r);
              break;
            default:
              t.skipField();
              break;
          }
        }
        return a;
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.prototype.serializeBinary = function() {
        var a = new e.BinaryWriter();
        return proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.serializeBinaryToWriter(this, a), a.getResultBuffer();
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.serializeBinaryToWriter = function(a, t) {
        var n = void 0;
        n = a.getImageDownscaleData(), n != null && t.writeMessage(
          3,
          n,
          proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData.serializeBinaryToWriter
        ), n = a.getImageEncodeData(), n != null && t.writeMessage(
          4,
          n,
          proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData.serializeBinaryToWriter
        );
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData.prototype.toObject = function(a) {
        return proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData.toObject(a, this);
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData.toObject = function(a, t) {
        var n = {
          originalImageSize: e.Message.getFieldWithDefault(t, 1, 0),
          downscaledImageSize: e.Message.getFieldWithDefault(t, 2, 0)
        };
        return a && (n.$jspbMessageInstance = t), n;
      }), proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData.deserializeBinary = function(a) {
        var t = new e.BinaryReader(a), n = new proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData();
        return proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData.deserializeBinaryFromReader(n, t);
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData.deserializeBinaryFromReader = function(a, t) {
        for (; t.nextField() && !t.isEndGroup(); ) {
          var n = t.getFieldNumber();
          switch (n) {
            case 1:
              var r = (
                /** @type {number} */
                t.readInt64()
              );
              a.setOriginalImageSize(r);
              break;
            case 2:
              var r = (
                /** @type {number} */
                t.readInt64()
              );
              a.setDownscaledImageSize(r);
              break;
            default:
              t.skipField();
              break;
          }
        }
        return a;
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData.prototype.serializeBinary = function() {
        var a = new e.BinaryWriter();
        return proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData.serializeBinaryToWriter(this, a), a.getResultBuffer();
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData.serializeBinaryToWriter = function(a, t) {
        var n = void 0;
        n = a.getOriginalImageSize(), n !== 0 && t.writeInt64(
          1,
          n
        ), n = a.getDownscaledImageSize(), n !== 0 && t.writeInt64(
          2,
          n
        );
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData.prototype.getOriginalImageSize = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData.prototype.setOriginalImageSize = function(a) {
        return e.Message.setProto3IntField(this, 1, a);
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData.prototype.getDownscaledImageSize = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 2, 0)
        );
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData.prototype.setDownscaledImageSize = function(a) {
        return e.Message.setProto3IntField(this, 2, a);
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData.prototype.toObject = function(a) {
        return proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData.toObject(a, this);
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData.toObject = function(a, t) {
        var n = {
          originalImageType: e.Message.getFieldWithDefault(t, 1, 0),
          encodedImageSizeBytes: e.Message.getFieldWithDefault(t, 2, 0)
        };
        return a && (n.$jspbMessageInstance = t), n;
      }), proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData.deserializeBinary = function(a) {
        var t = new e.BinaryReader(a), n = new proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData();
        return proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData.deserializeBinaryFromReader(n, t);
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData.deserializeBinaryFromReader = function(a, t) {
        for (; t.nextField() && !t.isEndGroup(); ) {
          var n = t.getFieldNumber();
          switch (n) {
            case 1:
              var r = (
                /** @type {!proto.lens.LensOverlayPhaseLatenciesMetadata.ImageType} */
                t.readEnum()
              );
              a.setOriginalImageType(r);
              break;
            case 2:
              var r = (
                /** @type {number} */
                t.readInt64()
              );
              a.setEncodedImageSizeBytes(r);
              break;
            default:
              t.skipField();
              break;
          }
        }
        return a;
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData.prototype.serializeBinary = function() {
        var a = new e.BinaryWriter();
        return proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData.serializeBinaryToWriter(this, a), a.getResultBuffer();
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData.serializeBinaryToWriter = function(a, t) {
        var n = void 0;
        n = a.getOriginalImageType(), n !== 0 && t.writeEnum(
          1,
          n
        ), n = a.getEncodedImageSizeBytes(), n !== 0 && t.writeInt64(
          2,
          n
        );
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData.prototype.getOriginalImageType = function() {
        return (
          /** @type {!proto.lens.LensOverlayPhaseLatenciesMetadata.ImageType} */
          e.Message.getFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData.prototype.setOriginalImageType = function(a) {
        return e.Message.setProto3EnumField(this, 1, a);
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData.prototype.getEncodedImageSizeBytes = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 2, 0)
        );
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData.prototype.setEncodedImageSizeBytes = function(a) {
        return e.Message.setProto3IntField(this, 2, a);
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.prototype.getImageDownscaleData = function() {
        return (
          /** @type{?proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData} */
          e.Message.getWrapperField(this, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageDownscaleData, 3)
        );
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.prototype.setImageDownscaleData = function(a) {
        return e.Message.setOneofWrapperField(this, 3, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.oneofGroups_[0], a);
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.prototype.clearImageDownscaleData = function() {
        return this.setImageDownscaleData(void 0);
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.prototype.hasImageDownscaleData = function() {
        return e.Message.getField(this, 3) != null;
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.prototype.getImageEncodeData = function() {
        return (
          /** @type{?proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData} */
          e.Message.getWrapperField(this, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.ImageEncodeData, 4)
        );
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.prototype.setImageEncodeData = function(a) {
        return e.Message.setOneofWrapperField(this, 4, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.oneofGroups_[0], a);
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.prototype.clearImageEncodeData = function() {
        return this.setImageEncodeData(void 0);
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase.prototype.hasImageEncodeData = function() {
        return e.Message.getField(this, 4) != null;
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.prototype.getPhaseList = function() {
        return (
          /** @type{!Array<!proto.lens.LensOverlayPhaseLatenciesMetadata.Phase>} */
          e.Message.getRepeatedWrapperField(this, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase, 1)
        );
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.prototype.setPhaseList = function(a) {
        return e.Message.setRepeatedWrapperField(this, 1, a);
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.prototype.addPhase = function(a, t) {
        return e.Message.addToRepeatedWrapperField(this, 1, a, proto.lens.LensOverlayPhaseLatenciesMetadata.Phase, t);
      }, proto.lens.LensOverlayPhaseLatenciesMetadata.prototype.clearPhaseList = function() {
        return this.setPhaseList([]);
      }, i.object.extend(c, proto.lens);
    }(C)), C;
  }
  var re;
  function Ae() {
    return re || (re = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis, a = /* @__PURE__ */ Ne();
      i.object.extend(proto, a), i.exportSymbol("proto.lens.LensOverlayClientLogs", null, d), i.exportSymbol("proto.lens.LensOverlayClientLogs.LensOverlayEntryPoint", null, d), proto.lens.LensOverlayClientLogs = function(t) {
        e.Message.initialize(this, t, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayClientLogs, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayClientLogs.displayName = "proto.lens.LensOverlayClientLogs"), e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayClientLogs.prototype.toObject = function(t) {
        return proto.lens.LensOverlayClientLogs.toObject(t, this);
      }, proto.lens.LensOverlayClientLogs.toObject = function(t, n) {
        var r, o = {
          phaseLatenciesMetadata: (r = n.getPhaseLatenciesMetadata()) && a.LensOverlayPhaseLatenciesMetadata.toObject(t, r),
          lensOverlayEntryPoint: (r = e.Message.getField(n, 2)) == null ? void 0 : r,
          paellaId: (r = e.Message.getField(n, 3)) == null ? void 0 : r,
          metricsCollectionDisabled: (r = e.Message.getBooleanField(n, 5)) == null ? void 0 : r
        };
        return t && (o.$jspbMessageInstance = n), o;
      }), proto.lens.LensOverlayClientLogs.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.LensOverlayClientLogs();
        return proto.lens.LensOverlayClientLogs.deserializeBinaryFromReader(r, n);
      }, proto.lens.LensOverlayClientLogs.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = new a.LensOverlayPhaseLatenciesMetadata();
              n.readMessage(o, a.LensOverlayPhaseLatenciesMetadata.deserializeBinaryFromReader), t.setPhaseLatenciesMetadata(o);
              break;
            case 2:
              var o = (
                /** @type {!proto.lens.LensOverlayClientLogs.LensOverlayEntryPoint} */
                n.readEnum()
              );
              t.setLensOverlayEntryPoint(o);
              break;
            case 3:
              var o = (
                /** @type {number} */
                n.readUint64()
              );
              t.setPaellaId(o);
              break;
            case 5:
              var o = (
                /** @type {boolean} */
                n.readBool()
              );
              t.setMetricsCollectionDisabled(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.LensOverlayClientLogs.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.LensOverlayClientLogs.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.LensOverlayClientLogs.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getPhaseLatenciesMetadata(), r != null && n.writeMessage(
          1,
          r,
          a.LensOverlayPhaseLatenciesMetadata.serializeBinaryToWriter
        ), r = /** @type {!proto.lens.LensOverlayClientLogs.LensOverlayEntryPoint} */
        e.Message.getField(t, 2), r != null && n.writeEnum(
          2,
          r
        ), r = /** @type {number} */
        e.Message.getField(t, 3), r != null && n.writeUint64(
          3,
          r
        ), r = /** @type {boolean} */
        e.Message.getField(t, 5), r != null && n.writeBool(
          5,
          r
        );
      }, proto.lens.LensOverlayClientLogs.LensOverlayEntryPoint = {
        UNKNOWN_ENTRY_POINT: 0,
        APP_MENU: 1,
        PAGE_CONTEXT_MENU: 2,
        IMAGE_CONTEXT_MENU: 3,
        OMNIBOX_BUTTON: 4,
        TOOLBAR_BUTTON: 5,
        FIND_IN_PAGE: 6
      }, proto.lens.LensOverlayClientLogs.prototype.getPhaseLatenciesMetadata = function() {
        return (
          /** @type{?proto.lens.LensOverlayPhaseLatenciesMetadata} */
          e.Message.getWrapperField(this, a.LensOverlayPhaseLatenciesMetadata, 1)
        );
      }, proto.lens.LensOverlayClientLogs.prototype.setPhaseLatenciesMetadata = function(t) {
        return e.Message.setWrapperField(this, 1, t);
      }, proto.lens.LensOverlayClientLogs.prototype.clearPhaseLatenciesMetadata = function() {
        return this.setPhaseLatenciesMetadata(void 0);
      }, proto.lens.LensOverlayClientLogs.prototype.hasPhaseLatenciesMetadata = function() {
        return e.Message.getField(this, 1) != null;
      }, proto.lens.LensOverlayClientLogs.prototype.getLensOverlayEntryPoint = function() {
        return (
          /** @type {!proto.lens.LensOverlayClientLogs.LensOverlayEntryPoint} */
          e.Message.getFieldWithDefault(this, 2, 0)
        );
      }, proto.lens.LensOverlayClientLogs.prototype.setLensOverlayEntryPoint = function(t) {
        return e.Message.setField(this, 2, t);
      }, proto.lens.LensOverlayClientLogs.prototype.clearLensOverlayEntryPoint = function() {
        return e.Message.setField(this, 2, void 0);
      }, proto.lens.LensOverlayClientLogs.prototype.hasLensOverlayEntryPoint = function() {
        return e.Message.getField(this, 2) != null;
      }, proto.lens.LensOverlayClientLogs.prototype.getPaellaId = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 3, 0)
        );
      }, proto.lens.LensOverlayClientLogs.prototype.setPaellaId = function(t) {
        return e.Message.setField(this, 3, t);
      }, proto.lens.LensOverlayClientLogs.prototype.clearPaellaId = function() {
        return e.Message.setField(this, 3, void 0);
      }, proto.lens.LensOverlayClientLogs.prototype.hasPaellaId = function() {
        return e.Message.getField(this, 3) != null;
      }, proto.lens.LensOverlayClientLogs.prototype.getMetricsCollectionDisabled = function() {
        return (
          /** @type {boolean} */
          e.Message.getBooleanFieldWithDefault(this, 5, false)
        );
      }, proto.lens.LensOverlayClientLogs.prototype.setMetricsCollectionDisabled = function(t) {
        return e.Message.setField(this, 5, t);
      }, proto.lens.LensOverlayClientLogs.prototype.clearMetricsCollectionDisabled = function() {
        return e.Message.setField(this, 5, void 0);
      }, proto.lens.LensOverlayClientLogs.prototype.hasMetricsCollectionDisabled = function() {
        return e.Message.getField(this, 5) != null;
      }, i.object.extend(c, proto.lens);
    }(I)), I;
  }
  var D = {};
  var oe;
  function H() {
    return oe || (oe = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis;
      i.exportSymbol("proto.lens.LensOverlayRoutingInfo", null, d), proto.lens.LensOverlayRoutingInfo = function(a) {
        e.Message.initialize(this, a, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayRoutingInfo, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayRoutingInfo.displayName = "proto.lens.LensOverlayRoutingInfo"), e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayRoutingInfo.prototype.toObject = function(a) {
        return proto.lens.LensOverlayRoutingInfo.toObject(a, this);
      }, proto.lens.LensOverlayRoutingInfo.toObject = function(a, t) {
        var n = {
          serverAddress: e.Message.getFieldWithDefault(t, 1, ""),
          cellAddress: e.Message.getFieldWithDefault(t, 3, ""),
          bladeTarget: e.Message.getFieldWithDefault(t, 2, "")
        };
        return a && (n.$jspbMessageInstance = t), n;
      }), proto.lens.LensOverlayRoutingInfo.deserializeBinary = function(a) {
        var t = new e.BinaryReader(a), n = new proto.lens.LensOverlayRoutingInfo();
        return proto.lens.LensOverlayRoutingInfo.deserializeBinaryFromReader(n, t);
      }, proto.lens.LensOverlayRoutingInfo.deserializeBinaryFromReader = function(a, t) {
        for (; t.nextField() && !t.isEndGroup(); ) {
          var n = t.getFieldNumber();
          switch (n) {
            case 1:
              var r = (
                /** @type {string} */
                t.readString()
              );
              a.setServerAddress(r);
              break;
            case 3:
              var r = (
                /** @type {string} */
                t.readString()
              );
              a.setCellAddress(r);
              break;
            case 2:
              var r = (
                /** @type {string} */
                t.readString()
              );
              a.setBladeTarget(r);
              break;
            default:
              t.skipField();
              break;
          }
        }
        return a;
      }, proto.lens.LensOverlayRoutingInfo.prototype.serializeBinary = function() {
        var a = new e.BinaryWriter();
        return proto.lens.LensOverlayRoutingInfo.serializeBinaryToWriter(this, a), a.getResultBuffer();
      }, proto.lens.LensOverlayRoutingInfo.serializeBinaryToWriter = function(a, t) {
        var n = void 0;
        n = a.getServerAddress(), n.length > 0 && t.writeString(
          1,
          n
        ), n = a.getCellAddress(), n.length > 0 && t.writeString(
          3,
          n
        ), n = a.getBladeTarget(), n.length > 0 && t.writeString(
          2,
          n
        );
      }, proto.lens.LensOverlayRoutingInfo.prototype.getServerAddress = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 1, "")
        );
      }, proto.lens.LensOverlayRoutingInfo.prototype.setServerAddress = function(a) {
        return e.Message.setProto3StringField(this, 1, a);
      }, proto.lens.LensOverlayRoutingInfo.prototype.getCellAddress = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 3, "")
        );
      }, proto.lens.LensOverlayRoutingInfo.prototype.setCellAddress = function(a) {
        return e.Message.setProto3StringField(this, 3, a);
      }, proto.lens.LensOverlayRoutingInfo.prototype.getBladeTarget = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 2, "")
        );
      }, proto.lens.LensOverlayRoutingInfo.prototype.setBladeTarget = function(a) {
        return e.Message.setProto3StringField(this, 2, a);
      }, i.object.extend(c, proto.lens);
    }(D)), D;
  }
  var m = {};
  var x = {};
  var E = {};
  var ae;
  function Ce() {
    return ae || (ae = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis;
      i.exportSymbol("proto.lens.AppliedFilter", null, d), i.exportSymbol("proto.lens.AppliedFilter.FilterPayloadCase", null, d), i.exportSymbol("proto.lens.AppliedFilter.Translate", null, d), i.exportSymbol("proto.lens.AppliedFilters", null, d), i.exportSymbol("proto.lens.LensOverlayFilterType", null, d), proto.lens.AppliedFilter = function(a) {
        e.Message.initialize(this, a, 0, -1, null, proto.lens.AppliedFilter.oneofGroups_);
      }, i.inherits(proto.lens.AppliedFilter, e.Message), i.DEBUG && !COMPILED && (proto.lens.AppliedFilter.displayName = "proto.lens.AppliedFilter"), proto.lens.AppliedFilter.Translate = function(a) {
        e.Message.initialize(this, a, 0, -1, null, null);
      }, i.inherits(proto.lens.AppliedFilter.Translate, e.Message), i.DEBUG && !COMPILED && (proto.lens.AppliedFilter.Translate.displayName = "proto.lens.AppliedFilter.Translate"), proto.lens.AppliedFilters = function(a) {
        e.Message.initialize(this, a, 0, -1, proto.lens.AppliedFilters.repeatedFields_, null);
      }, i.inherits(proto.lens.AppliedFilters, e.Message), i.DEBUG && !COMPILED && (proto.lens.AppliedFilters.displayName = "proto.lens.AppliedFilters"), proto.lens.AppliedFilter.oneofGroups_ = [[3]], proto.lens.AppliedFilter.FilterPayloadCase = {
        FILTER_PAYLOAD_NOT_SET: 0,
        TRANSLATE: 3
      }, proto.lens.AppliedFilter.prototype.getFilterPayloadCase = function() {
        return (
          /** @type {proto.lens.AppliedFilter.FilterPayloadCase} */
          e.Message.computeOneofCase(this, proto.lens.AppliedFilter.oneofGroups_[0])
        );
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.AppliedFilter.prototype.toObject = function(a) {
        return proto.lens.AppliedFilter.toObject(a, this);
      }, proto.lens.AppliedFilter.toObject = function(a, t) {
        var n, r = {
          filterType: e.Message.getFieldWithDefault(t, 1, 0),
          translate: (n = t.getTranslate()) && proto.lens.AppliedFilter.Translate.toObject(a, n)
        };
        return a && (r.$jspbMessageInstance = t), r;
      }), proto.lens.AppliedFilter.deserializeBinary = function(a) {
        var t = new e.BinaryReader(a), n = new proto.lens.AppliedFilter();
        return proto.lens.AppliedFilter.deserializeBinaryFromReader(n, t);
      }, proto.lens.AppliedFilter.deserializeBinaryFromReader = function(a, t) {
        for (; t.nextField() && !t.isEndGroup(); ) {
          var n = t.getFieldNumber();
          switch (n) {
            case 1:
              var r = (
                /** @type {!proto.lens.LensOverlayFilterType} */
                t.readEnum()
              );
              a.setFilterType(r);
              break;
            case 3:
              var r = new proto.lens.AppliedFilter.Translate();
              t.readMessage(r, proto.lens.AppliedFilter.Translate.deserializeBinaryFromReader), a.setTranslate(r);
              break;
            default:
              t.skipField();
              break;
          }
        }
        return a;
      }, proto.lens.AppliedFilter.prototype.serializeBinary = function() {
        var a = new e.BinaryWriter();
        return proto.lens.AppliedFilter.serializeBinaryToWriter(this, a), a.getResultBuffer();
      }, proto.lens.AppliedFilter.serializeBinaryToWriter = function(a, t) {
        var n = void 0;
        n = a.getFilterType(), n !== 0 && t.writeEnum(
          1,
          n
        ), n = a.getTranslate(), n != null && t.writeMessage(
          3,
          n,
          proto.lens.AppliedFilter.Translate.serializeBinaryToWriter
        );
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.AppliedFilter.Translate.prototype.toObject = function(a) {
        return proto.lens.AppliedFilter.Translate.toObject(a, this);
      }, proto.lens.AppliedFilter.Translate.toObject = function(a, t) {
        var n = {
          targetLanguage: e.Message.getFieldWithDefault(t, 1, ""),
          sourceLanguage: e.Message.getFieldWithDefault(t, 2, "")
        };
        return a && (n.$jspbMessageInstance = t), n;
      }), proto.lens.AppliedFilter.Translate.deserializeBinary = function(a) {
        var t = new e.BinaryReader(a), n = new proto.lens.AppliedFilter.Translate();
        return proto.lens.AppliedFilter.Translate.deserializeBinaryFromReader(n, t);
      }, proto.lens.AppliedFilter.Translate.deserializeBinaryFromReader = function(a, t) {
        for (; t.nextField() && !t.isEndGroup(); ) {
          var n = t.getFieldNumber();
          switch (n) {
            case 1:
              var r = (
                /** @type {string} */
                t.readString()
              );
              a.setTargetLanguage(r);
              break;
            case 2:
              var r = (
                /** @type {string} */
                t.readString()
              );
              a.setSourceLanguage(r);
              break;
            default:
              t.skipField();
              break;
          }
        }
        return a;
      }, proto.lens.AppliedFilter.Translate.prototype.serializeBinary = function() {
        var a = new e.BinaryWriter();
        return proto.lens.AppliedFilter.Translate.serializeBinaryToWriter(this, a), a.getResultBuffer();
      }, proto.lens.AppliedFilter.Translate.serializeBinaryToWriter = function(a, t) {
        var n = void 0;
        n = a.getTargetLanguage(), n.length > 0 && t.writeString(
          1,
          n
        ), n = a.getSourceLanguage(), n.length > 0 && t.writeString(
          2,
          n
        );
      }, proto.lens.AppliedFilter.Translate.prototype.getTargetLanguage = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 1, "")
        );
      }, proto.lens.AppliedFilter.Translate.prototype.setTargetLanguage = function(a) {
        return e.Message.setProto3StringField(this, 1, a);
      }, proto.lens.AppliedFilter.Translate.prototype.getSourceLanguage = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 2, "")
        );
      }, proto.lens.AppliedFilter.Translate.prototype.setSourceLanguage = function(a) {
        return e.Message.setProto3StringField(this, 2, a);
      }, proto.lens.AppliedFilter.prototype.getFilterType = function() {
        return (
          /** @type {!proto.lens.LensOverlayFilterType} */
          e.Message.getFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.AppliedFilter.prototype.setFilterType = function(a) {
        return e.Message.setProto3EnumField(this, 1, a);
      }, proto.lens.AppliedFilter.prototype.getTranslate = function() {
        return (
          /** @type{?proto.lens.AppliedFilter.Translate} */
          e.Message.getWrapperField(this, proto.lens.AppliedFilter.Translate, 3)
        );
      }, proto.lens.AppliedFilter.prototype.setTranslate = function(a) {
        return e.Message.setOneofWrapperField(this, 3, proto.lens.AppliedFilter.oneofGroups_[0], a);
      }, proto.lens.AppliedFilter.prototype.clearTranslate = function() {
        return this.setTranslate(void 0);
      }, proto.lens.AppliedFilter.prototype.hasTranslate = function() {
        return e.Message.getField(this, 3) != null;
      }, proto.lens.AppliedFilters.repeatedFields_ = [1], e.Message.GENERATE_TO_OBJECT && (proto.lens.AppliedFilters.prototype.toObject = function(a) {
        return proto.lens.AppliedFilters.toObject(a, this);
      }, proto.lens.AppliedFilters.toObject = function(a, t) {
        var n = {
          filterList: e.Message.toObjectList(
            t.getFilterList(),
            proto.lens.AppliedFilter.toObject,
            a
          )
        };
        return a && (n.$jspbMessageInstance = t), n;
      }), proto.lens.AppliedFilters.deserializeBinary = function(a) {
        var t = new e.BinaryReader(a), n = new proto.lens.AppliedFilters();
        return proto.lens.AppliedFilters.deserializeBinaryFromReader(n, t);
      }, proto.lens.AppliedFilters.deserializeBinaryFromReader = function(a, t) {
        for (; t.nextField() && !t.isEndGroup(); ) {
          var n = t.getFieldNumber();
          switch (n) {
            case 1:
              var r = new proto.lens.AppliedFilter();
              t.readMessage(r, proto.lens.AppliedFilter.deserializeBinaryFromReader), a.addFilter(r);
              break;
            default:
              t.skipField();
              break;
          }
        }
        return a;
      }, proto.lens.AppliedFilters.prototype.serializeBinary = function() {
        var a = new e.BinaryWriter();
        return proto.lens.AppliedFilters.serializeBinaryToWriter(this, a), a.getResultBuffer();
      }, proto.lens.AppliedFilters.serializeBinaryToWriter = function(a, t) {
        var n = void 0;
        n = a.getFilterList(), n.length > 0 && t.writeRepeatedMessage(
          1,
          n,
          proto.lens.AppliedFilter.serializeBinaryToWriter
        );
      }, proto.lens.AppliedFilters.prototype.getFilterList = function() {
        return (
          /** @type{!Array<!proto.lens.AppliedFilter>} */
          e.Message.getRepeatedWrapperField(this, proto.lens.AppliedFilter, 1)
        );
      }, proto.lens.AppliedFilters.prototype.setFilterList = function(a) {
        return e.Message.setRepeatedWrapperField(this, 1, a);
      }, proto.lens.AppliedFilters.prototype.addFilter = function(a, t) {
        return e.Message.addToRepeatedWrapperField(this, 1, a, proto.lens.AppliedFilter, t);
      }, proto.lens.AppliedFilters.prototype.clearFilterList = function() {
        return this.setFilterList([]);
      }, proto.lens.LensOverlayFilterType = {
        UNKNOWN_FILTER_TYPE: 0,
        TRANSLATE: 2,
        AUTO_FILTER: 7
      }, i.object.extend(c, proto.lens);
    }(E)), E;
  }
  var P = {};
  var se;
  function Ue() {
    return se || (se = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis;
      i.exportSymbol("proto.lens.Platform", null, d), proto.lens.Platform = {
        PLATFORM_UNSPECIFIED: 0,
        PLATFORM_WEB: 3,
        PLATFORM_LENS_OVERLAY: 6
      }, i.object.extend(c, proto.lens);
    }(P)), P;
  }
  var W = {};
  var ie;
  function Ve() {
    return ie || (ie = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis;
      i.exportSymbol("proto.lens.Surface", null, d), proto.lens.Surface = {
        SURFACE_UNSPECIFIED: 0,
        SURFACE_CHROMIUM: 4,
        SURFACE_LENS_OVERLAY: 42
      }, i.object.extend(c, proto.lens);
    }(W)), W;
  }
  var le;
  function De() {
    return le || (le = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis, a = /* @__PURE__ */ Ce();
      i.object.extend(proto, a);
      var t = /* @__PURE__ */ Ue();
      i.object.extend(proto, t);
      var n = /* @__PURE__ */ Ve();
      i.object.extend(proto, n), i.exportSymbol("proto.lens.ClientLoggingData", null, d), i.exportSymbol("proto.lens.LensOverlayClientContext", null, d), i.exportSymbol("proto.lens.LensRenderingEnvironment", null, d), i.exportSymbol("proto.lens.LocaleContext", null, d), i.exportSymbol("proto.lens.RenderingContext", null, d), proto.lens.LensOverlayClientContext = function(r) {
        e.Message.initialize(this, r, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayClientContext, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayClientContext.displayName = "proto.lens.LensOverlayClientContext"), proto.lens.LocaleContext = function(r) {
        e.Message.initialize(this, r, 0, -1, null, null);
      }, i.inherits(proto.lens.LocaleContext, e.Message), i.DEBUG && !COMPILED && (proto.lens.LocaleContext.displayName = "proto.lens.LocaleContext"), proto.lens.RenderingContext = function(r) {
        e.Message.initialize(this, r, 0, -1, null, null);
      }, i.inherits(proto.lens.RenderingContext, e.Message), i.DEBUG && !COMPILED && (proto.lens.RenderingContext.displayName = "proto.lens.RenderingContext"), proto.lens.ClientLoggingData = function(r) {
        e.Message.initialize(this, r, 0, -1, null, null);
      }, i.inherits(proto.lens.ClientLoggingData, e.Message), i.DEBUG && !COMPILED && (proto.lens.ClientLoggingData.displayName = "proto.lens.ClientLoggingData"), e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayClientContext.prototype.toObject = function(r) {
        return proto.lens.LensOverlayClientContext.toObject(r, this);
      }, proto.lens.LensOverlayClientContext.toObject = function(r, o) {
        var u, g = {
          platform: e.Message.getFieldWithDefault(o, 1, 0),
          surface: e.Message.getFieldWithDefault(o, 2, 0),
          localeContext: (u = o.getLocaleContext()) && proto.lens.LocaleContext.toObject(r, u),
          appId: e.Message.getFieldWithDefault(o, 6, ""),
          clientFilters: (u = o.getClientFilters()) && a.AppliedFilters.toObject(r, u),
          renderingContext: (u = o.getRenderingContext()) && proto.lens.RenderingContext.toObject(r, u),
          clientLoggingData: (u = o.getClientLoggingData()) && proto.lens.ClientLoggingData.toObject(r, u)
        };
        return r && (g.$jspbMessageInstance = o), g;
      }), proto.lens.LensOverlayClientContext.deserializeBinary = function(r) {
        var o = new e.BinaryReader(r), u = new proto.lens.LensOverlayClientContext();
        return proto.lens.LensOverlayClientContext.deserializeBinaryFromReader(u, o);
      }, proto.lens.LensOverlayClientContext.deserializeBinaryFromReader = function(r, o) {
        for (; o.nextField() && !o.isEndGroup(); ) {
          var u = o.getFieldNumber();
          switch (u) {
            case 1:
              var g = (
                /** @type {!proto.lens.Platform} */
                o.readEnum()
              );
              r.setPlatform(g);
              break;
            case 2:
              var g = (
                /** @type {!proto.lens.Surface} */
                o.readEnum()
              );
              r.setSurface(g);
              break;
            case 4:
              var g = new proto.lens.LocaleContext();
              o.readMessage(g, proto.lens.LocaleContext.deserializeBinaryFromReader), r.setLocaleContext(g);
              break;
            case 6:
              var g = (
                /** @type {string} */
                o.readString()
              );
              r.setAppId(g);
              break;
            case 17:
              var g = new a.AppliedFilters();
              o.readMessage(g, a.AppliedFilters.deserializeBinaryFromReader), r.setClientFilters(g);
              break;
            case 20:
              var g = new proto.lens.RenderingContext();
              o.readMessage(g, proto.lens.RenderingContext.deserializeBinaryFromReader), r.setRenderingContext(g);
              break;
            case 23:
              var g = new proto.lens.ClientLoggingData();
              o.readMessage(g, proto.lens.ClientLoggingData.deserializeBinaryFromReader), r.setClientLoggingData(g);
              break;
            default:
              o.skipField();
              break;
          }
        }
        return r;
      }, proto.lens.LensOverlayClientContext.prototype.serializeBinary = function() {
        var r = new e.BinaryWriter();
        return proto.lens.LensOverlayClientContext.serializeBinaryToWriter(this, r), r.getResultBuffer();
      }, proto.lens.LensOverlayClientContext.serializeBinaryToWriter = function(r, o) {
        var u = void 0;
        u = r.getPlatform(), u !== 0 && o.writeEnum(
          1,
          u
        ), u = r.getSurface(), u !== 0 && o.writeEnum(
          2,
          u
        ), u = r.getLocaleContext(), u != null && o.writeMessage(
          4,
          u,
          proto.lens.LocaleContext.serializeBinaryToWriter
        ), u = r.getAppId(), u.length > 0 && o.writeString(
          6,
          u
        ), u = r.getClientFilters(), u != null && o.writeMessage(
          17,
          u,
          a.AppliedFilters.serializeBinaryToWriter
        ), u = r.getRenderingContext(), u != null && o.writeMessage(
          20,
          u,
          proto.lens.RenderingContext.serializeBinaryToWriter
        ), u = r.getClientLoggingData(), u != null && o.writeMessage(
          23,
          u,
          proto.lens.ClientLoggingData.serializeBinaryToWriter
        );
      }, proto.lens.LensOverlayClientContext.prototype.getPlatform = function() {
        return (
          /** @type {!proto.lens.Platform} */
          e.Message.getFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.LensOverlayClientContext.prototype.setPlatform = function(r) {
        return e.Message.setProto3EnumField(this, 1, r);
      }, proto.lens.LensOverlayClientContext.prototype.getSurface = function() {
        return (
          /** @type {!proto.lens.Surface} */
          e.Message.getFieldWithDefault(this, 2, 0)
        );
      }, proto.lens.LensOverlayClientContext.prototype.setSurface = function(r) {
        return e.Message.setProto3EnumField(this, 2, r);
      }, proto.lens.LensOverlayClientContext.prototype.getLocaleContext = function() {
        return (
          /** @type{?proto.lens.LocaleContext} */
          e.Message.getWrapperField(this, proto.lens.LocaleContext, 4)
        );
      }, proto.lens.LensOverlayClientContext.prototype.setLocaleContext = function(r) {
        return e.Message.setWrapperField(this, 4, r);
      }, proto.lens.LensOverlayClientContext.prototype.clearLocaleContext = function() {
        return this.setLocaleContext(void 0);
      }, proto.lens.LensOverlayClientContext.prototype.hasLocaleContext = function() {
        return e.Message.getField(this, 4) != null;
      }, proto.lens.LensOverlayClientContext.prototype.getAppId = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 6, "")
        );
      }, proto.lens.LensOverlayClientContext.prototype.setAppId = function(r) {
        return e.Message.setProto3StringField(this, 6, r);
      }, proto.lens.LensOverlayClientContext.prototype.getClientFilters = function() {
        return (
          /** @type{?proto.lens.AppliedFilters} */
          e.Message.getWrapperField(this, a.AppliedFilters, 17)
        );
      }, proto.lens.LensOverlayClientContext.prototype.setClientFilters = function(r) {
        return e.Message.setWrapperField(this, 17, r);
      }, proto.lens.LensOverlayClientContext.prototype.clearClientFilters = function() {
        return this.setClientFilters(void 0);
      }, proto.lens.LensOverlayClientContext.prototype.hasClientFilters = function() {
        return e.Message.getField(this, 17) != null;
      }, proto.lens.LensOverlayClientContext.prototype.getRenderingContext = function() {
        return (
          /** @type{?proto.lens.RenderingContext} */
          e.Message.getWrapperField(this, proto.lens.RenderingContext, 20)
        );
      }, proto.lens.LensOverlayClientContext.prototype.setRenderingContext = function(r) {
        return e.Message.setWrapperField(this, 20, r);
      }, proto.lens.LensOverlayClientContext.prototype.clearRenderingContext = function() {
        return this.setRenderingContext(void 0);
      }, proto.lens.LensOverlayClientContext.prototype.hasRenderingContext = function() {
        return e.Message.getField(this, 20) != null;
      }, proto.lens.LensOverlayClientContext.prototype.getClientLoggingData = function() {
        return (
          /** @type{?proto.lens.ClientLoggingData} */
          e.Message.getWrapperField(this, proto.lens.ClientLoggingData, 23)
        );
      }, proto.lens.LensOverlayClientContext.prototype.setClientLoggingData = function(r) {
        return e.Message.setWrapperField(this, 23, r);
      }, proto.lens.LensOverlayClientContext.prototype.clearClientLoggingData = function() {
        return this.setClientLoggingData(void 0);
      }, proto.lens.LensOverlayClientContext.prototype.hasClientLoggingData = function() {
        return e.Message.getField(this, 23) != null;
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.LocaleContext.prototype.toObject = function(r) {
        return proto.lens.LocaleContext.toObject(r, this);
      }, proto.lens.LocaleContext.toObject = function(r, o) {
        var u = {
          language: e.Message.getFieldWithDefault(o, 1, ""),
          region: e.Message.getFieldWithDefault(o, 2, ""),
          timeZone: e.Message.getFieldWithDefault(o, 3, "")
        };
        return r && (u.$jspbMessageInstance = o), u;
      }), proto.lens.LocaleContext.deserializeBinary = function(r) {
        var o = new e.BinaryReader(r), u = new proto.lens.LocaleContext();
        return proto.lens.LocaleContext.deserializeBinaryFromReader(u, o);
      }, proto.lens.LocaleContext.deserializeBinaryFromReader = function(r, o) {
        for (; o.nextField() && !o.isEndGroup(); ) {
          var u = o.getFieldNumber();
          switch (u) {
            case 1:
              var g = (
                /** @type {string} */
                o.readString()
              );
              r.setLanguage(g);
              break;
            case 2:
              var g = (
                /** @type {string} */
                o.readString()
              );
              r.setRegion(g);
              break;
            case 3:
              var g = (
                /** @type {string} */
                o.readString()
              );
              r.setTimeZone(g);
              break;
            default:
              o.skipField();
              break;
          }
        }
        return r;
      }, proto.lens.LocaleContext.prototype.serializeBinary = function() {
        var r = new e.BinaryWriter();
        return proto.lens.LocaleContext.serializeBinaryToWriter(this, r), r.getResultBuffer();
      }, proto.lens.LocaleContext.serializeBinaryToWriter = function(r, o) {
        var u = void 0;
        u = r.getLanguage(), u.length > 0 && o.writeString(
          1,
          u
        ), u = r.getRegion(), u.length > 0 && o.writeString(
          2,
          u
        ), u = r.getTimeZone(), u.length > 0 && o.writeString(
          3,
          u
        );
      }, proto.lens.LocaleContext.prototype.getLanguage = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 1, "")
        );
      }, proto.lens.LocaleContext.prototype.setLanguage = function(r) {
        return e.Message.setProto3StringField(this, 1, r);
      }, proto.lens.LocaleContext.prototype.getRegion = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 2, "")
        );
      }, proto.lens.LocaleContext.prototype.setRegion = function(r) {
        return e.Message.setProto3StringField(this, 2, r);
      }, proto.lens.LocaleContext.prototype.getTimeZone = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 3, "")
        );
      }, proto.lens.LocaleContext.prototype.setTimeZone = function(r) {
        return e.Message.setProto3StringField(this, 3, r);
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.RenderingContext.prototype.toObject = function(r) {
        return proto.lens.RenderingContext.toObject(r, this);
      }, proto.lens.RenderingContext.toObject = function(r, o) {
        var u = {
          renderingEnvironment: e.Message.getFieldWithDefault(o, 2, 0)
        };
        return r && (u.$jspbMessageInstance = o), u;
      }), proto.lens.RenderingContext.deserializeBinary = function(r) {
        var o = new e.BinaryReader(r), u = new proto.lens.RenderingContext();
        return proto.lens.RenderingContext.deserializeBinaryFromReader(u, o);
      }, proto.lens.RenderingContext.deserializeBinaryFromReader = function(r, o) {
        for (; o.nextField() && !o.isEndGroup(); ) {
          var u = o.getFieldNumber();
          switch (u) {
            case 2:
              var g = (
                /** @type {!proto.lens.LensRenderingEnvironment} */
                o.readEnum()
              );
              r.setRenderingEnvironment(g);
              break;
            default:
              o.skipField();
              break;
          }
        }
        return r;
      }, proto.lens.RenderingContext.prototype.serializeBinary = function() {
        var r = new e.BinaryWriter();
        return proto.lens.RenderingContext.serializeBinaryToWriter(this, r), r.getResultBuffer();
      }, proto.lens.RenderingContext.serializeBinaryToWriter = function(r, o) {
        var u = void 0;
        u = r.getRenderingEnvironment(), u !== 0 && o.writeEnum(
          2,
          u
        );
      }, proto.lens.RenderingContext.prototype.getRenderingEnvironment = function() {
        return (
          /** @type {!proto.lens.LensRenderingEnvironment} */
          e.Message.getFieldWithDefault(this, 2, 0)
        );
      }, proto.lens.RenderingContext.prototype.setRenderingEnvironment = function(r) {
        return e.Message.setProto3EnumField(this, 2, r);
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.ClientLoggingData.prototype.toObject = function(r) {
        return proto.lens.ClientLoggingData.toObject(r, this);
      }, proto.lens.ClientLoggingData.toObject = function(r, o) {
        var u = {
          isHistoryEligible: e.Message.getBooleanFieldWithDefault(o, 1, false)
        };
        return r && (u.$jspbMessageInstance = o), u;
      }), proto.lens.ClientLoggingData.deserializeBinary = function(r) {
        var o = new e.BinaryReader(r), u = new proto.lens.ClientLoggingData();
        return proto.lens.ClientLoggingData.deserializeBinaryFromReader(u, o);
      }, proto.lens.ClientLoggingData.deserializeBinaryFromReader = function(r, o) {
        for (; o.nextField() && !o.isEndGroup(); ) {
          var u = o.getFieldNumber();
          switch (u) {
            case 1:
              var g = (
                /** @type {boolean} */
                o.readBool()
              );
              r.setIsHistoryEligible(g);
              break;
            default:
              o.skipField();
              break;
          }
        }
        return r;
      }, proto.lens.ClientLoggingData.prototype.serializeBinary = function() {
        var r = new e.BinaryWriter();
        return proto.lens.ClientLoggingData.serializeBinaryToWriter(this, r), r.getResultBuffer();
      }, proto.lens.ClientLoggingData.serializeBinaryToWriter = function(r, o) {
        var u = void 0;
        u = r.getIsHistoryEligible(), u && o.writeBool(
          1,
          u
        );
      }, proto.lens.ClientLoggingData.prototype.getIsHistoryEligible = function() {
        return (
          /** @type {boolean} */
          e.Message.getBooleanFieldWithDefault(this, 1, false)
        );
      }, proto.lens.ClientLoggingData.prototype.setIsHistoryEligible = function(r) {
        return e.Message.setProto3BooleanField(this, 1, r);
      }, proto.lens.LensRenderingEnvironment = {
        RENDERING_ENV_UNSPECIFIED: 0,
        RENDERING_ENV_LENS_OVERLAY: 14
      }, i.object.extend(c, proto.lens);
    }(x)), x;
  }
  var _ = {};
  var pe;
  function $e() {
    return pe || (pe = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis, a = /* @__PURE__ */ H();
      i.object.extend(proto, a), i.exportSymbol("proto.lens.LensOverlayClusterInfo", null, d), proto.lens.LensOverlayClusterInfo = function(t) {
        e.Message.initialize(this, t, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayClusterInfo, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayClusterInfo.displayName = "proto.lens.LensOverlayClusterInfo"), e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayClusterInfo.prototype.toObject = function(t) {
        return proto.lens.LensOverlayClusterInfo.toObject(t, this);
      }, proto.lens.LensOverlayClusterInfo.toObject = function(t, n) {
        var r, o = {
          serverSessionId: e.Message.getFieldWithDefault(n, 1, ""),
          searchSessionId: e.Message.getFieldWithDefault(n, 2, ""),
          routingInfo: (r = n.getRoutingInfo()) && a.LensOverlayRoutingInfo.toObject(t, r)
        };
        return t && (o.$jspbMessageInstance = n), o;
      }), proto.lens.LensOverlayClusterInfo.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.LensOverlayClusterInfo();
        return proto.lens.LensOverlayClusterInfo.deserializeBinaryFromReader(r, n);
      }, proto.lens.LensOverlayClusterInfo.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = (
                /** @type {string} */
                n.readString()
              );
              t.setServerSessionId(o);
              break;
            case 2:
              var o = (
                /** @type {string} */
                n.readString()
              );
              t.setSearchSessionId(o);
              break;
            case 6:
              var o = new a.LensOverlayRoutingInfo();
              n.readMessage(o, a.LensOverlayRoutingInfo.deserializeBinaryFromReader), t.setRoutingInfo(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.LensOverlayClusterInfo.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.LensOverlayClusterInfo.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.LensOverlayClusterInfo.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getServerSessionId(), r.length > 0 && n.writeString(
          1,
          r
        ), r = t.getSearchSessionId(), r.length > 0 && n.writeString(
          2,
          r
        ), r = t.getRoutingInfo(), r != null && n.writeMessage(
          6,
          r,
          a.LensOverlayRoutingInfo.serializeBinaryToWriter
        );
      }, proto.lens.LensOverlayClusterInfo.prototype.getServerSessionId = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 1, "")
        );
      }, proto.lens.LensOverlayClusterInfo.prototype.setServerSessionId = function(t) {
        return e.Message.setProto3StringField(this, 1, t);
      }, proto.lens.LensOverlayClusterInfo.prototype.getSearchSessionId = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 2, "")
        );
      }, proto.lens.LensOverlayClusterInfo.prototype.setSearchSessionId = function(t) {
        return e.Message.setProto3StringField(this, 2, t);
      }, proto.lens.LensOverlayClusterInfo.prototype.getRoutingInfo = function() {
        return (
          /** @type{?proto.lens.LensOverlayRoutingInfo} */
          e.Message.getWrapperField(this, a.LensOverlayRoutingInfo, 6)
        );
      }, proto.lens.LensOverlayClusterInfo.prototype.setRoutingInfo = function(t) {
        return e.Message.setWrapperField(this, 6, t);
      }, proto.lens.LensOverlayClusterInfo.prototype.clearRoutingInfo = function() {
        return this.setRoutingInfo(void 0);
      }, proto.lens.LensOverlayClusterInfo.prototype.hasRoutingInfo = function() {
        return e.Message.getField(this, 6) != null;
      }, i.object.extend(c, proto.lens);
    }(_)), _;
  }
  var w = {};
  var j = {};
  var S = {};
  var k = {};
  var ue;
  function Qe() {
    return ue || (ue = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis;
      i.exportSymbol("proto.lens.CoordinateType", null, d), i.exportSymbol("proto.lens.Polygon", null, d), i.exportSymbol("proto.lens.Polygon.Vertex", null, d), i.exportSymbol("proto.lens.Polygon.VertexOrdering", null, d), proto.lens.Polygon = function(a) {
        e.Message.initialize(this, a, 0, -1, proto.lens.Polygon.repeatedFields_, null);
      }, i.inherits(proto.lens.Polygon, e.Message), i.DEBUG && !COMPILED && (proto.lens.Polygon.displayName = "proto.lens.Polygon"), proto.lens.Polygon.Vertex = function(a) {
        e.Message.initialize(this, a, 0, -1, null, null);
      }, i.inherits(proto.lens.Polygon.Vertex, e.Message), i.DEBUG && !COMPILED && (proto.lens.Polygon.Vertex.displayName = "proto.lens.Polygon.Vertex"), proto.lens.Polygon.repeatedFields_ = [1], e.Message.GENERATE_TO_OBJECT && (proto.lens.Polygon.prototype.toObject = function(a) {
        return proto.lens.Polygon.toObject(a, this);
      }, proto.lens.Polygon.toObject = function(a, t) {
        var n = {
          vertexList: e.Message.toObjectList(
            t.getVertexList(),
            proto.lens.Polygon.Vertex.toObject,
            a
          ),
          vertexOrdering: e.Message.getFieldWithDefault(t, 2, 0),
          coordinateType: e.Message.getFieldWithDefault(t, 3, 0)
        };
        return a && (n.$jspbMessageInstance = t), n;
      }), proto.lens.Polygon.deserializeBinary = function(a) {
        var t = new e.BinaryReader(a), n = new proto.lens.Polygon();
        return proto.lens.Polygon.deserializeBinaryFromReader(n, t);
      }, proto.lens.Polygon.deserializeBinaryFromReader = function(a, t) {
        for (; t.nextField() && !t.isEndGroup(); ) {
          var n = t.getFieldNumber();
          switch (n) {
            case 1:
              var r = new proto.lens.Polygon.Vertex();
              t.readMessage(r, proto.lens.Polygon.Vertex.deserializeBinaryFromReader), a.addVertex(r);
              break;
            case 2:
              var r = (
                /** @type {!proto.lens.Polygon.VertexOrdering} */
                t.readEnum()
              );
              a.setVertexOrdering(r);
              break;
            case 3:
              var r = (
                /** @type {!proto.lens.CoordinateType} */
                t.readEnum()
              );
              a.setCoordinateType(r);
              break;
            default:
              t.skipField();
              break;
          }
        }
        return a;
      }, proto.lens.Polygon.prototype.serializeBinary = function() {
        var a = new e.BinaryWriter();
        return proto.lens.Polygon.serializeBinaryToWriter(this, a), a.getResultBuffer();
      }, proto.lens.Polygon.serializeBinaryToWriter = function(a, t) {
        var n = void 0;
        n = a.getVertexList(), n.length > 0 && t.writeRepeatedMessage(
          1,
          n,
          proto.lens.Polygon.Vertex.serializeBinaryToWriter
        ), n = a.getVertexOrdering(), n !== 0 && t.writeEnum(
          2,
          n
        ), n = a.getCoordinateType(), n !== 0 && t.writeEnum(
          3,
          n
        );
      }, proto.lens.Polygon.VertexOrdering = {
        VERTEX_ORDERING_UNSPECIFIED: 0,
        CLOCKWISE: 1,
        COUNTER_CLOCKWISE: 2
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.Polygon.Vertex.prototype.toObject = function(a) {
        return proto.lens.Polygon.Vertex.toObject(a, this);
      }, proto.lens.Polygon.Vertex.toObject = function(a, t) {
        var n = {
          x: e.Message.getFloatingPointFieldWithDefault(t, 1, 0),
          y: e.Message.getFloatingPointFieldWithDefault(t, 2, 0)
        };
        return a && (n.$jspbMessageInstance = t), n;
      }), proto.lens.Polygon.Vertex.deserializeBinary = function(a) {
        var t = new e.BinaryReader(a), n = new proto.lens.Polygon.Vertex();
        return proto.lens.Polygon.Vertex.deserializeBinaryFromReader(n, t);
      }, proto.lens.Polygon.Vertex.deserializeBinaryFromReader = function(a, t) {
        for (; t.nextField() && !t.isEndGroup(); ) {
          var n = t.getFieldNumber();
          switch (n) {
            case 1:
              var r = (
                /** @type {number} */
                t.readFloat()
              );
              a.setX(r);
              break;
            case 2:
              var r = (
                /** @type {number} */
                t.readFloat()
              );
              a.setY(r);
              break;
            default:
              t.skipField();
              break;
          }
        }
        return a;
      }, proto.lens.Polygon.Vertex.prototype.serializeBinary = function() {
        var a = new e.BinaryWriter();
        return proto.lens.Polygon.Vertex.serializeBinaryToWriter(this, a), a.getResultBuffer();
      }, proto.lens.Polygon.Vertex.serializeBinaryToWriter = function(a, t) {
        var n = void 0;
        n = a.getX(), n !== 0 && t.writeFloat(
          1,
          n
        ), n = a.getY(), n !== 0 && t.writeFloat(
          2,
          n
        );
      }, proto.lens.Polygon.Vertex.prototype.getX = function() {
        return (
          /** @type {number} */
          e.Message.getFloatingPointFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.Polygon.Vertex.prototype.setX = function(a) {
        return e.Message.setProto3FloatField(this, 1, a);
      }, proto.lens.Polygon.Vertex.prototype.getY = function() {
        return (
          /** @type {number} */
          e.Message.getFloatingPointFieldWithDefault(this, 2, 0)
        );
      }, proto.lens.Polygon.Vertex.prototype.setY = function(a) {
        return e.Message.setProto3FloatField(this, 2, a);
      }, proto.lens.Polygon.prototype.getVertexList = function() {
        return (
          /** @type{!Array<!proto.lens.Polygon.Vertex>} */
          e.Message.getRepeatedWrapperField(this, proto.lens.Polygon.Vertex, 1)
        );
      }, proto.lens.Polygon.prototype.setVertexList = function(a) {
        return e.Message.setRepeatedWrapperField(this, 1, a);
      }, proto.lens.Polygon.prototype.addVertex = function(a, t) {
        return e.Message.addToRepeatedWrapperField(this, 1, a, proto.lens.Polygon.Vertex, t);
      }, proto.lens.Polygon.prototype.clearVertexList = function() {
        return this.setVertexList([]);
      }, proto.lens.Polygon.prototype.getVertexOrdering = function() {
        return (
          /** @type {!proto.lens.Polygon.VertexOrdering} */
          e.Message.getFieldWithDefault(this, 2, 0)
        );
      }, proto.lens.Polygon.prototype.setVertexOrdering = function(a) {
        return e.Message.setProto3EnumField(this, 2, a);
      }, proto.lens.Polygon.prototype.getCoordinateType = function() {
        return (
          /** @type {!proto.lens.CoordinateType} */
          e.Message.getFieldWithDefault(this, 3, 0)
        );
      }, proto.lens.Polygon.prototype.setCoordinateType = function(a) {
        return e.Message.setProto3EnumField(this, 3, a);
      }, proto.lens.CoordinateType = {
        COORDINATE_TYPE_UNSPECIFIED: 0,
        NORMALIZED: 1,
        IMAGE: 2
      }, i.object.extend(c, proto.lens);
    }(k)), k;
  }
  var de;
  function R() {
    return de || (de = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis, a = /* @__PURE__ */ Qe();
      i.object.extend(proto, a), i.exportSymbol("proto.lens.CenterRotatedBox", null, d), i.exportSymbol("proto.lens.Geometry", null, d), i.exportSymbol("proto.lens.ZoomedCrop", null, d), proto.lens.CenterRotatedBox = function(t) {
        e.Message.initialize(this, t, 0, -1, null, null);
      }, i.inherits(proto.lens.CenterRotatedBox, e.Message), i.DEBUG && !COMPILED && (proto.lens.CenterRotatedBox.displayName = "proto.lens.CenterRotatedBox"), proto.lens.Geometry = function(t) {
        e.Message.initialize(this, t, 0, -1, proto.lens.Geometry.repeatedFields_, null);
      }, i.inherits(proto.lens.Geometry, e.Message), i.DEBUG && !COMPILED && (proto.lens.Geometry.displayName = "proto.lens.Geometry"), proto.lens.ZoomedCrop = function(t) {
        e.Message.initialize(this, t, 0, -1, null, null);
      }, i.inherits(proto.lens.ZoomedCrop, e.Message), i.DEBUG && !COMPILED && (proto.lens.ZoomedCrop.displayName = "proto.lens.ZoomedCrop"), e.Message.GENERATE_TO_OBJECT && (proto.lens.CenterRotatedBox.prototype.toObject = function(t) {
        return proto.lens.CenterRotatedBox.toObject(t, this);
      }, proto.lens.CenterRotatedBox.toObject = function(t, n) {
        var r = {
          centerX: e.Message.getFloatingPointFieldWithDefault(n, 1, 0),
          centerY: e.Message.getFloatingPointFieldWithDefault(n, 2, 0),
          width: e.Message.getFloatingPointFieldWithDefault(n, 3, 0),
          height: e.Message.getFloatingPointFieldWithDefault(n, 4, 0),
          rotationZ: e.Message.getFloatingPointFieldWithDefault(n, 5, 0),
          coordinateType: e.Message.getFieldWithDefault(n, 6, 0)
        };
        return t && (r.$jspbMessageInstance = n), r;
      }), proto.lens.CenterRotatedBox.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.CenterRotatedBox();
        return proto.lens.CenterRotatedBox.deserializeBinaryFromReader(r, n);
      }, proto.lens.CenterRotatedBox.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = (
                /** @type {number} */
                n.readFloat()
              );
              t.setCenterX(o);
              break;
            case 2:
              var o = (
                /** @type {number} */
                n.readFloat()
              );
              t.setCenterY(o);
              break;
            case 3:
              var o = (
                /** @type {number} */
                n.readFloat()
              );
              t.setWidth(o);
              break;
            case 4:
              var o = (
                /** @type {number} */
                n.readFloat()
              );
              t.setHeight(o);
              break;
            case 5:
              var o = (
                /** @type {number} */
                n.readFloat()
              );
              t.setRotationZ(o);
              break;
            case 6:
              var o = (
                /** @type {!proto.lens.CoordinateType} */
                n.readEnum()
              );
              t.setCoordinateType(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.CenterRotatedBox.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.CenterRotatedBox.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.CenterRotatedBox.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getCenterX(), r !== 0 && n.writeFloat(
          1,
          r
        ), r = t.getCenterY(), r !== 0 && n.writeFloat(
          2,
          r
        ), r = t.getWidth(), r !== 0 && n.writeFloat(
          3,
          r
        ), r = t.getHeight(), r !== 0 && n.writeFloat(
          4,
          r
        ), r = t.getRotationZ(), r !== 0 && n.writeFloat(
          5,
          r
        ), r = t.getCoordinateType(), r !== 0 && n.writeEnum(
          6,
          r
        );
      }, proto.lens.CenterRotatedBox.prototype.getCenterX = function() {
        return (
          /** @type {number} */
          e.Message.getFloatingPointFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.CenterRotatedBox.prototype.setCenterX = function(t) {
        return e.Message.setProto3FloatField(this, 1, t);
      }, proto.lens.CenterRotatedBox.prototype.getCenterY = function() {
        return (
          /** @type {number} */
          e.Message.getFloatingPointFieldWithDefault(this, 2, 0)
        );
      }, proto.lens.CenterRotatedBox.prototype.setCenterY = function(t) {
        return e.Message.setProto3FloatField(this, 2, t);
      }, proto.lens.CenterRotatedBox.prototype.getWidth = function() {
        return (
          /** @type {number} */
          e.Message.getFloatingPointFieldWithDefault(this, 3, 0)
        );
      }, proto.lens.CenterRotatedBox.prototype.setWidth = function(t) {
        return e.Message.setProto3FloatField(this, 3, t);
      }, proto.lens.CenterRotatedBox.prototype.getHeight = function() {
        return (
          /** @type {number} */
          e.Message.getFloatingPointFieldWithDefault(this, 4, 0)
        );
      }, proto.lens.CenterRotatedBox.prototype.setHeight = function(t) {
        return e.Message.setProto3FloatField(this, 4, t);
      }, proto.lens.CenterRotatedBox.prototype.getRotationZ = function() {
        return (
          /** @type {number} */
          e.Message.getFloatingPointFieldWithDefault(this, 5, 0)
        );
      }, proto.lens.CenterRotatedBox.prototype.setRotationZ = function(t) {
        return e.Message.setProto3FloatField(this, 5, t);
      }, proto.lens.CenterRotatedBox.prototype.getCoordinateType = function() {
        return (
          /** @type {!proto.lens.CoordinateType} */
          e.Message.getFieldWithDefault(this, 6, 0)
        );
      }, proto.lens.CenterRotatedBox.prototype.setCoordinateType = function(t) {
        return e.Message.setProto3EnumField(this, 6, t);
      }, proto.lens.Geometry.repeatedFields_ = [5], e.Message.GENERATE_TO_OBJECT && (proto.lens.Geometry.prototype.toObject = function(t) {
        return proto.lens.Geometry.toObject(t, this);
      }, proto.lens.Geometry.toObject = function(t, n) {
        var r, o = {
          boundingBox: (r = n.getBoundingBox()) && proto.lens.CenterRotatedBox.toObject(t, r),
          segmentationPolygonList: e.Message.toObjectList(
            n.getSegmentationPolygonList(),
            a.Polygon.toObject,
            t
          )
        };
        return t && (o.$jspbMessageInstance = n), o;
      }), proto.lens.Geometry.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.Geometry();
        return proto.lens.Geometry.deserializeBinaryFromReader(r, n);
      }, proto.lens.Geometry.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = new proto.lens.CenterRotatedBox();
              n.readMessage(o, proto.lens.CenterRotatedBox.deserializeBinaryFromReader), t.setBoundingBox(o);
              break;
            case 5:
              var o = new a.Polygon();
              n.readMessage(o, a.Polygon.deserializeBinaryFromReader), t.addSegmentationPolygon(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.Geometry.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.Geometry.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.Geometry.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getBoundingBox(), r != null && n.writeMessage(
          1,
          r,
          proto.lens.CenterRotatedBox.serializeBinaryToWriter
        ), r = t.getSegmentationPolygonList(), r.length > 0 && n.writeRepeatedMessage(
          5,
          r,
          a.Polygon.serializeBinaryToWriter
        );
      }, proto.lens.Geometry.prototype.getBoundingBox = function() {
        return (
          /** @type{?proto.lens.CenterRotatedBox} */
          e.Message.getWrapperField(this, proto.lens.CenterRotatedBox, 1)
        );
      }, proto.lens.Geometry.prototype.setBoundingBox = function(t) {
        return e.Message.setWrapperField(this, 1, t);
      }, proto.lens.Geometry.prototype.clearBoundingBox = function() {
        return this.setBoundingBox(void 0);
      }, proto.lens.Geometry.prototype.hasBoundingBox = function() {
        return e.Message.getField(this, 1) != null;
      }, proto.lens.Geometry.prototype.getSegmentationPolygonList = function() {
        return (
          /** @type{!Array<!proto.lens.Polygon>} */
          e.Message.getRepeatedWrapperField(this, a.Polygon, 5)
        );
      }, proto.lens.Geometry.prototype.setSegmentationPolygonList = function(t) {
        return e.Message.setRepeatedWrapperField(this, 5, t);
      }, proto.lens.Geometry.prototype.addSegmentationPolygon = function(t, n) {
        return e.Message.addToRepeatedWrapperField(this, 5, t, proto.lens.Polygon, n);
      }, proto.lens.Geometry.prototype.clearSegmentationPolygonList = function() {
        return this.setSegmentationPolygonList([]);
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.ZoomedCrop.prototype.toObject = function(t) {
        return proto.lens.ZoomedCrop.toObject(t, this);
      }, proto.lens.ZoomedCrop.toObject = function(t, n) {
        var r, o = {
          crop: (r = n.getCrop()) && proto.lens.CenterRotatedBox.toObject(t, r),
          parentWidth: e.Message.getFieldWithDefault(n, 2, 0),
          parentHeight: e.Message.getFieldWithDefault(n, 3, 0),
          zoom: e.Message.getFloatingPointFieldWithDefault(n, 4, 0)
        };
        return t && (o.$jspbMessageInstance = n), o;
      }), proto.lens.ZoomedCrop.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.ZoomedCrop();
        return proto.lens.ZoomedCrop.deserializeBinaryFromReader(r, n);
      }, proto.lens.ZoomedCrop.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = new proto.lens.CenterRotatedBox();
              n.readMessage(o, proto.lens.CenterRotatedBox.deserializeBinaryFromReader), t.setCrop(o);
              break;
            case 2:
              var o = (
                /** @type {number} */
                n.readInt32()
              );
              t.setParentWidth(o);
              break;
            case 3:
              var o = (
                /** @type {number} */
                n.readInt32()
              );
              t.setParentHeight(o);
              break;
            case 4:
              var o = (
                /** @type {number} */
                n.readFloat()
              );
              t.setZoom(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.ZoomedCrop.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.ZoomedCrop.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.ZoomedCrop.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getCrop(), r != null && n.writeMessage(
          1,
          r,
          proto.lens.CenterRotatedBox.serializeBinaryToWriter
        ), r = t.getParentWidth(), r !== 0 && n.writeInt32(
          2,
          r
        ), r = t.getParentHeight(), r !== 0 && n.writeInt32(
          3,
          r
        ), r = t.getZoom(), r !== 0 && n.writeFloat(
          4,
          r
        );
      }, proto.lens.ZoomedCrop.prototype.getCrop = function() {
        return (
          /** @type{?proto.lens.CenterRotatedBox} */
          e.Message.getWrapperField(this, proto.lens.CenterRotatedBox, 1)
        );
      }, proto.lens.ZoomedCrop.prototype.setCrop = function(t) {
        return e.Message.setWrapperField(this, 1, t);
      }, proto.lens.ZoomedCrop.prototype.clearCrop = function() {
        return this.setCrop(void 0);
      }, proto.lens.ZoomedCrop.prototype.hasCrop = function() {
        return e.Message.getField(this, 1) != null;
      }, proto.lens.ZoomedCrop.prototype.getParentWidth = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 2, 0)
        );
      }, proto.lens.ZoomedCrop.prototype.setParentWidth = function(t) {
        return e.Message.setProto3IntField(this, 2, t);
      }, proto.lens.ZoomedCrop.prototype.getParentHeight = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 3, 0)
        );
      }, proto.lens.ZoomedCrop.prototype.setParentHeight = function(t) {
        return e.Message.setProto3IntField(this, 3, t);
      }, proto.lens.ZoomedCrop.prototype.getZoom = function() {
        return (
          /** @type {number} */
          e.Message.getFloatingPointFieldWithDefault(this, 4, 0)
        );
      }, proto.lens.ZoomedCrop.prototype.setZoom = function(t) {
        return e.Message.setProto3FloatField(this, 4, t);
      }, i.object.extend(c, proto.lens);
    }(S)), S;
  }
  var ye;
  function me() {
    return ye || (ye = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis, a = /* @__PURE__ */ R();
      i.object.extend(proto, a), i.exportSymbol("proto.lens.Alignment", null, d), i.exportSymbol("proto.lens.Text", null, d), i.exportSymbol("proto.lens.TextEntityIdentifier", null, d), i.exportSymbol("proto.lens.TextLayout", null, d), i.exportSymbol("proto.lens.TextLayout.Line", null, d), i.exportSymbol("proto.lens.TextLayout.Paragraph", null, d), i.exportSymbol("proto.lens.TextLayout.Word", null, d), i.exportSymbol("proto.lens.TextLayout.Word.FormulaMetadata", null, d), i.exportSymbol("proto.lens.TextLayout.Word.Type", null, d), i.exportSymbol("proto.lens.WritingDirection", null, d), proto.lens.Text = function(t) {
        e.Message.initialize(this, t, 0, -1, null, null);
      }, i.inherits(proto.lens.Text, e.Message), i.DEBUG && !COMPILED && (proto.lens.Text.displayName = "proto.lens.Text"), proto.lens.TextLayout = function(t) {
        e.Message.initialize(this, t, 0, -1, proto.lens.TextLayout.repeatedFields_, null);
      }, i.inherits(proto.lens.TextLayout, e.Message), i.DEBUG && !COMPILED && (proto.lens.TextLayout.displayName = "proto.lens.TextLayout"), proto.lens.TextLayout.Word = function(t) {
        e.Message.initialize(this, t, 0, -1, null, null);
      }, i.inherits(proto.lens.TextLayout.Word, e.Message), i.DEBUG && !COMPILED && (proto.lens.TextLayout.Word.displayName = "proto.lens.TextLayout.Word"), proto.lens.TextLayout.Word.FormulaMetadata = function(t) {
        e.Message.initialize(this, t, 0, -1, null, null);
      }, i.inherits(proto.lens.TextLayout.Word.FormulaMetadata, e.Message), i.DEBUG && !COMPILED && (proto.lens.TextLayout.Word.FormulaMetadata.displayName = "proto.lens.TextLayout.Word.FormulaMetadata"), proto.lens.TextLayout.Line = function(t) {
        e.Message.initialize(this, t, 0, -1, proto.lens.TextLayout.Line.repeatedFields_, null);
      }, i.inherits(proto.lens.TextLayout.Line, e.Message), i.DEBUG && !COMPILED && (proto.lens.TextLayout.Line.displayName = "proto.lens.TextLayout.Line"), proto.lens.TextLayout.Paragraph = function(t) {
        e.Message.initialize(this, t, 0, -1, proto.lens.TextLayout.Paragraph.repeatedFields_, null);
      }, i.inherits(proto.lens.TextLayout.Paragraph, e.Message), i.DEBUG && !COMPILED && (proto.lens.TextLayout.Paragraph.displayName = "proto.lens.TextLayout.Paragraph"), proto.lens.TextEntityIdentifier = function(t) {
        e.Message.initialize(this, t, 0, -1, null, null);
      }, i.inherits(proto.lens.TextEntityIdentifier, e.Message), i.DEBUG && !COMPILED && (proto.lens.TextEntityIdentifier.displayName = "proto.lens.TextEntityIdentifier"), e.Message.GENERATE_TO_OBJECT && (proto.lens.Text.prototype.toObject = function(t) {
        return proto.lens.Text.toObject(t, this);
      }, proto.lens.Text.toObject = function(t, n) {
        var r, o = {
          textLayout: (r = n.getTextLayout()) && proto.lens.TextLayout.toObject(t, r),
          contentLanguage: e.Message.getFieldWithDefault(n, 2, "")
        };
        return t && (o.$jspbMessageInstance = n), o;
      }), proto.lens.Text.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.Text();
        return proto.lens.Text.deserializeBinaryFromReader(r, n);
      }, proto.lens.Text.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = new proto.lens.TextLayout();
              n.readMessage(o, proto.lens.TextLayout.deserializeBinaryFromReader), t.setTextLayout(o);
              break;
            case 2:
              var o = (
                /** @type {string} */
                n.readString()
              );
              t.setContentLanguage(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.Text.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.Text.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.Text.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getTextLayout(), r != null && n.writeMessage(
          1,
          r,
          proto.lens.TextLayout.serializeBinaryToWriter
        ), r = t.getContentLanguage(), r.length > 0 && n.writeString(
          2,
          r
        );
      }, proto.lens.Text.prototype.getTextLayout = function() {
        return (
          /** @type{?proto.lens.TextLayout} */
          e.Message.getWrapperField(this, proto.lens.TextLayout, 1)
        );
      }, proto.lens.Text.prototype.setTextLayout = function(t) {
        return e.Message.setWrapperField(this, 1, t);
      }, proto.lens.Text.prototype.clearTextLayout = function() {
        return this.setTextLayout(void 0);
      }, proto.lens.Text.prototype.hasTextLayout = function() {
        return e.Message.getField(this, 1) != null;
      }, proto.lens.Text.prototype.getContentLanguage = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 2, "")
        );
      }, proto.lens.Text.prototype.setContentLanguage = function(t) {
        return e.Message.setProto3StringField(this, 2, t);
      }, proto.lens.TextLayout.repeatedFields_ = [1], e.Message.GENERATE_TO_OBJECT && (proto.lens.TextLayout.prototype.toObject = function(t) {
        return proto.lens.TextLayout.toObject(t, this);
      }, proto.lens.TextLayout.toObject = function(t, n) {
        var r = {
          paragraphsList: e.Message.toObjectList(
            n.getParagraphsList(),
            proto.lens.TextLayout.Paragraph.toObject,
            t
          )
        };
        return t && (r.$jspbMessageInstance = n), r;
      }), proto.lens.TextLayout.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.TextLayout();
        return proto.lens.TextLayout.deserializeBinaryFromReader(r, n);
      }, proto.lens.TextLayout.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = new proto.lens.TextLayout.Paragraph();
              n.readMessage(o, proto.lens.TextLayout.Paragraph.deserializeBinaryFromReader), t.addParagraphs(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.TextLayout.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.TextLayout.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.TextLayout.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getParagraphsList(), r.length > 0 && n.writeRepeatedMessage(
          1,
          r,
          proto.lens.TextLayout.Paragraph.serializeBinaryToWriter
        );
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.TextLayout.Word.prototype.toObject = function(t) {
        return proto.lens.TextLayout.Word.toObject(t, this);
      }, proto.lens.TextLayout.Word.toObject = function(t, n) {
        var r, o = {
          id: (r = n.getId()) && proto.lens.TextEntityIdentifier.toObject(t, r),
          plainText: e.Message.getFieldWithDefault(n, 2, ""),
          textSeparator: (r = e.Message.getField(n, 3)) == null ? void 0 : r,
          geometry: (r = n.getGeometry()) && a.Geometry.toObject(t, r),
          type: e.Message.getFieldWithDefault(n, 5, 0),
          formulaMetadata: (r = n.getFormulaMetadata()) && proto.lens.TextLayout.Word.FormulaMetadata.toObject(t, r)
        };
        return t && (o.$jspbMessageInstance = n), o;
      }), proto.lens.TextLayout.Word.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.TextLayout.Word();
        return proto.lens.TextLayout.Word.deserializeBinaryFromReader(r, n);
      }, proto.lens.TextLayout.Word.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = new proto.lens.TextEntityIdentifier();
              n.readMessage(o, proto.lens.TextEntityIdentifier.deserializeBinaryFromReader), t.setId(o);
              break;
            case 2:
              var o = (
                /** @type {string} */
                n.readString()
              );
              t.setPlainText(o);
              break;
            case 3:
              var o = (
                /** @type {string} */
                n.readString()
              );
              t.setTextSeparator(o);
              break;
            case 4:
              var o = new a.Geometry();
              n.readMessage(o, a.Geometry.deserializeBinaryFromReader), t.setGeometry(o);
              break;
            case 5:
              var o = (
                /** @type {!proto.lens.TextLayout.Word.Type} */
                n.readEnum()
              );
              t.setType(o);
              break;
            case 6:
              var o = new proto.lens.TextLayout.Word.FormulaMetadata();
              n.readMessage(o, proto.lens.TextLayout.Word.FormulaMetadata.deserializeBinaryFromReader), t.setFormulaMetadata(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.TextLayout.Word.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.TextLayout.Word.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.TextLayout.Word.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getId(), r != null && n.writeMessage(
          1,
          r,
          proto.lens.TextEntityIdentifier.serializeBinaryToWriter
        ), r = t.getPlainText(), r.length > 0 && n.writeString(
          2,
          r
        ), r = /** @type {string} */
        e.Message.getField(t, 3), r != null && n.writeString(
          3,
          r
        ), r = t.getGeometry(), r != null && n.writeMessage(
          4,
          r,
          a.Geometry.serializeBinaryToWriter
        ), r = t.getType(), r !== 0 && n.writeEnum(
          5,
          r
        ), r = t.getFormulaMetadata(), r != null && n.writeMessage(
          6,
          r,
          proto.lens.TextLayout.Word.FormulaMetadata.serializeBinaryToWriter
        );
      }, proto.lens.TextLayout.Word.Type = {
        TEXT: 0,
        FORMULA: 1
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.TextLayout.Word.FormulaMetadata.prototype.toObject = function(t) {
        return proto.lens.TextLayout.Word.FormulaMetadata.toObject(t, this);
      }, proto.lens.TextLayout.Word.FormulaMetadata.toObject = function(t, n) {
        var r = {
          latex: e.Message.getFieldWithDefault(n, 1, "")
        };
        return t && (r.$jspbMessageInstance = n), r;
      }), proto.lens.TextLayout.Word.FormulaMetadata.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.TextLayout.Word.FormulaMetadata();
        return proto.lens.TextLayout.Word.FormulaMetadata.deserializeBinaryFromReader(r, n);
      }, proto.lens.TextLayout.Word.FormulaMetadata.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = (
                /** @type {string} */
                n.readString()
              );
              t.setLatex(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.TextLayout.Word.FormulaMetadata.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.TextLayout.Word.FormulaMetadata.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.TextLayout.Word.FormulaMetadata.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getLatex(), r.length > 0 && n.writeString(
          1,
          r
        );
      }, proto.lens.TextLayout.Word.FormulaMetadata.prototype.getLatex = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 1, "")
        );
      }, proto.lens.TextLayout.Word.FormulaMetadata.prototype.setLatex = function(t) {
        return e.Message.setProto3StringField(this, 1, t);
      }, proto.lens.TextLayout.Word.prototype.getId = function() {
        return (
          /** @type{?proto.lens.TextEntityIdentifier} */
          e.Message.getWrapperField(this, proto.lens.TextEntityIdentifier, 1)
        );
      }, proto.lens.TextLayout.Word.prototype.setId = function(t) {
        return e.Message.setWrapperField(this, 1, t);
      }, proto.lens.TextLayout.Word.prototype.clearId = function() {
        return this.setId(void 0);
      }, proto.lens.TextLayout.Word.prototype.hasId = function() {
        return e.Message.getField(this, 1) != null;
      }, proto.lens.TextLayout.Word.prototype.getPlainText = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 2, "")
        );
      }, proto.lens.TextLayout.Word.prototype.setPlainText = function(t) {
        return e.Message.setProto3StringField(this, 2, t);
      }, proto.lens.TextLayout.Word.prototype.getTextSeparator = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 3, "")
        );
      }, proto.lens.TextLayout.Word.prototype.setTextSeparator = function(t) {
        return e.Message.setField(this, 3, t);
      }, proto.lens.TextLayout.Word.prototype.clearTextSeparator = function() {
        return e.Message.setField(this, 3, void 0);
      }, proto.lens.TextLayout.Word.prototype.hasTextSeparator = function() {
        return e.Message.getField(this, 3) != null;
      }, proto.lens.TextLayout.Word.prototype.getGeometry = function() {
        return (
          /** @type{?proto.lens.Geometry} */
          e.Message.getWrapperField(this, a.Geometry, 4)
        );
      }, proto.lens.TextLayout.Word.prototype.setGeometry = function(t) {
        return e.Message.setWrapperField(this, 4, t);
      }, proto.lens.TextLayout.Word.prototype.clearGeometry = function() {
        return this.setGeometry(void 0);
      }, proto.lens.TextLayout.Word.prototype.hasGeometry = function() {
        return e.Message.getField(this, 4) != null;
      }, proto.lens.TextLayout.Word.prototype.getType = function() {
        return (
          /** @type {!proto.lens.TextLayout.Word.Type} */
          e.Message.getFieldWithDefault(this, 5, 0)
        );
      }, proto.lens.TextLayout.Word.prototype.setType = function(t) {
        return e.Message.setProto3EnumField(this, 5, t);
      }, proto.lens.TextLayout.Word.prototype.getFormulaMetadata = function() {
        return (
          /** @type{?proto.lens.TextLayout.Word.FormulaMetadata} */
          e.Message.getWrapperField(this, proto.lens.TextLayout.Word.FormulaMetadata, 6)
        );
      }, proto.lens.TextLayout.Word.prototype.setFormulaMetadata = function(t) {
        return e.Message.setWrapperField(this, 6, t);
      }, proto.lens.TextLayout.Word.prototype.clearFormulaMetadata = function() {
        return this.setFormulaMetadata(void 0);
      }, proto.lens.TextLayout.Word.prototype.hasFormulaMetadata = function() {
        return e.Message.getField(this, 6) != null;
      }, proto.lens.TextLayout.Line.repeatedFields_ = [1], e.Message.GENERATE_TO_OBJECT && (proto.lens.TextLayout.Line.prototype.toObject = function(t) {
        return proto.lens.TextLayout.Line.toObject(t, this);
      }, proto.lens.TextLayout.Line.toObject = function(t, n) {
        var r, o = {
          wordsList: e.Message.toObjectList(
            n.getWordsList(),
            proto.lens.TextLayout.Word.toObject,
            t
          ),
          geometry: (r = n.getGeometry()) && a.Geometry.toObject(t, r)
        };
        return t && (o.$jspbMessageInstance = n), o;
      }), proto.lens.TextLayout.Line.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.TextLayout.Line();
        return proto.lens.TextLayout.Line.deserializeBinaryFromReader(r, n);
      }, proto.lens.TextLayout.Line.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = new proto.lens.TextLayout.Word();
              n.readMessage(o, proto.lens.TextLayout.Word.deserializeBinaryFromReader), t.addWords(o);
              break;
            case 2:
              var o = new a.Geometry();
              n.readMessage(o, a.Geometry.deserializeBinaryFromReader), t.setGeometry(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.TextLayout.Line.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.TextLayout.Line.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.TextLayout.Line.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getWordsList(), r.length > 0 && n.writeRepeatedMessage(
          1,
          r,
          proto.lens.TextLayout.Word.serializeBinaryToWriter
        ), r = t.getGeometry(), r != null && n.writeMessage(
          2,
          r,
          a.Geometry.serializeBinaryToWriter
        );
      }, proto.lens.TextLayout.Line.prototype.getWordsList = function() {
        return (
          /** @type{!Array<!proto.lens.TextLayout.Word>} */
          e.Message.getRepeatedWrapperField(this, proto.lens.TextLayout.Word, 1)
        );
      }, proto.lens.TextLayout.Line.prototype.setWordsList = function(t) {
        return e.Message.setRepeatedWrapperField(this, 1, t);
      }, proto.lens.TextLayout.Line.prototype.addWords = function(t, n) {
        return e.Message.addToRepeatedWrapperField(this, 1, t, proto.lens.TextLayout.Word, n);
      }, proto.lens.TextLayout.Line.prototype.clearWordsList = function() {
        return this.setWordsList([]);
      }, proto.lens.TextLayout.Line.prototype.getGeometry = function() {
        return (
          /** @type{?proto.lens.Geometry} */
          e.Message.getWrapperField(this, a.Geometry, 2)
        );
      }, proto.lens.TextLayout.Line.prototype.setGeometry = function(t) {
        return e.Message.setWrapperField(this, 2, t);
      }, proto.lens.TextLayout.Line.prototype.clearGeometry = function() {
        return this.setGeometry(void 0);
      }, proto.lens.TextLayout.Line.prototype.hasGeometry = function() {
        return e.Message.getField(this, 2) != null;
      }, proto.lens.TextLayout.Paragraph.repeatedFields_ = [2], e.Message.GENERATE_TO_OBJECT && (proto.lens.TextLayout.Paragraph.prototype.toObject = function(t) {
        return proto.lens.TextLayout.Paragraph.toObject(t, this);
      }, proto.lens.TextLayout.Paragraph.toObject = function(t, n) {
        var r, o = {
          id: (r = n.getId()) && proto.lens.TextEntityIdentifier.toObject(t, r),
          linesList: e.Message.toObjectList(
            n.getLinesList(),
            proto.lens.TextLayout.Line.toObject,
            t
          ),
          geometry: (r = n.getGeometry()) && a.Geometry.toObject(t, r),
          writingDirection: e.Message.getFieldWithDefault(n, 4, 0),
          contentLanguage: e.Message.getFieldWithDefault(n, 5, "")
        };
        return t && (o.$jspbMessageInstance = n), o;
      }), proto.lens.TextLayout.Paragraph.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.TextLayout.Paragraph();
        return proto.lens.TextLayout.Paragraph.deserializeBinaryFromReader(r, n);
      }, proto.lens.TextLayout.Paragraph.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = new proto.lens.TextEntityIdentifier();
              n.readMessage(o, proto.lens.TextEntityIdentifier.deserializeBinaryFromReader), t.setId(o);
              break;
            case 2:
              var o = new proto.lens.TextLayout.Line();
              n.readMessage(o, proto.lens.TextLayout.Line.deserializeBinaryFromReader), t.addLines(o);
              break;
            case 3:
              var o = new a.Geometry();
              n.readMessage(o, a.Geometry.deserializeBinaryFromReader), t.setGeometry(o);
              break;
            case 4:
              var o = (
                /** @type {!proto.lens.WritingDirection} */
                n.readEnum()
              );
              t.setWritingDirection(o);
              break;
            case 5:
              var o = (
                /** @type {string} */
                n.readString()
              );
              t.setContentLanguage(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.TextLayout.Paragraph.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.TextLayout.Paragraph.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.TextLayout.Paragraph.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getId(), r != null && n.writeMessage(
          1,
          r,
          proto.lens.TextEntityIdentifier.serializeBinaryToWriter
        ), r = t.getLinesList(), r.length > 0 && n.writeRepeatedMessage(
          2,
          r,
          proto.lens.TextLayout.Line.serializeBinaryToWriter
        ), r = t.getGeometry(), r != null && n.writeMessage(
          3,
          r,
          a.Geometry.serializeBinaryToWriter
        ), r = t.getWritingDirection(), r !== 0 && n.writeEnum(
          4,
          r
        ), r = t.getContentLanguage(), r.length > 0 && n.writeString(
          5,
          r
        );
      }, proto.lens.TextLayout.Paragraph.prototype.getId = function() {
        return (
          /** @type{?proto.lens.TextEntityIdentifier} */
          e.Message.getWrapperField(this, proto.lens.TextEntityIdentifier, 1)
        );
      }, proto.lens.TextLayout.Paragraph.prototype.setId = function(t) {
        return e.Message.setWrapperField(this, 1, t);
      }, proto.lens.TextLayout.Paragraph.prototype.clearId = function() {
        return this.setId(void 0);
      }, proto.lens.TextLayout.Paragraph.prototype.hasId = function() {
        return e.Message.getField(this, 1) != null;
      }, proto.lens.TextLayout.Paragraph.prototype.getLinesList = function() {
        return (
          /** @type{!Array<!proto.lens.TextLayout.Line>} */
          e.Message.getRepeatedWrapperField(this, proto.lens.TextLayout.Line, 2)
        );
      }, proto.lens.TextLayout.Paragraph.prototype.setLinesList = function(t) {
        return e.Message.setRepeatedWrapperField(this, 2, t);
      }, proto.lens.TextLayout.Paragraph.prototype.addLines = function(t, n) {
        return e.Message.addToRepeatedWrapperField(this, 2, t, proto.lens.TextLayout.Line, n);
      }, proto.lens.TextLayout.Paragraph.prototype.clearLinesList = function() {
        return this.setLinesList([]);
      }, proto.lens.TextLayout.Paragraph.prototype.getGeometry = function() {
        return (
          /** @type{?proto.lens.Geometry} */
          e.Message.getWrapperField(this, a.Geometry, 3)
        );
      }, proto.lens.TextLayout.Paragraph.prototype.setGeometry = function(t) {
        return e.Message.setWrapperField(this, 3, t);
      }, proto.lens.TextLayout.Paragraph.prototype.clearGeometry = function() {
        return this.setGeometry(void 0);
      }, proto.lens.TextLayout.Paragraph.prototype.hasGeometry = function() {
        return e.Message.getField(this, 3) != null;
      }, proto.lens.TextLayout.Paragraph.prototype.getWritingDirection = function() {
        return (
          /** @type {!proto.lens.WritingDirection} */
          e.Message.getFieldWithDefault(this, 4, 0)
        );
      }, proto.lens.TextLayout.Paragraph.prototype.setWritingDirection = function(t) {
        return e.Message.setProto3EnumField(this, 4, t);
      }, proto.lens.TextLayout.Paragraph.prototype.getContentLanguage = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 5, "")
        );
      }, proto.lens.TextLayout.Paragraph.prototype.setContentLanguage = function(t) {
        return e.Message.setProto3StringField(this, 5, t);
      }, proto.lens.TextLayout.prototype.getParagraphsList = function() {
        return (
          /** @type{!Array<!proto.lens.TextLayout.Paragraph>} */
          e.Message.getRepeatedWrapperField(this, proto.lens.TextLayout.Paragraph, 1)
        );
      }, proto.lens.TextLayout.prototype.setParagraphsList = function(t) {
        return e.Message.setRepeatedWrapperField(this, 1, t);
      }, proto.lens.TextLayout.prototype.addParagraphs = function(t, n) {
        return e.Message.addToRepeatedWrapperField(this, 1, t, proto.lens.TextLayout.Paragraph, n);
      }, proto.lens.TextLayout.prototype.clearParagraphsList = function() {
        return this.setParagraphsList([]);
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.TextEntityIdentifier.prototype.toObject = function(t) {
        return proto.lens.TextEntityIdentifier.toObject(t, this);
      }, proto.lens.TextEntityIdentifier.toObject = function(t, n) {
        var r = {
          id: e.Message.getFieldWithDefault(n, 1, 0)
        };
        return t && (r.$jspbMessageInstance = n), r;
      }), proto.lens.TextEntityIdentifier.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.TextEntityIdentifier();
        return proto.lens.TextEntityIdentifier.deserializeBinaryFromReader(r, n);
      }, proto.lens.TextEntityIdentifier.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = (
                /** @type {number} */
                n.readInt64()
              );
              t.setId(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.TextEntityIdentifier.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.TextEntityIdentifier.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.TextEntityIdentifier.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getId(), r !== 0 && n.writeInt64(
          1,
          r
        );
      }, proto.lens.TextEntityIdentifier.prototype.getId = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.TextEntityIdentifier.prototype.setId = function(t) {
        return e.Message.setProto3IntField(this, 1, t);
      }, proto.lens.WritingDirection = {
        DEFAULT_WRITING_DIRECTION_LEFT_TO_RIGHT: 0,
        WRITING_DIRECTION_RIGHT_TO_LEFT: 1,
        WRITING_DIRECTION_TOP_TO_BOTTOM: 2
      }, proto.lens.Alignment = {
        DEFAULT_LEFT_ALIGNED: 0,
        RIGHT_ALIGNED: 1,
        CENTER_ALIGNED: 2
      }, i.object.extend(c, proto.lens);
    }(j)), j;
  }
  var ge;
  function Je() {
    return ge || (ge = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis, a = /* @__PURE__ */ me();
      i.object.extend(proto, a), i.exportSymbol("proto.lens.DeepGleamData", null, d), i.exportSymbol("proto.lens.DeepGleamData.RenderingOneofCase", null, d), i.exportSymbol("proto.lens.TranslationData", null, d), i.exportSymbol("proto.lens.TranslationData.BackgroundImageData", null, d), i.exportSymbol("proto.lens.TranslationData.BackgroundImageData.FileFormat", null, d), i.exportSymbol("proto.lens.TranslationData.Line", null, d), i.exportSymbol("proto.lens.TranslationData.Line.Word", null, d), i.exportSymbol("proto.lens.TranslationData.Status", null, d), i.exportSymbol("proto.lens.TranslationData.Status.Code", null, d), i.exportSymbol("proto.lens.TranslationData.TextStyle", null, d), proto.lens.DeepGleamData = function(t) {
        e.Message.initialize(this, t, 0, -1, proto.lens.DeepGleamData.repeatedFields_, proto.lens.DeepGleamData.oneofGroups_);
      }, i.inherits(proto.lens.DeepGleamData, e.Message), i.DEBUG && !COMPILED && (proto.lens.DeepGleamData.displayName = "proto.lens.DeepGleamData"), proto.lens.TranslationData = function(t) {
        e.Message.initialize(this, t, 0, -1, proto.lens.TranslationData.repeatedFields_, null);
      }, i.inherits(proto.lens.TranslationData, e.Message), i.DEBUG && !COMPILED && (proto.lens.TranslationData.displayName = "proto.lens.TranslationData"), proto.lens.TranslationData.Status = function(t) {
        e.Message.initialize(this, t, 0, -1, null, null);
      }, i.inherits(proto.lens.TranslationData.Status, e.Message), i.DEBUG && !COMPILED && (proto.lens.TranslationData.Status.displayName = "proto.lens.TranslationData.Status"), proto.lens.TranslationData.TextStyle = function(t) {
        e.Message.initialize(this, t, 0, -1, null, null);
      }, i.inherits(proto.lens.TranslationData.TextStyle, e.Message), i.DEBUG && !COMPILED && (proto.lens.TranslationData.TextStyle.displayName = "proto.lens.TranslationData.TextStyle"), proto.lens.TranslationData.BackgroundImageData = function(t) {
        e.Message.initialize(this, t, 0, -1, null, null);
      }, i.inherits(proto.lens.TranslationData.BackgroundImageData, e.Message), i.DEBUG && !COMPILED && (proto.lens.TranslationData.BackgroundImageData.displayName = "proto.lens.TranslationData.BackgroundImageData"), proto.lens.TranslationData.Line = function(t) {
        e.Message.initialize(this, t, 0, -1, proto.lens.TranslationData.Line.repeatedFields_, null);
      }, i.inherits(proto.lens.TranslationData.Line, e.Message), i.DEBUG && !COMPILED && (proto.lens.TranslationData.Line.displayName = "proto.lens.TranslationData.Line"), proto.lens.TranslationData.Line.Word = function(t) {
        e.Message.initialize(this, t, 0, -1, null, null);
      }, i.inherits(proto.lens.TranslationData.Line.Word, e.Message), i.DEBUG && !COMPILED && (proto.lens.TranslationData.Line.Word.displayName = "proto.lens.TranslationData.Line.Word"), proto.lens.DeepGleamData.repeatedFields_ = [11], proto.lens.DeepGleamData.oneofGroups_ = [[10]], proto.lens.DeepGleamData.RenderingOneofCase = {
        RENDERING_ONEOF_NOT_SET: 0,
        TRANSLATION: 10
      }, proto.lens.DeepGleamData.prototype.getRenderingOneofCase = function() {
        return (
          /** @type {proto.lens.DeepGleamData.RenderingOneofCase} */
          e.Message.computeOneofCase(this, proto.lens.DeepGleamData.oneofGroups_[0])
        );
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.DeepGleamData.prototype.toObject = function(t) {
        return proto.lens.DeepGleamData.toObject(t, this);
      }, proto.lens.DeepGleamData.toObject = function(t, n) {
        var r, o = {
          translation: (r = n.getTranslation()) && proto.lens.TranslationData.toObject(t, r),
          visualObjectIdList: (r = e.Message.getRepeatedField(n, 11)) == null ? void 0 : r
        };
        return t && (o.$jspbMessageInstance = n), o;
      }), proto.lens.DeepGleamData.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.DeepGleamData();
        return proto.lens.DeepGleamData.deserializeBinaryFromReader(r, n);
      }, proto.lens.DeepGleamData.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 10:
              var o = new proto.lens.TranslationData();
              n.readMessage(o, proto.lens.TranslationData.deserializeBinaryFromReader), t.setTranslation(o);
              break;
            case 11:
              var o = (
                /** @type {string} */
                n.readString()
              );
              t.addVisualObjectId(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.DeepGleamData.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.DeepGleamData.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.DeepGleamData.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getTranslation(), r != null && n.writeMessage(
          10,
          r,
          proto.lens.TranslationData.serializeBinaryToWriter
        ), r = t.getVisualObjectIdList(), r.length > 0 && n.writeRepeatedString(
          11,
          r
        );
      }, proto.lens.DeepGleamData.prototype.getTranslation = function() {
        return (
          /** @type{?proto.lens.TranslationData} */
          e.Message.getWrapperField(this, proto.lens.TranslationData, 10)
        );
      }, proto.lens.DeepGleamData.prototype.setTranslation = function(t) {
        return e.Message.setOneofWrapperField(this, 10, proto.lens.DeepGleamData.oneofGroups_[0], t);
      }, proto.lens.DeepGleamData.prototype.clearTranslation = function() {
        return this.setTranslation(void 0);
      }, proto.lens.DeepGleamData.prototype.hasTranslation = function() {
        return e.Message.getField(this, 10) != null;
      }, proto.lens.DeepGleamData.prototype.getVisualObjectIdList = function() {
        return (
          /** @type {!Array<string>} */
          e.Message.getRepeatedField(this, 11)
        );
      }, proto.lens.DeepGleamData.prototype.setVisualObjectIdList = function(t) {
        return e.Message.setField(this, 11, t || []);
      }, proto.lens.DeepGleamData.prototype.addVisualObjectId = function(t, n) {
        return e.Message.addToRepeatedField(this, 11, t, n);
      }, proto.lens.DeepGleamData.prototype.clearVisualObjectIdList = function() {
        return this.setVisualObjectIdList([]);
      }, proto.lens.TranslationData.repeatedFields_ = [5], e.Message.GENERATE_TO_OBJECT && (proto.lens.TranslationData.prototype.toObject = function(t) {
        return proto.lens.TranslationData.toObject(t, this);
      }, proto.lens.TranslationData.toObject = function(t, n) {
        var r, o = {
          status: (r = n.getStatus()) && proto.lens.TranslationData.Status.toObject(t, r),
          targetLanguage: e.Message.getFieldWithDefault(n, 2, ""),
          sourceLanguage: e.Message.getFieldWithDefault(n, 3, ""),
          translation: e.Message.getFieldWithDefault(n, 4, ""),
          lineList: e.Message.toObjectList(
            n.getLineList(),
            proto.lens.TranslationData.Line.toObject,
            t
          ),
          writingDirection: e.Message.getFieldWithDefault(n, 7, 0),
          alignment: e.Message.getFieldWithDefault(n, 8, 0),
          justified: e.Message.getBooleanFieldWithDefault(n, 9, false)
        };
        return t && (o.$jspbMessageInstance = n), o;
      }), proto.lens.TranslationData.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.TranslationData();
        return proto.lens.TranslationData.deserializeBinaryFromReader(r, n);
      }, proto.lens.TranslationData.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = new proto.lens.TranslationData.Status();
              n.readMessage(o, proto.lens.TranslationData.Status.deserializeBinaryFromReader), t.setStatus(o);
              break;
            case 2:
              var o = (
                /** @type {string} */
                n.readString()
              );
              t.setTargetLanguage(o);
              break;
            case 3:
              var o = (
                /** @type {string} */
                n.readString()
              );
              t.setSourceLanguage(o);
              break;
            case 4:
              var o = (
                /** @type {string} */
                n.readString()
              );
              t.setTranslation(o);
              break;
            case 5:
              var o = new proto.lens.TranslationData.Line();
              n.readMessage(o, proto.lens.TranslationData.Line.deserializeBinaryFromReader), t.addLine(o);
              break;
            case 7:
              var o = (
                /** @type {!proto.lens.WritingDirection} */
                n.readEnum()
              );
              t.setWritingDirection(o);
              break;
            case 8:
              var o = (
                /** @type {!proto.lens.Alignment} */
                n.readEnum()
              );
              t.setAlignment(o);
              break;
            case 9:
              var o = (
                /** @type {boolean} */
                n.readBool()
              );
              t.setJustified(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.TranslationData.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.TranslationData.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.TranslationData.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getStatus(), r != null && n.writeMessage(
          1,
          r,
          proto.lens.TranslationData.Status.serializeBinaryToWriter
        ), r = t.getTargetLanguage(), r.length > 0 && n.writeString(
          2,
          r
        ), r = t.getSourceLanguage(), r.length > 0 && n.writeString(
          3,
          r
        ), r = t.getTranslation(), r.length > 0 && n.writeString(
          4,
          r
        ), r = t.getLineList(), r.length > 0 && n.writeRepeatedMessage(
          5,
          r,
          proto.lens.TranslationData.Line.serializeBinaryToWriter
        ), r = t.getWritingDirection(), r !== 0 && n.writeEnum(
          7,
          r
        ), r = t.getAlignment(), r !== 0 && n.writeEnum(
          8,
          r
        ), r = t.getJustified(), r && n.writeBool(
          9,
          r
        );
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.TranslationData.Status.prototype.toObject = function(t) {
        return proto.lens.TranslationData.Status.toObject(t, this);
      }, proto.lens.TranslationData.Status.toObject = function(t, n) {
        var r = {
          code: e.Message.getFieldWithDefault(n, 1, 0)
        };
        return t && (r.$jspbMessageInstance = n), r;
      }), proto.lens.TranslationData.Status.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.TranslationData.Status();
        return proto.lens.TranslationData.Status.deserializeBinaryFromReader(r, n);
      }, proto.lens.TranslationData.Status.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = (
                /** @type {!proto.lens.TranslationData.Status.Code} */
                n.readEnum()
              );
              t.setCode(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.TranslationData.Status.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.TranslationData.Status.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.TranslationData.Status.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getCode(), r !== 0 && n.writeEnum(
          1,
          r
        );
      }, proto.lens.TranslationData.Status.Code = {
        UNKNOWN: 0,
        SUCCESS: 1,
        SERVER_ERROR: 2,
        UNSUPPORTED_LANGUAGE_PAIR: 3,
        SAME_LANGUAGE: 4,
        UNKNOWN_SOURCE_LANGUAGE: 5,
        INVALID_REQUEST: 6,
        DEADLINE_EXCEEDED: 7,
        EMPTY_TRANSLATION: 8,
        NO_OP_TRANSLATION: 9
      }, proto.lens.TranslationData.Status.prototype.getCode = function() {
        return (
          /** @type {!proto.lens.TranslationData.Status.Code} */
          e.Message.getFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.TranslationData.Status.prototype.setCode = function(t) {
        return e.Message.setProto3EnumField(this, 1, t);
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.TranslationData.TextStyle.prototype.toObject = function(t) {
        return proto.lens.TranslationData.TextStyle.toObject(t, this);
      }, proto.lens.TranslationData.TextStyle.toObject = function(t, n) {
        var r = {
          textColor: e.Message.getFieldWithDefault(n, 1, 0),
          backgroundPrimaryColor: e.Message.getFieldWithDefault(n, 2, 0)
        };
        return t && (r.$jspbMessageInstance = n), r;
      }), proto.lens.TranslationData.TextStyle.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.TranslationData.TextStyle();
        return proto.lens.TranslationData.TextStyle.deserializeBinaryFromReader(r, n);
      }, proto.lens.TranslationData.TextStyle.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = (
                /** @type {number} */
                n.readUint32()
              );
              t.setTextColor(o);
              break;
            case 2:
              var o = (
                /** @type {number} */
                n.readUint32()
              );
              t.setBackgroundPrimaryColor(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.TranslationData.TextStyle.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.TranslationData.TextStyle.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.TranslationData.TextStyle.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getTextColor(), r !== 0 && n.writeUint32(
          1,
          r
        ), r = t.getBackgroundPrimaryColor(), r !== 0 && n.writeUint32(
          2,
          r
        );
      }, proto.lens.TranslationData.TextStyle.prototype.getTextColor = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.TranslationData.TextStyle.prototype.setTextColor = function(t) {
        return e.Message.setProto3IntField(this, 1, t);
      }, proto.lens.TranslationData.TextStyle.prototype.getBackgroundPrimaryColor = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 2, 0)
        );
      }, proto.lens.TranslationData.TextStyle.prototype.setBackgroundPrimaryColor = function(t) {
        return e.Message.setProto3IntField(this, 2, t);
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.TranslationData.BackgroundImageData.prototype.toObject = function(t) {
        return proto.lens.TranslationData.BackgroundImageData.toObject(t, this);
      }, proto.lens.TranslationData.BackgroundImageData.toObject = function(t, n) {
        var r = {
          backgroundImage: n.getBackgroundImage_asB64(),
          imageWidth: e.Message.getFieldWithDefault(n, 2, 0),
          imageHeight: e.Message.getFieldWithDefault(n, 3, 0),
          verticalPadding: e.Message.getFloatingPointFieldWithDefault(n, 4, 0),
          horizontalPadding: e.Message.getFloatingPointFieldWithDefault(n, 5, 0),
          fileFormat: e.Message.getFieldWithDefault(n, 6, 0),
          textMask: n.getTextMask_asB64()
        };
        return t && (r.$jspbMessageInstance = n), r;
      }), proto.lens.TranslationData.BackgroundImageData.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.TranslationData.BackgroundImageData();
        return proto.lens.TranslationData.BackgroundImageData.deserializeBinaryFromReader(r, n);
      }, proto.lens.TranslationData.BackgroundImageData.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = (
                /** @type {!Uint8Array} */
                n.readBytes()
              );
              t.setBackgroundImage(o);
              break;
            case 2:
              var o = (
                /** @type {number} */
                n.readInt32()
              );
              t.setImageWidth(o);
              break;
            case 3:
              var o = (
                /** @type {number} */
                n.readInt32()
              );
              t.setImageHeight(o);
              break;
            case 4:
              var o = (
                /** @type {number} */
                n.readFloat()
              );
              t.setVerticalPadding(o);
              break;
            case 5:
              var o = (
                /** @type {number} */
                n.readFloat()
              );
              t.setHorizontalPadding(o);
              break;
            case 6:
              var o = (
                /** @type {!proto.lens.TranslationData.BackgroundImageData.FileFormat} */
                n.readEnum()
              );
              t.setFileFormat(o);
              break;
            case 7:
              var o = (
                /** @type {!Uint8Array} */
                n.readBytes()
              );
              t.setTextMask(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.TranslationData.BackgroundImageData.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.TranslationData.BackgroundImageData.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.TranslationData.BackgroundImageData.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getBackgroundImage_asU8(), r.length > 0 && n.writeBytes(
          1,
          r
        ), r = t.getImageWidth(), r !== 0 && n.writeInt32(
          2,
          r
        ), r = t.getImageHeight(), r !== 0 && n.writeInt32(
          3,
          r
        ), r = t.getVerticalPadding(), r !== 0 && n.writeFloat(
          4,
          r
        ), r = t.getHorizontalPadding(), r !== 0 && n.writeFloat(
          5,
          r
        ), r = t.getFileFormat(), r !== 0 && n.writeEnum(
          6,
          r
        ), r = t.getTextMask_asU8(), r.length > 0 && n.writeBytes(
          7,
          r
        );
      }, proto.lens.TranslationData.BackgroundImageData.FileFormat = {
        UNKNOWN: 0,
        RAW_BYTES_RGBA: 1,
        PNG_RGBA: 2,
        WEBP_RGBA: 3,
        JPEG_RGB_PNG_MASK: 4
      }, proto.lens.TranslationData.BackgroundImageData.prototype.getBackgroundImage = function() {
        return (
          /** @type {!(string|Uint8Array)} */
          e.Message.getFieldWithDefault(this, 1, "")
        );
      }, proto.lens.TranslationData.BackgroundImageData.prototype.getBackgroundImage_asB64 = function() {
        return (
          /** @type {string} */
          e.Message.bytesAsB64(
            this.getBackgroundImage()
          )
        );
      }, proto.lens.TranslationData.BackgroundImageData.prototype.getBackgroundImage_asU8 = function() {
        return (
          /** @type {!Uint8Array} */
          e.Message.bytesAsU8(
            this.getBackgroundImage()
          )
        );
      }, proto.lens.TranslationData.BackgroundImageData.prototype.setBackgroundImage = function(t) {
        return e.Message.setProto3BytesField(this, 1, t);
      }, proto.lens.TranslationData.BackgroundImageData.prototype.getImageWidth = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 2, 0)
        );
      }, proto.lens.TranslationData.BackgroundImageData.prototype.setImageWidth = function(t) {
        return e.Message.setProto3IntField(this, 2, t);
      }, proto.lens.TranslationData.BackgroundImageData.prototype.getImageHeight = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 3, 0)
        );
      }, proto.lens.TranslationData.BackgroundImageData.prototype.setImageHeight = function(t) {
        return e.Message.setProto3IntField(this, 3, t);
      }, proto.lens.TranslationData.BackgroundImageData.prototype.getVerticalPadding = function() {
        return (
          /** @type {number} */
          e.Message.getFloatingPointFieldWithDefault(this, 4, 0)
        );
      }, proto.lens.TranslationData.BackgroundImageData.prototype.setVerticalPadding = function(t) {
        return e.Message.setProto3FloatField(this, 4, t);
      }, proto.lens.TranslationData.BackgroundImageData.prototype.getHorizontalPadding = function() {
        return (
          /** @type {number} */
          e.Message.getFloatingPointFieldWithDefault(this, 5, 0)
        );
      }, proto.lens.TranslationData.BackgroundImageData.prototype.setHorizontalPadding = function(t) {
        return e.Message.setProto3FloatField(this, 5, t);
      }, proto.lens.TranslationData.BackgroundImageData.prototype.getFileFormat = function() {
        return (
          /** @type {!proto.lens.TranslationData.BackgroundImageData.FileFormat} */
          e.Message.getFieldWithDefault(this, 6, 0)
        );
      }, proto.lens.TranslationData.BackgroundImageData.prototype.setFileFormat = function(t) {
        return e.Message.setProto3EnumField(this, 6, t);
      }, proto.lens.TranslationData.BackgroundImageData.prototype.getTextMask = function() {
        return (
          /** @type {!(string|Uint8Array)} */
          e.Message.getFieldWithDefault(this, 7, "")
        );
      }, proto.lens.TranslationData.BackgroundImageData.prototype.getTextMask_asB64 = function() {
        return (
          /** @type {string} */
          e.Message.bytesAsB64(
            this.getTextMask()
          )
        );
      }, proto.lens.TranslationData.BackgroundImageData.prototype.getTextMask_asU8 = function() {
        return (
          /** @type {!Uint8Array} */
          e.Message.bytesAsU8(
            this.getTextMask()
          )
        );
      }, proto.lens.TranslationData.BackgroundImageData.prototype.setTextMask = function(t) {
        return e.Message.setProto3BytesField(this, 7, t);
      }, proto.lens.TranslationData.Line.repeatedFields_ = [5], e.Message.GENERATE_TO_OBJECT && (proto.lens.TranslationData.Line.prototype.toObject = function(t) {
        return proto.lens.TranslationData.Line.toObject(t, this);
      }, proto.lens.TranslationData.Line.toObject = function(t, n) {
        var r, o = {
          start: e.Message.getFieldWithDefault(n, 1, 0),
          end: e.Message.getFieldWithDefault(n, 2, 0),
          style: (r = n.getStyle()) && proto.lens.TranslationData.TextStyle.toObject(t, r),
          wordList: e.Message.toObjectList(
            n.getWordList(),
            proto.lens.TranslationData.Line.Word.toObject,
            t
          ),
          backgroundImageData: (r = n.getBackgroundImageData()) && proto.lens.TranslationData.BackgroundImageData.toObject(t, r)
        };
        return t && (o.$jspbMessageInstance = n), o;
      }), proto.lens.TranslationData.Line.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.TranslationData.Line();
        return proto.lens.TranslationData.Line.deserializeBinaryFromReader(r, n);
      }, proto.lens.TranslationData.Line.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = (
                /** @type {number} */
                n.readInt32()
              );
              t.setStart(o);
              break;
            case 2:
              var o = (
                /** @type {number} */
                n.readInt32()
              );
              t.setEnd(o);
              break;
            case 3:
              var o = new proto.lens.TranslationData.TextStyle();
              n.readMessage(o, proto.lens.TranslationData.TextStyle.deserializeBinaryFromReader), t.setStyle(o);
              break;
            case 5:
              var o = new proto.lens.TranslationData.Line.Word();
              n.readMessage(o, proto.lens.TranslationData.Line.Word.deserializeBinaryFromReader), t.addWord(o);
              break;
            case 9:
              var o = new proto.lens.TranslationData.BackgroundImageData();
              n.readMessage(o, proto.lens.TranslationData.BackgroundImageData.deserializeBinaryFromReader), t.setBackgroundImageData(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.TranslationData.Line.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.TranslationData.Line.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.TranslationData.Line.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getStart(), r !== 0 && n.writeInt32(
          1,
          r
        ), r = t.getEnd(), r !== 0 && n.writeInt32(
          2,
          r
        ), r = t.getStyle(), r != null && n.writeMessage(
          3,
          r,
          proto.lens.TranslationData.TextStyle.serializeBinaryToWriter
        ), r = t.getWordList(), r.length > 0 && n.writeRepeatedMessage(
          5,
          r,
          proto.lens.TranslationData.Line.Word.serializeBinaryToWriter
        ), r = t.getBackgroundImageData(), r != null && n.writeMessage(
          9,
          r,
          proto.lens.TranslationData.BackgroundImageData.serializeBinaryToWriter
        );
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.TranslationData.Line.Word.prototype.toObject = function(t) {
        return proto.lens.TranslationData.Line.Word.toObject(t, this);
      }, proto.lens.TranslationData.Line.Word.toObject = function(t, n) {
        var r = {
          start: e.Message.getFieldWithDefault(n, 1, 0),
          end: e.Message.getFieldWithDefault(n, 2, 0)
        };
        return t && (r.$jspbMessageInstance = n), r;
      }), proto.lens.TranslationData.Line.Word.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.TranslationData.Line.Word();
        return proto.lens.TranslationData.Line.Word.deserializeBinaryFromReader(r, n);
      }, proto.lens.TranslationData.Line.Word.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = (
                /** @type {number} */
                n.readInt32()
              );
              t.setStart(o);
              break;
            case 2:
              var o = (
                /** @type {number} */
                n.readInt32()
              );
              t.setEnd(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.TranslationData.Line.Word.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.TranslationData.Line.Word.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.TranslationData.Line.Word.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getStart(), r !== 0 && n.writeInt32(
          1,
          r
        ), r = t.getEnd(), r !== 0 && n.writeInt32(
          2,
          r
        );
      }, proto.lens.TranslationData.Line.Word.prototype.getStart = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.TranslationData.Line.Word.prototype.setStart = function(t) {
        return e.Message.setProto3IntField(this, 1, t);
      }, proto.lens.TranslationData.Line.Word.prototype.getEnd = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 2, 0)
        );
      }, proto.lens.TranslationData.Line.Word.prototype.setEnd = function(t) {
        return e.Message.setProto3IntField(this, 2, t);
      }, proto.lens.TranslationData.Line.prototype.getStart = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.TranslationData.Line.prototype.setStart = function(t) {
        return e.Message.setProto3IntField(this, 1, t);
      }, proto.lens.TranslationData.Line.prototype.getEnd = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 2, 0)
        );
      }, proto.lens.TranslationData.Line.prototype.setEnd = function(t) {
        return e.Message.setProto3IntField(this, 2, t);
      }, proto.lens.TranslationData.Line.prototype.getStyle = function() {
        return (
          /** @type{?proto.lens.TranslationData.TextStyle} */
          e.Message.getWrapperField(this, proto.lens.TranslationData.TextStyle, 3)
        );
      }, proto.lens.TranslationData.Line.prototype.setStyle = function(t) {
        return e.Message.setWrapperField(this, 3, t);
      }, proto.lens.TranslationData.Line.prototype.clearStyle = function() {
        return this.setStyle(void 0);
      }, proto.lens.TranslationData.Line.prototype.hasStyle = function() {
        return e.Message.getField(this, 3) != null;
      }, proto.lens.TranslationData.Line.prototype.getWordList = function() {
        return (
          /** @type{!Array<!proto.lens.TranslationData.Line.Word>} */
          e.Message.getRepeatedWrapperField(this, proto.lens.TranslationData.Line.Word, 5)
        );
      }, proto.lens.TranslationData.Line.prototype.setWordList = function(t) {
        return e.Message.setRepeatedWrapperField(this, 5, t);
      }, proto.lens.TranslationData.Line.prototype.addWord = function(t, n) {
        return e.Message.addToRepeatedWrapperField(this, 5, t, proto.lens.TranslationData.Line.Word, n);
      }, proto.lens.TranslationData.Line.prototype.clearWordList = function() {
        return this.setWordList([]);
      }, proto.lens.TranslationData.Line.prototype.getBackgroundImageData = function() {
        return (
          /** @type{?proto.lens.TranslationData.BackgroundImageData} */
          e.Message.getWrapperField(this, proto.lens.TranslationData.BackgroundImageData, 9)
        );
      }, proto.lens.TranslationData.Line.prototype.setBackgroundImageData = function(t) {
        return e.Message.setWrapperField(this, 9, t);
      }, proto.lens.TranslationData.Line.prototype.clearBackgroundImageData = function() {
        return this.setBackgroundImageData(void 0);
      }, proto.lens.TranslationData.Line.prototype.hasBackgroundImageData = function() {
        return e.Message.getField(this, 9) != null;
      }, proto.lens.TranslationData.prototype.getStatus = function() {
        return (
          /** @type{?proto.lens.TranslationData.Status} */
          e.Message.getWrapperField(this, proto.lens.TranslationData.Status, 1)
        );
      }, proto.lens.TranslationData.prototype.setStatus = function(t) {
        return e.Message.setWrapperField(this, 1, t);
      }, proto.lens.TranslationData.prototype.clearStatus = function() {
        return this.setStatus(void 0);
      }, proto.lens.TranslationData.prototype.hasStatus = function() {
        return e.Message.getField(this, 1) != null;
      }, proto.lens.TranslationData.prototype.getTargetLanguage = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 2, "")
        );
      }, proto.lens.TranslationData.prototype.setTargetLanguage = function(t) {
        return e.Message.setProto3StringField(this, 2, t);
      }, proto.lens.TranslationData.prototype.getSourceLanguage = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 3, "")
        );
      }, proto.lens.TranslationData.prototype.setSourceLanguage = function(t) {
        return e.Message.setProto3StringField(this, 3, t);
      }, proto.lens.TranslationData.prototype.getTranslation = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 4, "")
        );
      }, proto.lens.TranslationData.prototype.setTranslation = function(t) {
        return e.Message.setProto3StringField(this, 4, t);
      }, proto.lens.TranslationData.prototype.getLineList = function() {
        return (
          /** @type{!Array<!proto.lens.TranslationData.Line>} */
          e.Message.getRepeatedWrapperField(this, proto.lens.TranslationData.Line, 5)
        );
      }, proto.lens.TranslationData.prototype.setLineList = function(t) {
        return e.Message.setRepeatedWrapperField(this, 5, t);
      }, proto.lens.TranslationData.prototype.addLine = function(t, n) {
        return e.Message.addToRepeatedWrapperField(this, 5, t, proto.lens.TranslationData.Line, n);
      }, proto.lens.TranslationData.prototype.clearLineList = function() {
        return this.setLineList([]);
      }, proto.lens.TranslationData.prototype.getWritingDirection = function() {
        return (
          /** @type {!proto.lens.WritingDirection} */
          e.Message.getFieldWithDefault(this, 7, 0)
        );
      }, proto.lens.TranslationData.prototype.setWritingDirection = function(t) {
        return e.Message.setProto3EnumField(this, 7, t);
      }, proto.lens.TranslationData.prototype.getAlignment = function() {
        return (
          /** @type {!proto.lens.Alignment} */
          e.Message.getFieldWithDefault(this, 8, 0)
        );
      }, proto.lens.TranslationData.prototype.setAlignment = function(t) {
        return e.Message.setProto3EnumField(this, 8, t);
      }, proto.lens.TranslationData.prototype.getJustified = function() {
        return (
          /** @type {boolean} */
          e.Message.getBooleanFieldWithDefault(this, 9, false)
        );
      }, proto.lens.TranslationData.prototype.setJustified = function(t) {
        return e.Message.setProto3BooleanField(this, 9, t);
      }, i.object.extend(c, proto.lens);
    }(w)), w;
  }
  var z = {};
  var ce;
  function Ze() {
    return ce || (ce = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis;
      i.exportSymbol("proto.lens.LensOverlayDocument", null, d), i.exportSymbol("proto.lens.Page", null, d), proto.lens.LensOverlayDocument = function(a) {
        e.Message.initialize(this, a, 0, -1, proto.lens.LensOverlayDocument.repeatedFields_, null);
      }, i.inherits(proto.lens.LensOverlayDocument, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayDocument.displayName = "proto.lens.LensOverlayDocument"), proto.lens.Page = function(a) {
        e.Message.initialize(this, a, 0, -1, proto.lens.Page.repeatedFields_, null);
      }, i.inherits(proto.lens.Page, e.Message), i.DEBUG && !COMPILED && (proto.lens.Page.displayName = "proto.lens.Page"), proto.lens.LensOverlayDocument.repeatedFields_ = [1], e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayDocument.prototype.toObject = function(a) {
        return proto.lens.LensOverlayDocument.toObject(a, this);
      }, proto.lens.LensOverlayDocument.toObject = function(a, t) {
        var n = {
          pagesList: e.Message.toObjectList(
            t.getPagesList(),
            proto.lens.Page.toObject,
            a
          )
        };
        return a && (n.$jspbMessageInstance = t), n;
      }), proto.lens.LensOverlayDocument.deserializeBinary = function(a) {
        var t = new e.BinaryReader(a), n = new proto.lens.LensOverlayDocument();
        return proto.lens.LensOverlayDocument.deserializeBinaryFromReader(n, t);
      }, proto.lens.LensOverlayDocument.deserializeBinaryFromReader = function(a, t) {
        for (; t.nextField() && !t.isEndGroup(); ) {
          var n = t.getFieldNumber();
          switch (n) {
            case 1:
              var r = new proto.lens.Page();
              t.readMessage(r, proto.lens.Page.deserializeBinaryFromReader), a.addPages(r);
              break;
            default:
              t.skipField();
              break;
          }
        }
        return a;
      }, proto.lens.LensOverlayDocument.prototype.serializeBinary = function() {
        var a = new e.BinaryWriter();
        return proto.lens.LensOverlayDocument.serializeBinaryToWriter(this, a), a.getResultBuffer();
      }, proto.lens.LensOverlayDocument.serializeBinaryToWriter = function(a, t) {
        var n = void 0;
        n = a.getPagesList(), n.length > 0 && t.writeRepeatedMessage(
          1,
          n,
          proto.lens.Page.serializeBinaryToWriter
        );
      }, proto.lens.LensOverlayDocument.prototype.getPagesList = function() {
        return (
          /** @type{!Array<!proto.lens.Page>} */
          e.Message.getRepeatedWrapperField(this, proto.lens.Page, 1)
        );
      }, proto.lens.LensOverlayDocument.prototype.setPagesList = function(a) {
        return e.Message.setRepeatedWrapperField(this, 1, a);
      }, proto.lens.LensOverlayDocument.prototype.addPages = function(a, t) {
        return e.Message.addToRepeatedWrapperField(this, 1, a, proto.lens.Page, t);
      }, proto.lens.LensOverlayDocument.prototype.clearPagesList = function() {
        return this.setPagesList([]);
      }, proto.lens.Page.repeatedFields_ = [4], e.Message.GENERATE_TO_OBJECT && (proto.lens.Page.prototype.toObject = function(a) {
        return proto.lens.Page.toObject(a, this);
      }, proto.lens.Page.toObject = function(a, t) {
        var n, r = {
          pageNumber: e.Message.getFieldWithDefault(t, 1, 0),
          textSegmentsList: (n = e.Message.getRepeatedField(t, 4)) == null ? void 0 : n
        };
        return a && (r.$jspbMessageInstance = t), r;
      }), proto.lens.Page.deserializeBinary = function(a) {
        var t = new e.BinaryReader(a), n = new proto.lens.Page();
        return proto.lens.Page.deserializeBinaryFromReader(n, t);
      }, proto.lens.Page.deserializeBinaryFromReader = function(a, t) {
        for (; t.nextField() && !t.isEndGroup(); ) {
          var n = t.getFieldNumber();
          switch (n) {
            case 1:
              var r = (
                /** @type {number} */
                t.readInt32()
              );
              a.setPageNumber(r);
              break;
            case 4:
              var r = (
                /** @type {string} */
                t.readString()
              );
              a.addTextSegments(r);
              break;
            default:
              t.skipField();
              break;
          }
        }
        return a;
      }, proto.lens.Page.prototype.serializeBinary = function() {
        var a = new e.BinaryWriter();
        return proto.lens.Page.serializeBinaryToWriter(this, a), a.getResultBuffer();
      }, proto.lens.Page.serializeBinaryToWriter = function(a, t) {
        var n = void 0;
        n = a.getPageNumber(), n !== 0 && t.writeInt32(
          1,
          n
        ), n = a.getTextSegmentsList(), n.length > 0 && t.writeRepeatedString(
          4,
          n
        );
      }, proto.lens.Page.prototype.getPageNumber = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.Page.prototype.setPageNumber = function(a) {
        return e.Message.setProto3IntField(this, 1, a);
      }, proto.lens.Page.prototype.getTextSegmentsList = function() {
        return (
          /** @type {!Array<string>} */
          e.Message.getRepeatedField(this, 4)
        );
      }, proto.lens.Page.prototype.setTextSegmentsList = function(a) {
        return e.Message.setField(this, 4, a || []);
      }, proto.lens.Page.prototype.addTextSegments = function(a, t) {
        return e.Message.addToRepeatedField(this, 4, a, t);
      }, proto.lens.Page.prototype.clearTextSegmentsList = function() {
        return this.setTextSegmentsList([]);
      }, i.object.extend(c, proto.lens);
    }(z)), z;
  }
  var q = {};
  var G = {};
  var fe;
  function Ye() {
    return fe || (fe = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis;
      i.exportSymbol("proto.lens.ClientImage", null, d), proto.lens.ClientImage = function(a) {
        e.Message.initialize(this, a, 0, -1, null, null);
      }, i.inherits(proto.lens.ClientImage, e.Message), i.DEBUG && !COMPILED && (proto.lens.ClientImage.displayName = "proto.lens.ClientImage"), e.Message.GENERATE_TO_OBJECT && (proto.lens.ClientImage.prototype.toObject = function(a) {
        return proto.lens.ClientImage.toObject(a, this);
      }, proto.lens.ClientImage.toObject = function(a, t) {
        var n = {
          imageContent: t.getImageContent_asB64()
        };
        return a && (n.$jspbMessageInstance = t), n;
      }), proto.lens.ClientImage.deserializeBinary = function(a) {
        var t = new e.BinaryReader(a), n = new proto.lens.ClientImage();
        return proto.lens.ClientImage.deserializeBinaryFromReader(n, t);
      }, proto.lens.ClientImage.deserializeBinaryFromReader = function(a, t) {
        for (; t.nextField() && !t.isEndGroup(); ) {
          var n = t.getFieldNumber();
          switch (n) {
            case 1:
              var r = (
                /** @type {!Uint8Array} */
                t.readBytes()
              );
              a.setImageContent(r);
              break;
            default:
              t.skipField();
              break;
          }
        }
        return a;
      }, proto.lens.ClientImage.prototype.serializeBinary = function() {
        var a = new e.BinaryWriter();
        return proto.lens.ClientImage.serializeBinaryToWriter(this, a), a.getResultBuffer();
      }, proto.lens.ClientImage.serializeBinaryToWriter = function(a, t) {
        var n = void 0;
        n = a.getImageContent_asU8(), n.length > 0 && t.writeBytes(
          1,
          n
        );
      }, proto.lens.ClientImage.prototype.getImageContent = function() {
        return (
          /** @type {!(string|Uint8Array)} */
          e.Message.getFieldWithDefault(this, 1, "")
        );
      }, proto.lens.ClientImage.prototype.getImageContent_asB64 = function() {
        return (
          /** @type {string} */
          e.Message.bytesAsB64(
            this.getImageContent()
          )
        );
      }, proto.lens.ClientImage.prototype.getImageContent_asU8 = function() {
        return (
          /** @type {!Uint8Array} */
          e.Message.bytesAsU8(
            this.getImageContent()
          )
        );
      }, proto.lens.ClientImage.prototype.setImageContent = function(a) {
        return e.Message.setProto3BytesField(this, 1, a);
      }, i.object.extend(c, proto.lens);
    }(G)), G;
  }
  var he;
  function He() {
    return he || (he = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis, a = /* @__PURE__ */ R();
      i.object.extend(proto, a);
      var t = /* @__PURE__ */ Ye();
      i.object.extend(proto, t), i.exportSymbol("proto.lens.ImageCrop", null, d), proto.lens.ImageCrop = function(n) {
        e.Message.initialize(this, n, 0, -1, null, null);
      }, i.inherits(proto.lens.ImageCrop, e.Message), i.DEBUG && !COMPILED && (proto.lens.ImageCrop.displayName = "proto.lens.ImageCrop"), e.Message.GENERATE_TO_OBJECT && (proto.lens.ImageCrop.prototype.toObject = function(n) {
        return proto.lens.ImageCrop.toObject(n, this);
      }, proto.lens.ImageCrop.toObject = function(n, r) {
        var o, u = {
          cropId: e.Message.getFieldWithDefault(r, 1, ""),
          image: (o = r.getImage()) && t.ClientImage.toObject(n, o),
          zoomedCrop: (o = r.getZoomedCrop()) && a.ZoomedCrop.toObject(n, o)
        };
        return n && (u.$jspbMessageInstance = r), u;
      }), proto.lens.ImageCrop.deserializeBinary = function(n) {
        var r = new e.BinaryReader(n), o = new proto.lens.ImageCrop();
        return proto.lens.ImageCrop.deserializeBinaryFromReader(o, r);
      }, proto.lens.ImageCrop.deserializeBinaryFromReader = function(n, r) {
        for (; r.nextField() && !r.isEndGroup(); ) {
          var o = r.getFieldNumber();
          switch (o) {
            case 1:
              var u = (
                /** @type {string} */
                r.readString()
              );
              n.setCropId(u);
              break;
            case 2:
              var u = new t.ClientImage();
              r.readMessage(u, t.ClientImage.deserializeBinaryFromReader), n.setImage(u);
              break;
            case 3:
              var u = new a.ZoomedCrop();
              r.readMessage(u, a.ZoomedCrop.deserializeBinaryFromReader), n.setZoomedCrop(u);
              break;
            default:
              r.skipField();
              break;
          }
        }
        return n;
      }, proto.lens.ImageCrop.prototype.serializeBinary = function() {
        var n = new e.BinaryWriter();
        return proto.lens.ImageCrop.serializeBinaryToWriter(this, n), n.getResultBuffer();
      }, proto.lens.ImageCrop.serializeBinaryToWriter = function(n, r) {
        var o = void 0;
        o = n.getCropId(), o.length > 0 && r.writeString(
          1,
          o
        ), o = n.getImage(), o != null && r.writeMessage(
          2,
          o,
          t.ClientImage.serializeBinaryToWriter
        ), o = n.getZoomedCrop(), o != null && r.writeMessage(
          3,
          o,
          a.ZoomedCrop.serializeBinaryToWriter
        );
      }, proto.lens.ImageCrop.prototype.getCropId = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 1, "")
        );
      }, proto.lens.ImageCrop.prototype.setCropId = function(n) {
        return e.Message.setProto3StringField(this, 1, n);
      }, proto.lens.ImageCrop.prototype.getImage = function() {
        return (
          /** @type{?proto.lens.ClientImage} */
          e.Message.getWrapperField(this, t.ClientImage, 2)
        );
      }, proto.lens.ImageCrop.prototype.setImage = function(n) {
        return e.Message.setWrapperField(this, 2, n);
      }, proto.lens.ImageCrop.prototype.clearImage = function() {
        return this.setImage(void 0);
      }, proto.lens.ImageCrop.prototype.hasImage = function() {
        return e.Message.getField(this, 2) != null;
      }, proto.lens.ImageCrop.prototype.getZoomedCrop = function() {
        return (
          /** @type{?proto.lens.ZoomedCrop} */
          e.Message.getWrapperField(this, a.ZoomedCrop, 3)
        );
      }, proto.lens.ImageCrop.prototype.setZoomedCrop = function(n) {
        return e.Message.setWrapperField(this, 3, n);
      }, proto.lens.ImageCrop.prototype.clearZoomedCrop = function() {
        return this.setZoomedCrop(void 0);
      }, proto.lens.ImageCrop.prototype.hasZoomedCrop = function() {
        return e.Message.getField(this, 3) != null;
      }, i.object.extend(c, proto.lens);
    }(q)), q;
  }
  var N = {};
  var ve;
  function xe() {
    return ve || (ve = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis, a = /* @__PURE__ */ R();
      i.object.extend(proto, a), i.exportSymbol("proto.lens.ImageData", null, d), i.exportSymbol("proto.lens.ImageMetadata", null, d), i.exportSymbol("proto.lens.ImagePayload", null, d), proto.lens.ImageData = function(t) {
        e.Message.initialize(this, t, 0, -1, proto.lens.ImageData.repeatedFields_, null);
      }, i.inherits(proto.lens.ImageData, e.Message), i.DEBUG && !COMPILED && (proto.lens.ImageData.displayName = "proto.lens.ImageData"), proto.lens.ImagePayload = function(t) {
        e.Message.initialize(this, t, 0, -1, null, null);
      }, i.inherits(proto.lens.ImagePayload, e.Message), i.DEBUG && !COMPILED && (proto.lens.ImagePayload.displayName = "proto.lens.ImagePayload"), proto.lens.ImageMetadata = function(t) {
        e.Message.initialize(this, t, 0, -1, null, null);
      }, i.inherits(proto.lens.ImageMetadata, e.Message), i.DEBUG && !COMPILED && (proto.lens.ImageMetadata.displayName = "proto.lens.ImageMetadata"), proto.lens.ImageData.repeatedFields_ = [4], e.Message.GENERATE_TO_OBJECT && (proto.lens.ImageData.prototype.toObject = function(t) {
        return proto.lens.ImageData.toObject(t, this);
      }, proto.lens.ImageData.toObject = function(t, n) {
        var r, o = {
          payload: (r = n.getPayload()) && proto.lens.ImagePayload.toObject(t, r),
          imageMetadata: (r = n.getImageMetadata()) && proto.lens.ImageMetadata.toObject(t, r),
          significantRegionsList: e.Message.toObjectList(
            n.getSignificantRegionsList(),
            a.Geometry.toObject,
            t
          )
        };
        return t && (o.$jspbMessageInstance = n), o;
      }), proto.lens.ImageData.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.ImageData();
        return proto.lens.ImageData.deserializeBinaryFromReader(r, n);
      }, proto.lens.ImageData.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = new proto.lens.ImagePayload();
              n.readMessage(o, proto.lens.ImagePayload.deserializeBinaryFromReader), t.setPayload(o);
              break;
            case 3:
              var o = new proto.lens.ImageMetadata();
              n.readMessage(o, proto.lens.ImageMetadata.deserializeBinaryFromReader), t.setImageMetadata(o);
              break;
            case 4:
              var o = new a.Geometry();
              n.readMessage(o, a.Geometry.deserializeBinaryFromReader), t.addSignificantRegions(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.ImageData.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.ImageData.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.ImageData.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getPayload(), r != null && n.writeMessage(
          1,
          r,
          proto.lens.ImagePayload.serializeBinaryToWriter
        ), r = t.getImageMetadata(), r != null && n.writeMessage(
          3,
          r,
          proto.lens.ImageMetadata.serializeBinaryToWriter
        ), r = t.getSignificantRegionsList(), r.length > 0 && n.writeRepeatedMessage(
          4,
          r,
          a.Geometry.serializeBinaryToWriter
        );
      }, proto.lens.ImageData.prototype.getPayload = function() {
        return (
          /** @type{?proto.lens.ImagePayload} */
          e.Message.getWrapperField(this, proto.lens.ImagePayload, 1)
        );
      }, proto.lens.ImageData.prototype.setPayload = function(t) {
        return e.Message.setWrapperField(this, 1, t);
      }, proto.lens.ImageData.prototype.clearPayload = function() {
        return this.setPayload(void 0);
      }, proto.lens.ImageData.prototype.hasPayload = function() {
        return e.Message.getField(this, 1) != null;
      }, proto.lens.ImageData.prototype.getImageMetadata = function() {
        return (
          /** @type{?proto.lens.ImageMetadata} */
          e.Message.getWrapperField(this, proto.lens.ImageMetadata, 3)
        );
      }, proto.lens.ImageData.prototype.setImageMetadata = function(t) {
        return e.Message.setWrapperField(this, 3, t);
      }, proto.lens.ImageData.prototype.clearImageMetadata = function() {
        return this.setImageMetadata(void 0);
      }, proto.lens.ImageData.prototype.hasImageMetadata = function() {
        return e.Message.getField(this, 3) != null;
      }, proto.lens.ImageData.prototype.getSignificantRegionsList = function() {
        return (
          /** @type{!Array<!proto.lens.Geometry>} */
          e.Message.getRepeatedWrapperField(this, a.Geometry, 4)
        );
      }, proto.lens.ImageData.prototype.setSignificantRegionsList = function(t) {
        return e.Message.setRepeatedWrapperField(this, 4, t);
      }, proto.lens.ImageData.prototype.addSignificantRegions = function(t, n) {
        return e.Message.addToRepeatedWrapperField(this, 4, t, proto.lens.Geometry, n);
      }, proto.lens.ImageData.prototype.clearSignificantRegionsList = function() {
        return this.setSignificantRegionsList([]);
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.ImagePayload.prototype.toObject = function(t) {
        return proto.lens.ImagePayload.toObject(t, this);
      }, proto.lens.ImagePayload.toObject = function(t, n) {
        var r = {
          imageBytes: n.getImageBytes_asB64()
        };
        return t && (r.$jspbMessageInstance = n), r;
      }), proto.lens.ImagePayload.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.ImagePayload();
        return proto.lens.ImagePayload.deserializeBinaryFromReader(r, n);
      }, proto.lens.ImagePayload.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = (
                /** @type {!Uint8Array} */
                n.readBytes()
              );
              t.setImageBytes(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.ImagePayload.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.ImagePayload.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.ImagePayload.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getImageBytes_asU8(), r.length > 0 && n.writeBytes(
          1,
          r
        );
      }, proto.lens.ImagePayload.prototype.getImageBytes = function() {
        return (
          /** @type {!(string|Uint8Array)} */
          e.Message.getFieldWithDefault(this, 1, "")
        );
      }, proto.lens.ImagePayload.prototype.getImageBytes_asB64 = function() {
        return (
          /** @type {string} */
          e.Message.bytesAsB64(
            this.getImageBytes()
          )
        );
      }, proto.lens.ImagePayload.prototype.getImageBytes_asU8 = function() {
        return (
          /** @type {!Uint8Array} */
          e.Message.bytesAsU8(
            this.getImageBytes()
          )
        );
      }, proto.lens.ImagePayload.prototype.setImageBytes = function(t) {
        return e.Message.setProto3BytesField(this, 1, t);
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.ImageMetadata.prototype.toObject = function(t) {
        return proto.lens.ImageMetadata.toObject(t, this);
      }, proto.lens.ImageMetadata.toObject = function(t, n) {
        var r = {
          width: e.Message.getFieldWithDefault(n, 1, 0),
          height: e.Message.getFieldWithDefault(n, 2, 0)
        };
        return t && (r.$jspbMessageInstance = n), r;
      }), proto.lens.ImageMetadata.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.ImageMetadata();
        return proto.lens.ImageMetadata.deserializeBinaryFromReader(r, n);
      }, proto.lens.ImageMetadata.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = (
                /** @type {number} */
                n.readInt32()
              );
              t.setWidth(o);
              break;
            case 2:
              var o = (
                /** @type {number} */
                n.readInt32()
              );
              t.setHeight(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.ImageMetadata.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.ImageMetadata.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.ImageMetadata.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getWidth(), r !== 0 && n.writeInt32(
          1,
          r
        ), r = t.getHeight(), r !== 0 && n.writeInt32(
          2,
          r
        );
      }, proto.lens.ImageMetadata.prototype.getWidth = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.ImageMetadata.prototype.setWidth = function(t) {
        return e.Message.setProto3IntField(this, 1, t);
      }, proto.lens.ImageMetadata.prototype.getHeight = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 2, 0)
        );
      }, proto.lens.ImageMetadata.prototype.setHeight = function(t) {
        return e.Message.setProto3IntField(this, 2, t);
      }, i.object.extend(c, proto.lens);
    }(N)), N;
  }
  var A = {};
  var U = {};
  var Oe;
  function Xe() {
    return Oe || (Oe = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis;
      i.exportSymbol("proto.lens.TextQuery", null, d), proto.lens.TextQuery = function(a) {
        e.Message.initialize(this, a, 0, -1, null, null);
      }, i.inherits(proto.lens.TextQuery, e.Message), i.DEBUG && !COMPILED && (proto.lens.TextQuery.displayName = "proto.lens.TextQuery"), e.Message.GENERATE_TO_OBJECT && (proto.lens.TextQuery.prototype.toObject = function(a) {
        return proto.lens.TextQuery.toObject(a, this);
      }, proto.lens.TextQuery.toObject = function(a, t) {
        var n = {
          query: e.Message.getFieldWithDefault(t, 1, ""),
          isPrimary: e.Message.getBooleanFieldWithDefault(t, 2, false)
        };
        return a && (n.$jspbMessageInstance = t), n;
      }), proto.lens.TextQuery.deserializeBinary = function(a) {
        var t = new e.BinaryReader(a), n = new proto.lens.TextQuery();
        return proto.lens.TextQuery.deserializeBinaryFromReader(n, t);
      }, proto.lens.TextQuery.deserializeBinaryFromReader = function(a, t) {
        for (; t.nextField() && !t.isEndGroup(); ) {
          var n = t.getFieldNumber();
          switch (n) {
            case 1:
              var r = (
                /** @type {string} */
                t.readString()
              );
              a.setQuery(r);
              break;
            case 2:
              var r = (
                /** @type {boolean} */
                t.readBool()
              );
              a.setIsPrimary(r);
              break;
            default:
              t.skipField();
              break;
          }
        }
        return a;
      }, proto.lens.TextQuery.prototype.serializeBinary = function() {
        var a = new e.BinaryWriter();
        return proto.lens.TextQuery.serializeBinaryToWriter(this, a), a.getResultBuffer();
      }, proto.lens.TextQuery.serializeBinaryToWriter = function(a, t) {
        var n = void 0;
        n = a.getQuery(), n.length > 0 && t.writeString(
          1,
          n
        ), n = a.getIsPrimary(), n && t.writeBool(
          2,
          n
        );
      }, proto.lens.TextQuery.prototype.getQuery = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 1, "")
        );
      }, proto.lens.TextQuery.prototype.setQuery = function(a) {
        return e.Message.setProto3StringField(this, 1, a);
      }, proto.lens.TextQuery.prototype.getIsPrimary = function() {
        return (
          /** @type {boolean} */
          e.Message.getBooleanFieldWithDefault(this, 2, false)
        );
      }, proto.lens.TextQuery.prototype.setIsPrimary = function(a) {
        return e.Message.setProto3BooleanField(this, 2, a);
      }, i.object.extend(c, proto.lens);
    }(U)), U;
  }
  var Me;
  function Ke() {
    return Me || (Me = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis, a = /* @__PURE__ */ R();
      i.object.extend(proto, a);
      var t = /* @__PURE__ */ Xe();
      i.object.extend(proto, t), i.exportSymbol("proto.lens.LensOverlayInteractionRequestMetadata", null, d), i.exportSymbol("proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata", null, d), i.exportSymbol("proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata", null, d), i.exportSymbol("proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object", null, d), i.exportSymbol("proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point", null, d), i.exportSymbol("proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region", null, d), i.exportSymbol("proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.SelectionCase", null, d), i.exportSymbol("proto.lens.LensOverlayInteractionRequestMetadata.Type", null, d), proto.lens.LensOverlayInteractionRequestMetadata = function(n) {
        e.Message.initialize(this, n, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayInteractionRequestMetadata, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayInteractionRequestMetadata.displayName = "proto.lens.LensOverlayInteractionRequestMetadata"), proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata = function(n) {
        e.Message.initialize(this, n, 0, -1, null, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.oneofGroups_);
      }, i.inherits(proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.displayName = "proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata"), proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point = function(n) {
        e.Message.initialize(this, n, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point.displayName = "proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point"), proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region = function(n) {
        e.Message.initialize(this, n, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region.displayName = "proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region"), proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object = function(n) {
        e.Message.initialize(this, n, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object.displayName = "proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object"), proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata = function(n) {
        e.Message.initialize(this, n, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata.displayName = "proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata"), e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayInteractionRequestMetadata.prototype.toObject = function(n) {
        return proto.lens.LensOverlayInteractionRequestMetadata.toObject(n, this);
      }, proto.lens.LensOverlayInteractionRequestMetadata.toObject = function(n, r) {
        var o, u = {
          type: e.Message.getFieldWithDefault(r, 1, 0),
          selectionMetadata: (o = r.getSelectionMetadata()) && proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.toObject(n, o),
          queryMetadata: (o = r.getQueryMetadata()) && proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata.toObject(n, o)
        };
        return n && (u.$jspbMessageInstance = r), u;
      }), proto.lens.LensOverlayInteractionRequestMetadata.deserializeBinary = function(n) {
        var r = new e.BinaryReader(n), o = new proto.lens.LensOverlayInteractionRequestMetadata();
        return proto.lens.LensOverlayInteractionRequestMetadata.deserializeBinaryFromReader(o, r);
      }, proto.lens.LensOverlayInteractionRequestMetadata.deserializeBinaryFromReader = function(n, r) {
        for (; r.nextField() && !r.isEndGroup(); ) {
          var o = r.getFieldNumber();
          switch (o) {
            case 1:
              var u = (
                /** @type {!proto.lens.LensOverlayInteractionRequestMetadata.Type} */
                r.readEnum()
              );
              n.setType(u);
              break;
            case 2:
              var u = new proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata();
              r.readMessage(u, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.deserializeBinaryFromReader), n.setSelectionMetadata(u);
              break;
            case 4:
              var u = new proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata();
              r.readMessage(u, proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata.deserializeBinaryFromReader), n.setQueryMetadata(u);
              break;
            default:
              r.skipField();
              break;
          }
        }
        return n;
      }, proto.lens.LensOverlayInteractionRequestMetadata.prototype.serializeBinary = function() {
        var n = new e.BinaryWriter();
        return proto.lens.LensOverlayInteractionRequestMetadata.serializeBinaryToWriter(this, n), n.getResultBuffer();
      }, proto.lens.LensOverlayInteractionRequestMetadata.serializeBinaryToWriter = function(n, r) {
        var o = void 0;
        o = n.getType(), o !== 0 && r.writeEnum(
          1,
          o
        ), o = n.getSelectionMetadata(), o != null && r.writeMessage(
          2,
          o,
          proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.serializeBinaryToWriter
        ), o = n.getQueryMetadata(), o != null && r.writeMessage(
          4,
          o,
          proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata.serializeBinaryToWriter
        );
      }, proto.lens.LensOverlayInteractionRequestMetadata.Type = {
        UNKNOWN: 0,
        TAP: 1,
        REGION: 2,
        TEXT_SELECTION: 3,
        REGION_SEARCH: 4,
        OBJECT_FULFILLMENT: 5,
        CONTEXTUAL_SEARCH_QUERY: 9,
        PDF_QUERY: 10,
        WEBPAGE_QUERY: 11
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.oneofGroups_ = [[1, 2, 3]], proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.SelectionCase = {
        SELECTION_NOT_SET: 0,
        POINT: 1,
        REGION: 2,
        OBJECT: 3
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.prototype.getSelectionCase = function() {
        return (
          /** @type {proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.SelectionCase} */
          e.Message.computeOneofCase(this, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.oneofGroups_[0])
        );
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.prototype.toObject = function(n) {
        return proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.toObject(n, this);
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.toObject = function(n, r) {
        var o, u = {
          point: (o = r.getPoint()) && proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point.toObject(n, o),
          region: (o = r.getRegion()) && proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region.toObject(n, o),
          object: (o = r.getObject()) && proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object.toObject(n, o)
        };
        return n && (u.$jspbMessageInstance = r), u;
      }), proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.deserializeBinary = function(n) {
        var r = new e.BinaryReader(n), o = new proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata();
        return proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.deserializeBinaryFromReader(o, r);
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.deserializeBinaryFromReader = function(n, r) {
        for (; r.nextField() && !r.isEndGroup(); ) {
          var o = r.getFieldNumber();
          switch (o) {
            case 1:
              var u = new proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point();
              r.readMessage(u, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point.deserializeBinaryFromReader), n.setPoint(u);
              break;
            case 2:
              var u = new proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region();
              r.readMessage(u, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region.deserializeBinaryFromReader), n.setRegion(u);
              break;
            case 3:
              var u = new proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object();
              r.readMessage(u, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object.deserializeBinaryFromReader), n.setObject(u);
              break;
            default:
              r.skipField();
              break;
          }
        }
        return n;
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.prototype.serializeBinary = function() {
        var n = new e.BinaryWriter();
        return proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.serializeBinaryToWriter(this, n), n.getResultBuffer();
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.serializeBinaryToWriter = function(n, r) {
        var o = void 0;
        o = n.getPoint(), o != null && r.writeMessage(
          1,
          o,
          proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point.serializeBinaryToWriter
        ), o = n.getRegion(), o != null && r.writeMessage(
          2,
          o,
          proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region.serializeBinaryToWriter
        ), o = n.getObject(), o != null && r.writeMessage(
          3,
          o,
          proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object.serializeBinaryToWriter
        );
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point.prototype.toObject = function(n) {
        return proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point.toObject(n, this);
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point.toObject = function(n, r) {
        var o = {
          x: e.Message.getFloatingPointFieldWithDefault(r, 1, 0),
          y: e.Message.getFloatingPointFieldWithDefault(r, 2, 0)
        };
        return n && (o.$jspbMessageInstance = r), o;
      }), proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point.deserializeBinary = function(n) {
        var r = new e.BinaryReader(n), o = new proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point();
        return proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point.deserializeBinaryFromReader(o, r);
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point.deserializeBinaryFromReader = function(n, r) {
        for (; r.nextField() && !r.isEndGroup(); ) {
          var o = r.getFieldNumber();
          switch (o) {
            case 1:
              var u = (
                /** @type {number} */
                r.readFloat()
              );
              n.setX(u);
              break;
            case 2:
              var u = (
                /** @type {number} */
                r.readFloat()
              );
              n.setY(u);
              break;
            default:
              r.skipField();
              break;
          }
        }
        return n;
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point.prototype.serializeBinary = function() {
        var n = new e.BinaryWriter();
        return proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point.serializeBinaryToWriter(this, n), n.getResultBuffer();
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point.serializeBinaryToWriter = function(n, r) {
        var o = void 0;
        o = n.getX(), o !== 0 && r.writeFloat(
          1,
          o
        ), o = n.getY(), o !== 0 && r.writeFloat(
          2,
          o
        );
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point.prototype.getX = function() {
        return (
          /** @type {number} */
          e.Message.getFloatingPointFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point.prototype.setX = function(n) {
        return e.Message.setProto3FloatField(this, 1, n);
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point.prototype.getY = function() {
        return (
          /** @type {number} */
          e.Message.getFloatingPointFieldWithDefault(this, 2, 0)
        );
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point.prototype.setY = function(n) {
        return e.Message.setProto3FloatField(this, 2, n);
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region.prototype.toObject = function(n) {
        return proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region.toObject(n, this);
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region.toObject = function(n, r) {
        var o, u = {
          region: (o = r.getRegion()) && a.CenterRotatedBox.toObject(n, o)
        };
        return n && (u.$jspbMessageInstance = r), u;
      }), proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region.deserializeBinary = function(n) {
        var r = new e.BinaryReader(n), o = new proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region();
        return proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region.deserializeBinaryFromReader(o, r);
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region.deserializeBinaryFromReader = function(n, r) {
        for (; r.nextField() && !r.isEndGroup(); ) {
          var o = r.getFieldNumber();
          switch (o) {
            case 1:
              var u = new a.CenterRotatedBox();
              r.readMessage(u, a.CenterRotatedBox.deserializeBinaryFromReader), n.setRegion(u);
              break;
            default:
              r.skipField();
              break;
          }
        }
        return n;
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region.prototype.serializeBinary = function() {
        var n = new e.BinaryWriter();
        return proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region.serializeBinaryToWriter(this, n), n.getResultBuffer();
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region.serializeBinaryToWriter = function(n, r) {
        var o = void 0;
        o = n.getRegion(), o != null && r.writeMessage(
          1,
          o,
          a.CenterRotatedBox.serializeBinaryToWriter
        );
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region.prototype.getRegion = function() {
        return (
          /** @type{?proto.lens.CenterRotatedBox} */
          e.Message.getWrapperField(this, a.CenterRotatedBox, 1)
        );
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region.prototype.setRegion = function(n) {
        return e.Message.setWrapperField(this, 1, n);
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region.prototype.clearRegion = function() {
        return this.setRegion(void 0);
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region.prototype.hasRegion = function() {
        return e.Message.getField(this, 1) != null;
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object.prototype.toObject = function(n) {
        return proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object.toObject(n, this);
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object.toObject = function(n, r) {
        var o, u = {
          objectId: e.Message.getFieldWithDefault(r, 1, ""),
          geometry: (o = r.getGeometry()) && a.Geometry.toObject(n, o)
        };
        return n && (u.$jspbMessageInstance = r), u;
      }), proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object.deserializeBinary = function(n) {
        var r = new e.BinaryReader(n), o = new proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object();
        return proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object.deserializeBinaryFromReader(o, r);
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object.deserializeBinaryFromReader = function(n, r) {
        for (; r.nextField() && !r.isEndGroup(); ) {
          var o = r.getFieldNumber();
          switch (o) {
            case 1:
              var u = (
                /** @type {string} */
                r.readString()
              );
              n.setObjectId(u);
              break;
            case 2:
              var u = new a.Geometry();
              r.readMessage(u, a.Geometry.deserializeBinaryFromReader), n.setGeometry(u);
              break;
            default:
              r.skipField();
              break;
          }
        }
        return n;
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object.prototype.serializeBinary = function() {
        var n = new e.BinaryWriter();
        return proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object.serializeBinaryToWriter(this, n), n.getResultBuffer();
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object.serializeBinaryToWriter = function(n, r) {
        var o = void 0;
        o = n.getObjectId(), o.length > 0 && r.writeString(
          1,
          o
        ), o = n.getGeometry(), o != null && r.writeMessage(
          2,
          o,
          a.Geometry.serializeBinaryToWriter
        );
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object.prototype.getObjectId = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 1, "")
        );
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object.prototype.setObjectId = function(n) {
        return e.Message.setProto3StringField(this, 1, n);
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object.prototype.getGeometry = function() {
        return (
          /** @type{?proto.lens.Geometry} */
          e.Message.getWrapperField(this, a.Geometry, 2)
        );
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object.prototype.setGeometry = function(n) {
        return e.Message.setWrapperField(this, 2, n);
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object.prototype.clearGeometry = function() {
        return this.setGeometry(void 0);
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object.prototype.hasGeometry = function() {
        return e.Message.getField(this, 2) != null;
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.prototype.getPoint = function() {
        return (
          /** @type{?proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point} */
          e.Message.getWrapperField(this, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Point, 1)
        );
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.prototype.setPoint = function(n) {
        return e.Message.setOneofWrapperField(this, 1, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.oneofGroups_[0], n);
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.prototype.clearPoint = function() {
        return this.setPoint(void 0);
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.prototype.hasPoint = function() {
        return e.Message.getField(this, 1) != null;
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.prototype.getRegion = function() {
        return (
          /** @type{?proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region} */
          e.Message.getWrapperField(this, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Region, 2)
        );
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.prototype.setRegion = function(n) {
        return e.Message.setOneofWrapperField(this, 2, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.oneofGroups_[0], n);
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.prototype.clearRegion = function() {
        return this.setRegion(void 0);
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.prototype.hasRegion = function() {
        return e.Message.getField(this, 2) != null;
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.prototype.getObject = function() {
        return (
          /** @type{?proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object} */
          e.Message.getWrapperField(this, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.Object, 3)
        );
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.prototype.setObject = function(n) {
        return e.Message.setOneofWrapperField(this, 3, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.oneofGroups_[0], n);
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.prototype.clearObject = function() {
        return this.setObject(void 0);
      }, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata.prototype.hasObject = function() {
        return e.Message.getField(this, 3) != null;
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata.prototype.toObject = function(n) {
        return proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata.toObject(n, this);
      }, proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata.toObject = function(n, r) {
        var o, u = {
          textQuery: (o = r.getTextQuery()) && t.TextQuery.toObject(n, o)
        };
        return n && (u.$jspbMessageInstance = r), u;
      }), proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata.deserializeBinary = function(n) {
        var r = new e.BinaryReader(n), o = new proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata();
        return proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata.deserializeBinaryFromReader(o, r);
      }, proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata.deserializeBinaryFromReader = function(n, r) {
        for (; r.nextField() && !r.isEndGroup(); ) {
          var o = r.getFieldNumber();
          switch (o) {
            case 2:
              var u = new t.TextQuery();
              r.readMessage(u, t.TextQuery.deserializeBinaryFromReader), n.setTextQuery(u);
              break;
            default:
              r.skipField();
              break;
          }
        }
        return n;
      }, proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata.prototype.serializeBinary = function() {
        var n = new e.BinaryWriter();
        return proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata.serializeBinaryToWriter(this, n), n.getResultBuffer();
      }, proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata.serializeBinaryToWriter = function(n, r) {
        var o = void 0;
        o = n.getTextQuery(), o != null && r.writeMessage(
          2,
          o,
          t.TextQuery.serializeBinaryToWriter
        );
      }, proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata.prototype.getTextQuery = function() {
        return (
          /** @type{?proto.lens.TextQuery} */
          e.Message.getWrapperField(this, t.TextQuery, 2)
        );
      }, proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata.prototype.setTextQuery = function(n) {
        return e.Message.setWrapperField(this, 2, n);
      }, proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata.prototype.clearTextQuery = function() {
        return this.setTextQuery(void 0);
      }, proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata.prototype.hasTextQuery = function() {
        return e.Message.getField(this, 2) != null;
      }, proto.lens.LensOverlayInteractionRequestMetadata.prototype.getType = function() {
        return (
          /** @type {!proto.lens.LensOverlayInteractionRequestMetadata.Type} */
          e.Message.getFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.LensOverlayInteractionRequestMetadata.prototype.setType = function(n) {
        return e.Message.setProto3EnumField(this, 1, n);
      }, proto.lens.LensOverlayInteractionRequestMetadata.prototype.getSelectionMetadata = function() {
        return (
          /** @type{?proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata} */
          e.Message.getWrapperField(this, proto.lens.LensOverlayInteractionRequestMetadata.SelectionMetadata, 2)
        );
      }, proto.lens.LensOverlayInteractionRequestMetadata.prototype.setSelectionMetadata = function(n) {
        return e.Message.setWrapperField(this, 2, n);
      }, proto.lens.LensOverlayInteractionRequestMetadata.prototype.clearSelectionMetadata = function() {
        return this.setSelectionMetadata(void 0);
      }, proto.lens.LensOverlayInteractionRequestMetadata.prototype.hasSelectionMetadata = function() {
        return e.Message.getField(this, 2) != null;
      }, proto.lens.LensOverlayInteractionRequestMetadata.prototype.getQueryMetadata = function() {
        return (
          /** @type{?proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata} */
          e.Message.getWrapperField(this, proto.lens.LensOverlayInteractionRequestMetadata.QueryMetadata, 4)
        );
      }, proto.lens.LensOverlayInteractionRequestMetadata.prototype.setQueryMetadata = function(n) {
        return e.Message.setWrapperField(this, 4, n);
      }, proto.lens.LensOverlayInteractionRequestMetadata.prototype.clearQueryMetadata = function() {
        return this.setQueryMetadata(void 0);
      }, proto.lens.LensOverlayInteractionRequestMetadata.prototype.hasQueryMetadata = function() {
        return e.Message.getField(this, 4) != null;
      }, i.object.extend(c, proto.lens);
    }(A)), A;
  }
  var V = {};
  var Le;
  function et() {
    return Le || (Le = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis, a = /* @__PURE__ */ R();
      i.object.extend(proto, a), i.exportSymbol("proto.lens.OverlayObject", null, d), i.exportSymbol("proto.lens.OverlayObject.InteractionProperties", null, d), i.exportSymbol("proto.lens.OverlayObject.RenderingMetadata", null, d), i.exportSymbol("proto.lens.OverlayObject.RenderingMetadata.RenderType", null, d), proto.lens.OverlayObject = function(t) {
        e.Message.initialize(this, t, 0, -1, null, null);
      }, i.inherits(proto.lens.OverlayObject, e.Message), i.DEBUG && !COMPILED && (proto.lens.OverlayObject.displayName = "proto.lens.OverlayObject"), proto.lens.OverlayObject.RenderingMetadata = function(t) {
        e.Message.initialize(this, t, 0, -1, null, null);
      }, i.inherits(proto.lens.OverlayObject.RenderingMetadata, e.Message), i.DEBUG && !COMPILED && (proto.lens.OverlayObject.RenderingMetadata.displayName = "proto.lens.OverlayObject.RenderingMetadata"), proto.lens.OverlayObject.InteractionProperties = function(t) {
        e.Message.initialize(this, t, 0, -1, null, null);
      }, i.inherits(proto.lens.OverlayObject.InteractionProperties, e.Message), i.DEBUG && !COMPILED && (proto.lens.OverlayObject.InteractionProperties.displayName = "proto.lens.OverlayObject.InteractionProperties"), e.Message.GENERATE_TO_OBJECT && (proto.lens.OverlayObject.prototype.toObject = function(t) {
        return proto.lens.OverlayObject.toObject(t, this);
      }, proto.lens.OverlayObject.toObject = function(t, n) {
        var r, o = {
          id: e.Message.getFieldWithDefault(n, 1, ""),
          geometry: (r = n.getGeometry()) && a.Geometry.toObject(t, r),
          renderingMetadata: (r = n.getRenderingMetadata()) && proto.lens.OverlayObject.RenderingMetadata.toObject(t, r),
          interactionProperties: (r = n.getInteractionProperties()) && proto.lens.OverlayObject.InteractionProperties.toObject(t, r),
          isFulfilled: e.Message.getBooleanFieldWithDefault(n, 9, false)
        };
        return t && (o.$jspbMessageInstance = n), o;
      }), proto.lens.OverlayObject.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.OverlayObject();
        return proto.lens.OverlayObject.deserializeBinaryFromReader(r, n);
      }, proto.lens.OverlayObject.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = (
                /** @type {string} */
                n.readString()
              );
              t.setId(o);
              break;
            case 2:
              var o = new a.Geometry();
              n.readMessage(o, a.Geometry.deserializeBinaryFromReader), t.setGeometry(o);
              break;
            case 8:
              var o = new proto.lens.OverlayObject.RenderingMetadata();
              n.readMessage(o, proto.lens.OverlayObject.RenderingMetadata.deserializeBinaryFromReader), t.setRenderingMetadata(o);
              break;
            case 4:
              var o = new proto.lens.OverlayObject.InteractionProperties();
              n.readMessage(o, proto.lens.OverlayObject.InteractionProperties.deserializeBinaryFromReader), t.setInteractionProperties(o);
              break;
            case 9:
              var o = (
                /** @type {boolean} */
                n.readBool()
              );
              t.setIsFulfilled(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.OverlayObject.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.OverlayObject.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.OverlayObject.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getId(), r.length > 0 && n.writeString(
          1,
          r
        ), r = t.getGeometry(), r != null && n.writeMessage(
          2,
          r,
          a.Geometry.serializeBinaryToWriter
        ), r = t.getRenderingMetadata(), r != null && n.writeMessage(
          8,
          r,
          proto.lens.OverlayObject.RenderingMetadata.serializeBinaryToWriter
        ), r = t.getInteractionProperties(), r != null && n.writeMessage(
          4,
          r,
          proto.lens.OverlayObject.InteractionProperties.serializeBinaryToWriter
        ), r = t.getIsFulfilled(), r && n.writeBool(
          9,
          r
        );
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.OverlayObject.RenderingMetadata.prototype.toObject = function(t) {
        return proto.lens.OverlayObject.RenderingMetadata.toObject(t, this);
      }, proto.lens.OverlayObject.RenderingMetadata.toObject = function(t, n) {
        var r = {
          renderType: e.Message.getFieldWithDefault(n, 1, 0)
        };
        return t && (r.$jspbMessageInstance = n), r;
      }), proto.lens.OverlayObject.RenderingMetadata.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.OverlayObject.RenderingMetadata();
        return proto.lens.OverlayObject.RenderingMetadata.deserializeBinaryFromReader(r, n);
      }, proto.lens.OverlayObject.RenderingMetadata.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = (
                /** @type {!proto.lens.OverlayObject.RenderingMetadata.RenderType} */
                n.readEnum()
              );
              t.setRenderType(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.OverlayObject.RenderingMetadata.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.OverlayObject.RenderingMetadata.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.OverlayObject.RenderingMetadata.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getRenderType(), r !== 0 && n.writeEnum(
          1,
          r
        );
      }, proto.lens.OverlayObject.RenderingMetadata.RenderType = {
        DEFAULT: 0,
        GLEAM: 1
      }, proto.lens.OverlayObject.RenderingMetadata.prototype.getRenderType = function() {
        return (
          /** @type {!proto.lens.OverlayObject.RenderingMetadata.RenderType} */
          e.Message.getFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.OverlayObject.RenderingMetadata.prototype.setRenderType = function(t) {
        return e.Message.setProto3EnumField(this, 1, t);
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.OverlayObject.InteractionProperties.prototype.toObject = function(t) {
        return proto.lens.OverlayObject.InteractionProperties.toObject(t, this);
      }, proto.lens.OverlayObject.InteractionProperties.toObject = function(t, n) {
        var r = {
          selectOnTap: e.Message.getBooleanFieldWithDefault(n, 1, false)
        };
        return t && (r.$jspbMessageInstance = n), r;
      }), proto.lens.OverlayObject.InteractionProperties.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.OverlayObject.InteractionProperties();
        return proto.lens.OverlayObject.InteractionProperties.deserializeBinaryFromReader(r, n);
      }, proto.lens.OverlayObject.InteractionProperties.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = (
                /** @type {boolean} */
                n.readBool()
              );
              t.setSelectOnTap(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.OverlayObject.InteractionProperties.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.OverlayObject.InteractionProperties.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.OverlayObject.InteractionProperties.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getSelectOnTap(), r && n.writeBool(
          1,
          r
        );
      }, proto.lens.OverlayObject.InteractionProperties.prototype.getSelectOnTap = function() {
        return (
          /** @type {boolean} */
          e.Message.getBooleanFieldWithDefault(this, 1, false)
        );
      }, proto.lens.OverlayObject.InteractionProperties.prototype.setSelectOnTap = function(t) {
        return e.Message.setProto3BooleanField(this, 1, t);
      }, proto.lens.OverlayObject.prototype.getId = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 1, "")
        );
      }, proto.lens.OverlayObject.prototype.setId = function(t) {
        return e.Message.setProto3StringField(this, 1, t);
      }, proto.lens.OverlayObject.prototype.getGeometry = function() {
        return (
          /** @type{?proto.lens.Geometry} */
          e.Message.getWrapperField(this, a.Geometry, 2)
        );
      }, proto.lens.OverlayObject.prototype.setGeometry = function(t) {
        return e.Message.setWrapperField(this, 2, t);
      }, proto.lens.OverlayObject.prototype.clearGeometry = function() {
        return this.setGeometry(void 0);
      }, proto.lens.OverlayObject.prototype.hasGeometry = function() {
        return e.Message.getField(this, 2) != null;
      }, proto.lens.OverlayObject.prototype.getRenderingMetadata = function() {
        return (
          /** @type{?proto.lens.OverlayObject.RenderingMetadata} */
          e.Message.getWrapperField(this, proto.lens.OverlayObject.RenderingMetadata, 8)
        );
      }, proto.lens.OverlayObject.prototype.setRenderingMetadata = function(t) {
        return e.Message.setWrapperField(this, 8, t);
      }, proto.lens.OverlayObject.prototype.clearRenderingMetadata = function() {
        return this.setRenderingMetadata(void 0);
      }, proto.lens.OverlayObject.prototype.hasRenderingMetadata = function() {
        return e.Message.getField(this, 8) != null;
      }, proto.lens.OverlayObject.prototype.getInteractionProperties = function() {
        return (
          /** @type{?proto.lens.OverlayObject.InteractionProperties} */
          e.Message.getWrapperField(this, proto.lens.OverlayObject.InteractionProperties, 4)
        );
      }, proto.lens.OverlayObject.prototype.setInteractionProperties = function(t) {
        return e.Message.setWrapperField(this, 4, t);
      }, proto.lens.OverlayObject.prototype.clearInteractionProperties = function() {
        return this.setInteractionProperties(void 0);
      }, proto.lens.OverlayObject.prototype.hasInteractionProperties = function() {
        return e.Message.getField(this, 4) != null;
      }, proto.lens.OverlayObject.prototype.getIsFulfilled = function() {
        return (
          /** @type {boolean} */
          e.Message.getBooleanFieldWithDefault(this, 9, false)
        );
      }, proto.lens.OverlayObject.prototype.setIsFulfilled = function(t) {
        return e.Message.setProto3BooleanField(this, 9, t);
      }, i.object.extend(c, proto.lens);
    }(V)), V;
  }
  var $ = {};
  var be;
  function Ee() {
    return be || (be = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis, a = /* @__PURE__ */ H();
      i.object.extend(proto, a), i.exportSymbol("proto.lens.LensOverlayRequestId", null, d), proto.lens.LensOverlayRequestId = function(t) {
        e.Message.initialize(this, t, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayRequestId, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayRequestId.displayName = "proto.lens.LensOverlayRequestId"), e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayRequestId.prototype.toObject = function(t) {
        return proto.lens.LensOverlayRequestId.toObject(t, this);
      }, proto.lens.LensOverlayRequestId.toObject = function(t, n) {
        var r, o = {
          uuid: e.Message.getFieldWithDefault(n, 1, 0),
          sequenceId: e.Message.getFieldWithDefault(n, 2, 0),
          imageSequenceId: e.Message.getFieldWithDefault(n, 3, 0),
          analyticsId: n.getAnalyticsId_asB64(),
          longContextId: e.Message.getFieldWithDefault(n, 9, 0),
          routingInfo: (r = n.getRoutingInfo()) && a.LensOverlayRoutingInfo.toObject(t, r)
        };
        return t && (o.$jspbMessageInstance = n), o;
      }), proto.lens.LensOverlayRequestId.deserializeBinary = function(t) {
        var n = new e.BinaryReader(t), r = new proto.lens.LensOverlayRequestId();
        return proto.lens.LensOverlayRequestId.deserializeBinaryFromReader(r, n);
      }, proto.lens.LensOverlayRequestId.deserializeBinaryFromReader = function(t, n) {
        for (; n.nextField() && !n.isEndGroup(); ) {
          var r = n.getFieldNumber();
          switch (r) {
            case 1:
              var o = (
                /** @type {number} */
                n.readUint64()
              );
              t.setUuid(o);
              break;
            case 2:
              var o = (
                /** @type {number} */
                n.readInt32()
              );
              t.setSequenceId(o);
              break;
            case 3:
              var o = (
                /** @type {number} */
                n.readInt32()
              );
              t.setImageSequenceId(o);
              break;
            case 4:
              var o = (
                /** @type {!Uint8Array} */
                n.readBytes()
              );
              t.setAnalyticsId(o);
              break;
            case 9:
              var o = (
                /** @type {number} */
                n.readInt32()
              );
              t.setLongContextId(o);
              break;
            case 6:
              var o = new a.LensOverlayRoutingInfo();
              n.readMessage(o, a.LensOverlayRoutingInfo.deserializeBinaryFromReader), t.setRoutingInfo(o);
              break;
            default:
              n.skipField();
              break;
          }
        }
        return t;
      }, proto.lens.LensOverlayRequestId.prototype.serializeBinary = function() {
        var t = new e.BinaryWriter();
        return proto.lens.LensOverlayRequestId.serializeBinaryToWriter(this, t), t.getResultBuffer();
      }, proto.lens.LensOverlayRequestId.serializeBinaryToWriter = function(t, n) {
        var r = void 0;
        r = t.getUuid(), r !== 0 && n.writeUint64(
          1,
          r
        ), r = t.getSequenceId(), r !== 0 && n.writeInt32(
          2,
          r
        ), r = t.getImageSequenceId(), r !== 0 && n.writeInt32(
          3,
          r
        ), r = t.getAnalyticsId_asU8(), r.length > 0 && n.writeBytes(
          4,
          r
        ), r = t.getLongContextId(), r !== 0 && n.writeInt32(
          9,
          r
        ), r = t.getRoutingInfo(), r != null && n.writeMessage(
          6,
          r,
          a.LensOverlayRoutingInfo.serializeBinaryToWriter
        );
      }, proto.lens.LensOverlayRequestId.prototype.getUuid = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.LensOverlayRequestId.prototype.setUuid = function(t) {
        return e.Message.setProto3IntField(this, 1, t);
      }, proto.lens.LensOverlayRequestId.prototype.getSequenceId = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 2, 0)
        );
      }, proto.lens.LensOverlayRequestId.prototype.setSequenceId = function(t) {
        return e.Message.setProto3IntField(this, 2, t);
      }, proto.lens.LensOverlayRequestId.prototype.getImageSequenceId = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 3, 0)
        );
      }, proto.lens.LensOverlayRequestId.prototype.setImageSequenceId = function(t) {
        return e.Message.setProto3IntField(this, 3, t);
      }, proto.lens.LensOverlayRequestId.prototype.getAnalyticsId = function() {
        return (
          /** @type {!(string|Uint8Array)} */
          e.Message.getFieldWithDefault(this, 4, "")
        );
      }, proto.lens.LensOverlayRequestId.prototype.getAnalyticsId_asB64 = function() {
        return (
          /** @type {string} */
          e.Message.bytesAsB64(
            this.getAnalyticsId()
          )
        );
      }, proto.lens.LensOverlayRequestId.prototype.getAnalyticsId_asU8 = function() {
        return (
          /** @type {!Uint8Array} */
          e.Message.bytesAsU8(
            this.getAnalyticsId()
          )
        );
      }, proto.lens.LensOverlayRequestId.prototype.setAnalyticsId = function(t) {
        return e.Message.setProto3BytesField(this, 4, t);
      }, proto.lens.LensOverlayRequestId.prototype.getLongContextId = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 9, 0)
        );
      }, proto.lens.LensOverlayRequestId.prototype.setLongContextId = function(t) {
        return e.Message.setProto3IntField(this, 9, t);
      }, proto.lens.LensOverlayRequestId.prototype.getRoutingInfo = function() {
        return (
          /** @type{?proto.lens.LensOverlayRoutingInfo} */
          e.Message.getWrapperField(this, a.LensOverlayRoutingInfo, 6)
        );
      }, proto.lens.LensOverlayRequestId.prototype.setRoutingInfo = function(t) {
        return e.Message.setWrapperField(this, 6, t);
      }, proto.lens.LensOverlayRequestId.prototype.clearRoutingInfo = function() {
        return this.setRoutingInfo(void 0);
      }, proto.lens.LensOverlayRequestId.prototype.hasRoutingInfo = function() {
        return e.Message.getField(this, 6) != null;
      }, i.object.extend(c, proto.lens);
    }($)), $;
  }
  var Q = {};
  var Re;
  function tt() {
    return Re || (Re = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis;
      i.exportSymbol("proto.lens.RequestType", null, d), proto.lens.RequestType = {
        REQUEST_TYPE_DEFAULT: 0,
        REQUEST_TYPE_PDF: 1,
        REQUEST_TYPE_EARLY_PARTIAL_PDF: 3,
        REQUEST_TYPE_WEBPAGE: 2
      }, i.object.extend(c, proto.lens);
    }(Q)), Q;
  }
  var Te;
  function nt() {
    return Te || (Te = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis, a = /* @__PURE__ */ De();
      i.object.extend(proto, a);
      var t = /* @__PURE__ */ $e();
      i.object.extend(proto, t);
      var n = /* @__PURE__ */ Je();
      i.object.extend(proto, n);
      var r = /* @__PURE__ */ Ze();
      i.object.extend(proto, r);
      var o = /* @__PURE__ */ He();
      i.object.extend(proto, o);
      var u = /* @__PURE__ */ xe();
      i.object.extend(proto, u);
      var g = /* @__PURE__ */ Ke();
      i.object.extend(proto, g);
      var M = /* @__PURE__ */ et();
      i.object.extend(proto, M);
      var h = /* @__PURE__ */ Ee();
      i.object.extend(proto, h);
      var v = /* @__PURE__ */ tt();
      i.object.extend(proto, v);
      var O = /* @__PURE__ */ me();
      i.object.extend(proto, O), i.exportSymbol("proto.lens.ChunkDebugMetadata", null, d), i.exportSymbol("proto.lens.ChunkDebugOptions", null, d), i.exportSymbol("proto.lens.CompressionType", null, d), i.exportSymbol("proto.lens.Content", null, d), i.exportSymbol("proto.lens.ContentData", null, d), i.exportSymbol("proto.lens.ContentData.ContentType", null, d), i.exportSymbol("proto.lens.LensOverlayInteractionRequest", null, d), i.exportSymbol("proto.lens.LensOverlayInteractionResponse", null, d), i.exportSymbol("proto.lens.LensOverlayObjectsRequest", null, d), i.exportSymbol("proto.lens.LensOverlayObjectsResponse", null, d), i.exportSymbol("proto.lens.LensOverlayRequestContext", null, d), i.exportSymbol("proto.lens.LensOverlayUploadChunkRequest", null, d), i.exportSymbol("proto.lens.LensOverlayUploadChunkResponse", null, d), i.exportSymbol("proto.lens.Payload", null, d), i.exportSymbol("proto.lens.StoredChunkOptions", null, d), i.exportSymbol("proto.lens.ViewportRequestContext", null, d), proto.lens.LensOverlayRequestContext = function(s) {
        e.Message.initialize(this, s, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayRequestContext, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayRequestContext.displayName = "proto.lens.LensOverlayRequestContext"), proto.lens.ViewportRequestContext = function(s) {
        e.Message.initialize(this, s, 0, -1, null, null);
      }, i.inherits(proto.lens.ViewportRequestContext, e.Message), i.DEBUG && !COMPILED && (proto.lens.ViewportRequestContext.displayName = "proto.lens.ViewportRequestContext"), proto.lens.LensOverlayObjectsRequest = function(s) {
        e.Message.initialize(this, s, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayObjectsRequest, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayObjectsRequest.displayName = "proto.lens.LensOverlayObjectsRequest"), proto.lens.LensOverlayUploadChunkRequest = function(s) {
        e.Message.initialize(this, s, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayUploadChunkRequest, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayUploadChunkRequest.displayName = "proto.lens.LensOverlayUploadChunkRequest"), proto.lens.LensOverlayUploadChunkResponse = function(s) {
        e.Message.initialize(this, s, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayUploadChunkResponse, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayUploadChunkResponse.displayName = "proto.lens.LensOverlayUploadChunkResponse"), proto.lens.ChunkDebugOptions = function(s) {
        e.Message.initialize(this, s, 0, -1, null, null);
      }, i.inherits(proto.lens.ChunkDebugOptions, e.Message), i.DEBUG && !COMPILED && (proto.lens.ChunkDebugOptions.displayName = "proto.lens.ChunkDebugOptions"), proto.lens.ChunkDebugMetadata = function(s) {
        e.Message.initialize(this, s, 0, -1, proto.lens.ChunkDebugMetadata.repeatedFields_, null);
      }, i.inherits(proto.lens.ChunkDebugMetadata, e.Message), i.DEBUG && !COMPILED && (proto.lens.ChunkDebugMetadata.displayName = "proto.lens.ChunkDebugMetadata"), proto.lens.LensOverlayObjectsResponse = function(s) {
        e.Message.initialize(this, s, 0, -1, proto.lens.LensOverlayObjectsResponse.repeatedFields_, null);
      }, i.inherits(proto.lens.LensOverlayObjectsResponse, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayObjectsResponse.displayName = "proto.lens.LensOverlayObjectsResponse"), proto.lens.LensOverlayInteractionRequest = function(s) {
        e.Message.initialize(this, s, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayInteractionRequest, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayInteractionRequest.displayName = "proto.lens.LensOverlayInteractionRequest"), proto.lens.LensOverlayInteractionResponse = function(s) {
        e.Message.initialize(this, s, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayInteractionResponse, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayInteractionResponse.displayName = "proto.lens.LensOverlayInteractionResponse"), proto.lens.Payload = function(s) {
        e.Message.initialize(this, s, 0, -1, null, null);
      }, i.inherits(proto.lens.Payload, e.Message), i.DEBUG && !COMPILED && (proto.lens.Payload.displayName = "proto.lens.Payload"), proto.lens.StoredChunkOptions = function(s) {
        e.Message.initialize(this, s, 0, -1, null, null);
      }, i.inherits(proto.lens.StoredChunkOptions, e.Message), i.DEBUG && !COMPILED && (proto.lens.StoredChunkOptions.displayName = "proto.lens.StoredChunkOptions"), proto.lens.Content = function(s) {
        e.Message.initialize(this, s, 0, -1, proto.lens.Content.repeatedFields_, null);
      }, i.inherits(proto.lens.Content, e.Message), i.DEBUG && !COMPILED && (proto.lens.Content.displayName = "proto.lens.Content"), proto.lens.ContentData = function(s) {
        e.Message.initialize(this, s, 0, -1, null, null);
      }, i.inherits(proto.lens.ContentData, e.Message), i.DEBUG && !COMPILED && (proto.lens.ContentData.displayName = "proto.lens.ContentData"), e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayRequestContext.prototype.toObject = function(s) {
        return proto.lens.LensOverlayRequestContext.toObject(s, this);
      }, proto.lens.LensOverlayRequestContext.toObject = function(s, l) {
        var p, y = {
          requestId: (p = l.getRequestId()) && h.LensOverlayRequestId.toObject(s, p),
          clientContext: (p = l.getClientContext()) && a.LensOverlayClientContext.toObject(s, p)
        };
        return s && (y.$jspbMessageInstance = l), y;
      }), proto.lens.LensOverlayRequestContext.deserializeBinary = function(s) {
        var l = new e.BinaryReader(s), p = new proto.lens.LensOverlayRequestContext();
        return proto.lens.LensOverlayRequestContext.deserializeBinaryFromReader(p, l);
      }, proto.lens.LensOverlayRequestContext.deserializeBinaryFromReader = function(s, l) {
        for (; l.nextField() && !l.isEndGroup(); ) {
          var p = l.getFieldNumber();
          switch (p) {
            case 3:
              var y = new h.LensOverlayRequestId();
              l.readMessage(y, h.LensOverlayRequestId.deserializeBinaryFromReader), s.setRequestId(y);
              break;
            case 4:
              var y = new a.LensOverlayClientContext();
              l.readMessage(y, a.LensOverlayClientContext.deserializeBinaryFromReader), s.setClientContext(y);
              break;
            default:
              l.skipField();
              break;
          }
        }
        return s;
      }, proto.lens.LensOverlayRequestContext.prototype.serializeBinary = function() {
        var s = new e.BinaryWriter();
        return proto.lens.LensOverlayRequestContext.serializeBinaryToWriter(this, s), s.getResultBuffer();
      }, proto.lens.LensOverlayRequestContext.serializeBinaryToWriter = function(s, l) {
        var p = void 0;
        p = s.getRequestId(), p != null && l.writeMessage(
          3,
          p,
          h.LensOverlayRequestId.serializeBinaryToWriter
        ), p = s.getClientContext(), p != null && l.writeMessage(
          4,
          p,
          a.LensOverlayClientContext.serializeBinaryToWriter
        );
      }, proto.lens.LensOverlayRequestContext.prototype.getRequestId = function() {
        return (
          /** @type{?proto.lens.LensOverlayRequestId} */
          e.Message.getWrapperField(this, h.LensOverlayRequestId, 3)
        );
      }, proto.lens.LensOverlayRequestContext.prototype.setRequestId = function(s) {
        return e.Message.setWrapperField(this, 3, s);
      }, proto.lens.LensOverlayRequestContext.prototype.clearRequestId = function() {
        return this.setRequestId(void 0);
      }, proto.lens.LensOverlayRequestContext.prototype.hasRequestId = function() {
        return e.Message.getField(this, 3) != null;
      }, proto.lens.LensOverlayRequestContext.prototype.getClientContext = function() {
        return (
          /** @type{?proto.lens.LensOverlayClientContext} */
          e.Message.getWrapperField(this, a.LensOverlayClientContext, 4)
        );
      }, proto.lens.LensOverlayRequestContext.prototype.setClientContext = function(s) {
        return e.Message.setWrapperField(this, 4, s);
      }, proto.lens.LensOverlayRequestContext.prototype.clearClientContext = function() {
        return this.setClientContext(void 0);
      }, proto.lens.LensOverlayRequestContext.prototype.hasClientContext = function() {
        return e.Message.getField(this, 4) != null;
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.ViewportRequestContext.prototype.toObject = function(s) {
        return proto.lens.ViewportRequestContext.toObject(s, this);
      }, proto.lens.ViewportRequestContext.toObject = function(s, l) {
        var p = {
          pdfPageNumber: e.Message.getFieldWithDefault(l, 1, 0)
        };
        return s && (p.$jspbMessageInstance = l), p;
      }), proto.lens.ViewportRequestContext.deserializeBinary = function(s) {
        var l = new e.BinaryReader(s), p = new proto.lens.ViewportRequestContext();
        return proto.lens.ViewportRequestContext.deserializeBinaryFromReader(p, l);
      }, proto.lens.ViewportRequestContext.deserializeBinaryFromReader = function(s, l) {
        for (; l.nextField() && !l.isEndGroup(); ) {
          var p = l.getFieldNumber();
          switch (p) {
            case 1:
              var y = (
                /** @type {number} */
                l.readInt32()
              );
              s.setPdfPageNumber(y);
              break;
            default:
              l.skipField();
              break;
          }
        }
        return s;
      }, proto.lens.ViewportRequestContext.prototype.serializeBinary = function() {
        var s = new e.BinaryWriter();
        return proto.lens.ViewportRequestContext.serializeBinaryToWriter(this, s), s.getResultBuffer();
      }, proto.lens.ViewportRequestContext.serializeBinaryToWriter = function(s, l) {
        var p = void 0;
        p = s.getPdfPageNumber(), p !== 0 && l.writeInt32(
          1,
          p
        );
      }, proto.lens.ViewportRequestContext.prototype.getPdfPageNumber = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.ViewportRequestContext.prototype.setPdfPageNumber = function(s) {
        return e.Message.setProto3IntField(this, 1, s);
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayObjectsRequest.prototype.toObject = function(s) {
        return proto.lens.LensOverlayObjectsRequest.toObject(s, this);
      }, proto.lens.LensOverlayObjectsRequest.toObject = function(s, l) {
        var p, y = {
          requestContext: (p = l.getRequestContext()) && proto.lens.LensOverlayRequestContext.toObject(s, p),
          imageData: (p = l.getImageData()) && u.ImageData.toObject(s, p),
          payload: (p = l.getPayload()) && proto.lens.Payload.toObject(s, p),
          viewportRequestContext: (p = l.getViewportRequestContext()) && proto.lens.ViewportRequestContext.toObject(s, p)
        };
        return s && (y.$jspbMessageInstance = l), y;
      }), proto.lens.LensOverlayObjectsRequest.deserializeBinary = function(s) {
        var l = new e.BinaryReader(s), p = new proto.lens.LensOverlayObjectsRequest();
        return proto.lens.LensOverlayObjectsRequest.deserializeBinaryFromReader(p, l);
      }, proto.lens.LensOverlayObjectsRequest.deserializeBinaryFromReader = function(s, l) {
        for (; l.nextField() && !l.isEndGroup(); ) {
          var p = l.getFieldNumber();
          switch (p) {
            case 1:
              var y = new proto.lens.LensOverlayRequestContext();
              l.readMessage(y, proto.lens.LensOverlayRequestContext.deserializeBinaryFromReader), s.setRequestContext(y);
              break;
            case 3:
              var y = new u.ImageData();
              l.readMessage(y, u.ImageData.deserializeBinaryFromReader), s.setImageData(y);
              break;
            case 4:
              var y = new proto.lens.Payload();
              l.readMessage(y, proto.lens.Payload.deserializeBinaryFromReader), s.setPayload(y);
              break;
            case 5:
              var y = new proto.lens.ViewportRequestContext();
              l.readMessage(y, proto.lens.ViewportRequestContext.deserializeBinaryFromReader), s.setViewportRequestContext(y);
              break;
            default:
              l.skipField();
              break;
          }
        }
        return s;
      }, proto.lens.LensOverlayObjectsRequest.prototype.serializeBinary = function() {
        var s = new e.BinaryWriter();
        return proto.lens.LensOverlayObjectsRequest.serializeBinaryToWriter(this, s), s.getResultBuffer();
      }, proto.lens.LensOverlayObjectsRequest.serializeBinaryToWriter = function(s, l) {
        var p = void 0;
        p = s.getRequestContext(), p != null && l.writeMessage(
          1,
          p,
          proto.lens.LensOverlayRequestContext.serializeBinaryToWriter
        ), p = s.getImageData(), p != null && l.writeMessage(
          3,
          p,
          u.ImageData.serializeBinaryToWriter
        ), p = s.getPayload(), p != null && l.writeMessage(
          4,
          p,
          proto.lens.Payload.serializeBinaryToWriter
        ), p = s.getViewportRequestContext(), p != null && l.writeMessage(
          5,
          p,
          proto.lens.ViewportRequestContext.serializeBinaryToWriter
        );
      }, proto.lens.LensOverlayObjectsRequest.prototype.getRequestContext = function() {
        return (
          /** @type{?proto.lens.LensOverlayRequestContext} */
          e.Message.getWrapperField(this, proto.lens.LensOverlayRequestContext, 1)
        );
      }, proto.lens.LensOverlayObjectsRequest.prototype.setRequestContext = function(s) {
        return e.Message.setWrapperField(this, 1, s);
      }, proto.lens.LensOverlayObjectsRequest.prototype.clearRequestContext = function() {
        return this.setRequestContext(void 0);
      }, proto.lens.LensOverlayObjectsRequest.prototype.hasRequestContext = function() {
        return e.Message.getField(this, 1) != null;
      }, proto.lens.LensOverlayObjectsRequest.prototype.getImageData = function() {
        return (
          /** @type{?proto.lens.ImageData} */
          e.Message.getWrapperField(this, u.ImageData, 3)
        );
      }, proto.lens.LensOverlayObjectsRequest.prototype.setImageData = function(s) {
        return e.Message.setWrapperField(this, 3, s);
      }, proto.lens.LensOverlayObjectsRequest.prototype.clearImageData = function() {
        return this.setImageData(void 0);
      }, proto.lens.LensOverlayObjectsRequest.prototype.hasImageData = function() {
        return e.Message.getField(this, 3) != null;
      }, proto.lens.LensOverlayObjectsRequest.prototype.getPayload = function() {
        return (
          /** @type{?proto.lens.Payload} */
          e.Message.getWrapperField(this, proto.lens.Payload, 4)
        );
      }, proto.lens.LensOverlayObjectsRequest.prototype.setPayload = function(s) {
        return e.Message.setWrapperField(this, 4, s);
      }, proto.lens.LensOverlayObjectsRequest.prototype.clearPayload = function() {
        return this.setPayload(void 0);
      }, proto.lens.LensOverlayObjectsRequest.prototype.hasPayload = function() {
        return e.Message.getField(this, 4) != null;
      }, proto.lens.LensOverlayObjectsRequest.prototype.getViewportRequestContext = function() {
        return (
          /** @type{?proto.lens.ViewportRequestContext} */
          e.Message.getWrapperField(this, proto.lens.ViewportRequestContext, 5)
        );
      }, proto.lens.LensOverlayObjectsRequest.prototype.setViewportRequestContext = function(s) {
        return e.Message.setWrapperField(this, 5, s);
      }, proto.lens.LensOverlayObjectsRequest.prototype.clearViewportRequestContext = function() {
        return this.setViewportRequestContext(void 0);
      }, proto.lens.LensOverlayObjectsRequest.prototype.hasViewportRequestContext = function() {
        return e.Message.getField(this, 5) != null;
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayUploadChunkRequest.prototype.toObject = function(s) {
        return proto.lens.LensOverlayUploadChunkRequest.toObject(s, this);
      }, proto.lens.LensOverlayUploadChunkRequest.toObject = function(s, l) {
        var p, y = {
          requestContext: (p = l.getRequestContext()) && proto.lens.LensOverlayRequestContext.toObject(s, p),
          debugOptions: (p = l.getDebugOptions()) && proto.lens.ChunkDebugOptions.toObject(s, p),
          chunkId: e.Message.getFieldWithDefault(l, 3, 0),
          chunkBytes: l.getChunkBytes_asB64()
        };
        return s && (y.$jspbMessageInstance = l), y;
      }), proto.lens.LensOverlayUploadChunkRequest.deserializeBinary = function(s) {
        var l = new e.BinaryReader(s), p = new proto.lens.LensOverlayUploadChunkRequest();
        return proto.lens.LensOverlayUploadChunkRequest.deserializeBinaryFromReader(p, l);
      }, proto.lens.LensOverlayUploadChunkRequest.deserializeBinaryFromReader = function(s, l) {
        for (; l.nextField() && !l.isEndGroup(); ) {
          var p = l.getFieldNumber();
          switch (p) {
            case 1:
              var y = new proto.lens.LensOverlayRequestContext();
              l.readMessage(y, proto.lens.LensOverlayRequestContext.deserializeBinaryFromReader), s.setRequestContext(y);
              break;
            case 6:
              var y = new proto.lens.ChunkDebugOptions();
              l.readMessage(y, proto.lens.ChunkDebugOptions.deserializeBinaryFromReader), s.setDebugOptions(y);
              break;
            case 3:
              var y = (
                /** @type {number} */
                l.readInt64()
              );
              s.setChunkId(y);
              break;
            case 4:
              var y = (
                /** @type {!Uint8Array} */
                l.readBytes()
              );
              s.setChunkBytes(y);
              break;
            default:
              l.skipField();
              break;
          }
        }
        return s;
      }, proto.lens.LensOverlayUploadChunkRequest.prototype.serializeBinary = function() {
        var s = new e.BinaryWriter();
        return proto.lens.LensOverlayUploadChunkRequest.serializeBinaryToWriter(this, s), s.getResultBuffer();
      }, proto.lens.LensOverlayUploadChunkRequest.serializeBinaryToWriter = function(s, l) {
        var p = void 0;
        p = s.getRequestContext(), p != null && l.writeMessage(
          1,
          p,
          proto.lens.LensOverlayRequestContext.serializeBinaryToWriter
        ), p = s.getDebugOptions(), p != null && l.writeMessage(
          6,
          p,
          proto.lens.ChunkDebugOptions.serializeBinaryToWriter
        ), p = s.getChunkId(), p !== 0 && l.writeInt64(
          3,
          p
        ), p = s.getChunkBytes_asU8(), p.length > 0 && l.writeBytes(
          4,
          p
        );
      }, proto.lens.LensOverlayUploadChunkRequest.prototype.getRequestContext = function() {
        return (
          /** @type{?proto.lens.LensOverlayRequestContext} */
          e.Message.getWrapperField(this, proto.lens.LensOverlayRequestContext, 1)
        );
      }, proto.lens.LensOverlayUploadChunkRequest.prototype.setRequestContext = function(s) {
        return e.Message.setWrapperField(this, 1, s);
      }, proto.lens.LensOverlayUploadChunkRequest.prototype.clearRequestContext = function() {
        return this.setRequestContext(void 0);
      }, proto.lens.LensOverlayUploadChunkRequest.prototype.hasRequestContext = function() {
        return e.Message.getField(this, 1) != null;
      }, proto.lens.LensOverlayUploadChunkRequest.prototype.getDebugOptions = function() {
        return (
          /** @type{?proto.lens.ChunkDebugOptions} */
          e.Message.getWrapperField(this, proto.lens.ChunkDebugOptions, 6)
        );
      }, proto.lens.LensOverlayUploadChunkRequest.prototype.setDebugOptions = function(s) {
        return e.Message.setWrapperField(this, 6, s);
      }, proto.lens.LensOverlayUploadChunkRequest.prototype.clearDebugOptions = function() {
        return this.setDebugOptions(void 0);
      }, proto.lens.LensOverlayUploadChunkRequest.prototype.hasDebugOptions = function() {
        return e.Message.getField(this, 6) != null;
      }, proto.lens.LensOverlayUploadChunkRequest.prototype.getChunkId = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 3, 0)
        );
      }, proto.lens.LensOverlayUploadChunkRequest.prototype.setChunkId = function(s) {
        return e.Message.setProto3IntField(this, 3, s);
      }, proto.lens.LensOverlayUploadChunkRequest.prototype.getChunkBytes = function() {
        return (
          /** @type {!(string|Uint8Array)} */
          e.Message.getFieldWithDefault(this, 4, "")
        );
      }, proto.lens.LensOverlayUploadChunkRequest.prototype.getChunkBytes_asB64 = function() {
        return (
          /** @type {string} */
          e.Message.bytesAsB64(
            this.getChunkBytes()
          )
        );
      }, proto.lens.LensOverlayUploadChunkRequest.prototype.getChunkBytes_asU8 = function() {
        return (
          /** @type {!Uint8Array} */
          e.Message.bytesAsU8(
            this.getChunkBytes()
          )
        );
      }, proto.lens.LensOverlayUploadChunkRequest.prototype.setChunkBytes = function(s) {
        return e.Message.setProto3BytesField(this, 4, s);
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayUploadChunkResponse.prototype.toObject = function(s) {
        return proto.lens.LensOverlayUploadChunkResponse.toObject(s, this);
      }, proto.lens.LensOverlayUploadChunkResponse.toObject = function(s, l) {
        var p, y = {
          debugMetadata: (p = l.getDebugMetadata()) && proto.lens.ChunkDebugMetadata.toObject(s, p)
        };
        return s && (y.$jspbMessageInstance = l), y;
      }), proto.lens.LensOverlayUploadChunkResponse.deserializeBinary = function(s) {
        var l = new e.BinaryReader(s), p = new proto.lens.LensOverlayUploadChunkResponse();
        return proto.lens.LensOverlayUploadChunkResponse.deserializeBinaryFromReader(p, l);
      }, proto.lens.LensOverlayUploadChunkResponse.deserializeBinaryFromReader = function(s, l) {
        for (; l.nextField() && !l.isEndGroup(); ) {
          var p = l.getFieldNumber();
          switch (p) {
            case 2:
              var y = new proto.lens.ChunkDebugMetadata();
              l.readMessage(y, proto.lens.ChunkDebugMetadata.deserializeBinaryFromReader), s.setDebugMetadata(y);
              break;
            default:
              l.skipField();
              break;
          }
        }
        return s;
      }, proto.lens.LensOverlayUploadChunkResponse.prototype.serializeBinary = function() {
        var s = new e.BinaryWriter();
        return proto.lens.LensOverlayUploadChunkResponse.serializeBinaryToWriter(this, s), s.getResultBuffer();
      }, proto.lens.LensOverlayUploadChunkResponse.serializeBinaryToWriter = function(s, l) {
        var p = void 0;
        p = s.getDebugMetadata(), p != null && l.writeMessage(
          2,
          p,
          proto.lens.ChunkDebugMetadata.serializeBinaryToWriter
        );
      }, proto.lens.LensOverlayUploadChunkResponse.prototype.getDebugMetadata = function() {
        return (
          /** @type{?proto.lens.ChunkDebugMetadata} */
          e.Message.getWrapperField(this, proto.lens.ChunkDebugMetadata, 2)
        );
      }, proto.lens.LensOverlayUploadChunkResponse.prototype.setDebugMetadata = function(s) {
        return e.Message.setWrapperField(this, 2, s);
      }, proto.lens.LensOverlayUploadChunkResponse.prototype.clearDebugMetadata = function() {
        return this.setDebugMetadata(void 0);
      }, proto.lens.LensOverlayUploadChunkResponse.prototype.hasDebugMetadata = function() {
        return e.Message.getField(this, 2) != null;
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.ChunkDebugOptions.prototype.toObject = function(s) {
        return proto.lens.ChunkDebugOptions.toObject(s, this);
      }, proto.lens.ChunkDebugOptions.toObject = function(s, l) {
        var p = {
          totalChunks: e.Message.getFieldWithDefault(l, 1, 0),
          queryChunks: e.Message.getBooleanFieldWithDefault(l, 2, false)
        };
        return s && (p.$jspbMessageInstance = l), p;
      }), proto.lens.ChunkDebugOptions.deserializeBinary = function(s) {
        var l = new e.BinaryReader(s), p = new proto.lens.ChunkDebugOptions();
        return proto.lens.ChunkDebugOptions.deserializeBinaryFromReader(p, l);
      }, proto.lens.ChunkDebugOptions.deserializeBinaryFromReader = function(s, l) {
        for (; l.nextField() && !l.isEndGroup(); ) {
          var p = l.getFieldNumber();
          switch (p) {
            case 1:
              var y = (
                /** @type {number} */
                l.readInt64()
              );
              s.setTotalChunks(y);
              break;
            case 2:
              var y = (
                /** @type {boolean} */
                l.readBool()
              );
              s.setQueryChunks(y);
              break;
            default:
              l.skipField();
              break;
          }
        }
        return s;
      }, proto.lens.ChunkDebugOptions.prototype.serializeBinary = function() {
        var s = new e.BinaryWriter();
        return proto.lens.ChunkDebugOptions.serializeBinaryToWriter(this, s), s.getResultBuffer();
      }, proto.lens.ChunkDebugOptions.serializeBinaryToWriter = function(s, l) {
        var p = void 0;
        p = s.getTotalChunks(), p !== 0 && l.writeInt64(
          1,
          p
        ), p = s.getQueryChunks(), p && l.writeBool(
          2,
          p
        );
      }, proto.lens.ChunkDebugOptions.prototype.getTotalChunks = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.ChunkDebugOptions.prototype.setTotalChunks = function(s) {
        return e.Message.setProto3IntField(this, 1, s);
      }, proto.lens.ChunkDebugOptions.prototype.getQueryChunks = function() {
        return (
          /** @type {boolean} */
          e.Message.getBooleanFieldWithDefault(this, 2, false)
        );
      }, proto.lens.ChunkDebugOptions.prototype.setQueryChunks = function(s) {
        return e.Message.setProto3BooleanField(this, 2, s);
      }, proto.lens.ChunkDebugMetadata.repeatedFields_ = [1], e.Message.GENERATE_TO_OBJECT && (proto.lens.ChunkDebugMetadata.prototype.toObject = function(s) {
        return proto.lens.ChunkDebugMetadata.toObject(s, this);
      }, proto.lens.ChunkDebugMetadata.toObject = function(s, l) {
        var p, y = {
          remainingChunksList: (p = e.Message.getRepeatedField(l, 1)) == null ? void 0 : p
        };
        return s && (y.$jspbMessageInstance = l), y;
      }), proto.lens.ChunkDebugMetadata.deserializeBinary = function(s) {
        var l = new e.BinaryReader(s), p = new proto.lens.ChunkDebugMetadata();
        return proto.lens.ChunkDebugMetadata.deserializeBinaryFromReader(p, l);
      }, proto.lens.ChunkDebugMetadata.deserializeBinaryFromReader = function(s, l) {
        for (; l.nextField() && !l.isEndGroup(); ) {
          var p = l.getFieldNumber();
          switch (p) {
            case 1:
              for (var y = (
                /** @type {!Array<number>} */
                l.isDelimited() ? l.readPackedInt64() : [l.readInt64()]
              ), F = 0; F < y.length; F++)
                s.addRemainingChunks(y[F]);
              break;
            default:
              l.skipField();
              break;
          }
        }
        return s;
      }, proto.lens.ChunkDebugMetadata.prototype.serializeBinary = function() {
        var s = new e.BinaryWriter();
        return proto.lens.ChunkDebugMetadata.serializeBinaryToWriter(this, s), s.getResultBuffer();
      }, proto.lens.ChunkDebugMetadata.serializeBinaryToWriter = function(s, l) {
        var p = void 0;
        p = s.getRemainingChunksList(), p.length > 0 && l.writePackedInt64(
          1,
          p
        );
      }, proto.lens.ChunkDebugMetadata.prototype.getRemainingChunksList = function() {
        return (
          /** @type {!Array<number>} */
          e.Message.getRepeatedField(this, 1)
        );
      }, proto.lens.ChunkDebugMetadata.prototype.setRemainingChunksList = function(s) {
        return e.Message.setField(this, 1, s || []);
      }, proto.lens.ChunkDebugMetadata.prototype.addRemainingChunks = function(s, l) {
        return e.Message.addToRepeatedField(this, 1, s, l);
      }, proto.lens.ChunkDebugMetadata.prototype.clearRemainingChunksList = function() {
        return this.setRemainingChunksList([]);
      }, proto.lens.LensOverlayObjectsResponse.repeatedFields_ = [2, 4], e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayObjectsResponse.prototype.toObject = function(s) {
        return proto.lens.LensOverlayObjectsResponse.toObject(s, this);
      }, proto.lens.LensOverlayObjectsResponse.toObject = function(s, l) {
        var p, y = {
          overlayObjectsList: e.Message.toObjectList(
            l.getOverlayObjectsList(),
            M.OverlayObject.toObject,
            s
          ),
          text: (p = l.getText()) && O.Text.toObject(s, p),
          deepGleamsList: e.Message.toObjectList(
            l.getDeepGleamsList(),
            n.DeepGleamData.toObject,
            s
          ),
          clusterInfo: (p = l.getClusterInfo()) && t.LensOverlayClusterInfo.toObject(s, p)
        };
        return s && (y.$jspbMessageInstance = l), y;
      }), proto.lens.LensOverlayObjectsResponse.deserializeBinary = function(s) {
        var l = new e.BinaryReader(s), p = new proto.lens.LensOverlayObjectsResponse();
        return proto.lens.LensOverlayObjectsResponse.deserializeBinaryFromReader(p, l);
      }, proto.lens.LensOverlayObjectsResponse.deserializeBinaryFromReader = function(s, l) {
        for (; l.nextField() && !l.isEndGroup(); ) {
          var p = l.getFieldNumber();
          switch (p) {
            case 2:
              var y = new M.OverlayObject();
              l.readMessage(y, M.OverlayObject.deserializeBinaryFromReader), s.addOverlayObjects(y);
              break;
            case 3:
              var y = new O.Text();
              l.readMessage(y, O.Text.deserializeBinaryFromReader), s.setText(y);
              break;
            case 4:
              var y = new n.DeepGleamData();
              l.readMessage(y, n.DeepGleamData.deserializeBinaryFromReader), s.addDeepGleams(y);
              break;
            case 7:
              var y = new t.LensOverlayClusterInfo();
              l.readMessage(y, t.LensOverlayClusterInfo.deserializeBinaryFromReader), s.setClusterInfo(y);
              break;
            default:
              l.skipField();
              break;
          }
        }
        return s;
      }, proto.lens.LensOverlayObjectsResponse.prototype.serializeBinary = function() {
        var s = new e.BinaryWriter();
        return proto.lens.LensOverlayObjectsResponse.serializeBinaryToWriter(this, s), s.getResultBuffer();
      }, proto.lens.LensOverlayObjectsResponse.serializeBinaryToWriter = function(s, l) {
        var p = void 0;
        p = s.getOverlayObjectsList(), p.length > 0 && l.writeRepeatedMessage(
          2,
          p,
          M.OverlayObject.serializeBinaryToWriter
        ), p = s.getText(), p != null && l.writeMessage(
          3,
          p,
          O.Text.serializeBinaryToWriter
        ), p = s.getDeepGleamsList(), p.length > 0 && l.writeRepeatedMessage(
          4,
          p,
          n.DeepGleamData.serializeBinaryToWriter
        ), p = s.getClusterInfo(), p != null && l.writeMessage(
          7,
          p,
          t.LensOverlayClusterInfo.serializeBinaryToWriter
        );
      }, proto.lens.LensOverlayObjectsResponse.prototype.getOverlayObjectsList = function() {
        return (
          /** @type{!Array<!proto.lens.OverlayObject>} */
          e.Message.getRepeatedWrapperField(this, M.OverlayObject, 2)
        );
      }, proto.lens.LensOverlayObjectsResponse.prototype.setOverlayObjectsList = function(s) {
        return e.Message.setRepeatedWrapperField(this, 2, s);
      }, proto.lens.LensOverlayObjectsResponse.prototype.addOverlayObjects = function(s, l) {
        return e.Message.addToRepeatedWrapperField(this, 2, s, proto.lens.OverlayObject, l);
      }, proto.lens.LensOverlayObjectsResponse.prototype.clearOverlayObjectsList = function() {
        return this.setOverlayObjectsList([]);
      }, proto.lens.LensOverlayObjectsResponse.prototype.getText = function() {
        return (
          /** @type{?proto.lens.Text} */
          e.Message.getWrapperField(this, O.Text, 3)
        );
      }, proto.lens.LensOverlayObjectsResponse.prototype.setText = function(s) {
        return e.Message.setWrapperField(this, 3, s);
      }, proto.lens.LensOverlayObjectsResponse.prototype.clearText = function() {
        return this.setText(void 0);
      }, proto.lens.LensOverlayObjectsResponse.prototype.hasText = function() {
        return e.Message.getField(this, 3) != null;
      }, proto.lens.LensOverlayObjectsResponse.prototype.getDeepGleamsList = function() {
        return (
          /** @type{!Array<!proto.lens.DeepGleamData>} */
          e.Message.getRepeatedWrapperField(this, n.DeepGleamData, 4)
        );
      }, proto.lens.LensOverlayObjectsResponse.prototype.setDeepGleamsList = function(s) {
        return e.Message.setRepeatedWrapperField(this, 4, s);
      }, proto.lens.LensOverlayObjectsResponse.prototype.addDeepGleams = function(s, l) {
        return e.Message.addToRepeatedWrapperField(this, 4, s, proto.lens.DeepGleamData, l);
      }, proto.lens.LensOverlayObjectsResponse.prototype.clearDeepGleamsList = function() {
        return this.setDeepGleamsList([]);
      }, proto.lens.LensOverlayObjectsResponse.prototype.getClusterInfo = function() {
        return (
          /** @type{?proto.lens.LensOverlayClusterInfo} */
          e.Message.getWrapperField(this, t.LensOverlayClusterInfo, 7)
        );
      }, proto.lens.LensOverlayObjectsResponse.prototype.setClusterInfo = function(s) {
        return e.Message.setWrapperField(this, 7, s);
      }, proto.lens.LensOverlayObjectsResponse.prototype.clearClusterInfo = function() {
        return this.setClusterInfo(void 0);
      }, proto.lens.LensOverlayObjectsResponse.prototype.hasClusterInfo = function() {
        return e.Message.getField(this, 7) != null;
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayInteractionRequest.prototype.toObject = function(s) {
        return proto.lens.LensOverlayInteractionRequest.toObject(s, this);
      }, proto.lens.LensOverlayInteractionRequest.toObject = function(s, l) {
        var p, y = {
          requestContext: (p = l.getRequestContext()) && proto.lens.LensOverlayRequestContext.toObject(s, p),
          interactionRequestMetadata: (p = l.getInteractionRequestMetadata()) && g.LensOverlayInteractionRequestMetadata.toObject(s, p),
          imageCrop: (p = l.getImageCrop()) && o.ImageCrop.toObject(s, p)
        };
        return s && (y.$jspbMessageInstance = l), y;
      }), proto.lens.LensOverlayInteractionRequest.deserializeBinary = function(s) {
        var l = new e.BinaryReader(s), p = new proto.lens.LensOverlayInteractionRequest();
        return proto.lens.LensOverlayInteractionRequest.deserializeBinaryFromReader(p, l);
      }, proto.lens.LensOverlayInteractionRequest.deserializeBinaryFromReader = function(s, l) {
        for (; l.nextField() && !l.isEndGroup(); ) {
          var p = l.getFieldNumber();
          switch (p) {
            case 1:
              var y = new proto.lens.LensOverlayRequestContext();
              l.readMessage(y, proto.lens.LensOverlayRequestContext.deserializeBinaryFromReader), s.setRequestContext(y);
              break;
            case 2:
              var y = new g.LensOverlayInteractionRequestMetadata();
              l.readMessage(y, g.LensOverlayInteractionRequestMetadata.deserializeBinaryFromReader), s.setInteractionRequestMetadata(y);
              break;
            case 3:
              var y = new o.ImageCrop();
              l.readMessage(y, o.ImageCrop.deserializeBinaryFromReader), s.setImageCrop(y);
              break;
            default:
              l.skipField();
              break;
          }
        }
        return s;
      }, proto.lens.LensOverlayInteractionRequest.prototype.serializeBinary = function() {
        var s = new e.BinaryWriter();
        return proto.lens.LensOverlayInteractionRequest.serializeBinaryToWriter(this, s), s.getResultBuffer();
      }, proto.lens.LensOverlayInteractionRequest.serializeBinaryToWriter = function(s, l) {
        var p = void 0;
        p = s.getRequestContext(), p != null && l.writeMessage(
          1,
          p,
          proto.lens.LensOverlayRequestContext.serializeBinaryToWriter
        ), p = s.getInteractionRequestMetadata(), p != null && l.writeMessage(
          2,
          p,
          g.LensOverlayInteractionRequestMetadata.serializeBinaryToWriter
        ), p = s.getImageCrop(), p != null && l.writeMessage(
          3,
          p,
          o.ImageCrop.serializeBinaryToWriter
        );
      }, proto.lens.LensOverlayInteractionRequest.prototype.getRequestContext = function() {
        return (
          /** @type{?proto.lens.LensOverlayRequestContext} */
          e.Message.getWrapperField(this, proto.lens.LensOverlayRequestContext, 1)
        );
      }, proto.lens.LensOverlayInteractionRequest.prototype.setRequestContext = function(s) {
        return e.Message.setWrapperField(this, 1, s);
      }, proto.lens.LensOverlayInteractionRequest.prototype.clearRequestContext = function() {
        return this.setRequestContext(void 0);
      }, proto.lens.LensOverlayInteractionRequest.prototype.hasRequestContext = function() {
        return e.Message.getField(this, 1) != null;
      }, proto.lens.LensOverlayInteractionRequest.prototype.getInteractionRequestMetadata = function() {
        return (
          /** @type{?proto.lens.LensOverlayInteractionRequestMetadata} */
          e.Message.getWrapperField(this, g.LensOverlayInteractionRequestMetadata, 2)
        );
      }, proto.lens.LensOverlayInteractionRequest.prototype.setInteractionRequestMetadata = function(s) {
        return e.Message.setWrapperField(this, 2, s);
      }, proto.lens.LensOverlayInteractionRequest.prototype.clearInteractionRequestMetadata = function() {
        return this.setInteractionRequestMetadata(void 0);
      }, proto.lens.LensOverlayInteractionRequest.prototype.hasInteractionRequestMetadata = function() {
        return e.Message.getField(this, 2) != null;
      }, proto.lens.LensOverlayInteractionRequest.prototype.getImageCrop = function() {
        return (
          /** @type{?proto.lens.ImageCrop} */
          e.Message.getWrapperField(this, o.ImageCrop, 3)
        );
      }, proto.lens.LensOverlayInteractionRequest.prototype.setImageCrop = function(s) {
        return e.Message.setWrapperField(this, 3, s);
      }, proto.lens.LensOverlayInteractionRequest.prototype.clearImageCrop = function() {
        return this.setImageCrop(void 0);
      }, proto.lens.LensOverlayInteractionRequest.prototype.hasImageCrop = function() {
        return e.Message.getField(this, 3) != null;
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayInteractionResponse.prototype.toObject = function(s) {
        return proto.lens.LensOverlayInteractionResponse.toObject(s, this);
      }, proto.lens.LensOverlayInteractionResponse.toObject = function(s, l) {
        var p, y = {
          encodedResponse: e.Message.getFieldWithDefault(l, 3, ""),
          text: (p = l.getText()) && O.Text.toObject(s, p)
        };
        return s && (y.$jspbMessageInstance = l), y;
      }), proto.lens.LensOverlayInteractionResponse.deserializeBinary = function(s) {
        var l = new e.BinaryReader(s), p = new proto.lens.LensOverlayInteractionResponse();
        return proto.lens.LensOverlayInteractionResponse.deserializeBinaryFromReader(p, l);
      }, proto.lens.LensOverlayInteractionResponse.deserializeBinaryFromReader = function(s, l) {
        for (; l.nextField() && !l.isEndGroup(); ) {
          var p = l.getFieldNumber();
          switch (p) {
            case 3:
              var y = (
                /** @type {string} */
                l.readString()
              );
              s.setEncodedResponse(y);
              break;
            case 5:
              var y = new O.Text();
              l.readMessage(y, O.Text.deserializeBinaryFromReader), s.setText(y);
              break;
            default:
              l.skipField();
              break;
          }
        }
        return s;
      }, proto.lens.LensOverlayInteractionResponse.prototype.serializeBinary = function() {
        var s = new e.BinaryWriter();
        return proto.lens.LensOverlayInteractionResponse.serializeBinaryToWriter(this, s), s.getResultBuffer();
      }, proto.lens.LensOverlayInteractionResponse.serializeBinaryToWriter = function(s, l) {
        var p = void 0;
        p = s.getEncodedResponse(), p.length > 0 && l.writeString(
          3,
          p
        ), p = s.getText(), p != null && l.writeMessage(
          5,
          p,
          O.Text.serializeBinaryToWriter
        );
      }, proto.lens.LensOverlayInteractionResponse.prototype.getEncodedResponse = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 3, "")
        );
      }, proto.lens.LensOverlayInteractionResponse.prototype.setEncodedResponse = function(s) {
        return e.Message.setProto3StringField(this, 3, s);
      }, proto.lens.LensOverlayInteractionResponse.prototype.getText = function() {
        return (
          /** @type{?proto.lens.Text} */
          e.Message.getWrapperField(this, O.Text, 5)
        );
      }, proto.lens.LensOverlayInteractionResponse.prototype.setText = function(s) {
        return e.Message.setWrapperField(this, 5, s);
      }, proto.lens.LensOverlayInteractionResponse.prototype.clearText = function() {
        return this.setText(void 0);
      }, proto.lens.LensOverlayInteractionResponse.prototype.hasText = function() {
        return e.Message.getField(this, 5) != null;
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.Payload.prototype.toObject = function(s) {
        return proto.lens.Payload.toObject(s, this);
      }, proto.lens.Payload.toObject = function(s, l) {
        var p, y = {
          requestType: e.Message.getFieldWithDefault(l, 6, 0),
          imageData: (p = l.getImageData()) && u.ImageData.toObject(s, p),
          contentData: l.getContentData_asB64(),
          contentType: e.Message.getFieldWithDefault(l, 4, ""),
          pageUrl: e.Message.getFieldWithDefault(l, 5, ""),
          partialPdfDocument: (p = l.getPartialPdfDocument()) && r.LensOverlayDocument.toObject(s, p),
          compressionType: e.Message.getFieldWithDefault(l, 8, 0),
          storedChunkOptions: (p = l.getStoredChunkOptions()) && proto.lens.StoredChunkOptions.toObject(s, p),
          content: (p = l.getContent()) && proto.lens.Content.toObject(s, p)
        };
        return s && (y.$jspbMessageInstance = l), y;
      }), proto.lens.Payload.deserializeBinary = function(s) {
        var l = new e.BinaryReader(s), p = new proto.lens.Payload();
        return proto.lens.Payload.deserializeBinaryFromReader(p, l);
      }, proto.lens.Payload.deserializeBinaryFromReader = function(s, l) {
        for (; l.nextField() && !l.isEndGroup(); ) {
          var p = l.getFieldNumber();
          switch (p) {
            case 6:
              var y = (
                /** @type {!proto.lens.RequestType} */
                l.readEnum()
              );
              s.setRequestType(y);
              break;
            case 2:
              var y = new u.ImageData();
              l.readMessage(y, u.ImageData.deserializeBinaryFromReader), s.setImageData(y);
              break;
            case 3:
              var y = (
                /** @type {!Uint8Array} */
                l.readBytes()
              );
              s.setContentData(y);
              break;
            case 4:
              var y = (
                /** @type {string} */
                l.readString()
              );
              s.setContentType(y);
              break;
            case 5:
              var y = (
                /** @type {string} */
                l.readString()
              );
              s.setPageUrl(y);
              break;
            case 7:
              var y = new r.LensOverlayDocument();
              l.readMessage(y, r.LensOverlayDocument.deserializeBinaryFromReader), s.setPartialPdfDocument(y);
              break;
            case 8:
              var y = (
                /** @type {!proto.lens.CompressionType} */
                l.readEnum()
              );
              s.setCompressionType(y);
              break;
            case 9:
              var y = new proto.lens.StoredChunkOptions();
              l.readMessage(y, proto.lens.StoredChunkOptions.deserializeBinaryFromReader), s.setStoredChunkOptions(y);
              break;
            case 10:
              var y = new proto.lens.Content();
              l.readMessage(y, proto.lens.Content.deserializeBinaryFromReader), s.setContent(y);
              break;
            default:
              l.skipField();
              break;
          }
        }
        return s;
      }, proto.lens.Payload.prototype.serializeBinary = function() {
        var s = new e.BinaryWriter();
        return proto.lens.Payload.serializeBinaryToWriter(this, s), s.getResultBuffer();
      }, proto.lens.Payload.serializeBinaryToWriter = function(s, l) {
        var p = void 0;
        p = s.getRequestType(), p !== 0 && l.writeEnum(
          6,
          p
        ), p = s.getImageData(), p != null && l.writeMessage(
          2,
          p,
          u.ImageData.serializeBinaryToWriter
        ), p = s.getContentData_asU8(), p.length > 0 && l.writeBytes(
          3,
          p
        ), p = s.getContentType(), p.length > 0 && l.writeString(
          4,
          p
        ), p = s.getPageUrl(), p.length > 0 && l.writeString(
          5,
          p
        ), p = s.getPartialPdfDocument(), p != null && l.writeMessage(
          7,
          p,
          r.LensOverlayDocument.serializeBinaryToWriter
        ), p = s.getCompressionType(), p !== 0 && l.writeEnum(
          8,
          p
        ), p = s.getStoredChunkOptions(), p != null && l.writeMessage(
          9,
          p,
          proto.lens.StoredChunkOptions.serializeBinaryToWriter
        ), p = s.getContent(), p != null && l.writeMessage(
          10,
          p,
          proto.lens.Content.serializeBinaryToWriter
        );
      }, proto.lens.Payload.prototype.getRequestType = function() {
        return (
          /** @type {!proto.lens.RequestType} */
          e.Message.getFieldWithDefault(this, 6, 0)
        );
      }, proto.lens.Payload.prototype.setRequestType = function(s) {
        return e.Message.setProto3EnumField(this, 6, s);
      }, proto.lens.Payload.prototype.getImageData = function() {
        return (
          /** @type{?proto.lens.ImageData} */
          e.Message.getWrapperField(this, u.ImageData, 2)
        );
      }, proto.lens.Payload.prototype.setImageData = function(s) {
        return e.Message.setWrapperField(this, 2, s);
      }, proto.lens.Payload.prototype.clearImageData = function() {
        return this.setImageData(void 0);
      }, proto.lens.Payload.prototype.hasImageData = function() {
        return e.Message.getField(this, 2) != null;
      }, proto.lens.Payload.prototype.getContentData = function() {
        return (
          /** @type {!(string|Uint8Array)} */
          e.Message.getFieldWithDefault(this, 3, "")
        );
      }, proto.lens.Payload.prototype.getContentData_asB64 = function() {
        return (
          /** @type {string} */
          e.Message.bytesAsB64(
            this.getContentData()
          )
        );
      }, proto.lens.Payload.prototype.getContentData_asU8 = function() {
        return (
          /** @type {!Uint8Array} */
          e.Message.bytesAsU8(
            this.getContentData()
          )
        );
      }, proto.lens.Payload.prototype.setContentData = function(s) {
        return e.Message.setProto3BytesField(this, 3, s);
      }, proto.lens.Payload.prototype.getContentType = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 4, "")
        );
      }, proto.lens.Payload.prototype.setContentType = function(s) {
        return e.Message.setProto3StringField(this, 4, s);
      }, proto.lens.Payload.prototype.getPageUrl = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 5, "")
        );
      }, proto.lens.Payload.prototype.setPageUrl = function(s) {
        return e.Message.setProto3StringField(this, 5, s);
      }, proto.lens.Payload.prototype.getPartialPdfDocument = function() {
        return (
          /** @type{?proto.lens.LensOverlayDocument} */
          e.Message.getWrapperField(this, r.LensOverlayDocument, 7)
        );
      }, proto.lens.Payload.prototype.setPartialPdfDocument = function(s) {
        return e.Message.setWrapperField(this, 7, s);
      }, proto.lens.Payload.prototype.clearPartialPdfDocument = function() {
        return this.setPartialPdfDocument(void 0);
      }, proto.lens.Payload.prototype.hasPartialPdfDocument = function() {
        return e.Message.getField(this, 7) != null;
      }, proto.lens.Payload.prototype.getCompressionType = function() {
        return (
          /** @type {!proto.lens.CompressionType} */
          e.Message.getFieldWithDefault(this, 8, 0)
        );
      }, proto.lens.Payload.prototype.setCompressionType = function(s) {
        return e.Message.setProto3EnumField(this, 8, s);
      }, proto.lens.Payload.prototype.getStoredChunkOptions = function() {
        return (
          /** @type{?proto.lens.StoredChunkOptions} */
          e.Message.getWrapperField(this, proto.lens.StoredChunkOptions, 9)
        );
      }, proto.lens.Payload.prototype.setStoredChunkOptions = function(s) {
        return e.Message.setWrapperField(this, 9, s);
      }, proto.lens.Payload.prototype.clearStoredChunkOptions = function() {
        return this.setStoredChunkOptions(void 0);
      }, proto.lens.Payload.prototype.hasStoredChunkOptions = function() {
        return e.Message.getField(this, 9) != null;
      }, proto.lens.Payload.prototype.getContent = function() {
        return (
          /** @type{?proto.lens.Content} */
          e.Message.getWrapperField(this, proto.lens.Content, 10)
        );
      }, proto.lens.Payload.prototype.setContent = function(s) {
        return e.Message.setWrapperField(this, 10, s);
      }, proto.lens.Payload.prototype.clearContent = function() {
        return this.setContent(void 0);
      }, proto.lens.Payload.prototype.hasContent = function() {
        return e.Message.getField(this, 10) != null;
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.StoredChunkOptions.prototype.toObject = function(s) {
        return proto.lens.StoredChunkOptions.toObject(s, this);
      }, proto.lens.StoredChunkOptions.toObject = function(s, l) {
        var p = {
          readStoredChunks: e.Message.getBooleanFieldWithDefault(l, 1, false),
          totalStoredChunks: e.Message.getFieldWithDefault(l, 2, 0)
        };
        return s && (p.$jspbMessageInstance = l), p;
      }), proto.lens.StoredChunkOptions.deserializeBinary = function(s) {
        var l = new e.BinaryReader(s), p = new proto.lens.StoredChunkOptions();
        return proto.lens.StoredChunkOptions.deserializeBinaryFromReader(p, l);
      }, proto.lens.StoredChunkOptions.deserializeBinaryFromReader = function(s, l) {
        for (; l.nextField() && !l.isEndGroup(); ) {
          var p = l.getFieldNumber();
          switch (p) {
            case 1:
              var y = (
                /** @type {boolean} */
                l.readBool()
              );
              s.setReadStoredChunks(y);
              break;
            case 2:
              var y = (
                /** @type {number} */
                l.readInt64()
              );
              s.setTotalStoredChunks(y);
              break;
            default:
              l.skipField();
              break;
          }
        }
        return s;
      }, proto.lens.StoredChunkOptions.prototype.serializeBinary = function() {
        var s = new e.BinaryWriter();
        return proto.lens.StoredChunkOptions.serializeBinaryToWriter(this, s), s.getResultBuffer();
      }, proto.lens.StoredChunkOptions.serializeBinaryToWriter = function(s, l) {
        var p = void 0;
        p = s.getReadStoredChunks(), p && l.writeBool(
          1,
          p
        ), p = s.getTotalStoredChunks(), p !== 0 && l.writeInt64(
          2,
          p
        );
      }, proto.lens.StoredChunkOptions.prototype.getReadStoredChunks = function() {
        return (
          /** @type {boolean} */
          e.Message.getBooleanFieldWithDefault(this, 1, false)
        );
      }, proto.lens.StoredChunkOptions.prototype.setReadStoredChunks = function(s) {
        return e.Message.setProto3BooleanField(this, 1, s);
      }, proto.lens.StoredChunkOptions.prototype.getTotalStoredChunks = function() {
        return (
          /** @type {number} */
          e.Message.getFieldWithDefault(this, 2, 0)
        );
      }, proto.lens.StoredChunkOptions.prototype.setTotalStoredChunks = function(s) {
        return e.Message.setProto3IntField(this, 2, s);
      }, proto.lens.Content.repeatedFields_ = [2], e.Message.GENERATE_TO_OBJECT && (proto.lens.Content.prototype.toObject = function(s) {
        return proto.lens.Content.toObject(s, this);
      }, proto.lens.Content.toObject = function(s, l) {
        var p = {
          webpageUrl: e.Message.getFieldWithDefault(l, 1, ""),
          webpageTitle: e.Message.getFieldWithDefault(l, 4, ""),
          contentDataList: e.Message.toObjectList(
            l.getContentDataList(),
            proto.lens.ContentData.toObject,
            s
          ),
          requestType: e.Message.getFieldWithDefault(l, 3, 0)
        };
        return s && (p.$jspbMessageInstance = l), p;
      }), proto.lens.Content.deserializeBinary = function(s) {
        var l = new e.BinaryReader(s), p = new proto.lens.Content();
        return proto.lens.Content.deserializeBinaryFromReader(p, l);
      }, proto.lens.Content.deserializeBinaryFromReader = function(s, l) {
        for (; l.nextField() && !l.isEndGroup(); ) {
          var p = l.getFieldNumber();
          switch (p) {
            case 1:
              var y = (
                /** @type {string} */
                l.readString()
              );
              s.setWebpageUrl(y);
              break;
            case 4:
              var y = (
                /** @type {string} */
                l.readString()
              );
              s.setWebpageTitle(y);
              break;
            case 2:
              var y = new proto.lens.ContentData();
              l.readMessage(y, proto.lens.ContentData.deserializeBinaryFromReader), s.addContentData(y);
              break;
            case 3:
              var y = (
                /** @type {!proto.lens.RequestType} */
                l.readEnum()
              );
              s.setRequestType(y);
              break;
            default:
              l.skipField();
              break;
          }
        }
        return s;
      }, proto.lens.Content.prototype.serializeBinary = function() {
        var s = new e.BinaryWriter();
        return proto.lens.Content.serializeBinaryToWriter(this, s), s.getResultBuffer();
      }, proto.lens.Content.serializeBinaryToWriter = function(s, l) {
        var p = void 0;
        p = s.getWebpageUrl(), p.length > 0 && l.writeString(
          1,
          p
        ), p = s.getWebpageTitle(), p.length > 0 && l.writeString(
          4,
          p
        ), p = s.getContentDataList(), p.length > 0 && l.writeRepeatedMessage(
          2,
          p,
          proto.lens.ContentData.serializeBinaryToWriter
        ), p = s.getRequestType(), p !== 0 && l.writeEnum(
          3,
          p
        );
      }, proto.lens.Content.prototype.getWebpageUrl = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 1, "")
        );
      }, proto.lens.Content.prototype.setWebpageUrl = function(s) {
        return e.Message.setProto3StringField(this, 1, s);
      }, proto.lens.Content.prototype.getWebpageTitle = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 4, "")
        );
      }, proto.lens.Content.prototype.setWebpageTitle = function(s) {
        return e.Message.setProto3StringField(this, 4, s);
      }, proto.lens.Content.prototype.getContentDataList = function() {
        return (
          /** @type{!Array<!proto.lens.ContentData>} */
          e.Message.getRepeatedWrapperField(this, proto.lens.ContentData, 2)
        );
      }, proto.lens.Content.prototype.setContentDataList = function(s) {
        return e.Message.setRepeatedWrapperField(this, 2, s);
      }, proto.lens.Content.prototype.addContentData = function(s, l) {
        return e.Message.addToRepeatedWrapperField(this, 2, s, proto.lens.ContentData, l);
      }, proto.lens.Content.prototype.clearContentDataList = function() {
        return this.setContentDataList([]);
      }, proto.lens.Content.prototype.getRequestType = function() {
        return (
          /** @type {!proto.lens.RequestType} */
          e.Message.getFieldWithDefault(this, 3, 0)
        );
      }, proto.lens.Content.prototype.setRequestType = function(s) {
        return e.Message.setProto3EnumField(this, 3, s);
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.ContentData.prototype.toObject = function(s) {
        return proto.lens.ContentData.toObject(s, this);
      }, proto.lens.ContentData.toObject = function(s, l) {
        var p, y = {
          contentType: e.Message.getFieldWithDefault(l, 1, 0),
          data: l.getData_asB64(),
          compressionType: e.Message.getFieldWithDefault(l, 3, 0),
          storedChunkOptions: (p = l.getStoredChunkOptions()) && proto.lens.StoredChunkOptions.toObject(s, p)
        };
        return s && (y.$jspbMessageInstance = l), y;
      }), proto.lens.ContentData.deserializeBinary = function(s) {
        var l = new e.BinaryReader(s), p = new proto.lens.ContentData();
        return proto.lens.ContentData.deserializeBinaryFromReader(p, l);
      }, proto.lens.ContentData.deserializeBinaryFromReader = function(s, l) {
        for (; l.nextField() && !l.isEndGroup(); ) {
          var p = l.getFieldNumber();
          switch (p) {
            case 1:
              var y = (
                /** @type {!proto.lens.ContentData.ContentType} */
                l.readEnum()
              );
              s.setContentType(y);
              break;
            case 2:
              var y = (
                /** @type {!Uint8Array} */
                l.readBytes()
              );
              s.setData(y);
              break;
            case 3:
              var y = (
                /** @type {!proto.lens.CompressionType} */
                l.readEnum()
              );
              s.setCompressionType(y);
              break;
            case 4:
              var y = new proto.lens.StoredChunkOptions();
              l.readMessage(y, proto.lens.StoredChunkOptions.deserializeBinaryFromReader), s.setStoredChunkOptions(y);
              break;
            default:
              l.skipField();
              break;
          }
        }
        return s;
      }, proto.lens.ContentData.prototype.serializeBinary = function() {
        var s = new e.BinaryWriter();
        return proto.lens.ContentData.serializeBinaryToWriter(this, s), s.getResultBuffer();
      }, proto.lens.ContentData.serializeBinaryToWriter = function(s, l) {
        var p = void 0;
        p = s.getContentType(), p !== 0 && l.writeEnum(
          1,
          p
        ), p = s.getData_asU8(), p.length > 0 && l.writeBytes(
          2,
          p
        ), p = s.getCompressionType(), p !== 0 && l.writeEnum(
          3,
          p
        ), p = s.getStoredChunkOptions(), p != null && l.writeMessage(
          4,
          p,
          proto.lens.StoredChunkOptions.serializeBinaryToWriter
        );
      }, proto.lens.ContentData.ContentType = {
        CONTENT_TYPE_UNSPECIFIED: 0,
        CONTENT_TYPE_PDF: 1,
        CONTENT_TYPE_INNER_TEXT: 2,
        CONTENT_TYPE_INNER_HTML: 3,
        CONTENT_TYPE_ANNOTATED_PAGE_CONTENT: 4,
        CONTENT_TYPE_EARLY_PARTIAL_PDF: 5
      }, proto.lens.ContentData.prototype.getContentType = function() {
        return (
          /** @type {!proto.lens.ContentData.ContentType} */
          e.Message.getFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.ContentData.prototype.setContentType = function(s) {
        return e.Message.setProto3EnumField(this, 1, s);
      }, proto.lens.ContentData.prototype.getData = function() {
        return (
          /** @type {!(string|Uint8Array)} */
          e.Message.getFieldWithDefault(this, 2, "")
        );
      }, proto.lens.ContentData.prototype.getData_asB64 = function() {
        return (
          /** @type {string} */
          e.Message.bytesAsB64(
            this.getData()
          )
        );
      }, proto.lens.ContentData.prototype.getData_asU8 = function() {
        return (
          /** @type {!Uint8Array} */
          e.Message.bytesAsU8(
            this.getData()
          )
        );
      }, proto.lens.ContentData.prototype.setData = function(s) {
        return e.Message.setProto3BytesField(this, 2, s);
      }, proto.lens.ContentData.prototype.getCompressionType = function() {
        return (
          /** @type {!proto.lens.CompressionType} */
          e.Message.getFieldWithDefault(this, 3, 0)
        );
      }, proto.lens.ContentData.prototype.setCompressionType = function(s) {
        return e.Message.setProto3EnumField(this, 3, s);
      }, proto.lens.ContentData.prototype.getStoredChunkOptions = function() {
        return (
          /** @type{?proto.lens.StoredChunkOptions} */
          e.Message.getWrapperField(this, proto.lens.StoredChunkOptions, 4)
        );
      }, proto.lens.ContentData.prototype.setStoredChunkOptions = function(s) {
        return e.Message.setWrapperField(this, 4, s);
      }, proto.lens.ContentData.prototype.clearStoredChunkOptions = function() {
        return this.setStoredChunkOptions(void 0);
      }, proto.lens.ContentData.prototype.hasStoredChunkOptions = function() {
        return e.Message.getField(this, 4) != null;
      }, proto.lens.CompressionType = {
        UNCOMPRESSED: 0,
        ZSTD: 1
      }, i.object.extend(c, proto.lens);
    }(m)), m;
  }
  var Fe;
  function rt() {
    return Fe || (Fe = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis, a = /* @__PURE__ */ Ae();
      i.object.extend(proto, a);
      var t = /* @__PURE__ */ H();
      i.object.extend(proto, t);
      var n = /* @__PURE__ */ nt();
      i.object.extend(proto, n), i.exportSymbol("proto.lens.LensOverlayServerClusterInfoRequest", null, d), i.exportSymbol("proto.lens.LensOverlayServerClusterInfoResponse", null, d), i.exportSymbol("proto.lens.LensOverlayServerError", null, d), i.exportSymbol("proto.lens.LensOverlayServerError.ErrorType", null, d), i.exportSymbol("proto.lens.LensOverlayServerRequest", null, d), i.exportSymbol("proto.lens.LensOverlayServerResponse", null, d), proto.lens.LensOverlayServerClusterInfoRequest = function(r) {
        e.Message.initialize(this, r, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayServerClusterInfoRequest, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayServerClusterInfoRequest.displayName = "proto.lens.LensOverlayServerClusterInfoRequest"), proto.lens.LensOverlayServerClusterInfoResponse = function(r) {
        e.Message.initialize(this, r, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayServerClusterInfoResponse, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayServerClusterInfoResponse.displayName = "proto.lens.LensOverlayServerClusterInfoResponse"), proto.lens.LensOverlayServerError = function(r) {
        e.Message.initialize(this, r, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayServerError, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayServerError.displayName = "proto.lens.LensOverlayServerError"), proto.lens.LensOverlayServerRequest = function(r) {
        e.Message.initialize(this, r, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayServerRequest, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayServerRequest.displayName = "proto.lens.LensOverlayServerRequest"), proto.lens.LensOverlayServerResponse = function(r) {
        e.Message.initialize(this, r, 0, -1, null, null);
      }, i.inherits(proto.lens.LensOverlayServerResponse, e.Message), i.DEBUG && !COMPILED && (proto.lens.LensOverlayServerResponse.displayName = "proto.lens.LensOverlayServerResponse"), e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayServerClusterInfoRequest.prototype.toObject = function(r) {
        return proto.lens.LensOverlayServerClusterInfoRequest.toObject(r, this);
      }, proto.lens.LensOverlayServerClusterInfoRequest.toObject = function(r, o) {
        var u = {
          enableSearchSessionId: e.Message.getBooleanFieldWithDefault(o, 1, false)
        };
        return r && (u.$jspbMessageInstance = o), u;
      }), proto.lens.LensOverlayServerClusterInfoRequest.deserializeBinary = function(r) {
        var o = new e.BinaryReader(r), u = new proto.lens.LensOverlayServerClusterInfoRequest();
        return proto.lens.LensOverlayServerClusterInfoRequest.deserializeBinaryFromReader(u, o);
      }, proto.lens.LensOverlayServerClusterInfoRequest.deserializeBinaryFromReader = function(r, o) {
        for (; o.nextField() && !o.isEndGroup(); ) {
          var u = o.getFieldNumber();
          switch (u) {
            case 1:
              var g = (
                /** @type {boolean} */
                o.readBool()
              );
              r.setEnableSearchSessionId(g);
              break;
            default:
              o.skipField();
              break;
          }
        }
        return r;
      }, proto.lens.LensOverlayServerClusterInfoRequest.prototype.serializeBinary = function() {
        var r = new e.BinaryWriter();
        return proto.lens.LensOverlayServerClusterInfoRequest.serializeBinaryToWriter(this, r), r.getResultBuffer();
      }, proto.lens.LensOverlayServerClusterInfoRequest.serializeBinaryToWriter = function(r, o) {
        var u = void 0;
        u = r.getEnableSearchSessionId(), u && o.writeBool(
          1,
          u
        );
      }, proto.lens.LensOverlayServerClusterInfoRequest.prototype.getEnableSearchSessionId = function() {
        return (
          /** @type {boolean} */
          e.Message.getBooleanFieldWithDefault(this, 1, false)
        );
      }, proto.lens.LensOverlayServerClusterInfoRequest.prototype.setEnableSearchSessionId = function(r) {
        return e.Message.setProto3BooleanField(this, 1, r);
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayServerClusterInfoResponse.prototype.toObject = function(r) {
        return proto.lens.LensOverlayServerClusterInfoResponse.toObject(r, this);
      }, proto.lens.LensOverlayServerClusterInfoResponse.toObject = function(r, o) {
        var u, g = {
          serverSessionId: e.Message.getFieldWithDefault(o, 1, ""),
          searchSessionId: e.Message.getFieldWithDefault(o, 2, ""),
          routingInfo: (u = o.getRoutingInfo()) && t.LensOverlayRoutingInfo.toObject(r, u)
        };
        return r && (g.$jspbMessageInstance = o), g;
      }), proto.lens.LensOverlayServerClusterInfoResponse.deserializeBinary = function(r) {
        var o = new e.BinaryReader(r), u = new proto.lens.LensOverlayServerClusterInfoResponse();
        return proto.lens.LensOverlayServerClusterInfoResponse.deserializeBinaryFromReader(u, o);
      }, proto.lens.LensOverlayServerClusterInfoResponse.deserializeBinaryFromReader = function(r, o) {
        for (; o.nextField() && !o.isEndGroup(); ) {
          var u = o.getFieldNumber();
          switch (u) {
            case 1:
              var g = (
                /** @type {string} */
                o.readString()
              );
              r.setServerSessionId(g);
              break;
            case 2:
              var g = (
                /** @type {string} */
                o.readString()
              );
              r.setSearchSessionId(g);
              break;
            case 3:
              var g = new t.LensOverlayRoutingInfo();
              o.readMessage(g, t.LensOverlayRoutingInfo.deserializeBinaryFromReader), r.setRoutingInfo(g);
              break;
            default:
              o.skipField();
              break;
          }
        }
        return r;
      }, proto.lens.LensOverlayServerClusterInfoResponse.prototype.serializeBinary = function() {
        var r = new e.BinaryWriter();
        return proto.lens.LensOverlayServerClusterInfoResponse.serializeBinaryToWriter(this, r), r.getResultBuffer();
      }, proto.lens.LensOverlayServerClusterInfoResponse.serializeBinaryToWriter = function(r, o) {
        var u = void 0;
        u = r.getServerSessionId(), u.length > 0 && o.writeString(
          1,
          u
        ), u = r.getSearchSessionId(), u.length > 0 && o.writeString(
          2,
          u
        ), u = r.getRoutingInfo(), u != null && o.writeMessage(
          3,
          u,
          t.LensOverlayRoutingInfo.serializeBinaryToWriter
        );
      }, proto.lens.LensOverlayServerClusterInfoResponse.prototype.getServerSessionId = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 1, "")
        );
      }, proto.lens.LensOverlayServerClusterInfoResponse.prototype.setServerSessionId = function(r) {
        return e.Message.setProto3StringField(this, 1, r);
      }, proto.lens.LensOverlayServerClusterInfoResponse.prototype.getSearchSessionId = function() {
        return (
          /** @type {string} */
          e.Message.getFieldWithDefault(this, 2, "")
        );
      }, proto.lens.LensOverlayServerClusterInfoResponse.prototype.setSearchSessionId = function(r) {
        return e.Message.setProto3StringField(this, 2, r);
      }, proto.lens.LensOverlayServerClusterInfoResponse.prototype.getRoutingInfo = function() {
        return (
          /** @type{?proto.lens.LensOverlayRoutingInfo} */
          e.Message.getWrapperField(this, t.LensOverlayRoutingInfo, 3)
        );
      }, proto.lens.LensOverlayServerClusterInfoResponse.prototype.setRoutingInfo = function(r) {
        return e.Message.setWrapperField(this, 3, r);
      }, proto.lens.LensOverlayServerClusterInfoResponse.prototype.clearRoutingInfo = function() {
        return this.setRoutingInfo(void 0);
      }, proto.lens.LensOverlayServerClusterInfoResponse.prototype.hasRoutingInfo = function() {
        return e.Message.getField(this, 3) != null;
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayServerError.prototype.toObject = function(r) {
        return proto.lens.LensOverlayServerError.toObject(r, this);
      }, proto.lens.LensOverlayServerError.toObject = function(r, o) {
        var u = {
          errorType: e.Message.getFieldWithDefault(o, 1, 0)
        };
        return r && (u.$jspbMessageInstance = o), u;
      }), proto.lens.LensOverlayServerError.deserializeBinary = function(r) {
        var o = new e.BinaryReader(r), u = new proto.lens.LensOverlayServerError();
        return proto.lens.LensOverlayServerError.deserializeBinaryFromReader(u, o);
      }, proto.lens.LensOverlayServerError.deserializeBinaryFromReader = function(r, o) {
        for (; o.nextField() && !o.isEndGroup(); ) {
          var u = o.getFieldNumber();
          switch (u) {
            case 1:
              var g = (
                /** @type {!proto.lens.LensOverlayServerError.ErrorType} */
                o.readEnum()
              );
              r.setErrorType(g);
              break;
            default:
              o.skipField();
              break;
          }
        }
        return r;
      }, proto.lens.LensOverlayServerError.prototype.serializeBinary = function() {
        var r = new e.BinaryWriter();
        return proto.lens.LensOverlayServerError.serializeBinaryToWriter(this, r), r.getResultBuffer();
      }, proto.lens.LensOverlayServerError.serializeBinaryToWriter = function(r, o) {
        var u = void 0;
        u = r.getErrorType(), u !== 0 && o.writeEnum(
          1,
          u
        );
      }, proto.lens.LensOverlayServerError.ErrorType = {
        UNKNOWN_TYPE: 0,
        MISSING_REQUEST: 1
      }, proto.lens.LensOverlayServerError.prototype.getErrorType = function() {
        return (
          /** @type {!proto.lens.LensOverlayServerError.ErrorType} */
          e.Message.getFieldWithDefault(this, 1, 0)
        );
      }, proto.lens.LensOverlayServerError.prototype.setErrorType = function(r) {
        return e.Message.setProto3EnumField(this, 1, r);
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayServerRequest.prototype.toObject = function(r) {
        return proto.lens.LensOverlayServerRequest.toObject(r, this);
      }, proto.lens.LensOverlayServerRequest.toObject = function(r, o) {
        var u, g = {
          objectsRequest: (u = o.getObjectsRequest()) && n.LensOverlayObjectsRequest.toObject(r, u),
          interactionRequest: (u = o.getInteractionRequest()) && n.LensOverlayInteractionRequest.toObject(r, u),
          clientLogs: (u = o.getClientLogs()) && a.LensOverlayClientLogs.toObject(r, u)
        };
        return r && (g.$jspbMessageInstance = o), g;
      }), proto.lens.LensOverlayServerRequest.deserializeBinary = function(r) {
        var o = new e.BinaryReader(r), u = new proto.lens.LensOverlayServerRequest();
        return proto.lens.LensOverlayServerRequest.deserializeBinaryFromReader(u, o);
      }, proto.lens.LensOverlayServerRequest.deserializeBinaryFromReader = function(r, o) {
        for (; o.nextField() && !o.isEndGroup(); ) {
          var u = o.getFieldNumber();
          switch (u) {
            case 1:
              var g = new n.LensOverlayObjectsRequest();
              o.readMessage(g, n.LensOverlayObjectsRequest.deserializeBinaryFromReader), r.setObjectsRequest(g);
              break;
            case 2:
              var g = new n.LensOverlayInteractionRequest();
              o.readMessage(g, n.LensOverlayInteractionRequest.deserializeBinaryFromReader), r.setInteractionRequest(g);
              break;
            case 3:
              var g = new a.LensOverlayClientLogs();
              o.readMessage(g, a.LensOverlayClientLogs.deserializeBinaryFromReader), r.setClientLogs(g);
              break;
            default:
              o.skipField();
              break;
          }
        }
        return r;
      }, proto.lens.LensOverlayServerRequest.prototype.serializeBinary = function() {
        var r = new e.BinaryWriter();
        return proto.lens.LensOverlayServerRequest.serializeBinaryToWriter(this, r), r.getResultBuffer();
      }, proto.lens.LensOverlayServerRequest.serializeBinaryToWriter = function(r, o) {
        var u = void 0;
        u = r.getObjectsRequest(), u != null && o.writeMessage(
          1,
          u,
          n.LensOverlayObjectsRequest.serializeBinaryToWriter
        ), u = r.getInteractionRequest(), u != null && o.writeMessage(
          2,
          u,
          n.LensOverlayInteractionRequest.serializeBinaryToWriter
        ), u = r.getClientLogs(), u != null && o.writeMessage(
          3,
          u,
          a.LensOverlayClientLogs.serializeBinaryToWriter
        );
      }, proto.lens.LensOverlayServerRequest.prototype.getObjectsRequest = function() {
        return (
          /** @type{?proto.lens.LensOverlayObjectsRequest} */
          e.Message.getWrapperField(this, n.LensOverlayObjectsRequest, 1)
        );
      }, proto.lens.LensOverlayServerRequest.prototype.setObjectsRequest = function(r) {
        return e.Message.setWrapperField(this, 1, r);
      }, proto.lens.LensOverlayServerRequest.prototype.clearObjectsRequest = function() {
        return this.setObjectsRequest(void 0);
      }, proto.lens.LensOverlayServerRequest.prototype.hasObjectsRequest = function() {
        return e.Message.getField(this, 1) != null;
      }, proto.lens.LensOverlayServerRequest.prototype.getInteractionRequest = function() {
        return (
          /** @type{?proto.lens.LensOverlayInteractionRequest} */
          e.Message.getWrapperField(this, n.LensOverlayInteractionRequest, 2)
        );
      }, proto.lens.LensOverlayServerRequest.prototype.setInteractionRequest = function(r) {
        return e.Message.setWrapperField(this, 2, r);
      }, proto.lens.LensOverlayServerRequest.prototype.clearInteractionRequest = function() {
        return this.setInteractionRequest(void 0);
      }, proto.lens.LensOverlayServerRequest.prototype.hasInteractionRequest = function() {
        return e.Message.getField(this, 2) != null;
      }, proto.lens.LensOverlayServerRequest.prototype.getClientLogs = function() {
        return (
          /** @type{?proto.lens.LensOverlayClientLogs} */
          e.Message.getWrapperField(this, a.LensOverlayClientLogs, 3)
        );
      }, proto.lens.LensOverlayServerRequest.prototype.setClientLogs = function(r) {
        return e.Message.setWrapperField(this, 3, r);
      }, proto.lens.LensOverlayServerRequest.prototype.clearClientLogs = function() {
        return this.setClientLogs(void 0);
      }, proto.lens.LensOverlayServerRequest.prototype.hasClientLogs = function() {
        return e.Message.getField(this, 3) != null;
      }, e.Message.GENERATE_TO_OBJECT && (proto.lens.LensOverlayServerResponse.prototype.toObject = function(r) {
        return proto.lens.LensOverlayServerResponse.toObject(r, this);
      }, proto.lens.LensOverlayServerResponse.toObject = function(r, o) {
        var u, g = {
          error: (u = o.getError()) && proto.lens.LensOverlayServerError.toObject(r, u),
          objectsResponse: (u = o.getObjectsResponse()) && n.LensOverlayObjectsResponse.toObject(r, u),
          interactionResponse: (u = o.getInteractionResponse()) && n.LensOverlayInteractionResponse.toObject(r, u)
        };
        return r && (g.$jspbMessageInstance = o), g;
      }), proto.lens.LensOverlayServerResponse.deserializeBinary = function(r) {
        var o = new e.BinaryReader(r), u = new proto.lens.LensOverlayServerResponse();
        return proto.lens.LensOverlayServerResponse.deserializeBinaryFromReader(u, o);
      }, proto.lens.LensOverlayServerResponse.deserializeBinaryFromReader = function(r, o) {
        for (; o.nextField() && !o.isEndGroup(); ) {
          var u = o.getFieldNumber();
          switch (u) {
            case 1:
              var g = new proto.lens.LensOverlayServerError();
              o.readMessage(g, proto.lens.LensOverlayServerError.deserializeBinaryFromReader), r.setError(g);
              break;
            case 2:
              var g = new n.LensOverlayObjectsResponse();
              o.readMessage(g, n.LensOverlayObjectsResponse.deserializeBinaryFromReader), r.setObjectsResponse(g);
              break;
            case 3:
              var g = new n.LensOverlayInteractionResponse();
              o.readMessage(g, n.LensOverlayInteractionResponse.deserializeBinaryFromReader), r.setInteractionResponse(g);
              break;
            default:
              o.skipField();
              break;
          }
        }
        return r;
      }, proto.lens.LensOverlayServerResponse.prototype.serializeBinary = function() {
        var r = new e.BinaryWriter();
        return proto.lens.LensOverlayServerResponse.serializeBinaryToWriter(this, r), r.getResultBuffer();
      }, proto.lens.LensOverlayServerResponse.serializeBinaryToWriter = function(r, o) {
        var u = void 0;
        u = r.getError(), u != null && o.writeMessage(
          1,
          u,
          proto.lens.LensOverlayServerError.serializeBinaryToWriter
        ), u = r.getObjectsResponse(), u != null && o.writeMessage(
          2,
          u,
          n.LensOverlayObjectsResponse.serializeBinaryToWriter
        ), u = r.getInteractionResponse(), u != null && o.writeMessage(
          3,
          u,
          n.LensOverlayInteractionResponse.serializeBinaryToWriter
        );
      }, proto.lens.LensOverlayServerResponse.prototype.getError = function() {
        return (
          /** @type{?proto.lens.LensOverlayServerError} */
          e.Message.getWrapperField(this, proto.lens.LensOverlayServerError, 1)
        );
      }, proto.lens.LensOverlayServerResponse.prototype.setError = function(r) {
        return e.Message.setWrapperField(this, 1, r);
      }, proto.lens.LensOverlayServerResponse.prototype.clearError = function() {
        return this.setError(void 0);
      }, proto.lens.LensOverlayServerResponse.prototype.hasError = function() {
        return e.Message.getField(this, 1) != null;
      }, proto.lens.LensOverlayServerResponse.prototype.getObjectsResponse = function() {
        return (
          /** @type{?proto.lens.LensOverlayObjectsResponse} */
          e.Message.getWrapperField(this, n.LensOverlayObjectsResponse, 2)
        );
      }, proto.lens.LensOverlayServerResponse.prototype.setObjectsResponse = function(r) {
        return e.Message.setWrapperField(this, 2, r);
      }, proto.lens.LensOverlayServerResponse.prototype.clearObjectsResponse = function() {
        return this.setObjectsResponse(void 0);
      }, proto.lens.LensOverlayServerResponse.prototype.hasObjectsResponse = function() {
        return e.Message.getField(this, 2) != null;
      }, proto.lens.LensOverlayServerResponse.prototype.getInteractionResponse = function() {
        return (
          /** @type{?proto.lens.LensOverlayInteractionResponse} */
          e.Message.getWrapperField(this, n.LensOverlayInteractionResponse, 3)
        );
      }, proto.lens.LensOverlayServerResponse.prototype.setInteractionResponse = function(r) {
        return e.Message.setWrapperField(this, 3, r);
      }, proto.lens.LensOverlayServerResponse.prototype.clearInteractionResponse = function() {
        return this.setInteractionResponse(void 0);
      }, proto.lens.LensOverlayServerResponse.prototype.hasInteractionResponse = function() {
        return e.Message.getField(this, 3) != null;
      }, i.object.extend(c, proto.lens);
    }(B)), B;
  }
  var Pe = /* @__PURE__ */ rt();
  var ot = /* @__PURE__ */ b(Pe);
  var at = /* @__PURE__ */ L({
    __proto__: null,
    default: ot
  }, [Pe]);
  var We = /* @__PURE__ */ De();
  var st = /* @__PURE__ */ b(We);
  var it = /* @__PURE__ */ L({
    __proto__: null,
    default: st
  }, [We]);
  var J = {};
  var Be;
  function lt() {
    return Be || (Be = 1, function(c) {
      var e = import_google_protobuf.default, i = e, d = typeof globalThis < "u" && globalThis || typeof window < "u" && window || typeof d < "u" && d || typeof self < "u" && self || function() {
        return this;
      }.call(null) || globalThis;
      i.exportSymbol("proto.lens.ClientPlatform", null, d), proto.lens.ClientPlatform = {
        CLIENT_PLATFORM_UNSPECIFIED: 0,
        CLIENT_PLATFORM_LENS_OVERLAY: 2
      }, i.object.extend(c, proto.lens);
    }(J)), J;
  }
  var _e = /* @__PURE__ */ lt();
  var pt = /* @__PURE__ */ b(_e);
  var ut = /* @__PURE__ */ L({
    __proto__: null,
    default: pt
  }, [_e]);
  var we = /* @__PURE__ */ xe();
  var dt = /* @__PURE__ */ b(we);
  var yt = /* @__PURE__ */ L({
    __proto__: null,
    default: dt
  }, [we]);
  var je = /* @__PURE__ */ Ee();
  var gt = /* @__PURE__ */ b(je);
  var ct = /* @__PURE__ */ L({
    __proto__: null,
    default: gt
  }, [je]);
  var Se = /* @__PURE__ */ Ce();
  var ft = /* @__PURE__ */ b(Se);
  var ht = /* @__PURE__ */ L({
    __proto__: null,
    default: ft
  }, [Se]);
  var ke = /* @__PURE__ */ R();
  var vt = /* @__PURE__ */ b(ke);
  var Ot = /* @__PURE__ */ L({
    __proto__: null,
    default: vt
  }, [ke]);
  var { LensOverlayServerRequest: Mt, LensOverlayObjectsRequest: Lt, LensOverlayRequestContext: bt, LensOverlayServerResponse: Rt, LensOverlayServerErrorErrorType: Z } = at;
  var { LensOverlayClientContext: Tt, LocaleContext: Ft } = it;
  var { Platform: Bt, Surface: It } = ut;
  var { ImageData: Ct, ImagePayload: Dt, ImageMetadata: mt } = yt;
  var { LensOverlayRequestId: xt } = ct;
  var { AppliedFilter: Et, AppliedFilters: Pt, LensOverlayFilterType: Wt } = ht;
  var { CoordinateType: Ie } = Ot;
  var Y = class {
    #e;
    constructor(e, i) {
      if (!e || e.length !== 4) throw new Error("Bounding box array [centerPerX, centerPerY, perWidth, perHeight] not set or invalid");
      if (!i || i.length !== 2) throw new Error("Image dimensions [width, height] not set or invalid");
      this.#e = i, this.centerPerX = e[0], this.centerPerY = e[1], this.perWidth = e[2], this.perHeight = e[3], this.pixelCoords = this.#t();
    }
    #t() {
      const [e, i] = this.#e, d = this.perWidth * e, a = this.perHeight * i, t = this.centerPerX * e - d / 2, n = this.centerPerY * i - a / 2;
      return {
        x: Math.round(t),
        y: Math.round(n),
        width: Math.round(d),
        height: Math.round(a)
      };
    }
  };
  var _t = class extends Error {
    constructor(e, i, d, a) {
      super(e), this.name = "LensError", this.code = i, this.headers = d, this.body = a;
    }
  };
  var wt = class {
    constructor(e, i) {
      this.text = e, this.boundingBox = i;
    }
  };
  var T = class {
    constructor(e, i) {
      this.language = e, this.segments = i;
    }
  };
  var zt = class {
    #e = {};
    cookies = {};
    _fetch = globalThis.fetch && globalThis.fetch.bind(globalThis);
    constructor(e = {}, i) {
      if (typeof e != "object")
        throw new TypeError("Lens constructor expects an object");
      i && (this._fetch = i);
      const d = e?.chromeVersion ?? "124.0.6367.60", a = e?.majorChromeVersion ?? d.split(".")[0];
      this.#e = {
        chromeVersion: d,
        majorChromeVersion: a,
        userAgent: e?.userAgent ?? `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${a}.0.0.0 Safari/537.36`,
        endpoint: ee,
        viewport: e?.viewport ?? [1920, 1080],
        headers: {},
        fetchOptions: {},
        targetLanguage: e?.targetLanguage ?? "en",
        ...e
      };
      for (const t in this.#e.headers) {
        const n = this.#e.headers[t];
        if (!n) {
          delete this.#e.headers[t];
          continue;
        }
        t.toLowerCase() !== t && (delete this.#e.headers[t], this.#e.headers[t.toLowerCase()] = n);
      }
      this.#n();
    }
    updateOptions(e) {
      for (const i in e)
        this.#e[i] = e[i];
      this.#n();
    }
    #t(e, i, d) {
      const a = this.#e.targetLanguage, t = new xt();
      t.setUuid(String(Date.now()) + String(Math.floor(Math.random() * 1e6))), t.setSequenceId(1), t.setImageSequenceId(1);
      const n = new Ft();
      n.setLanguage(a), n.setRegion(this.#e.region || "US"), n.setTimeZone(this.#e.timeZone || "America/New_York");
      const r = new Et();
      r.setFilterType(Wt.AUTO_FILTER);
      const o = new Pt();
      o.addFilter(r);
      const u = new Tt();
      u.setPlatform(Bt.WEB), u.setSurface(It.CHROMIUM), u.setLocaleContext(n), u.setClientFilters(o);
      const g = new bt();
      g.setRequestId(t), g.setClientContext(u);
      const M = new mt();
      M.setWidth(i), M.setHeight(d);
      const h = new Dt();
      h.setImageBytes(e);
      const v = new Ct();
      v.setPayload(h), v.setImageMetadata(M);
      const O = new Lt();
      O.setRequestContext(g), O.setImageData(v);
      const s = new Mt();
      return s.setObjectsRequest(O), s.serializeBinary();
    }
    #r(e, i) {
      if (e.hasError()) {
        const o = e.getError(), u = Object.keys(Z).find((g) => Z[g] === o.getErrorType());
        if (console.warn(`Lens server returned error: Type=${o.getErrorType()} (${u})`), o.getErrorType() !== Z.UNKNOWN_TYPE)
          return new T("", []);
      }
      if (!e.hasObjectsResponse())
        return new T("", []);
      const d = e.getObjectsResponse();
      if (!d.hasText() || !d.getText().hasTextLayout())
        return new T("", []);
      const a = d.getText(), t = a.getTextLayout(), n = a.getContentLanguage() || t.getParagraphsList()[0]?.getContentLanguage() || "", r = [];
      for (const o of t.getParagraphsList())
        for (const u of o.getLinesList()) {
          let g = "";
          const M = u.getWordsList();
          for (let h = 0; h < M.length; h++) {
            const v = M[h];
            g += v.getPlainText(), v.hasTextSeparator() ? g += v.getTextSeparator() : h < M.length - 1 && (g += " ");
          }
          if (g = g.replace(/\s+/g, " ").trim(), g) {
            let h = null;
            if (u.hasGeometry() && u.getGeometry().hasBoundingBox()) {
              const v = u.getGeometry().getBoundingBox();
              if (v.getCoordinateType() === Ie.NORMALIZED) {
                const O = [
                  v.getCenterX(),
                  v.getCenterY(),
                  v.getWidth(),
                  v.getHeight()
                ];
                h = new Y(O, i);
              }
            }
            if (!h && o.hasGeometry() && o.getGeometry().hasBoundingBox()) {
              const v = o.getGeometry().getBoundingBox();
              if (v.getCoordinateType() === Ie.NORMALIZED) {
                const O = [
                  v.getCenterX(),
                  v.getCenterY(),
                  v.getWidth(),
                  v.getHeight()
                ];
                h = new Y(O, i);
              }
            }
            h || (h = new Y([0.5, 0.5, 1, 1], i)), r.push(new wt(g, h));
          }
        }
      return new T(n, r);
    }
    async _sendProtoRequest(e) {
      const i = {
        "Content-Type": "application/x-protobuf",
        "X-Goog-Api-Key": ze,
        "User-Agent": this.#e.userAgent,
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": this.#e.targetLanguage ? `${this.#e.targetLanguage},en;q=0.9` : "en-US,en;q=0.9",
        ...this.#e.headers
      };
      this.#o(i);
      const d = await this._fetch(ee, {
        method: "POST",
        headers: i,
        body: e,
        redirect: "follow",
        ...this.#e.fetchOptions
      });
      if (this.#a(d.headers.get("set-cookie")), !d.ok) {
        const n = await d.text().catch(() => "Could not read error body");
        throw new _t(
          `Lens Protobuf API request failed with status ${d.status}`,
          String(d.status),
          d.headers,
          n
        );
      }
      const a = await d.arrayBuffer(), t = new Uint8Array(a);
      return Rt.deserializeBinary(t);
    }
    async scanByURL(e) {
      const i = await this._fetch(e);
      if (!i.ok)
        throw new Error(`Failed to fetch image from URL: ${e}, status: ${i.status}`);
      const d = await i.arrayBuffer(), a = new Uint8Array(d);
      let t = "image/jpeg";
      const n = e.split(".").pop().toLowerCase();
      n && te[n] && (t = te[n]);
      const r = imageDimensionsFromData(a);
      if (!r)
        throw new Error("Could not determine image dimensions from URL.");
      return this.scanByData(a, t, [r.width, r.height]);
    }
    async scanByData(e, i, d) {
      !qe.includes(i) && i !== "image/gif" && console.warn(`MIME type ${i} might not be directly supported by the proto API, conversion recommended.`);
      const a = imageDimensionsFromData(e);
      if (!a)
        throw new Error("Could not determine actual image dimensions for proto request.");
      const t = this.#t(e, a.width, a.height), n = await this._sendProtoRequest(t);
      return this.#r(n, d || [a.width, a.height]);
    }
    #o(e) {
      if (Object.keys(this.cookies).length > 0) {
        const i = Object.entries(this.cookies).filter(([d, a]) => !a.expires || a.expires > Date.now());
        this.cookies = Object.fromEntries(i), i.length > 0 && (e.cookie = i.map(([d, a]) => `${d}=${a.value}`).join("; "));
      }
    }
    #a(e) {
      if (e)
        try {
          const i = import_set_cookie_parser.default.splitCookiesString(e), d = import_set_cookie_parser.default.parse(i, { decodeValues: false });
          if (d.length > 0)
            for (const a of d)
              a.name && a.value && (this.cookies[a.name] = {
                ...a,
                expires: a.expires ? new Date(a.expires).getTime() : 1 / 0
              });
        } catch (i) {
          console.error("Failed to parse or set cookies:", i);
        }
    }
    #n() {
      const e = this.#e?.headers?.cookie;
      if (e) {
        if (typeof e == "string") {
          const i = Ge(e);
          for (const d in i)
            this.cookies[d] = {
              name: d,
              value: i[d],
              expires: 1 / 0
            };
        } else if (typeof e == "object")
          for (const i in e)
            typeof e[i] == "object" && e[i].value !== void 0 ? this.cookies[i] = {
              name: i,
              value: e[i].value,
              expires: e[i].expires || 1 / 0,
              ...e[i]
            } : typeof e[i] == "string" && (this.cookies[i] = { name: i, value: e[i], expires: 1 / 0 });
      }
    }
  };

  // entry.mjs
  window.LensCore = zt;
})();
