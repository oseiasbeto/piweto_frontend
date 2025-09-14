<template>
  <div class="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
    <!-- Cabeçalho -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Informações do Participante</h2>
      <p class="text-sm text-gray-500 mt-1">Detalhes completos do ingresso e participante</p>
    </div>

    <!-- Informações do Participante -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Dados Pessoais -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">Dados Pessoais</h3>

        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Nome Completo</label>
          <p class="text-sm text-gray-800">{{ partakerData.costumer.full_name }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Email</label>
          <p class="text-sm text-gray-800">{{ partakerData.costumer.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Telefone</label>
          <p class="text-sm text-gray-800">{{ partakerData.costumer.phone }}</p>
        </div>
      </div>

      <!-- Informações do Ingresso -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">Informações do Ingresso</h3>

        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Código do Ingresso</label>
          <p class="text-sm text-gray-800 font-mono">{{ partakerData.code }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Tipo de Ingresso</label>
          <p class="text-sm text-gray-800">{{ partakerData.name }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Preço</label>
          <p class="text-sm text-gray-800">{{ formatCurrency(partakerData.price) }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Status</label>
          <span :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
            partakerData.status === 'a'
              ? 'bg-green-100 text-green-800'
              : partakerData.status === 'd' ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
          ]">
            {{ getStatusText(partakerData.status) }}

          </span>
        </div>
      </div>
    </div>

    <!-- Informações da Compra -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Informações da Compra</h3>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Nº da Reserva</label>
          <p class="text-sm text-gray-800">{{ partakerData.booking_number }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Nº do Pedido</label>
          <p class="text-sm text-gray-800">{{ partakerData.order.id }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">PIN</label>
          <p class="text-sm text-gray-800 font-mono">{{ partakerData.order.pin }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Data da Compra</label>
          <p class="text-sm text-gray-800">{{ formatDate(partakerData.order.created_at) }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Método de Pagamento</label>
          <p class="text-sm text-gray-800 capitalize">{{ partakerData.order.data.payment_method }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Status do Pagamento</label>
          <span :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
            partakerData.order.status === 'a'
              ? 'bg-green-100 text-green-800'
              : partakerData.order.status === 'c' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
          ]">
            {{ partakerData.order.status === 'a' ? 'Confirmado' : partakerData.order.status === 'c' ? 'Cancelado' :
              'Pendente' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Informações do Check-in -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Status do Check-in</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Status do Check-in</label>
          <span :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
            partakerData.check_in.status === 'a'
              ? 'bg-green-100 text-green-800'
              : partakerData.check_in.status === 'p'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
          ]">
            {{ getCheckInStatusText(partakerData.check_in.status) }}
          </span>
        </div>

        <div v-if="partakerData.check_in.at">
          <label class="block text-sm font-medium text-gray-500 mb-1">Data do Check-in</label>
          <p class="text-sm text-gray-800">{{ formatDate(partakerData.check_in.at) }}</p>
        </div>

        <div v-if="partakerData.check_in.checked_by">
          <label class="block text-sm font-medium text-gray-500 mb-1">Realizado por</label>
          <p class="text-sm text-gray-800">{{ partakerData.check_in.checked_by }}</p>
        </div>
      </div>
    </div>

    <!-- Tags -->
    <div class="mb-6" v-if="partakerData.tags && partakerData.tags.length">
      <h3 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Tags</h3>
      <div class="flex flex-wrap gap-2">
        <span v-for="(tag, index) in partakerData.tags" :key="index"
          class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- Botões de Ação -->
    <div class="flex justify-between items-center pt-4 border-t">
      <div>
        <button @click="closeModal"
          class="px-5 py-2.5 text-sm font-medium hover:bg-blue-600 hover:text-white text-gray-700 bg-white border border-gray-300 rounded-lg">
          Fechar
        </button>
      </div>

      <div>
        <button @click="handleCheckIn" :disabled="partakerData.status !== 'a' || partakerData.check_in.status === 'c'"
          :class="[
            'px-5 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition',
            (partakerData.status !== 'a' || partakerData.check_in.status === 'c')
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
          ]">
          {{ partakerData.check_in.status === 'c' ? 'Check-in Realizado' : 'Realizar Check-in' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'ParticipantModal',
  props: {
    partakerData: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  emits: ['onclose', 'check-in'],
  setup(props, { emit }) {
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA'
      }).format(value);
    };

    console.log(props.partakerData);

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleString('pt-AO');
    };

    const getStatusText = (status) => {
      const statusMap = {
        'a': 'Ativo',
        'd': 'Cancelado',
        'p': 'Pendente'
      };
      return statusMap[status] || 'Desconhecido';
    };

    const getCheckInStatusText = (status) => {
      const statusMap = {
        'a': 'Check-in Realizado',
        'p': 'Pendente'
      };
      return statusMap[status] || 'Não Realizado';
    };

    const closeModal = () => {
      emit('onclose');
    };

    const handleCheckIn = async () => {
      if (props.partakerData.status === 'a' && props.partakerData.check_in.status !== 'c') {
        const result = await Swal.fire({
          title: 'Confirmar Check-in?',
          html: `<p>Tem certeza que deseja realizar o check-in de <strong>${props.partakerData.costumer.full_name}</strong>?</p>
           <p class="text-sm text-gray-500">Esta ação registrará a presença do participante no evento.</p>`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#10b981',
          cancelButtonColor: '#6b7280',
          confirmButtonText: 'Sim, realizar check-in!',
          cancelButtonText: 'Cancelar',
          reverseButtons: true,
          showLoaderOnConfirm: true,
          preConfirm: async () => {
            try {

              return true;
            } catch (error) {
              Swal.showValidationMessage(`Falha ao realizar check-in`);
            }
          },
          allowOutsideClick: () => !Swal.isLoading()
        });

        if (result.isConfirmed) {
          closeModal();
          // Sucesso no check-in
          Swal.fire({
            title: 'Check-in Realizado!',
            text: `O check-in foi realizado com sucesso.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });

          return true; // Retorna true indicando que o check-in foi realizado
        }
      }
    };

    return {
      formatCurrency,
      formatDate,
      getStatusText,
      getCheckInStatusText,
      closeModal,
      handleCheckIn
    };
  }
};
</script>

<style scoped>
/* Estilos adicionais se necessário */
</style>