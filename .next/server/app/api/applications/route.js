"use strict";(()=>{var e={};e.id=569,e.ids=[569],e.modules={2934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},5749:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{originalPathname:()=>E,patchFetch:()=>l,requestAsyncStorage:()=>c,routeModule:()=>u,serverHooks:()=>m,staticGenerationAsyncStorage:()=>d});var s=a(9303),o=a(8716),n=a(670),i=a(2868),p=e([i]);i=(p.then?(await p)():p)[0];let u=new s.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/applications/route",pathname:"/api/applications",filename:"route",bundlePath:"app/api/applications/route"},resolvedPagePath:"E:\\Development\\LOANEXA WEB APP\\LOANEXA-WEB-APP\\app\\api\\applications\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:c,staticGenerationAsyncStorage:d,serverHooks:m}=u,E="/api/applications/route";function l(){return(0,n.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:d})}r()}catch(e){r(e)}})},2868:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{GET:()=>l,POST:()=>u,dynamic:()=>c});var s=a(7070),o=a(9487),n=a(3452),i=a(1615),p=e([o]);o=(p.then?(await p)():p)[0];let c="force-dynamic";async function l(e){let t=e.nextUrl.searchParams.get("id");if(!t)return s.NextResponse.json({error:"Missing application token identifier"},{status:400});let a=t.trim().toUpperCase();try{let e=await (0,o.I)(`SELECT 
        a.id, 
        u.full_name AS "fullName", 
        a.status, 
        a.loan_amount AS "loanAmount", 
        a.loan_purpose AS "loanPurpose", 
        a.external_verify_link AS "externalVerifyLink", 
        a.created_at AS "createdAt"
       FROM applications a
       JOIN users u ON a.user_id = u.id
       WHERE a.id = $1`,[a]);if(0===e.rows.length)return s.NextResponse.json({error:"Token reference match not found"},{status:404});let t=e.rows[0];return s.NextResponse.json({...t,loanAmount:Number(t.loanAmount)})}catch(e){return console.error("Database application lookup error:",e),s.NextResponse.json({error:"Failed to retrieve application"},{status:500})}}async function u(e){try{let t=(0,i.cookies)(),a=(0,n.l)("https://rjcqudwnsuqyqwcwwuwo.supabase.co","sb_publishable_faJrHDhrz3DFwUEuLSAZTA_0YS9ejC_",{cookies:{get:e=>t.get(e)?.value}}),{data:{user:r},error:p}=await a.auth.getUser();if(p||!r||!r.email)return s.NextResponse.json({error:"Unauthorized. Please log in to submit an application."},{status:401});let l=r.email,{fullName:u,dob:c,phone:d,streetAddress:m,city:E,state:h,zipCode:A,employmentStatus:y,employerName:x,annualIncome:_,loanPurpose:N,ssnLast4:w,dlState:D,driverLicenseNumber:P,loanAmount:f,loanTerm:v}=await e.json(),S=`LN-2026-${Math.floor(1e3+9e3*Math.random())}`,R=`https://verify.loanexa.com/session/${S}`,g=`
      INSERT INTO users (full_name, email, phone, dob, address, city, state, zip)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (email) DO UPDATE 
      SET full_name = EXCLUDED.full_name,
          phone = EXCLUDED.phone,
          address = EXCLUDED.address,
          city = EXCLUDED.city,
          state = EXCLUDED.state,
          zip = EXCLUDED.zip
      RETURNING id;
    `,$=(await (0,o.I)(g,[u||"Applicant",l,d||"000-000-0000",c||"2000-01-01",m||"Not Provided",E||"Not Provided",h||"CA",A||"00000"])).rows[0].id,T=`
      INSERT INTO applications (
        id,
        user_id,
        income,
        employment_status,
        employer_name,
        loan_amount,
        loan_term_months,
        loan_purpose,
        ssn_last_4,
        license_number,
        license_state,
        external_verify_link,
        status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending'
      )
      RETURNING id;
    `,U=parseInt(v,10)||12,O=[S,$,_?parseFloat(_):0,y||"Full-Time",x||null,f?parseFloat(f):5e3,U,N||"Debt Consolidation",w||"0000",P||"NONE",D||h||"CA",R],b=await (0,o.I)(T,O);return s.NextResponse.json({id:b.rows[0].id,success:!0},{status:201})}catch(e){return console.error("Database insert error:",e),s.NextResponse.json({error:"Failed to record application in database",details:e.message},{status:500})}}r()}catch(e){r(e)}})},9487:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.d(t,{I:()=>n});var s=a(8678),o=e([s]);let i=new(s=(o.then?(await o)():o)[0]).Pool({connectionString:process.env.DATABASE_URL||process.env.POSTGRES_URL,user:process.env.PGUSER,host:process.env.PGHOST,database:process.env.PGDATABASE,password:process.env.PGPASSWORD,port:Number(process.env.PGPORT||5432),ssl:{rejectUnauthorized:!1}});async function n(e,t){let a=Date.now();try{let r=await i.query(e,t),s=Date.now()-a;return console.log("Executed query",{text:e,duration:s,rows:r.rowCount}),r}catch(e){throw console.error("Database query error layer:",e),e}}r()}catch(e){r(e)}})}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[276,903,972,400],()=>a(5749));module.exports=r})();