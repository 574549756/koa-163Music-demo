{
    let view = {
        el: 'header',
        template: `
        <div class="playlistArea">
        <section class="coverContainer">
            <div class="backgroundCover"></div>
            <div class="coverImg"></div>
            <div class="playlist-title">{{playlist.name}}</div>
        </section>
        <section class="summary">
            <div class="summaryContent">简介：{{playlist.summary}}</div>
            <div class="buttonMore">
                <svg class="icon" aria-hidden="true" id="cross">
                    <use xlink:href="#icon-down"></use>
                </svg>
            </div>
            <div class="buttonLess">
                <svg class="icon" aria-hidden="true" id="cross">
                    <use xlink:href="#icon-down"></use>
                </svg>
            </div>
        </section>
        </div>
        `,
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            let { playlists } = data
            let $li = $(
                this.template
                    .replace('{{playlist.name}}', playlists.name)
                    .replace('{{playlist.summary}}', playlists.summary)
            )
            $li.find('.backgroundCover').css('background-image', `url(${playlists.url})`)
            $li.find('.coverImg').css('background-image', `url(${playlists.url})`)
            this.$el.append($li)
        },
        unfold(data){
            $(this.el).find('.summary').attr('class',data.state)
        },
        fold(data){
            $(this.el).find('.summaryActive').attr('class',data.state)
        }
    }
    let model = {
        data: {
            playlists: [],
            state:'summary'
        },
        getPlaylist(playlists) {
            var query = new AV.Query('Playlist');
            return query.get(playlists).then((playlist) => {
                Object.assign(this.data.playlists, {
                    id: playlist.id,
                    ...playlist.attributes
                })
                return playlist
            });
        }
    }
    let controller = {
        init() {
            this.view = view
            this.view.init()
            this.model = model
            this.bindEventHub()
            this.bindEvent()
        },
        changeTitle(data) {
            $('title').text(`${data.playlists.name} - 歌单 - 云音乐`)
        },
        bindEvent(){
            $(this.view.el).on('click','.summary',e=>{
                this.model.data.state = 'summaryActive'
                this.view.unfold(this.model.data)
            })
            $(this.view.el).on('click','.summaryActive',e=>{
                this.model.data.state = 'summary'
                this.view.fold(this.model.data)
            })
        },
        bindEventHub() {
            window.eventHub.on('getPlaylist', playlist => {
                this.model.getPlaylist(playlist).then(() => {
                    this.view.render(this.model.data)
                }).then(()=>{
                    this.changeTitle(this.model.data)
                })
            })
        }
    }
    controller.init(view, model)
}