// components used to display data in populateData.php

var RequestDataTable = Vue.component('request-data-table', {
  props:{
    title: String,
    alertType:String,
    alertContent:String,
    recordBaseUrl:String,
    tableData: Array
  },
  computed: {
    tableHeaders: function() {
      let dataObj;
      if (this.tableData != null && this.tableData[0] != null) {
        dataObj = this.tableData[0];
      } else {
        return;
      }
      let colHeaders = [
        {"text": "redcap_record_id", "value": "redcap_record_id"},
        {"text": "mrn", "value": "mrn"}];
      for (let dateIndex in dataObj.dates) {
        colHeaders.push(
          {
            "text": dataObj.dates[dateIndex].redcap_field_name,
            "value": dataObj.dates[dateIndex].redcap_field_name
          });
      }
      return colHeaders;
    },
    tableRows: function() {
      if (this.tableData != null && this.tableData.length > 0) {
        let tablesRows = []
        for (let index in this.tableData) {
          let row = {};
          row["redcap_record_id"] =
            '<a href="' +this.recordBaseUrl+'&arm=1&id=' +
            this.tableData[index].redcap_record_id  +'">' +
            this.tableData[index].redcap_record_id + '</a>';
          row["mrn"] = this.tableData[index].mrn;
          for (let dateIndex in this.tableData[index].dates) {
            row[this.tableData[index].dates[dateIndex].redcap_field_name]
              = this.tableData[index].dates[dateIndex].value;
          }
          tablesRows.push(row);
        }
        return tablesRows;
      }
    }
  },
  template: '      <div><h3>{{ title }}</h3>' +
    '      <v-alert :type="alertType">' +
    '        {{ alertContent }}' +
    '      </v-alert>' +
    '      <v-data-table' +
    '          :headers="tableHeaders"' +
    '          :items="tableRows"' +
    '          fixed-header' +
    '          dense>' +
    '      <template v-slot:item.redcap_record_id="{ item }">' +
    '          <span v-html="item.redcap_record_id"></span>' +
    '        </template>' +
    '      </v-data-table></div>'
})

var MissingFieldsTable = Vue.component('missing-fields-table', {
  props:{
    tableData: Array
  },
  data: function(){
    return {
      tableHeaders: [{"text": "Form", "value": "form"},
        {"text": "Field", "value": "field"},
        {"text": "Field Format", "value": "format"}]
    }
  },
  computed: {
    tableRows: function() {
      if (this.tableData != null && this.tableData.length > 0) {
        let tablesRows = []
        for (let index in this.tableData) {
          let row = {};
          row["form"] = this.tableData[index].form_label;
          row["field"] = this.tableData[index].label + ' ('+ this.tableData[index].redcap_field_name + ')';
          row["format"] = this.tableData[index].format;
          tablesRows.push(row);
        }
        return tablesRows;
      }
    }
  },
  template: '      <div><h3>Missing Redcap Fields</h3>' +
    '      <v-alert type="error">' +
    '        Duster configured fields are missing. ' +
    'Please add the following fields to this project before proceeding</v-alert>' +
    '      <v-data-table' +
    '          :headers="tableHeaders"' +
    '          :items="tableRows"' +
    '          fixed-header' +
    '          dense' +
    '          hide-default-footer>' +
    '      </v-data-table></div>'
})

var SavedDataTable = Vue.component('saved-data-table', {
    props:{
      recordBaseUrl:String,
      rpData: Array,
      savedData: Object
    },
  methods: {
    getTableHeaders: function (saved_col) {
      let dataObj;
      if (this.rpData != null && this.rpData[0] != null) {
        dataObj = this.rpData[0];
        let colHeaders = [
          {"text": "redcap_record_id", "value": "redcap_record_id"},
          {"text": "mrn", "value": "mrn"}];
        dataObj.dates.forEach(function (dateObj) {
          colHeaders.push(
            {
              "text": dateObj.redcap_field_name,
              "value": dateObj.redcap_field_name
            });
        });
        if (saved_col) {
          colHeaders.push(
            {"text": "Saved Fields", "value": "saved_data"}
          );
        }
        return colHeaders;
      }
    },
    getTableRows: function (data, saved_col) {
      recordBaseUrl = this.recordBaseUrl;
      savedData = this.savedData.data;
      return data
        .map(function (data) {
          let row = {};
          row['redcap_record_id'] = '<a href="' + recordBaseUrl + '&arm=1&id=' +
            data.redcap_record_id + '">' + data.redcap_record_id + '</a>';
          row['mrn'] = data.mrn;
          data.dates.forEach(function (dateObj) {
            row[dateObj.redcap_field_name] = dateObj.value;
          });
          if (saved_col) {
            row['saved_data'] = savedData
              .filter(function (saved) {
                return data.redcap_record_id == saved.redcap_record_id;
              })
              .map(function (saved) {
                return Object.keys(saved)
                  .filter(function (key) {
                    return saved[key] != null && saved[key].length > 0;
                  }).join(", ")
              });
            return row;
          }
        });
    }
  },
    computed: {
      noDataHeaders: function () {
        return this.getTableHeaders(false);
      },
      tableHeaders: function () {
        return this.getTableHeaders(true);
      },
      noDataRows: function () {
        if (this.savedData && this.savedData.ids && Object.values(this.savedData.ids).length > 0) {
          ids = Object.values(this.savedData.ids);
          filteredData = this.rpData
            .filter(function (data) {
              return (ids.indexOf(data.redcap_record_id) == -1)
            });
          return this.getTableRows(filteredData, false);
        } else {
          return null;
        }
      },
      tableRows: function () {
        if (this.savedData != null && this.savedData.ids && Object.values(this.savedData.ids).length > 0) {
          ids = Object.values(this.savedData.ids);
          filteredData = this.rpData
            .filter(function (data) {
              return (ids.indexOf(data.redcap_record_id) > -1)
            });
          return this.getTableRows(filteredData, true);
        } else {
          return null;
        }
      }
    },
    template: '     <div> <h3>Data Saved</h3>' +
      '    <div v-if="noDataRows && noDataRows.length > 0">' +
      '      <v-alert  type="warning">' +
      '        These records were not updated' +
      '      </v-alert>' +
      '      <v-data-table' +
      '          :headers="tableHeaders"' +
      '          :items="noDataRows"' +
      '          fixed-header' +
      '          dense' +
      '          hide-default-footer>' +
      '      <template v-slot:item.redcap_record_id="{ item }">' +
      '          <span v-html="item.redcap_record_id"></span>' +
      '        </template>' +
      '      </v-data-table></div>' +
      '       <div v-if="tableRows">' +
      '      <v-alert type="info">' +
      '        These records have been updated.' +
      '      </v-alert>' +
      '      <v-data-table' +
      '          :headers="tableHeaders"' +
      '          :items="tableRows"' +
      '          fixed-header' +
      '          dense' +
      '          hide-default-footer>' +
      '      <template v-slot:item.redcap_record_id="{ item }">' +
      '          <span v-html="item.redcap_record_id"></span>' +
      '        </template>' +
      '      </v-data-table></div>' +
      //'     <pre>No Data Rows : {{noDataRows}}</pre>' +
      //'     <pre>Table Rows : {{tableRows}}</pre>' +
      '</div>'
  })
