const fs = require("fs");
const path = require("path");

module.exports = {
    /**
     * delete folder
     */
    rmdir(url) {
        let files = [];
        if (fs.existsSync(url)) {
            files = fs.readdirSync(url);
            files.forEach((file, index) => {
                let curPath = path.join(url, file);
                if (fs.statSync(curPath).isDirectory()) {
                    this.rmdir(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(url);
        } else {
            console.log("给定的路径不存在，请给出正确的路径(lib/util.js)");
        }
    }
};
