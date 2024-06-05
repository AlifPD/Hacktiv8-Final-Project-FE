<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue';
import { useStore } from '@/stores/counter';

const showPassword = ref(false)
const password = ref('')
const email = ref('')

const store = useStore()
store.isLoggedIn()
const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
}
</script>
<template>
    <div class="container align-items-center vh-100">
        <div class="row align-items-center h-100">
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
                        <!-- Email input -->
                        <div class="form-outline mb-4">
                            <label class="form-label fw-bold" for="form3Example3">Email</label>
                            <input type="email" id="form3Example3" class="form-control rounded-pill"
                                placeholder="Masukkan email" required="true" v-model="email" />
                        </div>

                        <!-- Password input -->
                        <div class="form-outline mb-3">
                            <label class="form-label fw-bold" for="form3Example4">Password</label>
                            <div class="input-group">
                                <!-- jika password disembunyikan -->
                                <input type="password" id="form3Example4" v-model="password"
                                    class="form-control rounded-start-pill" placeholder="Masukkan password"
                                    required="true" v-show="!showPassword" />
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
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <!-- Checkbox -->
                            <div class="form-check mb-0">
                                <input class="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                                <label class="form-check-label" for="form2Example3">
                                    Ingat saya
                                </label>
                            </div>
                            <a class="text-decoration-none" data-bs-toggle="popover" data-bs-placement="left"
                                data-bs-content="Fitur belum tersedia. Silakan hubungi administrator">Lupa password?
                            </a>
                        </div>

                        <div class="text-center text-lg-start mt-4 pt-2">
                            <button class="btn btn-primary rounded-pill w-100" type="submit"
                                @click.prevent="store.login(email, password)"
                                :disabled="email === '' || password === ''">
                                Masuk
                            </button>
                            <p class="small fw-bold mt-2 pt-1 mb-0 text-center">
                                Belum punya akun?
                                <a>
                                    <RouterLink to="/register" class="text-decoration-none text-danger">
                                        Daftar
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
