import { categorySchema } from "../models/category.model.js";
import { connection } from "../database/database.js";

export async function newCategoryMiddleware(req, res, next){
    const body = req.body;
    const { error } = categorySchema.validate(body, { abortEarly: false });
    if(error){
        const errorsList = error.details.map((detail) => detail.message);
        return res.status(400).send(errorsList);
    }
    const categoryExists = await connection.query("SELECT * FROM categories WHERE name = $1;", [body.name]);
    if(categoryExists.rows.length !== 0){
        return res.status(409).send({ message: "Esta categoria já foi criada!" });
    }
    next();
}