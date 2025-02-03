const user = {
    username: "arnaud",
    password: "kimono75"
};

function generateToken(user){
    const to_string = JSON.stringify(user)
    const encode = btoa(to_string)
    console.log("JSON encodé :", encode)
    return encode
}

const encoded = generateToken(user)


function verifyToken(token){
    const decode = atob(token)
    const to_json = JSON.parse(decode)
    console.log("JSON décodé :", to_json)
    return to_json
}

const decoded = verifyToken(encoded)
