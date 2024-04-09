import { openai } from "./ai";
import { castImageModelProp, getImageModelProps } from "./images";

async function createPainting({ request }) {
  const data = await request.formData()
  const model = data.get("imageModel")
  const description = data.get("description")
  const titleRegex = /Title:\s*"([^"]+)"/;
  const match = description.match(titleRegex);
  let title = "Generic title - "
  if (match && match[1]) {
    title = `${match[1]} -`;
  }
  const prompt = `Please create images that strictly 
  match the following criteria: ${description.replace(/\\n/g, '.')}
  `
  const props = Object.keys(getImageModelProps(model)).reduce(
    (acc, prop) => {
      let key = getImageModelProps(model)[prop].name
      console.log(prop, key)
      acc[key] = castImageModelProp({ prop: key, val: data.get(key) })
      return acc
    }
    , {})
  const result = await openai.images.generate({
    model,
    prompt,
    ...props
  });
  return {
    images: result.data.map(({ url, alt }, ndx) => ({
      src: url,
      alt: `${title}${ndx}`
    }))
  }
}

async function generatePaintingDescription({ request }) {
  const data = await request.formData()
  const theme = data.get("theme")
  const assistantId = data.get("assistantId")
  const assistantThreadId = data.get("assistantThreadId")

  await openai.beta.threads.messages.create(
    assistantThreadId,
    {
      role: "user",
      content: `
      Generate a painting description based on the theme '${theme}' for me, please."
      `
    }
  );

  const run = await openai.beta.threads.runs.createAndPoll(
    assistantThreadId,
    {
      assistant_id: assistantId,
      instructions: `Please limit response to max 100 words. 
       Title and Description should be separate lines.`,
    }
  );
  let messages
  if (run.status === 'completed') {
    messages = await openai.beta.threads.messages.list(
      run.thread_id,
      {
        run_id: run.id
      }
    );
  } else {
    return {
      error: run.last_error || { message: "unknown error" }
    }
  }
  const description = messages.data.filter(
    m => m.role === "assistant")[0].content[0].text.value

  return {
    description
  }

}


export {
  generatePaintingDescription,
  createPainting
}
