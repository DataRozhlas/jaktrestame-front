﻿/* eslint-disable react/no-danger */
import React, { Component } from "react";
import { render } from "react-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const ParaDetails = ({ info }) => (
  <div id="para-details">
    {Object.keys(info.odst).map(odstavec => (
      <div key={odstavec}>
        <div dangerouslySetInnerHTML={{ __html: info.odst[odstavec].text }} />
        {Object.keys(info.odst[odstavec].pism).map(pismeno => (
          <div key={pismeno} dangerouslySetInnerHTML={{ __html: info.odst[odstavec].pism[pismeno].text }} />
        ))}
      </div>
    ))}
  </div>
);

const GenderRatio = ({ data }) => (
  <HighchartsReact
    highcharts={Highcharts}
    options={{
      chart: {
        type: "bar",
      },
      plotOptions: {
        series: {
          stacking: "normal",
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
          text: "Odsouzených",
        },
      },
      legend: {
        reversed: true,
      },
      title: {
        text: "Pohlaví",
      },
      tooltip: {
        shared: true,
      },
      series: [{
        name: "Muži",
        data: [data.pohlavi["muž"]],
      }, {
        name: "Ženy",
        data: [data.pohlavi["žena"]],
      }],
    }}
  />
);

const TrestTypy = ({ data }) => (
  <HighchartsReact
    highcharts={Highcharts}
    options={{
      chart: {
        type: "bar",
      },
      plotOptions: {
        series: {
          stacking: "normal",
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
          text: "Odsouzených",
        },
      },
      title: {
        text: "Typy trestů",
      },
      tooltip: {
        shared: true,
      },
      series: [{
        name: "Nepodmíněný",
        data: [data.trest1["nepodmíněný (s dozorem)"] + data.trest1["nepodmíněný (s ostrahou)"]],
      }, {
        name: "Podmíněný",
        data: [data.trest1["podmíněné odsouzení"] + data.trest1["podm\u00edn\u011bn\u00e9 odsouzen\u00ed s\u00a0dohledem"]],
      }, {
        name: "Obecně prospěšné práce",
        data: [data.trest1["obecně prospěšné práce"] + data.trest1["trestní opatření – obecně prospěšné práce"]],
      }, {
        name: "Upuštěno",
        data: [data.trest1["upuštění od uložení souhrnného trestu"] + data.trest1["upuštění od potrestání"]],
      }],
    }}
  />
);

const AgeHisto = ({ data }) => (
  <HighchartsReact
    highcharts={Highcharts}
    options={{
      chart: {
        type: "column",
      },
      title: {
        text: "Věk",
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: data.vek[1],
      },
      yAxis: {
        min: 0,
        title: {
          text: "Odsouzených",
        },
      },
      series: [{
        name: "Věk",
        data: data.vek[0],
      }],
    }}
  />
);

class TrestApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      para: "p378",
      paraData: {},
      data: {},
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.initLoad();
    this.loadData();
  }

  // loading the paragraph list
  initLoad() {
    const xhr = new XMLHttpRequest();
    const url = "https://data.irozhlas.cz/jaktrestame-front/data/paragrafy.json";
    xhr.open("get", url, true);
    xhr.onload = () => {
      this.setState({ paraData: JSON.parse(xhr.responseText) });
    };
    xhr.send();
  }

  // loading the paragraph data
  loadData() {
    const xhr = new XMLHttpRequest();
    // demo data for now
    const url = "https://4hxdh5k7n3.execute-api.eu-west-1.amazonaws.com/prod?h=eyJyb2tfcm96aG9kbnV0aSI6ICInMjAxNSciLCAicGFyYWdyYWYiOiAiJzE5NiciLCAiamVkZW5fdGMiOiAiVHJ1ZSJ9";
    xhr.open("get", url, true);
    xhr.onload = () => {
      this.setState({ data: JSON.parse(xhr.responseText) });
    };
    xhr.send();
  }

  handleChange() {
    this.setState({ para: event.target.value });
    this.loadData();
  }

  render() {
    const { para, data, paraData } = this.state;
    return (
      Object.keys(paraData).length === 0 || Object.keys(data).length === 0 ? <div>Načítám...</div> : (
        <div>
          <select className="select-box" defaultValue={para} onChange={this.handleChange}>
            {Object.keys(paraData).map(entry => (
              <option key={entry} value={entry}>{`${paraData[entry].par} ${paraData[entry].nazev}`}</option>
            ))}
          </select>
          <ParaDetails para={para} info={paraData[para]} />
          <h2>{`Celkový počet odsouzených: ${data.len}`}</h2>
          <GenderRatio data={data} />
          <TrestTypy data={data} />
          <AgeHisto data={data} />
          <div id="histo" />
        </div>
      )
    );
  }
}

// ========================================
render(<TrestApp />, document.getElementById("trestapp"));
