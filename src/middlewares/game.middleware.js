import { gameSchema } from "../models/game.model.js";
import { connection } from "../database/database.js";

export async function newGameMiddleware(req, res, next) {
  const body = req.body;
  const { error } = gameSchema.validate(body, { abortEarly: false });
  if (error) {
    const errorsList = error.details.map((detail) => detail.message);
    return res.status(400).send(errorsList);
  }
  try {
    const categoryIdExists = await connection.query(
      "SELECT * FROM categories WHERE id = $1;",
      [body.categoryId]
    );
    if(categoryIdExists.rows.length === 0){
        return res.status(400).send({ message: "A categoria deste jogo não existe!" });
    }
    const gameExists = await connection.query(
      "SELECT * FROM games WHERE name = $1;",
      [body.name]
    );
    if (gameExists.rows.length !== 0) {
      return res.status(409).send({ message: "Este jogo já foi criado!" });
    }
    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
