import { Button, Grid, styled, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';

import Iconify from '../components/iconify';
import Header from '../layouts/testDashboard/header';
import { selectToken } from '../redux/slices/mainSlice';

const H2 = styled('h2')({
  fontWeight: 'bold',
  textAlign: 'center',
});
export default function TestDashboard() {
  const { state } = useLocation();

  const token = useSelector(selectToken);

  const getTestData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-test-details?id=${state.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (state.id) {
      getTestData();
    }
  }, []);
  return (
    <div>
      <Header button="home" />
      {!state.id ? (
        <div>
          <H2>
            Bad Request!!
            <br />
            Please Go to Dashboard
          </H2>
        </div>
      ) : (
        <>
          <H2>Practice Test Overview</H2>
          <Grid container gap={5} columns={14} justifyContent="center">
            <Grid item md={4} padding={2} borderRadius={3} sx={{ boxShadow: 4 }}>
              <Typography align="center" sx={{ fontSize: '1.2rem' }}>
                Listening
              </Typography>
              <Grid container spacing={7} paddingY={2}>
                <Grid item alignItems={'center'}>
                  <Iconify icon="ic:outline-book" />
                  <Typography component={'span'}>40 Questions</Typography>
                </Grid>
                <Grid item alignItems={'center'}>
                  <Iconify icon="mdi:clock-time-four-outline" />
                  <Typography component={'span'}>30 Minutes</Typography>
                </Grid>
              </Grid>
              <Button variant="contained" fullWidth>
                START
              </Button>
            </Grid>
            <Grid item md={4} padding={2} borderRadius={3} sx={{ boxShadow: 4 }}>
              <Typography align="center" sx={{ fontSize: '1.2rem' }}>
                Reading
              </Typography>
              <Grid container spacing={7} paddingY={2}>
                <Grid item alignItems={'center'}>
                  <Iconify icon="ic:outline-book" />
                  <Typography component={'span'}>40 Questions</Typography>
                </Grid>
                <Grid item alignItems={'center'}>
                  <Iconify icon="mdi:clock-time-four-outline" />
                  <Typography component={'span'}>60 Minutes</Typography>
                </Grid>
              </Grid>
              <Button
                component={NavLink}
                to={{ pathname: '/test/reading', state: { id: state.id } }}
                variant="contained"
                color="success"
                fullWidth
              >
                RESUME
              </Button>
            </Grid>
            <Grid item md={4} padding={2} borderRadius={3} sx={{ boxShadow: 4 }}>
              <Typography align="center" sx={{ fontSize: '1.2rem' }}>
                Writing
              </Typography>
              <Grid container spacing={7} paddingY={2}>
                <Grid item alignItems={'center'}>
                  <Iconify icon="ic:outline-book" />
                  <Typography component={'span'}>2 Questions</Typography>
                </Grid>
                <Grid item alignItems={'center'}>
                  <Iconify icon="mdi:clock-time-four-outline" />
                  <Typography component={'span'}>60 Minutes</Typography>
                </Grid>
              </Grid>
              <Button variant="contained" color="warning" fullWidth>
                REVIEW
              </Button>
            </Grid>
          </Grid>

          <Grid container gap={5} columns={13} marginTop={3} justifyContent="center">
            <Grid item md={6} padding={2} borderRadius={3} sx={{ boxShadow: 4 }}>
              <Typography align="center" sx={{ fontSize: '1.2rem' }}>
                Your Target
              </Typography>
              <Typography align="center" fontWeight={'bold'} sx={{ fontSize: '1.2rem' }}>
                9 <br /> <span style={{ fontSize: '0.8rem' }}>Overall bands</span>
              </Typography>
              <Grid container spacing={7} paddingY={2}>
                <Grid item alignItems={'center'}>
                  <Typography component={'h1'} align="center" fontWeight={'bold'}>
                    8.5
                  </Typography>
                  <Typography>Listening</Typography>
                </Grid>
                <Grid item alignItems={'center'}>
                  <Typography component={'h1'} align="center" fontWeight={'bold'}>
                    8.5
                  </Typography>
                  <Typography>Reading</Typography>
                </Grid>
                <Grid item alignItems={'center'}>
                  <Typography component={'h1'} align="center" fontWeight={'bold'}>
                    8.5
                  </Typography>
                  <Typography>Writing</Typography>
                </Grid>
                <Grid item alignItems={'center'}>
                  <Typography component={'h1'} align="center" fontWeight={'bold'}>
                    8.5
                  </Typography>
                  <Typography>Overall</Typography>
                </Grid>
              </Grid>
              <Button variant="contained" color="secondary" fullWidth>
                Reset Target
              </Button>
            </Grid>
            <Grid
              item
              md={6}
              padding={2}
              borderRadius={3}
              sx={{ boxShadow: 4 }}
              alignItems="center"
              justifyContent="center"
            >
              <Typography align="center">
                <Iconify icon="ic:outline-play-circle" width={30} />
              </Typography>
              <H2>ESOL Overview</H2>
              <Typography>How Listening, Reading and Writing section appear.</Typography>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
}
