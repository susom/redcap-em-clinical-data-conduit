import { createApp } from 'vue'
import PrimeVue from 'primevue/config';

import Button from 'primevue/button'
import Card from 'primevue/card'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message';
import Panel from "primevue/panel";
import ProgressBar from "primevue/progressbar";
import ProgressSpinner from "primevue/progressspinner";
import Toolbar from 'primevue/toolbar'
import App from './App.vue'
import 'primeflex/primeflex.css'
import '@assets/themes/stanford/theme.scss'
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css'

const app = createApp(App)
    .use(PrimeVue)
    .component( 'Button', Button)
    .component( 'Card', Card)
    .component( 'Column', Column)
    .component( 'DataTable', DataTable)
    .component( 'Dialog', Dialog)
    .component( 'InputText', InputText)
    .component( 'Message', Message)
    .component( 'Panel', Panel)
    .component( 'ProgressBar', ProgressBar)
    .component( 'ProgressSpinner', ProgressSpinner)
    .component( 'Toolbar', Toolbar)
    .mount('#app')
