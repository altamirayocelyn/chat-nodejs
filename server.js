const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Sirve los archivos de la carpeta "public"
app.use(express.static("public"));

io.on("connection", (socket) => {
  // Un cliente nuevo dice su nombre
  socket.on("entrar", (nombre) => {
    socket.nombre = String(nombre).trim().slice(0, 20) || "Anónimo";
    io.emit("aviso", `${socket.nombre} se unió al chat`);
    io.emit("usuarios", io.engine.clientsCount);
  });

  // Un cliente envía un mensaje: se reenvía a TODOS
  socket.on("mensaje", (texto) => {
    const limpio = String(texto).trim().slice(0, 300);
    if (!limpio || !socket.nombre) return;
    io.emit("mensaje", {
      nombre: socket.nombre,
      texto: limpio,
      hora: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
    });
  });

  socket.on("disconnect", () => {
    if (socket.nombre) io.emit("aviso", `${socket.nombre} salió del chat`);
    io.emit("usuarios", io.engine.clientsCount);
  });
});

// Heroku (y otros servicios) asignan el puerto en process.env.PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor en marcha en el puerto ${PORT}`);
});
