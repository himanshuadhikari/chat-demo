(function(window, document, undefined, factory) {
    window["ChantersPlayer"] = factory();

})(window, document, undefined, function() {
    var animationFlag = false,
        context,
        analyser,
        source,
        shuffle = false,
        ctx,
        previousSong;

    var ChantersPlayer = function(mediaObject) {
        this.player = mediaObject.audio;
        this.audio = this.player.$.audio;
        this.video = mediaObject.video;
        this.seek = mediaObject.seek;
        this.canvas = mediaObject.canvas;
        this.audio.volume = .0;

        context = new AudioContext(),
            analyser = context.createAnalyser(),
            source = context.createMediaElementSource(this.audio),
            source.connect(analyser),
            analyser.connect(context.destination);


        this.audio.ontimeupdate = this.ontimeupdate.bind(this);

        this.seek.oninput = function() {
            this.audio.currentTime = this.seek.value;
        }.bind(this);


        this.audio.onended = this.onended.bind(this);
        this.onend = mediaObject.onend;
    }

    ChantersPlayer.prototype.onended = function() {
        animationFlag = false;

        var nextSong = previousSong.nextElementSibling;
        // this.play.apply(this, [nextSong.file, nextSong]);

        this.onend(nextSong);

    }


    ChantersPlayer.prototype.play = function(file, currentSong) {
        if (previousSong) {
            previousSong.classList.remove("active-right");
            previousSong.classList.remove("active");
        }
        var _URL = window.URL || window.webkitURL;


        this.audio.src = _URL.createObjectURL(file);
        this.audio.load();
        this.audio.play();
        this.audio.volume = 0.7;

        previousSong = currentSong;
        this.visualizer();

        currentSong.classList.add("active-right");
        currentSong.classList.add("active");

    }


    ChantersPlayer.prototype.ontimeupdate = function() {
        var curtime = parseInt(this.audio.currentTime, 10);
        var min = Math.floor(curtime / 60);
        var sec = curtime % 60;
        if (sec < 10) {
            sec = '0' + sec;
        }
        if (min < 60) {
            min = '0' + min;
        }

        if (this.seek.max === "NaN") {
            this.seek.max = this.audio.duration;
        }

        this.seek.value = Math.floor(this.audio.currentTime);
        this.player.currenttime = min + ' : ' + sec;

    }



    ChantersPlayer.prototype.visualizer = function() {
        ctx = this.canvas.getContext('2d');
        analyser.connect(context.destination);
        animationFlag = true;
        this.frameLooper();
        var bufferLength = analyser.frequencyBinCount;
    }

    ChantersPlayer.prototype.frameLooper = function() {
        if (animationFlag) {
            window.requestAnimationFrame(this.frameLooper.bind(this));
            fbc_array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(fbc_array);
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // var grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
            // // light blue
            // grd.addColorStop(0, '#E20604');
            // // dark blue
            // grd.addColorStop(.20, '#FDF629');
            // grd.addColorStop(.40, '#4AF14E');
            // grd.addColorStop(.60, '#08D8EC');
            // grd.addColorStop(.80, '#3231F0');
            // grd.addColorStop(1, '#9426A3');
            // ctx.fillStyle = grd;

            var grd = ctx.createLinearGradient(0.000, 150.000, 300.000, 150.000);

            // Add colors
            grd.addColorStop(0.000, 'rgba(169, 71, 211, 1.000)');
            grd.addColorStop(0.000, 'rgba(211, 46, 126, 1.000)');
            grd.addColorStop(0.506, 'rgba(255, 170, 255, 1.000)');
            grd.addColorStop(1.000, 'rgba(255, 0, 255, 1.000)');

            // Fill with gradient
            ctx.fillStyle = grd;
            var bars = 100;
            for (var i = 0; i < bars; i++) {
                bar_x = i * 3;
                bar_width = 2;
                bar_height = -(fbc_array[i] / 3);
                // experiment.style.transform = "scale(" + -bar_height / 10 + ")";
                ctx.fillRect(bar_x, this.canvas.height, bar_width, bar_height);
                // ctx.fillRect(0, 0, 300.000, 300.000);
            }
        }
    }

    ChantersPlayer.prototype.getAudioDuration = function(file, callback) {
        var audio = new Audio();
        var _URL = window.URL || window.webkitURL;
        audio.src = _URL.createObjectURL(file);
        audio.load();
        audio.play();
        audio.volume = .0;


        audio.oncanplaythrough = function() {

            var min = Math.floor(audio.duration / 60);
            var sec = Math.floor(audio.duration % 60);
            if (sec < 10) {
                sec = '0' + sec;
            }
            if (min < 60) {
                min = '0' + min;
            }
            audio.pause();
            callback(min + " : " + sec);

        }.bind(this);
    }

    return ChantersPlayer;
});



