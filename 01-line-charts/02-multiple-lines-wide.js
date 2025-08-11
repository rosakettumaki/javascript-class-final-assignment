;(function () {
    const margin = { top: 20, right: 50, bottom: 50, left: 60 }

    const width = 600
    const height = 400

    const chartHeight = height - margin.top - margin.bottom
    const chartWidth = width - margin.left - margin.right

    const svg = d3
        .select("#multiple-lines-wide")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    const colorScale = d3.scaleOrdinal().range(d3.schemeDark2)
    const xPositionScale = d3.scaleTime().range([0, chartWidth])
    const yPositionScale = d3.scaleLinear().range([chartHeight, 0])
    const parseDate = d3.timeParse("%Y")

    const lineAfghanistan = d3
        .line()
        .x(d => xPositionScale(d.Year))
        .y(d => yPositionScale(d.Afghanistan))

    const lineSudan = d3
        .line()
        .x(d => xPositionScale(d.Year))
        .y(d => yPositionScale(d.Sudan))

    const lineMyanmar = d3
        .line()
        .x(d => xPositionScale(d.Year))
        .y(d => yPositionScale(d.Myanmar))

    const lineSomalia = d3
        .line()
        .x(d => xPositionScale(d.Year))
        .y(d => yPositionScale(d.Somalia))




    

    d3.csv("../data/refugees-wide.csv")
        .then(ready)
        .catch(function (error) {
            console.log("Failed with", error)
        })

    function ready(datapoints) {
        // Try it without this and see what happens!
        datapoints.forEach(function (d) {
            d.Year = parseDate(d.Year)
        })

        // Update the scales
        yPositionScale.domain([0, 80000])
        xPositionScale.domain(d3.extent(datapoints, d => d.Year))

        // Draw the paths for each country
        svg.append("path")
            .datum(datapoints)
            .attr("stroke", colorScale("Afghanistan"))
            .attr("fill", "none")
            .attr("d", lineAfghanistan)

        svg.append("path")
            .datum(datapoints)
            .attr("stroke", colorScale("Sudan"))
            .attr("fill", "none")
            .attr("d", lineSudan)

        svg.append("path")
            .datum(datapoints)
            .attr("stroke", colorScale("Somalia"))
            .attr("fill", "none")
            .attr("d", lineSomalia)

        svg.append("path")
            .datum(datapoints)
            .attr("stroke", colorScale("Myanmar"))
            .attr("fill", "none")
            .attr("d", lineMyanmar)

        // Draw the axes
        const yAxisGenerator = d3.axisLeft(yPositionScale)
        const yAxis = svg
            .append("g")
            .attr("class", "axis y-axis")
            .call(yAxisGenerator)

        const xAxisGenerator = d3.axisBottom(xPositionScale)
        const xAxis = svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0,${chartHeight})`)
            .call(xAxisGenerator)

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
