import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigModule as ConfigModuleInternal } from '@nestjs/config';
import Joi from 'joi';

export interface ConfigModuleOptions {
  folder: string;
  environment: string;
  isGlobal: boolean;
}

@Module({})
export class ConfigModule {
  static register(options: ConfigModuleOptions): DynamicModule {
    return {
      imports: [
        ConfigModuleInternal.forRoot({
          envFilePath: `config/${process.env.NODE_ENV || 'development'}.env`,
          validationSchema: Joi.object({
            NODE_ENV: Joi.string()
              .valid('development', 'production', 'test', 'provision')
              .default('development'),
            DATABASE_HOST: Joi.string().required(),
            DATABASE_TYPE: Joi.string().default('postgres'),
            DATABASE_SSL: Joi.boolean().default(false),
            DATABASE_PORT: Joi.number().default(5432),
            DATABASE_USERNAME: Joi.string().required(),
            DATABASE_PASSWORD: Joi.string().required(),
            DATABASE_NAME: Joi.string().required(),
          }),
        }),
      ],
      module: ConfigModule,
      providers: [ConfigService],
      exports: [ConfigService],
      global: options.isGlobal,
    };
  }
}
