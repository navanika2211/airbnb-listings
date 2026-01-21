const container = document.getElementById("listings");
const searchInput = document.getElementById("search");

let allListings = [];

async function loadListings() {
  const response = await fetch("./data/airbnb_listings.json");
  const data = await response.json();

  allListings = Array.isArray(data) ? data : data.listings;

  displayListings(allListings.slice(0, 50));
}

function displayListings(listings) {
  container.innerHTML = "";

  listings.forEach(listing => {
    const card = document.createElement("div");
    card.className = "card";

    const amenities = listing.amenities
      ? listing.amenities.slice(0, 5).join(", ")
      : "N/A";

    card.innerHTML = `
      <h2>${listing.name || "No title"}</h2>
      <img src="${listing.thumbnail_url || ''}">
      <p>${listing.description || "No description"}</p>
      <p><strong>Price:</strong> ${listing.price || "N/A"}</p>

      <div class="host">
        <img src="${listing.host_picture_url || ''}" width="50">
        <span>${listing.host_name || "Unknown host"}</span>
      </div>

      <p><strong>Amenities:</strong> ${amenities}</p>
    `;

    container.appendChild(card);
  });
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = allListings.filter(l =>
    (l.name || "").toLowerCase().includes(value) ||
    (l.description || "").toLowerCase().includes(value)
  );

  displayListings(filtered.slice(0, 50));
});

loadListings();
