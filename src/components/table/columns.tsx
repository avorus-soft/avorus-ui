import { deviceColumns } from './deviceColumns'
import { tagColumns } from './tagColumns'
import { locationColumns } from './locationColumns'

export const useColumns = ({ variant, node }) =>
  ({
    devices: deviceColumns({ node }),
    tags: tagColumns({ node }),
    locations: locationColumns({ node }),
  }[variant])
