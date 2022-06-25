from brownie import network, exceptions
from scripts.helpful_scripts import INITIAL_PRICE_FEED_VALUE, LOCAL_BLOCKCHAIN_ENVIRONMENTS, get_account, get_contract
import pytest
from scripts.deploy import deploy_token_farm_and_dapp_token

def test_set_price_feed_contract():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")
    account = get_account()
    non_owner = get_account(index=1)
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()
    
    #ACT:
    price_feed_address = get_contract("eth_usd_price_feed")
    #token_farm.setPriceFeedContract(dapp_token.address, price_feed_address, {"from": account})
    # Assert
    
    assert token_farm.tokenPriceFeedMapping(dapp_token.address) == price_feed_address
    with pytest.raises(exceptions.VirtualMachineError):
        token_farm.setPriceFeedContract(
            dapp_token.address, price_feed_address, {"from": non_owner}
        )
        
def test_stake_tokens(amount_staked):
    print(" amount_staked:" , amount_staked )
    # arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")
    acc = get_account()
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()
    # act
    dapp_token.approve(token_farm.address, amount_staked, {"from": acc})
    token_farm.stakeTokens(amount_staked, dapp_token.address, {"from": acc})
    # assert
    assert (
        token_farm.stakingBalance(dapp_token.address, acc.address) == amount_staked
    )
    assert token_farm.uniqueTokensStaked(acc.address) == 1
    assert token_farm.stakers(0) == acc.address
    return token_farm, dapp_token

def test_issue_tokens(amount_staked):
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")
    account = get_account()
    token_farm, dapp_token = test_stake_tokens(amount_staked)
    starting_balance = dapp_token.balanceOf(account.address)
    # act
    token_farm.issueTokens({"from": account})
    # arrange
    # deploy mocks on helpful scripts -> initial value of eth is $2k
    # we are staking 1 dapp_token == in price to 1 ETH
    # so we should get 2000 dapp tokens in reward (1 dapp $1)
    # since the price of eth is $2k 
    assert (dapp_token.balanceOf(account.address) == starting_balance + INITIAL_PRICE_FEED_VALUE)
    
def test_get_user_total_value_diff_tokens(amount_staked, random_erc20):
    # test_get_user_total_value_with_different_tokens
    #arrange 
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")
    account = get_account()
    token_farm, dapp_token = test_stake_tokens(amount_staked)
    # act
    token_farm.addAllowedTokens(random_erc20.address, {"from": account})
    token_farm.setPriceFeedContract(random_erc20.address, get_contract("eth_usd_price_feed"), {"from": account})
    random_erc20_stake_amount = amount_staked * 2
    random_erc20.approve(token_farm.address, random_erc20_stake_amount, {"from": account})
    token_farm.stakeTokens(random_erc20_stake_amount, random_erc20.address, {"from": account})
    # assert
    total_value = token_farm.getUserTotalValue(account.address)
    assert total_value == INITIAL_PRICE_FEED_VALUE * 3