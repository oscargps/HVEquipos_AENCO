import Vue from 'vue'
import Router from 'vue-router'
import Listado from '@/components/Listado'
import Historial from '@/components/Historial'
import Nuevo from '@/components/Nuevo'
Vue.use(Router)

export default new Router({
  mode:"history",
  routes: [
    {
      path: '/',
      name: 'Listado',
      component: Listado
    },
    {
        path: '/historial',
        name: 'historial',
        component: Historial
      },
      {
          path: '/Nuevo',
          name: 'Nuevo',
          component: Nuevo
        }
  ]
})