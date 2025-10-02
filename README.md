
# Local AI Chatbot

Bu projede, yerel makinede çalışacak web tabanlı bir chatbot arayüzü oluşturulmuştur. Arayüz React kullanmaktadır. Arayüz, OpenRouter ağ geçidini kullanarak farklı modeller sunmakta ve bu modellerden sohbet geçmişine göre yanıtlar sağlamaktadır. Arayüzün OpenTelemetry enstrümentasyonu mevcuttur, aşağıda verilecek adımlar ile kolay bir şekilde Jaeger kurulumu yapılıp telemetri datası incelenebilir. 


## Kullanılan Teknolojiler

**React + TypeScript + TailwindCSS** \
Landing page olarak kullanılan chat ekranının mesajları render etmesi, state management ve OpenRouter external kaynağından elde edilecek mesajların gösterilmesi için React uygun görülmüştür. Proje için verilen kısa süre dolayısıyla TypeScript kullanılarak oluşabilecek tip anlaşmazlıklarının önüne geçilmiş ve TailwindCSS kullanılarak `.css` dosyaları ile uğraşılmamış ve zamandan tasarruf edilmiştir. 


**OpenRouter API** \
Uygulama kendi API servisine sahip olmadığı için model seçimini ve bu modellerden elde edeceği cevapları OpenRouter üzerinden getiriyor. 


**OpenTelemetry SDK ve Collector** \
SDK uygulamanın trace bilgisinin oluşturulmasını sağlarken, Collector ise uygulama ve Jaeger arasında bir ara katman olarak çalışarak bu bilgileri işlenmiş halleriyle Jaeger'e export ediyor.

**Jaeger UI** \
Trace datasının depolanmasını ve kolay incelenmesini sağlıyor.

**Docker** \
OpenTelemetry Collector ve Jaeger'in lokal network üzerinden birbirileri ile haberleşmelerini sağlıyor.
  
## Bilgisayarınızda Çalıştırın

Projeyi klonlayın

```bash
  git clone https://github.com/merturk19/LocalMachine_Chatbot.git
```

Proje dizinine gidin

```bash
  cd LocalMachine_Chatbot
```

Gerekli paketleri yükleyin

```bash
  npm install
```
API servisine erişim için bir API_KEY gerekiyor. \
 https://openrouter.ai/settings/keys adresinden kendiniz için bir API_KEY oluşturun. Dosya kök dizininde `.env` dosyası oluşturun ve oluşturduğunuz anahtarı aşağıdaki şekilde dosyaya ekleyin.

 ```bash
  VITE_OPENROUTER_API_KEY={olusturdugunuz_API_KEY}
```

Sunucuyu çalıştırın

```bash
  npm run start
```
Bu adımlar sonrasında arayüzü `localhost:5137` üzerinde görüntüleyebileceksiniz. Yandaki panelde mevcut modellerden dilediğinizi seçip sohbet etmeye başlayabilirsiniz🌻
  
## Jaeger UI Erişimi

OpenTelemetry Tracer projeye entegre ancak datayı toplamak için bir Collector'a ve daha sonra bu datayı incelemek için Jaeger arayüzüne ihtiyacımız var. Bu servisleri sağlamak adına bilgisayarınızda Docker Desktop yüklü olması gerekiyor. 

Projeyi klonladıktan sonra `docker-compose.yaml` ve `otel-collector-config.yaml` dosyalarının dahil olduğunua emin olun. İlk dosya Docker üzerinden servislere gerekli konteynırları sağlarken ikinci dosya ise Collector'un veri elde etme, işleme ve dağıtma özelliklerini sağlıyor.  

Ardından aşağıdaki komutu herhangi bir cmd paneline yazarak konteynırın Docker üzerinde oluşturulduğunu ve çalışmaya başladığını gözlemleyin. 

```bash
  docker compose up -d
```
Konfigurasyona göre Collector, trace datasını `localhost:4317` adresine gönderiyor ve Jaeger bu adresi dinliyor. Sonrasında `localhost:16686` üzerinde Jaeger UI çalışarak data gözlemlenebilir hale geliyor. Siz de bu adrese giderek sayfanın açılması, fetch istekleri gibi trace datasını gözlemleyebilirsiniz. 

### Örnek Senaryo

Örnek senaryo olarak projeyi ve Jaeger UI'ı aynı anda başlatın. Arayüz ekranında dilediğiniz modeli seçerek bir mesaj gönderin. Model tarafından bir mesaj elde edildikten sonra `localhost:16686` adresine giderek Jaeger UI erişin. 

Burada "Service" altında `unknown_service` seçin. Bu bizim collector servisimiz oluyor. Rahat gözlem adına "Operation" altında `HTTP GET` seçin. Böylece sadece OpenRouter'a gönderdiğimiz GET isteklerini görüntüleyeceğiz. En aşağıda `FIND TRACES` butonuna tıkladığınızda, başka bir işlem yapmadıysanız eğer, iki adet aynı isimde trace görüntüleyeceksiniz: `unknown_service: HTTP GET`.

Bunlardan biri model seçiminiz için API listesini getiren, biri de chat mesajınıza istinaden model tarafından dönen mesajı getiren fetch istekleri. Bu trace datasının bütün detaylarını tıklayarak görebilirsiniz, Jaeger üzerinden farklı seçimler ile doküman ve kaynak gibi bilgilere de erişebilirsiniz ✅



## Destek

Destek veya görüşleriniz için mehmetufukerturk@gmail.com adresine e-mail gönderebilirsiniz. 

  