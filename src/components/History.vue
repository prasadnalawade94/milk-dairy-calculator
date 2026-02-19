<script setup>
import { useBillStore } from '../stores/billStore'
const store = useBillStore()
</script>

<template>
  <div>
    <div v-for="h in store.history"
         :key="h.id"
         class="bg-white p-3 rounded shadow mb-3">

      <div class="font-bold mb-2">
        {{ h.time }}
      </div>

      <div v-for="(item,i) in h.items" :key="i">
        {{ item.item?.name }}
        - {{ item.qty }}
        = ₹{{ item?.price * item.qty }}
      </div>

      <div class="text-right font-bold mt-2">
        Total: ₹{{ h.total }}
      </div>
    </div>
  </div>
</template>
