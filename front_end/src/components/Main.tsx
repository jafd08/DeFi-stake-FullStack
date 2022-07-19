import { useEthers } from "@usedapp/core"
import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import {constants} from "ethers"
import brownieConfig from "../brownie-config.json"
import dapp from "../dapp.png"
import eth from "../eth.png"
import dai from "../dai.png"
import {YourWallet} from "./yourWallet"


export type Token = {
    image:string
    address: string
    name: string
}
export const Main = () => {
    // show token values from the wallet
    // get the address of different tokens
    // get the balance of the users wallets

    // send the brownie config to our src folder
    // send the build folder -> access to the dapp token address and other mock addresses
    const {chainId, error} = useEthers()
    const networkName = chainId ? helperConfig[chainId] : "dev"
    const dappTokenAddress  = chainId ? networkMapping[String(chainId)]["DappToken"][0] : constants.AddressZero 
    //console.log('dappTokenAddress: ', dappTokenAddress)
    // look into mapping the address of dapptoken of the network

    const wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero // brownie
    const fauTokenAddress = chainId ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero // brownie

    const supportedTokens: Array<Token> = [ 
        {
            image: dapp,
            address: dappTokenAddress,
            name: "DAPP"
        },
        {
            image: eth,
            address: wethTokenAddress,
            name: "WETH"
        },
        {
            image: dai,
            address: fauTokenAddress,
            name: "DAI"
        },

    ]
    return (<YourWallet supportedTokens={supportedTokens} />)
}