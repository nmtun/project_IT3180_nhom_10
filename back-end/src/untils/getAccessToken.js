import crypto from "crypto";

const secretKey = crypto.randomBytes(64).toString('hex');
console.log(secretKey);