<template>
    <div>
        <!--start tabs-->
        <Tabs :tabs="tabs" v-model="activeTab" />
        <!--end tabs-->

        <!--start container-->
        <div class="py-4 pb-[60px] px-5">
            <div class="bg-white rounded-md shadow-[0_2px_10px_0_rgba(0,0,0,.05)] p-5">
                <Overview v-if="activeTab === 'overview'" />
                <CheckinOnline v-if="activeTab === 'checkin_online'" />
            </div>
        </div>
        <!--end container-->
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Tabs from '../../components/ui/Tabs.vue';
import Overview from './tabs/Overview.vue';
import CheckinOnline from './tabs/CheckinOnline.vue';

const activeTab = ref('overview');

const tabs = ref([
    { label: 'Visão Geral', value: 'overview' },
    { label: 'Check-in online', value: 'checkin_online' },
    { label: 'Check-in via Scanner', value: 'scanner' }
]); 
</script>