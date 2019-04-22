import { createSelector } from 'reselect';

/**
 * Direct selector to the menuScreen state domain
 */
const selectMenuScreenDomain = (state) => state.get('menuScreen');

const getData = function getData(object, properties) {
    if (!properties || properties.length === 0) {
        return object;
    }

    const data = object.get(properties[0]);
    const newArr = properties.slice(1);

    return (newArr.length > 0 && data && data.get) ? getData(data, newArr) : data;
};

const makeSelectData = (layers) => createSelector(
    selectMenuScreenDomain,
    (substate) => getData(substate, layers).toJS()
);

const makeSelectMenuScreen = () => createSelector(
    selectMenuScreenDomain,
    (substate) => substate.toJS()
);

export default makeSelectMenuScreen;
export {
    selectMenuScreenDomain,
    makeSelectData,
};
