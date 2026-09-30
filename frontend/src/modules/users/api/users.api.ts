import makeRequest from '../../../utils/helpers/MakeRequest';
import {
  ADMIN_USERS,
  ADMIN_USER_BY_ID,
  ADMIN_USER_STATUS,
  ADMIN_STATS,
} from '../../../constants/urls';
import type {
  AdminUsersQueryParams,
  UpdateUserStatusPayload,
  AdminUsersResponseData,
  AdminUserDetailResponseData,
  UpdateUserStatusResponseData,
  DeleteUserResponseData,
  AdminStatsResponseData,
} from '../types/users.types';

export const getAdminUsersApi = async (params?: AdminUsersQueryParams) => {
  const res = await makeRequest<AdminUsersResponseData>({
    pathname: ADMIN_USERS,
    method: 'GET',
    params: { ...params },
    token: true,
  });
  return res;
};

export const getAdminUserByIdApi = async (id: string) => {
  const res = await makeRequest<AdminUserDetailResponseData>({
    pathname: ADMIN_USER_BY_ID(id),
    method: 'GET',
    token: true,
  });
  return res;
};

export const getAdminStatsApi = async () => {
  const res = await makeRequest<AdminStatsResponseData>({
    pathname: ADMIN_STATS,
    method: 'GET',
    token: true,
  });
  return res;
};

export const updateAdminUserStatusApi = async (
  id: string,
  payload: UpdateUserStatusPayload
) => {
  const res = await makeRequest<UpdateUserStatusResponseData>({
    pathname: ADMIN_USER_STATUS(id),
    method: 'PATCH',
    showMessage: true,
    values: { ...payload },
    token: true,
  });
  return res;
};

export const deleteAdminUserApi = async (id: string) => {
  const res = await makeRequest<DeleteUserResponseData>({
    pathname: ADMIN_USER_BY_ID(id),
    method: 'DELETE',
    showMessage: true,
    token: true,
  });
  return res;
};