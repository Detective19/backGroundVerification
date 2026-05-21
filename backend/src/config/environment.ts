import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value || defaultValue || '';
};

export const config = {
  nodeEnv: getEnv('NODE_ENV', 'development'),
  port: parseInt(getEnv('PORT', '3000')),
  databaseUrl: getEnv('DATABASE_URL'),
  jwt: {
    secret: getEnv('JWT_SECRET'),
    expiry: getEnv('JWT_EXPIRY', '7d'),
  },
};
