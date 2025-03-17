import { ref } from 'vue'
import { defineStore } from 'pinia'

export const data = defineStore('iddata', () => {
  const idEmployeUser = ref(0)
  const nomEmployeUser = ref('')
  const prenomEmployeUser = ref('')
  const loginEmployeUser = ref('')
  const groupeSecurite = ref('')
  const bInGroupe = ref(0)

  return {
    idEmployeUser,
    nomEmployeUser,
    prenomEmployeUser,
    loginEmployeUser,
    groupeSecurite,
    bInGroupe,
  }
})
