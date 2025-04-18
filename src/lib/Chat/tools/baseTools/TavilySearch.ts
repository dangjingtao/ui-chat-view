// 改写TavilySearch.ts文件，使其支持在UIChat中使用,主要是代理
import { CallbackManagerForToolRun } from "@langchain/core/callbacks/manager";
import { Tool, type ToolParams } from "@langchain/core/tools";
import { getEnvironmentVariable } from "@langchain/core/utils/env";
import { BASE_URL } from "@/config";
import request from "@/lib/request";

/**
 * Options for the TavilySearchResults tool.
 */
export type TavilySearchAPIRetrieverFields = ToolParams & {
  /**
   * The maximum number of search results to return.
   *
   * @default 5
   */
  maxResults?: number;

  /**
   * Additional keyword arguments to pass to the API.
   */
  kwargs?: Record<string, unknown>;

  /**
   * The API key used for authentication with the Tavily Search API.
   *
   */
  apiKey?: string;

  /**
   * Include a list of query-related images in the response.
   *
   * @default false
   */
  includeImages?: boolean;

  /**
   * When includeImages is set to True, this option adds descriptive text for each image.
   *
   * @default false
   */
  includeImageDescriptions?: boolean;

  /**
   * Include a short answer to the original query.
   *
   * @default false
   */
  includeAnswer?: boolean;

  /**
   * Include the cleaned and parsed HTML content of each search result.
   *
   * @default false
   */
  includeRawContent?: boolean;

  /**
   * A list of domains to specifically include in the search results.
   *
   * @default []
   */
  includeDomains?: string[];

  /**
   * A list of domains to specifically exclude from the search results.
   *
   * @default []
   */
  excludeDomains?: string[];

  /**
   * The depth of the search. It can be "basic" or "deep".
   *
   * @default "basic"
   */
  searchDepth?: "basic" | "deep";

  /**
   * The category of the search. This will determine which of our agents will be used for the search. Currently, only "general" and "news" are supported. See https://docs.tavily.com/docs/rest-api/api-reference
   *
   * @default "general"
   */
  topic?: string;

  /**
   * The number of days back from the current date to include in the search results.
   *
   * @default 3
   */
  days?: number;

  /**
   * 成功
   * @param result
   * @returns
   */
  onSuccess?: (result: string) => void;

  /**
   * 失败
   * @param error
   * @returns
   */
  onFailed?: (error: Error) => void;

  /**
   *
   * @param
   * @returns
   */
  onCreated: () => void;
};

/**
 * Tavily search API tool integration.
 *
 * Setup:
 * Install `@langchain/community`. You'll also need an API key set as `TAVILY_API_KEY`.
 *
 * ```bash
 * npm install @langchain/community
 * ```
 *
 * ## [Constructor args](https://api.js.langchain.com/classes/_langchain_community.tools_tavily_search.TavilySearchResults.html#constructor)
 *
 * <details open>
 * <summary><strong>Instantiate</strong></summary>
 *
 * ```typescript
 * import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
 *
 * const tool = new TavilySearchResults({
 *   maxResults: 2,
 *   // ...
 * });
 * ```
 * </details>
 *
 * <br />
 *
 * <details>
 *
 * <summary><strong>Invocation</strong></summary>
 *
 * ```typescript
 * await tool.invoke("what is the current weather in sf?");
 * ```
 * </details>
 *
 * <br />
 *
 * <details>
 *
 * <summary><strong>Invocation with tool call</strong></summary>
 *
 * ```typescript
 * // This is usually generated by a model, but we'll create a tool call directly for demo purposes.
 * const modelGeneratedToolCall = {
 *   args: {
 *     input: "what is the current weather in sf?",
 *   },
 *   id: "tool_call_id",
 *   name: tool.name,
 *   type: "tool_call",
 * };
 * await tool.invoke(modelGeneratedToolCall);
 * ```
 *
 * ```text
 * ToolMessage {
 *   "content": "...",
 *   "name": "tavily_search_results_json",
 *   "additional_kwargs": {},
 *   "response_metadata": {},
 *   "tool_call_id": "tool_call_id"
 * }
 * ```
 * </details>
 */

