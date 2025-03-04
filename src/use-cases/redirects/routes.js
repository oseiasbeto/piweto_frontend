export default [
    {
        name: 'Check account',
        path: '/conta/confirmar-email',
        meta: {
            requiresAuth: false,
            rootPage: 'redirects',
            title: 'Piweto'
        },
        component: () => import('./Layout.vue')
    }
]