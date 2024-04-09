<script>
  import PaintingParameters from "$lib/components/PaintingParameters.svelte";
  import PaintingDisplay from "$lib/components/PaintingDisplay.svelte";
  import PaintingGallery from "$lib/components/PaintingGallery.svelte";
  import Assistant from "$lib/components/Assistant.svelte";

  let assistant = null;
  let images = [];
  let error = "";
  let loading = false;
  let description = "";

  function doneGenerating(event) {
    const result = event.detail;
    if (result.error) {
      error = result.error;
    } else {
      ({ description } = result);
    }
  }

  function doneCreating(event) {
    ({ images } = event.detail);
  }

  function assistantSelected(event) {
    assistant = event.detail;
  }
</script>

{#if !assistant}
  <Assistant on:assistant-selected={assistantSelected} />
{:else}
  <main>
    <div class="grid grid-cols-2 gap-4 mt-8 text-sm">
      <div class="p-4 min-h-80 border rounded-md border-slate-300">
        <PaintingParameters
          on:done-generating={doneGenerating}
          {loading}
          {assistant}
        />
      </div>
      <div class="p-4 border rounded-md border-slate-300">
        <PaintingDisplay
          {loading}
          {error}
          {images}
          on:done-creating={doneCreating}
          {description}
        />
      </div>
    </div>
    {#if images.length}
      <div class="p-4 mt-8 border rounded-md border-slate-300">
        <PaintingGallery {images} />
      </div>
    {/if}
  </main>
{/if}
