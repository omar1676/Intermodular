/*
 * NOVA Sneakers - Entrar y crear cuenta
 *
 * ESTO ES SOLO LA INTERFAZ. No hay autenticación de ninguna clase:
 *
 *  - No se envía nada a ningún servidor, porque no hay servidor.
 *  - No se guarda ninguna contraseña en ningún sitio. Ni en localStorage,
 *    ni en sessionStorage, ni en una cookie. En cuanto se envía el
 *    formulario, los campos de contraseña se vacían.
 *  - No se crea ninguna sesión ni ningún "usuario conectado" falso.
 *
 * Lo único real que hay aquí es la validación de los datos que se
 * escriben, que es trabajo de frontend y sí tiene sentido mostrar.
 */

// Comprobación de correo sencilla: algo, arroba, algo, punto, algo
const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ===== Pestañas ===== */

function cambiarPestana(cual) {
  const pestanas = document.querySelectorAll(".cli-pestana");
  const formularios = document.querySelectorAll(".cli-formulario");

  pestanas.forEach(function (p) {
    const activa = p.dataset.pestana === cual;
    p.classList.toggle("cli-activo", activa);
    p.setAttribute("aria-selected", activa);
  });

  formularios.forEach(function (f) {
    f.hidden = f.dataset.formulario !== cual;
  });

  // Al cambiar de pestaña se limpia el mensaje anterior
  document.getElementById("cli-resultado").innerHTML = "";
}

/* ===== Validación ===== */

// Escribe (o borra) el mensaje de error de un campo
function marcarError(campo, mensaje) {
  const hueco = document.getElementById("error-" + campo.id);

  if (hueco) {
    hueco.textContent = mensaje || "";
  }

  if (mensaje) {
    campo.setAttribute("aria-invalid", "true");
  } else {
    campo.removeAttribute("aria-invalid");
  }

  return !mensaje;
}

function validarEntrar() {
  const email = document.getElementById("entrar-email");
  const clave = document.getElementById("entrar-clave");

  let correcto = true;

  if (email.value.trim() === "") {
    correcto = marcarError(email, "Escribe tu correo.") && correcto;
  } else if (!PATRON_EMAIL.test(email.value.trim())) {
    correcto = marcarError(email, "Este correo no tiene un formato válido.") && correcto;
  } else {
    marcarError(email, "");
  }

  if (clave.value === "") {
    correcto = marcarError(clave, "Escribe tu contraseña.") && correcto;
  } else {
    marcarError(clave, "");
  }

  return correcto;
}

function validarRegistro() {
  const nombre = document.getElementById("alta-nombre");
  const email = document.getElementById("alta-email");
  const clave = document.getElementById("alta-clave");
  const repetir = document.getElementById("alta-repetir");

  let correcto = true;

  if (nombre.value.trim().length < 2) {
    correcto = marcarError(nombre, "Escribe tu nombre completo.") && correcto;
  } else {
    marcarError(nombre, "");
  }

  if (!PATRON_EMAIL.test(email.value.trim())) {
    correcto = marcarError(email, "Este correo no tiene un formato válido.") && correcto;
  } else {
    marcarError(email, "");
  }

  // Mínimo ocho caracteres, con al menos una letra y un número
  const tieneLetra = /[a-zA-ZáéíóúñÁÉÍÓÚÑ]/.test(clave.value);
  const tieneNumero = /[0-9]/.test(clave.value);

  if (clave.value.length < 8) {
    correcto = marcarError(clave, "La contraseña necesita ocho caracteres como mínimo.") && correcto;
  } else if (!tieneLetra || !tieneNumero) {
    correcto = marcarError(clave, "Mezcla al menos una letra y un número.") && correcto;
  } else {
    marcarError(clave, "");
  }

  if (repetir.value !== clave.value) {
    correcto = marcarError(repetir, "Las dos contraseñas no coinciden.") && correcto;
  } else {
    marcarError(repetir, "");
  }

  return correcto;
}

/* ===== Envío (que no envía nada) ===== */

function vaciarClaves(formulario) {
  formulario.querySelectorAll('input[type="password"]').forEach(function (campo) {
    campo.value = "";
  });
}

function mensajeDemo(titulo, detalle) {
  document.getElementById("cli-resultado").innerHTML =
    "<strong>" + titulo + "</strong><br>" + detalle;
}

function activarEventos() {
  // Pestañas
  document.querySelector(".cli-pestanas").addEventListener("click", function (evento) {
    const pestana = evento.target.closest(".cli-pestana");

    if (pestana) {
      cambiarPestana(pestana.dataset.pestana);
    }
  });

  // Entrar
  const formEntrar = document.getElementById("cli-form-entrar");

  formEntrar.addEventListener("submit", function (evento) {
    // Nada sale de esta página
    evento.preventDefault();

    if (!validarEntrar()) {
      return;
    }

    const email = document.getElementById("entrar-email").value.trim();

    mensajeDemo(
      "Pantalla de demostración: no se ha iniciado ninguna sesión.",
      "Los datos escritos para " + textoSeguro(email) + " se han validado " +
      "en el navegador y se han descartado. Esta web no tiene servidor, " +
      "no comprueba contraseñas y no guarda ninguna cuenta."
    );

    vaciarClaves(formEntrar);
  });

  // Crear cuenta
  const formAlta = document.getElementById("cli-form-alta");

  formAlta.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (!validarRegistro()) {
      return;
    }

    const nombre = document.getElementById("alta-nombre").value.trim();

    mensajeDemo(
      "Pantalla de demostración: no se ha creado ninguna cuenta.",
      "El formulario de " + textoSeguro(nombre) + " cumple todas las " +
      "validaciones, pero no se envía a ningún sitio y la contraseña no " +
      "se guarda en ninguna parte."
    );

    vaciarClaves(formAlta);
  });

  // Al reescribir un campo marcado en rojo, se le quita el error
  document.querySelectorAll(".cli-campo input").forEach(function (campo) {
    campo.addEventListener("input", function () {
      if (campo.hasAttribute("aria-invalid")) {
        marcarError(campo, "");
      }
    });
  });
}

cambiarPestana("entrar");
activarEventos();
