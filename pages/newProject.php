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
        <v-container
            v-if="!metadata_loaded"
        >
            Retrieving metadata...
        </v-container>
        <v-container
            v-if="metadata_loaded"
        >
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

                        <v-card
                            outlined
                            class="mt-4"
                        >
                            <v-card-subtitle><h1>Identifier</h1></v-card-subtitle>
                            <v-data-table
                                :headers="rp_id_headers"
                                :items="rp_identifiers"
                                item-key="label"
                                fixed-header
                                dense
                                hide-default-footer
                            ></v-data-table>
                        </v-card>

                        <v-card
                            outlined
                            class="pb-2 mt-4"
                        >
                            <v-card-subtitle><h1>Dates</h1></v-card-subtitle>
                            <v-data-table
                                :headers="rp_date_headers"
                                :items="rp_dates"
                                item-key="label"
                                fixed-header
                                dense
                                hide-default-footer
                                class="mb-4"
                            >
                                <template v-slot:item.format="{ item }">
                                    <span>{{item.format}} [{{item.format=="date" ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:MM:SS'}}]</span>
                                </template>
                                <template
                                    v-slot:item.actions="{ item }"
                                >
                                    <v-icon
                                        v-show="item.id > 0"
                                        small
                                        class="mr-2"
                                        @click="editRPDate(item.id)"
                                    >
                                        mdi-pencil
                                    </v-icon>
                                    <v-icon
                                        v-show="item.id > 0"
                                        small
                                        @click="delete_date_index = item.id, delete_date_dialog = true"
                                    >
                                        mdi-delete
                                    </v-icon>
                                </template>
                            </v-data-table>

                            <!-- Add New Research-Provided Date Dialog -->
                            <v-dialog
                                v-model="new_date_dialog"
                                persistent
                                max-width="600px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        color="primary"
                                        v-bind="attrs"
                                        v-on="on"
                                        class="ml-2"
                                    >
                                        Add New Date/Datetime
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-form
                                        ref="date_form"
                                    >
                                        <v-card-title>
                                            <span class="text-h5">New Date/Datetime</span>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-text-field
                                                        v-model="new_date.label"
                                                        :rules="[rules.required, checkRCLabel]"
                                                        label="Label"
                                                        required
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-text-field
                                                        v-model="new_date.redcap_field_name"
                                                        :rules="[rules.required, checkRCFieldName]"
                                                        label="REDCap field name"
                                                        required
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-radio-group
                                                        v-model="new_date.format"
                                                        :rules="[rules.required]"
                                                        required
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
                                    </v-form>
                                </v-card>
                            </v-dialog>

                            <!-- Edit Research-Provided Date Dialog -->
                            <v-dialog
                                v-model="edit_date_dialog"
                                persistent
                                max-width="600px"
                            >
                                <v-card>
                                    <v-form
                                        ref="edit_date_form"
                                    >
                                        <v-card-title>
                                            <span class="text-h5">Edit Date/Datetime</span>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-text-field
                                                        v-model="edit_date.label"
                                                        :rules="[rules.required, checkRCLabelEdit]"
                                                        label="Label"
                                                        required
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-text-field
                                                        v-model="edit_date.redcap_field_name"
                                                        :rules="[rules.required, checkRCFieldNameEdit]"
                                                        label="REDCap field name"
                                                        required
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-radio-group
                                                        v-model="edit_date.format"
                                                        :rules="[rules.required]"
                                                        required
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
                                                @click="saveEditRPDate()"
                                            >
                                                Save
                                            </v-btn>
                                            <v-btn
                                                color="secondary"
                                                type="reset"
                                                @click="resetEditDateForm()"
                                            >
                                                Cancel
                                            </v-btn>
                                        </v-card-actions>
                                    </v-form>
                                </v-card>
                            </v-dialog>

                            <!-- Delete Researcher-Provided Date Dialog -->
                            <v-dialog
                                v-model="delete_date_dialog"
                                persistent
                                max-width="600px"
                            >
                                <v-card>
                                    <v-card-title
                                        class="justify-center"
                                    >
                                        Are you sure you want to delete this date?
                                    </v-card-title>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            color="error"
                                            @click="deleteRPDate()"
                                        >
                                            Yes
                                        </v-btn>
                                        <v-btn
                                            color="secondary"
                                            @click="delete_date_index = null, delete_date_dialog = false"
                                        >
                                            Cancel
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-card>

                    </v-stepper-content>

                    <!-- Demographics -->
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
                                :value="field"
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
                                DUSTER uses Data Collection Windows to apply this concept of creating windows of time in which you'd like to gather clinical data.
                                <br>
                                Each Data Collection Window will appear in the form of REDCap Instruments in your project.
                                <br>
                                Within each window, you may add your desired clinical data.
                                <br>
                                <br>
                                You may create Data Collection Windows below with the options to choose among preset configurations or to configure from scratch.
                            </p>
                        </v-card-text>

                        <v-card>
                            <v-card-subtitle
                                v-show="collection_windows.length"
                            >
                                <h1>Data Collection Windows</h1>
                            </v-card-subtitle>
                            <v-expansion-panels
                                v-model="open_window_panel"
                                focusable
                                class="mb-4"
                                :disabled="show_window_form === true"
                            >
                                <v-expansion-panel
                                    v-for="(window, i) in collection_windows"
                                    :key="i"
                                >
                                    <v-expansion-panel-header>
                                        {{window.label}}
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content>

                                        <v-card outlined>
                                            <v-row>
                                                <v-col>
                                                    <!-- Display timing -->
                                                    <v-card outlined>
                                                        <v-card-title>Timing</v-card-title>

                                                        <!-- Display timing for nonrepeating data collection windows -->
                                                        <v-card-text
                                                            v-if="window.type === 'nonrepeating'"
                                                        >

                                                            <!-- Display starting parameter for nonrepeating data collection windows -->
                                                            <p>
                                                                Start: {{window.timing.start_type === 'date' ? 'At 00:00:00 on ' : ''}} {{window.timing.start.label}}
                                                            </p>

                                                            <!-- Display ending parameter for nonrepeating data collection windows -->
                                                            <p
                                                                v-if="window.timing.end_type === 'hours'"
                                                            >
                                                                End: {{window.timing.num_hours}} hours after {{window.timing.start.label}}
                                                            </p>
                                                            <p
                                                                v-else-if="window.timing.end_type === 'day'"
                                                            >
                                                                End: At 23:59:00 on {{window.timing.start.label}}
                                                            </p>
                                                            <p
                                                                v-else-if="window.timing.end_type === 'dttm'"
                                                            >
                                                                End: {{window.timing.end.label}}
                                                            </p>
                                                        </v-card-text>

                                                        <!-- Display timing for finite repeating collection windows -->
                                                        <v-card-text
                                                            v-else-if="window.type === 'finite_repeating'"
                                                        >
                                                            <p>
                                                                This data collection window repeats for {{window.timing.num_instances}} consecutive {{window.timing.type === 'hours' ? window.timing.num_hours + '-hour instances.' : 'calendar day instances.'}}<br>
                                                                The first instance begins at {{window.timing.start.label}}.<br>
                                                                Each instance ends {{window.timing.type === 'hours' ? window.timing.num_hours + ' hours after it begins.' : 'at 23:59:00 on the calendar day it begins.'}}<br>
                                                            </p>

                                                        </v-card-text>

                                                        <!-- Display timing for calculated repeating collection windows -->
                                                        <v-card-text
                                                            v-else-if="window.type === 'calculated_repeating'"
                                                        >
                                                            <p>
                                                                This data collection window repeats for consecutive {{window.timing.type === 'hours' ? '-hour instances.' : 'calendar day instances.'}}<br>
                                                                The first instance begins at {{window.timing.start.label}}.<br>
                                                                Each instance ends {{window.timing.type === 'hours' ? window.timing.num_hours + ' hours after it begins.' : 'at 23:59:00 on the calendar day it begins.'}}<br>
                                                                The last instance ends at {{window.timing.end.label}}.<br>
                                                            </p>
                                                        </v-card-text>
                                                    </v-card>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col>
                                                    <v-card outlined>
                                                        <v-card-subtitle>Default Aggregates</v-card-subtitle>
                                                        <v-card-text>
                                                            <v-chip
                                                                v-if="window.aggregate_defaults.min == true"
                                                            >
                                                                Min
                                                            </v-chip>
                                                            <v-chip
                                                                v-if="window.aggregate_defaults.max == true"
                                                            >
                                                                Max
                                                            </v-chip>
                                                            <v-chip
                                                                v-if="window.aggregate_defaults.first == true"
                                                            >
                                                                First
                                                            </v-chip>
                                                            <v-chip
                                                                v-if="window.aggregate_defaults.last == true"
                                                            >
                                                                Last
                                                            </v-chip>
                                                            <v-chip
                                                                v-if="window.aggregate_defaults.closest_start == true"
                                                            >
                                                                Closest to {{window.timing.start.label}}
                                                            </v-chip>
                                                            <v-chip
                                                                v-if="window.aggregate_defaults.closest_time == true"
                                                            >
                                                                Closest to {{window.aggregates.closest_timestamp}}
                                                            </v-chip>
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
                                                            <!--
                                                            <v-tab>Medications</v-tab>
                                                            <v-tab>Outcomes</v-tab>
                                                            <v-tab>Oxygen</v-tab>
                                                            <v-tab>Scores</v-tab>
                                                            -->

                                                            <v-tab-item
                                                            >
                                                                <v-card>
                                                                    <v-data-table
                                                                        :headers="lv_headers_viewonly"
                                                                        :items="window.data.labs_vitals"
                                                                        :items-per-page="10"
                                                                        fixed-header
                                                                        no-data-text="Use search bar above to start adding labs and vitals."
                                                                    >
                                                                        <template v-slot:item.aggregates="{ item }">
                                                                            <v-chip
                                                                                v-show="item.aggregates.default == true"
                                                                            >
                                                                                Using Default Aggregates
                                                                            </v-chip>
                                                                            <v-chip
                                                                                v-show="item.aggregates.default == false && item.aggregates.min == true"
                                                                            >
                                                                                Min
                                                                            </v-chip>
                                                                            <v-chip
                                                                                v-show="item.aggregates.default == false && item.aggregates.max == true"
                                                                            >
                                                                                Max
                                                                            </v-chip>
                                                                            <v-chip
                                                                                v-show="item.aggregates.default == false && item.aggregates.first == true"
                                                                            >
                                                                                First
                                                                            </v-chip>
                                                                            <v-chip
                                                                                v-show="item.aggregates.default == false && item.aggregates.last == true"
                                                                            >
                                                                                Last
                                                                            </v-chip>
                                                                            <v-chip
                                                                                v-show="item.aggregates.default == false && item.aggregates.closest_start == true"
                                                                            >
                                                                                Closest to {{window.timing.start.label}}
                                                                            </v-chip>
                                                                            <v-chip
                                                                                v-show="item.aggregates.default == false && item.aggregates.closest_time == true"
                                                                            >
                                                                                Closest to {{item.aggregates.closest_timestamp}}
                                                                            </v-chip>
                                                                        </template>
                                                                    </v-data-table>
                                                                </v-card>
                                                            </v-tab-item>
                                                            <!--
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
                                                            -->
                                                        </v-tabs>


                                                    </v-card>
                                                </v-col>
                                            </v-row>
                                        </v-card>

                                        <v-card-actions
                                            class="mt-4"
                                            v-show="edit_window_index === i"
                                        >
                                            <v-btn
                                                color="secondary"
                                                @click="edit_window_index = -1, cancelEditWindow(i)"
                                            >
                                                Cancel Edit
                                            </v-btn>
                                        </v-card-actions>
                                        <v-btn
                                            v-show="edit_window_index === -1"
                                            color="primary"
                                            @click="editWindow(i)"
                                        >
                                            Edit
                                        </v-btn>
                                        <v-btn
                                            v-show="edit_window_index === -1"
                                            color="error"
                                            @click="delete_window_dialog = true"
                                        >
                                            Delete
                                        </v-btn>
                                        <v-dialog
                                            v-model="delete_window_dialog"
                                            persistent
                                            max-width="1000px"
                                        >
                                            <v-card>
                                                <v-card-title
                                                    class="justify-center"
                                                >
                                                    Are you sure you want to delete this Data Collection Window?
                                                </v-card-title>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                        color="error"
                                                        @click="deleteWindow(i)"
                                                    >
                                                        Yes
                                                    </v-btn>
                                                    <v-btn
                                                        color="secondary"
                                                        @click="delete_window_dialog = false"
                                                    >
                                                        Cancel
                                                    </v-btn>
                                                    <v-spacer></v-spacer>
                                                </v-card-actions>
                                            </v-card>
                                        </v-dialog>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>

                            <!-- Create/Edit a Data Collection Window -->
                            <v-card
                                v-show="!collection_windows.length || show_window_form == true"
                                outlined
                            >
                                <v-card-subtitle><h1>{{edit_window_index === -1 ? 'Create a New' : 'Edit'}} Data Collection Window</h1></v-card-subtitle>

                                <v-stepper
                                v-model="window_stepper"
                                vertical
                                >
                                    <v-stepper-step
                                        :complete="window_stepper > 1"
                                        step="1"
                                        editable
                                    >
                                        Set Timing
                                    </v-stepper-step>

                                    <v-stepper-content step="1">

                                        <v-form
                                            ref="window_form"
                                        >
                                            <!-- Preset windows -->
                                            <v-row>
                                                <v-col
                                                    cols="6"
                                                >
                                                    <v-select
                                                        v-model="preset_choice"
                                                        :items="preset_windows"
                                                        @change="setPreset(preset_choice)"
                                                        ref="preset_window"
                                                        label="Presets"
                                                        item-text="label"
                                                        return-object
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
                                                        v-model="window.label"
                                                        :rules="[rules.required, checkInstrName]"
                                                        label="Data Collection Window Name"
                                                        required
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                            </v-row>

                                            <!-- Is this data collection window repeatable (i.e., multiple instances)? -->
                                            <!--
                                            <v-radio-group
                                                v-model="window.type"
                                                @change="resetWindowType(window)"
                                                :rules="[rules.required]"
                                                required
                                                label="Is this data collection window repeatable (i.e., multiple instances)?"
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
                                                                    v-model="window.timing.num_instances"
                                                                    :rules="window.type === 'finite_repeating' ? [rules.required, rules.num_instances] : []"
                                                                    :required="window.type === 'finite_repeating'"
                                                                    dense
                                                                    type="number"
                                                                    min="2"
                                                                >
                                                                </v-text-field>
                                                            </v-col>
                                                            <v-col
                                                                cols="auto"
                                                            >
                                                                consecutive instances of this data collection window.
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
                                            -->

                                            <!-- When should this window start? -->
                                            <v-radio-group
                                                v-model="window.timing.start_type"
                                                label="When should this window start?"
                                                v-if="window.type === 'nonrepeating'"
                                            >
                                                <v-radio
                                                    value="dttm"
                                                    class="pl-3"
                                                >
                                                    <template v-slot:label>
                                                        <v-row
                                                            align="center"
                                                            no-gutters
                                                        >
                                                            <v-col
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
                                                                    <span>If the specified Date of Interest is not a Datetime, 00:00:00 will be used.</span>
                                                                </v-tooltip>
                                                            </v-col>
                                                        </v-row>
                                                    </template>
                                                </v-radio>
                                                <v-radio
                                                    label="At 00:00:00 on a specified Date/Datetime of Interest."
                                                    value="date"
                                                    class="pl-3"
                                                >
                                                </v-radio>
                                            </v-radio-group>

                                            <!-- Start date/datetime input of data collection window -->
                                            <v-row>
                                                <v-col
                                                    cols="4"
                                                >
                                                    <v-select
                                                        v-model="window.timing.start"
                                                        :items="window_dates"
                                                        item-text="label"
                                                        item-value="label"
                                                        return-object
                                                        label="Date/Datetime of Interest"
                                                        v-if="window.timing.start_type || ['finite_repeating', 'calculated_repeating'].includes(window.type)"
                                                    >
                                                    </v-select>
                                                </v-col>
                                                <v-col
                                                    cols="4"
                                                    v-if="clinical_dates.includes(window.timing.start)"
                                                >
                                                    <v-select
                                                        v-model="window.timing.start_based"
                                                        :items="rp_dates"
                                                        item-text="label"
                                                        item-value="redcap_field_name"
                                                        label="based on"
                                                        hint="To identify the Date/Datetime of Interest, this date/datetime must fall within the same hospital encounter."
                                                        persistent-hint
                                                    >
                                                    </v-select>
                                                </v-col>

                                            </v-row>

                                            <!-- When should this window end? -->
                                            <!-- Show only for nonrepeating windows -->
                                            <v-radio-group
                                                v-model="window.timing.end_type"
                                                label="When should this window end?"
                                                @change="resetNonRepeatEnd(window)"
                                                v-if="window.type === 'nonrepeating' && window.timing.start"
                                            >
                                                <v-radio
                                                    value="hours"
                                                    class="pl-3"
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
                                                                This window ends
                                                            </v-col>
                                                            <v-col
                                                                class="pr-1"
                                                                sm="1"
                                                                cols="1"
                                                            >
                                                                <v-text-field
                                                                    v-model.number="window.timing.num_hours"
                                                                    dense
                                                                    type="number"
                                                                    min="1"
                                                                >
                                                                </v-text-field>
                                                            </v-col>
                                                            <v-col
                                                                cols="auto"
                                                            >
                                                                hour(s) after {{window.timing.start.label}}.
                                                            </v-col>
                                                        </v-row>
                                                    </template>
                                                </v-radio>
                                                <v-radio
                                                    value="day"
                                                    class="pl-3"
                                                >
                                                    <template v-slot:label>
                                                        This window ends on 23:59 on the same calendar date of {{window.timing.start.label}}.
                                                    </template>
                                                </v-radio>
                                                <v-radio
                                                    label="This window ends on a specified date/datetime."
                                                    value="dttm"
                                                    class="pl-3"
                                                >
                                                </v-radio>
                                            </v-radio-group>

                                            <!-- How should this data collection window be repeated? -->
                                            <!-- Show only for repeating windows -->
                                            <v-radio-group
                                                v-model="window.timing.type"
                                                label="How should this data collection window be repeated?"
                                                @change="resetRepeat(window)"
                                                v-if="['finite_repeating', 'calculated_repeating'].includes(window.type)"
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
                                                                    v-model="window.timing.num_hours"
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

                                            <!-- End date/datetime input of data collection window -->
                                            <!-- Configure only for non-repeating or calculated repeating windows -->
                                            <v-row>
                                                <v-col
                                                    cols="4"
                                                >
                                                    <v-select
                                                        v-model="window.timing.end"
                                                        :items="window_dates"
                                                        item-text="label"
                                                        item-value="label"
                                                        return-object
                                                        label="End Date/Datetime"
                                                        v-if="(window.type === 'nonrepeating' && window.timing.end_type === 'dttm')
                                                                || window.type === 'calculated_repeating'"
                                                    >
                                                    </v-select>
                                                </v-col>
                                                <v-col
                                                    cols="4"
                                                >
                                                    <v-select
                                                        v-model="window.timing.end_based"
                                                        label="based on"
                                                        item-text="label"
                                                        item-value="redcap_field_name"
                                                        :items="rp_dates"
                                                        v-if="clinical_dates.includes(window.timing.end)"
                                                        hint="To identify the End Date/Datetime, this date/datetime must fall within the same hospital encounter."
                                                        persistent-hint
                                                    >
                                                    </v-select>
                                                </v-col>
                                            </v-row>
                                        <v-btn
                                            color="error"
                                            type="reset"
                                            @click="resetWindow('window', 'window_form')"
                                        >
                                            Reset Timing
                                        </v-btn>
                                        </v-form>
                                    </v-stepper-content>

                                    <v-stepper-step
                                        step="2"
                                        :editable="isValidTiming()"
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
                                                        <v-row
                                                            no-gutters
                                                        >
                                                            <v-col
                                                                cols="1"
                                                            >
                                                                <v-checkbox
                                                                    v-model="window.aggregate_defaults.min"
                                                                    dense
                                                                    label="Min"
                                                                >
                                                                </v-checkbox>
                                                            </v-col>
                                                            <v-col
                                                                cols="1"
                                                                class="pl-1"
                                                            >
                                                                <v-checkbox
                                                                    v-model="window.aggregate_defaults.max"
                                                                    dense
                                                                    label="Max"
                                                                >
                                                                </v-checkbox>
                                                            </v-col>
                                                            <!--
                                                            <v-col
                                                                cols="1"
                                                            >
                                                                <v-checkbox
                                                                    v-model="window.aggregate_defaults.first"
                                                                    dense
                                                                    label="First"
                                                                >
                                                                </v-checkbox>
                                                            </v-col>
                                                            <v-col
                                                                cols="1"
                                                            >
                                                                <v-checkbox
                                                                    v-model="window.aggregate_defaults.last"
                                                                    dense
                                                                    label="Last"
                                                                >
                                                                </v-checkbox>
                                                            </v-col>
                                                            -->
                                                        </v-row>
                                                        <!--
                                                        <v-row
                                                            no-gutters
                                                        >
                                                            <v-col
                                                                cols="4"
                                                                v-if="canAggStart()"
                                                            >
                                                                <v-checkbox
                                                                    v-model="window.aggregate_defaults.closest_start"
                                                                    dense
                                                                    :label="`Closest to ${window.timing.start.label}`"
                                                                >
                                                                </v-checkbox>
                                                            </v-col>
                                                        </v-row>
                                                        <v-row
                                                            no-gutters
                                                        >
                                                            <v-col
                                                                cols="4"
                                                            >
                                                                <v-checkbox
                                                                    v-model="window.aggregate_defaults.closest_time"
                                                                    dense
                                                                    v-if="canAggTime()"
                                                                >
                                                                    <template v-slot:label>
                                                                        <v-row
                                                                            align="center"
                                                                            no-gutters
                                                                        >
                                                                            <v-col
                                                                                cols="auto"
                                                                                class="pr-1"
                                                                            >
                                                                                Closest to
                                                                            </v-col>
                                                                            <v-col
                                                                                cols="auto"
                                                                            >
                                                                                <v-text-field
                                                                                    v-model="window.aggregate_defaults.closest_timestamp"
                                                                                    type="time"
                                                                                    value="08:00:00"
                                                                                    dense
                                                                                ></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </template>
                                                                </v-checkbox>
                                                            </v-col>
                                                        </v-row>
                                                        -->
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
                                                        <!-- <v-tab>Medications</v-tab> -->
                                                        <v-tab>Outcomes</v-tab>
                                                        <!-- <v-tab>Oxygen</v-tab> -->
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
                                                                        <v-radio-group
                                                                            v-model="edit_lv_obj.aggregates.default"
                                                                            column
                                                                        >
                                                                            <v-radio
                                                                                label="Use default aggregates"
                                                                                :value="true"
                                                                            ></v-radio>
                                                                            <v-radio
                                                                                label="Set custom aggregates"
                                                                                :value="false"
                                                                            ></v-radio>
                                                                        </v-radio-group>
                                                                        <v-card
                                                                            flat
                                                                            v-show="!edit_lv_obj.aggregates.default"
                                                                        >
                                                                            <v-row
                                                                                no-gutters
                                                                            >
                                                                                <v-col
                                                                                    cols="2"
                                                                                >
                                                                                    <v-checkbox
                                                                                        v-model="edit_lv_obj.aggregates.min"
                                                                                        dense
                                                                                        label="Min"
                                                                                    >
                                                                                    </v-checkbox>
                                                                                </v-col>
                                                                                <v-col
                                                                                    cols="2"
                                                                                >
                                                                                    <v-checkbox
                                                                                        v-model="edit_lv_obj.aggregates.max"
                                                                                        dense
                                                                                        label="Max"
                                                                                    >
                                                                                    </v-checkbox>
                                                                                </v-col>
                                                                                <!--
                                                                                <v-col
                                                                                    cols="2"
                                                                                >
                                                                                    <v-checkbox
                                                                                        v-model="edit_lv_obj.aggregates.first"
                                                                                        dense
                                                                                        label="First"
                                                                                    >
                                                                                    </v-checkbox>
                                                                                </v-col>
                                                                                <v-col
                                                                                    cols="2"
                                                                                >
                                                                                    <v-checkbox
                                                                                        v-model="edit_lv_obj.aggregates.last"
                                                                                        dense
                                                                                        label="Last"
                                                                                    >
                                                                                    </v-checkbox>
                                                                                </v-col>
                                                                            </v-row>
                                                                            <v-row
                                                                                no-gutters
                                                                            >
                                                                                <v-col
                                                                                    cols="8"
                                                                                >
                                                                                    <v-checkbox
                                                                                        v-model="edit_lv_obj.aggregates.closest_start"
                                                                                        dense
                                                                                        :label="`Closest to ${window.timing.start.label}`"
                                                                                        v-if="canAggStart()"
                                                                                    >
                                                                                    </v-checkbox>
                                                                                </v-col>
                                                                            </v-row>
                                                                            <v-row
                                                                                no-gutters
                                                                            >
                                                                                <v-col
                                                                                    cols="8"
                                                                                >
                                                                                    <v-checkbox
                                                                                        v-model="edit_lv_obj.aggregates.closest_time"
                                                                                        dense
                                                                                        v-if="canAggTime()"
                                                                                    >
                                                                                        <template v-slot:label>
                                                                                            <v-row
                                                                                                align="center"
                                                                                                no-gutters
                                                                                            >
                                                                                                <v-col
                                                                                                    cols="auto"
                                                                                                    class="pr-1"
                                                                                                >
                                                                                                    Closest to
                                                                                                </v-col>
                                                                                                <v-col
                                                                                                    cols="auto"
                                                                                                >
                                                                                                    <v-text-field
                                                                                                        v-model="edit_lv_obj.aggregates.closest_timestamp"
                                                                                                        type="time"
                                                                                                        value="08:00:00"
                                                                                                        dense
                                                                                                    ></v-text-field>
                                                                                                </v-col>
                                                                                            </v-row>
                                                                                        </template>
                                                                                    </v-checkbox>
                                                                                </v-col>
                                                                                -->
                                                                            </v-row>
                                                                        </v-card>
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
                                                                    :items="window.data.labs_vitals"
                                                                    :items-per-page="10"
                                                                    fixed-header
                                                                    no-data-text="Use search bar above to start adding labs and vitals."
                                                                >
                                                                    <template v-slot:item.aggregates="{ item }">
                                                                        <v-chip
                                                                            v-show="item.aggregates.default == true"
                                                                        >
                                                                            Using Default Aggregates
                                                                        </v-chip>
                                                                        <v-chip
                                                                            v-show="item.aggregates.default == false && item.aggregates.min == true"
                                                                        >
                                                                            Min
                                                                        </v-chip>
                                                                        <v-chip
                                                                            v-show="item.aggregates.default == false && item.aggregates.max == true"
                                                                        >
                                                                            Max
                                                                        </v-chip>
                                                                        <v-chip
                                                                            v-show="item.aggregates.default == false && item.aggregates.first == true"
                                                                        >
                                                                            First
                                                                        </v-chip>
                                                                        <v-chip
                                                                            v-show="item.aggregates.default == false && item.aggregates.last == true"
                                                                        >
                                                                            Last
                                                                        </v-chip>
                                                                        <v-chip
                                                                            v-show="item.aggregates.default == false && item.aggregates.closest_start == true"
                                                                        >
                                                                            Closest to {{window.timing.start.label}}
                                                                        </v-chip>
                                                                        <v-chip
                                                                            v-show="item.aggregates.default == false && item.aggregates.closest_time == true"
                                                                        >
                                                                            Closest to {{item.aggregates.closest_timestamp}}
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
                                                        <!--
                                                        <v-tab-item
                                                        >
                                                            <v-card>
                                                                <v-card-text>Medications</v-card-text>
                                                            </v-card>
                                                        </v-tab-item>
                                                        -->
                                                        <v-tab-item
                                                        >
                                                            <v-card>
                                                                <v-card-text>Outcomes is not currently available.</v-card-text>
                                                            </v-card>
                                                        </v-tab-item>
                                                        <!--
                                                        <v-tab-item
                                                        >
                                                            <v-card>
                                                                <v-card-text>Oxygen</v-card-text>
                                                            </v-card>
                                                        </v-tab-item>
                                                        -->
                                                        <v-tab-item
                                                        >
                                                            <v-card>
                                                                <v-card-text>Scores is not currently available.</v-card-text>
                                                            </v-card>
                                                        </v-tab-item>
                                                    </v-tabs>

                                                </v-card>
                                            </v-col>
                                        </v-row>
                                        <v-card-actions>
                                            <v-btn
                                                color="primary"
                                                @click="saveCollectionWindowForm()"
                                            >
                                                Save Window
                                            </v-btn>
                                        </v-card-actions>

                                        <v-alert
                                            v-model="alert_default_agg"
                                            type="error"
                                            dismissible
                                        >
                                            One or more clinical variables that you added are using default aggregates, but you did not set them.
                                            Set default aggregates in order to continue.
                                        </v-alert>

                                    </v-stepper-content>

                                </v-stepper>

                                <v-card-actions
                                    class="mt-4"
                                    v-show="show_window_form == true"
                                >
                                    <v-btn
                                        color="secondary"
                                        @click="edit_window_index = -1, show_window_form = false, resetWindow('window', 'window_form')"
                                    >
                                        Cancel
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                            <v-btn
                                color="primary"
                                @click="show_window_form = true, open_window_panel = null"
                                v-show="show_window_form === false"
                            >
                                Add New Data Collection Window
                            </v-btn>
                        </v-card>


                    </v-stepper-content>

                    <v-stepper-content step="4">
                    <!-- Place collapse/expand panels in a grid to maintain constant size with block prop -->
                    <v-row>
                        <v-col
                            cols="4"
                        >
                            <v-btn
                                color="secondary"
                                block
                                class="mb-4"
                                @click="instruments = instruments.length > 0 ? [] : Array.from(Array(2 + config.collection_windows.length).keys())"
                            >
                                {{ instruments.length > 0 ? 'Collapse all instruments' : 'Expand all instruments'}}
                            </v-btn>
                        </v-col>
                    </v-row>


                        <v-expansion-panels
                            v-model="instruments"
                            multiple
                            accordion
                        >
                            <!-- Researcher-Provided Info -->
                            <v-expansion-panel>
                                <v-expansion-panel-header>Instrument: Researcher-Provided Info (researcher_provided_info)</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                <v-card
                                    outlined
                                    class="mb-4"
                                >
                                    <v-card-subtitle><h2>Identifier</h2></v-card-subtitle>
                                    <v-data-table
                                        :headers="review_id_headers"
                                        :items="config.rp_info.rp_identifiers"
                                        item-key="label"
                                        fixed-header
                                        dense
                                        hide-default-footer
                                    >
                                        <template v-slot:item.format="{ item }">
                                            <span>8-digit number (including leading zeros, e.g., '01234567')</span>
                                        </template>
                                    </v-data-table>

                                </v-card>
                                <v-card
                                    outlined
                                    class="mb-4"
                                >
                                    <v-card-subtitle><h2>Dates</h2></v-card-subtitle>
                                    <v-data-table
                                        :headers="review_date_headers"
                                        :items="Object.values(config.rp_info.rp_dates)"
                                        item-key="label"
                                        fixed-header
                                        dense
                                        hide-default-footer
                                    >
                                        <template v-slot:item.format="{ item }">
                                            <span>{{item.format}} [{{item.format=="date" ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:MM:SS'}}]</span>
                                        </template>
                                    </v-data-table>
                                </v-card>
                                </v-expansion-panel-content>
                            </v-expansion-panel>

                            <!-- Demographics -->
                            <v-expansion-panel>
                                <v-expansion-panel-header>Instrument: Demographics (demographics)</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                <v-card
                                    outlined
                                >
                                    <v-data-table
                                        :headers="review_demo_headers"
                                        :items="config.demographics"
                                        item-key="label"
                                        no-data-text="No demographics have been selected."
                                        fixed-header
                                        dense
                                        hide-default-footer
                                    ></v-data-table>
                                </v-card>
                                </v-expansion-panel-content>
                            </v-expansion-panel>


                            <!-- Clinical Data -->
                            <v-expansion-panel
                                v-for="cw in config.collection_windows"
                            >
                                <v-expansion-panel-header>Instrument: {{cw.label}} ({{cw.form_name}})</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-card
                                        outlined
                                        class="mb-4"
                                    >
                                        <v-card-subtitle><h2>Timing</h2></v-card-subtitle>
                                        <v-list-item three-line>
                                            <v-list-item-content>
                                                <v-list-item-title>Start</v-list-item-title>
                                                <v-list-item-subtitle>Label: {{cw.timing.start.label}}</v-list-item-subtitle>
                                                <v-list-item-subtitle>REDCap field name: {{cw.timing.start.redcap_field_name}}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-list-item three-line>
                                            <v-list-item-content>
                                                <v-list-item-title>End</v-list-item-title>
                                                <v-list-item-subtitle>Label: {{cw.timing.end.label}}</v-list-item-subtitle>
                                                <v-list-item-subtitle>REDCap field name: {{cw.timing.end.redcap_field_name}}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-card>
                                    <v-card
                                        outlined
                                        class="mb-4"
                                    >
                                        <v-card-subtitle><h2>Labs</h2></v-card-subtitle>
                                        <v-data-table
                                            :headers="review_cw_headers"
                                            :items="cw.data.labs"
                                            item-key="label"
                                            no-data-text="No labs have been selected."
                                            fixed-header
                                            dense
                                            hide-default-footer
                                        ></v-data-table>
                                    </v-card>
                                    <v-card
                                        outlined
                                        class="mb-4"
                                    >
                                        <v-card-subtitle><h2>Vitals</h2></v-card-subtitle>
                                        <v-data-table
                                            :headers="review_cw_headers"
                                            :items="cw.data.vitals"
                                            item-key="label"
                                            no-data-text="No vitals have been selected."
                                            fixed-header
                                            dense
                                            hide-default-footer
                                        ></v-data-table>
                                    </v-card>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                      <div v-if="save_error">
                        <v-alert type="error"><span v-html="save_error"></span></v-alert>
                      </div>
                        <v-btn
                            color="primary"
                            class="mt-4"
                            @click="createProject"
                        >
                            Create Project
                        </v-btn>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
            <v-container>
                <v-btn
                    color="primary"
                    @click="backStep"
                    :disabled="show_window_form && collection_windows.length > 0"
                >
                    < Back
                </v-btn>

                <v-btn
                    color="primary"
                    @click="nextStep"
                    v-show="step < 4"
                    :disabled="show_window_form && collection_windows.length > 0"
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
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/md5-js-tools@1.0.2/lib/md5.min.js" crossorigin="anonymous"></script>

<script>
    new Vue({
        el: '#app',
        vuetify: new Vuetify(),
        data: {
            surveys_enabled: "",
            repeatforms: "",
            scheduling: "",
            randomization: "",
            app_title: "",
            purpose: "",
            project_pi_firstname: "",
            project_pi_mi: "",
            project_pi_lastname: "",
            project_pi_email: "",
            project_pi_alias: "",
            project_irb_number: "",
            purpose_other: "",
            project_note: "",
            projecttype: "",
            repeatforms_chk: "",
            project_template_radio: "",
            metadata_loaded: false,
            step: 1,
            edit_window_stepper: 1,
            review_window_stepper: 1,
            window_stepper: 1,
            dialog: false,
            sb_flag: false,
            instruments: [],
            rp_identifiers: [
                {
                    label: "MRN",
                    redcap_field_name: "mrn",
                    format: "8-digit number (including leading zeros, e.g., '01234567')"
                }
            ],
            rp_id_headers: [
                {text: 'Label', value: 'label'},
                {text: 'REDCap field name', value: 'redcap_field_name'},
                {text: 'Format', value: 'format'}
            ],
            rp_dates: [
                {
                    id: 0,
                    label: "Study Enrollment Date",
                    redcap_field_name: "enroll_date",
                    format: "date"
                }
            ],
            rp_date_headers: [
                {text: 'Label', value: 'label'},
                {text: 'REDCap field name', value: 'redcap_field_name'},
                {text: 'Format', value: 'format'},
                {text: 'Actions', value: 'actions', sortable: false}
            ],
            new_date: {
                id: null,
                label: null,
                redcap_field_name: null,
                format: null
            },
            edit_date: {
                label: null,
                redcap_field_name: null,
                format: null
            },
            demographics: {
                options: [],
                selected: []
            },
            collection_windows: [
                {
                    label: "Hospital Admission",
                    type: "nonrepeating", // nonrepeating || finite_repeating || calculated_repeating
                    timing: {
                        start_type: "dttm",
                        start: {
                            category: "dates",
                            duster_field_name: "hospital_admit_dttm",
                            label: "Hospital Admission Datetime"
                        },
                        start_based: "enroll_date",
                        end_type: "dttm",
                        num_hours: null,
                        end: {
                            category: "dates",
                            duster_field_name: "hospital_discharge_dttm",
                            label: "Hospital Discharge Datetime"
                        },
                        end_based: "enroll_date"
                    },
                    aggregate_defaults: {
                        min: true,
                        max: true,
                        first: false,
                        last: false,
                        closest_start: false,
                        closest_time: false,
                        closest_timestamp: "08:00:00"
                    },
                    data: {
                        labs_vitals: [
                            {
                                category: "labs",
                                duster_field_name: "k",
                                label: "Potassium (K)",
                                aggregates: {
                                    default: true,
                                    min: false,
                                    max: false,
                                    first: false,
                                    last: false,
                                    closest_start: false,
                                    closest_time: false,
                                    closest_timestamp: "08:00:00"
                                }
                            },
                            {
                                category: "labs",
                                duster_field_name: "na",
                                label: "Sodium (Na)",
                                aggregates: {
                                    default: false,
                                    min: false,
                                    max: true,
                                    first: false,
                                    last: false,
                                    closest_start: false,
                                    closest_time: false,
                                    closest_timestamp: "08:00:00"
                                }
                            }
                        ]
                    }
                },
                {
                    label: "First 24 Hours of Hospital Admission",
                    type: "nonrepeating", // nonrepeating || finite_repeating || calculated_repeating
                    timing: {
                        start_type: "dttm",
                        start: {
                            category: "dates",
                            duster_field_name: "hospital_admit_dttm",
                            label: "Hospital Admission Datetime"
                        },
                        start_based: "enroll_date",
                        end_type: "hours",
                        num_hours: 24,
                        end: null,
                        end_based: "enroll_date"
                    },
                    aggregate_defaults: {
                        min: true,
                        max: true,
                        first: false,
                        last: false,
                        closest_start: false,
                        closest_time: false,
                        closest_timestamp: "08:00:00"
                    },
                    data: {
                        labs_vitals: [
                            {
                                category: "labs",
                                duster_field_name: "k",
                                label: "Potassium (K)",
                                aggregates: {
                                    default: true,
                                    min: false,
                                    max: false,
                                    first: false,
                                    last: false,
                                    closest_start: false,
                                    closest_time: false,
                                    closest_timestamp: "08:00:00"
                                }
                            },
                            {
                                category: "labs",
                                duster_field_name: "na",
                                label: "Sodium (Na)",
                                aggregates: {
                                    default: false,
                                    min: true,
                                    max: true,
                                    first: false,
                                    last: false,
                                    closest_start: false,
                                    closest_time: false,
                                    closest_timestamp: "08:00:00"
                                }
                            }
                        ]
                    }
                },
                {
                    label: "Study Enrollment Day",
                    type: "nonrepeating", // nonrepeating || finite_repeating || calculated_repeating
                    timing: {
                        start_type: "date",
                        start: {
                            format: "date",
                            id: 0,
                            label: "Study Enrollment Date",
                            redcap_field_name: "enroll_date"
                        },
                        start_based: "enroll_date",
                        end_type: "day",
                        num_hours: null,
                        end: null,
                        end_based: "enroll_date"
                    },
                    aggregate_defaults: {
                        min: true,
                        max: true,
                        first: false,
                        last: false,
                        closest_start: false,
                        closest_time: false,
                        closest_timestamp: "08:00:00"
                    },
                    data: {
                        labs_vitals: [
                            {
                                category: "labs",
                                duster_field_name: "k",
                                label: "Potassium (K)",
                                aggregates: {
                                    default: true,
                                    min: false,
                                    max: false,
                                    first: false,
                                    last: false,
                                    closest_start: false,
                                    closest_time: false,
                                    closest_timestamp: "08:00:00"
                                }
                            },
                            {
                                category: "labs",
                                duster_field_name: "na",
                                label: "Sodium (Na)",
                                aggregates: {
                                    default: true,
                                    min: false,
                                    max: false,
                                    first: false,
                                    last: false,
                                    closest_start: false,
                                    closest_time: false,
                                    closest_timestamp: "08:00:00"
                                }
                            }
                        ]
                    }
                }
            ],
            window_edit: false, // flag for window_form (editing a saved window if true, creating a new window if false)
            window: {
                label: null,
                type: "nonrepeating", // nonrepeating || finite_repeating || calculated_repeating
                timing: {   // changes depending on window's type
                    start_type: null,
                    start: null,
                    start_based: "enroll_date",
                    end_type: null,
                    num_hours: null,
                    end: null,
                    end_based: "enroll_date"
                },
                aggregate_defaults: {
                    min: false,
                    max: false,
                    first: false,
                    last: false,
                    closest_start: false,
                    closest_time: false,
                    closest_timestamp: "08:00:00"
                },
                data: {
                    labs_vitals: []
                }
            },
            labs: [],
            vitals: [],
            lv_headers: [
                {text: 'Label', value: 'label'},
                {text: 'Aggregates', value: 'aggregates', sortable: false},
                {text: 'Actions', value: 'actions', sortable: false}
            ],
            lv_headers_viewonly :[
                {text: 'Label', value: 'label'},
                {text: 'Aggregates', value: 'aggregates', sortable: false}
            ],
            new_lv_obj : {
                duster_field_name: null,
                label: null,
                category: null
            },
            new_date_dialog: false,
            edit_date_index: null,
            edit_date_dialog: false,
            delete_date_index: null,
            delete_date_dialog: false,
            alert_default_agg: false,
            alert_lv_success: false,
            alert_lv_error: false,
            alert_lv_label: null,
            edit_lv_dialog: false,
            edit_lv_index: null,
            edit_lv_obj: {
                label: null,
                aggregates: {
                    default: true,
                    min: false,
                    max: false,
                    first: false,
                    last: false,
                    closest_start: false,
                    closest_time: false,
                    closest_timestamp: "08:00:00"
                }
            },
            delete_lv_dialog: false,
            edit_window_index: -1,
            pre_edit_window: null,
            open_window_panel: null,
            show_window_form: false,
            delete_window_dialog: false,
            clinical_dates: [],
            preset_choice: null,
            preset_windows: [
                {
                    label: "ED Presentation to ED Discharge",
                    type: "nonrepeating", // nonrepeating || finite_repeating || calculated_repeating
                    timing: {
                        start_type: "dttm",
                        start: {
                            category: "dates",
                            duster_field_name: "ed_admission_dttm",
                            label: "ED Admission Datetime"
                        },
                        start_based: "enroll_date",
                        end_type: "dttm",
                        num_hours: null,
                        end: {
                            category: "dates",
                            duster_field_name: "ed_discharge_dttm",
                            label: "ED Discharge Datetime"
                        },
                        end_based: "enroll_date"
                    },
                    aggregate_defaults: {
                        min: false,
                        max: false,
                        first: false,
                        last: false,
                        closest_start: false,
                        closest_time: false,
                        closest_timestamp: "08:00:00"
                    },
                    data: {
                        labs_vitals: []
                    }
                },
                {
                    label: "Hospital Presentation to Hospital Discharge",
                    type: "nonrepeating", // nonrepeating || finite_repeating || calculated_repeating
                    timing: {
                        start_type: "dttm",
                        start: {
                            category: "dates",
                            duster_field_name: "hospital_admit_dttm",
                            label: "Hospital Admission Datetime"
                        },
                        start_based: "enroll_date",
                        end_type: "dttm",
                        num_hours: null,
                        end: {
                            category: "dates",
                            duster_field_name: "hospital_discharge_dttm",
                            label: "Hospital Discharge Datetime"
                        },
                        end_based: "enroll_date"
                    },
                    aggregate_defaults: {
                        min: false,
                        max: false,
                        first: false,
                        last: false,
                        closest_start: false,
                        closest_time: false,
                        closest_timestamp: "08:00:00"
                    },
                    data: {
                        labs_vitals: []
                    }
                },
                {
                    label: "First 24 Hours of Hospital Admission",
                    type: "nonrepeating", // nonrepeating || finite_repeating || calculated_repeating
                    timing: {
                        start_type: "dttm",
                        start: {
                            category: "dates",
                            duster_field_name: "hospital_admit_dttm",
                            label: "Hospital Admission Datetime"
                        },
                        start_based: "enroll_date",
                        end_type: "hours",
                        num_hours: 24,
                        end: null,
                        end_based: "enroll_date"
                    },
                    aggregate_defaults: {
                        min: false,
                        max: false,
                        first: false,
                        last: false,
                        closest_start: false,
                        closest_time: false,
                        closest_timestamp: "08:00:00"
                    },
                    data: {
                        labs_vitals: []
                    }
                },
                {
                    label: "First 24 Hours of First ICU Admission",
                    type: "nonrepeating", // nonrepeating || finite_repeating || calculated_repeating
                    timing: {
                        start_type: "dttm",
                        start: {
                            category: "dates",
                            duster_field_name: "first_icu_admission_dttm",
                            label: "First ICU Admission Datetime"
                        },
                        start_based: "enroll_date",
                        end_type: "hours",
                        num_hours: 24,
                        end: null,
                        end_based: "enroll_date"
                    },
                    aggregate_defaults: {
                        min: false,
                        max: false,
                        first: false,
                        last: false,
                        closest_start: false,
                        closest_time: false,
                        closest_timestamp: "08:00:00"
                    },
                    data: {
                        labs_vitals: []
                    }
                }
            ],
            review_id_headers: [
                {text: 'Label', value: 'label', sortable: false},
                {text: 'REDCap field name', value: 'redcap_field_name', sortable: false},
                {text: 'Format', value: 'format', sortable: false}
            ],
            review_date_headers: [
                {text: 'Label', value: 'label'},
                {text: 'REDCap field name', value: 'redcap_field_name'},
                {text: 'Format', value: 'format'}
            ],
            review_demo_headers: [
                {text: 'Label', value: 'label'},
                {text: 'REDCap field name', value: 'redcap_field_name'},
            ],
            review_cw_headers: [
                {text: 'Label', value: 'label'},
                {text: 'REDCap field name', value: 'redcap_field_name'}
            ],
            rules: {
                required: value => !!value || 'Required.',
                num_instances: value => value > 1 || 'Number of instances must be greater than 1.'
            },
          save_error: null
        },
        computed: {
            config: {
                get: function() {
                    let config = {
                        rp_info: {
                            rp_identifiers: [
                                {
                                    redcap_field_name: "mrn",
                                    label: "Medical Record Number (MRN)",
                                    format: "text"
                                }
                            ],
                            rp_dates: {}
                        },
                        demographics: [],
                        collection_windows: []
                    };

                    // Researcher-Provided Dates
                    let datesArr = [];
                    this.rp_dates.forEach((date) => {
                        datesArr.push([date.redcap_field_name, {
                                redcap_field_name: date.redcap_field_name,
                                label: date.label,
                                format: date.format
                        }]);
                    });
                    config.rp_info.rp_dates = Object.fromEntries(datesArr);

                    // demographics
                    this.demographics.selected.forEach((demographic) => {
                       config.demographics.push({
                           duster_field_name: demographic.duster_field_name,
                           redcap_field_name: demographic.redcap_field_name,
                           label: demographic.label,
                           format: "text"
                       });
                    });

                    // data collection windows
                    let cwArr = [];
                    this.collection_windows.forEach((window, index) => {
                        let newCW = {
                            label: window.label,
                            form_name: this.getFormName(window.label, cwArr.map(value => value.form_name)),
                            type: window.type,
                            timing: {
                            },
                            data: {
                                labs: [],
                                vitals: []
                            }
                        };

                        let timing = window.timing;
                        if(window.type === "nonrepeating") {

                            // get the DUSTER field name for the start parameter for timing
                            let startDusterField = timing.start !== null && timing.start.hasOwnProperty('duster_field_name') ? timing.start.duster_field_name : null;

                            // get the REDCap field name for the start and end parameters for timing
                            let startRCField = 'cw' + index + '_start_dttm';
                            /*
                            let suffixNum;
                            if(this.checkRCFieldExists(startRCField)) {
                                suffixNum = 0;
                                while(this.checkRCFieldExists(startRCField + '_' + suffixNum)) {
                                    suffixNum++;
                                }
                                startRCField = startRCField + '_' + suffixNum;
                            }
                            // console.log(startRCField);
                             */

                            // get the rp_date for the start parameter for timing
                            let startRPDate = startDusterField !== null ? timing.start_based : timing.start.redcap_field_name;

                            // get the REDCap label for the start parameter for timing
                            let startLabel = timing.start.label;
                            if(timing.start_type === 'date' || timing.start.format === 'date') {
                                startLabel = '00:00:00 on the Calendar Day of ' + timing.start.label;
                            }

                            // get the DUSTER field name for the end parameter for timing
                            let endDusterField = timing.end !== null && timing.end.hasOwnProperty("duster_field_name") ? timing.end.duster_field_name : null;

                            // get the REDCap field name for the end parameter for timing
                            let endRCField = 'cw' + index + '_end_dttm';
                            /*
                            if(this.checkRCFieldExists(endRCField)) {
                                suffixNum = 0;
                                while(this.checkRCFieldExists(endRCField + '_' + suffixNum)) {
                                    suffixNum++;
                                }
                                endRCField = endRCField + '_' + suffixNum;
                            }
                            // console.log(endRCField);
                             */

                            // get the rp_date for the end parameter for timing
                            let endRPDate = null;
                            if(timing.end_type === 'dttm') {
                                endRPDate = endDusterField !== null ? timing.end_based : timing.end.redcap_field_name;
                            }

                            // get the REDCap label for the end parameter for timing
                            let endLabel = "";
                            if(timing.end_type === 'dttm') {
                                if(timing.end.format === 'date') {
                                    endLabel = 'Midnight on the Calendar Day of ' + timing.end.label;
                                } else {
                                    endLabel = timing.end.label;
                                }
                            } else if(timing.end_type === 'day') {
                                endLabel = 'Midnight on the Calendar Day of ' + timing.start.label;
                            } else if(timing.end_type === 'hours') {
                                endLabel = timing.num_hours + ' hours after ' + startLabel;
                            }

                            let timingObj = {
                                start: {
                                    type: timing.start_type,
                                    duster_field_name: startDusterField,
                                    redcap_field_name: startRCField,
                                    // based_on: timing.start_based,
                                    rp_date: startRPDate,
                                    label: startLabel
                                },
                                end: {
                                    type: timing.end_type,
                                    num_hours: timing.num_hours,
                                    duster_field_name: endDusterField,
                                    redcap_field_name: endRCField,
                                    // based_on: timing.end_based,
                                    rp_date: endRPDate,
                                    label: endLabel
                                }
                            };
                            newCW.timing = timingObj;
                        }

                        // labs and vitals
                        let lvArr = window.data.labs_vitals;
                        lvArr.forEach((item) => {
                            // create a new field for each aggregate
                            let itemArr = [];
                            let rcField = '';
                            // let suffixNum = 0;
                            let aggregates = window.aggregate_defaults;
                            if(item.aggregates.default === false) {
                                aggregates = item.aggregates;
                            }

                            // minimum aggregate
                            if(aggregates.min === true) {
                                rcField = item.duster_field_name + '_min_' + index;
                                /*
                                if(this.checkRCFieldExists(rcField)) {
                                    suffixNum = 0;
                                    while(this.checkRCFieldExists(rcField + '_' + suffixNum)) {
                                        suffixNum++;
                                    }
                                    rcField = rcField + '_' + suffixNum;
                                }
                                // console.log(rcField);
                                 */

                                itemArr.push({
                                    duster_field_name: item.duster_field_name,
                                    redcap_field_name: rcField,
                                    label: 'Minimum ' + item.label,
                                    format: "text",
                                    aggregate: "min_agg"
                                });
                            }

                            // maximum aggregate
                            if(aggregates.max === true) {
                                rcField = item.duster_field_name + '_max_' + index;
                                /*
                                if(this.checkRCFieldExists(rcField)) {
                                    suffixNum = 0;
                                    while(this.checkRCFieldExists(rcField + '_' + suffixNum)) {
                                        suffixNum++;
                                    }
                                    rcField = rcField + '_' + suffixNum;
                                }
                                // console.log(rcField);
                                 */

                                itemArr.push({
                                    duster_field_name: item.duster_field_name,
                                    redcap_field_name: rcField,
                                    label: 'Maximum ' + item.label,
                                    format: "text",
                                    aggregate: "max_agg"
                                });
                            }

                            // first aggregate
                            if(aggregates.first === true) {
                                rcField = item.duster_field_name + '_first_' + index;
                                /*
                                if(this.checkRCFieldExists(rcField)) {
                                    suffixNum = 0;
                                    while(this.checkRCFieldExists(rcField + '_' + suffixNum)) {
                                        suffixNum++;
                                    }
                                    rcField = rcField + '_' + suffixNum;
                                }
                                // console.log(rcField);
                                 */

                                itemArr.push({
                                    duster_field_name: item.duster_field_name,
                                    redcap_field_name: rcField,
                                    label: 'First ' + item.label,
                                    format: "text",
                                    aggregate: "first_agg"
                                });
                            }

                            // last aggregate
                            if(aggregates.last === true) {
                                rcField = item.duster_field_name + '_last_' + index;
                                /*
                                if(this.checkRCFieldExists(rcField)) {
                                    suffixNum = 0;
                                    while(this.checkRCFieldExists(rcField + '_' + suffixNum)) {
                                        suffixNum++;
                                    }
                                    rcField = rcField + '_' + suffixNum;
                                }
                                // console.log(rcField);
                                */


                                itemArr.push({
                                    duster_field_name: item.duster_field_name,
                                    redcap_field_name: rcField,
                                    label: 'Last ' + item.label,
                                    format: "text",
                                    aggregate: "last_agg"
                                });
                            }

                            // closest to start datetime aggregate
                            if(aggregates.closest_start === true) {
                                // TODO
                            }

                            // closest to a specific time aggregate
                            if(aggregates.closest_time === true) {
                                // TODO
                            }


                            if(item.category === 'labs') {
                                newCW.data.labs.push(...itemArr);
                            } else {
                                newCW.data.vitals.push(...itemArr);
                            }

                        });

//                        console.log(newCW);
                        cwArr.push(newCW);
                    });

                    // set cwArr to this.config's collection windows
                    config.collection_windows = cwArr;
                    return config;
                }
            },
            rp_dates_arr: function() {
                return this.rp_dates.map(value => value.label);
            },
            rp_dates_rcfields: function() {
                return this.rp_dates.map(value => value.redcap_field_name);
            },
            window_dates: function() {
                // let rp_dates_arr = this.rp_dates.map(value => value.label);
                // return this.clinical_dates.concat(rp_dates_arr);
                return this.clinical_dates.concat(this.rp_dates);
            },
            labs_vitals: function() {
                let labs_arr = this.labs;
                labs_arr.sort((a, b) => {return a.label.localeCompare(b.label)});
                labs_arr = [{header: "Labs"}].concat(labs_arr);

                let vitals_arr = this.vitals;
                vitals_arr.sort((a, b) => {return a.label.localeCompare(b.label)});
                vitals_arr = [{header: "Vitals"}].concat(vitals_arr);
                let labs_vitals_arr = labs_arr.concat([{divider: true}]);
                return labs_vitals_arr.concat(vitals_arr);
            }
        },
        mounted () {
            // form data initially entered by user on initial create new project page (/index.php?action=create)
            this.surveys_enabled = "<?php echo $_POST["surveys_enabled"]; ?>";
            this.repeatforms = "<?php echo $_POST["repeatforms"]; ?>";
            this.scheduling = "<?php echo $_POST["scheduling"]; ?>";
            this.randomization = "<?php echo $_POST["randomization"]; ?>";
            this.app_title = "<?php echo $_POST["app_title"]; ?>";
            this.purpose = "<?php echo $_POST["purpose"] ?>";
            this.project_pi_firstname = "<?php echo $_POST["project_pi_firstname"] ?>";
            this.project_pi_mi = "<?php echo $_POST["project_pi_mi"] ?>";
            this.project_pi_lastname = "<?php echo $_POST["project_pi_lastname"] ?>";
            this.project_pi_email = "<?php echo $_POST["project_pi_email"] ?>";
            this.project_pi_alias = "<?php echo $_POST["project_pi_alias"] ?>";
            this.project_irb_number = "<?php echo $_POST["project_irb_number"] ?>";
            this.purpose_other = "<?php echo $_POST["purpose_other"] ?>";
            this.project_note = "<?php echo $_POST["project_note"] ?>";
            this.projecttype = "<?php echo $_POST["projecttype"] ?>";
            this.repeatforms_chk = "<?php echo $_POST["repeatforms_chk"] ?>";
            this.project_template_radio = "<?php echo $_POST["project_template_radio"] ?>";

            // request metadata from STARR-API
          axios.get("<?php echo $module->getUrl("services/callMetadata.php"); ?>").then(response => {
                console.log(response.data);

                // add demographics
                for(const demographic of response.data.demographics) {
                    this.demographics.options.push(
                        {
                            label: demographic.label,
                            duster_field_name: demographic.duster_field_name,
                            redcap_field_name: demographic.duster_field_name
                        }
                    );
                }

                // add clinical dates
                this.clinical_dates = response.data.clinical_dates;

                // add labs
                for(const lab of response.data.labs) {
                    this.labs.push(
                        {
                            duster_field_name: lab.duster_field_name,
                            label: lab.label,
                            category: lab.category
                        }
                    );
                }

                // add vitals
                for(const vital of response.data.vitals) {
                    this.vitals.push(
                        {
                            duster_field_name: vital.duster_field_name,
                            label: vital.label,
                            category: vital.category
                        }
                    );
                }

                this.metadata_loaded = true;
            });
        },
        methods: {
            backStep() {
                if (this.step > 1) {
                    this.step -= 1;
                } else {
                    // TODO if on step 1, go back to the landing page (including passing form data back for project info)
                }
            },
            nextStep() {
                if (this.step < 4) {
                    this.step += 1;
                    if(this.step == 4) {
                        this.instruments = Array.from(Array(2 + this.config.collection_windows.length).keys());
                    }
                }

            },
            saveDateForm() {
                this.$refs.date_form.validate();
                this.new_date.id = this.rp_dates.length;
                this.rp_dates.push(this.new_date);
                this.resetDateForm();
            },
            resetDateForm() {
                this.new_date_dialog = false;
                this.new_date = {
                    id: null,
                    label: null,
                    redcap_field_name: null,
                    format: null
                };
                this.$refs.date_form.resetValidation();
            },
            editRPDate(id) {
                // console.log(id);
                // console.log(this.rp_dates.length);
                this.edit_date_index = this.rp_dates.findIndex((element) => element.id === id);
                this.edit_date = JSON.parse(JSON.stringify(this.rp_dates[this.edit_date_index]));
                this.edit_date_dialog = true;
            },
            saveEditRPDate() {
                this.$refs.edit_date_form.validate();
                this.$set(this.rp_dates, this.edit_date_index, JSON.parse(JSON.stringify(this.edit_date)));
                this.resetEditDateForm();
            },
            resetEditDateForm() {
                this.edit_date_dialog = false;
                this.edit_date_index = null;
                this.edit_date = {
                    id: null,
                    label: null,
                    redcap_field_name: null,
                    format: null
                };
                this.$refs.edit_date_form.resetValidation();
            },
            deleteRPDate() {
                this.rp_dates.splice(this.delete_date_index, 1);
                this.delete_date_index = null;
                this.delete_date_dialog = false;
            },
            toggleAllDemo() {
                if (this.demographics.selected.length != this.demographics.options.length) {
                    this.demographics.selected = this.demographics.options;
                } else {
                    this.demographics.selected = [];
                }
            },
            resetWindowType(window) {
                switch (window.type) {
                    case 'nonrepeating':
                        this.resetNonRepeat(window);
                        break;
                    case 'finite_repeating':
                        this.resetFiniteRepeat(window);
                        break;
                    case 'calculated_repeating':
                        this.resetCalculatedRepeat(window);
                        break;
                    default:
                        // TODO
                        break;
                }
            },
            resetNonRepeat(window) {
                window.timing = {
                    start_type: null,
                    start: null,
                    start_based: this.rp_dates[0].redcap_field_name,
                    end_type: null,
                    num_hours: null,
                    end: null,
                    end_based: this.rp_dates[0].redcap_field_name
                };
            },
            resetFiniteRepeat(window) {
                window.timing = {
                    type: null, // hours || days
                    num_hours: null, // number of hours when type is 'hours'
                    num_instances: null, // number of instances
                    start: null,
                    start_based: this.rp_dates[0].redcap_field_name
                };
            },
            resetCalculatedRepeat(window) {
                window.timing = {
                    type: null, // hours || days
                    num_hours: null, // number of hours when type is 'hours'
                    start: null,
                    start_based: this.rp_dates[0].redcap_field_name,
                    end: null,
                    end_based: this.rp_dates[0].redcap_field_name
                    /*
                    num_hours: null, // number of hours when type is 'hours'
                    start_dttm: null, // start date/datetime
                    start_based_dttm: "Study Enrollment Date", // required when start_dttm is based on a clinical date
                    end_dttm: null, // end date/datetime when applicable
                    end_based_dttm: "Study Enrollment Date" // required when end_dttm is based on a clinical date
                    */
                };
            },
            resetNonRepeatEnd(window) {
                window.timing.end = null;
                window.timing.end_based = this.rp_dates[0].redcap_field_name;
                if(window.timing.end_type !== 'hours') {
                    window.timing.num_hours = null;
                }
            },
            resetRepeat(window) {
                if(window.timing.type !== 'hours') {
                    window.timing.num_hours = null;
                }
                if(window.type !== 'calculated_repeating') {
                    window.timing.end = null;
                    window.timing.end_based = this.rp_dates[0].redcap_field_name;
                }
            },
            // checks if the entered REDCap Label already exists
            checkRCLabel(label) {
                let labels_arr = this.rp_dates.map(value => value.label);
                labels_arr = labels_arr.concat(this.clinical_dates);
                if (labels_arr.includes(label)) {
                    return 'Enter another label. This label is already used by a predefined clinical date or other researcher-provided date.';
                }
                return true;
            },
            // checks if the entered REDCap Label already exists when editing
            checkRCLabelEdit(label) {
                let labels_arr = this.rp_dates.map(value => value.label);
                labels_arr = labels_arr.concat(this.clinical_dates);
                if (labels_arr.includes(label) && label !== this.rp_dates[this.edit_date_index].label) {
                    return 'Enter another label. This label is already used by a predefined clinical date or other researcher-provided date.';
                }
                return true;
            },
            // checks if the entered REDCap Field already exists
            checkRCFieldName(field) {
                // check field is valid input
                if (!/^[a-z0-9_]+$/.test(field)) {
                    return 'ONLY lowercase letters, numbers, and underscores.';
                }
                let fields_arr = this.rp_dates.map(value => value.redcap_field_name);
                // TODO this needs to check all REDCap field names, not just what's in dates
                if (fields_arr.includes(field)) {
                    return 'Enter another field name. This field name is already taken.';
                }
                return true;
            },
            // checks if the entered REDCap Field already exists when editing
            checkRCFieldNameEdit(field) {
                // check field is valid input
                if (!/^[a-z0-9_]+$/.test(field)) {
                    return 'ONLY letters, numbers, and underscores.';
                }
                let fields_arr = this.rp_dates.map(value => value.redcap_field);
                // TODO this needs to check all REDCap field names, not just what's in dates
                if (fields_arr.includes(field) && field !== this.rp_dates[this.edit_date_index].redcap_field_name) {
                    return 'Enter another field name. This field name is already taken.';
                }
                return true;
            },
            // checks if the entered REDCap instrument name already exists
            checkInstrName(name) {
                let names_arr = this.collection_windows.map(value => value.label);
                names_arr = names_arr.concat(['Researcher-Provided Info', 'Demographics'])
                if (!names_arr.includes(name) ||
                    (this.window_edit === true && names_arr[this.edit_window_index] === name)) {
                    return true;
                } else {
                    return 'Enter another name. This name is already used by another data collection window or other REDCap Form DUSTER will create by default.';
                }
            },
            isValidTiming() {
                if (this.window.type === 'nonrepeating') {
                    return this.isValidNonRepeat();
                } else if (this.window.type === 'finite_repeating') {
                    return this.isValidFiniteRepeat();
                } else if (this.window.type === 'calculated_repeating') {
                    return this.isValidCalcRepeat();
                }
                return false;
            },
            // helper function
            // checks validity/completeness of a data collection window form's timing when type is 'nonrepeating'
            isValidNonRepeat() {
                // verify type is 'nonrepeating'
                if (this.window.type === 'nonrepeating') {
                    // check if start_dttm is a clinical window and start_based_dttm is a researcher-provided date
                    // or if start_dttm is a researcher-provided date/datetime
                    if (['date', 'dttm'].includes(this.window.timing.start_type)
                        && ((this.clinical_dates.includes(this.window.timing.start)
                                && this.rp_dates_rcfields.includes(this.window.timing.start_based))
                            || this.rp_dates.includes(this.window.timing.start))) {
                        // check this nonrepeating window's ending parameters
                        if ((this.window.timing.end_type === 'hours' && this.window.timing.num_hours > 0)
                            || this.window.timing.end_type === 'day') {
                            console.log("valid");
                            return true;
                        } else if (this.window.timing.end_type === 'dttm') {
                            if ((this.clinical_dates.includes(this.window.timing.end)
                                    && this.rp_dates_rcfields.includes(this.window.timing.end_based))
                                || this.rp_dates.includes(this.window.timing.end)) {
                                console.log("valid");
                                return true;
                            }
                        }
                    }
                }
                return false;
            },
            // helper function
            // checks validity/completeness of a data collection window form's timing when type is 'finite_repeating'
            isValidFiniteRepeat() {
                // verify type is 'finite_repeating'
                if (this.window.type === 'finite_repeating') {
                    // check number of instances > 1
                    if (this.window.timing.num_instances > 1) {
                        // check if start_dttm is a clinical window and start_based_dttm is a researcher-provided date
                        // or if start_dttm is a researcher-provided date/datetime
                        if ((this.clinical_dates.includes(this.window.timing.start)
                                && this.rp_dates_rcfields.includes(this.window.timing.start_based))
                            || this.rp_dates.includes(this.window.timing.start)) {
                            // check configuration for how instances will be repeated
                            if ((this.window.timing.type === 'hours' && this.window.timing.num_hours > 0)
                                || this.window.timing.type === 'days') {
                                return true;
                            }
                        }
                    }
                }
                return false;
            },
            // helper function
            // checks validity/completeness of a data collection window form's timing when type is 'calculated_repeating'
            isValidCalcRepeat() {
                // verify type is 'calculated_repeating'
                if (this.window.type === 'calculated_repeating') {
                    // check if start_dttm is a clinical window and start_based_dttm is a researcher-provided date
                    // or if start_dttm is a researcher-provided date/datetime
                    if ((this.clinical_dates.includes(this.window.timing.start)
                            && this.rp_dates_rcfields.includes(this.window.timing.start_based))
                        || this.rp_dates.includes(this.window.timing.start)) {
                        // check if end_dttm is a clinical window and end_based_dttm is a researcher-provided date
                        // or if end_dttm is a researcher-provided date/datetime
                        if ((this.clinical_dates.includes(this.window.timing.end)
                                && this.rp_dates_rcfields.includes(this.window.timing.end_based))
                            || this.rp_dates.includes(this.window.timing.end)) {
                            // check configuration for how instances will be repeated
                            if ((this.window.timing.type === 'hours' && this.window.timing.num_hours > 0)
                                || this.window.timing.type === 'days') {
                                return true;
                            }
                        }
                    }
                }
                return false;
            },
            // checks if the default aggregate needs to be set
            // returns true/false
            checkDefaultAgg(window) {
                let noDefaults = true;
                for (let aggregate in window.aggregate_defaults) {
                    if (window.aggregate_defaults[aggregate] === true) {
                        noDefaults = false;
                        break;
                    }
                }
                for (let i = 0; i < window.data.labs_vitals.length; i++) {
                    if (window.data.labs_vitals[i].aggregates.default === true
                        && noDefaults === true) {
                        return false;
                    }
                }
                return true;
            },
            editWindow(i) {
                this.pre_edit_window = JSON.parse(JSON.stringify(this.collection_windows[i]));
                this.window = Object.assign({}, this.window, JSON.parse(JSON.stringify(this.collection_windows[i])));
                this.edit_window_index = i;
                this.open_window_panel = null;
                this.window_edit = true;
                this.show_window_form = true;

                this.$refs.window_form.resetValidation();
                this.$refs.window_form.validate();
            },
            cancelEditWindow(i) {
                // this.edit_window_index = -1;
                this.collection_windows[i] = JSON.parse(JSON.stringify(this.pre_edit_window));
                this.pre_edit_window = Object.assign({}, this.pre_edit_window, null);
                this.edit_window_stepper = 1;
                this.show_window_form = false;
                this.$refs.window_form.resetValidation();
            },
            saveCollectionWindowForm() {
                // check if default aggregates are set if needed
                if (this.checkDefaultAgg(this.window)) {
                    // check if this is a new window to save or an existing window that's being edited
                    if(this.edit_window_index === -1) {
                        this.collection_windows.push(JSON.parse(JSON.stringify(this.window)));
                    } else {
                        this.collection_windows[this.edit_window_index] = JSON.parse(JSON.stringify(this.window));
                        this.edit_window_index = -1;
                        this.pre_edit_window = null;
                    }
                    this.resetWindow('window', 'window_form');
                    this.show_window_form = false;
                } else {
                    this.alert_default_agg = true;
                }
            },
            setPreset(preset_choice) {
                this.window = Object.assign({}, this.window, JSON.parse(JSON.stringify(preset_choice)));
                this.$refs["preset_window"].reset();
                this.$forceUpdate();
            },
            resetWindow(window, ref) {
                this[window] = JSON.parse(JSON.stringify({
                    label: null,
                    // type: null, // nonrepeating || finite_repeating || calculated_repeating
                    type: "nonrepeating", // nonrepeating || finite_repeating || calculated_repeating
                    timing: {  // changes depending on window's type
                        start_type: null,
                        start: null,
                        start_based: "enroll_date",
                        end_type: null,
                        num_hours: null,
                        end: null,
                        end_based: "enroll_date"
                    },
                    aggregate_defaults: {
                        min: false,
                        max: false,
                        first: false,
                        last: false,
                        closest_start: false,
                        closest_time: false,
                        closest_timestamp: "08:00:00"
                    },
                    data: {
                        labs_vitals: []
                    }
                }));
                this.alert_default_agg = false;
                this.window_stepper = 1;
                this.$refs[ref].resetValidation();
            },
            canAggStart() {
                if(this.window.type && this.window.timing.start) {
                    return this.window.type == 'nonrepeating';
                }
                return false;
            },
            canAggTime() {
                return this.window.start &&
                    ((this.window.type === 'nonrepeating' && this.window.timing.type === 'day') ||
                    ((this.window.type === 'finite_repeating' || this.window.timing.type === 'calculated_repeating') &&
                        (this.window.timing.type === 'day')));
            },
            addLV() {
                this.alert_lv_label = this.new_lv_obj.label;
                if (!this.window.data.labs_vitals.map(value => value.label).includes(this.new_lv_obj.label)) {
                    this.window.data.labs_vitals.push(JSON.parse(JSON.stringify({
                        duster_field_name: this.new_lv_obj.duster_field_name,
                        label: this.new_lv_obj.label,
                        category: this.new_lv_obj.category,
                        aggregates: {
                            default: true,
                            min: false,
                            max: false,
                            first: false,
                            last: false,
                            closest_start: false,
                            closest_time: false,
                            closest_timestamp: "08:00:00"
                        }
                    })));
                    this.alert_lv_success = true;
                } else {
                    this.alert_lv_error = true;
                }
                this.new_lv_obj = {
                    duster_field_name: null,
                    label: null,
                    category: null
                };
            },
            editLV(obj) {
                this.edit_lv_index = this.window.data.labs_vitals.indexOf(obj);
                this.edit_lv_obj = JSON.parse(JSON.stringify(obj));
                this.edit_lv_dialog = true;
            },
            confirmEditLV() {
                if (this.edit_lv_index !== null) {
                    Object.assign(this.window.data.labs_vitals[this.edit_lv_index], this.edit_lv_obj);
                }
                this.edit_lv_index = null;
                this.edit_lv_obj = {
                    duster_field_name: null,
                    label: null,
                    category: null,
                    aggregates: {
                        default: true,
                        min: false,
                        max: false,
                        first: false,
                        last: false,
                        closest_start: false,
                        closest_time: false,
                        closest_timestamp: "08:00:00"
                    }
                };
                this.closeEditLV();
            },
            closeEditLV() {
                this.edit_lv_dialog = false;
            },
            deleteLV(obj) {
                this.edit_lv_index = this.window.data.labs_vitals.indexOf(obj);
                this.delete_lv_dialog = true;
            },
            confirmDeleteLV() {
                this.window.data.labs_vitals.splice(this.edit_lv_index, 1);
                this.edit_lv_index = null;
                this.closeDeleteLV();
            },
            closeDeleteLV() {
                this.delete_lv_dialog = false;
            },
            deleteWindow(i) {
                this.collection_windows.splice(i, 1);
                this.delete_window_dialog = false;
                this.open_window_panel = null;
            },
            // checks if the given REDCap field name already exists in the config
            checkRCFieldExists(name, config) {
                // check Researcher-Provided Identifiers
                for(const id of this.config.rp_info.rp_identifiers) {
                    // console.log(id.redcap_field_name);
                    if(id.redcap_field_name === name) {
                        return true;
                    }
                }

                // check Researcher-Provided Dates
                for(const date in this.config.rp_info.rp_dates) {
                    // console.log(date.redcap_field_name);
                    if(date.redcap_field_name === name) {
                        return true;
                    }
                }

                // check demographics
                for(const demo in this.config.demographics) {
                    if(demo.redcap_field_name === name) {
                        return true;
                    }
                }

                // check clinical windows
                for(const window in this.config.collection_windows) {
                    // check timing parameters (start/end)
                    if([window.timing.start.redcap_field_name, window.timing.end.redcap_field_name].includes(name)) {
                        return true;
                    }

                    // check labs
                    for(const lab of window.data.labs) {
                        // console.log(lab.redcap_field_name);
                        if(lab.redcap_field_name === name) {
                            return true;
                        }
                    }

                    // check vitals
                    for(const vital of window.data.vitals) {
                        if(vital.redcap_field_name === name) {
                            return true;
                        }
                    }
                }
                return false;
            },
            getRCField(name) {
                return "";
            },
            getFormName(label, cwArr) {
                // remove whitespace at start and end and convert to lowercase characters only
                let formName = label.trim().toLowerCase();
                // replace spaces with underscore
                formName = formName.replaceAll(' ', '_');

                // remove illegal characters
                formName = formName.replaceAll(/[^a-z_0-9]/g, '');

                // remove any double underscores
                while(formName.indexOf('__') != -1) {
                    formName = formName.replaceAll('__', '_');
                }
                // remove beginning underscores
                while(formName.substring(0, 1) == '_') {
                    formName = formName.substring(1);
                }
                // remove ending underscores
                while(formName.substring(formName.length - 1) == '_') {
                    formName = formName.substring(0, formName.length - 1);
                }
                // remove beginning numerals
                while(/^\d$/g.test(formName.substring(0, 1))) {
                    formName = formName.substring(1);
                }
                // remove beginning underscores again
                while(formName.substring(0, 1) == '_') {
                    formName = formName.substring(1);
                }

                // ensure formName doesn't begin with a number and formName cannot be blank
                if(/^\d$/.test(formName.substring(0, 1)) || formName == '') {
                    // console.log("MD5");
                    formName = MD5.generate(formName).replaceAll(/[0-9]/g, '').substring(0, 4) + formName;
                }

                // if longer than 50 characters, substring formName to 50 characters
                formName = formName.substring(0, 50);

                // ensure formName doesn't already exist
                let formNamesArr = ['researcher_provided_information', 'demographics'].concat(cwArr);
                while(formNamesArr.includes(formName)) {
                    // substring formName to less than 50 characters in length
                    formName = formName.substring(0, 44);
                    // append random values to formName to prevent duplication
                    formName = formName + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString().substring(0, 6);
                    // formName = formName + CryptoJS.SHA1(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)).substring(0, 6);
                }

                return formName;
            },
            createProject() {
                let data = {
                    surveys_enabled: this.surveys_enabled,
                    repeatforms: this.repeatforms,
                    scheduling: this.scheduling,
                    randomization: this.randomization,
                    app_title: this.app_title,
                    // app_title: "project title",
                    purpose: this.purpose,
                    // purpose: 2,
                    project_pi_firstname: this.project_pi_firstname,
                    project_pi_mi: this.project_pi_mi,
                    project_pi_lastname: this.project_pi_lastname,
                    project_pi_email: this.project_pi_email,
                    project_pi_alias: this.project_pi_alias,
                    project_irb_number: this.project_irb_number,
                    purpose_other: this.purpose_other,
                    // purpose_other: 1,
                    project_note: this.project_note,
                    // project_note: "project notes go here",
                    projecttype: this.projecttype,
                    repeatforms_chk: this.repeatforms_chk,
                    project_template_radio: this.project_template_radio,
                    config: this.config
                };
                console.log(JSON.stringify(data, null, 2));

                let formData = new FormData();
                formData.append('redcap_csrf_token', "<?php echo $module->getCSRFToken(); ?>");
                formData.append('data', JSON.stringify(data));
                let self = this;

                // use services/importMetadata.php if project has already been created
                axios.post("<?php echo $module->getUrl("services/createProject.php"); ?>", formData)
                    .then(function(response) {
                        console.log("Response data: " + response.data);
                        if (response.data.indexOf('Uncaught Error') > -1 ||
                          response.data.indexOf('Error message') > -1) {
                            console.log("Found Error");
                            self.save_error = response.data;
                        } else {
                          window.location.href = response.data;
                        }
                    })
                    .catch(function(error) {
                        self.save_error=error.message;
                        console.log("Catch: " + error);
                    });
            }
        }
    })
</script>
</body>
</html>
