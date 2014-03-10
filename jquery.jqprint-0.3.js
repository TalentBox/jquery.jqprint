﻿// -----------------------------------------------------------------------
// Eros Fratini - eros@recoding.it
// jqprint 0.3
//
// - 19/06/2009 - some new implementations, added Opera support
// - 11/05/2009 - first sketch
//
// - 05/07/2012 - Bug fix by The TalentBox Development Team: add all stylesheets
// - 08/03/2014 - Bug fix by The TalentBox Development Team: remove uneeded 'outer' method, use execCommand for better print support
// - 10/03/2014 - Bug fix by The TalentBox Development Team: Use execCommand only in IE
//
// Printing plug-in for jQuery, evolution of jPrintArea: http://plugins.jquery.com/project/jPrintArea
// requires jQuery 1.3.x
//
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
//------------------------------------------------------------------------

(function($) {
    var opt;

    $.fn.jqprint = function (options) {
        opt = $.extend({}, $.fn.jqprint.defaults, options);

        var $element = (this instanceof jQuery) ? this : $(this);

        if (opt.operaSupport && $.browser.opera)
        {
            var tab = window.open("","jqPrint-preview");
            tab.document.open();

            var doc = tab.document;
        }
        else
        {
            var $iframe = $("<iframe  />");

            if (!opt.debug) { $iframe.css({ position: "absolute", width: "0px", height: "0px", left: "-600px", top: "-600px" }); }

            $iframe.appendTo("body");
            var doc = $iframe[0].contentWindow.document;
        }

        if (opt.importCSS) {
          $('link[rel="stylesheet"]').each( function() {
            doc.write("<link type='text/css' rel='stylesheet' href='" + $(this).attr("href") + "' media='" + $(this).attr("media") + "' />");
          });
        }

        if (opt.printContainer) { doc.write($element.prop("outerHTML")); }
        else { $element.each( function() { doc.write($(this).html()); }); }

        doc.close();

        (opt.operaSupport && $.browser.opera ? tab : $iframe[0].contentWindow).focus();
        setTimeout( function() {
          if (opt.operaSupport && $.browser.opera) {
            tab.print();
            tab.close();
          } else if ($.browser.msie) {
            doc.execCommand('print', false, null);
          } else {
            $iframe[0].contentWindow.print();
          }
        }, 1000);
    }

    $.fn.jqprint.defaults = {
  		debug: false,
  		importCSS: true,
  		printContainer: true,
  		operaSupport: true
  	};

})(jQuery);
