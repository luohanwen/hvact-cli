        
        const path = require("path");
        /**
         * 本项目需要用到的个别配置
         * @param {*} env 命令行传过来的环境参数
         * @param {*} options 扩展参数 方便增加参数
         */
        module.exports = function(env, options) {
            return {
                entry: {
                    index: path.resolve(__dirname, "./src/index.js")
                },
                index_title: "Hello",
                html_name: "",
                loading_color: "#6961ef",
                template: "",
                prod_dir: path.resolve(__dirname,"../../../online/project/act-111"),
                prod_html_dir: path.resolve(__dirname,"../../../online/project/act-111"),
                prod_public_path: "",
                plugins: []
            };
        };
        