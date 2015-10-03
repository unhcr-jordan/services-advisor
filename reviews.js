var services = angular.module('services');

services.factory('Reviews', function() {
    var factory = {};
    var reviews = [
        {
            id: 1
            rating: 4,
            comment: 'This place rocks!!',
            serviceId: 949606869,
        },
        {
            id: 2
            rating: 1,
            comment: 'This place sucks!!',
            serviceId: 213577289,
        },
        {
            id: 3
            rating: 5,
            comment: 'This place rocks!!',
            serviceId: 949606869,
        },
        {
            id: 4
            rating: 2,
            comment: 'This place sucks!!',
            serviceId: 213577289,
        },
    ];


    /**
     * Returns a review given its id.
     * GET /reviews/:reviewId
     */
    factory.getReview = function(reviewId) {
        var review = _.find(reviews, function(review) {
            return review.id == reviewId;
        });
        return review;
    };

    /**
     * Returns a list of reviews of a service
     * GET /services/:serviceId/reviews
     */
    factory.getReviewsByServiceId = function(serviceId) {
        var reviews = _.filter(reviews, function(review) {
            return review.serviceId == serviceId;
        });

        return reviews;
    };

    /**
     * Returns the average rating of a service.
     */
    factory.getAverageRatingByServiceId = function(serviceId) {
        var average = 0;
        var reviews = _.filter(reviews, function(review) {
            return review.serviceId == serviceId;
        });

        _.each(reviews, function(review) {
            average += review.rating;
        });
        
        return average/reviews.length;
    };

    /**
     * Adds a review for a service.
     * POST /services/:serviceId
     */
    factory.addReview = function(serviceId, rating, comment) {
        var review = {
            rating: rating,
            comment: comment,
            serviceId: serviceId,
            id: 5
        };

        return review;
    };

    return factory;
});