// Chanters("chanters-player", {
//     domReady: function() {
//         window.requestAnimationFrame(welcomeAnimation);
//         this.style.display = "block";
//         setTimeout(function() {
//             document.querySelector("chanters-view").mode = "night";
//         }.bind(this), 201);
//     },
//     searchMode: "none",
//     left: "46%",
//     top: "300px",
//     visibility: "hidden",
//     videoMode: "hidden",
//     list_: [],
//     attachEvent: function() {
//         chantersPlayer.searchMode = "none";
//         document.addEventListener("keydown", keyEvent);
//     },
//     filterSeach: function(event) {
//         var list_ = [];
//         var currentSongIndex;
//         for (var i = 0; i < this.list_.length; i++) {
//             if (this.list_[i].name.toLowerCase().indexOf(event.target.value.trim()) !== -1) {
//                 list_.push(this.list_[i]);
//                 if (localStorage.songName === this.list_[i].name)
//                     currentSongIndex = list_.length;
//             }
//         }
//         this.createPlayList(list_, currentSongIndex);
//     },
//     createPlayList: function(list, currentSongIndex) {
//         var songList = document.querySelector("#songList");
//         songList.innerHTML = "";
//         currentSongIndex = currentSongIndex - 1;
//         for (var i = 0; i < list.length; i++) {
//             var li = document.createElement('li');
//             (function(li, i) {
//                 if (list[i].name.indexOf(".jpg") === -1 && list[i].name.indexOf(".jpeg") === -1) {
//                     li.innerHTML = '<a> ' + list[i].name + ' </a>';
//                     li.songObject = list[i];
//                     li.onclick = playMe;
//                     songList.appendChild(li);
//                     li.style.opacity = 1;
//                 }
//             })(li, i);
//         }
//         if (currentSongIndex !== undefined) {
//             setTimeout(function() {
//                 if (songList.children &&
//                     songList.children[currentSongIndex] &&
//                     !songList.children[currentSongIndex].classList.contains("border-right-red")) {
//                     console.log(currentSongIndex);
//                     songList.children[currentSongIndex].style.backgroundColor = "rgba(0, 0, 0, 0.498039)";
//                     songList.children[currentSongIndex].classList.add("border-right-red");
//                 }
//             }, 1000);
//         }
//     },
//     createList: function createList(event) {
//         event.target.nextElementSibling.click();
//         document.querySelector("#mode").classList.remove("hidden");
//         event.target.nextElementSibling.onchange = function() {
//             this.visibility = "hidden";
//             this.list_ = event.target.nextElementSibling.files,
//                 str = "",
//                 songList = document.querySelector("#songList"),
//                 chantersPlayer = document.querySelector("chanters-player");
//             document.querySelector("#songList ").style.display = "block";
//             document.querySelector("chanters-view").mode = "day";

