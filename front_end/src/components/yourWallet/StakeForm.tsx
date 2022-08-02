import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import {Token} from "../Main"
import {formatUnits} from "@ethersproject/units"
import {Button, CircularProgress, Input} from "@material-ui/core"
import React, {useEffect, useState} from "react"
import { useStakeTokens } from "../../hooks/useStakeTokens"
import { utils } from "ethers"


export interface StakeFormProps {
    token: Token
}

export const StakeForm = ({token} : StakeFormProps) => {
    const {address : tokenAddress, name} = token
    const {account} = useEthers()
    const tokenBalance = useTokenBalance(tokenAddress, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    
    const {notifications} = useNotifications()
    
    const [amount , setAmount] = useState<number | string | Array<number | string>>(0)
    const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value=== "" ? "" : Number(event.target.value);
        setAmount(newAmount)
    }

    const {approveAndStake, state: approveAndStakeErc20State} = useStakeTokens(tokenAddress)
    
    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        return approveAndStake(amountAsWei.toString())
    }
    const isMining = approveAndStakeErc20State.status === "Mining"
    
    useEffect(() => {
        // check if notifcs have changed
        if (notifications.filter( (notification)  => 
            notification.type === "transactionSucceed" && 
            notification.transactionName === "Approve ERC20 transfer").length > 0)
            {
                console.log('APPROVED ERC20 TRANSFER! ');
            }
            if (notifications.filter( (notification)  => 
            notification.type === "transactionSucceed" && 
            notification.transactionName === "Stake Tokens").length > 0)
            {
                console.log(' TOKENS STAKED! ');
                // min 15:54
            }
    },  [notifications])
    return (
        <>
            <Input onChange={handleInputChange}/>
            <Button onClick={handleStakeSubmit} disabled={isMining}
            
            color="primary" size="large"> { isMining ? <CircularProgress size={26} /> : "Stake!!!" } </Button>
        </>
    )
}