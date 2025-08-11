;(function () {
  const rectColors = ["yellowgreen", "cornflowerblue", "seagreen", "slateblue"]

  const width = 500
  const height = 200

  const svg = d3.select("#interaction-2").append("svg").attr("width", width).attr("height", height)

  // create and bind data to our rects
  const rects = svg
    .selectAll(".rect")
    .data(rectColors)
    .join("rect")
    .attr("height", 100)
    .attr("width", 100)
    .attr("x", (d, i) => i * 110)
    .attr("fill", d => d)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)

  const tooltip = d3
    .select("#container")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid #ddd")
    .style("border-radius", "4px")
    .style("padding", "6px")
    .style("pointer-events", "none")
    .style("opacity", 0)

  function handleMouseOver(event, d) {
    // Show tooltip with the color name
    tooltip.style("opacity", 0.9)

    tooltip
      .html(d)
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 30 + "px")
  }

  function handleMouseOut(event, d) {
    // How would you turn the tooltip "off"?
    tooltip.style("opacity", 0)
  }


})()
