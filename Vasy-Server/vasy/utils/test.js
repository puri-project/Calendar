var test = require('jsonwebtoken');

var st = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InB1cmk4NDY3QGdtYWlsLmNvbSIsImlhdCI6MTU0Mzk5NjE2MiwiZXhwIjoxNTQzOTk2MTYzfQ.-G1UgWNHPDR_o_lD_g_tbKSRzNuWp1V5trhAHOdL1Qg";
test.verify(st, "coconut", (err, data) => {
    if (err) {
        console.log(err);
    }
})

var st = test.decode(st, "coconut");
console.log(st);