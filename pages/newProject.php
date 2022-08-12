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

                        <v-card
                            outlined
                            class="mt-4"
                        >
                            <v-card-subtitle><h1>Identifier</h1></v-card-subtitle>
                            <v-data-table
                                :headers="rp_id_headers"
                                :items="rp_identifier"
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
                                    <span>{{item.format}} [{{item.format=="date" ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:MM'}}]</span>
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
                                                        v-model="new_date.redcap_field"
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
                                                        v-model="edit_date.redcap_field"
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
                            >
                                <v-expansion-panel
                                    v-for="(window, i) in collection_windows"
                                    :key="i"
                                >
                                    <v-expansion-panel-header>
                                        {{window.instr_name}}
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <v-card-subtitle><h1>Collection Window: {{edit_window_index === i ? 'Editing' : 'View-Only'}}</h1></v-card-subtitle>

                                        <v-stepper
                                            v-model="edit_window_stepper"
                                            vertical
                                        >
                                            <v-stepper-step
                                                :complete="edit_window_stepper > 1"
                                                step="1"
                                                editable
                                            >
                                                {{edit_window_index === i ? 'Set ' : ''}}Timing
                                            </v-stepper-step>

                                            <v-stepper-content step="1">

                                                <v-form
                                                    :ref="'edit_window_form_' + i"
                                                    :readonly="edit_window_index !== i"
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
                                                                label="Presets"
                                                                v-show="edit_window_index === i"
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
                                                                v-model="window.instr_name"
                                                                :rules="[rules.required, checkInstrName]"
                                                                label="REDCap Instrument Name"
                                                                required
                                                            >
                                                            </v-text-field>
                                                        </v-col>
                                                    </v-row>

                                                    <!-- Is this data collection window repeatable (i.e., multiple instances)? -->
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
                                                                            v-model="window.params.num_instances"
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

                                                    <!-- When should this window start? -->
                                                    <v-radio-group
                                                        v-model="window.params.start_type"
                                                        label="When should this window start?"
                                                        v-show="window.type === 'nonrepeating'"
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

                                                    <!-- Start date/datetime input of data collection window -->
                                                    <v-row>
                                                        <v-col
                                                            cols="4"
                                                        >
                                                            <v-select
                                                                v-model="window.params.start_dttm"
                                                                :items="window_dates"
                                                                label="Date/Datetime of Interest"
                                                                v-show="window.type"
                                                            >
                                                            </v-select>
                                                        </v-col>
                                                        <v-col
                                                            cols="4"
                                                            v-show="clinical_dates.includes(window.params.start_dttm)"
                                                        >
                                                            <v-select
                                                                v-model="window.params.start_based_dttm"
                                                                label="based on"
                                                                :items="rp_dates_arr"
                                                            >
                                                            </v-select>
                                                        </v-col>
                                                    </v-row>

                                                    <!-- When should this window end? -->
                                                    <!-- Show only for nonrepeating windows -->
                                                    <v-radio-group
                                                        v-model="window.params.type"
                                                        label="When should this window end?"
                                                        @change="resetNonRepeatEnd(window)"
                                                        v-show="window.type === 'nonrepeating' && window.params.start_dttm"
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
                                                                        This window ends
                                                                    </v-col>
                                                                    <v-col
                                                                        class="pr-1"
                                                                        sm="1"
                                                                        cols="1"
                                                                    >
                                                                        <v-text-field
                                                                            v-model="window.params.num_hours"
                                                                            dense
                                                                            type="number"
                                                                            min="1"
                                                                        >
                                                                        </v-text-field>
                                                                    </v-col>
                                                                    <v-col
                                                                        cols="auto"
                                                                    >
                                                                        hour(s) after the {{window.params.start_dttm}}.
                                                                    </v-col>
                                                                </v-row>
                                                            </template>
                                                        </v-radio>
                                                        <v-radio
                                                            value="day"
                                                        >
                                                            <template v-slot:label>
                                                                This window ends on 23:59 on the same calendar date of the {{window.params.start_dttm}}.
                                                            </template>
                                                        </v-radio>
                                                        <v-radio
                                                            label="This window ends based on a specified date/datetime."
                                                            value="dttm"
                                                        >
                                                        </v-radio>
                                                    </v-radio-group>

                                                    <!-- How should this data collection window be repeated? -->
                                                    <!-- Show only for repeating windows -->
                                                    <v-radio-group
                                                        v-model="window.params.type"
                                                        label="How should this data collection window be repeated?"
                                                        @change="resetRepeat(window)"
                                                        v-show="['finite_repeating', 'calculated_repeating'].includes(window.type)"
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
                                                                            v-model="window.params.num_hours"
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
                                                                v-model="window.params.end_dttm"
                                                                :items="window_dates"
                                                                label="End date/datetime"
                                                                v-show="
                                                (window.type === 'nonrepeating' && window.params.type === 'dttm')
                                                || window.type === 'calculated_repeating'
                                               "
                                                            >
                                                            </v-select>
                                                        </v-col>
                                                        <v-col
                                                            cols="4"
                                                        >
                                                            <v-select
                                                                v-model="window.params.end_based_dttm"
                                                                label="based on"
                                                                :items="rp_dates_arr"
                                                                v-show="clinical_dates.includes(window.params.end_dttm)"
                                                            >
                                                            </v-select>
                                                        </v-col>
                                                    </v-row>
                                                    <v-btn
                                                        v-show="edit_window_index === i"
                                                        color="error"
                                                        type="reset"
                                                        @click="resetWindow(collection_windows[i], 'edit_window_form_' + i)"
                                                    >
                                                        Reset Timing
                                                    </v-btn>
                                                </v-form>
                                            </v-stepper-content>

                                            <v-stepper-step
                                                step="2"
                                                editable
                                            >
                                                {{edit_window_index === i ? 'Add ' : ''}}Clinical Data
                                            </v-stepper-step>

                                            <v-stepper-content step="2">
                                                <!-- aggregate defaults -->
                                                <v-row>
                                                    <v-col>
                                                        <v-card outlined>
                                                            <v-card-title>Set Default Aggregates</v-card-title>
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
                                                                    >
                                                                        <v-checkbox
                                                                            v-model="window.aggregate_defaults.max"
                                                                            dense
                                                                            label="Max"
                                                                        >
                                                                        </v-checkbox>
                                                                    </v-col>
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
                                                                </v-row>
                                                                <v-row
                                                                    no-gutters
                                                                >
                                                                    <v-col
                                                                        cols="4"
                                                                    >
                                                                        <v-checkbox
                                                                            v-model="window.aggregate_defaults.closest_start"
                                                                            dense
                                                                            :label="`Closest to ${window.params.start_dttm}`"
                                                                            v-show="canAggStart()"
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
                                                                            v-show="canAggTime()"
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
                                                                                                :label="`Closest to ${window.params.start_dttm}`"
                                                                                                v-show="canAggStart()"
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
                                                                                                v-show="canAggTime()"
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
                                                                                    Closest to {{new_window.params.start_dttm}}
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
                                                        @click="saveEditWindow()"
                                                    >
                                                        Save Edit
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
                                            v-show="edit_window_index === i"
                                        >
                                            <v-btn
                                                color="secondary"
                                                @click="cancelEditWindow(i)"
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
                            <!-- Create a New Data Collection Window -->
                            <v-card
                                v-show="!collection_windows.length || show_window_form == true"
                                outlined
                            >
                                <v-card-subtitle><h1>Create a New Data Collection Window</h1></v-card-subtitle>

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
                                                        v-model="new_window.instr_name"
                                                        :rules="[rules.required, checkInstrName]"
                                                        label="REDCap Instrument Name"
                                                        required
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                            </v-row>

                                            <!-- Is this data collection window repeatable (i.e., multiple instances)? -->
                                            <v-radio-group
                                                v-model="new_window.type"
                                                @change="resetWindowType(new_window)"
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
                                                                    v-model="new_window.params.num_instances"
                                                                    :rules="new_window.type === 'finite_repeating' ? [rules.required, rules.num_instances] : []"
                                                                    :required="new_window.type === 'finite_repeating'"
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

                                            <!-- When should this window start? -->
                                            <v-radio-group
                                                v-model="new_window.params.start_type"
                                                label="When should this window start?"
                                                v-show="new_window.type === 'nonrepeating'"
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

                                            <!-- Start date/datetime input of data collection window -->
                                            <v-row>
                                                <v-col
                                                    cols="4"
                                                >
                                                    <v-select
                                                        v-model="new_window.params.start_dttm"
                                                        :items="window_dates"
                                                        label="Date/Datetime of Interest"
                                                        v-show="new_window.type"
                                                    >
                                                    </v-select>
                                                </v-col>
                                                <v-col
                                                    cols="4"
                                                    v-show="clinical_dates.includes(new_window.params.start_dttm)"
                                                >
                                                    <v-select
                                                        v-model="new_window.params.start_based_dttm"
                                                        label="based on"
                                                        :items="rp_dates_arr"
                                                    >
                                                    </v-select>
                                                </v-col>
                                            </v-row>

                                            <!-- When should this window end? -->
                                            <!-- Show only for nonrepeating windows -->
                                            <v-radio-group
                                                v-model="new_window.params.type"
                                                label="When should this window end?"
                                                @change="resetNonRepeatEnd(new_window)"
                                                v-show="new_window.type === 'nonrepeating' && new_window.params.start_dttm"
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
                                                                This window ends
                                                            </v-col>
                                                            <v-col
                                                                class="pr-1"
                                                                sm="1"
                                                                cols="1"
                                                            >
                                                                <v-text-field
                                                                    v-model="new_window.params.num_hours"
                                                                    dense
                                                                    type="number"
                                                                    min="1"
                                                                >
                                                                </v-text-field>
                                                            </v-col>
                                                            <v-col
                                                                cols="auto"
                                                            >
                                                                hour(s) after the {{new_window.params.start_dttm}}.
                                                            </v-col>
                                                        </v-row>
                                                    </template>
                                                </v-radio>
                                                <v-radio
                                                    value="day"
                                                >
                                                    <template v-slot:label>
                                                        This window ends on 23:59 on the same calendar date of the {{new_window.params.start_dttm}}.
                                                    </template>
                                                </v-radio>
                                                <v-radio
                                                    label="This window ends based on a specified date/datetime."
                                                    value="dttm"
                                                >
                                                </v-radio>
                                            </v-radio-group>

                                            <!-- How should this data collection window be repeated? -->
                                            <!-- Show only for repeating windows -->
                                            <v-radio-group
                                                v-model="new_window.params.type"
                                                label="How should this data collection window be repeated?"
                                                @change="resetRepeat(new_window)"
                                                v-show="['finite_repeating', 'calculated_repeating'].includes(new_window.type)"
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
                                                                    v-model="new_window.params.num_hours"
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
                                                        v-model="new_window.params.end_dttm"
                                                        :items="window_dates"
                                                        label="End date/datetime"
                                                        v-show="
                                                (new_window.type === 'nonrepeating' && new_window.params.type === 'dttm')
                                                || new_window.type === 'calculated_repeating'
                                               "
                                                    >
                                                    </v-select>
                                                </v-col>
                                                <v-col
                                                    cols="4"
                                                >
                                                    <v-select
                                                        v-model="new_window.params.end_based_dttm"
                                                        label="based on"
                                                        :items="rp_dates_arr"
                                                        v-show="clinical_dates.includes(new_window.params.end_dttm)"
                                                    >
                                                    </v-select>
                                                </v-col>
                                            </v-row>
                                        <v-btn
                                            color="error"
                                            type="reset"
                                            @click="resetWindow(new_window, 'new_window_form')"
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
                                                                    v-model="new_window.aggregate_defaults.min"
                                                                    dense
                                                                    label="Min"
                                                                >
                                                                </v-checkbox>
                                                            </v-col>
                                                            <v-col
                                                                cols="1"
                                                            >
                                                                <v-checkbox
                                                                    v-model="new_window.aggregate_defaults.max"
                                                                    dense
                                                                    label="Max"
                                                                >
                                                                </v-checkbox>
                                                            </v-col>
                                                            <v-col
                                                                cols="1"
                                                            >
                                                                <v-checkbox
                                                                    v-model="new_window.aggregate_defaults.first"
                                                                    dense
                                                                    label="First"
                                                                >
                                                                </v-checkbox>
                                                            </v-col>
                                                            <v-col
                                                                cols="1"
                                                            >
                                                                <v-checkbox
                                                                    v-model="new_window.aggregate_defaults.last"
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
                                                                cols="4"
                                                            >
                                                                <v-checkbox
                                                                    v-model="new_window.aggregate_defaults.closest_start"
                                                                    dense
                                                                    :label="`Closest to ${new_window.params.start_dttm}`"
                                                                    v-show="canAggStart()"
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
                                                                    v-model="new_window.aggregate_defaults.closest_time"
                                                                    dense
                                                                    v-show="canAggTime()"
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
                                                                                    v-model="new_window.aggregate_defaults.closest_timestamp"
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
                                                                                        :label="`Closest to ${new_window.params.start_dttm}`"
                                                                                        v-show="canAggStart()"
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
                                                                                        v-show="canAggTime()"
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
                                                                    :items="new_window.data.labs_vitals"
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
                                                                            Closest to {{new_window.params.start_dttm}}
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
                                        @click="show_window_form = false, resetWindow(new_window, 'new_window_form')"
                                    >
                                        Cancel
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                            <v-btn
                                color="primary"
                                @click="open_window_panel = null, show_window_form = true"
                                v-show="!show_window_form && collection_windows.length > 0 && edit_window_index === -1"
                            >
                                Add New Data Collection Window
                            </v-btn>
                        </v-card>




                    </v-stepper-content>

                    <v-stepper-content step="4">
                        <v-btn
                            color="secondary"
                            class="mb-4"
                        >
                            {{ instruments.length > 0 ? 'Collapse all instruments' : 'Expand all instruments'}}

                        </v-btn>

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
                                        :items="rp_identifier"
                                        item-key="label"
                                        fixed-header
                                        dense
                                        hide-default-footer
                                    ></v-data-table>
                                </v-card>
                                <v-card
                                    outlined
                                    class="mb-4"
                                >
                                    <v-card-subtitle><h2>Dates</h2></v-card-subtitle>
                                    <v-data-table
                                        :headers="review_date_headers"
                                        :items="rp_dates"
                                        item-key="label"
                                        fixed-header
                                        dense
                                        hide-default-footer
                                    >
                                        <template v-slot:item.format="{ item }">
                                            <span>{{item.format}} [{{item.format=="date" ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:MM'}}]</span>
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
                                        :items="demographics.selected"
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

                            <h1>Clinical Data</h1>
                            Clinical data goes here

                        </v-expansion-panels>

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
            edit_window_stepper: 1,
            review_window_stepper: 1,
            window_stepper: 1,
            dialog: false,
            rp_identifier: [
                {
                    label: "MRN",
                    redcap_field: "mrn",
                    format: "8-digit number (including leading zeros, e.g., '01234567')"
                }
            ],
            rp_id_headers: [
                {text: 'Label', value: 'label'},
                {text: 'REDCap field name', value: 'redcap_field'},
                {text: 'Format', value: 'format'}
            ],
            rp_dates: [
                {
                    id: 0,
                    label: "Study Enrollment Date",
                    redcap_field: "enroll_date",
                    format: "date"
                }
            ],
            rp_date_headers: [
                {text: 'Label', value: 'label'},
                {text: 'REDCap field name', value: 'redcap_field'},
                {text: 'Format', value: 'format'},
                {text: 'Actions', value: 'actions', sortable: false}
            ],
            new_date: {
                id: null,
                label: null,
                redcap_field: null,
                format: null
            },
            edit_date: {
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
            collection_windows: [
            ],
            new_window: {
                instr_name: null,
                type: null, // nonrepeating || finite_repeating || calculated_repeating
                params: {},  // params change depending on new_window's type
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
            new_window: {
                instr_name: null,
                type: null, // nonrepeating || finite_repeating || calculated_repeating
                params: {},  // params change depending on new_window's type
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
            lv_headers: [
                {text: 'Label', value: 'label'},
                {text: 'Aggregates', value: 'aggregates', sortable: false},
                {text: 'Actions', value: 'actions', sortable: false}
            ],
            new_lv_obj : {
                label: null,
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
            preset_windows: [
                {
                    text: "ED Presentation to ED Discharge",
                    value: {
                        instr_name: "ED Presentation to ED Discharge",
                        type: "nonrepeating",
                        params: {
                            type: "dttm", // hours || day || dttm
                            num_hours: null, // number of hours when type is hours
                            start_type: "dttm", // dttm || date
                            start_dttm: "ED Presentation Datetime", // start date/datetime
                            start_based_dttm: "Study Enrollment Date", // required when start_dttm is based on a clinical date
                            end_dttm: "ED Discharge Datetime", // end date/datetime when applicable
                            end_based_dttm: "Study Enrollment Date" // required when end_dttm is based on a clinical date
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
                },
                {
                    text: "First 24 Hours of Hospital Presentation",
                    value: {
                        instr_name: "First 24 Hours of Hospital Presentation",
                        type: "nonrepeating",
                        params: {
                            type: "hours", // hours || day || dttm
                            num_hours: 24, // number of hours when type is hours
                            start_type: "dttm", // date || dttm
                            start_dttm: "Hospital Presentation Datetime", // start date/datetime
                            start_based_dttm: "Study Enrollment Date", // required when start_dttm is based on a clinical date
                            end_dttm: null, // end date/datetime when applicable
                            end_based_dttm: "Study Enrollment Date" // required when end_dttm is based on a clinical date
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
                },
                {
                    text: "First 24 Hours of First ICU Admission",
                    value: {
                        instr_name: "First 24 Hours of First ICU Admission",
                        type: "nonrepeating",
                        params: {
                            type: "hours", // hours || day || dttm
                            num_hours: 24, // number of hours when type is hours
                            start_type: "dttm", // date || dttm
                            start_dttm: "First ICU Admission Datetime", // start date/datetime
                            start_based_dttm: "Study Enrollment Date", // required when start_dttm is based on a clinical date
                            end_dttm: null, // end date/datetime when applicable
                            end_based_dttm: "Study Enrollment Date" // required when end_dttm is based on a clinical date
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
                },
                {
                    text: "Inpatient Calendar Days",
                    value: {
                        instr_name: "Inpatient Calendar Days",
                        type: "calculated_repeating",
                        params: {
                            type: "days", // hours || days
                            num_hours: null, // number of hours when type is 'hours'
                            start_dttm: "Hospital Admission Datetime", // start date/datetime
                            start_based_dttm: "Study Enrollment Date", // required when end_dttm is based on a clinical date
                            end_dttm: "Hospital Discharge Datetime", // end date/datetime when applicable
                            end_based_dttm: "Study Enrollment Date" // required when end_dttm is based on a clinical date
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
                },
                {
                    text: "ICU Calendar Days",
                    value: {
                        instr_name: "ICU Calendar Days",
                        type: "calculated_repeating",
                        params: {
                            type: "days", // hours || days
                            num_hours: null, // number of hours when type is 'hours'
                            start_dttm: "First ICU Admission Datetime", // start date/datetime
                            start_based_dttm: "Study Enrollment Date", // required when end_dttm is based on a clinical date
                            end_dttm: "First ICU Discharge Datetime", // end date/datetime when applicable
                            end_based_dttm: "Study Enrollment Date" // required when end_dttm is based on a clinical date
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
                }
            ],
            review_id_headers: [
                {text: 'Label', value: 'label', sortable: false},
                {text: 'REDCap field name', value: 'redcap_field', sortable: false},
                {text: 'Format', value: 'format', sortable: false}
            ],
            review_date_headers: [
                {text: 'Label', value: 'label'},
                {text: 'REDCap field name', value: 'redcap_field'},
                {text: 'Format', value: 'format'}
            ],
            review_demo_headers: [
                {text: 'Label', value: 'label'},
                {text: 'REDCap field name', value: 'redcap_field'},
            ],
            rules: {
                required: value => !!value || 'Required.',
                num_instances: value => value > 1 || 'Number of instances must be greater than 1.'
            }
        },
        computed: {
            //
            instruments: function() {
                let instr_arr = [0, 1];
                // TODO indexes for clinical data instruments
                return instr_arr;
            },
            rp_dates_arr: function() {
                return this.rp_dates.map(value => value.label);
            },
            window_dates: function() {
                let rp_dates_arr = this.rp_dates.map(value => value.label);
                return this.clinical_dates.concat(rp_dates_arr);
            },
            labs: function() {
              let labs_arr = [
                  {
                      label: "White Blood Count (WBC)"
                  },
                  {
                      label: "Red Blood Cells (RBC)"
                  },
                  {
                      label: "Lymphocyte Count"
                  },
                  {
                      label: "Platelets"
                  },
                  {
                      label: "Hematocrit (Hct)"
                  },
                  {
                      label: "Hemoglobin (Hgb)"
                  },
                  {
                      label: "Hemoglobin A1C (HbA1c)"
                  },
                  {
                      label: "Glucose (Glu)"
                  },
                  {
                      label: "Albumin"
                  },
                  {
                      label: "Calcium (Ca)"
                  },
                  {
                      label: "Sodium (Na)"
                  },
                  {
                      label: "Creatinine (Cr)"
                  },
                  {
                      label: "Potassium (K)"
                  },
                  {
                      label: "Chloride (Cl)"
                  },
                  {
                      label: "Blood Urea Nitrogen (BUN)"
                  }
              ];
                labs_arr.sort((a, b) => {return a.label.localeCompare(b.label)});
                return [{header: "Labs"}].concat(labs_arr);
            },
            vitals: function() {
                let vitals_arr = [
                    {
                        label: "Heart Rate (beats per minute)"
                    },
                    {
                        label: "Temperature (Celsius)"
                    },
                    {
                        label: "Respiratory Rate (RR)"
                    },
                    {
                        label: "Mean Arterial Pressure (MAP)"
                    },
                    {
                        label: "Systolic Blood Pressure (SBP)"
                    }
                ];
                vitals_arr.sort((a, b) => {return a.label.localeCompare(b.label)});
                return [{header: "Vitals"}].concat(vitals_arr);
            },
            labs_vitals: function() {
                let labs_vitals_arr = this.labs.concat([{divider: true}]);
                return labs_vitals_arr.concat(this.vitals);
            }
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
                    redcap_field: null,
                    format: null
                };
                this.$refs.date_form.resetValidation();
            },
            editRPDate(id) {
                console.log(id);
                console.log(this.rp_dates.length);
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
                    redcap_field: null,
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
                window.params = {
                    type: null, // hours || day || dttm
                    num_hours: null, // number of hours when type is hours
                    start_type: null, // dttm || date
                    start_dttm: null, // start date/datetime
                    start_based_dttm: "Study Enrollment Date", // required when start_dttm is based on a clinical date
                    end_dttm: null, // end date/datetime when applicable
                    end_based_dttm: "Study Enrollment Date" // required when end_dttm is based on a clinical date
                };
            },
            resetFiniteRepeat(window) {
                window.params = {
                    type: null, // hours || days
                    num_hours: null, // number of hours when type is 'hours'
                    num_instances: null, // number of instances when window_type = 'finite_repeating'
                    start_dttm: null, // start date/datetime
                    start_based_dttm: "Study Enrollment Date", // required when start_dttm is based on a clinical date
                }
            },
            resetCalculatedRepeat(window) {
                window.params = {
                    type: null, // hours || days
                    num_hours: null, // number of hours when type is 'hours'
                    start_dttm: null, // start date/datetime
                    start_based_dttm: "Study Enrollment Date", // required when end_dttm is based on a clinical date
                    end_dttm: null, // end date/datetime when applicable
                    end_based_dttm: "Study Enrollment Date" // required when end_dttm is based on a clinical date
                }
            },
            resetNonRepeatEnd(window) {
                window.params.num_hours = null;
                window.params.end_dttm = null;
                window.params.end_based_dttm = "Study Enrollment Date";
            },
            resetRepeat(window) {
                window.params.num_hours = null;
                if (window.type === 'calculated_repeating') {
                    window.params.end_dttm = null;
                    window.params.end_based_dttm = "Study Enrollment Date";
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
                if (!/^\w+$/.test(field)) {
                    return 'ONLY letters, numbers, and underscores.';
                }
                let fields_arr = this.rp_dates.map(value => value.redcap_field);
                // TODO this needs to check all REDCap field names, not just what's in dates
                if (fields_arr.includes(field)) {
                    return 'Enter another field name. This field name is already taken.';
                }
                return true;
            },
            // checks if the entered REDCap Field already exists when editing
            checkRCFieldNameEdit(field) {
                // check field is valid input
                if (!/^\w+$/.test(field)) {
                    return 'ONLY letters, numbers, and underscores.';
                }
                let fields_arr = this.rp_dates.map(value => value.redcap_field);
                // TODO this needs to check all REDCap field names, not just what's in dates
                if (fields_arr.includes(field) && field !== this.rp_dates[this.edit_date_index].redcap_field) {
                    return 'Enter another field name. This field name is already taken.';
                }
                return true;
            },
            // checks if the entered REDCap instrument name already exists
            checkInstrName(name) {
                let names_arr = this.collection_windows.map(value => value.instr_name);
                names_arr = names_arr.concat(['Identifiers', 'Researcher-Provided Info', 'Demographics'])
                if (names_arr.includes(name)) {
                    return 'Enter another name. This name is already used by another data collection window or other REDCap Instrument DUSTER will create by default.';
                }
                return true;
            },
            isValidTiming() {
                // this.$refs.date_form.validate();
                if (this.new_window.type === 'nonrepeating') {
                    return this.isValidNonRepeat();
                } else if (this.new_window.type === 'finite_repeating') {
                    return this.isValidFiniteRepeat();
                } else if (this.new_window.type === 'calculated_repeating') {
                    return this.isValidCalcRepeat();
                }
                return false;
            },
            // helper function
            // checks validity/completeness of a data collection window form's timing when type is 'nonrepeating'
            isValidNonRepeat() {
                // verify type is 'nonrepeating'
                if (this.new_window.type === 'nonrepeating') {
                    // check if start_dttm is a clinical window and start_based_dttm is a researcher-provided date
                    // or if start_dttm is a researcher-provided date/datetime
                    if ((this.clinical_dates.includes(this.new_window.params.start_dttm)
                            && this.rp_dates_arr.includes(this.new_window.params.start_based_dttm))
                        || this.rp_dates_arr.includes(this.new_window.params.start_dttm)) {

                        // check this nonrepeating window's type and ending parameters
                        if ((this.new_window.params.type === 'hours' && this.new_window.params.num_hours > 0)
                            || this.new_window.params.type === 'day') {
                            return true;
                        } else if (this.new_window.params.type === 'dttm') {
                            if ((this.clinical_dates.includes(this.new_window.params.end_dttm)
                                    && this.rp_dates_arr.includes(this.new_window.params.end_based_dttm))
                                || this.rp_dates_arr.includes(this.new_window.params.end_dttm)) {
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
                if (this.new_window.type === 'finite_repeating') {
                    // check number of instances > 1
                    if (this.new_window.params.num_instances > 1) {
                        // check if start_dttm is a clinical window and start_based_dttm is a researcher-provided date
                        // or if start_dttm is a researcher-provided date/datetime
                        if ((this.clinical_dates.includes(this.new_window.params.start_dttm)
                                && this.rp_dates_arr.includes(this.new_window.params.start_based_dttm))
                            || this.rp_dates_arr.includes(this.new_window.params.start_dttm)) {
                            // check configuration for how instances will be repeated
                            if ((this.new_window.params.type === 'hours' && this.new_window.params.num_hours > 0)
                                || this.new_window.params.type === 'days') {
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
                if (this.new_window.type === 'calculated_repeating') {
                    // check if start_dttm is a clinical window and start_based_dttm is a researcher-provided date
                    // or if start_dttm is a researcher-provided date/datetime
                    if ((this.clinical_dates.includes(this.new_window.params.start_dttm)
                            && this.rp_dates_arr.includes(this.new_window.params.start_based_dttm))
                        || this.rp_dates_arr.includes(this.new_window.params.start_dttm)) {
                        // check if end_dttm is a clinical window and end_based_dttm is a researcher-provided date
                        // or if end_dttm is a researcher-provided date/datetime
                        if ((this.clinical_dates.includes(this.new_window.params.end_dttm)
                                && this.rp_dates_arr.includes(this.new_window.params.end_based_dttm))
                            || this.rp_dates_arr.includes(this.new_window.params.end_dttm)) {
                            // check configuration for how instances will be repeated
                            if ((this.new_window.params.type === 'hours' && this.new_window.params.num_hours > 0)
                                || this.new_window.params.type === 'days') {
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
                this.edit_window_index = i;
            },
            saveEditWindow() {
                this.edit_window_index = -1;
                this.pre_edit_window = null;
                this.edit_window_stepper = 1;
            },
            cancelEditWindow(i) {
                this.edit_window_index = -1;
                this.collection_windows[i] = JSON.parse(JSON.stringify(this.pre_edit_window));
                this.pre_edit_window = null;
                this.edit_window_stepper = 1;
            },
            saveCollectionWindowForm() {
                // check if default aggregates are set if needed
                if (this.checkDefaultAgg(this.new_window)) {
                    this.collection_windows.push(JSON.parse(JSON.stringify(this.new_window)));
                    this.resetWindow('new_window', 'new_window_form');
                } else {
                    this.alert_default_agg = true;
                }
            },
            setPreset(preset_choice) {
                this.$refs.window_form.resetValidation();
                this.new_window = JSON.parse(JSON.stringify(preset_choice));
                this.preset_choice = null;
            },
            resetWindow(window, ref) {
                this[window] = JSON.parse(JSON.stringify({
                    instr_name: null,
                    type: null, // nonrepeating || finite_repeating || calculated_repeating
                    params: {},  // params change depending on new_window's type
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
                this.show_window_form = false;
                this.window_stepper = 1;
                this.$refs[ref].resetValidation();
                console.log("reset ref");
            },
            canAggStart() {
                return this.new_window.type == 'nonrepeating';
            },
            canAggTime() {
                return (this.new_window.type === 'nonrepeating' && this.new_window.params.type === 'day') ||
                    ((this.new_window.type === 'finite_repeating' || this.new_window.params.type === 'calculated_repeating') &&
                        (this.new_window.params.type === 'day'));
            },
            addLV() {
                this.alert_lv_label = this.new_lv_obj.label;
                if (!this.new_window.data.labs_vitals.map(value => value.label).includes(this.new_lv_obj.label)) {
                    this.new_window.data.labs_vitals.push(JSON.parse(JSON.stringify({
                        label: this.new_lv_obj.label,
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
                    label: null
                };
            },
            editLV(obj) {
                this.edit_lv_index = this.new_window.data.labs_vitals.indexOf(obj);
                this.edit_lv_obj = JSON.parse(JSON.stringify(obj));
                this.edit_lv_dialog = true;
            },
            confirmEditLV() {
                if (this.edit_lv_index !== null) {
                    Object.assign(this.new_window.data.labs_vitals[this.edit_lv_index], this.edit_lv_obj);
                }
                this.edit_lv_index = null;
                this.edit_lv_obj = {
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
                };
                this.closeEditLV();
            },
            closeEditLV() {
                this.edit_lv_dialog = false;
            },
            deleteLV(obj) {
                this.edit_lv_index = this.new_window.data.labs_vitals.indexOf(obj);
                this.delete_lv_dialog = true;
            },
            confirmDeleteLV() {
                this.new_window.data.labs_vitals.splice(this.edit_lv_index, 1);
                this.edit_lv_index = null;
                this.closeDeleteLV();
            },
            closeDeleteLV() {
                this.delete_lv_dialog = false;
            },
            deleteWindow(i) {
                this.collection_windows.splice(i, 1);
                this.delete_window_dialog = false;
            }
        }
    })
</script>
</body>
</html>
