negamax = (node,depth,a,b,color) ->
  if depth <= 1 || node.isTerminal()
    node.v = color*node.value()
    return

  node.v = Number.NEGATIVE_INFINITY
  children = node.getChildren()
  for child in node.getChildren()
    negamax child,depth/children.length-1,-b,-a,-color
    child.v = -child.v
    if child.v > node.v
      node.v = child.v
      node.bestDelta = child.delta
    a = Math.max a, child.v
    if a >= b
      break


class Node
  isTerminal: ->
    true
  getChildren: ->
    []
  value: ->
    0
  applyDelta: ->

module.exports =
  negamax: negamax
