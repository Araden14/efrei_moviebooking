"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePasswords = comparePasswords;
const bcrypt = require("bcrypt");
async function hashPassword(plainPassword) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    console.log(hashedPassword);
    return hashedPassword;
}
async function comparePasswords(plainPassword, hash) {
    const isMatch = await bcrypt.compare(plainPassword, hash);
    return isMatch;
}
//# sourceMappingURL=bcrypt.js.map