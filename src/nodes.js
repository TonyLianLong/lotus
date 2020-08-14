// FIXME: In the future, we may need to move this into the python file of each module.

const nodes = {
    "data": {"type": "data", "to": "conv1"},
    "conv1": {"type": "conv", "data": { "filter": [32, 3, 3, 3] }, "to": "conv2"},
    "conv2": {"type": "conv", "data": { "filter": [32, 32, 1, 1] }, "to": "flatten"},
    "flatten" : {"type": "flatten", "to": "linear"},
    "linear" : {"type": "linear", "data": { "width": 4096 }, "to": "softmax"},
    "softmax" : {"type": "softmax", "to": "out"},
    "out": {"type": "out"}
};
  
const colorPalette = ["#284376", "#4b1b16", "#353531", "#694434", "#AB5351", "#016FB9"];

function defaultSide(desc, args) {
    if (!args) {
        args = {};
    }
    return [
        {
            "type": "html",
            "title": "简介",
            "html": `<p>${desc}</p>` + (args.link?`<a href="${args.link}"target="_blank">点这里查看详细说明</a>`:"")
        },
        {
            "type": "props",
            "title": "基本属性",
            "fields": {
                "模块id": "name"
            }
        },
        ...(args.example ? [{
            "type": "text",
            "title": "示例",
            "text": args.example
        }] : [])
    ];
}

function simpleNodeDetails(name, desc, args) {
    if (!args) {
        args = {};
    }
    return {
        name, 
        side: [
            ...defaultSide(desc, args)
        ],
        color: args.color,
        textColor: args.textColor
    };
}

const nodeDetailsDict = {
    "conv": (data) => ({
        "name": "卷积层", "desc": `Filter (${data.filter.join(",")})`, "color": "#816C61", "side": [
            ...defaultSide("卷积层对上一层的输入进行一次卷积运算", {link: "https://www.paddlepaddle.org.cn/documentation/docs/zh/1.2/api_cn/api_guides/low_level/layers/conv.html#api-guide-conv"}),
            {
                "type": "props",
                "title": "模块属性",
                "fields": {
                    "Filter": "data.filter"
                }
            }
        ]
    }),
    "data": simpleNodeDetails("数据输入", "这是一个模块的数据输入", {color: "#EEE", textColor: "#000"}),
    "out": simpleNodeDetails("数据输出", "这是一个模块的数据输出", {color: "#EEE", textColor: "#000"}),
    "flatten": simpleNodeDetails("打平", "打平 (flatten) 运算是把一个张量展开的运算，把所有除了batch方向的向量都展开。", {example: "输入张量大小为(128,10,10)， 输出张量大小为(128,100)"}),
    "linear": simpleNodeDetails("线性运算", "线性运算(linear)会对前面层的输入进行矩阵乘法加上偏置运算"),
    "softmax": simpleNodeDetails("Softmax", "Softmax可以将实数范围内的输出值转为0到1之间的概率值", {link: "https://www.paddlepaddle.org.cn/documentation/docs/zh/1.2/api_cn/layers_cn.html#softmax", color: "#9355E8"})
};

function getNodeInfo(node) {
    if (typeof nodeDetailsDict[node.type] == "function") {
        let ret = nodeDetailsDict[node.type](node.data);
        return ret;
    }
    return nodeDetailsDict[node.type];
    
}


export { nodes, colorPalette, getNodeInfo, nodeDetailsDict };

window.nodeDetailsDict = nodeDetailsDict;
