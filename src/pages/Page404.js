import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';
import { fadeInZoom } from '../utils/animations';

// ----------------------------------------------------------------------

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '90vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(10, 0),
  animation: `${fadeInZoom} 0.4s ease`,
}));

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <>
      <Helmet>
        <title> 404 Page Not Found | ESOL </title>
      </Helmet>

      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
            Sorry, page not found!
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your
            spelling.
          </Typography>

          <Box
            component="img"
            src="/assets/illustrations/illustration_404.svg"
            sx={{ height: 260, mx: 'auto', my: { xs: 3, sm: 7 } }}
          />

          <Button to="/" size="large" variant="contained" component={RouterLink}>
            Go to Home
          </Button>
        </StyledContent>
      </Container>
    </>
  );
}
