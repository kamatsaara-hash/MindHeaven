import requests
try:
    r = requests.get("http://localhost:8000/api/posts")
    print(r.status_code)
    print(r.text)
except Exception as e:
    print(e)
