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
                        <v-list
                            v-for="identifier in rp_identifier"
                            :key="identifier.label"
                        >
                            <h3>{{identifier.label}}</h3>
                            <p>
                                REDCap field name: <em>{{identifier.redcap_field}}</em><br>
                                Format: {{identifier.format}}
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
                                Format: {{date.format}} [{{date.format=="date" ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:MM'}}]
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
                                            <v-col cols="12">
                                                <v-text-field
                                                    v-model="new_date.redcap_field"
                                                    :rules="[rules.required, checkRCFieldName]"
                                                    label="REDCap field name"
                                                    required
                                                ></v-text-field>
                                            </v-col>
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
                                Within each event, you may add your desired clinical data.
                                <br>
                                <br>
                                You may create Data Collection Windows below with the options to choose among preset configurations or to configure from scratch.
                            </p>
                        </v-card-text>

                        <!-- Create First Data Collection Window -->
                        <v-card
                            outlined
                            v-show="!collection_events.length"
                        >
                            <v-card-title>
                                Create Your First Data Collection Window
                            </v-card-title>

                            <v-stepper
                                v-model="event_1_stepper"
                                vertical
                            >
                                <v-stepper-step
                                    :complete="event_1_stepper > 1"
                                    step="1"
                                    editable
                                >
                                    Set Timing
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
                                                    v-model="new_event.instr_name"
                                                    :rules="[rules.required, checkInstrName]"
                                                    label="REDCap Instrument Name"
                                                    required
                                                >
                                                </v-text-field>
                                            </v-col>
                                        </v-row>

                                        <!-- Is this data collection event repeatable (i.e., multiple instances)? -->
                                        <v-radio-group
                                            v-model="new_event.type"
                                            @change="resetEventType"
                                            :rules="[rules.required]"
                                            required
                                            label="Is this data collection event repeatable (i.e., multiple instances)?"
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
                                                                v-model="new_event.params.num_instances"
                                                                :rules="new_event.type === 'finite_repeating' ? [rules.required, rules.num_instances] : []"
                                                                :required="new_event.type === 'finite_repeating'"
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
                                            v-model="new_event.params.start_type"
                                            label="When should this event start?"
                                            v-show="new_event.type === 'nonrepeating'"
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
                                                    v-model="new_event.params.start_dttm"
                                                    :items="event_dates"
                                                    label="Date/Datetime of Interest"
                                                    v-show="new_event.type"
                                                >
                                                </v-select>
                                            </v-col>
                                            <v-col
                                                cols="4"
                                                v-show="clinical_dates.includes(new_event.params.start_dttm)"
                                            >
                                                <v-select
                                                    v-model="new_event.params.start_based_dttm"
                                                    label="based on"
                                                    :items="rp_dates_arr"
                                                >
                                                </v-select>
                                            </v-col>
                                        </v-row>

                                        <!-- When should this event end? -->
                                        <!-- Show only for nonrepeating events -->
                                        <v-radio-group
                                            v-model="new_event.params.type"
                                            label="When should this event end?"
                                            @change="resetNonRepeatEnd"
                                            v-show="new_event.type === 'nonrepeating' && new_event.params.start_dttm"
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
                                                                v-model="new_event.params.num_hours"
                                                                dense
                                                                type="number"
                                                                min="1"
                                                            >
                                                            </v-text-field>
                                                        </v-col>
                                                        <v-col
                                                            cols="auto"
                                                        >
                                                            hour(s) after the {{new_event.params.start_dttm}}.
                                                        </v-col>
                                                    </v-row>
                                                </template>
                                            </v-radio>
                                            <v-radio
                                                value="day"
                                            >
                                                <template v-slot:label>
                                                    This event ends on 23:59 on the same calendar date of the {{new_event.params.start_dttm}}.
                                                </template>
                                            </v-radio>
                                            <v-radio
                                                label="This event ends based on a specified date/datetime."
                                                value="dttm"
                                            >
                                            </v-radio>
                                        </v-radio-group>

                                        <!-- How should this data collection event be repeated? -->
                                        <!-- Show only for repeating events -->
                                        <v-radio-group
                                            v-model="new_event.params.type"
                                            label="How should this data collection event be repeated?"
                                            @change="resetRepeat()"
                                            v-show="['finite_repeating', 'calculated_repeating'].includes(new_event.type)"
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
                                                                v-model="new_event.params.num_hours"
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
                                                    v-model="new_event.params.end_dttm"
                                                    :items="event_dates"
                                                    label="End date/datetime"
                                                    v-show="
                                                (new_event.type === 'nonrepeating' && new_event.params.type === 'dttm')
                                                || new_event.type === 'calculated_repeating'
                                               "
                                                >
                                                </v-select>
                                            </v-col>
                                            <v-col
                                                cols="4"
                                            >
                                                <v-select
                                                    v-model="new_event.params.end_based_dttm"
                                                    label="based on"
                                                    :items="rp_dates_arr"
                                                    v-show="clinical_dates.includes(new_event.params.end_dttm)"
                                                >
                                                </v-select>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                    <!--
                                    <v-btn
                                        color="primary"
                                        @click="addDataStep"
                                    >
                                        Continue
                                    </v-btn>
                                    -->
                                    <v-btn
                                        color="error"
                                        type="reset"
                                        @click="resetTiming()"
                                    >
                                        Reset Timing
                                    </v-btn>
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
                                                                v-model="new_event.aggregate_defaults.min"
                                                                dense
                                                                label="Min"
                                                            >
                                                            </v-checkbox>
                                                        </v-col>
                                                        <v-col
                                                            cols="1"
                                                        >
                                                            <v-checkbox
                                                                v-model="new_event.aggregate_defaults.max"
                                                                dense
                                                                label="Max"
                                                            >
                                                            </v-checkbox>
                                                        </v-col>
                                                        <v-col
                                                            cols="1"
                                                        >
                                                            <v-checkbox
                                                                v-model="new_event.aggregate_defaults.first"
                                                                dense
                                                                label="First"
                                                            >
                                                            </v-checkbox>
                                                        </v-col>
                                                        <v-col
                                                            cols="1"
                                                        >
                                                            <v-checkbox
                                                                v-model="new_event.aggregate_defaults.last"
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
                                                                v-model="new_event.aggregate_defaults.closest_start"
                                                                dense
                                                                :label="`Closest to ${new_event.params.start_dttm}`"
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
                                                                v-model="new_event.aggregate_defaults.closest_time"
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
                                                                                v-model="new_event.aggregate_defaults.closest_timestamp"
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
                                                                                    :label="`Closest to ${new_event.params.start_dttm}`"
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
                                                                :items="new_event.data.labs_vitals"
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
                                                                        Closest to {{new_event.params.start_dttm}}
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
                                            type="submit"
                                            @click="saveCollectionEventForm"
                                        >
                                            Save Event
                                        </v-btn>
                                        <!--
                                        <v-btn
                                            color="primary"
                                            @click="event_1_stepper = 1"
                                        >
                                            Back to Set Timing
                                        </v-btn>
                                        -->
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

                        </v-card>

                        <!-- After First Data Collection Window -->
                        <v-card
                            v-show="collection_events.length"
                        >
                            <v-list-item-subtitle><h1>Data Collection Windows</h1></v-list-item-subtitle>
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
                                        Add New Data Collection Window
                                    </v-btn>
                                </template>

                                <v-card outlined>
                                    <v-card-title>
                                        Create New Data Collection Window
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
                                                v-model="new_event.type"
                                                label="Is this data collection event repeatable (i.e., multiple instances)?"
                                                @change="resetEventType()"
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
                                                        v-model="new_event.params.start_dttm"
                                                        :items="event_dates"
                                                        label="Start Date/Datetime"
                                                    >
                                                    </v-select>
                                                </v-col>
                                                <v-col
                                                    cols="4"
                                                    v-show="clinical_dates.includes(new_event.params.start_dttm)"
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
                                                @change="resetRepeat()"
                                                v-show="['finite_repeating', 'calculated_repeating'].includes(new_event.type)"
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
                                                                    v-model="new_event.params.num_hours"
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
                                                        (new_event.type === 'nonrepeating' && new_event.params.type === 'dttm')
                                                        || new_event.type === 'calculated_repeating'
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
                                                        v-show="clinical_dates.includes(new_event.params.end_dttm)"
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
                        <!-- Researcher-Provided Info -->
                        <h1>Researcher-Provided Info</h1>
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

                        <v-divider></v-divider>

                        <!-- Demographics -->
                        <h1>Demographics</h1>
                        <v-card
                            outlined
                            class="mb-4"
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
                        <v-divider></v-divider>

                        <!-- Clinical Data -->
                        <h1>Clinical Data</h1>
                        Content goes here

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
            rp_identifier: [
                {
                    label: "MRN",
                    redcap_field: "mrn",
                    format: "8-digit number (including leading zeros, e.g., '01234567')"
                }
            ],
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
                type: null, // nonrepeating || finite_repeating || calculated_repeating
                params: {},  // params change depending on new_event's type
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
            rp_dates_arr: function() {
                return this.rp_dates.map(value => value.label);
            },
            event_dates: function() {
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
                this.$refs.date_form.validate();
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
                    this.demographics.selected = this.demographics.options;
                } else {
                    this.demographics.selected = [];
                }
            },
            resetEventType() {
                switch(this.new_event.type) {
                    case 'nonrepeating':
                        this.resetNonRepeat();
                        break;
                    case 'finite_repeating':
                        this.resetFiniteRepeat();
                        break;
                    case 'calculated_repeating':
                        this.resetCalculatedRepeat();
                        break;
                    default:
                        // TODO
                        break;
                }
            },
            resetNonRepeat() {
                this.new_event.params = {
                    type: null, // hours || day || dttm
                    num_hours: null, // number of hours when type is hours
                    start_type: null, // dttm || date
                    start_dttm: null, // start date/datetime
                    start_based_dttm: "Study Enrollment Date", // required when start_dttm is based on a clinical date
                    end_dttm: null, // end date/datetime when applicable
                    end_based_dttm: "Study Enrollment Date" // required when end_dttm is based on a clinical date
                };
            },
            resetFiniteRepeat() {
                this.new_event.params = {
                    type: null, // hours || days
                    num_hours: null, // number of hours when type is 'hours'
                    num_instances: null, // number of instances when event_type = 'finite_repeating'
                    start_dttm: null, // start date/datetime
                    start_based_dttm: "Study Enrollment Date", // required when start_dttm is based on a clinical date
                }
            },
            resetCalculatedRepeat() {
                this.new_event.params = {
                    type: null, // hours || days
                    num_hours: null, // number of hours when type is 'hours'
                    start_dttm: null, // start date/datetime
                    start_based_dttm: "Study Enrollment Date", // required when end_dttm is based on a clinical date
                    end_dttm: null, // end date/datetime when applicable
                    end_based_dttm: "Study Enrollment Date" // required when end_dttm is based on a clinical date
                }
            },
            resetNonRepeatEnd() {
                this.new_event.params.num_hours = null,
                this.new_event.params.end_dttm = null;
                this.new_event.params.end_based_dttm = "Study Enrollment Date";
            },
            resetRepeat() {
                this.new_event.params.num_hours =  null;
                if(this.new_event.type === 'calculated_repeating') {
                    this.new_event.params.end_dttm =  null;
                    this.new_event.params.end_based_dttm = "Study Enrollment Date";
                }
            },
            // checks if the entered REDCap Label already exists
            checkRCLabel(label) {
                let labels_arr = this.rp_dates.map(value => value.label);
                labels_arr = labels_arr.concat(this.clinical_dates);
                if(labels_arr.includes(label)) {
                    return 'Enter another label. This label is already used by a predefined clinical date or other researcher-provided date.';
                }
                return true;
            },
            // checks if the entered REDCap Field already exists
            checkRCFieldName(field) {
                // check field is valid input
                if(!/^\w+$/.test(field)) {
                    return 'ONLY letters, numbers, and underscores.';
                }
                let fields_arr = this.rp_dates.map(value => value.redcap_field);
                // TODO this needs to check all REDCap field names, not just what's in dates
                if(fields_arr.includes(field)) {
                    return 'Enter another field name. This field name is already taken.';
                }
                return true;
            },
            // checks if the entered REDCap instrument name already exists
            checkInstrName(name) {
                let names_arr = this.collection_events.map(value => value.instr_name);
                names_arr = names_arr.concat(['Identifiers', 'Researcher-Provided Info', 'Demographics'])
                if(names_arr.includes(name)) {
                    return 'Enter another name. This name is already used by another data collection event or other REDCap Instrument DUSTER will create by default.';
                }
                return true;
            },
            isValidTiming() {
                // TODO check this.new_event.instr_name meets requirements of REDCap instrument name
                // TODO check REDCap instrument name does not conflict with other data collection events or REDCap instrument names
                if(this.new_event.type === 'nonrepeating') {
                    return this.isValidNonRepeat();
                } else if(this.new_event.type === 'finite_repeating') {
                    return this.isValidFiniteRepeat();
                } else if(this.new_event.type === 'calculated_repeating') {
                    return this.isValidCalcRepeat();
                }

                return false;
            },
            // helper function
            // checks validity/completeness of a data collection event form's timing when type is 'nonrepeating'
            isValidNonRepeat() {
                // verify type is 'nonrepeating'
                if(this.new_event.type === 'nonrepeating') {
                    // check if start_dttm is a clinical event and start_based_dttm is a researcher-provided date
                    // or if start_dttm is a researcher-provided date/datetime
                    if((this.clinical_dates.includes(this.new_event.params.start_dttm)
                        && this.rp_dates_arr.includes(this.new_event.params.start_based_dttm))
                        || this.rp_dates_arr.includes(this.new_event.params.start_dttm)) {

                        // check this nonrepeating event's type and ending parameters
                        if((this.new_event.params.type === 'hours' && this.new_event.params.num_hours > 0)
                            || this.new_event.params.type === 'day') {
                            return true;
                        } else if(this.new_event.params.type === 'dttm') {
                            if((this.clinical_dates.includes(this.new_event.params.end_dttm)
                                    && this.rp_dates_arr.includes(this.new_event.params.end_based_dttm))
                                || this.rp_dates_arr.includes(this.new_event.params.end_dttm)) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            },
            // helper function
            // checks validity/completeness of a data collection event form's timing when type is 'finite_repeating'
            isValidFiniteRepeat() {
                // verify type is 'finite_repeating'
                if(this.new_event.type === 'finite_repeating') {
                    // check number of instances > 1
                    if(this.new_event.params.num_instances > 1) {
                        // check if start_dttm is a clinical event and start_based_dttm is a researcher-provided date
                        // or if start_dttm is a researcher-provided date/datetime
                        if((this.clinical_dates.includes(this.new_event.params.start_dttm)
                                && this.rp_dates_arr.includes(this.new_event.params.start_based_dttm))
                            || this.rp_dates_arr.includes(this.new_event.params.start_dttm)) {
                            // check configuration for how instances will be repeated
                            if((this.new_event.params.type === 'hours' && this.new_event.params.num_hours > 0)
                                || this.new_event.params.type === 'days') {
                                return true;
                            }
                        }
                    }
                }
                return false;
            },
            // helper function
            // checks validity/completeness of a data collection event form's timing when type is 'calculated_repeating'
            isValidCalcRepeat() {
                // verify type is 'calculated_repeating'
                if(this.new_event.type === 'calculated_repeating') {
                    // check if start_dttm is a clinical event and start_based_dttm is a researcher-provided date
                    // or if start_dttm is a researcher-provided date/datetime
                    if ((this.clinical_dates.includes(this.new_event.params.start_dttm)
                            && this.rp_dates_arr.includes(this.new_event.params.start_based_dttm))
                        || this.rp_dates_arr.includes(this.new_event.params.start_dttm)) {
                        // check if end_dttm is a clinical event and end_based_dttm is a researcher-provided date
                        // or if end_dttm is a researcher-provided date/datetime
                        if ((this.clinical_dates.includes(this.new_event.params.end_dttm)
                                && this.rp_dates_arr.includes(this.new_event.params.end_based_dttm))
                            || this.rp_dates_arr.includes(this.new_event.params.end_dttm)) {
                            // check configuration for how instances will be repeated
                            if ((this.new_event.params.type === 'hours' && this.new_event.params.num_hours > 0)
                                || this.new_event.params.type === 'days') {
                                return true;
                            }
                        }
                    }
                }
                return false;
            },
            // checks if the default aggregate needs to be set
            // returns true/false
            checkDefaultAgg() {
                let noDefaults = true;
                for(let aggregate in this.new_event.aggregate_defaults) {
                    if(this.new_event.aggregate_defaults[aggregate] === true) {
                        noDefaults = false;
                        break;
                    }
                }
                for(let i = 0; i < this.new_event.data.labs_vitals.length; i++) {
                    if(this.new_event.data.labs_vitals[i].aggregates.default === true
                        && noDefaults === true) {
                        return false;
                    }
                }
                return true;
            },
            addDataStep() {
                // TODO validate first step of defining event
                this.event_1_stepper = 2;
            },
            saveCollectionEventForm() {
                // check if default aggregates are set if needed
                if(this.checkDefaultAgg()) {
                    this.collection_events.push(JSON.parse(JSON.stringify(this.new_event)));
                    this.resetTiming();
                    // TODO reset data
                } else {
                    this.alert_default_agg = true;
                }
            },
            setPreset(preset_choice) {
              this.$refs.event_form.resetValidation();
              this.new_event = JSON.parse(JSON.stringify(preset_choice));
            },
            resetTiming() {
                this.$refs.event_form.reset();
                // this.new_event_dialog = false;
                //this.new_event.instr_name = null;
               // this.new_event.type = null;
              //  this.new_event.params = {};
            },
            canAggStart() {
                return this.new_event.type == 'nonrepeating';
            },
            canAggTime() {
                return (this.new_event.type === 'nonrepeating' && this.new_event.params.type === 'day') ||
                       ((this.new_event.type === 'finite_repeating' || this.new_event.params.type === 'calculated_repeating') &&
                       (this.new_event.params.type === 'day'));
            },
            addLV() {
                this.alert_lv_label = this.new_lv_obj.label;
                if(!this.new_event.data.labs_vitals.map(value => value.label).includes(this.new_lv_obj.label)) {
                    this.new_event.data.labs_vitals.push(JSON.parse(JSON.stringify({
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
                this.edit_lv_index = this.new_event.data.labs_vitals.indexOf(obj);
                this.edit_lv_obj = JSON.parse(JSON.stringify(obj));
                this.edit_lv_dialog = true;
            },
            confirmEditLV() {
                if(this.edit_lv_index !== null) {
                    Object.assign(this.new_event.data.labs_vitals[this.edit_lv_index], this.edit_lv_obj);
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
