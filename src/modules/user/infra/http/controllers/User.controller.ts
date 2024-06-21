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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidationException } from 'src/shared/domain/errors/Validation.exception';
import { LoginUseCase } from 'src/modules/user/infra/usecases/Login.usecase';
import { AuthGuard } from '../guards/Jwt.guard';
import { LoginBodyDTO } from 'src/modules/user/domain/dtos/requests/Login.request.dto';

@Controller('user')
@ApiTags('User')
@ApiResponse({
  status: new ValidationException().getStatus(),
  description: new ValidationException().message,
  type: AllExceptionsFilterDTO,
})
export class UserController {
  constructor(private loginUseCase: LoginUseCase) {}

  @Post('login')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login realizado com sucesso',
    //type: ,
  })
  @ApiOperation({ summary: 'Realiza o login do usuário' })
  async login(@Body() loginDto: LoginBodyDTO, @Res() res: Response) {
    const loginResponse = await this.loginUseCase.execute(loginDto);
    return res.status(HttpStatus.OK).json(loginResponse);
  }

  @UseGuards(AuthGuard)
  @Get('/teste')
  async getExample(@Req() req: Request, @Res() res: Response) {
    return res.status(HttpStatus.OK).json({ user: req.user });
  }
}
