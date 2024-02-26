document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");
  var map = L.map("map").setView([0, 0], 2);
  console.log("Map instance created");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  console.log("Tile layer added to the map");

  var customIcon = L.icon({
    iconUrl: "images/icon-location.svg",
    iconSize: [38, 95],
    shadowSize: [50, 64],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76],
  });

  const apiKey = "at_sqckznaLKgxlsEzR5KP4eNpIcBYmO";
  function getData() {
    var inputValue = document.querySelector('input[type="search"]').value;
    URL = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${inputValue}`;
    return fetch(URL)
      .then((response) => response.json())
      .catch(console.log("Error"));
  }
  document.querySelector("img").addEventListener("click", (event) => {
    event.preventDefault();
    getData()
      .then((data) => {
        document.querySelector(".ip-address").innerHTML = data.ip;
        document.querySelector(
          ".location"
        ).innerHTML = `${data.location.region}, ${data.location.country}\n${data.as.asn}`;
        document.querySelector(
          ".timezone"
        ).innerHTML = `UTC ${data.location.timezone}`;
        document.querySelector(".isp").innerHTML = data.isp;

        L.marker([data.location.lat, data.location.lng], {
          icon: customIcon,
        }).addTo(map);
        map.setView([data.location.lat, data.location.lng], 15);
      })
      .catch(
        document
          .querySelectorAll(".ip-address, .location, .timezone, .isp")
          .forEach((element) => {
            element.innerHTML = "";
          }),
        map.setView([0, 0], 2),
        map.eachLayer(function (layer) {
          if (layer instanceof L.Marker) {
            map.removeLayer(layer);
          }
        })
      );
  });
});
