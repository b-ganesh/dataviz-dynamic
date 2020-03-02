// const domReady = require('domready');

// domReady(() => {
//   // this is just one example of how to import data. there are lots of ways to do it!
//   fetch('./data/state_laws_2014.geojson')
//     .then(response => response.json())
//     .then(data => myVis(data))
//     .catch(e => {
//       console.log(e);
//     });
// });

import * as d3 from 'd3'

var data_source = 'https://b-ganesh.github.io/dataviz-dynamic/data/state_laws_2014.geojson'
d3.json(
    data_source).then(
    function(json) {
      const height = 500;
      const width = 1020;
      const margin = {
        top: 10,
        left: 10,
        right: 20,
        bottom: 20
      };
  
var svg = d3.select('body').append('svg')
      .attr('width', margin.left + width + margin.right)
      .attr('height', margin.top + height + margin.bottom);

var projection = d3.geoAlbersUsa()
				   .translate([width/2, height/2])
           .scale([1090]);          

var path = d3.geoPath().projection(projection);
    
    svg.selectAll('path')
      .data(json.features)
      .enter()
      .append('path')
      .attr("fill", "#69b3a2")
      .attr('d', path)
  });



