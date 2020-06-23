function add_credits(config){
  let center = document.querySelector("#credits #center");
  for(let c of config.credits){
    let new_credit = document.getElementsByTagName("template")[1].content.cloneNode(true).querySelector('.creditline');
    new_credit.style.fontFamily = "game_font";
    new_credit.style.color = "#FFFFFF";
    new_credit.children[0].innerHTML = c.title;
    new_credit.children[0].style.fontSize = Math.floor(config["font_perc"] * config["res"] / 2) + "px";
    let names = ""
    for(let n of c.name){
      names += n + "<br/>";
    }
    new_credit.children[1].innerHTML = names;
    new_credit.children[1].style.fontSize = Math.floor(config["font_perc"] * config["res"]) + "px";
    new_credit.style.top = config["center_height"] + "px";
    center.appendChild(new_credit);
    setTimeout(function(){
      let rect = new_credit.getBoundingClientRect();
      let numberOfLines = 0;
      for(let t of config.credits){
        if(c == t){
          break;
        }
        numberOfLines += t.name.length + 2;
      }
      new_credit.style.top = config["center_height"] + numberOfLines * config["font_perc"] * config["res"] + "px";
      let id = setInterval(moveUp, 20);
      function moveUp(){
        let current = parseInt(new_credit.style.top.split("px")[0]);
        new_credit.style.top = (current - 1) + "px";
        if(current - 1 < -rect.height){
            clearInterval(id);
        }
      }
    }, 10);
  }

  let exit = document.querySelector("#credits #gameback");
  exit.style.color = config["font_color"];
  exit.style.fontSize = Math.floor(config['font_perc'] * config['res']) + "px";
  exit.style.bottom = config['bot_height'] + "px";
  exit.children[0].addEventListener("mousemove", function(e){
    exit.children[0].style.cursor = "pointer";
    exit.style.transform = "scale(" + config['zoom_in'] + ")";
  });
  exit.children[0].addEventListener("mouseout", function(e){
    exit.children[0].style.cursor = "pointer";
    exit.style.transform = "scale(1)";
  });
  exit.children[0].addEventListener("click", function(e){
    loader.getFile('menu_select').element.play();
    exit_credits(config);
  });
}
