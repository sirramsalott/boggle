import React from 'react';

class Ticker extends React.Component {
    constructor(props) {
        super(props);
        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        this.interval = setInterval(this.tick, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    tick() {
        this.props.onTick();
    }

    render() {
        return null;
    }

};

export default Ticker;
