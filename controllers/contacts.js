const { Contact } = require("../models/contact");

const getAllContacts = async () => {
  return Contact.find();
};

const getContactById = async (contactId) => {
  return Contact.findOne({ _id: contactId });
};

const createContact = async (body) => {
  return Contact.create(body);
};

const updateContact = async (contactId, body) => {
  return Contact.findByIdAndUpdate({ _id: contactId }, body, { new: true });
};

const removeContact = async (contactId) => {
  return Contact.findByIdAndRemove({ _id: contactId });
};

const updateStatusContact = async (contactId, body) => {
  return Contact.findByIdAndUpdate({ _id: contactId }, body, { new: true });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
  updateStatusContact,
};
