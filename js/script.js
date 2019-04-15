/* eslint-disable react/no-this-in-sfc */
/* eslint-disable react/no-danger */
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
          <div
            key={pismeno}
            dangerouslySetInnerHTML={{ __html: info.odst[odstavec].pism[pismeno].text }}
          />
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
          stacking: "percent",
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
        data: [data.pohlavi[1][0] || 0],
      }, {
        name: "Ženy",
        data: [data.pohlavi[1][1] || 0],
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
          stacking: "percent",
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
      series: data.trest1[0]
        .map((entry, index) => ({ name: entry, data: [data.trest1[1][index]] }))
        .sort((a, b) => a.data[0] < b.data[0]),
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
      plotOptions: {
        column: {
          pointPadding: 0,
          borderWidth: 0,
          groupPadding: 0,
          shadow: false,
        },
      },
      xAxis: {
        categories: data.vek[0].map(num => Math.round(num)),
      },
      yAxis: {
        min: 0,
        title: {
          text: "Odsouzených",
        },
      },
      tooltip: {
        formatter() {
          return `<span style='font-size: 10px'>${this.x}-${Math.round(this.x + data.vek[0][1] - data.vek[0][0])} let</span><br/>
          <span style="color:${this.point.color}">\u25CF</span> ${this.series.name}: <b>${this.y}</b><br/>`;
        },
      },
      series: [{
        name: "Odsouzených",
        data: data.vek[1],
        pointPlacement: "between",
      }],
    }}
  />
);

const NepoDelka = ({ data }) => (
  <HighchartsReact
    highcharts={Highcharts}
    options={{
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
        },
      },
      xAxis: {
        categories: data.delka_nepo[0].map(num => Math.round(num)),
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
          return `<span style='font-size: 10px'>${this.x}-${Math.round(this.x + data.delka_nepo[0][1] - data.delka_nepo[0][0])} měsíců</span><br/>
          <span style="color:${this.point.color}">\u25CF</span> ${this.series.name}: <b>${this.y}</b><br/>`;
        },
      },
      series: [{
        name: "Odsouzených",
        data: data.delka_nepo[1],
        pointPlacement: "between",
      }],
    }}
  />
);

const PoDelka = ({ data }) => (
  <HighchartsReact
    highcharts={Highcharts}
    options={{
      chart: {
        type: "scatter",
        zoomType: "xy",
      },
      title: {
        text: "Délka podmíněných trestů",
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        title: {
          text: "Podmínka",
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Zkušební doba",
        },
      },
      tooltip: {
        formatter() {
          return `<span style='font-size: 10px'>Podmínka: ${this.x} měsíců</span><br>
            <span style='font-size: 10px'>Zkušební doba: ${this.y} měsíců</span><br>
            <span style="color:${this.point.color}">\u25CF</span> ${this.series.name}: <b>${data.podminky[1][this.point.index]}</b><br>`;
        },
      },
      series: [{
        name: "Odsouzených",
        data: data.podminky[0].map((el, index) => {
          const max = Math.max(...data.podminky[1].slice(0, data.podminky[1].length - 1));
          return {
            x: el[0],
            y: el[1],
            color: `rgba(74,108,141,
             ${(data.podminky[1][index] + max/2) / max})`,
          };
        }),
      }],
    }}
  />
);

class TrestApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      para: "p173",
      odst: "all",
      year: "all",
      drivods: "all",
      soubeh: "all",
      paraData: {},
      odstData: {},
      data: {},
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    this.initLoad();
    this.loadData();
  }

  // loading the paragraph list
  initLoad() {
    const xhr = new XMLHttpRequest();
    const paraUrl = "https://data.irozhlas.cz/jaktrestame-front/data/paragrafy.json";
    xhr.open("get", paraUrl, true);
    xhr.onload = () => {
      this.setState({ paraData: JSON.parse(xhr.responseText) });
    };
    xhr.send();
    const xhr2 = new XMLHttpRequest();
    const odstUrl = "https://data.irozhlas.cz/jaktrestame-front/data/odstavce.json";
    xhr2.open("get", odstUrl, true);
    xhr2.onload = () => {
      this.setState({ odstData: JSON.parse(xhr2.responseText) });
    };
    xhr2.send();
  }

  // loading the paragraph data
  loadData() {
    const {
      para, year, odst, drivods, soubeh,
    } = this.state;
    // the request object:
    // {"paragraf": "'196'"}
    // rok_rozhodnuti: "2015" (16, 17)
    // odstavec_nej: odstavce.json
    // drivods_kat: '1-2'...
    // jeden_tc: T/F (souběh)
    // 'novela'
    const requestObject = {
      paragraf: `'${para.substring(1)}'`,
    };
    if (year !== "all") requestObject.rok_rozhodnuti = year;
    if (odst !== "all") requestObject.odstavec_nej = odst;
    if (drivods !== "all") requestObject.drivods_kat = `'${drivods}'`;
    if (soubeh !== "all") requestObject.jeden_tc = `'${soubeh}'`;
    console.log(requestObject, btoa(JSON.stringify(requestObject)));
    const xhr = new XMLHttpRequest();
    const url = `https://4hxdh5k7n3.execute-api.eu-west-1.amazonaws.com/prod?h=${btoa(JSON.stringify(requestObject))}`;
    xhr.open("get", url, true);
    xhr.onload = () => {
      this.setState({ data: JSON.parse(xhr.responseText) });
      console.log(this.state.data)
    };
    xhr.send();
  }

  handleSelect(id, changeEvent) {
    if (id === "para") this.setState({ odst: "all" });
    const stateChange = {};
    stateChange[id] = changeEvent.target.value;
    this.setState(stateChange, () => {
      this.loadData();
    });
  }

  render() {
    const {
      para, data, paraData, odstData, odst, year, drivods, soubeh,
    } = this.state;
    return (
      Object.keys(paraData).length === 0
        || Object.keys(data).length === 0
        || Object.keys(odstData).length === 0
        ? <div>Načítám...</div>
        : (
          <div>
            <select className="select-box" defaultValue={para} onChange={e => this.handleSelect("para", e)}>
              {Object.keys(paraData).map(entry => (
                <option key={entry} value={entry}>{`${paraData[entry].par} ${paraData[entry].nazev}`}</option>
              ))}
            </select>

            <form id="year-select">
              <b>Rok: </b>
              <input type="radio" name="year" value="all" onChange={e => this.handleSelect("year", e)} checked={year === "all"} />
              {" Všechny "}
              <input type="radio" name="year" value="2015" onChange={e => this.handleSelect("year", e)} checked={year === "2015"} />
              {" 2015 "}
              <input type="radio" name="year" value="2016" onChange={e => this.handleSelect("year", e)} checked={year === "2016"} />
              {" 2016 "}
              <input type="radio" name="year" value="2017" onChange={e => this.handleSelect("year", e)} checked={year === "2017"} />
              {" 2017 "}
            </form>

            <form id="odst-select">
              <b>Odstavec: </b>
              <input type="radio" name="odst" value="all" onChange={e => this.handleSelect("odst", e)} checked={odst === "all"} />
              {" Všechny "}
              {odstData[para.substring(1)].sort().map(entry => (
                <span key={entry}>
                  <input type="radio" name="odst" value={entry} onChange={e => this.handleSelect("odst", e)} checked={odst === entry.toString()} />
                  {` ${entry} `}
                </span>
              ))}
            </form>

            <form id="drivods-select">
              <b>Počet předchozích odsouzení: </b>
              <input type="radio" name="drivods" value="all" onChange={e => this.handleSelect("drivods", e)} checked={drivods === "all"} />
              {" Všechny "}
              {["0", "1-2", "3-5", "6-10", ">10"].map(entry => (
                <span key={entry}>
                  <input type="radio" name="drivods" value={entry} onChange={e => this.handleSelect("drivods", e)} checked={drivods === entry} />
                  {` ${entry} `}
                </span>
              ))}
            </form>

            <form id="soubeh-select">
              <b>Souběh s jiným odsouzením: </b>
              <input type="radio" name="soubeh" value="all" onChange={e => this.handleSelect("soubeh", e)} checked={soubeh === "all"} />
              {" Všechny "}
              <input type="radio" name="soubeh" value="F" onChange={e => this.handleSelect("soubeh", e)} checked={soubeh === "F"} />
              {" Ano "}
              <input type="radio" name="soubeh" value="T" onChange={e => this.handleSelect("soubeh", e)} checked={soubeh === "T"} />
              {" Ne "}
            </form>
            <ParaDetails para={para} info={paraData[para]} />
            <h2>{`Celkový počet odsouzených: ${data.len}`}</h2>
            <GenderRatio data={data} />
            <TrestTypy data={data} />
            <AgeHisto data={data} />
            <NepoDelka data={data} />
            <PoDelka data={data} />
          </div>
        )
    );
  }
}

// ========================================
render(<TrestApp />, document.getElementById("trestapp"));
