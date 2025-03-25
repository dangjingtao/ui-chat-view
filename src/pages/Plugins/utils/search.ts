import Fuse from "fuse.js";

let fuse;

const options = {
  keys: [
    { name: "name", weight: 0.6 }, // title 权重最高
    { name: "description", weight: 0.4 }, // description 权重次之
  ],
  threshold: 0.3, // 匹配阈值，可以根据需要调整
  distance: 100, // 最大编辑距离
  includeScore: true, // 包含匹配分数
  shouldSort: true, // 是否对结果排序
};

export const searchPlugin = (keyword: string, data) => {
  if (!fuse) {
    fuse = new Fuse(data, options);
  }
  const results = fuse.search(keyword.toLowerCase());

  return results.map((result) => result.item); // 提取匹配的卡片
};
