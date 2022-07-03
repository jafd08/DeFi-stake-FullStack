from scripts.helpful_scripts import get_account, get_contract
from brownie import DappToken, TokenFarm, config, network
from web3 import Web3
import yaml
import os
import shutil
import json

KEPT_BALANCE = Web3.toWei(100, "ether")
def deploy_token_farm_and_dapp_token(front_end_update = False):
    account = get_account()
    dapp_token = DappToken.deploy({"from": account})
    print("dapp_token :" ,dapp_token)
    token_farm = TokenFarm.deploy(
        dapp_token.address,
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    tx = dapp_token.transfer(
            token_farm.address, dapp_token.totalSupply() - KEPT_BALANCE, {"from": account}
        )    
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
    if front_end_update:
        update_front_end()
    return token_farm, dapp_token #min 13 47
    
def add_allowed_tokens(token_farm, allowed_tokens_dict, account):
    # loop on each token
    for token in allowed_tokens_dict:
        add_tx = token_farm.addAllowedTokens(token.address, {"from": account})
        add_tx.wait(1)
        set_tx = token_farm.setPriceFeedContract(token.address, allowed_tokens_dict[token], {"from": account})
        set_tx.wait(1)
    
def update_front_end():
    # sending the FE our config in JSON format
    # from yaml to json
    copy_folders_to_front_end("./build", "./front_end/src/chain-info")
    with open("brownie-config.yaml", "r") as brownie_config: #yaml
        config_dict = yaml.load(brownie_config, Loader = yaml.FullLoader)
        with open("./front_end/src/brownie-config.json", "w") as brownie_config_json:
            json.dump(config_dict, brownie_config_json) #json write
    print("Front end updated!")
            
def copy_folders_to_front_end(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)

def main():
    deploy_token_farm_and_dapp_token(front_end_update = True)

