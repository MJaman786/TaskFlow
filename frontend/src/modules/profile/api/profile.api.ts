import makeRequest from '../../../utils/helpers/MakeRequest';
import { UPDATE_PROFILE, CHANGE_PASSWORD } from '../../../constants/urls';
import type {
  UpdateProfilePayload,
  ChangePasswordPayload,
  UpdateProfileResponseData,
  ChangePasswordResponseData,
} from '../types/profile.types';

export const updateProfileApi = async (payload: UpdateProfilePayload) => {
  const res = await makeRequest<UpdateProfileResponseData>({
    pathname: UPDATE_PROFILE,
    method: 'PATCH',
    showMessage: true,
    values: { ...payload },
    token: true,
  });
  return res;
};

export const changePasswordApi = async (payload: ChangePasswordPayload) => {
  const res = await makeRequest<ChangePasswordResponseData>({
    pathname: CHANGE_PASSWORD,
    method: 'PATCH',
    showMessage: true,
    values: { ...payload },
    token: true,
  });
  return res;
};