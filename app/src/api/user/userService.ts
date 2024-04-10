import { sign } from 'hono/jwt';
import { StatusCodes } from 'http-status-codes';

import { InsertUser, User } from '@/common/db/schema/user';
import { ResponseStatus, ServiceResponse } from '@/common/types/serviceResponse';
import logger from '@/common/utils/logger';

import { userRepository } from './userRepository';

export const userService = {
  // Retrieves all users from the database
  findAllUsers: async (): Promise<ServiceResponse<User | null>> => {
    try {
      const users = await userRepository.findAll();
      if (users.length === 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'No users found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse(ResponseStatus.Success, 'All users fetched', null, StatusCodes.OK);
    } catch (e) {
      logger.error('Failed to fetch users', e);
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Failed to fetch users',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  // register user
  registerUser: async (user: InsertUser): Promise<ServiceResponse<{ token: string } | null>> => {
    try {
      // hash password
      const password = await Bun.password.hash(user.password, {
        algorithm: 'bcrypt',
        cost: 4, // number between 4-31
      });
      user.password = password;

      await userRepository.insertUser(user);

      const payload = {
        sub: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expires in 60 minutes
      };
      const token = await sign(payload, process.env.JWT_SECRET as string);

      return new ServiceResponse(ResponseStatus.Success, 'User registered', { token }, StatusCodes.CREATED);
    } catch (e) {
      logger.error('Failed to register user', e);
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Failed to register user',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};
