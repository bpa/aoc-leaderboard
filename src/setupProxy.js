const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/adventofcode',
    createProxyMiddleware({
      target: 'https://adventofcode.com',
      changeOrigin: true,
      pathRewrite: {
        '^/adventofcode': ''
      },
    })
  );
};
