describe("fitsTable", function() {
  var ft, precision;
  precision = 8;

  beforeEach(function() {
    var decodedData = window.atob(fits_binary_table);
    ft = new FitsTable(decodedData);
  });

  it("can read column names and data type from test data", function() {
    var i, keyType, keyForm, types, forms;

    types = ['boolean', 'unsigned_byte', 'integer_16', 'integer_32', 'integer_64', 'character', 'float_single', 'float_double', 'complex_single', 'complex_double'];
    forms = ['L', 'B', 'I', 'J', 'K', 'A', 'E', 'D', 'C', 'M'];

    ft.readHeader();
    for (i = 1; i <= ft.columns; i += 1) {
      keyType = "TTYPE" + i;
      keyForm = "TFORM" + i;
      expect(ft.header[keyType]).toMatch(types[i-1]);
      expect(ft.header[keyForm]).toMatch(forms[i-1]);
    }
  });

  it ("can read data from the table", function() {
    var bool, unsignedByte, int16, int32, floatSingle, floatDouble, complexSingle, complexDouble;

    ft.readHeader();
    ft.readColumns();

    bool          = ft.data['boolean'];
    unsignedByte  = ft.data['unsigned_byte'];
    int16         = ft.data['integer_16'];
    int32         = ft.data['integer_32'];
    int64         = ft.data['integer_64'];
    character     = ft.data['character'];
    floatSingle   = ft.data['float_single'];
    floatDouble   = ft.data['float_double'];
    complexSingle = ft.data['complex_single'];
    complexDouble = ft.data['complex_double'];

    expect(bool[0]).toBeTruthy()
    expect(bool[1]).toBeFalsy()
    expect(bool[2]).toBeTruthy()
    expect(bool[3]).toBeFalsy()

    expect(unsignedByte[0]).toEqual(128);
    expect(unsignedByte[1]).toEqual(110);
    expect(unsignedByte[2]).toEqual(0);
    expect(unsignedByte[3]).toEqual(126);

    expect(int16[0]).toEqual(-32768);
    expect(int16[1]).toEqual(-16010);
    expect(int16[2]).toEqual(0);
    expect(int16[3]).toEqual(32767);

    expect(int32[0]).toEqual(-2147483648);
    expect(int32[1]).toEqual(-1258594759);
    expect(int32[2]).toEqual(0);
    expect(int32[3]).toEqual(2147483647);

    expect(int64[0]).toEqual(-2147483647);
    expect(int64[1]).toEqual(-1258594759);
    expect(int64[2]).toEqual(0);
    expect(int64[3]).toEqual(2147483647);

    expect(character[0]).toMatch("NGC what what");
    expect(character[1]).toMatch("Messier messy catalog");
    expect(character[2]).toMatch("long redundant name for an object");
    expect(character[3]).toMatch("SDSS J011813.23-005420.7");

    expect(floatSingle[0]).toBeCloseTo(0.52765727, precision);
    expect(floatSingle[1]).toBeCloseTo(0.49855918, precision);
    expect(floatSingle[2]).toBeCloseTo(0.18345617, precision);
    expect(floatSingle[3]).toBeCloseTo(0.96718222, precision);

    expect(floatDouble[0]).toBeCloseTo(0.1591198764073356, precision);
    expect(floatDouble[1]).toBeCloseTo(0.52608471328096251, precision);
    expect(floatDouble[2]).toBeCloseTo(0.46402682308528254, precision);
    expect(floatDouble[3]).toBeCloseTo(0.21657682117710586, precision);

    expect(complexSingle[0][0]).toBeCloseTo(1.15767050, precision);
    expect(complexSingle[0][1]).toBeCloseTo(-0.27762079, precision);
    expect(complexSingle[1][0]).toBeCloseTo(-0.18762238, precision);
    expect(complexSingle[1][1]).toBeCloseTo(0.21096167, precision);
    expect(complexSingle[2][0]).toBeCloseTo(1.35169768, precision);
    expect(complexSingle[2][1]).toBeCloseTo(0.00690449, precision);
    expect(complexSingle[3][0]).toBeCloseTo(-0.08271787, precision);
    expect(complexSingle[3][1]).toBeCloseTo(0.2196918, precision);

    expect(complexDouble[0][0]).toBeCloseTo(1.66975072, precision);
    expect(complexDouble[0][1]).toBeCloseTo(-0.26756817, precision);
    expect(complexDouble[1][0]).toBeCloseTo(0.88275133, precision);
    expect(complexDouble[1][1]).toBeCloseTo(-0.54015721, precision);
    expect(complexDouble[2][0]).toBeCloseTo(-0.66180928, precision);
    expect(complexDouble[2][1]).toBeCloseTo(0.01391293, precision);
    expect(complexDouble[3][0]).toBeCloseTo(-1.39973848, precision);
    expect(complexDouble[3][1]).toBeCloseTo(1.48623702, precision);

  });
  // it("can read column names and data type from header", function() {
  //   var i, keyType, keyForm, types, forms;
  // 
  //   types = ['flux', 'best_fit', 'wavelength', 'and_mask', 'or_mask', 'inverse_variance'];
  //   forms = ['D', 'D', 'D', 'J', 'J', 'D'];
  // 
  //   ft.readHeader()
  //   for(i = 1; i <= ft.columns; i += 1) {
  //     keyType = "TTYPE" + i;
  //     keyForm = "TFORM" + i;
  //     expect(ft.header[keyType]).toMatch(types[i-1]);
  //     expect(ft.header[keyForm]).toMatch(forms[i-1]);
  //   }
  // });
  // 
  // it("can read the first column of values ... wicked cool!", function() {
  //   ft.readHeader();
  //   ft.readColumn();
  // 
  //   expect(ft.data['flux'][0]).toBeCloseTo(3.3827862739562988, precision);
  //   expect(ft.data['best_fit'][0]).toBeCloseTo(4.3956017000000003, precision);
  //   expect(ft.data['wavelength'][0]).toBeCloseTo(3797.5193897099998, precision);
  //   expect(ft.data['and_mask'][0]).toBeCloseTo(16777216, precision);
  //   expect(ft.data['or_mask'][0]).toBeCloseTo(16777216, precision);
  //   expect(ft.data['inverse_variance'][0]).toBeCloseTo(0.0, precision);
  // });
  // 
  // it("can read the last column of values ... now this is totally deck!", function() {
  //   var lastIndex;
  //   
  //   ft.readHeader();
  //   ft.readColumns();
  //   lastIndex = ft.rows - 1;
  // 
  //   expect(ft.data['flux'][lastIndex]).toBeCloseTo(0.34810096025466919, precision);
  //   expect(ft.data['best_fit'][lastIndex]).toBeCloseTo(0.61364496000000002, precision);
  //   expect(ft.data['wavelength'][lastIndex]).toBeCloseTo(9221.4666512399999, precision);
  //   expect(ft.data['and_mask'][lastIndex]).toBeCloseTo(88080400, precision);
  //   expect(ft.data['or_mask'][lastIndex]).toBeCloseTo(88080400, precision);
  //   expect(ft.data['inverse_variance'][lastIndex]).toBeCloseTo(0.0, precision);
  // });
});