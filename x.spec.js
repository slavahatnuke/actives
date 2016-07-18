let expect = require('chai').expect;
var actives = require('./test/actives');

describe('x.js', () => {

    it('A', () => {
        let app = actives.Box.create();
        let box = actives.Box.create();

        box.add('object', () => {
            return {
                counter: 1,
                up: function () {
                    this.counter++;
                }
            };
        });

    });
});