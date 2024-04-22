<script setup>
import Sidebar from '../components/Sidebar.vue'
import { useStore } from '@/stores/counter';
import { getID } from '../../functions/getID'
import Navbar from '../components/Navbar.vue'
import { onMounted, ref, watch } from 'vue'
const store = useStore()

const fetchInventory = async () => {
  await store.getData()
}

onMounted(() => {
  fetchInventory()
})

let input = ref('')
function filteredList(dataInventory) {
  if (!input.value) {
    return dataInventory
  }
  else {
    return dataInventory.filter(item =>
      item.namaBarang.toLowerCase().includes(input.value.toLowerCase()))
  }
}

// function untuk mengurutkan data berdasarkan jumlah
let { sortStockDescending, sortStockAscending, sortProductDescending, sortProductAscending } = ref(false)
function stockDescending(dataInventory) {
  sortStockDescending = true
  sortStockAscending = false
  sortProductAscending = false
  sortProductDescending = false
  return dataInventory.sort((a, b) => b.jumlah - a.jumlah)
}

function stockAscending(dataInventory) {
  sortStockAscending = true
  sortStockDescending = false
  sortProductAscending = false
  sortProductDescending = false
  return dataInventory.sort((a, b) => a.jumlah - b.jumlah)
}

// function untuk mengurutkan data berdasarkan nama
function productDescending(dataInventory) {
  sortStockAscending = false
  sortStockDescending = false
  sortProductDescending = true
  sortProductAscending = false
  return dataInventory.sort((a, b) => b.namaBarang.localeCompare(a.namaBarang))

}

function productAscending(dataInventory) {
  sortStockAscending = false
  sortStockDescending = false
  sortProductAscending = true
  sortProductDescending = false
  return dataInventory.sort((a, b) => a.namaBarang.localeCompare(b.namaBarang))
}

watch(input, filteredList(store.dataInventory), stockDescending(store.dataInventory), stockAscending(store.dataInventory), productDescending(store.dataInventory), productAscending(store.dataInventory))
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
            <h1>Daftar Inventaris Alat</h1>
            <!-- button untuk cari data dan filter-->
            <div class="row justify-conten-between">
              <div class="col-sm-4 my-3">
                <div class="input-group h-100">
                  <input class="form-control rounded-start-pill" type="text" placeholder="Search" v-model="input">
                  <i class="bi bi-search border rounded-end-pill p-2 text-primary" style="font-size: 1.2rem;"></i>
                </div>
              </div>

              <div class="col-sm my-3">
                <button class="btn btn-primary text-white rounded-pill dropdown-toggle" type="button"
                  data-bs-toggle="dropdown">
                  <i class="bi bi-sliders"></i>
                  <span> Filter</span>
                </button>

                <ul class="dropdown-menu">
                  <li>
                    <a class="dropdown-item text-primary" href="#" @click="stockDescending(store.dataInventory)">
                      <i class="bi bi-sort-numeric-down-alt"></i>
                      <span>
                        Stock terbanyak
                      </span>
                      <i class="bi bi-check text-success" v-if="sortStockDescending"></i>
                    </a>
                    <a class="dropdown-item text-primary" href="#" @click="stockAscending(store.dataInventory)">
                      <i class="bi bi-sort-numeric-up-alt"></i>
                      <span>
                        Stock terendah
                      </span>
                      <i class="bi bi-check text-success" v-if="sortStockAscending"></i>
                    </a>
                    <a class="dropdown-item text-primary" href="#" @click="productDescending(store.dataInventory)">
                      <i class="bi bi-sort-alpha-down-alt"></i>
                      <span>
                        Nama Produk (Z-A)
                      </span>
                      <i class="bi bi-check text-success" v-if="sortProductDescending"></i>
                    </a>
                    <a class="dropdown-item text-primary" href="#" @click="productAscending(store.dataInventory)">
                      <i class="bi bi-sort-alpha-up-alt"></i>
                      <span>
                        Nama Produk (A-Z)
                      </span>
                      <i class="bi bi-check text-success" v-if="sortProductAscending"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div class="row row-cols-1 row-cols-sm-3 g-4">
              <!-- card isi data tersedia (diambil dari data dummy) -->
              <div class="col" v-for="item in filteredList(store.dataInventory)" :key="item" :item="item">
                <div class="card">
                  <img :src="item.urlPicture" class="img-thumbnail img-fluid" alt="..." height="300">
                  <div class="card-body">
                    <h5 class="card-title text-truncate text-capitalize">{{ item.namaBarang }}</h5>
                    <p class="card-subtitle mb-2 text-body-secondary text-capitalize"> Kategori: {{ item.kategori }}</p>
                    <p class="card-text"> Stock: {{ item.jumlah }}</p>
                    <a class="card-link btn btn-primary rounded-pill" @click.prevent="getID(item.id)">
                      Detail
                    </a>
                    <a class="card-link btn btn-success rounded-pill">
                      Add to Cart
                    </a>
                  </div>
                </div>
              </div>

              <!-- jika tidak ada data ditemukan -->
              <div class="col-sm-12 text-center " v-if="input && !filteredList(store.dataInventory).length">
                <i class="bi bi-emoji-frown text-danger" style="font-size:50px;"></i>
                <p class="fw-bold text-danger">Data tidak ditemukan. Silakan ketikkan kata kunci yang lain</p>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  </main>
</template>
