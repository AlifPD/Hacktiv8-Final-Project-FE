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
      const response = await axios.post('http://localhost:4000/api/auth/login', data) 
      token.value = response.data.data.token
      localStorage.setItem('token', token.value)
      localStorage.setItem('id', response.data.data.id)
      router.push({name: 'home'})
    } catch (error) {
      console.error(error); 
      if(error.code === "ERR_NETWORK"){
        Swal.fire({
          icon: 'error',
          text: error.message,
        })
      }
      else{
        Swal.fire({
          icon: 'error',
          text: error.response.data.message,
        })
      }
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
  const register = async (userName, email, password, confirmPassword, phoneNumber) => {
    try {
      const data = {
        userName,
        email,
        password,
        phoneNumber,
        confirmPassword
      }
      await axios.post('http://localhost:4000/api/auth/signup', data)
      Swal.fire({
        icon: 'success',
        text: 'Registrasi Berhasil, Klik OK untuk login',
      })
      router.push({name: 'login'})
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        text: error.response.data.message
      })
    }
  }
  // function untuk mengambil data inventory
  
  const getAllInventory = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/inventory/detail/all',{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      dataInventory.value = response.data.data
    } catch (error) {
      console.error("Error mengambil data", error.message)
      Swal.fire({
        icon: 'error',
        text: error.response.data.message
      })
  }
}

// function untuk lihat history peminjaman
  const dataPeminjaman = ref([])

  const getPeminjaman = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/loans/history`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      dataPeminjaman.value = response.data.data
    } catch (error) {
      console.error("Error mengambil data", error);
      Swal.fire({
        icon: 'error',
        text: error.response.data.message
      })
    }
  }

  // function untuk menambah data peminjaman 
  const dataTambahPinjaman = ref({})

  const tambahDataPeminjaman = async (pinjamanUser, quantity, borrowedDate, returnDate)=>{
    try {
      const selected = dataInventory.value.find(item => item.itemName === pinjamanUser)
      let id = 1 
      if (dataPeminjaman.value.length > 0) {
        id = Math.max.apply(null, dataPeminjaman.value.map(item => item.id)) + 1
      }
      await axios.post('http://localhost:4000/api/loans/create ', {
        // id: parseInt(dataPeminjaman.value.length + 1),
        id: id, // id peminjaman 
        idItem: selected.id,
        idUser : localStorage.getItem('id'), 
        quantity:parseInt(quantity),
        dateLoan: borrowedDate,
        dateReturn: returnDate,
        status: "Sedang Dipinjam",
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
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
      Swal.fire({
        icon: 'error',
        text: error.response.data.message
      })
    };
  }


  // function untuk menampilkan data user by id 
  const getUserById = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/auth/detail?id=${localStorage.getItem('id')}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      dataUserbyId.value = response.data.data
    } catch (error) {
      console.error("Error mengambil data", error.message);
      Swal.fire({
        icon: 'error',
        text: error.response.data.message
      })
    }
  }

  // function untuk menambah inventaris 

  const addInventory = async(itemname, category, quantity, location, pictureUrl, description) => {
    try {
      let data = {
        itemName: itemname, 
        quantity: parseInt(quantity),
        category: category,
        location: location,
        pictureUrl: pictureUrl,
        description: description
      }
      Swal.fire({
        icon: 'question',
        text: 'Apakah data yang ingin ditambahkan sudah benar?',
        showConfirmButton: true, 
        showCancelButton: true,
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal'
      })
      .then(async (result) => {
        if(result.isConfirmed){
          await axios.post('http://localhost:4000/api/inventory/create', data, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          Swal.fire({
            icon: 'success',
            text: "Berhasil tambah inventaris",
          })
          console.log(data);
        }
      })
      .catch((error) => {
        console.error('Error menambah data', error)
        Swal.fire({
          icon: 'error',
          text: error.response.data.message
        })
      })
    } catch (error) {}
  }

  // function delete inventory 

  const deleteInventory = async (id) => {
    Swal.fire({
      icon: 'question',
      text: 'Apakah Anda yakin ingin menghapus item ini?',
      showConfirmButton: true, 
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if(result.isConfirmed){
        await axios.delete(`http://localhost:4000/api/inventory/delete?id=${id}` ,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        console.log("ini id: ",id);
        Swal.fire({
          icon: 'success',
          text: "Berhasil hapus item",
        })
      }
    }).catch((error) => {
      console.error('Error menghapus data', error)
      Swal.fire({
        icon: 'error',
        text: error.response.data.message
      })
    })
  }

  const updateInventory = async (id, itemName, category, quantity, location, pictureUrl, description) => {
    Swal.fire({
      icon: 'question',
      text: 'Apakah data yang ingin diubah sudah benar?',
      showConfirmButton: true, 
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal'
    })
    .then(async (result) => {
      if(result.isConfirmed){
        const data = {
          itemName: itemName, 
          quantity: parseInt(quantity),
          category: category,
          location: location,
          pictureUrl: pictureUrl,
          description: description
        }
        await axios.put(`http://localhost:4000/api/inventory/update?id=${id}`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        Swal.fire({
          icon: 'success',
          text: "Berhasil ubah item",
        })
        }
    })
    .catch(error=>{
      console.error("Error mengubah data", error);
      Swal.fire({
        icon: 'error',
        text: error.response.data.message
      })
    })
  }

  return { 
    dataInventory,
    dataPeminjaman,
    dataTambahPinjaman,
    dataUserbyId,
    tambahDataPeminjaman,
    getPeminjaman, 
    getAllInventory,
    register,
    login, 
    logout,
    isLoggedIn,
    getUserById,
    addInventory,
    deleteInventory,
    updateInventory
  }
})
