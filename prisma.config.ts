import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "apps/web/prisma/schema.prisma",
  migrations: {
    path: "apps/web/prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
