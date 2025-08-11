;(function () {
    const rectColors = ["yellowgreen", "cornflowerblue", "seagreen", "slateblue"]
  
    const width = 500
    const height = 200
  
    const svg = d3.select("#interaction-3").append("svg").attr("width", width).attr("height", height)
  
    // create and bind data to our rects
    const rects = svg
      .selectAll(".rect")
      .data(rectColors)
      .join("rect")
      .attr("height", 100)
      .attr("width", 100)
      .attr("x", (d, i) => i * 110)
      .attr("fill", "lightgrey")
      .on("click", handleClick)
  

  


    function handleClick(event, d) {
        if ((this.getAttribute("fill") == "lightgrey") || (this.getAttribute("fill")=="rgb(211, 211, 211)")) {
            d3.select(this).attr("fill", d)
        } else {
            d3.select(this).attr("fill", "lightgrey")
        }
    }

  })()
  