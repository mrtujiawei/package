import axios, { CreateAxiosDefaults } from 'axios';

const createAxiosInstance = (options: CreateAxiosDefaults) => {
  const instance = axios.create(options);

  instance.interceptors.request.use((value) => {
    console.log(value);
    return value;
  });

  instance.interceptors.response.use((value) => {
    console.log(value);
    if (value.status != 200) {
      throw new Error(value.statusText);
    }
    return value.data;
  });

  return instance;
};

export default createAxiosInstance;
