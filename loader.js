class Loader{
    constructor(){
        this._cache = {};
        this._loadingInProgress = false;
        this._loadedAssets = 0;
        this._downloadables = [];
        this._callback = null;
    }

    loadFile(name, filename){
        if (name in this._cache){
            console.log("This name \"" + name + "\" has been used!");
            return;
        }
        if (this._loadingInProgress){
            console.log("Can't load anything while loading is working!");
            return;
        }
        if (filename.toLowerCase().endsWith("json")){
            this._cache[name] = this._loadJson(filename);
        }
        if (filename.toLowerCase().endsWith("txt")){
            this._cache[name] = this._loadTxt(filename);
        }
        if (filename.toLowerCase().endsWith("xml")){
            this._cache[name] = this._loadXml(filename);
        }
        if (filename.toLowerCase().endsWith("png") || filename.toLowerCase().endsWith("gif") || filename.toLowerCase().endsWith("bmp") ||
            filename.toLowerCase().endsWith("jpg") || filename.toLowerCase().endsWith("jpeg") || filename.toLowerCase().endsWith("svg") ||
            filename.toLowerCase().endsWith("tif") || filename.toLowerCase().endsWith("ico")){
            this._cache[name] = this._loadBitmap(filename);
        }
        if (filename.toLowerCase().endsWith("mp3") || filename.toLowerCase().endsWith("wav") || 
            filename.toLowerCase().endsWith("ogg") || filename.toLowerCase().endsWith("m4a")){
            this._cache[name] = this._loadSample(filename);
        }
        if (filename.toLowerCase().endsWith("ttf") || filename.toLowerCase().endsWith("eot") || filename.toLowerCase().endsWith("woff")){
            this._cache[name] = this._loadFont(name, filename);
        }
    }

    getFile(name){
        if (name in this._cache && this._cache[name].ready){
            return this._cache[name];
        }
        return null;
    }

    startLoading(callback) {
        this._callback = callback;
        this._loadedAssets = 0;
        this._loadingInProgress = true;
        setTimeout(this._checkProgress.bind(this), 100);
    }

    getLoadingProgress(){
        if(this._downloadables.length == 0){
            return 1;
        }
        return this._loadedAssets / this._downloadables.length;
    }

    clearCache(name){
      let todelete = [];
      for(let n in this._cache){
        if(name in n){
          todelete.push(n);
        }
      }
      for(let n of todelete){
        delete this._cache[n];
      }
    }

    clearAll(){
        this._cache = {};
        this._downloadables = [];
        this._loadedAssets = 0;
        this._callback = null;
        this._loadingInProgress = false;
    }

    _checkProgress(){
        this._loadedAssets = 0;
        for(let d of this._downloadables){
            if(d.ready){
                this._loadedAssets += 1;
            }
        }
        if(this._loadedAssets < this._downloadables.length){
            setTimeout(this._checkProgress.bind(this), 100);
        }
        else{
            this._loadingInProgress = false;
            this._downloadables.length = 0;
            if(this._callback){
                this._callback();
            }
        }
    }

    /// Loads JSON file
    /// Loads JSON from file asynchronously
    /// @param filename the json file name
    /// @return the loaded json file
    _loadJson(filename) {
        console.log("Loading json " + filename + "...");
        var jsonFile = { data: null, ready: false, type: "json" };
        this._downloadables.push(jsonFile);
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', filename, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                console.log("JSON " + filename + " loaded, #chars: " + xobj.responseText.length + "!");
                jsonFile.data = JSON.parse(xobj.responseText);
                jsonFile.ready = true;
            }
        };
        xobj.send(null);
        return jsonFile;
    }

    /// Loads txt file
    /// Loads txt from file asynchronously
    /// @param filename the txt file name
    /// @return the loaded txt file
    _loadTxt(filename) {
        console.log("Loading txt " + filename + "...");
        var txtFile = { data: null, ready: false, type: "txt" };
        this._downloadables.push(txtFile);
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/txt");
        xobj.open('GET', filename, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                console.log("TXT " + filename + " loaded, #chars: " + xobj.responseText.length + "!");
                txtFile.data = xobj.responseText;
                txtFile.ready = true;
            }
        };
        xobj.send(null);
        return txtFile;
    }

    /// Loads XML file
    /// Loads XML from file asynchronously
    /// @param filename the xml file name
    /// @return the loaded xml file
    _loadXml(filename) {
        console.log("Loading xml " + filename + "...");
        var xmlFile = { data: null, ready: false, type: "xml" };
        this._downloadables.push(xmlFile);
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/xml");
        xobj.open('GET', filename, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                console.log("XML " + filename + " loaded, #chars: " + xobj.responseText.length + "!");
                xmlFile.data = xobj.responseXML;
                xmlFile.ready = true;
            }
        };
        xobj.send(null);
        return xmlFile;
    }

    /// Loads bitmap from file
    /// Loads image from file asynchronously. This means that the execution won't stall for the image, and it's data won't be accessible right off the start. You can check for bitmap object's 'ready' member to see if it has loaded, but you probably should avoid stalling execution for that, as JS doesn't really like that.
    /// @param filename URL of image
    /// @return bitmap object, or -1 on error
    _loadBitmap(filename) {
        console.log("Loading bitmap " + filename + "...");
        var img = new Image();
        img.src = filename;
        var bmp = { img: img, width:-1, height:-1, ready: false, type: "bmp" };
        this._downloadables.push(bmp);
        img.onload = function () {
            console.log("Bitmap " + filename + " loaded, size: " + img.width + " x " + img.height + "!");
            bmp.width = img.width;
            bmp.height = img.height;
            bmp.ready = true;
        };
        return bmp;
    }

    /// Loads a sample from file
    /// Loads a sample from file and returns it. Doesn't stall for loading, use ready() to make sure your samples are loaded! Note that big files, such as music jingles, will most probably get streamed instead of being fully loaded into memory, meta data should be accessible tho.
    /// @param filename name of the audio file
    /// @return sample object
    _loadSample(filename){
        var audio = document.createElement('audio');
        audio.src = filename;
        var sample = {element:audio, file:filename, ready:false, type:"snd"};
        this._downloadables.push(sample);
        console.log("Loading sample " + filename + "...");
        audio.onloadeddata = function()
        {
            if (!sample.ready)
            {
                sample.ready=true;
                console.log("Sample " + filename + " loaded!");
            }
        }
        return sample;
    }

    /// Loads font from file.
    /// This actually creates a style element, puts code inside and appends it to class. I heard it works all the time most of the time. Note that this function won't make ready() wait, as it's not possible to consistently tell if a font has been loaded in js, thus load your fonts first thing, and everything should be fine.
    /// @param filename Font file URL
    /// @return font object
    _loadFont(name, filename) {
        var s = document.createElement('style');
        var fontname = name;
        s.id = fontname;
        s.type = "text/css";
        document.head.appendChild(s);
        s.textContent = "@font-face { font-family: " + fontname + "; src:url('" + filename + "');}";
        return { element: s, file: filename, name: fontname, type: "fnt", ready: true };
    }
}

