<template>
  <v-app>
    <v-main>
      <div style="position: absolute; right: 16px;">
        <Suspense><AppToper/></Suspense>
      </div>
      <div v-if="lesDatas.bInGroupe ===  1">
        Mode de gestion :
        <v-radio-group v-model="modeGestion">
          <v-radio label="Choix propriétaire (employe ou unité), gestion des employés délégués" value="proprietaireGSTdelegue"></v-radio>
          <v-radio label="Choix de l'employé délégué, gestion des propriétaires (employé ou unité)" value="delegueGSTproprietaire"></v-radio>
        </v-radio-group>
        <div v-if="modeGestion == 'proprietaireGSTdelegue'">
          Propriétaire :
          <v-btn rounded="xl" class="text-none" @click="choixEmployeProprietaire()">Choix employé</v-btn>
          &nbsp;&nbsp;
          <v-btn rounded="xl" class="text-none" @click="choixUniteProprietaire()">Choix unité</v-btn>
          <br>
          {{ titreListeDelegue }}
          <br>
          <span v-if="idEmployeProprietaire > 0">
            <v-btn size="small" rounded="xl" class="text-none" @click="choixEmployeDelegue()">+</v-btn>
          </span>
          <span v-if="idUniteOrgProprietaire > 0">
            <v-btn size="small" rounded="xl" class="text-none" @click="choixEmployeDelegue()">+</v-btn>
          </span>
          <v-list>
            <v-list-item v-for="item in itemsListeDelegue" :key="item.idemploye">
              <template v-slot:prepend>
                <v-icon @click.stop="demandeSupprimeDelegue(item.idemploye)" color="error" class="mr-2">mdi-delete</v-icon>
              </template>
              <span :class="item.bactif === 0 ? 'inactif' : ''">
                {{ item.nomemploye }} {{ item.prenomemploye }} <span class="uniteorg">({{ item.uniteorg }})</span>
              </span>
            </v-list-item>
          </v-list>
        </div>
        <div v-else>
          Delégué :
          <v-btn rounded="xl" class="text-none" @click="choixEmployeDelegue()">Choix employé</v-btn>
          <br>
          {{ titreListeProprietaire }}
          <br>
          <span v-if="idEmployeDelegue > 0">
            <v-btn size="small" rounded="xl" class="text-none" @click="choixEmployeProprietaire()">+ employe</v-btn>
            &nbsp;&nbsp;
            <v-btn size="small" rounded="xl" class="text-none" @click="choixUniteProprietaire()">+ unité</v-btn>
          </span>
          <v-list>
            <v-list-item v-for="item in itemsListeProprietaireE" :key="item.idemploye">
              <template v-slot:prepend>
                <v-icon @click.stop="demandeSupprimeProprietaireE(item.idemploye)" color="error" class="mr-2">mdi-delete</v-icon>
              </template>
              <span :class="item.bactif === 0 ? 'inactif' : ''">
                {{ item.nomemploye }} {{ item.prenomemploye }} <span class="uniteorg">({{ item.uniteorg }})</span>
              </span>
            </v-list-item>
          </v-list>
          <v-list>
            <v-list-item v-for="item in itemsListeProprietaireU" :key="item.iduniteorg">
              <template v-slot:prepend>
                <v-icon @click.stop="demandeSupprimeProprietaireU(item.iduniteorg)" color="error" class="mr-2">mdi-delete</v-icon>
              </template>
              <span :class="item.bactif === 0 ? 'inactif' : ''">
                {{ item.nomuniteorg }}
              </span>
            </v-list-item>
          </v-list>
        </div>
      </div>
      <div v-else>
        Page réservée aux manager goéland
      </div>
    </v-main>
  </v-app>

  <v-dialog max-width="1280">
    <template v-slot:activator="{ props: activatorProps }">
      <div style="display: none;">
        <v-btn
          id="btnActiveCardChoixEmploye"
          v-bind="activatorProps"
        ></v-btn>
      </div>
    </template>

    <template v-slot:default="isActive">
      <v-card>
        <v-card-actions>
          <span class="cardTitre"><h3>Choix d'un employé {{ libelleEmployeModeChoix }}</h3> (cliquez sur le nom pour sélectionner)</span>
          <v-spacer></v-spacer>
          <v-btn
            text="Fermer"
            variant="tonal"
            @click="closeCardEmployeChoix"
          ></v-btn>
        </v-card-actions>
        <v-card-text>
            <div>
                <Suspense>
                    <EmployeChoix 
                        uniteHorsVdL="non" 
                        :modeChoix="'unique'"
                        @choixEmploye="receptionEmploye"
                    />
                </Suspense>
            </div>
       </v-card-text>
      </v-card>
    </template>
  </v-dialog>

  <v-dialog max-width="1280">
    <template v-slot:activator="{ props: activatorProps }">
      <div style="display: none;">
        <v-btn
          id="btnActiveCardChoixUniteOrg"
          v-bind="activatorProps"
        ></v-btn>
      </div>
    </template>

    <template v-slot:default="isActive">
      <v-card>
        <v-card-actions>
            <span class="cardTitre"><h3>Choix d'une unité organisationnelle</h3> (cliquez sur le nom pour sélectionner)</span>
            <v-spacer></v-spacer>
          <v-btn
            text="Fermer"
            variant="tonal"
            @click="closeCardUniteOrgChoix"
          ></v-btn>
        </v-card-actions>
        <v-card-text>
            <div>
                <Suspense>
                    <UniteOrgChoix 
                        uniteHorsVdL="non" 
                        :modeChoix="'unique'"
                        @choixUniteOrg="receptionUnitesOrg"
                    />
                </Suspense>
            </div>
       </v-card-text>
      </v-card>
    </template>
  </v-dialog>

