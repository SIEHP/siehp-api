import { Test, TestingModule } from '@nestjs/testing';
import { GetImageUseCase } from './GetImage.usecase';
import { ImageRepository } from '../db/repositories/Image.repository';
import { UserService } from 'src/modules/user/infra/services/User.service';
import { TagRepository } from 'src/modules/tag/infra/db/repositories/Tag.repository';
import { InvalidPermissionsException } from 'src/modules/user/domain/errors/InvalidPermissions.exception';
import { NotFoundImageException } from '../../domain/errors/NotFoundImage.exception';

describe('GetImageUseCase', () => {
    let useCase: GetImageUseCase;
    let imageRepository: ImageRepository;
    let userService: UserService;
    let tagRepository: TagRepository;

    const mockImageRepository = {
        findById: jest.fn(),
    };

    const mockUserService = {
        checkUserPermissions: jest.fn(),
    };

    const mockTagRepository = {
        findTagsByImageId: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetImageUseCase,
                {
                    provide: ImageRepository,
                    useValue: mockImageRepository,
                },
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
                {
                    provide: TagRepository,
                    useValue: mockTagRepository,
                },
            ],
        }).compile();

        useCase = module.get<GetImageUseCase>(GetImageUseCase);
        imageRepository = module.get<ImageRepository>(ImageRepository);
        userService = module.get<UserService>(UserService);
        tagRepository = module.get<TagRepository>(TagRepository);
    });

    it('should be defined', () => {
        expect(useCase).toBeDefined();
    });

    describe('execute', () => {
        const mockImage = {
            id: 1,
            file_id: 1,
            title: 'Test Image',
            status: 'ACTIVE',
            url: 'http://example.com/image.jpg',
            created_at: new Date(),
            updated_at: new Date(),
            created_by: 1,
            updated_by: null,
        };

        const mockTags = [
            {
                id: 1,
                name: 'test-tag',
                status: 'ACTIVE',
                created_at: new Date(),
                updated_at: new Date(),
                created_by: 1,
                updated_by: null,
            },
        ];

        it('should get an image with its tags', async () => {
            mockUserService.checkUserPermissions.mockResolvedValue({ hasPermission: true });
            mockImageRepository.findById.mockResolvedValue(mockImage);
            mockTagRepository.findTagsByImageId.mockResolvedValue(mockTags);

            const result = await useCase.execute({
                id: 1,
                user_email: 'test@example.com',
            });

            expect(result).toEqual({ ...mockImage, tags: mockTags });
            expect(mockUserService.checkUserPermissions).toHaveBeenCalled();
            expect(mockImageRepository.findById).toHaveBeenCalled();
            expect(mockTagRepository.findTagsByImageId).toHaveBeenCalled();
        });

        it('should get an image without tags', async () => {
            mockUserService.checkUserPermissions.mockResolvedValue({ hasPermission: true });
            mockImageRepository.findById.mockResolvedValue(mockImage);
            mockTagRepository.findTagsByImageId.mockResolvedValue([]);

            const result = await useCase.execute({
                id: 1,
                user_email: 'test@example.com',
            });

            expect(result).toEqual({ ...mockImage, tags: [] });
            expect(mockUserService.checkUserPermissions).toHaveBeenCalled();
            expect(mockImageRepository.findById).toHaveBeenCalled();
            expect(mockTagRepository.findTagsByImageId).toHaveBeenCalled();
        });

        it('should throw InvalidPermissionsException when user has no permission', async () => {
            mockUserService.checkUserPermissions.mockResolvedValue({
                hasPermission: false,
                notIncludedPermissions: ['ACESSAR_IMAGENS'],
            });

            await expect(
                useCase.execute({
                    id: 1,
                    user_email: 'test@example.com',
                }),
            ).rejects.toThrow(InvalidPermissionsException);
        });

        it('should throw NotFoundImageException when image is not found', async () => {
            mockUserService.checkUserPermissions.mockResolvedValue({ hasPermission: true });
            mockImageRepository.findById.mockResolvedValue(null);

            await expect(
                useCase.execute({
                    id: 1,
                    user_email: 'test@example.com',
                }),
            ).rejects.toThrow(NotFoundImageException);
        });
    });
}); 