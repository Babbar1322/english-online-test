import { React, useEffect, useState, useRef } from 'react';
import {
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
    Box,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../layouts/testDashboard/header';
import Iconify from '../components/iconify';
import useAxios from '../hooks/useAxios';
import { selectToken } from '../redux/slices/mainSlice';
import isJson from '../utils/isJson';

export default function ListeningTestPage() {
    const Ref = useRef(null);
    const token = useSelector(selectToken);
    const [testData, setTestData] = useState({});
    const { state } = useLocation();
    const navigate = useNavigate();
    const axios = useAxios();

    // The state for our timer
    const [timer, setTimer] = useState('00:00:00');
    const [questionValues, setQuestionValues] = useState({});

    const handleChange = (e, question) => {
        if (e.target.type === 'checkbox') {
            if (question.question_type === 'multi_question') {
                console.log('Multi Question');
                // selected values must not be greater than question.q_count
                console.log(Object.keys(questionValues).length);
                if (Object.keys(questionValues).length >= 0) {
                    const selectedValues = Object?.values(questionValues)?.filter(
                        (item) => item.question_id === question.id
                    );
                    console.log(selectedValues[0]);

                    if (e.target.checked) {
                        if (selectedValues[0] !== undefined) {
                            const checkedValues = Object.keys(selectedValues[0]?.value).filter(
                                (item) => selectedValues[0]?.value[item] === true
                            );
                            if (selectedValues.length > 0 && checkedValues.length >= question.q_count) {
                                console.log('You cannot select more than ', question.q_count);
                                return;
                            }
                        }
                    }
                }
            }
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
        if (e.target.children.length > 0) {
            return;
        }
        console.log(questionValues);
        const data = e.dataTransfer.getData('text');
        const droppedElement = document.getElementById(data);
        const droppedText = droppedElement.textContent;
        e.target.appendChild(document.getElementById(data));

        setQuestionValues((prevState) => {
            if (Object.keys(prevState).length > 0) {
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
        if (e.target.classList.contains('noDrop')) {
            return;
        }
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
        if (total <= 0) {
            handleSubmit();
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
            const res = await axios.get(`/get-test-details?id=${state?.id}&type=listening&token=${token}`);

            console.log(res.data);
            setTestData(res.data);
            clearTimer(getDeadTime(res.data.time));
        } catch (err) {
            console.log(err);
        }
    };

    async function handleSubmit() {
        try {
            const res = await axios.post('/submit-test', {
                questionValues,
                test_id: state?.id,
                allocated_test_id: state?.allocated_test_id,
                type: 'listening',
                token,
            });
            // console.log(res.data);
            if (res.status === 200) {
                navigate('/test/review-listening-test', {
                    state: {
                        id: state?.id,
                        allocated_test_id: state?.allocated_test_id,
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
            // navigate('/test/review-listening-test', {
            //     state: {
            //         id: state?.id,
            //     },
            // });
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
            <Header button="back" timer={timer} audio={testData?.audio?.path} />
            <div style={{ maxHeight: '80vh' }}>
                {testData?.test_groups?.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            borderBottom: '1px solid black',
                            paddingBottom: '3%',
                            marginBottom: '3%',
                            justifyContent: 'space-around',
                        }}
                    >
                        <h4>{`Questions of ${item.group_name}`}</h4>
                        {item.test_questions.map((question, index, array) => {
                            if (question.question_type === 'single_choice') {
                                return (
                                    <Accordion
                                        key={index}
                                        id={question.question_number}
                                        defaultExpanded
                                        sx={{
                                            mb: array[index + 1]?.question_type !== question.question_type ? 7 : 0,
                                        }}
                                    >
                                        <AccordionSummary
                                            expandIcon={<Iconify icon="mdi:expand-more" />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>
                                                <strong>{question.question_number}.</strong> {question.question}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ ml: 4 }}>
                                            <RadioGroup>
                                                {isJson(question.question_hint)
                                                    ? JSON.parse(question.question_hint).map((hint) => (
                                                          <FormControlLabel
                                                              value={hint}
                                                              key={hint}
                                                              onChange={(e) => handleChange(e, question)}
                                                              control={<Radio />}
                                                              label={hint}
                                                          />
                                                      ))
                                                    : 'Something went wrong'}
                                            </RadioGroup>
                                        </AccordionDetails>
                                    </Accordion>
                                );
                            }
                            if (question.question_type === 'multi_choice') {
                                return (
                                    <Box
                                        key={index}
                                        sx={{
                                            mb: array[index + 1]?.question_type !== question.question_type ? 7 : 0,
                                        }}
                                    >
                                        <Typography id={question.question_number}>
                                            <strong>{question.question_number}.</strong> {question.question}
                                        </Typography>
                                        <FormGroup sx={{ ml: 4 }}>
                                            {isJson(question.question_hint)
                                                ? JSON.parse(question.question_hint).map((hint) => (
                                                      <FormControlLabel
                                                          value={hint}
                                                          key={hint}
                                                          onChange={(e) => handleChange(e, question)}
                                                          control={<Checkbox />}
                                                          label={hint}
                                                      />
                                                  ))
                                                : 'Something went wrong'}
                                        </FormGroup>
                                    </Box>
                                );
                            }
                            if (question.question_type === 'input') {
                                return (
                                    <Box
                                        key={index}
                                        sx={{
                                            mb: array[index + 1]?.question_type !== question.question_type ? 7 : 0,
                                        }}
                                    >
                                        <Typography id={question.question_number}>
                                            <strong>{question.question_number}.</strong> {question.question}
                                        </Typography>
                                        <FormGroup sx={{ ml: 4 }}>
                                            <TextField
                                                type={'text'}
                                                onChange={(e) => handleChange(e, question)}
                                                label={question.question_number}
                                                variant="outlined"
                                            />
                                        </FormGroup>
                                    </Box>
                                );
                            }
                            if (question.question_type === 'drag_and_drop') {
                                i += 1;
                                return (
                                    <Box
                                        key={index}
                                        sx={{
                                            mb: array[index + 1]?.question_type !== question.question_type ? 7 : 0,
                                        }}
                                    >
                                        {i === 1 && (
                                            <Typography id={question.question_number} sx={{ mb: 2 }}>
                                                <strong>{question?.drag?.question}</strong>
                                            </Typography>
                                        )}
                                        <Typography id={question.question_number}>
                                            <strong>{question.question_number}.</strong> {question.question}
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
                                                    minHeight: 100,
                                                    border: '1px solid #666',
                                                    marginTop: 10,
                                                }}
                                                onDragOver={allowDrop}
                                            >
                                                {isJson(question.question_hint)
                                                    ? JSON.parse(question.question_hint).map((hint, index) => (
                                                          <Typography
                                                              draggable
                                                              className="noDrop"
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
                                                      ))
                                                    : 'Something went wrong'}
                                            </div>
                                        )}
                                    </Box>
                                );
                            }
                            if (question.question_type === 'image') {
                                return (
                                    question.q_count && (
                                        <Box
                                            key={index}
                                            sx={{
                                                mb: array[index + 1]?.question_type !== question.question_type ? 7 : 0,
                                                position: 'relative',
                                            }}
                                        >
                                            <img
                                                key={question.question_number}
                                                src={question.image_url}
                                                style={{
                                                    width: 500,
                                                    top: 0,
                                                    left: 0,
                                                }}
                                                alt="containing question inputs"
                                            />
                                            {isJson(question.imageQuestions)
                                                ? JSON.parse(question.imageQuestions).map((item, idx) => (
                                                      <input
                                                          key={idx}
                                                          style={{
                                                              position: 'absolute',
                                                              top: JSON.parse(item.image_coordinates).y,
                                                              left: JSON.parse(item.image_coordinates).x,
                                                              backgroundColor: '#fff',
                                                              zIndex: 55,
                                                              border: '2px solid #666',
                                                              borderRadius: 5,
                                                          }}
                                                          type="text"
                                                          placeholder={`Enter Answer For ${item.question_number}`}
                                                          onChange={(e) => handleChange(e, item)}
                                                      />
                                                  ))
                                                : 'Something went wrong'}
                                        </Box>
                                    )
                                );
                            }
                            if (question.question_type === 'multi_question') {
                                return (
                                    <Box
                                        key={index}
                                        sx={{
                                            mb: array[index + 1]?.question_type !== question.question_type ? 7 : 0,
                                        }}
                                    >
                                        <Typography id={question.question_number}>
                                            <strong>
                                                {question.question_number} -{' '}
                                                {question.question_number + question.q_count - 1}.
                                            </strong>{' '}
                                            {question.question}
                                        </Typography>
                                        <Box key={question.id}>
                                            {/* <Typography id={question.question_number}>
                                                    {hint}
                                                </Typography> */}
                                            <FormGroup sx={{ ml: 4 }}>
                                                {isJson(question.question_hint)
                                                    ? JSON.parse(question.question_hint).map((hint) => (
                                                          <FormControlLabel
                                                              value={hint}
                                                              key={hint}
                                                              checked={
                                                                  questionValues[question.question_number]?.value?.[
                                                                      hint
                                                                  ] ?? false
                                                              }
                                                              onChange={(e) => handleChange(e, question)}
                                                              control={<Checkbox />}
                                                              label={hint}
                                                          />
                                                      ))
                                                    : 'Something went wrong'}
                                            </FormGroup>
                                        </Box>
                                    </Box>
                                );
                            }
                            return false;
                        })}
                    </div>
                ))}
            </div>
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    backgroundColor: '#fff',
                    width: '95%',
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
