;(function () {
    // Give the visible chart elements some breathing room
    const margin = { top: 20, right: 50, bottom: 50, left: 60 }
  
    const width = 600
    const height = 400

    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    const svg = d3
      .select("#total-length")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
  
    const xPositionScale = d3.scaleTime().range([0, chartWidth])
    const yPositionScale = d3.scaleLinear().range([chartHeight, 0])
  
    // Helper function for our dates later
    const parseDate = d3.timeParse("%Y")
  
    // We need to plot x and y coordinates for our line
    const line = d3
      .line()
      .x(d => xPositionScale(d.Year))
      .y(d => yPositionScale(d.Refugees))
  
    d3.csv("../data/russian-refugees.csv")
      .then(ready)
      .catch(function (error) {
        console.log("Failed with", error)
      })
  
    function ready(datapoints) {
      // Convert our data to the right types
      datapoints.forEach(function (d) {
        d.Year = parseDate(d.Year)
        d.Refugees = +d.Refugees
      })

  
      // Update the scales
      const maxRefugees = d3.max(datapoints, d => d.Refugees)
      yPositionScale.domain([0, maxRefugees]).nice()
      xPositionScale.domain(d3.extent(datapoints, d => d.Year))


      // Draw the line
      const ourLine = svg
      .append("path")
      .datum(datapoints)
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("d", line)
      
      // Object to tell us how much to offset the line by
      const totalLength = ourLine.node().getTotalLength()
  
      // Implement transition
      ourLine
        .attr('stroke-dashoffset', totalLength)
        .attr('stroke-dasharray', totalLength)
      .transition()
      .duration(2000)
        .attr('stroke-dashoffset', 0)


      // Axes
      const yAxisGenerator = d3.axisLeft(yPositionScale)
      const yAxis = svg.append("g")
      .call(yAxisGenerator)
      .attr("class", "axis y-axis")
  
      const xAxisGenerator = d3.axisBottom(xPositionScale)
      const xAxis = svg.append("g")
      .call(xAxisGenerator)
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0, ${chartHeight})`)
  
      // Axes labels
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

    }
  })()
