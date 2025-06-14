import { DocumentBuilder } from '@nestjs/swagger';

export const sharedSwaggerConfig = new DocumentBuilder()
  .setTitle('SIEHP')
  .setDescription(
    'Documentação de roteamento para a interface de programação da aplicação SIEHP.',
  )
  .setVersion('0.0.1')
  .setLicense('MIT', 'https://opensource.org/licenses/MIT')
  .setExternalDoc('REPO', 'https://github.com/SIEHP/siehp-api')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Insira um token JWT para autenticar a requisição.',
    },
    'user-token',
  )
  .build();
