
import { fromJS } from 'immutable';
import myAppScreenReducer from '../reducer';

describe('myAppScreenReducer', () => {
    it('returns the initial state', () => {
        expect(myAppScreenReducer(undefined, {})).toEqual(fromJS({}));
    });
});
