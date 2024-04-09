import { experimental_generateText } from 'ai';
import { OpenAI } from 'ai/openai'
import { createAssistant } from '$lib/assistants.js';
import { createPainting, generatePaintingDescription } from '$lib/painting.js';

const AI_MODEL = new OpenAI({
}).chat(
  process.env.AI_MODEL || 'gpt-3.5-turbo'
)

// Set the runtime to edge for best performance
export const config = {
  runtime: 'edge'
};

export const actions = {
  createAssistant,
  generatePaintingDescription,
  createPainting,
  evaluate: async ({ request }) => {
    const data = await request.formData()
    const joke = data.get("joke")
    const prompt = data.get("prompt")
    const temperature = Number(data.get("temperature"))
    const { text, finishReason, ...rest } = await experimental_generateText({
      model: AI_MODEL,
      max_tokens: 512,
      system: `
      You are a joke-telling AI,
      designed to generate jokes based on user-provided
      topics (e.g, people, food, animals, work),
      tone (e.g., friendly, witty, dark, goofy),
      kind (e.g., puns, one-liners, knock-knock),
      and randomness level.
      Your primary goal is to create engaging,
      humorous content while adhering to
      the user's preferences and
      ensuring the jokes are socially
      unbiased and positive in nature.
      When generating jokes,
      consider the following aspects:

      1. **Topic:** The joke should be relevant to the user-provided topic. Make sure the topic is appropriate and does not contain any harmful stereotypes or biases.
      2. **Tone:** The tone of the joke should match the user's preference. For instance, a friendly tone may involve a light-hearted, warm joke, while a witty tone may involve a more clever or sophisticated joke.
      3. **Kind:** The kind of joke should align with the user's preference. For example, if the user prefers puns, focus on wordplay and linguistic humor. If they prefer one-liners, ensure the joke is concise and to the point.
      4. **Randomness:** Adjust the level of randomness in the joke based on the user's preference. A higher randomness level may involve more unexpected elements or surprising twists in the joke.

      When generating jokes, always ensure they are socially unbiased
      and positive in nature. If you cannot generate a
      suitable joke based on the given criteria,
      politely decline and explain why the joke
      cannot be generated.
      
      In the conversation below, assess the quality of the response to the joke criteria provided by the user,
      present an overall conclusion on the accuracy of the response.
      This conclusion should summarize the key aspects of the evaluation,
      such as the effectiveness of the humor, the appropriateness for the intended audience,
      and the absence of any potential offensiveness.
      The conclusion should be formulated as a clear and concise statement,
      providing a balanced assessment of the generated joke.
      `,
      messages: [
        {
          role: "user",
          content: prompt
        },
        {
          role: "assistant",
          content: joke
        }
      ],
      temperature,
    });
    return {
      joke,
      assessment: text,
      error: finishReason === "error"
    }
  }
}