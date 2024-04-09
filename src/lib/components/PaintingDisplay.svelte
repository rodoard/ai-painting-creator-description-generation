<script>
  import { enhance } from "$app/forms";
  import { getImageModelProps, getImageModels } from "$lib/images";
  import {
    Gallery,
    Spinner,
    Helper,
    GradientButton,
    Label,
    Select,
  } from "flowbite-svelte";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function doneCreating(result) {
    if (result.error) {
      creationError = result.error.message;
    } else {
      dispatch("done-creating", { images: result.images });
    }
  }

  export let loading, description, error, images;

  let creationError = "";
  let creationDone = false;
  let creating = false;

  $: serializedDescription = description.replace(/(?:\r\n|\r|\n)/g, "<br>");

  let imageModels = getImageModels();
  let imageModel = imageModels[0];
  let imageModelProps = {};
  let imageModelPropValues = {};
  function updateImageModelProps() {
    imageModelProps = getImageModelProps(imageModel);
    Object.keys(imageModelProps).forEach((prop) => {
      imageModelPropValues[prop] = imageModelProps[prop].values[0];
    });
  }
  updateImageModelProps();
</script>

<div class="min-h-full grid place-content-center">
  <div>
    {#if loading}
      <p>
        <Label>
          <Spinner class="me-3" size="4" />
          Loading painting description...
        </Label>
      </p>
    {:else if error}
      <p>Error: {error}</p>
    {:else if description.length}
      <div class="h-64 overflow-auto">
        <article class="prose text-center">
          <p>{@html serializedDescription}</p>
        </article>
      </div>

      <div class="text-center mt-8 mb-6">
        <fieldset
          class="
        border
        border-gray-400
        rounded
        p-4
        "
        >
          <legend class="text-sm font-semibold">Generate Painting</legend>

          <form
            method="POST"
            action="?/createPainting"
            use:enhance={() => {
              creating = true;
              images = [];
              creationError = "";
              return async ({ result }) => {
                doneCreating(result.data);
                creating = false;
                creationDone = true;
              };
            }}
          >
            <Label>
              Image Model
              <Select
                on:change={updateImageModelProps}
                selected={imageModel}
                class="mt-2"
                name="imageModel"
                items={imageModels.map((m) => ({ value: m, name: m }))}
                bind:value={imageModel}
              />
            </Label>
            <div
              class="mt-6 justify-center grid grid-flow-col gap-1 auto-cols-max mb-6"
            >
              {#each Object.keys(imageModelProps) as prop, i}
                <div>
                  <Label>
                    {prop}
                    <Select
                      name={imageModelProps[prop].name}
                      class="mt-2"
                      items={imageModelProps[prop].values.map((v) => ({
                        value: v,
                        name: v,
                      }))}
                      bind:value={imageModelPropValues[prop]}
                    />
                  </Label>
                </div>
              {/each}
            </div>
            <input name="description" type="hidden" bind:value={description} />
            {#if creating}
              <GradientButton disabled outline color="greenToBlue">
                <Spinner class="me-3" size="4" />
                Creating painting ...
              </GradientButton>
            {:else}
              <GradientButton type="submit" outline color="greenToBlue">
                Create
              </GradientButton>
              {#if creationDone && creationError.length}
                <Helper class="mt-2" color="red"
                  ><span class="font-medium">Whoops!</span
                  >{creationError}</Helper
                >
              {/if}
            {/if}
          </form>
        </fieldset>
      </div>
    {/if}
  </div>
</div>
