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
  
    const margin = { top: 30, right: 50, bottom: 40, left: 60 }
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom
  
    function visualizeData(data) {
      console.log(data)
  
      // DATA FORMATTING
  
      // Filter our whole UNHCR dataset to just 2024
      const dataSubset = data.filter(function (d) {
        return d.Year === "2024"
      })
  
      dataSubset.forEach(function (d) {
        ;(d[`Asylum Seekers`] = +d[`Asylum Seekers`]), (d.Refugees = +d.Refugees)
      })
  
      const refugees = dataSubset.map(d => d.Refugees)
      const refugeesMax = d3.max(refugees)
      console.log(refugeesMax)
  
      const asylum = dataSubset.map(d => d[`Asylum Seekers`])
      const asylumMax = d3.max(asylum)
      console.log(asylumMax)
  
      // CHART MAKING
  
      // Make our SVG canvas
      var svg = d3
        .select("#scatterplot-int")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
  
      // Create x and y scales
      const xScale = d3.scaleLinear().domain([0, refugeesMax]).range([0, chartWidth])
  
      const yScale = d3.scaleLinear().domain([0, asylumMax]).range([chartHeight, 0])
  
      // Draw the plot
      const circles = svg
        .append("g")
        .selectAll("circle")
        .data(dataSubset)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return xScale(d[`Refugees`])
        })
        .attr("cy", function (d) {
          return yScale(d[`Asylum Seekers`])
        })
        .attr("r", 4)
        .attr("fill", "steelblue")
        .attr("opacity", 0.75)
        .attr("class", function (d) {
          return d["Country of Origin ISO"]
        })
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", handleClick)


      const xAxisGenerator = d3.axisBottom(xScale)
      const xAxis = svg
      .append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(xAxisGenerator)
  
      const yAxisGenerator = d3.axisLeft(yScale)
      const yAxis = svg
      .append("g")
      .call(yAxisGenerator)
  
      const xAxisLabel = xAxis
        .append("text")
        .attr("x", chartWidth / 2)
        .attr("y", margin.bottom - 5)
        .attr("fill", "black")
        .html("Number of refugees")
        .style("font-size", "small")
  
      const yAxisLabel = yAxis
        .append("text")
        .attr("x", -chartHeight / 2)
        .attr("y", -margin.left + 10)
        .attr("fill", "black")
        .text("Number of asylum seekers")
        .style("transform", "rotate(-90deg)")
        .style("text-anchor", "middle")
        .style("font-size", "small")
  
    //Annotations
    svg
      .append("text")
      .attr("x", xScale(28128) + 5)
      .attr("y", yScale(620074))
      .style("text-anchor", "start")
      .attr("class", "annotation")
      .html("Venezuela")
  
    svg
      .append("text")
      .attr("x", xScale(60044) - 5)
      .attr("y", yScale(147909))
      .style("text-anchor", "end")
      .attr("class", "annotation")
      .html("China")

      
    // Create an interaction where when clicking on any circle, the color of the circle changes to orange
    // and when you mouseOver the circle, the radius of the circle increases to 10
    // Don't forget to add some instructions to the circle object above
    // Hint: we'll need 3 functions

    function handleMouseOver(event, d) {
      d3.select(this).attr("r", 10)

      svg
      .append("text")
      .attr("x", xScale(d["Refugees"]))
      .attr("y", yScale(d["Asylum Seekers"])-8)
      .text(d["Country of Origin"])
      .attr("text-anchor", "middle")
      .attr("class", "tooltip annotation")

    }

    function handleMouseOut(event, d) {
      d3.select(this).attr("r", 4)

      svg.select(".tooltip").remove()
    }

    function handleClick(event, d) {
      if ((this.getAttribute("fill") == "steelblue") || (this.getAttribute("fill")=="rgb(70, 30, 180)")) {
      d3.select(this).transition().duration(200).attr("fill", "orange")
      } else {
      d3.select(this).transition().duration(200).attr("fill", "steelblue")
  }
  }

      
    }
  })()
  