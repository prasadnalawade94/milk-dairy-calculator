<script setup>
import { computed } from 'vue'
import { useBillStore } from '../stores/billStore'
import html2canvas from "html2canvas"

const store = useBillStore()

const products = {
दूध: [
{ name: "गोकुळ म्हैस", price: 75 },
{ name: "गोकुळ गाय", price: 57 },
{ name: "चितळे गाय", price: 57 },
{ name: "चितळे म्हैस", price: 73 },
{ name: "खांदवे (सौरभ) दूध", price: 48 },
{ name: "गोवर्धन दूध", price: 45 },
{ name: "कात्रज दूध", price: 56 },
{ name: "अक्षरा दूध", price: 48 },
{ name: "सारथी दूध", price: 46 },
{ name: "१/४ गोविंद दूध", price: 48 },
{ name: "१/२ गोविंद दूध" , price: 56 }
],

दही: [
{ name: "दही डबा", price: 8 },
{ name: "१/४ गोवर्धन दही", price: 80 },
{ name: "१/२ गोवर्धन दही", price: 71 },
{ name: "१ गोवर्धन दही", price: 62 },
{ name: "१/४ गोकुळ दही", price: 80 },
{ name: "१/२ गोकुळ दही", price: 80 },
{ name: "१ गोकुळ दही", price: 75 },
{ name: "अक्षरा दही", price: 70 },
{ name: "सारथी दही", price: 65 },
{ name: "कात्रज दही", price: 80 },
],

ताक: [
{ name: "गोवर्धन ताक", price: 26 },
{ name: "कात्रज ताक", price: 35 },
{ name: "अक्षरा ताक", price: 26 },
{ name: "सारथी ताक", price: 26 }
],

पनीर: [
{ name: "१/४ सारथी पनीर", price: 35 },
{ name: "१/२ सारथी पनीर", price: 70 },
{ name: "१/४ कात्रज पनीर", price: 45 },
{ name: "१/२ कात्रज पनीर", price: 90 }
],
तुप: [
{ name: "१ सारथी तुप ", price: 650 },
{ name: "१/२ सारथी तुप", price: 350 },
],
others: [
{ name: "इतर", price: 0 }
]
};









const grandTotal = computed(() =>
  store.rows.reduce((sum, r) => {
    if (!r.item) return sum
    return sum + (r.price * r.qty)
  }, 0)
)
function viewBill() {
  store.openBillPopup()
   store.addHistory({
    items: JSON.parse(JSON.stringify(store.rows)),
    total: grandTotal.value
  })
}
function saveBill() {


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

<div class="grid grid-cols-[minmax(65px,1fr)_55px_55px_70px] gap-2 font-bold mb-2">
  <div class="text-center">Item</div>
  <div class="text-center">Qty</div>
  <div class="text-center">Rate</div>
  <div class="text-center">Total</div>
</div>

  <!-- ROWS -->
<div v-for="(row,index) in store.rows"
     :key="index"
     class="grid grid-cols-[minmax(65px,1fr)_55px_55px_70px] gap-2 mb-2 items-center">


<select 
  v-model="row.item"
  @change="row.price = row.item.price"
  class="border rounded p-2 w-full"
>
  <option disabled value="">Select</option>

  <optgroup 
    v-for="(items, category) in products" 
    :key="category" 
    :label="category"
  >
    <option 
      v-for="p in items" 
      :key="p.name"
      :value="p"
    >
      {{ p.name }}
    </option>
  </optgroup>

</select>

  <input   type="number"
    v-model.number="row.qty"
    class="border rounded p-2 text-center"/>

<input type="number"
 v-model.number="row.price"
  class="border rounded p-2 text-center w-full"
/>

  <div class="text-right font-semibold">
    {{ row.item ? row.price * row.qty : 0 }}
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
          ₹{{ row.price * row.qty }}
        </span>
      </div>
    </div>

    <!-- Total -->
    <div class="text-right font-bold text-lg mt-3">
      Total: ₹{{
        store.rows.reduce((sum,r)=>
          r.item ? sum + (r.price*r.qty) : sum
        ,0)
      }}
    </div>

    <!-- Buttons -->
    <div class="flex gap-2 mt-4">
      <button
        @click="store.closeBillPopup"
        class="flex-1 bg-gray-400 text-white py-2 rounded">
        Close
      </button>

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
      = ₹{{ row.price * row.qty }}
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
 padding: 20px 10px 20px 2px; 
  background-color: #f9f9f9;
  border-radius: 8px;
}
 
</style>  