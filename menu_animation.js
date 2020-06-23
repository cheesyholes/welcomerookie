function add_menu_panel(main_config){
  let new_panel = document.getElementsByTagName("template")[0].content.cloneNode(true).querySelector('.panel');
  new_panel.style.width = main_config['a_width'] * main_config['res'] + "px";
  new_panel.style.height = main_config['a_height'] * main_config['res'] + "px";
  new_panel.style.fontSize = Math.floor(main_config["font_perc"] * main_config['res']) + "px";
  for(let c of new_panel.children){
    c.style.width = new_panel.style.width;
    c.style.height = new_panel.style.height;
  }
  new_panel.style.right = "0px";
  new_panel.style.bottom = Math.floor(main_config['center_height'] / 2 - main_config['a_height'] * 0.4 * main_config['res']) + "px";
  new_panel.style.zIndex = "" + 10;
  new_panel.style.fontFamily = 'game_font';
  new_panel.style.color = main_config["font_color"];
  new_panel.children[3].style.filter = "grayscale(100%)";
  new_panel.children[4].style.filter = "grayscale(100%)";

  new_panel.addEventListener("mousemove", function(e){
    if(main_config["chapters"].length <= 1){
      return;
    }
    let shadingPercentage = 2 * (e.offsetX - main_config['center_width'] / 2) / 
      (main_config['center_width'] - 3 * main_config["snap_percent"] * main_config['res']);
    shadingPercentage = Math.clamp(shadingPercentage, -1, 1);
    if (Math.abs(shadingPercentage) < main_config["shading_noeffect"]){
      shadingPercentage = 0;
    }
    
    new_panel.children[1].style.opacity = Math.clamp(0.0 - 1 * shadingPercentage, 0, 1);
    new_panel.children[2].style.opacity = Math.clamp(0.0 + 1 * shadingPercentage, 0, 1);

    new_panel.children[3].style.opacity = Math.clamp(0.0 - 1 * shadingPercentage, 0, 1);
    new_panel.children[3].style.filter = "grayscale(100%)";
    new_panel.children[4].style.opacity = Math.clamp(0.0 + 1 * shadingPercentage, 0, 1);
    new_panel.children[4].style.filter = "grayscale(100%)";

    if (e.offsetX > (main_config['a_width'] - main_config["snap_percent"]) * main_config['res']){
        new_panel.style.cursor = "pointer";
        new_panel.children[0].style.transform = "translate(" + -main_config['shift_x'] + "%)";
        // new_panel.children[2].style.opacity = 1;
        // new_panel.children[4].style.opacity = 1;
        new_panel.children[4].style.filter = "grayscale(0%)";
      }
    else if (e.offsetX < main_config["snap_percent"] * main_config['res']){
        new_panel.style.cursor = "pointer";
        new_panel.children[0].style.transform = "translate(" + main_config['shift_x'] + "%)";
        // new_panel.children[1].style.opacity = 1;
        // new_panel.children[3].style.opacity = 1;
        new_panel.children[3].style.filter = "grayscale(0%)";
      }
      else{
        new_panel.style.cursor = "default";
        new_panel.children[0].style.transform = "";
        // for(let i=1; i<new_panel.children.length; i++){
        //   new_panel.children[i].style.opacity = 0;
        // }
      }
  });
  new_panel.addEventListener("mouseout", function(){
    new_panel.children[0].style.transform = "scale(1) translate(0%)";
    new_panel.style.cursor = "default";
    for(let i=1; i<new_panel.children.length; i++){
      new_panel.children[i].style.opacity = 0;
    }
  });
  new_panel.addEventListener("click", function(e){
    if (main_config["chapters"].length <= 1) {
      return;
    }
    
    if(e.offsetX > (main_config['a_width'] - 1) * main_config['res']){
      main_config['chapter_index'] += 1;
      if(main_config['chapter_index'] >= main_config['chapters'].length){
        main_config['chapter_index'] = 0;
      }
      loader.getFile('menu_change').element.play();
    }
    else if(e.offsetX < main_config['res']){
      main_config['chapter_index'] -= 1;
      if(main_config['chapter_index'] < 0){
        main_config['chapter_index'] = main_config['chapters'].length - 1;
      }
      loader.getFile('menu_change').element.play();
    }
    new_panel.children[0].src = loader.getFile(main_config['chapters'][main_config['chapter_index']].picture).img.src;
  });

  new_panel.children[0].src = loader.getFile(main_config['chapters'][0].picture).img.src;
  new_panel.children[1].src = loader.getFile("shade_left").img.src;
  new_panel.children[2].src = loader.getFile("shade_right").img.src;

  let temp = document.querySelector("#menu #gamename");
  temp.style.bottom = Math.floor(main_config['center_height'] / 2 + main_config['a_height'] * 0.6 * main_config['res']) + "px";
  temp.style.fontSize = Math.floor(1.5 * main_config['font_perc'] * main_config['res']) + "px";

  let start = document.querySelector("#menu #gamestart");
  start.style.color = main_config["font_color"];
  start.style.top = Math.floor(main_config['center_height'] / 2 + main_config['a_height'] * 0.4 * main_config['res'] + main_config['inbet_pixels']) + "px";
  start.style.fontSize = Math.floor(main_config['font_perc'] * main_config['res']) + "px";
  start.children[0].addEventListener("mousemove", function(e){
    start.children[0].style.cursor = "pointer";
    start.style.transform = "scale(" + main_config['zoom_in'] + ")";
  });
  start.children[0].addEventListener("mouseout", function(e){
    start.children[0].style.cursor = "pointer";
    start.style.transform = "scale(1)";
  });
  start.children[0].addEventListener("click", function(e){
    loader.getFile('menu_select').element.play();
    show_story(main_config, main_config['chapter_index']);
  });

  let credits = document.querySelector("#menu #gamecredits");
  credits.style.color = main_config["font_color"];
  credits.style.top = Math.floor(main_config['center_height'] / 2 + main_config['a_height'] * 0.4 * main_config['res']) + 2*main_config['inbet_pixels'] + Math.floor(main_config['font_perc'] * main_config['res']) + "px";
  credits.style.fontSize = Math.floor(main_config['font_perc'] * main_config['res']) + "px";
  credits.children[0].addEventListener("mousemove", function(e){
    credits.children[0].style.cursor = "pointer";
    credits.style.transform = "scale(" + main_config['zoom_in'] + ")";
  });
  credits.children[0].addEventListener("mouseout", function(e){
    credits.children[0].style.cursor = "pointer";
    credits.style.transform = "scale(1)";
  });
  credits.children[0].addEventListener("click", function(e){
    loader.getFile('menu_select').element.play();
    show_credits(main_config);
  });

  document.querySelector("#menu #center").appendChild(new_panel);
}
