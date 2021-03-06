angular.module('app.employees.controllers', [
  'boolean.filters'
])
  
  .controller('EmployeeCtrl', 
    function (data, $scope, $state, $stateParams, notifications) {

      $scope.requestEmployees = function requestEmployees (page) {
        var query = {
          page: page,
          sort: {username: 1}
        };

        data.page('employees', query)
          .then(function (pageConfig) {
            $scope.pageConfig = pageConfig;
          });
      };

      $scope.showDetail = function showDetail (employee) {
        if (employee.deleted) {
          notifications.error('You cannot edit a deleted employee.');
          return;
        }
        $state.go('app.employees.detail', employee);
      };  

      $scope.createNew = function createNew () {
        $state.go('app.employees.create', $stateParams);
      };

      $scope.remove = function remove (employee) {

        data.remove('employees', employee) 
          .then(function () {
            notifications.success('Employee : ' + employee.username + ', was deleted.');
          })
          .catch(function (x) {
            employee.deleted = false;
            notifications.error('Error attempting to delete employee.');
          });
      };

      $scope.restore = function restore (employee) {
       
       data.restore('employees', employee)
          .then(function (restored) {
            notifications.success('Employee was restored.');
          })
          .catch(function (x) {
            employee.deleted = true;
            notifications.error('Error restoring employee.');
          });
      };

      $scope.cancel = function cancel () {
        $state.go('app.employees', {}, {reload: true});
      };

      $scope.requestEmployees(1);
    }
  )

  .controller('EmployeeDetailCtrl', 
    function ($scope, $state, $stateParams, notifications, employee) {
      $scope.saveText = $state.current.data.saveText;
      $scope.employee = employee;

      $scope.save = function save () {
        $scope.employee.$update()
          .then(function (updated) {
            $scope.timesheet = updated;
            notifications.success('Updated employee: ' + employee.username);
          })
          .catch(function (x) {
            notifications.error('There was an error updating the employee.');
          });
      };
    }
  )

  .controller('EmployeeCreateCtrl', 
    function ($scope, $state, $stateParams, data, notifications) {
      $scope.saveText = $state.current.data.saveText;
      $scope.employee = {admin: false};

      $scope.save = function save () {
        data.create('employees', $scope.employee)
          .then(function (created) {
            notifications.success('Employee : ' + created.username + ', created.');
            $state.go('app.employees.detail', {_id: created._id});
          })
          .catch(function (x) {
            notifications.error('There was an error creating employee.');
          });
      };
    }
  );