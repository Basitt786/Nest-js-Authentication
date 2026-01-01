import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ExpressAdapter } from '@nestjs/platform-express';
import  express from 'express';

// For Vercel serverless
const expressApp = express();
let cachedApp;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp)
    );
    
    // Enable CORS for production
    app.enableCors({
      origin: process.env.FRONTEND_URL || '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true, 
        disableErrorMessages: false, 
      }),
    );

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then(() => {
    expressApp.listen(3000, () => {
      console.log(`🚀 Backend running on http://localhost:3000`);
    });
  });
}

// Export for Vercel
export default async (req, res) => {
  await bootstrap();
  return expressApp(req, res);
};