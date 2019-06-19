module.exports = {
    // options...
    transpileDependencies: ['handlebars', 'ky'],
    runtimeCompiler: true,
    devServer: {
        proxy: {
            '/proxy': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/proxy': '/'
                }
            },
            '/uPortal': {
                target: 'http://localhost:8080',
                changeOrigin: true
            }
        }
    }
};
