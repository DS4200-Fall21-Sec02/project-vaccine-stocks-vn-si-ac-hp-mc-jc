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

//Read the data
d3.csv("data/vaccine-stocks.csv").then(function (data) {


  let dataAdjClose = data.filter(function(d){ return  (d.Measure == "Adj_Close")})
  // group the data: I want to draw one line per group
  const sumstat = d3.group(dataAdjClose, d => d.Name); // nest function allows to group the calculation per level of a factor

  // Add X axis --> it is a date format
  const x = d3.scaleLinear()
    //.domain(d3.extent(data, function (d) { return d.Day; }))
    .domain([0,500]) // this is hardcoded (for now)
    .range([0, width]);
  svg1.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  const y = d3.scaleLinear()
    //.domain([0, d3.max(data, function (d) { return +d.Value; })])
    .domain([0, d3.max(dataAdjClose, function (d) { return +d.Value; })])
    .range([height, 0]);
  svg1.append("g")
    .call(d3.axisLeft(y));

  // color palette
  const colors = d3.scaleOrdinal()
    .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33'])
  // Draw the line
  svg1.selectAll(".line")
    .data(sumstat)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", function (d) { return colors(d[0]) })
    .attr("stroke-width", 1.5)
    .attr("d", function (d) {
      return d3.line()
        .x(function (d) { return x(d.Day); })
        .y(function (d) { return y(+d.Value); })
        (d[1])
    })

})





let svg2 = d3
.select("#vis-svg-1")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var color = d3
.scaleOrdinal()
.domain(["Johnson & Johnson", "Novavax", "BioNTech", "Astrazeneca", "Inovio Pharmaceuticals", "Moderna"])
.range(["#FF7F50", "#21908dff", "#fde725ff", "#b46fd7", "#FF0000", "#FF00FF"]);






//Read the data
d3.csv("data/vaccine-stocks.csv").then(function(data) {
    // line
    // bar
    let dataVol = data.filter(function(d){ return  (d.Measure == "Volume")})
    let dataNest = d3.group(dataVol, d => d.Name)

    console.log(dataVol)
    console.log(dataNest)

    let dataMap = new Map()

    let sum1 = 0.0;
    for (let i = 0; i < 496; i++) {
      sum1 += dataNest.get("BioNTech")[i].Value / 496
    }
    dataMap.set("BioNTech", sum1)

    let sum2 = 0.0;
    for (let i = 0; i < 496; i++) {
      sum2 += dataNest.get("Novavax")[i].Value / 496
    }
    dataMap.set("Novavax", sum2)

    let sum3 = 0.0;
    for (let i = 0; i < 496; i++) {
      sum3 += dataNest.get("Johnson & Johnson")[i].Value / 496
    }
    dataMap.set("Johnson & Johnson", sum3)

    let sum4 =0.0;
    for (let i = 0; i < 496; i++) {
      sum4 += dataNest.get("Astrazeneca")[i].Value / 496
    }
    dataMap.set("Astrazeneca", sum4)

    let sum5 = 0.0;
    for (let i = 0; i < 496; i++) {
      sum5 += dataNest.get("Moderna")[i].Value / 496
    }
    dataMap.set("Moderna", sum5)

    let sum6 = 0.0;
    for (let i = 0; i < 496; i++) {
      sum6 += dataNest.get("Inovio Pharmaceuticals")[i].Value / 496
    }
    dataMap.set("Inovio Pharmaceuticals", sum6)

    console.log(dataMap)

    let x = d3.scaleBand()
    .domain(data.map(d => d.Name))
    .range([0, width])
    .padding([(0.05)])

    svg2
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .call((g) =>
        g
        .append("text")
        .attr("x", width)
        .attr("y", margin.bottom - 4)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
    );

    let y = d3
    .scaleLinear()
    .domain([0, d3.max(dataVol, d => d.Value)])
    .range([height, 0]);

    svg2
    .append("g")
    .call(d3.axisLeft(y))
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
    .data(dataVol)
    .join("rect")
    .attr("transform", d => `translate(${x(d.Name)},0)`)
    .attr("width", x.bandwidth() / 2)
    .attr("height", d => height - y(d.Value))
    .style("fill", function (d) {
      return color(d.Name);
    })
  })


