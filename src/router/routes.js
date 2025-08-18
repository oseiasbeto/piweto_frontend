import { routes as marketplace } from '../use-cases/marketplace'
import { routes as events } from '../use-cases/events'
import { routes as checkout } from '../use-cases/checkout'
import { routes as dashboard } from '../use-cases/dashboard'
import { routes as redirects } from '../use-cases/redirects'
import { routes as bookings } from '../use-cases/bookings'

export default [
    ...marketplace,
    ...events,
    ...checkout,
    ...dashboard,
    ...redirects,
    ...bookings
]