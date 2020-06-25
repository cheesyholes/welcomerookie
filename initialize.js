function adjust_div(config, div){
  let center_div = div.querySelector("#center");
  center_div.style.top = config['top_height'] + "px";
  center_div.style.left = config['left_width'] + "px";
  center_div.style.width = config['width'] - config['left_width'] - config['right_width'] + "px";
  center_div.style.height = config['height'] - config['top_height'] - config['bot_height'] + "px";

  let decision_div = div.querySelector("#decision");
  if(decision_div){
    decision_div.style.fontFamily = "loading_font";
    decision_div.style.fontSize = Math.floor(config['decision_size'] * config['res']) + "px";
    decision_div.style.color = config['decision_color']
    decision_div.style.top = (config['center_height'] + config['top_height']) + "px";
    decision_div.children[1].innerText = config['decision_text'];
    decision_div.style.width = config['width'] + "px";
  }
}

function adjust_panels(config){
  let x_res = Math.floor((config['width'] - 2 * config['min_lr']) / config['a_width']);
  let y_res = Math.floor((config['height'] - 2 * config['min_tb']) / ((2 + config['inbet']) * config['a_height']));
  config['res'] = Math.min(x_res, y_res);

  config['top_height'] = Math.floor((config['height'] - (2 + config['inbet']) * config['a_height'] * config['res']) / 2);
  config['bot_height'] = config['top_height'];
  config['left_width'] = Math.floor((config['width'] - config['a_width'] * config['res']) / 2);
  config['right_width'] = config['left_width'];

  config['center_width'] = config['width'] - config['left_width'] - config['right_width'];
  config['center_height'] = config['height'] - config['top_height'] - config['bot_height'];
  config['inbet_pixels'] = config['center_height'] - 2 * config['a_height'] * config['res'];

  adjust_div(config, document.getElementById("menu"));
  adjust_div(config, document.getElementById("story"));
  adjust_div(config, document.getElementById("credits"));
}

function onload(config){
  config['width'] = window.innerWidth;
  config['height'] = window.innerHeight;
  document.getElementById("loading").style.width = config['width'];
  document.getElementById("loading").style.height = config['height'];
  config['chapter_index'] = 0;
  let resize = function () {
    let wrapper = document.getElementById("wrapper");
    let widthNoPadding = config['a_width'] * config['res'] + 2 * config['min_lr'];
    let heightNoPadding = (2 + config['inbet']) * config['a_height'] * config['res'] + 2 * config['min_tb'];
    let scale = Math.min(window.innerWidth / widthNoPadding, window.innerHeight / heightNoPadding);
    wrapper.style.transform = "scale(" + scale + ")";
    let shift_x = (window.innerWidth - config['width'] * scale) / 2;
    let shift_y = (window.innerHeight - config['height'] * scale) / 2;
    wrapper.style.top = shift_y + "px";
    wrapper.style.left = shift_x + "px";
  };
  document.body.onresize = resize;
  document.body.onfullscreenchange = resize;
  adjust_panels(config);
}
