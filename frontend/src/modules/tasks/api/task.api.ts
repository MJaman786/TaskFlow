import makeRequest from '../../../utils/helpers/MakeRequest';
import {
  TASKS,
  TASK_BY_ID,
  TASK_AI_SUGGEST,
} from '../../../constants/urls';
import type {
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskQueryParams,
  NlpSuggestPayload,
  TasksResponseData,
  SingleTaskResponseData,
  NlpSuggestResponseData,
} from '../types/task.types';

export const getTasksApi = async (params?: TaskQueryParams) => {
  const res = await makeRequest<TasksResponseData>({
    pathname: TASKS,
    method: 'GET',
    params: { ...params },
    token: true,
  });
  return res;
};

export const getTaskByIdApi = async (id: string) => {
  const res = await makeRequest<SingleTaskResponseData>({
    pathname: TASK_BY_ID(id),
    method: 'GET',
    token: true,
  });
  return res;
};

export const createTaskApi = async (payload: CreateTaskPayload) => {
  const res = await makeRequest<SingleTaskResponseData>({
    pathname: TASKS,
    method: 'POST',
    showMessage: true,
    values: { ...payload },
    token: true,
  });
  return res;
};

export const updateTaskApi = async (id: string, payload: UpdateTaskPayload) => {
  const res = await makeRequest<SingleTaskResponseData>({
    pathname: TASK_BY_ID(id),
    method: 'PATCH',
    showMessage: true,
    values: { ...payload },
    token: true,
  });
  return res;
};

export const deleteTaskApi = async (id: string) => {
  const res = await makeRequest<null>({
    pathname: TASK_BY_ID(id),
    method: 'DELETE',
    showMessage: true,
    token: true,
  });
  return res;
};

export const nlpSuggestTaskApi = async (payload: NlpSuggestPayload) => {
  const res = await makeRequest<NlpSuggestResponseData>({
    pathname: TASK_AI_SUGGEST,
    method: 'POST',
    showMessage: false,
    values: { ...payload },
    token: true,
  });
  return res;
};