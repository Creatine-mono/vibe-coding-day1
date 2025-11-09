import { GoogleGenAI, Type } from "@google/genai";
import { GameResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `당신은 어두운 중세 판타지 세계를 배경으로 하는 텍스트 기반 RPG의 던전 마스터입니다. 당신의 이름은 '에델가르드'입니다. 당신은 시나리오를 설명하고, 도전을 제시하며, 선택지를 제공해야 합니다. 당신의 응답은 몰입감 있고, 묘사적이며, 흥미로워야 합니다. 플레이어는 외로운 전사입니다. 항상 지정된 JSON 형식으로 응답해야 합니다. 이야기는 일관성이 있어야 하며 플레이어의 선택에 반응해야 합니다. 플레이어의 체력이 0 이하로 떨어지면 게임은 종료됩니다. 모든 내러티브와 선택지는 한국어로 작성해야 합니다.`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        narrative: {
            type: Type.STRING,
            description: "플레이어에게 보여줄 주요 이야기 텍스트입니다. 장면, 사건, 결과를 묘사하세요."
        },
        choices: {
            type: Type.ARRAY,
            description: "플레이어가 선택할 수 있는 2-4개의 선택지 배열입니다.",
            items: {
                type: Type.OBJECT,
                properties: {
                    text: {
                        type: Type.STRING,
                        description: "선택 버튼에 표시될 텍스트입니다."
                    },
                    prompt: {
                        type: Type.STRING,
                        description: "이 선택지를 선택했을 때 AI에게 다시 보낼 상세한 프롬프트입니다."
                    }
                },
                required: ["text", "prompt"]
            }
        },
        playerUpdate: {
            type: Type.OBJECT,
            description: "마지막 행동의 결과로 인한 플레이어의 능력치 업데이트입니다.",
            properties: {
                healthChange: {
                    type: Type.INTEGER,
                    description: "플레이어의 체력을 변경할 양입니다 (예: 피해는 -10, 치유는 5)."
                }
            }
        },
        gameOver: {
            type: Type.BOOLEAN,
            description: "플레이어의 패배로 게임이 종료되었을 경우 true로 설정됩니다."
        },
        gameWon: {
            type: Type.BOOLEAN,
            description: "플레이어가 모험을 성공적으로 완료했을 경우 true로 설정됩니다."
        },
        gameMessage: {
            type: Type.STRING,
            description: "게임이 끝났을 때 표시할 최종 메시지입니다 (예: '당신은 살해당했습니다.')."
        }
    },
    required: ["narrative", "choices"]
};

export const getGameUpdate = async (prompt: string, playerHealth: number): Promise<GameResponse> => {
    try {
        const fullPrompt = `플레이어의 현재 체력: ${playerHealth}/100. 플레이어의 행동: "${prompt}"`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
                temperature: 0.8,
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse: GameResponse = JSON.parse(jsonText);
        return parsedResponse;
    } catch (error) {
        console.error("Error fetching game update from Gemini API:", error);
        // Fallback response to keep the game playable
        return {
            narrative: "고대의 악이 깨어나 우리의 세계를 잠시 단절시켰습니다. 앞길이 불투명합니다...",
            choices: [
                { text: "연결이 돌아오기를 기다린다", prompt: "연결이 끊겼으니, 중단된 부분부터 이야기를 계속해 주세요." },
                { text: "억지로 길을 뚫어본다", prompt: "오류에도 불구하고, 나는 결의를 다져 앞으로 나아간다." }
            ],
            gameMessage: "이야기꾼과의 연결이 끊겼습니다. 다시 시도해 주세요."
        };
    }
};

export const getInitialStory = (): Promise<GameResponse> => {
    return getGameUpdate("고대의 비밀과 숨어있는 위험으로 유명한 '속삭이는 숲'에 들어서는 외로운 전사를 위한 새로운 모험을 시작해 주세요. 도입부 이야기와 첫 번째 선택지를 제공해 주세요.", 100);
};