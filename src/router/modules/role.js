import Layout from '@/layout/index.vue'
const Role = {
  path: '/role',
  component: Layout,
  // redirect: '/role/index',
  children: [
    {
      path: 'index',
      name: 'Role',
      component: () => import('@/views/role/index'),
      meta: { title: '角色管理', icon: 'dashboard' }
    }
  ]
}

export default Role
