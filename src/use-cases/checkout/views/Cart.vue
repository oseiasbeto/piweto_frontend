<template>
    <div v-show="!isLoading">
        <div v-if="cart">
            <Header />
            <!--data start-->
            <Container>
                <div class="mt-16 mb-10 lg:mt-8">

                    <div class="flex gap-4 lg:gap-8 px-0 lg:px-4 lg:flex-row justify-between">
                        <div class="flex-shrink-0 flex flex-col gap-2 lg:gap-5 w-full lg:w-2/3">
                            <!--start forn-->
                            <div
                                class="p-4 lg:p-8 bg-white w-full shadow-[0px_1px_2px_0px_rgba(25,31,40,0.15)] lg:rounded-[8px]">
                                <div>
                                    <div class="mb-6">
                                        <div class="flex mb-4 items-center gap-2 ">
                                            <div
                                                class="flex shrink-0 justify-center items-center w-7 h-7 mx-0.5 border border-[rgb(58,175,255)] rounded-full text-sm font-bold bg-[rgb(230,244,255)] text-[rgb(0,151,255)]">
                                                1
                                            </div>
                                            <h1 style="letter-spacing: 0.2px; line-height: 1.2"
                                                class="text-base lg:text-lg text-[rgb(76,87,108)]  font-bold">
                                                Informações do
                                                participante
                                            </h1>
                                        </div>

                                        <div class="border border-[#0097ff] bg-[#e6f4ff] rounded-[8px] gap-3 text-sm py-3 px-3 flex justify-between items-center flex-col lg:flex-row"
                                            v-if="!hasLogged">
                                            <div class="text-xs lg:text-sm text-[#848c9b]">Compra mais rápida e mais
                                                segura
                                            </div>
                                            <div class="outline-none" ref="googleButtonRef"></div>
                                            <div>
                                                <button @click="goToLogin()"
                                                    class="rounded-lg outline-none border font-semibold text-xs lg:text-sm leading-4 font-sans inline-flex items-center justify-center min-w-fit w-max cursor-pointer no-underline text-[rgb(0,151,255)] bg-transparent border-transparent px-4">
                                                    Acessar de outro jeito
                                                </button>
                                            </div>
                                        </div>

                                        <div v-else
                                            class="bg-[rgb(245,247,248)] gap-3 text-sm py-4 px-3 flex items-center text-[rgb(25,31,40)]">
                                            <div
                                                class="h-10 w-10 border shrink-0 border-[rgb(221,224,228)] rounded-[1000vw] flex items-center justify-center">
                                                <svg width="24" height="24" viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" fill="rgb(0, 151, 255)"
                                                        clip-rule="evenodd"
                                                        d="M12 12C12.7911 12 13.5645 11.7654 14.2223 11.3259C14.8801 10.8864 15.3928 10.2616 15.6955 9.53074C15.9983 8.79983 16.0775 7.99556 15.9231 7.21964C15.7688 6.44372 15.3878 5.73098 14.8284 5.17157C14.269 4.61216 13.5563 4.2312 12.7804 4.07686C12.0044 3.92252 11.2002 4.00173 10.4693 4.30448C9.73836 4.60723 9.11365 5.11992 8.67412 5.77772C8.2346 6.43552 8 7.20888 8 8C8 9.06087 8.42143 10.0783 9.17157 10.8284C9.92172 11.5786 10.9391 12 12 12ZM12 10C12.3956 10 12.7822 9.8827 13.1111 9.66294C13.44 9.44318 13.6964 9.13082 13.8478 8.76537C13.9991 8.39992 14.0387 7.99778 13.9616 7.60982C13.8844 7.22186 13.6939 6.86549 13.4142 6.58579C13.1345 6.30608 12.7781 6.1156 12.3902 6.03843C12.0022 5.96126 11.6001 6.00087 11.2346 6.15224C10.8692 6.30362 10.5568 6.55996 10.3371 6.88886C10.1173 7.21776 10 7.60444 10 8C10 8.53044 10.2107 9.03914 10.5858 9.41422C10.9609 9.78929 11.4696 10 12 10ZM9 15C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V20C5 20.2652 4.89464 20.5196 4.70711 20.7071C4.51957 20.8946 4.26522 21 4 21C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V19C3 17.4087 3.63214 15.8826 4.75736 14.7574C5.88258 13.6321 7.4087 13 9 13H15C16.5913 13 18.1174 13.6321 19.2426 14.7574C20.3679 15.8826 21 17.4087 21 19V20C21 20.2652 20.8946 20.5196 20.7071 20.7071C20.5196 20.8946 20.2652 21 20 21C19.7348 21 19.4804 20.8946 19.2929 20.7071C19.1054 20.5196 19 20.2652 19 20V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9Z">
                                                    </path>
                                                </svg>
                                            </div>
                                            <div class="flex w-full items-center justify-between"
                                                :class="{ 'pointer-events-none opacity-50': logoutLoading }">
                                                <div class="flex-1">
                                                    <div
                                                        class="font-bold text-sm text-[rgb(25,31,40)] max-w-full lg:w-full truncate">
                                                        {{ user.first_name }} {{
                                                            user.last_name }}</div>
                                                    <div
                                                        class="max-w-full mt-1 text-xs text-[rgb(76,87,108)] lg:w-full truncate">
                                                        {{ user.email || `+244 ${user.phone}` }}
                                                    </div>
                                                </div>
                                                <div>
                                                    <button @click="handleLogout()" :disabled="logoutLoading"
                                                        class="rounded-lg outline-none border font-semibold text-sm leading-4 font-sans inline-flex items-center justify-center min-w-fit w-max cursor-pointer transition-all duration-200 ease-in no-underline text-[rgb(0,151,255)] bg-transparent border-transparent px-4 py-3">
                                                        Sair
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <!--start name costumer group-->
                                    <div class="flex gap-4 flex-col lg:flex-row item-center">
                                        <div class="flex flex-1 flex-col mb-4">
                                            <label class="text-xs text-gray-500 mb-2 font-bold" for="fullName">Nome
                                                completo
                                                <span class="text-brand-danger">*</span></label>
                                            <input
                                                class="outline-none w-full h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4"
                                                id="fullName" @input="validateFullName" autocomplete="off"
                                                oncontextmenu="false" v-model="form.fullName"
                                                :class="{ '!border-brand-danger': errors.fullName.show }">
                                            <span class="text-brand-danger text-xs font-medium my-1"
                                                v-if="errors.fullName.show">
                                                {{ errors.fullName.message }}
                                            </span>

                                        </div>

                                    </div>
                                    <!--end name costumer group-->

                                    <!--start number phone group-->
                                    <div class="flex flex-col my-4">
                                        <label class="text-xs text-gray-500 mb-2 font-bold" for="phone">Número de
                                            telefone
                                            <span class="text-brand-danger">*</span></label>
                                        <input
                                            class="outline-none w-full h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4"
                                            @input="validatePhone" type="tel" ref="inputPhone" autocomplete="off"
                                            oncontextmenu="false" v-model="form.phone"
                                            :class="{ '!border-brand-danger': errors.phone.show }">
                                        <span class="text-brand-danger text-xs font-medium my-1"
                                            v-if="errors.phone.show">
                                            {{ errors.phone.message }}
                                        </span>
                                    </div>
                                    <!--end number phone group-->

                                    <!--start e-mail form-->
                                    <div class="flex gap-4 flex-col lg:flex-row item-center">
                                        <div class="flex flex-1 flex-col mb-4">
                                            <label class="text-xs text-gray-500 mb-2 font-bold" for="email">E-mail <span
                                                    class="text-brand-danger">*</span></label>
                                            <input
                                                class="outline-none w-full h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4"
                                                id="email" @input="validateEmail" autocomplete="off"
                                                oncontextmenu="false" v-model="form.email"
                                                :class="{ '!border-brand-danger': errors.email.show }">
                                            <span class="text-brand-danger text-xs font-medium my-1"
                                                v-if="errors.email.show">
                                                {{ errors.email.message }}
                                            </span>

                                        </div>
                                        <div class="flex flex-1 flex-col mb-4">
                                            <label class="text-xs text-gray-500 mb-2 font-bold" for="email">Confirmação
                                                do
                                                e-mail <span class="text-brand-danger">*</span></label>
                                            <input
                                                class="outline-none w-full h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4"
                                                @input="validateConfirmEmail" autocomplete="off" oncontextmenu="false"
                                                v-model="form.confirmEmail"
                                                :class="{ '!border-brand-danger': errors.confirmEmail.show }">
                                            <span class="text-brand-danger text-xs font-medium my-1"
                                                v-if="errors.confirmEmail.show">
                                                {{ errors.confirmEmail.message }}
                                            </span>

                                        </div>
                                    </div>
                                    <!--end e-mail form-->
                                    <div
                                        class="after:content-[''] after:block after:w-3.5 after:h-3.5 after:absolute after:rotate-45 after:bg-white after:border-t after:border-l after:border-gray-300 after:-top-2 after:left-5 leading-6 border border-gray-300 p-2.5 rounded-md bg-white text-xs relative my-[10px] mb-[25px]">
                                        Os ingressos serão enviados por
                                        e-mail assim que recebermos a confirmação do pagamento.
                                    </div>
                                </div>
                            </div>
                            <!--end form-->

                            <!--start payment methods-->
                            <div
                                class="p-4 lg:p-8 bg-white w-full shadow-[0px_1px_2px_0px_rgba(25,31,40,0.15)] lg:rounded-[8px]">

                                <div class="mb-3">
                                    <div class="flex mb-4 items-center gap-2">
                                        <div
                                            class="flex shrink-0 justify-center items-center w-7 h-7 mx-0.5 border border-[rgb(58,175,255)] rounded-full text-sm font-bold bg-[rgb(230,244,255)] text-[rgb(0,151,255)]">
                                            2
                                        </div>
                                        <h1 style="letter-spacing: 0.2px; line-height: 1.2"
                                            class="text-base lg:text-lg text-[rgb(76,87,108)]  font-bold">Informações de
                                            pagamento
                                        </h1>
                                    </div>

                                    <div class="flex gap-2 items-center">
                                        <div @click="changeProvidePayment('emis')"
                                            class="w-[112px] lg:w-[144px] transition-all duration-100 ease-in items-center cursor-pointer overflow-hidden relative py-3 text-sm text-center flex flex-col h-[110px] rounded-[8px] shadow-[10px_4px_14px_rgba(219,219,219,.2)]"
                                            :class="{ 'text-[rgb(0,151,255)] font-bold border border-[rgb(0,151,255)] bg-[rgba(230,244,255,0.61)]': form.providerPayment === 'emis' }">
                                            <div class="h-[50px] flex items-center">
                                                <svg class="w-[80px] lg:w-[94px]" xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 229 42">
                                                    <defs>
                                                        <path id="a" d="M0 0h41.48v41.197H0z" />
                                                    </defs>
                                                    <g fill="none" fill-rule="evenodd">
                                                        <path
                                                            d="M120.589 21.737v-1.378h-7.172v-5.563h-1.39v14.833c0 2.119 1.73 3.84 3.865 3.84h11.738v-1.59h-12.143c-1.119 0-2.07-.757-2.07-2.01v-8.132h7.172zm34.433 11.732v-3.266h-14.758c-.555 0-.931-.328-.931-.887v-10.52c0-.552.331-.925.893-.925h11.68v4.84h3.116v-7.917h-14.649c-2.316.133-4.152 2.043-4.152 4.375v9.916c0 2.42 1.976 4.384 4.415 4.384h14.386zM92.927 14.796v14.833c0 2.119 1.73 3.84 3.864 3.84h11.74v-1.59H96.39c-1.122 0-2.071-.757-2.071-2.01V14.795h-1.39zm-5.095 0v17.29H77.48c-1.121 0-2.069-.755-2.069-2.01v-15.28H73.83v14.833c0 2.121 1.728 3.84 3.865 3.84H89.43V14.796h-1.599zM59.45 33.469h1.599V18.23c0-1.114.762-2.053 2.024-2.053h3.61c1.118 0 2.067.755 2.067 2.01V33.47h1.583V18.631c0-2.12-1.733-3.837-3.866-3.837h-3.151a3.868 3.868 0 00-3.067 1.502 3.864 3.864 0 00-3.064-1.502H54.03c-2.135 0-3.864 1.718-3.864 3.837v14.838h1.599V18.23c0-1.114.76-2.053 2.024-2.053h3.607c1.12 0 2.07.755 2.07 2.01v.087c-.01.12-.017.24-.017.358V33.47zm71.677 0h1.6V14.796h-1.6v18.673zm0-21.437h1.6V8.935h-1.6v3.097zm75.11 2.773h-3.29v3.888c0 .552-.33.925-.891.925h-10.59c-.559 0-.933-.328-.933-.887v-3.926h-3.097v3.78c.136 2.301 2.057 4.124 4.405 4.124h9.983c2.437 0 4.413-1.966 4.413-4.385v-3.52zm-18.8 18.664h3.286v-5.58c0-.55.331-.923.894-.923h10.587c.56 0 .936.326.936.885v5.618h3.097v-5.473c-.136-2.3-2.057-4.123-4.405-4.123h-9.985c-2.435 0-4.41 1.964-4.41 4.384v5.212zm-13.438-14.137v14.137h3.321V19.176c0-2.423-1.976-4.382-4.413-4.382h-9.982c-2.349 0-4.268 1.822-4.404 4.122v10.178c0 2.33 1.834 4.242 4.15 4.375h9.914v-3.086l-10.06.009c-.069 0-.136-.005-.2-.016-.44-.08-.695-.425-.695-.912v-1.617l-.011-9.075c0-.56.375-.888.931-.888h10.59c.56 0 .892.37.892.926l-.033.522zm51.212 0v14.137h3.322V19.176c0-2.423-1.975-4.382-4.412-4.382h-9.983c-2.348 0-4.266 1.822-4.403 4.122v10.178c0 2.33 1.836 4.242 4.15 4.375h9.914v-3.086l-10.064.009c-.067 0-.134-.005-.196-.016-.44-.08-.695-.425-.695-.912v-1.617l-.013-9.075c0-.56.374-.888.932-.888h10.589c.564 0 .895.37.895.926l-.036.522zm-44.394-7.3h3.12V8.935h-3.12v3.097zm0 21.437h3.12V14.805h-3.12v18.664z"
                                                            fill="#002133" />
                                                        <g transform="translate(.54 .417)">
                                                            <mask id="b" fill="#fff">
                                                                <use xlink:href="#a" />
                                                            </mask>
                                                            <path
                                                                d="M14.548 20.599c0 3.396 2.772 6.15 6.191 6.15 3.42 0 6.192-2.754 6.192-6.15 0-3.398-2.772-6.152-6.192-6.152-3.419 0-6.19 2.754-6.19 6.152m-9.701-1.557c-.62-.625-1.093-1.393-1.316-2.222l-1.258-4.66c-.57-2.112.692-3.823 2.817-3.823h5.523c.006-.878.219-1.753.65-2.498l2.43-4.177c1.098-1.893 3.209-2.218 4.71-.724l3.907 3.879c.629-.617 1.402-1.086 2.236-1.31L29.24 2.26c2.125-.566 3.848.687 3.848 2.798v5.486c.884.008 1.765.217 2.513.647l4.206 2.412c1.906 1.092 2.232 3.189.73 4.682l-3.81 3.784c.637.633 1.124 1.414 1.352 2.258l1.258 4.662c.568 2.11-.694 3.82-2.818 3.82h-5.387c0 .897-.213 1.79-.652 2.549l-2.429 4.178c-1.1 1.893-3.21 2.217-4.711.724l-3.811-3.785c-.637.634-1.423 1.117-2.273 1.343l-4.693 1.25c-2.124.565-3.846-.688-3.846-2.8v-5.612c-.991.048-1.998-.16-2.838-.64l-4.206-2.413c-1.905-1.092-2.231-3.189-.728-4.68l3.904-3.88"
                                                                fill="#FF7C00" mask="url(#b)" />
                                                        </g>
                                                        <path
                                                            d="M13.339 13.156h-7.63l-.2-.764c-.132-.498.124-.79.62-.79h5.62l1.59 1.554zm7.945-.597a8.624 8.624 0 00-3.698.856l-3.79-3.765c-.355-.352-.389-.854-.131-1.295l1.622-2.767 6.002 5.96-.005 1.011zm.018-2.674l-5.386-5.368.394-.672c.26-.444.65-.471 1-.122l3.974 3.946.018 2.216zm6.043 5.16a8.565 8.565 0 00-3.223-1.994V7.726c0-.495.334-.877.829-1.006l3.116-.818v8.43l-.722.713zm1.918-1.88V5.586l.77-.198c.499-.131.795.122.795.615v5.583l-1.565 1.579zm.6 7.894a8.498 8.498 0 00-.861-3.674l3.79-3.766c.354-.351.86-.386 1.303-.129l2.786 1.612-6.001 5.96-1.018-.003zm2.693.018l5.404-5.35.676.39c.446.259.474.646.123.994l-3.973 3.948-2.23.018zm-5.194 6.002a8.51 8.51 0 002.006-3.202h5.36c.5 0 .883.332 1.013.823l.823 3.098h-8.486l-.716-.719zm1.892 1.905l7.628.012.2.753c.133.496-.125.788-.619.788h-5.62l-1.59-1.553zm-7.947.597a8.633 8.633 0 003.7-.856l3.789 3.766c.353.35.39.854.13 1.294l-1.622 2.767-6.001-5.96.004-1.011zm-.017 2.675l5.385 5.367-.394.673c-.26.444-.649.471-1 .124l-3.974-3.95-.017-2.214zm-6.043-5.16a8.568 8.568 0 003.224 1.993v5.326c0 .496-.335.876-.83 1.007l-3.118.816v-8.43l.724-.711zm-1.917 1.88v7.578l-.771.198c-.499.132-.794-.122-.794-.616v-5.581l1.565-1.58zm-.602-7.895a8.483 8.483 0 00.861 3.675L9.8 28.52c-.353.351-.86.386-1.302.13L5.71 27.037l6.002-5.96 1.016.003zm-2.692-.017l-5.403 5.351-.677-.393c-.447-.259-.475-.645-.124-.993l3.973-3.948 2.231-.017zm5.194-6.004a8.526 8.526 0 00-2.007 3.203h-5.36c-.5 0-.883-.33-1.013-.824l-.823-3.095h8.486l.717.716z"
                                                            fill="#F00041" />
                                                    </g>
                                                </svg>

                                            </div>

                                            <span
                                                class="w-[112px] px-4 lg:px-0 text-xs lg:text-sm lg:w-[100px] mx-auto leading-4">Multicaixa</span>

                                            <div v-if="form.providerPayment === 'emis'"
                                                class=" absolute flex items-center justify-center right-[-2px] w-[22px] h-[22px] rounded-tl-[10px] rounded-tr-none rounded-br-none rounded-bl-none bg-[rgb(0,151,255,0.61)] bottom-0">
                                                <span
                                                    class="w-[10px] h-[10px] relative rounded-[3px] after:content-[''] after:absolute after:left-0 after:-top-[3px] after:w-[7px] after:h-[12px] after:border-r-2 after:border-b-2 after:border-white after:[transform:rotate(45deg)]"></span>
                                            </div>
                                        </div>

                                        <div @click="changeProvidePayment('paypay')"
                                            class="w-[110px] lg:w-[144px] transition-all duration-100 ease-in items-center cursor-pointer overflow-hidden relative py-3 text-sm text-center flex flex-col h-[110px] rounded-[8px] shadow-[10px_4px_14px_rgba(219,219,219,.2)]"
                                            :class="{ 'text-[rgb(0,151,255)] font-bold border border-[rgb(0,151,255)] bg-[rgb(230,244,255)]': form.providerPayment === 'paypay' }">
                                            <div class="h-[50px] flex items-center">
                                                <img class="mx-auto" src="@/assets/imgs/paypay.png" width="50px">
                                            </div>

                                            <span
                                                class="w-[110px] px-4 lg:px-0 text-xs lg:text-sm lg:w-[100px] mx-auto leading-4">PayPay</span>

                                            <div v-if="form.providerPayment === 'paypay'"
                                                class=" absolute flex items-center justify-center right-[-2px] w-[22px] h-[22px] rounded-tl-[10px] rounded-tr-none rounded-br-none rounded-bl-none bg-[rgb(0,151,255)] bottom-0">
                                                <span
                                                    class="w-[10px] h-[10px] relative rounded-[3px] after:content-[''] after:absolute after:left-0 after:-top-[3px] after:w-[7px] after:h-[12px] after:border-r-2 after:border-b-2 after:border-white after:[transform:rotate(45deg)]"></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-show="form.providerPayment === 'emis'">
                                        <div class="py-4">
                                            <h5 class="text-sm lg:text-base text-[rgb(76,87,108)]  font-bold">Opções
                                            </h5>
                                        </div>


                                        <div class="flex flex-col lg:flex-row items-center gap-2">
                                            <div @click="form.paymentMethod = 'mul'"
                                                class="w-full lg:w-auto px-4 transition-all duration-100 ease-in items-center text-gray-400 border border-gray-300 cursor-pointer overflow-hidden relative py-3 text-sm flex flex-col rounded-[8px]"
                                                :class="{ '!text-[rgb(0,151,255)] font-bold !border-[rgb(0,151,255)] bg-[rgba(230,244,255,0.61)]': form.paymentMethod === 'mul' }">


                                                <span class="text-xs lg:text-sm leading-4">Multicaixa Express</span>
                                            </div>

                                            <div @click="form.paymentMethod = 'reference'"
                                                class="w-full lg:w-auto px-4 transition-all duration-100 ease-in items-center cursor-pointer overflow-hidden relative text-gray-400 border border-gray-300 py-3 text-sm flex flex-col rounded-[8px]"
                                                :class="{ '!text-[rgb(0,151,255)] font-bold !border-[rgb(0,151,255)] bg-[rgba(230,244,255,0.61)]': form.paymentMethod === 'reference' }">


                                                <span class="text-xs lg:text-sm leading-4">Pagamento por
                                                    Referência</span>
                                            </div>
                                        </div>

                                        <!--start multicaixa number phone group-->
                                        <div v-show="form.paymentMethod === 'mul'"
                                            class="flex flex-col lg:mt-7 mt-4 mb-4">
                                            <label class="text-xs text-gray-500 mb-2 font-bold" for="phone">Número do
                                                Multicaixa Express <span class="text-brand-danger">*</span></label>
                                            <input
                                                class="outline-none w-full h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4"
                                                @input="validateNumberMul" type="tel" ref="inputExpressNumber"
                                                autocomplete="off" oncontextmenu="false" v-model="form.numberMul"
                                                :class="{ '!border-brand-danger': errors.numberMul.show }">
                                            <span class="text-brand-danger text-xs font-medium my-1"
                                                v-if="errors.numberMul.show">
                                                {{ errors.numberMul.message }}
                                            </span>
                                        </div>
                                        <!--end multicaixa number phone group-->
                                    </div>
                                </div>

                                <div
                                    class="flex flex-col-reverse gap-3 lg:gap-0 text-center lg:text-left lg:flex-row justify-between items-center py-3">
                                    <p class="text-xs italic mr-4 text-[rgb(76,87,108)]">Ao prosseguir, você declara
                                        estar
                                        ciente: (I) dos <a class="text-[rgb(0,151,255)]" href="/termos-de-uso"
                                            target="_blank" rel="noopener noreferrer">Termos de Uso</a> da Piweto; (II)
                                        da
                                        <a class="text-[rgb(0,151,255)]" href="/politica-de-privacidade" target="_blank"
                                            rel="noopener noreferrer">Política de Privacidade</a>; e (II) das condições
                                        de
                                        pagamento do pedido.
                                    </p>

                                    <button
                                        class="rounded-[8px] w-full lg:w-max shrink-0 outline-none border border-transparent border-solid text-sm font-semibold font-sans leading-4 inline-flex items-center justify-center min-w-fit cursor-pointer transition-all duration-200 ease-in no-underline bg-[rgb(81,168,0)] text-white px-6 py-4  hover:bg-[rgb(98,190,39)] hover:border-[rgb(98,190,39)] disabled:bg-gray-400 disabled:cursor-default disabled:hover:bg-gray-400 disabled:hover:border-gray-400"
                                        :disabled="!formIsValid || !form.paymentMethod || loadingOrder"
                                        @click="finishPurchase" type="submit">
                                        {{ loadingOrder ? 'Carregando..' : 'Pagar Agora' }}
                                    </button>
                                </div>
                            </div>
                            <!--end payment methods-->
                        </div>
                        <div class="hidden lg:block w-full">
                            <div class="sticky flex flex-col gap-4 top-20">
                                <!--start event card-->
                                <div
                                    class="bg-white p-4 flex gap-4 rounded-[8px] shadow-[0px_1px_2px_0px_rgba(25,31,40,0.15)]">
                                    <div class="w-[108px] shrink-0 h-[64px]">
                                        <img v-lazy="cart?.event?.cover?.low" class="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h2 class="text-[14px] text-[rgb(25,31,40)] line-clamp-2 leading-4 font-bold mb-[6px] overflow-hidden text-ellipsis 
       [display:-webkit-box] [webkit-line-clamp:4] [webkit-box-orient:vertical]">
                                            {{ cart?.event?.name }}
                                        </h2>
                                        <div class="flex items-center gap-1">
                                            <svg width="16" height="16" viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" fill="rgb(0, 151, 255)" clip-rule="evenodd"
                                                    d="M7 16C7 15.8022 7.05865 15.6089 7.16853 15.4444C7.27841 15.28 7.43459 15.1518 7.61732 15.0761C7.80004 15.0004 8.00111 14.9806 8.19509 15.0192C8.38907 15.0578 8.56725 15.153 8.70711 15.2929C8.84696 15.4327 8.9422 15.6109 8.98079 15.8049C9.01937 15.9989 8.99957 16.2 8.92388 16.3827C8.84819 16.5654 8.72002 16.7216 8.55557 16.8315C8.39112 16.9414 8.19778 17 8 17C7.73478 17 7.48043 16.8946 7.29289 16.7071C7.10536 16.5196 7 16.2652 7 16ZM12 15H16C16.2652 15 16.5196 15.1054 16.7071 15.2929C16.8946 15.4804 17 15.7348 17 16C17 16.2652 16.8946 16.5196 16.7071 16.7071C16.5196 16.8946 16.2652 17 16 17H12C11.7348 17 11.4804 16.8946 11.2929 16.7071C11.1054 16.5196 11 16.2652 11 16C11 15.7348 11.1054 15.4804 11.2929 15.2929C11.4804 15.1054 11.7348 15 12 15ZM18 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V13H19V19C19 19.2652 18.8946 19.5196 18.7071 19.7071C18.5196 19.8946 18.2652 20 18 20ZM6 6H7V7C7 7.26522 7.10536 7.51957 7.29289 7.70711C7.48043 7.89464 7.73478 8 8 8C8.26522 8 8.51957 7.89464 8.70711 7.70711C8.89464 7.51957 9 7.26522 9 7V6H15V7C15 7.26522 15.1054 7.51957 15.2929 7.70711C15.4804 7.89464 15.7348 8 16 8C16.2652 8 16.5196 7.89464 16.7071 7.70711C16.8946 7.51957 17 7.26522 17 7V6H18C18.2652 6 18.5196 6.10536 18.7071 6.29289C18.8946 6.48043 19 6.73478 19 7V11H5V7C5 6.73478 5.10536 6.48043 5.29289 6.29289C5.48043 6.10536 5.73478 6 6 6ZM18 4H17V3C17 2.73478 16.8946 2.48043 16.7071 2.29289C16.5196 2.10536 16.2652 2 16 2C15.7348 2 15.4804 2.10536 15.2929 2.29289C15.1054 2.48043 15 2.73478 15 3V4H9V3C9 2.73478 8.89464 2.48043 8.70711 2.29289C8.51957 2.10536 8.26522 2 8 2C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3V4H6C5.20435 4 4.44129 4.31607 3.87868 4.87868C3.31607 5.44129 3 6.20435 3 7L3 19C3 19.7956 3.31607 20.5587 3.87868 21.1213C4.44129 21.6839 5.20435 22 6 22H18C18.7956 22 19.5587 21.6839 20.1213 21.1213C20.6839 20.5587 21 19.7956 21 19V7C21 6.20435 20.6839 5.44129 20.1213 4.87868C19.5587 4.31607 18.7956 4 18 4Z">
                                                </path>
                                            </svg>
                                            <span class="text-xs text-[rgb(76,87,108)]">
                                                {{ formatEventDateTime(cart?.event?.starts_at?.date,
                                                    cart?.event?.starts_at?.hm)
                                                }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <!--end event card-->

                                <!--start order summary-->
                                <div
                                    class="bg-white z-[9999] w-full relative overflow-hidden flex-col lg:gap-4 rounded-[8px] shadow-[0px_-9px_19px_-6px_rgba(0,0,0,0.2)] lg:shadow-[0px_1px_2px_0px_rgba(25,31,40,0.15)]">
                                    <div
                                        class="flex p-1 mb-2 lg:mb-0 items-center px-3 h-[28px] justify-center gap-1 w-full bg-[rgb(242,235,253)] text-[rgb(128,49,255)]">
                                        <svg width="15" height="15" viewBox="0 0 25 24" fill="currentColor"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M18.8126 13.608C18.4768 13.4457 18.0871 13.4918 17.8185 13.7257L13.6854 17.3248C13.4672 17.5149 13.3592 17.8033 13.3954 18.0999L14.0081 23.1255C14.052 23.4853 14.3001 23.7978 14.6436 23.9257C14.9871 24.0537 15.3633 23.9737 15.6072 23.721C18.676 20.5401 19.3954 17.0695 19.3707 14.4761C19.3672 14.1107 19.1484 13.7704 18.8126 13.608ZM15.5733 20.7808L15.2883 18.4438L17.3121 16.6815C17.0573 17.9722 16.5369 19.3782 15.5733 20.7808Z">
                                            </path>
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M11.3312 6.12662C11.4935 6.46242 11.4474 6.85212 11.2135 7.12069L7.61437 11.2538C7.42428 11.472 7.13589 11.58 6.83933 11.5438L1.81374 10.9311C1.45387 10.8873 1.14143 10.6391 1.01349 10.2956C0.885551 9.95206 0.965473 9.57587 1.2182 9.33205C4.39911 6.26317 7.86974 5.54378 10.4631 5.56856C10.8285 5.57205 11.1688 5.79082 11.3312 6.12662ZM4.15836 9.36594L6.49543 9.65087L8.25773 7.62716C6.96696 7.88193 5.56096 8.40231 4.15836 9.36594Z">
                                            </path>
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M23.8726 0.296184C24.3041 0.345862 24.6385 0.696553 24.6677 1.12987C24.8911 4.45081 23.6193 7.60049 22.1578 10.0634C20.6897 12.5372 18.9743 14.4119 18.1723 15.2139C17.3719 16.0143 15.9715 17.2206 14.7964 18.2076C14.2036 18.7054 13.6595 19.1547 13.2636 19.4795C13.0655 19.6419 12.9045 19.7734 12.7927 19.8643L12.6637 19.9692L12.6188 20.0055L12.052 19.3064L12.618 20.0062C12.26 20.2957 11.7412 20.2684 11.4156 19.9428L4.98701 13.5142C4.67823 13.2054 4.63566 12.7195 4.88602 12.3618L5.6234 12.8778C4.88602 12.3618 4.88602 12.3618 4.88602 12.3618L4.88826 12.3586L4.89361 12.351L4.91352 12.3227C4.93083 12.2983 4.95613 12.2627 4.98899 12.2168C5.0547 12.1251 5.15067 11.9922 5.27337 11.8254C5.51867 11.4919 5.87131 11.0221 6.30297 10.4732C7.16377 9.37877 8.34969 7.95638 9.63234 6.67381C10.9373 5.36896 13.1 3.63615 15.6065 2.29894C18.098 0.969764 21.0435 -0.029578 23.8726 0.296184ZM6.80277 12.7844L12.1133 18.0949C12.1162 18.0926 12.119 18.0902 12.1219 18.0879C12.514 17.7662 13.0526 17.3215 13.6387 16.8292C14.8213 15.836 16.1628 14.6778 16.8996 13.9411C17.6348 13.2058 19.2423 11.4491 20.6098 9.14478C21.8555 7.04573 22.8566 4.56856 22.8922 2.03506C20.799 2.00478 18.5452 2.77133 16.4538 3.88707C14.1168 5.13383 12.0953 6.75649 10.9051 7.94664C9.6926 9.15906 8.55586 10.5205 7.7178 11.586C7.3448 12.0602 7.03313 12.4731 6.80277 12.7844Z">
                                            </path>
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M18.0661 6.78137C17.7015 6.4168 17.1105 6.4168 16.7459 6.78137C16.3813 7.14593 16.3813 7.737 16.7459 8.10156C17.1105 8.46613 17.7015 8.46613 18.0661 8.10156C18.4307 7.737 18.4307 7.14593 18.0661 6.78137ZM15.4731 5.50857C16.5406 4.44107 18.2714 4.44107 19.3389 5.50857C20.4064 6.57608 20.4064 8.30685 19.3389 9.37436C18.2714 10.4419 16.5406 10.4419 15.4731 9.37436C14.4056 8.30685 14.4056 6.57608 15.4731 5.50857Z">
                                            </path>
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M9.6349 19.073C10.0536 19.3409 10.1759 19.8975 9.90798 20.3162C9.49635 20.9595 8.79085 21.3878 8.13038 21.6824C7.44423 21.9884 6.66681 22.2104 5.95691 22.3712C5.2419 22.533 4.56638 22.6391 4.07166 22.7048C3.82348 22.7377 3.61883 22.7607 3.47504 22.7756C3.4031 22.783 3.34627 22.7884 3.3067 22.7921L3.26052 22.7962L3.24762 22.7973L3.24256 22.7977C3.24239 22.7977 3.24177 22.7977 3.16938 21.9007C2.27229 21.8283 2.27231 21.8281 2.27232 21.8279L2.27246 21.8262L2.27277 21.8224L2.27385 21.8097L2.2779 21.7642C2.28147 21.7253 2.28681 21.6694 2.29416 21.5987C2.30884 21.4573 2.33158 21.256 2.36422 21.0116C2.42929 20.5244 2.53468 19.8581 2.69611 19.1494C2.85649 18.4452 3.07808 17.6725 3.38343 16.9836C3.67922 16.3163 4.10191 15.615 4.72478 15.1815C5.13276 14.8975 5.69367 14.9981 5.97761 15.406C6.26155 15.814 6.16099 16.3749 5.75302 16.6589C5.53523 16.8104 5.2789 17.1492 5.02902 17.713C4.78872 18.2551 4.598 18.9044 4.45117 19.5491C4.34327 20.0228 4.26223 20.4798 4.20297 20.8683C4.60203 20.8082 5.07296 20.7257 5.55942 20.6156C6.21082 20.4681 6.86161 20.2773 7.39717 20.0385C7.9584 19.7881 8.2681 19.5394 8.39175 19.3461C8.65963 18.9274 9.21621 18.8051 9.6349 19.073ZM3.16938 21.9007L2.27232 21.8279C2.25109 22.091 2.34637 22.3504 2.53298 22.5371C2.7196 22.7237 2.9795 22.8189 3.24256 22.7977L3.16938 21.9007Z">
                                            </path>
                                        </svg>
                                        <p class="text-xs font-semibold">Ingressos voando</p>
                                    </div>
                                    <div class="p-4 max-h-[575px] overflow-y-auto">
                                        <h1 class="text-[rgb(25,31,40)] hidden lg:block mb-1 text-base font-bold">
                                            Resumo do Pedido
                                        </h1>

                                        <ul class="flex flex-col py-4 border-b border-[rgb(221,224,228)] gap-3"
                                            v-if="cart?.batches?.length">
                                            <li class="text-[rgb(76,87,108)] leading-4 text-sm"
                                                v-for="(batch, index) in cart?.batches" :index="index">
                                                <div class="flex justify-between items-center gap-1">
                                                    <div class="flex items-center gap-1.5">
                                                        <strong>{{ batch?.quantitySelected }}</strong>
                                                        <span>{{ batch?.name }}</span>
                                                    </div>

                                                    <strong>
                                                        {{ formatAmount(calculateTotalPrice(batch?.price,
                                                            batch?.quantitySelected)) }}
                                                    </strong>
                                                </div>
                                                <div class="ml-3 text-[10px] text-[rgb(132,140,155)]">
                                                    <p>({{ formatAmount(batch?.price) }} cada)</p>
                                                </div>
                                            </li>
                                        </ul>

                                        <div class="flex lg:pt-4 items-center text-[rgb(132,140,155)] justify-between">
                                            <div class="flex flex-col">
                                                <h2 class="text-sm lg:text-base font-semibold">Total </h2>
                                                <p class="text-[10px]">({{ getTotalTicketsSelected(cart.batches) +
                                                    `${getTotalTicketsSelected(cart.batches) ===
                                                        1 ? ' ingresso' : ' ingressos'}` }})</p>
                                            </div>
                                            <div>
                                                <h2
                                                    class="text-[rgb(25,31,40)] flex justify-end leading-5 lg:leading-6 text-base lg:text-lg font-bold">
                                                    {{
                                                        formatAmount(cart?.amount) }}</h2>
                                                <p class="text-[10px]">(selecione a forma de pagamento)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </Container>
            <!--data end-->

            <!--start drawers-->
            <OrderSumary :cart="cart" />
            <!--end drawers-->
        </div>
    </div>
    <SplashScreen :visible="isLoading" />

</template>

<script setup>
import SplashScreen from "../components/ui/SplashScreen.vue";
import Header from "../components/ui/Header";
import { useOrders } from "@/repositories/orders-repository";
import Container from "@/use-cases/marketplace/components/ui/Container.vue";
import formatAmount from "@/utils/formatAmount";
import calculateTotalPrice from "@/utils/calculateTotalPrice";
import getTotalTicketsSelected from "@/utils/getTotalTicketsSelected";
import formatEventDateTime from "@/utils/formatEventDateTime";
import { onMounted, watch, nextTick, computed, ref } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { useStore } from "vuex";
import Swal from "sweetalert2"
import { toast } from "vue3-toastify"
import intlTelInput from 'intl-tel-input';
import OrderSumary from "../components/drawers/OrderSumary.vue";
import { useUsers } from "@/repositories/users-repository.js";
import Cookies from "js-cookie";

const { newOrder, loading: loadingOrder } = useOrders()
const { googleAuth, loading: loadingAuthGoogle } = useUsers()
const { logout, loading: logoutLoading } = useUsers()

const route = useRoute()
const router = useRouter()
const store = useStore()


const intl = ref({})
const inputPhone = ref(null);
const googleButtonRef = ref(null)
const googleApiReady = ref(false)
const googleInitialized = ref(false)
const isLoading = ref(true)

const form = ref({
    fullName: "",
    phone: "",
    confirmEmail: "",
    numberMul: "",
    providerPayment: "emis",
    paymentMethod: "mul"
})

const errors = ref({
    fullName: {
        show: false,
        message: "",
        data: ""
    },
    email: {
        show: false,
        message: "",
        data: ""
    },
    confirmEmail: {
        show: false,
        message: "",
        data: ""
    },
    phone: {
        show: false,
        message: "",
        data: ""
    },
    numberMul: {
        show: false,
        message: "",
        data: ""
    },
    paymentMethod: {
        show: false,
        message: "",
        data: ""
    }
})

const formIsValid = computed(() => {
    // Verifica se há erros nos campos obrigatórios
    if (errors.value.fullName.show ||
        errors.value.email.show ||
        errors.value.confirmEmail.show ||  // Corrigido: estava sem .show
        errors.value.phone.show ||
        !form.value.paymentMethod) {
        return false
    }

    // Verifica se os campos obrigatórios estão preenchidos
    if (!form.value.fullName ||
        !form.value.email ||
        !form.value.confirmEmail ||
        !form.value.phone) {
        return false
    }

    // Validações específicas para Multicaixa Express
    if (form.value.paymentMethod === 'mul') {
        if (!form.value.numberMul || !/^[0-9]{9}$/.test(form.value.numberMul)) {
            return false
        }
    }

    // Verifica se os emails coincidem
    if (form.value.email !== form.value.confirmEmail) {
        return false
    }

    return true
})

// busque os dados do corrente carrinho
const cart = computed(() => {
    return store.getters.cart
})

// busque os dados do currente usuario
const user = computed(() => {
    return store.getters.currentUser
})

const hasLogged = computed(() => {
    return store.getters.hasLogged
})

// Substitua pelo seu ID de cliente do Google
const CLIENT_ID = '914842748542-mc9j2ltt0no88mqlu144u1q1hu19lhq1.apps.googleusercontent.com';

// Configurações (substitua pelo seu Client ID)
const config = {
    client_id: CLIENT_ID,
    callback: async (response) => {
        // Aqui você processa o token JWT
        const userData = parseJwt(response.credential);

        if (userData && !loadingAuthGoogle.value) {
            try {
                await googleAuth(userData)
            } catch (err) {
                toast(err?.response?.data?.message || 'Algo deu errado!', {
                    theme: "colored",
                    autoClose: 2000,
                    position: "top-right",
                    transition: "bounce",
                    type: 'error'
                })
            }
        }
    }
};
// Função para decodificar o JWT
const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Erro ao decodificar JWT:', e);
        return null;
    }
};

