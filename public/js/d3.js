/**
 * Created by G on 14-10-2016.
 */

function d3_bar() {
   var bardata = [20, 30, 45, 15];
   var height = 400,
      width = 600,
      barWidth = 50,
      barOffset= 5;

   d3.select('#chart6')
      .append('svg')
      .attr({
         width: width,
         height: height
      })
      .style('background', '#C9D7D6')
      .selectAll('rect').data(bardata)
      .enter().append('rect')
      .attr({
         x: function (d, index) {
            return index * (barWidth + barOffset);
         },
         y: function (d, index) {
            return height - d;
         },
         width: barWidth,
         height: function (d) {
            return d;
         },
         fill: '#C61C6F'
      })
}


function d3_svg() {
   d3.select('#chart5')
     .append('svg')
     .attr({
        id: 'd3_svg_chart',
        width: 600,
        height: 400
     })
     .style({
        background: '#93A1A1'
     })
     .append('rect')
      .attr({
         width: 200,
         height: 200,
         x: 200,
         y: 100,
         fill: '#CB4B19'
      })
   d3.select('#d3_svg_chart')
      .append('circle')
      .attr({
         cx: 300,
         cy: 300,
         r: 20,
         fill: '#840043'
      })
}

function d3_selection() {
   d3.select('#chart .item:nth-child(2)')
     .text('selected');
   d3.selectAll('#chart .item:nth-child(3n)')
     .html(function (data, index) {
        console.log(arguments);
        return '<strong>' + $(this).html() + '</strong>';
     });
   d3.select('#chart .item:nth-child(6)')
     .append('span')
     .style({'color': 'red', 'margin': '10px'})
     .html('I am appended');

   d3.select('#chart .item:nth-child(10)')
     .attr('class', 'highlight');

   d3.select('#chart .item:nth-child(1)')
     .classed('highlight', true);

   d3.select('#chart .item:nth-child(4)')
     .classed({
        'highlight': true,
        'item': false,
        'bigger': true
     });
}

function d3_data() {
   var size = 100;
   let myData = [
      {bg_color: '#A57706', f_weight: 200, label: 'item3'},
      {bg_color: '#BD3613', f_weight: 300, label: 'item3'},
      {bg_color: '#D11C24', f_weight: 400, label: 'item3'},
      {bg_color: '#C61C6F', f_weight: 500, label: 'item3'},
      {bg_color: '#595AB7', f_weight: 600, label: 'item3'}
   ];

   d3.selectAll('#chart2 .item')
     .data(myData)
     .style({
        'color': 'white',
        'background': function (d) {
           console.log(arguments);
           return d.bg_color;
        },
        'font-weight': function (d) {
           return d.f_weight;
        },
        'font-size': function (d) {
           size += 25;
           return size + '%';
        },
        'padding-left': function (d, index) {
           return index * 10 + 'px';
        }
     });

   d3.selectAll('#chart3').selectAll('div')
     .data(myData)
     .enter().append('div')
     .classed('item', true)
     .text(function (d, index) {
        return d.label + ' ' + index;
     })
     .style({
        'color': 'white',
        'background': function (d) {
           console.log(arguments);
           return d.bg_color;
        },
        'font-weight': function (d) {
           return d.f_weight;
        },
        'font-size': function (d) {
           size += 25;
           return size + '%';
        },
        'padding-left': function (d, index) {
           return index * 10 + 'px';
        }
     });
}

$(function () {
   console.log('D3 loaded');
   console.log($().jquery);

   d3_selection();
   d3_data();
   d3_svg();
   d3_bar();
});