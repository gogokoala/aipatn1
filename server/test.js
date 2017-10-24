const exec = require('child_process').exec
const cmdStr = 'head -n 80 /dev/urandom | tr -dc A-Za-z0-9 | head -c 168'

exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
        console.log('api error:' + stderr)
    } else {
        var data = stdout
        console.log(data)
    }
})
