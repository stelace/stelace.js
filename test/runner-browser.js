// This file is required due to an issue with karma-tap
// https://github.com/tmcw-up-for-adoption/karma-tap/issues/10

require('./Resource.spec.js')
require('./stelace.spec.js')
require('./utils.spec.js')

require('./resources/ApiKeys.spec.js')
require('./resources/Assets.spec.js')
require('./resources/AssetTypes.spec.js')
require('./resources/Auth.spec.js')
require('./resources/Availabilities.spec.js')
require('./resources/Categories.spec.js')
require('./resources/Config.spec.js')
require('./resources/CustomAttributes.spec.js')
require('./resources/Events.spec.js')
require('./resources/Password.spec.js')
require('./resources/Roles.spec.js')
require('./resources/Search.spec.js')
require('./resources/Transactions.spec.js')
require('./resources/Users.spec.js')
require('./resources/Webhooks.spec.js')
require('./resources/Workflows.spec.js')
