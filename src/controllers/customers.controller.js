import { connection } from "../database/database.js";

export async function getCustomers(req, res) {
  const { cpf } = req.query;
  let customers;
  try {
    if (cpf)
      customers = await connection.query(
        "SELECT * FROM customers WHERE cpf LIKE $1;",
        [cpf + "%"]
      );
    else customers = await connection.query("SELECT * FROM customers;");
    res.send(customers.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getCustomer(req, res) {
  const { id } = req.params;
  try {
      const customer = await connection.query(
        "SELECT * FROM customers WHERE id = $1;",
        [id]
      );
      if(customer.rowCount.length === 0){
        return res.status(404).send({ message: "O cliente não existe!" })
      }
    res.send(customer.rows[0]);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function postCustomer(req, res){
  const { name, phone, cpf, birthday } = req.body;
  try {
    const customerExists = await connection.query(
      "SELECT * FROM customers WHERE cpf = $1;",
      [cpf]
    );
    if (customerExists.rows.length !== 0) {
      return res.status(409).send({ message: "Este cliente já existe!" });
    }
    await connection.query(
      'INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);',
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function putCustomer(req, res){
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;
  try {
    const customerExists = await connection.query(
      "SELECT * FROM customers WHERE cpf = $1;",
      [cpf]
    );
    if (customerExists.rows.length === 0) {
      return res.status(409).send({ message: "Este cliente não existe!" });
    }
    await connection.query(
      'UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5;',
      [name, phone, cpf, birthday, id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
