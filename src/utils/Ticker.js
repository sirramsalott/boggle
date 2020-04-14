import React from 'react';

class Ticker extends React.Component {
    constructor(props) {
        super(props);
        this.tick = this.tick.bind(this);
        this.state = {time: 0};
    }

    componentDidMount() {
        this.interval = setInterval(this.tick, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    tick() {
        this.state.time += 1;
        this.props.onTick(this.state.time);
    }

    render() {
        return null;
    }

};

export default Ticker;
