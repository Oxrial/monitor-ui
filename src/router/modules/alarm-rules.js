import Layout from '@/layout/index.vue'
const AlarmRules = {
  path: '/alarm-rules',
  component: Layout,
  children: [
    {
      path: 'ace',
      name: 'Ace',
      component: () => import('@/views/alarm-rules/index'),
      meta: { title: 'ACE', icon: 'dashboard' }
    }
  ]
}
export default AlarmRules
