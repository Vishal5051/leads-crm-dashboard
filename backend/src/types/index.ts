export type UserRole = 'Admin' | 'Sales User';

export interface IUserPayload {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
    }
  }
}
