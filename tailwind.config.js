module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{js,ts,vue}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        snapshot: '#f3b04e',
        primary: 'var(--primary-color)',
        'theme-border': 'var(--border-color)',
        'theme-text': 'var(--text-color)',
        'theme-link': 'var(--link-color)',
        'theme-bg': 'var(--bg-color)',
        'theme-block-bg': 'var(--block-bg)',
        'theme-header-bg': 'var(--header-bg)',
        'theme-heading': 'var(--heading-color)',

        blue: '#384aff',
        green: '#21b66f',
        red: '#ff3856'
      }
    },
    spacing: {
      0: '0px',
      1: '4px',
      2: '8px',
      3: '16px',
      4: '24px',
      5: '32px',
      6: '40px'
    },
    screens: {
      xs: '420px',
      sm: '544px',
      md: '768px',
      lg: '1012px',
      xl: '1280px'
    },
    fontSize: {
      '2xl': ['36px', '50px'],
      xl: ['28px', '44px'],
      lg: ['24px', '32px'],
      md: ['20px', '28px'],
      base: ['18px', '24px'],
      sm: ['16px', '22px'],
      xs: ['14px', '20px']
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
