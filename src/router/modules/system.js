import Layout from '@/layout/index.vue'
const System = {
  path: '/system',
  component: Layout,
  // redirect: '/system/index',
  children: [
    {
      path: 'index',
      name: 'System',
      component: () => import('@/views/system/index'),
      meta: { title: '应用系统管理', icon: 'dashboard' }
    }
  ]
}

export default System
