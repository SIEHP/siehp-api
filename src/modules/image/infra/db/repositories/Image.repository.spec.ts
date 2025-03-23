import { Test } from '@nestjs/testing';
import { PrismaProvider } from 'src/shared/infra/providers/Prisma.provider';
import { ImageRepository } from './Image.repository';
import { Status } from '@prisma/client';
import { Enviroment } from 'src/shared/config/app';

describe('ImageRepository', () => {
  let repository: ImageRepository;
  let prisma: PrismaProvider;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ImageRepository,
        {
          provide: PrismaProvider,
          useValue: new PrismaProvider(Enviroment.TEST),
        },
      ],
    }).compile();

    repository = moduleRef.get<ImageRepository>(ImageRepository);
    prisma = moduleRef.get<PrismaProvider>(PrismaProvider);
  });

  beforeEach(async () => {
    await prisma.imageTag.deleteMany();
    await prisma.image.deleteMany();
  });

  describe('create', () => {
    it('should create a new image', async () => {
      const image = await repository.create({
        file_id: 1,
        title: 'Test Image',
        url: 'http://example.com/image.jpg',
        created_by: 1,
        status: Status.ACTIVE
      });

      expect(image).toBeDefined();
      expect(image.title).toBe('Test Image');
      expect(image.status).toBe(Status.ACTIVE);
    });
  });

  describe('findById', () => {
    it('should find an image by id', async () => {
      const createdImage = await repository.create({
        file_id: 1,
        title: 'Test Image',
        url: 'http://example.com/image.jpg',
        created_by: 1,
        status: Status.ACTIVE
      });

      const image = await repository.findById({ id: createdImage.id });

      expect(image).toBeDefined();
      expect(image.id).toBe(createdImage.id);
    });

    it('should return null when image not found', async () => {
      const image = await repository.findById({ id: 999 });
      expect(image).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an image', async () => {
      const createdImage = await repository.create({
        file_id: 1,
        title: 'Test Image',
        url: 'http://example.com/image.jpg',
        created_by: 1,
        status: Status.ACTIVE
      });

      const updatedImage = await repository.update({
        id: createdImage.id,
        title: 'Updated Image',
        updated_by: 2,
      });

      expect(updatedImage).toBeDefined();
      expect(updatedImage.title).toBe('Updated Image');
      expect(updatedImage.updated_by).toBe(2);
    });
  });

  describe('delete', () => {
    it('should delete an image', async () => {
      const createdImage = await repository.create({
        file_id: 1,
        title: 'Test Image',
        url: 'http://example.com/image.jpg',
        created_by: 1,
        status: Status.ACTIVE
      });

      const deletedImage = await repository.delete({
        id: createdImage.id,
        updated_by: 2,
      });

      expect(deletedImage).toBeDefined();
      expect(deletedImage.status).toBe(Status.DELETED);
      expect(deletedImage.updated_by).toBe(2);
    });
  });
}); 