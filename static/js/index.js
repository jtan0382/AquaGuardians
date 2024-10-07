// GET
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			function (position) {
				const latitude = position.coords.latitude;
				const longitude = position.coords.longitude;
				window.location.href = `/recommendation?latitude=${latitude}&longitude=${longitude}`;
			},
			function (error) {
				console.error("Geolocation error:", error);
				// window.location.href = "/recommendation";
			}
			// { maximumAge: 0, timeout: 10000, enableHighAccuracy: true }
		);
	} else {
		// Redirect without location if geolocation is not supported
		// window.location.href = "/recommendation";
	}
}

const script = document.getElementById("search-js");
// wait for the Mapbox Search JS script to load before using it
script.onload = function () {
	// instantiate a <mapbox-address-autofill> element using the MapboxAddressAutofill class
	const autofillElement = new mapboxsearch.MapboxAddressAutofill();

	autofillElement.accessToken =
		"pk.eyJ1IjoiamVoZXpraWVsMTY5OSIsImEiOiJjbHo5c3V0MmswZXZ4MnBxMjE0bDdodXYzIn0.qH5jxjHeSV9Q6I0F6f0wlA";

	// set the <mapbox-address-autofill> element's options
	autofillElement.options = {
		country: "AU", // Set country to Australia
		region: "VIC", // Specify Victoria as the region
	};

	const the_input = document.getElementById("address-input");
	const the_form = the_input.parentElement;

	// append the <input> to <mapbox-address-autofill>
	autofillElement.appendChild(the_input);
	// append <mapbox-address-autofill> to the <form>
	the_form.appendChild(autofillElement);
};

// COLOUR FILTER

// const filterInputs = document.querySelectorAll(".category-filter");
// const imageGrid = document.getElementById("image-grid");

// filterInputs.forEach((input) => {
// 	input.addEventListener("change", filterItems);
// });

// // Load initial content
// filterItems({ target: document.getElementById("all") });

// function filterItems(e) {
// 	const selectedCategory = e.target.value;

// 	// Fetch content based on selected category
// 	fetch(`/get_items/${selectedCategory}`)
// 		.then((response) => response.json())
// 		.then((data) => {
// 			imageGrid.innerHTML = ""; // Clear existing content
// 			data.forEach((item) => {
// 				const itemElement = createItemElement(item);
// 				imageGrid.appendChild(itemElement);
// 			});
// 		})
// 		.catch((error) => console.error("Error:", error));
// }

// function createItemElement(item) {
// 	const div = document.createElement("div");
// 	div.className = "col-md-4 d-flex flex-column mb-4 category-item";
// 	div.setAttribute("data-category", item.category);

// 	const img = document.createElement("img");
// 	img.src = item.image;
// 	img.alt = "";
// 	img.className = "img-fluid w-100";

// 	const a = document.createElement("a");
// 	a.href = item.pdf;
// 	a.className = "btn btn-outline-primary mt-2";
// 	a.textContent = "Download CV";

// 	div.appendChild(img);
// 	div.appendChild(a);

// 	return div;
// }

const filterInputs = document.querySelectorAll(".category-filter");
const imageGrid = document.getElementById("image-grid");
const paginationContainer = document.getElementById("pagination");
let currentCategory = "all";
let currentPage = 1;
const itemsPerPage = 9; // 3x3 grid

filterInputs.forEach((input) => {
	input.addEventListener("change", (e) => {
		currentCategory = e.target.value;
		currentPage = 1;
		loadItems();
	});
});

// Load initial content
loadItems();

function loadItems() {
	fetch(
		`/get_items/${currentCategory}?page=${currentPage}&per_page=${itemsPerPage}`
	)
		.then((response) => response.json())
		.then((data) => {
			renderItems(data.items);
			renderPagination(data.total_pages);
		})
		.catch((error) => console.error("Error:", error));
}

function renderItems(items) {
	imageGrid.innerHTML = ""; // Clear existing content
	items.forEach((item) => {
		const itemElement = createItemElement(item);
		imageGrid.appendChild(itemElement);
	});
}

function createItemElement(item) {
	const div = document.createElement("div");
	div.className = "col-md-4 d-flex flex-column mb-4 category-item";
	div.setAttribute("data-category", item.category);

	const img = document.createElement("img");
	img.src = item.image;
	img.alt = "";
	img.className = "img-fluid w-100";

	const a = document.createElement("a");
	a.href = item.pdf;
	a.className = "btn btn-outline-primary mt-2";
	a.textContent = "Download";

	div.appendChild(img);
	div.appendChild(a);

	return div;
}

function renderPagination(totalPages) {
	paginationContainer.innerHTML = "";

	// Previous button
	const prevLi = document.createElement("li");
	prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
	const prevA = document.createElement("a");
	prevA.className = "page-link";
	prevA.href = "#";
	prevA.textContent = "Previous";
	prevA.addEventListener("click", (e) => {
		e.preventDefault();
		if (currentPage > 1) {
			currentPage--;
			loadItems();
		}
	});
	prevLi.appendChild(prevA);
	paginationContainer.appendChild(prevLi);

	// Page numbers
	for (let i = 1; i <= totalPages; i++) {
		const li = document.createElement("li");
		li.className = `page-item ${i === currentPage ? "active" : ""}`;
		const a = document.createElement("a");
		a.className = "page-link";
		a.href = "#";
		a.textContent = i;
		a.addEventListener("click", (e) => {
			e.preventDefault();
			currentPage = i;
			loadItems();
		});
		li.appendChild(a);
		paginationContainer.appendChild(li);
	}

	// Next button
	const nextLi = document.createElement("li");
	nextLi.className = `page-item ${
		currentPage === totalPages ? "disabled" : ""
	}`;
	const nextA = document.createElement("a");
	nextA.className = "page-link";
	nextA.href = "#";
	nextA.textContent = "Next";
	nextA.addEventListener("click", (e) => {
		e.preventDefault();
		if (currentPage < totalPages) {
			currentPage++;
			loadItems();
		}
	});
	nextLi.appendChild(nextA);
	paginationContainer.appendChild(nextLi);
}
