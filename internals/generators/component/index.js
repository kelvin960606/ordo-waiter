/**
 * Component Generator
 */

/* eslint strict: ["off"] */

'use strict';

const componentExists = require('../utils/componentExists');

module.exports = {
    description: 'Add an unconnected component',
    prompts: [{
        type: 'list',
        name: 'type',
        message: 'Select the type of component',
        default: 'Stateless Function',
        choices: () => ['Stateless Function', 'React.PureComponent', 'React.Component'],
    }, {
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
        // Generate index.js and index.test.js
        let componentTemplate;
        const folder = 'components';

        switch (data.type) {
            case 'Stateless Function': {
                componentTemplate = './component/stateless.js.hbs';
                break;
            }
            default: {
                componentTemplate = './component/class.js.hbs';
            }
        }

        const actions = [{
            type: 'add',
            path: `../../app/${folder}/{{properCase name}}/index.js`,
            templateFile: componentTemplate,
            abortOnFail: true,
        }, {
            type: 'add',
            path: `../../app/${folder}/{{properCase name}}/tests/index.test.js`,
            templateFile: './component/test.js.hbs',
            abortOnFail: true,
        }];

        return actions;
    },
};
