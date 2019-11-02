function get(source, path, defaultValue = undefined) {
    const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
    let result = source
    for (const p of paths) {
        result = Object(result)[p]
        if (result === undefined) {
            return defaultValue
        }
    }
    return result
}

const example = {
    'BASE_URL': '/',
    "realmName":"kedacom",
    "systemMode":0,
    "domainType":1,
    "lang":"zn-CN",
    "sysBrand":"telecom",
    "versionYear":"2019",
    "version":"6.0.0.4.0"
}


class Store {
    state = {
        
    }

    reducers = {
        save(payload) {
            this.state = {
                ...this.state,
                ...payload
            }
        },
        delete(payload){
            
        }
    }

    getState(param) {
        return param ? get(this.state, param) : this.state
    }

    dispatch({ type, payload = {} }) {
        this.reducers[type] ? this.reducers[type].call(this, payload) : null
    }

}

export default new Store()
