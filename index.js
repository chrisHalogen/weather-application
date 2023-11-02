const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let query = form.querySelector("#location").value;

  //   console.log(query);

  get_weather_data((loc = query));
});

const get_current_location = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // console.log(`Latitude: ${latitude}\nLongitude: ${longitude}`);

      get_weather_data((lat = latitude), (lon = longitude));
    });
  } else {
    console.log("Geolocation Disabled");
    return -1;
  }
};

const get_weather_data = async (lon = 0, lat = 0, loc = "") => {
  let url = "";
  let api_key = "f13566a403e2404fba7145915230211";

  if (!lon && !lat) {
    url = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${encodeURIComponent(
      "london"
    )}&aqi=no`;
  } else if (loc) {
    url = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${encodeURIComponent(
      loc
    )}&aqi=no`;
  } else {
    url = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${lat},${lon}&aqi=no`;
  }

  console.log(url);

  await fetch(url)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);

      // City Region
      let area = `${result["location"]["name"]}, ${result["location"]["region"]}<br>${result["location"]["country"]}`;

      //   document.querySelector("#location-bold").innerHTML = area;

      set_summary("location-bold", area);

      //   Local Time
      let local_time = `${result["location"]["localtime"]}<br>${
        result["current"]["is_day"] == 0 ? "Night" : "Day"
      }`;

      //   document.querySelector("#local-time").innerHTML = local_time;
      set_summary("local-time", local_time);

      // Changing Figure
      //   document.querySelector("#figure").innerText = result["current"]["temp_c"];

      set_summary("figure", result["current"]["temp_c"]);

      // Changing Description
      document.querySelector(".description").innerText =
        result["current"]["condition"]["text"];

      //   set_summary("description", result["current"]["condition"]["text"]);

      let url_img = result["current"]["condition"]["icon"];
      url_img = url_img.replace("//", "https://");

      document.querySelector("#weather-image").src = url_img;

      // Populating Cards
      set_data("celcius", {
        value: result["current"]["temp_c"],
      });

      set_data("farenheit", {
        value: result["current"]["temp_f"],
      });

      set_data("uv", {
        value: result["current"]["uv"],
      });

      set_data("wind", {
        value: result["current"]["wind_mph"],
      });

      set_data("pressure", {
        value: result["current"]["pressure_in"],
      });

      set_data("wind-degree", {
        value: result["current"]["wind_degree"],
        third: `Direction - ${result["current"]["wind_dir"]}`,
      });

      set_data("cloud", {
        value: result["current"]["cloud"],
      });

      set_data("humidity", {
        value: result["current"]["humidity"],
      });

      set_data("wind-gust", {
        value: result["current"]["wind_mph"],
      });
    });
};

const set_summary = (selector, value) => {
  document.querySelector(`#${selector}`).innerHTML = value;
};

const set_data = (id, data) => {
  let parent = document.getElementById(id);
  parent.querySelector(".value").innerText = data["value"];

  if ("third" in data) {
    parent.querySelector(".third").innerText = data["third"];
  }
};

if (!get_current_location()) {
  get_weather_data((loc = "manchester"));
}
