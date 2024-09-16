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

		const tempMin = button.getAttribute("data-beach-temp-min");
		const tempMax = button.getAttribute("data-beach-temp-max");
		const uvIndex = button.getAttribute("data-uv-index");
		const safeBeaufort = button.getAttribute("data-safe-beaufort");
		// const safeBeaufort = button.getAttribute("data-unsafe-beaufort");

		const windSpeed = button.getAttribute("data-wind-speed");
		const wave = button.getAttribute("data-wave");

		// console.log(tempMin);
		// console.log(tempMax);
		// console.log(uvIndex);
		// console.log(windSpeed);
		// console.log(wave);
		// console.log(safeBeaufort);
		// console.log(unsafeBeaufort);

		// const beachDescription = button.getAttribute("data-beach-description");

		// data-beach-temp-min="{{beach['temperature_2m_min']}}"
		// data-beach-temp-max="{{beach['temperature_2m_max']}}"
		// data-uv-index="{{beach['uv_index_max']}}"
		// data-wind-speed="{{beach['max_wind_speed']}}"
		// data-wave="{{beach['wave_height']}}"

		// Update the modal's content
		const modalTitle = beachModal.querySelector(".modal-title");
		const warningContainer = beachModal.querySelector(".warning-container");
		const amenitiesContainer = beachModal.querySelector(".amenities-container");
		const modalDescription = beachModal.querySelector(".modal-description");
		const titleContainer = document.getElementById("title-container");

		const temperatureMinText = beachModal.querySelector(
			".modal-temperature-min"
		);
		const temperatureMaxText = beachModal.querySelector(
			".modal-temperature-max"
		);
		const uvIndexText = beachModal.querySelector(".modal-uv-index");
		const windSpeedText = beachModal.querySelector(".modal-wind-speed");
		const waveText = beachModal.querySelector(".modal-wave");

		const safeBeaufortContainer = beachModal.querySelector(
			".safe-beaufort-container"
		);

		modalTitle.textContent = beachName;
		modalDescription.textContent = beachDescription;
		temperatureMinText.textContent = Math.round(tempMin) + "°C";
		temperatureMaxText.textContent = Math.round(tempMax) + "°C";
		uvIndexText.textContent = Math.round(uvIndex).toFixed(2);
		windSpeedText.textContent = Math.round(windSpeed).toFixed(2);
		waveText.textContent = Math.round(wave).toFixed(2);

		// Clear existing content
		titleContainer.innerHTML = ""; // Clear the location container
		warningContainer.innerHTML = "";
		amenitiesContainer.innerHTML = "";
		safeBeaufortContainer.innerHTML = "";

		// Check if there is safe time
		if (safeBeaufort) {
			const timeArray = safeBeaufort.split(",");
			timeArray.forEach(function (time) {
				const safeElement = document.createElement("p");
				safeElement.classList.add("text", "safe-time-text");
				const text = document.createTextNode(time);
				safeElement.appendChild(text);
				safeBeaufortContainer.appendChild(safeElement);

				// const safeElement = document.createElement("div");
				// safeElement.classList.add("safe-time-text");

				// const safeTextElement = document.createElement("p");
				// safeTextElement.classList.add("text");

				// const text = document.createTextNode(time);
				// safeTextElement.appendChild(text);

				// safeElement.appendChild(safeTextElement);
				// safeBeaufortContainer.appendChild(safeElement);
			});
		} else {
			const safeElement = document.createElement("p");
			safeElement.classList.add("text");
			const text = document.createTextNode(
				"it's a windy day, please be careful at the beaches"
			);

			safeElement.appendChild(text);
			safeBeaufortContainer.appendChild(safeElement);
		}

		// Add new location icon
		const linkElement = document.createElement("a");
		linkElement.href = `https://maps.google.com/?q=${beachLatitude},${beachLongitude}`;

		const imgElement = document.createElement("img");
		imgElement.src = "/img/icons/location.png";
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
