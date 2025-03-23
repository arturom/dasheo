<script lang="ts">
    import { createWithBasicAuth, createWithHeader, type StreamsClient } from "../streams/client";

    interface Props {
        onConnect: (client: StreamsClient) => void;
    }

    const { onConnect }: Props = $props();

    let baseUrl: string = $state(guessBaseUrl());
    let method: string = $state('basic');
    let username: string = $state('Administrator');
    let password: string = $state('Administrator');
    let headerName: string = $state('');
    let headerValue: string = $state('');

    function guessBaseUrl() {
        const { origin } = window.location;
        if (origin.endsWith('github.io')) {
            return 'http://localhost:8080/nuxeo';
        }
        return `${origin}/nuxeo`;
    }

    async function authenticate(e: SubmitEvent) {
        e.preventDefault();
        e.stopPropagation();
        
        if (method === 'basic') {
            basicAuth();
        } else if (method === 'custom') {
            customAuth();
        }
    }

    async function basicAuth() {
        const client = createWithBasicAuth(baseUrl, username, password);
        onConnect(client);
    }

    async function customAuth() {
        const client = createWithHeader(baseUrl, headerName, headerValue);
        onConnect(client);
    }

</script>

<form onsubmit={authenticate}>
    <h3>Authenticate</h3>
    <div class="input">
        <label for="base-url">Base URL</label>
        <input id="base-url" type="text" bind:value={baseUrl} />
    </div>
    <div class="radio">
        <input type="radio" bind:group={method} value="basic" id="opt-auth-basic" />
        <label for="opt-auth-basic">Basic authentication</label>
        <input type="radio" bind:group={method} value="custom" id="opt-auth-custom" />
        <label for="opt-auth-custom">Custom authentication</label>
    </div>

    {#if method === 'basic'}
        <div class="input">
            <label for="username">Username</label>
            <input id="username" type="text" bind:value={username} />
        </div>
        <div class="input">
            <label for="password">Password</label>
            <input id="password" type="password" bind:value={password} />
        </div>
    {:else if method === 'custom'}
        <div class="input">
            <label for="header-name">Header Name</label>
            <input id="header-name" type="text" bind:value={headerName} />
        </div>
        <div class="input">
            <label for="header-value">Header Value</label>
            <input id="header-value" type="password" bind:value={headerValue} />
        </div>
    {/if}

    <button>Connect</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    max-width: 30em;
    margin: 0 auto;
    padding: 1em;
    gap: 1em
  }

  form .radio {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: .2em;
  }

  form .input {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  form .input label {
    font-size: .8rem;
  }

  input, button {
    padding: .4em;
  }


</style>