# Smart Spirit Intelligence

Uzay/gezegen temalı, AI odaklı full-stack web uygulaması.

## Teknolojiler

**Backend:** Spring Boot 3.5.15 (Java 17), PostgreSQL, Hibernate/JPA
**Frontend:** React 19.2.7

## Proje Yapısı

```
login-page-project/
├── backend/     # Spring Boot API
│   ├── src/src.main/java/com/smartspirit/api/
│   │   ├── controller/   # REST endpoint'leri
│   │   ├── dto/          # Request/Response nesneleri
│   │   ├── entity/       # Veritabanı tabloları
│   │   ├── repository/   # Veritabanı erişim katmanı
│   │   └── service/      # İş mantığı
│   ├── src/src.main/resources/
│   │   └── application.properties.example   # Config şablonu
│   └── pom.xml
└── frontend/    # React arayüzü
    ├── src/
    │   ├── components/   # Yeniden kullanılabilir bileşenler (StarField, NeuralCore, vb.)
    │   └── pages/        # Sayfa bileşenleri (LoginPages, Dashboard)
    └── package.json
```

## Gereksinimler

- Java 17+
- Node.js ve npm
- PostgreSQL 16+
- Maven (proje içinde `mvnw` ile geldiği için ayrıca kurmaya gerek yok)

## Kurulum

### 1. Backend

```bash
cd backend
```

`src/src.main/resources/application.properties.example` dosyasını aynı klasöre **`application.properties`** adıyla kopyala, içindeki placeholder değerleri kendi bilgilerinle doldur (bkz. aşağıdaki "Config Şablonu" bölümü).

Bağımlılıkları indir ve derle:

```bash
./mvnw clean install
```

### 2. Frontend

```bash
cd frontend
npm install
```

## Çalıştırma

### Backend (varsayılan port: 8080)

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend (varsayılan port: 3000)

```bash
cd frontend
npm start
```

## Config Şablonu

`application.properties` dosyası **repoda yer almaz** (`.gitignore` ile hariç tutulmuştur, çünkü veritabanı şifresi ve JWT secret gibi hassas bilgiler içerir). Proje kök dizininde `backend/src/src.main/resources/application.properties.example` adında bir şablon dosyası bulunur — bunu kopyalayıp kendi bilgilerinle doldurman yeterli.

```properties
spring.application.name=api

spring.datasource.url=jdbc:postgresql://localhost:5432/smartspirit
spring.datasource.username=<kendi_kullanici_adin>
spring.datasource.password=<kendi_sifren>

spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.show-sql=false

jwt.secret=<kendi-secret-keyin>
jwt.expiration.ms=180000
jwt.refresh.expiration.ms=604800000

server.port=8080
```

## Bağımlılıklar

### Backend (pom.xml)

| Kütüphane | Amaç |
|---|---|
| spring-boot-starter-web | REST API / web sunucu |
| spring-boot-starter-data-jpa | Veritabanı işlemleri (Hibernate ORM ile Java nesneleri ↔ SQL tabloları çevirisi) |
| spring-boot-starter-security | Kimlik doğrulama / güvenlik altyapısı |
| spring-boot-starter-validation | Form / veri doğrulama (`@NotNull`, `@Email` vb.) |
| spring-boot-devtools | Geliştirme sırasında kod değişince otomatik yeniden başlatma |
| postgresql | PostgreSQL veritabanı sürücüsü |
| lombok | Boilerplate kod azaltma (`@Getter`, `@Setter` vb.) |
| spring-boot-starter-test | Test altyapısı (JUnit, Mockito) |

Tüm bağımlılık ağacını (alt bağımlılıklar dahil) görmek için:
```bash
cd backend
./mvnw dependency:tree
```

### Frontend (package.json)

| Paket | Amaç |
|---|---|
| react | Ana kütüphane |
| react-dom | React'ın DOM'a render edilmesi |
| react-router-dom | Sayfa yönlendirme (Login → Dashboard vb.) |
| axios | Backend API'ye HTTP istekleri |
| react-scripts | Build / start komutlarını çalıştıran araç (create-react-app) |
| @testing-library/* | Test altyapısı |
| web-vitals | Performans ölçümü |

Tüm bağımlılıkları görmek için:
```bash
cd frontend
npm list --depth=0
```

## Notlar

- Backend'de `spring.jpa.show-sql` ayarı geliştirme sırasında `true` yapılarak çalıştırılan SQL sorguları terminalde izlenebilir; production'a geçerken `false` kalmalı.
- Veritabanı şeması şu an Hibernate'in `ddl-auto=update` ayarı üzerinden otomatik yönetiliyor (migration aracı kullanılmıyor).
- `application.properties` dosyanı **asla** commit etme — hassas bilgiler içerir, `.gitignore` bunu zaten engeller.