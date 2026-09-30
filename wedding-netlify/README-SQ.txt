FTESA E DASMËS — RSVP ME NETLIFY FUNCTIONS DHE RESEND

Formulari dërgon emrin, mbiemrin, pjesëmarrjen dhe urimin opsional te funksioni
/.netlify/functions/rsvp. Funksioni kontrollon të dhënat dhe dërgon email përmes
Resend te vleronsadiku7@gmail.com.

PUBLIKIMI

Netlify Functions nuk ekzekutohen nga Netlify Drop. Publikoje këtë folder me
Git-in të lidhur me Netlify ose me Netlify CLI, në mënyrë që funksioni të
ndërtohet dhe të publikohet bashkë me faqen.

Nëse përdor Git:
1. Nxirre ZIP-in dhe ngarko përmbajtjen e folderit wedding-netlify në një
   repository të ri. Skedari netlify.toml duhet të jetë në rrënjë; faqja do të
   shërbehet nga folderi public.
2. Në Netlify, krijo një faqe të re duke lidhur atë repository. Lëre root
   directory të pandryshuar që Netlify të gjejë netlify.toml.
3. Në Netlify → Site configuration → Environment variables, shto:
   - RESEND_API_KEY — çelësi i ri privat nga Resend
   - RESEND_FROM_EMAIL — p.sh. RSVP <rsvp@domaini-juaj.com>
4. Verifiko domainin e dërguesit në Resend. Vlera RESEND_FROM_EMAIL duhet të
   përdorë një domain të verifikuar në llogarinë tënde Resend.
5. Publiko ose ridisloko faqen pasi të shtosh variablat dhe dërgo një RSVP provë.

Nëse përdor Netlify CLI, hape terminalin në folderin e nxjerrë, lidh faqen me
Netlify (`netlify link`) dhe publikoje (`netlify deploy --prod`).

SIGURIA E ÇELËSIT

Mos vendos RESEND_API_KEY në skedarët e faqes ose në repository. Skedari i
mëparshëm paralajmëronte se një çelës Resend ishte ndarë në chat; revokoje atë
çelës dhe krijo një të ri përpara konfigurimit në Netlify.

Në preview-n e Replit shihet faqja, por dërgimi i emailit funksionon vetëm pasi
funksioni publikohet në Netlify dhe variablat e Resend konfigurohen atje.

Kënga nis kur vizitori klikon zarfin për ta hapur ftesën. Shfletuesit bllokojnë
autoplay me zë pa ndërveprim të përdoruesit.