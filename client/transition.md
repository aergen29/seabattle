Framer Motion'da kullanılan transition (geçiş) tipleri ve açıklamaları:

Spring (Yay Animasyonu)
Eleman yavaşça ivmelenir ve yaylanarak yerine oturur.
Gerçekçi fizik tabanlı animasyonlar için en iyisi!

Örnek Kullanım:
transition={{ type: "spring", stiffness: 300, damping: 20 }}
Parametreler:

stiffness → Yayın sertliği (Yüksek olursa daha hızlı hareket eder)

damping → Yayın sönümlemesi (Yüksek olursa daha az yaylanır)

mass → Kütle (Yüksek olursa hareket daha ağır olur)

Tween (Klasik Geçiş)
Eleman düzgün hızda (linear, ease-in, ease-out, ease-in-out gibi) hareket eder.

Örnek Kullanım:
transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
Parametreler:

duration → Animasyonun süreci (saniye cinsinden)

ease → Hareketin türü:

easeIn → Yavaş başlayıp hızlanır

easeOut → Hızlı başlayıp yavaşlar

easeInOut → Yavaş başlar, hızlanır, sonra tekrar yavaşlar

linear → Düzgün hızda hareket eder

Inertia (Atalet Hareketi)
Eleman sürükleme sonrası hızını koruyarak durur (fiziksel bir atalet hissi verir).

Örnek Kullanım:
transition={{ type: "inertia", velocity: 50, bounceStiffness: 200 }}
Parametreler:

velocity → Başlangıç hızı

bounceStiffness → Çarpma (bounce) sertliği

power → Hareketin ne kadar devam edeceğini belirler

Keyframes (Anahtar Kareler)
Birkaç farklı pozisyona geçiş yaparak animasyon oluşturur.

Örnek Kullanım:
transition={{ duration: 2, times: [0, 0.5, 1], ease: "easeInOut" }}
Parametreler:

times → Hangi zamanlarda hangi değerlere ulaşacağını belirler

ease → Hareket eğrisi

Hangi Tipi Ne İçin Kullanmalısın?

Transition

En İyi Kullanım Alanı

spring

Gerçekçi fizik tabanlı geçişler (kaydırma, yaylanma vb.)

tween

Zaman tabanlı, düz animasyonlar (fade in/out, kayma)

inertia

Sürüklenen objelerin daha doğal hareket etmesi

keyframes

Karmaşık, sahneleme gerektiren animasyonlar


Özetle:

Gerçekçi hareket istiyorsan → spring

Düzgün bir animasyon istiyorsan → tween

Sürükleme sonrası hızını korusun istiyorsan → inertia

Karmaşık animasyon yapacaksan → keyframes

