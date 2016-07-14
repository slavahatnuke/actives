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

});