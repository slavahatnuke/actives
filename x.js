var Reflection = require('./src/Reflection/Reflection');
var Decorator = require('./src/Reflection/Decorator');

class Counter {
    constructor() {
        this.counter = 0;
    }

    up() {
        // console.log('this', this);
        this.counter++;
    }

    down() {
        this.counter--;
    }
}

let counter = new Counter();
// console.log(Reflection.getNames(counter));
// console.log(counter instanceof Counter);
// console.log(Reflection.clone(counter) instanceof Counter);
//

let wrapper = new Decorator(counter, (report) => console.log(report));
console.log(wrapper instanceof Counter);

// box.get('Counter');

wrapper.up();
console.log(wrapper.counter);


var a = [1,2,3];
