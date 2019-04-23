<script>
  import Highcharts from "highcharts";
  import { onMount, afterUpdate } from "svelte";

  export let data;
  export let ciselnik;

  function graf() {
    Highcharts.chart("graf-gender", {
      chart: {
        type: "bar",
      },
      plotOptions: {
        series: {
          stacking: "percent",
          animations: false,
        },
      },
      colors: ["#577bff", "#ffa357"],
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
        text: "Pohlaví",
      },
      tooltip: {
        pointFormat: "<span style='color:{series.color}'>{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f} %)<br/>",
        shared: true,
      },
      series: [{
        name: "Muži",
        data: [data[1].filter((el, index) => data[0][index] === "muz")[0] || 0],
      }, {
        name: "Ženy",
        data: [data[1].filter((el, index) => data[0][index] === "zena")[0] || 0],
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
<div id="graf-gender"></div>
