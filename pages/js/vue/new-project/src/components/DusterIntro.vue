<template>
    <v-container pa-0>
        <!-- checking IRB -->
        <h2 v-if="irb_flag === 0" class="primary--text mt-3">Checking IRB...</h2>

        <!-- IRB is valid -->
        <v-card
            flat
            v-else-if="irb_flag === 1"
        >
            <v-card-title>
                <h2 class="primary--text">Introduction</h2>
            </v-card-title>
            <v-row>
                <v-col
                    cols="7"
                >
                    <v-card-text>
                        <p>
                            Welcome to Stanford REDCap's DUSTER, a self-service tool to automatically import STARR data associated with your research cohort.
                            <br>
                            <br>
                            DUSTER can retrieve both patient data and structured clinical data based on STARR. A small set of demographics, lab results, and vitals are currently available with more on the way;
                            we also plan to expand our structured clinical data offerings to include inpatient outcomes, risk scores, and medications.
                            <br>
                            <br>
                            You can use DUSTER to design and create a dataset as a newly-created REDCap project.
                            We plan to support adding DUSTER to existing REDCap projects in the future.
                            <br>
                            <br>
                            After your REDCap project is created, DUSTER will be able to retrieve and save data into your REDCap project upon request.
                        </p>
                    </v-card-text>
                </v-col>
                <v-col
                    cols="3"
                >
                    <v-img
                        :src="getImageUrl('duster_infographic.png')"
                    >
                    </v-img>
                </v-col>
                <v-col
                    cols="2"
                >
                    <v-img
                        :src="getImageUrl('duster_logo_cropped.png')"
                    >
                    </v-img>
                </v-col>
            </v-row>

            <v-card-title>
                <h2 class="primary--text">How Does It Work?</h2>
            </v-card-title>
            <v-card-text>
                <p>
                    DUSTER requires each REDCap record to contain "researcher-provided information" to retrieve data.
                    <br>
                    At minimum, MRNs are required as a researcher-provided identifier and study enrollment dates are required as a researcher-provided date.
                    <br>
                    <br>
                    Currently, only the MRN can be assigned as a researcher-provided identifier.
                    <br>
                    Optionally, more researcher-provided date/datetimes may be added. This is useful for cohorts that have multiple study visits/events or sample collections.
                    <br>
                    <br>
                    To add researcher-provided information, you can choose to create each record one at a time using standard REDCap data entry (left), or you can import your
                    records using REDCap's data import tool (right).
                </p>
            </v-card-text>

            <v-row>
                <v-col
                    cols="6"
                >
                    <v-img
                        :src="getImageUrl('option_1_data_entry.png')"
                    >
                    </v-img>

                </v-col>
                <v-col
                    cols="6"
                >
                    <v-img
                        :src="getImageUrl('option2_data_import.png')"
                    >
                    </v-img>
                </v-col>
            </v-row>


            <v-row>
                <v-col
                    cols="auto"
                >
                    <v-btn
                        color="secondary"
                        :href="redcapProjectConfig.redcap_new_project_url"
                    >
                        &lt; Back to REDCap New Project Page
                    </v-btn>
                </v-col>
                <v-col
                    cols="auto"
                >
                    <v-btn
                        color="primary"
                        @click="goToNewProjectDesigner()"
                    >
                        Let's Get Started >
                    </v-btn>
                </v-col>
                <v-spacer></v-spacer>
            </v-row>
        </v-card>
        

        <!-- IRB is invalid -->
        <v-card
            flat
            v-else-if="irb_flag === -1"
        >
            <v-card-title>
                <h2 class="error--text">Invalid IRB Entered</h2>
            </v-card-title>
            <v-card-text>
                    <p>
                        Creating a new project in DUSTER requires a valid IRB.
                        <br>
                        <br>
                        Press the button below to go back to REDCap's New Project Page.
                    </p>
            </v-card-text>
            <v-row>
                <v-col>
                    <v-btn
                        color="secondary"
                        :href="redcapProjectConfig.redcap_new_project_url"
                    >
                        &lt; Back to REDCap's New Project Page
                    </v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-container>   
</template>

<script>
import axios from 'axios'

export default {
  name: "DataCollectionWindowsStep",
  data: function() {
    return {        
        redcapProjectConfig: {},
        irb_flag: 0 // 0 if checking IRB, -1 if IRB invalid, 1 if IRB valid
    }
  },
  mounted() {
    
    this.redcapProjectConfig = JSON.parse(localStorage.getItem("postObj")) ; 
    
    var _self = this ;
    
    let formData = new FormData();
    formData.append('redcap_csrf_token', this.redcapProjectConfig.redcap_csrf_token);
    formData.append("project_irb_number", this.redcapProjectConfig.project_irb_number);

    axios.post(this.redcapProjectConfig.check_irb_url, formData)
    .then(function(response) {
        _self.irb_flag = response.data === 1 ? 1 : -1;
    })
    .catch(function(error) {
        this.irb_flag = -1 ;
        console.log(error) ;        
    });       
  },
  methods: {
    getImageUrl(imgName) {
        return this.redcapProjectConfig.img_base_path + imgName ;
    },
    goToNewProjectDesigner() {
        this.$emit('success')
    }
  }
}

</script>
