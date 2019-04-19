
import { fromJS } from 'immutable';
import authLoadingScreenReducer from '../reducer';

describe('authLoadingScreenReducer', () => {
    it('returns the initial state', () => {
        expect(authLoadingScreenReducer(undefined, {})).toEqual(fromJS({}));
    });
});
