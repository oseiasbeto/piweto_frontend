<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const route = useRoute()
const store = useStore()


const isViewMobile = computed(() => {
    return store.getters.isViewMobile
})

const staff = computed(() => {
    return store.getters.staff
})

const closeViewMobile = () => {
    store.dispatch("closeIsViewMobile")
}

</script>

<template>
    <div class="w-[120px] z-[111] transition-all lg:block lg:left-0 fixed h-screen lg:top-[70px] bg-[#494b57] text-white shrink-0"
        :class="isViewMobile ? 'left-0' : 'left-[-121px]'">
        <ul>
            <li>
                <router-link @click="closeViewMobile()"
                    class="text-xs text-center px-[10px] hover:bg-[#42434f] py-4 flex items-center flex-col"
                    :class="{ 'bg-[#40414d] border-l-[4px] border-l-brand-primary text-brand-primary border-b border-b-[#6a6c77] border-t border-t-[#494b57]': route.name == 'Dashboard' }"
                    :to="`/gerenciador-de-eventos/pagina-inicial/${route.params.id}?tab=status`">
                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto mt-2 mb-2" width="30px" height="30px" viewBox="0 0 24 24"
                        fill="none">
                        <path
                            d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12M21 12C21 7.02944 16.9706 3 12 3M21 12H19M3 12C3 7.02944 7.02944 3 12 3M3 12H5M12 3V5M13.3229 10.5C12.9703 10.1888 12.5072 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 11.4027 13.7381 10.8665 13.3229 10.5ZM13.3229 10.5L15.8229 8"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    <p class="mx-auto text-white font-medium">Dashboard</p>
                </router-link>
            </li>
            <li>
                <router-link @click="closeViewMobile()"
                    class="text-xs text-center px-[10px] hover:bg-[#42434f] py-4 flex items-center flex-col"
                    :class="{ 'bg-[#40414d] border-l-[4px] border-l-brand-primary text-brand-primary border-b border-b-[#6a6c77] border-t border-t-[#494b57]': route.name == 'Partakers' }"
                    :to="`/gerenciador-de-eventos/participantes/${route.params.id}`">

                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto mt-2 mb-2" width="30px" height="30px"
                        viewBox="0 0 24 24" fill="none">
                        <path d="M18 21V3L15 5L12 3L9 5L6 3V21L9 19.5L12 21L15 19.5L18 21Z" stroke="currentColor"
                            stroke-width="2" stroke-linejoin="round" />
                        <path d="M10 9H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        <path d="M10 15H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        <path d="M10 12H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    <p class="mx-auto text-white font-medium">Participantes</p>
                </router-link>
            </li>
            <li v-if="staff && staff.role !== 'checker'">
                <router-link @click="closeViewMobile()"
                    class="text-xs text-center px-[10px] hover:bg-[#42434f] py-4 flex items-center flex-col"
                    :class="{ 'bg-[#40414d] border-l-[4px] border-l-brand-primary text-brand-primary border-b border-b-[#6a6c77] border-t border-t-[#494b57]': route.name == 'Staffs' }"
                    :to="`/gerenciador-de-eventos/colaboradores/${route.params.id}`">

                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto mt-2 mb-2" width="30px" height="30px"
                        viewBox="0 0 24 24" fill="none">
                        <g id="User / Users_Group">
                            <path id="Vector"
                                d="M17 20C17 18.3431 14.7614 17 12 17C9.23858 17 7 18.3431 7 20M21 17.0004C21 15.7702 19.7659 14.7129 18 14.25M3 17.0004C3 15.7702 4.2341 14.7129 6 14.25M18 10.2361C18.6137 9.68679 19 8.8885 19 8C19 6.34315 17.6569 5 16 5C15.2316 5 14.5308 5.28885 14 5.76389M6 10.2361C5.38625 9.68679 5 8.8885 5 8C5 6.34315 6.34315 5 8 5C8.76835 5 9.46924 5.28885 10 5.76389M12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11C15 12.6569 13.6569 14 12 14Z"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                    </svg>
                    <p class="mx-auto text-white font-medium">Colaboradores</p>
                </router-link>
            </li>
            <li v-if="staff && staff.role !== 'checker'">
                <router-link @click="closeViewMobile()"
                    class="text-xs text-center px-[10px] hover:bg-[#42434f] py-4 flex items-center flex-col"
                    :class="{ 'bg-[#40414d] border-l-[4px] border-l-brand-primary text-brand-primary border-b border-b-[#6a6c77] border-t border-t-[#494b57]': route.name == 'Finance' }"
                    :to="`/gerenciador-de-eventos/financeiro/${route.params.id}`">
                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto mt-2 mb-2" width="30px" height="30px"
                        viewBox="0 0 24 24" fill="none">
                        <path
                            d="M6 17.4998C6.41783 17.186 6.9372 17 7.5 17C8.88071 17 10 18.1193 10 19.5C10 20.0628 9.81403 20.5822 9.50018 21M18 17.4998C17.5822 17.186 17.0628 17 16.5 17C15.1193 17 14 18.1193 14 19.5C14 20.0628 14.186 20.5822 14.4998 21M17.9999 9.99995C18.9883 9.99918 19.5064 9.98663 19.908 9.78201C20.2843 9.59027 20.5903 9.28431 20.782 8.90798C21 8.48016 21 7.9201 21 6.8V6.2C21 5.0799 21 4.51984 20.782 4.09202C20.5903 3.71569 20.2843 3.40973 19.908 3.21799C19.4802 3 18.9201 3 17.8 3H6.2C5.0799 3 4.51984 3 4.09202 3.21799C3.71569 3.40973 3.40973 3.71569 3.21799 4.09202C3 4.51984 3 5.0799 3 6.2V6.8C3 7.9201 3 8.48016 3.21799 8.90798C3.40973 9.28431 3.71569 9.59027 4.09202 9.78201C4.49359 9.98663 5.01167 9.99918 6.00005 9.99995M17.9999 9.99995C18 10.0646 18 10.1312 18 10.2V17.8C18 18.9201 18 19.4802 17.782 19.908C17.5903 20.2843 17.2843 20.5903 16.908 20.782C16.4802 21 15.9201 21 14.8 21H9.2C8.07989 21 7.51984 21 7.09202 20.782C6.71569 20.5903 6.40973 20.2843 6.21799 19.908C6 19.4802 6 18.9201 6 17.8V10.2C6 10.1312 6 10.0646 6.00005 9.99995M17.9999 9.99995C17.9992 9.01163 17.9866 8.49358 17.782 8.09202C17.5903 7.71569 17.2843 7.40973 16.908 7.21799C16.4802 7 15.9201 7 14.8 7H9.2C8.0799 7 7.51984 7 7.09202 7.21799C6.71569 7.40973 6.40973 7.71569 6.21799 8.09202C6.01338 8.49358 6.00082 9.01163 6.00005 9.99995M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <p class="mx-auto text-white font-medium">Financeiro</p>
                </router-link>
            </li>
          
        </ul>
    </div>

</template>