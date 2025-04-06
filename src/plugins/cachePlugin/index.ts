import KnowledgeBase from "./modules/KnowledgeBase";
import Character from "./modules/Character";
import Conversation from "./modules/Conversation";
import ModelProvider from "./modules/ModelProvider";
import GPTSovits from "./modules/GPTSovits";
import MCPServer from "./modules/MCPServer";
import Vectors from "./modules/Vectors";

import Base from "./modules/Base";
import { applyMixins } from "./utils";
import type { ModelController } from "./types";

// 实际上这个文件不该再出现this.cache等调用
class CachePlugin extends Base {}
class Controller extends applyMixins(CachePlugin, [
  KnowledgeBase,
  Character,
  Conversation,
  ModelProvider,
  GPTSovits,
  MCPServer,
  Vectors,
]) {}

const controllerInstance = new Controller() as unknown as ModelController;
export default controllerInstance;
