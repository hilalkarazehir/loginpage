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

### Ön koşullar
- Java 17+
- Node.js 18+
- PostgreSQL (yerelde çalışıyor olmalı)

### Veritabanı
```sql
CREATE DATABASE smartspirit;
```
Uygulama `spring.jpa.hibernate.ddl-auto=update` ile tabloları otomatik oluşturur, ayrıca manuel şema yönetimine gerek yoktur.

### Backend
```bash
cd backend
# DB şifresini ortam değişkeni olarak ver
export DB_PASSWORD=senin_postgres_sifren
./mvnw spring-boot:run
```
Varsayılan port: `8080`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Varsayılan port: `5173`

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