import { Test } from '@nestjs/testing';
import { PrismaProvider } from 'src/shared/infra/providers/Prisma.provider';
import { TagRepository } from './Tag.repository';
import { Status } from '@prisma/client';
import { Enviroment } from 'src/shared/config/app';

describe('TagRepository', () => {
  let repository: TagRepository;
  let prisma: PrismaProvider;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TagRepository,
        {
          provide: PrismaProvider,
          useValue: new PrismaProvider(Enviroment.TEST),
        },
      ],
    }).compile();

    repository = moduleRef.get<TagRepository>(TagRepository);
    prisma = moduleRef.get<PrismaProvider>(PrismaProvider);
  });

  beforeEach(async () => {
    await prisma.imageTag.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.image.deleteMany();
  });

  describe('create', () => {
    it('should create a new tag', async () => {
      const tag = await repository.create({
        name: 'Test Tag',
        created_by: 1,
        status: Status.ACTIVE
      });

      expect(tag).toBeDefined();
      expect(tag.name).toBe('Test Tag');
      expect(tag.status).toBe(Status.ACTIVE);
    });
  });

  describe('findById', () => {
    it('should find a tag by id', async () => {
      const createdTag = await repository.create({
        name: 'Test Tag',
        created_by: 1,
        status: Status.ACTIVE
      });

      const tag = await repository.findById({ id: createdTag.id });

      expect(tag).toBeDefined();
      expect(tag.id).toBe(createdTag.id);
    });

    it('should return null when tag not found', async () => {
      const tag = await repository.findById({ id: 999 });
      expect(tag).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a tag', async () => {
      const createdTag = await repository.create({
        name: 'Test Tag',
        created_by: 1,
        status: Status.ACTIVE
      });

      const updatedTag = await repository.update({
        id: createdTag.id,
        name: 'Updated Tag',
        updated_by: 2,
      });

      expect(updatedTag).toBeDefined();
      expect(updatedTag.name).toBe('Updated Tag');
      expect(updatedTag.updated_by).toBe(2);
    });
  });

  describe('delete', () => {
    it('should delete a tag', async () => {
      const createdTag = await repository.create({
        name: 'Test Tag',
        created_by: 1,
        status: Status.ACTIVE
      });

      const deletedTag = await repository.delete({
        id: createdTag.id,
        updated_by: 2,
      });

      expect(deletedTag).toBeDefined();
      expect(deletedTag.status).toBe(Status.DELETED);
      expect(deletedTag.updated_by).toBe(2);
    });
  });

  describe('createImageTag', () => {
    it('should create an image tag association', async () => {
      const tag = await repository.create({
        name: 'Test Tag',
        created_by: 1,
        status: Status.ACTIVE
      });

      const image = await prisma.image.create({
        data: {
          url: 'test-image.jpg',
          created_by: 1,
          status: Status.ACTIVE,
          file_id: 1,
          title: 'Test Image'
        }
      });

      const imageTag = await repository.createImageTag({
        image_id: image.id,
        tag_id: tag.id,
        created_by: 1
      });

      expect(imageTag).toBeDefined();
      expect(imageTag.image_id).toBe(image.id);
      expect(imageTag.tag_id).toBe(tag.id);
    });
  });

  describe('deleteImageTag', () => {
    it('should delete an image tag association', async () => {
      const tag = await repository.create({
        name: 'Test Tag',
        created_by: 1,
        status: Status.ACTIVE
      });

      const image = await prisma.image.create({
        data: {
          url: 'test-image.jpg',
          created_by: 1,
          status: Status.ACTIVE,
          file_id: 1,
          title: 'Test Image'
        }
      });

      const imageTag = await repository.createImageTag({
        image_id: image.id,
        tag_id: tag.id,
        created_by: 1
      });

      const result = await repository.deleteImageTag({
        image_id: image.id,
        tag_id: tag.id,
        updated_by: 1
      });

      expect(result).toBeDefined();
    });
  });

  describe('findTagsByImageId', () => {
    it('should find tags by image id', async () => {
      const tag = await repository.create({
        name: 'Test Tag',
        created_by: 1,
        status: Status.ACTIVE
      });

      const image = await prisma.image.create({
        data: {
          url: 'test-image.jpg',
          created_by: 1,
          status: Status.ACTIVE,
          file_id: 1,
          title: 'Test Image'
        }
      });

      await repository.createImageTag({
        image_id: image.id,
        tag_id: tag.id,
        created_by: 1
      });

      const tags = await repository.findTagsByImageId({ image_id: image.id });

      expect(tags).toBeDefined();
      expect(tags).toHaveLength(1);
      expect(tags[0].id).toBe(tag.id);
    });

    it('should return empty array when no tags found', async () => {
      const image = await prisma.image.create({
        data: {
          url: 'test-image.jpg',
          created_by: 1,
          status: Status.ACTIVE,
          file_id: 1,
          title: 'Test Image'
        }
      });

      const tags = await repository.findTagsByImageId({ image_id: image.id });
      expect(tags).toHaveLength(0);
    });
  });
}); 