<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'
import { useStore } from '@/stores/counter';

const store = useStore()
store.isLoggedIn()

let peminjamanData = ref([])
const fetchPeminjaman = async () => {
  peminjamanData.value = await store.getPeminjaman()
}

const fetchInventory = async () => {
  await store.getAllInventory()
}

const fetchUserById = async () => {
  await store.getUserById()
}

const deleteLoan = async (id) => {
  await store.deleteLoan(id)
}

const validStatus = ref(['Sedang Dipinjam', 'Belum Dikembalikan', 'Sudah Dikembalikan'])
const handleUpdateLoan = async (idPinjaman, barangPinjaman, quantity, statusValue) => {
  await store.editDataPeminjaman(idPinjaman, barangPinjaman, quantity, statusValue)
}

onMounted(() => {
  fetchPeminjaman()
  fetchInventory()
  fetchUserById()
})

let isSedangDipinjam = ref(false)
let isSudahDikembalikan = ref(false)
let isBelumDikembalikan = ref(false)
let isStatusFiltered = ref(false)
// function untuk memfilter berdasarkan status 

const sedangDipinjamFilter = () => {
  isSedangDipinjam.value = true
  isSudahDikembalikan.value = false
  isBelumDikembalikan.value = false
  isStatusFiltered.value = true
}

const sudahDikembalikanFilter = () => {
  isSedangDipinjam.value = false
  isSudahDikembalikan.value = true
  isBelumDikembalikan.value = false
  isStatusFiltered.value = true
}

const belumDikembalikanFilter = () => {
  isSedangDipinjam.value = false
  isSudahDikembalikan.value = false
  isBelumDikembalikan.value = true
  isStatusFiltered.value = true
}

const removeFilter = () => {
  isSedangDipinjam.value = false
  isSudahDikembalikan.value = false
  isBelumDikembalikan.value = false
  isStatusFiltered.value = false
}

const filteredList = (peminjamanData) => {
  let filteredData = peminjamanData.value;

  if (isSedangDipinjam.value) {
    filteredData = filteredData.filter(item => item.status === 'Sedang Dipinjam');
  } else if (isSudahDikembalikan.value) {
    filteredData = filteredData.filter(item => item.status === 'Sudah Dikembalikan');
  } else if (isBelumDikembalikan.value) {
    filteredData = filteredData.filter(item => item.status === 'Belum Dikembalikan');
  } else if (isStatusFiltered.value) {
    filteredData = peminjamanData.value;
  }
  return filteredData;
};

const currentPage = ref(1);
const perPage = ref(10); //limit per page in a table 

const paginatedLoan = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return filteredList(peminjamanData).slice(start, end)
})


