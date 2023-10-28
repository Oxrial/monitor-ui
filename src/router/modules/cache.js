import Layout from '@/layout/index.vue'
const Cache = {
  path: '/cache',
  component: Layout,
  redirect: '/cache/index',
  children: [
    {
      path: 'index',
      name: 'Cache',
      component: () => import('@/views/cache/index'),
      meta: { title: '一级缓存管理', icon: 'dashboard' }
    }
  ]
}
export default Cache
