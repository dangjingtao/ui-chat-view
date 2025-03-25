import request from "@/lib/request";
import { v4 as uuid } from "uuid";
import message from "../message";

export default class ComfyUI {
  api_url: string;
  terminalRef: any;
  ws: WebSocket | null;
  shouldReconnect: boolean = false;

  constructor({ api_url, terminalRef }) {
    this.terminalRef = terminalRef;
    this.api_url = api_url;
    this.ws = null;
  }

  // 格式化系统信息
  private formatSystemStats(data) {
    const { system, devices } = data;
    return `
      <div class="text-gray-700">
        <h2 class="font-bold leader-8">系统信息:</h2>
        <p>操作系统: ${system.os}</p>
        <p>总内存: ${(system.ram_total / 1024 ** 3).toFixed(2)} GB</p>
        <p>可用内存: ${(system.ram_free / 1024 ** 3).toFixed(2)} GB</p>
        <p>ComfyUI 版本: ${system.comfyui_version}</p>
        <p>Python 版本: ${system.python_version}</p>
        <p>PyTorch 版本: ${system.pytorch_version}</p>
        <p>嵌入式 Python: ${system.embedded_python ? "是" : "否"}</p>
        <p>启动参数: ${system.argv.join(" ")}</p>
      </div>
      <br>
      <div class="text-gray-700">
        <h2 class="font-bold leader-8">设备信息:</h2>
        ${devices
          .map(
            (device) => `
          <div>
            <p>名称: ${device.name}</p>
            <p>类型: ${device.type}</p>
            <p>索引: ${device.index}</p>
            <p>总显存: ${(device.vram_total / 1024 ** 3).toFixed(2)} GB</p>
            <p>可用显存: ${(device.vram_free / 1024 ** 3).toFixed(2)} GB</p>
            <p>Torch 总显存: ${(device.torch_vram_total / 1024 ** 3).toFixed(2)} GB</p>
            <p>Torch 可用显存: ${(device.torch_vram_free / 1024 ** 3).toFixed(2)} GB</p>
          </div>
        `,
          )
          .join("")}
      </div>
    `;
  }

  // 检查节点错误
  private validNodeError(
    { client_id, prompt_id, node_errors, number },
    reject,
  ) {
    if (Object.keys(node_errors).length > 0) {
      const msg = `Node Error: ${JSON.stringify(node_errors, null, 2)}`;
      this.terminalRef.value.error(msg);
      reject(msg);
    } else {
      this.terminalRef.value.info(
        `已获取任务id/prompt_id: ${client_id} / ${prompt_id}`,
      );
    }
  }

  // 派发状态处理逻辑
  private handleWebSocketMessage(
    event,
    { onCached, onStart, onExecuting, onProgress, onSuccess },
  ) {
    const { type, data } = JSON.parse(event.data);
    switch (type) {
      case "execution_start":
        onStart(data);
        break;
      case "execution_cached":
        onCached(data);
        break;
      case "executing":
        onExecuting(data);
        break;
      case "progress":
        onProgress(data);
        break;
      case "execution_success":
        onSuccess(data);
        break;
      default:
        break;
    }
  }

  connectWebSocket({
    client_id,
    onCached = (_data) => {},
    onStart = (_data) => {},
    onExecuting = (_data) => {},
    onProgress = (_data) => {},
    onSuccess = (_data) => {},
    onError = (_data) => {},
  }) {
    this.ws = new WebSocket(`ws://${this.api_url}/ws?clientId=${client_id}`);
    // 重连flag
    this.shouldReconnect = true;
    this.ws.onopen = () => {
      this.terminalRef.value.info(`WebSocket connection established`);
    };

    this.ws.onmessage = (event) =>
      this.handleWebSocketMessage(event, {
        onCached,
        onStart,
        onExecuting,
        onProgress,
        onSuccess,
      });

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.terminalRef.value.error("WebSocket connection error");
      this.closeWebSocket();
    };

    this.ws.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
      if (this.shouldReconnect) {
        setTimeout(
          () =>
            this.connectWebSocket({
              client_id,
              onCached,
              onStart,
              onExecuting,
              onProgress,
              onSuccess,
              onError,
            }),
          1000,
        ); // Attempt to reconnect after 1 second
      }
    };
  }

  closeWebSocket() {
    if (this.ws) {
      this.shouldReconnect = false;
      this.ws.close();
      this.ws = null;
      this.terminalRef.value.info("WebSocket connection closed manually");
    }
  }

  async execute(workflowJSON) {
    return new Promise(async (resolve, reject) => {
      const client_id = uuid();
      this.connectWebSocket({
        client_id,
        onExecuting: (data) => {
          this.terminalRef.value.info("Executing node: " + data.node);
        },
        onCached: () => {
          this.terminalRef.value.info("CheckPoint Cached.");
        },
        onStart: () => {
          this.terminalRef.value.clear();
          this.terminalRef.value.info("Execution started");
        },
        onProgress: (data) => {
          const { value, max, node } = data;
          const currentProgress = Math.floor((value / max) * 100);

          this.terminalRef.value.rewrite({
            type: "info",
            msg: `Workflow progress while executing node ${node} [${workflowJSON[node]._meta.title}]:   ${currentProgress}%`,
          });
        },
        onSuccess: async (data) => {
          const { prompt_id } = data;
          const { data: result } = await request({
            url: `http://${this.api_url}/history/${prompt_id}`,
            method: "GET",
            noCache: true,
          });

          this.terminalRef.value.success("Workflow executed successfully!");
          this.closeWebSocket();
          resolve(this.getImages(result[prompt_id].outputs || {}));
        },
        onError: (data) => {
          this.terminalRef.value.error(`failed: ${data}`);
        },
      });

      try {
        const { data } = await request({
          url: `http://${this.api_url}/prompt`,
          method: "POST",
          noCache: true,
          data: {
            prompt: workflowJSON,
            extra_data: { client_id },
          },
        });

        this.validNodeError({ ...data, client_id }, reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  getImages(result) {
    const images = [];
    Object.values(result).forEach((item) => {
      if (item.images) {
        images.push(...item.images.map((x) => this.images(x)));
      }
    });
    return images;
  }

  images(imageItems) {
    const params = new URLSearchParams(imageItems).toString();
    return `http://${this.api_url}/view?${params}`;
  }

  async checkState() {
    try {
      const { data } = await request({
        url: `http://${this.api_url}/system_stats`,
        method: "GET",
        noCache: true,
      });

      return this.formatSystemStats(data);
    } catch (error) {
      message.error("连接服务器失败: " + error.message);
      return null;
    }
  }
}
