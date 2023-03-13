const fs = require("fs").promises;
const path = require("node:path");

const contactsPath = path.resolve("./models/contacts.json");

const fetchContacts = async () => {
  const contacts = await fs.readFile(contactsPath);
  return JSON.parse(contacts);
};

const listContacts = async () => {
  try {
    const contacts = await fetchContacts();
    console.table(contacts);
    return;
  } catch (error) {
    console.log(error.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await fetchContacts();
    const contact = contacts.find((contact) => contact.id === contactId);
    console.log(contact);
    return contact;
  } catch (error) {
    console.log(error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await fetchContacts();
    const contact = await getContactById(contactId);
    const newContacts = contacts.filter((contact) => contact.id !== contactId);
    const stringifyNewContacts = JSON.stringify(newContacts);
    await fs.writeFile(contactsPath, stringifyNewContacts);
    return contact;
  } catch (error) {
    console.log(error.message);
  }
};

const addContact = async (body) => {
  try {
    const contacts = await fetchContacts();
    const { name, email, phone } = body;
    const newContact = { id: `${contacts.length + 1}`, name, email, phone };
    const newContacts = [...contacts, newContact];
    const stringifyNewContacts = JSON.stringify(newContacts);
    await fs.writeFile(contactsPath, stringifyNewContacts);
    return;
  } catch (error) {
    console.log(error.message);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await fetchContacts();
    const index = contacts.findIndex((contact) => contact.id !== contactId);
    if (index === -1) return;
    contacts[index] = [...contacts[index], ...body];
    const stringifyContacts = JSON.stringify(contacts);
    await fs.writeFile(contactsPath, stringifyContacts);
    return contacts[index];
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
