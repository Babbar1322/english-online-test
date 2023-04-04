import { keyframes } from '@mui/material/styles';

const fadeInUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(5%);
    }

    to {
        opacity: 1;
        transform: translateY(0);
}
`;

const fadeInLeft = keyframes`
    from {
        opacity: 0;
        transform: translateX(5%);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
`;

const fadeInRight = keyframes`
    from {
      opacity: 0;
      transform: translateX(-5%);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
`;

const fadeInZoom = keyframes`
    from {
        opacity: 0;
        transform: scale(0.9, 0.9);
    }

    to {
        opacity: 1;
        transform: scale(1, 1);
    }
`;

export { fadeInLeft, fadeInRight, fadeInUp, fadeInZoom };
