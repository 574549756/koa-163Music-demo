{
    let view = {
        el: '.page-1',
        init() {
            this.$el = $(this.el)
        },
        show() {
            this.$el.addClass('active')
        },
        hide() {
            this.$el.removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.bindEventHub()
            this.loadModel1()
            this.loadModel2()
        },
        bindEventHub() {
            window.eventHub.on('selectTab', tabName => {
                if (tabName === 'page-1') {
                    this.view.show()
                } else {
                    this.view.hide()
                }
            })
        },
        loadModel1() {
            let script1 = document.createElement('script')
            script1.src = './js/index/page-1-1.js' //相对于htmls
            script1.onload = function() {}
            document.body.appendChild(script1)
        },
        loadModel2() {
            let script2 = document.createElement('script')
            script2.src = './js/index/page-1-2.js' //相对于htmls
            script2.onload = function() {}
            document.body.appendChild(script2)
        }
    }
    controller.init(view, model)
}
