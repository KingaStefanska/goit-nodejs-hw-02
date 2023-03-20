const Joi = require("joi");

const { validate } = require("../src/middleware/validate.js");

const contactValidation = Joi.object({
  name: Joi.string().min(3).max(30).required(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "pl"] } })
    .required(),

  phone: Joi.string()
    .regex(/^\d{3}-\d{3}-\d{3}$/)
    .message({
      "string.pattern.base": `Phone number must be written as 123-456-789`,
    })
    .required(),
});

const updateContact = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "pl"] },
    })
    .optional(),
  phone: Joi.string()
    .regex(/^\d{3}-\d{3}-\d{3}$/)
    .message({
      "string.pattern.base": `Phone number must be written as 123-456-789.`,
    })
    .optional(),
}).min(1);

module.exports.contactValid = (req, res, next) => {
  return validate(contactValidation, req.body, next, res);
};

module.exports.contactUpdate = (req, res, next) => {
  return validate(updateContact, req.body, next, res);
};
