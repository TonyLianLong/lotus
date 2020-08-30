import * as dagreD3 from 'dagre-d3';
import * as d3 from "d3";
import { nodes, nodeDetailsDict } from './nodes.js';
import { JSONToNodes } from './graph-gen.js';
import { initSideBar, openSideBar } from './sidebar.js';
import { initToolBar } from './toolbar.js';
import './utils.js';
import './index.css';
import '@fortawesome/fontawesome-free/js/all.js';

// Create the input graph
var g = new dagreD3.graphlib.Graph()
    .setGraph({})
    .setDefaultEdgeLabel(function() { return {}; });

let [nodesArr, edgesArr] = JSONToNodes(g, nodes, nodeDetailsDict);

// Create the renderer
var render = new dagreD3.render();

// Set up an SVG group so that we can translate the final graph.
var svg = d3.select("svg"),
svgGroup = svg.append("g");

// Run the renderer. This is what draws the final graph.
render(d3.select("svg g"), g);

window.d3 = d3;
var zoom = d3.zoom().on("zoom", function() {
    svgGroup.attr("transform", d3.event.transform);
  });
svg.call(zoom);

let initialScale = Math.min(svg.property("width").baseVal.value / g.graph().width, svg.property("height").baseVal.value / g.graph().height) * 0.8; // TODO: calculate the ratio
svg.call(zoom.transform, d3.zoomIdentity.translate((svg.property("width").baseVal.value - g.graph().width * initialScale) / 2, 20).scale(initialScale));

svgGroup.selectAll("g .output .node").on('click', function (d) {
    let node = nodesArr[d];
    openSideBar(node);
});

initSideBar();
initToolBar();

// Expose the variables
window.svgGroup = svgGroup;
window.svg = svg;
