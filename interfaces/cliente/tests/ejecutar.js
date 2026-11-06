/* Ejecuta las seis pruebas de golpe y suma el resultado */

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Las pruebas son los archivos que empiezan por dos digitos
const archivos = fs.readdirSync(__dirname).filter(function (nombre) {
  return /^\d\d-.+\.js$/.test(nombre);
}).sort();

let correctas = 0;
let fallidas = 0;

archivos.forEach(function (archivo) {
  const resultado = spawnSync(process.execPath, [path.join(__dirname, archivo)], { encoding: "utf8" });
  const salida = (resultado.stdout || "") + (resultado.stderr || "");

  const ok = (salida.match(/^\s+OK/gm) || []).length;
  const mal = (salida.match(/^\s+FALLO/gm) || []).length;

  correctas += ok;
  fallidas += mal;

  const bien = mal === 0 && resultado.status === 0;
  console.log((bien ? "  OK    " : "  FALLO ") + archivo + "  ->  " + ok + " comprobaciones" +
    (mal > 0 ? ", " + mal + " fallidas" : ""));

  // Si algo falla, se enseña la salida entera para poder mirarla
  if (!bien) {
    console.log(salida);
  }
});

console.log("\n" + correctas + " comprobaciones en " + archivos.length + " archivos, " +
  fallidas + " fallidas");

process.exit(fallidas === 0 ? 0 : 1);
