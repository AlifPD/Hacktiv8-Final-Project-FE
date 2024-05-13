import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import Swal from 'sweetalert2'
import router from '@/router'

export const useStore = defineStore('useStore', () => {
  const dataUserbyId = ref({})
  const dataInventory = ref([])
  
  // function login
  const token = ref('')
  const login = async (email, password) => {
    try {
      const data = {
        email,
        password
      }
      const response = await axios.post('http://localhost:3000/api/user/login', data)
      // console.log(response.data.data.idUser);
      token.value = response.data.data.token
      localStorage.setItem('token', token.value)
      localStorage.setItem('id', response.data.data.idUser)
      router.push({name: 'home'})
      return response.data.data.idUser
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        text: error.request.response.split('"')[7],
      })
    }
  }
  
  // function logout
  const logout = () => {
    localStorage.clear()
    router.push({name: 'login'})
  }
  
  // check apakah user sedang login
  const isLoggedIn = (() => {
    if (!localStorage.getItem('token')) {
      if (router.currentRoute.value.name === 'login') {
        router.push({name:'login'})
      }
      else if (router.currentRoute.value.name === 'register') {
        router.push({name:'register'})
      }
      else{
        router.push({name: 'login'})
        Swal.fire({
          icon: 'error',
          text: 'Silakan login terlebih dahulu',
        })
      }      
    }
    else if (router.currentRoute.value.name === 'login' || router.currentRoute.value.name === 'register') {
      router.push({name: 'home'})
    }
  })
  
  // function register
  const register = async (username, email, password) => {
    try {
      const data = {
        username,
        email,
        password
      }
      await axios.post('http://localhost:3000/api/user', data)
      Swal.fire({
        icon: 'success',
        text: 'Registrasi Berhasil, Klik OK untuk login',
      })
      router.push({name: 'login'})
    } catch (error) {
      console.log(error);
    }
  }
  // function untuk mengambil data inventory
  
  const getData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/inventaris',{
        headers: {
          token: localStorage.getItem('token')
        }
      })
      dataInventory.value = response.data.data
      // console.log(localStorage.getItem('token'));
      
    } catch (error) {
      console.error("Error mengambil data", error.message)
  }
}

// function untuk lihat history peminjaman
  const dataPeminjaman = ref([])

  const getPeminjaman = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/peminjaman/user/${localStorage.getItem('id')}`,{
        headers: {
          token: localStorage.getItem('token')
        }
      })
      dataPeminjaman.value = response.data.data
    } catch (error) {
      console.error("Error mengambil data", error);
    }
  }

  // function untuk menambah data peminjaman 
  const dataTambahPinjaman = ref({})

  const tambahDataPeminjaman = async (pinjamanUser, quantity, borrowedDate, returnDate)=>{
    try {
      const selected = dataInventory.value.find(item => item.namaBarang === pinjamanUser)
      let id = 1 
      if (dataPeminjaman.value.length > 0) {
        id = Math.max.apply(null, dataPeminjaman.value.map(item => item.id)) + 1
      }
      const response = await axios.post('http://localhost:3000/api/peminjaman', {
        // id: parseInt(dataPeminjaman.value.length + 1),
        id: id, // id peminjaman 
        idBarang: selected.id,
        idPeminjam : localStorage.getItem('id'), 
        jumlah:parseInt(quantity),
        tanggalPinjam: borrowedDate,
        tanggalKembali: returnDate,
        status: "Sedang Dipinjam",
      },
      {
        headers: {
          token: localStorage.getItem('token')
        }
      }
    )
      await axios.put(`http://localhost:3000/api/inventaris/${selected.id}`, {
        jumlah:parseInt(selected.jumlah) - parseInt(response.data.data.jumlah),
      },
      {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      Swal.fire({
        icon: 'success',
        text: "Berhasil ajukan peminjaman",
      })
      // redirect ke halaman history 
      router.push({name: 'histori'})
    } catch (error) {
      console.error("Error menambah data", error);
    };
  }



  // function untuk menampilkan data user 
  const getUser = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/user/${localStorage.getItem('id')}`, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      dataUserbyId.value = response.data.data
    } catch (error) {
      console.error("Error mengambil data", error.message);
    }
  }
  const username = dataUserbyId.username
  const email = dataUserbyId.value.email

  return { 
    email, 
    username,
    dataInventory,
    dataPeminjaman,
    dataTambahPinjaman,
    dataUserbyId,
    tambahDataPeminjaman,
    getPeminjaman, 
    getData,
    register,
    login, 
    logout,
    isLoggedIn,
    getUser}
})
