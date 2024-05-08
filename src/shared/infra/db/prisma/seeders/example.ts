import { PrismaClient } from '@prisma/client';

export const exampleSeeder = async (prisma: PrismaClient) => {
  // const exampleOperation1 = prisma.example.create({
  //   data: {},
  // });

  try {
    await prisma.$transaction([]);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error on exampleSeeder: ${error.message}`);
    }
  }
};
