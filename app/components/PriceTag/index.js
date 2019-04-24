/**
*
* PriceTag
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { getXdp } from 'app/globalUtils';


class PriceTag extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
            <Text style={{ fontSize: getXdp(1.8) }}>{`${this.props.currency ? this.props.currency : 'RM'} ${Number(this.props.value).toFixed(2)}`}</Text>
        );
    }
}

PriceTag.propTypes = {
    value: PropTypes.number.isRequired,
};

export default PriceTag;
