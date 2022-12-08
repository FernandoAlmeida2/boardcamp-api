import Joi from "joi";

export const customerSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().pattern(new RegExp("^[0-9]{10,11}$")).required(),
    cpf: Joi.string().pattern(new RegExp("^[0-9]{11}$")).required(),
    birthday: Joi.string().pattern(new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}$")).required(),
});