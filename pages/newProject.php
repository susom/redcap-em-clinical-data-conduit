<?php
namespace Stanford\Duster;
/** @var $module Duster */
?>
<?php print loadJS('vue/vue-factory/dist/js/app.js') ?>
<script src="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js" crossorigin="anonymous"></script>
<!-- <script src="<?php echo $module->getUrl("pages/js/vue/new-project/dist/new_project_vue.umd.js") ?>"></script> -->
<script src="<?php echo $module->getUrl("pages/js/vue/new-project-2/frontend/dist/new_project_2.umd.js") ?>"></script>

<div id="new-project"></div>
<script>
    window.location = "<?php echo $module->getUrl("pages/js/vue/new-project/dist/index.html") ?>";
    /*
    window.addEventListener('DOMContentLoaded', function (event) {
        const componentPromise = window.renderVueComponent(new_project_2, '#new-project')
        componentPromise.then(component => {
            console.log('component is ready')
        })
    })
     */
</script>
