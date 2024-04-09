<script>
  import {
    Label,
    GradientButton,
    Input,
    Select,
    Spinner,
    Checkbox,
    Helper,
  } from "flowbite-svelte";
  import { getContext } from "svelte";
  import { enhance } from "$app/forms";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  let proceeding = false;

  function assistantSelected() {
    proceeding = true;
    dispatch("assistant-selected", selectedAssistant);
  }

  let deletePreviousInstances = true;
  let creating = false;
  let creationDone = false;
  let assistants = getContext("assistants");
  let assistantId = "";
  let pageError = "";
  let assistantName = "";
  let selectedAssistant;
  let deleteing = false;
  let deleteError = "";
  assistants.subscribe((updated) => {
    if (assistantId.length) {
      selectedAssistant = updated[assistantId];
    }
  });

  async function doneCleaning(result) {}

  async function doneCreating(data) {
    const created = data.assistant;
    if (data.deleteResult?.error?.message) {
      deleteError = data.deleteResult?.error?.message;
    }
    assistantId = created.id;
    assistants.update((lists) => ({ ...lists, [`${created.id}`]: created }));
  }

  function selectAssistant() {
    selectedAssistant = $assistants[assistantId];
    console.log("select event", assistantId, selectedAssistant);
  }
</script>

<div class="p-4">
  {#if pageError.length}
    <p>Error: {pageError}</p>
  {/if}
  <h1 class="text-md font-semibold mb-4 text-center">Select Assistant</h1>
  <div class="mt-8 grid grid-flow-col content-baseline gap-6">
    <div class="grid gap-6 mb-6">
      <div>
        <Label>
          Assistant
          <Select
            on:change={selectAssistant}
            selected={assistantId}
            class="mt-2"
            items={Object.values($assistants).map(({ id, name }) => ({
              value: id,
              name,
            }))}
            bind:value={assistantId}
          />
        </Label>
      </div>
      <div>
        {#if selectedAssistant}
          <p class="text-sm mb-6">
            Selected Assistant: <span class="ml-6 italic"
              >{selectedAssistant.name}</span
            >
          </p>
          {#if proceeding}
            <GradientButton disabled size="sm" outline color="greenToBlue">
              <Spinner class="me-3" size="4" />
              Proceeding ...
            </GradientButton>
          {:else}
            <GradientButton
              on:click={assistantSelected}
              size="sm"
              outline
              color="greenToBlue"
            >
              Proceed
            </GradientButton>
          {/if}
        {/if}
      </div>
    </div>
    <div>
      <fieldset
        class="
        border
        border-gray-400
        rounded
        p-4
        "
      >
        <legend class="text-sm font-semibold">Create New Assistant</legend>
        <form
          method="POST"
          action="?/createAssistant"
          use:enhance={() => {
            creating = true;
            deleteError = "";
            return async ({ result }) => {
              doneCreating(result.data);
              creating = false;
              creationDone = true;
            };
          }}
        >
          <div class="grid gap-6 mb-6">
            <div>
              <Label for="assistantName" class="mb-2"
                >Assistant assistantName</Label
              >
              <Input
                type="text"
                name="assistantName"
                placeholder="DaVinci"
                required
                bind:value={assistantName}
              />
            </div>
            <div>
              <div class="mb-6">
                <Checkbox
                  name="deletePreviousInstances"
                  bind:checked={deletePreviousInstances}
                  >Delete previous assistants with same name?</Checkbox
                >
              </div>
              <p class="text-center">
                {#if creating}
                  <GradientButton disabled outline color="greenToBlue">
                    <Spinner class="me-3" size="4" />
                    Creating ...
                  </GradientButton>
                {:else}
                  <GradientButton
                    size="sm"
                    outline
                    color="greenToBlue"
                    disabled={assistantName.length === 0}
                    type="submit"
                    >Create
                  </GradientButton>
                  {#if deleteError}
                    <Helper class="mt-2" color="red"
                      ><span class="font-medium">Whoops!</span
                      >{deleteError}</Helper
                    >
                  {/if}
                {/if}
              </p>
            </div>
          </div>
        </form>
      </fieldset>
    </div>
  </div>
</div>
