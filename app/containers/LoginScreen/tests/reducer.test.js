
import { fromJS } from 'immutable';
import loginScreenReducer from '../reducer';

describe('loginScreenReducer', () => {
    it('returns the initial state', () => {
        expect(loginScreenReducer(undefined, {})).toEqual(fromJS({}));
    });
});
