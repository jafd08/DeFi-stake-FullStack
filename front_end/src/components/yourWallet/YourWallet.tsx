import {Token} from "../Main"
import React, {useState} from "react"
import {Box} from "@material-ui/core"
import {TabContext, TabList, TabPanel} from "@material-ui/lab"

interface YourWalletProps{
    supportedTokens: Array<Token>
}


export const YourWallet = ({supportedTokens}: YourWalletProps) => {
    return (
        <Box>
            <h1>Your wallet !</h1>
            <Box>
                Whats on our wallet?
            </Box>

        </Box>
    )

}