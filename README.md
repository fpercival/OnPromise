# OnPromise


Solve promises using events

### Install

	npm install --save onpromise
	
### Usage

Create a new emiiter.

	const PromiseEmitter = require("onpromise");

	var pe = new PromiseEmitter();


Resolve and create promise

	// Resolve the 'add' promise
	pe.resolve('add', (promise, a, b)=>{
		promise.resolve( a+b );
	});

	// Create a promise called 'add' and provide arguments. As many arguments as necessary can be supplied
	pe.promise('add', 5, 4).then(
		(res) => {
			console.log('5 + 4 = ', res);
		}
	);


Promises can also be created before a resolver exists.

	pe.promise('multiply', 5, 4).then(
		(res) => {
			console.log('5 x 4 = ', res);
		}
	);

	pe.resolve('multiply', (promise, a, b)=>{
		promise.resolve( a*b );
	});


A timeout can be set. If a promise is not resolved/rejected within the given timeout, it is automatically rejected.
The default timeout is 1000ms

    pe.promise(20, 'multiply', 5, 4).then(...); // Will timeout after approx 20 milliseconds