export default [
    {
        name: 'Dashboard',
        path: '/gerenciador-de-eventos/pagina-inicial/:id',
        meta: {
            requiresAuth: true,
            rootPage: 'dashboard',
            title: 'Pagina inicial | Gerenciador de eventos'
        },
        component: () => import('./Layout.vue')
    },
    {
        name: 'Partakers',
        path: '/gerenciador-de-eventos/participantes/:id',
        meta: {
            requiresAuth: true,
            rootPage: 'dashboard',
            title: 'Participantes | Gerenciador de eventos'
        },
        component: () => import('./Layout.vue')
    },
    {
        name: 'Finance',
        path: '/gerenciador-de-eventos/financeiro/:id',
        meta: {
            requiresAuth: true,
            rootPage: 'dashboard',
            title: 'Financeiro | Gerenciador de eventos'
        },
        component: () => import('./Layout.vue')
    },
    {
        name: 'Staffs',
        path: '/gerenciador-de-eventos/colaboradores/:id',
        meta: {
            requiresAuth: true,
            rootPage: 'dashboard',
            title: 'Colaboradores | Gerenciador de eventos'
        },
        component: () => import('./Layout.vue')
    }
]