</template>

<style scoped>
  .uniteorg { 
    font-size: small;
  }
  .inactif {
    font-style: italic;
  }
</style>

<script setup>
import { ref, watch } from 'vue'
import AppToper from '@/components/AppToper.vue';
import { data } from '@/stores/data.js'
import EmployeChoix from '@/components/EmployeChoix.vue'
import { getDeleguesListe4Employe, getProprietaireListe4Employe, getDeleguesListe4UniteOrg, sauveDelegue4Employe, sauveDelegue4Unite } from '@/axioscalls.js'

const lesDatas = data()
const modeGestion = ref('proprietaireGSTdelegue') //delegueGSTproprietaire
const titreListeDelegue = ref('...')
const itemsListeDelegue = ref([])
const titreListeProprietaire = ref('...')
const itemsListeProprietaireE = ref([])
const itemsListeProprietaireU = ref([])
const idEmployeProprietaire = ref(0)
const idEmployeDelegue = ref(0)
const employeModeChoix = ref('proprietaire') //delegue
const libelleEmployeModeChoix = ref('')
const idUniteOrgProprietaire = ref(0)
const libelleUniteOrgModeChoix = ref('')

watch(() => modeGestion.value, () => {
  titreListeDelegue.value = '...'
  itemsListeDelegue.value = []
  titreListeProprietaire.value = '...'
  itemsListeProprietaireE.value = []
  itemsListeProprietaireU.value = []
  idEmployeProprietaire.value = 0
  idEmployeDelegue.value = 0
  libelleEmployeModeChoix.value = ''
  idUniteOrgProprietaire.value = 0
  libelleUniteOrgModeChoix.value = ''
})

const choixEmployeProprietaire = () => {
  employeModeChoix. value = 'proprietaire'
  libelleEmployeModeChoix. value = 'propriétaire'
  idEmployeProprietaire.value = 0
  idUniteOrgProprietaire.value = 0
  document.getElementById("btnActiveCardChoixEmploye").click() 
}
const choixEmployeDelegue = () => {
  employeModeChoix. value = 'delegue'
  libelleEmployeModeChoix. value = 'délégué'
  idEmployeDelegue.value = 0
  document.getElementById("btnActiveCardChoixEmploye").click() 
}

