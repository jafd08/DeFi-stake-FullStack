import { useEthers } from "@usedapp/core"
import { Button, makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(4),
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(1)
    }
}))
export const Header = () => {
    const classes = useStyles();
    const { account, activateBrowserWallet, deactivate } = useEthers()
    const isConnected = account !== undefined // a bool . If account is not undefined, then we are connected (isConnected = true)

    return (
        <div className={classes.container}>
            
                {isConnected ?
                    <Button color="primary" onClick={() => deactivate()}> Disconnect </Button>
                    :
                    (
                        <Button onClick={() => activateBrowserWallet()}>Connect</Button>

                    ) // min 14:28

                }
                {account && <p>Account: {account}</p>}
            
        </div>
    )
}