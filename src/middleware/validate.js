const validate = (schema, obj, next, res) => {
  const { error } = schema.validate(obj);
  if (error) {
    const [{ message }] = error.details;
    console.log(error);
    return res.status(400).json({ message: `${message.replace(/"/g, "")}` });
  }
  next();
};

module.exports = { validate };
