export default [
    {
        name: 'My events',
        path: '/eventos/meus-eventos',
        meta: {
            requiresAuth: true,
            rootPage: 'events',
            title: 'Meus eventos'
        },
        component: () => import('./Layout.vue')
    },
    {
        name: 'Edit event',
        path: '/eventos/:id',
        meta: {
            requiresAuth: true,
            rootPage: 'events',
            title: 'Editar evento'
        },
        component: () => import('./Layout.vue')
    },
    {
        name: 'New event',
        path: '/eventos/novo-evento',
        meta: {
            requiresAuth: true,
            rootPage: 'events',
            title: 'Novo evento'
        },
        component: () => import('./Layout.vue')
    }
]