import { describe, it, expect } from "vitest";
import parseString from "./promptParser";

describe("parseString", () => {
  it("should parse string with multiple entries and content", () => {
    const input =
      "aaa[_aa=yyyy _a=yyy] bbb[_bbb=xxx] ccc[id=11 type=dddd] 正文内容";
    const result = parseString(input);
    expect(result.infoArray).toEqual([
      { name: "aaa", props: { _aa: "yyyy", _a: "yyy" } },
      { name: "bbb", props: { _bbb: "xxx" } },
      { name: "ccc", props: { id: "11", type: "dddd" } },
    ]);
    expect(result.content).toBe("正文内容");
  });

  it("should parse string with single entry and content", () => {
    const input = "aaa[_aa=yyyy] 正文内容";
    const result = parseString(input);
    expect(result.infoArray).toEqual([{ name: "aaa", props: { _aa: "yyyy" } }]);
    expect(result.content).toBe("正文内容");
  });

  it("should parse string with no content", () => {
    const input = "aaa[_aa=yyyy _a=yyy] bbb[_bbb=xxx]";
    const result = parseString(input);
    expect(result.infoArray).toEqual([
      { name: "aaa", props: { _aa: "yyyy", _a: "yyy" } },
      { name: "bbb", props: { _bbb: "xxx" } },
    ]);
    expect(result.content).toBe("");
  });

  it("should parse string with no entries", () => {
    const input = "正文内容";
    const result = parseString(input);
    expect(result.infoArray).toEqual([]);
    expect(result.content).toBe("正文内容");
  });

  it("should parse empty string", () => {
    const input = "";
    const result = parseString(input);
    expect(result.infoArray).toEqual([]);
    expect(result.content).toBe("");
  });

  it("should handle malformed entries", () => {
    const input = "aaa[_aa=yyyy _a] bbb[_bbb=xxx] 正文内容";
    const result = parseString(input);
    expect(result.infoArray).toEqual([
      { name: "aaa", props: { _aa: "yyyy", _a: undefined } },
      { name: "bbb", props: { _bbb: "xxx" } },
    ]);
    expect(result.content).toBe("正文内容");
  });
});
