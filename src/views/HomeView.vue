<script setup>
import Sidebar from '../components/Sidebar.vue'
import { useStore } from '@/stores/counter';
import { getID } from '../../functions/getID'
import Navbar from '../components/Navbar.vue'
import { onBeforeUpdate, onMounted, onUpdated, ref, watch } from 'vue'
const store = useStore()
store.isLoggedIn()

const fetchInventory = async () => {
  await store.getAllInventory()
}


// const untuk add data 

const addItemName = ref('')
const addCategory = ref('')
const addQuantity = ref('')
const addLocation = ref('')
const addPictureUrl = ref('')
const addDescription = ref('')

onMounted(() => {
  fetchInventory()
})

// onUpdated(() => {
//   fetchInventory()
// })

let input = ref('')
function filteredList(fetchInventory) {
  if (!input.value) {
    return fetchInventory
  }
  else {
    return fetchInventory.filter(item =>
      item.itemName.toLowerCase().includes(input.value.toLowerCase()))
  }
}

// function untuk mengurutkan data berdasarkan quantity
let { sortStockDescending, sortStockAscending, sortProductDescending, sortProductAscending } = ref(false)
function stockDescending(fetchInventory) {
  sortStockDescending = true
  sortStockAscending = false
  sortProductAscending = false
  sortProductDescending = false
  return fetchInventory.sort((a, b) => b.quantity - a.quantity)
}

function stockAscending(fetchInventory) {
  sortStockAscending = true
  sortStockDescending = false
  sortProductAscending = false
  sortProductDescending = false
  return fetchInventory.sort((a, b) => a.quantity - b.quantity)
}

// function untuk mengurutkan data berdasarkan nama
function productDescending(fetchInventory) {
  sortStockAscending = false
  sortStockDescending = false
  sortProductDescending = true
  sortProductAscending = false
  return fetchInventory.sort((a, b) => b.itemName.localeCompare(a.itemName))

}

function productAscending(fetchInventory) {
  sortStockAscending = false
  sortStockDescending = false
  sortProductAscending = true
  sortProductDescending = false
  return fetchInventory.sort((a, b) => a.itemName.localeCompare(b.itemName))
}


// function untuk tambah data 
async function handleAddInventory() {
  await store.addInventory(addItemName.value, addCategory.value, addQuantity.value, addLocation.value, addPictureUrl.value, addDescription.value)
  await fetchInventory()

  console.log(await fetchInventory());
  // clear input
  addItemName.value = ''
  addCategory.value = ''
  addQuantity.value = ''
  addLocation.value = ''
  addPictureUrl.value = ''
  addDescription.value = ''
}

// function untuk delete data
async function handleDeleteInventory(itemId) {
  await store.deleteInventory(itemId)
  await fetchInventory()
}

// function untuk update data 
async function handleUpdateInventory(itemId, itemName, category, quantity, location, pictureUrl, description) {
  await store.updateInventory(itemId, itemName, category, quantity, location, pictureUrl, description)
  await fetchInventory()
}
// onUpdated(() => {
//   handleAddInventory()
//   handleDeleteInventory()
//   handleUpdateInventory()
// })

