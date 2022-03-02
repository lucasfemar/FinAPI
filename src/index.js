const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();

const customers = [];

app.use(express.json());

//Middleware
function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({ error: "Customer not found" });
  }

  request.customer = customer; // Todas as rotas que chamar esse middleware terão acesso a esse "customer"
  return next(); //Continua a requisição
}

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  const customerAlredyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlredyExists) {
    return response.status(400).json({ error: "Customer alredy exists!" });
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });

  return response.status(201).send();
});

//app.use(verifyIfExistsAccountCPF)
app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request; // request vindo do middleware verifyIfExistsAccountCPF
  return response.json(customer.statement);
});

app.listen(3333, () => {
  console.log("SERVER IS RUNNING!");
});