//             for (var i = 0; i < this.list_.length; i++) {
//                 var li = document.createElement('li');
//                 (function(li, i) {
//                     if (this.list_[i].name.indexOf(".jpg") === -1 && this.list_[i].name.indexOf(".jpeg") === -1) {
//                         li.innerHTML = '<a> ' + this.list_[i].name + ' </a>';
//                         li.songObject = this.list_[i];
//                         li.onclick = playMe;
//                         songList.appendChild(li);
//                         setTimeout(function() {
//                             li.style.opacity = 1;
//                             if (chantersPlayer.clientHeight < chantersPlayer.parentNode.clientHeight) {
//                                 if (!chantersPlayer.style.height)
//                                     chantersPlayer.style.height = chantersPlayer.clientHeight + 4 + "px";
//                                 else {
//                                     chantersPlayer.style.height = parseInt(chantersPlayer.style.height.split("px")[0]) + 4 + "px";
//                                 }
//                             }
//                         }, 2000);
//                     }
//                 }.bind(this))(li, i);
//                 // getImageFromMp3(this.list_[i]);
//                 // }
//             }
//             welcome.remove();
//             document.querySelector("#fileupload").remove();
//             document.querySelector("#_fileupload").remove();
//             document.querySelector("#title").style.display = "block";
//         }.bind(this);
//     }
// });

// var notification;

// function notifyMe(songName) {
//     // Let's check if the browser supports notifications
//     if (!("Notification" in window)) {
//         alert("This browser does not support desktop notification");
//     }

//     // Let's check whether notification permissions have already been granted
//     else if (Notification.permission === "granted") {
//         // If it's okay let's create a notification
//         if (notification)
//             notification.close();
//         notification = new Notification("Chanters : Now playing", {
//             "body": songName,
//             "icon": "images/vidyut-jamwal-7a.jpg",
//             renotify: true
//         })
//     }

//     // Otherwise, we need to ask the user for permission
//     else if (Notification.permission !== 'denied') {
//         Notification.requestPermission(function(permission) {
//             // If the user accepts, let's create a notification
//             if (permission === "granted") {
//                 var notification = new Notification("Hi there!");
//                 var notification = new Notification("Chanters : Hi there!", {
//                     "body": "Welcome to Chanters",
//                     renotify: true
//                 })
//             }
//         });
//     }

//     // At last, if the user has denied notifications, and you 
//     // want to be respectful there is no need to bother them any more.
// }

// if (localStorage.isPlaying == "true") {
//     str = "Now playing " + localStorage.songName;
// }


// var welcome = document.querySelector("#welcome");
// var str = "welcome to chanters";
// var count = 0;

// function welcomeAnimation() {
//     if (str[count]) {
//         welcome.innerHTML += str[count];
//         count++;
//         window.requestAnimationFrame(welcomeAnimation);
//     } else {
//         setTimeout(function() {
//             if (localStorage.isPlaying == "true") {
//                 str = "Now playing " + localStorage.songName;
//             } else {
//                 var userName = localStorage.userName;
//                 var chantersPlayer = document.querySelector("chanters-player");
//                 welcome.innerHTML = "Hello " + userName + ", Please choose songs to play";
//                 document.querySelector("#fileupload").style.display = "block";
//                 window.cancelAnimationFrame(welcomeAnimation);
//                 chantersPlayer.visibility = "visible";
//             }
//         }, 2000)
//     }
// }




// function getImageFromMp3(file) {
//     id3(file, function(err, tags) {
//         var li = document.createElement('li');

//         if (tags && tags.v2 && tags.v2.image) {
//             var arrayBufferView = new Uint8Array(tags.v2.image.data);
//             tags.v2.image.mime = tags.v2.image.mime || 'image/jpeg';
//             var blob = new Blob([arrayBufferView], {
//                 type: tags.v2.image.mime
//             });
//             var urlCreator = window.URL || window.webkitURL;
//             var imageUrl = urlCreator.createObjectURL(blob);

