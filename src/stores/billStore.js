import { defineStore } from 'pinia'

export const useBillStore = defineStore('bill', {
  state: () => ({
    history: [],

    rows: [
      { item: null, qty: 1 }
    ],
     notification: {
    show: false,
    message: ''
  }, 
  showBillPopup: false
  }),

  actions: {

    addRow() {
      
  const lastRow = this.rows[this.rows.length - 1]

  // last row empty असेल तर new row add करू नका
  if (!lastRow.item) {
    this.showNotification("Please select item first")
    return
  }

  this.rows.push({ item: null, qty: 1 })
    },

    deleteRow(index) {
      if (this.rows.length === 1) {
        this.showNotification("At least one row is required")
        return
      }
      
      // Remove the row at the specified index
      if (index < 0 || index >= this.rows.length) {
        this.showNotification("Invalid row index")
        return
      }
      this.rows.splice(index, 1)
    },

    clearCalculator() {
      this.rows = [{ item: null, qty: 1 }]
    },

    addHistory(data) {
      this.history.unshift({
        id: Date.now(),
        time: new Date().toLocaleString(),
        items: data.items,
        total: data.total
      })

      localStorage.setItem(
        "milkHistory",
        JSON.stringify(this.history)
      )
    },

    loadHistory() {
      this.history =
        JSON.parse(localStorage.getItem("milkHistory")) || []
    },
    showNotification(msg) {
  this.notification.message = msg
  this.notification.show = true

  setTimeout(() => {
    this.notification.show = false
  }, 2000)
},
openBillPopup() {
  this.showBillPopup = true
},

closeBillPopup() {
  this.showBillPopup = false
}


  }
})
