/**
 * 生成项目临时的配置文件temp-config.json,主要用于本地开发时记住一些个人配置，以便做针对性处理
 * 例如：记住命令行输入的项目名，当下次不输入项目名时，默认从此配置里读取
 * User: luohanwen@bigo.sg
 * Date: 2018/6/6
 * Time: 17:54
 */
const path = require("path");
const fs = require("fs");
/**
 *
 * @param {json} options 参数集合
 * @param {string} options.project_name 项目名称
 */
module.exports = function(options) {
    return {
        getProjectName() {}
    };
};
