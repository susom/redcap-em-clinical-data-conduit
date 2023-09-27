function toTitleCase(str) {
    str = str.replace(/_/g,' ')
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() +
          txt.substr(1).toLowerCase();
      }
    );
}

function queryLabel(str) {
  if (str) {
    const label = str.replace(/[\w_]*: */i, "");
    return toTitleCase(label);
  }
}

function queryMessage(str) {
  if (str) {
    const label = str.replace(/duster_pid\d+(_cw\d+)?_/i, "");
    return toTitleCase(label);
  }
}

function formLabel(str) {
  const label = str.replace(/(cw\d+_)?/i, "");
  return toTitleCase(label);
}

export { toTitleCase, queryLabel, queryMessage, formLabel }
