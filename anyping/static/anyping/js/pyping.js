const app = new Vue({
    el: '#app',
    delimiters: ['{$', '$}'],
    data () {
        return {
            loading: true,
            msg: 'Hello, Pyping',
            score: 0,
            charge_point: 0,
            GAME_TIME: 60,
            current_time: this.GAME_TIME,
            CHARGE_LIMIT: 100,
            df: null,
            questions: null,
            q_no: 0,
            ans: "",
            ans_notcomp: "",
            pos: 0,
            wrong_count: 0,
            key: ""
        }
    },
    created: function() {
        console.log("Created.")
        window.addEventListener('keyup', this.typing)
    },
    mounted () {
        if(localStorage) {
            this.questions = JSON.parse(localStorage.getItem('questions'))
            console.log(this.questions)
        }
        if(this.questions != null){
            this.df = this.questions
            r = Math.random() * this.df.length
            this.q_no = parseInt(r)
            this.ans_notcomp = this.df[this.q_no].code
            console.log("**************" + this.ans_notcomp)
            this.loading = false
        } else {
            axios
            .get("api/")
            .then(response => {
                this.df = response.data
                localStorage.setItem('questions', JSON.stringify(this.df))
                r = Math.random() * this.df.length
                this.q_no = parseInt(r)
                this.ans_notcomp = this.df[this.q_no].code
                console.log("**************" + this.ans_notcomp)
            })
            .catch(error => console.log(error))
            .finally(() => {
                this.loading = false
            })
        }
    },
    computed: {
        compair: function() {
            if(this.df[this.q_no].code === this.ans) {
                this.score += this.df[this.q_no].code.length
                this.charge_point += this.df[this.q_no].code.length
                r = Math.random() * this.df.length
                this.q_no = parseInt(r)
                this.ans = ""
                this.ans_notcomp = this.df[this.q_no].code
                this.pos = 0
                return 'Compaired!!'
            }
            return this.ans
        },
        charge: function() {
            if(this.charge_point >= this.CHARGE_LIMIT) {
                this.current_time++
                this.charge_point -= this.CHARGE_LIMIT
            }
            return this.charge_point
        }
    },
    methods: {
        typing: function(event) {
            this.key = event.key
            console.log('('+ event.type +')' + event.key +': '+ event.keyCode)
            if(event.keyCode===8 | event.keyCode===46) {
                this.ans = this.ans.slice(0,-1)
                this.pos--
                this.ans_notcomp = this.df[this.q_no].code.slice(this.pos)
                console.log(this.ans)
                console.log(this.ans_notcomp)
            } else {
                if(this.key===this.df[this.q_no].code[this.pos]) {
                    this.ans += this.key
                    this.pos++
                    this.ans_notcomp = this.ans_notcomp.slice(1)
                    console.log(this.ans)
                    console.log(this.ans_notcomp)
                } else {
                    this.wrong_count++
                }
            }
        }
    }
})
