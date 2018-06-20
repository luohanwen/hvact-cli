/*!
 * User: qingwanqian@bigo.sg
 * Date: 2017/6/7
 * Time: 17:13
 */
const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const InlineWebpackPlugin = require("inline-manifest-webpack-plugin");
const CleanCSSPlugin = require("less-plugin-clean-css");
const UglifyJS = require("uglify-js");

const init_project = require("./init_project");
const temp_config_func = require("./temp_config_func");

const autoprefixer = require("autoprefixer"); //post插件
const postCssClean = require("postcss-clean"); //post css插件
const lessAutoprefixerPlugin = require("less-plugin-autoprefix"); //less的插件

const dirname = __dirname;
const project_dir_name = "project";
const project_root = path.resolve(dirname, `./${project_dir_name}`); //项目所在根目录

const remContent = fs.readFileSync("./public/js/rem.js", "UTF-8");

module.exports = function(env) {
    const project_name = env.project;
    const project_dir = `${project_root}/${project_name}/`;
    const production = env.prod; //是否是打包到生产环境
    const isTestEnv = env.test; //是否是打包到测试环境
    const isLocalStartEnv = env.localStart; //是否是start命令启动的本地开发

    console.log("production", production);
    console.log("project_name", project_name);

    if (!fs.existsSync(project_dir)) {
        init_project(project_name);
    }

    temp_config_func({
        project_name: project_name
    });

    const useHash = production || isTestEnv;
    const jsHash = useHash ? ".[hash]" : "";
    const cssContentHash = useHash ? ".[contenthash:8]" : "";
    const imgHash = useHash ? ".[hash:8]" : "";

    const getConfig = require(`./${project_dir_name}/${project_name}/config.js`);

    //兼容config旧配置，以前的config.js直接返回的json,最新的改成返回函数
    const project_config =
        typeof getConfig == "function" ? getConfig() : getConfig;

    //打包后的css和js输出目录
    const productionDir = project_config.prod_dir || `${project_dir}/dist`;

    //生产环境html输出目录
    const productionHtmlDir =
        project_config.prod_html_dir || `${project_dir}/dist`;

    //输出的html文件名字，默认为index.html
    const htmlName = project_config.html_name || "index.html";

    //生产环境js的public path，如果没有使用cdn，或者部署到其它目录，置空
    //生成的js文件的url会是public path/css/a.css
    const productionPublicPath = project_config.prod_public_path || "";

    const extractCss = new ExtractTextWebpackPlugin({
        filename: `css/[name]${cssContentHash}.css`,
        allChunks: false,
        publicPath: production ? productionDir : ""
    });

    let plugins = [
        extractCss,
        new webpack.optimize.CommonsChunkPlugin({
            name: ["vendor", "manifest"]
        }),
        new HtmlWebpackPlugin({
            title: project_config.index_title || "",
            filename: production
                ? `${productionHtmlDir}/${htmlName}`
                : path.resolve(project_dir, `./build/${htmlName}`),
            template:
                project_config.template ||
                path.resolve(dirname, "./public/tpl/index.html"),
            rem_content: production
                ? UglifyJS.minify(remContent).code
                : remContent,
            loading_color: project_config.loading_color || "#6961ef"
        }),
        new InlineWebpackPlugin({
            name: "webpackManifest"
        }),
        new webpack.NamedModulesPlugin()
        // new webpack.HotModuleReplacementPlugin()
    ];

    if (production) {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
                compress: {
                    warnings: false,
                    side_effects: false,
                    unused: false
                }
            }),
            new webpack.LoaderOptionsPlugin({
                minimize: true
            }),
            new webpack.DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify("production")
            })
        );

        if (project_config.plugins && project_config.plugins.length) {
            plugins = plugins.concat(project_config.plugins);
        }
    }

    return {
        entry: project_config.entry,
        resolve: {
            alias: {
                vue$: "vue/dist/vue.esm.js"
            }
        },
        output: {
            filename: `js/[name]${jsHash}.js`,
            path: production
                ? productionDir
                : path.resolve(project_dir, "./build/"),
            chunkFilename: `js/[name].bundle${jsHash}.js`,
            publicPath: production ? productionPublicPath : ""
        },
        module: {
            rules: [
                {
                    test: /\.(jpe?g|gif|png)$/,
                    exclude: /(node_modules)/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 10000,
                                name: `img/[name]${imgHash}.[ext]`
                            }
                        },
                        {
                            loader: "image-webpack-loader",
                            options: {
                                mozjpeg: {
                                    progressive: true,
                                    quality: 65
                                },
                                // optipng.enabled: false will disable optipng
                                optipng: {
                                    enabled: false
                                },
                                pngquant: {
                                    quality: "65-90",
                                    speed: 4
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        name: "img/[name].[hash:7].[ext]"
                    }
                },
                {
                    test: /\.(less|css)$/,
                    exclude: /(node_modules)/,
                    use: extractCss.extract({
                        use: [
                            //'style-loader',
                            "css-loader",
                            /*
                            {
                                loader: 'postcss-loader',
                                options: {
                                    plugins: [
                                        autoprefixer({
                                            browsers:[
                                                'android>=2.3',
                                                'ios>=7.1',
                                                //'ie >= 8',
                                                //'firefox >= 15',
                                                //'chrome >= 15'

                                            ]
                                        }),
                                        postCssClean()
                                    ]
                                }
                            },
                            */
                            {
                                loader: "less-loader",
                                options: {
                                    plugins: [
                                        new lessAutoprefixerPlugin({
                                            browsers: [
                                                "android>=2.3",
                                                "ios>=7.1"
                                            ]
                                        })
                                    ].concat(
                                        production
                                            ? [
                                                  new CleanCSSPlugin({
                                                      advanced: true
                                                  })
                                              ]
                                            : []
                                    )
                                }
                            }
                        ],
                        fallback: "style-loader"
                        //publicPath: path.resolve(__dirname, '/assets/moment/css/')
                    })
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                presets: [["es2015", { modules: false }]],
                                plugins: ["syntax-dynamic-import"]
                            }
                        }
                    ]
                },
                {
                    test: /\.tpl$/,
                    exclude: /(node_modules)/,
                    use: [
                        {
                            loader: "html-loader",
                            options: {
                                attrs: false,
                                minimize: true
                            }
                        }
                    ]
                },
                {
                    test: /\.vue$/,
                    exclude: /(node_modules)/,
                    use: [
                        {
                            loader: "vue-loader",
                            options: {
                                loaders: {
                                    js: "babel-loader"
                                },
                                postcss: [
                                    autoprefixer({
                                        browsers: ["android>=2.3", "ios>=7.1"]
                                    })
                                ]
                            }
                        }
                    ]
                }
            ]
        },
        devServer: {
            contentBase: path.join(__dirname, `project/${project_name}/build`),
            hot: false
        },
        watch: isLocalStartEnv,
        watchOptions: {
            aggregateTimeout: 300,
            ignored: /node_modules/
        },
        devtool: production ? "#source-map" : "cheap-module-eval-source-map",
        performance: {
            hints: false
        },
        plugins: plugins
    };
};
