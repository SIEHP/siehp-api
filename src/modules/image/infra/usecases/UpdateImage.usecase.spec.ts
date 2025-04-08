import { Test, TestingModule } from '@nestjs/testing';
import { UpdateImageUseCase } from './UpdateImage.usecase';
import { ImageRepository } from '../db/repositories/Image.repository';
import { UserService } from 'src/modules/user/infra/services/User.service';
import { UserRepository } from 'src/modules/user/infra/db/repositories/User.repository';
import { TagRepository } from 'src/modules/tag/infra/db/repositories/Tag.repository';
import { InvalidPermissionsException } from 'src/modules/user/domain/errors/InvalidPermissions.exception';
import { NotFoundUserException } from 'src/modules/user/domain/errors/NotFoundUser.exception';
import { NotFoundImageException } from '../../domain/errors/NotFoundImage.exception';
import { NotFoundTagException } from 'src/modules/tag/domain/errors/NotFoundTag.exception';

describe('UpdateImageUseCase', () => {
    let useCase: UpdateImageUseCase;
    let imageRepository: ImageRepository;
    let userService: UserService;
    let userRepository: UserRepository;
    let tagRepository: TagRepository;

    const mockImageRepository = {
        findById: jest.fn(),
        update: jest.fn(),
    };

    const mockUserService = {
        checkUserPermissions: jest.fn(),
    };

    const mockUserRepository = {
        findByEmail: jest.fn(),
    };

    const mockTagRepository = {
        findByName: jest.fn(),
        create: jest.fn(),
        createImageTag: jest.fn(),
        deleteByImageId: jest.fn(),
        findByImageId: jest.fn(),
        findTagsByImageId: jest.fn(),
        deleteImageTag: jest.fn(),
        findInactiveImageTag: jest.fn(),
        reactivateImageTag: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UpdateImageUseCase,
                {
                    provide: ImageRepository,
                    useValue: mockImageRepository,
                },
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
                {
                    provide: UserRepository,
                    useValue: mockUserRepository,
                },
                {
                    provide: TagRepository,
                    useValue: mockTagRepository,
                },
            ],
        }).compile();

        useCase = module.get<UpdateImageUseCase>(UpdateImageUseCase);
        imageRepository = module.get<ImageRepository>(ImageRepository);
        userService = module.get<UserService>(UserService);
        userRepository = module.get<UserRepository>(UserRepository);
        tagRepository = module.get<TagRepository>(TagRepository);
    });

    it('should be defined', () => {
        expect(useCase).toBeDefined();
    });

    describe('execute', () => {
        const mockUser = {
            id: 1,
            email: 'test@example.com',
        };

        const mockImage = {
            id: 1,
            file_id: 1,
            title: 'Test Image',
            status: 'ACTIVE',
            url: 'http://example.com/image.jpg',
            piece_state: 'Preserved',
            pick_date: new Date('2023-01-01'),
            tissue: 'Skin',
            copyright: 'Test Copyright',
            description: 'Test Description',
            created_at: new Date(),
            updated_at: new Date(),
            created_by: 1,
            updated_by: null,
        };

        const mockTag = {
            id: 1,
            name: 'test-tag',
            status: 'ACTIVE',
            created_at: new Date(),
            updated_at: new Date(),
            created_by: 1,
            updated_by: null,
        };

        it('should update an image without changing tags', async () => {
            mockUserService.checkUserPermissions.mockResolvedValue({ hasPermission: true });
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            mockImageRepository.findById.mockResolvedValue(mockImage);
            mockImageRepository.update.mockResolvedValue(mockImage);
            mockTagRepository.findTagsByImageId.mockResolvedValue([mockTag]);
            mockTagRepository.deleteImageTag.mockResolvedValue({});

            const result = await useCase.execute({
                id: 1,
                title: 'Updated Image',
                piece_state: 'Modified',
                pick_date: new Date('2023-02-01'),
                tissue: 'Bone',
                copyright: 'Updated Copyright',
                description: 'Updated Description',
                user_email: 'test@example.com',
            });

            expect(result).toEqual({ ...mockImage, tags: [] });
            expect(mockUserService.checkUserPermissions).toHaveBeenCalled();
            expect(mockUserRepository.findByEmail).toHaveBeenCalled();
            expect(mockImageRepository.findById).toHaveBeenCalled();
            expect(mockImageRepository.update).toHaveBeenCalled();
            expect(mockTagRepository.findTagsByImageId).toHaveBeenCalled();
            expect(mockTagRepository.deleteImageTag).toHaveBeenCalled();
        });

        it('should update an image and its tags', async () => {
            mockUserService.checkUserPermissions.mockResolvedValue({ hasPermission: true });
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            mockImageRepository.findById.mockResolvedValue(mockImage);
            mockImageRepository.update.mockResolvedValue(mockImage);
            mockTagRepository.findByName.mockResolvedValue(mockTag);
            mockTagRepository.findTagsByImageId.mockResolvedValue([mockTag]);

            const result = await useCase.execute({
                id: 1,
                title: 'Updated Image',
                piece_state: 'Modified',
                pick_date: new Date('2023-02-01'),
                tissue: 'Bone',
                copyright: 'Updated Copyright',
                description: 'Updated Description',
                user_email: 'test@example.com',
                tags: ['test-tag'],
            });

            expect(result).toEqual({ ...mockImage, tags: [mockTag] });
            expect(mockUserService.checkUserPermissions).toHaveBeenCalled();
            expect(mockUserRepository.findByEmail).toHaveBeenCalled();
            expect(mockImageRepository.findById).toHaveBeenCalled();
            expect(mockImageRepository.update).toHaveBeenCalled();
            expect(mockTagRepository.findByName).toHaveBeenCalled();
            expect(mockTagRepository.findTagsByImageId).toHaveBeenCalled();
        });

        it('should update an image and create new tags', async () => {
            mockUserService.checkUserPermissions.mockResolvedValue({ hasPermission: true });
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            mockImageRepository.findById.mockResolvedValue(mockImage);
            mockImageRepository.update.mockResolvedValue(mockImage);
            mockTagRepository.findByName.mockRejectedValue(new NotFoundTagException());
            mockTagRepository.create.mockResolvedValue(mockTag);
            mockTagRepository.findTagsByImageId.mockResolvedValue([mockTag]);

            const result = await useCase.execute({
                id: 1,
                title: 'Updated Image',
                piece_state: 'Modified',
                pick_date: new Date('2023-02-01'),
                tissue: 'Bone',
                copyright: 'Updated Copyright',
                description: 'Updated Description',
                user_email: 'test@example.com',
                tags: ['test-tag'],
            });

            expect(result).toEqual({ ...mockImage, tags: [mockTag] });
            expect(mockUserService.checkUserPermissions).toHaveBeenCalled();
            expect(mockUserRepository.findByEmail).toHaveBeenCalled();
            expect(mockImageRepository.findById).toHaveBeenCalled();
            expect(mockImageRepository.update).toHaveBeenCalled();
            expect(mockTagRepository.findByName).toHaveBeenCalled();
            expect(mockTagRepository.create).toHaveBeenCalled();
            expect(mockTagRepository.findTagsByImageId).toHaveBeenCalled();
        });

        it('should throw InvalidPermissionsException when user has no permission', async () => {
            mockUserService.checkUserPermissions.mockResolvedValue({
                hasPermission: false,
                notIncludedPermissions: ['MANTER_IMAGENS'],
            });

            await expect(
                useCase.execute({
                    id: 1,
                    title: 'Updated Image',
                    piece_state: 'Modified',
                    pick_date: new Date('2023-02-01'),
                    tissue: 'Bone',
                    copyright: 'Updated Copyright',
                    description: 'Updated Description',
                    user_email: 'test@example.com',
                }),
            ).rejects.toThrow(InvalidPermissionsException);
        });

        it('should throw NotFoundUserException when user is not found', async () => {
            mockUserService.checkUserPermissions.mockResolvedValue({ hasPermission: true });
            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(
                useCase.execute({
                    id: 1,
                    title: 'Updated Image',
                    piece_state: 'Modified',
                    pick_date: new Date('2023-02-01'),
                    tissue: 'Bone',
                    copyright: 'Updated Copyright',
                    description: 'Updated Description',
                    user_email: 'test@example.com',
                }),
            ).rejects.toThrow(NotFoundUserException);
        });

        it('should throw NotFoundImageException when image is not found', async () => {
            mockUserService.checkUserPermissions.mockResolvedValue({ hasPermission: true });
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            mockImageRepository.findById.mockResolvedValue(null);

            await expect(
                useCase.execute({
                    id: 1,
                    title: 'Updated Image',
                    piece_state: 'Modified',
                    pick_date: new Date('2023-02-01'),
                    tissue: 'Bone',
                    copyright: 'Updated Copyright',
                    description: 'Updated Description',
                    user_email: 'test@example.com',
                }),
            ).rejects.toThrow(NotFoundImageException);
        });

        it('should reactivate inactive tags when they are re-added to the image', async () => {
            const inactiveTag = {
                id: 2,
                image_id: 1,
                tag_id: 2,
                status: 'INACTIVE',
                created_at: new Date(),
                updated_at: new Date(),
                created_by: 1,
                updated_by: 1,
            };

            const mockTagToReactivate = {
                id: 2,
                name: 'inactive-tag',
                status: 'ACTIVE',
                created_at: new Date(),
                updated_at: new Date(),
                created_by: 1,
                updated_by: null,
            };

            mockUserService.checkUserPermissions.mockResolvedValue({ hasPermission: true });
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            mockImageRepository.findById.mockResolvedValue(mockImage);
            mockImageRepository.update.mockResolvedValue(mockImage);
            
            // Mock for findByName to handle the tag we're reactivating
            mockTagRepository.findByName.mockImplementation((data) => {
                if (data.name === 'inactive-tag') {
                    return Promise.resolve(mockTagToReactivate);
                }
                return Promise.resolve(mockTag);
            });
            
            // Mock empty existing tags
            mockTagRepository.findTagsByImageId.mockResolvedValue([]);
            
            // Mock findInactiveImageTag to simulate finding an inactive tag
            mockTagRepository.findInactiveImageTag.mockImplementation((data) => {
                if (data.tag_id === 2) {
                    return Promise.resolve(inactiveTag);
                }
                return Promise.resolve(null);
            });
            
            // Mock reactivateImageTag
            mockTagRepository.reactivateImageTag.mockResolvedValue({
                ...inactiveTag,
                status: 'ACTIVE',
                updated_by: mockUser.id,
            });

            const result = await useCase.execute({
                id: 1,
                title: 'Updated Image',
                user_email: 'test@example.com',
                tags: ['test-tag', 'inactive-tag'],
            });

            expect(result).toBeDefined();
            expect(mockTagRepository.findInactiveImageTag).toHaveBeenCalledWith({
                image_id: 1,
                tag_id: 2,
            });
            expect(mockTagRepository.reactivateImageTag).toHaveBeenCalledWith({
                image_id: 1,
                tag_id: 2,
                updated_by: mockUser.id,
            });
            expect(mockTagRepository.createImageTag).toHaveBeenCalled();
        });
    });
}); 