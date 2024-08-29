console.log("TEST");

// const fileInput = document.getElementById("fileInput");
// const imagePreview = document.getElementById("imagePreview");

// fileInput.addEventListener("change", () => {
// 	const file = fileInput.files[0];
// 	if (file) {
// 		const reader = new FileReader();
// 		reader.onload = () => {
// 			imagePreview.src = reader.result;
// 			imagePreview.style.display = "block";
// 		};
// 		reader.readAsDataURL(file);
// 	}
// });

// const x = document.getElementById("demo");

// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
//   } else {
//     x.innerHTML = "Geolocation is not supported by this browser.";
//   }
// }

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
				window.location.href = "/recommendation";
			}
			// { maximumAge: 0, timeout: 10000, enableHighAccuracy: true }
		);
	} else {
		// Redirect without location if geolocation is not supported
		window.location.href = "/recommendation";
	}
}

function showPosition(position) {
	x.innerHTML =
		"Latitude: " +
		position.coords.latitude +
		"<br>Longitude: " +
		position.coords.longitude;
}

function openModal() {
	console.log("testsss");
}
// function openModal(beachName, imageUrl) {
// Set the modal title
// document.getElementById("beachModalLabel").innerText = beachName;

// Set the modal image
// document.getElementById("beachModalImage").src = imageUrl;
// document.getElementById("beachModalImage").alt = beachName;

// Set the modal description
// document.getElementById("beachModalDescription").innerText = description;
// }
