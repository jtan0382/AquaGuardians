document
	.getElementById("emergency-call")
	.addEventListener("click", function (event) {
		event.preventDefault(); // Prevent the default action (calling the number immediately)
		const userConfirmed = confirm("Do you want to call emergency services?");
		if (userConfirmed) {
			window.location.href = this.href; // Redirect to the tel: link if confirmed
		}
	});

// GET LOCATION
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			function (position) {
				const latitude = position.coords.latitude;
				const longitude = position.coords.longitude;

				// Create the data object to send in the POST request
				const data = { latitude: latitude, longitude: longitude };

				// Send a POST request using fetch API
				fetch("/recommendation", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				})
					.then((response) => {
						if (response.ok) {
							// If the POST request was successful, redirect to /recommendation
							window.location.href = "/recommendation";
						} else {
							console.error("Failed to send location data");
						}
					})
					.catch((error) => console.error("Error:", error));
			},
			function (error) {
				console.error("Geolocation error:", error);
				window.location.href = "/testblock";
			}
		);
	} else {
		window.location.href = "/test";
	}
}

// function showPosition(position) {
// 	x.innerHTML =
// 		"Latitude: " +
// 		position.coords.latitude +
// 		"<br>Longitude: " +
// 		position.coords.longitude;
// }

// function openModal() {
// 	console.log("testsss");
// }

document.addEventListener("DOMContentLoaded", function () {
	const beachModal = document.getElementById("beachModal");
	beachModal.addEventListener("show.bs.modal", function (event) {
		// Button that triggered the modal
		const button = event.relatedTarget;

		// Extract info from data-* attributes
		const beachName = button.getAttribute("data-beach-name");
		const beachImage = button.getAttribute("data-beach-image");
		const beachDescription = button.getAttribute("data-beach-description");

		// Update the modal's content
		const modalTitle = beachModal.querySelector(".modal-title");
		const modalImage = beachModal.querySelector("#beachModalImage");
		const modalDescription = beachModal.querySelector(".beach-description");

		modalTitle.textContent = beachName;
		modalImage.src = beachImage;
		if (modalDescription) {
			modalDescription.textContent = beachDescription;
		}
	});
});
