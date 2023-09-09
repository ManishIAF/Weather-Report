import {useState,useEffect} from 'react'
import tzlookup from 'tz-lookup'
import moment from 'moment-timezone'
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import AirIcon from '@mui/icons-material/Air';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import OpacityIcon from '@mui/icons-material/Opacity';
import SpeedIcon from '@mui/icons-material/Speed';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import './App.css';

function App() {

  const [weatherReport,setWeatherReport] = useState()
  const [time, setTime] = useState(new Date());
  const [cityName, setCityName] = useState('');
  const [error,setError] = useState('')

  const getWeatherReport = async(event)=>{
    
    event.preventDefault() 

    axios.get('http://localhost:8000/api/weatherReport',{
      params: {city:cityName},
    }).then((response)=>{
      setWeatherReport(response?.data)
    }).catch((error)=>{
      setError(error?.response?.data)
    })
  }

  const timeZone = weatherReport&&weatherReport?.timezone;

  useEffect(() => {
    if(weatherReport){

      const hours = Math.floor(timeZone / 3600);
      const minutes = Math.floor((timeZone % 3600) / 60);

      const sign = timeZone >= 0 ? '+' : '-';

      const timezoneString = `${sign}${Math.abs(hours).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

      const intervalId = setInterval(() => {
        const timezone = tzlookup(weatherReport?.coord?.lat||0,weatherReport?.coord?.lon||0);
        setTime({Time:moment()?.tz(timezone)?.format('HH:mm:ss'),date:moment()?.tz(timezone)?.format('DD-MM-YYYY'),timezoneString});
      }, 1000);

      return () => clearInterval(intervalId);

    }

  }, [timeZone,weatherReport]);

  const sunRise = new Date(weatherReport?.sys?.sunrise);
  const sunSet = new Date(weatherReport?.sys?.sunset);

  return (
    <div>
      <div className="App-header">
        <div onSubmit={getWeatherReport}>
          <div>
            <input style={{border:'none',borderRadius:'2px',width:'200px',height:'30px'}} name="city" placeholder='city name' value={cityName} onChange={e => {setError('');setCityName(e.target.value)}}/>
            <button style={{marginLeft:'10px',height:'32px',color:'white',backgroundColor:'blue'}} onClick={getWeatherReport}>weather report</button>
          </div>
          <div>{error&&<p style={{color:'red'}}>{error}</p>}</div>
        </div><br/>
        {weatherReport?.name&&<div>
            <side style={{display:'flex',gap:'100px'}}>
              <div style={{display:'flex',gap:'20px'}}>
                <div style={{display:'flex'}}>
                  <span style={{display:'flex'}}>
                    <WbSunnyIcon />
                    <strong>
                      {sunRise?.getHours()+':'+sunRise?.getMinutes() } 
                    </strong>|
                  </span>
                  
                  <span style={{display:'flex'}}>
                    <WbTwilightIcon/>
                    <strong>
                      {sunSet?.getHours()+':'+sunSet?.getMinutes() }
                    </strong>
                  </span>
                </div>
                <div style={{display:'flex'}}>
                  <SpeedIcon/>
                  <span>
                    <strong>{weatherReport?.main?.pressure+'mbar'}</strong>
                  </span>
                </div>
              </div>
              <div>
                <span>
                  <strong>
                    Time : {time?.Time}
                  </strong>
                </span>
              </div>
            </side>
            <main style={{marginTop:'50px'}}>
              <div style={{display:'flex',gap:'100px'}}>
                <div>
                  <span><LocationOnIcon/></span>
                  <span style={{fontSize:'20px'}}>
                    <strong>{weatherReport?.name}</strong>
                  </span>  
                  <span style={{display:'flex',gap:'5px'}}>
                    <TravelExploreIcon style={{fontSize:'20px'}}/>
                    <strong>
                      {`${(weatherReport?.coord?.lon>0)?`${weatherReport?.coord?.lon}E`:`${weatherReport?.coord?.lon*(-1)}W`}`
                      + ' | '+
                      `${(weatherReport?.coord?.lat>0)?`${weatherReport?.coord?.lat}N`:`${weatherReport?.coord?.lat*(-1)}S`}`}</strong>
                  </span>
                </div>
                <div>
                  <div>
                    {weatherReport&&
                      <span>
                        <strong>
                          Date : {time?.date}
                        </strong>
                      </span>}
                  </div>
                  <span>
                    <strong>TZ : {time?.timezoneString}</strong>
                  </span>
                </div>
              </div>
              <div style={{display:'flex',gap:'100px'}}>
                <div style={{marginTop:'30px'}}>
                  <div style={{display:'flex'}}>
                    <span style={{fontSize:'30px'}}><DeviceThermostatIcon/></span>
                    <span style={{fontSize:'25px'}}><strong>{weatherReport?.main?.temp}° C</strong></span>
                  </div>
                  <strong style={{fontSize:'15px'}}>Feels Like {weatherReport?.main?.feels_like}° C</strong><br/>
                  <strong style={{fontSize:'12px'}}>
                    {'min '+weatherReport?.main?.temp_min+'° C'} | {'max '+  weatherReport?.main?.temp_max+'° C'}
                  </strong><br/>
                </div>
                <div>
                  <div>
                    <span style={{marginLeft:'50px'}}>
                      <img src={`http://openweathermap.org/img/wn/${weatherReport?.weather[0]?.icon}.png`} alt='' width="65px" />
                    </span><br/>
                    <span>
                      {weatherReport?.weather[0]?.main} | {weatherReport?.weather[0]?.description}
                    </span>
                  </div>
                  <div>
                    <div style={{display:'flex',gap:'10px'}}>
                      <AirIcon/>
                      <span>{weatherReport?.wind?.speed+'mph'}</span>|
                      <OpacityIcon/>
                      <span>{weatherReport?.main?.humidity+'%'}</span>
                    </div>
                  </div>

                </div>
            </div>
          </main>
        </div>}
        {weatherReport?.cod&&<div>{weatherReport?.message}</div>}
      </div>
    </div>
  );
}

export default App;
