!function(){"use strict";var c=/^sect(\d)$/,i=document.querySelector(".nav-container"),a=document.querySelector(".nav-toggle");a.addEventListener("click",function(e){if(a.classList.contains("is-active"))return u(e);v(e);var t=document.documentElement;t.classList.add("is-clipped--nav"),a.classList.add("is-active"),i.classList.add("is-active");var n=o.getBoundingClientRect(),e=window.innerHeight-Math.round(n.top);Math.round(n.height)!==e&&(o.style.height=e+"px");t.addEventListener("click",u)}),i.addEventListener("click",v);var o,r,s,l=i.querySelector("[data-panel=menu]");function e(){var e,t,n=window.location.hash;if(n&&(n.indexOf("%")&&(n=decodeURIComponent(n)),!(e=l.querySelector('.nav-link[href="'+n+'"]')))){n=document.getElementById(n.slice(1));if(n)for(var i=n,a=document.querySelector("article.doc");(i=i.parentNode)&&i!==a;){var o=i.id;if((o=!o&&(o=c.test(i.className))?(i.firstElementChild||{}).id:o)&&(e=l.querySelector('.nav-link[href="#'+o+'"]')))break}}if(e)t=e.parentNode;else{if(!s)return;e=(t=s).querySelector(".nav-link")}t!==r&&(m(l,".nav-item.is-active").forEach(function(e){e.classList.remove("is-active","is-current-path","is-current-page")}),t.classList.add("is-current-page"),d(r=t),p(l,e))}function d(e){for(var t,n=e.parentNode;!(t=n.classList).contains("nav-menu");)"LI"===n.tagName&&t.contains("nav-item")&&t.add("is-active","is-current-path"),n=n.parentNode;e.classList.add("is-active")}function n(){var e,t,n,i;this.classList.toggle("is-active")&&(e=parseFloat(window.getComputedStyle(this).marginTop),t=this.getBoundingClientRect(),n=l.getBoundingClientRect(),0<(i=(t.bottom-n.top-n.height+e).toFixed())&&(l.scrollTop+=Math.min((t.top-n.top-e).toFixed(),i)))}function u(e){v(e);e=document.documentElement;e.classList.remove("is-clipped--nav"),a.classList.remove("is-active"),i.classList.remove("is-active"),e.removeEventListener("click",u)}function v(e){e.stopPropagation()}function p(e,t){var n=e.getBoundingClientRect(),i=n.height,a=window.getComputedStyle(o);"sticky"===a.position&&(i-=n.top-parseFloat(a.top)),e.scrollTop=Math.max(0,.5*(t.getBoundingClientRect().height-i)+t.offsetTop)}function m(e,t){return[].slice.call(e.querySelectorAll(t))}l&&(o=i.querySelector(".nav"),r=l.querySelector(".is-current-page"),(s=r)?(d(r),p(l,r.querySelector(".nav-link"))):l.scrollTop=0,m(l,".nav-item-toggle").forEach(function(e){var t=e.parentElement;e.addEventListener("click",n.bind(t));e=function(e,t){e=e.previousElementSibling;return(!e||!t||e[e.matches?"matches":"msMatchesSelector"](t))&&e}(e,".nav-text");e&&(e.style.cursor="pointer",e.addEventListener("click",n.bind(t)))}),l.addEventListener("mousedown",function(e){1<e.detail&&e.preventDefault()}),l.querySelector('.nav-link[href^="#"]')&&(window.location.hash&&e(),window.addEventListener("hashchange",e)))}();
!function(){"use strict";var e=document.querySelector("aside.toc.sidebar");if(e){if(document.querySelector("body.-toc"))return e.parentNode.removeChild(e);var t=parseInt(e.dataset.levels||2,10);if(!(t<0)){for(var o="article.doc",d=document.querySelector(o),n=[],i=0;i<=t;i++){var r=[o];if(i){for(var a=1;a<=i;a++)r.push((2===a?".sectionbody>":"")+".sect"+a);r.push("h"+(i+1)+"[id]")}else r.push("h1[id].sect0");n.push(r.join(">"))}var c,s=(m=n.join(","),f=d.parentNode,[].slice.call((f||document).querySelectorAll(m)));if(!s.length)return e.parentNode.removeChild(e);var l={},u=s.reduce(function(e,t){var o=document.createElement("a");o.textContent=t.textContent,l[o.href="#"+t.id]=o;var n=document.createElement("li");return n.dataset.level=parseInt(t.nodeName.slice(1),10)-1,n.appendChild(o),e.appendChild(n),e},document.createElement("ul")),f=e.querySelector(".toc-menu");f||((f=document.createElement("div")).className="toc-menu");var m=document.createElement("h3");m.textContent=e.dataset.title||"Contents",f.appendChild(m),f.appendChild(u);e=!document.getElementById("toc")&&d.querySelector("h1.page ~ :not(.is-before-toc)");e&&((m=document.createElement("aside")).className="toc embedded",m.appendChild(f.cloneNode(!0)),e.parentNode.insertBefore(m,e)),window.addEventListener("load",function(){p(),window.addEventListener("scroll",p)})}}function p(){var t,e=window.pageYOffset,o=1.15*v(document.documentElement,"fontSize"),n=d.offsetTop;if(e&&window.innerHeight+e+2>=document.documentElement.scrollHeight){c=Array.isArray(c)?c:Array(c||0);var i=[],r=s.length-1;return s.forEach(function(e,t){var o="#"+e.id;t===r||e.getBoundingClientRect().top+v(e,"paddingTop")>n?(i.push(o),c.indexOf(o)<0&&l[o].classList.add("is-active")):~c.indexOf(o)&&l[c.shift()].classList.remove("is-active")}),u.scrollTop=u.scrollHeight-u.offsetHeight,void(c=1<i.length?i:i[0])}Array.isArray(c)&&(c.forEach(function(e){l[e].classList.remove("is-active")}),c=void 0),s.some(function(e){return e.getBoundingClientRect().top+v(e,"paddingTop")-o>n||void(t="#"+e.id)}),t?t!==c&&(c&&l[c].classList.remove("is-active"),(e=l[t]).classList.add("is-active"),u.scrollHeight>u.offsetHeight&&(u.scrollTop=Math.max(0,e.offsetTop+e.offsetHeight-u.offsetHeight)),c=t):c&&(l[c].classList.remove("is-active"),c=void 0)}function v(e,t){return parseFloat(window.getComputedStyle(e)[t])}}();
!function(){"use strict";var o=document.querySelector("article.doc"),t=document.querySelector(".toolbar");function i(e){return e&&(~e.indexOf("%")?decodeURIComponent(e):e).slice(1)}function r(e){if(e){if(e.altKey||e.ctrlKey)return;window.location.hash="#"+this.id,e.preventDefault()}window.scrollTo(0,function e(t,n){return o.contains(t)?e(t.offsetParent,t.offsetTop+n):n}(this,0)-t.getBoundingClientRect().bottom)}window.addEventListener("load",function e(t){var n,o;(n=i(window.location.hash))&&(o=document.getElementById(n))&&(r.bind(o)(),setTimeout(r.bind(o),0)),window.removeEventListener("load",e)}),Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]')).forEach(function(e){var t,n;(t=i(e.hash))&&(n=document.getElementById(t))&&e.addEventListener("click",r.bind(n))})}();
!function(){"use strict";var t,e=document.querySelector(".page-versions .version-menu-toggle");e&&(t=document.querySelector(".page-versions"),e.addEventListener("click",function(e){t.classList.toggle("is-active"),e.stopPropagation()}),document.documentElement.addEventListener("click",function(){t.classList.remove("is-active")}))}();
!function(){"use strict";var t=document.querySelector(".navbar-burger");t&&t.addEventListener("click",function(t){t.stopPropagation(),document.documentElement.classList.toggle("is-clipped--navbar"),this.classList.toggle("is-active");var e=document.getElementById(this.dataset.target);e.classList.toggle("is-active")&&(e.style.maxHeight="",t=window.innerHeight-Math.round(e.getBoundingClientRect().top),parseInt(window.getComputedStyle(e).maxHeight,10)!==t&&(e.style.maxHeight=t+"px"))}.bind(t))}();
!function(){"use strict";var s=/^\$ (\S[^\\\n]*(\\\n(?!\$ )[^\\\n]*)*)(?=\n|$)/gm,l=/( ) *\\\n *|\\\n( ?) */g,d=/ +$/gm,r=(document.getElementById("site-script")||{dataset:{}}).dataset;[].slice.call(document.querySelectorAll(".doc pre.highlight, .doc .literalblock pre")).forEach(function(e){var t,n,c,i,a;if(e.classList.contains("highlight"))(c=(t=e.querySelector("code")).dataset.lang)&&"console"!==c&&((i=document.createElement("span")).className="source-lang",i.appendChild(document.createTextNode(c)));else{if(!e.innerText.startsWith("$ "))return;var o=e.parentNode.parentNode;o.classList.remove("literalblock"),o.classList.add("listingblock"),e.classList.add("highlightjs","highlight"),(t=document.createElement("code")).className="language-console hljs",t.dataset.lang="console",t.appendChild(e.firstChild),e.appendChild(t)}(c=document.createElement("div")).className="source-toolbox",i&&c.appendChild(i),window.navigator.clipboard&&((n=document.createElement("button")).className="copy-button",n.setAttribute("title","Copy to clipboard"),"svg"===r.svgAs?((o=document.createElementNS("http://www.w3.org/2000/svg","svg")).setAttribute("class","copy-icon"),(i=document.createElementNS("http://www.w3.org/2000/svg","use")).setAttribute("href",window.uiRootPath+"/img/octicons-16.svg#icon-clippy"),o.appendChild(i),n.appendChild(o)):((a=document.createElement("img")).src=window.uiRootPath+"/img/octicons-16.svg#view-clippy",a.alt="copy icon",a.className="copy-icon",n.appendChild(a)),(a=document.createElement("span")).className="copy-toast",a.appendChild(document.createTextNode("Copied!")),n.appendChild(a),c.appendChild(n)),e.appendChild(c),n&&n.addEventListener("click",function(e){var t=e.innerText.replace(d,"");"console"===e.dataset.lang&&t.startsWith("$ ")&&(t=function(e){var t,n=[];for(;t=s.exec(e);)n.push(t[1].replace(l,"$1$2"));return n.join(" && ")}(t));window.navigator.clipboard.writeText(t).then(function(){this.classList.add("clicked"),this.offsetHeight,this.classList.remove("clicked")}.bind(this),function(){})}.bind(n,t))})}();
!function(){"use strict";var l=window.location.hash;function o(t,a){return Array.prototype.slice.call((a||document).querySelectorAll(t))}o(".tabset").forEach(function(c){var n,r,t=c.querySelector(".tabs");t&&(o("li",t).forEach(function(t,a){var e,i,s=(t.querySelector("a[id]")||t).id;s&&(i=s,e=o(".tab-pane",c).find(function(t){return t.getAttribute("aria-labelledby")===i}),a||(r={tab:t,pane:e}),!n&&l==="#"+s&&(n=!0)?(t.classList.add("is-active"),e&&e.classList.add("is-active")):a||(t.classList.remove("is-active"),e&&e.classList.remove("is-active")),t.addEventListener("click",function(t){var a=this.tab,e=this.pane;o(".tabs li, .tab-pane",this.tabset).forEach(function(t){t===a||t===e?t.classList.add("is-active"):t.classList.remove("is-active")}),t.preventDefault()}.bind({tabset:c,tab:t,pane:e})))}),!n&&r&&(r.tab.classList.add("is-active"),r.pane&&r.pane.classList.add("is-active"))),c.classList.remove("is-loading")})}();