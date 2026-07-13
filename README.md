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
      LoginRepository.java        # User için (findByUsername, findAll)
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
      GlobalExceptionHandler.java # tüm hataları tek yerden yönetir, beklenmeyen hataları error_logs'a kaydeder
    security/
      JwtFilter.java              # her istekte Authorization header'ını okuyup SecurityContext'i doldurur
      UnauthorizedHandle.java     # token yok/geçersiz → 401
      ForbiddenHandler.java       # token geçerli ama rol yetmiyor → 403
    config/
      SecurityConfig.java         # tüm HTTP güvenlik kuralları + CORS tek yerden burada
      DataSeeder.java             # ilk açılışta admin/1234 (ADMIN) ve demo/1234 (USER) kullanıcılarını oluşturur
    util/
      JwtUtil.java                # access + refresh token üretimi, token tipi/username/role çıkarımı
  src/test/java/com/smartspirit/
    service/
      LoginServiceTest.java       # LoginService için 6 unit test (Mockito ile izole)
  src/main/resources/
    application.properties

frontend/
  src/
    pages/
      LoginPages.jsx     # giriş formu + "token hâlâ geçerliyse otomatik dashboard'a yönlendir"
      Dashboard.jsx       # modül kartları + genişleyen Loglar / Roller / Kullanıcılar panelleri
    components/
      SmartSpiritLogo.jsx
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

Bu komut `src/test/java/com/smartspirit/service/LoginServiceTest.java` içindeki 6 unit testi çalıştırır (bkz. [Testler](#testler)).

### 6. Frontend'i çalıştırın

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışır.

> **Not:** Vite, 5173 portu doluysa otomatik olarak 5174'e geçer. Bu durumda backend'in CORS ayarında (`SecurityConfig.corsConfigurationSource()`) sadece 5173 tanımlıysa istekler CORS hatasıyla reddedilir. Böyle bir hata alırsanız ya açık kalan eski `npm run dev` sürecini kapatıp 5173'ü boşaltın, ya da `SecurityConfig` içindeki `setAllowedOrigins` listesine `http://localhost:5174`'ü de ekleyin.

## Test Kullanıcıları

| Kullanıcı adı | Şifre | Rol |
|---------------|-------|-----|
| `admin`       | `1234` | `ADMIN` |
| `demo`        | `1234` | `USER`  |

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
- **Merkezi hata yönetimi:** `GlobalExceptionHandler` doğrulama hatalarını, eksik header'ları, geçersiz token'ları ve beklenmeyen hataları tek yerden yönetir; kullanıcıya asla stack trace gösterilmez, beklenmeyen hatalar ayrıca `error_logs` tablosuna kaydedilir.
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

Bu testlerde `LoginRepository`, `PasswordEncoder`, `JwtUtil` ve `UserLogRepository` `@Mock` ile sahtelenir; böylece gerçek bir veritabanı veya JWT imzalama işlemine ihtiyaç duymadan sadece `LoginService`'in iş mantığı doğrulanır.

## Bilinen Sınırlamalar / Kapsam Dışı Bırakılanlar

- **Sunucu tarafında refresh token iptali (revocation) yok.** Refresh token'lar stateless JWT olduğu için bir kara listeye alınmıyor; çalınan bir refresh token, süresi (7 gün) dolana kadar geçerliliğini korur.
- **Sunucu tarafında access token iptali (logout) yok.** JWT stateless olduğu için "logout" sadece `localStorage`'ı temizler.
- **Şifre sıfırlama akışı yok.**
- **Pagination yok.** `/api/logs` her zaman en yeni 100 kaydı döner.
- **Kullanıcı düzenleme/silme yok.** Kullanıcılar paneli şu an salt okunur listeleme yapıyor; aktif/pasif yapma veya bilgi düzenleme gibi aksiyonlar henüz eklenmedi.
 sağlar.