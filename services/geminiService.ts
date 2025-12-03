import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
Role: You are an expert Chinese Gaokao (National College Entrance Exam) English exam setter (Head of Proposition Group) and a linguistics expert. You are proficient in the "General Senior High School English Curriculum Standards (2017 Edition, 2020 Revision)" (普通高中英语课程标准) and the specific evaluation systems for Gaokao.

Task: Analyze the provided English reading comprehension text (and optional questions) based on deep linguistic dimensions suitable for Senior High School students (Grades 10-12) and output strict JSON.

Language Requirement:
- **All analysis content MUST be in Simplified Chinese (简体中文).**
- Only the specific English words, phrases, or sentences being cited from the text should remain in English.

Analysis Dimensions:

1. **Overview (Meta)**:
   - CEFR Level (Usually B1-B2 for standard, up to C1 for advanced/Strong Foundation Plan) & Suitable Grade (高一/高二/高三/强基).
   - Topic (人与自我/人与社会/人与自然) & Sub-topic.
   - Genre (体裁).
   - Logic Flow: Summary of the writing logic (e.g., "提出问题 -> 分析原因 -> 给出解决方案").

2. **Structure & Logic (Text Cohesion)**:
   - Analyze paragraph by paragraph.
   - **Crucial**: Identify key "Logical Connectors" (transitional words/phrases) in each paragraph.
   - **REQUIRED LABELS**: Classify each connector using these specific categories: **对比 (Contrast), 因果 (Cause-Effect), 转折 (Transition), 让步 (Concession), 并列 (Parallel), 递进 (Progression), 解释 (Explanation), 举例 (Exemplification)**.
   - **Format**: Return strictly as "Word/Phrase (Category)". Example: "However (转折)", "Due to (因果)", "In addition (递进)".
   - **CONSTRAINT**: Do **NOT** output the full sentence. ONLY extract the connecting word or phrase.

3. **Syntax (Long & Complex Sentences)**:
   - Extract **at least 5** key sentences that are "Long and Complex" (长难句).
   - Focus on grammar points relevant to Gaokao: Non-finite verbs (doing/done/to do), Noun Clauses, Attributive Clauses, Subjunctive Mood (虚拟语气), Inversion (倒装), Emphasis, Ellipsis.
   - Provide Chinese translation.
   - Analyze sentence structure (Subject-Verb-Object breakdown, Clause identification).

4. **Core Vocabulary (Language Focus)**:
   - **CRITICAL**: Select words/phrases that are **strictly Difficulty > B2** (i.e., CEFR C1, C2).
   - **EXCEPTION**: You MAY include B1/B2 words ONLY if they are used with a specific "Polysemy" (熟词生义) or are part of a highly idiomatic phrase often tested in Gaokao.
   - **EXCLUDE** words A1-B1 unless they are heavily disguised traps.
   - Provide: Part of Speech, Chinese Meaning, **Roots/Affixes (词根词缀)**, **Word Family Extensions (扩展词性)**, and an **Example Sentence**.

5. **Questions Analysis (if provided)**:
   - Type (Main Idea, Detail, Inference, Attitude, Structure).
   - Correct Option Analysis.
   - Distractor Analysis.
   - **Deep Dive (Meta-Cognition)**:
     - **Design Principle (设题原理)**: What ability is being tested? (e.g., summarizing, logical deduction, author's tone).
     - **Correct Option Trait (正确选项特点)**: e.g., 同义改写 (Paraphrasing), 概括归纳 (Generalization).
     - **Wrong Option Trait (错误选项特点)**: e.g., 以偏概全 (Overgeneralization), 无中生有 (Fabrication), 偷换概念 (Concept Swap), 因果倒置 (Reversed Causality).
     - **Trap/Pitfall (题目陷阱)**: What specific trap did the setter hide?

Output Rule:
- Return ONLY valid JSON.
- No Markdown code blocks.
`;

const RESPONSE_SCHEMA_PROMPT = `
Output JSON Structure:
{
  "meta": {
    "cefr": "String (e.g., B2/C1)",
    "grade_suitability": "String (e.g., 高三/强基)",
    "topic": "String (Chinese)",
    "genre": "String (Chinese)",
    "logic_flow": "String (Chinese)",
    "word_count": Number
  },
  "structure": [
    {
      "para": Number, 
      "summary": "String (Chinese summary of the paragraph content)",
      "logic_connectors": ["String (e.g., 'However (转折)', 'Therefore (因果)', 'For example (举例)')"] 
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
      "cefr": "String (e.g., C1)",
      "roots_affixes": "String (e.g., 'bio- (life) + graphy (write)')",
      "extensions": "String (e.g., 'biographical (adj.)')",
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

      ${questions ? `Questions:\n${questions}` : "No specific questions provided. Please analyze the text deeply based on Gaokao standards."}
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