// @flow
import React, { Component } from 'react';

const MODE_HOURS = true;
const MODE_MINUTES = false;

export default class TimePicker extends Component {
  constructor(props: Object) {
    super(props);
    const { hours, minutes } = props;

    this.state = {
      hours,
      minutes
    };
  }

  props: {
    hours: number,
    minutes: number
  }

  getInitialState() {
    const { hours, minutes } = this.props;

    return {
      hours,
      minutes,

      mode: MODE_HOURS
    };
  }

  render() {
    const { hours, minutes, mode } = this.state;
    const { size, radius, militaryTime } = this.props;

    const onChange = (hours, minutes, fireEvent) => {
      this.setState({ hours, minutes });
      if (fireEvent && this.props.onChange) {
        this.props.onChange({ hours, minutes });
      }
    };
    const onChangeMode = mode => {
      this.setState({ mode });
      if (this.props.onChangeMode) {
        this.props.onChangeMode({ hours, minutes });
      }
    };

    const propsInfo = { hours, minutes, mode, size, onChangeMode };
    const propsClock = { hours, minutes, mode, size, onChangeMode, militaryTime, radius, onChange };

    return (
      <div className="timepicker">
        <TimePickerInfo {...propsInfo} />
        <TimePickerClock {...propsClock} />
      </div>
    );
  }
}

TimePicker.defaultProps = {
  hours: 0,
  minutes: 0,
  militaryTime: true
};

class TimePickerInfo extends Component {
  render() {
    const { hours, minutes, mode, size, onChangeMode } = this.props;

    const propsHours = {
      className: (
        `timepicker-info-digits${(mode === MODE_HOURS ? ' active' : '')}`
      ),
      onClick() {
        onChangeMode(MODE_HOURS);
      }
    };

    const propsMinutes = {
      className: (
        `timepicker-info-digits${(mode === MODE_MINUTES ? ' active' : '')}`
      ),
      onClick() {
        onChangeMode(MODE_MINUTES);
      }
    };

    return (
      <p className="timepicker-info" style={{ width: size }}>
        <span {...propsHours}>
          {hours < 10 ? `0${hours}` : hours}
        </span>
        :
        <span {...propsMinutes}>
          {minutes < 10 ? `0${minutes}` : minutes}
        </span>
      </p>
    );
  }
}

class TimePickerClock extends Component {
  constructor(props) {
    super(props);
    const { mode, hours, minutes, militaryTime } = props;

    this.state = {
      hours: hours % (militaryTime ? 24 : 12),
      minutes,
      even: true,
      mode,
      positionsHours: this.calculatePositionsHours(),
      positionsMinutes: this.calculatePositionsMinutes()
    };
  }

  componentWillReceiveProps(props) {
    if (props.size !== this.props.size || props.radius !== this.props.radius) {
      this.setState({
        positionsHours: this.calculatePositionsHours(),
        positionsMinutes: this.calculatePositionsMinutes()
      });
    }

    if (props.mode !== this.props.mode) {
      this.setState({
        mode: props.mode
      });
    }

    if (props.hours !== this.props.hours) {
      this.setState({
        hours: props.hours % (this.props.militaryTime ? 24 : 12)
      });
    }

    if (props.minutes !== this.props.minutes) {
      this.setState({
        minutes: props.minutes
      });
    }
  }

  componentDidMount() {
    this.componentDidUpdate({}, {});
  }

  componentDidUpdate(props, state) {
    const { mode, size } = this.props;
    const { hours, minutes, even, positionsHours, positionsMinutes } = this.state;

    if (props.mode === mode &&
      state.hours === hours &&
      state.minutes === minutes) {
      return;
    }

    let hand1 = even ? this.refs.hand1 : this.refs.hand2;
    let hand2 = even ? this.refs.hand2 : this.refs.hand1;

    if (/^0\.13/.test(React.version)) {
      hand1 = React.findDOMNode(hand1);
      hand2 = React.findDOMNode(hand2);
    }

    hand1.setAttribute('x2', mode ? positionsHours[hours === 0 ? 23 : hours - 1][0] : positionsMinutes[minutes][0]);
    hand1.setAttribute('y2', mode ? positionsHours[hours === 0 ? 23 : hours - 1][1] : positionsMinutes[minutes][1]);

    if (props.mode !== mode) {
      hand2.setAttribute('x2', size / 2);
      hand2.setAttribute('y2', size / 2);
    }

    const hand1Length = Math.hypot(
      hand1.getAttribute('x1') - hand1.getAttribute('x2'),
      hand1.getAttribute('y1') - hand1.getAttribute('y2')
    );

    const hand2Length = Math.hypot(
      hand2.getAttribute('x1') - hand2.getAttribute('x2'),
      hand2.getAttribute('y1') - hand2.getAttribute('y2')
    );

    hand1.style.strokeDasharray = hand1Length;
    hand1.style.strokeDashoffset = hand1Length;
    hand1.style.transitionProperty = 'none';
    hand1.getBoundingClientRect();
    hand1.style.strokeDashoffset = '0';
    hand1.style.transitionProperty = 'stroke-dashoffset';

    hand2.style.strokeDasharray = hand2Length;
    hand2.style.strokeDashoffset = '0';
    hand2.style.transitionProperty = 'none';
    hand1.getBoundingClientRect();
    hand2.style.strokeDashoffset = hand2Length;
    hand2.style.transitionProperty = 'stroke-dashoffset';
  }

