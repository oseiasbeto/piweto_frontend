<template>
    <div class="mb-10">
        <div v-if="!loadingEvent">
            <section class="mt-5">
                <!--start header-->
                <div>
                    <div class="flex z-50 justify-center w-full">

                        <div class="w-full h-full relative max-w-[1000px] mx-auto">
                            <div
                                class="flex p-4 py-5 pb-7 lg:py-0 flex-col h-full gap-4 lg:gap-9 w-full relative items-center lg:px-4 xl:px-0">
                                <section class="block w-full flex-1">
                                    <div class="pr-8">
                                        <h1
                                            class="font-bold text-3xl lg:text-[30px] text-black mt-2 mb-4 line-clamp-2 break-words leading-8 lg:leading-[40px] tracking-[-0.05rem]">
                                            {{ event?.name }}</h1>
                                        <div class="flex text-sm lg:text-base mb-2 gap-2 text-black">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                                                stroke-linecap="round" stroke-linejoin="round"
                                                class="lucide lucide-calendar-check-icon">
                                                <path d="M8 2v4"></path>
                                                <path d="M16 2v4"></path>
                                                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                                                <path d="M3 10h18"></path>
                                                <path d="m9 16 2 2 4-4"></path>
                                            </svg>

                                            <p>{{ formatDate(event.starts_at.date) }} às {{
                                                formatTime(event.starts_at.hm)
                                            }}
                                                > {{
                                                    formatDate(event.ends_at.date) }} às {{ formatTime(event.ends_at.hm) }}
                                            </p>
                                        </div>
                                        <div class="flex items-center text-sm lg:text-base gap-2 text-black">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                                                stroke-linecap="round" stroke-linejoin="round"
                                                class="lucide lucide-map-pinned-icon">
                                                <path
                                                    d="M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0">
                                                </path>
                                                <circle cx="12" cy="8" r="2"></circle>
                                                <path
                                                    d="M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712">
                                                </path>
                                            </svg>

                                            <p>Evento presencial em {{
                                                event.address.location }}</p>
                                        </div>
                                    </div>
                                </section>

                                <div class="flex flex-col lg:flex-row gap-6 w-full">
                                    <section
                                        class="relative bg-black/[.12] rounded-[12px] overflow-hidden w-full lg:w-[600px] h-auto lg:h-[800px]">
                                        <img v-lazy="event.cover.medium" class=" object-cover h-full w-full">
                                    </section>

                                      <div
                                class="shrink-0 flex-1 bg-white lg:bg-transparent lg:p-0 lg:block w-full">
                                <div class="relative">

                                    <!--cart start-->
                                    <div
                                    id="cart"
                                        class="border border-[rgba(0,0,0,.16)] rounded-[12px] flex-1 bg-white overflow-hidden lg:block select-none">
                                        <div
                                            class="bg-black text-white flex rounded-t-xl justify-between p-3 text-base font-semibold leading-6">
                                            <span>Ingressos</span>

                                        </div>
                                        <div v-if="!loadingBatches">
                                            <div class="max-h-[345px] overflow-y-auto">
                                                <ul v-if="batches.data.length">
                                                    <li class="border-b border-[rgba(0,0,0,.16)] py-2 px-4 text-[13px] text-[#50525f] border-[rgba(0,0,0,.16]"
                                                        v-for="(batch, index) in batches.data" :index="index">
                                                        <div class="flex justify-between mb-0.5 items-center">
                                                            <div class="flex-1">
                                                                <div
                                                                    class="flex text-sm text-black items-center gap-1">
                                                                    <div class="font-bold">{{ batch.name }}</div>
                                                                  
                                                                </div>
                                                                <p class="text-[rgb(0,0,0,.65)]">{{ formatAmount(batch.price) }}</p>
                                                                <p class="text-[rgb(0,0,0,.65)] italic text-xs">Vendas
                                                                    até
                                                                    {{
                                                                        formattedDate(batch.ends_at.date) }}</p>
                                                            </div>
                                                            <div>
                                                                <div v-if="batch.quantity > 0 && !isDatePassed(batch.ends_at.date) && canReleaseSales(batch?.starts_at?.date)"
                                                                    class="flex items-center">
                                                                    <button
                                                                        class="w-[32px] h-[32px] m-1 flex justify-center items-center text-[rgb(0,0,0,.65)] bg-brand-muted-bg/5 rounded-[8px]"
                                                                        @click="reduceBatch(index)" :class="{
                                                                            'cursor-default !text-[rgb(0,0,0,.65)]  !bg-brand-muted-bg': batch.quantitySelected <= 0
                                                                        }">
                                                                        <svg viewBox="0 0 16 16" fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="16">
                                                                            <path
                                                                                d="M3.294 7.637h9.412c.347 0 .628.298.628.667 0 .368-.281.666-.628.666H3.294c-.346 0-.627-.298-.627-.666 0-.369.28-.667.627-.667Z"
                                                                                fill="currentColor"></path>
                                                                        </svg>
                                                                    </button>
                                                                    <p
                                                                        class="text-base font-semibold text-[rgb(0,0,0,.65)] w-[26px] text-center">
                                                                        {{ batch.quantitySelected }}</p>
                                                                    <button
                                                                        class="hover:opacity-70 transition-opacity w-[32px] h-[32px] m-1 flex justify-center items-center text-[#fff] bg-brand-primary rounded-[8px]"
                                                                        @click="addBatch(index)" :class="{
                                                                            'cursor-default !text-brand-muted-color !bg-brand-muted-bg': batch.quantitySelected >= batch.quantity_for_purchase.max
                                                                        }">
                                                                        <svg viewBox="0 0 13 13" fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="14">
                                                                            <path
                                                                                d="M.667 6.99H11.98a.667.667 0 0 0 0-1.333H6.99V.667a.667.667 0 0 0-1.333 0v4.99H.667a.667.667 0 0 0 0 1.333Z"
                                                                                fill="currentColor"></path>
                                                                            <path
                                                                                d="M5.657 11.98V6.04a.667.667 0 0 1 1.333 0v5.94a.667.667 0 0 1-1.333 0Z"
                                                                                fill="currentColor"></path>
                                                                        </svg>
                                                                    </button>
                                                                </div>

                                                                <div class="italic"
                                                                    v-else-if="isDatePassed(batch.ends_at.date)">
                                                                    <p>Encerrado</p>
                                                                </div>
                                                                <div class="italic"
                                                                    v-else-if="!canReleaseSales(batch?.starts_at?.date)">
                                                                    <p>Em breve</p>
                                                                </div>

                                                                <div class="italic lmax"
                                                                    v-else-if="batch.quantity == 0">
                                                                    <p>Esgotado</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="p-4">
                                                <div v-if="amount > 0"
                                                    class="flex mb-2 text-[rgb(25,31,40)] justify-between gap-1 items-center flex-row">
                                                    <div class="flex items-center gap-1">
                                                        <small class="text-[rgb(0,0,0,.65)] text-sm py-2">Total</small>
                                                        <p v-if="!amountAfterDiscount" class="text-black font-bold">{{
                                                            formatAmount(amount) }}</p>
                                                        <p v-else class="text-black font-bold">{{
                                                            formatAmount(amountAfterDiscount) }}</p>
                                                    </div>
                                                    <div v-if="amountAfterDiscount">
                                                        <p class="text-sm text-black line-through font-semibold">{{
                                                            formatAmount(amount) }}</p>
                                                    </div>
                                                </div>

                                                <div class="mb-4">
                                                    <button v-if="!showCouponInput"
                                                        @click="showCouponInput = !showCouponInput"
                                                        class="flex border border-[rgba(0,0,0,.16)] hover:border-black transition-colors border-dashed w-full justify-center items-center text-sm gap-2 py-2.5 px-3 text-black">
                                                        <span>Inserir código promocional</span>
                                                    </button>
                                                    <div class="flex relative gap-3 items-center justify-between"
                                                        v-else>
                                                        <div class="relative flex-1">
                                                            <input
                                                                class="flex flex-row items-center w-full text-[rgb(25,31,40)] border border-[rgba(0,0,0,.16)] rounded-[4px] py-2 pr-12 p-4 text-base transition-[border-color] focus:border-black duration-300 outline-none gap-4"
                                                                v-model="form.couponName" type="text"
                                                                placeholder="Código" :readonly="coupon._id">
                                                            <button
                                                                @click="showCouponInput = !showCouponInput; form.couponName = ''"
                                                                class="absolute right-3 top-1/2 -translate-y-1/2">
                                                                <svg width="24" fill="rgba(0,0,0,.16)" height="24"
                                                                    viewBox="0 0 24 24"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M6.70711 18.7071L18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L12 10.5858L6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711L10.5858 12L5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071Z">
                                                                    </path>
                                                                    <path
                                                                        d="M17.2929 18.7071L13.8201 15.2343C13.4296 14.8438 13.4296 14.2106 13.8201 13.8201C14.2106 13.4296 14.8438 13.4296 15.2343 13.8201L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071Z">
                                                                    </path>
                                                                </svg>
                                                            </button>
                                                        </div>

                                                        <button :disabled="form.couponName == '' || loadingCoupon"
                                                            class="rounded-lg outline-none overflow-hidden relative border text-sm font-semibold font-sans leading-4 inline-flex items-center justify-center min-w-fit w-max cursor-pointer transition-all ease-in duration-200 no-underline hover:bg-black text-black hover:text-white border-[rgba(0,0,0,.16)] py-3 px-4"
                                                            v-if="form.couponName == '' || !coupon._id"
                                                            @click="(event) => _applyCoupon(form.couponName, event)">Aplicar</button>
                                                        <button
                                                            class="rounded-lg outline-none border text-sm font-semibold font-sans leading-4 inline-flex items-center justify-center min-w-fit w-max cursor-pointer transition-all ease-in duration-200 no-underline hover:bg-primary text-black hover:text-white border-black py-3 px-4"
                                                            v-else @click="removeCoupon()">Remover</button>
                                                    </div>
                                                </div>

                                                <button style="letter-spacing: 0.5px;"
                                                    class="bg-[rgb(23,178,106)] hover:bg-[rgb(7,148,85)] transition-colors relative overflow-hidden h-[48px] rounded-[8px] disabled:bg-[rgba(0,0,0,0.08)] disabled:text-[rgb(0,0,0,.60)] disabled:cursor-default w-full font-semibold text-[14px] py-2.5 px-3 text-[#fff] mb-1"
                                                    :class="{ 'pointer-events-none cursor-default': loadingCart }"
                                                    @click="sendToCart" :disabled="isEventOver || amount == 0">
                                                    <span v-if="!loadingCart">{{ amount == 0 ? 'Selecione um Ingresso' :
                                                        'Comprar ingressos' }}</span>
                                                    <span v-else>

                                                        <svg aria-hidden="true"
                                                            class="inline w-5 h-5 text-transparent animate-spin fill-white"
                                                            viewBox="0 0 100 101" fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                                fill="currentColor" />
                                                            <path
                                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                                fill="currentFill" />
                                                        </svg>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                        <div v-else class="flex justify-center items-center py-5">
                                            <BtnSpinner />
                                        </div>
                                    </div>
                                    <!--end start-->

                                    <!--payment security-->
                                    <div>
                                        <div class="flex justify-center py-5 gap-0.5 text-[rgb(0,0,0,.65)] text-center items-center text-xs">
                                        <svg class="w-[18px] h-[18px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.75 11.75a1 1 0 0 1 1-1h10.5a1 1 0 0 1 1 1v5.5a2 2 0 0 1-2 2h-8.5a2 2 0 0 1-2-2v-5.5ZM7.75 10.5v-.157c0-1.562-.094-3.302.996-4.42C9.368 5.288 10.374 4.75 12 4.75c1.626 0 2.632.537 3.254 1.174 1.09 1.117.996 2.857.996 4.419v.157"></path>
                                        </svg> 
                                        Os pagamentos são seguros e criptografados 
                                    </div>

                                    <div class="flex select-none justify-center items-center gap-2.5">
                                         <svg class="w-[100px] mb-1" xmlns="http://www.w3.org/2000/svg"
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

                                                 <svg class="w-[100px] mb-1" xmlns="http://www.w3.org/2000/svg"
                                                    width="200.007" viewBox="0 0 200.007 48">
                                                    <g transform="translate(7247.591 5248.717)">
                                                        <path
                                                            d="M-15.613-22.256a7.148,7.148,0,0,1,7.146-7.151,7.151,7.151,0,0,1,7.146,7.151,7.145,7.145,0,0,1-7.146,7.14,7.142,7.142,0,0,1-7.146-7.14m29.147-8.13-4.85-2.8a5.983,5.983,0,0,0-2.9-.751v-6.374a3.292,3.292,0,0,0-4.441-3.248l-5.414,1.451a5.955,5.955,0,0,0-2.586,1.518l-4.5-4.508a3.3,3.3,0,0,0-5.441.845L-19.4-39.4a5.9,5.9,0,0,0-.757,2.9h-6.374a3.29,3.29,0,0,0-3.249,4.44l1.451,5.41a5.872,5.872,0,0,0,1.523,2.58l-4.508,4.508a3.294,3.294,0,0,0,.839,5.441l4.855,2.8a5.994,5.994,0,0,0,3.275.742v6.524A3.29,3.29,0,0,0-17.9-.8l5.41-1.45a5.945,5.945,0,0,0,2.627-1.56L-5.545.8C-3.814,2.534-1.3,1.943-.032-.26l2.8-4.855a5.939,5.939,0,0,0,.751-2.959H9.741a3.29,3.29,0,0,0,3.249-4.44l-1.451-5.41a5.9,5.9,0,0,0-1.56-2.627l4.394-4.394a3.292,3.292,0,0,0-.839-5.441"
                                                            transform="translate(-7215.187 -5202.527)" fill="#fff" />
                                                        <path
                                                            d="M-15.708-4.153A2.3,2.3,0,0,0-17.739-6.5h-9.208a2.044,2.044,0,0,0-2.021,2.052v7a1.929,1.929,0,0,0,2.021,2.093h13.623V7H-28.133A4.184,4.184,0,0,1-32.6,2.552v-7A4.13,4.13,0,0,1-28.133-8.62h11.265A4.392,4.392,0,0,1-12.4-4.153,4.345,4.345,0,0,1-16.868.515h-10.5V-1.63h9.633a2.459,2.459,0,0,0,2.031-2.524"
                                                            transform="translate(-7157.218 -5223.946)" fill="#f39200" />
                                                        <path
                                                            d="M-15.814,0h2.933V3.114a3.731,3.731,0,0,1-3.938,3.938H-28.887a3.605,3.605,0,0,1-3.933-3.7V0h2.762V3.731a.763.763,0,0,0,.834.8h12.607a.765.765,0,0,0,.8-.834Z"
                                                            transform="translate(-7133.835 -5232.571)" fill="#f39200" />
                                                        <path
                                                            d="M-18.541-3.445V.307h-2.767V-3.936a.758.758,0,0,0-.834-.8H-34.749a.76.76,0,0,0-.8.834V.307L-38.48.344V-3.211a3.728,3.728,0,0,1,3.938-3.938h12.068a3.605,3.605,0,0,1,3.933,3.7"
                                                            transform="translate(-7128.176 -5217.219)" fill="#f39200" />
                                                        <path
                                                            d="M-18.093-4.12c0,2.638-1.306,4.778-4.591,4.778h-9.529a1.922,1.922,0,0,0-1.881,2.124V7.114H-37.55V2.89c0-2.637,1.653-4.555,4-4.555h9.928c1.456,0,2.031-1.114,2.031-2.456a2.2,2.2,0,0,0-2.031-2.285H-37.55V-8.551h14.866c3.285,0,4.591,2.109,4.591,4.431"
                                                            transform="translate(-7104.669 -5224.031)" fill="#f39200" />
                                                        <path
                                                            d="M-4.279,0H6.758V2.239H-3.206c-1.254,0-1.788.891-1.788,2.119V15.644H-8.88V4.358C-8.88,1.881-7.382,0-4.279,0"
                                                            transform="translate(-7111.585 -5232.562)" fill="#f39200" />
                                                        <path
                                                            d="M-36.383-2.318h-7.41a1.864,1.864,0,0,0-1.814,2.1v6.8c0,2.612-1.316,4.244-4.575,4.244H-71.038A4.185,4.185,0,0,1-75.51,6.377v-7a4.132,4.132,0,0,1,4.472-4.176h11.265A4.388,4.388,0,0,1-55.306-.328,4.341,4.341,0,0,1-59.773,4.34H-70.282V2.2h9.633A2.458,2.458,0,0,0-58.612-.328a2.3,2.3,0,0,0-2.036-2.343h-9.208A2.04,2.04,0,0,0-71.872-.618v7A1.925,1.925,0,0,0-69.857,8.47h13.628v.006h5.151c1.254,0,1.788-.777,1.788-2.068V-.561c0-2.28,1.321-4.25,4.56-4.25h8.348Z"
                                                            transform="translate(-7027.379 -5227.771)" fill="#f39200" />
                                                        <path
                                                            d="M-20.723,0V2.493h-7.4a1.863,1.863,0,0,0-1.814,2.1v6.8c0,2.612-1.316,4.244-4.581,4.244H-43.01V13.317h7.6c1.249,0,1.788-.808,1.788-2.1V4.249C-33.626,1.97-32.31,0-29.066,0Z"
                                                            transform="translate(-7026.861 -5232.582)" fill="#f39200" />
                                                        <path
                                                            d="M-18.093-4.12c0,2.638-1.306,4.778-4.591,4.778h-9.529a1.922,1.922,0,0,0-1.881,2.124V7.114H-37.55V2.89c0-2.637,1.653-4.555,4-4.555h9.928c1.456,0,2.031-1.114,2.031-2.456a2.2,2.2,0,0,0-2.031-2.285H-37.55V-8.551h14.866c3.285,0,4.591,2.109,4.591,4.431"
                                                            transform="translate(-7104.669 -5224.031)" fill="#bb0e0c" />
                                                        <path
                                                            d="M-14.542,0V2.239h-9.964c-1.254,0-1.788.891-1.788,2.119V15.644H-30.18V4.358c0-2.477,1.5-4.358,4.6-4.358Z"
                                                            transform="translate(-7090.286 -5232.562)" fill="#bb0e0c" />
                                                        <path
                                                            d="M-36.383,0V2.493h-7.41a1.863,1.863,0,0,0-1.814,2.1v6.8c0,2.612-1.316,4.244-4.575,4.244H-71.038a4.185,4.185,0,0,1-4.472-4.451v-7A4.132,4.132,0,0,1-71.038.016h11.265a4.388,4.388,0,0,1,4.467,4.467,4.341,4.341,0,0,1-4.467,4.669H-70.282V7.006h9.633a2.459,2.459,0,0,0,2.036-2.524A2.3,2.3,0,0,0-60.649,2.14h-9.208a2.04,2.04,0,0,0-2.016,2.052v7a1.925,1.925,0,0,0,2.016,2.093h13.628v.006h5.151c1.254,0,1.788-.777,1.788-2.068V4.249C-49.29,1.97-47.969,0-44.731,0Z"
                                                            transform="translate(-7027.379 -5232.582)" fill="#bb0e0c" />
                                                        <path
                                                            d="M-20.723,0V2.493h-7.4a1.863,1.863,0,0,0-1.814,2.1v6.8c0,2.612-1.316,4.244-4.581,4.244H-43.01V13.317h7.6c1.249,0,1.788-.808,1.788-2.1V4.249C-33.626,1.97-32.31,0-29.066,0Z"
                                                            transform="translate(-7026.861 -5232.582)" fill="#bb0e0c" />
                                                        <path
                                                            d="M-18.541,0V3.114a3.731,3.731,0,0,1-3.938,3.938H-34.547a3.605,3.605,0,0,1-3.933-3.7V0h2.762V3.731a.763.763,0,0,0,.834.8h12.607a.765.765,0,0,0,.8-.834V0Z"
                                                            transform="translate(-7128.176 -5232.571)" fill="#bb0e0c" />
                                                        <path
                                                            d="M-18.541-3.445V.307h-2.767V-3.936a.758.758,0,0,0-.834-.8H-34.749a.76.76,0,0,0-.8.834V.307L-38.48.344V-3.211a3.728,3.728,0,0,1,3.938-3.938h12.068a3.605,3.605,0,0,1,3.933,3.7"
                                                            transform="translate(-7128.176 -5217.219)" fill="#bb0e0c" />
                                                        <path
                                                            d="M-5.257-12.335H8.366v2.358H-6.443a4.184,4.184,0,0,1-4.467-4.451v-7A4.13,4.13,0,0,1-6.443-25.6H4.822a4.393,4.393,0,0,1,4.472,4.467,4.345,4.345,0,0,1-4.472,4.668h-10.5v-2.145H3.952a2.459,2.459,0,0,0,2.031-2.524,2.3,2.3,0,0,0-2.031-2.343H-5.257a2.044,2.044,0,0,0-2.021,2.052v7a1.929,1.929,0,0,0,2.021,2.093"
                                                            transform="translate(-7178.908 -5206.967)" fill="#bb0e0c" />
                                                        <path
                                                            d="M-41.015-18.034-45.6-13.448l-2.57.021,6.234-6.213.777.451a.661.661,0,0,1,.145,1.155m-2.648,15.6h-6.488l-1.834-1.8,8.8.016.228.876c.155.575-.14.913-.71.913m-8.7,3.772-1.871,3.218-6.928-6.927.005-1.172a9.907,9.907,0,0,0,4.27-.995l4.373,4.373a1.2,1.2,0,0,1,.15,1.5m-3.052,5.244a.662.662,0,0,1-1.156.14l-4.586-4.586-.021-2.57L-54.964,5.8ZM-68.333-13.495a7.148,7.148,0,0,1,7.146-7.151,7.151,7.151,0,0,1,7.146,7.151,7.145,7.145,0,0,1-7.146,7.14,7.142,7.142,0,0,1-7.146-7.14m3.9,15.566a1.2,1.2,0,0,1-.959,1.166l-3.6.948V-5.608l.834-.823a9.975,9.975,0,0,0,3.72,2.316ZM-74.437-4.774a1.2,1.2,0,0,1-1.5.145L-79.158-6.5l6.928-6.923,1.171.005a9.963,9.963,0,0,0,.995,4.265Zm4.073,9.327-.886.233a.661.661,0,0,1-.917-.715V-2.416l1.8-1.834ZM-81.184-7.681a.662.662,0,0,1-.14-1.156l4.586-4.581,2.575-.021L-80.4-7.225Zm2.508-16.753h6.488l1.834,1.809h-8.8l-.233-.892a.662.662,0,0,1,.715-.917m10.5,4.021a9.955,9.955,0,0,0-2.316,3.72h-6.182a1.2,1.2,0,0,1-1.171-.959l-.948-3.6H-69Zm-1.8-7.793,1.871-3.213,6.928,6.923-.005,1.177a9.851,9.851,0,0,0-4.27.995L-69.826-26.7a1.2,1.2,0,0,1-.15-1.5m3.052-5.238a.663.663,0,0,1,1.156-.146L-61.182-29l.021,2.571-6.218-6.234Zm9.016,4.508a1.2,1.2,0,0,1,.959-1.166l3.6-.953v9.794l-.834.829a9.918,9.918,0,0,0-3.72-2.316Zm12.239,18.763a1.2,1.2,0,0,1,1.171.959l.948,3.6h-9.793l-.829-.834a9.827,9.827,0,0,0,2.316-3.721ZM-47.9-22.092a1.211,1.211,0,0,1,1.5-.15l3.218,1.876-6.928,6.923-1.171,0a10,10,0,0,0-.995-4.27Zm-4.073-9.332.886-.227a.661.661,0,0,1,.917.715v6.487l-1.8,1.834Zm12.789,9.8-4.85-2.8a5.977,5.977,0,0,0-2.9-.751v-6.374A3.292,3.292,0,0,0-51.379-34.8l-5.415,1.45a5.957,5.957,0,0,0-2.586,1.518l-4.5-4.508a3.3,3.3,0,0,0-5.441.845l-2.8,4.855a5.9,5.9,0,0,0-.757,2.9h-6.374A3.29,3.29,0,0,0-82.5-23.3l1.451,5.41a5.873,5.873,0,0,0,1.523,2.581L-84.034-10.8a3.294,3.294,0,0,0,.839,5.441l4.855,2.8a5.993,5.993,0,0,0,3.275.742V4.709a3.29,3.29,0,0,0,4.441,3.248l5.41-1.451a5.938,5.938,0,0,0,2.627-1.559l4.322,4.611c1.731,1.736,4.244,1.145,5.513-1.057l2.8-4.855A5.939,5.939,0,0,0-49.2.687h6.218a3.29,3.29,0,0,0,3.249-4.44l-1.451-5.41a5.9,5.9,0,0,0-1.56-2.627l4.394-4.395a3.292,3.292,0,0,0-.839-5.441"
                                                            transform="translate(-7162.467 -5211.288)" fill="#bb0e0c"
                                                            fill-rule="evenodd" />
                                                    </g>
                                                </svg>

                                                 <img class="w-[80px]" src="@/assets/imgs/paypay.png">
                                    </div>

                                    <div class="flex py-3 justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="107" height="31" viewBox="0 0 107 31" fill="none">
