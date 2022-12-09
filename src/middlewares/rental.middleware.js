import { rentalSchema } from "../models/rental.model.js";
import { connection } from "../database/database.js";

export async function rentalMiddleware(req, res, next) {
  const { customerId, gameId } = req.body;
  const { error } = rentalSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorsList = error.details.map((detail) => detail.message);
    return res.status(400).send(errorsList);
  }
  try {
    const customerExists = await connection.query(
      "SELECT * FROM customers WHERE id = $1;",
      [customerId]
    );
    if (customerExists.rows.length === 0) {
      return res.status(400).send({ message: "Este cliente não existe!" });
    }
    const gameExists = await connection.query(
      "SELECT * FROM games WHERE id = $1;",
      [gameId]
    );
    if (gameExists.rows.length === 0) {
      return res.status(400).send({ message: "Este jogo não existe!" });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
  next();
}
