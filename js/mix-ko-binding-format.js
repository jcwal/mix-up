/**
 * Created with JetBrains WebStorm.
 * User: Jokeway
 * Date: 13-7-20
 * Time: 下午9:55
 */
(function () {
    ko.defaults = ko.defaults || {};

    ko.defaults.format = {
        date: 'yyyy-MM-dd',
        dateTime: 'yyyy-MM-dd HH:mm:ss',
        time: 'HH:mm:ss',
        yes: '√',
        no: '×'
    };

    // extend text update for date && boolean
    var originValueUpdate = ko.bindingHandlers['value']['update'];
    ko.bindingHandlers['value']['update'] = function (element, valueAccessor, allBindingsAccessor) {
        var theValue = ko.unwrap(valueAccessor())
            , formatValueAccessor = null
            , type = allBindingsAccessor()['type'];
        if (theValue != null) {
            switch (type) {
                case 'date':
                case 'dateTime':
                case 'time':
                    formatValueAccessor = ko.observable($.date.format(theValue, ko.defaults.format[type]));
                    break;
            }
        }
        originValueUpdate(element, formatValueAccessor || valueAccessor);
    };


    var originTextUpdate = ko.bindingHandlers['text']['update'];
    ko.bindingHandlers['text']['update'] = function (element, valueAccessor, allBindingsAccessor) {
        var theValue = ko.unwrap(valueAccessor())
            , formatValueAccessor = null
            , type = allBindingsAccessor()['type'];
        if (theValue != null) {
            switch (type) {
                case 'bool' :
                case'boolean':
                    formatValueAccessor = ko.observable(theValue ? (ko.defaults.format.yes || theValue) : (ko.defaults.format.no || theValue));
                    break;
                case 'date':
                case 'dateTime':
                case 'time':
                    formatValueAccessor = ko.observable($.date.format(theValue, ko.defaults.format[type]));
                    break;
            }
        }
        originTextUpdate(element, formatValueAccessor || valueAccessor);
    }

})();