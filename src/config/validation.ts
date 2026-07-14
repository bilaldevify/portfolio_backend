import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(4000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  FRONTEND_URL: Joi.string().uri().required(),

  DATABASE_URL: Joi.string().uri({ scheme: ['mysql'] }).required(),

  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),

  UPLOAD_DIR: Joi.string().default('uploads'),
  MAX_FILE_SIZE_MB: Joi.number().default(10),
});
