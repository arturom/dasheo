<script lang="ts">
  import Auth from "./lib/auth/Auth.svelte";
  import StreamSection from "./lib/streams/StreamSection.svelte";
  import { type Stream, type StreamsClient } from "./lib/streams/client";

  let client: StreamsClient | undefined = $state(undefined);
  let streams: Stream[] = $state([]);
  let error: string = $state('');

  function onConnect(c: StreamsClient) {
    client = c;
    fetchStreams(c);
  }

  async function fetchStreams(client: StreamsClient) {
    error = '';
    streams = [];
    try {
      streams = await client.getStreams();
    } catch(err) {
      error = err as string;
    }
  }

</script>

<header>
  <Auth onConnect={onConnect}/>
</header>

{#if client}
  <main>
    {#each streams as stream}
      <StreamSection {stream} {client} />
    {/each}
  </main>
{/if}

<style>

  header {
    padding: 1em;
  }

  main {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(24em, 1fr));
    gap: 2em;
  }
</style>
