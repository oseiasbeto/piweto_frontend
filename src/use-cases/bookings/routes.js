export default [
    {
        name: 'Reserva',
        path: '/reserva',
        meta: {
            requiresAuth: false,
            rootPage: 'bookings',
            title: 'Reserva'
        },
        component: () => import('./Layout.vue')
    }
]