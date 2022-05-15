import * as solanaWeb3 from '@solana/web3.js'
import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz"

let connected = false
const phantomConnectBtn = document.querySelector('[data-phantom-connect]')

if (phantomConnectBtn) {
  phantomConnectBtn.addEventListener('click', async () => {
    if (connected) {
      return
    }
    try {
      const resp = await window.solana.connect()
      const address = resp.publicKey.toString()
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

      phantomConnectBtn.querySelector('span').innerHTML = `Connect ${address}`

    } catch (err) {
      console.error('Unable to connect')
      console.error(err)
    }
  })
}