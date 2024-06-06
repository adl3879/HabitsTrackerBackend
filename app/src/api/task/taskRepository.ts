import { task } from '@/common/db/schema/task';
import db from '@/common/db';

export const taskRepository = {
  async getAllTasks() {
    db.select().from(task);
  },
};
