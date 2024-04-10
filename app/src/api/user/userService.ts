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

  registerUser: async (user: InsertUser): Promise<ServiceResponse<{ token: string } | null>> => {
    try {
      // check if user already exists
      const existingUser = await userRepository.findByEmail(user.email);
      if (existingUser.length > 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'User already exists', null, StatusCodes.CONFLICT);
      }

      // hash password
      const password = await Bun.password.hash(user.password, {
        algorithm: 'bcrypt',
        cost: 4, // number between 4-31
      });
      user.password = password;

      await userRepository.insertUser(user);

      // generate token
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

  loginUser: async (email: string, password: string): Promise<ServiceResponse<{ token: string } | null>> => {
    try {
      // check if user already exists
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser.length < 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'User does not exists', null, StatusCodes.CONFLICT);
      }

      // compare password
      const user = existingUser[0];
      const passwordMatch = await Bun.password.verify(password, user.password);
      if (!passwordMatch) {
        return new ServiceResponse(ResponseStatus.Failed, 'Invalid credentials', null, StatusCodes.UNAUTHORIZED);
      }

      // generate token
      const payload = {
        sub: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expires in 60 minutes
      };
      const token = await sign(payload, process.env.JWT_SECRET as string);

      return new ServiceResponse(ResponseStatus.Success, 'User registered', { token }, StatusCodes.CREATED);
    } catch (e) {
      logger.error('Failed to login user', e);
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Failed to login user',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};
