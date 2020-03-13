import * as d3 from "d3";

export default function chloro_map(data1, data2, error) {
  if (error) throw error;

  console.log(data2);

  const height = 500;
  const width = 1070;
  const margin = {
    top: 10,
    left: 10,
    right: 20,
    bottom: 20
  };

  var svg = d3.select("#mymap").select("svg");

  var projection = d3.geoAlbersUsa();

  var path = d3.geoPath().projection(projection);

  var color = d3
    .scaleThreshold()
    .domain([20, 40, 60, 80, 100, 120, 140, 160])
    .range(d3.schemeGreens[7]);

  var voronoi = d3.voronoi().extent([
    [-1, -1],
    [width + 1, height + 1]
  ]);
  svg
    .selectAll("path")
    .data(data1.features)
    .enter()
    .append("path")
    .attr("stroke", "black")
    .attr("fill", function(d) {
      return color((d.total = d.properties["lawtotal"]));
    })
    .attr("d", path);

  svg
    .append("text")
    .text("Tracking Gun Trafficking in America")
    .attr("transform", `translate(${margin.left}, ${30})`)
    .attr("font-weight", "bolder")
    .attr("font-size", 30);
  svg
    .append("text")
    .text("Movement of guns across the U.S., 2015")
    .attr("transform", `translate(${margin.left}, ${60})`)
    .attr("font-weight", "bold")
    .attr("font-size", 18);
  svg
    .append("text")
    .text("Data source: FBI NICS Data")
    .attr("transform", `translate(${margin.left}, ${80})`)
    .attr("font-size", 12);

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

  const processedData = Object.keys(data2.origin).map((_, idx) => {
    return {
      origin: data2.origin[idx],
      destination: data2.destination[idx],
      value: data2.value[idx],
      origin_long: data2.origin_long[idx],
      origin_lat: data2.origin_lat[idx],
      destination_long: data2.destination_long[idx],
      destination_lat: data2.destination_lat[idx]
    };
  });

  var trip = svg
    .selectAll(".trip")
    .data(processedData)
    .enter()
    .append("g")
    .attr("class", "trip");

  trip
    .append("path")
    .attr("class", "trip-arc")
    .attr("d", function(d) {
      return path({
        type: "LineString",
        coordinates: [
          [d.origin_long, d.origin_lat],
          [d.destination_long, d.destination_lat]
        ]
      });
    });

  const smallerData = processedData.map(d => ({
    coords: [d.origin_long, d.origin_lat]
  }));
  console.log(smallerData);
  const projected = smallerData.map(d => {
    console.log(d, projection(d.coords));
    return projection(d.coords);
  });
  console.log(projected);
  const voronois = voronoi.polygons(projected);
  console.log(voronois);

  trip
    .append("path")
    .data(voronois)
    .attr("class", "trip-cell")
    .attr("fill", "black")
    .attr("fill-opacity", 0)
    .attr("d", function(d) {
      return d ? "M" + d.join("L") + "Z" : null;
    });

  function groupBy(data2, accessor) {
    return data2.reduce((acc, row) => {
      const key = accessor(row);
      acc[key] = (acc[key] || []).concat(row);
      return acc;
    }, {});
  }
  const grouped = Object.values(groupBy(data2, d => d.origin));
  console.log(grouped);
}

// take all the lines and make sure i seperately assign lines for each starting point
// figure out nested selections
