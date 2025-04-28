import path from 'path';

const config = {
    entry: './src/app.ts',
    module: {
       rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        },
        {
            test: /\.m?js/,
            type: "javascript/auto"
        },
        {
            test: /\.m?js/,
            resolve: {
                fullySpecified: false
            }
        },
        {
            test: /\.svg$/,
            include: path.resolve('./src/assets/icons'),
            loader: 'svg-sprite-loader',
            options: {
                symbolId: 'icon-[name]'
            }
        }
       ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    experiments: {
        outputModule: true,  // Включаем экспериментальную фичу для модульного вывода
    },
    output: {
        filename: 'app.js',
        path: path.resolve('./public'),
        module: true,
        library: {
            type: 'module',
        }
        // filename: '[name].js',
        // chunkFilename: '[name].[contenthash].js',
        // path: path.resolve('./public')
    },
    mode: 'production',
    optimization: {
        usedExports: true,
        minimize: true
        // splitChunks: {
        //     chunks: 'all'
        // }
    }
}

export default config;