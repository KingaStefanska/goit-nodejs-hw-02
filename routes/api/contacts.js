const express = require("express");

const router = express.Router();

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts.js");

const validate = require("../../common/validator.js");

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();

  res.json({
    status: "success",
    code: 200,
    data: { contacts },
  });
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (contact) {
    res.json({ status: "success", code: 200, data: { contact } });
  } else {
    res.json({ status: failure, code: 404, message: "Not found" });
  }
});

router.post("/", validate.contactValid, async (req, res, next) => {
  const { name, email, phone } = req.body;
  const newContact = await addContact(req.body);
  res.json({ status: "success", code: 201, data: { newContact } });
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
