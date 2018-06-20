**Hello web 基础 webpack 配置**

开发一个新活动的时候，请直接

`npm start act_name`

这个时候，就会生成 `project/act_name` ，然后就可以进行开发了。

默认会在项目中生成相应的文件结构

`/src`

`/config.js`

`/src/img`

等等各种文件

当需要打包到正式环境的时候，运行命令

`npm run build act_name`

config.js 参数说明

`

var config={
entry: {
index: path.resolve(project_dir + 'src/index.js')
},

index_title: 'Hello',
html_name:'',
loading_color: '#6961ef',
template: '',
prod_dir: '',
prod_html_dir: '',
prod_public_path: '',
plugins: []
};
`

`entry` 表示 webpack 的 entry，默认为`src/index.js`，自动生成

`index_title` 表示 html 文件生成的 title

`html_name` 表示生成的 html 文件名（需要带上后缀，如 index.php）

`loading_color` 表示默认的 html 文件 loading 的颜色

`template` 表示模板文件路径，默认为 public/tpl/index.html

`prod_dir` 表示正式环境 css 和 js 输出路径，默认为和 develope 同级的`online/project/act_name`

`prod_html_dir` 表示正式环境 html 输出路径，同上

`prod_public_path` 表示正式环境的 bundle 的路径，比如配置了 cdn 之类的，需要用到

`plugins` 表示 webpack 的 plugins，追加
