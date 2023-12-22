export interface ConfigBaseProps {
  persistNavigation: 'always' | 'dev' | 'prod' | 'never'
  catchErrors: 'always' | 'dev' | 'prod' | 'never'
  timeZone: string
  defaultEventActions: {
    start: string
    end: string
  }
  version: string
}

export type PersistNavigationConfig = ConfigBaseProps['persistNavigation']

const BaseConfig: ConfigBaseProps = {
  // This feature is particularly useful in development mode, but
  // can be used in production as well if you prefer.
  persistNavigation: 'dev',

  /**
   * Only enable if we're catching errors in the right environment
   */
  catchErrors: 'always',
  timeZone: 'Europe/Berlin',
  defaultEventActions: {
    start: 'shutdown',
    end: 'wake',
  },
  version: '0.9a',
}

export default BaseConfig
