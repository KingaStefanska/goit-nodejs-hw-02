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
  return res.status(200).json(contacts);
});

router.get("/:contactId", async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json(contact).send();
});

router.post("/", validate.contactValid, async (req, res, next) => {
  const { name, email, phone } = req.body;
  const newContact = await addContact(req.body);
  res.json({ status: "success", code: 201, data: { newContact } });
});

router.delete("/:contactId", async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);

  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  await removeContact(contactId);
  return res.status(200).json({ message: "contact deleted" });
});

router.put("/:contactId", validate.contactUpdate, async (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "missing fields" });
  }
  const contactToEdit = await updateContact(req.params.contactId, req.body);

  if (!contactToEdit) {
    return res.status(404).json({ message: "Not found" });
  }

  res.status(200).send(contact);
});

module.exports = router;
