 Chanters("chanters-login", {
     loggedIn: false,
     display: 'block',
     userName: '',
     email: '',
     inheritParent: true,
     onReady: function() {
         if (localStorage && !localStorage.chantersId)
             localStorage.chantersId = Math.random();

         if (this.authanticate()) {
             this.remove();
             this.parent.template_("chanters-player.html");
         }
     },
     goToPlayer: function() {
         if (this.userName && this.userName.trim() && this.email && this.email.trim()) {
             localStorage.userName = this.userName;
             localStorage.email = this.email;
             this.remove();
             this.parent.template_("chanters-player.html");
         } else {
             this.$.login.classList.add("loginFalse");

             setTimeout(function() {
                 this.$.login.classList.remove("loginFalse");
             }.bind(this), 1000);
         }
     },
     authanticate: function() {
         if (localStorage.userName && localStorage.email)
             return true;
         else
             return false;
     },
     login: function(event) {
         if (event.keyCode === 13)
             this.goToPlayer();
     }
 });
