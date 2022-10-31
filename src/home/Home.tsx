import { Container } from '@material-ui/core';
import React from 'react';
import './Home.css';

class Home extends React.Component {
  render() {
    return <Container maxWidth="sm">
      <h1>Home</h1>
      <h3>SonicQR allows uploading of file to convert to base64 before encoding to a series of animating QR codes to be scanned</h3>
    </Container>;
  }
}

export default Home;