<path d="M0.350586 4.38894V7.35964C0.350586 15.6163 0.36624 21.3184 5.16903 26.1189C7.019 27.9689 11.5355 31 11.5355 31V1.63522C6.83781 1.63522 2.14017 3.73351 0.350586 4.38894Z" fill="#66BB6A"/>
<path d="M22.7205 4.35091C20.4835 3.65745 16.2333 1.63522 11.5356 1.63522V30.9978C11.5356 30.9978 16.0722 27.9689 17.9244 26.1167C22.7362 21.3049 22.7205 16.2516 22.7205 8.46024V4.35091Z" fill="#388E3C"/>
<mask id="mask0_1887_88" maskUnits="userSpaceOnUse" x="0" y="1" width="23" height="30">
<path d="M11.6627 1.63522C6.56014 1.63522 2.14212 3.73127 0.352539 4.3867V7.35741C0.352539 15.6141 0.383854 21.3161 5.18664 26.1167C7.03662 27.9667 11.5374 30.9978 11.5374 30.9978C11.5374 30.9978 16.074 27.9689 17.9262 26.1167C22.7379 21.3049 22.7223 16.2516 22.7223 8.46024V4.35091C20.4831 3.65969 16.4677 1.63522 11.6627 1.63522Z" fill="white"/>
</mask>
<g mask="url(#mask0_1887_88)">
<path d="M23.6933 4.38446H-0.510742V6.37537H23.6933V4.38446Z" fill="url(#paint0_linear_1887_88)"/>
</g>
<mask id="mask1_1887_88" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="5" y="4" width="13" height="23">
<path d="M11.549 4.77371C8.39935 4.77371 5.45996 6.97042 5.45996 6.97042C5.45996 6.97042 5.66129 11.5316 5.66129 13.3615C5.66129 17.3164 6.41515 20.5847 8.17341 23.0252C9.16663 24.4054 11.5513 26.6625 11.5513 26.6625C11.5513 26.6625 13.8777 24.4054 14.8709 23.0252C16.6292 20.5847 17.3316 17.3164 17.3316 13.3615C17.3316 11.5316 17.5732 6.97042 17.5732 6.97042C17.5732 6.97042 14.5488 4.77371 11.549 4.77371Z" fill="white"/>
</mask>
<g mask="url(#mask1_1887_88)">
<path d="M11.6359 30.783C13.6447 30.783 15.2732 29.1545 15.2732 27.1457C15.2732 25.1368 13.6447 23.5084 11.6359 23.5084C9.62702 23.5084 7.99854 25.1368 7.99854 27.1457C7.99854 29.1545 9.62702 30.783 11.6359 30.783Z" fill="#FAFAFA"/>
<path d="M11.6359 33.4472C10.402 33.4472 9.19573 33.0813 8.16974 32.3958C7.14375 31.7103 6.34409 30.7359 5.87188 29.5959C5.39968 28.4558 5.27612 27.2014 5.51685 25.9912C5.75759 24.7809 6.35178 23.6693 7.22431 22.7967C8.09684 21.9242 9.20851 21.33 10.4187 21.0893C11.629 20.8485 12.8834 20.9721 14.0234 21.4443C15.1635 21.9165 16.1378 22.7162 16.8234 23.7422C17.5089 24.7681 17.8748 25.9744 17.8748 27.2083C17.873 28.8624 17.2152 30.4483 16.0455 31.6179C14.8759 32.7876 13.29 33.4455 11.6359 33.4472ZM11.6359 22.1908C10.6435 22.1908 9.67343 22.4851 8.8483 23.0364C8.02317 23.5877 7.38006 24.3714 7.0003 25.2882C6.62053 26.205 6.52118 27.2139 6.71478 28.1872C6.90838 29.1605 7.38626 30.0545 8.08797 30.7563C8.78969 31.458 9.68372 31.9358 10.657 32.1294C11.6303 32.323 12.6392 32.2237 13.556 31.8439C14.4729 31.4642 15.2565 30.821 15.8078 29.9959C16.3592 29.1708 16.6534 28.2007 16.6534 27.2083C16.6517 25.8781 16.1225 24.6029 15.1819 23.6623C14.2413 22.7218 12.9661 22.1926 11.6359 22.1908Z" fill="#FAFAFA"/>
<path d="M11.636 36.1182C9.87375 36.1182 8.1511 35.5957 6.68588 34.6166C5.22066 33.6376 4.07867 32.2461 3.4043 30.618C2.72993 28.9899 2.55349 27.1985 2.89728 25.4701C3.24107 23.7418 4.08966 22.1542 5.33572 20.9081C6.58179 19.662 8.16938 18.8135 9.89773 18.4697C11.6261 18.1259 13.4175 18.3023 15.0456 18.9767C16.6737 19.6511 18.0652 20.7931 19.0442 22.2583C20.0233 23.7235 20.5458 25.4461 20.5458 27.2083C20.5434 29.5707 19.604 31.8355 17.9336 33.506C16.2632 35.1764 13.9983 36.1158 11.636 36.1182ZM11.636 19.5803C10.1273 19.5803 8.65245 20.0276 7.39802 20.8658C6.14359 21.704 5.16587 22.8953 4.58851 24.2892C4.01116 25.683 3.8601 27.2168 4.15443 28.6965C4.44876 30.1762 5.17527 31.5354 6.24208 32.6022C7.30889 33.669 8.66808 34.3955 10.1478 34.6899C11.6275 34.9842 13.1612 34.8331 14.5551 34.2558C15.9489 33.6784 17.1403 32.7007 17.9785 31.4463C18.8167 30.1918 19.264 28.717 19.264 27.2083C19.2611 25.1864 18.4564 23.2481 17.0264 21.8185C15.5965 20.389 13.6579 19.5849 11.636 19.5825V19.5803Z" fill="#FAFAFA"/>
<path d="M11.4619 16.1845C13.4979 16.1845 15.1485 14.534 15.1485 12.498C15.1485 10.462 13.4979 8.81146 11.4619 8.81146C9.42591 8.81146 7.77539 10.462 7.77539 12.498C7.77539 14.534 9.42591 16.1845 11.4619 16.1845Z" fill="#FAFAFA"/>
</g>
<path d="M22.7201 4.25025V1.96854C22.7201 1.14757 21.5859 0 20.5725 0H2.31212C1.30101 0 0.352539 1.14757 0.352539 1.96854V4.25025H22.7223H22.7201Z" fill="#E0E0E0"/>
<path d="M3.11128 3.04898C3.47451 3.04898 3.76895 2.75453 3.76895 2.39131C3.76895 2.02809 3.47451 1.73364 3.11128 1.73364C2.74806 1.73364 2.45361 2.02809 2.45361 2.39131C2.45361 2.75453 2.74806 3.04898 3.11128 3.04898Z" fill="white"/>
<path d="M5.51802 3.04898C5.88124 3.04898 6.17569 2.75453 6.17569 2.39131C6.17569 2.02809 5.88124 1.73364 5.51802 1.73364C5.1548 1.73364 4.86035 2.02809 4.86035 2.39131C4.86035 2.75453 5.1548 3.04898 5.51802 3.04898Z" fill="white"/>
<path d="M33.8304 13.485C32.9604 13.005 32.2854 12.33 31.7754 11.475C31.2654 10.62 31.0254 9.66 31.0254 8.61C31.0254 7.56 31.2654 6.615 31.7754 5.76C32.2854 4.905 32.9604 4.23 33.8304 3.735C34.6854 3.255 35.6304 3 36.6504 3C37.4604 3 38.2254 3.15 38.9154 3.435C39.6054 3.735 40.1904 4.14 40.6704 4.65L39.5304 5.79C38.7954 4.98 37.8354 4.56 36.6504 4.56C35.9454 4.56 35.2854 4.74 34.6854 5.07C34.0704 5.4 33.5904 5.88 33.2304 6.495C32.8704 7.125 32.6904 7.83 32.6904 8.61C32.6904 9.42 32.8704 10.125 33.2304 10.74C33.5904 11.355 34.0854 11.835 34.6854 12.165C35.2854 12.495 35.9454 12.66 36.6654 12.66C37.7904 12.66 38.7054 12.315 39.4254 11.595C39.6504 11.385 39.8454 11.1 39.9954 10.755C40.1454 10.425 40.2654 10.05 40.3254 9.63H36.6354V8.175H41.8554C41.9154 8.52 41.9454 8.805 41.9454 9.045C41.9454 9.735 41.8254 10.38 41.6154 10.995C41.4054 11.61 41.0754 12.15 40.6254 12.615C40.1454 13.14 39.5604 13.545 38.9004 13.815C38.2254 14.085 37.4754 14.22 36.6504 14.22C35.6304 14.22 34.6854 13.98 33.8304 13.485Z" fill="#636363"/>
<path d="M45.0422 13.695C44.4272 13.335 43.9472 12.855 43.6172 12.225C43.2722 11.61 43.1072 10.92 43.1072 10.155C43.1072 9.405 43.2722 8.715 43.6172 8.085C43.9472 7.47 44.4272 6.99 45.0422 6.63C45.6422 6.27 46.3322 6.09 47.1122 6.09C47.8622 6.09 48.5522 6.27 49.1672 6.63C49.7672 6.99 50.2472 7.485 50.5922 8.1C50.9222 8.73 51.1022 9.405 51.1022 10.155C51.1022 10.92 50.9222 11.61 50.5922 12.225C50.2472 12.855 49.7672 13.335 49.1672 13.695C48.5672 14.055 47.8772 14.22 47.1122 14.22C46.3322 14.22 45.6422 14.055 45.0422 13.695ZM48.2972 12.42C48.6572 12.21 48.9422 11.91 49.1672 11.52C49.3772 11.13 49.4972 10.68 49.4972 10.155C49.4972 9.645 49.3772 9.18 49.1672 8.79C48.9422 8.4 48.6572 8.1 48.2972 7.89C47.9372 7.68 47.5322 7.575 47.1122 7.575C46.6772 7.575 46.2722 7.68 45.9122 7.89C45.5522 8.1 45.2522 8.4 45.0422 8.79C44.8172 9.18 44.7122 9.645 44.7122 10.155C44.7122 10.68 44.8172 11.13 45.0422 11.52C45.2522 11.91 45.5522 12.21 45.9122 12.42C46.2722 12.63 46.6772 12.735 47.1122 12.735C47.5322 12.735 47.9372 12.63 48.2972 12.42Z" fill="#636363"/>
<path d="M54.1242 13.695C53.5092 13.335 53.0292 12.855 52.6992 12.225C52.3542 11.61 52.1892 10.92 52.1892 10.155C52.1892 9.405 52.3542 8.715 52.6992 8.085C53.0292 7.47 53.5092 6.99 54.1242 6.63C54.7242 6.27 55.4142 6.09 56.1942 6.09C56.9442 6.09 57.6342 6.27 58.2492 6.63C58.8492 6.99 59.3292 7.485 59.6742 8.1C60.0042 8.73 60.1842 9.405 60.1842 10.155C60.1842 10.92 60.0042 11.61 59.6742 12.225C59.3292 12.855 58.8492 13.335 58.2492 13.695C57.6492 14.055 56.9592 14.22 56.1942 14.22C55.4142 14.22 54.7242 14.055 54.1242 13.695ZM57.3792 12.42C57.7392 12.21 58.0242 11.91 58.2492 11.52C58.4592 11.13 58.5792 10.68 58.5792 10.155C58.5792 9.645 58.4592 9.18 58.2492 8.79C58.0242 8.4 57.7392 8.1 57.3792 7.89C57.0192 7.68 56.6142 7.575 56.1942 7.575C55.7592 7.575 55.3542 7.68 54.9942 7.89C54.6342 8.1 54.3342 8.4 54.1242 8.79C53.8992 9.18 53.7942 9.645 53.7942 10.155C53.7942 10.68 53.8992 11.13 54.1242 11.52C54.3342 11.91 54.6342 12.21 54.9942 12.42C55.3542 12.63 55.7592 12.735 56.1942 12.735C56.6142 12.735 57.0192 12.63 57.3792 12.42Z" fill="#636363"/>
<path d="M62.8013 16.83C62.1863 16.41 61.7813 15.885 61.5713 15.285L63.0713 14.655C63.2213 15.075 63.4912 15.405 63.8512 15.645C64.2112 15.9 64.6463 16.02 65.1263 16.02C65.8313 16.02 66.3863 15.81 66.7913 15.39C67.1813 14.97 67.3913 14.385 67.3913 13.605V12.87H67.3013C67.0463 13.245 66.7162 13.53 66.2962 13.74C65.8762 13.95 65.3963 14.055 64.8563 14.055C64.1963 14.055 63.5963 13.89 63.0563 13.56C62.5163 13.23 62.0813 12.765 61.7513 12.165C61.4213 11.565 61.2713 10.86 61.2713 10.08C61.2713 9.3 61.4213 8.61 61.7513 8.01C62.0813 7.41 62.5163 6.93 63.0563 6.6C63.5963 6.27 64.1963 6.09 64.8563 6.09C65.3813 6.09 65.8613 6.21 66.2812 6.42C66.7013 6.63 67.0463 6.93 67.3013 7.29H67.3913V6.33H68.9363V13.575C68.9363 14.4 68.7713 15.105 68.4563 15.69C68.1263 16.275 67.6763 16.71 67.1063 17.01C66.5363 17.31 65.8763 17.46 65.1263 17.46C64.1963 17.46 63.4163 17.25 62.8013 16.83ZM66.2663 12.285C66.5963 12.09 66.8663 11.805 67.0763 11.43C67.2863 11.055 67.3913 10.605 67.3913 10.08C67.3913 9.555 67.2863 9.105 67.0763 8.715C66.8663 8.34 66.5963 8.055 66.2663 7.86C65.9213 7.665 65.5463 7.56 65.1413 7.56C64.7213 7.56 64.3463 7.665 64.0013 7.86C63.6563 8.055 63.3863 8.34 63.1763 8.715C62.9663 9.105 62.8763 9.555 62.8763 10.08C62.8763 10.605 62.9663 11.055 63.1763 11.43C63.3863 11.82 63.6563 12.105 64.0013 12.3C64.3463 12.495 64.7213 12.585 65.1413 12.585C65.5463 12.585 65.9213 12.495 66.2663 12.285Z" fill="#636363"/>
<path d="M70.8315 3.24H72.4515V13.98H70.8315V3.24Z" fill="#636363"/>
<path d="M75.7736 13.695C75.1736 13.35 74.7086 12.87 74.3786 12.255C74.0486 11.64 73.8836 10.95 73.8836 10.17C73.8836 9.45 74.0336 8.775 74.3636 8.145C74.6936 7.515 75.1436 7.02 75.7286 6.645C76.2986 6.285 76.9586 6.09 77.6936 6.09C78.4586 6.09 79.1186 6.27 79.6886 6.6C80.2436 6.93 80.6636 7.395 80.9636 7.98C81.2636 8.58 81.4136 9.24 81.4136 9.99C81.4136 10.2 81.3986 10.365 81.3836 10.5H75.4736C75.5336 11.235 75.8036 11.805 76.2536 12.195C76.7036 12.585 77.2286 12.78 77.8286 12.78C78.3086 12.78 78.7286 12.675 79.0886 12.45C79.4336 12.225 79.7186 11.925 79.9286 11.55L81.2636 12.195C80.9036 12.825 80.4386 13.32 79.8686 13.68C79.2836 14.04 78.5936 14.22 77.7836 14.22C77.0336 14.22 76.3736 14.055 75.7736 13.695ZM79.8086 9.285C79.7786 9.015 79.6886 8.73 79.5386 8.445C79.3736 8.175 79.1336 7.935 78.8336 7.755C78.5336 7.575 78.1586 7.47 77.7086 7.47C77.1686 7.47 76.7036 7.635 76.3286 7.965C75.9536 8.295 75.6986 8.745 75.5636 9.285H79.8086Z" fill="#636363"/>
<path d="M31.0703 20.536H32.0063L35.2373 25.666H35.2733L35.2373 24.424V20.536H36.0023V26.98H35.2103L31.8353 21.607H31.7993L31.8353 22.849V26.98H31.0703V20.536Z" fill="#636363"/>
<path d="M37.7245 26.926C37.4545 26.8 37.2565 26.62 37.1125 26.386C36.9685 26.152 36.8965 25.891 36.8965 25.594C36.8965 25.108 37.0765 24.73 37.4455 24.46C37.8055 24.19 38.2735 24.046 38.8315 24.046C39.1015 24.046 39.3625 24.082 39.5965 24.136C39.8305 24.199 40.0195 24.271 40.1455 24.343V24.064C40.1455 23.722 40.0195 23.452 39.7855 23.245C39.5425 23.038 39.2365 22.93 38.8765 22.93C38.6245 22.93 38.3815 22.993 38.1655 23.101C37.9495 23.209 37.7785 23.362 37.6525 23.56L37.0765 23.128C37.2565 22.858 37.4995 22.642 37.8235 22.48C38.1385 22.327 38.4895 22.246 38.8765 22.246C39.4975 22.246 39.9835 22.417 40.3435 22.741C40.6945 23.065 40.8745 23.515 40.8745 24.073V26.98H40.1455V26.323H40.1095C39.9745 26.548 39.7765 26.737 39.5155 26.89C39.2455 27.052 38.9485 27.124 38.6245 27.124C38.2825 27.124 37.9855 27.061 37.7245 26.926ZM39.4165 26.251C39.6325 26.125 39.8125 25.945 39.9475 25.72C40.0735 25.504 40.1455 25.261 40.1455 24.991C40.0015 24.901 39.8215 24.82 39.6145 24.757C39.3985 24.703 39.1825 24.667 38.9485 24.667C38.5255 24.667 38.2105 24.757 37.9945 24.928C37.7785 25.108 37.6795 25.333 37.6795 25.603C37.6795 25.855 37.7695 26.062 37.9675 26.215C38.1565 26.377 38.3995 26.449 38.6965 26.449C38.9485 26.449 39.1915 26.386 39.4165 26.251Z" fill="#636363"/>
<path d="M41.3469 22.39H42.1659L43.5879 26.08H43.6059L45.0459 22.39H45.8469L43.9749 26.98H43.2009L41.3469 22.39Z" fill="#636363"/>
<path d="M47.2061 26.809C46.8551 26.602 46.5851 26.314 46.3871 25.945C46.1891 25.576 46.0991 25.162 46.0991 24.694C46.0991 24.262 46.1891 23.857 46.3691 23.479C46.5491 23.101 46.8101 22.804 47.1521 22.579C47.4941 22.363 47.8811 22.246 48.3221 22.246C48.7721 22.246 49.1591 22.354 49.4921 22.552C49.8161 22.75 50.0681 23.029 50.2481 23.38C50.4281 23.74 50.5181 24.145 50.5181 24.595C50.5181 24.667 50.5091 24.748 50.5001 24.829H46.8641C46.8821 25.18 46.9631 25.477 47.1161 25.711C47.2601 25.954 47.4491 26.134 47.6831 26.251C47.9171 26.377 48.1601 26.431 48.4121 26.431C49.0061 26.431 49.4651 26.161 49.7711 25.603L50.4191 25.918C50.2211 26.287 49.9601 26.584 49.6181 26.8C49.2761 27.016 48.8621 27.124 48.3851 27.124C47.9441 27.124 47.5481 27.025 47.2061 26.809ZM49.7081 24.199C49.6901 24.01 49.6361 23.821 49.5461 23.623C49.4471 23.434 49.2941 23.272 49.0961 23.137C48.8891 23.011 48.6281 22.939 48.3221 22.939C47.9621 22.939 47.6561 23.056 47.4041 23.29C47.1521 23.524 46.9811 23.821 46.9091 24.199H49.7081Z" fill="#636363"/>
<path d="M52.1324 28.69C51.7814 28.438 51.5474 28.141 51.4304 27.781L52.1324 27.484C52.2224 27.754 52.3934 27.97 52.6274 28.132C52.8614 28.294 53.1494 28.375 53.4734 28.375C53.9414 28.375 54.3104 28.24 54.5714 27.961C54.8324 27.691 54.9674 27.295 54.9674 26.791V26.278H54.9314C54.7784 26.512 54.5624 26.71 54.2924 26.854C54.0224 26.998 53.7074 27.07 53.3654 27.07C52.9694 27.07 52.6004 26.971 52.2764 26.764C51.9524 26.566 51.6914 26.278 51.5024 25.909C51.3044 25.549 51.2144 25.126 51.2144 24.658C51.2144 24.199 51.3044 23.785 51.5024 23.416C51.6914 23.047 51.9524 22.759 52.2764 22.552C52.6004 22.354 52.9694 22.246 53.3654 22.246C53.7074 22.246 54.0224 22.327 54.2924 22.471C54.5624 22.615 54.7784 22.813 54.9314 23.047H54.9674V22.39H55.6964V26.8C55.6964 27.538 55.4894 28.105 55.0844 28.492C54.6704 28.879 54.1394 29.068 53.4734 29.068C52.9334 29.068 52.4834 28.942 52.1324 28.69ZM54.2204 26.17C54.4454 26.035 54.6254 25.837 54.7604 25.576C54.8954 25.324 54.9674 25.018 54.9674 24.658C54.9674 24.298 54.8954 23.992 54.7604 23.731C54.6254 23.479 54.4454 23.281 54.2204 23.146C53.9954 23.011 53.7434 22.939 53.4734 22.939C53.1944 22.939 52.9424 23.011 52.7174 23.146C52.4834 23.29 52.3034 23.488 52.1684 23.74C52.0334 24.001 51.9704 24.307 51.9704 24.658C51.9704 25.018 52.0334 25.324 52.1684 25.585C52.3034 25.846 52.4834 26.044 52.7174 26.179C52.9424 26.314 53.1944 26.377 53.4734 26.377C53.7434 26.377 53.9954 26.314 54.2204 26.17Z" fill="#636363"/>
<path d="M57.3505 26.926C57.0805 26.8 56.8825 26.62 56.7385 26.386C56.5945 26.152 56.5225 25.891 56.5225 25.594C56.5225 25.108 56.7025 24.73 57.0715 24.46C57.4315 24.19 57.8995 24.046 58.4575 24.046C58.7275 24.046 58.9885 24.082 59.2225 24.136C59.4565 24.199 59.6455 24.271 59.7715 24.343V24.064C59.7715 23.722 59.6455 23.452 59.4115 23.245C59.1685 23.038 58.8625 22.93 58.5025 22.93C58.2505 22.93 58.0075 22.993 57.7915 23.101C57.5755 23.209 57.4045 23.362 57.2785 23.56L56.7025 23.128C56.8825 22.858 57.1255 22.642 57.4495 22.48C57.7645 22.327 58.1155 22.246 58.5025 22.246C59.1235 22.246 59.6095 22.417 59.9695 22.741C60.3205 23.065 60.5005 23.515 60.5005 24.073V26.98H59.7715V26.323H59.7355C59.6005 26.548 59.4025 26.737 59.1415 26.89C58.8715 27.052 58.5745 27.124 58.2505 27.124C57.9085 27.124 57.6115 27.061 57.3505 26.926ZM59.0425 26.251C59.2585 26.125 59.4385 25.945 59.5735 25.72C59.6995 25.504 59.7715 25.261 59.7715 24.991C59.6275 24.901 59.4475 24.82 59.2405 24.757C59.0245 24.703 58.8085 24.667 58.5745 24.667C58.1515 24.667 57.8365 24.757 57.6205 24.928C57.4045 25.108 57.3055 25.333 57.3055 25.603C57.3055 25.855 57.3955 26.062 57.5935 26.215C57.7825 26.377 58.0255 26.449 58.3225 26.449C58.5745 26.449 58.8175 26.386 59.0425 26.251Z" fill="#636363"/>
<path d="M64.8688 26.764C64.5268 26.998 64.1218 27.124 63.6358 27.124L63.5008 27.421C63.6088 27.403 63.6718 27.394 63.7078 27.394C63.9328 27.394 64.1218 27.475 64.2838 27.637C64.4458 27.799 64.5268 28.006 64.5268 28.249C64.5268 28.492 64.4368 28.699 64.2658 28.861C64.0858 29.032 63.8698 29.113 63.6178 29.113C63.4198 29.113 63.2488 29.059 63.0958 28.942C62.9428 28.834 62.8348 28.69 62.7718 28.51L63.2218 28.312C63.2488 28.402 63.2938 28.483 63.3658 28.546C63.4378 28.609 63.5188 28.636 63.6178 28.636C63.7348 28.636 63.8338 28.6 63.9058 28.528C63.9778 28.456 64.0138 28.357 64.0138 28.249C64.0138 28.141 63.9778 28.042 63.9058 27.961C63.8338 27.889 63.7348 27.844 63.6178 27.844C63.4918 27.844 63.3838 27.898 63.3028 27.997L62.9068 27.817L63.1768 27.088C62.7988 27.034 62.4748 26.89 62.1868 26.665C61.8988 26.449 61.6738 26.161 61.5118 25.819C61.3498 25.477 61.2778 25.099 61.2778 24.685C61.2778 24.226 61.3768 23.812 61.5748 23.434C61.7728 23.065 62.0428 22.777 62.4028 22.561C62.7538 22.354 63.1498 22.246 63.5998 22.246C64.0948 22.246 64.5088 22.363 64.8508 22.597C65.1928 22.831 65.4358 23.137 65.5798 23.515L64.8868 23.803C64.7698 23.524 64.5988 23.308 64.3738 23.164C64.1488 23.02 63.8788 22.939 63.5638 22.939C63.2938 22.939 63.0418 23.02 62.8078 23.164C62.5738 23.308 62.3848 23.515 62.2408 23.776C62.0968 24.046 62.0338 24.343 62.0338 24.685C62.0338 25.027 62.0968 25.333 62.2408 25.594C62.3848 25.864 62.5738 26.071 62.8078 26.215C63.0418 26.359 63.2938 26.431 63.5638 26.431C63.8878 26.431 64.1668 26.359 64.4008 26.206C64.6348 26.062 64.8058 25.846 64.9228 25.567L65.6068 25.855C65.4448 26.233 65.2018 26.53 64.8688 26.764Z" fill="#636363"/>
<path d="M66.957 26.926C66.687 26.8 66.489 26.62 66.345 26.386C66.201 26.152 66.129 25.891 66.129 25.594C66.129 25.108 66.309 24.73 66.678 24.46C67.038 24.19 67.506 24.046 68.064 24.046C68.334 24.046 68.595 24.082 68.829 24.136C69.063 24.199 69.252 24.271 69.378 24.343V24.064C69.378 23.722 69.252 23.452 69.018 23.245C68.775 23.038 68.469 22.93 68.109 22.93C67.857 22.93 67.614 22.993 67.398 23.101C67.182 23.209 67.011 23.362 66.885 23.56L66.309 23.128C66.489 22.858 66.732 22.642 67.056 22.48C67.371 22.327 67.722 22.246 68.109 22.246C68.73 22.246 69.216 22.417 69.576 22.741C69.927 23.065 70.107 23.515 70.107 24.073V26.98H69.378V26.323H69.342C69.207 26.548 69.009 26.737 68.748 26.89C68.478 27.052 68.181 27.124 67.857 27.124C67.515 27.124 67.218 27.061 66.957 26.926ZM68.649 26.251C68.865 26.125 69.045 25.945 69.18 25.72C69.306 25.504 69.378 25.261 69.378 24.991C69.234 24.901 69.054 24.82 68.847 24.757C68.631 24.703 68.415 24.667 68.181 24.667C67.758 24.667 67.443 24.757 67.227 24.928C67.011 25.108 66.912 25.333 66.912 25.603C66.912 25.855 67.002 26.062 67.2 26.215C67.389 26.377 67.632 26.449 67.929 26.449C68.181 26.449 68.424 26.386 68.649 26.251ZM68.352 21.373C68.244 21.328 68.118 21.265 67.974 21.175C67.794 21.067 67.677 21.013 67.614 21.013C67.416 21.013 67.308 21.13 67.29 21.346H66.66C66.66 21.022 66.759 20.77 66.957 20.59C67.155 20.419 67.371 20.329 67.623 20.329C67.803 20.329 68.046 20.419 68.343 20.599C68.523 20.707 68.64 20.752 68.694 20.752C68.892 20.752 69 20.644 69.018 20.419H69.648C69.648 20.752 69.549 21.004 69.351 21.175C69.153 21.355 68.928 21.436 68.676 21.436C68.568 21.436 68.46 21.418 68.352 21.373Z" fill="#636363"/>
<path d="M72.0273 26.8C71.6673 26.584 71.3793 26.296 71.1813 25.918C70.9833 25.549 70.8843 25.135 70.8843 24.685C70.8843 24.235 70.9833 23.83 71.1813 23.452C71.3793 23.083 71.6673 22.786 72.0273 22.57C72.3873 22.354 72.7923 22.246 73.2423 22.246C73.6923 22.246 74.0973 22.354 74.4573 22.57C74.8173 22.786 75.0963 23.083 75.2943 23.452C75.4923 23.83 75.6003 24.235 75.6003 24.685C75.6003 25.135 75.4923 25.549 75.2943 25.918C75.0963 26.296 74.8173 26.584 74.4573 26.8C74.0973 27.016 73.6923 27.124 73.2423 27.124C72.7923 27.124 72.3873 27.016 72.0273 26.8ZM74.0253 26.224C74.2683 26.08 74.4663 25.882 74.6103 25.612C74.7543 25.351 74.8353 25.045 74.8353 24.685C74.8353 24.334 74.7543 24.028 74.6103 23.758C74.4663 23.497 74.2683 23.299 74.0253 23.155C73.7823 23.011 73.5213 22.939 73.2423 22.939C72.9543 22.939 72.6933 23.011 72.4503 23.155C72.1983 23.299 72.0003 23.497 71.8563 23.758C71.7123 24.028 71.6403 24.334 71.6403 24.685C71.6403 25.045 71.7123 25.351 71.8563 25.612C72.0003 25.882 72.1983 26.08 72.4503 26.224C72.6933 26.368 72.9543 26.431 73.2423 26.431C73.5213 26.431 73.7823 26.368 74.0253 26.224Z" fill="#636363"/>
<path d="M80.4234 26.926C80.1174 26.791 79.8564 26.593 79.6224 26.332C79.3884 26.071 79.2174 25.756 79.1184 25.378L79.8474 25.081C79.9464 25.468 80.1354 25.783 80.4144 26.026C80.6844 26.278 81.0084 26.395 81.3864 26.395C81.7554 26.395 82.0704 26.296 82.3314 26.098C82.5834 25.9 82.7184 25.621 82.7184 25.27C82.7184 24.973 82.6014 24.73 82.3854 24.532C82.1694 24.334 81.8094 24.154 81.3144 23.983L80.9094 23.839C80.4504 23.677 80.0814 23.47 79.7934 23.2C79.5054 22.939 79.3614 22.57 79.3614 22.102C79.3614 21.796 79.4424 21.517 79.6134 21.256C79.7754 20.995 80.0094 20.788 80.3154 20.626C80.6124 20.473 80.9454 20.392 81.3234 20.392C81.6924 20.392 82.0164 20.464 82.2954 20.599C82.5654 20.743 82.7904 20.905 82.9524 21.103C83.1144 21.301 83.2314 21.499 83.3034 21.688L82.5924 21.994C82.5204 21.778 82.3854 21.571 82.1694 21.391C81.9534 21.211 81.6744 21.121 81.3324 21.121C80.9994 21.121 80.7204 21.22 80.4864 21.4C80.2524 21.589 80.1354 21.823 80.1354 22.102C80.1354 22.354 80.2344 22.561 80.4324 22.723C80.6304 22.885 80.9274 23.029 81.3324 23.164L81.7554 23.308C82.2954 23.506 82.7274 23.758 83.0334 24.055C83.3394 24.352 83.4924 24.757 83.4924 25.261C83.4924 25.675 83.3844 26.026 83.1684 26.305C82.9524 26.593 82.6914 26.8 82.3674 26.926C82.0434 27.061 81.7104 27.124 81.3684 27.124C81.0444 27.124 80.7294 27.061 80.4234 26.926Z" fill="#636363"/>
<path d="M85.3331 26.809C84.9821 26.602 84.7121 26.314 84.5141 25.945C84.3161 25.576 84.2261 25.162 84.2261 24.694C84.2261 24.262 84.3161 23.857 84.4961 23.479C84.6761 23.101 84.9371 22.804 85.2791 22.579C85.6211 22.363 86.0081 22.246 86.4491 22.246C86.8991 22.246 87.2861 22.354 87.6191 22.552C87.9431 22.75 88.1951 23.029 88.3751 23.38C88.5551 23.74 88.6451 24.145 88.6451 24.595C88.6451 24.667 88.6361 24.748 88.6271 24.829H84.9911C85.0091 25.18 85.0901 25.477 85.2431 25.711C85.3871 25.954 85.5761 26.134 85.8101 26.251C86.0441 26.377 86.2871 26.431 86.5391 26.431C87.1331 26.431 87.5921 26.161 87.8981 25.603L88.5461 25.918C88.3481 26.287 88.0871 26.584 87.7451 26.8C87.4031 27.016 86.9891 27.124 86.5121 27.124C86.0711 27.124 85.6751 27.025 85.3331 26.809ZM87.8351 24.199C87.8171 24.01 87.7631 23.821 87.6731 23.623C87.5741 23.434 87.4211 23.272 87.2231 23.137C87.0161 23.011 86.7551 22.939 86.4491 22.939C86.0891 22.939 85.7831 23.056 85.5311 23.29C85.2791 23.524 85.1081 23.821 85.0361 24.199H87.8351Z" fill="#636363"/>
<path d="M90.2593 28.69C89.9083 28.438 89.6743 28.141 89.5573 27.781L90.2593 27.484C90.3493 27.754 90.5203 27.97 90.7543 28.132C90.9883 28.294 91.2763 28.375 91.6003 28.375C92.0683 28.375 92.4373 28.24 92.6983 27.961C92.9593 27.691 93.0943 27.295 93.0943 26.791V26.278H93.0583C92.9053 26.512 92.6893 26.71 92.4193 26.854C92.1493 26.998 91.8343 27.07 91.4923 27.07C91.0963 27.07 90.7273 26.971 90.4033 26.764C90.0793 26.566 89.8183 26.278 89.6293 25.909C89.4313 25.549 89.3413 25.126 89.3413 24.658C89.3413 24.199 89.4313 23.785 89.6293 23.416C89.8183 23.047 90.0793 22.759 90.4033 22.552C90.7273 22.354 91.0963 22.246 91.4923 22.246C91.8343 22.246 92.1493 22.327 92.4193 22.471C92.6893 22.615 92.9053 22.813 93.0583 23.047H93.0943V22.39H93.8233V26.8C93.8233 27.538 93.6163 28.105 93.2113 28.492C92.7973 28.879 92.2663 29.068 91.6003 29.068C91.0603 29.068 90.6103 28.942 90.2593 28.69ZM92.3473 26.17C92.5723 26.035 92.7523 25.837 92.8873 25.576C93.0223 25.324 93.0943 25.018 93.0943 24.658C93.0943 24.298 93.0223 23.992 92.8873 23.731C92.7523 23.479 92.5723 23.281 92.3473 23.146C92.1223 23.011 91.8703 22.939 91.6003 22.939C91.3213 22.939 91.0693 23.011 90.8443 23.146C90.6103 23.29 90.4303 23.488 90.2953 23.74C90.1603 24.001 90.0973 24.307 90.0973 24.658C90.0973 25.018 90.1603 25.324 90.2953 25.585C90.4303 25.846 90.6103 26.044 90.8443 26.179C91.0693 26.314 91.3213 26.377 91.6003 26.377C91.8703 26.377 92.1223 26.314 92.3473 26.17Z" fill="#636363"/>
<path d="M95.3065 26.638C95.0185 26.314 94.8745 25.864 94.8745 25.279V22.39H95.6395V25.162C95.6395 25.603 95.7385 25.927 95.9365 26.125C96.1345 26.332 96.3955 26.431 96.7375 26.431C96.9895 26.431 97.2235 26.368 97.4215 26.224C97.6195 26.089 97.7815 25.909 97.8895 25.684C97.9975 25.468 98.0605 25.234 98.0605 24.982V22.39H98.8255V26.98H98.0965V26.314H98.0605C97.9345 26.548 97.7275 26.737 97.4575 26.89C97.1785 27.052 96.8815 27.124 96.5755 27.124C96.0175 27.124 95.5945 26.962 95.3065 26.638Z" fill="#636363"/>
<path d="M99.9554 22.39H100.684V23.128H100.72C100.81 22.876 100.981 22.669 101.242 22.507C101.494 22.345 101.764 22.255 102.052 22.255C102.259 22.255 102.439 22.291 102.592 22.345V23.173C102.394 23.083 102.178 23.029 101.944 23.029C101.719 23.029 101.512 23.092 101.332 23.218C101.143 23.344 100.99 23.515 100.882 23.731C100.774 23.947 100.72 24.172 100.72 24.415V26.98H99.9554V22.39Z" fill="#636363"/>
<path d="M103.722 26.926C103.452 26.8 103.254 26.62 103.11 26.386C102.966 26.152 102.894 25.891 102.894 25.594C102.894 25.108 103.074 24.73 103.443 24.46C103.803 24.19 104.271 24.046 104.829 24.046C105.099 24.046 105.36 24.082 105.594 24.136C105.828 24.199 106.017 24.271 106.143 24.343V24.064C106.143 23.722 106.017 23.452 105.783 23.245C105.54 23.038 105.234 22.93 104.874 22.93C104.622 22.93 104.379 22.993 104.163 23.101C103.947 23.209 103.776 23.362 103.65 23.56L103.074 23.128C103.254 22.858 103.497 22.642 103.821 22.48C104.136 22.327 104.487 22.246 104.874 22.246C105.495 22.246 105.981 22.417 106.341 22.741C106.692 23.065 106.872 23.515 106.872 24.073V26.98H106.143V26.323H106.107C105.972 26.548 105.774 26.737 105.513 26.89C105.243 27.052 104.946 27.124 104.622 27.124C104.28 27.124 103.983 27.061 103.722 26.926ZM105.414 26.251C105.63 26.125 105.81 25.945 105.945 25.72C106.071 25.504 106.143 25.261 106.143 24.991C105.999 24.901 105.819 24.82 105.612 24.757C105.396 24.703 105.18 24.667 104.946 24.667C104.523 24.667 104.208 24.757 103.992 24.928C103.776 25.108 103.677 25.333 103.677 25.603C103.677 25.855 103.767 26.062 103.965 26.215C104.154 26.377 104.397 26.449 104.694 26.449C104.946 26.449 105.189 26.386 105.414 26.251Z" fill="#636363"/>
<defs>
<linearGradient id="paint0_linear_1887_88" x1="11.5913" y1="4.07128" x2="11.5913" y2="5.71546" gradientUnits="userSpaceOnUse">
<stop stop-color="#263238" stop-opacity="0.35"/>
<stop offset="0.42" stop-color="#263238" stop-opacity="0.15"/>
<stop offset="0.89" stop-color="#263238" stop-opacity="0.02"/>
<stop offset="1" stop-color="#263238" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>
                                    </div>
                                    </div>
                                    
                                    <!---->
                                </div>
                            </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
                <!--end header-->

                <!--data start-->
                <div class="w-full h-full relative max-w-[1000px] mx-auto">
                    <div class="lg:mt-5 w-full lg:w-[600px]">
                        <div class="flex flex-col-reverse lg:flex-row lg:gap-6">
                            <div class="w-full flex-1">
                                <div class="p-4 lg:p-4 xl:p-0 mb-5">
                                    <div class="mb-5">
                                        <h3 class="text-black font-bold text-[22px] lg:text-[20px]">Informações do
                                            evento</h3>
                                    </div>
                                    <div class="text-black rounded-xl py-4 px-5 border border-[rgba(0,0,0,.16)] font-normal text-base"
                                        v-html="event.description">
                                    </div>
                                </div>

                                <div class="p-4 lg:p-4 xl:p-0 mt-4 mb-8">
                                    <div class="text-black rounded-xl py-4 px-5 border border-[rgba(0,0,0,.16)] font-normal text-bas">
                                        <div class="text-[#495057] text-[15px]">
                                            <div class="gap-3 text-base flex text-black">
                                                <div class="shrink-0">
                                                    <img class="w-10 h-10 border rounded-full border-gray-300 bg-white"
                                                        v-lazy="'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'">
                                                </div>
                                                <div class="text-sm text-[rgb(0,0,0,.65)]">
                                                    <div
                                                        class="font-semibold text-black text-base flex gap-0.5 items-center whitespace-break-spaces max-w-full lg:w-full">Produzido por 
                                                        {{
                                                            event?.created_by?.first_name }} {{
                                                            event?.created_by?.last_name }}
                                                        <svg v-if="event?.created_by?.is_checked"
                                                            aria-label="Verificado" role="img" viewBox="0 0 40 40"
                                                            class="w-4 h-4 shrink-0">
                                                            <title>Verificado</title>
                                                            <path fill="#0095f6"
                                                                d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z">
                                                            </path>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div class="max-w-full lg:w-full truncate">{{
                                                        event?.created_by?.bio }}</div>

                                                        <div class="flex flex-1 items-center flex-row gap-3">
                                            <a v-if="event?.created_by?.email?.length" style="letter-spacing: 0.5px;"
                                                :href="`mailto:suporte@piweto.it.ao?subject=Informações sobre ${encodeURIComponent(event?.name)}&body=Olá,%0D%0A%0D%0AGostaria de saber mais sobre ${encodeURIComponent(event?.name)}.%0D%0A%0D%0AObrigado!`"
                                                target="_blank"
                                                class="underline"
                                                role="button" aria-pressed="true">


                                                Enviar e-mail
                                            </a>

                                            <a v-if="event?.created_by?.phone?.length" style="letter-spacing: 0.5px;"
                                                :href="`https://wa.me/${event?.created_by?.phone}?text=${encodeURIComponent('Olá, gostaria de informações sobre ' + event?.name)}`"
                                                target="_blank"
                                                class="underline"
                                                role="button" aria-pressed="true">
                                                Contato via WhatsApp
                                            </a>
                                        </div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>

                                <div class="p-4 lg:p-4 xl:p-0 mt-4">
                                    <div class="text-black mb-5 font-bold text-[22px] lg:text-[20px]">O que você deve saber</div>
                                    <div class="text-black rounded-xl border border-[rgba(0,0,0,.16)] font-normal text-base">
                                        <div class="border-b flex flex-row gap-[4px_16px] border-[rgba(0,0,0,.16)] p-[14px_20px_18px]">
                                            <div class="eventHelp__card--icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" class="lucide lucide-calendar-check"><path d="M8 2v4M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18M9 16l2 2 4-4"></path></svg></div><div class="eventHelp__card--content"><div class="text-base text-black font-semibold gap-2 flex items-center flex-row">No dia do evento</div><div class="text-sm text-[rgb(0,0,0,.65)]"> É obrigatório a apresentação do ticket digital ou impresso juntamente com o documento de identificação oficial com foto para a entrada no evento. </div></div></div><div class="border-b flex flex-row gap-[4px_16px] border-[rgba(0,0,0,.16)] p-[14px_20px_18px]"><div class="eventHelp__card--icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" class="lucide lucide-circle-check-big"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg></div><div class="eventHelp__card--content"><div class="text-base text-black font-semibold gap-2 flex items-center flex-row"> Responsabilidades </div><div class="text-sm text-[rgb(0,0,0,.65)]"> A organização e realização deste evento e as informações contidas nesta página são de total responsabilidade do organizador ({{
                                                            event?.created_by?.first_name }} {{
                                                            event?.created_by?.last_name }}) </div></div></div><div class="border-b flex flex-row gap-[4px_16px] border-[rgba(0,0,0,.16)] p-[14px_20px_18px]"><div class="eventHelp__card--icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" class="lucide lucide-user-pen"><path d="M11.5 15H7a4 4 0 0 0-4 4v2M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"></path><circle cx="10" cy="7" r="4"></circle></svg></div><div class="eventHelp__card--content"><div class="text-base text-black font-semibold gap-2 flex items-center flex-row"> Edição de participantes </div><div class="text-sm text-[rgb(0,0,0,.65)]"> Você poderá editar o participante de um ticket apenas 1 vez. Essa opção ficará disponível até 24 horas antes do início do evento. </div></div></div><div class="border-b flex flex-row gap-[4px_16px] border-[rgba(0,0,0,.16)] p-[14px_20px_18px]"><div class="eventHelp__card--icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" class="lucide lucide-circle-x"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6M9 9l6 6"></path></svg></div><div class="eventHelp__card--content"><div class="text-base text-black font-semibold gap-2 flex items-center flex-row">Cancelamento</div><div class="text-sm text-[rgb(0,0,0,.65)]"> Solicitações de cancelamento poderão ser efetuadas em até 7 dias após a compra e desde que seja antes de 48 horas do início do evento. O não comparecimento ao evento invalidará o ticket e não permitirá reembolso. </div></div></div></div></div>
                            </div>
                          
                        </div>
                    </div>
                </div>
                <!--data end-->
            </section>
        </div>
        <SplashScreen :visible="loadingEvent" />
    </div>