const receptionEmploye = (idemploye, jsonData) => {
  //console.log(jsonData)  console.log(`${modeGestion.value} ${employeModeChoix.value}`)
  const oEmploye = JSON.parse(jsonData)
  if (modeGestion.value == 'proprietaireGSTdelegue') {
      if (employeModeChoix.value == 'proprietaire') {
        idEmployeProprietaire.value = idemploye
        titreListeDelegue.value = `Liste des employés pouvant éditer les documents, agendés, suivis de ${oEmploye.prenom} ${oEmploye.nom}. ${oEmploye.unite}`
        listeDelegue4Employe(idemploye)
      } else if (employeModeChoix.value == 'delegue') {
        if (idEmployeProprietaire.value > 0) {
          idEmployeDelegue.value = idemploye
          console.log(`sauve: idempprop:${idEmployeProprietaire.value} idempdeleg:${idEmployeDelegue.value}`)
          demandeSauveDelegue4Employe(idEmployeProprietaire.value, idEmployeDelegue.value)
        } else if (idUniteOrgProprietaire.value > 0) {
            idEmployeDelegue.value = idemploye
            console.log(`sauve: iduoprop:${idUniteOrgProprietaire.value} idempdeleg:${idEmployeDelegue.value}`)
            demandeSauveDelegue4Unite(idUniteOrgProprietaire.value, idEmployeDelegue.value)
        }
      }
  } else if (modeGestion.value == 'delegueGSTproprietaire') {
    if (employeModeChoix.value == 'delegue') {
        idEmployeDelegue.value = idemploye
        titreListeProprietaire.value = `Liste des employés et unités dont les les documents, agendés, suivis peuvent être éditer ${oEmploye.prenom} ${oEmploye.nom}. ${oEmploye.unite}`
        listeProprietaire4Employe(idemploye)
      } else if (employeModeChoix.value == 'proprietaire') {
        idEmployeProprietaire.value = idemploye
        console.log(`sauve: idempprop:${idEmployeProprietaire.value} idempdeleg:${idEmployeDelegue.value}`)
        demandeSauveDelegue4Employe(idEmployeProprietaire.value, idEmployeDelegue.value)
      }
  }
  closeCardEmployeChoix()
}
const closeCardEmployeChoix = () => {
  document.getElementById("btnActiveCardChoixEmploye").click()    
}

const choixUniteProprietaire = () => {
  idUniteOrgProprietaire.value = 0
  idEmployeProprietaire.value = 0
  document.getElementById("btnActiveCardChoixUniteOrg").click() 
}
const receptionUnitesOrg = (jsonData) => {
  console.log(`Réception unité organisationnelle \njson: ${jsonData}`)
  const oUniteOrg = JSON.parse(jsonData)
      idUniteOrgProprietaire.value = oUniteOrg.id
  if (modeGestion.value == 'proprietaireGSTdelegue') {
      titreListeDelegue.value = `Liste des employés pouvant éditer les documents, agendés, suivis des employés de l'unité organisationnelle ${oUniteOrg.description}`
      listeDelegue4UniteOrg(oUniteOrg.id)
  } else if (modeGestion.value == 'delegueGSTproprietaire') {
      idUniteOrgProprietaire.value = oUniteOrg.id
      console.log(`sauve: iduoprop:${idUniteOrgProprietaire.value} idempdeleg:${idEmployeDelegue.value}`)
      demandeSauveDelegue4Unite(idUniteOrgProprietaire.value, idEmployeDelegue.value)
  }
  closeCardUniteOrgChoix()
}
const closeCardUniteOrgChoix = () => {
  document.getElementById("btnActiveCardChoixUniteOrg").click()    
}

const listeDelegue4Employe = async (idEmployeProprietaire) => {
    const oCritere = {
        "idemploye" : idEmployeProprietaire,
    }    
    const deleguesListe = await getDeleguesListe4Employe(JSON.stringify(oCritere))
    //console.log(deleguesListe)
    if (deleguesListe.hasOwnProperty('message')) {
        messageErreur.value += deleguesListe.message + '<br>'
        deleguesListe = []
    }
    itemsListeDelegue.value = deleguesListe
}

const listeProprietaire4Employe = async (idEmployeDelegue) => {
    const oCritere = {
        "idemploye" : idEmployeDelegue,
    }    
    const proprietaireListe = await getProprietaireListe4Employe(JSON.stringify(oCritere))
    //console.log(proprietaireListe)
    if (proprietaireListe.hasOwnProperty('message')) {
        messageErreur.value += proprietaireListe.message + '<br>'
        proprietaireListe = []
    }

    itemsListeProprietaireE.value = []
    itemsListeProprietaireU.value = []
    let typeprop, ordre, idgo, nom, prenom, bactif, uniteorg
    let item
    for (let i=0; i<proprietaireListe.length; i++) {
      typeprop = proprietaireListe[i].typeprop
      if (typeprop === 'employe') {
        idgo = proprietaireListe[i].idgo 
        nom = proprietaireListe[i].nom 
        prenom = proprietaireListe[i].prenom 
        bactif = proprietaireListe[i].bactif 
        uniteorg = proprietaireListe[i].uniteorg 
        item = {
          idemploye : idgo,
          nomemploye : nom,
          prenomemploye : prenom,
          bactif : bactif,
          uniteorg : uniteorg,
        }
        itemsListeProprietaireE.value.push(item)
      }
      else if (typeprop === 'uniteorg') {
        ordre = proprietaireListe[i].ordre
        if (ordre === 1) {
          idgo = proprietaireListe[i].idgo 
          nom = proprietaireListe[i].nom 
          bactif = proprietaireListe[i].bactif 
          item = {
            iduniteorg : idgo,
            nomuniteorg : nom,
            bactif : bactif,
          }
          itemsListeProprietaireU.value.push(item)
        }
      }
    }
    //console.log(itemsListeProprietaireE.value)
}

