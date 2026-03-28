// data/passwordResetsServices.js
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


