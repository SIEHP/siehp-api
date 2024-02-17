import { DocumentBuilder } from '@nestjs/swagger';

export const sharedSwaggerConfig = new DocumentBuilder()
  .setTitle('SIEHP - Módulo Compartilhado')
  .setDescription(
    'Documentação de roteamento do módulo Compartilhado para a interface de programação da aplicação SIEHP.',
  )
  .setVersion('0.0.1')
  .setLicense('MIT', 'https://opensource.org/licenses/MIT')
  .setExternalDoc('REPO', 'https://github.com/SIEHP/siehp-api')
  .build();
