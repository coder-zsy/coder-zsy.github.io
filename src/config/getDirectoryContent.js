const fs = require("fs");
const path = require("path");

class GetDirectoryContentPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      "GetDirectoryContentPlugin",
      (compilation, callback) => {
        const directoryPath = path.resolve(
          this.options.rootDir,
          this.options.directory
        );
        const files = getAllFiles(directoryPath);

        // 自动生成目录如果不存在
        const outputPath = path.dirname(this.options.output);
        if (!fs.existsSync(outputPath)) {
          fs.mkdirSync(outputPath, { recursive: true });
        }

        let output = `module.exports = ${JSON.stringify(files)};`;
        fs.writeFile(this.options.output, output, (err) => {
          if (err) return callback(err);
          callback();
        });
      }
    );
  }
}

function getAllFiles(dir) {
  let files = [];
  const list = fs.readdirSync(dir);
  for (let i = 0; i < list.length; i++) {
    const filename = path.join(dir, list[i]);
    const stat = fs.statSync(filename);

    if (stat.isFile()) {
      files.push(filename);
    } else if (stat.isDirectory()) {
      files = files.concat(getAllFiles(filename));
    }
  }
  return files;
}
module.exports = GetDirectoryContentPlugin;
