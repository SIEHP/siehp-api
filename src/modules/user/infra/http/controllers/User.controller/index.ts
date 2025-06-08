import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AllExceptionsFilterDTO } from 'src/shared/infra/filters/AllException.filter/dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUseCase } from 'src/modules/user/infra/usecases/Login.usecase';
import { AuthGuard } from '../../guards/Jwt.guard';
import {
  LoginBodyDTO,
  LoginResponseDTO,
} from 'src/modules/user/infra/requests/Login.request/dto';
import {
  InviteBodyDTO,
  InviteResponseDTO,
} from 'src/modules/user/infra/requests/InviteProfessor.request/dto';
import { ValidateTokenBodyDTO } from 'src/modules/user/infra/requests/ValidateToken.request/dto';
import { InviteProfessorUseCase } from '../../../usecases/InviteProfessor.usecase';
import { ValidateTokenUseCase } from '../../../usecases/ValidateToken.usecase';

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
    private inviteProfessorUseCase: InviteProfessorUseCase,
    private validateTokenUseCase: ValidateTokenUseCase,
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
  @Post('/invite/professor')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Convite enviado com sucesso',
    type: InviteResponseDTO,
  })
  @ApiOperation({ summary: 'Envia convite para professor' })
  async inviteProfessor(
    @Body() inviteDto: InviteBodyDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const inviteResponse = await this.inviteProfessorUseCase.execute({
      user_email: req.user.email,
      email: inviteDto.email,
    });

    return res.status(HttpStatus.OK).json(inviteResponse);
  }

  @Post('/validate-token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token validado com sucesso',
  })
  @ApiOperation({ summary: 'Valida token de convite e cria conta' })
  async validateToken(
    @Body() validateTokenDto: ValidateTokenBodyDTO,
    @Res() res: Response,
  ) {
    const validateTokenResponse =
      await this.validateTokenUseCase.execute(validateTokenDto);

    return res.status(HttpStatus.OK).json(validateTokenResponse);
  }
}
