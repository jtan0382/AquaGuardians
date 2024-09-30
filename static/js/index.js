// document
// 	.getElementById("emergency-call")
// 	.addEventListener("click", function (event) {
// 		event.preventDefault(); // Prevent the default action (calling the number immediately)
// 		const userConfirmed = confirm("Do you want to call emergency services?");
// 		if (userConfirmed) {
// 			window.location.href = this.href; // Redirect to the tel: link if confirmed
// 		}
// 	});

// $(".emergency-circle").click(function () {
// 	var collapseContent = $(this).attr("href");
// 	$(collapseContent).collapse("toggle");
// 	var ariaExpanded =
// 		$(this).attr("aria-expanded") === "true" ? "false" : "true";
// 	$(this).attr("aria-expanded", ariaExpanded);
// });

// GET LOCATION
// function getLocation() {
// 	if (navigator.geolocation) {
// 		navigator.geolocation.getCurrentPosition(
// 			function (position) {
// 				const latitude = position.coords.latitude;
// 				const longitude = position.coords.longitude;

// 				// Create the data object to send in the POST request
// 				const data = { latitude: latitude, longitude: longitude };

// 				// Send a POST request using fetch API
// 				fetch("/recommendation", {
// 					method: "POST",
// 					headers: {
// 						"Content-Type": "application/json",
// 					},
// 					body: JSON.stringify(data),
// 				})
// 					.then((response) => {
// 						if (response.ok) {
// 							console.log("The response is ok");
// 							// If the POST request was successful, redirect to /recommendation
// 							window.location.href = "/recommendation";
// 						} else {
// 							console.error("Failed to send location data");
// 						}
// 					})
// 					.catch((error) => console.error("Error:", error));
// 			},
// 			function (error) {
// 				console.error("Geolocation error:", error);
// 				window.location.href = "/testblock";
// 			}
// 		);
// 	} else {
// 		window.location.href = "/test";
// 	}
// }

// POST
// function getLocation() {
// 	if (navigator.geolocation) {
// 		navigator.geolocation.getCurrentPosition(
// 			function (position) {
// 				const latitude = position.coords.latitude;
// 				const longitude = position.coords.longitude;

// 				// Populate the form with the latitude and longitude
// 				document.getElementById("latitude").value = latitude;
// 				document.getElementById("longitude").value = longitude;

// 				// Submit the form
// 				document.getElementById("locationForm").submit();
// 			},
// 			function (error) {
// 				console.error("Geolocation error:", error);
// 				window.location.href = "/testblock";
// 			}
// 		);
// 	} else {
// 		window.location.href = "/test";
// 	}
// }

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

// document.addEventListener("DOMContentLoaded", function () {
// 	const beachModal = document.getElementById("beachModal");

// 	beachModal.addEventListener("show.bs.modal", function (event) {
// 		// Button that triggered the modal
// 		const button = event.relatedTarget;

// 		// Extract info from data-* attributes
// 		const beachName = button.getAttribute("data-beach-name");
// 		const beachLatitude = button.getAttribute("data-beach-latitude");
// 		const beachLongitude = button.getAttribute("data-beach-longitude");
// 		// const beachLocation = button.getAttribute("data-beach-location");

// 		const beachWarnings = button.getAttribute("data-beach-warning");
// 		const beachAmenities = button.getAttribute("data-beach-amenities");
// 		const beachDescription = button.getAttribute("data-beach-description");

// 		// Update the modal's content
// 		const modalTitle = beachModal.querySelector(".modal-title");
// 		// const modalLocation = beachModal.querySelector(".modal-location");
// 		const warningContainer = beachModal.querySelector(".warning-container");
// 		const amenitiesContainer = beachModal.querySelector(".amenities-container");
// 		const modalDescription = beachModal.querySelector(".modal-description");

// 		modalTitle.textContent = beachName;
// 		// modalLocation.textContent = beachLocation;
// 		modalDescription.textContent = beachDescription;

// 		// Location Image
// 		const titleContainer = document.getElementById("title-container");

// 		const linkElement = document.createElement("a");
// 		linkElement.href = `https://maps.google.com/?q=${beachLatitude},${beachLongitude}`;

// 		const imgElement = document.createElement("img");
// 		imgElement.src = "/img/icons/location.jpeg";
// 		// imgElement.alt = `${beachLatitude}, ${beachLongitude}`;
// 		imgElement.classList.add("location-icon");
// 		imgElement.classList.add("img-fluid");
// 		imgElement.classList.add("mx-3");

// 		linkElement.appendChild(imgElement);
// 		titleContainer.appendChild(linkElement);

// 		// Clear existing warnings and amenities before adding new ones
// 		warningContainer.innerHTML = "";
// 		amenitiesContainer.innerHTML = "";
// 		titleContainer.innerHTML = "";

// 		if (beachWarnings) {
// 			const warningsArray = beachWarnings.split(",");
// 			warningsArray.forEach(function (warning) {
// 				const warningElement = document.createElement("div");
// 				warningElement.classList.add("warning-item");

// 				warningElement.classList.add("d-flex");

// 				warning = warning.trim().toLowerCase();

// 				const imgElement = document.createElement("img");
// 				imgElement.classList.add("img-fluid");
// 				imgElement.src = `/img/warning/${warning}.jpeg`;
// 				console.log(`/img/warning/${warning}.jpeg`);
// 				imgElement.alt = `${warning} `;
// 				imgElement.classList.add("warning-icon");
// 				warningElement.appendChild(imgElement);
// 				warningContainer.appendChild(warningElement);
// 			});
// 		} else {
// 			const warningElement = document.createElement("p");
// 			warningElement.classList.add("text");
// 			const text = document.createTextNode("No Warning shown");
// 			warningElement.appendChild(text);
// 			warningContainer.appendChild(warningElement);
// 		}

// 		if (beachAmenities) {
// 			const amenitiesArray = beachAmenities.split(",");
// 			amenitiesArray.forEach(function (amenity) {
// 				const amenityElement = document.createElement("div");
// 				amenityElement.classList.add("amenity-item");

// 				amenityElement.classList.add("d-flex");

// 				amenity = amenity.trim().toLowerCase();

// 				const imgElement = document.createElement("img");
// 				imgElement.classList.add("img-fluid");
// 				imgElement.src = `/img/amenities/${amenity}.png`;
// 				console.log(`/img/amenities/${amenity}.png`);
// 				imgElement.alt = `${amenity} Amenity`;
// 				imgElement.classList.add("amenity-icon");
// 				amenityElement.appendChild(imgElement);
// 				amenitiesContainer.appendChild(amenityElement);
// 			});
// 		} else {
// 			const amenityElement = document.createElement("p");
// 			amenityElement.classList.add("text");
// 			const text = document.createTextNode("No Amenities shown");
// 			amenityElement.appendChild(text);
// 			amenitiesContainer.appendChild(amenityElement);
// 		}
// 	});

// 	// Event listener to clear content when modal is hidden
// 	beachModal.addEventListener("hidden.bs.modal", function () {
// 		// No need to use querySelector again, as references are stored
// 		warningContainer.innerHTML = "";
// 		amenitiesContainer.innerHTML = "";
// 		// titleContainer.innerHTML = "";
// 	});
// });
