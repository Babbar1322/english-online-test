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
    IconButton,
} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Header from '../layouts/testDashboard/header';
import Scrollbar from '../components/scrollbar';
import Iconify from '../components/iconify';
import { selectToken } from '../redux/slices/mainSlice';

export default function ReadingTestPage() {
    const Ref = useRef(null);
    const token = useSelector(selectToken);
    const [testData, setTestData] = useState({});
    const { state } = useLocation();
    // console.log(state);

    // The state for our timer
    const [timer, setTimer] = useState('00:00:00');
    // const [questionValues, setQuestionValues] = useState([]);

    // const handleInputChange = (event, number) => {
    //     const { name, value, type, checked } = event.target;

    //     setQuestionValues((prevData) => {
    //         const newData = [...prevData];
    //         const index = newData.findIndex((item) => item.number === number);

    //         if (index === -1) {
    //             newData.push({ number, [name]: type === 'checkbox' ? checked : value });
    //         } else {
    //             newData[index][name] = type === 'checkbox' ? checked : value;
    //         }

    //         return newData;
    //     });
    // };

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

            //   console.log(res.data);
            setTestData(res.data);
            clearTimer(getDeadTime(res.data.time));
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        if (state?.id) {
            getTestData();
            // clearTimer(getDeadTime());
        }

        return () => {
            if (Ref.current) clearInterval(Ref.current);
        };
    }, []);

    const onClickReset = () => {
        clearTimer(getDeadTime());
    };
    return (
        <div>
            <Header button="back" timer={timer} />
            <Scrollbar sx={{ maxHeight: '70vh' }}>
                {testData?.test_groups?.map((item, index) => (
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
                                    {/* {testData?.test_groups?.map((item, index) => ( */}
                                    <>
                                        <h4>{`Questions of ${item.group_name}`}</h4>
                                        {item.test_questions.map((question, index) => {
                                            if (question.question_type === 'single_choice') {
                                                return (
                                                    <Accordion sx={{ maxWidth: 550 }} id={question.question_number}>
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
                                                                        control={<Radio />}
                                                                        label={hint}
                                                                    />
                                                                ))}
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
                                                                label={question.question_number}
                                                                variant="outlined"
                                                            />
                                                        </FormGroup>
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
                    <Grid sm={11} item>
                        {testData?.test_groups?.map((item, index) => (
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
                                        <Grid item>
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
                    <Grid sm={1} item>
                        <Button variant="contained" color="primary" sx={{ borderRadius: 10, px: 0 }}>
                            <Iconify icon="material-symbols:chevron-right" width={40} />
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

// import Box from '@mui/material/Box';
// import {
//   Accordion,
//   AccordionDetails,
//   AccordionSummary,
//   FormControl,
//   Grid,
//   Radio,
//   RadioGroup,
//   Typography,
// } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Checkbox from '@mui/material/Checkbox';
// import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';

// import Header from '../layouts/testDashboard/header';

// export default function ReadingTestPage() {
//   return (
//     <div style={{ backgroundColor: '#b0e0e6' }}>
//       <Header button="back" timer="000000" />
//       <Box sx={{ flexGrow: 1, paddingBottom: 2 }}>
//         <Grid container columns={16}>
//           <Grid item xs={8} paddingX={1} bgcolor={'#fff'}>
//             <h4>Part 1</h4>
//             <h5>
//               <span style={{ color: 'grey' }}>Read the text below and answer question </span>1-13
//             </h5>
//             <h4>WHAT IT'S LIKE TO HAVE SCHIZOPHRENIA</h4>
//             <p>
//               Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque ut, optio quae consectetur enim id eum
//               recusandae impedit ab possimus odio voluptate facilis? Nostrum quod, facilis impedit similique laboriosam
//               at, quo magni veritatis, maiores magnam placeat laborum fuga provident? Reiciendis in suscipit cum
//               perspiciatis blanditiis quidem eum ratione, atque dolorum? Blanditiis unde dolorem excepturi esse culpa
//               ullam libero porro, inventore optio dicta natus dolore vitae repellendus voluptates quibusdam nulla?
//               Obcaecati.
//             </p>
//           </Grid>
//           <Grid item xs={8} paddingX={1}>
//             <h4>
//               <span style={{ color: 'grey' }}>In question </span>1-5, Choose
//             </h4>
//             <h4>
//               TRUE
//               <span style={{ marginLeft: 40, color: 'grey' }}>if the statement is true according to the passage</span>
//             </h4>
//             <h4>
//               FALSE
//               <span style={{ marginLeft: 30, color: 'grey' }}>if the statement is false according to the passage</span>
//             </h4>
//             <h4>
//               NOT GIVEN
//               <span style={{ marginLeft: 15, color: 'grey' }}>if the information is not given in the passage</span>
//             </h4>
//             <div>
//               <Accordion sx={{ maxWidth: 550 }}>
//                 <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
//                   <Typography>Accordion 1</Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   <FormControl>
//                     <RadioGroup
//                       aria-labelledby="demo-radio-buttons-group-label"
//                       defaultValue="female"
//                       name="radio-buttons-group"
//                     >
//                       <FormControlLabel value="female" control={<Radio />} label="True" />
//                       <FormControlLabel value="male" control={<Radio />} label="False" />
//                       <FormControlLabel value="other" control={<Radio />} label="Not Given" />
//                     </RadioGroup>
//                   </FormControl>
//                 </AccordionDetails>
//               </Accordion>
//               <Accordion sx={{ maxWidth: 550 }}>
//                 <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
//                   <Typography>Accordion 2</Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   <FormControl>
//                     <RadioGroup
//                       aria-labelledby="demo-radio-buttons-group-label"
//                       defaultValue="female"
//                       name="radio-buttons-group"
//                     >
//                       <FormControlLabel value="female" control={<Radio />} label="True" />
//                       <FormControlLabel value="male" control={<Radio />} label="False" />
//                       <FormControlLabel value="other" control={<Radio />} label="Not Given" />
//                     </RadioGroup>
//                   </FormControl>
//                 </AccordionDetails>
//               </Accordion>
//               <Accordion sx={{ maxWidth: 550 }}>
//                 <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
//                   <Typography>Accordion 3</Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   <FormControl>
//                     <RadioGroup
//                       aria-labelledby="demo-radio-buttons-group-label"
//                       defaultValue="female"
//                       name="radio-buttons-group"
//                     >
//                       <FormControlLabel value="female" control={<Radio />} label="True" />
//                       <FormControlLabel value="male" control={<Radio />} label="False" />
//                       <FormControlLabel value="other" control={<Radio />} label="Not Given" />
//                     </RadioGroup>
//                   </FormControl>
//                 </AccordionDetails>
//               </Accordion>
//             </div>
//           </Grid>
//         </Grid>
//         <Grid container marginTop={2}>
//           <Grid item alignSelf={'center'} paddingX={2}>
//             <FormGroup>
//               <FormControlLabel control={<Checkbox defaultChecked />} label="Review" />
//             </FormGroup>
//           </Grid>
//           <div>
//             <Grid container paddingX={1} columns={16} columnSpacing={1} marginY={1}>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>Part 1</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>1</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>2</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>3</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>4</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>5</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>6</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>7</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>8</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>9</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>10</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>11</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>12</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>13</h4>
//               </Grid>
//             </Grid>
//             <Grid container paddingX={1} columns={16} columnSpacing={1} marginY={1}>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>Part 2</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>14</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>15</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>16</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>17</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>18</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>19</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>20</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>21</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>22</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>23</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>24</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>25</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>26</h4>
//               </Grid>
//             </Grid>
//             <Grid container paddingX={1} columns={16} columnSpacing={1}>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>Part 3</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>27</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>28</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>29</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>30</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>31</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>32</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>33</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>34</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>35</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>36</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>37</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>38</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>39</h4>
//               </Grid>
//               <Grid item>
//                 <h4 style={{ margin: 0, border: 1, borderStyle: 'solid', padding: 5 }}>40</h4>
//               </Grid>
//             </Grid>
//           </div>
//         </Grid>
//       </Box>
//     </div>
//   );
// }
