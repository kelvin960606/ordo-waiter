
import { fromJS } from 'immutable';
import menuScreenReducer from '../reducer';

describe('menuScreenReducer', () => {
    it('returns the initial state', () => {
        expect(menuScreenReducer(undefined, {})).toEqual(fromJS({}));
    });
});
