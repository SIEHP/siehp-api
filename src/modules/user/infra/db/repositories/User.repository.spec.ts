import { Test } from '@nestjs/testing';
import { PrismaProvider } from 'src/shared/infra/providers/Prisma.provider';
import { UserRepository } from './User.repository';
import { Status, Role } from '@prisma/client';
import { Enviroment } from 'src/shared/config/app';

describe('UserRepository', () => {
  let repository: UserRepository;
  let prisma: PrismaProvider;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaProvider,
          useValue: new PrismaProvider(Enviroment.TEST),
        },
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
    prisma = moduleRef.get<PrismaProvider>(PrismaProvider);
  });

  beforeEach(async () => {
    await prisma.userPermission.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user = await repository.create({
        name: 'John Doe',
        email: 'john@example.com',
        status: Status.ACTIVE,
        role: Role.STUDENT,
        registration_code: '123456'
      });

      expect(user).toBeDefined();
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.status).toBe(Status.ACTIVE);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by id', async () => {
      const createdUser = await repository.create({
        name: 'John Doe',
        email: 'john@example.com',
        status: Status.ACTIVE,
        role: Role.STUDENT,
        registration_code: '123456'
      });

      const user = await repository.findByEmail({ email: createdUser.email });

      expect(user).toBeDefined();
      expect(user.id).toBe(createdUser.id);
    });

    it('should return null when user not found', async () => {
      const user = await repository.findByEmail({ email: 'nonexistent@example.com' });
      expect(user).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const createdUser = await repository.create({
        name: 'John Doe',
        email: 'john@example.com',
        status: Status.ACTIVE,
        role: Role.STUDENT,
        registration_code: '123456'
      });

      const user = await repository.findByEmail({ email: 'john@example.com' });

      expect(user).toBeDefined();
      expect(user.email).toBe(createdUser.email);
    });

    it('should return null when user not found', async () => {
      const user = await repository.findByEmail({ email: 'nonexistent@example.com' });
      expect(user).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const createdUser = await repository.create({
        name: 'John Doe',
        email: 'john@example.com',
        status: Status.ACTIVE,
        role: Role.STUDENT,
        registration_code: '123456'
      });

      const updatedUser = await repository.update({
        id: createdUser.id,
        data: {
          name: 'John Updated',
          email: 'john.updated@example.com'
        }
      });

      expect(updatedUser).toBeDefined();
      expect(updatedUser.name).toBe('John Updated');
      expect(updatedUser.email).toBe('john.updated@example.com');
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const createdUser = await repository.create({
        name: 'John Doe',
        email: 'john@example.com',
        status: Status.ACTIVE,
        role: Role.STUDENT,
        registration_code: '123456'
      });

      const deletedUser = await repository.update({
        id: createdUser.id,
        data: {
          status: Status.DELETED
        }
      });

      expect(deletedUser).toBeDefined();
      expect(deletedUser.status).toBe(Status.DELETED);
    });
  });
}); 