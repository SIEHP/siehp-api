export interface FindTokenDTO {
  token: string;
}

export interface FindTokenDTOResponse {
  id: number;
  token: string;
  userId: number;
  createdAt: Date;
  expiresAt: Date;
  user: {
    id: number;
    email: string;
  };
}
