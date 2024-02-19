const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "variables.env" });

connection();
console.log("project started");

const app = express();
const port = process.env.PORT || 5000;
const host = process.env.HOST || "0.0.0.0";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar encabezados CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "kalyapp.netlify.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

//Definir un dominio para recibir peticiones
const corsOptions = {
  origin: "https://kalyapp.netlify.app",
};
app.use(cors());

// Habilitar preflight para todas las rutas
app.options("*", cors(corsOptions));

const UserRoutes = require("./Routes/User");
const FollowRoutes = require("./Routes/Follow");
const PostRoutes = require("./Routes/Post");
const ChatRoutes = require("./Routes/Chat");

app.use("/user", UserRoutes);
app.use("/follow", FollowRoutes);
app.use("/post", PostRoutes);
app.use("/chat", ChatRoutes);

app.listen(port, host, () => {
  console.log(`Server started on port ${port}`);
});
