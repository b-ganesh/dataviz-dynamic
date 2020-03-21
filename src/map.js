import * as d3 from 'd3';
import legend from 'd3-svg-legend';
d3.legend = legend;
d3.legendColor = legend.legendColor;
d3.legendHelpers = legend.legendHelpers;

function groupBy(data, accessor) {
  return data.reduce((acc, row) => {
    const key = accessor(row);
    acc[key] = (acc[key] || []).concat(row);
    return acc;
  }, {});
}

export default function chloro_map_interactive(data1, data2, error) {
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
    .text(
      'Data source: FBI NICS Data. Note: Solid line indicates top state to receive guns from origin state.',
      'More than one solid line indicates a tie.',
    )
    // .text('More than one solid line indicates a tie.')
    .attr('transform', `translate(${width / 4.3}, ${-10})`)
    .attr('font-size', 12);
  // svg
  //   .append('text')
  //   .text('Note: solid lines indicate highest gun outflow')
  //   .attr('transform', `translate(${width / 3.0}, ${5})`)
  //   .attr('font-size', 12);

  svg
    .append('g')
    .attr('class', 'legendQuant')
    .attr('transform', 'translate(790,350)');

  var legend = d3
    .legendColor()
    .labelFormat(d3.format('.2f'))
    .labels(d3.legendHelpers.thresholdLabels)
    .title('Number of Gun Laws')
    .titleWidth(180)
    .scale(color);

  svg.select('.legendQuant').call(legend);

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
    }
    acc[row.properties.state.toLowerCase()] = row;
    return acc;
  }, {});

  var trip = svg
    .selectAll('.trip')
    .data(grouped)
    .enter()
    .append('g')
    .attr('class', d => `trip ${d[0].origin.replace(/\s/g, '_')}-group`);
  // hover targets
  trip
    .selectAll('path')
    .data(d => [d[0]].map(row => stateShapes[row.origin.toLowerCase()]).filter(d => d))
    .enter()
    .append('path')
    .attr('stroke', 'black')
    .attr('fill-opacity', 0)
    .attr('class', 'state-shape')
    .attr('d', path);

  trip
    .selectAll('.trip-arc')
    .data(d => d.filter(el => statePositions[el.origin] && el.origin !== el.destination && el.value))
    .enter()
    .append('path')
    .attr('class', 'trip-arc')
    .attr('d', function(d) {
      const geoLine = {
        type: 'LineString',
        coordinates: [
          [statePositions[d.origin][1], statePositions[d.origin][0]],
          [statePositions[d.destination][1], statePositions[d.destination][0]],
        ],
      };
      return path(geoLine);
    })
    .attr('stroke-width', d => {
      return ((d.origin === 'ALABAMA') & (d.destination === 'FLORIDA')) |
        ((d.origin === 'ALABAMA') & (d.destination === 'GEORGIA')) |
        ((d.origin === 'ARIZONA') & (d.destination === 'CALIFORNIA')) |
        ((d.origin === 'ARKANSAS') & (d.destination === 'TENNESSEE')) |
        ((d.origin === 'CALIFORNIA') & (d.destination === 'ARIZONA')) |
        ((d.origin === 'COLORADO') & (d.destination === 'CALIFORNIA')) |
        ((d.origin === 'CONNECTICUT') & (d.destination === 'FLORIDA')) |
        ((d.origin === 'CONNECTICUT') & (d.destination === 'NEW YORK')) |
        ((d.origin === 'DELAWARE') & (d.destination === 'MARYLAND')) |
        ((d.origin === 'FLORIDA') & (d.destination === 'NEW YORK')) |
        ((d.origin === 'GEORGIA') & (d.destination === 'NEW YORK')) |
        ((d.origin === 'IDAHO') & (d.destination === 'CALIFORNIA')) |
        ((d.origin === 'ILLINOIS') & (d.destination === 'MISSOURI')) |
        ((d.origin === 'INDIANA') & (d.destination === 'ILLINOIS')) |
        ((d.origin === 'IOWA') & (d.destination === 'ILLINOIS')) |
        ((d.origin === 'KANSAS') & (d.destination === 'MISSOURI')) |
        ((d.origin === 'KENTUCKY') & (d.destination === 'OHIO')) |
        ((d.origin === 'LOUISIANA') & (d.destination === 'TEXAS')) |
        ((d.origin === 'MAINE') & (d.destination === 'MASSACHUSETTS')) |
        ((d.origin === 'MICHIGAN') & (d.destination === 'ILLINOIS')) |
        ((d.origin === 'MINNESOTA') & (d.destination === 'ILLINOIS')) |
        ((d.origin === 'MISSISSIPPI') & (d.destination === 'TENNESSEE')) |
        ((d.origin === 'MISSOURI') & (d.destination === 'ILLINOIS')) |
        ((d.origin === 'MONTANA') & (d.destination === 'CALIFORNIA')) |
        ((d.origin === 'NEBRASKA') & (d.destination === 'IOWA')) |
        ((d.origin === 'NEVADA') & (d.destination === 'CALIFORNIA')) |
        ((d.origin === 'NEW HAMPSHIRE') & (d.destination === 'MASSACHUSETTS')) |
        ((d.origin === 'NEW JERSEY') & (d.destination === 'FLORIDA')) |
        ((d.origin === 'NEW MEXICO') & (d.destination === 'CALIFORNIA')) |
        ((d.origin === 'NEW YORK') & (d.destination === 'FLORIDA')) |
        ((d.origin === 'NORTH CAROLINA') & (d.destination === 'SOUTH CAROLINA')) |
        ((d.origin === 'NORTH DAKOTA') & (d.destination === 'MINNESOTA')) |
        ((d.origin === 'OHIO') & (d.destination === 'MICHIGAN')) |
        ((d.origin === 'OKLAHOMA') & (d.destination === 'CALIFORNIA')) |
        ((d.origin === 'OREGON') & (d.destination === 'CALIFORNIA')) |
        ((d.origin === 'PENNSYLVANIA') & (d.destination === 'NEW YORK')) |
        ((d.origin === 'SOUTH CAROLINA') & (d.destination === 'NORTH CAROLINA')) |
        ((d.origin === 'SOUTH DAKOTA') & (d.destination === 'NEBRASKA')) |
        ((d.origin === 'TENNESSEE') & (d.destination === 'ILLINOIS')) |
        ((d.origin === 'TEXAS') & (d.destination === 'LOUISIANA')) |
        ((d.origin === 'UTAH') & (d.destination === 'CALIFORNIA')) |
        ((d.origin === 'VERMONT') & (d.destination === 'NEW YORK')) |
        ((d.origin === 'VIRGINIA') & (d.destination === 'MARYLAND')) |
        ((d.origin === 'WASHINGTON') & (d.destination === 'CALIFORNIA')) |
        ((d.origin === 'WEST VIRGINIA') & (d.destination === 'MARYLAND')) |
        ((d.origin === 'WISCONSIN') & (d.destination === 'ILLINOIS')) |
        ((d.origin === 'WYOMING') & (d.destination === 'COLORADO'))
        ? '3px'
        : '1px';
    })

    .attr('stroke-dasharray', d => {
      return ((d.origin === 'ALABAMA') & (d.destination === 'FLORIDA')) |
        ((d.origin === 'ALABAMA') & (d.destination === 'GEORGIA')) |
        ((d.origin === 'ARIZONA') & (d.destination === 'CALIFORNIA')) |
        ((d.origin === 'ARKANSAS') & (d.destination === 'TENNESSEE')) |
        ((d.origin === 'CALIFORNIA') & (d.destination === 'ARIZONA')) |
        ((d.origin === 'COLORADO') & (d.destination === 'CALIFORNIA')) |
        ((d.origin === 'CONNECTICUT') & (d.destination === 'FLORIDA')) |
        ((d.origin === 'CONNECTICUT') & (d.destination === 'NEW YORK')) |
        ((d.origin === 'DELAWARE') & (d.destination === 'MARYLAND')) |
        ((d.origin === 'FLORIDA') & (d.destination === 'NEW YORK')) |
        ((d.origin === 'GEORGIA') & (d.destination === 'NEW YORK')) |
        ((d.origin === 'IDAHO') & (d.destination === 'CALIFORNIA')) |
        ((d.origin === 'ILLINOIS') & (d.destination === 'MISSOURI')) |
        ((d.origin === 'INDIANA') & (d.destination === 'ILLINOIS')) |
        ((d.origin === 'IOWA') & (d.destination === 'ILLINOIS')) |
        ((d.origin === 'KANSAS') & (d.destination === 'MISSOURI')) |
        ((d.origin === 'KENTUCKY') & (d.destination === 'OHIO')) |
        ((d.origin === 'LOUISIANA') & (d.destination === 'TEXAS')) |
        ((d.origin === 'MAINE') & (d.destination === 'MASSACHUSETTS')) |
        ((d.origin === 'MICHIGAN') & (d.destination === 'ILLINOIS')) |
        ((d.origin === 'MINNESOTA') & (d.destination === 'ILLINOIS')) |
        ((d.origin === 'MISSISSIPPI') & (d.destination === 'TENNESSEE')) |
        ((d.origin === 'MISSOURI') & (d.destination === 'ILLINOIS')) |
        ((d.origin === 'MONTANA') & (d.destination === 'CALIFORNIA')) |
        ((d.origin === 'NEBRASKA') & (d.destination === 'IOWA')) |
        ((d.origin === 'NEVADA') & (d.destination === 'CALIFORNIA')) |
        ((d.origin === 'NEW HAMPSHIRE') & (d.destination === 'MASSACHUSETTS')) |
        ((d.origin === 'NEW JERSEY') & (d.destination === 'FLORIDA')) |
        ((d.origin === 'NEW MEXICO') & (d.destination === 'CALIFORNIA')) |
        ((d.origin === 'NEW YORK') & (d.destination === 'FLORIDA')) |
        ((d.origin === 'NORTH CAROLINA') & (d.destination === 'SOUTH CAROLINA')) |
        ((d.origin === 'NORTH DAKOTA') & (d.destination === 'MINNESOTA')) |
        ((d.origin === 'OHIO') & (d.destination === 'MICHIGAN')) |
        ((d.origin === 'OKLAHOMA') & (d.destination === 'CALIFORNIA')) |
        ((d.origin === 'OREGON') & (d.destination === 'CALIFORNIA')) |
        ((d.origin === 'PENNSYLVANIA') & (d.destination === 'NEW YORK')) |
        ((d.origin === 'SOUTH CAROLINA') & (d.destination === 'NORTH CAROLINA')) |
        ((d.origin === 'SOUTH DAKOTA') & (d.destination === 'NEBRASKA')) |
        ((d.origin === 'TENNESSEE') & (d.destination === 'ILLINOIS')) |
        ((d.origin === 'TEXAS') & (d.destination === 'LOUISIANA')) |
        ((d.origin === 'UTAH') & (d.destination === 'CALIFORNIA')) |
        ((d.origin === 'VERMONT') & (d.destination === 'NEW YORK')) |
        ((d.origin === 'VIRGINIA') & (d.destination === 'MARYLAND')) |
        ((d.origin === 'WASHINGTON') & (d.destination === 'CALIFORNIA')) |
        ((d.origin === 'WEST VIRGINIA') & (d.destination === 'MARYLAND')) |
        ((d.origin === 'WISCONSIN') & (d.destination === 'ILLINOIS')) |
        ((d.origin === 'WYOMING') & (d.destination === 'COLORADO'))
        ? '0.0'
        : '6.0';
    });

  // .attr('stroke-width', d => {
  //   // console.log(d.origin === 'ALASKA');
  //   return (d.origin === 'CALIFORNIA') & (d.destination === 'NEW JERSEY') ? '3px' : '1px';
  // });
  // .attr('fill', 'none')
  // .attr('class', d => `.trip-arc-${d.origin}-group`);
}
