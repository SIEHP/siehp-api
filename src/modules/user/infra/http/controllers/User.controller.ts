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
import { AllExceptionsFilterDTO } from 'src/shared/domain/dtos/errors/AllException.filter';
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
    const checkUserPermission = await this.userService.checkUserPermissions({
      user_email: req.user.email,
      neededPermissions: ['ACESSAR_LOGS'],
    });

    if (!checkUserPermission.hasPermission) {
      throw new InvalidPermissionsException({
        permissions: checkUserPermission.notIncludedPermissions,
      });
    }

    return res.status(HttpStatus.OK).json({ user: req.user });
  }
}
