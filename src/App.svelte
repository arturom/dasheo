<script lang="ts">
  import StreamSection from "./lib/StreamSection.svelte";
  import { createWithBasicAuth, createWithHeader, type Stream, type StreamsClient } from "./lib/streams";

  let client: StreamsClient | undefined = $state(undefined);
  let streams: Stream[] = $state([]);

  let baseUrl: string = $state('nuxeo/api/v1');
  let username: string = $state('Administrator');
  let password: string = $state('Administrator');
  let headerName: string = $state('');
  let headerValue: string = $state('');
  let error: string = $state('');


  async function basicAuth(e: SubmitEvent) {
    e.preventDefault();
    e.stopPropagation();
    client = createWithBasicAuth(baseUrl, username, password);
    fetchStreams(client);
  }

  async function customAuth(e: SubmitEvent) {
    e.preventDefault();
    e.stopPropagation();
    client = createWithHeader(baseUrl, headerName, headerValue);
    fetchStreams(client);
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

  <form onsubmit={basicAuth}>
    <h4>Basic Auth</h4>
    <label>Base URL</label>
    <input type="text" bind:value={baseUrl} />
    <label>Username</label>
    <input type="text" bind:value={username} />
    <label>Password</label>
    <input type="password" bind:value={password} />
    <button>Connect</button>
  </form>

  <form onsubmit={customAuth}>
    <h4>Custom Auth</h4>
    <label>Header Name</label>
    <input type="text" bind:value={headerName} />
    <label>Header Value</label>
    <input type="password" bind:value={headerValue} />
    <button>Connect</button>
  </form>

  {error}
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
    display: flex;
  }

  form {
    padding: 1em;
  }

  input {
    max-width: 30em;
    padding: .4em;
  }

  label {
    font-size: .8rem;
    margin-top: 1em;
  }

  form button {
    margin-top: 1em;
    padding: .4em;
  }

  main {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(24em, 1fr));
    gap: 2em;
  }
</style>
