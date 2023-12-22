interface Item {
  kind: string
  id: number
  name: string
  is_attached: boolean
  is_online: number
  should_wake: boolean
  should_shutdown: boolean
  should_reboot: boolean
}

export interface DeviceType extends Item {
  tags: Array<TagType>
  location: LocationType
}

export interface TagType extends Item {
  display: string
  name: string
  slug: string
  color: string
}

export interface LocationType extends Item {
  display: string
  slug: string
}

export interface AppContextType {
  devices: Array<DeviceType>
  tags: Array<TagType>
  locations: Array<LocationType>
}
