function get (source, path, defaultValue = undefined) {
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


class Store{
    state = {
        BASE_URL: '/',


        sysBrand: 'kedacom',
        versionYear: '2019',
        user: {
            userDomainMoid: '',
            serviceDomainMoid: '',
            enableMeeting: '',
            meetingAdmin: '',
            enableNM: '',
            
            name: '',
            account: 'jihuiqin',
            moid: '2cd61302-fafe-45b0-883b-f0671929b974',
            portrait40: '',
            portrait64: '',
            portrait128: '',
            email: '',
            mobile: '',
            extNum: '',
            e164: '',
            sex: '',
            fax: '',
            seat: '',
            depts: '',
            portrait256: '',
            cloudModelDisplay: '0',
            cloudModelName: '555',
            virMachineroomMoid: '7777',
            show_sh: '1',   //重启和关机是否显示
        }
    }

    reducers = {
        save(payload){
            this.state = {
                ...this.state,
                ...payload
            }
        }
    }

    getState(param){
       return param ? get(this.state, param) : this.state
    }

    dispatch({ type, payload = {} }){
        this.reducers[type] ? this.reducers[type].call(this, payload) : null
    } 

}


export default new Store()
