function saveAsExcel(id, fileName) {
    var table = document.getElementById(id);
    if (!table) {
        alert('Таблица с id="' + id + '" не найдена');
        return;
    }

    var table_text = "<table border='2px'>";
    for (var i = 0; i < table.rows.length; i++) {
        table_text += "<tr>" + table.rows[i].innerHTML + "</tr>";
    }
    table_text += "</table>";

    table_text = table_text.replace(/<a[^>]*>|<\/a>/g, "");
    table_text = table_text.replace(/<img[^>]*>/gi, "");
    table_text = table_text.replace(/<input[^>]*>|<\/input>/gi, "");

    var userAgent = window.navigator.userAgent;
    var msie = userAgent.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        if (typeof Blob !== "undefined") {
            var blob = new Blob([table_text], { type: 'application/vnd.ms-excel' });
            window.navigator.msSaveBlob(blob, fileName);
        } else {
            var textArea = document.getElementById("textArea");
            if (!textArea) {
                alert('Элемент iframe#textArea не найден');
                return;
            }
            textArea.contentDocument.open("text/html", "replace");
            textArea.contentDocument.write(table_text);
            textArea.contentDocument.close();
            textArea.focus();
            textArea.contentDocument.execCommand("SaveAs", true, fileName);
        }
    }
    else {
        var a = document.createElement('a');
        a.href = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(table_text);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}