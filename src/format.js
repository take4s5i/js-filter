
var Stream = require('./stream');

var format = {
  in: {
    json: function(s){
      var j = JSON.parse(s.toArray().join('\n'));
      return Stream.fromArray(Array.isArray(j) ? j :[j]);
    },
    plain: function(s){
      return s;
    },
    regexp: function(s,pattern){
      var rexp = new RegExp(pattern);
      return s.map(function(row){
        var m = row.match(rexp);
        return m === null ? row : m.slice(1);
      });
    },
    csv: function(s){
      return format.in.separatedValue(s,',');
    },
    tsv: function(s){
      return format.in.separatedValue(s,'\t');
    },
    ltsv: function(s){
      return format.in.tsv(s).map(function(tsv){
        var acc = {};

        for(var i = 0; i < tsv.length; i++){
          var pair = tsv[i].split(':'),
              name = pair.length < 2 ? (i + 1).toString() : pair[0],
              value = pair.length < 2 ? tsv[i] : pair.slice(1).join(':');
          acc[name] = value;
        }
        return acc;
      });
    },
    separatedValue : function(s,sep){
      return s.map(function(row){
        if(typeof row !== 'string') return row;

        var state = { name : 'default' },
            cols = [],
            rowsep =  row.split(sep);

        for(var i=0; i < rowsep.length; i++){
          var col = rowsep[i];
          if(state.name === 'default'){
            if(col[0] === '"' || col[0] === "'"){
              state.name = "quoting";
              state.quote = col[0];
              state.acc = [];
            }else{
              cols.push(col);
            }
          }

          if(state.name === 'quoting'){
            state.acc.push(col);
            var last  = col[col.length - 1];
                last2 = col.substr(col.length - 2,1);

            if(last === state.quote && last2 !== "\\"){
              state.name = "default";
              var c = state.acc.join(sep);
              cols.push(c.substr(1,c.length -2));
              delete state.quote;
              delete state.acc;
            }
          }
        }

        if(state.name !== 'default'){
          cols.push(state.acc.join(sep));
        }
        return cols;
      });
    }
  },
  out: {
    json: function(s){
      var txt = JSON.stringify(s.toArray(),null,2);
      return Stream.fromArray(txt.split(/[\r\n]/));
    },
    separatedValue: function(s,sep){
      return s.map(function(obj){
        if(typeof obj !== 'object' || !Array.isArray(obj)) return obj;
        var vals = "";

        for(var i = 0; i < obj.length; i++){
          vals += sep + obj[i];
        }
        return vals.substr(1);
      });
    },
    csv: function(s){
      return formatter.separatedValue(s,',');
    },
    tsv: function(s){
      return formatter.separatedValue(s,'\t');
    },
    ltsv: function(s){
      var sm = s.map(function(obj){
        if(typeof obj !== 'object') return obj;
        return Object.keys(obj).map(function(k){
          return k + ':' + obj[k];
        });
      });
      return formatter.separatedValue(sm,'\t');
    }
  }
}

module.exports = format;
