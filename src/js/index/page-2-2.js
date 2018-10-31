export default function(){
    let view = {
        el: 'section.hotSongs',
        template: `        
        <li>
            <div class='number'>
                {{song.number}}
            </div>
            <div class="container">
                <h3>{{song.name}}</h3>
                <p>
                    <svg class="icon icon-sq">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-sq"></use>
                    </svg>
                    {{song.artist}}
                </p>
                <a class="playButton" href="./song.html?id={{song.id}}">
                    <svg class="icon icon-play">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-play"></use>
                    </svg>
                </a>
            </div>
        </li>`,
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            let { songs } = data
            for (i = 0; i < songs.length; i++) {
                if (i < 9) {
                    let $li = $(
                        this.template
                            .replace('{{song.number}}', `0${i + 1}`)
                            .replace('{{song.name}}', songs[i].name)
                            .replace('{{song.artist}}', songs[i].artist)
                            .replace('{{song.id}}', songs[i].id)
                    )
                    this.$el.find('ol.list').append($li)
                } else {
                    let $li = $(
                        this.template
                            .replace('{{song.number}}', i + 1)
                            .replace('{{song.name}}', songs[i].name)
                            .replace('{{song.artist}}', songs[i].artist)
                            .replace('{{song.id}}', songs[i].id)
                    )
                    this.$el.find('ol.list').append($li)
                }
                $('#songs-loading').remove()
            }
        }
    }
    let model = {
        data: { songs: [] },
        find() {
            var query = new AV.Query('Song')
            query.limit(20)
            return query.find().then(songs => {
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
            this.view.init()
            this.model = model
            this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}
