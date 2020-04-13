import {CleanWebpackPlugin} from "clean-webpack-plugin";
import HtmlPlugin from "html-webpack-plugin";
import HappyPack from "happypack";
import {TsconfigPathsPlugin} from "tsconfig-paths-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import LodashModuleReplacementPlugin from "lodash-webpack-plugin";
import {HotModuleReplacementPlugin, EnvironmentPlugin} from "webpack";
import autoprefixer from "autoprefixer";
import {pickBy} from "lodash";
import Sass from "sass";

const isDev = (mode) => mode === "development";

function getSCSSPlugins(mode, useModules) {
    return [
        MiniCssExtractPlugin.loader,
        {
            loader: "css-loader",
            options: {
                modules: useModules,
                sourceMap: isDev(mode),
                importLoaders: 2,
                import: true,
            }
        },
        {
            loader: "postcss-loader",
            options: {
                ident: "postcss",
                sourceMap: isDev(mode),
                plugins() {
                    return [
                        autoprefixer([
                            "> 2%",
                        ]),
                    ];
                }
            },
        },
        {
            loader: "sass-loader",
            options: {
                implementation: Sass,
                sassOptions: {
                    outputStyle: "expanded",
                },
                sourceMap: isDev(mode),
            }
        },
    ];
}

const CLIENT_HOST = "localhost";
const CLIENT_PORT = 9000;

export default (env, { mode }) => {
    const config = {
        path: `${__dirname}/public`,
        html: {
            filename: "index.html",
            inject: "body",
            template: `${__dirname}/src/index.html`,
        },
        css: {
            filename: isDev(mode) ?
                "css/[name].css" :
                "css/[name].[chunkhash].css",
            allChunks: true,
            publicPath: "css",
        },
    };
    return {
        devtool: isDev(mode) && "inline-source-map",
        entry: pickBy({
            "react-hot-loader/patch": isDev(mode) && "react-hot-loader/patch",
            [`webpack-dev-server/client?http://${CLIENT_HOST}:${CLIENT_PORT}`]:
                isDev(mode) && `webpack-dev-server/client?http://${CLIENT_HOST}:${CLIENT_PORT}`,
            "webpack/hot/only-dev-server": isDev(mode) && "webpack/hot/only-dev-server",
            bundle: "./src/index.tsx",
        }),
        output: {
            path: config.path,
            publicPath: "/",
            filename: "js/[name].[hash].js",
            chunkFilename: "js/[name].[id].bundle.[chunkhash].js",
        },
        resolve: {
            extensions: [".js", ".json", ".jsx", ".ts", ".tsx"],
            plugins: [
                new TsconfigPathsPlugin(),
            ],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?/,
                    exclude: /node_modules/,
                    loader: "happypack/loader?id=ts",
                },
                {
                    test: /\.module\.(scss|sass)$/,
                    use: getSCSSPlugins(mode, true),
                },
                {
                    test: /\.(scss|sass)$/,
                    exclude: /\.module\.(scss|sass)$/,
                    use: getSCSSPlugins(mode, false),
                },
                {
                    test: /\.svg$/,
                    loader: "svg-inline-loader",
                },
                {
                    test: /.*\.(ttf|eot|woff|woff2|png|ico|jpg|jpeg|gif)$/i,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: isDev(mode) ?
                                    "[path][name].[ext]" :
                                    "[path][name].[hash].[ext]",
                                outputPath: "assets/",
                                publicPath: "/assets/"
                            }
                        },
                    ],
                }
            ],
        },
        plugins: [
            new LodashModuleReplacementPlugin,
            new CleanWebpackPlugin(),
            new HotModuleReplacementPlugin(),
            new HtmlPlugin(config.html),
            new MiniCssExtractPlugin(config.css),
            new EnvironmentPlugin({
                NODE_ENV: mode,
            }),
            new HappyPack({
                id: "ts",
                threads: 4,
                loaders: [
                    {
                        path: "babel-loader",
                        exclude: [/node_modules/],
                        options: {
                            'plugins': ['lodash'],
                            'presets': [['env', { 'modules': false, 'targets': { 'node': 6 } }]]
                        },
                    },
                ]
            }),
        ],
        devServer: {
            port: CLIENT_PORT,
            host: CLIENT_HOST,
            contentBase: "./public",
            hot: true,
            historyApiFallback: true,
            proxy: {
                "/api/**": {
                    target: "http://localhost:9200",
                    secure: false,
                },
                "/**/*": {
                    target: `http://${CLIENT_HOST}:${CLIENT_PORT}/`,
                    secure: false,
                    bypass({
                       headers: {
                           accept = null,
                       },
                    }) {
                        if (accept) {
                            const isHtml = accept.indexOf("html") !== -1;
                            const isImage = accept.indexOf("image") !== -1;
                            if (isHtml || isImage) {
                                return `http://${CLIENT_HOST}:${CLIENT_PORT}/`;
                            }
                        }
                    },
                },
            },
            publicPath: "/",
        },
    };
}

