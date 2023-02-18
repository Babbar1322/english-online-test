import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections
import { RegisterForm } from '../sections/auth/register';
import { fadeInUp, fadeInLeft } from '../utils/animations';
import { selectIsLoggedIn } from '../redux/slices/mainSlice';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(8, 0),
  animation: `${fadeInUp} 0.4s ease`,
}));

const Image = styled('img')({
  animation: `${fadeInLeft} 0.4s ease`,
});

const Heading = styled(Typography)({
  animation: `${fadeInUp} 0.4s ease`,
});

// ----------------------------------------------------------------------

export default function RegisterPage() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();
  const mdUp = useResponsive('up', 'md');

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard/app');
    }
  }, [isLoggedIn]);

  return (
    <>
      <Helmet>
        <title> Register | ESOL </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection>
            {/* <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography> */}
            <Heading variant="h3" sx={{ px: 5, mt: 5, mb: 5 }}>
              Get Started
            </Heading>
            <Image src="/assets/illustrations/illustration_register.png" alt="register" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            {/* <Typography variant="h4" gutterBottom>
              Sign in to ESOL
            </Typography> */}
            <Heading variant="h4" gutterBottom>
              Create a new Account
            </Heading>

            <Typography variant="body2" sx={{ mb: 5 }}>
              Already have an account? {''}
              <Link component={NavLink} to="/login" variant="subtitle2">
                Login
              </Link>
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button fullWidth size="large" color="inherit" variant="outlined" sx={{ boxShadow: 10 }}>
                <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
              </Button>

              <Button fullWidth size="large" color="inherit" variant="outlined" sx={{ boxShadow: 10 }}>
                <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
              </Button>

              <Button fullWidth size="large" color="inherit" variant="outlined" sx={{ boxShadow: 10 }}>
                <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider>

            <RegisterForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
