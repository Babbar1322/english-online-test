import { forwardRef, useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { setLogin } from '../../../redux/slices/mainSlice';
import axios from '../../../components/axios';

// ----------------------------------------------------------------------

export default function RegisterForm() {
    const dispatch = useDispatch();

    const NavLink = forwardRef((props, ref) => <RouterLink ref={ref} {...props} />);

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };
    const handleName = (e) => {
        setName(e.target.value);
    };
    const handlePhone = (e) => {
        setPhone(e.target.value);
    };
    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleClick = async () => {
        try {
            setLoading(true);
            const res = await axios.post('/register', {
                email,
                name,
                phone,
                password,
            });
            // console.log(res.data);
            dispatch(setLogin());
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack spacing={3}>
                <TextField name="name" label="Full name" defaultValue={name} onChange={handleName} />
                <TextField name="phone" label="Phone number" defaultValue={phone} onChange={handlePhone} />
                <TextField name="email" label="Email address" defaultValue={email} onChange={handleEmail} />

                <TextField
                    name="password"
                    label="Password"
                    defaultValue={password}
                    onChange={handlePassword}
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

            <LoadingButton
                loading={loading}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                onClick={handleClick}
            >
                Signup
            </LoadingButton>
        </>
    );
}
