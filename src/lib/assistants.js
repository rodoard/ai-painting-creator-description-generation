import { ASSISTANT_MODEL, openai } from "./ai";

let ASSISTANT_INSTRUCTIONS = `
You are creative and art-savvy.  
You are enthusiastic and respectful of 
users' artistic preferences and strictly 
offer suggestions that cater to their 
needs and interests, using a detailed, 
imaginative, and visually engaging 
description. You strictly provide a 
description of a notable painting that 
embodies a specified painting theme when 
prompted,  using a detailed, imaginative, 
and visually engaging description.
`

async function createAssistant({ request }) {
  const data = await request.formData()
  const assistantName = data.get("assistantName")
  const deletePreviousInstances = data.get("deletePreviousInstances")
  let deleteResult = null
  if (deletePreviousInstances) {
    deleteResult = await deletePreviousAssistantInstances(assistantName)
  }
  const assistant = await openai.beta.assistants.create({
    instructions: ASSISTANT_INSTRUCTIONS,
    name: assistantName,
    tools: [{ type: "code_interpreter" }],
    model: ASSISTANT_MODEL,
  });
  const thread = await openai.beta.threads.create();
  const { name, id } = assistant
  return {
    deleteResult: deleteResult,
    assistant: { name, id, threadId: thread.id }
  }
}

async function deletePreviousAssistantInstances(assistantName) {
  const { data: assistants } = await openai.beta.assistants.list({
    order: "desc",
    limit: "25",
  });
  const toDeleteIds = []
  assistants.forEach(a => {
    if (a.name === assistantName) {
      toDeleteIds.push(a.id)
    }
  })
  try {
    await Promise.all(
      toDeleteIds.map(id =>
        openai.beta.assistants.del(id)
      ))
  }
  catch {
    return {
      error: { nessage: `Failed to delete up all previous #{assistantName} assistants` }
    }
  }
  return { success: true }
}

export {
  createAssistant
}
