<script setup>
import { useStore } from '@/stores/counter';
import { RouterLink } from 'vue-router';

const store = useStore()
store.getUser()
</script>

<template>

  <nav class="navbar navbar-expand-lg bg-body-tertiary shadow fixed-top">
    <div class="container">
      <RouterLink to="/" class="text-decoration-none text-dark">
        <a class="navbar-brand text-primary">
          <i class="bi bi-hospital" style="font-size: 2rem;"></i>
          <span> MedInventory</span>
        </a>
      </RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item align-items-center">
            <a class="nav-link" href="#">
              <i class="bi bi-cart-check" style="font-size: 2rem"></i>
            </a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle align-items-center" href="#" role="button" data-bs-toggle="dropdown"
              aria-expanded="false">
              <i class="bi bi-person-circle" style="font-size: 2rem"></i>
              {{ store.dataUserbyId.username }}
            </a>
            <ul class="dropdown-menu justify-content-between">
              <li>
                <a class="dropdown-item align-items-center">
                  <RouterLink to="/account" class="text-decoration-none text-dark">
                    <i class="bi bi-person-gear"></i>
                    <span>
                      Akun
                    </span>
                  </RouterLink>
                </a>
              </li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li>
                <a class="dropdown-item" @click.prevent="store.logout()">
                  <i class="bi bi-box-arrow-right"></i>
                  <span>
                    Keluar Akun
                  </span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>

</template>