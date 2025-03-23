import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaProvider } from 'src/shared/infra/providers/Prisma.provider';
import { Enviroment } from 'src/shared/config/app';
import { AllExceptionsFilter } from 'src/shared/domain/errors/AllException.filter';
import { DiscordWebhookProvider } from 'src/shared/infra/providers/DiscordWebhook.provider';
import { ZodValidationExceptionFilter } from 'src/shared/domain/errors/ZodValidationException.filter';
import { ImageModule } from '../../modules/Image.module';
import { SharedModule } from 'src/shared/infra/modules/Shared.module';
import { LoggerProvider } from 'src/shared/infra/providers/Logger.provider';
import { ImageController } from './Image.controller';
import { CreateImageUseCase } from '../../usecases/CreateImage.usecase';
import { GetImageUseCase } from '../../usecases/GetImage.usecase';
import { UpdateImageUseCase } from '../../usecases/UpdateImage.usecase';
import { DeleteImageUseCase } from '../../usecases/DeleteImage.usecase';
import { Response } from 'express';
import { InvalidPermissionsException } from 'src/modules/user/domain/errors/InvalidPermissions.exception';
import { UserService } from 'src/modules/user/infra/services/User.service';
import { Status } from '@prisma/client';

describe('ImageController - /image', () => {
  jest.setTimeout(30000); // 30 seconds timeout
  const controllerRoute = '/image';
  
  let app: NestExpressApplication;
  let prisma: PrismaProvider;
  let controller: ImageController;
  let createImageUseCase: CreateImageUseCase;
  let getImageUseCase: GetImageUseCase;
  let updateImageUseCase: UpdateImageUseCase;
  let deleteImageUseCase: DeleteImageUseCase;
  let userService: UserService;

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [ImageModule, SharedModule],
    })
      .overrideProvider(PrismaProvider)
      .useValue(new PrismaProvider(Enviroment.TEST))
      .compile();

    prisma = moduleRef.get(PrismaProvider);
    controller = moduleRef.get(ImageController);
    createImageUseCase = moduleRef.get(CreateImageUseCase);
    getImageUseCase = moduleRef.get(GetImageUseCase);
    updateImageUseCase = moduleRef.get(UpdateImageUseCase);
    deleteImageUseCase = moduleRef.get(DeleteImageUseCase);
    userService = moduleRef.get(UserService);

    const logger = new LoggerProvider(
      new DiscordWebhookProvider(Enviroment.TEST),
    );

    app = moduleRef.createNestApplication<NestExpressApplication>();
    app.useGlobalFilters(
      new AllExceptionsFilter(logger),
      new ZodValidationExceptionFilter(logger),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /image', () => {
    it('should create a new image', async () => {
      const mockRequest = {
        user: { email: 'test@example.com' },
      };

      const createImageDto = {
        file_id: 1,
        title: 'Test Image',
        url: 'http://example.com/image.jpg',
      };

      const mockImage = {
        id: 1,
        file_id: 1,
        title: 'Test Image',
        url: 'http://example.com/image.jpg',
        status: Status.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 1,
        updated_by: null,
      };

      jest.spyOn(userService, 'checkUserPermissions').mockResolvedValue({
        hasPermission: true,
        notIncludedPermissions: [],
      });

      jest.spyOn(createImageUseCase, 'execute').mockResolvedValue(mockImage);

      await controller.create(createImageDto, mockRequest as any, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith(mockImage);
    });

    it('should return forbidden when user doesnt have permission', async () => {
      const mockRequest = {
        user: { email: 'test@example.com' },
      };

      const createImageDto = {
        file_id: 1,
        title: 'Test Image',
        url: 'http://example.com/image.jpg',
      };

      jest.spyOn(userService, 'checkUserPermissions').mockResolvedValue({
        hasPermission: false,
        notIncludedPermissions: ['MANTER_IMAGENS'],
      });

      const expectedError = new InvalidPermissionsException({
        permissions: ['MANTER_IMAGENS'],
      });

      try {
        await controller.create(createImageDto, mockRequest as any, mockResponse);
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidPermissionsException);
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
        expect(error.message).toBe(expectedError.message);
      }
    });
  });

  describe('GET /image/:id', () => {
    it('should return an image by id', async () => {
      const mockRequest = {
        user: { email: 'test@example.com' },
      };

      const mockImage = {
        id: 1,
        file_id: 1,
        title: 'Test Image',
        url: 'http://example.com/image.jpg',
        status: Status.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 1,
        updated_by: null,
      };

      jest.spyOn(userService, 'checkUserPermissions').mockResolvedValue({
        hasPermission: true,
        notIncludedPermissions: [],
      });

      jest.spyOn(getImageUseCase, 'execute').mockResolvedValue(mockImage);

      await controller.findById(1, mockRequest as any, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockImage);
    });
  });

  describe('PUT /image/:id', () => {
    it('should update an image', async () => {
      const mockRequest = {
        user: { email: 'test@example.com' },
      };

      const updateImageDto = {
        title: 'Updated Image',
        url: 'http://example.com/updated-image.jpg',
      };

      const mockImage = {
        id: 1,
        file_id: 1,
        title: 'Updated Image',
        url: 'http://example.com/updated-image.jpg',
        status: Status.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 1,
        updated_by: 1,
      };

      jest.spyOn(userService, 'checkUserPermissions').mockResolvedValue({
        hasPermission: true,
        notIncludedPermissions: [],
      });

      jest.spyOn(updateImageUseCase, 'execute').mockResolvedValue(mockImage);

      await controller.update(1, updateImageDto, mockRequest as any, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockImage);
    });
  });

  describe('DELETE /image/:id', () => {
    it('should delete an image', async () => {
      const mockRequest = {
        user: { email: 'test@example.com' },
      };

      const mockImage = {
        id: 1,
        file_id: 1,
        title: 'Test Image',
        url: 'http://example.com/image.jpg',
        status: Status.DELETED,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 1,
        updated_by: 1,
      };

      jest.spyOn(userService, 'checkUserPermissions').mockResolvedValue({
        hasPermission: true,
        notIncludedPermissions: [],
      });

      jest.spyOn(deleteImageUseCase, 'execute').mockResolvedValue(mockImage);

      await controller.delete(1, mockRequest as any, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockImage);
    });
  });
}); 