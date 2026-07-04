# Smart Spirit - Login Page

React tabanlı kullanıcı arayüzü ile Spring Boot REST API'sinin entegre edildiği, PostgreSQL veritabanı destekli giriş sistemi.

## Teknoloji Yığını

**Backend**
- Java 17, Spring Boot 3.5
- Spring Data JPA (PostgreSQL)
- Spring Validation (`spring-boot-starter-validation`)
- `spring-security-crypto` — sadece BCrypt şifreleme için
- JJWT 0.11.5 — JWT token üretimi
- Lombok
- Maven

**Frontend**
- React 19 + Vite
- Tailwind CSS v4
- shadcn/ui (Radix UI tabanlı bileşenler)
- Framer Motion (`motion`)
- Axios
- React Router

## Proje Yapısı

```
backend/
  src/main/java/com/smartspirit/
    controller/     # LoginController, UserProfileController
    service/        # LoginService
    repository/     # LoginRepository
    entity/         # User, Role, UserLog, SystemError
    dto/            # LoginRequest, LoginResponse, UserProfileResponse
    config/         # SecurityConfig (PasswordEncoder bean'i)
    JwtUtil.java     # JWT üretimi ve doğrulaması
  src/main/resources/
    application.properties

frontend/
  src/
    pages/          # LoginPages.jsx, Dashboard.jsx
    components/     # SmartSpiritLogo.jsx, ui/ (shadcn bileşenleri)
    lib/            # utils.js
```

## Kurulum ve Çalıştırma
- Gereksinimler

Projeyi çalıştırmadan önce aşağıdaki yazılımların bilgisayarınıza kurulu olması gerekmektedir.

- Yazılım	Sürüm	İndirme Bağlantısı
- Java	17 veya üzeri	https://adoptium.net/
- Node.js	18 veya üzeri	https://nodejs.org/
- PostgreSQL	15 veya üzeri	https://www.postgresql.org/download/
- Maven	İsteğe bağlı (Projede Maven Wrapper bulunduğu için ayrıca kurmanız gerekmez.)	https://maven.apache.org/download.cgi
- Projeyi İndirme

Git yüklüyse aşağıdaki komut ile projeyi bilgisayarınıza indirebilirsiniz.

- git clone https://github.com/KULLANICI_ADIN/smart-spirit-login.git

cd smart-spirit-login

KULLANICI_ADIN kısmını GitHub kullanıcı adınız ile değiştirin.

## Veritabanı Oluşturma

PostgreSQL üzerinde aşağıdaki komutu çalıştırarak veritabanını oluşturun.

CREATE DATABASE smartspirit;

Uygulama ilk çalıştığında tablolar Hibernate tarafından otomatik olarak oluşturulacaktır (spring.jpa.hibernate.ddl-auto=update).

## Windows (Komut İstemi)
set DB_PASSWORD=postgres_sifreniz
- Windows (PowerShell)
$env:DB_PASSWORD="postgres_sifreniz"
- Linux / macOS
export DB_PASSWORD=postgres_sifreniz
- 
## Backend'i Çalıştırma
```bash
- cd backend
- ./mvnw spring-boot:run

Windows kullanıyorsanız:

- cd backend
- mvnw.cmd spring-boot:run

Backend varsayılan olarak aşağıdaki adreste çalışacaktır:

http://localhost:8080
## Frontend'i Çalıştırma
```bash
- cd frontend
- npm install
- npm run dev

Frontend varsayılan olarak aşağıdaki adreste çalışacaktır:

http://localhost:5173
### Veritabanı
```sql
CREATE DATABASE smartspirit;
```
Uygulama `spring.jpa.hibernate.ddl-auto=update` ile tabloları otomatik oluşturur, ayrıca manuel şema yönetimine gerek yoktur.

## Ortam Değişkenleri

| Değişken      | Açıklama                          |
|---------------|------------------------------------|
| `DB_PASSWORD` | PostgreSQL veritabanı şifresi      |


## Mevcut Özellikler

- Kullanıcı adı / şifre ile giriş (`POST /api/auth/login`)
- Şifreler veritabanında **BCrypt** ile hashlenmiş şekilde tutulur
- Girişte alan doğrulama (`@NotBlank`) — boş kullanıcı adı/şifre isteği reddedilir
- Başarılı girişte JWT token üretilip response içinde döner
- Kurumsal, sade arayüz tasarımı ( Tailwind v4 + shadcn/ui)

## Bilinen Sınırlamalar / Kapsam Dışı Bırakılanlar

- **JWT sadece üretiliyor, doğrulanmıyor.** Token login sonrası döner ama henüz hiçbir endpoint'i korumuyor (Spring Security filter zinciri kurulmadı). Bu yüzden `/api/auth/login` dışındaki endpoint'ler (ör. `UserProfileController`) şu an token gerektirmeden erişilebilir durumda.
- Refresh token akışı yok (`jwt.refresh.expiration.ms` tanımlı ama kullanılmıyor).
- Kayıt (signup) akışı yok; test kullanıcısı veritabanına manuel eklenmelidir.
- Şifre sıfırlama / "şifremi unuttum" akışı henüz yok.

## Geliştirme Notları

- Backend'de `spring-boot-starter-security` yerine sadece `spring-security-crypto` bağımlılığı kullanıldı; amaç yalnızca BCrypt encoder'a erişmekti, tam Spring Security filter zincirini (ve beraberinde gelen CORS yapılandırma karmaşasını) şimdilik devreye almamaktı.
- Frontend başlangıçta Create React App ile başlatılıp sonradan daha güncel olan Vite'a taşındı.