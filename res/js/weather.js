// get weather data from pastebin
document.addEventListener("DOMContentLoaded", function() {
  const hasWeather = document.getElementById('conditions');
  if (hasWeather) {
    const wx_endpoint = 'https://paste.jwq.lol/tempest.json/raw';
    // get ready to calculate relative time
    const units = {
      year  : 24 * 60 * 60 * 1000 * 365,
      month : 24 * 60 * 60 * 1000 * 365/12,
      day   : 24 * 60 * 60 * 1000,
      hour  : 60 * 60 * 1000,
      minute: 60 * 1000,
      second: 1000
    }
    let rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
    let getRelativeTime = (d1, d2 = new Date()) => {
      let elapsed = d1 - d2
      for (var u in units)
        if (Math.abs(elapsed) > units[u] || u === 'second')
          return rtf.format(Math.round(elapsed/units[u]), u)
    }

    // set up temperature and rain ranges
    const tempRanges = [
      { upper: 32, label: 'cold' },
      { upper: 60, label: 'cool' },
      { upper: 80, label: 'warm' },
      { upper: Infinity, label: 'hot' }
    ];
    const rainRanges = [
      { upper: 0.02, label: 'none' },
      { upper: 0.2, label: 'light' },
      { upper: 1.4, label: 'moderate' },
      { upper: Infinity, label: 'heavy' }
    ]

    // maps for selecting icons
    const CLASS_MAP_PRESS = {
      'steady': 'fa-solid fa-arrow-right-long',
      'rising': 'fa-solid fa-arrow-trend-up',
      'falling': 'fa-solid fa-arrow-trend-down'
    }
    const CLASS_MAP_RAIN = {
      'none': 'fa-solid fa-droplet-slash',
      'light': 'fa-solid fa-glass-water-droplet',
      'moderate': 'fa-solid fa-glass-water',
      'heavy': 'fa-solid fa-bucket'
    }
    const CLASS_MAP_TEMP = {
      'hot': 'fa-solid fa-thermometer-full',
      'warm': 'fa-solid fa-thermometer-half',
      'cool': 'fa-solid fa-thermometer-quarter',
      'cold': 'fa-solid fa-thermometer-empty'
    }
    const CLASS_MAP_WX = {
      'clear-day': 'fa-solid fa-sun',
      'clear-night': 'fa-solid fa-moon',
      'cloudy': 'fa-solid fa-cloud',
      'foggy': 'fa-solid fa-cloud-showers-smog',
      'partly-cloudy-day': 'fa-solid fa-cloud-sun',
      'partly-cloudy-night': 'fa-solid fa-cloud-moon',
      'possibly-rainy-day': 'fa-solid fa-cloud-sun-rain',
      'possibly-rainy-night': 'fa-solid fa-cloud-moon-rain',
      'possibly-sleet-day': 'fa-solid fa-cloud-meatball',
      'possibly-sleet-night': 'fa-solid fa-cloud-moon-rain',
      'possibly-snow-day': 'fa-solid fa-snowflake',
      'possibly-snow-night': 'fa-solid fa-snowflake',
      'possibly-thunderstorm-day': 'fa-solid fa-cloud-bolt',
      'possibly-thunderstorm-night': 'fa-solid fa-cloud-bolt',
      'rainy': 'fa-solid fa-cloud-showers-heavy',
      'sleet': 'fa-solid fa-cloud-rain',
      'snow': 'fa-solid fa-snowflake',
      'thunderstorm': 'fa-solid fa-cloud-bolt',
      'windy': 'fa-solid fa-wind',
    }

    // fetch data from pastebin
    fetch(wx_endpoint)
      .then(res => res.json())
      .then(function(res){
        // calculate age of last update
        let updateTime = res.time;
        updateTime = parseInt(updateTime);
        updateTime = updateTime*1000;
        updateTime = new Date(updateTime);
        let updateAge = getRelativeTime(updateTime);

        // parse data
        let conditions = (res.conditions).toLowerCase();
        let tempDiff = Math.abs(res.temperature - res.feels_like);
        let temp = `${res.temperature}°f (${(((res.temperature - 32) * 5) / 9).toFixed(1)}°c)`;
        if (tempDiff >= 5) {
          temp += `, feels ${res.feels_like}°f (${(((res.feels_like - 32) *5) / 9).toFixed(1)}°c)`;
        }
        let tempLabel = (tempRanges.find(range => res.feels_like < range.upper)).label;
        let humidity = `${res.humidity}% humidity`;
        let wind = `${res.wind_gust}mph (${(res.wind_gust*1.609344).toFixed(1)}kph) from ${(res.wind_direction).toLowerCase()}`;
        let rainLabel = (rainRanges.find(range => res.rain_today < range.upper)).label;
        let rainToday;
        if (res.rain_today === 0) {
          rainToday = 'no rain today';
        } else {
          rainToday = `${res.rain_today}" rain today`;
        }
        let pressureTrend = res.pressure_trend;
        let pressure = `${res.pressure}inhg and ${pressureTrend}`;
        let icon = res.icon;

        // display data
        document.getElementById('time').innerHTML = updateAge;
        document.getElementById('conditions').innerHTML = conditions;
        document.getElementById('temp').innerHTML = temp;
        document.getElementById('humidity').innerHTML = humidity;
        document.getElementById('wind').innerHTML = wind;
        document.getElementById('rainToday').innerHTML = rainToday;
        document.getElementById('pressure').innerHTML = pressure;
        // update icons
        document.getElementsByClassName('fa-cloud-sun-rain')[0].classList = CLASS_MAP_WX[icon];
        document.getElementsByClassName('fa-temperature-half')[0].classList = CLASS_MAP_TEMP[tempLabel];
        document.getElementsByClassName('fa-droplet-slash')[0].classList = CLASS_MAP_RAIN[rainLabel];
        document.getElementsByClassName('fa-arrow-right-long')[0].classList = CLASS_MAP_PRESS[pressureTrend];
      });
  }
});