  render() {
    const { size } = this.props;
    const { mode } = this.state;

    return (
      <svg width={size} height={size}>
        <line ref="hand1" className="timepicker-hand" x1={size / 2} y1={size / 2} x2={size / 2} y2={size / 2} />
        <line ref="hand2" className="timepicker-hand" x1={size / 2} y1={size / 2} x2={size / 2} y2={size / 2} />

        <g className={mode ? 'timepicker-visible' : 'timepicker-invisible'}>{this.renderHoursBubbles()}</g>
        <g className={mode ? 'timepicker-invisible' : 'timepicker-visible'}>{this.renderMinutesBubbles()}</g>
      </svg>
    );
  }

  renderHoursBubbles() {
    const { hours } = this.state;

    return this.state.positionsHours.map(([x, y], index) => {
      index = (index + 1) % 24;

      const props = {
        key: index,
        className: (
          `timepicker-bubble${
          hours === index ? ' active' : ''}`
        ),

        onClick: this.onClickHour(index),
        onMouseUp: this.onMouseMoveHour(index),
        onMouseMove: this.onMouseMoveHour(index)
      };

      return (<g {...props}>
        <circle cx={x} cy={y} />

        <text x={x} y={y}>
          {index}
        </text>
      </g>);
    });
  }

  renderMinutesBubbles() {
    const { minutes } = this.state;

    return this.state.positionsMinutes.map(([x, y], index) => {
      const props = {
        key: index,
        className: (
          `timepicker-bubble${
          index % 5 !== 0 ? ' small' : ''
          }${minutes === index ? ' active' : ''}`
        ),

        onClick: this.onClickMinute(index),
        onMouseMove: this.onMouseMoveMinute(index)
      };

      return (<g {...props}>
        <circle cx={x} cy={y} />

        {index % 5 === 0 ? (
          <text x={x} y={y}>
            {index}
          </text>
        ) : (
          <circle cx={x} cy={y} />
        )}
      </g>);
    });
  }

  onChange(fireEvent) {
    if (this.props.onChange) {
      this.props.onChange(this.state.hours, this.state.minutes, fireEvent);
    }

    if (this.props.onChangeMode) {
      this.props.onChangeMode(this.state.mode);
    }
  }

  onClickHour(hours) {
    return (event, changeMode = true) => {
      if (this.state.hours === hours && !changeMode) {
        return;
      }

      this.setState({ hours, even: !this.state.even, mode: !changeMode }, () => {
        this.onChange();
      });
    };
  }

  onClickMinute(minutes) {
    return () => {
      if (this.state.minutes === minutes) {
        return;
      }

      this.setState({ minutes, even: !this.state.even }, () => {
        this.onChange(true);
      });
    };
  }

  onMouseMoveHour(hours) {
    const onClickHour = this.onClickHour(hours);

    return (event) => {
      const isMouseUp = event.type === 'mouseup';
      if (isMouseUp || event.buttons === 1) {
        onClickHour(event, isMouseUp);
      }
    };
  }

  onMouseMoveMinute(minutes) {
    const onClickMinute = this.onClickMinute(minutes);

    return (event) => {
      if (event.buttons === 1) {
        onClickMinute();
      }
    };
  }

  calculatePositionsHours() {
    const { size, radius, militaryTime } = this.props;

    let index = 1;
    const positions = [];

    for (; index <= (militaryTime ? 24 : 12); ++index) {
      positions.push([
        (size / 2) + (radius * (militaryTime ? index > 12 ? 1 : 0.65 : 1) * Math.cos((index % 12 / 6 - 0.5) * Math.PI)),
        (size / 2) + (radius * (militaryTime ? index > 12 ? 1 : 0.65 : 1) * Math.sin((index % 12 / 6 - 0.5) * Math.PI))
      ]);
    }

    return positions;
  }

  calculatePositionsMinutes() {
    const { size, radius } = this.props;

    let index = 0;
    const positions = [];

    for (; index < 60; ++index) {
      positions.push([
        (size / 2) + (radius * Math.cos(((index / 30) - 0.5) * Math.PI)),
        (size / 2) + (radius * Math.sin(((index / 30) - 0.5) * Math.PI))
      ]);
    }

    return positions;
  }
}

TimePickerClock.defaultProps = {
  hours: 0,
  minutes: 0,
  mode: true,
  militaryTime: true
};
