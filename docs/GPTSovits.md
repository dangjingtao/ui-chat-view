# GPTSovits API 文档：

## 1. `/get_tts_wav`

`/get_tts_wav` 是一个用于文本到语音（TTS）合成的 API 接口，通过 Gradio 客户端调用。该接口支持上传参考音频和相关参数，生成符合指定文本和语种的语音文件。

## 示例代码
```javascript
import { client } from "@gradio/client";

// 获取示例音频文件
const response_0 = await fetch("https://github.com/gradio-app/gradio/raw/main/test/test_files/audio_sample.wav");
const exampleAudio = await response_0.blob();


// 初始化 Gradio 客户端并调用 API
const app = await client("http://localhost:9872/");
const result = await app.predict("/get_tts_wav", [
    exampleAudio,  // blob 类型，参考音频，需为 3~10 秒，超限会报错
    "Hello!!",     // string 类型，参考音频的文本
    "中文",        // string 类型，参考音频的语种
    "Hello!!",     // string 类型，需要合成的文本
    "中文",        // string 类型，需要合成的语种，限制范围越小判别效果越好
    "不切",        // string 类型，切割方式
    1,             // number 类型，top_k 参数（范围：1~100）
    0,             // number 类型，top_p 参数（范围：0~1）
    0,             // number 类型，temperature 参数（范围：0~1）
    true,          // boolean 类型，开启无参考文本模式（v3 暂不支持）
    0.6,           // number 类型，语速（范围：0.6~1.65）
    true,          // boolean 类型，是否直接调整上次合成结果的语速和音色
    exampleFile,   // blob 类型，可选的多参考音频文件，用于融合音色
    "4",           // string 类型，采样步数（影响速度和质量）
    true,          // boolean 类型，v3 输出是否开启超分（改善音质）
    0.1            // number 类型，句间停顿秒数（范围：0.1~0.5）
]);

// 输出结果
console.log(result.data);
```

## 参数说明
| 参数名         | 类型    | 描述                                             | 取值范围/选项 |
| -------------- | ------- | ------------------------------------------------ | ------------- |
| 参考音频       | blob    | 上传 3~10 秒的参考音频，超过会报错               | -             |
| 参考音频的文本 | string  | 参考音频对应的文本内容                           | -             |
| 参考音频的语种 | string  | 参考音频的语言类型                               | e.g., "中文"  |
| 需要合成的文本 | string  | 需要合成的目标文本                               | -             |
| 需要合成的语种 | string  | 目标文本的语言类型，范围越小判别效果越好         | e.g., "中文"  |
| 怎么切         | string  | 音频切割方式                                     | e.g., "不切"  |
| top_k          | number  | 控制生成多样性的参数                             | 1 ~ 100       |
| top_p          | number  | 控制生成概率分布的参数                           | 0 ~ 1         |
| temperature    | number  | 控制生成随机性的参数                             | 0 ~ 1         |
| 无参考文本模式 | boolean | 是否开启无参考文本模式（v3 不支持，启用会报错）  | true / false  |
| 语速           | number  | 控制语音播放速度                                 | 0.6 ~ 1.65    |
| 调整上次结果   | boolean | 是否直接对上次合成结果调整语速和音色，避免随机性 | true / false  |
| 多参考音频     | blob    | 可选，上传多个参考音频以融合音色                 | -             |
| 采样步数       | string  | 影响生成速度和质量的采样步数                     | e.g., "4"     |
| v3 输出超分    | boolean | v3 版本输出是否开启超分以改善音质                | true / false  |
| 句间停顿秒数   | number  | 句与句之间的停顿时间                             | 0.1 ~ 0.5     |

## 注意事项
1. **参考音频时长**：上传的参考音频必须控制在 3~10 秒内，超出范围会导致错误。
2. **无参考文本模式**：v3 版本暂不支持此模式，启用会导致报错。
3. **多参考音频**：建议上传同性别的多个参考音频以融合音色。若使用微调模型，参考音频应在训练集音色范围内。
4. **采样步数**：增加步数可提高质量但会变慢，降低步数可加快速度但可能影响质量。

## 输出
调用成功后，结果存储在 `result.data` 中，通常为合成的音频文件数据。