// Modifique esta função para ser reutilizável
const initGoogleButton = () => {
    if (!window.google?.accounts?.id || googleInitialized.value) return;

    try {
        // Limpa qualquer botão existente
        if (googleButtonRef.value.firstChild) {
            googleButtonRef.value.removeChild(googleButtonRef.value.firstChild);
        }

        window.google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: (response) => {
                if (!loadingAuthGoogle.value) {
                    config.callback(response);
                } else {
                    toast("Por favor aguarde...", {
                        theme: "colored",
                        autoClose: 1000,
                        position: "top-right",
                        transition: "bounce",
                        type: 'info'
                    });
                }
            }
        });

        // Adiciona um atributo para controle de estado
        const buttonConfig = {
            type: 'standard',
            size: 'large',
            theme: 'outline',
            text: 'sign_in_with',
            shape: 'rectangular',
            width: '100%',
        };

        // Se estiver carregando, desativa o botão
        if (loadingAuthGoogle.value) {
            buttonConfig.attributes = {
                'data-login_pending': 'true'
            };
        }

        window.google.accounts.id.renderButton(
            googleButtonRef.value,
            buttonConfig
        );

        googleInitialized.value = true;
    } catch (e) {
        console.error('Erro no botão Google:', e);
        return false;
    }
};

