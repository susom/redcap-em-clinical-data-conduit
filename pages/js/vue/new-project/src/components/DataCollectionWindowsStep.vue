<template>
  <v-container pa-0>
    <v-card-text>
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
    <v-card
      elevation="0"
    >
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
            <v-row>
              <v-col>
                <!-- Display timing -->
                <v-card
                  outlined
                  class="mt-4"
                >
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
                      v-if="window.aggregate_defaults.min === true"
                    >
                      Min
                    </v-chip>
                    <v-chip
                      v-if="window.aggregate_defaults.max === true"
                    >
                      Max
                    </v-chip>
                    <v-chip
                      v-if="window.aggregate_defaults.first === true"
                    >
                      First
                    </v-chip>
                    <v-chip
                      v-if="window.aggregate_defaults.last === true"
                    >
                      Last
                    </v-chip>
                    <v-chip
                      v-if="window.aggregate_defaults.closest_event === true"
                    >
                      Closest to {{window.event !== null && Object.prototype.hasOwnProperty.call(window.event, 'label') ? window.event.label : "N/A"}}
                    </v-chip>
                    <v-chip
                      v-if="window.aggregate_defaults.closest_time === true"
                    >
                      Closest to {{window.aggregate_options.time}}
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
                    <v-tab>Outcomes</v-tab>
                    <v-tab>Scores</v-tab>

                    <v-tab-item
                    >
                      <v-card>
                        <v-data-table
                          :headers="lv_headers_viewonly"
                          :items="window.data.labs_vitals"
                          :items-per-page="10"
                          fixed-header
                          no-data-text="No labs or vitals selected."
                        >
                          <template v-slot:[`item.aggregates`]="{ item }">
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
                              v-show="item.aggregates.default == false && item.aggregates.closest_event == true"
                            >
                              Closest to {{window.event !== null && Object.prototype.hasOwnProperty.call(window.event, 'label') ? window.event.label : "N/A"}}
                            </v-chip>
                            <v-chip
                              v-show="item.aggregates.default == false && item.aggregates.closest_time == true"
                            >
                              Closest to {{window.aggregate_options.time}}
                            </v-chip>
                          </template>
                        </v-data-table>
                      </v-card>
                    </v-tab-item>

                    <v-tab-item>
                      <v-card>
                        <v-card-text>Outcomes</v-card-text>
                        <v-data-table
                            :headers="field_headers_viewonly"
                            :items="window.data.outcomes"
                            :items-per-page="10"
                            fixed-header
                            no-data-text="No outcomes selected."
                        >
                        </v-data-table>
                      </v-card>
                    </v-tab-item>

                    <v-tab-item>
                      <v-card>
                        <v-card-text>Scores</v-card-text>
                        <v-data-table
                          :headers="score_headers_viewonly"
                          :items="window.data.scores"
                          :items-per-page="10"
                          fixed-header
                          no-data-text="No scores selected."
                        >
                        </v-data-table>
                      </v-card>
                    </v-tab-item>
                  </v-tabs>
                </v-card>
              </v-col>
            </v-row>

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
              class="mt-4"
              @click="editWindow(i)"
            >
              Edit
            </v-btn>
            <v-btn
              v-show="edit_window_index === -1"
              color="error"
              class="mt-4"
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
        v-show="show_window_form === true"
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
                          <span>If the specified Date of Interest is not a Datetime, 00:00:00 will be used for the date's timestamp.</span>
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
                  v-if="isClinicalDate(window.timing.start)"
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
                    v-if="isClinicalDate(window.timing.end)"
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
                        cols="2"
                        class="pr-4"
                      >
                        <v-checkbox
                          ref="closest_event_default"
                          v-model="window.aggregate_defaults.closest_event"
                          label="Closest to"
                          dense
                          :rules="window.aggregate_defaults.closest_event ? [rules.aggEventSelect] : []"
                          v-if="isValidNonRepeat()"
                        >
                        </v-checkbox>
                      </v-col>
                      <v-col
                        cols="auto"
                        class="pr-4"
                      >
                        <v-select
                          placeholder="Select an event"
                          v-model="window.event"
                          :items="window_datetimes"
                          item-text="label"
                          item-value="label"
                          return-object
                          dense
                          @change="$refs['closest_event_default'].validate()"
                        ></v-select>
                      </v-col>
                      <v-col>
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
                            <span>
                              If the selected event occurs multiple times within this data collection window, this will be based on its first occurrence.
                              <br>
                              If the event doesn't occur within this data collection window, then clinical variable aggregations for this will not be possible.
                            </span>
                          </v-tooltip>
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
                                v-if="isWindowCalendarDay()"
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
                                                v-model="window.aggregate_options.time"
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
                    <v-tab>Outcomes</v-tab>
                    <v-tab>Scores</v-tab>

                    <!-- labs and vitals -->
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
                                cols="2"
                                class="pr-4"
                              >
                                <v-checkbox
                                  ref="closest_event_edit"
                                  v-model="edit_lv_obj.aggregates.closest_event"
                                  label="Closest to"
                                  dense
                                  :rules="edit_lv_obj.aggregates.closest_event ? [rules.aggEventSelect] : []"
                                  v-if="isValidNonRepeat()"
                                >
                                </v-checkbox>
                              </v-col>
                              <v-col
                                cols="auto"
                                class="pr-4"
                              >
                                <v-select
                                  placeholder="Select an event"
                                  v-model="window.event"
                                  :items="window_datetimes"
                                  item-text="label"
                                  item-value="label"
                                  return-object
                                  dense
                                  @change="$refs['closest_event_edit'].validate()"
                                ></v-select>
                              </v-col>
                              <v-col>
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
                                  <span>
                                    If the selected event occurs multiple times within this data collection window, this will be based on its first occurrence.
                                    <br>
                                    If the event doesn't occur within this data collection window, then clinical variable aggregations for this will not be possible.
                                  </span>
                                </v-tooltip>
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
                                        v-if="isWindowCalendarDay()"
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
                                                        v-model="window.aggregate_options.time"
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
                            <v-alert
                              v-model="alert_edit_agg"
                              type="error"
                              dismissible
                            >
                              You selected to set custom aggregates, but you did not select any.
                            </v-alert>
                            <v-alert
                              v-model="alert_edit_agg_closest_event"
                              type="error"
                              dismissible
                            >
                              You chose to set custom aggregates and checked the "closest to" aggregation.
                              <br>
                              However, you did not select an event for this aggregation.
                              <br>
                              Select an event or uncheck this aggregation.
                            </v-alert>
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
                          <template v-slot:[`item.aggregates`]="{ item }">
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
                              v-show="item.aggregates.default == false && item.aggregates.closest_event == true"
                            >
                              Closest to {{window.event !== null && Object.prototype.hasOwnProperty.call(window.event, 'label') ? window.event.label : "N/A"}}
                            </v-chip>
                            <v-chip
                              v-show="item.aggregates.default == false && item.aggregates.closest_time == true"
                            >
                              Closest to {{window.aggregate_options.time}}
                            </v-chip>
                          </template>
                          <template v-slot:[`item.actions`]="{ item }">
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

                    <!-- outcomes -->
                    <v-tab-item
                    >
                      <v-card>
                        <v-autocomplete
                            v-model="new_field_obj"
                            :items="outcomes"
                            color="white"
                            auto-select-first
                            hide-no-data
                            placeholder="Search for outcomes to add..."
                            prepend-icon="mdi-magnify"
                            item-text="label"
                            return-object
                            @change="addOutcome"
                        ></v-autocomplete>
                        <v-dialog
                            v-model="delete_field_dialog"
                            persistent
                            max-width="600px"
                        >
                          <v-card>
                            <v-card-title
                                class="justify-center"
                            >
                              Are you sure you want to delete this outcome?
                            </v-card-title>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
                                  color="error"
                                  @click="confirmDeleteOutcome()"
                              >
                                Yes
                              </v-btn>
                              <v-btn
                                  color="secondary"
                                  @click="closeDeleteField()"
                              >
                                Cancel
                              </v-btn>
                              <v-spacer></v-spacer>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>

                        <v-snackbar
                            v-model="alert_outcomes_success"
                            color="success"
                            outlined
                            timeout=1000
                        >
                          {{alert_field_label}} added.
                        </v-snackbar>
                        <v-snackbar
                            v-model="alert_outcomes_error"
                            color="error"
                            outlined
                            timeout=1000
                        >
                          {{alert_field_label}} was already added.
                        </v-snackbar>
                        <v-data-table
                            :headers="field_headers"
                            :items="window.data.outcomes"
                            :items-per-page="10"
                            fixed-header
                            no-data-text="Use search bar above to start adding outcomes."
                        >
                          <template v-slot:[`item.actions`]="{ item }">
                            <v-icon
                                small
                                @click="deleteOutcome(item)"
                            >
                              mdi-delete
                            </v-icon>
                          </template>
                        </v-data-table>
                      </v-card>

                    </v-tab-item>

                    <!-- scores -->
                    <v-tab-item
                    >
                      <v-card>
                      <v-autocomplete
                        v-model="new_score_obj"
                        :items="scores"
                        color="white"
                        auto-select-first
                        hide-no-data
                        placeholder="Search for scores to add..."
                        prepend-icon="mdi-magnify"
                        item-text="label"
                        return-object
                        @change="addScore()"
                      ></v-autocomplete>
                      <v-dialog
                        v-model="delete_score_dialog"
                        persistent
                        max-width="600px"
                      >
                        <v-card>
                          <v-card-title
                            class="justify-center"
                          >
                            Are you sure you want to delete this score?
                          </v-card-title>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="error"
                              @click="deleteScore()"
                            >
                              Yes
                            </v-btn>
                            <v-btn
                              color="secondary"
                              @click="delete_score_index = null, delete_score_dialog = false"
                            >
                              Cancel
                            </v-btn>
                            <v-spacer></v-spacer>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>

                      <v-snackbar
                        v-model="alert_score_success"
                        color="success"
                        outlined
                        timeout=1000
                      >
                        {{alert_score_label}} added.
                      </v-snackbar>
                      <v-snackbar
                        v-model="alert_score_error"
                        color="error"
                        outlined
                        timeout=1000
                      >
                        {{alert_score_label}} was already added.
                      </v-snackbar>
                      <v-data-table
                        :headers="score_headers"
                        :items="window.data.scores"
                        :items-per-page="10"
                        fixed-header
                        no-data-text="Use search bar above to start adding scores."
                      >
                        <template v-slot:[`item.actions`]="{ item, index }">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon
                                v-bind="attrs"
                                v-on="on"
                                small
                                @click="delete_score_index = index, delete_score_dialog = true"
                              >
                                mdi-delete
                              </v-icon>
                            </template>
                            <span>
                              Delete '{{item.label}}'
                            </span>
                          </v-tooltip>
                        </template>
                      </v-data-table>
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
              <br>
              Set default aggregates in order to continue.
            </v-alert>
            <v-alert
              v-model="alert_default_agg_closest_event"
              type="error"
              dismissible
            >
              You checked the "closest to" aggregation.
              <br>
              However, you did not select an event for this aggregation.
              <br>
              Select an event or uncheck this aggregation.
            </v-alert>
          </v-stepper-content>
        </v-stepper>

        <v-card-actions
          class="mt-4"
          v-show="show_window_form === true"
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
  </v-container>
