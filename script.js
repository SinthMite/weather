const APIKEY = "key";
const search = document.getElementById('search');
const form = document.getElementById('form');

async function geo(zipCode) {
    try {
        const urlGeo = `https://api.openweathermap.org/geo/1.0/zip?zip=${encodeURIComponent(zipCode)},US&appid=${APIKEY}`;
        const response = await fetch(urlGeo);

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            return data;
        }
    } catch (error) {
        console.error('Error Code:', error);
        throw error;
    }
}

async function fetchlocation() {
    try {
        const data = await geo(search.value);
        if (data) {
            lon = data.lon;
            lat = data.lat;
        }
    } catch (error) {
        console.log("error: ", error);
        throw error;
    }
}

async function fetchData() {
    try {
        await fetchlocation();
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}`;
        console.log(weatherUrl);
        return weatherUrl;
    } catch (error) {
        console.log("error: ", error);
        throw error;
    }
}

async function weather(event) {
    try {
        event.preventDefault();

        const weatherUrl = await fetchData();
        const response = await fetch(weatherUrl);
        if (response.ok) {
            const data = await response.json();
            const kelvinTemp = data.main.temp;
            const celsiusTemp = Math.floor((kelvinTemp - 273.15) * 9/5 + 32); // Convert Kelvin to Celsius
            const humid = data.main.humidity;
            const cityName = data.name;
            const describe = data.weather[0].main;

            const city = document.getElementById('cityName');
            city.innerHTML = `${cityName}`;

            const temp = document.getElementById('temp');
            temp.innerHTML = `${celsiusTemp}℃`;

            const summary = document.getElementById('description');
            summary.innerHTML = `${describe}`;

            const hum = document.getElementById('humid');
            hum.innerHTML = `${humid}%`;
        }
    } catch (error) {
        console.error('Error Code:', error);
        throw error;
    }
}

form.addEventListener('submit', (event) => weather(event).catch(error => console.error('Error:', error)));
