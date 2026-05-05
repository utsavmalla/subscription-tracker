import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { defineConfig, env } from "prisma/config";

for (const envFile of [".env", "apps/web/.env", "apps/web/.env.local"]) {
  if (existsSync(envFile)) {
    loadEnvFile(envFile);
  }
}

export default defineConfig({
  schema: "apps/web/prisma/schema.prisma",
  migrations: {
    path: "apps/web/prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
