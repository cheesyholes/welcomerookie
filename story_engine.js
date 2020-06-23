class Panel{
  constructor(main_config, p){
    this.id = p.id;
    this.img = loader.getFile("chapter/" + p.image).img.src;
    this.snd = null;
    if(p.sound){
      this.snd = loader.getFile("chapter/" + p.sound).element;
    }
    this.volume = 1;
    if(p.volume){
      this.volume = parseFloat(p.volume);
    }
    this.transition = "bottom";
    if(p.transition){
      this.transition = p.transition;
    }
    this.shake = 0;
    if(p.shake){
      this.shake = parseInt(p.shake);
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

  stop_sound(){
    if(this.snd != null){
      this.snd.pause();
      this.snd.currentTime = 0;
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
  constructor(main_config, ch_config){
    this.main_config = main_config;
    this.ch_config = ch_config;

    this.start_index = this.ch_config["start"];
    this.current_index = this.ch_config["start"];
    this.volume = parseFloat(this.ch_config["volume"]);
    this.panels = {};
    for(let p of this.ch_config["panels"]){
      this.panels[p.id] = new Panel(this.main_config, p);
    }
    this.music = null;
    if(ch_config["music"]){
      this.music = loader.getFile("chapter/" + ch_config["music"]).element;
      this.music.loop = true;
    }
    this.shade_left = loader.getFile("shade_left").img.src;
    this.shade_right = loader.getFile("shade_right").img.src;
  }

  play_music(){
    if(this.music != null){
      this.music.currentTime = 0;
      this.music.play();
    }
  }

  stop_music(){
    if(this.music != null){
      this.music.pause();
      this.music.currentTime = 0;
    }
  }

  change_volume(value){
    if(this.music != null){
      let targetMusic = this.volume * value;
      let smoothFunction = function () {
        this.music.volume = Math.lerp(this.music.volume, targetMusic, 0.05);
        if (Math.abs(this.music.volume - targetMusic) < 0.01) {
          this.music.volume = targetMusic;
        }
        else {
          setTimeout(smoothFunction, 50);
        }
      }.bind(this);
      this.fade = setTimeout(smoothFunction, 50);
    }
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
    p.stop_sound();
    stopShake();
    if(p.left.id.indexOf("#") >= 0){
      if(p.left.id.indexOf("exit") >= 0){
        exit_story(this);
      }
      if(p.left.id.indexOf("restart") >= 0){
        this.current_index = this.start_index;
        this.change_volume(this.get_current_panel().volume);
        restart_story(this);
      }
    }
    else{
      this.current_index = p.left.id;
      this.change_volume(this.get_current_panel().volume);
      if (this.get_current_panel().shake > 0){
        startShake(this.get_current_panel().shake);
      }
      return true;
    }
    return false;
  }

  go_right(){
    let p = this.get_current_panel();
    p.stop_sound();
    stopShake();
    if(p.right.id.indexOf("#") >= 0){
      if(p.right.id.indexOf("exit") >= 0){
        exit_story(this);
      }
      if(p.right.id.indexOf("restart") >= 0){
        this.current_index = this.start_index;
        this.change_volume(this.get_current_panel().volume);
        restart_story(this);
      }
    }
    else{
      this.current_index = p.right.id;
      this.change_volume(this.get_current_panel().volume);
      if (this.get_current_panel().shake > 0) {
        startShake(this.get_current_panel().shake);
      }
      return true;
    }
    return false;
  }
}
