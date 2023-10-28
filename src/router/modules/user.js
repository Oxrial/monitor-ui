import Layout from '@/layout/index.vue'
const User = {
  path: '/user',
  component: Layout,
  // redirect: '/user/index',
  children: [
    {
      path: 'index',
      name: 'user',
      component: () => import('@/views/user/index'),
      meta: { title: '用户管理', icon: 'dashboard' }
    }
  ]
}

export default User