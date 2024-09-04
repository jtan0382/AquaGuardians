document.querySelector("#checkFlags").addEventListener("click", function () {
	let correctCount = 0;
	const wrongFlagContainer = document.querySelector("#wrong-flags-container"); // Container for wrong images
	wrongFlagContainer.innerHTML = ""; // Clear any previous wrong images

	// Get all the select elements with the class 'flag-select'
	const selects = document.querySelectorAll(".flag-select");

	// Loop through each select and check if the selected value matches the correct answer
	selects.forEach(function (select) {
		const correctAnswer = select.getAttribute("data-correct-answer"); // Get correct answer from the data attribute
		const userAnswer = select.value; // Get the user's selected answer
		const flagImageSrc = select.parentElement.parentElement
			.querySelector("img")
			.getAttribute("src"); // Get the corresponding flag image source

		// Compare the user answer with the correct answer
		if (userAnswer === correctAnswer) {
			correctCount++; 
		} else {
			
			const wrongFlagImage = document.createElement("img");
			wrongFlagImage.src = flagImageSrc; 
			wrongFlagImage.classList.add(
				"img-fluid",
				"rounded-3",
				"wrong-flag-image",
				"mx-2"
			);

			wrongFlagContainer.appendChild(wrongFlagImage); // Append the wrong image to the container
		}
	});

});

