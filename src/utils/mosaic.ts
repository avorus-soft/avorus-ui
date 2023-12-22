import dropRight from 'lodash/dropRight'
import {
  Corner,
  MosaicDirection,
  MosaicNode,
  MosaicParent,
  MosaicPath,
  isParent,
  getLeaves,
  updateTree,
  getPathToCorner,
  getNodeAtPath,
} from 'react-mosaic-component'

const getOtherDirection = (direction: MosaicDirection): MosaicDirection => {
  if (direction === 'column') {
    return 'row'
  } else if (direction === 'row') {
    return 'column'
  } else {
    return window.innerWidth > window.innerHeight ? 'row' : 'column'
  }
}

const getPathToLarger = (tree: MosaicNode<any>): MosaicPath => {
  const path: MosaicPath = []
  let currentNode: MosaicNode<any> = tree
  const dimensions = [{ row: 100, column: 100 }]
  while (isParent(currentNode)) {
    const splitPercentage = currentNode.splitPercentage | 50
    if (!currentNode.splitPercentage) {
      if (
        getLeaves(currentNode.first).length >
        getLeaves(currentNode.second).length
      ) {
        path.push('second')
        currentNode = currentNode.second
      } else {
        path.push('first')
        currentNode = currentNode.first
      }
    } else if (splitPercentage > 50) {
      path.push('first')
      currentNode = currentNode.first as MosaicParent<string>
    } else {
      path.push('second')
      currentNode = currentNode.second as MosaicParent<string>
    }
    const newDimensions = dimensions[dimensions.length - 1]
    newDimensions[currentNode.direction] *= splitPercentage
    dimensions.push(newDimensions)
  }
  const areas = dimensions.map(
    dimension => dimension['row'] * dimension['column'],
  )
  let indexOfMaxValue =
    areas.reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0) + 1
  indexOfMaxValue = Math.min(path.length, indexOfMaxValue)
  const pathToLargest = path.splice(0, indexOfMaxValue)
  return pathToLargest
}

export const addToLargest = ({ currentNode, newNode }) => {
  if (currentNode) {
    if (getLeaves(currentNode).indexOf(newNode) !== -1) {
      return currentNode
    }
    if (window.innerWidth < 600) {
      return newNode
    }
    const path = getPathToLarger(currentNode)
    const parent = getNodeAtPath(
      currentNode,
      dropRight(path),
    ) as MosaicParent<string>
    const destination = getNodeAtPath(currentNode, path) as MosaicNode<string>
    const direction: MosaicDirection = parent
      ? getOtherDirection(parent.direction)
      : 'row'

    let first: MosaicNode<string>
    let second: MosaicNode<string>
    if (direction === 'row') {
      first = destination
      second = newNode
    } else {
      first = newNode
      second = destination
    }

    currentNode = updateTree(currentNode, [
      {
        path,
        spec: {
          $set: {
            direction,
            first,
            second,
          },
        },
      },
    ])
  } else {
    currentNode = newNode
  }

  return currentNode
}

export const addToTopRight = ({ currentNode, newNode }) => {
  if (currentNode) {
    if (getLeaves(currentNode).indexOf(newNode) !== -1) {
      return currentNode
    }
    if (window.innerWidth < 600) {
      return newNode
    }
    const path = getPathToCorner(currentNode, Corner.TOP_RIGHT)
    const parent = getNodeAtPath(
      currentNode,
      dropRight(path),
    ) as MosaicParent<string>
    const destination = getNodeAtPath(currentNode, path) as MosaicNode<string>
    const direction: MosaicDirection = parent
      ? getOtherDirection(parent.direction)
      : 'row'

    let first: MosaicNode<string>
    let second: MosaicNode<string>
    if (direction === 'row') {
      first = destination
      second = newNode
    } else {
      first = newNode
      second = destination
    }

    currentNode = updateTree(currentNode, [
      {
        path,
        spec: {
          $set: {
            direction,
            first,
            second,
          },
        },
      },
    ])
  } else {
    currentNode = newNode
  }

  return currentNode
}
