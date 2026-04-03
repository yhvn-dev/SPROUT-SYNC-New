import api from '../utils/api.js'; 

export const requestPasswordReset = async (login) => {
  const response = await api.post('/pw/post/request', { 
    login 
  });
  return response.data;
};

export const fetchPasswordRequestsAll = async () => {
  const response = await api.get('/pw/get/all')
  return response.data;
};

export const fetchPasswordRequestsPending = async () => {
  const response = await api.get('/pw/get/pending')
  return response.data;
};

export const approvePasswordReset = async (request_id, password) => {
  const response = await api.patch(`/pw/patch/reset/${request_id}/approve`, { password });
  return response.data;
};

export const rejectPasswordReset = async (request_id) => {
  const response = await api.patch(`/pw/patch/reset/${request_id}/reject`);
  return response.data;
};


export const deletePasswordResetRequest = async (request_id) => {
  const response = await api.delete(`/pw/delete/reset-request/${request_id}`);
  return response.data;
};


