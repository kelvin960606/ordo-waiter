import { createSelector } from 'reselect';

/**
 * Direct selector to the cartScreen state domain
 */
const selectCartScreenDomain = (state) => state.get('cartScreen');

const getData = function getData(object, properties) {
    if (!properties || properties.length === 0) {
        return object;
    }

    const data = object.get(properties[0]);
    const newArr = properties.slice(1);

    return (newArr.length > 0 && data && data.get) ? getData(data, newArr) : data;
};

const makeSelectData = (layers) => createSelector(
    selectCartScreenDomain,
    (substate) => getData(substate, layers).toJS()
);

const makeSelectCartScreen = () => createSelector(
    selectCartScreenDomain,
    (substate) => substate.toJS()
);

export default makeSelectCartScreen;
export {
    selectCartScreenDomain,
    makeSelectData,
};
