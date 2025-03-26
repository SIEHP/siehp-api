import { Injectable, NotFoundException } from '@nestjs/common';
import { UseCaseInterface } from 'src/shared/domain/protocols/UseCase.protocol';
import { RefreshAccessTokenDto, RefreshAccessTokenResponseDto } from '../../domain/dtos/requests/RefreshAccessToken.dto';
import { UserRepository } from '../db/repositories/User.repository';
import { NotFoundUserException } from '../../domain/errors/NotFoundUser.exception';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshAccessTokenUseCase implements UseCaseInterface {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async execute({ email }: RefreshAccessTokenDto): Promise<RefreshAccessTokenResponseDto> { 
  
      const user = await this.userRepository.findByEmail({ email });

      if (!user) {
        throw new NotFoundUserException();
      }

      const payload = { email: user.email };
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });


      const permissionsList = user.user_permissions.flatMap((userPermission) => {
        return [
          userPermission.permission.name,
          ...userPermission.permission.permissions_included.map((permission) => permission.included_permission.name),
        ];
      });
  
      const permissions = [...new Set(permissionsList)];
      
      
      return {
        token: refreshToken,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          profile_image_url: user.profile_image_url,
          permissions,
        },
      };

  } 
}