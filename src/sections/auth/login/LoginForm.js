import { useState } from 'react';
// import { NavLink as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// @mui
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { setLogin, setToken } from '../../../redux/slices/mainSlice';
import useAxios from '../../../hooks/useAxios';

// ----------------------------------------------------------------------

export default function LoginForm() {
    const dispatch = useDispatch();
    const axios = useAxios();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };
    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleClick = async () => {
        try {
            // return;
            setLoading(true);
            const res = await axios.post('/login', {
                email,
                password,
            });
            // console.log(res);
            if (res.status === 200) {
                dispatch(setToken(res.data.token));
                dispatch(setLogin({ user: res.data.user }));
                // navigate('/dashboard/login');
            }
        } catch (err) {
            console.log(err);
            // alert(err);
            toast(err.response?.data.error, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: 'light',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack spacing={3}>
                <ToastContainer />
                <TextField name="email" label="Email address" onChange={handleEmail} defaultValue={email} />

                <TextField
                    name="password"
                    label="Password"
                    onChange={handlePassword}
                    defaultValue={password}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>

            {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" title="Remember Me" />
        <Link component={NavLink} variant="subtitle2" underline="hover" to="/">
          Forgot password?
        </Link>
      </Stack> */}

            <LoadingButton
                loading={loading}
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                onClick={handleClick}
            >
                Login
            </LoadingButton>
        </>
    );
}
