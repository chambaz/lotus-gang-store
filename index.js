import * as solanaWeb3 from '@solana/web3.js'
import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from '@nfteyez/sol-rayz'

const init = async () => {
  console.log('Lotus Gang Store')

  const phantomConnectBtn = document.querySelector('[data-wallet-connect]')
  const checkConnectionDiv = document.querySelector('[data-wallet-check]')

  const checkConnection = async () => {
    try {
      const resp = await window.solana.connect()
      const address = resp.publicKey.toString()
      const addressTrunc = address.substr(0, 4) + '...' + address.substr(-4)
      console.log('Account connected: ' + address)

      const publicAddress = await resolveToWalletAddress({
        text: address,
      })
      const nftArray = await getParsedNftAccountsByOwner({
        publicAddress,
      })
      const lotusNfts = nftArray.filter((nft) => {
        return (
          nft.updateAuthority === '3n1mz8MyqpQwgX9E8CNPPZtAdJa3aLpuCSMbPumM9wzZ'
        )
      })

      return lotusNfts
    } catch (err) {
      console.error('Unable to connect')
      console.error(err)
    }
  }

  if (checkConnectionDiv) {
    const validTokens = await checkConnection()
    if (!validTokens.length) {
      window.location = '/'
    }
  }

  if (phantomConnectBtn) {
    phantomConnectBtn.addEventListener('click', async () => {
      const validTokens = await checkConnection()

      console.log(validTokens)

      if (!validTokens.length) {
        alert('This section of the store is for Lotus Gang holders only.')
      } else {
        window.location = '/collections/holders'
      }
    })
  }
}

document.addEventListener('DOMContentLoaded', init)
