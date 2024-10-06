// Load the CSV data
d3.csv("/data/vis_data.csv").then(function (data) {
	console.log(data);
	// Update bar chart
	updateBarChart(data, "#bar-chart svg");

	// Add form event listener
	document
		.getElementById("user-form")
		.addEventListener("submit", function (event) {
			event.preventDefault();

			let name = document.getElementById("name").value;
			let numChildren = document.getElementById("num-children").value;
			const ages = document.getElementById("ages").value.split(",").map(Number);
			const genders = document
				.getElementById("gender")
				.value.split(",")
				.map((g) => g.trim().toLowerCase());

			// Map numerical age input to age categories
			let ageCategories = new Set();
			ages.forEach((age) => {
				mapAgesToCategories(age).forEach((category) =>
					ageCategories.add(category)
				);
			});

			// Filter data based on user input
			const filteredData = data.filter(
				(d) =>
					ageCategories.has(d.age_category) &&
					genders.includes(d.sex_name.toLowerCase())
			);
			console.log(filteredData);

			// Update pie charts based on filtered data
			updatePieChart(filteredData, "Deaths", "#death-chart svg");
		});

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

	// Function to map numerical age input to age categories
	function mapAgesToCategories(age) {
		if (age >= 0 && age < 1)
			return ["Newborn (0-28 days)", "Infants (1-11 months)"];
		else if (age >= 1 && age < 5) return ["Young Toddlers (1-4 years)"];
		else if (age >= 5 && age <= 9) return ["Children (5-9 years)"];
		else if (age >= 10 && age <= 17) return ["Older Children (10-17 years)"];
		return [];
	}
	// Pie chart
	function updatePieChart(data, measure, chartSelector) {
		// Group data by measure and calculate total `val`
		let measureTotals = d3.rollup(
			data,
			(v) => d3.sum(v, (d) => +d.val), // Calculate total of `val` column
			(d) => d.measure_name // Group by measure_name (death, disability)
		);

		// Convert to array format for pie chart
		let pieData = Array.from(measureTotals).map(([measureName, total]) => ({
			measure: measureName,
			total,
		}));

		// Create pie chart
		let pie = d3.pie().value((d) => d.total);
		let arc = d3.arc().innerRadius(0).outerRadius(150);
		let color = d3
			.scaleOrdinal()
			.domain(["Death", "Disability"])
			.range(["red", "green"]); // Colors for each measure

		// Clear previous chart
		d3.select(chartSelector).selectAll("*").remove();

		// Draw pie chart
		const paths = d3
			.select(chartSelector)
			.selectAll("path")
			.data(pie(pieData))
			.enter()
			.append("path")
			.attr("d", arc)
			.attr("fill", (d) => color(d.data.measure))
			.attr("transform", `translate(200, 200)`); // Center the pie chart

		// Tooltip functionality
		const tooltip = d3.select("#tooltip");

		// Add mouse events to paths
		paths
			.on("mouseover", (event, d) => {
				tooltip.transition().duration(200).style("opacity", 0.9);
				tooltip
					.html(`${d.data.measure}: ${d.data.total}`)
					.style("left", event.pageX + 5 + "px")
					.style("top", event.pageY - 28 + "px");
			})
			.on("mouseout", (d) => {
				tooltip.transition().duration(500).style("opacity", 0);
			});

		// Create legend
		const legend = d3.select("#legend");
		legend.selectAll("*").remove(); // Clear previous legend

		// Add legend items
		pieData.forEach((d) => {
			legend
				.append("div")
				.style("display", "flex")
				.style("align-items", "center")
				.style("margin-bottom", "5px").html(`
                <div style="width: 20px; height: 20px; background: ${color(
									d.measure
								)}; margin-right: 5px;"></div>
                ${d.measure}: ${d.total}
            `);
		});
	}

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
							.text(`${gender}: ${Math.round(value * 1000) / 1000}`);
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
			.attr("y", -50)
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
                <div style="width: 20px; height: 20px; background: ${color(
									item
								)}; margin-right: 5px;"></div>
                ${item}
            `);
		});
	}
});
