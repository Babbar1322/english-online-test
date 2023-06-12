import { Button, CircularProgress, Grid, styled, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Iconify from '../components/iconify';
import Header from '../layouts/testDashboard/header';
import { selectToken } from '../redux/slices/mainSlice';
import useAxios from '../hooks/useAxios';

const H2 = styled('h2')({
    fontWeight: 'bold',
    textAlign: 'center',
});
export default function TestDashboard() {
    const { state } = useLocation();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const axios = useAxios();
    const token = useSelector(selectToken);

    const getTestData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/get-combined-test/${state?.id}?token=${token}`);

            // console.log(res.data);
            setData(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    const takeTest = async (test_id, test_type) => {
        try {
            const res = await axios.post('/take-test', {
                test_id,
                allocated_test_id: state?.id,
                token,
            });

            console.log(res.data);
            if (res.status === 200) {
                if (test_type === 'writing') {
                    navigate('/test/writing', { state: { id: res.data, allocated_test_id: state?.id } });
                } else if (test_type === 'listening') {
                    navigate('/test/listening', { state: { id: res.data, allocated_test_id: state?.id } });
                } else {
                    navigate('/test/reading', { state: { id: res.data, allocated_test_id: state?.id } });
                }
            }
        } catch (err) {
            // console.log(err);
            // alert(err.response.data);
            toast(err.response.data, {
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
        }
    };

    const millisToMinutesAndSeconds = (millis) => {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        // return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    };

    useEffect(() => {
        if (state?.id) {
            getTestData();
        }
    }, []);
    return (
        <div>
            <Header button="home" />
            <ToastContainer />
            {!state?.id ? (
                <div>
                    <H2>
                        Bad Request!!
                        <br />
                        Please Go to Dashboard
                    </H2>
                </div>
            ) : loading ? (
                <div style={{ textAlign: 'center', marginTop: '10%' }}>
                    <CircularProgress />
                    <H2>Loading...</H2>
                </div>
            ) : (
                <>
                    <H2>Practice Test Overview</H2>
                    <Grid container gap={5} columns={14} justifyContent="center">
                        {data.listening_test && (
                            <Grid item md={4} padding={2} borderRadius={3} sx={{ boxShadow: 4 }}>
                                <Typography align="center" sx={{ fontSize: '1.2rem' }}>
                                    Listening
                                </Typography>
                                <Grid
                                    container
                                    spacing={7}
                                    paddingY={2}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                >
                                    <Grid item alignItems={'center'}>
                                        <Iconify icon="ic:outline-book" />
                                        <Typography component={'span'}>
                                            {data.listening_test.total_questions} Questions
                                        </Typography>
                                    </Grid>
                                    <Grid item alignItems={'center'}>
                                        <Iconify icon="mdi:clock-time-four-outline" />
                                        <Typography component={'span'}>{data.listening_test.time} Minutes</Typography>
                                    </Grid>
                                </Grid>
                                {data.listening_test.is_taken &&
                                    (data.listening_test.is_taken.total_score === null ? (
                                        <Grid
                                            container
                                            spacing={4}
                                            alignItems={'center'}
                                            justifyContent={'space-around'}
                                        >
                                            <Grid item>
                                                <Typography mb={2}>Not Submitted</Typography>
                                            </Grid>
                                        </Grid>
                                    ) : (
                                        <Grid
                                            container
                                            spacing={4}
                                            alignItems={'center'}
                                            justifyContent={'space-around'}
                                        >
                                            <Grid item>
                                                <Typography mb={2}>
                                                    Time Taken:{' '}
                                                    {millisToMinutesAndSeconds(data.listening_test.is_taken.time_taken)}{' '}
                                                    Minutes
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography mb={2}>
                                                    Total Score: {data.listening_test.is_taken.total_score}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    ))}
                                {data.listening_test.is_taken ? (
                                    <Button
                                        // component={NavLink}
                                        // to={{
                                        //     pathname: '/test/review-listening-test',
                                        //     state: { id: data.listening_test_id },
                                        // }}
                                        onClick={() =>
                                            navigate('/test/review-listening-test', {
                                                state: { id: data.listening_test_id, allocated_test_id: state?.id },
                                            })
                                        }
                                        variant="contained"
                                        color="success"
                                        fullWidth
                                    >
                                        REVIEW
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={() => takeTest(data.listening_test_id, 'listening')}
                                    >
                                        START
                                    </Button>
                                )}
                            </Grid>
                        )}
                        {data.reading_test && (
                            <Grid item md={4} padding={2} borderRadius={3} sx={{ boxShadow: 4 }}>
                                <Typography align="center" sx={{ fontSize: '1.2rem' }}>
                                    Reading
                                </Typography>
                                <Grid container spacing={7} paddingY={2} justifyContent={'center'}>
                                    <Grid item alignItems={'center'}>
                                        <Iconify icon="ic:outline-book" />
                                        <Typography component={'span'}>
                                            {data.reading_test.total_questions} Questions
                                        </Typography>
                                    </Grid>
                                    <Grid item alignItems={'center'}>
                                        <Iconify icon="mdi:clock-time-four-outline" />
                                        <Typography component={'span'}>{data.reading_test.time} Minutes</Typography>
                                    </Grid>
                                </Grid>
                                {data.reading_test.is_taken &&
                                    (data.reading_test.is_taken.total_score === null ? (
                                        <Grid
                                            container
                                            spacing={4}
                                            alignItems={'center'}
                                            justifyContent={'space-around'}
                                        >
                                            <Grid item>
                                                <Typography mb={2}>Not Submitted</Typography>
                                            </Grid>
                                        </Grid>
                                    ) : (
                                        <Grid
                                            container
                                            spacing={4}
                                            alignItems={'center'}
                                            justifyContent={'space-around'}
                                        >
                                            <Grid item>
                                                <Typography mb={2}>
                                                    Time Taken:{' '}
                                                    {millisToMinutesAndSeconds(data.reading_test.is_taken.time_taken)}{' '}
                                                    Minutes
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography mb={2}>
                                                    Total Score: {data.reading_test.is_taken.total_score}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    ))}
                                {data.reading_test.is_taken ? (
                                    <Button
                                        // component={NavLink}
                                        // to={{ pathname: '/test/review-test', state: { id: data.reading_test_id } }}
                                        onClick={() =>
                                            navigate('/test/review-test', {
                                                state: { id: data.reading_test_id, allocated_test_id: state?.id },
                                            })
                                        }
                                        variant="contained"
                                        color="success"
                                        fullWidth
                                    >
                                        REVIEW
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={() => takeTest(data.reading_test_id, 'reading')}
                                    >
                                        START
                                    </Button>
                                )}
                            </Grid>
                        )}
                        {data.writing_test && (
                            <Grid item md={4} padding={2} borderRadius={3} sx={{ boxShadow: 4 }}>
                                <Typography align="center" sx={{ fontSize: '1.2rem' }}>
                                    Writing
                                </Typography>
                                <Grid container spacing={7} paddingY={2} justifyContent={'center'}>
                                    <Grid item alignItems={'center'}>
                                        <Iconify icon="mdi:clock-time-four-outline" />
                                        <Typography component={'span'}>{data.writing_test.time} Minutes</Typography>
                                    </Grid>
                                </Grid>
                                {data.writing_test.is_taken &&
                                    (data.writing_test.is_taken.total_score === null ? (
                                        <Grid
                                            container
                                            spacing={4}
                                            alignItems={'center'}
                                            justifyContent={'space-around'}
                                        >
                                            <Grid item>
                                                <Typography mb={2}>Not Submitted</Typography>
                                            </Grid>
                                        </Grid>
                                    ) : (
                                        <Grid
                                            container
                                            spacing={4}
                                            alignItems={'center'}
                                            justifyContent={'space-around'}
                                        >
                                            <Grid item>
                                                <Typography mb={2}>
                                                    Time Taken:{' '}
                                                    {millisToMinutesAndSeconds(data.writing_test.is_taken.time_taken)}{' '}
                                                    Minutes
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography mb={2}>
                                                    Total Score: {data.writing_test.is_taken.total_score}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    ))}
                                {data.writing_test.is_taken ? (
                                    <Button
                                        // component={NavLink}
                                        // to={{
                                        //     pathname: '/test/review-writing-test',
                                        //     state: { id: data.writing_test_id },
                                        // }}
                                        onClick={() =>
                                            navigate('/test/review-writing-test', {
                                                state: { id: data.writing_test_id, allocated_test_id: state?.id },
                                            })
                                        }
                                        variant="contained"
                                        color="success"
                                        fullWidth
                                        disabled={data.writing_test.submit_time === null}
                                    >
                                        REVIEW
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={() => takeTest(data.writing_test_id, 'writing')}
                                    >
                                        START
                                    </Button>
                                )}
                            </Grid>
                        )}
                    </Grid>

                    <Grid container gap={5} columns={13} marginTop={3} justifyContent="center">
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
