/**
 * These are configuration settings for the production environment.
 *
 * Do not include API secrets in this file or anywhere in your JS.
 *
 * https://reactnative.dev/docs/security#storing-sensitive-info
 */
export default {
  // eslint-disable-next-line no-restricted-globals
  API_HOST: (() => location.host)(),
}
