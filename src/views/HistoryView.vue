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
const validStatus = ref(['Sedang Dipinjam', 'Belum Dikembalikan', 'Sudah Dikembalikan'])
const handleUpdateLoan = (idPinjaman, barangPinjaman, quantity, statusValue) => {
  store.editDataPeminjaman(idPinjaman, barangPinjaman, quantity, statusValue)
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

const convertToDateInputFormat = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};



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

              <div class="col my-3 mx-5 mx-sm-0">
                <span class="btn text-primary">
                  <i class="bi bi-arrow-clockwise" @click.prevent="fetchPeminjaman()"></i>
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
                  <tr v-for="(peminjaman, index) in filteredList(store.dataPeminjaman)" :key="peminjaman.id">
                    <td class="text-center align-middle p-auto">{{ index + 1 }}</td>
                    <td class="text-center align-middle p-auto text-capitalize">{{ peminjaman.itemName }}</td>
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
                      <i class="bi bi-pencil-square btn text-warning" data-bs-toggle="modal"
                        :data-bs-target="'#updateModal-' + peminjaman.id" :data-id="peminjaman.id"></i>
                      <i class="bi bi-trash btn text-danger" @click.prevent="deleteLoan(peminjaman.id)"></i>
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
                                    placeholder="Masukkan item name" required="true" v-model="peminjaman.itemName"
                                    disabled readonly />
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
                              @click.prevent="handleUpdateLoan(peminjaman.id, peminjaman.itemName, peminjaman.quantity, peminjaman.status)">Simpan</button>
                          </div>
                        </div>
                      </div>
                    </div>
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
