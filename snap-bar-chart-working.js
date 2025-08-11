// Read in the SNAP benefits data
d3.csv("data/snap_cuts_state_impact_CLEAN_CSV.csv").then(visualizeData)

const width = 900 //svg width
const height = 500 //svg height

const margin = { top: 30, right: 30, bottom: 100, left: 80 }
const chartWidth = width - margin.left - margin.right
const chartHeight = height - margin.top - margin.bottom

function visualizeData(data) {
  console.log(data)

  // DATA FORMATTING
  // Convert the families losing benefits from string to number
  data.forEach(function (d) {
    d.Families_losing_some_or_all_SNAP_benefits_1000s = +d.Families_losing_some_or_all_SNAP_benefits_1000s
  })

  // Sort data by number of families affected (highest to lowest)
  const sortedData = data.sort(function (a, b) {
    return b.Families_losing_some_or_all_SNAP_benefits_1000s - a.Families_losing_some_or_all_SNAP_benefits_1000s
  })

  // Add comma formatting for tooltips
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  sortedData.forEach(function (d) {
    d["Comma Value"] = numberWithCommas(d.Families_losing_some_or_all_SNAP_benefits_1000s)
  })

  console.log(sortedData)

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
      sortedData.map(function (d) {
        return d.State
      })
    )
    .range([0, chartWidth])
    .padding(0.3)

  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(sortedData, function (d) {
        return d.Families_losing_some_or_all_SNAP_benefits_1000s
      }),
    ])
    .range([chartHeight, 0])

  // Draw the actual plot
  const bars = svg
    .selectAll("rect")
    .data(sortedData)
    .join("rect")
    .attr("x", function (d) {
      return xScale(d.State)
    })
    .attr("y", function (d) {
      return yScale(d.Families_losing_some_or_all_SNAP_benefits_1000s)
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function (d) {
      return chartHeight - yScale(d.Families_losing_some_or_all_SNAP_benefits_1000s)
    })
    .attr("fill", "#e74c3c") // Red color to indicate negative impact
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)

  // Draw axes
  const xAxisGenerator = d3.axisBottom(xScale)
  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(xAxisGenerator)
  
  // Rotate x-axis labels for better readability
  xAxis.selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-45)")
  
  const yAxisGenerator = d3.axisLeft(yScale)
  const yAxis = svg
    .append("g")
    .call(yAxisGenerator)

  // Add axis labels
  const xAxisLabel = svg
    .append("text")
    .attr("x", chartWidth / 2)
    .attr("y", chartHeight + margin.bottom - 10)
    .attr("fill", "black")
    .text("State")
    .style("font-size", "14px")
    .style("text-anchor", "middle")

  const yAxisLabel = yAxis
    .append("text")
    .attr("x", -chartHeight / 2)
    .attr("y", -margin.left + 15)
    .attr("fill", "black")
    .text("Families Losing SNAP Benefits (thousands)")
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle")
    .style("font-size", "14px")

  // Add interactivity
  // "Every time you mouse over something, do these things"
  function handleMouseOver(event, d) {
    console.log("event", event.type)
    console.log("data", d)
    d3.select(this).attr("fill", "#f39c12").style("cursor", "pointer") // Orange on hover

    svg
      .append("text")
      .attr("class", "tooltip")
      .attr("x", xScale(d.State) + xScale.bandwidth() / 2)
      .attr("y", yScale(d.Families_losing_some_or_all_SNAP_benefits_1000s) - 10)
      .text(d["Comma Value"] + " families")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .attr("text-anchor", "middle")
  }

  // "When your mouse leaves, do these things"
  function handleMouseOut(event, d) {
    console.log("event", event.type)
    console.log("data", d)
    d3.select(this).attr("fill", "#e74c3c").style("cursor", "default") // Back to red

    svg.select(".tooltip").remove()
  }
}
