import * as common from './common'
import * as role from './role'
import * as linkMan from './link-man'
import * as system from './system'
import * as monitorConfig from './monitor-config'
import * as collectionConfig from './collection-config'
import * as message from './message'
import * as cache from './cache'
import * as home from './home'
const api = { ...common, ...role, ...linkMan, ...monitorConfig, ...collectionConfig, ...message, ...cache, ...system ,...home}
export default api
