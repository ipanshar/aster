import{j as e,$ as t}from"./app-BKqZrp5F.js";import{H as r,S as n}from"./heading-DT_X1H1V.js";import{B as c,a as i}from"./app-logo-icon-DFzMhL_n.js";const o=[{title:"Продукция",href:"/productsmanagment",icon:null,role:""},{title:"Курс",href:"/rate",icon:null,role:""}];function f({children:a}){if(typeof window>"u")return null;const l=window.location.pathname;return e.jsxs("div",{className:"px-4 py-6",children:[e.jsx(r,{title:"Бухгалтерия",description:"Управляйте  бухгалтерией"}),e.jsxs("div",{className:"flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12",children:[e.jsx("aside",{className:"w-full max-w-xl lg:w-48",children:e.jsx("nav",{className:"flex flex-col space-y-1 space-x-0",children:o.map(s=>e.jsx(c,{size:"sm",variant:"ghost",asChild:!0,className:i("w-full justify-start",{"bg-muted":l===s.href}),children:e.jsx(t,{href:s.href,prefetch:!0,children:s.title})},s.href))})}),e.jsx(n,{className:"my-6 md:hidden"}),e.jsx("div",{className:"flex-1 md:max-w-2xl",children:e.jsx("section",{className:"max-w-xl space-y-12",children:a})})]})]})}export{f as S};
