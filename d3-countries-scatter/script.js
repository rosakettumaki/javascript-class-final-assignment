(function () {
  const margin = { top: 20, right: 50, bottom: 50, left: 50 };

  const width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // You'll probably need to edit this one
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const colorScale = d3.scaleOrdinal().range(d3.schemeAccent);

  const xPositionScale = d3.scaleLinear().domain([0, 80000]).range([0, width]);
  const yPositionScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

  // Read in some external data. When we're done, run the function 'ready'
  d3.csv("countries.csv")
    .then(ready)
    .catch(function (error) {
      console.log("Failed with", error);
    });

  function ready(datapoints) {
    console.log("Data is", datapoints);

    svg
      .selectAll("circle")
      .data(datapoints)
      .enter()
      .append("circle")
      .attr("cx", (d) => xPositionScale(d.gdp_per_capita))
      .attr("cy", (d) => yPositionScale(d.life_expectancy))
      .attr("fill", (d) => colorScale(d.continent))
      .attr("opacity", 0.5)
      .attr("r", 0)
      .transition()
      .duration(2000)
      .ease(d3.easeElastic)
      .attr("r", 7);

    const yAxis = d3.axisLeft(yPositionScale);
    svg.append("g").attr("class", "axis y-axis").call(yAxis);

    const xAxis = d3.axisBottom(xPositionScale);
    svg
      .append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  }
})();
