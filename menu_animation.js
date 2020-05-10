function add_menu_panel(data_path, config){
  let new_panel = document.getElementsByTagName("template")[0].content.cloneNode(true).querySelector('.panel');
  new_panel.style.width = config['a_width'] * config['res'] + "px";
  new_panel.style.height = config['a_height'] * config['res'] + "px";
  new_panel.style.fontSize = Math.floor(config["font_perc"] * config['res']) + "px";
  for(let c of new_panel.children){
    c.style.width = new_panel.style.width;
    c.style.height = new_panel.style.height;
  }
  new_panel.style.right = "0px";
  new_panel.style.bottom = Math.floor(config['center_height'] / 2 - config['a_height'] * config['res'] / 2) + "px";
  new_panel.style.zIndex = "" + 10;
  new_panel.style.fontFamily = '"' + data_path + config["font"] + '"';
  new_panel.style.color = config["font_color"];
  new_panel.addEventListener("mousemove", function(e){
    let current = Math.floor(new_panel.style.bottom.split("px")[0]);
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
  });
  new_panel.addEventListener("mouseout", function(){
    let current = Math.floor(new_panel.style.bottom.split("px")[0]);
    new_panel.children[0].style.transform = "scale(1) translate(0%)";
    new_panel.style.cursor = "default";
    for(let i=1; i<new_panel.children.length; i++){
      new_panel.children[i].style.opacity = 0;
    }
  });
  new_panel.addEventListener("click", function(e){
    let current = Math.floor(new_panel.style.bottom.split("px")[0]);
    if(e.offsetX > (config['a_width'] - 1) * config['res']){
      config['chapter_index'] += 1;
      if(config['chapter_index'] >= config['chapters'].length){
        config['chapter_index'] = 0;
      }
      data_loader.get_data(data_path + config['menu_sound']).play();
    }
    else if(e.offsetX < config['res']){
      config['chapter_index'] -= 1;
      if(config['chapter_index'] < 0){
        config['chapter_index'] = config['chapters'].length - 1;
      }
      data_loader.get_data(data_path + config['menu_sound']).play();
    }
    new_panel.children[0].src = data_loader.get_data(data_path + config['chapters'][config['chapter_index']].picture).src;
  });

  new_panel.children[0].src = data_loader.get_data(data_path + config['chapters'][0].picture).src;
  new_panel.children[1].src = data_loader.get_data(data_path + config["shade_left"]).src;
  new_panel.children[2].src = data_loader.get_data(data_path + config["shade_right"]).src;

  let temp = document.querySelector("#menu #gamename");
  temp.style.bottom = Math.floor(config['center_height'] / 2 + config['a_height'] * config['res'] / 2) + "px";
  temp.style.fontSize = Math.floor(1.5 * config['font_perc'] * config['res']) + "px";

  let start = document.querySelector("#menu #gamestart");
  start.style.color = config["font_color"];
  start.style.top = Math.floor(config['center_height'] / 2 + config['a_height'] * config['res'] / 2 + config['inbet_pixels']) + "px";
  start.style.fontSize = Math.floor(config['font_perc'] * config['res']) + "px";
  start.children[0].addEventListener("mousemove", function(e){
    start.children[0].style.cursor = "pointer";
    start.style.transform = "scale(" + config['zoom_in'] + ")";
  });
  start.children[0].addEventListener("mouseout", function(e){
    start.children[0].style.cursor = "pointer";
    start.style.transform = "scale(1)";
  });
  start.children[0].addEventListener("click", function(e){
    data_loader.get_data(data_path + config['select_sound']).play();
    show_story(data_path, data_path + config['chapters'][config['chapter_index']].folder, config);
  });

  let credits = document.querySelector("#menu #gamecredits");
  credits.style.color = config["font_color"];
  credits.style.top = Math.floor(config['center_height'] / 2 + config['a_height'] * config['res'] / 2) + 2*config['inbet_pixels'] + Math.floor(config['font_perc'] * config['res']) + "px";
  credits.style.fontSize = Math.floor(config['font_perc'] * config['res']) + "px";
  credits.children[0].addEventListener("mousemove", function(e){
    credits.children[0].style.cursor = "pointer";
    credits.style.transform = "scale(" + config['zoom_in'] + ")";
  });
  credits.children[0].addEventListener("mouseout", function(e){
    credits.children[0].style.cursor = "pointer";
    credits.style.transform = "scale(1)";
  });
  credits.children[0].addEventListener("click", function(e){
    data_loader.get_data(data_path + config['select_sound']).play();
    show_credits(data_path, config);
  });

  document.querySelector("#menu #center").appendChild(new_panel);
}
