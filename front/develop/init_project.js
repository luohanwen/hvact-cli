/**
 * User: qingwanqian@bigo.sg
 * Date: 2018/4/16
 * Time: 20:35
 */
const path = require("path");
const fs = require("fs");

const project_root = path.resolve(__dirname, "./project/");

module.exports = function(project_name) {
    if (!project_name) {
        return console.error("请输入项目名字");
    }

    const project_dir = project_root + "/" + project_name + "/";

    if (!fs.existsSync(project_dir)) {
        fs.mkdirSync(project_dir);
    }

    initDir();
    cpConfig(project_dir + "config.js");
    addEntry(project_dir + "src/index.js");

    function initDir() {
        var src_dir = `${project_dir}/src`;
        fs.mkdirSync(src_dir);
        ["css", "img", "js"].forEach(item => {
            let subdir = `${src_dir}/${item}`;
            if (!fs.existsSync(subdir)) {
                fs.mkdirSync(subdir);
            }
        });
    }

    function cpConfig(filename) {
        var contents = `        
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
                prod_dir: path.resolve(__dirname,"../../../online/project/${project_name}"),
                prod_html_dir: path.resolve(__dirname,"../../../online/project/${project_name}"),
                prod_public_path: "",
                plugins: []
            };
        };
        `;
        fs.appendFileSync(filename, contents);
    }

    function addEntry(filename) {
        fs.appendFileSync(filename, 'console.log("Hello web")');
    }
};
