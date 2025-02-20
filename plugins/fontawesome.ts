import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChartLine, faClipboardCheck, faClock, faGear, faTasks, faUsers, faCheck } from '@fortawesome/free-solid-svg-icons'

config.autoAddCss = false

library.add(faChartLine, faClipboardCheck, faClock, faGear, faTasks, faUsers, faCheck)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})
