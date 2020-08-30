import { nodes, getNodeInfo } from './nodes.js';

function addIndent(code, indent) {
    let indentStr = "    ".repeat(indent);
    return indentStr + code.split("\n").join(`\n${indentStr}`);
}

function getInitForward(nodes, indent) {
    let init_part = "";
    let forward_part = "";
    let nodesToProcess = ["data"]; // stores the node name
    let currentNodeName;
    let currentNode;
    let dataVar = "x";
    while (nodesToProcess.length) {
        currentNodeName = nodesToProcess.pop();
        currentNode = nodes[currentNodeName];
        let nodeCodeGen = getNodeInfo(currentNode).codeGen;
        let new_init_part;
        let new_forward_part;
        if (nodeCodeGen) {
            [new_init_part, new_forward_part] = nodeCodeGen(currentNode, dataVar);
        } else {
            let notDefText = `# [Code generator for ${currentNodeName} is not defined]`;
            new_init_part = notDefText;
            new_forward_part = notDefText;
        }
        if (new_init_part) {
            new_init_part = addIndent(new_init_part, indent) + "\n";
            init_part += new_init_part;
        }
        if (new_forward_part) {
            new_forward_part = addIndent(new_forward_part, indent) + "\n";
            forward_part += new_forward_part;
        }

        dataVar = `${currentNodeName}_out`;
        
        if (currentNode.type === "out") {
            break; // This is an optimization which prevents generating code that does not run
        } else {
            // TODO: handle multiple out case here
            nodesToProcess.push(currentNode.to);
        }
    }
    return [init_part, forward_part];
}

function genCode() {
    let [init_part, forward_part] = getInitForward(nodes, 2);

    let codeFramework = `import torch.nn as nn
import torch.nn.functional as F

class Model(nn.Module):
    def __init__(self):
        super(Model, self).__init__()
${init_part}

    def forward(self, x):
${forward_part}`;
    return codeFramework;
}

export { genCode };
