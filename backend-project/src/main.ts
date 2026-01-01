import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for Next.js frontend
  app.enableCors({
    origin: 'http://localhost:3001', // Next.js runs on 3000
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global validation pipe (optional - comment out if causing issues)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Remove extra properties
      transform: true,            // Transform payload to DTO instances
      forbidNonWhitelisted: true, // Throw error if extra properties
      disableErrorMessages: false, // Show error messages
    }),
  );

  await app.listen(3000);
  console.log(`🚀 Backend running on http://localhost:3000`);
  console.log(`🔗 CORS enabled for: http://localhost:3000`);
}

bootstrap();