<script setup>
import Sidebar from '../components/Sidebar.vue'
import { useStore } from '@/stores/counter';
import { getID } from '../../functions/getID'
import Navbar from '../components/Navbar.vue'
import { onMounted, ref, watch, computed } from 'vue'
const store = useStore()
store.isLoggedIn()

let inventoryData = ref([])

const fetchInventory = async () => {
  inventoryData.value = await store.getAllInventory()
  return inventoryData
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
let { sortStockDescending, sortStockAscending, sortProductDescending, sortProductAscending, isFiltered } = ref(false)
function stockDescending(fetchInventory) {
  sortStockDescending = true
  sortStockAscending = false
  sortProductAscending = false
  sortProductDescending = false
  isFiltered = true
  return fetchInventory.sort((a, b) => b.quantity - a.quantity)
}

function stockAscending(fetchInventory) {
  sortStockAscending = true
  sortStockDescending = false
  sortProductAscending = false
  sortProductDescending = false
  isFiltered = true
  return fetchInventory.sort((a, b) => a.quantity - b.quantity)
}

// function untuk mengurutkan data berdasarkan nama
function productDescending(fetchInventory) {
  sortStockAscending = false
  sortStockDescending = false
  sortProductDescending = true
  sortProductAscending = false
  isFiltered = true
  return fetchInventory.sort((a, b) => b.itemName.localeCompare(a.itemName))

}

function productAscending(fetchInventory) {
  sortStockAscending = false
  sortStockDescending = false
  sortProductAscending = true
  sortProductDescending = false
  isFiltered = true
  return fetchInventory.sort((a, b) => a.itemName.localeCompare(b.itemName))
}

// function untuk remove filter 
function removeFilter(fetchInventory) {
  sortStockAscending = false
  sortStockDescending = false
  sortProductAscending = false
  sortProductDescending = false
  isFiltered = false
  return fetchInventory.sort((a, b) => a.id - b.id)
}


// function untuk tambah data 
async function handleAddInventory() {
  await store.addInventory(addItemName.value, addCategory.value, addQuantity.value, addLocation.value, addPictureUrl.value, addDescription.value)
  inventoryData.value = await store.getAllInventory()
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
  inventoryData.value = await store.getAllInventory()
}

// function untuk update data 
async function handleUpdateInventory(itemId, itemName, category, quantity, location, pictureUrl, description) {
  await store.updateInventory(itemId, itemName, category, quantity, location, pictureUrl, description)
  inventoryData.value = await store.getAllInventory()
}


const currentPage = ref(1);
const perPage = ref(9); // limit per page 

const paginatedInventory = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return filteredList(inventoryData.value).slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredList(inventoryData.value).length / perPage.value);
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const pageRange = computed(() => {
  const range = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 3) {
    for (let i = 1; i <= total; i++) {
      range.push(i);
    }
  } else {
    if (current <= 2) {
      range.push(1, 2, 3);
    } else if (current >= total - 1) {
      range.push(total - 2, total - 1, total);
    } else {
      range.push(current - 1, current, current + 1);
    }
  }

  if (current > 3) range.unshift('...');
  if (current < total - 2) range.push('...');

  return range;
});

watch(input, inventoryData.value)

</script>

