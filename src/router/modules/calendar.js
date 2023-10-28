import Layout from '@/layout/index.vue'
const Calendar = {
  path: '/calendar',
  component: Layout,
  redirect: '/calendar/index',
  meta: {
    title: '日历',
    icon: 'nested'
  },
  children: [
    {
      path: 'index',
      name: 'VCalendar',
      component: () => import('@/views/calendar/index'),
      meta: { title: 'v-calendar', icon: 'dashboard' }
    },
    {
      path: 'fullcalendar',
      name: 'FullCalendar',
      component: () => import('@/views/fullcalendar/index'),
      meta: { title: 'fullcalendar', icon: 'dashboard' }
    },
    {
      path: 'tcalendar',
      name: 'TCalendar',
      component: () => import('@/views/tcalendar/demo'),
      meta: { title: 'tcalendar', icon: 'dashboard' }
    },
    {
      path: 'selector',
      name: 'Selector',
      component: () => import('@/views/selector/index'),
      meta: { title: 'Selector', icon: 'dashboard' }
    }
  ]
}
export default Calendar
