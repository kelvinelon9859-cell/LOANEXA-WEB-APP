"use strict";(()=>{var e={};e.id=38,e.ids=[38],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},924:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>A,patchFetch:()=>w,requestAsyncStorage:()=>f,routeModule:()=>_,serverHooks:()=>x,staticGenerationAsyncStorage:()=>h});var r={};a.r(r),a.d(r,{GET:()=>d,PATCH:()=>m,dynamic:()=>u});var n=a(9303),s=a(8716),o=a(670),i=a(7070),p=a(9793);let u="force-dynamic",c=process.env.SUPABASE_SERVICE_ROLE_KEY||"sb_publishable_faJrHDhrz3DFwUEuLSAZTA_0YS9ejC_",l=(0,p.eI)("https://rjcqudwnsuqyqwcwwuwo.supabase.co",c);async function d(e,{params:t}){try{let{id:e}=await t;if(!e)return i.NextResponse.json({error:"Missing application ID"},{status:400});let{data:a,error:r}=await l.from("applications").select(`
        id,
        loan_amount,
        loan_term_months,
        loan_purpose,
        income,
        status,
        transaction_reference,
        created_at,
        users (
          full_name,
          email,
          phone,
          state
        )
      `).eq("id",e).single();if(r||!a)return i.NextResponse.json({error:"Application not found"},{status:404});return i.NextResponse.json(a)}catch(e){return i.NextResponse.json({error:e.message||"Internal Server Error"},{status:500})}}async function m(e,{params:t}){try{let{id:a}=await t,{status:r,transaction_reference:n}=await e.json(),s={updated_at:new Date().toISOString()};r&&(s.status=r.trim().toLowerCase().toUpperCase()),void 0!==n&&(s.transaction_reference=n);let{data:o,error:p}=await l.from("applications").update(s).eq("id",a).select(`
        id,
        loan_amount,
        loan_term_months,
        loan_purpose,
        income,
        status,
        transaction_reference,
        created_at,
        users (
          full_name,
          email,
          phone,
          state
        )
      `).single();if(p)return i.NextResponse.json({error:p.message},{status:400});return i.NextResponse.json(o)}catch(e){return i.NextResponse.json({error:e.message||"Internal Server Error"},{status:500})}}let _=new n.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/admin/applications/[id]/route",pathname:"/api/admin/applications/[id]",filename:"route",bundlePath:"app/api/admin/applications/[id]/route"},resolvedPagePath:"E:\\Development\\LOANEXA WEB APP\\LOANEXA-WEB-APP\\app\\api\\admin\\applications\\[id]\\route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:f,staticGenerationAsyncStorage:h,serverHooks:x}=_,A="/api/admin/applications/[id]/route";function w(){return(0,o.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:h})}}};var t=require("../../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[276,903,972],()=>a(924));module.exports=r})();