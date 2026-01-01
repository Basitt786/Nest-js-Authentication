import { neon } from "@neondatabase/serverless";
import { Global, Module } from "@nestjs/common";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema/register.schema";

export const DRIZZLE = 'DRIZZLE';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: () => {
        const client = neon(process.env.DATABASE_URL!);
        return drizzle(client, { schema });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}