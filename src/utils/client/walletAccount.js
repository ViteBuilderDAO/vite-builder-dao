import { utils, wallet } from '@vite/vitejs'

export default class WalletAccount {
  constructor({ address }) {
    const privateKey = utils._Buffer.from(utils.ed25519.keyPair().privateKey).toString('hex')

    this.privateKey = privateKey
    this.address = wallet.createAddressByPrivateKey(privateKey).address
    this.type = 'local'

    if (!address) {
      throw new Error('address should not be empty')
    }

    this.address = address
    this.privateKey = null
    this.type = 'wallet'
  }

  async getBalance(provider) {
    return provider.getBalanceInfo(this.address)
  }
}
