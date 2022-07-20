import * as solanaWeb3 from '@solana/web3.js'
import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz"

const phantomConnectBtn = document.querySelector('[data-phantom-connect]')
const checkConnectionDiv = document.querySelector('[data-connect-check]')

const checkConnection = async () => {
  try {
    const resp = await window.solana.connect()
    const address = resp.publicKey.toString()
    const addressTrunc = address.substr(0, 4) + '...' + address.substr(-4)
    connected = true
    console.log('Account connected: '+address)

    const publicAddress = await resolveToWalletAddress({
      text: address
    })
    const nftArray = await getParsedNftAccountsByOwner({
      publicAddress
    })
    const lotusNfts = nftArray.filter(nft => {
      return nft.updateAuthority === '3n1mz8MyqpQwgX9E8CNPPZtAdJa3aLpuCSMbPumM9wzZ'
    })  
    console.log(lotusNfts)
  } catch (err) {
    console.error('Unable to connect')
    console.error(err)
  }
}

let connected = false

if (checkConnectionDiv) {
  checkConnection()
}

if (phantomConnectBtn) {
  phantomConnectBtn.addEventListener('click', async () => {
    if (connected) {
      return
    }
    await checkConnection()

    if (connected) {
      window.location = '/collections/holders'
    }
  })
}