// Função para verificar e inicializar a API do Google
const checkAndInitGoogle = () => {
    if (window.google?.accounts?.id) {
        if (initGoogleButton()) {
            googleApiReady.value = true
        }
    } else {
        // Tenta novamente após um pequeno delay
        setTimeout(checkAndInitGoogle, 300)
    }
}

const goToLogin = () => {
    if (!hasLogged.value) {
        router.push({
            name: 'Auth user',
            query: {
                r: route.fullPath
            }
        })
    } else {
        toast("Voce ja esta logado!", {
            theme: "colored",
            autoClose: 2000,
            position: "top-right",
            transition: "bounce",
            type: 'info',
        })
    }
}

function validatePhone() {
    const phone = form.value.phone?.toString().trim() || '';

    // Reset errors
    errors.value.phone.show = false;
    errors.value.phone.message = "";

    // Validação básica de campo obrigatório
    if (!phone) {
        errors.value.phone = {
            show: true,
            message: "Este campo é obrigatório."
        };
        return false;
    }

    // Verifica se há caracteres inválidos
    if (/[^\d\s+]/.test(phone)) {
        errors.value.phone = {
            show: true,
            message: "O número só pode conter dígitos e espaços."
        };
        return false;
    }

    // Fallback para validação manual (caso intl-tel-input não esteja pronto)
    else {
        const digitsOnly = phone.replace(/\D/g, '');

        // Validação para números angolanos (9 dígitos, começando com 9)
        if (!/^9[1-9]\d{7}$/.test(digitsOnly)) {
            errors.value.phone = {
                show: true,
                message: "Digite um número angolano válido."
            };
            return false;
        }
    }

    return true;
}

