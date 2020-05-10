function add_panel(data_path, ch_path, config, story){
  let old_panels = document.getElementById('story').getElementsByClassName('panel');
  if(old_panels){
    for(let p of old_panels){
      p.style.zIndex = "20";
    }
    if(old_panels.length == 1){
      setTimeout(function(){
        old_panels[0].style.bottom = config['center_height'] - config['a_height'] * config['res'] + 'px';
        old_panels[0].style.filter = "grayscale(100%)";
      }, 10);
    }
    else if(old_panels.length > 1){
      setTimeout(function(){
        old_panels[0].style.bottom = config['center_height'] + config['a_height'] * config['res'] + config['inbet_pixels'] + 'px';
      }, 10);
      setTimeout(function(){
        old_panels[1].style.bottom = config['center_height'] - config['a_height'] * config['res'] + 'px';
        old_panels[1].style.filter = "grayscale(100%)";
      }, 10);
    }
  }

  let new_panel = document.getElementsByTagName("template")[0].content.cloneNode(true).querySelector('.panel');
  new_panel.style.width = config['a_width'] * config['res'] + "px";
  new_panel.style.height = config['a_height'] * config['res'] + "px";
  new_panel.style.fontFamily = '"' + data_path + config["font"] + '"';
  new_panel.children[0].src = story.get_current_panel().get_img();
  new_panel.children[1].src = story.get_shade_left();
  new_panel.children[2].src = story.get_shade_right();
  new_panel.children[3].style.fontSize = Math.floor(story.get_current_panel().get_left_size() * config['res']) + "px";
  new_panel.children[3].style.color = story.get_current_panel().get_left_color();
  new_panel.children[3].children[0].innerText = story.get_current_panel().get_left_text();
  new_panel.children[4].style.fontSize = Math.floor(story.get_current_panel().get_right_size() * config['res']) + "px";
  new_panel.children[4].style.color = story.get_current_panel().get_right_color();
  new_panel.children[4].children[0].innerText = story.get_current_panel().get_right_text();
  for(let c of new_panel.children){
    c.style.width = new_panel.style.width;
    c.style.height = new_panel.style.height;
  }
  if(config['next_entry'] == 0){
    new_panel.style.right = config['center_width'] + config['min_lr'] + "px";
    setTimeout(function(){
      new_panel.style.right = '0px';
    }, 10);
  }
  else{
    new_panel.style.left = config['center_width'] + config['min_lr'] + "px";
    setTimeout(function(){
      new_panel.style.left = '0px';
    }, 10);
  }
  new_panel.style.bottom = "0px";
  new_panel.style.zIndex = "" + 10;
  new_panel.addEventListener("transitionend", function(){
    let current = Math.floor(new_panel.style.bottom.split("px")[0]);
    if(current > config['center_height']){
      document.querySelector("#story #center").removeChild(new_panel);
    }
  });
  let show_handler = function(e){
    let current = Math.floor(new_panel.style.bottom.split("px")[0]);
    if(current == 0){
      if(e.offsetX > (config['a_width'] - 1) * config['res']){
        new_panel.style.cursor = "pointer";
        new_panel.children[0].style.transform = "translate(" + -config['shift_x'] + "%) " + "scale(" + config['zoom_in'] + ")";
        new_panel.children[2].style.opacity = 1;
        new_panel.children[4].style.opacity = 1;
      }
      else if(e.offsetX < config['res']){
        new_panel.style.cursor = "pointer";
        new_panel.children[0].style.transform = "translate(" + config['shift_x'] + "%) " + "scale(" + config['zoom_in'] + ")";
        new_panel.children[1].style.opacity = 1;
        new_panel.children[3].style.opacity = 1;
      }
      else{
        new_panel.style.cursor = "default";
        new_panel.children[0].style.transform = "scale(" + config['zoom_in'] + ")";
        for(let i=1; i<new_panel.children.length; i++){
          new_panel.children[i].style.opacity = 0;
        }
      }
    }
    else{
      new_panel.style.cursor = "default";
    }
  };
  new_panel.addEventListener("mousemove", show_handler);
  new_panel.addEventListener("mouseenter", show_handler);
  new_panel.addEventListener("mouseout", function(){
    let current = Math.floor(new_panel.style.bottom.split("px")[0]);
    if(current == 0){
      new_panel.children[0].style.transform = "scale(1) translate(0%)";
      new_panel.style.cursor = "default";
      for(let i=1; i<new_panel.children.length; i++){
        new_panel.children[i].style.opacity = 0;
      }
    }
  });
  new_panel.ready = false;
  new_panel.addEventListener("transitionend", function(){
    new_panel.ready = true;
  });
  new_panel.addEventListener("click", function(e){
    let current = Math.floor(new_panel.style.bottom.split("px")[0]);
    if(new_panel.ready && current == 0){
      if(e.offsetX > (config['a_width'] - 1) * config['res']){
        if(story.go_right()){
          config['next_entry'] = 0;
          add_panel(data_path, ch_path, config, story);
        }
      }
      else if(e.offsetX < config['res']){
        if(story.go_left()){
          config['next_entry'] = 1;
          add_panel(data_path, ch_path, config, story);
        }
      }
    }
  });

  story.get_current_panel().play_sound();
  document.querySelector("#story #center").appendChild(new_panel);
}
