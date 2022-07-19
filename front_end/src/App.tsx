import React from 'react';
import logo from './logo.svg';
import {  DAppProvider, Config , ChainId,Kovan,Rinkeby} from '@usedapp/core'
import { Header } from './components/Header';
import { Container } from '@material-ui/core';
import { Main } from './components/Main';
import { getDefaultProvider } from 'ethers'

const config: Config = {
  readOnlyChainId: Kovan.chainId,
  readOnlyUrls: {
    [Kovan.chainId]: getDefaultProvider('kovan'),
  },
  notifications:{
    expirationPeriod:1000,
    checkInterval: 1000 //every second check the blockchain on the trasacts that we send
  }
}

function App() {
  return (
    <DAppProvider config={config}>
      <Header/>
      <Container maxWidth="md">
        <div> HELLO !!</div>
        <Main />
      </Container>
      
    </DAppProvider >
  );
}

export default App;
