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
          <v-btn rounded="xl" class="text-none" @click="choixEmployeDélégué()">Choix employé</v-btn>
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
            @click="closeCardUniteOrgDCChoix"
          ></v-btn>
        </v-card-actions>
        <v-card-text>
            <div>
                <Suspense>
                    <UniteOrgChoix 
                        uniteHorsVdL="non" 
                        :modeChoix="'unique'"
                        @choixUniteOrg="receptionUnitesOrgProprietaire"
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
import { ref } from 'vue'
import AppToper from '@/components/AppToper.vue';
import { data } from '@/stores/data.js'
import EmployeChoix from '@/components/EmployeChoix.vue'
import { getDeleguesListe4Employe, sauveDelegue4Employe } from '@/axioscalls.js'

const lesDatas = data()
const modeGestion = ref('proprietaireGSTdelegue') //delegueGSTproprietaire
const titreListeDelegue = ref('...')
const itemsListeDelegue = ref([])
const idEmployeProprietaire = ref(0)
const idEmployeDelegue = ref(0)
const employeModeChoix = ref('proprietaire') //delegue
const libelleEmployeModeChoix = ref('')
//console.log(lesDatas)

const choixEmployeProprietaire = () => {
  employeModeChoix. value = 'proprietaire'
  libelleEmployeModeChoix. value = 'propriétaire'
  idEmployeProprietaire.value = 0
  document.getElementById("btnActiveCardChoixEmploye").click() 
}
const choixEmployeDelegue = () => {
  employeModeChoix. value = 'delegue'
  libelleEmployeModeChoix. value = 'délégué'
  idEmployeDelegue.value = 0
  document.getElementById("btnActiveCardChoixEmploye").click() 
}

const receptionEmploye = (idemploye, jsonData) => {
  //console.log(jsonData)
    const oEmployeProp = JSON.parse(jsonData)
    if (modeGestion.value == 'proprietaireGSTdelegue') {
        if (employeModeChoix.value == 'proprietaire') {
          idEmployeProprietaire.value = idemploye
          titreListeDelegue.value = `Liste des employés pouvant éditer les documents, agendés, suivis de ${oEmployeProp.prenom} ${oEmployeProp.nom}. ${oEmployeProp.unite}`
          listeDelegue4Employe(idemploye)
        } else if (employeModeChoix.value == 'delegue') {
          idEmployeDelegue.value = idemploye
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
    document.getElementById("btnActiveCardChoixUniteOrg").click() 
}
const receptionUnitesOrgProprietaire = (jsonData) => {
    console.log(`Réception unité organisationnelle \njson: ${jsonData}`)
    /*
    const retUnitesOrgDC = JSON.parse(jsonData)
    let aUnitesOrgDC = []
    if (Array.isArray(retUnitesOrgDC)) {
        aUnitesOrgDC = retUnitesOrgDC    
    } else {
        aUnitesOrgDC.push(retUnitesOrgDC)   
    }
    for (let i=0; i<aUnitesOrgDC.length; i++) {
        let bTrouve = false
        for (let j=0; j<lesDatas.document.unitesOrgDroitConsultation.length; j++) {
            if (aUnitesOrgDC[i].id == lesDatas.document.unitesOrgDroitConsultation[j].id) {
                bTrouve= true
                break
            }
        }
        if (!bTrouve) {
            const oUniteOrgDCPlus = {
                "id": aUnitesOrgDC[i].id,
                "nom": aUnitesOrgDC[i].description,
            }
            lesDatas.document.unitesOrgDroitConsultation.push(oUniteOrgDCPlus)
        }
    }
    */
    closeCardUniteOrgChoix()
    panelDroitsConsultation.value = [0]
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

const demandeSauveDelegue4Employe = async (idEmployeProprietaire, idEmployeDelegue) => {
    const oData = {
      "action" : "sauve",
      "idemployeproprietaire" : idEmployeProprietaire,
      "idemployedelegue" : idEmployeDelegue,
    }    
    console.log (JSON.stringify(oData))
    const ret = await sauveDelegue4Employe(JSON.stringify(oData))
    console.log(ret)
    listeDelegue4Employe(idEmployeProprietaire)
}

const demandeSupprimeDelegue = async (idEmployeDelegue) => {
  console.log(`Supprimer délégué avec id: ${idEmployeDelegue}`);

  const oData = {
      "action" : "supprime",
      "idemployeproprietaire" : idEmployeProprietaire.value,
      "idemployedelegue" : idEmployeDelegue,
    }    
    console.log (JSON.stringify(oData))
    const ret = await sauveDelegue4Employe(JSON.stringify(oData))
    console.log(ret)
    listeDelegue4Employe(idEmployeProprietaire.value)
}
</script>
