<script setup>
import { RouterLink } from 'vue-router';
import { ref, watch } from 'vue';
import { useStore } from '@/stores/counter';
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const phoneNumber = ref('')

const store = useStore()
store.isLoggedIn()
// store.getUser()

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
    showConfirmPassword.value = !showConfirmPassword.value
}

watch(password, confirmPassword)

</script>
<template>
    <div class="container align-items-center vh-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-md-6 col-sm-12">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                    class="img-fluid" alt="Sample image" />
            </div>

            <div class="col-md-6 col-sm-12">
                <form>
                    <div class="mb-sm-4 mb-0">
                        <p class="text-center fw-bold mx-3 mb-0 fs-1">Selamat Datang di MedInventory</p>
                    </div>

                    <div class="card p-3 shadow-lg">
                        <!-- Username input -->
                        <div class="form-outline mb-4">
                            <label class="form-label fw-bold" for="username">Username</label>
                            <input type="text" class="form-control rounded-pill" placeholder="Masukkan username"
                                required="true" v-model="username" />
                        </div>

                        <!-- Email input -->
                        <div class="form-outline mb-4">
                            <label class="form-label fw-bold" for="email">Email</label>
                            <input type="email" class="form-control rounded-pill" placeholder="Masukkan email"
                                required="true" v-model="email" />
                        </div>

                        <!-- Phone Number input -->
                        <div class="form-outline mb-4">
                            <label class="form-label fw-bold" for="phoneNumber">Phone Number</label>
                            <input type="text" class="form-control rounded-pill" placeholder="Masukkan Phone Number"
                                required="true" v-model="phoneNumber" />
                        </div>

                        <!-- Password input -->
                        <div class="form-outline mb-3">
                            <label class="form-label fw-bold" for="password">Password</label>
                            <div class="input-group">
                                <!-- jika password disembunyikan -->
                                <input type="password" v-model="password" class="form-control rounded-start-pill"
                                    placeholder="Masukkan password" required="true" v-show="!showPassword" />
                                <!-- jika password ditampilkan -->
                                <input type="text" v-model="password" class="form-control rounded-start-pill"
                                    placeholder="Masukkan password" v-show="showPassword" />
                                <span class="input-group-text rounded-end-pill" @click="togglePasswordVisibility">
                                    <!-- jika password sedang ditampilkan dan ingin disembunyikan -->
                                    <i class="bi bi-eye-slash-fill" v-show="!showPassword"></i>
                                    <!-- jika password sedang disembunyikan dan ingin ditampilkan -->
                                    <i class="bi bi-eye-fill" v-show="showPassword"></i>
                                </span>
                            </div>
                            <div>
                                <p class="text-danger mb-0 mt-2 ms-2 "
                                    v-if="password.length < 5 && password.length >= 1">
                                    • Password harus lebih dari 5 karakter!
                                </p>
                            </div>
                        </div>

                        <!-- Konfirmasi password -->
                        <div class="form-outline mb-3">
                            <label class="form-label fw-bold" for="confirmPassword">Konfirmasi Password</label>
                            <div class="input-group">
                                <!-- jika password disembunyikan -->
                                <input type="password" v-model="confirmPassword" class="form-control rounded-start-pill"
                                    placeholder="Masukkan password" required="true" v-show="!showConfirmPassword" />
                                <!-- jika password ditampilkan -->
                                <input type="text" v-model="confirmPassword" class="form-control rounded-start-pill"
                                    placeholder="Masukkan password" v-show="showConfirmPassword" />
                                <span class="input-group-text rounded-end-pill"
                                    @click="toggleConfirmPasswordVisibility">
                                    <!-- jika password sedang ditampilkan dan ingin disembunyikan -->
                                    <i class="bi bi-eye-slash-fill" v-show="!showConfirmPassword"></i>
                                    <!-- jika password sedang disembunyikan dan ingin ditampilkan -->
                                    <i class="bi bi-eye-fill" v-show="showConfirmPassword"></i>
                                </span>
                            </div>
                            <div>
                                <p class="text-danger mb-0 mt-2 ms-2 "
                                    v-if="confirmPassword !== password && confirmPassword.length >= 1">
                                    • Password tidak cocok
                                </p>
                            </div>
                        </div>

                        <div class="text-center text-lg-start mt-0 pt-2">
                            <button class="btn btn-primary rounded-pill w-100"
                                :disabled="confirmPassword !== password || email === '' || username === '' || password === ''"
                                @click.prevent="store.register(username, email, password)">
                                Daftar
                            </button>
                            <p class="small fw-bold mt-2 pt-1 mb-0 text-center">
                                Sudah punya akun?
                                <a>
                                    <RouterLink to="/login" class="text-decoration-none text-danger">
                                        Masuk
                                    </RouterLink>
                                </a>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

</template>