//             li.innerHTML = '<image src="' + imageUrl + '"/><a onclick="playMe(event)"> ' + file.name + ' </a>';
//         } else {
//             li.innerHTML = '<a onclick="playMe(event)"> ' + file.name + ' </a>';
//         }
//         li.songObject = file;
//         document.querySelector("#songList").appendChild(li);
//     });
// }

// var audio = new Audio();
// var video = document.querySelector("video");
// context = new AudioContext();
// analyser = context.createAnalyser();
// source = context.createMediaElementSource(audio);
// source.connect(analyser);
// analyser.connect(context.destination);
// var canvas = document.getElementById('analyser');
// audio.volume = .7;
// var previous;
// var seek = document.querySelector("#seek");
// var chantersPlayer = document.querySelector("chanters-player");

// function playMe(event, nextSong) {
//     if (event && event.target && event.target.nodeName === "A" || (nextSong && nextSong.nodeName === "LI")) {

//         var currentSong = event && event.target && event.target.parentNode || nextSong;
//         applyCurrentSong(currentSong, previous);
//         previous = nextSong || event.target.parentNode;
//         var file = previous.songObject;

//         var _URL = window.URL || window.webkitURL;

//         // notifyMe(file.name);


//         if (file.name.indexOf(".mp4") !== -1) {
//             if (audio)
//                 audio.pause();
//             video.src = _URL.createObjectURL(file);
//             chantersPlayer.videoMode = "visible";
//             video.load();
//             video.play();
//             window.cancelAnimationFrame(frameLooper);
//             animationFlag = false;
//         } else {
//             audio.src = _URL.createObjectURL(file);
//             if (video) {
//                 video.pause();
//                 video.style.display = "none";
//                 chantersPlayer.videoMode = "hidden";
//             }
//             audio.load();
//             audio.play();
//             visualizer();
//             seek.max = audio.duration;
//             // if (!nextSong)
//             //     event.target.parentNode.appendChild(canvas);
//         }


//         localStorage.isPlaying = true;
//         localStorage.songName = file.name;
//         seek.style.display = "block";
//         document.querySelector("#totalTime").style.display = "block";
//         document.querySelector("#currentTime").style.display = "block";
//     }
// }

// function applyCurrentSong(currentSong, previousSong) {
//     if (previousSong) {
//         previousSong.classList.remove("border-right-red");
//         previousSong.style.backgroundColor = "transparent"
//     }

//     currentSong.classList.add("border-right-red");
//     currentSong.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
// }

// audio.oncanplaythrough = function() {
//     var min = Math.floor(audio.duration / 60);
//     var sec = Math.floor(audio.duration % 60);
//     if (sec < 10) {
//         sec = '0' + sec;
//     }
//     if (min < 60) {
//         min = '0' + min;
//     }

//     document.querySelector("#totalTime").innerText = min + " : " + sec;
// }

// audio.onended = function() {
//     var nextSong = previous.nextElementSibling;
//     playMe(undefined, nextSong);
// }

// video.onended = function() {
//     var nextSong = previous.nextElementSibling;
//     playMe(undefined, nextSong);
// }

// var visualizer = function() {
//     canvas.style.display = "block";
//     ctx = canvas.getContext('2d');
//     analyser.connect(context.destination);
//     animationFlag = true;
//     frameLooper();
//     bufferLength = analyser.frequencyBinCount;
// }

// function frameLooper() {
//     if (animationFlag) {
//         window.requestAnimationFrame(frameLooper);
//         fbc_array = new Uint8Array(analyser.frequencyBinCount);
//         analyser.getByteFrequencyData(fbc_array);
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         var grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
//         // light blue
//         grd.addColorStop(0, '#E20604');
//         // dark blue
//         grd.addColorStop(.20, '#FDF629');
//         grd.addColorStop(.40, '#4AF14E');
//         grd.addColorStop(.60, '#08D8EC');
//         grd.addColorStop(.80, '#3231F0');
//         grd.addColorStop(1, '#9426A3');
//         ctx.fillStyle = grd;
//         bars = 100;
//         for (var i = 0; i < bars; i++) {
//             bar_x = i * 3;
//             bar_width = 2;
//             bar_height = -(fbc_array[i] / 3);
//             // experiment.style.transform = "scale(" + -bar_height / 10 + ")";
//             ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
//         }
//     }
// }

