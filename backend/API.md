# domen.moe/api/returngame
```json
"send":
{
    "id": 123123123,
    "matrix": [[]],
    "size":
}

"back":
{
    "done": 1 ?? 0,
    "error?": ""
}
```

# domen.moe/api/generate
```json
"send":
{
    "id": 123123123,
    "difficulty": 1 - 6, // 6 Пользовательский
    "size": 2 - 5,
},

"back":
{
    "matrix": [[]],
    "error?": ""
}
```

# domen.moe/api/change
```json
"send":
{
    "coordinates": [x, y],
    "number": 4,
},

"back":
{
    "done": 0 ?? 1,
    "error?": ""
}
```
