import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/tariff',
            component: AppLayout,
            children: [
                {
                    path: '/tariff',
                    name: 'tariff',
                    component: () => import('@/views/public/Tariff.vue')
                }
            ]
        }
    ]
});
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.sessionUser) {
        // El usuario no está autenticado, redirige a la página de inicio de sesión
        next('/login');
    } else if (to.meta.roles && !authStore.hasRole(to.meta.roles)) {
        // El usuario no tiene el rol requerido para acceder a la ruta
        // Por ejemplo, si la ruta requiere ['administrador', 'medico'] y el usuario es 'admisionista', no tendrá acceso.
        next('/unauthorized');
    } else {
        // El usuario está autenticado y tiene el rol requerido para acceder a la ruta
        next();
    }
});
export default router;
