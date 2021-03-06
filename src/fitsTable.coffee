
class FitsTable

  constructor: (buffer) ->
    @view = new jDataView buffer, undefined, undefined, false
    @header = {}
    @data = {}
    @rows = 0
    @columns = 0
    @rowsToRead = 0
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
      @rows = parseInt(value.split('/')[0].trim()) if key.match("NAXIS2")
      @rowsToRead = @rows
      if key.match("TTYPE[0-9]")
        key = key.trim()
        value = value.replace(/'/g, "").trim()
        @header[key] = value
        @data[value] = []
        @columnNames.push(value)
        @columns += 1
      @header[key.trim()] = value.replace(/'/g, "").trim() if key.match("TFORM[0-9]")

      numEnds += 1 if line[0..2] is "END"
      break if line[0..2] is "END" and numEnds is 2
    @view.getString(block - (linesRead * lineWidth) % block)
    @hasReadHeader = true

  readColumn: ->
    @readHeader() unless @hasReadHeader

    for i in [1..@columns]
      columnName = @columnNames[i-1]
      tform = "TFORM#{i}"
      switch @header[tform].match(/[A-Z]/)[0]
        when 'L'  # logical (Boolean)
          value = if @view.getInt8() is 84 then true else false
          @data[columnName].push(value)
        when 'X'  # bit
          throw "Data type not yet implemented"
        when 'B'  # Unsigned byte
          @data[columnName].push(@view.getUint8())
        when 'I'  # 16-bit integer
          @data[columnName].push(@view.getInt16())
        when 'J'  # 32-bit integer
          @data[columnName].push(@view.getInt32())
        when 'K'  # 64-bit integer
          highByte = Math.abs @view.getInt32()
          lowByte = Math.abs @view.getInt32()
          mod = highByte % 10
          factor = if mod then -1 else 1
          highByte -= mod
          value = factor * ((highByte << 32) | lowByte)
          @data[columnName].push(value)
          console.warn "Something funky happens here when dealing with 64 bit integers.  Be wary!!!"
        when 'A'  # character
          length = parseInt(@header[tform].match(/(\d*)A/)[1])
          @data[columnName].push(@view.getString(length))
        when 'E'  # single precision floating point
          @data[columnName].push(@view.getFloat32())
        when 'D'  # double precision floating point
          @data[columnName].push(@view.getFloat64())
        when 'C'  # single precision complex
          real = @view.getFloat32()
          complex = @view.getFloat32()
          @data[columnName].push([real, complex])
        when 'M'  # double precision complex
          real = @view.getFloat64()
          complex = @view.getFloat64()
          @data[columnName].push([real, complex])
        when 'P'  # array descriptor
          throw "Data type not yet implemented"
    @rowsToRead -= 1

  readColumns: -> @readColumn() until @rowsToRead is 0

window.FitsTable = FitsTable