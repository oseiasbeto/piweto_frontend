import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import store from './store'
import VueLazyload from 'vue-lazyload'
import { plugin as VueTippy } from 'vue-tippy'

// Importa todos os estoçps da aplicação
import "vue3-toastify/dist/index.css"
import 'quill/dist/quill.snow.css';
import '@jobinsjp/vue3-datepicker/index.css';
import 'tippy.js/dist/tippy.css' // optional for styling 
import "intl-tel-input/build/css/intlTelInput.css"
//import "vue-multiselect/dist/vue-multiselect.css";
import "./styles.css";

const app = createApp(App)
app.use(router)
app.use(store)
app.use(
    VueTippy,
    // optional
    {
        directive: 'tippy', // => v-tippy
        component: 'tippy', // => <tippy/>
        componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
        defaultProps: {
            placement: 'auto-end',
            allowHTML: true,
        }, // => Global default options * see all props
    }
)
app.use(VueLazyload)
app.mount('#app')