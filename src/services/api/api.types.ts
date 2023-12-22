interface Item {
  kind?: string
  id: number
  name: string
}

export interface IpType {
  id: number
  dns_name: string
  address: string
  tags: Array<TagType>
  description: string
}

export interface DeviceType extends Item {
  tags: Array<TagType>
  location: LocationType
  primary_ip: IpType
}

export interface TagType extends Item {
  name: string
  color: string
}

export interface LocationType extends Item {
  parent: Item
}

export interface ApiDataResponse {
  devices: Array<DeviceType>
  tags: Array<TagType>
  locations: Array<LocationType>
}

/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  host: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}
