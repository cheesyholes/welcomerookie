class DataCache{
  constructor(){
    this._load_imgs = [];
    this._load_json = [];
    this._load_sounds = [];
    this._load_fonts = [];
    this._loaded_data = {};
  }

  add_img(path){
    if (!(path in this._loaded_data) && this._load_imgs.indexOf(path) == -1){
      this._load_imgs.push(path);
    }
  }

  add_sound(path){
    if (!(path in this._loaded_data) && this._load_sounds.indexOf(path) == -1){
      this._load_sounds.push(path);
    }
  }

  add_json(path){
    if (!(path in this._loaded_data) && this._load_json.indexOf(path) == -1){
      this._load_json.push(path);
    }
  }

  add_font(path){
    if (!(path in this._loaded_data) && this._loaded_data.indexOf(path) == -1){
      this._load_fonts.push(path);
    }
  }

  _file_loaded(path, value, before, total, callback){
    this._loaded_data[path] = value;
    if (Object.keys(this._loaded_data).length - before >= total){
      callback();
    }
  }

  load(callback){
    let before = Object.keys(this._loaded_data).length;
    let total = this._load_imgs.length + this._load_json.length + this._load_sounds.length;
    if(total == 0){
      callback();
      return;
    }
    let current_obj = this;

    for(let img_path of this._load_imgs){
      let img = new Image();
      img.src = img_path;
      img.onload = function(){
        current_obj._file_loaded(img_path, img, before, total, callback);
      }
    }
    this._load_imgs.length = 0;

    for(let json_path of this._load_json){
      fetch(json_path).then(function(response){
        return response.json();
      }).then(function(data){
        current_obj._file_loaded(json_path, data, before, total, callback);
      });
    }
    this._load_json.length = 0;

    for(let snd_path of this._load_sounds){
      let audio = document.createElement('audio');
    	audio.src = snd_path;
    	audio.onloadeddata = function(){
    		current_obj._file_loaded(snd_path, audio, before, total, callback);
    	};
    }
    this._load_sounds.length = 0;

    for(let fnt_path of this._load_fonts){
      let s = document.createElement('style');
    	let fontname = fnt_path;
    	s.id = fontname;
    	s.type = "text/css";
    	document.head.appendChild(s);
    	s.textContent = "@font-face { font-family: '" + fontname + "'; src:url('" + fnt_path + "');}";
    }
    this._load_fonts.length = 0;
  }

  remove_data(path){
    delete this._loaded_data[path];
  }

  get_data(path){
    return this._loaded_data[path];
  }
}

let data_loader = new DataCache();

function show_menu(data_path){
  data_loader.add_json(data_path + "main.json");
  data_loader.add_img(data_path + "menu/cross.png");
  data_loader.load(function(){
    let main_config = data_loader.get_data(data_path + "main.json");
    for(let ch of main_config.chapters){
      data_loader.add_img(data_path + ch.picture);
    }
    data_loader.add_img(data_path + main_config["shade_left"]);
    data_loader.add_img(data_path + main_config["shade_right"]);
    data_loader.add_font(data_path + main_config["font"]);
    data_loader.add_sound(data_path + main_config["menu_sound"]);
    data_loader.add_sound(data_path + main_config["select_sound"]);
    data_loader.load(function(){
      document.body.style.fontFamily = '"' + data_path + main_config['font'] + '", Arial';
      document.getElementById("menu").style.display = "block";
      let loading = document.getElementById("loading");
      let handler = function(){
        loading.style.display = "none";
        loading.removeEventListener("transitionend", handler);
      }
      loading.addEventListener("transitionend", handler);
      setTimeout(function(){ loading.style.opacity = 0; }, 100);
      onload(main_config);
      add_menu_panel(data_path, main_config);
    })
  });
}

function show_credits(data_path, config){
  let loading = document.getElementById("loading");
  loading.style.display = "table";
  let credits_handler = function(e){
    document.getElementById("credits").style.display = "block";
    document.getElementById("menu").style.display = "none";
    add_credits(data_path, config);
    loading.removeEventListener("transitionend", credits_handler);
    let menu_handler = function(){
      loading.style.display = "none";
      loading.removeEventListener("transitionend", menu_handler);
    }
    loading.addEventListener("transitionend", menu_handler);
    setTimeout(function(){ loading.style.opacity = 0; }, 100);
  }
  loading.addEventListener("transitionend", credits_handler);
  setTimeout(function(){ loading.style.opacity = 1; }, 100);
}

