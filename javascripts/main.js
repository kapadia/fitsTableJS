$(document).ready(function () {
  var xhr, ft, columns, i, j, row, field;
  
  var xhr = new XMLHttpRequest();
  xhr.open('GET', "test/data/spec-0406-51869-0012.fits", true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(evt) {
    var ft = new FitsTable(xhr.response);

    ft.readHeader();
    ft.readColumns();

    columns = "<tr>"
    for (i = 0; i < ft.columns; i += 1)
      columns += "<td>" + ft.columnNames[i] + "</td>";
    columns += "</tr>";
    $("#example-table").append(columns);

    for (j = 0; j < 100; j += 1) {
      row = "<td>";
      for (i = 0; i < ft.columns; i += 1) {
        columnName = ft.columnNames[i];
        field = ft.data[columnName][j];
        row += "<td>" + field + "</td>";
      }
      row += "</td>"
      $("#example-table tr:last").after(row);
    }
  };
  xhr.send();
});