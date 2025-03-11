<style scoped>
.custom-item {
  font-size: 15px;
}
</style>

<template>
    <v-app-bar
        color="primary"
        prominent
        density="compact"
        app
    >
        <v-toolbar-title>Délégation des droits documents / agendés / suivis</v-toolbar-title>
        <v-spacer></v-spacer>
        <div style="position: absolute; right: 16px;">
            <Suspense><UserInformation groupeSecurite="GoelandManager"></UserInformation></Suspense>
        </div>
    </v-app-bar>
</template>

<script setup>
 
import UserInformation from '@/components/UserInformation.vue';
import { data } from '@/stores/data.js'
const lesDatas = data()    

</script>