function adjust_div(config, div){
  let center_div = div.querySelector("#center");
  center_div.style.top = config['top_height'] + "px";
  center_div.style.left = config['left_width'] + "px";
  center_div.style.width = config['width'] - config['left_width'] - config['right_width'] + "px";
  center_div.style.height = config['height'] - config['top_height'] - config['bot_height'] + "px";
}

function adjust_panels(config){
  let temp_x = config['width'] - config['a_width'] * Math.floor((config['width'] - 2 * config['min_lr']) / config['a_width']);
  let temp_y = config['height'] - (2 + config['inbet']) * config['a_height'] * Math.floor((config['height'] - 2 * config['min_tb']) / ((2 + config['inbet']) * config['a_height']));
  config['res'] = Math.floor((config['width'] - 2 * config['min_lr']) / config['a_width']);
  if (temp_y > temp_x){
    config['res'] = Math.floor((config['height'] - 2 * config['min_tb']) / ((2 + config['inbet']) * config['a_height']));
  }

  config['top_height'] = Math.floor((config['height'] - (2 + config['inbet']) * config['a_height'] * config['res'] - 2 * config['min_tb']) / 2) + config['min_tb'];
  config['bot_height'] = config['height'] - 2 * config['a_height'] * config['res'] - config['top_height'] - config['min_tb'];
  config['left_width'] = Math.floor((config['width'] - config['a_width'] * config['res'] - 2 * config['min_lr']) / 2) + config['min_lr'];
  config['right_width'] = config['width'] - config['a_width'] * config['res'] - config['left_width'];

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
  config['chapter_index'] = 0;
  adjust_panels(config);
}
