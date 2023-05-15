import { styled } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';

import Container from '../dashboard/container/Container';

const StyledRoot = styled('div')({
    // display: 'flex',
    // minHeight: '100%',
    // overflow: 'hidden',
});

export default function Dashboard() {
    return (
        <StyledRoot>
            {/* <Header button={button} /> */}

            <Container maxWidth={false}>
                <Outlet />
            </Container>
        </StyledRoot>
    );
}
