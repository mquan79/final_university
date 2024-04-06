import axios from 'axios';
import * as ENV from '../env'
const apiUrl = `http://${ENV.env.ipv4}:5000`;

export const get = async (url) => {
  try {
    const response = await axios.get(`${apiUrl}/${url}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getById = async (id, url) => {
  try {
    const response = await axios.get(`${apiUrl}/${url}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const add = async (data, url) => {
  try {
    const response = await axios.post(`${apiUrl}/${url}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updated = async (id, updatedData, url) => {
  try {
    const response = await axios.put(`${apiUrl}/${url}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleted = async (id, url) => {
  try {
    const response = await axios.delete(`${apiUrl}/${url}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletedAll = async (url) => {
  try {
    const response = await axios.delete(`${apiUrl}/${url}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
