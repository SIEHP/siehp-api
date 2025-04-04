import { Test, TestingModule } from '@nestjs/testing';
import { CreateImageUseCase } from './CreateImage.usecase';
import { ImageRepository } from '../db/repositories/Image.repository';
import { UserService } from 'src/modules/user/infra/services/User.service';
import { UserRepository } from 'src/modules/user/infra/db/repositories/User.repository';
import { TagRepository } from 'src/modules/tag/infra/db/repositories/Tag.repository';
import { InvalidPermissionsException } from 'src/modules/user/domain/errors/InvalidPermissions.exception';
import { NotFoundUserException } from 'src/modules/user/domain/errors/NotFoundUser.exception';
import { NotFoundTagException } from 'src/modules/tag/domain/errors/NotFoundTag.exception';

describe('CreateImageUseCase', () => {
    let useCase: CreateImageUseCase;
    let imageRepository: ImageRepository;
    let userService: UserService;
    let userRepository: UserRepository;
    let tagRepository: TagRepository;

    const mockImageRepository = {
        create: jest.fn(),
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
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateImageUseCase,
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

        useCase = module.get<CreateImageUseCase>(CreateImageUseCase);
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

        it('should create an image without tags', async () => {
            mockUserService.checkUserPermissions.mockResolvedValue({ hasPermission: true });
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            mockImageRepository.create.mockResolvedValue(mockImage);

            const result = await useCase.execute({
                title: 'Test Image',
                url: 'http://example.com/image.jpg',
                piece_state: 'Preserved',
                pick_date: new Date('2023-01-01'),
                tissue: 'Skin',
                copyright: 'Test Copyright',
                description: 'Test Description',
                user_email: 'test@example.com',
            });

            expect(result).toEqual(mockImage);
            expect(mockUserService.checkUserPermissions).toHaveBeenCalled();
            expect(mockUserRepository.findByEmail).toHaveBeenCalled();
            expect(mockImageRepository.create).toHaveBeenCalled();
            expect(mockTagRepository.findByName).not.toHaveBeenCalled();
        });

        it('should create an image with existing tags', async () => {
            mockUserService.checkUserPermissions.mockResolvedValue({ hasPermission: true });
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            mockImageRepository.create.mockResolvedValue(mockImage);
            mockTagRepository.findByName.mockResolvedValue(mockTag);
            mockTagRepository.createImageTag.mockResolvedValue({});

            const result = await useCase.execute({
                title: 'Test Image',
                url: 'http://example.com/image.jpg',
                piece_state: 'Preserved',
                pick_date: new Date('2023-01-01'),
                tissue: 'Skin',
                copyright: 'Test Copyright',
                description: 'Test Description',
                user_email: 'test@example.com',
                tags: ['test-tag'],
            });

            expect(result).toEqual({ ...mockImage, tags: [mockTag] });
            expect(mockTagRepository.findByName).toHaveBeenCalledWith({ name: 'test-tag' });
            expect(mockTagRepository.create).not.toHaveBeenCalled();
            expect(mockTagRepository.createImageTag).toHaveBeenCalled();
        });

        it('should create an image with new tags', async () => {
            mockUserService.checkUserPermissions.mockResolvedValue({ hasPermission: true });
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            mockImageRepository.create.mockResolvedValue(mockImage);
            mockTagRepository.findByName.mockRejectedValue(new NotFoundTagException());
            mockTagRepository.create.mockResolvedValue(mockTag);
            mockTagRepository.createImageTag.mockResolvedValue({});

            const result = await useCase.execute({
                title: 'Test Image',
                url: 'http://example.com/image.jpg',
                piece_state: 'Preserved',
                pick_date: new Date('2023-01-01'),
                tissue: 'Skin',
                copyright: 'Test Copyright',
                description: 'Test Description',
                user_email: 'test@example.com',
                tags: ['test-tag'],
            });

            expect(result).toEqual({ ...mockImage, tags: [mockTag] });
            expect(mockTagRepository.findByName).toHaveBeenCalledWith({ name: 'test-tag' });
            expect(mockTagRepository.create).toHaveBeenCalled();
            expect(mockTagRepository.createImageTag).toHaveBeenCalled();
        });

        it('should throw InvalidPermissionsException when user has no permission', async () => {
            mockUserService.checkUserPermissions.mockResolvedValue({
                hasPermission: false,
                notIncludedPermissions: ['MANTER_IMAGENS'],
            });

            await expect(
                useCase.execute({
                    title: 'Test Image',
                    url: 'http://example.com/image.jpg',
                    piece_state: 'Preserved',
                    pick_date: new Date('2023-01-01'),
                    tissue: 'Skin',
                    copyright: 'Test Copyright',
                    description: 'Test Description',
                    user_email: 'test@example.com',
                }),
            ).rejects.toThrow(InvalidPermissionsException);
        });

        it('should throw NotFoundUserException when user is not found', async () => {
            mockUserService.checkUserPermissions.mockResolvedValue({ hasPermission: true });
            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(
                useCase.execute({
                    title: 'Test Image',
                    url: 'http://example.com/image.jpg',
                    piece_state: 'Preserved',
                    pick_date: new Date('2023-01-01'),
                    tissue: 'Skin',
                    copyright: 'Test Copyright',
                    description: 'Test Description',
                    user_email: 'test@example.com',
                }),
            ).rejects.toThrow(NotFoundUserException);
        });
    });
}); 