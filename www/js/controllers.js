angular.module('starter.controllers', [])

  .controller('AppCtrl', function($rootScope, $scope, $ionicModal, $timeout, $auth, $ionicLoading, $ionicPopup, $window, $location) {

    // Form data for the login modal
    $scope.loginData = {
     email: $scope.email,
     password: $scope.password
    };

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modalLogin = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modalLogin.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modalLogin.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      $ionicLoading.show({
        template: 'Logging in...'
      });

      $auth.submitLogin($scope.loginData).then(function(resp) {
        $ionicLoading.hide();
        $scope.closeLogin();
      })
        .catch(function (error) {
          $ionicLoading.hide();
          $scope.errorMessage = error;
        })

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
    };


    //ionicModal for registration

    $scope.registerData = {
      email: $scope.email,
      password: $scope.password,
      password_confirmation: $scope.password_confirm
    };

    $ionicModal.fromTemplateUrl('templates/register.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalRegister= modal;
    });

    $scope.closeRegister = function() {
      $scope.modalRegister.hide();
    };

    // Open the Register modal
    $scope.register = function() {
      $scope.modalRegister.show();
    };

    // Perform the register action when the user submits the registration form
    $scope.doRegister = function() {
      $ionicLoading.show({
        template: 'Registration in progress...'
      });

      $auth.submitRegistration($scope.registerData).then(function(resp) {
        $ionicLoading.hide();
        $scope.closeRegister();
      })
        .catch(function (error) {
          $ionicLoading.hide();
          $scope.errorMessage = error;
        });

      $timeout(function() {
        $scope.closeRegister();
      }, 1000);
    };
    //end of code block for registration process



    //ionicModal to reset password

    $scope.resetData = {
      email: $scope.email
    };

    $ionicModal.fromTemplateUrl('templates/reset.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalReset= modal;
    });

    $scope.closeReset = function() {
      $scope.modalReset.hide();
    };

    // Open the Register modal
    $scope.reset = function() {
      $scope.modalReset.show();
    };

    $scope.doReset = function() {
      $ionicLoading.show({
        template: 'Check your mail for reset instruction'
      });

      $auth.requestPasswordReset($scope.resetData).then(function(resp) {
        $ionicLoading.hide();
        $scope.closeReset();
      })
        .catch(function (error) {
          $ionicLoading.hide();
          $scope.errorMessage = error;
        });

      $timeout(function() {
        $scope.closeRegister();
      }, 1000);
    };






    // Sign Out User
    $scope.signOut = function() {
      $ionicLoading.show({
        template: 'Signing out....'
      });

      $auth.signOut().then(function(resp) {
        $ionicLoading.hide();
        $window.location.href = 'templates/signedOut.html'
      })
        .catch(function (error) {
          $ionicLoading.hide();
          $scope.errorMessage = error;
        });
    };

    $scope.go = function() {
      $location.path('templates/about/about.html');
    };


    $rootScope.$on('auth:login-success', function(ev, user) {
      $scope.currentUser = angular.extend(user, $auth.retrieveData('auth_headers'));
    });

  })

  .controller('TestController', function($scope) {
    $scope.gender=['male', 'female'];
    $scope.ageValues = {
      min : 20,
      max: 60,
      value: 20
    };

    $scope.distanceValues = {
      min: 1000,
      max: 3000,
      value: 1000
    };
    $scope.data = {};

    $scope.calculateCooper = function() {
      var person = new Person({
        gender: $scope.data.gender,
        age: $scope.data.age
      });
      person.assessCooper($scope.data.distance);
      $scope.person = person;
      console.log($scope.person)
    };
  })

  .controller('PerformanceCtrl', function($scope, $state, $ionicLoading, performanceData, $ionicPopup ){
    $scope.saveData = function(person) {
      var data = {performance_data: {data: {message: person.cooperMessage}}};
      $ionicLoading.show({
        template: 'Saving...'
      });
      performanceData.save(data, function(response){
        $ionicLoading.hide();
        $scope.showAlert('Success', response.message);
      }, function(error){
        $ionicLoading.hide();
        $scope.showAlert('Failure', error.statusText);
      })
    };
    $scope.retrieveData = function() {
      $ionicLoading.show({
        template: 'Retrieving Data'
      });
      performanceData.query({},function(response) {
        $state.go('app.data', { savedDataCollection: response.entries });
        $ionicLoading.hide();
      }, function(error) {
        $ionicLoading.hide();
        $scope.showAlert('Failure', error.statusText);

      })
    };

    $scope.showAlert = function(message, content) {
      var alertPopup= $ionicPopup.alert({
        title: message,
        template: content
      });
      alertPopup.then(function(res) {

      });
    }
  })

.controller('DataCtrl', function($scope, $stateParams) {
  $scope.$on('$ionicView.enter', function() {
    $scope.savedDataCollection = $stateParams.savedDataCollection;
    $scope.labels = getLabels($scope.savedDataCollection);
    $scope.data = [];
    angular.forEach($scope.labels, function(label) {
      $scope.data.push(getCount($scope.savedDataCollection, label));
    });
    $scope.radardata = [$scope.data];
  });

  function getLabels(collection) {
    var uniqueLabels = [];
    for(i = 0; i < collection.length; i++) {
      if(collection[i].data.message && uniqueLabels.indexOf(collection[i].data.message) === -1 ){
        uniqueLabels.push(collection[i].data.message);
      }
    }
    return uniqueLabels;
  }
  function getCount(arr, value) {
    var count = 0;
    angular.forEach(arr, function(entry) {
      count += entry.data.message == value ? 1 : 0;
    });
    return count;
  }
});



