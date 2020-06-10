(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItemsDirective)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

  function FoundItemsDirective(){
      var ddo = {
        restrict: 'E',
        templateUrl: 'foundItems.html',
        scope: {
          found: '<',
          onRemove: '&',
          empty: '<'
        },
        controller: NarrowItDownController,
        controllerAs: 'menu',
        bindToController: true
      };
    return ddo;
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var menu = this;
    menu.searchTerm = "";
    menu.empty="";

    menu.search = function (searchTerm) {
      if (searchTerm=='') {
          menu.empty="Nothing found";
          menu.found=[];
      }
      else{
        MenuSearchService.getMatchedMenuItems(searchTerm)
        .then(function (response) {
          menu.found = response;
          menu.empty="";
            if (menu.found.length==0) {
              menu.empty="Nothing found";
            }
        })
        .catch(function (response) {
          console.log("Controller Error");
        })
      }
    }

    menu.removeItem = function (itemIndex) {
      MenuSearchService.RemoveMenuItems(itemIndex);
    }
  }

  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
    var service = this;
    var foundItems = [];

    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      })

      .then(function (response) {
        foundItems = [];
        var completeMenu = response.data.menu_items;
        for (var i = 0; i < completeMenu.length; i++) {
          var description = completeMenu[i].description;
            if (description.toLowerCase().indexOf(searchTerm.toLowerCase()) >=0) {
              foundItems.push(completeMenu[i]);
            }
        }
        return foundItems;
      })
      .catch(function (response) {
        console.log("Service Error");
      })
    }

    service.RemoveMenuItems = function (itemIndex) {
      foundItems.splice(itemIndex, 1);
    }
  }
})();
