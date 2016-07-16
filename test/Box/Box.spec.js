require('chai').should();
let expect = require('chai').expect;

var actives = require('../actives');
let Box = require('../actives').Box;

describe('Box', () => {
    it('should be created as new Box', () => {
        expect(new Box).to.be.instanceof(Box);
    });

    it('should be created as Box.create()', () => {
        expect(Box.create()).to.be.instanceof(Box);
    });

    it('A', () => {
        var box = Box.create();
        box.add('Value', 1);

        var value = box.get('Value');
        expect(value).equal(1);
        box.add('Value', 5);

        var value = box.get('Value');
        expect(value).equal(5);
    });

    it('A', () => {
        var box = Box.create();

        class Counter {
            constructor() {
                this.counter = 0;
            }

            get() {
                return this.counter;
            }

            up() {
                this.counter++;
            }

            down() {
                this.counter--;
            }
        }

        box.add('Counter', Counter);
        var counter = box.get('Counter');

        expect(counter.counter).equal(0);
        counter.up();
        expect(counter.counter).equal(1);

        box.add('Value', 5);
        var value = box.get('Value');
        expect(value).equal(5);

        var value = box.get('ValueZZZ');
        expect(value).equal(undefined);
    });

    it('A', () => {
        var box = Box.create();

        class Counter {
            constructor(counter = 0) {
                this.counter = counter;
            }

            get() {
                return this.counter;
            }

            up() {
                this.counter++;
            }
        }

        class YourService {
            constructor(counter) {
                this.counter = counter
            }
        }

        box.add('defaultCounterValue', 55);
        box.add('Counter', Counter, ['defaultCounterValue']);
        box.add('YourService', YourService, ['Counter']);

        var service = box.get('YourService');
        var counter = box.get('Counter');

        expect(counter.counter).equal(55);
        expect(counter).equal(service.counter);
        expect(counter.counter).equal(service.counter.counter);
    });

    it('A', () => {

        let box = actives.Box.create();

        box.add('sum', () => {
            return 5 + 5;
        });

        expect(box.get('sum')).equal(10)
    });

    it('A', () => {
        let box = actives.Box.create();

        box.add('A', 1)
        box.add('B', 2)

        box.add('sum', ({A, B}) => {
            return A + B;
        });
        expect(box.get('sum')).equal(3)
    });

    it('A', () => {
        let box = actives.Box.create();

        box.add('A', 1)
        box.add('B', 2)
        box.add('C', 3)

        box.add('sum', ({A, B}) => {
            return A + B;
        }, {
            B: 'C'
        });
        expect(box.get('sum')).equal(4)
    });

    it('A', () => {
        let box = actives.Box.create();

        class Counter {
            constructor() {
                this.counter = 0;
            }

            get() {
                return this.counter;
            }

            up() {
                this.counter++;
            }
        }

        var value = 0;
        box.add('Value', 0);
        box.add('Counter', Counter);

        box.connect('Presentation', 'Counter')
            .state(({Counter}) => {
                value = Counter.get();
            });

        var counter = box.get('Counter');
        counter.up();

        expect(value).equal(1)

        counter.up();
        expect(value).equal(2)
    });


    it('A', () => {
        let box = actives.Box.create();

        class Counter {
            constructor() {
                this.counter = 0;
            }

            get() {
                return this.counter;
            }

            up() {
                this.counter++;
            }
        }

        box.add('Counter', Counter);

        box.connect('Presentation', 'Counter')
            .state(({Counter}) => {
                return {
                    counter: Counter.get(counter),
                    counterByValue: Counter.counter
                };
            });

        var counter = box.get('Counter');
        counter.up();

        expect(box.get('Presentation')).deep.equal({
            counter: 1,
            counterByValue: 1
        });

        counter.up();

        expect(box.get('Presentation')).deep.equal({
            counter: 2,
            counterByValue: 2
        });
    });


    it('A', () => {
        let box = actives.Box.create();

        class Counter {
            constructor() {
                this.counter = 0;
            }

            get() {
                return this.counter;
            }

            up() {
                this.counter++;
            }
        }

        box.add('Counter', Counter);

        box.connect('Presentation', 'Counter')
            .state(({Counter}) => {
                return {
                    counter: Counter.get(counter)
                };
            });

        var testPresentation = null;
        box.connect('MyPresentation', 'Presentation')
            .state(({Presentation}) => {
                testPresentation = {
                    Presentation
                };
            });

        var counter = box.get('Counter');
        counter.up();

        expect(testPresentation).deep.equal({
            Presentation: {
                counter: 1
            }
        });

        counter.up();

        expect(testPresentation).deep.equal({
            Presentation: {
                counter: 2
            }
        });

    });


    it('A', () => {
        let box = actives.Box.create();

        class Counter {
            constructor() {
                this.counter = 0;
            }

            get() {
                return this.counter;
            }

            up() {
                this.counter++;
            }
        }

        box.add('Counter', Counter);

        box.connect('Presentation', 'Counter')
            .state(({Counter}) => {
                return {
                    counter: Counter.get()
                };
            })

        expect(box.get('Presentation')).deep.equal({
            counter: 0
        });
    });


    it('A', () => {
        let box = actives.Box.create();

        class Counter {
            constructor() {
                this.counter = 0;
            }

            get() {
                return this.counter;
            }

            up() {
                this.counter++;
            }
        }

        box.add('Counter', Counter);

        let stateCounter = 0;
        let actionsCounter = 0;

        box.connect('Presentation', 'Counter')
            .state(({Counter}) => {
                stateCounter++;
                return {
                    counter: Counter.get()
                };
            })
            .actions(({Counter}) => {
                actionsCounter++;
                return {
                    onUp: () => Counter.up()
                };
            });

        expect(stateCounter).equal(0);
        expect(actionsCounter).equal(0);

        let onUp = box.get('Presentation').onUp;
        box.get('Presentation').onUp();
        let onUp2 = box.get('Presentation').onUp;

        expect(onUp).equal(onUp2);
        expect(stateCounter).equal(3);
        expect(actionsCounter).equal(1);

        box.get('Presentation').onUp();

        expect(stateCounter).equal(5);
        expect(actionsCounter).equal(1);


    });


    it('A', () => {
        let box = actives.Box.create();

        class Counter {
            constructor() {
                this.counter = 0;
            }

            get() {
                return this.counter;
            }

            up() {
                this.counter++;
            }
        }

        box.add('Counter', Counter);

        box.connect('Presentation', 'Counter')
            .state(({Counter}) => {
                return {
                    counter: Counter.get()
                };
            })
            .actions(({Counter}) => {
                return {
                    onUp: () => Counter.up()
                };
            });

        expect(box.get('Presentation').counter).equal(0);
        box.get('Presentation').onUp();
        expect(box.get('Presentation').counter).equal(1);
        box.get('Presentation').onUp();
        expect(box.get('Presentation').counter).equal(2);

    });


    it('A', () => {
        let box = actives.Box.create();

        class Counter {
            constructor() {
                this.counter = 0;
            }

            get() {
                return this.counter;
            }

            up() {
                this.counter++;
            }
        }

        box.add('Counter', Counter);

        box.connect('Presentation', 'Counter')
            .state(({Counter}) => {
                return {
                    counter: Counter.get()
                };
            })
            .actions(({Counter}) => {
                return {
                    onUp: () => Counter.up()
                };
            });

        let renderData = {};

        box.add('Renderer', () => (data) => renderData = data)

        box.connect('View', 'Presentation')
            .state(({Presentation, Renderer}) => {
                Renderer(Presentation)
            });

        expect(renderData.counter).equal(undefined);

        box.get('View');
        expect(renderData.counter).equal(0);
        box.get('Presentation').onUp();
        expect(renderData.counter).equal(1);

        box.get('Counter').up();
        expect(renderData.counter).equal(2);

    });


    it('A', () => {
        let box = actives.Box.create();

        let testData = {};
        box.add('render', () => (data) => testData = data);
        box.get('render')({hello: 'action'})

        expect(testData).deep.equal({
            hello: 'action'
        })
    });


    it('A', () => {
        let box = actives.Box.create();

        let testData = 0;

        box.add('value', 3);
        box.add('sum', (value) => (data) => testData = data + value, ['value']);
        let result = box.get('sum')(7)

        expect(result).equal(10)
        expect(testData).equal(10)
    });


    it('A', () => {
        let box = actives.Box.create();

        let testData = 0;

        box.add('value', 3);
        box.add('sum', ({value}) => (data) => testData = data + value);
        let result = box.get('sum')(7)

        expect(result).equal(10)
        expect(testData).equal(10)
    });


    it('A', () => {
        let box = actives.Box.create();

        box.add('value', 3);
        box.add('sum', ({value}) => (data) => data + value);

        box.connect('sumView', 'sum')
            .state(({sum}) => {
                return {
                    result: sum(5)
                };
            });

        expect(box.get('sumView').result).equal(8)
    });


    it('A', () => {
        let box = actives.Box.create();

        box.add('value', 3);
        box.add('sum', ({value}) => (data) => data + value);

        let stateCounter = 0;

        box.connect('sumView', 'sum')
            .state(({sum}) => {
                stateCounter++;
                return {
                    result: sum(5)
                };
            });

        expect(stateCounter).equal(0)
        var sum = box.get('sum');
        expect(stateCounter).equal(0)

        sum(5);
        expect(stateCounter).equal(1)
        sum(5);
        sum(5);
        expect(stateCounter).equal(3)
    });


    it('A', () => {
        let box = actives.Box.create();

        class Counter {
            constructor() {
                this.counter = 0;
            }

            get() {
                return this.counter;
            }

            up() {
                this.counter++;
            }
        }

        box.add('counter1', Counter);
        box.add('counter2', Counter);

        box.connect('complexView', ['counter1', 'counter2'])
            .state(({counter1, counter2}) => {
                return {
                    counter1,
                    counter2
                };
            });

        expect(box.get('complexView')).deep.equal({
            counter1: {
                counter: 0
            },
            counter2: {
                counter: 0
            }
        })

        box.get('counter1').up();

        expect(box.get('complexView')).deep.equal({
            counter1: {
                counter: 1
            },
            counter2: {
                counter: 0
            }
        })

        box.get('counter1').up();
        box.get('counter2').up();

        expect(box.get('complexView')).deep.equal({
            counter1: {
                counter: 2
            },
            counter2: {
                counter: 1
            }
        })


    });


    it('A', () => {
        let box = actives.Box.create();

        class Counter {
            constructor() {
                this.counter = 0;
            }

            get() {
                return this.counter;
            }

            up() {
                this.counter++;
            }
        }

        box.add('counter1', Counter);
        box.add('counter2', Counter);

        box.connect('complexView', ['counter1', 'counter2'])
            .state(({counter1, counter2}) => {
                return {
                    counter1: counter1.get(),
                    counter2: counter2.get()
                };
            });

        expect(box.get('complexView')).deep.equal({
            counter1: 0,
            counter2: 0
        })

        box.get('counter1').up();

        expect(box.get('complexView')).deep.equal({
            counter1: 1,
            counter2: 0
        })
    });


    it('A', () => {
        let box = actives.Box.create();

        class Counter {
            constructor() {
                this.counter = 0;
            }

            get() {
                return this.counter;
            }

            up() {
                this.counter++;
            }
        }

        box.add('counter1', Counter);
        box.add('counter2', Counter);

        box.connect('complexView', ['counter1', 'counter2'])
            .state(({counter1, counter2}) => {
                return {
                    counter1: counter1.get(),
                    counter2: counter2.get()
                };
            })
            .actions(({counter1, counter2}) => {
                return {
                    onUp1: () => counter1.up(),
                    onUp2: () => counter2.up()
                };
            });

        expect(box.get('complexView').counter1).equal(0);
        expect(box.get('complexView').counter2).equal(0);

        box.get('complexView').onUp1();

        expect(box.get('complexView').counter1).equal(1);
        expect(box.get('complexView').counter2).equal(0);

        box.get('complexView').onUp2();

        expect(box.get('complexView').counter1).equal(1);
        expect(box.get('complexView').counter2).equal(1);

    });


    it('A', () => {
        let app = actives.Box.create();

        class Counter {
            constructor() {
                this.counter = 0;
            }

            get() {
                return this.counter;
            }

            up() {
                this.counter++;
            }
        }

        let CounterBox = actives.Box.create();

        CounterBox.add('counter', Counter);

        app.add('CounterBox', CounterBox);

        expect(app.get('CounterBox')).equal(CounterBox);
        expect(app.get('CounterBox/counter')).equal(CounterBox.get('counter'))
        expect(app.get('CounterBox/counter/counter')).equal(0);
        expect(app.get('CounterBox/counter/counter/abcd')).equal(undefined);
        expect(app.get('no-name')).equal(undefined);

    });


    it('A', () => {
        class Counter {
            constructor(counter = 0) {
                this.counter = counter;
            }

            get() {
                return this.counter;
            }

            up() {
                this.counter++;
            }
        }
        let box = actives.Box.create();
        box.add('defaultValue', 10);
        box.add('counter', Counter, [({defaultValue}) => defaultValue + 5]);

        expect(box.get('counter/counter')).equal(15);
    });

    it('A', () => {
        let box = actives.Box.create();
        box.add('A', 10);
        box.add('B', 20);
        box.add('C', 30);

        box.add('sum', ({A, B}) => A + B, {
            A: 'B',
            B: ({C}) => C + 100
        });

        expect(box.get('sum')).equal(150);
    });

    it('A', () => {
        class Counter {
            constructor(counter = 0) {
                this.counter = counter;
            }

            get() {
                return this.counter;
            }

            up() {
                this.counter++;
            }
        }

        let app = actives.Box.create();


        let creator = () => {
            let CounterBox = actives.Box.create();
            CounterBox.add('defaultValue', 10);
            CounterBox.add('counter', Counter, ['defaultValue']);

            return CounterBox;
        }
        // @@KEEP
        app.add('CounterBox1', creator());
        expect(app.get('CounterBox1/counter/counter')).equal(10);

        app.add('testValue', 25);
        app.add('CounterBox2', creator(), {
            defaultValue: () => 500,
            valueA: 'testValue'
        });

        expect(app.get('CounterBox2/counter/counter')).equal(500);
        expect(app.get('CounterBox2/valueA')).equal(25);
    });
});