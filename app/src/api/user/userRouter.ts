import { Hono } from 'hono';

import { userService } from './userService';

const user = new Hono();

user.get('/', async (c) => {
  const serviceResponse = await userService.findAllUsers();
  return c.json(serviceResponse, serviceResponse.statusCode);
});

// user.post('/register', validator(insertUserSchema), async (c) => {
//   const { body } = c.req.valid('form');
//   const user = {
//     name: body.name as string,
//     email: body.email as string,
//     password: body.password as string,
//     role: 'user',
//   } satisfies InsertUser;
//   const serviceResponse = await userService.registerUser(user);
//   return c.json(serviceResponse, serviceResponse.statusCode);
// });

// user.post('/login', validator(insertUserSchema.pick({ email: true, password: true })), async (c) => {
//   const body = await c.req.parseBody();
//   const serviceResponse = await userService.loginUser(body.email as string, body.password as string);
//   return c.json(serviceResponse, serviceResponse.statusCode);
// });

export default user;
