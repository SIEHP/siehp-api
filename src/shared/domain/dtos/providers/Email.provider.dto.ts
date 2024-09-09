type TempleteVariables = Record<string, string | number | []>;

export interface ParseTemplateDTO {
  file: string;
  variables: TempleteVariables;
}

export interface SendDTO {
  to: string;
  subject: string;
  templateData: ParseTemplateDTO;
}

export interface ServiceDTO {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
}
