<template>
  <v-container pa-0>
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
            <template v-slot:[`item.format`]="{ item }">
              <span>{{item.format}} [{{item.format=="date" ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:MM:SS'}}]</span>
            </template>
            <template v-slot:[`item.actions`]="{ item, index }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-show="index > 0"
                    v-bind="attrs"
                    v-on="on"
                    small
                    class="mr-2"
                    @click="editRPDate(index)"
                  >
                    mdi-pencil
                  </v-icon>
                </template>
                <span>
                  Edit '{{item.label}}'
                </span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-show="index > 0"
                    v-bind="attrs"
                    v-on="on"
                    small
                    @click="delete_date_index = index, delete_date_dialog = true"
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
    </v-container>
</template>

<script>
export default {
  name: "ResearcherProvidedInfoStep",
  props: {
  'rp_identifiers_prop': Array,
  'rp_dates_prop': Array
  },
  computed: {
    rp_identifiers: {
      get() {
        return this.rp_identifiers_prop;
      }
    },
    rp_dates: {
      get() {
        return this.rp_dates_prop;
      },
      set() {
        this.$emit('update:rp_dates_prop', this.rp_dates);
      }
    }
  },
  data: function() {
    return {
      rp_id_headers: [
        {text: 'Label', value: 'label'},
        {text: 'REDCap field name', value: 'redcap_field_name'},
        {text: 'Format', value: 'format'}
      ],
      rp_date_headers: [
        {text: 'Label', value: 'label'},
        {text: 'REDCap field name', value: 'redcap_field_name'},
        {text: 'Format', value: 'format'},
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      new_date_dialog: false,
      edit_date_index: null,
      edit_date_dialog: false,
      delete_date_index: null,
      delete_date_dialog: false,
      new_date: {
        label: null,
        redcap_field_name: null,
        format: null
      },
      edit_date: {
        label: null,
        redcap_field_name: null,
        format: null
      },
      rules: {
        required: value => !!value || 'Required.'
      }
    }
  },
  methods: {
    saveDateForm() {
      this.$refs.date_form.validate();
      this.rp_dates.push(this.new_date);
      this.resetDateForm();
    },
    resetDateForm() {
      this.new_date_dialog = false;
      this.new_date = {
        label: null,
        redcap_field_name: null,
        format: null
      };
      this.$refs.date_form.resetValidation();
    },
    editRPDate(i) {
      this.edit_date_index = i;
      this.edit_date = JSON.parse(JSON.stringify(this.rp_dates[i]));
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
      let fields_arr = this.rp_dates.map(value => value.redcap_field_name);
      // TODO this needs to check all REDCap field names, not just what's in dates
      if (fields_arr.includes(field) && field !== this.rp_dates[this.edit_date_index].redcap_field_name) {
        return 'Enter another field name. This field name is already taken.';
      }
      return true;
    }
  }
}
</script>

<style scoped>

</style>
