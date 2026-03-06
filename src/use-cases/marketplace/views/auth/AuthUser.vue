<script setup>
import Logo from "@/components/Logo.vue";
import SigninForm from "../../components/forms/auth/SigninForm.vue"
</script>

<template>
    <div class="lg:w-80 h-[calc(100vh-56px)] lg:h-full flex flex-col justify-center p-4 bg-white my-6 lg:my-12 mx-auto">
        <div class="flex justify-center mb-6">
           <Logo size="w-[84px] ml-[-4px] lg:ml-0 lg:w-[100px]" /> 
        </div>
        
        <SigninForm/>
    </div>
</template>