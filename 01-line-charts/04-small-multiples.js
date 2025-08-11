;(function () {
    const margin = { top: 20, right: 50, bottom: 50, left: 50 }

    const width = 600
    const height = 200
    
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    const container = d3.select("#small-multiples")

    const colorScale = d3.scaleOrdinal().range(d3.schemeDark2)
    const xPositionScale = d3.scaleTime().range([0, chartWidth])
    const yPositionScale = d3.scaleLinear().range([chartHeight, 0])
    const parseDate = d3.timeParse("%Y")

    const line = d3
        .line()
        .x(d => xPositionScale(d.Year))
        .y(d => yPositionScale(d["Refugees"]))

    d3.csv("../data/refugees-multiples.csv")
        .then(ready)
        .catch(function (error) {
            console.log("Failed with", error)
        })

    function ready(datapoints) {
        datapoints.forEach(function (d) {
            d.Year = parseDate(d.Year)
            d["Refugees"] = +d["Refugees"]
        })

        // Update the scales
        // You could also try putting this inside of the .each
        const maxRefugees = d3.max(datapoints, d => d["Refugees"])
        yPositionScale.domain([0, maxRefugees]).nice()
        xPositionScale.domain(d3.extent(datapoints, d => d.Year))

        const grouped = d3.group(datapoints, d => d["Country of Origin"])
        console.log(grouped)


        container
            .selectAll("div")
            .data(grouped)
            .enter("div")
            .each(function (group) {
                const groupName = group[0]
                const datapoints = group[1]
                const container = d3.select(this)

                // Add a chart title element for each chart in the div container
                container
                .append("h3")
                .text(`Refugee flow to the United States from ${groupName} since 2000`)

                // Add a new SVG canvas for each chart
                const svg = container
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`)

                // Add a line for each chart
                // Why datum and not data?
                svg.append("path")
                    .datum(datapoints)
                    .attr("stroke", colorScale(groupName))
                    .attr("fill", "none")
                    .attr("d", line)

                // Simplify the yAxis a bit with .ticks()
                const yAxisGenerator = d3.axisLeft(yPositionScale).ticks(3) 
                const yAxis = svg
                    .append("g")
                    .attr("class", "axis y-axis")
                    .call(yAxisGenerator)

                const xAxisGenerator = d3.axisBottom(xPositionScale)
                const xAxis = svg
                    .append("g")
                    .attr("class", "axis x-axis")
                    .attr("transform", "translate(0," + chartHeight + ")")
                    .call(xAxisGenerator)
            })
    }
})()
