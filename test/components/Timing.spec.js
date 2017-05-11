import React from 'react';
import { shallow } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import Timing from '../../app/components/Timing';

function setup() {
  const component = shallow(<Timing />);
  return {
    component,
    hours: component.find('.hours')
  };
}


describe('Timing component', () => {
  it('should display hours', () => {
    const { hours } = setup();
    expect(hours.text()).toMatch(/^1$/);
  });
});