const totalPages = computed(() => {
  return Math.ceil(filteredList(peminjamanData).length / perPage.value); // Accessing .value here
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

const convertToDateInputFormat = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};



watch(peminjamanData.value)


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
            <h1>History</h1>
            <div class="row">
              <div class="col-4 col-sm-1 my-3">
                <button class="btn btn-primary text-white rounded dropdown-toggle" type="button"
                  data-bs-toggle="dropdown">
                  <i class="bi bi-sliders"></i>
                </button>

                <ul class="dropdown-menu">
                  <li>
                    <div class="dropdown-item text-primary p-2" @click.prevent="sedangDipinjamFilter">
                      <span>
                        Sedang Dipinjam
                      </span>
                      <i class="bi bi-check text-success" v-if="isSedangDipinjam"></i>
                    </div>
                    <div class="dropdown-item text-primary p-2" @click.prevent="sudahDikembalikanFilter">
                      <span>
                        Sudah Dikembalikan
                      </span>
                      <i class="bi bi-check text-success" v-if="isSudahDikembalikan"></i>
                    </div>
                    <div class="dropdown-item text-primary p-2" @click.prevent="belumDikembalikanFilter">
                      <span>
                        Belum Dikembalikan
                      </span>
                      <i class="bi bi-check text-success" v-if="isBelumDikembalikan"></i>
                    </div>
                  </li>
                </ul>
              </div>

              <div class="col-4 col-sm-1 my-3">
                <span class="btn btn-warning rounded text-primary">
                  <i class="bi bi-arrow-clockwise" @click.prevent="fetchPeminjaman()"></i>
                </span>
              </div>

              <div class="col-4 col-sm-10 my-3" v-if="isStatusFiltered">
                <span class="btn btn-light rounded-pill border-dark w-25 text-dark" @click.prevent="removeFilter">
                  <!-- <div class="row flex-inline"> -->
                  <i class="bi bi-x-circle"></i>
                  <!-- <p> Hapus Filter</p> -->
                  <!-- </div> -->
                </span>
              </div>

            </div>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th scope="col" class="text-center">No</th>
                    <th scope="col" class="text-center">Nama Barang</th>
                    <th scope="col" class="text-center" v-if="store.dataUserbyId.userType === '0'">Peminjam</th>
                    <th scope="col" class="text-center">Jumlah</th>
                    <th scope="col" class="text-center">Tanggal Peminjaman</th>
                    <th scope="col" class="text-center">Tanggal Pengembalian</th>
                    <th scope="col" class="text-center">Status</th>
                    <th scope="col" class="text-center" v-if="store.dataUserbyId.userType === '0'">Action</th>
                  </tr>
                </thead>
                <tbody class="table-group-divider">
                  <tr v-for="(peminjaman, index) in paginatedLoan" :key="peminjaman.id" :item="peminjaman">
                    <td class="text-center align-middle p-auto">{{ index + 1 }}</td>
                    <td class="text-center align-middle p-auto text-capitalize">{{ peminjaman.inventory.itemName }}</td>
                    <td class="text-center align-middle p-auto" v-if="store.dataUserbyId.userType === '0'">{{
                      peminjaman.user.userName }}
                    </td>
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
                      <i class="bi bi-pencil-square btn text-warning p-0" data-bs-toggle="modal"
                        :data-bs-target="'#updateModal-' + peminjaman.id" :data-id="peminjaman.id"></i>
                      <i class="bi bi-trash btn text-danger p-0" @click.prevent="deleteLoan(peminjaman.id)"></i>
                    </td>

                    <!-- modal edit data peminjaman -->
                    <div class="modal fade" :id="'updateModal-' + peminjaman.id" tabindex="-1"
                      aria-labelledby="updateModalLabel" aria-hidden="true">
                      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title text-capitalize" id="exampleModalLabel">Update Status Peminjaman</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                            <form>
                              <div class="row row-cols-1">
                                <div class="form-outline my-2">
                                  <label class="form-label fw-bold">Nama Barang</label>
                                  <input type="text" class="form-control rounded-pill text-capitalize"
                                    placeholder="Masukkan item name" required="true"
                                    v-model="peminjaman.inventory.itemName" disabled readonly />
                                </div>
                                <div class="form-outline my-2">
                                  <label class="form-label fw-bold">Nama Peminjam</label>
                                  <input type="text" class="form-control rounded-pill text-capitalize"
                                    placeholder="Masukkan nama peminjam" required="true"
                                    v-model="peminjaman.user.userName" readonly disabled>
                                </div>
                                <div class="form-outline my-2">
                                  <label class="form-label fw-bold">Jumlah</label>
                                  <input type="text" class="form-control rounded-pill" placeholder="Masukkan category"
                                    required="true" v-model="peminjaman.quantity" disabled readonly />
                                </div>
                                <div class="form-outline my-2">
                                  <label class="form-label fw-bold">Tanggal Peminjaman</label>
                                  <input type="string" class="form-control rounded-pill"
                                    placeholder="Masukkan tanggal peminjaman" required="true"
                                    v-bind:value="convertToDateInputFormat(peminjaman.dateLoan)" disabled readonly />
                                </div>
                                <div class="form-outline my-2">
                                  <label class="form-label fw-bold">Tanggal Pengembalian</label>
                                  <input type="string" class="form-control rounded-pill"
                                    placeholder="Masukkan tanggal pengembalian" required="true"
                                    v-bind:value="convertToDateInputFormat(peminjaman.dateReturn)" disabled readonly />
                                </div>
                                <div class="form-outline my-2">
                                  <label class="form-label fw-bold">Status</label>
                                  <select class="form-control rounded-pill" placeholder="Masukkan status"
                                    required="true" v-model="peminjaman.status">
                                    <option v-for="status in validStatus" :key="status">{{ status }}</option>
                                  </select>
                                </div>
                              </div>
                            </form>
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                            <button type="button" class="btn btn-primary"
                              @click.prevent="handleUpdateLoan(peminjaman.id, peminjaman.inventory.itemName, peminjaman.quantity, peminjaman.status)">Simpan</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </tr>

                  <tr v-if="paginatedLoan.length === 0">
                    <th class="text-center align-middle" colspan="7">
                      <i class="bi bi-database-fill-x text-secondary" style="font-size:50px;"></i>
                      <p class="fw-bold text-secondary">Belum ada data</p>
                    </th>
                  </tr>

                </tbody>
              </table>

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
    </div>
  </main>
</template>

<style scoped>
.dropdown-item.text-primary:hover {
  cursor: pointer;
}

.page-item:hover {
  cursor: pointer;
}
</style>
