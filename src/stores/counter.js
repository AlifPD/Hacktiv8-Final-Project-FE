import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('useStore', () => {
  const username = ref('username')
  const email = ref('mail@mail.com')
  const dataInventory = ref([])
  // function untuk mengambil data inventory
  const getData = async () => {
    try {
      const response = await fetch('../data/dummy.json')
      const json = await response.json()
      dataInventory.value = json
    } catch (error) {
      console.error("Error mengambil data", error);
    }

  }
  const dataPeminjaman = ref([])

  // function untuk mengambil data peminjaman
  const getPeminjaman = async () => {
    try {
      const response = await fetch('../data/peminjaman.json')
      const json = await response.json()
      dataPeminjaman.value = json
    } catch (error) {
      console.error("Error mengambil data", error)
    }
  }

  // function untuk menambah data peminjaman 
  const dataTambahPinjaman = ref({})
  const tambahDataPeminjaman = async (dataTambahPinjaman) => {
    try {
      const response = await fetch('../data/peminjaman.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataTambahPinjaman.value)
      })
      const json = await response.json()
      dataPeminjaman.value.push(json)
      console.log(dataPeminjaman.value)
    } catch (error) {
      console.error("Error menambah data", error)
    }
  }
  return { 
    email, 
    username,
    dataInventory,
    dataPeminjaman,
    dataTambahPinjaman,
    tambahDataPeminjaman,
    getPeminjaman, 
    getData }
})
