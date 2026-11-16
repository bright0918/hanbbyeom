/* 한 뼘 시선 서비스 워커: 인터넷이 되면 늘 최신 파일을, 안 되면 저장해 둔 파일을 쓴다.
   GitHub Pages는 파일을 10분 동안 캐시하라고 보내므로, 같은 주소 파일은 매번 새 버전이 있는지 확인(no-cache)한다. */
const V="hb-v2",FILES=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:"reload"})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const q=e.request;if(q.method!=="GET")return;
  const same=new URL(q.url).origin===self.location.origin;
  const net=same?fetch(q,{cache:"no-cache"}):fetch(q);
  e.respondWith(net.then(r=>{if(same&&r.ok){const c=r.clone();caches.open(V).then(x=>x.put(q,c))}return r}).catch(()=>caches.match(q,{ignoreSearch:true})))});
