import { createSelector } from 'reselect';

/**
 * Direct selector to the myAppScreen state domain
 */
const selectMyAppScreenDomain = (state) => state.get('myAppScreen');

const getData = function getData(object, properties) {
    if (!properties || properties.length === 0) {
        return object;
    }

    const data = object.get(properties[0]);
    const newArr = properties.slice(1);

    return (newArr.length > 0 && data && data.get) ? getData(data, newArr) : data;
};

const makeSelectData = (layers) => createSelector(
    selectMyAppScreenDomain,
    (substate) => getData(substate, layers).toJS()
);

const makeSelectMyAppScreen = () => createSelector(
    selectMyAppScreenDomain,
    (substate) => substate.toJS()
);

export default makeSelectMyAppScreen;
export {
    selectMyAppScreenDomain,
    makeSelectData,
};
