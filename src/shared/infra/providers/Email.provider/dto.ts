type TempleteVariables = Record<string, string | number | []>;

export interface ParseTemplateDTO {
  filePath: string;
  variables: TempleteVariables;
}

export interface SendDTO {
  to: string;
  subject: string;
  templateData: ParseTemplateDTO;
}
