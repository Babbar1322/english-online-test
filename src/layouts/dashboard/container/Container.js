import { Container as MUIContainer, styled } from '@mui/material';
import { fadeInUp } from '../../../utils/animations';

const Container = styled(MUIContainer)({
  animation: `${fadeInUp} 0.4s ease`,
});

export default Container;
