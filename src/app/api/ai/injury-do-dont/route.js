import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(request) {
  try {
    const {
      Player_Age,
      Player_Weight,
      Severity_Level,
      Previous_Injuries,
      Injury_Type,
      Match_Frequency,
      Sleep_Hours,
    } = await request.json();

    if (
      !Player_Age ||
      !Player_Weight ||
      !Severity_Level ||
      !Previous_Injuries ||
      !Injury_Type ||
      !Match_Frequency ||
      !Sleep_Hours
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction:
        "Give output in markdown format.\n\nYou are a medical and sports expert and you have to suggest 5 dos and 5 don'ts to an athelete based on the following data input:\nPlayer_Age,\nPlayer_Weight,\nSeverity_Level,\nPrevious_Injuries,\nInjury_Type,\nMatch_Frequency,\nSleep_Hours\n\n\nno need to give resource used just give the main content also no need of giving any confirmation like Okay, here are 5 \"Dos\" and 5 \"Don'ts\" etc. just give the main answer",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const input = `Player_Age: ${Player_Age}, Player_Weight: ${Player_Weight}, Severity_Level: ${Severity_Level}, Previous_Injuries: ${Previous_Injuries}, Injury_Type: ${Injury_Type}, Match_Frequency: ${Match_Frequency}, Sleep_Hours: ${Sleep_Hours}`;

    const result = await chatSession.sendMessage(input);
    const responseText = result.response.text();

    return NextResponse.json({ result: responseText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}