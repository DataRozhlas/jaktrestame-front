<script>
  import { onMount } from "svelte";
  import ParaDetails from "./ParaDetails.svelte";
  import GrafTrestTypy from "./GrafTrestTypy.svelte";
  import GrafTrestDvaTypy from "./GrafTrestDvaTypy.svelte";
  import GrafAge from "./GrafAge.svelte";
  import GrafGender from "./GrafGender.svelte";
  import GrafNepodm from "./GrafNepodm.svelte";
  import GrafPodm from "./GrafPodm.svelte";

  const trestyCiselnik = {
    null: "vedlejší trest neudělen",
    1: "nepodmíněný trest odnětí svobody",
    2: "podmíněný trest odnětí svobody",
    3: "domácí vězení",
    4: "obecně prospěšné práce",
    5: "peněžitý trest",
    6: "vyhoštění",
    7: "zákaz pobytu",
    8: "zákaz činnosti",
    9: "zákaz řízení motorových vozidel",
    10: "upuštění od potrestání",
    11: "propadnutí věci",
    12: "ostatní tresty",
  };

  const drivodsKategorie = ["0", "1-2", "3-5", "6-10", ">10"];

  // constant data: para text & subpara list
  const data = {
    para: {},
    odst: {},
  };

  // stateful data
  let state = {
    para: "p173",
    odst: "all",
    year: "all",
    drivods: "all",
    soubeh: "T",
    pohlavi: "all",
    trest1: "all",
    data: {},
    secondaryData: [[]],
  };

  async function loadData(secondary = false) {
    const {
      para, year, odst, drivods, soubeh, pohlavi, trest1,
    } = state;
    // the request object:
    // {"paragraf": "'196'"}
    // rok_rozhodnuti: "2015" (16, 17)
    // odstavec_nej: odstavce.json
    // drivods_kat: '1-2'...
    // jeden_tc: T/F (souběh)
    // 'novela'
    // pohlavi
    const requestObject = {
      paragraf: `${para.substring(1)}`,
    };
    if (year !== "all") requestObject.rok_rozhodnuti = year;
    if (odst !== "all") requestObject.odstavec_nej = odst;
    if (drivods !== "all") requestObject.drivods_kat = `${drivods}`;
    if (soubeh !== "all") requestObject.jeden_tc = `${soubeh}`;
    if (pohlavi !== "all") requestObject.pohlavi = `${pohlavi}`;
    if (trest1 !== "all") requestObject.trest1 = `${trest1}`;
    console.log(requestObject, btoa(JSON.stringify(requestObject)));

    const currentData = await fetch(`https://4hxdh5k7n3.execute-api.eu-west-1.amazonaws.com/prod?h=${btoa(JSON.stringify(requestObject))}`);
    if (!secondary) state.data = await currentData.json();
    else {
      const secondaryData = await currentData.json();
      state.secondaryData = secondaryData.trest2;
    }
    console.log(state);
  }

  onMount(async () => {
    const paraData = await fetch("https://data.irozhlas.cz/jaktrestame-front/data/paragrafy.json");
    data.para = await paraData.json();

    const odstData = await fetch("https://data.irozhlas.cz/jaktrestame-front/data/odstavce.json");
    data.odst = await odstData.json();

    await loadData();
  });

  function handleSelect(id, changeEvent) {
    if (id === "para") {
      state = {
        ...state,
        odst: "all",
        year: "all",
        drivods: "all",
        soubeh: "T",
        pohlavi: "all",
        trest1: "all",
      };
    }
    state[id] = changeEvent.target.value;
    state.trest1 = "all";
    state.secondaryData = [[]];
    loadData();
  }
  
  function handleSecondarySelect(changeEvent) {
    state.trest1 = changeEvent.target.value;
    loadData(true);
  }
</script>

<style>
  .select-box {
    max-width: 100%;
  }
</style>

