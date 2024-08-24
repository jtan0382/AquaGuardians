const fileInput = document.getElementById("fileInput");
const imagePreview = document.getElementById("imagePreview");

fileInput.addEventListener("change", () => {
	const file = fileInput.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = () => {
			imagePreview.src = reader.result;
			imagePreview.style.display = "block";
		};
		reader.readAsDataURL(file);
	}
});

const x = document.getElementById("demo");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude;
}
