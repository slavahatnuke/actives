require('chai').should();
let expect = require('chai').expect;
var actives = require('./test/actives');

describe('x.js', () => {

    it('A', () => {
        let box = actives.Box.create();
        box.add('counter', {
            counter: 0,
            up: () => this.counter++
        });
        //
        // box.connect('view', 'counter')
        //     .state(({counter}) => {
        //         return {
        //             counter
        //         };
        //     });
        //
        // console.log(box.get('view'));
    });
});