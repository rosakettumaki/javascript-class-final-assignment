;(function () {
  // Give the visible chart elements some breathing room
  const margin = { top: 20, right: 50, bottom: 50, left: 60 }

  // SVG dimensions
  const width = 600
  const height = 400

  // Chart dimensions
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom

  const svg = d3
    .select("#single-line")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
  // ^ "Move our chart 50px from the left and 20px from the top"
  // ${margin.left} is a template literal that lets you access variables in strings

  // Make a chart showing the number of Russian refugees to the US
  // We know our range (what we want our D3 scale outputs to be)
  const xPositionScale = d3.scaleTime().range([0, chartWidth])
  const yPositionScale = d3.scaleLinear().range([chartHeight, 0])

  // Helper function for our dates later
  const parseDate = d3.timeParse("%Y")

  // We need to plot x and y coordinates for our line
  const line = d3
    .line()
    .x(function(d) {
      return xPositionScale(d["Year"])})
    .y(d => yPositionScale(d.Refugees))


  // Load in our CSV
  // Then run this function called "ready" (defined below) using the CSV we just loaded
  // If the load fails, log the error in the console
  d3.csv("../data/russian-refugees.csv")
    .then(ready)
    .catch(function (error) {
      console.log("Failed with", error)
    })

  // This is our chart-making function
  function ready(datapoints) {
    // Convert our data to the right types
    datapoints.forEach(function (d) {
      d.Year = parseDate(d.Year)
      d.Refugees = +d.Refugees
    })

    // What does our data look like now?
    console.log(datapoints)

    // Update the scales
    const maxRefugees = d3.max(datapoints, d => d.Refugees)
    yPositionScale.domain([0, maxRefugees]).nice() // check out the y-axis without .nice()
    xPositionScale.domain(d3.extent(datapoints, d => d.Year))
    console.log(d3.extent(datapoints, d => d.Year))

    // Datum, not data
    const chartLine = svg
    .append("path")
    .datum(datapoints)
    .attr("stroke", "black")
    .attr("fill", "none")
    .attr("d", line)

    // Add axes using the scales we created
    // First, explain where the ticks go (axisLeft/axisBottom)
    // Then, add the axes to the SVG
    const yAxisGenerator = d3.axisLeft(yPositionScale)
    const yAxis = svg
    .append("g") // group the axes elements into a "g" container (sort of like a div)
    .call(yAxisGenerator)
    .attr("class", "axis y-axis")

    const xAxisGenerator = d3.axisBottom(xPositionScale)
    const xAxis = svg
      .append("g")
      .call(xAxisGenerator)
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0, ${chartHeight})`)
    // What would it look like if we didn't have that transform attribute?

    // Add labels to the axes that explains what they are
    const xAxisLabel = xAxis
      .append("text")
      .attr("x", chartWidth / 2)
      .attr("y", margin.bottom - 8)
      .attr("fill", "black")
      .html("Year")
      .style("font-size", "small")

    const yAxisLabel = yAxis
      .append("text")
      .attr("x", -chartHeight / 2)
      .attr("y", -margin.left + 10)
      .attr("fill", "black")
      .text("Number of refugees")
      .style("transform", "rotate(-90deg)")
      .style("text-anchor", "middle")
      .style("font-size", "small")

    // Add annotations
    // Variable for the annotation
    const fallSU = parseDate("1991")

    // yPositionScale number comes from the dataset entry for 1991
    svg
    .append("circle")
    .attr("cx", xPositionScale(fallSU))
    .attr("cy", yPositionScale(153658))
    .attr("r", 2)

    svg
      .append("text")
      .attr("x", xPositionScale(fallSU) + 5)
      .attr("y", yPositionScale(153658) + 5)
      .attr("class", "annotation")
      .html("Dissolution of the Soviet Union")
  }
})()
