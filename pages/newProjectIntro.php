<?php
namespace Stanford\Duster;
/** @var $module Duster */

// TODO require_once APP_PATH_DOCROOT . 'Views/HomeTabs.php';
?>

<!doctype html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/ico" href="data:image/ico;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wDa2vAkgYHMtWxsxJPw8PkM////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wCiotpaCgqd8z8/sv8AAJn/ICCl3szM6jH///8A////AP///wD///8A////AP///wD///8A////AP///wCGhs53AACZ/wAAmf8/P7L/AACZ/wAAmf8KCp31vLzkQf///wD///8A////AP///wD///8A////AP///wCiotpaISGm/S8vrP8vL6z/Pz+y/wAAmf8AAJn/Cwud/xsbo/DU1O4p////AP///wD///8A////AP///wDe3vIfDAyd83xwy/+kjtz/wrPn/z8/sv8AAJn/AACZ/1pavf9ISLb/MDCsz/r6/QP///8A////AP///wD///8AWFi8pk5MuP+biNj/jG/S/5uD2P8/P7L/AACZ/wAAmf9FRbT/mprW/wwMnf+YmNZl////AP///wD///8A4ODyHQQEmvxmZML/tKLi/7yr5f93dcj/Pz+y/wAAmf8QEJ//nZ3Y/3Z2yP8AAJn/Jiao2f///wD///8A////AIqK0HIAAJn/VFK7/2tTxf+Xidb/Jiao/z8/sv8AAJn/Jiao/6ys3v8wMKz/AACZ/wAAmf/Kyuoy////AP///wBiYr+1ICCl/yAgpf8gIKX/ICCl/yAgpf9XV7z/AACZ/wAAmf9KSrb/k5PU/ywsqv8AAJn/iIjPdf///wD///8AQkKz4jMzrf9SUrr/d3fJ/0lJtv8vL6z/Y2PA/wAAmf8AAJn/PDyx/2NjwP9nZ8L/AACZ/1xcvaH///8A////AAUFmv1kZMH/ysrp/9XV7v+2tuH/NDSu/z8/sv8AAJn/AACZ/29vxf+np9v/BASa/wAAmf9CQrO9////AP///wAGBpv/m5vX/4eHz//u7vj/Tk64/5eX1f8/P7L/AACZ/ywsqv+qqt3/QECy/wAAmf8AAJn/QECyv////wD///8AAgKZ/QAAmf9ra8T/3d3x/ykpqf8CApn/Pz+y/wcHm/+JidD/MDCs/1dXvP8AAJn/AACZ/0BAsr3///8A////ABgYouUAAJn/Wlq9/9/f8v8XF6L/AACZ/z8/sv8UFKH/kZHT/6el3P9iYsD/AACZ/wAAmf9YWLym////AP///wBCQrO9AACZ/yMjp/+vr9//BASa/wAAmf8/P7L/AACZ/wAAmf8ICJz/AACZ/wAAmf8AAJn/goLNff///wD///8Ajo7ScCAgpd4gIKXeS0u33iAgpd4gIKXeV1e73iAgpd4gIKXeICCl3iAgpd4gIKXeICCl3sbG6Dj///8A/n8AAPw/AAD4HwAA8A8AAOAHAADABwAAwAMAAMADAACAAwAAgAEAAIABAACAAQAAgAEAAIABAACAAwAAwAMAAA=="/>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    <style>
        .margin10 { margin-bottom: 10cm;}
        .margin2 { margin-bottom: 2cm;}
        .tb {border: 1px solid lightgrey;}
        .auto-width {width: auto;}
        h5 {color: rgba(49, 108, 244, 0.99);}
        th, td {
            padding-left: 15px;
            padding-right: 15px;
        }
        .screenshot, table.tb > tbody > tr > td {
            border: 1px solid lightgrey;
            padding: 15px;}
        thead > tr > td {font-weight: bold;}
    </style>
    <title>DUSTER</title>
</head>
<body>


<div class="container">
    <div class="row justify-content-start">
        <div class="col-12"><h1>DUSTER</h1><h4>Data Upload Service for Translational rEsearch on Redcap</h4></div>
    </div>
    <div id="intro" >
        <div class="row justify-content-start">
            <div class="col-10">
                <h5>Introduction</h5>
            </div>
        </div>
        <div class="row">
            <div class="col-7">
                <p>
                    Welcome to Stanford REDCap's DUSTER, a self-service tool to automatically import clinical data associated with research subjects in your study.
                </p>
                <p>
                    DUSTER has both patient data and structured clinical data, which includes risk scores, lab results and medications as well as inpatient stay metrics such as
                    blood products, LDA, IO and ventilation.
                </p>
                <p>
                    You can use DUSTER either to augment an existing REDCap or to populate a newly created REDCap project.
                </p>
                <p>
                    Once you have specified the clinical variables of interest, DUSTER will automatically import all data
                    relating to your patients once a day.
                </p>
            </div>
            <div class="col-3"><img class="screenshot" src="<?php echo $module->getUrl("images/duster_infographic.png") ?>" height="200"  /></div>
            <div class="col-2"><img class="screenshot" src="<?php echo $module->getUrl("images/duster_logo_cropped.png") ?>" height="200"  /></div>
        </div>
        <div class="row justify-content-start">
            <div class="col-10">
                <h5>How Does it Work?</h5>
            </div>
        </div>
        <div class="row">
            <div class="col-10">
            <!--
                <p>
                    DUSTER expects you to create records containing an MRN and date of enrollment. These two fields in REDCap are
                    then used to retrieve associated patient and clinical data for the patient in the specified time frame(s).
                </p>
            -->
                <p>
                    DUSTER requires each REDCap record to contain an MRN and a clinical date (e.g., an enrollment date or visit date).
                    These two fields are needed to identify the requested data.
                    By default, an enrollment date is designated as the clinical date.
                    This can be changed at the final step of DUSTER's project creation wizard.
                </p>
                <p>
                    You can choose to create each record one at a time using standard REDCap data entry (left), or you can import your
                    records using REDCap's data import tool (right).
                </p>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <img class="screenshot" src="<?php echo $module->getUrl("images/option_1_data_entry.png") ?>" height="200" />
                <img class="screenshot" src="<?php echo $module->getUrl("images/option2_data_import.png") ?>" height="100" />
            </div>
        </div>
        <div class="row">
            <div class="col-10">
                <p></p>
                <form action="<?php echo $module->getUrl("pages/newProject.php", false, true) ?>" method="post">
                    <input type="hidden" name="type" value="module">
                    <input type="hidden" name="app_title" value=<?php echo $_POST["app_title"] ?>>
                    <input type="hidden" name="purpose" value=<?php echo $_POST["purpose"] ?>>
                    <input type="hidden" name="project_note" value=<?php echo $_POST["project_note"] ?>>
                    <input type="submit" class="btn btn-primary" value="Let's Get Started >">
                </form>
            </div>
        </div>
    </div>
</div>
</body>
</html>
