import { customerSchema } from "../models/customer.model.js";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
dayjs.extend(customParseFormat);

export async function customerMiddleware(req, res, next) {
  const body = req.body;
  const { error } = customerSchema.validate(body, { abortEarly: false });
  if (error) {
    const errorsList = error.details.map((detail) => detail.message);
    return res.status(400).send(errorsList);
  }
  if(!dayjs(body.birthday, 'YYYY-MM-DD', true).isValid()){
    return res.status(400).send({ message: "Data informada não é válida!" });
  };
  next();
}