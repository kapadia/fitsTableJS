
class FitsTable

  constructor: (buffer) ->
    @view = new jDataView buffer, undefined, undefined, false
    @header = {}
    @tableData = {}
    @numberOfColumns = 0
    @numberOfRows = undefined
    @columnNames = []
    @hasReadHeader = false

  readHeader: ->
    lineWidth = 80
    block = 2880
    numEnds = 0
    linesRead = 0
    loop
      line = @view.getString(lineWidth)
      linesRead += 1

      [key, value] = line.split("=")
      @numberOfRows = parseInt(value.split('/')[0].trim()) if key.match("NAXIS2")
      if key.match("TTYPE[0-9]")
        key = key.trim()
        value = value.replace(/'/g, "").trim()
        @header[key] = value
        @tableData[value] = []
        @columnNames.push(value)
        @numberOfColumns += 1
      @header[key.trim()] = value.replace(/'/g, "").trim() if key.match("TFORM[0-9]")

      numEnds += 1 if line[0..2] is "END"
      break if line[0..2] is "END" and numEnds is 2
    @view.getString(block - (linesRead * lineWidth) % block)
    @hasReadHeader = true

  readColumn: ->
    throw "Header has not been read" unless @hasReadHeader
    keyType = "TTYPE"
    keyForm = "TFORM"

    for i in [1..@numberOfColumns]
      columnName = @columnNames[i-1]
      tform = "TFORM#{i}"
      switch @header[tform]
        when 'L'
          # logical (Boolean)
          throw "Data type not yet implemented"
        when 'X'
          # bit
          throw "Data type not yet implemented"
        when 'B'
          # Unsigned byte
          throw "Data type not yet implemented"
        when 'I'
          # 16-bit integer
          @tableData[columnName].push(@view.getInt16())
        when 'J'
          # 32-bit integer
          @tableData[columnName].push(@view.getInt32())
        when 'K'
          # 64-bit integer
          throw "Data type not yet implemented"
        when 'A'
          # character
          @tableData[columnName].push(@view.getChar())
        when 'E'
          # single precision floating point
          @tableData[columnName].push(@view.getFloat32())
        when 'D'
          # double precision floating point
          @tableData[columnName].push(@view.getFloat64())
        when 'C'
          # single precision complex
          throw "Data type not yet implemented"
        when 'M'
          # double precision complex
          throw "Data type not yet implemented"
        when 'P'
          # array descriptor
          throw "Data type not yet implemented"

  readColumns: -> @readColumn() for i in [1..@numberOfRows]

window.FitsTable = FitsTable