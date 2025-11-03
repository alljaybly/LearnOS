import { GoogleGenAI, Type } from "@google/genai";
import type { StudyGuide, QuizQuestion, StudyPlan } from '../types';

// FIX: Per coding guidelines, assume API_KEY is present in the environment.
// The API key check has been removed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const studyGuideSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A concise, engaging title for the study material.",
    },
    summary: {
      type: Type.STRING,
      description: "A detailed summary (3-5 paragraphs) of the provided text, suitable for a student.",
    },
    keyConcepts: {
      type: Type.ARRAY,
      description: "A list of the most important concepts, terms, or ideas from the text.",
      items: {
        type: Type.OBJECT,
        properties: {
          concept: {
            type: Type.STRING,
            description: "The name of the key concept.",
          },
          explanation: {
            type: Type.STRING,
            description: "A clear and simple explanation of the concept.",
          },
          visualAid: {
            type: Type.STRING,
            description: "A simple, text-based visual aid or diagram (using ASCII characters like ->, [], (), --, |) to help visualize the concept. Should be concise and fit in a small text box."
          }
        },
        required: ["concept", "explanation", "visualAid"],
      },
    },
  },
  required: ["title", "summary", "keyConcepts"],
};

const quizSchema = {
    type: Type.ARRAY,
    description: "A list of diverse quiz questions based on the text.",
    items: {
      type: Type.OBJECT,
      properties: {
        question: {
          type: Type.STRING,
          description: "The question text.",
        },
        type: {
          type: Type.STRING,
          enum: ['multiple-choice', 'true-false', 'fill-in-blank'],
          description: "The type of the question.",
        },
        options: {
          type: Type.ARRAY,
          description: "An array of possible answers for multiple-choice questions. Should not be present for other types.",
          items: {
            type: Type.STRING,
          },
        },
        answer: {
          type: Type.STRING,
          description: "The correct answer. For true-false, it should be 'True' or 'False'. For fill-in-blank, it is the word(s) to be filled in.",
        },
        explanation: {
          type: Type.STRING,
          description: "A brief explanation for why the answer is correct.",
        },
      },
      required: ["question", "type", "answer", "explanation"],
    },
};

const combinedSchema = {
    type: Type.OBJECT,
    properties: {
        studyGuide: studyGuideSchema,
        quiz: quizSchema,
    },
    required: ["studyGuide", "quiz"],
};

const studyPlanSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A suitable title for the study plan based on the material."
        },
        totalEstimatedTime: {
            type: Type.STRING,
            description: "An overall estimated time to complete the study plan (e.g., '3 days', '1 week')."
        },
        sessions: {
            type: Type.ARRAY,
            description: "A list of structured study sessions, broken down into manageable chunks.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: {
                        type: Type.INTEGER,
                        description: "The sequential day number for the study session (e.g., 1, 2, 3)."
                    },
                    topic: {
                        type: Type.STRING,
                        description: "The main topic or chapter for this study session."
                    },
                    objectives: {
                        type: Type.ARRAY,
                        description: "A list of 2-4 specific, actionable learning objectives for this session.",
                        items: {
                            type: Type.STRING,
                        }
                    },
                    estimatedTime: {
                        type: Type.STRING,
                        description: "Estimated time for this specific session (e.g., '45 minutes', '1.5 hours')."
                    }
                },
                required: ["day", "topic", "objectives", "estimatedTime"]
            }
        }
    },
    required: ["title", "totalEstimatedTime", "sessions"]
};


export const generateQuiz = async (material: string): Promise<QuizQuestion[]> => {
    const prompt = `Based on the following study material, generate a 5-question quiz. The quiz should include a mix of multiple-choice, true-false, and fill-in-the-blank questions.

Study Material:
---
${material}
---
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { quiz: quizSchema },
                    required: ["quiz"]
                },
                temperature: 0.8,
            },
        });

        const jsonString = response.text;
        const parsedResponse = JSON.parse(jsonString);
        return parsedResponse.quiz;

    } catch (error) {
        console.error("Error generating quiz with Gemini:", error);
        throw new Error("Failed to communicate with the AI model to generate a quiz.");
    }
};


export const generateStudyGuideAndQuiz = async (material: string): Promise<{ studyGuide: StudyGuide; quiz: QuizQuestion[] }> => {
  const prompt = `Based on the following study material, generate a comprehensive study guide and a 5-question quiz. The study guide must include a title, a summary, and key concepts. For EACH key concept, provide an explanation AND a simple text-based visual aid (like an ASCII diagram) to help visualize it. The quiz should include a mix of multiple-choice, true-false, and fill-in-the-blank questions.

Study Material:
---
${material}
---
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: combinedSchema,
        temperature: 0.7,
      },
    });

    const jsonString = response.text;
    const parsedResponse = JSON.parse(jsonString);
    
    return {
      studyGuide: parsedResponse.studyGuide,
      quiz: parsedResponse.quiz,
    };

  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};

export const generateStudyPlan = async (material: string): Promise<StudyPlan> => {
    const prompt = `Analyze the following text content and create a personalized, structured study plan. The plan should break down the material into manageable daily sessions. For each session, define a clear topic, a few specific learning objectives, and an estimated time for completion. The overall goal is to create a realistic and effective study schedule for a student.

Study Material:
---
${material}
---
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: studyPlanSchema,
                temperature: 0.5,
            },
        });

        const jsonString = response.text;
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error generating study plan with Gemini:", error);
        throw new Error("Failed to communicate with the AI model to generate a study plan.");
    }
};
