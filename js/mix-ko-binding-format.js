/**
 * Created with JetBrains WebStorm.
 * User: Jokeway
 * Date: 13-7-20
 * Time: 下午9:55
 */
(function () {
    ko.defaults = ko.defaults || {};

    ko.defaults.format = $.extend(ko.defaults.format || {}, {
        'Date': {
            date: 'yyyy-MM-dd',
            dateTime: 'yyyy-MM-dd HH:mm:ss',
            time: 'HH:mm:ss'
        },
        'Boolean': {
            'true': '√',
            'false': '×'
        }
    });

    function isDeferred(deferred) {
        return deferred && $.isFunction(deferred.always) && $.isFunction(deferred.promise);
    }

    function resolveFormatValueAccessor(valueAccessor, format) {
        var theValue = ko.unwrap(valueAccessor()), formatValueAccessor = null;
        if ($.isFunction(format)) {
            formatValueAccessor = ko.observable(format(theValue));
        } else if (format != null) {
            if (typeof theValue == 'boolean' || theValue instanceof Boolean) {
                var formatValues = (format === true || format === 'true') ? ko.defaults.format['Boolean'] : format;
                formatValues[theValue] && (formatValueAccessor = ko.observable(formatValues[theValue]));
            } else if (theValue instanceof Date) {
                var formatPattern = ko.defaults.format['Date'][format] || format;
                formatPattern && (formatValueAccessor = ko.observable($.date.format(theValue, formatPattern)));
            } else {
                format[theValue] != undefined && (formatValueAccessor = ko.observable(format[theValue]));
            }
        }
        return formatValueAccessor || valueAccessor;
    }

    function updateFormatBinding(element, valueAccessor, format, callback) {
        if (isDeferred(format)) {
            callback(element, valueAccessor());  // TODO without this line, the update doesn't effect on change,why?
            format.always(function (data) {
                $(element).data('format-deferred', data);
                updateFormatBinding(element, valueAccessor, data, callback);
            });
            return;
        }
        callback(element, resolveFormatValueAccessor(valueAccessor, format));
    }

    // extend text update for date && boolean
    var originValueUpdate = ko.bindingHandlers['value']['update'];
    ko.bindingHandlers['value']['update'] = function (element, valueAccessor, allBindingsAccessor) {
        var format = $(element).data('format-deferred') || allBindingsAccessor()['format'] || $(element).data('format');
        updateFormatBinding(element, valueAccessor, format, function (el, formatValueAccessor) {
            originValueUpdate(el, formatValueAccessor);
        });
    };

    var originTextUpdate = ko.bindingHandlers['text']['update'];
    ko.bindingHandlers['text']['update'] = function (element, valueAccessor, allBindingsAccessor) {
        var format = $(element).data('format-deferred') || allBindingsAccessor()['format'] || $(element).data('format');
        updateFormatBinding(element, valueAccessor, format, function (el, formatValueAccessor) {
            originTextUpdate(el, formatValueAccessor);
        });
    }

})();