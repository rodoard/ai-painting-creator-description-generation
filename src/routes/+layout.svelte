<script>
  import "./styles.css";

  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  const assistants = writable({});
  setContext("assistants", assistants);
</script>

<div class="app">
  <header class="font-semibold text-center text-xl mt-8">
    DaVinci's Mona Lisa
  </header>

  <main>
    <slot />
  </main>

  <footer>
    <p class="text-sm">Encode AI BootCamp</p>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    box-sizing: border-box;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
  }

  @media (min-width: 480px) {
    footer {
      padding: 12px 0;
    }
  }
</style>
