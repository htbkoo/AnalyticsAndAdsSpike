import * as React from 'react';
import {FormEvent, PureComponent} from 'react';
import * as ReactGA from 'react-ga';

import Router from './Router';

function asDisplayString(value) {
    if (typeof value === 'string') {
        return `'${value}'`;
    }
    return value.toString();
}

function renderConfigString(config, indent = '') {
    return [
        '{',
        ...Object.keys(config).map((key) => {
            if (config[key] === undefined || config[key] === null) {
                return '';
            }
            return `\t${key}: ${asDisplayString(config[key])}`;
        }).filter(value => value),
        '}'
    ].reduce(
        (result, element, index, array) => {
            return `${result}${indent}${element}${index < array.length - 1 ? '\n' : ''}`;
        },
        ''
    );
}

interface ConfigType {
    trackingId: string,
    debug: boolean,
    gaOptions: object
}

interface AppState {
    reactGaInitialised: boolean,
    configs: ConfigType[]
}

const DEFAULT_CONFIG: ConfigType = {
    trackingId: '',
    debug: true,
    gaOptions: {
        cookieDomain: 'none'
    }
};

export default class App extends PureComponent<{}, AppState> {
    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            reactGaInitialised: false,
            configs: [DEFAULT_CONFIG]
        };
    }

    public componentDidMount(): void {
        this.tryInitializingMyGA();
    }

    public render() {
        const {configs, reactGaInitialised} = this.state;
        if (reactGaInitialised) {
            return (
                <div>
                    <h4>App is Initialised. Refresh page to reset.</h4>
                    <Router/>
                </div>
            );
        }
        let initializationDebug = (
            <pre>
                ReactGA.initialize({this.renderConfigs()});
            </pre>
        );
        if (this.filteredConfigs().length === 0) {
            initializationDebug = <p>No Valid Configs set.</p>;
        }
        return (
            <form onSubmit={this.initReactGA}>
                <p>Input your configs below:</p>
                {configs.map(({trackingId, debug}, index) => (
                    <div key={index}>
                        <div>
                            TrackingID:&nbsp;
                            <input value={trackingId}
                                   onChange={this.updateConfig.bind(this, index, 'trackingId', 'text')}/>
                            &nbsp;Debug&nbsp;
                            <input
                                type="checkbox"
                                checked={debug || false}
                                onChange={this.updateConfig.bind(this, index, 'debug', 'checkbox')}
                            />
                        </div>
                    </div>
                ))}
                <button type="button" onClick={this.addConfig}>Add Config</button>
                <button type="submit" disabled={configs.length < 1}>
                    {configs.length < 1 ? 'Add Configs first' : 'Run the initialize function as below'}
                </button>
                {initializationDebug}
            </form>
        );
    }

    private filteredConfigs = () => {
        return this.state.configs.filter(({trackingId: id}) => id);
    };

    private initReactGA = (event: FormEvent) => {
        event.preventDefault();
        if (this.filteredConfigs().length === 0) {
            return;
        }
        ReactGA.initialize(this.state.configs);
        // Send initial test view
        ReactGA.pageview('test-init-pageview');
        this.setState({reactGaInitialised: true});
    };

    private addConfig = () => {
        this.setState({
            configs: [...this.state.configs, DEFAULT_CONFIG]
        });
    };

    private updateConfig = (configIndex, key, type, event) => {
        const config = this.state.configs[configIndex];
        let value;
        if (type === 'checkbox') {
            value = !config[key];
        } else {
            value = event.target.value;
        }
        const newConfig = {
            ...config,
            [key]: value
        };
        this.setState({
            configs: [
                ...this.state.configs.slice(0, configIndex),
                newConfig,
                ...this.state.configs.slice(configIndex + 1)
            ]
        });
    };

    private renderConfigs = () => {
        const configs = this.filteredConfigs();
        if (configs.length === 0) {
            return '';
        }
        if (configs.length === 1) {
            const {trackingId, ...options} = configs[0];
            return `'${trackingId}'${Object.keys(options).map(key => options[key]).filter(val => val).length ? `, ${JSON.stringify(options)}` : ''}`;
        }
        return `[\n${
            configs.reduce((result, config, index, array) => {
                const configString = renderConfigString(config, '\t');
                return `${result}${result ? '\n' : ''}${configString}${index < array.length - 1 ? ',' : ''}`;
            }, '')
            }\n]`;
    };

    private tryInitializingMyGA = () => {
        const myGaTrackingId = process.env.REACT_APP_MY_GA_TRACKING_ID;
        if (myGaTrackingId) {
            console.debug(`GA_TRACKING_ID found in process, initializing`);
            const myGAConfig: ConfigType = {
                ...DEFAULT_CONFIG,
                trackingId: myGaTrackingId,
            };
            ReactGA.initialize([myGAConfig]);
            ReactGA.pageview('/');
        } else {
            console.debug(`GA_TRACKING_ID not found`);
        }
    }
}