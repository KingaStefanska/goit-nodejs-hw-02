const fs = require("fs").promises;
const path = require("node:path");

const contactsPath = path.resolve("models/contacts.json");

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath);
  return JSON.parse(contacts);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId);
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const newContacts = contacts.filter((contact) => contact.id !== contactId);
  const stringifyNewContacts = JSON.stringify(newContacts);
  await fs.writeFile(contactsPath, stringifyNewContacts);
  return newContacts;
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const { name, email, phone } = body;
  const newContact = { id: `${contacts.length + 1}`, name, email, phone };
  const newContacts = [...contacts, newContact];
  const stringifyNewContacts = JSON.stringify(newContacts);
  await fs.writeFile(contactsPath, stringifyNewContacts);
  return;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === `${contactId}`);
  if (index === -1) return null;
  contacts[index] = [contacts.contactId, ...body];
  const stringifyContacts = JSON.stringify(contacts);
  await fs.writeFile(contactsPath, stringifyContacts);
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