</template>

<script setup>
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify"
import { onMounted, ref, computed } from "vue";
import { useEvents } from "../../../repositories/events-repository";
import { useBatches } from "../../../repositories/batches-repository";
import formatAmount from "@/utils/formatAmount";
import { useStore } from "vuex";
import Container from "@/use-cases/marketplace/components/ui/Container.vue";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import CartDrawer from "../components/drawers/CartDrawer.vue";
import BtnSpinner from "../../marketplace/components/spinners/BtnSpinner";
import moment from "moment";
import { useCoupons } from "@/repositories/coupons-repository";
import SplashScreen from "../components/ui/SplashScreen.vue";
import createRippleAnimation from "@/utils/createRippleAnimation";


const { getEvent, loading: loadingEvent, error: errorEvent } = useEvents();
const { getBatches, loading: loadingBatches, error: errorBatches } = useBatches()
const { applyCoupon, loading: loadingCoupon } = useCoupons()

const route = useRoute()
const router = useRouter()
const store = useStore()
const form = ref({
    couponName: ""
})
const showCouponInput = ref(false)
const coupon = ref({})
const amount = ref(0)
const loadingCart = ref(false)
const amountAfterDiscount = ref(0)

const alert = ref({
    show: false,
    message: "",
    type: "warning"
})

