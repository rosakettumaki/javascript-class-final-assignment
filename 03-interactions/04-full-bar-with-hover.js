// Read in the data
// Then make the chart using the data from the CSV we just loaded
d3.csv("snap_cuts_state_impact_CLEAN_CSV.csv").then(visualizeData)

const width = 900 //svg width
const height = 500 //svg height

const margin = { top: 30, right: 30, bottom: 30, left: 60 }
const chartWidth = width - margin.left - margin.right
const chartHeight = height - margin.top - margin.bottom

function visualizeData(data) {
  console.log(data)

  // DATA FORMATTING
  // See 02-more-charts/01-bar-chart.js for full notes
  const dataSubset = data.filter(function (d) {
    return d.Year === "2024"
  })
  const asylum5 = dataSubset
    .sort(function (a, b) {
      return b[`Asylum Seekers`] - a[`Asylum Seekers`]
    })
    .slice(0, 5)
  asylum5.forEach(function (d) {
    d["Asylum Seekers"] = +d["Asylum Seekers"]
  })
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  asylum5.forEach(function (d) {
    d["Comma Value"] = numberWithCommas(d["Asylum Seekers"])
  })

  // CHART MAKING

  // Make our SVG canvas
  var svg = d3
    .select("#chart-space")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  // Create x and y scales
  const xScale = d3
    .scaleBand()
    .domain(
      asylum5.map(function (d) {
        return d[`Country of Origin`]
      })
    )
    .range([0, chartWidth])
    .padding(0.2) // look at the scale without this

  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(asylum5, function (d) {
        return d[`Asylum Seekers`]
      }),
    ])
    .range([chartHeight, 0])

  // Draw the actual plot
  const bars = svg
    .selectAll("rect")
    .data(asylum5)
    .join("rect")
    .attr("x", function (d) {
      return xScale(d[`Country of Origin`])
    })
    .attr("y", function (d) {
      return yScale(d[`Asylum Seekers`])
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function (d) {
      return chartHeight - yScale(d[`Asylum Seekers`])
    })
    .attr("fill", "darkolivegreen")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)

  // Draw axes
  const xAxisGenerator = d3.axisBottom(xScale)
  const xAxis = svg
  .append("g")
  .attr("transform", `translate(0,${chartHeight})`)
  .call(xAxisGenerator)
  
  const yAxisGenerator = d3.axisLeft(yScale)
  const yAxis = svg
  .append("g")
  .call(yAxisGenerator)

  // Add interactivity
  // "Every time you mouse over something, do these things"
  function handleMouseOver(event, d) {
    console.log("event", event.type)
    console.log("data", d)
    d3.select(this).attr("fill", "orange").style("cursor", "pointer")

    svg
      .append("text")
      .attr("class", "tooltip")
      .attr("x", xScale(d["Country of Origin"]) + xScale.bandwidth() / 2)
      .attr("y", yScale(d[`Asylum Seekers`]) - 10)
      .text(d[`Comma Value`] + " asylum seekers")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .attr("text-anchor", "middle")
  }

  // "When your mouse leaves, do these things"
  function handleMouseOut(event, d) {
    console.log("event", event.type)
    console.log("data", d)
    d3.select(this).attr("fill", "darkolivegreen").style("cursor", "default")

    svg.select(".tooltip").remove()
  }
}
