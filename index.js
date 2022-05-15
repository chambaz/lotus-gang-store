import * as solanaWeb3 from '@solana/web3.js'
import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz"

let connected = false
const phantomConnectBtn = document.querySelector('[data-phantom-connect]')
const lotusNftsContainer = document.querySelector('[data-lotus-nfts]')

if (phantomConnectBtn) {
  phantomConnectBtn.addEventListener('click', async () => {
    if (connected) {
      return
    }
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

      const lotusNftMarkup = await Promise.all(lotusNfts.map(async lotusNft => {
        const req = await fetch(lotusNft.data.uri)
        const json = await req.json()
        console.log(lotusNft)
        console.log(json)

        return `
          <div class="lotus-nft">
            <img class="lotus-nft-img" src="${json.image}" />
            <h2 class="lotus-nft-name">${lotusNft.data.name}</h2>
          </div>
        `
      }))

      phantomConnectBtn.querySelector('span').innerHTML = addressTrunc
      lotusNftsContainer.innerHTML = [...lotusNftMarkup, ...lotusNftMarkup, ...lotusNftMarkup, ...lotusNftMarkup, ...lotusNftMarkup, ...lotusNftMarkup, ...lotusNftMarkup, ...lotusNftMarkup].join('')

    } catch (err) {
      console.error('Unable to connect')
      console.error(err)
    }
  })
}