// esta funcao computada tem como finalidade retornar o corrente evento.
const event = computed(() => {
    return store.getters.event
})

const isEventOver = computed(() => {
    return moment().isAfter(moment(event.value.ends_at.date, "YYYY-MM-DD HH:mm"));
});

// esta funcao computada tem como finalidade retornar todos os lotes disponiveis 
const batches = computed(() => {
    return store.getters.batches
})

// Esta função computada tem como finalidade verificar se o corrente usuário está autenticado no sistema.
const hasLogged = computed(() => {
    return store.getters.hasLogged
})


const formattedDate = (date) => {
    return moment(date).format("DD/MM/YY"); // Formata para 03/03/25
}


// Esta função computada tem como finalidade retornar o lote de ingressos selecionado pelo corrente usuário.
const batchesSelected = computed(() => {
    return batches.value.data.filter(batch => batch.quantitySelected > 0)
})

// Esta função tem como finalidade somar a quantidade de ingressos de um lote através do seu index na lista de lotes disponíveis do corrente evento.
function addBatch(index) {
    const currentBatch = batches.value.data[index]
    const max = currentBatch.quantity_for_purchase.max
    const min = currentBatch.quantity_for_purchase.min
    const quantity = currentBatch.quantitySelected

    if (currentBatch.quantity - currentBatch.quantitySelected <= min) {
        currentBatch.quantitySelected = currentBatch.quantity
        calcTotalAmount()
    } else {
        if (quantity <= max) {
            currentBatch.quantitySelected += min
            if (currentBatch.quantitySelected > max) {
                currentBatch.quantitySelected = max
            }
            calcTotalAmount()
        } else return
    }
}

