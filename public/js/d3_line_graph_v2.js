/**
 * Created by G on 24-10-2016.
 */
var potData = line = null;
var pot = {
   n: 100,
   duration: 100,
   line: null,
   x: null
};

function createGraph (id, options) {
   var n = 100;
   var data = [];

   for (var i = 0; i < n; i++) {
      data.push(0);
   }
   potData = data;
   // console.log(potData);

   var svg = d3.select('#' + id),
      margin = {top: 20, right: 20, bottom: 20, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   pot.x = d3.scaleLinear()
         .domain([0, n - 1])
         .range([0, width]);

   y = d3.scaleLinear()
         .domain([-1, 1])
         .range([height, 0]);

   pot.line = d3.line()
            .x(function (d, i) {
               return pot.x(i);
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
    .call(d3.axisBottom(pot.x));

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
};

function updateGraph() {

   // Push a new potData point onto the back.
   // console.log(typeof new_potData.value);
   potData.push(potCurrentValue);
   // potData.push(-1);

   // Redraw the line.
   // d3.select('#pot_status_line_id')
   d3.select(this)
     .attr("d", pot.line)
     .attr("transform", null);


   // Slide it to the left.
   d3.active(this)
     .transition()
     .attr("transform", "translate(" + pot.x(-1) + ",0)")
      .on('start', updateGraph);

   // Pop the old potData point off the front.
   potData.shift();

}