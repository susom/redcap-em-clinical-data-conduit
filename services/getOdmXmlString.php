<?php
namespace Stanford\Duster;
/** @var $module Duster */

use ODM;
use RCView;

// $_POST WILL CONTAIN ALL THE POSTED FORM DATA AS USUAL
$module->emDebug($_POST);
$metadata = $module->getMetadata();
// $module->emLog($metadata);

/*
// $_POST["demographics"] WILL BE AN ARRAY
foreach ($_POST["demographics"] as $demographic) {
    echo "$demographic<br>";
    $module->emDebug($demographic);
}

// $_POST["outcomes"] WILL BE AN ARRAY
foreach ($_POST["outcomes"] as $outcome) {
    echo "$outcome<br>";
    $module->emDebug($outcome);
}
*/

/*
if(isset($_POST['app_title'])) {
$_POST['app_title'] = $_POST['app_title'];
} else {
// TODO error
}
if(isset($_POST['purpose'])) {
$_POST['purpose = $_POST['purpose'];
} else {
// TODO error
}
if(isset($_POST['purpose_other'])) {
$_POST['purpose_other = $_POST['purpose_other'];
} else {
// TODO error
}
if(isset($_POST['project_note'])) {
project_note = $_POST['project_note'];
} else {
// TODO error
}
*/

$odm_str = $global_variables = $metadata_version = $form_def = $item_group_def = $item_defs = $code_list = "";

$rc_var_suffix = "_dstr";

// opening XML and ODM tags
$odm_str .= ODM::getOdmOpeningTag($_POST['app_title']);

// opening study OID
$odm_str .= "<Study OID=\"Project." . ODM::getStudyOID($_POST['app_title']) . "\">\n";

// global variables
$global_variables .= "<GlobalVariables>\n"
        . "\t<StudyName>" . RCView::escape($_POST['app_title']) . "</StudyName>\n"
        . "\t<StudyDescription>This file contains the metadata, events, and data for REDCap project " . RCView::escape($_POST['app_title']) . ".</StudyDescription>\n"
        . "\t<ProtocolName>" . RCView::escape($_POST['app_title']) . "</ProtocolName>\n"
        . "\t<redcap:RecordAutonumberingEnabled>1</redcap:RecordAutonumberingEnabled>\n"
        . "\t<redcap:CustomRecordLabel></redcap:CustomRecordLabel>\n"
        . "\t<redcap:SecondaryUniqueField></redcap:SecondaryUniqueField>\n"
        . "\t<redcap:SchedulingEnabled>0</redcap:SchedulingEnabled>\n"
        . "\t<redcap:SurveysEnabled>0</redcap:SurveysEnabled>\n"
        . "\t<redcap:SurveyInvitationEmailField></redcap:SurveyInvitationEmailField>\n"
        . "\t<redcap:Purpose>" . $_POST['purpose'] . "</redcap:Purpose>\n"
        . "\t<redcap:PurposeOther>" . implode(",",$_POST['purpose_other']) . "</redcap:PurposeOther>\n"
        . "\t<redcap:ProjectNotes>" . $_POST['project_note'] ."</redcap:ProjectNotes>\n"
        . "\t<redcap:MissingDataCodes></redcap:MissingDataCodes>\n"
        . "\t<redcap:ProtectedEmailMode>0</redcap:ProtectedEmailMode>\n"
        . "\t<redcap:ProtectedEmailModeCustomText></redcap:ProtectedEmailModeCustomText>\n"
        . "\t<redcap:ProtectedEmailModeTrigger>ALL</redcap:ProtectedEmailModeTrigger>\n"
        . "\t<redcap:ProtectedEmailModeLogo></redcap:ProtectedEmailModeLogo>\n";

// opening medata version
$metadata_version .= "<MetaDataVersion OID=\"" . ODM::getMetadataVersionOID($_POST['app_title']) . "\" Name=\"" . RCView::escape($_POST['app_title']) . "\" redcap:RecordIdField=\"record_id\">\n";


$form_def .= "\t<FormDef OID=\"Form.study_enrollment\" Name=\"Study Enrollment\" Repeating=\"No\" redcap:FormName=\"study_enrollment\">\n"
. "\t\t<ItemGroupRef ItemGroupOID = \"study_enrollment.record_id\" Mandatory=\"No\"/>\n"
. "\t\t<ItemGroupRef ItemGroupOID = \"study_enrollment.study_enrollment_complete\" Mandatory=\"No\"/>\n"
. "\t</FormDef>\n";

$item_group_def .= "\t<ItemGroupDef OID=\"study_enrollment.record_id\" Name=\"Study Enrollment Info\" Repeating=\"No\">\n"
. "\t\t<ItemRef ItemOID=\"record_id\" Mandatory=\"No\" redcap:Variable=\"record_id\"/>\n"
. "\t\t<ItemRef ItemOID=\"mrn\" Mandatory=\"No\" redcap:Variable=\"mrn\"/>\n"
. "\t\t<ItemRef ItemOID=\"date_enrollment\" Mandatory=\"No\" redcap:Variable=\"date_enrollment\"/>\n"
. "\t</ItemGroupDef>\n"
. "\t<ItemGroupDef OID=\"study_enrollment.study_enrollment_complete\" Name=\"Form Status\" Repeating=\"No\">\n"
. "\t\t<ItemRef ItemOID=\"study_enrollment_complete\" Mandatory=\"No\" redcap:Variable=\"study_enrollment_complete\"/>\n"
. "\t</ItemGroupDef>\n";

