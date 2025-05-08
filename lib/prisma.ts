import { PrismaClient } from "@/generated/prisma";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaNeon({ connectionString });

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export default prisma;
