import { getUrl, shorten, explorerUrl, n, ms } from '@/utils/helperFunctions';

export default {
  methods: {
    _explorer: explorerUrl,
    _shorten: shorten,
    _ms: ms,
    _n: n,
    _getUrl(url) {
      const gateway: any =
        import.meta.env.VITE_IPFS_GATEWAY || 'cloudflare-ipfs.com';
      return getUrl(url, gateway);
    }
  }
};
