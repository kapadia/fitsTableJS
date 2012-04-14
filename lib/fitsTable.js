(function() {
  var FitsTable;

  FitsTable = (function() {

    function FitsTable(buffer) {
      this.view = new jDataView(buffer, void 0, void 0, false);
      this.header = {};
      this.data = {};
      this.rows = 0;
      this.columns = 0;
      this.rowsToRead = 0;
      this.columnNames = [];
      this.hasReadHeader = false;
    }

    FitsTable.prototype.readHeader = function() {
      var block, key, line, lineWidth, linesRead, numEnds, value, _ref;
      lineWidth = 80;
      block = 2880;
      numEnds = 0;
      linesRead = 0;
      while (true) {
        line = this.view.getString(lineWidth);
        linesRead += 1;
        _ref = line.split("="), key = _ref[0], value = _ref[1];
        if (key.match("NAXIS2")) this.rows = parseInt(value.split('/')[0].trim());
        this.rowsToRead = this.rows;
        if (key.match("TTYPE[0-9]")) {
          key = key.trim();
          value = value.replace(/'/g, "").trim();
          this.header[key] = value;
          this.data[value] = [];
          this.columnNames.push(value);
          this.columns += 1;
        }
        if (key.match("TFORM[0-9]")) {
          this.header[key.trim()] = value.replace(/'/g, "").trim();
        }
        if (line.slice(0, 3) === "END") numEnds += 1;
        if (line.slice(0, 3) === "END" && numEnds === 2) break;
      }
      this.view.getString(block - (linesRead * lineWidth) % block);
      return this.hasReadHeader = true;
    };

    FitsTable.prototype.readColumn = function() {
      var columnName, complex, factor, highByte, i, length, lowByte, mod, real, tform, value, _ref;
      if (!this.hasReadHeader) this.readHeader();
      for (i = 1, _ref = this.columns; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
        columnName = this.columnNames[i - 1];
        tform = "TFORM" + i;
        switch (this.header[tform].match(/[A-Z]/)[0]) {
          case 'L':
            value = this.view.getInt8() === 84 ? true : false;
            this.data[columnName].push(value);
            break;
          case 'X':
            throw "Data type not yet implemented";
            break;
          case 'B':
            this.data[columnName].push(this.view.getUint8());
            break;
          case 'I':
            this.data[columnName].push(this.view.getInt16());
            break;
          case 'J':
            this.data[columnName].push(this.view.getInt32());
            break;
          case 'K':
            highByte = Math.abs(this.view.getInt32());
            lowByte = Math.abs(this.view.getInt32());
            mod = highByte % 10;
            factor = mod ? -1 : 1;
            highByte -= mod;
            value = factor * ((highByte << 32) | lowByte);
            this.data[columnName].push(value);
            console.warn("Something funky happens here when dealing with 64 bit integers.  Be wary!!!");
            break;
          case 'A':
            length = parseInt(this.header[tform].match(/(\d*)A/)[1]);
            this.data[columnName].push(this.view.getString(length));
            break;
          case 'E':
            this.data[columnName].push(this.view.getFloat32());
            break;
          case 'D':
            this.data[columnName].push(this.view.getFloat64());
            break;
          case 'C':
            real = this.view.getFloat32();
            complex = this.view.getFloat32();
            this.data[columnName].push([real, complex]);
            break;
          case 'M':
            real = this.view.getFloat64();
            complex = this.view.getFloat64();
            this.data[columnName].push([real, complex]);
            break;
          case 'P':
            throw "Data type not yet implemented";
        }
      }
      return this.rowsToRead -= 1;
    };

    FitsTable.prototype.readColumns = function() {
      var _results;
      _results = [];
      while (this.rowsToRead !== 0) {
        _results.push(this.readColumn());
      }
      return _results;
    };

    return FitsTable;

  })();

  window.FitsTable = FitsTable;

}).call(this);
