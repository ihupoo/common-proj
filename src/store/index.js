const store = {
    state: {
        sysBrand: 'kedacom',
        versionYear: '2019',
        currentuser: {
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
    },
    reducers: {
        save([payload]) {
            this.state = {
                ...this.state,
                ...payload
            }
        }
    },
    getState: (param) => param ? store.state[param] : store.state,
    dispatch: ({ type, payload = {} }) => store.reducers[type] ? store.reducers[type].call(store, [payload]) : null
}

export default store
