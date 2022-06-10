<?php
namespace Stanford\Duster;
/** @var $module Duster */

use ODM;
use RCView;

/**
 * Class OdmXmlString
 *
 */
class OdmXmlString {
    private $odm;
    private $header;
    private $ddp;
    private $form_def;
    private $item_group_def;
    private $item_defs;
    private $code_list;
    private $closing_tags;

    // TODO must be constructed with minimum viability with optional parameters
    // TODO purpose_other - what happens if only a single value was chosen at the beginning of creating a new project?
    //                      one possibility - still require the parameter to be an array, just with a single element
    public function __construct(string $project_title, string $purpose, string $purpose_other = "", string $project_note = "") {
        $this->odm = array(
            "header" => ODM::getOdmOpeningTag($project_title),
            "study"  => "<Study OID=\"Project." . ODM::getStudyOID($project_title) . "\">\n",
            "global_variables" => array( // TODO what are the necessary fields for this?
                "global_var_header" => "<GlobalVariables>\n"
                    . "\t<StudyName>" . RCView::escape($project_title) . "</StudyName>\n"
                    . "\t<StudyDescription>This file contains the metadata, events, and data for REDCap project " . RCView::escape($project_title) . ".</StudyDescription>\n"
                    . "\t<ProtocolName>" . RCView::escape($project_title) . "</ProtocolName>\n"
                    . "\t<redcap:RecordAutonumberingEnabled>1</redcap:RecordAutonumberingEnabled>\n"
                    . "\t<redcap:CustomRecordLabel></redcap:CustomRecordLabel>\n"
                    . "\t<redcap:SecondaryUniqueField></redcap:SecondaryUniqueField>\n"
                    . "\t<redcap:SchedulingEnabled>0</redcap:SchedulingEnabled>\n"
                    . "\t<redcap:SurveysEnabled>0</redcap:SurveysEnabled>\n"
                    . "\t<redcap:SurveyInvitationEmailField></redcap:SurveyInvitationEmailField>\n"
                    . "\t<redcap:Purpose>{$purpose}</redcap:Purpose>\n"
                    . "\t<redcap:PurposeOther>{$purpose_other}</redcap:PurposeOther>\n"
                    . "\t<redcap:ProjectNotes>{$project_note}</redcap:ProjectNotes>\n",
                "ddp_header" => "\t<redcap:DdpMappingGroup>\n"
                              . "\t\t<redcap:DdpMapping is_record_identifier=\"1\" temporal_field=\"\" preselect=\"\" external_source_field_name=\"mrn\" event_id=\"event_1_arm_1\" field_name=\"mrn\"/>\n", // TODO move this line, should not be required to construct
                "ddp_body" => "",
                "ddp_closer" => "\t</redcap:DdpMappingGroup>\n"
                              . "\t<redcap:DdpPreviewFieldsGroup>\n"
                              . "\t\t<redcap:DdpPreviewFields field1=\"\" field2=\"\" field3=\"\" field4=\"\" field5=\"\"/>\n"
                              .	"\t</redcap:DdpPreviewFieldsGroup>\n",
                "global_var_closer" => "</GlobalVariables>\n"
            ),
            "metadata_version" => "<MetaDataVersion OID=\"" . ODM::getMetadataVersionOID($project_title) . "\" Name=\"" . RCView::escape($project_title) . "\" redcap:RecordIdField=\"record_id\">\n",
            "form_def" => array(),
            "item_group_def" => array(),
            "item_defs" => array(),
            "code_list" => array(),
            "closer"    => "</MetaDataVersion>\n"
                         . "</Study>\n"
                         . ODM::getOdmClosingTag()
        );
    }

    // TODO should always return a valid odm xml string or generate an error (or empty string?)
    // concatenate the pieces into a completed string
    public function getOdmXmlString() {
        $odm_str = "";
        foreach($this->odm as $piece) {
            $odm_str .= is_array($piece) ? implode("", $piece) : $piece;
        }
    }



}
?>
