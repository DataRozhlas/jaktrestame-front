<script>
  import Highcharts from "highcharts";
  import { afterUpdate, onMount } from "svelte";

  export let data;
  export let ciselnik;

  function graf() {
    const processedData = data[0]
      .map((entry, index) => ({ name: ciselnik[entry], data: [data[1][index]] }))
      .sort((a, b) => b.data[0] - a.data[0]);
    const percentageData = processedData.map(el => el.data[0] * 100 / processedData
      .map(n => n.data[0])
      .reduce((acc, val) => val + acc, 0));

    Highcharts.chart("graf-trestdva-typy", {
      chart: {
        type: "column",
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        series: {
          animation: false,
        },
      },
      xAxis: {
        categories: [""],
      },
      yAxis: {
        min: 0,
        title: {
          text: "Odsouzených",
        },
      },
      title: {
        text: "Vedlejší tresty",
      },
      tooltip: {
        pointFormatter() {
          return `<span style='color:${this.color}'>${this.series.name}</span>:
              <b>${String(Math.round(100 * percentageData[this.colorIndex]) / 100).replace(".", ",")} %</b> (${this.y})<br/>`;
        },
        shared: true,
      },
      series: processedData,
    });
  }

  afterUpdate(() => {
    graf();
  });

  onMount(() => {
    graf();
  });
</script>
<div id="graf-trestdva-typy"></div>
