import prisma from '../config/database';
import { hashPassword, verifyPassword } from '../utils/password.utils';
import { generateToken } from '../utils/jwt.utils';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types';

export class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
      },
    });

    const token = generateToken({ id: user.id, email: user.email });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    };
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await verifyPassword(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken({ id: user.id, email: user.email });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    };
  }
}

export const authService = new AuthService();
