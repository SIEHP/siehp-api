import { Permissions, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { SALT } from '../../../utils/constants/';

export const userSeeder = async (prisma: PrismaClient) => {
  const permissionsExists = await prisma.permission.findMany({});

  if (permissionsExists.length) {
    return;
  }

  const permissions: Permissions[] = [
    'MANTER_PROFESSORES',
    'MANTER_ALUNOS',
    'MANTER_ADMINISTRADORES',
    'MANTER_IMAGENS',
    'MANTER_TURMAS',
    'MANTER_CONTEUDOS',
    'MANTER_ATIVIDADES',
    'ACESSAR_TURMAS',
    'ACESSAR_CONTEUDOS',
    'ACESSAR_ATIVIDADES',
    'ACESSAR_IMAGENS',
    'ACESSAR_LOGS',
    'CORRIGIR_ATIVIDADES',
    'RESPONDER_ATIVIDADES',
  ];

  await prisma.permission.createMany({
    data: permissions.map((permission) => ({
      name: permission,
      description: `Descrição da permissão ${permission}`,
    })),
  });

  const createdPermissions = await prisma.permission.findMany({});

  await prisma.includedPermissions.createMany({
    data: [
      {
        permission_id: 5,
        included_permission_id: 8,
      },
      {
        permission_id: 6,
        included_permission_id: 9,
      },
      {
        permission_id: 8,
        included_permission_id: 9,
      },
      {
        permission_id: 7,
        included_permission_id: 10,
      },
      {
        permission_id: 13,
        included_permission_id: 10,
      },
      {
        permission_id: 14,
        included_permission_id: 10,
      },
      {
        permission_id: 8,
        included_permission_id: 10,
      },
      {
        permission_id: 4,
        included_permission_id: 11,
      },
      {
        permission_id: 13,
        included_permission_id: 11,
      },
      {
        permission_id: 14,
        included_permission_id: 11,
      },
      {
        permission_id: 9,
        included_permission_id: 11,
      },
      {
        permission_id: 8,
        included_permission_id: 11,
      },
      {
        permission_id: 10,
        included_permission_id: 11,
      },
    ],
  });
  const salt = await bcrypt.genSalt(SALT);
  const password = 'Coxinh@123';
  const hashPassword = await bcrypt.hash(password, salt);

  const userOperation1 = prisma.user.create({
    data: {
      email: 'test1@email.com',
      name: 'test1',
      password: hashPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      registration_code: '123456',
      user_permissions: {
        createMany: {
          data: createdPermissions.map((permission) => ({
            permission_id: permission.id,
            status: 'ACTIVE',
          })),
        },
      },
    },
  });

  try {
    await prisma.$transaction([userOperation1]);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error on userSeeder: ${error.message}`);
    }
  }
};
