import { InviteResponseDTO } from '../../requests/InviteProfessor.request/dto';
import { InviteBodyDTO } from '../../requests/InviteProfessor.request/dto';

export interface InviteProfessorUseCaseDTO extends InviteBodyDTO {
  user_email: string;
}

export interface InviteProfessorUseCaseResponseDTO extends InviteResponseDTO {}
