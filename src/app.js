// const domReady = require('domready');

// domReady(() => {
//   // this is just one example of how to import data. there are lots of ways to do it!

import * as d3 from 'd3'
import chloro_map from './map'
import scrollama from 'scrollama'
import './stylesheets/main.css'
import setupviz from './setupviz'

// var main = d3.select("main");
var scrolly = d3.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var step = article.selectAll(".step");
var myd1;
var myd2;
// var myd;

// initialize the scrollama
var scroller = scrollama();

// resize function to set dimensions on load and on page resize

// generic window resize listener event
function handleResize() {
  // 1. update height of step elements
  var stepH = Math.floor(window.innerHeight * 0.75);
  step.style("height", stepH + "px");

  var figureHeight = window.innerHeight / 2;
  var figureMarginTop = (window.innerHeight - figureHeight) / 2;

  figure
    .style("height", figureHeight + "px")
    .style("top", figureMarginTop + "px");

  // 3. tell scrollama to update new element dimensions
  scroller.resize();
}

// scrollama event handlers
function handleStepEnter(response) {
  console.log(response);
  // response = { element, direction, index }

  // add color to current step only
  step.classed("is-active", function(d, i) {
    return i === response.index;
  });

  // update graphic based on step
  // figure.select("p").text(response.index + 1);
  if (response.index === 0) {
    // console.log(myd1);
    chloro_map(myd1, myd2);
  } 
  handleResize();

}

function setupStickyfill() {
  d3.selectAll(".sticky").each(function() {
    Stickyfill.add(this);
  });
}

function init() {
  setupStickyfill();

  // 1. force a resize on load to ensure proper dimensions are sent to scrollama
  handleResize();

  // 2. setup the scroller passing options
  // 		this will also initialize trigger observations
  // 3. bind scrollama event handlers (this can be chained like below)
  scroller
    .setup({
      step: "#scrolly article .step",
      offset: 0.33,
      debug: true
    })
    .onStepEnter(handleStepEnter);

  // setup resize event
  window.addEventListener("resize", handleResize);
}


Promise.all([
  './data/state_laws_2014.geojson',
  './data/clean_trafficking_data_coords.json'
  ].map(url => fetch(url).then(response => response.json())))
  .then(result => {
    const [data1, data2] = result;
    myd1 = data1;
    myd2 = data2;
    init();
    setupviz();
  })
  .catch(e => {
    console.log(e);
  });