<script setup>
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'
import { useStore } from '@/stores/counter';

const store = useStore()
store.isLoggedIn()
store.getUserById()


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
                        <h1>Account</h1>
                        <div class="row justify-content-between">
                            <div class="col-sm-6">
                                <form>
                                    <div class="form-outline mb-4">
                                        <label class="form-label fw-bold">Email</label>
                                        <input type="email" class="form-control rounded-pill"
                                            v-model="store.dataUserbyId.email" disabled readonly>
                                    </div>
                                    <div class="form-outline mb-4">
                                        <label class="form-label fw-bold">Username</label>
                                        <input type="text" class="form-control rounded-pill"
                                            v-model="store.dataUserbyId.userName" disabled readonly>
                                    </div>
                                    <div class="form-outline mb-4">
                                        <label class="form-label fw-bold">Phone Number</label>
                                        <input type="text" class="form-control rounded-pill"
                                            v-model="store.dataUserbyId.phoneNumber" disabled readonly>
                                    </div>
                                </form>
                            </div>
                            <div class="col-sm-2 p-2">
                                <button class="btn btn-primary text-white rounded-pill w-100 mt-sm-3" type="button">
                                    <span class="bi bi-pencil"></span>
                                    &nbsp;Edit Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>