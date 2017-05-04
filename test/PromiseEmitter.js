var assert = require('assert');

var PromiseEmitter = require('../index');

describe('PromiseEmitter', function() {
    var pe = new PromiseEmitter();

    it('should not be null ', function() {
        assert.notEqual(pe, undefined);
    });

    it('should have method promise ', function() {
        assert.notEqual(pe.promise, undefined);
    });

    it('should have method resolve ', function() {
        assert.notEqual(pe.resolve, undefined);
    });

    pe.resolve('add', function(promise, a, b){
        promise.resolve(a+b);
    });

    var arg1=2, arg2=3;
    it('should return '+(arg1+arg2), function(done) {
        pe.promise('add', arg1, arg2).then(
            function(res){
                assert.equal(res, arg1+arg2);
                done();
            }
        );
    });

    it('should work back to front', function(done) {
        pe.promise('multiply', arg1, arg2).then(
            function(res){
                assert.equal(res, arg1*arg2);
                done();
            },
            function(err){
                assert.fail(err);
                done();
            }
        );
        pe.resolve('multiply', function(promise, a, b){
            promise.resolve( a*b );
        });
    });

    it('should timeout', function(done) {
        pe.promise('nonExistingPromise', arg1, arg2).then(
            function(res){
                assert.fail(res, {}, 'Resolve should not be called', '!=');
                done();
            },
            function(err){
                assert.ok(err);
                done();
            }
        );
    });
});
