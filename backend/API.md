# domen.moe/api/numsol
```json
"SEND":
{
    "size": ( 2 - 5 ),
    "matrix": [[...]]
}

"GET":
{
    "sol": ( 0 - 101 ), // 0 - 100, +100 (больше 100 решений)
    "error?": "Error msg"
}
```

# domen.moe/api/generate
```json
"send":
{
    "diff": ( 1 - 5 ), 
    "size": ( 2 - 5 )
},

"back":
{
    "matrix": [[...]],
    "error?": "Error msg"
}
```