let _shakeTimer = 0;

function _updateShake(){
  let res = loader.getFile("main").data["res"];
  if (_shakeTimer > 0){
    let value = res * 0.05;
    document.body.style.left = Math.floor((Math.random() - 0.5) * value) + "px";
    document.body.style.top = Math.floor((Math.random() - 0.5) * value) + "px";
    setTimeout(_updateShake, 1);
    _shakeTimer -= 1;
  }
  else{
    document.body.style.left = "";
    document.body.style.top = "";
  }
}

function startShake(length){
  setTimeout(function(){
    _shakeTimer = length;
    setTimeout(_updateShake, 1);
  }, 700);
}

function stopShake(){
  _shakeTimer = 0;
}

function add_panel(story){
  let old_panels = document.getElementById('story').getElementsByClassName('panel');
  if(old_panels){
    for(let p of old_panels){
      p.style.zIndex = "20";
    }
    if(old_panels.length == 1){
      setTimeout(function(){
        old_panels[0].style.bottom = story.main_config['center_height'] - story.main_config['a_height'] * story.main_config['res'] + 'px';
        old_panels[0].style.filter = "grayscale(100%)";
      }, 10);
    }
    else if(old_panels.length > 1){
      setTimeout(function(){
        old_panels[0].style.bottom = story.main_config['center_height'] + story.main_config['a_height'] * story.main_config['res'] + story.main_config['inbet_pixels'] + 'px';
      }, 10);
      setTimeout(function(){
        old_panels[1].style.bottom = story.main_config['center_height'] - story.main_config['a_height'] * story.main_config['res'] + 'px';
        old_panels[1].style.filter = "grayscale(100%)";
      }, 10);
    }
  }

  let new_panel = document.getElementsByTagName("template")[0].content.cloneNode(true).querySelector('.panel');
  new_panel.style.width = story.main_config['a_width'] * story.main_config['res'] + "px";
  new_panel.style.height = story.main_config['a_height'] * story.main_config['res'] + "px";
  new_panel.style.fontFamily = 'game_font';
  new_panel.children[0].src = story.get_current_panel().get_img();
  new_panel.children[1].src = story.get_shade_left();
  new_panel.children[2].src = story.get_shade_right();
  new_panel.children[3].style.fontSize = Math.floor(story.get_current_panel().get_left_size() * story.main_config['res']) + "px";
  new_panel.children[3].style.color = story.get_current_panel().get_left_color();
  new_panel.children[3].children[0].innerHTML = story.get_current_panel().get_left_text();
  new_panel.children[4].style.fontSize = Math.floor(story.get_current_panel().get_right_size() * story.main_config['res']) + "px";
  new_panel.children[4].style.color = story.get_current_panel().get_right_color();
  new_panel.children[4].children[0].innerHTML = story.get_current_panel().get_right_text();
  for(let c of new_panel.children){
    c.style.width = new_panel.style.width;
    c.style.height = new_panel.style.height;
  }
  
  switch(story.get_current_panel().transition.toLowerCase()){
    case "left":
      new_panel.style.left = story.main_config['center_width'] + story.main_config['min_lr'] + "px";
      new_panel.style.bottom = "0px";
      setTimeout(function () {
        new_panel.style.left = '0px';
      }, 500);
      break;
    case "right":
      new_panel.style.right = story.main_config['center_width'] + story.main_config['min_lr'] + "px";
      new_panel.style.bottom = "0px";
      setTimeout(function () {
        new_panel.style.right = '0px';
      }, 500);
      break;
    case "alpha":
      new_panel.style.left = "0px";
      new_panel.style.bottom = "0px";
      new_panel.style.opacity = 0;
      setTimeout(function () {
        new_panel.style.opacity = 1;
      }, 500);
      break;
    case "zoom":
      new_panel.style.left = "0px";
      new_panel.style.bottom = "0px";
      new_panel.style.opacity = 0;
      new_panel.style.transform = "scale(5)";
      setTimeout(function () {
        new_panel.style.opacity = 1;
        new_panel.style.transform = "scale(1)";
      }, 500);
      break;
    case "snap":
      new_panel.style.left = "0px";
      new_panel.style.bottom = "0px";
      new_panel.style.visibility = "hidden";
      setTimeout(function () {
        new_panel.style.visibility = "visible";
      }, 600);
      break;
    default:
      new_panel.style.bottom = -((story.main_config['a_height'] + story.main_config['inbet']) * story.main_config['res']) + "px";
      setTimeout(function () {
        new_panel.style.bottom = "0px";
      }, 10);
      break;
  }
  new_panel.style.zIndex = "" + 10;
  new_panel.ready = false;
  new_panel.addEventListener("transitionend", function(){
    let current = Math.floor(new_panel.style.bottom.split("px")[0]);
    let center = document.querySelector("#story #center");
    if(current > story.main_config['center_height'] && center.children.length >= 3){
      center.removeChild(new_panel);
    }
    new_panel.ready = true;
  });
  new_panel.mouseOffset = -1;
  new_panel.first_time = false;
  new_panel.slow_down = 1;
  let show_handler = function(e){
    let current = Math.floor(new_panel.style.bottom.split("px")[0]);
    if(current == 0 && new_panel.ready){
      if (!new_panel.first_time) {
        new_panel.mouseOffset = { x: e.offsetX, y: e.offsetY };
        new_panel.first_time = true;
      }
      if (Math.abs(e.offsetX - new_panel.mouseOffset.x) + Math.abs(e.offsetY - new_panel.mouseOffset.y) < story.main_config["mouse_sensitivity"] && 
        (e.offsetX < story.main_config["snap_percent"] * story.main_config['res'] || (story.main_config['a_width'] - story.main_config["snap_percent"]) * story.main_config['res'])){
        new_panel.mouseOffset = { x: e.offsetX, y: e.offsetY };
        return;
      }
      if(new_panel.slow_down > 0){
        new_panel.slow_down -= 1;
        return;
      }
      new_panel.slow_down = story.main_config['mouse_slow'];
      let shadingPercentage = 2 * (e.offsetX - story.main_config['center_width'] / 2) / 
        (story.main_config['center_width'] - 3 * story.main_config["snap_percent"] * story.main_config['res']);
      shadingPercentage = Math.clamp(shadingPercentage, -1, 1);
      if (Math.abs(shadingPercentage) < story.main_config["shading_noeffect"]) {
        shadingPercentage = 0;
      }

      new_panel.children[1].style.opacity = Math.clamp(0.0 - 1 * shadingPercentage, 0, 1);
      new_panel.children[2].style.opacity = Math.clamp(0.0 + 1 * shadingPercentage, 0, 1);

      new_panel.children[3].style.opacity = Math.clamp(0.0 - 1 * shadingPercentage, 0, 1);
      new_panel.children[3].style.filter = "grayscale(100%)";
      new_panel.children[4].style.opacity = Math.clamp(0.0 + 1 * shadingPercentage, 0, 1);
      new_panel.children[4].style.filter = "grayscale(100%)";

      if (e.offsetX > (story.main_config['a_width'] - story.main_config["snap_percent"]) * story.main_config['res']){
        new_panel.style.cursor = "pointer";
        new_panel.right = true;
        new_panel.left = false;
        new_panel.children[0].style.transform = "translate(" + -story.main_config['shift_x'] + "%)";
        // new_panel.children[2].style.opacity = 1;
        // new_panel.children[4].style.opacity = 1;
        new_panel.children[4].style.filter = "grayscale(0%)";
      }
      else if (e.offsetX < story.main_config["snap_percent"] * story.main_config['res']){
        new_panel.style.cursor = "pointer";
        new_panel.right = false;
        new_panel.left = true;
        new_panel.children[0].style.transform = "translate(" + story.main_config['shift_x'] + "%)";
        // new_panel.children[1].style.opacity = 1;
        // new_panel.children[3].style.opacity = 1;
        new_panel.children[3].style.filter = "grayscale(0%)";
      }
      else{
        new_panel.right = false;
        new_panel.left = false;
        new_panel.style.cursor = "default";
        // new_panel.children[0].style.transform = "scale(" + story.main_config['zoom_in'] + ")";
        new_panel.children[0].style.transform = "";
        // for(let i=1; i<new_panel.children.length; i++){
        //   new_panel.children[i].style.opacity = 0;
        // }
      }
    }
    else{
      new_panel.style.cursor = "default";
    }
    new_panel.last_time = Date.now();
    new_panel.mouseOffset = { x: e.offsetX, y: e.offsetY };
  };
  new_panel.addEventListener("mousemove", show_handler);
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
  new_panel.addEventListener("click", function(e){
    let current = Math.floor(new_panel.style.bottom.split("px")[0]);
    if(new_panel.ready && current == 0){
      if(new_panel.right){
        if(story.go_right()){
          story.main_config['next_entry'] = 0;
          new_panel.style.bottom = "1px";
          add_panel(story);
        }
      }
      else if(new_panel.left){
        if(story.go_left()){
          story.main_config['next_entry'] = 1;
          new_panel.style.bottom = "1px";
          add_panel(story);
        }
      }
    }
  });

  story.get_current_panel().play_sound();
  document.querySelector("#story #center").appendChild(new_panel);
}
