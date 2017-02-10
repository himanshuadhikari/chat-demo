 Chanters("chanters-content", {
     onReady: function() {
         this.loadTemplate();

         if (localStorage.mode) {
             this.mode_(localStorage.mode);
         }

     },
     mode: "Day Mode",
     visibility: "show",
     inheritParent: true,
     mode_: function(newValue) {
         this.mode = newValue;
         if (this.mode === "Day Mode")
             this.$.view.classList.remove("dark-div");
         if (this.mode === "Night Mode")
             this.$.view.classList.add("dark-div");

         localStorage.mode = this.mode;
     },
     loadTemplate: function(cb, localPage) {
         var apiURL = "http://localhost:4444/static/views/";
         if (!this.template)
             return;

         var chromeAppUrl = "static/views/";
         var templateUrl = chromeAppUrl + this.template;

         var link = document.createElement("link");
         link.rel = "import";
         link.href = templateUrl;

         document.head.appendChild(link);

         var webComponent = document.createElement(this.template.split(".html")[0]);
         this.appendChild(webComponent);
         if (cb)
             cb();
     },
     template_: function(newValue) {
         if (newValue)
             this.template = newValue;
         var flag = false;
         if (this.mode !== "Night Mode") {
             this.mode_("Night Mode");
             this.visibility = "hide";
             flag = true;
         }

         this.loadTemplate(function() {
             setTimeout(function() {
                 if (this.mode !== "Night Mode" || flag) {
                     this.mode_("Day Mode");
                     this.visibility = "show";
                 }
             }.bind(this), 2000);
         }.bind(this));
     },
     openmenu: function(event) {
         this.parent.communicate({
             element: "chanters-menu",
             effectedProperty: "visibility",
             newValue: event
         })
     },
     menuItemClicked: function(event, item) {
         if (item && this[item])
             this[item](event);
     },
     resizeBackground: function(event) {
         document.addEventListener("keydown", keyEvent);
         var that = this;

         function keyEvent(event) {
             if (event.keyCode === 27) {
                 document.removeEventListener("keydown", keyEvent);
                 that.diablePlayer();
             }
         }
         this.diablePlayer();
     },
     diablePlayer: function() {
         this.parent.communicate({
             element: "chanters-background",
             effectedProperty: "zIndex",
             newValue: event
         });
     },
     changeBackground: function(event) {
         event.target.nextElementSibling.click();
         var that = this;
         event.target.nextElementSibling.onchange = function(event) {
             var imageList = event.target.files;

             that.parent.communicate({
                 element: "chanters-background",
                 effectedProperty: "imageList",
                 newValue: imageList
             });
         };
     },
     changeMode: function(event) {
         this.mode_(this.mode === "Night Mode" ? "Day Mode" : "Night Mode");
     },
     createList: function(event, item) {
         event.target.nextElementSibling.click();
         var that = this;
         event.target.nextElementSibling.onchange = function(event) {
             that.parent.communicate({
                 element: "chanters-player",
                 effectedProperty: "imageList",
                 newValue: this.files
             });
         };
     }

 });
