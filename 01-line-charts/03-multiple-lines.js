;(function () {
    const margin = { top: 20, right: 50, bottom: 50, left: 50 }

    const width = 600
    const height = 400
    
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    const svg = d3
        .select("#multiple-lines")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    ///// What scales would we use?
    ///// We need colorScale, xPositionScale, yPositionScale
    const xPositionScale = d3.scaleTime().range([0, chartWidth]) 
    const yPositionScale = d3.scaleLinear().range([chartHeight, 0])
    const colorScale = d3.scaleOrdinal().range([d3.schemeCategory10])

    // Helper function
    const parseDate = d3.timeParse("%Y")

    const line = d3
        .line()
        .x(d => xPositionScale(d.Year))
        .y(d => yPositionScale(d["Refugees"]))

    d3.csv("../data/refugees-subset.csv")
        .then(ready)
        .catch(function (error) {
            console.log("Failed with", error)
        })

    function ready(datapoints) {
        datapoints.forEach(function (d) {
            d.Year = parseDate(d.Year)
            d["Refugees"] = +d["Refugees"]
        })

        // How would we update yPositionScale and xPositionScale?
        const maxRefugees = d3.max(datapoints, d => d["Refugees"])
        xPositionScale.domain(d3.extent(datapoints, d => d.Year))
        yPositionScale.domain([0, maxRefugees])

        // Group rows by country
        const grouped = d3.groups(datapoints, d => d["Country of Origin"])
        console.log(grouped)
        
        const chartLines = svg.selectAll("path")
            .data(grouped)
            .enter()
            .append("path")
            .attr("stroke", group => colorScale(group[0]))
            .attr("fill", "none")
            .attr("d", group => line(group[1]))

        const yAxisGenerator = d3.axisLeft(yPositionScale)
        const yAxis = svg
            .append("g")
            .attr("class", "axis y-axis")
            .call(yAxisGenerator)

        const xAxisGenerator = d3.axisBottom(xPositionScale)
        const xAxis = svg
            .append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxisGenerator)
    }
})()
