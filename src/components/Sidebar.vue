<script setup>
import { RouterLink } from 'vue-router'

</script>

<template>

    <nav id="sidebarMenu" class="collapse d-block sidebar collapse mt-sm-0 mt-5">
        <div class="list-group list-group-flush border rounded shadow-lg">
            <a class="list-group-item list-group-item-action py-2 nav-link">
                <RouterLink to="/" class="text-decoration-none text-dark">
                    <i class="i-sidebar bi bi-house"></i>
                    <span class="span-sidebar">
                        Home
                    </span>
                </RouterLink>
            </a>
            <a class="list-group-item list-group-item-action py-2 nav-link">
                <RouterLink to="/peminjaman" class="text-decoration-none text-dark">
                    <i class="i-sidebar bi bi-wallet"></i>
                    <span class="span-sidebar">
                        Peminjaman
                    </span>
                </RouterLink>
            </a>
            <a class="list-group-item list-group-item-action py-2 nav-link">
                <RouterLink to="/histori" class="text-decoration-none text-dark">
                    <i class="i-sidebar bi bi-clock-history"></i>
                    <span class="span-sidebar">
                        Histori
                    </span>
                </RouterLink>
            </a>
        </div>
    </nav>
</template>

<style>
.i-sidebar,
.span-sidebar {
    color: white;
}

.list-group-item {
    background-color: #0d6efd;
}

.list-group-item:hover {
    background-color: rgb(94, 93, 93);
}

.bi {
    font-size: 1.5rem;
}
</style>
