// Immediately Invoked Function Expression to limit access to our 
// variables and prevent

var margin = {top: 10, right: 30, bottom: 50, left: 60},
    width = 460 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append svg object to the body of the page to house Scatterplot 1
let svg1, svg2 = d3
.select("#dataviz_brushScatter")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

((() => {

  d3.csv('data/vaccine-stocks.csv').then(function(data) {
    // line
    // bar
    let dataVol = data.filter(function(d){ return  (d.Measure == "Volume")})
    let dataNest = d3.group(dataVol, d => d.Day)

    console.log(dataNest);
  });

})());
