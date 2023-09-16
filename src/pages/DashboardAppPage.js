import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { CircularProgress, Grid, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn, selectToken } from '../redux/slices/mainSlice';
// sections
import { AppWidgetSummary } from '../sections/@dashboard/app';
// components
import Container from '../layouts/dashboard/container/Container';
import useAxios from '../hooks/useAxios';
// import Iconify from '../components/iconify';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
    // const dispatch = useDispatch();
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const token = useSelector(selectToken);
    const [loading, setLoading] = useState(false);
    const axios = useAxios();

    const getDashboardDetails = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/userDetails?token=${token}`);
            // console.log(res.data);
            // if (res.status === 200) {
            //   dispatch(setLogin({ user: res.data }));
            // }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // console.log(isLoggedIn, 'Logged IN');
        // if (!isLoggedIn) {
        //   navigate('/login');
        // }
        //  else {
        //   getUserDetails();
        // }
    }, [isLoggedIn]);

    return (
        <>
            <Helmet>
                <title> Dashboard | ESOL </title>
            </Helmet>

            {loading ? (
                <Container maxWidth="xl" sx={{ textAlign: 'center', marginTop: '10%' }}>
                    <CircularProgress />
                </Container>
            ) : (
                <Container maxWidth="xl">
                    <Typography variant="h4" sx={{ mb: 5 }}>
                        Hi, Welcome back
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <AppWidgetSummary
                                title="Test Attempted"
                                color="warning"
                                total={7}
                                icon={'mdi:clipboard-edit-outline'}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <AppWidgetSummary
                                title="Test Completed"
                                total={4}
                                color="info"
                                icon={'mdi:clipboard-check-outline'}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <AppWidgetSummary
                                title="Test Correct"
                                total={3}
                                color="success"
                                icon={'fluent:task-list-ltr-20-regular'}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <AppWidgetSummary title="Available Test" total={25} icon={'mdi:clipboard-search-outline'} />
                        </Grid>
                    </Grid>
                </Container>
            )}
        </>
    );
}
