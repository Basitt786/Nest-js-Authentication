import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const expressApp = express();
const PORT = process.env.PORT || 3000;
let cachedApp;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp)
    );
    
    // Add global prefix
    app.setGlobalPrefix('api');
    
    // Enable CORS
    app.enableCors({
      origin: process.env.FRONTEND_URL || '*',
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

// Export for Vercel
export default async (req, res) => {
  const app = await bootstrap();
  return expressApp(req, res);
};

// For local development only
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then(() => {
    expressApp.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}/api`);
    });
  });
}