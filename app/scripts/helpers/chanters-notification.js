Chanters("chanters-notification", {
    imgSrc: "static/images/music-icon.png",
    show: function() {
        this.delay("visible");
    },
    hide: function() {
        this.delay("hidden");
    },
    delay: function(mode) {
        var visibility;
        if (mode && typeof mode === "string")
            visibility = mode;
        else
            visibility = this.visibility === "visible" ? "hidden" : "visible";

        setTimeout(function() {
            this.visibility = visibility;
        }.bind(this));
    },
    showWelcomeMessage: function(message) {
        setTimeout(function() {
            this.showNotification(message);
        }.bind(this), 2000);

        setTimeout(function() {
            var str = "Hello " + localStorage.userName + ", please choose songs to play by clicking 'Add Songs' button in Settings";
            this.showNotification(str);
        }.bind(this), 5000)
    },
    welcomeAnimation: function() {
        if (this.str[this.count]) {
            if (this.reverse === true) {
                this.message = this.message.substring(0, this.count);
                this.count--;
            } else {
                this.message += this.str[this.count];
                this.count++;
            }
            window.requestAnimationFrame(this.welcomeAnimation.bind(this));
        }
    },
    showNotification: function(message, imgSrc) {
        this.message = "";
        this.str = message;
        this.count = 0;
        this.imgSrc = imgSrc || this.imgSrc;

        this.welcomeAnimation();

        setTimeout(function() {
            this.hide();
        }.bind(this), 10000);


        setTimeout(function() {
            this.count--;
            this.reverse = true;
            this.welcomeAnimation()
        }.bind(this), 9800);
    }
});
