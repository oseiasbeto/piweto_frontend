export default [
    {
        name: 'Page not found',
        path: '/:catchAll(.*)',
        meta: {
            requiresAuth: false,
            rootPage: 'marketplace',
            title: '404 - Página não encontrada'
        },
        component: () => import('./Layout.vue')
    },
    {
        name: 'Marketplace',
        path: '/',
        meta: {
            requiresAuth: false,
            rootPage: 'marketplace',
            title: 'Piweto - Ingressos para Eventos, Teatros, Shows e mais'
        },
        component: () => import('./Layout.vue')
    },
    {
        name: 'My tickets',
        path: '/meus-ingressos',
        meta: {
            requiresAuth: true,
            rootPage: 'marketplace',
            title: 'Piweto | Meus ingressos'
        },
        component: () => import('./Layout.vue')
    },
    {
        name: 'Terms of use',
        path: '/termos-de-uso',
        meta: {
            requiresAuth: false,
            rootPage: 'marketplace',
            title: 'Piweto | Termos de Uso'
        },
        component: () => import('./Layout.vue')
    },
    {
        name: 'How does it work',
        path: '/vender-ingressos-online',
        meta: {
            requiresAuth: false,
            rootPage: 'marketplace',
            title: 'Piweto | Como funciona?'
        },
        component: () => import('./Layout.vue')
    },
    {
        name: 'Privacy Policy',
        path: '/politica-de-privacidade',
        meta: {
            requiresAuth: false,
            rootPage: 'marketplace',
            title: 'Piweto | Política de privacidade'
        },
        component: () => import('./Layout.vue')
    },
    {
        name: 'Auth user',
        path: '/conta/login',
        meta: {
            routeAuth: true,
            rootPage: 'marketplace',
            title: 'Piweto | Login'
        },
        component: () => import('./Layout.vue')
    },
    {
        name: 'Register user',
        path: '/conta/registrar-se',
        meta: {
            routeAuth: true,
            rootPage: 'marketplace',
            title: 'Piweto | Registrar-se'
        },
        component: () => import('./Layout.vue')
    },
    {
        name: 'Forgot password',
        path: '/conta/esqueci-a-senha',
        meta: {
            requiresAuth: false,
            rootPage: 'marketplace',
            title: 'Piweto | Esqueci a palavra-passe'
        },
        component: () => import('./Layout.vue')
    },
    {
        name: 'Reset password',
        path: '/conta/redefinir-senha',
        meta: {
            requiresAuth: false,
            rootPage: 'marketplace',
            title: 'Piweto | Redefinir a palavra-passe'
        },
        component: () => import('./Layout.vue')
    },
    {
        name: 'Check email',
        path: '/conta/verificar-email',
        meta: {
            requiresAuth: true,
            rootPage: 'marketplace',
            title: 'Piweto | Verificar email'
        },
        component: () => import('./Layout.vue')
    },
    {
        name: 'Search',
        path: '/eventos/pesquisar',
        meta: {
            requiresAuth: false,
            rootPage: 'marketplace',
            title: 'Piweto | Pesquisar'
        },
        component: () => import('./Layout.vue')
    },
    {
        name: 'Page not found api',
        path: '/404',
        meta: {
            requiresAuth: false,
            rootPage: 'marketplace',
            title: '404 - Página não encontrada'
        },
        component: () => import('./Layout.vue')
    },
    {
        name: 'Internal error server',
        path: '/500',
        meta: {
            requiresAuth: false,
            rootPage: 'marketplace',
            title: '500 - Erro interno'
        },
        component: () => import('./Layout.vue')
    }
]