const LOAD = 'desktop-assistant/task/LOAD'

const reducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD:
      return {
        data: action.data
      };
    default:
      return state;
  }
};

/**
 * Simulates data loaded into this reducer from somewhere
 */
export const loadTask = data => ({ type: LOAD, data });

export default reducer;
