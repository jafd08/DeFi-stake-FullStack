import {Token} from "../Main"
import React, {useState} from "react"
import {Box} from "@material-ui/core"
import {TabContext, TabList, TabPanel} from "@material-ui/lab"
import {Tab} from "@material-ui/core"
import {WalletBalance} from "./WalletBalance"
import {StakeForm} from "../../components/yourWallet/StakeForm"


interface YourWalletProps{
    supportedTokens: Array<Token>
}


export const YourWallet = ({supportedTokens}: YourWalletProps) => {
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
        console.log('selectedTokenIndex: ', selectedTokenIndex)
        console.log('supportedTokens: ', supportedTokens)
    }
    return (
        <Box>
            <h1>Your wallet !</h1>
            <Box>
                Whats on our wallet?
                <TabContext value={selectedTokenIndex.toString()}>
                    <TabList onChange={handleChange} aria-label="stake form tabs">
                        {supportedTokens.map((token, index) => {
                            return(
                            <Tab label={token.name} 
                            value={index.toString()}
                             key={index}/>
                            )
                        })}
                    </TabList>
                    {supportedTokens.map((token, index) => {
                        return (
                            <TabPanel value={index.toString()} key={index}>
                                <div>
                                    
                                    <WalletBalance token={supportedTokens[selectedTokenIndex]} />
                                    <StakeForm token={supportedTokens[selectedTokenIndex]}/>
                                </div>

                            </TabPanel>
                        )
                    })}
                </TabContext>
            </Box>

        </Box>
    )

}