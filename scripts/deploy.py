from scripts.helpful_scripts import get_account, get_contract
from brownie import DappToken, TokenFarm, config, network
from web3 import Web3

KEPT_BALANCE = Web3.toWei(100, "ether")
def deploy_token_farm_and_dapp_token():
    account = get_account()
    dapp_token = DappToken.deploy({"from": account})
    token_farm = TokenFarm.deploy(
        dapp_token.address,
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    tx = dapp_token.transfer(token_farm.address, dapp_token.totalSupply() - KEPT_BALANCE , {"from": account})
    tx.wait(1)
    
    #dapp_token (already have), weth_token, fau_token/dai (faucet token... pretending its DAI)
    weth_token = get_contract("weth_token")
    fau_token  = get_contract("fau_token")
    allowed_tokens_dict = {
        dapp_token : get_contract("dai_usd_price_feed"),
        fau_token : get_contract("dai_usd_price_feed"),
        weth_token : get_contract("eth_usd_price_feed"),
    }
    add_allowed_tokens(token_farm, allowed_tokens_dict ,account)
    return token_farm, dapp_token #13 47
    
def add_allowed_tokens(token_farm, allowed_tokens_dict, account):
    # loop on each token
    for token in allowed_tokens_dict:
        add_tx = token_farm.addAllowedTokens(token.address, {"from": account})
        add_tx.wait(1)
        set_tx = token_farm.setPriceFeedContract(token.address, allowed_tokens_dict[token], {"from": account})
        set_tx.wait(1)
    

def main():
    deploy_token_farm_and_dapp_token()


# min 13 30
