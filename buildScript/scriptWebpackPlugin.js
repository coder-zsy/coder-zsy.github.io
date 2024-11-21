class ScriptWebpackPlugin {
  constructor(options) {
    this.scriptPath = options.scriptPath;
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap("ScriptWebpackPlugin", (compilation) => {
      const scriptContent = require(this.scriptPath); // 假设这是一个模块化的脚本
      // 运行脚本逻辑...
    });
  }
}

module.exports = ScriptWebpackPlugin;
