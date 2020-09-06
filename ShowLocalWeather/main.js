const container = document.querySelector('.container');
const toggler = document.querySelector('.toggle-temp');
const tmp = document.querySelector('.tmp');
const loc = document.querySelector('.location');
const weather = document.querySelector('.weather');
const icon = document.querySelector('.icon');

let state = 0;

function cToF(celsius) {
    return Math.round(celsius * 9 / 5 + 32);
}

function getWeatherCode(code) {
    switch(true) {
        case code >= 200 && code <= 232: return '11';
        case code >= 300 && code <= 321: return '09';
        case code >= 500 && code <= 531: return '10';
        case code >= 600 && code <= 622: return '13';
        case code >= 700 && code <= 781: return '50';
        case code === 800: return '01';
        case code === 801: return '02';
        case code === 802: return '03';
        case code === 803: return '04';
        case code === 804: return '04';
        default: return '01';
    }
}

function getImgSrc(code) {
    const imagecode = getWeatherCode(code);
    const time = (new Date()).getHours();
    const suffix = (time > 6 && time < 20) ? 'd' : 'n';
    return imagecode + suffix;
}

function getBgUrl(code) {
    const bgUrls = {
        '11': 'https://images.pexels.com/photos/99577/barn-lightning-bolt-storm-99577.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        '09': 'https://images.pexels.com/photos/2259232/pexels-photo-2259232.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
        '10': 'https://images.pexels.com/photos/2259232/pexels-photo-2259232.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
        '13': 'https://images.pexels.com/photos/209839/pexels-photo-209839.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        '50': 'https://images.pexels.com/photos/414659/pexels-photo-414659.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        '01': 'https://images.pexels.com/photos/96622/pexels-photo-96622.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    }

    if(code in bgUrls) {
        return bgUrls[code];
    }
    return 'https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260';
}


const apiEndpoint = 'https://fcc-weather-api.glitch.me/api/current';

navigator.geolocation.getCurrentPosition(function(pos) {
    const { latitude, longitude } = pos.coords;
    const url = `${apiEndpoint}?lat=${latitude.toFixed(2)}&lon=${longitude.toFixed(2)}`;
    
    let tries = 0;
    function attempt() {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if(data.name === 'Shuzenji' && tries < 5) {
                    tries++;
                    attempt();
                } else {
                    state = Math.round(data.main.temp);
                    tmp.textContent = state + ' °';
                    toggler.textContent = 'C';
                    loc.textContent = `${data.name}, ${data.sys.country}`;
                    weather.textContent = data.weather[0].main;
                    const weatherCode = data.weather[0].id;
                    icon.src = `http://openweathermap.org/img/wn/${getImgSrc(weatherCode)}@2x.png`;
                    document.body.style.backgroundImage = `url(${getBgUrl(getWeatherCode(weatherCode))})`;

                    toggler.addEventListener('click', function(e) {
                        e.preventDefault();
                        const txt = e.target.textContent;
                    
                        if(txt === 'F') {
                            tmp.textContent = state  + ' °';
                            e.target.textContent = 'C';
                        } else {
                            tmp.textContent = cToF(state) + ' °';
                            e.target.textContent = 'F';
                        }
                    });
                }
            });
    }

    attempt();
}, function(err) {
    container.style.justifyContent = 'center';

    container.innerHTML = `
        <div class="error-message">        
            <h2>Could not access geolocation information.</h2>
        </div>
    `;
});
