// Load the CSV data
d3.csv("/data/vis_data.csv").then(function (data) {
	console.log(data);
	// Update bar chart
	updateBarChart(data, "#bar-chart svg");

	// Add event listeners for filters
	document
		.getElementById("measure-filter")
		.addEventListener("change", function () {
			updateBarChart(data, "#bar-chart svg");
		});

	document
		.getElementById("gender-filter")
		.addEventListener("change", function () {
			updateBarChart(data, "#bar-chart svg");
		});

	document.getElementById("age-filter").addEventListener("change", function () {
		updateBarChart(data, "#bar-chart svg");
	});

	// Function to update bar chart with filters
	function updateBarChart(data, chartSelector) {
		// Get filter values
		let measureFilter = document.getElementById("measure-filter").value;
		let genderFilter = document.getElementById("gender-filter").value;
		let ageFilter = document.getElementById("age-filter").value;

		// Filter data
		let filteredData = data;

		if (measureFilter !== "all") {
			filteredData = filteredData.filter(
				(d) => d.measure_name === measureFilter
			);
		}
		if (genderFilter !== "all") {
			filteredData = filteredData.filter((d) => d.sex_name === genderFilter);
		}
		if (ageFilter !== "all") {
			filteredData = filteredData.filter((d) => d.age_category === ageFilter);
		}

		// Group data by age category and gender
		let groupedData = d3.rollup(
			filteredData,
			(v) => d3.sum(v, (d) => +d.val),
			(d) => d.age_category,
			(d) => d.sex_name
		);

		// Create scales
		let x = d3
			.scaleBand()
			.domain([...groupedData.keys()])
			.range([0, 600])
			.padding(0.1);
		let y = d3
			.scaleLinear()
			.domain([
				0,
				d3.max(Array.from(groupedData.values()), (d) =>
					d3.max([...d.values()])
				),
			])
			.range([400, 0]);

		let color = d3
			.scaleOrdinal()
			.domain(["Male", "Female"])
			.range(["blue", "pink"]);

		// Clear previous chart
		let svg = d3.select(chartSelector);
		svg.selectAll("rect").remove();
		svg.selectAll("g").remove();

		// Draw bars for each gender
		for (let [ageCategory, genderData] of groupedData) {
			for (let [gender, value] of genderData) {
				svg
					.append("rect")
					.attr("x", x(ageCategory))
					.attr("y", y(value))
					.attr("width", x.bandwidth() / 2)
					.attr("height", 400 - y(value))
					.attr("fill", color(gender))
					.attr(
						"transform",
						gender === "Male"
							? "translate(0, 0)"
							: `translate(${x.bandwidth() / 2}, 0)`
					)
					.on("mouseover", function (event) {
						d3.select("#tooltip")
							.style("left", event.pageX + 5 + "px")
							.style("top", event.pageY - 28 + "px")
							.style("opacity", 1)
							.text(
								`${gender} ${ageCategory}: ${Math.round(value * 1000) / 1000}`
							);
					})
					.on("mouseout", function () {
						d3.select("#tooltip").style("opacity", 0);
					});
			}
		}

		// Add axes
		svg
			.append("g")
			.attr("transform", "translate(0, 400)")
			.call(d3.axisBottom(x));
		svg.append("g").call(d3.axisLeft(y));

		// X-axis label
		svg
			.append("text")
			.attr("x", 300)
			.attr("y", 440)
			.style("text-anchor", "middle")
			.text("Age Category");

		// Y-axis label
		svg
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -200)
			.attr("y", 20)
			.style("text-anchor", "middle")
			.text("Value");

		// Add legend
		let legend = d3.select("#bar-chart-legend");
		legend.html(""); // Clear existing legend

		let legendItems = ["Male", "Female"];
		legendItems.forEach((item, i) => {
			legend
				.append("div")
				.style("display", "flex")
				.style("align-items", "center")
				.style("margin-bottom", "5px").html(`
					<div style="width: 10px; height: 10px; background: ${color(
						item
					)}; margin-right: 5px;"></div>
					${item}
				`);
		});
	}
});
