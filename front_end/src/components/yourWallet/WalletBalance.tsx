import { useEthers, useTokenBalance } from "@usedapp/core";
import {Token} from "../Main"
import {formatUnits} from "@ethersproject/units"
import {BalanceMsg} from "../../components/BalanceMsg"

export interface WalletBallanceProps{
    token: Token
}

export const WalletBalance = ({token} :WalletBallanceProps) => {
    const { image, address, name } = token
    const { account } = useEthers()
    console.log('account: ', account)
    //const address1 = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD"
    //console.log('address1: ', address1)
    const tokenBalance = useTokenBalance(address, account)
    console.log('tokenBalance: ', tokenBalance)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    console.log(formattedTokenBalance)
    return (
        
        <BalanceMsg label={`Your un-staked ${name} balance`} tokenImgSrc={image} amount={formattedTokenBalance}/>
        
    )
}