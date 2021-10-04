// https://umijs.org/config/
import { defineConfig } from 'umi';

export default defineConfig({
  plugins: [
    // https://github.com/zthxxx/react-dev-inspector
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
  webpack5: {},
  define: {
    REACT_APP_ACCESSTOKEN:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MzMzNzkwMjgsImV4cCI6MTYzMzQxNTAyOCwicm9sZXMiOlsiUk9MRV9BRE1JTiJdLCJ1c2VybmFtZSI6IkVsbGlvdC1kZXYiLCJmaXJzdE5hbWUiOm51bGwsImxhc3ROYW1lIjpudWxsfQ.MqDO7rGcPdM8Aw3Uqju5PZ1pcYf2krLDw9Ya_0VK174ZzexqzzQU3MwnHfvwvLSpxIZ8BJrCoCkfTABxZXL-nyoBR8--ILZwdQEISVOeb2WP9GOI4LJxdIWl_a27pA5CPpHUPG9DUWc5wAMXZuprzKs5fdZz65jJ3X3sud4sayXJLO6rI8C31mOyy81jGAt2CjiMBQ-fMeLw4TCMR21e6H-ruot1-J2SFKkwI9ZF55KMBwCMhzzYNLWz0DNlCatc3cI1Y2cWnkav98koh7lO8AVSSb8z2xUuX4_kw1ouSYJruHX3uuYyDhywuPMD7_-gPJAjvwhpQ4dqTN2LGr-tKAEbxp3k6KmtYLEb6XPruwXVVpsAB0P6NRkSAlHWUhdkOZNCiN0tLCF3BLTMTbLFLOfGcKfZdNj5A7FRLLYn70uIUNYZQPyura-u1HOg8SGXGgvi-Vhkt-qKaUiBK4VXPvl_xEmQlFYjWYbDjVq18M_d6LkE-MeJw4VZALK5hdR2_-UOFUIPUQumLm_p3vmrqzHOMUh5G8I8vR9XkU24YrUrT9WQRFW2b0emyglkwVBtJmy5s6u1xfLYOZeaITq9lFMHmkULmy3pdB7NMBxKPgiQFt7rFGHKOs5I0ilxIoC8ncpjKJV8Kq7JOmgz7BYH68UI_OzKKTSDxhoqFl_fjys',
    REACT_APP_REFRESH_TOKEN: '',
    REACT_APP_API_URL: 'http://localhost:8000/v3/',
  },
});
