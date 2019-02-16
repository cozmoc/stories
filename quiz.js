const Fernet = require('fernet');
const secret = new Fernet.Secret('TluxwB3fV_GWuLkR1_BzGs1Zk90TYAuhNMZP_0q4WyM=');
// Oh no! The code is going over the edge! What are you going to do?
const message = 'gAAAAABcUDe_uCP0qHAXvhKqQoRj5DZNrLO3p7qBHPo7VNeP80zDrAeq8XOY-CsTZRw6VQHFzz6mf1piGykvxUaYB_Io3Q3fqYIv2YIgQxd8XTv6jv7UN7rOvSv4R1ScRSPrAKXORrmWACHdYtoQv7PNYSUja-bTqGFEShngXjOxGf7PsyrH-_Hxtr0FFyHouJmUKIKN3J5b';
const token = new Fernet.Token({
    secret: secret,
    token: message,
    ttl:0
});
let result = token.decode(message);
console.log(result);