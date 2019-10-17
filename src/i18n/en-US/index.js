import movision from './movision';
import kedacom from './kedacom';
import telecom from './telecom';
import DX6000 from './DX6000';

export default {
    home:{
        user:{
            modify:{
                title:'modify personal information',
                label:{
                    account:'account',
                    mobile:'contact telephone number',
                    email:'email',
                    address:'contact address'
                },
                btn:{
                    confirm: 'OK',
                    cancel: 'cancel',
                }
            }
        },
        password:{
            modify:{
                title:'modify password',
                label:{
                    conPassword:'confirm password',
                    newPassword:'new password',
                    oldPassword:'current password',
                },
                info:{
                    format: 'The password consists of 1-32 characters and supports letter case, number, "_", "." (excluding spaces)'
                }
            }
        },
        pagebase:{
            copyright:'Copyright',
            movision,
            kedacom,
            telecom,
            DX6000
        }
    },
    SSO:{
        login: {
            username:'userName',
            password:'password',
            submit:'Log in',
            forgetPassword:'Request a Password Reset',
        }
    }
}
