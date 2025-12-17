const API_KEY = "133108b17a7330ec410c96654e3976e2";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const errorMsg = document.getElementById("error");
const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const desc = document.getElementById("desc");
const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");
const visibility = document.getElementById("visibility");
const weatherIcon = document.getElementById("weatherIcon");

const forecastEl = document.getElementById("forecast");
const forecastTitle = document.getElementById("forecastTitle");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city === "") return;

    getWeather(city);
});

async function getWeather(city) {
    errorMsg.textContent = "";

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!res.ok) {
            throw new Error("City not found");
        }

        const data = await res.json();

        cityName.textContent = data.name;
        temp.textContent = Math.round(data.main.temp) + "°C";
        desc.textContent = data.weather[0].description;
        wind.textContent = data.wind.speed + " km/h";
        humidity.textContent = data.main.humidity + "%";
        visibility.textContent = (data.visibility / 1000).toFixed(1) + " km";

        weatherIcon.textContent = getWeatherEmoji(data.weather[0].main);

        const todayEl = document.querySelector(".today");
        const today = new Date();
        todayEl.textContent = today.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric"
        });

        weatherCard.classList.remove("hidden");

        getForecast(city);

    } catch (err) {
        weatherCard.classList.add("hidden");
        forecastTitle.classList.add("hidden");
        forecastEl.innerHTML = "";
        errorMsg.textContent = "The city is not found!";
    }
}

async function getForecast(city) {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();

    forecastEl.innerHTML = "";
    forecastTitle.classList.remove("hidden");

    const days = {};

    data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!days[date]) days[date] = item;
    });

    Object.keys(days).slice(1, 6).forEach(date => {
        const item = days[date];

        const div = document.createElement("div");
        div.classList.add("day");

        div.innerHTML = `
            <p>${new Date(date).toLocaleDateString("en-US", { weekday: "short" })}</p>
            <span>${getWeatherEmoji(item.weather[0].main)}</span>
            <p>${Math.round(item.main.temp)}°C</p>
        `;

        forecastEl.appendChild(div);
    });
}

function getWeatherEmoji(type) {
    switch (type) {
        case "Clouds": return "☁️";
        case "Rain": return "🌧️";
        case "Clear": return "☀️";
        case "Snow": return "❄️";
        case "Thunderstorm": return "🌩️";
        default: return "🌤️";
    }
}