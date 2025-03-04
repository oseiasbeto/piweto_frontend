<script setup>
import Container from '../components/ui/Container.vue';

</script>

<template>
    <Container>
        <div class="px-4 xl:px-0">
            <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center">
                <h1 class="font-bold mt-7 my-0 lg:my-5 text-2xl lg:text-3xl">Termos de Uso</h1>
                <div class="flex items-center text-[#6c757d]">
                    <router-link class="text-brand-primary hover:underline" to="/">Home</router-link>
                    <span class="mx-1.5">/</span>
                    <p>Termos de Uso</p>
                </div>
            </div>

        </div>
    </Container>
    <div class="mt-5 lg:mt-4 mb-2">
        <hr>
    </div>
    <Container>
        <div class="px-4 mb-6">
            <p class="mb-4 mt-5">Bem-vindo ao website da <strong>Piweto</strong>. Através da nossa plataforma <a
                    href="https://piweto.it.ao" class="text-brand-info">https://piweto.it.ao</a>, você pode consultar
                eventos disponíveis e adquirir ingressos de forma online.</p>

            <h2 class="text-xl font-bold mt-6">1. Condições de Venda</h2>
            <p class="mt-2 mb-4">Os ingressos vendidos na Piweto são de responsabilidade do Promotor do Evento. A Piweto atua
                apenas como intermediária entre o Promotor e o Cliente.</p>
            <ul class="list-disc pl-6 mt-2 mb-4">
                <li>Em caso de cancelamento do evento, a responsabilidade de reembolso é do Promotor.</li>
                <li>Ingressos podem ser adquiridos diretamente com os Promotores.</li>
                <li>Em caso de erro por duplicação de transação, o cliente pode solicitar o reembolso integral.</li>
            </ul>

            <h2 class="text-xl font-bold mt-6">2. Métodos de Pagamento</h2>
            <p class="mt-2 mb-4">Atualmente, aceitamos pagamentos via Multicaixa Express, validado pela EMIS.</p>
            <p class="mt-2 mb-4">Em caso de utilização fraudulenta de cartões, a Piweto reserva-se o direito de cancelar
                transações suspeitas.</p>

            <h2 class="text-xl font-bold mt-6">3. Devoluções, Cancelamento e Adiamento de Eventos</h2>
            <ul class="list-disc pl-6 mt-2 mb-4">
                <li>Não aceitamos trocas ou devoluções, salvo casos especiais justificados antes da data do evento.</li>
                <li>Se um evento for adiado, os ingressos permanecerão válidos para a nova data.</li>
                <li>Se houver erro no valor cobrado, a Piweto poderá cancelar a compra e reembolsar o cliente.</li>
            </ul>

            <h2 class="text-xl font-bold mt-6">4. Segurança e Privacidade</h2>
            <p class="mt-2 mb-4">A Piweto garante a privacidade e segurança dos dados fornecidos pelos usuários. Os dados são
                tratados conforme a legislação vigente.</p>

            <h2 class="text-xl font-bold mt-6">5. Política de Cookies</h2>
            <p class="mt-2 mb-4">Utilizamos cookies para melhorar a experiência do usuário. Você pode aceitar ou recusar
                cookies nas configurações do seu navegador.</p>

            <h2 class="text-xl font-bold mt-6">6. Recolha e Utilização da Informação</h2>
            <p class="mt-2 mb-4">Coletamos informações como nome, e-mail e telefone para facilitar sua experiência e
                aprimorar nossos serviços. Seus dados são protegidos e não serão compartilhados com terceiros sem sua
                autorização.</p>

            <h2 class="text-xl font-bold mt-6">7. Alterações aos Termos</h2>
            <p class="mt-2 mb-4">A Piweto pode atualizar estes Termos e Condições periodicamente. Recomendamos a consulta
                regular desta página.</p>

            <h2 class="text-xl font-bold mt-6">8. Contato</h2>
            <p class="mt-2 mb-4">Se tiver dúvidas, entre em contato conosco através do nosso suporte em <a
                    href="mailto:suporte@piweto.it.ao" class="text-brand-info">suporte@piweto.it.ao</a>.</p>
        </div>
    </Container>

</template>