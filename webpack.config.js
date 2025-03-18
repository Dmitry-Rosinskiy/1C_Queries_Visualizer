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
        }
       ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'app.js',
        path: path.resolve('./public')
    },
    optimization: {
        usedExports: false
    }
}

export default config;