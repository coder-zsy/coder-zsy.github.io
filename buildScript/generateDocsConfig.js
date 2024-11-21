const fs = require("fs");
const path = require("path");

// 读取文件的第一行非空字符
function getFirstNonEmptyLine(filePath) {
  const lines = fs.readFileSync(filePath, "utf8").split("\n");
  for (const line of lines) {
    const trimmedLine = line.trim(); // 去除前后空格
    if (trimmedLine) {
      // 去除前导和结尾的 #
      return trimmedLine.replace(/^#*\s*/, "").trim();
    }
  }
  return null; // 如果没有非空行，返回 null
}

// 遍历目录并收集文件信息
function traverseDirectory(dir, baseDir) {
  const result = []; // 初始化为对象
  const items = fs.readdirSync(dir); // 读取目录内容

  items.forEach((item) => {
    const itemPath = path.join(dir, item);
    /**
     * itemPath已经是绝对路径，截取docs后的路径即可
     */
    const formattedPath = itemPath.replace(/^.*?\/docs\//, "docs/");
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      // 如果是子目录，递归调用
      const subDirResult = traverseDirectory(itemPath, baseDir);
      // 添加子目录的信息
      result.push({
        key: formattedPath,
        label: item,
        type: "directory",
        children: subDirResult,
      });
    } else if (stats.isFile() && item.endsWith(".md")) {
      // 如果是 .md 文件
      const firstLine = getFirstNonEmptyLine(itemPath); // 获取第一行非空字符
      if (firstLine) {
        result.push({
          key: formattedPath,
          label: firstLine,
          type: "file",
        });
      } else {
        console.error(
          `Warning: .md file is empty or contains only empty lines: ${itemPath}`
        );
      }
    }
  });
  return result;
}

// 指定要遍历的目录
const baseDirectory = path.join(__dirname, "../public", "docs");

// 执行遍历并获取结果
const docsStructure = traverseDirectory(baseDirectory, baseDirectory);

// 创建导出文件的内容，使用 JSON.stringify 将对象转为字符串
const outputFilePath = path.join(__dirname, "../public/docsStructure.js");
const exportContent = `module.exports = ${JSON.stringify(docsStructure, null, 2)};`;

// 将生成的内容写入到 docsStructure.js 文件
fs.writeFileSync(outputFilePath, exportContent, "utf8");
console.log(`JavaScript 文件已成功创建: ${outputFilePath}`);
