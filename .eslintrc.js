module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Disable some overly strict rules for development
    'react-hooks/exhaustive-deps': 'warn', // Change from error to warning
    'react/no-unescaped-entities': 'error', // Keep this as error since we want to fix it
    '@next/next/no-img-element': 'warn', // Allow img elements (change to warning)
  },
};