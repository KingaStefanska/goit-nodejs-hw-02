const express = require("express");
const router = express.Router();

const {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
  updateStatusContact,
} = require("../../controllers/contacts");

const validate = require("../../common/validator");

router.get("/", async (req, res, next) => {
  const contacts = await getAllContacts();
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
  const newContact = await createContact(req.body);
  res.status(201).json({ status: "success", data: { newContact } });
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

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

  res.status(200).json(contactToEdit).send();
});

router.patch(
  "/:contactId/favorite",
  validate.contactStatusUpdate,
  async (req, res, next) => {
    const { contactId } = req.params;
    if (!req.body.favorite) {
      return res.status(400).json({ message: "Missing field favorite" });
    }
    const contactStatus = await updateStatusContact(
      contactId,
      req.body.favorite
    );
    if (!contactStatus) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(contactToEdit).send({ contacts: contactStatus });
  }
);

module.exports = router;
