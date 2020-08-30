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

function deepSubscript(item, subscript) {
    // Example:
    // item["abc"]["123"] is equivalent to deepSubscript(item, "abc.123")
    let subscriptArr = subscript.split(".");
    for (let subscriptItem of subscriptArr) {
        item = item[subscriptItem];
    }
    return item;
}

function downloadFile(type, content, name) {
    // Type example: "application/json;charset=utf-8"
    var blob = new Blob([content], {type}, name);
    var blob_URL = URL.createObjectURL(blob);
    var downloadLink = document.createElement("a");
    downloadLink.href = blob_URL;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

export { deepSubscript, downloadFile };
