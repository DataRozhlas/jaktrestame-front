/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-danger */
import React, { Component } from "react";
import { render } from "react-dom";
import { trestyCiselnik } from "./trestyCiselnik";
import { GrafGender } from "./grafGender";
import { GrafTrest } from "./grafTrest";
import { GrafTrestDva } from "./grafTrestDva";
import { GrafVek } from "./grafVek";
import { GrafNepodminene } from "./grafNepodminene";
import { GrafPodminka } from "./grafPodminka";

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

class TrestApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      para: "p173",
      odst: "all",
      year: "all",
      drivods: "all",
      soubeh: "T",
      pohlavi: "all",
      trest1: "all",
      paraData: {},
      odstData: {},
      data: {},
      secondaryData: [[]],
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
  loadData(secondary = false) {
    const {
      para, year, odst, drivods, soubeh, pohlavi, trest1,
    } = this.state;
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
    const xhr = new XMLHttpRequest();
    const url = `https://4hxdh5k7n3.execute-api.eu-west-1.amazonaws.com/prod?h=${btoa(JSON.stringify(requestObject))}`;
    xhr.open("get", url, true);
    xhr.onload = () => {
      if (!secondary) this.setState({ data: JSON.parse(xhr.responseText) });
      else this.setState({ secondaryData: JSON.parse(xhr.responseText).trest2 });
      console.log(this.state);
    };
    xhr.send();
  }

  handleSelect(id, changeEvent) {
    if (id === "para") {
      this.setState({
        odst: "all",
        year: "all",
        drivods: "all",
        soubeh: "T",
        pohlavi: "all",
        trest1: "all",
      });
    }
    const stateChange = {};
    stateChange[id] = changeEvent.target.value;
    stateChange.trest1 = "all";
    stateChange.secondaryData = [[]];
    this.setState(stateChange, () => {
      this.loadData();
    });
  }

  handleSecondarySelect(changeEvent) {
    this.setState({ trest1: changeEvent.target.value }, () => {
      this.loadData(true);
    });
  }

  render() {
    const {
      para, data, paraData, odstData, odst, year, drivods, soubeh, pohlavi, trest1, secondaryData,
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

            <form id="pohlavi-select">
              <b>Pohlaví: </b>
              <input type="radio" name="pohlavi" value="all" onChange={e => this.handleSelect("pohlavi", e)} checked={pohlavi === "all"} />
              {" Vše "}
              <input type="radio" name="pohlavi" value="muz" onChange={e => this.handleSelect("pohlavi", e)} checked={pohlavi === "muz"} />
              {" Muži "}
              <input type="radio" name="pohlavi" value="zena" onChange={e => this.handleSelect("pohlavi", e)} checked={pohlavi === "zena"} />
              {" Ženy "}
            </form>
            <div><b>Znění zákona:</b></div>
            <ParaDetails para={para} info={paraData[para]} />
            <h2>{`Celkový počet odsouzených: ${data.len}`}</h2>

            {data.len >= 5 ? (
              <div>
                <GrafTrest data={data.trest1} />

                {data.trest1[1].some(el => el >= 5) && (
                  <form id="trest-select">
                    <b>Hlavní trest:</b>
                    <br />
                    {data.trest1[0].filter((el, index) => data.trest1[1][index] > 5).map(el => (
                      <span key={el}>
                        <input type="radio" name="trest" value={el} onChange={e => this.handleSecondarySelect(e)} checked={trest1 === String(el)} />
                        {` ${trestyCiselnik[el]} (${data.trest1[1].filter((_, index) => data.trest1[0][index] === el)[0]}) `}
                        <br />
                      </span>
                    ))}
                  </form>
                )}

                {secondaryData[0].length > 1 && (
                  <GrafTrestDva data={secondaryData} />
                )}

                <GrafNepodminene data={data.delka_nepo} />
                <GrafPodminka data={data.podminky} />
                <GrafVek data={data.vek} />
                {pohlavi === "all" && <GrafGender data={data.pohlavi} />}
              </div>
            ) : (
              <div>
                <p><i>Odsouzených je příliš málo na zobrazení podrobnějších dat.</i></p>
              </div>
            )}
          </div>
        )
    );
  }
}

// ========================================
render(<TrestApp />, document.getElementById("trestapp"));
