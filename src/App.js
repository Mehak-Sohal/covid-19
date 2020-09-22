import React , { useState, useEffect } from 'react';
import './App.css';
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import { sortData, prettyPrintStat } from './utils'
import LineGraph from './LineGraph'
import 'leaflet/dist/leaflet.css'

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('global');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 44.80764, lng: -60.4796 });
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, []);
  
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then(response => response.json())
      .then(data => {
        const countries = data.map(country => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
      })
    }

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);

    const url = countryCode === 'global' ? 'https://disease.sh/v3/covid-19/all'
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
  }

  

  //console.log(countryInfo);

  return (
    <div className="app">
      <div className='app-nav'>
      <div className='app-header'>
      <h1>COVID-19 STATISTICS</h1>
      <FormControl className='app-dropdown'>
        <Select variant='outlined' value={country} onChange={onCountryChange}>
        <MenuItem value='global'>Global</MenuItem>
          {countries.map(country => (
            <MenuItem value={country.value}>{country.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      </div>
      </div>
      
      <div className='app-body'>
      <Card className='app-left'>
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>

          <h2>Global New {casesType} </h2>
          <LineGraph casesType={casesType} />

        </CardContent>
      </Card>

      <div className='app-right'>
      <div className='app-stats'>
          <InfoBox 
          onClick={(e) => setCasesType('cases')}
          active={casesType === 'cases'}
          title='Infected' 
          cases={prettyPrintStat(countryInfo.todayCases)} 
          total={prettyPrintStat(countryInfo.cases)} />

          <InfoBox
          onClick={(e) => setCasesType('recovered')}
          active={casesType === 'recovered'}
          isGreen
          title='Recovered' 
          cases={prettyPrintStat(countryInfo.todayRecovered)} 
          total={prettyPrintStat(countryInfo.recovered)} />

          <InfoBox
          onClick={(e) => setCasesType('deaths')}
          active={casesType === 'deaths'} 
          title='Deaths' 
          cases={prettyPrintStat(countryInfo.todayDeaths)} 
          total={prettyPrintStat(countryInfo.deaths)} />
      </div>

      <Map 
      casesType={casesType}
      countries={mapCountries} 
      center={mapCenter} 
      zoom={mapZoom} />
      </div>

      </div> 
    </div>
  );
}

export default App;
