<script setup>
import { computed } from 'vue'
import { useBillStore } from '../stores/billStore'
import html2canvas from "html2canvas"

const store = useBillStore()

const products = [
  { name: "Amul", price: 57 },
  { name: "Gokul G", price: 70 },
  { name: "Gokul C", price: 70 }
]

const grandTotal = computed(() =>
  store.rows.reduce((sum, r) => {
    if (!r.item) return sum
    return sum + (r.item.price * r.qty)
  }, 0)
)
function viewBill() {
  store.openBillPopup()
}
function saveBill() {
  store.addHistory({
    items: JSON.parse(JSON.stringify(store.rows)),
    total: grandTotal.value
  })

  store.showNotification("Bill saved successfully")
  store.closeBillPopup()
  takeScreenshot()
}

function takeScreenshot() {
  const el = document.getElementById("screenshotArea")

  el.classList.remove("hidden")

  html2canvas(el).then(canvas => {
    const link = document.createElement("a")
    link.download =new Date().toLocaleString("en-IN", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
}).replace(/[/:, ]/g, "_") + "_bill.png"

    link.href = canvas.toDataURL()
    link.click()

    el.classList.add("hidden")
  })
}

</script>

<template>
  <div id="billArea">

  <div class="grid grid-cols-[1fr_60px_70px_90px] gap-2 font-bold mb-2">
    <div>Item</div>
    <div class="text-center">Qty</div>
    <div class="text-center">Rate</div>
    <div class="text-center">Total</div>
  </div>

  <!-- ROWS -->
  <div v-for="(row,index) in store.rows"
       :key="index"
       class="grid grid-cols-[1fr_60px_70px_90px] gap-2 mb-2 items-center">

  <select v-model="row.item"
    class="border rounded p-2 w-full">
    <option disabled value="">Select</option>
    <option v-for="p in products"
            :key="p.name"
            :value="p">
      {{ p.name }}
    </option>
  </select>

  <input type="number"
    v-model="row.qty"
    class="border rounded p-2 text-center"/>

  <div class="text-center">
    {{ row.item ? row.item.price : 0 }}
  </div>

  <div class="text-right font-semibold">
    {{ row.item ? row.item.price * row.qty : 0 }}
    <button
      @click="store.deleteRow(index)"
      class="text-red-500 font-bold ml-2">
      X
    </button>
  </div>
</div>

   <span @click="store.addRow" class="text-blue-500 font-bold cursor-pointer">+ Add Item</span>
    <div class="text-right text-xl font-bold mt-4">
      Total: ₹{{ grandTotal }}
    </div>
   <!-- <button
      @click="saveBill"
      class="w-full bg-blue-500 text-white py-2 rounded mt-2">
      Save Bill
    </button> -->

  

  </div>

  <button
    @click="viewBill"
    class="w-full bg-green-500 text-white py-2 rounded mt-3">
    View
  </button>

  <!-- <button
    @click="takeScreenshot"
    class="w-full bg-gray-700 text-white py-2 rounded mt-2">
    Screenshot
  </button> -->

  <button
    @click="store.clearCalculator"
    class="w-full bg-red-500 text-white py-2 rounded mt-2">
    Clear
  </button>
  <!-- BILL POPUP -->
<div v-if="store.showBillPopup"
     class="fixed inset-0 bg-black bg-opacity-40
            flex items-center justify-center z-50">

  <div class="bg-white w-[320px] p-4 rounded-lg shadow-lg">

    <h2 class="text-lg font-bold mb-3 text-center">
      Bill Details
    </h2>

    <!-- Bill Items -->
    <div v-for="(row,i) in store.rows" :key="i">
      <div v-if="row.item" class="flex justify-between">
        <span>
          {{ row.item.name }} - {{ row.qty }}
        </span>
        <span>
          ₹{{ row.item.price * row.qty }}
        </span>
      </div>
    </div>

    <!-- Total -->
    <div class="text-right font-bold text-lg mt-3">
      Total: ₹{{
        store.rows.reduce((sum,r)=>
          r.item ? sum + (r.item.price*r.qty) : sum
        ,0)
      }}
    </div>

    <!-- Buttons -->
    <div class="flex gap-2 mt-4">
      <!-- <button
        @click="store.closeBillPopup"
        class="flex-1 bg-gray-400 text-white py-2 rounded">
        Close
      </button> -->

      <button
        @click="saveBill"
        class="flex-1 bg-green-500 text-white py-2 rounded">
        Save
      </button>
    </div>

  </div>
</div>


  <div id="screenshotArea" class="bg-white p-4 w-[300px] hidden">

  <div class="font-bold mb-2">
    {{ new Date().toLocaleString() }}
  </div>

  <div v-for="(row,i) in store.rows" :key="i">
    <span v-if="row.item">
      {{ row.item.name }} -
      {{ row.qty }}
      = ₹{{ row.item.price * row.qty }}
    </span>
  </div>

  <div class="text-right font-bold mt-2">
    Total: ₹{{ grandTotal }}
  </div>

</div>

</template>
<style scoped>

#screenshotArea {
  position: absolute;
  top: -9999px; /* Hide off-screen */
}
#billArea {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}
 
</style>  