<script setup>
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'
import { useStore } from '@/stores/counter';
import { ref, watch } from 'vue';

const store = useStore()
store.isLoggedIn()
store.getUser()
store.getData()

const dataIventory = store.dataInventory

const namaBarang = ref(dataIventory.map(item => item.namaBarang))

const stock = ref(null)
const selectedBarang = ref(null)
const quantity = ref(0)
const borrowedDate = ref(null)
const returnDate = ref(null)


watch(selectedBarang, (newValue) => {
  if (newValue) {
    const selected = dataIventory.find(item => item.namaBarang === newValue)
    stock.value = selected.jumlah
  }
})
const username = store.username
const email = store.email

const today = new Date().toISOString().split('T')[0]

</script>

<template>
  <header>
    <Navbar />
  </header>
  <main>
    <div class="container mt-5">
      <div class="row">
        <div class="col-sm-2 my-sm-5 p-3">
          <Sidebar />
        </div>
        <div class="col my-sm-5 p-3">
          <div class="card p-4 shadow-lg">
            <h1>Peminjaman</h1>
            <h5 class="fw-normal">Halo, <b class="text-primary">{{ store.dataUserbyId.username }}</b></h5>
            <p>Silakan isi form peminjaman di bawah ini</p>

            <form>
              <div class="row row-cols-1 row-cols-sm-2 mt-3g-3">
                <!-- input username -->
                <div class="my-2">
                  <label for="username" class="form-label fw-bold">Username</label>
                  <input type="text" class="form-control rounded-pill" placeholder="username"
                    v-model="store.dataUserbyId.username" disabled readonly>
                </div>
                <!-- input email -->
                <div class="my-2">
                  <label for="email" class="form-label fw-bold">Email</label>
                  <input type="email" class="form-control rounded-pill" placeholder="Masukkan Email"
                    v-model="store.dataUserbyId.email" disabled readonly>
                </div>
                <!-- input nama barang -->
                <div class="my-2">
                  <label for="inventaris" class="form-label fw-bold">Nama Barang</label>
                  <select class="form-select rounded-pill text-capitalize" v-model="selectedBarang"
                    placeholder="Pilih Barang" required>
                    <option disabled selected>Pilih Barang</option>
                    <!-- <option v-for="item in store.dataInventory.map(item => item.namaBarang)" :key="item">{{ item }}
                    </option> -->
                    <option v-for="item in namaBarang" :key="item">{{ item }}</option>
                  </select>
                </div>
                <!-- input quantity -->
                <div class="my-2">
                  <div class="d-flex justify-content-between">
                    <label for="jumlah" class="form-label fw-bold">Jumlah</label>
                    <span class="text-muted" v-if="stock !== null">Stock: {{ stock }} pcs</span>
                  </div>
                  <input type="number" class="form-control rounded-pill border-danger" v-bind:min="0" v-bind:max="stock"
                    v-model="quantity"
                    v-if="quantity > stock || stock === 0 || quantity < 0 || (quantity == 0 && selectedBarang)"
                    required>
                  <input type="number" class="form-control rounded-pill" v-bind:min="0" v-bind:max="stock"
                    v-model="quantity" v-if="quantity <= stock && quantity > 0 || !selectedBarang" required>
                  <p class="text-danger mb-0 mt-2 ms-2" v-if="stock === 0">Maaf, stock habis
                  </p>
                  <p class="text-danger mb-0 mt-2 ms-2" v-if="quantity > stock">
                    Maaf, maksimum pemesanan adalah <strong>{{ stock }} pcs</strong>
                  </p>
                  <p class="text-danger mb-0 mt-2 ms-2" v-if="quantity < 0 && selectedBarang">
                    Maaf, nilai pemesanan tidak valid
                  </p>
                  <p class="text-danger mb-0 mt-2 ms-2" v-if="quantity == 0 && selectedBarang">
                    Maaf, nilai minimum pemesanan adalah <strong>1 pcs</strong>
                  </p>
                </div>
                <!-- input tanggal pinjam -->
                <div class="my-2">
                  <label for="tanggalPinjam" class="form-label fw-bold">Tanggal Peminjaman</label>
                  <input type="date" class="form-control rounded-pill border-danger" v-model="borrowedDate"
                    v-bind:min="today" v-if="borrowedDate < today" required>
                  <input type="date" class="form-control rounded-pill" v-model="borrowedDate" v-bind:min="today"
                    v-else="borrowedDate >= today" required>
                  <p class="text-danger mb-0 mt-2 ms-2" v-if="borrowedDate < today">
                    Tanggal yang dipilih harus lebih dari atau sama dengan <strong>{{ today }}</strong>
                  </p>
                </div>
                <!-- input tanggal kembali -->
                <div class="my-2">
                  <label for="tanggalKembali" class="form-label fw-bold">Tanggal Pengembalian</label>
                  <input type="date" class="form-control rounded-pill border-danger" v-model="returnDate"
                    v-bind:min="borrowedDate" v-if="returnDate < borrowedDate" required>
                  <input type="date" class="form-control rounded-pill" v-model="returnDate" v-bind:min="borrowedDate"
                    v-else="returnDate >= borrowedDate" required>
                  <p class="text-danger mb-0 mt-2 ms-2" v-if="returnDate < borrowedDate">
                    Tanggal yang dipilih harus lebih dari atau sama dengan <strong>{{ borrowedDate }}</strong>
                  </p>
                </div>
              </div>
              <button class="addButton btn btn-primary rounded-pill mt-3 w-100"
                :disabled="quantity > stock || quantity <= 0 || borrowedDate < today || returnDate < borrowedDate || borrowedDate === null || returnDate === null"
                @click.prevent="$event => store.tambahDataPeminjaman(selectedBarang, quantity, borrowedDate, returnDate)">
                Ajukan Peminjaman
              </button>
            </form>

          </div>

        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.add-button:disabled:hover:disabled:hover {
  cursor: no-drop;
}
</style>
