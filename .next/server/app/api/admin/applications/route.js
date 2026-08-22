"use strict";(()=>{var e={};e.id=632,e.ids=[632],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4648:(e,r,a)=>{a.r(r),a.d(r,{originalPathname:()=>h,patchFetch:()=>v,requestAsyncStorage:()=>E,routeModule:()=>m,serverHooks:()=>_,staticGenerationAsyncStorage:()=>A});var t={};a.r(t),a.d(t,{GET:()=>d,dynamic:()=>u});var n=a(9303),o=a(8716),s=a(670),i=a(7070),p=a(9793);let u="force-dynamic",c=process.env.SUPABASE_SERVICE_ROLE_KEY||"sb_publishable_faJrHDhrz3DFwUEuLSAZTA_0YS9ejC_",l=(0,p.eI)("https://rjcqudwnsuqyqwcwwuwo.supabase.co",c);async function d(){try{let{data:e,error:r}=await l.from("applications").select(`
        id,
        loan_amount,
        loan_term_months,
        loan_purpose,
        income,
        status,
        created_at,
        users (
          full_name,
          email,
          phone,
          state
        )
      `).order("created_at",{ascending:!1});if(r)return console.error("[Supabase Error - GET /api/admin/applications]:",r.message),i.NextResponse.json({error:r.message},{status:500});return i.NextResponse.json(e??[])}catch(e){return console.error("[API Error]:",e),i.NextResponse.json({error:"Internal Server Error"},{status:500})}}let m=new n.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/admin/applications/route",pathname:"/api/admin/applications",filename:"route",bundlePath:"app/api/admin/applications/route"},resolvedPagePath:"E:\\Development\\LOANEXA WEB APP\\LOANEXA-WEB-APP\\app\\api\\admin\\applications\\route.ts",nextConfigOutput:"",userland:t}),{requestAsyncStorage:E,staticGenerationAsyncStorage:A,serverHooks:_}=m,h="/api/admin/applications/route";function v(){return(0,s.patchFetch)({serverHooks:_,staticGenerationAsyncStorage:A})}}};var r=require("../../../../webpack-runtime.js");r.C(e);var a=e=>r(r.s=e),t=r.X(0,[276,903,972],()=>a(4648));module.exports=t})();