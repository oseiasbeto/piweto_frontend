export default [
    {
        name: 'Active email',
        path: '/conta/activar-email',
        meta: {
            requiresAuth: false,
            rootPage: 'redirects',
            title: 'Piweto'
        },
        component: () => import('./Layout.vue')
    }
]