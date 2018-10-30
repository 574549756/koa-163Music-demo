{
    let view = {
        el: '#musicList-container',
        templete: `
        <ul class="playList">
            <ul v-for="playlist in playlists">
            </ul>
        </ul>
        `,
        render(data) {
            let $el = $(this.el)
            $el.html(this.templete)
            let { playlists, selectedPlaylistId } = data
            let liList = playlists.map(playlist => {
                let $li = $('<ul></ul>')
                    .html(
                        `<div style="background-image:url(${
                            playlist.url
                        });height:30px;width:30px;"></div><li>${
                            playlist.name
                        }</li>`
                    )
                    .attr('data-playlist-id', playlist.id)
                if (playlist.id === selectedPlaylistId) {
                    $li.addClass('active')
                    window.eventHub.emit('selectPlaylist', selectedPlaylistId)
                }
                return $li
            })
            $el.find('ul.playList').empty()
            liList.map(domLi => {
                $el.find('ul.playList').append(domLi)
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
            playlists: [],
            selectedPlaylistId: undefined
        },
        find() {
            var query = new AV.Query('Playlist')
            return query.find().then(playlists => {
                this.data.playlists = playlists.map(playlist => {
                    return { id: playlist.id, ...playlist.attributes }
                })
                return playlists
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
            this.getAllPlaylists()
        },
        getAllPlaylists() {
            return this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        },
        bindEvents() {
            $(this.view.el).on('click', '.playList>ul', e => {
                let playlistId = e.currentTarget.getAttribute(
                    'data-playlist-id'
                )

                // 记录　渲染
                this.model.data.selectedPlaylistId = playlistId
                this.view.render(this.model.data)

                let data
                let playlists = this.model.data.playlists
                for (let i = 0; i < playlists.length; i++) {
                    if (playlists[i].id === playlistId) {
                        data = playlists[i]
                        break
                    }
                }
                let object = JSON.parse(JSON.stringify(data))
                window.eventHub.emit('select',object)
            })
        },
        bindEventHub() {
            window.eventHub.on('create', playlistData => {
                this.model.data.playlists.push(playlistData)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', () => {
                this.view.clearActive()
            })
            window.eventHub.on('update', playlist => {
                let playlists = this.model.data.playlists
                for (let i = 0; i < playlists.length; i++) {
                    if (playlists[i].id === playlist.id) {
                        Object.assign(playlists[i], playlist)
                    }
                }
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}
