(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-61437b92"],{"2c8a":function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-app",[i("v-main",[i("router-view")],1)],1)},a=[],o={},r=o,s=i("0c7c"),u=i("6544"),c=i.n(u),p=i("7496"),d=i("f6c4"),f=Object(s["a"])(r,n,a,!1,null,null,null);e["default"]=f.exports;c()(f,{VApp:p["a"],VMain:d["a"]})},"58df":function(t,e,i){"use strict";i.d(e,"a",(function(){return a}));var n=i("2b0e");function a(){for(var t=arguments.length,e=new Array(t),i=0;i<t;i++)e[i]=arguments[i];return n["default"].extend({mixins:e})}},6544:function(t,e){t.exports=function(t,e){var i="function"===typeof t.exports?t.exports.extendOptions:t.options;for(var n in"function"===typeof t.exports&&(i.components=t.exports.options.components),i.components=i.components||{},e)i.components[n]=i.components[n]||e[n]}},7496:function(t,e,i){"use strict";var n=i("5530"),a=(i("df86"),i("7560")),o=i("58df");e["a"]=Object(o["a"])(a["a"]).extend({name:"v-app",props:{dark:{type:Boolean,default:void 0},id:{type:String,default:"app"},light:{type:Boolean,default:void 0}},computed:{isDark:function(){return this.$vuetify.theme.dark}},beforeCreate:function(){if(!this.$vuetify||this.$vuetify===this.$root)throw new Error("Vuetify is not properly initialized, see https://vuetifyjs.com/getting-started/quick-start#bootstrapping-the-vuetify-object")},render:function(t){var e=t("div",{staticClass:"v-application--wrap"},this.$slots.default);return t("div",{staticClass:"v-application",class:Object(n["a"])({"v-application--is-rtl":this.$vuetify.rtl,"v-application--is-ltr":!this.$vuetify.rtl},this.themeClasses),attrs:{"data-app":!0},domProps:{id:this.id}},[e])}})},7560:function(t,e,i){"use strict";i.d(e,"b",(function(){return r}));var n=i("5530"),a=i("2b0e"),o=a["default"].extend().extend({name:"themeable",provide:function(){return{theme:this.themeableProvide}},inject:{theme:{default:{isDark:!1}}},props:{dark:{type:Boolean,default:null},light:{type:Boolean,default:null}},data:function(){return{themeableProvide:{isDark:!1}}},computed:{appIsDark:function(){return this.$vuetify.theme.dark||!1},isDark:function(){return!0===this.dark||!0!==this.light&&this.theme.isDark},themeClasses:function(){return{"theme--dark":this.isDark,"theme--light":!this.isDark}},rootIsDark:function(){return!0===this.dark||!0!==this.light&&this.appIsDark},rootThemeClasses:function(){return{"theme--dark":this.rootIsDark,"theme--light":!this.rootIsDark}}},watch:{isDark:{handler:function(t,e){t!==e&&(this.themeableProvide.isDark=this.isDark)},immediate:!0}}});function r(t){var e=Object(n["a"])(Object(n["a"])({},t.props),t.injections),i=o.options.computed.isDark.call(e);return o.options.computed.themeClasses.call({isDark:i})}e["a"]=o},bd0c:function(t,e,i){},d10f:function(t,e,i){"use strict";var n=i("2b0e");e["a"]=n["default"].extend({name:"ssr-bootable",data:function(){return{isBooted:!1}},mounted:function(){var t=this;window.requestAnimationFrame((function(){t.$el.setAttribute("data-booted","true"),t.isBooted=!0}))}})},df86:function(t,e,i){},f6c4:function(t,e,i){"use strict";i("bd0c");var n=i("d10f");e["a"]=n["a"].extend({name:"v-main",props:{tag:{type:String,default:"main"}},computed:{styles:function(){var t=this.$vuetify.application,e=t.bar,i=t.top,n=t.right,a=t.footer,o=t.insetFooter,r=t.bottom,s=t.left;return{paddingTop:"".concat(i+e,"px"),paddingRight:"".concat(n,"px"),paddingBottom:"".concat(a+o+r,"px"),paddingLeft:"".concat(s,"px")}}},render:function(t){var e={staticClass:"v-main",style:this.styles,ref:"main"};return t(this.tag,e,[t("div",{staticClass:"v-main__wrap"},this.$slots.default)])}})}}]);
//# sourceMappingURL=chunk-61437b92.7b5a79bf.js.map