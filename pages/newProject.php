<?php
    namespace Stanford\Duster;
?>

<!DOCTYPE html>
<html>
<head>
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet" crossorigin="anonymous">
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css" rel="stylesheet" crossorigin="anonymous">
    <link href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css" rel="stylesheet" crossorigin="anonymous">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
</head>
<body>

<!-- Our application root element -->
<div id="app">
    <v-app>
        <v-container>
            <h1>DUSTER: Data Upload Service for Translational rEsearch on Redcap</h1>

            <v-stepper
                v-model="step"
                outlined
            >
                <v-stepper-header>
                    <v-stepper-step
                        :complete="step > 1"
                        step="1"
                    >
                        Researcher-Provided Info
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step
                        :complete="step > 2"
                        step="2"
                    >
                        Demographics
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step
                        :complete="step > 3"
                        step="3"
                    >
                        Clinical Data
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step step="4">
                        Review
                    </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items>
                    <v-stepper-content step="1">
                        <v-card-text>
                            <p>
                                There are identifiers and dates in your study cohort that you will provide for your REDCap project.
                                <br>
                                <br>
                                The minimum required information for each record is an MRN and a study enrollment date, which DUSTER will use to query STARR.
                                <br>
                                Optionally, you may also add other date/datetimes of interest.
                                <br>
                                <br>
                                After DUSTER creates the project, you will be able to perform a bulk upload of the Researcher-Provided Info you define here.
                            </p>
                        </v-card-text>


                        <v-divider></v-divider>

                        <v-list-item-subtitle><h1>Identifier</h1></v-list-item-subtitle>
                        <v-list>
                            <h3>MRN</h3>
                            <p>
                                REDCap field name: <em>mrn</em><br>
                                Format: 8-digit number (including leading zeros)
                            </p>
                        </v-list>

                        <v-divider></v-divider>

                        <v-list-item-subtitle><h1>Dates</h1></v-list-item-subtitle>
                        <v-list
                            v-for="date in rp_dates"
                            :key="date.label"
                        >
                            <h3>{{date.label}}</h3>
                            <p>
                                REDCap field name: <em>{{date.redcap_field}}</em><br>
                                Format: {{date.format}}
                            </p>
                            <!-- TODO add edit/remove buttons with v-if to make sure first index is not included -->
                        </v-list>

                        <v-dialog
                            v-model="new_date.dialog"
                            persistent
                            max-width="600px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    color="primary"
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                    Add New Date/Datetime
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="text-h5">New Date/Datetime</span>
                                </v-card-title>
                                    <v-card-text>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-text-field
                                                v-model="new_date.label"
                                                label="Label"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field
                                                v-model="new_date.redcap_field"
                                                label="REDCap field name"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-radio-group
                                                v-model="new_date.format"
                                                label="Format"
                                                row
                                            >
                                                <v-radio
                                                    label="Date"
                                                    value="date"
                                                ></v-radio>
                                                <v-radio
                                                    label="Datetime"
                                                    value="datetime"
                                                ></v-radio>
                                            </v-radio-group>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-spacer></v-spacer>
                                <v-card-actions>
                                    <v-btn
                                        color="primary"
                                        type="submit"
                                        @click="saveDateForm"
                                    >
                                        Submit
                                    </v-btn>
                                    <v-btn
                                        color="secondary"
                                        type="reset"
                                        @click="resetDateForm"
                                    >
                                        Cancel
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                            <v-card-text
                                flat
                            >
                                <p>
                                    Select demographics below that you'd like to collect on your cohort.
                                    <br>
                                    <br>
                                    <em>Please bear in mind HIPAA Minimum Necessary when selecting identifying information.</em>
                                </p>
                            </v-card-text>

                        <v-container>
                            <v-checkbox
                                v-model="demographics.selected"
                                v-for="field in demographics.options"
                                :label="field.label"
                                :value="field.redcap_field"
                                dense
                            >
                            </v-checkbox>
                            <v-btn
                                color="primary"
                                @click="toggleAllDemo"
                            >
                                Select/Unselect All
                            </v-btn>
                        </v-container>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <v-card-text
                            flat
                        >
                            <p>
                                Clinical data is partly defined by relative windows of time.
                                <br>
                                <br>
                                DUSTER uses Data Collection Events to apply this concept of creating windows of time in which you'd like to gather clinical data.
                                <br>
                                Each Data Collection Event will appear in the form of REDCap Instruments in your project.
                                <br>
                                Within each event, you may add your desired clinical data.
                                <br>
                                <br>
                                You may create Data Collection Events below with the options to choose among preset configurations or to configure from scratch.
                            </p>
                        </v-card-text>

                        <!-- Create First Data Collection Event -->
                        <v-card
                            outlined
                            v-show="!collection_events.length"
                        >
                            <v-card-title>
                                Create Your First Data Collection Event
                            </v-card-title>

                            <v-stepper
                                v-model="event_1_stepper"
                                vertical
                            >
                                <v-stepper-step
                                    :complete="event_1_stepper > 1"
                                    step="1"
                                >
                                    Define Event
                                </v-stepper-step>

                                <v-stepper-content step="1">
                                    <v-form
                                        ref="event_form"
                                    >
                                        <!-- Preset events -->
                                        <v-row>
                                            <v-col
                                                cols="6"
                                            >
                                                <v-select
                                                    v-model="preset_choice"
                                                    :items="preset_events"
                                                    @change="new_event=JSON.parse(JSON.stringify(preset_choice))"
                                                    label="Presets"
                                                >
                                                </v-select>
                                            </v-col>
                                        </v-row>
                                        <!-- REDCap Instrument Name -->
                                        <v-row>
                                            <v-col
                                                cols="6"
                                            >
                                                <v-text-field
                                                    v-model="new_event.instr_name"
                                                    label="REDCap Instrument Name"
                                                >
                                                </v-text-field>
                                            </v-col>
                                        </v-row>

                                        <!-- Is this data collection event repeatable (i.e., multiple instances)? -->
                                        <v-radio-group
                                            v-model="new_event.event_type"
                                            label="Is this data collection event repeatable (i.e., multiple instances)?"
                                            @change="resetEventType"
                                        >
                                            <v-radio
                                                label="No"
                                                value="nonrepeating"
                                            >
                                            </v-radio>
                                            <v-radio
                                                value="finite_repeating"
                                            >
                                                <template v-slot:label>
                                                    <v-row
                                                        align="center"
                                                        no-gutters
                                                    >
                                                        <v-col
                                                            class="pr-1"
                                                            cols="auto"
                                                        >
                                                            Yes, each record will have
                                                        </v-col>
                                                        <v-col
                                                            class="pr-1"
                                                            sm="1"
                                                            cols="1"
                                                        >
                                                            <v-text-field
                                                                v-model="new_event.num_instances"
                                                                dense
                                                                type="number"
                                                                min="2"
                                                            >
                                                            </v-text-field>
                                                        </v-col>
                                                        <v-col
                                                            cols="auto"
                                                        >
                                                            consecutive instances of this data collection event.
                                                        </v-col>
                                                    </v-row>
                                                </template>
                                            </v-radio>
                                            <v-radio
                                                value="calculated_repeating"
                                            >
                                                <template v-slot:label>
                                                    <div>Yes, each record will have a calculated number of consecutive instances based on specified conditions below.</div>
                                                </template>
                                            </v-radio>
                                        </v-radio-group>

                                        <!-- When should this event start? -->
                                        <v-radio-group
                                            v-model="new_event.start_type"
                                            label="When should this event start?"
                                            v-show="new_event.event_type === 'nonrepeating'"
                                        >
                                            <v-radio
                                                value="dttm"
                                            >
                                                <template v-slot:label>
                                                    <v-row
                                                        align="center"
                                                        no-gutters
                                                    >
                                                        <v-col
                                                            class="pr-1"
                                                            cols="auto"
                                                        >
                                                            At a specified Date/Datetime of Interest.
                                                        </v-col>
                                                        <v-col

                                                        >
                                                            <v-tooltip bottom>
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <v-icon
                                                                        color="primary"
                                                                        dark
                                                                        v-bind="attrs"
                                                                        v-on="on"
                                                                    >
                                                                        mdi-information-outline
                                                                    </v-icon>
                                                                </template>
                                                                <span>If the specified Date of Interest is not a Datetime, 00:00 will be used.</span>
                                                            </v-tooltip>
                                                        </v-col>
                                                    </v-row>
                                                </template>
                                            </v-radio>
                                            <v-radio
                                                label="At 00:00 on a specified Date/Datetime of Interest."
                                                value="date"
                                            >
                                            </v-radio>
                                        </v-radio-group>

                                        <!-- Start date/datetime input of data collection event -->
                                        <v-row>
                                            <v-col
                                                cols="4"
                                            >
                                                <v-select
                                                    v-model="new_event.start_dttm"
                                                    :items="event_dates"
                                                    label="Date/Datetime of Interest"
                                                    v-show="new_event.event_type"
                                                >
                                                </v-select>
                                            </v-col>
                                            <v-col
                                                cols="4"
                                                v-show="clinical_dates.includes(new_event.start_dttm)"
                                            >
                                                <v-select
                                                    v-model="new_event.start_based_dttm"
                                                    label="based on"
                                                    :items="rp_dates_arr"
                                                >
                                                </v-select>
                                            </v-col>
                                        </v-row>

                                        <!-- When should this event end? -->
                                        <!-- Show only for nonrepeating events -->
                                        <v-radio-group
                                            v-model="new_event.nonrepeat_type"
                                            label="When should this event end?"
                                            @change="resetNonRepeatEnd"
                                            v-show="new_event.event_type === 'nonrepeating' && new_event.start_dttm"
                                        >
                                            <v-radio
                                                value="hours"
                                            >
                                                <template v-slot:label>
                                                    <v-row
                                                        align="center"
                                                        no-gutters
                                                    >
                                                        <v-col
                                                            class="pr-1"
                                                            cols="auto"
                                                        >
                                                            This event ends
                                                        </v-col>
                                                        <v-col
                                                            class="pr-1"
                                                            sm="1"
                                                            cols="1"
                                                        >
                                                            <v-text-field
                                                                v-model="new_event.num_hours"
                                                                dense
                                                                type="number"
                                                                min="1"
                                                            >
                                                            </v-text-field>
                                                        </v-col>
                                                        <v-col
                                                            cols="auto"
                                                        >
                                                            hour(s) after the {{new_event.start_dttm}}.
                                                        </v-col>
                                                    </v-row>
                                                </template>
                                            </v-radio>
                                            <v-radio
                                                value="days"
                                            >
                                                <template v-slot:label>
                                                    This event ends on 23:59 on the same calendar date of the {{new_event.start_dttm}}.
                                                </template>
                                            </v-radio>
                                            <v-radio
                                                label="This event ends based on a specified date/datetime."
                                                value="end_dttm"
                                            >
                                            </v-radio>
                                        </v-radio-group>

                                        <!-- How should this data collection event be repeated? -->
                                        <!-- Show only for repeating events -->
                                        <v-radio-group
                                            v-model="new_event.repeat_type"
                                            label="How should this data collection event be repeated?"
                                            @change="resetRepeatType"
                                            v-show="['finite_repeating', 'calculated_repeating'].includes(new_event.event_type)"
                                        >
                                            <v-radio
                                                value="hours"
                                            >
                                                <template v-slot:label>
                                                    <v-row
                                                        align="center"
                                                        no-guters
                                                    >
                                                        <v-col
                                                            class="pr-1"
                                                            cols="auto"
                                                        >
                                                            Each instance ends
                                                        </v-col>
                                                        <v-col
                                                            class="pr-1"
                                                            cols="1"
                                                        >
                                                            <v-text-field
                                                                v-model="new_event.num_hours"
                                                                dense
                                                                type="number"
                                                                min="1"
                                                            >
                                                            </v-text-field>
                                                        </v-col>
                                                        <v-col
                                                            cols="auto"
                                                        >
                                                            hour(s) after its respective start datetime.
                                                        </v-col>
                                                    </v-row>
                                                </template>
                                            </v-radio>
                                            <v-radio
                                                value="days"
                                            >
                                                <template v-slot:label>
                                                    <div>Calendar day intervals (e.g., every day of an inpatient admission)</div>
                                                </template>
                                            </v-radio>
                                        </v-radio-group>

                                        <!-- End date/datetime input of data collection event -->
                                        <!-- Configure only for non-repeating or calculated repeating events -->
                                        <v-row>
                                            <v-col
                                                cols="4"
                                            >
                                                <v-select
                                                    v-model="new_event.end_dttm"
                                                    :items="event_dates"
                                                    label="End date/datetime"
                                                    v-show="
                                                (new_event.event_type === 'nonrepeating' && new_event.nonrepeat_type === 'end_dttm')
                                                || new_event.event_type === 'calculated_repeating'
                                               "
                                                >
                                                </v-select>
                                            </v-col>
                                            <v-col
                                                cols="4"
                                            >
                                                <v-select
                                                    v-model="new_event.end_based_dttm"
                                                    label="based on"
                                                    :items="rp_dates_arr"
                                                    v-show="clinical_dates.includes(new_event.end_dttm)"
                                                >
                                                </v-select>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                    <v-btn
                                        color="primary"
                                        @click="addDataStep"
                                    >
                                        Continue
                                    </v-btn>
                                    <v-btn
                                        color="error"
                                        type="reset"
                                        @click="resetEventForm"
                                    >
                                        Reset
                                    </v-btn>
                                </v-stepper-content>

                                <v-stepper-step
                                    step="2"
                                >
                                    Add Clinical Data
                                </v-stepper-step>
                                <v-stepper-content step="2">
                                    <!-- aggregate defaults -->
                                    <v-row>
                                        <v-col>
                                            <v-card outlined>
                                                <v-card-title>Set default aggregates</v-card-title>
                                                <v-card-text>
                                                    <p>
                                                        Clinical variables that are added and require aggregation will default to the given settings here for convenience.
                                                        <br>
                                                        Such variables may have their settings individually changed after being added.
                                                    </p>
                                                    <v-select
                                                        v-model="aggregate_defaults"
                                                        :items="aggregate_options"
                                                        label="Default aggregates"
                                                        multiple
                                                        chips
                                                        deletable-chips
                                                    >
                                                    </v-select>
                                                </v-card-text>



                                            </v-card>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-card outlined>
                                                <v-tabs
                                                    background-color="primary"
                                                    dark
                                                >
                                                    <v-tab>Labs & Vitals</v-tab>
                                                    <v-tab>Medications</v-tab>
                                                    <v-tab>Outcomes</v-tab>
                                                    <v-tab>Oxygen</v-tab>
                                                    <v-tab>Scores</v-tab>

                                                    <v-tab-item
                                                    >
                                                        <v-card>
                                                            <v-autocomplete
                                                                v-model="new_lv_obj"
                                                                :items="labs_vitals"
                                                                color="white"
                                                                auto-select-first
                                                                hide-no-data
                                                                placeholder="Search for labs and vitals to add..."
                                                                prepend-icon="mdi-magnify"
                                                                item-text="label"
                                                                return-object
                                                                @change="addLV"
                                                            ></v-autocomplete>
                                                            <v-dialog
                                                                v-model="edit_lv_dialog"
                                                                persistent
                                                                max-width="600px"
                                                            >
                                                                <v-card>
                                                                    <v-card-title
                                                                        class="justify-center"
                                                                    >
                                                                        Edit aggregates for this clinical variable
                                                                    </v-card-title>
                                                                    <v-container>
                                                                        <v-checkbox
                                                                            v-model="edit_lv_obj.aggregates"
                                                                            v-for="aggregate in aggregate_options"
                                                                            :label="aggregate"
                                                                            :value="aggregate"
                                                                            dense
                                                                        >
                                                                        </v-checkbox>
                                                                    </v-container>
                                                                    <v-card-actions>
                                                                        <v-spacer></v-spacer>
                                                                        <v-btn
                                                                            color="primary"
                                                                            @click="confirmEditLV"
                                                                        >
                                                                            Save
                                                                        </v-btn>
                                                                        <v-btn
                                                                            color="secondary"
                                                                            @click="closeEditLV"
                                                                        >
                                                                            Cancel
                                                                        </v-btn>
                                                                        <v-spacer></v-spacer>
                                                                    </v-card-actions>
                                                                </v-card>
                                                            </v-dialog>
                                                            <v-dialog
                                                                v-model="delete_lv_dialog"
                                                                persistent
                                                                max-width="600px"
                                                            >
                                                                <v-card>
                                                                    <v-card-title
                                                                        class="justify-center"
                                                                    >
                                                                        Are you sure you want to delete this clinical variable?
                                                                    </v-card-title>
                                                                    <v-card-actions>
                                                                        <v-spacer></v-spacer>
                                                                        <v-btn
                                                                            color="error"
                                                                            @click="confirmDeleteLV"
                                                                        >
                                                                            Yes
                                                                        </v-btn>
                                                                        <v-btn
                                                                            color="secondary"
                                                                            @click="closeDeleteLV"
                                                                        >
                                                                            Cancel
                                                                        </v-btn>
                                                                        <v-spacer></v-spacer>
                                                                    </v-card-actions>
                                                                </v-card>
                                                            </v-dialog>

                                                            <v-snackbar
                                                                v-model="alert_lv_success"
                                                                color="success"
                                                                outlined
                                                                timeout=1000
                                                            >
                                                                    {{alert_lv_label}} added.
                                                            </v-snackbar>
                                                            <v-snackbar
                                                                v-model="alert_lv_error"
                                                                color="error"
                                                                outlined
                                                                timeout=1000
                                                            >
                                                                {{alert_lv_label}} was already added.
                                                            </v-snackbar>
                                                            <v-data-table
                                                                :headers="lv_headers"
                                                                :items="new_event.data.labs_vitals"
                                                                :items-per-page="10"
                                                                fixed-header
                                                                no-data-text="Use search bar above to start adding labs and vitals."
                                                            >
                                                                <template v-slot:item.aggregates="{ item }">
                                                                        <v-chip
                                                                            v-for="aggregate in item.aggregates"
                                                                        >
                                                                            {{aggregate}}
                                                                        </v-chip>
                                                                </template>
                                                                <template v-slot:item.actions="{ item }">
                                                                    <v-icon
                                                                        small
                                                                        class="mr-2"
                                                                        @click="editLV(item)"
                                                                    >
                                                                        mdi-pencil
                                                                    </v-icon>
                                                                    <v-icon
                                                                        small
                                                                        @click="deleteLV(item)"
                                                                    >
                                                                        mdi-delete
                                                                    </v-icon>
                                                                </template>
                                                            </v-data-table>
                                                        </v-card>
                                                    </v-tab-item>
                                                    <v-tab-item
                                                    >
                                                        <v-card>
                                                            <v-card-text>Medications</v-card-text>
                                                        </v-card>
                                                    </v-tab-item>
                                                    <v-tab-item
                                                    >
                                                        <v-card>
                                                            <v-card-text>Outcomes</v-card-text>
                                                        </v-card>
                                                    </v-tab-item>
                                                    <v-tab-item
                                                    >
                                                        <v-card>
                                                            <v-card-text>Oxygen</v-card-text>
                                                        </v-card>
                                                    </v-tab-item>
                                                    <v-tab-item
                                                    >
                                                        <v-card>
                                                            <v-card-text>Scores</v-card-text>
                                                        </v-card>
                                                    </v-tab-item>
                                                </v-tabs>

                                            </v-card>
                                        </v-col>
                                    </v-row>
                                    <v-card-actions>
                                        <v-btn
                                            color="primary"
                                            type="submit"
                                            @click="saveCollectionEventForm"
                                            :disabled="!isValidEvent"
                                        >
                                            Save
                                        </v-btn>
                                        <v-btn
                                            color="primary"
                                            @click="event_1_stepper = 1"
                                        >
                                            Back
                                        </v-btn>
                                    </v-card-actions>

                                </v-stepper-content>

                            </v-stepper>

                        </v-card>

                        <!-- After First Data Collection Event -->
                        <v-card
                            v-show="collection_events.length"
                        >
                            <v-list-item-subtitle><h1>Data Collection Events</h1></v-list-item-subtitle>
                            <v-list
                                v-for="event in collection_events"
                                :key="event.instr_name"
                            >
                                <h3>{{event.instr_name}}</h3>
                                <!-- TODO add edit/remove buttons with v-if to make sure first index is not included -->
                            </v-list>

                            <v-dialog
                                v-model="new_event_dialog"
                                persistent
                                max-width="800px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        color="primary"
                                        v-bind="attrs"
                                        v-on="on"
                                    >
                                        Add New Data Collection Event
                                    </v-btn>
                                </template>

                                <v-card outlined>
                                    <v-card-title>
                                        Create New Data Collection Event
                                    </v-card-title>
                                    <v-container>
                                        <v-form
                                            ref="event_form"
                                        >
                                            <!-- Preset events -->
                                            <v-row>
                                                <v-col
                                                    cols="6"
                                                >
                                                    <v-select
                                                        v-model="preset_choice"
                                                        :items="preset_events"
                                                        @change="new_event=JSON.parse(JSON.stringify(preset_choice))"
                                                        label="Presets"
                                                    >
                                                    </v-select>
                                                </v-col>
                                            </v-row>
                                            <!-- REDCap Instrument Name -->
                                            <v-row>
                                                <v-col
                                                    cols="6"
                                                >
                                                    <v-text-field
                                                        v-model="new_event.instr_name"
                                                        label="REDCap Instrument Name"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                            </v-row>

                                            <!-- Is this data collection event repeatable (i.e., multiple instances)? -->
                                            <v-radio-group
                                                v-model="new_event.event_type"
                                                label="Is this data collection event repeatable (i.e., multiple instances)?"
                                                @change="resetEventType"
                                            >
                                                <v-radio
                                                    label="No"
                                                    value="nonrepeating"
                                                >
                                                </v-radio>
                                                <v-radio
                                                    value="finite_repeating"
                                                >
                                                    <template v-slot:label>
                                                        <v-row
                                                            align="center"
                                                            no-gutters
                                                        >
                                                            <v-col
                                                                class="pr-1"
                                                                cols="auto"
                                                            >
                                                                Yes, each record will have
                                                            </v-col>
                                                            <v-col
                                                                class="pr-1"
                                                                sm="1"
                                                                cols="1"
                                                            >
                                                                <v-text-field
                                                                    v-model="new_event.num_instances"
                                                                    dense
                                                                    type="number"
                                                                    min="2"
                                                                >
                                                                </v-text-field>
                                                            </v-col>
                                                            <v-col
                                                                cols="auto"
                                                            >
                                                                consecutive instances of this data collection event.
                                                            </v-col>
                                                        </v-row>
                                                    </template>
                                                </v-radio>
                                                <v-radio
                                                    value="calculated_repeating"
                                                >
                                                    <template v-slot:label>
                                                        <div>No, each record will have a calculated number of consecutive instances based on specified conditions below.</div>
                                                    </template>
                                                </v-radio>
                                            </v-radio-group>

                                            <!-- Start date/datetime input of data collection event -->
                                            <v-row
                                            >
                                                <v-col
                                                    cols="4"
                                                >
                                                    <v-select
                                                        v-model="new_event.start_dttm"
                                                        :items="event_dates"
                                                        label="Start Date/Datetime"
                                                    >
                                                    </v-select>
                                                </v-col>
                                                <v-col
                                                    cols="4"
                                                    v-show="clinical_dates.includes(new_event.start_dttm)"
                                                >
                                                    <v-select
                                                        v-model="new_event.start_based_dttm"
                                                        label="based on"
                                                        :items="rp_dates_arr"
                                                    >
                                                    </v-select>
                                                </v-col>
                                            </v-row>

                                            <!-- When should this event end? -->
                                            <!-- Show only for nonrepeating events -->
                                            <v-radio-group
                                                v-model="new_event.nonrepeat_type"
                                                label="When should this event end?"
                                                @change="resetNonRepeatEnd"
                                                v-show="new_event.event_type === 'nonrepeating'"
                                            >
                                                <v-radio
                                                    value="hours"
                                                >
                                                    <template v-slot:label>
                                                        <v-row
                                                            align="center"
                                                            no-gutters
                                                        >
                                                            <v-col
                                                                class="pr-1"
                                                                cols="auto"
                                                            >
                                                                This event ends
                                                            </v-col>
                                                            <v-col
                                                                class="pr-1"
                                                                sm="1"
                                                                cols="1"
                                                            >
                                                                <v-text-field
                                                                    v-model="new_event.num_hours"
                                                                    dense
                                                                    type="number"
                                                                    min="1"
                                                                >
                                                                </v-text-field>
                                                            </v-col>
                                                            <v-col
                                                                cols="auto"
                                                            >
                                                                hour(s) after the start datetime.
                                                            </v-col>
                                                        </v-row>
                                                    </template>
                                                </v-radio>
                                                <v-radio
                                                    label="This event begins on 00:00 and ends on 23:59 on the calendar date of the start date/datetime."
                                                    value="days"
                                                >
                                                </v-radio>
                                                <v-radio
                                                    label="This event ends based on a date of interest."
                                                    value="end_dttm"
                                                >
                                                </v-radio>
                                            </v-radio-group>

                                            <!-- How should this data collection event be repeated? -->
                                            <!-- Show only for repeating events -->
                                            <v-radio-group
                                                v-model="new_event.repeat_type"
                                                label="How should this data collection event be repeated?"
                                                @change="resetRepeatType"
                                                v-show="['finite_repeating', 'calculated_repeating'].includes(new_event.event_type)"
                                            >
                                                <v-radio
                                                    value="hours"
                                                >
                                                    <template v-slot:label>
                                                        <v-row
                                                            align="center"
                                                            no-guters
                                                        >
                                                            <v-col
                                                                class="pr-1"
                                                                cols="auto"
                                                            >
                                                                Each instance ends
                                                            </v-col>
                                                            <v-col
                                                                class="pr-1"
                                                                cols="1"
                                                            >
                                                                <v-text-field
                                                                    v-model="new_event.num_hours"
                                                                    dense
                                                                    type="number"
                                                                    min="1"
                                                                >
                                                                </v-text-field>
                                                            </v-col>
                                                            <v-col
                                                                cols="auto"
                                                            >
                                                                hour(s) after its respective start datetime.
                                                            </v-col>
                                                        </v-row>
                                                    </template>
                                                </v-radio>
                                                <v-radio
                                                    value="days"
                                                >
                                                    <template v-slot:label>
                                                        <div>Calendar day intervals (e.g., every day of an inpatient admission)</div>
                                                    </template>
                                                </v-radio>
                                            </v-radio-group>

                                            <!-- End date/datetime input of data collection event -->
                                            <!-- Configure only for non-repeating or calculated repeating events -->
                                            <v-row>
                                                <v-col
                                                    cols="4"
                                                >
                                                    <v-select
                                                        v-model="new_event.end_dttm"
                                                        :items="event_dates"
                                                        label="End Date/Datetime"
                                                        v-show="
                                                        (new_event.event_type === 'nonrepeating' && new_event.nonrepeat_type === 'end_dttm')
                                                        || new_event.event_type === 'calculated_repeating'
                                                       "
                                                    >
                                                    </v-select>
                                                </v-col>
                                                <v-col
                                                    cols="4"
                                                >
                                                    <v-select
                                                        v-model="new_event.end_based_dttm"
                                                        label="based on"
                                                        :items="rp_dates_arr"
                                                        v-show="clinical_dates.includes(new_event.end_dttm)"
                                                    >
                                                    </v-select>
                                                </v-col>
                                            </v-row>
                                        </v-form>
                                    </v-container>
                                    <v-card-actions>
                                        <v-btn
                                            color="primary"
                                            type="submit"
                                            @click="saveCollectionEventForm"
                                            :disabled="!isValidEvent"
                                        >
                                            Save
                                        </v-btn>

                                        <v-btn
                                            color="error"
                                            type="reset"
                                            @click="resetEventForm"
                                        >
                                            Cancel
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>

                            </v-dialog>

                        </v-card>



                    </v-stepper-content>

                    <v-stepper-content step="4">
                        <v-card
                            class="mb-12"
                            color="grey lighten-1"
                            height="200px"
                        ></v-card>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
            <v-container>
                <v-btn
                    color="primary"
                    @click="backStep"
                >
                    < Back
                </v-btn>

                <v-btn
                    color="primary"
                    @click="nextStep"
                >
                    Next >
                </v-btn>
            </v-container>
            </v-stepper-content>
        </v-container>
    </v-app>
