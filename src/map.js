
import * as d3 from 'd3'

export default function chloro_map(data1, data2, error) {
console.log(data2)
if (error) throw error;

const height = 500;
const width = 1070;
const margin = {
      top: 10,
      left: 10,
      right: 20,
      bottom: 20
    };

var svg = d3.select('#mymap').select('svg')

var projection = d3.geoAlbersUsa()
				   .translate([width/2, height/2])
           .scale([1090]);          

var path = d3.geoPath().projection(projection);

var color = d3.scaleThreshold()
    .domain([20, 40, 60, 80, 100, 120, 140, 160])
    .range(d3.schemeGreens[7]);
    
    svg.selectAll('path')
      .data(data1.features)
      .enter()
      .append('path')
      .attr("fill", function(d) { return color(d.total = d.properties['lawtotal']); })
      .attr('d', path)

    svg
      .append("text")
      .text("Tracking Gun Trafficking in America")
      .attr("transform", `translate(${margin.left}, ${30})`)
      .attr("font-weight", "bolder")
      .attr("font-size", 30);
    svg
      .append("text")
      .text(
        "Movement of guns across the U.S., 2015"
      )
      .attr("transform", `translate(${margin.left}, ${60})`)
      .attr("font-weight", "bold")
      .attr("font-size", 18);
    svg
      .append("text")
      .text("Data source: FBI NICS Data")
      .attr("transform", `translate(${margin.left}, ${80})`)
      .attr("font-size", 12);
      
    svg.selectAll("circle")
                .data(data1.features)
                .enter()
                .append("circle")
                .attr("r",5)
                .attr("transform", function(d) {return "translate(" + projection([d.properties['long'],d.properties['lat']]) + ")";});
    

    // svg.selectAll("path")
    // .data(data2)
    // .enter()
    // .append("path")
    // .attr("d", function(d) {
    //     var dx = d.destination_long - d.origin_long,
    //         dy = d.destination_lat - d.origin_lat,
    //         dr = Math.sqrt(dx * dx + dy * dy);
    //     return "M" + d.origin_long + "," + d.origin_lat + "A" + dr + "," + dr +
    // " 0 0,1 " + d.destination_long + "," + d.target.y;
    //     });


//     var links = []
//     console.log(data2.origin_long)
//     // for(var i=0, len=data2.length-1; i<len; i++){
//         // (note: loop until length - 1 since we're getting the next
//         //  item with i+1)
//         links.push({
//             type: "LineString",
//             coordinates: [
//                 [ data2.origin_long, data2.origin_lat ],
//                 [ data2.destination_long, data2.destination_lat ]
//             ]
//             });
//     console.log(links)
//         // }

//     // Standard enter / update 
// var pathArcs = svg.selectAll(".arc")
// .data(links);

// //enter
// pathArcs.enter()
// .append("path").attr({
//     'class': 'arc'
// }).style({ 
//     fill: 'none',
// });

// //update
// pathArcs.attr({
//     //d is the points attribute for this path, we'll draw
//     //  an arc between the points using the arc function
//     d: path
// })
// .style({
//     stroke: '#0000ff',
//     'stroke-width': '2px'
// });

    // svg.selectAll("path")
    // .data(data2)
    // .enter()
    // .append("path")
    // .datum({type: "LineString", coordinates: [['origin_long', 'origin_lat'], ['destination_long', 'destination_lat']]})
    // .attr("class", "route")
    // .attr("d", path);
    // console.log(path)
    // .style({
    //     stroke: '#0000ff',
    //     'stroke-width': '2px'
    // });

    svg.selectAll("path")
    .data(data2)
    .enter()
    .append("path")
    .attr('d', function(d) { return path({type: "LineString", coordinates: [[d.origin_long, d.origin_lat], [d.destination_long, d.destination_lat]]}) })
    .attr('stroke', 'red');


//     svg.selectAll('path')
//       .data(data2)
//       .enter()
//       .append('path')
//         .attr("fill", function(d) { return color(d.total = d.properties['lawtotal']); })
//       .attr('d', path)


// route.selectAll("path")
//                .datum({type: "LineString", coordinates: 
//                       [
//                           function(d) {
//                               if (d.where === origin){
//                                 return projection(d.lat,d.lon)
//                               }},
//                         function(d) {
//                             if (d.where === dest){
//                                 return projection(d.lat,d.lon)
//                               }}
//                       ]
//                       })
//                .attr("class", "route")
//                .attr("d", path);
//             });







      // function ready(error, us, airports, flights) {
      //   if (error) throw error;
      
      //   var airportByIata = d3.map(airports, function(d) { return d.iata; });
      
      //   flights.forEach(function(flight) {
      //     var source = airportByIata.get(flight.origin),
      //         target = airportByIata.get(flight.destination);
      //     source.arcs.coordinates.push([source, target]);
      //     target.arcs.coordinates.push([target, source]);
      //   });
      
      //   airports = airports
      //       .filter(function(d) { return d.arcs.coordinates.length; });
      
      //   svg.append("path")
      //       .datum(topojson.feature(us, us.objects.land))
      //       .attr("class", "land")
      //       .attr("d", path);
      
      //   svg.append("path")
      //       .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      //       .attr("class", "state-borders")
      //       .attr("d", path);
      
      //   svg.append("path")
      //       .datum({type: "MultiPoint", coordinates: airports})
      //       .attr("class", "airport-dots")
      //       .attr("d", path);
      
      //   var airport = svg.selectAll(".airport")
      //     .data(airports)
      //     .enter().append("g")
      //       .attr("class", "airport");
      
      //   airport.append("title")
      //       .text(function(d) { return d.iata + "\n" + d.arcs.coordinates.length + " flights"; });
      
      //   airport.append("path")
      //       .attr("class", "airport-arc")
      //       .attr("d", function(d) { return path(d.arcs); });
      
      //   airport.append("path")
      //       .data(voronoi.polygons(airports.map(projection)))
      //       .attr("class", "airport-cell")
      //       .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; });
      // }
      
      // function typeAirport(d) {
      //   d[0] = +d.longitude;
      //   d[1] = +d.latitude;
      //   d.arcs = {type: "MultiLineString", coordinates: []};
      //   return d;
      // }
      
      // function typeFlight(d) {
      //   d.count = +d.count;
      //   return d;
      // }
      

    
        };