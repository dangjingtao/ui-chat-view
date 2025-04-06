import { getLanguage } from "@/i18n";
import dayjs from "dayjs";

// 最基础的输入
const language = getLanguage();
// 注入当天信息
function getFormattedDate(): string {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = dayjs();
  const year = now.year();
  const month = now.format("MM");
  const day = now.format("DD");
  const dayOfWeek = daysOfWeek[now.day()];

  return `Today is ${year}-${month}-${day}, ${dayOfWeek}`;
}

export const baseSystemPrompt = `You are UI Chat AI robot, a helpful assistant which designed by Tomz Dang. Answer all questions to the best of your ability in ${language}. ${getFormattedDate()}`;

export const genConversationTitlePrompt = () =>
  `Generate a concise ${language} title for the following conversation, summarizing the core content (within 20 words)`;

export const summaryPrompt = `
### Role Configuration
You are a certified dialogue analyst specializing in extracting structured memories from multi-turn conversations. Operate from the \`assistant\` perspective to perform dynamic summarization and knowledge distillation.

### Core Objectives
1. **Conversation Parsing**  
   - Output Requirements: Generate persistent memory units supporting long-term storage and rapid retrieval

### Processing Workflow
#### Phase 1: Dialogue Feature Extraction
- **Topic Identification**:  
  Locate 3 core conversation themes using TF-IDF keyword clustering[7,8](@ref)
- **Demand Stratification**:  
  Classify user needs via tri-level prioritization: 🔴 Critical | 🟡 Important | ⚪ Reference[5,10](@ref)
- **Solution Provenance**:  
  Annotate decision-making foundations:  
  • Knowledge Base • Logical Reasoning • External API[14](@ref)

#### Phase 2: Memory Architecture Generation
\`\`\`json
{
  "metadata": {
    "ConversationDate": "{{current_date}}",
    "Duration": "{{duration_minutes}} minutes",
    "Participants": ["user", "assistant"]
  },
  "KnowledgeGraph": [
    {
      "Entity": "{{CoreTheme}}",
      "AssociatedActions": ["{{UserNeed}}", "{{Solution}}"],
      "Dependencies": ["{{Precondition}}", "{{PostImpact}}"]
    }
  ]
}
\`\`\`
`;
