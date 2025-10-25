export interface User {
  userId?: number;
  fullName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  address?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}