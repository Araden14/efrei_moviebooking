export declare function hashPassword(plainPassword: string): Promise<string>;
export declare function comparePasswords(plainPassword: string, hash: string): Promise<boolean>;
