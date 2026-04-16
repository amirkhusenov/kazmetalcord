import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const parsedEnvSchema = z.object({
    MONGODB_URI: z.string(),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
});

export const parsedEnv = parsedEnvSchema.parse(process.env);

console.log(`MONGODB_URI: ${parsedEnv.MONGODB_URI}`);
console.log(`CLOUDINARY_CLOUD_NAME: ${parsedEnv.CLOUDINARY_CLOUD_NAME}`);
console.log(`CLOUDINARY_API_KEY: ${parsedEnv.CLOUDINARY_API_KEY}`);
console.log(`CLOUDINARY_API_SECRET: ${parsedEnv.CLOUDINARY_API_SECRET}`);
