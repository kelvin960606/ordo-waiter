import { createSelector } from 'reselect';

/**
 * Direct selector to the authLoadingScreen state domain
 */
const selectAuthLoadingScreenDomain = (state) => state.get('authLoadingScreen');

const getData = function getData(object, properties) {
    if (!properties || properties.length === 0) {
        return object;
    }

    const data = object.get(properties[0]);
    const newArr = properties.slice(1);

    return (newArr.length > 0 && data && data.get) ? getData(data, newArr) : data;
};

const makeSelectData = (layers) => createSelector(
    selectAuthLoadingScreenDomain,
    (substate) => getData(substate, layers).toJS()
);

const makeSelectAuthLoadingScreen = () => createSelector(
    selectAuthLoadingScreenDomain,
    (substate) => substate.toJS()
);

export default makeSelectAuthLoadingScreen;
export {
    selectAuthLoadingScreenDomain,
    makeSelectData,
};
