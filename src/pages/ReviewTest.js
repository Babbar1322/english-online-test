import { React, useEffect, useState } from 'react';
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
    Link,
    Backdrop,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../layouts/testDashboard/header';
import Scrollbar from '../components/scrollbar';
import Iconify from '../components/iconify';
import { selectToken, selectUser } from '../redux/slices/mainSlice';

export default function ReadingTestPage() {
    const token = useSelector(selectToken);
    const user = useSelector(selectUser);
    const [testData, setTestData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { state } = useLocation();
    // console.log(state);

    // The state for our timer
    const [timer, setTimer] = useState('00:00:00');

    // const startTimer = (e) => {
    //     const { total, hours, minutes, seconds } = getTimeRemaining(e);
    //     if (total >= 0) {
    //         setTimer(
    //             `${hours > 9 ? hours : `0${hours}`}:${minutes > 9 ? minutes : `0${minutes}`}:${
    //                 seconds > 9 ? seconds : `0${seconds}`
    //             }`
    //         );
    //     }
    // };
    const getTestData = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-test-details?id=${state?.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // console.log(res.data);
            getUserTestData(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getUserTestData = async (data) => {
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/review-test`,
                {
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
            const newData = data?.test_groups?.map((item) => {
                const updatedQuestions = item.test_questions.map((question) => {
                    const matchingData = res.data.test.find((data) => data.question_id === question.id);
                    if (matchingData) {
                        return {
                            ...question,
                            user_answer: matchingData.question_value,
                            is_correct: matchingData.is_correct,
                        };
                    }
                    return question;
                });
                return { ...item, test_questions: updatedQuestions };
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
        // console.log(state);
        if (state?.id) {
            getTestData();
            // getUserTestData();
            // clearTimer(getDeadTime());
        }
    }, []);
    return (
        <div>
            <Header button="back" timer={timer} />
            <ToastContainer />
            <Scrollbar sx={{ maxHeight: '70vh' }}>
                <Backdrop sx={{ backgroundColor: '#fff' }} open={loading}>
                    <CircularProgress />
                </Backdrop>
                {console.log(testData.length)}
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
                                            <p>{item.group_content}</p>
                                        </Box>
                                    </Grid>
                                    <Grid item md={6}>
                                        <Scrollbar>
                                            <div>
                                                <>
                                                    <h4>{`Questions of ${item.group_name}`}</h4>
                                                    {item.test_questions.map((question, index) => {
                                                        if (question.question_type === 'single_choice') {
                                                            return (
                                                                <Accordion
                                                                    sx={{ maxWidth: 550 }}
                                                                    id={question.question_number}
                                                                    key={index}
                                                                    defaultExpanded
                                                                >
                                                                    <AccordionSummary
                                                                        expandIcon={<Iconify icon="mdi:expand-more" />}
                                                                        aria-controls="panel1a-content"
                                                                        id="panel1a-header"
                                                                    >
                                                                        <Typography>
                                                                            <strong>{question.question_number}.</strong>{' '}
                                                                            {question.question}
                                                                        </Typography>
                                                                    </AccordionSummary>
                                                                    <AccordionDetails sx={{ ml: 4 }}>
                                                                        <RadioGroup>
                                                                            {JSON.parse(question.question_hint).map(
                                                                                (hint) => (
                                                                                    <FormControlLabel
                                                                                        value={hint}
                                                                                        disabled
                                                                                        key={hint}
                                                                                        control={<Radio />}
                                                                                        checked={
                                                                                            hint ===
                                                                                            question.user_answer
                                                                                        }
                                                                                        label={hint}
                                                                                    />
                                                                                )
                                                                            )}
                                                                        </RadioGroup>
                                                                    </AccordionDetails>
                                                                </Accordion>
                                                            );
                                                        }
                                                        if (question.question_type === 'multi_choice') {
                                                            return (
                                                                <>
                                                                    <Typography id={question.question_number}>
                                                                        <strong>{question.question_number}.</strong>{' '}
                                                                        {question.question}
                                                                    </Typography>
                                                                    <FormGroup sx={{ ml: 4 }}>
                                                                        {JSON.parse(question.question_hint).map(
                                                                            (hint) => (
                                                                                <FormControlLabel
                                                                                    value={hint}
                                                                                    disabled
                                                                                    key={hint}
                                                                                    control={<Checkbox />}
                                                                                    checked={JSON.parse(
                                                                                        question.user_answer
                                                                                    ).some((answer) => answer === hint)}
                                                                                    label={hint}
                                                                                />
                                                                            )
                                                                        )}
                                                                    </FormGroup>
                                                                </>
                                                            );
                                                        }
                                                        if (question.question_type === 'input') {
                                                            return (
                                                                <>
                                                                    <Typography id={question.question_number}>
                                                                        <strong>{question.question_number}.</strong>{' '}
                                                                        {question.question}
                                                                    </Typography>
                                                                    <FormGroup sx={{ ml: 4 }}>
                                                                        <TextField
                                                                            type={'text'}
                                                                            disabled
                                                                            InputProps={{
                                                                                borderColor: 'red',
                                                                            }}
                                                                            value={question.user_answer}
                                                                            // label={question.question_number}
                                                                            variant="outlined"
                                                                        />
                                                                    </FormGroup>
                                                                </>
                                                            );
                                                        }
                                                        return false;
                                                    })}
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
                {testData?.test_groups?.map((item, index) => (
                    <>
                        <Grid container paddingX={1} columns={16} columnSpacing={1} marginY={0.4}>
                            <Grid item>
                                <Typography component={'h4'} sx={{ margin: 0, border: 1, borderStyle: 'solid', px: 1 }}>
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
            </div>
        </div>
    );
}