let loader = new Loader();

function show_menu(){
  loader.loadFile("main", data_path + "main.json");
  loader.loadFile("cross", data_path + "menu/cross.png");
  loader.startLoading(function(){
    let main_config = loader.getFile("main").data;
    for(let ch of main_config.chapters){
      loader.loadFile(ch.picture, data_path + ch.picture);
    }
    loader.loadFile("shade_left", data_path + main_config["shade_left"]);
    loader.loadFile("shade_right", data_path + main_config["shade_right"]);
    loader.loadFile("loading_font", data_path + main_config["loading_font"]);
    loader.loadFile("loading_text", data_path + main_config["loading_text"]);
    loader.loadFile("game_font", data_path + main_config["game_font"]);
    loader.loadFile("menu_change", data_path + main_config["menu_change"]);
    loader.loadFile("menu_select", data_path + main_config["menu_select"]);
    loader.startLoading(function(){
      document.body.style.fontFamily = 'game_font, Arial';
      document.getElementById("menu").style.display = "block";
      let loading = document.getElementById("loading");
      loading.style.fontFamily = 'loading_font, Arial';
      let loadingText = document.getElementById("loadingtext");
      loadingText.innerText = main_config["loading_text"];
      let handler = function(){
        loading.style.display = "none";
        loading.removeEventListener("transitionend", handler);
      }
      loading.addEventListener("transitionend", handler);
      setTimeout(function(){ loading.style.opacity = 0; }, 100);
      onload(main_config);
      add_menu_panel(main_config);
    })
  });
}

