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
      columns += "<td style='font-weight:bold'>" + ft.columnNames[i] + "</td>";
    columns += "</tr>";
    $("#example-table").append(columns);

    for (j = 0; j < 100; j += 1) {
      row = "<tr>";
      for (i = 0; i < ft.columns; i += 1) {
        columnName = ft.columnNames[i];
        field = ft.data[columnName][j];
        row += "<td>" + field + "</td>";
      }
      row += "</tr>"
      $("#example-table tr:last").after(row);
    }
    
    // Using Flot
    var options;
    var dataFit   = [];
    var dataFlux  = [];

    for (i = 0; i < ft.rows; i += 1) {
      dataFlux.push( [ ft.data['wavelength'][i], ft.data['flux'][i] ] );
      dataFit.push( [ ft.data['wavelength'][i], ft.data['best_fit'][i] ] );
    }

    $("#example-table").after("<div id='graph' style='width:600px;height:300px'></div>");

    options = {
      xaxis: {
        min: Math.min.apply(Math, ft.data['wavelength']),
        max: Math.max.apply(Math, ft.data['wavelength'])
      },
      yaxis: {
        // min: Math.min.apply(Math, ft.data['flux']),
        // max: Math.max.apply(Math, ft.data['flux'])
        min: -5,
        max: 7
      },
      xaxes: [{
        axisLabel: "Wavelength (angstroms)"
      }],
      yaxes: [{
        axisLabel: "Flux (1E-17 erg/cm^2/s/Ang)"
      }]
    }

    $.plot($("#graph"), [dataFlux, dataFit], options);

  };
  xhr.send();

});