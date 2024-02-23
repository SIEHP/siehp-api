import { prisma } from '..';

export const exampleSeeder = async () => {
  const exampleOperation1 = prisma.example.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {},
  });

  try {
    await prisma.$transaction([exampleOperation1]);
  } catch (error) {
    console.log('deu erro');
  }
};
