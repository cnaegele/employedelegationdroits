<template>
<v-row no-gutters class="d-flex align-center">
    <v-col cols="auto">
    Utilisateur : {{ lesDatas.prenomEmployeUser }} {{ lesDatas.nomEmployeUser }} / {{ lesDatas.loginEmployeUser }}
    </v-col>
</v-row>
</template>
<script setup>
    import { ref } from 'vue'
    import { getDataUserInfo } from  '@/axioscalls.js'
    import { data } from '@/stores/data.js'
    const lesDatas = data()    
    const props = defineProps({
        groupeSecurite: {
            type: String,
            required: false
        }
    })
    getDataUserInfo(props.groupeSecurite, lesDatas)
</script>
