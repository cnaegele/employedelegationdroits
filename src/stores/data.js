import { ref } from 'vue'
import { defineStore } from 'pinia'

export const data = defineStore('iddata', () => {
  const idEmployeUser = ref(0)
  const nomEmployeUser = ref('')
  const prenomEmployeUser = ref('')
  const loginEmployeUser = ref('')
  const groupeSecurite = ref('')
  const bInGroupe = ref(0)
  const idEmployeProp = ref(0)
  const uoEmployeProp = ref([])
  const idEmployeDeleg = ref(0)
  const uoEmployeDeleg = ref([])
  const modeChoixEmploye = ref('prop') //'deleg'
  const critereEmployes = ref('')
  const critereEmployesInactifs = ref(false)
  const employesListe = ref([])
  const idEmployeChoix = ref(0)
  const messageErreur = ref('')

  return {
    idEmployeUser,
    nomEmployeUser,
    prenomEmployeUser,
    loginEmployeUser,
    groupeSecurite,
    bInGroupe,
    idEmployeProp,
    uoEmployeProp,
    idEmployeDeleg,
    uoEmployeDeleg,
    modeChoixEmploye,
    critereEmployes,
    critereEmployesInactifs,
    employesListe,
    idEmployeChoix,
    messageErreur
  }
})
