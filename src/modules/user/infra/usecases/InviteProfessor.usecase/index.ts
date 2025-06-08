import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from 'src/shared/infra/usecases/protocol';
import { UserService } from '../../services/User.service';
import { TokenProvider } from '../../providers/Token.provider';
import { InvalidPermissionsException } from '../../exceptions/InvalidPermissions.exception';
import { InviteProfessorUseCaseDTO } from './dto';
import { InviteProfessorUseCaseResponseDTO } from './dto';

@Injectable()
export class InviteProfessorUseCase implements UseCaseInterface {
  constructor(
    private readonly userService: UserService,
    private readonly tokenProvider: TokenProvider,
  ) {}

  async execute({
    user_email,
    email,
  }: InviteProfessorUseCaseDTO): Promise<InviteProfessorUseCaseResponseDTO> {
    // Verifica se o usuário tem permissão de administrador
    const checkUserPermission = await this.userService.checkUserPermissions({
      user_email,
      neededPermissions: ['MANTER_PROFESSORES'],
    });

    if (!checkUserPermission.hasPermission) {
      throw new InvalidPermissionsException({
        permissions: checkUserPermission.notIncludedPermissions,
      });
    }

    // Cria um usuário temporário para o professor
    const tempUser = await this.userService.createTempUser({
      email,
      role: 'PROFESSOR',
    });

    // Envia o token por email
    await this.tokenProvider.sendToken({
      email,
      userId: tempUser.id,
    });

    return {
      message: 'Professor convidado com sucesso',
    };
  }
}
