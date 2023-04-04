import axios from 'axios';

const instance = axios.create({
    xsrfHeaderName: 'X-XSRF-TOKEN',
    'Access-Control-Allow-Origin': '*',
});

export default instance;
