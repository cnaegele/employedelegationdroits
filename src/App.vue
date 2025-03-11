<template>
  <v-app>
    <v-main>
      <div style="position: absolute; right: 16px;">
        <Suspense><AppToper/></Suspense>
      </div>
      <div v-if="lesDatas.bInGroupe ===  1">
        go gléglé go
      </div>
      <div v-else>
        Page réservée aux manager goéland
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import AppToper from '@/components/AppToper.vue';
import { data } from '@/stores/data.js'
const lesDatas = data()
//console.log(lesDatas)
</script>
