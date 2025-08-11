;(function () {
  // Read in the data
  // Then make the chart using the data from the CSV we just loaded
  // If that doesn't work, log the error in the console
  d3.csv("../data/unhcr-usa.csv")
    .then(visualizeData)
    .catch(function (error) {
      console.log("Failed with", error)
    })

  const width = 800 //svg width
  const height = 500 //svg height

  const margin = { top: 30, right: 30, bottom: 30, left: 60 }
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom

  function visualizeData(data) {
    console.log(data)

    // DATA FORMATTING

    // Generally recommended to load in a dataset that's already subsetted...
    // But here a various ways to filter and alter data in JS

    // Filter our whole UNHCR dataset to just 2024
    const dataSubset = data.filter(function (d) {
      return d.Year === "2024"
    })

    // Sort our subsetted data by highest number of asylum seekers
    // Then subset the sorted dataset to the first five entries
    const asylum5 = dataSubset
      .sort(function (a, b) {
        return b[`Asylum Seekers`] - a[`Asylum Seekers`]
      })
      .slice(0, 5)

    // Convert the asylum seeker value from a string to a number
    asylum5.forEach(function (d) {
      d["Asylum Seekers"] = +d["Asylum Seekers"]
    })


    console.log(asylum5)

    // CHART MAKING

    // Make our SVG canvas
    var svg = d3
      .select("#bar-chart")
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
      .padding(0.2) // check out the chart without this

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(asylum5, function (d) {
          return d[`Asylum Seekers`]
        }),
      ])
      .range([chartHeight, 0])

    // Draw the plot
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

    const xAxis = svg
    .append("g")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(d3.axisBottom(xScale))

    const yAxis = svg
    .append("g")
    .call(d3.axisLeft(yScale))


    const yAxisLabel = yAxis
      .append("text")
      .attr("x", -chartHeight / 2)
      .attr("y", -margin.left + 10)
      .attr("fill", "black")
      .text("Number of asylum seekers")
      .style("transform", "rotate(-90deg)")
      .style("text-anchor", "middle")
      .style("font-size", "small")
  }
})()
