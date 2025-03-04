import KnowledgeBase from "./modules/KnowledgeBase";
import Character from "./modules/Character";
import Conversation from "./modules/Conversation";
import ModelProvider from "./modules/ModelProvider";
import { applyMixins } from "./utils";
import Base from "./modules/Base";
import type { ModelController } from "./types";

// 实际上这个文件不该再出现this.cache等调用
class CachePlugin extends Base {}

class Controller extends applyMixins(CachePlugin, [
  KnowledgeBase,
  Character,
  Conversation,
  ModelProvider,
]) {}

const controllerInstance = new Controller() as unknown as ModelController;
export default controllerInstance;
