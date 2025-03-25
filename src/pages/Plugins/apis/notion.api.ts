// src/api/notion.api.ts
import message from "@/lib/message";
import request from "@/lib/request";
import { markdownToBlocks } from "@tryfabric/martian";

const errorHandler = (error: any) => {
  message.error(`请求失败: ${error.message}`);
};

// 检查代理信息，连接状态
export const getBot = async () => {
  try {
    const cachedData = localStorage.getItem("notionBot");
    if (cachedData) {
      return JSON.parse(cachedData);
    } else {
      const { data } = await request({
        url: "/notion/me",
        method: "GET",
        noCache: true,
      });
      localStorage.setItem("notionBot", JSON.stringify(data));
      return data;
    }
  } catch (error) {
    errorHandler(error);
    throw error;
  }
};

// 获取数据库信息（page列表）
export const retrieveDataBase = async () => {
  try {
    const { data } = await request({
      url: "/notion/database",
      method: "GET",
      noCache: true,
    });
    return data;
  } catch (error) {
    errorHandler(error);
    throw error;
  }
};

// 创建页面
export const createPageWithContent = async (
  testArticleTitle: string,
  articleContent: string,
) => {
  try {
    const children = markdownToBlocks(articleContent, {
      strictImageUrls: false,
    });
    const data = {
      properties: {
        Name: {
          title: [
            {
              text: {
                content: testArticleTitle,
              },
            },
          ],
        },
      },
      children,
    };

    const response = await request({
      url: "/notion/page",
      method: "POST",
      data,
    });
    return response;
  } catch (error) {
    errorHandler(error);
    throw error;
  }
};

// 获取数据详情
export const getPage = async (id: string) => {
  try {
    const { data } = await request({
      url: `/notion/page/${id}`,
      method: "GET",
      data: {
        pageId: id,
      },
      noCache: true,
    });
    return data;
  } catch (error) {
    errorHandler(error);
    throw error;
  }
};
