const IPFS = require('ipfs-core')

/**
 *
 */
export async function ipfsSetData(path, content) {
  const node = await IPFS.create()
  const version = await node.version()

  console.log('IPFS Node Version:', version.version)

  // const data = JSON.stringify(content, null, ' ')
  // const buffer = Buffer.from(data)
  const fileAdded = await node.add({
    path: path,
    content: content,
  })

  console.log('VBDAO - ipfsSetData added file:', fileAdded.path, fileAdded.cid)

  return fileAdded
}

/**
 *
 */
export async function ipfsGetData(ipfsCID) {
  const node = await IPFS.create()
  const version = await node.version()

  console.log('IPFS Node Version: ', version.version)

  const chunks = []
  node.cat(ipfsCID).then(filechunks => {
    filechunks.forEach(piece => {
      chunks.push(piece)
    })
  })

  // const parsedData = JSON.parse(chunks)
  console.log('VBDAO - ipfsGetData parsedData: ', chunks)

  return chunks
}
