function Footer(){

 return(

  <footer className="footer">
   © 2026 UPR LMS • Built for modern learning

   <style>{`

    .footer {
     width:100%;
     text-align:center;
     padding:14px 10px;

     /* 🔥 PREMIUM GLASS STYLE (LIKE NAVBAR) */
     background:rgba(0,0,0,0.7);
     backdrop-filter:blur(12px);
     border-top:1px solid rgba(255,255,255,0.1);

     color:#9ca3af;
     font-size:13px;

     position:relative;
     z-index:10;
    }

    .footer:hover {
     color:white;
     transition:0.3s;
    }

    /* 📱 MOBILE */
    @media(max-width:600px){
     .footer {
      font-size:12px;
      padding:12px 6px;
     }
    }

   `}</style>

  </footer>

 );

}

export default Footer;