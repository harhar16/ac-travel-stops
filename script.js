const GOOGLE_API_KEY = 'AIzaSyBfCZq7OjeJg-zBqwHKPeUACLBwGYzp3m8'; // replace this with your actual API key
const resultsContainer = document.getElementById('results');

async function searchCoffeeShops() {
  const zip = document.getElementById('zipInput').value.trim();
  if (!zip) {
    alert("You didn't enter a zip code, chief.");
    return;
  }

  try {
    const coords = await getCoordsFromZip(zip);
    const coffeeShops = await getCoffeeShops(coords.lat, coords.lng);
    displayResults(coffeeShops);
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Probably your fault.");
  }
}

async function getCoordsFromZip(zip) {
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${GOOGLE_API_KEY}`);
  const data = await response.json();
  if (data.status !== "OK") throw new Error("Invalid ZIP code or Google’s having a meltdown.");
  const location = data.results[0].geometry.location;
  return { lat: location.lat, lng: location.lng };
}

async function getCoffeeShops(lat, lng) {
  const radius = 5000; // meters, because America can’t have nice things like the metric system
  const type = "cafe";
  const keyword = "coffee+wifi+workspace";

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&keyword=${keyword}&key=${GOOGLE_API_KEY}`;
  
  const proxy = 'https://cors-anywhere.herokuapp.com/'; // because Google doesn’t love front-end direct calls
  const response = await fetch(proxy + url);
  const data = await response.json();
  return data.results || [];
}

function displayResults(shops) {
  resultsContainer.innerHTML = "";

  if (shops.length === 0) {
    resultsContainer.innerHTML = "<p>No coffee shops found. You may be in Ohio. Sorry.</p>";
    return;
  }

  shops.forEach(shop => {
    const card = document.createElement('div');
    card.className = "bg-white rounded shadow p-4";

    card.innerHTML = `
      <h2 class="text-xl font-semibold">${shop.name}</h2>
      <p>${shop.vicinity || "No address found"}</p>
      <p><strong>Rating:</strong> ${shop.rating || "N/A"}</p>
      <button class="mt-2 text-sm text-teal-600 hover:underline" onclick="markFavorite('${shop.place_id}')">❤️ Favorite</button>
      <button class="ml-4 mt-2 text-sm text-yellow-600 hover:underline" onclick="markRecommend('${shop.place_id}')">🌟 Recommend</button>
    `;

    resultsContainer.appendChild(card);
  });
}

function markFavorite(id) {
  alert(`Added place ${id} to favorites. (Pretend this saves to a database. Backend coming soon.)`);
}

function markRecommend(id) {
  alert(`Marked place ${id} as recommended. Look at you, community builder.`);
}
