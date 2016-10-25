/**
 * Created by G on 24-10-2016.
 */
var random = potData = line = svg = x = y = g = null;
var margin = width = height = 0;

// $.getScript('//d3js.org/d3.v4.min.js', function () {
   var n = 400;
   potData = [];

   random = d3.randomNormal(0, .2);
   // potData = d3.range(n).map(random);
   for (var i = 0; i < n; i++) {
      potData.push(0);
   }
   // console.log(potData);

   svg = d3.select('#' + pot_graph_id),
      margin = {top: 20, right: 20, bottom: 20, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   x = d3.scaleLinear()
         .domain([0, n - 1])
         .range([0, width]);

   y = d3.scaleLinear()
         .domain([-1, 1])
         .range([height, 0]);

   line = d3.line()
            .x(function (d, i) {
               return x(i);
            })
            .y(function (d, i) {
               return y(d);
            });

   g.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

   g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + y(0) + ")")
    .call(d3.axisBottom(x));

   g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y));

   g.append("g")
    .attr("clip-path", "url(#clip)")
    .append("path")
    .datum(potData)
    .attr('class', ' line')
    .attr("id", "pot_status_line_id")
    .transition()
    .duration(100)
    .ease(d3.easeLinear)
    .on('start', updateGraph);
// });

function updateGraph() {

   // Push a new potData point onto the back.
   // console.log(typeof new_potData.value);
   potData.push(potCurrentValue);
   // potData.push(-1);

   // Redraw the line.
   // d3.select('#pot_status_line_id')
   d3.select(this)
     .attr("d", line)
     .attr("transform", null);


   // Slide it to the left.
   d3.active(this)
     .transition()
     .attr("transform", "translate(" + x(-1) + ",0)")
      .on('start', updateGraph);

   // Pop the old potData point off the front.
   potData.shift();

}