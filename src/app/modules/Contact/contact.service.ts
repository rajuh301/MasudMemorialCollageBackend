import prisma from "../../../shared/prisma";

const createContactIntoDB = async (payload: any) => {
  const result = await prisma.contact.create({
    data: payload,
  });

  return result;
};

const getContactsFromDB = async () => {
  const result = await prisma.contact.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getSingleContactFromDB = async (id: string) => {
  const contact = await prisma.contact.findUnique({
    where: {
      id,
    },
  });

  if (!contact) {
    throw new Error("Contact not found");
  }

  return contact;
};

const deleteContactFromDB = async (id: string) => {
  const result = await prisma.contact.delete({
    where: {
      id,
    },
  });

  return result;
};

export const ContactService = {
  createContactIntoDB,
  getContactsFromDB,
  getSingleContactFromDB,
  deleteContactFromDB,
};