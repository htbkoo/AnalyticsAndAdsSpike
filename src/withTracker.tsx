/**
 * From ReactGA Community Wiki Page https://github.com/react-ga/react-ga/wiki/React-Router-v4-withTracker
 */

import * as React from 'react';
import {Component} from 'react';
import * as ReactGA from 'react-ga';

interface HOCProps {
    location: {
        pathname: any
    }
}

export default function withTracker(WrappedComponent, options = {}) {
    const trackPage = (page) => {
        ReactGA.set({
            page,
            ...options
        });
        ReactGA.pageview(page);
    };

    return class extends Component<HOCProps> {
        public componentDidMount() {
            const page = this.props.location.pathname;
            trackPage(page);
        }

        public componentWillReceiveProps(nextProps) {
            const currentPage = this.props.location.pathname;
            const nextPage = nextProps.location.pathname;

            if (currentPage !== nextPage) {
                trackPage(nextPage);
            }
        }

        public render() {
            return <WrappedComponent {...this.props} />;
        }
    };
}
