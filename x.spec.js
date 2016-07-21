let expect = require('chai').expect;
var actives = require('./test/actives');

describe('x.js', () => {

    it('A', () => {
        var child = actives.Box.create();
        child.add('Counter', () => {
            return {
                counter: 1
            };
        });

        child.connect('CounterState', 'Counter')
            .state(({Counter}) => {
                return {Counter};
            });

        var box = actives.Box.create();

        box.add('Box1', child);
        box.add('Box2', child.create());

        expect(box.get('Box1/Counter/counter')).equal(1);
        expect(box.get('Box1/CounterState/Counter/counter')).equal(1);

        expect(box.get('Box2/Counter/counter')).equal(1);
        expect(box.get('Box2/CounterState/Counter/counter')).equal(1);


        box.Box1.Counter.counter = 5;
        expect(box.get('Box1/Counter/counter')).equal(5);
        expect(box.get('Box1/CounterState/Counter/counter')).equal(5);

        expect(box.get('Box2/Counter/counter')).equal(1);
        expect(box.get('Box2/CounterState/Counter/counter')).equal(1);

        box.Box2.Counter.counter = 31;
        expect(box.get('Box2/Counter/counter')).equal(31);
        expect(box.get('Box2/CounterState/Counter/counter')).equal(31);

        expect(box.get('Box1/Counter/counter')).equal(5);
        expect(box.get('Box1/CounterState/Counter/counter')).equal(5);
    });

});