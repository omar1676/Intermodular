/* Cuenta: validaciones y contrasenas */

require("./entorno.js").cargar([
  "datos-demo.js",
  "zapatilla-svg.js",
  "api.js",
  "carro.js",
  "cuenta.js"
]);

let fallos = 0;
function ok(n, c, d) {
  console.log((c ? "  OK    " : "  FALLO ") + n + (d !== undefined ? "  -> " + d : ""));
  if (!c) fallos++;
}

function rellenar(id, valor) { document.getElementById(id).value = valor; }
function error(id) { return document.getElementById("error-" + id).textContent || ""; }

console.log("\n=== VALIDACION DE ENTRAR ===");

rellenar("entrar-email", "");
rellenar("entrar-clave", "");
ok("rechaza el formulario vacio", validarEntrar() === false);
ok("pide el correo", error("entrar-email").includes("Escribe tu correo"), error("entrar-email"));
ok("pide la contrasena", error("entrar-clave").includes("Escribe tu contraseña"), error("entrar-clave"));

rellenar("entrar-email", "esto-no-es-un-correo");
rellenar("entrar-clave", "algo");
ok("rechaza un correo mal escrito", validarEntrar() === false);
ok("explica el formato del correo", error("entrar-email").includes("formato"), error("entrar-email"));

rellenar("entrar-email", "omar@ejemplo.com");
rellenar("entrar-clave", "miClave1");
ok("acepta datos correctos", validarEntrar() === true);
ok("ya no quedan errores", error("entrar-email") === "" && error("entrar-clave") === "");

console.log("\n=== VALIDACION DE CREAR CUENTA ===");

rellenar("alta-nombre", "O");
rellenar("alta-email", "mal");
rellenar("alta-clave", "corta");
rellenar("alta-repetir", "otra");
ok("rechaza todo lo que esta mal", validarRegistro() === false);
ok("nombre demasiado corto", error("alta-nombre").includes("nombre completo"), error("alta-nombre"));
ok("correo invalido", error("alta-email").includes("formato"));
ok("contrasena corta", error("alta-clave").includes("ocho caracteres"), error("alta-clave"));
ok("las contrasenas no coinciden", error("alta-repetir").includes("no coinciden"));

rellenar("alta-nombre", "Omar El Yamani");
rellenar("alta-email", "omar@ejemplo.com");
rellenar("alta-clave", "solosonletras");
rellenar("alta-repetir", "solosonletras");
ok("exige mezclar letras y numeros", validarRegistro() === false);
ok("lo explica", error("alta-clave").includes("letra y un número"), error("alta-clave"));

rellenar("alta-clave", "12345678");
rellenar("alta-repetir", "12345678");
ok("tampoco acepta solo numeros", validarRegistro() === false);

rellenar("alta-clave", "NovaSneakers2026");
rellenar("alta-repetir", "NovaSneakers2026");
ok("acepta una contrasena correcta", validarRegistro() === true);
ok("sin errores pendientes", error("alta-clave") === "" && error("alta-repetir") === "");

console.log("\n=== SEGURIDAD: NO SE GUARDA NADA ===");

// Simulamos el envio del formulario
vaciarClaves({
  querySelectorAll() {
    return [document.getElementById("alta-clave"), document.getElementById("alta-repetir")];
  }
});

ok("al enviar se vacian las contrasenas",
  document.getElementById("alta-clave").value === "" &&
  document.getElementById("alta-repetir").value === "");

const todoElAlmacen = JSON.stringify(Array.from(__almacen.entries()));
ok("no hay ninguna contrasena en localStorage", !todoElAlmacen.includes("NovaSneakers2026"), todoElAlmacen || "(vacio)");
ok("no hay ninguna clave de sesion ni de usuario", !/sesion|usuario|token|rol|login/i.test(todoElAlmacen));

console.log("\n" + (fallos === 0 ? "TODAS LAS PRUEBAS CORRECTAS" : fallos + " PRUEBAS FALLIDAS"));
process.exit(fallos ? 1 : 0);
