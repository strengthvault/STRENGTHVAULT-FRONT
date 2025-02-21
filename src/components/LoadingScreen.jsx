// LoadingScreen.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import LogoImg from './../assets/logos/strength.png';

const breathingAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.4);
  }
  100% {
    transform: scale(1);
  }
`;

const LoadingScreen = () => {
  return (
    <Box 
    className={"ColorBackground"}
      sx={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box 
        component="img"
        src={LogoImg} 
        alt="Strength Vault Logo"
        sx={{
          width: 120,
          mb: 2,
          animation: `${breathingAnimation} 2s infinite ease-in-out`
        }}
      />
      <Typography variant="h6" color="white">
        Cargando....
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