// Esta função tem como finalidade subrair a quantidade de ingressos de um lote através do seu index na lista de lotes disponíveis do corrente evento.
function reduceBatch(index) {
    const currentBatch = batches.value.data[index]
    const min = currentBatch.quantity_for_purchase.min
    const quantity = currentBatch.quantitySelected

    if (quantity >= min) {
        currentBatch.quantitySelected -= 1

        if (currentBatch.quantitySelected < min) {
            currentBatch.quantitySelected = 0
            if (batchesSelected.value.length == 0) {
                amount.value = 0
            }
        }
        calcTotalAmount()
    } else {
        amount.value = 0
        currentBatch.quantitySelected = 0
        calcTotalAmount()
    }
}

// Esta função tem como finalidade calcular a quantia total do carrinho de compras.
function calcTotalAmount() {
    batchesSelected.value.reduce((acc, batch) => amount.value = acc + batch.price * batch.quantitySelected, 0)
    if (coupon?.value?._id != undefined) {
        amountAfterDiscount.value = amount.value - (amount.value * coupon?.value?.discount / 100)
    }
}

function isDatePassed(targetDate) {
    // Converte a data informada para objeto Date (caso seja string)
    const endDate = new Date(targetDate);
    // Pega a data/hora atual
    const now = new Date();

    // Compara os timestamps (milissegundos desde 1970)
    return now > endDate;
}