function validateFullName() {
    if (!form.value.fullName) {
        errors.value.fullName = {
            show: true,
            message: "Este campo é obrigatório."
        }
        return false
    } else if (form.value.fullName.length < 2) {
        errors.value.fullName = {
            show: true,
            message: "O nome completo deve ter pelo menos 2 caracteres."
        }
        return false
    } else {
        errors.value.fullName.show = false
        return true
    }
}

function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.value.email) {
        errors.value.email = {
            show: true,
            message: "Este campo é obrigatório."
        }
        return false
    } else if (!emailRegex.test(form.value.email)) {
        errors.value.email = {
            show: true,
            message: "Por favor, insira um e-mail válido."
        }
        return false
    } else {
        errors.value.email.show = false
        return true
    }
}

function validateConfirmEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Primeiro verifica se o campo está vazio
    if (!form.value.confirmEmail) {
        errors.value.confirmEmail = {
            show: true,
            message: "Por favor, confirme seu e-mail."
        };
        return false;
    }

    // Depois verifica se é um e-mail válido
    if (!emailRegex.test(form.value.confirmEmail)) {
        errors.value.confirmEmail = {
            show: true,
            message: "Por favor, insira um e-mail válido."
        };
        return false;
    }

    // Por último verifica se os e-mails coincidem
    if (form.value.confirmEmail !== form.value.email) {
        errors.value.confirmEmail = {
            show: true,
            message: "Os e-mails não coincidem."
        };
        return false;
    }

    // Se tudo estiver correto
    errors.value.confirmEmail.show = false;
    return true;
}

