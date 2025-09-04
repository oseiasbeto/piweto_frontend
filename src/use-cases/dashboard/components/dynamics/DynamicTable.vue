<template>
  <div class="overflow-x-auto w-full">
    <table class="w-full text-sm border-collapse border border-[#dfe0df]">
      <thead>
        <tr class="bg-[#fbfbfb] border border-[#dfe0df]">
          <th 
            v-for="(column, index) in columns" 
            :key="index"
            class="uppercase text-[11px] font-semibold py-2 p-3 text-left"
            :class="column.headerClass"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      
      <tbody v-if="!loading">
        <tr v-if="!data?.length">
          <td :colspan="columns.length" class="text-center text-xs text-gray-500 p-4">
            {{ emptyMessage }}
          </td>
        </tr>
        
        <tr 
          v-else 
          v-for="(item, rowIndex) in data" 
          :key="item.id || rowIndex"
          class="hover:bg-gray-50 transition-colors duration-150"
          :class="rowClass ? rowClass(item) : ''"
        >
          <td 
            v-for="(column, colIndex) in columns" 
            :key="colIndex"
            class="border border-gray-200 p-2"
            :class="column.cellClass ? column.cellClass(item) : ''"
          >
            <slot :name="`cell-${column.field}`" :item="item" :value="getNestedValue(item, column.field)">
              {{ formatCellValue(item, column) }}
            </slot>
          </td>
        </tr>
      </tbody>
      
      <tbody v-else>
        <tr>
          <td :colspan="columns.length" class="p-4 text-center">
            <slot name="loading">
              <BtnSpinner />
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import BtnSpinner from '../spinners/BtnSpinner.vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(col => col.label && col.field)
    }
  },
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  emptyMessage: {
    type: String,
    default: 'Nenhum registro encontrado'
  },
  rowClass: {
    type: Function,
    default: null
  }
})

// Função para obter valores aninhados (ex: item.user.name)
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

// Função para formatar o valor da célula
const formatCellValue = (item, column) => {
  const value = getNestedValue(item, column.field)
  
  if (column.formatter) {
    return column.formatter(value, item)
  }
  
  if (column.type === 'date' && value) {
    return new Date(value).toLocaleDateString('pt-BR')
  }
  
  if (column.type === 'currency' && value !== undefined) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }
  
  return value !== undefined && value !== null ? value : '-'
}
</script>