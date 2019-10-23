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


class Store {
    state = {
        BASE_URL: '/',
        strengthRegular: { "3": "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[._])[0-9a-zA-Z._]{8,16}$", "2": "(?!^([0-9]+|[a-zA-Z]+|[._]+)$)^[0-9a-zA-Z._?]{8,16}$", "1": "^[A-Za-z0-9]{8,16}$" },
        sysBrand: 'kedacom',
        versionYear: '2019',
        user: {
            passwordExpire: '',
            cloudModeInfo: '',
            vrsShow: '',
            cbsShow: '',
            domsShow: '',
            enableNexvision: '',
            tpsIP: '',
            kisIP: '',
            vrsIP: '',
            show_sh: '0',
            portraintDomain: '',
            isUserDomainAdmin: '',
            isServiceDomainAdmin: '',
            isUsualUser: '',
            jmsConfigGuideUrl: '',
            jmsType: '',
            licenseInvalidWarn: '',
            onlyCurrentIp: '',
            umoid: '',
            systemSecurity: '1',
            securityPolicy: {},
            brithday: '',
            username: '8cd66490-3463-46fe-9b86-5fc4ae390ee2',//和name取一
            //
            name: 'jihuiqin',
            userDomainMoid: '2sh5wxryttt19qf6gs5kvzlc',
            userDomainAdmin: '',
            moid: '2sh5wxryttt19qf6gs5kvzlc',
            account: 'haha',
            mobile: '15236095272',
            email: '2551044074@qq.com',
            sex: '',
            seat: '办公地址',
            extNum: '',
            e164: '',
            depts: '',
            fax: '',
            meetingAdmin: '',
            serviceDomainMoid: 'mooooooo-oooo-oooo-oooo-defaultserdo',
            enableMeeting: '',
            enableNM: '',
            enableWeibo: '',
            enableBMC: '',
            enableVRS: '',
            enableLive: '',
            enableKIS: '',
            enablePublicCloudAccess: '',
            cloudModelDisplay: '',
            virMachineroomMoid: '',
            cloudModelName: '',
            portrait40: '',
            portrait64: '',
            portrait128: '',
            portrait256: ''
        }
    }

    reducers = {
        save(payload) {
            this.state = {
                ...this.state,
                ...payload
            }
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
