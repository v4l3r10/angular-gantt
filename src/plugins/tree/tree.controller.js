(function(){
    'use strict';
    angular.module('gantt.tree').controller('GanttTreeController', ['$scope', function($scope) {
        $scope.rootRows = [];

        var nameToRow = {};
        var idToRow = {};

        var nameToChildren = {};
        var idToChildren = {};

        var nameToParent = {};
        var idToParent = {};

        var registerChildRow = function(row, childRow) {
            if (childRow !== undefined) {
                var nameChildren = nameToChildren[row.model.name];
                if (nameChildren === undefined) {
                    nameChildren = [];
                    nameToChildren[row.model.name] = nameChildren;
                }
                nameChildren.push(childRow);


                var idChildren = idToChildren[row.model.id];
                if (idChildren === undefined) {
                    idChildren = [];
                    idToChildren[row.model.id] = idChildren;
                }
                idChildren.push(childRow);

                nameToParent[childRow.model.name] = childRow;
                idToParent[childRow.model.id] = childRow;
            }
        };

        var updateHierarchy = function() {
            nameToRow = {};
            idToRow = {};

            nameToChildren = {};
            idToChildren = {};

            nameToParent = {};
            idToParent = {};

            angular.forEach($scope.gantt.rowsManager.visibleRows, function(row) {
                nameToRow[row.model.name] = row;
                idToRow[row.model.id] = row;
            });

            angular.forEach($scope.gantt.rowsManager.visibleRows, function(row) {
                if (row.model.parent !== undefined) {
                    var parentRow = nameToRow[row.model.parent];
                    if (parentRow === undefined) {
                        parentRow = idToRow[row.model.id];
                    }

                    if (parentRow !== undefined) {
                        registerChildRow(parentRow, row);
                    }
                }

                if (row.model.children !== undefined) {
                    angular.forEach(row.model.children, function(childRowNameOrId) {
                        var childRow = nameToRow[childRowNameOrId];
                        if (childRow === undefined) {
                            childRow = idToRow[childRowNameOrId];
                        }

                        if (childRow !== undefined) {
                            registerChildRow(row, childRow);
                        }
                    });
                }
            });

            $scope.rootRows = [];
            angular.forEach($scope.gantt.rowsManager.visibleRows, function(row) {
                if ($scope.parent(row) === undefined) {
                    $scope.rootRows.push(row);
                }
            });
        };

        $scope.$watchCollection('gantt.rowsManager.visibleRows', function() {
            updateHierarchy();
        });

        $scope.children = function(row) {
            if (row === undefined) {
                return $scope.rootRows;
            }
            var children = idToChildren[row.model.id];
            if (children === undefined) {
                children = nameToChildren[row.model.name];
            }
            return children;
        };

        $scope.parent = function(row) {
            var parent = idToParent[row.model.id];
            if (parent === undefined) {
                parent = nameToParent[row.model.name];
            }
            return parent;
        };

        $scope.toggle = function(scope) {
            scope.toggle();
        };
    }]).controller('GanttTreeChildrenController', ['$scope', function($scope) {
        $scope.$watch('children(row)', function(newValue) {
            $scope.$parent.childrenRows = newValue;
        });
    }]);
}());

