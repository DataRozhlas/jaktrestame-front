<script>
  import Highcharts from "highcharts";
  import { afterUpdate, onMount } from "svelte";

  export let data;

  function graf() {
    Highcharts.chart("graf-nepodm", {
      chart: {
        type: "column",
      },
      title: {
        text: "Délka nepodmíněných trestů",
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        column: {
          pointPadding: 0,
          borderWidth: 0,
          groupPadding: 0,
          shadow: false,
          animation: false,
        },
      },
      xAxis: {
        categories: data[0].map(num => Math.round(num)),
        title: {
          text: "měsíců",
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Odsouzených",
        },
      },
      tooltip: {
        formatter() {
          return `<span style='font-size: 10px'>${this.x}-${Math.round(this.x + data[0][1] - data[0][0])} měsíců</span><br/>
          <span style="color:${this.point.color}">\u25CF</span> ${this.series.name}: <b>${this.y}</b><br/>`;
        },
      },
      series: [{
        name: "Odsouzených",
        data: data[1],
        pointPlacement: "between",
      }],
    });
  }

  afterUpdate(() => {
    graf();
  });

  onMount(() => {
    graf();
  });
</script>
<div id="graf-nepodm"></div>
