/*
 * DOM y localStorage simulados, lo justo para poder ejecutar el JS de la
 * web fuera del navegador y comprobar su comportamiento.
 */
const nodos = {};

function crearNodo(id) {
  return {
    id: id,
    _html: "",
    _texto: "",
    hidden: false,
    disabled: false,
    value: "",
    dataset: {},
    // Lo justo para poder comprobar lo que el visor escribe en transform
    style: {},
    get innerHTML() { return this._html; },
    set innerHTML(v) { this._html = String(v); this._texto = ""; },
    get textContent() { return this._texto || this._html; },
    set textContent(v) { this._texto = String(v); this._html = ""; },
    className: "",
    classList: {
      _c: new Set(),
      add(c) { this._c.add(c); },
      remove(c) { this._c.delete(c); },
      contains(c) { return this._c.has(c); },
      toggle(c, on) { if (on) this._c.add(c); else this._c.delete(c); }
    },
    addEventListener() {},
    setAttribute() {},
    removeAttribute() {},
    hasAttribute() { return false; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    closest() { return null; },
    getBoundingClientRect() { return { left: 0, top: 0, width: 0, height: 0 }; },
    setPointerCapture() {}
  };
}

function nodo(id) {
  if (!nodos[id]) nodos[id] = crearNodo(id);
  return nodos[id];
}

global.__nodos = nodos;

global.document = {
  getElementById: nodo,
  querySelector(sel) { return nodo("sel:" + sel); },
  querySelectorAll() { return []; },
  addEventListener() {},
  body: { classList: { add() {}, remove() {} } },
  title: ""
};

global.window = {
  location: { search: "", href: "" },
  addEventListener() {},
  confirm() { return true; },
  history: { replaceState() {} }
};

// localStorage simulado
const almacen = new Map();
global.localStorage = {
  getItem(k) { return almacen.has(k) ? almacen.get(k) : null; },
  setItem(k, v) { almacen.set(k, String(v)); },
  removeItem(k) { almacen.delete(k); },
  clear() { almacen.clear(); }
};

global.__almacen = almacen;
global.URLSearchParams = URLSearchParams;

/* Carga los archivos reales de ../js/, en el mismo orden que los <script> de la pagina */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function cargar(archivos) {
  archivos.forEach(function (nombre) {
    const ruta = path.join(__dirname, "..", "js", nombre);
    vm.runInThisContext(fs.readFileSync(ruta, "utf8"), { filename: ruta });
  });
}

module.exports = { cargar: cargar };
