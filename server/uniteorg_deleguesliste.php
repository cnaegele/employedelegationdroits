<?php
require_once 'gdt/cldbgoeland.php';
header("Access-Control-Allow-Origin: *");
$bParamsOk = true;
if (isset($_GET['jsoncriteres'])) {
    $jsonCriteres = $_GET['jsoncriteres'];
    $oCriteres = json_decode($jsonCriteres, false);
    $idUniteOrg = '0';
    if (isset($oCriteres->iduniteorg)) {
        $idUniteOrg = $oCriteres->iduniteorg;
    }
} else {
    $bParamsOk = false;
}
if ($bParamsOk) {
    $sSql = "cn_docorguniteditor_liste_delegues $idUniteOrg";
    //echo '{"message": "' . str_replace('"', '\"', $sSql) . '"}';
    $dbgo = new DBGoeland();
    $bret = $dbgo->queryRetJson2($sSql);
    if ($bret === true) {
        echo $dbgo->resString;
        unset($dbgo);
    } else {
        echo '{"message" : "employe_deleguesliste:' . $dbgo->resErreur . '"}';
        unset($dbgo);
    }
} else {
    echo '{"message" : "employe_deleguesliste:param&egraves invalides"}';;
}
