// Immediately Invoked Function Expression to limit access to our 
// variables and prevent
// ((() => {

//   d3.csv('data/vaccine-stocks.csv').then(function(data) {
//     console.log(data)
//   });

//   console.log('Hello, world!');

// })());

// __________________________________________________________________________________________________

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 50, left: 60},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


// append the svg object to the body of the page
const svg1 = d3.select("#vis-svg-1")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`);

let svg2 = d3
.select("#vis-svg-1")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//colors for bar chart
var color = d3
.scaleOrdinal()
.domain(["Johnson & Johnson", "Novavax", "BioNTech", "Astrazeneca", "Inovio Pharmaceuticals", "Moderna"])
.range(["#FF7F50", "#21908dff", "#fde725ff", "#b46fd7", "#FF0000", "#FF00FF"]);


//Read the data
d3.csv("https://raw.githubusercontent.com/DS4200-Fall21-Sec02/project-vaccine-stocks-vn-si-ac-hp-mc-jc/main/data/vaccine-stocks.csv").then(function (data) {


  let dataAdjClose = data.filter(function(d){ return  (d.Measure == "Open")})
  // group the data: I want to draw one line per group
  const sumstat = d3.group(dataAdjClose, d => d.Name); // nest function allows to group the calculation per level of a factor

  function getDate(d) {
    return new Date(d.Date);
  }

  function getMeasure(d) {
    return d.Measure;
  }

  var measure = getMeasure(dataAdjClose[0])

  var minDate = getDate(dataAdjClose[0]),
    maxDate = getDate(dataAdjClose[dataAdjClose.length-1]);
  
  console.log(minDate)

  // Add X axis --> it is a date format
  const x1 = d3.scaleTime().domain([minDate, maxDate]).range([0, width]);

  svg1.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x1).ticks(5));

  //add title
  svg1.append("text")
  .attr("x", (width / 2))             
  .attr("y", 20 - (margin.top / 2))
  .attr("text-anchor", "middle")  
  .style("font-size", "18px")  
  .text(measure + " by Company"); //hard coded right now
 
  // Add Y axis
  const y1 = d3.scaleLinear()
  .domain([0, d3.max(dataAdjClose, function (d) { return +d.Value; })])
  .range([height, 0]);
  svg1.append("g")
  .call(d3.axisLeft(y1));

  // color palette for line chart
  const colors = d3.scaleOrdinal()
  .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#18119a'])

  let tooltip = d3.select("#vis-svg-1")
  .append("div")
  .attr('class', 'tooltip')
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")

  //hover for bar chart
  function hover(event, d) {
    d3.select(this).attr("fill", "red")
    console.log(d)
    let coords = d3.pointer(event, svg2)
    //Update Tooltip Position & value
    tooltip
    .style('top', coords[1] + 10 + 'px')
    .style('left', coords[0] + 10 + 'px')
    .text(d[0] + "\n" + parseInt(d[1]))
    .style("visibility", "visible")
  }

  // Draw the line
  let lines = svg1.selectAll(".line")
  .data(sumstat)
  .join("path")
  .attr("fill", "none")
  .attr("stroke", function (d) { return colors(d[0]) })
  .attr("stroke-width", 1.5)
  .attr("d", function (d) {
    return d3.line()
    .x(function (d) { return x1(getDate(d)); })
    .y(function (d) { return y1(+d.Value); })
    (d[1])
  })
  //sort of what we want but it fills incorrectly

  //   .on("mouseover", hover)
  // .on("mousemove", hover)
  // .on("mouseout", function () {
  //   d3.select(this).attr("fill", function (d) {return color(d[0]);})
  //   tooltip.style("visibility", "hidden");
  // });

  // create a list of keys
var keys = ["Moderna", "BioNTech", "Novavax", "Johnson & Johnson", "Inovio Pharmaceuticals", "Astrazeneca"]

// Add one rect in the legend for each name.
var size = 10
svg1.selectAll("myrect")
  .data(keys)
  .enter()
  .append("rect")
    .attr("x", 60)
    .attr("y", function(d,i){ return 50 + i*(size+10)}) 
    .attr("width", size)
    .attr("height", size)
    .style("fill", function(d){ return colors(d)})

// Add one label in the legend for each name.
svg1.selectAll("mylabels")
  .data(keys)
  .enter()
  .append("text")
    .attr("x", 60 + size*1.2)
    .attr("y", function(d,i){ return 50 + i*(size+10) + (size/2)}) 
    .style("fill", function(d){ return colors(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")


  let dataVol = data.filter(function(d){ return  (d.Measure == "Volume")})
  let dataNest = d3.group(dataVol, d => d.Name)
  let dataMap = new Map()

  let sum1 = 0.0;
  let sum2 = 0.0;
  let sum3 = 0.0;
  let sum4 = 0.0;
  let sum5 = 0.0;
  let sum6 = 0.0;

  for (let i = 0; i < 496; i++) {
    sum1 += dataNest.get("BioNTech")[i].Value / 496
    sum2 += dataNest.get("Novavax")[i].Value / 496
    sum3 += dataNest.get("Johnson & Johnson")[i].Value / 496
    sum4 += dataNest.get("Astrazeneca")[i].Value / 496
    sum5 += dataNest.get("Moderna")[i].Value / 496
    sum6 += dataNest.get("Inovio Pharmaceuticals")[i].Value / 496
  }

  dataMap.set("BioNTech", sum1)
  dataMap.set("Novavax", sum2)
  dataMap.set("Johnson & Johnson", sum3)
  dataMap.set("Astrazeneca", sum4)
  dataMap.set("Moderna", sum5)
  dataMap.set("Inovio Pharmaceuticals", sum6)

  console.log(dataMap)

  let x2 = d3.scaleBand()
  .domain(dataMap.keys())
  .range([0, width])
  .padding([(0.05)])

  svg2
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x2))
  .call((g) =>
      g
      .append("text")
      .attr("x", width)
      .attr("y", margin.bottom - 4)
      .attr("fill", "currentColor")
      .attr("text-anchor", "end")
  );

  svg2.append("text")
  .attr("x", (width / 2))             
  .attr("y", 20 - (margin.top / 2))
  .attr("text-anchor", "middle")  
  .style("font-size", "18px")  
  .text("Total Volume by Company");

  let y2 = d3
  .scaleLinear()
  .domain([0, d3.max(dataMap.values())])
  .range([height, 0]);

  svg2
  .append("g")
  .call(d3.axisLeft(y2))
  .call((g) =>
      g
      .append("text")
      .attr("x", -margin.left)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text()
  );
  

  let bars = svg2.append("g")
  .selectAll("rect")
  .data(dataMap)
  .join("rect")
  .attr("transform", d => `translate(${x2(d[0]) + x2.bandwidth() / 4}, ${y2(d[1])})`)
  .attr("width", x2.bandwidth() / 2)
  .attr("height", d => height - y2(d[1]))
  .style("fill", function (d) {
    return color(d[0]);
  })
  .on("mouseover", hover)
  .on("mousemove", hover)
  .on("mouseout", function () {
    d3.select(this).attr("fill", function (d) {return color(d[0]);})
    tooltip.style("visibility", "hidden");
  });

  //Brushing Code---------------------------------------------------------------------------------------------

  // let brush1 = d3.brush();
  // let brush2 = d3.brush();
  //
  // svg1
  // .call(
  //     brush1                // Add the brush feature using the d3.brush function
  //     .extent([[0, 0], [width, height]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
  //     .on("start brush", updateChart1) // Each time the brush selection changes, trigger the 'updateChart' function
  // )
  //
  // svg2
  // .call(
  //     brush2                // Add the brush feature using the d3.brush function
  //     .extent([[0, 0], [width, height]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
  //     .on("start brush", updateChart2) // Each time the brush selection changes, trigger the 'updateChart' function
  // )
  //
  // function updateChart1(brushEvent) {
  //   if (brushEvent === null) {
  //     return;
  //   }
  //   let company = [];
  //   lines.data(sumstat)
  //   .classed("selected", function (d) {
  //     i => console.log(brushEvent, d[0], y1(d[1].get(i).Value))
  //     if (isBrushed(brushEvent, x1(d[0]), i => y1(d[1].get(i).Value))) {
  //       company.push(d[0]);
  //       return true;
  //     }
  //   });
  //
  //   bars.classed("selected", function (d) {
  //     return company.includes(d[0])
  //   });
  // }
  //
  // function updateChart2(brushEvent) {
  //   if (brushEvent === null) {
  //     return;
  //   }
  //   let company = [];
  //   bars
  //   .classed("selected", function (d) {
  //     console.log(brushEvent, x2(d[0]), y2(d[1]))
  //     if (isBrushed(brushEvent, x2(d[0]), y2(d[1]))) {
  //       company.push(d[0]);
  //       return true;
  //     }
  //   });
  //
  //   bars.classed("selected", function (d) {
  //     return company.includes(d[0])
  //   });
  // }
  //
  // function isBrushed(brushEvent, cx, cy) {
  //   if(brushEvent.selection !== null) {
  //     let x0 = brushEvent.selection[0][0];
  //     let x1 = brushEvent.selection[1][0];
  //     let y0 = brushEvent.selection[0][1];
  //     let y1 = brushEvent.selection[1][1];
  //     return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
  //   }}
})


