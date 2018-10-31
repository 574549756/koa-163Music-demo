export default function(){
    let view = {
        el: '.page >.musicInfoContainer > main',
        init() {
            this.$el = $(this.el)
        },
        template: `
            <form class="form">
                <div class="leftMain">
                    <div class="row">
                        <label for="">歌名</label>
                        <input name="name" type="text" value="__name__">
                    </div>
                    <div class="row">
                        <label for="">歌手</label>
                        <input name="artist" type="text" value="__artist__">
                    </div>
                    <div class="row">
                        <label for="">外链</label>
                        <input name="url" type="text" value="__url__">
                    </div>
                    <div class="row">
                        <label for="">封面</label>
                        <input name="cover" type="text" value="__cover__">
                    </div>
                    <div class="row actions">
                    <button type="submit">保存</button>
                </div>
                </div>
                <div class="rightMain">
                    <div class="row">
                        <label for="">
                            歌词
                        </label>
                        <textarea name="lyrics">__lyrics__</textarea>
                    </div>
                </div>
            </form>
        `,
        render(data = {}) {
            let placeHolders = [
                'name',
                'url',
                'artist',
                'id',
                'cover',
                'lyrics'
            ]
            let html = this.template
            placeHolders.map(string => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            if (data.id) {
                $(this.el).prepend(
                    '<h1>编辑歌曲</h1><div class="breakLine"></div>'
                )
            } else {
                $(this.el).prepend(
                    '<h1>新建歌曲</h1><div class="breakLine"></div>'
                )
            }
        },
        reset() {
            this.render({})
        }
    }
    let model = {
        data: {
            name: '',
            artist: '',
            url: '',
            id: '',
            cover: '',
            lyrics: ''
        },
        update(data) {
            var song = AV.Object.createWithoutData('Song', this.data.id)
            song.set('name', data.name.replace('.mp3', ''))
            song.set('artist', data.artist)
            song.set('url', data.url)
            song.set('cover', data.cover)
            song.set('lyrics', data.lyrics)
            return song.save().then(response => {
                Object.assign(this.data, data)
                return response
            })
        },
        create(data) {
            // 声明一个 Todo 类型
            var Song = AV.Object.extend('Song')
            // 新建一个 Todo 对象
            var song = new Song()
            song.set('name', data.name.replace('.mp3', ''))
            song.set('artist', data.artist)
            song.set('url', data.url)
            song.set('cover', data.cover)
            song.set('lyrics', data.lyrics)
            return song.save().then(
                newSong => {
                    let { id, attributes } = newSong
                    Object.assign(this.data, {
                        id: id,
                        ...attributes

                        /* name: attributes.name,
                        artist: attributes.artist,
                        url: attributes.url */
                    })
                },
                error => {
                    // 异常处理
                    console.error(error.message)
                }
            )
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('select', data => {
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', data => {
                if (this.model.data.id) {
                    this.model.data = {
                        name: '',
                        url: '',
                        id: '',
                        artist: '',
                        cover: '',
                        lyrics: ''
                    }
                } else {
                    Object.assign(this.model.data, data)
                }
                this.view.render(this.model.data)
            })
        },
        reset(data) {
            this.view.render(data)
        },
        create() {
            let needs = 'name artist url cover lyrics'.split(' ')
            let data = {}
            needs.map(string => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.create(data).then(() => {
                this.view.reset()
                let stringCopy = JSON.stringify(this.model.data)
                let objectCopy = JSON.parse(stringCopy)
                window.eventHub.emit('create', objectCopy)
            })
        },
        update() {
            let needs = 'name artist url cover lyrics'.split(' ')
            let data = {}
            needs.map(string => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.update(data).then(() => {
                window.eventHub.emit(
                    'update',
                    JSON.parse(JSON.stringify(this.model.data))
                )
            })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', e => {
                e.preventDefault()
                if (this.model.data.id) {
                    this.update()
                } else {
                    this.create()
                }
            })
        }
    }
    controller.init(view, model)
}
