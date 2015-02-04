/**
 * Created with JetBrains WebStorm.
 * User: Jokeway
 * Date: 13-7-20
 * Time: 下午9:55
 */
(function () {

    ko.bindingHandlers['selectText'] = {
        'init': function (element, valueAccessor, allBindingsAccessor) {
            // Always catch "change" event; possibly other events too if asked
            var eventsToCatch = ["change"];
            var handleEventAsynchronously = true;
            var runEventHandler = handleEventAsynchronously ? function (handler) {
                setTimeout(handler, 0)
            } : function (handler) {
                handler()
            };
            var updateTextHandler = function () {
                var modelValue = valueAccessor();
                if (element.selectedIndex >= 0) {
                    var elementText = element.options[element.selectedIndex].text;
                    modelValue(elementText);
                }
            };

            ko.utils.arrayForEach(eventsToCatch, function (eventName) {
                ko.utils.registerEventHandler(element, eventName, function () {
                    runEventHandler(updateTextHandler);
                });
            });
            // subscribe value change event
            var bindingValue = allBindingsAccessor()["value"];
            if (ko.isObservable(bindingValue)) {
                bindingValue.subscribe(function () {
                    runEventHandler(updateTextHandler);
                });
            }
            runEventHandler(updateTextHandler);
        }
    };

})();