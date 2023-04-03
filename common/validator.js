const Joi = require("joi");

const { validate } = require("../src/middleware/validate.js");

const contactValidation = Joi.object({
  name: Joi.string().min(3).max(30).required(),

  email: Joi.string().email().required(),

  phone: Joi.string()
    .regex(/^\d{3}-\d{3}-\d{3}$/)
    .message({
      "string.pattern.base": `Phone number must be written as 123-456-789`,
    })
    .required(),
  favorite: Joi.boolean().optional(),
});

const updateContact = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .regex(/^\d{3}-\d{3}-\d{3}$/)
    .message({
      "string.pattern.base": `Phone number must be written as 123-456-789.`,
    })
    .optional(),
  favorite: Joi.boolean().optional(),
}).min(1);

const updateContactStatus = Joi.object({
  favorite: Joi.boolean().required(),
});

const userValidation = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  subscription: Joi.string().optional(),
});

module.exports.contactValid = (req, res, next) => {
  return validate(contactValidation, req.body, next, res);
};

module.exports.contactUpdate = (req, res, next) => {
  return validate(updateContact, req.body, next, res);
};

module.exports.contactStatusUpdate = (req, res, next) => {
  return validate(updateContactStatus, req.body, next, res);
};

module.exports.userValid = (req, res, next) => {
  return validate(userValidation, req.body, next, res);
};
