export default {
  dev: {
    '/v3/': {
      target: 'https://master.freepayroll.co.nz:20001/',
      changeOrigin: true,
      pathRewrite: { '^/v3': '' },
    },
  },

  // pre: {
  //   '/api/v3': {
  //     target: '/employers/v3',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  // },
};
