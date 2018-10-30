{
    let view = {
        el: 'section.playlists',
        template: `
        <li data-songList-id="{{songList.id}}">
            <div class="cover" style="background-image:url({{songList.cover}})" alt="封面"></div>
            <p>{{songList.name}}</p>
        </li>
        `,
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            let {songLists} = data            
            songLists.map(songList => {
                let $li = $(
                    this.template
                        .replace('{{songList.id}}', songList.id)
                        .replace('{{songList.cover}}', songList.url)
                        .replace('{{songList.name}}', songList.name)
                )
                console.log($li)
                this.$el.find('ol.songs').append($li)
            })
        }
    }
    let model = {
        data: {
            songLists: []
        },
        find() {
            var query = new AV.Query('Playlist')
            return query.find().then(songLists => {
                this.data.songLists = songLists.map(songlist => {
                    return { id: songlist.id, ...songlist.attributes }
                })
                return songLists
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvents()
            this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        },
        bindEvents() {
            $(document).on('click', 'section.playlists>ol.songs>li', e => {
                let playlistId = e.currentTarget.getAttribute('data-songlist-id')
                window.location.href = `./playlist.html?id=${playlistId}`
            })
        }
    }
    controller.init(view, model)
}
