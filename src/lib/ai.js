import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const ASSISTANT_MODEL = process.env.ASSISTANT_MODEL || "gpt-3.5-turbo-16k-0613"


export {
  ASSISTANT_MODEL,
  openai
}
