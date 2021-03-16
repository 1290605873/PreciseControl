
// const path = require('path')
const debug = process.env.NODE_ENV == 'development'
let HTTP='';
HTTP='http://';
const Timestamp = new Date().getTime();
const Version = '1.0.0';
module.exports = {

    // 基本路径
    publicPath: './',
    devServer: {//代理配置
        proxy: {
            '/api': {
                target: HTTP+'testripx.iuoooo.com',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': '/api'
                }
            }
        },
        port:8081
        // https: true
    },
    productionSourceMap: false,
    outputDir: process.env.outputDir,
    configureWebpack: config => { // webpack配置，值位对象时会合并配置，为方法时会改写配置
        if (debug) { // 开发环境配置
            config.devtool = 'cheap-module-eval-source-map'
        } else { // 生产环境配置

        }
        config.plugin('html').tap(args => {
            args[0].hash = true;
            return args
        })
    },
    configureWebpack: { // webpack 配置
        output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
            filename: `js/[name].[hash].${Version}.js`,
            chunkFilename: `js/[name].[chunkhash].${Version}.js`
        },
    },
    css: {
        loaderOptions: {
          sass: {
            data: `
              @import "@/styles/index.scss";
            `
          }
        }
    }
};
