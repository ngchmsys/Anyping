const app = new Vue({
    el: '#app',
    delimiters: ['{$', '$}'],
    data: {
        msg: 'Hello, Vue.js',
        df: []
    },
    created: function() {
        console.log("Created.")
    }
})

if(localStorage) {
    console.log("LocalStorage: True");
} else {
    console.log("LocalStorage: False");
}
