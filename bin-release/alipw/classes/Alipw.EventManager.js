Alipw.EventManager=function(){var b=new Array();b.getFnProxy=function(f,d){for(var e=0,c=b.length;e<c;e++){if(b[e].fn==f&&b[e].object==d){return b[e].proxy}}return null};var a={addListener:function(d,h,g,f,i){var e;if(d instanceof Alipw.Component){e=d.el}else{if(d instanceof Alipw.Nonvisual){e=d.evtProxy}else{return}}if(!i){h="alipw-"+h}if(i&&d instanceof Alipw.Component){e.bind(h,f?jQuery.proxy(g,f):g)}else{var c=b.getFnProxy(g,d);if(!c){c=function(j,k){k.currentTarget=d;k.jQueryEvent=j;g.call(this,k,k)};b.push({proxy:c,fn:g,object:d})}e.bind(h,f?jQuery.proxy(c,f):c)}},removeListener:function(d,g,f,h){var e;if(d instanceof Alipw.Component){e=d.el}else{if(d instanceof Alipw.Nonvisual){e=d.evtProxy}else{return}}if(!h){g="alipw-"+g}if(h&&d instanceof Alipw.Component){e.unbind(g,f)}else{var c=b.getFnProxy(f,d);if(c){e.unbind(g,c)}}},fireEvent:function(d,f,i,c,h){var e;if(d instanceof Alipw.Component){e=d.el}else{if(d instanceof Alipw.Nonvisual){e=d.evtProxy}else{return}}if(!h){f="alipw-"+f}if(!Alipw.isSet(c)){c=true}if(h&&d instanceof Alipw.Component){if(c){e.trigger(f,i)}else{e.triggerHandler(f,i)}}else{var g=new Alipw.Event(f,d,i);if(c){e.trigger(f,g)}else{e.triggerHandler(f,g)}return g.isDefaultPrevented?false:true}},enableHashChangeEvent:function(){var c=this;this.hashChangeManager=new Object();this.hashChangeManager.lastHash=Alipw.getHash();this.hashChangeManager.timer=setInterval(function(){var d=Alipw.getHash();if(d!==c.hashChangeManager.lastHash){var e=new Object();e.lastHash=c.hashChangeManager.lastHash;e.hash=d;Alipw.getWinProxy().fireEvent("hashChange",e);c.hashChangeManager.lastHash=d}},100)}};return a}();