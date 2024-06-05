<script setup>
import { RouterLink } from 'vue-router'


</script>

<template>
    <div class="container vh-100">
        <div class="row align-items-center d-flex justify-content-center h-100">
            <center>
                <h1 class="display-1 fw-bold text-danger">404 </h1>
                <h2 class="fw-bold text-danger">Page Not Found</h2>
                <h3>Oops, something went wrong here</h3>
                <p>This is a 404 error page which means you did not find what you were looking for. </p>
                <RouterLink to="/" class="btn btn-success rounded-pill w-25">
                    Home
                </RouterLink>
            </center>
        </div>
    </div>
</template>