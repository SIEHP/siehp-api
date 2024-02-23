import { Test, TestingModule } from '@nestjs/testing';
import { GetExampleUseCase } from './GetExample.usecase';
import { ExampleEnum } from 'src/shared/domain/dtos/requests/GetExample.request.dto';
import { ExampleRepository } from '../../db/repositories/Example.repository';
import { ExampleException } from 'src/shared/domain/errors/Example.exception';
import { PrismaProvider } from '../../db/prisma/providers/Prisma.provider';
import { Enviroment } from 'src/shared/config/app';

describe('GetExampleUseCase', () => {
  let useCase: GetExampleUseCase;
  let prisma: PrismaProvider;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [GetExampleUseCase, ExampleRepository, PrismaProvider],
    })
      .overrideProvider(PrismaProvider)
      .useValue(new PrismaProvider(Enviroment.TEST))
      .compile();

    prisma = moduleRef.get(PrismaProvider);

    await prisma.seed();

    useCase = moduleRef.get(GetExampleUseCase);
  });

  afterEach(async () => {
    await prisma.clear();
  });

  it('should throw error if sex female', async () => {
    const result = useCase.execute({
      age: 1,
      name: 'name',
      sex: ExampleEnum.FEMALE,
    });

    expect(result).rejects.toThrow(ExampleException);
  });

  it('should return example', async () => {
    const result = useCase.execute({
      age: 1,
      name: 'name',
      sex: ExampleEnum.MALE,
    });

    expect(result).resolves.toStrictEqual({
      example: {
        id: 1,
      },
    });
  });
});
