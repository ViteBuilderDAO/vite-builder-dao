export const CUSTOM_NET_MAP = 'CUSTOM_NET_MAP'
export const storageKeyMap = {
  mnemonics: 'vite_soliditypp_mnemonics',
  enableVc: 'vite_soliditypp_enableVc',
  CUSTOM_NET_MAP: 'CUSTOM_NET_MAP',
}

export const get = key => {
  if (!storageKeyMap[key]) {
    throw new Error(`Can't find the storage key: ${key}`)
  }

  const str = localStorage.getItem(storageKeyMap[key])
  let json
  if (str == null) {
    return str
  }
  try {
    json = JSON.parse(str)
  } catch (err) {
    console.log(err)
  }

  return json
}

export const set = (key, value) => {
  if (!storageKeyMap[key]) {
    throw new Error(`Can't find the storage key: ${key}`)
  }
  localStorage.setItem(storageKeyMap[key], JSON.stringify(value))
}
