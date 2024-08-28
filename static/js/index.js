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
				// Redirect without location if permission denied
				window.location.href = "/recommendation";
			}
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
