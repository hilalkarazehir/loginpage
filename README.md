# Smart Spirit — Login & Dashboard

React tabanlı kullanıcı arayüzü ile Spring Boot REST API'sinin entegre edildiği, PostgreSQL veritabanı destekli, JWT ile korunan giriş ve yönetim paneli sistemi.

## Teknoloji Yığını

**Backend**

- Java 17, Spring Boot 3.5
- Spring Data JPA (PostgreSQL)
- Spring Validation (`spring-boot-starter-validation`)
- `spring-security-crypto` — sadece BCrypt şifreleme için (tam Spring Security filter zinciri kullanılmıyor)
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

## Proje Yapısı

```
backend/
  src/main/java/com/smartspirit/
    controller/
      LoginController.java        # POST /api/auth/login, POST /api/auth/refresh, GET /api/auth/validate
      UserProfileController.java  # GET /api/users/profile  (JWT doğrulama)
      LogController.java          # GET /api/logs           (JWT + ADMIN rol kontrolü)
    service/
      LoginService.java           # login + refreshToken iş mantığı, her denemeyi user_logs'a kaydeder
    repository/
      LoginRepository.java        # User için (findByUsername)
      RoleRepository.java         # Role için (findByName)
      UserLogRepository.java      # UserLog için (findAllByOrderByCreatedDateDesc)
      SystemErrorRepository.java  # SystemError için
    entity/
      User.java, Role.java, UserLog.java, SystemError.java
    dto/
      LoginRequest.java, LoginResponse.java   # LoginResponse artık refreshToken alanı da içeriyor
      RefreshTokenRequest.java                # POST /api/auth/refresh isteği gövdesi
      UserProfileResponse.java, LogEntryResponse.java
      ErrorResponse.java
    exception/
      GlobalExceptionHandler.java # tüm hataları tek merkezden yönetir
      InvalidTokenException.java
    config/
      SecurityConfig.java         # PasswordEncoder (BCrypt) bean'i
      AdminSeeder.java            # ilk açılışta admin/1234 kullanıcısını otomatik oluşturur
    util/
      JwtUtil.java                # access + refresh token üretimi, token tipi/username/role çıkarımı
  src/test/java/com/smartspirit/
    service/
      LoginServiceTest.java       # LoginService için 3 unit test (Mockito ile izole)
  src/main/resources/
    application.properties

frontend/
  src/
    pages/
      LoginPages.jsx   # giriş formu + "token hâlâ geçerliyse otomatik dashboard'a yönlendir"
      Dashboard.jsx    # modül kartları + genişleyen "Loglar" paneli
    components/
      SmartSpiritLogo.jsx, ui/ (shadcn bileşenleri)
    lib/
      utils.js
```

## Kurulum ve Çalıştırma

### Gereksinimler

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

### 2. Veritabanını oluşturun

PostgreSQL'de aşağıdaki komutu çalıştırın:

```sql
CREATE DATABASE smartspirit;
```

Tablolar uygulama ilk çalıştığında Hibernate tarafından otomatik oluşturulur (`spring.jpa.hibernate.ddl-auto=update`).

### 3. Ortam değişkenlerini ayarlayın

Uygulama iki hassas değeri kod içine yazmak yerine ortam değişkeninden okur:

| Değişken     | Açıklama |
|--------------|----------|
| `DB_PASSWORD` | PostgreSQL veritabanı şifreniz |
| `JWT_SECRET`  | JWT imzalama anahtarı (en az 32 karakter, rastgele bir metin) |

**Windows (PowerShell)**

```powershell
$env:DB_PASSWORD="postgres_sifreniz"
$env:JWT_SECRET="jwt_secret_key"
```

**Windows (Komut İstemi)**

```cmd
set DB_PASSWORD=postgres_sifreniz
set JWT_SECRET=jwt_secret_key
```

**Linux / macOS**

```bash
export DB_PASSWORD=postgres_sifreniz
export JWT_SECRET=jwt_secret_key
```

> `JWT_SECRET` için yukarıdaki örnek değeri aynen kullanabilirsiniz veya kendi rastgele metninizi üretebilirsiniz — önemli olan en az 32 karakter uzunluğunda olması (HS256 imzalama algoritmasının gereksinimi).

### 4. Backend'i çalıştırın

```bash
cd backend
./mvnw spring-boot:run
```

Windows kullanıyorsanız:

