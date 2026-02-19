<script setup>
import { ref, onMounted } from 'vue'
import Calculator from './components/Calculator.vue'
import History from './components/History.vue'
import { useBillStore } from './stores/billStore'

const tab = ref('calc')
const store = useBillStore()

onMounted(() => {
  store.loadHistory()
})
</script>

<template>
  
  <div class="max-w-md mx-auto p-3">

    <h1 class="text-2xl font-bold text-center mb-4">
      Prasad Milk
    </h1>
<div v-if="store.notification.show" :class="store.notification.error ? 'bg-red-500' : 'bg-green-500'"
     class="fixed top-5 left-5 right-5
          text-white
         px-4 py-3 text-center
         shadow-lg z-50">

  {{ store.notification.message }}

</div>
    <div class="flex mb-3">
      <button
        @click="tab='calc'"
        class="flex-1 p-2 bg-blue-500 text-white rounded-l">
        Calculator
      </button>

      <button
        @click="tab='history'"
        class="flex-1 p-2 bg-gray-300 rounded-r">
        History
      </button>
    </div>

    <Calculator v-if="tab==='calc'" />
    <History v-else />
  </div>
</template>
