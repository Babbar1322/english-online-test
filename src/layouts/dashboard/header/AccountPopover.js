import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
// mocks_
import account from '../../../_mock/account';
import { selectToken, selectUser, setLogout } from '../../../redux/slices/mainSlice';
import Confirm from '../../../components/confirm';
import useAxios from '../../../hooks/useAxios';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
    {
        label: 'Home',
        icon: 'eva:home-fill',
    },
    {
        label: 'Profile',
        icon: 'eva:person-fill',
    },
    {
        label: 'Settings',
        icon: 'eva:settings-2-fill',
    },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
    const [open, setOpen] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const user = useSelector(selectUser);
    const token = useSelector(selectToken);
    const dispatch = useDispatch();

    const axios = useAxios();

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleLogout = async () => {
        try {
            const res = await axios.post('/logout', {
                token,
            });
            // console.log(res.data);
            if (res.status === 200) {
                dispatch(setLogout());
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleClose = () => {
        setOpen(null);
    };

    return (
        <>
            <IconButton
                onClick={handleOpen}
                sx={{
                    p: 0,
                    ...(open && {
                        '&:before': {
                            zIndex: 1,
                            content: "''",
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            position: 'absolute',
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                        },
                    }),
                }}
            >
                <Avatar src={account.photoURL} alt="photoURL" />
            </IconButton>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 0,
                        mt: 1.5,
                        ml: 0.75,
                        width: 180,
                        '& .MuiMenuItem-root': {
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <Box sx={{ my: 1.5, px: 2.5 }}>
                    <Typography variant="subtitle2" noWrap>
                        {user?.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {user?.email}
                    </Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Stack sx={{ p: 1 }}>
                    {MENU_OPTIONS.map((option) => (
                        <MenuItem key={option.label} onClick={handleClose}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem onClick={() => setAlertVisible(true)} sx={{ m: 1 }}>
                    Logout
                </MenuItem>
            </Popover>
            <Confirm
                mainButton="Logout"
                onClose={() => setAlertVisible(false)}
                onConfirm={handleLogout}
                text="You Want to Logout?"
                title="Are you sure?"
                visible={alertVisible}
            />
        </>
    );
}
