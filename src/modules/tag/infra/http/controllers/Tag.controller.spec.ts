import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaProvider } from 'src/shared/infra/providers/Prisma.provider';
import { Enviroment } from 'src/shared/config/app';
import { AllExceptionsFilter } from 'src/shared/domain/errors/AllException.filter';
import { DiscordWebhookProvider } from 'src/shared/infra/providers/DiscordWebhook.provider';
import { ZodValidationExceptionFilter } from 'src/shared/domain/errors/ZodValidationException.filter';
import { TagModule } from '../../modules/Tag.module';
import { SharedModule } from 'src/shared/infra/modules/Shared.module';
import { LoggerProvider } from 'src/shared/infra/providers/Logger.provider';
import { TagController } from './Tag.controller';
import { CreateTagUseCase } from '../../usecases/CreateTag.usecase';
import { GetTagUseCase } from '../../usecases/GetTag.usecase';
import { UpdateTagUseCase } from '../../usecases/UpdateTag.usecase';
import { DeleteTagUseCase } from '../../usecases/DeleteTag.usecase';
import { CreateImageTagUseCase } from '../../usecases/CreateImageTag.usecase';
import { DeleteImageTagUseCase } from '../../usecases/DeleteImageTag.usecase';
import { GetTagsByImageUseCase } from '../../usecases/GetTagsByImage.usecase';
import { Response } from 'express';
import { InvalidPermissionsException } from 'src/modules/user/domain/errors/InvalidPermissions.exception';
import { UserService } from 'src/modules/user/infra/services/User.service';
import { Status } from '@prisma/client';
import { CreateImageTagUseCaseResponseDTO, DeleteImageTagUseCaseResponseDTO } from '../../../domain/dtos/usecases/Tag.usecase.dto';

describe('TagController - /tag', () => {
  jest.setTimeout(30000); // 30 seconds timeout
  const controllerRoute = '/tag';
  
  let app: NestExpressApplication;
  let prisma: PrismaProvider;
  let controller: TagController;
  let createTagUseCase: CreateTagUseCase;
  let getTagUseCase: GetTagUseCase;
  let updateTagUseCase: UpdateTagUseCase;
  let deleteTagUseCase: DeleteTagUseCase;
  let createImageTagUseCase: CreateImageTagUseCase;
  let deleteImageTagUseCase: DeleteImageTagUseCase;
  let getTagsByImageUseCase: GetTagsByImageUseCase;
  let userService: UserService;

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [TagModule, SharedModule],
    })
      .overrideProvider(PrismaProvider)
      .useValue(new PrismaProvider(Enviroment.TEST))
      .compile();

    prisma = moduleRef.get(PrismaProvider);
    controller = moduleRef.get(TagController);
    createTagUseCase = moduleRef.get(CreateTagUseCase);
    getTagUseCase = moduleRef.get(GetTagUseCase);
    updateTagUseCase = moduleRef.get(UpdateTagUseCase);
    deleteTagUseCase = moduleRef.get(DeleteTagUseCase);
    createImageTagUseCase = moduleRef.get(CreateImageTagUseCase);
    deleteImageTagUseCase = moduleRef.get(DeleteImageTagUseCase);
    getTagsByImageUseCase = moduleRef.get(GetTagsByImageUseCase);
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

  describe('POST /tag', () => {
    it('should create a new tag', async () => {
      const mockRequest = {
        user: { email: 'test@example.com' },
      };

      const createTagDto = {
        name: 'Test Tag',
      };

      const mockTag = {
        id: 1,
        name: 'Test Tag',
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

      jest.spyOn(createTagUseCase, 'execute').mockResolvedValue(mockTag);

      await controller.create(createTagDto, mockRequest as any, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTag);
    });

    it('should return forbidden when user doesnt have permission', async () => {
      const mockRequest = {
        user: { email: 'test@example.com' },
      };

      const createTagDto = {
        name: 'Test Tag',
      };

      jest.spyOn(userService, 'checkUserPermissions').mockResolvedValue({
        hasPermission: false,
        notIncludedPermissions: ['MANTER_IMAGENS'],
      });

      const expectedError = new InvalidPermissionsException({
        permissions: ['MANTER_IMAGENS'],
      });

      try {
        await controller.create(createTagDto, mockRequest as any, mockResponse);
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidPermissionsException);
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
        expect(error.message).toBe(expectedError.message);
      }
    });
  });

  describe('POST /tag/image', () => {
    it('should create a new image tag association', async () => {
      const mockRequest = {
        user: { email: 'test@example.com' },
      };

      const createImageTagDto = {
        image_id: 1,
        tag_id: 1,
      };

      const mockImageTag: CreateImageTagUseCaseResponseDTO = {
        id: 1,
        image_id: 1,
        tag_id: 1,
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

      jest.spyOn(createImageTagUseCase, 'execute').mockResolvedValue(mockImageTag);

      await controller.createImageTag(createImageTagDto, mockRequest as any, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith(mockImageTag);
    });
  });

  describe('GET /tag/image/:image_id', () => {
    it('should return tags for an image', async () => {
      const mockRequest = {
        user: { email: 'test@example.com' },
      };

      const mockTags = [
        {
          id: 1,
          name: 'Tag 1',
          status: Status.ACTIVE,
          created_at: new Date(),
          updated_at: new Date(),
          created_by: 1,
          updated_by: null,
        },
      ];

      jest.spyOn(userService, 'checkUserPermissions').mockResolvedValue({
        hasPermission: true,
        notIncludedPermissions: [],
      });

      jest.spyOn(getTagsByImageUseCase, 'execute').mockResolvedValue(mockTags);

      await controller.findTagsByImage(1, mockRequest as any, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTags);
    });
  });

  describe('DELETE /tag/image/:image_id/:tag_id', () => {
    it('should delete an image tag association', async () => {
      const mockRequest = {
        user: { email: 'test@example.com' },
      };

      const mockImageTag: DeleteImageTagUseCaseResponseDTO = {
        id: 1,
        image_id: 1,
        tag_id: 1,
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

      jest.spyOn(deleteImageTagUseCase, 'execute').mockResolvedValue(mockImageTag);

      await controller.deleteImageTag(1, 1, mockRequest as any, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockImageTag);
    });
  });
}); 