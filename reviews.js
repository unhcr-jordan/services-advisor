var services = angular.module('services');

services.factory('Reviews', function() {
    var factory = {};

    /**
     * Returns a review given its id.
     * GET /reviews/:reviewId
     */
    factory.getReview = function(reviewId) {
        var review = {
            rating: 4,
            comment: 'This place rocks!!',
            serviceId: 1,
            reviewId: 1
        }

        return review;
    };

    /**
     * Returns a list of reviews of a service
     * GET /services/:serviceId/reviews
     */
    factory.getReviewsByServiceId = function(serviceId) {
        var reviews = [
            {
                rating: 4,
                comment: 'This place rocks!!',
                serviceId: 1,
                reviewId: 1                
            },
            {
                rating: 1,
                comment: 'This place sucks!!',
                serviceId: 2,
                reviewId: 2
            }
        ];

        return reviews;
    };

    /**
     * Returns the average rating of a service.
     */
    factory.getAverageRatingByServiceId = function(serviceId) {
        return 3;
    };

    /**
     * Adds a review for a service.
     * POST /services/:serviceId
     */
    factory.addReview = function(serviceId, stars, comment) {
        var review = {
            rating: stars,
            comment: comment,
            serviceId: serviceId,
            reviewId: 3
        };

        return review;
    };

    return factory;
});