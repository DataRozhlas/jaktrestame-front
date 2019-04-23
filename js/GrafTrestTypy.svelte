<script>
  import Highcharts from "highcharts";
  import { afterUpdate, onMount } from "svelte";

  export let data;
  export let ciselnik;

  function graf() {
    Highcharts.chart("graf-trest-typy", {
      chart: {
        type: "bar",
      },
      plotOptions: {
        series: {
          stacking: "percent",
          animation: false,
        },
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: [""],
      },
      yAxis: {
        min: 0,
        title: {
          text: "Odsouzených (%)",
        },
        reversedStacks: false,
      },
      title: {
        text: "Typy trestů",
      },
      tooltip: {
        pointFormat: "<span style='color:{series.color}'>{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f} %)<br/>",
        shared: true,
      },
      series: data[0]
        .map((entry, index) => ({ name: ciselnik[entry], data: [data[1][index]] }))
        .sort((a, b) => b.data[0] - a.data[0]),
    });
  }

  afterUpdate(() => {
    graf();
  });
  
  onMount(() => {
    graf();
  });
</script>
<div id="graf-trest-typy"></div>