function exit_credits(config){
  let loading = document.getElementById("loading");
  loading.style.display = "table";
  let menu_handler = function(e){
    document.getElementById("credits").style.display = "none";
    document.getElementById("menu").style.display = "block";
    document.querySelector("#credits #center").innerHTML = "";
    loading.removeEventListener("transitionend", menu_handler);
    let credits_handler = function(){
      loading.style.display = "none";
      loading.removeEventListener("transitionend", credits_handler);
    }
    loading.addEventListener("transitionend", credits_handler);
    setTimeout(function(){ loading.style.opacity = 0; }, 100);
  }
  loading.addEventListener("transitionend", menu_handler);
  setTimeout(function(){ loading.style.opacity = 1; }, 100);
}

function show_story(data_path, ch_path, main_config){
  let loading = document.getElementById("loading");
  loading.style.display = "table";
  let menu_handler = function(e){
    document.getElementById("menu").style.display = "none";
    loading.removeEventListener("transitionend", menu_handler);
  }
  loading.addEventListener("transitionend", menu_handler);
  setTimeout(function(){ loading.style.opacity = 1; }, 100);
  data_loader.add_json(ch_path + "game.json");
  data_loader.load(function(){
    let ch_config = data_loader.get_data(ch_path + "game.json");
    for(let p of ch_config['panels']){
      data_loader.add_img(ch_path + p.image);
      if(p.sound){
        data_loader.add_sound(ch_path + p.sound);
      }
    }
    if(ch_config.music){
      data_loader.add_sound(ch_path + ch_config.music);
    }
    data_loader.load(function(){
      let story = new Story(data_path, ch_path, main_config, ch_config);
      document.getElementById("story").style.display = "block";
      let loading = document.getElementById("loading");
      let story_handler = function(){
        loading.style.display = "none";
        story.play_music();
        add_panel(data_path, ch_path, main_config, story);
        loading.removeEventListener("transitionend", story_handler);
      }
      loading.addEventListener("transitionend", story_handler);
      setTimeout(function(){ loading.style.opacity = 0; }, 100);
    });
  });
}

function restart_story(data_path, ch_path, main_config, story){
  story.stop_music();
  let loading = document.getElementById("loading");
  loading.style.display = "table";
  let story_handler = function(e){
    document.querySelector("#story #center").innerHTML = "";
    loading.removeEventListener("transitionend", story_handler);
    let menu_handler = function(){
      loading.style.display = "none";
      story.play_music();
      add_panel(data_path, ch_path, main_config, story);
      loading.removeEventListener("transitionend", menu_handler);
    }
    loading.addEventListener("transitionend", menu_handler);
    setTimeout(function(){ loading.style.opacity = 0; }, 100);
  }
  loading.addEventListener("transitionend", story_handler);
  setTimeout(function(){ loading.style.opacity = 1; }, 100);
}

function exit_story(ch_path, story){
  story.stop_music();
  let loading = document.getElementById("loading");
  loading.style.display = "table";
  let story_handler = function(e){
    document.querySelector("#story #center").innerHTML = "";
    document.getElementById("story").style.display = "none";
    let ch_config = data_loader.get_data(ch_path + "game.json");
    for(let p of ch_config['panels']){
      data_loader.remove_data(ch_path + p.image);
      if(p.sound){
        data_loader.remove_data(ch_path + p.sound);
      }
    }
    data_loader.remove_data(ch_path + ch_config.music);
    loading.removeEventListener("transitionend", story_handler);

    document.getElementById("menu").style.display = "block";
    let menu_handler = function(){
      loading.style.display = "none";
      loading.removeEventListener("transitionend", menu_handler);
    }
    loading.addEventListener("transitionend", menu_handler);
    setTimeout(function(){ loading.style.opacity = 0; }, 100);
  }
  loading.addEventListener("transitionend", story_handler);
  setTimeout(function(){ loading.style.opacity = 1; }, 100);
}
