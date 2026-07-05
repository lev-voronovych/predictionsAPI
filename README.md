# Prediction API

Локальна адреса:

http://localhost:3067

## Отримати всі передбачення

GET /predictions

### Відповідь

```json
[
  {
    "id": 1,
    "title": "Успіх",
    "text": "Сьогодні тобі пощастить.",
    "image": "https://picsum.photos/600/400?random=1"
  }
]
```

---

## Отримати випадкове передбачення

GET /predictions/random

### Відповідь

```json
{
  "id": 2,
  "title": "Кохання",
  "text": "Попереду приємне знайомство.",
  "image": "https://picsum.photos/600/400?random=2"
}
```

---

## Отримати передбачення за ID

GET /predictions/:id

### Приклад

GET /predictions/1

### Відповідь

```json
{
  "id": 1,
  "title": "Успіх",
  "text": "Сьогодні тобі пощастить.",
  "image": "https://picsum.photos/600/400?random=1"
}
```

---

## Додати передбачення

POST /predictions

### Headers

```http
Content-Type: application/json
```

### Body

```json
{
  "title": "Навчання",
  "text": "Ти швидко вивчиш нову технологію.",
  "image": "https://picsum.photos/600/400?random=5"
}
```

### Відповідь

```json
{
  "message": "Передбачення додано!",
  "prediction": {
    "id": 5,
    "title": "Навчання",
    "text": "Ти швидко вивчиш нову технологію.",
    "image": "https://picsum.photos/600/400?random=5"
  }
}
```

---

## Оновити передбачення

PUT /predictions/:id

### Body

```json
{
  "title": "Новий заголовок",
  "text": "Новий текст",
  "image": "https://picsum.photos/600/400?random=10"
}
```

---

## Видалити передбачення

DELETE /predictions/:id

### Приклад

DELETE /predictions/3

### Відповідь

```json
{
  "message": "Передбачення видалено!"
}
```

---

## Формат об'єкта

Кожне передбачення має таку структуру:

```json
{
  "id": 1,
  "title": "Успіх",
  "text": "Сьогодні тобі пощастить.",
  "image": "https://picsum.photos/600/400?random=1"
}
```

| Поле  | Тип    | Опис                     |
| ----- | ------ | ------------------------ |
| id    | number | Унікальний ідентифікатор |
| title | string | Заголовок передбачення   |
| text  | string | Текст передбачення       |
| image | string | URL зображення           |
