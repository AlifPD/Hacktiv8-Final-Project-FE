<script setup>
import { RouterLink } from 'vue-router'

</script>

<template>

    <nav id="sidebarMenu" class="collapse d-block sidebar collapse mt-sm-0 mt-2 h-screen">
        <div class="list-group list-group-flush">
            <RouterLink to="/" class="text-decoration-none">
                <a class="list-group-item list-group-item-action py-2 nav-link">
                    <i class="i-sidebar bi bi-house"></i>
                    <span class="span-sidebar">
                        Home
                    </span>
                </a>
            </RouterLink>
            <RouterLink to="/peminjaman" class="text-decoration-none">
                <a class="list-group-item list-group-item-action py-2 nav-link">
                    <i class="i-sidebar bi bi-wallet"></i>
                    <span class="span-sidebar">
                        Peminjaman
                    </span>
                </a>
            </RouterLink>
            <RouterLink to="/histori" class="text-decoration-none">
                <a class="list-group-item list-group-item-action py-2 nav-link">
                    <i class="i-sidebar bi bi-clock-history"></i>
                    <span class="span-sidebar">
                        Histori
                    </span>
                </a>
            </RouterLink>
        </div>
    </nav>
</template>

<style>
.i-sidebar,
.span-sidebar {
    color: white;
    /* color: white; */
}

.i-sidebar:hover {
    color: chartreuse;
}

.span-sidebar:hover {
    color: chartreuse;
}

.list-group-item {
    background-color: transparent;
    border: 0;

}

.list-group-item:hover {
    background-color: rgb(94, 93, 93);
    border-radius: .375rem;
}

.bi {
    font-size: 1.5rem;
}
</style>
