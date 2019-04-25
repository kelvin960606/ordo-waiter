import { createSelector } from 'reselect';

/**
 * Direct selector to the kitchenScreen state domain
 */
const selectKitchenScreenDomain = (state) => state.get('kitchenScreen');

const getData = function getData(object, properties) {
    if (!properties || properties.length === 0) {
        return object;
    }

    const data = object.get(properties[0]);
    const newArr = properties.slice(1);

    return (newArr.length > 0 && data && data.get) ? getData(data, newArr) : data;
};

const makeSelectData = (layers) => createSelector(
    selectKitchenScreenDomain,
    (substate) => getData(substate, layers).toJS()
);

const makeSelectKitchenScreen = () => createSelector(
    selectKitchenScreenDomain,
    (substate) => substate.toJS()
);

export default makeSelectKitchenScreen;
export {
    selectKitchenScreenDomain,
    makeSelectData,
};
