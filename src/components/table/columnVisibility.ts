import { TableProps } from './index'

export const columnVisibility = ({
  variant,
}: {
  variant: TableProps['variant']
}) => {
  switch (variant) {
    case 'devices':
      return {
        primary_ip: false,
        type: false,
      }
    case 'tags':
      return {}
    case 'locations':
      return {}
  }
}
