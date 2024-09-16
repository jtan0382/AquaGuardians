// FlagVideo
document.querySelector("#flagLanguage").addEventListener("click", function () {
	const selectedLanguage = document.getElementById("languageSelect").value;
	const iframe = document.getElementById("flagVideoIframe");
	let videoUrl = "";

	// Set the video URL based on the language selected
	switch (selectedLanguage) {
		case "en":
			videoUrl = "https://www.youtube.com/embed/i9VQsTRQRYk"; // English video
			break;
		case "fil":
			videoUrl = "https://www.youtube.com/embed/84EoufkR5vA"; // Filipino video
			break;
		case "hi":
			videoUrl = "https://www.youtube.com/embed/qR9N6Z9kvYY"; // Hindi video
			break;
		case "zh":
			videoUrl = "https://www.youtube.com/embed/MOKdFQzdVa0"; // Chinese video
			break;
		default:
			videoUrl = "https://www.youtube.com/embed/i9VQsTRQRYk"; // No video
	}
	// Update the iframe's src attribute if a valid video URL is set
	if (videoUrl) {
		iframe.src = videoUrl;
	} else {
		iframe.src = "";
		alert("Please select a valid language.");
	}
	// if (language === "en") {
	// 	console.log("Inside English block"); // Debugging log
	// 	iframeSrc = "https://www.youtube.com/embed/i9VQsTRQRYk";
	// 	iframeTitle = "[English with sub] Beach flags in Victoria";
	// } else if (language === "fil") {
	// 	console.log("Inside Filipino block"); // Debugging log
	// 	iframeSrc = "https://www.youtube.com/embed/FilipinoVideoLink"; // Replace with actual Filipino video link
	// 	iframeTitle = "[Filipino] Beach flags in Victoria";
	// } else if (language === "hi") {
	// 	console.log("Inside Hindi block"); // Debugging log
	// 	iframeSrc = "https://www.youtube.com/embed/HindiVideoLink"; // Replace with actual Hindi video link
	// 	iframeTitle = "[Hindi] Beach flags in Victoria";
	// } else if (language === "zh") {
	// 	console.log("Inside Chinese block"); // Debugging log
	// 	iframeSrc = "https://www.youtube.com/embed/ChineseVideoLink"; // Replace with actual Chinese video link
	// 	iframeTitle = "[Chinese] Beach flags in Victoria";
	// }
	// if (iframeSrc) {
	// 	alert("test");
	// 	alert(iframeSrc); // Alert to check iframeSrc

	// 	// Create iframe element
	// 	const iframe = document.createElement("iframe");
	// 	// iframe.classList.add("embed-responsive-item");
	// 	iframe.width = "100%";
	// 	iframe.height = "720";
	// 	iframe.src = iframeSrc;
	// 	iframe.title = iframeTitle;
	// 	iframe.frameBorder = "0";
	// 	iframe.allow =
	// 		"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
	// 	iframe.allowFullscreen = true;
	// 	iframe.referrerPolicy = "strict-origin-when-cross-origin";

	// 	// Append iframe to the container
	// 	videoContainer.appendChild(iframe);
	// } else {
	// 	videoContainer.innerHTML = "<p>Please select a valid language option.</p>";
	// }
});

document.querySelector("#checkFlags").addEventListener("click", function () {
	let correctCount = 0;
	const wrongFlagContainer = document.querySelector("#wrong-flags-container"); // Container for wrong images
	wrongFlagContainer.innerHTML = ""; // Clear any previous wrong images

	const wrongTitle = document.querySelector(".wrong-title");

	// Get all the select elements with the class 'flag-select'
	const selects = document.querySelectorAll(".flag-select");

	const flagInfo = {
		"flag1.png": "Stay out of the water for your safety.",
		"flag2.png": "Stay in the safest area that lifeguards are watching.",
		"flag3.png": "Watch out for surfboards in this zone.",
		"flag4.png": "Be alert—there could be hidden dangers.",
		"flag5.png": "Leave the water immediately for your safety.",
	};

	// Loop through each select and check if the selected value matches the correct answer
	selects.forEach(function (select) {
		const correctAnswer = select.getAttribute("data-correct-answer"); // Get correct answer from the data attribute
		const userAnswer = select.value; // Get the user's selected answer
		const flagImageSrc = select.parentElement.parentElement
			.querySelector("img")
			.getAttribute("src")
			.split("/")
			.pop(); // Get the corresponding flag image source
		// console.log(flagImageSrc);
		// Compare the user answer with the correct answer
		if (userAnswer === correctAnswer) {
			correctCount++;
			// wrongTitle.textContent = "Your answers are correct!";
		} else {
			wrongTitle.textContent = "Wrong Answer: ";

			// Create a card container
			const card = document.createElement("div");
			card.classList.add("card", "my-3", "rounded-3");

			// Create a card body
			const cardBody = document.createElement("div");
			cardBody.classList.add("card-body");

			const flagContainer = document.createElement("div");
			flagContainer.classList.add("d-flex");

			const wrongFlagImage = document.createElement("img");
			wrongFlagImage.src = `/img/beach-safety/${flagImageSrc}`;
			wrongFlagImage.classList.add(
				"img-fluid",
				"rounded-3",
				"wrong-flag-image",
				"mx-2"
			);

			flagContainer.appendChild(wrongFlagImage); // Append the wrong image to the container

			// flagContainer.classList.add("flag-info-container");

			const wrongFlagText = document.createElement("p");
			wrongFlagText.textContent = flagInfo[flagImageSrc];
			wrongFlagText.classList.add(
				"text",
				"d-flex",
				"justify-content-center",
				"align-content-center",
				"flag-info"
			);
			flagContainer.appendChild(wrongFlagText);

			cardBody.appendChild(flagContainer);

			card.appendChild(cardBody);

			wrongFlagContainer.appendChild(card);
			// wrongFlagContainer.appendChild(flagContainer);
		}
	});
});
