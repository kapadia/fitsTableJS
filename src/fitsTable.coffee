
class FITSTable
  
  constructor: (buffer) ->
    @view = new jDataView buffer, undefined, undefined, false
    