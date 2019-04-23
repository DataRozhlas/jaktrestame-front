<script>
  export let para;
  export let info;
</script>

<style>
  #para-details {
    font-size: smaller;
  }
</style>

<div id="para-details">
  {#each Object.keys(info.odst) as odstavec}
    <div>
      {@html info.odst[odstavec].text}
      {#each Object.keys(info.odst[odstavec].pism) as pismeno}
        <div>
          {@html info.odst[odstavec].pism[pismeno].text}
        </div>
      {/each}
    </div>
  {/each}
</div>
