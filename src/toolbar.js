import * as d3 from "d3";
import { nodes } from "./nodes.js";
import { genCode } from './code-gen.js';
import { downloadFile } from './utils.js';

function exportSave() {
    // alert(nodes);
    let JSON_nodes = JSON.stringify(nodes);
    const downloadFileType = "application/json;charset=utf-8";
    downloadFile(downloadFileType, JSON_nodes, "lotus.json")
}

function exportModule() {
    let code = genCode();
    console.log(code);
    let isDownload = confirm("Do you want to download the module? If not, you can view it in console.");
    if (isDownload) {
        const downloadFileType = "application/x-python-code;charset=utf-8";
        downloadFile(downloadFileType, code, "module.py");
    }
}

function initToolBar() {
    d3.select(".toolbar .export-btn").on("click", exportSave);
    d3.select(".toolbar .run-btn").on("click", exportModule);
}

export { initToolBar };
