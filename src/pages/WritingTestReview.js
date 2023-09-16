import { React, useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails,
    FormGroup,
    TextField,
    Backdrop,
    CircularProgress,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../layouts/testDashboard/header';
import Scrollbar from '../components/scrollbar';
import Iconify from '../components/iconify';
import { selectToken } from '../redux/slices/mainSlice';
import useAxios from '../hooks/useAxios';

export default function WritingTestReview() {
    const token = useSelector(selectToken);
    const [testData, setTestData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { state } = useLocation();
    const axios = useAxios();
    // console.log(state);

    const getTestData = async () => {
        try {
            const res = await axios.get(`/get-test-details?id=${state?.id}&token=${token}`);

            // console.log(res?.data, 'TEST DATA');
            getUserTestData(res?.data);
        } catch (err) {
            console.log(err);
        }
    };
    // console.log(state);

    const getUserTestData = async (data) => {
        try {
            const res = await axios.post('/review-test', {
                test_id: state?.id,
                allocated_test_id: state?.allocated_test_id,
                token,
            });

            // console.log(res?.data, 'REVIEW TEST');
            const newData = data?.test_groups?.map((item) => {
                const matchingData = res?.data?.test?.find((data) => data?.question_id === item?.id);
                return { ...item, user_input: matchingData?.question_value, marks: matchingData?.marks };
            });
            // console.log('new data', newData, 'new data');
            // setTestData(res.data);
            setTestData(newData);
        } catch (err) {
            // console.log(err);
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (state?.id) {
            getTestData();
        }
    }, []);
    return (
        <div>
            <Header button="back" review />
            <ToastContainer />
            <Scrollbar>
                <Backdrop sx={{ backgroundColor: '#fff' }} open={loading}>
                    <CircularProgress />
                </Backdrop>
                {testData.length > 1 && !loading ? (
                    testData?.map((item, index) => (
                        <Accordion id={index} defaultExpanded key={index}>
                            <AccordionSummary
                                expandIcon={<Iconify icon="mdi:expand-more" />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>
                                    <strong>{item.group_name}</strong>
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ ml: 4 }}>
                                <Grid container gap={3} columns={13}>
                                    <Grid item md={6}>
                                        <Box component="div" bgcolor={'white'} padding={2}>
                                            <h4>{item.group_name}</h4>
                                            {/* <p>{item.group_content}</p> */}
                                            <div dangerouslySetInnerHTML={{ __html: item.group_content }}></div>
                                        </Box>
                                    </Grid>
                                    <Grid item md={6}>
                                        <Scrollbar>
                                            <div>
                                                <>
                                                    <h4>{`Questions of ${item.group_name}`}</h4>
                                                    <h4>Type your essay below and click Submit for evaluation</h4>
                                                    <FormGroup sx={{ ml: 4 }}>
                                                        <TextField
                                                            type={'text'}
                                                            disabled
                                                            multiline
                                                            rows={15}
                                                            value={item.user_input}
                                                            variant="outlined"
                                                        />
                                                    </FormGroup>
                                                    <Typography sx={{ ml: 4, mt: 2 }}>
                                                        {item.is_correct === null ? null : item.is_correct === true ? (
                                                            <span style={{ color: 'green' }}>Correct</span>
                                                        ) : (
                                                            <span style={{ color: 'red' }}>Incorrect</span>
                                                        )}
                                                        {' - '}
                                                        {item.marks === null
                                                            ? 'Not Evaluated'
                                                            : item.marks === undefined
                                                            ? 'This is not Submitted'
                                                            : `Marks Given - ${item.marks}`}
                                                        {/* Marks Given - {item.marks} */}
                                                    </Typography>
                                                </>
                                            </div>
                                        </Scrollbar>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    ))
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '60vh',
                        }}
                    >
                        <Typography textAlign={'center'} sx={{ fontSize: '1.7rem' }}>
                            Something Went Wrong!
                        </Typography>
                    </Box>
                )}
            </Scrollbar>
        </div>
    );
}
