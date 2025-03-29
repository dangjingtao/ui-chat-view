import { WebContainer } from "@webcontainer/api";
// Call only once

// export const bootWebContainer = async () => {
//   const webContainerInstance = await WebContainer.boot();
//   console.log(webContainerInstance);
// };

//使用json的方式初始化文件目录
const initFiles = {
  // 文件名
  "package.json": {
    // 声明其为一个文件
    file: {
      // 文件内容
      contents: `
        {
          "name": "demo",
          "private": true,
          "scripts": {
            "dev": "node main.js"
          },
          "devDependencies": {
            "express": "^4.18.2"
          }
        }`,
    },
  },
  "README.md": {
    file: {
      contents: `这是一个基于webcontainer的express-demo`,
    },
  },
};

export class UIChatShadow {
  private webContainer: WebContainer | undefined;

  constructor(params) {
    this.boot();
  }

  async boot() {
    this.webContainer = await WebContainer.boot();
    await this.init();
  }

  async init() {
    if (this.webContainer) {
      await this.webContainer.mount(initFiles);
      await this.install();
    } else {
      console.error("WebContainer is not initialized.");
    }
  }

  async install() {
    await this.webContainer?.fs.writeFile(
      "/main.js",
      `const express = require('express')
      const app = express()
      const port = 3000
      app.get('/', (req, res) => {
        res.send('Hello World!')
      })

      app.listen(port, () => {
        console.log('Example app listening on port 3000')
      })
    `,
      { encoding: "utf-8" },
    );

    const installProcess = await this.webContainer?.spawn("npm", ["i"]);
    // 使用订阅流的方式打印依赖安装进度
    installProcess?.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      }),
    );
  }

  async run() {
    const installProcess = await this.webContainer?.spawn("npm", [
      "run",
      "dev",
    ]);
    installProcess?.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      }),
    );
  }
}
