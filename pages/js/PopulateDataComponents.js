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

var RcProgressBar = Vue.component('rc-progress-bar', {
    props:{
      queries: Array,
      rtosLinkUrl: String,
      name: String,
      cohortProgress: Number
    },
  data() {
      return {
        numComplete:0,
        updateMessage: null
      }
  },
  watch: {
    cohortProgress: function() {
      if (this.cohortProgress === 100) {
        this.getAndSaveData();
      }
    }
  },
    computed: {
      numQueries: function() {
        return this.queries.length;
      },
      progress: function() {
        var pctComplete=100* this.numComplete / this.numQueries;
        if (isNaN(pctComplete))
          pctComplete = 0;
        else if (pctComplete > 99.5) {
          pctComplete = 100;
        }
        return pctComplete;
      },
      label: function() {
        return this.toTitleCase(this.name);
      }
    },
  methods: {
      toTitleCase(str) {
        str = str.replaceAll('_',' ');
        return str.replace(
          /\w\S*/g,
          function(txt) {
            return txt.charAt(0).toUpperCase() +
              txt.substr(1).toLowerCase();
          }
        );
      },
    queryLabel(str) {
      var index = str.indexOf(":");
      str = str.substr(index + 1);
      return this.toTitleCase(str.trim());
    },
    async getAndSaveData() {
      for (var i = 0; i < this.queries.length; i++) {
        console.log(this.queries[i].query_name + ":" + JSON.stringify(this.queries[i]));
        console.log("progress :" + this.progress);
        this.updateMessage = this.queryLabel(this.queries[i].query_label) + " in progress.";
        const dataSync = await axios.get(this.rtosLinkUrl
          + JSON.stringify(this.queries[i]));
        this.numComplete++;
        console.log(JSON.stringify(dataSync));
        this.$emit('update:progress', dataSync)
        if (this.numComplete === this.queries.length) {
          this.updateMessage = "Complete";
        }
      }
    }
  },
    template:
      '<v-row> ' +
      '     <v-col md="3"><b> {{ label }}: </b>' +
      '<span v-if="updateMessage"><br>{{ updateMessage }}</span>'+
      '     </v-col>' +
      '     <v-col md="8">' +
      '         <v-progress-linear' +
      '             v-model="progress"' +
      '             height="25"' +
      '             stream' +
      '             >' +
      '           <strong>{{ Math.ceil(progress) }}%</strong>' +
      '         </v-progress-linear>' +
  '     </v-col>' +
      '</v-row>'

})
