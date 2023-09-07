(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend$1 = Object.assign;
const remove$1 = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$2 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$2.call(val, key);
const isArray$1 = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction$1 = (val) => typeof val === "function";
const isString$1 = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject$1(val) && isFunction$1(val.then) && isFunction$1(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString$1(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction(
  (str) => str.charAt(0).toUpperCase() + str.slice(1)
);
const toHandlerKey = cacheStringFunction(
  (str) => str ? `on${capitalize(str)}` : ``
);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
const toNumber = (val) => {
  const n = isString$1(val) ? Number(val) : NaN;
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
  if (isArray$1(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString$1(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString$1(value)) {
    return value;
  } else if (isObject$1(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString$1(value)) {
    res = value;
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$1(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
function normalizeProps(props) {
  if (!props)
    return null;
  let { class: klass, style } = props;
  if (klass && !isString$1(klass)) {
    props.class = normalizeClass(klass);
  }
  if (style) {
    props.style = normalizeStyle(style);
  }
  return props;
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
const toDisplayString = (val) => {
  return isString$1(val) ? val : val == null ? "" : isArray$1(val) || isObject$1(val) && (val.toString === objectToString || !isFunction$1(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject$1(val) && !isArray$1(val) && !isPlainObject$1(val)) {
    return String(val);
  }
  return val;
};
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function recordEffectScope(effect, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect) => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
const targetMap = /* @__PURE__ */ new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
class ReactiveEffect {
  constructor(fn, scheduler = null, scope) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this.parent = void 0;
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let parent = activeEffect;
    let lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      trackOpBit = 1 << ++effectTrackDepth;
      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this);
      } else {
        cleanupEffect(this);
      }
      return this.fn();
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }
      trackOpBit = 1 << --effectTrackDepth;
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = void 0;
      if (this.deferStop) {
        this.stop();
      }
    }
  }
  stop() {
    if (activeEffect === this) {
      this.deferStop = true;
    } else if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect2) {
  const { deps } = effect2;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect2);
    }
    deps.length = 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep());
    }
    trackEffects(dep);
  }
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray$1(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0]);
      }
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects));
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  const effects = isArray$1(dep) ? dep : [...dep];
  for (const effect2 of effects) {
    if (effect2.computed) {
      triggerEffect(effect2);
    }
  }
  for (const effect2 of effects) {
    if (!effect2.computed) {
      triggerEffect(effect2);
    }
  }
}
function triggerEffect(effect2, debuggerEventExtraInfo) {
  if (effect2 !== activeEffect || effect2.allowRecurse) {
    if (effect2.scheduler) {
      effect2.scheduler();
    } else {
      effect2.run();
    }
  }
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const get$1 = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty$1(key) {
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray$1(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty$1;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject$1(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
const set$1 = /* @__PURE__ */ createSetter();
const shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set2(target, key, value, receiver) {
    let oldValue = target[key];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow) {
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray$1(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray$1(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function has$1(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray$1(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
const mutableHandlers = {
  get: get$1,
  set: set$1,
  deleteProperty,
  has: has$1,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    return true;
  },
  deleteProperty(target, key) {
    return true;
  }
};
const shallowReactiveHandlers = /* @__PURE__ */ extend$1(
  {},
  mutableHandlers,
  {
    get: shallowGet,
    set: shallowSet
  }
);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach2(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get(this, key);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(
      method,
      false,
      false
    );
    readonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      false
    );
    shallowInstrumentations2[method] = createIterableMethod(
      method,
      false,
      true
    );
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject$1(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject$1(value) ? reactive(value) : value;
const toReadonly = (value) => isObject$1(value) ? readonly(value) : value;
function trackRefValue(ref2) {
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    {
      trackEffects(ref2.dep || (ref2.dep = createDep()));
    }
  }
}
function triggerRefValue(ref2, newVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    {
      triggerEffects(dep);
    }
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    trackRefValue(self2);
    if (self2._dirty || !self2._cacheable) {
      self2._dirty = false;
      self2._value = self2.effect.run();
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction$1(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function warn(msg, ...args) {
  return;
}
function callWithErrorHandling(fn, instance, type, args) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
  return res;
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction$1(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJobId = getId(queue[middle]);
    middleJobId < id ? start = middle + 1 : end = middle;
  }
  return start;
}
function queueJob(job) {
  if (!queue.length || !queue.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray$1(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(seen, i = isFlushing ? flushIndex + 1 : 0) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.pre) {
      queue.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff = getId(a) - getId(b);
  if (diff === 0) {
    if (a.pre && !b.pre)
      return -1;
    if (b.pre && !a.pre)
      return 1;
  }
  return diff;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  queue.sort(comparator);
  const check = NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
function emit(instance, event2, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event2.startsWith("update:");
  const modelArg = isModelListener2 && event2.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim: trim2 } = props[modifiersKey] || EMPTY_OBJ;
    if (trim2) {
      args = rawArgs.map((a) => isString$1(a) ? a.trim() : a);
    }
    if (number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  let handlerName;
  let handler2 = props[handlerName = toHandlerKey(event2)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event2))];
  if (!handler2 && isModelListener2) {
    handler2 = props[handlerName = toHandlerKey(hyphenate(event2))];
  }
  if (handler2) {
    callWithAsyncErrorHandling(
      handler2,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction$1(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend$1(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$1(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray$1(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend$1(normalized, raw);
  }
  if (isObject$1(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    props,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render: render2,
    renderCache,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      result = normalizeVNode(
        render2.call(
          proxyToUse,
          proxyToUse,
          renderCache,
          props,
          setupState,
          data,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render22 = Component;
      if (false)
        ;
      result = normalizeVNode(
        render22.length > 1 ? render22(
          props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return attrs;
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render22(
          props,
          null
          /* we know it doesn't need it */
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root = cloneVNode(root, fallthroughAttrs);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root.transition = vnode.transition;
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent && parent.subTree === vnode) {
    (vnode = parent.vnode).el = el;
    parent = parent.parent;
  }
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray$1(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
  var _a;
  const instance = getCurrentScope() === ((_a = currentInstance) == null ? void 0 : _a.scope) ? currentInstance : null;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isArray$1(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return traverse(s);
      } else if (isFunction$1(s)) {
        return callWithErrorHandling(s, instance, 2);
      } else
        ;
    });
  } else if (isFunction$1(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (instance && instance.isUnmounted) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
    };
  };
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else {
      return NOOP;
    }
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect.active) {
      return;
    }
    if (cb) {
      const newValue = effect.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some(
        (v, i) => hasChanged(v, oldValue[i])
      ) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect = new ReactiveEffect(getter, scheduler);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(
      effect.run.bind(effect),
      instance && instance.suspense
    );
  } else {
    effect.run();
  }
  const unwatch = () => {
    effect.stop();
    if (instance && instance.scope) {
      remove$1(instance.scope.effects, effect);
    }
  };
  if (ssrCleanup)
    ssrCleanup.push(unwatch);
  return unwatch;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString$1(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction$1(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, seen) {
  if (!isObject$1(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, seen);
    });
  } else if (isPlainObject$1(value)) {
    for (const key in value) {
      traverse(value[key], seen);
    }
  }
  return value;
}
function withDirectives(vnode, directives) {
  const internalInstance = currentRenderingInstance;
  if (internalInstance === null) {
    return vnode;
  }
  const instance = getExposeProxy(internalInstance) || internalInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (dir) {
      if (isFunction$1(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionPropsValidators = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: TransitionHookValidator,
  onEnter: TransitionHookValidator,
  onAfterEnter: TransitionHookValidator,
  onEnterCancelled: TransitionHookValidator,
  // leave
  onBeforeLeave: TransitionHookValidator,
  onLeave: TransitionHookValidator,
  onAfterLeave: TransitionHookValidator,
  onLeaveCancelled: TransitionHookValidator,
  // appear
  onBeforeAppear: TransitionHookValidator,
  onAppear: TransitionHookValidator,
  onAfterAppear: TransitionHookValidator,
  onAppearCancelled: TransitionHookValidator
};
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: BaseTransitionPropsValidators,
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      let child = children[0];
      if (children.length > 1) {
        for (const c of children) {
          if (c.type !== Comment) {
            child = c;
            break;
          }
        }
      }
      const rawProps = toRaw(props);
      const { mode } = rawProps;
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getKeepAliveChild(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      const enterHooks = resolveTransitionHooks(
        innerChild,
        rawProps,
        state,
        instance
      );
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const { getTransitionKey } = innerChild.type;
      if (getTransitionKey) {
        const key = getTransitionKey();
        if (prevTransitionKey === void 0) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      }
      if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(
          oldInnerChild,
          rawProps,
          state,
          instance
        );
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in") {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            if (instance.update.active !== false) {
              instance.update();
            }
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(
              state,
              oldInnerChild
            );
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el._leaveCb = () => {
              earlyRemove();
              el._leaveCb = void 0;
              delete enterHooks.delayedLeave;
            };
            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }
      return child;
    };
  }
};
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
  const { leavingVNodes } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = /* @__PURE__ */ Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance) {
  const {
    appear,
    mode,
    persisted = false,
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onEnterCancelled,
    onBeforeLeave,
    onLeave,
    onAfterLeave,
    onLeaveCancelled,
    onBeforeAppear,
    onAppear,
    onAfterAppear,
    onAppearCancelled
  } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);
  const callHook2 = (hook, args) => {
    hook && callWithAsyncErrorHandling(
      hook,
      instance,
      9,
      args
    );
  };
  const callAsyncHook = (hook, args) => {
    const done = args[1];
    callHook2(hook, args);
    if (isArray$1(hook)) {
      if (hook.every((hook2) => hook2.length <= 1))
        done();
    } else if (hook.length <= 1) {
      done();
    }
  };
  const hooks = {
    mode,
    persisted,
    beforeEnter(el) {
      let hook = onBeforeEnter;
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el._leaveCb) {
        el._leaveCb(
          true
          /* cancelled */
        );
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
        leavingVNode.el._leaveCb();
      }
      callHook2(hook, [el]);
    },
    enter(el) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done = el._enterCb = (cancelled) => {
        if (called)
          return;
        called = true;
        if (cancelled) {
          callHook2(cancelHook, [el]);
        } else {
          callHook2(afterHook, [el]);
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }
        el._enterCb = void 0;
      };
      if (hook) {
        callAsyncHook(hook, [el, done]);
      } else {
        done();
      }
    },
    leave(el, remove2) {
      const key2 = String(vnode.key);
      if (el._enterCb) {
        el._enterCb(
          true
          /* cancelled */
        );
      }
      if (state.isUnmounting) {
        return remove2();
      }
      callHook2(onBeforeLeave, [el]);
      let called = false;
      const done = el._leaveCb = (cancelled) => {
        if (called)
          return;
        called = true;
        remove2();
        if (cancelled) {
          callHook2(onLeaveCancelled, [el]);
        } else {
          callHook2(onAfterLeave, [el]);
        }
        el._leaveCb = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        callAsyncHook(onLeave, [el, done]);
      } else {
        done();
      }
    },
    clone(vnode2) {
      return resolveTransitionHooks(vnode2, props, state, instance);
    }
  };
  return hooks;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getKeepAliveChild(vnode) {
  return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function getTransitionRawChildren(children, keepComment = false, parentKey) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(
        getTransitionRawChildren(child.children, keepComment, key)
      );
    } else if (keepComment || child.type !== Comment) {
      ret.push(key != null ? cloneVNode(child, { key }) : child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2;
    }
  }
  return ret;
}
function defineComponent(options, extraOptions) {
  return isFunction$1(options) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend$1({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove$1(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      unsetCurrentInstance();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook(
  "rtg"
);
const onRenderTracked = createHook(
  "rtc"
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const COMPONENTS = "components";
const DIRECTIVES = "directives";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
function resolveDynamicComponent(component) {
  if (isString$1(component)) {
    return resolveAsset(COMPONENTS, component, false) || component;
  } else {
    return component || NULL_DYNAMIC_COMPONENT;
  }
}
function resolveDirective(name) {
  return resolveAsset(DIRECTIVES, name);
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(
        Component,
        false
        /* do not include inferred name to avoid breaking existing code */
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache && cache[index];
  if (isArray$1(source) || isString$1(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, void 0, cached && cached[i]);
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
    }
  } else if (isObject$1(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(
        source,
        (item, i) => renderItem(item, i, void 0, cached && cached[i])
      );
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached && cached[i]);
      }
    }
  } else {
    ret = [];
  }
  if (cache) {
    cache[index] = ret;
  }
  return ret;
}
function createSlots(slots, dynamicSlots) {
  for (let i = 0; i < dynamicSlots.length; i++) {
    const slot = dynamicSlots[i];
    if (isArray$1(slot)) {
      for (let j = 0; j < slot.length; j++) {
        slots[slot[j].name] = slot[j].fn;
      }
    } else if (slot) {
      slots[slot.name] = slot.key ? (...args) => {
        const res = slot.fn(...args);
        if (res)
          res.key = slot.key;
        return res;
      } : slot.fn;
    }
  }
  return slots;
}
function renderSlot(slots, name, props = {}, fallback, noSlotted) {
  if (currentRenderingInstance.isCE || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.isCE) {
    if (name !== "default")
      props.name = name;
    return createVNode("slot", props, fallback && fallback());
  }
  let slot = slots[name];
  if (slot && slot._c) {
    slot._d = false;
  }
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const rendered = createBlock(
    Fragment,
    {
      key: props.key || // slot content array of a dynamic conditional slot may have a branch
      // key attached in the `createSlots` helper, respect that
      validSlotContent && validSlotContent.key || `_${name}`
    },
    validSlotContent || (fallback ? fallback() : []),
    validSlotContent && slots._ === 1 ? 64 : -2
  );
  if (!noSlotted && rendered.scopeId) {
    rendered.slotScopeIds = [rendered.scopeId + "-s"];
  }
  if (slot && slot._c) {
    slot._d = true;
  }
  return rendered;
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode(child))
      return true;
    if (child.type === Comment)
      return false;
    if (child.type === Fragment && !ensureValidVNode(child.children))
      return false;
    return true;
  }) ? vnodes : null;
}
function toHandlers(obj, preserveCaseIfNecessary) {
  const ret = {};
  for (const key in obj) {
    ret[preserveCaseIfNecessary && /[A-Z]/.test(key) ? `on:${key}` : toHandlerKey(key)] = obj[key];
  }
  return ret;
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend$1(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => queueJob(i.update)),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else
      ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
function normalizePropsOrEmits(props) {
  return isArray$1(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render: render2,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction$1(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject$1(data))
      ;
    else {
      instance.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction$1(opt) ? opt.bind(publicThis, publicThis) : isFunction$1(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction$1(opt) && isFunction$1(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction$1(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook$1(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray$1(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray$1(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render2 && instance.render === NOOP) {
    instance.render = render2;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray$1(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject$1(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
          /* treat default function as factory */
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray$1(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString$1(raw)) {
    const handler2 = ctx[raw];
    if (isFunction$1(handler2)) {
      watch(getter, handler2);
    }
  } else if (isFunction$1(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$1(raw)) {
    if (isArray$1(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler2 = isFunction$1(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction$1(handler2)) {
        watch(getter, handler2, raw);
      }
    }
  } else
    ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject$1(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m) => mergeOptions(to, m, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend$1(
      isFunction$1(to) ? to.call(this, this) : to,
      isFunction$1(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray$1(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend$1(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray$1(to) && isArray$1(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend$1(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend$1(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render2, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction$1(rootComponent)) {
      rootComponent = extend$1({}, rootComponent);
    }
    if (rootProps != null && !isObject$1(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new Set();
    let isMounted = false;
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin))
          ;
        else if (plugin && isFunction$1(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app, ...options);
        } else if (isFunction$1(plugin)) {
          installedPlugins.add(plugin);
          plugin(app, ...options);
        } else
          ;
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app;
      },
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(
            rootComponent,
            rootProps
          );
          vnode.appContext = context;
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render2(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render2(null, app._container);
          delete app._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app;
      },
      runWithContext(fn) {
        currentApp = app;
        try {
          return fn();
        } finally {
          currentApp = null;
        }
      }
    };
    return app;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction$1(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else
      ;
  }
}
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  def(attrs, InternalObjectKey, 1);
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
              /* isAbsent */
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
              /* isAbsent */
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction$1(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          unsetCurrentInstance();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction$1(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend$1(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$1(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray$1(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction$1(opt) ? { type: opt } : extend$1({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[
            0
            /* shouldCast */
          ] = booleanIndex > -1;
          prop[
            1
            /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject$1(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$") {
    return true;
  }
  return false;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*(function|class) (\w+)/);
  return match ? match[2] : ctor === null ? "null" : "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray$1(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if (isFunction$1(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray$1(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false)
      ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction$1(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      instance.slots = toRaw(children);
      def(children, "_", type);
    } else {
      normalizeObjectSlots(
        children,
        instance.slots = {}
      );
    }
  } else {
    instance.slots = {};
    if (children) {
      normalizeVNodeSlots(instance, children);
    }
  }
  def(instance.slots, InternalObjectKey, 1);
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        extend$1(slots, children);
        if (!optimized && type === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
        delete slots[key];
      }
    }
  }
};
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray$1(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && (isArray$1(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref2 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref2) {
    if (isString$1(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction$1(ref2)) {
    callWithErrorHandling(ref2, owner, 12, [value, refs]);
  } else {
    const _isString = isString$1(ref2);
    const _isRef = isRef(ref2);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? hasOwn(setupState, ref2) ? setupState[ref2] : refs[ref2] : ref2.value;
          if (isUnmount) {
            isArray$1(existing) && remove$1(existing, refValue);
          } else {
            if (!isArray$1(existing)) {
              if (_isString) {
                refs[ref2] = [refValue];
                if (hasOwn(setupState, ref2)) {
                  setupState[ref2] = refs[ref2];
                }
              } else {
                ref2.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref2.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref2] = value;
          if (hasOwn(setupState, ref2)) {
            setupState[ref2] = value;
          }
        } else if (_isRef) {
          ref2.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else
          ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref2, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, isSVG);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized,
            internals
          );
        } else
          ;
    }
    if (ref2 != null && parentComponent) {
      setRef(ref2, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container,
        anchor
      );
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      isSVG,
      n2.el,
      n2.anchor
    );
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === "svg";
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    } else {
      patchElement(
        n1,
        n2,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { type, props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(
      vnode.type,
      isSVG,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el,
        null,
        parentComponent,
        parentSuspense,
        isSVG && type !== "foreignObject",
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(
            el,
            key,
            null,
            props[key],
            isSVG,
            vnode.children,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    const areChildrenSVG = isSVG && n2.type !== "foreignObject";
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        areChildrenSVG,
        slotScopeIds
      );
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        areChildrenSVG,
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(
          el,
          n2,
          oldProps,
          newProps,
          parentComponent,
          parentSuspense,
          isSVG
        );
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, isSVG);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(
                el,
                key,
                prev,
                next,
                isSVG,
                n1.children,
                parentComponent,
                parentSuspense,
                unmountChildren
              );
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(
        el,
        n2,
        oldProps,
        newProps,
        parentComponent,
        parentSuspense,
        isSVG
      );
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              isSVG,
              vnode.children,
              parentComponent,
              parentSuspense,
              unmountChildren
            );
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(
            el,
            key,
            prev,
            next,
            isSVG,
            vnode.children,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(
        n2.children,
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds
        );
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          isSVG,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
      return;
    }
    setupRenderEffect(
      instance,
      initialVNode,
      container,
      anchor,
      parentSuspense,
      isSVG,
      optimized
    );
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(
              el,
              instance.subTree,
              instance,
              parentSuspense,
              null
            );
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(
              // note: we are moving the render call into an async callback,
              // which means it won't track dependencies - but it's ok because
              // a server-rendered async wrapper is already in resolved state
              // and it will never need to change.
              () => !instance.isUnmounted && hydrateSubTree()
            );
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            isSVG
          );
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          isSVG
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        }
      }
    };
    const effect = instance.effect = new ReactiveEffect(
      componentUpdateFn,
      () => queueJob(update),
      instance.scope
      // track it in component's effect scope
    );
    const update = instance.update = () => effect.run();
    update.id = instance.uid;
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs();
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(
        c1[i],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(
            null,
            c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove22 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove22();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove22, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref: ref2,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs
    } = vnode;
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          optimized,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, update, subTree, um } = instance;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update) {
      update.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  const render2 = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG);
    }
    flushPreFlushCbs();
    flushPostFlushCbs();
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(
      internals
    );
  }
  return {
    render: render2,
    hydrate,
    createApp: createAppAPI(render2, hydrate)
  };
}
function toggleRecurse({ effect, update }, allowed) {
  effect.allowRecurse = update.allowRecurse = allowed;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray$1(ch1) && isArray$1(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
const isTeleport = (type) => type.__isTeleport;
const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
const isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
const resolveTarget = (props, select) => {
  const targetSelector = props && props.to;
  if (isString$1(targetSelector)) {
    if (!select) {
      return null;
    } else {
      const target = select(targetSelector);
      return target;
    }
  } else {
    return targetSelector;
  }
};
const TeleportImpl = {
  __isTeleport: true,
  process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals) {
    const {
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      o: { insert, querySelector, createText, createComment }
    } = internals;
    const disabled = isTeleportDisabled(n2.props);
    let { shapeFlag, children, dynamicChildren } = n2;
    if (n1 == null) {
      const placeholder = n2.el = createText("");
      const mainAnchor = n2.anchor = createText("");
      insert(placeholder, container, anchor);
      insert(mainAnchor, container, anchor);
      const target = n2.target = resolveTarget(n2.props, querySelector);
      const targetAnchor = n2.targetAnchor = createText("");
      if (target) {
        insert(targetAnchor, target);
        isSVG = isSVG || isTargetSVG(target);
      }
      const mount = (container2, anchor2) => {
        if (shapeFlag & 16) {
          mountChildren(
            children,
            container2,
            anchor2,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        }
      };
      if (disabled) {
        mount(container, mainAnchor);
      } else if (target) {
        mount(target, targetAnchor);
      }
    } else {
      n2.el = n1.el;
      const mainAnchor = n2.anchor = n1.anchor;
      const target = n2.target = n1.target;
      const targetAnchor = n2.targetAnchor = n1.targetAnchor;
      const wasDisabled = isTeleportDisabled(n1.props);
      const currentContainer = wasDisabled ? container : target;
      const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
      isSVG = isSVG || isTargetSVG(target);
      if (dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          currentContainer,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds
        );
        traverseStaticChildren(n1, n2, true);
      } else if (!optimized) {
        patchChildren(
          n1,
          n2,
          currentContainer,
          currentAnchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          false
        );
      }
      if (disabled) {
        if (!wasDisabled) {
          moveTeleport(
            n2,
            container,
            mainAnchor,
            internals,
            1
          );
        }
      } else {
        if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
          const nextTarget = n2.target = resolveTarget(
            n2.props,
            querySelector
          );
          if (nextTarget) {
            moveTeleport(
              n2,
              nextTarget,
              null,
              internals,
              0
            );
          }
        } else if (wasDisabled) {
          moveTeleport(
            n2,
            target,
            targetAnchor,
            internals,
            1
          );
        }
      }
    }
    updateCssVars(n2);
  },
  remove(vnode, parentComponent, parentSuspense, optimized, { um: unmount, o: { remove: hostRemove } }, doRemove) {
    const { shapeFlag, children, anchor, targetAnchor, target, props } = vnode;
    if (target) {
      hostRemove(targetAnchor);
    }
    if (doRemove || !isTeleportDisabled(props)) {
      hostRemove(anchor);
      if (shapeFlag & 16) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          unmount(
            child,
            parentComponent,
            parentSuspense,
            true,
            !!child.dynamicChildren
          );
        }
      }
    }
  },
  move: moveTeleport,
  hydrate: hydrateTeleport
};
function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
  if (moveType === 0) {
    insert(vnode.targetAnchor, container, parentAnchor);
  }
  const { el, anchor, shapeFlag, children, props } = vnode;
  const isReorder = moveType === 2;
  if (isReorder) {
    insert(el, container, parentAnchor);
  }
  if (!isReorder || isTeleportDisabled(props)) {
    if (shapeFlag & 16) {
      for (let i = 0; i < children.length; i++) {
        move(
          children[i],
          container,
          parentAnchor,
          2
        );
      }
    }
  }
  if (isReorder) {
    insert(anchor, container, parentAnchor);
  }
}
function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, {
  o: { nextSibling, parentNode, querySelector }
}, hydrateChildren) {
  const target = vnode.target = resolveTarget(
    vnode.props,
    querySelector
  );
  if (target) {
    const targetNode = target._lpa || target.firstChild;
    if (vnode.shapeFlag & 16) {
      if (isTeleportDisabled(vnode.props)) {
        vnode.anchor = hydrateChildren(
          nextSibling(node),
          vnode,
          parentNode(node),
          parentComponent,
          parentSuspense,
          slotScopeIds,
          optimized
        );
        vnode.targetAnchor = targetNode;
      } else {
        vnode.anchor = nextSibling(node);
        let targetAnchor = targetNode;
        while (targetAnchor) {
          targetAnchor = nextSibling(targetAnchor);
          if (targetAnchor && targetAnchor.nodeType === 8 && targetAnchor.data === "teleport anchor") {
            vnode.targetAnchor = targetAnchor;
            target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
            break;
          }
        }
        hydrateChildren(
          targetNode,
          vnode,
          target,
          parentComponent,
          parentSuspense,
          slotScopeIds,
          optimized
        );
      }
    }
    updateCssVars(vnode);
  }
  return vnode.anchor && nextSibling(vnode.anchor);
}
const Teleport = TeleportImpl;
function updateCssVars(vnode) {
  const ctx = vnode.ctx;
  if (ctx && ctx.ut) {
    let node = vnode.children[0].el;
    while (node !== vnode.targetAnchor) {
      if (node.nodeType === 1)
        node.setAttribute("data-v-owner", ctx.uid);
      node = node.nextSibling;
    }
    ctx.ut();
  }
}
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
      /* isBlock */
    )
  );
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
      /* isBlock: prevent a block from tracking itself */
    )
  );
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref: ref2,
  ref_key,
  ref_for
}) => {
  if (typeof ref2 === "number") {
    ref2 = "" + ref2;
  }
  return ref2 != null ? isString$1(ref2) || isRef(ref2) || isFunction$1(ref2) ? { i: currentRenderingInstance, r: ref2, k: ref_key, f: !!ref_for } : ref2 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString$1(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag |= -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString$1(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject$1(style)) {
      if (isProxy(style) && !isArray$1(style)) {
        style = extend$1({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString$1(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$1(type) ? 4 : isFunction$1(type) ? 2 : 0;
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend$1({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref: ref2, patchFlag, children } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref2 ? isArray$1(ref2) ? ref2.concat(normalizeRef(extraProps)) : [ref2, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref2,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createStaticVNode(content, numberOfNodes) {
  const vnode = createVNode(Static, null, content);
  vnode.staticCount = numberOfNodes;
  return vnode;
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray$1(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray$1(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction$1(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray$1(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let globalCurrentInstanceSetters;
let settersKey = "__VUE_INSTANCE_SETTERS__";
{
  if (!(globalCurrentInstanceSetters = getGlobalThis()[settersKey])) {
    globalCurrentInstanceSetters = getGlobalThis()[settersKey] = [];
  }
  globalCurrentInstanceSetters.push((i) => currentInstance = i);
  internalSetCurrentInstance = (instance) => {
    if (globalCurrentInstanceSetters.length > 1) {
      globalCurrentInstanceSetters.forEach((s) => s(instance));
    } else {
      globalCurrentInstanceSetters[0](instance);
    }
  };
}
const setCurrentInstance = (instance) => {
  internalSetCurrentInstance(instance);
  instance.scope.on();
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isInSSRComponentSetup = false;
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [instance.props, setupContext]
    );
    resetTracking();
    unsetCurrentInstance();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction$1(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject$1(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance, isSSR);
}
let compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template || resolveMergedOptions(instance).template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend$1(
          extend$1(
            {
              isCustomElement,
              delimiters
            },
            compilerOptions
          ),
          componentCompilerOptions
        );
        Component.render = compile(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
  }
  {
    setCurrentInstance(instance);
    pauseTracking();
    applyOptions(instance);
    resetTracking();
    unsetCurrentInstance();
  }
}
function getAttrsProxy(instance) {
  return instance.attrsProxy || (instance.attrsProxy = new Proxy(
    instance.attrs,
    {
      get(target, key) {
        track(instance, "get", "$attrs");
        return target[key];
      }
    }
  ));
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  {
    return {
      get attrs() {
        return getAttrsProxy(instance);
      },
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  }
}
function getComponentName(Component, includeInferred = true) {
  return isFunction$1(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function isClassComponent(value) {
  return isFunction$1(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject$1(propsOrChildren) && !isArray$1(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
const ssrContextKey = Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
const version = "3.3.4";
const svgNS = "http://www.w3.org/2000/svg";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, isSVG, is, props) => {
    const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, isSVG, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
      const template = templateContainer.content;
      if (isSVG) {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
function patchClass(el, value, isSVG) {
  const transitionClasses = el._vtc;
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString$1(next);
  if (next && !isCssString) {
    if (prev && !isString$1(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, "");
        }
      }
    }
    for (const key in next) {
      setStyle(style, key, next[key]);
    }
  } else {
    const currentDisplay = style.display;
    if (isCssString) {
      if (prev !== next) {
        style.cssText = next;
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
    if ("_vod" in el) {
      style.display = currentDisplay;
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray$1(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null)
      val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean2 = isSpecialBooleanAttr(key);
    if (value == null || isBoolean2 && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean2 ? "" : value);
    }
  }
}
function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key] = value == null ? "" : value;
    return;
  }
  const tag = el.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    el._value = value;
    const oldValue = tag === "OPTION" ? el.getAttribute("value") : el.value;
    const newValue = value == null ? "" : value;
    if (oldValue !== newValue) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(key);
}
function addEventListener(el, event2, handler2, options) {
  el.addEventListener(event2, handler2, options);
}
function removeEventListener(el, event2, handler2, options) {
  el.removeEventListener(event2, handler2, options);
}
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue, instance);
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  const event2 = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event2, options];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(
      patchStopImmediatePropagation(e, invoker.value),
      instance,
      5,
      [e]
    );
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray$1(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
  } else {
    return value;
  }
}
const nativeOnRE = /^on[a-z]/;
const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(
      el,
      key,
      nextValue,
      prevChildren,
      parentComponent,
      parentSuspense,
      unmountChildren
    );
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && nativeOnRE.test(key) && isFunction$1(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (nativeOnRE.test(key) && isString$1(value)) {
    return false;
  }
  return key in el;
}
const TRANSITION = "transition";
const ANIMATION = "animation";
const Transition = (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots);
Transition.displayName = "Transition";
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
Transition.props = /* @__PURE__ */ extend$1(
  {},
  BaseTransitionPropsValidators,
  DOMTransitionPropsValidators
);
const callHook = (hook, args = []) => {
  if (isArray$1(hook)) {
    hook.forEach((h2) => h2(...args));
  } else if (hook) {
    hook(...args);
  }
};
const hasExplicitCallback = (hook) => {
  return hook ? isArray$1(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
  const baseProps = {};
  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }
  if (rawProps.css === false) {
    return baseProps;
  }
  const {
    name = "v",
    type,
    duration,
    enterFromClass = `${name}-enter-from`,
    enterActiveClass = `${name}-enter-active`,
    enterToClass = `${name}-enter-to`,
    appearFromClass = enterFromClass,
    appearActiveClass = enterActiveClass,
    appearToClass = enterToClass,
    leaveFromClass = `${name}-leave-from`,
    leaveActiveClass = `${name}-leave-active`,
    leaveToClass = `${name}-leave-to`
  } = rawProps;
  const durations = normalizeDuration(duration);
  const enterDuration = durations && durations[0];
  const leaveDuration = durations && durations[1];
  const {
    onBeforeEnter,
    onEnter,
    onEnterCancelled,
    onLeave,
    onLeaveCancelled,
    onBeforeAppear = onBeforeEnter,
    onAppear = onEnter,
    onAppearCancelled = onEnterCancelled
  } = baseProps;
  const finishEnter = (el, isAppear, done) => {
    removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
    done && done();
  };
  const finishLeave = (el, done) => {
    el._isLeaving = false;
    removeTransitionClass(el, leaveFromClass);
    removeTransitionClass(el, leaveToClass);
    removeTransitionClass(el, leaveActiveClass);
    done && done();
  };
  const makeEnterHook = (isAppear) => {
    return (el, done) => {
      const hook = isAppear ? onAppear : onEnter;
      const resolve2 = () => finishEnter(el, isAppear, done);
      callHook(hook, [el, resolve2]);
      nextFrame(() => {
        removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el, isAppear ? appearToClass : enterToClass);
        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el, type, enterDuration, resolve2);
        }
      });
    };
  };
  return extend$1(baseProps, {
    onBeforeEnter(el) {
      callHook(onBeforeEnter, [el]);
      addTransitionClass(el, enterFromClass);
      addTransitionClass(el, enterActiveClass);
    },
    onBeforeAppear(el) {
      callHook(onBeforeAppear, [el]);
      addTransitionClass(el, appearFromClass);
      addTransitionClass(el, appearActiveClass);
    },
    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),
    onLeave(el, done) {
      el._isLeaving = true;
      const resolve2 = () => finishLeave(el, done);
      addTransitionClass(el, leaveFromClass);
      forceReflow();
      addTransitionClass(el, leaveActiveClass);
      nextFrame(() => {
        if (!el._isLeaving) {
          return;
        }
        removeTransitionClass(el, leaveFromClass);
        addTransitionClass(el, leaveToClass);
        if (!hasExplicitCallback(onLeave)) {
          whenTransitionEnds(el, type, leaveDuration, resolve2);
        }
      });
      callHook(onLeave, [el, resolve2]);
    },
    onEnterCancelled(el) {
      finishEnter(el, false);
      callHook(onEnterCancelled, [el]);
    },
    onAppearCancelled(el) {
      finishEnter(el, true);
      callHook(onAppearCancelled, [el]);
    },
    onLeaveCancelled(el) {
      finishLeave(el);
      callHook(onLeaveCancelled, [el]);
    }
  });
}
function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if (isObject$1(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    const n = NumberOf(duration);
    return [n, n];
  }
}
function NumberOf(val) {
  const res = toNumber(val);
  return res;
}
function addTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
  (el._vtc || (el._vtc = /* @__PURE__ */ new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
  const { _vtc } = el;
  if (_vtc) {
    _vtc.delete(cls);
    if (!_vtc.size) {
      el._vtc = void 0;
    }
  }
}
function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb);
  });
}
let endId = 0;
function whenTransitionEnds(el, expectedType, explicitTimeout, resolve2) {
  const id = el._endId = ++endId;
  const resolveIfNotStale = () => {
    if (id === el._endId) {
      resolve2();
    }
  };
  if (explicitTimeout) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }
  const { type, timeout: timeout2, propCount } = getTransitionInfo(el, expectedType);
  if (!type) {
    return resolve2();
  }
  const endEvent = type + "end";
  let ended = 0;
  const end = () => {
    el.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };
  const onEnd = (e) => {
    if (e.target === el && ++ended >= propCount) {
      end();
    }
  };
  setTimeout(() => {
    if (ended < propCount) {
      end();
    }
  }, timeout2 + 1);
  el.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el, expectedType) {
  const styles = window.getComputedStyle(el);
  const getStyleProperties = (key) => (styles[key] || "").split(", ");
  const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
  const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
  const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
  const animationTimeout = getTimeout(animationDelays, animationDurations);
  let type = null;
  let timeout2 = 0;
  let propCount = 0;
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout2 = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout2 = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout2 = Math.max(transitionTimeout, animationTimeout);
    type = timeout2 > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(
    getStyleProperties(`${TRANSITION}Property`).toString()
  );
  return {
    type,
    timeout: timeout2,
    propCount,
    hasTransform
  };
}
function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }
  return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}
function toMs(s) {
  return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow() {
  return document.body.offsetHeight;
}
const systemModifiers = ["ctrl", "shift", "alt", "meta"];
const modifierGuards = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};
const withModifiers = (fn, modifiers) => {
  return (event2, ...args) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]];
      if (guard && guard(event2, modifiers))
        return;
    }
    return fn(event2, ...args);
  };
};
const keyNames = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
};
const withKeys = (fn, modifiers) => {
  return (event2) => {
    if (!("key" in event2)) {
      return;
    }
    const eventKey = hyphenate(event2.key);
    if (modifiers.some((k) => k === eventKey || keyNames[k] === eventKey)) {
      return fn(event2);
    }
  };
};
const vShow = {
  beforeMount(el, { value }, { transition }) {
    el._vod = el.style.display === "none" ? "" : el.style.display;
    if (transition && value) {
      transition.beforeEnter(el);
    } else {
      setDisplay(el, value);
    }
  },
  mounted(el, { value }, { transition }) {
    if (transition && value) {
      transition.enter(el);
    }
  },
  updated(el, { value, oldValue }, { transition }) {
    if (!value === !oldValue)
      return;
    if (transition) {
      if (value) {
        transition.beforeEnter(el);
        setDisplay(el, true);
        transition.enter(el);
      } else {
        transition.leave(el, () => {
          setDisplay(el, false);
        });
      }
    } else {
      setDisplay(el, value);
    }
  },
  beforeUnmount(el, { value }) {
    setDisplay(el, value);
  }
};
function setDisplay(el, value) {
  el.style.display = value ? el._vod : "none";
}
const rendererOptions = /* @__PURE__ */ extend$1({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app = ensureRenderer().createApp(...args);
  const { mount } = app;
  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app._component;
    if (!isFunction$1(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, container instanceof SVGElement);
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app;
};
function normalizeContainer(container) {
  if (isString$1(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
var DomHandler = {
  innerWidth(el) {
    if (el) {
      let width = el.offsetWidth;
      let style = getComputedStyle(el);
      width += parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      return width;
    }
    return 0;
  },
  width(el) {
    if (el) {
      let width = el.offsetWidth;
      let style = getComputedStyle(el);
      width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      return width;
    }
    return 0;
  },
  getWindowScrollTop() {
    let doc2 = document.documentElement;
    return (window.pageYOffset || doc2.scrollTop) - (doc2.clientTop || 0);
  },
  getWindowScrollLeft() {
    let doc2 = document.documentElement;
    return (window.pageXOffset || doc2.scrollLeft) - (doc2.clientLeft || 0);
  },
  getOuterWidth(el, margin) {
    if (el) {
      let width = el.offsetWidth;
      if (margin) {
        let style = getComputedStyle(el);
        width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      }
      return width;
    }
    return 0;
  },
  getOuterHeight(el, margin) {
    if (el) {
      let height = el.offsetHeight;
      if (margin) {
        let style = getComputedStyle(el);
        height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
      }
      return height;
    }
    return 0;
  },
  getClientHeight(el, margin) {
    if (el) {
      let height = el.clientHeight;
      if (margin) {
        let style = getComputedStyle(el);
        height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
      }
      return height;
    }
    return 0;
  },
  getViewport() {
    let win = window, d = document, e = d.documentElement, g = d.getElementsByTagName("body")[0], w = win.innerWidth || e.clientWidth || g.clientWidth, h2 = win.innerHeight || e.clientHeight || g.clientHeight;
    return { width: w, height: h2 };
  },
  getOffset(el) {
    if (el) {
      let rect = el.getBoundingClientRect();
      return {
        top: rect.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
        left: rect.left + (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0)
      };
    }
    return {
      top: "auto",
      left: "auto"
    };
  },
  index(element) {
    if (element) {
      let children = element.parentNode.childNodes;
      let num = 0;
      for (let i = 0; i < children.length; i++) {
        if (children[i] === element)
          return num;
        if (children[i].nodeType === 1)
          num++;
      }
    }
    return -1;
  },
  addMultipleClasses(element, className) {
    if (element && className) {
      if (element.classList) {
        let styles = className.split(" ");
        for (let i = 0; i < styles.length; i++) {
          element.classList.add(styles[i]);
        }
      } else {
        let styles = className.split(" ");
        for (let i = 0; i < styles.length; i++) {
          element.className += " " + styles[i];
        }
      }
    }
  },
  addClass(element, className) {
    if (element && className) {
      if (element.classList)
        element.classList.add(className);
      else
        element.className += " " + className;
    }
  },
  removeClass(element, className) {
    if (element && className) {
      if (element.classList)
        element.classList.remove(className);
      else
        element.className = element.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    }
  },
  hasClass(element, className) {
    if (element) {
      if (element.classList)
        return element.classList.contains(className);
      else
        return new RegExp("(^| )" + className + "( |$)", "gi").test(element.className);
    }
    return false;
  },
  find(element, selector) {
    return this.isElement(element) ? element.querySelectorAll(selector) : [];
  },
  findSingle(element, selector) {
    return this.isElement(element) ? element.querySelector(selector) : null;
  },
  getHeight(el) {
    if (el) {
      let height = el.offsetHeight;
      let style = getComputedStyle(el);
      height -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
      return height;
    }
    return 0;
  },
  getWidth(el) {
    if (el) {
      let width = el.offsetWidth;
      let style = getComputedStyle(el);
      width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
      return width;
    }
    return 0;
  },
  absolutePosition(element, target) {
    if (element) {
      let elementDimensions = element.offsetParent ? { width: element.offsetWidth, height: element.offsetHeight } : this.getHiddenElementDimensions(element);
      let elementOuterHeight = elementDimensions.height;
      let elementOuterWidth = elementDimensions.width;
      let targetOuterHeight = target.offsetHeight;
      let targetOuterWidth = target.offsetWidth;
      let targetOffset = target.getBoundingClientRect();
      let windowScrollTop = this.getWindowScrollTop();
      let windowScrollLeft = this.getWindowScrollLeft();
      let viewport = this.getViewport();
      let top, left;
      if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
        top = targetOffset.top + windowScrollTop - elementOuterHeight;
        element.style.transformOrigin = "bottom";
        if (top < 0) {
          top = windowScrollTop;
        }
      } else {
        top = targetOuterHeight + targetOffset.top + windowScrollTop;
        element.style.transformOrigin = "top";
      }
      if (targetOffset.left + elementOuterWidth > viewport.width)
        left = Math.max(0, targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth);
      else
        left = targetOffset.left + windowScrollLeft;
      element.style.top = top + "px";
      element.style.left = left + "px";
    }
  },
  relativePosition(element, target) {
    if (element) {
      let elementDimensions = element.offsetParent ? { width: element.offsetWidth, height: element.offsetHeight } : this.getHiddenElementDimensions(element);
      const targetHeight = target.offsetHeight;
      const targetOffset = target.getBoundingClientRect();
      const viewport = this.getViewport();
      let top, left;
      if (targetOffset.top + targetHeight + elementDimensions.height > viewport.height) {
        top = -1 * elementDimensions.height;
        element.style.transformOrigin = "bottom";
        if (targetOffset.top + top < 0) {
          top = -1 * targetOffset.top;
        }
      } else {
        top = targetHeight;
        element.style.transformOrigin = "top";
      }
      if (elementDimensions.width > viewport.width) {
        left = targetOffset.left * -1;
      } else if (targetOffset.left + elementDimensions.width > viewport.width) {
        left = (targetOffset.left + elementDimensions.width - viewport.width) * -1;
      } else {
        left = 0;
      }
      element.style.top = top + "px";
      element.style.left = left + "px";
    }
  },
  getParents(element, parents = []) {
    return element["parentNode"] === null ? parents : this.getParents(element.parentNode, parents.concat([element.parentNode]));
  },
  getScrollableParents(element) {
    let scrollableParents = [];
    if (element) {
      let parents = this.getParents(element);
      const overflowRegex = /(auto|scroll)/;
      const overflowCheck = (node) => {
        let styleDeclaration = window["getComputedStyle"](node, null);
        return overflowRegex.test(styleDeclaration.getPropertyValue("overflow")) || overflowRegex.test(styleDeclaration.getPropertyValue("overflowX")) || overflowRegex.test(styleDeclaration.getPropertyValue("overflowY"));
      };
      for (let parent of parents) {
        let scrollSelectors = parent.nodeType === 1 && parent.dataset["scrollselectors"];
        if (scrollSelectors) {
          let selectors = scrollSelectors.split(",");
          for (let selector of selectors) {
            let el = this.findSingle(parent, selector);
            if (el && overflowCheck(el)) {
              scrollableParents.push(el);
            }
          }
        }
        if (parent.nodeType !== 9 && overflowCheck(parent)) {
          scrollableParents.push(parent);
        }
      }
    }
    return scrollableParents;
  },
  getHiddenElementOuterHeight(element) {
    if (element) {
      element.style.visibility = "hidden";
      element.style.display = "block";
      let elementHeight = element.offsetHeight;
      element.style.display = "none";
      element.style.visibility = "visible";
      return elementHeight;
    }
    return 0;
  },
  getHiddenElementOuterWidth(element) {
    if (element) {
      element.style.visibility = "hidden";
      element.style.display = "block";
      let elementWidth = element.offsetWidth;
      element.style.display = "none";
      element.style.visibility = "visible";
      return elementWidth;
    }
    return 0;
  },
  getHiddenElementDimensions(element) {
    if (element) {
      let dimensions = {};
      element.style.visibility = "hidden";
      element.style.display = "block";
      dimensions.width = element.offsetWidth;
      dimensions.height = element.offsetHeight;
      element.style.display = "none";
      element.style.visibility = "visible";
      return dimensions;
    }
    return 0;
  },
  fadeIn(element, duration) {
    if (element) {
      element.style.opacity = 0;
      let last = +/* @__PURE__ */ new Date();
      let opacity = 0;
      let tick = function() {
        opacity = +element.style.opacity + ((/* @__PURE__ */ new Date()).getTime() - last) / duration;
        element.style.opacity = opacity;
        last = +/* @__PURE__ */ new Date();
        if (+opacity < 1) {
          window.requestAnimationFrame && requestAnimationFrame(tick) || setTimeout(tick, 16);
        }
      };
      tick();
    }
  },
  fadeOut(element, ms) {
    if (element) {
      let opacity = 1, interval = 50, duration = ms, gap = interval / duration;
      let fading = setInterval(() => {
        opacity -= gap;
        if (opacity <= 0) {
          opacity = 0;
          clearInterval(fading);
        }
        element.style.opacity = opacity;
      }, interval);
    }
  },
  getUserAgent() {
    return navigator.userAgent;
  },
  appendChild(element, target) {
    if (this.isElement(target))
      target.appendChild(element);
    else if (target.el && target.elElement)
      target.elElement.appendChild(element);
    else
      throw new Error("Cannot append " + target + " to " + element);
  },
  isElement(obj) {
    return typeof HTMLElement === "object" ? obj instanceof HTMLElement : obj && typeof obj === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === "string";
  },
  scrollInView(container, item) {
    let borderTopValue = getComputedStyle(container).getPropertyValue("borderTopWidth");
    let borderTop = borderTopValue ? parseFloat(borderTopValue) : 0;
    let paddingTopValue = getComputedStyle(container).getPropertyValue("paddingTop");
    let paddingTop = paddingTopValue ? parseFloat(paddingTopValue) : 0;
    let containerRect = container.getBoundingClientRect();
    let itemRect = item.getBoundingClientRect();
    let offset = itemRect.top + document.body.scrollTop - (containerRect.top + document.body.scrollTop) - borderTop - paddingTop;
    let scroll = container.scrollTop;
    let elementHeight = container.clientHeight;
    let itemHeight = this.getOuterHeight(item);
    if (offset < 0) {
      container.scrollTop = scroll + offset;
    } else if (offset + itemHeight > elementHeight) {
      container.scrollTop = scroll + offset - elementHeight + itemHeight;
    }
  },
  clearSelection() {
    if (window.getSelection) {
      if (window.getSelection().empty) {
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges && window.getSelection().rangeCount > 0 && window.getSelection().getRangeAt(0).getClientRects().length > 0) {
        window.getSelection().removeAllRanges();
      }
    } else if (document["selection"] && document["selection"].empty) {
      try {
        document["selection"].empty();
      } catch (error) {
      }
    }
  },
  getSelection() {
    if (window.getSelection)
      return window.getSelection().toString();
    else if (document.getSelection)
      return document.getSelection().toString();
    else if (document["selection"])
      return document["selection"].createRange().text;
    return null;
  },
  calculateScrollbarWidth() {
    if (this.calculatedScrollbarWidth != null)
      return this.calculatedScrollbarWidth;
    let scrollDiv = document.createElement("div");
    scrollDiv.className = "p-scrollbar-measure";
    document.body.appendChild(scrollDiv);
    let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    this.calculatedScrollbarWidth = scrollbarWidth;
    return scrollbarWidth;
  },
  getBrowser() {
    if (!this.browser) {
      let matched = this.resolveUserAgent();
      this.browser = {};
      if (matched.browser) {
        this.browser[matched.browser] = true;
        this.browser["version"] = matched.version;
      }
      if (this.browser["chrome"]) {
        this.browser["webkit"] = true;
      } else if (this.browser["webkit"]) {
        this.browser["safari"] = true;
      }
    }
    return this.browser;
  },
  resolveUserAgent() {
    let ua = navigator.userAgent.toLowerCase();
    let match = /(chrome)[ ]([\w.]+)/.exec(ua) || /(webkit)[ ]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ ]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
    return {
      browser: match[1] || "",
      version: match[2] || "0"
    };
  },
  isVisible(element) {
    return element && element.offsetParent != null;
  },
  invokeElementMethod(element, methodName, args) {
    element[methodName].apply(element, args);
  },
  isExist(element) {
    return !!(element !== null && typeof element !== "undefined" && element.nodeName && element.parentNode);
  },
  isClient() {
    return !!(typeof window !== "undefined" && window.document && window.document.createElement);
  },
  focus(el, options) {
    el && document.activeElement !== el && el.focus(options);
  },
  isFocusableElement(element, selector = "") {
    return this.isElement(element) ? element.matches(`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector}`) : false;
  },
  getFocusableElements(element, selector = "") {
    let focusableElements = this.find(
      element,
      `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector}`
    );
    let visibleFocusableElements = [];
    for (let focusableElement of focusableElements) {
      if (getComputedStyle(focusableElement).display != "none" && getComputedStyle(focusableElement).visibility != "hidden")
        visibleFocusableElements.push(focusableElement);
    }
    return visibleFocusableElements;
  },
  getFirstFocusableElement(element, selector) {
    const focusableElements = this.getFocusableElements(element, selector);
    return focusableElements.length > 0 ? focusableElements[0] : null;
  },
  getLastFocusableElement(element, selector) {
    const focusableElements = this.getFocusableElements(element, selector);
    return focusableElements.length > 0 ? focusableElements[focusableElements.length - 1] : null;
  },
  getNextFocusableElement(container, element, selector) {
    const focusableElements = this.getFocusableElements(container, selector);
    const index = focusableElements.length > 0 ? focusableElements.findIndex((el) => el === element) : -1;
    const nextIndex = index > -1 && focusableElements.length >= index + 1 ? index + 1 : -1;
    return nextIndex > -1 ? focusableElements[nextIndex] : null;
  },
  isClickable(element) {
    if (element) {
      const targetNode = element.nodeName;
      const parentNode = element.parentElement && element.parentElement.nodeName;
      return targetNode === "INPUT" || targetNode === "TEXTAREA" || targetNode === "BUTTON" || targetNode === "A" || parentNode === "INPUT" || parentNode === "TEXTAREA" || parentNode === "BUTTON" || parentNode === "A" || !!element.closest(".p-button, .p-checkbox, .p-radiobutton");
    }
    return false;
  },
  applyStyle(element, style) {
    if (typeof style === "string") {
      element.style.cssText = style;
    } else {
      for (let prop in style) {
        element.style[prop] = style[prop];
      }
    }
  },
  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window["MSStream"];
  },
  isAndroid() {
    return /(android)/i.test(navigator.userAgent);
  },
  isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  },
  exportCSV(csv, filename) {
    let blob = new Blob([csv], {
      type: "application/csv;charset=utf-8;"
    });
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, filename + ".csv");
    } else {
      let link = document.createElement("a");
      if (link.download !== void 0) {
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", filename + ".csv");
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        csv = "data:text/csv;charset=utf-8," + csv;
        window.open(encodeURI(csv));
      }
    }
  }
};
class ConnectedOverlayScrollHandler {
  constructor(element, listener = () => {
  }) {
    this.element = element;
    this.listener = listener;
  }
  bindScrollListener() {
    this.scrollableParents = DomHandler.getScrollableParents(this.element);
    for (let i = 0; i < this.scrollableParents.length; i++) {
      this.scrollableParents[i].addEventListener("scroll", this.listener);
    }
  }
  unbindScrollListener() {
    if (this.scrollableParents) {
      for (let i = 0; i < this.scrollableParents.length; i++) {
        this.scrollableParents[i].removeEventListener("scroll", this.listener);
      }
    }
  }
  destroy() {
    this.unbindScrollListener();
    this.element = null;
    this.listener = null;
    this.scrollableParents = null;
  }
}
function primebus() {
  const allHandlers = /* @__PURE__ */ new Map();
  return {
    on(type, handler2) {
      let handlers = allHandlers.get(type);
      if (!handlers)
        handlers = [handler2];
      else
        handlers.push(handler2);
      allHandlers.set(type, handlers);
    },
    off(type, handler2) {
      let handlers = allHandlers.get(type);
      if (handlers) {
        handlers.splice(handlers.indexOf(handler2) >>> 0, 1);
      }
    },
    emit(type, evt) {
      let handlers = allHandlers.get(type);
      if (handlers) {
        handlers.slice().map((handler2) => {
          handler2(evt);
        });
      }
    }
  };
}
var ObjectUtils = {
  equals(obj1, obj2, field) {
    if (field)
      return this.resolveFieldData(obj1, field) === this.resolveFieldData(obj2, field);
    else
      return this.deepEquals(obj1, obj2);
  },
  deepEquals(a, b) {
    if (a === b)
      return true;
    if (a && b && typeof a == "object" && typeof b == "object") {
      var arrA = Array.isArray(a), arrB = Array.isArray(b), i, length, key;
      if (arrA && arrB) {
        length = a.length;
        if (length != b.length)
          return false;
        for (i = length; i-- !== 0; )
          if (!this.deepEquals(a[i], b[i]))
            return false;
        return true;
      }
      if (arrA != arrB)
        return false;
      var dateA = a instanceof Date, dateB = b instanceof Date;
      if (dateA != dateB)
        return false;
      if (dateA && dateB)
        return a.getTime() == b.getTime();
      var regexpA = a instanceof RegExp, regexpB = b instanceof RegExp;
      if (regexpA != regexpB)
        return false;
      if (regexpA && regexpB)
        return a.toString() == b.toString();
      var keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length)
        return false;
      for (i = length; i-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
          return false;
      for (i = length; i-- !== 0; ) {
        key = keys[i];
        if (!this.deepEquals(a[key], b[key]))
          return false;
      }
      return true;
    }
    return a !== a && b !== b;
  },
  resolveFieldData(data, field) {
    if (data && Object.keys(data).length && field) {
      if (this.isFunction(field)) {
        return field(data);
      } else if (field.indexOf(".") === -1) {
        return data[field];
      } else {
        let fields = field.split(".");
        let value = data;
        for (var i = 0, len = fields.length; i < len; ++i) {
          if (value == null) {
            return null;
          }
          value = value[fields[i]];
        }
        return value;
      }
    } else {
      return null;
    }
  },
  isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  },
  getItemValue(obj, ...params) {
    return this.isFunction(obj) ? obj(...params) : obj;
  },
  filter(value, fields, filterValue) {
    var filteredItems = [];
    if (value) {
      for (let item of value) {
        for (let field of fields) {
          if (String(this.resolveFieldData(item, field)).toLowerCase().indexOf(filterValue.toLowerCase()) > -1) {
            filteredItems.push(item);
            break;
          }
        }
      }
    }
    return filteredItems;
  },
  reorderArray(value, from, to) {
    if (value && from !== to) {
      if (to >= value.length) {
        to %= value.length;
        from %= value.length;
      }
      value.splice(to, 0, value.splice(from, 1)[0]);
    }
  },
  findIndexInList(value, list) {
    let index = -1;
    if (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i] === value) {
          index = i;
          break;
        }
      }
    }
    return index;
  },
  contains(value, list) {
    if (value != null && list && list.length) {
      for (let val of list) {
        if (this.equals(value, val))
          return true;
      }
    }
    return false;
  },
  insertIntoOrderedArray(item, index, arr, sourceArr) {
    if (arr.length > 0) {
      let injected = false;
      for (let i = 0; i < arr.length; i++) {
        let currentItemIndex = this.findIndexInList(arr[i], sourceArr);
        if (currentItemIndex > index) {
          arr.splice(i, 0, item);
          injected = true;
          break;
        }
      }
      if (!injected) {
        arr.push(item);
      }
    } else {
      arr.push(item);
    }
  },
  removeAccents(str) {
    if (str && str.search(/[\xC0-\xFF]/g) > -1) {
      str = str.replace(/[\xC0-\xC5]/g, "A").replace(/[\xC6]/g, "AE").replace(/[\xC7]/g, "C").replace(/[\xC8-\xCB]/g, "E").replace(/[\xCC-\xCF]/g, "I").replace(/[\xD0]/g, "D").replace(/[\xD1]/g, "N").replace(/[\xD2-\xD6\xD8]/g, "O").replace(/[\xD9-\xDC]/g, "U").replace(/[\xDD]/g, "Y").replace(/[\xDE]/g, "P").replace(/[\xE0-\xE5]/g, "a").replace(/[\xE6]/g, "ae").replace(/[\xE7]/g, "c").replace(/[\xE8-\xEB]/g, "e").replace(/[\xEC-\xEF]/g, "i").replace(/[\xF1]/g, "n").replace(/[\xF2-\xF6\xF8]/g, "o").replace(/[\xF9-\xFC]/g, "u").replace(/[\xFE]/g, "p").replace(/[\xFD\xFF]/g, "y");
    }
    return str;
  },
  getVNodeProp(vnode, prop) {
    let props = vnode.props;
    if (props) {
      let kebapProp = prop.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      let propName = Object.prototype.hasOwnProperty.call(props, kebapProp) ? kebapProp : prop;
      return vnode.type.props[prop].type === Boolean && props[propName] === "" ? true : props[propName];
    }
    return null;
  },
  convertToFlatCase(str) {
    return this.isNotEmpty(str) ? str.replace(/(-|_)/g, "").toLowerCase() : str;
  },
  isEmpty(value) {
    return value === null || value === void 0 || value === "" || Array.isArray(value) && value.length === 0 || !(value instanceof Date) && typeof value === "object" && Object.keys(value).length === 0;
  },
  isNotEmpty(value) {
    return !this.isEmpty(value);
  },
  isPrintableCharacter(char = "") {
    return this.isNotEmpty(char) && char.length === 1 && char.match(/\S| /);
  },
  /**
   * Firefox-v103 does not currently support the "findLast" method. It is stated that this method will be supported with Firefox-v104.
   * https://caniuse.com/mdn-javascript_builtins_array_findlast
   */
  findLast(arr, callback) {
    let item;
    if (this.isNotEmpty(arr)) {
      try {
        item = arr.findLast(callback);
      } catch {
        item = [...arr].reverse().find(callback);
      }
    }
    return item;
  },
  /**
   * Firefox-v103 does not currently support the "findLastIndex" method. It is stated that this method will be supported with Firefox-v104.
   * https://caniuse.com/mdn-javascript_builtins_array_findlastindex
   */
  findLastIndex(arr, callback) {
    let index = -1;
    if (this.isNotEmpty(arr)) {
      try {
        index = arr.findLastIndex(callback);
      } catch {
        index = arr.lastIndexOf([...arr].reverse().find(callback));
      }
    }
    return index;
  }
};
var lastId = 0;
function UniqueComponentId(prefix = "pv_id_") {
  lastId++;
  return `${prefix}${lastId}`;
}
function handler() {
  let zIndexes = [];
  const generateZIndex = (key, autoZIndex, baseZIndex = 999) => {
    const lastZIndex = getLastZIndex(key, autoZIndex, baseZIndex);
    const newZIndex = lastZIndex.value + (lastZIndex.key === key ? 0 : baseZIndex) + 1;
    zIndexes.push({ key, value: newZIndex });
    return newZIndex;
  };
  const revertZIndex = (zIndex) => {
    zIndexes = zIndexes.filter((obj) => obj.value !== zIndex);
  };
  const getCurrentZIndex = (key, autoZIndex) => {
    return getLastZIndex(key, autoZIndex).value;
  };
  const getLastZIndex = (key, autoZIndex, baseZIndex = 0) => {
    return [...zIndexes].reverse().find((obj) => autoZIndex ? true : obj.key === key) || { key, value: baseZIndex };
  };
  const getZIndex = (el) => {
    return el ? parseInt(el.style.zIndex, 10) || 0 : 0;
  };
  return {
    get: getZIndex,
    set: (key, el, baseZIndex) => {
      if (el) {
        el.style.zIndex = String(generateZIndex(key, true, baseZIndex));
      }
    },
    clear: (el) => {
      if (el) {
        revertZIndex(getZIndex(el));
        el.style.zIndex = "";
      }
    },
    getCurrent: (key) => getCurrentZIndex(key, true)
  };
}
var ZIndexUtils = handler();
const FilterMatchMode = {
  STARTS_WITH: "startsWith",
  CONTAINS: "contains",
  NOT_CONTAINS: "notContains",
  ENDS_WITH: "endsWith",
  EQUALS: "equals",
  NOT_EQUALS: "notEquals",
  IN: "in",
  LESS_THAN: "lt",
  LESS_THAN_OR_EQUAL_TO: "lte",
  GREATER_THAN: "gt",
  GREATER_THAN_OR_EQUAL_TO: "gte",
  BETWEEN: "between",
  DATE_IS: "dateIs",
  DATE_IS_NOT: "dateIsNot",
  DATE_BEFORE: "dateBefore",
  DATE_AFTER: "dateAfter"
};
const FilterOperator = {
  AND: "and",
  OR: "or"
};
const FilterService = {
  filter(value, fields, filterValue, filterMatchMode, filterLocale) {
    let filteredItems = [];
    if (value) {
      for (let item of value) {
        for (let field of fields) {
          let fieldValue = ObjectUtils.resolveFieldData(item, field);
          if (this.filters[filterMatchMode](fieldValue, filterValue, filterLocale)) {
            filteredItems.push(item);
            break;
          }
        }
      }
    }
    return filteredItems;
  },
  filters: {
    startsWith(value, filter2, filterLocale) {
      if (filter2 === void 0 || filter2 === null || filter2.trim() === "") {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      let filterValue = ObjectUtils.removeAccents(filter2.toString()).toLocaleLowerCase(filterLocale);
      let stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.slice(0, filterValue.length) === filterValue;
    },
    contains(value, filter2, filterLocale) {
      if (filter2 === void 0 || filter2 === null || typeof filter2 === "string" && filter2.trim() === "") {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      let filterValue = ObjectUtils.removeAccents(filter2.toString()).toLocaleLowerCase(filterLocale);
      let stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.indexOf(filterValue) !== -1;
    },
    notContains(value, filter2, filterLocale) {
      if (filter2 === void 0 || filter2 === null || typeof filter2 === "string" && filter2.trim() === "") {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      let filterValue = ObjectUtils.removeAccents(filter2.toString()).toLocaleLowerCase(filterLocale);
      let stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.indexOf(filterValue) === -1;
    },
    endsWith(value, filter2, filterLocale) {
      if (filter2 === void 0 || filter2 === null || filter2.trim() === "") {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      let filterValue = ObjectUtils.removeAccents(filter2.toString()).toLocaleLowerCase(filterLocale);
      let stringValue = ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale);
      return stringValue.indexOf(filterValue, stringValue.length - filterValue.length) !== -1;
    },
    equals(value, filter2, filterLocale) {
      if (filter2 === void 0 || filter2 === null || typeof filter2 === "string" && filter2.trim() === "") {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime && filter2.getTime)
        return value.getTime() === filter2.getTime();
      else
        return ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale) == ObjectUtils.removeAccents(filter2.toString()).toLocaleLowerCase(filterLocale);
    },
    notEquals(value, filter2, filterLocale) {
      if (filter2 === void 0 || filter2 === null || typeof filter2 === "string" && filter2.trim() === "") {
        return false;
      }
      if (value === void 0 || value === null) {
        return true;
      }
      if (value.getTime && filter2.getTime)
        return value.getTime() !== filter2.getTime();
      else
        return ObjectUtils.removeAccents(value.toString()).toLocaleLowerCase(filterLocale) != ObjectUtils.removeAccents(filter2.toString()).toLocaleLowerCase(filterLocale);
    },
    in(value, filter2) {
      if (filter2 === void 0 || filter2 === null || filter2.length === 0) {
        return true;
      }
      for (let i = 0; i < filter2.length; i++) {
        if (ObjectUtils.equals(value, filter2[i])) {
          return true;
        }
      }
      return false;
    },
    between(value, filter2) {
      if (filter2 == null || filter2[0] == null || filter2[1] == null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime)
        return filter2[0].getTime() <= value.getTime() && value.getTime() <= filter2[1].getTime();
      else
        return filter2[0] <= value && value <= filter2[1];
    },
    lt(value, filter2) {
      if (filter2 === void 0 || filter2 === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime && filter2.getTime)
        return value.getTime() < filter2.getTime();
      else
        return value < filter2;
    },
    lte(value, filter2) {
      if (filter2 === void 0 || filter2 === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime && filter2.getTime)
        return value.getTime() <= filter2.getTime();
      else
        return value <= filter2;
    },
    gt(value, filter2) {
      if (filter2 === void 0 || filter2 === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime && filter2.getTime)
        return value.getTime() > filter2.getTime();
      else
        return value > filter2;
    },
    gte(value, filter2) {
      if (filter2 === void 0 || filter2 === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      if (value.getTime && filter2.getTime)
        return value.getTime() >= filter2.getTime();
      else
        return value >= filter2;
    },
    dateIs(value, filter2) {
      if (filter2 === void 0 || filter2 === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      return value.toDateString() === filter2.toDateString();
    },
    dateIsNot(value, filter2) {
      if (filter2 === void 0 || filter2 === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      return value.toDateString() !== filter2.toDateString();
    },
    dateBefore(value, filter2) {
      if (filter2 === void 0 || filter2 === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      return value.getTime() < filter2.getTime();
    },
    dateAfter(value, filter2) {
      if (filter2 === void 0 || filter2 === null) {
        return true;
      }
      if (value === void 0 || value === null) {
        return false;
      }
      return value.getTime() > filter2.getTime();
    }
  },
  register(rule, fn) {
    this.filters[rule] = fn;
  }
};
const defaultOptions = {
  ripple: false,
  inputStyle: "outlined",
  locale: {
    startsWith: "Starts with",
    contains: "Contains",
    notContains: "Not contains",
    endsWith: "Ends with",
    equals: "Equals",
    notEquals: "Not equals",
    noFilter: "No Filter",
    lt: "Less than",
    lte: "Less than or equal to",
    gt: "Greater than",
    gte: "Greater than or equal to",
    dateIs: "Date is",
    dateIsNot: "Date is not",
    dateBefore: "Date is before",
    dateAfter: "Date is after",
    clear: "Clear",
    apply: "Apply",
    matchAll: "Match All",
    matchAny: "Match Any",
    addRule: "Add Rule",
    removeRule: "Remove Rule",
    accept: "Yes",
    reject: "No",
    choose: "Choose",
    upload: "Upload",
    cancel: "Cancel",
    completed: "Completed",
    pending: "Pending",
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    chooseYear: "Choose Year",
    chooseMonth: "Choose Month",
    chooseDate: "Choose Date",
    prevDecade: "Previous Decade",
    nextDecade: "Next Decade",
    prevYear: "Previous Year",
    nextYear: "Next Year",
    prevMonth: "Previous Month",
    nextMonth: "Next Month",
    prevHour: "Previous Hour",
    nextHour: "Next Hour",
    prevMinute: "Previous Minute",
    nextMinute: "Next Minute",
    prevSecond: "Previous Second",
    nextSecond: "Next Second",
    am: "am",
    pm: "pm",
    today: "Today",
    weekHeader: "Wk",
    firstDayOfWeek: 0,
    dateFormat: "mm/dd/yy",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    passwordPrompt: "Enter a password",
    emptyFilterMessage: "No results found",
    // @deprecated Use 'emptySearchMessage' option instead.
    searchMessage: "{0} results are available",
    selectionMessage: "{0} items selected",
    emptySelectionMessage: "No selected item",
    emptySearchMessage: "No results found",
    emptyMessage: "No available options",
    aria: {
      trueLabel: "True",
      falseLabel: "False",
      nullLabel: "Not Selected",
      star: "1 star",
      stars: "{star} stars",
      selectAll: "All items selected",
      unselectAll: "All items unselected",
      close: "Close",
      previous: "Previous",
      next: "Next",
      navigation: "Navigation",
      scrollTop: "Scroll Top",
      moveTop: "Move Top",
      moveUp: "Move Up",
      moveDown: "Move Down",
      moveBottom: "Move Bottom",
      moveToTarget: "Move to Target",
      moveToSource: "Move to Source",
      moveAllToTarget: "Move All to Target",
      moveAllToSource: "Move All to Source",
      pageLabel: "{page}",
      firstPageLabel: "First Page",
      lastPageLabel: "Last Page",
      nextPageLabel: "Next Page",
      prevPageLabel: "Previous Page",
      rowsPerPageLabel: "Rows per page",
      jumpToPageDropdownLabel: "Jump to Page Dropdown",
      jumpToPageInputLabel: "Jump to Page Input",
      selectRow: "Row Selected",
      unselectRow: "Row Unselected",
      expandRow: "Row Expanded",
      collapseRow: "Row Collapsed",
      showFilterMenu: "Show Filter Menu",
      hideFilterMenu: "Hide Filter Menu",
      filterOperator: "Filter Operator",
      filterConstraint: "Filter Constraint",
      editRow: "Row Edit",
      saveEdit: "Save Edit",
      cancelEdit: "Cancel Edit",
      listView: "List View",
      gridView: "Grid View",
      slide: "Slide",
      slideNumber: "{slideNumber}",
      zoomImage: "Zoom Image",
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      rotateRight: "Rotate Right",
      rotateLeft: "Rotate Left"
    }
  },
  filterMatchModeOptions: {
    text: [FilterMatchMode.STARTS_WITH, FilterMatchMode.CONTAINS, FilterMatchMode.NOT_CONTAINS, FilterMatchMode.ENDS_WITH, FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS],
    numeric: [FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS, FilterMatchMode.LESS_THAN, FilterMatchMode.LESS_THAN_OR_EQUAL_TO, FilterMatchMode.GREATER_THAN, FilterMatchMode.GREATER_THAN_OR_EQUAL_TO],
    date: [FilterMatchMode.DATE_IS, FilterMatchMode.DATE_IS_NOT, FilterMatchMode.DATE_BEFORE, FilterMatchMode.DATE_AFTER]
  },
  zIndex: {
    modal: 1100,
    overlay: 1e3,
    menu: 1e3,
    tooltip: 1100
  },
  pt: void 0
};
const PrimeVueSymbol = Symbol();
function switchTheme(currentTheme, newTheme, linkElementId, callback) {
  const linkElement = document.getElementById(linkElementId);
  const cloneLinkElement = linkElement.cloneNode(true);
  const newThemeUrl = linkElement.getAttribute("href").replace(currentTheme, newTheme);
  cloneLinkElement.setAttribute("id", linkElementId + "-clone");
  cloneLinkElement.setAttribute("href", newThemeUrl);
  cloneLinkElement.addEventListener("load", () => {
    linkElement.remove();
    cloneLinkElement.setAttribute("id", linkElementId);
    if (callback) {
      callback();
    }
  });
  linkElement.parentNode && linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);
}
var PrimeVue = {
  install: (app, options) => {
    let configOptions = options ? { ...defaultOptions, ...options } : { ...defaultOptions };
    const PrimeVue2 = {
      config: reactive(configOptions),
      changeTheme: switchTheme
    };
    app.config.globalProperties.$primevue = PrimeVue2;
    app.provide(PrimeVueSymbol, PrimeVue2);
  }
};
var script$K = {
  name: "BaseComponent",
  props: {
    pt: {
      type: Object,
      default: void 0
    }
  },
  methods: {
    getOption(obj = {}, key = "") {
      const fKey = ObjectUtils.convertToFlatCase(key);
      return obj[Object.keys(obj).find((k) => ObjectUtils.convertToFlatCase(k) === fKey) || ""];
    },
    getPTValue(obj = {}, key = "", params = {}) {
      const self2 = ObjectUtils.getItemValue(this.getOption(obj, key), params);
      const globalPT = ObjectUtils.getItemValue(this.getOption(this.defaultPT, key), params);
      const merged = mergeProps(self2, globalPT);
      return merged;
    },
    ptm(key = "", params = {}) {
      return this.getPTValue(this.pt, key, { props: this.$props, state: this.$data, ...params });
    },
    ptmo(obj = {}, key = "", params = {}) {
      return this.getPTValue(obj, key, params);
    }
  },
  computed: {
    defaultPT() {
      return ObjectUtils.getItemValue(this.getOption(this.$primevue.config.pt, this.$.type.name), this.defaultsParams);
    },
    defaultsParams() {
      return { instance: this.$ };
    }
  }
};
var script$J = {
  name: "BaseIcon",
  props: {
    label: {
      type: String,
      default: void 0
    },
    spin: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    pti() {
      const isLabelEmpty = ObjectUtils.isEmpty(this.label);
      return {
        class: [
          "p-icon",
          {
            "p-icon-spin": this.spin
          }
        ],
        role: !isLabelEmpty ? "img" : void 0,
        "aria-label": !isLabelEmpty ? this.label : void 0,
        "aria-hidden": isLabelEmpty
      };
    }
  }
};
function styleInject$c(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || typeof document === "undefined") {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$c = "\n.p-icon {\n    display: inline-block;\n}\n.p-icon-spin {\n    -webkit-animation: p-icon-spin 2s infinite linear;\n    animation: p-icon-spin 2s infinite linear;\n}\n@-webkit-keyframes p-icon-spin {\n0% {\n        -webkit-transform: rotate(0deg);\n        transform: rotate(0deg);\n}\n100% {\n        -webkit-transform: rotate(359deg);\n        transform: rotate(359deg);\n}\n}\n@keyframes p-icon-spin {\n0% {\n        -webkit-transform: rotate(0deg);\n        transform: rotate(0deg);\n}\n100% {\n        -webkit-transform: rotate(359deg);\n        transform: rotate(359deg);\n}\n}\n";
styleInject$c(css_248z$c);
var script$I = {
  name: "SpinnerIcon",
  extends: script$J
};
const _hoisted_1$J = /* @__PURE__ */ createBaseVNode("g", { "clip-path": "url(#clip0_417_21408)" }, [
  /* @__PURE__ */ createBaseVNode("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  })
], -1);
const _hoisted_2$v = /* @__PURE__ */ createBaseVNode("defs", null, [
  /* @__PURE__ */ createBaseVNode("clipPath", { id: "clip0_417_21408" }, [
    /* @__PURE__ */ createBaseVNode("rect", {
      width: "14",
      height: "14",
      fill: "white"
    })
  ])
], -1);
const _hoisted_3$n = [
  _hoisted_1$J,
  _hoisted_2$v
];
function render$H(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_3$n, 16);
}
script$I.render = render$H;
let timeout;
function bindEvents(el) {
  el.addEventListener("mousedown", onMouseDown);
}
function unbindEvents(el) {
  el.removeEventListener("mousedown", onMouseDown);
}
function create(el) {
  let ink = document.createElement("span");
  ink.className = "p-ink";
  ink.setAttribute("role", "presentation");
  ink.setAttribute("aria-hidden", "true");
  el.appendChild(ink);
  ink.addEventListener("animationend", onAnimationEnd);
}
function remove(el) {
  let ink = getInk(el);
  if (ink) {
    unbindEvents(el);
    ink.removeEventListener("animationend", onAnimationEnd);
    ink.remove();
  }
}
function onMouseDown(event2) {
  let target = event2.currentTarget;
  let ink = getInk(target);
  if (!ink || getComputedStyle(ink, null).display === "none") {
    return;
  }
  DomHandler.removeClass(ink, "p-ink-active");
  if (!DomHandler.getHeight(ink) && !DomHandler.getWidth(ink)) {
    let d = Math.max(DomHandler.getOuterWidth(target), DomHandler.getOuterHeight(target));
    ink.style.height = d + "px";
    ink.style.width = d + "px";
  }
  let offset = DomHandler.getOffset(target);
  let x = event2.pageX - offset.left + document.body.scrollTop - DomHandler.getWidth(ink) / 2;
  let y = event2.pageY - offset.top + document.body.scrollLeft - DomHandler.getHeight(ink) / 2;
  ink.style.top = y + "px";
  ink.style.left = x + "px";
  DomHandler.addClass(ink, "p-ink-active");
  timeout = setTimeout(() => {
    if (ink) {
      DomHandler.removeClass(ink, "p-ink-active");
    }
  }, 401);
}
function onAnimationEnd(event2) {
  if (timeout) {
    clearTimeout(timeout);
  }
  DomHandler.removeClass(event2.currentTarget, "p-ink-active");
}
function getInk(el) {
  for (let i = 0; i < el.children.length; i++) {
    if (typeof el.children[i].className === "string" && el.children[i].className.indexOf("p-ink") !== -1) {
      return el.children[i];
    }
  }
  return null;
}
const Ripple = {
  mounted(el, binding) {
    if (binding.instance.$primevue && binding.instance.$primevue.config && binding.instance.$primevue.config.ripple) {
      create(el);
      bindEvents(el);
    }
  },
  unmounted(el) {
    remove(el);
  }
};
var script$H = {
  name: "Button",
  extends: script$K,
  props: {
    label: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    iconPos: {
      type: String,
      default: "left"
    },
    iconClass: {
      type: String,
      default: null
    },
    badge: {
      type: String,
      default: null
    },
    badgeClass: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingIcon: {
      type: String,
      default: void 0
    },
    link: {
      type: Boolean,
      default: false
    },
    severity: {
      type: String,
      default: null
    },
    raised: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    text: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: null
    },
    plain: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonClass() {
      return [
        "p-button p-component",
        {
          "p-button-icon-only": this.hasIcon && !this.label,
          "p-button-vertical": (this.iconPos === "top" || this.iconPos === "bottom") && this.label,
          "p-disabled": this.$attrs.disabled || this.loading,
          "p-button-loading": this.loading,
          "p-button-loading-label-only": this.loading && !this.hasIcon && this.label,
          "p-button-link": this.link,
          [`p-button-${this.severity}`]: this.severity,
          "p-button-raised": this.raised,
          "p-button-rounded": this.rounded,
          "p-button-text": this.text,
          "p-button-outlined": this.outlined,
          "p-button-sm": this.size === "small",
          "p-button-lg": this.size === "large",
          "p-button-plain": this.plain
        }
      ];
    },
    iconStyleClass() {
      return [
        "p-button-icon",
        this.iconClass,
        {
          "p-button-icon-left": this.iconPos === "left" && this.label,
          "p-button-icon-right": this.iconPos === "right" && this.label,
          "p-button-icon-top": this.iconPos === "top" && this.label,
          "p-button-icon-bottom": this.iconPos === "bottom" && this.label
        }
      ];
    },
    loadingIconStyleClass() {
      return ["p-button-loading-icon pi-spin", this.iconStyleClass];
    },
    badgeStyleClass() {
      return [
        "p-badge p-component",
        this.badgeClass,
        {
          "p-badge-no-gutter": this.badge && String(this.badge).length === 1
        }
      ];
    },
    disabled() {
      return this.$attrs.disabled || this.loading;
    },
    defaultAriaLabel() {
      return this.label ? this.label + (this.badge ? " " + this.badge : "") : this.$attrs["aria-label"];
    },
    hasIcon() {
      return this.icon || this.$slots.icon;
    }
  },
  components: {
    SpinnerIcon: script$I
  },
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1$I = ["aria-label", "disabled"];
function render$G(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_SpinnerIcon = resolveComponent("SpinnerIcon");
  const _directive_ripple = resolveDirective("ripple");
  return withDirectives((openBlock(), createElementBlock("button", mergeProps({
    class: $options.buttonClass,
    type: "button",
    "aria-label": $options.defaultAriaLabel,
    disabled: $options.disabled
  }, _ctx.ptm("root")), [
    renderSlot(_ctx.$slots, "default", {}, () => [
      $props.loading ? renderSlot(_ctx.$slots, "loadingicon", {
        key: 0,
        class: normalizeClass($options.loadingIconStyleClass)
      }, () => [
        $props.loadingIcon ? (openBlock(), createElementBlock("span", mergeProps({
          key: 0,
          class: [$options.loadingIconStyleClass, $props.loadingIcon]
        }, _ctx.ptm("loadingIcon")), null, 16)) : (openBlock(), createBlock(_component_SpinnerIcon, mergeProps({
          key: 1,
          class: $options.loadingIconStyleClass,
          spin: ""
        }, _ctx.ptm("loadingIcon")), null, 16, ["class"]))
      ]) : renderSlot(_ctx.$slots, "icon", {
        key: 1,
        class: normalizeClass($options.iconStyleClass)
      }, () => [
        $props.icon ? (openBlock(), createElementBlock("span", mergeProps({
          key: 0,
          class: [$options.iconStyleClass, $props.icon]
        }, _ctx.ptm("icon")), null, 16)) : createCommentVNode("", true)
      ]),
      createBaseVNode("span", mergeProps({ class: "p-button-label" }, _ctx.ptm("label")), toDisplayString($props.label || " "), 17),
      $props.badge ? (openBlock(), createElementBlock("span", mergeProps({
        key: 2,
        class: $options.badgeStyleClass
      }, _ctx.ptm("badge")), toDisplayString($props.badge), 17)) : createCommentVNode("", true)
    ])
  ], 16, _hoisted_1$I)), [
    [_directive_ripple]
  ]);
}
script$H.render = render$G;
var script$G = {
  name: "Card",
  extends: script$K
};
function render$F(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", mergeProps({ class: "p-card p-component" }, _ctx.ptm("root")), [
    _ctx.$slots.header ? (openBlock(), createElementBlock("div", mergeProps({
      key: 0,
      class: "p-card-header"
    }, _ctx.ptm("header")), [
      renderSlot(_ctx.$slots, "header")
    ], 16)) : createCommentVNode("", true),
    createBaseVNode("div", mergeProps({ class: "p-card-body" }, _ctx.ptm("body")), [
      _ctx.$slots.title ? (openBlock(), createElementBlock("div", mergeProps({
        key: 0,
        class: "p-card-title"
      }, _ctx.ptm("title")), [
        renderSlot(_ctx.$slots, "title")
      ], 16)) : createCommentVNode("", true),
      _ctx.$slots.subtitle ? (openBlock(), createElementBlock("div", mergeProps({
        key: 1,
        class: "p-card-subtitle"
      }, _ctx.ptm("subtitle")), [
        renderSlot(_ctx.$slots, "subtitle")
      ], 16)) : createCommentVNode("", true),
      createBaseVNode("div", mergeProps({ class: "p-card-content" }, _ctx.ptm("content")), [
        renderSlot(_ctx.$slots, "content")
      ], 16),
      _ctx.$slots.footer ? (openBlock(), createElementBlock("div", mergeProps({
        key: 2,
        class: "p-card-footer"
      }, _ctx.ptm("footer")), [
        renderSlot(_ctx.$slots, "footer")
      ], 16)) : createCommentVNode("", true)
    ], 16)
  ], 16);
}
script$G.render = render$F;
var script$F = {
  name: "Column",
  extends: script$K,
  props: {
    columnKey: {
      type: null,
      default: null
    },
    field: {
      type: [String, Function],
      default: null
    },
    sortField: {
      type: [String, Function],
      default: null
    },
    filterField: {
      type: [String, Function],
      default: null
    },
    dataType: {
      type: String,
      default: "text"
    },
    sortable: {
      type: Boolean,
      default: false
    },
    header: {
      type: null,
      default: null
    },
    footer: {
      type: null,
      default: null
    },
    style: {
      type: null,
      default: null
    },
    class: {
      type: String,
      default: null
    },
    headerStyle: {
      type: null,
      default: null
    },
    headerClass: {
      type: String,
      default: null
    },
    bodyStyle: {
      type: null,
      default: null
    },
    bodyClass: {
      type: String,
      default: null
    },
    footerStyle: {
      type: null,
      default: null
    },
    footerClass: {
      type: String,
      default: null
    },
    showFilterMenu: {
      type: Boolean,
      default: true
    },
    showFilterOperator: {
      type: Boolean,
      default: true
    },
    showClearButton: {
      type: Boolean,
      default: true
    },
    showApplyButton: {
      type: Boolean,
      default: true
    },
    showFilterMatchModes: {
      type: Boolean,
      default: true
    },
    showAddButton: {
      type: Boolean,
      default: true
    },
    filterMatchModeOptions: {
      type: Array,
      default: null
    },
    maxConstraints: {
      type: Number,
      default: 2
    },
    excludeGlobalFilter: {
      type: Boolean,
      default: false
    },
    filterHeaderClass: {
      type: String,
      default: null
    },
    filterHeaderStyle: {
      type: null,
      default: null
    },
    filterMenuClass: {
      type: String,
      default: null
    },
    filterMenuStyle: {
      type: null,
      default: null
    },
    selectionMode: {
      type: String,
      default: null
    },
    expander: {
      type: Boolean,
      default: false
    },
    colspan: {
      type: Number,
      default: null
    },
    rowspan: {
      type: Number,
      default: null
    },
    rowReorder: {
      type: Boolean,
      default: false
    },
    rowReorderIcon: {
      type: String,
      default: void 0
    },
    reorderableColumn: {
      type: Boolean,
      default: true
    },
    rowEditor: {
      type: Boolean,
      default: false
    },
    frozen: {
      type: Boolean,
      default: false
    },
    alignFrozen: {
      type: String,
      default: "left"
    },
    exportable: {
      type: Boolean,
      default: true
    },
    exportHeader: {
      type: String,
      default: null
    },
    exportFooter: {
      type: String,
      default: null
    },
    filterMatchMode: {
      type: String,
      default: null
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  render() {
    return null;
  }
};
var script$E = {
  name: "ArrowDownIcon",
  extends: script$J
};
const _hoisted_1$H = /* @__PURE__ */ createBaseVNode("g", { "clip-path": "url(#clip0_326_12468)" }, [
  /* @__PURE__ */ createBaseVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M6.99994 14C6.91097 14.0004 6.82281 13.983 6.74064 13.9489C6.65843 13.9148 6.58387 13.8646 6.52133 13.8013L1.10198 8.38193C0.982318 8.25351 0.917175 8.08367 0.920272 7.90817C0.923368 7.73267 0.994462 7.56523 1.11858 7.44111C1.24269 7.317 1.41014 7.2459 1.58563 7.2428C1.76113 7.23971 1.93098 7.30485 2.0594 7.42451L6.32263 11.6877V0.677419C6.32263 0.497756 6.394 0.325452 6.52104 0.198411C6.64808 0.0713706 6.82039 0 7.00005 0C7.17971 0 7.35202 0.0713706 7.47906 0.198411C7.6061 0.325452 7.67747 0.497756 7.67747 0.677419V11.6877L11.9407 7.42451C12.0691 7.30485 12.2389 7.23971 12.4144 7.2428C12.5899 7.2459 12.7574 7.317 12.8815 7.44111C13.0056 7.56523 13.0767 7.73267 13.0798 7.90817C13.0829 8.08367 13.0178 8.25351 12.8981 8.38193L7.47875 13.8013C7.41621 13.8646 7.34164 13.9148 7.25944 13.9489C7.17727 13.983 7.08912 14.0004 7.00015 14C7.00012 14 7.00009 14 7.00005 14C7.00001 14 6.99998 14 6.99994 14Z",
    fill: "currentColor"
  })
], -1);
const _hoisted_2$u = /* @__PURE__ */ createBaseVNode("defs", null, [
  /* @__PURE__ */ createBaseVNode("clipPath", { id: "clip0_326_12468" }, [
    /* @__PURE__ */ createBaseVNode("rect", {
      width: "14",
      height: "14",
      fill: "white"
    })
  ])
], -1);
const _hoisted_3$m = [
  _hoisted_1$H,
  _hoisted_2$u
];
function render$E(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_3$m, 16);
}
script$E.render = render$E;
var script$D = {
  name: "ArrowUpIcon",
  extends: script$J
};
const _hoisted_1$G = /* @__PURE__ */ createBaseVNode("g", { "clip-path": "url(#clip0_326_12509)" }, [
  /* @__PURE__ */ createBaseVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M6.51551 13.799C6.64205 13.9255 6.813 13.9977 6.99193 14C7.17087 13.9977 7.34182 13.9255 7.46835 13.799C7.59489 13.6725 7.66701 13.5015 7.66935 13.3226V2.31233L11.9326 6.57554C11.9951 6.63887 12.0697 6.68907 12.1519 6.72319C12.2341 6.75731 12.3223 6.77467 12.4113 6.77425C12.5003 6.77467 12.5885 6.75731 12.6707 6.72319C12.7529 6.68907 12.8274 6.63887 12.89 6.57554C13.0168 6.44853 13.0881 6.27635 13.0881 6.09683C13.0881 5.91732 13.0168 5.74514 12.89 5.61812L7.48846 0.216594C7.48274 0.210436 7.4769 0.204374 7.47094 0.198411C7.3439 0.0713707 7.1716 0 6.99193 0C6.81227 0 6.63997 0.0713707 6.51293 0.198411C6.50704 0.204296 6.50128 0.210278 6.49563 0.216354L1.09386 5.61812C0.974201 5.74654 0.909057 5.91639 0.912154 6.09189C0.91525 6.26738 0.986345 6.43483 1.11046 6.55894C1.23457 6.68306 1.40202 6.75415 1.57752 6.75725C1.75302 6.76035 1.92286 6.6952 2.05128 6.57554L6.31451 2.31231V13.3226C6.31685 13.5015 6.38898 13.6725 6.51551 13.799Z",
    fill: "currentColor"
  })
], -1);
const _hoisted_2$t = /* @__PURE__ */ createBaseVNode("defs", null, [
  /* @__PURE__ */ createBaseVNode("clipPath", { id: "clip0_326_12509" }, [
    /* @__PURE__ */ createBaseVNode("rect", {
      width: "14",
      height: "14",
      fill: "white"
    })
  ])
], -1);
const _hoisted_3$l = [
  _hoisted_1$G,
  _hoisted_2$t
];
function render$D(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_3$l, 16);
}
script$D.render = render$D;
var script$C = {
  name: "AngleDoubleLeftIcon",
  extends: script$J
};
const _hoisted_1$F = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M5.71602 11.164C5.80782 11.2021 5.9063 11.2215 6.00569 11.221C6.20216 11.2301 6.39427 11.1612 6.54025 11.0294C6.68191 10.8875 6.76148 10.6953 6.76148 10.4948C6.76148 10.2943 6.68191 10.1021 6.54025 9.96024L3.51441 6.9344L6.54025 3.90855C6.624 3.76126 6.65587 3.59011 6.63076 3.42254C6.60564 3.25498 6.525 3.10069 6.40175 2.98442C6.2785 2.86815 6.11978 2.79662 5.95104 2.7813C5.78229 2.76598 5.61329 2.80776 5.47112 2.89994L1.97123 6.39983C1.82957 6.54167 1.75 6.73393 1.75 6.9344C1.75 7.13486 1.82957 7.32712 1.97123 7.46896L5.47112 10.9991C5.54096 11.0698 5.62422 11.1259 5.71602 11.164ZM11.0488 10.9689C11.1775 11.1156 11.3585 11.2061 11.5531 11.221C11.7477 11.2061 11.9288 11.1156 12.0574 10.9689C12.1815 10.8302 12.25 10.6506 12.25 10.4645C12.25 10.2785 12.1815 10.0989 12.0574 9.96024L9.03158 6.93439L12.0574 3.90855C12.1248 3.76739 12.1468 3.60881 12.1204 3.45463C12.0939 3.30045 12.0203 3.15826 11.9097 3.04765C11.7991 2.93703 11.6569 2.86343 11.5027 2.83698C11.3486 2.81053 11.19 2.83252 11.0488 2.89994L7.51865 6.36957C7.37699 6.51141 7.29742 6.70367 7.29742 6.90414C7.29742 7.1046 7.37699 7.29686 7.51865 7.4387L11.0488 10.9689Z",
  fill: "currentColor"
}, null, -1);
const _hoisted_2$s = [
  _hoisted_1$F
];
function render$C(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$s, 16);
}
script$C.render = render$C;
var script$B = {
  name: "ChevronDownIcon",
  extends: script$J
};
const _hoisted_1$E = /* @__PURE__ */ createBaseVNode("path", {
  d: "M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z",
  fill: "currentColor"
}, null, -1);
const _hoisted_2$r = [
  _hoisted_1$E
];
function render$B(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$r, 16);
}
script$B.render = render$B;
var script$A = {
  name: "FilterIcon",
  extends: script$J
};
const _hoisted_1$D = /* @__PURE__ */ createBaseVNode("g", { "clip-path": "url(#clip0_390_17708)" }, [
  /* @__PURE__ */ createBaseVNode("path", {
    d: "M8.64708 14H5.35296C5.18981 13.9979 5.03395 13.9321 4.91858 13.8167C4.8032 13.7014 4.73745 13.5455 4.73531 13.3824V7L0.329431 0.98C0.259794 0.889466 0.217389 0.780968 0.20718 0.667208C0.19697 0.553448 0.219379 0.439133 0.271783 0.337647C0.324282 0.236453 0.403423 0.151519 0.500663 0.0920138C0.597903 0.0325088 0.709548 0.000692754 0.823548 0H13.1765C13.2905 0.000692754 13.4021 0.0325088 13.4994 0.0920138C13.5966 0.151519 13.6758 0.236453 13.7283 0.337647C13.7807 0.439133 13.8031 0.553448 13.7929 0.667208C13.7826 0.780968 13.7402 0.889466 13.6706 0.98L9.26472 7V13.3824C9.26259 13.5455 9.19683 13.7014 9.08146 13.8167C8.96609 13.9321 8.81022 13.9979 8.64708 14ZM5.97061 12.7647H8.02943V6.79412C8.02878 6.66289 8.07229 6.53527 8.15296 6.43177L11.9412 1.23529H2.05884L5.86355 6.43177C5.94422 6.53527 5.98773 6.66289 5.98708 6.79412L5.97061 12.7647Z",
    fill: "currentColor"
  })
], -1);
const _hoisted_2$q = /* @__PURE__ */ createBaseVNode("defs", null, [
  /* @__PURE__ */ createBaseVNode("clipPath", { id: "clip0_390_17708" }, [
    /* @__PURE__ */ createBaseVNode("rect", {
      width: "14",
      height: "14",
      fill: "white"
    })
  ])
], -1);
const _hoisted_3$k = [
  _hoisted_1$D,
  _hoisted_2$q
];
function render$A(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_3$k, 16);
}
script$A.render = render$A;
var script$z = {
  name: "TimesIcon",
  extends: script$J
};
const _hoisted_1$C = /* @__PURE__ */ createBaseVNode("path", {
  d: "M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z",
  fill: "currentColor"
}, null, -1);
const _hoisted_2$p = [
  _hoisted_1$C
];
function render$z(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$p, 16);
}
script$z.render = render$z;
var OverlayEventBus = primebus();
var script$y = {
  name: "Portal",
  props: {
    appendTo: {
      type: String,
      default: "body"
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mounted: false
    };
  },
  mounted() {
    this.mounted = DomHandler.isClient();
  },
  computed: {
    inline() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function render$y(_ctx, _cache, $props, $setup, $data, $options) {
  return $options.inline ? renderSlot(_ctx.$slots, "default", { key: 0 }) : $data.mounted ? (openBlock(), createBlock(Teleport, {
    key: 1,
    to: $props.appendTo
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 8, ["to"])) : createCommentVNode("", true);
}
script$y.render = render$y;
var script$x = {
  name: "VirtualScroller",
  extends: script$K,
  emits: ["update:numToleratedItems", "scroll", "scroll-index-change", "lazy-load"],
  props: {
    id: {
      type: String,
      default: null
    },
    style: null,
    class: null,
    items: {
      type: Array,
      default: null
    },
    itemSize: {
      type: [Number, Array],
      default: 0
    },
    scrollHeight: null,
    scrollWidth: null,
    orientation: {
      type: String,
      default: "vertical"
    },
    numToleratedItems: {
      type: Number,
      default: null
    },
    delay: {
      type: Number,
      default: 0
    },
    resizeDelay: {
      type: Number,
      default: 10
    },
    lazy: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loaderDisabled: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    showSpacer: {
      type: Boolean,
      default: true
    },
    showLoader: {
      type: Boolean,
      default: false
    },
    tabindex: {
      type: Number,
      default: 0
    },
    inline: {
      type: Boolean,
      default: false
    },
    step: {
      type: Number,
      default: 0
    },
    appendOnly: {
      type: Boolean,
      default: false
    },
    autoSize: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      first: this.isBoth() ? { rows: 0, cols: 0 } : 0,
      last: this.isBoth() ? { rows: 0, cols: 0 } : 0,
      page: this.isBoth() ? { rows: 0, cols: 0 } : 0,
      numItemsInViewport: this.isBoth() ? { rows: 0, cols: 0 } : 0,
      lastScrollPos: this.isBoth() ? { top: 0, left: 0 } : 0,
      d_numToleratedItems: this.numToleratedItems,
      d_loading: this.loading,
      loaderArr: [],
      spacerStyle: {},
      contentStyle: {}
    };
  },
  element: null,
  content: null,
  lastScrollPos: null,
  scrollTimeout: null,
  resizeTimeout: null,
  defaultWidth: 0,
  defaultHeight: 0,
  defaultContentWidth: 0,
  defaultContentHeight: 0,
  isRangeChanged: false,
  lazyLoadState: {},
  resizeListener: null,
  initialized: false,
  watch: {
    numToleratedItems(newValue) {
      this.d_numToleratedItems = newValue;
    },
    loading(newValue) {
      this.d_loading = newValue;
    },
    items(newValue, oldValue) {
      if (!oldValue || oldValue.length !== (newValue || []).length) {
        this.init();
        this.calculateAutoSize();
      }
    },
    itemSize() {
      this.init();
      this.calculateAutoSize();
    },
    orientation() {
      this.lastScrollPos = this.isBoth() ? { top: 0, left: 0 } : 0;
    },
    scrollHeight() {
      this.init();
      this.calculateAutoSize();
    },
    scrollWidth() {
      this.init();
      this.calculateAutoSize();
    }
  },
  mounted() {
    this.viewInit();
    this.lastScrollPos = this.isBoth() ? { top: 0, left: 0 } : 0;
    this.lazyLoadState = this.lazyLoadState || {};
  },
  updated() {
    !this.initialized && this.viewInit();
  },
  unmounted() {
    this.unbindResizeListener();
    this.initialized = false;
  },
  methods: {
    viewInit() {
      if (DomHandler.isVisible(this.element)) {
        this.setContentEl(this.content);
        this.init();
        this.bindResizeListener();
        this.defaultWidth = DomHandler.getWidth(this.element);
        this.defaultHeight = DomHandler.getHeight(this.element);
        this.defaultContentWidth = DomHandler.getWidth(this.content);
        this.defaultContentHeight = DomHandler.getHeight(this.content);
        this.initialized = true;
      }
    },
    init() {
      if (!this.disabled) {
        this.setSize();
        this.calculateOptions();
        this.setSpacerSize();
      }
    },
    isVertical() {
      return this.orientation === "vertical";
    },
    isHorizontal() {
      return this.orientation === "horizontal";
    },
    isBoth() {
      return this.orientation === "both";
    },
    scrollTo(options) {
      this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0;
      this.element && this.element.scrollTo(options);
    },
    scrollToIndex(index, behavior = "auto") {
      const both = this.isBoth();
      const horizontal = this.isHorizontal();
      const first = this.first;
      const { numToleratedItems } = this.calculateNumItems();
      const contentPos = this.getContentPosition();
      const itemSize = this.itemSize;
      const calculateFirst = (_index = 0, _numT) => _index <= _numT ? 0 : _index;
      const calculateCoord = (_first, _size, _cpos) => _first * _size + _cpos;
      const scrollTo = (left = 0, top = 0) => this.scrollTo({ left, top, behavior });
      let newFirst = both ? { rows: 0, cols: 0 } : 0;
      let isRangeChanged = false;
      if (both) {
        newFirst = { rows: calculateFirst(index[0], numToleratedItems[0]), cols: calculateFirst(index[1], numToleratedItems[1]) };
        scrollTo(calculateCoord(newFirst.cols, itemSize[1], contentPos.left), calculateCoord(newFirst.rows, itemSize[0], contentPos.top));
        isRangeChanged = newFirst.rows !== first.rows || newFirst.cols !== first.cols;
      } else {
        newFirst = calculateFirst(index, numToleratedItems);
        horizontal ? scrollTo(calculateCoord(newFirst, itemSize, contentPos.left), 0) : scrollTo(0, calculateCoord(newFirst, itemSize, contentPos.top));
        isRangeChanged = newFirst !== first;
      }
      this.isRangeChanged = isRangeChanged;
      this.first = newFirst;
    },
    scrollInView(index, to, behavior = "auto") {
      if (to) {
        const both = this.isBoth();
        const horizontal = this.isHorizontal();
        const { first, viewport } = this.getRenderedRange();
        const scrollTo = (left = 0, top = 0) => this.scrollTo({ left, top, behavior });
        const isToStart = to === "to-start";
        const isToEnd = to === "to-end";
        if (isToStart) {
          if (both) {
            if (viewport.first.rows - first.rows > index[0]) {
              scrollTo(viewport.first.cols * this.itemSize[1], (viewport.first.rows - 1) * this.itemSize[0]);
            } else if (viewport.first.cols - first.cols > index[1]) {
              scrollTo((viewport.first.cols - 1) * this.itemSize[1], viewport.first.rows * this.itemSize[0]);
            }
          } else {
            if (viewport.first - first > index) {
              const pos = (viewport.first - 1) * this.itemSize;
              horizontal ? scrollTo(pos, 0) : scrollTo(0, pos);
            }
          }
        } else if (isToEnd) {
          if (both) {
            if (viewport.last.rows - first.rows <= index[0] + 1) {
              scrollTo(viewport.first.cols * this.itemSize[1], (viewport.first.rows + 1) * this.itemSize[0]);
            } else if (viewport.last.cols - first.cols <= index[1] + 1) {
              scrollTo((viewport.first.cols + 1) * this.itemSize[1], viewport.first.rows * this.itemSize[0]);
            }
          } else {
            if (viewport.last - first <= index + 1) {
              const pos = (viewport.first + 1) * this.itemSize;
              horizontal ? scrollTo(pos, 0) : scrollTo(0, pos);
            }
          }
        }
      } else {
        this.scrollToIndex(index, behavior);
      }
    },
    getRenderedRange() {
      const calculateFirstInViewport = (_pos, _size) => Math.floor(_pos / (_size || _pos));
      let firstInViewport = this.first;
      let lastInViewport = 0;
      if (this.element) {
        const both = this.isBoth();
        const horizontal = this.isHorizontal();
        const { scrollTop, scrollLeft } = this.element.scrollTop;
        if (both) {
          firstInViewport = { rows: calculateFirstInViewport(scrollTop, this.itemSize[0]), cols: calculateFirstInViewport(scrollLeft, this.itemSize[1]) };
          lastInViewport = { rows: firstInViewport.rows + this.numItemsInViewport.rows, cols: firstInViewport.cols + this.numItemsInViewport.cols };
        } else {
          const scrollPos = horizontal ? scrollLeft : scrollTop;
          firstInViewport = calculateFirstInViewport(scrollPos, this.itemSize);
          lastInViewport = firstInViewport + this.numItemsInViewport;
        }
      }
      return {
        first: this.first,
        last: this.last,
        viewport: {
          first: firstInViewport,
          last: lastInViewport
        }
      };
    },
    calculateNumItems() {
      const both = this.isBoth();
      const horizontal = this.isHorizontal();
      const itemSize = this.itemSize;
      const contentPos = this.getContentPosition();
      const contentWidth = this.element ? this.element.offsetWidth - contentPos.left : 0;
      const contentHeight = this.element ? this.element.offsetHeight - contentPos.top : 0;
      const calculateNumItemsInViewport = (_contentSize, _itemSize) => Math.ceil(_contentSize / (_itemSize || _contentSize));
      const calculateNumToleratedItems = (_numItems) => Math.ceil(_numItems / 2);
      const numItemsInViewport = both ? { rows: calculateNumItemsInViewport(contentHeight, itemSize[0]), cols: calculateNumItemsInViewport(contentWidth, itemSize[1]) } : calculateNumItemsInViewport(horizontal ? contentWidth : contentHeight, itemSize);
      const numToleratedItems = this.d_numToleratedItems || (both ? [calculateNumToleratedItems(numItemsInViewport.rows), calculateNumToleratedItems(numItemsInViewport.cols)] : calculateNumToleratedItems(numItemsInViewport));
      return { numItemsInViewport, numToleratedItems };
    },
    calculateOptions() {
      const both = this.isBoth();
      const first = this.first;
      const { numItemsInViewport, numToleratedItems } = this.calculateNumItems();
      const calculateLast = (_first, _num, _numT, _isCols = false) => this.getLast(_first + _num + (_first < _numT ? 2 : 3) * _numT, _isCols);
      const last = both ? { rows: calculateLast(first.rows, numItemsInViewport.rows, numToleratedItems[0]), cols: calculateLast(first.cols, numItemsInViewport.cols, numToleratedItems[1], true) } : calculateLast(first, numItemsInViewport, numToleratedItems);
      this.last = last;
      this.numItemsInViewport = numItemsInViewport;
      this.d_numToleratedItems = numToleratedItems;
      this.$emit("update:numToleratedItems", this.d_numToleratedItems);
      if (this.showLoader) {
        this.loaderArr = both ? Array.from({ length: numItemsInViewport.rows }).map(() => Array.from({ length: numItemsInViewport.cols })) : Array.from({ length: numItemsInViewport });
      }
      if (this.lazy) {
        Promise.resolve().then(() => {
          this.lazyLoadState = {
            first: this.step ? both ? { rows: 0, cols: first.cols } : 0 : first,
            last: Math.min(this.step ? this.step : last, this.items.length)
          };
          this.$emit("lazy-load", this.lazyLoadState);
        });
      }
    },
    calculateAutoSize() {
      if (this.autoSize && !this.d_loading) {
        Promise.resolve().then(() => {
          if (this.content) {
            const both = this.isBoth();
            const horizontal = this.isHorizontal();
            const vertical = this.isVertical();
            this.content.style.minHeight = this.content.style.minWidth = "auto";
            this.content.style.position = "relative";
            this.element.style.contain = "none";
            const [contentWidth, contentHeight] = [DomHandler.getWidth(this.content), DomHandler.getHeight(this.content)];
            contentWidth !== this.defaultContentWidth && (this.element.style.width = "");
            contentHeight !== this.defaultContentHeight && (this.element.style.height = "");
            const [width, height] = [DomHandler.getWidth(this.element), DomHandler.getHeight(this.element)];
            (both || horizontal) && (this.element.style.width = width < this.defaultWidth ? width + "px" : this.scrollWidth || this.defaultWidth + "px");
            (both || vertical) && (this.element.style.height = height < this.defaultHeight ? height + "px" : this.scrollHeight || this.defaultHeight + "px");
            this.content.style.minHeight = this.content.style.minWidth = "";
            this.content.style.position = "";
            this.element.style.contain = "";
          }
        });
      }
    },
    getLast(last = 0, isCols) {
      return this.items ? Math.min(isCols ? (this.columns || this.items[0]).length : this.items.length, last) : 0;
    },
    getContentPosition() {
      if (this.content) {
        const style = getComputedStyle(this.content);
        const left = parseFloat(style.paddingLeft) + Math.max(parseFloat(style.left) || 0, 0);
        const right = parseFloat(style.paddingRight) + Math.max(parseFloat(style.right) || 0, 0);
        const top = parseFloat(style.paddingTop) + Math.max(parseFloat(style.top) || 0, 0);
        const bottom = parseFloat(style.paddingBottom) + Math.max(parseFloat(style.bottom) || 0, 0);
        return { left, right, top, bottom, x: left + right, y: top + bottom };
      }
      return { left: 0, right: 0, top: 0, bottom: 0, x: 0, y: 0 };
    },
    setSize() {
      if (this.element) {
        const both = this.isBoth();
        const horizontal = this.isHorizontal();
        const parentElement = this.element.parentElement;
        const width = this.scrollWidth || `${this.element.offsetWidth || parentElement.offsetWidth}px`;
        const height = this.scrollHeight || `${this.element.offsetHeight || parentElement.offsetHeight}px`;
        const setProp = (_name, _value) => this.element.style[_name] = _value;
        if (both || horizontal) {
          setProp("height", height);
          setProp("width", width);
        } else {
          setProp("height", height);
        }
      }
    },
    setSpacerSize() {
      const items = this.items;
      if (items) {
        const both = this.isBoth();
        const horizontal = this.isHorizontal();
        const contentPos = this.getContentPosition();
        const setProp = (_name, _value, _size, _cpos = 0) => this.spacerStyle = { ...this.spacerStyle, ...{ [`${_name}`]: (_value || []).length * _size + _cpos + "px" } };
        if (both) {
          setProp("height", items, this.itemSize[0], contentPos.y);
          setProp("width", this.columns || items[1], this.itemSize[1], contentPos.x);
        } else {
          horizontal ? setProp("width", this.columns || items, this.itemSize, contentPos.x) : setProp("height", items, this.itemSize, contentPos.y);
        }
      }
    },
    setContentPosition(pos) {
      if (this.content && !this.appendOnly) {
        const both = this.isBoth();
        const horizontal = this.isHorizontal();
        const first = pos ? pos.first : this.first;
        const calculateTranslateVal = (_first, _size) => _first * _size;
        const setTransform = (_x = 0, _y = 0) => this.contentStyle = { ...this.contentStyle, ...{ transform: `translate3d(${_x}px, ${_y}px, 0)` } };
        if (both) {
          setTransform(calculateTranslateVal(first.cols, this.itemSize[1]), calculateTranslateVal(first.rows, this.itemSize[0]));
        } else {
          const translateVal = calculateTranslateVal(first, this.itemSize);
          horizontal ? setTransform(translateVal, 0) : setTransform(0, translateVal);
        }
      }
    },
    onScrollPositionChange(event2) {
      const target = event2.target;
      const both = this.isBoth();
      const horizontal = this.isHorizontal();
      const contentPos = this.getContentPosition();
      const calculateScrollPos = (_pos, _cpos) => _pos ? _pos > _cpos ? _pos - _cpos : _pos : 0;
      const calculateCurrentIndex = (_pos, _size) => Math.floor(_pos / (_size || _pos));
      const calculateTriggerIndex = (_currentIndex, _first, _last, _num, _numT, _isScrollDownOrRight) => {
        return _currentIndex <= _numT ? _numT : _isScrollDownOrRight ? _last - _num - _numT : _first + _numT - 1;
      };
      const calculateFirst = (_currentIndex, _triggerIndex, _first, _last, _num, _numT, _isScrollDownOrRight) => {
        if (_currentIndex <= _numT)
          return 0;
        else
          return Math.max(0, _isScrollDownOrRight ? _currentIndex < _triggerIndex ? _first : _currentIndex - _numT : _currentIndex > _triggerIndex ? _first : _currentIndex - 2 * _numT);
      };
      const calculateLast = (_currentIndex, _first, _last, _num, _numT, _isCols) => {
        let lastValue = _first + _num + 2 * _numT;
        if (_currentIndex >= _numT) {
          lastValue += _numT + 1;
        }
        return this.getLast(lastValue, _isCols);
      };
      const scrollTop = calculateScrollPos(target.scrollTop, contentPos.top);
      const scrollLeft = calculateScrollPos(target.scrollLeft, contentPos.left);
      let newFirst = both ? { rows: 0, cols: 0 } : 0;
      let newLast = this.last;
      let isRangeChanged = false;
      let newScrollPos = this.lastScrollPos;
      if (both) {
        const isScrollDown = this.lastScrollPos.top <= scrollTop;
        const isScrollRight = this.lastScrollPos.left <= scrollLeft;
        if (!this.appendOnly || this.appendOnly && (isScrollDown || isScrollRight)) {
          const currentIndex = { rows: calculateCurrentIndex(scrollTop, this.itemSize[0]), cols: calculateCurrentIndex(scrollLeft, this.itemSize[1]) };
          const triggerIndex = {
            rows: calculateTriggerIndex(currentIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
            cols: calculateTriggerIndex(currentIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
          };
          newFirst = {
            rows: calculateFirst(currentIndex.rows, triggerIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
            cols: calculateFirst(currentIndex.cols, triggerIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
          };
          newLast = {
            rows: calculateLast(currentIndex.rows, newFirst.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0]),
            cols: calculateLast(currentIndex.cols, newFirst.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], true)
          };
          isRangeChanged = newFirst.rows !== this.first.rows || newLast.rows !== this.last.rows || newFirst.cols !== this.first.cols || newLast.cols !== this.last.cols || this.isRangeChanged;
          newScrollPos = { top: scrollTop, left: scrollLeft };
        }
      } else {
        const scrollPos = horizontal ? scrollLeft : scrollTop;
        const isScrollDownOrRight = this.lastScrollPos <= scrollPos;
        if (!this.appendOnly || this.appendOnly && isScrollDownOrRight) {
          const currentIndex = calculateCurrentIndex(scrollPos, this.itemSize);
          const triggerIndex = calculateTriggerIndex(currentIndex, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);
          newFirst = calculateFirst(currentIndex, triggerIndex, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);
          newLast = calculateLast(currentIndex, newFirst, this.last, this.numItemsInViewport, this.d_numToleratedItems);
          isRangeChanged = newFirst !== this.first || newLast !== this.last || this.isRangeChanged;
          newScrollPos = scrollPos;
        }
      }
      return {
        first: newFirst,
        last: newLast,
        isRangeChanged,
        scrollPos: newScrollPos
      };
    },
    onScrollChange(event2) {
      const { first, last, isRangeChanged, scrollPos } = this.onScrollPositionChange(event2);
      if (isRangeChanged) {
        const newState = { first, last };
        this.setContentPosition(newState);
        this.first = first;
        this.last = last;
        this.lastScrollPos = scrollPos;
        this.$emit("scroll-index-change", newState);
        if (this.lazy && this.isPageChanged(first)) {
          const lazyLoadState = {
            first: this.step ? Math.min(this.getPageByFirst(first) * this.step, this.items.length - this.step) : first,
            last: Math.min(this.step ? (this.getPageByFirst(first) + 1) * this.step : last, this.items.length)
          };
          const isLazyStateChanged = this.lazyLoadState.first !== lazyLoadState.first || this.lazyLoadState.last !== lazyLoadState.last;
          isLazyStateChanged && this.$emit("lazy-load", lazyLoadState);
          this.lazyLoadState = lazyLoadState;
        }
      }
    },
    onScroll(event2) {
      this.$emit("scroll", event2);
      if (this.delay && this.isPageChanged()) {
        if (this.scrollTimeout) {
          clearTimeout(this.scrollTimeout);
        }
        if (!this.d_loading && this.showLoader) {
          const { isRangeChanged } = this.onScrollPositionChange(event2);
          const changed = isRangeChanged || (this.step ? this.isPageChanged() : false);
          changed && (this.d_loading = true);
        }
        this.scrollTimeout = setTimeout(() => {
          this.onScrollChange(event2);
          if (this.d_loading && this.showLoader && (!this.lazy || this.loading === void 0)) {
            this.d_loading = false;
            this.page = this.getPageByFirst();
          }
        }, this.delay);
      } else {
        this.onScrollChange(event2);
      }
    },
    onResize() {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      this.resizeTimeout = setTimeout(() => {
        if (DomHandler.isVisible(this.element)) {
          const both = this.isBoth();
          const vertical = this.isVertical();
          const horizontal = this.isHorizontal();
          const [width, height] = [DomHandler.getWidth(this.element), DomHandler.getHeight(this.element)];
          const [isDiffWidth, isDiffHeight] = [width !== this.defaultWidth, height !== this.defaultHeight];
          const reinit = both ? isDiffWidth || isDiffHeight : horizontal ? isDiffWidth : vertical ? isDiffHeight : false;
          if (reinit) {
            this.d_numToleratedItems = this.numToleratedItems;
            this.defaultWidth = width;
            this.defaultHeight = height;
            this.defaultContentWidth = DomHandler.getWidth(this.content);
            this.defaultContentHeight = DomHandler.getHeight(this.content);
            this.init();
          }
        }
      }, this.resizeDelay);
    },
    bindResizeListener() {
      if (!this.resizeListener) {
        this.resizeListener = this.onResize.bind(this);
        window.addEventListener("resize", this.resizeListener);
        window.addEventListener("orientationchange", this.resizeListener);
      }
    },
    unbindResizeListener() {
      if (this.resizeListener) {
        window.removeEventListener("resize", this.resizeListener);
        window.removeEventListener("orientationchange", this.resizeListener);
        this.resizeListener = null;
      }
    },
    getOptions(renderedIndex) {
      const count = (this.items || []).length;
      const index = this.isBoth() ? this.first.rows + renderedIndex : this.first + renderedIndex;
      return {
        index,
        count,
        first: index === 0,
        last: index === count - 1,
        even: index % 2 === 0,
        odd: index % 2 !== 0
      };
    },
    getLoaderOptions(index, extOptions) {
      let count = this.loaderArr.length;
      return {
        index,
        count,
        first: index === 0,
        last: index === count - 1,
        even: index % 2 === 0,
        odd: index % 2 !== 0,
        ...extOptions
      };
    },
    getPageByFirst(first) {
      return Math.floor(((first ?? this.first) + this.d_numToleratedItems * 4) / (this.step || 1));
    },
    isPageChanged(first) {
      return this.step ? this.page !== this.getPageByFirst(first ?? this.first) : true;
    },
    setContentEl(el) {
      this.content = el || this.content || DomHandler.findSingle(this.element, ".p-virtualscroller-content");
    },
    elementRef(el) {
      this.element = el;
    },
    contentRef(el) {
      this.content = el;
    }
  },
  computed: {
    containerClass() {
      return [
        "p-virtualscroller",
        {
          "p-virtualscroller-inline": this.inline,
          "p-virtualscroller-both p-both-scroll": this.isBoth(),
          "p-virtualscroller-horizontal p-horizontal-scroll": this.isHorizontal()
        },
        this.class
      ];
    },
    contentClass() {
      return [
        "p-virtualscroller-content",
        {
          "p-virtualscroller-loading": this.d_loading
        }
      ];
    },
    loaderClass() {
      return [
        "p-virtualscroller-loader",
        {
          "p-component-overlay": !this.$slots.loader
        }
      ];
    },
    loadedItems() {
      if (this.items && !this.d_loading) {
        if (this.isBoth())
          return this.items.slice(this.appendOnly ? 0 : this.first.rows, this.last.rows).map((item) => this.columns ? item : item.slice(this.appendOnly ? 0 : this.first.cols, this.last.cols));
        else if (this.isHorizontal() && this.columns)
          return this.items;
        else
          return this.items.slice(this.appendOnly ? 0 : this.first, this.last);
      }
      return [];
    },
    loadedRows() {
      return this.d_loading ? this.loaderDisabled ? this.loaderArr : [] : this.loadedItems;
    },
    loadedColumns() {
      if (this.columns) {
        const both = this.isBoth();
        const horizontal = this.isHorizontal();
        if (both || horizontal) {
          return this.d_loading && this.loaderDisabled ? both ? this.loaderArr[0] : this.loaderArr : this.columns.slice(both ? this.first.cols : this.first, both ? this.last.cols : this.last);
        }
      }
      return this.columns;
    }
  },
  components: {
    SpinnerIcon: script$I
  }
};
const _hoisted_1$B = ["tabindex"];
function render$x(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_SpinnerIcon = resolveComponent("SpinnerIcon");
  return !$props.disabled ? (openBlock(), createElementBlock("div", mergeProps({
    key: 0,
    ref: $options.elementRef,
    class: $options.containerClass,
    tabindex: $props.tabindex,
    style: $props.style,
    onScroll: _cache[0] || (_cache[0] = (...args) => $options.onScroll && $options.onScroll(...args))
  }, _ctx.ptm("root")), [
    renderSlot(_ctx.$slots, "content", {
      styleClass: $options.contentClass,
      items: $options.loadedItems,
      getItemOptions: $options.getOptions,
      loading: $data.d_loading,
      getLoaderOptions: $options.getLoaderOptions,
      itemSize: $props.itemSize,
      rows: $options.loadedRows,
      columns: $options.loadedColumns,
      contentRef: $options.contentRef,
      spacerStyle: $data.spacerStyle,
      contentStyle: $data.contentStyle,
      vertical: $options.isVertical(),
      horizontal: $options.isHorizontal(),
      both: $options.isBoth()
    }, () => [
      createBaseVNode("div", mergeProps({
        ref: $options.contentRef,
        class: $options.contentClass,
        style: $data.contentStyle
      }, _ctx.ptm("content")), [
        (openBlock(true), createElementBlock(Fragment, null, renderList($options.loadedItems, (item, index) => {
          return renderSlot(_ctx.$slots, "item", {
            key: index,
            item,
            options: $options.getOptions(index)
          });
        }), 128))
      ], 16)
    ]),
    $props.showSpacer ? (openBlock(), createElementBlock("div", mergeProps({
      key: 0,
      class: "p-virtualscroller-spacer",
      style: $data.spacerStyle
    }, _ctx.ptm("spacer")), null, 16)) : createCommentVNode("", true),
    !$props.loaderDisabled && $props.showLoader && $data.d_loading ? (openBlock(), createElementBlock("div", mergeProps({
      key: 1,
      class: $options.loaderClass
    }, _ctx.ptm("loader")), [
      _ctx.$slots && _ctx.$slots.loader ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList($data.loaderArr, (_, index) => {
        return renderSlot(_ctx.$slots, "loader", {
          key: index,
          options: $options.getLoaderOptions(index, $options.isBoth() && { numCols: _ctx.d_numItemsInViewport.cols })
        });
      }), 128)) : createCommentVNode("", true),
      renderSlot(_ctx.$slots, "loadingicon", {}, () => [
        createVNode(_component_SpinnerIcon, mergeProps({
          spin: "",
          class: "p-virtualscroller-loading-icon"
        }, _ctx.ptm("loadingIcon")), null, 16)
      ])
    ], 16)) : createCommentVNode("", true)
  ], 16, _hoisted_1$B)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
    renderSlot(_ctx.$slots, "default"),
    renderSlot(_ctx.$slots, "content", {
      items: $props.items,
      rows: $props.items,
      columns: $options.loadedColumns
    })
  ], 64));
}
function styleInject$b(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || typeof document === "undefined") {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$b = "\n.p-virtualscroller {\n    position: relative;\n    overflow: auto;\n    contain: strict;\n    transform: translateZ(0);\n    will-change: scroll-position;\n    outline: 0 none;\n}\n.p-virtualscroller-content {\n    position: absolute;\n    top: 0;\n    left: 0;\n    /* contain: content; */\n    min-height: 100%;\n    min-width: 100%;\n    will-change: transform;\n}\n.p-virtualscroller-spacer {\n    position: absolute;\n    top: 0;\n    left: 0;\n    height: 1px;\n    width: 1px;\n    transform-origin: 0 0;\n    pointer-events: none;\n}\n.p-virtualscroller .p-virtualscroller-loader {\n    position: sticky;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n}\n.p-virtualscroller-loader.p-component-overlay {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n.p-virtualscroller-loading-icon {\n    font-size: 2rem;\n}\n.p-virtualscroller-loading-icon.p-icon {\n    width: 2rem;\n    height: 2rem;\n}\n.p-virtualscroller-horizontal > .p-virtualscroller-content {\n    display: flex;\n}\n\n/* Inline */\n.p-virtualscroller-inline .p-virtualscroller-content {\n    position: static;\n}\n";
styleInject$b(css_248z$b);
script$x.render = render$x;
var script$w = {
  name: "Dropdown",
  extends: script$K,
  emits: ["update:modelValue", "change", "focus", "blur", "before-show", "before-hide", "show", "hide", "filter"],
  props: {
    modelValue: null,
    options: Array,
    optionLabel: null,
    optionValue: null,
    optionDisabled: null,
    optionGroupLabel: null,
    optionGroupChildren: null,
    scrollHeight: {
      type: String,
      default: "200px"
    },
    filter: Boolean,
    filterPlaceholder: String,
    filterLocale: String,
    filterMatchMode: {
      type: String,
      default: "contains"
    },
    filterFields: {
      type: Array,
      default: null
    },
    editable: Boolean,
    placeholder: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    dataKey: null,
    showClear: {
      type: Boolean,
      default: false
    },
    inputId: {
      type: String,
      default: null
    },
    inputClass: {
      type: [String, Object],
      default: null
    },
    inputStyle: {
      type: Object,
      default: null
    },
    inputProps: {
      type: null,
      default: null
    },
    panelClass: {
      type: [String, Object],
      default: null
    },
    panelStyle: {
      type: Object,
      default: null
    },
    panelProps: {
      type: null,
      default: null
    },
    filterInputProps: {
      type: null,
      default: null
    },
    clearIconProps: {
      type: null,
      default: null
    },
    appendTo: {
      type: String,
      default: "body"
    },
    loading: {
      type: Boolean,
      default: false
    },
    clearIcon: {
      type: String,
      default: void 0
    },
    dropdownIcon: {
      type: String,
      default: void 0
    },
    filterIcon: {
      type: String,
      default: void 0
    },
    loadingIcon: {
      type: String,
      default: void 0
    },
    resetFilterOnHide: {
      type: Boolean,
      default: false
    },
    virtualScrollerOptions: {
      type: Object,
      default: null
    },
    autoOptionFocus: {
      type: Boolean,
      default: true
    },
    autoFilterFocus: {
      type: Boolean,
      default: false
    },
    selectOnFocus: {
      type: Boolean,
      default: false
    },
    filterMessage: {
      type: String,
      default: null
    },
    selectionMessage: {
      type: String,
      default: null
    },
    emptySelectionMessage: {
      type: String,
      default: null
    },
    emptyFilterMessage: {
      type: String,
      default: null
    },
    emptyMessage: {
      type: String,
      default: null
    },
    tabindex: {
      type: Number,
      default: 0
    },
    "aria-label": {
      type: String,
      default: null
    },
    "aria-labelledby": {
      type: String,
      default: null
    }
  },
  outsideClickListener: null,
  scrollHandler: null,
  resizeListener: null,
  overlay: null,
  list: null,
  virtualScroller: null,
  searchTimeout: null,
  searchValue: null,
  isModelValueChanged: false,
  focusOnHover: false,
  data() {
    return {
      id: this.$attrs.id,
      focused: false,
      focusedOptionIndex: -1,
      filterValue: null,
      overlayVisible: false
    };
  },
  watch: {
    "$attrs.id": function(newValue) {
      this.id = newValue || UniqueComponentId();
    },
    modelValue() {
      this.isModelValueChanged = true;
    },
    options() {
      this.autoUpdateModel();
    }
  },
  mounted() {
    this.id = this.id || UniqueComponentId();
    this.autoUpdateModel();
  },
  updated() {
    if (this.overlayVisible && this.isModelValueChanged) {
      this.scrollInView(this.findSelectedOptionIndex());
    }
    this.isModelValueChanged = false;
  },
  beforeUnmount() {
    this.unbindOutsideClickListener();
    this.unbindResizeListener();
    if (this.scrollHandler) {
      this.scrollHandler.destroy();
      this.scrollHandler = null;
    }
    if (this.overlay) {
      ZIndexUtils.clear(this.overlay);
      this.overlay = null;
    }
  },
  methods: {
    getOptionIndex(index, fn) {
      return this.virtualScrollerDisabled ? index : fn && fn(index)["index"];
    },
    getOptionLabel(option) {
      return this.optionLabel ? ObjectUtils.resolveFieldData(option, this.optionLabel) : option;
    },
    getOptionValue(option) {
      return this.optionValue ? ObjectUtils.resolveFieldData(option, this.optionValue) : option;
    },
    getOptionRenderKey(option, index) {
      return (this.dataKey ? ObjectUtils.resolveFieldData(option, this.dataKey) : this.getOptionLabel(option)) + "_" + index;
    },
    getPTOptions(option, itemOptions, index, key) {
      return this.ptm(key, {
        context: {
          selected: this.isSelected(option),
          focused: this.focusedOptionIndex === this.getOptionIndex(index, itemOptions),
          disabled: this.isOptionDisabled(option)
        }
      });
    },
    isOptionDisabled(option) {
      return this.optionDisabled ? ObjectUtils.resolveFieldData(option, this.optionDisabled) : false;
    },
    isOptionGroup(option) {
      return this.optionGroupLabel && option.optionGroup && option.group;
    },
    getOptionGroupLabel(optionGroup) {
      return ObjectUtils.resolveFieldData(optionGroup, this.optionGroupLabel);
    },
    getOptionGroupChildren(optionGroup) {
      return ObjectUtils.resolveFieldData(optionGroup, this.optionGroupChildren);
    },
    getAriaPosInset(index) {
      return (this.optionGroupLabel ? index - this.visibleOptions.slice(0, index).filter((option) => this.isOptionGroup(option)).length : index) + 1;
    },
    show(isFocus) {
      this.$emit("before-show");
      this.overlayVisible = true;
      this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : -1;
      isFocus && DomHandler.focus(this.$refs.focusInput);
    },
    hide(isFocus) {
      const _hide = () => {
        this.$emit("before-hide");
        this.overlayVisible = false;
        this.focusedOptionIndex = -1;
        this.searchValue = "";
        this.resetFilterOnHide && (this.filterValue = null);
        isFocus && DomHandler.focus(this.$refs.focusInput);
      };
      setTimeout(() => {
        _hide();
      }, 0);
    },
    onFocus(event2) {
      if (this.disabled) {
        return;
      }
      this.focused = true;
      this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.overlayVisible && this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : -1;
      this.overlayVisible && this.scrollInView(this.focusedOptionIndex);
      this.$emit("focus", event2);
    },
    onBlur(event2) {
      this.focused = false;
      this.focusedOptionIndex = -1;
      this.searchValue = "";
      this.$emit("blur", event2);
    },
    onKeyDown(event2) {
      if (this.disabled) {
        event2.preventDefault();
        return;
      }
      const metaKey = event2.metaKey || event2.ctrlKey;
      switch (event2.code) {
        case "ArrowDown":
          this.onArrowDownKey(event2);
          break;
        case "ArrowUp":
          this.onArrowUpKey(event2, this.editable);
          break;
        case "ArrowLeft":
        case "ArrowRight":
          this.onArrowLeftKey(event2, this.editable);
          break;
        case "Home":
          this.onHomeKey(event2, this.editable);
          break;
        case "End":
          this.onEndKey(event2, this.editable);
          break;
        case "PageDown":
          this.onPageDownKey(event2);
          break;
        case "PageUp":
          this.onPageUpKey(event2);
          break;
        case "Space":
          this.onSpaceKey(event2, this.editable);
          break;
        case "Enter":
        case "NumpadEnter":
          this.onEnterKey(event2);
          break;
        case "Escape":
          this.onEscapeKey(event2);
          break;
        case "Tab":
          this.onTabKey(event2);
          break;
        case "Backspace":
          this.onBackspaceKey(event2, this.editable);
          break;
        case "ShiftLeft":
        case "ShiftRight":
          break;
        default:
          if (!metaKey && ObjectUtils.isPrintableCharacter(event2.key)) {
            !this.overlayVisible && this.show();
            !this.editable && this.searchOptions(event2, event2.key);
          }
          break;
      }
    },
    onEditableInput(event2) {
      const value = event2.target.value;
      this.searchValue = "";
      const matched = this.searchOptions(event2, value);
      !matched && (this.focusedOptionIndex = -1);
      this.updateModel(event2, value);
    },
    onContainerClick(event2) {
      if (this.disabled || this.loading) {
        return;
      }
      if (DomHandler.hasClass(event2.target, "p-dropdown-clear-icon") || event2.target.tagName === "INPUT") {
        return;
      } else if (!this.overlay || !this.overlay.contains(event2.target)) {
        this.overlayVisible ? this.hide(true) : this.show(true);
      }
    },
    onClearClick(event2) {
      this.updateModel(event2, null);
    },
    onFirstHiddenFocus(event2) {
      const focusableEl = event2.relatedTarget === this.$refs.focusInput ? DomHandler.getFirstFocusableElement(this.overlay, ":not(.p-hidden-focusable)") : this.$refs.focusInput;
      DomHandler.focus(focusableEl);
    },
    onLastHiddenFocus(event2) {
      const focusableEl = event2.relatedTarget === this.$refs.focusInput ? DomHandler.getLastFocusableElement(this.overlay, ":not(.p-hidden-focusable)") : this.$refs.focusInput;
      DomHandler.focus(focusableEl);
    },
    onOptionSelect(event2, option, isHide = true) {
      const value = this.getOptionValue(option);
      this.updateModel(event2, value);
      isHide && this.hide(true);
    },
    onOptionMouseMove(event2, index) {
      if (this.focusOnHover) {
        this.changeFocusedOptionIndex(event2, index);
      }
    },
    onFilterChange(event2) {
      const value = event2.target.value;
      this.filterValue = value;
      this.focusedOptionIndex = -1;
      this.$emit("filter", { originalEvent: event2, value });
      !this.virtualScrollerDisabled && this.virtualScroller.scrollToIndex(0);
    },
    onFilterKeyDown(event2) {
      switch (event2.code) {
        case "ArrowDown":
          this.onArrowDownKey(event2);
          break;
        case "ArrowUp":
          this.onArrowUpKey(event2, true);
          break;
        case "ArrowLeft":
        case "ArrowRight":
          this.onArrowLeftKey(event2, true);
          break;
        case "Home":
          this.onHomeKey(event2, true);
          break;
        case "End":
          this.onEndKey(event2, true);
          break;
        case "Enter":
          this.onEnterKey(event2);
          break;
        case "Escape":
          this.onEscapeKey(event2);
          break;
        case "Tab":
          this.onTabKey(event2, true);
          break;
      }
    },
    onFilterBlur() {
      this.focusedOptionIndex = -1;
    },
    onFilterUpdated() {
      if (this.overlayVisible) {
        this.alignOverlay();
      }
    },
    onOverlayClick(event2) {
      OverlayEventBus.emit("overlay-click", {
        originalEvent: event2,
        target: this.$el
      });
    },
    onOverlayKeyDown(event2) {
      switch (event2.code) {
        case "Escape":
          this.onEscapeKey(event2);
          break;
      }
    },
    onArrowDownKey(event2) {
      const optionIndex = this.focusedOptionIndex !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex) : this.findFirstFocusedOptionIndex();
      this.changeFocusedOptionIndex(event2, optionIndex);
      !this.overlayVisible && this.show();
      event2.preventDefault();
    },
    onArrowUpKey(event2, pressedInInputText = false) {
      if (event2.altKey && !pressedInInputText) {
        if (this.focusedOptionIndex !== -1) {
          this.onOptionSelect(event2, this.visibleOptions[this.focusedOptionIndex]);
        }
        this.overlayVisible && this.hide();
        event2.preventDefault();
      } else {
        const optionIndex = this.focusedOptionIndex !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex) : this.findLastFocusedOptionIndex();
        this.changeFocusedOptionIndex(event2, optionIndex);
        !this.overlayVisible && this.show();
        event2.preventDefault();
      }
    },
    onArrowLeftKey(event2, pressedInInputText = false) {
      pressedInInputText && (this.focusedOptionIndex = -1);
    },
    onHomeKey(event2, pressedInInputText = false) {
      if (pressedInInputText) {
        event2.currentTarget.setSelectionRange(0, 0);
        this.focusedOptionIndex = -1;
      } else {
        this.changeFocusedOptionIndex(event2, this.findFirstOptionIndex());
        !this.overlayVisible && this.show();
      }
      event2.preventDefault();
    },
    onEndKey(event2, pressedInInputText = false) {
      if (pressedInInputText) {
        const target = event2.currentTarget;
        const len = target.value.length;
        target.setSelectionRange(len, len);
        this.focusedOptionIndex = -1;
      } else {
        this.changeFocusedOptionIndex(event2, this.findLastOptionIndex());
        !this.overlayVisible && this.show();
      }
      event2.preventDefault();
    },
    onPageUpKey(event2) {
      this.scrollInView(0);
      event2.preventDefault();
    },
    onPageDownKey(event2) {
      this.scrollInView(this.visibleOptions.length - 1);
      event2.preventDefault();
    },
    onEnterKey(event2) {
      if (!this.overlayVisible) {
        this.onArrowDownKey(event2);
      } else {
        if (this.focusedOptionIndex !== -1) {
          this.onOptionSelect(event2, this.visibleOptions[this.focusedOptionIndex]);
        }
        this.hide();
      }
      event2.preventDefault();
    },
    onSpaceKey(event2, pressedInInputText = false) {
      !pressedInInputText && this.onEnterKey(event2);
    },
    onEscapeKey(event2) {
      this.overlayVisible && this.hide(true);
      event2.preventDefault();
    },
    onTabKey(event2, pressedInInputText = false) {
      if (!pressedInInputText) {
        if (this.overlayVisible && this.hasFocusableElements()) {
          DomHandler.focus(this.$refs.firstHiddenFocusableElementOnOverlay);
          event2.preventDefault();
        } else {
          if (this.focusedOptionIndex !== -1) {
            this.onOptionSelect(event2, this.visibleOptions[this.focusedOptionIndex]);
          }
          this.overlayVisible && this.hide(this.filter);
        }
      }
    },
    onBackspaceKey(event2, pressedInInputText = false) {
      if (pressedInInputText) {
        !this.overlayVisible && this.show();
      }
    },
    onOverlayEnter(el) {
      ZIndexUtils.set("overlay", el, this.$primevue.config.zIndex.overlay);
      this.alignOverlay();
      this.scrollInView();
      this.autoFilterFocus && DomHandler.focus(this.$refs.filterInput);
    },
    onOverlayAfterEnter() {
      this.bindOutsideClickListener();
      this.bindScrollListener();
      this.bindResizeListener();
      this.$emit("show");
    },
    onOverlayLeave() {
      this.unbindOutsideClickListener();
      this.unbindScrollListener();
      this.unbindResizeListener();
      this.$emit("hide");
      this.overlay = null;
    },
    onOverlayAfterLeave(el) {
      ZIndexUtils.clear(el);
    },
    alignOverlay() {
      if (this.appendTo === "self") {
        DomHandler.relativePosition(this.overlay, this.$el);
      } else {
        this.overlay.style.minWidth = DomHandler.getOuterWidth(this.$el) + "px";
        DomHandler.absolutePosition(this.overlay, this.$el);
      }
    },
    bindOutsideClickListener() {
      if (!this.outsideClickListener) {
        this.outsideClickListener = (event2) => {
          if (this.overlayVisible && this.overlay && !this.$el.contains(event2.target) && !this.overlay.contains(event2.target)) {
            this.hide();
          }
        };
        document.addEventListener("click", this.outsideClickListener);
      }
    },
    unbindOutsideClickListener() {
      if (this.outsideClickListener) {
        document.removeEventListener("click", this.outsideClickListener);
        this.outsideClickListener = null;
      }
    },
    bindScrollListener() {
      if (!this.scrollHandler) {
        this.scrollHandler = new ConnectedOverlayScrollHandler(this.$refs.container, () => {
          if (this.overlayVisible) {
            this.hide();
          }
        });
      }
      this.scrollHandler.bindScrollListener();
    },
    unbindScrollListener() {
      if (this.scrollHandler) {
        this.scrollHandler.unbindScrollListener();
      }
    },
    bindResizeListener() {
      if (!this.resizeListener) {
        this.resizeListener = () => {
          if (this.overlayVisible && !DomHandler.isTouchDevice()) {
            this.hide();
          }
        };
        window.addEventListener("resize", this.resizeListener);
      }
    },
    unbindResizeListener() {
      if (this.resizeListener) {
        window.removeEventListener("resize", this.resizeListener);
        this.resizeListener = null;
      }
    },
    hasFocusableElements() {
      return DomHandler.getFocusableElements(this.overlay, ":not(.p-hidden-focusable)").length > 0;
    },
    isOptionMatched(option) {
      return this.isValidOption(option) && this.getOptionLabel(option).toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue.toLocaleLowerCase(this.filterLocale));
    },
    isValidOption(option) {
      return option && !(this.isOptionDisabled(option) || this.isOptionGroup(option));
    },
    isValidSelectedOption(option) {
      return this.isValidOption(option) && this.isSelected(option);
    },
    isSelected(option) {
      return this.isValidOption(option) && ObjectUtils.equals(this.modelValue, this.getOptionValue(option), this.equalityKey);
    },
    findFirstOptionIndex() {
      return this.visibleOptions.findIndex((option) => this.isValidOption(option));
    },
    findLastOptionIndex() {
      return ObjectUtils.findLastIndex(this.visibleOptions, (option) => this.isValidOption(option));
    },
    findNextOptionIndex(index) {
      const matchedOptionIndex = index < this.visibleOptions.length - 1 ? this.visibleOptions.slice(index + 1).findIndex((option) => this.isValidOption(option)) : -1;
      return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : index;
    },
    findPrevOptionIndex(index) {
      const matchedOptionIndex = index > 0 ? ObjectUtils.findLastIndex(this.visibleOptions.slice(0, index), (option) => this.isValidOption(option)) : -1;
      return matchedOptionIndex > -1 ? matchedOptionIndex : index;
    },
    findSelectedOptionIndex() {
      return this.hasSelectedOption ? this.visibleOptions.findIndex((option) => this.isValidSelectedOption(option)) : -1;
    },
    findFirstFocusedOptionIndex() {
      const selectedIndex = this.findSelectedOptionIndex();
      return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
    },
    findLastFocusedOptionIndex() {
      const selectedIndex = this.findSelectedOptionIndex();
      return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
    },
    searchOptions(event2, char) {
      this.searchValue = (this.searchValue || "") + char;
      let optionIndex = -1;
      let matched = false;
      if (this.focusedOptionIndex !== -1) {
        optionIndex = this.visibleOptions.slice(this.focusedOptionIndex).findIndex((option) => this.isOptionMatched(option));
        optionIndex = optionIndex === -1 ? this.visibleOptions.slice(0, this.focusedOptionIndex).findIndex((option) => this.isOptionMatched(option)) : optionIndex + this.focusedOptionIndex;
      } else {
        optionIndex = this.visibleOptions.findIndex((option) => this.isOptionMatched(option));
      }
      if (optionIndex !== -1) {
        matched = true;
      }
      if (optionIndex === -1 && this.focusedOptionIndex === -1) {
        optionIndex = this.findFirstFocusedOptionIndex();
      }
      if (optionIndex !== -1) {
        this.changeFocusedOptionIndex(event2, optionIndex);
      }
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.searchValue = "";
        this.searchTimeout = null;
      }, 500);
      return matched;
    },
    changeFocusedOptionIndex(event2, index) {
      if (this.focusedOptionIndex !== index) {
        this.focusedOptionIndex = index;
        this.scrollInView();
        if (this.selectOnFocus) {
          this.onOptionSelect(event2, this.visibleOptions[index], false);
        }
      }
    },
    scrollInView(index = -1) {
      const id = index !== -1 ? `${this.id}_${index}` : this.focusedOptionId;
      const element = DomHandler.findSingle(this.list, `li[id="${id}"]`);
      if (element) {
        element.scrollIntoView && element.scrollIntoView({ block: "nearest", inline: "start" });
      } else if (!this.virtualScrollerDisabled) {
        setTimeout(() => {
          this.virtualScroller && this.virtualScroller.scrollToIndex(index !== -1 ? index : this.focusedOptionIndex);
        }, 0);
      }
    },
    autoUpdateModel() {
      if (this.selectOnFocus && this.autoOptionFocus && !this.hasSelectedOption) {
        this.focusedOptionIndex = this.findFirstFocusedOptionIndex();
        this.onOptionSelect(null, this.visibleOptions[this.focusedOptionIndex], false);
      }
    },
    updateModel(event2, value) {
      this.$emit("update:modelValue", value);
      this.$emit("change", { originalEvent: event2, value });
    },
    flatOptions(options) {
      return (options || []).reduce((result, option, index) => {
        result.push({ optionGroup: option, group: true, index });
        const optionGroupChildren = this.getOptionGroupChildren(option);
        optionGroupChildren && optionGroupChildren.forEach((o) => result.push(o));
        return result;
      }, []);
    },
    overlayRef(el) {
      this.overlay = el;
    },
    listRef(el, contentRef) {
      this.list = el;
      contentRef && contentRef(el);
    },
    virtualScrollerRef(el) {
      this.virtualScroller = el;
    }
  },
  computed: {
    containerClass() {
      return [
        "p-dropdown p-component p-inputwrapper",
        {
          "p-disabled": this.disabled,
          "p-dropdown-clearable": this.showClear && !this.disabled,
          "p-focus": this.focused,
          "p-inputwrapper-filled": this.hasSelectedOption,
          "p-inputwrapper-focus": this.focused || this.overlayVisible,
          "p-overlay-open": this.overlayVisible
        }
      ];
    },
    inputStyleClass() {
      return [
        "p-dropdown-label p-inputtext",
        this.inputClass,
        {
          "p-placeholder": !this.editable && this.label === this.placeholder,
          "p-dropdown-label-empty": !this.editable && !this.$slots["value"] && (this.label === "p-emptylabel" || this.label.length === 0)
        }
      ];
    },
    panelStyleClass() {
      return [
        "p-dropdown-panel p-component",
        this.panelClass,
        {
          "p-input-filled": this.$primevue.config.inputStyle === "filled",
          "p-ripple-disabled": this.$primevue.config.ripple === false
        }
      ];
    },
    visibleOptions() {
      const options = this.optionGroupLabel ? this.flatOptions(this.options) : this.options || [];
      if (this.filterValue) {
        const filteredOptions = FilterService.filter(options, this.searchFields, this.filterValue, this.filterMatchMode, this.filterLocale);
        if (this.optionGroupLabel) {
          const optionGroups = this.options || [];
          const filtered = [];
          optionGroups.forEach((group) => {
            const groupChildren = this.getOptionGroupChildren(group);
            const filteredItems = groupChildren.filter((item) => filteredOptions.includes(item));
            if (filteredItems.length > 0)
              filtered.push({ ...group, [typeof this.optionGroupChildren === "string" ? this.optionGroupChildren : "items"]: [...filteredItems] });
          });
          return this.flatOptions(filtered);
        }
        return filteredOptions;
      }
      return options;
    },
    hasSelectedOption() {
      return ObjectUtils.isNotEmpty(this.modelValue);
    },
    label() {
      const selectedOptionIndex = this.findSelectedOptionIndex();
      return selectedOptionIndex !== -1 ? this.getOptionLabel(this.visibleOptions[selectedOptionIndex]) : this.placeholder || "p-emptylabel";
    },
    editableInputValue() {
      const selectedOptionIndex = this.findSelectedOptionIndex();
      return selectedOptionIndex !== -1 ? this.getOptionLabel(this.visibleOptions[selectedOptionIndex]) : this.modelValue || "";
    },
    equalityKey() {
      return this.optionValue ? null : this.dataKey;
    },
    searchFields() {
      return this.filterFields || [this.optionLabel];
    },
    filterResultMessageText() {
      return ObjectUtils.isNotEmpty(this.visibleOptions) ? this.filterMessageText.replaceAll("{0}", this.visibleOptions.length) : this.emptyFilterMessageText;
    },
    filterMessageText() {
      return this.filterMessage || this.$primevue.config.locale.searchMessage || "";
    },
    emptyFilterMessageText() {
      return this.emptyFilterMessage || this.$primevue.config.locale.emptySearchMessage || this.$primevue.config.locale.emptyFilterMessage || "";
    },
    emptyMessageText() {
      return this.emptyMessage || this.$primevue.config.locale.emptyMessage || "";
    },
    selectionMessageText() {
      return this.selectionMessage || this.$primevue.config.locale.selectionMessage || "";
    },
    emptySelectionMessageText() {
      return this.emptySelectionMessage || this.$primevue.config.locale.emptySelectionMessage || "";
    },
    selectedMessageText() {
      return this.hasSelectedOption ? this.selectionMessageText.replaceAll("{0}", "1") : this.emptySelectionMessageText;
    },
    focusedOptionId() {
      return this.focusedOptionIndex !== -1 ? `${this.id}_${this.focusedOptionIndex}` : null;
    },
    ariaSetSize() {
      return this.visibleOptions.filter((option) => !this.isOptionGroup(option)).length;
    },
    virtualScrollerDisabled() {
      return !this.virtualScrollerOptions;
    }
  },
  directives: {
    ripple: Ripple
  },
  components: {
    VirtualScroller: script$x,
    Portal: script$y,
    TimesIcon: script$z,
    ChevronDownIcon: script$B,
    SpinnerIcon: script$I,
    FilterIcon: script$A
  }
};
const _hoisted_1$A = ["id"];
const _hoisted_2$o = ["id", "value", "placeholder", "tabindex", "disabled", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant"];
const _hoisted_3$j = ["id", "tabindex", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant", "aria-disabled"];
const _hoisted_4$5 = ["value", "placeholder", "aria-owns", "aria-activedescendant"];
const _hoisted_5$4 = ["id"];
const _hoisted_6$2 = ["id"];
const _hoisted_7$2 = ["id", "aria-label", "aria-selected", "aria-disabled", "aria-setsize", "aria-posinset", "onClick", "onMousemove"];
function render$w(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_SpinnerIcon = resolveComponent("SpinnerIcon");
  const _component_VirtualScroller = resolveComponent("VirtualScroller");
  const _component_Portal = resolveComponent("Portal");
  const _directive_ripple = resolveDirective("ripple");
  return openBlock(), createElementBlock("div", mergeProps({
    ref: "container",
    id: $data.id,
    class: $options.containerClass,
    onClick: _cache[15] || (_cache[15] = (...args) => $options.onContainerClick && $options.onContainerClick(...args))
  }, _ctx.ptm("root")), [
    $props.editable ? (openBlock(), createElementBlock("input", mergeProps({
      key: 0,
      ref: "focusInput",
      id: $props.inputId,
      type: "text",
      style: $props.inputStyle,
      class: $options.inputStyleClass,
      value: $options.editableInputValue,
      placeholder: $props.placeholder,
      tabindex: !$props.disabled ? $props.tabindex : -1,
      disabled: $props.disabled,
      autocomplete: "off",
      role: "combobox",
      "aria-label": _ctx.ariaLabel,
      "aria-labelledby": _ctx.ariaLabelledby,
      "aria-haspopup": "listbox",
      "aria-expanded": $data.overlayVisible,
      "aria-controls": $data.id + "_list",
      "aria-activedescendant": $data.focused ? $options.focusedOptionId : void 0,
      onFocus: _cache[0] || (_cache[0] = (...args) => $options.onFocus && $options.onFocus(...args)),
      onBlur: _cache[1] || (_cache[1] = (...args) => $options.onBlur && $options.onBlur(...args)),
      onKeydown: _cache[2] || (_cache[2] = (...args) => $options.onKeyDown && $options.onKeyDown(...args)),
      onInput: _cache[3] || (_cache[3] = (...args) => $options.onEditableInput && $options.onEditableInput(...args))
    }, { ...$props.inputProps, ..._ctx.ptm("input") }), null, 16, _hoisted_2$o)) : (openBlock(), createElementBlock("span", mergeProps({
      key: 1,
      ref: "focusInput",
      id: $props.inputId,
      style: $props.inputStyle,
      class: $options.inputStyleClass,
      tabindex: !$props.disabled ? $props.tabindex : -1,
      role: "combobox",
      "aria-label": _ctx.ariaLabel || ($options.label === "p-emptylabel" ? void 0 : $options.label),
      "aria-labelledby": _ctx.ariaLabelledby,
      "aria-haspopup": "listbox",
      "aria-expanded": $data.overlayVisible,
      "aria-controls": $data.id + "_list",
      "aria-activedescendant": $data.focused ? $options.focusedOptionId : void 0,
      "aria-disabled": $props.disabled,
      onFocus: _cache[4] || (_cache[4] = (...args) => $options.onFocus && $options.onFocus(...args)),
      onBlur: _cache[5] || (_cache[5] = (...args) => $options.onBlur && $options.onBlur(...args)),
      onKeydown: _cache[6] || (_cache[6] = (...args) => $options.onKeyDown && $options.onKeyDown(...args))
    }, { ...$props.inputProps, ..._ctx.ptm("input") }), [
      renderSlot(_ctx.$slots, "value", {
        value: $props.modelValue,
        placeholder: $props.placeholder
      }, () => [
        createTextVNode(toDisplayString($options.label === "p-emptylabel" ? " " : $options.label || "empty"), 1)
      ])
    ], 16, _hoisted_3$j)),
    $props.showClear && $props.modelValue != null ? renderSlot(_ctx.$slots, "clearicon", {
      key: 2,
      onClick: $options.onClearClick
    }, () => [
      (openBlock(), createBlock(resolveDynamicComponent($props.clearIcon ? "i" : "TimesIcon"), mergeProps({
        class: ["p-dropdown-clear-icon", $props.clearIcon],
        onClick: $options.onClearClick
      }, { ...$props.clearIconProps, ..._ctx.ptm("clearIcon") }), null, 16, ["class", "onClick"]))
    ]) : createCommentVNode("", true),
    createBaseVNode("div", mergeProps({ class: "p-dropdown-trigger" }, _ctx.ptm("trigger")), [
      $props.loading ? renderSlot(_ctx.$slots, "loadingicon", {
        key: 0,
        class: "p-dropdown-trigger-icon"
      }, () => [
        $props.loadingIcon ? (openBlock(), createElementBlock("span", mergeProps({
          key: 0,
          class: ["p-dropdown-trigger-icon pi-spin", $props.loadingIcon],
          "aria-hidden": "true"
        }, _ctx.ptm("loadingIcon")), null, 16)) : (openBlock(), createBlock(_component_SpinnerIcon, mergeProps({
          key: 1,
          class: "p-dropdown-trigger-icon",
          spin: "",
          "aria-hidden": "true"
        }, _ctx.ptm("loadingIcon")), null, 16))
      ]) : renderSlot(_ctx.$slots, "dropdownicon", {
        key: 1,
        class: "p-dropdown-trigger-icon"
      }, () => [
        (openBlock(), createBlock(resolveDynamicComponent($props.dropdownIcon ? "span" : "ChevronDownIcon"), mergeProps({
          class: ["p-dropdown-trigger-icon", $props.dropdownIcon],
          "aria-hidden": "true"
        }, _ctx.ptm("dropdownIcon")), null, 16, ["class"]))
      ])
    ], 16),
    createVNode(_component_Portal, { appendTo: $props.appendTo }, {
      default: withCtx(() => [
        createVNode(Transition, {
          name: "p-connected-overlay",
          onEnter: $options.onOverlayEnter,
          onAfterEnter: $options.onOverlayAfterEnter,
          onLeave: $options.onOverlayLeave,
          onAfterLeave: $options.onOverlayAfterLeave
        }, {
          default: withCtx(() => [
            $data.overlayVisible ? (openBlock(), createElementBlock("div", mergeProps({
              key: 0,
              ref: $options.overlayRef,
              style: $props.panelStyle,
              class: $options.panelStyleClass,
              onClick: _cache[13] || (_cache[13] = (...args) => $options.onOverlayClick && $options.onOverlayClick(...args)),
              onKeydown: _cache[14] || (_cache[14] = (...args) => $options.onOverlayKeyDown && $options.onOverlayKeyDown(...args))
            }, { ...$props.panelProps, ..._ctx.ptm("panel") }), [
              createBaseVNode("span", mergeProps({
                ref: "firstHiddenFocusableElementOnOverlay",
                role: "presentation",
                "aria-hidden": "true",
                class: "p-hidden-accessible p-hidden-focusable",
                tabindex: 0,
                onFocus: _cache[7] || (_cache[7] = (...args) => $options.onFirstHiddenFocus && $options.onFirstHiddenFocus(...args))
              }, _ctx.ptm("hiddenFirstFocusableEl")), null, 16),
              renderSlot(_ctx.$slots, "header", {
                value: $props.modelValue,
                options: $options.visibleOptions
              }),
              $props.filter ? (openBlock(), createElementBlock("div", mergeProps({
                key: 0,
                class: "p-dropdown-header"
              }, _ctx.ptm("header")), [
                createBaseVNode("div", mergeProps({ class: "p-dropdown-filter-container" }, _ctx.ptm("filterContainer")), [
                  createBaseVNode("input", mergeProps({
                    ref: "filterInput",
                    type: "text",
                    value: $data.filterValue,
                    onVnodeMounted: _cache[8] || (_cache[8] = (...args) => $options.onFilterUpdated && $options.onFilterUpdated(...args)),
                    class: "p-dropdown-filter p-inputtext p-component",
                    placeholder: $props.filterPlaceholder,
                    role: "searchbox",
                    autocomplete: "off",
                    "aria-owns": $data.id + "_list",
                    "aria-activedescendant": $options.focusedOptionId,
                    onKeydown: _cache[9] || (_cache[9] = (...args) => $options.onFilterKeyDown && $options.onFilterKeyDown(...args)),
                    onBlur: _cache[10] || (_cache[10] = (...args) => $options.onFilterBlur && $options.onFilterBlur(...args)),
                    onInput: _cache[11] || (_cache[11] = (...args) => $options.onFilterChange && $options.onFilterChange(...args))
                  }, { ...$props.filterInputProps, ..._ctx.ptm("filterInput") }), null, 16, _hoisted_4$5),
                  renderSlot(_ctx.$slots, "filtericon", {}, () => [
                    (openBlock(), createBlock(resolveDynamicComponent($props.filterIcon ? "span" : "FilterIcon"), mergeProps({
                      class: ["p-dropdown-filter-icon", $props.filterIcon]
                    }, _ctx.ptm("filterIcon")), null, 16, ["class"]))
                  ])
                ], 16),
                createBaseVNode("span", mergeProps({
                  role: "status",
                  "aria-live": "polite",
                  class: "p-hidden-accessible"
                }, _ctx.ptm("hiddenFilterResult")), toDisplayString($options.filterResultMessageText), 17)
              ], 16)) : createCommentVNode("", true),
              createBaseVNode("div", mergeProps({
                class: "p-dropdown-items-wrapper",
                style: { "max-height": $options.virtualScrollerDisabled ? $props.scrollHeight : "" }
              }, _ctx.ptm("wrapper")), [
                createVNode(_component_VirtualScroller, mergeProps({ ref: $options.virtualScrollerRef }, { ...$props.virtualScrollerOptions, ..._ctx.ptm("virtualScroller") }, {
                  items: $options.visibleOptions,
                  style: { height: $props.scrollHeight },
                  tabindex: -1,
                  disabled: $options.virtualScrollerDisabled
                }), createSlots({
                  content: withCtx(({ styleClass, contentRef, items, getItemOptions, contentStyle, itemSize }) => [
                    createBaseVNode("ul", mergeProps({
                      ref: (el) => $options.listRef(el, contentRef),
                      id: $data.id + "_list",
                      class: ["p-dropdown-items", styleClass],
                      style: contentStyle,
                      role: "listbox"
                    }, _ctx.ptm("list")), [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(items, (option, i) => {
                        return openBlock(), createElementBlock(Fragment, {
                          key: $options.getOptionRenderKey(option, $options.getOptionIndex(i, getItemOptions))
                        }, [
                          $options.isOptionGroup(option) ? (openBlock(), createElementBlock("li", mergeProps({
                            key: 0,
                            id: $data.id + "_" + $options.getOptionIndex(i, getItemOptions),
                            style: { height: itemSize ? itemSize + "px" : void 0 },
                            class: "p-dropdown-item-group",
                            role: "option"
                          }, _ctx.ptm("itemGroup")), [
                            renderSlot(_ctx.$slots, "optiongroup", {
                              option: option.optionGroup,
                              index: $options.getOptionIndex(i, getItemOptions)
                            }, () => [
                              createTextVNode(toDisplayString($options.getOptionGroupLabel(option.optionGroup)), 1)
                            ])
                          ], 16, _hoisted_6$2)) : withDirectives((openBlock(), createElementBlock("li", mergeProps({
                            key: 1,
                            id: $data.id + "_" + $options.getOptionIndex(i, getItemOptions),
                            style: { height: itemSize ? itemSize + "px" : void 0 },
                            class: ["p-dropdown-item", { "p-highlight": $options.isSelected(option), "p-focus": $data.focusedOptionIndex === $options.getOptionIndex(i, getItemOptions), "p-disabled": $options.isOptionDisabled(option) }],
                            role: "option",
                            "aria-label": $options.getOptionLabel(option),
                            "aria-selected": $options.isSelected(option),
                            "aria-disabled": $options.isOptionDisabled(option),
                            "aria-setsize": $options.ariaSetSize,
                            "aria-posinset": $options.getAriaPosInset($options.getOptionIndex(i, getItemOptions)),
                            onClick: ($event) => $options.onOptionSelect($event, option),
                            onMousemove: ($event) => $options.onOptionMouseMove($event, $options.getOptionIndex(i, getItemOptions))
                          }, $options.getPTOptions(option, getItemOptions, i, "item")), [
                            renderSlot(_ctx.$slots, "option", {
                              option,
                              index: $options.getOptionIndex(i, getItemOptions)
                            }, () => [
                              createTextVNode(toDisplayString($options.getOptionLabel(option)), 1)
                            ])
                          ], 16, _hoisted_7$2)), [
                            [_directive_ripple]
                          ])
                        ], 64);
                      }), 128)),
                      $data.filterValue && (!items || items && items.length === 0) ? (openBlock(), createElementBlock("li", mergeProps({
                        key: 0,
                        class: "p-dropdown-empty-message",
                        role: "option"
                      }, _ctx.ptm("emptyMessage")), [
                        renderSlot(_ctx.$slots, "emptyfilter", {}, () => [
                          createTextVNode(toDisplayString($options.emptyFilterMessageText), 1)
                        ])
                      ], 16)) : !$props.options || $props.options && $props.options.length === 0 ? (openBlock(), createElementBlock("li", mergeProps({
                        key: 1,
                        class: "p-dropdown-empty-message",
                        role: "option"
                      }, _ctx.ptm("emptyMessage")), [
                        renderSlot(_ctx.$slots, "empty", {}, () => [
                          createTextVNode(toDisplayString($options.emptyMessageText), 1)
                        ])
                      ], 16)) : createCommentVNode("", true)
                    ], 16, _hoisted_5$4)
                  ]),
                  _: 2
                }, [
                  _ctx.$slots.loader ? {
                    name: "loader",
                    fn: withCtx(({ options }) => [
                      renderSlot(_ctx.$slots, "loader", { options })
                    ]),
                    key: "0"
                  } : void 0
                ]), 1040, ["items", "style", "disabled"])
              ], 16),
              renderSlot(_ctx.$slots, "footer", {
                value: $props.modelValue,
                options: $options.visibleOptions
              }),
              !$props.options || $props.options && $props.options.length === 0 ? (openBlock(), createElementBlock("span", mergeProps({
                key: 1,
                role: "status",
                "aria-live": "polite",
                class: "p-hidden-accessible"
              }, _ctx.ptm("emptyMessage")), toDisplayString($options.emptyMessageText), 17)) : createCommentVNode("", true),
              createBaseVNode("span", mergeProps({
                role: "status",
                "aria-live": "polite",
                class: "p-hidden-accessible"
              }, _ctx.ptm("hiddenSelectedMessage")), toDisplayString($options.selectedMessageText), 17),
              createBaseVNode("span", mergeProps({
                ref: "lastHiddenFocusableElementOnOverlay",
                role: "presentation",
                "aria-hidden": "true",
                class: "p-hidden-accessible p-hidden-focusable",
                tabindex: 0,
                onFocus: _cache[12] || (_cache[12] = (...args) => $options.onLastHiddenFocus && $options.onLastHiddenFocus(...args))
              }, _ctx.ptm("hiddenLastFocusableEl")), null, 16)
            ], 16)) : createCommentVNode("", true)
          ]),
          _: 3
        }, 8, ["onEnter", "onAfterEnter", "onLeave", "onAfterLeave"])
      ]),
      _: 3
    }, 8, ["appendTo"])
  ], 16, _hoisted_1$A);
}
function styleInject$a(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || typeof document === "undefined") {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$a = "\n.p-dropdown {\n    display: inline-flex;\n    cursor: pointer;\n    position: relative;\n    user-select: none;\n}\n.p-dropdown-clear-icon {\n    position: absolute;\n    top: 50%;\n    margin-top: -0.5rem;\n}\n.p-dropdown-trigger {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex-shrink: 0;\n}\n.p-dropdown-label {\n    display: block;\n    white-space: nowrap;\n    overflow: hidden;\n    flex: 1 1 auto;\n    width: 1%;\n    text-overflow: ellipsis;\n    cursor: pointer;\n}\n.p-dropdown-label-empty {\n    overflow: hidden;\n    opacity: 0;\n}\ninput.p-dropdown-label {\n    cursor: default;\n}\n.p-dropdown .p-dropdown-panel {\n    min-width: 100%;\n}\n.p-dropdown-panel {\n    position: absolute;\n    top: 0;\n    left: 0;\n}\n.p-dropdown-items-wrapper {\n    overflow: auto;\n}\n.p-dropdown-item {\n    cursor: pointer;\n    font-weight: normal;\n    white-space: nowrap;\n    position: relative;\n    overflow: hidden;\n}\n.p-dropdown-item-group {\n    cursor: auto;\n}\n.p-dropdown-items {\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n}\n.p-dropdown-filter {\n    width: 100%;\n}\n.p-dropdown-filter-container {\n    position: relative;\n}\n.p-dropdown-filter-icon {\n    position: absolute;\n    top: 50%;\n    margin-top: -0.5rem;\n}\n.p-fluid .p-dropdown {\n    display: flex;\n}\n.p-fluid .p-dropdown .p-dropdown-label {\n    width: 1%;\n}\n";
styleInject$a(css_248z$a);
script$w.render = render$w;
var script$v = {
  name: "AngleDownIcon",
  extends: script$J
};
const _hoisted_1$z = /* @__PURE__ */ createBaseVNode("path", {
  d: "M3.58659 4.5007C3.68513 4.50023 3.78277 4.51945 3.87379 4.55723C3.9648 4.59501 4.04735 4.65058 4.11659 4.7207L7.11659 7.7207L10.1166 4.7207C10.2619 4.65055 10.4259 4.62911 10.5843 4.65956C10.7427 4.69002 10.8871 4.77074 10.996 4.88976C11.1049 5.00877 11.1726 5.15973 11.1889 5.32022C11.2052 5.48072 11.1693 5.6422 11.0866 5.7807L7.58659 9.2807C7.44597 9.42115 7.25534 9.50004 7.05659 9.50004C6.85784 9.50004 6.66722 9.42115 6.52659 9.2807L3.02659 5.7807C2.88614 5.64007 2.80725 5.44945 2.80725 5.2507C2.80725 5.05195 2.88614 4.86132 3.02659 4.7207C3.09932 4.64685 3.18675 4.58911 3.28322 4.55121C3.37969 4.51331 3.48305 4.4961 3.58659 4.5007Z",
  fill: "currentColor"
}, null, -1);
const _hoisted_2$n = [
  _hoisted_1$z
];
function render$v(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$n, 16);
}
script$v.render = render$v;
var script$u = {
  name: "AngleUpIcon",
  extends: script$J
};
const _hoisted_1$y = /* @__PURE__ */ createBaseVNode("path", {
  d: "M10.4134 9.49931C10.3148 9.49977 10.2172 9.48055 10.1262 9.44278C10.0352 9.405 9.95263 9.34942 9.88338 9.27931L6.88338 6.27931L3.88338 9.27931C3.73811 9.34946 3.57409 9.3709 3.41567 9.34044C3.25724 9.30999 3.11286 9.22926 3.00395 9.11025C2.89504 8.99124 2.82741 8.84028 2.8111 8.67978C2.79478 8.51928 2.83065 8.35781 2.91338 8.21931L6.41338 4.71931C6.55401 4.57886 6.74463 4.49997 6.94338 4.49997C7.14213 4.49997 7.33276 4.57886 7.47338 4.71931L10.9734 8.21931C11.1138 8.35994 11.1927 8.55056 11.1927 8.74931C11.1927 8.94806 11.1138 9.13868 10.9734 9.27931C10.9007 9.35315 10.8132 9.41089 10.7168 9.44879C10.6203 9.48669 10.5169 9.5039 10.4134 9.49931Z",
  fill: "currentColor"
}, null, -1);
const _hoisted_2$m = [
  _hoisted_1$y
];
function render$u(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$m, 16);
}
script$u.render = render$u;
var script$t = {
  name: "InputText",
  extends: script$K,
  emits: ["update:modelValue"],
  props: {
    modelValue: null
  },
  methods: {
    onInput(event2) {
      this.$emit("update:modelValue", event2.target.value);
    }
  },
  computed: {
    filled() {
      return this.modelValue != null && this.modelValue.toString().length > 0;
    }
  }
};
const _hoisted_1$x = ["value"];
function render$t(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("input", mergeProps({
    class: ["p-inputtext p-component", { "p-filled": $options.filled }],
    value: $props.modelValue,
    onInput: _cache[0] || (_cache[0] = (...args) => $options.onInput && $options.onInput(...args))
  }, _ctx.ptm("root")), null, 16, _hoisted_1$x);
}
script$t.render = render$t;
var script$s = {
  name: "InputNumber",
  extends: script$K,
  emits: ["update:modelValue", "input", "focus", "blur"],
  props: {
    modelValue: {
      type: Number,
      default: null
    },
    format: {
      type: Boolean,
      default: true
    },
    showButtons: {
      type: Boolean,
      default: false
    },
    buttonLayout: {
      type: String,
      default: "stacked"
    },
    incrementButtonClass: {
      type: String,
      default: null
    },
    decrementButtonClass: {
      type: String,
      default: null
    },
    incrementButtonIcon: {
      type: String,
      default: void 0
    },
    decrementButtonIcon: {
      type: String,
      default: void 0
    },
    locale: {
      type: String,
      default: void 0
    },
    localeMatcher: {
      type: String,
      default: void 0
    },
    mode: {
      type: String,
      default: "decimal"
    },
    prefix: {
      type: String,
      default: null
    },
    suffix: {
      type: String,
      default: null
    },
    currency: {
      type: String,
      default: void 0
    },
    currencyDisplay: {
      type: String,
      default: void 0
    },
    useGrouping: {
      type: Boolean,
      default: true
    },
    minFractionDigits: {
      type: Number,
      default: void 0
    },
    maxFractionDigits: {
      type: Number,
      default: void 0
    },
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    },
    step: {
      type: Number,
      default: 1
    },
    allowEmpty: {
      type: Boolean,
      default: true
    },
    highlightOnFocus: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
    },
    inputId: {
      type: String,
      default: null
    },
    inputClass: {
      type: [String, Object],
      default: null
    },
    inputStyle: {
      type: Object,
      default: null
    },
    inputProps: {
      type: null,
      default: null
    },
    incrementButtonProps: {
      type: null,
      default: null
    },
    decrementButtonProps: {
      type: null,
      default: null
    },
    "aria-labelledby": {
      type: String,
      default: null
    },
    "aria-label": {
      type: String,
      default: null
    }
  },
  numberFormat: null,
  _numeral: null,
  _decimal: null,
  _group: null,
  _minusSign: null,
  _currency: null,
  _suffix: null,
  _prefix: null,
  _index: null,
  groupChar: "",
  isSpecialChar: null,
  prefixChar: null,
  suffixChar: null,
  timer: null,
  data() {
    return {
      d_modelValue: this.modelValue,
      focused: false
    };
  },
  watch: {
    modelValue(newValue) {
      this.d_modelValue = newValue;
    },
    locale(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    localeMatcher(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    mode(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    currency(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    currencyDisplay(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    useGrouping(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    minFractionDigits(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    maxFractionDigits(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    suffix(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    },
    prefix(newValue, oldValue) {
      this.updateConstructParser(newValue, oldValue);
    }
  },
  created() {
    this.constructParser();
  },
  methods: {
    getOptions() {
      return {
        localeMatcher: this.localeMatcher,
        style: this.mode,
        currency: this.currency,
        currencyDisplay: this.currencyDisplay,
        useGrouping: this.useGrouping,
        minimumFractionDigits: this.minFractionDigits,
        maximumFractionDigits: this.maxFractionDigits
      };
    },
    constructParser() {
      this.numberFormat = new Intl.NumberFormat(this.locale, this.getOptions());
      const numerals = [...new Intl.NumberFormat(this.locale, { useGrouping: false }).format(9876543210)].reverse();
      const index = new Map(numerals.map((d, i) => [d, i]));
      this._numeral = new RegExp(`[${numerals.join("")}]`, "g");
      this._group = this.getGroupingExpression();
      this._minusSign = this.getMinusSignExpression();
      this._currency = this.getCurrencyExpression();
      this._decimal = this.getDecimalExpression();
      this._suffix = this.getSuffixExpression();
      this._prefix = this.getPrefixExpression();
      this._index = (d) => index.get(d);
    },
    updateConstructParser(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.constructParser();
      }
    },
    escapeRegExp(text) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    },
    getDecimalExpression() {
      const formatter = new Intl.NumberFormat(this.locale, { ...this.getOptions(), useGrouping: false });
      return new RegExp(`[${formatter.format(1.1).replace(this._currency, "").trim().replace(this._numeral, "")}]`, "g");
    },
    getGroupingExpression() {
      const formatter = new Intl.NumberFormat(this.locale, { useGrouping: true });
      this.groupChar = formatter.format(1e6).trim().replace(this._numeral, "").charAt(0);
      return new RegExp(`[${this.groupChar}]`, "g");
    },
    getMinusSignExpression() {
      const formatter = new Intl.NumberFormat(this.locale, { useGrouping: false });
      return new RegExp(`[${formatter.format(-1).trim().replace(this._numeral, "")}]`, "g");
    },
    getCurrencyExpression() {
      if (this.currency) {
        const formatter = new Intl.NumberFormat(this.locale, { style: "currency", currency: this.currency, currencyDisplay: this.currencyDisplay, minimumFractionDigits: 0, maximumFractionDigits: 0 });
        return new RegExp(`[${formatter.format(1).replace(/\s/g, "").replace(this._numeral, "").replace(this._group, "")}]`, "g");
      }
      return new RegExp(`[]`, "g");
    },
    getPrefixExpression() {
      if (this.prefix) {
        this.prefixChar = this.prefix;
      } else {
        const formatter = new Intl.NumberFormat(this.locale, { style: this.mode, currency: this.currency, currencyDisplay: this.currencyDisplay });
        this.prefixChar = formatter.format(1).split("1")[0];
      }
      return new RegExp(`${this.escapeRegExp(this.prefixChar || "")}`, "g");
    },
    getSuffixExpression() {
      if (this.suffix) {
        this.suffixChar = this.suffix;
      } else {
        const formatter = new Intl.NumberFormat(this.locale, { style: this.mode, currency: this.currency, currencyDisplay: this.currencyDisplay, minimumFractionDigits: 0, maximumFractionDigits: 0 });
        this.suffixChar = formatter.format(1).split("1")[1];
      }
      return new RegExp(`${this.escapeRegExp(this.suffixChar || "")}`, "g");
    },
    formatValue(value) {
      if (value != null) {
        if (value === "-") {
          return value;
        }
        if (this.format) {
          let formatter = new Intl.NumberFormat(this.locale, this.getOptions());
          let formattedValue = formatter.format(value);
          if (this.prefix) {
            formattedValue = this.prefix + formattedValue;
          }
          if (this.suffix) {
            formattedValue = formattedValue + this.suffix;
          }
          return formattedValue;
        }
        return value.toString();
      }
      return "";
    },
    parseValue(text) {
      let filteredText = text.replace(this._suffix, "").replace(this._prefix, "").trim().replace(/\s/g, "").replace(this._currency, "").replace(this._group, "").replace(this._minusSign, "-").replace(this._decimal, ".").replace(this._numeral, this._index);
      if (filteredText) {
        if (filteredText === "-")
          return filteredText;
        let parsedValue = +filteredText;
        return isNaN(parsedValue) ? null : parsedValue;
      }
      return null;
    },
    repeat(event2, interval, dir) {
      if (this.readonly) {
        return;
      }
      let i = interval || 500;
      this.clearTimer();
      this.timer = setTimeout(() => {
        this.repeat(event2, 40, dir);
      }, i);
      this.spin(event2, dir);
    },
    spin(event2, dir) {
      if (this.$refs.input) {
        let step = this.step * dir;
        let currentValue = this.parseValue(this.$refs.input.$el.value) || 0;
        let newValue = this.validateValue(currentValue + step);
        this.updateInput(newValue, null, "spin");
        this.updateModel(event2, newValue);
        this.handleOnInput(event2, currentValue, newValue);
      }
    },
    onUpButtonMouseDown(event2) {
      if (!this.disabled) {
        this.$refs.input.$el.focus();
        this.repeat(event2, null, 1);
        event2.preventDefault();
      }
    },
    onUpButtonMouseUp() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },
    onUpButtonMouseLeave() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },
    onUpButtonKeyUp() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },
    onUpButtonKeyDown(event2) {
      if (event2.keyCode === 32 || event2.keyCode === 13) {
        this.repeat(event2, null, 1);
      }
    },
    onDownButtonMouseDown(event2) {
      if (!this.disabled) {
        this.$refs.input.$el.focus();
        this.repeat(event2, null, -1);
        event2.preventDefault();
      }
    },
    onDownButtonMouseUp() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },
    onDownButtonMouseLeave() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },
    onDownButtonKeyUp() {
      if (!this.disabled) {
        this.clearTimer();
      }
    },
    onDownButtonKeyDown(event2) {
      if (event2.keyCode === 32 || event2.keyCode === 13) {
        this.repeat(event2, null, -1);
      }
    },
    onUserInput() {
      if (this.isSpecialChar) {
        this.$refs.input.$el.value = this.lastValue;
      }
      this.isSpecialChar = false;
    },
    onInputKeyDown(event2) {
      if (this.readonly) {
        return;
      }
      this.lastValue = event2.target.value;
      if (event2.shiftKey || event2.altKey) {
        this.isSpecialChar = true;
        return;
      }
      let selectionStart = event2.target.selectionStart;
      let selectionEnd = event2.target.selectionEnd;
      let inputValue = event2.target.value;
      let newValueStr = null;
      if (event2.altKey) {
        event2.preventDefault();
      }
      switch (event2.code) {
        case "ArrowUp":
          this.spin(event2, 1);
          event2.preventDefault();
          break;
        case "ArrowDown":
          this.spin(event2, -1);
          event2.preventDefault();
          break;
        case "ArrowLeft":
          if (!this.isNumeralChar(inputValue.charAt(selectionStart - 1))) {
            event2.preventDefault();
          }
          break;
        case "ArrowRight":
          if (!this.isNumeralChar(inputValue.charAt(selectionStart))) {
            event2.preventDefault();
          }
          break;
        case "Tab":
        case "Enter":
          newValueStr = this.validateValue(this.parseValue(inputValue));
          this.$refs.input.$el.value = this.formatValue(newValueStr);
          this.$refs.input.$el.setAttribute("aria-valuenow", newValueStr);
          this.updateModel(event2, newValueStr);
          break;
        case "Backspace": {
          event2.preventDefault();
          if (selectionStart === selectionEnd) {
            const deleteChar = inputValue.charAt(selectionStart - 1);
            const { decimalCharIndex, decimalCharIndexWithoutPrefix } = this.getDecimalCharIndexes(inputValue);
            if (this.isNumeralChar(deleteChar)) {
              const decimalLength = this.getDecimalLength(inputValue);
              if (this._group.test(deleteChar)) {
                this._group.lastIndex = 0;
                newValueStr = inputValue.slice(0, selectionStart - 2) + inputValue.slice(selectionStart - 1);
              } else if (this._decimal.test(deleteChar)) {
                this._decimal.lastIndex = 0;
                if (decimalLength) {
                  this.$refs.input.$el.setSelectionRange(selectionStart - 1, selectionStart - 1);
                } else {
                  newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
                }
              } else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                const insertedText = this.isDecimalMode() && (this.minFractionDigits || 0) < decimalLength ? "" : "0";
                newValueStr = inputValue.slice(0, selectionStart - 1) + insertedText + inputValue.slice(selectionStart);
              } else if (decimalCharIndexWithoutPrefix === 1) {
                newValueStr = inputValue.slice(0, selectionStart - 1) + "0" + inputValue.slice(selectionStart);
                newValueStr = this.parseValue(newValueStr) > 0 ? newValueStr : "";
              } else {
                newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
              }
            }
            this.updateValue(event2, newValueStr, null, "delete-single");
          } else {
            newValueStr = this.deleteRange(inputValue, selectionStart, selectionEnd);
            this.updateValue(event2, newValueStr, null, "delete-range");
          }
          break;
        }
        case "Delete":
          event2.preventDefault();
          if (selectionStart === selectionEnd) {
            const deleteChar = inputValue.charAt(selectionStart);
            const { decimalCharIndex, decimalCharIndexWithoutPrefix } = this.getDecimalCharIndexes(inputValue);
            if (this.isNumeralChar(deleteChar)) {
              const decimalLength = this.getDecimalLength(inputValue);
              if (this._group.test(deleteChar)) {
                this._group.lastIndex = 0;
                newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 2);
              } else if (this._decimal.test(deleteChar)) {
                this._decimal.lastIndex = 0;
                if (decimalLength) {
                  this.$refs.input.$el.setSelectionRange(selectionStart + 1, selectionStart + 1);
                } else {
                  newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 1);
                }
              } else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                const insertedText = this.isDecimalMode() && (this.minFractionDigits || 0) < decimalLength ? "" : "0";
                newValueStr = inputValue.slice(0, selectionStart) + insertedText + inputValue.slice(selectionStart + 1);
              } else if (decimalCharIndexWithoutPrefix === 1) {
                newValueStr = inputValue.slice(0, selectionStart) + "0" + inputValue.slice(selectionStart + 1);
                newValueStr = this.parseValue(newValueStr) > 0 ? newValueStr : "";
              } else {
                newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 1);
              }
            }
            this.updateValue(event2, newValueStr, null, "delete-back-single");
          } else {
            newValueStr = this.deleteRange(inputValue, selectionStart, selectionEnd);
            this.updateValue(event2, newValueStr, null, "delete-range");
          }
          break;
        case "Home":
          if (this.min) {
            this.updateModel(event2, this.min);
            event2.preventDefault();
          }
          break;
        case "End":
          if (this.max) {
            this.updateModel(event2, this.max);
            event2.preventDefault();
          }
          break;
      }
    },
    onInputKeyPress(event2) {
      if (this.readonly) {
        return;
      }
      event2.preventDefault();
      let code = event2.which || event2.keyCode;
      let char = String.fromCharCode(code);
      const isDecimalSign = this.isDecimalSign(char);
      const isMinusSign = this.isMinusSign(char);
      if (48 <= code && code <= 57 || isMinusSign || isDecimalSign) {
        this.insert(event2, char, { isDecimalSign, isMinusSign });
      }
    },
    onPaste(event2) {
      event2.preventDefault();
      let data = (event2.clipboardData || window["clipboardData"]).getData("Text");
      if (data) {
        let filteredData = this.parseValue(data);
        if (filteredData != null) {
          this.insert(event2, filteredData.toString());
        }
      }
    },
    allowMinusSign() {
      return this.min === null || this.min < 0;
    },
    isMinusSign(char) {
      if (this._minusSign.test(char) || char === "-") {
        this._minusSign.lastIndex = 0;
        return true;
      }
      return false;
    },
    isDecimalSign(char) {
      if (this._decimal.test(char)) {
        this._decimal.lastIndex = 0;
        return true;
      }
      return false;
    },
    isDecimalMode() {
      return this.mode === "decimal";
    },
    getDecimalCharIndexes(val) {
      let decimalCharIndex = val.search(this._decimal);
      this._decimal.lastIndex = 0;
      const filteredVal = val.replace(this._prefix, "").trim().replace(/\s/g, "").replace(this._currency, "");
      const decimalCharIndexWithoutPrefix = filteredVal.search(this._decimal);
      this._decimal.lastIndex = 0;
      return { decimalCharIndex, decimalCharIndexWithoutPrefix };
    },
    getCharIndexes(val) {
      const decimalCharIndex = val.search(this._decimal);
      this._decimal.lastIndex = 0;
      const minusCharIndex = val.search(this._minusSign);
      this._minusSign.lastIndex = 0;
      const suffixCharIndex = val.search(this._suffix);
      this._suffix.lastIndex = 0;
      const currencyCharIndex = val.search(this._currency);
      this._currency.lastIndex = 0;
      return { decimalCharIndex, minusCharIndex, suffixCharIndex, currencyCharIndex };
    },
    insert(event2, text, sign = { isDecimalSign: false, isMinusSign: false }) {
      const minusCharIndexOnText = text.search(this._minusSign);
      this._minusSign.lastIndex = 0;
      if (!this.allowMinusSign() && minusCharIndexOnText !== -1) {
        return;
      }
      const selectionStart = this.$refs.input.$el.selectionStart;
      const selectionEnd = this.$refs.input.$el.selectionEnd;
      let inputValue = this.$refs.input.$el.value.trim();
      const { decimalCharIndex, minusCharIndex, suffixCharIndex, currencyCharIndex } = this.getCharIndexes(inputValue);
      let newValueStr;
      if (sign.isMinusSign) {
        if (selectionStart === 0) {
          newValueStr = inputValue;
          if (minusCharIndex === -1 || selectionEnd !== 0) {
            newValueStr = this.insertText(inputValue, text, 0, selectionEnd);
          }
          this.updateValue(event2, newValueStr, text, "insert");
        }
      } else if (sign.isDecimalSign) {
        if (decimalCharIndex > 0 && selectionStart === decimalCharIndex) {
          this.updateValue(event2, inputValue, text, "insert");
        } else if (decimalCharIndex > selectionStart && decimalCharIndex < selectionEnd) {
          newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
          this.updateValue(event2, newValueStr, text, "insert");
        } else if (decimalCharIndex === -1 && this.maxFractionDigits) {
          newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
          this.updateValue(event2, newValueStr, text, "insert");
        }
      } else {
        const maxFractionDigits = this.numberFormat.resolvedOptions().maximumFractionDigits;
        const operation = selectionStart !== selectionEnd ? "range-insert" : "insert";
        if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
          if (selectionStart + text.length - (decimalCharIndex + 1) <= maxFractionDigits) {
            const charIndex = currencyCharIndex >= selectionStart ? currencyCharIndex - 1 : suffixCharIndex >= selectionStart ? suffixCharIndex : inputValue.length;
            newValueStr = inputValue.slice(0, selectionStart) + text + inputValue.slice(selectionStart + text.length, charIndex) + inputValue.slice(charIndex);
            this.updateValue(event2, newValueStr, text, operation);
          }
        } else {
          newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
          this.updateValue(event2, newValueStr, text, operation);
        }
      }
    },
    insertText(value, text, start, end) {
      let textSplit = text === "." ? text : text.split(".");
      if (textSplit.length === 2) {
        const decimalCharIndex = value.slice(start, end).search(this._decimal);
        this._decimal.lastIndex = 0;
        return decimalCharIndex > 0 ? value.slice(0, start) + this.formatValue(text) + value.slice(end) : value || this.formatValue(text);
      } else if (end - start === value.length) {
        return this.formatValue(text);
      } else if (start === 0) {
        return text + value.slice(end);
      } else if (end === value.length) {
        return value.slice(0, start) + text;
      } else {
        return value.slice(0, start) + text + value.slice(end);
      }
    },
    deleteRange(value, start, end) {
      let newValueStr;
      if (end - start === value.length)
        newValueStr = "";
      else if (start === 0)
        newValueStr = value.slice(end);
      else if (end === value.length)
        newValueStr = value.slice(0, start);
      else
        newValueStr = value.slice(0, start) + value.slice(end);
      return newValueStr;
    },
    initCursor() {
      let selectionStart = this.$refs.input.$el.selectionStart;
      let inputValue = this.$refs.input.$el.value;
      let valueLength = inputValue.length;
      let index = null;
      let prefixLength = (this.prefixChar || "").length;
      inputValue = inputValue.replace(this._prefix, "");
      selectionStart = selectionStart - prefixLength;
      let char = inputValue.charAt(selectionStart);
      if (this.isNumeralChar(char)) {
        return selectionStart + prefixLength;
      }
      let i = selectionStart - 1;
      while (i >= 0) {
        char = inputValue.charAt(i);
        if (this.isNumeralChar(char)) {
          index = i + prefixLength;
          break;
        } else {
          i--;
        }
      }
      if (index !== null) {
        this.$refs.input.$el.setSelectionRange(index + 1, index + 1);
      } else {
        i = selectionStart;
        while (i < valueLength) {
          char = inputValue.charAt(i);
          if (this.isNumeralChar(char)) {
            index = i + prefixLength;
            break;
          } else {
            i++;
          }
        }
        if (index !== null) {
          this.$refs.input.$el.setSelectionRange(index, index);
        }
      }
      return index || 0;
    },
    onInputClick() {
      const currentValue = this.$refs.input.$el.value;
      if (!this.readonly && currentValue !== DomHandler.getSelection()) {
        this.initCursor();
      }
    },
    isNumeralChar(char) {
      if (char.length === 1 && (this._numeral.test(char) || this._decimal.test(char) || this._group.test(char) || this._minusSign.test(char))) {
        this.resetRegex();
        return true;
      }
      return false;
    },
    resetRegex() {
      this._numeral.lastIndex = 0;
      this._decimal.lastIndex = 0;
      this._group.lastIndex = 0;
      this._minusSign.lastIndex = 0;
    },
    updateValue(event2, valueStr, insertedValueStr, operation) {
      let currentValue = this.$refs.input.$el.value;
      let newValue = null;
      if (valueStr != null) {
        newValue = this.parseValue(valueStr);
        newValue = !newValue && !this.allowEmpty ? 0 : newValue;
        this.updateInput(newValue, insertedValueStr, operation, valueStr);
        this.handleOnInput(event2, currentValue, newValue);
      }
    },
    handleOnInput(event2, currentValue, newValue) {
      if (this.isValueChanged(currentValue, newValue)) {
        this.$emit("input", { originalEvent: event2, value: newValue, formattedValue: currentValue });
      }
    },
    isValueChanged(currentValue, newValue) {
      if (newValue === null && currentValue !== null) {
        return true;
      }
      if (newValue != null) {
        let parsedCurrentValue = typeof currentValue === "string" ? this.parseValue(currentValue) : currentValue;
        return newValue !== parsedCurrentValue;
      }
      return false;
    },
    validateValue(value) {
      if (value === "-" || value == null) {
        return null;
      }
      if (this.min != null && value < this.min) {
        return this.min;
      }
      if (this.max != null && value > this.max) {
        return this.max;
      }
      return value;
    },
    updateInput(value, insertedValueStr, operation, valueStr) {
      insertedValueStr = insertedValueStr || "";
      let inputValue = this.$refs.input.$el.value;
      let newValue = this.formatValue(value);
      let currentLength = inputValue.length;
      if (newValue !== valueStr) {
        newValue = this.concatValues(newValue, valueStr);
      }
      if (currentLength === 0) {
        this.$refs.input.$el.value = newValue;
        this.$refs.input.$el.setSelectionRange(0, 0);
        const index = this.initCursor();
        const selectionEnd = index + insertedValueStr.length;
        this.$refs.input.$el.setSelectionRange(selectionEnd, selectionEnd);
      } else {
        let selectionStart = this.$refs.input.$el.selectionStart;
        let selectionEnd = this.$refs.input.$el.selectionEnd;
        this.$refs.input.$el.value = newValue;
        let newLength = newValue.length;
        if (operation === "range-insert") {
          const startValue = this.parseValue((inputValue || "").slice(0, selectionStart));
          const startValueStr = startValue !== null ? startValue.toString() : "";
          const startExpr = startValueStr.split("").join(`(${this.groupChar})?`);
          const sRegex = new RegExp(startExpr, "g");
          sRegex.test(newValue);
          const tExpr = insertedValueStr.split("").join(`(${this.groupChar})?`);
          const tRegex = new RegExp(tExpr, "g");
          tRegex.test(newValue.slice(sRegex.lastIndex));
          selectionEnd = sRegex.lastIndex + tRegex.lastIndex;
          this.$refs.input.$el.setSelectionRange(selectionEnd, selectionEnd);
        } else if (newLength === currentLength) {
          if (operation === "insert" || operation === "delete-back-single")
            this.$refs.input.$el.setSelectionRange(selectionEnd + 1, selectionEnd + 1);
          else if (operation === "delete-single")
            this.$refs.input.$el.setSelectionRange(selectionEnd - 1, selectionEnd - 1);
          else if (operation === "delete-range" || operation === "spin")
            this.$refs.input.$el.setSelectionRange(selectionEnd, selectionEnd);
        } else if (operation === "delete-back-single") {
          let prevChar = inputValue.charAt(selectionEnd - 1);
          let nextChar = inputValue.charAt(selectionEnd);
          let diff = currentLength - newLength;
          let isGroupChar = this._group.test(nextChar);
          if (isGroupChar && diff === 1) {
            selectionEnd += 1;
          } else if (!isGroupChar && this.isNumeralChar(prevChar)) {
            selectionEnd += -1 * diff + 1;
          }
          this._group.lastIndex = 0;
          this.$refs.input.$el.setSelectionRange(selectionEnd, selectionEnd);
        } else if (inputValue === "-" && operation === "insert") {
          this.$refs.input.$el.setSelectionRange(0, 0);
          const index = this.initCursor();
          const selectionEnd2 = index + insertedValueStr.length + 1;
          this.$refs.input.$el.setSelectionRange(selectionEnd2, selectionEnd2);
        } else {
          selectionEnd = selectionEnd + (newLength - currentLength);
          this.$refs.input.$el.setSelectionRange(selectionEnd, selectionEnd);
        }
      }
      this.$refs.input.$el.setAttribute("aria-valuenow", value);
    },
    concatValues(val1, val2) {
      if (val1 && val2) {
        let decimalCharIndex = val2.search(this._decimal);
        this._decimal.lastIndex = 0;
        if (this.suffixChar) {
          return val1.replace(this.suffixChar, "").split(this._decimal)[0] + val2.replace(this.suffixChar, "").slice(decimalCharIndex) + this.suffixChar;
        } else {
          return decimalCharIndex !== -1 ? val1.split(this._decimal)[0] + val2.slice(decimalCharIndex) : val1;
        }
      }
      return val1;
    },
    getDecimalLength(value) {
      if (value) {
        const valueSplit = value.split(this._decimal);
        if (valueSplit.length === 2) {
          return valueSplit[1].replace(this._suffix, "").trim().replace(/\s/g, "").replace(this._currency, "").length;
        }
      }
      return 0;
    },
    updateModel(event2, value) {
      this.d_modelValue = value;
      this.$emit("update:modelValue", value);
    },
    onInputFocus(event2) {
      this.focused = true;
      if (!this.disabled && !this.readonly && this.$refs.input.$el.value !== DomHandler.getSelection() && this.highlightOnFocus) {
        event2.target.select();
      }
      this.$emit("focus", event2);
    },
    onInputBlur(event2) {
      this.focused = false;
      let input = event2.target;
      let newValue = this.validateValue(this.parseValue(input.value));
      this.$emit("blur", { originalEvent: event2, value: input.value });
      input.value = this.formatValue(newValue);
      input.setAttribute("aria-valuenow", newValue);
      this.updateModel(event2, newValue);
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    maxBoundry() {
      return this.d_modelValue >= this.max;
    },
    minBoundry() {
      return this.d_modelValue <= this.min;
    }
  },
  computed: {
    containerClass() {
      return [
        "p-inputnumber p-component p-inputwrapper",
        {
          "p-inputwrapper-filled": this.filled,
          "p-inputwrapper-focus": this.focused,
          "p-inputnumber-buttons-stacked": this.showButtons && this.buttonLayout === "stacked",
          "p-inputnumber-buttons-horizontal": this.showButtons && this.buttonLayout === "horizontal",
          "p-inputnumber-buttons-vertical": this.showButtons && this.buttonLayout === "vertical"
        }
      ];
    },
    upButtonClass() {
      return [
        "p-inputnumber-button p-inputnumber-button-up",
        this.incrementButtonClass,
        {
          "p-disabled": this.showButtons && this.max !== null && this.maxBoundry()
        }
      ];
    },
    downButtonClass() {
      return [
        "p-inputnumber-button p-inputnumber-button-down",
        this.decrementButtonClass,
        {
          "p-disabled": this.showButtons && this.min !== null && this.minBoundry()
        }
      ];
    },
    filled() {
      return this.modelValue != null && this.modelValue.toString().length > 0;
    },
    upButtonListeners() {
      return {
        mousedown: (event2) => this.onUpButtonMouseDown(event2),
        mouseup: (event2) => this.onUpButtonMouseUp(event2),
        mouseleave: (event2) => this.onUpButtonMouseLeave(event2),
        keydown: (event2) => this.onUpButtonKeyDown(event2),
        keyup: (event2) => this.onUpButtonKeyUp(event2)
      };
    },
    downButtonListeners() {
      return {
        mousedown: (event2) => this.onDownButtonMouseDown(event2),
        mouseup: (event2) => this.onDownButtonMouseUp(event2),
        mouseleave: (event2) => this.onDownButtonMouseLeave(event2),
        keydown: (event2) => this.onDownButtonKeyDown(event2),
        keyup: (event2) => this.onDownButtonKeyUp(event2)
      };
    },
    formattedValue() {
      const val = !this.modelValue && !this.allowEmpty ? 0 : this.modelValue;
      return this.formatValue(val);
    },
    getFormatter() {
      return this.numberFormat;
    }
  },
  components: {
    INInputText: script$t,
    INButton: script$H,
    AngleUpIcon: script$u,
    AngleDownIcon: script$v
  }
};
function render$s(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_INInputText = resolveComponent("INInputText");
  const _component_INButton = resolveComponent("INButton");
  return openBlock(), createElementBlock("span", mergeProps({ class: $options.containerClass }, _ctx.ptm("root")), [
    createVNode(_component_INInputText, mergeProps({
      ref: "input",
      id: $props.inputId,
      class: ["p-inputnumber-input", $props.inputClass],
      role: "spinbutton",
      style: $props.inputStyle,
      value: $options.formattedValue,
      "aria-valuemin": $props.min,
      "aria-valuemax": $props.max,
      "aria-valuenow": $props.modelValue,
      disabled: $props.disabled,
      readonly: $props.readonly,
      placeholder: $props.placeholder,
      "aria-labelledby": _ctx.ariaLabelledby,
      "aria-label": _ctx.ariaLabel,
      onInput: $options.onUserInput,
      onKeydown: $options.onInputKeyDown,
      onKeypress: $options.onInputKeyPress,
      onPaste: $options.onPaste,
      onClick: $options.onInputClick,
      onFocus: $options.onInputFocus,
      onBlur: $options.onInputBlur
    }, { ...$props.inputProps, ..._ctx.ptm("input") }), null, 16, ["id", "class", "style", "value", "aria-valuemin", "aria-valuemax", "aria-valuenow", "disabled", "readonly", "placeholder", "aria-labelledby", "aria-label", "onInput", "onKeydown", "onKeypress", "onPaste", "onClick", "onFocus", "onBlur"]),
    $props.showButtons && $props.buttonLayout === "stacked" ? (openBlock(), createElementBlock("span", mergeProps({
      key: 0,
      class: "p-inputnumber-button-group"
    }, _ctx.ptm("buttonGroup")), [
      createVNode(_component_INButton, mergeProps({ class: $options.upButtonClass }, toHandlers($options.upButtonListeners), {
        disabled: $props.disabled,
        tabindex: -1,
        "aria-hidden": "true"
      }, { ...$props.incrementButtonProps, ..._ctx.ptm("incrementButton") }), {
        icon: withCtx(() => [
          renderSlot(_ctx.$slots, "incrementbuttonicon", {}, () => [
            (openBlock(), createBlock(resolveDynamicComponent($props.incrementButtonIcon ? "span" : "AngleUpIcon"), mergeProps({ class: $props.incrementButtonIcon }, _ctx.ptm("incrementButton")["icon"]), null, 16, ["class"]))
          ])
        ]),
        _: 3
      }, 16, ["class", "disabled"]),
      createVNode(_component_INButton, mergeProps({ class: $options.downButtonClass }, toHandlers($options.downButtonListeners), {
        disabled: $props.disabled,
        tabindex: -1,
        "aria-hidden": "true"
      }, { ...$props.decrementButtonProps, ..._ctx.ptm("decrementButton") }), {
        icon: withCtx(() => [
          renderSlot(_ctx.$slots, "decrementbuttonicon", {}, () => [
            (openBlock(), createBlock(resolveDynamicComponent($props.decrementButtonIcon ? "span" : "AngleDownIcon"), mergeProps({ class: $props.decrementButtonIcon }, _ctx.ptm("decrementButton")["icon"]), null, 16, ["class"]))
          ])
        ]),
        _: 3
      }, 16, ["class", "disabled"])
    ], 16)) : createCommentVNode("", true),
    $props.showButtons && $props.buttonLayout !== "stacked" ? (openBlock(), createBlock(_component_INButton, mergeProps({
      key: 1,
      class: $options.upButtonClass
    }, toHandlers($options.upButtonListeners), {
      disabled: $props.disabled,
      tabindex: -1,
      "aria-hidden": "true"
    }, { ...$props.incrementButtonProps, ..._ctx.ptm("incrementButton") }), {
      icon: withCtx(() => [
        renderSlot(_ctx.$slots, "incrementbuttonicon", {}, () => [
          (openBlock(), createBlock(resolveDynamicComponent($props.incrementButtonIcon ? "span" : "AngleUpIcon"), mergeProps({ class: $props.incrementButtonIcon }, _ctx.ptm("incrementButton")["icon"]), null, 16, ["class"]))
        ])
      ]),
      _: 3
    }, 16, ["class", "disabled"])) : createCommentVNode("", true),
    $props.showButtons && $props.buttonLayout !== "stacked" ? (openBlock(), createBlock(_component_INButton, mergeProps({
      key: 2,
      class: $options.downButtonClass
    }, toHandlers($options.downButtonListeners), {
      disabled: $props.disabled,
      tabindex: -1,
      "aria-hidden": "true"
    }, { ...$props.decrementButtonProps, ..._ctx.ptm("decrementButton") }), {
      icon: withCtx(() => [
        renderSlot(_ctx.$slots, "decrementbuttonicon", {}, () => [
          (openBlock(), createBlock(resolveDynamicComponent($props.decrementButtonIcon ? "span" : "AngleDownIcon"), mergeProps({ class: $props.decrementButtonIcon }, _ctx.ptm("decrementButton")["icon"]), null, 16, ["class"]))
        ])
      ]),
      _: 3
    }, 16, ["class", "disabled"])) : createCommentVNode("", true)
  ], 16);
}
function styleInject$9(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || typeof document === "undefined") {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$9 = "\n.p-inputnumber {\n    display: inline-flex;\n}\n.p-inputnumber-button {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex: 0 0 auto;\n}\n.p-inputnumber-buttons-stacked .p-button.p-inputnumber-button .p-button-label,\n.p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button .p-button-label {\n    display: none;\n}\n.p-inputnumber-buttons-stacked .p-button.p-inputnumber-button-up {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n    border-bottom-right-radius: 0;\n    padding: 0;\n}\n.p-inputnumber-buttons-stacked .p-inputnumber-input {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n}\n.p-inputnumber-buttons-stacked .p-button.p-inputnumber-button-down {\n    border-top-left-radius: 0;\n    border-top-right-radius: 0;\n    border-bottom-left-radius: 0;\n    padding: 0;\n}\n.p-inputnumber-buttons-stacked .p-inputnumber-button-group {\n    display: flex;\n    flex-direction: column;\n}\n.p-inputnumber-buttons-stacked .p-inputnumber-button-group .p-button.p-inputnumber-button {\n    flex: 1 1 auto;\n}\n.p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button-up {\n    order: 3;\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n}\n.p-inputnumber-buttons-horizontal .p-inputnumber-input {\n    order: 2;\n    border-radius: 0;\n}\n.p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button-down {\n    order: 1;\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n}\n.p-inputnumber-buttons-vertical {\n    flex-direction: column;\n}\n.p-inputnumber-buttons-vertical .p-button.p-inputnumber-button-up {\n    order: 1;\n    border-bottom-left-radius: 0;\n    border-bottom-right-radius: 0;\n    width: 100%;\n}\n.p-inputnumber-buttons-vertical .p-inputnumber-input {\n    order: 2;\n    border-radius: 0;\n    text-align: center;\n}\n.p-inputnumber-buttons-vertical .p-button.p-inputnumber-button-down {\n    order: 3;\n    border-top-left-radius: 0;\n    border-top-right-radius: 0;\n    width: 100%;\n}\n.p-inputnumber-input {\n    flex: 1 1 auto;\n}\n.p-fluid .p-inputnumber {\n    width: 100%;\n}\n.p-fluid .p-inputnumber .p-inputnumber-input {\n    width: 1%;\n}\n.p-fluid .p-inputnumber-buttons-vertical .p-inputnumber-input {\n    width: 100%;\n}\n";
styleInject$9(css_248z$9);
script$s.render = render$s;
var script$r = {
  name: "AngleDoubleRightIcon",
  extends: script$J
};
const _hoisted_1$w = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M7.68757 11.1451C7.7791 11.1831 7.8773 11.2024 7.9764 11.2019C8.07769 11.1985 8.17721 11.1745 8.26886 11.1312C8.36052 11.088 8.44238 11.0265 8.50943 10.9505L12.0294 7.49085C12.1707 7.34942 12.25 7.15771 12.25 6.95782C12.25 6.75794 12.1707 6.56622 12.0294 6.42479L8.50943 2.90479C8.37014 2.82159 8.20774 2.78551 8.04633 2.80192C7.88491 2.81833 7.73309 2.88635 7.6134 2.99588C7.4937 3.10541 7.41252 3.25061 7.38189 3.40994C7.35126 3.56927 7.37282 3.73423 7.44337 3.88033L10.4605 6.89748L7.44337 9.91463C7.30212 10.0561 7.22278 10.2478 7.22278 10.4477C7.22278 10.6475 7.30212 10.8393 7.44337 10.9807C7.51301 11.0512 7.59603 11.1071 7.68757 11.1451ZM1.94207 10.9505C2.07037 11.0968 2.25089 11.1871 2.44493 11.2019C2.63898 11.1871 2.81949 11.0968 2.94779 10.9505L6.46779 7.49085C6.60905 7.34942 6.68839 7.15771 6.68839 6.95782C6.68839 6.75793 6.60905 6.56622 6.46779 6.42479L2.94779 2.90479C2.80704 2.83757 2.6489 2.81563 2.49517 2.84201C2.34143 2.86839 2.19965 2.94178 2.08936 3.05207C1.97906 3.16237 1.90567 3.30415 1.8793 3.45788C1.85292 3.61162 1.87485 3.76975 1.94207 3.9105L4.95922 6.92765L1.94207 9.9448C1.81838 10.0831 1.75 10.2621 1.75 10.4477C1.75 10.6332 1.81838 10.8122 1.94207 10.9505Z",
  fill: "currentColor"
}, null, -1);
const _hoisted_2$l = [
  _hoisted_1$w
];
function render$r(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$l, 16);
}
script$r.render = render$r;
var script$q = {
  name: "AngleRightIcon",
  extends: script$J
};
const _hoisted_1$v = /* @__PURE__ */ createBaseVNode("path", {
  d: "M5.25 11.1728C5.14929 11.1694 5.05033 11.1455 4.9592 11.1025C4.86806 11.0595 4.78666 10.9984 4.72 10.9228C4.57955 10.7822 4.50066 10.5916 4.50066 10.3928C4.50066 10.1941 4.57955 10.0035 4.72 9.86283L7.72 6.86283L4.72 3.86283C4.66067 3.71882 4.64765 3.55991 4.68275 3.40816C4.71785 3.25642 4.79932 3.11936 4.91585 3.01602C5.03238 2.91268 5.17819 2.84819 5.33305 2.83149C5.4879 2.81479 5.64411 2.84671 5.78 2.92283L9.28 6.42283C9.42045 6.56346 9.49934 6.75408 9.49934 6.95283C9.49934 7.15158 9.42045 7.34221 9.28 7.48283L5.78 10.9228C5.71333 10.9984 5.63193 11.0595 5.5408 11.1025C5.44966 11.1455 5.35071 11.1694 5.25 11.1728Z",
  fill: "currentColor"
}, null, -1);
const _hoisted_2$k = [
  _hoisted_1$v
];
function render$q(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$k, 16);
}
script$q.render = render$q;
var script$p = {
  name: "AngleLeftIcon",
  extends: script$J
};
const _hoisted_1$u = /* @__PURE__ */ createBaseVNode("path", {
  d: "M8.75 11.185C8.65146 11.1854 8.55381 11.1662 8.4628 11.1284C8.37179 11.0906 8.28924 11.0351 8.22 10.965L4.72 7.46496C4.57955 7.32433 4.50066 7.13371 4.50066 6.93496C4.50066 6.73621 4.57955 6.54558 4.72 6.40496L8.22 2.93496C8.36095 2.84357 8.52851 2.80215 8.69582 2.81733C8.86312 2.83252 9.02048 2.90344 9.14268 3.01872C9.26487 3.134 9.34483 3.28696 9.36973 3.4531C9.39463 3.61924 9.36303 3.78892 9.28 3.93496L6.28 6.93496L9.28 9.93496C9.42045 10.0756 9.49934 10.2662 9.49934 10.465C9.49934 10.6637 9.42045 10.8543 9.28 10.995C9.13526 11.1257 8.9448 11.1939 8.75 11.185Z",
  fill: "currentColor"
}, null, -1);
const _hoisted_2$j = [
  _hoisted_1$u
];
function render$p(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$j, 16);
}
script$p.render = render$p;
var script$9$2 = {
  name: "CurrentPageReport",
  extends: script$K,
  props: {
    pageCount: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 0
    },
    first: {
      type: Number,
      default: 0
    },
    rows: {
      type: Number,
      default: 0
    },
    totalRecords: {
      type: Number,
      default: 0
    },
    template: {
      type: String,
      default: "({currentPage} of {totalPages})"
    }
  },
  computed: {
    text() {
      let text = this.template.replace("{currentPage}", this.currentPage).replace("{totalPages}", this.pageCount).replace("{first}", this.pageCount > 0 ? this.first + 1 : 0).replace("{last}", Math.min(this.first + this.rows, this.totalRecords)).replace("{rows}", this.rows).replace("{totalRecords}", this.totalRecords);
      return text;
    }
  }
};
function render$9$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps({ class: "p-paginator-current" }, _ctx.ptm("current")), toDisplayString($options.text), 17);
}
script$9$2.render = render$9$2;
var script$8$2 = {
  name: "FirstPageLink",
  extends: script$K,
  props: {
    template: {
      type: Function,
      default: null
    }
  },
  methods: {
    getPTOptions(key) {
      return this.ptm(key, {
        context: {
          disabled: this.$attrs.disabled
        }
      });
    }
  },
  computed: {
    containerClass() {
      return [
        "p-paginator-first p-paginator-element p-link",
        {
          "p-disabled": this.$attrs.disabled
        }
      ];
    }
  },
  components: {
    AngleDoubleLeftIcon: script$C
  },
  directives: {
    ripple: Ripple
  }
};
function render$8$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = resolveDirective("ripple");
  return withDirectives((openBlock(), createElementBlock("button", mergeProps({
    class: $options.containerClass,
    type: "button"
  }, $options.getPTOptions("firstPageButton")), [
    (openBlock(), createBlock(resolveDynamicComponent($props.template || "AngleDoubleLeftIcon"), mergeProps({ class: "p-paginator-icon" }, $options.getPTOptions("firstPageIcon")), null, 16))
  ], 16)), [
    [_directive_ripple]
  ]);
}
script$8$2.render = render$8$2;
var script$7$2 = {
  name: "JumpToPageDropdown",
  extends: script$K,
  emits: ["page-change"],
  props: {
    page: Number,
    pageCount: Number,
    disabled: Boolean
  },
  methods: {
    onChange(value) {
      this.$emit("page-change", value);
    }
  },
  computed: {
    pageOptions() {
      let opts = [];
      for (let i = 0; i < this.pageCount; i++) {
        opts.push({ label: String(i + 1), value: i });
      }
      return opts;
    }
  },
  components: {
    JTPDropdown: script$w
  }
};
function render$7$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_JTPDropdown = resolveComponent("JTPDropdown");
  return openBlock(), createBlock(_component_JTPDropdown, {
    modelValue: $props.page,
    options: $options.pageOptions,
    optionLabel: "label",
    optionValue: "value",
    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $options.onChange($event)),
    class: "p-paginator-page-options",
    disabled: $props.disabled,
    pt: _ctx.ptm("JTPDropdown")
  }, null, 8, ["modelValue", "options", "disabled", "pt"]);
}
script$7$2.render = render$7$2;
var script$6$2 = {
  name: "JumpToPageInput",
  extends: script$K,
  inheritAttrs: false,
  emits: ["page-change"],
  props: {
    page: Number,
    pageCount: Number,
    disabled: Boolean
  },
  data() {
    return {
      d_page: this.page
    };
  },
  watch: {
    page(newValue) {
      this.d_page = newValue;
    }
  },
  methods: {
    onChange(value) {
      if (value !== this.page) {
        this.d_page = value;
        this.$emit("page-change", value - 1);
      }
    }
  },
  computed: {
    inputArialabel() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.jumpToPageInputLabel : void 0;
    }
  },
  components: {
    JTPInput: script$s
  }
};
function render$6$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_JTPInput = resolveComponent("JTPInput");
  return openBlock(), createBlock(_component_JTPInput, {
    ref: "jtpInput",
    modelValue: $data.d_page,
    class: "p-paginator-page-input",
    "aria-label": $options.inputArialabel,
    disabled: $props.disabled,
    "onUpdate:modelValue": $options.onChange,
    pt: _ctx.ptm("JTPInput")
  }, null, 8, ["modelValue", "aria-label", "disabled", "onUpdate:modelValue", "pt"]);
}
script$6$2.render = render$6$2;
var script$5$2 = {
  name: "LastPageLink",
  extends: script$K,
  props: {
    template: {
      type: Function,
      default: null
    }
  },
  methods: {
    getPTOptions(key) {
      return this.ptm(key, {
        context: {
          disabled: this.$attrs.disabled
        }
      });
    }
  },
  computed: {
    containerClass() {
      return [
        "p-paginator-last p-paginator-element p-link",
        {
          "p-disabled": this.$attrs.disabled
        }
      ];
    }
  },
  components: {
    AngleDoubleRightIcon: script$r
  },
  directives: {
    ripple: Ripple
  }
};
function render$5$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = resolveDirective("ripple");
  return withDirectives((openBlock(), createElementBlock("button", mergeProps({
    class: $options.containerClass,
    type: "button"
  }, $options.getPTOptions("lastPageButton")), [
    (openBlock(), createBlock(resolveDynamicComponent($props.template || "AngleDoubleRightIcon"), mergeProps({ class: "p-paginator-icon" }, $options.getPTOptions("lastPageIcon")), null, 16))
  ], 16)), [
    [_directive_ripple]
  ]);
}
script$5$2.render = render$5$2;
var script$4$2 = {
  name: "NextPageLink",
  extends: script$K,
  props: {
    template: {
      type: Function,
      default: null
    }
  },
  methods: {
    getPTOptions(key) {
      return this.ptm(key, {
        context: {
          disabled: this.$attrs.disabled
        }
      });
    }
  },
  computed: {
    containerClass() {
      return [
        "p-paginator-next p-paginator-element p-link",
        {
          "p-disabled": this.$attrs.disabled
        }
      ];
    }
  },
  components: {
    AngleRightIcon: script$q
  },
  directives: {
    ripple: Ripple
  }
};
function render$4$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = resolveDirective("ripple");
  return withDirectives((openBlock(), createElementBlock("button", mergeProps({
    class: $options.containerClass,
    type: "button"
  }, $options.getPTOptions("nextPageButton")), [
    (openBlock(), createBlock(resolveDynamicComponent($props.template || "AngleRightIcon"), mergeProps({ class: "p-paginator-icon" }, $options.getPTOptions("nextPageIcon")), null, 16))
  ], 16)), [
    [_directive_ripple]
  ]);
}
script$4$2.render = render$4$2;
var script$3$2 = {
  name: "PageLinks",
  extends: script$K,
  inheritAttrs: false,
  emits: ["click"],
  props: {
    value: Array,
    page: Number
  },
  methods: {
    getPTOptions(pageLink, key) {
      return this.ptm(key, {
        context: {
          active: pageLink === this.page
        }
      });
    },
    onPageLinkClick(event2, pageLink) {
      this.$emit("click", {
        originalEvent: event2,
        value: pageLink
      });
    },
    ariaPageLabel(value) {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.pageLabel.replace(/{page}/g, value) : void 0;
    }
  },
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1$t = ["aria-label", "aria-current", "onClick"];
function render$3$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = resolveDirective("ripple");
  return openBlock(), createElementBlock("span", mergeProps({ class: "p-paginator-pages" }, _ctx.ptm("pages")), [
    (openBlock(true), createElementBlock(Fragment, null, renderList($props.value, (pageLink) => {
      return withDirectives((openBlock(), createElementBlock("button", mergeProps({
        key: pageLink,
        class: ["p-paginator-page p-paginator-element p-link", { "p-highlight": pageLink - 1 === $props.page }],
        type: "button",
        "aria-label": $options.ariaPageLabel(pageLink),
        "aria-current": pageLink - 1 === $props.page ? "page" : void 0,
        onClick: ($event) => $options.onPageLinkClick($event, pageLink)
      }, $options.getPTOptions(pageLink - 1, "pageButton")), [
        createTextVNode(toDisplayString(pageLink), 1)
      ], 16, _hoisted_1$t)), [
        [_directive_ripple]
      ]);
    }), 128))
  ], 16);
}
script$3$2.render = render$3$2;
var script$2$2 = {
  name: "PrevPageLink",
  extends: script$K,
  props: {
    template: {
      type: Function,
      default: null
    }
  },
  methods: {
    getPTOptions(key) {
      return this.ptm(key, {
        context: {
          disabled: this.$attrs.disabled
        }
      });
    }
  },
  computed: {
    containerClass() {
      return [
        "p-paginator-prev p-paginator-element p-link",
        {
          "p-disabled": this.$attrs.disabled
        }
      ];
    }
  },
  components: {
    AngleLeftIcon: script$p
  },
  directives: {
    ripple: Ripple
  }
};
function render$2$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = resolveDirective("ripple");
  return withDirectives((openBlock(), createElementBlock("button", mergeProps({
    class: $options.containerClass,
    type: "button"
  }, $options.getPTOptions("prevPageButton")), [
    (openBlock(), createBlock(resolveDynamicComponent($props.template || "AngleLeftIcon"), mergeProps({ class: "p-paginator-icon" }, $options.getPTOptions("prevPageIcon")), null, 16))
  ], 16)), [
    [_directive_ripple]
  ]);
}
script$2$2.render = render$2$2;
var script$1$2 = {
  name: "RowsPerPageDropdown",
  extends: script$K,
  emits: ["rows-change"],
  props: {
    options: Array,
    rows: Number,
    disabled: Boolean
  },
  methods: {
    onChange(value) {
      this.$emit("rows-change", value);
    }
  },
  computed: {
    rowsOptions() {
      let opts = [];
      if (this.options) {
        for (let i = 0; i < this.options.length; i++) {
          opts.push({ label: String(this.options[i]), value: this.options[i] });
        }
      }
      return opts;
    }
  },
  components: {
    RPPDropdown: script$w
  }
};
function render$1$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_RPPDropdown = resolveComponent("RPPDropdown");
  return openBlock(), createBlock(_component_RPPDropdown, {
    modelValue: $props.rows,
    options: $options.rowsOptions,
    optionLabel: "label",
    optionValue: "value",
    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $options.onChange($event)),
    class: "p-paginator-rpp-options",
    disabled: $props.disabled,
    pt: _ctx.ptm("RPPDropdown")
  }, null, 8, ["modelValue", "options", "disabled", "pt"]);
}
script$1$2.render = render$1$2;
var script$o = {
  name: "Paginator",
  extends: script$K,
  emits: ["update:first", "update:rows", "page"],
  props: {
    totalRecords: {
      type: Number,
      default: 0
    },
    rows: {
      type: Number,
      default: 0
    },
    first: {
      type: Number,
      default: 0
    },
    pageLinkSize: {
      type: Number,
      default: 5
    },
    rowsPerPageOptions: {
      type: Array,
      default: null
    },
    template: {
      type: [Object, String],
      default: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    },
    currentPageReportTemplate: {
      type: null,
      default: "({currentPage} of {totalPages})"
    },
    alwaysShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      d_first: this.first,
      d_rows: this.rows
    };
  },
  watch: {
    first(newValue) {
      this.d_first = newValue;
    },
    rows(newValue) {
      this.d_rows = newValue;
    },
    totalRecords(newValue) {
      if (this.page > 0 && newValue && this.d_first >= newValue) {
        this.changePage(this.pageCount - 1);
      }
    }
  },
  mounted() {
    this.setPaginatorAttribute();
    this.createStyle();
  },
  methods: {
    changePage(p2) {
      const pc = this.pageCount;
      if (p2 >= 0 && p2 < pc) {
        this.d_first = this.d_rows * p2;
        const state = {
          page: p2,
          first: this.d_first,
          rows: this.d_rows,
          pageCount: pc
        };
        this.$emit("update:first", this.d_first);
        this.$emit("update:rows", this.d_rows);
        this.$emit("page", state);
      }
    },
    changePageToFirst(event2) {
      if (!this.isFirstPage) {
        this.changePage(0);
      }
      event2.preventDefault();
    },
    changePageToPrev(event2) {
      this.changePage(this.page - 1);
      event2.preventDefault();
    },
    changePageLink(event2) {
      this.changePage(event2.value - 1);
      event2.originalEvent.preventDefault();
    },
    changePageToNext(event2) {
      this.changePage(this.page + 1);
      event2.preventDefault();
    },
    changePageToLast(event2) {
      if (!this.isLastPage) {
        this.changePage(this.pageCount - 1);
      }
      event2.preventDefault();
    },
    onRowChange(value) {
      this.d_rows = value;
      this.changePage(this.page);
    },
    createStyle() {
      if (this.hasBreakpoints()) {
        this.styleElement = document.createElement("style");
        this.styleElement.type = "text/css";
        document.head.appendChild(this.styleElement);
        let innerHTML = "";
        const keys = Object.keys(this.template);
        const sortedBreakpoints = {};
        keys.sort((a, b) => parseInt(a) - parseInt(b)).forEach((key) => {
          sortedBreakpoints[key] = this.template[key];
        });
        for (const [index, [key]] of Object.entries(Object.entries(sortedBreakpoints))) {
          const minValue = Object.entries(sortedBreakpoints)[index - 1] ? `and (min-width:${Object.keys(sortedBreakpoints)[index - 1]})` : "";
          if (key === "default") {
            innerHTML += `
                            @media screen ${minValue} {
                                .paginator[${this.attributeSelector}],
                                .p-paginator-default{
                                    display: flex !important;
                                }
                            }
                        `;
          } else {
            innerHTML += `
                        .paginator[${this.attributeSelector}], .p-paginator-${key} {
                                display: none !important;
                            }
                        @media screen ${minValue} and (max-width: ${key}) {
                            .paginator[${this.attributeSelector}], .p-paginator-${key} {
                                display: flex !important;
                            }
                            .paginator[${this.attributeSelector}],
                            .p-paginator-default{
                                display: none !important;
                            }
                        }
                    `;
          }
        }
        this.styleElement.innerHTML = innerHTML;
      }
    },
    hasBreakpoints() {
      return typeof this.template === "object";
    },
    getPaginatorClasses(key) {
      return [
        {
          "p-paginator-default": !this.hasBreakpoints(),
          [`p-paginator-${key}`]: this.hasBreakpoints()
        }
      ];
    },
    setPaginatorAttribute() {
      if (this.$refs.paginator && this.$refs.paginator.length >= 0) {
        [...this.$refs.paginator].forEach((el) => {
          el.setAttribute(this.attributeSelector, "");
        });
      }
    },
    getAriaLabel(labelType) {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria[labelType] : void 0;
    }
  },
  computed: {
    templateItems() {
      let keys = {};
      if (this.hasBreakpoints()) {
        keys = this.template;
        if (!keys.default) {
          keys.default = "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown";
        }
        for (const item in keys) {
          keys[item] = this.template[item].split(" ").map((value) => {
            return value.trim();
          });
        }
        return keys;
      }
      keys["default"] = this.template.split(" ").map((value) => {
        return value.trim();
      });
      return keys;
    },
    page() {
      return Math.floor(this.d_first / this.d_rows);
    },
    pageCount() {
      return Math.ceil(this.totalRecords / this.d_rows);
    },
    isFirstPage() {
      return this.page === 0;
    },
    isLastPage() {
      return this.page === this.pageCount - 1;
    },
    calculatePageLinkBoundaries() {
      const numberOfPages = this.pageCount;
      const visiblePages = Math.min(this.pageLinkSize, numberOfPages);
      let start = Math.max(0, Math.ceil(this.page - visiblePages / 2));
      let end = Math.min(numberOfPages - 1, start + visiblePages - 1);
      const delta = this.pageLinkSize - (end - start + 1);
      start = Math.max(0, start - delta);
      return [start, end];
    },
    pageLinks() {
      let pageLinks = [];
      let boundaries = this.calculatePageLinkBoundaries;
      let start = boundaries[0];
      let end = boundaries[1];
      for (var i = start; i <= end; i++) {
        pageLinks.push(i + 1);
      }
      return pageLinks;
    },
    currentState() {
      return {
        page: this.page,
        first: this.d_first,
        rows: this.d_rows
      };
    },
    empty() {
      return this.pageCount === 0;
    },
    currentPage() {
      return this.pageCount > 0 ? this.page + 1 : 0;
    },
    attributeSelector() {
      return UniqueComponentId();
    }
  },
  components: {
    CurrentPageReport: script$9$2,
    FirstPageLink: script$8$2,
    LastPageLink: script$5$2,
    NextPageLink: script$4$2,
    PageLinks: script$3$2,
    PrevPageLink: script$2$2,
    RowsPerPageDropdown: script$1$2,
    JumpToPageDropdown: script$7$2,
    JumpToPageInput: script$6$2
  }
};
function render$o(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FirstPageLink = resolveComponent("FirstPageLink");
  const _component_PrevPageLink = resolveComponent("PrevPageLink");
  const _component_NextPageLink = resolveComponent("NextPageLink");
  const _component_LastPageLink = resolveComponent("LastPageLink");
  const _component_PageLinks = resolveComponent("PageLinks");
  const _component_CurrentPageReport = resolveComponent("CurrentPageReport");
  const _component_RowsPerPageDropdown = resolveComponent("RowsPerPageDropdown");
  const _component_JumpToPageDropdown = resolveComponent("JumpToPageDropdown");
  const _component_JumpToPageInput = resolveComponent("JumpToPageInput");
  return ($props.alwaysShow ? true : $options.pageLinks && $options.pageLinks.length > 1) ? (openBlock(), createElementBlock("nav", normalizeProps(mergeProps({ key: 0 }, _ctx.ptm("root"))), [
    (openBlock(true), createElementBlock(Fragment, null, renderList($options.templateItems, (value, key) => {
      return openBlock(), createElementBlock("div", mergeProps({
        key,
        ref_for: true,
        ref: "paginator",
        class: ["p-paginator p-component", $options.getPaginatorClasses(key)]
      }, _ctx.ptm("paginator")), [
        _ctx.$slots.start ? (openBlock(), createElementBlock("div", mergeProps({
          key: 0,
          class: "p-paginator-left-content"
        }, _ctx.ptm("left")), [
          renderSlot(_ctx.$slots, "start", { state: $options.currentState })
        ], 16)) : createCommentVNode("", true),
        (openBlock(true), createElementBlock(Fragment, null, renderList(value, (item) => {
          return openBlock(), createElementBlock(Fragment, { key: item }, [
            item === "FirstPageLink" ? (openBlock(), createBlock(_component_FirstPageLink, {
              key: 0,
              "aria-label": $options.getAriaLabel("firstPageLabel"),
              template: _ctx.$slots.firstpagelinkicon,
              onClick: _cache[0] || (_cache[0] = ($event) => $options.changePageToFirst($event)),
              disabled: $options.isFirstPage || $options.empty,
              pt: _ctx.pt
            }, null, 8, ["aria-label", "template", "disabled", "pt"])) : item === "PrevPageLink" ? (openBlock(), createBlock(_component_PrevPageLink, {
              key: 1,
              "aria-label": $options.getAriaLabel("prevPageLabel"),
              template: _ctx.$slots.prevpagelinkicon,
              onClick: _cache[1] || (_cache[1] = ($event) => $options.changePageToPrev($event)),
              disabled: $options.isFirstPage || $options.empty,
              pt: _ctx.pt
            }, null, 8, ["aria-label", "template", "disabled", "pt"])) : item === "NextPageLink" ? (openBlock(), createBlock(_component_NextPageLink, {
              key: 2,
              "aria-label": $options.getAriaLabel("nextPageLabel"),
              template: _ctx.$slots.nextpagelinkicon,
              onClick: _cache[2] || (_cache[2] = ($event) => $options.changePageToNext($event)),
              disabled: $options.isLastPage || $options.empty,
              pt: _ctx.pt
            }, null, 8, ["aria-label", "template", "disabled", "pt"])) : item === "LastPageLink" ? (openBlock(), createBlock(_component_LastPageLink, {
              key: 3,
              "aria-label": $options.getAriaLabel("lastPageLabel"),
              template: _ctx.$slots.lastpagelinkicon,
              onClick: _cache[3] || (_cache[3] = ($event) => $options.changePageToLast($event)),
              disabled: $options.isLastPage || $options.empty,
              pt: _ctx.pt
            }, null, 8, ["aria-label", "template", "disabled", "pt"])) : item === "PageLinks" ? (openBlock(), createBlock(_component_PageLinks, {
              key: 4,
              "aria-label": $options.getAriaLabel("pageLabel"),
              value: $options.pageLinks,
              page: $options.page,
              onClick: _cache[4] || (_cache[4] = ($event) => $options.changePageLink($event)),
              pt: _ctx.pt
            }, null, 8, ["aria-label", "value", "page", "pt"])) : item === "CurrentPageReport" ? (openBlock(), createBlock(_component_CurrentPageReport, {
              key: 5,
              "aria-live": "polite",
              template: $props.currentPageReportTemplate,
              currentPage: $options.currentPage,
              page: $options.page,
              pageCount: $options.pageCount,
              first: $data.d_first,
              rows: $data.d_rows,
              totalRecords: $props.totalRecords,
              pt: _ctx.pt
            }, null, 8, ["template", "currentPage", "page", "pageCount", "first", "rows", "totalRecords", "pt"])) : item === "RowsPerPageDropdown" && $props.rowsPerPageOptions ? (openBlock(), createBlock(_component_RowsPerPageDropdown, {
              key: 6,
              "aria-label": $options.getAriaLabel("rowsPerPageLabel"),
              rows: $data.d_rows,
              options: $props.rowsPerPageOptions,
              onRowsChange: _cache[5] || (_cache[5] = ($event) => $options.onRowChange($event)),
              disabled: $options.empty,
              pt: _ctx.pt
            }, null, 8, ["aria-label", "rows", "options", "disabled", "pt"])) : item === "JumpToPageDropdown" ? (openBlock(), createBlock(_component_JumpToPageDropdown, {
              key: 7,
              "aria-label": $options.getAriaLabel("jumpToPageDropdownLabel"),
              page: $options.page,
              pageCount: $options.pageCount,
              onPageChange: _cache[6] || (_cache[6] = ($event) => $options.changePage($event)),
              disabled: $options.empty,
              pt: _ctx.pt
            }, null, 8, ["aria-label", "page", "pageCount", "disabled", "pt"])) : item === "JumpToPageInput" ? (openBlock(), createBlock(_component_JumpToPageInput, {
              key: 8,
              page: $options.currentPage,
              onPageChange: _cache[7] || (_cache[7] = ($event) => $options.changePage($event)),
              disabled: $options.empty,
              pt: _ctx.pt
            }, null, 8, ["page", "disabled", "pt"])) : createCommentVNode("", true)
          ], 64);
        }), 128)),
        _ctx.$slots.end ? (openBlock(), createElementBlock("div", mergeProps({
          key: 1,
          class: "p-paginator-right-content"
        }, _ctx.ptm("end")), [
          renderSlot(_ctx.$slots, "end", { state: $options.currentState })
        ], 16)) : createCommentVNode("", true)
      ], 16);
    }), 128))
  ], 16)) : createCommentVNode("", true);
}
function styleInject$8(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || typeof document === "undefined") {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$8 = "\n.p-paginator-default {\n    display: flex;\n}\n.p-paginator {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex-wrap: wrap;\n}\n.p-paginator-left-content {\n    margin-right: auto;\n}\n.p-paginator-right-content {\n    margin-left: auto;\n}\n.p-paginator-page,\n.p-paginator-next,\n.p-paginator-last,\n.p-paginator-first,\n.p-paginator-prev,\n.p-paginator-current {\n    cursor: pointer;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    line-height: 1;\n    user-select: none;\n    overflow: hidden;\n    position: relative;\n}\n.p-paginator-element:focus {\n    z-index: 1;\n    position: relative;\n}\n";
styleInject$8(css_248z$8);
script$o.render = render$o;
var script$n = {
  name: "ChevronRightIcon",
  extends: script$J
};
const _hoisted_1$s = /* @__PURE__ */ createBaseVNode("path", {
  d: "M4.38708 13C4.28408 13.0005 4.18203 12.9804 4.08691 12.9409C3.99178 12.9014 3.9055 12.8433 3.83313 12.7701C3.68634 12.6231 3.60388 12.4238 3.60388 12.2161C3.60388 12.0084 3.68634 11.8091 3.83313 11.6622L8.50507 6.99022L3.83313 2.31827C3.69467 2.16968 3.61928 1.97313 3.62287 1.77005C3.62645 1.56698 3.70872 1.37322 3.85234 1.22959C3.99596 1.08597 4.18972 1.00371 4.3928 1.00012C4.59588 0.996539 4.79242 1.07192 4.94102 1.21039L10.1669 6.43628C10.3137 6.58325 10.3962 6.78249 10.3962 6.99022C10.3962 7.19795 10.3137 7.39718 10.1669 7.54416L4.94102 12.7701C4.86865 12.8433 4.78237 12.9014 4.68724 12.9409C4.59212 12.9804 4.49007 13.0005 4.38708 13Z",
  fill: "currentColor"
}, null, -1);
const _hoisted_2$i = [
  _hoisted_1$s
];
function render$n(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$i, 16);
}
script$n.render = render$n;
var script$m = {
  name: "BarsIcon",
  extends: script$J
};
const _hoisted_1$r = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  "clip-rule": "evenodd",
  d: "M13.3226 3.6129H0.677419C0.497757 3.6129 0.325452 3.54152 0.198411 3.41448C0.0713707 3.28744 0 3.11514 0 2.93548C0 2.75581 0.0713707 2.58351 0.198411 2.45647C0.325452 2.32943 0.497757 2.25806 0.677419 2.25806H13.3226C13.5022 2.25806 13.6745 2.32943 13.8016 2.45647C13.9286 2.58351 14 2.75581 14 2.93548C14 3.11514 13.9286 3.28744 13.8016 3.41448C13.6745 3.54152 13.5022 3.6129 13.3226 3.6129ZM13.3226 7.67741H0.677419C0.497757 7.67741 0.325452 7.60604 0.198411 7.479C0.0713707 7.35196 0 7.17965 0 6.99999C0 6.82033 0.0713707 6.64802 0.198411 6.52098C0.325452 6.39394 0.497757 6.32257 0.677419 6.32257H13.3226C13.5022 6.32257 13.6745 6.39394 13.8016 6.52098C13.9286 6.64802 14 6.82033 14 6.99999C14 7.17965 13.9286 7.35196 13.8016 7.479C13.6745 7.60604 13.5022 7.67741 13.3226 7.67741ZM0.677419 11.7419H13.3226C13.5022 11.7419 13.6745 11.6706 13.8016 11.5435C13.9286 11.4165 14 11.2442 14 11.0645C14 10.8848 13.9286 10.7125 13.8016 10.5855C13.6745 10.4585 13.5022 10.3871 13.3226 10.3871H0.677419C0.497757 10.3871 0.325452 10.4585 0.198411 10.5855C0.0713707 10.7125 0 10.8848 0 11.0645C0 11.2442 0.0713707 11.4165 0.198411 11.5435C0.325452 11.6706 0.497757 11.7419 0.677419 11.7419Z",
  fill: "currentColor"
}, null, -1);
const _hoisted_2$h = [
  _hoisted_1$r
];
function render$m(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$h, 16);
}
script$m.render = render$m;
var script$l = {
  name: "CheckIcon",
  extends: script$J
};
const _hoisted_1$q = /* @__PURE__ */ createBaseVNode("path", {
  d: "M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z",
  fill: "currentColor"
}, null, -1);
const _hoisted_2$g = [
  _hoisted_1$q
];
function render$l(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$g, 16);
}
script$l.render = render$l;
var script$k = {
  name: "PencilIcon",
  extends: script$J
};
const _hoisted_1$p = /* @__PURE__ */ createBaseVNode("g", { "clip-path": "url(#clip0_414_20836)" }, [
  /* @__PURE__ */ createBaseVNode("path", {
    d: "M0.609628 13.959C0.530658 13.9599 0.452305 13.9451 0.379077 13.9156C0.305849 13.8861 0.239191 13.8424 0.18294 13.787C0.118447 13.7234 0.0688234 13.6464 0.0376166 13.5614C0.00640987 13.4765 -0.00560954 13.3857 0.00241768 13.2956L0.25679 10.1501C0.267698 10.0041 0.331934 9.86709 0.437312 9.76516L9.51265 0.705715C10.0183 0.233014 10.6911 -0.0203041 11.3835 0.00127367C12.0714 0.00660201 12.7315 0.27311 13.2298 0.746671C13.7076 1.23651 13.9824 1.88848 13.9992 2.57201C14.0159 3.25554 13.7733 3.92015 13.32 4.4327L4.23648 13.5331C4.13482 13.6342 4.0017 13.6978 3.85903 13.7133L0.667067 14L0.609628 13.959ZM1.43018 10.4696L1.25787 12.714L3.50619 12.5092L12.4502 3.56444C12.6246 3.35841 12.7361 3.10674 12.7714 2.83933C12.8067 2.57193 12.7644 2.30002 12.6495 2.05591C12.5346 1.8118 12.3519 1.60575 12.1231 1.46224C11.8943 1.31873 11.6291 1.2438 11.3589 1.24633C11.1813 1.23508 11.0033 1.25975 10.8355 1.31887C10.6677 1.37798 10.5136 1.47033 10.3824 1.59036L1.43018 10.4696Z",
    fill: "currentColor"
  })
], -1);
const _hoisted_2$f = /* @__PURE__ */ createBaseVNode("defs", null, [
  /* @__PURE__ */ createBaseVNode("clipPath", { id: "clip0_414_20836" }, [
    /* @__PURE__ */ createBaseVNode("rect", {
      width: "14",
      height: "14",
      fill: "white"
    })
  ])
], -1);
const _hoisted_3$i = [
  _hoisted_1$p,
  _hoisted_2$f
];
function render$k(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_3$i, 16);
}
script$k.render = render$k;
function bind$1(el, binding) {
  const { onFocusIn, onFocusOut } = binding.value || {};
  el.$_pfocustrap_mutationobserver = new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
      if (mutation.type === "childList" && !el.contains(document.activeElement)) {
        const findNextFocusableElement = (el2) => {
          const focusableElement = DomHandler.isFocusableElement(el2) ? el2 : DomHandler.getFirstFocusableElement(el2);
          return ObjectUtils.isNotEmpty(focusableElement) ? focusableElement : findNextFocusableElement(el2.nextSibling);
        };
        DomHandler.focus(findNextFocusableElement(mutation.nextSibling));
      }
    });
  });
  el.$_pfocustrap_mutationobserver.disconnect();
  el.$_pfocustrap_mutationobserver.observe(el, {
    childList: true
  });
  el.$_pfocustrap_focusinlistener = (event2) => onFocusIn && onFocusIn(event2);
  el.$_pfocustrap_focusoutlistener = (event2) => onFocusOut && onFocusOut(event2);
  el.addEventListener("focusin", el.$_pfocustrap_focusinlistener);
  el.addEventListener("focusout", el.$_pfocustrap_focusoutlistener);
}
function unbind(el) {
  el.$_pfocustrap_mutationobserver && el.$_pfocustrap_mutationobserver.disconnect();
  el.$_pfocustrap_focusinlistener && el.removeEventListener("focusin", el.$_pfocustrap_focusinlistener) && (el.$_pfocustrap_focusinlistener = null);
  el.$_pfocustrap_focusoutlistener && el.removeEventListener("focusout", el.$_pfocustrap_focusoutlistener) && (el.$_pfocustrap_focusoutlistener = null);
}
function autoFocus(el, binding) {
  const { autoFocusSelector = "", firstFocusableSelector = "", autoFocus: autoFocus2 = false } = binding.value || {};
  let focusableElement = DomHandler.getFirstFocusableElement(el, `[autofocus]:not(.p-hidden-focusable)${autoFocusSelector}`);
  autoFocus2 && !focusableElement && (focusableElement = DomHandler.getFirstFocusableElement(el, `:not(.p-hidden-focusable)${firstFocusableSelector}`));
  DomHandler.focus(focusableElement);
}
function onFirstHiddenElementFocus(event2) {
  const { currentTarget, relatedTarget } = event2;
  const focusableElement = relatedTarget === currentTarget.$_pfocustrap_lasthiddenfocusableelement ? DomHandler.getFirstFocusableElement(currentTarget.parentElement, `:not(.p-hidden-focusable)${currentTarget.$_pfocustrap_focusableselector}`) : currentTarget.$_pfocustrap_lasthiddenfocusableelement;
  DomHandler.focus(focusableElement);
}
function onLastHiddenElementFocus(event2) {
  const { currentTarget, relatedTarget } = event2;
  const focusableElement = relatedTarget === currentTarget.$_pfocustrap_firsthiddenfocusableelement ? DomHandler.getLastFocusableElement(currentTarget.parentElement, `:not(.p-hidden-focusable)${currentTarget.$_pfocustrap_focusableselector}`) : currentTarget.$_pfocustrap_firsthiddenfocusableelement;
  DomHandler.focus(focusableElement);
}
function createHiddenFocusableElements(el, binding) {
  const { tabIndex = 0, firstFocusableSelector = "", lastFocusableSelector = "" } = binding.value || {};
  const createFocusableElement = (onFocus) => {
    const element = document.createElement("span");
    element.classList = "p-hidden-accessible p-hidden-focusable";
    element.tabIndex = tabIndex;
    element.setAttribute("aria-hidden", "true");
    element.setAttribute("role", "presentation");
    element.addEventListener("focus", onFocus);
    return element;
  };
  const firstFocusableElement = createFocusableElement(onFirstHiddenElementFocus);
  const lastFocusableElement = createFocusableElement(onLastHiddenElementFocus);
  firstFocusableElement.$_pfocustrap_lasthiddenfocusableelement = lastFocusableElement;
  firstFocusableElement.$_pfocustrap_focusableselector = firstFocusableSelector;
  lastFocusableElement.$_pfocustrap_firsthiddenfocusableelement = firstFocusableElement;
  lastFocusableElement.$_pfocustrap_focusableselector = lastFocusableSelector;
  el.prepend(firstFocusableElement);
  el.append(lastFocusableElement);
}
const FocusTrap = {
  mounted(el, binding) {
    const { disabled } = binding.value || {};
    if (!disabled) {
      createHiddenFocusableElements(el, binding);
      bind$1(el, binding);
      autoFocus(el, binding);
    }
  },
  updated(el, binding) {
    const { disabled } = binding.value || {};
    disabled && unbind(el);
  },
  unmounted(el) {
    unbind(el);
  }
};
var script$j = {
  name: "FilterSlashIcon",
  extends: script$J
};
const _hoisted_1$o = /* @__PURE__ */ createBaseVNode("g", { "clip-path": "url(#clip0_408_20963)" }, [
  /* @__PURE__ */ createBaseVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M13.4994 0.0920138C13.5967 0.151519 13.6758 0.236453 13.7283 0.337647C13.7807 0.439133 13.8031 0.553448 13.7929 0.667208C13.7827 0.780968 13.7403 0.889466 13.6707 0.98L11.406 4.06823C11.3099 4.19928 11.1656 4.28679 11.005 4.3115C10.8444 4.33621 10.6805 4.2961 10.5495 4.2C10.4184 4.1039 10.3309 3.95967 10.3062 3.79905C10.2815 3.63843 10.3216 3.47458 10.4177 3.34353L11.9412 1.23529H7.41184C7.24803 1.23529 7.09093 1.17022 6.97509 1.05439C6.85926 0.938558 6.79419 0.781457 6.79419 0.617647C6.79419 0.453837 6.85926 0.296736 6.97509 0.180905C7.09093 0.0650733 7.24803 0 7.41184 0H13.1765C13.2905 0.000692754 13.4022 0.0325088 13.4994 0.0920138ZM4.20008 0.181168H4.24126L13.2013 9.03411C13.3169 9.14992 13.3819 9.3069 13.3819 9.47058C13.3819 9.63426 13.3169 9.79124 13.2013 9.90705C13.1445 9.96517 13.0766 10.0112 13.0016 10.0423C12.9266 10.0735 12.846 10.0891 12.7648 10.0882C12.6836 10.0886 12.6032 10.0728 12.5283 10.0417C12.4533 10.0106 12.3853 9.96479 12.3283 9.90705L9.3142 6.92587L9.26479 6.99999V13.3823C9.26265 13.5455 9.19689 13.7014 9.08152 13.8167C8.96615 13.9321 8.81029 13.9979 8.64714 14H5.35302C5.18987 13.9979 5.03401 13.9321 4.91864 13.8167C4.80327 13.7014 4.73751 13.5455 4.73537 13.3823V6.99999L0.329492 1.02117C0.259855 0.930634 0.21745 0.822137 0.207241 0.708376C0.197031 0.594616 0.21944 0.480301 0.271844 0.378815C0.324343 0.277621 0.403484 0.192687 0.500724 0.133182C0.597964 0.073677 0.709609 0.041861 0.823609 0.0411682H3.86243C3.92448 0.0461551 3.9855 0.060022 4.04361 0.0823446C4.10037 0.10735 4.15311 0.140655 4.20008 0.181168ZM8.02949 6.79411C8.02884 6.66289 8.07235 6.53526 8.15302 6.43176L8.42478 6.05293L3.55773 1.23529H2.0589L5.84714 6.43176C5.92781 6.53526 5.97132 6.66289 5.97067 6.79411V12.7647H8.02949V6.79411Z",
    fill: "currentColor"
  })
], -1);
const _hoisted_2$e = /* @__PURE__ */ createBaseVNode("defs", null, [
  /* @__PURE__ */ createBaseVNode("clipPath", { id: "clip0_408_20963" }, [
    /* @__PURE__ */ createBaseVNode("rect", {
      width: "14",
      height: "14",
      fill: "white"
    })
  ])
], -1);
const _hoisted_3$h = [
  _hoisted_1$o,
  _hoisted_2$e
];
function render$j(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_3$h, 16);
}
script$j.render = render$j;
var script$i = {
  name: "PlusIcon",
  extends: script$J
};
const _hoisted_1$n = /* @__PURE__ */ createBaseVNode("g", { "clip-path": "url(#clip0_306_11939)" }, [
  /* @__PURE__ */ createBaseVNode("path", {
    d: "M7.67742 6.32258V0.677419C7.67742 0.497757 7.60605 0.325452 7.47901 0.198411C7.35197 0.0713707 7.17966 0 7 0C6.82034 0 6.64803 0.0713707 6.52099 0.198411C6.39395 0.325452 6.32258 0.497757 6.32258 0.677419V6.32258H0.677419C0.497757 6.32258 0.325452 6.39395 0.198411 6.52099C0.0713707 6.64803 0 6.82034 0 7C0 7.17966 0.0713707 7.35197 0.198411 7.47901C0.325452 7.60605 0.497757 7.67742 0.677419 7.67742H6.32258V13.3226C6.32492 13.5015 6.39704 13.6725 6.52358 13.799C6.65012 13.9255 6.82106 13.9977 7 14C7.17966 14 7.35197 13.9286 7.47901 13.8016C7.60605 13.6745 7.67742 13.5022 7.67742 13.3226V7.67742H13.3226C13.5022 7.67742 13.6745 7.60605 13.8016 7.47901C13.9286 7.35197 14 7.17966 14 7C13.9977 6.82106 13.9255 6.65012 13.799 6.52358C13.6725 6.39704 13.5015 6.32492 13.3226 6.32258H7.67742Z",
    fill: "currentColor"
  })
], -1);
const _hoisted_2$d = /* @__PURE__ */ createBaseVNode("defs", null, [
  /* @__PURE__ */ createBaseVNode("clipPath", { id: "clip0_306_11939" }, [
    /* @__PURE__ */ createBaseVNode("rect", {
      width: "14",
      height: "14",
      fill: "white"
    })
  ])
], -1);
const _hoisted_3$g = [
  _hoisted_1$n,
  _hoisted_2$d
];
function render$i(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_3$g, 16);
}
script$i.render = render$i;
var script$h = {
  name: "TrashIcon",
  extends: script$J
};
const _hoisted_1$m = /* @__PURE__ */ createBaseVNode("g", { "clip-path": "url(#clip0_417_21589)" }, [
  /* @__PURE__ */ createBaseVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M3.44802 13.9955H10.552C10.8056 14.0129 11.06 13.9797 11.3006 13.898C11.5412 13.8163 11.7632 13.6877 11.9537 13.5196C12.1442 13.3515 12.2995 13.1473 12.4104 12.9188C12.5213 12.6903 12.5858 12.442 12.6 12.1884V4.36041H13.4C13.5591 4.36041 13.7117 4.29722 13.8243 4.18476C13.9368 4.07229 14 3.91976 14 3.76071C14 3.60166 13.9368 3.44912 13.8243 3.33666C13.7117 3.22419 13.5591 3.16101 13.4 3.16101H12.0537C12.0203 3.1557 11.9863 3.15299 11.952 3.15299C11.9178 3.15299 11.8838 3.1557 11.8503 3.16101H11.2285C11.2421 3.10893 11.2487 3.05513 11.248 3.00106V1.80966C11.2171 1.30262 10.9871 0.828306 10.608 0.48989C10.229 0.151475 9.73159 -0.0236625 9.22402 0.00257442H4.77602C4.27251 -0.0171866 3.78126 0.160868 3.40746 0.498617C3.03365 0.836366 2.807 1.30697 2.77602 1.80966V3.00106C2.77602 3.0556 2.78346 3.10936 2.79776 3.16101H0.6C0.521207 3.16101 0.443185 3.17652 0.37039 3.20666C0.297595 3.2368 0.231451 3.28097 0.175736 3.33666C0.120021 3.39235 0.0758251 3.45846 0.0456722 3.53121C0.0155194 3.60397 0 3.68196 0 3.76071C0 3.83946 0.0155194 3.91744 0.0456722 3.9902C0.0758251 4.06296 0.120021 4.12907 0.175736 4.18476C0.231451 4.24045 0.297595 4.28462 0.37039 4.31476C0.443185 4.3449 0.521207 4.36041 0.6 4.36041H1.40002V12.1884C1.41426 12.442 1.47871 12.6903 1.58965 12.9188C1.7006 13.1473 1.85582 13.3515 2.04633 13.5196C2.23683 13.6877 2.45882 13.8163 2.69944 13.898C2.94005 13.9797 3.1945 14.0129 3.44802 13.9955ZM2.60002 4.36041H11.304V12.1884C11.304 12.5163 10.952 12.7961 10.504 12.7961H3.40002C2.97602 12.7961 2.60002 12.5163 2.60002 12.1884V4.36041ZM3.95429 3.16101C3.96859 3.10936 3.97602 3.0556 3.97602 3.00106V1.80966C3.97602 1.48183 4.33602 1.20197 4.77602 1.20197H9.24802C9.66403 1.20197 10.048 1.48183 10.048 1.80966V3.00106C10.0473 3.05515 10.054 3.10896 10.0678 3.16101H3.95429ZM5.57571 10.997C5.41731 10.995 5.26597 10.9311 5.15395 10.8191C5.04193 10.7071 4.97808 10.5558 4.97601 10.3973V6.77517C4.97601 6.61612 5.0392 6.46359 5.15166 6.35112C5.26413 6.23866 5.41666 6.17548 5.57571 6.17548C5.73476 6.17548 5.8873 6.23866 5.99976 6.35112C6.11223 6.46359 6.17541 6.61612 6.17541 6.77517V10.3894C6.17647 10.4688 6.16174 10.5476 6.13208 10.6213C6.10241 10.695 6.05841 10.762 6.00261 10.8186C5.94682 10.8751 5.88035 10.92 5.80707 10.9506C5.73378 10.9813 5.65514 10.9971 5.57571 10.997ZM7.99968 10.8214C8.11215 10.9339 8.26468 10.997 8.42373 10.997C8.58351 10.9949 8.73604 10.93 8.84828 10.8163C8.96052 10.7025 9.02345 10.5491 9.02343 10.3894V6.77517C9.02343 6.61612 8.96025 6.46359 8.84778 6.35112C8.73532 6.23866 8.58278 6.17548 8.42373 6.17548C8.26468 6.17548 8.11215 6.23866 7.99968 6.35112C7.88722 6.46359 7.82404 6.61612 7.82404 6.77517V10.3973C7.82404 10.5564 7.88722 10.7089 7.99968 10.8214Z",
    fill: "currentColor"
  })
], -1);
const _hoisted_2$c = /* @__PURE__ */ createBaseVNode("defs", null, [
  /* @__PURE__ */ createBaseVNode("clipPath", { id: "clip0_417_21589" }, [
    /* @__PURE__ */ createBaseVNode("rect", {
      width: "14",
      height: "14",
      fill: "white"
    })
  ])
], -1);
const _hoisted_3$f = [
  _hoisted_1$m,
  _hoisted_2$c
];
function render$h(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_3$f, 16);
}
script$h.render = render$h;
var script$g = {
  name: "SortAltIcon",
  extends: script$J
};
const _hoisted_1$l = /* @__PURE__ */ createStaticVNode('<g clip-path="url(#clip0_378_15529)"><path d="M5.64515 3.61291C5.47353 3.61291 5.30192 3.54968 5.16644 3.4142L3.38708 1.63484L1.60773 3.4142C1.34579 3.67613 0.912244 3.67613 0.650309 3.4142C0.388374 3.15226 0.388374 2.71871 0.650309 2.45678L2.90837 0.198712C3.17031 -0.0632236 3.60386 -0.0632236 3.86579 0.198712L6.12386 2.45678C6.38579 2.71871 6.38579 3.15226 6.12386 3.4142C5.98837 3.54968 5.81676 3.61291 5.64515 3.61291Z" fill="currentColor"></path><path d="M3.38714 14C3.01681 14 2.70972 13.6929 2.70972 13.3226V0.677419C2.70972 0.307097 3.01681 0 3.38714 0C3.75746 0 4.06456 0.307097 4.06456 0.677419V13.3226C4.06456 13.6929 3.75746 14 3.38714 14Z" fill="currentColor"></path><path d="M10.6129 14C10.4413 14 10.2697 13.9368 10.1342 13.8013L7.87611 11.5432C7.61418 11.2813 7.61418 10.8477 7.87611 10.5858C8.13805 10.3239 8.5716 10.3239 8.83353 10.5858L10.6129 12.3652L12.3922 10.5858C12.6542 10.3239 13.0877 10.3239 13.3497 10.5858C13.6116 10.8477 13.6116 11.2813 13.3497 11.5432L11.0916 13.8013C10.9561 13.9368 10.7845 14 10.6129 14Z" fill="currentColor"></path><path d="M10.6129 14C10.2426 14 9.93552 13.6929 9.93552 13.3226V0.677419C9.93552 0.307097 10.2426 0 10.6129 0C10.9833 0 11.2904 0.307097 11.2904 0.677419V13.3226C11.2904 13.6929 10.9832 14 10.6129 14Z" fill="currentColor"></path></g><defs><clipPath id="clip0_378_15529"><rect width="14" height="14" fill="white"></rect></clipPath></defs>', 2);
const _hoisted_3$e = [
  _hoisted_1$l
];
function render$g(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_3$e, 16);
}
script$g.render = render$g;
var script$f = {
  name: "SortAmountDownIcon",
  extends: script$J
};
const _hoisted_1$k = /* @__PURE__ */ createStaticVNode('<g clip-path="url(#clip0_378_15544)"><path d="M2.59836 13.2009C2.44634 13.2009 2.29432 13.1449 2.1743 13.0248L0.174024 11.0246C-0.0580081 10.7925 -0.0580081 10.4085 0.174024 10.1764C0.406057 9.94441 0.79011 9.94441 1.02214 10.1764L2.59836 11.7527L4.17458 10.1764C4.40662 9.94441 4.79067 9.94441 5.0227 10.1764C5.25473 10.4085 5.25473 10.7925 5.0227 11.0246L3.02242 13.0248C2.90241 13.1449 2.75038 13.2009 2.59836 13.2009Z" fill="currentColor"></path><path d="M2.59836 13.2009C2.27032 13.2009 1.99833 12.9288 1.99833 12.6008V1.39922C1.99833 1.07117 2.27036 0.799133 2.59841 0.799133C2.92646 0.799133 3.19849 1.07117 3.19849 1.39922V12.6008C3.19849 12.9288 2.92641 13.2009 2.59836 13.2009Z" fill="currentColor"></path><path d="M13.3999 11.2006H6.99902C6.67098 11.2006 6.39894 10.9285 6.39894 10.6005C6.39894 10.2725 6.67098 10.0004 6.99902 10.0004H13.3999C13.728 10.0004 14 10.2725 14 10.6005C14 10.9285 13.728 11.2006 13.3999 11.2006Z" fill="currentColor"></path><path d="M10.1995 6.39991H6.99902C6.67098 6.39991 6.39894 6.12788 6.39894 5.79983C6.39894 5.47179 6.67098 5.19975 6.99902 5.19975H10.1995C10.5275 5.19975 10.7996 5.47179 10.7996 5.79983C10.7996 6.12788 10.5275 6.39991 10.1995 6.39991Z" fill="currentColor"></path><path d="M8.59925 3.99958H6.99902C6.67098 3.99958 6.39894 3.72754 6.39894 3.3995C6.39894 3.07145 6.67098 2.79941 6.99902 2.79941H8.59925C8.92729 2.79941 9.19933 3.07145 9.19933 3.3995C9.19933 3.72754 8.92729 3.99958 8.59925 3.99958Z" fill="currentColor"></path><path d="M11.7997 8.80025H6.99902C6.67098 8.80025 6.39894 8.52821 6.39894 8.20017C6.39894 7.87212 6.67098 7.60008 6.99902 7.60008H11.7997C12.1277 7.60008 12.3998 7.87212 12.3998 8.20017C12.3998 8.52821 12.1277 8.80025 11.7997 8.80025Z" fill="currentColor"></path></g><defs><clipPath id="clip0_378_15544"><rect width="14" height="14" fill="white"></rect></clipPath></defs>', 2);
const _hoisted_3$d = [
  _hoisted_1$k
];
function render$f(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_3$d, 16);
}
script$f.render = render$f;
var script$e = {
  name: "SortAmountUpAltIcon",
  extends: script$J
};
const _hoisted_1$j = /* @__PURE__ */ createStaticVNode('<g clip-path="url(#clip0_378_15578)"><path d="M4.59864 3.99958C4.44662 3.99958 4.2946 3.94357 4.17458 3.82356L2.59836 2.24734L1.02214 3.82356C0.79011 4.05559 0.406057 4.05559 0.174024 3.82356C-0.0580081 3.59152 -0.0580081 3.20747 0.174024 2.97544L2.1743 0.97516C2.40634 0.743127 2.79039 0.743127 3.02242 0.97516L5.0227 2.97544C5.25473 3.20747 5.25473 3.59152 5.0227 3.82356C4.90268 3.94357 4.75066 3.99958 4.59864 3.99958Z" fill="currentColor"></path><path d="M2.59841 13.2009C2.27036 13.2009 1.99833 12.9288 1.99833 12.6008V1.39922C1.99833 1.07117 2.27036 0.799133 2.59841 0.799133C2.92646 0.799133 3.19849 1.07117 3.19849 1.39922V12.6008C3.19849 12.9288 2.92646 13.2009 2.59841 13.2009Z" fill="currentColor"></path><path d="M13.3999 11.2006H6.99902C6.67098 11.2006 6.39894 10.9285 6.39894 10.6005C6.39894 10.2725 6.67098 10.0004 6.99902 10.0004H13.3999C13.728 10.0004 14 10.2725 14 10.6005C14 10.9285 13.728 11.2006 13.3999 11.2006Z" fill="currentColor"></path><path d="M10.1995 6.39991H6.99902C6.67098 6.39991 6.39894 6.12788 6.39894 5.79983C6.39894 5.47179 6.67098 5.19975 6.99902 5.19975H10.1995C10.5275 5.19975 10.7996 5.47179 10.7996 5.79983C10.7996 6.12788 10.5275 6.39991 10.1995 6.39991Z" fill="currentColor"></path><path d="M8.59925 3.99958H6.99902C6.67098 3.99958 6.39894 3.72754 6.39894 3.3995C6.39894 3.07145 6.67098 2.79941 6.99902 2.79941H8.59925C8.92729 2.79941 9.19933 3.07145 9.19933 3.3995C9.19933 3.72754 8.92729 3.99958 8.59925 3.99958Z" fill="currentColor"></path><path d="M11.7997 8.80025H6.99902C6.67098 8.80025 6.39894 8.52821 6.39894 8.20017C6.39894 7.87212 6.67098 7.60008 6.99902 7.60008H11.7997C12.1277 7.60008 12.3998 7.87212 12.3998 8.20017C12.3998 8.52821 12.1277 8.80025 11.7997 8.80025Z" fill="currentColor"></path></g><defs><clipPath id="clip0_378_15578"><rect width="14" height="14" fill="white"></rect></clipPath></defs>', 2);
const _hoisted_3$c = [
  _hoisted_1$j
];
function render$e(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_3$c, 16);
}
script$e.render = render$e;
var script$a$1 = {
  name: "RowCheckbox",
  extends: script$K,
  emits: ["change"],
  props: {
    value: null,
    checked: null,
    column: null,
    rowCheckboxIconTemplate: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      focused: false
    };
  },
  methods: {
    getColumnPTOptions(key) {
      return this.ptmo(this.getColumnProp(), key, {
        props: this.column.props,
        parent: {
          props: this.$props,
          state: this.$data
        },
        context: {
          checked: this.checked,
          focused: this.focused,
          disabled: this.$attrs.disabled
        }
      });
    },
    getColumnProp() {
      return this.column.props && this.column.props.pt ? this.column.props.pt : void 0;
    },
    onClick(event2) {
      if (!this.$attrs.disabled) {
        this.$emit("change", {
          originalEvent: event2,
          data: this.value
        });
        DomHandler.focus(this.$refs.input);
      }
      event2.preventDefault();
    },
    onFocus() {
      this.focused = true;
    },
    onBlur() {
      this.focused = false;
    },
    onKeydown(event2) {
      switch (event2.code) {
        case "Space": {
          this.onClick(event2);
          break;
        }
      }
    }
  },
  computed: {
    checkboxAriaLabel() {
      return this.$primevue.config.locale.aria ? this.checked ? this.$primevue.config.locale.aria.selectRow : this.$primevue.config.locale.aria.unselectRow : void 0;
    }
  },
  components: {
    CheckIcon: script$l
  }
};
const _hoisted_1$7$1 = ["checked", "disabled", "tabindex", "aria-label"];
function render$a$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_CheckIcon = resolveComponent("CheckIcon");
  return openBlock(), createElementBlock("div", mergeProps({
    class: ["p-checkbox p-component", { "p-checkbox-focused": $data.focused }],
    onClick: _cache[3] || (_cache[3] = (...args) => $options.onClick && $options.onClick(...args))
  }, $options.getColumnPTOptions("checkboxWrapper")), [
    createBaseVNode("div", mergeProps({ class: "p-hidden-accessible" }, $options.getColumnPTOptions("hiddenInputWrapper")), [
      createBaseVNode("input", mergeProps({
        ref: "input",
        type: "checkbox",
        checked: $props.checked,
        disabled: _ctx.$attrs.disabled,
        tabindex: _ctx.$attrs.disabled ? null : "0",
        "aria-label": $options.checkboxAriaLabel,
        onFocus: _cache[0] || (_cache[0] = ($event) => $options.onFocus($event)),
        onBlur: _cache[1] || (_cache[1] = ($event) => $options.onBlur($event)),
        onKeydown: _cache[2] || (_cache[2] = (...args) => $options.onKeydown && $options.onKeydown(...args))
      }, $options.getColumnPTOptions("hiddenInput")), null, 16, _hoisted_1$7$1)
    ], 16),
    createBaseVNode("div", mergeProps({
      ref: "box",
      class: ["p-checkbox-box p-component", { "p-highlight": $props.checked, "p-disabled": _ctx.$attrs.disabled, "p-focus": $data.focused }]
    }, $options.getColumnPTOptions("checkbox")), [
      $props.rowCheckboxIconTemplate ? (openBlock(), createBlock(resolveDynamicComponent($props.rowCheckboxIconTemplate), {
        key: 0,
        checked: $props.checked,
        class: "p-checkbox-icon"
      }, null, 8, ["checked"])) : !$props.rowCheckboxIconTemplate && !!$props.checked ? (openBlock(), createBlock(_component_CheckIcon, mergeProps({
        key: 1,
        class: "p-checkbox-icon"
      }, $options.getColumnPTOptions("checkboxIcon")), null, 16)) : createCommentVNode("", true)
    ], 16)
  ], 16);
}
script$a$1.render = render$a$1;
var script$9$1 = {
  name: "RowRadioButton",
  extends: script$K,
  inheritAttrs: false,
  emits: ["change"],
  props: {
    value: null,
    checked: null,
    name: null,
    column: null
  },
  data() {
    return {
      focused: false
    };
  },
  methods: {
    getColumnPTOptions(key) {
      return this.ptmo(this.getColumnProp(), key, {
        props: this.column.props,
        parent: {
          props: this.$props,
          state: this.$data
        },
        context: {
          checked: this.checked,
          focused: this.focused,
          disabled: this.$attrs.disabled
        }
      });
    },
    getColumnProp() {
      return this.column.props && this.column.props.pt ? this.column.props.pt : void 0;
    },
    onClick(event2) {
      if (!this.disabled) {
        if (!this.checked) {
          this.$emit("change", {
            originalEvent: event2,
            data: this.value
          });
          DomHandler.focus(this.$refs.input);
        }
      }
    },
    onFocus() {
      this.focused = true;
    },
    onBlur() {
      this.focused = false;
    }
  }
};
const _hoisted_1$6$1 = ["checked", "disabled", "name"];
function render$9$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", mergeProps({
    class: ["p-radiobutton p-component", { "p-radiobutton-focused": $data.focused }],
    onClick: _cache[3] || (_cache[3] = (...args) => $options.onClick && $options.onClick(...args))
  }, $options.getColumnPTOptions("radiobuttonWrapper")), [
    createBaseVNode("div", mergeProps({ class: "p-hidden-accessible" }, _ctx.ptm("hiddenInputWrapper")), [
      createBaseVNode("input", mergeProps({
        ref: "input",
        type: "radio",
        checked: $props.checked,
        disabled: _ctx.$attrs.disabled,
        name: $props.name,
        tabindex: "0",
        onFocus: _cache[0] || (_cache[0] = ($event) => $options.onFocus($event)),
        onBlur: _cache[1] || (_cache[1] = ($event) => $options.onBlur($event)),
        onKeydown: _cache[2] || (_cache[2] = withKeys(withModifiers((...args) => $options.onClick && $options.onClick(...args), ["prevent"]), ["space"]))
      }, $options.getColumnPTOptions("hiddenInput")), null, 16, _hoisted_1$6$1)
    ], 16),
    createBaseVNode("div", mergeProps({
      ref: "box",
      class: ["p-radiobutton-box p-component", { "p-highlight": $props.checked, "p-disabled": _ctx.$attrs.disabled, "p-focus": $data.focused }]
    }, $options.getColumnPTOptions("radiobutton")), [
      createBaseVNode("div", mergeProps({ class: "p-radiobutton-icon" }, $options.getColumnPTOptions("radiobuttonIcon")), null, 16)
    ], 16)
  ], 16);
}
script$9$1.render = render$9$1;
var script$8$1 = {
  name: "BodyCell",
  extends: script$K,
  emits: ["cell-edit-init", "cell-edit-complete", "cell-edit-cancel", "row-edit-init", "row-edit-save", "row-edit-cancel", "row-toggle", "radio-change", "checkbox-change", "editing-meta-change"],
  props: {
    rowData: {
      type: Object,
      default: null
    },
    column: {
      type: Object,
      default: null
    },
    frozenRow: {
      type: Boolean,
      default: false
    },
    rowIndex: {
      type: Number,
      default: null
    },
    index: {
      type: Number,
      default: null
    },
    isRowExpanded: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    editing: {
      type: Boolean,
      default: false
    },
    editingMeta: {
      type: Object,
      default: null
    },
    editMode: {
      type: String,
      default: null
    },
    responsiveLayout: {
      type: String,
      default: "stack"
    },
    virtualScrollerContentProps: {
      type: Object,
      default: null
    },
    ariaControls: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    expandedRowIcon: {
      type: String,
      default: null
    },
    collapsedRowIcon: {
      type: String,
      default: null
    }
  },
  documentEditListener: null,
  selfClick: false,
  overlayEventListener: null,
  data() {
    return {
      d_editing: this.editing,
      styleObject: {}
    };
  },
  watch: {
    editing(newValue) {
      this.d_editing = newValue;
    },
    "$data.d_editing": function(newValue) {
      this.$emit("editing-meta-change", { data: this.rowData, field: this.field || `field_${this.index}`, index: this.rowIndex, editing: newValue });
    }
  },
  mounted() {
    if (this.columnProp("frozen")) {
      this.updateStickyPosition();
    }
  },
  updated() {
    if (this.columnProp("frozen")) {
      this.updateStickyPosition();
    }
    if (this.d_editing && (this.editMode === "cell" || this.editMode === "row" && this.columnProp("rowEditor"))) {
      setTimeout(() => {
        const focusableEl = DomHandler.getFirstFocusableElement(this.$el);
        focusableEl && focusableEl.focus();
      }, 1);
    }
  },
  beforeUnmount() {
    if (this.overlayEventListener) {
      OverlayEventBus.off("overlay-click", this.overlayEventListener);
      this.overlayEventListener = null;
    }
  },
  methods: {
    columnProp(prop) {
      return ObjectUtils.getVNodeProp(this.column, prop);
    },
    getColumnPTOptions(column, key) {
      return this.ptmo(this.getColumnProp(column), key, {
        props: column.props,
        parent: {
          props: this.$props,
          state: this.$data
        }
      });
    },
    getColumnProp(column) {
      return column.props && column.props.pt ? column.props.pt : void 0;
    },
    resolveFieldData() {
      return ObjectUtils.resolveFieldData(this.rowData, this.field);
    },
    toggleRow(event2) {
      this.$emit("row-toggle", {
        originalEvent: event2,
        data: this.rowData
      });
    },
    toggleRowWithRadio(event2, index) {
      this.$emit("radio-change", { originalEvent: event2.originalEvent, index, data: event2.data });
    },
    toggleRowWithCheckbox(event2, index) {
      this.$emit("checkbox-change", { originalEvent: event2.originalEvent, index, data: event2.data });
    },
    isEditable() {
      return this.column.children && this.column.children.editor != null;
    },
    bindDocumentEditListener() {
      if (!this.documentEditListener) {
        this.documentEditListener = (event2) => {
          if (!this.selfClick) {
            this.completeEdit(event2, "outside");
          }
          this.selfClick = false;
        };
        document.addEventListener("click", this.documentEditListener);
      }
    },
    unbindDocumentEditListener() {
      if (this.documentEditListener) {
        document.removeEventListener("click", this.documentEditListener);
        this.documentEditListener = null;
        this.selfClick = false;
      }
    },
    switchCellToViewMode() {
      this.d_editing = false;
      this.unbindDocumentEditListener();
      OverlayEventBus.off("overlay-click", this.overlayEventListener);
      this.overlayEventListener = null;
    },
    onClick(event2) {
      if (this.editMode === "cell" && this.isEditable()) {
        this.selfClick = true;
        if (!this.d_editing) {
          this.d_editing = true;
          this.bindDocumentEditListener();
          this.$emit("cell-edit-init", { originalEvent: event2, data: this.rowData, field: this.field, index: this.rowIndex });
          this.overlayEventListener = (e) => {
            if (this.$el && this.$el.contains(e.target)) {
              this.selfClick = true;
            }
          };
          OverlayEventBus.on("overlay-click", this.overlayEventListener);
        }
      }
    },
    completeEdit(event2, type) {
      const completeEvent = {
        originalEvent: event2,
        data: this.rowData,
        newData: this.editingRowData,
        value: this.rowData[this.field],
        newValue: this.editingRowData[this.field],
        field: this.field,
        index: this.rowIndex,
        type,
        defaultPrevented: false,
        preventDefault: function() {
          this.defaultPrevented = true;
        }
      };
      this.$emit("cell-edit-complete", completeEvent);
      if (!completeEvent.defaultPrevented) {
        this.switchCellToViewMode();
      }
    },
    onKeyDown(event2) {
      if (this.editMode === "cell") {
        switch (event2.code) {
          case "Enter":
            this.completeEdit(event2, "enter");
            break;
          case "Escape":
            this.switchCellToViewMode();
            this.$emit("cell-edit-cancel", { originalEvent: event2, data: this.rowData, field: this.field, index: this.rowIndex });
            break;
          case "Tab":
            this.completeEdit(event2, "tab");
            if (event2.shiftKey)
              this.moveToPreviousCell(event2);
            else
              this.moveToNextCell(event2);
            break;
        }
      }
    },
    moveToPreviousCell(event2) {
      let currentCell = this.findCell(event2.target);
      let targetCell = this.findPreviousEditableColumn(currentCell);
      if (targetCell) {
        DomHandler.invokeElementMethod(targetCell, "click");
        event2.preventDefault();
      }
    },
    moveToNextCell(event2) {
      let currentCell = this.findCell(event2.target);
      let targetCell = this.findNextEditableColumn(currentCell);
      if (targetCell) {
        DomHandler.invokeElementMethod(targetCell, "click");
        event2.preventDefault();
      }
    },
    findCell(element) {
      if (element) {
        let cell = element;
        while (cell && !DomHandler.hasClass(cell, "p-cell-editing")) {
          cell = cell.parentElement;
        }
        return cell;
      } else {
        return null;
      }
    },
    findPreviousEditableColumn(cell) {
      let prevCell = cell.previousElementSibling;
      if (!prevCell) {
        let previousRow = cell.parentElement.previousElementSibling;
        if (previousRow) {
          prevCell = previousRow.lastElementChild;
        }
      }
      if (prevCell) {
        if (DomHandler.hasClass(prevCell, "p-editable-column"))
          return prevCell;
        else
          return this.findPreviousEditableColumn(prevCell);
      } else {
        return null;
      }
    },
    findNextEditableColumn(cell) {
      let nextCell = cell.nextElementSibling;
      if (!nextCell) {
        let nextRow = cell.parentElement.nextElementSibling;
        if (nextRow) {
          nextCell = nextRow.firstElementChild;
        }
      }
      if (nextCell) {
        if (DomHandler.hasClass(nextCell, "p-editable-column"))
          return nextCell;
        else
          return this.findNextEditableColumn(nextCell);
      } else {
        return null;
      }
    },
    isEditingCellValid() {
      return DomHandler.find(this.$el, ".p-invalid").length === 0;
    },
    onRowEditInit(event2) {
      this.$emit("row-edit-init", { originalEvent: event2, data: this.rowData, newData: this.editingRowData, field: this.field, index: this.rowIndex });
    },
    onRowEditSave(event2) {
      this.$emit("row-edit-save", { originalEvent: event2, data: this.rowData, newData: this.editingRowData, field: this.field, index: this.rowIndex });
    },
    onRowEditCancel(event2) {
      this.$emit("row-edit-cancel", { originalEvent: event2, data: this.rowData, newData: this.editingRowData, field: this.field, index: this.rowIndex });
    },
    editorInitCallback(event2) {
      this.$emit("row-edit-init", { originalEvent: event2, data: this.rowData, newData: this.editingRowData, field: this.field, index: this.rowIndex });
    },
    editorSaveCallback(event2) {
      if (this.editMode === "row") {
        this.$emit("row-edit-save", { originalEvent: event2, data: this.rowData, newData: this.editingRowData, field: this.field, index: this.rowIndex });
      } else {
        this.completeEdit(event2, "enter");
      }
    },
    editorCancelCallback(event2) {
      if (this.editMode === "row") {
        this.$emit("row-edit-cancel", { originalEvent: event2, data: this.rowData, newData: this.editingRowData, field: this.field, index: this.rowIndex });
      } else {
        this.switchCellToViewMode();
        this.$emit("cell-edit-cancel", { originalEvent: event2, data: this.rowData, field: this.field, index: this.rowIndex });
      }
    },
    updateStickyPosition() {
      if (this.columnProp("frozen")) {
        let align = this.columnProp("alignFrozen");
        if (align === "right") {
          let right = 0;
          let next = this.$el.nextElementSibling;
          if (next) {
            right = DomHandler.getOuterWidth(next) + parseFloat(next.style.right || 0);
          }
          this.styleObject.right = right + "px";
        } else {
          let left = 0;
          let prev = this.$el.previousElementSibling;
          if (prev) {
            left = DomHandler.getOuterWidth(prev) + parseFloat(prev.style.left || 0);
          }
          this.styleObject.left = left + "px";
        }
      }
    },
    getVirtualScrollerProp(option) {
      return this.virtualScrollerContentProps ? this.virtualScrollerContentProps[option] : null;
    }
  },
  computed: {
    editingRowData() {
      return this.editingMeta[this.rowIndex] ? this.editingMeta[this.rowIndex].data : this.rowData;
    },
    field() {
      return this.columnProp("field");
    },
    containerClass() {
      return [
        this.columnProp("bodyClass"),
        this.columnProp("class"),
        {
          "p-selection-column": this.columnProp("selectionMode") != null,
          "p-editable-column": this.isEditable(),
          "p-cell-editing": this.d_editing,
          "p-frozen-column": this.columnProp("frozen")
        }
      ];
    },
    containerStyle() {
      let bodyStyle = this.columnProp("bodyStyle");
      let columnStyle = this.columnProp("style");
      return this.columnProp("frozen") ? [columnStyle, bodyStyle, this.styleObject] : [columnStyle, bodyStyle];
    },
    loading() {
      return this.getVirtualScrollerProp("loading");
    },
    loadingOptions() {
      const getLoaderOptions = this.getVirtualScrollerProp("getLoaderOptions");
      return getLoaderOptions && getLoaderOptions(this.rowIndex, {
        cellIndex: this.index,
        cellFirst: this.index === 0,
        cellLast: this.index === this.getVirtualScrollerProp("columns").length - 1,
        cellEven: this.index % 2 === 0,
        cellOdd: this.index % 2 !== 0,
        column: this.column,
        field: this.field
      });
    },
    expandButtonAriaLabel() {
      return this.$primevue.config.locale.aria ? this.isRowExpanded ? this.$primevue.config.locale.aria.expandRow : this.$primevue.config.locale.aria.collapseRow : void 0;
    },
    initButtonAriaLabel() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.editRow : void 0;
    },
    saveButtonAriaLabel() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.saveEdit : void 0;
    },
    cancelButtonAriaLabel() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.cancelEdit : void 0;
    }
  },
  components: {
    DTRadioButton: script$9$1,
    DTCheckbox: script$a$1,
    ChevronDownIcon: script$B,
    ChevronRightIcon: script$n,
    BarsIcon: script$m,
    PencilIcon: script$k,
    CheckIcon: script$l,
    TimesIcon: script$z
  },
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1$5$1 = ["aria-expanded", "aria-controls", "aria-label"];
const _hoisted_2$2$1 = ["aria-label"];
const _hoisted_3$2$1 = ["aria-label"];
const _hoisted_4$1$1 = ["aria-label"];
function render$8$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DTRadioButton = resolveComponent("DTRadioButton");
  const _component_DTCheckbox = resolveComponent("DTCheckbox");
  const _component_ChevronDownIcon = resolveComponent("ChevronDownIcon");
  const _component_ChevronRightIcon = resolveComponent("ChevronRightIcon");
  const _directive_ripple = resolveDirective("ripple");
  return $options.loading ? (openBlock(), createElementBlock("td", mergeProps({
    key: 0,
    style: $options.containerStyle,
    class: $options.containerClass,
    role: "cell"
  }, { ...$options.getColumnPTOptions($props.column, "root"), ...$options.getColumnPTOptions($props.column, "bodyCell") }), [
    (openBlock(), createBlock(resolveDynamicComponent($props.column.children.loading), {
      data: $props.rowData,
      column: $props.column,
      field: $options.field,
      index: $props.rowIndex,
      frozenRow: $props.frozenRow,
      loadingOptions: $options.loadingOptions
    }, null, 8, ["data", "column", "field", "index", "frozenRow", "loadingOptions"]))
  ], 16)) : (openBlock(), createElementBlock("td", mergeProps({
    key: 1,
    style: $options.containerStyle,
    class: $options.containerClass,
    onClick: _cache[6] || (_cache[6] = (...args) => $options.onClick && $options.onClick(...args)),
    onKeydown: _cache[7] || (_cache[7] = (...args) => $options.onKeyDown && $options.onKeyDown(...args)),
    role: "cell"
  }, { ...$options.getColumnPTOptions($props.column, "root"), ...$options.getColumnPTOptions($props.column, "bodyCell") }), [
    $props.responsiveLayout === "stack" ? (openBlock(), createElementBlock("span", mergeProps({
      key: 0,
      class: "p-column-title"
    }, $options.getColumnPTOptions($props.column, "columnTitle")), toDisplayString($options.columnProp("header")), 17)) : createCommentVNode("", true),
    $props.column.children && $props.column.children.body && !$data.d_editing ? (openBlock(), createBlock(resolveDynamicComponent($props.column.children.body), {
      key: 1,
      data: $props.rowData,
      column: $props.column,
      field: $options.field,
      index: $props.rowIndex,
      frozenRow: $props.frozenRow,
      editorInitCallback: $options.editorInitCallback
    }, null, 8, ["data", "column", "field", "index", "frozenRow", "editorInitCallback"])) : $props.column.children && $props.column.children.editor && $data.d_editing ? (openBlock(), createBlock(resolveDynamicComponent($props.column.children.editor), {
      key: 2,
      data: $options.editingRowData,
      column: $props.column,
      field: $options.field,
      index: $props.rowIndex,
      frozenRow: $props.frozenRow,
      editorSaveCallback: $options.editorSaveCallback,
      editorCancelCallback: $options.editorCancelCallback
    }, null, 8, ["data", "column", "field", "index", "frozenRow", "editorSaveCallback", "editorCancelCallback"])) : $props.column.children && $props.column.children.body && !$props.column.children.editor && $data.d_editing ? (openBlock(), createBlock(resolveDynamicComponent($props.column.children.body), {
      key: 3,
      data: $options.editingRowData,
      column: $props.column,
      field: $options.field,
      index: $props.rowIndex,
      frozenRow: $props.frozenRow
    }, null, 8, ["data", "column", "field", "index", "frozenRow"])) : $options.columnProp("selectionMode") ? (openBlock(), createElementBlock(Fragment, { key: 4 }, [
      $options.columnProp("selectionMode") === "single" ? (openBlock(), createBlock(_component_DTRadioButton, {
        key: 0,
        value: $props.rowData,
        name: $props.name,
        checked: $props.selected,
        onChange: _cache[0] || (_cache[0] = ($event) => $options.toggleRowWithRadio($event, $props.rowIndex)),
        column: $props.column,
        pt: _ctx.pt
      }, null, 8, ["value", "name", "checked", "column", "pt"])) : $options.columnProp("selectionMode") === "multiple" ? (openBlock(), createBlock(_component_DTCheckbox, {
        key: 1,
        value: $props.rowData,
        checked: $props.selected,
        rowCheckboxIconTemplate: $props.column.children && $props.column.children.rowcheckboxicon,
        "aria-selected": $props.selected ? true : void 0,
        onChange: _cache[1] || (_cache[1] = ($event) => $options.toggleRowWithCheckbox($event, $props.rowIndex)),
        column: $props.column,
        pt: _ctx.pt
      }, null, 8, ["value", "checked", "rowCheckboxIconTemplate", "aria-selected", "column", "pt"])) : createCommentVNode("", true)
    ], 64)) : $options.columnProp("rowReorder") ? (openBlock(), createBlock(resolveDynamicComponent($props.column.children && $props.column.children.rowreordericon ? $props.column.children.rowreordericon : $options.columnProp("rowReorderIcon") ? "i" : "BarsIcon"), {
      key: 5,
      class: normalizeClass(["p-datatable-reorderablerow-handle", $options.columnProp("rowReorderIcon")])
    }, null, 8, ["class"])) : $options.columnProp("expander") ? withDirectives((openBlock(), createElementBlock("button", mergeProps({
      key: 6,
      class: "p-row-toggler p-link",
      type: "button",
      "aria-expanded": $props.isRowExpanded,
      "aria-controls": $props.ariaControls,
      "aria-label": $options.expandButtonAriaLabel,
      onClick: _cache[2] || (_cache[2] = (...args) => $options.toggleRow && $options.toggleRow(...args))
    }, $options.getColumnPTOptions($props.column, "rowToggler")), [
      $props.column.children && $props.column.children.rowtogglericon ? (openBlock(), createBlock(resolveDynamicComponent($props.column.children.rowtogglericon), {
        key: 0,
        rowExpanded: $props.isRowExpanded
      }, null, 8, ["rowExpanded"])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
        $props.isRowExpanded && $props.expandedRowIcon ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: normalizeClass(["p-row-toggler-icon", $props.expandedRowIcon])
        }, null, 2)) : $props.isRowExpanded && !$props.expandedRowIcon ? (openBlock(), createBlock(_component_ChevronDownIcon, mergeProps({
          key: 1,
          class: "p-row-toggler-icon"
        }, $options.getColumnPTOptions($props.column, "rowTogglerIcon")), null, 16)) : !$props.isRowExpanded && $props.collapsedRowIcon ? (openBlock(), createElementBlock("span", {
          key: 2,
          class: normalizeClass(["p-row-toggler-icon", $props.collapsedRowIcon])
        }, null, 2)) : !$props.isRowExpanded && !$props.collapsedRowIcon ? (openBlock(), createBlock(_component_ChevronRightIcon, mergeProps({
          key: 3,
          class: "p-row-toggler-icon"
        }, $options.getColumnPTOptions($props.column, "rowTogglerIcon")), null, 16)) : createCommentVNode("", true)
      ], 64))
    ], 16, _hoisted_1$5$1)), [
      [_directive_ripple]
    ]) : $props.editMode === "row" && $options.columnProp("rowEditor") ? (openBlock(), createElementBlock(Fragment, { key: 7 }, [
      !$data.d_editing ? withDirectives((openBlock(), createElementBlock("button", mergeProps({
        key: 0,
        class: "p-row-editor-init p-link",
        type: "button",
        "aria-label": $options.initButtonAriaLabel,
        onClick: _cache[3] || (_cache[3] = (...args) => $options.onRowEditInit && $options.onRowEditInit(...args))
      }, $options.getColumnPTOptions($props.column, "rowEditorInitButton")), [
        (openBlock(), createBlock(resolveDynamicComponent($props.column.children && $props.column.children.roweditoriniticon || "PencilIcon"), mergeProps({ class: "p-row-editor-init-icon" }, $options.getColumnPTOptions($props.column, "rowEditorInitIcon")), null, 16))
      ], 16, _hoisted_2$2$1)), [
        [_directive_ripple]
      ]) : createCommentVNode("", true),
      $data.d_editing ? withDirectives((openBlock(), createElementBlock("button", mergeProps({
        key: 1,
        class: "p-row-editor-save p-link",
        type: "button",
        "aria-label": $options.saveButtonAriaLabel,
        onClick: _cache[4] || (_cache[4] = (...args) => $options.onRowEditSave && $options.onRowEditSave(...args))
      }, $options.getColumnPTOptions($props.column, "rowEditorEditButton")), [
        (openBlock(), createBlock(resolveDynamicComponent($props.column.children && $props.column.children.roweditorsaveicon || "CheckIcon"), mergeProps({ class: "p-row-editor-save-icon" }, $options.getColumnPTOptions($props.column, "rowEditorEditIcon")), null, 16))
      ], 16, _hoisted_3$2$1)), [
        [_directive_ripple]
      ]) : createCommentVNode("", true),
      $data.d_editing ? withDirectives((openBlock(), createElementBlock("button", mergeProps({
        key: 2,
        class: "p-row-editor-cancel p-link",
        type: "button",
        "aria-label": $options.cancelButtonAriaLabel,
        onClick: _cache[5] || (_cache[5] = (...args) => $options.onRowEditCancel && $options.onRowEditCancel(...args))
      }, $options.getColumnPTOptions($props.column, "rowEditorCancelButton")), [
        (openBlock(), createBlock(resolveDynamicComponent($props.column.children && $props.column.children.roweditorcancelicon || "TimesIcon"), mergeProps({ class: "p-row-editor-cancel-icon" }, $options.getColumnPTOptions($props.column, "rowEditorCancelIcon")), null, 16))
      ], 16, _hoisted_4$1$1)), [
        [_directive_ripple]
      ]) : createCommentVNode("", true)
    ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 8 }, [
      createTextVNode(toDisplayString($options.resolveFieldData()), 1)
    ], 64))
  ], 16));
}
script$8$1.render = render$8$1;
var script$7$1 = {
  name: "TableBody",
  extends: script$K,
  emits: [
    "rowgroup-toggle",
    "row-click",
    "row-dblclick",
    "row-rightclick",
    "row-touchend",
    "row-keydown",
    "row-mousedown",
    "row-dragstart",
    "row-dragover",
    "row-dragleave",
    "row-dragend",
    "row-drop",
    "row-toggle",
    "radio-change",
    "checkbox-change",
    "cell-edit-init",
    "cell-edit-complete",
    "cell-edit-cancel",
    "row-edit-init",
    "row-edit-save",
    "row-edit-cancel",
    "editing-meta-change"
  ],
  props: {
    value: {
      type: Array,
      default: null
    },
    columns: {
      type: null,
      default: null
    },
    frozenRow: {
      type: Boolean,
      default: false
    },
    empty: {
      type: Boolean,
      default: false
    },
    rowGroupMode: {
      type: String,
      default: null
    },
    groupRowsBy: {
      type: [Array, String, Function],
      default: null
    },
    expandableRowGroups: {
      type: Boolean,
      default: false
    },
    expandedRowGroups: {
      type: Array,
      default: null
    },
    first: {
      type: Number,
      default: 0
    },
    dataKey: {
      type: String,
      default: null
    },
    expandedRowIcon: {
      type: String,
      default: null
    },
    collapsedRowIcon: {
      type: String,
      default: null
    },
    expandedRows: {
      type: Array,
      default: null
    },
    expandedRowKeys: {
      type: null,
      default: null
    },
    selection: {
      type: [Array, Object],
      default: null
    },
    selectionKeys: {
      type: null,
      default: null
    },
    selectionMode: {
      type: String,
      default: null
    },
    contextMenu: {
      type: Boolean,
      default: false
    },
    contextMenuSelection: {
      type: Object,
      default: null
    },
    rowClass: {
      type: null,
      default: null
    },
    rowStyle: {
      type: null,
      default: null
    },
    editMode: {
      type: String,
      default: null
    },
    compareSelectionBy: {
      type: String,
      default: "deepEquals"
    },
    editingRows: {
      type: Array,
      default: null
    },
    editingRowKeys: {
      type: null,
      default: null
    },
    editingMeta: {
      type: Object,
      default: null
    },
    templates: {
      type: null,
      default: null
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    responsiveLayout: {
      type: String,
      default: "stack"
    },
    virtualScrollerContentProps: {
      type: Object,
      default: null
    },
    isVirtualScrollerDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rowGroupHeaderStyleObject: {},
      tabindexArray: [],
      isARowSelected: false
    };
  },
  mounted() {
    if (this.frozenRow) {
      this.updateFrozenRowStickyPosition();
    }
    if (this.scrollable && this.rowGroupMode === "subheader") {
      this.updateFrozenRowGroupHeaderStickyPosition();
    }
  },
  updated() {
    if (this.frozenRow) {
      this.updateFrozenRowStickyPosition();
    }
    if (this.scrollable && this.rowGroupMode === "subheader") {
      this.updateFrozenRowGroupHeaderStickyPosition();
    }
  },
  methods: {
    columnProp(col, prop) {
      return ObjectUtils.getVNodeProp(col, prop);
    },
    getColumnPTOptions(column, key) {
      return this.ptmo(this.getColumnProp(column), key, {
        props: column.props,
        parent: {
          props: this.$props,
          state: this.$data
        }
      });
    },
    getColumnProp(column) {
      return column.props && column.props.pt ? column.props.pt : void 0;
    },
    shouldRenderRowGroupHeader(value, rowData, i) {
      let currentRowFieldData = ObjectUtils.resolveFieldData(rowData, this.groupRowsBy);
      let prevRowData = value[i - 1];
      if (prevRowData) {
        let previousRowFieldData = ObjectUtils.resolveFieldData(prevRowData, this.groupRowsBy);
        return currentRowFieldData !== previousRowFieldData;
      } else {
        return true;
      }
    },
    getRowKey(rowData, index) {
      return this.dataKey ? ObjectUtils.resolveFieldData(rowData, this.dataKey) : this.getRowIndex(index);
    },
    getRowIndex(index) {
      const getItemOptions = this.getVirtualScrollerProp("getItemOptions");
      return getItemOptions ? getItemOptions(index).index : this.first + index;
    },
    getRowStyle(rowData) {
      if (this.rowStyle) {
        return this.rowStyle(rowData);
      }
    },
    getRowClass(rowData) {
      let rowStyleClass = [];
      if (this.selectionMode) {
        rowStyleClass.push("p-selectable-row");
      }
      if (this.selection) {
        rowStyleClass.push({
          "p-highlight": this.isSelected(rowData)
        });
      }
      if (this.contextMenuSelection) {
        rowStyleClass.push({
          "p-highlight-contextmenu": this.isSelectedWithContextMenu(rowData)
        });
      }
      if (this.rowClass) {
        let rowClassValue = this.rowClass(rowData);
        if (rowClassValue) {
          rowStyleClass.push(rowClassValue);
        }
      }
      return rowStyleClass;
    },
    shouldRenderRowGroupFooter(value, rowData, i) {
      if (this.expandableRowGroups && !this.isRowGroupExpanded(rowData)) {
        return false;
      } else {
        let currentRowFieldData = ObjectUtils.resolveFieldData(rowData, this.groupRowsBy);
        let nextRowData = value[i + 1];
        if (nextRowData) {
          let nextRowFieldData = ObjectUtils.resolveFieldData(nextRowData, this.groupRowsBy);
          return currentRowFieldData !== nextRowFieldData;
        } else {
          return true;
        }
      }
    },
    shouldRenderBodyCell(value, column, i) {
      if (this.rowGroupMode) {
        if (this.rowGroupMode === "subheader") {
          return this.groupRowsBy !== this.columnProp(column, "field");
        } else if (this.rowGroupMode === "rowspan") {
          if (this.isGrouped(column)) {
            let prevRowData = value[i - 1];
            if (prevRowData) {
              let currentRowFieldData = ObjectUtils.resolveFieldData(value[i], this.columnProp(column, "field"));
              let previousRowFieldData = ObjectUtils.resolveFieldData(prevRowData, this.columnProp(column, "field"));
              return currentRowFieldData !== previousRowFieldData;
            } else {
              return true;
            }
          } else {
            return true;
          }
        }
      } else {
        return !this.columnProp(column, "hidden");
      }
    },
    calculateRowGroupSize(value, column, index) {
      if (this.isGrouped(column)) {
        let currentRowFieldData = ObjectUtils.resolveFieldData(value[index], this.columnProp(column, "field"));
        let nextRowFieldData = currentRowFieldData;
        let groupRowSpan = 0;
        while (currentRowFieldData === nextRowFieldData) {
          groupRowSpan++;
          let nextRowData = value[++index];
          if (nextRowData) {
            nextRowFieldData = ObjectUtils.resolveFieldData(nextRowData, this.columnProp(column, "field"));
          } else {
            break;
          }
        }
        return groupRowSpan === 1 ? null : groupRowSpan;
      } else {
        return null;
      }
    },
    isGrouped(column) {
      if (this.groupRowsBy && this.columnProp(column, "field")) {
        if (Array.isArray(this.groupRowsBy))
          return this.groupRowsBy.indexOf(column.props.field) > -1;
        else
          return this.groupRowsBy === column.props.field;
      } else {
        return false;
      }
    },
    isRowEditing(rowData) {
      if (rowData && this.editingRows) {
        if (this.dataKey)
          return this.editingRowKeys ? this.editingRowKeys[ObjectUtils.resolveFieldData(rowData, this.dataKey)] !== void 0 : false;
        else
          return this.findIndex(rowData, this.editingRows) > -1;
      }
      return false;
    },
    isRowExpanded(rowData) {
      if (rowData && this.expandedRows) {
        if (this.dataKey)
          return this.expandedRowKeys ? this.expandedRowKeys[ObjectUtils.resolveFieldData(rowData, this.dataKey)] !== void 0 : false;
        else
          return this.findIndex(rowData, this.expandedRows) > -1;
      }
      return false;
    },
    isRowGroupExpanded(rowData) {
      if (this.expandableRowGroups && this.expandedRowGroups) {
        let groupFieldValue = ObjectUtils.resolveFieldData(rowData, this.groupRowsBy);
        return this.expandedRowGroups.indexOf(groupFieldValue) > -1;
      }
      return false;
    },
    isSelected(rowData) {
      if (rowData && this.selection) {
        if (this.dataKey) {
          return this.selectionKeys ? this.selectionKeys[ObjectUtils.resolveFieldData(rowData, this.dataKey)] !== void 0 : false;
        } else {
          if (this.selection instanceof Array)
            return this.findIndexInSelection(rowData) > -1;
          else
            return this.equals(rowData, this.selection);
        }
      }
      return false;
    },
    isSelectedWithContextMenu(rowData) {
      if (rowData && this.contextMenuSelection) {
        return this.equals(rowData, this.contextMenuSelection, this.dataKey);
      }
      return false;
    },
    findIndexInSelection(rowData) {
      return this.findIndex(rowData, this.selection);
    },
    findIndex(rowData, collection) {
      let index = -1;
      if (collection && collection.length) {
        for (let i = 0; i < collection.length; i++) {
          if (this.equals(rowData, collection[i])) {
            index = i;
            break;
          }
        }
      }
      return index;
    },
    equals(data1, data2) {
      return this.compareSelectionBy === "equals" ? data1 === data2 : ObjectUtils.equals(data1, data2, this.dataKey);
    },
    onRowGroupToggle(event2, data) {
      this.$emit("rowgroup-toggle", { originalEvent: event2, data });
    },
    onRowClick(event2, rowData, rowIndex) {
      this.$emit("row-click", { originalEvent: event2, data: rowData, index: rowIndex });
    },
    onRowDblClick(event2, rowData, rowIndex) {
      this.$emit("row-dblclick", { originalEvent: event2, data: rowData, index: rowIndex });
    },
    onRowRightClick(event2, rowData, rowIndex) {
      this.$emit("row-rightclick", { originalEvent: event2, data: rowData, index: rowIndex });
    },
    onRowTouchEnd(event2) {
      this.$emit("row-touchend", event2);
    },
    onRowKeyDown(event2, rowData, rowIndex) {
      this.$emit("row-keydown", { originalEvent: event2, data: rowData, index: rowIndex });
    },
    onRowMouseDown(event2) {
      this.$emit("row-mousedown", event2);
    },
    onRowDragStart(event2, rowIndex) {
      this.$emit("row-dragstart", { originalEvent: event2, index: rowIndex });
    },
    onRowDragOver(event2, rowIndex) {
      this.$emit("row-dragover", { originalEvent: event2, index: rowIndex });
    },
    onRowDragLeave(event2) {
      this.$emit("row-dragleave", event2);
    },
    onRowDragEnd(event2) {
      this.$emit("row-dragend", event2);
    },
    onRowDrop(event2) {
      this.$emit("row-drop", event2);
    },
    onRowToggle(event2) {
      this.$emit("row-toggle", event2);
    },
    onRadioChange(event2) {
      this.$emit("radio-change", event2);
    },
    onCheckboxChange(event2) {
      this.$emit("checkbox-change", event2);
    },
    onCellEditInit(event2) {
      this.$emit("cell-edit-init", event2);
    },
    onCellEditComplete(event2) {
      this.$emit("cell-edit-complete", event2);
    },
    onCellEditCancel(event2) {
      this.$emit("cell-edit-cancel", event2);
    },
    onRowEditInit(event2) {
      this.$emit("row-edit-init", event2);
    },
    onRowEditSave(event2) {
      this.$emit("row-edit-save", event2);
    },
    onRowEditCancel(event2) {
      this.$emit("row-edit-cancel", event2);
    },
    onEditingMetaChange(event2) {
      this.$emit("editing-meta-change", event2);
    },
    updateFrozenRowStickyPosition() {
      this.$el.style.top = DomHandler.getOuterHeight(this.$el.previousElementSibling) + "px";
    },
    updateFrozenRowGroupHeaderStickyPosition() {
      let tableHeaderHeight = DomHandler.getOuterHeight(this.$el.previousElementSibling);
      this.rowGroupHeaderStyleObject.top = tableHeaderHeight + "px";
    },
    getVirtualScrollerProp(option, options) {
      options = options || this.virtualScrollerContentProps;
      return options ? options[option] : null;
    },
    bodyRef(el) {
      const contentRef = this.getVirtualScrollerProp("contentRef");
      contentRef && contentRef(el);
    },
    setRowTabindex(index) {
      if (this.selection === null && (this.selectionMode === "single" || this.selectionMode === "multiple")) {
        return index === 0 ? 0 : -1;
      }
      return -1;
    }
  },
  computed: {
    columnsLength() {
      let hiddenColLength = 0;
      this.columns.forEach((column) => {
        if (this.columnProp(column, "selectionMode") === "single")
          hiddenColLength--;
        if (this.columnProp(column, "hidden"))
          hiddenColLength++;
      });
      return this.columns ? this.columns.length - hiddenColLength : 0;
    },
    rowGroupHeaderStyle() {
      if (this.scrollable) {
        return { top: this.rowGroupHeaderStyleObject.top };
      }
      return null;
    },
    bodyStyle() {
      return this.getVirtualScrollerProp("contentStyle");
    },
    expandedRowId() {
      return UniqueComponentId();
    },
    nameAttributeSelector() {
      return UniqueComponentId();
    }
  },
  components: {
    DTBodyCell: script$8$1,
    ChevronDownIcon: script$B,
    ChevronRightIcon: script$n
  }
};
const _hoisted_1$4$1 = ["colspan"];
const _hoisted_2$1$1 = ["onClick"];
const _hoisted_3$1$1 = ["tabindex", "aria-selected", "onClick", "onDblclick", "onContextmenu", "onKeydown", "onDragstart", "onDragover"];
const _hoisted_4$4 = ["id"];
const _hoisted_5$3 = ["colspan"];
const _hoisted_6$1 = ["colspan"];
const _hoisted_7$1 = ["colspan"];
function render$7$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ChevronDownIcon = resolveComponent("ChevronDownIcon");
  const _component_ChevronRightIcon = resolveComponent("ChevronRightIcon");
  const _component_DTBodyCell = resolveComponent("DTBodyCell");
  return openBlock(), createElementBlock("tbody", mergeProps({
    ref: $options.bodyRef,
    class: "p-datatable-tbody",
    role: "rowgroup",
    style: $options.bodyStyle
  }, _ctx.ptm("tbody")), [
    !$props.empty ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList($props.value, (rowData, index) => {
      return openBlock(), createElementBlock(Fragment, null, [
        $props.templates["groupheader"] && $props.rowGroupMode === "subheader" && $options.shouldRenderRowGroupHeader($props.value, rowData, $options.getRowIndex(index)) ? (openBlock(), createElementBlock("tr", mergeProps({
          key: $options.getRowKey(rowData, $options.getRowIndex(index)) + "_subheader",
          class: "p-rowgroup-header",
          style: $options.rowGroupHeaderStyle,
          role: "row"
        }, _ctx.ptm("rowgroupHeader")), [
          createBaseVNode("td", mergeProps({
            colspan: $options.columnsLength - 1
          }, { ...$options.getColumnPTOptions("root"), ...$options.getColumnPTOptions("bodyCell") }), [
            $props.expandableRowGroups ? (openBlock(), createElementBlock("button", mergeProps({
              key: 0,
              class: "p-row-toggler p-link",
              onClick: ($event) => $options.onRowGroupToggle($event, rowData),
              type: "button"
            }, $options.getColumnPTOptions("rowGroupToggler")), [
              $props.templates["rowgrouptogglericon"] ? (openBlock(), createBlock(resolveDynamicComponent($props.templates["rowgrouptogglericon"]), {
                key: 0,
                expanded: $options.isRowGroupExpanded(rowData)
              }, null, 8, ["expanded"])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                $options.isRowGroupExpanded(rowData) && $props.expandedRowIcon ? (openBlock(), createElementBlock("span", {
                  key: 0,
                  class: normalizeClass(["p-row-toggler-icon", $props.expandedRowIcon])
                }, null, 2)) : $options.isRowGroupExpanded(rowData) && !$props.expandedRowIcon ? (openBlock(), createBlock(_component_ChevronDownIcon, mergeProps({
                  key: 1,
                  class: "p-row-toggler-icon"
                }, $options.getColumnPTOptions("rowGroupTogglerIcon")), null, 16)) : !$options.isRowGroupExpanded(rowData) && $props.collapsedRowIcon ? (openBlock(), createElementBlock("span", {
                  key: 2,
                  class: normalizeClass(["p-row-toggler-icon", $props.collapsedRowIcon])
                }, null, 2)) : !$options.isRowGroupExpanded(rowData) && !$props.collapsedRowIcon ? (openBlock(), createBlock(_component_ChevronRightIcon, mergeProps({
                  key: 3,
                  class: "p-row-toggler-icon"
                }, $options.getColumnPTOptions("rowGroupTogglerIcon")), null, 16)) : createCommentVNode("", true)
              ], 64))
            ], 16, _hoisted_2$1$1)) : createCommentVNode("", true),
            (openBlock(), createBlock(resolveDynamicComponent($props.templates["groupheader"]), {
              data: rowData,
              index: $options.getRowIndex(index)
            }, null, 8, ["data", "index"]))
          ], 16, _hoisted_1$4$1)
        ], 16)) : createCommentVNode("", true),
        ($props.expandableRowGroups ? $options.isRowGroupExpanded(rowData) : true) ? (openBlock(), createElementBlock("tr", mergeProps({
          key: $options.getRowKey(rowData, $options.getRowIndex(index)),
          class: $options.getRowClass(rowData),
          style: $options.getRowStyle(rowData),
          tabindex: $options.setRowTabindex(index),
          role: "row",
          "aria-selected": $props.selectionMode ? $options.isSelected(rowData) : null,
          onClick: ($event) => $options.onRowClick($event, rowData, $options.getRowIndex(index)),
          onDblclick: ($event) => $options.onRowDblClick($event, rowData, $options.getRowIndex(index)),
          onContextmenu: ($event) => $options.onRowRightClick($event, rowData, $options.getRowIndex(index)),
          onTouchend: _cache[9] || (_cache[9] = ($event) => $options.onRowTouchEnd($event)),
          onKeydown: ($event) => $options.onRowKeyDown($event, rowData, $options.getRowIndex(index)),
          onMousedown: _cache[10] || (_cache[10] = ($event) => $options.onRowMouseDown($event)),
          onDragstart: ($event) => $options.onRowDragStart($event, $options.getRowIndex(index)),
          onDragover: ($event) => $options.onRowDragOver($event, $options.getRowIndex(index)),
          onDragleave: _cache[11] || (_cache[11] = ($event) => $options.onRowDragLeave($event)),
          onDragend: _cache[12] || (_cache[12] = ($event) => $options.onRowDragEnd($event)),
          onDrop: _cache[13] || (_cache[13] = ($event) => $options.onRowDrop($event))
        }, _ctx.ptm("row")), [
          (openBlock(true), createElementBlock(Fragment, null, renderList($props.columns, (col, i) => {
            return openBlock(), createElementBlock(Fragment, null, [
              $options.shouldRenderBodyCell($props.value, col, $options.getRowIndex(index)) ? (openBlock(), createBlock(_component_DTBodyCell, {
                key: $options.columnProp(col, "columnKey") || $options.columnProp(col, "field") || i,
                rowData,
                column: col,
                rowIndex: $options.getRowIndex(index),
                index: i,
                selected: $options.isSelected(rowData),
                frozenRow: $props.frozenRow,
                rowspan: $props.rowGroupMode === "rowspan" ? $options.calculateRowGroupSize($props.value, col, $options.getRowIndex(index)) : null,
                editMode: $props.editMode,
                editing: $props.editMode === "row" && $options.isRowEditing(rowData),
                editingMeta: $props.editingMeta,
                responsiveLayout: $props.responsiveLayout,
                virtualScrollerContentProps: $props.virtualScrollerContentProps,
                ariaControls: $options.expandedRowId + "_" + index + "_expansion",
                name: $options.nameAttributeSelector,
                isRowExpanded: $options.isRowExpanded(rowData),
                expandedRowIcon: $props.expandedRowIcon,
                collapsedRowIcon: $props.collapsedRowIcon,
                onRadioChange: _cache[0] || (_cache[0] = ($event) => $options.onRadioChange($event)),
                onCheckboxChange: _cache[1] || (_cache[1] = ($event) => $options.onCheckboxChange($event)),
                onRowToggle: _cache[2] || (_cache[2] = ($event) => $options.onRowToggle($event)),
                onCellEditInit: _cache[3] || (_cache[3] = ($event) => $options.onCellEditInit($event)),
                onCellEditComplete: _cache[4] || (_cache[4] = ($event) => $options.onCellEditComplete($event)),
                onCellEditCancel: _cache[5] || (_cache[5] = ($event) => $options.onCellEditCancel($event)),
                onRowEditInit: _cache[6] || (_cache[6] = ($event) => $options.onRowEditInit($event)),
                onRowEditSave: _cache[7] || (_cache[7] = ($event) => $options.onRowEditSave($event)),
                onRowEditCancel: _cache[8] || (_cache[8] = ($event) => $options.onRowEditCancel($event)),
                onEditingMetaChange: $options.onEditingMetaChange,
                pt: _ctx.pt
              }, null, 8, ["rowData", "column", "rowIndex", "index", "selected", "frozenRow", "rowspan", "editMode", "editing", "editingMeta", "responsiveLayout", "virtualScrollerContentProps", "ariaControls", "name", "isRowExpanded", "expandedRowIcon", "collapsedRowIcon", "onEditingMetaChange", "pt"])) : createCommentVNode("", true)
            ], 64);
          }), 256))
        ], 16, _hoisted_3$1$1)) : createCommentVNode("", true),
        $props.templates["expansion"] && $props.expandedRows && $options.isRowExpanded(rowData) ? (openBlock(), createElementBlock("tr", mergeProps({
          key: $options.getRowKey(rowData, $options.getRowIndex(index)) + "_expansion",
          id: $options.expandedRowId + "_" + index + "_expansion",
          class: "p-datatable-row-expansion",
          role: "row"
        }, _ctx.ptm("rowExpansion")), [
          createBaseVNode("td", mergeProps({ colspan: $options.columnsLength }, { ...$options.getColumnPTOptions("root"), ...$options.getColumnPTOptions("bodyCell") }), [
            (openBlock(), createBlock(resolveDynamicComponent($props.templates["expansion"]), {
              data: rowData,
              index: $options.getRowIndex(index)
            }, null, 8, ["data", "index"]))
          ], 16, _hoisted_5$3)
        ], 16, _hoisted_4$4)) : createCommentVNode("", true),
        $props.templates["groupfooter"] && $props.rowGroupMode === "subheader" && $options.shouldRenderRowGroupFooter($props.value, rowData, $options.getRowIndex(index)) ? (openBlock(), createElementBlock("tr", mergeProps({
          key: $options.getRowKey(rowData, $options.getRowIndex(index)) + "_subfooter",
          class: "p-rowgroup-footer",
          role: "row"
        }, _ctx.ptm("rowgroupFooter")), [
          createBaseVNode("td", mergeProps({
            colspan: $options.columnsLength - 1
          }, { ...$options.getColumnPTOptions("root"), ...$options.getColumnPTOptions("bodyCell") }), [
            (openBlock(), createBlock(resolveDynamicComponent($props.templates["groupfooter"]), {
              data: rowData,
              index: $options.getRowIndex(index)
            }, null, 8, ["data", "index"]))
          ], 16, _hoisted_6$1)
        ], 16)) : createCommentVNode("", true)
      ], 64);
    }), 256)) : (openBlock(), createElementBlock("tr", mergeProps({
      key: 1,
      class: "p-datatable-emptymessage",
      role: "row"
    }, _ctx.ptm("emptyMessage")), [
      createBaseVNode("td", mergeProps({ colspan: $options.columnsLength }, { ...$options.getColumnPTOptions("root"), ...$options.getColumnPTOptions("bodyCell") }), [
        $props.templates.empty ? (openBlock(), createBlock(resolveDynamicComponent($props.templates.empty), { key: 0 })) : createCommentVNode("", true)
      ], 16, _hoisted_7$1)
    ], 16))
  ], 16);
}
script$7$1.render = render$7$1;
var script$6$1 = {
  name: "FooterCell",
  extends: script$K,
  props: {
    column: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      styleObject: {}
    };
  },
  mounted() {
    if (this.columnProp("frozen")) {
      this.updateStickyPosition();
    }
  },
  updated() {
    if (this.columnProp("frozen")) {
      this.updateStickyPosition();
    }
  },
  methods: {
    columnProp(prop) {
      return ObjectUtils.getVNodeProp(this.column, prop);
    },
    getColumnPTOptions(key) {
      return this.ptmo(this.getColumnProp(), key, {
        props: this.column.props,
        parent: {
          props: this.$props,
          state: this.$data
        }
      });
    },
    getColumnProp() {
      return this.column.props && this.column.props.pt ? this.column.props.pt : void 0;
    },
    updateStickyPosition() {
      if (this.columnProp("frozen")) {
        let align = this.columnProp("alignFrozen");
        if (align === "right") {
          let right = 0;
          let next = this.$el.nextElementSibling;
          if (next) {
            right = DomHandler.getOuterWidth(next) + parseFloat(next.style.right || 0);
          }
          this.styleObject.right = right + "px";
        } else {
          let left = 0;
          let prev = this.$el.previousElementSibling;
          if (prev) {
            left = DomHandler.getOuterWidth(prev) + parseFloat(prev.style.left || 0);
          }
          this.styleObject.left = left + "px";
        }
      }
    }
  },
  computed: {
    containerClass() {
      return [
        this.columnProp("footerClass"),
        this.columnProp("class"),
        {
          "p-frozen-column": this.columnProp("frozen")
        }
      ];
    },
    containerStyle() {
      let bodyStyle = this.columnProp("footerStyle");
      let columnStyle = this.columnProp("style");
      return this.columnProp("frozen") ? [columnStyle, bodyStyle, this.styleObject] : [columnStyle, bodyStyle];
    }
  }
};
const _hoisted_1$3$1 = ["colspan", "rowspan"];
function render$6$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("td", mergeProps({
    style: $options.containerStyle,
    class: $options.containerClass,
    role: "cell",
    colspan: $options.columnProp("colspan"),
    rowspan: $options.columnProp("rowspan")
  }, { ...$options.getColumnPTOptions("root"), ...$options.getColumnPTOptions("footerCell") }), [
    $props.column.children && $props.column.children.footer ? (openBlock(), createBlock(resolveDynamicComponent($props.column.children.footer), {
      key: 0,
      column: $props.column
    }, null, 8, ["column"])) : createCommentVNode("", true),
    createTextVNode(" " + toDisplayString($options.columnProp("footer")), 1)
  ], 16, _hoisted_1$3$1);
}
script$6$1.render = render$6$1;
var script$5$1 = {
  name: "TableFooter",
  extends: script$K,
  props: {
    columnGroup: {
      type: null,
      default: null
    },
    columns: {
      type: Object,
      default: null
    }
  },
  methods: {
    columnProp(col, prop) {
      return ObjectUtils.getVNodeProp(col, prop);
    },
    getColumnGroupPTOptions(key) {
      return this.ptmo(this.getColumnGroupProps(), key, {
        props: this.getColumnGroupProps(),
        parent: {
          props: this.$props,
          state: this.$data
        }
      });
    },
    getColumnGroupProps() {
      return this.columnGroup && this.columnGroup.props && this.columnGroup.props.pt ? this.columnGroup.props.pt : void 0;
    },
    getRowPTOptions(row, key) {
      return this.ptmo(this.getRowProp(row), key, {
        props: row.props,
        parent: {
          props: this.$props,
          state: this.$data
        }
      });
    },
    getRowProp(row) {
      return row.props && row.props.pt ? row.props.pt : void 0;
    },
    getFooterRows() {
      let rows = [];
      let columnGroup = this.columnGroup;
      if (columnGroup.children && columnGroup.children.default) {
        for (let child of columnGroup.children.default()) {
          if (child.type.name === "Row") {
            rows.push(child);
          } else if (child.children && child.children instanceof Array) {
            rows = child.children;
          }
        }
        return rows;
      }
    },
    getFooterColumns(row) {
      let cols = [];
      if (row.children && row.children.default) {
        row.children.default().forEach((child) => {
          if (child.children && child.children instanceof Array)
            cols = [...cols, ...child.children];
          else if (child.type.name === "Column")
            cols.push(child);
        });
        return cols;
      }
    }
  },
  computed: {
    hasFooter() {
      let hasFooter = false;
      if (this.columnGroup) {
        hasFooter = true;
      } else if (this.columns) {
        for (let col of this.columns) {
          if (this.columnProp(col, "footer") || col.children && col.children.footer) {
            hasFooter = true;
            break;
          }
        }
      }
      return hasFooter;
    }
  },
  components: {
    DTFooterCell: script$6$1
  }
};
function render$5$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DTFooterCell = resolveComponent("DTFooterCell");
  return $options.hasFooter ? (openBlock(), createElementBlock("tfoot", mergeProps({
    key: 0,
    class: "p-datatable-tfoot",
    role: "rowgroup"
  }, { ..._ctx.ptm("tfoot"), ...$options.getColumnGroupPTOptions("root") }), [
    !$props.columnGroup ? (openBlock(), createElementBlock("tr", mergeProps({
      key: 0,
      role: "row"
    }, _ctx.ptm("footerRow")), [
      (openBlock(true), createElementBlock(Fragment, null, renderList($props.columns, (col, i) => {
        return openBlock(), createElementBlock(Fragment, {
          key: $options.columnProp(col, "columnKey") || $options.columnProp(col, "field") || i
        }, [
          !$options.columnProp(col, "hidden") ? (openBlock(), createBlock(_component_DTFooterCell, {
            key: 0,
            column: col,
            pt: _ctx.pt
          }, null, 8, ["column", "pt"])) : createCommentVNode("", true)
        ], 64);
      }), 128))
    ], 16)) : (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList($options.getFooterRows(), (row, i) => {
      return openBlock(), createElementBlock("tr", mergeProps({
        key: i,
        role: "row"
      }, $options.getRowPTOptions(row, "root")), [
        (openBlock(true), createElementBlock(Fragment, null, renderList($options.getFooterColumns(row), (col, j) => {
          return openBlock(), createElementBlock(Fragment, {
            key: $options.columnProp(col, "columnKey") || $options.columnProp(col, "field") || j
          }, [
            !$options.columnProp(col, "hidden") ? (openBlock(), createBlock(_component_DTFooterCell, {
              key: 0,
              column: col,
              pt: _ctx.pt
            }, null, 8, ["column", "pt"])) : createCommentVNode("", true)
          ], 64);
        }), 128))
      ], 16);
    }), 128))
  ], 16)) : createCommentVNode("", true);
}
script$5$1.render = render$5$1;
var script$4$1 = {
  name: "ColumnFilter",
  extends: script$K,
  emits: ["filter-change", "filter-apply", "operator-change", "matchmode-change", "constraint-add", "constraint-remove", "filter-clear", "apply-click"],
  props: {
    field: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: "text"
    },
    display: {
      type: String,
      default: null
    },
    showMenu: {
      type: Boolean,
      default: true
    },
    matchMode: {
      type: String,
      default: null
    },
    showOperator: {
      type: Boolean,
      default: true
    },
    showClearButton: {
      type: Boolean,
      default: true
    },
    showApplyButton: {
      type: Boolean,
      default: true
    },
    showMatchModes: {
      type: Boolean,
      default: true
    },
    showAddButton: {
      type: Boolean,
      default: true
    },
    matchModeOptions: {
      type: Array,
      default: null
    },
    maxConstraints: {
      type: Number,
      default: 2
    },
    filterElement: {
      type: Function,
      default: null
    },
    filterHeaderTemplate: {
      type: Function,
      default: null
    },
    filterFooterTemplate: {
      type: Function,
      default: null
    },
    filterClearTemplate: {
      type: Function,
      default: null
    },
    filterApplyTemplate: {
      type: Function,
      default: null
    },
    filterIconTemplate: {
      type: Function,
      default: null
    },
    filterAddIconTemplate: {
      type: Function,
      default: null
    },
    filterRemoveIconTemplate: {
      type: Function,
      default: null
    },
    filterClearIconTemplate: {
      type: Function,
      default: null
    },
    filters: {
      type: Object,
      default: null
    },
    filtersStore: {
      type: Object,
      default: null
    },
    filterMenuClass: {
      type: String,
      default: null
    },
    filterMenuStyle: {
      type: null,
      default: null
    },
    filterInputProps: {
      type: null,
      default: null
    },
    column: null
  },
  data() {
    return {
      overlayVisible: false,
      defaultMatchMode: null,
      defaultOperator: null
    };
  },
  overlay: null,
  selfClick: false,
  overlayEventListener: null,
  beforeUnmount() {
    if (this.overlayEventListener) {
      OverlayEventBus.off("overlay-click", this.overlayEventListener);
      this.overlayEventListener = null;
    }
    if (this.overlay) {
      ZIndexUtils.clear(this.overlay);
      this.onOverlayHide();
    }
  },
  mounted() {
    if (this.filters && this.filters[this.field]) {
      let fieldFilters = this.filters[this.field];
      if (fieldFilters.operator) {
        this.defaultMatchMode = fieldFilters.constraints[0].matchMode;
        this.defaultOperator = fieldFilters.operator;
      } else {
        this.defaultMatchMode = this.filters[this.field].matchMode;
      }
    }
  },
  methods: {
    getColumnPTOptions(key) {
      return this.ptmo(this.getColumnProp(), key, {
        props: this.column.props,
        parent: {
          props: this.$props,
          state: this.$data
        }
      });
    },
    getColumnProp() {
      return this.column.props && this.column.props.pt ? this.column.props.pt : void 0;
    },
    clearFilter() {
      let _filters = { ...this.filters };
      if (_filters[this.field].operator) {
        _filters[this.field].constraints.splice(1);
        _filters[this.field].operator = this.defaultOperator;
        _filters[this.field].constraints[0] = { value: null, matchMode: this.defaultMatchMode };
      } else {
        _filters[this.field].value = null;
        _filters[this.field].matchMode = this.defaultMatchMode;
      }
      this.$emit("filter-clear");
      this.$emit("filter-change", _filters);
      this.$emit("filter-apply");
      this.hide();
    },
    applyFilter() {
      this.$emit("apply-click", { field: this.field, constraints: this.filters[this.field] });
      this.$emit("filter-apply");
      this.hide();
    },
    hasFilter() {
      if (this.filtersStore) {
        let fieldFilter = this.filtersStore[this.field];
        if (fieldFilter) {
          if (fieldFilter.operator)
            return !this.isFilterBlank(fieldFilter.constraints[0].value);
          else
            return !this.isFilterBlank(fieldFilter.value);
        }
      }
      return false;
    },
    hasRowFilter() {
      return this.filters[this.field] && !this.isFilterBlank(this.filters[this.field].value);
    },
    isFilterBlank(filter2) {
      if (filter2 !== null && filter2 !== void 0) {
        if (typeof filter2 === "string" && filter2.trim().length == 0 || filter2 instanceof Array && filter2.length == 0)
          return true;
        else
          return false;
      }
      return true;
    },
    toggleMenu() {
      this.overlayVisible = !this.overlayVisible;
    },
    onToggleButtonKeyDown(event2) {
      switch (event2.code) {
        case "Enter":
        case "Space":
          this.toggleMenu();
          event2.preventDefault();
          break;
        case "Escape":
          this.overlayVisible = false;
          break;
      }
    },
    onRowMatchModeChange(matchMode) {
      let _filters = { ...this.filters };
      _filters[this.field].matchMode = matchMode;
      this.$emit("matchmode-change", { field: this.field, matchMode });
      this.$emit("filter-change", _filters);
      this.$emit("filter-apply");
      this.hide();
    },
    onRowMatchModeKeyDown(event2) {
      let item = event2.target;
      switch (event2.code) {
        case "ArrowDown":
          var nextItem = this.findNextItem(item);
          if (nextItem) {
            item.removeAttribute("tabindex");
            nextItem.tabIndex = "0";
            nextItem.focus();
          }
          event2.preventDefault();
          break;
        case "ArrowUp":
          var prevItem = this.findPrevItem(item);
          if (prevItem) {
            item.removeAttribute("tabindex");
            prevItem.tabIndex = "0";
            prevItem.focus();
          }
          event2.preventDefault();
          break;
      }
    },
    isRowMatchModeSelected(matchMode) {
      return this.filters[this.field].matchMode === matchMode;
    },
    onOperatorChange(value) {
      let _filters = { ...this.filters };
      _filters[this.field].operator = value;
      this.$emit("filter-change", _filters);
      this.$emit("operator-change", { field: this.field, operator: value });
      if (!this.showApplyButton) {
        this.$emit("filter-apply");
      }
    },
    onMenuMatchModeChange(value, index) {
      let _filters = { ...this.filters };
      _filters[this.field].constraints[index].matchMode = value;
      this.$emit("matchmode-change", { field: this.field, matchMode: value, index });
      if (!this.showApplyButton) {
        this.$emit("filter-apply");
      }
    },
    addConstraint() {
      let _filters = { ...this.filters };
      let newConstraint = { value: null, matchMode: this.defaultMatchMode };
      _filters[this.field].constraints.push(newConstraint);
      this.$emit("constraint-add", { field: this.field, constraing: newConstraint });
      this.$emit("filter-change", _filters);
      if (!this.showApplyButton) {
        this.$emit("filter-apply");
      }
    },
    removeConstraint(index) {
      let _filters = { ...this.filters };
      let removedConstraint = _filters[this.field].constraints.splice(index, 1);
      this.$emit("constraint-remove", { field: this.field, constraing: removedConstraint });
      this.$emit("filter-change", _filters);
      if (!this.showApplyButton) {
        this.$emit("filter-apply");
      }
    },
    filterCallback() {
      this.$emit("filter-apply");
    },
    findNextItem(item) {
      let nextItem = item.nextElementSibling;
      if (nextItem)
        return DomHandler.hasClass(nextItem, "p-column-filter-separator") ? this.findNextItem(nextItem) : nextItem;
      else
        return item.parentElement.firstElementChild;
    },
    findPrevItem(item) {
      let prevItem = item.previousElementSibling;
      if (prevItem)
        return DomHandler.hasClass(prevItem, "p-column-filter-separator") ? this.findPrevItem(prevItem) : prevItem;
      else
        return item.parentElement.lastElementChild;
    },
    hide() {
      this.overlayVisible = false;
      DomHandler.focus(this.$refs.icon);
    },
    onContentClick(event2) {
      this.selfClick = true;
      OverlayEventBus.emit("overlay-click", {
        originalEvent: event2,
        target: this.overlay
      });
    },
    onContentMouseDown() {
      this.selfClick = true;
    },
    onOverlayEnter(el) {
      if (this.filterMenuStyle) {
        DomHandler.applyStyle(this.overlay, this.filterMenuStyle);
      }
      ZIndexUtils.set("overlay", el, this.$primevue.config.zIndex.overlay);
      DomHandler.absolutePosition(this.overlay, this.$refs.icon);
      this.bindOutsideClickListener();
      this.bindScrollListener();
      this.bindResizeListener();
      this.overlayEventListener = (e) => {
        if (!this.isOutsideClicked(e.target)) {
          this.selfClick = true;
        }
      };
      OverlayEventBus.on("overlay-click", this.overlayEventListener);
    },
    onOverlayLeave() {
      this.onOverlayHide();
    },
    onOverlayAfterLeave(el) {
      ZIndexUtils.clear(el);
    },
    onOverlayHide() {
      this.unbindOutsideClickListener();
      this.unbindResizeListener();
      this.unbindScrollListener();
      this.overlay = null;
      OverlayEventBus.off("overlay-click", this.overlayEventListener);
      this.overlayEventListener = null;
    },
    overlayRef(el) {
      this.overlay = el;
    },
    isOutsideClicked(target) {
      return !this.isTargetClicked(target) && this.overlay && !(this.overlay.isSameNode(target) || this.overlay.contains(target));
    },
    isTargetClicked(target) {
      return this.$refs.icon && (this.$refs.icon.isSameNode(target) || this.$refs.icon.contains(target));
    },
    bindOutsideClickListener() {
      if (!this.outsideClickListener) {
        this.outsideClickListener = (event2) => {
          if (this.overlayVisible && !this.selfClick && this.isOutsideClicked(event2.target)) {
            this.overlayVisible = false;
          }
          this.selfClick = false;
        };
        document.addEventListener("click", this.outsideClickListener);
      }
    },
    unbindOutsideClickListener() {
      if (this.outsideClickListener) {
        document.removeEventListener("click", this.outsideClickListener);
        this.outsideClickListener = null;
        this.selfClick = false;
      }
    },
    bindScrollListener() {
      if (!this.scrollHandler) {
        this.scrollHandler = new ConnectedOverlayScrollHandler(this.$refs.icon, () => {
          if (this.overlayVisible) {
            this.hide();
          }
        });
      }
      this.scrollHandler.bindScrollListener();
    },
    unbindScrollListener() {
      if (this.scrollHandler) {
        this.scrollHandler.unbindScrollListener();
      }
    },
    bindResizeListener() {
      if (!this.resizeListener) {
        this.resizeListener = () => {
          if (this.overlayVisible && !DomHandler.isTouchDevice()) {
            this.hide();
          }
        };
        window.addEventListener("resize", this.resizeListener);
      }
    },
    unbindResizeListener() {
      if (this.resizeListener) {
        window.removeEventListener("resize", this.resizeListener);
        this.resizeListener = null;
      }
    }
  },
  computed: {
    containerClass() {
      return [
        "p-column-filter p-fluid",
        {
          "p-column-filter-row": this.display === "row",
          "p-column-filter-menu": this.display === "menu"
        }
      ];
    },
    overlayClass() {
      return [
        this.filterMenuClass,
        {
          "p-column-filter-overlay p-component p-fluid": true,
          "p-column-filter-overlay-menu": this.display === "menu",
          "p-input-filled": this.$primevue.config.inputStyle === "filled",
          "p-ripple-disabled": this.$primevue.config.ripple === false
        }
      ];
    },
    showMenuButton() {
      return this.showMenu && (this.display === "row" ? this.type !== "boolean" : true);
    },
    overlayId() {
      return UniqueComponentId();
    },
    matchModes() {
      return this.matchModeOptions || this.$primevue.config.filterMatchModeOptions[this.type].map((key) => {
        return { label: this.$primevue.config.locale[key], value: key };
      });
    },
    isShowMatchModes() {
      return this.type !== "boolean" && this.showMatchModes && this.matchModes;
    },
    operatorOptions() {
      return [
        { label: this.$primevue.config.locale.matchAll, value: FilterOperator.AND },
        { label: this.$primevue.config.locale.matchAny, value: FilterOperator.OR }
      ];
    },
    noFilterLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.noFilter : void 0;
    },
    isShowOperator() {
      return this.showOperator && this.filters[this.field].operator;
    },
    operator() {
      return this.filters[this.field].operator;
    },
    fieldConstraints() {
      return this.filters[this.field].constraints || [this.filters[this.field]];
    },
    showRemoveIcon() {
      return this.fieldConstraints.length > 1;
    },
    removeRuleButtonLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.removeRule : void 0;
    },
    addRuleButtonLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.addRule : void 0;
    },
    isShowAddConstraint() {
      return this.showAddButton && this.filters[this.field].operator && this.fieldConstraints && this.fieldConstraints.length < this.maxConstraints;
    },
    clearButtonLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.clear : void 0;
    },
    applyButtonLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.apply : void 0;
    },
    filterMenuButtonAriaLabel() {
      return this.$primevue.config.locale ? this.overlayVisible ? this.$primevue.config.locale.showFilterMenu : this.$primevue.config.locale.hideFilterMenu : void 0;
    },
    filterOperatorAriaLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.filterOperator : void 0;
    },
    filterConstraintAriaLabel() {
      return this.$primevue.config.locale ? this.$primevue.config.locale.filterConstraint : void 0;
    }
  },
  components: {
    CFDropdown: script$w,
    CFButton: script$H,
    Portal: script$y,
    FilterSlashIcon: script$j,
    FilterIcon: script$A,
    TrashIcon: script$h,
    PlusIcon: script$i
  },
  directives: {
    focustrap: FocusTrap
  }
};
const _hoisted_1$2$1 = ["aria-label", "aria-expanded", "aria-controls"];
const _hoisted_2$b = ["id", "aria-modal"];
const _hoisted_3$b = ["onClick", "onKeydown", "tabindex"];
function render$4$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_CFDropdown = resolveComponent("CFDropdown");
  const _component_CFButton = resolveComponent("CFButton");
  const _component_Portal = resolveComponent("Portal");
  const _directive_focustrap = resolveDirective("focustrap");
  return openBlock(), createElementBlock("div", mergeProps({ class: $options.containerClass }, $options.getColumnPTOptions("columnFilter")), [
    $props.display === "row" ? (openBlock(), createElementBlock("div", mergeProps({
      key: 0,
      class: "p-fluid p-column-filter-element"
    }, { ...$props.filterInputProps, ...$options.getColumnPTOptions("filterInput") }), [
      (openBlock(), createBlock(resolveDynamicComponent($props.filterElement), {
        field: $props.field,
        filterModel: $props.filters[$props.field],
        filterCallback: $options.filterCallback
      }, null, 8, ["field", "filterModel", "filterCallback"]))
    ], 16)) : createCommentVNode("", true),
    $options.showMenuButton ? (openBlock(), createElementBlock("button", mergeProps({
      key: 1,
      ref: "icon",
      type: "button",
      class: ["p-column-filter-menu-button p-link", { "p-column-filter-menu-button-open": $data.overlayVisible, "p-column-filter-menu-button-active": $options.hasFilter() }],
      "aria-label": $options.filterMenuButtonAriaLabel,
      "aria-haspopup": "true",
      "aria-expanded": $data.overlayVisible,
      "aria-controls": $options.overlayId,
      onClick: _cache[0] || (_cache[0] = ($event) => $options.toggleMenu()),
      onKeydown: _cache[1] || (_cache[1] = ($event) => $options.onToggleButtonKeyDown($event))
    }, $options.getColumnPTOptions("filterMenuButton")), [
      (openBlock(), createBlock(resolveDynamicComponent($props.filterIconTemplate || "FilterIcon")))
    ], 16, _hoisted_1$2$1)) : createCommentVNode("", true),
    $props.showClearButton && $props.display === "row" ? (openBlock(), createElementBlock("button", mergeProps({
      key: 2,
      class: [{ "p-hidden-space": !$options.hasRowFilter() }, "p-column-filter-clear-button p-link"],
      type: "button",
      onClick: _cache[2] || (_cache[2] = ($event) => $options.clearFilter())
    }, $options.getColumnPTOptions("headerFilterClearButton")), [
      (openBlock(), createBlock(resolveDynamicComponent($props.filterClearIconTemplate || "FilterSlashIcon"), normalizeProps(guardReactiveProps($options.getColumnPTOptions("filterClearIcon"))), null, 16))
    ], 16)) : createCommentVNode("", true),
    createVNode(_component_Portal, null, {
      default: withCtx(() => [
        createVNode(Transition, {
          name: "p-connected-overlay",
          onEnter: $options.onOverlayEnter,
          onLeave: $options.onOverlayLeave,
          onAfterLeave: $options.onOverlayAfterLeave
        }, {
          default: withCtx(() => [
            $data.overlayVisible ? withDirectives((openBlock(), createElementBlock("div", mergeProps({
              key: 0,
              ref: $options.overlayRef,
              id: $options.overlayId,
              "aria-modal": $data.overlayVisible,
              role: "dialog",
              class: $options.overlayClass,
              onKeydown: _cache[10] || (_cache[10] = withKeys((...args) => $options.hide && $options.hide(...args), ["escape"])),
              onClick: _cache[11] || (_cache[11] = (...args) => $options.onContentClick && $options.onContentClick(...args)),
              onMousedown: _cache[12] || (_cache[12] = (...args) => $options.onContentMouseDown && $options.onContentMouseDown(...args))
            }, $options.getColumnPTOptions("filterOverlay")), [
              (openBlock(), createBlock(resolveDynamicComponent($props.filterHeaderTemplate), {
                field: $props.field,
                filterModel: $props.filters[$props.field],
                filterCallback: $options.filterCallback
              }, null, 8, ["field", "filterModel", "filterCallback"])),
              $props.display === "row" ? (openBlock(), createElementBlock("ul", mergeProps({
                key: 0,
                class: "p-column-filter-row-items"
              }, $options.getColumnPTOptions("filterRowItems")), [
                (openBlock(true), createElementBlock(Fragment, null, renderList($options.matchModes, (matchMode, i) => {
                  return openBlock(), createElementBlock("li", mergeProps({
                    key: matchMode.label,
                    class: ["p-column-filter-row-item", { "p-highlight": $options.isRowMatchModeSelected(matchMode.value) }],
                    onClick: ($event) => $options.onRowMatchModeChange(matchMode.value),
                    onKeydown: [
                      _cache[3] || (_cache[3] = ($event) => $options.onRowMatchModeKeyDown($event)),
                      withKeys(withModifiers(($event) => $options.onRowMatchModeChange(matchMode.value), ["prevent"]), ["enter"])
                    ],
                    tabindex: i === 0 ? "0" : null
                  }, $options.getColumnPTOptions("filterRowItem")), toDisplayString(matchMode.label), 17, _hoisted_3$b);
                }), 128)),
                createBaseVNode("li", mergeProps({ class: "p-column-filter-separator" }, $options.getColumnPTOptions("filterInput")), null, 16),
                createBaseVNode("li", mergeProps({
                  class: "p-column-filter-row-item",
                  onClick: _cache[4] || (_cache[4] = ($event) => $options.clearFilter()),
                  onKeydown: [
                    _cache[5] || (_cache[5] = ($event) => $options.onRowMatchModeKeyDown($event)),
                    _cache[6] || (_cache[6] = withKeys(($event) => _ctx.onRowClearItemClick(), ["enter"]))
                  ]
                }, $options.getColumnPTOptions("filterRowItem")), toDisplayString($options.noFilterLabel), 17)
              ], 16)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                $options.isShowOperator ? (openBlock(), createElementBlock("div", mergeProps({
                  key: 0,
                  class: "p-column-filter-operator"
                }, $options.getColumnPTOptions("filterOperator")), [
                  createVNode(_component_CFDropdown, {
                    options: $options.operatorOptions,
                    modelValue: $options.operator,
                    "aria-label": $options.filterOperatorAriaLabel,
                    class: "p-column-filter-operator-dropdown",
                    optionLabel: "label",
                    optionValue: "value",
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $options.onOperatorChange($event)),
                    pt: $options.getColumnPTOptions("filterOperatorDropdown")
                  }, null, 8, ["options", "modelValue", "aria-label", "pt"])
                ], 16)) : createCommentVNode("", true),
                createBaseVNode("div", mergeProps({ class: "p-column-filter-constraints" }, $options.getColumnPTOptions("filterConstraints")), [
                  (openBlock(true), createElementBlock(Fragment, null, renderList($options.fieldConstraints, (fieldConstraint, i) => {
                    return openBlock(), createElementBlock("div", mergeProps({
                      key: i,
                      class: "p-column-filter-constraint"
                    }, $options.getColumnPTOptions("filterConstraint")), [
                      $options.isShowMatchModes ? (openBlock(), createBlock(_component_CFDropdown, {
                        key: 0,
                        options: $options.matchModes,
                        modelValue: fieldConstraint.matchMode,
                        class: "p-column-filter-matchmode-dropdown",
                        optionLabel: "label",
                        optionValue: "value",
                        "aria-label": $options.filterConstraintAriaLabel,
                        "onUpdate:modelValue": ($event) => $options.onMenuMatchModeChange($event, i),
                        pt: $options.getColumnPTOptions("filterMatchModeDropdown")
                      }, null, 8, ["options", "modelValue", "aria-label", "onUpdate:modelValue", "pt"])) : createCommentVNode("", true),
                      $props.display === "menu" ? (openBlock(), createBlock(resolveDynamicComponent($props.filterElement), {
                        key: 1,
                        field: $props.field,
                        filterModel: fieldConstraint,
                        filterCallback: $options.filterCallback
                      }, null, 8, ["field", "filterModel", "filterCallback"])) : createCommentVNode("", true),
                      createBaseVNode("div", normalizeProps(guardReactiveProps($options.getColumnPTOptions("filterRemove"))), [
                        $options.showRemoveIcon ? (openBlock(), createBlock(_component_CFButton, {
                          key: 0,
                          type: "button",
                          class: "p-column-filter-remove-button p-button-text p-button-danger p-button-sm",
                          onClick: ($event) => $options.removeConstraint(i),
                          label: $options.removeRuleButtonLabel,
                          pt: $options.getColumnPTOptions("filterRemoveButton")
                        }, {
                          icon: withCtx((iconProps) => [
                            (openBlock(), createBlock(resolveDynamicComponent($props.filterRemoveIconTemplate || "TrashIcon"), mergeProps({
                              class: iconProps.class
                            }, $options.getColumnPTOptions("filterRemoveButton")["icon"]), null, 16, ["class"]))
                          ]),
                          _: 2
                        }, 1032, ["onClick", "label", "pt"])) : createCommentVNode("", true)
                      ], 16)
                    ], 16);
                  }), 128))
                ], 16),
                $options.isShowAddConstraint ? (openBlock(), createElementBlock("div", mergeProps({
                  key: 1,
                  class: "p-column-filter-add-rule"
                }, $options.getColumnPTOptions("filterAddRule")), [
                  createVNode(_component_CFButton, {
                    type: "button",
                    label: $options.addRuleButtonLabel,
                    iconPos: "left",
                    class: "p-column-filter-add-button p-button-text p-button-sm",
                    onClick: _cache[8] || (_cache[8] = ($event) => $options.addConstraint()),
                    pt: $options.getColumnPTOptions("filterAddRuleButton")
                  }, {
                    icon: withCtx((iconProps) => [
                      (openBlock(), createBlock(resolveDynamicComponent($props.filterAddIconTemplate || "PlusIcon"), mergeProps({
                        class: iconProps.class
                      }, $options.getColumnPTOptions("filterAddRuleButton")["icon"]), null, 16, ["class"]))
                    ]),
                    _: 1
                  }, 8, ["label", "pt"])
                ], 16)) : createCommentVNode("", true),
                createBaseVNode("div", mergeProps({ class: "p-column-filter-buttonbar" }, $options.getColumnPTOptions("filterButtonbar")), [
                  !$props.filterClearTemplate && $props.showClearButton ? (openBlock(), createBlock(_component_CFButton, {
                    key: 0,
                    type: "button",
                    class: "p-button-outlined p-button-sm",
                    label: $options.clearButtonLabel,
                    onClick: $options.clearFilter,
                    pt: $options.getColumnPTOptions("filterClearButton")
                  }, null, 8, ["label", "onClick", "pt"])) : (openBlock(), createBlock(resolveDynamicComponent($props.filterClearTemplate), {
                    key: 1,
                    field: $props.field,
                    filterModel: $props.filters[$props.field],
                    filterCallback: $options.clearFilter
                  }, null, 8, ["field", "filterModel", "filterCallback"])),
                  $props.showApplyButton ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [
                    !$props.filterApplyTemplate ? (openBlock(), createBlock(_component_CFButton, mergeProps({
                      key: 0,
                      type: "button",
                      class: "p-button-sm",
                      label: $options.applyButtonLabel,
                      onClick: _cache[9] || (_cache[9] = ($event) => $options.applyFilter())
                    }, $options.getColumnPTOptions("filterApplyButton")), null, 16, ["label"])) : (openBlock(), createBlock(resolveDynamicComponent($props.filterApplyTemplate), {
                      key: 1,
                      field: $props.field,
                      filterModel: $props.filters[$props.field],
                      filterCallback: $options.applyFilter
                    }, null, 8, ["field", "filterModel", "filterCallback"]))
                  ], 64)) : createCommentVNode("", true)
                ], 16)
              ], 64)),
              (openBlock(), createBlock(resolveDynamicComponent($props.filterFooterTemplate), {
                field: $props.field,
                filterModel: $props.filters[$props.field],
                filterCallback: $options.filterCallback
              }, null, 8, ["field", "filterModel", "filterCallback"]))
            ], 16, _hoisted_2$b)), [
              [_directive_focustrap, { autoFocus: true }]
            ]) : createCommentVNode("", true)
          ]),
          _: 1
        }, 8, ["onEnter", "onLeave", "onAfterLeave"])
      ]),
      _: 1
    })
  ], 16);
}
script$4$1.render = render$4$1;
var script$3$1 = {
  name: "HeaderCheckbox",
  extends: script$K,
  emits: ["change"],
  props: {
    checked: null,
    disabled: null,
    column: null,
    headerCheckboxIconTemplate: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      focused: false
    };
  },
  methods: {
    getColumnPTOptions(key) {
      return this.ptmo(this.getColumnProp(), key, {
        props: this.column.props,
        parent: {
          props: this.$props,
          state: this.$data
        },
        context: {
          checked: this.checked,
          focused: this.focused,
          disabled: this.disabled
        }
      });
    },
    getColumnProp() {
      return this.column.props && this.column.props.pt ? this.column.props.pt : void 0;
    },
    onClick(event2) {
      if (!this.disabled) {
        this.$emit("change", {
          originalEvent: event2,
          checked: !this.checked
        });
        DomHandler.focus(this.$refs.input);
      }
    },
    onFocus() {
      this.focused = true;
    },
    onBlur() {
      this.focused = false;
    }
  },
  computed: {
    headerCheckboxAriaLabel() {
      return this.$primevue.config.locale.aria ? this.checked ? this.$primevue.config.locale.aria.selectAll : this.$primevue.config.locale.aria.unselectAll : void 0;
    }
  },
  components: {
    CheckIcon: script$l
  }
};
const _hoisted_1$1$1 = ["checked", "disabled", "tabindex", "aria-label"];
function render$3$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_CheckIcon = resolveComponent("CheckIcon");
  return openBlock(), createElementBlock("div", mergeProps({
    class: ["p-checkbox p-component", { "p-checkbox-focused": $data.focused, "p-disabled": $props.disabled }],
    onClick: _cache[2] || (_cache[2] = (...args) => $options.onClick && $options.onClick(...args)),
    onKeydown: _cache[3] || (_cache[3] = withKeys(withModifiers((...args) => $options.onClick && $options.onClick(...args), ["prevent"]), ["space"]))
  }, $options.getColumnPTOptions("headerCheckboxWrapper")), [
    createBaseVNode("div", mergeProps({ class: "p-hidden-accessible" }, $options.getColumnPTOptions("hiddenHeaderInputWrapper")), [
      createBaseVNode("input", mergeProps({
        ref: "input",
        type: "checkbox",
        checked: $props.checked,
        disabled: $props.disabled,
        tabindex: $props.disabled ? null : "0",
        "aria-label": $options.headerCheckboxAriaLabel,
        onFocus: _cache[0] || (_cache[0] = ($event) => $options.onFocus($event)),
        onBlur: _cache[1] || (_cache[1] = ($event) => $options.onBlur($event))
      }, $options.getColumnPTOptions("hiddenHeaderInput")), null, 16, _hoisted_1$1$1)
    ], 16),
    createBaseVNode("div", mergeProps({
      ref: "box",
      class: ["p-checkbox-box p-component", { "p-highlight": $props.checked, "p-disabled": $props.disabled, "p-focus": $data.focused }]
    }, $options.getColumnPTOptions("headerCheckbox")), [
      $props.headerCheckboxIconTemplate ? (openBlock(), createBlock(resolveDynamicComponent($props.headerCheckboxIconTemplate), {
        key: 0,
        checked: $props.checked,
        class: "p-checkbox-icon"
      }, null, 8, ["checked"])) : !$props.headerCheckboxIconTemplate && !!$props.checked ? (openBlock(), createBlock(_component_CheckIcon, mergeProps({
        key: 1,
        class: "p-checkbox-icon"
      }, $options.getColumnPTOptions("headerCheckboxIcon")), null, 16)) : createCommentVNode("", true)
    ], 16)
  ], 16);
}
script$3$1.render = render$3$1;
var script$2$1 = {
  name: "HeaderCell",
  extends: script$K,
  emits: [
    "column-click",
    "column-mousedown",
    "column-dragstart",
    "column-dragover",
    "column-dragleave",
    "column-drop",
    "column-resizestart",
    "checkbox-change",
    "filter-change",
    "filter-apply",
    "operator-change",
    "matchmode-change",
    "constraint-add",
    "constraint-remove",
    "filter-clear",
    "apply-click"
  ],
  props: {
    column: {
      type: Object,
      default: null
    },
    resizableColumns: {
      type: Boolean,
      default: false
    },
    groupRowsBy: {
      type: [Array, String, Function],
      default: null
    },
    sortMode: {
      type: String,
      default: "single"
    },
    groupRowSortField: {
      type: [String, Function],
      default: null
    },
    sortField: {
      type: [String, Function],
      default: null
    },
    sortOrder: {
      type: Number,
      default: null
    },
    multiSortMeta: {
      type: Array,
      default: null
    },
    allRowsSelected: {
      type: Boolean,
      default: false
    },
    empty: {
      type: Boolean,
      default: false
    },
    filterDisplay: {
      type: String,
      default: null
    },
    filters: {
      type: Object,
      default: null
    },
    filtersStore: {
      type: Object,
      default: null
    },
    filterColumn: {
      type: Boolean,
      default: false
    },
    reorderableColumns: {
      type: Boolean,
      default: false
    },
    filterInputProps: {
      type: null,
      default: null
    },
    headerCheckboxIconTemplate: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      styleObject: {}
    };
  },
  mounted() {
    if (this.columnProp("frozen")) {
      this.updateStickyPosition();
    }
  },
  updated() {
    if (this.columnProp("frozen")) {
      this.updateStickyPosition();
    }
  },
  methods: {
    columnProp(prop) {
      return ObjectUtils.getVNodeProp(this.column, prop);
    },
    getColumnPTOptions(key) {
      return this.ptmo(this.getColumnProp(), key, {
        props: this.column.props,
        parent: {
          props: this.$props,
          state: this.$data
        }
      });
    },
    getColumnProp() {
      return this.column.props && this.column.props.pt ? this.column.props.pt : void 0;
    },
    onClick(event2) {
      this.$emit("column-click", { originalEvent: event2, column: this.column });
    },
    onKeyDown(event2) {
      if ((event2.code === "Enter" || event2.code === "Space") && event2.currentTarget.nodeName === "TH" && DomHandler.hasClass(event2.currentTarget, "p-sortable-column")) {
        this.$emit("column-click", { originalEvent: event2, column: this.column });
        event2.preventDefault();
      }
    },
    onMouseDown(event2) {
      this.$emit("column-mousedown", { originalEvent: event2, column: this.column });
    },
    onDragStart(event2) {
      this.$emit("column-dragstart", event2);
    },
    onDragOver(event2) {
      this.$emit("column-dragover", event2);
    },
    onDragLeave(event2) {
      this.$emit("column-dragleave", event2);
    },
    onDrop(event2) {
      this.$emit("column-drop", event2);
    },
    onResizeStart(event2) {
      this.$emit("column-resizestart", event2);
    },
    getMultiSortMetaIndex() {
      return this.multiSortMeta.findIndex((meta) => meta.field === this.columnProp("field") || meta.field === this.columnProp("sortField"));
    },
    getBadgeValue() {
      let index = this.getMultiSortMetaIndex();
      return this.groupRowsBy && this.groupRowsBy === this.groupRowSortField && index > -1 ? index : index + 1;
    },
    isMultiSorted() {
      return this.sortMode === "multiple" && this.columnProp("sortable") && this.getMultiSortMetaIndex() > -1;
    },
    isColumnSorted() {
      return this.sortMode === "single" ? this.sortField && (this.sortField === this.columnProp("field") || this.sortField === this.columnProp("sortField")) : this.isMultiSorted();
    },
    updateStickyPosition() {
      if (this.columnProp("frozen")) {
        let align = this.columnProp("alignFrozen");
        if (align === "right") {
          let right = 0;
          let next = this.$el.nextElementSibling;
          if (next) {
            right = DomHandler.getOuterWidth(next) + parseFloat(next.style.right || 0);
          }
          this.styleObject.right = right + "px";
        } else {
          let left = 0;
          let prev = this.$el.previousElementSibling;
          if (prev) {
            left = DomHandler.getOuterWidth(prev) + parseFloat(prev.style.left || 0);
          }
          this.styleObject.left = left + "px";
        }
        let filterRow = this.$el.parentElement.nextElementSibling;
        if (filterRow) {
          let index = DomHandler.index(this.$el);
          filterRow.children[index].style.left = this.styleObject.left;
          filterRow.children[index].style.right = this.styleObject.right;
        }
      }
    },
    onHeaderCheckboxChange(event2) {
      this.$emit("checkbox-change", event2);
    }
  },
  computed: {
    containerClass() {
      return [
        this.filterColumn ? this.columnProp("filterHeaderClass") : this.columnProp("headerClass"),
        this.columnProp("class"),
        {
          "p-sortable-column": this.columnProp("sortable"),
          "p-resizable-column": this.resizableColumns,
          "p-highlight": this.isColumnSorted(),
          "p-filter-column": this.filterColumn,
          "p-frozen-column": this.columnProp("frozen"),
          "p-reorderable-column": this.reorderableColumns
        }
      ];
    },
    containerStyle() {
      let headerStyle = this.filterColumn ? this.columnProp("filterHeaderStyle") : this.columnProp("headerStyle");
      let columnStyle = this.columnProp("style");
      return this.columnProp("frozen") ? [columnStyle, headerStyle, this.styleObject] : [columnStyle, headerStyle];
    },
    sortState() {
      let sorted = false;
      let sortOrder = null;
      if (this.sortMode === "single") {
        sorted = this.sortField && (this.sortField === this.columnProp("field") || this.sortField === this.columnProp("sortField"));
        sortOrder = sorted ? this.sortOrder : 0;
      } else if (this.sortMode === "multiple") {
        let metaIndex = this.getMultiSortMetaIndex();
        if (metaIndex > -1) {
          sorted = true;
          sortOrder = this.multiSortMeta[metaIndex].order;
        }
      }
      return {
        sorted,
        sortOrder
      };
    },
    sortableColumnIcon() {
      const { sorted, sortOrder } = this.sortState;
      if (!sorted)
        return script$g;
      else if (sorted && sortOrder > 0)
        return script$e;
      else if (sorted && sortOrder < 0)
        return script$f;
      return null;
    },
    ariaSort() {
      if (this.columnProp("sortable")) {
        const { sorted, sortOrder } = this.sortState;
        if (sorted && sortOrder < 0)
          return "descending";
        else if (sorted && sortOrder > 0)
          return "ascending";
        else
          return "none";
      } else {
        return null;
      }
    }
  },
  components: {
    DTHeaderCheckbox: script$3$1,
    DTColumnFilter: script$4$1,
    SortAltIcon: script$g,
    SortAmountUpAltIcon: script$e,
    SortAmountDownIcon: script$f
  }
};
const _hoisted_1$i = ["tabindex", "colspan", "rowspan", "aria-sort"];
function render$2$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DTHeaderCheckbox = resolveComponent("DTHeaderCheckbox");
  const _component_DTColumnFilter = resolveComponent("DTColumnFilter");
  return openBlock(), createElementBlock("th", mergeProps({
    style: $options.containerStyle,
    class: $options.containerClass,
    tabindex: $options.columnProp("sortable") ? "0" : null,
    role: "columnheader",
    colspan: $options.columnProp("colspan"),
    rowspan: $options.columnProp("rowspan"),
    "aria-sort": $options.ariaSort,
    onClick: _cache[8] || (_cache[8] = (...args) => $options.onClick && $options.onClick(...args)),
    onKeydown: _cache[9] || (_cache[9] = (...args) => $options.onKeyDown && $options.onKeyDown(...args)),
    onMousedown: _cache[10] || (_cache[10] = (...args) => $options.onMouseDown && $options.onMouseDown(...args)),
    onDragstart: _cache[11] || (_cache[11] = (...args) => $options.onDragStart && $options.onDragStart(...args)),
    onDragover: _cache[12] || (_cache[12] = (...args) => $options.onDragOver && $options.onDragOver(...args)),
    onDragleave: _cache[13] || (_cache[13] = (...args) => $options.onDragLeave && $options.onDragLeave(...args)),
    onDrop: _cache[14] || (_cache[14] = (...args) => $options.onDrop && $options.onDrop(...args))
  }, { ...$options.getColumnPTOptions("root"), ...$options.getColumnPTOptions("headerCell") }), [
    $props.resizableColumns && !$options.columnProp("frozen") ? (openBlock(), createElementBlock("span", mergeProps({
      key: 0,
      class: "p-column-resizer",
      onMousedown: _cache[0] || (_cache[0] = (...args) => $options.onResizeStart && $options.onResizeStart(...args))
    }, $options.getColumnPTOptions("columnResizer")), null, 16)) : createCommentVNode("", true),
    createBaseVNode("div", mergeProps({ class: "p-column-header-content" }, $options.getColumnPTOptions("headerContent")), [
      $props.column.children && $props.column.children.header ? (openBlock(), createBlock(resolveDynamicComponent($props.column.children.header), {
        key: 0,
        column: $props.column
      }, null, 8, ["column"])) : createCommentVNode("", true),
      $options.columnProp("header") ? (openBlock(), createElementBlock("span", mergeProps({
        key: 1,
        class: "p-column-title"
      }, $options.getColumnPTOptions("headerTitle")), toDisplayString($options.columnProp("header")), 17)) : createCommentVNode("", true),
      $options.columnProp("sortable") ? (openBlock(), createElementBlock("span", normalizeProps(mergeProps({ key: 2 }, $options.getColumnPTOptions("sort"))), [
        (openBlock(), createBlock(resolveDynamicComponent($props.column.children && $props.column.children.sorticon || $options.sortableColumnIcon), {
          sorted: $options.sortState.sorted,
          sortOrder: $options.sortState.sortOrder,
          class: "p-sortable-column-icon"
        }, null, 8, ["sorted", "sortOrder"]))
      ], 16)) : createCommentVNode("", true),
      $options.isMultiSorted() ? (openBlock(), createElementBlock("span", mergeProps({
        key: 3,
        class: "p-sortable-column-badge"
      }, $options.getColumnPTOptions("sortBadge")), toDisplayString($options.getBadgeValue()), 17)) : createCommentVNode("", true),
      $options.columnProp("selectionMode") === "multiple" && $props.filterDisplay !== "row" ? (openBlock(), createBlock(_component_DTHeaderCheckbox, {
        key: 4,
        checked: $props.allRowsSelected,
        onChange: $options.onHeaderCheckboxChange,
        disabled: $props.empty,
        headerCheckboxIconTemplate: $props.headerCheckboxIconTemplate,
        column: $props.column,
        pt: _ctx.pt
      }, null, 8, ["checked", "onChange", "disabled", "headerCheckboxIconTemplate", "column", "pt"])) : createCommentVNode("", true),
      $props.filterDisplay === "menu" && $props.column.children && $props.column.children.filter ? (openBlock(), createBlock(_component_DTColumnFilter, {
        key: 5,
        field: $options.columnProp("filterField") || $options.columnProp("field"),
        type: $options.columnProp("dataType"),
        display: "menu",
        showMenu: $options.columnProp("showFilterMenu"),
        filterElement: $props.column.children && $props.column.children.filter,
        filterHeaderTemplate: $props.column.children && $props.column.children.filterheader,
        filterFooterTemplate: $props.column.children && $props.column.children.filterfooter,
        filterClearTemplate: $props.column.children && $props.column.children.filterclear,
        filterApplyTemplate: $props.column.children && $props.column.children.filterapply,
        filterIconTemplate: $props.column.children && $props.column.children.filtericon,
        filterAddIconTemplate: $props.column.children && $props.column.children.filteraddicon,
        filterRemoveIconTemplate: $props.column.children && $props.column.children.filterremoveicon,
        filterClearIconTemplate: $props.column.children && $props.column.children.filterclearicon,
        filters: $props.filters,
        filtersStore: $props.filtersStore,
        filterInputProps: $props.filterInputProps,
        onFilterChange: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("filter-change", $event)),
        onFilterApply: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("filter-apply")),
        filterMenuStyle: $options.columnProp("filterMenuStyle"),
        filterMenuClass: $options.columnProp("filterMenuClass"),
        showOperator: $options.columnProp("showFilterOperator"),
        showClearButton: $options.columnProp("showClearButton"),
        showApplyButton: $options.columnProp("showApplyButton"),
        showMatchModes: $options.columnProp("showFilterMatchModes"),
        showAddButton: $options.columnProp("showAddButton"),
        matchModeOptions: $options.columnProp("filterMatchModeOptions"),
        maxConstraints: $options.columnProp("maxConstraints"),
        onOperatorChange: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("operator-change", $event)),
        onMatchmodeChange: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("matchmode-change", $event)),
        onConstraintAdd: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("constraint-add", $event)),
        onConstraintRemove: _cache[6] || (_cache[6] = ($event) => _ctx.$emit("constraint-remove", $event)),
        onApplyClick: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("apply-click", $event)),
        pt: _ctx.pt,
        column: $props.column
      }, null, 8, ["field", "type", "showMenu", "filterElement", "filterHeaderTemplate", "filterFooterTemplate", "filterClearTemplate", "filterApplyTemplate", "filterIconTemplate", "filterAddIconTemplate", "filterRemoveIconTemplate", "filterClearIconTemplate", "filters", "filtersStore", "filterInputProps", "filterMenuStyle", "filterMenuClass", "showOperator", "showClearButton", "showApplyButton", "showMatchModes", "showAddButton", "matchModeOptions", "maxConstraints", "pt", "column"])) : createCommentVNode("", true)
    ], 16)
  ], 16, _hoisted_1$i);
}
script$2$1.render = render$2$1;
var script$1$1 = {
  name: "TableHeader",
  extends: script$K,
  emits: [
    "column-click",
    "column-mousedown",
    "column-dragstart",
    "column-dragover",
    "column-dragleave",
    "column-drop",
    "column-resizestart",
    "checkbox-change",
    "filter-change",
    "filter-apply",
    "operator-change",
    "matchmode-change",
    "constraint-add",
    "constraint-remove",
    "filter-clear",
    "apply-click"
  ],
  props: {
    columnGroup: {
      type: null,
      default: null
    },
    columns: {
      type: null,
      default: null
    },
    rowGroupMode: {
      type: String,
      default: null
    },
    groupRowsBy: {
      type: [Array, String, Function],
      default: null
    },
    resizableColumns: {
      type: Boolean,
      default: false
    },
    allRowsSelected: {
      type: Boolean,
      default: false
    },
    empty: {
      type: Boolean,
      default: false
    },
    sortMode: {
      type: String,
      default: "single"
    },
    groupRowSortField: {
      type: [String, Function],
      default: null
    },
    sortField: {
      type: [String, Function],
      default: null
    },
    sortOrder: {
      type: Number,
      default: null
    },
    multiSortMeta: {
      type: Array,
      default: null
    },
    filterDisplay: {
      type: String,
      default: null
    },
    filters: {
      type: Object,
      default: null
    },
    filtersStore: {
      type: Object,
      default: null
    },
    reorderableColumns: {
      type: Boolean,
      default: false
    },
    filterInputProps: {
      type: null,
      default: null
    },
    headerCheckboxIconTemplate: {
      type: Function,
      default: null
    }
  },
  methods: {
    columnProp(col, prop) {
      return ObjectUtils.getVNodeProp(col, prop);
    },
    getColumnGroupPTOptions(key) {
      return this.ptmo(this.getColumnGroupProps(), key, {
        props: this.getColumnGroupProps(),
        parent: {
          props: this.$props,
          state: this.$data
        }
      });
    },
    getColumnGroupProps() {
      return this.columnGroup && this.columnGroup.props && this.columnGroup.props.pt ? this.columnGroup.props.pt : void 0;
    },
    getRowPTOptions(row, key) {
      return this.ptmo(this.getRowProp(row), key, {
        props: row.props,
        parent: {
          props: this.$props,
          state: this.$data
        }
      });
    },
    getRowProp(row) {
      return row.props && row.props.pt ? row.props.pt : void 0;
    },
    getColumnPTOptions(column, key) {
      return this.ptmo(this.getColumnProp(column), key, {
        props: column.props,
        parent: {
          props: this.$props,
          state: this.$data
        }
      });
    },
    getColumnProp(column) {
      return column.props && column.props.pt ? column.props.pt : void 0;
    },
    getFilterColumnHeaderClass(column) {
      return [
        "p-filter-column",
        this.columnProp(column, "filterHeaderClass"),
        this.columnProp(column, "class"),
        {
          "p-frozen-column": this.columnProp(column, "frozen")
        }
      ];
    },
    getFilterColumnHeaderStyle(column) {
      return [this.columnProp(column, "filterHeaderStyle"), this.columnProp(column, "style")];
    },
    getHeaderRows() {
      let rows = [];
      let columnGroup = this.columnGroup;
      if (columnGroup.children && columnGroup.children.default) {
        for (let child of columnGroup.children.default()) {
          if (child.type.name === "Row") {
            rows.push(child);
          } else if (child.children && child.children instanceof Array) {
            rows = child.children;
          }
        }
        return rows;
      }
    },
    getHeaderColumns(row) {
      let cols = [];
      if (row.children && row.children.default) {
        row.children.default().forEach((child) => {
          if (child.children && child.children instanceof Array)
            cols = [...cols, ...child.children];
          else if (child.type.name === "Column")
            cols.push(child);
        });
        return cols;
      }
    }
  },
  components: {
    DTHeaderCell: script$2$1,
    DTHeaderCheckbox: script$3$1,
    DTColumnFilter: script$4$1
  }
};
function render$1$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DTHeaderCell = resolveComponent("DTHeaderCell");
  const _component_DTHeaderCheckbox = resolveComponent("DTHeaderCheckbox");
  const _component_DTColumnFilter = resolveComponent("DTColumnFilter");
  return openBlock(), createElementBlock("thead", mergeProps({
    class: "p-datatable-thead",
    role: "rowgroup"
  }, { ..._ctx.ptm("thead"), ...$options.getColumnGroupPTOptions("root") }), [
    !$props.columnGroup ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
      createBaseVNode("tr", mergeProps({ role: "row" }, _ctx.ptm("headerRow")), [
        (openBlock(true), createElementBlock(Fragment, null, renderList($props.columns, (col, i) => {
          return openBlock(), createElementBlock(Fragment, {
            key: $options.columnProp(col, "columnKey") || $options.columnProp(col, "field") || i
          }, [
            !$options.columnProp(col, "hidden") && ($props.rowGroupMode !== "subheader" || $props.groupRowsBy !== $options.columnProp(col, "field")) ? (openBlock(), createBlock(_component_DTHeaderCell, {
              key: 0,
              column: col,
              onColumnClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("column-click", $event)),
              onColumnMousedown: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("column-mousedown", $event)),
              onColumnDragstart: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("column-dragstart", $event)),
              onColumnDragover: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("column-dragover", $event)),
              onColumnDragleave: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("column-dragleave", $event)),
              onColumnDrop: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("column-drop", $event)),
              groupRowsBy: $props.groupRowsBy,
              groupRowSortField: $props.groupRowSortField,
              reorderableColumns: $props.reorderableColumns,
              resizableColumns: $props.resizableColumns,
              onColumnResizestart: _cache[6] || (_cache[6] = ($event) => _ctx.$emit("column-resizestart", $event)),
              sortMode: $props.sortMode,
              sortField: $props.sortField,
              sortOrder: $props.sortOrder,
              multiSortMeta: $props.multiSortMeta,
              allRowsSelected: $props.allRowsSelected,
              empty: $props.empty,
              onCheckboxChange: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("checkbox-change", $event)),
              filters: $props.filters,
              filterDisplay: $props.filterDisplay,
              filtersStore: $props.filtersStore,
              filterInputProps: $props.filterInputProps,
              onFilterChange: _cache[8] || (_cache[8] = ($event) => _ctx.$emit("filter-change", $event)),
              onFilterApply: _cache[9] || (_cache[9] = ($event) => _ctx.$emit("filter-apply")),
              onOperatorChange: _cache[10] || (_cache[10] = ($event) => _ctx.$emit("operator-change", $event)),
              onMatchmodeChange: _cache[11] || (_cache[11] = ($event) => _ctx.$emit("matchmode-change", $event)),
              onConstraintAdd: _cache[12] || (_cache[12] = ($event) => _ctx.$emit("constraint-add", $event)),
              onConstraintRemove: _cache[13] || (_cache[13] = ($event) => _ctx.$emit("constraint-remove", $event)),
              onApplyClick: _cache[14] || (_cache[14] = ($event) => _ctx.$emit("apply-click", $event)),
              headerCheckboxIconTemplate: $props.headerCheckboxIconTemplate,
              pt: _ctx.pt
            }, null, 8, ["column", "groupRowsBy", "groupRowSortField", "reorderableColumns", "resizableColumns", "sortMode", "sortField", "sortOrder", "multiSortMeta", "allRowsSelected", "empty", "filters", "filterDisplay", "filtersStore", "filterInputProps", "headerCheckboxIconTemplate", "pt"])) : createCommentVNode("", true)
          ], 64);
        }), 128))
      ], 16),
      $props.filterDisplay === "row" ? (openBlock(), createElementBlock("tr", mergeProps({
        key: 0,
        role: "row"
      }, _ctx.ptm("headerRow")), [
        (openBlock(true), createElementBlock(Fragment, null, renderList($props.columns, (col, i) => {
          return openBlock(), createElementBlock(Fragment, {
            key: $options.columnProp(col, "columnKey") || $options.columnProp(col, "field") || i
          }, [
            !$options.columnProp(col, "hidden") && ($props.rowGroupMode !== "subheader" || $props.groupRowsBy !== $options.columnProp(col, "field")) ? (openBlock(), createElementBlock("th", mergeProps({
              key: 0,
              style: $options.getFilterColumnHeaderStyle(col),
              class: $options.getFilterColumnHeaderClass(col)
            }, { ...$options.getColumnPTOptions(col, "root"), ...$options.getColumnPTOptions(col, "headerCell") }), [
              $options.columnProp(col, "selectionMode") === "multiple" ? (openBlock(), createBlock(_component_DTHeaderCheckbox, {
                key: 0,
                checked: $props.allRowsSelected,
                disabled: $props.empty,
                onChange: _cache[15] || (_cache[15] = ($event) => _ctx.$emit("checkbox-change", $event)),
                column: col,
                pt: _ctx.pt
              }, null, 8, ["checked", "disabled", "column", "pt"])) : createCommentVNode("", true),
              col.children && col.children.filter ? (openBlock(), createBlock(_component_DTColumnFilter, {
                key: 1,
                field: $options.columnProp(col, "filterField") || $options.columnProp(col, "field"),
                type: $options.columnProp(col, "dataType"),
                display: "row",
                showMenu: $options.columnProp(col, "showFilterMenu"),
                filterElement: col.children && col.children.filter,
                filterHeaderTemplate: col.children && col.children.filterheader,
                filterFooterTemplate: col.children && col.children.filterfooter,
                filterClearTemplate: col.children && col.children.filterclear,
                filterApplyTemplate: col.children && col.children.filterapply,
                filterIconTemplate: col.children && col.children.filtericon,
                filterAddIconTemplate: col.children && col.children.filteraddicon,
                filterRemoveIconTemplate: col.children && col.children.filterremoveicon,
                filterClearIconTemplate: col.children && col.children.filterclearicon,
                filters: $props.filters,
                filtersStore: $props.filtersStore,
                filterInputProps: $props.filterInputProps,
                onFilterChange: _cache[16] || (_cache[16] = ($event) => _ctx.$emit("filter-change", $event)),
                onFilterApply: _cache[17] || (_cache[17] = ($event) => _ctx.$emit("filter-apply")),
                filterMenuStyle: $options.columnProp(col, "filterMenuStyle"),
                filterMenuClass: $options.columnProp(col, "filterMenuClass"),
                showOperator: $options.columnProp(col, "showFilterOperator"),
                showClearButton: $options.columnProp(col, "showClearButton"),
                showApplyButton: $options.columnProp(col, "showApplyButton"),
                showMatchModes: $options.columnProp(col, "showFilterMatchModes"),
                showAddButton: $options.columnProp(col, "showAddButton"),
                matchModeOptions: $options.columnProp(col, "filterMatchModeOptions"),
                maxConstraints: $options.columnProp(col, "maxConstraints"),
                onOperatorChange: _cache[18] || (_cache[18] = ($event) => _ctx.$emit("operator-change", $event)),
                onMatchmodeChange: _cache[19] || (_cache[19] = ($event) => _ctx.$emit("matchmode-change", $event)),
                onConstraintAdd: _cache[20] || (_cache[20] = ($event) => _ctx.$emit("constraint-add", $event)),
                onConstraintRemove: _cache[21] || (_cache[21] = ($event) => _ctx.$emit("constraint-remove", $event)),
                onApplyClick: _cache[22] || (_cache[22] = ($event) => _ctx.$emit("apply-click", $event)),
                pt: _ctx.pt,
                column: col
              }, null, 8, ["field", "type", "showMenu", "filterElement", "filterHeaderTemplate", "filterFooterTemplate", "filterClearTemplate", "filterApplyTemplate", "filterIconTemplate", "filterAddIconTemplate", "filterRemoveIconTemplate", "filterClearIconTemplate", "filters", "filtersStore", "filterInputProps", "filterMenuStyle", "filterMenuClass", "showOperator", "showClearButton", "showApplyButton", "showMatchModes", "showAddButton", "matchModeOptions", "maxConstraints", "pt", "column"])) : createCommentVNode("", true)
            ], 16)) : createCommentVNode("", true)
          ], 64);
        }), 128))
      ], 16)) : createCommentVNode("", true)
    ], 64)) : (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList($options.getHeaderRows(), (row, i) => {
      return openBlock(), createElementBlock("tr", mergeProps({
        key: i,
        role: "row"
      }, $options.getRowPTOptions(row, "root")), [
        (openBlock(true), createElementBlock(Fragment, null, renderList($options.getHeaderColumns(row), (col, j) => {
          return openBlock(), createElementBlock(Fragment, {
            key: $options.columnProp(col, "columnKey") || $options.columnProp(col, "field") || j
          }, [
            !$options.columnProp(col, "hidden") && ($props.rowGroupMode !== "subheader" || $props.groupRowsBy !== $options.columnProp(col, "field")) && typeof col.children !== "string" ? (openBlock(), createBlock(_component_DTHeaderCell, {
              key: 0,
              column: col,
              onColumnClick: _cache[23] || (_cache[23] = ($event) => _ctx.$emit("column-click", $event)),
              onColumnMousedown: _cache[24] || (_cache[24] = ($event) => _ctx.$emit("column-mousedown", $event)),
              groupRowsBy: $props.groupRowsBy,
              groupRowSortField: $props.groupRowSortField,
              sortMode: $props.sortMode,
              sortField: $props.sortField,
              sortOrder: $props.sortOrder,
              multiSortMeta: $props.multiSortMeta,
              allRowsSelected: $props.allRowsSelected,
              empty: $props.empty,
              onCheckboxChange: _cache[25] || (_cache[25] = ($event) => _ctx.$emit("checkbox-change", $event)),
              filters: $props.filters,
              filterDisplay: $props.filterDisplay,
              filtersStore: $props.filtersStore,
              onFilterChange: _cache[26] || (_cache[26] = ($event) => _ctx.$emit("filter-change", $event)),
              onFilterApply: _cache[27] || (_cache[27] = ($event) => _ctx.$emit("filter-apply")),
              onOperatorChange: _cache[28] || (_cache[28] = ($event) => _ctx.$emit("operator-change", $event)),
              onMatchmodeChange: _cache[29] || (_cache[29] = ($event) => _ctx.$emit("matchmode-change", $event)),
              onConstraintAdd: _cache[30] || (_cache[30] = ($event) => _ctx.$emit("constraint-add", $event)),
              onConstraintRemove: _cache[31] || (_cache[31] = ($event) => _ctx.$emit("constraint-remove", $event)),
              onApplyClick: _cache[32] || (_cache[32] = ($event) => _ctx.$emit("apply-click", $event)),
              headerCheckboxIconTemplate: $props.headerCheckboxIconTemplate,
              pt: _ctx.pt
            }, null, 8, ["column", "groupRowsBy", "groupRowSortField", "sortMode", "sortField", "sortOrder", "multiSortMeta", "allRowsSelected", "empty", "filters", "filterDisplay", "filtersStore", "headerCheckboxIconTemplate", "pt"])) : createCommentVNode("", true)
          ], 64);
        }), 128))
      ], 16);
    }), 128))
  ], 16);
}
script$1$1.render = render$1$1;
var script$d = {
  name: "DataTable",
  extends: script$K,
  emits: [
    "value-change",
    "update:first",
    "update:rows",
    "page",
    "update:sortField",
    "update:sortOrder",
    "update:multiSortMeta",
    "sort",
    "filter",
    "row-click",
    "row-dblclick",
    "update:selection",
    "row-select",
    "row-unselect",
    "update:contextMenuSelection",
    "row-contextmenu",
    "row-unselect-all",
    "row-select-all",
    "select-all-change",
    "column-resize-end",
    "column-reorder",
    "row-reorder",
    "update:expandedRows",
    "row-collapse",
    "row-expand",
    "update:expandedRowGroups",
    "rowgroup-collapse",
    "rowgroup-expand",
    "update:filters",
    "state-restore",
    "state-save",
    "cell-edit-init",
    "cell-edit-complete",
    "cell-edit-cancel",
    "update:editingRows",
    "row-edit-init",
    "row-edit-save",
    "row-edit-cancel"
  ],
  props: {
    value: {
      type: Array,
      default: null
    },
    dataKey: {
      type: [String, Function],
      default: null
    },
    rows: {
      type: Number,
      default: 0
    },
    first: {
      type: Number,
      default: 0
    },
    totalRecords: {
      type: Number,
      default: 0
    },
    paginator: {
      type: Boolean,
      default: false
    },
    paginatorPosition: {
      type: String,
      default: "bottom"
    },
    alwaysShowPaginator: {
      type: Boolean,
      default: true
    },
    paginatorTemplate: {
      type: [Object, String],
      default: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    },
    pageLinkSize: {
      type: Number,
      default: 5
    },
    rowsPerPageOptions: {
      type: Array,
      default: null
    },
    currentPageReportTemplate: {
      type: String,
      default: "({currentPage} of {totalPages})"
    },
    lazy: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingIcon: {
      type: String,
      default: void 0
    },
    sortField: {
      type: [String, Function],
      default: null
    },
    sortOrder: {
      type: Number,
      default: null
    },
    defaultSortOrder: {
      type: Number,
      default: 1
    },
    multiSortMeta: {
      type: Array,
      default: null
    },
    sortMode: {
      type: String,
      default: "single"
    },
    removableSort: {
      type: Boolean,
      default: false
    },
    filters: {
      type: Object,
      default: null
    },
    filterDisplay: {
      type: String,
      default: null
    },
    globalFilterFields: {
      type: Array,
      default: null
    },
    filterLocale: {
      type: String,
      default: void 0
    },
    selection: {
      type: [Array, Object],
      default: null
    },
    selectionMode: {
      type: String,
      default: null
    },
    compareSelectionBy: {
      type: String,
      default: "deepEquals"
    },
    metaKeySelection: {
      type: Boolean,
      default: true
    },
    contextMenu: {
      type: Boolean,
      default: false
    },
    contextMenuSelection: {
      type: Object,
      default: null
    },
    selectAll: {
      type: Boolean,
      default: null
    },
    rowHover: {
      type: Boolean,
      default: false
    },
    csvSeparator: {
      type: String,
      default: ","
    },
    exportFilename: {
      type: String,
      default: "download"
    },
    exportFunction: {
      type: Function,
      default: null
    },
    resizableColumns: {
      type: Boolean,
      default: false
    },
    columnResizeMode: {
      type: String,
      default: "fit"
    },
    reorderableColumns: {
      type: Boolean,
      default: false
    },
    expandedRows: {
      type: Array,
      default: null
    },
    expandedRowIcon: {
      type: String,
      default: void 0
    },
    collapsedRowIcon: {
      type: String,
      default: void 0
    },
    rowGroupMode: {
      type: String,
      default: null
    },
    groupRowsBy: {
      type: [Array, String, Function],
      default: null
    },
    expandableRowGroups: {
      type: Boolean,
      default: false
    },
    expandedRowGroups: {
      type: Array,
      default: null
    },
    stateStorage: {
      type: String,
      default: "session"
    },
    stateKey: {
      type: String,
      default: null
    },
    editMode: {
      type: String,
      default: null
    },
    editingRows: {
      type: Array,
      default: null
    },
    rowClass: {
      type: null,
      default: null
    },
    rowStyle: {
      type: null,
      default: null
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    virtualScrollerOptions: {
      type: Object,
      default: null
    },
    scrollHeight: {
      type: String,
      default: null
    },
    frozenValue: {
      type: Array,
      default: null
    },
    responsiveLayout: {
      type: String,
      default: "scroll"
    },
    breakpoint: {
      type: String,
      default: "960px"
    },
    showGridlines: {
      type: Boolean,
      default: false
    },
    stripedRows: {
      type: Boolean,
      default: false
    },
    tableStyle: {
      type: null,
      default: null
    },
    tableClass: {
      type: String,
      default: null
    },
    tableProps: {
      type: null,
      default: null
    },
    filterInputProps: {
      type: null,
      default: null
    }
  },
  data() {
    return {
      d_first: this.first,
      d_rows: this.rows,
      d_sortField: this.sortField,
      d_sortOrder: this.sortOrder,
      d_multiSortMeta: this.multiSortMeta ? [...this.multiSortMeta] : [],
      d_groupRowsSortMeta: null,
      d_selectionKeys: null,
      d_expandedRowKeys: null,
      d_columnOrder: null,
      d_editingRowKeys: null,
      d_editingMeta: {},
      d_filters: this.cloneFilters(this.filters)
    };
  },
  rowTouched: false,
  anchorRowIndex: null,
  rangeRowIndex: null,
  documentColumnResizeListener: null,
  documentColumnResizeEndListener: null,
  lastResizeHelperX: null,
  resizeColumnElement: null,
  columnResizing: false,
  colReorderIconWidth: null,
  colReorderIconHeight: null,
  draggedColumn: null,
  draggedRowIndex: null,
  droppedRowIndex: null,
  rowDragging: null,
  columnWidthsState: null,
  tableWidthState: null,
  columnWidthsRestored: false,
  watch: {
    first(newValue) {
      this.d_first = newValue;
    },
    rows(newValue) {
      this.d_rows = newValue;
    },
    sortField(newValue) {
      this.d_sortField = newValue;
    },
    sortOrder(newValue) {
      this.d_sortOrder = newValue;
    },
    multiSortMeta(newValue) {
      this.d_multiSortMeta = newValue;
    },
    selection: {
      immediate: true,
      handler(newValue) {
        if (this.dataKey) {
          this.updateSelectionKeys(newValue);
        }
      }
    },
    expandedRows(newValue) {
      if (this.dataKey) {
        this.updateExpandedRowKeys(newValue);
      }
    },
    editingRows(newValue) {
      if (this.dataKey) {
        this.updateEditingRowKeys(newValue);
      }
    },
    filters: {
      deep: true,
      handler: function(newValue) {
        this.d_filters = this.cloneFilters(newValue);
      }
    }
  },
  beforeMount() {
    if (this.isStateful()) {
      this.restoreState();
    }
  },
  mounted() {
    this.$el.setAttribute(this.attributeSelector, "");
    if (this.responsiveLayout === "stack" && !this.scrollable) {
      this.createResponsiveStyle();
    }
    if (this.isStateful() && this.resizableColumns) {
      this.restoreColumnWidths();
    }
    if (this.editMode === "row" && this.dataKey && !this.d_editingRowKeys) {
      this.updateEditingRowKeys(this.editingRows);
    }
  },
  beforeUnmount() {
    this.unbindColumnResizeEvents();
    this.destroyStyleElement();
    this.destroyResponsiveStyle();
  },
  updated() {
    if (this.isStateful()) {
      this.saveState();
    }
    if (this.editMode === "row" && this.dataKey && !this.d_editingRowKeys) {
      this.updateEditingRowKeys(this.editingRows);
    }
  },
  methods: {
    columnProp(col, prop) {
      return ObjectUtils.getVNodeProp(col, prop);
    },
    onPage(event2) {
      this.clearEditingMetaData();
      this.d_first = event2.first;
      this.d_rows = event2.rows;
      let pageEvent = this.createLazyLoadEvent(event2);
      pageEvent.pageCount = event2.pageCount;
      pageEvent.page = event2.page;
      this.$emit("update:first", this.d_first);
      this.$emit("update:rows", this.d_rows);
      this.$emit("page", pageEvent);
      this.$emit("value-change", this.processedData);
    },
    onColumnHeaderClick(e) {
      const event2 = e.originalEvent;
      const column = e.column;
      if (this.columnProp(column, "sortable")) {
        const targetNode = event2.target;
        const columnField = this.columnProp(column, "sortField") || this.columnProp(column, "field");
        if (DomHandler.hasClass(targetNode, "p-sortable-column") || DomHandler.hasClass(targetNode, "p-column-title") || DomHandler.hasClass(targetNode, "p-column-header-content") || DomHandler.hasClass(targetNode, "p-sortable-column-icon") || DomHandler.hasClass(targetNode.parentElement, "p-sortable-column-icon")) {
          DomHandler.clearSelection();
          if (this.sortMode === "single") {
            if (this.d_sortField === columnField) {
              if (this.removableSort && this.d_sortOrder * -1 === this.defaultSortOrder) {
                this.d_sortOrder = null;
                this.d_sortField = null;
              } else {
                this.d_sortOrder = this.d_sortOrder * -1;
              }
            } else {
              this.d_sortOrder = this.defaultSortOrder;
              this.d_sortField = columnField;
            }
            this.$emit("update:sortField", this.d_sortField);
            this.$emit("update:sortOrder", this.d_sortOrder);
            this.resetPage();
          } else if (this.sortMode === "multiple") {
            let metaKey = event2.metaKey || event2.ctrlKey;
            if (!metaKey) {
              this.d_multiSortMeta = this.d_multiSortMeta.filter((meta) => meta.field === columnField);
            }
            this.addMultiSortField(columnField);
            this.$emit("update:multiSortMeta", this.d_multiSortMeta);
          }
          this.$emit("sort", this.createLazyLoadEvent(event2));
          this.$emit("value-change", this.processedData);
        }
      }
    },
    sortSingle(value) {
      this.clearEditingMetaData();
      if (this.groupRowsBy && this.groupRowsBy === this.sortField) {
        this.d_multiSortMeta = [
          { field: this.sortField, order: this.sortOrder || this.defaultSortOrder },
          { field: this.d_sortField, order: this.d_sortOrder }
        ];
        return this.sortMultiple(value);
      }
      let data = [...value];
      data.sort((data1, data2) => {
        let value1 = ObjectUtils.resolveFieldData(data1, this.d_sortField);
        let value2 = ObjectUtils.resolveFieldData(data2, this.d_sortField);
        let result = null;
        if (value1 == null && value2 != null)
          result = -1;
        else if (value1 != null && value2 == null)
          result = 1;
        else if (value1 == null && value2 == null)
          result = 0;
        else if (typeof value1 === "string" && typeof value2 === "string")
          result = value1.localeCompare(value2, void 0, { numeric: true });
        else
          result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
        return this.d_sortOrder * result;
      });
      return data;
    },
    sortMultiple(value) {
      this.clearEditingMetaData();
      if (this.groupRowsBy && (this.d_groupRowsSortMeta || this.d_multiSortMeta.length && this.groupRowsBy === this.d_multiSortMeta[0].field)) {
        const firstSortMeta = this.d_multiSortMeta[0];
        !this.d_groupRowsSortMeta && (this.d_groupRowsSortMeta = firstSortMeta);
        if (firstSortMeta.field !== this.d_groupRowsSortMeta.field) {
          this.d_multiSortMeta = [this.d_groupRowsSortMeta, ...this.d_multiSortMeta];
        }
      }
      let data = [...value];
      data.sort((data1, data2) => {
        return this.multisortField(data1, data2, 0);
      });
      return data;
    },
    multisortField(data1, data2, index) {
      const value1 = ObjectUtils.resolveFieldData(data1, this.d_multiSortMeta[index].field);
      const value2 = ObjectUtils.resolveFieldData(data2, this.d_multiSortMeta[index].field);
      let result = null;
      if (typeof value1 === "string" || value1 instanceof String) {
        if (value1.localeCompare && value1 !== value2) {
          return this.d_multiSortMeta[index].order * value1.localeCompare(value2, void 0, { numeric: true });
        }
      } else {
        result = value1 < value2 ? -1 : 1;
      }
      if (value1 === value2) {
        return this.d_multiSortMeta.length - 1 > index ? this.multisortField(data1, data2, index + 1) : 0;
      }
      return this.d_multiSortMeta[index].order * result;
    },
    addMultiSortField(field) {
      let index = this.d_multiSortMeta.findIndex((meta) => meta.field === field);
      if (index >= 0) {
        if (this.removableSort && this.d_multiSortMeta[index].order * -1 === this.defaultSortOrder)
          this.d_multiSortMeta.splice(index, 1);
        else
          this.d_multiSortMeta[index] = { field, order: this.d_multiSortMeta[index].order * -1 };
      } else {
        this.d_multiSortMeta.push({ field, order: this.defaultSortOrder });
      }
      this.d_multiSortMeta = [...this.d_multiSortMeta];
    },
    filter(data) {
      if (!data) {
        return;
      }
      this.clearEditingMetaData();
      let globalFilterFieldsArray;
      if (this.filters["global"]) {
        globalFilterFieldsArray = this.globalFilterFields || this.columns.map((col) => this.columnProp(col, "filterField") || this.columnProp(col, "field"));
      }
      let filteredValue = [];
      for (let i = 0; i < data.length; i++) {
        let localMatch = true;
        let globalMatch = false;
        let localFiltered = false;
        for (let prop in this.filters) {
          if (Object.prototype.hasOwnProperty.call(this.filters, prop) && prop !== "global") {
            localFiltered = true;
            let filterField = prop;
            let filterMeta = this.filters[filterField];
            if (filterMeta.operator) {
              for (let filterConstraint of filterMeta.constraints) {
                localMatch = this.executeLocalFilter(filterField, data[i], filterConstraint);
                if (filterMeta.operator === FilterOperator.OR && localMatch || filterMeta.operator === FilterOperator.AND && !localMatch) {
                  break;
                }
              }
            } else {
              localMatch = this.executeLocalFilter(filterField, data[i], filterMeta);
            }
            if (!localMatch) {
              break;
            }
          }
        }
        if (this.filters["global"] && !globalMatch && globalFilterFieldsArray) {
          for (let j = 0; j < globalFilterFieldsArray.length; j++) {
            let globalFilterField = globalFilterFieldsArray[j];
            globalMatch = FilterService.filters[this.filters["global"].matchMode || FilterMatchMode.CONTAINS](ObjectUtils.resolveFieldData(data[i], globalFilterField), this.filters["global"].value, this.filterLocale);
            if (globalMatch) {
              break;
            }
          }
        }
        let matches;
        if (this.filters["global"]) {
          matches = localFiltered ? localFiltered && localMatch && globalMatch : globalMatch;
        } else {
          matches = localFiltered && localMatch;
        }
        if (matches) {
          filteredValue.push(data[i]);
        }
      }
      if (filteredValue.length === this.value.length) {
        filteredValue = data;
      }
      let filterEvent = this.createLazyLoadEvent();
      filterEvent.filteredValue = filteredValue;
      this.$emit("filter", filterEvent);
      this.$emit("value-change", filteredValue);
      return filteredValue;
    },
    executeLocalFilter(field, rowData, filterMeta) {
      let filterValue = filterMeta.value;
      let filterMatchMode = filterMeta.matchMode || FilterMatchMode.STARTS_WITH;
      let dataFieldValue = ObjectUtils.resolveFieldData(rowData, field);
      let filterConstraint = FilterService.filters[filterMatchMode];
      return filterConstraint(dataFieldValue, filterValue, this.filterLocale);
    },
    onRowClick(e) {
      const event2 = e.originalEvent;
      const index = e.index;
      const body = this.$refs.bodyRef && this.$refs.bodyRef.$el;
      const focusedItem = DomHandler.findSingle(body, 'tr.p-selectable-row[tabindex="0"]');
      if (DomHandler.isClickable(event2.target)) {
        return;
      }
      this.$emit("row-click", e);
      if (this.selectionMode) {
        const rowData = e.data;
        const rowIndex = this.d_first + e.index;
        if (this.isMultipleSelectionMode() && event2.shiftKey && this.anchorRowIndex != null) {
          DomHandler.clearSelection();
          this.rangeRowIndex = rowIndex;
          this.selectRange(event2);
        } else {
          const selected = this.isSelected(rowData);
          const metaSelection = this.rowTouched ? false : this.metaKeySelection;
          this.anchorRowIndex = rowIndex;
          this.rangeRowIndex = rowIndex;
          if (metaSelection) {
            let metaKey = event2.metaKey || event2.ctrlKey;
            if (selected && metaKey) {
              if (this.isSingleSelectionMode()) {
                this.$emit("update:selection", null);
              } else {
                const selectionIndex = this.findIndexInSelection(rowData);
                const _selection = this.selection.filter((val, i) => i != selectionIndex);
                this.$emit("update:selection", _selection);
              }
              this.$emit("row-unselect", { originalEvent: event2, data: rowData, index: rowIndex, type: "row" });
            } else {
              if (this.isSingleSelectionMode()) {
                this.$emit("update:selection", rowData);
              } else if (this.isMultipleSelectionMode()) {
                let _selection = metaKey ? this.selection || [] : [];
                _selection = [..._selection, rowData];
                this.$emit("update:selection", _selection);
              }
              this.$emit("row-select", { originalEvent: event2, data: rowData, index: rowIndex, type: "row" });
            }
          } else {
            if (this.selectionMode === "single") {
              if (selected) {
                this.$emit("update:selection", null);
                this.$emit("row-unselect", { originalEvent: event2, data: rowData, index: rowIndex, type: "row" });
              } else {
                this.$emit("update:selection", rowData);
                this.$emit("row-select", { originalEvent: event2, data: rowData, index: rowIndex, type: "row" });
              }
            } else if (this.selectionMode === "multiple") {
              if (selected) {
                const selectionIndex = this.findIndexInSelection(rowData);
                const _selection = this.selection.filter((val, i) => i != selectionIndex);
                this.$emit("update:selection", _selection);
                this.$emit("row-unselect", { originalEvent: event2, data: rowData, index: rowIndex, type: "row" });
              } else {
                const _selection = this.selection ? [...this.selection, rowData] : [rowData];
                this.$emit("update:selection", _selection);
                this.$emit("row-select", { originalEvent: event2, data: rowData, index: rowIndex, type: "row" });
              }
            }
          }
        }
      }
      this.rowTouched = false;
      if (focusedItem) {
        focusedItem.tabIndex = "-1";
        DomHandler.find(body, "tr.p-selectable-row")[index].tabIndex = "0";
      }
    },
    onRowDblClick(e) {
      const event2 = e.originalEvent;
      if (DomHandler.isClickable(event2.target)) {
        return;
      }
      this.$emit("row-dblclick", e);
    },
    onRowRightClick(event2) {
      if (this.contextMenu) {
        DomHandler.clearSelection();
        event2.originalEvent.target.focus();
      }
      this.$emit("update:contextMenuSelection", event2.data);
      this.$emit("row-contextmenu", event2);
    },
    onRowTouchEnd() {
      this.rowTouched = true;
    },
    onRowKeyDown(e, slotProps) {
      const event2 = e.originalEvent;
      const rowData = e.data;
      const rowIndex = e.index;
      const metaKey = event2.metaKey || event2.ctrlKey;
      if (this.selectionMode) {
        const row = event2.target;
        switch (event2.code) {
          case "ArrowDown":
            this.onArrowDownKey(event2, row, rowIndex, slotProps);
            break;
          case "ArrowUp":
            this.onArrowUpKey(event2, row, rowIndex, slotProps);
            break;
          case "Home":
            this.onHomeKey(event2, row, rowIndex, slotProps);
            break;
          case "End":
            this.onEndKey(event2, row, rowIndex, slotProps);
            break;
          case "Enter":
            this.onEnterKey(event2, rowData, rowIndex);
            break;
          case "Space":
            this.onSpaceKey(event2, rowData, rowIndex, slotProps);
            break;
          case "Tab":
            this.onTabKey(event2, rowIndex);
            break;
          default:
            if (event2.code === "KeyA" && metaKey) {
              const data = this.dataToRender(slotProps.rows);
              this.$emit("update:selection", data);
            }
            break;
        }
      }
    },
    onArrowDownKey(event2, row, rowIndex, slotProps) {
      const nextRow = this.findNextSelectableRow(row);
      nextRow && this.focusRowChange(row, nextRow);
      if (event2.shiftKey) {
        const data = this.dataToRender(slotProps.rows);
        const nextRowIndex = rowIndex + 1 >= data.length ? data.length - 1 : rowIndex + 1;
        this.onRowClick({ originalEvent: event2, data: data[nextRowIndex], index: nextRowIndex });
      }
      event2.preventDefault();
    },
    onArrowUpKey(event2, row, rowIndex, slotProps) {
      const prevRow = this.findPrevSelectableRow(row);
      prevRow && this.focusRowChange(row, prevRow);
      if (event2.shiftKey) {
        const data = this.dataToRender(slotProps.rows);
        const prevRowIndex = rowIndex - 1 <= 0 ? 0 : rowIndex - 1;
        this.onRowClick({ originalEvent: event2, data: data[prevRowIndex], index: prevRowIndex });
      }
      event2.preventDefault();
    },
    onHomeKey(event2, row, rowIndex, slotProps) {
      const firstRow = this.findFirstSelectableRow();
      firstRow && this.focusRowChange(row, firstRow);
      if (event2.ctrlKey && event2.shiftKey) {
        const data = this.dataToRender(slotProps.rows);
        this.$emit("update:selection", data.slice(0, rowIndex + 1));
      }
      event2.preventDefault();
    },
    onEndKey(event2, row, rowIndex, slotProps) {
      const lastRow = this.findLastSelectableRow();
      lastRow && this.focusRowChange(row, lastRow);
      if (event2.ctrlKey && event2.shiftKey) {
        const data = this.dataToRender(slotProps.rows);
        this.$emit("update:selection", data.slice(rowIndex, data.length));
      }
      event2.preventDefault();
    },
    onEnterKey(event2, rowData, rowIndex) {
      this.onRowClick({ originalEvent: event2, data: rowData, index: rowIndex });
      event2.preventDefault();
    },
    onSpaceKey(event2, rowData, rowIndex, slotProps) {
      this.onEnterKey(event2, rowData, rowIndex);
      if (event2.shiftKey && this.selection !== null) {
        const data = this.dataToRender(slotProps.rows);
        let index;
        if (this.selection.length > 0) {
          let firstSelectedRowIndex, lastSelectedRowIndex;
          firstSelectedRowIndex = ObjectUtils.findIndexInList(this.selection[0], data);
          lastSelectedRowIndex = ObjectUtils.findIndexInList(this.selection[this.selection.length - 1], data);
          index = rowIndex <= firstSelectedRowIndex ? lastSelectedRowIndex : firstSelectedRowIndex;
        } else {
          index = ObjectUtils.findIndexInList(this.selection, data);
        }
        const _selection = index !== rowIndex ? data.slice(Math.min(index, rowIndex), Math.max(index, rowIndex) + 1) : rowData;
        this.$emit("update:selection", _selection);
      }
    },
    onTabKey(event2, rowIndex) {
      const body = this.$refs.bodyRef && this.$refs.bodyRef.$el;
      const rows = DomHandler.find(body, "tr.p-selectable-row");
      if (event2.code === "Tab" && rows && rows.length > 0) {
        const firstSelectedRow = DomHandler.findSingle(body, "tr.p-highlight");
        const focusedItem = DomHandler.findSingle(body, 'tr.p-selectable-row[tabindex="0"]');
        if (firstSelectedRow) {
          firstSelectedRow.tabIndex = "0";
          focusedItem && focusedItem !== firstSelectedRow && (focusedItem.tabIndex = "-1");
        } else {
          rows[0].tabIndex = "0";
          focusedItem !== rows[0] && (rows[rowIndex].tabIndex = "-1");
        }
      }
    },
    findNextSelectableRow(row) {
      let nextRow = row.nextElementSibling;
      if (nextRow) {
        if (DomHandler.hasClass(nextRow, "p-selectable-row"))
          return nextRow;
        else
          return this.findNextSelectableRow(nextRow);
      } else {
        return null;
      }
    },
    findPrevSelectableRow(row) {
      let prevRow = row.previousElementSibling;
      if (prevRow) {
        if (DomHandler.hasClass(prevRow, "p-selectable-row"))
          return prevRow;
        else
          return this.findPrevSelectableRow(prevRow);
      } else {
        return null;
      }
    },
    findFirstSelectableRow() {
      const firstRow = DomHandler.findSingle(this.$refs.table, ".p-selectable-row");
      return firstRow;
    },
    findLastSelectableRow() {
      const rows = DomHandler.find(this.$refs.table, ".p-selectable-row");
      return rows ? rows[rows.length - 1] : null;
    },
    focusRowChange(firstFocusableRow, currentFocusedRow) {
      firstFocusableRow.tabIndex = "-1";
      currentFocusedRow.tabIndex = "0";
      DomHandler.focus(currentFocusedRow);
    },
    toggleRowWithRadio(event2) {
      const rowData = event2.data;
      if (this.isSelected(rowData)) {
        this.$emit("update:selection", null);
        this.$emit("row-unselect", { originalEvent: event2.originalEvent, data: rowData, index: event2.index, type: "radiobutton" });
      } else {
        this.$emit("update:selection", rowData);
        this.$emit("row-select", { originalEvent: event2.originalEvent, data: rowData, index: event2.index, type: "radiobutton" });
      }
    },
    toggleRowWithCheckbox(event2) {
      const rowData = event2.data;
      if (this.isSelected(rowData)) {
        const selectionIndex = this.findIndexInSelection(rowData);
        const _selection = this.selection.filter((val, i) => i != selectionIndex);
        this.$emit("update:selection", _selection);
        this.$emit("row-unselect", { originalEvent: event2.originalEvent, data: rowData, index: event2.index, type: "checkbox" });
      } else {
        let _selection = this.selection ? [...this.selection] : [];
        _selection = [..._selection, rowData];
        this.$emit("update:selection", _selection);
        this.$emit("row-select", { originalEvent: event2.originalEvent, data: rowData, index: event2.index, type: "checkbox" });
      }
    },
    toggleRowsWithCheckbox(event2) {
      if (this.selectAll !== null) {
        this.$emit("select-all-change", event2);
      } else {
        const { originalEvent, checked } = event2;
        let _selection = [];
        if (checked) {
          _selection = this.frozenValue ? [...this.frozenValue, ...this.processedData] : this.processedData;
          this.$emit("row-select-all", { originalEvent, data: _selection });
        } else {
          this.$emit("row-unselect-all", { originalEvent });
        }
        this.$emit("update:selection", _selection);
      }
    },
    isSingleSelectionMode() {
      return this.selectionMode === "single";
    },
    isMultipleSelectionMode() {
      return this.selectionMode === "multiple";
    },
    isSelected(rowData) {
      if (rowData && this.selection) {
        if (this.dataKey) {
          return this.d_selectionKeys ? this.d_selectionKeys[ObjectUtils.resolveFieldData(rowData, this.dataKey)] !== void 0 : false;
        } else {
          if (this.selection instanceof Array)
            return this.findIndexInSelection(rowData) > -1;
          else
            return this.equals(rowData, this.selection);
        }
      }
      return false;
    },
    findIndexInSelection(rowData) {
      return this.findIndex(rowData, this.selection);
    },
    findIndex(rowData, collection) {
      let index = -1;
      if (collection && collection.length) {
        for (let i = 0; i < collection.length; i++) {
          if (this.equals(rowData, collection[i])) {
            index = i;
            break;
          }
        }
      }
      return index;
    },
    updateSelectionKeys(selection) {
      this.d_selectionKeys = {};
      if (Array.isArray(selection)) {
        for (let data of selection) {
          this.d_selectionKeys[String(ObjectUtils.resolveFieldData(data, this.dataKey))] = 1;
        }
      } else {
        this.d_selectionKeys[String(ObjectUtils.resolveFieldData(selection, this.dataKey))] = 1;
      }
    },
    updateExpandedRowKeys(expandedRows) {
      if (expandedRows && expandedRows.length) {
        this.d_expandedRowKeys = {};
        for (let data of expandedRows) {
          this.d_expandedRowKeys[String(ObjectUtils.resolveFieldData(data, this.dataKey))] = 1;
        }
      } else {
        this.d_expandedRowKeys = null;
      }
    },
    updateEditingRowKeys(editingRows) {
      if (editingRows && editingRows.length) {
        this.d_editingRowKeys = {};
        for (let data of editingRows) {
          this.d_editingRowKeys[String(ObjectUtils.resolveFieldData(data, this.dataKey))] = 1;
        }
      } else {
        this.d_editingRowKeys = null;
      }
    },
    equals(data1, data2) {
      return this.compareSelectionBy === "equals" ? data1 === data2 : ObjectUtils.equals(data1, data2, this.dataKey);
    },
    selectRange(event2) {
      let rangeStart, rangeEnd;
      if (this.rangeRowIndex > this.anchorRowIndex) {
        rangeStart = this.anchorRowIndex;
        rangeEnd = this.rangeRowIndex;
      } else if (this.rangeRowIndex < this.anchorRowIndex) {
        rangeStart = this.rangeRowIndex;
        rangeEnd = this.anchorRowIndex;
      } else {
        rangeStart = this.rangeRowIndex;
        rangeEnd = this.rangeRowIndex;
      }
      if (this.lazy && this.paginator) {
        rangeStart -= this.first;
        rangeEnd -= this.first;
      }
      const value = this.processedData;
      let _selection = [];
      for (let i = rangeStart; i <= rangeEnd; i++) {
        let rangeRowData = value[i];
        _selection.push(rangeRowData);
        this.$emit("row-select", { originalEvent: event2, data: rangeRowData, type: "row" });
      }
      this.$emit("update:selection", _selection);
    },
    exportCSV(options, data) {
      let csv = "\uFEFF";
      if (!data) {
        data = this.processedData;
        if (options && options.selectionOnly)
          data = this.selection || [];
        else if (this.frozenValue)
          data = data ? [...this.frozenValue, ...data] : this.frozenValue;
      }
      let headerInitiated = false;
      for (let i = 0; i < this.columns.length; i++) {
        let column = this.columns[i];
        if (this.columnProp(column, "exportable") !== false && this.columnProp(column, "field")) {
          if (headerInitiated)
            csv += this.csvSeparator;
          else
            headerInitiated = true;
          csv += '"' + (this.columnProp(column, "exportHeader") || this.columnProp(column, "header") || this.columnProp(column, "field")) + '"';
        }
      }
      if (data) {
        data.forEach((record) => {
          csv += "\n";
          let rowInitiated = false;
          for (let i = 0; i < this.columns.length; i++) {
            let column = this.columns[i];
            if (this.columnProp(column, "exportable") !== false && this.columnProp(column, "field")) {
              if (rowInitiated)
                csv += this.csvSeparator;
              else
                rowInitiated = true;
              let cellData = ObjectUtils.resolveFieldData(record, this.columnProp(column, "field"));
              if (cellData != null) {
                if (this.exportFunction) {
                  cellData = this.exportFunction({
                    data: cellData,
                    field: this.columnProp(column, "field")
                  });
                } else
                  cellData = String(cellData).replace(/"/g, '""');
              } else
                cellData = "";
              csv += '"' + cellData + '"';
            }
          }
        });
      }
      let footerInitiated = false;
      for (let i = 0; i < this.columns.length; i++) {
        let column = this.columns[i];
        if (i === 0)
          csv += "\n";
        if (this.columnProp(column, "exportable") !== false && this.columnProp(column, "exportFooter")) {
          if (footerInitiated)
            csv += this.csvSeparator;
          else
            footerInitiated = true;
          csv += '"' + (this.columnProp(column, "exportFooter") || this.columnProp(column, "footer") || this.columnProp(column, "field")) + '"';
        }
      }
      DomHandler.exportCSV(csv, this.exportFilename);
    },
    resetPage() {
      this.d_first = 0;
      this.$emit("update:first", this.d_first);
    },
    onColumnResizeStart(event2) {
      let containerLeft = DomHandler.getOffset(this.$el).left;
      this.resizeColumnElement = event2.target.parentElement;
      this.columnResizing = true;
      this.lastResizeHelperX = event2.pageX - containerLeft + this.$el.scrollLeft;
      this.bindColumnResizeEvents();
    },
    onColumnResize(event2) {
      let containerLeft = DomHandler.getOffset(this.$el).left;
      DomHandler.addClass(this.$el, "p-unselectable-text");
      this.$refs.resizeHelper.style.height = this.$el.offsetHeight + "px";
      this.$refs.resizeHelper.style.top = "0px";
      this.$refs.resizeHelper.style.left = event2.pageX - containerLeft + this.$el.scrollLeft + "px";
      this.$refs.resizeHelper.style.display = "block";
    },
    onColumnResizeEnd() {
      let delta = this.$refs.resizeHelper.offsetLeft - this.lastResizeHelperX;
      let columnWidth = this.resizeColumnElement.offsetWidth;
      let newColumnWidth = columnWidth + delta;
      let minWidth = this.resizeColumnElement.style.minWidth || 15;
      if (columnWidth + delta > parseInt(minWidth, 10)) {
        if (this.columnResizeMode === "fit") {
          let nextColumn = this.resizeColumnElement.nextElementSibling;
          let nextColumnWidth = nextColumn.offsetWidth - delta;
          if (newColumnWidth > 15 && nextColumnWidth > 15) {
            this.resizeTableCells(newColumnWidth, nextColumnWidth);
          }
        } else if (this.columnResizeMode === "expand") {
          const tableWidth = this.$refs.table.offsetWidth + delta + "px";
          const updateTableWidth = (el) => {
            !!el && (el.style.width = el.style.minWidth = tableWidth);
          };
          updateTableWidth(this.$refs.table);
          if (!this.virtualScrollerDisabled) {
            const body = this.$refs.bodyRef && this.$refs.bodyRef.$el;
            const frozenBody = this.$refs.frozenBodyRef && this.$refs.frozenBodyRef.$el;
            updateTableWidth(body);
            updateTableWidth(frozenBody);
          }
          this.resizeTableCells(newColumnWidth);
        }
        this.$emit("column-resize-end", {
          element: this.resizeColumnElement,
          delta
        });
      }
      this.$refs.resizeHelper.style.display = "none";
      this.resizeColumn = null;
      DomHandler.removeClass(this.$el, "p-unselectable-text");
      this.unbindColumnResizeEvents();
      if (this.isStateful()) {
        this.saveState();
      }
    },
    resizeTableCells(newColumnWidth, nextColumnWidth) {
      let colIndex = DomHandler.index(this.resizeColumnElement);
      let widths = [];
      let headers = DomHandler.find(this.$refs.table, ".p-datatable-thead > tr > th");
      headers.forEach((header) => widths.push(DomHandler.getOuterWidth(header)));
      this.destroyStyleElement();
      this.createStyleElement();
      let innerHTML = "";
      let selector = `.p-datatable[${this.attributeSelector}] > .p-datatable-wrapper ${this.virtualScrollerDisabled ? "" : "> .p-virtualscroller"} > .p-datatable-table`;
      widths.forEach((width, index) => {
        let colWidth = index === colIndex ? newColumnWidth : nextColumnWidth && index === colIndex + 1 ? nextColumnWidth : width;
        let style = `width: ${colWidth}px !important; max-width: ${colWidth}px !important`;
        innerHTML += `
                    ${selector} > .p-datatable-thead > tr > th:nth-child(${index + 1}),
                    ${selector} > .p-datatable-tbody > tr > td:nth-child(${index + 1}),
                    ${selector} > .p-datatable-tfoot > tr > td:nth-child(${index + 1}) {
                        ${style}
                    }
                `;
      });
      this.styleElement.innerHTML = innerHTML;
    },
    bindColumnResizeEvents() {
      if (!this.documentColumnResizeListener) {
        this.documentColumnResizeListener = document.addEventListener("mousemove", () => {
          if (this.columnResizing) {
            this.onColumnResize(event);
          }
        });
      }
      if (!this.documentColumnResizeEndListener) {
        this.documentColumnResizeEndListener = document.addEventListener("mouseup", () => {
          if (this.columnResizing) {
            this.columnResizing = false;
            this.onColumnResizeEnd();
          }
        });
      }
    },
    unbindColumnResizeEvents() {
      if (this.documentColumnResizeListener) {
        document.removeEventListener("document", this.documentColumnResizeListener);
        this.documentColumnResizeListener = null;
      }
      if (this.documentColumnResizeEndListener) {
        document.removeEventListener("document", this.documentColumnResizeEndListener);
        this.documentColumnResizeEndListener = null;
      }
    },
    onColumnHeaderMouseDown(e) {
      const event2 = e.originalEvent;
      const column = e.column;
      if (this.reorderableColumns && this.columnProp(column, "reorderableColumn") !== false) {
        if (event2.target.nodeName === "INPUT" || event2.target.nodeName === "TEXTAREA" || DomHandler.hasClass(event2.target, "p-column-resizer"))
          event2.currentTarget.draggable = false;
        else
          event2.currentTarget.draggable = true;
      }
    },
    onColumnHeaderDragStart(event2) {
      if (this.columnResizing) {
        event2.preventDefault();
        return;
      }
      this.colReorderIconWidth = DomHandler.getHiddenElementOuterWidth(this.$refs.reorderIndicatorUp);
      this.colReorderIconHeight = DomHandler.getHiddenElementOuterHeight(this.$refs.reorderIndicatorUp);
      this.draggedColumn = this.findParentHeader(event2.target);
      event2.dataTransfer.setData("text", "b");
    },
    onColumnHeaderDragOver(event2) {
      let dropHeader = this.findParentHeader(event2.target);
      if (this.reorderableColumns && this.draggedColumn && dropHeader) {
        event2.preventDefault();
        let containerOffset = DomHandler.getOffset(this.$el);
        let dropHeaderOffset = DomHandler.getOffset(dropHeader);
        if (this.draggedColumn !== dropHeader) {
          let targetLeft = dropHeaderOffset.left - containerOffset.left;
          let columnCenter = dropHeaderOffset.left + dropHeader.offsetWidth / 2;
          this.$refs.reorderIndicatorUp.style.top = dropHeaderOffset.top - containerOffset.top - (this.colReorderIconHeight - 1) + "px";
          this.$refs.reorderIndicatorDown.style.top = dropHeaderOffset.top - containerOffset.top + dropHeader.offsetHeight + "px";
          if (event2.pageX > columnCenter) {
            this.$refs.reorderIndicatorUp.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(this.colReorderIconWidth / 2) + "px";
            this.$refs.reorderIndicatorDown.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(this.colReorderIconWidth / 2) + "px";
            this.dropPosition = 1;
          } else {
            this.$refs.reorderIndicatorUp.style.left = targetLeft - Math.ceil(this.colReorderIconWidth / 2) + "px";
            this.$refs.reorderIndicatorDown.style.left = targetLeft - Math.ceil(this.colReorderIconWidth / 2) + "px";
            this.dropPosition = -1;
          }
          this.$refs.reorderIndicatorUp.style.display = "block";
          this.$refs.reorderIndicatorDown.style.display = "block";
        }
      }
    },
    onColumnHeaderDragLeave(event2) {
      if (this.reorderableColumns && this.draggedColumn) {
        event2.preventDefault();
        this.$refs.reorderIndicatorUp.style.display = "none";
        this.$refs.reorderIndicatorDown.style.display = "none";
      }
    },
    onColumnHeaderDrop(event2) {
      event2.preventDefault();
      if (this.draggedColumn) {
        let dragIndex = DomHandler.index(this.draggedColumn);
        let dropIndex = DomHandler.index(this.findParentHeader(event2.target));
        let allowDrop = dragIndex !== dropIndex;
        if (allowDrop && (dropIndex - dragIndex === 1 && this.dropPosition === -1 || dropIndex - dragIndex === -1 && this.dropPosition === 1)) {
          allowDrop = false;
        }
        if (allowDrop) {
          ObjectUtils.reorderArray(this.columns, dragIndex, dropIndex);
          this.updateReorderableColumns();
          this.$emit("column-reorder", {
            originalEvent: event2,
            dragIndex,
            dropIndex
          });
        }
        this.$refs.reorderIndicatorUp.style.display = "none";
        this.$refs.reorderIndicatorDown.style.display = "none";
        this.draggedColumn.draggable = false;
        this.draggedColumn = null;
        this.dropPosition = null;
      }
    },
    findParentHeader(element) {
      if (element.nodeName === "TH") {
        return element;
      } else {
        let parent = element.parentElement;
        while (parent.nodeName !== "TH") {
          parent = parent.parentElement;
          if (!parent)
            break;
        }
        return parent;
      }
    },
    findColumnByKey(columns, key) {
      if (columns && columns.length) {
        for (let i = 0; i < columns.length; i++) {
          let column = columns[i];
          if (this.columnProp(column, "columnKey") === key || this.columnProp(column, "field") === key) {
            return column;
          }
        }
      }
      return null;
    },
    onRowMouseDown(event2) {
      if (DomHandler.hasClass(event2.target, "p-datatable-reorderablerow-handle"))
        event2.currentTarget.draggable = true;
      else
        event2.currentTarget.draggable = false;
    },
    onRowDragStart(e) {
      const event2 = e.originalEvent;
      const index = e.index;
      this.rowDragging = true;
      this.draggedRowIndex = index;
      event2.dataTransfer.setData("text", "b");
    },
    onRowDragOver(e) {
      const event2 = e.originalEvent;
      const index = e.index;
      if (this.rowDragging && this.draggedRowIndex !== index) {
        let rowElement = event2.currentTarget;
        let rowY = DomHandler.getOffset(rowElement).top + DomHandler.getWindowScrollTop();
        let pageY = event2.pageY;
        let rowMidY = rowY + DomHandler.getOuterHeight(rowElement) / 2;
        let prevRowElement = rowElement.previousElementSibling;
        if (pageY < rowMidY) {
          DomHandler.removeClass(rowElement, "p-datatable-dragpoint-bottom");
          this.droppedRowIndex = index;
          if (prevRowElement)
            DomHandler.addClass(prevRowElement, "p-datatable-dragpoint-bottom");
          else
            DomHandler.addClass(rowElement, "p-datatable-dragpoint-top");
        } else {
          if (prevRowElement)
            DomHandler.removeClass(prevRowElement, "p-datatable-dragpoint-bottom");
          else
            DomHandler.addClass(rowElement, "p-datatable-dragpoint-top");
          this.droppedRowIndex = index + 1;
          DomHandler.addClass(rowElement, "p-datatable-dragpoint-bottom");
        }
        event2.preventDefault();
      }
    },
    onRowDragLeave(event2) {
      let rowElement = event2.currentTarget;
      let prevRowElement = rowElement.previousElementSibling;
      if (prevRowElement) {
        DomHandler.removeClass(prevRowElement, "p-datatable-dragpoint-bottom");
      }
      DomHandler.removeClass(rowElement, "p-datatable-dragpoint-bottom");
      DomHandler.removeClass(rowElement, "p-datatable-dragpoint-top");
    },
    onRowDragEnd(event2) {
      this.rowDragging = false;
      this.draggedRowIndex = null;
      this.droppedRowIndex = null;
      event2.currentTarget.draggable = false;
    },
    onRowDrop(event2) {
      if (this.droppedRowIndex != null) {
        let dropIndex = this.draggedRowIndex > this.droppedRowIndex ? this.droppedRowIndex : this.droppedRowIndex === 0 ? 0 : this.droppedRowIndex - 1;
        let processedData = [...this.processedData];
        ObjectUtils.reorderArray(processedData, this.draggedRowIndex + this.d_first, dropIndex + this.d_first);
        this.$emit("row-reorder", {
          originalEvent: event2,
          dragIndex: this.draggedRowIndex,
          dropIndex,
          value: processedData
        });
      }
      this.onRowDragLeave(event2);
      this.onRowDragEnd(event2);
      event2.preventDefault();
    },
    toggleRow(event2) {
      let rowData = event2.data;
      let expanded;
      let expandedRowIndex;
      let _expandedRows = this.expandedRows ? [...this.expandedRows] : [];
      if (this.dataKey) {
        expanded = this.d_expandedRowKeys ? this.d_expandedRowKeys[ObjectUtils.resolveFieldData(rowData, this.dataKey)] !== void 0 : false;
      } else {
        expandedRowIndex = this.findIndex(rowData, this.expandedRows);
        expanded = expandedRowIndex > -1;
      }
      if (expanded) {
        if (expandedRowIndex == null) {
          expandedRowIndex = this.findIndex(rowData, this.expandedRows);
        }
        _expandedRows.splice(expandedRowIndex, 1);
        this.$emit("update:expandedRows", _expandedRows);
        this.$emit("row-collapse", event2);
      } else {
        _expandedRows.push(rowData);
        this.$emit("update:expandedRows", _expandedRows);
        this.$emit("row-expand", event2);
      }
    },
    toggleRowGroup(e) {
      const event2 = e.originalEvent;
      const data = e.data;
      const groupFieldValue = ObjectUtils.resolveFieldData(data, this.groupRowsBy);
      let _expandedRowGroups = this.expandedRowGroups ? [...this.expandedRowGroups] : [];
      if (this.isRowGroupExpanded(data)) {
        _expandedRowGroups = _expandedRowGroups.filter((group) => group !== groupFieldValue);
        this.$emit("update:expandedRowGroups", _expandedRowGroups);
        this.$emit("rowgroup-collapse", { originalEvent: event2, data: groupFieldValue });
      } else {
        _expandedRowGroups.push(groupFieldValue);
        this.$emit("update:expandedRowGroups", _expandedRowGroups);
        this.$emit("rowgroup-expand", { originalEvent: event2, data: groupFieldValue });
      }
    },
    isRowGroupExpanded(rowData) {
      if (this.expandableRowGroups && this.expandedRowGroups) {
        let groupFieldValue = ObjectUtils.resolveFieldData(rowData, this.groupRowsBy);
        return this.expandedRowGroups.indexOf(groupFieldValue) > -1;
      }
      return false;
    },
    isStateful() {
      return this.stateKey != null;
    },
    getStorage() {
      switch (this.stateStorage) {
        case "local":
          return window.localStorage;
        case "session":
          return window.sessionStorage;
        default:
          throw new Error(this.stateStorage + ' is not a valid value for the state storage, supported values are "local" and "session".');
      }
    },
    saveState() {
      const storage = this.getStorage();
      let state = {};
      if (this.paginator) {
        state.first = this.d_first;
        state.rows = this.d_rows;
      }
      if (this.d_sortField) {
        state.sortField = this.d_sortField;
        state.sortOrder = this.d_sortOrder;
      }
      if (this.d_multiSortMeta) {
        state.multiSortMeta = this.d_multiSortMeta;
      }
      if (this.hasFilters) {
        state.filters = this.filters;
      }
      if (this.resizableColumns) {
        this.saveColumnWidths(state);
      }
      if (this.reorderableColumns) {
        state.columnOrder = this.d_columnOrder;
      }
      if (this.expandedRows) {
        state.expandedRows = this.expandedRows;
        state.expandedRowKeys = this.d_expandedRowKeys;
      }
      if (this.expandedRowGroups) {
        state.expandedRowGroups = this.expandedRowGroups;
      }
      if (this.selection) {
        state.selection = this.selection;
        state.selectionKeys = this.d_selectionKeys;
      }
      if (Object.keys(state).length) {
        storage.setItem(this.stateKey, JSON.stringify(state));
      }
      this.$emit("state-save", state);
    },
    restoreState() {
      const storage = this.getStorage();
      const stateString = storage.getItem(this.stateKey);
      const dateFormat = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
      const reviver = function(key, value) {
        if (typeof value === "string" && dateFormat.test(value)) {
          return new Date(value);
        }
        return value;
      };
      if (stateString) {
        let restoredState = JSON.parse(stateString, reviver);
        if (this.paginator) {
          this.d_first = restoredState.first;
          this.d_rows = restoredState.rows;
        }
        if (restoredState.sortField) {
          this.d_sortField = restoredState.sortField;
          this.d_sortOrder = restoredState.sortOrder;
        }
        if (restoredState.multiSortMeta) {
          this.d_multiSortMeta = restoredState.multiSortMeta;
        }
        if (restoredState.filters) {
          this.$emit("update:filters", restoredState.filters);
        }
        if (this.resizableColumns) {
          this.columnWidthsState = restoredState.columnWidths;
          this.tableWidthState = restoredState.tableWidth;
        }
        if (this.reorderableColumns) {
          this.d_columnOrder = restoredState.columnOrder;
        }
        if (restoredState.expandedRows) {
          this.d_expandedRowKeys = restoredState.expandedRowKeys;
          this.$emit("update:expandedRows", restoredState.expandedRows);
        }
        if (restoredState.expandedRowGroups) {
          this.$emit("update:expandedRowGroups", restoredState.expandedRowGroups);
        }
        if (restoredState.selection) {
          this.d_selectionKeys = restoredState.d_selectionKeys;
          this.$emit("update:selection", restoredState.selection);
        }
        this.$emit("state-restore", restoredState);
      }
    },
    saveColumnWidths(state) {
      let widths = [];
      let headers = DomHandler.find(this.$el, ".p-datatable-thead > tr > th");
      headers.forEach((header) => widths.push(DomHandler.getOuterWidth(header)));
      state.columnWidths = widths.join(",");
      if (this.columnResizeMode === "expand") {
        state.tableWidth = DomHandler.getOuterWidth(this.$refs.table) + "px";
      }
    },
    restoreColumnWidths() {
      if (this.columnWidthsState) {
        let widths = this.columnWidthsState.split(",");
        if (this.columnResizeMode === "expand" && this.tableWidthState) {
          this.$refs.table.style.width = this.tableWidthState;
          this.$refs.table.style.minWidth = this.tableWidthState;
          this.$el.style.width = this.tableWidthState;
        }
        if (ObjectUtils.isNotEmpty(widths)) {
          this.createStyleElement();
          let innerHTML = "";
          let selector = `.p-datatable[${this.attributeSelector}] > .p-datatable-wrapper ${this.virtualScrollerDisabled ? "" : "> .p-virtualscroller"} > .p-datatable-table`;
          widths.forEach((width, index) => {
            let style = `width: ${width}px !important; max-width: ${width}px !important`;
            innerHTML += `
                            ${selector} > .p-datatable-thead > tr > th:nth-child(${index + 1}),
                            ${selector} > .p-datatable-tbody > tr > td:nth-child(${index + 1}),
                            ${selector} > .p-datatable-tfoot > tr > td:nth-child(${index + 1}) {
                                ${style}
                            }
                        `;
          });
          this.styleElement.innerHTML = innerHTML;
        }
      }
    },
    onCellEditInit(event2) {
      this.$emit("cell-edit-init", event2);
    },
    onCellEditComplete(event2) {
      this.$emit("cell-edit-complete", event2);
    },
    onCellEditCancel(event2) {
      this.$emit("cell-edit-cancel", event2);
    },
    onRowEditInit(event2) {
      let _editingRows = this.editingRows ? [...this.editingRows] : [];
      _editingRows.push(event2.data);
      this.$emit("update:editingRows", _editingRows);
      this.$emit("row-edit-init", event2);
    },
    onRowEditSave(event2) {
      let _editingRows = [...this.editingRows];
      _editingRows.splice(this.findIndex(event2.data, _editingRows), 1);
      this.$emit("update:editingRows", _editingRows);
      this.$emit("row-edit-save", event2);
    },
    onRowEditCancel(event2) {
      let _editingRows = [...this.editingRows];
      _editingRows.splice(this.findIndex(event2.data, _editingRows), 1);
      this.$emit("update:editingRows", _editingRows);
      this.$emit("row-edit-cancel", event2);
    },
    onEditingMetaChange(event2) {
      let { data, field, index, editing } = event2;
      let editingMeta = { ...this.d_editingMeta };
      let meta = editingMeta[index];
      if (editing) {
        !meta && (meta = editingMeta[index] = { data: { ...data }, fields: [] });
        meta["fields"].push(field);
      } else if (meta) {
        const fields = meta["fields"].filter((f) => f !== field);
        !fields.length ? delete editingMeta[index] : meta["fields"] = fields;
      }
      this.d_editingMeta = editingMeta;
    },
    clearEditingMetaData() {
      if (this.editMode) {
        this.d_editingMeta = {};
      }
    },
    createLazyLoadEvent(event2) {
      return {
        originalEvent: event2,
        first: this.d_first,
        rows: this.d_rows,
        sortField: this.d_sortField,
        sortOrder: this.d_sortOrder,
        multiSortMeta: this.d_multiSortMeta,
        filters: this.d_filters
      };
    },
    hasGlobalFilter() {
      return this.filters && Object.prototype.hasOwnProperty.call(this.filters, "global");
    },
    getChildren() {
      return this.$slots.default ? this.$slots.default() : null;
    },
    onFilterChange(filters) {
      this.d_filters = filters;
    },
    onFilterApply() {
      this.d_first = 0;
      this.$emit("update:first", this.d_first);
      this.$emit("update:filters", this.d_filters);
      if (this.lazy) {
        this.$emit("filter", this.createLazyLoadEvent());
      }
    },
    cloneFilters() {
      let cloned = {};
      if (this.filters) {
        Object.entries(this.filters).forEach(([prop, value]) => {
          cloned[prop] = value.operator ? {
            operator: value.operator,
            constraints: value.constraints.map((constraint) => {
              return { ...constraint };
            })
          } : { ...value };
        });
      }
      return cloned;
    },
    updateReorderableColumns() {
      let columnOrder = [];
      this.columns.forEach((col) => columnOrder.push(this.columnProp(col, "columnKey") || this.columnProp(col, "field")));
      this.d_columnOrder = columnOrder;
    },
    createStyleElement() {
      this.styleElement = document.createElement("style");
      this.styleElement.type = "text/css";
      document.head.appendChild(this.styleElement);
    },
    createResponsiveStyle() {
      if (!this.responsiveStyleElement) {
        this.responsiveStyleElement = document.createElement("style");
        this.responsiveStyleElement.type = "text/css";
        document.head.appendChild(this.responsiveStyleElement);
        let tableSelector = `.p-datatable-wrapper ${this.virtualScrollerDisabled ? "" : "> .p-virtualscroller"} > .p-datatable-table`;
        let selector = `.p-datatable[${this.attributeSelector}] > ${tableSelector}`;
        let gridLinesSelector = `.p-datatable[${this.attributeSelector}].p-datatable-gridlines > ${tableSelector}`;
        let innerHTML = `
@media screen and (max-width: ${this.breakpoint}) {
    ${selector} > .p-datatable-thead > tr > th,
    ${selector} > .p-datatable-tfoot > tr > td {
        display: none !important;
    }

    ${selector} > .p-datatable-tbody > tr > td {
        display: flex;
        width: 100% !important;
        align-items: center;
        justify-content: space-between;
    }

    ${selector} > .p-datatable-tbody > tr > td:not(:last-child) {
        border: 0 none;
    }

    ${gridLinesSelector} > .p-datatable-tbody > tr > td:last-child {
        border-top: 0;
        border-right: 0;
        border-left: 0;
    }

    ${selector} > .p-datatable-tbody > tr > td > .p-column-title {
        display: block;
    }
}
`;
        this.responsiveStyleElement.innerHTML = innerHTML;
      }
    },
    destroyResponsiveStyle() {
      if (this.responsiveStyleElement) {
        document.head.removeChild(this.responsiveStyleElement);
        this.responsiveStyleElement = null;
      }
    },
    destroyStyleElement() {
      if (this.styleElement) {
        document.head.removeChild(this.styleElement);
        this.styleElement = null;
      }
    },
    recursiveGetChildren(children, results) {
      if (!results) {
        results = [];
      }
      if (children && children.length) {
        children.forEach((child) => {
          if (child.children instanceof Array) {
            results.concat(this.recursiveGetChildren(child.children, results));
          } else if (child.type.name == "Column") {
            results.push(child);
          }
        });
      }
      return results;
    },
    dataToRender(data) {
      const _data = data || this.processedData;
      if (_data && this.paginator) {
        const first = this.lazy ? 0 : this.d_first;
        return _data.slice(first, first + this.d_rows);
      }
      return _data;
    },
    getVirtualScrollerRef() {
      return this.$refs.virtualScroller;
    },
    hasSpacerStyle(style) {
      return ObjectUtils.isNotEmpty(style);
    }
  },
  computed: {
    containerClass() {
      return [
        "p-datatable p-component",
        {
          "p-datatable-hoverable-rows": this.rowHover || this.selectionMode,
          "p-datatable-resizable": this.resizableColumns,
          "p-datatable-resizable-fit": this.resizableColumns && this.columnResizeMode === "fit",
          "p-datatable-scrollable": this.scrollable,
          "p-datatable-flex-scrollable": this.scrollable && this.scrollHeight === "flex",
          "p-datatable-responsive-stack": this.responsiveLayout === "stack",
          "p-datatable-responsive-scroll": this.responsiveLayout === "scroll",
          "p-datatable-striped": this.stripedRows,
          "p-datatable-gridlines": this.showGridlines,
          "p-datatable-grouped-header": this.headerColumnGroup != null,
          "p-datatable-grouped-footer": this.footerColumnGroup != null
        }
      ];
    },
    tableStyleClass() {
      return [
        "p-datatable-table",
        {
          "p-datatable-scrollable-table": this.scrollable,
          "p-datatable-resizable-table": this.resizableColumns,
          "p-datatable-resizable-table-fit": this.resizableColumns && this.columnResizeMode === "fit"
        },
        this.tableClass
      ];
    },
    columns() {
      let children = this.getChildren();
      if (!children) {
        return;
      }
      const cols = this.recursiveGetChildren(children, []);
      if (this.reorderableColumns && this.d_columnOrder) {
        let orderedColumns = [];
        for (let columnKey of this.d_columnOrder) {
          let column = this.findColumnByKey(cols, columnKey);
          if (column && !this.columnProp(column, "hidden")) {
            orderedColumns.push(column);
          }
        }
        return [...orderedColumns, ...cols.filter((item) => orderedColumns.indexOf(item) < 0)];
      }
      return cols;
    },
    headerColumnGroup() {
      const children = this.getChildren();
      if (children) {
        for (let child of children) {
          if (child.type.name === "ColumnGroup" && this.columnProp(child, "type") === "header") {
            return child;
          }
        }
      }
      return null;
    },
    footerColumnGroup() {
      const children = this.getChildren();
      if (children) {
        for (let child of children) {
          if (child.type.name === "ColumnGroup" && this.columnProp(child, "type") === "footer") {
            return child;
          }
        }
      }
      return null;
    },
    hasFilters() {
      return this.filters && Object.keys(this.filters).length > 0 && this.filters.constructor === Object;
    },
    processedData() {
      let data = this.value || [];
      if (!this.lazy) {
        if (data && data.length) {
          if (this.hasFilters) {
            data = this.filter(data);
          }
          if (this.sorted) {
            if (this.sortMode === "single")
              data = this.sortSingle(data);
            else if (this.sortMode === "multiple")
              data = this.sortMultiple(data);
          }
        }
      }
      return data;
    },
    totalRecordsLength() {
      if (this.lazy) {
        return this.totalRecords;
      } else {
        const data = this.processedData;
        return data ? data.length : 0;
      }
    },
    empty() {
      const data = this.processedData;
      return !data || data.length === 0;
    },
    paginatorTop() {
      return this.paginator && (this.paginatorPosition !== "bottom" || this.paginatorPosition === "both");
    },
    paginatorBottom() {
      return this.paginator && (this.paginatorPosition !== "top" || this.paginatorPosition === "both");
    },
    sorted() {
      return this.d_sortField || this.d_multiSortMeta && this.d_multiSortMeta.length > 0;
    },
    allRowsSelected() {
      if (this.selectAll !== null) {
        return this.selectAll;
      } else {
        const val = this.frozenValue ? [...this.frozenValue, ...this.processedData] : this.processedData;
        return ObjectUtils.isNotEmpty(val) && this.selection && Array.isArray(this.selection) && val.every((v) => this.selection.some((s) => this.equals(s, v)));
      }
    },
    attributeSelector() {
      return UniqueComponentId();
    },
    groupRowSortField() {
      return this.sortMode === "single" ? this.sortField : this.d_groupRowsSortMeta ? this.d_groupRowsSortMeta.field : null;
    },
    virtualScrollerDisabled() {
      return ObjectUtils.isEmpty(this.virtualScrollerOptions) || !this.scrollable;
    }
  },
  components: {
    DTPaginator: script$o,
    DTTableHeader: script$1$1,
    DTTableBody: script$7$1,
    DTTableFooter: script$5$1,
    DTVirtualScroller: script$x,
    ArrowDownIcon: script$E,
    ArrowUpIcon: script$D,
    SpinnerIcon: script$I
  }
};
function render$d(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_SpinnerIcon = resolveComponent("SpinnerIcon");
  const _component_DTPaginator = resolveComponent("DTPaginator");
  const _component_DTTableHeader = resolveComponent("DTTableHeader");
  const _component_DTTableBody = resolveComponent("DTTableBody");
  const _component_DTTableFooter = resolveComponent("DTTableFooter");
  const _component_DTVirtualScroller = resolveComponent("DTVirtualScroller");
  return openBlock(), createElementBlock("div", mergeProps({
    class: $options.containerClass,
    "data-scrollselectors": ".p-datatable-wrapper"
  }, _ctx.ptm("root")), [
    renderSlot(_ctx.$slots, "default"),
    $props.loading ? (openBlock(), createElementBlock("div", mergeProps({
      key: 0,
      class: "p-datatable-loading-overlay p-component-overlay"
    }, _ctx.ptm("loadingOverlay")), [
      _ctx.$slots.loading ? renderSlot(_ctx.$slots, "loading", { key: 0 }) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
        _ctx.$slots.loadingicon ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.$slots.loadingicon), {
          key: 0,
          class: "p-datatable-loading-icon"
        })) : $props.loadingIcon ? (openBlock(), createElementBlock("i", mergeProps({
          key: 1,
          class: ["p-datatable-loading-icon pi-spin", $props.loadingIcon]
        }, _ctx.ptm("loadingIcon")), null, 16)) : (openBlock(), createBlock(_component_SpinnerIcon, mergeProps({
          key: 2,
          spin: "",
          class: "p-datatable-loading-icon"
        }, _ctx.ptm("loadingIcon")), null, 16))
      ], 64))
    ], 16)) : createCommentVNode("", true),
    _ctx.$slots.header ? (openBlock(), createElementBlock("div", mergeProps({
      key: 1,
      class: "p-datatable-header"
    }, _ctx.ptm("header")), [
      renderSlot(_ctx.$slots, "header")
    ], 16)) : createCommentVNode("", true),
    $options.paginatorTop ? (openBlock(), createBlock(_component_DTPaginator, {
      key: 2,
      rows: $data.d_rows,
      first: $data.d_first,
      totalRecords: $options.totalRecordsLength,
      pageLinkSize: $props.pageLinkSize,
      template: $props.paginatorTemplate,
      rowsPerPageOptions: $props.rowsPerPageOptions,
      currentPageReportTemplate: $props.currentPageReportTemplate,
      class: "p-paginator-top",
      onPage: _cache[0] || (_cache[0] = ($event) => $options.onPage($event)),
      alwaysShow: $props.alwaysShowPaginator,
      pt: _ctx.ptm("paginator")
    }, createSlots({ _: 2 }, [
      _ctx.$slots.paginatorstart ? {
        name: "start",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "paginatorstart")
        ]),
        key: "0"
      } : void 0,
      _ctx.$slots.paginatorend ? {
        name: "end",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "paginatorend")
        ]),
        key: "1"
      } : void 0,
      _ctx.$slots.paginatorfirstpagelinkicon ? {
        name: "firstpagelinkicon",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "paginatorfirstpagelinkicon")
        ]),
        key: "2"
      } : void 0,
      _ctx.$slots.paginatorprevpagelinkicon ? {
        name: "prevpagelinkicon",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "paginatorprevpagelinkicon")
        ]),
        key: "3"
      } : void 0,
      _ctx.$slots.paginatornextpagelinkicon ? {
        name: "nextpagelinkicon",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "paginatornextpagelinkicon")
        ]),
        key: "4"
      } : void 0,
      _ctx.$slots.paginatorlastpagelinkicon ? {
        name: "lastpagelinkicon",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "paginatorlastpagelinkicon")
        ]),
        key: "5"
      } : void 0
    ]), 1032, ["rows", "first", "totalRecords", "pageLinkSize", "template", "rowsPerPageOptions", "currentPageReportTemplate", "alwaysShow", "pt"])) : createCommentVNode("", true),
    createBaseVNode("div", mergeProps({
      class: "p-datatable-wrapper",
      style: { maxHeight: $options.virtualScrollerDisabled ? $props.scrollHeight : "" }
    }, _ctx.ptm("wrapper")), [
      createVNode(_component_DTVirtualScroller, mergeProps({ ref: "virtualScroller" }, { ...$props.virtualScrollerOptions, ..._ctx.ptm("virtualScroller") }, {
        items: $options.processedData,
        columns: $options.columns,
        style: $props.scrollHeight !== "flex" ? { height: $props.scrollHeight } : void 0,
        scrollHeight: $props.scrollHeight !== "flex" ? void 0 : "100%",
        disabled: $options.virtualScrollerDisabled,
        loaderDisabled: "",
        inline: "",
        autoSize: "",
        showSpacer: false
      }), {
        content: withCtx((slotProps) => [
          createBaseVNode("table", mergeProps({
            ref: "table",
            role: "table",
            class: $options.tableStyleClass,
            style: [$props.tableStyle, slotProps.spacerStyle]
          }, { ...$props.tableProps, ..._ctx.ptm("table") }), [
            createVNode(_component_DTTableHeader, {
              columnGroup: $options.headerColumnGroup,
              columns: slotProps.columns,
              rowGroupMode: $props.rowGroupMode,
              groupRowsBy: $props.groupRowsBy,
              groupRowSortField: $options.groupRowSortField,
              reorderableColumns: $props.reorderableColumns,
              resizableColumns: $props.resizableColumns,
              allRowsSelected: $options.allRowsSelected,
              empty: $options.empty,
              sortMode: $props.sortMode,
              sortField: $data.d_sortField,
              sortOrder: $data.d_sortOrder,
              multiSortMeta: $data.d_multiSortMeta,
              filters: $data.d_filters,
              filtersStore: $props.filters,
              filterDisplay: $props.filterDisplay,
              filterInputProps: $props.filterInputProps,
              headerCheckboxIconTemplate: _ctx.$slots.headercheckboxicon,
              onColumnClick: _cache[1] || (_cache[1] = ($event) => $options.onColumnHeaderClick($event)),
              onColumnMousedown: _cache[2] || (_cache[2] = ($event) => $options.onColumnHeaderMouseDown($event)),
              onFilterChange: $options.onFilterChange,
              onFilterApply: $options.onFilterApply,
              onColumnDragstart: _cache[3] || (_cache[3] = ($event) => $options.onColumnHeaderDragStart($event)),
              onColumnDragover: _cache[4] || (_cache[4] = ($event) => $options.onColumnHeaderDragOver($event)),
              onColumnDragleave: _cache[5] || (_cache[5] = ($event) => $options.onColumnHeaderDragLeave($event)),
              onColumnDrop: _cache[6] || (_cache[6] = ($event) => $options.onColumnHeaderDrop($event)),
              onColumnResizestart: _cache[7] || (_cache[7] = ($event) => $options.onColumnResizeStart($event)),
              onCheckboxChange: _cache[8] || (_cache[8] = ($event) => $options.toggleRowsWithCheckbox($event)),
              pt: _ctx.pt
            }, null, 8, ["columnGroup", "columns", "rowGroupMode", "groupRowsBy", "groupRowSortField", "reorderableColumns", "resizableColumns", "allRowsSelected", "empty", "sortMode", "sortField", "sortOrder", "multiSortMeta", "filters", "filtersStore", "filterDisplay", "filterInputProps", "headerCheckboxIconTemplate", "onFilterChange", "onFilterApply", "pt"]),
            $props.frozenValue ? (openBlock(), createBlock(_component_DTTableBody, {
              key: 0,
              ref: "frozenBodyRef",
              value: $props.frozenValue,
              frozenRow: true,
              class: "p-datatable-frozen-tbody",
              columns: slotProps.columns,
              first: $data.d_first,
              dataKey: $props.dataKey,
              selection: $props.selection,
              selectionKeys: $data.d_selectionKeys,
              selectionMode: $props.selectionMode,
              contextMenu: $props.contextMenu,
              contextMenuSelection: $props.contextMenuSelection,
              rowGroupMode: $props.rowGroupMode,
              groupRowsBy: $props.groupRowsBy,
              expandableRowGroups: $props.expandableRowGroups,
              rowClass: $props.rowClass,
              rowStyle: $props.rowStyle,
              editMode: $props.editMode,
              compareSelectionBy: $props.compareSelectionBy,
              scrollable: $props.scrollable,
              expandedRowIcon: $props.expandedRowIcon,
              collapsedRowIcon: $props.collapsedRowIcon,
              expandedRows: $props.expandedRows,
              expandedRowKeys: $data.d_expandedRowKeys,
              expandedRowGroups: $props.expandedRowGroups,
              editingRows: $props.editingRows,
              editingRowKeys: $data.d_editingRowKeys,
              templates: _ctx.$slots,
              responsiveLayout: $props.responsiveLayout,
              isVirtualScrollerDisabled: true,
              onRowgroupToggle: $options.toggleRowGroup,
              onRowClick: _cache[9] || (_cache[9] = ($event) => $options.onRowClick($event)),
              onRowDblclick: _cache[10] || (_cache[10] = ($event) => $options.onRowDblClick($event)),
              onRowRightclick: _cache[11] || (_cache[11] = ($event) => $options.onRowRightClick($event)),
              onRowTouchend: $options.onRowTouchEnd,
              onRowKeydown: $options.onRowKeyDown,
              onRowMousedown: $options.onRowMouseDown,
              onRowDragstart: _cache[12] || (_cache[12] = ($event) => $options.onRowDragStart($event)),
              onRowDragover: _cache[13] || (_cache[13] = ($event) => $options.onRowDragOver($event)),
              onRowDragleave: _cache[14] || (_cache[14] = ($event) => $options.onRowDragLeave($event)),
              onRowDragend: _cache[15] || (_cache[15] = ($event) => $options.onRowDragEnd($event)),
              onRowDrop: _cache[16] || (_cache[16] = ($event) => $options.onRowDrop($event)),
              onRowToggle: _cache[17] || (_cache[17] = ($event) => $options.toggleRow($event)),
              onRadioChange: _cache[18] || (_cache[18] = ($event) => $options.toggleRowWithRadio($event)),
              onCheckboxChange: _cache[19] || (_cache[19] = ($event) => $options.toggleRowWithCheckbox($event)),
              onCellEditInit: _cache[20] || (_cache[20] = ($event) => $options.onCellEditInit($event)),
              onCellEditComplete: _cache[21] || (_cache[21] = ($event) => $options.onCellEditComplete($event)),
              onCellEditCancel: _cache[22] || (_cache[22] = ($event) => $options.onCellEditCancel($event)),
              onRowEditInit: _cache[23] || (_cache[23] = ($event) => $options.onRowEditInit($event)),
              onRowEditSave: _cache[24] || (_cache[24] = ($event) => $options.onRowEditSave($event)),
              onRowEditCancel: _cache[25] || (_cache[25] = ($event) => $options.onRowEditCancel($event)),
              editingMeta: $data.d_editingMeta,
              onEditingMetaChange: $options.onEditingMetaChange
            }, null, 8, ["value", "columns", "first", "dataKey", "selection", "selectionKeys", "selectionMode", "contextMenu", "contextMenuSelection", "rowGroupMode", "groupRowsBy", "expandableRowGroups", "rowClass", "rowStyle", "editMode", "compareSelectionBy", "scrollable", "expandedRowIcon", "collapsedRowIcon", "expandedRows", "expandedRowKeys", "expandedRowGroups", "editingRows", "editingRowKeys", "templates", "responsiveLayout", "onRowgroupToggle", "onRowTouchend", "onRowKeydown", "onRowMousedown", "editingMeta", "onEditingMetaChange"])) : createCommentVNode("", true),
            createVNode(_component_DTTableBody, {
              ref: "bodyRef",
              value: $options.dataToRender(slotProps.rows),
              class: normalizeClass(slotProps.styleClass),
              columns: slotProps.columns,
              empty: $options.empty,
              first: $data.d_first,
              dataKey: $props.dataKey,
              selection: $props.selection,
              selectionKeys: $data.d_selectionKeys,
              selectionMode: $props.selectionMode,
              contextMenu: $props.contextMenu,
              contextMenuSelection: $props.contextMenuSelection,
              rowGroupMode: $props.rowGroupMode,
              groupRowsBy: $props.groupRowsBy,
              expandableRowGroups: $props.expandableRowGroups,
              rowClass: $props.rowClass,
              rowStyle: $props.rowStyle,
              editMode: $props.editMode,
              compareSelectionBy: $props.compareSelectionBy,
              scrollable: $props.scrollable,
              expandedRowIcon: $props.expandedRowIcon,
              collapsedRowIcon: $props.collapsedRowIcon,
              expandedRows: $props.expandedRows,
              expandedRowKeys: $data.d_expandedRowKeys,
              expandedRowGroups: $props.expandedRowGroups,
              editingRows: $props.editingRows,
              editingRowKeys: $data.d_editingRowKeys,
              templates: _ctx.$slots,
              responsiveLayout: $props.responsiveLayout,
              virtualScrollerContentProps: slotProps,
              isVirtualScrollerDisabled: $options.virtualScrollerDisabled,
              onRowgroupToggle: $options.toggleRowGroup,
              onRowClick: _cache[26] || (_cache[26] = ($event) => $options.onRowClick($event)),
              onRowDblclick: _cache[27] || (_cache[27] = ($event) => $options.onRowDblClick($event)),
              onRowRightclick: _cache[28] || (_cache[28] = ($event) => $options.onRowRightClick($event)),
              onRowTouchend: $options.onRowTouchEnd,
              onRowKeydown: ($event) => $options.onRowKeyDown($event, slotProps),
              onRowMousedown: $options.onRowMouseDown,
              onRowDragstart: _cache[29] || (_cache[29] = ($event) => $options.onRowDragStart($event)),
              onRowDragover: _cache[30] || (_cache[30] = ($event) => $options.onRowDragOver($event)),
              onRowDragleave: _cache[31] || (_cache[31] = ($event) => $options.onRowDragLeave($event)),
              onRowDragend: _cache[32] || (_cache[32] = ($event) => $options.onRowDragEnd($event)),
              onRowDrop: _cache[33] || (_cache[33] = ($event) => $options.onRowDrop($event)),
              onRowToggle: _cache[34] || (_cache[34] = ($event) => $options.toggleRow($event)),
              onRadioChange: _cache[35] || (_cache[35] = ($event) => $options.toggleRowWithRadio($event)),
              onCheckboxChange: _cache[36] || (_cache[36] = ($event) => $options.toggleRowWithCheckbox($event)),
              onCellEditInit: _cache[37] || (_cache[37] = ($event) => $options.onCellEditInit($event)),
              onCellEditComplete: _cache[38] || (_cache[38] = ($event) => $options.onCellEditComplete($event)),
              onCellEditCancel: _cache[39] || (_cache[39] = ($event) => $options.onCellEditCancel($event)),
              onRowEditInit: _cache[40] || (_cache[40] = ($event) => $options.onRowEditInit($event)),
              onRowEditSave: _cache[41] || (_cache[41] = ($event) => $options.onRowEditSave($event)),
              onRowEditCancel: _cache[42] || (_cache[42] = ($event) => $options.onRowEditCancel($event)),
              editingMeta: $data.d_editingMeta,
              onEditingMetaChange: $options.onEditingMetaChange,
              pt: _ctx.pt
            }, null, 8, ["value", "class", "columns", "empty", "first", "dataKey", "selection", "selectionKeys", "selectionMode", "contextMenu", "contextMenuSelection", "rowGroupMode", "groupRowsBy", "expandableRowGroups", "rowClass", "rowStyle", "editMode", "compareSelectionBy", "scrollable", "expandedRowIcon", "collapsedRowIcon", "expandedRows", "expandedRowKeys", "expandedRowGroups", "editingRows", "editingRowKeys", "templates", "responsiveLayout", "virtualScrollerContentProps", "isVirtualScrollerDisabled", "onRowgroupToggle", "onRowTouchend", "onRowKeydown", "onRowMousedown", "editingMeta", "onEditingMetaChange", "pt"]),
            $options.hasSpacerStyle(slotProps.spacerStyle) ? (openBlock(), createElementBlock("tbody", mergeProps({
              key: 1,
              style: { height: `calc(${slotProps.spacerStyle.height} - ${slotProps.rows.length * slotProps.itemSize}px)` },
              class: "p-datatable-virtualscroller-spacer"
            }, _ctx.ptm("virtualScrollerSpacer")), null, 16)) : createCommentVNode("", true),
            createVNode(_component_DTTableFooter, {
              columnGroup: $options.footerColumnGroup,
              columns: slotProps.columns,
              pt: _ctx.pt
            }, null, 8, ["columnGroup", "columns", "pt"])
          ], 16)
        ]),
        _: 1
      }, 16, ["items", "columns", "style", "scrollHeight", "disabled"])
    ], 16),
    _ctx.$slots.footer ? (openBlock(), createElementBlock("div", mergeProps({
      key: 3,
      class: "p-datatable-footer"
    }, _ctx.ptm("footer")), [
      renderSlot(_ctx.$slots, "footer")
    ], 16)) : createCommentVNode("", true),
    $options.paginatorBottom ? (openBlock(), createBlock(_component_DTPaginator, {
      key: 4,
      rows: $data.d_rows,
      first: $data.d_first,
      totalRecords: $options.totalRecordsLength,
      pageLinkSize: $props.pageLinkSize,
      template: $props.paginatorTemplate,
      rowsPerPageOptions: $props.rowsPerPageOptions,
      currentPageReportTemplate: $props.currentPageReportTemplate,
      class: "p-paginator-bottom",
      onPage: _cache[43] || (_cache[43] = ($event) => $options.onPage($event)),
      alwaysShow: $props.alwaysShowPaginator,
      pt: _ctx.ptm("paginator")
    }, createSlots({ _: 2 }, [
      _ctx.$slots.paginatorstart ? {
        name: "start",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "paginatorstart")
        ]),
        key: "0"
      } : void 0,
      _ctx.$slots.paginatorend ? {
        name: "end",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "paginatorend")
        ]),
        key: "1"
      } : void 0,
      _ctx.$slots.paginatorfirstpagelinkicon ? {
        name: "firstpagelinkicon",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "paginatorfirstpagelinkicon")
        ]),
        key: "2"
      } : void 0,
      _ctx.$slots.paginatorprevpagelinkicon ? {
        name: "prevpagelinkicon",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "paginatorprevpagelinkicon")
        ]),
        key: "3"
      } : void 0,
      _ctx.$slots.paginatornextpagelinkicon ? {
        name: "nextpagelinkicon",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "paginatornextpagelinkicon")
        ]),
        key: "4"
      } : void 0,
      _ctx.$slots.paginatorlastpagelinkicon ? {
        name: "lastpagelinkicon",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "paginatorlastpagelinkicon")
        ]),
        key: "5"
      } : void 0
    ]), 1032, ["rows", "first", "totalRecords", "pageLinkSize", "template", "rowsPerPageOptions", "currentPageReportTemplate", "alwaysShow", "pt"])) : createCommentVNode("", true),
    createBaseVNode("div", mergeProps({
      ref: "resizeHelper",
      class: "p-column-resizer-helper",
      style: { "display": "none" }
    }, _ctx.ptm("resizeHelper")), null, 16),
    $props.reorderableColumns ? (openBlock(), createElementBlock("span", mergeProps({
      key: 5,
      ref: "reorderIndicatorUp",
      class: "p-datatable-reorder-indicator-up",
      style: { "position": "absolute", "display": "none" }
    }, _ctx.ptm("reorderIndicatorUp")), [
      (openBlock(), createBlock(resolveDynamicComponent(_ctx.$slots.reorderindicatorupicon || "ArrowDownIcon")))
    ], 16)) : createCommentVNode("", true),
    $props.reorderableColumns ? (openBlock(), createElementBlock("span", mergeProps({
      key: 6,
      ref: "reorderIndicatorDown",
      class: "p-datatable-reorder-indicator-down",
      style: { "position": "absolute", "display": "none" }
    }, _ctx.ptm("reorderIndicatorDown")), [
      (openBlock(), createBlock(resolveDynamicComponent(_ctx.$slots.reorderindicatordownicon || "ArrowUpIcon")))
    ], 16)) : createCommentVNode("", true)
  ], 16);
}
function styleInject$7(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || typeof document === "undefined") {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$7 = "\n.p-datatable {\n    position: relative;\n}\n.p-datatable > .p-datatable-wrapper {\n    overflow: auto;\n}\n.p-datatable-table {\n    border-spacing: 0px;\n    width: 100%;\n}\n.p-datatable .p-sortable-column {\n    cursor: pointer;\n    user-select: none;\n}\n.p-datatable .p-sortable-column .p-column-title,\n.p-datatable .p-sortable-column .p-sortable-column-icon,\n.p-datatable .p-sortable-column .p-sortable-column-badge {\n    vertical-align: middle;\n}\n.p-datatable .p-sortable-column .p-sortable-column-badge {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n}\n.p-datatable-hoverable-rows .p-selectable-row {\n    cursor: pointer;\n}\n\n/* Scrollable */\n.p-datatable-scrollable > .p-datatable-wrapper {\n    position: relative;\n}\n.p-datatable-scrollable-table > .p-datatable-thead {\n    position: sticky;\n    top: 0;\n    z-index: 1;\n}\n.p-datatable-scrollable-table > .p-datatable-frozen-tbody {\n    position: sticky;\n    z-index: 1;\n}\n.p-datatable-scrollable-table > .p-datatable-tfoot {\n    position: sticky;\n    bottom: 0;\n    z-index: 1;\n}\n.p-datatable-scrollable .p-frozen-column {\n    position: sticky;\n    background: inherit;\n}\n.p-datatable-scrollable th.p-frozen-column {\n    z-index: 1;\n}\n.p-datatable-flex-scrollable {\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n}\n.p-datatable-flex-scrollable > .p-datatable-wrapper {\n    display: flex;\n    flex-direction: column;\n    flex: 1;\n    height: 100%;\n}\n.p-datatable-scrollable-table > .p-datatable-tbody > .p-rowgroup-header {\n    position: sticky;\n    z-index: 1;\n}\n\n/* Resizable */\n.p-datatable-resizable-table > .p-datatable-thead > tr > th,\n.p-datatable-resizable-table > .p-datatable-tfoot > tr > td,\n.p-datatable-resizable-table > .p-datatable-tbody > tr > td {\n    overflow: hidden;\n    white-space: nowrap;\n}\n.p-datatable-resizable-table > .p-datatable-thead > tr > th.p-resizable-column:not(.p-frozen-column) {\n    background-clip: padding-box;\n    position: relative;\n}\n.p-datatable-resizable-table-fit > .p-datatable-thead > tr > th.p-resizable-column:last-child .p-column-resizer {\n    display: none;\n}\n.p-datatable .p-column-resizer {\n    display: block;\n    position: absolute !important;\n    top: 0;\n    right: 0;\n    margin: 0;\n    width: 0.5rem;\n    height: 100%;\n    padding: 0px;\n    cursor: col-resize;\n    border: 1px solid transparent;\n}\n.p-datatable .p-column-header-content {\n    display: flex;\n    align-items: center;\n}\n.p-datatable .p-column-resizer-helper {\n    width: 1px;\n    position: absolute;\n    z-index: 10;\n    display: none;\n}\n.p-datatable .p-row-editor-init,\n.p-datatable .p-row-editor-save,\n.p-datatable .p-row-editor-cancel {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    overflow: hidden;\n    position: relative;\n}\n\n/* Expand */\n.p-datatable .p-row-toggler {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    overflow: hidden;\n    position: relative;\n}\n\n/* Reorder */\n.p-datatable-reorder-indicator-up,\n.p-datatable-reorder-indicator-down {\n    position: absolute;\n    display: none;\n}\n.p-reorderable-column,\n.p-datatable-reorderablerow-handle {\n    cursor: move;\n}\n\n/* Loader */\n.p-datatable .p-datatable-loading-overlay {\n    position: absolute;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    z-index: 2;\n}\n\n/* Filter */\n.p-column-filter-row {\n    display: flex;\n    align-items: center;\n    width: 100%;\n}\n.p-column-filter-menu {\n    display: inline-flex;\n    margin-left: auto;\n}\n.p-column-filter-row .p-column-filter-element {\n    flex: 1 1 auto;\n    width: 1%;\n}\n.p-column-filter-menu-button,\n.p-column-filter-clear-button {\n    display: inline-flex;\n    justify-content: center;\n    align-items: center;\n    cursor: pointer;\n    text-decoration: none;\n    overflow: hidden;\n    position: relative;\n}\n.p-column-filter-overlay {\n    position: absolute;\n    top: 0;\n    left: 0;\n}\n.p-column-filter-row-items {\n    margin: 0;\n    padding: 0;\n    list-style: none;\n}\n.p-column-filter-row-item {\n    cursor: pointer;\n}\n.p-column-filter-add-button,\n.p-column-filter-remove-button {\n    justify-content: center;\n}\n.p-column-filter-add-button .p-button-label,\n.p-column-filter-remove-button .p-button-label {\n    flex-grow: 0;\n}\n.p-column-filter-buttonbar {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n}\n.p-column-filter-buttonbar .p-button:not(.p-button-icon-only) {\n    width: auto;\n}\n\n/* Responsive */\n.p-datatable .p-datatable-tbody > tr > td > .p-column-title {\n    display: none;\n}\n\n/* VirtualScroller */\n.p-datatable-virtualscroller-spacer {\n    display: flex;\n}\n.p-datatable .p-virtualscroller .p-virtualscroller-loading {\n    transform: none !important;\n    min-height: 0;\n    position: sticky;\n    top: 0;\n    left: 0;\n}\n";
styleInject$7(css_248z$7);
script$d.render = render$d;
var script$c = {
  name: "WindowMaximizeIcon",
  extends: script$J
};
const _hoisted_1$h = /* @__PURE__ */ createBaseVNode("g", { "clip-path": "url(#clip0_414_20927)" }, [
  /* @__PURE__ */ createBaseVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M7 14H11.8C12.3835 14 12.9431 13.7682 13.3556 13.3556C13.7682 12.9431 14 12.3835 14 11.8V2.2C14 1.61652 13.7682 1.05694 13.3556 0.644365C12.9431 0.231785 12.3835 0 11.8 0H2.2C1.61652 0 1.05694 0.231785 0.644365 0.644365C0.231785 1.05694 0 1.61652 0 2.2V7C0 7.15913 0.063214 7.31174 0.175736 7.42426C0.288258 7.53679 0.44087 7.6 0.6 7.6C0.75913 7.6 0.911742 7.53679 1.02426 7.42426C1.13679 7.31174 1.2 7.15913 1.2 7V2.2C1.2 1.93478 1.30536 1.68043 1.49289 1.49289C1.68043 1.30536 1.93478 1.2 2.2 1.2H11.8C12.0652 1.2 12.3196 1.30536 12.5071 1.49289C12.6946 1.68043 12.8 1.93478 12.8 2.2V11.8C12.8 12.0652 12.6946 12.3196 12.5071 12.5071C12.3196 12.6946 12.0652 12.8 11.8 12.8H7C6.84087 12.8 6.68826 12.8632 6.57574 12.9757C6.46321 13.0883 6.4 13.2409 6.4 13.4C6.4 13.5591 6.46321 13.7117 6.57574 13.8243C6.68826 13.9368 6.84087 14 7 14ZM9.77805 7.42192C9.89013 7.534 10.0415 7.59788 10.2 7.59995C10.3585 7.59788 10.5099 7.534 10.622 7.42192C10.7341 7.30985 10.798 7.15844 10.8 6.99995V3.94242C10.8066 3.90505 10.8096 3.86689 10.8089 3.82843C10.8079 3.77159 10.7988 3.7157 10.7824 3.6623C10.756 3.55552 10.701 3.45698 10.622 3.37798C10.5099 3.2659 10.3585 3.20202 10.2 3.19995H7.00002C6.84089 3.19995 6.68828 3.26317 6.57576 3.37569C6.46324 3.48821 6.40002 3.64082 6.40002 3.79995C6.40002 3.95908 6.46324 4.11169 6.57576 4.22422C6.68828 4.33674 6.84089 4.39995 7.00002 4.39995H8.80006L6.19997 7.00005C6.10158 7.11005 6.04718 7.25246 6.04718 7.40005C6.04718 7.54763 6.10158 7.69004 6.19997 7.80005C6.30202 7.91645 6.44561 7.98824 6.59997 8.00005C6.75432 7.98824 6.89791 7.91645 6.99997 7.80005L9.60002 5.26841V6.99995C9.6021 7.15844 9.66598 7.30985 9.77805 7.42192ZM1.4 14H3.8C4.17066 13.9979 4.52553 13.8498 4.78763 13.5877C5.04973 13.3256 5.1979 12.9707 5.2 12.6V10.2C5.1979 9.82939 5.04973 9.47452 4.78763 9.21242C4.52553 8.95032 4.17066 8.80215 3.8 8.80005H1.4C1.02934 8.80215 0.674468 8.95032 0.412371 9.21242C0.150274 9.47452 0.00210008 9.82939 0 10.2V12.6C0.00210008 12.9707 0.150274 13.3256 0.412371 13.5877C0.674468 13.8498 1.02934 13.9979 1.4 14ZM1.25858 10.0586C1.29609 10.0211 1.34696 10 1.4 10H3.8C3.85304 10 3.90391 10.0211 3.94142 10.0586C3.97893 10.0961 4 10.147 4 10.2V12.6C4 12.6531 3.97893 12.704 3.94142 12.7415C3.90391 12.779 3.85304 12.8 3.8 12.8H1.4C1.34696 12.8 1.29609 12.779 1.25858 12.7415C1.22107 12.704 1.2 12.6531 1.2 12.6V10.2C1.2 10.147 1.22107 10.0961 1.25858 10.0586Z",
    fill: "currentColor"
  })
], -1);
const _hoisted_2$a = /* @__PURE__ */ createBaseVNode("defs", null, [
  /* @__PURE__ */ createBaseVNode("clipPath", { id: "clip0_414_20927" }, [
    /* @__PURE__ */ createBaseVNode("rect", {
      width: "14",
      height: "14",
      fill: "white"
    })
  ])
], -1);
const _hoisted_3$a = [
  _hoisted_1$h,
  _hoisted_2$a
];
function render$c(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_3$a, 16);
}
script$c.render = render$c;
var script$b = {
  name: "WindowMinimizeIcon",
  extends: script$J
};
const _hoisted_1$g = /* @__PURE__ */ createBaseVNode("g", { "clip-path": "url(#clip0_414_20939)" }, [
  /* @__PURE__ */ createBaseVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M11.8 0H2.2C1.61652 0 1.05694 0.231785 0.644365 0.644365C0.231785 1.05694 0 1.61652 0 2.2V7C0 7.15913 0.063214 7.31174 0.175736 7.42426C0.288258 7.53679 0.44087 7.6 0.6 7.6C0.75913 7.6 0.911742 7.53679 1.02426 7.42426C1.13679 7.31174 1.2 7.15913 1.2 7V2.2C1.2 1.93478 1.30536 1.68043 1.49289 1.49289C1.68043 1.30536 1.93478 1.2 2.2 1.2H11.8C12.0652 1.2 12.3196 1.30536 12.5071 1.49289C12.6946 1.68043 12.8 1.93478 12.8 2.2V11.8C12.8 12.0652 12.6946 12.3196 12.5071 12.5071C12.3196 12.6946 12.0652 12.8 11.8 12.8H7C6.84087 12.8 6.68826 12.8632 6.57574 12.9757C6.46321 13.0883 6.4 13.2409 6.4 13.4C6.4 13.5591 6.46321 13.7117 6.57574 13.8243C6.68826 13.9368 6.84087 14 7 14H11.8C12.3835 14 12.9431 13.7682 13.3556 13.3556C13.7682 12.9431 14 12.3835 14 11.8V2.2C14 1.61652 13.7682 1.05694 13.3556 0.644365C12.9431 0.231785 12.3835 0 11.8 0ZM6.368 7.952C6.44137 7.98326 6.52025 7.99958 6.6 8H9.8C9.95913 8 10.1117 7.93678 10.2243 7.82426C10.3368 7.71174 10.4 7.55913 10.4 7.4C10.4 7.24087 10.3368 7.08826 10.2243 6.97574C10.1117 6.86321 9.95913 6.8 9.8 6.8H8.048L10.624 4.224C10.73 4.11026 10.7877 3.95982 10.7849 3.80438C10.7822 3.64894 10.7192 3.50063 10.6093 3.3907C10.4994 3.28077 10.3511 3.2178 10.1956 3.21506C10.0402 3.21232 9.88974 3.27002 9.776 3.376L7.2 5.952V4.2C7.2 4.04087 7.13679 3.88826 7.02426 3.77574C6.91174 3.66321 6.75913 3.6 6.6 3.6C6.44087 3.6 6.28826 3.66321 6.17574 3.77574C6.06321 3.88826 6 4.04087 6 4.2V7.4C6.00042 7.47975 6.01674 7.55862 6.048 7.632C6.07656 7.70442 6.11971 7.7702 6.17475 7.82524C6.2298 7.88029 6.29558 7.92344 6.368 7.952ZM1.4 8.80005H3.8C4.17066 8.80215 4.52553 8.95032 4.78763 9.21242C5.04973 9.47452 5.1979 9.82939 5.2 10.2V12.6C5.1979 12.9707 5.04973 13.3256 4.78763 13.5877C4.52553 13.8498 4.17066 13.9979 3.8 14H1.4C1.02934 13.9979 0.674468 13.8498 0.412371 13.5877C0.150274 13.3256 0.00210008 12.9707 0 12.6V10.2C0.00210008 9.82939 0.150274 9.47452 0.412371 9.21242C0.674468 8.95032 1.02934 8.80215 1.4 8.80005ZM3.94142 12.7415C3.97893 12.704 4 12.6531 4 12.6V10.2C4 10.147 3.97893 10.0961 3.94142 10.0586C3.90391 10.0211 3.85304 10 3.8 10H1.4C1.34696 10 1.29609 10.0211 1.25858 10.0586C1.22107 10.0961 1.2 10.147 1.2 10.2V12.6C1.2 12.6531 1.22107 12.704 1.25858 12.7415C1.29609 12.779 1.34696 12.8 1.4 12.8H3.8C3.85304 12.8 3.90391 12.779 3.94142 12.7415Z",
    fill: "currentColor"
  })
], -1);
const _hoisted_2$9 = /* @__PURE__ */ createBaseVNode("defs", null, [
  /* @__PURE__ */ createBaseVNode("clipPath", { id: "clip0_414_20939" }, [
    /* @__PURE__ */ createBaseVNode("rect", {
      width: "14",
      height: "14",
      fill: "white"
    })
  ])
], -1);
const _hoisted_3$9 = [
  _hoisted_1$g,
  _hoisted_2$9
];
function render$b(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_3$9, 16);
}
script$b.render = render$b;
var script$a = {
  name: "Dialog",
  extends: script$K,
  inheritAttrs: false,
  emits: ["update:visible", "show", "hide", "after-hide", "maximize", "unmaximize", "dragend"],
  props: {
    header: {
      type: null,
      default: null
    },
    footer: {
      type: null,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: null
    },
    contentStyle: {
      type: null,
      default: null
    },
    contentClass: {
      type: String,
      default: null
    },
    contentProps: {
      type: null,
      default: null
    },
    rtl: {
      type: Boolean,
      default: null
    },
    maximizable: {
      type: Boolean,
      default: false
    },
    dismissableMask: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: true
    },
    closeOnEscape: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    baseZIndex: {
      type: Number,
      default: 0
    },
    autoZIndex: {
      type: Boolean,
      default: true
    },
    position: {
      type: String,
      default: "center"
    },
    breakpoints: {
      type: Object,
      default: null
    },
    draggable: {
      type: Boolean,
      default: true
    },
    keepInViewport: {
      type: Boolean,
      default: true
    },
    minX: {
      type: Number,
      default: 0
    },
    minY: {
      type: Number,
      default: 0
    },
    appendTo: {
      type: String,
      default: "body"
    },
    closeIcon: {
      type: String,
      default: void 0
    },
    maximizeIcon: {
      type: String,
      default: void 0
    },
    minimizeIcon: {
      type: String,
      default: void 0
    },
    closeButtonProps: {
      type: null,
      default: null
    },
    _instance: null
  },
  provide() {
    return {
      dialogRef: computed(() => this._instance)
    };
  },
  data() {
    return {
      containerVisible: this.visible,
      maximized: false,
      focusableMax: null,
      focusableClose: null
    };
  },
  documentKeydownListener: null,
  container: null,
  mask: null,
  content: null,
  headerContainer: null,
  footerContainer: null,
  maximizableButton: null,
  closeButton: null,
  styleElement: null,
  dragging: null,
  documentDragListener: null,
  documentDragEndListener: null,
  lastPageX: null,
  lastPageY: null,
  updated() {
    if (this.visible) {
      this.containerVisible = this.visible;
    }
  },
  beforeUnmount() {
    this.unbindDocumentState();
    this.unbindGlobalListeners();
    this.destroyStyle();
    if (this.mask && this.autoZIndex) {
      ZIndexUtils.clear(this.mask);
    }
    this.container = null;
    this.mask = null;
  },
  mounted() {
    if (this.breakpoints) {
      this.createStyle();
    }
  },
  methods: {
    close() {
      this.$emit("update:visible", false);
    },
    onBeforeEnter(el) {
      el.setAttribute(this.attributeSelector, "");
    },
    onEnter() {
      this.$emit("show");
      this.focus();
      this.enableDocumentSettings();
      this.bindGlobalListeners();
      if (this.autoZIndex) {
        ZIndexUtils.set("modal", this.mask, this.baseZIndex + this.$primevue.config.zIndex.modal);
      }
    },
    onBeforeLeave() {
      if (this.modal) {
        DomHandler.addClass(this.mask, "p-component-overlay-leave");
      }
    },
    onLeave() {
      this.$emit("hide");
      this.focusableClose = null;
      this.focusableMax = null;
    },
    onAfterLeave() {
      if (this.autoZIndex) {
        ZIndexUtils.clear(this.mask);
      }
      this.containerVisible = false;
      this.unbindDocumentState();
      this.unbindGlobalListeners();
      this.$emit("after-hide");
    },
    onMaskClick(event2) {
      if (this.dismissableMask && this.modal && this.mask === event2.target) {
        this.close();
      }
    },
    focus() {
      const findFocusableElement = (container) => {
        return container.querySelector("[autofocus]");
      };
      let focusTarget = this.$slots.footer && findFocusableElement(this.footerContainer);
      if (!focusTarget) {
        focusTarget = this.$slots.header && findFocusableElement(this.headerContainer);
        if (!focusTarget) {
          focusTarget = this.$slots.default && findFocusableElement(this.content);
          if (!focusTarget) {
            if (this.maximizable) {
              this.focusableMax = true;
              focusTarget = this.maximizableButton;
            } else {
              this.focusableClose = true;
              focusTarget = this.closeButton;
            }
          }
        }
      }
      if (focusTarget) {
        DomHandler.focus(focusTarget);
      }
    },
    maximize(event2) {
      if (this.maximized) {
        this.maximized = false;
        this.$emit("unmaximize", event2);
      } else {
        this.maximized = true;
        this.$emit("maximize", event2);
      }
      if (!this.modal) {
        if (this.maximized)
          DomHandler.addClass(document.body, "p-overflow-hidden");
        else
          DomHandler.removeClass(document.body, "p-overflow-hidden");
      }
    },
    enableDocumentSettings() {
      if (this.modal || this.maximizable && this.maximized) {
        DomHandler.addClass(document.body, "p-overflow-hidden");
      }
    },
    unbindDocumentState() {
      if (this.modal || this.maximizable && this.maximized) {
        DomHandler.removeClass(document.body, "p-overflow-hidden");
      }
    },
    onKeyDown(event2) {
      if (event2.code === "Escape" && this.closeOnEscape) {
        this.close();
      }
    },
    bindDocumentKeyDownListener() {
      if (!this.documentKeydownListener) {
        this.documentKeydownListener = this.onKeyDown.bind(this);
        window.document.addEventListener("keydown", this.documentKeydownListener);
      }
    },
    unbindDocumentKeyDownListener() {
      if (this.documentKeydownListener) {
        window.document.removeEventListener("keydown", this.documentKeydownListener);
        this.documentKeydownListener = null;
      }
    },
    getPositionClass() {
      const positions = ["left", "right", "top", "topleft", "topright", "bottom", "bottomleft", "bottomright"];
      const pos = positions.find((item) => item === this.position);
      return pos ? `p-dialog-${pos}` : "";
    },
    containerRef(el) {
      this.container = el;
    },
    maskRef(el) {
      this.mask = el;
    },
    contentRef(el) {
      this.content = el;
    },
    headerContainerRef(el) {
      this.headerContainer = el;
    },
    footerContainerRef(el) {
      this.footerContainer = el;
    },
    maximizableRef(el) {
      this.maximizableButton = el;
    },
    closeButtonRef(el) {
      this.closeButton = el;
    },
    createStyle() {
      if (!this.styleElement) {
        this.styleElement = document.createElement("style");
        this.styleElement.type = "text/css";
        document.head.appendChild(this.styleElement);
        let innerHTML = "";
        for (let breakpoint in this.breakpoints) {
          innerHTML += `
                        @media screen and (max-width: ${breakpoint}) {
                            .p-dialog[${this.attributeSelector}] {
                                width: ${this.breakpoints[breakpoint]} !important;
                            }
                        }
                    `;
        }
        this.styleElement.innerHTML = innerHTML;
      }
    },
    destroyStyle() {
      if (this.styleElement) {
        document.head.removeChild(this.styleElement);
        this.styleElement = null;
      }
    },
    initDrag(event2) {
      if (DomHandler.hasClass(event2.target, "p-dialog-header-icon") || DomHandler.hasClass(event2.target.parentElement, "p-dialog-header-icon")) {
        return;
      }
      if (this.draggable) {
        this.dragging = true;
        this.lastPageX = event2.pageX;
        this.lastPageY = event2.pageY;
        this.container.style.margin = "0";
        DomHandler.addClass(document.body, "p-unselectable-text");
      }
    },
    bindGlobalListeners() {
      if (this.draggable) {
        this.bindDocumentDragListener();
        this.bindDocumentDragEndListener();
      }
      if (this.closeOnEscape && this.closable) {
        this.bindDocumentKeyDownListener();
      }
    },
    unbindGlobalListeners() {
      this.unbindDocumentDragListener();
      this.unbindDocumentDragEndListener();
      this.unbindDocumentKeyDownListener();
    },
    bindDocumentDragListener() {
      this.documentDragListener = (event2) => {
        if (this.dragging) {
          let width = DomHandler.getOuterWidth(this.container);
          let height = DomHandler.getOuterHeight(this.container);
          let deltaX = event2.pageX - this.lastPageX;
          let deltaY = event2.pageY - this.lastPageY;
          let offset = this.container.getBoundingClientRect();
          let leftPos = offset.left + deltaX;
          let topPos = offset.top + deltaY;
          let viewport = DomHandler.getViewport();
          this.container.style.position = "fixed";
          if (this.keepInViewport) {
            if (leftPos >= this.minX && leftPos + width < viewport.width) {
              this.lastPageX = event2.pageX;
              this.container.style.left = leftPos + "px";
            }
            if (topPos >= this.minY && topPos + height < viewport.height) {
              this.lastPageY = event2.pageY;
              this.container.style.top = topPos + "px";
            }
          } else {
            this.lastPageX = event2.pageX;
            this.container.style.left = leftPos + "px";
            this.lastPageY = event2.pageY;
            this.container.style.top = topPos + "px";
          }
        }
      };
      window.document.addEventListener("mousemove", this.documentDragListener);
    },
    unbindDocumentDragListener() {
      if (this.documentDragListener) {
        window.document.removeEventListener("mousemove", this.documentDragListener);
        this.documentDragListener = null;
      }
    },
    bindDocumentDragEndListener() {
      this.documentDragEndListener = (event2) => {
        if (this.dragging) {
          this.dragging = false;
          DomHandler.removeClass(document.body, "p-unselectable-text");
          this.$emit("dragend", event2);
        }
      };
      window.document.addEventListener("mouseup", this.documentDragEndListener);
    },
    unbindDocumentDragEndListener() {
      if (this.documentDragEndListener) {
        window.document.removeEventListener("mouseup", this.documentDragEndListener);
        this.documentDragEndListener = null;
      }
    }
  },
  computed: {
    maskClass() {
      return ["p-dialog-mask", { "p-component-overlay p-component-overlay-enter": this.modal }, this.getPositionClass()];
    },
    dialogClass() {
      return [
        "p-dialog p-component",
        {
          "p-dialog-rtl": this.rtl,
          "p-dialog-maximized": this.maximizable && this.maximized,
          "p-input-filled": this.$primevue.config.inputStyle === "filled",
          "p-ripple-disabled": this.$primevue.config.ripple === false
        }
      ];
    },
    maximizeIconComponent() {
      return this.maximized ? this.minimizeIcon ? "span" : "WindowMinimizeIcon" : this.maximizeIcon ? "span" : "WindowMaximizeIcon";
    },
    maximizeIconClass() {
      const maximizeClasses = this.maximized ? this.minimizeIcon : this.maximizeIcon;
      return `p-dialog-header-maximize-icon ${maximizeClasses}`;
    },
    ariaId() {
      return UniqueComponentId();
    },
    ariaLabelledById() {
      return this.header != null || this.$attrs["aria-labelledby"] !== null ? this.ariaId + "_header" : null;
    },
    closeAriaLabel() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.close : void 0;
    },
    attributeSelector() {
      return UniqueComponentId();
    },
    contentStyleClass() {
      return ["p-dialog-content", this.contentClass];
    }
  },
  directives: {
    ripple: Ripple,
    focustrap: FocusTrap
  },
  components: {
    Portal: script$y,
    WindowMinimizeIcon: script$b,
    WindowMaximizeIcon: script$c,
    TimesIcon: script$z
  }
};
const _hoisted_1$f = ["aria-labelledby", "aria-modal"];
const _hoisted_2$8 = ["id"];
const _hoisted_3$8 = ["autofocus", "tabindex"];
const _hoisted_4$3 = ["autofocus", "aria-label"];
function render$a(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Portal = resolveComponent("Portal");
  const _directive_ripple = resolveDirective("ripple");
  const _directive_focustrap = resolveDirective("focustrap");
  return openBlock(), createBlock(_component_Portal, { appendTo: $props.appendTo }, {
    default: withCtx(() => [
      $data.containerVisible ? (openBlock(), createElementBlock("div", mergeProps({
        key: 0,
        ref: $options.maskRef,
        class: $options.maskClass,
        onClick: _cache[3] || (_cache[3] = (...args) => $options.onMaskClick && $options.onMaskClick(...args))
      }, _ctx.ptm("mask")), [
        createVNode(Transition, {
          name: "p-dialog",
          onBeforeEnter: $options.onBeforeEnter,
          onEnter: $options.onEnter,
          onBeforeLeave: $options.onBeforeLeave,
          onLeave: $options.onLeave,
          onAfterLeave: $options.onAfterLeave,
          appear: ""
        }, {
          default: withCtx(() => [
            $props.visible ? withDirectives((openBlock(), createElementBlock("div", mergeProps({
              key: 0,
              ref: $options.containerRef,
              class: $options.dialogClass,
              role: "dialog",
              "aria-labelledby": $options.ariaLabelledById,
              "aria-modal": $props.modal
            }, { ..._ctx.$attrs, ..._ctx.ptm("root") }), [
              $props.showHeader ? (openBlock(), createElementBlock("div", mergeProps({
                key: 0,
                ref: $options.headerContainerRef,
                class: "p-dialog-header",
                onMousedown: _cache[2] || (_cache[2] = (...args) => $options.initDrag && $options.initDrag(...args))
              }, _ctx.ptm("header")), [
                renderSlot(_ctx.$slots, "header", {}, () => [
                  $props.header ? (openBlock(), createElementBlock("span", mergeProps({
                    key: 0,
                    id: $options.ariaLabelledById,
                    class: "p-dialog-title"
                  }, _ctx.ptm("headerTitle")), toDisplayString($props.header), 17, _hoisted_2$8)) : createCommentVNode("", true)
                ]),
                createBaseVNode("div", mergeProps({ class: "p-dialog-header-icons" }, _ctx.ptm("headerIcons")), [
                  $props.maximizable ? withDirectives((openBlock(), createElementBlock("button", mergeProps({
                    key: 0,
                    ref: $options.maximizableRef,
                    autofocus: $data.focusableMax,
                    class: "p-dialog-header-icon p-dialog-header-maximize p-link",
                    onClick: _cache[0] || (_cache[0] = (...args) => $options.maximize && $options.maximize(...args)),
                    type: "button",
                    tabindex: $props.maximizable ? "0" : "-1"
                  }, _ctx.ptm("maximizableButton")), [
                    renderSlot(_ctx.$slots, "maximizeicon", { maximized: $data.maximized }, () => [
                      (openBlock(), createBlock(resolveDynamicComponent($options.maximizeIconComponent), mergeProps({ class: $options.maximizeIconClass }, _ctx.ptm("maximizableIcon")), null, 16, ["class"]))
                    ])
                  ], 16, _hoisted_3$8)), [
                    [_directive_ripple]
                  ]) : createCommentVNode("", true),
                  $props.closable ? withDirectives((openBlock(), createElementBlock("button", mergeProps({
                    key: 1,
                    ref: $options.closeButtonRef,
                    autofocus: $data.focusableClose,
                    class: "p-dialog-header-icon p-dialog-header-close p-link",
                    onClick: _cache[1] || (_cache[1] = (...args) => $options.close && $options.close(...args)),
                    "aria-label": $options.closeAriaLabel,
                    type: "button"
                  }, { ...$props.closeButtonProps, ..._ctx.ptm("closeButton") }), [
                    renderSlot(_ctx.$slots, "closeicon", {}, () => [
                      (openBlock(), createBlock(resolveDynamicComponent($props.closeIcon ? "span" : "TimesIcon"), mergeProps({
                        class: ["p-dialog-header-close-icon", $props.closeIcon]
                      }, _ctx.ptm("closeButtonIcon")), null, 16, ["class"]))
                    ])
                  ], 16, _hoisted_4$3)), [
                    [_directive_ripple]
                  ]) : createCommentVNode("", true)
                ], 16)
              ], 16)) : createCommentVNode("", true),
              createBaseVNode("div", mergeProps({
                ref: $options.contentRef,
                class: $options.contentStyleClass,
                style: $props.contentStyle
              }, { ...$props.contentProps, ..._ctx.ptm("content") }), [
                renderSlot(_ctx.$slots, "default")
              ], 16),
              $props.footer || _ctx.$slots.footer ? (openBlock(), createElementBlock("div", mergeProps({
                key: 1,
                ref: $options.footerContainerRef,
                class: "p-dialog-footer"
              }, _ctx.ptm("footer")), [
                renderSlot(_ctx.$slots, "footer", {}, () => [
                  createTextVNode(toDisplayString($props.footer), 1)
                ])
              ], 16)) : createCommentVNode("", true)
            ], 16, _hoisted_1$f)), [
              [_directive_focustrap, { disabled: !$props.modal }]
            ]) : createCommentVNode("", true)
          ]),
          _: 3
        }, 8, ["onBeforeEnter", "onEnter", "onBeforeLeave", "onLeave", "onAfterLeave"])
      ], 16)) : createCommentVNode("", true)
    ]),
    _: 3
  }, 8, ["appendTo"]);
}
function styleInject$6(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || typeof document === "undefined") {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$6 = "\n.p-dialog-mask {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    pointer-events: none;\n}\n.p-dialog-mask.p-component-overlay {\n    pointer-events: auto;\n}\n.p-dialog {\n    display: flex;\n    flex-direction: column;\n    pointer-events: auto;\n    max-height: 90%;\n    transform: scale(1);\n}\n.p-dialog-content {\n    overflow-y: auto;\n}\n.p-dialog-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    flex-shrink: 0;\n}\n.p-dialog-footer {\n    flex-shrink: 0;\n}\n.p-dialog .p-dialog-header-icons {\n    display: flex;\n    align-items: center;\n}\n.p-dialog .p-dialog-header-icon {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    overflow: hidden;\n    position: relative;\n}\n\n/* Fluid */\n.p-fluid .p-dialog-footer .p-button {\n    width: auto;\n}\n\n/* Animation */\n/* Center */\n.p-dialog-enter-active {\n    transition: all 150ms cubic-bezier(0, 0, 0.2, 1);\n}\n.p-dialog-leave-active {\n    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.p-dialog-enter-from,\n.p-dialog-leave-to {\n    opacity: 0;\n    transform: scale(0.7);\n}\n\n/* Top, Bottom, Left, Right, Top* and Bottom* */\n.p-dialog-top .p-dialog,\n.p-dialog-bottom .p-dialog,\n.p-dialog-left .p-dialog,\n.p-dialog-right .p-dialog,\n.p-dialog-topleft .p-dialog,\n.p-dialog-topright .p-dialog,\n.p-dialog-bottomleft .p-dialog,\n.p-dialog-bottomright .p-dialog {\n    margin: 0.75rem;\n    transform: translate3d(0px, 0px, 0px);\n}\n.p-dialog-top .p-dialog-enter-active,\n.p-dialog-top .p-dialog-leave-active,\n.p-dialog-bottom .p-dialog-enter-active,\n.p-dialog-bottom .p-dialog-leave-active,\n.p-dialog-left .p-dialog-enter-active,\n.p-dialog-left .p-dialog-leave-active,\n.p-dialog-right .p-dialog-enter-active,\n.p-dialog-right .p-dialog-leave-active,\n.p-dialog-topleft .p-dialog-enter-active,\n.p-dialog-topleft .p-dialog-leave-active,\n.p-dialog-topright .p-dialog-enter-active,\n.p-dialog-topright .p-dialog-leave-active,\n.p-dialog-bottomleft .p-dialog-enter-active,\n.p-dialog-bottomleft .p-dialog-leave-active,\n.p-dialog-bottomright .p-dialog-enter-active,\n.p-dialog-bottomright .p-dialog-leave-active {\n    transition: all 0.3s ease-out;\n}\n.p-dialog-top .p-dialog-enter-from,\n.p-dialog-top .p-dialog-leave-to {\n    transform: translate3d(0px, -100%, 0px);\n}\n.p-dialog-bottom .p-dialog-enter-from,\n.p-dialog-bottom .p-dialog-leave-to {\n    transform: translate3d(0px, 100%, 0px);\n}\n.p-dialog-left .p-dialog-enter-from,\n.p-dialog-left .p-dialog-leave-to,\n.p-dialog-topleft .p-dialog-enter-from,\n.p-dialog-topleft .p-dialog-leave-to,\n.p-dialog-bottomleft .p-dialog-enter-from,\n.p-dialog-bottomleft .p-dialog-leave-to {\n    transform: translate3d(-100%, 0px, 0px);\n}\n.p-dialog-right .p-dialog-enter-from,\n.p-dialog-right .p-dialog-leave-to,\n.p-dialog-topright .p-dialog-enter-from,\n.p-dialog-topright .p-dialog-leave-to,\n.p-dialog-bottomright .p-dialog-enter-from,\n.p-dialog-bottomright .p-dialog-leave-to {\n    transform: translate3d(100%, 0px, 0px);\n}\n\n/* Maximize */\n.p-dialog-maximized {\n    -webkit-transition: none;\n    transition: none;\n    transform: none;\n    width: 100vw !important;\n    height: 100vh !important;\n    top: 0px !important;\n    left: 0px !important;\n    max-height: 100%;\n    height: 100%;\n}\n.p-dialog-maximized .p-dialog-content {\n    flex-grow: 1;\n}\n\n/* Position */\n.p-dialog-left {\n    justify-content: flex-start;\n}\n.p-dialog-right {\n    justify-content: flex-end;\n}\n.p-dialog-top {\n    align-items: flex-start;\n}\n.p-dialog-topleft {\n    justify-content: flex-start;\n    align-items: flex-start;\n}\n.p-dialog-topright {\n    justify-content: flex-end;\n    align-items: flex-start;\n}\n.p-dialog-bottom {\n    align-items: flex-end;\n}\n.p-dialog-bottomleft {\n    justify-content: flex-start;\n    align-items: flex-end;\n}\n.p-dialog-bottomright {\n    justify-content: flex-end;\n    align-items: flex-end;\n}\n.p-confirm-dialog .p-dialog-content {\n    display: flex;\n    align-items: center;\n}\n";
styleInject$6(css_248z$6);
script$a.render = render$a;
var script$9 = {
  name: "ExclamationTriangleIcon",
  extends: script$J
};
const _hoisted_1$e = /* @__PURE__ */ createStaticVNode('<g clip-path="url(#clip0_323_12417)"><path d="M13.4018 13.1893H0.598161C0.49329 13.189 0.390283 13.1615 0.299143 13.1097C0.208003 13.0578 0.131826 12.9832 0.0780112 12.8932C0.0268539 12.8015 0 12.6982 0 12.5931C0 12.4881 0.0268539 12.3848 0.0780112 12.293L6.47985 1.08982C6.53679 1.00399 6.61408 0.933574 6.70484 0.884867C6.7956 0.836159 6.897 0.810669 7 0.810669C7.103 0.810669 7.2044 0.836159 7.29516 0.884867C7.38592 0.933574 7.46321 1.00399 7.52015 1.08982L13.922 12.293C13.9731 12.3848 14 12.4881 14 12.5931C14 12.6982 13.9731 12.8015 13.922 12.8932C13.8682 12.9832 13.792 13.0578 13.7009 13.1097C13.6097 13.1615 13.5067 13.189 13.4018 13.1893ZM1.63046 11.989H12.3695L7 2.59425L1.63046 11.989Z" fill="currentColor"></path><path d="M6.99996 8.78801C6.84143 8.78594 6.68997 8.72204 6.57787 8.60993C6.46576 8.49782 6.40186 8.34637 6.39979 8.18784V5.38703C6.39979 5.22786 6.46302 5.0752 6.57557 4.96265C6.68813 4.85009 6.84078 4.78686 6.99996 4.78686C7.15914 4.78686 7.31179 4.85009 7.42435 4.96265C7.5369 5.0752 7.60013 5.22786 7.60013 5.38703V8.18784C7.59806 8.34637 7.53416 8.49782 7.42205 8.60993C7.30995 8.72204 7.15849 8.78594 6.99996 8.78801Z" fill="currentColor"></path><path d="M6.99996 11.1887C6.84143 11.1866 6.68997 11.1227 6.57787 11.0106C6.46576 10.8985 6.40186 10.7471 6.39979 10.5885V10.1884C6.39979 10.0292 6.46302 9.87658 6.57557 9.76403C6.68813 9.65147 6.84078 9.58824 6.99996 9.58824C7.15914 9.58824 7.31179 9.65147 7.42435 9.76403C7.5369 9.87658 7.60013 10.0292 7.60013 10.1884V10.5885C7.59806 10.7471 7.53416 10.8985 7.42205 11.0106C7.30995 11.1227 7.15849 11.1866 6.99996 11.1887Z" fill="currentColor"></path></g><defs><clipPath id="clip0_323_12417"><rect width="14" height="14" fill="white"></rect></clipPath></defs>', 2);
const _hoisted_3$7 = [
  _hoisted_1$e
];
function render$9(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_3$7, 16);
}
script$9.render = render$9;
var script$8 = {
  name: "InfoCircleIcon",
  extends: script$J
};
const _hoisted_1$d = /* @__PURE__ */ createBaseVNode("g", { "clip-path": "url(#clip0_408_21102)" }, [
  /* @__PURE__ */ createBaseVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M3.11101 12.8203C4.26215 13.5895 5.61553 14 7 14C8.85652 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85652 14 7C14 5.61553 13.5895 4.26215 12.8203 3.11101C12.0511 1.95987 10.9579 1.06266 9.67879 0.532846C8.3997 0.00303296 6.99224 -0.13559 5.63437 0.134506C4.2765 0.404603 3.02922 1.07129 2.05026 2.05026C1.07129 3.02922 0.404603 4.2765 0.134506 5.63437C-0.13559 6.99224 0.00303296 8.3997 0.532846 9.67879C1.06266 10.9579 1.95987 12.0511 3.11101 12.8203ZM3.75918 2.14976C4.71846 1.50879 5.84628 1.16667 7 1.16667C8.5471 1.16667 10.0308 1.78125 11.1248 2.87521C12.2188 3.96918 12.8333 5.45291 12.8333 7C12.8333 8.15373 12.4912 9.28154 11.8502 10.2408C11.2093 11.2001 10.2982 11.9478 9.23232 12.3893C8.16642 12.8308 6.99353 12.9463 5.86198 12.7212C4.73042 12.4962 3.69102 11.9406 2.87521 11.1248C2.05941 10.309 1.50384 9.26958 1.27876 8.13803C1.05367 7.00647 1.16919 5.83358 1.61071 4.76768C2.05222 3.70178 2.79989 2.79074 3.75918 2.14976ZM7.00002 4.8611C6.84594 4.85908 6.69873 4.79698 6.58977 4.68801C6.48081 4.57905 6.4187 4.43185 6.41669 4.27776V3.88888C6.41669 3.73417 6.47815 3.58579 6.58754 3.4764C6.69694 3.367 6.84531 3.30554 7.00002 3.30554C7.15473 3.30554 7.3031 3.367 7.4125 3.4764C7.52189 3.58579 7.58335 3.73417 7.58335 3.88888V4.27776C7.58134 4.43185 7.51923 4.57905 7.41027 4.68801C7.30131 4.79698 7.1541 4.85908 7.00002 4.8611ZM7.00002 10.6945C6.84594 10.6925 6.69873 10.6304 6.58977 10.5214C6.48081 10.4124 6.4187 10.2652 6.41669 10.1111V6.22225C6.41669 6.06754 6.47815 5.91917 6.58754 5.80977C6.69694 5.70037 6.84531 5.63892 7.00002 5.63892C7.15473 5.63892 7.3031 5.70037 7.4125 5.80977C7.52189 5.91917 7.58335 6.06754 7.58335 6.22225V10.1111C7.58134 10.2652 7.51923 10.4124 7.41027 10.5214C7.30131 10.6304 7.1541 10.6925 7.00002 10.6945Z",
    fill: "currentColor"
  })
], -1);
const _hoisted_2$7 = /* @__PURE__ */ createBaseVNode("defs", null, [
  /* @__PURE__ */ createBaseVNode("clipPath", { id: "clip0_408_21102" }, [
    /* @__PURE__ */ createBaseVNode("rect", {
      width: "14",
      height: "14",
      fill: "white"
    })
  ])
], -1);
const _hoisted_3$6 = [
  _hoisted_1$d,
  _hoisted_2$7
];
function render$8(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_3$6, 16);
}
script$8.render = render$8;
var script$7 = {
  name: "TimesCircleIcon",
  extends: script$J
};
const _hoisted_1$c = /* @__PURE__ */ createBaseVNode("g", { "clip-path": "url(#clip0_334_13179)" }, [
  /* @__PURE__ */ createBaseVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M7 14C5.61553 14 4.26215 13.5895 3.11101 12.8203C1.95987 12.0511 1.06266 10.9579 0.532846 9.67879C0.00303296 8.3997 -0.13559 6.99224 0.134506 5.63437C0.404603 4.2765 1.07129 3.02922 2.05026 2.05026C3.02922 1.07129 4.2765 0.404603 5.63437 0.134506C6.99224 -0.13559 8.3997 0.00303296 9.67879 0.532846C10.9579 1.06266 12.0511 1.95987 12.8203 3.11101C13.5895 4.26215 14 5.61553 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14ZM7 1.16667C5.84628 1.16667 4.71846 1.50879 3.75918 2.14976C2.79989 2.79074 2.05222 3.70178 1.61071 4.76768C1.16919 5.83358 1.05367 7.00647 1.27876 8.13803C1.50384 9.26958 2.05941 10.309 2.87521 11.1248C3.69102 11.9406 4.73042 12.4962 5.86198 12.7212C6.99353 12.9463 8.16642 12.8308 9.23232 12.3893C10.2982 11.9478 11.2093 11.2001 11.8502 10.2408C12.4912 9.28154 12.8333 8.15373 12.8333 7C12.8333 5.45291 12.2188 3.96918 11.1248 2.87521C10.0308 1.78125 8.5471 1.16667 7 1.16667ZM4.66662 9.91668C4.58998 9.91704 4.51404 9.90209 4.44325 9.87271C4.37246 9.84333 4.30826 9.8001 4.2544 9.74557C4.14516 9.6362 4.0838 9.48793 4.0838 9.33335C4.0838 9.17876 4.14516 9.0305 4.2544 8.92113L6.17553 7L4.25443 5.07891C4.15139 4.96832 4.09529 4.82207 4.09796 4.67094C4.10063 4.51982 4.16185 4.37563 4.26872 4.26876C4.3756 4.16188 4.51979 4.10066 4.67091 4.09799C4.82204 4.09532 4.96829 4.15142 5.07887 4.25446L6.99997 6.17556L8.92106 4.25446C9.03164 4.15142 9.1779 4.09532 9.32903 4.09799C9.48015 4.10066 9.62434 4.16188 9.73121 4.26876C9.83809 4.37563 9.89931 4.51982 9.90198 4.67094C9.90464 4.82207 9.84855 4.96832 9.74551 5.07891L7.82441 7L9.74554 8.92113C9.85478 9.0305 9.91614 9.17876 9.91614 9.33335C9.91614 9.48793 9.85478 9.6362 9.74554 9.74557C9.69168 9.8001 9.62748 9.84333 9.55669 9.87271C9.4859 9.90209 9.40996 9.91704 9.33332 9.91668C9.25668 9.91704 9.18073 9.90209 9.10995 9.87271C9.03916 9.84333 8.97495 9.8001 8.9211 9.74557L6.99997 7.82444L5.07884 9.74557C5.02499 9.8001 4.96078 9.84333 4.88999 9.87271C4.81921 9.90209 4.74326 9.91704 4.66662 9.91668Z",
    fill: "currentColor"
  })
], -1);
const _hoisted_2$6 = /* @__PURE__ */ createBaseVNode("defs", null, [
  /* @__PURE__ */ createBaseVNode("clipPath", { id: "clip0_334_13179" }, [
    /* @__PURE__ */ createBaseVNode("rect", {
      width: "14",
      height: "14",
      fill: "white"
    })
  ])
], -1);
const _hoisted_3$5 = [
  _hoisted_1$c,
  _hoisted_2$6
];
function render$7(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_3$5, 16);
}
script$7.render = render$7;
var script$6 = {
  name: "Message",
  extends: script$K,
  emits: ["close"],
  props: {
    severity: {
      type: String,
      default: "info"
    },
    closable: {
      type: Boolean,
      default: true
    },
    sticky: {
      type: Boolean,
      default: true
    },
    life: {
      type: Number,
      default: 3e3
    },
    icon: {
      type: String,
      default: void 0
    },
    closeIcon: {
      type: String,
      default: void 0
    },
    closeButtonProps: {
      type: null,
      default: null
    }
  },
  timeout: null,
  data() {
    return {
      visible: true
    };
  },
  mounted() {
    if (!this.sticky) {
      this.closeAfterDelay();
    }
  },
  methods: {
    close(event2) {
      this.visible = false;
      this.$emit("close", event2);
    },
    closeAfterDelay() {
      setTimeout(() => {
        this.visible = false;
      }, this.life);
    }
  },
  computed: {
    containerClass() {
      return "p-message p-component p-message-" + this.severity;
    },
    iconComponent() {
      return {
        info: script$8,
        success: script$l,
        warn: script$9,
        error: script$7
      }[this.severity];
    },
    closeAriaLabel() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.close : void 0;
    }
  },
  directives: {
    ripple: Ripple
  },
  components: {
    TimesIcon: script$z,
    InfoCircleIcon: script$8,
    CheckIcon: script$l,
    ExclamationTriangleIcon: script$9,
    TimesCircleIcon: script$7
  }
};
const _hoisted_1$b = ["aria-label"];
function render$6(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_TimesIcon = resolveComponent("TimesIcon");
  const _directive_ripple = resolveDirective("ripple");
  return openBlock(), createBlock(Transition, {
    name: "p-message",
    appear: ""
  }, {
    default: withCtx(() => [
      withDirectives(createBaseVNode("div", mergeProps({
        class: $options.containerClass,
        role: "alert",
        "aria-live": "assertive",
        "aria-atomic": "true"
      }, _ctx.ptm("root")), [
        createBaseVNode("div", mergeProps({ class: "p-message-wrapper" }, _ctx.ptm("wrapper")), [
          renderSlot(_ctx.$slots, "messageicon", { class: "p-message-icon" }, () => [
            (openBlock(), createBlock(resolveDynamicComponent($props.icon ? "span" : $options.iconComponent), mergeProps({
              class: ["p-message-icon", $props.icon]
            }, _ctx.ptm("icon")), null, 16, ["class"]))
          ]),
          createBaseVNode("div", mergeProps({ class: "p-message-text" }, _ctx.ptm("text")), [
            renderSlot(_ctx.$slots, "default")
          ], 16),
          $props.closable ? withDirectives((openBlock(), createElementBlock("button", mergeProps({
            key: 0,
            class: "p-message-close p-link",
            "aria-label": $options.closeAriaLabel,
            type: "button",
            onClick: _cache[0] || (_cache[0] = ($event) => $options.close($event))
          }, { ...$props.closeButtonProps, ..._ctx.ptm("button") }), [
            renderSlot(_ctx.$slots, "closeicon", { class: "p-message-close-icon" }, () => [
              $props.closeIcon ? (openBlock(), createElementBlock("i", mergeProps({
                key: 0,
                class: ["p-message-close-icon", $props.closeIcon]
              }, _ctx.ptm("buttonIcon")), null, 16)) : (openBlock(), createBlock(_component_TimesIcon, mergeProps({
                key: 1,
                class: "p-message-close-icon"
              }, _ctx.ptm("buttonIcon")), null, 16))
            ])
          ], 16, _hoisted_1$b)), [
            [_directive_ripple]
          ]) : createCommentVNode("", true)
        ], 16)
      ], 16), [
        [vShow, $data.visible]
      ])
    ]),
    _: 3
  });
}
function styleInject$5(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || typeof document === "undefined") {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$5 = "\n.p-message-wrapper {\n    display: flex;\n    align-items: center;\n}\n.p-message-close {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n.p-message-close.p-link {\n    margin-left: auto;\n    overflow: hidden;\n    position: relative;\n}\n.p-message-enter-from {\n    opacity: 0;\n}\n.p-message-enter-active {\n    transition: opacity 0.3s;\n}\n.p-message.p-message-leave-from {\n    max-height: 1000px;\n}\n.p-message.p-message-leave-to {\n    max-height: 0;\n    opacity: 0;\n    margin: 0 !important;\n}\n.p-message-leave-active {\n    overflow: hidden;\n    transition: max-height 0.3s cubic-bezier(0, 1, 0, 1), opacity 0.3s, margin 0.15s;\n}\n.p-message-leave-active .p-message-close {\n    display: none;\n}\n";
styleInject$5(css_248z$5);
script$6.render = render$6;
var script$5 = {
  name: "InlineMessage",
  extends: script$K,
  props: {
    severity: {
      type: String,
      default: "error"
    },
    icon: {
      type: String,
      default: void 0
    }
  },
  timeout: null,
  data() {
    return {
      visible: true
    };
  },
  mounted() {
    if (!this.sticky) {
      setTimeout(() => {
        this.visible = false;
      }, this.life);
    }
  },
  computed: {
    containerClass() {
      return ["p-inline-message p-component p-inline-message-" + this.severity, { "p-inline-message-icon-only": !this.$slots.default }];
    },
    iconComponent() {
      return {
        info: script$8,
        success: script$l,
        warn: script$9,
        error: script$7
      }[this.severity];
    }
  }
};
function render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", mergeProps({
    "aria-live": "polite",
    class: $options.containerClass
  }, _ctx.ptm("root")), [
    renderSlot(_ctx.$slots, "icon", {}, () => [
      (openBlock(), createBlock(resolveDynamicComponent($props.icon ? "span" : $options.iconComponent), mergeProps({
        class: ["p-inline-message-icon", $props.icon]
      }, _ctx.ptm("icon")), null, 16, ["class"]))
    ]),
    createBaseVNode("span", mergeProps({ class: "p-inline-message-text" }, _ctx.ptm("text")), [
      renderSlot(_ctx.$slots, "default", {}, () => [
        createTextVNode(" ")
      ])
    ], 16)
  ], 16);
}
function styleInject$4(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || typeof document === "undefined") {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$4 = "\n.p-inline-message {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    vertical-align: top;\n}\n.p-inline-message-icon-only .p-inline-message-text {\n    visibility: hidden;\n    width: 0;\n}\n.p-fluid .p-inline-message {\n    display: flex;\n}\n";
styleInject$4(css_248z$4);
script$5.render = render$5;
var script$4 = {
  name: "MinusIcon",
  extends: script$J
};
const _hoisted_1$a = /* @__PURE__ */ createBaseVNode("path", {
  d: "M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z",
  fill: "currentColor"
}, null, -1);
const _hoisted_2$5 = [
  _hoisted_1$a
];
function render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _hoisted_2$5, 16);
}
script$4.render = render$4;
var script$3 = {
  name: "Panel",
  extends: script$K,
  emits: ["update:collapsed", "toggle"],
  props: {
    header: String,
    toggleable: Boolean,
    collapsed: Boolean,
    toggleButtonProps: {
      type: null,
      default: null
    }
  },
  data() {
    return {
      d_collapsed: this.collapsed
    };
  },
  watch: {
    collapsed(newValue) {
      this.d_collapsed = newValue;
    }
  },
  methods: {
    toggle(event2) {
      this.d_collapsed = !this.d_collapsed;
      this.$emit("update:collapsed", this.d_collapsed);
      this.$emit("toggle", {
        originalEvent: event2,
        value: this.d_collapsed
      });
    },
    onKeyDown(event2) {
      if (event2.code === "Enter" || event2.code === "Space") {
        this.toggle(event2);
        event2.preventDefault();
      }
    }
  },
  computed: {
    ariaId() {
      return UniqueComponentId();
    },
    containerClass() {
      return ["p-panel p-component", { "p-panel-toggleable": this.toggleable }];
    },
    buttonAriaLabel() {
      return this.toggleButtonProps && this.toggleButtonProps["aria-label"] ? this.toggleButtonProps["aria-label"] : this.header;
    }
  },
  components: {
    PlusIcon: script$i,
    MinusIcon: script$4
  },
  directives: {
    ripple: Ripple
  }
};
const _hoisted_1$9 = ["id"];
const _hoisted_2$4 = ["id", "aria-label", "aria-controls", "aria-expanded"];
const _hoisted_3$4 = ["id", "aria-labelledby"];
function render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = resolveDirective("ripple");
  return openBlock(), createElementBlock("div", mergeProps({ class: $options.containerClass }, _ctx.ptm("root")), [
    createBaseVNode("div", mergeProps({ class: "p-panel-header" }, _ctx.ptm("header")), [
      renderSlot(_ctx.$slots, "header", {
        id: $options.ariaId + "_header",
        class: "p-panel-title"
      }, () => [
        $props.header ? (openBlock(), createElementBlock("span", mergeProps({
          key: 0,
          id: $options.ariaId + "_header",
          class: "p-panel-title"
        }, _ctx.ptm("title")), toDisplayString($props.header), 17, _hoisted_1$9)) : createCommentVNode("", true)
      ]),
      createBaseVNode("div", mergeProps({ class: "p-panel-icons" }, _ctx.ptm("icons")), [
        renderSlot(_ctx.$slots, "icons"),
        $props.toggleable ? withDirectives((openBlock(), createElementBlock("button", mergeProps({
          key: 0,
          id: $options.ariaId + "_header",
          type: "button",
          role: "button",
          class: "p-panel-header-icon p-panel-toggler p-link",
          "aria-label": $options.buttonAriaLabel,
          "aria-controls": $options.ariaId + "_content",
          "aria-expanded": !$data.d_collapsed,
          onClick: _cache[0] || (_cache[0] = (...args) => $options.toggle && $options.toggle(...args)),
          onKeydown: _cache[1] || (_cache[1] = (...args) => $options.onKeyDown && $options.onKeyDown(...args))
        }, { ...$props.toggleButtonProps, ..._ctx.ptm("toggler") }), [
          renderSlot(_ctx.$slots, "togglericon", { collapsed: $data.d_collapsed }, () => [
            (openBlock(), createBlock(resolveDynamicComponent($data.d_collapsed ? "PlusIcon" : "MinusIcon"), normalizeProps(guardReactiveProps(_ctx.ptm("togglericon"))), null, 16))
          ])
        ], 16, _hoisted_2$4)), [
          [_directive_ripple]
        ]) : createCommentVNode("", true)
      ], 16)
    ], 16),
    createVNode(Transition, { name: "p-toggleable-content" }, {
      default: withCtx(() => [
        withDirectives(createBaseVNode("div", mergeProps({
          id: $options.ariaId + "_content",
          class: "p-toggleable-content",
          role: "region",
          "aria-labelledby": $options.ariaId + "_header"
        }, _ctx.ptm("toggleablecontent")), [
          createBaseVNode("div", mergeProps({ class: "p-panel-content" }, _ctx.ptm("content")), [
            renderSlot(_ctx.$slots, "default")
          ], 16),
          _ctx.$slots.footer ? (openBlock(), createElementBlock("div", mergeProps({
            key: 0,
            class: "p-panel-footer"
          }, _ctx.ptm("footer")), [
            renderSlot(_ctx.$slots, "footer")
          ], 16)) : createCommentVNode("", true)
        ], 16, _hoisted_3$4), [
          [vShow, !$data.d_collapsed]
        ])
      ]),
      _: 3
    })
  ], 16);
}
function styleInject$3(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || typeof document === "undefined") {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$3 = "\n.p-panel-header {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n}\n.p-panel-title {\n    line-height: 1;\n}\n.p-panel-header-icon {\n    display: inline-flex;\n    justify-content: center;\n    align-items: center;\n    cursor: pointer;\n    text-decoration: none;\n    overflow: hidden;\n    position: relative;\n}\n";
styleInject$3(css_248z$3);
script$3.render = render$3;
var script$2 = {
  name: "ProgressBar",
  extends: script$K,
  props: {
    value: {
      type: Number,
      default: null
    },
    mode: {
      type: String,
      default: "determinate"
    },
    showValue: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    containerClass() {
      return [
        "p-progressbar p-component",
        {
          "p-progressbar-determinate": this.determinate,
          "p-progressbar-indeterminate": this.indeterminate
        }
      ];
    },
    progressStyle() {
      return {
        width: this.value + "%",
        display: "flex"
      };
    },
    indeterminate() {
      return this.mode === "indeterminate";
    },
    determinate() {
      return this.mode === "determinate";
    }
  }
};
const _hoisted_1$8 = ["aria-valuenow"];
function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", mergeProps({
    role: "progressbar",
    class: $options.containerClass,
    "aria-valuemin": "0",
    "aria-valuenow": $props.value,
    "aria-valuemax": "100"
  }, _ctx.ptm("root")), [
    $options.determinate ? (openBlock(), createElementBlock("div", mergeProps({
      key: 0,
      class: "p-progressbar-value p-progressbar-value-animate",
      style: $options.progressStyle
    }, _ctx.ptm("value")), [
      $props.value != null && $props.value !== 0 && $props.showValue ? (openBlock(), createElementBlock("div", mergeProps({
        key: 0,
        class: "p-progressbar-label"
      }, _ctx.ptm("label")), [
        renderSlot(_ctx.$slots, "default", {}, () => [
          createTextVNode(toDisplayString($props.value + "%"), 1)
        ])
      ], 16)) : createCommentVNode("", true)
    ], 16)) : createCommentVNode("", true),
    $options.indeterminate ? (openBlock(), createElementBlock("div", mergeProps({
      key: 1,
      class: "p-progressbar-indeterminate-container"
    }, _ctx.ptm("root")), [
      createBaseVNode("div", mergeProps({ class: "p-progressbar-value p-progressbar-value-animate" }, _ctx.ptm("value")), null, 16)
    ], 16)) : createCommentVNode("", true)
  ], 16, _hoisted_1$8);
}
function styleInject$2(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || typeof document === "undefined") {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$2 = "\n.p-progressbar {\n    position: relative;\n    overflow: hidden;\n}\n.p-progressbar-determinate .p-progressbar-value {\n    height: 100%;\n    width: 0%;\n    position: absolute;\n    display: none;\n    border: 0 none;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    overflow: hidden;\n}\n.p-progressbar-determinate .p-progressbar-label {\n    display: inline-flex;\n}\n.p-progressbar-determinate .p-progressbar-value-animate {\n    transition: width 1s ease-in-out;\n}\n.p-progressbar-indeterminate .p-progressbar-value::before {\n    content: '';\n    position: absolute;\n    background-color: inherit;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    will-change: left, right;\n    -webkit-animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\n    animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\n}\n.p-progressbar-indeterminate .p-progressbar-value::after {\n    content: '';\n    position: absolute;\n    background-color: inherit;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    will-change: left, right;\n    -webkit-animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n    animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n    -webkit-animation-delay: 1.15s;\n    animation-delay: 1.15s;\n}\n@-webkit-keyframes p-progressbar-indeterminate-anim {\n0% {\n        left: -35%;\n        right: 100%;\n}\n60% {\n        left: 100%;\n        right: -90%;\n}\n100% {\n        left: 100%;\n        right: -90%;\n}\n}\n@keyframes p-progressbar-indeterminate-anim {\n0% {\n        left: -35%;\n        right: 100%;\n}\n60% {\n        left: 100%;\n        right: -90%;\n}\n100% {\n        left: 100%;\n        right: -90%;\n}\n}\n@-webkit-keyframes p-progressbar-indeterminate-anim-short {\n0% {\n        left: -200%;\n        right: 100%;\n}\n60% {\n        left: 107%;\n        right: -8%;\n}\n100% {\n        left: 107%;\n        right: -8%;\n}\n}\n@keyframes p-progressbar-indeterminate-anim-short {\n0% {\n        left: -200%;\n        right: 100%;\n}\n60% {\n        left: 107%;\n        right: -8%;\n}\n100% {\n        left: 107%;\n        right: -8%;\n}\n}\n";
styleInject$2(css_248z$2);
script$2.render = render$2;
var script$1 = {
  name: "ProgressSpinner",
  extends: script$K,
  props: {
    strokeWidth: {
      type: String,
      default: "2"
    },
    fill: {
      type: String,
      default: "none"
    },
    animationDuration: {
      type: String,
      default: "2s"
    }
  },
  computed: {
    svgStyle() {
      return {
        "animation-duration": this.animationDuration
      };
    }
  }
};
const _hoisted_1$7 = ["fill", "stroke-width"];
function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", mergeProps({
    class: "p-progress-spinner",
    role: "progressbar"
  }, _ctx.ptm("root")), [
    (openBlock(), createElementBlock("svg", mergeProps({
      class: "p-progress-spinner-svg",
      viewBox: "25 25 50 50",
      style: $options.svgStyle
    }, _ctx.ptm("spinner")), [
      createBaseVNode("circle", mergeProps({
        class: "p-progress-spinner-circle",
        cx: "50",
        cy: "50",
        r: "20",
        fill: $props.fill,
        "stroke-width": $props.strokeWidth,
        strokeMiterlimit: "10"
      }, _ctx.ptm("circle")), null, 16, _hoisted_1$7)
    ], 16))
  ], 16);
}
function styleInject$1(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || typeof document === "undefined") {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z$1 = "\n.p-progress-spinner {\n    position: relative;\n    margin: 0 auto;\n    width: 100px;\n    height: 100px;\n    display: inline-block;\n}\n.p-progress-spinner::before {\n    content: '';\n    display: block;\n    padding-top: 100%;\n}\n.p-progress-spinner-svg {\n    height: 100%;\n    transform-origin: center center;\n    width: 100%;\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    margin: auto;\n}\n";
styleInject$1(css_248z$1);
script$1.render = render$1;
var script = {
  name: "Toolbar",
  extends: script$K,
  props: {
    "aria-labelledby": {
      type: String,
      default: null
    }
  }
};
const _hoisted_1$6 = ["aria-labelledby"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", mergeProps({
    class: "p-toolbar p-component",
    role: "toolbar",
    "aria-labelledby": _ctx.ariaLabelledby
  }, _ctx.ptm("root")), [
    createBaseVNode("div", mergeProps({ class: "p-toolbar-group-start p-toolbar-group-left" }, _ctx.ptm("start")), [
      renderSlot(_ctx.$slots, "start")
    ], 16),
    createBaseVNode("div", mergeProps({ class: "p-toolbar-group-center" }, _ctx.ptm("center")), [
      renderSlot(_ctx.$slots, "center")
    ], 16),
    createBaseVNode("div", mergeProps({ class: "p-toolbar-group-end p-toolbar-group-right" }, _ctx.ptm("end")), [
      renderSlot(_ctx.$slots, "end")
    ], 16)
  ], 16, _hoisted_1$6);
}
function styleInject(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || typeof document === "undefined") {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z = "\n.p-toolbar {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    flex-wrap: wrap;\n}\n.p-toolbar-group-start,\n.p-toolbar-group-center,\n.p-toolbar-group-end {\n    display: flex;\n    align-items: center;\n}\n.p-toolbar-group-left,\n.p-toolbar-group-right {\n    display: flex;\n    align-items: center;\n}\n";
styleInject(css_248z);
script.render = render;
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}
const { toString } = Object.prototype;
const { getPrototypeOf } = Object;
const kindOf = ((cache) => (thing) => {
  const str = toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null));
const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type;
};
const typeOfTest = (type) => (thing) => typeof thing === type;
const { isArray } = Array;
const isUndefined = typeOfTest("undefined");
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
const isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
const isString = typeOfTest("string");
const isFunction = typeOfTest("function");
const isNumber = typeOfTest("number");
const isObject = (thing) => thing !== null && typeof thing === "object";
const isBoolean = (thing) => thing === true || thing === false;
const isPlainObject = (val) => {
  if (kindOf(val) !== "object") {
    return false;
  }
  const prototype2 = getPrototypeOf(val);
  return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};
const isDate = kindOfTest("Date");
const isFile = kindOfTest("File");
const isBlob = kindOfTest("Blob");
const isFileList = kindOfTest("FileList");
const isStream = (val) => isObject(val) && isFunction(val.pipe);
const isFormData = (thing) => {
  let kind;
  return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
  kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
};
const isURLSearchParams = kindOfTest("URLSearchParams");
const trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i;
  let l;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
const _global = (() => {
  if (typeof globalThis !== "undefined")
    return globalThis;
  return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
})();
const isContextDefined = (context) => !isUndefined(context) && context !== _global;
function merge() {
  const { caseless } = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };
  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}
const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, { allOwnKeys });
  return a;
};
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
};
const inherits = (constructor, superConstructor, props, descriptors2) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, "super", {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};
const toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};
  destObj = destObj || {};
  if (sourceObj == null)
    return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
};
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === void 0 || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
const toArray = (thing) => {
  if (!thing)
    return null;
  if (isArray(thing))
    return thing;
  let i = thing.length;
  if (!isNumber(i))
    return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};
const isTypedArray = ((TypedArray) => {
  return (thing) => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];
  const iterator = generator.call(obj);
  let result;
  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];
  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }
  return arr;
};
const isHTMLForm = kindOfTest("HTMLFormElement");
const toCamelCase = (str) => {
  return str.toLowerCase().replace(
    /[-_\s]([a-z\d])(\w*)/g,
    function replacer2(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};
const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
const isRegExp = kindOfTest("RegExp");
const reduceDescriptors = (obj, reducer) => {
  const descriptors2 = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach(descriptors2, (descriptor, name) => {
    if (reducer(descriptor, name, obj) !== false) {
      reducedDescriptors[name] = descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
};
const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
      return false;
    }
    const value = obj[name];
    if (!isFunction(value))
      return;
    descriptor.enumerable = false;
    if ("writable" in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
    }
  });
};
const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define = (arr) => {
    arr.forEach((value) => {
      obj[value] = true;
    });
  };
  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
  return obj;
};
const noop = () => {
};
const toFiniteNumber = (value, defaultValue) => {
  value = +value;
  return Number.isFinite(value) ? value : defaultValue;
};
const ALPHA = "abcdefghijklmnopqrstuvwxyz";
const DIGIT = "0123456789";
const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};
const generateString = (size2 = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = "";
  const { length } = alphabet;
  while (size2--) {
    str += alphabet[Math.random() * length | 0];
  }
  return str;
};
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
}
const toJSONObject = (obj) => {
  const stack = new Array(10);
  const visit = (source, i) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }
      if (!("toJSON" in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};
        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });
        stack[i] = void 0;
        return target;
      }
    }
    return source;
  };
  return visit(obj, 0);
};
const isAsyncFn = kindOfTest("AsyncFunction");
const isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
const utils = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable
};
function AxiosError(message, code, config, request, response) {
  Error.call(this);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack;
  }
  this.message = message;
  this.name = "AxiosError";
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}
utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});
const prototype$1 = AxiosError.prototype;
const descriptors = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((code) => {
  descriptors[code] = { value: code };
});
Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype$1, "isAxiosError", { value: true });
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);
  utils.toFlatObject(error, axiosError, function filter2(obj) {
    return obj !== Error.prototype;
  }, (prop) => {
    return prop !== "isAxiosError";
  });
  AxiosError.call(axiosError, error.message, code, config, request, response);
  axiosError.cause = error;
  axiosError.name = error.name;
  customProps && Object.assign(axiosError, customProps);
  return axiosError;
};
const httpAdapter = null;
function isVisitable(thing) {
  return utils.isPlainObject(thing) || utils.isArray(thing);
}
function removeBrackets(key) {
  return utils.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
function renderKey(path, key, dots) {
  if (!path)
    return key;
  return path.concat(key).map(function each(token, i) {
    token = removeBrackets(token);
    return !dots && i ? "[" + token + "]" : token;
  }).join(dots ? "." : "");
}
function isFlatArray(arr) {
  return utils.isArray(arr) && !arr.some(isVisitable);
}
const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});
function toFormData(obj, formData, options) {
  if (!utils.isObject(obj)) {
    throw new TypeError("target must be an object");
  }
  formData = formData || new FormData();
  options = utils.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    return !utils.isUndefined(source[option]);
  });
  const metaTokens = options.metaTokens;
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
  const useBlob = _Blob && utils.isSpecCompliantForm(formData);
  if (!utils.isFunction(visitor)) {
    throw new TypeError("visitor must be a function");
  }
  function convertValue(value) {
    if (value === null)
      return "";
    if (utils.isDate(value)) {
      return value.toISOString();
    }
    if (!useBlob && utils.isBlob(value)) {
      throw new AxiosError("Blob is not supported. Use a Buffer instead.");
    }
    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key, path) {
    let arr = value;
    if (value && !path && typeof value === "object") {
      if (utils.endsWith(key, "{}")) {
        key = metaTokens ? key : key.slice(0, -2);
        value = JSON.stringify(value);
      } else if (utils.isArray(value) && isFlatArray(value) || (utils.isFileList(value) || utils.endsWith(key, "[]")) && (arr = utils.toArray(value))) {
        key = removeBrackets(key);
        arr.forEach(function each(el, index) {
          !(utils.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
            convertValue(el)
          );
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path, key, dots), convertValue(value));
    return false;
  }
  const stack = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build(value, path) {
    if (utils.isUndefined(value))
      return;
    if (stack.indexOf(value) !== -1) {
      throw Error("Circular reference detected in " + path.join("."));
    }
    stack.push(value);
    utils.forEach(value, function each(el, key) {
      const result = !(utils.isUndefined(el) || el === null) && visitor.call(
        formData,
        el,
        utils.isString(key) ? key.trim() : key,
        path,
        exposedHelpers
      );
      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });
    stack.pop();
  }
  if (!utils.isObject(obj)) {
    throw new TypeError("data must be an object");
  }
  build(obj);
  return formData;
}
function encode$1(str) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer2(match) {
    return charMap[match];
  });
}
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && toFormData(params, this, options);
}
const prototype = AxiosURLSearchParams.prototype;
prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};
prototype.toString = function toString2(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;
  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + "=" + _encode(pair[1]);
  }, "").join("&");
};
function encode(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function buildURL(url, params, options) {
  if (!params) {
    return url;
  }
  const _encode = options && options.encode || encode;
  const serializeFn = options && options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url;
}
class InterceptorManager {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h2) {
      if (h2 !== null) {
        fn(h2);
      }
    });
  }
}
const InterceptorManager$1 = InterceptorManager;
const transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};
const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
const FormData$1 = typeof FormData !== "undefined" ? FormData : null;
const Blob$1 = typeof Blob !== "undefined" ? Blob : null;
const isStandardBrowserEnv = (() => {
  let product;
  if (typeof navigator !== "undefined" && ((product = navigator.product) === "ReactNative" || product === "NativeScript" || product === "NS")) {
    return false;
  }
  return typeof window !== "undefined" && typeof document !== "undefined";
})();
const isStandardBrowserWebWorkerEnv = (() => {
  return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
  self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
})();
const platform = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob: Blob$1
  },
  isStandardBrowserEnv,
  isStandardBrowserWebWorkerEnv,
  protocols: ["http", "https", "file", "blob", "url", "data"]
};
function toURLEncodedForm(data, options) {
  return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils.isBuffer(value)) {
        this.append(key, value.toString("base64"));
        return false;
      }
      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}
function parsePropPath(name) {
  return utils.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === "[]" ? "" : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils.isArray(target) ? target.length : name;
    if (isLast) {
      if (utils.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !utils.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path, value, target[name], index);
    if (result && utils.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
    const obj = {};
    utils.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
const DEFAULT_CONTENT_TYPE = {
  "Content-Type": void 0
};
function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== "SyntaxError") {
        throw e;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
const defaults = {
  transitional: transitionalDefaults,
  adapter: ["xhr", "http"],
  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || "";
    const hasJSONContentType = contentType.indexOf("application/json") > -1;
    const isObjectPayload = utils.isObject(data);
    if (isObjectPayload && utils.isHTMLForm(data)) {
      data = new FormData(data);
    }
    const isFormData2 = utils.isFormData(data);
    if (isFormData2) {
      if (!hasJSONContentType) {
        return data;
      }
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }
    if (utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
      return data.toString();
    }
    let isFileList2;
    if (isObjectPayload) {
      if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }
      if ((isFileList2 = utils.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
        const _FormData = this.env && this.env.FormData;
        return toFormData(
          isFileList2 ? { "files[]": data } : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }
    if (isObjectPayload || hasJSONContentType) {
      headers.setContentType("application/json", false);
      return stringifySafely(data);
    }
    return data;
  }],
  transformResponse: [function transformResponse(data) {
    const transitional2 = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
    const JSONRequested = this.responseType === "json";
    if (data && utils.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
      const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === "SyntaxError") {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }
    return data;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      "Accept": "application/json, text/plain, */*"
    }
  }
};
utils.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});
utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});
const defaults$1 = defaults;
const ignoreDuplicateOf = utils.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]);
const parseHeaders = (rawHeaders) => {
  const parsed = {};
  let key;
  let val;
  let i;
  rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
    i = line.indexOf(":");
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();
    if (!key || parsed[key] && ignoreDuplicateOf[key]) {
      return;
    }
    if (key === "set-cookie") {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
    }
  });
  return parsed;
};
const $internals = Symbol("internals");
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
  const tokens = /* @__PURE__ */ Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while (match = tokensRE.exec(str)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
  if (utils.isFunction(filter2)) {
    return filter2.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils.isString(value))
    return;
  if (utils.isString(filter2)) {
    return value.indexOf(filter2) !== -1;
  }
  if (utils.isRegExp(filter2)) {
    return filter2.test(value);
  }
}
function formatHeader(header) {
  return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
    return char.toUpperCase() + str;
  });
}
function buildAccessors(obj, header) {
  const accessorName = utils.toCamelCase(" " + header);
  ["get", "set", "has"].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}
class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }
  set(header, valueOrRewrite, rewrite) {
    const self2 = this;
    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);
      if (!lHeader) {
        throw new Error("header name must be a non-empty string");
      }
      const key = utils.findKey(self2, lHeader);
      if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
        self2[key || _header] = normalizeValue(_value);
      }
    }
    const setHeaders = (headers, _rewrite) => utils.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
    if (utils.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if (utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }
    return this;
  }
  get(header, parser) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils.findKey(this, header);
      if (key) {
        const value = this[key];
        if (!parser) {
          return value;
        }
        if (parser === true) {
          return parseTokens(value);
        }
        if (utils.isFunction(parser)) {
          return parser.call(this, value, key);
        }
        if (utils.isRegExp(parser)) {
          return parser.exec(value);
        }
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(header, matcher) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils.findKey(this, header);
      return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }
    return false;
  }
  delete(header, matcher) {
    const self2 = this;
    let deleted = false;
    function deleteHeader(_header) {
      _header = normalizeHeader(_header);
      if (_header) {
        const key = utils.findKey(self2, _header);
        if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
          delete self2[key];
          deleted = true;
        }
      }
    }
    if (utils.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }
    return deleted;
  }
  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;
    while (i--) {
      const key = keys[i];
      if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }
    return deleted;
  }
  normalize(format) {
    const self2 = this;
    const headers = {};
    utils.forEach(this, (value, header) => {
      const key = utils.findKey(headers, header);
      if (key) {
        self2[key] = normalizeValue(value);
        delete self2[header];
        return;
      }
      const normalized = format ? formatHeader(header) : String(header).trim();
      if (normalized !== header) {
        delete self2[header];
      }
      self2[normalized] = normalizeValue(value);
      headers[normalized] = true;
    });
    return this;
  }
  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }
  toJSON(asStrings) {
    const obj = /* @__PURE__ */ Object.create(null);
    utils.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(", ") : value);
    });
    return obj;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }
  static concat(first, ...targets) {
    const computed2 = new this(first);
    targets.forEach((target) => computed2.set(target));
    return computed2;
  }
  static accessor(header) {
    const internals = this[$internals] = this[$internals] = {
      accessors: {}
    };
    const accessors = internals.accessors;
    const prototype2 = this.prototype;
    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);
      if (!accessors[lHeader]) {
        buildAccessors(prototype2, _header);
        accessors[lHeader] = true;
      }
    }
    utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
    return this;
  }
}
AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
utils.freezeMethods(AxiosHeaders.prototype);
utils.freezeMethods(AxiosHeaders);
const AxiosHeaders$1 = AxiosHeaders;
function transformData(fns, response) {
  const config = this || defaults$1;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;
  utils.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
  });
  headers.normalize();
  return data;
}
function isCancel(value) {
  return !!(value && value.__CANCEL__);
}
function CanceledError(message, config, request) {
  AxiosError.call(this, message == null ? "canceled" : message, AxiosError.ERR_CANCELED, config, request);
  this.name = "CanceledError";
}
utils.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});
function settle(resolve2, reject, response) {
  const validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve2(response);
  } else {
    reject(new AxiosError(
      "Request failed with status code " + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}
const cookies = platform.isStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        const cookie = [];
        cookie.push(name + "=" + encodeURIComponent(value));
        if (utils.isNumber(expires)) {
          cookie.push("expires=" + new Date(expires).toGMTString());
        }
        if (utils.isString(path)) {
          cookie.push("path=" + path);
        }
        if (utils.isString(domain)) {
          cookie.push("domain=" + domain);
        }
        if (secure === true) {
          cookie.push("secure");
        }
        document.cookie = cookie.join("; ");
      },
      read: function read(name) {
        const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove: function remove2(name) {
        this.write(name, "", Date.now() - 864e5);
      }
    };
  }()
) : (
  // Non standard browser env (web workers, react-native) lack needed support.
  function nonStandardBrowserEnv() {
    return {
      write: function write() {
      },
      read: function read() {
        return null;
      },
      remove: function remove2() {
      }
    };
  }()
);
function isAbsoluteURL(url) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}
const isURLSameOrigin = platform.isStandardBrowserEnv ? (
  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  function standardBrowserEnv2() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement("a");
    let originURL;
    function resolveURL(url) {
      let href = url;
      if (msie) {
        urlParsingNode.setAttribute("href", href);
        href = urlParsingNode.href;
      }
      urlParsingNode.setAttribute("href", href);
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
      };
    }
    originURL = resolveURL(window.location.href);
    return function isURLSameOrigin2(requestURL) {
      const parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
      return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
    };
  }()
) : (
  // Non standard browser envs (web workers, react-native) lack needed support.
  function nonStandardBrowserEnv2() {
    return function isURLSameOrigin2() {
      return true;
    };
  }()
);
function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || "";
}
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min = min !== void 0 ? min : 1e3;
  return function push(chunkLength) {
    const now = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now;
    let i = tail;
    let bytesCount = 0;
    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now - firstSampleTS < min) {
      return;
    }
    const passed = startedAt && now - startedAt;
    return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
  };
}
function progressEventReducer(listener, isDownloadStream) {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);
  return (e) => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : void 0;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data = {
      loaded,
      total,
      progress: total ? loaded / total : void 0,
      bytes: progressBytes,
      rate: rate ? rate : void 0,
      estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
      event: e
    };
    data[isDownloadStream ? "download" : "upload"] = true;
    listener(data);
  };
}
const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
const xhrAdapter = isXHRAdapterSupported && function(config) {
  return new Promise(function dispatchXhrRequest(resolve2, reject) {
    let requestData = config.data;
    const requestHeaders = AxiosHeaders$1.from(config.headers).normalize();
    const responseType = config.responseType;
    let onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }
      if (config.signal) {
        config.signal.removeEventListener("abort", onCanceled);
      }
    }
    if (utils.isFormData(requestData)) {
      if (platform.isStandardBrowserEnv || platform.isStandardBrowserWebWorkerEnv) {
        requestHeaders.setContentType(false);
      } else {
        requestHeaders.setContentType("multipart/form-data;", false);
      }
    }
    let request = new XMLHttpRequest();
    if (config.auth) {
      const username = config.auth.username || "";
      const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
      requestHeaders.set("Authorization", "Basic " + btoa(username + ":" + password));
    }
    const fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
    request.timeout = config.timeout;
    function onloadend() {
      if (!request) {
        return;
      }
      const responseHeaders = AxiosHeaders$1.from(
        "getAllResponseHeaders" in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };
      settle(function _resolve(value) {
        resolve2(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);
      request = null;
    }
    if ("onloadend" in request) {
      request.onloadend = onloadend;
    } else {
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
          return;
        }
        setTimeout(onloadend);
      };
    }
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }
      reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, config, request));
      request = null;
    };
    request.onerror = function handleError2() {
      reject(new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, request));
      request = null;
    };
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
      const transitional2 = config.transitional || transitionalDefaults;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional2.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request
      ));
      request = null;
    };
    if (platform.isStandardBrowserEnv) {
      const xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName && cookies.read(config.xsrfCookieName);
      if (xsrfValue) {
        requestHeaders.set(config.xsrfHeaderName, xsrfValue);
      }
    }
    requestData === void 0 && requestHeaders.setContentType(null);
    if ("setRequestHeader" in request) {
      utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }
    if (responseType && responseType !== "json") {
      request.responseType = config.responseType;
    }
    if (typeof config.onDownloadProgress === "function") {
      request.addEventListener("progress", progressEventReducer(config.onDownloadProgress, true));
    }
    if (typeof config.onUploadProgress === "function" && request.upload) {
      request.upload.addEventListener("progress", progressEventReducer(config.onUploadProgress));
    }
    if (config.cancelToken || config.signal) {
      onCanceled = (cancel) => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };
      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
      }
    }
    const protocol = parseProtocol(fullPath);
    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config));
      return;
    }
    request.send(requestData || null);
  });
};
const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter
};
utils.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, "name", { value });
    } catch (e) {
    }
    Object.defineProperty(fn, "adapterName", { value });
  }
});
const adapters = {
  getAdapter: (adapters2) => {
    adapters2 = utils.isArray(adapters2) ? adapters2 : [adapters2];
    const { length } = adapters2;
    let nameOrAdapter;
    let adapter;
    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters2[i];
      if (adapter = utils.isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter) {
        break;
      }
    }
    if (!adapter) {
      if (adapter === false) {
        throw new AxiosError(
          `Adapter ${nameOrAdapter} is not supported by the environment`,
          "ERR_NOT_SUPPORT"
        );
      }
      throw new Error(
        utils.hasOwnProp(knownAdapters, nameOrAdapter) ? `Adapter '${nameOrAdapter}' is not available in the build` : `Unknown adapter '${nameOrAdapter}'`
      );
    }
    if (!utils.isFunction(adapter)) {
      throw new TypeError("adapter is not a function");
    }
    return adapter;
  },
  adapters: knownAdapters
};
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
  if (config.signal && config.signal.aborted) {
    throw new CanceledError(null, config);
  }
}
function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = AxiosHeaders$1.from(config.headers);
  config.data = transformData.call(
    config,
    config.transformRequest
  );
  if (["post", "put", "patch"].indexOf(config.method) !== -1) {
    config.headers.setContentType("application/x-www-form-urlencoded", false);
  }
  const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );
    response.headers = AxiosHeaders$1.from(response.headers);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }
    return Promise.reject(reason);
  });
}
const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? thing.toJSON() : thing;
function mergeConfig(config1, config2) {
  config2 = config2 || {};
  const config = {};
  function getMergedValue(target, source, caseless) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge.call({ caseless }, target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a, b, caseless) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(void 0, a, caseless);
    }
  }
  function valueFromConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(void 0, b);
    }
  }
  function defaultToConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(void 0, b);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(void 0, a);
    }
  }
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(void 0, a);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };
  utils.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge2 = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge2(config1[prop], config2[prop], prop);
    utils.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
  });
  return config;
}
const VERSION = "1.4.0";
const validators$1 = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
  validators$1[type] = function validator2(thing) {
    return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
  };
});
const deprecatedWarnings = {};
validators$1.transitional = function transitional(validator2, version2, message) {
  function formatMessage(opt, desc) {
    return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
  }
  return (value, opt, opts) => {
    if (validator2 === false) {
      throw new AxiosError(
        formatMessage(opt, " has been removed" + (version2 ? " in " + version2 : "")),
        AxiosError.ERR_DEPRECATED
      );
    }
    if (version2 && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(
        formatMessage(
          opt,
          " has been deprecated since v" + version2 + " and will be removed in the near future"
        )
      );
    }
    return validator2 ? validator2(value, opt, opts) : true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator2 = schema[opt];
    if (validator2) {
      const value = options[opt];
      const result = value === void 0 || validator2(value, opt, options);
      if (result !== true) {
        throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}
const validator = {
  assertOptions,
  validators: validators$1
};
const validators = validator.validators;
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager$1(),
      response: new InterceptorManager$1()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  request(configOrUrl, config) {
    if (typeof configOrUrl === "string") {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    config = mergeConfig(this.defaults, config);
    const { transitional: transitional2, paramsSerializer, headers } = config;
    if (transitional2 !== void 0) {
      validator.assertOptions(transitional2, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }
    if (paramsSerializer != null) {
      if (utils.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }
    config.method = (config.method || this.defaults.method || "get").toLowerCase();
    let contextHeaders;
    contextHeaders = headers && utils.merge(
      headers.common,
      headers[config.method]
    );
    contextHeaders && utils.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (method) => {
        delete headers[method];
      }
    );
    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise;
    let i = 0;
    let len;
    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), void 0];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;
      promise = Promise.resolve(config);
      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }
      return promise;
    }
    len = requestInterceptorChain.length;
    let newConfig = config;
    i = 0;
    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    i = 0;
    len = responseInterceptorChain.length;
    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }
    return promise;
  }
  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
}
utils.forEach(["delete", "get", "head", "options"], function forEachMethodNoData2(method) {
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});
utils.forEach(["post", "put", "patch"], function forEachMethodWithData2(method) {
  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url,
        data
      }));
    };
  }
  Axios.prototype[method] = generateHTTPMethod();
  Axios.prototype[method + "Form"] = generateHTTPMethod(true);
});
const Axios$1 = Axios;
class CancelToken {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve2) {
      resolvePromise = resolve2;
    });
    const token = this;
    this.promise.then((cancel) => {
      if (!token._listeners)
        return;
      let i = token._listeners.length;
      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = (onfulfilled) => {
      let _resolve;
      const promise = new Promise((resolve2) => {
        token.subscribe(resolve2);
        _resolve = resolve2;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message, config, request) {
      if (token.reason) {
        return;
      }
      token.reason = new CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}
const CancelToken$1 = CancelToken;
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}
function isAxiosError(payload) {
  return utils.isObject(payload) && payload.isAxiosError === true;
}
const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});
const HttpStatusCode$1 = HttpStatusCode;
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context);
  utils.extend(instance, Axios$1.prototype, context, { allOwnKeys: true });
  utils.extend(instance, context, null, { allOwnKeys: true });
  instance.create = function create2(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };
  return instance;
}
const axios = createInstance(defaults$1);
axios.Axios = Axios$1;
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;
axios.AxiosError = AxiosError;
axios.Cancel = axios.CanceledError;
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;
axios.isAxiosError = isAxiosError;
axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = AxiosHeaders$1;
axios.formToJSON = (thing) => formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.HttpStatusCode = HttpStatusCode$1;
axios.default = axios;
const axios$1 = axios;
const _hoisted_1$5 = /* @__PURE__ */ createBaseVNode("div", { class: "flex" }, [
  /* @__PURE__ */ createBaseVNode("span", { class: "text-xl text-900 font-bold" }, "Missing Redcap Fields")
], -1);
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "MissingFieldsTable",
  props: {
    tableData: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const tableHeaders = [
      { "text": "Form", "value": "form" },
      { "text": "Field", "value": "field" },
      { "text": "Field Format", "value": "format" }
    ];
    const tableRows = computed(() => {
      let tablesRows = [];
      if (props.tableData != null && props.tableData.length > 0) {
        for (let index in props.tableData) {
          let row = {};
          row["form"] = props.tableData[index].form_label;
          row["field"] = props.tableData[index].label + " (" + props.tableData[index].redcap_field_name + ")";
          row["format"] = props.tableData[index].format;
          tablesRows.push(row);
        }
        return tablesRows;
      }
      return tableRows;
    });
    return (_ctx, _cache) => {
      const _component_Message = resolveComponent("Message");
      const _component_Column = resolveComponent("Column");
      const _component_DataTable = resolveComponent("DataTable");
      return openBlock(), createElementBlock("div", null, [
        createVNode(_component_DataTable, {
          value: tableRows.value,
          tableStyle: "min-width: 50rem"
        }, {
          header: withCtx(() => [
            _hoisted_1$5,
            createVNode(_component_Message, { severity: "error" }, {
              default: withCtx(() => [
                createTextVNode(" Duster configured fields are missing. Please add the following fields to this project before proceeding")
              ]),
              _: 1
            })
          ]),
          default: withCtx(() => [
            (openBlock(), createElementBlock(Fragment, null, renderList(tableHeaders, (col) => {
              return createVNode(_component_Column, {
                key: col.value,
                field: col.value,
                header: col.text
              }, null, 8, ["field", "header"]);
            }), 64))
          ]),
          _: 1
        }, 8, ["value"])
      ]);
    };
  }
});
const _hoisted_1$4 = { class: "grid" };
const _hoisted_2$3 = { class: "col-10" };
const _hoisted_3$3 = ["innerHTML"];
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "RequestDataTable",
  props: {
    title: {
      type: String,
      required: true
    },
    alertType: {
      type: String,
      required: true
    },
    alertContent: {
      type: String,
      required: true
    },
    recordBaseUrl: {
      type: String,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const alertTextStyle = computed(() => {
      if (props.alertType == "error")
        return "text-red-500";
      else if (props.alertType == "warn")
        return "text-orange-500";
      else
        return "text-primary";
    });
    const alertText = computed(() => {
      if (props.alertType == "error")
        return "ERROR: " + props.alertContent;
      else if (props.alertType == "warn")
        return "WARNING: " + props.alertContent;
      else
        return props.alertContent;
    });
    const tableHeaders = computed(() => {
      let dataObj;
      if (props.tableData != null && props.tableData[0] != null) {
        dataObj = props.tableData[0];
      } else {
        return;
      }
      let colHeaders = [
        { "text": "REDCap Record id", "value": "redcap_record_id" },
        { "text": "MRN", "value": "mrn" }
      ];
      for (let dateIndex in dataObj.dates) {
        colHeaders.push(
          {
            "text": dataObj.dates[dateIndex].redcap_field_name,
            "value": dataObj.dates[dateIndex].redcap_field_name
          }
        );
      }
      return colHeaders;
    });
    const tableRows = computed(() => {
      let tablesRows = [];
      if (props.tableData != null && props.tableData.length > 0) {
        for (let index in props.tableData) {
          let row = {};
          row["redcap_record_id"] = '<a href="' + props.recordBaseUrl + "&arm=1&id=" + props.tableData[index].redcap_record_id + '">' + props.tableData[index].redcap_record_id + "</a>";
          row["mrn"] = props.tableData[index].mrn;
          for (let dateIndex in props.tableData[index].dates) {
            row[props.tableData[index].dates[dateIndex].redcap_field_name] = props.tableData[index].dates[dateIndex].value;
          }
          tablesRows.push(row);
        }
      }
      return tablesRows;
    });
    return (_ctx, _cache) => {
      const _component_Column = resolveComponent("Column");
      const _component_DataTable = resolveComponent("DataTable");
      return openBlock(), createElementBlock("div", _hoisted_1$4, [
        createBaseVNode("div", _hoisted_2$3, [
          createBaseVNode("div", {
            class: normalizeClass("text-lg p-2 mb-1 font-italic mr-5 " + alertTextStyle.value)
          }, toDisplayString(alertText.value), 3),
          createVNode(_component_DataTable, {
            value: tableRows.value,
            paginator: "",
            rows: 10,
            rowsPerPageOptions: [10, 20, 50],
            tableStyle: "min-width: 50rem",
            class: "p-datatable-sm"
          }, {
            default: withCtx(() => [
              (openBlock(true), createElementBlock(Fragment, null, renderList(tableHeaders.value, (col) => {
                return openBlock(), createBlock(_component_Column, {
                  key: col.value,
                  field: col.value,
                  header: col.text
                }, {
                  body: withCtx(({ data, field }) => [
                    createBaseVNode("span", {
                      innerHTML: data[field]
                    }, null, 8, _hoisted_3$3)
                  ]),
                  _: 2
                }, 1032, ["field", "header"]);
              }), 128))
            ]),
            _: 1
          }, 8, ["value"])
        ])
      ]);
    };
  }
});
const _hoisted_1$3 = { class: "grid mt-3" };
const _hoisted_2$2 = { class: "col-3" };
const _hoisted_3$2 = { key: 0 };
const _hoisted_4$2 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_5$2 = { class: "col-8" };
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "RcProgressBar",
  props: {
    queries: {
      type: Object,
      required: true
    },
    dataApiUrl: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    cohortProgress: {
      type: Number,
      required: true
    }
  },
  emits: ["update:progress"],
  setup(__props, { emit: emit2 }) {
    const props = __props;
    const numComplete = ref(0);
    const updateMessage = ref();
    const localCohortProgress = computed(() => {
      return props.cohortProgress;
    });
    watch(localCohortProgress, async (updatedCohort) => {
      console.log(props.queries);
      if (updatedCohort === 100) {
        for (var i = 0; i < numQueries.value; i++) {
          updateMessage.value = queryLabel(props.queries[i].query_label) + " in progress.";
          console.log(props.dataApiUrl + "&action=getData&query=" + JSON.stringify(props.queries[i]));
          const dataSync = await axios$1.get(props.dataApiUrl + "&action=getData&query=" + JSON.stringify(props.queries[i]));
          numComplete.value++;
          emit2("update:progress", dataSync);
          if (numComplete.value === numQueries.value) {
            updateMessage.value = "Complete";
          }
        }
      }
    });
    const numQueries = computed(() => {
      var _a;
      return ((_a = props.queries) == null ? void 0 : _a.length) ?? 0;
    });
    const progress = computed(() => {
      var pctComplete = 100 * numComplete.value / numQueries.value;
      if (isNaN(pctComplete))
        pctComplete = 0;
      else if (pctComplete > 99.5) {
        pctComplete = 100;
      }
      return pctComplete;
    });
    computed(() => {
      return toTitleCase(props.name);
    });
    const toTitleCase = (str) => {
      const label2 = str.replace(/_/g, " ");
      return label2.replace(
        /\w\S*/g,
        function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
      );
    };
    const queryLabel = (str) => {
      const index = str.indexOf(":");
      const label2 = str.substr(index + 1);
      return toTitleCase(label2.trim());
    };
    return (_ctx, _cache) => {
      const _component_ProgressBar = resolveComponent("ProgressBar");
      return openBlock(), createElementBlock("div", _hoisted_1$3, [
        createBaseVNode("div", _hoisted_2$2, [
          createBaseVNode("b", null, toDisplayString(toTitleCase(__props.name)) + ": ", 1),
          updateMessage.value ? (openBlock(), createElementBlock("span", _hoisted_3$2, [
            _hoisted_4$2,
            createTextVNode(toDisplayString(updateMessage.value), 1)
          ])) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_5$2, [
          createVNode(_component_ProgressBar, {
            value: progress.value,
            height: "25"
          }, {
            default: withCtx(() => [
              createBaseVNode("strong", null, toDisplayString(Math.ceil(progress.value)) + "%", 1)
            ]),
            _: 1
          }, 8, ["value"])
        ])
      ]);
    };
  }
});
const _hoisted_1$2 = { class: "grid mt-3" };
const _hoisted_2$1 = { class: "col-3" };
const _hoisted_3$1 = { key: 0 };
const _hoisted_4$1 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_5$1 = { class: "col-8" };
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AsyncFormProgressBar",
  props: {
    formQueries: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const progress = computed(() => {
      var pctComplete = 100 * props.formQueries.num_complete / props.formQueries.num_queries;
      if (isNaN(pctComplete))
        pctComplete = 0;
      else if (pctComplete > 99.5) {
        pctComplete = 100;
      }
      return pctComplete;
    });
    const label = computed(() => {
      return toTitleCase(props.formQueries.form_name);
    });
    const message = computed(() => {
      if (props.formQueries.complete) {
        return "Complete";
      }
      return queryLabel(props.formQueries.last_message) + " in progress.";
    });
    const toTitleCase = (str) => {
      const label2 = str.replace(/_/g, " ");
      return label2.replace(
        /\w\S*/g,
        function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
      );
    };
    const queryLabel = (str) => {
      const index = str.indexOf(":");
      const label2 = str.substr(index + 1);
      return toTitleCase(label2.trim());
    };
    return (_ctx, _cache) => {
      const _component_ProgressBar = resolveComponent("ProgressBar");
      return openBlock(), createElementBlock("div", _hoisted_1$2, [
        createBaseVNode("div", _hoisted_2$1, [
          createBaseVNode("b", null, toDisplayString(label.value) + ": ", 1),
          message.value ? (openBlock(), createElementBlock("span", _hoisted_3$1, [
            _hoisted_4$1,
            createTextVNode(toDisplayString(message.value), 1)
          ])) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_5$1, [
          createVNode(_component_ProgressBar, {
            value: progress.value,
            height: "25"
          }, {
            default: withCtx(() => [
              createBaseVNode("strong", null, toDisplayString(Math.ceil(progress.value)) + "%", 1)
            ]),
            _: 1
          }, 8, ["value"])
        ])
      ]);
    };
  }
});
const _hoisted_1$1 = /* @__PURE__ */ createBaseVNode("p", { class: "m-4" }, [
  /* @__PURE__ */ createTextVNode(" We have encountered a system level error and unable to process your request. Please email us at "),
  /* @__PURE__ */ createBaseVNode("a", { href: "mailto:duster-info@lists.stanford.edu" }, "duster-info@lists.stanford.edu"),
  /* @__PURE__ */ createTextVNode(" and we will let you know when this issue is resolved. ")
], -1);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SystemErrorDialog",
  setup(__props) {
    const exitFromDuster = () => {
      window.history.go(-1);
    };
    return (_ctx, _cache) => {
      const _component_Button = resolveComponent("Button");
      const _component_Dialog = resolveComponent("Dialog");
      return openBlock(), createBlock(_component_Dialog, {
        style: { "width": "40vw", "z-index": "9999" },
        visible: "",
        header: "System Error",
        closable: false,
        modal: ""
      }, {
        footer: withCtx(() => [
          createVNode(_component_Button, {
            label: "Exit from DUSTER",
            icon: "pi pi-times",
            class: "p-button-secondary",
            onClick: exitFromDuster,
            size: "small"
          })
        ]),
        default: withCtx(() => [
          _hoisted_1$1
        ]),
        _: 1
      });
    };
  }
});
const DusterHeader_vue_vue_type_style_index_0_scoped_873ad89e_lang = "";
const _hoisted_1 = { class: "container ml-0 mr-0 pr-0 pl-0" };
const _hoisted_2 = { class: "grid" };
const _hoisted_3 = { class: "col-10" };
const _hoisted_4 = /* @__PURE__ */ createBaseVNode("div", { class: "projhdr" }, " DUSTER: Get data", -1);
const _hoisted_5 = /* @__PURE__ */ createBaseVNode("div", null, "DUSTER will perform sanity check on the existing redcap records before it submits and asks for the data.", -1);
const _hoisted_6 = /* @__PURE__ */ createBaseVNode("div", null, [
  /* @__PURE__ */ createTextVNode("You have two options on how you can get the data. "),
  /* @__PURE__ */ createBaseVNode("ul", null, [
    /* @__PURE__ */ createBaseVNode("li", null, "Run in real time -> This will launch the process is current browser and so you have to keep the browser tab open. Closing will stop the data fetching process."),
    /* @__PURE__ */ createBaseVNode("li", null, "Run in background -> This submits the job and runs in the background. Browser can be safely closed. Notification will be sent in the email when completed.")
  ])
], -1);
const _hoisted_7 = { key: 0 };
const _hoisted_8 = ["innerHTML"];
const _hoisted_9 = {
  key: 0,
  class: "text-center mt-5"
};
const _hoisted_10 = /* @__PURE__ */ createBaseVNode("i", {
  class: "pi pi-spin pi-spinner mr-3",
  style: { "font-size": "2rem", "color": "dodgerblue" }
}, null, -1);
const _hoisted_11 = { key: 1 };
const _hoisted_12 = { key: 0 };
const _hoisted_13 = { key: 1 };
const _hoisted_14 = { key: 0 };
const _hoisted_15 = /* @__PURE__ */ createBaseVNode("div", { class: "text-xl p-2 mb-1 font-italic mr-5 text-red-500" }, " ERROR: Your REDCap project contains no records. Add at least one record to your project in order to proceed. ", -1);
const _hoisted_16 = [
  _hoisted_15
];
const _hoisted_17 = { key: 1 };
const _hoisted_18 = { key: 2 };
const _hoisted_19 = { key: 1 };
const _hoisted_20 = { key: 3 };
const _hoisted_21 = ["innerHTML"];
const _hoisted_22 = {
  key: 0,
  class: "text-center"
};
const _hoisted_23 = { class: "grid" };
const _hoisted_24 = { class: "col-3" };
const _hoisted_25 = /* @__PURE__ */ createBaseVNode("b", null, "Cohort:", -1);
const _hoisted_26 = { key: 0 };
const _hoisted_27 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_28 = { class: "col-8" };
const _hoisted_29 = { key: 1 };
const _hoisted_30 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_31 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_32 = /* @__PURE__ */ createBaseVNode("p", null, " Enter an email address to get notifications when data request is complete. ", -1);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "App",
  setup(__props) {
    const projectConfig = JSON.parse(localStorage.getItem("getDataObj") || "{}");
    console.log("getDataObj " + localStorage.getItem("getDataObj"));
    localStorage.removeItem("getDataObj");
    ref(false);
    const systemError = ref(false);
    ref(projectConfig.project_id);
    ref(projectConfig.server_name);
    const record_base_url = ref(projectConfig.record_base_url);
    const designer_url = ref(projectConfig.designer_url);
    const data_exports_url = ref(projectConfig.data_exports_url);
    const project_setup_url = ref(projectConfig.project_setup_url);
    const get_data_url = ref(projectConfig.get_data_api);
    const step = ref(0);
    const errorMessage = ref();
    const saveMessage = ref("Saving ...");
    const cohortMessage = ref("Cohort sync in progress.");
    const previousRequestStatus = ref();
    const startLoad = ref(false);
    const isProduction = ref(false);
    const isLoading = ref(false);
    const isLoaded = ref(false);
    const confirmCancel = ref(false);
    const cohortProgress = ref(0);
    const totalProgress = ref(0);
    const saveSize = ref(0);
    const numQueries = ref(0);
    const dusterData = ref();
    const cwQueries = ref();
    const isAsyncRequest = ref(false);
    const asyncPollInterval = ref(20);
    const asyncPollLimit = ref(100);
    const showAsyncNotify = ref(false);
    const showSync = ref(false);
    const email = ref(projectConfig.user_email);
    onMounted(async () => {
      {
        isProduction.value = true;
      }
    });
    watch(isProduction, async (prodStatus) => {
      if (prodStatus) {
        isLoading.value = true;
        const response = await axios$1.get(get_data_url.value + "&action=dataRequestStatus").catch(function(error) {
          systemError.value = true;
          errorMessage.value += error.message + "<br>";
        });
        if (!hasError(response)) {
          console.log(response);
          if ((response == null ? void 0 : response.data.dataRequestStatus) === "sync") {
            isLoading.value = false;
            errorMessage.value = "<p>Real time Data Request initiated by " + (response == null ? void 0 : response.data.redcapUserName) + " already in progress.  Please wait for this request to complete before submitting a new data request.";
          } else if ((response == null ? void 0 : response.data.dataRequestStatus) === "async") {
            console.log("dataRequestStatus async");
            isLoading.value = false;
            isLoaded.value = true;
            isAsyncRequest.value = true;
            step.value = 4;
            saveMessage.value = "<p>Background Data Request initiated by " + (response == null ? void 0 : response.data.redcapUserName) + " already in progress.</p><p>This view will update status every " + asyncPollInterval.value + " seconds.</p>";
            asyncPollStatus();
          } else {
            if ((response == null ? void 0 : response.data.dataRequestStatus) && (response == null ? void 0 : response.data.dataRequestStatus) !== "no status") {
              let date = new Date(Date.parse("2012-01-26T13:51:50.417-07:00"));
              previousRequestStatus.value = "Previous request status: " + (response == null ? void 0 : response.data.dataRequestStatus) + " at " + date.toLocaleString("en-us");
            }
            startLoad.value = true;
          }
        }
      }
    });
    watch(startLoad, async (start) => {
      if (start) {
        console.log(get_data_url.value + "&action=cohort");
        axios$1.get(get_data_url.value + "&action=cohort").then((response) => {
          console.log(response);
          isLoading.value = false;
          isLoaded.value = true;
          if (!hasError(response)) {
            dusterData.value = response.data;
            console.log(response.data);
            cwQueries.value = response.data.queries;
            numQueries.value = response.data.num_queries + 1;
            saveSize.value = 100 / numQueries.value;
            if (dusterData.value.missing_fields && dusterData.value.missing_fields.length > 0) {
              step.value = 1;
            } else if (!dusterData.value.rp_data || dusterData.value.missing_data != null && dusterData.value.missing_data.length > 0) {
              step.value = 2;
            } else {
              step.value = 3;
            }
          }
        }).catch(function(error) {
          errorMessage.value += error.message + "<br>";
          systemError.value = true;
        });
      }
    });
    const goToUrl = (url) => {
      window.location = url;
    };
    const hasError = (response) => {
      if (response.status !== 200) {
        errorMessage.value = response.message;
        return true;
      } else if (response.data.status && response.data.status !== 200) {
        errorMessage.value += response.data.message + "<br>";
        return true;
      } else {
        const data_str = JSON.stringify(response.data).toLowerCase();
        if (data_str.indexOf("error message") !== -1 || data_str.indexOf("syntax error") !== -1 || data_str.indexOf("fatal error") !== -1) {
          errorMessage.value += data_str;
          return true;
        }
      }
      return false;
    };
    const toTitleCase = (str) => {
      str = str.replace(/_/g, " ");
      return str.replace(
        /\w\S*/g,
        function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
      );
    };
    const cancel = () => {
      axios$1.get(get_data_url.value + "&action=logStatus&status=cancel");
      goToUrl(record_base_url.value);
    };
    const syncCohort = async () => {
      step.value = 4;
      showSync.value = false;
      try {
        const cohortSync = await axios$1.get(get_data_url.value + "&action=syncCohort");
        cohortProgress.value = 100;
        totalProgress.value = saveSize.value;
        if (!hasError(cohortSync)) {
          saveMessage.value = "Cohort sync complete.";
          cohortMessage.value = "Complete";
        }
      } catch (error) {
        errorMessage.value += error.message + "<br>";
        systemError.value = true;
      }
    };
    const updateProgress = (dataSync) => {
      totalProgress.value += saveSize.value;
      console.log("totalProgress " + totalProgress.value);
      if (totalProgress.value > 99.5) {
        totalProgress.value = 100;
      }
      if (!hasError(dataSync)) {
        if (totalProgress.value === 100) {
          saveMessage.value = "Data save complete";
          axios$1.get(get_data_url.value + "&action=logStatus&status=complete");
        } else {
          saveMessage.value = toTitleCase(dataSync.data.message);
        }
      }
    };
    const asyncRequestData = async () => {
      isAsyncRequest.value = true;
      showAsyncNotify.value = false;
      step.value = 4;
      const emailParam = email.value ? "&email=" + email.value : "";
      axios$1.get(get_data_url.value + "&action=asyncDataRequest" + emailParam);
      saveMessage.value = "<p>Background Data request submitted.  An email will be sent to " + email.value + " when it is completed.</p><p>This view will update status every " + asyncPollInterval.value + " seconds.</p>";
      await sleep(asyncPollInterval.value * 1e3);
      asyncPollStatus();
    };
    const sleep = async (milliseconds) => {
      console.log("start sleep");
      await new Promise((resolve2) => {
        return setTimeout(resolve2, milliseconds);
      });
    };
    const dataRequestLog = ref();
    const asyncPollStatus = async () => {
      let complete = false;
      let count = 0;
      while (!complete) {
        count++;
        const response = await axios$1.get(get_data_url.value + "&action=asyncDataLog").catch(function(error) {
          complete = true;
          errorMessage.value += error.message + "<br>";
          systemError.value = true;
        });
        if (response == null ? void 0 : response.data) {
          dataRequestLog.value = response.data.data_request_log;
          console.log("count " + count);
          console.log(response);
          if (dataRequestLog.value) {
            for (const formName in dataRequestLog.value) {
              if (!dataRequestLog.value[formName].complete)
                ;
            }
            complete = response.data.num_queries > 0 && response.data.num_queries == response.data.num_complete;
            totalProgress.value = 100 * response.data.num_complete / response.data.num_queries;
          }
          if (count > asyncPollLimit.value) {
            console.log("Hit async poll limit.");
            complete = true;
          }
          if (!complete) {
            console.log("not complete. sleep " + asyncPollInterval.value + " seconds");
            await sleep(asyncPollInterval.value * 1e3);
            console.log("stop sleep");
          }
        }
      }
      saveMessage.value = "Data Request Complete.";
      console.log("async complete");
    };
    return (_ctx, _cache) => {
      const _component_Message = resolveComponent("Message");
      const _component_Button = resolveComponent("Button");
      const _component_ProgressBar = resolveComponent("ProgressBar");
      const _component_Dialog = resolveComponent("Dialog");
      const _component_Divider = resolveComponent("Divider");
      const _component_Card = resolveComponent("Card");
      const _component_InputText = resolveComponent("InputText");
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", _hoisted_1, [
          createBaseVNode("div", _hoisted_2, [
            createBaseVNode("div", _hoisted_3, [
              _hoisted_4,
              _hoisted_5,
              _hoisted_6,
              errorMessage.value ? (openBlock(), createElementBlock("div", _hoisted_7, [
                createVNode(_component_Message, { severity: "error" }, {
                  default: withCtx(() => [
                    createBaseVNode("span", { innerHTML: errorMessage.value }, null, 8, _hoisted_8)
                  ]),
                  _: 1
                }),
                !isProduction.value ? (openBlock(), createBlock(_component_Button, {
                  key: 0,
                  class: "p-button-primary",
                  size: "small",
                  icon: "pi pi-cog",
                  label: "Project Setup",
                  onClick: _cache[0] || (_cache[0] = ($event) => goToUrl(project_setup_url.value))
                })) : createCommentVNode("", true)
              ])) : createCommentVNode("", true),
              createBaseVNode("div", null, [
                isLoading.value && !isLoaded.value ? (openBlock(), createElementBlock("p", _hoisted_9, [
                  _hoisted_10,
                  createTextVNode(" Loading... ")
                ])) : createCommentVNode("", true),
                isLoaded.value ? (openBlock(), createElementBlock("div", _hoisted_11, [
                  step.value == 1 && dusterData.value.missing_fields ? (openBlock(), createElementBlock("div", _hoisted_12, [
                    createBaseVNode("div", null, [
                      createVNode(_sfc_main$5, {
                        "table-data": dusterData.value.missing_fields
                      }, null, 8, ["table-data"])
                    ]),
                    createBaseVNode("div", null, [
                      createVNode(_component_Button, {
                        class: "p-button-primary",
                        size: "small",
                        icon: "pi pi-cog",
                        label: "Project Setup",
                        onClick: _cache[1] || (_cache[1] = ($event) => goToUrl(designer_url.value))
                      })
                    ])
                  ])) : createCommentVNode("", true),
                  step.value == 2 ? (openBlock(), createElementBlock("div", _hoisted_13, [
                    createBaseVNode("div", null, [
                      !dusterData.value.missing_data && !dusterData.value.rp_data ? (openBlock(), createElementBlock("div", _hoisted_14, _hoisted_16)) : dusterData.value.missing_data ? (openBlock(), createElementBlock("div", _hoisted_17, [
                        createVNode(_sfc_main$4, {
                          title: "Missing Researcher-Provided Information",
                          "alert-type": "warn",
                          "alert-content": "The following records are missing required researcher provided data.  You may still continue, but DUSTER may not be able to retrieve all possible data for these records.",
                          "record-base-url": record_base_url.value,
                          "table-data": dusterData.value.missing_data
                        }, null, 8, ["record-base-url", "table-data"])
                      ])) : createCommentVNode("", true),
                      createBaseVNode("div", null, [
                        dusterData.value.rp_data ? (openBlock(), createBlock(_component_Button, {
                          key: 0,
                          label: "Continue",
                          class: "p-button-primary",
                          size: "small",
                          icon: "pi pi-caret-right",
                          onClick: _cache[2] || (_cache[2] = ($event) => step.value = 3)
                        })) : createCommentVNode("", true)
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  step.value == 3 ? (openBlock(), createElementBlock("div", _hoisted_18, [
                    previousRequestStatus.value ? (openBlock(), createBlock(_component_Message, {
                      key: 0,
                      severity: "info"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(previousRequestStatus.value), 1)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    dusterData.value.rp_data ? (openBlock(), createElementBlock("div", _hoisted_19, [
                      createBaseVNode("div", null, [
                        createVNode(_sfc_main$4, {
                          title: "Data Records",
                          "alert-type": "info",
                          "alert-content": "DUSTER will attempt to get data for the following records:",
                          "record-base-url": record_base_url.value,
                          "table-data": dusterData.value.rp_data
                        }, null, 8, ["record-base-url", "table-data"])
                      ]),
                      createBaseVNode("div", null, [
                        createVNode(_component_Button, {
                          class: "p-button-primary",
                          size: "small",
                          icon: "pi pi-caret-right",
                          label: "Run in real time",
                          onClick: _cache[3] || (_cache[3] = ($event) => showSync.value = true)
                        }),
                        createVNode(_component_Button, {
                          class: "mx-2 p-button-primary",
                          size: "small",
                          icon: "pi pi-forward",
                          label: "Run in background",
                          onClick: _cache[4] || (_cache[4] = ($event) => showAsyncNotify.value = true)
                        })
                      ])
                    ])) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true),
                  step.value == 4 ? (openBlock(), createElementBlock("div", _hoisted_20, [
                    createBaseVNode("p", null, [
                      createBaseVNode("strong", null, [
                        createBaseVNode("span", { innerHTML: saveMessage.value }, null, 8, _hoisted_21)
                      ])
                    ]),
                    !isAsyncRequest.value && dusterData.value.rp_data ? (openBlock(), createElementBlock("div", _hoisted_22, [
                      createBaseVNode("div", _hoisted_23, [
                        createBaseVNode("div", _hoisted_24, [
                          _hoisted_25,
                          cohortMessage.value ? (openBlock(), createElementBlock("span", _hoisted_26, [
                            _hoisted_27,
                            createTextVNode(toDisplayString(cohortMessage.value), 1)
                          ])) : createCommentVNode("", true)
                        ]),
                        createBaseVNode("div", _hoisted_28, [
                          createVNode(_component_ProgressBar, {
                            value: cohortProgress.value,
                            height: "25"
                          }, {
                            default: withCtx(() => [
                              createBaseVNode("strong", null, toDisplayString(cohortProgress.value) + "%", 1)
                            ]),
                            _: 1
                          }, 8, ["value"])
                        ])
                      ]),
                      (openBlock(true), createElementBlock(Fragment, null, renderList(cwQueries.value, (value, key) => {
                        return openBlock(), createBlock(_sfc_main$3, {
                          key,
                          "onUpdate:progress": updateProgress,
                          queries: value,
                          name: key,
                          "cohort-progress": cohortProgress.value,
                          "data-api-url": get_data_url.value
                        }, null, 8, ["queries", "name", "cohort-progress", "data-api-url"]);
                      }), 128))
                    ])) : isAsyncRequest.value && dataRequestLog.value != null ? (openBlock(), createElementBlock("div", _hoisted_29, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(dataRequestLog.value, (value, key) => {
                        return openBlock(), createBlock(_sfc_main$2, {
                          key,
                          "form-queries": value
                        }, null, 8, ["form-queries"]);
                      }), 128))
                    ])) : createCommentVNode("", true),
                    createVNode(_component_Dialog, {
                      visible: confirmCancel.value,
                      "onUpdate:visible": _cache[7] || (_cache[7] = ($event) => confirmCancel.value = $event),
                      "max-width": "500px",
                      modal: "",
                      header: "Cancel"
                    }, {
                      footer: withCtx(() => [
                        createVNode(_component_Button, {
                          class: "p-button-primary",
                          size: "small",
                          icon: "pi pi-check",
                          label: "No, Continue",
                          onClick: _cache[5] || (_cache[5] = ($event) => confirmCancel.value = false)
                        }),
                        createVNode(_component_Button, {
                          class: "ml-2 p-button-danger",
                          size: "small",
                          icon: "pi pi-times",
                          label: "Yes, Cancel",
                          outlined: "",
                          onClick: _cache[6] || (_cache[6] = ($event) => cancel())
                        })
                      ]),
                      default: withCtx(() => [
                        createVNode(_component_Message, {
                          severity: "warn",
                          closable: false
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Are you sure you want to exit data retrieval? "),
                            _hoisted_30,
                            createTextVNode(" Data that has already been saved to REDCap will not be deleted. ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["visible"]),
                    createVNode(_component_Divider),
                    isAsyncRequest.value ? (openBlock(), createBlock(_component_Button, {
                      key: 2,
                      label: "Project Home",
                      class: "p-button-primary mr-2",
                      size: "small",
                      icon: "pi pi-home",
                      onClick: _cache[8] || (_cache[8] = ($event) => goToUrl(project_setup_url.value))
                    })) : createCommentVNode("", true),
                    totalProgress.value < 100 ? (openBlock(), createBlock(_component_Button, {
                      key: 3,
                      class: "p-button-secondary",
                      size: "small",
                      icon: "pi pi-times",
                      label: "Cancel Data Request",
                      onClick: _cache[9] || (_cache[9] = ($event) => confirmCancel.value = true)
                    })) : (openBlock(), createBlock(_component_Button, {
                      key: 4,
                      label: "Export Data Page",
                      class: "p-button-primary",
                      size: "small",
                      icon: "pi pi-download",
                      onClick: _cache[10] || (_cache[10] = ($event) => goToUrl(data_exports_url.value))
                    }))
                  ])) : createCommentVNode("", true),
                  createVNode(_component_Dialog, {
                    visible: showSync.value,
                    "onUpdate:visible": _cache[13] || (_cache[13] = ($event) => showSync.value = $event),
                    "max-width": "500px",
                    modal: "",
                    style: { width: "40vw" },
                    header: "Run in real time"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_Card, null, {
                        content: withCtx(() => [
                          createVNode(_component_Message, {
                            severity: "warn",
                            closable: false
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" This will launch the DUSTER process to get the data and populate the REDCap project in real time. Please keep the current browser tab open till the processing completes. If you close the current browser tab, it will stop processing and project will be left in inconsistent state. "),
                              _hoisted_31,
                              createTextVNode(" Are you sure to launch the process in real time? ")
                            ]),
                            _: 1
                          })
                        ]),
                        footer: withCtx(() => [
                          createVNode(_component_Button, {
                            class: "p-button-primary",
                            size: "small",
                            icon: "pi pi-check",
                            label: "Yes, Launch",
                            onClick: _cache[11] || (_cache[11] = ($event) => syncCohort())
                          }),
                          createVNode(_component_Button, {
                            class: "ml-2 p-button-secondary",
                            size: "small",
                            icon: "pi pi-times",
                            label: "No, Cancel",
                            onClick: _cache[12] || (_cache[12] = ($event) => showSync.value = false)
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["visible"]),
                  createVNode(_component_Dialog, {
                    visible: showAsyncNotify.value,
                    "onUpdate:visible": _cache[17] || (_cache[17] = ($event) => showAsyncNotify.value = $event),
                    "max-width": "500px",
                    header: "Run in Background"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_Card, null, {
                        content: withCtx(() => [
                          _hoisted_32,
                          createVNode(_component_InputText, {
                            modelValue: email.value,
                            "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => email.value = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        footer: withCtx(() => [
                          createVNode(_component_Button, {
                            class: "p-button-primary",
                            size: "small",
                            icon: "pi pi-check",
                            label: "Submit",
                            onClick: _cache[15] || (_cache[15] = ($event) => asyncRequestData())
                          }),
                          createVNode(_component_Button, {
                            class: "ml-2 p-button-secondary",
                            size: "small",
                            icon: "pi pi-times",
                            label: "Cancel",
                            onClick: _cache[16] || (_cache[16] = ($event) => showAsyncNotify.value = false)
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["visible"])
                ])) : createCommentVNode("", true)
              ])
            ])
          ])
        ]),
        systemError.value ? (openBlock(), createBlock(_sfc_main$1, { key: 0 })) : createCommentVNode("", true)
      ], 64);
    };
  }
});
const primeflex = "";
const theme = "";
const primevue_min = "";
const primeicons = "";
createApp(_sfc_main).use(PrimeVue).component("Button", script$H).component("Card", script$G).component("Column", script$F).component("DataTable", script$d).component("Dialog", script$a).component("InputText", script$t).component("Message", script$6).component("InlineMessage", script$5).component("Panel", script$3).component("ProgressBar", script$2).component("ProgressSpinner", script$1).component("Toolbar", script).mount("#app");
