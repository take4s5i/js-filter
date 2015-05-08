

function Stream(f){
  this.next = f;
}

Stream.fromArray= function(ary){
  var i = 0;
  return new Stream(function(){
    return i < ary.length ? ary[i++] : undefined;
  });
};

Stream.prototype.each= function(cb){
  var val;
  while(typeof (val = this.next()) !== 'undefined'){
    cb(val);
  }
};

Stream.prototype.map= function(mapf){
  var self = this;
  return new Stream(function(){
    var val = self.next();
    return typeof val === 'undefined' ? val : mapf(val);
  });
};

Stream.prototype.toArray= function(){
  var acc =[];
  this.each(function(v){
    acc.push(v);
  });
  return acc;
};

module.exports = Stream;
