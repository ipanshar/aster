import{r as d,j as r}from"./app-BKqZrp5F.js";import{P as m}from"./index-X1wCjDTj.js";import{a as p}from"./app-logo-icon-DFzMhL_n.js";var x="Separator",e="horizontal",u=["horizontal","vertical"],s=d.forwardRef((t,a)=>{const{decorative:i,orientation:o=e,...l}=t,n=v(o)?o:e,c=i?{role:"none"}:{"aria-orientation":n==="vertical"?n:void 0,role:"separator"};return r.jsx(m.div,{"data-orientation":n,...c,...l,ref:a})});s.displayName=x;function v(t){return u.includes(t)}var f=s;function E({className:t,orientation:a="horizontal",decorative:i=!0,...o}){return r.jsx(f,{"data-slot":"separator-root",decorative:i,orientation:a,className:p("bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",t),...o})}function g({title:t,description:a}){return r.jsxs("div",{className:"mb-8 space-y-0.5",children:[r.jsx("h2",{className:"text-xl font-semibold tracking-tight",children:t}),a&&r.jsx("p",{className:"text-muted-foreground text-sm",children:a})]})}export{g as H,E as S};
