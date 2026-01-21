const container = document.getElementById("listings");
const searchInput = document.getElementById("search");
const statusEl = document.getElementById("status");

let allListings = [];

async function loadListings() {
  try {
    statusEl.textContent = "Loading JSON…";

    const response = await fetch("./data/airbnb_listings.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Fetch failed. HTTP ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      allListings = data;
    } else if (Array.isArray(data.results)) {
      allListings = data.results;
    } else if (Array.isArray(data.listings)) {
      allListings = data.listings;
    } else if (Array.isArray(data.data)) {
      allListings = data.data;
    } else {
      throw new Error("JSON loaded, but couldn't find an array. Expected data to be an array or have a results/listings/data key.");
    }

    statusEl.textContent = `Loaded ${allListings.length} listings. Showing first 50.`;
    displayListings(allListings.slice(0, 50));
  } catch (err) {
    console.error(err);
    statusEl.textContent = `❌ ${err.message}`;
  }
}

function displayListings(listings) {
  container.innerHTML = "";

  if (!listings.length) {
    container.innerHTML = "<p>No listings to show.</p>";
    return;
  }

  listings.forEach(listing => {
    const card = document.createElement("div");
    card.className = "card";

    const amenities = Array.isArray(listing.amenities)
      ? listing.amenities.slice(0, 5).join(", ")
      : (listing.amenities ? String(listing.amenities) : "N/A");

    const title = listing.name || listing.title || "No title";
    const desc = listing.description || "No description";
    const price = listing.price || listing.nightly_price || listing.cost || "N/A";
    const thumb = listing.thumbnail_url || listing.picture_url || listing.image || "";
    const hostName = listing.host_name || listing.host?.name || "Unknown host";
    const hostPic = listing.host_picture_url || listing.host?.picture_url || listing.host?.photo || "";

    card.innerHTML = `
      <h2>${title}</h2>
      ${thumb ? `<img src="${thumb}" alt="thumbnail">` : ""}
      <p>${desc}</p>
      <p><strong>Price:</strong> ${price}</p>
      <div class="host">
        ${hostPic ? `<img src="${hostPic}" width="50" alt="host">` : ""}
        <span>${hostName}</span>
      </div>
      <p><strong>Amenities:</strong> ${amenities}</p>
    `;

    container.appendChild(card);
  });
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = allListings.filter(l =>
    (l.name || l.title || "").toLowerCase().includes(value) ||
    (l.description || "").toLowerCase().includes(value) ||
    (l.host_name || l.host?.name || "").toLowerCase().includes(value)
  );

  displayListings(filtered.slice(0, 50));
});

loadListings();
