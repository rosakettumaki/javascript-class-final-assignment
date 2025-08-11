;(function () {
  const rectColors = ["yellowgreen", "cornflowerblue", "seagreen", "slateblue"]

  const width = 500
  const height = 200


  const svg = d3.select("#interaction-1")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

  // create and bind data to our rects
  const rects = svg
    .selectAll(".rect")
    .data(rectColors)
    .join("rect")
    .attr("height", 100)
    .attr("width", 100)
    .attr("x", (d, i) => i * 110)
    .attr("fill", "lightgrey")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)

  function handleMouseOver(event, d) {
    //write a command where when you hover over a rect,
    //it changes color to the color of the data that it is bound to
    d3.select(this).attr("fill", d)
    console.log(d)
    console.log(event)
  }

  function handleMouseOut(event, d) {
    d3.select(this).attr("fill", "lightgrey")
  }
})()
