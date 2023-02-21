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
} from '@mui/material';
import Header from '../layouts/testDashboard/header';
import Scrollbar from '../components/scrollbar';
import Iconify from '../components/iconify';

export default function ReadingTestPage() {
  const Ref = useRef(null);

  // The state for our timer
  const [timer, setTimer] = useState('00:00:00');

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
    setTimer('00:59:00');
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    const deadline = new Date();

    deadline.setMinutes(deadline.getMinutes() + 59);
    return deadline;
  };
  useEffect(() => {
    clearTimer(getDeadTime());

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
      <Grid container gap={3} columns={13}>
        <Grid item md={6}>
          <Scrollbar>
            <Box component="div" bgcolor={'white'} padding={2}>
              <h4>Part 1</h4>
              <h5>
                <span style={{ color: 'grey' }}>Read the text below and answer question </span>1-13
              </h5>
              <h4>WHAT IT’S LIKE TO HAVE SCHIZOPHRENIA</h4>
              <p>
                If you worked with me or saw me every day, you’d probably think I was a little eccentric—but you might
                not realize I am mentally ill. You’d notice that sometimes I have an odd way of saying things. Sometimes
                I get quiet. And sometimes I have bad days when it’s better to leave me alone.
              </p>
              <p>
                I told my boss and a few close coworkers that I am bipolar because it affords me a bit of leeway with
                some of my slightly off behavior and my occasional need to call in sick. I never, ever tell people that
                I am schizophrenic, because they assume that I have multiple personalities or someday I will snap and
                try to attack them with a broken bottle. Both of which are completely ridiculous.
              </p>
              <p>
                I think and process information very differently than you do. In my office, I am highly valued for my
                creative approaches to problems and situations and for my ability to detect patterns across large sets
                of data. My brain processes much more information than the average brain, and it is constantly at work
                seeking out and forming connections that the average person would never consider. But on some days, it
                feels as if someone has changed the rules of reality, and I am the only one who notices. Some days, I
                believe I have important information that other people aren’t aware of. Sometimes it is vital that I sit
                in a certain spot on the train or avoid milk because it’s part of an attempt to control my mind. Some
                days, I see, hear, or believe things that no one else does.
              </p>
              <p>
                Some days, I feel that every thought in my head is broadcast to the people around me, so I have to be
                extra careful about what I think because I can’t let the people sitting nearby in the coffee shop find
                out my secrets. On other days, I pick up extra information about people and situations. I might be able
                to hear voices that explain what the lady behind me in line at the grocery store is really thinking
                about me. Most times, this extra perception just buzzes quietly in the back of my brain as I go through
                my day. Intense episodes happen infrequently.
              </p>
            </Box>
          </Scrollbar>
        </Grid>
        <Grid item md={6}>
          <Scrollbar>
            <h4>
              <span style={{ color: 'grey' }}>In question </span>1-3, Choose
            </h4>
            <h4>
              TRUE
              <span style={{ marginLeft: 40, color: 'grey' }}>if the statement is true according to the passage</span>
            </h4>
            <h4>
              FALSE
              <span style={{ marginLeft: 30, color: 'grey' }}>if the statement is false according to the passage</span>
            </h4>
            <h4>
              NOT GIVEN
              <span style={{ marginLeft: 15, color: 'grey' }}>if the information is not given in the passage</span>
            </h4>
            <div>
              <Accordion sx={{ maxWidth: 550 }}>
                <AccordionSummary
                  expandIcon={<Iconify icon="mdi:expand-more" />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>
                    <strong>1.</strong> The Author is always aware of her hallucinations.
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <RadioGroup>
                    <FormControlLabel value={'true'} control={<Radio />} label="True" />
                    <FormControlLabel value={'false'} control={<Radio />} label="False" />
                    <FormControlLabel value={'not_given'} control={<Radio />} label="Not Given" />
                  </RadioGroup>
                </AccordionDetails>
              </Accordion>
              <Accordion sx={{ maxWidth: 550 }}>
                <AccordionSummary
                  expandIcon={<Iconify icon="mdi:expand-more" />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography>
                    <strong>2.</strong> The author takes medications on a regular basis.
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <RadioGroup>
                    <FormControlLabel value={'true'} control={<Radio defaultChecked />} label="True" />
                    <FormControlLabel value={'false'} control={<Radio />} label="False" />
                    <FormControlLabel value={'not_given'} control={<Radio />} label="Not Given" />
                  </RadioGroup>
                </AccordionDetails>
              </Accordion>
              <Accordion sx={{ maxWidth: 550 }}>
                <AccordionSummary
                  expandIcon={<Iconify icon="mdi:expand-more" />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>
                    <strong>3.</strong> When the author is having a bad day, she spends time with her partner.
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <RadioGroup>
                    <FormControlLabel value={'true'} control={<Radio defaultChecked />} label="True" />
                    <FormControlLabel value={'false'} control={<Radio />} label="False" />
                    <FormControlLabel value={'not_given'} control={<Radio />} label="Not Given" />
                  </RadioGroup>
                </AccordionDetails>
              </Accordion>
            </div>
          </Scrollbar>
        </Grid>
      </Grid>
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