</div>

<!-- Required scripts CDN -->
<script src="https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js" crossorigin="anonymous"> </script>
<script src="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js" crossorigin="anonymous"></script>

<script>
    new Vue({
        el: '#app',
        vuetify: new Vuetify(),
        data: {
            step: 1,
            event_1_stepper: 1,
            dialog: false,
            rp_dates: [
                {
                    label: "Study Enrollment Date",
                    redcap_field: "enroll_date",
                    format: "date"
                }
            ],
            new_date: {
                dialog: false,
                label: null,
                redcap_field: null,
                format: null
            },
            demographics: {
                options: [
                    {
                        label: "Date of Birth",
                        redcap_field: "dob"
                    },
                    {
                        label: "Year of Birth",
                        redcap_field: "yob"
                    },
                    {
                        label: "Age at Study Enrollment Date",
                        redcap_field: "age_enroll"
                    },
                    {
                        label: "Sex",
                        redcap_field: "sex"
                    },
                    {
                        label: "Race",
                        redcap_field: "race"
                    },
                    {
                        label: "Ethnicity",
                        redcap_field: "ethnicity"
                    },
                    {
                        label: "First Name",
                        redcap_field: "fname"
                    },
                    {
                        label: "Last Name",
                        redcap_field: "lname"
                    },
                    {
                        label: "Full Name",
                        redcap_field: "name"
                    }
                ],
                selected: []
            },
            collection_events: [
            ],
            new_event: {
                instr_name: null,
                event_type: null, // nonrepeating || finite_repeating || calculated_repeating
                num_instances: null, // number of instances when event_type = 'finite_repeating'
                repeat_type: null, // hours || days when event_type is 'finite_repeating or 'calculated_repeating'
                nonrepeat_type: null, // hours || day || end_dttm when event_type is 'nonrepeating'
                num_hours: null, // number of hours when repeat_type is 'hours' or nonrepeat_type is hours
                start_type: null, // dttm || date
                start_dttm: null, // start date/datetime
                start_based_dttm: "Study Enrollment Date", // required when start_dttm is based on a clinical date
                end_dttm: null, // end date/datetime when applicable
                end_based_dttm: "Study Enrollment Date", // required when end_dttm is based on a clinical date
                data: {
                    labs_vitals: []
                }
            },
            lv_headers: [
                {text: 'Label', value: 'label'},
                {text: 'Aggregates', value: 'aggregates', sortable: false},
                {text: 'Actions', value: 'actions', sortable: false}
            ],
            new_lv_obj : {
                label: null,
            },
            alert_lv_success: false,
            alert_lv_error: false,
            alert_lv_label: null,
            edit_lv_dialog: false,
            edit_lv_index: null,
            edit_lv_obj: {
                label: null,
                aggregates: []
            },
            delete_lv_dialog: false,
            new_event_dialog: false,
            clinical_dates: [
                "ED Presentation Datetime",
                "ED Discharge Datetime",
                "Hospital Presentation Datetime",
                "Hospital Admission Datetime",
                "Hospital Discharge Datetime",
                "First ICU Admission Datetime",
                "First ICU Discharge Datetime"
            ],
            preset_choice: null,
            preset_events: [
                {
                    text: "ED Presentation to ED Discharge",
                    value: {
                        instr_name: "ED Presentation to ED Discharge",
                        event_type: "nonrepeating",
                        num_instances: null,
                        repeat_type: null,
                        nonrepeat_type: "end_dttm",
                        num_hours: null,
                        start_type: "dttm",
                        start_dttm: "ED Presentation Datetime",
                        start_based_dttm: "Study Enrollment Date",
                        end_dttm: "ED Discharge Datetime",
                        end_based_dttm: "Study Enrollment Date"
                    }
                },
                {
                    text: "First 24 Hours of Hospital Presentation",
                    value: {
                        instr_name: "First 24 Hours of Hospital Presentation",
                        event_type: "nonrepeating",
                        num_instances: null,
                        repeat_type: null,
                        nonrepeat_type: "hours",
                        num_hours: 24,
                        start_type: "dttm",
                        start_dttm: "Hospital Presentation Datetime",
                        start_based_dttm: "Study Enrollment Date",
                        end_dttm: null,
                        end_based_dttm: "Study Enrollment Date"
                    }
                },
                {
                    text: "First 24 Hours of First ICU Admission",
                    value: {
                        instr_name: "First 24 Hours of First ICU Admission",
                        event_type: "nonrepeating",
                        num_instances: null,
                        repeat_type: null,
                        nonrepeat_type: "hours",
                        num_hours: 24,
                        start_type: "dttm",
                        start_dttm: "First ICU Admission Datetime",
                        start_based_dttm: "Study Enrollment Date",
                        end_dttm: null,
                        end_based_dttm: "Study Enrollment Date"
                    }
                },
                {
                    text: "Inpatient Calendar Days",
                    value: {
                        instr_name: "Inpatient Calendar Days",
                        event_type: "calculated_repeating",
                        num_instances: null,
                        repeat_type: "days",
                        nonrepeat_type: null,
                        num_hours: null,
                        start_dttm: "Hospital Admission Datetime",
                        start_based_dttm: "Study Enrollment Date",
                        end_dttm: "Hospital Discharge Datetime",
                        end_based_dttm: "Study Enrollment Date"
                    }
                },
                {
                    text: "ICU Calendar Days",
                    value: {
                        instr_name: "ICU Calendar Days",
                        event_type: "calculated_repeating",
                        num_instances: null,
                        repeat_type: "days",
                        nonrepeat_type: "hours",
                        num_hours: 24,
                        start_dttm: "ICU Admission Datetime",
                        start_based_dttm: "Study Enrollment Date",
                        end_dttm: "ICU Discharge Datetime",
                        end_based_dttm: "Study Enrollment Date"
                    }
                }
            ],
            aggregate_options: ["minimum", "maximum", "closest to Start Datetime", "closest to 0800", "first", "last"],
            aggregate_defaults: []
        },
        computed: {
            rp_dates_arr: function() {
                return this.rp_dates.map(value => value.label);
            },
            event_dates: function() {
                let rp_dates_arr = this.rp_dates.map(value => value.label);
                return this.clinical_dates.concat(rp_dates_arr);
            },
            labs: function() {
              let labs_arr = [
                  {header: "Labs"},
                  {
                      label: "White Blood Count"
                  }
              ];
              return labs_arr;
            },
            vitals: function() {
                let vitals_arr = [
                    {header: "Vitals"},
                    {
                        label: "Heart Rate (beats per minute)"
                    },
                    {
                        label: "Temperature (Celsius)"
                    },
                    {
                        label: "Mean Arterial Pressure (MAP)"
                    },
                    {
                        label: "Systolic Blood Pressure (SBP)"
                    }
                ];
                return vitals_arr;
            },
            labs_vitals: function() {
                let labs_vitals_arr = this.labs.concat([{divider: true}]);
                return labs_vitals_arr.concat(this.vitals);
            }
        },
        methods: {
            backStep() {
                if(this.step > 1) {
                    this.step -= 1;
                } else {
                    // TODO if on step 1, go back to the landing page (including passing form data back for project info)
                }
            },
            nextStep() {
                if (this.step < 4) {
                    this.step += 1;
                }
            },
            saveDateForm() {
                this.rp_dates.push(this.new_date);
                this.new_date.dialog = false;
                this.resetDateForm();
            },
            resetDateForm() {
                this.new_date = {
                    label: null,
                    redcap_field: null,
                    format: null
                }
            },
            toggleAllDemo() {
                if(this.demographics.selected.length != this.demographics.options.length) {
                    this.demographics.selected = this.demographics.options.map(value => value.redcap_field);
                } else {
                    this.demographics.selected = [];
                }
            },
            resetEventType() {
                this.new_event.num_instances =  null;
                this.new_event.repeat_type =  null;
                this.new_event.nonrepeat_type = null;
                this.new_event.num_hours =  null;
                this.new_event.start_dttm =  null;
                this.new_event.start_based = "Study Enrollment Date";
                this.new_event.end_dttm =  null;
                this.new_event.end_based = "Study Enrollment Date";
            },
            resetRepeatType() {
                this.new_event.num_hours =  null;
                this.new_event.start_dttm =  null;
                this.new_event.start_based = "Study Enrollment Date";
                this.new_event.end_dttm =  null;
                this.new_event.end_based = "Study Enrollment Date";
            },
            resetNonRepeatEnd() {
                this.new_event.num_hours = null;
                this.new_event.end_dttm = null;
                this.new_event.end_based = "Study Enrollment Date";
            },
            isValidEvent() {
                return true;
            },
            addDataStep() {
                // TODO validate first step of defining event
                this.event_1_stepper = 2;
            },
            saveCollectionEventForm() {
                this.collection_events.push(JSON.parse(JSON.stringify(this.new_event)));
                this.resetEventForm();
            },
            resetEventForm() {
                this.$refs.event_form.reset();
                this.new_event_dialog = false;
            },
            addLV() {
                this.alert_lv_label = this.new_lv_obj.label;
                if(!this.new_event.data.labs_vitals.map(value => value.label).includes(this.new_lv_obj.label)) {
                    this.new_event.data.labs_vitals.push(JSON.parse(JSON.stringify({
                        label: this.new_lv_obj.label,
                        aggregates: this.aggregate_defaults
                    })));
                    this.alert_lv_success = true;
                } else {
                    this.alert_lv_error = true;
                }
                this.new_lv_obj = {
                    label: null
                };
            },
            editLV(obj) {
                this.edit_lv_index = this.new_event.data.labs_vitals.indexOf(obj);
                this.edit_lv_obj = Object.assign({}, obj);
                this.edit_lv_dialog = true;
            },
            confirmEditLV() {
                if(this.edit_lv_index !== null) {
                    Object.assign(this.new_event.data.labs_vitals[this.edit_lv_index], this.edit_lv_obj);
                }
                this.edit_lv_index = null;
                this.edit_lv_obj = {
                    label: null,
                    aggregates: []
                };
                this.closeEditLV();
            },
            closeEditLV() {
                this.edit_lv_dialog = false;
            },
            deleteLV(obj) {
                this.edit_lv_index = this.new_event.data.labs_vitals.indexOf(obj);
                this.delete_lv_dialog = true;
            },
            confirmDeleteLV() {
                this.new_event.data.labs_vitals.splice(this.edit_lv_index, 1);
                this.edit_lv_index = null;
                this.closeDeleteLV();
            },
            closeDeleteLV() {
                this.delete_lv_dialog = false;
            }
        }
    })
</script>
</body>
</html>
