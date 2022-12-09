import Joi from "joi";

export const rentalSchema = Joi.object({
  customerId: Joi.number().integer().min(0).required(),
  gameId: Joi.number().integer().min(0).required(),
  daysRented: Joi.number().integer().min(1).required(),
});
