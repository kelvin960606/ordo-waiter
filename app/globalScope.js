import { Dimensions } from 'react-native';

// default value for globalScope
export const globalScope = {
    api: 'http://ordo-koa.herokuapp.com',
    isConnected: true,
    productData: null,
    token: '',
    numColumnForSmallCard: Dimensions.get('window').width > 1050 ? 4 : 3,
    marginForSmallCard: 1,
    paddingForSmallCard: 2,
    tempToken: 'b91edc20-0026-4b8f-b2ab-02b3622dc5cd',
    merchantId: null,
    storeId: null,
};
