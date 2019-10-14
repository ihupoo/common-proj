const store = {
    state:{
        abc: 666
    },
    reducers: {
        save([payload]){
            this.state = {
                ...this.state,
                ...payload
            }
        }
    },
    getState: (param) => param ? store.state[param] : store.state,
    dispatch: ({ type , payload = {} }) => store.reducers[type] ? store.reducers[type].call(store, [payload]) : null
}

export default store
