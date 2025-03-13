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

export async function getEmployesListe(jsonCriteres) {
    const g_pathurlemploye = '/goeland/employe/axios/'
    const urlel = `${g_devurl}${g_pathurlemploye}employe_liste.php`
    const params = new URLSearchParams([['jsoncriteres', jsonCriteres]])
    //return jsonCriteres
    const response = await axios.get(urlel, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}

export async function getUnitesOrgListe(jsonCriteres = '{}') {
    const g_pathurluniteorg = '/goeland/uniteorg/axios/'
    const urluol = `${g_devurl}${g_pathurluniteorg}uniteorg_liste.php`
    const params = new URLSearchParams([['jsoncriteres', jsonCriteres]])
    //return jsonCriteres
    const response = await axios.get(urluol, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })    
    return response.data
}

export async function getDeleguesListe4Employe(jsonCriteres) {
    const g_pathurlemploye = '/goeland/gestion_spec/employe_delegationdroits/axios/'
    const urlel = `${g_devurl}${g_pathurlemploye}employe_deleguesliste.php`
    const params = new URLSearchParams([['jsoncriteres', jsonCriteres]])
    //return jsonCriteres
    const response = await axios.get(urlel, { params })
        .catch(function (error) {
            return traiteAxiosError(error)
        })
    return response.data
}

export async function sauveDelegue4Employe(jsonData) {
    const g_pathurlemploye = '/goeland/gestion_spec/employe_delegationdroits/axios/'
    const urlsd = `${g_devurl}${g_pathurlemploye}employe_delegue_sauve.php`
    const response = await axios.post(urlsd, jsonData, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .catch(function (error) {
        return traiteAxiosError(error)
    })      
    return response.data
}

