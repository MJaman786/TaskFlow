import makeRequest from '../../../utils/helpers/MakeRequest';
import {
  TIME_LOGS,
  TIME_LOG_ACTIVE,
  TIME_LOG_START,
  TIME_LOG_STOP,
  TIME_LOG_MANUAL,
  TIME_LOG_BY_ID,
} from '../../../constants/urls';
import type {
  StartTimerPayload,
  StartTimerResponseData,
  StopTimerPayload,
  StopTimerResponseData,
  ManualLogPayload,
  ManualLogResponseData,
  TimeLogQueryParams,
  TimeLogsResponseData,
  ActiveTimerResponseData,
} from '../types/timetrack.types';

export const getActiveTimerApi = async () => {
  const res = await makeRequest<ActiveTimerResponseData>({
    pathname: TIME_LOG_ACTIVE,
    method: 'GET',
    token: true,
  });
  return res;
};

export const startTimerApi = async (payload: StartTimerPayload) => {
  const res = await makeRequest<StartTimerResponseData>({
    pathname: TIME_LOG_START,
    method: 'POST',
    showMessage: true,
    values: { ...payload },
    token: true,
  });
  return res;
};

export const stopTimerApi = async (payload?: StopTimerPayload) => {
  const res = await makeRequest<StopTimerResponseData>({
    pathname: TIME_LOG_STOP,
    method: 'POST',
    showMessage: true,
    values: payload ? { ...payload } : {},
    token: true,
  });
  return res;
};

export const logManualTimeApi = async (payload: ManualLogPayload) => {
  const res = await makeRequest<ManualLogResponseData>({
    pathname: TIME_LOG_MANUAL,
    method: 'POST',
    showMessage: true,
    values: { ...payload },
    token: true,
  });
  return res;
};

export const getTimeLogsApi = async (params?: TimeLogQueryParams) => {
  const res = await makeRequest<TimeLogsResponseData>({
    pathname: TIME_LOGS,
    method: 'GET',
    params: { ...params },
    token: true,
  });
  return res;
};

export const deleteTimeLogApi = async (id: string) => {
  const res = await makeRequest<null>({
    pathname: TIME_LOG_BY_ID(id),
    method: 'DELETE',
    showMessage: true,
    token: true,
  });
  return res;
};