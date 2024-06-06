import { Hono } from 'hono';

import { taskService } from './taskService';

const task = new Hono();

task.get('/', async (c) => {
  const serviceResponse = await taskService.getAllTasks();
  return c.json(serviceResponse, serviceResponse.statusCode);
});

export default task;
