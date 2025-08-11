// ============================================================================
// SNAP Benefits Impact Visualization
// Clean, organized version of the bar chart showing families losing SNAP benefits
// ============================================================================

// Configuration
const CONFIG = {
  width: 900,
  height: 500,
  margin: { top: 30, right: 30, bottom: 100, left: 80 },
  colors: {
    bar: "#e74c3c",        // Red for negative impact
    hover: "#f39c12",      // Orange on hover
    text: "#2c3e50"        // Dark text color
  }
}

// Calculate chart dimensions
const chartWidth = CONFIG.width - CONFIG.margin.left - CONFIG.margin.right
const chartHeight = CONFIG.height - CONFIG.margin.top - CONFIG.margin.bottom

// Utility functions
const utils = {
  // Format numbers with commas for display
  formatNumber: (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  
  // Sort data by families affected (descending)
  sortByImpact: (data) => data.sort((a, b) => 
    b.Families_losing_some_or_all_SNAP_benefits_1000s - 
    a.Families_losing_some_or_all_SNAP_benefits_1000s
  )
}

// Main visualization function
async function createSNAPChart() {
  try {
    // Load and process data
    const rawData = await d3.csv("data/snap_cuts_state_impact_CLEAN_CSV.csv")
    const processedData = processData(rawData)
    
    // Create SVG container
    const svg = createSVGContainer()
    
    // Create scales
    const scales = createScales(processedData)
    
    // Draw chart elements
    drawBars(svg, processedData, scales)
    drawAxes(svg, scales)
    drawAxisLabels(svg, scales)
    
    console.log("SNAP chart created successfully!")
    
  } catch (error) {
    console.error("Error creating SNAP chart:", error)
  }
}

// Data processing
function processData(data) {
  // Convert string values to numbers
  data.forEach(d => {
    d.Families_losing_some_or_all_SNAP_benefits_1000s = 
      +d.Families_losing_some_or_all_SNAP_benefits_1000s
  })
  
  // Sort by impact and add formatted values
  const sortedData = utils.sortByImpact(data)
  sortedData.forEach(d => {
    d.formattedValue = utils.formatNumber(d.Families_losing_some_or_all_SNAP_benefits_1000s)
  })
  
  return sortedData
}

// Create SVG container
function createSVGContainer() {
  return d3.select("#chart-space")
    .append("svg")
    .attr("width", CONFIG.width)
    .attr("height", CONFIG.height)
    .append("g")
    .attr("transform", `translate(${CONFIG.margin.left}, ${CONFIG.margin.top})`)
}

// Create scales
function createScales(data) {
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.State))
    .range([0, chartWidth])
    .padding(0.3)
  
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Families_losing_some_or_all_SNAP_benefits_1000s)])
    .range([chartHeight, 0])
  
  return { xScale, yScale }
}

// Draw bars
function drawBars(svg, data, scales) {
  const { xScale, yScale } = scales
  
  svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", d => xScale(d.State))
    .attr("y", d => yScale(d.Families_losing_some_or_all_SNAP_benefits_1000s))
    .attr("width", xScale.bandwidth())
    .attr("height", d => chartHeight - yScale(d.Families_losing_some_or_all_SNAP_benefits_1000s))
    .attr("fill", CONFIG.colors.bar)
    .on("mouseover", (event, d) => handleMouseOver(event, d, svg, scales))
    .on("mouseout", (event, d) => handleMouseOut(event, d, svg))
}

// Draw axes
function drawAxes(svg, scales) {
  const { xScale, yScale } = scales
  
  // X-axis
  const xAxis = svg.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(d3.axisBottom(xScale))
  
  // Rotate x-axis labels for better readability
  xAxis.selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-45)")
  
  // Y-axis
  svg.append("g")
    .call(d3.axisLeft(yScale))
}

// Draw axis labels
function drawAxisLabels(svg, scales) {
  const { xScale, yScale } = scales
  
  // X-axis label
  svg.append("text")
    .attr("x", chartWidth / 2)
    .attr("y", chartHeight + CONFIG.margin.bottom - 10)
    .attr("fill", CONFIG.colors.text)
    .text("State")
    .style("font-size", "14px")
    .style("text-anchor", "middle")
  
  // Y-axis label
  svg.append("text")
    .attr("x", -chartHeight / 2)
    .attr("y", -CONFIG.margin.left + 15)
    .attr("fill", CONFIG.colors.text)
    .text("Families Losing SNAP Benefits (thousands)")
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
}

// Mouse over handler
function handleMouseOver(event, d, svg, scales) {
  const { xScale, yScale } = scales
  
  // Change bar color and cursor
  d3.select(event.currentTarget)
    .attr("fill", CONFIG.colors.hover)
    .style("cursor", "pointer")
  
  // Show tooltip
  svg.append("text")
    .attr("class", "tooltip")
    .attr("x", xScale(d.State) + xScale.bandwidth() / 2)
    .attr("y", yScale(d.Families_losing_some_or_all_SNAP_benefits_1000s) - 10)
    .text(`${d.formattedValue} families`)
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .attr("text-anchor", "middle")
}

// Mouse out handler
function handleMouseOut(event, d, svg) {
  // Restore bar color and cursor
  d3.select(event.currentTarget)
    .attr("fill", CONFIG.colors.bar)
    .style("cursor", "default")
  
  // Remove tooltip
  svg.select(".tooltip").remove()
}

// Initialize the chart when the page loads
document.addEventListener("DOMContentLoaded", createSNAPChart)
