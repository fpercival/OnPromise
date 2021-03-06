

function PromiseEvent(EventName){
    let q=[];
    let self = this;
    let handlers = [];
    this.name=EventName;

    this.handle = function(handler){
        handlers.push(handler);
        while(q.length){
            q[0]();
            q.shift();
        }
    };

    this.emit = function(timeout, args){
//        let args = [].slice.apply(arguments);
        var prm = new Promise(function(pResolve, pReject){
            let eventObj = {};
            let i=0;
            let done=false;
            let tout;
            let rejectAfter = timeout||1000;

            function _clearTimeout(){
                if(tout){
                    clearTimeout(tout);
                    tout=undefined;
                }
            }

            eventObj.resolve = function(){
                if(!done){
                    done = true;
                    _clearTimeout();
                    pResolve.apply(undefined, arguments);
                }
            };

            eventObj.reject = function(){
                if(!done){
                    done = true;
                    _clearTimeout();
                    pReject.apply(undefined, arguments);
                }
            };
            args.unshift(eventObj);

            function _callHandlers(){
                for(i=0; i<handlers.length && !done; i++){
                    handlers[i].apply(null, args );
                }
            }

            tout = setTimeout(
                ()=>{
                    tout = undefined;
                    eventObj.reject( new Error('PromiseEmitter timed out waiting for "' + self.name + '" after ' + rejectAfter+'ms.' ) );
                },
                rejectAfter
            );

            if(handlers.length==0){
                q.push( _callHandlers );
            } else {
                _callHandlers();
            }
        });
        return prm;
    };

}

function PromiseEmitter(){
    let self = this;
    let promises = {};

    function getPromise(pName, createIfNotFound){
        let p = promises[pName];
        if(!p && createIfNotFound){
            p = new PromiseEvent(pName);
            promises[pName] = p;
        }
        return p;
    }

    self.promise = function(){
        let args = [].slice.apply(arguments);
        let timeout=0;
        let pname = args.shift();
        if(typeof pname == 'number'){
            timeout = pname;
            pname = args.shift();
        }
        let p = getPromise(pname, true);
        return p.emit(timeout, args);
    };

    self.resolve = function( promiseNme, handleFunction ){
        let args = [].slice.apply(arguments);
        let pname = args.shift();
        let handler = args.shift();
        let p = getPromise(pname, true);
        p.handle( handler );
    };

}

module.exports = PromiseEmitter

