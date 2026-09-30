import makeRequest from '../../../utils/helpers/MakeRequest';
import {
  DASHBOARD,
  DASHBOARD_DAILY,
  DASHBOARD_MATRIX,
  DASHBOARD_OVERVIEW,
} from '../../../constants/urls';
import type {
  DashboardQueryParams,
  ActivityMatrixQueryParams,
  ConsolidatedDashboardResponseData,
  DailySummaryResponseData,
  ActivityMatrixResponseData,
  TaskOverviewResponseData,
} from '../types/dashboard.types';

export const getConsolidatedDashboardApi = async (params?: DashboardQueryParams) => {
  const res = await makeRequest<ConsolidatedDashboardResponseData>({
    pathname: DASHBOARD,
    method: 'GET',
    params: { ...params },
    token: true,
  });
  return res;
};

export const getDailySummaryApi = async () => {
  const res = await makeRequest<DailySummaryResponseData>({
    pathname: DASHBOARD_DAILY,
    method: 'GET',
    token: true,
  });
  return res;
};

export const getActivityMatrixApi = async (params?: ActivityMatrixQueryParams) => {
  const res = await makeRequest<ActivityMatrixResponseData>({
    pathname: DASHBOARD_MATRIX,
    method: 'GET',
    params: { ...params },
    token: true,
  });
  return res;
};

export const getTaskOverviewApi = async () => {
  const res = await makeRequest<TaskOverviewResponseData>({
    pathname: DASHBOARD_OVERVIEW,
    method: 'GET',
    token: true,
  });
  return res;
};