<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark py-0">
      <div class="container-fluid">
        <nuxt-link to="/login/" class="navbar-brand">Ez Pwd</nuxt-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <nuxt-link to="/login/" class="nav-link active">Login</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link to="/create-account/" class="nav-link active">Create account</nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container-fluid pt-3">
      <slot />
    </div>
  </div>
</template>
