import jwt from 'jsonwebtoken';
import configs from '../configs';
import { IUserAuthInterface } from '../interfaces/user';

const { JWT_SECRET, JWT_ALGORITHM, JWT_ACCESS_VALIDITY, JWT_REFRESH_VALIDITY } = configs;

const options = {
  algorithm: JWT_ALGORITHM,
  expiresIn: JWT_ACCESS_VALIDITY,
};

// export const JWT_AUTHORIZATION_REGEXP = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

export async function decodeToken(token: string): Promise<IUserAuthInterface> {
  return jwt.verify(token, JWT_SECRET);
}

export async function generateTokens(
  user: IUserAuthInterface
): Promise<{ access: string; refresh: string }> {
  const refresh = await generateRefreshToken(user);
  const access = await generateAccessToken(user);

  return {
    access,
    refresh,
  };
}

export async function renewAccessToken(refresh: string): Promise<string> {
  const user = jwt.verify(refresh, JWT_SECRET);
  const access = await generateRefreshToken(user);
  return access;
}

// private methods
async function generateAccessToken(user: IUserAuthInterface): Promise<string> {
  return jwt.sign(user, JWT_SECRET, options);
}

async function generateRefreshToken(user: IUserAuthInterface): Promise<string> {
  return jwt.sign(user, JWT_SECRET, { ...options, expiresIn: JWT_REFRESH_VALIDITY });
}
