import { forwardRef, useState } from 'react';
// import { NavLink as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// @mui
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { setLogin, setToken } from '../../../redux/slices/mainSlice';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  // const NavLink = forwardRef((props, ref) => <RouterLink ref={ref} {...props} />);

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
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        email,
        password,
      });
      // console.log(res.data);
      if (res.status === 200) {
        dispatch(setToken(res.data.token));
        dispatch(setLogin({ user: null }));
        // navigate('/dashboard/login');
      }
    } catch (err) {
      // console.log(err.response.data.message);
      // alert(err);
      toast('Login Failed!', {
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