watch(input)

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

              <div class="col-2 my-3 d-flex justify-content-sm-center">
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

              <div class="col my-3 mx-5 mx-sm-0">
                <span class="btn btn-success text-white rounded-pill" data-bs-toggle="modal" data-bs-target="#addModal">
                  <i class="bi bi-plus-circle h-100"></i>
                  Tambah Inventaris
                </span>
              </div>
            </div>

            <div class="row row-cols-1 row-cols-sm-3 g-4">
              <!-- card isi data tersedia (diambil dari data dummy) -->
              <div class="col" v-for="item in filteredList(store.dataInventory)" :key="item.id" :item="item">
                <div class="card">
                  <img :src="item.pictureUrl" class="img-thumbnail img-fluid" alt="..." height="300">
                  <div class="card-body">
                    <div class="d-flex flex-row justify-content-between align-items-center mb-2">
                      <h5 class="card-title text-truncate text-capitalize mb-0">{{ item.itemName }}</h5>
                      <i class="bi bi-info-circle text-success" :data-id="item.id" @click="getID(item.id)"
                        data-bs-toggle="modal" :data-bs-target="'#infoModal-' + item.id">
                      </i>
                    </div>
                    <p class="card-subtitle mb-2 text-body-secondary text-capitalize text-truncate"> Kategori: {{
                      item.category }}</p>
                    <p class="card-text"> Stock: {{ item.quantity }}</p>
                  </div>
                </div>

                <!-- modal info -->
                <div class="modal fade" :id="'infoModal-' + item.id" tabindex="-1" aria-labelledby="infoModalLabel"
                  aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title text-capitalize" id="exampleModalLabel">{{ item.itemName }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <div class="row">
                          <div class="col-sm-4 text-sm-center">
                            <img :src="item.pictureUrl" class="img-fluid" alt="..." height="10">
                          </div>
                          <div class="col">
                            <ul class="list-group">
                              <li class="list-group-item bg-transparent text-capitalize"><b>Kategori</b>: {{
                                item.category }}
                              </li>
                              <li class="list-group-item bg-transparent text-capitalize"><b>Lokasi</b>: {{ item.location
                                }}</li>
                              <li class="list-group-item bg-transparent"><b> Stock </b>: {{ item.quantity }}</li>
                              <li class="list-group-item bg-transparent"><b>Deskripsi</b>: {{ item.description }}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-warning" data-bs-toggle="modal"
                          :data-bs-target="'#updateModal-' + item.id" :data-id="item.id">Edit</button>
                        <button type="button" class="btn btn-danger"
                          @click.prevent="handleDeleteInventory(item.id)">Delete</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- modal add inventory -->
                <div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title text-capitalize" id="exampleModalLabel">Tambah Inventaris Baru</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <form>
                          <div class="row row-cols-1 row-cols-sm-2">
                            <div class="form-outline my-2">
                              <label class="form-label fw-bold">Item Name</label>
                              <input type="text" class="form-control rounded-pill" placeholder="Masukkan item name"
                                required="true" v-model="addItemName" />
                            </div>
                            <div class="form-outline my-2">
                              <label class="form-label fw-bold">Category</label>
                              <input type="text" class="form-control rounded-pill" placeholder="Masukkan category"
                                required="true" v-model="addCategory" />
                            </div>
                            <div class="form-outline my-2">
                              <label class="form-label fw-bold">Quantity</label>
                              <input type="number" class="form-control rounded-pill" placeholder="Masukkan quantity"
                                required="true" v-model="addQuantity" v-bind:min="1" />
                              <p class="text-danger mb-0 mt-2 ms-2" v-if="addQuantity < 1 && addQuantity">Jumlah harus
                                lebih dari 0!
                              </p>
                            </div>
                            <div class="form-outline my-2">
                              <label class="form-label fw-bold">Location</label>
                              <input type="text" class="form-control rounded-pill" placeholder="Masukkan lokasi"
                                required="true" v-model="addLocation" />
                            </div>
                            <div class="form-outline my-2">
                              <label class="form-label fw-bold">Picture Url</label>
                              <input type="text" class="form-control rounded-pill" placeholder="Masukkan picture url"
                                required="true" v-model="addPictureUrl" />
                            </div>
                            <div class="form-outline my-2">
                              <label class="form-label fw-bold">Description</label>
                              <textarea class="form-control rounded" id="exampleFormControlTextarea1" rows="3"
                                placeholder="Masukkan deskripsi" required="true" v-model="addDescription"></textarea>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                        <button type="button" class="btn btn-primary" @click.prevent="handleAddInventory()"
                          :disabled="!addItemName || !addCategory || !addQuantity || !addLocation || !addPictureUrl || !addDescription || addQuantity <= 0">Simpan</button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- modal update inventory -->
                <div class="modal fade" :id="'updateModal-' + item.id" tabindex="-1" aria-labelledby="updateModalLabel"
                  aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title text-capitalize" id="exampleModalLabel">Update Inventaris Baru</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <form>
                          <div class="row row-cols-1 row-cols-sm-2">
                            <div class="form-outline my-2">
                              <label class="form-label fw-bold">Item Name</label>
                              <input type="text" class="form-control rounded-pill" placeholder="Masukkan item name"
                                required="true" v-model="item.itemName" />
                            </div>
                            <div class="form-outline my-2">
                              <label class="form-label fw-bold">Category</label>
                              <input type="text" class="form-control rounded-pill" placeholder="Masukkan category"
                                required="true" v-model="item.category" />
                            </div>
                            <div class="form-outline my-2">
                              <label class="form-label fw-bold">Quantity</label>
                              <input type="number" class="form-control rounded-pill" placeholder="Masukkan quantity"
                                required="true" v-model="item.quantity" v-bind:min="1" />
                              <p class="text-danger mb-0 mt-2 ms-2" v-if="addQuantity < 1 && addQuantity">Jumlah harus
                                lebih dari 0!
                              </p>
                            </div>
                            <div class="form-outline my-2">
                              <label class="form-label fw-bold">Location</label>
                              <input type="text" class="form-control rounded-pill" placeholder="Masukkan lokasi"
                                required="true" v-model="item.location" />
                            </div>
                            <div class="form-outline my-2">
                              <label class="form-label fw-bold">Picture Url</label>
                              <input type="text" class="form-control rounded-pill" placeholder="Masukkan picture url"
                                required="true" v-model="item.pictureUrl" />
                            </div>
                            <div class="form-outline my-2">
                              <label class="form-label fw-bold">Description</label>
                              <textarea class="form-control rounded" id="exampleFormControlTextarea1" rows="3"
                                placeholder="Masukkan deskripsi" required="true" v-model="item.description"></textarea>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                        <button type="button" class="btn btn-primary"
                          @click.prevent="handleUpdateInventory(item.id, item.itemName, item.category, item.quantity, item.location, item.pictureUrl, item.description)"
                          :disabled="!item.itemName || !item.category || !item.quantity || !item.location || !item.pictureUrl || !item.description || item.quantity <= 0">Simpan</button>
                      </div>
                    </div>
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

<style scoped>
.bi-info-circle:hover {
  cursor: pointer;
}
</style>
