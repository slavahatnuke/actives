# actives

The main idea of `actives` to have ability to write `pure logic` (PL) and `pure views` (PV). (PL) <-> (PV).
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

    go() {
        setInterval(() => this.up(), 1000);
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
// let's make state for counter
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

Connect state/actions to the view and render.
```javascript
// connect state with view, view should not know about real logic
let CounterWidget = connect(box.counterState, CounterView);

// render widget now it's connected to state. And it will react on changes.
render(<CounterWidget />, document.getElementById('app'));
```

You can manipulate `counter` (logic instance). And it will present view.
```javascript
// lets GO!
let counter = box.counter;
counter.go();
```

### Counter example on GitHub 
It's an example with the simplest counter to get an idea. [example](https://github.com/slavahatnuke/actives-reactjs-counter-example)

### Todos example on GitHub
It's an example with todo list. Follow to get more ideas [example](https://github.com/slavahatnuke/actives-reactjs-todos-example)

### React-native + Web app, example on GitHub
Two apps - Web and Mobile Native apps with same codebase. It's an example with the simplest counter. To get ideas simply. 
[example](https://github.com/slavahatnuke/actives-react-native-and-web-counter)