const fakeRequest = () => {
  return new Promise((resolve, reject) => {
    console.log("fake request");
    setTimeout(() => {
      resolve({
        query: "今天广州天气",
        follow_up_questions: null,
        answer: null,
        images: [],
        results: [
          {
            title: "【广州今天天气预报】广州天气预报24小时详情_广州天气网",
            url: "https://www.tianqi.com/guangzhou/today/",
            content:
              "旅游景点 | 美食| 特产| TAG标签| 便民信息 | 空气质量 天气新闻 天气生活 全国天气 国际天气 历史天气 气温查询 天气常识 台风路径图 推荐 热点 生活 旅游 养生 好物 健康 居家 城市文化 科技 美食 教育 影视 植物 问答 推荐 天气百科 数码百科 生活常识 美食 特产 解梦 星座 19℃ 晴11 ~ 19℃ 天气生活 美食 旅游 特产 ### • 2025年2月10日森林火险气象预报：云南北部的局部地区森林火险气象等级高2025年2月10日森林火险气象预报：云南北部的局部地区森林火险气象等级高 ### • 元宵前夜冷空气突袭 华南伴回南天降温大风齐上阵元宵前夜冷空气突袭 华南伴回南天降温大风齐上阵 ### • 新冷空气将至最大降温超10℃ 27省将迎大范围雨雪新冷空气将至最大降温超10℃ 27省将迎大范围雨雪 ### • 回南天将至紫色暴雪区预警 大范围雨雪增强南方降雨连绵不绝回南天将至紫色暴雪区预警 大范围雨雪增强南方降雨连绵不绝 ### • 情人节前夕迎大范围降雪 元宵节或现雨雪高峰情人节前夕迎大范围降雪 元宵节或现雨雪高峰 ### • 中国震情周报(2月3日至2月9日)：19次3级以上地震中国震情周报(2月3日至2月9日)：19次3级以上地震 ### • 今天湖南全省以阴天间多云为主 明天将迎大范围降雨过程今天湖南全省以阴天间多云为主 明天将迎大范围降雨过程 ### • 国外地震最新消息：瓦努阿图群岛发生5.9级地震国外地震最新消息：瓦努阿图群岛发生5.9级地震 ### • 今天北京晴天为主风力不大 明夜至后天冷空气又来北风再增强今天北京晴天为主风力不大 明夜至后天冷空气又来北风再增强 ### • 我国大部气温先升后降 波动起伏明显我国大部气温先升后降 波动起伏明显 ### • 明天冷空气将给辽宁带来大范围降雪过程 沈阳鞍山等地部分地区降雪较强明天冷空气将给辽宁带来大范围降雪过程 沈阳鞍山等地部分地区降雪较强 全国天气 旅游天气 国际天气 历史天气 天气新闻 天气常识 天气生活 城市美食 城市特产 城市景点 最新专题 最近更新 空气质量 万年历查询 周公解梦 意见反馈 举报邮箱:kf@tianqi.com Copyright © 2009-2025 www.tianqi.com 天气网 . 本站部分文字内容、图片选取自网络，如侵权请联系删除，联系邮箱:kf@tianqi.com",
            score: 0.81204927,
            raw_content: null,
          },
          {
            title: "广州天气预报,广州7天天气预报,广州15天天气预报,广州天气查询",
            url: "https://www.weather.com.cn/weather/101280101.shtml",
            content:
              "更多 北京 上海 成都 杭州 南京 天津 深圳 重庆 西安 广州 青岛 武汉 故宫 阳朔漓江 龙门石窟 野三坡 颐和园 九寨沟 东方明珠 凤凰古城 秦始皇陵 桃花源 佘山 春城湖畔 华彬庄园 观澜湖 依必朗 旭宝 博鳌 玉龙雪山 番禺南沙 东方明珠 <<返回 全国 周边景点 全国> 广东 > 广州> 城区 9℃ <3级 21℃/10℃ <3级 21℃/10℃ <3级转3-4级 20℃/10℃ <3级 20℃/9℃ <3级 19℃/9℃ <3级转3-4级 18℃/8℃ <3级 较适宜 _运动指数_气温较低，在户外运动请注意增减衣物。 较冷 _穿衣指数_建议着厚外套加毛衣等服装。 适宜 _洗车指数_天气较好，适合擦洗汽车。 较舒适 _穿衣指数_建议穿薄外套或牛仔裤等服装。 适宜 _洗车指数_天气较好，适合擦洗汽车。 较舒适 _穿衣指数_建议穿薄外套或牛仔裤等服装。 较舒适 _穿衣指数_建议穿薄外套或牛仔裤等服装。 适宜 _洗车指数_天气较好，适合擦洗汽车。 较舒适 _穿衣指数_建议穿薄外套或牛仔裤等服装。 适宜 _洗车指数_天气较好，适合擦洗汽车。 较舒适 _穿衣指数_建议穿薄外套或牛仔裤等服装。 较舒适 _穿衣指数_建议穿薄外套或牛仔裤等服装。 适宜 _洗车指数_天气较好，适合擦洗汽车。 蓝色治愈系！冬日青海湖绝美 碎冰映日寒 中国天气网青海站 2024-12-16 11:40 灵动！镜头记录广西南宁翠鸟觅食瞬间 中国天气网广西站 2024-12-16 11:49 周边地区 | 周边景点 2024-12-16 18:00更新 深圳_/ _11/21°C 周边地区 | 周边景点 2024-12-16 18:00更新 高清图集 山东威海出现冷流降雪 路面积雪结冰扰出行 甘肃定西：晨雾绕远山 梯田层叠似画卷 蓝色治愈系！冬日青海湖绝美 碎冰映日寒 黑龙江漠河北极村出现“寒夜灯柱”景观 奇幻光影仿佛科幻大片 灵动！镜头记录广西南宁翠鸟觅食瞬间 更多>>高清图集 九寨沟 晴转多云 -4/11℃ 较适宜 青岛 晴转多云 1/7℃ 一般",
            score: 0.7474137,
            raw_content: null,
          },
        ],
        response_time: 1.9,
      });
    }, 2000);
  });
};
export class TavilySearchResults extends Tool {
  static lc_name(): string {
    return "TavilySearchResults";
  }