<template>
  <header>
    <Navbar />
  </header>

  <main>
    <div class="container mt-5">
      <div class="row">
        <div class="col-sm-2 my-sm-5 px-0 bg-primary rounded">
          <Sidebar />
        </div>
        <div class="col my-sm-5 mt-2 px-3">
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

              <div class="col-4 col-sm-1 my-3 d-flex justify-content-sm-center">
                <button class="btn btn-primary text-white rounded dropdown-toggle" type="button"
                  data-bs-toggle="dropdown">
                  <i class="bi bi-sliders"></i>
                </button>

                <ul class="dropdown-menu">
                  <li>
                    <a class="dropdown-item text-primary" href="#" @click="stockDescending(inventoryData)">
                      <i class="bi bi-sort-numeric-down-alt"></i>
                      <span>
                        Stock terbanyak
                      </span>
                      <i class="bi bi-check text-success" v-if="sortStockDescending"></i>
                    </a>
                    <a class="dropdown-item text-primary" href="#" @click="stockAscending(inventoryData)">
                      <i class="bi bi-sort-numeric-up-alt"></i>
                      <span>
                        Stock terendah
                      </span>
                      <i class="bi bi-check text-success" v-if="sortStockAscending"></i>
                    </a>
                    <a class="dropdown-item text-primary" href="#" @click="productDescending(inventoryData)">
                      <i class="bi bi-sort-alpha-down-alt"></i>
                      <span>
                        Nama Produk (Z-A)
                      </span>
                      <i class="bi bi-check text-success" v-if="sortProductDescending"></i>
                    </a>
                    <a class="dropdown-item text-primary" href="#" @click="productAscending(inventoryData)">
                      <i class="bi bi-sort-alpha-up-alt"></i>
                      <span>
                        Nama Produk (A-Z)
                      </span>
                      <i class="bi bi-check text-success" v-if="sortProductAscending"></i>
                    </a>
                  </li>
                </ul>
              </div>

              <div class="col-4 col-sm-1 my-3 d-flex justify-content-sm-center ">
                <span class="btn btn-success text-white rounded" data-bs-toggle="modal" data-bs-target="#addModal">
                  <i class="bi bi-plus-circle h-100"></i>
                </span>
              </div>

              <div class="col-4 col-sm-1 my-3 ">
                <span class="btn btn-warning rounded text-primary">
                  <i class="bi bi-arrow-clockwise" @click.prevent="fetchInventory()"></i>
                </span>
              </div>

              <div class="col-4 col-sm my-3" v-if="isFiltered">
                <span class="btn btn-light rounded-pill border-dark w-25 text-dark"
                  @click.prevent="removeFilter(inventoryData)">
                  <i class="bi bi-x-circle"></i>
                </span>
              </div>
            </div>

            <div class="row row-cols-1 row-cols-sm-3 g-4">
              <!-- card isi data tersedia (diambil dari data dummy) -->
              <div class="col" v-for="item in paginatedInventory" :key="item.id" :item="item">
                <div class="homeCardBody card">
                  <div class="img-container">
                    <img :src="item.pictureUrl" class="img-thumbnail img-fluid custom-img-size" alt="..."
                      v-if="item.quantity === 0">
                    <p class="text-danger  w-25 text-center" v-if="item.quantity === 0">
                      Habis
                    </p>
                  </div>
                  <img :src="item.pictureUrl" class="img-thumbnail img-fluid custom-img-size" alt="..."
                    v-if="item.quantity > 0">
                  <div class="card-body">
                    <div class="d-flex flex-row justify-content-between align-items-center mb-2">
                      <h5 class="card-title text-truncate text-capitalize mb-0">{{ item.itemName }}</h5>
                      <i class="bi bi-info-circle text-success" :data-id="item.id" @click="getID(item.id)"
                        data-bs-toggle="modal" :data-bs-target="'#infoModal-' + item.id">
                      </i>
                    </div>
                    <p class="card-subtitle mb-2 text-capitalize text-truncate"> Kategori:
                      {{ item.category }}
                    </p>
                    <div class="d-flex flex-row justify-content-between align-items-center mb-2">
                      <p class="card-text mb-0">
                        Stock: {{ item.quantity }}
                      </p>
                      <p class="card-text text-danger border rounded border-danger w-25 text-center"
                        v-if="item.quantity === 0">
                        Habis
                      </p>
                    </div>
                  </div>
                </div>

                <!-- modal info -->
                <div class="modal fade" :id="'infoModal-' + item.id" tabindex="-1" aria-labelledby="infoModalLabel"
                  aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title text-capitalize" id="exampleModalLabel">{{ item.itemName }}</h5>
                        <p class="modal-title ms-3 text-danger border border-danger rounded w-25 fw-bold text-center"
                          v-if="item.quantity === 0">
                          Habis</p>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <div class="row">
                          <div class="col-sm-4 text-sm-center">
                            <img :src="item.pictureUrl" class="img-fluid " alt="..." height="10"
                              v-if="item.quantity > 0">
                            <img :src="item.pictureUrl" class="img-fluid" alt="..." height="10"
                              style="filter: grayscale(100%);" v-if="item.quantity === 0">
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
              <div class="col-sm-12 text-center " v-if="input && paginatedInventory.length === 0">
                <i class="bi bi-emoji-frown text-danger" style="font-size:50px;"></i>
                <p class="fw-bold text-danger">Data tidak ditemukan. Silakan ketikkan kata kunci yang lain</p>
              </div>

              <!-- jika belum ada data-->
              <div class="col-sm-12 text-center mt-5" v-if="!input && paginatedInventory.length === 0">
                <div class="loader text-center"></div>
                <h3 class="fw-bold text-secondary mt-3">Loading ...</h3>
              </div>

              <!-- <span class="loader"></span> -->


            </div>

            <!-- Pagination controls -->
            <nav aria-label="Page navigation example" class="mt-4">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" @click.prevent="goToPage(currentPage - 1)">Previous</a>
                </li>
                <li class="page-item" v-for="page in pageRange" :key="page" :class="{ active: currentPage === page }">
                  <a class="page-link" @click.prevent="goToPage(page)" v-if="page !== '...'">{{ page }}</a>
                  <span class="page-link" v-else>...</span>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a class="page-link" @click.prevent="goToPage(currentPage + 1)">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

  </main>
</template>

<style scoped>
.homeCardBody:hover {
  background-color: #3498db;
  cursor: pointer;
  color: white;
}

.bi-info-circle:hover {
  cursor: pointer;
}

.page-item:hover {
  cursor: pointer;
}

.custom-img-size {
  height: 200px;
  width: 100%;
}

.loader {
  border: 26px solid #f3f3f3;
  border-radius: 50%;
  border-top: 26px solid #3498db;
  width: 250px;
  height: 250px;
  animation: spin 2s linear infinite;
  margin: auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.img-container img {
  filter: grayscale(100%);
  /* fill-opacity: calc(0.3); */
}

.img-container p {
  position: absolute;
  top: 7%;
  left: 15%;
  transform: translate(-50%, -50%);
  /* font-size: 30px; */
  width: 50%;
  font-weight: bold;
  border: 2px solid red;
  border-radius: 10%;
}
</style>