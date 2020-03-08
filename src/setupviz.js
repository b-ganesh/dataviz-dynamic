
import * as d3 from 'd3'
export default function setupviz() {
const height = 700;
const width = 1070;
const margin = {
      top: 10,
      left: 10,
      right: 20,
      bottom: 20
    };

var svg = d3.select('#mymap').append('svg')
      .attr('width', margin.left + width + margin.right)
      .attr('height', margin.top + height + margin.bottom);

};