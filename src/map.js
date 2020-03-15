import * as d3 from 'd3';

function groupBy(data, accessor) {
  return data.reduce((acc, row) => {
    const key = accessor(row);
    acc[key] = (acc[key] || []).concat(row);
    return acc;
  }, {});
}

export default function chloro_map(data1, data2, error) {
  if (error) throw error;

  console.log(data2);

  const height = 500;
  const width = 1070;
  const margin = {top: 10, left: 10, right: 20, bottom: 20};

  var svg = d3.select('#mymap').select('svg');

  var projection = d3.geoAlbersUsa();

  var path = d3.geoPath().projection(projection);

  var color = d3
    .scaleThreshold()
    .domain([20, 40, 60, 80, 100, 120, 140, 160])
    .range(d3.schemeGreens[7]);

  // var voronoi = d3.voronoi().extent([
  //   [-1, -1],
  //   [width + 1, height + 1]
  // ]);
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
    .attr('transform', `translate(${margin.left}, ${30})`)
    .attr('font-weight', 'bolder')
    .attr('font-size', 30);
  svg
    .append('text')
    .text('Movement of guns across the U.S., 2015')
    .attr('transform', `translate(${margin.left}, ${60})`)
    .attr('font-weight', 'bold')
    .attr('font-size', 18);
  svg
    .append('text')
    .text('Data source: FBI NICS Data')
    .attr('transform', `translate(${margin.left}, ${80})`)
    .attr('font-size', 12);

  // svg
  //   .selectAll("circle")
  //   .data(data1.features)
  //   .enter()
  //   .append("circle")
  //   .attr("r", 5)
  //   .attr("transform", function(d) {
  //     return (
  //       "translate(" +
  //       projection([d.properties["long"], d.properties["lat"]]) +
  //       ")"
  //     );
  //   });
  const grouped = Object.values(groupBy(data2, d => d.origin));
  const statePositions = grouped.reduce((acc, row) => {
    row.forEach(d => {
      acc[d.destination] = [d.destination_lat, d.destination_long];
    });
    return acc;
  }, {});
  const stateShapes = data1.features.reduce((acc, row) => {
    if (!row.properties.state) {
      return acc;
      // console.log(row.properties);
    }
    // console.log(row.properties.state);
    acc[row.properties.state.toLowerCase()] = row;
    return acc;
  }, {});

  var trip1 = svg
    .selectAll('.trip')
    .data(grouped)
    .enter()
    .append('g')
    .attr('class', 'trip');
  // hover targets
  trip1
    .selectAll('path')
    .data(d => [d[0]].map(row => stateShapes[row.origin.toLowerCase()]).filter(d => d))
    .enter()
    .append('path')
    .attr('stroke', 'black')
    .attr('fill', d => 'red')
    .attr('fill-opacity', 0)
    .attr('d', path);

  trip1
    .selectAll('.trip-arc1')
    .data(d => d.filter(el => statePositions[el.origin] && el.origin !== el.destination && el.value))
    .enter()
    .append('path')
    .attr('class', 'trip-arc1')
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('d', function(d) {
      console.log(d);
      const geoLine = {
        type: 'LineString',
        coordinates: [statePositions[d.origin], statePositions[d.destination]],
      };
      // AM: left off here
      // if (!statePositions[d.origin]) {
      //   console.log(d.origin);
      // }
      // if (!statePositions[d.destination]) {
      //   console.log(d.destination);
      // }
      // [d[0].destination_long, d[0].destination_lat]
      // [d[0].origin_long, d[0].origin_lat],
      // console.log("ugh", d, geoLine);
      return path(geoLine);
    });
}

// take all the lines and make sure i seperately assign lines for each starting point
// figure out nested selections
