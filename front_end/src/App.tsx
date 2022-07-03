import React from 'react';
import logo from './logo.svg';
import {  DAppProvider, Config , ChainId,Kovan,Rinkeby} from '@usedapp/core'
import { Header } from './components/Header';
import { Container } from '@material-ui/core';
import { Main } from './components/Main';

function App() {
  return (
    <DAppProvider config={{networks: [Kovan]}}>
      <Header/>
      <Container maxWidth="md">
        <div> HELLO !!</div>
        <Main />
      </Container>
      
    </DAppProvider >
  );
}

export default App;
