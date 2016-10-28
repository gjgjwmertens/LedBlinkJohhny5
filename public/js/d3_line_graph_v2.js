/**
 * Created by G on 24-10-2016.
 */
var potData = line = null;
var graphs = {potentiometer: {
   n: 100,
   data: [],
   duration: 100,
   line: null,
   x: null,
   y: null,
   margin: {top: 20, right: 20, bottom: 20, left: 40}
}};
// var pot = null;

function createGraph (id, options) {
   var pot = graphs[id];
   var graph_id = id;

   for (var i = 0; i < pot.n; i++) {
      pot.data.push(0);
   }
   // console.log(potData);

   var svg = d3.select('#' + id + '_graph_container_id'),
      width = +svg.attr("width") - pot.margin.left - pot.margin.right,
      height = +svg.attr("height") - pot.margin.top - pot.margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + pot.margin.left + "," + pot.margin.top + ")");

   pot.x = d3.scaleLinear()
         .domain([0, pot.n - 1])
         .range([0, width]);

   pot.y = d3.scaleLinear()
         .domain([-1, 1])
         .range([height, 0]);

   pot.line = d3.line()
            .x(function (d, i) {
               return pot.x(i);
            })
            .y(function (d, i) {
               return pot.y(d);
            });

   g.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

   g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + pot.y(0) + ")")
    .call(d3.axisBottom(pot.x));

   g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(pot.y));

   g.append("g")
    .attr("clip-path", "url(#clip)")
    .append("path")
    .datum(pot.data)
    .attr('class', ' line')
    .attr("id", id + "_status_line_id")
    .transition()
    .duration(100)
    .ease(d3.easeLinear)
    .on('start', updateGraph);
};

function updateGraph() {
   var id = this.id.split('_');
   var pot = graphs[id[0]];
   // var id = id.split('_');
// console.log(id);
   // Push a new potData point onto the back.
   // console.log(typeof new_potData.value);
   pot.data.push(potCurrentValue);
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
   pot.data.shift();

}