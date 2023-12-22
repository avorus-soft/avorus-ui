import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { v4 as uuidv4 } from 'uuid'
import { save } from '../utils/storage'

const MaybeNode = types.union(
  types.literal(undefined),
  types.string,
  types.reference(types.late(() => Node)),
)
const Node = types.model('Node', {
  id: types.identifier,
  direction: types.union(
    types.undefined,
    types.literal('row'),
    types.literal('column'),
  ),
  splitPercentage: types.maybe(types.number),
  first: types.maybe(MaybeNode),
  second: types.maybe(MaybeNode),
})
const initialValue = Node.create(
  {
    id: uuidv4(),
    direction: 'row',
    first: 'a',
    second: Node.create({
      id: uuidv4(),
      direction: 'column',
      first: 'b',
      second: 'c',
    }),
    splitPercentage: 40,
  },
  {
    getNodeSnapshot: node => ({ id: node.id }),
  },
)

export const MosaicStoreModel = types
  .model('MosaicStore')
  .props({
    node: types.optional(Node, () => initialValue),
  })
  .actions(store => ({
    setNode(value) {
      // store.node = value
      if (!Node.is(value)) {
        throw new Error('Invalid value for node property')
      }
      console.log(store.node, value)
      save('mosaic', store.node)
    },
  }))

export interface MosaicStore extends Instance<typeof MosaicStoreModel> {}
export interface MosaicStoreSnapshot
  extends SnapshotOut<typeof MosaicStoreModel> {}