function canReleaseSales(targetDate) {
    // Converte a data informada para objeto Date (caso seja string)
    const endDate = new Date(targetDate);
    // Pega a data/hora atual
    const now = new Date();

    // Compara os timestamps (milissegundos desde 1970)
    return now >= endDate;
}


// Esta função tem como finalidade fazer uma requesição REST a api para criar um carrinho de compras com os ingressos selecionados pelo corrente usuário. 
function sendToCart(e) {
    if (batchesSelected.value.length) {
        createRippleAnimation(e)
        const id = `RES-${Date.now()}`
        store.dispatch("setCart", {
            id,
            amount: amount.value,
            event: event.value,
            amount_after_discount: amountAfterDiscount.value,
            coupon: coupon.value,
            batches: batchesSelected.value
        })
        loadingCart.value = true
        setTimeout(() => {
            router.push('/checkout/carrinho/' + event.value.slug)
            loadingCart.value = false
        }, 1030)
    } else {
        alert.value = {
            show: true,
            message: "Nenhum ingresso foi selecionado.",
            type: "warning"
        }
    }
}

// Esta função tem como finalidade fazer uma requesição REST a api e aplicar um cupom de desconto para o carrinho de compras. 
async function _applyCoupon(code, event) {
    if (loadingCoupon.value || code !== "") {
        createRippleAnimation(event)
        await applyCoupon({
            couponName: code
        })
            .then(_coupon => {
                if (_coupon.event_type == 'specific' && _coupon.applicable_event.toString() !== event.value._id.toString()) {
                    toast("Cupom de desconto inválido!", {
                        theme: "colored",
                        position: "top-right",
                        autoClose: 2000,
                        type: 'error'
                    })
                } else {
                    coupon.value = _coupon
                    toast("Cupom de desconto adicionado!", {
                        theme: "colored",
                        position: "top-right",
                        autoClose: 1000,
                        type: 'success'
                    })
                    amountAfterDiscount.value = amount.value - (amount.value * _coupon.discount_value / 100)
                }
            })
            .catch((err) => {
                toast("Cupom de desconto inválido!", {
                    theme: "colored",
                    position: "top-right",
                    autoClose: 2000,
                    type: 'error'
                })
                form.value.couponName = ""
                console.error(err.message)
            })
            .finally(() => {
                loadingCoupon.value = false
            })
    } else return
}

// Esta função tem como finalidade remover o cupom de desconto adicionado ao carrinho de compras. 
function removeCoupon() {
    Swal.fire({
        title: "Voce deseja remover o cupom de desconto?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            coupon.value = {}
            amountAfterDiscount.value = 0
            form.value.couponName = ""
            toast("Cupom de desconto removido!", {
                theme: "colored",
                position: "bottom-center",
                autoClose: 1000,
                type: 'success'
            })
        }
    })
}

onMounted(async () => {
    if (!event.value?.slug || event.value?.slug !== route.params.slug) {
        await getEvent(route.params.slug).then(async () => {
            document.title = event.value.name
            await getBatches({
                event: event.value._id,
                page: 1,
                visibility: 'public',
                limit: 10
            })
        })
    } else {
        loadingEvent.value = false
        await getBatches({
            event: event.value._id,
            page: 1,
            visibility: 'public',
            limit: 10
        });
    }
})
</script>

<style></style>