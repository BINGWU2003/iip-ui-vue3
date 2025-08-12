import { withInstall } from '@bingwu/iip-ui-utils'
import ThemeProvider from './theme-provider.vue'

export const IipThemeProvider = withInstall(ThemeProvider)
export default IipThemeProvider

export * from './types'
