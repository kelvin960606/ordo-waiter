/**
 * Container Generator
 */

const componentExists = require('../utils/componentExists');

module.exports = {
    description: 'Add a screen',
    prompts: [{
        type: 'input',
        name: 'name',
        message: 'What should it be called?',
        validate: (value) => {
            if ((/.+/).test(value)) {
                return componentExists(value) ? 'A component or container with this name already exists, please try a different one.' : true;
            }

            return 'The name is required, please try a different one.';
        },
    },{
        type: 'confirm',
        name: 'wantActionsAndReducer',
        default: true,
        message: 'Do you want an actions/constants/reducer tuple for this container?',
    }, {
        type: 'confirm',
        name: 'wantSaga',
        default: true,
        message: 'Do you want sagas for asynchronous flows? (e.g. fetching data)',
    }],
    actions: (data) => {
        // Generate index.js and index.test.js
        var componentTemplate = './container/index.js.hbs'; // eslint-disable-line no-var
        let folder = 'screens';

        const actions = [{
            type: 'add',
            path: `../../${folder}/{{properCase name}}.js`,
            templateFile: componentTemplate,
            abortOnFail: true,
        }];

        if (data.wantActionsAndReducer) {
            actions.push({
                type: 'add',
                path: `../../redux/{{properCase name}}Redux.js`,
                templateFile: './container/redux.js.hbs',
                abortOnFail: true,
            });
        }

        if (data.wantSaga) {
            actions.push({
                type: 'add',
                path: `../../saga/{{properCase name}}Saga.js`,
                templateFile: './container/saga.js.hbs',
                abortOnFail: true,
            });
        }

        return actions;
    },
};
