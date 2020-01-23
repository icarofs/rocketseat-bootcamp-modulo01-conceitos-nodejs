const express = require("express");

const server = express();

// Temos que informar ao express que utilizaremos json
server.use(express.json());

// Vetor de usuários
const users = ["Icaro Souza", "Diego Fernandes", "Robson"];

// Middleware global, independete da rota que acessar ele é chamado.
server.use((req, res, next) => {
  console.time("Request");
  console.log("A requisição foi chamada");

  next();

  console.timeEnd("Request");
});

/**
 * Middleware local, que é usado diretamente na rota.
 * No caso deste middleware estamos verificando se realmente é
 * passado um name no corpo da requisição(dentro do insomnia)
 */
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }
  return next();
}

/**
 * Middleware local, verifica se existe um usuário que está vindo através
 * do req.params.index
 */
function checkUserInArray(req, res, next) {
  if (!users[req.params.index]) {
    return res.status(400).json({ error: "User does not exists" });
  }

  return next();
}

//Listagem de todos os usuários
server.get("/users", (req, res) => {
  return res.json(users);
});

//Listagem de um usuário
server.get("/users/:index", checkUserInArray, (req, res) => {
  const index = req.params.index;

  return res.json(users[index]);
});

// Criar usuário
server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

// Editar usuário
server.put("/users/:index", checkUserExists, checkUserInArray, (req, res) => {
  const index = req.params.index;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

//Deletar usuário
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const index = req.params.index;

  // O método splice é para remover os itens da lista.
  users.splice(index, 1);

  return res.send();
});

//Porta que o express irá utilizar
server.listen(3000);