$item_defs .= "\t<ItemDef OID=\"record_id\" Name=\"record_id\" DataType=\"text\" Length=\"999\" redcap:Variable=\"record_id\" redcap:FieldType=\"text\">\n"
. "\t\t<Question><TranslatedText>Record ID</TranslatedText></Question>\n"
. "\t</ItemDef>\n"
. "\t<ItemDef OID=\"mrn\" Name=\"mrn\" DataType=\"float\" Length=\"999\" SignificantDigits=\"1\" redcap:Variable=\"mrn\" redcap:FieldType=\"text\" redcap:TextValidationType=\"float\">\n"
. "\t\t<Question><TranslatedText>Medical Record Number (MRN)</TranslatedText></Question>\n"
. "\t</ItemDef>\n"
. "\t<ItemDef OID=\"date_enrollment\" Name=\"date_enrollment\" DataType=\"date\" Length=\"999\" redcap:Variable=\"date_enrollment\" redcap:FieldType=\"text\" redcap:TextValidationType=\"date_ymd\">\n"
. "\t\t<Question><TranslatedText>Date of Enrollment</TranslatedText></Question>\n"
. "\t</ItemDef>\n"
. "\t<ItemDef OID=\"study_enrollment_complete\" Name=\"study_enrollment_complete\" DataType=\"text\" Length=\"1\" redcap:Variable=\"study_enrollment_complete\" redcap:FieldType=\"select\" redcap:SectionHeader=\"Form Status\">\n"
. "\t\t<Question><TranslatedText>Complete?</TranslatedText></Question>\n"
. "\t\t<CodeListRef CodeListOID=\"study_enrollment_complete.choices\"/>\n"
. "\t</ItemDef>\n";

$code_list .= "\t<CodeList OID=\"study_enrollment_complete.choices\" Name=\"study_enrollment_complete\" DataType=\"text\" redcap:Variable=\"study_enrollment_complete\">\n"
. "\t\t<CodeListItem CodedValue=\"0\"><Decode><TranslatedText>Incomplete</TranslatedText></Decode></CodeListItem>\n"
. "\t\t<CodeListItem CodedValue=\"1\"><Decode><TranslatedText>Unverified</TranslatedText></Decode></CodeListItem>\n"
. "\t\t<CodeListItem CodedValue=\"2\"><Decode><TranslatedText>Complete</TranslatedText></Decode></CodeListItem>\n"
. "\t</CodeList>\n";

if(isset($_POST['demographics'])) {
    $demographics_items = [];
    foreach($_POST['demographics'] as $field) {
        $demographics_items[] = array(
            "item"       => $field,
            "label"      => $metadata["demographics"][$field]["label"],
            "redcap_var" => $field . $rc_var_suffix
        );
        $module->emDebug($metadata["demographics"]);
        $module->emDebug($metadata["demographics"][$field]);

    }

    $form_def .= "\t<FormDef OID=\"Form.demographics\" Name=\"Demographics\" Repeating=\"No\" redcap:FormName=\"demographics\">\n"
    . "\t\t<ItemGroupRef ItemGroupOID = \"demographics." . $demographics_items[0]['item'] . "\" Mandatory = \"No\" />\n"
    . "\t\t<ItemGroupRef ItemGroupOID = \"demographics.demographics_complete\" Mandatory = \"No\" />\n"
    . "\t</FormDef>\n";

    $item_group_def .= "\t<ItemGroupDef OID=\"demographics." . $demographics_items[0]["item"] . "\" Name=\"Demographics\" Repeating=\"No\">\n";
    foreach($demographics_items as $item) {
        $item_group_def .= "\t<ItemRef ItemOID=\"" . $item["item"] . "\" Mandatory=\"No\" redcap:Variable=\"" . $item["redcap_var"] . "\"/>\n";

        $item_defs .= "\t<ItemDef OID=\"" . $item["item"] . "\" Name=\"" . $item["item"] . "\" DataType=\"text\" Length=\"999\" redcap:Variable=\"" . $item["redcap_var"] . "\" redcap:FieldType=\"text\">\n"
        . "\t\t<Question><TranslatedText>" . $item["label"] . "</TranslatedText></Question>\n"
        .  "\t</ItemDef>\n";
    }

    $item_group_def .= "\t</ItemGroupDef>\n"
    . "\t<ItemGroupDef OID=\"demographics.demographics_complete\" Name=\"Form Status\" Repeating=\"No\">\n"
    . "\t\t<ItemRef ItemOID=\"demographics_complete\" Mandatory=\"No\" redcap:Variable=\"demographics_complete\"/>\n"
    . "\t</ItemGroupDef>\n";

    $item_defs .= "\t<ItemDef OID=\"demographics_complete\" Name=\"demographics_complete\" DataType=\"text\" Length=\"1\" redcap:Variable=\"demographics_complete\" redcap:FieldType=\"select\" redcap:SectionHeader=\"Form Status\">\n"
    . "\t\t<Question><TranslatedText>Complete?</TranslatedText></Question>\n"
    . "\t\t<CodeListRef CodeListOID=\"demographics_complete.choices\"/>\n"
    . "\t</ItemDef>\n";

    $code_list .= "\t<CodeList OID=\"demographics_complete.choices\" Name=\"demographics_complete\" DataType=\"text\" redcap:Variable=\"demographics_complete\">\n"
    . "\t\t<CodeListItem CodedValue=\"0\"><Decode><TranslatedText>Incomplete</TranslatedText></Decode></CodeListItem>\n"
    . "\t\t<CodeListItem CodedValue=\"1\"><Decode><TranslatedText>Unverified</TranslatedText></Decode></CodeListItem>\n"
    . "\t\t<CodeListItem CodedValue=\"2\"><Decode><TranslatedText>Complete</TranslatedText></Decode></CodeListItem>\n"
    . "\t</CodeList>\n";
}

