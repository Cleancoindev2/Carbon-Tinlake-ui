export function networkIdToName(id: string) {
  switch (id) {
    case '1': return 'Mainnet';
    case '2': return 'Morden';
    case '3': return 'Ropsten';
    case '4': return 'Rinkeby';
    case '5': return 'Goerli';
    case '42': return 'Kovan';
    case '100': return 'XDai';
    case '99': return 'Local';
    default: return 'unknown';
  }
}

export function networkUrlToName(url: string) {
  if (url.indexOf('mainnet') > -1) return 'Mainnet';
  if (url.indexOf('morden') > -1) return 'Morden';
  if (url.indexOf('ropsten') > -1) return 'Ropsten;';
  if (url.indexOf('rinkeby') > -1) return 'Rinkeby';
  if (url.indexOf('goerli') > -1) return 'Goerli';
  if (url.indexOf('kovan') > -1) return 'Kovan';
  if (url.indexOf('xDai') > -1) return 'XDai';
  if (url.indexOf('localhost') > -1) return 'Local';
  return 'unknown';
}
