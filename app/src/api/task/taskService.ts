import { ResponseStatus, ServiceResponse } from '@/common/types/serviceResponse';
import { taskRepository } from './taskRepository';
import { StatusCodes } from 'http-status-codes';

export const taskService = {
  async getAllTasks() {
    try {
      const tasks = taskRepository.getAllTasks();
      return new ServiceResponse(ResponseStatus.Success, 'All tasks fetched', tasks, StatusCodes.OK);
    } catch (e) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Failed to fetch tasks',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};
