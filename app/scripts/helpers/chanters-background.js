Chanters("chanters-background", {
    backgroundImg: localStorage.getItem("backgroundImgUrl") || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
    zIndex: "z-index-center",
    savePopUp: "z-index-center",
    zIndex_: function(event) {
        this.zIndex = this.zIndex === "z-index-top" ? "z-index-center" : "z-index-top";
        if (this.zIndex === "z-index-top") {
            this.$.notification.reverse = false;
            this.showNotification("Hit escape to save...", "showNotification");
            this.$.notification.show();
        }
        // this.savePopUp = this.zIndex === "z-index-pinnacle" ? "z-index-center" : "z-index-pinnacle";
        localStorage.heightToScroll = getComputedStyle(this.$.background).top;
        localStorage.widthToScroll = getComputedStyle(this.$.background).left;

    },
    showNotification: function(message, whichNotification, imgSrc) {
        this.$.notification[whichNotification](message, imgSrc);
        this.$.notification.show();
    },
    onReady: function() {

        var that = this;

        function getImageScroll() {
            if (localStorage.getItem("heightToScroll") || localStorage.getItem("widthToScroll")) {
                that.$.background.style.top = localStorage.getItem("heightToScroll") || "0";
                that.$.background.style.left = localStorage.getItem("widthToScroll") || "0";
            }
        }
        getImageScroll();
        that.resizeImage();

        window.onresize = function() {
            // getImageScroll();
            // that.resizeImage();
        }

    },
    resizeImage: function() {
        var that = this;
        var heightToScroll = window.outerHeight - that.$.background.height;
        var widthToScroll = window.outerWidth - that.$.background.width;
        $(that.$.background).draggable({ containment: [widthToScroll, heightToScroll, 0, 0], scroll: false, cursor: "pointer" });
    },
    imageList: [],
    imageList_: function(list) {
        this.imageList = list;
        var blobURL = this.getBlobUrl(this.imageList[0]);

        this.backgroundImg = blobURL;

        var that = this;
        this.$.background.style.left = 0;
        this.$.background.style.top = 0;
        localStorage.widthToScroll = 0;
        localStorage.heightToScroll = 0;

        setTimeout(function() {
            that.resizeImage();
        }, 1000);

        function saveImage() {
            var reader = new FileReader();
            reader.onload = function(e) {
                localStorage.backgroundImgUrl = reader.result; //stores the image to localStorage
            }
            reader.readAsDataURL(list[0]);
        }

        saveImage();

    },
    getBlobUrl: function(file) {
        var _URL = window.URL || window.webkitURL,
            blobURL = _URL.createObjectURL(file);
        return blobURL;
    }
});
