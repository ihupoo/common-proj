// const inquirer = require('inquirer');


// inquirer
//   .prompt([
//     /* Pass your questions in here */
//   ])
//   .then(answers => {
//     // Use user feedback for... whatever!!
//   });


const fs = require('fs-extra')

// const Tomcat = `D:\green_az\apache-tomcat-8.0.32\conf\server.xml`
const Tomcat = `./server.xml`
const Meeting = `D:\work\meeting-sp4\meeting-parent-5.0.0.0-build3`

const MeetingConfig = `${Meeting}\src\main\resources\config.properties`
const MeetingDev = `${Meeting}\meeting-webapp\webapp\static\common\js\meetingConfig.dev.js`
const MeetingResource = `${Meeting}\meeting-webapp\webapp\resource.jsp`

function replaceFn(path, replaceData){
    fs.readFile(path,(e, data) => {
        if(e) return e
        let str = data.toString()
        str = str.replace(/10\.67\.16\.121/g, replaceData)
        fs.writeFile(path, str,(err) => {
            if(err) return err
        })
    })
}



fs.readFile(Tomcat,(e, data) => {
    if(e) return e
    let str = data.toString()
    str = str.replace(/jdbc\:mysql:\/\/(^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$)/g, 123)
    fs.writeFile(Tomcat, str,(err) => {
        if(err) return err
    })
})


