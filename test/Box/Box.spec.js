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
});