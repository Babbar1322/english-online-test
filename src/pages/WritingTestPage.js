import { React, useEffect, useState, useRef } from 'react';
import {
    Box,
    Grid,
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Radio,
    RadioGroup,
    TextField,
    Button,
    Link,
} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../layouts/testDashboard/header';
import Scrollbar from '../components/scrollbar';
import Iconify from '../components/iconify';
import { selectToken, selectUser } from '../redux/slices/mainSlice';

export default function WritingTestPage() {
    const Ref = useRef(null);
    const token = useSelector(selectToken);
    const user = useSelector(selectUser);
    const [testData, setTestData] = useState({});
    const { state } = useLocation();
    const navigate = useNavigate();

    // The state for our timer
    const [timer, setTimer] = useState('00:00:00');
    const [questionValues, setQuestionValues] = useState({});

    const handleChange = (e, question) => {
        setQuestionValues((prevState) => ({
            ...prevState,
            [question]: {
                value: e.target.value,
                question_id: question,
                question_type: 'input',
            },
        }));
    };

    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / 1000 / 60 / 60) % 24);
        return {
            total,
            hours,
            minutes,
            seconds,
        };
    };

    const startTimer = (e) => {
        const { total, hours, minutes, seconds } = getTimeRemaining(e);
        if (total >= 0) {
            setTimer(
                `${hours > 9 ? hours : `0${hours}`}:${minutes > 9 ? minutes : `0${minutes}`}:${
                    seconds > 9 ? seconds : `0${seconds}`
                }`
            );
        }
    };

    const clearTimer = (e) => {
        setTimer('00:00:00');
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        Ref.current = id;
    };

    const getDeadTime = (time) => {
        const deadline = new Date();

        deadline.setMinutes(deadline.getMinutes() + parseInt(time, 10));
        return deadline;
    };

    const getTestData = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-test-details?id=${state?.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(res.data);
            setTestData(res.data);
            clearTimer(getDeadTime(res.data.time));
        } catch (err) {
            console.log(err);
        }
    };

    async function handleSubmit() {
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/submit-writing-test`,
                {
                    questionValues,
                    test_id: state?.id,
                    user_id: user.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // console.log(res.data);
            // if (res.status === 200) {
            //     navigate('/test/review-test', {
            //         state: {
            //             id: state?.id,
            //         },
            //     });
            // }
        } catch (err) {
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
            navigate('/test/review-writing-test', {
                state: {
                    id: state?.id,
                },
            });
        }
    }
    useEffect(() => {
        if (state?.id) {
            getTestData();
        }

        return () => {
            if (Ref.current) clearInterval(Ref.current);
        };
    }, []);
    return (
        <div>
            <ToastContainer />
            <Header button="back" timer={timer} />
            <Scrollbar sx={{ maxHeight: '70vh' }}>
                {testData?.test_groups?.map((item, index) => (
                    <Accordion id={index} defaultExpanded={index === 0} key={index}>
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
                                    <Scrollbar component="div" bgcolor={'white'} padding={2}>
                                        <h4>{item.group_name}</h4>
                                        <div dangerouslySetInnerHTML={{ __html: item.group_content }}></div>
                                        {/* <p>{item.group_content}</p> */}
                                    </Scrollbar>
                                </Grid>
                                <Grid item md={6}>
                                    <Scrollbar>
                                        <div>
                                            {/* {testData?.test_groups?.map((item, index) => ( */}
                                            <>
                                                <h4>{`Questions of ${item.group_name}`}</h4>
                                                <h4>Type your essay below and click Submit for evaluation</h4>
                                                <FormGroup sx={{ ml: 4 }}>
                                                    <TextField
                                                        type={'text'}
                                                        multiline
                                                        rows={15}
                                                        onChange={(e) => handleChange(e, item.id)}
                                                        variant="outlined"
                                                    />
                                                </FormGroup>
                                            </>
                                            {/* ))} */}
                                        </div>
                                    </Scrollbar>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Scrollbar>
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    backgroundColor: '#fff',
                    width: '85%',
                    zIndex: 666,
                    maxHeight: '20vh',
                    overflow: 'auto',
                }}
            >
                <Grid container alignItems={'center'}>
                    <Grid sm={10} item>
                        {testData?.test_groups?.map((item) => (
                            <>
                                <Grid container paddingX={1} columns={16} columnSpacing={1} marginY={0.4}>
                                    <Grid item>
                                        <Typography
                                            component={'h4'}
                                            sx={{ margin: 0, border: 1, borderStyle: 'solid', px: 1 }}
                                        >
                                            {item.group_name}
                                        </Typography>
                                    </Grid>
                                    {item.test_questions.map((question) => (
                                        <Grid item key={question.question_number}>
                                            <Link
                                                href={`#${question.question_number}`}
                                                sx={{ margin: 0, border: 1, borderStyle: 'solid', px: 1 }}
                                            >
                                                {question.question_number}
                                            </Link>
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        ))}
                    </Grid>
                    <Grid sm={2} item>
                        <Button
                            variant="contained"
                            onClick={() => handleSubmit()}
                            color="primary"
                            sx={{ borderRadius: 10 }}
                        >
                            Submit Test
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}
