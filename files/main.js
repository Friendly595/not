new Vue({
    el: "#app",
    data() {
        return {
            notifi: [],
        }
    },
    mounted() {
        window.addN = this.createNotifi;
        // Подписываемся на событие "CEF:NOTIFI:ADD" из SAMP
        cef.on("CEF:NOTIFI:ADD", (type, time, message, title) => {
            this.handleSampEvent(type, time, message, title);
        });
    },
    methods: {
        createNotifi(type, time, message, title = "Уведомление") {
            let n = this.notifi.find(_el => _el.message === message);
            if (n) return n.gsap.restart();
            let notifi = this.notifi[this.notifi.push({type, title, message, loading: 100}) - 1];
            notifi.gsap = gsap.to(notifi, {
                duration: (time / 1000) + 0.5,
                loading: 0,
                onComplete: () => {
                    let ind = this.notifi.indexOf(notifi);
                    if (ind !== -1) this.notifi.splice(ind, 1);
                }
            })
        },
        handleSampEvent(type, time, message, title) {
            // Обработка события из SAMP
            console.log("Received event from SAMP:", type, time, message, title);
            // Здесь вы можете обработать полученные данные как вам нужно
            this.createNotifi(type, time, message, title);
        }
    },
    computed: {},
    watch: {}
});
