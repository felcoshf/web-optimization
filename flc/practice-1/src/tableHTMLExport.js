(function($){
    $.fn.extend({
        tableHTMLExport: function(options) {

            var defaults = {
                separator: ',',
                newline: '\r\n',
                ignoreColumns: '',
                ignoreRows: '',
                type: 'csv',
                htmlContent: false,
                consoleLog: false,
                trimContent: true,
                quoteFields: true,
                filename: 'tableHTMLExport.csv',
                utf8BOM: true,
                orientation: 'p'
            };
            var opts = $.extend({}, defaults, options);

            function quote(text) {
                return '"' + String(text).replace(/"/g, '""') + '"';
            }

            function parseString(data) {
                var content_data;
                if (opts.htmlContent) {
                    content_data = data.html().trim();
                } else {
                    content_data = data.text().trim();
                }
                return content_data;
            }

            function download(filename, text, mime) {
                var element = document.createElement('a');
                element.setAttribute('href',
                    'data:' + (mime || 'text/csv') + ';charset=utf-8,' + encodeURIComponent(text));
                element.setAttribute('download', filename);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            }

            function toJson(el) {
                var jsonHeaderArray = [];
                $(el).find('thead').find('tr').not(opts.ignoreRows).each(function() {
                    var jsonArrayTd = [];
                    $(this).find('th,td').not(opts.ignoreColumns).each(function() {
                        if ($(this).css('display') != 'none') {
                            jsonArrayTd.push(parseString($(this)));
                        }
                    });
                    jsonHeaderArray.push(jsonArrayTd);
                });

                var jsonArray = [];
                $(el).find('tbody').find('tr').not(opts.ignoreRows).each(function() {
                    var jsonArrayTd = [];
                    $(this).find('td,th').not(opts.ignoreColumns).each(function() {
                        if ($(this).css('display') != 'none') {
                            jsonArrayTd.push(parseString($(this)));
                        }
                    });
                    jsonArray.push(jsonArrayTd);
                });

                return { header: jsonHeaderArray[0], data: jsonArray };
            }

            function toCsv(table) {
                var output = "";
                if (opts.utf8BOM === true) output += '\ufeff';

                var rows = table.find('tr').not(opts.ignoreRows);
                if (rows.length === 0) return output;

                var numCols = rows.first().find("td,th").not(opts.ignoreColumns).length;

                rows.each(function() {
                    $(this).find("td,th").not(opts.ignoreColumns).each(function(i, col) {
                        var column = $(col);
                        var content = opts.trimContent ? $.trim(column.text()) : column.text();
                        output += opts.quoteFields ? quote(content) : content;
                        if (i !== numCols - 1) {
                            output += opts.separator;
                        } else {
                            output += opts.newline;
                        }
                    });
                });

                return output;
            }

            var el = this;
            var dataMe;

            if (opts.type == 'csv' || opts.type == 'txt') {
                var table = this.filter('table');
                if (table.length <= 0) {
                    throw new Error('tableHTMLExport must be called on a <table> element');
                }
                if (table.length > 1) {
                    throw new Error('converting multiple table elements at once is not supported yet');
                }
                dataMe = toCsv(table);
                if (opts.consoleLog) console.log(dataMe);
                download(opts.filename, dataMe, 'text/csv');

            } else if (opts.type == 'json') {
                var jsonExportArray = toJson(el);
                dataMe = JSON.stringify(jsonExportArray, null, 2);
                if (opts.consoleLog) console.log(dataMe);
                download(opts.filename, dataMe, 'application/json');

            } else if (opts.type == 'pdf') {
                var jsonExportArray = toJson(el);
                var contentJsPdf = {
                    head: [jsonExportArray.header],
                    body: jsonExportArray.data
                };
                if (opts.consoleLog) console.log(contentJsPdf);
                var doc = new jsPDF(opts.orientation, 'pt');
                doc.autoTable(contentJsPdf);
                doc.save(opts.filename);
            }
            return this;
        }
    });
})(jQuery);