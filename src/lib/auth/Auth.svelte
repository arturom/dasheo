<script lang="ts">
    import type { StreamsClient } from "../streams/client";
    import Form from "./Form.svelte";

    interface Props {
        onConnect: (client: StreamsClient) => void;
    }

    const { onConnect }: Props = $props();

    let isConnected: boolean | null = $state(false);

    function connected(client: StreamsClient) {
        onConnect(client);
        isConnected = true;
    }

</script>

{#if !isConnected}
    <Form onConnect={connected}/>
{/if}
