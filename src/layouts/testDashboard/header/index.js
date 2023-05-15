import { useEffect, useRef, useState } from 'react';
import { AppBar, Container, IconButton, Slider, Stack, Toolbar, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Iconify from '../../../components/iconify';
import Confirm from '../../../components/confirm';

function Header({ button, timer, audio, review }) {
    const navigate = useNavigate();
    const audioRef = useRef();
    const [alertVisible, setAlertVisible] = useState(false);
    const [volume, setVolume] = useState(1);

    const handleVolumeChange = (event) => {
        const volume = event.target.value;
        setVolume(volume);
        audioRef.current.volume = volume;
    };

    useEffect(() => {
        if (audio) audioRef.current.play();
    }, [audio]);
    // console.log(audio);

    // useEffect(() => {
    //     const audio = audioRef.current;
    //     const handleTimeUpdate = () => {
    //         const progress = (audio.currentTime / audio.duration) * 100;
    //         setProgress(progress);
    //     };

    //     const handleProgress = () => {
    //         const buffered = (audio.buffered.end(0) / audio.duration) * 100;
    //         setBuffered(buffered);
    //     };

    //     audio.addEventListener('timeupdate', handleTimeUpdate);
    //     audio.addEventListener('progress', handleProgress);

    //     return () => {
    //         audio.removeEventListener('timeupdate', handleTimeUpdate);
    //         audio.removeEventListener('progress', handleProgress);
    //     };
    // }, []);
    return (
        <>
            <AppBar position="sticky" color="default">
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                        <IconButton
                            sx={{ marginRight: 4, alignSelf: 'center' }}
                            onClick={() => {
                                if (button === 'home') {
                                    setAlertVisible(true);
                                    // const confirm = window.confirm('Are you sure? \nYou Want to leave?');
                                    // if (confirm) {
                                    //   navigate('/dashboard/app', { replace: true });
                                    // }
                                } else {
                                    navigate(-1);
                                }
                            }}
                        >
                            <Iconify icon={button === 'home' ? 'mdi:home' : 'mdi:arrow-back'} width={30} />
                        </IconButton>
                        {/* <Logo /> */}
                        {review && <Typography sx={{ alignSelf: 'center' }}>Review</Typography>}
                        {timer && (
                            <Stack direction="row">
                                <Iconify icon="material-symbols:alarm-outline-rounded" />
                                <Typography sx={{ alignSelf: 'center', marginLeft: 1 }}>{timer}</Typography>
                            </Stack>
                        )}
                        {audio && (
                            <>
                                <audio
                                    src={`${process.env.REACT_APP_BASE_URL}/${audio}`}
                                    autoPlay
                                    controls={review}
                                    ref={audioRef}
                                >
                                    <track kind="captions" />
                                </audio>
                                {!review && (
                                    <Stack spacing={2} direction="row" sx={{ mb: 1, width: '30%' }} alignItems="center">
                                        <Iconify icon="ic:round-volume-up" width={30} />
                                        <Slider
                                            aria-label="Volume"
                                            value={volume}
                                            step={0.1}
                                            min={0}
                                            max={1}
                                            onChange={handleVolumeChange}
                                        />
                                    </Stack>
                                )}
                            </>
                        )}
                        <div />
                    </Toolbar>
                </Container>
            </AppBar>
            <Confirm
                mainButton="Leave"
                onClose={() => setAlertVisible(false)}
                onConfirm={() => navigate('/dashboard/app', { replace: true })}
                text="You Want to leave?"
                title="Are you sure?"
                visible={alertVisible}
            />
        </>
    );
}

Header.propTypes = {
    button: PropTypes.string,
    timer: PropTypes.string,
    audio: PropTypes.string,
    review: PropTypes.bool,
};

export default Header;
