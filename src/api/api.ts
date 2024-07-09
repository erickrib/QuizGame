import axios from 'axios';

export const loginApi = axios.create({
  baseURL: 'https://apimmpapp-dev.t-upsolucoes.com.br',
});