// audio.ontimeupdate = function() {
//     var curtime = parseInt(audio.currentTime, 10);
//     var min = Math.floor(curtime / 60);
//     var sec = curtime % 60;
//     if (sec < 10) {
//         sec = '0' + sec;
//     }
//     if (min < 60) {
//         min = '0' + min;
//     }

//     if (seek.max === "NaN") {
//         seek.max = audio.duration;
//     }

//     seek.value = Math.floor(audio.currentTime);
//     document.querySelector("#currentTime").innerText = min + " : " + sec;
// }
// seek.oninput = function() {
//     audio.currentTime = seek.value;
// }

// var seekEvent = function(what) {
//     if (what === 'up') {
//         audio.currentTime += 5;
//     } else if (what === 'down') {
//         audio.currentTime -= 5;
//     }
// }

// var animationFlag = false;
// var keyEvent = function(event) {
//     if (event.keyCode === 38)
//         volumeEvent('up');

//     else if (event.keyCode === 40)
//         volumeEvent('down');

//     else if (event.keyCode === 39)
//         seekEvent('up');

//     else if (event.keyCode === 37)
//         seekEvent('down');

//     else if (event.keyCode === 77)
//         volumeEvent("mute");

//     else if (event.keyCode === 80)
//         if (audio.paused === false) {
//             audio.pause();
//             window.cancelAnimationFrame(frameLooper);
//             animationFlag = false;
//         } else {
//             audio.play();
//             animationFlag = true;
//             frameLooper();
//         }
//     else if (event.keyCode === 17 && localStorage.isPlaying == "true")
//         if (chantersPlayer.searchMode === "none") {
//             chantersPlayer.searchMode = "block";
//             document.removeEventListener("keydown", keyEvent);
//         }



//     if (previous) {
//         if (event.keyCode === 190)
//             playMe(undefined, previous.nextElementSibling);

//         if (event.keyCode === 188)
//             playMe(undefined, previous.previousElementSibling);
//     }
// }

// var volumeEvent = function(what) {
//     if (what === 'up' && audio.volume < .9) {
//         audio.volume += .1;
//     } else if (what === 'down' && audio.volume > .1) {
//         audio.volume -= .1;
//     } else if (what === "mute") {
//         if (audio.muted) {
//             audio.muted = false;
//             animationFlag = true;
//             frameLooper();
//         } else {
//             audio.muted = true;
//             window.cancelAnimationFrame(frameLooper);
//             animationFlag = false;
//         }
//     }
// }

// document.addEventListener("keydown", keyEvent);
// document.querySelector("#songList").addEventListener("wheel", scrollList);

// var lastScrollTop = 0;

// function scrollList(event) {
//     var delta = 0;
//     if (!event) event = window.event;
//     if (event.wheelDelta) {
//         delta = event.wheelDelta / 60;
//     } else if (event.detail) {
//         delta = -event.detail / 2;
//     }
//     var currPos = this.scrollTop;
//     currPos = parseInt(currPos) - (delta * 10);
//     this.scrollTop = currPos;
// };

// // var reader = new FileReader();
// // reader.onload = function(e) {
// //     var dv = new jDataView(this.result);

// //     if (dv.getString(3, dv._view.byteLength - 128) == 'TAG') {
// //         var title = dv.getString(30, dv.tell());
// //         var artist = dv.getString(30, dv.tell());
// //         var album = dv.getString(30, dv.tell());
// //         var year = dv.getString(4, dv.tell());
// //     } else {
// //         // no ID3v1 data found.
// //     }
// //     debugger;
// // }
// // reader.readAsArrayBuffer(file);
