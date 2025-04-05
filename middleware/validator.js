const Joi = require("joi");

const signInValidator = async(req, res, next) =>{
    const signInValidator = Joi.object({
        PhoneNumber: Joi.String()
    .pattern(/^(?:\+234|234|0)[789][01]\d{8}$/)
    .required()
    .trim()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid number with 10 to 15 digits.",
      "string.empty": "Phone number cannot be empty.",
      "any.required": "Phone number is required.",
    }),
    })
}

module.exports = signInValidator