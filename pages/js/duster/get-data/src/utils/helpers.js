function irbOrDpaStr(str) {
  if (str)
    return str.startsWith('DPA-') ? str : 'IRB ' + str
  return ""
}

function toTitleCase(str) {
  if (str) {
    str = str.replace(/_/g, ' ')
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() +
          txt.substr(1).toLowerCase();
      }
    );
  }
  return ""
}

function queryLabel(str) {
  if (str) {
    const label = str.replace(/[\w_]*: */i, "");
    return toTitleCase(label);
  }
  return ""
}

function queryMessage(str) {
  if (str) {
    const label = str.replace(/duster_pid\d+(_cw\d+)?_/i, "");
    return toTitleCase(label);
  }
  return ""
}

function formLabel(str) {
  if (str) {
    const label = str.replace(/(cw\d+_)?/i, "");
    return toTitleCase(label);
  }
  return ""
}

export { toTitleCase, queryLabel, queryMessage, formLabel, irbOrDpaStr }
