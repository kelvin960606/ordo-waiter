
import { fromJS } from 'immutable';
import kitchenScreenReducer from '../reducer';

describe('kitchenScreenReducer', () => {
    it('returns the initial state', () => {
        expect(kitchenScreenReducer(undefined, {})).toEqual(fromJS({}));
    });
});
