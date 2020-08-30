import { colorPalette, getNodeInfo } from './nodes.js';

function JSONToNodes(g, nodes) {
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
        
        let ret = getNodeInfo(node);
        let [name, desc, color, textColor] = [ret.name, ret.desc, ret.color, ret.textColor];
        if (!color) {
            color = colorPalette[node.type.hashCode() % colorPalette.length];
        }
        if (!name) {
            throw new Error(`The name of type ${node.type} is not defined`);
        }

        if (!textColor) {
            textColor = "#FFF";
        }
        
        if (desc) {
            g.setNode(i, {
                labelType: "html",
                label: `<name style="background-color: ${color}; color: ${ret.textColor}">${name}</name><desc>${desc}</desc>`,
                class: "node-item",
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
                paddingBottom: 5
            });
        } else {
            g.setNode(i, {
                labelType: "html",
                label: `<name style="background-color: ${color}; border-radius: 5px; color: ${ret.textColor}">${name}</name>`,
                class: "node-item",
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
                paddingBottom: 0
            });
        }
    }
    
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
    
    g.edges().forEach(function (e) {
        var edge = g.edge(e.v, e.w);
        edge.lineInterpolate = 'basis';
    });

    return [nodesArr, edgesArr];
}

export { JSONToNodes };
