// Chart position SVG wrapper
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 50,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var thefigure = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import STATS data 
d3.csv("/assets/data/data.csv").then(function(thetable) {
// Parse data integer
    thetable.forEach(function(STATS) {
        STATS.healthcare = +STATS.healthcare;
        STATS.poverty = +STATS.poverty;    });

    // Create scaling    
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(thetable, va => va.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(thetable, va => va.healthcare)])
        .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);  

    // Add axis
    thefigure.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    thefigure.append("g")
        .call(leftAxis);
    
        // Add points
    var thepoints = thefigure.selectAll("circle")
        .data(thetable)
        .enter()
        .append("circle")
        .attr("cx", va => xLinearScale(va.poverty))
        .attr("cy", va => yLinearScale(va.healthcare))
        .attr("r", 11)
        .attr("fill", "lightblue")
        thefigure.append("text")
        .style("text-anchor", "middle").style("font-size", "7px")
        .selectAll("tspan")
        .data(thetable)
        .enter()
        .append("tspan")
        .attr("x", function(STATS) {return xLinearScale(STATS.poverty); })
        .attr("y", function(STATS) {return yLinearScale(STATS.healthcare); })
        .text(function(STATS)      {return STATS.abbr}) ;

    // Create axes labels  
    thefigure.append("text")
    .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 20})`)
    .text("In Poverty");
    thefigure.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 1.5))
    .attr("dy", "14")
    .text("Patients w/o Healthcare");        });