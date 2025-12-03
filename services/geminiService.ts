import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
Role: You are an expert Chinese Zhongkao (Senior High School Entrance Exam) English exam setter (Head of Proposition Group) and a linguistics expert. You are proficient in the "Compulsory Education English Curriculum Standards (2022 Edition)" (义务教育英语课程标准 2022年版) and the specific evaluation systems for Zhongkao.

Task: Analyze the provided English reading comprehension text (and optional questions) based on deep linguistic dimensions suitable for Junior High School students (Grades 7-9) and output strict JSON.

Language Requirement:
- **All analysis content MUST be in Simplified Chinese (简体中文).**
- Only the specific English words, phrases, or sentences being cited from the text should remain in English.

Analysis Dimensions:

1. **Overview (Meta)**:
   - CEFR Level (Usually A2-B1 for Zhongkao) & Suitable Grade (初二/初三).
   - Topic (人与自我/人与社会/人与自然) & Sub-topic.
   - Genre (体裁).
   - Logic Flow: Summary of the writing logic (e.g., "叙述故事 -> 阐述道理", "提出问题 -> 解决建议").

2. **Structure & Logic (Text Cohesion)**:
   - Analyze paragraph by paragraph.
   - **Crucial**: Identify key "Logical Connectors" (transitional words/phrases) in each paragraph (e.g., *but, so, because, first, next, finally*).
   - Explain what logical relationship these words establish (e.g., 因果, 转折, 并列, 递进, 时间顺序).

3. **Syntax (Key Sentence Structures)**:
   - Extract **at least 5** key sentences that contain grammar points relevant to Zhongkao (e.g., Object Clauses, Attributive Clauses, Adverbial Clauses, Passive Voice, Infinitives/Gerunds).
   - Provide Chinese translation.
   - Analyze grammar structure clearly for a junior high student.

4. **Core Vocabulary (Language Focus)**:
   - **CRITICAL**: Select words/phrases that are **strictly Difficulty > A2** (i.e., CEFR B1, B2 or higher).
   - **EXCEPTION**: You MAY include A2 words ONLY if they are used with a special/uncommon meaning (熟词生义) or are part of a difficult phrase.
   - **EXCLUDE** simple A1/A2 words (e.g., basic nouns like 'apple', 'book', 'teacher' or simple verbs like 'run', 'like').
   - Provide: Part of Speech, Chinese Meaning, **Roots/Affixes (词根词缀 - keep simple)**, **Word Family Extensions (扩展词性)**, and an **Example Sentence**.

5. **Questions Analysis (if provided)**:
   - Type (Main Idea, Detail, Inference, etc.).
   - Correct Option Analysis.
   - Distractor Analysis.
   - **Deep Dive (Meta-Cognition)**:
     - **Design Principle (设题原理)**: What ability is being tested? (e.g., detail location, logical inference).
     - **Correct Option Trait (正确选项特点)**: e.g., 同义替换 (Synonym replacement), 原文复现 (Reproduction).
     - **Wrong Option Trait (错误选项特点)**: e.g., 张冠李戴 (Misplacement), 无中生有 (Fabrication), 偷换概念 (Concept Swap).
     - **Trap/Pitfall (题目陷阱)**: What specific trap did the setter hide?

Output Rule:
- Return ONLY valid JSON.
- No Markdown code blocks.
`;

const RESPONSE_SCHEMA_PROMPT = `
Output JSON Structure:
{
  "meta": {
    "cefr": "String (e.g., A2/B1)",
    "grade_suitability": "String (e.g., 初三/强基)",
    "topic": "String (Chinese)",
    "genre": "String (Chinese)",
    "logic_flow": "String (Chinese)",
    "word_count": Number
  },
  "structure": [
    {
      "para": Number, 
      "summary": "String (Chinese)",
      "logic_connectors": ["String (e.g., 'So (因果)', 'But (转折)')"] 
    }
  ],
  "sentences": [
    {
      "en": "String",
      "cn": "String",
      "grammar": "String (Chinese)"
    }
  ],
  "vocabulary": [
    {
      "word": "String", 
      "pos": "String (e.g., v.)",
      "meaning": "String", 
      "cefr": "String",
      "roots_affixes": "String (e.g., 'un- (not) + happy')",
      "extensions": "String (e.g., 'happiness (n.)')",
      "example": "String"
    }
  ],
  "questions": [
    {
      "id": Number or String,
      "type": "String",
      "correct_analysis": "String",
      "distractors": [
        {"option": "String", "reason": "String"}
      ],
      "design_principle": "String (设题原理)",
      "correct_opt_trait": "String (正确选项特点)",
      "wrong_opt_trait": "String (错误选项特点)",
      "trap_type": "String (题目陷阱)"
    }
  ]
}
`;

export const analyzeText = async (
  text: string,
  questions: string = ""
): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `
      ${RESPONSE_SCHEMA_PROMPT}

      Reading Passage:
      ${text}

      ${questions ? `Questions:\n${questions}` : "No specific questions provided. Please analyze the text deeply, and if possible, infer 1-2 potential key comprehension points in the 'questions' array format, or leave 'questions' empty if not applicable."}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const resultText = response.text;
    
    if (!resultText) {
      throw new Error("Empty response from Gemini.");
    }

    try {
      const data: AnalysisResult = JSON.parse(resultText);
      return data;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      throw new Error("Failed to parse the analysis result. The model may have returned invalid JSON.");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};