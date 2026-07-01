# Smart Spirit AI

React tabanlı kullanıcı arayüzü ile Spring Boot REST API'sinin entegre edildiği, PostgreSQL veritabanı destekli giriş sistemi.

## Teknoloji Yığını

### Frontend
- **React 19** — UI kütüphanesi
- **Vite** — build/dev sunucusu (proje başlangıçta Create React App ile kurulmuş, sonradan Vite'a taşınmıştır)
- **React Router DOM** — sayfa yönlendirme
- **Axios** — backend ile HTTP iletişimi

### Backend
- **Java 17**
- **Spring Boot 3.5.15**
- **Spring Data JPA** — veritabanı ORM
- **PostgreSQL** — veritabanı
- **Lombok** — boilerplate kod azaltma

## Proje Yapısı

```
login-page-project/
├── backend/          # Spring Boot API
│   └── src/main/java/com/smartspirit/api/
│       ├── controller/   # REST endpoint'leri
│       ├── service/      # İş mantığı
│       ├── repository/   # Veritabanı erişimi
│       ├── entity/        # Veritabanı modelleri
│       └── dto/           # İstek/yanıt veri yapıları
└── frontend/         # React + Vite arayüzü
    └── src/
        ├── components/   # Yeniden kullanılabilir UI parçaları
        └── pages/         # Sayfa bileşenleri (Login, Dashboard)
```

## Kurulum ve Çalıştırma

### Gereksinimler
- Java 17+
- Node.js 18+
- PostgreSQL (local, `smartspirit` veritabanı önceden oluşturulmuş olmalı)

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

Varsayılan olarak `http://localhost:8080` adresinde çalışır.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Varsayılan olarak `http://localhost:3000` adresinde çalışır.


## Notlar

- Proje başlangıçta Create React App ile kurulmuş, geliştirme sürecinde Vite'a taşınmıştır.
