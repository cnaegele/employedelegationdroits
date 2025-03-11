import { ref } from 'vue'
import axios from 'axios'
let g_devurl = ''
if (import.meta.env.DEV) {
    g_devurl = 'https://mygolux.lausanne.ch'    
}

export async function getDataUserInfo(groupeSecurite, lesDatas) {
    const urlui = `${g_devurl}/goeland/gestion_spec/g_login_f5.php`
    const params = new URLSearchParams([['groupesecurite', groupeSecurite]])
    const response = await axios.get(urlui, { params })
    const userInfo = response.data
    //console.log(userInfo)
    lesDatas.idEmployeUser = ref(userInfo.id_employe)
    lesDatas.nomEmployeUser = ref(userInfo.nom_employe)
    lesDatas.prenomEmployeUser = ref(userInfo.prenom_employe)
    lesDatas.loginEmployeUser = ref(userInfo.login_employe)
    lesDatas.groupeSecurite = ref(userInfo.groupesecurite)
    lesDatas.bInGroupe = ref(userInfo.bingroupe)
}
