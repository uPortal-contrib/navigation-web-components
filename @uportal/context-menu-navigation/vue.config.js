module.exports = {
    // options...
    transpileDependencies: ['ky'],
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
