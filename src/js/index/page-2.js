export default function(){
    let view = {
        el: '.page-2',
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
            this.loadMusicModel()
        },
        bindEventHub() {
            window.eventHub.on('selectTab', tabName => {
                if (tabName === 'page-2') {
                    this.view.show()
                    this.hotDate()
                } else {
                    this.view.hide()
                }
            })
        },
        hotDate() {
            var date = new Date()
            $('#hotTime').text(
                `更新日期：${date.getMonth() + 1}月${date.getDate()}日`
            )
        },
        loadMusicModel() {
            let script3 = document.createElement('script')
            script3.src = './js/index/page-2-2.js' //相对于htmls
            script3.onload = function() {}
            document.body.appendChild(script3)
        }
    }
    controller.init(view, model)
}
