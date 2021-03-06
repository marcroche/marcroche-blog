﻿marcroche_blog.CommentService = (function ($) {
    var createComment = function (comment) {
        var options = {
            url: '/api/comments',
            data: JSON.stringify(comment),
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
        };

        return $.ajax(options).then(querySucceeded).fail(queryFailed);

        function querySucceeded(data) {
            return data;
        }

        function queryFailed(jqXHR, textStatus) {
            //handle failure
        }
    };

    var getComments = function (title) {
        var options = {
            url: "/api/comments/" + title,
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        };

        return $.ajax(options).then(querySucceeded).fail(queryFailed);

        function querySucceeded(data) {
            return data;
        }

        function queryFailed(jqXHR, textStatus) {
            //handle failure
        }
    };

    return function() {
        this.getComments = getComments;
        this.createComment = createComment;
    }
})(jQuery);