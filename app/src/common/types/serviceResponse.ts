import { StatusCode } from 'hono/utils/http-status';
import { z } from 'zod';

export enum ResponseStatus {
  Success,
  Failed,
}

export class ServiceResponse<T = null> {
  success: boolean;
  message: string;
  responseObject: T;
  statusCode: StatusCode;

  constructor(status: ResponseStatus, message: string, responseObject: T, statusCode: StatusCode) {
    this.success = status === ResponseStatus.Success;
    this.message = message;
    this.responseObject = responseObject;
    this.statusCode = statusCode;
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    responseObject: dataSchema.optional(),
    statusCode: z.number(),
  });
