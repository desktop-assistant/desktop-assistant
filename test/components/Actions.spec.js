import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import Actions from '../../app/components/Actions';

describe('Actions component', () => {
  it('should match exact snapshot', () => {
    const tree = renderer
      .create(
        <div>
          <Router>
            <Actions />
          </Router>
        </div>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