function validateNumberMul() {
    if (!form.value.numberMul) {
        errors.value.numberMul = {
            show: true,
            message: "Este campo é obrigatório."
        }
        return false
    } else if (!/^[0-9]{9}$/.test(form.value.numberMul)) {
        errors.value.numberMul = {
            show: true,
            message: "O número do Multicaixa deve ter exatamente 9 dígitos."
        }
        return false
    } else {
        errors.value.numberMul.show = false
        return true
    }
}

function validatePaymentMethod() {
    if (!form.value.paymentMethod) {
        errors.value.paymentMethod = {
            show: true,
            message: "Por favor, selecione um método de pagamento."
        }
        return false
    } else {
        errors.value.paymentMethod.show = false
        return true
    }
}

function validateAllFields() {
    const validations = [
        validateFullName(),
        validateEmail(),
        validateConfirmEmail(),
        validatePhone(),
        validatePaymentMethod()
    ]

    // Se o método de pagamento for Multicaixa Express, valida também o número
    if (form.value.paymentMethod === 'mul') {
        validations.push(validateNumberMul())
    }

    return validations.every(validation => validation === true)
}

function changeProvidePayment(name) {
    if (name === 'paypay') {
        form.value.providerPayment = name
        form.value.paymentMethod = name

    } else if (name === 'emis') {
        form.value.providerPayment = name
        form.value.paymentMethod = 'mul'
    }
}

