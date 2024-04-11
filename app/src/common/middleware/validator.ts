import { validator as honoValidator } from 'hono/validator';
import { StatusCodes } from 'http-status-codes';

export const validator = (schema: any) =>
  honoValidator('form', (value, c) => {
    try {
      schema.parse(value);
      return { body: value };
    } catch (e: any) {
      const errorMessage = e.errors[0].message;
      return c.json({ success: false, message: errorMessage }, StatusCodes.BAD_REQUEST);
    }
  });
