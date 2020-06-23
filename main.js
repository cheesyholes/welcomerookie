let data_path = "data/";

Math.lerp = function (from, to, progress) {
  return from + (to - from) * progress;
}

Math.clamp = function (value, min, max) {
  if (max > min) {
    if (value < min) return min;
    else if (value > max) return max;
    else return value;
  } else {
    if (value < max) return max;
    else if (value > min) return min;
    else return value;
  }
}

document.body.onload = function(){
  show_menu();
}
