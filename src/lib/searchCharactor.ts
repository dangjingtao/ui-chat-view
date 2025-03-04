import Fuse from "fuse.js";

let fuse;

const options = {
  keys: [
    { name: "zh.title", weight: 0.5 }, // title 权重最高
    { name: "zh.description", weight: 0.3 }, // description 权重次之
    { name: "tags", weight: 0.2 }, // tags 权重最低
  ],
  threshold: 0.3, // 匹配阈值，可以根据需要调整
  distance: 100, // 最大编辑距离
  includeScore: true, // 包含匹配分数
  shouldSort: true, // 是否对结果排序
};

export const searchCharactor = (keyword: string, data) => {
  if (!fuse) {
    fuse = new Fuse(data, options);
  }
  const results = fuse.search(keyword.toLowerCase());

  return results.map((result) => result.item); // 提取匹配的卡片
};
