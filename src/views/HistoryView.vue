<script setup>
import { onMounted, ref, watch } from 'vue';
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'

import { useStore } from '@/stores/counter';

const store = useStore()
store.isLoggedIn()

const fetchPeminjaman = async () => {
  await store.getPeminjaman()
}

const fetchInventory = async () => {
  await store.getAllInventory()
}

const fetchUserById = async () => {
  await store.getUserById()
}

const deleteLoan = async (id) => {
  await store.deleteLoan(id)
  await fetchPeminjaman()
}
onMounted(() => {
  fetchPeminjaman()
  fetchInventory()
  fetchUserById()
})

let input = ref('')

const filteredList = (dataPeminjaman) => {
  if (!input.value) {
    return dataPeminjaman.map(peminjaman => {
      const barang = store.dataInventory.find(item => item.id === peminjaman.idItem);
      return { ...peminjaman, itemName: barang ? barang.itemName : 'Barang tidak ditemukan' }
    })
  }
  else {
    const modifiedPeminjaman = dataPeminjaman.map(peminjaman => {
      const barang = store.dataInventory.find(item => item.id === peminjaman.idItem)
      return { ...peminjaman, itemName: barang ? barang.itemName : 'Barang tidak ditemukan' }
    })

    return modifiedPeminjaman.filter(item =>
      item.itemName.toLowerCase().includes(input.value.toLowerCase()))

  }
}

watch(input, filteredList(store.dataPeminjaman))

</script>

<template>
  <header>
    <Navbar />
  </header>
  <main>
    <div class="container mt-5">
      <div class="row">
        <div class="col-sm-2  my-sm-5 p-3">
          <Sidebar />
        </div>
        <div class="col my-sm-5 p-3">
          <div class="card p-4 shadow-lg">
            <h1>History</h1>
            <div class="row justify-content-between">
              <div class="col-sm-4 my-3">
                <div class="input-group h-100">
                  <input class="form-control rounded-start-pill" type="text" placeholder="Search" v-model="input">
                  <i class="bi bi-search border rounded-end-pill p-2 text-primary" style="font-size: 1.2rem;"></i>
                </div>
              </div>

            </div>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th scope="col" class="text-center">ID</th>
                    <th scope="col" class="text-center">No</th>
                    <th scope="col" class="text-center">Nama Barang</th>
                    <th scope="col" class="text-center">Jumlah</th>
                    <th scope="col" class="text-center">Tanggal Peminjaman</th>
                    <th scope="col" class="text-center">Tanggal Pengembalian</th>
                    <th scope="col" class="text-center">Status</th>
                    <th scope="col" class="text-center" v-if="store.dataUserbyId.userType === '0'">Action</th>
                  </tr>
                </thead>
                <tbody class="table-group-divider">
                  <tr v-for="(peminjaman, index) in filteredList(store.dataPeminjaman) ">
                    <td class="text-center align-middle p-auto">{{ peminjaman.id }}</td>
                    <td class="text-center align-middle p-auto">{{ index + 1 }}</td>
                    <td class="text-center align-middle p-auto text-capitalize">{{ peminjaman.itemName }}</td>
                    <td class="text-center align-middle p-auto">{{ peminjaman.quantity }}</td>
                    <td class="text-center align-middle p-auto">{{ peminjaman.dateLoan.toString().split('T')[0] }}</td>
                    <td class="text-center align-middle p-auto">{{ peminjaman.dateReturn.toString().split('T')[0] }}
                    </td>
                    <td class="text-center align-middle p-auto text-danger"
                      v-if="peminjaman.status == 'Belum Dikembalikan'">
                      {{ peminjaman.status }}
                    </td>
                    <td class="text-center align-middle p-auto text-success"
                      v-if="peminjaman.status == 'Sudah Dikembalikan'">
                      {{ peminjaman.status }}
                    </td>
                    <td class="text-center align-middle p-auto text-primary"
                      v-else-if="peminjaman.status == 'Sedang Dipinjam'">{{ peminjaman.status }}
                    </td>
                    <td class="text-center align-middle p-auto" v-if="store.dataUserbyId.userType === '0'">
                      <i class="bi bi-pencil-square btn text-warning"></i>
                      <i class="bi bi-trash btn text-danger" @click.prevent="deleteLoan(peminjaman.id)"></i>
                    </td>
                  </tr>
                  <tr v-if="!input && filteredList(store.dataPeminjaman).length == 0">
                    <th class="text-center align-middle" colspan="7">
                      <i class="bi bi-database-fill-x text-secondary" style="font-size:50px;"></i>
                      <p class="fw-bold text-secondary">Belum ada data</p>
                    </th>
                  </tr>
                  <tr v-if="input && !filteredList(store.dataPeminjaman).length">
                    <th class="text-center align-middle" colspan="7">
                      <i class="bi bi-emoji-frown text-danger" style="font-size:50px;"></i>
                      <p class="fw-bold text-danger">Data tidak ditemukan. Silakan ketikkan kata kunci yang lain</p>
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

        </div>
      </div>
    </div>
  </main>
</template>
