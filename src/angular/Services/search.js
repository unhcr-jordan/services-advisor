var services = angular.module('services');


/**
 * Holds the state of the current search and the current results of that search
 */
services.factory('Search', ['$location', 'ServicesList', '$rootScope', function ($location, ServicesList, $rootScope) {
    var gju = require('../../../node_modules/geojson-utils');

    // asynchronously initialize crossfilter
    ServicesList.get(function (allServices) {
        crossfilter.add(allServices);

        // trigger initial map load
        $rootScope.$emit('FILTER_CHANGED')
    });

    /** Crossfilter Setup **/
    var crossfilter = require('crossfilter')();

    // TODO: not sure why they do || undefined, but previously they had "|| option.empty" where empty was never defined
    var categoryDimension = crossfilter.dimension(function (f) {
        return f.properties['activityName'] || undefined;
    });
    var partnerDimension = crossfilter.dimension(function (f) {
        return f.properties['partnerName'] || undefined;
    });

    var regionDimension = crossfilter.dimension(function (f) {
        return f.geometry.coordinates[0] + "," + f.geometry.coordinates[1] || "";
    });

    var idDimension = crossfilter.dimension(function (f) {
        return f.id;
    });

    var referralsDimension = crossfilter.dimension(function (f) {
        return f.properties["Referral required"];
    });

    /** Used to get list of currently filtered services rather than re-using an existing dimension **/
    var metaDimension = crossfilter.dimension(function (f) { return f.properties.activityName; });

    var allDimensions = [categoryDimension, partnerDimension, regionDimension, idDimension, referralsDimension];

    var clearAll = function () {
        angular.forEach(allDimensions, function(filter) {
            filter.filterAll();
        });
    };

    var clearReferralsFilter = function () {
        referralsDimension.filterAll();
    };

    /** End crossfilter setup **/

    // this function allows us to wrap another function with clearAll() and $emit to reduce boilerplate
    var withClearAndEmit = function(fn) {
        return function () {
            clearAll();
            var result = fn.apply(this, arguments);
            $rootScope.$emit('FILTER_CHANGED');
            return result;
        };
    };

    var withoutClearAndEmit = function(fn) {
        return function () {
            var results = fn.apply(this, arguments);
            $rootScope.$emit('FILTER_CHANGED');
            return results;
        };
    };

    var _clearOrganizations = function() {
        partnerDimension.filterAll();
    };

    var _selectOrganizations = function(organizations) {
        partnerDimension.filter(function(serviceOrganization) {
            return organizations.indexOf(serviceOrganization) > -1;
        });
    };

    return {
        selectCategory: withClearAndEmit(function (category) {
            categoryDimension.filter(function(service) {
                return service == category;
            });
        }),
        selectId: withClearAndEmit(function (id) {
            idDimension.filter(function(serviceId) {
                return serviceId == id
            });
        }),
        selectPartner: withClearAndEmit(function(partner) {
            partnerDimension.filter(function(servicePartner) {
                return servicePartner == partner;
            })
        }),
        selectPartners: _selectOrganizations,
        clearOrganizations: _clearOrganizations,
        selectRegion: withClearAndEmit(function(region) {
            var activeRegionLayer = null;
            polygonLayer.getLayers().forEach(function(f) {
                if (f.feature.properties.adm1_name == region) {
                    activeRegionLayer = f;
                }
            });
            if (activeRegionLayer) {
                regionDimension.filter(function(servicePoint) {
                    var pp = servicePoint.split(',');
                    var point = {
                        type: "Point",
                        coordinates: [parseFloat(pp[1]), parseFloat(pp[0])]
                    };

                    return gju.pointInPolygon(point, activeRegionLayer.toGeoJSON().geometry);
                })
            }
        }),
        selectRegionByLayerId: withClearAndEmit(function (layerId) {
            var geoJson = polygonLayer.getLayer(layerId).toGeoJSON();

            regionDimension.filter(function(servicePoint) {
                var pp = servicePoint.split(',');
                var point = {
                    type: "Point",
                    coordinates: [parseFloat(pp[1]), parseFloat(pp[0])]
                };

                return gju.pointInPolygon(point, geoJson.geometry);
            })
        }),
        selectReferrals : withoutClearAndEmit(function (selection) {
            referralsDimension.filter(function(service) {
                // if they've selected all, then we return everything, otherwise we try to match
                return selection == 'all' ? true : service == selection;
            })
        }),
        clearAll: withClearAndEmit(function(){}),
        currResults: function () {
            return metaDimension.top(Infinity);
        },
        filterByUrlParameters: function() {
            var parameters = $location.search();

            _clearOrganizations();
            if (_.has(parameters, 'organization')){
                _selectOrganizations(parameters.organization);
            }

            $rootScope.$emit('FILTER_CHANGED');
        }
    }
}]);
