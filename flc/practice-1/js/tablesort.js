var img_dir = "images/";

function getConcatenedTextContent(node) {
    var _result = "";
    if (node == null) return _result;
    var childrens = node.childNodes;
    var i = 0;
    while (i < childrens.length) {
        var child = childrens.item(i);
        switch (child.nodeType) {
            case 1: // ELEMENT_NODE
            case 5: // ENTITY_REFERENCE_NODE
                _result += getConcatenedTextContent(child);
                break;
            case 3: // TEXT_NODE
            case 2: // ATTRIBUTE_NODE
            case 4: // CDATA_SECTION_NODE
                _result += child.nodeValue;
                break;
        }
        i++;
    }
    return _result;
}

var up = false;

function sort(e) {
    var el = window.event ? window.event.srcElement : e.currentTarget;

    if (el.tagName == "IMG") el = el.parentNode;

    var a = new Array();
    var name = el.lastChild.nodeValue;
    if (name == null) {
        name = getConcatenedTextContent(el).replace(/\s/g, '');
    }
    var dad = el.parentNode;

    var root_img_dir = "/" + img_dir.replace(/^\/+/, "");

    var node, arrow, curcol;
    for (var i = 0; (node = dad.getElementsByTagName("td").item(i)); i++) {
        var nodeName = getConcatenedTextContent(node).replace(/\s/g, '');
        if (nodeName == name.replace(/\s/g, '')) {
            curcol = i;
            if (node.className == "curcol") {
                arrow = node.firstChild;
                up = !up;
                arrow.src = root_img_dir + Number(up) + ".gif";
            } else {
                node.className = "curcol";
                arrow = node.insertBefore(document.createElement("img"), node.firstChild);
                up = false;
                arrow.src = root_img_dir + Number(up) + ".gif";
            }
        } else {
            if (node.className == "curcol") {
                node.className = "";
                if (node.firstChild && node.firstChild.tagName === "IMG") {
                    node.removeChild(node.firstChild);
                }
            }
        }
    }

    // tbody
    var tbody = dad.parentNode.parentNode.getElementsByTagName("tbody").item(0);
    if (!tbody) tbody = dad.parentNode.parentNode; // fallback

    for (var i = 0; (node = tbody.getElementsByTagName("tr").item(i)); i++) {
        a[i] = new Array();
        a[i][0] = getConcatenedTextContent(node.getElementsByTagName("td").item(curcol));
        a[i][1] = getConcatenedTextContent(node.getElementsByTagName("td").item(1));
        a[i][2] = getConcatenedTextContent(node.getElementsByTagName("td").item(0));
        a[i][3] = node;
    }

    a.sort();

    if (up) a.reverse();

    for (var i = 0; i < a.length; i++) {
        tbody.appendChild(a[i][3]);
    }
}

function init(e) {
    if (!document.getElementsByTagName) return;

    var tables = document.getElementsByTagName("table");
    for (var t = 0; t < tables.length; t++) {
        var tbl = tables[t];
        if (!tbl.className || tbl.className.indexOf("sort") === -1) continue;

        var thead = tbl.getElementsByTagName("thead").item(0);
        if (!thead) continue;

        var node;
        for (var i = 0; (node = thead.getElementsByTagName("td").item(i)); i++) {
            if (node.addEventListener) node.addEventListener("click", sort, false);
            else if (node.attachEvent) node.attachEvent("onclick", sort);
            node.title = "Нажмите на заголовок, чтобы отсортировать колонку";
        }
    }
}

var root = window.addEventListener || window.attachEvent ? window
         : document.addEventListener ? document : null;
if (root) {
    if (root.addEventListener) root.addEventListener("load", init, false);
    else if (root.attachEvent) root.attachEvent("onload", init);
}