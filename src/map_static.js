import * as d3 from 'd3';
import legend from 'd3-svg-legend';
d3.legend = legend;
d3.legendColor = legend.legendColor;
d3.legendHelpers = legend.legendHelpers;

export default function chloro_map_static(data1, error) {
  if (error) throw error;

  const height = 600;
  const width = 1070;
  const margin = {top: 90, left: 10, right: 10, bottom: 10};

  var svg = d3
    .select('#mymap')
    .select('svg')
    .attr('height', height)
    .attr('width', width)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  var projection = d3.geoAlbersUsa();

  var path = d3.geoPath().projection(projection);

  var color = d3
    .scaleThreshold()
    .domain([20, 40, 60, 80, 100, 120, 140, 160])
    .range(d3.schemeGreens[7]);

  svg
    .selectAll('path')
    .data(data1.features)
    .enter()
    .append('path')
    .attr('stroke', 'black')
    .attr('fill', function(d) {
      return color((d.total = d.properties['lawtotal']));
    })
    .attr('d', path);

  svg
    .append('text')
    .text('Tracking Gun Trafficking in America')
    .attr('transform', `translate(${width / 2.2}, ${-60})`)
    .attr('text-anchor', 'middle')
    .attr('font-weight', 'bolder')
    .attr('font-size', 30);
  svg
    .append('text')
    .text('Movement of guns across the U.S., 2015')
    .attr('transform', `translate(${width / 2.2}, ${-30})`)
    .attr('text-anchor', 'middle')
    .attr('font-weight', 'bold')
    .attr('font-size', 14);
  svg
    .append('text')
    .text('Data source: FBI NICS Data')
    .attr('transform', `translate(${margin.bottom}, ${600})`)
    .attr('font-size', 12);

  svg
    .append('g')
    .attr('class', 'legendQuant')
    .attr('transform', 'translate(800,350)');

  var legend = d3
    .legendColor()
    .labelFormat(d3.format('.2f'))
    .labels(d3.legendHelpers.thresholdLabels)
    .scale(color);

  svg.select('.legendQuant').call(legend);
}
