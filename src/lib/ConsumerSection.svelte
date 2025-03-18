<script lang="ts">
  import type { Consumer, ConsumerPosition, StreamsClient } from "./streams";

    interface Props {
        consumer: Consumer;
        client: StreamsClient;
    }

    const { consumer, client }: Props = $props();

    let position: ConsumerPosition | undefined = $state();

    $effect(() => {
        loadPosition();
    });

    let color = $derived(getLagColor(position?.lag));

    async function loadPosition() {
        position = await client.getConsumerPosition(consumer.stream, consumer.consumer);
    }

    function getLagColor(lag: number | undefined): number {
      if (lag === 0 || lag === undefined) {
        return 115;
      }
      if (lag < 100) {
        return 60;
      }
      return 16;
    }
</script>

{#if position}
  <div style:--indicator-color={color}>
    <div class="header">
      <div>
        <span>{consumer.consumer}</span>
        <span>({position.lag})</span>
      </div>
      <button onclick={loadPosition}>Refresh</button>
    </div>
    <div class="grid">
      <div class="th">partition</div>
      <div class="th">progress</div>
      <div class="th">lag</div>

      {#each position.lags as lag}
        <div class="col-par">{lag.partition}</div>
        <div>
          <progress max={lag.end} value={lag.pos}></progress>
          {lag.pos} / {lag.end}
        </div>
        <div>{lag.lag}</div>
      {/each}
    </div>
  </div>
{/if}

<style>
  :root {
    --indicator-color: 0;
  }

  .header {
    display: flex;
    justify-content: space-between;
    padding: .4em;
    color: #ffffff;
    background-color: hsl(var(--indicator-color), 80%, 20%);
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    background-color: #222222;
    gap: 1em;
  }

  .grid div {
    padding: .4em;
  }

  .th {
    color: #aaaaaa;
    background-color: #181818;
  }

  .col-par {
    color: #888888;
  }

  progress {
    border-radius: 0;
    margin-left: -11.5%;
  }

  progress::-webkit-progress-bar {
    background-color: #000000;
    border-radius: 0;
  }

  progress::-webkit-progress-value {
    background-color: hsl(var(--indicator-color), 50%, 40%);
    border-radius: 0;
  }

</style>