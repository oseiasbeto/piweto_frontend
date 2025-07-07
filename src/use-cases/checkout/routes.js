export default [
    {
        name: 'Cart',
        path: '/checkout/carrinho/:slug',
        meta: {
            requiresAuth: false,
            rootPage: 'checkout',
            title: 'Detalhes da compra'
        },
        component: () => import('./Layout.vue')
    },
    {
        name: 'Order',
        path: '/checkout/detalhes-do-pedido/:id',
        meta: {
            requiresAuth: false,
            rootPage: 'checkout',
            title: 'Detalhes do pedido'
        },
        component: () => import('./Layout.vue')
    },
    {
        name: 'Details event',
        path: '/evento/:slug',
        meta: {
            requiresAuth: false,
            title: 'Detalhes do evento'
        },
        component: () => import('./Layout.vue')
    }
]