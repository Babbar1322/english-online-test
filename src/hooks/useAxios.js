import axios from 'axios';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setLogout } from '../redux/slices/mainSlice';

const useAxios = () => {
    const dispatch = useDispatch();
    const instance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        withCredentials: true,
    });

    instance.interceptors.response.use(
        (res) => {
            // console.log(res, 'Response');
            return res;
        },
        (err) => {
            console.log(err.response, 'Error');
            if (err.response && err.response.data.message === 'Token has expired') {
                // console.log('Token has expired');
                toast.error('Your Login Session has expired. Please login again.');
                dispatch(setLogout());
            }
            return Promise.reject(err);
        }
    );

    return instance;
};

export default useAxios;
