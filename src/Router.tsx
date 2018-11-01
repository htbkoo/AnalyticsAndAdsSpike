/**
 * Original Source code from https://reacttraining.com/react-router/web/example/basic
 */

import * as React from 'react';
import {HashRouter as Router, Link, Route} from 'react-router-dom';

import Events from './Events';
import withTracker from './withTracker';

const Topic = ({match}) => (
    <div>
        <h3>{match.params.topicId}</h3>
    </div>
);

const Home = () => (
    <div>
        <h2>Home</h2>
    </div>
);

const About = () => (
    <div>
        <h2>About</h2>
    </div>
);

const Topics = ({match}) => (
    <div>
        <h2>Topics</h2>
        <ul>
            <li>
                <Link to={`${match.url}/rendering`}>
                    Rendering with React
                </Link>
            </li>
            <li>
                <Link to={`${match.url}/components`}>
                    Components
                </Link>
            </li>
            <li>
                <Link to={`${match.url}/props-v-state`}>
                    Props v. State
                </Link>
            </li>
        </ul>

        <Route path={`${match.url}/:topicId`} component={withTracker(Topic)}/>
        <Route
            exact={true}
            path={match.url}
            render={() => (
                <h3>Please select a topic.</h3>
            )}
        />
    </div>
);

const BasicExample = () => (
    <Router>
        <div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/topics">Topics</Link></li>
                <li><Link to="/events">Events</Link></li>
            </ul>

            <hr/>

            <Route exact={true} path="/" component={withTracker(Home)}/>
            <Route path="/about" component={withTracker(About)}/>
            <Route path="/topics" component={withTracker(Topics)}/>
            <Route path="/events" component={withTracker(Events)}/>
        </div>
    </Router>
);

export default BasicExample;