// tem como finalidade finalizar a compra, criando um novo pedido.
async function finishPurchase() {
    if (!validateAllFields()) {
        return
    }

    // isto impede do usuario fazer uma requesicao enquanto ja tiver uma em andamento.
    if (loadingOrder.value || errors.value.phone.show || !form.value.paymentMethod) return

    // isto deve criar um novo pedido e redirecionar para a pagina de obrigado caso tenha prosseguido com exito.
    await newOrder({
        cart: cart?.value,
        eventId: cart?.value.event?._id,
        paymentMethod: form.value.paymentMethod,
        data: {
            fullName: form.value.fullName,
            email: form.value.email,
            phone: form.value.phone
        }
    }).then(res => {
        const { newOrder } = res.data
        router.replace(`/checkout/detalhes-do-pedido/${newOrder.id}`)
    }).catch(err => {
        if (err.response.status === 400) {
            if (form.value.paymentMethod === 'mul') {
                Swal.fire({
                    icon: "error",
                    title: "Número não reconhecido",
                    text: "O número informado não está associado a uma conta Multicaixa Express. Verifique os dados e tente novamente.",
                    confirmButtonText: "OK"
                }).then(() => {
                    form.value.phone = ''
                });
            }
        }
    })
}

function resetForm() {
    form.value = {
        fullName: "",
        providerPayment: "emis",
        paymentMethod: 'mul',
        phone: "",
        numberMul: "",
        email: "",
        confirmEmail: ""
    }
}

