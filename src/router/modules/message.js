import Layout from '@/layout/index.vue'
const Message = {
  path: '/message',
  component: Layout,
  redirect: '/message/index',
  children: [
    {
      path: 'index',
      name: 'Message',
      component: () => import('@/views/message/index'),
      meta: { title: '短信管理', icon: 'dashboard' }
    }
  ]
}

export default Message
