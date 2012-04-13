(function() {
  var FitsTable;

  FitsTable = (function() {

    function FitsTable(buffer) {
      this.view = new jDataView(buffer, void 0, void 0, false);
      this.header = {};
      this.tableData = {};
      this.numberOfColumns = 0;
      this.numberOfRows = void 0;
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
        if (key.match("NAXIS2")) {
          this.numberOfRows = parseInt(value.split('/')[0].trim());
        }
        if (key.match("TTYPE[0-9]")) {
          key = key.trim();
          value = value.replace(/'/g, "").trim();
          this.header[key] = value;
          this.tableData[value] = [];
          this.columnNames.push(value);
          this.numberOfColumns += 1;
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
      var columnName, i, keyForm, keyType, tform, _ref, _results;
      if (!this.hasReadHeader) throw "Header has not been read";
      keyType = "TTYPE";
      keyForm = "TFORM";
      _results = [];
      for (i = 1, _ref = this.numberOfColumns; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
        columnName = this.columnNames[i - 1];
        tform = "TFORM" + i;
        switch (this.header[tform]) {
          case 'L':
            throw "Data type not yet implemented";
            break;
          case 'X':
            throw "Data type not yet implemented";
            break;
          case 'B':
            throw "Data type not yet implemented";
            break;
          case 'I':
            _results.push(this.tableData[columnName].push(this.view.getInt16()));
            break;
          case 'J':
            _results.push(this.tableData[columnName].push(this.view.getInt32()));
            break;
          case 'K':
            throw "Data type not yet implemented";
            break;
          case 'A':
            _results.push(this.tableData[columnName].push(this.view.getChar()));
            break;
          case 'E':
            _results.push(this.tableData[columnName].push(this.view.getFloat32()));
            break;
          case 'D':
            _results.push(this.tableData[columnName].push(this.view.getFloat64()));
            break;
          case 'C':
            throw "Data type not yet implemented";
            break;
          case 'M':
            throw "Data type not yet implemented";
            break;
          case 'P':
            throw "Data type not yet implemented";
            break;
          default:
            _results.push(void 0);
        }
      }
      return _results;
    };

    FitsTable.prototype.readColumns = function() {
      var i, _ref, _results;
      _results = [];
      for (i = 1, _ref = this.numberOfRows; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
        _results.push(this.readColumn());
      }
      return _results;
    };

    return FitsTable;

  })();

  window.FitsTable = FitsTable;

}).call(this);
