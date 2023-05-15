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
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../layouts/testDashboard/header';
import Scrollbar from '../components/scrollbar';
import Iconify from '../components/iconify';
import { selectToken } from '../redux/slices/mainSlice';
import useAxios from '../hooks/useAxios';

export default function ReadingTestPage() {
    const token = useSelector(selectToken);
    const [data, setData] = useState([]);
    const [testData, setTestData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { state } = useLocation();
    const axios = useAxios();
    // console.log(state);

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
            const res = await axios.get(`/get-test-details?id=${state?.id}&token=${token}`);

            // console.log(res.data);
            setData(res.data);
            getUserTestData(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getUserTestData = async (data) => {
        try {
            const res = await axios.post('/review-test', {
                test_id: state?.id,
                allocated_test_id: state?.allocated_test_id,
                token,
            });

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
                    return { ...question, user_answer: 'Not Answered', is_correct: false };
                });
                return { ...item, test_questions: updatedQuestions };
            });
            console.log('new data', newData, 'new data');
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
            <Header button="back" review />
            <ToastContainer />
            {/* <Scrollbar sx={{ maxHeight: '80vh' }}> */}
            <Backdrop sx={{ backgroundColor: '#fff' }} open={loading}>
                <CircularProgress />
            </Backdrop>
            <div style={{ maxHeight: '80vh', overflow: 'auto' }}>
                {testData.length > 1 && !loading ? (
                    testData?.map((item, index) => (
                        // <Accordion id={index} defaultExpanded key={index}>
                        //     <AccordionSummary
                        //         expandIcon={<Iconify icon="mdi:expand-more" />}
                        //         aria-controls="panel1a-content"
                        //         id="panel1a-header"
                        //     >
                        //         <Typography>
                        //             <strong>{item.group_name}</strong>
                        //         </Typography>
                        //     </AccordionSummary>
                        //     <AccordionDetails sx={{ ml: 4 }}>
                        <Grid
                            container
                            gap={3}
                            columns={13}
                            key={index}
                            sx={{
                                borderBottom: '1px solid black',
                                paddingBottom: '3%',
                                marginBottom: '3%',
                                justifyContent: 'space-around',
                            }}
                        >
                            <Grid item md={6}>
                                {/* <Box component="div" bgcolor={'white'} padding={2}> */}
                                <Scrollbar sx={{ maxHeight: '80vh' }}>
                                    <h4>{item.group_name}</h4>
                                    {/* <p>{item.group_content}</p> */}
                                    <div dangerouslySetInnerHTML={{ __html: item.group_content }}></div>
                                </Scrollbar>
                                {/* </Box> */}
                            </Grid>
                            <Grid item md={6}>
                                <Scrollbar sx={{ maxHeight: '80vh' }}>
                                    <>
                                        <h4>{`Questions of ${item.group_name}`}</h4>
                                        {item.test_questions.map((question, index, array) => {
                                            if (question.question_type === 'single_choice') {
                                                return (
                                                    <Accordion
                                                        sx={{
                                                            mb:
                                                                array[index + 1]?.question_type !==
                                                                question.question_type
                                                                    ? 7
                                                                    : 0,
                                                        }}
                                                        // sx={{ maxWidth: 550 }}
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
                                                                {JSON.parse(question.question_hint).map((hint) => (
                                                                    <FormControlLabel
                                                                        value={hint}
                                                                        disabled
                                                                        key={hint}
                                                                        control={<Radio />}
                                                                        checked={hint === question?.user_answer}
                                                                        label={hint}
                                                                    />
                                                                ))}
                                                            </RadioGroup>
                                                            <Typography color={question.is_correct ? 'green' : 'red'}>
                                                                {question.is_correct
                                                                    ? 'This Answer is Correct'
                                                                    : 'Your Answer is Wrong'}
                                                            </Typography>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                );
                                            }
                                            if (question.question_type === 'multi_choice') {
                                                return (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            mb:
                                                                array[index + 1]?.question_type !==
                                                                question.question_type
                                                                    ? 7
                                                                    : 0,
                                                        }}
                                                    >
                                                        <Typography id={question.question_number}>
                                                            <strong>{question.question_number}.</strong>{' '}
                                                            {question.question}
                                                        </Typography>
                                                        <FormGroup sx={{ ml: 4 }}>
                                                            {JSON.parse(question.question_hint).map((hint) => (
                                                                <FormControlLabel
                                                                    value={hint}
                                                                    disabled
                                                                    key={hint}
                                                                    control={<Checkbox />}
                                                                    checked={
                                                                        question?.user_answer === 'Not Answered'
                                                                            ? false
                                                                            : JSON?.parse(question?.user_answer)?.some(
                                                                                  (answer) => answer === hint
                                                                              )
                                                                    }
                                                                    label={hint}
                                                                />
                                                            ))}
                                                        </FormGroup>
                                                        <Typography color={question.is_correct ? 'green' : 'red'}>
                                                            {question.is_correct
                                                                ? 'This Answer is Correct'
                                                                : 'Your Answer is Wrong'}
                                                        </Typography>
                                                    </Box>
                                                );
                                            }
                                            if (question.question_type === 'input') {
                                                return (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            mb:
                                                                array[index + 1]?.question_type !==
                                                                question.question_type
                                                                    ? 7
                                                                    : 0,
                                                        }}
                                                    >
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
                                                        <Typography color={question.is_correct ? 'green' : 'red'}>
                                                            {question.is_correct
                                                                ? 'This Answer is Correct'
                                                                : 'Your Answer is Wrong'}
                                                        </Typography>
                                                    </Box>
                                                );
                                            }
                                            if (question.question_type === 'drag_and_drop') {
                                                return (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            mb:
                                                                array[index + 1]?.question_type !==
                                                                question.question_type
                                                                    ? 7
                                                                    : 0,
                                                        }}
                                                    >
                                                        <Typography id={question.question_number}>
                                                            <strong>{question.question_number}.</strong>{' '}
                                                            {question.question}
                                                        </Typography>
                                                        <div
                                                            style={{
                                                                minHeight: 40,
                                                                padding: 5,
                                                                border: '1px solid #666',
                                                                borderRadius: 5,
                                                            }}
                                                        >
                                                            {question.user_answer}
                                                        </div>
                                                        <Typography color={question.is_correct ? 'green' : 'red'}>
                                                            {question.is_correct
                                                                ? 'This Answer is Correct'
                                                                : 'Your Answer is Wrong'}
                                                        </Typography>
                                                    </Box>
                                                );
                                            }
                                            if (question.question_type === 'image') {
                                                return (
                                                    question.q_count && (
                                                        <Box
                                                            key={question.question_value}
                                                            sx={{
                                                                position: 'relative',
                                                                mb:
                                                                    array[index + 1]?.question_type !==
                                                                    question.question_type
                                                                        ? 7
                                                                        : 0,
                                                            }}
                                                        >
                                                            <img
                                                                key={question.question_number}
                                                                src={question.image_url}
                                                                style={{
                                                                    width: 500,
                                                                    // position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                }}
                                                                alt="containing question inputs"
                                                            />

                                                            {JSON.parse(question.imageQuestions).map((item, idx) => (
                                                                <>
                                                                    <input
                                                                        key={idx}
                                                                        style={{
                                                                            position: 'absolute',
                                                                            top: JSON.parse(item.image_coordinates).y,
                                                                            left: JSON.parse(item.image_coordinates).x,
                                                                            backgroundColor: '#fff',
                                                                            zIndex: 55,
                                                                            border: '2px solid #666',
                                                                            // outline: '1px solid #2065D1',
                                                                            borderRadius: 5,
                                                                        }}
                                                                        type="text"
                                                                        disabled
                                                                        value={question?.user_answer}
                                                                        placeholder={`Enter Answer For ${item.question_number}`}
                                                                    />
                                                                </>
                                                            ))}
                                                        </Box>
                                                    )
                                                );
                                            }
                                            if (question.question_type === 'multi_question') {
                                                return (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            mb:
                                                                array[index + 1]?.question_type !==
                                                                question.question_type
                                                                    ? 7
                                                                    : 0,
                                                        }}
                                                    >
                                                        <Typography id={question.question_number}>
                                                            <strong>{question.question_number}.</strong>{' '}
                                                            {question.question}
                                                        </Typography>
                                                        <Box key={question.id}>
                                                            {/* <Typography id={question.question_number}>
                                                                    {hint}
                                                                </Typography> */}
                                                            <FormGroup sx={{ ml: 4 }}>
                                                                {JSON.parse(question.question_hint).map((hint) => (
                                                                    <FormControlLabel
                                                                        value={hint}
                                                                        key={hint}
                                                                        control={<Checkbox />}
                                                                        label={hint}
                                                                        disabled
                                                                        checked={
                                                                            question?.user_answer === 'Not Answered'
                                                                                ? false
                                                                                : JSON?.parse(
                                                                                      question?.user_answer
                                                                                  )?.some((answer) => answer === hint)
                                                                        }
                                                                    />
                                                                ))}
                                                            </FormGroup>
                                                        </Box>
                                                    </Box>
                                                );
                                            }
                                            return false;
                                        })}
                                    </>
                                </Scrollbar>
                            </Grid>
                        </Grid>
                        //     </AccordionDetails>
                        // </Accordion>
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
            </div>
            {/* </Scrollbar> */}
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    // right: 0,
                    backgroundColor: '#fff',
                    width: '95%',
                    zIndex: 666,
                    maxHeight: '20vh',
                    overflow: 'auto',
                }}
            >
                {data?.test_groups?.map((item) => (
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
