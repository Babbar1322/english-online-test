import { forwardRef, useEffect, useState } from 'react';
import { NavLink as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { selectIsLoggedIn, setLogin } from '../../../redux/slices/mainSlice';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const NavLink = forwardRef((props, ref) => <RouterLink ref={ref} {...props} />);

  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => {
    dispatch(setLogin());
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn]);

  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" defaultValue={'ravi@gmail.com'} />

        <TextField
          name="password"
          label="Password"
          defaultValue={123456}
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

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/* <Checkbox name="remember" title="Remember Me" /> */}
        <Link component={NavLink} variant="subtitle2" underline="hover" to="/">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
