import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Panel from "primevue/panel";
import RadioButton from 'primevue/radiobutton'
import Divider from 'primevue/divider';
import Tag from 'primevue/tag'
import Chip from 'primevue/chip'
import Toolbar from 'primevue/toolbar'
import Tooltip from 'primevue/tooltip'
import ConfirmPopup from 'primevue/confirmpopup'
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmationService from 'primevue/confirmationservice';

import App from './App.vue'
import 'primeflex/primeflex.css'

//import "primevue/resources/themes/bootstrap4-light-blue/theme.css";
import '@/assets/themes/stanford/theme.scss'
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css'
// import './assets/main.css'

const app = createApp(App)
    .use(PrimeVue)
    .use(ToastService)
    .use(ConfirmationService)
    .component('Accordion', Accordion)
    .component('AccordionTab', AccordionTab)
    .component( 'Badge', Badge)
    .component( 'Button', Button)
    .component( 'Calendar', Calendar)
    .component( 'Card', Card)
    .component( 'Checkbox', Checkbox)
    .component( 'Column', Column)
    .component( 'DataTable', DataTable)
    .component( 'Dialog', Dialog)
    .component( 'Dropdown', Dropdown)
    .component( 'InputNumber', InputNumber)
    .component( 'InputSwitch', InputSwitch)
    .component( 'InputText', InputText)
    .component('Message', Message)
    .component( 'Panel', Panel)
    .component( 'RadioButton', RadioButton)
    .component( 'Divider', Divider)
    .component( 'Chip', Chip)
    .component( 'ConfirmPopup', ConfirmPopup)
    .component( 'ConfirmDialog', ConfirmDialog)
    .component( 'Tag', Tag)
    .component( 'Toolbar', Toolbar)
    .directive('tooltip', Tooltip)
    .mount('#app')


