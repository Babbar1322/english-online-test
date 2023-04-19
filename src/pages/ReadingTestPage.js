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

export default function ReadingTestPage() {
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
        if (e.target.type === 'checkbox') {
            setQuestionValues((prevState) => ({
                ...prevState,
                [question.question_number]: {
                    value: { ...prevState[question.question_number]?.value, [e.target.value]: e.target.checked },
                    question_id: question.id,
                    question_type: question.question_type,
                },
            }));
        }
        if (e.target.type === 'text') {
            setQuestionValues((prevState) => ({
                ...prevState,
                [question.question_number]: {
                    value: e.target.value,
                    question_id: question.id,
                    question_type: question.question_type,
                },
            }));
        }
        if (e.target.type === 'radio') {
            setQuestionValues((prevState) => ({
                ...prevState,
                [question.question_number]: {
                    value: e.target.value,
                    question_id: question.id,
                    question_type: question.question_type,
                },
            }));
        }
        console.log(questionValues);
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
    const drop = (e, question) => {
        e.preventDefault();
        console.log(questionValues);
        const data = e.dataTransfer.getData('text');
        const droppedElement = document.getElementById(data);
        const droppedText = droppedElement.textContent;
        e.target.appendChild(document.getElementById(data));

        setQuestionValues((prevState) => {
            if (Object.keys(prevState).length > 0) {
                console.log('Heelllloooo');
                for (const val in prevState) {
                    console.log(prevState[val]);
                    if (prevState[val].value === droppedText) {
                        console.log('Hi there');
                        console.log(delete prevState[val]);
                        const newState = { ...prevState };
                        delete newState[val];
                        return {
                            ...newState,
                            [question.question_number]: {
                                value: droppedText,
                                question_id: question.id,
                                question_type: question.question_type,
                            },
                        };
                    }
                }
            }
            return {
                ...prevState,
                [question.question_number]: {
                    value: droppedText,
                    question_id: question.id,
                    question_type: question.question_type,
                },
            };
        });
    };

    let i = 0;

    const dropOut = (e, question) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text');
        // Set State of Questions
        setQuestionValues((prevState) => {
            const newState = { ...prevState };
            delete newState[question.question_number];
            return newState;
        });
        e.target.appendChild(document.getElementById(data));
    };

    const drag = (e) => {
        e.dataTransfer.setData('text', e.target.id);
    };

    const allowDrop = (e) => {
        e.preventDefault();
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
                `${process.env.REACT_APP_API_URL}/submit-test`,
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
            if (res.status === 200) {
                navigate('/test/review-test', {
                    state: {
                        id: state?.id,
                    },
                });
            }
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
            navigate('/test/review-test', {
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
                                    <Box component="div" bgcolor={'white'} padding={2}>
                                        <h4>{item.group_name}</h4>
                                        <div dangerouslySetInnerHTML={{ __html: item.group_content }}></div>
                                        {/* <p>{item.group_content}</p> */}
                                    </Box>
                                </Grid>
                                <Grid item md={6}>
                                    <Scrollbar>
                                        <div>
                                            {/* {testData?.test_groups?.map((item, index) => ( */}
                                            <>
                                                <h4>{`Questions of ${item.group_name}`}</h4>
                                                {item.test_questions.map((question, index, arr) => {
                                                    if (question.question_type === 'single_choice') {
                                                        return (
                                                            <Accordion
                                                                sx={{ maxWidth: 550 }}
                                                                key={index}
                                                                id={question.question_number}
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
                                                                                    key={hint}
                                                                                    onChange={(e) =>
                                                                                        handleChange(e, question)
                                                                                    }
                                                                                    control={<Radio />}
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
                                                                    {JSON.parse(question.question_hint).map((hint) => (
                                                                        <FormControlLabel
                                                                            value={hint}
                                                                            key={hint}
                                                                            onChange={(e) => handleChange(e, question)}
                                                                            control={<Checkbox />}
                                                                            label={hint}
                                                                        />
                                                                    ))}
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
                                                                        onChange={(e) => handleChange(e, question)}
                                                                        label={question.question_number}
                                                                        variant="outlined"
                                                                    />
                                                                </FormGroup>
                                                            </>
                                                        );
                                                    }
                                                    if (question.question_type === 'drag_and_drop') {
                                                        i += 1;
                                                        return (
                                                            <>
                                                                <Typography id={question.question_number}>
                                                                    <strong>{question.question_number}.</strong>{' '}
                                                                    {question.question}
                                                                </Typography>
                                                                <div
                                                                    onDrop={(e) => drop(e, question)}
                                                                    style={{
                                                                        minHeight: 40,
                                                                        padding: 5,
                                                                        border: '1px solid #666',
                                                                        borderRadius: 5,
                                                                    }}
                                                                    onDragOver={allowDrop}
                                                                ></div>
                                                                {i === question.q_count && (
                                                                    <div
                                                                        onDrop={(e) => dropOut(e, question)}
                                                                        style={{
                                                                            minHeight: 40,
                                                                            border: '1px solid #666',
                                                                            marginTop: 10,
                                                                        }}
                                                                        onDragOver={allowDrop}
                                                                    >
                                                                        {JSON.parse(question.question_hint).map(
                                                                            (hint, index) => (
                                                                                <Typography
                                                                                    draggable
                                                                                    backgroundColor="#f5f5f5"
                                                                                    paddingX={0.5}
                                                                                    margin={1}
                                                                                    borderRadius={5}
                                                                                    border={'1px solid black'}
                                                                                    display={'inline-block'}
                                                                                    key={index}
                                                                                    onDragStart={drag}
                                                                                    id={hint}
                                                                                >
                                                                                    {hint}
                                                                                </Typography>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </>
                                                        );
                                                    }
                                                    return false;
                                                })}
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
