import { Hono } from 'hono';

import { InsertUser } from '@/common/db/schema/user';

import { userService } from './userService';

const user = new Hono();

user.get('/', async (c) => {
  const serviceResponse = await userService.findAllUsers();
  return c.json(serviceResponse, serviceResponse.statusCode);
});

user.post('/register', async (c) => {
  const body = await c.req.parseBody();
  const user = {
    name: body.name as string,
    email: body.email as string,
    password: body.password as string,
    role: 'user',
  } satisfies InsertUser;
  const serviceResponse = await userService.registerUser(user);
  return c.json(serviceResponse, serviceResponse.statusCode);
});

user.post('/login', async (c) => {
  const body = await c.req.parseBody();
  const serviceResponse = await userService.loginUser(body.email as string, body.password as string);
  return c.json(serviceResponse, serviceResponse.statusCode);
});

export default user;
