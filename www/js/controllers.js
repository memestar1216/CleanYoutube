cleanyoutube

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})
.controller('MainviewCtrl', function($scope, $rootScope, $state, $http, $ionicPopup, $ionicScrollDelegate, $ionicLoading, $localStorage) {
  var mainCtrl = this;
  var channelLink = "http://cleanyoutube.io/svc/channel.php?id=";
  
  $scope.getScrollPosition = function(){
  
    // console.log('here');
    // console.log($ionicScrollDelegate.getScrollPosition().top);
    if($ionicScrollDelegate.getScrollPosition().top>104){
      if($scope.searchFlag==1){
        $scope.searchFlag_alt = 1;

        $scope.$apply();
      }
      
    }else{
      if($scope.searchFlag==1){
   
        $scope.searchFlag_alt = 0;
         $scope.$apply();
      }
    }
    // console.log($scope.searchFlag_alt);
  }
  $scope.init = function(){
    $rootScope.historyItem = [
     {
       channelId: "",
       videoId: "",
       imageUrl: "",
       videoTitle:""
     } 
    ];
    $scope.homeFlag = 1;
    $scope.searchFlag = 0;
    $scope.channelFlag = 0;
    $scope.searchFlag_alt = 0;   
    mainCtrl.searchItem = '';
    
    $scope.historyList = [];
    if(!$localStorage.historyList){
      $scope.homeFlag_alt = 1;
    }else{
      $scope.homeFlag_alt = 0;
      $scope.historyList = JSON.parse($localStorage.historyList);
    }
  
    
  
  
    
    
  }
  $scope.searchResult = function () {
    var searchLink = 'http://cleanyoutube.io/svc/search.php?q=';
    if(mainCtrl.searchItem==""){
      $ionicPopup.alert({
        title: "Error",
        template: "Please fill in the search text!"
      });
    }else{
      searchLink +=mainCtrl.searchItem;
      console.log("SearchLink="+searchLink);
      console.log(mainCtrl.searchItem);
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
        
      });
      $http.get(searchLink).
          success(function(data) {
            
              $scope.searchList = data.allVideos;
              $ionicScrollDelegate.scrollTop();
              $ionicLoading.hide();
              console.log($scope.searchList);
           
              
          }).error(function(data, status, headers, config) {
              $ionicLoading.hide();
              if(window.Connection) {
                if(navigator.connection.type == Connection.NONE) {
                  $ionicPopup.confirm({
                    title: 'Error',
                    content: 'serverconnection error'
                  })
                  .then(function(result) {
                    if(!result) {
                      ionic.Platform.exitApp();
                    }
                  });
                }
              }
          });
    }
  }
  $scope.turnOn = function(index){
    if(index==0){
      $scope.homeFlag = 1;
      $scope.searchFlag = 0;
      $scope.channelFlag = 0;
      $scope.searchFlag_alt = 0;
      if(!$localStorage.historyList){
        $scope.homeFlag_alt = 1;
       
      }else{
        $scope.homeFlag_alt = 0;
        $scope.historyList = JSON.parse($localStorage.historyList);
      }
    }
    if(index==1){
      $scope.homeFlag = 0;
      $scope.searchFlag = 1;
      $scope.channelFlag = 0;
      $scope.searchFlag_alt = 0;
    }
    if(index==2){
      $scope.homeFlag = 0;
      $scope.searchFlag = 0;
      $scope.channelFlag = 1;
      $scope.searchFlag_alt = 0;
      if(!$scope.channelFlag_alt){
        var temp = 'UCgOVCkJ-qUDuMXIqGmrFnMw';
        $localStorage.active_channel = JSON.stringify(temp);
        
      }
      $scope.channelFlag_alt = 0;
      if($localStorage.active_channel){
        $scope.channelId = JSON.parse($localStorage.active_channel);
     
        var channel = channelLink + $scope.channelId;
        console.log("ChannelLink="+channelLink);
       
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
          
        });
        $http.get(channel).
          success(function(dat) {
            
              $scope.channelList = dat;
              $ionicScrollDelegate.scrollTop();
              $ionicLoading.hide();
              console.log($scope.channelList);
           
              
          }).error(function(data, status, headers, config) {
              $ionicLoading.hide();
              if(window.Connection) {
                if(navigator.connection.type == Connection.NONE) {
                  $ionicPopup.confirm({
                    title: 'Error',
                    content: 'serverconnection error'
                  })
                  .then(function(result) {
                    if(!result) {
                      ionic.Platform.exitApp();
                    }
                  });
                }
              }
          });
      }
      
    }
    console.log($scope.homeFlag);
    console.log($scope.searchFlag);
    console.log($scope.channelFlag);
  }
  $scope.goWatch = function(item){
    $state.go("watchview");
    $scope.checkHistory(item);
    $localStorage.active_video = JSON.stringify(item.videoId);
    $localStorage.active_channel = JSON.stringify(item.channelId);
    console.log("videoId= "+ item.videoId);
    
    console.log($scope.historyList);
    $localStorage.historyList = JSON.stringify($scope.historyList);
 
  }
  $scope.goWatch_channel = function(temp){
    $state.go("watchview");
    
    var item = 
      {
        imagesinfo: "",
        videoTitle: "",
        channelTitle:"",
        channelId: "",
        videoId: ""
      }
    ;
    item.imagesinfo = [
      {
        medium: ""
      }
    ];
    item.imagesinfo[0].medium = {
      url: ""
    };
    item.videoTitle = temp.title;
    item.channelTitle = $scope.channelList.title;
    item.channelId = $scope.channelId;
    item.videoId = temp.videoId;
    item.imagesinfo[0].medium.url = temp.thumbnailMediumUrl;
    console.log(item);
    $scope.checkHistory(item);
    $localStorage.active_video = JSON.stringify(item.videoId);
    $localStorage.active_channel = JSON.stringify(item.channelId);
    console.log("videoId= "+ item.videoId);
    
    console.log($scope.historyList);
    $localStorage.historyList = JSON.stringify($scope.historyList);
 
  }
  $scope.checkHistory = function (item) {
    if(!$localStorage.historyList){
      $scope.historyList.push(item);
    }else{
      $scope.historyList = JSON.parse($localStorage.historyList);
      for(var i=0; i<$scope.historyList.length; i++){
        if($scope.historyList[i].videoId==item.videoId){
          $scope.historyList.splice(i,1);
          break;
        }
      }
      if($scope.historyList.length>19){
        $scope.historyList.splice(19,1);
      }
      $scope.historyList.unshift(item);
    }
    
   
  }
  $scope.goChannel = function(item){
    $localStorage.active_channel = JSON.stringify(item.channelId);
    console.log(item.channelId);
    $scope.channelFlag_alt = 1;
    $scope.turnOn(2);
    
    // $scope.$apply();
  }
  $scope.keypress = function(keyEvent){
    console.log('keypress='+keyEvent.keyCode);
    if(keyEvent.keyCode==13){
      $scope.searchResult();
    }
    
  }
  $scope.$on('$ionicView.beforeEnter', function(){
      if($rootScope.channel_connect){
  
        $scope.channelFlag_alt = 1;
        $rootScope.channel_connect = 0;
        $scope.turnOn(2);
        
      }
      console.log("channel_connect= "+ $rootScope.channel_connect);
  });

})
.controller('WatchviewCtrl', function($scope, $rootScope, $state, $localStorage, $ionicLoading, $http, $ionicScrollDelegate, $sce) {
  $scope.init = function(){
    // $scope.homeFlag = 1;
    // $scope.searchFlag = 0;
    // $scope.channelFlag = 0
    $rootScope.channel_connect = 0;
    var videoUrl = 'https://www.youtube.com/embed/';
    
    $scope.channelId = JSON.parse($localStorage.active_channel);
    var channelLink = "http://cleanyoutube.io/svc/channel.php?id=";
    channelLink +=$scope.channelId;
    $scope.videoId = JSON.parse($localStorage.active_video);
    var watchLink = 'http://cleanyoutube.io/svc/watch.php?v=';
      watchLink +=$scope.videoId;
      console.log("WatchLink="+watchLink);
      videoUrl +=$scope.videoId;
      $scope.youtube = $sce.trustAsResourceUrl(videoUrl);
      console.log("$scope.videoUrl="+$scope.youtube);
      
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
        
      });
      $http.get(watchLink).
          success(function(data) {
            
              $scope.watchList = data;
              $ionicScrollDelegate.scrollTop();
              $ionicLoading.hide();
              console.log($scope.watchList);
            
              
          }).error(function(data, status, headers, config) {
              $ionicLoading.hide();
              if(window.Connection) {
                if(navigator.connection.type == Connection.NONE) {
                  $ionicPopup.confirm({
                    title: 'Error',
                    content: 'serverconnection error'
                  })
                  .then(function(result) {
                    if(!result) {
                      ionic.Platform.exitApp();
                    }
                  });
                }
           }
         });
        $http.get(channelLink).
          success(function(datas) {
            
              $scope.channelLogo = datas.thumbnails.default;
              $scope.subcount = datas.statistics.subscriberCount;
      
            
              console.log(datas);
            
              
          }).error(function(datas, status, headers, config) {
            
              if(window.Connection) {
                if(navigator.connection.type == Connection.NONE) {
                  $ionicPopup.confirm({
                    title: 'Error',
                    content: 'serverconnection error'
                  })
                  .then(function(result) {
                    if(!result) {
                      ionic.Platform.exitApp();
                    }
                  });
                }
           }
         });
  }
  $scope.goMainview = function(){
    $state.go("mainview");
  }
  $scope.goChannel = function(){
    $rootScope.channel_connect =1;
    $state.go("mainview");
  }
 

});

