<script>
  import { Label, Select, GradientButton, Spinner } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import { enhance } from "$app/forms";

  export let assistant, loading;

  const dispatch = createEventDispatcher();

  function generating() {
    loading = true;
    dispatch("generating");
  }
  function doneGenerating(result) {
    loading = false;
    dispatch("done-generating", result);
  }
  const themes = [
    "Landscape",
    "Portrait",
    "Still Life",
    "Abstract",
    "Seascape",
    "Urban",
    "Fantasy",
    "Wildlife",
    "Historical",
    "Surrealism",
  ]
    .sort()
    .map((name) => ({ value: name.toLowerCase(), name }));
  let theme = themes[0].value;
</script>

<div>
  <h3 class="text-center text-xl font-medium text-gray-900">
    Painting Parameters
  </h3>
  <div class="grid grid-cols-1 mt-8 mb-8">
    <div>
      <Label>
        Theme
        <Select
          selected={theme}
          class="mt-2"
          items={themes}
          bind:value={theme}
        />
      </Label>
    </div>
  </div>

  <div class="text-center">
    <form
      method="POST"
      action="?/generatePaintingDescription"
      use:enhance={() => {
        generating();
        return async ({ result }) => {
          doneGenerating(result.data);
        };
      }}
    >
      <input name="theme" type="hidden" bind:value={theme} />
      <input
        name="assistantThreadId"
        type="hidden"
        bind:value={assistant.threadId}
      />
      <input name="assistantId" type="hidden" bind:value={assistant.id} />
      {#if loading}
        <GradientButton disabled outline color="greenToBlue">
          <Spinner class="me-3" size="4" />
          Generating ...
        </GradientButton>
      {:else}
        <GradientButton type="submit" outline color="greenToBlue">
          Generate description
        </GradientButton>
      {/if}
    </form>
  </div>
</div>
