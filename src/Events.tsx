import * as React from 'react';
import {PureComponent} from 'react';
import * as ReactGA from 'react-ga';

interface EventsState {
    category: any,
    action: any,
    label: any,
}

export default class Events extends PureComponent<{}, EventsState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            category: '',
            action: '',
            label: ''
        };
    }

    public render() {
        const {category, action, label} = this.state;
        return (
            <form onSubmit={this.sendEvent}>
                <h2>Events</h2>
                <p>Enter in details below to trigger an ReactGA.event call</p>
                <div>
                    category <input value={category} onChange={this.setValue.bind(this, 'category')}/>
                </div>
                <div>
                    action <input value={action} onChange={this.setValue.bind(this, 'action')}/>
                </div>
                <div>
                    label <input value={label} onChange={this.setValue.bind(this, 'label')}/>
                </div>
                <button type="submit">
                    Send Event.
                </button>
            </form>
        );
    }

    private setValue = (key: keyof EventsState, event) => {
        this.setState({
            [key]: event.target.value
        } as { [k in keyof EventsState]: string });
    };

    private sendEvent = (event) => {
        event.preventDefault();
        ReactGA.event(this.state);
        this.setState({
            category: '',
            action: '',
            label: ''
        });
    };
}
