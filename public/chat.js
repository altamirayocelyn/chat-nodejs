const socket = io();

const mensajes = document.getElementById("mensajes");
const formulario = document.getElementById("formulario");
const entrada = document.getElementById("entrada");
const usuarios = document.getElementById("usuarios");

// Pedir nombre al entrar
let nombre = prompt("¿Cómo te llamas?") || "Anónimo";
nombre = nombre.trim().slice(0, 20) || "Anónimo";
socket.emit("entrar", nombre);

function agregar(li) {
  mensajes.append(li);
  mensajes.scrollTop = mensajes.scrollHeight;
}

// Enviar mensaje
formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  if (entrada.value.trim()) {
    socket.emit("mensaje", entrada.value);
    entrada.value = "";
  }
});

// Recibir mensaje de cualquier cliente
socket.on("mensaje", (m) => {
  const li = document.createElement("li");
  li.className = m.nombre === nombre ? "mio" : "otro";

  const autor = document.createElement("strong");
  autor.textContent = m.nombre;
  const hora = document.createElement("small");
  hora.textContent = " " + m.hora;
  const texto = document.createElement("p");
  texto.textContent = m.texto; // textContent evita inyección de HTML

  li.append(autor, hora, texto);
  agregar(li);
});

// Avisos de entrada y salida
socket.on("aviso", (texto) => {
  const li = document.createElement("li");
  li.className = "aviso";
  li.textContent = texto;
  agregar(li);
});

socket.on("usuarios", (n) => {
  usuarios.textContent = n + (n === 1 ? " conectado" : " conectados");
});
