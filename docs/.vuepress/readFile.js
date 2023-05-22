const fs = require("fs"); // 文件模块
const path = require("path"); // 路径模块

const docsRoot = path.join(__dirname, "..");
const log = console.log;

function ReadFile(dir = docsRoot, filesList = [], fpath = "") {
  const files = fs.readdirSync(dir);

  if (Array.isArray(files)) {
    files.sort((item1, item2) => {
      let c1 = item1.split(".")[0];
      let c2 = item2.split(".")[0];
      return c1 - c2;
    });
  }
  console.log(files);

  files.forEach((item, index) => {
    let filePath = path.join(dir, item);
    const stat = fs.statSync(filePath);
    const fileNameArr = path.basename(filePath).split(".");
    if (stat.isDirectory() && item !== ".vuepress") {
      // 生成目录名
      let title = fileNameArr.length > 1 ? fileNameArr[1] : fileNameArr[0];
      if (!title) {
        log(
          chalk.yellow(
            `warning: 该文件夹 "${filePath}" 没有按照约定命名，将忽略生成相应数据。`
          )
        );
        return;
      }
      const fileObj = {
        title,
        collapsable: false,
        children: [],
      };
      filesList.push(fileObj);
      // log('递归读取文件夹的文件', path.join(dir, item), filesList[index].children, item)
      // 递归读取文件夹的文件 /Users/another/Documents/self-study/reg-rules-js-site/docs/test/test2 [] test2
      ReadFile(path.join(dir, item), fileObj.children, item);
    } else {
      // 生成文件名数组
      let name = null;
      title = null;
      typeFile = null;
      pathName = null;
      let cloneArr = [...fileNameArr];
      typeFile = cloneArr[cloneArr.length - 1];
      if (fileNameArr.length > 1) {
        cloneArr.pop();
        name = cloneArr.join(".");
        pathName = fpath ? `${fpath}/${name}` : name;
        title = cloneArr.length > 1 ? cloneArr[1] : cloneArr[0];
      } else {
        log(
          chalk.yellow(
            `warning: 该文件 "${filePath}" 没有按照约定命名，将忽略生成相应数据。`
          )
        );
        return;
      }

      log("name", name, pathName, typeFile, title);
      if (name === "README") {
      }
      // 过滤非md文件
      if (typeFile === "md") {
        if (name === "README")
          return filesList.unshift({
            path: "/",
            title: "我的博客",
          });
        filesList.push({
          path: pathName,
          title,
        });
      }
    }
  });

  return filesList;
}

module.exports = ReadFile;
