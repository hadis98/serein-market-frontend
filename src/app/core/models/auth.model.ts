export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface SessionUser extends AuthUser {
  /**
   * Temporary compatibility with the
   * old BigBasket frontend.
   */
  custId: number;
  mobileNo: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}