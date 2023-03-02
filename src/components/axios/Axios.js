import axios from 'axios';

const instance = axios.create({
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

export default instance;
