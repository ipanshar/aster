import{m as w,j as s,L as f}from"./app-BKqZrp5F.js";import{I as t}from"./input-error-DRue06C_.js";import{B as h}from"./app-logo-icon-DFzMhL_n.js";import{L as i,I as l}from"./label-B1NFvc0T.js";import{A as x,L as j}from"./auth-layout-iSqJexwL.js";import"./index-X1wCjDTj.js";function L({token:n,email:d}){const{data:e,setData:o,post:p,processing:m,errors:r,reset:c}=w({token:n,email:d,password:"",password_confirmation:""}),u=a=>{a.preventDefault(),p(route("password.store"),{onFinish:()=>c("password","password_confirmation")})};return s.jsxs(x,{title:"Сброс пароля",description:"Пожалуйста, введите новый пароль ниже",children:[s.jsx(f,{title:"Сброс пароля"}),s.jsx("form",{onSubmit:u,children:s.jsxs("div",{className:"grid gap-6",children:[s.jsxs("div",{className:"grid gap-2",children:[s.jsx(i,{htmlFor:"email",children:"Электронная почта"}),s.jsx(l,{id:"email",type:"email",name:"email",autoComplete:"email",value:e.email,className:"mt-1 block w-full",readOnly:!0,onChange:a=>o("email",a.target.value)}),s.jsx(t,{message:r.email,className:"mt-2"})]}),s.jsxs("div",{className:"grid gap-2",children:[s.jsx(i,{htmlFor:"password",children:"Пароль"}),s.jsx(l,{id:"password",type:"password",name:"password",autoComplete:"new-password",value:e.password,className:"mt-1 block w-full",autoFocus:!0,onChange:a=>o("password",a.target.value),placeholder:"Пароль"}),s.jsx(t,{message:r.password})]}),s.jsxs("div",{className:"grid gap-2",children:[s.jsx(i,{htmlFor:"password_confirmation",children:"Подтвердите пароль"}),s.jsx(l,{id:"password_confirmation",type:"password",name:"password_confirmation",autoComplete:"new-password",value:e.password_confirmation,className:"mt-1 block w-full",onChange:a=>o("password_confirmation",a.target.value),placeholder:"Подтвердите пароль"}),s.jsx(t,{message:r.password_confirmation,className:"mt-2"})]}),s.jsxs(h,{type:"submit",className:"mt-4 w-full",disabled:m,children:[m&&s.jsx(j,{className:"h-4 w-4 animate-spin"}),"Сбросить пароль"]})]})})]})}export{L as default};
