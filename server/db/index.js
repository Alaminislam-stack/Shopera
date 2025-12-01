import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

const connectDB = async () => {
  try {
    await client`SELECT 1`;
    console.log("Database connected");
  } catch (error) {
    console.log("Database connection error", error);
  }
};

export default connectDB;
