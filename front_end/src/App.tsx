import React from 'react';
import logo from './logo.svg';
import {  DAppProvider, Config , ChainId,Kovan,Rinkeby} from '@usedapp/core'
import { Header } from './components/Header';
import { Container } from '@material-ui/core';

function App() {
  return (
    <DAppProvider config={{networks: [Kovan, Rinkeby]}}>
      <Header/>
      <Container maxWidth="md">
        <div> HELLO !!</div>
      </Container>
      
    </DAppProvider >
  );
}

export default App;
