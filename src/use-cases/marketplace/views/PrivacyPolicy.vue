<script setup>
import Container from '../components/ui/Container.vue';

</script>

<template>
    <Container>
        <div class="px-4 xl:px-0">
            <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center">
                <h1 class="font-bold mt-7 my-0 lg:my-5 text-2xl lg:text-3xl">Política de privacidade</h1>
                <div class="flex items-center text-[#6c757d]">
                    <router-link class="text-brand-primary hover:underline" to="/">Home</router-link>
                    <span class="mx-1.5">/</span>
                    <p>Política de privacidade</p>
                </div>
            </div>

        </div>
    </Container>
    <div class="mt-5 lg:mt-4 mb-2">
        <hr>
    </div>
    <Container>
        <div class="px-4 mb-6">
            <p class="mb-4 mt-5">A Piweto valoriza sua privacidade e está comprometida em proteger seus dados pessoais.
                Esta
                Política de Privacidade descreve como coletamos, usamos e protegemos suas informações ao utilizar a
                nossa
                plataforma <a href="https://piweto.it.ao" class="text-brand-info">https://piweto.it.ao</a>.</p>

            <h2 class="text-xl font-bold mt-6">1. Informações Coletadas</h2>
            <p class="mt-2 mb-4">Podemos coletar informações pessoais e não pessoais para melhorar sua experiência na
                plataforma.</p>
            <ul class="list-disc pl-6 mt-2 mb-4">
                <li><strong>Dados pessoais:</strong> Nome, e-mail, número de telefone e endereço (caso fornecidos).</li>
                <li><strong>Dados de pagamento:</strong> Informações necessárias para processar transações, protegidas
                    por
                    criptografia.</li>
                <li><strong>Dados de navegação:</strong> Endereço IP, tipo de navegador e tempo de acesso.</li>
            </ul>

            <h2 class="text-xl font-bold mt-6">2. Uso das Informações</h2>
            <p class="mt-2 mb-4">As informações coletadas são utilizadas para:</p>
            <ul class="list-disc pl-6 mt-2 mb-4">
                <li>Processamento de compras e emissão de ingressos.</li>
                <li>Melhoria contínua dos nossos serviços.</li>
                <li>Envio de notificações sobre eventos, promoções e atualizações.</li>
                <li>Prevenção de fraudes e garantia de segurança.</li>
            </ul>

            <h2 class="text-xl font-bold mt-6">3. Compartilhamento de Informações</h2>
            <p class="mt-2 mb-4">A Piweto não vende nem compartilha seus dados com terceiros, exceto nos seguintes
                casos:</p>
            <ul class="list-disc pl-6 mt-2 mb-4">
                <li>Quando necessário para processar pagamentos e garantir segurança.</li>
                <li>Com parceiros de eventos, apenas para a entrega dos serviços contratados.</li>
                <li>Quando exigido por lei ou autoridades governamentais.</li>
            </ul>

            <h2 class="text-xl font-bold mt-6">4. Segurança dos Dados</h2>
            <p class="mt-2 mb-4">A Piweto adota medidas de segurança para proteger suas informações contra acessos não
                autorizados, perdas e alterações.</p>

            <h2 class="text-xl font-bold mt-6">5. Política de Cookies</h2>
            <p class="mt-2 mb-4">Utilizamos cookies para melhorar sua experiência de navegação. Você pode gerenciar suas
                preferências de cookies nas configurações do seu navegador.</p>

            <h2 class="text-xl font-bold mt-6">6. Seus Direitos</h2>
            <p class="mt-2 mb-4">Você tem o direito de acessar, corrigir ou excluir seus dados pessoais. Para isso,
                entre em
                contato pelo e-mail <a href="mailto:suporte@piweto.it.ao"
                    class="text-brand-info">suporte@piweto.it.ao</a>.</p>

            <h2 class="text-xl font-bold mt-6">7. Alterações na Política</h2>
            <p class="mt-2 mb-4">A Piweto pode atualizar esta Política de Privacidade periodicamente. Recomendamos que
                você
                revise esta página regularmente para estar ciente de eventuais mudanças.</p>

            <h2 class="text-xl font-bold mt-6">8. Contato</h2>
            <p class="mt-2 mb-4">Para qualquer dúvida sobre nossa Política de Privacidade, entre em contato conosco
                através do
                e-mail <a href="mailto:suporte@piweto.it.ao" class="text-brand-info">suporte@piweto.it.ao</a>.</p>
        </div>
    </Container>

</template>