const listeDelegue4UniteOrg = async (idUniteOrgProprietaire) => {
    const oCritere = {
        "iduniteorg" : idUniteOrgProprietaire,
    }    
    const deleguesListe = await getDeleguesListe4UniteOrg(JSON.stringify(oCritere))
    //console.log(deleguesListe)
    if (deleguesListe.hasOwnProperty('message')) {
        messageErreur.value += deleguesListe.message + '<br>'
        deleguesListe = []
    }
    itemsListeDelegue.value = deleguesListe
}

const demandeSauveDelegue4Employe = async (idEmployeProprietaire, idEmployeDelegue) => {
    const oData = {
      "action" : "sauve",
      "idemployeproprietaire" : idEmployeProprietaire,
      "idemployedelegue" : idEmployeDelegue,
    }    
    //console.log (JSON.stringify(oData))
    const ret = await sauveDelegue4Employe(JSON.stringify(oData))
    console.log(ret.message)
    if (modeGestion.value == 'proprietaireGSTdelegue') {
      listeDelegue4Employe(idEmployeProprietaire)
    } else if (modeGestion.value == 'delegueGSTproprietaire') {
      listeProprietaire4Employe(idEmployeDelegue)
    }
}

const demandeSauveDelegue4Unite = async (idUniteOrgProprietaire, idEmployeDelegue) => {
    const oData = {
      "action" : "sauve",
      "iduniteproprietaire" : idUniteOrgProprietaire,
      "idemployedelegue" : idEmployeDelegue,
    }    
    //console.log (JSON.stringify(oData))
    const ret = await sauveDelegue4Unite(JSON.stringify(oData))
    console.log(ret.message)
    if (modeGestion.value == 'proprietaireGSTdelegue') {
      listeDelegue4UniteOrg(idUniteOrgProprietaire)
    } else if (modeGestion.value == 'delegueGSTproprietaire') {
      listeProprietaire4Employe(idEmployeDelegue)
    }
}

const demandeSupprimeDelegue = async (idEmployeDelegue) => {
  if (idEmployeProprietaire.value > 0) {
    console.log(`Supprimer délégué d'un employe avec id: ${idEmployeDelegue}`);
    const oData = {
        "action" : "supprime",
        "idemployeproprietaire" : idEmployeProprietaire.value,
        "idemployedelegue" : idEmployeDelegue,
      }    
    //console.log (JSON.stringify(oData))
    const ret = await sauveDelegue4Employe(JSON.stringify(oData))
    console.log(ret.message)
    listeDelegue4Employe(idEmployeProprietaire.value)
  } else if (idUniteOrgProprietaire.value > 0) {
    console.log(`Supprimer délégué d'une unite avec id: ${idEmployeDelegue}`);
    const oData = {
        "action" : "supprime",
        "iduniteproprietaire" : idUniteOrgProprietaire.value,
        "idemployedelegue" : idEmployeDelegue,
      }    
    //console.log (JSON.stringify(oData))
    const ret = await sauveDelegue4Unite(JSON.stringify(oData))
    console.log(ret.message)
    listeDelegue4UniteOrg(idUniteOrgProprietaire.value)
  }
}

const demandeSupprimeProprietaireE = async (idEmployeProprietaire) => {
  console.log(`Supprimer propriétaire employe avec id: ${idEmployeProprietaire}`);

  const oData = {
      "action" : "supprime",
      "idemployeproprietaire" : idEmployeProprietaire,
      "idemployedelegue" : idEmployeDelegue.value,
    }    
    console.log (JSON.stringify(oData))
    const ret = await sauveDelegue4Employe(JSON.stringify(oData))
    console.log(ret)
    listeProprietaire4Employe(idEmployeDelegue.value)
}

const demandeSupprimeProprietaireU = async (idUniteProprietaire) => {
  console.log(`Supprimer propriétaire unite avec id: ${idUniteProprietaire}`);

  const oData = {
      "action" : "supprime",
      "iduniteproprietaire" : idUniteProprietaire,
      "idemployedelegue" : idEmployeDelegue.value,
    }    
    console.log (JSON.stringify(oData))
    const ret = await sauveDelegue4Unite(JSON.stringify(oData))
    console.log(ret)
    listeProprietaire4Employe(idEmployeDelegue.value)
}

</script>
