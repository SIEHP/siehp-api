import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AllExceptionsFilterDTO } from 'src/shared/domain/dtos/errors/AllException.filter.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUseCase } from 'src/modules/user/infra/usecases/Login.usecase';
import { AuthGuard } from '../guards/Jwt.guard';
import {
  LoginBodyDTO,
  LoginResponseDTO,
} from 'src/modules/user/domain/dtos/requests/Login.request.dto';
import { InvalidPermissionsException } from 'src/modules/user/domain/errors/InvalidPermissions.exception';
import { TestAuthResponseDTO } from 'src/modules/user/domain/dtos/requests/TestAuth.request.dto';
import { UserService } from '../../services/User.service';
import { join } from 'path';
import { EmailProvider } from 'src/shared/infra/providers/Email.provider';
import { TokenProvider } from '../../providers/Token.provider';
import { InviteBodyDTO, InviteResponseDTO } from 'src/modules/user/domain/dtos/requests/Invite.request.dto';
import { ValidateTokenBodyDTO } from 'src/modules/user/domain/dtos/requests/ValidateToken.request.dto';

@Controller('user')
@ApiTags('User')
@ApiResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Erro disparado.',
  type: AllExceptionsFilterDTO,
})
export class UserController {
  constructor(
    private loginUseCase: LoginUseCase,
    private userService: UserService,
    private emailProvider: EmailProvider,
    private tokenProvider: TokenProvider,
  ) {}

  @Post('login')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login realizado com sucesso',
    type: LoginResponseDTO,
  })
  @ApiOperation({ summary: 'Realiza o login do usuário' })
  async login(@Body() loginDto: LoginBodyDTO, @Res() res: Response) {
    const loginResponse = await this.loginUseCase.execute(loginDto);
    return res.status(HttpStatus.OK).json(loginResponse);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('user-token')
  @Get('/teste')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário autenticado',
    type: TestAuthResponseDTO,
  })
  @ApiOperation({ summary: 'Rota de teste para Guarda de Autenticação' })
  async testAuth(@Req() req: Request, @Res() res: Response) {
    // TODO: REMOVE BEFORE PRODUCTION
    const checkUserPermission = await this.userService.checkUserPermissions({
      user_email: req.user.email,
      neededPermissions: ['ACESSAR_LOGS'],
    });

    if (!checkUserPermission.hasPermission) {
      throw new InvalidPermissionsException({
        permissions: checkUserPermission.notIncludedPermissions,
      });
    }

    const testTemplate = join(
      process.cwd(),
      'src/modules/user/infra/views/emails/test.hbs',
    );

    await this.emailProvider.send({
      subject: 'Login realizado com sucesso',
      to: req.user.email,
      templateData: {
        filePath: testTemplate,
        variables: {
          userName: req.user.email,
          test: 'variável teste',
        },
      },
    });

    return res.status(HttpStatus.OK).json({ user: req.user });
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('user-token')
  @Post('/invite/professor')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Convite enviado com sucesso',
    type: InviteResponseDTO
  })
  @ApiOperation({ summary: 'Envia convite para professor' })
  async inviteProfessor(@Body() inviteDto: InviteBodyDTO, @Req() req: Request, @Res() res: Response) {
    // Verifica se o usuário tem permissão de administrador
    const checkUserPermission = await this.userService.checkUserPermissions({
      user_email: req.user.email,
      neededPermissions: ['MANTER_PROFESSORES'],
    });

    if (!checkUserPermission.hasPermission) {
      throw new InvalidPermissionsException({
        permissions: checkUserPermission.notIncludedPermissions,
      });
    }

    // Cria um usuário temporário para o professor
    const tempUser = await this.userService.createTempUser({
      email: inviteDto.email,
      role: 'PROFESSOR',
    });

    // Envia o token por email
    await this.tokenProvider.sendToken({
      email: inviteDto.email,
      userId: tempUser.id,
    });

    return res.status(HttpStatus.OK).json({
      message: 'Convite enviado com sucesso',
    });
  }

  @Post('/validate-token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token validado com sucesso',
  })
  @ApiOperation({ summary: 'Valida token de convite e cria conta' })
  async validateToken(
    @Body() validateTokenDto : ValidateTokenBodyDTO,
    @Res() res: Response,
  ) {
    
    const tokenData = await this.tokenProvider.getTokenData(validateTokenDto.token);

    if (!tokenData || tokenData.expires_at < new Date()) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Token inválido ou expirado.',
      });
    }

    if(tokenData.is_used){
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Esse token já foi utilizado.',
      });
    }
    
    await this.userService.activateUser({
      userId: tokenData.user_id,
      password: validateTokenDto.password,
    });

    await this.tokenProvider.invalidateToken(validateTokenDto.token);

   
    const templatePath = join(
      process.cwd(),
      'src/modules/user/infra/views/emails/success.hbs',
    );

    await this.emailProvider.send({
      subject: 'Cadastro Realizado com Sucesso - SIEHP',
      to: tokenData.user.email,
      templateData: {
        filePath: templatePath,
        variables: {
          userName: tokenData.user.email,
          frontendUrl: process.env.FRONTEND_URL,
        },
      },
    });

    return res.status(HttpStatus.OK).json({
      message: 'Conta criada com sucesso',
    });
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('user-token')
  @Get('/validate-access-token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token de acesso validado com sucesso',
  })
  @ApiOperation({ summary: 'Valida o token de acesso do usuário' })
  async validateAccessToken(@Req() req: Request, @Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      isValid: true,
    });
  }
}