```cmd
cd backend
mvnw.cmd spring-boot:run
```

Backend `http://localhost:8080` adresinde ayağa kalkar.

### 5. Testleri çalıştırın

```bash
cd backend
./mvnw test
```

Windows kullanıyorsanız:

```cmd
cd backend
mvnw.cmd test
```

Bu komut `src/test/java/com/smartspirit/service/LoginServiceTest.java` içindeki 3 unit testi çalıştırır (bkz. [Testler](#testler)).

### 6. Frontend'i çalıştırın

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışır.

## Test Kullanıcısı

| Kullanıcı adı | Şifre | Rol |
|---------------|-------|-----|
| `admin`       | `1234` | `ADMIN` |

Bu kullanıcı veritabanında BCrypt ile hashlenmiş olarak saklanır.

## Mevcut Özellikler

- **Kimlik doğrulama:** Kullanıcı adı / şifre ile giriş (`POST /api/auth/login`), şifreler veritabanında BCrypt ile hashlenmiş tutulur.
- **JWT tabanlı oturum:** Başarılı girişte, içine kullanıcı adı ve rol bilgisi gömülü bir **access token** (`jwt.expiration.ms` — varsayılan 30 dakika) ile birlikte, sadece kullanıcı adını taşıyan bir **refresh token** (`jwt.refresh.expiration.ms` — varsayılan 7 gün) üretilir. Her iki token da payload içinde bir `type` claim'i (`access` / `refresh`) taşır; bu sayede bir refresh token'ın yanlışlıkla access token yerine kullanılması engellenir. Token'lar frontend'de `localStorage`'da tutulur.
- **Token yenileme (refresh):** `POST /api/auth/refresh` endpoint'i, gövdede gelen `refreshToken`'ın türünün gerçekten `"refresh"` olduğunu (`JwtUtil.isRefreshToken`) ve kullanıcının hâlâ var/aktif olduğunu doğruladıktan sonra yeni bir access + refresh token çifti üretir. Refresh token geçersiz, süresi dolmuş veya yanlış türdeyse `401` döner.
- **Token doğrulama:** `GET /api/auth/validate` ve `GET /api/users/profile` endpoint'leri, gelen `Authorization: Bearer <token>` başlığındaki token'ı doğrular; geçersiz/süresi dolmuş token `401` ile reddedilir.
- **Rol tabanlı yetkilendirme:** `GET /api/logs` endpoint'i, sadece rolü `ADMIN` olan kullanıcılara açıktır; token'daki `role` claim'i kontrol edilerek uygulanır.
- **Oturum kayıtları (audit log):** Her giriş denemesi (`LOGIN_SUCCESS`, `LOGIN_FAILED_INVALID_CREDENTIALS`, `LOGIN_FAILED_INACTIVE_ACCOUNT`) `user_logs` tablosuna kaydedilir. Dashboard'daki "Loglar" kartı bu kayıtları admin kullanıcılar için görüntüler, renkli durum rozetleriyle (başarılı/başarısız/pasif hesap) sunar.
- **Alan doğrulama:** `@NotBlank` ile boş kullanıcı adı/şifre/refresh token istekleri reddedilir.
- **Merkezi hata yönetimi:** `GlobalExceptionHandler` doğrulama hatalarını, eksik header'ları, geçersiz token'ları ve beklenmeyen hataları tek yerden yönetir; kullanıcıya asla stack trace gösterilmez, beklenmeyen hatalar ayrıca `error_logs` tablosuna kaydedilir.
- **Otomatik oturum devamlılığı:** Token süresi dolmadıysa, giriş sayfasına tekrar gelen kullanıcı otomatik olarak dashboard'a yönlendirilir (şifre tekrar sorulmaz).
- **Otomatik test kullanıcısı:** `AdminSeeder`, uygulama her başladığında `admin`/`1234` kullanıcısının var olduğundan emin olur — elle veri girişine gerek bırakmaz.
- **Kurumsal, sade arayüz tasarımı** (Tailwind v4 + shadcn/ui + Framer Motion geçişleri).

## Testler

`LoginService` için Mockito ile izole edilmiş 3 unit test yazıldı (`backend/src/test/java/com/smartspirit/service/LoginServiceTest.java`):

1. **`shouldLoginSuccessfully`** — Doğru kullanıcı adı/şifre ile giriş yapıldığında access + refresh token üretildiğini, dönen `LoginResponse`'un `success=true` olduğunu ve girişin `user_logs`'a kaydedildiğini doğrular.
2. **`shouldRejectInvalidPassword`** — Var olan bir kullanıcı yanlış şifreyle giriş yapmaya çalıştığında isteğin reddedildiğini (`"Kullanıcı adı veya şifre hatalı"`) ve yine de bir log kaydı oluşturulduğunu doğrular.
3. **`shouldRejectUnknownUser`** — Veritabanında bulunmayan bir kullanıcı adıyla giriş denendiğinde isteğin reddedildiğini ve denemenin loglandığını doğrular.

Bu testlerde `LoginRepository`, `PasswordEncoder`, `JwtUtil` ve `UserLogRepository` `@Mock` ile sahtelenir; böylece testler gerçek bir veritabanı veya JWT imzalama işlemine ihtiyaç duymadan sadece `LoginService`'in iş mantığını doğrular.

## Bilinen Sınırlamalar / Kapsam Dışı Bırakılanlar

- **Merkezi bir Spring Security filter zinciri yok.** Her korumalı controller (`UserProfileController`, `LogController`) kendi içinde `Authorization` header'ını elle okuyup `JwtUtil` ile doğruluyor. Bilinçli bir tercih — `spring-boot-starter-security`'nin otomatik filter zinciri önceki denemelerde CORS yapılandırmasıyla çakışmıştı. Dezavantajı: yeni bir korumalı endpoint eklendikçe aynı doğrulama bloğu tekrar ediyor.
- **Sunucu tarafında refresh token iptali (revocation) yok.** Refresh token'lar stateless JWT olduğu için bir kara listeye (blacklist/deny-list) alınmıyor; çalınan bir refresh token, süresi (7 gün) dolana kadar geçerliliğini korur. Gerçek bir üretim sisteminde refresh token'ların veritabanında saklanıp tek kullanımlık (rotation) yapılması ve iptal edilebilmesi beklenir.
- **Sunucu tarafında access token iptali (logout) yok.** JWT stateless olduğu için "logout" sadece `localStorage`'ı temizler; token teknik olarak süresi dolana kadar geçerliliğini korur.
- **Brute-force koruması yok.** Art arda yanlış şifre denemelerini engelleyen bir rate-limit veya hesap kilitleme mekanizması yok.
- **Şifre sıfırlama akışı yok.**
- **Pagination yok.** `/api/logs` her zaman en yeni 100 kaydı döner; log sayısı arttıkça bu sabit sınır yetersiz kalabilir.
- **Kullanıcı/Rol yönetim ekranı yok.** Dashboard'daki "Roller" ve "Kullanıcılar" kartları bu yüzden şu an "Yakında" durumunda.
- **Test kapsamı sınırlı.** Şu an sadece `LoginService` için 3 unit test var; controller (`LoginController`, `LogController`, `UserProfileController`) katmanı için ` ve `JwtUtil` için ayrı unit testler henüz eklenmedi.

## Geliştirme Notları

- Backend'de `spring-boot-starter-security` yerine sadece `spring-security-crypto` bağımlılığı kullanıldı; amaç yalnızca BCrypt encoder'a erişmekti, tam Spring Security filter zincirini (ve beraberinde gelen CORS yapılandırma karmaşasını) şimdilik devreye almamaktı.
- JWT tasarımı, access ve refresh token'ları birbirinden ayırmak için her iki token'ın payload'ına bir `type` (`access` / `refresh`) claim'i ekler; `JwtUtil.isRefreshToken` bu claim'i kontrol ederek bir access token'ın refresh endpoint'inde kullanılmasını engeller.
- Frontend başlangıçta Create React App ile başlatılıp sonradan daha güncel olan Vite'a taşındı.
- `jwt.secret` ve `spring.datasource.password` kaynak koda gömülmek yerine ortam değişkeninden okunur.
- `AdminSeeder`, Spring context tamamen ayağa kalktıktan sonra çalışır; admin kullanıcısı zaten varsa hiçbir işlem yapmaz, bu yüzden uygulamayı defalarca yeniden başlatmak güvenlidir (yinelenen kayıt oluşturmaz).
- `LoginService` test edilebilirlik gözetilerek yazıldı: bağımlılıkları (`LoginRepository`, `PasswordEncoder`, `JwtUtil`, `UserLogRepository`) constructor injection ile alır, bu da Mockito ile kolayca sahtelenmesini (mock) sağlar.