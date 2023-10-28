import Layout from '@/layout/index.vue'
const LinkMain = {
  path: '/link-man',
  component: Layout,
  redirect: '/link-man/index',
  children: [
    {
      path: 'index',
      name: 'LinkMain',
      component: () => import('@/views/link-man/index'),
      meta: { title: '联系人配置管理', icon: 'dashboard' }
    }
  ]
}

export default LinkMain
