{
    let view = {}
    let model = {
        data: {
            playlist: undefined,
            songs: [],
            templateMap:[]
        },
        get(playlistId) {
            this.data.playlist = playlistId
            let playlistResult = new AV.Object.createWithoutData(
                'Playlist',
                playlistId
            )
            var query = new AV.Query('playlistMap')
            query.equalTo('playlistPointer', playlistResult)
            return query
                .find()
                .then(playlistMap => {
                    let songResultsId = []
                    playlistMap.forEach(scm => {
                        this.data.templateMap.push(scm.id)
                        var songs = scm.get('songPointer')
                        songResultsId.push(songs.id)
                    })
                    return songResultsId
                })
                .then(async songResultsId => {
                    let songAfter = []
                    var searchSong = new AV.Query('Song')
                    for (i = 0; i < songResultsId.length; i++) {
                        await searchSong.get(songResultsId[i]).then(songResult => {
                            songAfter.push(songResult)
                        })
                    }
                    return songAfter
                })
                .then(songAfter => {
                    this.data.songs = songAfter.map(song => {
                        return {
                            id: song.id,
                            ...song.attributes
                        }
                    })
                })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.loadPlaylist()
            
            this.loadMusic()
            let id = this.getPlaylistId()
            this.model.get(id).then(() => {
                window.eventHub.emit('getPlaylist', this.model.data.playlist)
                window.eventHub.emit('getSongs', this.model.data.songs)
            })
            this.bindEventHub()
        },
        bindEventHub() {
        },
        getPlaylistId() {
            let search = window.location.search
            if (search.indexOf('?') === 0) {
                search = search.substring(1)
            }

            let array = search.split('&').filter(v => v)
            let id = ''

            for (let i = 0; i < array.length; i++) {
                let kv = array[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if (key === 'id') {
                    id = value
                    break
                }
            }
            return id
        },
        loadPlaylist() {
            let script1 = document.createElement('script')
            script1.src = './js/playlist/loadPlaylist.js'
            script1.onload = function () { }
            document.body.appendChild(script1)
        },
        loadMusic() {
            let script2 = document.createElement('script')
            script2.src = './js/playlist/loadMusic.js'
            script2.onload = function () { }
            document.body.appendChild(script2)
        }
    }
    controller.init(view, model)
}