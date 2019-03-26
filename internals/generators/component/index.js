/**
 * Component Generator
 */

/* eslint strict: ["off"] */

'use strict';

const componentExists = require('../utils/componentExists');

module.exports = {
    description: 'Add a component',
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
    }],
    actions: (data) => {
        let componentTemplate = './component/class.js.hbs';
        let folder = 'components';

        const actions = [{
            type: 'add',
            path: `../../${folder}/{{properCase name}}.js`,
            templateFile: componentTemplate,
            abortOnFail: true,
        }];

        return actions;
    },
};
