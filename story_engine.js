class Panel{
  constructor(ch_path, p, main_config){
    this.id = p.id;
    this.img = data_loader.get_data(ch_path + p.image).src;
    this.snd = null;
    if(p.sound){
      this.snd = data_loader.get_data(ch_path + p.sound);
    }
    this.left = {
      id: p.left[1],
      text: p.left[0],
      color: main_config["font_color"],
      size: main_config["font_perc"]
    };
    if(p.left.length > 2){
      this.left.size = p.left[2];
    }
    if(p.left.length > 3){
      this.left.color = p.left[3];
    }
    this.right = {
      id: p.right[1],
      text: p.right[0],
      color: main_config["font_color"],
      size: main_config["font_perc"]
    };
    if(p.right.length > 2){
      this.right.size = p.right[2];
    }
    if(p.right.length > 3){
      this.right.color = p.right[3];
    }
  }

  get_img(){
    return this.img;
  }

  play_sound(){
    if(this.snd != null){
      this.snd.currentTime = 0;
      this.snd.play();
    }
  }

  get_left_text(){
    return this.left.text;
  }

  get_right_text(){
    return this.right.text;
  }

  get_left_size(){
    return this.left.size;
  }

  get_right_size(){
    return this.right.size;
  }

  get_left_color(){
    return this.left.color;
  }

  get_right_color(){
    return this.right.color;
  }
}

class Story{
  constructor(data_path, ch_path, main_config, ch_config){
    this.data_path = data_path;
    this.ch_path = ch_path;
    this.main_config = main_config;
    this.start_index = ch_config["start"];
    this.current_index = ch_config["start"];
    this.panels = {};
    for(let p of ch_config["panels"]){
      this.panels[p.id] = new Panel(ch_path, p, main_config);
    }
    this.music = null;
    if(ch_config["music"]){
      this.music = data_loader.get_data(ch_path + ch_config["music"]);
      this.music.loop = true;
    }
    this.shade_left = data_loader.get_data(data_path + main_config["shade_left"]).src;
    this.shade_right = data_loader.get_data(data_path + main_config["shade_right"]).src;
  }

  play_music(){
    if(this.music != null){
      this.music.currentTime = 0;
      this.music.play();
    }
  }

  stop_music(){
    this.music.pause();
    this.music.currentTime = 0;
  }

  get_current_panel(){
    return this.panels[this.current_index];
  }

  get_shade_left(){
    return this.shade_left;
  }

  get_shade_right(){
    return this.shade_right;
  }

  go_left(){
    let p = this.get_current_panel();
    if(p.left.id.indexOf("#") >= 0){
      if(p.left.id.indexOf("exit") >= 0){
        exit_story(this.ch_path, this);
      }
      if(p.left.id.indexOf("restart") >= 0){
        this.current_index = this.start_index;
        restart_story(this.data_path, this.ch_path, this.main_config, this);
      }
    }
    else{
      this.current_index = p.left.id;
      return true;
    }
    return false;
  }

  go_right(){
    let p = this.get_current_panel();
    if(p.right.id.indexOf("#") >= 0){
      if(p.right.id.indexOf("exit") >= 0){
        exit_story(this.ch_path, this);
      }
      if(p.right.id.indexOf("restart") >= 0){
        this.current_index = this.start_index;
        restart_story(this.data_path, this.ch_path, this.main_config, this);
      }
    }
    else{
      this.current_index = p.right.id;
      return true;
    }
    return false;
  }
}
