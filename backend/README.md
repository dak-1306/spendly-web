# backend 
## Cây thư mục
backend/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│
│   ├── models/
│   │   ├── User.js
│   │   ├── Expense.js
│   │   └── Category.js
│
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── expense.routes.js
│   │   └── ai.routes.js
│
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── expense.controller.js
│   │   └── ai.controller.js
│
│   ├── services/
│   │   └── ai.service.js
│
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│
│   ├── utils/
│   │   └── promptBuilder.js
│
│   └── app.js
│
├── .env
├── package.json
└── README.md
