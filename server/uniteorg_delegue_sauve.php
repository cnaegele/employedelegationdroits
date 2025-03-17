<?php
require 'gdt/gautentificationf5.php';
require_once '/data/dataweb/GoelandWeb/webservice/employe/clCNWSEmployeSecurite.php';
require_once 'gdt/cldbgoeland.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers:  *");
header("Access-Control-Allow-Methods:  POST");
$idCaller = 0;
if (array_key_exists('empid', $_SESSION)) {
   $idCaller = $_SESSION['empid'];
}
if ($idCaller > 0) {
    $pseudoWSEmployeSecurite = new CNWSEmployeSecurite();
    if ($pseudoWSEmployeSecurite->isInGroupe($idCaller, 'GoelandManager')) {
        $jsonData = file_get_contents('php://input');
        $oData = json_decode($jsonData);
        $action = $oData->action;
        $idUniteOrgProprietaire = $oData->iduniteproprietaire;
        $idEmployeDelegue = $oData->idemployedelegue;
        $dbgo = new DBGoeland();
        $sSql = "cn_docorguniteditor_sauve '$action', $idUniteOrgProprietaire, $idEmployeDelegue, $idCaller";
        $dbgo->queryRetNothing($sSql, 'W');
        unset($dbgo);
        echo '{"message":"ok"}';
    } else {
        echo '{"message":"ERREUR GoelandManager requis"}';
    }
} else {
    echo '{"message":"ERREUR athentification F5"}';
}
