import { Params } from 'nestjs-pino';
import { Request, Response } from 'express';

export const loggerConfig: Params = {
  pinoHttp: {
    level: 'info',
    customProps: (req) => ({
      correlationId: req.headers['x-request-id'] || crypto.randomUUID(),
    }),
    formatters: {
      level: (label) => ({ level: label.toUpperCase() }),
    },
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              singleLine: true,
              translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
            },
          }
        : undefined,
    serializers: {
      req: (req: Request) => ({
        method: req.method,
        url: req.url,
        headers: {
          'user-agent': req.headers['user-agent'],
        },
        params: req.params,
        query: req.query,
      }),
      res: (res: Response) => ({
        statusCode: res.statusCode,
      }),
    },
  },
};
