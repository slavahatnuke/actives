# actives

The main idea of `actives` to have ability to write `pure logic` and `pure views`.
Then we connect both (logic and views) for your goals and we get a real view.

It's only concept for now an example below.

## Example
There is an example with reactjs view.

There are some required packages.
```javascript
import React from 'react';
import {render} from 'react-dom';

import {Box} from 'actives';
import connect from 'actives-react';
```
Pure logic and view.
```javascript
// pure logic, it means that logic does not know about view
class Counter {
    constructor() {
        this.counter = 0;
    }

    up() {
        this.counter++;
    }

    get() {
        return this.counter;
    }
}

// pure view, view does not know about logic at all
let CounterView = ({counter, onUp}) => {
    return <div><p>{counter}</p><button onClick={onUp}>up</button></div>
};
```

Make box and define state.
```javascript
// lets make state for counter
let box = new Box;

// add counter to the box
box.add('counter', Counter);

// connect state to the counter
box.connect('counterState', 'counter')
    .state(({counter}) => {
        return {
            counter: counter.get()
        }
    })
    .actions(({counter}) => {
        return {
            onUp: () => counter.up()
        };
    });
```

Connect state/actiions to the view and render.
```javascript
// connect state with view, view should not know about real logic
let CounterWidget = connect(box.counterState)(CounterView);

// render widget now it's connected to state and will react on changes.
render(<CounterWidget />, document.getElementById('app'));
```
you can manipulate with `counter` now and it will present view
```javascript
// you can manipulate `counter`
let counter = box.counter;
setInterval(() => counter.up(), 1000);
```

[This exaple on github](https://github.com/slavahatnuke/actives-reactjs-counter-example)
