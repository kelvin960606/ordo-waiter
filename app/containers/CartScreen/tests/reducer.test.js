
import { fromJS } from 'immutable';
import cartScreenReducer from '../reducer';

describe('cartScreenReducer', () => {
    it('returns the initial state', () => {
        expect(cartScreenReducer(undefined, {})).toEqual(fromJS({}));
    });
});
