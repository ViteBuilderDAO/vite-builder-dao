import{r as C,c as M,C as N,Q as O,a as d,b as m,o as p,d as h,e as i,f as b,w as _,g as x,h as y,v as w,i as I,j as A}from"./vendor.a0769f05.js";const j=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))e(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&e(l)}).observe(document,{childList:!0,subtree:!0});function s(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerpolicy&&(a.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?a.credentials="include":n.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function e(n){if(n.ep)return;n.ep=!0;const a=s(n);fetch(n.href,a)}};j();const u=C({user:{}}),V="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDMzNjYwOSwiZXhwIjoxOTQ5OTEyNjA5fQ.4iFZTPc93prq4t2JuQ2yZ41oYSYKe7EntbFKSbRVNjk",U="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM0MzM2NjA5LCJleHAiOjE5NDk5MTI2MDl9.DDnEotu0jgHeMd7CuTMRdNA8VTRQ6F6xsgeq1MKo4bk",c=M(V,U),E="vite-connect-bridge ws server url",v=new N({bridge:E}),L=()=>{v.createSession().then(()=>v.uri)};v.on("connect",(o,t)=>{if(o)throw new Error(o);var s=JSON.parse(t);if(!s||!s[0])throw new Error("payload is null");const{account:e}=s.accounts;if(!e||!e[0])throw new Error("address is null");auth.createCustomToken(e).then(n=>{auth.signInWithCustomToken(n).then(a=>{firestore.collection("users").doc(a.user.uid).set({userName:s.peerMeta.name,userURL:s.peerMeta.url,userBio:s.peerMeta.description,userIcons:s.peerMeta.icons,createdAt:firebase.firestore.FieldValue.serverTimestamp(),roles:{}},{merge:!0})})}).catch(n=>{console.log("Error creating custom token:",n)})});v.on("disconnect",o=>{o&&console.log(o)});var g=(o,t)=>{for(const[s,e]of t)o[s]=e;return o};const R={data(){return{value:L(),size:300}},components:{QrcodeVue:O},setup(){const o=d(!1),t=d("");return{loading:o,email:t,handleLogin:async()=>{try{o.value=!0;const{error:e}=await c.auth.signIn({email:t.value});if(e)throw e;alert("Check your email for the login link!")}catch(e){alert(e.error_description||e.message)}finally{o.value=!1}}}}},J={class:"col-6 form-widget"},P=i("h1",{class:"header"},"Vite Builder DAO",-1),S=i("p",{class:"description"},"Sign in via the Vite app",-1);function T(o,t,s,e,n,a){const l=m("qrcode-vue");return p(),h("form",{class:"row flex flex-center",onSubmit:t[0]||(t[0]=_((...r)=>e.handleLogin&&e.handleLogin(...r),["prevent"]))},[i("div",J,[P,S,i("div",null,[b(l,{value:n.value,size:n.size,level:"H"},null,8,["value","size"])])])],32)}var z=g(R,[["render",T]]);const D={setup(){const o=d(!0),t=d(""),s=d(""),e=d("");async function n(){try{o.value=!0,u.user=c.auth.user();let{data:r,error:f,status:k}=await c.from("profiles").select("username, website, avatar_url").eq("id",u.user.id).single();if(f&&k!==406)throw f;r&&(t.value=r.username,s.value=r.website,e.value=r.avatar_url)}catch(r){alert(r.message)}finally{o.value=!1}}async function a(){try{o.value=!0,u.user=c.auth.user();const r={id:u.user.id,username:t.value,website:s.value,avatar_url:e.value,updated_at:new Date};let{error:f}=await c.from("profiles").upsert(r,{returning:"minimal"});if(f)throw f}catch(r){alert(r.message)}finally{o.value=!1}}async function l(){try{o.value=!0;let{error:r}=await c.auth.signOut();if(r)throw r}catch(r){alert(r.message)}finally{o.value=!1}}return x(()=>{n()}),{store:u,loading:o,username:t,website:s,avatar_url:e,updateProfile:a,signOut:l}}},q=i("label",{for:"email"},"Email",-1),B=["value"],F=i("label",{for:"username"},"Name",-1),Q=i("label",{for:"website"},"Website",-1),K=["value","disabled"],Y=["disabled"];function W(o,t,s,e,n,a){const l=m("Avatar");return p(),h("form",{class:"form-widget",onSubmit:t[4]||(t[4]=_((...r)=>e.updateProfile&&e.updateProfile(...r),["prevent"]))},[b(l,{path:e.avatar_url,"onUpdate:path":t[0]||(t[0]=r=>e.avatar_url=r),onUpload:e.updateProfile},null,8,["path","onUpload"]),i("div",null,[q,i("input",{id:"email",type:"text",value:e.store.user.email,disabled:""},null,8,B)]),i("div",null,[F,y(i("input",{id:"username",type:"text","onUpdate:modelValue":t[1]||(t[1]=r=>e.username=r)},null,512),[[w,e.username]])]),i("div",null,[Q,y(i("input",{id:"website",type:"website","onUpdate:modelValue":t[2]||(t[2]=r=>e.website=r)},null,512),[[w,e.website]])]),i("div",null,[i("input",{type:"submit",class:"button block primary",value:e.loading?"Loading ...":"Update",disabled:e.loading},null,8,K)]),i("div",null,[i("button",{class:"button block",onClick:t[3]||(t[3]=(...r)=>e.signOut&&e.signOut(...r)),disabled:e.loading}," Sign Out ",8,Y)])],32)}var Z=g(D,[["render",W]]);const G={components:{Auth:z,Profile:Z},setup(){return u.user=c.auth.user(),c.auth.onAuthStateChange((o,t)=>{u.user=t.user}),{store:u}}},H={class:"container",style:{padding:"50px 0 100px 0"}};function X(o,t,s,e,n,a){const l=m("Profile"),r=m("Auth");return p(),h("div",H,[e.store.user?(p(),I(l,{key:0})):(p(),I(r,{key:1}))])}var $=g(G,[["render",X]]);A($).mount("#app");