  description =
    "A search engine optimized for comprehensive, accurate, and trusted results. Useful for when you need to answer questions about current events. Input should be a search query.";

  name = "tavily_search_results_json";

  protected maxResults = 5;

  protected apiKey?: string;

  protected kwargs: Record<string, unknown> = {};

  protected includeImages?: boolean;

  protected includeImageDescriptions?: boolean;

  protected includeAnswer?: boolean;

  protected includeRawContent?: boolean;

  protected includeDomains?: string[];

  protected excludeDomains?: string[];

  protected searchDepth?: "basic" | "deep";

  protected topic?: string;

  protected days?: number;

  protected onCreated: () => void;

  protected onSuccess: (result: string) => void;

  protected onFailed: (error: Error) => void;

  constructor(fields?: TavilySearchAPIRetrieverFields) {
    super(fields);
    this.maxResults = fields?.maxResults ?? this.maxResults;
    this.kwargs = fields?.kwargs ?? this.kwargs;
    this.apiKey = fields?.apiKey ?? getEnvironmentVariable("TAVILY_API_KEY");
    this.includeImages = fields?.includeImages ?? this.includeImages;
    this.includeImageDescriptions =
      fields?.includeImageDescriptions ?? this.includeImageDescriptions;
    this.includeAnswer = fields?.includeAnswer ?? this.includeAnswer;
    this.includeRawContent =
      fields?.includeRawContent ?? this.includeRawContent;
    this.includeDomains = fields?.includeDomains ?? this.includeDomains;
    this.excludeDomains = fields?.excludeDomains ?? this.excludeDomains;
    this.searchDepth = fields?.searchDepth ?? this.searchDepth;
    this.topic = fields?.topic ?? this.topic;
    this.days = fields?.days ?? this.days;
    this.onSuccess = fields?.onSuccess ?? (() => {});
    this.onFailed = fields?.onFailed ?? (() => {});
    this.onCreated = fields?.onCreated ?? (() => {});

    if (this.apiKey === undefined) {
      throw new Error(
        `No Tavily API key found. Either set an environment variable named "TAVILY_API_KEY" or pass an API key as "apiKey".`,
      );
    }
  }

  protected async _call(
    input: string,
    _runManager?: CallbackManagerForToolRun,
  ): Promise<string> {
    this.onCreated();

    const body: Record<string, unknown> = {
      query: input,
      max_results: this.maxResults,
      api_key: this.apiKey,
      include_images: this.includeImages,
      include_image_descriptions: this.includeImageDescriptions,
      include_answer: this.includeAnswer,
      include_raw_content: this.includeRawContent,
      include_domains: this.includeDomains,
      exclude_domains: this.excludeDomains,
      search_depth: this.searchDepth,
      topic: this.topic,
      days: this.days,
    };

    const baseUrl = `${BASE_URL}tavily` || "https://api.tavily.com";

    try {
      const { data: json } = await request({
        url: `${baseUrl}/search`,
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        data: { ...body, ...this.kwargs },
      });

      this.onSuccess({
        response: json,
      });

      return JSON.stringify(json.results);
    } catch (error: unknown) {
      this.onFailed(error as Error);
      return "";
    }

    // onSuccess(json.results);
    // const json = await fakeRequest();

    // return response.results;
    // const baseUrl = "https://api.tavily.com";

    // const response = await fetch(`${baseUrl}/search`, {
    //   method: "POST",
    //   headers: {
    //     "content-type": "application/json",
    //   },
    //   body: JSON.stringify({ ...body, ...this.kwargs }),
    // });
    // const json = await response.json();
    // if (!response.ok) {
    //   throw new Error(
    //     `Request failed with status code ${response.status}: ${json.error}`,
    //   );
    // }
    // if (!Array.isArray(json.results)) {
    //   throw new Error(`Could not parse Tavily results. Please try again.`);
    // }

    // console.error(json.results);
  }
}
