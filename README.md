# Stories

> Supervisor user monitoring system

## Build Setup

``` bash
# add your own firebase config keys to
config/dev.env.js
config/prod.env.js

# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

## Questions

``` bash
# How long did you spend on the test? Would you do anything differently if you had more time?
It took around 40+ hours, If I had time I would add more tests, add the ability to create private accounts.

# In what ways would you adapt your component so that it could be used in many different scenarios where a data table is required?
I have made a big application that has the Dashboard component in it, It is a stand-alone component that needs to be connected to the vuex store, firebase service, navigation routes. You only feed it with the payments and the actions needed to be done on it.

# What is your favorite CSS property? Why?
display: flex;
simplifies complexity, easy to use, reliable on all responsive sizes, supported in all major browsers.

# What is your favorite modern Javascript feature? Why?
Destructuring assignment in ES6 [...]
You can create copies of objects, arrays and work with immutability, you can swap items or create variables without having to write more than one line and create a mess.

# What is your favorite third-party Vue.js library? Why?
Since this is my first time using Vue.js, I find VueX an awesome solution to many state management problems.
```
