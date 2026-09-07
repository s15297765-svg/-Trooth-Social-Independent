// Trooth Social Independent — Business post realtime refresh + owner guard UX v1
(function(){
 if(window.__troothBusinessPostsV1)return;window.__troothBusinessPostsV1=true;
 function ready(){return new Promise(function(r){if(window.troothSupabase)r(window.troothSupabase);else window.addEventListener('trooth-supabase-ready',function(){r(window.troothSupabase)},{once:true})})}
 async function init(){var sb=await ready();var tries=0;(function patch(){tries++;if(typeof window.loadBusinessPosts==='function'&&!window.__troothBusinessPostsPatched){var original=window.loadBusinessPosts;window.loadBusinessPosts=async function(id){return original(id)};window.__troothBusinessPostsPatched=true}if(!window.__troothBusinessPostsPatched&&tries<40)setTimeout(patch,250)})();sb.channel('trooth-business-posts-live').on('postgres_changes',{event:'*',schema:'public',table:'business_posts'},function(){var box=document.getElementById('bizposts');if(box&&box.dataset.businessId&&typeof window.loadBusinessPosts==='function')window.loadBusinessPosts(box.dataset.businessId)}).subscribe()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();