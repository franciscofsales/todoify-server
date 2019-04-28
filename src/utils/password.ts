import bcrypt from 'bcryptjs';

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
}

export function authenticatePassword(password: string, hashed: string): boolean {
  return bcrypt.compareSync(password, hashed);
}
