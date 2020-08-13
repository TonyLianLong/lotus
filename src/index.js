import * as dagreD3 from 'dagre-d3';
import * as d3 from "d3";
import css from './index.css';

// Create the input graph
var g = new dagreD3.graphlib.Graph()
  .setGraph({})
  .setDefaultEdgeLabel(function() { return {}; });

String.prototype.hashCode = function() {
  var hash = 0;
  if (this.length == 0) {
      return hash;
  }
  for (var i = 0; i < this.length; i++) {
      var char = this.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; // Convert to 32bit integer
  }
  if (hash < 0) {
    return -hash;
  }
  return hash;
}

const nodes = {
  "data": {"type": "data", "to": "conv1"},
  "conv1": {"type": "conv", "data": { "filter": [32, 3, 3, 3] }, "to": "conv2"},
  "conv2": {"type": "conv", "data": { "filter": [32, 32, 1, 1] }, "to": "flatten"},
  "flatten" : {"type": "flatten", "to": "linear"},
  "linear" : {"type": "linear", "data": { "width": 4096 }, "to": "softmax"},
  "softmax" : {"type": "softmax", "to": "out"},
  "out": {"type": "out"}
};

const colorPalette = ["#284376", "#42875B", "#353531", "#694434", "#5B5351"];

const nodeDetailsDict = {
  "conv": (data) => ({"name": "卷积层", "desc": `Filter (${data.filter.join(",")})`, "color": "#816C61"}),
  "data": {"name": "数据输入", "color": "#016FB9"},
  "out": "数据输出",
  "flatten": "打平",
  "linear": "线性运算",
  "softmax": "Softmax"
};

for (let nodeDetailsKey of Object.keys(nodeDetailsDict)) {
  if (typeof nodeDetailsDict[nodeDetailsKey] == "string") {
    console.log(nodeDetailsKey.hashCode() % colorPalette.length);
    nodeDetailsDict[nodeDetailsKey] = {
      "name": nodeDetailsDict[nodeDetailsKey],
      "color": colorPalette[nodeDetailsKey.hashCode() % colorPalette.length]
    }
  }
}

console.log("nodeDetailsDict:", nodeDetailsDict);

let nodesArr = [];
let edgesArr = [];
for (let nodeItemKey of Object.keys(nodes)) {
  let node = nodes[nodeItemKey];
  node["name"] = nodeItemKey;
  let i = nodesArr.length;
  node["index"] = i;
  nodesArr.push(node);

  if (typeof node.to == "string") {
    edgesArr.push([nodeItemKey, node.to]);
  } else if(Array.isArray(node.to)) {
    for (let toItem of node.to) {
      edgesArr.push([nodeItemKey, toItem]);
    }
  }
  
  let name, desc, color;
  if (typeof nodeDetailsDict[node.type] == "function") {
    let ret = nodeDetailsDict[node.type](node.data);
    name = ret.name;
    desc = ret.desc;
    color = ret.color;
  } else {
    let ret = nodeDetailsDict[node.type];
    name = ret.name;
    color = ret.color;
  }
  if (!name) {
    throw new Error(`The name of type ${node.type} is not defined`);
  }
  
  if (desc) {
    g.setNode(i, {
      labelType: "html",
      label: `<name style="background-color: ${color}">${name}</name><desc>${desc}</desc>`,
      class: "node-item",
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 5
    });
  } else {
    g.setNode(i, {
      labelType: "html",
      label: `<name style="background-color: ${color}">${name}</name>`,
      class: "node-item",
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0
    });
  }
}

console.log("edgesArr", edgesArr);

window.nodesArr = nodesArr;
window.edgesArr = edgesArr;

g.nodes().forEach(function(v) {
  var node = g.node(v);
  // Round the corners of the nodes
  node.rx = node.ry = 5;
});

for (let edge of edgesArr) {
  let startEdge = edge[0];
  let endEdge = edge[1];
  if(!nodes[startEdge]) {
    throw new Error(`Edge ${startEdge} not found.`)
  }
  if(!nodes[endEdge]) {
    throw new Error(`Edge ${endEdge} not found.`)
  }
  let startIndex = nodes[startEdge].index;
  let endIndex = nodes[endEdge].index;
  g.setEdge(startIndex, endIndex);
}

// Create the renderer
var render = new dagreD3.render();

// Set up an SVG group so that we can translate the final graph.
var svg = d3.select("svg"),
svgGroup = svg.append("g");

// Run the renderer. This is what draws the final graph.
render(d3.select("svg g"), g);

// Center the graph
var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
svg.attr("height", g.graph().height + 40);

svgGroup.selectAll("g .output .node").on('click', function (d) {
    console.log(d);
});

window.svgGroup = svgGroup;