if(isset($_POST['outcomes'])) {
    $outcomes_items = [];
    foreach($_POST['outcomes'] as $field) {
        $outcomes_items[] = array(
            "item"       => $field,
            "label"      => $metadata["outcomes"][$field]["label"],
            "redcap_var" => $field . $rc_var_suffix
        );
        $module->emDebug($metadata["outcomes"]);
        $module->emDebug($metadata["outcomes"][$field]);
    }

    $form_def .= "\t<FormDef OID=\"Form.outcomes\" Name=\"Outcomes\" Repeating=\"No\" redcap:FormName=\"outcomes\">\n"
        . "\t\t<ItemGroupRef ItemGroupOID = \"outcomes." . $outcomes_items[0]['item'] . "\" Mandatory = \"No\" />\n"
        . "\t\t<ItemGroupRef ItemGroupOID = \"outcomes.outcomes_complete\" Mandatory = \"No\" />\n"
        . "\t</FormDef>\n";

    $item_group_def .= "\t<ItemGroupDef OID=\"outcomes." . $outcomes_items[0]["item"] . "\" Name=\"Outcomes\" Repeating=\"No\">\n";
    foreach($outcomes_items as $item) {
        $item_group_def .= "\t<ItemRef ItemOID=\"" . $item["item"] . "\" Mandatory=\"No\" redcap:Variable=\"" . $item["redcap_var"] . "\"/>\n";

        $item_defs .= "\t<ItemDef OID=\"" . $item["item"] . "\" Name=\"" . $item["item"] . "\" DataType=\"text\" Length=\"999\" redcap:Variable=\"" . $item["redcap_var"] . "\" redcap:FieldType=\"text\">\n"
            . "\t\t<Question><TranslatedText>" . $item["label"] . "</TranslatedText></Question>\n"
            .  "\t</ItemDef>\n";
    }

    $item_group_def .= "\t</ItemGroupDef>\n"
        . "\t<ItemGroupDef OID=\"outcomes.outcomes_complete\" Name=\"Form Status\" Repeating=\"No\">\n"
        . "\t\t<ItemRef ItemOID=\"outcomes_complete\" Mandatory=\"No\" redcap:Variable=\"outcomes_complete\"/>\n"
        . "\t</ItemGroupDef>\n";

    $item_defs .= "\t<ItemDef OID=\"outcomes_complete\" Name=\"outcomes_complete\" DataType=\"text\" Length=\"1\" redcap:Variable=\"outcomes_complete\" redcap:FieldType=\"select\" redcap:SectionHeader=\"Form Status\">\n"
        . "\t\t<Question><TranslatedText>Complete?</TranslatedText></Question>\n"
        . "\t\t<CodeListRef CodeListOID=\"outcomes_complete.choices\"/>\n"
        . "\t</ItemDef>\n";

    $code_list .= "\t<CodeList OID=\"outcomes_complete.choices\" Name=\"outcomes_complete\" DataType=\"text\" redcap:Variable=\"outcomes_complete\">\n"
        . "\t\t<CodeListItem CodedValue=\"0\"><Decode><TranslatedText>Incomplete</TranslatedText></Decode></CodeListItem>\n"
        . "\t\t<CodeListItem CodedValue=\"1\"><Decode><TranslatedText>Unverified</TranslatedText></Decode></CodeListItem>\n"
        . "\t\t<CodeListItem CodedValue=\"2\"><Decode><TranslatedText>Complete</TranslatedText></Decode></CodeListItem>\n"
        . "\t</CodeList>\n";
}

$global_variables .= "</GlobalVariables>\n";

$odm_str .= $global_variables . $metadata_version . $form_def . $item_group_def . $item_defs . $code_list;

// closing metadata version
$odm_str .= "</MetaDataVersion>\n";

// closing study OID
$odm_str .= "</Study>\n";

// closing XML and ODM tags
$odm_str .= ODM::getOdmClosingTag();

echo $odm_str;
?>
