import * as bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from '../auth.module';

export class AuthUtilsCrypt {
  public static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  public static isHash(password: string): boolean {
    return password.slice(0, 3) === '$2a' && password.length === 60;
  }

  public static generateCode(): string {
    return Date.now().toString(32).slice(0, 6).toUpperCase();
  }

  public static matchPassword(paramPassword: string, userHashPassword: string): boolean {
    const status = bcrypt.compareSync(paramPassword, userHashPassword);
    return status;
  }
}
