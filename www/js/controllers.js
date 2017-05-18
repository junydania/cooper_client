angular.module('starter.controllers', [])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout, $auth, $ionicLoading) {

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

    $scope.currentUSer = function() {
      $rootScope.$on('auth:login-success', function(ev, user) {
        $scope.currentUser = user;
      })
    }
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
  });
