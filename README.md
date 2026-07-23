# Smart Spirit — Login & Dashboard

React tabanlı kullanıcı arayüzü ile Spring Boot REST API'sinin entegre edildiği, PostgreSQL veritabanı destekli, JWT ile korunan giriş ve yönetim paneli sistemi.

## Teknoloji Yığını

**Backend**

- Java 17, Spring Boot 3.5
- Spring Data JPA (PostgreSQL)
- Spring Security (gerçek filter zinciri — `SecurityConfig` üzerinden `hasRole` bazlı yetkilendirme)
- Spring Validation (`spring-boot-starter-validation`)
- JJWT 0.11.5 — JWT üretimi ve doğrulaması (access + refresh token)
- `spring-boot-starter-test` (JUnit 5 + Mockito) — servis katmanı unit testleri
- Lombok
- Maven

**Frontend**

- React 19 + Vite
- Tailwind CSS v4
- shadcn/ui (Radix UI tabanlı bileşenler)
- Framer Motion (`motion/react`)
- React Router

**Altyapı / Deploy**

- Docker & Docker Compose — `db` (PostgreSQL), `backend` (Spring Boot) ve `frontend` (Nginx ile servis edilen build) olmak üzere 3 servis
- Tüm hassas/ortama özgü ayarlar (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET`, `CORS_ALLOWED_ORIGIN`, `PORT`) ortam değişkeni olarak dışarıdan verilir

## Proje Yapısı

```
backend/
  src/main/java/com/smartspirit/
    controller/
      LoginController.java        # POST /api/auth/login, POST /api/auth/refresh, GET /api/auth/validate
      UserProfileController.java  # GET /api/users/profile        (herhangi bir giriş yapmış kullanıcı)
      LogController.java          # GET /api/logs                 (ADMIN)
      RoleController.java         # GET /api/roles                (giriş yapmış kullanıcı)
      AdminUserController.java    # GET /api/admin/users          (ADMIN)
    service/
      LoginService.java           # login + refreshToken iş mantığı, brute-force rate limiting, user_logs'a kayıt
    repository/
      UserRepository.java         # User için (findByUsername, findAll)
      RoleRepository.java         # Role için (findByName, findAll)
      UserLogRepository.java      # UserLog için (findAllByOrderByCreatedDateDesc, başarısız deneme sayacı)
      SystemErrorRepository.java  # SystemError için
    entity/
      User.java, Role.java, UserLog.java, SystemError.java
    dto/
      LoginRequest.java, LoginResponse.java, RefreshTokenRequest.java
      UserProfileResponse.java, LogEntryResponse.java, RoleResponse.java, AdminUserResponse.java
      ErrorResponse.java
    exception/
      GlobalExceptionHandler.java # doğrulama/header hatalarını ve beklenmeyen hataları yönetir; sadece beklenmeyen (500) hatalar error_logs'a kaydedilir
    security/
      JwtFilter.java              # her istekte Authorization header'ını okuyup SecurityContext'i doldurur
      UnauthorizedHandler.java    # token yok/geçersiz → 401
      ForbiddenHandler.java       # token geçerli ama rol yetmiyor → 403
    config/
      SecurityConfig.java         # tüm HTTP güvenlik kuralları + CORS tek yerden burada (origin'ler CORS_ALLOWED_ORIGIN env değişkeninden okunur)
      DataSeeder.java             # ilk açılışta admin/1234 (ADMIN) ve demo/1234 (USER) kullanıcılarını oluşturur
    util/
      JwtUtil.java                # access + refresh token üretimi, token tipi/username/role çıkarımı
  src/test/java/com/smartspirit/
    service/
      LoginServiceTest.java       # LoginService için 6 unit test (Mockito ile izole)
  src/main/resources/
    application.properties        # tüm değerler ortam değişkenlerinden okunur (bkz. Ortam Değişkenleri)
  Dockerfile                       # multi-stage: Maven ile derleme → eclipse-temurin:17-jre üzerinde çalıştırma
  .dockerignore

frontend/
  src/
    pages/
      LoginPages.jsx     # giriş formu + "token hâlâ geçerliyse otomatik dashboard'a yönlendir"
      Dashboard.jsx       # modül kartları + genişleyen Loglar / Roller / Kullanıcılar panelleri
    components/
      dashboard/
        DashboardHeader.jsx, ModuleCard.jsx
        LogsPanel.jsx      # GET /api/logs        — sadece ADMIN görebilir
        RolesPanel.jsx     # GET /api/roles       — herkes görebilir
        UsersPanel.jsx     # GET /api/admin/users — sadece ADMIN görebilir
        ActionBadge.jsx
      login/
        LoginForm.jsx, LoginLeftPanel.jsx
      ui/                  # shadcn bileşenleri
    lib/
      utils.js
  Dockerfile               # multi-stage: Node ile build → nginx:alpine ile statik servis
  .dockerignore

docker-compose.yml          # db (PostgreSQL 16) + backend + frontend servislerini birlikte ayağa kaldırır
env.example                 # backend/compose için örnek ortam değişkenleri
frontend/env.example        # frontend için örnek ortam değişkeni (VITE_API_URL)
```
## Canlı Demo

- Frontend: https://loginpage-git-main-hilal1234.vercel.app 
- Backend: https://loginpage-production-4d69.up.railway.app
## Kurulum ve Çalıştırma

Proje iki şekilde çalıştırılabilir: **Docker ile** tek komutla tüm servisleri (veritabanı + backend + frontend) ayağa kaldırmak, ya da her servisi **manuel** kendi ortamınızda çalıştırmak.

### Gereksinimler

**Docker ile çalıştırma için**

| Yazılım        | Bağlantı |
|----------------|----------|
| Docker         | https://www.docker.com/ |
| Docker Compose | Docker Desktop ile birlikte gelir |

**Manuel çalıştırma için**

| Yazılım    | Sürüm         | Bağlantı |
|------------|---------------|----------|
| Java       | 17 veya üzeri | https://adoptium.net/ |
| Node.js    | 18 veya üzeri | https://nodejs.org/ |
| PostgreSQL | 15 veya üzeri | https://www.postgresql.org/download/ |
| Maven      | isteğe bağlı  | Maven Wrapper (`mvnw`) projede mevcut |

### 1. Projeyi indirin

```bash
git clone https://github.com/KULLANICI_ADIN/smart-spirit-login.git
cd smart-spirit-login
```

### 2. Ortam değişkenlerini ayarlayın

Uygulama artık tüm hassas/ortama özgü değerleri kod içine yazmak yerine ortam değişkeninden okur:

| Değişken                      | Açıklama |
|--------------------------------|----------|
| `SPRING_DATASOURCE_URL`        | PostgreSQL bağlantı adresi (örn. `jdbc:postgresql://localhost:5432/smartspirit`, Docker'da `jdbc:postgresql://db:5432/smartspirit`) |
| `SPRING_DATASOURCE_USERNAME`   | PostgreSQL kullanıcı adı (örn. `postgres`) |
| `SPRING_DATASOURCE_PASSWORD` / `DB_PASSWORD` | PostgreSQL veritabanı şifreniz (Docker Compose'da `DB_PASSWORD` verilir, hem `db` servisine hem backend'e aktarılır) |
| `JWT_SECRET`                   | JWT imzalama anahtarı (en az 32 karakter, rastgele bir metin) |
| `CORS_ALLOWED_ORIGIN`          | Frontend'in çalıştığı adres(ler), virgülle ayrılabilir (örn. `http://localhost:5173`) |
| `PORT`                         | Backend'in dinleyeceği port (varsayılan `8080`; Render gibi platformlar bunu otomatik atar) |

Kök dizindeki `env.example` ve `frontend/env.example` dosyaları örnek değerleri gösterir — bunları `.env` olarak kopyalayıp kendi değerlerinizle doldurabilirsiniz.

> `JWT_SECRET` için rastgele, en az 32 karakter uzunluğunda bir metin üretin (HS256 imzalama algoritmasının gereksinimi).

### 3a. Docker ile çalıştırma (önerilen)

Kök dizinde `.env` dosyanızı oluşturun (`env.example`'dan kopyalayıp `DB_PASSWORD` ve `JWT_SECRET` değerlerini doldurun), ardından:

```bash
docker compose up --build
```

Bu komut 3 servisi başlatır:

| Servis     | Adres                     | Açıklama |
|------------|---------------------------|----------|
| `db`       | `localhost:5432`          | PostgreSQL 16, `smartspirit` veritabanı otomatik oluşturulur |
| `backend`  | `http://localhost:8080`   | Spring Boot API |
| `frontend` | `http://localhost:3000`   | Nginx ile servis edilen React build'i |

`docker-compose.yml` içindeki `SPRING_DATASOURCE_URL` zaten servis adı üzerinden (`db`) veritabanına bağlanacak şekilde ayarlıdır; bu değeri elle değiştirmenize gerek yoktur.

### 3b. Manuel çalıştırma

**Veritabanını oluşturun**

```sql
CREATE DATABASE smartspirit;
```

Tablolar uygulama ilk çalıştığında Hibernate tarafından otomatik oluşturulur (`spring.jpa.hibernate.ddl-auto=update`).

**Ortam değişkenlerini ayarlayın (Linux / macOS)**

```bash
export SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/smartspirit"
export SPRING_DATASOURCE_USERNAME="postgres"
export SPRING_DATASOURCE_PASSWORD="postgres_sifreniz"
export JWT_SECRET="jwt_secret_key"
export CORS_ALLOWED_ORIGIN="http://localhost:5173"
```

Windows (PowerShell) için `export` yerine `$env:DEĞİŞKEN="değer"`, Komut İstemi için `set DEĞİŞKEN=değer` kullanın.

**Backend'i çalıştırın**

```bash
cd backend
./mvnw spring-boot:run
```

Windows kullanıyorsanız:

```cmd
cd backend
mvnw.cmd spring-boot:run
```

Backend varsayılan olarak `http://localhost:8080` adresinde ayağa kalkar (`PORT` ile değiştirilebilir).

**Testleri çalıştırın**

```bash
cd backend
./mvnw test
```

Windows kullanıyorsanız:

```cmd
cd backend
mvnw.cmd test
```

Bu komut `src/test/java/com/smartspirit/service/LoginServiceTest.java` içindeki 6 unit testi çalıştırır (bkz. [Testler](#testler)).

**Frontend'i çalıştırın**

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışır.


## Test Kullanıcıları

| Kullanıcı adı | Şifre       | Rol |
|---------------|-------------|-----|
| `admin`       | `Admin1234` | `ADMIN` |
| `demo`        | `Demo1234`  | `USER`  |

Her iki kullanıcı da veritabanında BCrypt ile hashlenmiş şifreyle saklanır ve uygulama ilk açıldığında `DataSeeder` tarafından otomatik oluşturulur (zaten varlarsa tekrar oluşturulmaz — uygulamayı defalarca yeniden başlatmak güvenlidir).

## Mevcut Özellikler

- **Kimlik doğrulama:** Kullanıcı adı / şifre ile giriş (`POST /api/auth/login`), şifreler veritabanında BCrypt ile hashlenmiş tutulur.
- **JWT tabanlı oturum:** Başarılı girişte, içine kullanıcı adı ve rol bilgisi gömülü bir **access token** (`jwt.expiration.ms` — varsayılan 30 dakika) ile birlikte, sadece kullanıcı adını taşıyan bir **refresh token** (`jwt.refresh.expiration.ms` — varsayılan 7 gün) üretilir. Her iki token da payload içinde bir `type` claim'i (`access` / `refresh`) taşır. Token'lar frontend'de `localStorage`'da tutulur.
- **Token yenileme (refresh):** `POST /api/auth/refresh`, gelen `refreshToken`'ın türünün gerçekten `"refresh"` olduğunu ve kullanıcının hâlâ var/aktif olduğunu doğruladıktan sonra yeni bir access + refresh token çifti üretir.
- **Merkezi Spring Security filter zinciri:** `SecurityConfig`, hangi endpoint'e kimin girebileceğine tek yerden karar verir (`/api/auth/**` herkese açık, `/api/logs/**` ve `/api/admin/users/**` sadece `ADMIN`, geri kalan her şey sadece giriş yapmış olmayı gerektirir). `JwtFilter` her istekte token'ı okuyup `SecurityContext`'i doldurur; token yoksa/geçersizse `UnauthorizedHandle` (401), token geçerli ama rol yetmiyorsa `ForbiddenHandler` (403) devreye girer.
- **Brute-force / rate limiting koruması:** Aynı kullanıcı adına son 15 dakika içinde 5'ten fazla başarısız giriş denemesi yapılırsa hesap geçici olarak kilitlenir, yeni denemeler `"Çok fazla başarısız deneme yapıldı..."` mesajıyla reddedilir (`LoginService.login`).
- **Oturum kayıtları (audit log):** Her giriş denemesi (`LOGIN_SUCCESS`, `LOGIN_FAILED_INVALID_CREDENTIALS`, `LOGIN_FAILED_INACTIVE_ACCOUNT`, `LOGIN_BLOCKED_TOO_MANY_ATTEMPTS`) `user_logs` tablosuna kaydedilir. Dashboard'daki **Loglar** paneli bu kayıtları admin kullanıcılar için görüntüler, renkli durum rozetleriyle sunar.
- **Rol listesi:** Dashboard'daki **Roller** paneli, sistemdeki tüm rolleri (`GET /api/roles`) listeler.
- **Kullanıcı listesi:** Dashboard'daki **Kullanıcılar** paneli, sistemdeki tüm kullanıcıları (`GET /api/admin/users`) kullanıcı adı, ad-soyad ve rolleriyle birlikte listeler — sadece `ADMIN` rolüyle erişilebilir.
- **Alan doğrulama:** `@NotBlank` ile boş kullanıcı adı/şifre/refresh token istekleri reddedilir.
- **Merkezi hata yönetimi:** `GlobalExceptionHandler`, controller katmanında oluşan doğrulama hatalarını (400), eksik header'ları (400) ve beklenmeyen çalışma zamanı hatalarını (500) tek yerden yönetir; kullanıcıya asla stack trace gösterilmez. Bunlardan sadece **beklenmeyen (500) hatalar** `error_logs` tablosuna kaydedilir — validasyon/header hataları ile geçersiz giriş bilgisi gibi "beklenen" iş kuralı sonuçları `error_logs`'a yazılmaz. Geçersiz/süresi dolmuş token'lar ise `GlobalExceptionHandler`'dan bağımsız olarak, Spring Security filter zincirindeki `UnauthorizedHandler` (401) ve `ForbiddenHandler` (403) tarafından karşılanır; bunlar da `error_logs`'a kayıt atmaz.
- **Otomatik oturum devamlılığı:** Token süresi dolmadıysa, giriş sayfasına tekrar gelen kullanıcı otomatik olarak dashboard'a yönlendirilir.
- **Kurumsal, sade arayüz tasarımı** (Tailwind v4 + shadcn/ui + Framer Motion geçişleri).

## Testler

`LoginService` için Mockito ile izole edilmiş 6 unit test yazıldı (`backend/src/test/java/com/smartspirit/service/LoginServiceTest.java`):

1. **`shouldLoginSuccessfully`** — Doğru kullanıcı adı/şifre ile giriş yapıldığında access + refresh token üretildiğini ve girişin `user_logs`'a kaydedildiğini doğrular.
2. **`shouldRejectInvalidPassword`** — Yanlış şifreyle girişin reddedildiğini ve yine de loglandığını doğrular.
3. **`shouldRejectUnknownUser`** — Var olmayan kullanıcı adıyla girişin reddedildiğini doğrular.
4. **`shouldRefreshTokenSuccessfully`** — Geçerli bir refresh token ile yeni access + refresh token üretildiğini doğrular.
5. **`shouldRejectInvalidOrExpiredRefreshToken`** — Geçersiz/süresi dolmuş refresh token'ın reddedildiğini doğrular.
6. **`shouldRejectRefreshWhenUserNotFoundOrInactive`** — Refresh token'daki kullanıcı artık yoksa/aktif değilse isteğin reddedildiğini doğrular.

Bu testlerde `UserRepository`, `PasswordEncoder`, `JwtUtil` ve `UserLogRepository` `@Mock` ile sahtelenir; böylece gerçek bir veritabanı veya JWT imzalama işlemine ihtiyaç duymadan sadece `LoginService`'in iş mantığı doğrulanır.

## Bilinen Sınırlamalar / Kapsam Dışı Bırakılanlar

- **Sunucu tarafında refresh token iptali (revocation) yok.** Refresh token'lar stateless JWT olduğu için bir kara listeye alınmıyor; çalınan bir refresh token, süresi (7 gün) dolana kadar geçerliliğini korur.
- **Sunucu tarafında access token iptali (logout) yok.** JWT stateless olduğu için "logout" sadece `localStorage`'ı temizler.
- **Şifre sıfırlama akışı yok.**
- **Pagination yok.** `/api/logs` her zaman en yeni 100 kaydı döner.
- **Kullanıcı düzenleme/silme yok.** Kullanıcılar paneli şu an salt okunur listeleme yapıyor; aktif/pasif yapma veya bilgi düzenleme gibi aksiyonlar henüz eklenmedi.