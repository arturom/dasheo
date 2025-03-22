<script lang="ts">
    import ConsumerSection from "./ConsumerSection.svelte";
    import type { Consumer, Stream, StreamsClient } from "./client";

    interface Props {
        stream: Stream;
        client: StreamsClient;
    }

    const { stream, client }: Props = $props();

    let consumers: Consumer[] = $state([]);

    async function loadConsumers() {
      consumers = await client.getStreamConsumers(stream.name);
    }

    $effect(() => {
        loadConsumers();
    });
</script>

{#each consumers as consumer}
  <ConsumerSection {consumer} {client} />
{/each}