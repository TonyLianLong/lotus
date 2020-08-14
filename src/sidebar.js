import * as d3 from "d3";
import { deepSubscript } from './utils.js';
import { getNodeInfo } from "./nodes.js";

let sidebarStat = false;

function openSideBar(node) {
    if (sidebarStat) {
        d3.select(".sidebar").selectAll("h1, div").data([]).exit().remove();
    }
    sidebarStat = true;
    let nodeInfo = getNodeInfo(node); // nodeInfo comes from nodeDetailsDict
    let nodeName = nodeInfo.name;
    d3.select(".sidebar").style("display", "block").append("h1").text(nodeName);
    console.log("Node side", nodeInfo.side);
    d3.select(".sidebar").selectAll("div").data(nodeInfo.side).enter().append("div").each(function (sideSection) {
        let t = d3.select(this);
        if (sideSection.title) {
            t.append("h2").text(sideSection.title);
        }
        if (sideSection.type == "text") {
            t.append("p").text(sideSection.text);
        } else if (sideSection.type == "html") {
            t.append("div").html(sideSection.html);
        } else if (sideSection.type == "props") {
            console.log(Object.keys(sideSection.fields));
            t.append("div").selectAll("div").data(Object.keys(sideSection.fields)).enter().append("div").classed("field", true).html(function (fieldKey) {
                console.log(fieldKey);
                let mappedField = sideSection.fields[fieldKey];
                console.log(node, mappedField);
                return `
                    <span>${fieldKey}</span> <input type="text" value="${deepSubscript(node, mappedField)}" />
                `;
            });
        } else {
            throw new Error(`Unknown sidebar content type ${sideSection.type}`);
        }
    });
}

function closeSideBar() {
    sidebarStat = false;
    d3.select(".sidebar").style("display", "none");
}

function initSideBar() {
    d3.select(".sidebar .close-btn").on("click", closeSideBar);
}

export { openSideBar, closeSideBar, initSideBar };
