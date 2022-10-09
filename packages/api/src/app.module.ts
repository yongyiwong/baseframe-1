import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.register({
      folder: './config',
      environment: process.env.NODE_ENV || 'development',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [],
      useFactory: (configService: ConfigService) => ({
        type: (configService.get<string>('DATABASE_TYPE') as any) || 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        ssl: configService.get<boolean>('DATABASE_SSL'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        synchronize: false,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