</template>

<script>

export default {
  name: "DataCollectionWindowsStep",
  props: {
    'clinical_dates_prop': Array,
    'collection_windows_prop': Array,
    'labs_prop': Array,
    'vitals_prop': Array,
    'outcomes_prop': Array,
    'rp_dates_prop': Array,
    'scores_prop': Array,
    'show_window_form_prop': Boolean
  },
  computed: {
    clinical_dates: {
      get() {
        return this.clinical_dates_prop;
      }
    },
    collection_windows: {
      get() {
        return this.collection_windows_prop;
      },
      set() {
        this.$emit('update:collection_windows_prop', this.collection_windows);
      }
    },
    labs: {
      get() {
        return this.labs_prop;
      }
    },
    labs_vitals: {
      get() {
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
    outcomes: {
      get() {
        let outcomes_arr = this.outcomes_prop;
        outcomes_arr.sort((a, b) => {return a.label.localeCompare(b.label)});
        outcomes_arr = [{header: "Outcomes"}].concat(outcomes_arr);
        return outcomes_arr;
      }
    },
    rp_dates: {
      get() {
        return this.rp_dates_prop;
      }
    },
    rp_dates_rcfields: {
      get() {
        return this.rp_dates.map(value => value.redcap_field_name);
      }
    },
    scores: {
      get() {
        return this.scores_prop;
      }
    },
    show_window_form: {
      get() {
        return this.show_window_form_prop;
      },
      set(newValue) {
        this.$emit('update:show_window_form_prop', newValue);
      }
    },
    vitals: {
      get() {
        return this.vitals_prop;
      }
    },
    window_dates: {
      get() {
        return this.clinical_dates.concat(this.rp_dates);
      }
    },
    window_datetimes: {
      get() {
        const rp_datetimes_arr = this.rp_dates.filter(rp_date => rp_date.value_type === "datetime");
        return this.clinical_dates.concat(rp_datetimes_arr);
      }
    }
  },
  data: function() {
    return {
      alert_default_agg: false,
      alert_default_agg_closest_event: false,
      alert_edit_agg: false,
      alert_edit_agg_closest_event: false,
      alert_lv_error: false,
      alert_lv_label: null,
      alert_lv_success: false,
      alert_score_error: false,
      alert_score_label: null,
      alert_score_success: false,
      delete_lv_dialog: false,
      delete_score_dialog: false,
      delete_score_index: null,
      alert_outcomes_success: false,
      alert_outcomes_error:false,
      alert_field_label: null,
      delete_field_dialog: false,
      delete_window_dialog: false,
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
          closest_event: false,
          closest_time: false,
        }
      },
      edit_field_index: null,
      edit_window_index: -1,
      lv_headers: [
        {text: 'Label', value: 'label'},
        {text: 'Aggregates', value: 'aggregates', sortable: false},
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      lv_headers_viewonly : [
        {text: 'Label', value: 'label'},
        {text: 'Aggregates', value: 'aggregates', sortable: false}
      ],
      field_headers: [
        {text: 'Label', value: 'label'},
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      field_headers_viewonly: [
        {text: 'Label', value: 'label'},
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      score_headers: [
        {text: 'Label', value: 'label'},
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      score_headers_viewonly: [
        {text: 'Label', value: 'label'}
      ],
      new_lv_obj: {
        duster_field_name: null,
        label: null,
        category: null,
        redcap_field_type: null,
        redcap_options: null,
        redcap_field_note: null,
        value_type: null
      },
      new_field_obj: {
        duster_field_name: null,
        label: null,
        category: null,
        redcap_field_type: null,
        redcap_options: null,
        redcap_field_note: null,
        value_type: null
      },
      new_score_obj: {
        duster_field_name: null,
        label: null,
        category: null,
        redcap_field_type: null,
        redcap_options: null,
        redcap_field_note: null,
        value_type: null,
        subscores: null
      },
      open_window_panel: null,
      window_stepper: 1,
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
              redcap_field_type: "text",
              value_type: "datetime",
              label: "ED Admission Datetime"
            },
            start_based: "enroll_date",
            end_type: "dttm",
            num_hours: null,
            end: {
              category: "dates",
              duster_field_name: "ed_discharge_dttm",
              redcap_field_type: "text",
              value_type: "datetime",
              label: "ED Discharge Datetime"
            },
            end_based: "enroll_date"
          },
          event: null,
          aggregate_defaults: {
            min: false,
            max: false,
            first: false,
            last: false,
            closest_event: false,
            closest_time: false
          },
          aggregate_options : {
            time: "08:00:00"
          },
          data: {
            labs_vitals: [],
            outcomes: [],
            scores: []
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
              redcap_field_type: "text",
              value_type: "datetime",
              label: "Hospital Admission Datetime"
            },
            start_based: "enroll_date",
            end_type: "dttm",
            num_hours: null,
            end: {
              category: "dates",
              duster_field_name: "hospital_discharge_dttm",
              redcap_field_type: "text",
              value_type: "datetime",
              label: "Hospital Discharge Datetime"
            },
            end_based: "enroll_date"
          },
          event: null,
          aggregate_defaults: {
            min: false,
            max: false,
            first: false,
            last: false,
            closest_event: false,
            closest_time: false,
            closest_timestamp: "08:00:00"
          },
          aggregate_options: {
            time: "08:00:00"
          },
          data: {
            labs_vitals: [],
            outcomes: [],
            scores: []
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
              redcap_field_type: "text",
              value_type: "datetime",
              label: "Hospital Admission Datetime"
            },
            start_based: "enroll_date",
            end_type: "hours",
            num_hours: 24,
            end: null,
            end_based: "enroll_date"
          },
          event: null,
          aggregate_defaults: {
            min: false,
            max: false,
            first: false,
            last: false,
            closest_event: false,
            closest_time: false,
          },
          aggregate_options: {
            time: "08:00:00"
          },
          data: {
            labs_vitals: [],
            outcomes: [],
            scores: []
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
              redcap_field_type: "text",
              value_type: "datetime",
              label: "First ICU Admission Datetime"
            },
            start_based: "enroll_date",
            end_type: "hours",
            num_hours: 24,
            end: null,
            end_based: "enroll_date"
          },
          event: null,
          aggregate_defaults: {
            min: false,
            max: false,
            first: false,
            last: false,
            closest_event: false,
            closest_time: false,
            closest_timestamp: "08:00:00"
          },
          aggregate_options: {
            time: "08:00:00"
          },
          data: {
            labs_vitals: [],
            outcomes: [],
            scores: []
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
        event: null,
        aggregate_defaults: {
          min: false,
          max: false,
          first: false,
          last: false,
          closest_event: false,
          closest_time: false,
        },
        aggregate_options: {
          time: "08:00:00"
        },
        data: {
          labs_vitals: [],
          outcomes:[],
          scores:[]
        }
      },
      rules: {
        required: value => !!value || 'Required.',
        aggEventSelect: () => !!this.window.event || 'Select an event or uncheck this aggregation.'
      }
    }
  },
  methods: {
    addLV() {
      this.alert_lv_label = this.new_lv_obj.label;
      if (!this.window.data.labs_vitals.map(value => value.label).includes(this.new_lv_obj.label)) {
        this.window.data.labs_vitals.push(JSON.parse(JSON.stringify({
          duster_field_name: this.new_lv_obj.duster_field_name,
          label: this.new_lv_obj.label,
          redcap_field_type: this.new_lv_obj.redcap_field_type,
          value_type: this.new_lv_obj.value_type,
          redcap_options: this.new_lv_obj.redcap_options,
          redcap_field_note: this.new_lv_obj.redcap_field_note,
          category: this.new_lv_obj.category,
          aggregates: {
            default: true,
            min: false,
            max: false,
            first: false,
            last: false,
            closest_event: false,
            closest_time: false,
          }
        })));
        this.alert_lv_success = true;
      } else {
        this.alert_lv_error = true;
      }
      this.new_lv_obj = {
        duster_field_name: null,
        redcap_field_type: null,
        value_type: null,
        redcap_options: null,
        redcap_field_note: null,
        label: null,
        category: null
      };
    },
    addOutcome() {
      this.alert_field_label = this.new_field_obj.label;
      if (!this.window.data.outcomes.map(value => value.label).includes(this.new_field_obj.label)) {
        this.window.data.outcomes.push(JSON.parse(JSON.stringify({
          duster_field_name: this.new_field_obj.duster_field_name,
          label: this.new_field_obj.label,
          category: this.new_field_obj.category,
          redcap_field_type: this.new_field_obj.redcap_field_type,
          value_type: this.new_field_obj.value_type,
          redcap_options: this.new_field_obj.redcap_options,
          redcap_field_note: this.new_field_obj.redcap_field_note
        })));
        this.alert_outcomes_success = true;
      } else {
        this.alert_outcomes_error = true;
      }
      this.new_field_obj = {
        duster_field_name: null,
        label: null,
        category: null,
        redcap_field_type: null,
        value_type: null,
        redcap_options: null,
        redcap_field_note: null
      };
    },
    addScore() {
      this.alert_score_label = this.new_score_obj.label;
      if (!this.window.data.scores.map(value => value.label).includes(this.new_score_obj.label)) {
        this.window.data.scores.push(JSON.parse(JSON.stringify({
          duster_field_name: this.new_score_obj.duster_field_name,
          label: this.new_score_obj.label,
          category: this.new_score_obj.category,
          redcap_field_type: this.new_score_obj.redcap_field_type,
          value_type: this.new_field_obj.value_type,
          redcap_options: this.new_score_obj.redcap_options,
          redcap_field_note: this.new_score_obj.redcap_field_note,
          subscores: this.new_score_obj.subscores
        })));
        this.alert_score_success = true;
      } else {
        this.alert_score_error = true;
      }
      this.new_score_obj = {
        duster_field_name: null,
        label: null,
        category: null,
        redcap_field_type: null,
        redcap_options: null,
        subscores: null
      }
    },
    // checks validity of default aggregates or if they need to be set
    // returns:
    //   0 -> aggregation setting is valid
    //   1 -> default aggregates must be chosen
    //   2 -> "closest to event" option is selected, but no event is selected
    checkDefaultAgg() {
      let noDefaults = true;
      for (let aggregate in this.window.aggregate_defaults) {
        if (this.window.aggregate_defaults[aggregate] === true) {
          noDefaults = false;
          break;
        }
      }
      for (let i = 0; i < this.window.data.labs_vitals.length; i++) {
        if (this.window.data.labs_vitals[i].aggregates.default === true
          && noDefaults === true) {
          return 1;
        }
      }
      return this.window.aggregate_defaults.closest_event === true && this.window.event === null ? 2 : 0;
    },
    // checks validity of a lab or vital's aggregation settings when editing
    // returns:
    //   0 -> aggregation setting is valid, default is chosen or custom settings are valid
    //   1 -> custom aggregation is chosen, but no custom options are selected
    //   2 -> custom aggregation is chosen and "closest to event" option is selected, but no event is selected
    checkEditAgg() {
      if (this.edit_lv_obj.aggregates.default === false) {
        for (const aggregate in this.edit_lv_obj.aggregates) {
          if (aggregate !== "default" && this.edit_lv_obj.aggregates[aggregate] === true) {
              return aggregate === "closest_event" && !this.window.edit ? 2 : 0;
          }
        }
      }
      return 1;
    },
    cancelEditWindow(i) {
      this.collection_windows.splice(i, 1, JSON.parse(JSON.stringify(this.pre_edit_window)));
      this.pre_edit_window = Object.assign({}, this.pre_edit_window, null);
      this.edit_window_stepper = 1;
      this.show_window_form = false;
      this.$refs.window_form.resetValidation();
    },
    // checks if the entered REDCap instrument name already exists
    checkInstrName(name) {
      let names_arr = this.collection_windows.map(value => value.label);
      names_arr = names_arr.concat(['Researcher-Provided Info', 'Clinical Dates', 'Demographics']);
      if (!names_arr.includes(name) ||
        (this.window_edit === true && names_arr[this.edit_window_index] === name)) {
        return true;
      } else {
        return 'Enter another name. This name is already used by another data collection window or other REDCap Form DUSTER will create by default.';
      }
    },
    closeDeleteLV() {
      this.delete_lv_dialog = false;
    },
    closeDeleteField() {
      this.delete_field_dialog = false;
    },
    closeDeleteScore() {
      // TODO
    },
    confirmDeleteLV() {
      this.window.data.labs_vitals.splice(this.edit_lv_index, 1);
      this.edit_lv_index = null;
      this.closeDeleteLV();
    },
    confirmDeleteOutcome() {
      this.window.data.outcomes.splice(this.edit_field_index, 1);
      this.edit_field_index = null;
      this.closeDeleteField();
    },
    // validates and saves an edit for a lab or vital
    confirmEditLV() {
      const editAgg = this.checkEditAgg();
      if (editAgg === 1) {
        this.alert_edit_agg = true;
      } else if (editAgg === 2) {
        this.alert_edit_agg_closest_event = true;
      } else if (editAgg === 0) {
        if (this.edit_lv_index !== null) {
          Object.assign(this.window.data.labs_vitals[this.edit_lv_index], this.edit_lv_obj);
        }
        this.edit_lv_index = null;
        this.edit_lv_obj = {
          duster_field_name: null,
          label: null,
          redcap_field_type: null,
          value_type: null,
          redcap_options: null,
          redcap_field_note: null,
          category: null,
          aggregates: {
            default: true,
            min: false,
            max: false,
            first: false,
            last: false,
            closest_event: false,
            closest_time: false,
          }
        };
        this.closeEditLV();
      }
    },
    closeEditLV() {
      this.edit_lv_dialog = false;
    },
    deleteLV(obj) {
      this.edit_lv_index = this.window.data.labs_vitals.indexOf(obj);
      this.delete_lv_dialog = true;
    },
    deleteOutcome(obj) {
      this.edit_field_index = this.window.data.outcomes.indexOf(obj);
      this.delete_field_dialog = true;
    },
    deleteScore() {
      this.window.data.scores.splice(this.delete_score_index, 1);
      this.delete_score_index = null;
      this.delete_score_dialog = false;
    },
    deleteWindow(i) {
      this.collection_windows.splice(i, 1);
      this.delete_window_dialog = false;
      this.open_window_panel = null;
    },
    editLV(obj) {
      this.edit_lv_index = this.window.data.labs_vitals.indexOf(obj);
      this.edit_lv_obj = JSON.parse(JSON.stringify(obj));
      this.edit_lv_dialog = true;
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
    isClinicalDate(obj) {
      return obj !== null ? Object.prototype.hasOwnProperty.call(obj,'duster_field_name') : false;
    },
    isRPDate(obj) {
      return obj !== null ? Object.prototype.hasOwnProperty.call(obj, 'redcap_field_name') : false;
    },
    isValidTiming() {
      if (this.window.label !== "" && this.checkInstrName(this.window.label)) {
        if (this.window.type === 'nonrepeating') {
          return this.isValidNonRepeat();
        } else if (this.window.type === 'finite_repeating') {
          return this.isValidFiniteRepeat();
        } else if (this.window.type === 'calculated_repeating') {
          return this.isValidCalcRepeat();
        }
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
          && ((this.isClinicalDate(this.window.timing.start)
              && this.rp_dates_rcfields.includes(this.window.timing.start_based))
            || this.isRPDate(this.window.timing.start))) {
          // check this nonrepeating window's ending parameters
          if ((this.window.timing.end_type === 'hours' && this.window.timing.num_hours > 0)
            || this.window.timing.end_type === 'day') {
            // console.log("isValidNonRepeat(): valid, returning true");
            return true;
          } else if (this.window.timing.end_type === 'dttm') {
            if ((this.isClinicalDate(this.window.timing.end)
                && this.rp_dates_rcfields.includes(this.window.timing.end_based))
              || this.isRPDate(this.window.timing.end)) {
              // console.log("isValidNonRepeat(): valid, returning true");
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
          if ((this.isClinicalDate(this.window.timing.start)
              && this.rp_dates_rcfields.includes(this.window.timing.start_based))
            || this.isRPDate(this.window.timing.start)) {
            // check how instances will be repeated
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
        if ((this.isClinicalDate(this.window.timing.start)
            && this.rp_dates_rcfields.includes(this.window.timing.start_based))
          || this.isRPDate(this.window.timing.start)) {
          // check if end_dttm is a clinical window and end_based_dttm is a researcher-provided date
          // or if end_dttm is a researcher-provided date/datetime
          if ((this.isClinicalDate(this.window.timing.end)
              && this.rp_dates_rcfields.includes(this.window.timing.end_based))
            || this.isRPDate(this.window.timing.end)) {
            // check how instances will be repeated
            if ((this.window.timing.type === 'hours' && this.window.timing.num_hours > 0)
              || this.window.timing.type === 'days') {
              return true;
            }
          }
        }
      }
      return false;
    },
    // determines if timing of the new data collection window form is for a calendar day
    // returns true/false
    isWindowCalendarDay() {
      if (this.window.type === 'nonrepeating') {
        return this.window.timing.start_type === 'date'
          && this.window.timing.end_type === 'day';
      } else if (['finite_repeating', 'calculated_repeating'].includes(this.window.type)) {
        // TODO
        return false;
      }
      return false;
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
        event: null,
        aggregate_defaults: {
          min: false,
          max: false,
          first: false,
          last: false,
          closest_event: false,
          closest_time: false,
        },
        aggregate_options: {
          time: "08:00:00"
        },
        data: {
          labs_vitals: [],
          outcomes:[],
          scores:[]
        }
      }));
      this.alert_default_agg = false;
      this.window_stepper = 1;
      this.$refs[ref].resetValidation();
    },
    saveCollectionWindowForm() {
      const defaultAgg = this.checkDefaultAgg();
      if (defaultAgg === 1) {
        this.alert_default_agg = true;
      } else if (defaultAgg === 2) {
        this.alert_default_agg_closest_event = true;
      } else if (defaultAgg === 0) {
        // check if this is a new window to save or an existing window that's being edited
        if (this.edit_window_index === -1) {
          this.collection_windows.push(JSON.parse(JSON.stringify(this.window)));
        } else {
          this.collection_windows.splice(this.edit_window_index, 1, JSON.parse(JSON.stringify(this.window)));
          this.edit_window_index = -1;
          this.pre_edit_window = null;
        }
        this.resetWindow('window', 'window_form');
        this.show_window_form = false;
      }
    },
    setPreset(preset_choice) {
      this.window = JSON.parse(JSON.stringify(preset_choice));
      this.$refs["preset_window"].reset();
    }
  }
}
</script>

<style scoped>

</style>
