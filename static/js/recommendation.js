document.addEventListener("DOMContentLoaded", function () {
	const beachModal = document.getElementById("beachModal");

	beachModal.addEventListener("show.bs.modal", function (event) {
		// Button that triggered the modal
		const button = event.relatedTarget;

		// Extract info from data-* attributes
		const beachName = button.getAttribute("data-beach-name");
		const beachLatitude = button.getAttribute("data-beach-latitude");
		const beachLongitude = button.getAttribute("data-beach-longitude");

		const beachWarnings = button.getAttribute("data-beach-warning");
		const beachAmenities = button.getAttribute("data-beach-amenities");
		const beachDescription = button.getAttribute("data-beach-description");

		// Update the modal's content
		const modalTitle = beachModal.querySelector(".modal-title");
		const warningContainer = beachModal.querySelector(".warning-container");
		const amenitiesContainer = beachModal.querySelector(".amenities-container");
		const modalDescription = beachModal.querySelector(".modal-description");
		const titleContainer = document.getElementById("title-container");

		modalTitle.textContent = beachName;
		modalDescription.textContent = beachDescription;

		// Clear existing content
		titleContainer.innerHTML = ""; // Clear the location container
		warningContainer.innerHTML = "";
		amenitiesContainer.innerHTML = "";

		// Add new location icon
		const linkElement = document.createElement("a");
		linkElement.href = `https://maps.google.com/?q=${beachLatitude},${beachLongitude}`;

		const imgElement = document.createElement("img");
		imgElement.src = "/img/icons/location.jpeg";
		imgElement.classList.add("location-icon", "img-fluid", "mx-3");
		// imgElement.classList.add("location-icon");
		// imgElement.classList.add("img-fluid");
		// imgElement.classList.add("mx-3");

		linkElement.appendChild(imgElement);
		titleContainer.appendChild(linkElement);

		// Add warnings
		if (beachWarnings) {
			const warningsArray = beachWarnings.split(",");
			warningsArray.forEach(function (warning) {
				const warningElement = document.createElement("div");
				warningElement.classList.add("warning-item");
				warningElement.classList.add("d-flex");

				warning = warning.trim().toLowerCase();

				const imgElement = document.createElement("img");
				imgElement.classList.add("img-fluid");
				imgElement.src = `/img/warning/${warning}.jpeg`;
				imgElement.alt = `${warning} `;
				imgElement.classList.add("warning-icon");
				warningElement.appendChild(imgElement);
				warningContainer.appendChild(warningElement);
			});
		} else {
			const warningElement = document.createElement("p");
			warningElement.classList.add("text");
			const text = document.createTextNode("No Warning shown");
			warningElement.appendChild(text);
			warningContainer.appendChild(warningElement);
		}

		// Add amenities
		if (beachAmenities) {
			const amenitiesArray = beachAmenities.split(",");
			amenitiesArray.forEach(function (amenity) {
				const amenityElement = document.createElement("div");
				amenityElement.classList.add("amenity-item");
				amenityElement.classList.add("d-flex");

				amenity = amenity.trim().toLowerCase();

				const imgElement = document.createElement("img");
				imgElement.classList.add("img-fluid");
				imgElement.src = `/img/amenities/${amenity}.png`;
				imgElement.alt = `${amenity} Amenity`;
				imgElement.classList.add("amenity-icon");
				amenityElement.appendChild(imgElement);
				amenitiesContainer.appendChild(amenityElement);
			});
		} else {
			const amenityElement = document.createElement("p");
			amenityElement.classList.add("text");
			const text = document.createTextNode("No Amenities shown");
			amenityElement.appendChild(text);
			amenitiesContainer.appendChild(amenityElement);
		}
	});

	// Event listener to clear content when modal is hidden
	beachModal.addEventListener("hidden.bs.modal", function () {
		// Clear the content of all containers
		const titleContainer = document.getElementById("title-container");
		const warningContainer = beachModal.querySelector(".warning-container");
		const amenitiesContainer = beachModal.querySelector(".amenities-container");

		titleContainer.innerHTML = "";
		warningContainer.innerHTML = "";
		amenitiesContainer.innerHTML = "";
	});
});
