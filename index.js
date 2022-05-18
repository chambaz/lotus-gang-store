import * as solanaWeb3 from '@solana/web3.js'
import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz"

const phantomConnectBtn = document.querySelector('[data-phantom-connect]')
const lotusNftsContainer = document.querySelector('[data-lotus-nfts]')
const productQty = document.querySelector('[data-product-qty]')
const productBtns = document.querySelector('[data-product-btns]')
const lotusNftChosen = document.querySelector('[data-lotus-nft-chosen]')
const lotusNftToken = document.querySelector('[data-lotus-nft-token]')

let connected = false
let chosen = null

if (phantomConnectBtn) {
  productQty.style.opacity = 0
  productBtns.style.opacity = 0

  lotusNftsContainer.addEventListener('click', (e) => {
    console.log(e.target.parentNode)
    if (e.target.parentNode.hasAttribute('data-lotus-nft')) {
      const name = e.target.parentNode.querySelector('[data-lotus-nft-name]').innerHTML
      const lotusNfts = lotusNftsContainer.querySelectorAll('[data-lotus-nft]')
      
      lotusNfts.forEach(lotusNft => {
        lotusNft.style.opacity = 0.25
      })

      if (name != chosen) {
        chosen = name
        lotusNftChosen.querySelector('span').innerHTML = name
        lotusNftToken.value = name

        e.target.parentNode.style.opacity = 1
        productQty.style.opacity = 1
        productBtns.style.opacity = 1
        lotusNftChosen.style.opacity = 1
      } else {
        chosen = null

        productQty.style.opacity = 0
        productBtns.style.opacity = 0
        lotusNftChosen.style.opacity = 0
      }
      
    }
  })

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
          <div class="lotus-nft" data-lotus-nft>
            <img class="lotus-nft-img" src="${json.image}" />
            <h2 class="lotus-nft-name" data-lotus-nft-name>${lotusNft.data.name}</h2>
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