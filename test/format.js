
var ff = require('../src/format');
var Stream = require('../src/stream');
var assert = require('assert');

function test(thisobj,i,e,method){
  var input = Stream.fromArray(i);
  var exargs= Array.prototype.slice.call(arguments,4);
  assert.deepEqual(thisobj[method].apply(thisobj,[input].concat(exargs)).toArray() , e);
}

describe('file-format',function(){
  describe('in',function(){
    describe('separatedValue()', function(){
      it('ignore separate in single-quote',function(){
        var input = ["a,'x,y',c"],
            expct = [['a','x,y','c']];
        test(ff.in , input , expct , 'separatedValue', ',');
      });

      it('ignore separate in double-quote',function(){
        var input = ['a,"x,y",c'],
            expct = [['a','x,y','c']];
        test(ff.in , input , expct , 'separatedValue', ',');
      });

      it('consider unclosed quotation as literary string',function(){
        var input = ['a,"x,y'],
            expct = [['a','"x,y']];
        test(ff.in , input , expct , 'separatedValue', ',');
      });

      it('no process if input is not string',function(){
        var input = [1,2],
            expct = [1,2];
        test(ff.in , input , expct , 'separatedValue', ',');
      });
    });

    describe('csv()',function(){
      it('parse csv string',function(){
        var input = ['a,b,c','d,e,f'],
            expct = [['a','b','c'],['d','e','f']];
        test(ff.in , input , expct , 'csv');
      });
    });

    describe('tsv()',function(){
      it('parse tsv string',function(){
        var input = ['a\tb,c','d,e\tf'],
            expct = [['a','b,c'],['d,e','f']];
        test(ff.in , input , expct , 'tsv');
      });
    });

    describe('ltsv()',function(){
      it('parse ltsv string',function(){
        var input = ['a:1\tb:2:3\tc'],
            expct = [{a:'1' , b:'2:3' , '3':'c'}];
        test(ff.in , input , expct , 'ltsv');
      });
    });

    describe('plain()',function(){
      it('parse plain string',function(){
        var input = ['a:1\tb:2:3\tc'],
            expct = ['a:1\tb:2:3\tc'];
        test(ff.in , input , expct , 'plain');
      });
    });

    describe('json()',function(){
      it('parse json object string',function(){
        var input = JSON.stringify({a:1,b:2,c:['a']},null,2).split('\n'),
            expct = [{a:1,b:2,c:['a']}];
        test(ff.in , input , expct , 'json');
      });

      it('parse json array string',function(){
        var input = JSON.stringify({a:1,b:2,c:['a']},null,2).split('\n'),
            expct = [{a:1,b:2,c:['a']}];
        test(ff.in , input , expct , 'json');
      });
    });
/*

    describe('plain()', function(){
      var input = Stream.fromArray(["abc"]);
      var expected = ["abc"];
      assert.equal(expected,ff.in.plain(input).toArray());
    });

    describe('regexp()', function(){
      var input = Stream.fromArray(["a@b@"]);
      var pattern = '^(.+)@(.+)@(.*)$';
      var expected = [['a','b','']];
      assert.equal(expected,ff.in.regexp(input,pattern).toArray());
    });

    describe('json()', function(){
      var input = {a:1, b:[2,3], c:null},
          s = Stream.fromArray(JSON.stringify(input,null,2).split(/[\r\n]/g));
      var expected = [{a:1, b:[2,3], c:null}];
      assert.equal(expected,ff.in.json(s).toArray());
    });

    describe('json()2', function(){
      var input = [{a:1, b:[2,3], c:null}],
          s = Stream.fromArray(JSON.stringify(input,null,2).split(/[\r\n]/g));
      var expected = [{a:1, b:[2,3], c:null}];
      assert.equal(expected,ff.in.json(s).toArray());
    });
  });

  describe('out',function(){
    describe('json()', function(){
      var input = [{a:1,b:2},{a:3,b:4}],
          s = Stream.fromArray(input),
          expected = [{a:1,b:2},{a:3,b:4}];
      assert.eq(expected,JSON.parse(ff.out.json(s).toArray().join('\n')));
    });

    describe('csv()', function(){
      var input = [['a1','b1'],['a2','b2']],
          s = Stream.fromArray(input),
          expected = 'a1,b1\na2,b2';
      assert.eq(expected,ff.out.csv(s).toArray().join('\n'));
    });

    describe('tsv()', function(){
      var input = [['a1','b1'],['a2','b2']],
          s = Stream.fromArray(input),
          expected = 'a1\tb1\na2\tb2';
      assert.eq(expected,ff.out.tsv(s).toArray().join('\n'));
    });

    describe('ltsv()', function(){
      var input = [{b:1,a:2},{b:3,a:4}],
          s = Stream.fromArray(input),
          expected = 'b:1\ta:2\nb:3\ta:4';
      assert.eq(expected,ff.out.ltsv(s).toArray().join('\n'));
    });
*/
  });
});
