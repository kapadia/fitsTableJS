describe("fitsTable", function() {
  var ft, precision;
  precision = 14;

  beforeEach(function() {
    var decodedData = window.atob(fits_binary_table);

    ft = new FitsTable(decodedData);
  });
  
  it("can read column names and data type from header", function() {
    var i, keyType, keyForm, types, forms;

    types = ['flux', 'best_fit', 'wavelength', 'and_mask', 'or_mask', 'inverse_variance'];
    forms = ['D', 'D', 'D', 'J', 'J', 'D'];

    ft.readHeader()

    for(i = 1; i <= ft.numberOfColumns; i += 1) {
      keyType = "TTYPE" + i;
      keyForm = "TFORM" + i;
      expect(ft.header[keyType]).toMatch(types[i-1]);
      expect(ft.header[keyForm]).toMatch(forms[i-1]);
    }
  });

  it("can read the first column of values ... wicked cool!", function() {
    ft.readHeader();
    ft.readColumn();

    expect(ft.tableData['flux'][0]).toBeCloseTo(3.3827862739562988, precision);
    expect(ft.tableData['best_fit'][0]).toBeCloseTo(4.3956017000000003, precision);
    expect(ft.tableData['wavelength'][0]).toBeCloseTo(3797.5193897099998, precision);
    expect(ft.tableData['and_mask'][0]).toBeCloseTo(16777216, precision);
    expect(ft.tableData['or_mask'][0]).toBeCloseTo(16777216, precision);
    expect(ft.tableData['inverse_variance'][0]).toBeCloseTo(0.0, precision);
  });

  it("can read the last column of values ... now this is totally deck!", function() {
    var lastIndex;
    
    ft.readHeader();
    ft.readColumns();
    lastIndex = ft.numberOfRows - 1;

    expect(ft.tableData['flux'][lastIndex]).toBeCloseTo(0.34810096025466919, precision);
    expect(ft.tableData['best_fit'][lastIndex]).toBeCloseTo(0.61364496000000002, precision);
    expect(ft.tableData['wavelength'][lastIndex]).toBeCloseTo(9221.4666512399999, precision);
    expect(ft.tableData['and_mask'][lastIndex]).toBeCloseTo(88080400, precision);
    expect(ft.tableData['or_mask'][lastIndex]).toBeCloseTo(88080400, precision);
    expect(ft.tableData['inverse_variance'][lastIndex]).toBeCloseTo(0.0, precision);
  });
});