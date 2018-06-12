#!/usr/bin/env node
const fs = require("fs");
const program = require("commander");
const download = require("download-git-repo");
const handlebars = require("handlebars");
const inquirer = require("inquirer");
const ora = require("ora");
const chalk = require("chalk");
const symbols = require("log-symbols");

program
    .version("1.0.0", "-v,--version")
    .command("init <name>", "generate a new project from a template")
    .action(name => {
        if (!fs.existsSync(name)) {
            inquirer
                .prompt([{ name: "author", message: "请输入作者名称:" }])
                .then(answers => {
                    const spinner = ora("正在下载模板…");
                    spinner.start();
                    download("luohanwen/vue-practice", name, err => {
                        if (err) {
                            spinner.fail();
                            console.log(symbols.error, chalk.red(err));
                        } else {
                            spinner.succeed();
                            console.log(
                                symbols.success,
                                chalk.green("项目初始化完成")
                            );
                        }
                    });
                });
        } else {
            console.log(symbols.error, chalk.red("项目已存在"));
        }
    });
program.parse(process.argv);
