import { createSelector } from 'reselect';

/**
 * Direct selector to the loginScreen state domain
 */
const selectLoginScreenDomain = (state) => state.get('loginScreen');

const getData = function getData(object, properties) {
    if (!properties || properties.length === 0) {
        return object;
    }

    const data = object.get(properties[0]);
    const newArr = properties.slice(1);

    return (newArr.length > 0 && data && data.get) ? getData(data, newArr) : data;
};

const makeSelectData = (layers) => createSelector(
    selectLoginScreenDomain,
    (substate) => getData(substate, layers).toJS()
);

const makeSelectLoginScreen = () => createSelector(
    selectLoginScreenDomain,
    (substate) => substate.toJS()
);

export default makeSelectLoginScreen;
export {
    selectLoginScreenDomain,
    makeSelectData,
};