{#if Object.keys(data.para).length === 0
  || Object.keys(data.odst).length === 0
  || Object.keys(state.data).length === 0}
  Načítám...
{:else}
  <select class="select-box" bind:value={state.para} on:change="{(e) => handleSelect('para', e)}">
  {#each Object.keys(data.para) as entry}
    <option key={entry} value={entry}>{data.para[entry].par} {data.para[entry].nazev}</option>
  {/each}
  </select>

  <form id="year-select">
      <b>Rok: </b>
      <input type="radio" name="year" value="all" on:change="{(e) => handleSelect('year', e)}" bind:group={state.year} />
      {" Všechny "}
      <input type="radio" name="year" value="2016" on:change="{(e) => handleSelect('year', e)}" bind:group={state.year} />
      {" 2016 "}
      <input type="radio" name="year" value="2017" on:change="{(e) => handleSelect('year', e)}" bind:group={state.year} />
      {" 2017 "}
      <input type="radio" name="year" value="2018" on:change="{(e) => handleSelect('year', e)}" bind:group={state.year} />
      {" 2018 "}
  </form>

  <form id="odst-select">
      <b>Odstavec: </b>
      <input type="radio" name="odst" value="all" on:change="{(e) => handleSelect('odst', e)}" bind:group={state.odst} />
      Všechny
      {#each data.odst[state.para.substring(1)].sort() as entry}
          <input type="radio" name="odst" value={String(entry)} on:change="{(e) => handleSelect('odst', e)}" bind:group={state.odst} />
          {entry}&nbsp;
      {/each}
  </form>

  <form id="drivods-select">
    <b>Počet předchozích odsouzení: </b>
    <input type="radio" name="drivods" value="all" on:change="{(e) => handleSelect('drivods', e)}" bind:group={state.drivods} />
      Všechny
      {#each drivodsKategorie as entry}
          <input type="radio" name="drivods" value={entry} on:change="{(e) => handleSelect('drivods', e)}" bind:group={state.drivods} />
          {entry}&nbsp;
      {/each}
  </form>

  <form id="soubeh-select">
      <b>Souběh s jiným odsouzením: </b>
      <input type="radio" name="soubeh" value="all" on:change="{(e) => handleSelect('soubeh', e)}" bind:group={state.soubeh} />
      {" Všechny "}
      <input type="radio" name="soubeh" value="F" on:change="{(e) => handleSelect('soubeh', e)}" bind:group={state.soubeh} />
      {" Ano "}
      <input type="radio" name="soubeh" value="T" on:change="{(e) => handleSelect('soubeh', e)}" bind:group={state.soubeh} />
      {" Ne "}
  </form>

  <form id="pohlavi-select">
      <b>Pohlaví: </b>
      <input type="radio" name="pohlavi" value="all" on:change="{(e) => handleSelect('pohlavi', e)}" bind:group={state.pohlavi} />
      {" Vše "}
      <input type="radio" name="pohlavi" value="muz" on:change="{(e) => handleSelect('pohlavi', e)}" bind:group={state.pohlavi} />
      {" Muži "}
      <input type="radio" name="pohlavi" value="zena" on:change="{(e) => handleSelect('pohlavi', e)}" bind:group={state.pohlavi} />
      {" Ženy "}
  </form>

  <div><b>Znění zákona:</b></div>
  <ParaDetails para={state.para} info={data.para[state.para]} />
  <h2>Celkový počet odsouzených: {state.data.len}</h2>

  {#if state.data.len >= 5}
    <div>
        <GrafTrestTypy data={state.data.trest1} ciselnik={trestyCiselnik} />

        {#if state.data.trest1[1].some(el => el >= 10)}
          <form id="trest-select">
            <b>Hlavní trest:</b>
            <br />
            {#each state.data.trest1[0].filter((el, index) => state.data.trest1[1][index] > 10) as entry}
                <input type="radio" name="trest" value={String(entry)} on:change="{(e) => handleSecondarySelect(e)}" bind:group={state.trest1} />
                {trestyCiselnik[entry]} ({state.data.trest1[1].filter((_, index) => state.data.trest1[0][index] === entry)[0]})
                <br />
            {/each}
          </form>
        {/if}

        {#if state.secondaryData.length > 1}
          <GrafTrestDvaTypy data={state.secondaryData} ciselnik={trestyCiselnik}/>
        {/if}

        <GrafNepodm data={state.data.delka_nepo} />
        <GrafPodm data={state.data.podminky} />
        <GrafAge data={state.data.vek} /> 
        {#if state.pohlavi === "all"}
          <GrafGender data={state.data.pohlavi} />
        {/if}
    </div>
  {:else}
    <div><i>Odsouzených je příliš málo na zobrazení podrobnějších dat.</i></div>
  {/if}
{/if}
