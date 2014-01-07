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
    ko.defaults.string = $.extend(ko.defaults.string || {}, {
        'split': ',',
        'join': '，'
    });

    function isDeferred(deferred) {
        return deferred && $.isFunction(deferred.always) && $.isFunction(deferred.promise);
    }

    function resolveFormatValueAccessor(valueAccessor, options) {
        var theValue = ko.unwrap(valueAccessor()), formattedValues = [];
        if (typeof theValue === 'string' && options.split) {
            theValue = theValue.split((options.split === true || options.split === 'true') ? ko.defaults.string.split : options.split);
        }
        $($.isArray(theValue) ? theValue : [theValue]).each(function (index, value) {
            typeof value === 'string' && (value = $.trim(value));
            if ($.isFunction(options.format)) {
                value = options.format(value);
            } else if (options.format != null) {
                if (typeof value == 'boolean' || value instanceof Boolean) {
                    var fvs = (options.format === true || options.format === 'true') ? ko.defaults.format['Boolean'] : options.format;
                    fvs[value] && (value = fvs[value]);
                } else if (value instanceof Date) {
                    var formatPattern = ko.defaults.format['Date'][options.format] || options.format;
                    formatPattern && (value = $.date.format(value, formatPattern));
                } else {
                    options.format[value] != undefined && (value = options.format[value]);
                }
            }
            formattedValues.push(value);
        });
        return ko.observable(formattedValues.join((options.join == null || options.join === true || options.join === 'true') ? ko.defaults.string.join : options.join));
    }

    function updateFormatBinding(element, valueAccessor, allBindingsAccessor, callback) {
        var format = $(element).data('format-deferred') || allBindingsAccessor()['format'] || $(element).data('format');

        if (format == null) {
            callback(element, valueAccessor);
        }

        var options = {
            format: format,
            split: allBindingsAccessor()['split'] || $(element).data('split'),
            join: allBindingsAccessor()['join'] || $(element).data('join')
        };

        if (isDeferred(format)) {
            format.always(function (data) {
                $(element).data('format-deferred', data);
                updateFormatBinding(element, valueAccessor, allBindingsAccessor, callback);
            });
            return;
        }
        callback(element, resolveFormatValueAccessor(valueAccessor, options));
    }

    var originValueUpdate = ko.bindingHandlers['value']['update'];
    ko.bindingHandlers['value']['update'] = function (element, valueAccessor, allBindingsAccessor) {
        updateFormatBinding(element, valueAccessor, allBindingsAccessor, function (el, formatValueAccessor) {
            originValueUpdate(el, formatValueAccessor);
        });
    };

    var originTextUpdate = ko.bindingHandlers['text']['update'];
    ko.bindingHandlers['text']['update'] = function (element, valueAccessor, allBindingsAccessor) {
        updateFormatBinding(element, valueAccessor, allBindingsAccessor, function (el, formatValueAccessor) {
            originTextUpdate(el, formatValueAccessor);
        });
    }

})();