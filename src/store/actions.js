import {
    ADD_COUNTER,
    ADD_TO_CART
} from './mutation-type'

export default {
    addCart(context, payload) {
        return new Promise((resolve, reject) => {
            let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
            if (oldProduct) {
                // oldProduct.count += 1
                context.commit(ADD_COUNTER, oldProduct)
                resolve('当前的商品数量加一')
            } else {
                // console.log('111');
                // console.log(state.cartList);
                // payload.count = 1
                // state.cartList.push(payload)
                payload.count = 1;
                context.commit(ADD_TO_CART, payload)
                resolve('添加了新的商品')
            }
        })
    }
}