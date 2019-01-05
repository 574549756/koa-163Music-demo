{
	let view = {
		el: "main",
		template: `   
        <li onclick="window.location.href='./song.html?id={{song.id}}'">
        <span>{{flag}}</span>
        <div class="songMessage">
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
			songs.map(song => {
				data.flag = data.flag + 1
				let $li = $(
					this.template
						.replace("{{flag}}", data.flag)
						.replace("{{song.name}}", song.name)
						.replace("{{song.artist}}", song.artist)
						.replace("{{song.id}}", song.id)
				)
				$("#songs-loading").remove()
				this.$el.find("ol.list").append($li)
			})
		}
	}
	let model = {
		data: {
			flag: 0,
			songs: []
		}
	}
	let controller = {
		init() {
			this.view = view
			this.view.init()
			this.model = model
			this.bindEventHub()
		},
		bindEventHub() {
			window.eventHub.on("getSongs", songs => {
				this.model.data.songs = songs
				this.view.render(this.model.data)
			})
		}
	}
	controller.init(view, model)
}
