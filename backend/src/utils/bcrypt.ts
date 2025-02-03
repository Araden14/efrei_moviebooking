import * as bcrypt from 'bcrypt';

export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  console.log(hashedPassword)
  return hashedPassword;
}

export async function comparePasswords(plainPassword: string, hash: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(plainPassword, hash);
  return isMatch;
}