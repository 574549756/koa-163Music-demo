{
    let view = {
        el: '#musicList-container',
        templete: `
        <ul class="musicList">
            <ul v-for="song in songs">
            <ul/>
        </ul>
        `,
        render(data) {
            let $el = $(this.el)
            $el.html(this.templete)
            let { songs, selectedSongId } = data
            let liList = songs.map(song => {
                let $li = $('<ul></ul>')
                    .html(
                        `<svg class="icon" aria-hidden="true"><use xlink: href="#icon-wangyiyunyinyuemusic1193417easyiconnet"></use></svg>
                        <li>${
                            song.name
                        }</li><li><svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-micc"></use>
                        </svg>${song.artist}</li>`
                    )
                    .attr('data-song-id', song.id)
                if (song.id === selectedSongId) {
                    $li.addClass('active')
                }
                return $li
            })
            $el.find('.musicList').empty()
            liList.map(domLi => {
                $el.find('.musicList').append(domLi)
            })
        },
        clearActive() {
            $(this.el)
                .find('.active')
                .removeClass('active')
        }
    }
    let model = {
        data: {
            songs: [],
            selectedSongId: undefined
        },
        find() {
            var query = new AV.Query('Song')
            return query.find().then(songs => {
                console.log('一个数组')
                console.log(songs)
                this.data.songs = songs.map(song => {
                    return { id: song.id, ...song.attributes }
                })
                return songs
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
            this.getAllSongs()
        },
        getAllSongs() {
            return this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        },
        bindEvents() {
            $(this.view.el).on('click', '.musicList>ul', e => {
                let songId = e.currentTarget.getAttribute('data-song-id')

                // 记录　渲染
                this.model.data.selectedSongId = songId
                this.view.render(this.model.data)

                let data
                let songs = this.model.data.songs
                for (let i = 0; i < songs.length; i++) {
                    if (songs[i].id === songId) {
                        data = songs[i]
                        break
                    }
                }
                let object = JSON.parse(JSON.stringify(data))
                console.log(object)
                window.eventHub.emit('select', object)

                /* window.eventHub.emit('selectPlaylist', object.id) */
            })
        },
        bindEventHub() {
            window.eventHub.on('create', songData => {
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', () => {
                this.view.clearActive()
            })
            window.eventHub.on('update', song => {
                let songs = this.model.data.songs
                for (let i = 0; i < songs.length; i++) {
                    if (songs[i].id === song.id) {
                        Object.assign(songs[i], song)
                    }
                }
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}
