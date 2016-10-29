/**
 * Created by G on 24-10-2016.
 */

var graphs = {
   potentiometer: {
      n: 100,
      data: [],
      duration: 100,
      line: null,
      x: null,
      y: null,
      scale_y: {min: -1, max: 1},
      margin: {top: 20, right: 20, bottom: 20, left: 40}
   },
   motorPower: {
      n: 100,
      data: [],
      duration: 100,
      line: null,
      x: null,
      y: null,
      scale_y: {min: 0, max: 150},
      margin: {top: 20, right: 20, bottom: 20, left: 40}
   }
};

function createGraph(id) {
   var graph = graphs[id];

   for (var i = 0; i < graph.n; i++) {
      graph.data.push(0);
   }
   // console.log(potData);

   var svg = d3.select('#' + id + '_graph_container_id'),
      width = +svg.attr("width") - graph.margin.left - graph.margin.right,
      height = +svg.attr("height") - graph.margin.top - graph.margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + graph.margin.left + "," + graph.margin.top + ")");

   graph.x = d3.scaleLinear()
               .domain([0, graph.n - 1])
               .range([0, width]);

   graph.y = d3.scaleLinear()
               .domain([graph.scale_y.min, graph.scale_y.max])
               .range([height, 0]);

   graph.line = d3.line()
                  .x(function (d, i) {
                     return graph.x(i);
                  })
                  .y(function (d, i) {
                     return graph.y(d);
                  });

   g.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

   g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + graph.y(0) + ")")
    .call(d3.axisBottom(graph.x));

   g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(graph.y));

   g.append("g")
    .attr("clip-path", "url(#clip)")
    .append("path")
    .datum(graph.data)
    .attr('class', ' line')
    .attr("id", id + "_status_line_id")
    .transition()
    .duration(100)
    .ease(d3.easeLinear)
    .on('start', updateGraph);
};

function updateGraph() {
   var id = this.id.split('_')[0];
   var graph = graphs[id];

   // Push a new point onto the back.
   graph.data.push(currentValues[id]);

   // Redraw the line.
   d3.select(this)
     .attr("d", graph.line)
     .attr("transform", null);


   // Slide it to the left.
   d3.active(this)
     .transition()
     .attr("transform", "translate(" + graph.x(-1) + ",0)")
     .on('start', updateGraph);

   // Pop the old potData point off the front.
   graph.data.shift();

}