async function handleLogout() {
    const session_id = Cookies.get("session_id")
    await logout(session_id).then(() => {
        resetForm()
        validateAllFields()
        checkAndInitGoogle()
    }).catch(err => {
        console.log(err)
        toast("Houve um erro.", {
            theme: "colored",
            position: "top-right",
            autoClose: 2517,
            type: "erro"
        })
    })
}

// Adicione um watcher para observar mudanças no email principal
watch(() => form.value.email, (newEmail) => {
    if (form.value.confirmEmail && newEmail !== form.value.confirmEmail) {
        errors.value.confirmEmail = {
            show: true,
            message: "Os e-mails não coincidem."
        };
    } else if (errors.value.confirmEmail.show && newEmail === form.value.confirmEmail) {
        errors.value.confirmEmail.show = false;
    }
});

/* 
onBeforeRouteLeave((to, from, next) => {

    if (!isLoading.value && validateAllFields()) {
        Swal.fire({
            title: 'Tem certeza que deseja sair?',
            text: "Você tem alterações não salvas no formulário.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0097ff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, sair',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                next();
            } else {
                next(false);
            }
        });
    } else {
        next()
    }

});*/

// quando montar a tela, faca a requisicao para api buscando um carrinho com base no id passado na routa desta pagina e seta o formulario de pagamento do usuario com os dados do corrente usuario.
onMounted(async () => {
    if (cart?.value) {
        if (hasLogged.value) {
            form.value = {
                fullName: `${user.value.first_name.replace(/\s/g, '')} ${user.value.last_name.replace(/\s/g, '')}`,
                providerPayment: "emis",
                paymentMethod: 'mul',
                phone: user.value.phone?.toString() || '',
                numberMul: user.value.phone,
                email: user.value.email,
                confirmEmail: user.value.confirmEmail
            }
        } else {
            try {
                // Verifica se a API do Google já está carregada
                checkAndInitGoogle()
            } catch (e) {
                console.error('Erro na autenticação Google:', e);
            }
        }

        const input = inputPhone.value;
        intl.value = intlTelInput(input, {
            loadUtilsOnInit: () => import("intl-tel-input/utils"),
            initialCountry: "ao",
            onlyCountries: ["ao"],
            countrySearch: false,   // Desativa a pesquisa de países
            customPlaceholder: function (selectedCountryPlaceholder, selectedCountryData) {
                return "9xx xxx xxx";  // Placeholder específico para Angola
            }
        });

        // Aguarde a próxima tick do Vue para garantir a inicialização
        await nextTick();

        setTimeout(() => {
            isLoading.value = false
        }, 1000)

        validateAllFields()
    } else {
        const slug = route.params.slug
        router.replace(`/evento/${slug}`)
    }
})
</script>

<style scoped>
.st0 {
    fill: #F09234;
}

.st1 {
    fill: #D93840;
}
</style>
