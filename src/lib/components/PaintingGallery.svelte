<script>
  import { Gallery } from "flowbite-svelte";
  import { afterUpdate } from "svelte";
  export let images;

  let gallery;

  const scrollToBottom = (node) => {
    console.log("scrolling to bootom smooth");
    node.scroll({ top: node.scrollHeight, behavior: "smooth" });
  };

  afterUpdate(() => scrollToBottom(gallery));
</script>

<p class="text-center font-semibold">Painting gallery</p>
<Gallery
  bind:this={gallery}
  class="mt-6 mb-6 grid gap-2 grid-cols-{images.length}  place-items-center"
  items={images}
/>
