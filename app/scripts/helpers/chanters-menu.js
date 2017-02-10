Chanters("chanters-menu", {
    inheritParent: true,
    onReady: function() {
        if (localStorage.mode && localStorage.mode === "Night Mode") {
            this.activeMenuItem(this.$.menu.children[3], "true");
            this.$.menu.children[3].mode = "Night Mode";
        } else {
            this.$.menu.children[3].mode = "Day Mode";
        }
    },
    itemClick: function(event, itemName, isActive) {
        if (this.callback)
            this.parent[this.callback](event, itemName);

        this.activeMenuItem(event.target, isActive);
    },
    visibility_: function(event) {
        this.setPosition(event);
        this.visibility = this.visibility === "hidden" ? "visible" : "hidden";
    },
    activeMenuItem: function(target, isActive) {
        if (isActive === "true")
            target.classList.contains("active-left") === true ? target.classList.remove("active-left") : target.classList.add("active-left");
    },
    hideMenu: function(event) {
        if (event.target.nodeName === "UL" && this.visibility === "visible")
            this.visibility = "hidden";
    },
    clearCache: function(event) {
        this.$.fileupload.value = "";
        delete localStorage.currentSong;
        document.querySelector("chanters-player").remove();
        document.querySelector("chanters-content").appendChild(Chanters.createElement("chanters-player"));
    },
    setPosition: function(e) {
        this.$.menu.style.left = e.pageX + "px";
        this.$.menu.style.top = e.pageY - 70 + "px";
    }
});