function show_credits(){
  let loading = document.getElementById("loading");
  loading.style.display = "table";
  let credits_handler = function(e){
    document.getElementById("credits").style.display = "block";
    document.getElementById("menu").style.display = "none";
    add_credits(loader.getFile("main").data);
    loading.removeEventListener("transitionend", credits_handler);
    let menu_handler = function(){
      loading.style.display = "none";
      loading.removeEventListener("transitionend", menu_handler);
    }
    loading.addEventListener("transitionend", menu_handler);
    setTimeout(function(){ loading.style.opacity = 0; }, 100);
  }
  loading.addEventListener("transitionend", credits_handler);
  setTimeout(function(){ loading.style.opacity = 1; }, 100);
}

function exit_credits(){
  let loading = document.getElementById("loading");
  loading.style.display = "table";
  let menu_handler = function(e){
    document.getElementById("credits").style.display = "none";
    document.getElementById("menu").style.display = "block";
    document.querySelector("#credits #center").innerHTML = "";
    loading.removeEventListener("transitionend", menu_handler);
    let credits_handler = function(){
      loading.style.display = "none";
      loading.removeEventListener("transitionend", credits_handler);
    }
    loading.addEventListener("transitionend", credits_handler);
    setTimeout(function(){ loading.style.opacity = 0; }, 100);
  }
  loading.addEventListener("transitionend", menu_handler);
  setTimeout(function(){ loading.style.opacity = 1; }, 100);
}

function show_story(main_config, index){
  let loading = document.getElementById("loading");
  loading.style.display = "table";
  let menu_handler = function(e){
    document.getElementById("menu").style.display = "none";
    loading.removeEventListener("transitionend", menu_handler);
  }
  loading.addEventListener("transitionend", menu_handler);
  setTimeout(function(){ loading.style.opacity = 1; }, 100);
  let ch_path = data_path + main_config['chapters'][index].folder;
  loader.loadFile("chapter", ch_path + "game.json");
  loader.startLoading(function(){
    let ch_config = loader.getFile("chapter").data;
    for(let p of ch_config['panels']){
      loader.loadFile("chapter/" + p.image, ch_path + p.image);
      if(p.sound){
        loader.loadFile("chapter/" + p.sound, ch_path + p.sound);
      }
    }
    if(ch_config.music){
      loader.loadFile("chapter/" + ch_config.music, ch_path + ch_config.music);
    }
    loader.startLoading(function(){
      let story = new Story(main_config, ch_config);
      document.getElementById("story").style.display = "block";
      let loading = document.getElementById("loading");
      let story_handler = function(){
        loading.style.display = "none";
        story.play_music();
        add_panel(story);
        loading.removeEventListener("transitionend", story_handler);
      }
      loading.addEventListener("transitionend", story_handler);
      setTimeout(function(){ loading.style.opacity = 0; }, 100);
    });
  });
}

function restart_story(story){
  story.stop_music();
  let loading = document.getElementById("loading");
  loading.style.display = "table";
  let story_handler = function(e){
    document.querySelector("#story #center").innerHTML = "";
    loading.removeEventListener("transitionend", story_handler);
    let menu_handler = function(){
      loading.style.display = "none";
      story.play_music();
      add_panel(story);
      loading.removeEventListener("transitionend", menu_handler);
    }
    loading.addEventListener("transitionend", menu_handler);
    setTimeout(function(){ loading.style.opacity = 0; }, 100);
  }
  loading.addEventListener("transitionend", story_handler);
  setTimeout(function(){ loading.style.opacity = 1; }, 100);
}

function exit_story(story){
  story.stop_music();
  let loading = document.getElementById("loading");
  loading.style.display = "table";
  let story_handler = function(e){
    document.querySelector("#story #center").innerHTML = "";
    document.getElementById("story").style.display = "none";
    loader.clearCache("chapter");
    loading.removeEventListener("transitionend", story_handler);
    document.getElementById("menu").style.display = "block";
    let menu_handler = function(){
      loading.style.display = "none";
      loading.removeEventListener("transitionend", menu_handler);
    }
    loading.addEventListener("transitionend", menu_handler);
    setTimeout(function(){ loading.style.opacity = 0; }, 100);
  }
  loading.addEventListener("transitionend", story_handler);
  setTimeout(function(){ loading.style.opacity = 1; }, 100);
}
