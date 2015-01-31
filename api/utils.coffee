module.exports =
  add: (obj1,obj2) ->
    for k of obj2
      obj1[k] = obj2[k]
    obj1

  flatten: (array) ->
    array.reduce (a,b) -> a.concat b, []

  bitParity8: (v) ->
    v ^= v >> 16
    v ^= v >> 8
    v ^= v >> 4
    v &= 0xf
    (0x6996 >> v) & 1
