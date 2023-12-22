export const array_equals = (a: Array<any>, b: Array<any>) => {
  // if the other array is a falsy value, return
  if (!a || !b) return false
  // if the argument is the same array, we can be sure the contents are same as well
  if (b === a) return true
  // compare lengths - can save a lot of time
  if (a.length !== b.length) return false

  for (let i = 0, l = a.length; i < l; i++) {
    // Check if we have nested arrays
    if (a[i] instanceof Array && b[i] instanceof Array) {
      // recurse into the nested arrays
      if (!a[i].equals(b[i])) return false
    } else if (a[i] !== b[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false
    }
  }
  return true
}
