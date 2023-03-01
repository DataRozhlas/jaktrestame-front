/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-danger */
// IE polyfilly
import "core-js/features/array/includes";
import "core-js/features/object/entries";
import "core-js/features/number/is-integer";
import "core-js/features/array/find-index";
/** @jsx h */
import { h, Component, render } from "preact";
import { useState, Fragment } from "preact/compat";
import Select from "react-select";
import { trestyCiselnik, trestyBarvy } from "./trestyCiselnik";
import { GrafGender } from "./grafGender";
import { GrafTrest } from "./grafTrest";
import { GrafTrestDva } from "./grafTrestDva";
import { GrafBar } from "./grafBar";
import { GrafPodminka } from "./grafPodminka";
import { odstavce } from "./odstavce";
import { paragrafy } from "./paragrafy";

// když [0.7, 12], přidá se k [1, 12]
const transformPodminkyData = (data) => {
  const indexOfArr = (needle, arr) => arr
    .findIndex((el) => needle[0] === el[0] && needle[1] === el[1]);

  data[0].forEach((el, idx) => {
    if (!Number.isInteger(el[0])) {
      data[1][indexOfArr([Math.round(el[0]), el[1]], data[0])] += data[1][idx];
    }
  });

  return data[0]
    .map((el, index) => [el[0], el[1], data[1][index]])
    .filter((el) => Number.isInteger(el[0]));
};

// /////////////// KOMPONENTY
const ParaDetails = ({ info }) => {
  const [rolled, setRolled] = useState(window.innerWidth < 600);
  return (
    <Fragment>
      <button type="button" onClick={() => setRolled(!rolled)} className="roll-btn">Znění zákona</button>
      {!rolled && (
        <div className="para-details">
          <div dangerouslySetInnerHTML={{ __html: info.zn }} />
          <div className="para-src">
            {"Zdroj: "}
            <a href="https://zakonyprolidi.cz">zakonyprolidi.cz</a>
          </div>
        </div>
      )}
    </Fragment>
  );
};

const SubSelect = ({ name, label, values, state, handler, choices }) => (
  <form>
    <b>{`${label}: `}</b>
    {values.map((el, idx) => (
      <label htmlFor={`${name}-${el}`}>
        <input
          type="checkbox"
          name={name}
          value={el}
          id={`${name}-${el}`}
          checked={state.includes(el)}
          onChange={handler}
        />
        {` ${choices ? choices[idx] : el} `}
      </label>
    ))}
  </form>
);

class TrestApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      para: paragrafy[0],
      odst: ["1", "2", "3", "4", "5"],
      year: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
      drivods: ["0", "1-2", "3-5", "6-10", ">10"],
      soubeh: ["T"],
      pohlavi: ["muz", "zena"],
      trest1: "all",
      data: {},
      secondaryData: {},
    };
  }

  componentDidMount() {
    this.loadData();
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
      paragraf: `${para.value}`,
    };
    requestObject.rok_rozhodnuti = year;
    requestObject.odstavec_nej = odst;
    requestObject.drivods_kat = drivods;
    requestObject.jeden_tc = soubeh;
    requestObject.pohlavi = pohlavi;
    if (trest1 !== "all") requestObject.trest1 = `${trest1}`;
    //console.log(requestObject, btoa(JSON.stringify(requestObject)));
    const xhr = new XMLHttpRequest();
    const url = `https://d2az28rw8ehvqk.cloudfront.net/?h=${btoa(JSON.stringify(requestObject))}`;
    xhr.open("get", url, true);
    xhr.onload = () => {
      if (!secondary) this.setState({ data: JSON.parse(xhr.responseText) });
      else this.setState({ secondaryData: JSON.parse(xhr.responseText) });
    };
    xhr.send();
  }

  handleSelectBox(changeEvent) {
    this.setState({
      para: changeEvent,
      odst: odstavce[changeEvent.value].sort().map(String),
      year: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
      drivods: ["0", "1-2", "3-5", "6-10", ">10"],
      soubeh: ["T"],
      pohlavi: ["muz", "zena"],
      trest1: "all",
      secondaryData: {},
    }, () => this.loadData());
  }

  handleCheckboxSelect(id, changeEvent) {
    // eslint-disable-next-line prefer-destructuring
    const state = this.state;

    if (id === "para") {
      this.setState({
        odst: "all",
        para: ["1", "2", "3", "4", "5"],
        year: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
        drivods: ["0", "1-2", "3-5", "6-10", ">10"],
        soubeh: ["T"],
        pohlavi: ["muz", "zena"],
        trest1: "all",
      });
    }

    const stateChange = {};
    stateChange[id] = state[id].includes(changeEvent.target.value)
      ? state[id].filter((el) => el !== changeEvent.target.value)
      : [...state[id], changeEvent.target.value];
    if (stateChange[id].length !== 0) {
      stateChange.trest1 = "all";
      stateChange.secondaryData = {};
      this.setState(stateChange, () => this.loadData());
    }
  }

  handleSecondarySelect(changeEvent) {
    this.setState({ trest1: changeEvent.target.value }, () => {
      this.loadData(true);
    });
  }

  render() {
    const {
      para, data, odst, year, drivods, soubeh, pohlavi, trest1, secondaryData,
    } = this.state;
    const options = paragrafy.map((entry) => ({
      value: entry.par,
      label: `§ ${entry.par} ${entry.name}`,
    }));
    return (
      Object.keys(data).length === 0
        ? <div>Načítám...</div>
        : (
          <div>
            <Select
              value={para}
              options={paragrafy}
              onChange={(e) => this.handleSelectBox(e)}
            />

            <SubSelect
              name="year"
              label="Rok"
              values={["2016", "2017", "2018", "2019", "2020", "2021", "2022"]}
              state={year}
              handler={(e) => this.handleCheckboxSelect("year", e)}
            />

            {odstavce[para.value][0] !== 0 && (
              <SubSelect
                name="odst"
                label="Odstavec"
                values={odstavce[para.value].map(String).sort()}
                state={odst}
                handler={(e) => this.handleCheckboxSelect("odst", e)}
              />
            )}

            <SubSelect
              name="drivods"
              label="Počet předchozích odsouzení"
              values={["0", "1-2", "3-5", "6-10", ">10"]}
              state={drivods}
              handler={(e) => this.handleCheckboxSelect("drivods", e)}
            />

            <SubSelect
              name="soubeh"
              label="Souběh s jiným odsouzením"
              values={["F", "T"]}
              state={soubeh}
              handler={(e) => this.handleCheckboxSelect("soubeh", e)}
              choices={["Ano", "Ne"]}
            />

            <SubSelect
              name="pohlavi"
              label="Pohlaví"
              values={["muz", "zena"]}
              state={pohlavi}
              handler={(e) => this.handleCheckboxSelect("pohlavi", e)}
              choices={["Muži", "Ženy"]}
            />

            <ParaDetails para={para.value} info={paragrafy.filter((el) => el.value === para.value)[0]} />
            <h2>{`Celkový počet odsouzených: ${data.len}`}</h2>

            {data.len >= 10 ? (
              <div>
                <GrafTrest data={data.trest1} />

                {data.trest1[1].some((el) => el >= 10) && (
                  <form id="trest-select">
                    <b>Pro vedlejší tresty vyberte hlavní trest:</b>
                    <br />
                    {data.trest1[0]
                      .map((entry, index) => ({ name: trestyCiselnik[entry], value: entry, data: [data.trest1[1][index]] }))
                      .sort((a, b) => (b.value === 14 && a.value !== 1 ? a.value + b.value : a.value - b.value)) // předřazení podmínky s dohledem
                      .filter((el) => el.data > 5)
                      .map((el) => (
                        <label htmlFor={`trest-${el.value}`}>
                          <input
                            type="radio"
                            name="trest"
                            id={`trest-${el.value}`}
                            value={el.value}
                            onChange={(e) => this.handleSecondarySelect(e)}
                            checked={trest1 === String(el.value)}
                          />
                          {` ${el.name} (${el.data}) `}
                          <br />
                        </label>
                      ))}
                  </form>
                )}

                {Object.keys(secondaryData).length > 1 && (<GrafTrestDva data={secondaryData} />)}

                {data.delka_nepo[1].length > 0 && (
                  <GrafBar data={data.delka_nepo} title="Délka nepodmíněných trestů" unit="měsíců" color={trestyBarvy[1]} />
                )}
                {data.podminky[1].length > 0 && (
                  <GrafPodminka data={transformPodminkyData(data.podminky)} />
                )}
                {data.delka_ops[1].length > 0 && (
                  <GrafBar data={data.delka_ops} title="Délka obecně prospěšných prací" unit="hodin" color={trestyBarvy[4]} />
                )}

                <GrafBar data={data.vek} title="Věk" unit="let" color="#7cb5ec" />
                {pohlavi.length === 2 && <GrafGender data={data.pohlavi} />}
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
